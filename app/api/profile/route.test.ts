import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { GET, PATCH } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

describe("GET /api/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns profile row", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: { ai_level: "chatting", function: "gtm", country: "SK", linkedin_url: null },
              error: null,
            })),
          })),
        })),
      })),
    } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      profile: { ai_level: "chatting", function: "gtm", country: "SK", linkedin_url: null },
    });
  });

  it("returns 500 on database error", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({ data: null, error: { message: "e" } })),
          })),
        })),
      })),
    } as never);

    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("PATCH /api/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ ai_level: "offline" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: "not-json",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid ai_level", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ ai_level: "nope" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid function", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ function: "invalid" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when Clerk user has no email", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: null,
    } as never);

    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ country: "DE" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 on successful upsert", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddress: { emailAddress: "me@x.com" },
    } as never);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        ai_level: "automating",
        function: "recruiting_ta_hr",
        linkedin_url: "https://linkedin.com/in/x",
      }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_user_id: "u1",
        email: "me@x.com",
        ai_level: "automating",
        function: "recruiting_ta_hr",
        linkedin_url: "https://linkedin.com/in/x",
      }),
      { onConflict: "clerk_user_id" }
    );
  });
});
