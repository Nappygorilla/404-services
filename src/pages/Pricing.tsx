import { ArrowRight, Check } from 'lucide-react'

import { ArrowLink, Badge, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { CurrencySwitch, launchActive, launchPrice, useCurrency } from '../components/Price'
import { Countdown } from '../components/Storefront'
import { APP, LAUNCH, PRICING_FAQ, PRICING_POINTS, SITE, TIERS } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/storage'

export function Pricing() {
  useDocumentTitle('Pricing')
  const { format } = useCurrency()
  const live = launchActive()

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Simple', 'pricing']}
        eyebrow="One-time licence"
        intro="Buy once, keep the version you have, and take updates for a year. No subscription to keep the app running."
        art={<Holo kind="sphere" motion />}
        aside={
          <div className="mt-6 flex flex-col gap-3">
            <CurrencySwitch />
            <p className="text-[13px] text-muted">Prices include VAT where it applies. The exact amount is confirmed on your invoice.</p>
          </div>
        }
      />

      <section aria-label="Licence tiers" className="grid gap-2 md:grid-cols-3">
        {TIERS.map((t, i) => {
          const price = live ? launchPrice(t.price) : t.price
          return (
            <Reveal key={t.id} delay={i * 0.06} className="h-full">
              <Card
                as="article"
                tone={t.featured ? 'night' : 'white'}
                className="relative flex h-full flex-col p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className={cx('text-2xl font-medium uppercase tracking-[-0.03em]', t.featured && 'text-white')}>{t.name}</h2>
                  {t.featured && <Badge tone="light">Most chosen</Badge>}
                </div>
                <p className={cx('mt-1 text-sm', t.featured ? 'text-night-muted' : 'text-muted')}>
                  {t.seats} · {t.machines}
                </p>

                <p className="mt-8 text-[clamp(2.4rem,1.8rem+1.6vw,3.4rem)] leading-none tracking-[-0.055em]">{format(price)}</p>
                <p className={cx('mt-2 text-[13px]', t.featured ? 'text-night-muted' : 'text-muted')}>
                  {t.price === 0
                    ? 'Free forever'
                    : live
                      ? `Launch price until ${LAUNCH.endsLabel}, then ${format(t.price)}`
                      : `One-time · renew updates for ${format(launchPrice(t.price))}`}
                </p>

                <p className={cx('mt-6 text-[15px]', t.featured ? 'text-white/85' : 'text-ink-2')}>{t.body}</p>
                <ul className="mt-6 mb-8 grid gap-2.5 text-[15px]">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check className={cx('mt-0.5 size-4 shrink-0', t.featured ? 'text-violet-light' : 'text-violet')} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  to={t.id === 'free' ? '/docs' : '/support#buy'}
                  variant={t.featured ? 'light' : 'outline'}
                  className="mt-auto"
                  iconRight={<ArrowRight className="size-4" />}
                >
                  {t.cta}
                </ButtonLink>
              </Card>
            </Reveal>
          )
        })}
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
          <p className="order-2 max-w-md text-muted md:order-1">Four things worth knowing before you choose a tier.</p>
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
            Ask about a tier
          </ArrowLink>
        </div>
        <Accordion items={PRICING_FAQ} />
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6 text-sm text-muted sm:px-8">
        <p>
          Checkout, payment and VAT are handled by our merchant of record. Invoices are issued in {APP.name}&rsquo;s place by them, and your card details never reach us.
        </p>
        <ArrowLink to="/refunds" tone="ink" size="sm">
          Refund policy
        </ArrowLink>
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {SITE.disclaimer}
      </p>
    </div>
  )
}
