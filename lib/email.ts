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

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "michal@michaljuhas.com";
}

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
                      <a href="mailto:michal@michaljuhas.com" style="color: #1d4ed8;">michal@michaljuhas.com</a>.
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
Questions? Reply to this email or write to michal@michaljuhas.com.

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

function buildWelcomeHtml(params: { firstName: string }) {
  const { firstName } = params;
  const ticketsUrl = "https://aiwithmichal.com/tickets";
  const photoUrl =
    "https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to AI with Michal</title>
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
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">Welcome, ${firstName}!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      Thanks for joining the community. I'm glad you're here.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      I run live implementation workshops for recruiting professionals who want to move beyond LinkedIn and build smarter, AI-powered talent pipelines. No fluff — we build real workflows during the session.
                    </p>
                  </td>
                </tr>

                <!-- Workshop box -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #f1f5f9; border-radius: 10px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Upcoming Live Workshop</p>
                          <p style="margin: 0 0 12px 0; font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.4;">${WORKSHOP.title}</p>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Date &amp; Time</p>
                          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${WORKSHOP.displayDate} · ${WORKSHOP.displayTime}</p>
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Tickets</p>
                          <p style="margin: 0; font-size: 15px; color: #334155;">
                            Basic — <strong>€79</strong> &nbsp;|&nbsp; Pro (+ recording &amp; toolkit) — <strong>€129</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA button -->
                <tr>
                  <td style="padding: 0 0 36px 0; text-align: center;">
                    <a href="${ticketsUrl}"
                      style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Get Your Ticket →
                    </a>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">Feel free to forward this to a colleague who'd benefit.</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 0 28px 0; border-top: 1px solid #e2e8f0;"></td>
                </tr>

                <!-- About Michal -->
                <tr>
                  <td style="padding: 0 0 20px 0;">
                    <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">About Your Host</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="100" valign="top" style="padding-right: 20px;">
                          <img src="${photoUrl}" alt="Michal Juhas" width="88" height="88"
                            style="border-radius: 50%; display: block; border: 3px solid #e2e8f0;" />
                        </td>
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #0f172a;">Michal Juhas</p>
                          <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">Tech Recruiter turned AI Educator · AIwithMichal.com</p>
                          <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.7;">
                            I spent years in the trenches of technical recruiting — sourcing engineers and product talent across Europe. When AI started reshaping how candidates are found, I switched to teaching recruiting professionals how to use these tools before the window of advantage closes.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Key insights -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border-radius: 10px; padding: 20px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #1e40af;">What makes this different</p>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.6;">
                                <span style="color: #1d4ed8; font-weight: 700;">→</span>&nbsp; <strong>Live implementation</strong> — you build real AI workflows during the session, not just watch slides
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.6;">
                                <span style="color: #1d4ed8; font-weight: 700;">→</span>&nbsp; <strong>Beyond LinkedIn</strong> — discover candidates using alternative data sources your competitors ignore
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.6;">
                                <span style="color: #1d4ed8; font-weight: 700;">→</span>&nbsp; <strong>Small group</strong> — direct access to Michal, real examples from actual recruiting campaigns
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; color: #334155; line-height: 1.6;">
                                <span style="color: #1d4ed8; font-weight: 700;">→</span>&nbsp; <strong>Immediately applicable</strong> — walk away with a workflow you can run next week
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                      See you inside,<br />
                      <strong>Michal Juhas</strong><br />
                      <a href="https://aiwithmichal.com" style="color: #1d4ed8; text-decoration: none;">AIwithMichal.com</a>
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8;">
                      Questions? Reply to this email or write to
                      <a href="mailto:michal@michaljuhas.com" style="color: #94a3b8;">michal@michaljuhas.com</a>.
                    </p>
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

function buildWelcomeText(params: { firstName: string }) {
  const { firstName } = params;
  return `Hi ${firstName},

Thanks for joining the AI with Michal community. I'm glad you're here.

I run live implementation workshops for recruiting professionals who want to move beyond LinkedIn and build smarter, AI-powered talent pipelines. No fluff — we build real workflows during the session.

---

UPCOMING LIVE WORKSHOP
${WORKSHOP.title}

Date: ${WORKSHOP.displayDate} · ${WORKSHOP.displayTime}
Tickets: Basic €79 | Pro (+ recording & toolkit) €129

Get your ticket → https://aiwithmichal.com/tickets

Feel free to forward this to a colleague who'd benefit.

---

ABOUT YOUR HOST

I'm Michal Juhas — a tech recruiter turned AI educator. I spent years sourcing engineers and product talent across Europe. When AI started reshaping how candidates are found, I switched to teaching recruiting professionals how to use these tools before the window of advantage closes.

What makes this workshop different:
→ Live implementation — you build real AI workflows during the session
→ Beyond LinkedIn — discover candidates using alternative data sources
→ Small group — direct access to me, real examples from actual campaigns
→ Immediately applicable — walk away with a workflow you can run next week

---

See you inside,
Michal Juhas
AIwithMichal.com

Questions? Reply to this email or write to michal@michaljuhas.com.
`;
}

export async function sendWelcomeEmail(params: {
  toEmail: string;
  toName: string;
}) {
  const { toEmail, toName } = params;
  const firstName = toName.split(" ")[0] || toName;

  const mail = getSendGrid();
  await mail.send({
    to: { email: toEmail, name: toName },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: getAdminEmail(),
    subject: "Welcome to AI with Michal",
    html: buildWelcomeHtml({ firstName }),
    text: buildWelcomeText({ firstName }),
  });
}

export async function notifyAdminNewRegistration(params: {
  clerkUserId: string;
  email: string;
}) {
  const { clerkUserId, email } = params;
  const admin = getAdminEmail();
  const mail = getSendGrid();
  const subject = `[AI with Michal] New registration — ${email}`;
  const text = `Someone registered on the site.

Email: ${email}
Clerk user ID: ${clerkUserId}`;
  const html = `<p style="font-family: sans-serif; font-size: 15px; color: #334155; line-height: 1.5;">
  <strong>New registration</strong></p>
  <table style="font-family: sans-serif; font-size: 14px; color: #475569;" cellpadding="0" cellspacing="0">
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Clerk user ID</strong></td><td><code>${escapeHtml(clerkUserId)}</code></td></tr>
  </table>`;
  await mail.send({
    to: admin,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    text,
    html,
  });
}

export async function notifyAdminPaymentCompleted(params: {
  clerkUserId: string;
  tier: TicketTier;
  amountEur: number;
  stripeSessionId: string;
  customerEmail?: string;
}) {
  const { clerkUserId, tier, amountEur, stripeSessionId, customerEmail } =
    params;
  const admin = getAdminEmail();
  const mail = getSendGrid();
  const tierLabel = TIER_LABEL[tier];
  const subject = `[AI with Michal] Payment completed — ${tierLabel} (€${amountEur})`;
  const emailLine = customerEmail
    ? `Customer email: ${customerEmail}\n`
    : "";
  const text = `A workshop payment was completed.

${emailLine}Tier: ${tierLabel}
Amount: €${amountEur}
Stripe session: ${stripeSessionId}
Clerk user ID: ${clerkUserId}`;
  const emailRow = customerEmail
    ? `<tr><td style="padding: 4px 16px 4px 0;"><strong>Customer email</strong></td><td>${escapeHtml(customerEmail)}</td></tr>`
    : "";
  const html = `<p style="font-family: sans-serif; font-size: 15px; color: #334155; line-height: 1.5;">
  <strong>Payment completed</strong></p>
  <table style="font-family: sans-serif; font-size: 14px; color: #475569;" cellpadding="0" cellspacing="0">
  ${emailRow}
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Tier</strong></td><td>${escapeHtml(tierLabel)}</td></tr>
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Amount</strong></td><td>€${amountEur}</td></tr>
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Stripe session</strong></td><td><code>${escapeHtml(stripeSessionId)}</code></td></tr>
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Clerk user ID</strong></td><td><code>${escapeHtml(clerkUserId)}</code></td></tr>
  </table>`;
  await mail.send({
    to: admin,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    text,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
