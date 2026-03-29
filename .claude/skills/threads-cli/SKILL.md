---
name: threads-cli
description: Use when interacting with the Threads Graph API via the CLI at scripts/threads/index.mjs. Covers auth, posting, replies, insights, and profile commands.
---

# Threads CLI

```bash
node --env-file=.env scripts/threads/index.mjs <resource> <subcommand> [flags]
```

## Setup / Authentication

Required environment variables (add to `.env`):

| Variable | Description |
|---|---|
| `THREADS_ACCESS_TOKEN` | Long-lived OAuth 2.0 bearer token (valid 60 days; refresh with `auth refresh`) |
| `THREADS_USER_ID` | Your Threads user ID — find it via `profile me` once token is set |

### Required OAuth scopes by command group

| Scope | Commands |
|---|---|
| `threads_basic` | All commands |
| `threads_content_publish` | `posts container`, `posts publish` |
| `threads_manage_replies` | `replies hide`, `replies unhide`, `replies approve`, `replies ignore` |
| `threads_read_replies` | `replies list`, `replies conversation`, `replies pending` |
| `threads_manage_insights` | `insights post`, `insights account` |
| `threads_delete` | `posts delete` |
| `threads_profile_discovery` | `profile lookup` |

Obtain tokens via Meta's OAuth flow: https://developers.facebook.com/docs/threads/get-started — use the **Threads** App ID (not the Facebook App ID).

**Security:** never paste tokens into chat. Store them in `.env` (gitignored).

---

## Command Reference

### profile

```bash
# Fetch authenticated user's profile
# Scope: threads_basic
node --env-file=.env scripts/threads/index.mjs profile me

# Look up a public profile by username
# Scope: threads_profile_discovery
# Note: target must have ≥100 followers; development access limited to @meta, @threads, @instagram, @facebook
node --env-file=.env scripts/threads/index.mjs profile lookup --username <username>

# Check daily publishing quota usage
# Scope: threads_basic | Requires: THREADS_USER_ID
node --env-file=.env scripts/threads/index.mjs profile publishing-limit
```

### posts

```bash
# List your posts (paginated)
# Scope: threads_basic | Requires: THREADS_USER_ID
node --env-file=.env scripts/threads/index.mjs posts list [--limit N] [--after cursor] [--before cursor] [--since unix] [--until unix]

# Retrieve a single post by media ID
# Scope: threads_basic
node --env-file=.env scripts/threads/index.mjs posts get <media-id>

# Create a media container (step 1 of 2-step publish)
# Scope: threads_content_publish | Requires: THREADS_USER_ID
# --media-type: TEXT | IMAGE | VIDEO | CAROUSEL (required)
# --text: post text
# --image-url: publicly accessible image URL (IMAGE type)
# --video-url: publicly accessible video URL (VIDEO type)
# --reply-to-id: media ID to reply to
# --reply-control: everyone | accounts_you_follow | mentioned_only | followers_only
# --link-attachment: URL to attach
# --quote-post-id: media ID to quote
# --topic-tag: topic hashtag
# --alt-text: image alt text
# --auto-publish-text: skip step 2 for TEXT type only (boolean flag)
node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT|IMAGE|VIDEO|CAROUSEL [options]

# Publish a container (step 2; wait ~30s after container creation)
# Scope: threads_content_publish | Requires: THREADS_USER_ID
node --env-file=.env scripts/threads/index.mjs posts publish --creation-id <id>

# Delete a post
# Scope: threads_delete
node --env-file=.env scripts/threads/index.mjs posts delete <media-id>

# Repost a post
# Scope: threads_basic
node --env-file=.env scripts/threads/index.mjs posts repost <media-id>
```

### replies

```bash
# List direct replies to a post (paginated)
# Scope: threads_read_replies
node --env-file=.env scripts/threads/index.mjs replies list <media-id> [--limit N] [--after cursor] [--before cursor]

# All replies in a thread, flattened (paginated)
# Scope: threads_read_replies
node --env-file=.env scripts/threads/index.mjs replies conversation <media-id> [--limit N] [--after cursor] [--before cursor]

# Hide / unhide a reply
# Scope: threads_manage_replies
node --env-file=.env scripts/threads/index.mjs replies hide <reply-id>
node --env-file=.env scripts/threads/index.mjs replies unhide <reply-id>

# List replies awaiting approval (paginated)
# Scope: threads_read_replies
node --env-file=.env scripts/threads/index.mjs replies pending <media-id> [--limit N] [--after cursor] [--before cursor]

# Approve / ignore a pending reply
# Scope: threads_manage_replies
node --env-file=.env scripts/threads/index.mjs replies approve <reply-id>
node --env-file=.env scripts/threads/index.mjs replies ignore <reply-id>
```

