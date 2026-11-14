import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { APP, LAUNCH, TIERS } from '../data'
import { cx } from '../lib/cx'
import { Logo } from './Bits'
import { ButtonLink } from './Button'
import { launchActive, launchPrice, useCurrency } from './Price'

/*
  Store chrome borrowed from the shops this genre runs on: a conversion bar
  that arrives once the hero is gone, a three-column trust strip, status dots
  on supported items, and the launch window counted down rather than described.
  Everything shown is true of this product: no invented order counts, ratings
  or review totals.
*/

/** Sticky bar: logo, release status and price, once the hero has scrolled away. */
export function StickyBar() {
  const [shown, setShown] = useState(false)
  const { format } = useCurrency()
  const live = launchActive()
  const price = live ? launchPrice(TIERS[1].price) : TIERS[1].price

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!shown) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-4 px-3 sm:px-5">
        <Link to="/" aria-label={`${APP.name} home`} className="round -m-1 shrink-0 rounded-full p-1">
          <Logo wordmark />
        </Link>
        <span className="hidden items-center gap-1.5 font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase sm:flex">
          <span className="size-1.5 rounded-full bg-acid" aria-hidden />v{APP.version} · build passing
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-[11px] tracking-[0.12em] text-muted uppercase sm:inline">
            from <span className="text-ink">{format(price)}</span>
          </span>
          <ButtonLink to="/pricing" variant="violet" size="sm" iconRight={<ArrowRight className="size-4" />}>
            Get {APP.name}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

/** Three-column proof strip under the hero actions. */
export function TrustBar({ className }: { className?: string }) {
  const facts = [
    { value: '02', label: 'Platforms supported' },
    { value: '12', label: 'Months of updates' },
    { value: '1×', label: 'One-time licence' },
  ]
  return (
    <dl className={cx('grid grid-cols-3 divide-x divide-line rounded-[var(--radius-card-sm)] border border-line bg-black/20', className)}>
      {facts.map((f) => (
        <div key={f.label} className="px-4 py-4 sm:px-6">
          <dt className="sr-only">{f.label}</dt>
          <dd>
            <span className="block text-[clamp(1.5rem,1.1rem+1vw,2rem)] leading-none font-medium tracking-[-0.04em] text-violet-light tabular-nums">
              {f.value}
            </span>
            <span className="caps mt-2 block text-[10px] text-faint">{f.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function remaining(now = Date.now()) {
  const ms = Math.max(0, Date.parse(LAUNCH.endsAt) - now)
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
  }
}

/** Days / hours / minutes left in the launch window. */
export function Countdown({ tone = 'ink', className }: { tone?: 'ink' | 'light'; className?: string }) {
  const [left, setLeft] = useState(remaining)

  useEffect(() => {
    const id = window.setInterval(() => setLeft(remaining()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  if (left.days + left.hours + left.minutes === 0) return null

  const cells = [
    { value: left.days, label: 'Days' },
    { value: left.hours, label: 'Hours' },
    { value: left.minutes, label: 'Mins' },
  ]

  return (
    <div className={cx('flex items-start gap-4', className)} role="timer" aria-label="Time left in the launch window">
      {cells.map((c) => (
        <div key={c.label}>
          <span
            className={cx(
              'block font-mono text-[1.6rem] leading-none tabular-nums',
              tone === 'light' ? 'text-white' : 'text-ink',
            )}
          >
            {String(c.value).padStart(2, '0')}
          </span>
          <span className={cx('caps mt-1.5 block text-[9.5px]', tone === 'light' ? 'text-white/60' : 'text-faint')}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}
