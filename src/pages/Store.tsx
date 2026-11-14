import { ArrowRight, Check, Mail } from 'lucide-react'

import { ArrowLink, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { LicenceCard } from '../components/LicenceCard'
import { PageHero } from '../components/Nav'
import { CurrencySwitch } from '../components/Price'
import { GENRE_INTRO, LICENCE_INCLUDES, PLATFORMS, SITE } from '../data'
import { useDocumentTitle } from '../lib/storage'

/*
  The shop, modelled on per-product cheat stores: each platform is its own
  product with its own price, status and buy action. Categories are examples
  inside a product page, not extra SKUs. Checkout is by email while card
  payments are being connected, and the page says so instead of pretending.
*/
const STEPS = [
  { title: 'Tell us the platform', body: 'Email us the licence you want — FiveM or Roblox — and the email address for the receipt.' },
  { title: 'Pay by link', body: 'We reply with a payment link and a VAT invoice. Card details are handled by the payment provider, not this site.' },
  { title: 'Get your key', body: 'The key arrives by email with the download link. Paste it into LUNA Desktop once and activate up to two machines.' },
]

export function Store() {
  useDocumentTitle('Store')

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Two licences,', 'sold separately']}
        eyebrow="Store"
        intro="Buy the FiveM licence or the Roblox licence on its own. Each is a one-time purchase with twelve months of updates. Every category on that platform is included — there is nothing else to add to a basket."
        art={<Holo kind="prism" motion />}
        titleSize="compact"
        aside={
          <div className="mt-6 flex flex-col gap-4">
            <CurrencySwitch />
            <ArrowLink to="/status" tone="ink" size="sm">
              Service status
            </ArrowLink>
          </div>
        }
      />

      <section aria-label="Platform licences" className="grid gap-2 md:grid-cols-2">
        {PLATFORMS.map((platform) => (
          <LicenceCard key={platform.slug} platform={platform} />
        ))}
      </section>

      <p className="px-2 text-[13px] leading-relaxed text-muted">
        {GENRE_INTRO.rule} Categories shown on each licence page are examples of what that licence covers, not separate products.
      </p>

      <section aria-labelledby="licence-includes" className="grid gap-2 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="flex flex-col p-6 sm:p-8">
          <p className="caps text-violet">Every licence</p>
          <Title id="licence-includes" lines={['What you', 'get']} align="left" size="sm" />
          <ul className="mt-6 grid gap-3">
            {LICENCE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-7">
            <ArrowLink to="/pricing" size="sm">
              Compare licence terms
            </ArrowLink>
          </div>
        </Card>

        <Card tone="night" className="flex flex-col p-6 sm:p-8">
          <p className="caps text-violet-light">Checkout</p>
          <Title lines={['How buying', 'works']} align="left" size="sm" />
          <ol className="mt-6 grid gap-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="font-mono text-xs text-violet-light">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-night-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
            <ButtonLink
              to={`mailto:${SITE.email}?subject=${encodeURIComponent('Platform licence order')}&body=${encodeURIComponent('Platform (FiveM / Roblox):\nName:\nCountry:\nVAT number (optional):')}`}
              variant="light"
              icon={<Mail className="size-4" aria-hidden />}
            >
              Start an order
            </ButtonLink>
            <ArrowLink to="/support#buy" tone="light" size="sm">
              Buying questions
            </ArrowLink>
          </div>
        </Card>
      </section>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <p className="caps text-violet">Not sure which platform?</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Start from what you are building.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The category overview shows the kind of projects each platform licence covers, with links back to the matching licence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/games" variant="outline" iconRight={<ArrowRight className="size-4" />}>
            Browse categories
          </ButtonLink>
          <ButtonLink to="/docs" variant="outline">
            Read the docs
          </ButtonLink>
        </div>
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {SITE.disclaimer}
      </p>
    </div>
  )
}
