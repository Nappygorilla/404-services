import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'

import { FOOTER, SITE, TOOLS } from '../data'
import { Logo } from './Bits'
import { ButtonLink } from './Button'

const SHOP_LINKS = [
  { label: 'All cheats', to: '/store' },
  { label: 'FiveM cheats', to: '/store?platform=fivem' },
  { label: 'Roblox cheats', to: '/store?platform=roblox' },
  { label: '404 Complete', to: '/products/complete-toolkit' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Games & modes', to: '/games' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation', to: '/docs' },
  { label: 'Release notes', to: '/changelog' },
  { label: 'Service status', to: '/status' },
  { label: 'Forums', to: '/forums' },
  { label: 'Support', to: '/support' },
  { label: 'Licence', to: '/licence' },
]

const ACCOUNT_LINKS = [
  { label: 'Account', to: '/account' },
  { label: 'Orders', to: '/orders' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'Sign in', to: '/login' },
  { label: 'Create account', to: '/register' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050408] px-5 pt-16 pb-6 sm:px-8 sm:pt-20">
      <div className="star-field pointer-events-none absolute inset-x-0 top-0 h-[34rem] opacity-20" aria-hidden />
      <div className="pointer-events-none absolute -top-48 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-violet/10 blur-[150px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.8fr_.8fr]">
          <div className="max-w-sm">
            <Link to="/" aria-label={`${SITE.name} home`} className="round inline-flex rounded-full p-1">
              <Logo wordmark />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55">
              One loader, {TOOLS.length} FiveM and Roblox profiles. Visuals, aim assist, executors, scripts and mod menus — picked by you, delivered by email.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/store" variant="violet" size="sm" iconRight={<ArrowUpRight className="size-4" aria-hidden />}>
                Shop all cheats
              </ButtonLink>
              <Link to="/status" className="round inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[13px] font-medium text-white/70 hov:border-white/35 hov:text-white">
                System status <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </div>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-flex min-h-10 items-center text-sm text-white/70 underline-offset-4 hov:text-white hov:underline">
              {SITE.email}
            </a>
          </div>

          <nav aria-label="Shop links">
            <p className="eyebrow text-white/35">Shop</p>
            <ul className="mt-4 grid gap-1">
              {SHOP_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-8 items-center text-[13.5px] text-white/65 transition-colors hov:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resource links">
            <p className="eyebrow text-white/35">Resources</p>
            <ul className="mt-4 grid gap-1">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-8 items-center text-[13.5px] text-white/65 transition-colors hov:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <p className="eyebrow text-white/35">Account</p>
            <ul className="mt-4 grid gap-1">
              {ACCOUNT_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-8 items-center text-[13.5px] text-white/65 transition-colors hov:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/40">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-3.5 text-acid" /> Checkout by email and secure payment link</span>
            <span>One-time licence</span>
            <span>Key delivered by email</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {FOOTER.legalLinks.map((item) => (
              <Link key={item.to} to={item.to} className="inline-flex min-h-8 items-center text-[12px] text-white/45 hov:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <p aria-hidden className="display mt-10 -mb-[0.16em] text-center text-[clamp(2.8rem,-1.8rem+13.5vw,12rem)] leading-[0.78] tracking-[-0.07em] whitespace-nowrap text-white select-none">
          {SITE.name.toLowerCase()}
        </p>

        <div className="relative mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-4xl text-[11.5px] leading-relaxed text-white/35">{SITE.disclaimer}</p>
          <div className="flex shrink-0 items-center gap-3 text-[11px] text-white/35">
            <span>{FOOTER.legal}</span>
            <a href="#top" className="inline-flex min-h-8 items-center text-white/55 hover:text-white">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
