import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { MEMBER_RESOURCES_BUCKET } from "@/lib/member-resources";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: Partial<{
    title: string;
    tagline: string;
    description: string | null;
    visibility: string;
    content_kind: string;
    storage_path: string | null;
    loom_url: string | null;
    sort_order: number;
    is_archived: boolean;
  }>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing, error: fetchErr } = await supabase
    .from("member_resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const ex = existing as MemberResource;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.title !== undefined) patch.title = body.title.trim();
  if (body.tagline !== undefined) patch.tagline = body.tagline.trim();
  if (body.description !== undefined) patch.description = body.description?.trim() || null;
  if (body.visibility !== undefined) {
    if (body.visibility !== "public" && body.visibility !== "unlisted") {
      return Response.json({ error: "Invalid visibility" }, { status: 400 });
    }
    patch.visibility = body.visibility;
  }
  if (body.sort_order !== undefined) patch.sort_order = body.sort_order;
  if (body.is_archived !== undefined) patch.is_archived = body.is_archived;

  if (body.content_kind !== undefined || body.storage_path !== undefined || body.loom_url !== undefined) {
    const kind = (body.content_kind ?? ex.content_kind) as MemberResource["content_kind"];
    if (kind !== "file" && kind !== "loom") {
      return Response.json({ error: "Invalid content_kind" }, { status: 400 });
    }
    patch.content_kind = kind;
    if (kind === "file") {
      const sp = body.storage_path !== undefined ? body.storage_path?.trim() || null : ex.storage_path;
      if (!sp) {
        return Response.json({ error: "storage_path required for file" }, { status: 400 });
      }
      patch.storage_path = sp;
      patch.loom_url = null;
    } else {
      const lu = body.loom_url !== undefined ? body.loom_url?.trim() || null : ex.loom_url;
      if (!lu || !/^https:\/\/(www\.)?loom\.com\//i.test(lu)) {
        return Response.json({ error: "Valid loom_url required for loom" }, { status: 400 });
      }
      patch.loom_url = lu;
      patch.storage_path = null;
    }
  }

  const { data, error } = await supabase
    .from("member_resources")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin resources PATCH]", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }

  return Response.json({ resource: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: existing, error: fetchErr } = await supabase
    .from("member_resources")
    .select("storage_path, content_kind")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const row = existing as Pick<MemberResource, "storage_path" | "content_kind">;
  if (row.content_kind === "file" && row.storage_path) {
    await supabase.storage.from(MEMBER_RESOURCES_BUCKET).remove([row.storage_path]);
  }

  const { error } = await supabase.from("member_resources").delete().eq("id", id);
  if (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
