import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import { FOOTER, MENU, SITE } from '../data'
import { Logo } from './Bits'
import { ButtonLink } from './Button'
import { Card } from './Card'

export function Footer() {
  const footerLinks = MENU.filter((item) => !['Home', 'Orders', 'Downloads'].includes(item.label))

  return (
    <footer className="px-2 pb-2">
      <Card tone="night" className="px-5 pt-9 pb-6 sm:px-8 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div className="max-w-md">
            <p className="caps text-violet-light">LUNA release center</p>
            <h2 className="display mt-4 text-[clamp(2rem,1.5rem+1.3vw,3rem)]">Stay current. Build with confidence.</h2>
            <p className="mt-4 text-sm leading-relaxed text-night-muted">Read the latest release notes, review platform requirements, and check service configuration before updating your workflow.</p>
            <div className="mt-6"><ButtonLink to="/changelog" variant="light">View latest updates</ButtonLink></div>
          </div>
          <nav aria-label="Footer product links">
            <p className="caps mb-3 text-night-muted">Explore LUNA</p>
            <ul className="grid grid-cols-2 gap-x-5">
              {footerLinks.map((item) => (
                <li key={item.to}><Link to={item.to} className="inline-flex min-h-10 items-center text-sm text-white/85 transition-colors hov:text-violet-light">{item.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="caps mb-3 text-night-muted">Contact and community</p>
            <a href={`mailto:${SITE.email}`} className="inline-flex min-h-10 items-center break-all text-sm text-white hov:text-violet-light">{SITE.email}</a>
            <ul className="mt-2 grid gap-1">
              {SITE.socials.map((social) => (
                <li key={social.label}><a href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm text-white/85 hov:text-violet-light">{social.label}<ArrowUpRight className="size-3.5" /></a></li>
              ))}
              <li><Link to="/support" className="inline-flex min-h-10 items-center text-sm text-white/85 hov:text-violet-light">Customer support</Link></li>
            </ul>
          </div>
        </div>

        <p aria-hidden className="display mt-16 -mb-[0.12em] px-1 text-center text-[clamp(3.5rem,-0.5rem+16.4vw,17rem)] leading-[0.8] tracking-[-0.07em] whitespace-nowrap text-white select-none">{SITE.name}</p>

        <div className="mt-6 grid gap-4 border-t border-white/12 pt-5 text-sm text-night-muted">
          <p className="max-w-3xl text-[12.5px] leading-relaxed">{SITE.disclaimer}</p>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <span className="flex items-center gap-2"><Logo light className="[&_svg]:size-6" />{FOOTER.legal}</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {FOOTER.legalLinks.map((item) => <Link key={item.to} to={item.to} className="min-h-10 inline-flex items-center text-white hov:text-violet-light">{item.label}</Link>)}
              <a href="#top" className="inline-flex min-h-10 items-center text-white hov:text-violet-light">Back to top</a>
            </div>
          </div>
        </div>
      </Card>
    </footer>
  )
}
