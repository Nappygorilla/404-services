// Cleans the build output, then writes the app shell into known route
// directories. GitHub Pages serves those paths with a 200 response instead of
// its 404.html fallback, which removes the document-404 that a direct deep link
// used to produce. Product slugs are read from the same data file as the site.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../', import.meta.url).pathname
const dist = join(root, 'dist')

function clean(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name.startsWith('.') || name.endsWith('.map')) {
      rmSync(path, { recursive: true, force: true })
      continue
    }
    if (statSync(path).isDirectory()) clean(path)
  }
}

clean(dist)

const client = join(dist, 'client')
const shell = join(client, 'index.html')

if (existsSync(shell)) {
  const source = readFileSync(join(root, 'src/data.ts'), 'utf8')
  const toolsBlock = source.slice(source.indexOf('export const TOOLS'), source.indexOf('export const BUNDLE'))
  const toolSlugs = [...toolsBlock.matchAll(/^\s*slug: '([^']+)'/gm)].map((match) => match[1])
  const bundleSlug = source.match(/export const BUNDLE: BundleProduct = \{\s*slug: '([^']+)'/m)?.[1]

  const routes = [
    'store',
    'checkout',
    'pricing',
    'licence',
    'support',
    'games',
    'orders',
    'downloads',
    'account',
    'account/profile',
    'account/security',
    'account/tickets',
    'account/licenses',
    'forums',
    'forums/announcements',
    'forums/issues',
    'terms',
    'refunds',
    'privacy',
    'changelog',
    'status',
    'docs',
    'login',
    'register',
  ]

  const productRoutes = [...toolSlugs, ...(bundleSlug ? [bundleSlug] : [])].map((slug) => `products/${slug}`)
  for (const route of [...routes, ...productRoutes]) {
    const dir = join(client, route)
    mkdirSync(dir, { recursive: true })
    copyFileSync(shell, join(dir, 'index.html'))
  }
}
