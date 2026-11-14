import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { ReceiptText } from 'lucide-react'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

type OrderItem = { product_name_snapshot: string; quantity: number }
type Order = {
  id: string
  provider_reference: string
  status: string
  currency: string
  total_minor: number
  created_at: string
  paid_at: string | null
  order_items: OrderItem[]
}

function priceLabel(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency}`
  }
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

export function Orders() {
  useDocumentTitle('Orders')
  const { configured, ready, user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!configured || !user || !supabase) return
    let active = true
    const client = supabase
    setLoading(true)
    client.from('orders')
      .select('id, provider_reference, status, currency, total_minor, created_at, paid_at, order_items(product_name_snapshot, quantity)')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!active) return
        if (error) setLoadError('Order storage is not ready. Apply supabase/marketplace.sql and confirm row-level security is enabled.')
        else setOrders((data ?? []) as unknown as Order[])
        setLoading(false)
      })
    return () => { active = false }
  }, [configured, user?.id])

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Order', 'history']} eyebrow="Customer account" intro="Your completed purchases and invoice references will appear here once account records are connected." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/orders' }} />

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Order', 'history']} eyebrow="Customer account" intro="A private record of the purchases and payment references associated with your LUNA account." art={<ReceiptText className="size-24 text-violet/80" />} titleSize="compact" />
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="caps text-violet">Purchases</p><h2 className="mt-2 text-2xl font-semibold">Your orders</h2><p className="mt-1 text-sm text-muted">{user.email}</p></div><Badge tone="outline">{loading ? 'Loading' : `${orders.length} orders`}</Badge></div>
        {loading ? <p className="mt-6 text-sm text-muted">Loading order history…</p> : loadError ? <p role="alert" className="mt-6 rounded-lg bg-soft p-4 text-sm text-muted">{loadError}</p> : orders.length === 0 ? <div className="mt-6 rounded-xl border border-dashed border-line-strong p-6"><p className="font-medium">No orders are attached to this account.</p><p className="mt-2 text-sm text-muted">Orders appear after a payment provider webhook has been verified and the server records the purchase.</p></div> : (
          <ul className="mt-6 grid gap-3">
            {orders.map((order) => <li key={order.id} className="rounded-xl border border-line bg-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[10px] text-faint">ORDER {order.provider_reference}</p><h3 className="mt-1 text-lg font-semibold">{priceLabel(order.total_minor, order.currency)}</h3><p className="mt-1 text-xs text-muted">Placed {dateLabel(order.created_at)}</p></div><Badge tone={order.status === 'paid' ? 'success' : 'outline'}>{order.status}</Badge></div>
              <ul className="mt-4 grid gap-1 border-t border-line pt-3 text-sm text-ink-2">{(order.order_items ?? []).map((item, index) => <li key={`${item.product_name_snapshot}-${index}`} className="flex justify-between gap-3"><span>{item.product_name_snapshot}</span><span className="text-muted">× {item.quantity}</span></li>)}</ul>
              {order.paid_at && <p className="mt-3 text-xs text-muted">Paid {dateLabel(order.paid_at)}</p>}
            </li>)}
          </ul>
        )}
      </Card>
      <p className="px-2 text-xs text-muted">Need help with an order? <Link to="/account/tickets" className="text-violet underline-offset-4 hov:underline">Open a support ticket</Link>.</p>
    </div>
  )
}
