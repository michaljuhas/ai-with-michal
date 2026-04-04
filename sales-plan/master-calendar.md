# Master calendar — parallel workshop sales

Use **T-minus** from each event date. Several rows can be active at once—batch creative work when two or three workshops overlap.

**Workshops (upcoming):**

| Slug | Date |
|------|------|
| `2026-04-16-ai-in-recruiting` | April 16, 2026 |
| `2026-04-23-sourcing-automation` | April 23, 2026 |
| `2026-05-07-claude-cowork-recruiting` | May 7, 2026 |

## Overlap map (sell windows)

| Week of (approx.) | Apr 16 | Apr 23 | May 7 |
|-------------------|--------|--------|-------|
| Early April | Meta + LI + alumni push | — | — |
| Mid April | Final urgency T-7…T-1 | Meta + LI ramp | — |
| Late April | — | Final urgency | Meta + LI ramp |
| Early May | — | — | Final urgency |

Adjust to your actual “open for sale” dates (often all three URLs are live at once).

## Channel checklist (repeat per workshop)

| T | Meta Ads | LinkedIn (organic) | Email / alumni | Ops |
|---|----------|--------------------|----------------|-----|
| T-21…T-14 | New asset folder → `launch-campaign.mjs --workshop-slug …` (PAUSED) → review → activate | 2–3 posts: topic hook + proof | Past attendees: private 50% code for **this** slug’s tickets | `status.mjs` 2×/week |
| T-14…T-7 | Duplicate winning ads; pause if CTR below 0.5% | Rotate second angle (time zone, outcome) | Light nudge to registered non-payers if list exists | |
| T-7…T-3 | Urgency creative; check budget vs fill | “Spots filling” (honest numbers) | Week-before reminder to **paid** for that event | `send-reminders.mjs` |
| T-2…T-1 | Last-chance angles | Final post with ticket link + `?ref=linkedin` | Day-before reminder | |
| Day of | Pause or wind down spend | Optional “starting soon” | Day-of (`--type=dayOf`) | |

## When multiple workshops are live

1. **Nearest date** gets the strongest urgency in copy—but if a later workshop is at 0 paid, give it at least one dedicated Meta line and one LI post that week.  
2. Name campaigns so the **slug or date** is visible in Ads Manager.  
3. Run `stripe-report.mjs` and `status.mjs` daily when overlapping; do not optimise only “the” campaign.

See [meta-ads-playbook.md](./meta-ads-playbook.md) and [organic-and-alumni.md](./organic-and-alumni.md).
