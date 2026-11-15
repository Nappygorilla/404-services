import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'

import {
  LAUNCH,
  PLATFORM_LABEL,
  isBundle,
  type BundleProduct,
  type HoloKind,
  type Product,
  type ToolProduct,
} from '../data'
import { checkoutHref } from '../lib/commerce'
import { cx } from '../lib/cx'
import { Badge } from './Bits'
import { ButtonLink } from './Button'
import { Holo } from './Holo'
import { launchActive, launchPrice, useCurrency } from './Price'

const ART_GRADIENT: Record<HoloKind, string> = {
  knot: 'from-[#32105c] via-[#7c3aed] to-[#db2777]',
  sphere: 'from-[#1b1145] via-[#4338ca] to-[#0ea5e9]',
  cloud: 'from-[#2a104d] via-[#a21caf] to-[#fb7185]',
  scissors: 'from-[#2b0d24] via-[#be185d] to-[#f59e0b]',
  star: 'from-[#220d3c] via-[#8b5cf6] to-[#ff5ccf]',
  prism: 'from-[#0d1736] via-[#2563eb] to-[#c084fc]',
}

/** The display price and launch note, shared by cards and product heroes. */
export function PriceTag({
  price,
  className,
  tone = 'ink',
  note = true,
  size = 'md',
}: {
  price: number
  className?: string
  tone?: 'ink' | 'light'
  note?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const { format } = useCurrency()
  const live = launchActive()
  return (
    <div className={className}>
      <p
        className={cx(
          'display leading-none tracking-[-0.05em]',
          size === 'sm' && 'text-2xl',
          size === 'md' && 'text-[clamp(2rem,1.6rem+1.4vw,3rem)]',
          size === 'lg' && 'text-[clamp(2.4rem,1.8rem+2vw,3.6rem)]',
          tone === 'light' && 'text-white',
        )}
      >
        {format(live ? launchPrice(price) : price)}
      </p>
      {note && (
        <p className={cx('mt-2 text-[13px]', tone === 'light' ? 'text-white/70' : 'text-muted')}>
          {live ? `Launch price until ${LAUNCH.endsLabel}, then ${format(price)}` : 'One-time licence'}
        </p>
      )}
    </div>
  )
}

/** Large, image-led cover used on cards and the related-tool rail. */
export function ToolCover({
  tool,
  priority = false,
  className,
}: {
  tool: ToolProduct
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cx('relative isolate aspect-[4/3] overflow-hidden bg-[#0b0712]', className)}>
      <div className={cx('absolute inset-0 bg-gradient-to-br opacity-95', ART_GRADIENT[tool.art])} aria-hidden />
      <div className="star-field absolute inset-0 opacity-45" aria-hidden />
      <div className="absolute -top-16 -left-16 size-52 rounded-full bg-white/20 blur-3xl" aria-hidden />
      <div className="absolute -right-12 bottom-0 size-44 rounded-full bg-violet/50 blur-3xl" aria-hidden />
      <div className="absolute inset-0 grid place-items-center p-8 sm:p-10">
        <Holo
          kind={tool.art}
          priority={priority}
          className="w-[62%] max-w-[230px] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hov:-rotate-2 group-hov:scale-105"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#08060d] via-[#08060d]/35 to-transparent" aria-hidden />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
        <Badge tone="success" className="shadow-[0_4px_18px_rgb(0_0_0/.35)]">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#182004]" aria-hidden />
          Working
        </Badge>
        <span className="round inline-flex h-7 items-center rounded-full border border-white/15 bg-black/35 px-3 text-[11px] font-medium text-white/80 backdrop-blur-sm">
          {PLATFORM_LABEL[tool.platform]}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <span className="eyebrow text-[10px] text-white/65">{tool.kind}</span>
        <span className="text-[11px] font-medium text-white/70">View cheat ↗</span>
      </div>
    </div>
  )
}

