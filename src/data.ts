// Every string, figure and piece of seed data for the site lives here.
// The product is one desktop application: a build, bundle and deploy pipeline
// for FiveM and Roblox developers. Start at SITE, then APP and the sections
// below it.

export const SITE = {
  name: 'luna.win',
  tagline: 'Software tools for game creators',
  description:
    'luna.win is a desktop toolkit for FiveM and Roblox creators: inspect projects, validate dependencies, build repeatable bundles and deploy to environments you own.',
  email: 'hello@luna.win',
  company: '[COMPANY NAME]',
  address: ['[Street address]', '[Postcode, City]', '[Country]'],
  hours: 'Monday to Friday, 9:00–17:00 CET',
  socials: [
    { label: 'Discord', href: 'https://discord.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
  disclaimer:
    'luna.win is an independent product. It is not affiliated with, endorsed by, or sponsored by Rockstar Games, Take-Two Interactive, Cfx.re or Roblox Corporation. FiveM, RedM, Grand Theft Auto and Roblox are trademarks of their respective owners.',
}

/** Main navigation. The first four sit in the header; the menu shows all of them. */
export const NAV = [
  { label: 'Store', to: '/store' },
  { label: 'Games', to: '/games' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Updates', to: '/changelog' },
  { label: 'Status', to: '/status' },
]
export const MENU = [
  { label: 'Home', to: '/' },
  { label: 'Store', to: '/store' },
  { label: 'Games', to: '/games' },
  { label: 'FiveM workflow', to: '/products/fivem' },
  { label: 'Roblox workflow', to: '/products/roblox' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'Orders', to: '/orders' },
  { label: 'Updates', to: '/changelog' },
  { label: 'Status', to: '/status' },
  { label: 'Forums', to: '/forums' },
  { label: 'Docs', to: '/docs' },
  { label: 'Licence', to: '/licence' },
  { label: 'Support', to: '/support' },
]

/*
  Artwork. Every image on the site goes through this one constant. The
  `holo*` entries are the iridescent chrome renders shown by <Holo kind="…">;
  set one's `src` to '' to fall back to the SVG drawing in components/Holo.tsx.
*/
export const IMAGES = {
  nocturne: { src: '/images/nocturne.webp', alt: 'Swirling violet, magenta and teal liquid on black' },
  glass: { src: '/images/glass.webp', alt: 'Clear glass carafe and tumbler casting light on a pale grey surface' },
  aurora: { src: '/images/aurora.webp', alt: 'Soft translucent 3D forms in mint, peach and lilac on a pale background' },
  holoKnot: { src: '/images/holo/knot.webp', alt: '' },
  holoSphere: { src: '/images/holo/sphere.webp', alt: '' },
  holoCloud: { src: '/images/holo/cloud.webp', alt: '' },
  holoScissors: { src: '/images/holo/scissors.webp', alt: '' },
  holoStar: { src: '/images/holo/star.webp', alt: '' },
  holoPrism: { src: '/images/holo/prism.webp', alt: '' },
} as const satisfies Record<string, { src: string; alt: string }>
export type ImageKey = keyof typeof IMAGES
export type HoloKind = 'knot' | 'sphere' | 'cloud' | 'scissors' | 'star' | 'prism'

export const APP = {
  name: SITE.name,
  version: '1.4.2',
  released: '4 November 2026',
  platforms: ['FiveM', 'Roblox'],
  requirements: [
    'macOS 13 or later, or Windows 10 64-bit or later',
    '4 GB free disk space',
    'Git installed (optional, for versioned bundles)',
  ],
  download: 'Download for desktop',
  size: '38 MB',
}

/* ------------------------------------------------------------------ home */

export const HOME = {
  eyebrow: 'Developer tooling for FiveM & Roblox',
  headline: ['Build.', 'Bundle.', 'Deploy.'],
  intro:
    'One desktop app that takes a project from loose files to a running server: resolve dependencies, build a clean bundle, validate it, and ship it without leaving your machine.',
  primaryCta: 'Get luna.win',
  secondaryCta: 'Read the docs',
  captionTop: 'One pipeline for two platforms',
  captionBottom: 'Runs offline. No account needed to build.',
  platformTitle: ['Same app,', 'two workflows'],
  platformNote:
    'The build pipeline is shared. What changes is how a project is assembled, what gets checked, and where it lands.',
  pipelineTitle: ['Three steps,', 'one command'],
  pipelineNote: 'Every step is scriptable, and none of them touch a running game client.',
  featuresTitle: ['What it', 'actually does'],
  featuresNote: 'Built for people who ship resources to a live server on a Friday night and would rather not be woken up.',
  changelogTitle: ['Always', 'moving'],
  pricingTitle: ['Simple', 'pricing'],
  pricingNote: 'One-time licence. Twelve months of updates. No subscription to keep running.',
  faqTitle: ['Before', 'you buy'],
  cta: {
    title: ['Ship the', 'next build'],
    body: 'Pick a tier, point the app at a project, and see the dependency graph before you change anything.',
    action: 'See pricing',
  },
}

/*
  The dark product band: a dependency graph and the build log that goes with
  it. The graph is drawn from these nodes and edge paths (SVG coordinates,
  viewBox 460×330) so the picture and the log tell the same story: one
  resource uses a library it never declared.
*/
export type GraphNode = { id: string; label: string; x: number; y: number; w: number; h: number; tone?: 'warn' }
export type GraphEdge = { d: string; tone?: 'warn'; dashed?: boolean; delay: number }

export const BUILD_BAND = {
  eyebrow: 'Live build',
  title: ['Watch a build', 'resolve itself'],
  body: 'This is the report you get before anything is written to disk: what depends on what, what is missing, and what will break in production if you ignore it.',
  stats: [
    { value: '14', label: 'resources' },
    { value: '3', label: 'shared libs' },
    { value: '1', label: 'warning' },
    { value: '2.4s', label: 'build time' },
  ],
  nodes: [
    { id: 'server', label: 'server', x: 8, y: 140, w: 100, h: 46 },
    { id: 'oxlib', label: 'ox_lib', x: 140, y: 26, w: 104, h: 42 },
    { id: 'inventory', label: 'inventory', x: 140, y: 134, w: 104, h: 42 },
    { id: 'startup', label: 'startup', x: 140, y: 242, w: 104, h: 42, tone: 'warn' as const },
    { id: 'hud', label: 'hud', x: 300, y: 26, w: 104, h: 42 },
    { id: 'garage', label: 'garage', x: 300, y: 134, w: 104, h: 42 },
    { id: 'duty', label: 'duty', x: 300, y: 242, w: 104, h: 42 },
  ] satisfies GraphNode[],
  edges: [
    { d: 'M108 163 C 124 163, 124 47, 140 47', delay: 0.1 },
    { d: 'M108 163 C 124 163, 124 155, 140 155', delay: 0.18 },
    { d: 'M108 163 C 124 163, 124 263, 140 263', delay: 0.26 },
    { d: 'M244 47 L300 47', delay: 0.42 },
    { d: 'M244 155 L300 155', delay: 0.5 },
    { d: 'M244 263 L300 263', delay: 0.58 },
    { d: 'M244 263 C 286 263, 286 47, 244 47', tone: 'warn' as const, dashed: true, delay: 0.9 },
  ] satisfies GraphEdge[],
  log: [
    ['$', 'luna.win build --target fivem'],
    ['→', 'reading luna.win.toml · target fivem · 14 resources'],
    ['✓', 'resolved 14 resources, 3 shared libraries'],
    ['✓', 'fxmanifest generated for 6 resources'],
    ['✓', 'load order: ox_lib, inventory, hud, garage, duty'],
    ['!', 'startup depends on ox_lib but does not declare it'],
    ['$', 'luna.win validate --strict'],
    ['✗', '1 warning: undeclared dependency in startup'],
    ['$', 'luna.win deploy --profile production'],
    ['→', 'uploaded 2 chunks · restarted 1 server · health check passed'],
  ] as [string, string][],
  legend: [
    { label: 'declared dependency', tone: 'normal' as const },
    { label: 'missing declaration', tone: 'warn' as const },
  ],
  /*
    Screen recording slot. Drop a silent, looping clip into public/media/ and
    set `src` (plus `poster` for the first frame) to swap the dependency graph
    for real footage. Leave `src` empty and the graph renders instead, so the
    band never looks unfinished. Keep clips short and muted — this plays
    automatically, and it pauses whenever it is off-screen or the visitor taps
    pause.
  */
  recording: {
    src: '',
    poster: '',
    captions: '',
    caption: 'Building ridge-county — dependency graph',
    duration: '0:24',
  },
}

export const PLATFORM_TAGS = ['Windows', 'macOS', 'Offline builds', 'CLI + GUI']
export const TRUSTED_BY = ['Vector RP', 'Ridge County', 'Aurora RP', 'Pinebox', 'Southgate RP', 'Lumen Studio']

export type Feature = { title: string; body: string; icon: 'graph' | 'package' | 'check' | 'rocket' | 'git' | 'terminal' }

export const FEATURES: Feature[] = [
  {
    title: 'Dependency graph',
    body: 'See what each resource loads before you start the server. Missing libraries, duplicate names and version clashes surface as errors, not as a silent failure at 2am.',
    icon: 'graph',
  },
  {
    title: 'Deterministic bundles',
    body: 'The same input produces the same output, byte for byte. No stale files left behind from three builds ago, no mysterious differences between your machine and the host.',
    icon: 'package',
  },
  {
    title: 'Validation that explains itself',
    body: 'Every check names the file, the line and what to change. Strict mode turns warnings into failures so a release cannot go out with one.',
    icon: 'check',
  },
  {
    title: 'Deploy without a second tool',
    body: 'Upload to your host over SFTP or the provider API, restart only the resources that changed, and run a health check before the deploy is marked done.',
    icon: 'rocket',
  },
  {
    title: 'Version control aware',
    body: 'Bundles are stamped with a commit, and a build refuses to run on a dirty tree unless you say so. Rolling back is checking out, not rebuilding from memory.',
    icon: 'git',
  },
  {
    title: 'Scriptable everywhere',
    body: 'A real CLI underneath the interface, with a documented exit code for every failure. The app and your CI pipeline run the same commands.',
    icon: 'terminal',
  },
]

export type Step = { step: string; title: string; body: string; command: string }

export const PIPELINE: Step[] = [
  {
    step: '01',
    title: 'Build',
    body: 'Point luna.win at a project folder. It reads the manifests, resolves every dependency, and produces a build graph you can inspect before anything is written.',
    command: 'luna.win build',
  },
  {
    step: '02',
    title: 'Bundle',
    body: 'Pack the graph into a folder or archive with a stable layout. Shared libraries are deduplicated, and nothing outside the graph is copied.',
    command: 'luna.win bundle',
  },
  {
    step: '03',
    title: 'Deploy',
    body: 'Ship the bundle to a saved profile. Only changed resources restart, and the deploy fails loudly if the health check does not come back green.',
    command: 'luna.win deploy',
  },
]

/* -------------------------------------------------------------- platforms */

export type Platform = {
  slug: 'fivem' | 'roblox'
  name: string
  tagline: string
  intro: string
  art: HoloKind
  cta: string
  features: { title: string; body: string }[]
  workflow: string[]
  requirements: string[]
  limits: string[]
}

export const PLATFORMS: Platform[] = [
  {
    slug: 'fivem',
    name: 'FiveM',
    tagline: 'Resource pipeline for FiveM servers',
    intro:
      'Built around how a FiveM server is actually assembled: resources, shared libraries, load order and a manifest that has to be exactly right.',
    art: 'knot',
    cta: 'Read the FiveM guide',
    features: [
      { title: 'fxmanifest generation', body: 'Write dependencies once in your project file. luna.win generates the manifest for each resource and refuses to build one that references a file it cannot find.' },
      { title: 'Load order and dependencies', body: 'The graph is ordered the way the server will load it, with shared libraries pulled forward. Cycles are reported with the path that creates them.' },
      { title: 'Escrow-aware warnings', body: 'Escrowed files are encrypted and cannot be edited. luna.win flags any resource that expects to patch one, so the limitation appears at build time instead of at runtime.' },
      { title: 'Server-side checks', body: 'Flags client code that reads or writes what should live on the server, the most common way a resource gets exploited.' },
      { title: 'Deploy profiles', body: 'Save a host, path and restart strategy per environment, then deploy a bundle to staging or production by name.' },
    ],
    workflow: [
      'Open a project folder or clone a repository from inside the app.',
      'Build the graph and read the dependency report.',
      'Bundle to `dist/` with a commit stamp.',
      'Validate in strict mode, fix what it names.',
      'Deploy to a saved profile and watch the health check.',
    ],
    requirements: ['A FiveM server you administer', 'Resources in a folder or Git repository', 'SFTP or provider API access for deploys'],
    limits: [
      'Does not modify escrowed (encrypted) assets — it works with them, not inside them.',
      'Does not inject into the FiveM client, and never will.',
      'Does not include or redistribute any Rockstar or Cfx.re content.',
    ],
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    tagline: 'Project pipeline for Roblox experiences',
    intro:
      'The same build and bundle model, applied to a Roblox project you own: a stable place file, a versioned build, and a deploy that you can undo.',
    art: 'prism',
    cta: 'Read the Roblox guide',
    features: [
      { title: 'Project import', body: 'Bring in a place or model file you own and keep the source under version control. luna.win tracks what changed between builds.' },
      { title: 'Place build stamps', body: 'Every build records the source revision, the toolchain version and the time. Two builds from the same revision are identical.' },
      { title: 'Asset reference audit', body: 'Lists every asset ID a project references, so you can see what is shared, what is missing and what changed since the last release.' },
      { title: 'Publish to your own experience', body: 'Deploy through your own account authorisation to an experience you own. Nothing is published without an explicit confirm.' },
      { title: 'Rollback', body: 'Keep the last N builds and republish one by name, rather than rebuilding from memory while players are online.' },
    ],
    workflow: [
      'Import a place or model file you own, or connect a repository.',
      'Run the asset audit and review the reference list.',
      'Build a versioned place file.',
      'Publish to a test experience first.',
      'Promote the same build to production.',
    ],
    requirements: ['A Roblox experience you own', 'An account with publish permission', 'Place or model files you are licensed to use'],
    limits: [
      'Publishes only to experiences you own — never to another creator’s game.',
      'Does not extract, rip or convert assets out of published Roblox games.',
      'Does not modify or automate the Roblox client.',
    ],
  },
]

export function platformBySlug(slug: string) {
  return PLATFORMS.find((p) => p.slug === slug)
}

/* ------------------------------------------------------------------- games */

/*
  Categories of thing you can build, not games we sell cheats for. Every
  category below is a project type that runs on a platform we support today
  (FiveM or Roblox). Platforms we do not support are listed separately and
  honestly labelled.
*/
export type Genre = {
  slug: string
  name: string
  line: string
  body: string
  platforms: ('fivem' | 'roblox')[]
  builds: string[]
  art: HoloKind
}

export const GENRE_INTRO = {
  eyebrow: 'Categories',
  title: ['Games', 'we build for'],
  intro:
    'Browse by the kind of project you are making. Every category here runs on a platform luna.win supports today — the pipeline is the same whether you are shipping a round-based shooter or a roleplay economy.',
  rule:
    'We only build for platforms whose operators permit modification. We do not sell tools for games where the publisher prohibits it, and nothing here touches a live game client.',
}

export const GENRES: Genre[] = [
  {
    slug: 'fps',
    name: 'FPS',
    line: 'Round-based shooters and gunplay systems',
    body: 'Spawn logic, weapon balancing, round state and server-authoritative hit registration. The build has to be fast to iterate on because a balance change ships the same night.',
    platforms: ['fivem', 'roblox'],
    builds: ['Round and match state machines', 'Weapon and damage tables', 'Loadout and spawn configuration'],
    art: 'star',
  },
  {
    slug: 'roleplay',
    name: 'Roleplay',
    line: 'Jobs, economy and civilian life',
    body: 'Dozens of small resources that all have to load in the right order: jobs, inventories, housing, banking. This is where a dependency graph earns its keep.',
    platforms: ['fivem', 'roblox'],
    builds: ['Job and duty systems', 'Economy and banking resources', 'Character and property data'],
    art: 'knot',
  },
  {
    slug: 'racing',
    name: 'Racing',
    line: 'Time trials, drift servers and handling',
    body: 'Vehicle handling files, checkpoint routes and leaderboards. Bundles stay small, so a rebuild and redeploy between events takes seconds.',
    platforms: ['fivem', 'roblox'],
    builds: ['Handling and tuning files', 'Checkpoint and route data', 'Lap timing and leaderboards'],
    art: 'prism',
  },
  {
    slug: 'survival',
    name: 'Survival',
    line: 'Looting, base building and scarcity',
    body: 'Loot tables, persistence and base claims. Validation catches the resource that reads another one’s data, which is how survival servers lose their economies.',
    platforms: ['fivem', 'roblox'],
    builds: ['Loot and spawn tables', 'Base and claim persistence', 'Needs, crafting and progression'],
    art: 'cloud',
  },
  {
    slug: 'horror',
    name: 'Horror',
    line: 'Co-op scares and scripted events',
    body: 'Event scripting, proximity voice and sequenced scares. Deterministic builds mean the version you tested is the version players get.',
    platforms: ['fivem', 'roblox'],
    builds: ['Scripted event sequences', 'Proximity and voice setup', 'Lighting and ambience assets'],
    art: 'scissors',
  },
  {
    slug: 'tycoon',
    name: 'Tycoon & simulation',
    line: 'Progression economies and management loops',
    body: 'Long-running saves and progression maths. The asset audit shows what a build references before a save-breaking change goes live.',
    platforms: ['roblox'],
    builds: ['Progression and upgrade trees', 'Save data and migrations', 'UI and shop systems'],
    art: 'sphere',
  },
  {
    slug: 'open-world',
    name: 'Open world',
    line: 'Large maps, factions and streaming',
    body: 'Map resources, interiors and streaming budgets. Escrow-aware checks flag the resource that expects to patch an encrypted asset before it fails at runtime.',
    platforms: ['fivem'],
    builds: ['Map and MLO resources', 'Faction and territory systems', 'Streaming and LOD budgets'],
    art: 'knot',
  },
  {
    slug: 'party',
    name: 'Party & minigames',
    line: 'Short rounds, lobbies and matchmaking',
    body: 'Quick loops that live or die on uptime. Deploy only the resources that changed, then check the server is healthy before calling it done.',
    platforms: ['roblox'],
    builds: ['Lobby and queue systems', 'Round rotation', 'Reward and cosmetic drops'],
    art: 'star',
  },
]

export const UPCOMING = {
  title: ['Not yet,', 'but next'],
  intro:
    'We add a platform when its publisher allows it and when the pipeline genuinely fits. These are on the list; none of them are supported today.',
  items: [
    { name: 'RedM', note: 'Same Cfx toolchain as FiveM, different resource rules.' },
    { name: 'Minecraft (Java)', note: 'Plugin and datapack builds, not client mods.' },
    { name: 'Garry’s Mod', note: 'Server-side addons and workshop packaging.' },
  ],
  action: 'Ask for a platform',
}

/* ---------------------------------------------------------------- pricing */

export const LAUNCH = {
  endsAt: '2027-01-31T23:59:59Z',
  endsLabel: '31 January 2027',
  multiplier: 0.8,
}

export type Tier = {
  id: 'free' | 'solo' | 'studio'
  name: string
  price: number
  seats: string
  machines: string
  body: string
  points: string[]
  cta: string
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    seats: '1 person',
    machines: '1 machine',
    body: 'For trying it on a real project before paying anything.',
    points: ['One local project', 'Build and validate', 'Bundle without deploy', 'Community support'],
    cta: 'Start free',
  },
  {
    id: 'solo',
    name: 'Solo',
    price: 3900,
    seats: '1 person',
    machines: '2 machines',
    body: 'For the developer who runs their own server or ships for clients.',
    points: ['Unlimited projects', 'Bundles and deploy profiles', 'Strict validation and CI token', '12 months of updates', 'Email support, 2 working days'],
    cta: 'Buy Solo',
    featured: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 12900,
    seats: '5 people',
    machines: '10 machines',
    body: 'For a team maintaining more than one server or experience.',
    points: ['Everything in Solo', 'Shared build profiles', 'Team licence management', 'Priority support, 1 working day', 'Invoice billing on request'],
    cta: 'Buy Studio',
  },
]

export const PRICING_POINTS = [
  { title: 'One-time, not a subscription', body: 'You buy the licence once. The app keeps working after the update year ends — you simply stop receiving new versions.' },
  { title: 'Updates for twelve months', body: 'Every release for a year, including platform changes. After that, renew at 50% of what you paid if you want another year.' },
  { title: 'Launch price is locked in', body: 'Buy during the launch window and your renewal is calculated on that lower price, permanently.' },
  { title: 'Seats, not servers', body: 'A seat is a person. Solo runs on two machines so you can use a laptop and a desktop; moving to a new machine takes one click in the app.' },
]

export const PRICING_FAQ = [
  { q: 'What happens when my update year ends?', a: 'The app keeps working at the last version you received. Renewing is optional and costs 50% of the price you originally paid; there is no automatic charge and nothing stops working.' },
  { q: 'Can I move my licence to a new computer?', a: 'Yes. Deactivate the old machine in the app under Account → Licence, then activate the new one. Solo allows two active machines at a time.' },
  { q: 'Is there a discount for students or open-source maintainers?', a: 'Email us from the address on your project or school account. We approve these case by case.' },
  { q: 'Do you offer invoices and VAT numbers?', a: 'Yes. Checkout collects a VAT number for business buyers and the invoice is issued by the merchant of record. Studio customers can ask for invoicing by bank transfer.' },
  { q: 'Can I use one licence for several servers?', a: 'A licence covers a person, not a server. One developer running three servers needs one seat; three developers need three.' },
  { q: 'What is your refund policy?', a: 'Fourteen days, unless you asked to start using the software immediately and confirmed you understood that ends the right. The full policy is on the refunds page.' },
]

/* -------------------------------------------------------------- changelog */

export type Release = {
  version: string
  date: string
  title: string
  body: string
  tags: ('Added' | 'Changed' | 'Fixed' | 'Security')[]
  items: string[]
}

export const CHANGELOG: Release[] = [
  {
    version: '1.4.2',
    date: '4 November 2026',
    title: 'Faster graphs on large projects',
    body: 'A dependency graph with more than 200 resources now resolves in under a second, and the report opens without blocking the interface.',
    tags: ['Changed', 'Fixed'],
    items: [
      'Graph resolution moved off the UI thread; projects with 200+ resources build roughly 4× faster.',
      'Fixed a false positive when a shared library was listed by two resources at different versions.',
      'Deploy health checks now retry twice before failing, which stops flapping hosts from marking a good deploy as failed.',
      'The Roblox asset audit now shows the owning experience for each asset ID.',
    ],
  },
  {
    version: '1.4.0',
    date: '14 October 2026',
    title: 'Roblox project import',
    body: 'Roblox projects can now be imported, built and published from the same pipeline as FiveM resources.',
    tags: ['Added', 'Security'],
    items: [
      'Import place and model files you own, with revision tracking between builds.',
      'Publish to a chosen experience through your own account authorisation, with an explicit confirm step.',
      'Asset reference audit lists every ID a project uses.',
      'Licence tokens are now stored in the OS credential store rather than a config file.',
    ],
  },
  {
    version: '1.3.4',
    date: '2 September 2026',
    title: 'Strict validation and CI token',
    body: 'Strict mode turns every warning into a build failure, and a scoped token lets CI run the same checks as the app.',
    tags: ['Added', 'Changed'],
    items: [
      '`--strict` fails a build on any warning, including missing dependency declarations.',
      'Scoped CI tokens can build, bundle and validate but cannot deploy.',
      'Escrow-aware warnings now name the resource that expects to patch an encrypted file.',
      'Windows: fixed a crash when a project path contained a non-ASCII character.',
    ],
  },
]

/* -------------------------------------------------------------------- docs */

export const DOC_SECTIONS = [
  {
    id: 'install',
    title: 'Install',
    body: 'Download the build for your platform, open it, and paste your licence key when prompted. The Free tier needs no key.',
    code: ['# macOS', 'brew install --cask luna.win', '', '# Windows', 'winget install luna.win.luna.win'],
  },
  {
    id: 'first-project',
    title: 'Your first project',
    body: 'Point the app at a folder containing a `luna.win.toml`, or run `luna.win init` in an existing project to create one.',
    code: ['cd my-server', 'luna.win init --target fivem', 'luna.win build --open-report'],
  },
  {
    id: 'commands',
    title: 'Commands',
    body: 'Every command exits non-zero on failure, which is what makes it safe to run in CI.',
    code: ['luna.win build     # resolve the graph and report problems', 'luna.win bundle    # write dist/ with a commit stamp', 'luna.win validate  # run checks; --strict fails on warnings', 'luna.win deploy    # push to a saved profile', 'luna.win licence   # show seats and deactivate this machine'],
  },
  {
    id: 'config',
    title: 'Project file',
    body: 'One file describes the project: its target platform, its resources, and where a deploy should land.',
    code: ['[project]', 'name = "ridge-county"', 'target = "fivem"', '', '[deploy.production]', 'profile = "host-eu"', 'restart = "changed"'],
  },
]

export const DOC_TROUBLESHOOTING = [
  { q: 'The build says a dependency is missing but the folder exists', a: 'Check the resource name in the manifest against the folder name. FiveM resolves by name, not path, and a trailing space in the manifest is the usual cause.' },
  { q: 'Deploy fails its health check but the server is up', a: 'The check calls the endpoint in your deploy profile. If the server sits behind a proxy that rewrites paths, point the profile at the internal address instead.' },
  { q: 'Roblox publish is refused', a: 'luna.win can only publish to an experience owned by the account that authorised it. Re-authorise and confirm the experience ID in the project file.' },
  { q: 'Can I run this on a machine without a licence server connection?', a: 'Yes. Activation is cached for 14 days, so builds keep working offline; the app only needs to reach the licence service occasionally.' },
]

/* ----------------------------------------------------------------- support */

export const SUPPORT = {
  title: ['Get', 'unstuck'],
  intro:
    'Email reaches a person, not a ticket queue. Include your version, your platform and the last few lines of the build log — that is usually enough to answer in one reply.',
  responseTimes: [
    { tier: 'Free', time: 'Community Discord, best effort' },
    { tier: 'Solo', time: 'Email, within 2 working days' },
    { tier: 'Studio', time: 'Email, within 1 working day' },
  ],
  checklist: [
    'The app version from Help → About, and your OS version.',
    'The command you ran and the full output, not a screenshot of part of it.',
    'Whether the project is FiveM or Roblox, and roughly how many resources it has.',
    'Anything you changed since the last build that worked.',
  ],
}

export const SUPPORT_FAQ = [
  { q: 'Where do I get my licence key?', a: 'It is in the receipt email from the store, and on the download page after checkout. If it is lost, email us from the address you bought with and we will resend it.' },
  { q: 'How many machines can I activate?', a: 'Solo allows two active machines and Studio allows ten across five people. Deactivate a machine in the app before moving to a new one.' },
  { q: 'Do you offer migration help from another toolchain?', a: 'For Studio customers, yes — we will look at your project layout and tell you what a migration would involve. It is a conversation, not a paid service.' },
  { q: 'Is there a Discord?', a: 'Yes, for community help and release notes. It is not required to buy, download or run anything.' },
]

/* ------------------------------------------------------------------ legal */

export type LegalSection = { heading: string; body: string[] }

export const LEGAL_UPDATED = '13 November 2026'

export const TERMS: LegalSection[] = [
  {
    heading: 'Who these terms are with',
    body: [
      `luna.win is sold by ${SITE.company} ("we", "us"). By buying a licence or using the software you agree to these terms. If you are buying on behalf of a company, you confirm you may bind that company.`,
      'The checkout, payment processing, tax and invoicing are handled by our merchant of record. Their terms apply to the transaction itself; these terms apply to the software and to your licence.',
    ],
  },
  {
    heading: 'What you are licensed to do',
    body: [
      'We grant you a non-exclusive, non-transferable licence to install and use luna.win for as many personal or commercial projects as your tier allows. A seat is one person. Solo includes two active machines for that person; Studio includes five people and ten machines.',
      'You may use the software to build and deploy projects for clients. You may not resell, sublicense, rent or redistribute the software itself, or include it in a product you distribute.',
    ],
  },
  {
    heading: 'Updates and support',
    body: [
      'A licence includes twelve months of updates from the date of purchase. When that period ends the software continues to work at the last version you received. Renewal is optional and costs 50% of the price you originally paid.',
      'Support response times are listed on the support page and are targets, not guarantees.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'luna.win is a development tool. You agree not to use it to cheat, to gain an unfair advantage in another operator’s game, to bypass anti-cheat systems, or to interfere with a game client you do not own. This is a condition of the licence, not a preference.',
      'You also agree not to use the software to infringe intellectual property: no extracting or redistributing assets you do not have the rights to, no publishing to an experience or server you do not administer.',
      'You are responsible for complying with the terms of the platforms you build for, including Rockstar’s terms and the Cfx.re Platform License Agreement, and Roblox’s Terms of Use.',
    ],
  },
  {
    heading: 'Ownership',
    body: [
      'You own your projects, your code and everything you build with luna.win. We own the software and its documentation. Nothing in these terms transfers ownership of either.',
    ],
  },
  {
    heading: 'Availability and changes',
    body: [
      'We may change or remove features between major versions. We will not remove a feature you rely on without saying so in the changelog first, and a licence bought for a version keeps working at that version.',
      'We may suspend a licence if these terms are broken — in particular the acceptable use section. Where the breach is not serious, we will contact you first and give you a chance to fix it.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'The software is provided as is. To the extent the law allows, our total liability is limited to what you paid for the licence in the twelve months before the claim. We are not liable for lost data, lost revenue or a server going down — keep backups and test on staging.',
      'Nothing here limits liability that cannot be limited by law, including for death, personal injury or fraud.',
    ],
  },
  {
    heading: 'Law',
    body: [
      'These terms are governed by the laws of [JURISDICTION], and disputes go to the courts of [JURISDICTION]. If you are a consumer, you keep the protections of the law in your country of residence.',
    ],
  },
]

export const REFUNDS: LegalSection[] = [
  {
    heading: 'Fourteen days, generally',
    body: [
      'If luna.win is not what you expected, ask for a refund within fourteen days of purchase and we will refund the full amount to the original payment method. You do not need a reason, though we would like to know what went wrong.',
      'Refunds are processed by our merchant of record and usually appear within five to ten business days, depending on your bank.',
    ],
  },
  {
    heading: 'When the fourteen days do not apply',
    body: [
      'Software delivered digitally can lose the change-of-mind right once supply has begun, but only if you agreed to immediate delivery and confirmed you understood you were giving up that right. The checkout asks for that confirmation explicitly; it is never pre-ticked.',
      'If you gave that confirmation, you can still get a refund when the software is faulty, not as described, or when a licence key does not work and we cannot fix it. Your statutory rights are unaffected.',
    ],
  },
  {
    heading: 'Faulty software',
    body: [
      'If something does not work as documented, contact support first — most problems are a dependency or a path, and we can usually fix them the same day. If we cannot, you get a refund regardless of how long you have had the licence.',
    ],
  },
  {
    heading: 'Renewals',
    body: [
      'Renewals are optional and never charged automatically. If you renew and change your mind within fourteen days without activating a new version, we will refund the renewal.',
    ],
  },
  {
    heading: 'How to ask',
    body: [`Email ${SITE.email} from the address you bought with, with your receipt number if you have it. That is all we need.`],
  },
]

export const PRIVACY: LegalSection[] = [
  {
    heading: 'The short version',
    body: [
      'This website makes no requests to third parties. There is no analytics, no advertising pixel and no third-party font or script. The only data we hold is what you send us or what a purchase requires.',
    ],
  },
  {
    heading: 'What we collect, and why',
    body: [
      'When you buy: your name, email, country and VAT number if you give one, plus the transaction record. This is needed to deliver the licence, issue a receipt and meet tax obligations. Payment details go directly to the merchant of record — we never see a card number.',
      'When you email support: your address and whatever you include in the message, kept so we can answer and refer back to it.',
      'When the app runs: a licence check sends your licence key and a hashed machine identifier. The hash is derived from hardware and OS details, cannot be reversed into those details, and is used only to count active machines and let you deactivate one.',
      'Our host keeps standard server logs, including IP addresses, for security and abuse prevention. These rotate automatically.',
    ],
  },
  {
    heading: 'What we do not do',
    body: [
      'We do not sell data, share it with advertisers, or use it to build a profile of you. We do not read your projects: builds and bundles run locally, and no project content is uploaded by the app.',
    ],
  },
  {
    heading: 'Cookies and local storage',
    body: [
      'We set no tracking cookies. The site stores a few preferences in your browser — a currency choice and, if you use the forms, a draft — which never leave your device and can be cleared from your browser settings.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'Support email is kept for two years. Transaction records are kept for as long as tax law requires, which is usually seven to ten years depending on the country; the merchant of record holds the payment record. Licence and machine records are deleted within 30 days of a licence ending.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You can ask for a copy of your data, ask us to correct it, or ask us to erase it. Email us and we will confirm within 30 days. If we hold data you asked us to delete but are required to keep it for tax purposes, we will tell you which records and why.',
      'If you are in the EU or UK you also have the right to complain to your data protection authority.',
    ],
  },
  {
    heading: 'Who processes data for us',
    body: [
      'Our hosting provider serves this site and stores server logs. Our merchant of record handles checkout, payment, tax and invoicing. Both act on our instructions and are bound by their own data processing terms. We will name them explicitly in the checkout flow so you know who you are dealing with before you pay.',
    ],
  },
  {
    heading: 'Contact',
    body: [`${SITE.email} — ${SITE.company}, ${SITE.address.join(', ')}.`],
  },
]

export const FOOTER = {
  newsletter: { title: 'Release notes', body: 'One email a month: what shipped, what broke, what is next. Nothing else.' },
  legal: `© ${new Date().getFullYear()} ${SITE.company}`,
  legalLinks: [
    { label: 'Terms', to: '/terms' },
    { label: 'Refunds', to: '/refunds' },
    { label: 'Privacy', to: '/privacy' },
  ],
}
