---
name: posthog-cli
description: Use when the user wants to interact with the PostHog API from the CLI — list events, manage feature flags, query persons, run HogQL queries, manage insights, dashboards, annotations, cohorts, or list projects using the local posthog-cli wrapper.
---

# posthog-cli

A lightweight CLI wrapper for the PostHog API at `/Users/michaljuhas/Projects/ai-with-michal/scripts/posthog-cli/`.

## Setup

```bash
cd scripts/posthog-cli && npm install
cd scripts/posthog-cli && npm run build
cd scripts/posthog-cli && npm test
```

Set credentials:
```bash
export POSTHOG_PERSONAL_API_KEY=phx_...
export POSTHOG_PROJECT_ID=12345
export POSTHOG_HOST=https://us.posthog.com   # optional, US is default
```

Or persist to `~/.posthog-cli/config.json`:
```bash
node scripts/posthog-cli/dist/index.js config set personalApiKey phx_...
node scripts/posthog-cli/dist/index.js config set projectId 12345
```

## Running the CLI

```bash
node scripts/posthog-cli/dist/index.js [global-options] <resource> <command> [flags]
```

**Global options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--api-key <key>` | Override POSTHOG_PERSONAL_API_KEY | env/config |
| `--project-id <id>` | Override POSTHOG_PROJECT_ID | env/config |
| `--host <url>` | PostHog host | `https://us.posthog.com` |
| `--format <format>` | `json` or `table` | `json` |

---

## Events (read-only)

```bash
node scripts/posthog-cli/dist/index.js events list
node scripts/posthog-cli/dist/index.js events list --event pageview --limit 20
node scripts/posthog-cli/dist/index.js events list --distinct-id user_123
node scripts/posthog-cli/dist/index.js events list --after 2026-01-01T00:00:00Z
```

## Feature Flags

```bash
# List
node scripts/posthog-cli/dist/index.js flags list
node scripts/posthog-cli/dist/index.js flags list --search beta

# Get
node scripts/posthog-cli/dist/index.js flags get 42

# Create
node scripts/posthog-cli/dist/index.js flags create --name "Beta Feature" --key beta-feature --rollout 50
node scripts/posthog-cli/dist/index.js flags create --name "Dark Mode" --key dark-mode --disabled

# Update
node scripts/posthog-cli/dist/index.js flags update 42 --enable
node scripts/posthog-cli/dist/index.js flags update 42 --disable
node scripts/posthog-cli/dist/index.js flags update 42 --name "New Name"

# Delete
node scripts/posthog-cli/dist/index.js flags delete 42
```

## Persons

```bash
node scripts/posthog-cli/dist/index.js persons list
node scripts/posthog-cli/dist/index.js persons list --search alice@example.com
node scripts/posthog-cli/dist/index.js persons list --distinct-id usr_abc
node scripts/posthog-cli/dist/index.js persons get 7
node scripts/posthog-cli/dist/index.js persons delete 7
```

## HogQL Query

```bash
node scripts/posthog-cli/dist/index.js query run --sql "SELECT event, count() FROM events GROUP BY event ORDER BY count() DESC LIMIT 10"
node scripts/posthog-cli/dist/index.js query run --sql "SELECT distinct_id, properties.\$browser FROM events WHERE event = 'pageview' LIMIT 5"
```

## Insights

```bash
node scripts/posthog-cli/dist/index.js insights list
node scripts/posthog-cli/dist/index.js insights list --search "DAU"
node scripts/posthog-cli/dist/index.js insights get 100
node scripts/posthog-cli/dist/index.js insights create --name "Daily Active Users"
node scripts/posthog-cli/dist/index.js insights update 100 --name "DAU Trend"
node scripts/posthog-cli/dist/index.js insights delete 100
```

## Dashboards

```bash
node scripts/posthog-cli/dist/index.js dashboards list
node scripts/posthog-cli/dist/index.js dashboards get 5
node scripts/posthog-cli/dist/index.js dashboards create --name "Product KPIs" --description "Key metrics"
node scripts/posthog-cli/dist/index.js dashboards update 5 --name "Renamed"
node scripts/posthog-cli/dist/index.js dashboards delete 5
```

## Annotations

```bash
node scripts/posthog-cli/dist/index.js annotations list
node scripts/posthog-cli/dist/index.js annotations create --content "Deploy v2.0" --date 2026-03-19T12:00:00Z
node scripts/posthog-cli/dist/index.js annotations update 3 --content "Deploy v2.1"
node scripts/posthog-cli/dist/index.js annotations delete 3
```

## Cohorts

```bash
node scripts/posthog-cli/dist/index.js cohorts list
node scripts/posthog-cli/dist/index.js cohorts get 8
node scripts/posthog-cli/dist/index.js cohorts create --name "Power Users"
node scripts/posthog-cli/dist/index.js cohorts create --name "Churned" --data '{"filters":{"properties":{"type":"OR","values":[]}}}'
node scripts/posthog-cli/dist/index.js cohorts update 8 --name "Super Users"
node scripts/posthog-cli/dist/index.js cohorts delete 8
```

## Projects (read-only)

```bash
node scripts/posthog-cli/dist/index.js projects list
node scripts/posthog-cli/dist/index.js projects get 12345
```

---

## Output Formats

```bash
# Default: pretty-printed JSON (pipeable to jq)
node scripts/posthog-cli/dist/index.js flags list | jq '.results[] | {id, key, active}'

# Table format
node scripts/posthog-cli/dist/index.js flags list --format table
```

## Error Handling

Errors print to stderr:
```
[CONFIG ERROR] POSTHOG_PERSONAL_API_KEY is required.
[API ERROR] status=404 Not found.
[ERROR] message
```

Exit code `1` on error, `0` on success.

## Complex Params

Use `--data <json>` for nested params not covered by named flags:
```bash
node scripts/posthog-cli/dist/index.js flags create --name "Geo Flag" --key geo-flag \
  --data '{"filters":{"groups":[{"properties":[{"key":"$geoip_country_code","value":"US"}],"rollout_percentage":100}]}}'
```

## Config File Location

`~/.posthog-cli/config.json` — JSON with keys: `personalApiKey`, `projectId`, `host`.
