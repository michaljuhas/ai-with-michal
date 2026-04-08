/** Meta CAPI proxy: only these event names are accepted from the browser. */
export const META_CLIENT_EVENT_NAMES = new Set([
  "ViewContent",
  "Lead",
  "AddToCart",
]);

export function isAllowedMetaClientEventName(name: unknown): name is string {
  return typeof name === "string" && META_CLIENT_EVENT_NAMES.has(name);
}

/** event_source_url must match NEXT_PUBLIC_APP_URL origin (hostname), including optional www. */
export function isAllowedMetaEventSourceUrl(urlStr: string): boolean {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base) return false;

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  let allowedHost: string;
  try {
    allowedHost = new URL(base).hostname.toLowerCase();
  } catch {
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  const stripWww = (h: string) => (h.startsWith("www.") ? h.slice(4) : h);

  return stripWww(host) === stripWww(allowedHost);
}
