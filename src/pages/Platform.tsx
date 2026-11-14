import { ArrowRight, Check, X } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { ArrowLink, Badge, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, PLATFORMS, platformBySlug } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/storage'
import { NotFound } from './NotFound'

export function Platform() {
  const { slug = '' } = useParams()
  const platform = platformBySlug(slug)
  useDocumentTitle(platform ? platform.name : 'Platform not found')

  if (!platform) {
    return <NotFound title="Platform not found" body="We support FiveM and Roblox. Pick one of those and the guide will be there." to="/" action="Back to home" />
  }

  const other = PLATFORMS.find((p) => p.slug !== platform.slug)

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={[platform.name]}
        eyebrow={platform.tagline}
        intro={platform.intro}
        art={<Holo kind={platform.art} motion />}
        aside={
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink to="/pricing" variant="violet" iconRight={<ArrowRight className="size-4" />}>
              Get {platform.name} support
            </ButtonLink>
            <ArrowLink to="/docs" tone="ink" size="sm">
              Docs
            </ArrowLink>
          </div>
        }
      />

      <section aria-labelledby="platform-features" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">
            What the {platform.name} workflow adds on top of the shared build pipeline.
          </p>
          <Title id="platform-features" lines={['Built for', platform.name]} className="order-1 md:order-2" />
        </Card>
        <ul className="grid gap-2 md:grid-cols-2">
          {platform.features.map((f, i) => (
            <li key={f.title} className="h-full">
              <Reveal delay={(i % 2) * 0.06} className="h-full">
                <Card className="flex h-full flex-col p-6 sm:p-7">
                  <span className="caps text-violet tabular-nums">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="platform-workflow" className="grid gap-2 lg:grid-cols-[0.9fr_1.1fr]">
        <Card tone="night" className="p-6 sm:p-8">
          <Title id="platform-workflow" lines={['From folder', 'to server']} align="left" />
          <p className="mt-6 max-w-sm text-night-muted">
            The same five moves every time, whether it is your first resource or your fortieth.
          </p>
          <div className="mt-8 grid gap-3">
            {platform.requirements.map((r) => (
              <p key={r} className="flex items-start gap-2.5 text-[15px] text-white/85">
                <Check className="mt-0.5 size-4 shrink-0 text-violet-light" aria-hidden />
                {r}
              </p>
            ))}
          </div>
        </Card>
        <Card className="p-6 sm:p-8">
          <ol className="grid gap-0 divide-y divide-line">
            {platform.workflow.map((step, i) => (
              <li key={step} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                <span className="w-8 shrink-0 text-sm font-medium text-violet tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[15px] text-ink-2">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <Card as="section" aria-labelledby="platform-spec" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Title id="platform-spec" lines={['Specs and', 'checklist']} align="left" />
          <p className="mt-4 max-w-sm text-muted">
            What the app needs and what the licence covers, before you download anything.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="caps text-violet">System requirements</p>
            <ul className="mt-4 grid gap-2.5 text-[15px]">
              {APP.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caps text-violet">Current release</p>
            <dl className="mt-4 grid gap-2.5 text-[15px]">
              {[
                ['Version', `v${APP.version}`],
                ['Download', APP.size],
                ['Platforms', APP.platforms.join(' · ')],
                ['Licence', 'One-time · 12 months of updates'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 border-b border-line pb-2.5 last:border-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Card>

      <Card as="section" aria-labelledby="platform-limits" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Title id="platform-limits" lines={['What it', 'will not do']} align="left" />
          <p className="mt-4 max-w-sm text-muted">
            Worth reading before you buy. These are limits of the tool and of the platform, not a roadmap.
          </p>
        </div>
        <ul className="grid gap-3">
          {platform.limits.map((l) => (
            <li key={l} className="flex items-start gap-3 rounded-[var(--radius-control)] bg-soft px-4 py-3 text-[15px]">
              <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </Card>

      {other && (
        <Card className="flex flex-wrap items-end justify-between gap-6 p-6 sm:p-8">
          <div>
            <Badge tone="violet">Also supported</Badge>
            <p className={cx('display mt-3 text-[clamp(1.8rem,1.4rem+2vw,3rem)]')}>{other.name}</p>
            <p className="mt-2 max-w-md text-muted">{other.tagline}</p>
          </div>
          <Link
            to={`/platforms/${other.slug}`}
            className="round inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] font-medium transition-colors hov:border-violet hov:bg-violet hov:text-white"
          >
            Open the {other.name} guide
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
      )}
    </div>
  )
}
