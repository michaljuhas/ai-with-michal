import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("POST /api/members/resource-grants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: "user_clerk_1" } as never);
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "lead-magnet" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when slug is missing", async () => {
    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when resource does not exist", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({ data: null, error: null })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "missing" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 404 when resource is archived", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: { id: "res1", visibility: "unlisted", is_archived: true },
              error: null,
            })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "old" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 for public resources", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: { id: "res1", visibility: "public", is_archived: false },
              error: null,
            })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "public-one" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("inserts grant for unlisted resource and returns ok", async () => {
    const insert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "member_resources") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: { id: "res1", visibility: "unlisted", is_archived: false },
                  error: null,
                })),
              })),
            })),
          };
        }
        if (table === "member_resource_grants") {
          return { insert };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "lead-magnet" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(insert).toHaveBeenCalledWith({
      resource_id: "res1",
      clerk_user_id: "user_clerk_1",
    });
  });

  it("treats unique violation as idempotent success", async () => {
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "member_resources") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: { id: "res1", visibility: "unlisted", is_archived: false },
                  error: null,
                })),
              })),
            })),
          };
        }
        if (table === "member_resource_grants") {
          return {
            insert: vi.fn(async () => ({ error: { code: "23505" } })),
          };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest("http://localhost/api/members/resource-grants", {
      method: "POST",
      body: JSON.stringify({ slug: "lead-magnet" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
