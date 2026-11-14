import { ArrowRight, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'

import { displayNameOf, useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { ArrowLink, Badge, Title } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP } from '../data'
import { useDocumentTitle } from '../lib/storage'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3 last:border-0">
      <dt className="caps text-[10px] text-faint">{label}</dt>
      <dd className="text-[15px] text-ink">{children}</dd>
    </div>
  )
}

export function Account() {
  useDocumentTitle('Account')
  const { configured, ready, user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!configured) {
    return (
      <div className="grid gap-2 p-2">
        <PageHero title={['Your', 'account']} eyebrow="Account" intro="Sign-in and licence records live here." art={<Holo kind="knot" motion />} titleSize="compact" />
        <BackendNotice />
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="grid gap-2 p-2">
        <Card className="p-8">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Checking session…</p>
        </Card>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />

  const name = displayNameOf(user)
  const joined = user.created_at ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(user.created_at)) : '—'

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Your', 'account']} eyebrow="Signed in" intro="Licence details, the boards you post on, and the way out." art={<Holo kind="knot" motion />} titleSize="compact" />

      <section className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="round holo-fill grid size-14 place-items-center rounded-full text-xl font-medium text-white" aria-hidden>
              {name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-xl font-medium tracking-[-0.03em]">{name}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6">
            <Row label="Member since">{joined}</Row>
            <Row label="Email status">
              <Badge tone={user.email_confirmed_at ? 'success' : 'outline'}>{user.email_confirmed_at ? 'Confirmed' : 'Unconfirmed'}</Badge>
            </Row>
            <Row label="Product version">v{APP.version}</Row>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              icon={<LogOut className="size-4" />}
              onClick={async () => {
                await signOut()
                navigate('/', { replace: true })
              }}
            >
              Sign out
            </Button>
            <ArrowLink to="/support" size="sm">
              Need a hand?
            </ArrowLink>
          </div>
        </Card>

        <Card className="flex flex-col p-6 sm:p-8">
          <Title lines={['Where to', 'next']} align="left" size="sm" />
          <ul className="mt-5 grid gap-3 text-[15px]">
            <li>
              <Link to="/forums/issues" className="inline-flex min-h-10 items-center gap-1.5 text-ink underline-offset-4 hov:text-violet-light hov:underline">
                Open an issue
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
            <li>
              <Link to="/forums/announcements" className="inline-flex min-h-10 items-center gap-1.5 text-ink underline-offset-4 hov:text-violet-light hov:underline">
                Read announcements
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
            <li>
              <Link to="/licence" className="inline-flex min-h-10 items-center gap-1.5 text-ink underline-offset-4 hov:text-violet-light hov:underline">
                What the licence covers
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          </ul>
          <p className="mt-auto pt-6 text-[13px] leading-relaxed text-muted">
            Licence keys appear here once checkout is connected. Until then the account is for the boards only.
          </p>
        </Card>
      </section>
    </div>
  )
}
