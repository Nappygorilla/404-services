import { ArrowRight, Check, MailCheck } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Field, FormMessage, Input } from '../components/Field'
import { Nav } from '../components/Nav'
import { useDocumentTitle } from '../lib/storage'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function AuthShell({
  title,
  eyebrow,
  intro,
  points,
  note,
  children,
}: {
  title: string
  eyebrow: string
  intro: string
  points: string[]
  note: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2 p-2">
      <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-card px-5 pt-3 pb-8 sm:px-8 sm:pb-10">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden />
        <div className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-violet/20 blur-[130px]" aria-hidden />
        <div className="relative">
          <Nav />
        </div>
        <div className="relative mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[1fr_minmax(0,25rem)] lg:items-start lg:gap-14">
          <div>
            <p className="caps text-violet">{eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.6rem,1.4rem+4vw,5rem)]">{title}</h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-pretty text-ink-2">{intro}</p>
            <ul className="mt-7 grid max-w-md gap-3 text-[15px]">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-muted">{note}</p>
          </div>
          <div className="grid gap-4">{children}</div>
        </div>
      </section>
    </div>
  )
}

export function Login() {
  useDocumentTitle('Sign in')
  const { configured, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) return setError('Enter the email address you registered with.')
    if (!password) return setError('Enter your password.')
    setError('')
    setBusy(true)
    const result = await signIn(email, password)
    setBusy(false)
    if (result.error) return setError(result.error)
    navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Sign in"
      eyebrow="Account"
      intro="Pick up where you left off: your posts, your licence records and the boards you follow."
      points={['Post to the issues board', 'See your licence and update window', 'Manage the email on the account']}
      note="Your account is only used for the community boards and licence records. The loader does not need it to run."
    >
      {!configured && <BackendNotice />}
      <form className="grid gap-4" onSubmit={submit} noValidate>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <Field label="Email">
          {(p) => <Input {...p} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />}
        </Field>
        <Field label="Password">
          {(p) => <Input {...p} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />}
        </Field>
        <Button type="submit" variant="violet" loading={busy} disabled={!configured} iconRight={<ArrowRight className="size-4" />}>
          Sign in
        </Button>
        <p className="text-center text-sm text-muted">
          No account yet?{' '}
          <Link to="/register" className="text-ink underline-offset-4 hov:text-violet-light hov:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export function Register() {
  useDocumentTitle('Create account')
  const { configured, signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Tell us what to call you, at least 2 characters.')
    if (!EMAIL.test(email.trim())) return setError('That email address does not look valid.')
    if (password.length < 8) return setError('Use at least 8 characters for the password.')
    if (password !== confirm) return setError('The two passwords do not match.')
    setError('')
    setBusy(true)
    const result = await signUp(email, password, name)
    setBusy(false)
    if (result.error) return setError(result.error)
    if (result.needsConfirmation) return setSent(true)
    navigate('/account', { replace: true })
  }

  if (sent) {
    return (
      <AuthShell
        title="Check inbox"
        eyebrow="Almost there"
        intro="One click in the email confirms the address, then the boards open."
        points={['Confirm the address from the email', 'Sign in with the same details', 'Post on the issues board']}
        note="The confirmation link expires after a while. If it never arrives, check spam, then try signing in."
      >
        <Card className="grid gap-3 p-6">
          <MailCheck className="size-6 text-violet" aria-hidden />
          <p className="text-[15px] font-medium">Confirmation sent to {email.trim()}</p>
          <p className="text-[13px] leading-relaxed text-muted">
            The account may already be active if no confirmation is required. Try signing in if the link does not arrive.
          </p>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hov:text-violet-light hov:underline">
            Go to sign in
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create account"
      eyebrow="Free to join"
      intro="An account runs the community boards and licence records. It is not needed to buy or use a cheat."
      points={['Post issues and follow replies', 'Keep licence keys in one place', 'No marketing email unless you ask']}
      note="Registration takes an email and a password. We never ask for a game account, and your game files stay on your PC."
    >
      {!configured && <BackendNotice />}
      <form className="grid gap-4" onSubmit={submit} noValidate>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <Field label="Display name" hint="Shown next to your posts.">
          {(p) => <Input {...p} autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name or handle" />}
        </Field>
        <Field label="Email">
          {(p) => <Input {...p} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />}
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          {(p) => <Input {...p} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />}
        </Field>
        <Field label="Repeat password">
          {(p) => <Input {...p} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Same password again" />}
        </Field>
        <Button type="submit" variant="violet" loading={busy} disabled={!configured} iconRight={<ArrowRight className="size-4" />}>
          Create account
        </Button>
        <p className="text-center text-sm text-muted">
          Already registered?{' '}
          <Link to="/login" className="text-ink underline-offset-4 hov:text-violet-light hov:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
