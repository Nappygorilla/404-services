import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  ChevronLeft,
  CreditCard,
  ChevronRight,
  Download,
  GitBranch,
  Package,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'

import { Badge, SectionHead } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Accordion } from '../components/Content'
import { Nav } from '../components/Nav'
import { BundleBanner, ToolCard } from '../components/ProductCards'
import { APP, BUNDLE, FEATURES, PRICING_FAQ, SITE, TOOLS } from '../data'
import { asset } from '../lib/asset'
import { useDocumentTitle } from '../lib/storage'

const FEATURE_ICONS = {
  graph: Workflow,
  package: Package,
  check: ScanSearch,
  rocket: Rocket,
  git: GitBranch,
  terminal: Terminal,
}

const RAIL = [...TOOLS.filter((tool) => tool.featured), ...TOOLS.filter((tool) => !tool.featured)].slice(0, 8)
const COMPARE_AT = TOOLS.reduce((sum, tool) => sum + tool.price, 0)

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[980px]">
      <div className="absolute -inset-x-16 top-12 h-3/4 rounded-[50%] bg-violet/25 blur-[100px]" aria-hidden />
      <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#090710]/95 shadow-[0_50px_140px_-45px_rgb(0_0_0/.98)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ff6b75]" />
            <span className="size-2 rounded-full bg-[#f5c15b]" />
            <span className="size-2 rounded-full bg-[#52d99a]" />
            <span className="ml-2 font-mono text-[10px] tracking-[.16em] text-white/55">404 LOADER</span>
          </div>
          <Badge tone="outline">SAMPLE PROFILE</Badge>
        </div>
        <div className="grid min-h-[320px] grid-cols-[104px_1fr] sm:grid-cols-[160px_1fr]">
          <aside className="border-r border-white/10 bg-white/[.02] p-3 sm:p-4">
            <p className="caps text-white/35">Workspace</p>
            <div className="mt-4 grid gap-1.5">
              {['Dashboard', 'Profiles', 'Visuals', 'Aim', 'Settings'].map((item, index) => (
                <div key={item} className={`rounded-lg px-2.5 py-2 text-[11px] ${index === 1 ? 'bg-violet/25 text-violet-light' : 'text-white/45'}`}>{item}</div>
              ))}
            </div>
            <div className="mt-8 hidden rounded-lg border border-white/10 p-3 sm:block">
              <p className="caps text-white/35">Game</p>
              <p className="mt-2 text-xs text-white/80">FiveM</p>
            </div>
          </aside>
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="caps text-violet-light">Profile overview</p>
                <p className="mt-2 text-lg font-medium text-white sm:text-xl">FiveM External</p>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] text-white/45">LICENSED</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[.03] p-3"><p className="text-[10px] text-white/45">Profiles</p><p className="mt-1 text-xl font-semibold text-white">14</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[.03] p-3"><p className="text-[10px] text-white/45">Devices</p><p className="mt-1 text-xl font-semibold text-white">1 / 2</p></div>
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[.03] p-3 sm:col-span-1"><p className="text-[10px] text-white/45">Loader status</p><p className="mt-1 text-xl font-semibold text-acid">Working</p></div>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 p-3 sm:p-4">
              <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/85">Loader checks</p><Badge tone="outline">SAMPLE</Badge></div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {['Licence verified', 'Profile loaded', 'Modules ready'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[11px] text-white/55"><Check className="size-3.5 shrink-0 text-acid" />{item}</div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-violet/30 bg-violet/15 px-3 py-3">
              <div><p className="text-[10px] text-violet-light">Active profile</p><p className="mt-1 font-mono text-xs text-white">fivem-external</p></div>
              <Package className="size-5 text-violet-light" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 font-mono text-[9px] tracking-[.1em] text-white/35">
          <span>INTERFACE PREVIEW · SAMPLE DATA</span><span>v{APP.version}</span>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#07060b]">
      <img
        src={asset('/images/nocturne.webp')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(7_6_11/.34),rgb(7_6_11/.72)_48%,#07070b)]" aria-hidden />
      <div className="star-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="pointer-events-none absolute -top-48 left-1/2 size-[52rem] -translate-x-1/2 rounded-full bg-violet/20 blur-[150px]" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <Nav overlay />
        <div className="relative pb-16 pt-12 text-center sm:pb-20 sm:pt-16 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-3.5 py-2 text-[10px] text-white/75 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-acid shadow-[0_0_12px_rgb(185_255_75/.8)]" aria-hidden />
              Premium game modifications for FiveM &amp; Roblox
            </p>
            <h1 className="display mx-auto mt-7 max-w-5xl text-[clamp(3.4rem,1.2rem+8.2vw,8.4rem)] text-balance text-white">
              Play without <span className="bg-[linear-gradient(100deg,#fff_10%,#e9d5ff_48%,#ff7ad9_100%)] bg-clip-text text-transparent">limits.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-pretty text-white/65 sm:text-[17px]">
              External visuals, aim profiles, executors and mod menus for FiveM and Roblox. One loader, fourteen profiles, and a key delivered straight to your inbox.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink to="/store" variant="violet" size="lg" className="w-full sm:w-auto" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                Shop all {TOOLS.length} cheats
              </ButtonLink>
              <a href="#top-tools" className="round inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[.04] px-7 text-base font-medium text-white backdrop-blur-sm transition-colors hov:border-white/40 hov:bg-white/10 sm:w-auto">
                See the loader
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-white/45">
              <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> One-time licence</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> 12 months of updates</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> Windows 10 / 11</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 sm:mt-16"
          >
            <HeroPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FactStrip() {
  const facts = [
    { value: String(TOOLS.length), label: 'Cheat profiles' },
    { value: '02', label: 'Supported games' },
    { value: '01', label: 'Shared loader' },
    { value: '1×', label: 'One-time licence' },
  ]
  return (
    <div className="border-b border-white/10 bg-[#090710]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-white/10 px-5 sm:grid-cols-4 sm:px-8">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col items-center px-3 py-6 text-center sm:py-7">
            <span className="display text-[clamp(1.7rem,1.4rem+1vw,2.4rem)] text-white">{fact.value}</span>
            <span className="eyebrow mt-1 text-[9px] text-white/35">{fact.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopTools() {
  const railRef = useRef<HTMLDivElement>(null)
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })

  return (
    <section id="top-tools" className="relative scroll-mt-4 overflow-hidden py-18 sm:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet/50 to-transparent" aria-hidden />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Top cheats"
          title="The menu, unlocked."
          copy="Fourteen individual profiles with one honest price each. Start with the features you want; 404 Complete is optional."
        />
        <div className="mt-8 flex items-center justify-between gap-4">
          <Link to="/store" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-white/65 underline-offset-4 hov:text-white hov:underline">
            Browse the full menu <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => move(-1)} aria-label="Scroll cheats left" className="round grid size-10 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hov:border-violet hov:bg-violet/15 hov:text-white">
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Scroll cheats right" className="round grid size-10 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hov:border-violet hov:bg-violet/15 hov:text-white">
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
                  <div ref={railRef} className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Featured cheats">
          {RAIL.map((tool) => (
            <div key={tool.slug} className="w-[82vw] max-w-[340px] shrink-0 snap-start sm:w-[310px] lg:w-[300px]">
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: Blocks,
      title: 'Choose your cheat',
      body: 'Every profile has its own page, feature list and limits. Start with the one that matches how you play.',
      label: '01 · Browse',
    },
    {
      icon: CreditCard,
      title: 'Pay on Paddle',
      body: 'Sign in and pay on Paddle’s hosted checkout. Paddle handles the card, tax and invoice; card details never touch this site.',
      label: '02 · Buy',
    },
    {
      icon: Download,
      title: 'Load your profile',
      body: 'After Paddle confirms payment, your order and download access appear in your account. Activate two devices, choose your profile and save your config.',
      label: '03 · Load',
    },
  ]
  return (
    <section id="how-it-works" className="scroll-mt-4 border-y border-white/10 bg-[#090710] py-18 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <SectionHead
          eyebrow="How it works"
          title="From checkout to first session."
          copy="No account required to browse. No mystery steps after you pay — just the loader, the key and the docs."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article key={step.title} className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0912] p-6 transition-colors hov:border-violet/40 sm:p-7">
                <span className="pointer-events-none absolute -right-2 -bottom-8 display text-[7rem] leading-none text-white/[.035] select-none">{step.label.slice(0, 2)}</span>
                <span className="grid size-11 place-items-center rounded-xl border border-violet/30 bg-violet/10 text-violet-light">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="eyebrow mt-8 text-[9px] text-white/35">{step.label}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="relative overflow-hidden py-18 sm:py-24">
      <div className="pointer-events-none absolute top-0 right-0 size-[30rem] rounded-full bg-violet/10 blur-[130px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead eyebrow="Inside the loader" title="Built for the session." align="left" copy="No mystery menus. 404 keeps visuals, aim profiles, scripts and settings in one compact loader you can read at a glance." />
          <Link to="/docs" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-violet-light underline-offset-4 hov:text-white hov:underline">
            Read the docs <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon]
            return (
              <article key={feature.title} className="group flex flex-col rounded-[22px] border border-white/10 bg-white/[.025] p-6 transition-[border-color,background-color] hov:border-violet/35 hov:bg-white/[.045]">
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-violet/25 bg-violet/10 text-violet-light"><Icon className="size-[18px]" aria-hidden /></span>
                  <span className="font-mono text-[10px] text-white/20">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-[1.05rem] font-semibold tracking-[-0.025em] text-white">{feature.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/46">{feature.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="border-y border-white/10 bg-[#090710] py-18 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead eyebrow="Questions" title="Before you buy." copy="Straight answers about individual cheats, the optional bundle, delivery and account risk." />
        <div className="mt-9">
          <Accordion items={PRICING_FAQ} />
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink to="/support" variant="outline" iconRight={<ArrowUpRight className="size-4" aria-hidden />}>
            Ask a different question
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function Community() {
  return (
    <section className="relative overflow-hidden py-18 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="brand-wash relative overflow-hidden rounded-[28px] border border-white/12 px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="star-field pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-pink/25 blur-[90px]" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow text-pink">Community</p>
              <h2 className="display mt-4 max-w-2xl text-[clamp(2.3rem,1.7rem+2.5vw,4.2rem)] text-white">Join the 404 community.</h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
                Read release notes, ask a setup question in the forums, or open the repository and see how the loader site is made. Support is an email from a person, not a chatbot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/forums" variant="light" iconRight={<ArrowUpRight className="size-4" aria-hidden />}>Open the forums</ButtonLink>
              <a href="https://github.com/Nappygorilla/404-services" target="_blank" rel="noreferrer" className="round inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hov:border-white/45 hov:bg-white/10">
                GitHub <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#07060b] px-5 py-20 sm:px-8 sm:py-28">
      <div className="star-field pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/16 blur-[140px]" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow text-pink">Your next session</p>
        <h2 className="display mt-4 text-[clamp(2.8rem,2rem+4vw,5.8rem)] text-balance text-white">Pick your cheat. Play your way.</h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
          Start with one profile, keep the licence, and add the rest when you need them. 404 Complete is there if you want all fourteen.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/store" variant="violet" size="lg" className="w-full sm:w-auto" iconRight={<ArrowRight className="size-4" aria-hidden />}>
            Browse all cheats
          </ButtonLink>
          <ButtonLink to="/pricing" variant="outline" size="lg" className="w-full sm:w-auto">
            Compare prices
          </ButtonLink>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-[11px] text-white/35">
          <ShieldCheck className="size-3.5 text-acid" aria-hidden /> For accounts you own. Read the risk before you buy.
        </p>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle('Game cheats for FiveM & Roblox')
  return (
    <div className="overflow-hidden">
      <Hero />
      <FactStrip />
      <TopTools />
      <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8">
        <BundleBanner bundle={BUNDLE} compareAt={COMPARE_AT} />
      </div>
      <HowItWorks />
      <Capabilities />
      <Faq />
      <Community />
      <Closing />
      <div className="border-t border-white/10 bg-[#050408] px-5 py-5 text-center text-[11px] text-white/30">
        {SITE.tagline} · <a href={`mailto:${SITE.email}`} className="underline-offset-4 hover:text-white hover:underline">{SITE.email}</a>
      </div>
    </div>
  )
}
