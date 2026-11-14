import { Hono } from 'hono'

// The Worker serves the static site and its small API surface. Only the
// health endpoint is live; newsletter persistence, checkout and protected
// downloads remain disabled until their storage and server integrations exist.
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ ok: true }))

// Do not return success until a real persistence target is configured.
app.post('/api/subscribe', (c) =>
  c.json({ error: 'Newsletter sign-up is not connected yet.' }, 503),
)

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
