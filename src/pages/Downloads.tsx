import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { ArrowRight, DownloadCloud, LockKeyhole } from 'lucide-react'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { APP } from '../data'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

type Entitlement = {
  id: string
  status: 'active' | 'expired' | 'revoked' | string
  starts_at: string
  expires_at: string | null
  products: { name: string; slug: string } | null
}

function dateLabel(value: string | null) {
  if (!value) return 'No expiry date'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

export function Downloads() {
  useDocumentTitle('Downloads and licenses')
  const { configured, ready, user } = useAuth()
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!configured || !user || !supabase) return
    let active = true
    const client = supabase
    setLoading(true)
    client.from('user_entitlements')
      .select('id, status, starts_at, expires_at, products(name, slug)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setLoadError('The marketplace tables are not ready. Apply supabase/marketplace.sql and confirm row-level security is enabled.')
        else setEntitlements((data ?? []) as unknown as Entitlement[])
        setLoading(false)
      })
    return () => { active = false }
  }, [configured, user?.id])

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Your', 'downloads']} eyebrow="Customer library" intro="Your cheat entitlements and loader downloads will appear here." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/downloads' }} />

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Your', 'library']} eyebrow="Downloads and licences" intro="Review the cheat entitlements attached to your account. Download links stay unavailable until private file delivery is configured." art={<DownloadCloud className="size-24 text-violet/80" />} titleSize="compact" />

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="caps text-violet">Cheat access</p><h2 className="mt-2 text-2xl font-semibold">Your licences</h2><p className="mt-1 text-sm text-muted">Signed in as {user.email}</p></div>
          <Badge tone="outline">{loading ? 'Loading' : `${entitlements.length} ${entitlements.length === 1 ? 'entitlement' : 'entitlements'}`}</Badge>
        </div>
        {loading ? <p className="mt-6 text-sm text-muted">Loading account entitlements…</p> : loadError ? <p role="alert" className="mt-6 rounded-lg bg-soft p-4 text-sm text-muted">{loadError}</p> : entitlements.length === 0 ? <div className="mt-6 rounded-xl border border-dashed border-line-strong p-6"><p className="font-medium">No product entitlements found.</p><p className="mt-2 text-sm text-muted">When a verified order is attached to your account, its product access will appear here.</p></div> : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {entitlements.map((item) => <li key={item.id} className="rounded-xl border border-line bg-soft p-5">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{item.products?.name ?? '404 Services cheat'}</h3><p className="mt-1 font-mono text-[10px] text-faint">{item.id.slice(0, 8)}</p></div><Badge tone={item.status === 'active' ? 'success' : 'outline'}>{item.status}</Badge></div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs"><span className="text-muted">Access expires</span><span>{dateLabel(item.expires_at)}</span></div>
            </li>)}
          </ul>
        )}
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><LockKeyhole className="size-5" /></span><div><h2 className="font-semibold">Secure downloads are not connected yet</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">404 Services has no published loader URL or signed-download endpoint in this build. A download will only appear after the server verifies your entitlement and issues a short-lived link to a private release file. Current loader reference: v{APP.version}.</p></div></div>
        <ButtonLink to="/store" variant="outline" iconRight={<ArrowRight className="size-4" />}>Browse catalogue</ButtonLink>
      </Card>
    </div>
  )
}
