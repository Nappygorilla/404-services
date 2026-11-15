import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { KeyRound, Link2, LogOut, ShieldCheck } from 'lucide-react'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

function discordRedirectUrl(): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/'
  return new URL(base + 'account/security?discord=linked', window.location.origin).toString()
}

export function Security() {
  useDocumentTitle('Account security')
  const { configured, ready, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [linkingDiscord, setLinkingDiscord] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (!configured) return <div className="grid gap-2 p-2"><PageHero title={['Account', 'security']} eyebrow="Security settings" intro="Change your password and review the security options available for your account." /><BackendNotice /></div>
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/account/security' }} />

  const discordLinked = Boolean(user.identities?.some((identity) => identity.provider === 'discord'))

  const linkDiscord = async () => {
    if (!supabase || discordLinked) return
    setError('')
    setNotice('')
    setLinkingDiscord(true)
    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: 'discord',
      options: { redirectTo: discordRedirectUrl() },
    })
    if (linkError) {
      setLinkingDiscord(false)
      setError(linkError.message.includes('manual linking')
        ? 'Discord linking is not enabled in the Supabase Auth settings yet.'
        : linkError.message)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('The passwords do not match.')
      return
    }
    setError('')
    setNotice('')
    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (updateError) setError(updateError.message)
    else {
      setPassword('')
      setConfirm('')
      setNotice('Your password was updated.')
    }
  }

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Account', 'security']} eyebrow="Security settings" intro="Change your password and review the security options available for your account." art={<ShieldCheck className="size-24 text-violet/80" />} titleSize="compact" />
      <div className="grid gap-2 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><KeyRound className="size-5" /></span><div><p className="caps text-violet">Password</p><h2 className="text-xl font-semibold">Change password</h2></div></div>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">New password
              <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required className="h-11 rounded-lg border border-line-strong bg-soft px-3 text-sm outline-none focus-visible:border-violet" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">Confirm new password
              <input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={8} required className="h-11 rounded-lg border border-line-strong bg-soft px-3 text-sm outline-none focus-visible:border-violet" />
            </label>
            {error && <p role="alert" className="text-sm text-danger">{error}</p>}
            {notice && <p role="status" className="text-sm text-success">{notice}</p>}
            <Button type="submit" variant="violet" loading={saving} disabled={saving}>Update password</Button>
          </form>
        </Card>
        <div className="grid gap-2">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><Link2 className="size-5" /></span><div><p className="caps text-violet">Connected identity</p><h2 className="text-xl font-semibold">Discord account</h2></div></div>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">Link status</span>
              <Badge tone={discordLinked ? 'success' : 'outline'}>{discordLinked ? 'Connected' : 'Not connected'}</Badge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Link your Discord identity to this signed-in 404 Services account. This keeps your existing email login and lets the 404 Services bot verify which account belongs to your Discord profile.
            </p>
            {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
            {notice && <p role="status" className="mt-4 text-sm text-success">{notice}</p>}
            <div className="mt-5">
              <Button variant={discordLinked ? 'outline' : 'violet'} icon={<Link2 className="size-4" />} loading={linkingDiscord} disabled={discordLinked || linkingDiscord} onClick={linkDiscord}>
                {discordLinked ? 'Discord connected' : 'Link Discord account'}
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Only link a Discord account you control. If that Discord identity is already attached to another 404 Services account, Supabase will reject the link.
            </p>
          </Card>
          <Card className="flex flex-col p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><ShieldCheck className="size-5" /></span><div><p className="caps text-violet">Session</p><h2 className="text-xl font-semibold">Current sign-in</h2></div></div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted">Account</span><span className="text-right">{user.email}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">Email verification</span><Badge tone={user.email_confirmed_at ? 'success' : 'outline'}>{user.email_confirmed_at ? 'Confirmed' : 'Pending'}</Badge></div>
              <div className="flex justify-between gap-3"><span className="text-muted">Two-factor authentication</span><Badge tone="outline">Not configured</Badge></div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">This build supports password changes and signing out of this device. Multi-factor authentication and a full session-management panel have not been configured.</p>
            <div className="mt-auto pt-6"><Button variant="outline" icon={<LogOut className="size-4" />} onClick={async () => { await signOut(); navigate('/', { replace: true }) }}>Sign out of this device</Button></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
