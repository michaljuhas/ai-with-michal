#!/usr/bin/env node
/**
 * Create a complimentary (free) workshop order for a user.
 *
 * Usage:
 *   node --env-file=.env scripts/create-comp-order.mjs --email=user@example.com --workshop-slug=2026-04-16-ai-in-recruiting --tier=pro
 *   node --env-file=.env scripts/create-comp-order.mjs --clerk-user-id=user_abc123 --workshop-slug=2026-04-16-ai-in-recruiting --tier=basic
 *   node --env-file=.env scripts/create-comp-order.mjs --email=user@example.com --workshop-slug=2026-04-16-ai-in-recruiting --tier=pro --dry-run
 *
 * Dry run: no DB insert, no email — prints the order JSON and the confirmation email body (plain + HTML)
 * that would be sent after a real run (when SENDGRID_API_KEY is set).
 */

import { randomUUID } from "node:crypto";
import { getPublicWorkshopEntry, workshopLabel } from "./workshop-registry.mjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const MEETING_URL = process.env.WORKSHOP_MEETING_URL || "(meeting link will be sent separately)";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com").replace(/\/$/, "");
const MEMBERS_URL = `${APP_URL}/members`;

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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildConfirmationEmailPayload(toEmail, workshopSlug, tier) {
  const entry = getPublicWorkshopEntry(workshopSlug);
  const workshopTitle = entry ? workshopLabel(entry) : slugToLabel(workshopSlug);
  const whenLine = entry ? `${entry.displayDate} · ${entry.displayTime}` : null;
  const workshopDetailUrl = `${APP_URL}/members/workshops/${encodeURIComponent(workshopSlug)}`;

  const firstName = toEmail.split("@")[0];
  const tierLabel = tier === "pro" ? "Pro" : "Basic";

  const subject = `You're in — ${workshopTitle}`;
  const text = `Hi ${firstName},

Great news — you've been granted complimentary ${tierLabel} access to ${workshopTitle}.

${whenLine ? `When (Central European Time): ${whenLine}\n\n` : ""}Your workshop page (sign in to your account to open it):
${workshopDetailUrl}

Open the workshop overview there to work through pre-training and to add the live session to your calendar — you can use Google Calendar, Outlook, or download an .ics file so you do not miss it.

All members-only workshops:
${MEMBERS_URL}

Video call link: ${MEETING_URL}
(After sign-in you will also find it under Live Workshop → Join.)

If you have any questions, just reply to this email.

See you there,
Michal`;

  const whenHtml = whenLine
    ? `<p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;"><strong>When (CET):</strong> ${escapeHtml(whenLine)}</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#1d4ed8;padding:24px 28px;">
              <p style="margin:0;color:#bfdbfe;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Complimentary access</p>
              <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">You&apos;re in — ${escapeHtml(workshopTitle)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;">Hi ${escapeHtml(firstName)},</p>
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;">Great news — you&apos;ve been granted complimentary <strong>${escapeHtml(tierLabel)}</strong> access.</p>
              ${whenHtml}
              <p style="margin:0 0 12px 0;color:#334155;font-size:15px;line-height:1.7;"><strong>Next step:</strong> open your <strong>workshop overview</strong> (members only). There you can review pre-training and <strong>add the live session to your calendar</strong> — Google Calendar, Outlook, or an .ics download.</p>
              <p style="margin:0 0 24px 0;">
                <a href="${escapeHtml(workshopDetailUrl)}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 22px;border-radius:8px;">Open workshop page</a>
              </p>
              <p style="margin:0 0 8px 0;color:#64748b;font-size:13px;">Or copy this link:</p>
              <p style="margin:0 0 24px 0;word-break:break-all;"><a href="${escapeHtml(workshopDetailUrl)}" style="color:#1d4ed8;font-size:13px;">${escapeHtml(workshopDetailUrl)}</a></p>
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;"><strong>Video call:</strong> <a href="${escapeHtml(MEETING_URL)}" style="color:#1d4ed8;">${escapeHtml(MEETING_URL)}</a><br/><span style="color:#64748b;font-size:13px;">Also under Live Workshop → Join after you sign in.</span></p>
              <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;"><a href="${escapeHtml(MEMBERS_URL)}" style="color:#1d4ed8;">All workshops (members home)</a></p>
              <p style="margin:24px 0 0 0;color:#334155;font-size:15px;line-height:1.7;">See you there,<br/>Michal</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

function printDryRunEmailPreview(toEmail, workshopSlug, tier) {
  const { subject, text, html } = buildConfirmationEmailPayload(toEmail, workshopSlug, tier);
  console.log("\n[DRY RUN] Confirmation email (not sent):");
  console.log(`  To:       ${toEmail}`);
  console.log(`  From:     hello@aiwithmichal.com (Michal Juhas)`);
  console.log(`  Subject:  ${subject}`);
  if (!SENDGRID_API_KEY) {
    console.log(
      "  Note:    SENDGRID_API_KEY not set — after a real insert the script would skip sending until it is set."
    );
  }
  console.log("\n  --- text/plain ---\n");
  for (const line of text.split("\n")) {
    console.log(`  ${line}`);
  }
  const htmlMax = 5000;
  console.log("\n  --- text/html ---\n");
  if (html.length <= htmlMax) {
    for (const line of html.split("\n")) {
      console.log(`  ${line}`);
    }
  } else {
    console.log(html.slice(0, htmlMax).replace(/^/gm, "  "));
    console.log(`  … (${html.length - htmlMax} more characters; full HTML is ${html.length} bytes)`);
  }
}

async function sendConfirmationEmail(toEmail, workshopSlug, tier) {
  if (!SENDGRID_API_KEY) {
    console.log("  ⚠️  SENDGRID_API_KEY not set — skipping confirmation email");
    return;
  }

  const { subject, text, html } = buildConfirmationEmailPayload(toEmail, workshopSlug, tier);

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
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
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

    let previewEmail = email;
    if (!previewEmail) {
      const rows = await supabaseRequest(
        "GET",
        `registrations?select=email&clerk_user_id=eq.${clerkUserId}`
      );
      previewEmail = rows?.[0]?.email;
    }

    if (previewEmail) {
      printDryRunEmailPreview(previewEmail, workshopSlug, tier);
    } else {
      console.log(
        "\n[DRY RUN] Confirmation email: no recipient address (pass --email= or ensure registration has email)."
      );
    }
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
