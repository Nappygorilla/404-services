import { ArrowRight, KeyRound, MonitorSmartphone, WifiOff } from 'lucide-react'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { PRICING_FAQ, SITE, TIERS } from '../data'
import { useDocumentTitle } from '../lib/storage'

const STEPS = [
  { title: 'Paste the key once', body: 'On first launch the app asks for your licence key. It is in your receipt email; the app checks it against the licence service and stores it in the operating system’s credential store, not in a config file.' },
  { title: 'Activate the machine', body: 'Activation registers a hashed machine identifier, so the app can count seats without collecting hardware details. A hash matches or it does not; it cannot be turned back into a description of your computer.' },
  { title: 'Deactivate before you move', body: 'Under Account → Licence, deactivate a machine to free the seat. Do this before wiping a disk, or you will need support to clear the old activation.' },
]

const FACTS = [
  { icon: <KeyRound className="size-5" strokeWidth={1.6} aria-hidden />, title: 'Seats are people', body: 'Solo is one person on two machines, Studio is five people on ten machines. A machine counts while it is activated; deactivating frees it immediately.' },
  { icon: <WifiOff className="size-5" strokeWidth={1.6} aria-hidden />, title: 'Works offline', body: 'The licence check is cached for fourteen days, so a build on a plane or in a locked-down network keeps working. After that the app asks once for a connection.' },
  { icon: <MonitorSmartphone className="size-5" strokeWidth={1.6} aria-hidden />, title: 'No seat monitoring', body: 'We count activations to enforce the licence. We do not read your projects, your file names or your build output, and nothing is uploaded when you build.' },
]

export function Licence() {
  useDocumentTitle('Licence')
  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Your', 'licence']}
        eyebrow="Activation, seats and moving machines"
        intro="A licence is a key you paste once. Nothing about it is tied to a server, and nothing stops working when the update year ends."
        art={<Holo kind="cloud" motion />}
        aside={
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink to="/support#buy" variant="violet" iconRight={<ArrowRight className="size-4" />}>
              Get a licence
            </ButtonLink>
            <ArrowLink to="/pricing" tone="ink" size="sm">
              Compare tiers
            </ArrowLink>
          </div>
        }
      />

      <section aria-labelledby="activation" className="grid gap-2 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Card key={s.title} className="flex h-full flex-col p-6 sm:p-7">
            <span className="caps text-violet tabular-nums">0{i + 1}</span>
            <h2 className="mt-3 text-xl font-medium tracking-[-0.03em]">{s.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
          </Card>
        ))}
      </section>

      <section aria-labelledby="seats" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">One licence covers one person. Servers and experiences are unlimited on every paid tier.</p>
          <Title id="seats" lines={['How seats', 'are counted']} className="order-1 md:order-2" />
        </Card>
        <ul className="grid gap-2 md:grid-cols-3">
          {TIERS.map((t) => (
            <li key={t.id} className="h-full">
              <Card tone={t.featured ? 'violet' : 'white'} className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className={t.featured ? 'text-xl font-medium uppercase tracking-[-0.03em] text-white' : 'text-xl font-medium uppercase tracking-[-0.03em]'}>{t.name}</h3>
                  {t.featured && <Badge tone="light">Popular</Badge>}
                </div>
                <p className={t.featured ? 'mt-4 text-3xl tracking-[-0.05em] text-white' : 'mt-4 text-3xl tracking-[-0.05em]'}>
                  {t.seats}
                </p>
                <p className={t.featured ? 'text-sm text-white/75' : 'text-sm text-muted'}>{t.machines}</p>
                <p className={t.featured ? 'mt-6 text-[15px] text-white/85' : 'mt-6 text-[15px] text-muted'}>{t.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="facts" className="grid gap-2 md:grid-cols-3">
        {FACTS.map((f) => (
          <Card key={f.title} className="flex h-full flex-col p-6">
            <span className="round grid size-11 place-items-center rounded-full bg-violet-soft text-violet-deep">{f.icon}</span>
            <h2 className="mt-5 text-lg font-medium tracking-[-0.03em]">{f.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
          </Card>
        ))}
      </section>

      <Card as="section" aria-labelledby="licence-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="licence-faq" lines={['Licence', 'questions']} align="left" />
          <ArrowLink to="/support" size="sm">
            Email us about a key
          </ArrowLink>
        </div>
        <Accordion items={PRICING_FAQ.slice(1)} />
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        Lost your key? Email {SITE.email} from the address you bought with and we will resend it.
      </p>
    </div>
  )
}
