/**
 * scripts/send-newsletter-tra-workshop.mjs
 *
 * One-off broadcast: AI with Michal workshop announcement
 * Audience : Tech Recruitment Academy subscribers (CSV export)
 * FROM/REPLY: michal@techrecruitmentacademy.com
 *
 * Usage:
 *   node --env-file=.env scripts/send-newsletter-tra-workshop.mjs --dry-run
 *   node --env-file=.env scripts/send-newsletter-tra-workshop.mjs --to test@example.com
 *   node --env-file=.env scripts/send-newsletter-tra-workshop.mjs
 *
 * Progress is saved to scripts/send-newsletter-tra-workshop.progress.json
 * so the script can be safely resumed if interrupted.
 */

import sgMail from '@sendgrid/mail';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const FROM_EMAIL  = 'michal@techrecruitmentacademy.com';
const FROM_NAME   = 'Michal Juhas';
const REPLY_TO    = 'michal@techrecruitmentacademy.com';
const SUBJECT     = '🎉 New live workshop: AI for Recruiters — April 2nd';
const CTA_URL     = 'https://aiwithmichal.com/tickets?utm_source=tra-newsletter&utm_medium=email&utm_campaign=workshop-apr2';
const BATCH_SIZE  = 100;        // emails per batch
const BATCH_DELAY = 500;        // ms pause between batches

const DRY_RUN     = process.argv.includes('--dry-run');
const TO_ARG      = process.argv.includes('--to') ? process.argv[process.argv.indexOf('--to') + 1] : null;

const __dirname   = dirname(fileURLToPath(import.meta.url));
const CSV_PATH    = join(__dirname, '../data/2026-03-28-export-customers-for-AI-with-Michal.csv');
const PROGRESS_FILE = join(__dirname, 'send-newsletter-tra-workshop.progress.json');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  let headers = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQuote = !inQuote; }
      else if (c === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    cols.push(cur.trim());
    if (!headers) {
      headers = cols;
    } else {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cols[i] ?? ''; });
      rows.push(obj);
    }
  }
  return rows;
}

// ─── Load & clean recipients ─────────────────────────────────────────────────

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const raw = readFileSync(CSV_PATH, 'utf8');
const allRows = parseCSV(raw);

