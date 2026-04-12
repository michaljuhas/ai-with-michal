import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG,
  userHasActiveAnnualMembership,
} from "@/lib/membership-access";

/** Any paid order for this course (Basic or Pro), or active annual membership for bundled course slug. */
export async function userHasPaidCourseOrder(
  supabase: SupabaseClient,
  userId: string,
  courseSlug: string
): Promise<boolean> {
  if (
    courseSlug === ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG &&
    (await userHasActiveAnnualMembership(supabase, userId))
  ) {
    return true;
  }
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("status", "paid")
    .maybeSingle();
  return !!data;
}
