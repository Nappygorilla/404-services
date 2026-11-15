import { ArrowRight, Check, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { ArrowLink, Badge, Chip, EmptyState, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { MarketingHero } from '../components/Nav'
import { GENRE_INTRO, GENRES, SITE, UPCOMING } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/storage'

type Filter = 'all' | 'fivem' | 'roblox'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All categories' },
  { id: 'fivem', label: 'FiveM' },
  { id: 'roblox', label: 'Roblox' },
]

const PLATFORM_LABEL = { fivem: 'FiveM', roblox: 'Roblox' } as const

export function Games() {
  useDocumentTitle('Games')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = GENRES.filter((g) => {
    if (filter !== 'all' && !g.platforms.includes(filter)) return false
    if (!q) return true
    return [g.name, g.line, g.body, ...g.builds].join(' ').toLowerCase().includes(q)
  })

  return (
    <div>
      <MarketingHero
        title={GENRE_INTRO.title}
        eyebrow={GENRE_INTRO.eyebrow}
        intro={GENRE_INTRO.intro}
        art={<Holo kind="cloud" motion priority />}
        aside={
          <p className="mt-7 max-w-xl border-l-2 border-violet pl-4 text-[13px] leading-relaxed text-white/45">{GENRE_INTRO.rule}</p>
        }
      />

      <div className="mx-auto grid max-w-[1440px] gap-4 px-5 py-10 sm:px-8 sm:py-14">
      <section aria-label="Game categories" className="grid gap-4">
        <Card className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter categories by platform">
            {FILTERS.map((f) => (
              <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
                {f.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <label className="relative w-full sm:w-64">
              <span className="sr-only">Search categories</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories…"
                className="round h-11 w-full appearance-none rounded-full border border-line-strong bg-soft pr-4 pl-9 text-[15px] outline-none transition-colors placeholder:text-faint focus-visible:border-violet [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
            <p className="text-sm text-muted tabular-nums" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </Card>

        <ul className="grid gap-2 md:grid-cols-2">
          {shown.map((g, i) => (
            <li key={g.slug} className="h-full">
              <Reveal delay={(i % 2) * 0.05} className="h-full">
                <Card as="article" className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {g.platforms.map((p) => (
                          <Badge key={p} tone="outline">
                            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid align-middle" aria-hidden />
                            {PLATFORM_LABEL[p]}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="display mt-4 text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)]">{g.name}</h2>
                    </div>
                    <div className="w-20 shrink-0" aria-hidden>
                      <Holo kind={g.art} />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-violet">{g.line}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{g.body}</p>
                  <ul className="mt-5 grid gap-2 text-[15px]">
                    {g.builds.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
                    {g.platforms.map((p) => (
                      <Link
                        key={p}
                        to={`/store?platform=${p}`}
                        className={cx('inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hov:text-violet hov:underline')}
                      >
                        {PLATFORM_LABEL[p]} cheats
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <Card className="p-2">
            <EmptyState
              title="Nothing matches"
              body="No category fits that search on this platform. Try a shorter word, or clear the filters."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setFilter('all')
                  }}
                  className="round inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors hov:border-violet hov:bg-violet hov:text-white"
                >
                  Clear filters
                </button>
              }
            />
          </Card>
        )}
      </section>

      <section aria-labelledby="upcoming" className="grid gap-2 lg:grid-cols-[0.9fr_1.1fr]">
        <Card tone="night" className="p-6 sm:p-8">
          <Title id="upcoming" lines={UPCOMING.title} align="left" />
          <p className="mt-5 max-w-sm text-night-muted">{UPCOMING.intro}</p>
          <div className="mt-7">
            <ButtonLink
              to={`mailto:${SITE.email}?subject=${encodeURIComponent('Game request')}&body=${encodeURIComponent('Which game:\nWhat you play:')}`}
              variant="light"
              iconRight={<ArrowRight className="size-4" />}
            >
              {UPCOMING.action}
            </ButtonLink>
          </div>
        </Card>
        <Card className="p-6 sm:p-8">
          <ul className="divide-y divide-line">
            {UPCOMING.items.map((item) => (
              <li key={item.name} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
                <Badge tone="neutral">Not supported yet</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
        <p className="max-w-xl text-muted">
          Looking for a game we do not support yet? Join the waitlist and we will let you know when a loader profile is ready.
        </p>
        <div className="flex flex-wrap items-center gap-5"><ArrowLink to="/store">Browse the cheats</ArrowLink><ArrowLink to="/docs" tone="ink">Read the docs</ArrowLink></div>
      </Card>
      </div>
    </div>
  )
}
