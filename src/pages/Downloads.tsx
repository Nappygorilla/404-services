import { ArrowRight, DownloadCloud, LockKeyhole } from 'lucide-react'
import { Navigate } from 'react-router'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { APP } from '../data'
import { useDocumentTitle } from '../lib/storage'

export function Downloads() {
  useDocumentTitle('Downloads')
  const { configured, ready, user } = useAuth()

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Your', 'downloads']} eyebrow="Customer library" intro="Software downloads will appear here when account entitlements and secure file delivery are connected." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/downloads' }} />

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Your', 'downloads']} eyebrow="Customer library" intro="Your authorized software files and release information will be listed here." art={<DownloadCloud className="size-24 text-violet/80" />} titleSize="compact" />
      <Card className="grid gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-violet/10 text-violet"><LockKeyhole className="size-6" aria-hidden /></span>
            <div><h2 className="text-xl font-medium">Secure downloads are not connected yet</h2><p className="mt-1 text-sm text-muted">Account: {user.email}</p></div>
          </div>
          <Badge tone="outline">Not configured</Badge>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">The catalog currently documents LUNA Desktop v{APP.version}, but this repository does not yet contain a published installer URL, protected file storage, or an entitlement-backed download endpoint. No download button is shown until those pieces are configured.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/docs" variant="violet" iconRight={<ArrowRight className="size-4" />}>Read documentation</ButtonLink>
          <ButtonLink to="/support" variant="outline">Contact support</ButtonLink>
        </div>
      </Card>
      <p className="px-2 text-xs leading-relaxed text-muted">For safety, download delivery should use private storage and short-lived signed URLs issued only after the server verifies the signed-in user's entitlement.</p>
    </div>
  )
}
