---
name: lemlist-cli
description: Use when interacting with Lemlist via the CLI at scripts/lemlist/index.mjs. Covers campaigns, leads, contacts, activities, unsubscribes, webhooks, team, and schedules.
---

# Lemlist CLI

```bash
node --env-file=.env scripts/lemlist/index.mjs <resource> <subcommand> [flags]
```

## Setup / Authentication

Required environment variable (add to `.env`):

| Variable | Description |
|---|---|
| `LEMLIST_API_KEY` | API key — get from lemlist app → Profile → Settings → Integrations |

**Auth method: HTTP Basic, not Bearer.** The `Authorization` header is `Basic base64(:KEY)` where the username is empty and the API key is the password. The CLI constructs this automatically — never pass a Bearer token.

**Security:** never paste keys into chat. Store them in `.env` (gitignored).

---

## Command Reference

### campaigns

```bash
# List campaigns (supports optional filters)
# --status: running | paused | draft | ended | archived | errors
# --sort-by / --sort-order: field name and asc|desc
# --created-by: filter by creator user ID
node --env-file=.env scripts/lemlist/index.mjs campaigns list [--status running|paused|draft|ended|archived|errors] [--sort-by <field>] [--sort-order asc|desc] [--created-by <user-id>] [--limit N] [--offset N]

# Get a single campaign by ID (prefix: cam_)
node --env-file=.env scripts/lemlist/index.mjs campaigns get <campaign-id>

# Create a new campaign (returns the created campaign object)
node --env-file=.env scripts/lemlist/index.mjs campaigns create --name "Campaign name"

# Duplicate an existing campaign
node --env-file=.env scripts/lemlist/index.mjs campaigns duplicate <campaign-id>

# Start a paused or draft campaign
node --env-file=.env scripts/lemlist/index.mjs campaigns start <campaign-id>

# Pause a running campaign
node --env-file=.env scripts/lemlist/index.mjs campaigns pause <campaign-id>

# Get campaign performance stats (date range optional but recommended)
# --from / --to: ISO date strings e.g. 2026-01-01
node --env-file=.env scripts/lemlist/index.mjs campaigns stats <campaign-id> --from 2026-01-01 --to 2026-03-31

# Get reports for a campaign
node --env-file=.env scripts/lemlist/index.mjs campaigns reports <campaign-id>
```

### leads

```bash
# List leads in a campaign (--campaign-id required)
node --env-file=.env scripts/lemlist/index.mjs leads list --campaign-id <id> [--limit N] [--offset N]

# Get a lead by email address (v2 query — returns across all campaigns)
node --env-file=.env scripts/lemlist/index.mjs leads get <email>

# Add a lead to a campaign
# --email required; all other fields optional
# --deduplicate: skip if lead already exists in this campaign (boolean flag)
node --env-file=.env scripts/lemlist/index.mjs leads create --campaign-id <id> --email <email> [--first-name <n>] [--last-name <n>] [--company-name <n>] [--job-title <t>] [--linkedin-url <u>] [--phone <p>] [--deduplicate]

# Update a lead's fields (lead-id is the internal ID, not email)
node --env-file=.env scripts/lemlist/index.mjs leads update <lead-id> --campaign-id <id> [--first-name <n>] [--last-name <n>] [--company-name <n>] [--job-title <t>] [--linkedin-url <u>] [--phone <p>]

# Remove a lead from a campaign permanently
node --env-file=.env scripts/lemlist/index.mjs leads delete <lead-id> --campaign-id <id>

# Pause outreach to a lead (sequences stop; lead stays in campaign)
node --env-file=.env scripts/lemlist/index.mjs leads pause <lead-id> --campaign-id <id>

# Resume outreach to a paused lead
node --env-file=.env scripts/lemlist/index.mjs leads resume <lead-id> --campaign-id <id>

# Mark a lead as interested (positive signal; pauses further outreach)
node --env-file=.env scripts/lemlist/index.mjs leads interested <lead-id> --campaign-id <id>

# Mark a lead as not interested
node --env-file=.env scripts/lemlist/index.mjs leads not-interested <lead-id> --campaign-id <id>
```

