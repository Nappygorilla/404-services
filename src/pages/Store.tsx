import { ArrowRight, Check, Mail, Search } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { ArrowLink, Chip, EmptyState } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { MarketingHero } from '../components/Nav'
import { CurrencySwitch } from '../components/Price'
import { BundleBanner, ToolCard } from '../components/ProductCards'
import { BUNDLE, GENRE_INTRO, LICENCE_INCLUDES, PLATFORM_LABEL, SITE, TOOL_KINDS, TOOLS } from '../data'
import { orderMailto } from '../lib/commerce'
import { useDocumentTitle } from '../lib/storage'

const PLATFORM_FILTERS = [
  { id: 'all', label: 'All games' },
  { id: 'fivem', label: 'FiveM' },
  { id: 'roblox', label: 'Roblox' },
  { id: 'both', label: 'Both games' },
] as const

export function Store() {
  useDocumentTitle('Store')
  const [params, setParams] = useSearchParams()
  const platformParam = params.get('platform') ?? 'all'
  const platform = platformParam === 'fivem' || platformParam === 'roblox' || platformParam === 'both' ? platformParam : 'all'
  const kindParam = params.get('type') ?? 'all'
  const kind = TOOL_KINDS.includes(kindParam as (typeof TOOL_KINDS)[number]) ? kindParam : 'all'
  const query = params.get('q') ?? ''
  const q = query.trim().toLowerCase()

  const shown = TOOLS.filter((tool) => {
    const platformMatch =
      platform === 'all'
        ? true
        : platform === 'both'
          ? tool.platform === 'both'
          : tool.platform === platform || tool.platform === 'both'
    const kindMatch = kind === 'all' || tool.kind === kind
    const queryMatch =
      !q ||
      [tool.name, tool.tagline, tool.description, tool.kind, PLATFORM_LABEL[tool.platform]]
        .join(' ')
        .toLowerCase()
        .includes(q)
    return platformMatch && kindMatch && queryMatch
  })

  const compareAt = TOOLS.reduce((sum, tool) => sum + tool.price, 0)

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  function reset() {
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div>
      <MarketingHero
        title={['Every cheat.', 'On its own.']}
        eyebrow={`Store · ${TOOLS.length} separate profiles`}
        intro="Fourteen game-modification profiles for FiveM and Roblox. Every cheat has its own price, its own product page and its own buy action. Start with the features you want; 404 Complete is optional."
        art={<Holo kind="prism" motion priority />}
        aside={
          <div className="mt-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <CurrencySwitch />
              <span className="inline-flex items-center gap-2 text-[12px] text-white/45">
                <span className="size-1.5 rounded-full bg-acid" aria-hidden /> All profiles working
              </span>
            </div>
            <p className="max-w-md text-[12.5px] leading-relaxed text-white/40">
              One-time prices. Every cheat includes twelve months of updates for one person on two devices.
            </p>
            <ArrowLink to="/status" tone="light" size="sm" className="w-fit">
              Service status
            </ArrowLink>
          </div>
        }
      />

      <section id="catalogue" aria-labelledby="catalogue-title" className="mx-auto w-full max-w-[1440px] scroll-mt-4 px-5 py-12 sm:px-8 sm:py-16">
        <div className="rounded-[22px] border border-white/10 bg-white/[.035] p-4 backdrop-blur-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <p className="eyebrow text-[9px] text-white/35">Game</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by game">
                {PLATFORM_FILTERS.map((item) => (
                  <Chip key={item.id} selected={platform === item.id} onClick={() => setFilter('platform', item.id)}>
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>
            <label className="relative block">
              <span className="sr-only">Search cheats</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/30" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setFilter('q', event.target.value)}
                placeholder="Search the menu…"
                className="round h-11 w-full appearance-none rounded-full border border-white/15 bg-black/25 pr-4 pl-10 text-[15px] text-white outline-none transition-colors placeholder:text-white/25 focus-visible:border-violet [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by item type">
              <Chip selected={kind === 'all'} onClick={() => setFilter('type', 'all')}>
                All types
              </Chip>
              {TOOL_KINDS.map((item) => (
                <Chip key={item} selected={kind === item} onClick={() => setFilter('type', item)}>
                  {item}
                </Chip>
              ))}
            </div>
            <p className="text-sm text-white/40 tabular-nums" aria-live="polite">
              {shown.length} of {TOOLS.length} cheats
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-3">
          <div>
                          <p className="eyebrow text-[9px] text-pink">Catalogue</p>
            <h2 id="catalogue-title" className="display mt-2 text-[clamp(2rem,1.5rem+1.5vw,3rem)] text-white">
              {platform === 'all' ? 'All cheats' : `${PLATFORM_LABEL[platform]} cheats`}
            </h2>
          </div>
          {(platform !== 'all' || kind !== 'all' || query) && (
            <button type="button" onClick={reset} className="min-h-10 text-sm font-medium text-violet-light underline-offset-4 hov:text-white hov:underline">
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {shown.length === 0 && (
          <Card className="mt-5 p-2">
            <EmptyState
              title="Nothing matches"
              body="No cheat fits that search and filter combination. Try a shorter word, another game, or clear the filters."
              action={
                <button
                  type="button"
                  onClick={reset}
                  className="round inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors hov:border-violet hov:bg-violet hov:text-white"
                >
                  Clear filters
                </button>
              }
            />
          </Card>
        )}
      </section>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <BundleBanner bundle={BUNDLE} compareAt={compareAt} />
      </div>

      <section aria-labelledby="store-includes" className="mx-auto grid max-w-[1440px] gap-4 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="flex flex-col border-white/10 bg-white/[.03] p-6 sm:p-8">
          <p className="eyebrow text-[9px] text-pink">Every cheat</p>
          <h2 id="store-includes" className="display mt-3 text-[clamp(2rem,1.5rem+1.5vw,3rem)] text-white">What comes with it.</h2>
          <ul className="mt-6 grid gap-3">
            {LICENCE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-white/65">
                <Check className="mt-0.5 size-4 shrink-0 text-acid" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-7">
            <ArrowLink to="/pricing" tone="light" size="sm">
              See every price
            </ArrowLink>
          </div>
        </Card>

        <Card tone="night" className="flex flex-col border-white/10 p-6 sm:p-8">
          <p className="eyebrow text-[9px] text-pink">Checkout</p>
          <h2 className="display mt-3 text-[clamp(2rem,1.5rem+1.5vw,3rem)] text-white">How buying works.</h2>
          <ol className="mt-6 grid gap-4">
            {[
              { title: 'Pick a cheat or 404 Complete', body: 'Every price is on its card, and each profile has a full page with its features, requirements and limits.' },
              { title: 'Pay on Paddle', body: 'Sign in, open checkout and pay on Paddle’s hosted page. Card details go to Paddle, not this site, and Paddle issues the invoice.' },
              { title: 'Get access in your account', body: 'After Paddle confirms payment, the order appears in Orders and the licence key in Downloads. Access is attached to the account you signed in with.' },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="font-mono text-xs text-violet-light">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-night-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
            <ButtonLink to={orderMailto('Cheat or bundle')} variant="light" icon={<Mail className="size-4" aria-hidden />}>
              Ask about an order
            </ButtonLink>
            <ArrowLink to="/support#buy" tone="light" size="sm">
              Buying questions
            </ArrowLink>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8">
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[.025] px-6 py-8 sm:px-8">
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-violet/20 blur-[90px]" aria-hidden />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-[9px] text-pink">Not sure which cheat?</p>
              <h2 className="display mt-3 text-[clamp(1.8rem,1.4rem+1.2vw,2.7rem)] text-white">Start from how you play.</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                The category overview shows the kind of sessions each platform supports. It is a starting point, not a set of extra products.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/30">{GENRE_INTRO.rule}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/games" variant="outline" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                Browse categories
              </ButtonLink>
              <ButtonLink to="/docs" variant="outline">
                Read the docs
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-[1440px] px-5 pb-8 text-center text-[12px] leading-relaxed text-white/25 sm:px-8">{SITE.disclaimer}</p>
    </div>
  )
}
