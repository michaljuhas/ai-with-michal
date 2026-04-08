import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import {
  extractPreviewImage,
  PREVIEW_EXTRACTOR_STRATEGY_COUNT,
} from "@/lib/link-preview";
import { assertUrlSafeForServerFetch } from "@/lib/public-fetch-url";

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
    await assertUrlSafeForServerFetch(parsed);
  } catch {
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

    const imageUrl = extractPreviewImage(html, parsed.href);
    if (imageUrl) {
      return Response.json({ imageUrl });
    }

    console.log(
      `[link-preview] no image found for ${parsed.href} (${bytesRead} bytes, tried ${PREVIEW_EXTRACTOR_STRATEGY_COUNT} strategies)`
    );
    return Response.json({ imageUrl: null });
  } catch (err) {
    console.log(`[link-preview] fetch error for ${parsed.href}:`, String(err));
    return Response.json({ imageUrl: null });
  }
}
