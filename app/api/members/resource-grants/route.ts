import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return Response.json({ error: "slug is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: resource, error: resErr } = await supabase
    .from("member_resources")
    .select("id, visibility, is_archived")
    .eq("slug", slug)
    .maybeSingle();

  if (resErr || !resource) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const row = resource as Pick<MemberResource, "id" | "visibility" | "is_archived">;

  if (row.is_archived) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (row.visibility !== "unlisted") {
    return Response.json({ error: "Grant only applies to unlisted resources" }, { status: 400 });
  }

  const { error: insErr } = await supabase.from("member_resource_grants").insert({
    resource_id: row.id,
    clerk_user_id: userId,
  });

  if (insErr) {
    if (insErr.code === "23505") {
      return Response.json({ ok: true });
    }
    console.error("[resource-grants]", insErr);
    return Response.json({ error: "Failed to save grant" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
