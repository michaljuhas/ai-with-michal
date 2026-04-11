-- Add course_slug to orders table for course purchases
-- Course orders reuse the same orders table as workshops, with course_slug
-- populated instead of workshop_slug.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS course_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_course_slug ON orders (course_slug);
