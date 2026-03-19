import sgMail from "@sendgrid/mail";
import { WORKSHOP } from "@/lib/workshop";

function getSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
  sgMail.setApiKey(apiKey);
  return sgMail;
}

const FROM_EMAIL = "hello@aiwithmichal.com";
const FROM_NAME = "Michal Juhas";

export type TicketTier = "basic" | "pro";

const TIER_LABEL: Record<TicketTier, string> = {
  basic: "Workshop Ticket",
  pro: "Workshop + Toolkit",
};

const TIER_EXTRAS: Record<TicketTier, string> = {
  basic: "",
  pro: `
      <tr>
        <td style="padding: 0 0 16px 0;">
          <p style="margin: 0; font-size: 15px; color: #334155;">
            As a <strong>Workshop + Toolkit</strong> ticket holder you'll also receive:
          </p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.7;">
            <li>Full workshop recording (within 48 hours)</li>
            <li>Workflow templates</li>
            <li>AI Talent Discovery Toolkit</li>
          </ul>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8;">
            Toolkit materials will be emailed to you before the workshop starts.
          </p>
        </td>
      </tr>`,
};

function buildConfirmationHtml(params: {
  firstName: string;
  tier: TicketTier;
  meetingUrl: string;
}) {
  const { firstName, tier, meetingUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're registered — AI with Michal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1e40af; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #93c5fd;">Payment Confirmed</p>
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">You're in, ${firstName}!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                      Thank you for registering for <strong>${WORKSHOP.title}</strong>. 
                      Here are your workshop details.
                    </p>
                  </td>
                </tr>

                <!-- Workshop details box -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #f1f5f9; border-radius: 10px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Date &amp; Time</p>
                          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${WORKSHOP.displayDate} · ${WORKSHOP.displayTime}</p>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Ticket</p>
                          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${TIER_LABEL[tier]}</p>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Your Meeting Link</p>
                          <a href="${meetingUrl}" style="font-size: 15px; font-weight: 600; color: #1d4ed8; text-decoration: none;">${meetingUrl}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Join button -->
                <tr>
                  <td style="padding: 0 0 28px 0; text-align: center;">
                    <a href="${meetingUrl}"
                      style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Join Workshop on April 2 →
                    </a>
                  </td>
                </tr>

                ${TIER_EXTRAS[tier]}

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 0 24px 0; border-top: 1px solid #e2e8f0;"></td>
                </tr>

                <!-- Add to calendar nudge -->
                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #0f172a;">Don't forget to save the date</p>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                      Add it to your calendar so you don't miss it —
                      <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(WORKSHOP.title)}&dates=${WORKSHOP.startDate}%2F${WORKSHOP.endDate}&details=${encodeURIComponent(WORKSHOP.description)}&location=${encodeURIComponent(meetingUrl)}"
                        style="color: #1d4ed8;">Google Calendar</a>
                      or
                      <a href="https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(WORKSHOP.title)}&startdt=${WORKSHOP.startDate}&enddt=${WORKSHOP.endDate}&body=${encodeURIComponent(WORKSHOP.description)}&location=${encodeURIComponent(meetingUrl)}"
                        style="color: #1d4ed8;">Outlook</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                      Questions? Reply to this email or reach out at
                      <a href="mailto:hello@aiwithmichal.com" style="color: #1d4ed8;">hello@aiwithmichal.com</a>.
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;">— Michal Juhas</p>
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

function buildConfirmationText(params: {
  firstName: string;
  tier: TicketTier;
  meetingUrl: string;
}) {
  const { firstName, tier, meetingUrl } = params;
  return `Hi ${firstName},

You're registered for: ${WORKSHOP.title}

DATE & TIME: ${WORKSHOP.displayDate} · ${WORKSHOP.displayTime}
TICKET: ${TIER_LABEL[tier]}
MEETING LINK: ${meetingUrl}

Save this link — you'll use it to join on April 2nd.
${
  tier === "pro"
    ? `
As a Workshop + Toolkit ticket holder, you'll also receive the recording, workflow templates, and the AI Talent Discovery Toolkit within 48 hours after the workshop.
`
    : ""
}
Questions? Reply to this email or write to hello@aiwithmichal.com.

— Michal Juhas
`;
}

export async function sendWorkshopConfirmation(params: {
  toEmail: string;
  toName: string;
  tier: TicketTier;
}) {
  const { toEmail, toName, tier } = params;
  const meetingUrl = process.env.WORKSHOP_MEETING_URL;
  if (!meetingUrl) throw new Error("WORKSHOP_MEETING_URL is not set");

  const firstName = toName.split(" ")[0] || toName;

  const mail = getSendGrid();
  await mail.send({
    to: { email: toEmail, name: toName },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `You're in — ${WORKSHOP.title} · ${WORKSHOP.displayDate}`,
    html: buildConfirmationHtml({ firstName, tier, meetingUrl }),
    text: buildConfirmationText({ firstName, tier, meetingUrl }),
  });
}
