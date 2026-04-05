// scripts/send-newsletter-spots.mjs
// One-off newsletter: limited spots + 24-hour 1-on-1 bonus offer
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'hello@aiwithmichal.com';
const FROM_NAME  = 'Michal Juhas';
const REPLY_TO   = process.env.ADMIN_EMAIL ?? 'hello@aiwithmichal.com';
const DRY_RUN    = process.argv.includes('--dry-run');

const recipients = [
  { email: 'hello@aiwithmichal.com', name: 'Michal' },
];

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
            <td style="background:#1e40af;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 16px 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;">AI with Michal · Workshop 2026</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Only a few spots left — and a special bonus if you act today</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:40px;">

              <!-- Greeting -->
              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">Hi ${firstName},</p>
              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">
                The <strong>AI with Michal workshop</strong> is on <strong>April 2, 2026</strong> — just 12 days away — and spots are filling up fast.
              </p>

              <!-- Urgency box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px 24px;">
                    <p style="margin:0;color:#991b1b;font-size:15px;font-weight:600;">⚠️ Limited availability — seats are going quickly</p>
                    <p style="margin:8px 0 0 0;color:#b91c1c;font-size:14px;line-height:1.6;">
                      Once they're gone, the doors close. There won't be a waitlist.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- 24h bonus highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:24px;">
                    <p style="margin:0 0 8px 0;color:#1e40af;font-size:16px;font-weight:700;">🎁 Buy in the next 24 hours — get a 1-on-1 session with me</p>
                    <p style="margin:0;color:#1e3a8a;font-size:14px;line-height:1.7;">
                      Register before this offer expires and I'll schedule a private 1-on-1 session with you personally — to answer your questions, review your use case, or help you build your first AI workflow.
                    </p>
                    <p style="margin:12px 0 0 0;color:#1e40af;font-size:13px;font-weight:600;">
                      This bonus is only available for the next 24 hours.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">
                In this hands-on workshop you'll learn how to build real AI-powered workflows, automate repetitive tasks, and use AI tools the way practitioners do — not just prompt-and-hope.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://aiwithmichal.com/tickets"
                       style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      Claim My Spot + 1-on-1 Bonus →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;color:#334155;font-size:15px;line-height:1.7;">
                You registered your interest earlier — this is your reminder that the workshop is almost here and the 1-on-1 bonus won't last long.
              </p>
              <p style="margin:0 0 32px 0;color:#334155;font-size:15px;line-height:1.7;">
                See you on April 2nd,
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
            <td style="padding:20px 40px;text-align:center;">
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

The AI with Michal workshop is on April 2, 2026 — just 12 days away — and spots are filling up fast.

⚠️ LIMITED SPOTS: Once they're gone, the doors close. There won't be a waitlist.

🎁 SPECIAL BONUS — next 24 hours only:
Buy your ticket before this offer expires and I'll schedule a private 1-on-1 session with you personally — to answer your questions, review your use case, or help you build your first AI workflow.

→ Claim your spot now: https://aiwithmichal.com/tickets

In this hands-on workshop you'll learn how to build real AI-powered workflows, automate repetitive tasks, and use AI tools the way practitioners do.

You registered your interest earlier — this is your reminder that the workshop is almost here and the 1-on-1 bonus won't last long.

See you on April 2nd,

Michal Juhas
AIwithMichal.com
https://aiwithmichal.com`;
}

console.log(`Sending to ${recipients.length} recipient(s)${DRY_RUN ? ' (DRY RUN)' : ''}...`);

for (const r of recipients) {
  const firstName = r.name || r.email.split('@')[0];
  if (DRY_RUN) {
    console.log('  would send to', r.email);
    console.log('\n--- SUBJECT ---');
    console.log('⚠️ Spots are going fast — and a 24-hour bonus for you');
    console.log('\n--- TEXT PREVIEW ---');
    console.log(buildText(firstName));
    continue;
  }
  try {
    await sgMail.send({
      to:      { email: r.email, name: r.name },
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO,
      subject: '⚠️ Spots are going fast — and a 24-hour bonus for you',
      html:    buildHtml(firstName),
      text:    buildText(firstName),
    });
    console.log('✓ Sent to', r.email);
  } catch (err) {
    console.error('✗', r.email, err.response?.body?.errors || err.message);
  }
}
