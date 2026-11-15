-- Paddle Billing fulfillment support.
--
-- The checkout Edge Function stores a Paddle price ID on each product. The
-- webhook resolves paid line items back to those products, then calls
-- fulfill_paddle_order so the order, items and entitlements are written in one
-- database transaction. Paddle retries duplicate webhooks; the unique
-- transaction reference makes fulfillment idempotent.

alter table public.products
  add column if not exists paddle_price_id text;

alter table public.products
  drop constraint if exists products_paddle_price_id_format;

alter table public.products
  add constraint products_paddle_price_id_format
  check (paddle_price_id is null or paddle_price_id ~ '^pri_[a-z0-9]{26}$');

create unique index if not exists products_paddle_price_id_idx
  on public.products (paddle_price_id)
  where paddle_price_id is not null;

create table if not exists public.product_bundle_items (
  bundle_product_id uuid not null references public.products(id) on delete cascade,
  included_product_id uuid not null references public.products(id) on delete restrict,
  primary key (bundle_product_id, included_product_id),
  check (bundle_product_id <> included_product_id)
);

alter table public.product_bundle_items enable row level security;
grant all on public.product_bundle_items to service_role;

-- The current 404 Complete bundle includes every other published product.
insert into public.product_bundle_items (bundle_product_id, included_product_id)
select bundle.id, included.id
from public.products bundle
join public.products included on included.slug <> bundle.slug
where bundle.slug = 'complete-toolkit'
  and bundle.status = 'published'
  and included.status = 'published'
on conflict (bundle_product_id, included_product_id) do nothing;

-- One active entitlement per customer/product. Re-purchases reactivate the row
-- instead of creating duplicate download cards.
create unique index if not exists user_entitlements_user_product_idx
  on public.user_entitlements (user_id, product_id);

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
  v_order_item_id uuid;
  v_item record;
  v_product_id uuid;
  v_product_name text;
  v_quantity integer;
  v_unit_amount bigint;
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
      (user_id, order_item_id, product_id, status, starts_at, expires_at)
    values
      (p_user_id, v_order_item_id, v_product_id, 'active', now(), null)
    on conflict (user_id, product_id) do update set
      order_item_id = excluded.order_item_id,
      status = 'active',
      starts_at = now(),
      expires_at = null;

    insert into public.user_entitlements
      (user_id, order_item_id, product_id, status, starts_at, expires_at)
    select p_user_id, v_order_item_id, included_product_id, 'active', now(), null
    from public.product_bundle_items
    where bundle_product_id = v_product_id
    on conflict (user_id, product_id) do update set
      order_item_id = excluded.order_item_id,
      status = 'active',
      starts_at = now(),
      expires_at = null;
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.fulfill_paddle_order(text, uuid, text, bigint, bigint, bigint, timestamptz, jsonb) from public, anon, authenticated;
grant execute on function public.fulfill_paddle_order(text, uuid, text, bigint, bigint, bigint, timestamptz, jsonb) to service_role;
