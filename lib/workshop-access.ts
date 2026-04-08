import type { SupabaseClient } from "@supabase/supabase-js";

/** Any paid order for this workshop (Basic or Pro). */
export async function userHasPaidWorkshopOrder(
  supabase: SupabaseClient,
  userId: string,
  workshopSlug: string
): Promise<boolean> {
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("workshop_slug", workshopSlug)
    .eq("status", "paid")
    .maybeSingle();
  return !!data;
}

/** Paid Pro tier for this workshop. */
export async function userHasProWorkshopOrder(
  supabase: SupabaseClient,
  userId: string,
  workshopSlug: string
): Promise<boolean> {
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
