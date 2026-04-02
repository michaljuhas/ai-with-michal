CREATE TABLE IF NOT EXISTS workshop_session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_notes_workshop_slug ON workshop_session_notes (workshop_slug);

ALTER TABLE workshop_session_notes ENABLE ROW LEVEL SECURITY;
