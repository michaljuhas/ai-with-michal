import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { upsertAnnualMembershipFromCheckoutSession } from "./annual-membership-checkout";

describe("upsertAnnualMembershipFromCheckoutSession", () => {
  it("returns error when clerk_user_id missing", async () => {
    const session = {
      id: "cs_x",
      metadata: {},
    } as Stripe.Checkout.Session;
    const supabase = { from: vi.fn() } as never;
    await expect(upsertAnnualMembershipFromCheckoutSession(supabase, session)).resolves.toEqual({
      ok: false,
      error: "Missing clerk_user_id",
    });
  });

  it("upserts annual_memberships row", async () => {
    const upsert = vi.fn(async () => ({ error: null }));
    const maybeSingle = vi.fn(async () => ({ data: null, error: null }));
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle })),
        })),
        upsert,
      })),
    } as never;

    const session = {
      id: "cs_new",
      metadata: { clerk_user_id: "user_a" },
      amount_total: 10000,
      total_details: { amount_tax: 0 },
    } as Stripe.Checkout.Session;

    const result = await upsertAnnualMembershipFromCheckoutSession(supabase, session);
    expect(result).toEqual({ ok: true });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_user_id: "user_a",
        stripe_session_id: "cs_new",
        amount_eur: 100,
      }),
      { onConflict: "clerk_user_id" }
    );
  });
});
