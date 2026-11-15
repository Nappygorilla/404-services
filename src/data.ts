// Every string, figure and piece of seed data for the site lives here.
// 404 Services is a storefront for game-modification software. Start at SITE,
// then APP and the catalogue below it.

export const SITE = {
  name: '404 Services',
  tagline: 'Game modifications for FiveM & Roblox',
  description:
    '404 Services is a game-modification storefront for FiveM and Roblox: external menus, visuals, aim profiles, executors and scripts, delivered through one loader.',
  email: 'support@404services.gg',
  company: '404 Services',
  address: ['Remote'],
  hours: 'Every day, 09:00–23:00 CET',
  socials: [
    { label: 'GitHub repository', href: 'https://github.com/Nappygorilla/404-services' },
  ],
  disclaimer:
    '404 Services is an independent software vendor. It is not affiliated with, endorsed by, or sponsored by Rockstar Games, Take-Two Interactive, Cfx.re, Roblox Corporation or any game publisher mentioned on this site. Game modifications can breach a platform’s terms and may lead to account action. Use only on accounts you own and can afford to lose. FiveM, RedM, Grand Theft Auto and Roblox are trademarks of their respective owners.',
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
  { label: 'FiveM cheats', to: '/store?platform=fivem' },
  { label: 'Roblox cheats', to: '/store?platform=roblox' },
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
  version: '4.0.4',
  released: '4 November 2026',
  platforms: ['FiveM', 'Roblox'],
  requirements: [
    'Windows 10 or 11 (64-bit)',
    '8 GB of RAM and 250 MB free disk space',
    'The supported game installed and updated',
    'An account you own and are authorised to use',
  ],
  download: 'Download 404 Loader',
  size: '42 MB',
}

/* ------------------------------------------------------------------ home */

export const HOME = {
  eyebrow: 'Premium game modifications for FiveM & Roblox',
  headline: ['Play.', 'Your.', 'Way.'],
  intro:
    'One loader for external visuals, aim profiles, scripts and mod menus across FiveM and Roblox. Pick the cheat that fits how you play.',
  primaryCta: 'Shop all cheats',
  secondaryCta: 'See the loader',
  captionTop: 'One loader for two games',
  captionBottom: 'Secure Paddle checkout. Access in your account.',
  platformTitle: ['One loader,', 'every profile'],
  platformNote:
    'The loader is shared. Each cheat unlocks one set of features, so you can start with the profile you need and add more later.',
  pipelineTitle: ['Three steps,', 'one session'],
  pipelineNote: 'Pick a cheat, receive your key, and load your profile before you join.',
  featuresTitle: ['What it', 'actually does'],
  featuresNote: 'Built for players who want a clean overlay, readable visuals and a menu that gets out of the way.',
  changelogTitle: ['Always', 'updating'],
  pricingTitle: ['Simple', 'pricing'],
  pricingNote: 'Individual cheats, one-time prices. The complete bundle is optional. No subscription.',
  faqTitle: ['Before', 'you buy'],
  cta: {
    title: ['Play the', 'next session'],
    body: 'Pick a cheat, activate the loader, and choose your profile. Start with one profile or take the complete bundle.',
    action: 'See pricing',
  },
}

/* The dark loader band: a build log and dependency graph retained for pages that use it. */
export type GraphNode = { id: string; label: string; x: number; y: number; w: number; h: number; tone?: 'warn' }
export type GraphEdge = { d: string; tone?: 'warn'; dashed?: boolean; delay: number }

export const BUILD_BAND = {
  eyebrow: 'Loader activity',
  title: ['One loader.', 'Every profile.'],
  body: 'A quick view of the products, game profiles and cloud configs attached to your licence.',
  stats: [
    { value: '14', label: 'products' },
    { value: '2', label: 'games' },
    { value: '4', label: 'profiles' },
    { value: '1.2s', label: 'load time' },
  ],
  nodes: [
    { id: 'loader', label: 'loader', x: 8, y: 140, w: 100, h: 46 },
    { id: 'fivem', label: 'FiveM', x: 140, y: 26, w: 104, h: 42 },
    { id: 'roblox', label: 'Roblox', x: 140, y: 134, w: 104, h: 42 },
    { id: 'cloud', label: 'cloud', x: 140, y: 242, w: 104, h: 42, tone: 'warn' as const },
    { id: 'visuals', label: 'visuals', x: 300, y: 26, w: 104, h: 42 },
    { id: 'aim', label: 'aim', x: 300, y: 134, w: 104, h: 42 },
    { id: 'scripts', label: 'scripts', x: 300, y: 242, w: 104, h: 42 },
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
    ['$', '404-loader.exe --profile fivem-external'],
    ['→', 'licence verified · 2 devices · updates until 04.11.2027'],
    ['✓', 'FiveM profile loaded'],
    ['✓', 'visuals, radar and aim modules ready'],
    ['✓', 'cloud configs synced'],
    ['!', 'stream-proof overlay is off'],
    ['$', '404-loader.exe --profile roblox-executor'],
    ['→', 'waiting for Roblox to launch'],
  ] as [string, string][],
  legend: [
    { label: 'active module', tone: 'normal' as const },
    { label: 'attention needed', tone: 'warn' as const },
  ],
  recording: {
    src: '',
    poster: '',
    captions: '',
    caption: '404 Loader — profile dashboard',
    duration: '0:18',
  },
}

export const PLATFORM_TAGS = ['Windows', 'FiveM', 'Roblox', 'Email delivery']
export const TRUSTED_BY: string[] = []

export type Feature = { title: string; body: string; icon: 'graph' | 'package' | 'check' | 'rocket' | 'git' | 'terminal' }

