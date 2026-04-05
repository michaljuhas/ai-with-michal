/**
 * Canonical page URLs for Meta CAPI `event_source_url` (align with live funnel paths).
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** Slug from Clerk `interested_in_product` when the value matches `workshop:` + slug. */
export function parseWorkshopSlugFromInterestedProduct(
  interestedInProduct: string | null | undefined
): string | null {
  const raw = interestedInProduct?.trim();
  if (!raw) return null;
  const workshopMatch = raw.match(/^workshop:(.+)$/);
  const slug = workshopMatch?.[1]?.trim();
  return slug || null;
}

/** Purchase after workshop checkout — `/workshops/[slug]/tickets` when slug exists. */
export function metaPurchaseEventSourceUrl(
  appUrl: string | undefined | null,
  workshopSlug?: string | null
): string {
  const base = stripTrailingSlash((appUrl ?? "").trim() || "https://aiwithmichal.com");
  const slug = workshopSlug?.trim();
  if (slug) return `${base}/workshops/${slug}/tickets`;
  return `${base}/tickets`;
}

/**
 * Lead on registration — `interested_in_product` from Clerk unsafeMetadata:
 * `workshop:…` → workshop tickets page; `mentoring:…` → mentoring join.
 */
export function metaLeadEventSourceUrl(
  appUrl: string | undefined | null,
  interestedInProduct: string | null
): string {
  const base = stripTrailingSlash((appUrl ?? "").trim() || "https://aiwithmichal.com");
  if (!interestedInProduct?.trim()) return `${base}/tickets`;

  const workshopSlug = parseWorkshopSlugFromInterestedProduct(interestedInProduct);
  if (workshopSlug) {
    return `${base}/workshops/${workshopSlug}/tickets`;
  }

  if (interestedInProduct.startsWith("mentoring:")) {
    return `${base}/ai-mentoring/join`;
  }

  return `${base}/tickets`;
}
