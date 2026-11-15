import { createClient } from 'npm:@supabase/supabase-js@2'

const SIGNED_URL_TTL_SECONDS = 60
const ALLOWED_ORIGINS = new Set([
  'https://nappygorilla.github.io',
  'http://localhost:5305',
  'http://127.0.0.1:5305',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '600',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  }
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers.Vary = 'Origin'
  }
  return headers
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) })
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'This origin is not allowed to request downloads.' }, 403, origin)
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }
  if (request.method !== 'POST') {
    return json({ error: 'Use POST to request a download.' }, 405, origin)
  }

  const authorization = request.headers.get('Authorization') ?? ''
  if (!authorization.startsWith('Bearer ')) {
    return json({ error: 'Sign in to download your products.' }, 401, origin)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('signed-download is missing its Supabase environment.')
    return json({ error: 'The download service is not configured.' }, 500, origin)
  }

  let payload: { productId?: unknown }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Send a productId in the request body.' }, 400, origin)
  }

  const productId = typeof payload.productId === 'string' ? payload.productId.trim() : ''
  if (!UUID_RE.test(productId)) {
    return json({ error: 'A valid productId is required.' }, 400, origin)
  }

  const token = authorization.slice('Bearer '.length).trim()
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || !authData.user) {
    return json({ error: 'Your session has expired. Sign in again to download.' }, 401, origin)
  }

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const now = new Date().toISOString()
  const { data: entitlement, error: entitlementError } = await service
    .from('user_entitlements')
    .select('id')
    .eq('user_id', authData.user.id)
    .eq('product_id', productId)
    .eq('status', 'active')
    .lte('starts_at', now)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (entitlementError) {
    console.error('Entitlement lookup failed', entitlementError)
    return json({ error: 'The download service could not check your licence.' }, 500, origin)
  }
  if (!entitlement) {
    return json({ error: 'An active licence for this product is required.' }, 403, origin)
  }

  const { data: product, error: productError } = await service
    .from('products')
    .select('id, name, slug, status')
    .eq('id', productId)
    .eq('status', 'published')
    .maybeSingle()

  if (productError) {
    console.error('Product lookup failed', productError)
    return json({ error: 'The download service could not read the product.' }, 500, origin)
  }
  if (!product) {
    return json({ error: 'This product is not available for download.' }, 404, origin)
  }

  const { data: release, error: releaseError } = await service
    .from('product_releases')
    .select('id, version, file_size_bytes, release_assets(storage_bucket, storage_path)')
    .eq('product_id', productId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (releaseError) {
    console.error('Release lookup failed', releaseError)
    return json({ error: 'The download service could not read the release.' }, 500, origin)
  }

  const assetValue = release?.release_assets
  const asset = Array.isArray(assetValue) ? assetValue[0] : assetValue
  if (!release || !asset?.storage_bucket || !asset?.storage_path) {
    return json({ error: 'No published release file is attached to this product yet.' }, 404, origin)
  }
  if (asset.storage_bucket !== 'product-releases') {
    console.error('Release asset points at an unexpected bucket', asset.storage_bucket)
    return json({ error: 'The release file is not in the private release bucket.' }, 500, origin)
  }

  const rawName = asset.storage_path.split('/').pop() || `${product.slug}-${release.version}.zip`
  const fileName = rawName.replace(/[^a-zA-Z0-9._-]+/g, '-')
  const { data: signed, error: signError } = await service.storage
    .from(asset.storage_bucket)
    .createSignedUrl(asset.storage_path, SIGNED_URL_TTL_SECONDS, { download: fileName })

  if (signError || !signed?.signedUrl) {
    console.error('Signed URL creation failed', signError)
    return json({ error: 'The release file could not be signed. Try again in a moment.' }, 500, origin)
  }

  return json({
    url: signed.signedUrl,
    fileName,
    version: release.version,
    product: product.name,
    expiresIn: SIGNED_URL_TTL_SECONDS,
  }, 200, origin)
})
