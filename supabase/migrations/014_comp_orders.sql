-- Add order_type column to distinguish Stripe payments from comp/manual orders
ALTER TABLE orders
  ADD COLUMN order_type TEXT NOT NULL DEFAULT 'stripe'
  CHECK (order_type IN ('stripe', 'comp', 'manual'));
