import { ClipboardList, LockKeyhole } from 'lucide-react'
import { Link, Navigate } from 'react-router'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { useDocumentTitle } from '../lib/storage'

export function Orders() {
  useDocumentTitle('Orders')
  const { configured, ready, user } = useAuth()

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Order', 'history']} eyebrow="Customer account" intro="Your order history will live here once checkout and account records are connected." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/orders' }} />

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Order', 'history']} eyebrow="Customer account" intro="A private record of completed purchases, invoices, and order references." art={<ClipboardList className="size-24 text-violet/80" />} titleSize="compact" />
      <Card className="grid gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-violet/10 text-violet"><LockKeyhole className="size-6" aria-hidden /></span>
            <div><h2 className="text-xl font-medium">Order history is not connected yet</h2><p className="mt-1 text-sm text-muted">{user.email}</p></div>
          </div>
          <Badge tone="outline">Not configured</Badge>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">Checkout is not connected to a payment provider, and no order records are currently available. This page will show actual order data only after payment webhooks and customer-level database permissions are configured.</p>
        <ButtonLink to="/pricing" variant="violet">View plans</ButtonLink>
      </Card>
      <p className="px-2 text-xs text-muted">Need help with an existing request? <Link to="/support" className="text-violet underline-offset-4 hov:underline">Contact support</Link>.</p>
    </div>
  )
}
