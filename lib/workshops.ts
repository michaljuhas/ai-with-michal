import type { TrainingSection } from "./training";
import { trainingLessons, trainingSections } from "./training";
import type { WorkshopSeriesId } from "./workshop-series";
import type { WorkshopCalendarEvent } from "./workshop-calendar";
// ---------------------------------------------------------------------------
// Streams (members area categorisation)
// ---------------------------------------------------------------------------

export type Stream = "recruiting-ta" | "gtm" | "operations";

export const STREAMS: Record<Stream, { label: string; description: string }> = {
  "recruiting-ta": {
    label: "Recruiting & TA",
    description:
      "AI-powered workshops for talent acquisition professionals and recruiting teams.",
  },
  gtm: {
    label: "GTM (Marketing, Sales)",
    description:
      "AI tools and automation for marketing, sales, and go-to-market teams.",
  },
  operations: {
    label: "Operations",
    description:
      "Streamline operational workflows, reporting, and cross-functional processes with AI.",
  },
};

// ---------------------------------------------------------------------------
// Workshop definitions
// ---------------------------------------------------------------------------

export type WorkshopDef = {
  slug: string;
  title: string;
  stream: Stream;
  date: Date;
  displayDate: string;
  displayTime?: string;
  description: string;
  recordingUrl?: string; // pro-only recording link
};

export const workshops: WorkshopDef[] = [
  {
    slug: "2026-04-02-ai-in-recruiting",
    title: "AI in Recruiting and Talent Acquisition",
    stream: "recruiting-ta",
    date: new Date("2026-04-02T14:00:00Z"),
    displayDate: "April 2, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    description:
      "Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
    recordingUrl: "https://drive.google.com/file/d/19Qos6UwOELh9SpBsDGbsCXaPP9c2Amas/view?usp=sharing",
  },
  {
    slug: "2026-04-16-ai-in-recruiting",
    title: "AI in Recruiting and Talent Acquisition",
    stream: "recruiting-ta",
    date: new Date("2026-04-16T14:00:00Z"),
    displayDate: "April 16, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    description:
      "Introductory: four ways to use AI in recruiting — chatting, systemizing, automating, and AI-native — with practical workflows.",
  },
  {
    slug: "2026-04-23-sourcing-automation",
    title: "Sourcing Automation with AI",
    stream: "recruiting-ta",
    date: new Date("2026-04-23T14:00:00Z"),
    displayDate: "April 23, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    description:
      "Deep-dive: set up systems that source candidates automatically and rank them with AI — talent pipelines and multi-channel workflows.",
  },
  {
    slug: "2026-05-07-claude-cowork-recruiting",
    title: "Using Claude Chat, Cowork, and Code in Recruiting",
    stream: "recruiting-ta",
    date: new Date("2026-05-07T14:00:00Z"),
    displayDate: "May 7, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    description:
      "Intermediate: level up from CustomGPTs, Gems, or Skills to Claude Chat, Cowork, and Code for recruiting automations — no prior coding required.",
  },
];

// ---------------------------------------------------------------------------
// Public-facing workshop registry (for /workshops/[slug] pages)
// ---------------------------------------------------------------------------

/** Shown on /workshops cards for public listings (shared across current workshops). */
export const PUBLIC_WORKSHOP_AUDIENCE_LABEL =
  "Recruiters, TA, HR, agency managers";

export interface Workshop {
  slug: string;
  /** Public /workshops hub series (Recruiting / GTM / Agency paths). */
  series: WorkshopSeriesId;
  title: string;
  description: string;
  /** One sentence for /workshops cards */
  cardSummary: string;
  /** How to read the session, e.g. introductory vs deep-dive */
  levelLabel: string;
  audienceLabel: string;
  date: Date;
  displayDate: string;
  displayTime: string;
  displayDateShort: string;
  startDate: string;
  endDate: string;
  location: string;
  priceIds: { basic: string; pro: string };
  recordingUrl?: string;
}

