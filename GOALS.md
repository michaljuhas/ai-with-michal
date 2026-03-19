# Workshop Goals

**Event:** Build AI-Powered Talent Pools Outside LinkedIn
**Date:** April 2, 2026 · 3:00 PM – 4:30 PM UTC
**Revenue targets:** €3,000 minimum · €5,000 stretch

## KPIs

| Metric | Target | Stretch |
|--------|--------|---------|
| Paid tickets | 30 | 50 |
| Revenue | €3,000 | €5,000 |
| Conversion (visitors → paid) | 3% | 5% |
| Pro tier mix | 50% | 65% |
| Email open rate (reminders) | 45% | 60% |

## Ticket prices

- Basic (Workshop Ticket): €79
- Pro (Workshop + Toolkit): €129 — push this tier
- Capacity: 50 spots (enforced in checkout)

## Levers to pull (in order of impact)

1. **Promo codes** — create in Stripe dashboard, share in targeted outreach
   - `EARLY20` — 20% off for first 10 buyers
   - `TEAM10` — 10% off for groups/referrals
2. **Urgency messaging** — "X spots left" shown on /tickets when <15 remaining
3. **Email reminders** — run `node --env-file=.env scripts/send-reminders.mjs`
4. **Referral links** — share `?ref=<source>` links, tracked in PostHog
5. **Social proof** — live attendee count on homepage

## Claude Code autonomous operation

Run these CLIs to monitor and act:

```bash
# Check current status (revenue, signups, conversion rate)
node --env-file=.env scripts/status.mjs

# Check PostHog funnel (where people drop off)
node --env-file=.env scripts/analytics.mjs

# Check Stripe revenue breakdown
node --env-file=.env scripts/stripe-report.mjs

# Send reminder emails to all paid attendees
node --env-file=.env scripts/send-reminders.mjs

# Deploy changes (git commit + push to main)
./scripts/deploy.sh "your commit message"
```

## Decision framework

- If conversion < 2%: check funnel drop-off with analytics.mjs, consider promo code push
- If Basic:Pro ratio > 60:40: add urgency to Pro tier on /tickets page
- If registrations high but payments low: email outreach to registered non-payers
- If <15 spots left: announce urgency on social + email blast
- 1 week before (Mar 26): send reminder email to all paid attendees
- 1 day before (Apr 1): send final reminder with meeting link
- Day of (Apr 2): send day-of email 1 hour before start
