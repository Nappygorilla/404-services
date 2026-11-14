import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/*
  Accounts and the community boards live in Supabase. The two values below are
  public by design (the anon key is meant to ship in the browser), but the build
  still reads them from the environment so no key is ever committed: locally
  from .env, on Pages from the repository's Actions secrets. When they are
  absent the site stays fully usable and the account surfaces say so instead of
  pretending a login worked.
*/
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const supabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url as string, anonKey as string) : null

export const NOT_CONNECTED = 'Accounts are not connected on this build yet.'