export const FEATURES: Feature[] = [
  {
    title: 'Visuals that read fast',
    body: 'Player boxes, skeletons, distance and role labels are drawn in one clean overlay. Every element can be toggled and tuned without leaving the game.',
    icon: 'graph',
  },
  {
    title: 'Aim profiles that feel natural',
    body: 'Choose a field of view, smoothing amount and target bone, then save a separate profile for each game or server. Aim assist is optional and configurable.',
    icon: 'check',
  },
  {
    title: 'One loader, every product',
    body: 'Your FiveM and Roblox keys live in one compact desktop loader. Switch between profiles, update modules and check your licence without a browser.',
    icon: 'package',
  },
  {
    title: 'Script library',
    body: 'Load supported scripts and community configs from one menu. Profiles are stored locally and can be synced with your 404 account.',
    icon: 'terminal',
  },
  {
    title: 'Stream-proof controls',
    body: 'A quick toggle keeps the loader menu out of common capture paths. Cloud configs and keybinds stay separate from the overlay you are using.',
    icon: 'git',
  },
  {
    title: 'Updates when games move',
    body: 'Game updates are monitored and modules are versioned. Your licence includes twelve months of loader updates and release notes.',
    icon: 'rocket',
  },
]

export type Step = { step: string; title: string; body: string; command: string }

export const PIPELINE: Step[] = [
  {
    step: '01',
    title: 'Choose',
    body: 'Pick the FiveM or Roblox product that matches the features you want. Every product has a feature list and its own price.',
    command: 'open the store',
  },
  {
    step: '02',
    title: 'Activate',
    body: 'Pay on Paddle’s hosted checkout, then open Downloads with the same account to get your loader access.',
    command: 'paste key',
  },
  {
    step: '03',
    title: 'Load',
    body: 'Launch the supported game, choose your profile and toggle the modules you want before you join a session.',
    command: 'select profile',
  },
]

/* -------------------------------------------------------------- platforms */

export type Platform = {
  slug: 'fivem' | 'roblox'
  name: string
  tagline: string
  intro: string
  art: HoloKind
}

export const PLATFORMS: Platform[] = [
  {
    slug: 'fivem',
    name: 'FiveM',
    tagline: 'External menus and visuals for FiveM',
    intro:
      'External and internal profiles for FiveM: player visuals, aim assist, radar, mod menus and Lua scripts, all loaded through one desktop app.',
    art: 'knot',
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    tagline: 'Executors and visuals for Roblox',
    intro:
      'Roblox profiles for supported experiences: an executor, aim profiles, player visuals, script hub and a compact mod menu.',
    art: 'prism',
  },
]

export const PLATFORM_LABEL: Record<'fivem' | 'roblox' | 'both', string> = {
  fivem: 'FiveM',
  roblox: 'Roblox',
  both: 'Both games',
}

export const TOOL_KINDS = ['Aimbot', 'Visuals', 'Executor', 'Mod Menu', 'Utility'] as const
export type ToolKind = (typeof TOOL_KINDS)[number]
export type ProductPlatform = 'fivem' | 'roblox' | 'both'

export type ToolProduct = {
  slug: string
  name: string
  tagline: string
  description: string
  kind: ToolKind
  platform: ProductPlatform
  /** One-time price in euro cents. Every product is sold on its own. */
  price: number
  art: HoloKind
  featured?: boolean
  deliverables: string[]
  requirements: string[]
  limits: string[]
}

export type BundleProduct = {
  slug: string
  name: string
  tagline: string
  description: string
  /** One-time bundle price in euro cents. */
  price: number
  art: HoloKind
  deliverables: string[]
  requirements: string[]
  limits: string[]
  /** Populated from TOOLS so the bundle can never drift from the catalogue. */
  includes: string[]
}

export type Product = ToolProduct | BundleProduct

