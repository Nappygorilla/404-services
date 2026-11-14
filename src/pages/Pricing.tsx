import { ReceiptText, ShieldCheck, WifiOff } from 'lucide-react'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { CurrencySwitch, launchActive } from '../components/Price'
import { LicenceCard } from '../components/LicenceCard'
import { Countdown } from '../components/Storefront'
import { LAUNCH, PLATFORMS, PRICING_FAQ, PRICING_POINTS, SITE } from '../data'
import { useDocumentTitle } from '../lib/storage'

/*
  Two products, not three tiers. Each platform licence has its own price and
  its own buying action, laid out like the per-product store the reference
  shops run. The assurances below the grid answer the questions buyers ask
  before paying.
*/
const ASSURANCES = [
  { icon: ShieldCheck, title: '14-day refund', body: 'Ask within fourteen days of purchase, no reason needed.' },
  { icon: ReceiptText, title: 'Merchant of record', body: 'Checkout, tax and invoicing handled by them. Card details never reach us.' },
  { icon: WifiOff, title: '14 days offline', body: 'Activation is cached, so builds keep running without a connection.' },
]

export function Pricing() {
  useDocumentTitle('Pricing')
  const live = launchActive()

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Simple', 'pricing']}
        eyebrow="Two licences, sold separately"
        intro="Buy the FiveM licence or the Roblox licence on its own. One payment each, twelve months of updates, no subscription."
        art={<Holo kind="sphere" motion />}
        aside={
          <div className="mt-6 flex flex-col gap-3">
            <CurrencySwitch />
            <p className="text-[13px] text-muted">Prices include VAT where it applies. Each licence is for one person on two machines.</p>
          </div>
        }
      />

      <section aria-label="Licence prices" className="grid gap-2 md:grid-cols-2">
        {PLATFORMS.map((platform) => (
          <LicenceCard key={platform.slug} platform={platform} />
        ))}
      </section>

      {live && (
        <Card tone="violet" className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-8">
          <p className="text-[15px] text-white">
            Launch pricing runs until <strong className="font-medium">{LAUNCH.endsLabel}</strong>. Buy before then and your renewal price is locked at what you paid.
          </p>
          <div className="flex items-center gap-6">
            <Countdown tone="light" />
            <Badge tone="light">Launch window open</Badge>
          </div>
        </Card>
      )}

      <section aria-labelledby="pricing-points" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">Four things worth knowing before you pick a platform.</p>
          <Title id="pricing-points" lines={['How the', 'licence works']} className="order-1 md:order-2" />
        </Card>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PRICING_POINTS.map((p, i) => (
            <li key={p.title} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <span className="caps text-violet tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Card as="section" aria-labelledby="pricing-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="pricing-faq" lines={['Licence', 'questions']} align="left" />
          <ArrowLink to="/support" size="sm">
            Ask about a licence
          </ArrowLink>
        </div>
        <Accordion items={PRICING_FAQ} />
      </Card>

      <section aria-labelledby="pricing-assurance" className="grid gap-2">
        <h2 id="pricing-assurance" className="sr-only">
          Buying assurances
        </h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {ASSURANCES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="h-full">
              <Card className="flex h-full items-start gap-3 p-5 sm:p-6">
                <span className="round grid size-9 shrink-0 place-items-center rounded-full border border-violet/35 bg-violet/15 text-violet-light">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[15px] font-medium">{title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 text-sm text-muted">
          <p>
            Need both platforms on one invoice? Email us. Prices include VAT where it applies.
          </p>
          <ArrowLink to="/refunds" tone="ink" size="sm">
            Refund policy
          </ArrowLink>
        </div>
      </section>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {SITE.disclaimer}
      </p>
    </div>
  )
}
