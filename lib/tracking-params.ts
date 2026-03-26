/**
 * UTM + referral attribution helpers.
 *
 * Strategy: first-touch wins. We write to localStorage once (when tracking
 * params are first seen in the URL) and never overwrite with a later visit
 * that has no params. This means the stored params reflect the campaign /
 * referral that first brought the visitor to the site.
 */

export type TrackingParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
};

export type Attribution = {
  source_type: "Paid" | "Referral" | "Organic";
  source_detail: string | null;
};

const STORAGE_KEY = "_tracking";

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;

/**
 * Read tracking params from the current URL and persist them to localStorage.
 * Call on every page load (client-side only). Never clears existing data —
 * params are only written when the URL contains at least one tracking param.
 */
export function captureTrackingParams(): void {
  if (typeof window === "undefined") return;

  const search = new URLSearchParams(window.location.search);
  const found: Partial<TrackingParams> = {};

  for (const key of TRACKING_KEYS) {
    const val = search.get(key);
    if (val) found[key] = val;
  }

  if (Object.keys(found).length === 0) return;

  // Merge: existing stored params take priority (first-touch attribution).
  const existing = getStoredTrackingParams() ?? {};
  const merged = { ...found, ...existing };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage unavailable (e.g. SSR guard missed, or storage blocked)
  }
}

/** Read previously captured tracking params from localStorage. */
export function getStoredTrackingParams(): TrackingParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrackingParams) : null;
  } catch {
    return null;
  }
}

/**
 * Derive source_type and source_detail from raw tracking params.
 * Safe to call server-side (no localStorage access).
 *
 * Rules:
 *  - Paid:     utm_medium is a paid medium OR utm_source is a known paid network
 *  - Referral: ref param is present (and not Paid)
 *  - Organic:  everything else (including direct/no params)
 */
export function deriveAttribution(params: TrackingParams): Attribution {
  const medium = params.utm_medium?.toLowerCase() ?? "";
  const source = params.utm_source?.toLowerCase() ?? "";

  const PAID_MEDIUMS = new Set([
    "cpc",
    "paid",
    "paid-social",
    "paid_social",
    "paidsocial",
    "ppc",
    "display",
    "cpv",
    "cpm",
  ]);

  const PAID_SOURCES = new Set([
    "meta",
    "facebook",
    "instagram",
    "ig",
    "google",
    "google-ads",
    "linkedin-ads",
    "tiktok",
    "twitter-ads",
    "x-ads",
  ]);

  if (PAID_MEDIUMS.has(medium) || PAID_SOURCES.has(source)) {
    const parts = [params.utm_source, params.utm_campaign].filter(Boolean);
    return {
      source_type: "Paid",
      source_detail: parts.join(" – ") || null,
    };
  }

  if (params.ref) {
    return { source_type: "Referral", source_detail: params.ref };
  }

  if (params.utm_source) {
    return { source_type: "Organic", source_detail: params.utm_source };
  }

  return { source_type: "Organic", source_detail: null };
}
