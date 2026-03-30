-- B2B lead capture CRM table for workshop and integration inquiries
CREATE TABLE IF NOT EXISTS b2b_leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),

  -- Contact info
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  company         TEXT,
  role            TEXT,

  -- What they're interested in
  interest_type   TEXT        NOT NULL
    CHECK (interest_type IN ('workshop', 'integration')),
  services        TEXT[],     -- specific workshop(s) or package(s) selected
  message         TEXT,

  -- CRM status for follow-up pipeline
  status          TEXT        NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'booked', 'won', 'lost')),
  notes           TEXT        -- internal CRM notes
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER b2b_leads_updated_at
  BEFORE UPDATE ON b2b_leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enable RLS
ALTER TABLE b2b_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public contact form)
CREATE POLICY "Allow public inserts" ON b2b_leads
  FOR INSERT TO anon WITH CHECK (true);

-- Only service role can read / update (used by API routes and admin)
CREATE POLICY "Service role full access" ON b2b_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Index for common admin queries
CREATE INDEX IF NOT EXISTS b2b_leads_email_idx         ON b2b_leads (email);
CREATE INDEX IF NOT EXISTS b2b_leads_interest_type_idx ON b2b_leads (interest_type);
CREATE INDEX IF NOT EXISTS b2b_leads_status_idx        ON b2b_leads (status);
CREATE INDEX IF NOT EXISTS b2b_leads_created_at_idx    ON b2b_leads (created_at DESC);
