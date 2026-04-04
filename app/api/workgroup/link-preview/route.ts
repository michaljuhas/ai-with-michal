import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

function resolve(url: string, base: string): string {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

/**
 * Try each extractor in priority order and return the first non-null result.
 * Each extractor receives the full HTML string and the page base URL.
 */
type Extractor = (html: string, base: string) => string | null;

// 1. og:image / og:image:secure_url — highest quality, most widely supported
function extractOgImage(html: string, base: string): string | null {
  const patterns = [
    /property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
  }
  return null;
}

// 2. twitter:image / twitter:image:src
function extractTwitterImage(html: string, base: string): string | null {
  const patterns = [
    /name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
  }
  return null;
}

// 3. Schema.org JSON-LD — look for "image" inside any ld+json block
function extractJsonLdImage(html: string, base: string): string | null {
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(scriptMatch[1]);
      const candidates = Array.isArray(data) ? data : [data];
      for (const node of candidates) {
        const img = node?.image;
        if (typeof img === "string" && img) return resolve(img, base);
        if (Array.isArray(img) && typeof img[0] === "string" && img[0])
          return resolve(img[0], base);
        if (typeof img === "object" && img?.url)
          return resolve(img.url, base);
      }
    } catch {
      // malformed JSON — skip
    }
  }
  return null;
}

// 4. <link rel="image_src"> — older but still used by some CMSes
function extractImageSrc(html: string, base: string): string | null {
  const patterns = [
    /rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']image_src["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
  }
  return null;
}

// 5. itemprop="image" — Schema.org microdata on <meta> or <img>
function extractItempropImage(html: string, base: string): string | null {
  // <meta itemprop="image" content="...">
  const metaP = [
    /itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]+itemprop=["']image["']/i,
  ];
  for (const p of metaP) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
  }
  // <img itemprop="image" src="...">
  const imgP = [
    /itemprop=["']image["'][^>]+src=["']([^"']+)["']/i,
    /src=["']([^"']+)["'][^>]+itemprop=["']image["']/i,
  ];
  for (const p of imgP) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
  }
  return null;
}

// 6. <link rel="apple-touch-icon"> — good-quality square icon (180×180)
function extractAppleTouchIcon(html: string, base: string): string | null {
  // Prefer the 180×180 size if available
  const sizedP =
    /rel=["']apple-touch-icon["'][^>]+sizes=["']180x180["'][^>]+href=["']([^"']+)["']/i;
  const m1 = html.match(sizedP);
  if (m1?.[1]) return resolve(m1[1], base);

  const patterns = [
    /rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i,
    /href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(?:-precomposed)?["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return resolve(m[1], base);
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

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return Response.json({ imageUrl: null });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return Response.json({ imageUrl: null });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return Response.json({ imageUrl: null });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(parsed.href, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json({ imageUrl: null });
    }

    // Stream up to 500 KB, stop early once </head> is found
    const reader = res.body?.getReader();
    if (!reader) return Response.json({ imageUrl: null });

    let html = "";
    let bytesRead = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
      bytesRead += value.byteLength;
      if (html.includes("</head>") || bytesRead >= 500_000) {
        reader.cancel();
        break;
      }
    }

    for (const extractor of EXTRACTORS) {
      const imageUrl = extractor(html, parsed.href);
      if (imageUrl) {
        return Response.json({ imageUrl });
      }
    }

    console.log(`[link-preview] no image found for ${parsed.href} (${bytesRead} bytes, tried ${EXTRACTORS.length} strategies)`);
    return Response.json({ imageUrl: null });
  } catch (err) {
    console.log(`[link-preview] fetch error for ${parsed.href}:`, String(err));
    return Response.json({ imageUrl: null });
  }
}
