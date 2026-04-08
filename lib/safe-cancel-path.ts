/**
 * Stripe cancel_url path: must be same-origin relative only (no scheme, no // open redirect).
 */
export function safeCheckoutCancelPath(input: unknown, fallback: string): string {
  if (typeof input !== "string") return fallback;

  const trimmed = input.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("\n") || trimmed.includes("\r")) return fallback;
  if (/^[\\/]{2,}/.test(trimmed)) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (trimmed.includes("\\")) return fallback;

  return trimmed;
}
