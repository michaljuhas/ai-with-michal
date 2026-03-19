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

# Daily morning report — runs automatically at 7:15am via LaunchAgent
# Collects Stripe + PostHog + Meta Ads data, analyses with Claude, saves to reports/YYYY-MM-DD.md, emails result
node --env-file=.env scripts/daily-report.mjs       # run manually / test now
bash scripts/install-launchagent.sh                  # one-time setup: schedule at 7:15am daily

# Campaign creative generator — creates a new campaigns/YYYY-MM-DD-HH-mm/ folder with:
#   copy.md / copy.json  — 5 headline + 5 primary text variations (via Claude)
#   square-1.png, square-2.png    — 1:1 images, two visual concepts (via Imagen 4)
#   portrait-1.png, portrait-2.png — 9:16 images, same two concepts
node --env-file=.env scripts/generate-campaign-assets.mjs                                        # default angle
node --env-file=.env scripts/generate-campaign-assets.mjs --focus "AI automation for recruiting"
node --env-file=.env scripts/generate-campaign-assets.mjs --focus "replacing manual sourcing with AI workflows"
node --env-file=.env scripts/generate-campaign-assets.mjs --focus "building talent pipelines on autopilot"
# Run every other day before creating new Meta Ads campaigns/ad sets.
# Portrait images are 9:16 — crop to 4:5 inside Meta Ads Manager at upload time.

# Launch a Meta Ads campaign from the most recent campaign assets folder.
# Creates: campaign (PAUSED) → ad set → uploads 4 images → 4 creatives + 4 ads.
# Review everything in Meta Ads Manager before activating.
node --env-file=.env scripts/launch-campaign.mjs                                     # uses most recent campaigns/ folder
node --env-file=.env scripts/launch-campaign.mjs --folder campaigns/2026-03-19-21-13 # specific folder
node --env-file=.env scripts/launch-campaign.mjs --dry-run                           # preview without creating
node --env-file=.env scripts/launch-campaign.mjs --budget 2000                       # €20/day (amount in cents, default €10)

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
Daily report AI analysis: `ANTHROPIC_API_KEY` (get from https://console.anthropic.com/settings/keys — required for AI-written reports; without it the report falls back to raw data).
Campaign generator: `ANTHROPIC_API_KEY` (copy generation) + `GEMINI_API_KEY` (image generation via Imagen 4) — both required.
