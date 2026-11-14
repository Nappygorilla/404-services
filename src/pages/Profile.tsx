import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'
import { UserRound } from 'lucide-react'

import { useAuth, displayNameOf } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

export function Profile() {
  useDocumentTitle('Profile')
  const { configured, ready, user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (user) setDisplayName(displayNameOf(user))
  }, [user?.id, user?.user_metadata?.display_name])

  if (!configured) return <div className="grid gap-2 p-2"><PageHero title={['Account', 'profile']} eyebrow="Profile settings" intro="Manage the display name associated with your LUNA account." /><BackendNotice /></div>
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/account/profile' }} />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    const value = displayName.trim()
    if (value.length < 1 || value.length > 60) {
      setError('Display name must be between 1 and 60 characters.')
      return
    }
    setError('')
    setNotice('')
    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ data: { display_name: value } })
    setSaving(false)
    if (updateError) setError(updateError.message)
    else setNotice('Your profile was updated.')
  }

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Account', 'profile']} eyebrow="Profile settings" intro="Manage the display name associated with your LUNA account." art={<UserRound className="size-24 text-violet/80" />} titleSize="compact" />
      <Card className="max-w-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3"><div><p className="caps text-violet">Personal details</p><h2 className="mt-2 text-2xl font-semibold">Your profile</h2></div><Badge tone={user.email_confirmed_at ? 'success' : 'outline'}>{user.email_confirmed_at ? 'Email confirmed' : 'Email pending'}</Badge></div>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">Display name
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={60} required className="h-11 rounded-lg border border-line-strong bg-soft px-3 text-sm outline-none focus-visible:border-violet" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Email address
            <input value={user.email ?? ''} readOnly disabled className="h-11 rounded-lg border border-line bg-soft px-3 text-sm text-muted disabled:opacity-80" />
          </label>
          <p className="text-xs leading-relaxed text-muted">Email is read-only here. Changing it requires a separate verified email-change flow, which is not enabled in this build.</p>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          {notice && <p role="status" className="text-sm text-success">{notice}</p>}
          <div><Button type="submit" variant="violet" loading={saving} disabled={saving}>Save profile</Button></div>
        </form>
      </Card>
    </div>
  )
}
