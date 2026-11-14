import { ArrowRight, Check, Code2, GitBranch, Package, ShieldCheck, Workflow } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

import { ArrowLink, Badge, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { Nav } from '../components/Nav'
import { TrustBar } from '../components/Storefront'
import { APP, CHANGELOG, FEATURES, PIPELINE, PLATFORMS, PRICING_FAQ, SITE } from '../data'
import { useDocumentTitle } from '../lib/storage'

const ICONS = [GitBranch, Package, Check, ShieldCheck, Code2, Workflow]

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -inset-8 rounded-full bg-violet/20 blur-[90px]" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a12] shadow-[0_35px_100px_-40px_rgba(0,0,0,.9)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ff6b75]" />
            <span className="size-2 rounded-full bg-[#f5c15b]" />
            <span className="size-2 rounded-full bg-[#52d99a]" />
            <span className="ml-2 font-mono text-[10px] tracking-[.16em] text-white/55">LUNA DESKTOP</span>
          </div>
          <Badge tone="outline">PREVIEW</Badge>
        </div>
        <div className="grid min-h-[330px] grid-cols-[116px_1fr] sm:grid-cols-[145px_1fr]">
          <aside className="border-r border-white/10 bg-white/[.02] p-3">
            <p className="caps text-white/35">Workspace</p>
            <div className="mt-4 grid gap-2">
              {['Overview', 'Projects', 'Dependencies', 'Builds', 'Deploy'].map((item, index) => (
                <div key={item} className={`rounded-lg px-2.5 py-2 text-[11px] ${index === 1 ? 'bg-violet/20 text-violet-light' : 'text-white/50'}`}>{item}</div>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-white/10 p-2">
              <p className="caps text-white/35">Target</p>
              <p className="mt-2 text-xs text-white/80">FiveM server</p>
            </div>
          </aside>
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><p className="caps text-violet-light">Project overview</p><p className="mt-2 text-lg font-medium text-white">Sample workspace</p></div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] text-white/45">DEVELOPMENT</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[.03] p-3"><p className="text-[10px] text-white/45">Resources</p><p className="mt-1 text-xl font-semibold text-white">—</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[.03] p-3"><p className="text-[10px] text-white/45">Build state</p><p className="mt-1 text-xl font-semibold text-white">Preview</p></div>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 p-3">
              <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/85">Example validation</p><Badge tone="outline">SAMPLE</Badge></div>
              <div className="mt-3 grid gap-2">
                {['Manifest references', 'Shared dependencies', 'Build output'].map((item) => <div key={item} className="flex items-center gap-2 text-[11px] text-white/55"><Check className="size-3.5 text-emerald-300" />{item}</div>)}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-violet/15 px-3 py-3">
              <div><p className="text-[10px] text-violet-light">Example build</p><p className="mt-1 font-mono text-xs text-white">build-0001</p></div>
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
    <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-card px-5 pt-3 pb-8 sm:px-8 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-48 size-[38rem] rounded-full bg-violet/20 blur-[130px]" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/80 bg-black/20 px-1 py-2 font-mono text-[10px] tracking-[.13em] text-muted uppercase">
          <Link to="/status" className="inline-flex items-center gap-2 transition-colors hov:text-violet-light"><span className="size-1.5 rounded-full bg-violet" />LUNA SOFTWARE PLATFORM</Link>
          <span>FIVEM · ROBLOX · v{APP.version}</span>
        </div>
        <Nav />
        <div className="relative mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-8">
          <div>
            <p className="caps text-violet">Tools for the people who build</p>
            <h1 className="display mt-5 text-[clamp(3.2rem,7.6vw,6.8rem)] leading-[.9]">
              <span className="block">Build with</span>
              <span className="block bg-gradient-to-r from-white via-violet-light to-violet bg-clip-text text-transparent">confidence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-pretty text-ink-2">
              A focused desktop toolkit for FiveM and Roblox creators. Inspect projects, validate dependencies, create repeatable builds, and manage authorized deployments from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/store" variant="violet" size="lg" iconRight={<ArrowRight className="size-5" />}>Explore the store</ButtonLink>
              <ButtonLink to="/docs" variant="outline" size="lg">Read documentation</ButtonLink>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-violet" />Windows + macOS</span>
              <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-violet" />Offline-first builds</span>
              <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-violet" />CLI + desktop workflow</span>
            </div>
            <TrustBar className="mt-8 max-w-xl" />
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }}>
            <HeroPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Workflows() {
  return (
    <section className="grid gap-2">
      <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="caps text-violet">One desktop application</p><Title lines={['Choose your', 'workflow']} align="left" /></div>
        <div className="max-w-md"><p className="text-sm leading-relaxed text-muted">LUNA shares the same build foundation across both platforms. Each workflow adds the checks, requirements, and publishing steps relevant to your project.</p><ArrowLink to="/store" size="sm" className="mt-4">Browse all workflows</ArrowLink></div>
      </Card>
      <div className="grid gap-2 md:grid-cols-2">
        {PLATFORMS.map((platform, index) => (
          <Reveal key={platform.slug} delay={index * .07}>
            <Card className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><Badge tone="outline">{platform.name}</Badge><h3 className="display mt-4 text-[clamp(2rem,1.5rem+2.1vw,3.2rem)]">{platform.name}</h3></div>
                <div className="w-24 shrink-0"><Holo kind={platform.art} /></div>
              </div>
              <p className="mt-3 text-[15px] text-violet">{platform.tagline}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{platform.intro}</p>
              <ul className="mt-6 grid gap-2.5">
                {platform.features.slice(0, 3).map((feature) => <li key={feature.title} className="flex items-start gap-2.5 text-sm text-ink-2"><Check className="mt-0.5 size-4 shrink-0 text-violet" />{feature.title}</li>)}
              </ul>
              <ArrowLink to={`/products/${platform.slug}`} size="sm" className="mt-7">Explore {platform.name}</ArrowLink>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="grid gap-2">
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div><p className="caps text-violet">Made for repeatable work</p><Title lines={['The details', 'matter']} align="left" /></div>
        <p className="max-w-md text-sm leading-relaxed text-muted">No mystery steps. LUNA makes project structure, dependencies, build results, and deployment actions easier to inspect.</p>
      </Card>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = ICONS[index % ICONS.length]
          return <Reveal key={feature.title} delay={(index % 3) * .04}><Card className="h-full p-6"><span className="grid size-11 place-items-center rounded-xl border border-violet/30 bg-violet/10 text-violet-light"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold tracking-[-.025em]">{feature.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p></Card></Reveal>
        })}
      </div>
    </section>
  )
}

function Pipeline() {
  return (
    <section className="grid gap-2">
      <Card tone="night" className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div><p className="caps text-violet-light">From source to release</p><Title lines={['One clear', 'pipeline']} align="left" /></div>
        <p className="max-w-md text-sm leading-relaxed text-night-muted">Build, bundle, and deploy with a workflow you can inspect and repeat.</p>
      </Card>
      <div className="grid gap-2 md:grid-cols-3">
        {PIPELINE.map((step) => <Card key={step.step} className="flex flex-col p-6"><span className="font-mono text-4xl text-violet">{step.step}</span><h3 className="mt-6 text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p><code className="mt-auto pt-6 text-xs text-ink-2">$ {step.command}</code></Card>)}
      </div>
    </section>
  )
}

function LatestUpdate() {
  const latest = CHANGELOG[0]
  if (!latest) return null
  return (
    <section className="grid gap-2 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="flex flex-col justify-between gap-8 p-6 sm:p-8"><div><p className="caps text-violet">Release center</p><Title lines={['Always know', 'what changed']} align="left" /></div><ArrowLink to="/changelog" size="sm">View all updates</ArrowLink></Card>
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2"><Badge tone="violet">v{latest.version}</Badge><span className="text-sm text-muted">{latest.date}</span>{latest.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
        <h3 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{latest.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{latest.body}</p>
        <ArrowLink to="/changelog" size="sm" className="mt-6">Read release notes</ArrowLink>
      </Card>
    </section>
  )
}

function Closing() {
  return (
    <section className="grid gap-2 lg:grid-cols-[1.1fr_.9fr]">
      <Card tone="violet" className="flex flex-col justify-between gap-8 p-6 sm:p-8">
        <div><p className="caps text-white/70">Get started with LUNA</p><h2 className="display mt-4 text-[clamp(2.5rem,4vw,4.5rem)]">Your next build starts here.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-white/80">Explore the platform workflows, compare the available plans, and read the setup guide before installing.</p></div>
        <div className="flex flex-wrap gap-3"><ButtonLink to="/pricing" variant="light">Compare plans</ButtonLink><ButtonLink to="/store" variant="outline">Browse store</ButtonLink></div>
      </Card>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-violet" /><p className="caps text-violet">Clear boundaries</p></div>
        <h2 className="mt-4 text-2xl font-semibold">Built for projects you own.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">LUNA is for legitimate development, validation, packaging, and authorized deployment. It does not inject into, automate, or interfere with live game clients.</p>
        <div className="mt-6 border-t border-line pt-5"><Link to="/support" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-violet hov:text-violet-light">Talk to support <ArrowRight className="size-4" /></Link></div>
      </Card>
    </section>
  )
}

export function Home() {
  useDocumentTitle(SITE.name)
  return (
    <div className="grid gap-2 p-2">
      <Hero />
      <Workflows />
      <Capabilities />
      <Pipeline />
      <LatestUpdate />
      <Card as="section" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="caps text-violet">Questions before you start?</p><Title lines={['Good to', 'know']} align="left" /><ArrowLink to="/docs" size="sm" className="mt-6">Read documentation</ArrowLink></div>
        <Accordion items={PRICING_FAQ} />
      </Card>
      <Closing />
      <p className="px-2 pb-2 text-center text-xs text-muted">{SITE.tagline} · {SITE.email}</p>
    </div>
  )
}
