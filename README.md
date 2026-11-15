# 404 Services

404 Services is a game-modification storefront for FiveM and Roblox. It sells external visuals, aim profiles, executors, script hubs, mod menus and stream-proof tooling through one Windows loader.

The repository contains the storefront: an item-level catalogue, per-product pricing, account entry points, documentation, community forums, release notes and system status.

## Stack

- React 19 + TypeScript
- Vite 8 and Tailwind CSS 4
- React Router
- Motion for transitions and small interactions
- Cloudflare Workers / Workers Assets
- Supabase Auth and Postgres for accounts and community data

## Website routes

- `/` — product-focused homepage
- `/store` — catalogue with game/type filters and search; every cheat is sold separately
- `/products/:slug` — cheat and bundle detail pages with price, buy action, requirements, limits and related products
- `/products/complete-toolkit` — 404 Complete, the optional all-cheats bundle
- `/games` — game overview; categories are play styles, not products
- `/pricing` — every individual price plus the optional bundle
- legacy `/products/fivem`, `/products/roblox`, `/platforms/fivem` and `/platforms/roblox` — redirect into the filtered store
- `/downloads` — account-protected download library placeholder
- `/orders` — account-protected order history placeholder
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

Every cheat has its own price, product page and buy action. 404 Complete is an optional bundle built from the same catalogue; it is not required and is priced below the sum of the individual profiles. Categories on `/games` are play styles, not SKUs. Checkout is handled by email until card payments are connected, and the site says so rather than presenting a fake basket.

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

Accounts, the issues forum and support tickets use Supabase. The complete project, SQL, auth-URL and GitHub Actions setup is in [SUPABASE-SETUP.md](SUPABASE-SETUP.md).

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase browser key is a public anon or publishable key. Never place the service-role key, database password, payment secrets, private signing keys or provider webhooks in a `VITE_*` variable.

When Supabase is not configured, account- and community-backed surfaces display an explicit configuration notice rather than pretending sign-in or persistence is available.

## Marketplace database

The original community schema is in `supabase/schema.sql`. The additive marketplace schema is in `supabase/marketplace.sql`; apply it after the original schema.

The marketplace schema provides catalogue metadata, release records, orders, order items, user entitlements, support tickets and a private release-asset pointer table. Customer pages read their own order and entitlement rows and can submit support tickets under row-level security. Row-level security permits customers to read only their own account records. Browser clients cannot create orders or entitlements.

### Not connected yet

This branch intentionally does not claim that commerce or protected downloads are live:

- No payment provider credentials or verified webhook handler are configured.
- No production loader binaries or private storage bucket are configured.
- No entitlement-backed signed download endpoint is configured.
- No external uptime monitor or incident feed is configured.
- Support tickets can be submitted and read by their owner, but staff replies and status management still need an operator workflow.
- Email-change verification and multi-factor authentication are not configured.
- The Orders page reads order rows populated by trusted server-side payment handling. The Downloads / Licences page reads customer entitlements, but does not serve binaries until the private storage and signed-download endpoint are implemented.

Before accepting payments, implement a server-only checkout session endpoint and verify provider webhook signatures before creating `orders`, `order_items` and `user_entitlements` rows. Never trust a browser redirect as proof of payment. Before exposing a file, verify the current user's entitlement server-side and issue a short-lived signed URL from a private Storage bucket.

## Project layout

- `src/pages/` — routed page components
- `src/components/` — shared navigation, cards, forms, overlays, account context
- `src/data.ts` — the single catalogue of cheats and bundles, plus site copy and configuration
- `src/lib/` — Supabase client, API helpers, local utilities
- `src/worker/index.ts` — Cloudflare Worker entry point
- `supabase/` — database schemas and row-level security policies

## Scope and risk

404 Services sells game-modification software for FiveM and Roblox. Game modifications can breach a platform's terms of service and may lead to account action, including a permanent ban. Use the software only on game accounts you own and can afford to lose. No product on this site guarantees safety from anti-cheat or platform enforcement, and no game account is included with a purchase.

The site never asks for a game password. Licence activation uses a key and a hashed device identifier. Support can help with loader and licence problems; it cannot restore a game account actioned by a platform.
