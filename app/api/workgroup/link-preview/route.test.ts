import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

describe("GET /api/workgroup/link-preview", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest("http://localhost/api/workgroup/link-preview?url=https://ex.com");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns imageUrl null when url param missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const req = new NextRequest("http://localhost/api/workgroup/link-preview");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imageUrl: null });
  });

  it("returns imageUrl null for non-http(s) protocol", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const req = new NextRequest("http://localhost/api/workgroup/link-preview?url=javascript:alert(1)");
    const res = await GET(req);
    expect(await res.json()).toEqual({ imageUrl: null });
  });

  it("returns extracted og:image when fetch succeeds", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const html =
      '<head><meta property="og:image" content="https://cdn.example.com/card.png" /></head>';
    globalThis.fetch = vi.fn(async () => new Response(html, { status: 200 }));

    const req = new NextRequest(
      "http://localhost/api/workgroup/link-preview?url=https://article.example.com/p"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imageUrl: "https://cdn.example.com/card.png" });
  });

  it("returns imageUrl null when response not ok", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    globalThis.fetch = vi.fn(async () => new Response("", { status: 500 }));

    const req = new NextRequest(
      "http://localhost/api/workgroup/link-preview?url=https://article.example.com/p"
    );
    const res = await GET(req);
    expect(await res.json()).toEqual({ imageUrl: null });
  });
});
