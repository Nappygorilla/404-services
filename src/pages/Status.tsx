import { ArrowUpRight, Check } from 'lucide-react'

import { ArrowLink, Badge, Reveal, Title } from '../components/Bits'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, CHANGELOG, PLATFORMS } from '../data'
import { useDocumentTitle } from '../lib/storage'

/*
  The status page every shop in this genre keeps: one glance at what is up,
  what is not, and which release is current. Everything here states the
  shipped release rather than a live probe: the app builds offline, so there
  is no service to ping per visitor.
*/

const SYSTEMS = [
  { name: 'Build engine', detail: 'Compile, validate and bundle a project' },
  { name: 'Dependency graph', detail: 'Resolution, cycles and lockfile checks' },
  { name: 'FiveM workflow', detail: 'Manifest generation and deploy profiles' },
  { name: 'Roblox workflow', detail: 'Rojo project import and place builds' },
  { name: 'Documentation', detail: 'Guides, examples and command reference' },
  { name: 'Release feed', detail: 'Version notes and update downloads' },
]

export function Status() {
  useDocumentTitle('Status')
  const latest = CHANGELOG[0]

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['System', 'status']}
        eyebrow="Live"
        intro="What is running, what is not, and which release is current. This page reflects the shipped build, not a per-visitor probe: Modsmith builds offline."
        art={<Holo kind="prism" motion />}
        aside={
          <div className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            <span className="size-1.5 rounded-full bg-acid" aria-hidden />
            All systems operational
          </div>
        }
      />

      <Card as="section" aria-label="Current release" className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
        <div className="flex items-center gap-4">
          <span className="relative grid size-12 shrink-0 place-items-center" aria-hidden>
            <span className="round absolute inset-0 animate-pulse rounded-full bg-acid/15" />
            <span className="round size-3 rounded-full bg-acid" />
          </span>
          <div>
            <p className="text-2xl font-medium tracking-[-0.03em]">All systems operational</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">No open incidents</p>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-4 md:justify-items-end">
          <div>
            <dt className="caps text-[9.5px] text-faint">Version</dt>
            <dd className="mt-1 font-mono text-[15px] text-ink">v{APP.version}</dd>
          </div>
          <div>
            <dt className="caps text-[9.5px] text-faint">Released</dt>
            <dd className="mt-1 font-mono text-[15px] text-ink">{APP.released}</dd>
          </div>
          <div>
            <dt className="caps text-[9.5px] text-faint">Size</dt>
            <dd className="mt-1 font-mono text-[15px] text-ink">{APP.size}</dd>
          </div>
        </dl>
        <ArrowLink to="/changelog" tone="violet" size="sm" className="md:justify-self-end">
          Release notes
        </ArrowLink>
      </Card>

      <section aria-labelledby="status-systems" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">
            Six moving parts, one release. If a platform breaks, this list says which one.
          </p>
          <Title id="status-systems" lines={['Component', 'status']} className="order-1 md:order-2" />
        </Card>
        <Card as="section" className="p-2 sm:p-3">
          <ul className="grid divide-y divide-line">
            {SYSTEMS.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 0.04} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{s.name}</span>
                    <span className="mt-0.5 block text-[13px] text-muted">{s.detail}</span>
                  </span>
                  <Badge tone="success">
                    <Check className="mr-1 size-3" aria-hidden />
                    Operational
                  </Badge>
                </Reveal>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="status-platforms" className="grid gap-2 md:grid-cols-2">
        {PLATFORMS.map((p) => (
          <Card key={p.slug} as="article" className="flex h-full flex-col p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="caps text-faint">Platform</p>
                <h2 className="display mt-3 text-[clamp(1.8rem,1.4rem+1.4vw,2.4rem)]">{p.name}</h2>
              </div>
              <div className="w-20 shrink-0" aria-hidden>
                <Holo kind={p.art} />
              </div>
            </div>
            <p className="mt-4 text-[15px] text-muted">{p.tagline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="success">
                <span className="mr-1.5 size-1.5 rounded-full bg-acid" aria-hidden />
                Supported
              </Badge>
              <Badge tone="outline">v{APP.version}</Badge>
            </div>
            <ArrowLink to={`/platforms/${p.slug}`} tone="violet" size="sm" className="mt-auto pt-6">
              {p.cta}
            </ArrowLink>
          </Card>
        ))}
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6 text-sm text-muted sm:px-8">
        <p>
          Latest entry: <span className="text-ink">{latest.title}</span> · v{latest.version} · {latest.date}
        </p>
        <a
          href="https://github.com/Nappygorilla/LUNA-WIN/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-1.5 text-ink transition-colors hov:text-violet-light"
        >
          Report a problem
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Card>
    </div>
  )
}
