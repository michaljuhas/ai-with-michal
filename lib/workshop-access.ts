import type { SupabaseClient } from "@supabase/supabase-js";
import { userHasActiveAnnualMembership } from "@/lib/membership-access";

/** Any paid order for this workshop (Basic or Pro), or active annual membership (all workshops). */
export async function userHasPaidWorkshopOrder(
  supabase: SupabaseClient,
  userId: string,
  workshopSlug: string
): Promise<boolean> {
  if (await userHasActiveAnnualMembership(supabase, userId)) {
    return true;
  }
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("workshop_slug", workshopSlug)
    .eq("status", "paid")
    .maybeSingle();
  return !!data;
}

/** Paid Pro tier for this workshop, or active annual membership (Pro-equivalent for every workshop). */
export async function userHasProWorkshopOrder(
  supabase: SupabaseClient,
  userId: string,
  workshopSlug: string
): Promise<boolean> {
  if (await userHasActiveAnnualMembership(supabase, userId)) {
    return true;
  }
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("workshop_slug", workshopSlug)
    .eq("tier", "pro")
    .eq("status", "paid")
    .maybeSingle();
  return !!data;
}
