---
name: send-newsletter
description: Use when the user wants to send a newsletter or broadcast email to all registered users (or a specific list of recipients). Handles recipient fetching from Supabase, email composition, and sending via SendGrid.
---

# Send Newsletter

Sends a one-off HTML + plain-text email to all registered users (or a custom list) via SendGrid.

## Email conventions

| Field | Value |
|---|---|
| **From** | `hello@aiwithmichal.com` (display name: `Michal Juhas`) |
| **Reply-To** | `ADMIN_EMAIL` env var → `michal@michaljuhas.com` |
| **Signature** | Michal Juhas / AIwithMichal.com |
| **Provider** | SendGrid (`SENDGRID_API_KEY` env var) |

## Recipient sources

### All registered users (from Supabase)
```js
const { data } = await supabase.from('registrations').select('email');
```

### Paid attendees only
`orders` has no FK to `registrations` — join via `clerk_user_id`:
```js
const [{ data: allRegs }, { data: paidOrders }] = await Promise.all([
  supabase.from('registrations').select('clerk_user_id, email'),
  supabase.from('orders').select('clerk_user_id').eq('status', 'paid'),
]);
const paidIds = new Set((paidOrders ?? []).map(o => o.clerk_user_id).filter(Boolean));
const recipients = (allRegs ?? []).filter(r => paidIds.has(r.clerk_user_id));
```

### Registered but NOT paid (unpaid follow-up)
```js
const [{ data: allRegs }, { data: paidOrders }] = await Promise.all([
  supabase.from('registrations').select('clerk_user_id, email'),
  supabase.from('orders').select('clerk_user_id').eq('status', 'paid'),
]);
const paidIds = new Set((paidOrders ?? []).map(o => o.clerk_user_id).filter(Boolean));
const seen = new Set();
const recipients = (allRegs ?? [])
  .filter(r => !paidIds.has(r.clerk_user_id))
  .filter(r => { const e = r.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; })
  .map(r => ({ email: r.email, name: r.email.split('@')[0] }));
```
Note: always deduplicate by email — the same address can appear multiple times due to duplicate registrations.

### Manual list
Pass an array of `{ email, name }` objects directly in the script.

## How to send

Write a one-off Node.js script (no TypeScript compilation needed) using the pattern below, then run it with:

```bash
node --env-file=.env scripts/send-newsletter.mjs
```

Add `--dry-run` support to preview recipients before sending.

## Script template

```js
// scripts/send-newsletter.mjs
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'hello@aiwithmichal.com';
const FROM_NAME  = 'Michal Juhas';
const REPLY_TO   = process.env.ADMIN_EMAIL ?? 'michal@michaljuhas.com';
const DRY_RUN    = process.argv.includes('--dry-run');

// --- Fetch recipients ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const { data: rows, error } = await supabase.from('registrations').select('clerk_user_id, email');
if (error) { console.error(error); process.exit(1); }

// Deduplicate by email (duplicate registrations exist in the DB)
const seen = new Set();
const recipients = rows
  .filter(r => { const e = r.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; })
  .map(r => ({ email: r.email, name: r.email.split('@')[0] }));

// --- Build email ---
function buildHtml(firstName) {
  return `<!-- your HTML here, use ${firstName} for personalisation -->`;
}

function buildText(firstName) {
  return `Hi ${firstName},\n\n...\n\nMichal Juhas\nAIwithMichal.com`;
}

// --- Send ---
console.log(`Sending to ${recipients.length} recipients${DRY_RUN ? ' (DRY RUN)' : ''}...`);

let sent = 0, failed = 0;
for (const r of recipients) {
  const firstName = r.name || r.email;
  if (DRY_RUN) { console.log('  would send to', r.email); continue; }
  try {
    await sgMail.send({
      to:      { email: r.email, name: r.name },
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO,
      subject: 'Your subject here',
      html:    buildHtml(firstName),
      text:    buildText(firstName),
    });
    console.log('✓', r.email);
    sent++;
  } catch (err) {
    console.error('✗', r.email, err.response?.body?.errors || err.message);
    failed++;
  }
}
if (!DRY_RUN) console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
```

## HTML email design system

Match the existing transactional emails in `lib/email.ts`:

| Element | Style |
|---|---|
| Background | `#f8fafc`, padding `40px 20px` |
| Container | `max-width: 600px`, centered |
| Header block | `background: #1e40af`, border-radius top, white text |
| Body block | `background: #ffffff`, border `1px solid #e2e8f0`, padding `40px` |
| Info box | `background: #f1f5f9`, border-radius `10px`, padding `24px` |
| Highlight box | `background: #eff6ff`, border-radius `10px` (blue tint) |
| CTA button | `background: #1d4ed8`, white text, padding `14px 32px`, border-radius `8px` |
| Body text | `color: #334155`, `font-size: 15px`, `line-height: 1.7` |
| Muted text | `color: #94a3b8`, `font-size: 12–13px` |
| Links | `color: #1d4ed8` |
| Font stack | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |

Always use inline CSS and table-based layout (no external stylesheets — email clients strip them).

## Michal's photo

Available at: `https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg`

Render as a circle:
```html
<img src="https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg"
     alt="Michal Juhas" width="88" height="88"
     style="border-radius: 50%; display: block; border: 3px solid #e2e8f0;" />
```

## Reference email

The welcome email sent on registration is the canonical example:
- HTML builder: `lib/email.ts` → `buildWelcomeHtml()`
- Webhook trigger: `app/api/webhooks/clerk/route.ts` → `sendWelcomeEmail()`

For newsletters, copy the HTML structure from `buildWelcomeHtml()` and adapt the content.
