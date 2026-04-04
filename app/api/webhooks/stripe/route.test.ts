import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { captureEvent } from "@/lib/posthog-server";
import { notifyAdminPaymentCompleted, sendWorkshopConfirmation } from "@/lib/email";
import { sendMetaEvent } from "@/lib/meta-capi";
import { POST } from "./route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
}));

vi.mock("@/lib/posthog-server", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  notifyAdminPaymentCompleted: vi.fn(),
  sendWorkshopConfirmation: vi.fn(),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn(),
}));

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  });

  it("returns 400 when stripe-signature header missing", async () => {
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    const constructEvent = vi.fn(() => {
      throw new Error("Invalid signature");
    });
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent },
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "bad" },
      body: "raw",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when checkout.session.completed missing metadata", async () => {
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_x",
          metadata: {},
          amount_total: 7900,
          customer_email: "a@b.com",
        },
      },
    };
    const constructEvent = vi.fn(() => event);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent },
    } as never);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "raw-body",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("upserts order and returns received for completed checkout", async () => {
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_ok",
          metadata: {
            clerk_user_id: "user_1",
            tier: "pro",
            workshop_slug: "2026-04-23-sourcing-automation",
            price_id: "price_abc",
            customer_name: "CN",
          },
          amount_total: 12900,
          currency: "eur",
          customer_email: "p@x.com",
          customer_details: { email: "p@x.com", name: "P Buyer" },
        },
      },
    };
    const constructEvent = vi.fn(() => event);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent },
    } as never);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://aiwithmichal.com");

    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "payload",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_user_id: "user_1",
        stripe_session_id: "cs_ok",
        tier: "pro",
        status: "paid",
        amount_eur: 129,
        workshop_slug: "2026-04-23-sourcing-automation",
      }),
      { onConflict: "stripe_session_id" }
    );

    expect(captureEvent).toHaveBeenCalled();
    expect(notifyAdminPaymentCompleted).toHaveBeenCalled();
    expect(sendMetaEvent).toHaveBeenCalled();
    expect(sendWorkshopConfirmation).toHaveBeenCalled();
  });

  it("returns received true for unhandled event types", async () => {
    const constructEvent = vi.fn(() => ({
      type: "customer.created",
      data: { object: {} },
    }));
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent },
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "x",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(createServiceClient).not.toHaveBeenCalled();
  });
});