/*
  The catalogue. Every name, price, description, requirement and limit shown
  anywhere on the site comes from this list. Prices are one-time, in euro cents,
  and cover one person on two devices.
*/
export const TOOLS: ToolProduct[] = [
  {
    slug: 'fivem-external',
    name: 'FiveM External',
    tagline: 'External visuals, radar and aim assist for FiveM.',
    description:
      'A separate desktop overlay for FiveM with player visuals, distance labels, radar and a configurable aim assist. Profiles save per server, so you can switch between a clean setup and a full read without restarting the game.',
    kind: 'Mod Menu',
    platform: 'fivem',
    price: 1999,
    art: 'knot',
    featured: true,
    deliverables: [
      'External 404 Loader profile',
      'Player ESP, radar and distance labels',
      'Aim assist with smoothing and field-of-view controls',
      'Saved profiles for different servers',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
      'A FiveM account you own',
    ],
    limits: [
      'No software can guarantee against server-side enforcement.',
      'Does not include a FiveM account or a copy of GTA V.',
      'Use only on accounts and servers you are authorised to access.',
    ],
  },
  {
    slug: 'fivem-internal',
    name: 'FiveM Internal',
    tagline: 'The full FiveM menu, loaded inside the game.',
    description:
      'An internal profile with the full 404 menu: ESP, aim settings, vehicle controls, world options and Lua execution. Built for players who want every toggle in one overlay rather than several separate tools.',
    kind: 'Mod Menu',
    platform: 'fivem',
    price: 2999,
    art: 'star',
    featured: true,
    deliverables: [
      'Internal menu with a configurable hotkey',
      'Player and vehicle visuals',
      'Aim, movement and world options',
      'Lua execution and saved configs',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
      'A FiveM account you own',
    ],
    limits: [
      'No guarantee against server-side enforcement.',
      'Internal profiles may need a loader update after some game patches.',
      'Use only on accounts and servers you are authorised to access.',
    ],
  },
  {
    slug: 'fivem-aim',
    name: 'FiveM Aim',
    tagline: 'A focused aim profile with natural smoothing.',
    description:
      'A standalone aim profile for FiveM with target selection, smoothing, field of view and per-weapon presets. Built for players who want a lighter loader than the full mod menu.',
    kind: 'Aimbot',
    platform: 'fivem',
    price: 1499,
    art: 'scissors',
    deliverables: [
      'Per-weapon aim presets',
      'Field-of-view and smoothing controls',
      'Visible-target and line-of-sight checks',
      'One-key toggle and saved bind',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
      'A FiveM account you own',
    ],
    limits: [
      'No guarantee against server-side enforcement.',
      'Works only with the 404 Loader and a valid key.',
      'Aim assist cannot make an impossible shot succeed.',
    ],
  },
  {
    slug: 'fivem-visuals',
    name: 'FiveM Visuals',
    tagline: 'Clean player and vehicle ESP for FiveM.',
    description:
      'A visual-only profile for FiveM: player boxes, skeletons, names, roles, distance, vehicle details and a compact radar. No aim changes, no world controls, just a clearer read of the session.',
    kind: 'Visuals',
    platform: 'fivem',
    price: 1799,
    art: 'cloud',
    deliverables: [
      'Player boxes, skeletons and name labels',
      'Role and distance indicators',
      'Vehicle and plate details',
      'Radar with configurable range',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
      'A FiveM account you own',
    ],
    limits: [
      'No guarantee against server-side enforcement.',
      'Does not include aim assist or a mod menu.',
      'Use only on accounts and servers you are authorised to access.',
    ],
  },
  {
    slug: 'fivem-lua',
    name: 'FiveM Lua',
    tagline: 'Run supported Lua scripts through the loader.',
    description:
      'A Lua execution profile for FiveM with a searchable script library, per-resource toggles and saved load orders. Bring your own supported scripts or start from the included examples.',
    kind: 'Executor',
    platform: 'fivem',
    price: 1499,
    art: 'prism',
    deliverables: [
      'Searchable Lua script library',
      'Per-script toggle and keybind',
      'Load-order presets',
      'A local script editor',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
      'A FiveM account you own',
    ],
    limits: [
      'Only supported scripts load; unsupported APIs are rejected.',
      'Does not include third-party scripts or assets.',
      'No guarantee against server-side enforcement.',
    ],
  },
  {
    slug: 'fivem-script-hub',
    name: 'FiveM Script Hub',
    tagline: 'A curated stack of FiveM scripts and configs.',
    description:
      'A ready-made script pack for the 404 Lua profile: movement helpers, vehicle utilities, overlay presets and server-friendly configs. Everything is installed through the loader and can be toggled independently.',
    kind: 'Executor',
    platform: 'fivem',
    price: 2499,
    art: 'sphere',
    deliverables: [
      'Curated FiveM script collection',
      'Ready-made config presets',
      'One-click install through 404 Loader',
      'Twelve months of script updates',
    ],
    requirements: [
      'FiveM Lua profile or 404 Complete',
      'Windows 10 or 11 (64-bit)',
      'FiveM installed and updated',
    ],
    limits: [
      'Requires an active 404 Loader licence.',
      'Scripts may stop working after a game or server update.',
      'No guarantee against server-side enforcement.',
    ],
  },
  {
    slug: 'roblox-executor',
    name: 'Roblox Executor',
    tagline: 'A fast executor for supported Roblox experiences.',
    description:
      'A desktop executor for supported Roblox experiences with a searchable script hub, saved workspaces, auto-attach and a compact editor. Updates are delivered through 404 Loader.',
    kind: 'Executor',
    platform: 'roblox',
    price: 1999,
    art: 'prism',
    featured: true,
    deliverables: [
      'Roblox executor profile',
      'Searchable script hub and editor',
      'Auto-attach and saved workspaces',
      'Twelve months of loader updates',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
      'A Roblox account you own',
    ],
    limits: [
      'Works only with supported Roblox versions.',
      'Does not include Robux, assets or accounts.',
      'No guarantee against platform enforcement.',
    ],
  },
  {
    slug: 'roblox-aim',
    name: 'Roblox Aim',
    tagline: 'Aim profiles tuned for Roblox combat.',
    description:
      'A lightweight aim profile for supported Roblox experiences with target selection, smoothing, field-of-view and separate presets for close and long-range fights.',
    kind: 'Aimbot',
    platform: 'roblox',
    price: 1499,
    art: 'star',
    featured: true,
    deliverables: [
      'Close and long-range aim presets',
      'Smoothing and field-of-view controls',
      'Visible-target checks',
      'Saved keybinds',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
      'A Roblox account you own',
    ],
    limits: [
      'Works only with supported Roblox experiences.',
      'No guarantee against platform enforcement.',
      'Aim assist cannot make an impossible shot succeed.',
    ],
  },
  {
    slug: 'roblox-visuals',
    name: 'Roblox Visuals',
    tagline: 'Player, object and distance overlays.',
    description:
      'A visual-only profile for Roblox: player highlights, name and distance labels, object markers and a minimap-friendly radar. No aim changes and no script execution.',
    kind: 'Visuals',
    platform: 'roblox',
    price: 1799,
    art: 'cloud',
    deliverables: [
      'Player highlight and name labels',
      'Distance and direction indicators',
      'Object and pickup markers',
      'Configurable overlay colours',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
      'A Roblox account you own',
    ],
    limits: [
      'Works only with supported Roblox experiences.',
      'Does not include aim assist or an executor.',
      'No guarantee against platform enforcement.',
    ],
  },
  {
    slug: 'roblox-script-hub',
    name: 'Roblox Script Hub',
    tagline: 'A curated library for the Roblox executor.',
    description:
      'A ready-to-use script library for the 404 Roblox executor: UI packs, movement helpers, visual presets and utility scripts. Browse by experience, install with one click and update from the loader.',
    kind: 'Executor',
    platform: 'roblox',
    price: 2499,
    art: 'knot',
    deliverables: [
      'Curated Roblox script collection',
      'One-click installation',
      'Experience-specific presets',
      'Twelve months of script updates',
    ],
    requirements: [
      '404 Roblox Executor or 404 Complete',
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
    ],
    limits: [
      'Requires an active executor licence.',
      'Scripts may stop working after a Roblox update.',
      'No guarantee against platform enforcement.',
    ],
  },
  {
    slug: 'roblox-mod-menu',
    name: 'Roblox Mod Menu',
    tagline: 'One compact menu for supported experiences.',
    description:
      'An external menu for supported Roblox experiences with player visuals, local options and a clean hotkey-driven interface. Profiles stay separate from your executor scripts.',
    kind: 'Mod Menu',
    platform: 'roblox',
    price: 2999,
    art: 'sphere',
    deliverables: [
      'External Roblox menu',
      'Player and world visual toggles',
      'Saved profiles and hotkeys',
      'Stream-proof overlay toggle',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
      'A Roblox account you own',
    ],
    limits: [
      'Works only with supported experiences.',
      'No guarantee against platform enforcement.',
      'Does not include an executor or script library.',
    ],
  },
  {
    slug: 'roblox-external',
    name: 'Roblox External',
    tagline: 'A lightweight external overlay for Roblox.',
    description:
      'The entry-level Roblox profile: player highlights, a clean radar and simple toggles in a small external overlay. A good first product if you want to try 404 Loader without the full suite.',
    kind: 'Mod Menu',
    platform: 'roblox',
    price: 2499,
    art: 'scissors',
    deliverables: [
      'External Roblox overlay',
      'Player highlights and radar',
      'Minimal hotkey menu',
      'Saved profile per experience',
    ],
    requirements: [
      'Windows 10 or 11 (64-bit)',
      'Roblox installed and updated',
      'A Roblox account you own',
    ],
    limits: [
      'Works only with supported experiences.',
      'Does not include aim assist or scripts.',
      'No guarantee against platform enforcement.',
    ],
  },
  {
    slug: 'stream-proof',
    name: 'Stream Proof',
    tagline: 'Keep the overlay out of common captures.',
    description:
      'A loader utility that hides supported 404 overlays from common screen-capture paths. Toggle it per profile and keep your scene clean without disabling the modules you use.',
    kind: 'Utility',
    platform: 'both',
    price: 999,
    art: 'star',
    deliverables: [
      'Stream-proof overlay toggle',
      'Per-profile capture settings',
      'Works with supported 404 profiles',
      'Saved hotkey',
    ],
    requirements: [
      'An active 404 Loader licence',
      'Windows 10 or 11 (64-bit)',
      'FiveM or Roblox installed',
    ],
    limits: [
      'Capture behaviour varies by GPU, driver and capture tool.',
      'Does not guarantee invisibility on every platform.',
      'Requires a supported overlay profile.',
    ],
  },
  {
    slug: 'cloud-configs',
    name: 'Cloud Configs',
    tagline: 'Sync your profiles across two devices.',
    description:
      'Back up and sync loader profiles, keybinds, aim presets and visual themes across your two licensed devices. Cloud Configs is optional; every profile still works locally.',
    kind: 'Utility',
    platform: 'both',
    price: 799,
    art: 'cloud',
    deliverables: [
      'Cloud profile storage',
      'Two-device sync',
      'Versioned config history',
      'One-click restore',
    ],
    requirements: [
      'An active 404 Loader licence',
      'A 404 account',
      'Windows 10 or 11 (64-bit)',
    ],
    limits: [
      'Stores configuration only, never game accounts or payment details.',
      'Two active devices per licence.',
      'Requires an internet connection to sync.',
    ],
  },
]