export const PUBLIC_WORKSHOPS: Workshop[] = [
  {
    slug: "2026-04-02-ai-in-recruiting",
    series: "recruiting",
    title: "AI in Recruiting and Talent Acquisition (90-min online workshop)",
    description:
      "Live 90-minute introductory workshop with Michal Juhas for recruiters and talent teams. Covers four ways to use AI in recruiting: chatting, systemizing, automating, and AI-native.",
    cardSummary:
      "This is an introductory workshop about AI automation in recruiting where we cover four ways how to use AI in recruiting: chatting, systemizing, automating, and AI-native.",
    levelLabel: "Introductory · start here",
    audienceLabel: PUBLIC_WORKSHOP_AUDIENCE_LABEL,
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-04-02T14:00:00Z"),
    startDate: "20260402T140000Z",
    endDate: "20260402T153000Z",
    displayDate: "April 2, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    displayDateShort: "Apr 2",
    priceIds: {
      basic: "price_1TCatHCDDkiysv3tRCPOeA0S",
      pro: "price_1TCauFCDDkiysv3tJZoHHx7t",
    },
    recordingUrl: "https://drive.google.com/file/d/19Qos6UwOELh9SpBsDGbsCXaPP9c2Amas/view?usp=sharing",
  },
  {
    slug: "2026-04-16-ai-in-recruiting",
    series: "recruiting",
    title: "AI in Recruiting and Talent Acquisition (90-min online workshop)",
    description:
      "Live 90-minute introductory workshop with Michal Juhas for recruiters and talent teams. Covers four ways to use AI in recruiting: chatting, systemizing, automating, and AI-native.",
    cardSummary:
      "This is an introductory workshop about AI automation in recruiting where we cover four ways how to use AI in recruiting: chatting, systemizing, automating, and AI-native.",
    levelLabel: "Introductory · start here",
    audienceLabel: PUBLIC_WORKSHOP_AUDIENCE_LABEL,
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-04-16T14:00:00Z"),
    startDate: "20260416T140000Z",
    endDate: "20260416T153000Z",
    displayDate: "April 16, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    displayDateShort: "Apr 16",
    priceIds: {
      basic: "price_1THrlUCDDkiysv3tILt4bKox",
      pro: "price_1THrlVCDDkiysv3tM6CUBKG3",
    },
  },
  {
    slug: "2026-04-23-sourcing-automation",
    series: "recruiting",
    title: "Sourcing Automation with AI (90-min online workshop)",
    description:
      "Live 90-minute deep-dive with Michal Juhas. Focus on systems that source candidates automatically and rank them with AI — practical automation for talent pipelines.",
    cardSummary:
      "This is a deep-dive workshop where we focus on setting up systems that source candidates automatically and rank them with AI.",
    levelLabel: "Deep-dive",
    audienceLabel: PUBLIC_WORKSHOP_AUDIENCE_LABEL,
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-04-23T14:00:00Z"),
    startDate: "20260423T140000Z",
    endDate: "20260423T153000Z",
    displayDate: "April 23, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    displayDateShort: "Apr 23",
    priceIds: {
      basic: "price_1THrlQCDDkiysv3tHSHBBmeL",
      pro: "price_1THrlUCDDkiysv3ty4BzAfUZ",
    },
  },
  {
    slug: "2026-05-07-claude-cowork-recruiting",
    series: "recruiting",
    title: "Using Claude Chat, Cowork, and Code in Recruiting (90-min online workshop)",
    description:
      "Live 90-minute intermediate workshop with Michal Juhas. For those familiar with CustomGPTs, Gems, or Skills who want to level up to Claude Chat, Cowork, and Code in recruiting.",
    cardSummary:
      "This is an intermediate workshop for those familiar with basic CustomGPTs, Gems, or Skills, and want to level up to Claude.",
    levelLabel: "Intermediate",
    audienceLabel: PUBLIC_WORKSHOP_AUDIENCE_LABEL,
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-05-07T14:00:00Z"),
    startDate: "20260507T140000Z",
    endDate: "20260507T153000Z",
    displayDate: "May 7, 2026",
    displayTime: "4:00 PM – 5:30 PM CET",
    displayDateShort: "May 7",
    priceIds: {
      basic: "price_1THrlVCDDkiysv3tFbelmZay",
      pro: "price_1THrlWCDDkiysv3tJOQ15Hhg",
    },
  },
];

