import { ArrowRight } from 'lucide-react'

import { ArrowLink, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, DOC_SECTIONS, DOC_TROUBLESHOOTING, SITE } from '../data'
import { useDocumentTitle } from '../lib/storage'

export function Docs() {
  useDocumentTitle('Docs')
  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Docs']}
        eyebrow={`${APP.name} ${APP.version}`}
        intro="Install the loader, activate your key, choose a game profile and save your config. Everything below applies to both FiveM and Roblox unless it says otherwise."
        art={<Holo kind="prism" motion />}
        aside={
          <div className="mt-6">
            <ButtonLink to="/support" variant="outline" iconRight={<ArrowRight className="size-4" />}>
              Ask about a step
            </ButtonLink>
          </div>
        }
      />

      <section aria-labelledby="requirements" className="grid gap-2 lg:grid-cols-[0.9fr_1.1fr]">
        <Card tone="night" className="p-6 sm:p-8">
          <Title id="requirements" lines={['Before', 'you start']} align="left" size="sm" />
          <ul className="mt-6 grid gap-3 text-[15px] text-white/85">
            {APP.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-light" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-night-muted">
            The loader runs on your PC. It never asks for a game password, and profiles are stored locally unless you enable Cloud Configs.
          </p>
        </Card>

        <div className="grid gap-2">
          {DOC_SECTIONS.slice(0, 2).map((s) => (
            <Card key={s.id} className="p-6 sm:p-7">
              <h2 className="text-xl font-medium tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-2 text-[15px] text-muted">{s.body}</p>
              <pre className="mt-4 overflow-x-auto rounded-[var(--radius-control)] bg-soft px-4 py-3 font-mono text-[13px] leading-relaxed text-ink-2">
                <code>{s.code.join('\n')}</code>
              </pre>
            </Card>
          ))}
        </div>
      </section>

      {DOC_SECTIONS.slice(2).map((s) => (
        <Card key={s.id} as="section" id={s.id} aria-labelledby={`${s.id}-title`} className="grid scroll-mt-2 gap-6 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 id={`${s.id}-title`} className="text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] font-medium tracking-[-0.035em]">
              {s.title}
            </h2>
            <p className="mt-3 max-w-md text-muted">{s.body}</p>
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-control)] bg-soft px-4 py-4 font-mono text-[13px] leading-[1.9] text-ink-2">
            <code>{s.code.join('\n')}</code>
          </pre>
        </Card>
      ))}

      <Card as="section" aria-labelledby="trouble" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="trouble" lines={['Common', 'problems']} align="left" />
          <ArrowLink to="/support" size="sm">
            Still stuck? Email us
          </ArrowLink>
        </div>
        <Accordion items={DOC_TROUBLESHOOTING} />
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        Need the loader reference offline? The same guide is available in 404 Loader under Help. Questions: {SITE.email}
      </p>
    </div>
  )
}
