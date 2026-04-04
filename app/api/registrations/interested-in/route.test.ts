import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { PATCH } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  clerkClient: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

describe("PATCH /api/registrations/interested-in", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const req = new NextRequest("http://localhost/api/registrations/interested-in", {
      method: "PATCH",
      body: JSON.stringify({ product: "workshop:x" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when product missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    const req = new NextRequest("http://localhost/api/registrations/interested-in", {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when supabase update fails", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(async () => ({ error: { message: "db" } })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/registrations/interested-in", {
      method: "PATCH",
      body: JSON.stringify({ product: "mentoring:group" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(500);
  });

  it("returns 200 and mirrors product to Clerk publicMetadata", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const eq = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({ eq })),
      })),
    } as never);

    const updateUser = vi.fn(async () => {});
    vi.mocked(clerkClient).mockResolvedValue({
      users: { updateUser },
    } as never);

    const req = new NextRequest("http://localhost/api/registrations/interested-in", {
      method: "PATCH",
      body: JSON.stringify({ product: "workshop:2026-04-23-sourcing-automation" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(eq).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith("u1", {
      publicMetadata: { interested_in_product: "workshop:2026-04-23-sourcing-automation" },
    });
  });
});
