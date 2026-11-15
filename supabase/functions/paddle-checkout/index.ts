import { createClient } from 'npm:@supabase/supabase-js@2'

const ALLOWED_ORIGINS = new Set([
  'https://nappygorilla.github.io',
  'http://localhost:5305',
  'http://127.0.0.1:5305',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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

type PaddleTransaction = {
  id?: string
  checkout?: { url?: string | null } | null
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'This origin is not allowed to start checkout.' }, 403, origin)
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }
  if (request.method !== 'POST') {
    return json({ error: 'Use POST to start checkout.' }, 405, origin)
  }

  const authorization = request.headers.get('Authorization') ?? ''
  if (!authorization.startsWith('Bearer ')) {
    return json({ error: 'Sign in before starting checkout.' }, 401, origin)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const paddleApiKey = Deno.env.get('PADDLE_API_KEY')?.trim()
  const environment = (Deno.env.get('PADDLE_ENVIRONMENT') ?? 'production').trim().toLowerCase()

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('paddle-checkout is missing its Supabase environment.')
    return json({ error: 'Checkout is not configured.' }, 500, origin)
  }
  if (environment !== 'sandbox' && environment !== 'production') {
    console.error('PADDLE_ENVIRONMENT must be sandbox or production.')
    return json({ error: 'Checkout is not configured correctly.' }, 500, origin)
  }
  if (!paddleApiKey) {
    console.error('paddle-checkout is missing PADDLE_API_KEY.')
    return json({ error: 'Checkout is not connected yet.' }, 503, origin)
  }

  let payload: { productSlug?: unknown; productId?: unknown }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Send a productSlug in the request body.' }, 400, origin)
  }

  const requested =
    typeof payload.productSlug === 'string'
      ? payload.productSlug.trim()
      : typeof payload.productId === 'string'
        ? payload.productId.trim()
        : ''

  if (!SLUG_RE.test(requested) && !UUID_RE.test(requested)) {
    return json({ error: 'A valid productSlug is required.' }, 400, origin)
  }

  const token = authorization.slice('Bearer '.length).trim()
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || !authData.user) {
    return json({ error: 'Your session has expired. Sign in again to start checkout.' }, 401, origin)
  }

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let productQuery = service
    .from('products')
    .select('id, slug, name, paddle_price_id')
    .eq('status', 'published')

  productQuery = UUID_RE.test(requested)
    ? productQuery.eq('id', requested)
    : productQuery.eq('slug', requested)

  const { data: product, error: productError } = await productQuery.maybeSingle()
  if (productError) {
    console.error('Checkout product lookup failed', productError)
    return json({ error: 'The store could not read this product.' }, 500, origin)
  }
  if (!product) {
    return json({ error: 'This product is not available.' }, 404, origin)
  }
  if (!product.paddle_price_id) {
    return json({ error: 'Checkout is not configured for this product yet.' }, 503, origin)
  }

  const apiBase = environment === 'sandbox'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com'

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)

  let paddleResponse: Response
  try {
    paddleResponse = await fetch(`${apiBase}/transactions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
        'Paddle-Version': '1',
      },
      body: JSON.stringify({
        items: [{ price_id: product.paddle_price_id, quantity: 1 }],
        collection_mode: 'automatic',
        enable_checkout: true,
        custom_data: {
          user_id: authData.user.id,
          product_id: product.id,
          product_slug: product.slug,
        },
      }),
    })
  } catch (error) {
    console.error('Paddle transaction request failed', error)
    return json({ error: 'Paddle could not be reached. Try again in a moment.' }, 502, origin)
  } finally {
    clearTimeout(timeout)
  }

  const paddlePayload = await paddleResponse.json().catch(() => null) as {
    data?: PaddleTransaction
    error?: { code?: string; detail?: string }
  } | null

  if (!paddleResponse.ok || !paddlePayload?.data) {
    console.error('Paddle rejected the transaction', paddleResponse.status, paddlePayload?.error?.code)
    return json({ error: 'Paddle could not start this checkout. Try again in a moment.' }, 502, origin)
  }

  const transaction = paddlePayload.data
  const checkoutUrl = transaction.checkout?.url

  if (!transaction.id || !checkoutUrl || !checkoutUrl.startsWith('https://')) {
    console.error('Paddle returned a transaction without a checkout URL. Configure the default payment link in Paddle Checkout settings.')
    return json({ error: 'Paddle checkout is not ready for this store yet. Please contact support.' }, 503, origin)
  }

  return json({
    transactionId: transaction.id,
    checkoutUrl,
    product: { slug: product.slug, name: product.name },
  }, 200, origin)
})
