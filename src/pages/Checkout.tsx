import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
import { openPaddleCheckout, paddleConfigured, type PaddleCheckoutEvent } from '../lib/paddle'
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
  const ptxn = params.get('_ptxn') ?? ''
  const returnOpened = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [completed, setCompleted] = useState(false)

  const handleCheckoutEvent = (event: PaddleCheckoutEvent) => {
    if (event.name === 'checkout.completed') {
      setCompleted(true)
      setBusy(false)
    }
    if (event.name === 'checkout.closed') setBusy(false)
    if (event.name === 'checkout.error') {
      setBusy(false)
      setError('Paddle could not complete this checkout. No order was recorded; try again or contact support.')
    }
  }

  useEffect(() => {
    if (!ptxn || returnOpened.current) return
    returnOpened.current = true
    setTransactionId(ptxn)
    if (!paddleConfigured) {
      setError('Paddle checkout is not configured on this build yet. Please contact support.')
      return
    }
    openPaddleCheckout(ptxn, handleCheckoutEvent).catch(() => {
      setError('Paddle Checkout could not be opened. Check your connection and try again.')
    })
  }, [ptxn])

  if (!product && !ptxn) {
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
        <PageHero title={['Secure', 'checkout.']} eyebrow="Paddle Billing" intro={product ? `Buy ${product.name} through Paddle’s secure checkout.` : 'Complete your Paddle payment.'} titleSize="compact" />
        <BackendNotice />
      </div>
    )
  }

  if (ptxn) {
    return (
      <div className="grid gap-2 p-2">
        <PageHero title={['Secure', 'checkout.']} eyebrow="Paddle Billing" intro="Paddle is opening your payment details. Complete the payment in the secure overlay; this page will update when it closes." titleSize="compact" />
        <Card className="p-6 sm:p-8">
          {completed ? (
            <>
              <p className="text-lg font-semibold">Payment complete.</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Paddle confirmed the payment. Your order and licence will appear in your account once the signed webhook is processed.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink to="/orders" variant="violet" size="sm">View orders</ButtonLink>
                <ButtonLink to="/downloads" variant="outline" size="sm">Open downloads</ButtonLink>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">Opening Paddle Checkout…</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">If the overlay does not appear, check that Paddle’s client token and environment are configured for this build. No payment is taken until you complete the Paddle screen.</p>
              {error && <p role="alert" className="mt-4 rounded-lg bg-soft p-4 text-sm text-ink-2">{error}</p>}
              {transactionId && <p className="mt-4 font-mono text-[10px] text-faint">Paddle transaction {transactionId}</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink to="/orders" variant="outline" size="sm">View orders</ButtonLink>
                <ButtonLink to="/support" variant="outline" size="sm">Get help</ButtonLink>
              </div>
            </>
          )}
        </Card>
      </div>
    )
  }

  if (!product) return <Navigate to="/store" replace />

  if (!ready) {
    return <div className="p-4 text-sm text-muted">Checking your account…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  const start = async () => {
    setError('')
    if (!paddleConfigured) {
      return setError('Paddle checkout is not configured on this build yet. Please contact support.')
    }

    setBusy(true)
    const result = await createPaddleCheckout(product.slug)
    if (result.error) {
      setBusy(false)
      return setError(result.error)
    }
    if (!result.data) {
      setBusy(false)
      return setError('The checkout service did not return a Paddle transaction.')
    }

    setTransactionId(result.data.transactionId)
    try {
      await openPaddleCheckout(result.data.transactionId, handleCheckoutEvent)
    } catch {
      setBusy(false)
      setError('Paddle Checkout could not be opened. Check your connection and try again.')
    }
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

          {completed && (
            <div className="mt-6 rounded-xl border border-acid/30 bg-acid/10 p-4">
              <p className="font-medium text-ink">Payment complete.</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">Paddle confirmed the payment. Your order will appear under Orders and the licence under Downloads as soon as the signed webhook is processed.</p>
              {transactionId && <p className="mt-2 font-mono text-[10px] text-faint">Paddle transaction {transactionId}</p>}
              <div className="mt-3 flex flex-wrap gap-3">
                <ButtonLink to="/orders" variant="outline" size="sm">View orders</ButtonLink>
                <ButtonLink to="/downloads" variant="outline" size="sm">Open downloads</ButtonLink>
              </div>
            </div>
          )}

          {error && <p role="alert" className="mt-6 rounded-lg bg-soft p-4 text-sm text-ink-2">{error}</p>}

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              variant="violet"
              size="lg"
              loading={busy}
              disabled={completed}
              onClick={start}
              icon={<CreditCard className="size-4" aria-hidden />}
              iconRight={<ArrowRight className="size-4" aria-hidden />}
              className="w-full sm:w-auto"
            >
              {completed ? 'Payment complete' : 'Open Paddle checkout'}
            </Button>
            <Link to={`/products/${product.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-violet underline-offset-4 hov:text-violet-light hov:underline">
              <ArrowLeft className="size-4" aria-hidden />
              Back to {product.name}
            </Link>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-faint">
            Paddle Checkout opens here as a secure overlay and shows the final amount, currency and applicable tax before payment. The catalogue price is shown for comparison.
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
