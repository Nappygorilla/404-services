import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { ArrowRight, Check, Copy, DownloadCloud, LockKeyhole } from 'lucide-react'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { createDownloadLink } from '../lib/downloads'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

type Nested<T> = T | T[] | null
type LicenseEntitlement = {
  product_id: string
  status: 'active' | 'expired' | 'revoked' | string
  expires_at: string | null
  products: { name: string; slug: string } | null
}
type License = {
  id: string
  license_key: string
  status: 'active' | 'expired' | 'revoked' | string
  issued_at: string
  expires_at: string | null
  user_entitlements: Nested<LicenseEntitlement>
}

function dateLabel(value: string | null) {
  if (!value) return 'No expiry date'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

function asList<T>(value: Nested<T> | undefined): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function Downloads() {
  useDocumentTitle('Downloads and licenses')
  const { configured, ready, user } = useAuth()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!configured || !user || !supabase) return
    let active = true
    const client = supabase
    setLoading(true)
    client.from('licenses')
      .select('id, license_key, status, issued_at, expires_at, user_entitlements(product_id, status, expires_at, products(name, slug))')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setLoadError('The licence tables are not ready. Apply the marketplace and licence migrations, then confirm row-level security is enabled.')
        else setLicenses((data ?? []) as unknown as License[])
        setLoading(false)
      })
    return () => { active = false }
  }, [configured, user?.id])

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Your', 'downloads']} eyebrow="Customer library" intro="Your cheat entitlements and loader downloads will appear here." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/downloads' }} />

  const copyKey = async (id: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((current) => current === id ? null : current), 1800)
    } catch {
      setDownloadError('Your browser could not copy the key. Select it and copy it manually.')
    }
  }

  const download = async (licenseId: string, productId: string) => {
    const token = `${licenseId}:${productId}`
    setDownloadError('')
    setDownloading(token)
    const result = await createDownloadLink(productId)
    setDownloading(null)
    if (result.error) return setDownloadError(result.error)
    if (result.data) window.location.assign(result.data.url)
  }

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Your', 'library']} eyebrow="Downloads and licences" intro="Review the licences attached to your account. Copy your key, and request a short-lived download link for each active product." art={<DownloadCloud className="size-24 text-violet/80" />} titleSize="compact" />

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="caps text-violet">Cheat access</p><h2 className="mt-2 text-2xl font-semibold">Your licences</h2><p className="mt-1 text-sm text-muted">Signed in as {user.email}</p></div>
          <Badge tone="outline">{loading ? 'Loading' : `${licenses.length} ${licenses.length === 1 ? 'licence' : 'licences'}`}</Badge>
        </div>
        {loading ? <p className="mt-6 text-sm text-muted">Loading account licences…</p> : loadError ? <p role="alert" className="mt-6 rounded-lg bg-soft p-4 text-sm text-muted">{loadError}</p> : licenses.length === 0 ? <div className="mt-6 rounded-xl border border-dashed border-line-strong p-6"><p className="font-medium">No licences found.</p><p className="mt-2 text-sm text-muted">When a verified order is attached to your account, its licence key and product access will appear here.</p></div> : (
          <ul className="mt-6 grid gap-3">
            {licenses.map((license) => {
              const entitlements = asList(license.user_entitlements)
              const activeEntitlements = entitlements.filter((item) => item.status === 'active')
              const title = entitlements.length > 1
                ? '404 Complete bundle'
                : entitlements[0]?.products?.name ?? '404 Services licence'
              return <li key={license.id} className="rounded-xl border border-line bg-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-muted">{activeEntitlements.length} of {entitlements.length} {entitlements.length === 1 ? 'product' : 'products'} active</p></div>
                  <Badge tone={license.status === 'active' ? 'success' : 'outline'}>{license.status}</Badge>
                </div>

                <div className="mt-4 rounded-lg border border-line-strong bg-card px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-faint">Licence key</p>
                      <code className="mt-1 block break-all font-mono text-[12px] tracking-[0.08em] text-ink">{license.license_key}</code>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyKey(license.id, license.license_key)} icon={copiedId === license.id ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}>{copiedId === license.id ? 'Copied' : 'Copy key'}</Button>
                  </div>
                </div>

                {entitlements.length > 0 ? <ul className="mt-4 grid gap-2 border-t border-line pt-3">
                  {entitlements.map((item) => {
                    const token = `${license.id}:${item.product_id}`
                    const canDownload = license.status === 'active' && item.status === 'active'
                    return <li key={item.product_id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div><span className="font-medium">{item.products?.name ?? '404 Services cheat'}</span><span className="ml-2 text-xs text-muted">{dateLabel(item.expires_at)}</span></div>
                      {canDownload ? <Button size="sm" variant="outline" loading={downloading === token} onClick={() => download(license.id, item.product_id)} icon={<DownloadCloud className="size-4" aria-hidden />}>Download</Button> : <Badge tone="outline">{item.status}</Badge>}
                    </li>
                  })}
                </ul> : <p className="mt-4 border-t border-line pt-3 text-sm text-muted">No products are attached to this licence yet.</p>}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
                  <span>Issued {dateLabel(license.issued_at)}</span>
                  <span>Access expires {dateLabel(license.expires_at)}</span>
                </div>
              </li>
            })}
          </ul>
        )}
        {downloadError && <p role="alert" className="mt-4 rounded-lg bg-soft p-4 text-sm text-muted">{downloadError}</p>}
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><LockKeyhole className="size-5" /></span><div><h2 className="font-semibold">Private release delivery</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">Downloads are signed for your account and expire after 60 seconds. The server checks your active licence before it reads a private release file. If no file has been uploaded for a product yet, the button will say so instead of returning a public link.</p></div></div>
        <ButtonLink to="/store" variant="outline" iconRight={<ArrowRight className="size-4" />}>Browse catalogue</ButtonLink>
      </Card>
    </div>
  )
}
