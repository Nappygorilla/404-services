import { FunctionsHttpError } from '@supabase/supabase-js'

import { NOT_CONNECTED, supabase } from './supabase'

export type DownloadLink = {
  url: string
  fileName: string
  version: string
  product: string
  expiresIn: number
}

type Result = { data?: DownloadLink; error?: string }

export async function createDownloadLink(productId: string): Promise<Result> {
  if (!supabase) return { error: NOT_CONNECTED }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Sign in again to download your products.' }

  const { data, error } = await supabase.functions.invoke('signed-download', {
    body: { productId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      try {
        const payload = await error.context.json() as { error?: unknown }
        if (typeof payload.error === 'string' && payload.error.trim()) return { error: payload.error }
      } catch {
        // Fall through to the generic message if the function response is not JSON.
      }
    }
    return { error: 'The download could not be prepared. Try again in a moment.' }
  }

  if (!data || typeof data.url !== 'string' || !data.url) {
    return { error: 'The download service did not return a link.' }
  }

  return { data: data as DownloadLink }
}
