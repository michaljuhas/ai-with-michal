export type PrivateWorkshopRecord = {
  slug: string;
  title: string;
  body: string[];
  priceLabel: string;
  /** Matches work-together `id` for /contact?service= */
  contactServiceId: string;
};

const BODY_USING_AI = [
  "Highly customized workshop with your management team. A session includes prep, 2-hour video call, roadmap, and followup.",
];

const BODY_PROCESSES = [
  "Highly customized workshop with your management team. A session includes my prep, 2-hour video call, roadmap, and followup.",
  "Ideal if you have repetitive processes including manual administrative work, if you are locked with an IT vendor, or if you pay a lot for IT or admin services.",
];

const LEVELLING_BODY = [
  "Highly customized private workshop with your management team. A session includes prep, a 2-hour video call, a roadmap, and follow-up.",
];

const BODY_PRODUCTIVITY = [
  "Inspire your team to take full advantage of AI in their daily work. A practical session covering the mindset shift, the best tools, and the workflows that actually save time, no matter which department your people sit in.",
];

/** Detail-page copy; slugs and titles stay in sync with work-together-services `detailSlug` / private workshop `title`. */
export const PRIVATE_WORKSHOP_RECORDS: PrivateWorkshopRecord[] = [
  {
    slug: "using-ai-in-your-business",
    contactServiceId: "using-ai-in-your-business",
    title: "Using AI in your business (private workshop)",
    body: BODY_USING_AI,
    priceLabel: "€1,500/session excl VAT",
  },
  {
    slug: "improving-your-processes-with-ai",
    contactServiceId: "improving-your-processes-with-ai",
    title: "Improving your processes with AI (private workshop)",
    body: BODY_PROCESSES,
    priceLabel: "€1,500/session excl VAT",
  },
  {
    slug: "personal-productivity-with-ai",
    contactServiceId: "personal-productivity-with-ai",
    title: "Personal Productivity with AI (private workshop)",
    body: BODY_PRODUCTIVITY,
    priceLabel: "€1,500/session excl VAT",
  },
  {
    slug: "levelling-ai-adoption-recruiting-teams",
    contactServiceId: "levelling-ai-recruiting",
    title: "Levelling AI adoption in Recruiting Teams (private workshop)",
    body: LEVELLING_BODY,
    priceLabel: "€1,500/session excl VAT",
  },
  {
    slug: "levelling-ai-adoption-gtm-teams",
    contactServiceId: "levelling-ai-gtm",
    title: "Levelling AI adoption in GTM Teams (private workshop)",
    body: LEVELLING_BODY,
    priceLabel: "€1,500/session excl VAT",
  },
  {
    slug: "levelling-ai-adoption-operations-teams",
    contactServiceId: "levelling-ai-operations",
    title: "Levelling AI adoption in Operations Teams (private workshop)",
    body: LEVELLING_BODY,
    priceLabel: "€1,500/session excl VAT",
  },
];

export function getPrivateWorkshopBySlug(slug: string): PrivateWorkshopRecord | undefined {
  return PRIVATE_WORKSHOP_RECORDS.find((w) => w.slug === slug);
}

export const PRIVATE_WORKSHOP_SLUGS: string[] = PRIVATE_WORKSHOP_RECORDS.map((w) => w.slug);
