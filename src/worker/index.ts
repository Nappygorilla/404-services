import { Hono } from 'hono'

import { validateSubscribe, type FieldErrors } from '../shared/validation'

// The Worker in front of the static site. The form routes validate input and
// return a reference; connect them to email, a CRM or a D1 table to keep the
// messages. Everything else falls through to the built assets, where this
// Worker is also the one place that sets Cache-Control.
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const invalid = (fieldErrors: FieldErrors) =>
  Response.json({ error: 'Please check the highlighted fields.', fieldErrors }, { status: 422 })
const badJson = () => Response.json({ error: 'Send a JSON object.' }, { status: 400 })

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/subscribe', async (c) => {
  const body = await readBody(c.req.raw)
  if (!body) return badJson()
  const errors = validateSubscribe(body)
  if (Object.keys(errors).length) return invalid(errors)
  return c.json({ ok: true }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

/*
  Asset caching. Workers assets default to `public, max-age=0, must-revalidate`,
  which revalidates every image and font on every visit. Because
  `run_worker_first` is on, every request passes through here, so this is the
  one place the policy needs to live.

  - /assets/* and /fonts/* carry a content hash in the filename, so they can be
    immutable for a year. Change the file, change the name.
  - /images/* are unhashed, so 30 days plus a week of stale-while-revalidate.
  - HTML and everything else revalidates, so a deploy is visible immediately.
*/
const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable'
const CACHE_IMAGES = 'public, max-age=2592000, stale-while-revalidate=604800'
const CACHE_HTML = 'no-cache, must-revalidate'

function cacheControl(pathname: string): string {
  if (pathname.startsWith('/assets/') || pathname.startsWith('/fonts/')) return CACHE_IMMUTABLE
  if (pathname.startsWith('/images/') || /\.(webp|png|jpe?g|svg|avif|gif|ico)$/i.test(pathname)) return CACHE_IMAGES
  if (pathname.startsWith('/api/')) return 'no-store'
  return CACHE_HTML
}

app.all('*', async (c) => {
  const res = await c.env.ASSETS.fetch(c.req.raw)
  if (res.status !== 200 || (c.req.method !== 'GET' && c.req.method !== 'HEAD')) return res
  const headers = new Headers(res.headers)
  headers.set('Cache-Control', cacheControl(new URL(c.req.url).pathname))
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
})

export default app
