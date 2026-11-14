import { useEffect, useState } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, CircleHelp, CloudDownload, CreditCard, Server, ShieldCheck } from 'lucide-react'

import { ArrowLink, Badge } from '../components/Bits'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { APP, CHANGELOG, SITE } from '../data'
import { supabaseConfigured } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

type ApiState = 'checking' | 'operational' | 'unavailable'

function StateBadge({ label, kind = 'unknown' }: { label: string; kind?: 'ok' | 'unknown' }) {
  return <Badge tone={kind === 'ok' ? 'success' : 'outline'}>{kind === 'ok' && <CheckCircle2 className="mr-1 size-3" />}{label}</Badge>
}

export function Status() {
  useDocumentTitle('System status')
  const [apiState, setApiState] = useState<ApiState>('checking')

  useEffect(() => {
    let active = true
    fetch('/api/health', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Health check failed')
        return await response.json() as { ok?: boolean }
      })
      .then((data) => { if (active) setApiState(data.ok ? 'operational' : 'unavailable') })
      .catch(() => { if (active) setApiState('unavailable') })
    return () => { active = false }
  }, [])

  const apiLabel = apiState === 'checking' ? 'Checking' : apiState === 'operational' ? 'Operational' : 'Unavailable'
  const systems = [
    { name: 'Website API', detail: 'Cloudflare Worker health endpoint', icon: Server, label: apiLabel, ok: apiState === 'operational' },
    { name: 'Account configuration', detail: 'Supabase client environment settings are present', icon: ShieldCheck, label: supabaseConfigured ? 'Configured' : 'Not configured', ok: supabaseConfigured },
    { name: 'Secure downloads', detail: 'Private file storage and entitlement checks', icon: CloudDownload, label: 'Not connected', ok: false },
    { name: 'Checkout', detail: 'Payment provider and verified purchase webhooks', icon: CreditCard, label: 'Not connected', ok: false },
  ]
  const latest = CHANGELOG[0]

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['System', 'status']} eyebrow="Service health" intro="A transparent view of the services connected to this build. Only the API health endpoint is actively checked; the other integrations are labeled according to their configuration." art={<Activity className="size-24 text-violet/80" />} titleSize="compact" />

      <Card className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><Activity className="size-5" /></span>
          <div><h2 className="text-xl font-semibold">Monitoring overview</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">LUNA does not currently have external uptime monitoring or a live incident system. This page reports the checks and configuration that can be verified by the website itself.</p></div>
        </div>
        <Badge tone="outline">Partial monitoring</Badge>
      </Card>

      <section aria-label="Service components" className="grid gap-2">
        {systems.map((system) => {
          const Icon = system.icon
          return <Card key={system.name} className="flex flex-wrap items-center gap-4 p-5 sm:px-6">
            <span className="grid size-10 place-items-center rounded-xl bg-soft text-violet"><Icon className="size-5" /></span>
            <div className="min-w-0 flex-1"><h3 className="font-semibold">{system.name}</h3><p className="mt-0.5 text-sm text-muted">{system.detail}</p></div>
            <StateBadge label={system.label} kind={system.ok ? 'ok' : 'unknown'} />
          </Card>
        })}
      </section>

      <Card className="grid gap-5 p-6 sm:grid-cols-3 sm:p-8">
        <div><p className="caps text-muted">Desktop release</p><p className="mt-2 text-xl font-semibold">v{APP.version}</p></div>
        <div><p className="caps text-muted">Last release date</p><p className="mt-2 text-xl font-semibold">{APP.released}</p></div>
        <div><p className="caps text-muted">Latest notes</p><p className="mt-2 text-xl font-semibold">{latest ? latest.version : '—'}</p></div>
      </Card>

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-3"><CircleHelp className="mt-0.5 size-5 shrink-0 text-violet" /><div><h2 className="font-semibold">Found a problem?</h2><p className="mt-1 text-sm text-muted">Report an issue with the product or website so it can be investigated.</p></div></div>
        <div className="flex flex-wrap gap-4"><ArrowLink to="/support" size="sm">Contact support</ArrowLink><a href="https://github.com/Nappygorilla/LUNA-WIN/issues" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-violet hov:text-violet-light">GitHub issues <ArrowUpRight className="size-4" /></a></div>
      </Card>
      <p className="px-2 text-center text-xs text-muted">{SITE.name} · Status information is limited to verified checks and configured integrations.</p>
    </div>
  )
}
