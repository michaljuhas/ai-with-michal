import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { computeMembershipWindow } from "@/lib/membership-period";
import { getAnnualMembershipRow } from "@/lib/membership-access";
import { orderAmountsFromCheckoutSession } from "@/lib/stripe-order-amounts";

/**
 * Persist annual membership after Stripe Checkout `mode: payment` completes.
 * Idempotent on `stripe_session_id` when combined with upsert on `clerk_user_id`
 * (same session replay updates same row).
 */
export async function upsertAnnualMembershipFromCheckoutSession(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clerkUserId = session.metadata?.clerk_user_id;
  if (!clerkUserId?.trim()) {
    return { ok: false, error: "Missing clerk_user_id" };
  }

  const paymentTime = new Date();
  const existing = await getAnnualMembershipRow(supabase, clerkUserId);
  const window = computeMembershipWindow({
    paymentTime,
    previous: existing
      ? {
          period_starts_at: existing.period_starts_at,
          period_ends_at: existing.period_ends_at,
        }
      : null,
  });

  const { amount_eur } = orderAmountsFromCheckoutSession(session);
  const nowIso = new Date().toISOString();

  const { error } = await supabase.from("annual_memberships").upsert(
    {
      clerk_user_id: clerkUserId,
      stripe_session_id: session.id,
      period_starts_at: window.period_starts_at.toISOString(),
      period_ends_at: window.period_ends_at.toISOString(),
      amount_eur: amount_eur,
      updated_at: nowIso,
    },
    { onConflict: "clerk_user_id" }
  );

  if (error) {
    console.error("annual_memberships upsert error:", error);
    return { ok: false, error: "Database error" };
  }

  return { ok: true };
}
