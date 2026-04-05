/**
 * Canonical page URLs for Meta CAPI `event_source_url` (align with live funnel paths).
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
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

  const workshopMatch = interestedInProduct.match(/^workshop:(.+)$/);
  if (workshopMatch?.[1]?.trim()) {
    return `${base}/workshops/${workshopMatch[1].trim()}/tickets`;
  }

  if (interestedInProduct.startsWith("mentoring:")) {
    return `${base}/ai-mentoring/join`;
  }

  return `${base}/tickets`;
}
