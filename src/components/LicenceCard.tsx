import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'

import { LAUNCH, type Platform } from '../data'
import { cx } from '../lib/cx'
import { Badge } from './Bits'
import { ButtonLink } from './Button'
import { Card } from './Card'
import { Holo } from './Holo'
import { launchActive, launchPrice, useCurrency } from './Price'

/** The price and its launch-window note, in one place. */
export function PriceTag({ platform, className }: { platform: Platform; className?: string }) {
  const { format } = useCurrency()
  const live = launchActive()
  return (
    <div className={className}>
      <p className="text-[clamp(2.4rem,1.8rem+1.6vw,3.4rem)] leading-none tracking-[-0.055em]">
        {format(live ? launchPrice(platform.price) : platform.price)}
      </p>
      <p className="mt-2 text-[13px] text-muted">
        {live ? `Launch price until ${LAUNCH.endsLabel}, then ${format(platform.price)}` : 'One-time licence'}
      </p>
    </div>
  )
}

/** A single platform licence, presented as its own product. */
export function LicenceCard({ platform }: { platform: Platform }) {
  return (
    <Card as="article" className={cx('flex h-full flex-col p-6 sm:p-8')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="success">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid" aria-hidden />
              Available
            </Badge>
            <Badge tone="outline">Platform licence</Badge>
          </div>
          <h2 className="display mt-4 text-[clamp(2.2rem,1.6rem+2vw,3.4rem)]">{platform.name}</h2>
          <p className="mt-2 text-sm text-violet">{platform.tagline}</p>
        </div>
        <div className="w-20 shrink-0" aria-hidden>
          <Holo kind={platform.art} />
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-muted">{platform.intro}</p>

      <PriceTag platform={platform} className="mt-6" />

      <ul className="mt-5 grid gap-2 text-[15px]">
        {platform.features.slice(0, 3).map((f) => (
          <li key={f.title} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
            {f.title}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
        <ButtonLink to="/support#buy" variant="violet" iconRight={<ArrowRight className="size-4" />}>
          Buy {platform.name} licence
        </ButtonLink>
        <Link
          to={`/products/${platform.slug}`}
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hov:text-violet hov:underline"
        >
          Licence details
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <p className="mt-2 text-[12px] text-faint">One person · two machines · 12 months of updates</p>
    </Card>
  )
}

/**
 * The buy block on a product page: price, one buying action and the licence
 * facts, so the product is purchasable above the fold like the shops it is
 * modelled on.
 */
export function LicenceBuyBox({ platform }: { platform: Platform }) {
  const { format } = useCurrency()
  const live = launchActive()
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="success">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-acid" aria-hidden />
          Available
        </Badge>
        <Badge tone="outline">One-time</Badge>
      </div>
      <p className="mt-4 text-[clamp(2rem,1.5rem+1.6vw,2.8rem)] leading-none tracking-[-0.05em]">
        {format(live ? launchPrice(platform.price) : platform.price)}
      </p>
      <p className="mt-2 text-[13px] text-muted">
        {live ? `Launch price until ${LAUNCH.endsLabel}, then ${format(platform.price)}` : 'One-time licence'}
      </p>
      <ButtonLink to="/support#buy" variant="violet" className="mt-4" iconRight={<ArrowRight className="size-4" />}>
        Buy {platform.name} licence
      </ButtonLink>
      <p className="mt-3 text-[12px] leading-relaxed text-faint">One person · two machines · 12 months of updates</p>
    </div>
  )
}
