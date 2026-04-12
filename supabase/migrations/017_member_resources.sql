-- Lead magnets / member resources (PDF or Loom), public vs unlisted + per-user grants
CREATE TABLE member_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'unlisted')),
  content_kind TEXT NOT NULL CHECK (content_kind IN ('file', 'loom')),
  storage_path TEXT,
  loom_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT member_resources_kind_paths CHECK (
    (content_kind = 'file' AND loom_url IS NULL)
    OR (content_kind = 'loom' AND storage_path IS NULL)
  )
);

CREATE TABLE member_resource_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES member_resources(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, clerk_user_id)
);

CREATE INDEX idx_member_resources_sort ON member_resources (is_archived, sort_order DESC, created_at DESC);
CREATE INDEX idx_member_resource_grants_user ON member_resource_grants (clerk_user_id);
CREATE INDEX idx_member_resource_grants_resource ON member_resource_grants (resource_id);

ALTER TABLE member_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_resource_grants ENABLE ROW LEVEL SECURITY;

-- Private bucket: files only readable via service role + signed URLs in app
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-resources-private', 'member-resources-private', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Refresh PostgREST schema cache so REST finds new tables immediately (Supabase SQL Editor)
NOTIFY pgrst, 'reload schema';
