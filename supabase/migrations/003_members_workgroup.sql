-- Workgroup posts: any registered user can post to a workshop's discussion
CREATE TABLE workgroup_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_slug TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workgroup replies: any registered user can reply to posts
CREATE TABLE workgroup_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES workgroup_posts(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  author_email TEXT NOT NULL DEFAULT '',
  author_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workgroup_posts_workshop_slug ON workgroup_posts (workshop_slug, created_at DESC);
CREATE INDEX idx_workgroup_replies_post_id ON workgroup_replies (post_id);

ALTER TABLE workgroup_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workgroup_replies ENABLE ROW LEVEL SECURITY;
