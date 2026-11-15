# Paddle MCP and skills

This repository uses Paddle Billing for checkout and fulfillment. The Paddle
account-level MCP server is configured in [`.mcp.json`](.mcp.json), and the
official Paddle agent skills are installed under `.agents/skills/`.

The MCP is for catalog and account operations. It does **not** replace the
server-side checkout or the signature-verified webhook described in
[`SUPABASE-SETUP.md`](SUPABASE-SETUP.md).

## What is installed

- `.agents/skills/` — 12 official Paddle skills from
  <https://developer.paddle.com/>.
- `skills-lock.json` — source and integrity hashes for those skills.
- `.mcp.json` — two HTTP MCP servers:
  - `paddle-sandbox` — `https://sandbox-mcp.paddle.com/mcp`
  - `paddle-live` — `https://mcp.paddle.com/mcp`

The most relevant skills for this project are `paddle-catalog-setup`,
`paddle-onboarding`, `paddle-sandbox-testing`, `paddle-webhooks` and
`paddle-checkout-web`. They are written with Next.js examples, but the Paddle
API behavior and security rules apply to this Vite/Supabase app too.

## Authenticate

### Sandbox

Create a **sandbox** API key in Paddle at **My account → Settings →
Authentication → API keys**. It starts with `pdl_sdbx_`.

For the first catalog setup, grant at least:

- `product.read` and `product.write`
- `price.read` and `price.write`

Add read permissions for the areas you want the onboarding audit to inspect:
`account.read`, `client_token.read`, `checkout_settings.read`,
`notification_setting.read`, `balance_currency.read`, `tax_settings.read`.
Add the matching `*.write` permissions only when you intend to make changes.

Export the key in the shell that launches your MCP client. Do not put it in
`.mcp.json`, `.env.example`, GitHub Actions or a committed file:

```sh
export PADDLE_SANDBOX_API_KEY="pdl_sdbx_…"
```

The client expands `${PADDLE_SANDBOX_API_KEY}` in `.mcp.json` when it starts the
server. Restart the client after changing the variable.

### Live

`paddle-live` uses Paddle OAuth. The client opens a browser authorization flow;
start with read-only access and grant writes only when needed. A live API key
can be used instead if your client supports it, but keep it in the client's
secret store or an environment variable. Never commit it.

## Connect a client

### Claude Code

Claude Code reads project `.mcp.json` files. Open this repository, approve the
project MCP servers when prompted, then run `/mcp` to check that
`paddle-sandbox` and `paddle-live` are connected.

### Cursor

Cursor uses the same `mcpServers` shape but expands environment variables with
`${env:NAME}`. Create `.cursor/mcp.json` (or edit the global Cursor MCP
settings) with:

```json
{
  "mcpServers": {
    "paddle-sandbox": {
      "type": "http",
      "url": "https://sandbox-mcp.paddle.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:PADDLE_SANDBOX_API_KEY}"
      }
    },
    "paddle-live": {
      "type": "http",
      "url": "https://mcp.paddle.com/mcp"
    }
  }
}
```

Once connected, the server exposes `search`, `execute` and
`report_missing_tool`.

### VS Code

VS Code uses a `servers` key and input prompts. Create `.vscode/mcp.json`
(do not commit a key) with:

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "paddle-sandbox-key",
      "description": "Paddle sandbox API key",
      "password": true
    }
  ],
  "servers": {
    "paddle-sandbox": {
      "type": "http",
      "url": "https://sandbox-mcp.paddle.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:paddle-sandbox-key}"
      }
    },
    "paddle-live": {
      "type": "http",
      "url": "https://mcp.paddle.com/mcp"
    }
  }
}
```

VS Code prompts for the sandbox key when the server starts and stores it
securely rather than writing it into the file.

### Codex CLI

```sh
codex mcp add paddle-sandbox \
  --url https://sandbox-mcp.paddle.com/mcp \
  --bearer-token-env-var PADDLE_SANDBOX_API_KEY
codex mcp add paddle-live --url https://mcp.paddle.com/mcp
```

### This cloud chat

This chat has no MCP client connection, so it cannot call the Paddle MCP tools
directly. Run the MCP-enabled client on a machine where you can complete the
Paddle login, or use the Paddle dashboard/API. The deployed checkout does not
depend on MCP; it only needs the Supabase secrets and mapped price IDs.

## First sandbox setup

Use the `paddle-catalog-setup` skill in your MCP-enabled client. The catalog
must match the storefront: one **one-time** EUR price per published product.
Do not add a billing cycle or trial to these prices.

Suggested prompt after the sandbox MCP is connected:

```text
Use the paddle-sandbox MCP and the paddle-catalog-setup skill. Create one
Paddle product per row below with tax_category "standard" in the sandbox
account, then create one one-time EUR price per product. Use the launch amount
shown as EUR and convert it to cents (for example 16.00 EUR is "1600"), omit
billing_cycle and trial_period, and return every product ID and price ID as a
slug -> pri_… mapping. Confirm each product and price after creation. Do not
create anything in live.

fivem-external | FiveM External | 16.00
fivem-internal | FiveM Internal | 24.00
fivem-aim | FiveM Aim | 12.00
fivem-visuals | FiveM Visuals | 14.00
fivem-lua | FiveM Lua | 12.00
fivem-script-hub | FiveM Script Hub | 20.00
roblox-executor | Roblox Executor | 16.00
roblox-aim | Roblox Aim | 12.00
roblox-visuals | Roblox Visuals | 14.00
roblox-script-hub | Roblox Script Hub | 20.00
roblox-mod-menu | Roblox Mod Menu | 24.00
roblox-external | Roblox External | 20.00
stream-proof | Stream Proof | 8.00
cloud-configs | Cloud Configs | 6.00
complete-toolkit | 404 Complete | 56.00
```

Amounts are in cents, so `16.00` EUR is `"1600"` in the Paddle API. These are
the launch prices in `src/data.ts`; if you change `LAUNCH`, create the amounts
customers should actually pay.

After the agent returns the `pri_…` IDs, put them into the SQL mapping in
[`SUPABASE-SETUP.md` §6.2](SUPABASE-SETUP.md#62-map-price-ids). A sandbox price
ID only works with sandbox checkout; do not mix it with live credentials.

Then use `paddle-sandbox-testing` to test a purchase with a Paddle test card.
The success condition is not the checkout overlay; it is a
`transaction.completed` webhook creating an order, its licence row and linked
entitlements, with a duplicate delivery remaining idempotent.

## Security rules

- Keep the sandbox API key and webhook secret server-side or in the MCP
  client's secret store. Never place either in a `VITE_*` variable.
- The Paddle **client-side token** is public by design and belongs only in
  `VITE_PADDLE_CLIENT_TOKEN` / the Pages `PADDLE_CLIENT_TOKEN` variable.
- Never let a browser choose a price ID, product ID or customer ID for
  checkout. `paddle-checkout` resolves those on the server.
- Only the signed `transaction.completed` webhook creates licences and entitlements.
- Use sandbox first. Live writes require an explicit confirmation and should
  be limited to the specific change requested.
