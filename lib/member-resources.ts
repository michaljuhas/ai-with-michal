import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberResource } from "@/lib/supabase";

const BUCKET = process.env.MEMBER_RESOURCES_BUCKET ?? "member-resources-private";

export { BUCKET as MEMBER_RESOURCES_BUCKET };

export async function userHasResourceGrant(
  supabase: SupabaseClient,
  userId: string,
  resourceId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("member_resource_grants")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("resource_id", resourceId)
    .maybeSingle();
  return !!data;
}

/** Member can view resource content (not admin). */
export function memberCanViewResource(
  resource: Pick<MemberResource, "visibility" | "is_archived">,
  hasGrant: boolean
): boolean {
  if (resource.is_archived) return false;
  if (resource.visibility === "public") return true;
  return resource.visibility === "unlisted" && hasGrant;
}

export async function createSignedDownloadUrl(
  supabase: SupabaseClient,
  storagePath: string,
  expiresInSeconds = 120
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data?.signedUrl) {
    console.error("[member-resources] createSignedUrl", error);
    return null;
  }
  return data.signedUrl;
}
