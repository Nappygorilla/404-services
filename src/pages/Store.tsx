import { ArrowRight, Check, Mail, Search } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { ArrowLink, Chip, EmptyState, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { CurrencySwitch } from '../components/Price'
import { BundleBanner, ToolCard } from '../components/ProductCards'
import { BUNDLE, GENRE_INTRO, LICENCE_INCLUDES, PLATFORM_LABEL, SITE, TOOL_KINDS, TOOLS } from '../data'
import { orderMailto } from '../lib/commerce'
import { useDocumentTitle } from '../lib/storage'

const PLATFORM_FILTERS = [
  { id: 'all', label: 'All platforms' },
  { id: 'fivem', label: 'FiveM' },
  { id: 'roblox', label: 'Roblox' },
  { id: 'both', label: 'Both platforms' },
] as const

/*
  The shop, modelled on per-product cheat storefronts: dense product grid,
  status and platform badges, a filter bar, and one buy action per product.
  The difference is what is being sold. Every card is a real development tool,
  the price is one-time, and checkout is the honest email path. The bundle is
  optional and derived from the same catalogue.
*/
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
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Every tool,', 'sold on its own']}
        eyebrow="Store"
        intro={`${TOOLS.length} development tools for FiveM and Roblox. Every tool has its own price, its own page and its own buy action. Start with the problem in front of you; the optional complete toolkit is here if you want all of them.`}
        art={<Holo kind="prism" motion />}
        artSize="compact"
        titleSize="compact"
        aside={
          <div className="mt-6 flex flex-col gap-4">
            <CurrencySwitch />
            <p className="text-[13px] leading-relaxed text-muted">
              One-time prices. Every product includes twelve months of updates for one person on two machines.
            </p>
            <ArrowLink to="/status" tone="ink" size="sm">
              Service status
            </ArrowLink>
          </div>
        }
      />

      <section id="catalogue" aria-labelledby="catalogue-title" className="grid scroll-mt-2 gap-2">
        <Card className="grid gap-4 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <p className="caps text-violet">Platform</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by platform">
                {PLATFORM_FILTERS.map((item) => (
                  <Chip key={item.id} selected={platform === item.id} onClick={() => setFilter('platform', item.id)}>
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>
            <label className="relative block">
              <span className="sr-only">Search tools</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setFilter('q', event.target.value)}
                placeholder="Search tools…"
                className="round h-11 w-full appearance-none rounded-full border border-line-strong bg-soft pr-4 pl-9 text-[15px] outline-none transition-colors placeholder:text-faint focus-visible:border-violet [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
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
            <p className="text-sm text-muted tabular-nums" aria-live="polite">
              {shown.length} of {TOOLS.length} tools
            </p>
          </div>
        </Card>

        <div className="flex flex-wrap items-end justify-between gap-3 px-2 pt-2">
          <div>
            <p className="caps text-violet">Catalogue</p>
            <h2 id="catalogue-title" className="mt-1 text-2xl font-medium tracking-[-0.035em]">
              {platform === 'all' ? 'All tools' : `${PLATFORM_LABEL[platform]} tools`}
            </h2>
          </div>
          {(platform !== 'all' || kind !== 'all' || query) && (
            <button type="button" onClick={reset} className="min-h-10 text-sm font-medium text-violet underline-offset-4 hov:underline">
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {shown.length === 0 && (
          <Card className="p-2">
            <EmptyState
              title="Nothing matches"
              body="No tool fits that search and filter combination. Try a shorter word, another platform, or clear the filters."
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

      <BundleBanner bundle={BUNDLE} compareAt={compareAt} />

      <section aria-labelledby="store-includes" className="grid gap-2 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="flex flex-col p-6 sm:p-8">
          <p className="caps text-violet">Every product</p>
          <Title id="store-includes" lines={['What comes', 'with it']} align="left" size="sm" />
          <ul className="mt-6 grid gap-3">
            {LICENCE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-7">
            <ArrowLink to="/pricing" size="sm">
              See every price
            </ArrowLink>
          </div>
        </Card>

        <Card tone="night" className="flex flex-col p-6 sm:p-8">
          <p className="caps text-violet-light">Checkout</p>
          <Title lines={['How buying', 'works']} align="left" size="sm" />
          <ol className="mt-6 grid gap-4">
            {[
              { title: 'Pick a tool or the bundle', body: 'Every price is on its card, and each product has a full page with what is included, requirements and limits.' },
              { title: 'Email us the product name', body: 'We reply with a payment link and a VAT invoice. Card details go to the payment provider, not this site.' },
              { title: 'Get the key and download', body: 'After payment, the licence key and download link arrive by email. Paste the key into LUNA Desktop once.' },
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
            <ButtonLink to={orderMailto('Tool or bundle')} variant="light" icon={<Mail className="size-4" aria-hidden />}>
              Ask about an order
            </ButtonLink>
            <ArrowLink to="/support#buy" tone="light" size="sm">
              Buying questions
            </ArrowLink>
          </div>
        </Card>
      </section>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <p className="caps text-violet">Not sure which tool?</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Start from what you are building.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The category overview shows the kind of projects each platform supports. It is a starting point, not a set of extra products.
          </p>
          <p className="mt-2 text-xs text-muted">{GENRE_INTRO.rule}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/games" variant="outline" iconRight={<ArrowRight className="size-4" />}>
            Browse categories
          </ButtonLink>
          <ButtonLink to="/docs" variant="outline">
            Read the docs
          </ButtonLink>
        </div>
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">{SITE.disclaimer}</p>
    </div>
  )
}
