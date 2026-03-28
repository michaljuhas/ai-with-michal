---
name: supabase-cli
description: Use when the user wants to query the Supabase database, list/manage auth users, interact with storage buckets, invoke edge functions, run SQL queries, inspect projects, or run PostgREST queries. Trigger on: "query database", "list users", "storage bucket", "invoke function", "run SQL", "supabase query", "check table".
---

# Supabase CLI

A lightweight CLI wrapper for the Supabase REST, Management, Auth, Storage, and Functions APIs.

**Entry point:** `scripts/supabase-cli/index.mjs`

## Prerequisites

The following env vars must be present in `.env`:

| Var | Required for |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | All commands |
| `SUPABASE_SERVICE_ROLE_KEY` | `rest`, `auth`, `storage`, `functions` |
| `SUPABASE_PAT` | `db`, `projects`, `functions list` |

`SUPABASE_PAT` is a personal access token from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) (starts with `sbp_...`).

## Quick Reference

| Resource | Example |
|----------|---------|
| Run SQL | `node --env-file=.env scripts/supabase-cli/index.mjs db query --sql "SELECT count(*) FROM registrations" --pretty` |
| List migrations | `node --env-file=.env scripts/supabase-cli/index.mjs db migrate list --pretty` |
| Query a table | `node --env-file=.env scripts/supabase-cli/index.mjs rest get registrations --limit 10 --pretty` |
| Filter rows | `node --env-file=.env scripts/supabase-cli/index.mjs rest get registrations --filter "source_type=eq.Paid" --pretty` |
| Insert a row | `node --env-file=.env scripts/supabase-cli/index.mjs rest post orders --data '{"status":"pending"}' --pretty` |
| Update rows | `node --env-file=.env scripts/supabase-cli/index.mjs rest patch orders --filter "id=eq.abc123" --data '{"status":"paid"}' --pretty` |
| Delete rows | `node --env-file=.env scripts/supabase-cli/index.mjs rest delete orders --filter "id=eq.abc123"` |
| Upsert | `node --env-file=.env scripts/supabase-cli/index.mjs rest upsert profiles --data '{"id":"u1","name":"Jane"}' --on-conflict id` |
| Call RPC | `node --env-file=.env scripts/supabase-cli/index.mjs rest rpc my_function --data '{"arg":"val"}' --pretty` |
| List auth users | `node --env-file=.env scripts/supabase-cli/index.mjs auth users list --pretty` |
| Get auth user | `node --env-file=.env scripts/supabase-cli/index.mjs auth users get <uuid> --pretty` |
| Create auth user | `node --env-file=.env scripts/supabase-cli/index.mjs auth users create --email user@example.com --password secret123 --pretty` |
| Delete auth user | `node --env-file=.env scripts/supabase-cli/index.mjs auth users delete <uuid>` |
| List buckets | `node --env-file=.env scripts/supabase-cli/index.mjs storage buckets list --pretty` |
| Create bucket | `node --env-file=.env scripts/supabase-cli/index.mjs storage buckets create my-bucket --public` |
| List files | `node --env-file=.env scripts/supabase-cli/index.mjs storage files list my-bucket --prefix images/ --pretty` |
| Delete file | `node --env-file=.env scripts/supabase-cli/index.mjs storage files delete my-bucket path/to/file.png` |
| List functions | `node --env-file=.env scripts/supabase-cli/index.mjs functions list --pretty` |
| Invoke function | `node --env-file=.env scripts/supabase-cli/index.mjs functions invoke hello-world --data '{"name":"World"}' --pretty` |
| List projects | `node --env-file=.env scripts/supabase-cli/index.mjs projects list --pretty` |
| Get project | `node --env-file=.env scripts/supabase-cli/index.mjs projects get dhnppoaejysrmpglqtvk --pretty` |

## Filter Syntax (PostgREST)

Filters follow the format `--filter "col=op.val"`:

| Operator | Meaning | Example |
|----------|---------|---------|
| `eq` | equals | `--filter "status=eq.paid"` |
| `neq` | not equals | `--filter "status=neq.cancelled"` |
| `gt` | greater than | `--filter "amount=gt.100"` |
| `gte` | greater than or equal | `--filter "created_at=gte.2026-01-01"` |
| `lt` | less than | `--filter "amount=lt.50"` |
| `lte` | less than or equal | `--filter "amount=lte.50"` |
| `like` | pattern match (case sensitive) | `--filter "email=like.*@gmail.com"` |
| `ilike` | pattern match (case insensitive) | `--filter "email=ilike.*@gmail.com"` |
| `in` | in list | `--filter "status=in.(paid,pending)"` |
| `is` | IS NULL / IS TRUE | `--filter "source_type=is.null"` |

## Output Modes

- Default: JSON (suitable for piping / further processing)
- `--pretty`: ASCII table (suitable for human reading in terminal)

## Common Workflows

### Check total registrations and paid count

```bash
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT count(*) AS total, count(*) FILTER (WHERE source_type IS NOT NULL) AS attributed FROM registrations" \
  --pretty
```

### List all storage buckets

```bash
node --env-file=.env scripts/supabase-cli/index.mjs storage buckets list --pretty
```

### Find a user by email

```bash
node --env-file=.env scripts/supabase-cli/index.mjs rest get registrations \
  --filter "email=eq.hello@example.com" \
  --pretty
```

### Invoke a webhook / Edge Function

```bash
node --env-file=.env scripts/supabase-cli/index.mjs functions invoke process-payment \
  --data '{"order_id":"abc123"}' \
  --pretty
```

### List all paid registrations

```bash
node --env-file=.env scripts/supabase-cli/index.mjs rest get registrations \
  --filter "source_type=eq.Paid" \
  --select "email,utm_campaign,source_detail,created_at" \
  --order "created_at.desc" \
  --pretty
```

### Apply a migration via SQL

```bash
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "ALTER TABLE registrations ADD COLUMN IF NOT EXISTS notes TEXT"
```

## Error Handling Notes

- Commands using `db`, `projects`, or `functions list` require `SUPABASE_PAT`. If missing, the CLI prints a clear error and exits.
- `--data` must be valid JSON. In shell, use single quotes around JSON: `--data '{"key":"value"}'`.
- RLS applies for PostgREST calls; the CLI uses the **service role key** which bypasses RLS.
- Non-2xx API responses throw a `SupabaseApiError` with the HTTP status and message printed to stderr.
