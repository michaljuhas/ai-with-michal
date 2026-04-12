import sgMail from "@sendgrid/mail";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";
import { WORKSHOP } from "@/lib/workshop";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appBaseUrl(): string {
  const u = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/$/, "");
  return u || "https://aiwithmichal.com";
}

function getSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
  sgMail.setApiKey(apiKey);
  return sgMail;
}

const FROM_EMAIL = "hello@aiwithmichal.com";
const FROM_NAME = "Michal Juhas";

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? PUBLIC_CONTACT_EMAIL;
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
                      <a href="mailto:${PUBLIC_CONTACT_EMAIL}" style="color: #1d4ed8;">${PUBLIC_CONTACT_EMAIL}</a>.
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
Questions? Reply to this email or write to ${PUBLIC_CONTACT_EMAIL}.

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

function buildWelcomeHtml(params: {
  firstName: string;
  workshopTitle: string;
  displayDate: string;
  displayTime: string;
  ticketsUrl: string;
}) {
  const { firstName, workshopTitle, displayDate, displayTime, ticketsUrl } = params;
  const titleHtml = escapeHtml(workshopTitle);
  const dateTimeBlock =
    displayDate.trim() && displayTime.trim()
      ? `<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Date &amp; Time</p>
                          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(displayDate)} · ${escapeHtml(displayTime)}</p>`
      : displayDate.trim()
        ? `<p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Date</p>
                          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(displayDate)}</p>`
        : "";

  const photoUrl =
    "https://aiwithmichal.com/Michal-Juhas-headshot-square-v1.jpg";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to AI with Michal</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-outer { padding: 16px 8px !important; }
      .email-header { padding: 24px 20px !important; }
      .email-body { padding: 24px 20px 20px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-outer" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td class="email-header" style="background-color: #1e40af; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #93c5fd;">AI with Michal</p>
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">Welcome, ${firstName}!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="background-color: #ffffff; padding: 40px 40px 32px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      Thanks for joining the community. I'm glad you're here.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      I run live implementation workshops for recruiting professionals who want to move beyond LinkedIn and build smarter, AI-powered talent pipelines. No fluff — we build real workflows during the session.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.7;">
                      You're one step away from securing your seat for <strong>${titleHtml}</strong> — use the button below to continue to checkout.
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
                          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Your workshop</p>
                          <p style="margin: 0 0 12px 0; font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.4;">${titleHtml}</p>
                          ${dateTimeBlock}
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
                    <a href="${escapeHtml(ticketsUrl)}"
                      style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Continue to checkout →
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
                      <a href="mailto:${PUBLIC_CONTACT_EMAIL}" style="color: #94a3b8;">${PUBLIC_CONTACT_EMAIL}</a>.
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

function buildWelcomeText(params: {
  firstName: string;
  workshopTitle: string;
  displayDate: string;
  displayTime: string;
  ticketsUrl: string;
}) {
  const { firstName, workshopTitle, displayDate, displayTime, ticketsUrl } = params;
  const dateLine =
    displayDate.trim() && displayTime.trim()
      ? `Date: ${displayDate} · ${displayTime}`
      : displayDate.trim()
        ? `Date: ${displayDate}`
        : "";
  return `Hi ${firstName},

Thanks for joining the AI with Michal community. I'm glad you're here.

I run live implementation workshops for recruiting professionals who want to move beyond LinkedIn and build smarter, AI-powered talent pipelines. No fluff — we build real workflows during the session.

You're one step away from securing your seat for ${workshopTitle}.

---

YOUR WORKSHOP
${workshopTitle}

${dateLine ? `${dateLine}\n` : ""}Tickets: Basic €79 | Pro (+ recording & toolkit) €129

Continue to checkout → ${ticketsUrl}

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

Questions? Reply to this email or write to ${PUBLIC_CONTACT_EMAIL}.
`;
}

export async function sendWelcomeEmail(params: {
  toEmail: string;
  toName: string;
  workshop: {
    slug: string;
    title: string;
    displayDate: string;
    displayTime: string;
  };
}) {
  const { toEmail, toName, workshop } = params;
  const firstName = toName.split(" ")[0] || toName;
  const ticketsUrl = `${appBaseUrl()}/workshops/${workshop.slug}/tickets`;

  const mail = getSendGrid();
  await mail.send({
    to: { email: toEmail, name: toName },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: getAdminEmail(),
    subject: "Welcome to AI with Michal",
    html: buildWelcomeHtml({
      firstName,
      workshopTitle: workshop.title,
      displayDate: workshop.displayDate,
      displayTime: workshop.displayTime,
      ticketsUrl,
    }),
    text: buildWelcomeText({
      firstName,
      workshopTitle: workshop.title,
      displayDate: workshop.displayDate,
      displayTime: workshop.displayTime,
      ticketsUrl,
    }),
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
  amountEur: number;
  stripeSessionId: string;
  customerEmail?: string;
  /** Workshop / course checkout — label from tier map. */
  tier?: TicketTier;
  /** When set (e.g. annual membership), used instead of `tier` for admin email subject/body. */
  productSummary?: string;
}) {
  const { clerkUserId, tier, amountEur, stripeSessionId, customerEmail, productSummary } =
    params;
  const admin = getAdminEmail();
  const mail = getSendGrid();
  const tierLabel =
    productSummary ?? (tier != null ? TIER_LABEL[tier] : "Payment");
  const subject = `[AI with Michal] Payment completed — ${tierLabel} (€${amountEur})`;
  const emailLine = customerEmail
    ? `Customer email: ${customerEmail}\n`
    : "";
  const text = `A payment was completed.

${emailLine}Product: ${tierLabel}
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
  <tr><td style="padding: 4px 16px 4px 0;"><strong>Product</strong></td><td>${escapeHtml(tierLabel)}</td></tr>
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

export async function notifyAdminNewB2BLead(params: {
  name: string;
  email: string;
  company?: string | null;
  role?: string | null;
  interest_type: "workshop" | "integration" | "contact";
  services?: string[] | null;
  message?: string | null;
  source_type?: string | null;
  source_detail?: string | null;
  referrer?: string | null;
  landing_page?: string | null;
}) {
  const {
    name,
    email,
    company,
    role,
    interest_type,
    services,
    message,
    source_type,
    source_detail,
    referrer,
    landing_page,
  } = params;

  const admin = getAdminEmail();
  const mail = getSendGrid();
  const typeLabel =
    interest_type === "workshop"
      ? "AI Workshops for Teams"
      : interest_type === "integration"
        ? "AI Integrations"
        : "Contact / Consulting";
  const subject = `[AI with Michal] New B2B lead — ${name} (${interest_type})`;

  const servicesLine = services && services.length > 0 ? services.join(", ") : "—";
  const sourceLine = source_type
    ? `${source_type}${source_detail ? ` — ${source_detail}` : ""}`
    : "—";

  const text = `New B2B lead from ${typeLabel}.

Name:        ${name}
Email:       ${email}
Company:     ${company || "—"}
Role:        ${role || "—"}
Interested in: ${servicesLine}
Message:     ${message || "—"}

Attribution: ${sourceLine}
Referrer:    ${referrer || "—"}
Landing page: ${landing_page || "—"}

Reply directly to this email to respond to ${name}.`;

  const optionalRow = (label: string, value: string | null | undefined) =>
    value
      ? `<tr><td style="padding:4px 16px 4px 0;color:#64748b;white-space:nowrap;"><strong>${label}</strong></td><td style="padding:4px 0;color:#334155;">${escapeHtml(value)}</td></tr>`
      : "";

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#1e40af;border-radius:10px 10px 0 0;padding:24px 32px;">
    <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd;">New Lead</p>
    <h2 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">${escapeHtml(typeLabel)}</h2>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px 32px;">

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;">
      <tr><td style="padding:4px 16px 4px 0;color:#64748b;white-space:nowrap;"><strong>Name</strong></td><td style="padding:4px 0;color:#334155;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#64748b;white-space:nowrap;"><strong>Email</strong></td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#1d4ed8;">${escapeHtml(email)}</a></td></tr>
      ${optionalRow("Company", company)}
      ${optionalRow("Role", role)}
    </table>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />

    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Interested in</p>
    <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">${escapeHtml(servicesLine)}</p>

    ${
      message
        ? `<p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Message</p>
    <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;background:#f8fafc;border-radius:6px;padding:12px 14px;">${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`
        : ""
    }

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />

    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Attribution</p>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:13px;">
      ${optionalRow("Source", sourceLine)}
      ${optionalRow("Referrer", referrer)}
      ${optionalRow("Landing page", landing_page)}
    </table>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />

    <a href="mailto:${escapeHtml(email)}?subject=Re: Your inquiry about ${encodeURIComponent(typeLabel)}"
      style="display:inline-block;background:#1d4ed8;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:11px 24px;border-radius:7px;">
      Reply to ${escapeHtml(name)} →
    </a>

  </div>
</div>`;

  await mail.send({
    to: admin,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email, name },
    subject,
    text,
    html,
  });
}

// ─── Discussion broadcast (workgroup + member feed) ───────────────────────────

type DiscussionAnnouncementTemplate = {
  badgeLabel: string;
  headline: string;
  authorName: string;
  authorSubtitle: string;
  body: string;
  ctaUrl: string;
  ctaLabel: string;
  /** Plain-text first line of footer (no HTML). */
  footerNoteText: string;
  /** HTML for first footer paragraph (may include <em> etc.; caller must escape). */
  footerNoteHtml: string;
  authorImageUrl?: string;
  imageUrl?: string;
};

function buildDiscussionAnnouncementHtml(t: DiscussionAnnouncementTemplate) {
  const bodyHtml = escapeHtml(t.body).replace(/\n/g, "<br/>");
  const { authorName, authorImageUrl, imageUrl, headline, badgeLabel, authorSubtitle, ctaUrl, ctaLabel, footerNoteHtml } = t;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(headline)}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .ow { padding: 16px 8px !important; }
      .hd { padding: 24px 20px !important; }
      .bd { padding: 24px 20px 20px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="ow" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td class="hd" style="background-color:#1e40af;border-radius:12px 12px 0 0;padding:28px 40px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#93c5fd;">${escapeHtml(badgeLabel)}</p>
            <h1 style="margin:8px 0 0;font-size:21px;font-weight:700;color:#ffffff;line-height:1.35;">${escapeHtml(headline)}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td class="bd" style="background-color:#ffffff;padding:32px 40px 28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">

              <!-- Author chip -->
              <tr>
                <td style="padding:0 0 24px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:36px;padding:0;vertical-align:middle;">
                        ${
                          authorImageUrl
                            ? `<img src="${escapeHtml(authorImageUrl)}" width="36" height="36" alt="" style="display:block;width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #e2e8f0;" />`
                            : `<table cellpadding="0" cellspacing="0" border="0" style="width:36px;height:36px;"><tr><td style="width:36px;height:36px;background-color:#eff6ff;border-radius:50%;text-align:center;vertical-align:middle;font-size:14px;font-weight:700;color:#1d4ed8;">${escapeHtml(authorName.charAt(0).toUpperCase())}</td></tr></table>`
                        }
                      </td>
                      <td style="padding-left:10px;vertical-align:middle;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#0f172a;">${escapeHtml(authorName)}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#64748b;">${escapeHtml(authorSubtitle)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr><td style="padding:0 0 24px;border-top:1px solid #f1f5f9;"></td></tr>

              <!-- Post body -->
              <tr>
                <td style="padding:0 0 28px;">
                  <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;">${bodyHtml}</p>
                </td>
              </tr>

              ${imageUrl ? `<!-- Post image -->
              <tr>
                <td style="padding:0 0 28px;">
                  <img src="${escapeHtml(imageUrl)}" alt="Post image" style="display:block;max-width:100%;border-radius:8px;border:1px solid #e2e8f0;" />
                </td>
              </tr>` : ""}

              <!-- CTA -->
              <tr>
                <td style="padding:0 0 32px;text-align:center;">
                  <a href="${escapeHtml(ctaUrl)}"
                    style="display:inline-block;background-color:#1d4ed8;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:8px;">
                    ${escapeHtml(ctaLabel)}
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:0;border-top:1px solid #e2e8f0;padding-top:20px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                    ${footerNoteHtml}
                  </p>
                  <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">— Michal Juhas · <a href="https://aiwithmichal.com" style="color:#cbd5e1;">AIwithMichal.com</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildDiscussionAnnouncementText(t: DiscussionAnnouncementTemplate) {
  const imageLine = t.imageUrl ? `\nImage: ${t.imageUrl}\n` : "";
  const badgeUpper = t.badgeLabel.toUpperCase();
  return `${badgeUpper}: ${t.headline}

Posted by: ${t.authorName}

---

${t.body}
${imageLine}
---

${t.ctaLabel.replace(/\s*→\s*$/, "").trim()}: ${t.ctaUrl}

---

${t.footerNoteText}
Questions? Reply to this email.

— Michal Juhas · AIwithMichal.com
`;
}

async function sendDiscussionBroadcastMessages(params: {
  subject: string;
  html: string;
  text: string;
  recipients: { email: string; name: string }[];
}) {
  const { subject, html, text, recipients } = params;
  const mail = getSendGrid();
  const adminEmail = getAdminEmail();

  const toList = [
    ...recipients.filter((r) => r.email.toLowerCase() !== adminEmail.toLowerCase()),
    { email: adminEmail, name: "Michal (admin)" },
  ].filter((r, i, arr) => arr.findIndex((x) => x.email.toLowerCase() === r.email.toLowerCase()) === i);

  const messages = toList.map((recipient) => ({
    to: { email: recipient.email, name: recipient.name },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: adminEmail, name: FROM_NAME },
    subject,
    html,
    text,
  }));

  if (messages.length === 0) return { sent: 0 };

  await mail.send(messages as Parameters<typeof mail.send>[0]);
  return { sent: messages.length };
}

export async function sendWorkgroupBroadcast(params: {
  authorName: string;
  workshopTitle: string;
  workshopSlug: string;
  headline: string;
  body: string;
  authorImageUrl?: string;
  imageUrl?: string;
  recipients: { email: string; name: string }[];
}) {
  const { authorName, workshopTitle, workshopSlug, headline, body, authorImageUrl, imageUrl, recipients } =
    params;

  const workgroupUrl = `${appBaseUrl()}/members/workshops/${workshopSlug}/workgroup`;
  const subject = `[Workgroup] ${headline}`;

  const template: DiscussionAnnouncementTemplate = {
    badgeLabel: "Workgroup Announcement",
    headline,
    authorName,
    authorSubtitle: "posted in the workgroup",
    body,
    ctaUrl: workgroupUrl,
    ctaLabel: "Open Workgroup →",
    footerNoteText: `You received this because you have access to the workgroup for "${workshopTitle}".`,
    footerNoteHtml: `You received this because you have access to the workgroup for
                    <em>${escapeHtml(workshopTitle)}</em>. Reply to this email if you have questions.`,
    authorImageUrl,
    imageUrl,
  };

  const html = buildDiscussionAnnouncementHtml(template);
  const text = buildDiscussionAnnouncementText(template);

  return sendDiscussionBroadcastMessages({ subject, html, text, recipients });
}

export async function sendMemberFeedBroadcast(params: {
  authorName: string;
  headline: string;
  body: string;
  authorImageUrl?: string;
  imageUrl?: string;
  recipients: { email: string; name: string }[];
}) {
  const { authorName, headline, body, authorImageUrl, imageUrl, recipients } = params;

  const feedUrl = `${appBaseUrl()}/members/feed`;
  const subject = `[Members] ${headline}`;

  const template: DiscussionAnnouncementTemplate = {
    badgeLabel: "Members Feed",
    headline,
    authorName,
    authorSubtitle: "posted in the member feed",
    body,
    ctaUrl: feedUrl,
    ctaLabel: "Open Feed →",
    footerNoteText:
      "You received this because you are registered on AI with Michal.",
    footerNoteHtml: `You received this because you are registered on AI with Michal. Reply to this email if you have questions.`,
    authorImageUrl,
    imageUrl,
  };

  const html = buildDiscussionAnnouncementHtml(template);
  const text = buildDiscussionAnnouncementText(template);

  return sendDiscussionBroadcastMessages({ subject, html, text, recipients });
}

export async function sendMembershipConfirmation(params: {
  toEmail: string;
  toName: string;
  membersUrl?: string;
}) {
  const { toEmail, toName, membersUrl } = params;
  const base = appBaseUrl();
  const hub = (membersUrl ?? `${base}/members`).replace(/\/$/, "");
  const firstName = toName.split(" ")[0] || toName;

  const text = `Hi ${firstName},

Thank you for joining the AI Recruiting Systems annual membership.

Your member hub (workshops, recordings, and community) is here:
${hub}

You have full access for the next year — dive into any workshop track and the First Principles in Talent Sourcing course from your account.

Questions? Reply to this email or write to ${PUBLIC_CONTACT_EMAIL}.

— Michal Juhas`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
    <tr><td style="padding:28px 32px;background:#1e40af;border-radius:12px 12px 0 0;">
      <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#93c5fd;">AI with Michal</p>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff;">You&apos;re in — annual membership</h1>
    </td></tr>
    <tr><td style="padding:28px 32px 32px;">
      <p style="margin:0 0 12px;font-size:15px;color:#334155;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">Thank you for joining the <strong>AI Recruiting Systems</strong> annual membership. Your hub for live workshops, recordings, workgroups, and the First Principles course is ready.</p>
      <p style="margin:0 0 20px;"><a href="${escapeHtml(hub)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;">Open member hub</a></p>
      <p style="margin:0;font-size:14px;color:#64748b;">Questions? Reply to this email or ${escapeHtml(PUBLIC_CONTACT_EMAIL)}</p>
    </td></tr>
  </table>
</body>
</html>`;

  const mail = getSendGrid();
  await mail.send({
    to: { email: toEmail, name: toName },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: "You are in — AI Recruiting Systems membership",
    text,
    html,
  });
}

// ─── Course confirmation ──────────────────────────────────────────────────────

export type CourseTicketTier = "basic" | "pro";

const COURSE_TIER_EXTRAS: Record<
  CourseTicketTier,
  { name: string; extras: string[] }
> = {
  basic: {
    name: "Training",
    extras: [
      "Full 3-week structured curriculum",
      "2× 30-min 1-on-1 calls with Michal",
    ],
  },
  pro: {
    name: "Training + Interview Prep",
    extras: [
      "Everything in Training",
      "Real-world sourcing assignment from a high-tech company",
      "Honest 1-on-1 feedback from Michal on your submission",
    ],
  },
};

function buildCourseConfirmationHtml(params: {
  firstName: string;
  courseTitle: string;
  tier: CourseTicketTier;
  schedulingUrl: string;
}) {
  const { firstName, courseTitle, tier, schedulingUrl } = params;
  const tierInfo = COURSE_TIER_EXTRAS[tier];
  const includesListHtml = tierInfo.extras
    .map(
      (item) =>
        `<li style="padding: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">${escapeHtml(item)}</li>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're enrolled — AI with Michal</title>
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
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">You&apos;re enrolled, ${escapeHtml(firstName)}!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                      Thank you for enrolling in <strong>${escapeHtml(courseTitle)}</strong>.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; color: #334155; line-height: 1.6;">
                      Here&apos;s what&apos;s included with your <strong>${escapeHtml(tierInfo.name)}</strong> package:
                    </p>
                  </td>
                </tr>

                <!-- What's included box -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #f1f5f9; border-radius: 10px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">What&apos;s included</p>
                          <ul style="margin: 0; padding-left: 18px; list-style: none;">
                            ${includesListHtml}
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Book your calls CTA -->
                <tr>
                  <td style="padding: 0 0 28px 0;">
                    <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #0f172a;">Book your 1-on-1 calls</p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                      Your package includes two 30-minute sessions with Michal. Use the link below to schedule them at a time that works for you.
                    </p>
                    <a href="${escapeHtml(schedulingUrl)}"
                      style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Book your calls →
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 0 20px 0; border-top: 1px solid #e2e8f0;"></td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                      Questions? Reply to this email or reach out at
                      <a href="mailto:${PUBLIC_CONTACT_EMAIL}" style="color: #1d4ed8;">${PUBLIC_CONTACT_EMAIL}</a>.
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

function buildCourseConfirmationText(params: {
  firstName: string;
  courseTitle: string;
  tier: CourseTicketTier;
  schedulingUrl: string;
}) {
  const { firstName, courseTitle, tier, schedulingUrl } = params;
  const tierInfo = COURSE_TIER_EXTRAS[tier];
  const includesList = tierInfo.extras.map((item) => `  • ${item}`).join("\n");

  return `Hi ${firstName},

You're enrolled in: ${courseTitle}
Package: ${tierInfo.name}

WHAT'S INCLUDED
${includesList}

BOOK YOUR 1-ON-1 CALLS
Your package includes two 30-minute sessions with Michal. Schedule them here:
${schedulingUrl}

Questions? Reply to this email or write to ${PUBLIC_CONTACT_EMAIL}.

— Michal Juhas
`;
}

export async function sendCourseConfirmation(params: {
  toEmail: string;
  toName: string;
  courseTitle: string;
  tier: CourseTicketTier;
  schedulingUrl: string;
}) {
  const { toEmail, toName, courseTitle, tier, schedulingUrl } = params;
  const firstName = toName.split(" ")[0] || toName;

  const mail = getSendGrid();
  await mail.send({
    to: { email: toEmail, name: toName },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `You're enrolled — ${courseTitle}`,
    html: buildCourseConfirmationHtml({ firstName, courseTitle, tier, schedulingUrl }),
    text: buildCourseConfirmationText({ firstName, courseTitle, tier, schedulingUrl }),
  });
}
