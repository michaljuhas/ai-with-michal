# Lemlist CLI

Lightweight Lemlist API CLI wrapper. Pure ESM, no external dependencies. Auth uses HTTP Basic.

```
node --env-file=.env scripts/lemlist/index.mjs <resource> <subcommand> [flags]
```

## Setup

Add your API key to `.env`:

```
LEMLIST_API_KEY=your_key_here
```

Get it from Lemlist → Profile → Settings → Integrations.

Auth note: the Lemlist API uses HTTP Basic auth with an empty username and your API key as the password (`Basic base64(:KEY)`).

## Running tests

```bash
node --test 'scripts/lemlist/__tests__/*.test.mjs'
```

## Command reference

| Resource | Subcommand | Required args | Optional flags |
|---|---|---|---|
| campaigns | list | — | --status, --sort-by, --sort-order, --limit, --offset, --pretty |
| campaigns | get | `<campaign-id>` | --pretty |
| campaigns | create | --name | --pretty |
| campaigns | duplicate | `<campaign-id>` | --pretty |
| campaigns | start | `<campaign-id>` | --pretty |
| campaigns | pause | `<campaign-id>` | --pretty |
| campaigns | stats | `<campaign-id>` | --from (ISO date), --to (ISO date), --pretty |
| campaigns | reports | `<campaign-id>` | --pretty |
| leads | list | --campaign-id | --limit, --offset, --pretty |
| leads | get | `<email>` | --pretty |
| leads | create | --campaign-id, --email | --first-name, --last-name, --company-name, --job-title, --linkedin-url, --phone, --deduplicate, --pretty |
| leads | update | --campaign-id, `<lead-id>` | --first-name, --last-name, --company-name, --job-title, --pretty |
| leads | delete | --campaign-id, `<lead-id>` | --pretty |
| leads | pause | --campaign-id, `<lead-id>` | --pretty |
| leads | resume | --campaign-id, `<lead-id>` | --pretty |
| leads | interested | --campaign-id, `<lead-id>` | --pretty |
| leads | not-interested | --campaign-id, `<lead-id>` | --pretty |
| contacts | upsert | --json or --file | --pretty |
| contacts | list | — | --limit, --offset, --pretty |
| contacts | get | `<contact-id>` | --pretty |
| activities | list | — | --type, --campaign-id, --lead-id, --limit, --offset, --pretty |
| unsubscribes | list | — | --limit, --offset, --pretty |
| unsubscribes | add | --email | --pretty |
| unsubscribes | remove | --email | --pretty |
| webhooks | list | — | --pretty |
| webhooks | create | --url | --events (csv), --pretty |
| webhooks | delete | `<hook-id>` | --pretty |
| team | info | — | --pretty |
| team | credits | — | --pretty |
| team | senders | — | --pretty |
| schedules | list | — | --pretty |
| schedules | get | `<schedule-id>` | --pretty |
| schedules | create | --json or --file | --pretty |
| schedules | update | `<schedule-id>`, --json or --file | --pretty |
| schedules | delete | `<schedule-id>` | --pretty |

## Notable API quirks

- **Rate limit:** 20 requests / 2 seconds. The CLI retries once on 429 using the `Retry-After` header.
- **Versioning:** Some endpoints require `?version=v2` (campaigns list, activities, lead get) or a `/v2/` prefix (unsubscribes). Handled automatically by the client.
- **Auth gotcha:** HTTP Basic, not Bearer. Header is `Basic base64(:KEY)` — empty username, key as password.
- **Lead in graveyard:** A `500` response with body `"Lead in graveyard"` means the lead was soft-deleted. The CLI exits with code 1 and a clear message.
- **Contact errors:** The contacts API returns JSON error bodies with codes such as `MISSING_IDENTIFIER` and `INVALID_EMAIL`.

## Official API docs

https://developer.lemlist.com/api-reference/getting-started/overview
