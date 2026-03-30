---
name: b2b-analysis
description: Analyze B2B traffic, lead funnel, and pipeline health for the /ai-workshops-for-teams and /ai-integrations pages. Pulls data from PostHog and the b2b_leads Supabase table. Use when the user asks to analyze B2B traffic, B2B opt-ins, B2B leads, B2B pipeline, or workshop/integration inquiries. Produces an executive summary with funnel metrics, lead status, and prioritized next steps.
---

# B2B Analysis

Produces an executive summary of the B2B funnel: traffic → engagement → form → lead → pipeline.

## Data sources

- **PostHog** — page views, click events, form funnel (see posthog-cli skill)
- **Supabase** — `b2b_leads` table (see supabase-cli skill)

Use `node --env-file=.env` prefix for all CLI commands.

---

## Step 1 — Traffic (PostHog HogQL)

```bash
node --env-file=.env scripts/posthog-cli/dist/index.js query run --sql \
"SELECT properties.\$pathname as page, count() as views, count(distinct distinct_id) as unique_visitors
 FROM events
 WHERE event = '\$pageview'
   AND (properties.\$pathname LIKE '/ai-workshops%' OR properties.\$pathname LIKE '/ai-integrations%')
   AND timestamp > now() - INTERVAL 30 DAY
 GROUP BY page ORDER BY views DESC"
```

## Step 2 — Funnel event counts (PostHog HogQL)

```bash
node --env-file=.env scripts/posthog-cli/dist/index.js query run --sql \
"SELECT event, count() as total, count(distinct distinct_id) as unique_users
 FROM events
 WHERE event IN (
   'b2b_hero_cta_clicked','b2b_card_cta_clicked',
   'b2b_form_started','b2b_form_submit_attempted',
   'b2b_lead_submitted','b2b_form_error','b2b_booking_link_clicked'
 )
 AND timestamp > now() - INTERVAL 30 DAY
 GROUP BY event ORDER BY total DESC"
```

## Step 3 — Card interest (PostHog HogQL)

Which specific services attract the most clicks:

```bash
node --env-file=.env scripts/posthog-cli/dist/index.js query run --sql \
"SELECT properties.service as service, properties.page as page, count() as clicks
 FROM events
 WHERE event = 'b2b_card_cta_clicked'
   AND timestamp > now() - INTERVAL 30 DAY
 GROUP BY service, page ORDER BY clicks DESC"
```

## Step 4 — Service checkbox selections (PostHog HogQL)

What services people actually select in the form (even without submitting):

```bash
node --env-file=.env scripts/posthog-cli/dist/index.js query run --sql \
"SELECT properties.service as service, properties.action as action,
        count() as toggles, count(distinct distinct_id) as unique_users
 FROM events
 WHERE event = 'b2b_service_toggled'
   AND timestamp > now() - INTERVAL 30 DAY
 GROUP BY service, action ORDER BY toggles DESC"
```

## Step 5 — Lead pipeline (Supabase)

```bash
# Pipeline summary by status + type
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT interest_type, status, count(*) as leads FROM b2b_leads GROUP BY interest_type, status ORDER BY interest_type, status" \
  --pretty

# Source attribution
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT source_type, source_detail, count(*) as leads FROM b2b_leads GROUP BY source_type, source_detail ORDER BY leads DESC" \
  --pretty

# Top requested services
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT unnest(services) as service, count(*) as requested FROM b2b_leads WHERE services IS NOT NULL GROUP BY service ORDER BY requested DESC" \
  --pretty

# Recent leads needing follow-up
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT name, email, company, interest_type, services, status, source_type, created_at FROM b2b_leads ORDER BY created_at DESC LIMIT 20" \
  --pretty
```

---

## Step 6 — Write the executive summary

Use the template below. Fill every section with real numbers from the queries above. Do not leave placeholders — if data is zero or missing, say so explicitly.

```markdown
# B2B Analysis — [Date range, e.g. last 30 days]

## Executive summary
[2–3 sentences: total visitors, total leads, pipeline health, biggest opportunity or risk]

## Traffic
| Page | Views | Unique visitors |
|------|-------|-----------------|
| /ai-workshops-for-teams | … | … |
| /ai-integrations        | … | … |

## Funnel (last 30 days)
| Stage | Events | Unique users | Conversion vs. prev. stage |
|-------|--------|--------------|---------------------------|
| Page views (both pages) | … | … | — |
| Hero CTA clicked        | … | … | …% |
| Form started            | … | … | …% |
| Form submitted (attempt)| … | … | …% |
| Lead saved (success)    | … | … | …% |
| Booking link clicked    | … | … | …% |

Drop-off notes: [where is the biggest gap and likely reason]

## Service interest
Top services by card CTA clicks and form checkbox selections:
1. [Service] — [N] card clicks, [N] form selections
2. …

## Lead pipeline
| Status | Workshops | Integrations | Total |
|--------|-----------|--------------|-------|
| new       | … | … | … |
| contacted | … | … | … |
| qualified | … | … | … |
| booked    | … | … | … |
| won       | … | … | … |
| lost      | … | … | … |

Stale leads (status = 'new' and oldest): [list names/emails if any are >3 days old]

## Attribution
| Source type | Leads | Detail |
|-------------|-------|--------|
| Paid | … | … |
| Referral | … | … |
| Organic | … | … |

## Form errors
[Count from b2b_form_error events; list error messages if any]

## Next steps (prioritized)
1. [Most impactful action based on the data — e.g. "Follow up with N new leads"]
2. [Second action — e.g. "Fix drop-off at form-start: X% of CTA clickers never start the form"]
3. [Third action — e.g. "Promote [top service] more prominently in hero copy"]
```

---

## Stale lead alert

If `status = 'new'` leads are older than 3 days, flag them prominently in the summary and suggest immediate follow-up. Query:

```bash
node --env-file=.env scripts/supabase-cli/index.mjs db query \
  --sql "SELECT name, email, company, interest_type, services, created_at FROM b2b_leads WHERE status = 'new' AND created_at < now() - INTERVAL '3 days' ORDER BY created_at ASC" \
  --pretty
```

## Conversion benchmarks

Use these to contextualize results:

| Transition | Healthy range | Warning |
|------------|--------------|---------|
| Visitors → Hero CTA | 5–15% | < 3% |
| Hero CTA → Form started | 50–70% | < 30% |
| Form started → Lead submitted | 60–80% | < 40% |
| Lead submitted → Booking clicked | 20–40% | < 10% |
