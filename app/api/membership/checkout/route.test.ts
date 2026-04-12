import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { findOrCreateCustomer, getStripe } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { sendMetaEvent } from "@/lib/meta-capi";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
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

function makeReq(body: object, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/membership/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/membership/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns 401 when not signed in", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    vi.stubEnv("STRIPE_PRICE_ANNUAL_MEMBERSHIP", "price_mem_1");

    const { POST } = await import("./route");
    const res = await POST(makeReq({}));
    expect(res.status).toBe(401);
  });

  it("returns 503 when price env missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "u1" } as never);
    vi.stubEnv("STRIPE_PRICE_ANNUAL_MEMBERSHIP", "");

    const { POST } = await import("./route");
    const res = await POST(makeReq({}));
    expect(res.status).toBe(503);
    expect(captureEvent).toHaveBeenCalledWith(
      "u1",
      "membership_checkout_not_configured",
      expect.objectContaining({ reason: "missing_stripe_price_annual_membership" })
    );
  });

  it("creates Stripe checkout session for annual membership", async () => {
    vi.stubEnv("STRIPE_PRICE_ANNUAL_MEMBERSHIP", "price_annual_test");
    vi.mocked(auth).mockResolvedValue({ userId: "user_clerk_mem" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      emailAddresses: [{ emailAddress: "buyer@x.com" }],
      firstName: "Buyer",
      lastName: "Name",
    } as never);

    vi.mocked(findOrCreateCustomer).mockResolvedValue("cus_mem");

    const sessionsCreate = vi.fn(async () => ({
      id: "cs_mem_test",
      url: "https://stripe.test/checkout/cs_mem_test",
    }));

    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: sessionsCreate } },
    } as never);

    const { POST } = await import("./route");
    const res = await POST(
      makeReq({ cancelUrl: "/membership" }, { origin: "https://aiwithmichal.com" })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://stripe.test/checkout/cs_mem_test" });

    expect(sessionsCreate).toHaveBeenCalledOnce();
    const arg = sessionsCreate.mock.calls[0][0];
    expect(arg.mode).toBe("payment");
    expect(arg.metadata).toMatchObject({
      product: "annual_membership",
      clerk_user_id: "user_clerk_mem",
      price_id: "price_annual_test",
    });
    expect(arg.success_url).toContain("/thank-you/membership");

    expect(captureEvent).toHaveBeenCalledWith(
      "user_clerk_mem",
      "membership_checkout_session_created",
      expect.objectContaining({ stripe_session_id: "cs_mem_test" })
    );
    expect(sendMetaEvent).toHaveBeenCalled();
  });
});
