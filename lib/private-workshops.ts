export type PrivateWorkshopRecord = {
  slug: string;
  title: string;
  body: string[];
  priceLabel: string;
  /** Matches work-together `id` for /contact?service= */
  contactServiceId: string;
};

const BODY_USING_AI = [
  "A senior advisory engagement for your leadership team. I come prepared with a pre-session audit of your business, facilitate a focused 2-hour working session, and hand you a prioritized roadmap with concrete next steps and follow-up guidance.",
  "Best suited for leadership teams that want a clear-eyed assessment of where AI can move the needle — and a credible plan to act on it.",
];

const BODY_PROCESSES = [
  "I identify where manual work, IT lock-in, or admin overhead is costing you the most — then map out which processes AI can replace or streamline. You leave with a concrete, prioritized action plan and direct access to me during the follow-up phase.",
  "Particularly effective if you have repetitive workflows, expensive vendor dependencies, or high admin overhead draining your team's capacity.",
];

const BODY_RECRUITING_ADVISORY = [
  "A focused sprint to transform how your recruiting team works with AI. The engagement starts with a diagnostic to map your current workflows and identify where AI can create the most leverage — then moves into a hands-on management workshop where your leadership team aligns on priorities.",
  "You leave the sprint with a concrete implementation roadmap, clear ownership, and a follow-up session to review progress. Not a one-off training — a structured engagement designed to produce real change.",
];

const BODY_GTM_ADVISORY = [
  "A focused sprint to embed AI into your GTM motion — from pipeline generation through to closing. I audit your current setup, identify where manual work or tool gaps are costing you pipeline, then run a management workshop to align leadership on the highest-leverage priorities.",
  "You leave with a prioritized systems roadmap and clear next steps. The workshop is one part of the sprint — the deliverable is a plan your team can act on immediately.",
];

const BODY_OPERATIONS_ADVISORY = [
  "A focused sprint to reduce operational overhead through AI. I map your highest-cost processes, identify where automation or AI-assisted workflows can reclaim the most capacity, then run a management workshop to align on priorities and sequencing.",
  "You leave with a concrete implementation roadmap — what to automate, what to eliminate, and how to get started — plus a follow-up session to keep momentum.",
];

const BODY_PRODUCTIVITY = [
  "I work hands-on with your team to identify exactly where time is leaking and replace those habits with AI-native workflows. Every role gets something immediately actionable — not a generic overview that fades by next week.",
  "This engagement is designed for teams that are ready to move past awareness and into real, day-to-day change.",
];

/** Detail-page copy; slugs and titles stay in sync with work-together-services `detailSlug` / private workshop `title`. */
export const PRIVATE_WORKSHOP_RECORDS: PrivateWorkshopRecord[] = [
  {
    slug: "using-ai-in-your-business",
    contactServiceId: "using-ai-in-your-business",
    title: "Using AI in Your Business",
    body: BODY_USING_AI,
    priceLabel: "€1,500/sprint excl VAT",
  },
  {
    slug: "improving-your-processes-with-ai",
    contactServiceId: "improving-your-processes-with-ai",
    title: "Improving Your Processes with AI",
    body: BODY_PROCESSES,
    priceLabel: "€1,500/sprint excl VAT",
  },
  {
    slug: "personal-productivity-with-ai",
    contactServiceId: "personal-productivity-with-ai",
    title: "Personal Productivity with AI",
    body: BODY_PRODUCTIVITY,
    priceLabel: "€1,500/sprint excl VAT",
  },
  {
    slug: "levelling-ai-adoption-recruiting-teams",
    contactServiceId: "levelling-ai-recruiting",
    title: "Recruiting AI Workflow Advisory",
    body: BODY_RECRUITING_ADVISORY,
    priceLabel: "€1,500/sprint excl VAT",
  },
  {
    slug: "levelling-ai-adoption-gtm-teams",
    contactServiceId: "levelling-ai-gtm",
    title: "GTM AI Systems Advisory",
    body: BODY_GTM_ADVISORY,
    priceLabel: "€1,500/sprint excl VAT",
  },
  {
    slug: "levelling-ai-adoption-operations-teams",
    contactServiceId: "levelling-ai-operations",
    title: "Operations AI Systems Advisory",
    body: BODY_OPERATIONS_ADVISORY,
    priceLabel: "€1,500/sprint excl VAT",
  },
];

export function getPrivateWorkshopBySlug(slug: string): PrivateWorkshopRecord | undefined {
  return PRIVATE_WORKSHOP_RECORDS.find((w) => w.slug === slug);
}

export const PRIVATE_WORKSHOP_SLUGS: string[] = PRIVATE_WORKSHOP_RECORDS.map((w) => w.slug);
