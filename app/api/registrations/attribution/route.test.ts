import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { PATCH } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

describe("PATCH /api/registrations/attribution", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const req = new NextRequest("http://localhost/api/registrations/attribution", {
      method: "PATCH",
      body: JSON.stringify({ utm_source: "x" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 and updates attribution", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const is = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ is })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/registrations/attribution", {
      method: "PATCH",
      body: JSON.stringify({
        utm_source: "linkedin",
        utm_campaign: "spring",
        ref: "newsletter",
      }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(is).toHaveBeenCalledWith("source_type", null);
  });

  it("treats malformed JSON as empty body", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    const is = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ is })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/registrations/attribution", {
      method: "PATCH",
      body: "not-json",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
  });

  it("returns 500 on database error", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            is: vi.fn(async () => ({ error: { message: "e" } })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/registrations/attribution", {
      method: "PATCH",
      body: "{}",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(500);
  });
});
