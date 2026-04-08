/**
 * Single source for the homepage “Work Together” menu, /contact checkboxes,
 * and stable ?service= keys (id is used in URLs).
 */

export type CtaKind =
  | "mentoring_individual"
  | "mentoring_group"
  | "implementation_landing"
  | "private_workshop"
  | "contact";

export type WorkTogetherService = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  ctaKind: CtaKind;
  /** For private_workshop — URL segment under /private-workshops/ */
  detailSlug?: string;
};

/** Ordered list for the dedicated /work-together menu (excludes custom-scope contact-only rows). */
export const WORK_TOGETHER_NAV_MENU_SERVICE_IDS: readonly string[] = [
  "bi-weekly-individual-mentoring",
  "group-mentoring",
  "using-ai-in-your-business",
  "improving-your-processes-with-ai",
  "personal-productivity-with-ai",
  "levelling-ai-recruiting",
  "levelling-ai-gtm",
  "levelling-ai-operations",
  "advisory-board-member",
  "implementation-part-time",
  "implementation-full-time",
];

export const WORK_TOGETHER_SERVICES: WorkTogetherService[] = [
  {
    id: "bi-weekly-individual-mentoring",
    title: "Bi-weekly Individual mentoring",
    description:
      "We’ll meet 1-on-1 for a video call every other week. Tell me what problems you have, what you work on, and I tell you how to do it better with AI.\n\nIdeal if you’re looking for best practices and ideas on what you can do better in your business.",
    priceLabel: "€697/month",
    ctaKind: "mentoring_individual",
  },
  {
    id: "group-mentoring",
    title: "Group mentoring",
    description:
      "Join one of our dedicated circles and mentoring calls: Recruiting, GTM, Ops, Solopreneurs.",
    priceLabel: "€397/month",
    ctaKind: "mentoring_group",
  },
  {
    id: "using-ai-in-your-business",
    title: "Using AI in your business (private workshop)",
    description:
      "Highly customized workshop with your management team. A session includes prep, 2-hour video call, roadmap, and followup.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "using-ai-in-your-business",
  },
  {
    id: "improving-your-processes-with-ai",
    title: "Improving your processes with AI (private workshop)",
    description:
      "Highly customized workshop with your management team. A session includes my prep, 2-hour video call, roadmap, and followup.\n\nIdeal if you have repetitive processes including manual administrative work, if you are locked with an IT vendor, or if you pay a lot for IT or admin services.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "improving-your-processes-with-ai",
  },
  {
    id: "personal-productivity-with-ai",
    title: "Personal Productivity with AI (private workshop)",
    description:
      "Inspire your team to take full advantage of AI in their daily work. A practical session covering the mindset shift, the best tools, and the workflows that actually save time, no matter which department your people sit in.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "personal-productivity-with-ai",
  },
  {
    id: "levelling-ai-recruiting",
    title: "Levelling AI adoption in Recruiting Teams (private workshop)",
    description: 
      "Highly customized workshop with your recruiting team. A session includes Michal's preparation, a 2-hour video call, roadmap, and followup.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "levelling-ai-adoption-recruiting-teams",
  },
  {
    id: "levelling-ai-gtm",
    title: "Levelling AI adoption in GTM Teams (private workshop)",
    description: 
      "Highly customized workshop with your GTM team. A session includes Michal's preparation, a 2-hour video call, roadmap, and followup.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "levelling-ai-adoption-gtm-teams",
  },
  {
    id: "levelling-ai-operations",
    title: "Levelling AI adoption in Operations Teams (private workshop)",
    description: 
      "Highly customized workshop with your operations team. A session includes Michal's preparation, a 2-hour video call, roadmap, and followup.",
    priceLabel: "€1,500/session",
    ctaKind: "private_workshop",
    detailSlug: "levelling-ai-adoption-operations-teams",
  },
  {
    id: "advisory-board-member",
    title: "Advisory Board Member",
    description:
      "I join your select management meetings and dedicate one day per month to helping your business become AI-native.\n\nWe'll work on mid-term projects to help your organization not only to increase AI adoption, but also to implement innovative projects.",
    priceLabel: "€2,500/month",
    ctaKind: "contact",
  },
  {
    id: "implementation-part-time",
    title: "Hands on Implementation 1+1 – Part-time Package",
    description:
      "Tell me what needs to get done and my colleague and I will take care of it. I am paired with an AI-native agentic engineer who gets stuff done for you.\n\nWe'll work on projects with immediate ROI approx 80 hours per month.",
    priceLabel: "€5,000/month",
    ctaKind: "implementation_landing",
  },
  {
    id: "implementation-full-time",
    title: "Hands on Implementation 1+1 – Full-time Package",
    description:
      "Tell me what needs to get done and my colleague and I will take care of it. I am paired with an AI-native agentic engineer who gets stuff done for you.\n\nWe'll work on projects with immediate ROI approx 160 hours per month.",
    priceLabel: "€10,000/month",
    ctaKind: "implementation_landing",
  },
  {
    id: "ai-for-inbound-marketing",
    title: "AI for Inbound Marketing",
    description:
      "AI-powered lead gen such as a dynamic quiz to segment leads and personalize follow-ups — higher-quality leads and tailored touchpoints.",
    priceLabel: "Custom scope",
    ctaKind: "contact",
  },
  {
    id: "ai-for-outbound-sales",
    title: "AI for Outbound Sales",
    description:
      "Research targets with AI, monitor signals, score leads before reps pick up the phone.",
    priceLabel: "Custom scope",
    ctaKind: "contact",
  },
  {
    id: "ai-for-candidate-sourcing",
    title: "AI for Candidate Sourcing",
    description:
      "Source at scale, pre-screen applications, and engage prospects with personalized outreach.",
    priceLabel: "Custom scope",
    ctaKind: "contact",
  },
  {
    id: "niche-talent-pool-booster",
    title: "Niche Talent Pool Booster",
    description:
      "Combine candidate data sources into a proprietary niche talent pool for agencies specializing in a vertical.",
    priceLabel: "Custom scope",
    ctaKind: "contact",
  },
];

/** Every label shown in the “I’m interested in” multi-select on /contact */
export const CONTACT_FORM_SERVICE_LABELS: string[] = WORK_TOGETHER_SERVICES.map((s) => s.title);

export function getWorkTogetherServiceById(id: string): WorkTogetherService | undefined {
  return WORK_TOGETHER_SERVICES.find((s) => s.id === id);
}

export function getWorkTogetherNavMenuServices(): WorkTogetherService[] {
  return WORK_TOGETHER_NAV_MENU_SERVICE_IDS.map((id) => {
    const s = getWorkTogetherServiceById(id);
    if (!s) throw new Error(`Missing work-together service: ${id}`);
    return s;
  });
}

export function getWorkTogetherServiceByDetailSlug(
  slug: string,
): WorkTogetherService | undefined {
  return WORK_TOGETHER_SERVICES.find((s) => s.detailSlug === slug);
}

export function getPrivateWorkshopDetailSlugs(): string[] {
  return WORK_TOGETHER_SERVICES.filter((s) => s.ctaKind === "private_workshop" && s.detailSlug).map(
    (s) => s.detailSlug!,
  );
}
