import { ArrowRight, Loader2, Megaphone, MessageSquare, PenLine } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'

import { displayNameOf, useAuth } from '../components/Auth'
import { BackendNotice } from '../components/BackendNotice'
import { Badge, EmptyState, Title } from '../components/Bits'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Field, FormMessage, Input, Textarea } from '../components/Field'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { createThread, listThreads, removeThread, type Board, type Thread } from '../lib/forum'
import { useDocumentTitle } from '../lib/storage'
import { NotFound } from './NotFound'

const BOARDS = [
  {
    slug: 'announcements' as const,
    name: 'Announcements',
    icon: Megaphone,
    blurb: 'Release notes, game updates and anything that affects the loader, written by the team.',
    rule: 'Read-only. Only the team can post here.',
  },
  {
    slug: 'issues' as const,
    name: 'Issues',
    icon: MessageSquare,
    blurb: 'Something broken, confusing or missing? Open a topic with the version and what you expected.',
    rule: 'Signed-in members can post and answer.',
  },
]

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

function ThreadCard({ thread, onDeleted, canDelete }: { thread: Thread; onDeleted: () => void; canDelete: boolean }) {
  const [busy, setBusy] = useState(false)
  return (
    <Card as="article" className="p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[clamp(1.15rem,1rem+0.5vw,1.5rem)] leading-snug font-medium tracking-[-0.03em]">{thread.title}</h2>
          <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.12em] text-faint uppercase">
            {thread.author_name} · {formatDate(thread.created_at)}
          </p>
        </div>
        {canDelete && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm('Delete this topic? This cannot be undone.')) return
              setBusy(true)
              await removeThread(thread.id)
              setBusy(false)
              onDeleted()
            }}
            className="round inline-flex h-8 items-center rounded-full border border-line-strong px-3 text-[12px] font-medium text-muted transition-colors hov:border-danger hov:text-danger disabled:opacity-40"
          >
            Delete
          </button>
        )}
      </div>
      <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{thread.body}</p>
    </Card>
  )
}

