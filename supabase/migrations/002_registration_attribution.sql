-- Registration attribution: track where each user came from
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS ref          TEXT,
  ADD COLUMN IF NOT EXISTS source_type  TEXT CHECK (source_type IN ('Paid', 'Referral', 'Organic')),
  ADD COLUMN IF NOT EXISTS source_detail TEXT;

-- Index useful for grouping registrations by campaign / source
CREATE INDEX IF NOT EXISTS idx_registrations_source_type ON registrations (source_type);
CREATE INDEX IF NOT EXISTS idx_registrations_utm_campaign ON registrations (utm_campaign);
