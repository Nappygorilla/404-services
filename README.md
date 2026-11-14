# LUNA

LUNA is a desktop toolkit for creators working on FiveM and Roblox projects. It focuses on project inspection, dependency validation, repeatable builds, packaging, and authorized deployment.

The repository also contains the LUNA website: a product storefront, platform guides, pricing information, account entry points, documentation, community forums, release notes, and system status.

## Stack

- React 19 + TypeScript
- Vite 8 and Tailwind CSS 4
- React Router
- Motion for transitions and small interactions
- Cloudflare Workers / Workers Assets
- Supabase Auth and Postgres for accounts and community data

## Website routes

- `/` — product-focused homepage
- `/store` — two platform licences, each sold separately
- `/products/fivem`, `/products/roblox` — licence detail pages with price and buy action
- `/games` — category overview; categories are examples included in a platform licence
- `/pricing` — per-platform licence pricing
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

The Store sells the FiveM licence and the Roblox licence as two separate products, each with its own price and buy action. Every category on `/games` is included in the matching platform licence; categories are examples, not additional SKUs. Checkout is handled by email until card payments are connected, and the site says so rather than presenting a fake basket.

## Run locally

Requirements: Node.js 22+ (or the current supported Bun runtime).

```sh
bun install
bun run dev
bun run typecheck
bun run build
```

The Vite/Cloudflare plugin runs the Worker during local development. The build output is written to `dist/client` plus the Worker bundle.

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase browser key is a public anon key. Never place the service-role key, payment secrets, private signing keys, or provider webhooks in a `VITE_*` variable.

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
- `src/data.ts` — product/platform copy and site configuration
- `src/lib/` — Supabase client, API helpers, local utilities
- `src/worker/index.ts` — Cloudflare Worker entry point
- `supabase/` — database schemas and row-level security policies

## Scope

LUNA is intended for legitimate game development, project validation, packaging, customization of projects the user owns, and authorized deployment. It does not inject into, automate, or interfere with live game clients or anti-cheat systems.
