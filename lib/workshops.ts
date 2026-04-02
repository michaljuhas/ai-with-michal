import type { TrainingSection } from "./training";
import { trainingLessons, trainingSections } from "./training";
import { WORKSHOP } from "./workshop";

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
  publicSlug?: string;   // slug used in PUBLIC_WORKSHOPS and orders table
  recordingUrl?: string; // pro-only recording link
};

export const workshops: WorkshopDef[] = [
  {
    slug: "recruiting-ai-apr-2026",
    title: "AI in Recruiting and Talent Acquisition",
    stream: "recruiting-ta",
    date: new Date("2026-04-02T15:00:00Z"),
    displayDate: "April 2, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    description:
      "Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
    publicSlug: "2026-04-02-ai-in-recruiting",
    recordingUrl: "https://drive.google.com/file/d/19Qos6UwOELh9SpBsDGbsCXaPP9c2Amas/view?usp=sharing",
  },
  {
    slug: "sourcing-automation-apr-2026",
    title: "Sourcing Automation for Recruiters",
    stream: "recruiting-ta",
    date: new Date("2026-04-16T15:00:00Z"),
    displayDate: "April 16, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    description:
      "Automate candidate sourcing with AI tools, build talent pipelines outside LinkedIn, and run multi-channel outreach workflows.",
  },
  {
    slug: "recruiting-ai-apr23-2026",
    title: "AI in Recruiting and Talent Acquisition",
    stream: "recruiting-ta",
    date: new Date("2026-04-23T15:00:00Z"),
    displayDate: "April 23, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    description:
      "Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
  },
  {
    slug: "claude-cowork-recruiting-may-2026",
    title: "Claude Cowork and Code in Recruiting",
    stream: "recruiting-ta",
    date: new Date("2026-05-07T15:00:00Z"),
    displayDate: "May 7, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    description:
      "Build real recruiting automations with Claude Code — no coding experience needed. Leave with working tools you can use immediately.",
  },
];

// ---------------------------------------------------------------------------
// Public-facing workshop registry (for /workshops/[slug] pages)
// ---------------------------------------------------------------------------

export interface Workshop {
  slug: string;
  title: string;
  description: string;
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
    priceIds: {
      basic: "price_1TCatHCDDkiysv3tRCPOeA0S",
      pro: "price_1TCauFCDDkiysv3tJZoHHx7t",
    },
    recordingUrl: "https://drive.google.com/file/d/19Qos6UwOELh9SpBsDGbsCXaPP9c2Amas/view?usp=sharing",
  },
  {
    slug: "2026-04-16-sourcing-automation",
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
    priceIds: {
      basic: "price_1THrlQCDDkiysv3tHSHBBmeL",
      pro: "price_1THrlUCDDkiysv3ty4BzAfUZ",
    },
  },
  {
    slug: "2026-04-23-ai-in-recruiting",
    title: "AI in Recruiting and Talent Acquisition (90-min online workshop)",
    description:
      "Live 90-minute online workshop with Michal Juhas for recruiters and talent teams. Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-04-23T15:00:00Z"),
    startDate: "20260423T150000Z",
    endDate: "20260423T163000Z",
    displayDate: "April 23, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    displayDateShort: "Apr 23",
    priceIds: {
      basic: "price_1THrlUCDDkiysv3tILt4bKox",
      pro: "price_1THrlVCDDkiysv3tM6CUBKG3",
    },
  },
  {
    slug: "2026-05-07-claude-cowork-recruiting",
    title: "Claude Cowork and Code in Recruiting (90-min online workshop)",
    description:
      "Live 90-minute hands-on session with Michal Juhas. Build real recruiting automations with Claude Code — no coding experience needed. Leave with working tools you can use immediately.",
    location: "Online (Video call link will be emailed to you)",
    date: new Date("2026-05-07T15:00:00Z"),
    startDate: "20260507T150000Z",
    endDate: "20260507T163000Z",
    displayDate: "May 7, 2026",
    displayTime: "3:00 PM – 4:30 PM UTC",
    displayDateShort: "May 7",
    priceIds: {
      basic: "price_1THrlVCDDkiysv3tFbelmZay",
      pro: "price_1THrlWCDDkiysv3tJOQ15Hhg",
    },
  },
];

export const CURRENT_WORKSHOP_SLUG = "2026-04-16-sourcing-automation";

export function getPublicWorkshopBySlug(slug: string): Workshop | undefined {
  return PUBLIC_WORKSHOPS.find((w) => w.slug === slug);
}

export function getNextUpcomingPublicWorkshop(): Workshop | undefined {
  const now = new Date();
  return PUBLIC_WORKSHOPS.find((w) => w.date > now);
}

export function getDaysUntil(workshop: Workshop): number {
  const now = new Date();
  const diff = workshop.date.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isOpen(workshop: Workshop): boolean {
  return new Date() < workshop.date;
}

// ---------------------------------------------------------------------------
// Members-area helpers (existing — unchanged)
// ---------------------------------------------------------------------------

export function getWorkshopBySlug(slug: string): WorkshopDef | null {
  return workshops.find((w) => w.slug === slug) ?? null;
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
