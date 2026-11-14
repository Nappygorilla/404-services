import { ArrowRight, Search, Workflow } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { ArrowLink, Badge } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, PLATFORMS } from '../data'
import { useDocumentTitle } from '../lib/storage'

type Filter = 'all' | 'fivem' | 'roblox'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All workflows' },
  { id: 'fivem', label: 'FiveM' },
  { id: 'roblox', label: 'Roblox' },
]

export function Store() {
  useDocumentTitle('Store')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const workflows = useMemo(
    () => PLATFORMS.filter((platform) => {
      if (filter !== 'all' && platform.slug !== filter) return false
      if (!normalizedQuery) return true
      return [
        platform.name,
        platform.tagline,
        platform.intro,
        ...platform.features.map((feature) => feature.title),
      ].join(' ').toLowerCase().includes(normalizedQuery)
    }),
    [filter, normalizedQuery],
  )

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Explore', 'the store']}
        eyebrow="LUNA software catalog"
        intro="One desktop toolkit, with focused workflows for the platforms you build on. Explore what is included, check the requirements, and read the documentation before choosing a plan."
        art={<Holo kind="prism" motion />}
        titleSize="compact"
        aside={
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/pricing" variant="violet" iconRight={<ArrowRight className="size-4" />}>View plans</ButtonLink>
            <ArrowLink to="/status" tone="ink" size="sm">Service status</ArrowLink>
          </div>
        }
      />

      <Card className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="violet">LUNA Desktop</Badge>
            <Badge tone="outline">v{APP.version}</Badge>
          </div>
          <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em]">A single toolkit for two workflows.</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
            LUNA brings project inspection, dependency checks, repeatable builds, and deployment workflows into one desktop application. The platform guides below describe the capabilities included in LUNA Desktop; they are not separate products.
          </p>
        </div>
        <ButtonLink to="/pricing" variant="violet" iconRight={<ArrowRight className="size-4" />}>Compare plans</ButtonLink>
      </Card>

      <section aria-label="Browse platform workflows" className="grid gap-3">
        <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter workflows">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`round min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${filter === item.id ? 'border-violet bg-violet text-white' : 'border-line-strong bg-soft text-ink hov:border-violet'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search workflows</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search features…"
              className="round h-11 w-full rounded-full border border-line-strong bg-soft pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-faint focus-visible:border-violet"
            />
          </label>
        </Card>

        <div className="grid gap-2 md:grid-cols-2">
          {workflows.map((platform, index) => (
            <Card key={platform.slug} as="article" className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone="outline">{platform.name}</Badge>
                  <h2 className="display mt-4 text-[clamp(1.9rem,1.4rem+2vw,3rem)]">{platform.name} workflow</h2>
                  <p className="mt-2 text-sm font-medium text-violet">{platform.tagline}</p>
                </div>
                <div className="w-20 shrink-0" aria-hidden><Holo kind={platform.art} /></div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">{platform.intro}</p>
              <ul className="mt-6 grid gap-3">
                {platform.features.slice(0, 3).map((feature) => (
                  <li key={feature.title} className="flex gap-3 text-sm text-ink-2">
                    <Workflow className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                    <span><strong className="font-medium text-ink">{feature.title}</strong><span className="mt-0.5 block text-muted">{feature.body}</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <span className="text-xs text-muted">Included in LUNA Desktop</span>
                <Link to={`/products/${platform.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-violet hov:text-violet-light">
                  Explore workflow <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {workflows.length === 0 && (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-medium">No matching workflows</h2>
            <p className="mt-2 text-sm text-muted">Try another search or clear the platform filter.</p>
            <button type="button" onClick={() => { setQuery(''); setFilter('all') }} className="mt-4 text-sm font-semibold text-violet underline-offset-4 hov:underline">Clear filters</button>
          </Card>
        )}
      </section>

      <Card tone="night" className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <p className="caps text-violet-light">Need a hand choosing?</p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-white">Read the requirements before you install.</h2>
          <p className="mt-2 text-sm leading-relaxed text-night-muted">The product guides list supported workflows, system requirements, limitations, and the steps for getting started.</p>
        </div>
        <ButtonLink to="/docs" variant="light">Open documentation</ButtonLink>
      </Card>
    </div>
  )
}
