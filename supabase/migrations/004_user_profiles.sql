-- User profile preferences: AI adoption level, function, country, LinkedIn URL
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS ai_level TEXT
    CHECK (ai_level IN ('offline', 'chatting', 'systemizing', 'automating', 'ai_native')),
  ADD COLUMN IF NOT EXISTS function TEXT
    CHECK (function IN ('recruiting_ta_hr', 'gtm', 'business_ops', 'builder_founder')),
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
