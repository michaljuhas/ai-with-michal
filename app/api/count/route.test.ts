import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

describe("GET /api/count", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when not admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_normal" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const req = new NextRequest("http://localhost/api/count");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns count without slug filter when admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(async () => ({ count: 12, error: null })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/count");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 12 });
  });

  it("returns count with workshop slug filter when admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    const secondEq = vi.fn(async () => ({ count: 3, error: null }));
    const firstEq = vi.fn(() => ({ eq: secondEq }));

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: firstEq,
        })),
      })),
    } as never);

    const req = new NextRequest(
      "http://localhost/api/count?slug=2026-04-23-sourcing-automation"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 3 });
    expect(firstEq).toHaveBeenCalledWith("status", "paid");
    expect(secondEq).toHaveBeenCalledWith(
      "workshop_slug",
      "2026-04-23-sourcing-automation"
    );
  });

  it("returns count 0 when supabase errors", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(async () => ({
            count: null,
            error: { message: "boom" },
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/count");
    const res = await GET(req);
    expect(await res.json()).toEqual({ count: 0 });
  });
});
