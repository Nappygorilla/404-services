import { ArrowRight, Check, Mail } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { PriceTag } from '../components/ProductCards'
import { APP, BUNDLE, PLATFORM_LABEL, SITE, SUPPORT, SUPPORT_FAQ, isBundle, productBySlug } from '../data'
import { checkoutHref, orderMailto } from '../lib/commerce'
import { useDocumentTitle } from '../lib/storage'

export function Support() {
  useDocumentTitle('Support')
  const [params] = useSearchParams()
  const selected = productBySlug(params.get('product') ?? '')

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
              to={orderMailto(selected?.name ?? 'Cheat licence')}
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
          <Title id="buy-title" lines={['Buying', selected ? 'this cheat' : 'a licence']} align="left" size="sm" />
          <p className="mt-5 max-w-xl text-white/85">
            Checkout is handled by Paddle, our merchant of record. Sign in, choose a cheat and pay on Paddle’s hosted checkout; card details never reach this site. Every cheat is sold separately and {BUNDLE.name} is optional. After Paddle confirms payment, the order and download entitlement appear in your account.
          </p>

          {selected && (
            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="light">Selected cheat</Badge>
                <Badge tone="light">
                  {isBundle(selected) ? 'Optional bundle' : `${PLATFORM_LABEL[selected.platform]} · ${selected.kind}`}
                </Badge>
              </div>
              <h3 className="mt-3 text-xl font-medium text-white">{selected.name}</h3>
              <PriceTag price={selected.price} tone="light" size="sm" note={false} className="mt-2" />
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <ButtonLink
              to={selected ? checkoutHref(selected.slug) : '/store'}
              variant="light"
              iconRight={<ArrowRight className="size-4" aria-hidden />}
            >
              {selected ? 'Continue to checkout' : 'Choose a cheat'}
            </ButtonLink>
            <ArrowLink to="/pricing" tone="light" size="sm">
              Compare prices
            </ArrowLink>
          </div>
          <p className="mt-6 text-sm text-night-muted">
            {selected ? 'Paddle shows the final amount, currency and applicable tax before you pay.' : 'Browse the store to see every cheat and its price, then start checkout from its product page.'}
          </p>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-medium tracking-[-0.03em]">Response times</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {SUPPORT.responseTimes.map((row) => (
              <li key={row.audience} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                <span className="font-medium">{row.audience}</span>
                <span className="text-right text-muted">{row.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted">Targets, not guarantees — but we are a small team and we read everything.</p>
          <div className="mt-5 border-t border-line pt-4">
            <ArrowLink to="/store" size="sm">Browse all cheats</ArrowLink>
          </div>
        </Card>
      </section>

      <section aria-labelledby="checklist" className="grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6 sm:p-8">
          <Title id="checklist" lines={['What to', 'include']} align="left" size="sm" />
          <p className="mt-4 max-w-sm text-muted">The difference between one reply and six is usually these four lines.</p>
        </Card>
        <Card className="p-6 sm:p-8">
          <ul className="grid gap-3">
            {SUPPORT.checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-xs text-muted">404 Loader reference: v{APP.version}. Never send a game password, a private key or full payment details.</p>
        </Card>
      </section>

      <Card as="section" aria-labelledby="support-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="support-faq" lines={['Before you', 'write in']} align="left" />
          <ArrowLink to="/docs" size="sm">Read the docs</ArrowLink>
        </div>
        <Accordion items={SUPPORT_FAQ} />
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        {SITE.company} · {SITE.hours} · {SITE.email}
      </p>
    </div>
  )
}
