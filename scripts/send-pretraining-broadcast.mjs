// scripts/send-pretraining-broadcast.mjs
// Sends pre-training announcement to all registered-but-not-paid users.
// Usage:
//   node --env-file=.env scripts/send-pretraining-broadcast.mjs --dry-run
//   node --env-file=.env scripts/send-pretraining-broadcast.mjs

import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'hello@aiwithmichal.com';
const FROM_NAME  = 'Michal Juhas';
const REPLY_TO   = process.env.ADMIN_EMAIL ?? 'hello@aiwithmichal.com';
const DRY_RUN    = process.argv.includes('--dry-run');
const TICKETS_URL = 'https://aiwithmichal.com/tickets';

// --- Fetch recipients: registered but not paid ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const [{ data: allRegs, error: regError }, { data: paidOrders, error: orderError }] = await Promise.all([
  supabase.from('registrations').select('clerk_user_id, email'),
  supabase.from('orders').select('clerk_user_id').eq('status', 'paid'),
]);

if (regError) { console.error('registrations error:', regError); process.exit(1); }
if (orderError) { console.error('orders error:', orderError); process.exit(1); }

const paidClerkIds = new Set(
  (paidOrders ?? []).map(o => o.clerk_user_id).filter(Boolean)
);

const seen = new Set();
const recipients = (allRegs ?? [])
  .filter(r => !paidClerkIds.has(r.clerk_user_id))
  .filter(r => { const e = r.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; })
  .map(r => ({ email: r.email, name: r.email.split('@')[0] }));

// --- Build email ---
function buildHtml(firstName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pre-training is live — AI with Michal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1e40af; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #93c5fd;">AI with Michal</p>
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">Pre-training is live today, ${firstName}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      Hi ${firstName},
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      I'm working on the pre-training materials and <strong>today you'll be able to access them and start learning about AI in recruiting</strong> — before the live workshop on April 2.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      This is your head start. Grab your ticket to unlock access.
                    </p>
                  </td>
                </tr>

                <!-- Four steps box -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #eff6ff; border-radius: 10px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700; color: #1e40af; letter-spacing: 0.05em; text-transform: uppercase;">4 Steps — How Recruiters Use AI</p>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 0 0 12px 0;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <tr>
                                    <td width="32" valign="top" style="padding-top: 1px;">
                                      <span style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; text-align: center; line-height: 22px;">1</span>
                                    </td>
                                    <td valign="top">
                                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Chatting</p>
                                      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569; line-height: 1.6;">Using AI assistants to draft messages, screen candidates, and get instant answers.</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0 0 12px 0;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <tr>
                                    <td width="32" valign="top" style="padding-top: 1px;">
                                      <span style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; text-align: center; line-height: 22px;">2</span>
                                    </td>
                                    <td valign="top">
                                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Systemizing</p>
                                      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569; line-height: 1.6;">Building repeatable prompts and structured workflows so AI produces consistent results every time.</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0 0 12px 0;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <tr>
                                    <td width="32" valign="top" style="padding-top: 1px;">
                                      <span style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; text-align: center; line-height: 22px;">3</span>
                                    </td>
                                    <td valign="top">
                                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Automating</p>
                                      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569; line-height: 1.6;">Connecting tools so sourcing, outreach, and follow-ups run without manual input.</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <tr>
                                    <td width="32" valign="top" style="padding-top: 1px;">
                                      <span style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; text-align: center; line-height: 22px;">4</span>
                                    </td>
                                    <td valign="top">
                                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">AI-Native</p>
                                      <p style="margin: 2px 0 0 0; font-size: 13px; color: #475569; line-height: 1.6;">Operating as a recruiter where AI handles the heavy lifting end-to-end — the new competitive edge.</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Level up message -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #f1f5f9; border-radius: 10px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.7;">
                            You'll learn <strong>how to level up with the right tool at each stage</strong> — so you're not just using AI, you're ahead of every recruiter who isn't.
                          </p>
                          <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                            The pre-training is included with your ticket. Book now and start today.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA button -->
                <tr>
                  <td style="padding: 0 0 36px 0; text-align: center;">
                    <a href="${TICKETS_URL}"
                      style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Book Your Ticket →
                    </a>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">Basic €79 &nbsp;|&nbsp; Pro (+ recording &amp; toolkit) €129</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 0 24px 0; border-top: 1px solid #e2e8f0;"></td>
                </tr>

                <!-- About Michal -->
                <tr>
                  <td style="padding: 0 0 20px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="100" valign="top" style="padding-right: 20px;">
                          <img src="https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg"
                               alt="Michal Juhas" width="88" height="88"
                               style="border-radius: 50%; display: block; border: 3px solid #e2e8f0;" />
                        </td>
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #0f172a;">Michal Juhas</p>
                          <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">Tech Recruiter turned AI Educator · AIwithMichal.com</p>
                          <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.7;">
                            I built this workshop to give recruiters a practical, step-by-step path through all four AI stages — from your first chat to running a fully AI-native pipeline.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                      Questions? Reply to this email or reach out at
                      <a href="mailto:hello@aiwithmichal.com" style="color: #1d4ed8;">hello@aiwithmichal.com</a>.
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;">— Michal Juhas / <a href="https://aiwithmichal.com" style="color: #cbd5e1; text-decoration: none;">AIwithMichal.com</a></p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(firstName) {
  return `Hi ${firstName},

I'm working on the pre-training materials and today you'll be able to access them and start learning about AI in recruiting — before the live workshop on April 2.

This is your head start. Grab your ticket to unlock access.

---

4 STEPS — HOW RECRUITERS USE AI

1. Chatting
   Using AI assistants to draft messages, screen candidates, and get instant answers.

2. Systemizing
   Building repeatable prompts and structured workflows so AI produces consistent results every time.

3. Automating
   Connecting tools so sourcing, outreach, and follow-ups run without manual input.

4. AI-Native
   Operating as a recruiter where AI handles the heavy lifting end-to-end — the new competitive edge.

---

You'll learn how to level up with the right tool at each stage. The pre-training is included with your ticket.

Book your ticket → https://aiwithmichal.com/tickets
Basic €79 | Pro (+ recording & toolkit) €129

---

Questions? Reply to this email or write to hello@aiwithmichal.com.

— Michal Juhas
AIwithMichal.com
`;
}

// --- Send ---
console.log(`\nRecipients: ${recipients.length} registered-but-not-paid users${DRY_RUN ? ' (DRY RUN — no emails sent)' : ''}`);
if (recipients.length === 0) {
  console.log('No recipients found. Exiting.');
  process.exit(0);
}

let sent = 0;
let failed = 0;

for (const r of recipients) {
  const firstName = r.name || r.email;
  if (DRY_RUN) {
    console.log('  would send to', r.email);
    continue;
  }
  try {
    await sgMail.send({
      to:      { email: r.email, name: r.name },
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO,
      subject: 'Pre-training is live today — start learning AI in recruiting',
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

if (!DRY_RUN) {
  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}
