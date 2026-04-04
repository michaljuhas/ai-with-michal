import { describe, expect, it } from "vitest";
import {
  extractPreviewImage,
  PREVIEW_EXTRACTOR_STRATEGY_COUNT,
  resolveUrlForPreview,
} from "./link-preview";

describe("resolveUrlForPreview", () => {
  it("resolves relative URLs against base", () => {
    expect(resolveUrlForPreview("/pic.png", "https://example.com/page")).toBe(
      "https://example.com/pic.png"
    );
  });

  it("returns original relative path when base URL is invalid", () => {
    expect(resolveUrlForPreview("/x", "not-a-valid-base")).toBe("/x");
  });
});

describe("extractPreviewImage", () => {
  const base = "https://example.com/article";

  it("extracts og:image (property before content)", () => {
    const html = `<head><meta property="og:image" content="/hero.jpg" /></head>`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/hero.jpg");
  });

  it("extracts og:image (content before property)", () => {
    const html = `<head><meta content="https://cdn.example.com/x.png" property="og:image" /></head>`;
    expect(extractPreviewImage(html, base)).toBe("https://cdn.example.com/x.png");
  });

  it("extracts twitter:image", () => {
    const html = `<meta name="twitter:image" content="/tw.png" />`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/tw.png");
  });

  it("extracts JSON-LD string image", () => {
    const html = `<script type="application/ld+json">{"@type":"Article","image":"https://x.com/a.jpg"}</script>`;
    expect(extractPreviewImage(html, base)).toBe("https://x.com/a.jpg");
  });

  it("extracts JSON-LD array image", () => {
    const html = `<script type="application/ld+json">{"image":["/arr.jpg"]}</script>`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/arr.jpg");
  });

  it("extracts JSON-LD object image with url", () => {
    const html = `<script type="application/ld+json">{"image":{"url":"/obj.jpg"}}</script>`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/obj.jpg");
  });

  it("extracts link rel=image_src", () => {
    const html = `<link rel="image_src" href="/legacy.png" />`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/legacy.png");
  });

  it("extracts meta itemprop=image", () => {
    const html = `<meta itemprop="image" content="/item.jpg" />`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/item.jpg");
  });

  it("extracts apple-touch-icon 180x180 first", () => {
    const html = `<link rel="apple-touch-icon" sizes="180x180" href="/icon180.png" /><link rel="apple-touch-icon" href="/fallback.png" />`;
    expect(extractPreviewImage(html, base)).toBe("https://example.com/icon180.png");
  });

  it("returns null when no image", () => {
    expect(extractPreviewImage("<html><body>hi</body></html>", base)).toBeNull();
  });

  it("exports extractor count for logging parity", () => {
    expect(PREVIEW_EXTRACTOR_STRATEGY_COUNT).toBe(6);
  });
});
