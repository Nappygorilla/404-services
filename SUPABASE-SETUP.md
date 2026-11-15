# Supabase setup

This is the backend runbook for accounts, the issues forum and support tickets.
The storefront catalogue itself is static; it does not need a database.

> **Existing project:** The `404-services` project has already been aligned
> with the storefront, seeded, and given the Paddle fulfillment migration. If
> you are repairing that project, apply
> `supabase/migrations/20261115_align_404_services_backend.sql` and
> `supabase/migrations/20261115_paddle_fulfillment.sql` once each instead of the
> two setup files in step 3. Use the setup files only for a fresh project.

## 1. Create the project

1. Open [Supabase](https://supabase.com/dashboard) and create a project.
2. Choose a region close to your players and save the database password in your
   password manager. The site never needs that password.
3. Wait for the project to finish provisioning.

The free plan is enough for authentication, the forum and support tickets. A
custom SMTP provider is recommended before opening registration publicly,
because Supabase's built-in email sender is rate-limited.

## 2. Add the API values

In **Project Settings → API** copy:

- **Project URL** — looks like `https://<project-ref>.supabase.co`
- **Publishable key** — or the legacy **anon public** key

Both are public browser values. The `service_role` key is different and must
never be built into this site.

### Local development

```sh
cp .env.example .env
```

Add the public Paddle checkout values as well:

- `VITE_PADDLE_CLIENT_TOKEN` — Paddle’s public client-side token
- `VITE_PADDLE_ENVIRONMENT` — `sandbox` or `production`

Fill all values in `.env`, then restart the dev server:

```sh
bun run dev
```

The site reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PADDLE_CLIENT_TOKEN` and `VITE_PADDLE_ENVIRONMENT` at build time.
Vite's local dev server is on `http://localhost:5305/`.

### GitHub Pages

In [the repository's Actions variables](https://github.com/Nappygorilla/404-services/settings/variables/actions)
(**Settings → Secrets and variables → Actions → Variables**), add:

- `SUPABASE_URL` — the Project URL
- `SUPABASE_ANON_KEY` — the publishable or anon key
- `PADDLE_CLIENT_TOKEN` — Paddle’s public client-side token
- `PADDLE_ENVIRONMENT` — `sandbox` or `production`

These are public browser values, so repository variables are appropriate. The
Pages workflow maps them to the `VITE_*` names during the build. Re-run the
**Deploy to GitHub Pages** workflow after changing them; editing a variable does
not rebuild an existing deployment automatically.

## 3. Create the database objects

Open **SQL Editor** and run these in order:

1. `supabase/schema.sql` — forum threads and their public/author policies.
2. `supabase/marketplace.sql` — products, releases, orders, entitlements and
   support tickets.
3. `supabase/migrations/20261115_create_release_bucket.sql` — the private
   `product-releases` Storage bucket.
4. `supabase/migrations/20261115_paddle_fulfillment.sql` — Paddle price mapping,
   bundle composition and the atomic `fulfill_paddle_order` function.

The files are idempotent for tables, indexes, policies, functions and the bucket,
so they can be run again to repair a partial setup. On a fresh project, run them
in that order.

The browser can only read its own orders, entitlements and tickets. Orders,
order items, entitlements and release-asset pointers have no browser write
policy: a trusted payment webhook or server process must own those writes.

## 4. Configure authentication

In **Authentication → URL Configuration**:

- **Site URL**:
  `https://nappygorilla.github.io/404-services/`
- **Redirect URLs** — add:
  - `https://nappygorilla.github.io/404-services/`
  - `http://localhost:5305/`
  - `http://localhost:3000/` if you also test the production build locally with
    the static server

Registration passes an explicit `emailRedirectTo` for the current origin and
base path, so the confirmation email returns to the deployment that created the
account. If you use another preview host, add its exact origin to the allowlist.
If you attach a custom domain such as `404services.gg`, add that origin too and make it
the Site URL.

In **Authentication → Providers → Email**:

- Enable Email.
- Keep **Confirm email** enabled.
- Set a minimum password length of 8 (the forms already enforce this).

Disable anonymous sign-ins unless you deliberately add an anonymous flow.

## 5. Publish a private release

The repository contains no loader binaries. The `product-releases` bucket and
the `signed-download` Edge Function are deployed, but there is nothing to sign
until a real release file is uploaded and registered.

1. Open **Storage → product-releases** and upload a build to a path such as
   `fivem-external/4.0.4/404-loader.zip`. Keep the bucket private.
2. Compute the file's SHA-256.
3. Register the release and its asset. Replace the slug, version, path, size,
   notes and zeroed checksum with the real values:

```sql
with product as (
  select id from public.products where slug = 'fivem-external'
), release as (
  insert into public.product_releases
    (product_id, version, release_notes, minimum_os, file_size_bytes, is_published)
  select id, '4.0.4', 'Initial loader release', 'Windows 10/11', 44040192, true
  from product
  on conflict (product_id, version) do update set
    release_notes = excluded.release_notes,
    minimum_os = excluded.minimum_os,
    file_size_bytes = excluded.file_size_bytes,
    is_published = true
  returning id
)
insert into public.release_assets
  (release_id, storage_bucket, storage_path, sha256)
select id, 'product-releases', 'fivem-external/4.0.4/404-loader.zip',
       '0000000000000000000000000000000000000000000000000000000000000000'
from release
on conflict (release_id) do update set
  storage_bucket = excluded.storage_bucket,
  storage_path = excluded.storage_path,
  sha256 = excluded.sha256;
```

The function uses the service role to read `release_assets` and create a
60-second signed URL. The bucket has no public or authenticated read policy, so
a customer cannot bypass the entitlement check. If you use a custom domain,
add its exact origin to `ALLOWED_ORIGINS` in
`supabase/functions/signed-download/index.ts` and redeploy the function.

For a fresh project, deploy the function with the Supabase CLI from the repo
root after logging in:

```sh
supabase functions deploy signed-download
```

## 6. Connect Paddle

Paddle Billing is the merchant of record. The browser never chooses a price or a
customer; it asks `paddle-checkout` for a hosted checkout, and access is granted
only by the signature-verified `paddle-webhook`. Never put a Paddle key or
webhook secret in a `VITE_*` variable.

### 6.1 Create Paddle prices

Create one **one-time** Paddle price per published product. Use EUR prices so
they match the storefront. The storefront currently shows a launch price until
31 January 2027; create the Paddle price for the amount customers should
actually pay at checkout. If you do not want launch pricing, change `LAUNCH` in
`src/data.ts` before creating the prices.

| Product slug | Base EUR | Launch EUR (until 31 Jan 2027) |
| --- | ---: | ---: |
| `fivem-external` | 19.99 | 16.00 |
| `fivem-internal` | 29.99 | 24.00 |
| `fivem-aim` | 14.99 | 12.00 |
| `fivem-visuals` | 17.99 | 14.00 |
| `fivem-lua` | 14.99 | 12.00 |
| `fivem-script-hub` | 24.99 | 20.00 |
| `roblox-executor` | 19.99 | 16.00 |
| `roblox-aim` | 14.99 | 12.00 |
| `roblox-visuals` | 17.99 | 14.00 |
| `roblox-script-hub` | 24.99 | 20.00 |
| `roblox-mod-menu` | 29.99 | 24.00 |
| `roblox-external` | 24.99 | 20.00 |
| `stream-proof` | 9.99 | 8.00 |
| `cloud-configs` | 7.99 | 6.00 |
| `complete-toolkit` | 69.99 | 56.00 |

The optional `complete-toolkit` bundle includes every other published product
through `product_bundle_items`. Its own Paddle price is the only price needed for
the bundle; the webhook grants the included products.

### 6.2 Map price IDs

Copy each `pri_…` ID from Paddle, replace every `pri_REPLACE` below, and run the
statement in the SQL editor. Price IDs must be unique.

```sql
update public.products p
set paddle_price_id = v.price_id
from (values
  ('fivem-external', 'pri_REPLACE'),
  ('fivem-internal', 'pri_REPLACE'),
  ('fivem-aim', 'pri_REPLACE'),
  ('fivem-visuals', 'pri_REPLACE'),
  ('fivem-lua', 'pri_REPLACE'),
  ('fivem-script-hub', 'pri_REPLACE'),
  ('roblox-executor', 'pri_REPLACE'),
  ('roblox-aim', 'pri_REPLACE'),
  ('roblox-visuals', 'pri_REPLACE'),
  ('roblox-script-hub', 'pri_REPLACE'),
  ('roblox-mod-menu', 'pri_REPLACE'),
  ('roblox-external', 'pri_REPLACE'),
  ('stream-proof', 'pri_REPLACE'),
  ('cloud-configs', 'pri_REPLACE'),
  ('complete-toolkit', 'pri_REPLACE')
) as v(slug, price_id)
where p.slug = v.slug;

select slug, paddle_price_id
from public.products
where status = 'published'
order by slug;
```

Every published product used in checkout must have a price. If you add a new
product later, add its price ID and its bundle membership in the same way.

### 6.3 Set the Edge Function secrets

In **Project Settings → Edge Functions → Secrets** (or with `supabase secrets
set`), add:

- `PADDLE_API_KEY` — a Paddle API key for the same environment as the prices.
- `PADDLE_WEBHOOK_SECRET` — the secret from the Paddle notification destination
  created in step 6.5.
- `PADDLE_ENVIRONMENT` — `sandbox` while testing, or omit / use `production` for
  live payments.

Do not paste these values into chat, GitHub Actions variables, `.env.example` or
any `VITE_*` variable. `PADDLE_API_KEY` is an Authorization bearer credential;
`PADDLE_WEBHOOK_SECRET` verifies event authenticity.

The browser separately needs Paddle’s **client-side token**, which is public by
design and is not the API key. Set `PADDLE_CLIENT_TOKEN` as an Actions variable
(and `PADDLE_ENVIRONMENT=sandbox` for sandbox testing); the workflow maps them
to `VITE_PADDLE_CLIENT_TOKEN` and `VITE_PADDLE_ENVIRONMENT` at build time. The
checkout page loads Paddle.js and opens the transaction as an overlay, so the
browser never chooses the price.

### 6.4 Deploy the functions

```sh
supabase functions deploy paddle-checkout
supabase functions deploy paddle-webhook --no-verify-jwt
```

`paddle-checkout` keeps JWT verification on: only a signed-in customer can ask
for a checkout. `paddle-webhook` must not require a Supabase JWT because Paddle
cannot send one; the function verifies the `Paddle-Signature` HMAC itself. If you
deploy from the dashboard instead, turn **Verify JWT** off for `paddle-webhook`
only.

### 6.5 Configure the Paddle notification destination

In Paddle, open **Developer Tools → Notifications** and create a destination:

- URL: `https://revaqphykwrawrdhbhpt.supabase.co/functions/v1/paddle-webhook`
- Events: `transaction.completed`
- Copy the destination’s secret key into `PADDLE_WEBHOOK_SECRET`.

The function checks the `Paddle-Signature` header over the raw request body,
rejects timestamps older than five minutes, and matches the hex digest in
constant time. It only fulfills `transaction.completed`; other subscribed events
are acknowledged and ignored. Paddle retries are safe because `orders`,
`order_items` and `user_entitlements` are written by one idempotent function keyed
by the Paddle transaction ID.

### 6.6 Configure hosted checkout

In Paddle **Checkout settings**, set a default payment link for the store. Paddle
requires one before it will create transactions, and uses it for payment-method
updates and emails. The checkout page opens the transaction directly with
Paddle.js from the server-returned transaction ID, so the default link is not
used as the overlay entry point. Set it to the deployed site (for example the
`/checkout` page) on an approved domain; it should load Paddle.js if you also
send transaction links by email. If the default link is missing, checkout
returns `503` and no transaction is created.

### 6.7 Test in sandbox

1. Set `PADDLE_ENVIRONMENT=sandbox` and use sandbox price IDs, a sandbox API key
   and a sandbox notification secret.
2. Sign in on the site, open a product and choose **Open Paddle checkout**.
3. Complete a sandbox card payment. Paddle should deliver
   `transaction.completed` to the webhook.
4. Confirm a new row in `orders`, its `order_items`, and active
   `user_entitlements`; the buyer’s `/orders` and `/downloads` pages should show
   the purchase. For `complete-toolkit`, every included product should have an
   entitlement.
5. Replay the same webhook in Paddle or send a duplicate event. The order should
   not duplicate and no extra entitlements should appear.
6. An unsigned POST to the webhook should return `401` once the secret is set. A
   POST to `paddle-checkout` without a user session should return `401`.

A browser redirect after payment is not proof of payment. If a test payment does
not produce an order, inspect the Edge Function logs before changing the
database.

## 7. Smoke test

1. Build and deploy with the new values. `/status` should show
   **Account configuration: Configured**.
2. Open `/register`, create an account and follow the confirmation email.
3. Sign in, open `/forums/issues`, post a topic and delete it as its author.
4. Open `/account/tickets`, submit a ticket and confirm it appears in the
   private history.
5. After publishing a release, open `/downloads` with an account that has an
   active entitlement and click **Download**. The link should expire after 60
   seconds; an account without the entitlement should get a `403`.
6. Query the SQL editor to confirm RLS is on:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'forum_threads', 'products', 'product_bundle_items', 'product_releases',
    'release_assets', 'orders', 'order_items', 'user_entitlements', 'support_tickets'
  )
order by tablename;
```

Every row should have `rowsecurity = true`.

## What this setup does not connect

Authentication, the forum and support tickets work with the steps above. The
private bucket, entitlement check, signed-download function, Paddle checkout and
Paddle webhook are implemented. Live commerce still needs the operator steps in
section 6: secrets, price IDs, a notification destination and a default payment
link. The remaining delivery work is uploading real release files and
registering their `product_releases` and `release_assets` rows.

Do not add a browser insert policy for orders or entitlements to make a checkout
demo appear to work. Only the signed Paddle webhook calls `fulfill_paddle_order`;
the function is idempotent per transaction and runs with service-role-only
execute permission. The site never invents orders or licences.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| “Accounts are not connected on this build yet.” | The two `VITE_*` values were absent when that build was made. Restart `bun run dev` locally, or add the Actions variables and redeploy. |
| “Invalid API key” | Use the Project URL and publishable/anon key. Do not use the secret or `service_role` key in the browser. |
| Confirmation link goes to the wrong host | Add the exact origin to Supabase **Redirect URLs** and confirm the Site URL. |
| `relation "public.forum_threads" does not exist` | Run `supabase/schema.sql`. |
| Ticket query says storage is not ready | Run `supabase/marketplace.sql` and confirm the tables are in the `public` schema. |
| Posting returns `42501` | You are not signed in, or the board is announcements. Announcements are read-only for members; post issues as a signed-in account. |
| Email confirmation never arrives | Check spam and the Supabase auth logs; configure custom SMTP before public launch. |
| Download says no published release file | Upload a file to `product-releases` and register matching `product_releases` and `release_assets` rows. |
| Download returns 401 or 403 | Sign in again, then confirm the account has an active, unexpired `user_entitlements` row for that product. |
| Download works locally but not on a custom domain | Add that exact origin to `ALLOWED_ORIGINS` in the function and redeploy. |
| Checkout says “Checkout is not connected yet.” | Set `PADDLE_API_KEY` as a Supabase Edge Function secret and redeploy only if the function code changed. |
| Checkout says “Checkout is not configured for this product yet.” | Set `products.paddle_price_id` for that published product. |
| Checkout says “Paddle checkout is not ready for this store yet.” | Configure a default payment link in Paddle Checkout settings; otherwise Paddle returns no `checkout.url`. |
| Paddle webhook gets `401` before the function runs | Turn off Supabase **Verify JWT** for `paddle-webhook` only, or deploy it with `--no-verify-jwt`. |
| Webhook logs “A purchased price is not mapped to a product.” | The Paddle price ID is not in `products.paddle_price_id`; fix the mapping and replay the event. |
| Payment succeeds but no order appears | Check the Paddle notification destination is subscribed to `transaction.completed`, its secret matches `PADDLE_WEBHOOK_SECRET`, and inspect the Edge Function logs. |
| Paddle returns “authentication required” or a 403 | The API key and price IDs belong to different Paddle environments; use sandbox values together or production values together. |

## Secret rules

- Commit only `.env.example`, never `.env`.
- Keep `service_role` keys, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET` and
  database passwords out of the frontend, the repository and GitHub Actions
  configuration used for this static build.
- Paddle secrets belong in Supabase Edge Function secrets. Never prefix them
  with `VITE_` and never paste them into chat or a support ticket.
- The public anon/publishable key is safe in a browser; RLS is what protects the
  data. It is stored as an Actions variable, not a secret.
