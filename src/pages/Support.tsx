import { ArrowRight, Check, Mail } from 'lucide-react'

import { ArrowLink, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, SITE, SUPPORT, SUPPORT_FAQ } from '../data'
import { useDocumentTitle } from '../lib/storage'

export function Support() {
  useDocumentTitle('Support')
  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={SUPPORT.title}
        eyebrow="Support"
        intro={SUPPORT.intro}
        art={<Holo kind="scissors" motion />}
        aside={
          <div className="mt-6">
            <ButtonLink
              to={`mailto:${SITE.email}?subject=${encodeURIComponent(`${APP.name} ${APP.version} — support`)}`}
              variant="violet"
              icon={<Mail className="size-4" aria-hidden />}
            >
              Email support
            </ButtonLink>
            <p className="mt-3 text-[13px] text-muted">{SITE.email}</p>
            <ButtonLink to="/account/tickets" variant="outline" className="mt-3">Open a support ticket</ButtonLink>
          </div>
        }
      />

      <section id="buy" aria-labelledby="buy-title" className="grid scroll-mt-2 gap-2 lg:grid-cols-[1.2fr_0.8fr]">
        <Card tone="night" className="p-6 sm:p-8">
          <Title id="buy-title" lines={['Buying a', 'licence']} align="left" size="sm" />
          <p className="mt-5 max-w-xl text-white/85">
            Checkout is handled by email while card payments are being connected. Write to us with the platform licence you want and we will send a payment link and a VAT
            invoice, then issue your key.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <ButtonLink
              to={`mailto:${SITE.email}?subject=${encodeURIComponent('Licence enquiry')}&body=${encodeURIComponent('Platform (FiveM / Roblox):\nName:\nCountry:\nVAT number (optional):')}`}
              variant="light"
              iconRight={<ArrowRight className="size-4" />}
            >
              Ask for a payment link
            </ButtonLink>
            <ArrowLink to="/pricing" tone="light" size="sm">
              Compare licences
            </ArrowLink>
          </div>
          <p className="mt-6 text-sm text-night-muted">Each platform is a separate licence; buying one does not unlock the other.</p>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-medium tracking-[-0.03em]">Response times</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {SUPPORT.responseTimes.map((r) => (
              <li key={r.audience} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                <span className="font-medium">{r.audience}</span>
                <span className="text-right text-muted">{r.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted">Targets, not guarantees — but we are a small team and we read everything.</p>
        </Card>
      </section>

      <section aria-labelledby="checklist" className="grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6 sm:p-8">
          <Title id="checklist" lines={['What to', 'include']} align="left" size="sm" />
          <p className="mt-4 max-w-sm text-muted">The difference between one reply and six is usually these four lines.</p>
        </Card>
        <Card className="p-6 sm:p-8">
          <ul className="grid gap-3">
            {SUPPORT.checklist.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[15px] text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card as="section" aria-labelledby="support-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="support-faq" lines={['Before you', 'write in']} align="left" />
          <ArrowLink to="/docs" size="sm">
            Read the docs
          </ArrowLink>
        </div>
        <Accordion items={SUPPORT_FAQ} />
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {SITE.company} · {SITE.hours} · {SITE.email}
      </p>
    </div>
  )
}
