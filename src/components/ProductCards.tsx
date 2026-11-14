import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'

import { LAUNCH, PLATFORM_LABEL, isBundle, type BundleProduct, type Product, type ToolProduct } from '../data'
import { checkoutHref } from '../lib/commerce'
import { cx } from '../lib/cx'
import { Badge } from './Bits'
import { ButtonLink } from './Button'
import { Card } from './Card'
import { Holo } from './Holo'
import { launchActive, launchPrice, useCurrency } from './Price'

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
          'leading-none tracking-[-0.05em]',
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

/** One purchasable tool: status, platform, type, price and two actions. */
export function ToolCard({ tool }: { tool: ToolProduct }) {
  return (
    <Card as="article" className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="success">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid" aria-hidden />
          Available
        </Badge>
        <Badge tone="outline">{PLATFORM_LABEL[tool.platform]}</Badge>
        <Badge>{tool.kind}</Badge>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-[-0.035em] sm:text-2xl">
            <Link to={`/products/${tool.slug}`} className="underline-offset-4 hov:underline">
              {tool.name}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-violet">{tool.tagline}</p>
        </div>
        <div className="w-16 shrink-0" aria-hidden>
          <Holo kind={tool.art} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{tool.description}</p>

      <ul className="mt-5 grid gap-2">
        {tool.deliverables.slice(0, 2).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-2">
            <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <PriceTag price={tool.price} size="sm" className="mt-6" />

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
        <ButtonLink
          to={checkoutHref(tool.slug)}
          variant="violet"
          size="sm"
          aria-label={`Buy ${tool.name}`}
          iconRight={<ArrowRight className="size-4" aria-hidden />}
        >
          Buy
        </ButtonLink>
        <Link
          to={`/products/${tool.slug}`}
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hov:text-violet hov:underline"
        >
          Details
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </Card>
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
    <Card tone="violet" className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="light">Optional bundle</Badge>
          <Badge tone="light">{bundle.includes.length} tools</Badge>
        </div>
        <h2 className="display mt-4 text-[clamp(2.2rem,1.7rem+2.4vw,4rem)] text-white">{bundle.name}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{bundle.tagline} Buy it once instead of adding every tool separately.</p>
        {saving > 0 && (
          <p className="mt-3 text-sm font-medium text-white">
            Save {format(saving)} against the current individual prices.
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 lg:items-end">
        <PriceTag price={bundle.price} tone="light" className="lg:text-right" />
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink
            to={checkoutHref(bundle.slug)}
            variant="light"
            aria-label={`Buy ${bundle.name}`}
            iconRight={<ArrowRight className="size-4" aria-hidden />}
          >
            Buy bundle
          </ButtonLink>
          <Link
            to={`/products/${bundle.slug}`}
            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-white underline-offset-4 hov:text-violet-light hov:underline"
          >
            Details
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  )
}

/** Price, status and buy action at the top of a product page. */
export function ProductBuyBox({ product }: { product: Product }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="success">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid" aria-hidden />
          Available
        </Badge>
        <Badge tone="outline">{isBundle(product) ? 'Optional bundle' : PLATFORM_LABEL[product.platform]}</Badge>
        {!isBundle(product) && <Badge>{product.kind}</Badge>}
      </div>
      <PriceTag price={product.price} size="lg" className="mt-4" />
      <ButtonLink
        to={checkoutHref(product.slug)}
        variant="violet"
        className="mt-4"
        aria-label={`Buy ${product.name}`}
        iconRight={<ArrowRight className="size-4" aria-hidden />}
      >
        Buy {product.name}
      </ButtonLink>
      <p className="mt-3 text-[12px] leading-relaxed text-faint">
        One person · two machines · twelve months of updates
      </p>
    </div>
  )
}
