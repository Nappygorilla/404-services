import { createClient } from 'npm:@supabase/supabase-js@2'

const MAX_SIGNATURE_AGE_SECONDS = 300
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type SignatureParts = { timestamp: string; signature: string }

type PaddleLineItem = {
  price_id?: string
  quantity?: number
  price?: { id?: string; unit_price?: { amount?: string } }
  unit_totals?: { subtotal?: string }
  totals?: { subtotal?: string }
}

type PaddleTransaction = {
  id?: string
  status?: string
  currency_code?: string
  billed_at?: string | null
  custom_data?: { user_id?: unknown } | null
  items?: PaddleLineItem[]
  details?: {
    line_items?: PaddleLineItem[]
    totals?: { subtotal?: string; tax?: string; total?: string }
  } | null
}

type PaddleEvent = {
  event_type?: string
  occurred_at?: string
  data?: PaddleTransaction
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function parseSignature(header: string): SignatureParts | null {
  let timestamp = ''
  let signature = ''
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    const key = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (key === 'ts') timestamp = value
    if (key === 'h1') signature = value
  }
  return timestamp && signature ? { timestamp, signature } : null
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

async function sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)))
  return Array.from(signature).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function verifyPaddleSignature(rawBody: string, header: string, secret: string): Promise<boolean> {
  const parts = parseSignature(header)
  if (!parts) return false

  const timestamp = Number(parts.timestamp)
  if (!Number.isInteger(timestamp)) return false

  const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp)
  if (age > MAX_SIGNATURE_AGE_SECONDS) return false

  const expected = await sign(secret, `${parts.timestamp}:${rawBody}`)
  return constantTimeEqual(expected, parts.signature.toLowerCase())
}

function amount(value: string | undefined): number {
  if (value === undefined) return Number.NaN
  return Number(value)
}

function lineItemUnitAmount(item: PaddleLineItem, quantity: number): number {
  const unitSubtotal = amount(item.unit_totals?.subtotal)
  if (Number.isFinite(unitSubtotal)) return Math.round(unitSubtotal)

  const unitPrice = amount(item.price?.unit_price?.amount)
  if (Number.isFinite(unitPrice)) return Math.round(unitPrice)

  const subtotal = amount(item.totals?.subtotal)
  if (Number.isFinite(subtotal) && quantity > 0) return Math.round(subtotal / quantity)

  return Number.NaN
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Use POST for Paddle webhooks.' }, 405)
  }

  const webhookSecret = Deno.env.get('PADDLE_WEBHOOK_SECRET')?.trim()
  if (!webhookSecret) {
    console.error('paddle-webhook is missing PADDLE_WEBHOOK_SECRET.')
    return json({ error: 'Webhook is not configured.' }, 500)
  }

  const signatureHeader = request.headers.get('Paddle-Signature')
  if (!signatureHeader) {
    return json({ error: 'Missing Paddle signature.' }, 401)
  }

  const rawBody = await request.text()
  if (!await verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)) {
    return json({ error: 'Invalid Paddle signature.' }, 401)
  }

  let event: PaddleEvent
  try {
    event = JSON.parse(rawBody) as PaddleEvent
  } catch {
    return json({ error: 'Invalid webhook body.' }, 400)
  }

  // Paddle sends other event types to a destination if they are subscribed.
  // This destination only grants access for completed transactions.
  if (event.event_type !== 'transaction.completed') {
    return json({ ok: true, ignored: event.event_type ?? 'unknown' }, 200)
  }

  const transaction = event.data
  if (!transaction?.id || !transaction.id.startsWith('txn_')) {
    return json({ error: 'The webhook has no transaction id.' }, 400)
  }

  const userId = typeof transaction.custom_data?.user_id === 'string'
    ? transaction.custom_data.user_id.trim()
    : ''
  if (!UUID_RE.test(userId)) {
    console.error('Paddle transaction has no valid user_id in custom_data', transaction.id)
    return json({ error: 'The transaction is not linked to a customer account.' }, 400)
  }

  const totals = transaction.details?.totals
  const subtotal = amount(totals?.subtotal)
  const tax = amount(totals?.tax)
  const total = amount(totals?.total)
  const currency = transaction.currency_code?.trim().toUpperCase() ?? ''

  if (!Number.isFinite(subtotal) || !Number.isFinite(tax) || !Number.isFinite(total) || !/^[A-Z]{3}$/.test(currency)) {
    console.error('Paddle transaction has incomplete totals', transaction.id)
    return json({ error: 'The transaction totals are incomplete.' }, 400)
  }

  const sourceItems = Array.isArray(transaction.details?.line_items)
    ? transaction.details.line_items
    : Array.isArray(transaction.items)
      ? transaction.items
      : []

  if (sourceItems.length === 0) {
    console.error('Paddle transaction has no line items', transaction.id)
    return json({ error: 'The transaction has no items.' }, 400)
  }

  const normalized = sourceItems.map((item) => {
    const priceId = typeof item.price_id === 'string'
      ? item.price_id
      : typeof item.price?.id === 'string'
        ? item.price.id
        : ''
    const quantity = Number(item.quantity ?? 1)
    const unitAmount = lineItemUnitAmount(item, quantity)
    return { priceId, quantity, unitAmount }
  })

  if (normalized.some((item) => !item.priceId || !Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.unitAmount) || item.unitAmount < 0)) {
    console.error('Paddle transaction has an invalid line item', transaction.id)
    return json({ error: 'The transaction has an invalid line item.' }, 400)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('paddle-webhook is missing its Supabase environment.')
    return json({ error: 'Webhook is not configured.' }, 500)
  }

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const priceIds = [...new Set(normalized.map((item) => item.priceId))]
  const { data: products, error: productError } = await service
    .from('products')
    .select('id, name, paddle_price_id')
    .in('paddle_price_id', priceIds)

  if (productError) {
    console.error('Paddle webhook product lookup failed', productError)
    return json({ error: 'Could not resolve the purchased products.' }, 500)
  }

  const productByPrice = new Map((products ?? []).map((product) => [product.paddle_price_id, product]))
  const items = normalized.map((item) => {
    const product = productByPrice.get(item.priceId)
    if (!product) return null
    return {
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_amount_minor: item.unitAmount,
    }
  })

  if (items.some((item) => item === null)) {
    console.error('Paddle webhook received an unmapped price', transaction.id)
    return json({ error: 'A purchased price is not mapped to a product.' }, 500)
  }

  const { data: orderId, error: fulfillmentError } = await service.rpc('fulfill_paddle_order', {
    p_provider_reference: transaction.id,
    p_user_id: userId,
    p_currency: currency,
    p_subtotal_minor: Math.round(subtotal),
    p_tax_minor: Math.round(tax),
    p_total_minor: Math.round(total),
    p_paid_at: transaction.billed_at ?? event.occurred_at ?? new Date().toISOString(),
    p_items: items,
  })

  if (fulfillmentError) {
    console.error('Paddle order fulfillment failed', transaction.id, fulfillmentError)
    return json({ error: 'The order could not be recorded.' }, 500)
  }

  return json({ ok: true, orderId }, 200)
})
