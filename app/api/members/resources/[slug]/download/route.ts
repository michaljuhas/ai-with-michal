import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasResourceGrant, memberCanViewResource, createSignedDownloadUrl } from "@/lib/member-resources";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const cleanSlug = slug?.trim();
  if (!cleanSlug) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = createServiceClient();

  const { data: resource, error } = await supabase
    .from("member_resources")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (error || !resource) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const r = resource as MemberResource;

  if (r.content_kind !== "file") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (!r.storage_path) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const admin = isAdminUser(userId);
  const hasGrant = await userHasResourceGrant(supabase, userId, r.id);
  const canView =
    admin || (!r.is_archived && memberCanViewResource(r, hasGrant));

  if (!canView) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const signed = await createSignedDownloadUrl(supabase, r.storage_path);
  if (!signed) {
    return Response.json({ error: "Failed to create download link" }, { status: 500 });
  }

  return Response.redirect(signed, 302);
}