export const BUNDLE: BundleProduct = {
  slug: 'complete-toolkit',
  name: '404 Complete',
  tagline: 'Every current cheat in one optional bundle.',
  description:
    'All current FiveM and Roblox products in one licence: menus, visuals, aim profiles, executors, scripts and loader utilities. Buy one product if that is all you need, or take 404 Complete and save against buying them separately.',
  price: 6999,
  art: 'sphere',
  deliverables: [
    'Every product currently in the catalogue',
    'One 404 Loader licence key',
    'Both FiveM and Roblox profiles',
    'Twelve months of updates',
  ],
  requirements: [
    'Windows 10 or 11 (64-bit)',
    'FiveM or Roblox installed and updated',
    'An account you own and are authorised to use',
  ],
  limits: [
    'Includes the products listed at purchase; later products are sold separately.',
    'A licence covers one person on two devices, not a team.',
    'Does not include game accounts, game copies or third-party subscriptions.',
    'No software can guarantee against platform enforcement.',
  ],
  includes: TOOLS.map((tool) => tool.slug),
}

export function isBundle(product: Product): product is BundleProduct {
  return 'includes' in product
}

export function productBySlug(slug: string): Product | undefined {
  return TOOLS.find((tool) => tool.slug === slug) ?? (BUNDLE.slug === slug ? BUNDLE : undefined)
}

export function platformBySlug(slug: string) {
  return PLATFORMS.find((platform) => platform.slug === slug)
}

/* ------------------------------------------------------------------- games */

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
  eyebrow: 'Games & modes',
  title: ['Games we', 'cover.'],
  intro:
    'Browse by the kind of session you play. Every category below is supported by a current 404 profile on FiveM or Roblox — the loader and key system are shared.',
  rule:
    'Use only on accounts you own. Game modifications can breach platform terms and may lead to account action; no product can promise otherwise.',
}