function Composer({ onPosted }: { onPosted: () => void }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!user) {
    return (
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-[15px] font-medium">Sign in to open a topic</p>
          <p className="mt-1 text-[13px] text-muted">Posting needs an account so replies have somewhere to go.</p>
        </div>
        <Link
          to="/login"
          state={{ from: '/forums/issues' }}
          className="round inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 text-[15px] font-medium text-white shadow-[var(--shadow-violet)] transition-colors hov:bg-violet-deep"
        >
          Sign in
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Card>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const result = await createThread({
      board: 'issues',
      title,
      body,
      authorId: user.id,
      authorName: displayNameOf(user),
    })
    setBusy(false)
    if (result.error) return setError(result.error)
    setTitle('')
    setBody('')
    onPosted()
  }

  return (
    <Card as="section" aria-labelledby="compose" className="p-6 sm:p-8">
      <h2 id="compose" className="text-lg font-medium tracking-[-0.02em]">
        Open a topic
      </h2>
      <form className="mt-4 grid gap-4" onSubmit={submit} noValidate>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <Field label="Title" hint="One line: what is happening?">
          {(p) => <Input {...p} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Loader does not attach to FiveM" />}
        </Field>
        <Field label="Details" hint="Loader version, game, what you expected, what happened.">
          {(p) => <Textarea {...p} value={body} maxLength={4000} onChange={(e) => setBody(e.target.value)} placeholder={'Loader 4.0.4 · FiveM\nSteps to reproduce…\nExpected…\nActual…'} />}
        </Field>
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-faint uppercase">{body.length}/4000</span>
          <Button type="submit" variant="violet" loading={busy} icon={<PenLine className="size-4" />}>
            Post topic
          </Button>
        </div>
      </form>
    </Card>
  )
}

export function Forums() {
  useDocumentTitle('Forums')
  const { configured } = useAuth()
  const [counts, setCounts] = useState<Record<string, number | null>>({})

  useEffect(() => {
    if (!configured) return
    let alive = true
    Promise.all(BOARDS.map(async (b) => [b.slug, await listThreads(b.slug)] as const)).then((rows) => {
      if (!alive) return
      const next: Record<string, number | null> = {}
      for (const [slug, res] of rows) next[slug] = res.error ? null : res.threads.length
      setCounts(next)
    })
    return () => {
      alive = false
    }
  }, [configured])

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Community']}
        eyebrow="Forums"
        intro="Two boards: one for what the team ships, one for what is not working. Accounts are free, and the loader never needs one."
        art={<Holo kind="sphere" motion />}
        titleSize="compact"
      />

      {!configured && <BackendNotice />}

      <section aria-label="Boards" className="grid gap-2 md:grid-cols-2">
        {BOARDS.map(({ slug, name, icon: Icon, blurb, rule }) => (
          <Card key={slug} as="article" className="flex h-full flex-col p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="round grid size-11 place-items-center rounded-full border border-violet/35 bg-violet/15 text-violet-light">
                <Icon className="size-5" aria-hidden />
              </span>
              {counts[slug] != null && <Badge tone="outline">{`${counts[slug]} ${counts[slug] === 1 ? 'topic' : 'topics'}`}</Badge>}
            </div>
            <h2 className="display mt-5 text-[clamp(1.7rem,1.3rem+1.4vw,2.4rem)]">{name}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{blurb}</p>
            <p className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-faint uppercase">{rule}</p>
            <div className="mt-auto pt-6">
              <Link
                to={`/forums/${slug}`}
                className="round inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors hov:border-violet hov:bg-violet hov:text-white"
              >
                Open board
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <Card as="section" aria-labelledby="guidelines" className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <Title id="guidelines" lines={['House', 'rules']} align="left" />
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted">
            Short version: be specific, be decent, do not paste licence keys.
          </p>
        </div>
        <ul className="grid gap-3 text-[15px]">
          {[
            'One issue per topic, with the loader version and game in the body.',
            'Search the board before opening a new one — duplicate topics get merged.',
            'Never post a licence key, invoice or account credentials.',
            'Answers come from the team and from other members; no promises on timing.',
          ].map((rule) => (
            <li key={rule} className="flex items-start gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" aria-hidden />
              {rule}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export function ForumBoard() {
  const { board = '' } = useParams()
  const meta = BOARDS.find((b) => b.slug === board)
  const { configured, user } = useAuth()
  useDocumentTitle(meta ? meta.name : 'Board not found')

  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!meta) return
    if (!configured) {
      setLoading(false)
      setThreads([])
      setError('')
      return
    }
    setLoading(true)
    const result = await listThreads(meta.slug as Board)
    setThreads(result.threads)
    setError(result.error ?? '')
    setLoading(false)
  }, [meta, configured])

  useEffect(() => {
    void load()
  }, [load])

  if (!meta) return <NotFound title="Board not found" body="The community has two boards: announcements and issues." to="/forums" action="Back to forums" />

  return (
    <div className="grid gap-2 p-2">
      <PageHero
        // A single eight-syllable word cannot hold the hero scale at 390px, so
        // the announcements board reads as two short lines like the changelog.
        title={meta.slug === 'announcements' ? ['Team', 'updates'] : [meta.name]}
        eyebrow={meta.slug === 'announcements' ? 'Announcements' : 'Forum'}
        intro={meta.blurb}
        art={<Holo kind={meta.slug === 'issues' ? 'knot' : 'star'} motion />}
        titleSize="compact"
        aside={
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="outline">{meta.rule}</Badge>
            <Link to="/forums" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-ink underline-offset-4 hov:text-violet-light hov:underline">
              All boards
            </Link>
          </div>
        }
      />

      {!configured && <BackendNotice />}

      {meta.slug === 'issues' && configured && <Composer onPosted={load} />}

      <section aria-label={`${meta.name} topics`} className="grid gap-2">
        {!configured ? null : loading ? (
          <Card className="flex items-center gap-3 p-6 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading topics…
          </Card>
        ) : error ? (
          <Card className="p-6">
            <FormMessage tone="error">{error}</FormMessage>
          </Card>
        ) : threads.length === 0 ? (
          <Card className="p-2">
            <EmptyState
              title={meta.slug === 'announcements' ? 'No announcements yet' : 'No issues yet'}
              body={
                meta.slug === 'announcements'
                  ? 'Release notes land here when the next version ships. The current release is on the changelog.'
                  : 'When something breaks, this is where it gets reported. Open the first topic if you are stuck.'
              }
              action={
                meta.slug === 'announcements' ? (
                  <Link to="/changelog" className="round inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors hov:border-violet hov:bg-violet hov:text-white">
                    Read the changelog
                  </Link>
                ) : configured && user ? null : (
                  <Link to="/login" state={{ from: '/forums/issues' }} className="round inline-flex h-11 items-center rounded-full bg-violet px-5 text-[15px] font-medium text-white transition-colors hov:bg-violet-deep">
                    Sign in to post
                  </Link>
                )
              }
            />
          </Card>
        ) : (
          threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} canDelete={Boolean(user && thread.author_id === user.id)} onDeleted={load} />
          ))
        )}
      </section>
    </div>
  )
}
