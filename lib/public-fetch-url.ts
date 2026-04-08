import dns from "node:dns/promises";
import net from "node:net";

function isNonPublicIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224 && a <= 239) return true;
  return false;
}

function isNonPublicIpv6(ip: string): boolean {
  const l = ip.toLowerCase();
  if (l === "::1") return true;
  if (l.startsWith("fc") || l.startsWith("fd")) return true;
  if (
    l.startsWith("fe8") ||
    l.startsWith("fe9") ||
    l.startsWith("fea") ||
    l.startsWith("feb")
  ) {
    return true;
  }
  if (l.startsWith("ff")) return true;
  return false;
}

/**
 * Resolve hostname and block private/link-local targets (SSRF mitigation for server-side fetch).
 */
export async function assertUrlSafeForServerFetch(url: URL): Promise<void> {
  const host = url.hostname;

  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host === "0.0.0.0"
  ) {
    throw new Error("URL host not allowed");
  }

  if (net.isIPv4(host)) {
    if (isNonPublicIpv4(host)) throw new Error("URL host not allowed");
    return;
  }
  if (net.isIPv6(host)) {
    if (isNonPublicIpv6(host)) throw new Error("URL host not allowed");
    return;
  }

  let records: { address: string; family: number }[];
  try {
    records = await dns.lookup(host, { all: true });
  } catch {
    throw new Error("URL host could not be resolved");
  }

  for (const r of records) {
    if (net.isIPv4(r.address) && isNonPublicIpv4(r.address)) {
      throw new Error("URL resolves to a non-public address");
    }
    if (net.isIPv6(r.address) && isNonPublicIpv6(r.address)) {
      throw new Error("URL resolves to a non-public address");
    }
  }
}
