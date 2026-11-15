import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'

import { MENU, NAV, SITE } from '../data'
import { cx } from '../lib/cx'
import { useAuth } from './Auth'
import { ButtonLink, IconButton } from './Button'
import { Logo } from './Bits'
import { Drawer } from './Overlay'

const HEADER_LINKS = NAV.filter((item) => item.label !== 'Updates')

/** Transparent storefront header, designed to sit over a cosmic hero. */
export function Nav({ tone = 'white', overlay = false }: { tone?: 'white' | 'night'; overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const { user } = useAuth()
  const light = tone === 'night' || overlay
  return (
    <header className="relative z-20 flex h-[4.5rem] items-center justify-between gap-4">
      <Link to="/" aria-label={`${SITE.name} home`} className="round -m-1 rounded-full p-1">
        <Logo wordmark light={light} />
      </Link>
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-7 xl:gap-9">
          {HEADER_LINKS.map((item) => {
            const active = item.to.includes('#')
              ? pathname === '/' && hash === item.to.slice(1)
              : item.to === '/store'
                ? pathname.startsWith('/store') || pathname.startsWith('/products')
                : pathname.startsWith(item.to)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'relative inline-flex min-h-10 items-center text-[13px] font-medium tracking-[-0.01em] transition-colors',
                    light ? 'text-white/70 hov:text-white' : 'text-ink-2 hov:text-white',
                    active && 'text-white',
                    'after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-violet after:to-pink after:transition-transform after:duration-[var(--duration-base)] hov:after:scale-x-100',
                    active && 'after:scale-x-100',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Link to="/account" className="text-[13px] font-medium text-white/70 transition-colors hov:text-white">
              Account
            </Link>
          ) : (
            <Link to="/login" className="text-[13px] font-medium text-white/70 transition-colors hov:text-white">
              Sign in
            </Link>
          )}
          <ButtonLink to="/store" variant="violet" size="sm" iconRight={<ArrowUpRight className="size-3.5" aria-hidden />}>
            Shop cheats
          </ButtonLink>
        </div>
        <IconButton
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          tone="outline"
          className="border-white/20 bg-black/20 text-white backdrop-blur-md hov:border-white/50 hov:bg-white hov:text-[#08080c]"
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
            <path d="M5 6.5h10M5 10h10M5 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </IconButton>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} label="Site menu">
        <nav aria-label="Menu" className="mt-6 flex-1">
          <ul className="flex flex-col">
            {MENU.map((item, i) => (
              <motion.li
                key={item.to}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="group display flex items-center justify-between border-b border-white/12 py-4 text-[clamp(2rem,1.5rem+2.2vw,3.3rem)] transition-colors hov:text-violet-light"
                >
                  {item.label}
                  <ArrowUpRight className="size-7 opacity-0 transition-[opacity,transform] duration-[var(--duration-base)] group-hov:opacity-100" strokeWidth={1.4} aria-hidden />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/12 pt-6">
          {user ? (
            <Link to="/account" onClick={() => setOpen(false)} className="round inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-[15px] font-medium text-white hov:border-white hov:bg-white hov:text-[#08080c]">
              Your account
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="round inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-[15px] font-medium text-white hov:border-white hov:bg-white hov:text-[#08080c]">
                Sign in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="round inline-flex h-11 items-center rounded-full bg-[linear-gradient(110deg,#7c3aed,#a21caf,#db2777)] px-5 text-[15px] font-medium text-white shadow-[var(--shadow-violet)]">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="mt-8 grid gap-6 text-sm text-night-muted sm:grid-cols-2">
          <div>
            <p className="caps mb-2 text-white">Say hello</p>
            <a className="block min-h-10 py-2 text-white underline-offset-4 hov:underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <p className="py-2 text-night-muted">{SITE.hours}</p>
          </div>
          <div>
            <p className="caps mb-2 text-white">Follow</p>
            <ul className="grid grid-cols-2">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  <a className="block min-h-10 py-2 text-white underline-offset-4 hov:underline" href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Drawer>
    </header>
  )
}

/** Full-bleed marketing hero used by the store and product pages. */
export function MarketingHero({
  title,
  eyebrow,
  intro,
  aside,
  art,
  children,
}: {
  title: string[]
  eyebrow?: string
  intro?: string
  aside?: React.ReactNode
  art?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[.08] bg-[#07060b]">
      <div className="star-field pointer-events-none absolute inset-0 opacity-35" aria-hidden />
      <div className="pointer-events-none absolute -top-40 right-[6%] size-[34rem] rounded-full bg-violet/20 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute top-24 -left-32 size-[28rem] rounded-full bg-pink/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <Nav overlay />
        <div className="relative grid gap-10 pb-14 pt-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-14">
          <div>
            {eyebrow && (
              <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.04] px-3 py-1.5 text-[10px] text-white/70">
                <span className="size-1.5 rounded-full bg-acid" aria-hidden />
                {eyebrow}
              </p>
            )}
            <h1 className="display mt-6 text-[clamp(3rem,1.2rem+6vw,6.8rem)] text-white">
              {title.map((line, index) => (
                <span key={line} className="block">
                  {line}
                  {index < title.length - 1 && <span className="sr-only"> </span>}
                </span>
              ))}
            </h1>
            {intro && <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-pretty text-white/60">{intro}</p>}
            {aside}
          </div>
          {art && (
            <div className="relative mx-auto flex min-h-[250px] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[28px] border border-white/12 bg-white/[.025] px-8 py-10 sm:min-h-[340px]">
              <div className="star-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(139_92_246/.25),transparent_62%)]" aria-hidden />
              <div className="relative w-[min(72%,280px)]">{art}</div>
              <span className="absolute bottom-4 left-4 eyebrow text-[9px] text-white/35">404 · game enhancement suite</span>
              <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] text-white/55">
                <span className="size-1.5 rounded-full bg-acid" aria-hidden /> Working
              </span>
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

/** The first card of an inner page: header row, a big title and an optional intro/aside. */
export function PageHero({
  title,
  eyebrow,
  intro,
  aside,
  art,
  artSize = 'default',
  titleSize = 'default',
  children,
}: {
  title: string[]
  eyebrow?: string
  intro?: string
  aside?: React.ReactNode
  art?: React.ReactNode
  /** `compact` shrinks the product art so the buy box stays close to the title on mobile. */
  artSize?: 'default' | 'compact'
  /** `compact` for long multi-word titles that would otherwise run to the card edge. */
  titleSize?: 'default' | 'compact'
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-card px-5 pt-3 pb-8 sm:px-8 sm:pb-10">
      <div className="star-field pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-48 size-[38rem] rounded-full bg-violet/20 blur-[130px]" aria-hidden />
      <div className="relative">
        <Nav overlay />
        <div className="relative mt-10 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,20rem)_1fr_auto] lg:items-end lg:gap-6">
          <div className="order-3 max-w-sm lg:order-1">
            {eyebrow && <p className="eyebrow mb-3 text-pink">{eyebrow}</p>}
            {intro && <p className="text-[17px] leading-relaxed text-pretty text-ink-2">{intro}</p>}
            {aside}
          </div>
          {art ? (
            <div
              className={cx(
                'pointer-events-none order-2 mx-auto self-center lg:-translate-x-[8%]',
                artSize === 'compact'
                  ? 'w-[min(46vw,220px)] lg:w-[min(18vw,260px)]'
                  : 'w-[min(62vw,300px)] lg:w-[min(22vw,340px)]',
              )}
              aria-hidden
            >
              {art}
            </div>
          ) : (
            <div className="hidden lg:order-2 lg:block" />
          )}
          <h1
            className={cx(
              'display order-1 text-right lg:order-3',
              titleSize === 'compact' ? 'text-[clamp(2.8rem,0.6rem+7.4vw,8.2rem)]' : 'text-[clamp(3.4rem,0.8rem+9.2vw,10rem)]',
            )}
          >
            {title.map((l, index) => (
              <span key={l} className="block">
                {l}
                {index < title.length - 1 && <span className="sr-only"> </span>}
              </span>
            ))}
          </h1>
        </div>
        {children}
      </div>
    </section>
  )
}
