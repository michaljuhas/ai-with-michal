# Meta Ads playbook — parallel workshops

## Principles

- One **logical line per workshop** (separate campaign or clearly named ad set). Landing URL must match the slug you are selling:  
  `https://aiwithmichal.com/workshops/<slug>/tickets?ref=meta` (UTM is added by the launcher where applicable).
- **`launch-campaign.mjs`:** always pass `--workshop-slug <slug>` from [`lib/workshops.ts`](../lib/workshops.ts) until script defaults match the app registry.
- Default budget in the script is **€10/day** (amount in cents: `--budget 1000`). Split total Meta budget across **active** workshops; raise spend on the line that is below **20 paid** but has healthy CTR.

## Asset cadence

1. Run `node --env-file=.env scripts/generate-campaign-assets.mjs` (optional `--focus "…"`) **before** a new campaign—about **every other day** when you need fresh concepts, not daily tweaks.
2. Review `campaigns/YYYY-MM-DD-HH-mm/` — `copy.md` / `copy.json` + images. Portrait assets are **9:16**; crop to **4:5** in Ads Manager at upload if required.
3. Launch:  
   `node --env-file=.env scripts/launch-campaign.mjs --workshop-slug <slug> [--folder campaigns/…] [--dry-run]`  
   Campaign is created **PAUSED**—activate only after review in Ads Manager.
4. Seed additional headline/body variants from the same folder via Ads Manager (“Add another option”).

## Iteration

- Review **each** active campaign **2×/week** minimum (`meta-ads-stats.mjs` or Meta Ads CLI insights).
- **Pause:** CTR below 0.5%, or spend with no leads/purchases after a reasonable learning window.
- **Scale:** CTR above 3% or confirmed purchases—duplicate ad set or raise daily budget incrementally.
- **Maintain:** healthy CTR and acceptable CPA—watch frequency and creative fatigue.

## Naming & tracking

- Include **date or slug** in campaign/ad set names so reports and daily summaries stay readable when 2+ workshops run.
- Use distinct `ref=` or UTM conventions per placement if you compare sources in PostHog.

## CLI reference

Full Meta Ads CLI: [`.claude/skills/meta-ads-cli.md`](../.claude/skills/meta-ads-cli.md) and [`AGENTS.md`](../AGENTS.md).