// If --to override, send only to that address
if (TO_ARG) {
  const r = { email: TO_ARG, name: TO_ARG.split('@')[0] };
  console.log(`📤 Test send to: ${r.email}`);
  await sgMail.send({
    to:      { email: r.email, name: r.name },
    from:    { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: REPLY_TO,
    subject: SUBJECT,
    html:    buildHtml(r.name),
    text:    buildText(r.name),
  });
  console.log(`✅ Test email sent to ${r.email}`);
  process.exit(0);
}

const seen = new Set();
const recipients = allRows
  .filter(r => emailRe.test(r.email_address))
  .filter(r => {
    const e = r.email_address.toLowerCase();
    if (seen.has(e)) return false;
    seen.add(e);
    return true;
  })
  .map(r => ({
    email: r.email_address.trim(),
    name:  r.name.trim() || r.email_address.split('@')[0],
  }));

console.log(`📋 Loaded ${recipients.length} valid, deduplicated recipients from CSV`);

// ─── Progress tracking ────────────────────────────────────────────────────────

let progress = { sent: [], failed: [] };
if (existsSync(PROGRESS_FILE)) {
  progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
  console.log(`⏩ Resuming — already sent: ${progress.sent.length}, failed: ${progress.failed.length}`);
}
const sentSet = new Set(progress.sent);

function saveProgress() {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ─── Email builders ───────────────────────────────────────────────────────────

function firstName(fullName) {
  return fullName.split(/\s+/)[0];
}

function buildHtml(name) {
  const first = firstName(name);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media (max-width: 600px) {
      .wrapper  { padding: 12px 0 !important; }
      .container { width: 100% !important; }
      .header   { padding: 24px 16px !important; }
      .header h1 { font-size: 22px !important; }
      .body     { padding: 24px 16px !important; }
      .highlight { padding: 16px !important; }
      .footer   { padding: 16px !important; }
      .cta-btn  { display: block !important; padding: 14px 20px !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" class="wrapper" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" class="container" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td class="header" style="background:#1e40af;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 12px 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Exciting News</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">
                New Live Workshop:<br>AI for Recruiters &amp; Talent Acquisition
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body" style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:40px;">

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">Hi ${first},</p>

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">
                I have exciting news to share — I'm running a <strong>brand new live workshop</strong> designed specifically for recruiters and talent acquisition managers who want to start using AI in their day-to-day work.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td class="highlight" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:24px 28px;">
                    <p style="margin:0 0 12px 0;color:#1e40af;font-size:17px;font-weight:700;">🗓️ AI with Michal — Live Workshop</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;padding-right:12px;font-weight:600;">📅 Date</td>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;">April 2, 2026</td>
                      </tr>
                      <tr>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;padding-right:12px;font-weight:600;">🎤 Host</td>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;">Michal Juhas — live, hands-on</td>
                      </tr>
                      <tr>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;padding-right:12px;font-weight:600;">👥 For</td>
                        <td style="color:#1e3a8a;font-size:14px;padding:4px 0;">Recruiters &amp; Talent Acquisition Managers</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;">
                In this hands-on session you'll learn how to:
              </p>
              <ul style="margin:0 0 24px 0;padding-left:20px;color:#334155;font-size:15px;line-height:1.9;">
                <li>Use AI tools to source, screen, and engage candidates faster</li>
                <li>Build automated workflows that handle repetitive recruiting tasks</li>
                <li>Write better job descriptions and outreach messages with AI</li>
                <li>Stay ahead as AI reshapes the recruiting profession</li>
              </ul>

              <p style="margin:0 0 28px 0;color:#334155;font-size:15px;line-height:1.7;">
                Spots are limited — this is a small, interactive session, not a webinar where you sit and watch.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${CTA_URL}" class="cta-btn"
                       style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      Reserve My Spot →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;color:#334155;font-size:15px;line-height:1.7;">
                Hope to see you on April 2nd!
              </p>
              <p style="margin:0 0 32px 0;color:#334155;font-size:15px;line-height:1.7;">
                — Michal
              </p>

              <!-- Signature -->
              <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;padding-top:24px;width:100%;">
                <tr>
                  <td style="padding-right:16px;vertical-align:middle;width:72px;">
                    <img src="https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg"
                         alt="Michal Juhas" width="60" height="60"
                         style="border-radius:50%;display:block;border:3px solid #e2e8f0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;color:#334155;font-size:15px;font-weight:600;">Michal Juhas</p>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">AI in Recruiting &amp; HR</p>
                    <p style="margin:2px 0 0 0;font-size:13px;">
                      <a href="https://aiwithmichal.com" style="color:#1d4ed8;text-decoration:none;">aiwithmichal.com</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                You're receiving this because you were a student or subscriber at Tech Recruitment Academy.<br>
                To unsubscribe, reply with "unsubscribe" or email
                <a href="mailto:michal@techrecruitmentacademy.com?subject=unsubscribe" style="color:#94a3b8;">michal@techrecruitmentacademy.com</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(name) {
  const first = firstName(name);
  return `Hi ${first},

I have exciting news — I'm running a brand new live workshop designed specifically for recruiters and talent acquisition managers who want to start using AI in their work.

🗓️ AI with Michal — Live Workshop
  Date : April 2, 2026
  Host : Michal Juhas — live, hands-on
  For  : Recruiters & Talent Acquisition Managers

In this hands-on session you'll learn how to:
- Use AI tools to source, screen, and engage candidates faster
- Build automated workflows that handle repetitive recruiting tasks
- Write better job descriptions and outreach messages with AI
- Stay ahead as AI reshapes the recruiting profession

Spots are limited — this is a small, interactive session, not a passive webinar.

→ Reserve your spot: ${CTA_URL}

Hope to see you on April 2nd!

— Michal

──────────────────────────
Michal Juhas
AI in Recruiting & HR
https://aiwithmichal.com

You're receiving this because you were a student or subscriber at Tech Recruitment Academy.
To unsubscribe, reply with "unsubscribe" or email michal@techrecruitmentacademy.com.`;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

const pending = recipients.filter(r => !sentSet.has(r.email.toLowerCase()));
console.log(`📤 Pending: ${pending.length} emails${DRY_RUN ? ' (DRY RUN — nothing will be sent)' : ''}\n`);

if (DRY_RUN) {
  console.log('Subject:', SUBJECT);
  console.log('From   :', `${FROM_NAME} <${FROM_EMAIL}>`);
  console.log('Reply-To:', REPLY_TO);
  console.log('\n--- TEXT PREVIEW (first recipient) ---\n');
  console.log(buildText(pending[0]?.name ?? 'Test User'));
  console.log('\n--- FIRST 5 RECIPIENTS ---');
  pending.slice(0, 5).forEach(r => console.log(' ', r.email, `(${r.name})`));
  console.log(`  ... and ${pending.length - 5} more`);
  process.exit(0);
}

let sent = 0, failed = 0;

for (let i = 0; i < pending.length; i += BATCH_SIZE) {
  const batch = pending.slice(i, i + BATCH_SIZE);
  const results = await Promise.allSettled(
    batch.map(r =>
      sgMail.send({
        to:      { email: r.email, name: r.name },
        from:    { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO,
        subject: SUBJECT,
        html:    buildHtml(r.name),
        text:    buildText(r.name),
      })
    )
  );

  for (let j = 0; j < batch.length; j++) {
    const r = batch[j];
    if (results[j].status === 'fulfilled') {
      progress.sent.push(r.email.toLowerCase());
      sent++;
      console.log(`✓ [${sent + failed}/${pending.length}] ${r.email}`);
    } else {
      const errMsg = results[j].reason?.response?.body?.errors?.[0]?.message
                   ?? results[j].reason?.message ?? 'unknown error';
      progress.failed.push({ email: r.email, error: errMsg });
      failed++;
      console.error(`✗ [${sent + failed}/${pending.length}] ${r.email} — ${errMsg}`);
    }
  }

  saveProgress();

  if (i + BATCH_SIZE < pending.length) {
    await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
  }
}

console.log(`\n✅ Done. Sent: ${sent} | Failed: ${failed} | Progress saved to: ${PROGRESS_FILE}`);
if (failed > 0) {
  console.log('Failed addresses logged in progress file — re-run the script to retry them.');
}
