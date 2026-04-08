#!/usr/bin/env node
/**
 * Create a complimentary (free) workshop order for a user.
 *
 * Usage:
 *   node --env-file=.env scripts/create-comp-order.mjs --email=user@example.com --workshop-slug=2026-04-16-ai-in-recruiting --tier=pro
 *   node --env-file=.env scripts/create-comp-order.mjs --clerk-user-id=user_abc123 --workshop-slug=2026-04-16-ai-in-recruiting --tier=basic
 *   node --env-file=.env scripts/create-comp-order.mjs --email=user@example.com --workshop-slug=2026-04-16-ai-in-recruiting --tier=pro --dry-run
 */

import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const MEETING_URL = process.env.WORKSHOP_MEETING_URL || "(meeting link will be sent separately)";
const MEMBERS_URL = "https://aiwithmichal.com/members";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");

function getArg(name) {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=").slice(1).join("=") : null;
}

const email = getArg("email");
let clerkUserId = getArg("clerk-user-id");
const workshopSlug = getArg("workshop-slug");
const tier = getArg("tier") || "basic";

if (!workshopSlug) {
  console.error("Missing required --workshop-slug=<slug>");
  process.exit(1);
}
if (!email && !clerkUserId) {
  console.error("Provide --email=<email> or --clerk-user-id=<id>");
  process.exit(1);
}
if (!["basic", "pro"].includes(tier)) {
  console.error("--tier must be 'basic' or 'pro'");
  process.exit(1);
}

async function supabaseRequest(method, path, body) {
  const opts = {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts);
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${method} ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

/** Human-readable label from slug, e.g. "Apr 16, 2026 — AI In Recruiting" */
function slugToLabel(slug) {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return slug;
  const d = new Date(`${match[1]}-${match[2]}-${match[3]}`);
  const datePart = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const namePart = slug
    .replace(/^\d{4}-\d{2}-\d{2}-?/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return namePart ? `${namePart} (${datePart})` : datePart;
}

async function sendConfirmationEmail(toEmail, workshopSlug, tier) {
  if (!SENDGRID_API_KEY) {
    console.log("  ⚠️  SENDGRID_API_KEY not set — skipping confirmation email");
    return;
  }

  const workshopLabel = slugToLabel(workshopSlug);
  const firstName = toEmail.split("@")[0];
  const tierLabel = tier === "pro" ? "Pro" : "Basic";

  const subject = `You're in — ${workshopLabel}`;
  const text = `Hi ${firstName},

Great news — you've been granted complimentary ${tierLabel} access to ${workshopLabel}.

You can access the pre-training materials and all workshop resources here:
${MEMBERS_URL}

Meeting link: ${MEETING_URL}

If you have any questions, just reply to this email.

See you there,
Michal`;

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: "hello@aiwithmichal.com", name: "Michal Juhas" },
      personalizations: [{ to: [{ email: toEmail }] }],
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
  // Resolve clerk_user_id from email if needed
  if (!clerkUserId && email) {
    const rows = await supabaseRequest(
      "GET",
      `registrations?select=clerk_user_id&email=eq.${encodeURIComponent(email)}`
    );
    if (!rows || rows.length === 0) {
      console.error(`No registration found for email: ${email}`);
      console.error("The user must sign up (register) on the site first.");
      process.exit(1);
    }
    clerkUserId = rows[0].clerk_user_id;
    console.log(`Resolved ${email} → clerk_user_id: ${clerkUserId}`);
  }

  // Check for existing paid order for this user + workshop
  const existing = await supabaseRequest(
    "GET",
    `orders?select=id,tier,order_type&clerk_user_id=eq.${clerkUserId}&workshop_slug=eq.${encodeURIComponent(workshopSlug)}&status=eq.paid`
  );
  if (existing && existing.length > 0) {
    const ex = existing[0];
    console.error(
      `User already has a paid order for this workshop (id: ${ex.id}, tier: ${ex.tier}, type: ${ex.order_type || "stripe"})`
    );
    process.exit(1);
  }

  const order = {
    clerk_user_id: clerkUserId,
    stripe_session_id: `comp_${randomUUID()}`,
    price_id: "comp",
    tier,
    amount_eur: 0,
    amount_net_eur: 0,
    status: "paid",
    workshop_slug: workshopSlug,
    order_type: "comp",
  };

  if (isDryRun) {
    console.log("\n[DRY RUN] Would insert order:");
    console.log(JSON.stringify(order, null, 2));
    return;
  }

  const [created] = await supabaseRequest("POST", "orders", order);
  console.log(`\nComp order created successfully!`);
  console.log(`  ID:       ${created.id}`);
  console.log(`  User:     ${clerkUserId}${email ? ` (${email})` : ""}`);
  console.log(`  Workshop: ${workshopSlug}`);
  console.log(`  Tier:     ${tier}`);

  // Send confirmation email
  let recipientEmail = email;
  if (!recipientEmail) {
    const rows = await supabaseRequest(
      "GET",
      `registrations?select=email&clerk_user_id=eq.${clerkUserId}`
    );
    recipientEmail = rows?.[0]?.email;
  }

  if (recipientEmail) {
    try {
      await sendConfirmationEmail(recipientEmail, workshopSlug, tier);
      console.log(`  Email:    Confirmation sent to ${recipientEmail}`);
    } catch (err) {
      console.error(`  ⚠️  Failed to send confirmation email: ${err.message}`);
    }
  } else {
    console.log("  ⚠️  No email found — skipping confirmation email");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