export const GENRES: Genre[] = [
  {
    slug: 'fps',
    name: 'FPS',
    line: 'Round-based shooters and gunplay',
    body: 'Aim profiles, player visuals and radar for fast rounds. Tune smoothing and field of view for the server you play, then save the preset.',
    platforms: ['fivem', 'roblox'],
    builds: ['Aim assist presets', 'Player and hitbox visuals', 'Radar and distance labels'],
    art: 'star',
  },
  {
    slug: 'roleplay',
    name: 'Roleplay',
    line: 'Jobs, economy and civilian life',
    body: 'A cleaner read of busy roleplay servers: player roles, vehicle details, distance and radar. No world edits and no server-side changes.',
    platforms: ['fivem', 'roblox'],
    builds: ['Player role visuals', 'Vehicle and plate labels', 'Radar with local range'],
    art: 'knot',
  },
  {
    slug: 'racing',
    name: 'Racing',
    line: 'Time trials, drift servers and handling',
    body: 'Vehicle visuals, distance markers and a compact radar for racing sessions. Keep the overlay light so it does not cover the road.',
    platforms: ['fivem', 'roblox'],
    builds: ['Vehicle ESP', 'Checkpoint markers', 'Minimal racing overlay'],
    art: 'prism',
  },
  {
    slug: 'survival',
    name: 'Survival',
    line: 'Looting, base building and scarcity',
    body: 'Object and pickup markers, player distance and configurable highlights for survival sessions. Every element is toggleable.',
    platforms: ['fivem', 'roblox'],
    builds: ['Pickup and crate markers', 'Player distance labels', 'Base and object highlights'],
    art: 'cloud',
  },
  {
    slug: 'horror',
    name: 'Horror',
    line: 'Co-op scares and scripted events',
    body: 'A quieter visual profile for horror sessions: player highlights and distance only, with the menu kept out of the way.',
    platforms: ['fivem', 'roblox'],
    builds: ['Player highlights', 'Proximity labels', 'Minimal overlay preset'],
    art: 'scissors',
  },
  {
    slug: 'tycoon',
    name: 'Tycoon & simulation',
    line: 'Progression economies and management loops',
    body: 'Object labels, distance markers and inventory-adjacent visuals for supported Roblox experiences. No save editing.',
    platforms: ['roblox'],
    builds: ['Object markers', 'Distance labels', 'Clean UI preset'],
    art: 'sphere',
  },
  {
    slug: 'open-world',
    name: 'Open world',
    line: 'Large maps, factions and streaming',
    body: 'Long-range player and vehicle visuals for open-world FiveM servers, with radar range and label density controls.',
    platforms: ['fivem'],
    builds: ['Long-range player visuals', 'Vehicle and plate ESP', 'Adjustable radar range'],
    art: 'knot',
  },
  {
    slug: 'party',
    name: 'Party & minigames',
    line: 'Short rounds, lobbies and matchmaking',
    body: 'Lightweight visual and aim presets for short Roblox rounds, with quick toggles and per-experience profiles.',
    platforms: ['roblox'],
    builds: ['Quick-toggle visuals', 'Aim presets', 'Per-experience profiles'],
    art: 'star',
  },
]

export const UPCOMING = {
  title: ['Not yet,', 'but next'],
  intro:
    'These games are on the 404 Services roadmap. None of them are supported today; join the waitlist and we will email you when a loader profile is ready.',
  items: [
    { name: 'Counter-Strike 2', note: 'External visuals and aim profiles.' },
    { name: 'Rust', note: 'Player and raid visuals for supported servers.' },
    { name: 'Fortnite', note: 'Researching a supported profile; not available.' },
  ],
  action: 'Request a game',
}

/* ---------------------------------------------------------------- pricing */

export const LAUNCH = {
  endsAt: '2027-01-31T23:59:59Z',
  endsLabel: '31 January 2027',
  multiplier: 0.8,
}

/** What every product or bundle licence includes. */
export const LICENCE_INCLUDES = [
  'One-time payment · twelve months of updates',
  'One person, two devices',
  'Licence access in your account',
  'Local profiles · no subscription',
]

export const PRICING_POINTS = [
  {
    title: 'Buy one profile at a time',
    body: 'Every product in the store is its own product with its own price, feature list and buy action. Start with the profile that fits your session.',
  },
  {
    title: 'The bundle is optional',
    body: '404 Complete collects every current product for less than buying them separately. It is a bundle, not a subscription and not a requirement.',
  },
  {
    title: 'One-time, not a subscription',
    body: 'You buy the licence once. The loader keeps working after the update year ends — you simply stop receiving new versions.',
  },
  {
    title: 'Updates for twelve months',
    body: 'Every release for a year, including loader updates. After that, renew at 50% of what you paid if you want another year.',
  },
]

export const PRICING_FAQ = [
  {
    q: 'Do I need the game to use a product?',
    a: 'Yes. You need your own copy of FiveM or Roblox, an account you own, and a Windows PC that meets the requirements. No game account is included with any purchase.',
  },
  {
    q: 'Can you guarantee I will not be banned?',
    a: 'No. No modification can guarantee safety from server-side or platform enforcement. Use 404 products only on accounts you own and can afford to lose, and read the limits on each product page.',
  },
  {
    q: 'How is my key delivered?',
    a: 'Checkout is handled by Paddle, our merchant of record. Sign in, pay on Paddle’s hosted page, and the order and download access appear in your 404 account after the signed webhook is processed.',
  },
  {
    q: 'What happens when my update year ends?',
    a: 'Each product keeps working at the last version you received. Renewing is optional and costs 50% of the price you originally paid; there is no automatic charge.',
  },
  {
    q: 'Can I move a licence to a new PC?',
    a: 'Yes. Deactivate the old device in 404 Loader under Account → Licence, then activate the new one. Every product licence allows two active devices for one person.',
  },
  {
    q: 'Do you offer invoices and VAT numbers?',
    a: 'Paddle collects a VAT number for business buyers where supported and issues the invoice as merchant of record. Each checkout produces its own invoice; contact support if you need help with a business purchase.',
  },
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
    version: '4.0.4',
    date: '4 November 2026',
    title: 'Loader profiles and Roblox executor update',
    body: 'The shared loader now switches faster between FiveM and Roblox profiles, and the Roblox executor has a new workspace picker.',
    tags: ['Added', 'Changed'],
    items: [
      'Added per-experience profiles to the Roblox executor.',
      'Improved FiveM external overlay performance in busy servers.',
      'Cloud Configs now keeps the last ten profile revisions.',
      'Fixed an issue where a missing game install could stall the loader.',
    ],
  },
  {
    version: '4.0.0',
    date: '14 October 2026',
    title: '404 Loader 4',
    body: 'One loader now manages every FiveM and Roblox product, with shared licence checks and a new profile dashboard.',
    tags: ['Added', 'Security'],
    items: [
      'One licence screen for every product on the account.',
      'New profile dashboard with per-game presets.',
      'Stream Proof added as an optional utility.',
      'Licence keys are stored in the operating system credential store.',
    ],
  },
  {
    version: '3.8.2',
    date: '2 September 2026',
    title: 'Visuals refresh',
    body: 'Player visuals have been rebuilt for readability, with tighter label placement and a lighter radar.',
    tags: ['Changed', 'Fixed'],
    items: [
      'New distance bands and role colours for FiveM visuals.',
      'Radar range can now be changed without reloading a profile.',
      'Fixed flickering name labels at long range.',
      'Reduced loader memory use by roughly a third.',
    ],
  },
]