### contacts

```bash
# Upsert a contact (create or update by email or linkedinUrl)
# Pass data inline with --json or from a file with --file
# Returns { created: true } on first call, { updated: true } on subsequent calls
node --env-file=.env scripts/lemlist/index.mjs contacts upsert --json '{"email":"alex@example.com","firstName":"Alex"}'
node --env-file=.env scripts/lemlist/index.mjs contacts upsert --file ./contact.json

# List all contacts (paginated)
node --env-file=.env scripts/lemlist/index.mjs contacts list [--limit N] [--offset N]

# Get a single contact by ID
node --env-file=.env scripts/lemlist/index.mjs contacts get <contact-id>
```

### activities

```bash
# List activities with optional filters
# --type: emailSent | emailOpened | emailClicked | emailReplied | linkedinVisited | linkedinMessageSent | etc.
# --campaign-id: filter to a specific campaign
# --lead-id: filter to a specific lead
node --env-file=.env scripts/lemlist/index.mjs activities list [--type <type>] [--campaign-id <id>] [--lead-id <id>] [--limit N] [--offset N]
```

### unsubscribes

```bash
# List all unsubscribed values (emails, domains, LinkedIn URLs, phone numbers) — uses /v2/ path
node --env-file=.env scripts/lemlist/index.mjs unsubscribes list [--limit N] [--offset N]

# Add a value to the unsubscribe list (idempotent — safe to call multiple times)
# Accepts email, domain (@example.com), LinkedIn URL, or phone number
node --env-file=.env scripts/lemlist/index.mjs unsubscribes add --email <value>

# Remove a value from the unsubscribe list (re-subscribe)
node --env-file=.env scripts/lemlist/index.mjs unsubscribes remove --email <value>
```

### webhooks

```bash
# List all configured webhooks
node --env-file=.env scripts/lemlist/index.mjs webhooks list

# Create a webhook
# --url: publicly reachable HTTPS endpoint (required)
# --events: comma-separated event type(s) — e.g. emailReplied,leadInterested
node --env-file=.env scripts/lemlist/index.mjs webhooks create --url https://example.com/hook [--events emailReplied,leadInterested]

# Delete a webhook by ID
node --env-file=.env scripts/lemlist/index.mjs webhooks delete <hook-id>
```

### team

```bash
# Fetch team info (name, plan, member list)
node --env-file=.env scripts/lemlist/index.mjs team info

# Fetch enrichment credit balance
node --env-file=.env scripts/lemlist/index.mjs team credits

# List sending email addresses configured in the team
node --env-file=.env scripts/lemlist/index.mjs team senders
```

### schedules

```bash
# List all sending schedules
node --env-file=.env scripts/lemlist/index.mjs schedules list

# Get a single schedule by ID
node --env-file=.env scripts/lemlist/index.mjs schedules get <schedule-id>

# Create a new schedule (pass JSON inline or from file)
node --env-file=.env scripts/lemlist/index.mjs schedules create --json '{"name":"Weekdays","timezone":"Europe/Berlin","days":{"MON":{"start":"09:00","end":"18:00"}}}'
node --env-file=.env scripts/lemlist/index.mjs schedules create --file ./schedule.json

# Update an existing schedule
node --env-file=.env scripts/lemlist/index.mjs schedules update <schedule-id> --json '{"name":"Updated name"}'
node --env-file=.env scripts/lemlist/index.mjs schedules update <schedule-id> --file ./schedule.json

# Delete a schedule
node --env-file=.env scripts/lemlist/index.mjs schedules delete <schedule-id>
```

### Global flags

| Flag | Description |
|---|---|
| `--pretty` | Human-readable indented JSON output (default: compact JSON) |
| `--help`, `-h` | Show usage |

---

## Common Examples

