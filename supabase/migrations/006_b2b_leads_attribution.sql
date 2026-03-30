-- Attribution tracking for B2B leads (UTM params + derived source + referrer)
ALTER TABLE b2b_leads
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS ref          TEXT,
  ADD COLUMN IF NOT EXISTS source_type  TEXT CHECK (source_type IN ('Paid', 'Referral', 'Organic')),
  ADD COLUMN IF NOT EXISTS source_detail TEXT,
  ADD COLUMN IF NOT EXISTS referrer     TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT;

CREATE INDEX IF NOT EXISTS b2b_leads_source_type_idx  ON b2b_leads (source_type);
CREATE INDEX IF NOT EXISTS b2b_leads_utm_campaign_idx ON b2b_leads (utm_campaign);