/* -------------------------------------------------------------------- docs */

export const DOC_SECTIONS = [
  {
    id: 'install',
    title: 'Download the loader',
    body: 'After Paddle confirms payment, sign in and open Downloads to get the loader release attached to your licence. Install 404 Loader like any Windows application; it does not need a separate runtime or browser extension.',
    code: ['1. Sign in to 404 Services', '2. Open Account → Downloads', '3. Download 404-Loader-Setup.exe and run it'],
  },
  {
    id: 'activate',
    title: 'Activate your key',
    body: 'Paste the key from Account → Downloads into the loader once. Activation registers the device, not a game account, and a licence can be active on two devices.',
    code: ['Account  →  Licence', 'Paste key  →  Activate device', 'Devices: 1 of 2 active'],
  },
  {
    id: 'profiles',
    title: 'Choose a profile',
    body: 'Launch the supported game, choose the matching 404 profile, then toggle the modules you want. Profiles and keybinds are saved locally and can be synced with Cloud Configs.',
    code: ['FiveM  →  External profile', 'Roblox  →  Executor profile', 'Profile  →  Save as  →  Name'],
  },
  {
    id: 'updates',
    title: 'Updates and support',
    body: 'The loader checks for signed updates at launch. Release notes list every change. If a profile stops loading after a game update, check the status page before reinstalling.',
    code: ['404 Loader  →  Settings  →  Check for updates', 'Status page  →  Current loader version', 'Support  →  Include loader version and profile'],
  },
]

export const DOC_TROUBLESHOOTING = [
  { q: 'My key is not accepted', a: 'Check for leading or trailing spaces, confirm the key belongs to the product you opened, and make sure the device limit has not been reached. If it still fails, email support with the key prefix only, never the full key.' },
  { q: 'The game is not detected', a: 'Launch the game first, then open the matching profile in 404 Loader. If the game is running as administrator, run the loader with the same permission level.' },
  { q: 'The loader closes after a game update', a: 'Check the status page and release notes. Some profiles require a signed loader update after a game patch; the loader will offer it at launch when one is available.' },
  { q: 'Can I use the same key on two PCs?', a: 'Yes, for one person on two active devices. Deactivate the old device in Account → Licence before moving to a third machine.' },
]

/* ----------------------------------------------------------------- support */

export const SUPPORT = {
  title: ['Get', 'unstuck'],
  intro:
    'Support reaches a person, not a ticket queue. Include your loader version, the product or profile you are using, and the exact message you see — that is usually enough to answer in one reply.',
  responseTimes: [
    { audience: 'Before you buy', time: 'Email, within 2 working days' },
    { audience: 'Licence holders', time: 'Email, within 1 working day' },
  ],
  checklist: [
    'Your 404 Loader version from Settings → About, and your Windows version.',
    'The product or profile you opened, and whether the game was already running.',
    'The exact error message or a short clip of the loader window.',
    'What changed since the last session that worked.',
  ],
}

export const SUPPORT_FAQ = [
  { q: 'Where do I get my licence?', a: 'After Paddle confirms payment, the purchase, its download access and its licence key are attached to the account you signed in with. Open Downloads to copy the key. If it is missing, contact support with your Paddle order reference.' },
  { q: 'How many devices can I activate?', a: 'Every product and bundle licence activates on two devices for one person. Deactivate a device in 404 Loader before moving to a new one.' },
  { q: 'Do I need 404 Complete?', a: 'No. Each product is sold separately. If you only want visuals or an executor, buy that profile; 404 Complete is an optional bundle.' },
  { q: 'Is the bundle cheaper than buying every product?', a: 'Yes. The bundle is priced below the sum of the current individual products. If you already own some products, contact us before buying the bundle.' },
  { q: 'Does 404 Services use game accounts?', a: 'No. We never ask for your game password or account credentials. The loader uses a licence key and a hashed device identifier for activation.' },
  { q: 'Is there a community?', a: 'Yes. The forums carry release notes, setup questions and profile discussions. Community access is optional and not required to use a product.' },
]

/* ------------------------------------------------------------------ legal */

export type LegalSection = { heading: string; body: string[] }

export const LEGAL_UPDATED = '15 November 2026'

