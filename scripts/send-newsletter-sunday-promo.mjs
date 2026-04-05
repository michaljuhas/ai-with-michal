// scripts/send-newsletter-sunday-promo.mjs
// Sunday promo broadcast to unpaid registrants: 50% off next workshop for AI with Michal members
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'hello@aiwithmichal.com';
const FROM_NAME  = 'Michal Juhas';
const REPLY_TO   = process.env.ADMIN_EMAIL ?? 'hello@aiwithmichal.com';
const DRY_RUN    = process.argv.includes('--dry-run');

// --- Fetch unpaid registrants ---
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

const paidIds = new Set((paidOrders ?? []).map(o => o.clerk_user_id).filter(Boolean));
const seen = new Set();
const recipients = (allRegs ?? [])
  .filter(r => !paidIds.has(r.clerk_user_id))
  .filter(r => {
    const e = r.email.toLowerCase();
    if (seen.has(e)) return false;
    seen.add(e);
    return true;
  })
  .map(r => ({ email: r.email, name: r.email.split('@')[0] }));

// --- Email content ---
const SUBJECT = 'Small Sunday bonus for you';

function buildHtml(firstName) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1e40af;border-radius:12px 12px 0 0;padding:32px 20px;text-align:center;">
              <p style="margin:0 0 12px 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;">AI with Michal · April 2, 2026</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Small Sunday bonus</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:40px 20px;">

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">Hi ${firstName},</p>

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">
                Anyone who grabs a ticket to Thursday's workshop today gets <strong>50% off the next one</strong> in the AI recruiting series — as a thank-you for being an early member of AI with Michal.
              </p>

              <p style="margin:0 0 28px 0;color:#334155;font-size:15px;line-height:1.7;">
                I'll send the code personally after you purchase. One-day offer.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:24px;">
                    <p style="margin:0 0 8px 0;color:#1e40af;font-size:15px;font-weight:700;">What you get today</p>
                    <p style="margin:0 0 8px 0;color:#1e3a8a;font-size:14px;line-height:1.7;">
                      ✓ Live 90-minute AI recruiting workshop — Thursday, April 2nd
                    </p>
                    <p style="margin:0 0 8px 0;color:#1e3a8a;font-size:14px;line-height:1.7;">
                      ✓ Pre-training materials + live Q&amp;A with Michal
                    </p>
                    <p style="margin:0;color:#1e3a8a;font-size:14px;line-height:1.7;">
                      ✓ <strong>50% off the next workshop</strong> in the series (as an AI with Michal member)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://aiwithmichal.com/tickets"
                       style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      Get My Ticket →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px 0;color:#334155;font-size:15px;line-height:1.7;">
                Hope to see you Thursday,
              </p>

              <!-- Signature -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:16px;vertical-align:middle;">
                    <img src="https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg"
                         alt="Michal Juhas" width="56" height="56"
                         style="border-radius:50%;display:block;border:3px solid #e2e8f0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;color:#334155;font-size:15px;font-weight:600;">Michal Juhas</p>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">
                      <a href="https://aiwithmichal.com" style="color:#1d4ed8;text-decoration:none;">AIwithMichal.com</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                You're receiving this because you registered at aiwithmichal.com.<br>
                <a href="https://aiwithmichal.com" style="color:#94a3b8;">AIwithMichal.com</a>
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

function buildText(firstName) {
  return `Hi ${firstName},

Anyone who grabs a ticket to Thursday's workshop today gets 50% off the next one in the AI recruiting series — as a thank-you for being an early member of AI with Michal.

I'll send the code personally after you purchase. One-day offer.

WHAT YOU GET TODAY
------------------
✓ Live 90-minute AI recruiting workshop — Thursday, April 2nd
✓ Pre-training materials + live Q&A with Michal
✓ 50% off the next workshop in the series (as an AI with Michal member)

→ Get your ticket: https://aiwithmichal.com/tickets

Hope to see you Thursday,

Michal Juhas
AIwithMichal.com
https://aiwithmichal.com`;
}

// --- Send ---
console.log(`Sending to ${recipients.length} unpaid recipient(s)${DRY_RUN ? ' (DRY RUN)' : ''}...`);

let sent = 0, failed = 0;
for (const r of recipients) {
  const firstName = r.name || r.email.split('@')[0];
  if (DRY_RUN) {
    console.log('  would send to', r.email);
    if (recipients.indexOf(r) === 0) {
      console.log('\n--- SUBJECT ---');
      console.log(SUBJECT);
      console.log('\n--- TEXT PREVIEW ---');
      console.log(buildText(firstName));
    }
    continue;
  }
  try {
    await sgMail.send({
      to:      { email: r.email, name: r.name },
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO,
      subject: SUBJECT,
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
