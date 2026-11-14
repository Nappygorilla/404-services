-- LUNA marketplace foundation.
-- Apply after supabase/schema.sql. This adds customer-safe marketplace records;
-- payment confirmation and file delivery must remain server-side.
--
-- Important:
--   * Never insert orders or entitlements from the browser.
--   * A trusted payment webhook / server process should create those rows.
--   * Keep binaries in a private Storage bucket and issue short-lived signed URLs
--     only after checking the signed-in user's entitlement.
--   * Do not store card numbers, CVVs, or payment credentials in these tables.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  name text not null check (char_length(name) between 2 and 120),
  summary text not null check (char_length(summary) between 10 and 500),
  category text not null check (char_length(category) between 2 and 80),
  status text not null default 'draft' check (status in ('draft', 'published', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_releases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  version text not null check (char_length(version) between 1 and 40),
  release_notes text not null default '',
  minimum_os text not null default '',
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, version)
);

-- Private file pointers are isolated from public product/release metadata.
-- Only service-role code may read or write this table.
create table if not exists public.release_assets (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null unique references public.product_releases(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  sha256 text not null check (sha256 ~ '^[a-fA-F0-9]{64}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  provider text not null,
  provider_reference text not null unique,
  status text not null check (status in ('pending', 'paid', 'refunded', 'cancelled', 'failed')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name_snapshot text not null,
  quantity integer not null default 1 check (quantity between 1 and 50),
  unit_amount_minor bigint not null check (unit_amount_minor >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  product_id uuid not null references public.products(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists entitlements_user_idx on public.user_entitlements (user_id, created_at desc);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) between 4 and 140),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_user_created_idx on public.support_tickets (user_id, created_at desc);

alter table public.products enable row level security;
alter table public.product_releases enable row level security;
alter table public.release_assets enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.support_tickets enable row level security;

drop policy if exists "published products are public" on public.products;
create policy "published products are public"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "published releases are public" on public.product_releases;
create policy "published releases are public"
  on public.product_releases for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

-- No browser policies are created for release_assets. Trusted server code
-- using the service role resolves storage paths and authorizes signed downloads.

drop policy if exists "customers read their own orders" on public.orders;
create policy "customers read their own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "customers read their own order items" on public.order_items;
create policy "customers read their own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "customers read their own entitlements" on public.user_entitlements;
create policy "customers read their own entitlements"
  on public.user_entitlements for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "customers read their own support tickets" on public.support_tickets;
create policy "customers read their own support tickets"
  on public.support_tickets for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "customers create their own support tickets" on public.support_tickets;
create policy "customers create their own support tickets"
  on public.support_tickets for insert
  to authenticated
  with check (user_id = auth.uid());

-- No browser insert/update/delete policy exists for orders, order_items,
-- entitlements, or release assets. Service-role backend code must own these.
