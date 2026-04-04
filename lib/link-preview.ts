/**
 * HTML → preview image URL. Used by the workgroup link-preview API route.
 */

export function resolveUrlForPreview(url: string, base: string): string {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

type Extractor = (html: string, base: string) => string | null;

function extractOgImage(html: string, base: string): string | null {
  const patterns = [
    /property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  return null;
}

function extractTwitterImage(html: string, base: string): string | null {
  const patterns = [
    /name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  return null;
}

function extractJsonLdImage(html: string, base: string): string | null {
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(scriptMatch[1]);
      const candidates = Array.isArray(data) ? data : [data];
      for (const node of candidates) {
        const img = node?.image;
        if (typeof img === "string" && img) return resolveUrlForPreview(img, base);
        if (Array.isArray(img) && typeof img[0] === "string" && img[0])
          return resolveUrlForPreview(img[0], base);
        if (typeof img === "object" && img?.url)
          return resolveUrlForPreview(img.url, base);
      }
    } catch {
      // malformed JSON — skip
    }
  }
  return null;
}

function extractImageSrc(html: string, base: string): string | null {
  const patterns = [
    /rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']image_src["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  return null;
}

function extractItempropImage(html: string, base: string): string | null {
  const metaP = [
    /itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+itemprop=["']image["']/i,
  ];
  for (const p of metaP) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  const imgP = [
    /itemprop=["']image["'][^>]+src=["']([^"']+)["']/i,
    /src=["']([^"']+)["'][^>]+itemprop=["']image["']/i,
  ];
  for (const p of imgP) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  return null;
}

function extractAppleTouchIcon(html: string, base: string): string | null {
  const sizedP =
    /rel=["']apple-touch-icon["'][^>]+sizes=["']180x180["'][^>]+href=["']([^"']+)["']/i;
  const m1 = html.match(sizedP);
  if (m1?.[1]) return resolveUrlForPreview(m1[1], base);

  const patterns = [
    /rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(?:-precomposed)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolveUrlForPreview(m[1], base);
  }
  return null;
}

const EXTRACTORS: Extractor[] = [
  extractOgImage,
  extractTwitterImage,
  extractJsonLdImage,
  extractImageSrc,
  extractItempropImage,
  extractAppleTouchIcon,
];

export const PREVIEW_EXTRACTOR_STRATEGY_COUNT = EXTRACTORS.length;

export function extractPreviewImage(html: string, baseUrl: string): string | null {
  for (const extractor of EXTRACTORS) {
    const imageUrl = extractor(html, baseUrl);
    if (imageUrl) return imageUrl;
  }
  return null;
}
