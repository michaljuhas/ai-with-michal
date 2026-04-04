import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { findOrCreateCustomer, getStripe } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
  findOrCreateCustomer: vi.fn(),
  MENTORING_PRICE_IDS: { group: "price_mentor_group", vip: "price_mentor_vip" },
}));

vi.mock("@/lib/posthog-server", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn(),
}));

describe("POST /api/mentoring-checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);

    const req = new NextRequest("http://localhost/api/mentoring-checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "group" }),
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

    const req = new NextRequest("http://localhost/api/mentoring-checkout", {
      method: "POST",
      body: JSON.stringify({ tier: "enterprise" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates subscription checkout session for vip", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_vip" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "vip@x.com" }],
      firstName: "V",
      lastName: "Ip",
    } as never);

    vi.mocked(findOrCreateCustomer).mockResolvedValue("cus_mentor");

    const sessionsCreate = vi.fn(async () => ({
      id: "cs_mentor",
      url: "https://stripe.test/cs_mentor",
    }));

    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: sessionsCreate } },
    } as never);

    const req = new NextRequest("http://localhost/api/mentoring-checkout", {
      method: "POST",
      headers: { origin: "https://aiwithmichal.com" },
      body: JSON.stringify({ tier: "vip", cancelUrl: "/ai-mentoring/join" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/cs_mentor" });

    expect(sessionsCreate).toHaveBeenCalledOnce();
    const arg = sessionsCreate.mock.calls[0][0];
    expect(arg.mode).toBe("subscription");
    expect(arg.line_items?.[0]).toEqual({ price: "price_mentor_vip", quantity: 1 });
    expect(arg.metadata).toMatchObject({
      clerk_user_id: "user_vip",
      tier: "vip",
      product: "mentoring",
    });
    expect(arg.subscription_data?.metadata).toMatchObject({
      clerk_user_id: "user_vip",
      tier: "vip",
      product: "mentoring",
    });

    expect(captureEvent).toHaveBeenCalledWith(
      "user_vip",
      "mentoring_checkout_session_created",
      expect.objectContaining({ tier: "vip", stripe_session_id: "cs_mentor" })
    );
    expect(sendMetaEvent).toHaveBeenCalled();
  });
});
