import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { PriceTag } from '../components/ProductCards'
import { BUNDLE, PLATFORM_LABEL, isBundle, productBySlug } from '../data'
import { createPaddleCheckout } from '../lib/payments'
import { useDocumentTitle } from '../lib/storage'

const PAYMENT_POINTS = [
  'Paddle is the merchant of record and handles the card payment, tax and invoice.',
  'Card details are entered on Paddle’s hosted checkout, never on this site.',
  'Your order and download entitlement are issued only after Paddle confirms payment.',
]

export function Checkout() {
  useDocumentTitle('Checkout')
  const { configured, ready, user } = useAuth()
  const [params] = useSearchParams()
  const location = useLocation()
  const slug = params.get('product') ?? ''
  const product = productBySlug(slug)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!product) {
    return (
      <div className="grid gap-2 p-2">
        <PageHero
          title={['Checkout', 'not found.']}
          eyebrow="Secure checkout"
          intro="That product is not in the current catalogue. Pick a cheat or the optional bundle before starting checkout."
          titleSize="compact"
        />
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <p className="max-w-xl text-sm leading-relaxed text-muted">Every current cheat has its own product page and price. 404 Complete is optional.</p>
          <ButtonLink to="/store" variant="violet" iconRight={<ArrowRight className="size-4" aria-hidden />}>
            Browse the store
          </ButtonLink>
        </Card>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="grid gap-2 p-2">
        <PageHero title={['Secure', 'checkout.']} eyebrow="Paddle Billing" intro={`Buy ${product.name} through Paddle’s hosted checkout.`} titleSize="compact" />
        <BackendNotice />
      </div>
    )
  }

  if (!ready) {
    return <div className="p-4 text-sm text-muted">Checking your account…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  const start = async () => {
    setBusy(true)
    setError('')
    const result = await createPaddleCheckout(product.slug)
    setBusy(false)
    if (result.error) return setError(result.error)
    if (result.data) window.location.assign(result.data.checkoutUrl)
  }

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Complete', 'your order.']}
        eyebrow="Paddle secure checkout"
        intro={`You are buying ${product.name}. The licence is one-time and attaches to your 404 Services account after Paddle confirms payment.`}
        art={<Holo kind={product.art} motion priority />}
        titleSize="compact"
        aside={
          <div className="mt-7 rounded-2xl border border-white/12 bg-white/[.05] p-5">
            <p className="eyebrow text-[9px] text-pink">Signed in</p>
            <p className="mt-2 text-sm text-white/80">{user.email}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white/45">Keep this account signed in. Product access is attached to it, not to the email typed at checkout.</p>
          </div>
        }
      />

      <section className="grid gap-2 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="outline">{isBundle(product) ? 'Optional bundle' : PLATFORM_LABEL[product.platform]}</Badge>
            {!isBundle(product) && <Badge>{product.kind}</Badge>}
            <Badge tone="success"><Check className="mr-1 size-3" aria-hidden /> One-time licence</Badge>
          </div>
          <div className="mt-5 flex items-start justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">{product.name}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{product.tagline}</p>
            </div>
            <PriceTag price={product.price} size="md" note={false} className="shrink-0 text-right" />
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <p className="caps text-violet">What happens next</p>
            <ul className="mt-4 grid gap-3">
              {PAYMENT_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ink-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {error && <p role="alert" className="mt-6 rounded-lg bg-soft p-4 text-sm text-ink-2">{error}</p>}

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              variant="violet"
              size="lg"
              loading={busy}
              onClick={start}
              icon={<CreditCard className="size-4" aria-hidden />}
              iconRight={<ArrowRight className="size-4" aria-hidden />}
              className="w-full sm:w-auto"
            >
              Continue to Paddle
            </Button>
            <Link to={`/products/${product.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-violet underline-offset-4 hov:text-violet-light hov:underline">
              <ArrowLeft className="size-4" aria-hidden />
              Back to {product.name}
            </Link>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-faint">
            Paddle shows the final amount, currency and applicable tax before payment. The catalogue price is shown here for comparison.
          </p>
        </Card>

        <div className="grid content-start gap-2">
          <Card className="p-6 sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><ShieldCheck className="size-5" /></span>
            <h2 className="mt-4 text-xl font-semibold">Payment protection</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Paddle is the merchant of record for this order. Its hosted checkout takes the payment and issues the invoice; 404 Services never receives or stores your card number.
            </p>
          </Card>
          <Card className="p-6 sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-violet/10 text-violet"><LockKeyhole className="size-5" /></span>
            <h2 className="mt-4 text-xl font-semibold">Access after payment</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Paddle sends a signature-verified webhook. Once it is processed, the order appears under Orders and the licence under Downloads. This can take a moment after the payment screen closes.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <ButtonLink to="/orders" variant="outline" size="sm">Orders</ButtonLink>
              <ButtonLink to="/downloads" variant="outline" size="sm">Downloads</ButtonLink>
            </div>
          </Card>
          <p className="px-2 text-[11px] leading-relaxed text-faint">
            Buying the optional {BUNDLE.name} bundle includes every cheat listed on its product page at the time of purchase.
          </p>
        </div>
      </section>
    </div>
  )
}
