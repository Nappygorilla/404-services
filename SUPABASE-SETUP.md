# Supabase setup

This is the backend runbook for accounts, the issues forum and support tickets.
The storefront catalogue itself is static; it does not need a database.

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

Fill both values in `.env`, then restart the dev server:

```sh
bun run dev
```

The site reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build time.
Vite's local dev server is on `http://localhost:5305/`.

### GitHub Pages

In [the repository's Actions variables](https://github.com/Nappygorilla/404-services/settings/variables/actions)
(**Settings → Secrets and variables → Actions → Variables**), add:

- `SUPABASE_URL` — the Project URL
- `SUPABASE_ANON_KEY` — the publishable or anon key

These are public browser values, so repository variables are appropriate. The
Pages workflow maps them to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
during the build. Re-run the **Deploy to GitHub Pages** workflow after changing
them; editing a variable does not rebuild an existing deployment automatically.

## 3. Create the database objects

Open **SQL Editor** and run these in order:

1. `supabase/schema.sql` — forum threads and their public/author policies.
2. `supabase/marketplace.sql` — products, releases, orders, entitlements and
   support tickets.

The files are idempotent for tables, indexes and policies, so they can be run
again to repair a partial setup. They must still be run in that order on a fresh
project.

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

## 5. Smoke test

1. Build and deploy with the new values. `/status` should show
   **Account configuration: Configured**.
2. Open `/register`, create an account and follow the confirmation email.
3. Sign in, open `/forums/issues`, post a topic and delete it as its author.
4. Open `/account/tickets`, submit a ticket and confirm it appears in the
   private history.
5. Query the SQL editor to confirm RLS is on:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'forum_threads', 'products', 'product_releases', 'release_assets',
    'orders', 'order_items', 'user_entitlements', 'support_tickets'
  )
order by tablename;
```

Every row should have `rowsecurity = true`.

## What this setup does not connect

Authentication, the forum and support tickets work with the steps above.
Payments, verified order creation, entitlement issuance and private download
delivery are still server-side work. Do not add a browser insert policy for
orders or entitlements to make a checkout demo appear to work.

The site labels checkout, secure downloads and commerce as not connected until
those workflows exist. That is intentional.

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

## Secret rules

- Commit only `.env.example`, never `.env`.
- Keep `service_role` keys and database passwords out of the frontend, the
  repository and GitHub Actions configuration used for this static build.
- The public anon/publishable key is safe in a browser; RLS is what protects the
  data. It is stored as an Actions variable, not a secret.
