import { createServiceClient } from "@/lib/supabase";

/** Paid orders — optionally filtered by workshop slug (server-only). */
export async function getPaidOrderCount(workshopSlug?: string | null): Promise<number> {
  // Docker/CI builds often omit secrets; SSG still runs this for public workshop pages.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return 0;
  }

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
