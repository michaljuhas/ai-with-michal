// One-off: reminder email to Eva about the workshop (CET — see AGENTS.md)
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: { email: 'evka.valovska@gmail.com', name: 'Eva' },
  from: { email: 'hello@aiwithmichal.com', name: 'Michal Juhas' },
  replyTo: process.env.ADMIN_EMAIL ?? 'hello@aiwithmichal.com',
  subject: 'Reminder: Workshop today · 4:00 PM – 5:30 PM CET',
  text: `Hi Eva,\n\nJust a quick reminder that we have a workshop today at 4:00 PM – 5:30 PM CET.\n\nSee you there!\n\nMichal`,
  html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#1e40af;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Workshop Reminder</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:40px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;">Hi Eva,</p>
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.7;">
                Just a quick reminder that we have a <strong>workshop today at 4:00 PM – 5:30 PM CET</strong>.
              </p>
              <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">See you there!</p>
              <p style="margin:24px 0 0 0;color:#334155;font-size:15px;">Michal</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

try {
  await sgMail.send(msg);
  console.log('Email sent to Eva (evka.valovska@gmail.com)');
} catch (err) {
  console.error('Failed to send email:', err.response?.body ?? err.message);
  process.exit(1);
}
