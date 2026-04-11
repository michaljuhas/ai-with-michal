import { SITE } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseFormat = "recorded" | "live-session" | "hybrid";

export type CoursePriceTier = "basic" | "pro";

export type CourseLesson = {
  slug: string;
  title: string;
  description?: string;
  order: number;
  videoUrl?: string; // Loom private link
  durationMinutes?: number;
};

export type CourseSection = {
  key: string;
  title: string;
  lessons: CourseLesson[];
};

export type CourseTicketOption = {
  id: CoursePriceTier;
  name: string;
  price: number; // EUR
  includes: string[];
  recommended?: boolean;
};

export type CourseDef = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Informational only — describes what's included, not the payment model */
  format: CourseFormat;
  published: boolean;
  /** Always one-time payment, basic or pro (same pattern as workshops) */
  priceIds: { basic: string; pro: string };
  prices: { basic: number; pro: number }; // EUR
  ticketOptions: CourseTicketOption[];
  sections?: CourseSection[];
  /** Number of live 1-on-1 calls included */
  sessionsIncluded?: number;
  sessionDurationMinutes?: number;
  /** Google Calendar scheduling link shown post-purchase */
  schedulingUrl?: string;
  hasWorkgroup?: boolean;
};

// ---------------------------------------------------------------------------
// Course definitions
// ---------------------------------------------------------------------------

export const COURSES: CourseDef[] = [
  {
    slug: "first-principles-sourcing",
    title: "First Principles in Talent Sourcing",
    tagline: "Learn Modern Sourcing (Or Find Out You Can't)",
    description:
      "A 3-week hybrid training that builds your sourcing foundation from first principles — so AI becomes a multiplier, not a crutch. With live 1-on-1 calls and a private workgroup for real feedback.",
    format: "hybrid",
    published: true,
    priceIds: {
      basic: process.env.STRIPE_PRICE_FIRST_PRINCIPLES_BASIC ?? "",
      pro: process.env.STRIPE_PRICE_FIRST_PRINCIPLES_PRO ?? "",
    },
    prices: { basic: 490, pro: 690 },
    ticketOptions: [
      {
        id: "basic",
        name: "Training",
        price: 490,
        includes: [
          "Full 3-week structured curriculum",
          "2× 30-min 1-on-1 calls with Michal",
        ],
      },
      {
        id: "pro",
        name: "Training + Interview Prep",
        price: 690,
        recommended: true,
        includes: [
          "Everything in Training",
          "Real-world sourcing assignment from a high-tech company",
          "Honest 1-on-1 feedback from Michal on your submission",
        ],
      },
    ],
    sessionsIncluded: 2,
    sessionDurationMinutes: 30,
    schedulingUrl: SITE.bookingLink,
    hasWorkgroup: true,
    sections: [
      {
        key: "week-1",
        title: "Week 1 — First Principles",
        lessons: [
          { slug: "think-in-sets", title: "Think in sets, not keywords", order: 1 },
          { slug: "real-signals", title: "Identify real signals vs noise", order: 2 },
          { slug: "proxies", title: "Use proxies instead of guessing", order: 3 },
        ],
      },
      {
        key: "week-2",
        title: "Week 2 — Execution",
        lessons: [
          { slug: "boolean-from-scratch", title: "Build Boolean from first principles", order: 1 },
          { slug: "iteration-loops", title: "Run iteration loops: search → analyse → refine", order: 2 },
          { slug: "company-mapping", title: "Map companies where talent actually sits", order: 3 },
        ],
      },
      {
        key: "week-3",
        title: "Week 3 — Real Sourcing + Leverage",
        lessons: [
          { slug: "candidate-pipelines", title: "Deliver real candidate pipelines", order: 1 },
          { slug: "justify-profiles", title: "Justify every profile", order: 2 },
          { slug: "ai-leverage", title: "Use AI the right way: scale thinking, not replace it", order: 3 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCourseBySlug(slug: string): CourseDef | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getPublishedCourses(): CourseDef[] {
  return COURSES.filter((c) => c.published);
}
