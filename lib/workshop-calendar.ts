/** Same instants as `PUBLIC_WORKSHOPS` startDate/endDate (stored as UTC) — single source for ICS and provider links. */
export type WorkshopCalendarEvent = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  date: Date;
  location: string;
};

export function buildGoogleCalendarUrl(
  event: WorkshopCalendarEvent,
  meetingUrl: string
) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${event.startDate}/${event.endDate}`,
    details: event.description,
    location: meetingUrl,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(
  event: WorkshopCalendarEvent,
  meetingUrl: string
) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startDate,
    enddt: event.endDate,
    body: event.description,
    location: meetingUrl,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateICSContent(
  event: WorkshopCalendarEvent,
  meetingUrl: string
) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AI with Michal//Workshop//EN",
    "BEGIN:VEVENT",
    `DTSTART:${event.startDate}`,
    `DTEND:${event.endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${meetingUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
