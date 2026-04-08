/**
 * Public ticketed workshops for CLI reporting (status, Stripe grouping).
 * Keep in sync with `lib/workshops.ts` → PUBLIC_WORKSHOPS (slugs, dates, titles).
 */

/** displayTime: always CET in customer copy (see AGENTS.md) — keep in sync with lib/workshops.ts PUBLIC_WORKSHOPS. */
export const PUBLIC_WORKSHOP_ENTRIES = [
  {
    slug: '2026-04-02-ai-in-recruiting',
    titleShort: 'AI in Recruiting',
    dateIso: '2026-04-02T14:00:00.000Z',
    displayDate: 'April 2, 2026',
    displayTime: '4:00 PM – 5:30 PM CET',
  },
  {
    slug: '2026-04-16-ai-in-recruiting',
    titleShort: 'AI in Recruiting',
    dateIso: '2026-04-16T14:00:00.000Z',
    displayDate: 'April 16, 2026',
    displayTime: '4:00 PM – 5:30 PM CET',
  },
  {
    slug: '2026-04-23-sourcing-automation',
    titleShort: 'Sourcing Automation',
    dateIso: '2026-04-23T14:00:00.000Z',
    displayDate: 'April 23, 2026',
    displayTime: '4:00 PM – 5:30 PM CET',
  },
  {
    slug: '2026-05-07-claude-cowork-recruiting',
    titleShort: 'Claude Cowork & Code',
    dateIso: '2026-05-07T14:00:00.000Z',
    displayDate: 'May 7, 2026',
    displayTime: '4:00 PM – 5:30 PM CET',
  },
];

const slugSet = new Set(PUBLIC_WORKSHOP_ENTRIES.map((w) => w.slug));

export function getUpcomingWorkshops(now = new Date()) {
  const t = now.getTime();
  return PUBLIC_WORKSHOP_ENTRIES.filter((w) => new Date(w.dateIso).getTime() > t).sort(
    (a, b) => new Date(a.dateIso) - new Date(b.dateIso),
  );
}

export function isKnownPublicSlug(slug) {
  return slug && slugSet.has(slug);
}

export function getPublicWorkshopEntry(slug) {
  return PUBLIC_WORKSHOP_ENTRIES.find((w) => w.slug === slug) ?? null;
}

export function workshopLabel(entry) {
  return `${entry.displayDate} · ${entry.titleShort}`;
}
