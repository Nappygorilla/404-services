import { ArrowRight, KeyRound, MonitorSmartphone, WifiOff } from 'lucide-react'

import { ArrowLink, Badge, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Accordion } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { BUNDLE, PRICING_FAQ, SITE, TOOLS } from '../data'
import { useDocumentTitle } from '../lib/storage'

const STEPS = [
  { title: 'Paste the key once', body: 'On first launch the loader asks for the licence key of the cheat or bundle you bought. Copy it from Account → Downloads; the loader checks it against the licence service and stores it in the operating system’s credential store, not in a config file.' },
  { title: 'Activate the device', body: 'Activation registers a hashed device identifier, so the loader can count seats without collecting hardware details. A hash matches or it does not; it cannot be turned back into a description of your computer.' },
  { title: 'Deactivate before you move', body: 'Under Account → Licence, deactivate a device to free the seat. Do this before wiping a disk, or you will need support to clear the old activation.' },
]

const FACTS = [
  { icon: <KeyRound className="size-5" strokeWidth={1.6} aria-hidden />, title: 'Seats are people', body: 'Every cheat and bundle licence is one person on two devices. A device counts while it is activated; deactivating frees it immediately.' },
  { icon: <WifiOff className="size-5" strokeWidth={1.6} aria-hidden />, title: 'Works offline', body: 'The licence check is cached for fourteen days, so the loader keeps working without a connection. After that it asks once to reconnect.' },
  { icon: <MonitorSmartphone className="size-5" strokeWidth={1.6} aria-hidden />, title: 'No seat monitoring', body: 'We count activations to enforce the licence. We do not read your game files, profiles or messages, and nothing is uploaded while you play.' },
]

export function Licence() {
  useDocumentTitle('Licence')
  return (
    <div className="grid gap-2 p-2">
      <PageHero
        title={['Your', 'licences']}
        eyebrow="Activation, seats and moving devices"
        intro={`Every cheat has its own licence and key. ${BUNDLE.name} is an optional bundle with one key for all current profiles. Nothing is tied to a game account, and nothing stops working when the update year ends.`}
        art={<Holo kind="cloud" motion />}
        aside={
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink to="/store" variant="violet" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Buy a cheat
            </ButtonLink>
            <ArrowLink to="/pricing" tone="ink" size="sm">
              Compare prices
            </ArrowLink>
          </div>
        }
      />

      <section aria-labelledby="activation" className="grid gap-2 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <Card key={step.title} className="flex h-full flex-col p-6 sm:p-7">
            <span className="caps text-violet tabular-nums">0{index + 1}</span>
            <h2 className="mt-3 text-xl font-medium tracking-[-0.03em]">{step.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
          </Card>
        ))}
      </section>

      <section aria-labelledby="seats" className="grid gap-2">
        <Card className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="order-2 max-w-md text-muted md:order-1">A licence covers one person. Game profiles are unlimited on the platform a cheat supports.</p>
          <Title id="seats" lines={['How seats', 'are counted']} className="order-1 md:order-2" />
        </Card>
        <ul className="grid gap-2 md:grid-cols-3">
          <li className="h-full">
            <Card className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-medium tracking-[-0.03em]">Any cheat</h3>
                <Badge tone="outline">Single product</Badge>
              </div>
              <p className="mt-4 text-3xl tracking-[-0.05em]">1 person</p>
              <p className="text-sm text-muted">2 devices</p>
              <p className="mt-6 text-[15px] text-muted">One key for one cheat. Buy only the profiles you need; each has its own key and download.</p>
            </Card>
          </li>
          <li className="h-full">
            <Card tone="violet" className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{BUNDLE.name}</h3>
                <Badge tone="light">Optional</Badge>
              </div>
              <p className="mt-4 text-3xl tracking-[-0.05em] text-white">{BUNDLE.includes.length} cheats</p>
              <p className="text-sm text-white/75">1 licence key</p>
              <p className="mt-6 text-[15px] text-white/85">All {TOOLS.length} current cheats and both games, with the same one-person, two-device terms.</p>
            </Card>
          </li>
          <li className="h-full">
            <Card className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-medium tracking-[-0.03em]">Updates</h3>
                <Badge tone="outline">Included</Badge>
              </div>
              <p className="mt-4 text-3xl tracking-[-0.05em]">12 months</p>
              <p className="text-sm text-muted">Optional renewal</p>
              <p className="mt-6 text-[15px] text-muted">The product keeps working after the update year. Renew at 50% of what you paid if you want another year of releases.</p>
            </Card>
          </li>
        </ul>
      </section>

      <section aria-labelledby="facts" className="grid gap-2 md:grid-cols-3">
        {FACTS.map((fact) => (
          <Card key={fact.title} className="flex h-full flex-col p-6">
            <span className="round grid size-11 place-items-center rounded-full border border-violet/35 bg-violet/15 text-violet-light">{fact.icon}</span>
            <h2 className="mt-5 text-lg font-medium tracking-[-0.03em]">{fact.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{fact.body}</p>
          </Card>
        ))}
      </section>

      <Card as="section" aria-labelledby="licence-faq" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <Title id="licence-faq" lines={['Licence', 'questions']} align="left" />
          <ArrowLink to="/support" size="sm">Email us about a key</ArrowLink>
        </div>
        <Accordion items={PRICING_FAQ.slice(1)} />
      </Card>

      <p className="px-2 pb-2 text-center text-[13px] text-faint">
        Lost your key? Copy it again from Account → Downloads, or email {SITE.email} from the address you bought with.
      </p>
    </div>
  )
}
