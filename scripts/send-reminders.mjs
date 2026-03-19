#!/usr/bin/env node
/**
 * Send reminder emails to all paid workshop attendees.
 * Usage:
 *   node --env-file=.env scripts/send-reminders.mjs                   # 1-week reminder
 *   node --env-file=.env scripts/send-reminders.mjs --type=dayBefore  # 1-day reminder
 *   node --env-file=.env scripts/send-reminders.mjs --type=dayOf      # day-of reminder
 *   node --env-file=.env scripts/send-reminders.mjs --dry-run         # preview only
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const MEETING_URL = process.env.WORKSHOP_MEETING_URL || "(meeting link will be sent separately)";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const typeArg = args.find((a) => a.startsWith("--type="));
const reminderType = typeArg ? typeArg.split("=")[1] : "week";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!SENDGRID_API_KEY && !isDryRun) {
  console.error("Missing SENDGRID_API_KEY (use --dry-run to preview)");
  process.exit(1);
}

const FROM_EMAIL = "hello@aiwithmichal.com";
const FROM_NAME = "Michal Juhas";
const WORKSHOP_DATE = "April 2, 2026";
const WORKSHOP_TIME = "3:00 PM – 4:30 PM UTC";

const TEMPLATES = {
  week: {
    subject: `1 week to go — AI Workshop · ${WORKSHOP_DATE}`,
    body: (name) => `Hi ${name},

Just a reminder: the AI workshop is one week away.

📅 ${WORKSHOP_DATE} · ${WORKSHOP_TIME}
🔗 Meeting link: ${MEETING_URL}

We'll be building an AI-powered talent discovery system live — hands-on, no slides. Make sure you have the link saved.

If you have any questions before we start, just reply to this email.

See you there,
Michal`,
  },
  dayBefore: {
    subject: `Tomorrow: AI Workshop · ${WORKSHOP_DATE}`,
    body: (name) => `Hi ${name},

The workshop is tomorrow!

📅 ${WORKSHOP_DATE} · ${WORKSHOP_TIME}
🔗 Meeting link: ${MEETING_URL}

Join a few minutes early so we can start on time. We'll dive straight into building.

See you tomorrow,
Michal`,
  },
  dayOf: {
    subject: `Starting in 1 hour — AI Workshop today at 3 PM UTC`,
    body: (name) => `Hi ${name},

The workshop starts in about an hour!

📅 Today · ${WORKSHOP_TIME}
🔗 Join here: ${MEETING_URL}

See you in a few,
Michal`,
  },
};

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function sendEmail(to, subject, text) {
  if (isDryRun) return;
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: FROM_EMAIL, name: FROM_NAME },
      personalizations: [{ to: [to] }],
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SendGrid error (${res.status}): ${err}`);
  }
}

async function main() {
  const template = TEMPLATES[reminderType];
  if (!template) {
    console.error(`Unknown reminder type: ${reminderType}. Use: week, dayBefore, dayOf`);
    process.exit(1);
  }

  console.log(`\nSending ${reminderType} reminders${isDryRun ? " (DRY RUN)" : ""}...\n`);

  const orders = await supabaseGet("orders?select=clerk_user_id,tier&status=eq.paid");
  const registrations = await supabaseGet("registrations?select=clerk_user_id,email");

  const emailByUserId = {};
  for (const r of registrations) {
    emailByUserId[r.clerk_user_id] = r.email;
  }

  let sent = 0;
  let failed = 0;

  for (const order of orders) {
    const email = emailByUserId[order.clerk_user_id];
    if (!email) {
      console.log(`  ⚠️  No email for user ${order.clerk_user_id}`);
      continue;
    }

    const name = email.split("@")[0];
    const subject = template.subject;
    const text = template.body(name);

    if (isDryRun) {
      console.log(`  [DRY RUN] Would send to: ${email}`);
      console.log(`  Subject: ${subject}\n`);
      sent++;
      continue;
    }

    try {
      await sendEmail({ email, name }, subject, text);
      console.log(`  ✓ Sent to ${email}`);
      sent++;
      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    } catch (err) {
      console.error(`  ✗ Failed for ${email}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${sent} sent, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
