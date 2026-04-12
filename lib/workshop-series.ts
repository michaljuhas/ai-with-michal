/** Public /workshops hub — three transformation paths (see workshop series positioning). */
export type WorkshopSeriesId = "recruiting" | "gtm" | "agency";

export type WorkshopSeriesDefinition = {
  id: WorkshopSeriesId;
  label: string;
  /** Small uppercase kicker above the series title */
  kicker: string;
  /** 1–2 short paragraphs for the main panel */
  body: string[];
};

const SERIES_IDS = new Set<WorkshopSeriesId>(["recruiting", "gtm", "agency"]);

export const WORKSHOP_SERIES: WorkshopSeriesDefinition[] = [
  {
    id: "recruiting",
    label: "Recruiting AI Systems",
    kicker: "Live workshops · recruiting path",
    body: [
      "Move from ad-hoc AI chats to repeatable systems: sourcing, screening, reporting, and delivery — without losing the human edge.",
      "Each session is a focused 90 minutes with concrete workflows you can apply the same week.",
    ],
  },
  {
    id: "gtm",
    label: "GTM AI Systems",
    kicker: "Live workshops · go-to-market path",
    body: [
      "For marketing, sales, and revenue teams who want AI to compress cycle time — research, outreach, content, and pipeline — not add another tool stack.",
      "Workshops in this series will mirror the same systems-first approach as recruiting: one module at a time, built for operators.",
    ],
  },
  {
    id: "agency",
    label: "Agency AI Systems",
    kicker: "Live workshops · agency path",
    body: [
      "Built for recruitment and staffing agencies juggling clients, margins, and speed — AI that supports delivery, BD, and internal ops.",
      "Sessions will focus on what scales across accounts while staying compliant and on-brand.",
    ],
  },
];

export function parseWorkshopSeriesParam(value: string | undefined): WorkshopSeriesId {
  if (value && SERIES_IDS.has(value as WorkshopSeriesId)) {
    return value as WorkshopSeriesId;
  }
  return "recruiting";
}

export function getWorkshopSeriesDefinition(
  id: WorkshopSeriesId,
): WorkshopSeriesDefinition | undefined {
  return WORKSHOP_SERIES.find((s) => s.id === id);
}
