import { ArrowLeft, ArrowRight, Check, Download, ShieldCheck, X } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { Badge, SectionHead } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { MarketingHero } from '../components/Nav'
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
        body="This product is not in the 404 Services catalogue. Browse the store to see every cheat currently sold."
        to="/store"
        action="Browse the store"
      />
    )
  }

  const bundle = isBundle(product)
  const included = bundle ? TOOLS.filter((tool) => product.includes.includes(tool.slug)) : []
  const backTo = !bundle && product.platform !== 'both' ? `/store?platform=${product.platform}` : '/store'
  const backLabel = !bundle && product.platform !== 'both' ? `${PLATFORM_LABEL[product.platform]} cheats` : 'All cheats'
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
    <div>
      <MarketingHero
        title={bundle ? ['404 Complete.'] : product.name.split(' ')}
        eyebrow={bundle ? 'Optional bundle · one-time purchase' : `${PLATFORM_LABEL[product.platform]} · ${product.kind} · one-time purchase`}
        intro={product.tagline}
        art={<Holo kind={product.art} motion priority />}
        aside={
          <div>
            <Link to={backTo} className="mt-6 inline-flex min-h-10 items-center gap-2 text-[13px] font-medium text-white/50 transition-colors hov:text-white">
              <ArrowLeft className="size-4" aria-hidden />
              Back to {backLabel}
            </Link>
            <ProductBuyBox product={product} />
          </div>
        }
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <section className="grid gap-4 border-b border-white/10 py-12 sm:py-16 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#182004]" aria-hidden />
                Working
              </Badge>
              <Badge tone="outline">404 Loader v{APP.version}</Badge>
              {bundle && <Badge>{included.length} cheats included</Badge>}
            </div>
            <p className="eyebrow mt-6 text-[9px] text-pink">About this {bundle ? 'bundle' : 'cheat'}</p>
            <h2 className="display mt-3 max-w-2xl text-[clamp(2rem,1.6rem+1.4vw,3rem)] text-white">{product.tagline}</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/50">
              {product.description} Use only on game accounts you own. Game modifications can breach platform terms and may lead to account action; no product can guarantee otherwise.
            </p>
          </div>
          <div className="brand-wash relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 p-6 sm:p-8">
            <div className="star-field pointer-events-none absolute inset-0 opacity-25" aria-hidden />
            <ShieldCheck className="relative size-7 text-acid" aria-hidden />
            <div className="relative mt-12">
              <p className="eyebrow text-[9px] text-pink">Know the risk</p>
              <h3 className="display mt-3 text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] text-white">For accounts you own.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                We never ask for a game password, and no product can promise safety from platform enforcement. Read the limits before you buy.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="product-included" className="border-b border-white/10 py-12 sm:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead
              eyebrow={bundle ? 'Everything in the bundle' : 'What this cheat includes'}
              title={bundle ? <span id="product-included">The whole menu.</span> : <span id="product-included">What you get.</span>}
              align="left"
            />
            <p className="max-w-md text-sm leading-relaxed text-white/40">
              {bundle
                ? `Every current cheat, with a link to its own page. The bundle includes ${included.length} profiles and is sold as one optional licence.`
                : 'The features this profile unlocks, plus the licence terms every 404 Services product shares.'}
            </p>
          </div>

          {bundle ? (
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {included.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/products/${tool.slug}`}
                    className="group flex h-full flex-col rounded-[18px] border border-white/10 bg-white/[.025] p-5 transition-[border-color,background-color] hov:border-violet/45 hov:bg-white/[.045]"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="outline">{PLATFORM_LABEL[tool.platform]}</Badge>
                      <Badge>{tool.kind}</Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-medium tracking-[-0.03em] text-white group-hov:text-violet-light">{tool.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/40">{tool.tagline}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-violet-light">
                      View cheat <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {product.deliverables.map((item, index) => (
                <Card key={item} className="border-white/10 bg-white/[.025] p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-violet-light">0{index + 1}</span>
                  <h3 className="mt-4 text-xl font-medium tracking-[-0.03em] text-white">{item}</h3>
                </Card>
              ))}
              <Card className="border-white/10 bg-white/[.025] p-6 sm:p-7">
                <p className="eyebrow text-[9px] text-pink">Licence terms</p>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white">Every profile includes</h3>
                <ul className="mt-4 grid gap-2">
                  {LICENCE_INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/55">
                      <Check className="mt-0.5 size-4 shrink-0 text-acid" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </section>

        <section className="grid gap-4 border-b border-white/10 py-12 sm:py-16 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/[.025] p-6 sm:p-8">
            <p className="eyebrow text-[9px] text-pink">Requirements</p>
            <h2 className="display mt-3 text-[clamp(1.8rem,1.4rem+1.2vw,2.7rem)] text-white">Before you begin.</h2>
            <ul className="mt-6 grid gap-3">
              {requirements.map((requirement) => (
                <li key={requirement} className="flex gap-3 text-sm leading-relaxed text-white/55">
                  <Check className="mt-0.5 size-4 shrink-0 text-acid" aria-hidden />
                  {requirement}
                </li>
              ))}
            </ul>
          </Card>
          <Card tone="night" className="border-white/10 p-6 sm:p-8">
            <p className="eyebrow text-[9px] text-pink">Limits</p>
            <h2 className="display mt-3 text-[clamp(1.8rem,1.4rem+1.2vw,2.7rem)] text-white">What this does not do.</h2>
            <ul className="mt-6 grid gap-2">
              {product.limits.map((limit) => (
                <li key={limit} className="flex gap-3 rounded-xl border border-white/8 bg-white/[.035] px-4 py-3 text-sm leading-relaxed text-white/60">
                  <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                  {limit}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-tools" className="border-b border-white/10 py-12 sm:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead eyebrow="Related cheats" title={<span id="related-tools">Often bought alongside.</span>} align="left" />
              <Link to={backTo} className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-medium text-violet-light hov:text-white">
                Browse {backLabel} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        <section className="py-12 sm:py-16">
          <div className="brand-wash relative overflow-hidden rounded-[26px] border border-white/12 px-6 py-9 sm:px-9">
            <div className="star-field pointer-events-none absolute inset-0 opacity-25" aria-hidden />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow text-[9px] text-pink">Next step</p>
                <h2 className="display mt-3 text-[clamp(2rem,1.5rem+1.5vw,3rem)] text-white">Ready for {product.name}?</h2>
                <p className="mt-2 text-sm text-white/45">Buy it on its own, or go back and compare what the other profiles do. 404 Complete is optional.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to={checkoutHref(product.slug)} variant="violet" aria-label={`Buy ${product.name}`} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                  Buy {product.name}
                </ButtonLink>
                <ButtonLink to="/downloads" variant="outline" icon={<Download className="size-4" aria-hidden />}>
                  My downloads
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6">
          <Link to={backTo} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-violet-light hov:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            Back to {backLabel}
          </Link>
          {!bundle && (
            <Link to={`/products/${BUNDLE.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/45 hov:text-white">
              Or view {BUNDLE.name} <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
