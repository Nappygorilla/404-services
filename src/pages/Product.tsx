import { ArrowLeft, ArrowRight, Check, Download, ShieldCheck, X } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { ProductBuyBox, ToolCard } from '../components/ProductCards'
import { APP, BUNDLE, LICENCE_INCLUDES, PLATFORM_LABEL, TOOLS, isBundle, productBySlug } from '../data'
import { checkoutHref } from '../lib/commerce'
import { useDocumentTitle } from '../lib/storage'
import { NotFound } from './NotFound'

export function Product() {
  const { slug = '' } = useParams()
  const product = productBySlug(slug)
  useDocumentTitle(product ? product.name : 'Product not found')

  // The old platform product URLs are kept as redirects, never dead ends.
  if (slug === 'fivem' || slug === 'roblox') {
    return <Navigate to={`/store?platform=${slug}`} replace />
  }

  if (!product) {
    return (
      <NotFound
        title="Product not found"
        body="This product is not in the LUNA catalogue. Browse the store to see every tool currently sold."
        to="/store"
        action="Browse the store"
      />
    )
  }

  const bundle = isBundle(product)
  const included = bundle ? TOOLS.filter((tool) => product.includes.includes(tool.slug)) : []
  const backTo = !bundle && product.platform !== 'both' ? `/store?platform=${product.platform}` : '/store'
  const backLabel = !bundle && product.platform !== 'both' ? `${PLATFORM_LABEL[product.platform]} tools` : 'All tools'
  const requirements = [...new Set([...product.requirements, ...APP.requirements])]

  const related = bundle
    ? []
    : [...TOOLS]
        .filter(
          (tool) =>
            tool.slug !== product.slug &&
            (tool.kind === product.kind ||
              tool.platform === product.platform ||
              tool.platform === 'both' ||
              product.platform === 'both'),
        )
        .sort((a, b) => Number(b.kind === product.kind) - Number(a.kind === product.kind))
        .slice(0, 3)

  return (
    <div className="grid gap-2 p-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
        <Link to={backTo} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted transition-colors hov:text-violet">
          <ArrowLeft className="size-4" aria-hidden />
          Back to {backLabel}
        </Link>
        <span className="caps text-faint">{bundle ? 'Optional bundle' : `${PLATFORM_LABEL[product.platform]} · ${product.kind}`}</span>
      </div>

      <PageHero
        title={bundle ? ['The complete', 'toolkit'] : product.name.split(' ')}
        eyebrow={bundle ? 'Optional bundle · one-time purchase' : `${PLATFORM_LABEL[product.platform]} · ${product.kind} · one-time purchase`}
        intro={product.tagline}
        art={<Holo kind={product.art} motion />}
        artSize="compact"
        titleSize="compact"
        aside={<ProductBuyBox product={product} />}
      />

      <Card className="grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid" aria-hidden />
              Available
            </Badge>
            <Badge tone="outline">LUNA Desktop v{APP.version}</Badge>
            {bundle && <Badge>{included.length} tools included</Badge>}
          </div>
          <p className="caps mt-4 text-violet">About this {bundle ? 'bundle' : 'tool'}</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{product.tagline}</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
            {product.description} It works with project files, validation, builds and authorized publishing; it does not modify or automate a live game client, and it cannot publish to a server or experience you do not control.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-soft p-4 text-sm text-ink-2">
          <ShieldCheck className="size-5 text-violet" aria-hidden />
          No game-client injection
        </div>
      </Card>

      <section aria-labelledby="product-included" className="grid gap-2">
        <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="caps text-violet">{bundle ? 'Everything in the bundle' : 'What this tool includes'}</p>
            <Title id="product-included" lines={bundle ? ['The whole', 'toolkit'] : ['What you', 'get']} align="left" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            {bundle
              ? `Every current tool, with a link to its own page. The bundle includes ${included.length} products and is sold as one optional licence.`
              : 'The work this tool does, plus the licence terms every LUNA product shares.'}
          </p>
        </Card>

        {bundle ? (
          <Card className="p-2">
            <ul className="grid gap-2 md:grid-cols-2">
              {included.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/products/${tool.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-card-sm)] border border-line p-5 transition-colors hov:border-violet hov:bg-violet/5"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="outline">{PLATFORM_LABEL[tool.platform]}</Badge>
                      <Badge>{tool.kind}</Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-medium tracking-[-0.03em] group-hov:text-violet">{tool.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{tool.tagline}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-violet">
                      View product <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {product.deliverables.map((item, index) => (
              <Card key={item} className="p-6 sm:p-7">
                <span className="caps text-violet">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">{item}</h3>
              </Card>
            ))}
            <Card className="p-6 sm:p-7">
              <p className="caps text-violet">Licence terms</p>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">Every product includes</h3>
              <ul className="mt-4 grid gap-2">
                {LICENCE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </section>

      <section className="grid gap-2 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <p className="caps text-violet">Requirements</p>
          <h2 className="mt-3 text-2xl font-medium">Before you begin</h2>
          <ul className="mt-6 grid gap-3">
            {requirements.map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {requirement}
              </li>
            ))}
          </ul>
        </Card>
        <Card tone="night" className="p-6 sm:p-8">
          <p className="caps text-violet-light">Limits</p>
          <h2 className="mt-3 text-2xl font-medium text-white">What this product does not do</h2>
          <ul className="mt-6 grid gap-3">
            {product.limits.map((limit) => (
              <li key={limit} className="flex gap-3 rounded-lg bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/80">
                <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                {limit}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-tools" className="grid gap-2">
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div>
              <p className="caps text-violet">Related tools</p>
              <Title id="related-tools" lines={['Often bought', 'alongside']} align="left" size="sm" />
            </div>
            <Link to={backTo} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-violet hov:text-violet-light">
              Browse {backLabel} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Card>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {related.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="caps text-violet">Next step</p>
          <h2 className="mt-2 text-2xl font-medium">Ready for {product.name}?</h2>
          <p className="mt-2 text-sm text-muted">Buy it on its own, or go back and compare what the other tools do. The bundle is optional.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={checkoutHref(product.slug)} variant="violet" aria-label={`Buy ${product.name}`} iconRight={<ArrowRight className="size-4" aria-hidden />}>
            Buy {product.name}
          </ButtonLink>
          <ButtonLink to="/downloads" variant="outline" icon={<Download className="size-4" aria-hidden />}>
            My downloads
          </ButtonLink>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-4">
        <Link to={backTo} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-violet hov:text-violet-light">
          <ArrowLeft className="size-4" aria-hidden />
          Back to {backLabel}
        </Link>
        {!bundle && (
          <Link to={`/products/${BUNDLE.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted hov:text-violet">
            Or view {BUNDLE.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  )
}
