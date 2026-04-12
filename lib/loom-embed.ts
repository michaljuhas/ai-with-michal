/**
 * Convert a Loom share URL to an embed URL for iframes.
 * Accepts https://www.loom.com/share/... or https://loom.com/share/...
 */
export function loomShareToEmbedUrl(shareUrl: string): string | null {
  const trimmed = shareUrl.trim();
  if (!trimmed) return null;
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  if (host !== "www.loom.com" && host !== "loom.com") {
    return null;
  }
  const match = u.pathname.match(/^\/share\/([a-zA-Z0-9-]+)/);
  if (!match) return null;
  const id = match[1];
  return `https://www.loom.com/embed/${id}`;
}
