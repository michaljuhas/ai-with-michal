import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

describe("POST /api/workgroup/upload-image", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(crypto, "randomUUID").mockReturnValue("fixed-uuid-test");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const fd = new FormData();
    fd.set("file", new File([new Uint8Array([1])], "x.jpg", { type: "image/jpeg" }));

    const req = new NextRequest("http://localhost/api/workgroup/upload-image", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for disallowed mime type", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const fd = new FormData();
    fd.set("file", new File([new Uint8Array([1])], "x.gif", { type: "image/gif" }));

    const req = new NextRequest("http://localhost/api/workgroup/upload-image", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when file exceeds 5 MB", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    const fd = new FormData();
    fd.set("file", new File([big], "big.jpg", { type: "image/jpeg" }));

    const req = new NextRequest("http://localhost/api/workgroup/upload-image", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 with public URL on success", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const upload = vi.fn(async () => ({ error: null }));
    const getPublicUrl = vi.fn(() => ({
      data: { publicUrl: "https://xyz.supabase.co/storage/v1/object/public/ai-with-michal-public/workgroup-posts/u1/fixed-uuid-test.jpg" },
    }));

    vi.mocked(createServiceClient).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          upload,
          getPublicUrl,
        })),
      },
    } as never);

    const fd = new FormData();
    fd.set("file", new File([new Uint8Array([1, 2, 3])], "x.jpg", { type: "image/jpeg" }));

    const req = new NextRequest("http://localhost/api/workgroup/upload-image", {
      method: "POST",
      body: fd,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.url).toContain("fixed-uuid-test.jpg");
    expect(upload).toHaveBeenCalled();
  });
});
