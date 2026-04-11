-- Global member feed (admin-authored posts; all signed-in members can read/reply)
CREATE TABLE member_feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_feed_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES member_feed_posts(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  author_email TEXT NOT NULL DEFAULT '',
  author_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_member_feed_posts_created_at ON member_feed_posts (created_at DESC);
CREATE INDEX idx_member_feed_replies_post_id ON member_feed_replies (post_id);

ALTER TABLE member_feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_feed_replies ENABLE ROW LEVEL SECURITY;
