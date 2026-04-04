-- Net ticket amount in EUR (ex-VAT / ex-sales tax) for margin reporting; Stripe total_details.amount_tax removed from amount_total.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_net_eur INTEGER;
