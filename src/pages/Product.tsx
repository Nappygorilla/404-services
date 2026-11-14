import { ArrowRight, Check, Download, FileText, ShieldCheck, X } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, PLATFORMS, platformBySlug } from '../data'
import { useDocumentTitle } from '../lib/storage'
import { NotFound } from './NotFound'

export function Product() {
  const { slug = '' } = useParams()
  const platform = platformBySlug(slug)
  useDocumentTitle(platform ? `${platform.name} workflow` : 'Product not found')

  if (!platform) {
    return <NotFound title="Product not found" body="This workflow is not in the LUNA catalog. Browse the supported platforms to see what is available." to="/store" action="Browse the store" />
  }

  const other = PLATFORMS.find((item) => item.slug !== platform.slug)

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={[platform.name, 'workflow']}
        eyebrow="Included in LUNA Desktop"
        intro={platform.intro}
        art={<Holo kind={platform.art} motion />}
        titleSize="compact"
        aside={
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/pricing" variant="violet" iconRight={<ArrowRight className="size-4" />}>View LUNA plans</ButtonLink>
            <ArrowLink to="/docs" tone="ink" size="sm">Documentation</ArrowLink>
          </div>
        }
      />

      <Card className="grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">Supported workflow</Badge>
            <Badge tone="outline">LUNA Desktop v{APP.version}</Badge>
          </div>
          <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em]">Designed for projects you own or are authorized to manage.</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">LUNA focuses on project files, dependency validation, repeatable builds, and authorized publishing. It does not modify or automate a live game client.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-soft p-4 text-sm text-ink-2">
          <ShieldCheck className="size-5 text-violet" aria-hidden />
          No game-client injection
        </div>
      </Card>

      <section aria-labelledby="product-features" className="grid gap-2">
        <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="caps text-violet">Capabilities</p>
            <Title id="product-features" lines={['What is', 'included']} align="left" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">A closer look at the tools available in the {platform.name} workflow.</p>
        </Card>
        <div className="grid gap-2 md:grid-cols-2">
          {platform.features.map((feature, index) => (
            <Card key={feature.title} className="p-6 sm:p-7">
              <span className="caps text-violet">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-2 lg:grid-cols-2">
        <Card tone="night" className="p-6 sm:p-8">
          <p className="caps text-violet-light">Getting started</p>
          <h2 className="mt-3 text-2xl font-medium text-white">Your workflow</h2>
          <ol className="mt-6 grid gap-0 divide-y divide-white/10">
            {platform.workflow.map((step, index) => (
              <li key={step} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="font-mono text-sm text-violet-light">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-relaxed text-white/85">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="p-6 sm:p-8">
          <p className="caps text-violet">Requirements</p>
          <h2 className="mt-3 text-2xl font-medium">Before you begin</h2>
          <ul className="mt-6 grid gap-3">
            {[...platform.requirements, ...APP.requirements].map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {requirement}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="caps text-danger">Limitations</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em]">What LUNA does not do</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">These boundaries are intentional and help keep the tool focused on legitimate project development.</p>
          </div>
          <ul className="grid gap-3">
            {platform.limits.map((limit) => (
              <li key={limit} className="flex gap-3 rounded-lg bg-soft px-4 py-3 text-sm leading-relaxed text-ink-2">
                <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                {limit}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="caps text-violet">Next step</p>
          <h2 className="mt-2 text-2xl font-medium">Ready to explore LUNA Desktop?</h2>
          <p className="mt-2 text-sm text-muted">Compare the available licence plans or review the documentation first.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/pricing" variant="violet">Compare plans</ButtonLink>
          <ButtonLink to="/downloads" variant="outline" icon={<Download className="size-4" />}>My downloads</ButtonLink>
        </div>
      </Card>

      {other && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-4">
          <div>
            <p className="caps text-muted">Explore another workflow</p>
            <p className="mt-1 text-xl font-medium">{other.name}</p>
          </div>
          <Link to={`/products/${other.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-violet hov:text-violet-light">
            View {other.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}

      <div className="sr-only"><FileText /></div>
    </div>
  )
}
