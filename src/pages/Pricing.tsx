import { ReceiptText, ShieldCheck, WifiOff } from 'lucide-react'
import { Link } from 'react-router'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { MarketingHero } from '../components/Nav'
import { CurrencySwitch, launchActive } from '../components/Price'
import { BundleBanner, PriceTag } from '../components/ProductCards'
import { Countdown } from '../components/Storefront'
import { BUNDLE, LAUNCH, PLATFORM_LABEL, PRICING_FAQ, PRICING_POINTS, SITE, TOOLS } from '../data'
import { checkoutHref } from '../lib/commerce'
import { useDocumentTitle } from '../lib/storage'

const ASSURANCES = [
  { icon: ShieldCheck, title: '14-day refund', body: 'Ask within fourteen days of purchase, no reason needed.' },
  { icon: ReceiptText, title: 'Merchant of record', body: 'Checkout, tax and invoicing handled by them. Card details never reach us.' },
  { icon: WifiOff, title: '14 days offline', body: 'Activation is cached, so the loader keeps working without a connection.' },
]

export function Pricing() {
  useDocumentTitle('Pricing')
  const live = launchActive()
  const compareAt = TOOLS.reduce((sum, tool) => sum + tool.price, 0)

  return (
    <div>
      <MarketingHero
        title={['Priced per cheat.']}
        eyebrow="Individual profiles · no tiers"
        intro={`Each of the ${TOOLS.length} cheats is its own profile with its own one-time price. ${BUNDLE.name} is an optional bundle, not a requirement.`}
        art={<Holo kind="sphere" motion priority />}
        aside={
          <div className="mt-7 flex flex-col gap-3">
            <CurrencySwitch className="border-white/15 bg-black/25" />
            <p className="text-[13px] text-white/40">Prices include VAT where it applies. Every cheat licence is for one person on two devices.</p>
          </div>
        }
      />

      <div className="mx-auto grid max-w-[1440px] gap-4 px-5 py-10 sm:px-8 sm:py-14">
      <BundleBanner bundle={BUNDLE} compareAt={compareAt} />

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

      <section aria-labelledby="price-list" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="caps text-violet">Every profile</p>
            <Title id="price-list" lines={['The full', 'price list']} align="left" />
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-muted">The price on each row is the one-time price for that cheat. 404 Complete is shown above; there are no other discounts to decode.</p>
            <ArrowLink to="/store" size="sm" className="mt-4">Open the store</ArrowLink>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-line">
            {TOOLS.map((tool) => (
              <li key={tool.slug} className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="outline">{PLATFORM_LABEL[tool.platform]}</Badge>
                    <Badge>{tool.kind}</Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.025em]">
                    <Link to={`/products/${tool.slug}`} className="underline-offset-4 hov:underline">
                      {tool.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{tool.tagline}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <PriceTag price={tool.price} size="sm" note={false} />
                  <ButtonLink
                    to={checkoutHref(tool.slug)}
                    variant="violet"
                    size="sm"
                    aria-label={`Buy ${tool.name}`}
                  >
                    Buy
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="pricing-points" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">Four things worth knowing before you pick a profile.</p>
          <Title id="pricing-points" lines={['How the', 'pricing works']} className="order-1 md:order-2" />
        </Card>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PRICING_POINTS.map((point, index) => (
            <li key={point.title} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <span className="caps text-violet tabular-nums">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.03em]">{point.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{point.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Card as="section" aria-labelledby="pricing-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="pricing-faq" lines={['Cheat', 'questions']} align="left" />
          <ArrowLink to="/support" size="sm">Ask about a cheat</ArrowLink>
        </div>
        <Accordion items={PRICING_FAQ} />
      </Card>

      <section aria-labelledby="pricing-assurance" className="grid gap-2">
        <h2 id="pricing-assurance" className="sr-only">Buying assurances</h2>
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
          <p>Prices include VAT where it applies. Paddle issues the invoice as merchant of record.</p>
          <ArrowLink to="/refunds" tone="ink" size="sm">Refund policy</ArrowLink>
        </div>
      </section>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">{SITE.disclaimer}</p>
      </div>
    </div>
  )
}
