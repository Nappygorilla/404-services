import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Read the deploy base without requiring Node types in this file. Empty at the
// domain root; GitHub Pages sets VITE_BASE_PATH=/<repo>/ before building.
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env

const base = env?.VITE_BASE_PATH?.trim() || '/'

export default defineConfig({
  base: base.endsWith('/') ? base : `${base}/`,
  plugins: [react(), tailwindcss(), cloudflare()],
  server: { port: 5305, strictPort: false },
})