```bash
# List all active campaigns
node --env-file=.env scripts/lemlist/index.mjs campaigns list --status running --pretty

# Add a lead to a campaign, skip if already present
node --env-file=.env scripts/lemlist/index.mjs leads create \
  --campaign-id cam_abc123 \
  --email jane@example.com \
  --first-name Jane \
  --last-name Smith \
  --company-name Acme \
  --deduplicate

# Mark a lead as interested (stops further outreach automatically)
node --env-file=.env scripts/lemlist/index.mjs leads interested lea_xyz789 --campaign-id cam_abc123

# Check whether an email is on the unsubscribe list, then add it if needed
node --env-file=.env scripts/lemlist/index.mjs unsubscribes list --pretty
node --env-file=.env scripts/lemlist/index.mjs unsubscribes add --email optout@example.com

# Create a webhook to receive email reply notifications
node --env-file=.env scripts/lemlist/index.mjs webhooks create \
  --url https://hooks.example.com/lemlist \
  --events emailReplied

# Check remaining enrichment credits before a bulk import
node --env-file=.env scripts/lemlist/index.mjs team credits --pretty

# Upsert a contact record (idempotent — safe to run repeatedly)
node --env-file=.env scripts/lemlist/index.mjs contacts upsert \
  --json '{"email":"alex@example.com","firstName":"Alex","lastName":"Chen"}'

# Get campaign performance for Q1 2026
node --env-file=.env scripts/lemlist/index.mjs campaigns stats cam_abc123 \
  --from 2026-01-01 --to 2026-03-31 --pretty
```

---

## Error Handling & Troubleshooting

### Output format

- **Success:** JSON to stdout — compact by default, `--pretty` for readable/indented
- **Errors:** written to stderr as `Error [status] (code): message`
- **Exit codes:** `0` success, `1` error

### Rate limiting

Lemlist allows **20 requests per 2 seconds**. The CLI automatically retries once after the `retry-after` delay on a `429` response. For bulk lead imports, add a short sleep between requests to avoid repeated throttling.

### Common errors

| Situation | Message | Fix |
|---|---|---|
| Missing API key | `LEMLIST_API_KEY is not set in environment` | Add `LEMLIST_API_KEY` to `.env` |
| Campaign not found | `Campaign not found` (404) | Verify the campaign ID starts with `cam_` |
| Lead in graveyard | `Lead in graveyard` (500) + graveyard note on stderr | Lead was soft-deleted; it cannot be retrieved or reused |
| Missing identifier | `MISSING_IDENTIFIER` code | For `contacts upsert`, provide at least `email` or `linkedinUrl` in the JSON payload |
| JSON parse failure | `Unexpected token …` | Check that `--json` value is valid JSON; prefer `--file` for complex payloads |

---

## Gotchas

- **Basic auth, not Bearer** — the single most common mistake when debugging raw requests. The `Authorization` header must be `Basic base64(:KEY)` (empty username, API key as password). The CLI handles this correctly.
- **v2 versioning** — `campaigns list`, `activities list`, and `leads get` require `?version=v2` appended to the URL; `unsubscribes` use the `/v2/` path prefix. All handled automatically by the client.
- **Lead in graveyard** — a `500` response with body `"Lead in graveyard"` is not a server crash. It means the lead was soft-deleted and cannot be retrieved. The CLI prints an explanatory note to stderr alongside the error.
- **Contact upsert is idempotent** — returns `{ created: true }` on the first call and `{ updated: true }` on subsequent calls with the same identifier.
- **`--json` vs `--file`** — both `contacts upsert` and `schedules create`/`update` accept either `--json '{"key":"value"}'` (inline) or `--file ./path.json` (from disk). Use `--file` for multi-field payloads to avoid shell quoting issues.
- **`sequenceStep` is zero-indexed** in activity responses — step 1 of a sequence appears as `sequenceStep: 0`.
- **`unsubscribes add` accepts any identifier** — not just emails. You can pass a domain (`@example.com`), a LinkedIn URL, or a phone number. The flag is named `--email` for brevity but the value is forwarded as-is.
- **`campaigns stats` date parameters** — the API maps `--from` to `startDate` and `--to` to `endDate`. Omitting them is allowed but the API may return incomplete data; always supply a date range for reliable stats.

---

## Cross-links

- `scripts/lemlist/README.md` — developer/contributor guide
- Official Lemlist API docs: https://developer.lemlist.com/api-reference/getting-started/overview