export const TERMS: LegalSection[] = [
  {
    heading: 'Who these terms are with',
    body: [
      `404 Services ("we", "us") sells the software and operates this site. By creating an account, buying a licence or using the software you agree to these terms. If you are buying on behalf of a company, you confirm you may bind that company.`,
      'The checkout, payment processing, tax and invoicing are handled by our merchant of record, Paddle. Paddle’s checkout terms and privacy policy apply to the transaction; these terms apply to the software, your account and your licence.',
      `Questions about these terms: ${SITE.email}.`,
    ],
  },
  {
    heading: 'Accounts, Discord and security',
    body: [
      'You need an account to buy, access downloads and use the community. Give accurate information, keep your password and devices secure, and do not share your account or licence key. You are responsible for activity under your account.',
      'You may optionally link a Discord account. If you do, you authorise us to store your Discord user ID and the profile details Discord returns, and to associate them with your 404 account for licence and support checks. You must control the Discord account you link.',
      'You must be old enough to enter a binding contract in your country. We may suspend or close an account used for fraud, key sharing, abuse, or a serious breach of these terms. Where practical, we will explain why and give you a chance to respond.',
    ],
  },
  {
    heading: 'What you are licensed to do',
    body: [
      'We grant you a non-exclusive, non-transferable licence to install and use the 404 product or bundle named on your order on up to two active devices. A seat is one person. Individual products and 404 Complete are separate products, and the bundle only includes the products listed on its product page at purchase.',
      'You may not resell, sublicense, rent or redistribute the software itself, share a key, or include it in a product you distribute.',
    ],
  },
  {
    heading: 'Purchases, delivery and refunds',
    body: [
      'Prices, currency and applicable tax are shown at checkout. Paddle is the merchant of record. A paid order is recorded only after Paddle sends a signature-verified payment confirmation; a browser redirect or checkout screen alone is not proof of payment.',
      'After payment is confirmed, the order, licence key and download access appear in the account used at checkout. Delivery is digital. The refund policy on /refunds forms part of these terms, and mandatory consumer rights are not excluded.',
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
    heading: 'Acceptable use and risk',
    body: [
      '404 Services provides game-modification software. You agree to use it only on game accounts you own and are authorised to use, and in compliance with the laws that apply to you.',
      'Game modifications can breach a game platform’s terms and may lead to suspension or a permanent ban. No product can guarantee against enforcement. You accept that risk when you use the software.',
      'Do not use the software to harass another person, steal an account, distribute malware, interfere with a service you do not control, or attempt to bypass authentication, licensing or rate limits.',
      'You are responsible for complying with the terms of the platforms you use, including Rockstar’s terms, the Cfx.re Platform License Agreement and Roblox’s Terms of Use.',
    ],
  },
  {
    heading: 'Community content',
    body: [
      'You keep ownership of what you post in the forums or send in a support ticket. You grant us a non-exclusive, worldwide licence to host, display, moderate and retain that content as needed to run the service and respond to you.',
      'Do not post illegal, harassing, infringing, malicious or confidential content. Do not post licence keys, payment details or account credentials. We may remove content or restrict access when needed to protect users or the service. Support tickets are private to you and staff; forum posts are public.',
    ],
  },
  {
    heading: 'AI, crawling and automated access',
    body: [
      'Search engines may crawl and index public pages and show links and snippets in search results. Apart from that, you may not scrape, crawl, data-mine or use the site or its content to train, fine-tune or develop an AI or machine-learning model without our written permission.',
      'We publish robots.txt directives, including Google-Extended, to opt out of Gemini training and grounding. These are signals, not technical locks; third parties may not honour them. We reserve all rights to enforce these terms and applicable law.',
    ],
  },
  {
    heading: 'Third-party services',
    body: [
      'Paddle provides checkout and merchant-of-record services. Supabase provides account, database and storage services. Discord provides optional account linking. GitHub Pages hosts the site. Their own terms and privacy policies apply to their services, and we are not responsible for their availability or independent processing.',
    ],
  },
  {
    heading: 'Ownership',
    body: [
      'We own the software, the loader, the 404 Services name and its documentation. Nothing in these terms transfers ownership of those materials to you.',
    ],
  },
  {
    heading: 'Availability and changes',
    body: [
      'We may change or remove features between loader versions. We will not remove a feature you rely on without saying so in the changelog first, and a licence bought for a version keeps working at that version.',
      'We may suspend a licence if these terms are broken — in particular the acceptable-use section. Where the breach is not serious, we will contact you first and give you a chance to fix it.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'The software is provided as is. To the extent the law allows, our total liability is limited to what you paid for the licence in the twelve months before the claim. We are not liable for lost game accounts, lost data, lost revenue or account enforcement action.',
      'Nothing here limits liability that cannot be limited by law, including for death, personal injury or fraud.',
    ],
  },
  {
    heading: 'Governing law and contact',
    body: [
      'These terms are governed by the laws of the jurisdiction in which the 404 Services operator is established. The courts of that jurisdiction have non-exclusive jurisdiction. If you are a consumer, you keep the mandatory protections of your country of residence and may bring a claim there.',
      'If a provision is unenforceable, the rest remains in effect. We may update these terms; the updated date at the top of the page shows the current version. Material changes apply from the date shown, not retrospectively.',
      `Contact: ${SITE.email}.`,
    ],
  },
]

export const REFUNDS: LegalSection[] = [
  {
    heading: 'Merchant of record',
    body: [
      'Paddle is the merchant of record for purchases on this site. It handles the payment, tax, invoice and refund transaction. Refunds go to the original payment method; the time they take to appear depends on your bank and Paddle.',
      'Paddle’s own terms and privacy policy apply to the payment itself. These terms and this policy apply to the software, your account and your licence.',
    ],
  },
  {
    heading: 'Fourteen days, generally',
    body: [
      'If 404 Services is not what you expected, ask for a refund within fourteen days of purchase and we will refund the full amount to the original payment method. You do not need a reason, though we would like to know what went wrong.',
      'Refunds usually appear within five to ten business days, depending on your bank.',
    ],
  },
  {
    heading: 'Digital cancellation rights',
    body: [
      'Consumer law may give you a fourteen-day right to cancel digital content. That right can end when supply begins only if you expressly agreed to immediate access and acknowledged that you would lose it. If the checkout did not ask for that consent, the statutory right remains.',
      'Nothing in this policy removes rights you have under mandatory consumer law. If you are unsure which rule applies, contact us before downloading.',
    ],
  },
  {
    heading: 'Faulty software',
    body: [
      'If something does not work as documented, contact support first — most loader problems are a version mismatch or a missing game update, and we can usually fix them the same day. If we cannot, you get a refund regardless of how long you have had the licence.',
    ],
  },
  {
    heading: 'Enforcement action is not a fault',
    body: [
      'A game account suspension or ban is a risk of using modification software, not a defect in the product. Refunds are not available solely because a game or server took action against an account.',
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
      'We do not use analytics, advertising pixels or data brokers. The site uses a small number of essential services: Supabase for accounts and stored data, Paddle for checkout, Discord when you choose to link an account, and GitHub Pages for hosting. We do not sell your data.',
      'The only data we hold is what you provide, what a purchase or linked account requires, and the security logs needed to run the service.',
    ],
  },
  {
    heading: 'Who is responsible for your data',
    body: [
      `${SITE.company} is the controller of the account and store data described here. For privacy requests, email ${SITE.email}.`,
      'Paddle is the merchant of record for payments and handles payment, tax and invoicing under its own privacy policy. Discord processes your Discord sign-in under its own policy when you choose to link an account.',
    ],
  },
  {
    heading: 'What we collect, and why',
    body: [
      'Account data: your email address, password hash, display name and account identifiers. Supabase stores the authentication record; we never see your plain password. If you link Discord, Supabase stores your Discord user ID and the profile details Discord returns, such as your username, display name, avatar and email if you authorise that scope.',
      'Purchase data: your name, email, country and VAT number if you give one, plus the Paddle transaction, order and invoice references. This is needed to deliver the licence, issue a receipt and meet tax obligations. Payment details go directly to Paddle — we never see a card number.',
      'Licence and device data: your licence key, its status and expiry, the products attached to it, and a hashed device identifier used to count active devices and let you deactivate one. The hash is derived from hardware and OS details and cannot be reversed into those details.',
      'Community and support data: forum posts, ticket subject and message, your author name and timestamps. Forum posts are public. Support tickets are visible to you and staff.',
      'Download and security logs: the time of a download request, the account and product involved, and standard server-log data such as IP address, user agent and requested URL. We use this for security, abuse prevention and diagnosing failures.',
    ],
  },
  {
    heading: 'Why we are allowed to use it',
    body: [
      'We rely on contract performance for the account, purchase, licence, download and support services; legal obligation for tax, accounting and fraud records; legitimate interests for security, abuse prevention and running the service; and consent where the law requires it, such as optional Discord linking. You can withdraw consent by unlinking Discord or contacting us, though some features may stop working.',
      'We do not use your account, purchase or support data to train AI models.',
    ],
  },
  {
    heading: 'Cookies and local storage',
    body: [
      'We set no tracking or advertising cookies. Supabase stores your sign-in session in browser local storage so you stay signed in. The site also stores a currency choice and, if you use certain forms, a draft, which stay on your device and can be cleared in your browser settings.',
      'Paddle may set cookies or local storage on its own checkout domain, and Discord may do the same during OAuth. Those services control their own cookies; check their policies before using checkout or linking Discord.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      'Supabase hosts authentication, the database and private release storage as our processor. Paddle is the merchant of record and handles payment, tax and invoicing; it acts under its own terms and privacy policy. Discord processes OAuth sign-in and account linking when you choose it. GitHub Pages hosts the static site and keeps standard server logs.',
      'We may disclose data if required by law, to protect the service or its users, or as part of a transfer of the business. We do not sell data or share it with advertisers. Where data is transferred internationally, we rely on appropriate safeguards offered by the relevant providers.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'Account and profile data is kept while your account is open and for up to 30 days after deletion, except where we must retain it for tax, fraud or legal reasons. Order and tax records are kept for seven to ten years, depending on the country. Licence and device records are deleted within 30 days of the licence ending, while the related order record is kept for the tax period.',
      'Support tickets are kept for two years after closure. Forum posts are kept until you delete them, ask us to delete them, or close your account, though moderation records and copies may be retained where needed for legal or safety reasons. Security logs we control are kept for up to 30 days; GitHub Pages keeps its own logs under GitHub’s policy.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You can ask for a copy of your data, ask us to correct it, ask us to erase it, or ask us to restrict or object to certain processing. Where the law provides it, you can also ask for portability and withdraw consent. Email us and we will respond within 30 days; we may need to verify your identity first.',
      'If we must keep a record for tax or legal reasons, we will tell you which record and why. If you are in the EU or UK, you also have the right to complain to your data protection authority.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'We use HTTPS, access controls, row-level security in Supabase, and server-side secrets for privileged operations. No service is completely secure; if you think an account or key has been compromised, contact us immediately and change your password.',
    ],
  },
  {
    heading: 'Search engines and AI',
    body: [
      'Public pages may be crawled and indexed by search engines so people can find the store. We do not use account or purchase data to train AI models. We publish robots.txt directives, including Google-Extended, to opt out of Gemini training and grounding, and we ask automated systems not to use the site content for model development.',
      'These signals are not technical locks. Search engines may still show links and snippets, and AI features inside search products may use indexed content under their own policies. We cannot guarantee how a third party interprets a crawl directive.',
    ],
  },
  {
    heading: 'Changes and contact',
    body: [
      'We may update this policy as the service changes. The date at the top of the page shows the current version; material changes apply from that date, not retrospectively.',
      `Privacy questions and requests: ${SITE.email} — ${SITE.company}.`,
    ],
  },
]

export const FOOTER = {
  newsletter: { title: 'Release notes', body: 'Loader updates, new profiles and fixes. No spam.' },
  legal: `© ${new Date().getFullYear()} ${SITE.company}`,
  legalLinks: [
    { label: 'Terms', to: '/terms' },
    { label: 'Refunds', to: '/refunds' },
    { label: 'Privacy', to: '/privacy' },
  ],
}
