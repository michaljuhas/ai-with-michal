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
};

export const workshops: WorkshopDef[] = [
  {
    slug: "recruiting-ai-apr-2026",
    title: "AI in Recruiting and Talent Acquisition",
    stream: "recruiting-ta",
    date: WORKSHOP.date,
    displayDate: WORKSHOP.displayDate,
    displayTime: WORKSHOP.displayTime,
    description:
      "Learn how recruiters use AI, Claude Code, and workflow automation to source, screen, report, and operate at a higher level.",
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
  },
];

export const CURRENT_WORKSHOP_SLUG = "2026-04-02-ai-in-recruiting";

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
