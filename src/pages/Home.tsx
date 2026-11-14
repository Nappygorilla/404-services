import { ArrowRight, Boxes, Check, FileCode2, GitBranch, Package, Rocket, TerminalSquare } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { ArrowLink, Badge, Reveal, Title } from '../components/Bits'
import { BuildBand } from '../components/BuildBand'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { Nav } from '../components/Nav'
import { launchActive, launchPrice, useCurrency } from '../components/Price'
import { APP, CHANGELOG, FEATURES, HOME, PIPELINE, PLATFORMS, PRICING_FAQ, TIERS } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/storage'

const ICONS: Record<string, ReactNode> = {
  graph: <GitBranch className="size-5" strokeWidth={1.6} aria-hidden />,
  package: <Package className="size-5" strokeWidth={1.6} aria-hidden />,
  check: <Check className="size-5" strokeWidth={2} aria-hidden />,
  rocket: <Rocket className="size-5" strokeWidth={1.6} aria-hidden />,
  git: <FileCode2 className="size-5" strokeWidth={1.6} aria-hidden />,
  terminal: <TerminalSquare className="size-5" strokeWidth={1.6} aria-hidden />,
}

const TICKER = [
  'Offline builds',
  'No telemetry',
  'Signed updates',
  'Windows + macOS',
  'CLI + GUI',
  'FiveM + Roblox',
  'Lockfile resolution',
  'One-command deploy',
]

/** The mono status rail across the top of the hero. */
function HeroStatus() {
  return (
    <div className="-mx-5 -mt-3 mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line/80 bg-black/30 px-5 py-2 font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase sm:-mx-8 sm:px-8">
      <span className="flex items-center gap-1.5 text-acid">
        <span className="size-1.5 animate-pulse rounded-full bg-acid" aria-hidden />
        Build passing
      </span>
      <span className="hidden sm:inline">v{APP.version}</span>
      <span className="hidden sm:inline">Windows · macOS</span>
      <span className="ml-auto hidden text-faint md:inline">no telemetry · offline builds</span>
    </div>
  )
}

