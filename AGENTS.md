<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autonomous operation — workshop profitability

## Goal

Sell workshop tickets profitably before April 2, 2026. Full KPIs and strategy in `GOALS.md`.

## Always start here

```bash
node --env-file=.env scripts/status.mjs
```

This prints registrations, paid orders, revenue, conversion rate, spots remaining, and any action alerts.

## Available CLIs

```bash
# Health dashboard — run this first
node --env-file=.env scripts/status.mjs

# PostHog funnel — where people drop off
node --env-file=.env scripts/analytics.mjs

# Stripe revenue breakdown + active coupons
node --env-file=.env scripts/stripe-report.mjs

# Email reminders to all paid attendees
node --env-file=.env scripts/send-reminders.mjs                   # 1-week reminder
node --env-file=.env scripts/send-reminders.mjs --type=dayBefore  # day-before
node --env-file=.env scripts/send-reminders.mjs --type=dayOf      # day-of (1 hour before)
node --env-file=.env scripts/send-reminders.mjs --dry-run         # preview without sending

# PostHog CLI (analytics queries, feature flags, etc.)
scripts/posthog-cli/bin/posthog-cli --help

# Meta Ads CLI — list/create/update/delete campaigns, ad sets, ads, and insights
node --env-file=.env scripts/meta-ads/index.mjs campaigns list --pretty
node --env-file=.env scripts/meta-ads/index.mjs campaigns list --status ACTIVE
node --env-file=.env scripts/meta-ads/index.mjs insights <campaign-id> --preset last_7d --pretty
# Full usage: node --env-file=.env scripts/meta-ads/index.mjs --help (or see .claude/skills/meta-ads-cli.md)

# Deploy: git add + commit + push to main
./scripts/deploy.sh "your commit message"
```

## Key URLs

- Homepage: https://aiwithmichal.com
- Admin dashboard: https://aiwithmichal.com/admin (requires login as hello@aiwithmichal.com)
- Referral links: append `?ref=<source>` to any URL — tracked in PostHog

## Decision playbook

| Situation | Action |
|-----------|--------|
| Conversion < 2% | Run analytics.mjs → find drop-off → fix copy or add promo code |
| Pro mix < 40% | Strengthen Pro tier benefits on /tickets or /pricing |
| Spots < 15 | Urgency is already shown on /tickets; push on social |
| 1 week before | Run send-reminders.mjs (week reminder) |
| 1 day before | Run send-reminders.mjs --type=dayBefore |
| Day of | Run send-reminders.mjs --type=dayOf |
| Need promo code | Create in Stripe dashboard — checkout already has allow_promotion_codes: true |

## Environment variables

See `.env.local.example` for all variables.
Key ones for scripts: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
`SENDGRID_API_KEY`, `POSTHOG_PERSONAL_API_KEY`, `POSTHOG_PROJECT_ID`, `WORKSHOP_CAPACITY` (default 50),
`ADMIN_EMAIL` (default michal@michaljuhas.com), `WORKSHOP_MEETING_URL`.
Meta Ads CLI: `META_SYSTEM_USER_ACCESS_TOKEN` (System User Token from Meta Business Manager), `META_AD_ACCOUNT_ID` (e.g. `act_123456789`).
