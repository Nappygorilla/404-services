import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHero } from '../components/Nav'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/storage'

type Ticket = {
  id: string
  subject: string
  message: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In progress',
  waiting_on_customer: 'Waiting on you',
  resolved: 'Resolved',
  closed: 'Closed',
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function Tickets() {
  useDocumentTitle('Support tickets')
  const { configured, ready, user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!configured || !user || !supabase) return
    let active = true
    const client = supabase
    setLoading(true)
    client.from('support_tickets')
      .select('id, subject, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(25)
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError('Ticket storage is not ready. Apply supabase/marketplace.sql and verify the account policies.')
        else setTickets((data ?? []) as Ticket[])
        setLoading(false)
      })
    return () => { active = false }
  }, [configured, user?.id])

  if (!configured) {
    return <div className="grid gap-2 p-2"><PageHero title={['Support', 'tickets']} eyebrow="Customer support" intro="Create a private support request and follow its status from your LUNA account." /><BackendNotice /></div>
  }
  if (!ready) return <div className="p-4 text-sm text-muted">Checking your account…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: '/account/tickets' }} />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    if (subject.trim().length < 4 || subject.trim().length > 140) {
      setError('Subject must be between 4 and 140 characters.')
      return
    }
    if (message.trim().length < 10 || message.trim().length > 5000) {
      setError('Message must be between 10 and 5,000 characters.')
      return
    }
    setError('')
    setNotice('')
    setSending(true)
    const { data, error: insertError } = await supabase
      .from('support_tickets')
      .insert({ user_id: user.id, subject: subject.trim(), message: message.trim() })
      .select('id, subject, message, status, created_at')
      .single()
    setSending(false)
    if (insertError || !data) {
      setError('The ticket could not be saved. Confirm that supabase/marketplace.sql is applied and try again.')
      return
    }
    setTickets((current) => [data as Ticket, ...current])
    setSubject('')
    setMessage('')
    setNotice('Your support ticket was submitted.')
  }

  return (
    <div className="grid gap-2 p-2">
      <PageHero title={['Support', 'tickets']} eyebrow="Customer support" intro="Create a private support request and follow its status from your LUNA account." titleSize="compact" />
      <div className="grid gap-2 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-6 sm:p-8">
          <p className="caps text-violet">New request</p>
          <h2 className="mt-3 text-2xl font-semibold">How can we help?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Include the product, version, what you expected, and what happened. Do not include passwords, payment card details, or private access tokens.</p>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">Subject
              <input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={140} required minLength={4} placeholder="What do you need help with?" className="h-11 rounded-lg border border-line-strong bg-soft px-3 text-sm outline-none focus-visible:border-violet" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">Message
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={5000} minLength={10} required rows={6} placeholder="Describe the issue and the steps to reproduce it…" className="resize-y rounded-lg border border-line-strong bg-soft px-3 py-3 text-sm leading-relaxed outline-none focus-visible:border-violet" />
            </label>
            <p className="text-xs text-muted">Signed in as {user.email}</p>
            {error && <p role="alert" className="text-sm text-danger">{error}</p>}
            {notice && <p role="status" className="text-sm text-success">{notice}</p>}
            <Button type="submit" variant="violet" loading={sending} disabled={sending}>Submit ticket</Button>
          </form>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3"><div><p className="caps text-violet">Your requests</p><h2 className="mt-2 text-2xl font-semibold">Ticket history</h2></div><Badge>{tickets.length} shown</Badge></div>
          {loading ? <p className="mt-6 text-sm text-muted">Loading support tickets…</p> : error && tickets.length === 0 ? <p className="mt-6 rounded-lg bg-soft p-4 text-sm text-muted">{error}</p> : tickets.length === 0 ? <div className="mt-6 rounded-xl border border-dashed border-line-strong p-6"><p className="font-medium">No support tickets yet.</p><p className="mt-2 text-sm text-muted">When you submit a request, its status and date will appear here.</p></div> : (
            <ul className="mt-5 grid gap-3">
              {tickets.map((ticket) => <li key={ticket.id} className="rounded-xl border border-line bg-soft p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{ticket.subject}</h3><Badge tone={ticket.status === 'resolved' || ticket.status === 'closed' ? 'success' : 'outline'}>{STATUS_LABELS[ticket.status] ?? ticket.status}</Badge></div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{ticket.message}</p>
                <p className="mt-3 font-mono text-[10px] text-faint">{dateLabel(ticket.created_at)} · {ticket.id.slice(0, 8)}</p>
              </li>)}
            </ul>
          )}
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">Ticket replies and staff-side status updates still require an operator workflow. This page currently supports customer submission and private ticket history.</p>
        </Card>
      </div>
    </div>
  )
}
