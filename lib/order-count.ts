import { createServiceClient } from "@/lib/supabase";

/** Paid orders — optionally filtered by workshop slug (server-only). */
export async function getPaidOrderCount(workshopSlug?: string | null): Promise<number> {
  const supabase = createServiceClient();
  let q = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid");
  if (workshopSlug) {
    q = q.eq("workshop_slug", workshopSlug);
  }
  const { count, error } = await q;
  if (error) return 0;
  return count ?? 0;
}
