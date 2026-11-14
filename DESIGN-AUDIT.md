# luna.win — store reference audit

What was taken from each reference store, where it lives in this codebase, and
how it was adapted so the site reads as one storefront rather than a collage.
The shop now sells **individual development tools**: each has its own price,
product page and buy action, and the Complete Toolkit is an optional bundle.
Route coverage and the open items are at the end.

## Route coverage

Every path the router exposes was walked at 1440×900 and 390×844 against a
production build (`bun run build`, served from `dist/client` with generated route
shells):

- `/`, `/store`, `/store?platform=fivem`, `/store?type=Validate`,
  `/products/manifest-forge`, `/products/complete-toolkit`, `/pricing`,
  `/games`, `/licence`, `/support?product=manifest-forge#buy`
- `/orders`, `/downloads`, `/account`, `/login`, `/register`
- `/forums`, `/forums/announcements`, `/forums/issues`
- `/terms`, `/refunds`, `/privacy`, `/changelog`, `/status`, `/docs`
- legacy `/products/fivem`, `/products/roblox`, `/platforms/fivem`,
  `/platforms/roblox` (static redirect files and client redirects)
- unknown paths fall through to the product/store not-found states

Each pass checked: page title, real content (h1 and body text), console errors,
document overflow, the number of h1s, visible buy links and their checkout
hrefs, and header auth affordances. All 24 app routes were walked at both
sizes (48 combinations), every one of the 15 product pages was checked at both
sizes (30 combinations), and all four legacy redirects were exercised at both
sizes. No route failed on a production build; there were no console errors and
no horizontal overflow.

GitHub Pages has no server-side SPA rewrites. The build writes the app shell
into a directory for every known route and product slug, so a hard load of
`/store`, `/pricing` or `/products/manifest-forge` answers 200 and boots without
a document-404. The catalogue in `src/data.ts` supplies the product slugs, and
`404.html` remains the fallback for unknown paths. The retired platform URLs
have static redirect files, so they answer with a 200 redirect page before the
app boots into the filtered store.

## The item catalogue

- **One source of truth.** `TOOLS` in `src/data.ts` holds every tool's slug,
  name, short description, platform, type, price, deliverables, requirements
  and limits. `BUNDLE.includes` is built from `TOOLS.map(...)`, so the bundle
  can never list a product that is not in the catalogue.
- **Every tool is a product.** `/store` renders one card per entry in `TOOLS`,
  with status, platform/type badges, the price and a buy action. The same cards
  appear on the home page for featured tools and in related-product rows.
- **Every tool has a page.** `/products/:slug` shows the price and buy box in
  the hero, an about panel, what is included, requirements, limits, related
  tools, back-links to the store and a link to the optional bundle. The bundle
  page lists every included tool with a link to its own page.
- **Filters and search.** Platform filters cover FiveM, Roblox and the shared
  tools; type filters cover Build, Validate, Deploy, Project and Automate.
  The search box and filters are reflected in the URL, so a filtered view can
  be linked or refreshed.
- **One optional bundle.** The Complete Toolkit is not a tier and not a
  platform licence. Its card states the saving against the current individual
  prices and has its own buy action; `/pricing` lists every individual price
  next to it.
- **One honest checkout path.** Every buy action goes to
  `/support?product=<slug>#buy`. The support page shows the selected product
  and opens a product-specific email with a payment-link request. There is no
  card form, fake basket or invented payment success state.
- **Categories are not SKUs.** `/games` remains a project-type overview. Its
  links go to filtered store views, not to separate prices.
- **No fake proof.** No ratings, order totals, member counts, live chat,
  "undetected" claims or automated downloads. Status is limited to the
  product's availability and the real service-status page.

## cosmocheats.com

**Looked at:** home, store navigation, status board, FAQ, reviews, account and
cart chrome, the first-order discount popup.

**Borrowed**
- **Product-first hero and store navigation.** The home hero pairs one dominant
  store action with documentation, and the header separates Store, Games,
  Pricing, Updates and Status (`src/components/Nav.tsx`). Docs, Licence,
  Support and Forums live in the drawer/footer (`MENU` in `src/data.ts`).
- **Product cards with state.** Cosmo's product tiles inform the item-level
  `ToolCard`: badges for platform and type, an "Available" state, a short
  description, a price and a direct buy action.
- **Public status board.** Cosmo's per-product state maps to `/status` in
  `src/pages/Status.tsx`: component rows, one release number and an acid-green
  dot only when a component is operational.
- **FAQ and account area.** The shared FAQ block is used on home, pricing,
  support and docs. Cosmo's signed-in header becomes the auth controls and the
  Supabase-backed `/account` area.

**Adapted or dropped**
- The floating 20% first-order popup was **not** rebuilt. It covered content,
  repeated the launch price and failed the no-overlap rule. The launch offer
  lives in the price notes, the pricing strip and the sticky bar.
- Review scores, order totals and balance counters were **not** copied. There
  is no data behind them; `TrustBar` states only product facts.
