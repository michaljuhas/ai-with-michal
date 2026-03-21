export const WORKSHOP = {
  title: "Live AI Recruiting Workshop for Recruiters and Talent Teams",
  description:
    "Live 90-minute workshop with Michal Juhas for recruiters and talent teams. Learn practical AI workflows for talent pools, candidate pre-screening, and recruiting automation you can use right away.",
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
