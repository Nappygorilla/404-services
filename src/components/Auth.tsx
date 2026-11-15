import type { Session, User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { NOT_CONNECTED, supabase, supabaseConfigured } from '../lib/supabase'

type Result = { error?: string; needsConfirmation?: boolean }

type AuthValue = {
  configured: boolean
  ready: boolean
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<Result>
  signUp: (email: string, password: string, displayName: string) => Promise<Result>
  signInWithDiscord: (next?: string) => Promise<Result>
  linkDiscord: () => Promise<Result>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue>({
  configured: false,
  ready: true,
  user: null,
  session: null,
  signIn: async () => ({ error: NOT_CONNECTED }),
  signUp: async () => ({ error: NOT_CONNECTED }),
  signInWithDiscord: async () => ({ error: NOT_CONNECTED }),
  linkDiscord: async () => ({ error: NOT_CONNECTED }),
  signOut: async () => {},
})

/** Build an app URL that keeps the deployment base path, including GitHub Pages. */
function appRedirect(path: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/account'
  return new URL(`${base}${safePath}`, window.location.origin).toString()
}

/** Confirmation links must return to this deployment, including the Pages base path. */
function confirmationRedirect(): string | undefined {
  return appRedirect('/')
}

function friendly(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'That email and password do not match an account.'
  if (m.includes('email not confirmed')) return 'Confirm your email first — the link is in your inbox.'
  if (m.includes('already registered')) return 'That email already has an account. Sign in instead.'
  if (m.includes('password should be at least')) return 'Use at least 8 characters for the password.'
  if (m.includes('unable to validate email')) return 'That email address does not look valid.'
  if (m.includes('rate limit')) return 'Too many attempts. Wait a minute and try again.'
  if (m.includes('failed to fetch')) return 'Could not reach the account service. Check your connection and try again.'
  if (m.includes('manual linking') || m.includes('identity linking is disabled')) return 'Discord account linking is not enabled for this project yet.'
  if (m.includes('provider is not enabled') || m.includes('unsupported provider')) return 'Discord sign-in is not enabled for this project yet.'
  if (m.includes('identity is already linked')) return 'That Discord account is already linked to a 404 Services account.'
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setReady(true)
    })
    return () => {
      alive = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback<AuthValue['signIn']>(async (email, password) => {
    if (!supabase) return { error: NOT_CONNECTED }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? { error: friendly(error.message) } : {}
  }, [])

  const signUp = useCallback<AuthValue['signUp']>(async (email, password, displayName) => {
    if (!supabase) return { error: NOT_CONNECTED }
    const emailRedirectTo = confirmationRedirect()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    })
    if (error) return { error: friendly(error.message) }
    return { needsConfirmation: !data.session }
  }, [])

  const signInWithDiscord = useCallback<AuthValue['signInWithDiscord']>(async (next = '/account') => {
    if (!supabase) return { error: NOT_CONNECTED }
    const redirectTo = appRedirect(next)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { ...(redirectTo ? { redirectTo } : {}) },
    })
    return error ? { error: friendly(error.message) } : {}
  }, [])

  const linkDiscord = useCallback<AuthValue['linkDiscord']>(async () => {
    if (!supabase) return { error: NOT_CONNECTED }
    const redirectTo = appRedirect('/account')
    const { error } = await supabase.auth.linkIdentity({
      provider: 'discord',
      options: { ...(redirectTo ? { redirectTo } : {}) },
    })
    return error ? { error: friendly(error.message) } : {}
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ configured: supabaseConfigured, ready, user: session?.user ?? null, session, signIn, signUp, signInWithDiscord, linkDiscord, signOut }),
    [ready, session, signIn, signUp, signInWithDiscord, linkDiscord, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** The display name chosen at registration, falling back to the email prefix. */
export function displayNameOf(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null): string {
  for (const key of ['display_name', 'full_name', 'name', 'user_name', 'preferred_username']) {
    const value = user?.user_metadata?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return user?.email?.split('@')[0] ?? 'Member'
}
