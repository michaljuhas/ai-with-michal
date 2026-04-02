ALTER TABLE orders ADD COLUMN IF NOT EXISTS workshop_slug TEXT;
UPDATE orders SET workshop_slug = '2026-04-02-ai-in-recruiting' WHERE workshop_slug IS NULL;
