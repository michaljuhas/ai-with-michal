export const WORKSHOP = {
  title: "AI in Recruiting and Talent Acquisition (90-min online workshop)",
  description:
    "Live 90-minute online workshop with Michal Juhas for recruiters and talent teams. Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
  location: "Online (Video call link will be emailed to you)",
  date: new Date("2026-04-02T15:00:00Z"),
  startDate: "20260402T150000Z",
  endDate: "20260402T163000Z",
  displayDate: "April 2, 2026",
  displayTime: "3:00 PM – 4:30 PM UTC",
  displayDateShort: "Apr 2",
} as const;

export function getDaysUntilWorkshop(): number {
  const now = new Date();
  const diff = WORKSHOP.date.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isRegistrationOpen(): boolean {
  return new Date() < WORKSHOP.date;
}
