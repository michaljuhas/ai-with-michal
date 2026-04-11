import type { SupabaseClient } from "@supabase/supabase-js";

/** Any paid order for this course (Basic or Pro). */
export async function userHasPaidCourseOrder(
  supabase: SupabaseClient,
  userId: string,
  courseSlug: string
): Promise<boolean> {
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("status", "paid")
    .maybeSingle();
  return !!data;
}
