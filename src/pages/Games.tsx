import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { ArrowLink, Badge, Chip, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
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
  const shown = filter === 'all' ? GENRES : GENRES.filter((g) => g.platforms.includes(filter))

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={GENRE_INTRO.title}
        eyebrow={GENRE_INTRO.eyebrow}
        intro={GENRE_INTRO.intro}
        art={<Holo kind="cloud" motion />}
        titleSize="compact"
        aside={
          <p className="mt-6 border-l-2 border-violet pl-4 text-[13px] leading-relaxed text-muted">{GENRE_INTRO.rule}</p>
        }
      />

      <section aria-label="Game categories" className="grid gap-2">
        <Card className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter categories by platform">
            {FILTERS.map((f) => (
              <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
                {f.label}
              </Chip>
            ))}
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            {shown.length} {shown.length === 1 ? 'category' : 'categories'}
          </p>
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
                        to={`/platforms/${p}`}
                        className={cx('inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hov:text-violet hov:underline')}
                      >
                        {PLATFORM_LABEL[p]} pipeline
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="upcoming" className="grid gap-2 lg:grid-cols-[0.9fr_1.1fr]">
        <Card tone="night" className="p-6 sm:p-8">
          <Title id="upcoming" lines={UPCOMING.title} align="left" />
          <p className="mt-5 max-w-sm text-night-muted">{UPCOMING.intro}</p>
          <div className="mt-7">
            <ButtonLink
              to={`mailto:${SITE.email}?subject=${encodeURIComponent('Platform request')}&body=${encodeURIComponent('Which platform:\nWhat you build with it:')}`}
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
          Building something that does not fit a category? The pipeline does not care what genre it is — point it at the project and it will tell you what is missing.
        </p>
        <ArrowLink to="/docs">Read the docs</ArrowLink>
      </Card>
    </div>
  )
}
