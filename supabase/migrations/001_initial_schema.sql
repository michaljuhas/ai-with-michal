-- Registrations: track users who sign up via Clerk
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders: track completed/pending Stripe payments
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  price_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro')),
  amount_eur INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by clerk_user_id
CREATE INDEX IF NOT EXISTS idx_orders_clerk_user_id ON orders (clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_clerk_user_id ON registrations (clerk_user_id);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by webhook)
-- Anon/authenticated access is handled via service role key in API routes
