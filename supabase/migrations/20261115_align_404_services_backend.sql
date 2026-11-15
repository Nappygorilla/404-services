-- Align the existing 404 Services Supabase project with the storefront schema.
--
-- The project was first provisioned with a different product/order model:
-- licenses, profiles, ticket_replies and price_cents fields. This migration
-- replaces the empty commerce tables with the schema used by src/pages and
-- seeds the current catalogue. It preserves the unrelated categories table.
--
-- Run once. After this, supabase/schema.sql and supabase/marketplace.sql are
-- compatible with the project for documentation and fresh installs.

begin;

-- Legacy empty tables that conflict with the storefront's expected shape.
drop table if exists public.licenses cascade;
drop table if exists public.ticket_replies cascade;
drop table if exists public.support_tickets cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.user_entitlements cascade;
drop table if exists public.release_assets cascade;
drop table if exists public.product_releases cascade;
drop table if exists public.products cascade;
drop table if exists public.forum_threads cascade;

create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  board text not null check (board in ('announcements', 'issues')),
  title text not null check (char_length(title) between 4 and 120),
  body text not null check (char_length(body) between 10 and 4000),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  created_at timestamptz not null default now()
);

create index forum_threads_board_created_idx
  on public.forum_threads (board, created_at desc);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  name text not null check (char_length(name) between 2 and 120),
  summary text not null check (char_length(summary) between 10 and 500),
  category text not null check (char_length(category) between 2 and 80),
  status text not null default 'draft' check (status in ('draft', 'published', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_releases (
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

create table public.release_assets (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null unique references public.product_releases(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  sha256 text not null check (sha256 ~ '^[a-fA-F0-9]{64}$'),
  created_at timestamptz not null default now()
);

create table public.orders (
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

create index orders_user_created_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name_snapshot text not null,
  quantity integer not null default 1 check (quantity between 1 and 50),
  unit_amount_minor bigint not null check (unit_amount_minor >= 0),
  created_at timestamptz not null default now()
);

create table public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  product_id uuid not null references public.products(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index entitlements_user_idx on public.user_entitlements (user_id, created_at desc);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) between 4 and 140),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_tickets_user_created_idx on public.support_tickets (user_id, created_at desc);

alter table public.forum_threads enable row level security;
alter table public.products enable row level security;
alter table public.product_releases enable row level security;
alter table public.release_assets enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.support_tickets enable row level security;

create policy "board posts are public"
  on public.forum_threads for select
  using (true);

create policy "members open issue topics"
  on public.forum_threads for insert
  to authenticated
  with check (board = 'issues' and author_id = auth.uid());

create policy "authors delete own topics"
  on public.forum_threads for delete
  to authenticated
  using (author_id = auth.uid());

create policy "published products are public"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

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

create policy "customers read their own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

create policy "customers read their own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "customers read their own entitlements"
  on public.user_entitlements for select
  to authenticated
  using (user_id = auth.uid());

create policy "customers read their own support tickets"
  on public.support_tickets for select
  to authenticated
  using (user_id = auth.uid());

create policy "customers create their own support tickets"
  on public.support_tickets for insert
  to authenticated
  with check (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.products, public.product_releases to anon, authenticated;
grant select on public.forum_threads to anon, authenticated;
grant insert, delete on public.forum_threads to authenticated;
grant select on public.orders, public.order_items, public.user_entitlements to authenticated;
grant select, insert on public.support_tickets to authenticated;
grant all on public.products, public.product_releases, public.release_assets,
  public.orders, public.order_items, public.user_entitlements,
  public.support_tickets, public.forum_threads to service_role;

insert into public.products (slug, name, summary, category, status) values
  ('fivem-external', 'FiveM External', 'External visuals, radar and aim assist for FiveM.', 'Mod Menu', 'published'),
  ('fivem-internal', 'FiveM Internal', 'The full FiveM menu, loaded inside the game.', 'Mod Menu', 'published'),
  ('fivem-aim', 'FiveM Aim', 'A focused aim profile with natural smoothing.', 'Aimbot', 'published'),
  ('fivem-visuals', 'FiveM Visuals', 'Clean player and vehicle ESP for FiveM.', 'Visuals', 'published'),
  ('fivem-lua', 'FiveM Lua', 'Run supported Lua scripts through the loader.', 'Executor', 'published'),
  ('fivem-script-hub', 'FiveM Script Hub', 'A curated stack of FiveM scripts and configs.', 'Executor', 'published'),
  ('roblox-executor', 'Roblox Executor', 'A fast executor for supported Roblox experiences.', 'Executor', 'published'),
  ('roblox-aim', 'Roblox Aim', 'Aim profiles tuned for Roblox combat.', 'Aimbot', 'published'),
  ('roblox-visuals', 'Roblox Visuals', 'Player, object and distance overlays.', 'Visuals', 'published'),
  ('roblox-script-hub', 'Roblox Script Hub', 'A curated library for the Roblox executor.', 'Executor', 'published'),
  ('roblox-mod-menu', 'Roblox Mod Menu', 'One compact menu for supported experiences.', 'Mod Menu', 'published'),
  ('roblox-external', 'Roblox External', 'A lightweight external overlay for Roblox.', 'Mod Menu', 'published'),
  ('stream-proof', 'Stream Proof', 'Keep the overlay out of common captures.', 'Utility', 'published'),
  ('cloud-configs', 'Cloud Configs', 'Sync your profiles across two devices.', 'Utility', 'published'),
  ('complete-toolkit', '404 Complete', 'Every current cheat in one optional bundle.', 'Bundle', 'published')
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  category = excluded.category,
  status = excluded.status,
  updated_at = now();

commit;
