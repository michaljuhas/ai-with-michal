import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { findOrCreateCustomer, getStripe } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
  findOrCreateCustomer: vi.fn(),
}));

vi.mock("@/lib/posthog-server", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn(),
}));

const workshopSlug = "2026-04-23-sourcing-automation";

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "basic", workshopSlug }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid tier", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    const req = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "vip", workshopSlug }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid workshop slug", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    const req = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "basic", workshopSlug: "nope" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 sold_out when at capacity", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "a@b.com" }],
      firstName: "A",
      lastName: "B",
    } as never);

    // CAPACITY is fixed at module load from WORKSHOP_CAPACITY (default 20 in route.ts)
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(async () => ({ count: 20, error: null })),
          })),
        })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "basic", workshopSlug }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "sold_out" });
  });

  it("creates checkout session with expected metadata", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_clerk_1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "buyer@x.com" }],
      firstName: "Buyer",
      lastName: "Name",
    } as never);

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(async () => ({ count: 0, error: null })),
          })),
        })),
      })),
    } as never);

    vi.mocked(findOrCreateCustomer).mockResolvedValue("cus_123");

    const sessionsCreate = vi.fn(async () => ({
      id: "cs_test",
      url: "https://stripe.test/checkout/cs_test",
    }));

    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: sessionsCreate } },
    } as never);

    const req = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      headers: { origin: "https://aiwithmichal.com" },
      body: JSON.stringify({ tier: "pro", workshopSlug, cancelUrl: "/tickets" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/checkout/cs_test" });

    expect(sessionsCreate).toHaveBeenCalledOnce();
    const arg = sessionsCreate.mock.calls[0][0];
    expect(arg.metadata).toMatchObject({
      clerk_user_id: "user_clerk_1",
      tier: "pro",
      workshop_slug: workshopSlug,
    });
    expect(arg.metadata.price_id).toMatch(/^price_/);

    expect(captureEvent).toHaveBeenCalledWith(
      "user_clerk_1",
      "checkout_session_created",
      expect.objectContaining({
        tier: "pro",
        stripe_session_id: "cs_test",
      })
    );
    expect(sendMetaEvent).toHaveBeenCalled();
  });
});
