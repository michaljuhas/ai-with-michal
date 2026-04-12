export type PrivateWorkshopRecord = {
  slug: string;
  title: string;
  body: string[];
  priceLabel: string;
  /** Matches work-together `id` for /contact?service= */
  contactServiceId: string;
};

const BODY_USING_AI = [
  "A discreet, senior-led sprint for founders and executive teams. I arrive with a concise pre-read on your business, facilitate a focused working session with leadership, and leave you with a prioritized roadmap, explicit next steps, and a follow-up touchpoint so decisions turn into execution.",
  "Ideal when you want an independent view on where AI genuinely moves revenue, risk, or operating leverage — without vendor noise or slide-deck theater.",
];

const BODY_PROCESSES = [
  "We surface where manual work, brittle tooling, or vendor lock-in quietly tax your organization — then translate that into a sequenced plan: what AI can absorb, what to simplify first, and what to leave untouched. You get clarity, ownership, and a defensible rationale for the board or your CFO.",
  "Especially valuable when repetitive workflows, integration debt, or admin load are constraining growth and margin.",
];

const BODY_RECRUITING_ADVISORY = [
  "A structured sprint for heads of talent and CHROs who need recruiting to run faster without lowering the bar. I begin with a tight diagnostic of your workflows and data posture, then convene a private working session with your leadership team to lock priorities and trade-offs.",
  "You leave with an implementation roadmap, named owners, and a follow-up checkpoint — engineered for adoption, not a one-off training day.",
];

const BODY_GTM_ADVISORY = [
  "For CEOs, CROs, and GTM leaders who want pipeline and velocity from systems — not heroics. I review your current motion, isolate friction from lead to close, and align the executive team on the highest-leverage AI bets before capital or headcount follows.",
  "Deliverable-first: a prioritized systems roadmap your team can brief internally on Monday morning.",
];

const BODY_OPERATIONS_ADVISORY = [
  "For COOs and operational leaders under pressure to do more with the same footprint. I map where capacity leaks today, where AI-assisted workflows reclaim the most hours, and how sequencing reduces risk — then facilitate a leadership working session so priorities stick.",
  "You receive a concrete roadmap: automate, redesign, or stop — plus a follow-up to keep momentum against quarterly goals.",
];

const BODY_PRODUCTIVITY = [
  "Executive teams and senior IC cohorts who need AI embedded in how work actually gets done — not another awareness session. Role-aware, immediately usable workflows replace default habits; every participant leaves with something they will use this week.",
  "Built for organizations that have outgrown pilots and want disciplined, measurable change at the edge of the business.",
];

/** Detail-page copy; slugs and titles stay in sync with work-together-services `detailSlug` / private workshop `title`. */
export const PRIVATE_WORKSHOP_RECORDS: PrivateWorkshopRecord[] = [
  {
    slug: "using-ai-in-your-business",
    contactServiceId: "using-ai-in-your-business",
    title: "Using AI in Your Business",
    body: BODY_USING_AI,
    priceLabel: "€1,500/sprint",
  },
  {
    slug: "improving-your-processes-with-ai",
    contactServiceId: "improving-your-processes-with-ai",
    title: "Improving Your Processes with AI",
    body: BODY_PROCESSES,
    priceLabel: "€1,500/sprint",
  },
  {
    slug: "personal-productivity-with-ai",
    contactServiceId: "personal-productivity-with-ai",
    title: "Personal Productivity with AI",
    body: BODY_PRODUCTIVITY,
    priceLabel: "€1,500/sprint",
  },
  {
    slug: "recruiting-ai-workflow-advisory",
    contactServiceId: "levelling-ai-recruiting",
    title: "Recruiting AI Workflow Advisory",
    body: BODY_RECRUITING_ADVISORY,
    priceLabel: "€1,500/sprint",
  },
  {
    slug: "gtm-ai-systems-advisory",
    contactServiceId: "levelling-ai-gtm",
    title: "GTM AI Systems Advisory",
    body: BODY_GTM_ADVISORY,
    priceLabel: "€1,500/sprint",
  },
  {
    slug: "operations-ai-systems-advisory",
    contactServiceId: "levelling-ai-operations",
    title: "Operations AI Systems Advisory",
    body: BODY_OPERATIONS_ADVISORY,
    priceLabel: "€1,500/sprint",
  },
];

export function getPrivateWorkshopBySlug(slug: string): PrivateWorkshopRecord | undefined {
  return PRIVATE_WORKSHOP_RECORDS.find((w) => w.slug === slug);
}

export const PRIVATE_WORKSHOP_SLUGS: string[] = PRIVATE_WORKSHOP_RECORDS.map((w) => w.slug);
