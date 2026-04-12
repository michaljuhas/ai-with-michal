-- One row per Clerk user: prepaid annual membership window (Stripe Checkout mode=payment, not Subscription).
CREATE TABLE IF NOT EXISTS annual_memberships (
  clerk_user_id TEXT PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  period_starts_at TIMESTAMPTZ NOT NULL,
  period_ends_at TIMESTAMPTZ NOT NULL,
  amount_eur INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_annual_memberships_period_ends
  ON annual_memberships (period_ends_at);

COMMENT ON TABLE annual_memberships IS 'Annual prepaid membership; renewed by extending period_ends_at on new Stripe payment.';