export const CURRENT_WORKSHOP_SLUG = "2026-04-16-ai-in-recruiting";

/**
 * Returns a worldtimebuddy.com URL for a workshop date.
 * All workshops run 4:00–5:30 PM local (Europe/Bratislava); UI copy uses the label **CET** (see AGENTS.md).
 */
export function getTimezoneConverterUrl(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return `https://www.worldtimebuddy.com/?qm=1&lid=5391959,5128581,100,2643743,3060972,3067696,703448,1880252&h=3060972&date=${y}-${m}-${d}&sln=16-17.5&hf=1`;
}

/** Parses `PUBLIC_WORKSHOPS` / `WORKSHOP` calendar strings (`YYYYMMDDTHHmmssZ`) to a UTC `Date`. */
export function parseWorkshopIcsUtc(ics: string): Date {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(ics);
  if (!m) {
    throw new Error(`Invalid workshop ICS instant: ${ics}`);
  }
  const [, y, mo, d, h, mi, s] = m;
  return new Date(
    Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)),
  );
}

/** Rows for the public workshop detail timezone popover (IANA zones; abbreviations come from `Intl`). */
export const WORKSHOP_TIMEZONE_POPOVER_ZONES: readonly { label: string; timeZone: string }[] = [
  { label: "US Pacific (PT)", timeZone: "America/Los_Angeles" },
  { label: "US Eastern (ET)", timeZone: "America/New_York" },
  { label: "UK", timeZone: "Europe/London" },
  { label: "Central Europe", timeZone: "Europe/Bratislava" },
  { label: "India (IST)", timeZone: "Asia/Kolkata" },
  { label: "Hong Kong / Singapore", timeZone: "Asia/Singapore" },
] as const;

/**
 * One-line local interval for a workshop slot, e.g. `Apr 16, 2026 · 10:00 AM – 11:30 AM EDT`.
 * Handles a different local calendar day between start and end (rare for 90-minute slots).
 */
export function formatWorkshopIntervalInTimeZone(
  start: Date,
  end: Date,
  timeZone: string,
): string {
  const dateFmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  const tzFmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  });
  const tz =
    tzFmt.formatToParts(end).find((p) => p.type === "timeZoneName")?.value?.trim() ?? "";

  const startDate = dateFmt.format(start);
  const endDate = dateFmt.format(end);
  const t0 = timeFmt.format(start);
  const t1 = timeFmt.format(end);

  if (startDate === endDate) {
    return `${startDate} · ${t0} – ${t1} ${tz}`.trim();
  }
  return `${startDate} ${t0} – ${endDate} ${t1} ${tz}`.trim();
}

export function getPublicWorkshopBySlug(slug: string): Workshop | undefined {
  return PUBLIC_WORKSHOPS.find((w) => w.slug === slug);
}

/** Calendar links / .ics — always derived from `PUBLIC_WORKSHOPS` so thank-you and members area stay in sync. */
export function getWorkshopCalendarEvent(slug: string): WorkshopCalendarEvent | null {
  const w = getPublicWorkshopBySlug(slug);
  if (!w) return null;
  return {
    title: w.title,
    description: w.description,
    startDate: w.startDate,
    endDate: w.endDate,
    date: w.date,
    location: w.location,
  };
}

