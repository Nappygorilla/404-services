# 404 Services

404 Services is a game-modification storefront for FiveM and Roblox. It sells external visuals, aim profiles, executors, script hubs, mod menus and stream-proof tooling through one Windows loader.

The repository contains the storefront: an item-level catalogue, per-product pricing, account entry points, documentation, community forums, release notes and system status.

## Stack

- React 19 + TypeScript
- Vite 8 and Tailwind CSS 4
- React Router
- Motion for transitions and small interactions
- Cloudflare Workers / Workers Assets
- Supabase Auth and Postgres for accounts, orders, entitlements and community data
- Supabase Edge Functions for Paddle checkout and signed downloads
- Paddle Billing for hosted checkout, tax and merchant-of-record invoicing

## Website routes

- `/` — product-focused homepage
- `/store` — catalogue with game/type filters and search; every cheat is sold separately
- `/products/:slug` — cheat and bundle detail pages with price, buy action, requirements, limits and related products
- `/products/complete-toolkit` — 404 Complete, the optional all-cheats bundle
- `/games` — game overview; categories are play styles, not products
- `/pricing` — every individual price plus the optional bundle
- legacy `/products/fivem`, `/products/roblox`, `/platforms/fivem` and `/platforms/roblox` — redirect into the filtered store
- `/checkout?product=slug` — signed-in Paddle hosted checkout for one product
- `/downloads` — account-protected download library with entitlement-checked signed links
- `/orders` — account-protected order history
- `/account` — customer dashboard
- `/account/profile` — display-name settings
- `/account/security` — password and current-device sign-out
- `/account/tickets` — private support-ticket submission and history
- `/account/licenses` — entitlement listing
- `/changelog` — release history
- `/status` — verified API check and integration configuration
- `/docs`, `/licence`, `/support`
- `/forums`, `/forums/announcements`, `/forums/issues`
- `/terms`, `/refunds`, `/privacy`

Every cheat has its own price, product page and buy action. 404 Complete is an optional bundle built from the same catalogue; it is not required and is priced below the sum of the individual profiles. Categories on `/games` are play styles, not SKUs. Checkout is created server-side and completed on Paddle’s hosted checkout; the browser never chooses the Paddle price or grants access. Orders and entitlements are written only by the signature-verified Paddle webhook.

## Run locally

Requirements: Node.js 22+ (or the current supported Bun runtime).

```sh
bun install
bun run dev
bun run typecheck
bun run build
```

The Vite/Cloudflare plugin runs the Worker during local development. The build output is written to `dist/client` plus the Worker bundle.

## Backend setup

Accounts, the issues forum, support tickets, Paddle order fulfillment and private release delivery use Supabase. The complete project, SQL, auth-URL, release-upload, Paddle and GitHub Actions setup is in [SUPABASE-SETUP.md](SUPABASE-SETUP.md). Private releases are served by the `signed-download` Edge Function after an active entitlement check. `paddle-checkout` creates a hosted checkout for the signed-in customer; `paddle-webhook` verifies Paddle’s signature and calls the atomic `fulfill_paddle_order` function.

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase browser key is a public anon or publishable key. Never place the service-role key, database password, payment secrets, private signing keys or provider webhooks in a `VITE_*` variable.

When Supabase is not configured, account- and community-backed surfaces display an explicit configuration notice rather than pretending sign-in or persistence is available.

## Marketplace database

The original community schema is in `supabase/schema.sql`. The additive marketplace schema is in `supabase/marketplace.sql`; apply it after the original schema. Paddle price mapping, bundle composition and fulfillment are added by `supabase/migrations/20261115_paddle_fulfillment.sql`.

The marketplace schema provides catalogue metadata, release records, orders, order items, user entitlements, support tickets and a private release-asset pointer table. The Paddle migration adds `products.paddle_price_id`, `product_bundle_items` and an atomic `fulfill_paddle_order` function. Customer pages read their own order and entitlement rows and can submit support tickets under row-level security. Row-level security permits customers to read only their own account records. Browser clients cannot create orders or entitlements.

### Not connected yet

The Paddle checkout and webhook handlers are deployed, but live payments still need operator configuration:

- `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET` and (for sandbox) `PADDLE_ENVIRONMENT` must be set as Supabase Edge Function secrets.
- Every published product needs a `paddle_price_id` mapped to a live Paddle price.
- Paddle needs a notification destination pointing at `paddle-webhook` with `transaction.completed` selected, plus a default payment link configured for hosted checkout.
- No production loader binaries are uploaded yet. The private `product-releases` bucket and the `signed-download` Edge Function are implemented; add a release row and asset pointer after uploading a real file.
- No external uptime monitor or incident feed is configured.
- Support tickets can be submitted and read by their owner, but staff replies and status management still need an operator workflow.
- Email-change verification and multi-factor authentication are not configured.
- The Orders page reads order rows populated by the Paddle webhook. The Downloads / Licences page requests a 60-second link from the Edge Function; until a release is published, it explains that no file is attached.

Never trust a browser redirect as proof of payment. Only the signed `transaction.completed` webhook creates `orders`, `order_items` and `user_entitlements` rows, and the database function is idempotent per Paddle transaction. The download endpoint verifies the current user’s active entitlement before signing a private release URL; keep the bucket private and never expose the service-role key, Paddle API key or webhook secret in the browser.

## Project layout

- `src/pages/` — routed page components
- `src/components/` — shared navigation, cards, forms, overlays, account context
- `src/data.ts` — the single catalogue of cheats and bundles, plus site copy and configuration
- `src/lib/` — Supabase client, API helpers, local utilities
- `src/worker/index.ts` — Cloudflare Worker entry point
- `supabase/functions/signed-download/` — entitlement-checked private release signing
- `supabase/functions/paddle-checkout/` — server-created Paddle hosted checkout
- `supabase/functions/paddle-webhook/` — signature-verified, idempotent Paddle fulfillment
- `supabase/` — database schemas, migrations and row-level security policies

## Scope and risk

404 Services sells game-modification software for FiveM and Roblox. Game modifications can breach a platform's terms of service and may lead to account action, including a permanent ban. Use the software only on game accounts you own and can afford to lose. No product on this site guarantees safety from anti-cheat or platform enforcement, and no game account is included with a purchase.

The site never asks for a game password. Licence activation uses a key and a hashed device identifier. Support can help with loader and licence problems; it cannot restore a game account actioned by a platform.
