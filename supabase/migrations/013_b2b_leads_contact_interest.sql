-- Allow unified /contact funnel leads alongside workshop and integration
ALTER TABLE b2b_leads
  DROP CONSTRAINT IF EXISTS b2b_leads_interest_type_check;

ALTER TABLE b2b_leads
  ADD CONSTRAINT b2b_leads_interest_type_check
  CHECK (interest_type IN ('workshop', 'integration', 'contact'));
