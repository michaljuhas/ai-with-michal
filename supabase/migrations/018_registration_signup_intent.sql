-- Lead-magnet / post-auth intent captured at Clerk user.created (from unsafe_metadata)
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS signup_intent TEXT;
