import { FunctionsHttpError } from '@supabase/supabase-js'

import { NOT_CONNECTED, supabase } from './supabase'

export type PaddleCheckout = {
  transactionId: string
  checkoutUrl: string
  product: { slug: string; name: string }
}

type Result = { data?: PaddleCheckout; error?: string }

/** Create a Paddle hosted checkout for the signed-in customer and one product. */
export async function createPaddleCheckout(productSlug: string): Promise<Result> {
  if (!supabase) return { error: NOT_CONNECTED }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Sign in before starting checkout.' }

  const { data, error } = await supabase.functions.invoke('paddle-checkout', {
    body: { productSlug },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = await error.context.json() as { error?: unknown }
        if (typeof payload.error === 'string' && payload.error.trim()) return { error: payload.error }
      } catch {
        // Fall through to the generic message if Paddle checkout is not deployed yet.
      }
    }
    return { error: 'Checkout could not be started. Try again in a moment.' }
  }

  if (
    !data ||
    typeof data.transactionId !== 'string' ||
    typeof data.checkoutUrl !== 'string' ||
    !data.checkoutUrl.startsWith('https://')
  ) {
    return { error: 'The checkout service did not return a Paddle link.' }
  }

  return { data: data as PaddleCheckout }
}