### insights

```bash
# Post-level insights
# Scope: threads_manage_insights
# Available metrics: views, likes, replies, reposts, quotes, shares
node --env-file=.env scripts/threads/index.mjs insights post <media-id> [--metric views,likes,replies,reposts,quotes,shares]

# Account-level insights
# Scope: threads_manage_insights | Requires: THREADS_USER_ID
# Available metrics: views, likes, replies, reposts, quotes, followers_count
# Note: followers_count does not support --since/--until
# Note: data unavailable before April 13, 2024 (Unix 1712991600)
node --env-file=.env scripts/threads/index.mjs insights account [--metric views,likes,replies,reposts,quotes,followers_count] [--since unix] [--until unix]
```

### auth

```bash
# Refresh the long-lived token (prints new token + update reminder to stdout)
# After running, manually copy the new access_token into THREADS_ACCESS_TOKEN in .env
node --env-file=.env scripts/threads/index.mjs auth refresh
```

### Global flags

| Flag | Description |
|---|---|
| `--pretty` | Human-readable indented JSON output (default: compact JSON) |
| `--help`, `-h` | Show usage |

---

## Common Examples

```bash
# Fetch your profile
node --env-file=.env scripts/threads/index.mjs profile me --pretty

# Check publishing quota
node --env-file=.env scripts/threads/index.mjs profile publishing-limit --pretty

# List recent posts
node --env-file=.env scripts/threads/index.mjs posts list --limit 10 --pretty

# Post a text thread (one-step shortcut — TEXT only)
node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT --text "Hello from the CLI!" --auto-publish-text

# Post a text thread (two-step, required for IMAGE/VIDEO/CAROUSEL)
node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT --text "Hello!"
# Wait ~30 seconds, then use the creation_id from the output:
node --env-file=.env scripts/threads/index.mjs posts publish --creation-id <creation_id_here>

# Post an image
node --env-file=.env scripts/threads/index.mjs posts container --media-type IMAGE --image-url "https://example.com/photo.jpg" --text "Caption here"
# Then publish with the creation_id after ~30 seconds

# Reply to a post
node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT --text "Great point!" --reply-to-id <media-id>
node --env-file=.env scripts/threads/index.mjs posts publish --creation-id <creation_id_here>

# Get post insights
node --env-file=.env scripts/threads/index.mjs insights post <media-id> --metric views,likes,replies --pretty

# Account insights with date range
node --env-file=.env scripts/threads/index.mjs insights account --metric views,likes,followers_count --since 1712991600 --pretty

# Refresh token (prints new token to stdout)
node --env-file=.env scripts/threads/index.mjs auth refresh
# Copy new access_token and update THREADS_ACCESS_TOKEN in .env

# List replies on a post
node --env-file=.env scripts/threads/index.mjs replies list <media-id> --pretty

# Hide a reply
node --env-file=.env scripts/threads/index.mjs replies hide <reply-id>
```

---

## Error Handling & Troubleshooting

### Output format

- **Success:** JSON to stdout — compact by default, `--pretty` for readable/indented
- **Errors:** written to stderr as `Error [code]: message`
- **Exit codes:** `0` success or help, `1` error

### Rate limits

| Action | Daily Limit |
|---|---|
| Posts | 250 per day |
| Replies | 1,000 per day |
| Deletes | 100 per day |

When rate limited, stderr shows a quota hint — check current usage with `profile publishing-limit`.

### Common API error codes

| Code | Meaning | Fix |
|---|---|---|
| `190` | Token expired | Run `auth refresh`, copy new token to `.env` |
| `32` | Rate limit exceeded | Check `profile publishing-limit` |
| `200` / `10` | Permission denied | Verify token has the required OAuth scope |

### Gotchas

- **IMAGE, VIDEO, CAROUSEL always require two-step publish** — create container, wait ~30s, then `posts publish`
- `--auto-publish-text` only works with `--media-type TEXT`; it is silently ignored for other types
- `profile lookup` requires the target account to have ≥100 followers; in development mode only @meta, @threads, @instagram, @facebook are accessible
- Account insights are unavailable before April 13, 2024 (Unix timestamp `1712991600`)
- `followers_count` metric does not support `--since` / `--until` date filters
- `auth refresh` prints the new token but does **not** update `.env` automatically — copy and paste it manually
- `THREADS_USER_ID` is required for: `posts list`, `posts container`, `posts publish`, `profile publishing-limit`, `insights account`

---

## Cross-links

- `scripts/threads/README.md` — developer/contributor guide and live verification checklist
- Meta Threads API docs: https://developers.facebook.com/docs/threads/
