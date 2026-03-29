import type { TrainingSection } from "./training";
import { trainingLessons, trainingSections } from "./training";
import { WORKSHOP } from "./workshop";

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

/** Returns training sections with paths remapped to /members/workshops/[slug]/training/... */
export function getWorkshopTrainingSections(workshopSlug: string): TrainingSection[] {
  return trainingSections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      path: `/members/workshops/${workshopSlug}/training/${lesson.slug.join("/")}`,
    })),
  }));
}

/** Returns training lessons with paths remapped to the members workshop area */
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