/** Title and schedule for post-registration emails (public page first, then members def). */
export function getWorkshopWelcomeSnapshot(slug: string): {
  slug: string;
  title: string;
  displayDate: string;
  displayTime: string;
} {
  const pub = getPublicWorkshopBySlug(slug);
  if (pub) {
    return {
      slug: pub.slug,
      title: pub.title,
      displayDate: pub.displayDate,
      displayTime: pub.displayTime,
    };
  }
  const def = getWorkshopBySlug(slug);
  if (def) {
    return {
      slug: def.slug,
      title: def.title,
      displayDate: def.displayDate,
      displayTime: def.displayTime ?? "",
    };
  }
  return {
    slug,
    title: "Live workshop",
    displayDate: "",
    displayTime: "",
  };
}

export function getNextUpcomingPublicWorkshop(): Workshop | undefined {
  const now = new Date();
  return PUBLIC_WORKSHOPS.find((w) => w.date > now);
}

/** All future public workshops, soonest first (for public listings / API). */
export function getUpcomingPublicWorkshops(): Workshop[] {
  const now = new Date();
  return PUBLIC_WORKSHOPS.filter((w) => w.date > now).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

/** Upcoming public workshops in one hub series (soonest first). */
export function getUpcomingPublicWorkshopsForSeries(series: WorkshopSeriesId): Workshop[] {
  const now = new Date();
  return PUBLIC_WORKSHOPS.filter((w) => w.series === series && w.date > now).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

/**
 * Workshop start instant — use when `Workshop` may cross the RSC→client boundary
 * (Next can serialize `Date` to an ISO string in props).
 */
export function workshopEventDate(workshop: Workshop): Date {
  const d = workshop.date as Date | string;
  return d instanceof Date ? d : new Date(d);
}

export function getDaysUntil(workshop: Workshop): number {
  const now = new Date();
  const diff = workshopEventDate(workshop).getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isOpen(workshop: Workshop): boolean {
  return new Date() < workshopEventDate(workshop);
}

// ---------------------------------------------------------------------------
// Members-area helpers (existing — unchanged)
// ---------------------------------------------------------------------------

export function getWorkshopBySlug(slug: string): WorkshopDef | null {
  return workshops.find((w) => w.slug === slug) ?? null;
}

/** Alias kept for call-site clarity — slug and publicSlug are now the same. */
export function getWorkshopDefByPublicSlug(publicSlug: string): WorkshopDef | null {
  return getWorkshopBySlug(publicSlug);
}

export function getWorkshopsByStream(stream: Stream): WorkshopDef[] {
  return workshops.filter((w) => w.stream === stream);
}

export function getUpcomingWorkshop(): WorkshopDef | null {
  const now = new Date();
  const upcoming = workshops
    .filter((w) => w.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcoming[0] ?? null;
}

export function getWorkshopTrainingSections(workshopSlug: string): TrainingSection[] {
  return trainingSections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      path: `/members/workshops/${workshopSlug}/training/${lesson.slug.join("/")}`,
    })),
  }));
}

export function getWorkshopTrainingLessons(workshopSlug: string) {
  return trainingLessons.map((lesson) => ({
    ...lesson,
    path: `/members/workshops/${workshopSlug}/training/${lesson.slug.join("/")}`,
  }));
}

export function getWorkshopLessonBySlug(workshopSlug: string, moduleSlug: string[]) {
  const lessons = getWorkshopTrainingLessons(workshopSlug);
  return lessons.find((l) => l.slug.join("/") === moduleSlug.join("/")) ?? null;
}

export function getWorkshopLessonNeighbors(workshopSlug: string, path: string) {
  const lessons = getWorkshopTrainingLessons(workshopSlug);
  const idx = lessons.findIndex((l) => l.path === path);
  if (idx === -1) return { previous: null, next: null };
  return {
    previous: lessons[idx - 1] ?? null,
    next: lessons[idx + 1] ?? null,
  };
}
