import { Pause, Play, RotateCcw } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { BUILD_BAND, type GraphEdge, type GraphNode } from '../data'
import { cx } from '../lib/cx'

const MARK_TONE: Record<string, string> = {
  '✓': 'text-[#8bf0b6]',
  '✗': 'text-[#ff9a9f]',
  '!': 'text-[#ffd479]',
  '→': 'text-violet-light',
  $: 'text-white/45',
}

const NORMAL_STROKE = 'rgba(255,255,255,0.30)'
const WARN_STROKE = '#ffd479'

/** The dependency graph: nodes and edges drawn as the report describes them. */
function Graph({ replay, reduce }: { replay: number; reduce: boolean }) {
  const nodes: GraphNode[] = BUILD_BAND.nodes
  const edges: GraphEdge[] = BUILD_BAND.edges
  return (
    <div className="round rounded-[var(--radius-card-sm)] border border-white/12 bg-black/30 p-2 sm:p-3">
      <svg
        viewBox="0 0 460 330"
        className="mx-auto w-full max-w-[440px]"
        role="img"
        aria-label="Dependency graph. The server loads ox_lib, inventory and startup; startup uses ox_lib without declaring it."
      >
        <defs>
          <marker id="bb-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="rgba(255,255,255,0.35)" />
          </marker>
          <marker id="bb-arrow-warn" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#ffd479" />
          </marker>
        </defs>

        {edges.map((edge, i) => {
          const warn = edge.tone === 'warn'
          return (
            <motion.path
              key={`${replay}-${i}`}
              d={edge.d}
              fill="none"
              stroke={warn ? WARN_STROKE : NORMAL_STROKE}
              strokeWidth={warn ? 1.8 : 1.4}
              strokeDasharray={edge.dashed ? '5 5' : undefined}
              markerEnd={warn ? 'url(#bb-arrow-warn)' : 'url(#bb-arrow)'}
              initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : edge.delay, ease: 'easeOut' }}
            />
          )
        })}

        {nodes.map((n, i) => {
          const warn = n.tone === 'warn'
          return (
            <motion.g
              key={`${replay}-${n.id}`}
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={10}
                fill={warn ? 'rgba(255,212,121,0.10)' : 'rgba(255,255,255,0.06)'}
                stroke={warn ? 'rgba(255,212,121,0.55)' : 'rgba(255,255,255,0.22)'}
                strokeWidth={1}
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + 4}
                textAnchor="middle"
                fill={warn ? '#ffd479' : 'rgba(255,255,255,0.88)'}
                style={{ font: '500 11.5px ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.01em' }}
              >
                {n.label}
              </text>
            </motion.g>
          )
        })}
      </svg>

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 px-2 pb-1">
        {BUILD_BAND.legend.map((l) => (
          <li key={l.label} className="flex items-center gap-2 text-[12px] text-night-muted">
            <span
              aria-hidden
              className="inline-block h-0.5 w-5 rounded-full"
              style={l.tone === 'warn' ? { backgroundImage: 'repeating-linear-gradient(90deg,#ffd479 0 4px,transparent 4px 7px)' } : { background: 'rgba(255,255,255,0.35)' }}
            />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The build log, revealed one line at a time and looping while it is on screen. */
function BuildLog({ replay, reduce }: { replay: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' })
  const total = BUILD_BAND.log.length
  const [count, setCount] = useState(reduce ? total : 0)

  useEffect(() => {
    if (reduce) {
      setCount(total)
      return
    }
    if (!inView) return
    let cancelled = false
    let timer = 0
    let i = 0
    setCount(0)
    const tick = () => {
      if (cancelled) return
      i += 1
      setCount(i)
      if (i < total) {
        timer = window.setTimeout(tick, 470)
      } else {
        timer = window.setTimeout(() => {
          if (cancelled) return
          i = 0
          setCount(0)
          timer = window.setTimeout(tick, 470)
        }, 4200)
      }
    }
    timer = window.setTimeout(tick, 420)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [inView, reduce, total, replay])

  return (
    <div ref={ref} className="round overflow-hidden rounded-[var(--radius-card-sm)] border border-white/12 bg-black/45">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
        </span>
        <span className="ml-1 font-mono text-[11.5px] text-white/45">modsmith · ridge-county · build.log</span>
      </div>

      <div aria-hidden className="min-h-[15.5rem] px-4 py-3 font-mono text-[12.5px] leading-[1.85] sm:text-[13px]">
        {BUILD_BAND.log.slice(0, count).map(([mark, text], i) => (
          <p key={`${replay}-${i}`} className="flex gap-3 whitespace-pre-wrap">
            <span className={cx('w-2 shrink-0', MARK_TONE[mark] ?? 'text-white/45')}>{mark}</span>
            <span className="text-white/90">{text}</span>
          </p>
        ))}
        {count < total && <span className="inline-block h-3.5 w-2 animate-pulse bg-white/60 align-middle" />}
      </div>

      <ul className="sr-only">
        {BUILD_BAND.log.map(([mark, text], i) => (
          <li key={i}>
            {mark} {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
  The recording slot. Rendered only when BUILD_BAND.recording.src is set, so
  dropping a clip into public/media/ and naming it here replaces the graph with
  real footage. Muted, looping, paused off-screen, with an explicit pause
  control because it moves on its own.
*/
function Recording({ reduce }: { reduce: boolean }) {
  const r = BUILD_BAND.recording
  const video = useRef<HTMLVideoElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap, { margin: '0px 0px -20% 0px' })
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (reduce || !inView || paused) el.pause()
    else void el.play().catch(() => setPaused(true))
  }, [inView, paused, reduce])

  return (
    <div ref={wrap} className="round overflow-hidden rounded-[var(--radius-card-sm)] border border-white/12 bg-black/45">
      <video
        ref={video}
        className="aspect-video w-full object-cover"
        src={r.src}
        poster={r.poster || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={r.caption}
      >
        {r.captions ? <track kind="captions" src={r.captions} default /> : null}
      </video>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2">
        <span className="truncate font-mono text-[11.5px] text-white/45">{r.caption}</span>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[11.5px] text-white/35">{r.duration}</span>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play the recording' : 'Pause the recording'}
              className="round grid size-7 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hov:border-white hov:bg-white hov:text-[#08080c]"
            >
              {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function BuildBand() {
  const reduce = useReducedMotion() ?? false
  const [replay, setReplay] = useState(0)

  return (
    <section
      aria-labelledby="build-band-title"
      className="relative overflow-hidden rounded-[var(--radius-card)] bg-night text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 size-[38rem] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(91,20,245,0.38) 0%, rgba(91,20,245,0) 68%)' }}
      />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10">
        <div>
          <p className="caps flex items-center gap-2 text-violet-light">
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-violet-light" />
            {BUILD_BAND.eyebrow}
          </p>
          <h2 id="build-band-title" className="display mt-4 text-[clamp(2.4rem,1.6rem+3vw,4.6rem)]">
            {BUILD_BAND.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-night-muted">{BUILD_BAND.body}</p>

          <dl className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-white/12 pt-5 sm:grid-cols-4">
            {BUILD_BAND.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[11px] tracking-wide text-night-muted uppercase">{s.label}</dt>
                <dd className="mt-1 text-xl tracking-[-0.04em] tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          {!reduce && (
            <button
              type="button"
              onClick={() => setReplay((n) => n + 1)}
              className="round mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-[13px] font-medium text-white/85 transition-colors hov:border-white hov:bg-white hov:text-[#08080c]"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Replay the build
            </button>
          )}
        </div>

        <div className="grid gap-2">
          {BUILD_BAND.recording.src ? <Recording reduce={reduce} /> : <Graph replay={replay} reduce={reduce} />}
          <BuildLog replay={replay} reduce={reduce} />
        </div>
      </div>
    </section>
  )
}
