---
name: meta-ads-cli
description: Use when the user wants to interact with the Meta (Facebook) Ads API from the CLI — list campaigns, ad sets, ads, get performance insights, create or update campaigns, or delete campaigns using the local meta-ads-cli wrapper.
---

# Meta Ads CLI

A lightweight CLI wrapper for the Meta Marketing API v25.0. Run it with:

```bash
node --env-file=.env scripts/meta-ads/index.mjs <resource> <command> [options]
```

## Setup

Required environment variables (add to `.env`):

| Variable | Description | Example |
|---|---|---|
| `META_SYSTEM_USER_ACCESS_TOKEN` | System User Token (non-expiring, from Meta Business Manager) | `EAABwzLixnjYBO...` |
| `META_AD_ACCOUNT_ID` | Ad Account ID | `act_123456789` |

No build step needed — pure `.mjs`.

## Campaigns

```bash
# List all campaigns
node --env-file=.env scripts/meta-ads/index.mjs campaigns list

# List only active campaigns
node --env-file=.env scripts/meta-ads/index.mjs campaigns list --status ACTIVE

# Pretty table output
node --env-file=.env scripts/meta-ads/index.mjs campaigns list --pretty

# Get a specific campaign
node --env-file=.env scripts/meta-ads/index.mjs campaigns get <campaign-id>

# Create a campaign (status defaults to PAUSED)
node --env-file=.env scripts/meta-ads/index.mjs campaigns create --name "My Campaign" --objective OUTCOME_TRAFFIC

# Update a campaign
node --env-file=.env scripts/meta-ads/index.mjs campaigns update <campaign-id> --status ACTIVE --name "New Name"

# Delete a campaign
node --env-file=.env scripts/meta-ads/index.mjs campaigns delete <campaign-id>
```

## Ad Sets

```bash
# List ad sets under a campaign
node --env-file=.env scripts/meta-ads/index.mjs adsets list --campaign <campaign-id>

# Get a specific ad set
node --env-file=.env scripts/meta-ads/index.mjs adsets get <adset-id>
```

## Ads

```bash
# List all ads
node --env-file=.env scripts/meta-ads/index.mjs ads list

# Filter by campaign or ad set
node --env-file=.env scripts/meta-ads/index.mjs ads list --campaign <campaign-id>
node --env-file=.env scripts/meta-ads/index.mjs ads list --adset <adset-id>

# Get a specific ad
node --env-file=.env scripts/meta-ads/index.mjs ads get <ad-id>
```

## Insights (Performance Data)

`<object-id>` can be any campaign, ad set, or ad ID.

```bash
# Last 7 days (default)
node --env-file=.env scripts/meta-ads/index.mjs insights <object-id>

# Last 30 days
node --env-file=.env scripts/meta-ads/index.mjs insights <object-id> --preset last_30d

# Ad-level breakdown
node --env-file=.env scripts/meta-ads/index.mjs insights <object-id> --level ad

# Custom fields
node --env-file=.env scripts/meta-ads/index.mjs insights <object-id> --fields impressions,clicks,ctr,spend

# Pretty table
node --env-file=.env scripts/meta-ads/index.mjs insights <object-id> --pretty
```

## Valid Objectives

`OUTCOME_TRAFFIC`, `OUTCOME_SALES`, `OUTCOME_LEADS`, `OUTCOME_AWARENESS`, `OUTCOME_ENGAGEMENT`, `OUTCOME_APP_PROMOTION`

## Output Format

Default output is pretty-printed JSON (pipeable to `jq`):

```bash
node --env-file=.env scripts/meta-ads/index.mjs campaigns list | jq '.data[] | {id, name, status}'
```

Use `--pretty` for a human-readable ASCII table.

## Error Handling

Errors print to stderr:
```
[META ERROR] code=190 Invalid OAuth access token. (fbtrace_id: ABC123)
```

- Exit code `0` on success, `1` on error
- Rate limit warning printed to stderr when usage > 80%: `[META WARNING] Rate limit usage at 85%`

## Running Tests

```bash
# All unit tests
node --test 'scripts/meta-ads/tests/*.test.mjs'

# Integration tests only
node --test scripts/meta-ads/tests/integration.test.mjs
```
