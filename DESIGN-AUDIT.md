# 404services.gg — store design notes

What the current storefront does, where it lives, and what was verified. The shop
sells **individual game-modification profiles** for FiveM and Roblox. Each has
its own price, product page and buy action; 404 Complete is an optional bundle.

## Visual direction

- A near-black canvas with a full-bleed violet/teal hero image and a soft
  gradient wash. The home, store and product headers share the same language.
- Outfit for display type and Inter Tight for body copy, with the 404 gradient
  mark used in the header, footer and favicon.
- Image-led product cards use the iridescent Holo renders rather than stock
  screenshots. Product pages pair a large render with a compact buy box.
- Four-column store grid at desktop, two columns on tablet and one on mobile.
  Filters, search, price and buy actions stay visible without a card modal.
- The interface preview on the home hero is explicitly labelled
  `INTERFACE PREVIEW · SAMPLE DATA`. It is a product illustration, not a
  fabricated customer screenshot.

## Catalogue and routes

- **One source of truth.** `TOOLS` in `src/data.ts` holds every cheat's slug,
  name, short description, platform, type, price, deliverables, requirements
  and limits. `BUNDLE.includes` is derived from that list, so 404 Complete can
  never drift from the individual catalogue.
- **Every cheat has a page.** `/store` renders one card per entry in `TOOLS`.
  `/products/:slug` shows the hero, price and buy box, inclusions, requirements,
  limits, related profiles and a back-link to the filtered store.
- **The bundle is optional.** `/products/complete-toolkit` lists every included
  profile with a link to its own page. It is not a tier or a platform licence.
- **Filters reflect the catalogue.** Game filters cover FiveM, Roblox and shared
  profiles; type filters cover Aimbot, Visuals, Executor, Mod Menu and Utility.
  Search and filters are reflected in the URL.
- **Checkout is honest.** Every buy action goes to
  `/checkout?product=<slug>`. The page requires sign-in, shows the selected
  product and sends the customer to Paddle’s hosted checkout. The browser never
  chooses the price and no payment-success state is invented; only the signed
  Paddle webhook creates an order and entitlement.
- **Games are categories, not SKUs.** `/games` groups supported sessions and
  links to filtered store views. Upcoming games are labelled as unavailable.
- **Legacy URLs redirect.** `/products/fivem`, `/products/roblox`,
  `/platforms/fivem` and `/platforms/roblox` have static redirect shells and
  client-side redirects into the filtered store.

## Claims and risk

- No ratings, review totals, order counts, member counts, live-chat widgets or
  invented testimonials.
- No "undetected" or "ban-proof" promise. Product limits and the FAQ say that no
  modification can guarantee safety from server-side or platform enforcement.
- No game account is included. The site asks buyers to use only accounts they own
  and can afford to lose, and it never asks for a game password.
- Status labels reflect the catalogue's working state, not a third-party
  anti-cheat result. The status page separates verified API health from
  integrations that are merely configured.

## Verification

- `bun run typecheck` passes.
- `bun run build` completes; the only build warning is the client chunk size.
- Key routes were loaded at 1440 px and checked for title, h1, visible copy and
  horizontal overflow: `/`, `/store`, `/products/fivem-external`,
  `/products/complete-toolkit`, `/pricing`, `/games`, `/docs`, `/licence`,
  `/support`, `/changelog`, `/status`, `/forums`, `/login`, `/register`,
  `/terms`, `/refunds` and `/privacy`.
- The home page was checked at 390 px and 320 px with zero horizontal overflow.
  A desktop screenshot of the home, store and bundle pages is in `artifacts/`.
- Account-backed pages still require Supabase configuration. Protected downloads,
  order history, staff ticket replies and live payment webhooks are not connected
  in this build, and the UI says so rather than faking success.
