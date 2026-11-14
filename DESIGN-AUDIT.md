# luna.win — store reference audit

What was taken from each reference store, where it lives in this codebase, and
how it was adapted so the site reads as one product rather than a collage.
Route coverage and the open item are at the end.

## Route coverage

Every path the router exposes was walked at 1440×900 and 390×844 against a
production build (`bun run build`, served from `dist/client` with SPA fallback):

- `/`, `/games`, `/platforms/fivem`, `/platforms/roblox`, `/pricing`,
  `/changelog`, `/status`, `/docs`, `/licence`, `/support`
- `/login`, `/register`, `/account`
- `/forums`, `/forums/announcements`, `/forums/issues`
- `/terms`, `/refunds`, `/privacy`
- the unknown-path fallback plus `/forums/nope` and `/platforms/nope`

Each pass checked: page title, real content (h1 and body text), console errors,
failed requests, document overflow, heading clipping, header auth affordances
and footer links. All 44 route/size combinations pass. There is no separate
topic route: threads render in full on the board (see "Lavicheats" below).

## cosmocheats.com

**Looked at:** home, store navigation, status board, FAQ, reviews, account and
cart chrome, the first-order discount popup.

**Borrowed**
- **Dual hero CTA with a secondary community link.** Cosmo pairs
  "Browse the store" with "Join our discord". Ours is
  "Get luna.win" / "Read the docs" in `src/pages/Home.tsx`.
- **Store navigation that separates Store, Status and Support.** Became the
  five-item header in `src/components/Nav.tsx` (Games, Pricing, Changelog,
  Status, Forums) with Docs, Licence and Support in the drawer/footer
  (`MENU` in `src/data.ts`).
- **Public status board.** Cosmo's per-product "undetected" state maps to
  `/status` in `src/pages/Status.tsx`: component rows, one release number and
  an acid-green dot only when a component is operational.
- **Why-us grid and FAQ.** Adapted in `HOME.features` / `HOME.faq` and rendered
  in `src/pages/Home.tsx`; the same FAQ pattern is reused on pricing and support.
- **Account area.** Cosmo's signed-in header becomes the auth controls in the
  header and drawer, `/account` in `src/pages/Account.tsx`, and the
  Supabase session in `src/components/Auth.tsx`.

**Adapted or dropped**
- The floating 20% first-order popup was borrowed as `LaunchPill` in an earlier
  pass and **dropped in this audit**: at 1440 it sat over pricing features,
  changelog items and docs code, and it repeated the launch price already shown
  by the sticky bar and countdown. A fixed promo that covers content fails the
  "no overlap, no duplicated information" rule, so the launch offer now lives
  only in the marquee, the countdown and the sticky bar.
- Review scores, "520,000+ orders" and balance/credit counters were **not**
  copied. There is no real order data behind them; the trust strip instead
  states product facts (`TrustBar` in `src/components/Storefront.tsx`).
- The cart/checkout chrome was **not** copied. luna.win sells one desktop
  licence with tiers, so `/pricing` is a decision page, not a basket.

## hera.gg

**Looked at:** hero, stats counters, benefit grid, product cards, cart drawer,
FAQ, Trustpilot block, status references.

**Borrowed**
- **Hero with one dominant action and a Discord/community secondary.** The
  composition and the ratio of display type to supporting copy inform
  `PageHero` (`src/components/Nav.tsx`) and the home hero.
- **Benefit grid with short, parallel headings.** Reused as the six-feature
  grid on `/` (`FEATURES` in `src/data.ts`) and the buying assurances on
  `/pricing` (`src/pages/Pricing.tsx`), with the claims rewritten for a build
  tool rather than a cheat loader.
- **FAQ accordion.** Same interaction pattern in the shared FAQ block used by
  home, pricing, support and docs.
- **Product cards with a state badge.** Became category cards on `/games`
  (`src/pages/Games.tsx`) with platform and state badges; the status vocabulary
  is limited to real product states.

**Adapted or dropped**
- Hera's "+0 completed orders / customers / rate" counters were **not**
  copied — animating numbers with no source would be invented proof.
- The slide-out cart has no equivalent: there is nothing to bundle into a
  basket. Pricing tiers act directly.
