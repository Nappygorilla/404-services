/**
 * Prefix a path from `public/` with the deployment base path, so one build works
 * both at the domain root and under a subpath such as `/404-services/` on GitHub Pages.
 * Absolute URLs (a hosted recording, a data URI) are returned untouched.
 */
export function asset(path: string): string {
  if (!path || path.startsWith('data:') || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path)) return path
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