/** Scrolling strip of product facts, in mono. */
function Ticker() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card-sm)] border border-line bg-card py-3" aria-hidden>
      <div className="marquee-mask flex w-max animate-marquee items-center gap-8 whitespace-nowrap font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-3">
            <span className="text-violet">◆</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-[var(--radius-card)] bg-card px-5 pt-3 pb-8 sm:px-8 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-70" aria-hidden />
      <div className="pointer-events-none absolute -top-40 -right-32 size-[36rem] rounded-full bg-violet/20 blur-[130px]" aria-hidden />
      <HeroStatus />
      <Nav />
      <div className="relative mt-8 grid gap-10 lg:mt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div>
          <p className="caps text-violet">{HOME.eyebrow}</p>
          <h1 id="hero-title" className="display mt-4 text-[clamp(3.1rem,9.6vw,7.4rem)]">
            {HOME.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className={cx(
                    'block',
                    i === HOME.headline.length - 1 && 'bg-gradient-to-br from-white via-violet-light to-violet bg-clip-text text-transparent',
                  )}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-pretty text-ink-2">{HOME.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/pricing" variant="violet" size="lg" iconRight={<ArrowRight className="size-5" />}>
              Get {APP.name}
            </ButtonLink>
            <ButtonLink to="/docs" variant="outline" size="lg">
              Read the docs
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {['Windows', 'macOS', 'Offline builds', 'CLI + GUI'].map((t) => (
              <li key={t}>
                <Badge tone="outline">{t}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-[min(88vw,520px)]" aria-hidden>
          <Holo kind="knot" motion priority />
        </div>
      </div>
    </section>
  )
}

function Platforms() {
  return (
    <section aria-labelledby="platforms-title" className="grid gap-2">
      <Card className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="order-2 md:order-1">
          <p className="max-w-md text-muted">{HOME.platformNote}</p>
          <ArrowLink to="/games" size="sm" tone="ink" className="mt-4">
            Browse game categories
          </ArrowLink>
        </div>
        <Title id="platforms-title" lines={HOME.platformTitle} className="order-1 md:order-2" />
      </Card>
      <ul className="grid gap-2 md:grid-cols-2">
        {PLATFORMS.map((p, i) => (
          <li key={p.slug} className="h-full">
            <Reveal delay={i * 0.08} className="h-full">
              <Card as="article" tone={i === 1 ? 'violet' : 'white'} className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className={i === 1 ? 'caps text-white/75' : 'caps text-muted'}>Platform</p>
                    <h3 className="display mt-3 text-[clamp(2rem,1.4rem+2vw,3.2rem)]">{p.name}</h3>
                  </div>
                  <div className="w-24 shrink-0" aria-hidden>
                    <Holo kind={p.art} />
                  </div>
                </div>
                <p className={i === 1 ? 'mt-4 max-w-sm text-white/90' : 'mt-4 max-w-sm text-ink-2'}>{p.tagline}</p>
                <ul className="mt-6 mb-8 grid gap-2.5 text-[15px]">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f.title} className="flex items-start gap-2.5">
                      <Check className={i === 1 ? 'mt-0.5 size-4 shrink-0 text-white' : 'mt-0.5 size-4 shrink-0 text-violet'} aria-hidden />
                      <span>{f.title}</span>
                    </li>
                  ))}
                </ul>
                <ArrowLink to={`/platforms/${p.slug}`} tone={i === 1 ? 'light' : 'violet'} size="sm" className="mt-auto">
                  {p.cta}
                </ArrowLink>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Pipeline() {
  return (
    <section aria-labelledby="pipeline-title" className="grid gap-2">
      <Card tone="night" className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1.2fr] md:items-end">
        <Title id="pipeline-title" lines={HOME.pipelineTitle} align="left" size="lg" />
        <p className="max-w-md text-night-muted md:justify-self-end md:text-right">{HOME.pipelineNote}</p>
      </Card>
      <ol className="grid gap-2 md:grid-cols-3">
        {PIPELINE.map((s, i) => (
          <li key={s.step} className="h-full">
            <Reveal delay={i * 0.06} className="h-full">
              <Card className="flex h-full flex-col p-6 sm:p-7">
                <p className="text-[3.4rem] leading-none font-normal tracking-[-0.06em] text-violet tabular-nums">{s.step}</p>
                <h3 className="mt-10 text-2xl font-medium tracking-[-0.03em] uppercase">{s.title}</h3>
                <p className="mt-3 text-[15px] text-muted">{s.body}</p>
                <code className="mt-auto block pt-6 text-[13px] text-ink-2">$ {s.command}</code>
              </Card>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Features() {
  return (
    <section aria-labelledby="features-title" className="grid gap-2">
      <Card className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="order-2 max-w-md text-muted md:order-1">{HOME.featuresNote}</p>
        <Title id="features-title" lines={HOME.featuresTitle} className="order-1 md:order-2" />
      </Card>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <li key={f.title} className="h-full">
            <Reveal delay={(i % 3) * 0.05} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <span className="round grid size-11 place-items-center rounded-full border border-violet/35 bg-violet/15 text-violet-light">{ICONS[f.icon]}</span>
                <h3 className="mt-5 text-lg font-medium tracking-[-0.03em]">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChangelogTeaser() {
  const latest = CHANGELOG[0]
  return (
    <section aria-labelledby="changelog-title" className="grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="flex min-h-[260px] flex-col justify-between gap-8 p-6 sm:p-8">
        <Title id="changelog-title" lines={HOME.changelogTitle} align="left" />
        <div className="flex items-end justify-between gap-6">
          <div className="w-24" aria-hidden>
            <Holo kind="star" motion />
          </div>
          <ArrowLink to="/changelog" size="sm">
            Full changelog
          </ArrowLink>
        </div>
      </Card>
      <Card as="article" className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="violet">v{latest.version}</Badge>
          <span className="text-sm text-muted">{latest.date}</span>
          {latest.tags.map((t) => (
            <Badge key={t} tone="neutral">
              {t}
            </Badge>
          ))}
        </div>
        <h3 className="mt-5 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-tight font-medium tracking-[-0.035em]">{latest.title}</h3>
        <p className="mt-3 max-w-xl text-muted">{latest.body}</p>
        <ul className="mt-6 grid gap-2.5 text-[15px]">
          {latest.items.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}

function PricingTeaser() {
  const { format } = useCurrency()
  const live = launchActive()
  return (
    <section aria-labelledby="pricing-title" className="grid gap-2">
      <Card className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="order-2 max-w-md text-muted md:order-1">{HOME.pricingNote}</p>
        <Title id="pricing-title" lines={HOME.pricingTitle} className="order-1 md:order-2" />
      </Card>
      <ul className="grid gap-2 md:grid-cols-3">
        {TIERS.map((t) => (
          <li key={t.id} className="h-full">
            <Card tone={t.featured ? 'violet' : 'white'} className="flex h-full flex-col p-6 sm:p-7">
              <h3 className={t.featured ? 'text-2xl font-medium uppercase tracking-[-0.03em] text-white' : 'text-2xl font-medium uppercase tracking-[-0.03em]'}>{t.name}</h3>
              <p className={t.featured ? 'mt-1 text-sm text-white/75' : 'mt-1 text-sm text-muted'}>
                {t.seats} · {t.machines}
              </p>
              <p className="mt-6 text-[clamp(2.2rem,1.6rem+1.4vw,3rem)] leading-none tracking-[-0.05em]">
                {format(live ? launchPrice(t.price) : t.price)}
              </p>
              <p className={t.featured ? 'mt-2 text-[13px] text-white/75' : 'mt-2 text-[13px] text-muted'}>
                {t.price === 0 ? 'Free forever' : live ? `Launch price, then ${format(t.price)}` : 'One-time licence'}
              </p>
              <ul className="mt-6 mb-8 grid gap-2 text-[15px]">
                {t.points.slice(0, 3).map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Check className={t.featured ? 'mt-0.5 size-4 shrink-0 text-white' : 'mt-0.5 size-4 shrink-0 text-violet'} aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <ButtonLink to="/pricing" variant={t.featured ? 'light' : 'outline'} className="mt-auto">
                {t.cta}
              </ButtonLink>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Faq() {
  return (
    <Card as="section" aria-labelledby="faq-title" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
      <div className="flex flex-col justify-between gap-8">
        <Title id="faq-title" lines={HOME.faqTitle} align="left" />
        <ArrowLink to="/support" size="sm">
          Ask us something else
        </ArrowLink>
      </div>
      <Accordion items={PRICING_FAQ} />
    </Card>
  )
}

function Cta() {
  return (
    <Card as="section" aria-labelledby="cta-title" className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-end">
      <div className="mx-auto w-[min(64vw,300px)] md:mx-0" aria-hidden>
        <Holo kind="cloud" motion />
      </div>
      <div className="flex flex-col items-end gap-6 text-right">
        <Title id="cta-title" lines={HOME.cta.title} size="lg" />
        <p className="max-w-md text-muted">{HOME.cta.body}</p>
        <ButtonLink to="/pricing" variant="violet" size="lg" iconRight={<ArrowRight className="size-5" />}>
          {HOME.cta.action}
        </ButtonLink>
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Boxes className="size-4" aria-hidden />
          {APP.version} · {APP.size} · macOS and Windows
        </p>
      </div>
    </Card>
  )
}

export function Home() {
  useDocumentTitle()
  return (
    <div className="grid gap-2 p-2">
      <Hero />
      <Ticker />
      <Platforms />
      <Pipeline />
      <BuildBand />
      <Features />
      <ChangelogTeaser />
      <PricingTeaser />
      <Faq />
      <Cta />
    </div>
  )
}
