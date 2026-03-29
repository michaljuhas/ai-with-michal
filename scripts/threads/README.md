# Threads CLI

A lightweight CLI wrapper for the [Threads Graph API](https://graph.threads.net/v1.0/).

## Invocation

```bash
node --env-file=.env scripts/threads/index.mjs <command> [subcommand] [flags]
```

## Environment Variables

| Variable | Description |
|---|---|
| `THREADS_ACCESS_TOKEN` | Long-lived OAuth 2.0 bearer token from the Threads Graph API (valid 60 days; refresh with `auth refresh`) |
| `THREADS_USER_ID` | Your Threads user ID, used in API paths like `/{user-id}/threads` — find it via `profile me` once token is set |

## Auth Setup

Obtain tokens via Meta's OAuth flow: https://developers.facebook.com/docs/threads/get-started

Required OAuth scopes:
- `threads_basic`
- `threads_content_publish`
- `threads_manage_replies`
- `threads_read_replies`
- `threads_manage_insights`
- `threads_delete`

## Available Commands

### profile
```bash
node --env-file=.env scripts/threads/index.mjs profile me
node --env-file=.env scripts/threads/index.mjs profile lookup --username <username>
node --env-file=.env scripts/threads/index.mjs profile publishing-limit
```

### posts
```bash
node --env-file=.env scripts/threads/index.mjs posts list
node --env-file=.env scripts/threads/index.mjs posts get <id>
node --env-file=.env scripts/threads/index.mjs posts container
node --env-file=.env scripts/threads/index.mjs posts publish
node --env-file=.env scripts/threads/index.mjs posts delete <id>
node --env-file=.env scripts/threads/index.mjs posts repost <id>
```

### replies
```bash
node --env-file=.env scripts/threads/index.mjs replies list <id>
node --env-file=.env scripts/threads/index.mjs replies conversation <id>
node --env-file=.env scripts/threads/index.mjs replies hide <id>
node --env-file=.env scripts/threads/index.mjs replies unhide <id>
node --env-file=.env scripts/threads/index.mjs replies pending <id>
node --env-file=.env scripts/threads/index.mjs replies approve <id>
node --env-file=.env scripts/threads/index.mjs replies ignore <id>
```

### insights
```bash
node --env-file=.env scripts/threads/index.mjs insights post <id> --metric <metric>
node --env-file=.env scripts/threads/index.mjs insights account --metric <metric>
```

### auth
```bash
node --env-file=.env scripts/threads/index.mjs auth refresh
```

## Global Flags

| Flag | Description |
|---|---|
| `--pretty` | Human-readable formatted output (default is compact JSON) |

## Rate Limits

| Action | Daily Limit |
|---|---|
| Posts | 250 per day |
| Replies | 1,000 per day |
| Deletes | 100 per day |

Check your current publishing limit with:

```bash
node --env-file=.env scripts/threads/index.mjs profile publishing-limit
```

## Running Tests

```bash
node --test scripts/threads/__tests__/*.test.mjs
```

## Skill Reference

See `.claude/skills/threads-cli/SKILL.md` for the full Claude agent usage guide (available after Wave 5 setup).

## Live verification checklist

Run these manually after setting `THREADS_ACCESS_TOKEN` and `THREADS_USER_ID` in `.env`.
These use the real API — automated tests use mocks.

- [ ] **Profile** — fetch your profile:
  ```
  node --env-file=.env scripts/threads/index.mjs profile me --pretty
  ```

- [ ] **Publishing quota** — check your daily limits:
  ```
  node --env-file=.env scripts/threads/index.mjs profile publishing-limit --pretty
  ```

- [ ] **List posts** — fetch your recent posts:
  ```
  node --env-file=.env scripts/threads/index.mjs posts list --limit 5 --pretty
  ```

- [ ] **Post a text thread** (two-step):
  ```
  # Step 1: create container
  node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT --text "Hello from the CLI!"
  # Note the creation_id from the output, then after ~30 seconds:
  # Step 2: publish
  node --env-file=.env scripts/threads/index.mjs posts publish --creation-id <creation_id>
  ```

- [ ] **Post a text thread** (one-step shortcut):
  ```
  node --env-file=.env scripts/threads/index.mjs posts container --media-type TEXT --text "Hello!" --auto-publish-text
  ```
  Note: `auto_publish_text` only works for `TEXT` media type.

- [ ] **Get post insights** (replace `<media-id>` with a real ID from your post list):
  ```
  node --env-file=.env scripts/threads/index.mjs insights post <media-id> --pretty
  ```

- [ ] **Account insights**:
  ```
  node --env-file=.env scripts/threads/index.mjs insights account --metric views,likes,followers_count --pretty
  ```

- [ ] **Refresh token** (before 60-day expiry):
  ```
  node --env-file=.env scripts/threads/index.mjs auth refresh
  # Copy the new access_token and update THREADS_ACCESS_TOKEN in your .env
  ```
