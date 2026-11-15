const CLIENT_TOKEN = (import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined)?.trim()
const ENVIRONMENT = (import.meta.env.VITE_PADDLE_ENVIRONMENT as string | undefined)?.trim().toLowerCase()
const SCRIPT_URL = 'https://cdn.paddle.com/paddle/v2/paddle.js'

/** The client-side token is public by design; the Paddle API key stays server-side. */
export const paddleConfigured = Boolean(CLIENT_TOKEN)

export type PaddleCheckoutEvent = {
  name?: string
  data?: { transaction_id?: string }
}

type PaddleApi = {
  Environment?: { set: (environment: string) => void }
  Initialize: (options: { token: string; eventCallback?: (event: PaddleCheckoutEvent) => void }) => void
  Checkout: {
    open: (options: {
      transactionId: string
      settings?: { displayMode?: 'overlay' | 'inline'; theme?: 'light' | 'dark'; locale?: string }
    }) => void
  }
}

declare global {
  interface Window {
    Paddle?: PaddleApi
  }
}

let scriptPromise: Promise<PaddleApi> | null = null
let initialized = false
let currentHandler: ((event: PaddleCheckoutEvent) => void) | null = null

function initialize(api: PaddleApi) {
  if (initialized || !CLIENT_TOKEN) return
  if (ENVIRONMENT === 'sandbox') api.Environment?.set('sandbox')
  api.Initialize({
    token: CLIENT_TOKEN,
    eventCallback: (event) => currentHandler?.(event),
  })
  initialized = true
}

function loadScript(): Promise<PaddleApi> {
  if (window.Paddle) return Promise.resolve(window.Paddle)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<PaddleApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-paddle-js]')
    const script = existing ?? document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.dataset.paddleJs = 'true'
    script.addEventListener('load', () => {
      if (window.Paddle) resolve(window.Paddle)
      else reject(new Error('Paddle.js did not expose its checkout API.'))
    }, { once: true })
    script.addEventListener('error', () => reject(new Error('Paddle.js could not be loaded.')), { once: true })
    if (!existing) document.head.appendChild(script)
  })

  return scriptPromise
}

/** Load Paddle.js and open the server-created transaction in Paddle Checkout. */
export async function openPaddleCheckout(
  transactionId: string,
  onEvent: (event: PaddleCheckoutEvent) => void,
): Promise<void> {
  if (!CLIENT_TOKEN) throw new Error('Paddle checkout is not configured on this build.')

  const api = await loadScript()
  currentHandler = onEvent
  initialize(api)
  api.Checkout.open({
    transactionId,
    settings: { displayMode: 'overlay', theme: 'dark', locale: 'en' },
  })
}