- Cart chrome was **not** copied. Individual products are bought directly, and
  the one optional bundle has a direct buy action, so a fake basket would add
  steps without adding value.

## hera.gg

**Looked at:** hero, stats counters, benefit grid, product cards, cart drawer,
FAQ, Trustpilot block, status references.

**Borrowed**
- **Hero hierarchy.** One dominant action, short supporting copy and a strong
  display title inform `PageHero` (`src/components/Nav.tsx`) and the home hero.
- **Benefit grid with short, parallel headings.** Reused as the six-feature
  grid on `/` (`FEATURES` in `src/data.ts`) and the buying assurances on
  `/pricing`, with the claims rewritten for development tools.
- **Product cards with a state badge.** Reused directly in the catalogue and
  related-tool rows; the status vocabulary is limited to real states.
- **FAQ accordion.** The shared interaction pattern is used across the site.

**Adapted or dropped**
- Hera's "+0 completed orders / customers / rate" counters were **not**
  copied — animating numbers with no source would be invented proof.
- The slide-out cart has no equivalent. Every tool has a direct buy action and
  the optional bundle has one too.
- Trustpilot review content was **not** reproduced; it would be fabricated
  social proof.

## lavicheats.com

**Looked at:** store/status/search navigation, sign-in entry point, the
Invision forums and review topics, online-member count, plan copy.

**Borrowed**
- **A real community area behind sign-in, with boards and member posting.**
  `/forums`, `/forums/announcements` and `/forums/issues`
  (`src/pages/Forums.tsx`), with auth at `/login` and `/register` and
  persistence rules in `supabase/schema.sql`.
- **Announcements written by the team, issues written by members.** The
  read-only announcements board and the members-only issues board are enforced
  by row-level policies.
- **Search and filters in the store.** The item catalogue has platform and type
  chips plus a search field, with the state kept in the URL. `/games` keeps its
  own category search and links into the filtered shop.
- **Status updates as a first-class page.** Became `/status` and the release
  entries on `/changelog`.

**Adapted or dropped**
- The "89 online" counter and member totals were **not** copied: there is no
  presence service, so any number would be untrue.
- Forum signatures, reputation and reaction counts were **not** reproduced.
- The navigation was reduced to five header items so the store, status and
  community fit one row without wrapping.

## battlelog.co

**Looked at:** hero, status pages, store/forums navigation, live-chat callout,
community and review sections.

*The live site answered with a Cloudflare challenge in the browser; its public
HTML was read for this audit, but no store flow was exercised.*

**Borrowed**
- **A status page linked from the hero and the header.** Battlelog splits cheat
  and spoofer status; ours is a single `/status` page reached from the header.
- **A persistent conversion bar once the hero is gone.** `StickyBar`
  (`src/components/Storefront.tsx`) shows the wordmark, release state, the
  lowest individual tool price and a "Browse tools" action after 560px.
- **Community + forum entry points beside the store.** Forums sit in the header
  drawer and the footer community column.
- **Support framed as a person, with stated hours.** `/support` uses a
  response-time table, a checklist and a real email, not a fake live-chat
  button.

**Adapted or dropped**
- The bottom-right "24/7 live chat" bubble was **not** built. There is no chat
  backend, and a decorative chat button is exactly the kind of fake affordance
  this pass removes.
- Member counts and "largest supplier" claims were **not** copied.
- The hero's dual CTA was kept in shape but not in wording: luna.win sells
  individual development tools, so the secondary action is documentation.

## How the borrowed pieces were made to fit

- **One accent, one meaning.** Violet is buying and account action; acid green
  is live status only. Status dots are small; buy buttons are violet.
- **Honesty over proof theatre.** No ratings, order totals, member counts or
  live chat. Where a backend is absent, `src/components/BackendNotice.tsx` says
  so and forms stay disabled.
- **Typography reined in.** Display caps are reserved for page titles; mono is
  reserved for numbers, versions and technical labels; body copy stays sentence
  case.
- **One spacing system.** 16px panels, 2px gutters, shared `Card`, `Badge`,
  `Title`, `Button` and `Field` components. Borrowed modules are rebuilt from
  these rather than restyled per page.
- **No duplicated information in a viewport.** The floating promo stayed gone,
  and the launch price is shown either in a card or in the sticky bar, not both
  at once.
- **Mobile collapses instead of shrinking.** The product grid goes to one
  column, header auth moves into the drawer below 1280px, and the product hero
  uses a smaller art treatment so the price and buy action stay near the fold.

## Open items

- Checkout is still the honest email/payment-link path. There is no payment
  provider, webhook, automatic order creation or licence-key issuance.
- The live Supabase round-trip (sign-up, confirmation, sign-in, posting and
  deleting a topic) is still unverified because `SUPABASE_URL` and
  `SUPABASE_ANON_KEY` are not configured. The unconfigured state is audited and
  honest; the real flow is the only remaining unverified surface.