/** One purchasable tool: cover, status, name, price and buy action. */
export function ToolCard({ tool }: { tool: ToolProduct }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[#0c0912]/95 shadow-[0_24px_70px_-45px_rgb(0_0_0/.95)] transition-[border-color,transform,box-shadow] duration-[var(--duration-base)] hov:-translate-y-1 hov:border-violet/45 hov:shadow-[0_30px_80px_-40px_rgb(124_58_237/.4)]">
      <Link to={`/products/${tool.slug}`} className="block" aria-label={`View ${tool.name}`}>
        <ToolCover tool={tool} />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[1.2rem] leading-tight font-semibold tracking-[-0.035em] text-white">
            <Link to={`/products/${tool.slug}`} className="underline-offset-4 hov:text-violet-light hov:underline">
              {tool.name}
            </Link>
          </h2>
          <ArrowRight className="mt-1 size-4 shrink-0 text-white/35 transition-transform group-hov:translate-x-1 group-hov:text-violet-light" aria-hidden />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{tool.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="eyebrow text-[9px] text-white/35">One-time</p>
            <PriceTag price={tool.price} size="sm" note={false} className="mt-1" />
          </div>
          <ButtonLink
            to={checkoutHref(tool.slug)}
            variant="violet"
            size="sm"
            aria-label={`Buy ${tool.name}`}
            iconRight={<ArrowRight className="size-4" aria-hidden />}
          >
            Buy
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

/** The optional bundle, shown as one wide conversion band. */
export function BundleBanner({ bundle, compareAt }: { bundle: BundleProduct; compareAt: number }) {
  const { format } = useCurrency()
  const live = launchActive()
  const currentPrice = live ? launchPrice(bundle.price) : bundle.price
  const currentCompareAt = live ? launchPrice(compareAt) : compareAt
  const saving = Math.max(0, currentCompareAt - currentPrice)
  return (
    <section className="brand-wash relative overflow-hidden rounded-[28px] border border-white/12 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
      <div className="star-field pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -bottom-32 size-96 rounded-full bg-pink/25 blur-[100px]" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="light">Optional bundle</Badge>
            <Badge tone="light">{bundle.includes.length} cheats</Badge>
          </div>
          <h2 className="display mt-5 max-w-2xl text-[clamp(2.4rem,1.7rem+3vw,4.6rem)] text-white">{bundle.name}</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Every current FiveM and Roblox cheat, sold together at one price. It is optional — start with the single profile you need and add the bundle only if it makes sense.
          </p>
          {saving > 0 && <p className="mt-4 text-sm font-medium text-acid">Save {format(saving)} against the current individual prices.</p>}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/60">
            <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> All {bundle.includes.length} cheats</span>
            <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> Both games</span>
            <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-acid" /> 12 months of updates</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <Holo kind="sphere" motion className="pointer-events-none w-32 self-end lg:w-40" />
          <PriceTag price={bundle.price} tone="light" className="lg:text-right" />
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <ButtonLink
              to={checkoutHref(bundle.slug)}
              variant="light"
              aria-label={`Buy ${bundle.name}`}
              className="w-full sm:w-auto"
              iconRight={<ArrowRight className="size-4" aria-hidden />}
            >
              Buy 404 Complete
            </ButtonLink>
            <Link
              to={`/products/${bundle.slug}`}
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-white/80 underline-offset-4 hov:text-white hov:underline"
            >
              What is included
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Price, status and buy action at the top of a product page. */
export function ProductBuyBox({ product }: { product: Product }) {
  return (
    <div className="mt-7 rounded-[var(--radius-card)] border border-white/12 bg-white/[.045] p-5 shadow-[0_24px_70px_-45px_rgb(0_0_0/.9)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="success">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#182004]" aria-hidden />
          Working
        </Badge>
        <Badge tone="outline">{isBundle(product) ? 'Optional bundle' : PLATFORM_LABEL[product.platform]}</Badge>
        {!isBundle(product) && <Badge>{product.kind}</Badge>}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <PriceTag price={product.price} size="lg" note={false} />
        <span className="pb-1 text-right text-[11px] leading-tight text-white/45">one-time<br />licence</span>
      </div>
      <ButtonLink
        to={checkoutHref(product.slug)}
        variant="violet"
        size="lg"
        className="mt-5 w-full"
        aria-label={`Buy ${product.name}`}
        iconRight={<ArrowRight className="size-4" aria-hidden />}
      >
        Buy {product.name}
      </ButtonLink>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-[11.5px] text-white/55">
        <span className="inline-flex items-center gap-2"><ShieldCheck className="size-3.5 text-violet-light" /> One person · two devices</span>
        <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-acid" /> Twelve months of updates</span>
        <span className="inline-flex items-center gap-2"><Check className="size-3.5 text-acid" /> Windows 10/11 · key by email</span>
      </div>
    </div>
  )
}
