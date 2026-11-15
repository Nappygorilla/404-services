-- Promote licence keys from orders.license_key to a first-class table.
--
-- One paid order issues one licence. Every entitlement created by that order
-- points at the same licence, so 404 Complete still gives the buyer one key for
-- all included products.

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  license_key text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint licenses_key_format
    check (license_key ~ '^404-[A-F0-9]{4}(-[A-F0-9]{4}){4}$')
);

create index if not exists licenses_user_created_idx
  on public.licenses (user_id, created_at desc);

alter table public.licenses enable row level security;

drop policy if exists "customers read their own licenses" on public.licenses;
create policy "customers read their own licenses"
  on public.licenses for select
  to authenticated
  using (user_id = auth.uid());

grant select on public.licenses to authenticated;
grant all on public.licenses to service_role;

-- Move any existing order-level keys into the new table, then retire the
-- denormalised column. The conditional keeps this migration rerunnable.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'license_key'
  ) then
    insert into public.licenses
      (user_id, order_id, license_key, status, issued_at, revoked_at, created_at)
    select
      o.user_id,
      o.id,
      o.license_key,
      case
        when o.status = 'paid' then 'active'
        when o.status in ('refunded', 'cancelled') then 'revoked'
        else 'expired'
      end,
      coalesce(o.paid_at, o.created_at),
      case when o.status in ('refunded', 'cancelled') then now() else null end,
      o.created_at
    from public.orders o
    where o.license_key is not null
    on conflict (order_id) do nothing;

    alter table public.orders drop column license_key;
  end if;
end $$;

alter table public.user_entitlements
  add column if not exists license_id uuid;

update public.user_entitlements ue
set license_id = l.id
from public.order_items oi
join public.licenses l on l.order_id = oi.order_id
where ue.order_item_id = oi.id
  and ue.license_id is null;

alter table public.user_entitlements
  drop constraint if exists user_entitlements_license_id_fkey;

alter table public.user_entitlements
  add constraint user_entitlements_license_id_fkey
  foreign key (license_id) references public.licenses(id) on delete cascade;

-- Current data has no unlinked entitlements. Keep the column nullable if an
-- older installation has a legacy row that cannot be matched.
do $$
begin
  if not exists (select 1 from public.user_entitlements where license_id is null) then
    alter table public.user_entitlements alter column license_id set not null;
  end if;
end $$;

create or replace function public.fulfill_paddle_order(
  p_provider_reference text,
  p_user_id uuid,
  p_currency text,
  p_subtotal_minor bigint,
  p_tax_minor bigint,
  p_total_minor bigint,
  p_paid_at timestamptz,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_license_id uuid;
  v_order_item_id uuid;
  v_item record;
  v_product_id uuid;
  v_product_name text;
  v_quantity integer;
  v_unit_amount bigint;
  v_license_key text;
begin
  if p_provider_reference is null or length(trim(p_provider_reference)) < 3 then
    raise exception 'A Paddle transaction reference is required';
  end if;
  if p_user_id is null then
    raise exception 'A customer user id is required';
  end if;
  if p_currency is null or p_currency !~ '^[A-Za-z]{3}$' then
    raise exception 'A three-letter currency code is required';
  end if;
  if p_subtotal_minor < 0 or p_tax_minor < 0 or p_total_minor < 0 then
    raise exception 'Order totals cannot be negative';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one order item is required';
  end if;

  insert into public.orders
    (user_id, provider, provider_reference, status, currency, subtotal_minor, tax_minor, total_minor, created_at, paid_at)
  values
    (p_user_id, 'paddle', p_provider_reference, 'paid', upper(p_currency), p_subtotal_minor, p_tax_minor, p_total_minor, coalesce(p_paid_at, now()), coalesce(p_paid_at, now()))
  on conflict (provider_reference) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    select id into v_order_id
    from public.orders
    where provider_reference = p_provider_reference;

    if v_order_id is null then
      raise exception 'Could not resolve the existing order';
    end if;
    return v_order_id;
  end if;

  v_license_key := public.format_license_key(gen_random_uuid());

  insert into public.licenses
    (user_id, order_id, license_key, status, issued_at, created_at)
  values
    (p_user_id, v_order_id, v_license_key, 'active', coalesce(p_paid_at, now()), now())
  returning id into v_license_id;

  for v_item in
    select *
    from jsonb_to_recordset(p_items)
      as item(product_id uuid, product_name text, quantity integer, unit_amount_minor bigint)
  loop
    v_quantity := coalesce(v_item.quantity, 0);
    v_unit_amount := coalesce(v_item.unit_amount_minor, -1);

    if v_item.product_id is null then
      raise exception 'An order item is missing its product id';
    end if;
    if v_quantity < 1 or v_quantity > 50 then
      raise exception 'Order item quantity must be between 1 and 50';
    end if;
    if v_unit_amount < 0 then
      raise exception 'Order item amount cannot be negative';
    end if;

    v_product_id := null;
    v_product_name := null;
    select id, name into v_product_id, v_product_name
    from public.products
    where id = v_item.product_id and status = 'published';

    if v_product_id is null then
      raise exception 'Product % is not published', v_item.product_id;
    end if;

    insert into public.order_items
      (order_id, product_id, product_name_snapshot, quantity, unit_amount_minor)
    values
      (v_order_id, v_product_id, coalesce(nullif(trim(v_item.product_name), ''), v_product_name), v_quantity, v_unit_amount)
    returning id into v_order_item_id;

    insert into public.user_entitlements
      (user_id, order_item_id, license_id, product_id, status, starts_at, expires_at)
    values
      (p_user_id, v_order_item_id, v_license_id, v_product_id, 'active', now(), null)
    on conflict (user_id, product_id) do update set
      order_item_id = excluded.order_item_id,
      license_id = excluded.license_id,
      status = 'active',
      starts_at = now(),
      expires_at = null;

    insert into public.user_entitlements
      (user_id, order_item_id, license_id, product_id, status, starts_at, expires_at)
    select p_user_id, v_order_item_id, v_license_id, included_product_id, 'active', now(), null
    from public.product_bundle_items
    where bundle_product_id = v_product_id
    on conflict (user_id, product_id) do update set
      order_item_id = excluded.order_item_id,
      license_id = excluded.license_id,
      status = 'active',
      starts_at = now(),
      expires_at = null;
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.fulfill_paddle_order(text, uuid, text, bigint, bigint, bigint, timestamptz, jsonb) from public, anon, authenticated;
grant execute on function public.fulfill_paddle_order(text, uuid, text, bigint, bigint, bigint, timestamptz, jsonb) to service_role;
