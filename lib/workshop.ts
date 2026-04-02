export const WORKSHOP = {
  title: "Sourcing Automation for Recruiters (90-min online workshop)",
  description:
    "Live 90-minute online workshop with Michal Juhas. Learn how to automate candidate sourcing with AI tools, build talent pipelines outside LinkedIn, and run multi-channel outreach workflows.",
  location: "Online (Video call link will be emailed to you)",
  date: new Date("2026-04-16T15:00:00Z"),
  startDate: "20260416T150000Z",
  endDate: "20260416T163000Z",
  displayDate: "April 16, 2026",
  displayTime: "3:00 PM – 4:30 PM UTC",
  displayDateShort: "Apr 16",
} as const;

export function getDaysUntilWorkshop(): number {
  const now = new Date();
  const diff = WORKSHOP.date.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isRegistrationOpen(): boolean {
  return new Date() < WORKSHOP.date;
}