- Trustpilot review content was **not** reproduced; it would be fabricated
  social proof.

## lavicheats.com

**Looked at:** store/status/search navigation, sign-in entry point, the
Invision forums and review topics, online-member count, plan copy.

**Borrowed**
- **A real community area behind sign-in, with boards and member posting.**
  This is the clearest structural borrow: `/forums`, `/forums/announcements`
  and `/forums/issues` (`src/pages/Forums.tsx`), with auth at `/login` and
  `/register` (`src/pages/Auth.tsx`) and persistence rules in
  `supabase/schema.sql`, accessed through `src/lib/forum.ts`.
- **Announcements written by the team, issues written by members.** Lavi
  separates staff updates from customer review topics; ours separates a
  read-only announcements board from a members-only issues board. The row-level
  policies enforce both.
- **Search in the store.** Became the category search on `/games`
  (`src/pages/Games.tsx`), filter chips included.
- **Status updates as a first-class page.** Became `/status` and the release
  entries on `/changelog`.

**Adapted or dropped**
- The "89 online" counter and member totals were **not** copied: there is no
  presence service, so any number would be untrue.
- Forum signatures, reputation and reaction counts were **not** reproduced.
  A topic is a title, an author, a date and the body; that is all the data the
  schema actually holds.
- The full Invision navigation was reduced to five header items so the store,
  status and community fit one row without wrapping.

## battlelog.co

**Looked at:** hero, status pages, store/forums navigation, live-chat callout,
community and review sections.

*The live site answered with a Cloudflare challenge in the browser; its public
HTML was read for this audit, but no store flow was exercised.*

**Borrowed**
- **A status page linked from the hero and the header.** Battlelog splits cheat
  and spoofer status; ours is a single `/status` page reached from the header.
- **A persistent conversion bar once the hero is gone.** This is the pattern
  behind `StickyBar` (`src/components/Storefront.tsx`): wordmark, build state,
  starting price and one buying action after 560px of scroll.
- **Community + forum entry points beside the store.** Became Forums in the
  header and drawer, plus the footer community column.
- **Support framed as a person, with stated hours.** Became `/support` with a
  response-time table and a checklist, instead of a live-chat button that would
  open nothing.

**Adapted or dropped**
- The bottom-right "24/7 live chat" bubble was **not** built. There is no chat
  backend, and a decorative chat button is exactly the kind of fake affordance
  this pass removes.
- Member counts and "largest supplier" claims were **not** copied.
- The hero's dual CTA was kept in shape but not in wording: luna.win sells a
  build pipeline, so the secondary action is documentation, not a status check.

## How the borrowed pieces were made to fit

- **One accent, one meaning.** Violet is buying and account action; acid green
  is live status only. The source stores use green for "undetected" marketing;
  here green never decorates, it reports a state. This is why status dots are
  small and the pricing CTAs are violet.
- **Honesty over proof theatre.** No ratings, order totals, member counts or
  live chat. Where a backend is absent, `src/components/BackendNotice.tsx` says
  so and forms stay disabled.
- **Typography reined in.** Display caps are reserved for page titles; mono is
  reserved for numbers, versions and technical labels (`caps` and font tokens
  in `src/styles.css`); body copy stays sentence case. The result keeps the
  reference stores' technical flavour without the all-caps wall.
- **One spacing system.** 16px panels, 2px gutters, shared `Card`, `Badge`,
  `Title`, `Button` and `Field` components. Every borrowed module was rebuilt
  from these rather than restyled per page.
- **No duplicated information in a viewport.** This rule removed the floating
  promo and keeps the launch price in one place at a time.
- **Mobile collapses instead of shrinking.** Dense store grids become single
  columns; header auth moves into the drawer below 1280px; the hero becomes a
  title, artwork and intro stack. Nothing borrows a desktop-only layout.

## Open item

The live Supabase round-trip (sign-up, confirmation, sign-in, posting and
deleting a topic) is still unverified because `SUPABASE_URL` and
`SUPABASE_ANON_KEY` are not configured. The unconfigured state is audited and
honest; the real flow is the only remaining unverified surface.
