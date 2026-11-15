import { ArrowRight, CreditCard, Download, FileText, LifeBuoy, LogOut, MessageSquareText, ShieldCheck, UserRound, UserCog, KeyRound } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router'

import { displayNameOf, useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { APP } from '../data'
import { useDocumentTitle } from '../lib/storage'

const ACCOUNT_LINKS = [
  { to: '/downloads', title: 'Downloads', body: 'Loader installers and release files', icon: Download },
  { to: '/orders', title: 'Order history', body: 'Purchases and invoice references', icon: CreditCard },
  { to: '/account/licenses', title: 'Licenses', body: 'Your active product entitlements', icon: ShieldCheck },
  { to: '/account/tickets', title: 'Support tickets', body: 'Submit and track private requests', icon: MessageSquareText },
  { to: '/account/profile', title: 'Profile settings', body: 'Update your display name', icon: UserCog },
  { to: '/account/security', title: 'Security', body: 'Change your password and sign out', icon: KeyRound },
  { to: '/forums', title: 'Community', body: 'Announcements and member discussions', icon: FileText },
  { to: '/support', title: 'Support', body: 'Get help with 404 Services', icon: LifeBuoy },
]

export function Account() {
  useDocumentTitle('Account')
  const { configured, ready, user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Your', 'account']} eyebrow="Customer dashboard" intro="Manage your profile, downloads, orders, and support from one place." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />

  const name = displayNameOf(user)
  const joined = user.created_at
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(user.created_at))
    : '—'

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Your', 'account']} eyebrow="Customer dashboard" intro="Your 404 Services profile and the places to manage your purchases, software access, and support." art={<UserRound className="size-24 text-violet/80" />} titleSize="compact" />

      <section className="grid gap-2 lg:grid-cols-[.82fr_1.18fr]">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-violet/15 text-xl font-semibold text-violet-light">{name.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0"><h2 className="truncate text-xl font-semibold">{name}</h2><p className="truncate text-sm text-muted">{user.email}</p></div>
          </div>
          <div className="mt-6 grid gap-3 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between gap-3"><span className="text-muted">Account status</span><Badge tone="success">Signed in</Badge></div>
            <div className="flex items-center justify-between gap-3"><span className="text-muted">Email verification</span><Badge tone={user.email_confirmed_at ? 'success' : 'outline'}>{user.email_confirmed_at ? 'Confirmed' : 'Pending'}</Badge></div>
            <div className="flex items-center justify-between gap-3"><span className="text-muted">Member since</span><span className="text-right text-ink">{joined}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-muted">Desktop version</span><span className="font-mono text-ink">v{APP.version}</span></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" icon={<LogOut className="size-4" />} onClick={async () => { await signOut(); navigate('/', { replace: true }) }}>Sign out</Button>
            <Link to="/support" className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-violet hov:text-violet-light">Get help <ArrowRight className="size-4" /></Link>
          </div>
        </Card>

        <div className="grid gap-2 sm:grid-cols-2">
          {ACCOUNT_LINKS.map((item) => {
            const Icon = item.icon
            return <Link key={item.to} to={item.to} className="group block h-full">
              <Card className="flex h-full min-h-[132px] flex-col p-5 transition-colors group-hov:border-violet/60">
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-violet/10 text-violet"><Icon className="size-5" /></span><ArrowRight className="size-4 text-muted transition-transform group-hov:translate-x-1 group-hov:text-violet" /></div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
              </Card>
            </Link>
          })}
        </div>
      </section>

      <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><p className="caps text-violet">Purchases</p><h2 className="mt-2 text-lg font-semibold">Orders and licences live in your account.</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">Checkout runs on Paddle’s hosted page. After Paddle confirms payment, the order and download entitlement are recorded server-side and appear under Orders and Downloads.</p></div>
        <Badge tone="success">Paddle</Badge>
      </Card>
    </div>
  )
}
