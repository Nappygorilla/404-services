import { Badge, Title } from '../components/Bits'
import { Card } from '../components/Card'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { APP, CHANGELOG } from '../data'
import { useDocumentTitle } from '../lib/storage'

const TONE: Record<string, 'violet' | 'success' | 'neutral' | 'outline'> = {
  Added: 'violet',
  Changed: 'neutral',
  Fixed: 'outline',
  Security: 'success',
}

export function Changelog() {
  useDocumentTitle('Changelog')
  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Change', 'log']}
        eyebrow={`Version ${APP.version} · ${APP.released}`}
        intro="Every release, what changed and why. Breaking changes are called out before they ship, not after."
        art={<Holo kind="star" motion />}
      />

      <section aria-label="Releases" className="grid gap-2">
        {CHANGELOG.map((r, i) => (
          <Card key={r.version} as="article" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.5fr_1.5fr]">
            <div>
              <p className="display text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] leading-none">v{r.version}</p>
              <p className="mt-2 text-sm text-muted">{r.date}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <Badge key={t} tone={TONE[t] ?? 'neutral'}>
                    {t}
                  </Badge>
                ))}
              </div>
              {i === 0 && <Badge tone="violet" className="mt-4">Latest</Badge>}
            </div>
            <div>
              <h2 className="text-[clamp(1.4rem,1.1rem+0.9vw,1.9rem)] leading-tight font-medium tracking-[-0.035em]">{r.title}</h2>
              <p className="mt-3 max-w-xl text-muted">{r.body}</p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {r.items.map((item) => (
                  <li key={item} className="py-3 text-[15px] text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
        <div>
          <Title lines={['Get the', 'next one']} align="left" size="sm" />
          <p className="mt-3 max-w-md text-muted">
            Releases go out roughly every six weeks, with a security fix inside 72 hours when one is needed. Everyone with an active update year gets them.
          </p>
        </div>
        <Badge tone="violet">{APP.version} is current</Badge>
      </Card>
    </div>
  )
}
