import { Link } from 'react-router'

import { ArrowLink } from '../components/Bits'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { FOOTER, LEGAL_UPDATED, PRIVACY, REFUNDS, TERMS, type LegalSection } from '../data'
import { useDocumentTitle } from '../lib/storage'

const LINKS = [
  { label: 'Terms', to: '/terms' },
  { label: 'Refunds', to: '/refunds' },
  { label: 'Privacy', to: '/privacy' },
]

function LegalPage({ title, eyebrow, intro, sections }: { title: string[]; eyebrow: string; intro: string; sections: LegalSection[] }) {
  useDocumentTitle(title.join(' '))
  return (
    <div className="grid gap-2 p-2">
      <PageHero title={title} eyebrow={eyebrow} intro={intro} />

      <div className="grid gap-2 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="lg:sticky lg:top-2 lg:self-start">
          <Card className="p-6">
            <p className="caps text-muted">Updated {LEGAL_UPDATED}</p>
            <nav aria-label="Legal pages" className="mt-4">
              <ul className="grid gap-1">
                {LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="round inline-flex min-h-10 items-center rounded-full px-3 text-[15px] text-ink-2 transition-colors hov:bg-soft hov:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 border-t border-line pt-4">
              <ArrowLink to="/support" tone="ink" size="sm">
                Ask about this
              </ArrowLink>
            </div>
          </Card>
        </aside>

        <Card as="article" className="p-6 sm:p-8">
          <div className="grid gap-8">
            {sections.map((s, i) => (
              <section key={s.heading} aria-labelledby={`s-${i}`}>
                <h2 id={`s-${i}`} className="text-[clamp(1.2rem,1rem+0.5vw,1.5rem)] font-medium tracking-[-0.03em]">
                  {s.heading}
                </h2>
                <div className="mt-3 grid gap-3">
                  {s.body.map((p) => (
                    <p key={p} className="max-w-2xl text-[15px] leading-relaxed text-ink-2">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-4 text-[13px] text-faint">
            This page is a summary written for a small software business, not legal advice. Have a lawyer in your jurisdiction review it before you trade.
          </p>
        </Card>
      </div>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {FOOTER.legal} · {LINKS.map((l, i) => (
          <span key={l.to}>
            {i > 0 && ' · '}
            <Link to={l.to} className="underline-offset-4 hov:underline">
              {l.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  )
}

export function Terms() {
  return (
    <LegalPage
      title={['Terms']}
      eyebrow="Terms of service"
      intro="The agreement between you and us when you buy or use Modsmith. Plain language, no surprises buried at the bottom."
      sections={TERMS}
    />
  )
}

export function Refunds() {
  return (
    <LegalPage
      title={['Refunds']}
      eyebrow="Refund policy"
      intro="Fourteen days if it is not for you, and a refund regardless of time if it is broken and we cannot fix it."
      sections={REFUNDS}
    />
  )
}

export function Privacy() {
  return (
    <LegalPage
      title={['Privacy']}
      eyebrow="Privacy policy"
      intro="No analytics, no third-party requests, no advertising. What we hold, why, and how to have it removed."
      sections={PRIVACY}
    />
  )
}
