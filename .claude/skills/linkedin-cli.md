---
name: linkedin-cli
description: Use when the user wants to post or share content on LinkedIn from the CLI — authenticate via OAuth, share text posts, articles, or images, or check the currently authenticated member using the local linkedin-cli wrapper.
---

# LinkedIn Share CLI

A lightweight CLI wrapper for the LinkedIn Share API (UGC Posts). Run it with:

```bash
node --env-file=.env scripts/linkedin/index.mjs <command> [options]
```

## Setup

Required environment variables (add to `.env`):

| Variable | Required | Description | Default |
|---|---|---|---|
| `LINKEDIN_CLIENT_ID` | Yes | OAuth App Client ID from LinkedIn Developer Portal | — |
| `LINKEDIN_CLIENT_SECRET` | Yes | OAuth App Client Secret | — |
| `LINKEDIN_REDIRECT_URI` | No | OAuth callback URI | `http://localhost:3000/callback` |

No build step needed — pure `.mjs`. After the first successful `auth`, the access token is stored at `~/.linkedin-token.json` (file mode `0o600`). The token is valid for 60 days.

## Authentication

```bash
# Start the OAuth flow — opens a browser, saves token to ~/.linkedin-token.json
node --env-file=.env scripts/linkedin/index.mjs auth

# Show current token expiry and authenticated member info
node --env-file=.env scripts/linkedin/index.mjs auth --status

# Show the currently authenticated LinkedIn member (live API call)
node --env-file=.env scripts/linkedin/index.mjs whoami
```

Run `auth` once before using any `share` commands. Re-run it when the token expires (after 60 days).

## Sharing

All share commands require a valid token. Post visibility is always **PUBLIC** (hardcoded).

### Text post

```bash
# Publish a plain text post
node --env-file=.env scripts/linkedin/index.mjs share text "Hello LinkedIn!"

# Preview the request body without posting
node --env-file=.env scripts/linkedin/index.mjs share text "Draft post" --dry-run
```

### Article (link) post

```bash
# Share a URL with a title
node --env-file=.env scripts/linkedin/index.mjs share article "Great read" --url https://example.com/article --title "Article Title"

# Share a URL with an optional excerpt
node --env-file=.env scripts/linkedin/index.mjs share article "Check this out" --url https://example.com --title "Title" --description "Short excerpt"

# Preview without posting
node --env-file=.env scripts/linkedin/index.mjs share article "Draft" --url https://example.com --title "Title" --dry-run
```

### Image post

Image upload is a 2-step process: register the asset with LinkedIn, upload the binary, then create the post. This is handled automatically.

```bash
# Share a post with an image attachment
node --env-file=.env scripts/linkedin/index.mjs share image "Here's a chart" --file ./image.png

# Preview without uploading or posting
node --env-file=.env scripts/linkedin/index.mjs share image "Caption" --file ./image.png --dry-run
```

## Output Format

On success, the post ID is printed to stdout:

```
Post created. ID: urn:li:share:7123456789012345678
```

With `--dry-run`, the request body is printed to stdout without making any API call:

```
[DRY RUN] Would post:
{
  "author": "urn:li:person:abc123",
  ...
}
```

`whoami` returns pretty-printed JSON to stdout:

```bash
node --env-file=.env scripts/linkedin/index.mjs whoami | jq '.name'
```

## Error Handling

Errors print to stderr:

```
[LINKEDIN ERROR] Not authenticated. Run: node --env-file=.env scripts/linkedin/index.mjs auth
[LINKEDIN ERROR] fetch failed: invalid_client
```

- Exit code `0` on success, `1` on error
- If the token is missing or expired, all `share` and `whoami` commands print an auth prompt to stderr and exit `1`

## Rate Limits

| Limit | Value |
|---|---|
| Per member per day | 150 requests |
| Per app per day | 100,000 requests |
| Access token lifetime | 60 days |

## Running Tests

```bash
# All unit tests
node --test scripts/linkedin/__tests__/*.test.mjs

# Individual test suites
node --test scripts/linkedin/__tests__/config.test.mjs
node --test scripts/linkedin/__tests__/api.test.mjs
node --test scripts/linkedin/__tests__/auth.test.mjs
node --test scripts/linkedin/__tests__/share.test.mjs
node --test scripts/linkedin/__tests__/cli.test.mjs
```
