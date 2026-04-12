/**
 * Validates `redirect_url` query values for post-auth redirects (login / register).
 * Returns pathname + search + hash for same-site relative navigation only.
 */
export function parseSafeRedirectUrl(raw: string | undefined | null): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  try {
    const u = new URL(trimmed, "https://placeholder.local");
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.username || u.password) return null;
    if (u.host !== "placeholder.local") return null;
    const out = `${u.pathname}${u.search}${u.hash}`;
    if (!out.startsWith("/") || out.startsWith("//")) return null;
    return out;
  } catch {
    return null;
  }
}

/** Absolute URL for Clerk `forceRedirectUrl` / `fallbackRedirectUrl`. */
export function absoluteUrlForRedirect(appBase: string, pathnameWithQuery: string): string {
  const base = appBase.replace(/\/$/, "");
  return `${base}${pathnameWithQuery.startsWith("/") ? pathnameWithQuery : `/${pathnameWithQuery}`}`;
}

/** Stable value stored on `registrations.signup_intent` for member-resource lead gen. */
export function deriveSignupIntentFromRedirectPath(pathWithQuery: string | null): string | null {
  if (!pathWithQuery) return null;
  let pathname: string;
  try {
    pathname = new URL(pathWithQuery, "https://placeholder.local").pathname;
  } catch {
    return null;
  }
  if (pathname.startsWith("/members/resources/")) {
    return `member_resource:${pathname}`;
  }
  return null;
}
