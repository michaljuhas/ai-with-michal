export type ConsultingHandsOnVariant = "advisory" | "implementation";

export type ConsultingHandsOnRecord = {
  slug: string;
  /** `WORK_TOGETHER_SERVICES` id — used for CTAs and contact preselect */
  serviceId: string;
  title: string;
  priceLabel: string;
  variant: ConsultingHandsOnVariant;
  body: string[];
};

const ADVISORY_BODY = [
  "I join your select management meetings and dedicate one day per month to helping your business become AI-native. The focus is judgment, sequencing, and accountability — not slide decks.",
  "We work on mid-term initiatives that increase adoption and ship innovative projects your team can own. Suited when you want a steady strategic voice in the room without adding headcount.",
];

const IMPL_PART_BODY = [
  "Tell us what needs to get done and my colleague and I take care of it. I am paired with an AI-native agentic engineer who ships working systems — integrations, automations, and workflows with immediate ROI.",
  "This part-time engagement is approximately 80 hours per month. Ideal when you have a clear backlog of build work and want senior oversight plus execution capacity in one package.",
];

const IMPL_FULL_BODY = [
  "Tell us what needs to get done and my colleague and I take care of it. I am paired with an AI-native agentic engineer who ships working systems — integrations, automations, and workflows with immediate ROI.",
  "The full-time package is approximately 160 hours per month for teams that need maximum throughput across marketing, sales, and recruiting systems.",
];

export const CONSULTING_HANDS_ON_RECORDS: ConsultingHandsOnRecord[] = [
  {
    slug: "advisory-board-member",
    serviceId: "advisory-board-member",
    title: "Advisory Board Member",
    priceLabel: "€2,500/month",
    variant: "advisory",
    body: ADVISORY_BODY,
  },
  {
    slug: "hands-on-implementation-part-time",
    serviceId: "implementation-part-time",
    title: "Hands on Implementation 1+1 – Part-time Package",
    priceLabel: "€5,000/month",
    variant: "implementation",
    body: IMPL_PART_BODY,
  },
  {
    slug: "hands-on-implementation-full-time",
    serviceId: "implementation-full-time",
    title: "Hands on Implementation 1+1 – Full-time Package",
    priceLabel: "€10,000/month",
    variant: "implementation",
    body: IMPL_FULL_BODY,
  },
];

export const CONSULTING_HANDS_ON_SLUGS: string[] = CONSULTING_HANDS_ON_RECORDS.map((r) => r.slug);

export function getConsultingHandsOnBySlug(slug: string): ConsultingHandsOnRecord | undefined {
  return CONSULTING_HANDS_ON_RECORDS.find((r) => r.slug === slug);
}
