import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasPaidWorkshopOrder } from "@/lib/workshop-access";
import { GET, PATCH } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  isAdminUser: vi.fn(),
}));

vi.mock("@/lib/workshop-access", () => ({
  userHasPaidWorkshopOrder: vi.fn(),
}));

vi.mock("@/lib/workshops", () => ({
  getWorkshopBySlug: vi.fn((slug: string) => (slug ? { slug } : null)),
}));

describe("GET /api/workshops/[slug]/session-notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest("http://localhost/api/workshops/x/session-notes");
    const res = await GET(req, { params: Promise.resolve({ slug: "2026-04-23-sourcing-automation" }) });
    expect(res.status).toBe(401);
  });

  it("returns empty content when no row", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);
    vi.mocked(userHasPaidWorkshopOrder).mockResolvedValue(true);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "workshop_session_notes") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: null,
                  error: null,
                })),
              })),
            })),
          };
        }
        return {};
      }),
    } as never);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "2026-04-23-sourcing-automation" }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ content: "", updated_at: null });
  });

  it("returns stored content", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: { content: "# Notes", updated_at: "2026-01-01T00:00:00Z" },
              error: null,
            })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes");
    const res = await GET(req, { params: Promise.resolve({ slug: "x" }) });
    const body = await res.json();
    expect(body.content).toBe("# Notes");
    expect(body.updated_at).toBe("2026-01-01T00:00:00Z");
  });

  it("returns 500 on database error", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: null,
              error: { message: "db" },
            })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes");
    const res = await GET(req, { params: Promise.resolve({ slug: "x" }) });
    expect(res.status).toBe(500);
  });
});

describe("PATCH /api/workshops/[slug]/session-notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when not admin", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_nonadmin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(false);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes", {
      method: "PATCH",
      body: JSON.stringify({ content: "x" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: "x" }) });
    expect(res.status).toBe(403);
  });

  it("returns 400 on invalid JSON", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes", {
      method: "PATCH",
      body: "not-json",
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: "x" }) });
    expect(res.status).toBe(400);
  });

  it("returns 400 when content is not a string", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes", {
      method: "PATCH",
      body: JSON.stringify({ content: 123 }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ slug: "x" }) });
    expect(res.status).toBe(400);
  });

  it("returns 200 on successful upsert", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "admin" } as never);
    vi.mocked(isAdminUser).mockReturnValue(true);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        upsert,
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/workshops/w/session-notes", {
      method: "PATCH",
      body: JSON.stringify({ content: "hello" }),
    });
    const res = await PATCH(req, {
      params: Promise.resolve({ slug: "2026-04-23-sourcing-automation" }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(upsert).toHaveBeenCalled();
    const call = upsert.mock.calls[0];
    expect(call[0]).toMatchObject({
      workshop_slug: "2026-04-23-sourcing-automation",
      content: "hello",
    });
  });
});
