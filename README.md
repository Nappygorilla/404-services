# LUNA

LUNA is a desktop toolkit for creators working on FiveM and Roblox projects. It focuses on project inspection, dependency validation, repeatable builds, packaging, and authorized deployment.

The repository also contains the LUNA website: an item-level product storefront, per-product pricing, account entry points, documentation, community forums, release notes, and system status.

## Stack

- React 19 + TypeScript
- Vite 8 and Tailwind CSS 4
- React Router
- Motion for transitions and small interactions
- Cloudflare Workers / Workers Assets
- Supabase Auth and Postgres for accounts and community data

## Website routes

- `/` — product-focused homepage
- `/store` — item catalogue with platform/type filters and search; every tool is sold separately
- `/products/:slug` — tool and bundle detail pages with price, buy action, requirements, limits and related products
- `/products/complete-toolkit` — the optional all-tools bundle
- `/games` — category overview; categories are project types, not products
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

The Store sells every tool as its own product, with its own price, product page and buy action. The Complete Toolkit is an optional bundle built from the same catalogue; it is not required and it is priced below the sum of the individual tools. Categories on `/games` are project types, not SKUs. Checkout is handled by email until card payments are connected, and the site says so rather than presenting a fake basket.

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

Accounts, the issues forum and support tickets use Supabase. The complete
project, SQL, auth-URL and GitHub Actions setup is in
[SUPABASE-SETUP.md](SUPABASE-SETUP.md).

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase browser key is a public anon or publishable key. Never place the service-role key, database password, payment secrets, private signing keys, or provider webhooks in a `VITE_*` variable.

When Supabase is not configured, account- and community-backed surfaces display an explicit configuration notice rather than pretending sign-in or persistence is available.

## Marketplace database

The original community schema is in `supabase/schema.sql`. The additive marketplace schema is in `supabase/marketplace.sql`; apply it after the original schema.

The marketplace schema provides catalog metadata, release records, orders, order items, user entitlements, support tickets, and a private release-asset pointer table. Customer pages read their own order and entitlement rows and can submit support tickets under row-level security. Row-level security permits customers to read only their own account records. Browser clients cannot create orders or entitlements.

### Not connected yet

This branch intentionally does not claim that commerce or protected downloads are live:

- No payment provider credentials or verified webhook handler are configured.
- No production product binaries or private storage bucket are configured.
- No entitlement-backed signed download endpoint is configured, and no installer binaries are published.
- No external uptime monitor or incident feed is configured.
- Support tickets can be submitted and read by their owner, but staff replies and status management still need an operator workflow.
- Email-change verification and multi-factor authentication are not configured.
- The Orders page reads order rows populated by trusted server-side payment handling. The Downloads / Licenses page reads customer entitlements, but does not serve binaries until the private storage and signed-download endpoint are implemented.

Before accepting payments, implement a server-only checkout session endpoint and verify provider webhook signatures before creating `orders`, `order_items`, and `user_entitlements` rows. Never trust a browser redirect as proof of payment. Before exposing a file, verify the current user's entitlement server-side and issue a short-lived signed URL from a private Storage bucket.

## Project layout

- `src/pages/` — routed page components
- `src/components/` — shared navigation, cards, forms, overlays, account context
- `src/data.ts` — the single catalogue of tools and bundles, plus site copy and configuration
- `src/lib/` — Supabase client, API helpers, local utilities
- `src/worker/index.ts` — Cloudflare Worker entry point
- `supabase/` — database schemas and row-level security policies

## Scope

LUNA is intended for legitimate game development, project validation, packaging, customization of projects the user owns, and authorized deployment. It does not inject into, automate, or interfere with live game clients or anti-cheat systems.
