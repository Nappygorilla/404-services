-- Issue one 404 licence key per paid order.
--
-- The key lives on the order, so an order containing the 404 Complete bundle
-- gives every included entitlement the same key. The browser never generates
-- or chooses a key; only the trusted Paddle fulfillment function does.

create or replace function public.format_license_key(p_seed uuid)
returns text
language sql
immutable
set search_path = public
as $$
  select '404-' || upper(
    substr(raw, 1, 4) || '-' ||
    substr(raw, 5, 4) || '-' ||
    substr(raw, 9, 4) || '-' ||
    substr(raw, 13, 4) || '-' ||
    substr(raw, 17, 4)
  )
  from (select replace(p_seed::text, '-', '') as raw) seed;
$$;

alter table public.orders
  add column if not exists license_key text;

-- Existing orders predate key issuance; give each one a key before enforcing
-- the constraint. New orders are handled by fulfill_paddle_order below.
update public.orders
set license_key = public.format_license_key(gen_random_uuid())
where license_key is null;

alter table public.orders
  drop constraint if exists orders_license_key_format;

alter table public.orders
  add constraint orders_license_key_format
  check (license_key ~ '^404-[A-F0-9]{4}(-[A-F0-9]{4}){4}$');

alter table public.orders
  alter column license_key set not null;

create unique index if not exists orders_license_key_idx
  on public.orders (license_key);

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

  v_license_key := public.format_license_key(gen_random_uuid());

  insert into public.orders
    (user_id, provider, provider_reference, status, currency, subtotal_minor, tax_minor, total_minor, created_at, paid_at, license_key)
  values
    (p_user_id, 'paddle', p_provider_reference, 'paid', upper(p_currency), p_subtotal_minor, p_tax_minor, p_total_minor, coalesce(p_paid_at, now()), coalesce(p_paid_at, now()), v_license_key)
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
