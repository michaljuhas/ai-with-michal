import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import type { NextRequest } from "next/server";

function slugOk(s: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length >= 2 && s.length <= 120;
}

/** PostgREST: table not in schema cache (migration not applied). */
function responseIfMemberResourcesMissing(error: { code?: string } | null): Response | null {
  if (!error || error.code !== "PGRST205") return null;
  const body = {
    error: "Member resources tables are not on this database yet.",
    hint: "In Supabase Dashboard → SQL Editor, run the contents of supabase/migrations/017_member_resources.sql for this project.",
  };
  return Response.json(body, { status: 503 });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("member_resources")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    const missing = responseIfMemberResourcesMissing(error);
    if (missing) {
      console.error("[admin resources GET] missing tables — apply supabase/migrations/017_member_resources.sql", error);
      return missing;
    }
    return Response.json({ error: "Failed to list" }, { status: 500 });
  }

  return Response.json({ resources: (data as MemberResource[]) ?? [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    slug?: string;
    title?: string;
    tagline?: string;
    description?: string | null;
    visibility?: string;
    content_kind?: string;
    storage_path?: string | null;
    loom_url?: string | null;
    sort_order?: number;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim().toLowerCase();
  const title = body.title?.trim();
  const tagline = body.tagline?.trim();
  const visibility = body.visibility;
  const content_kind = body.content_kind;

  if (!slug || !slugOk(slug)) {
    return Response.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!title || !tagline) {
    return Response.json({ error: "title and tagline are required" }, { status: 400 });
  }
  if (visibility !== "public" && visibility !== "unlisted") {
    return Response.json({ error: "Invalid visibility" }, { status: 400 });
  }
  if (content_kind !== "file" && content_kind !== "loom") {
    return Response.json({ error: "Invalid content_kind" }, { status: 400 });
  }

  const storage_path = body.storage_path?.trim() || null;
  const loom_url = body.loom_url?.trim() || null;

  if (content_kind === "file") {
    if (!storage_path) {
      return Response.json({ error: "storage_path required for file" }, { status: 400 });
    }
    if (loom_url) {
      return Response.json({ error: "loom_url must be empty for file" }, { status: 400 });
    }
  } else {
    if (!loom_url || !/^https:\/\/(www\.)?loom\.com\//i.test(loom_url)) {
      return Response.json({ error: "Valid loom.com loom_url required for loom" }, { status: 400 });
    }
    if (storage_path) {
      return Response.json({ error: "storage_path must be empty for loom" }, { status: 400 });
    }
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("member_resources")
    .insert({
      slug,
      title,
      tagline,
      description: body.description?.trim() || null,
      visibility,
      content_kind,
      storage_path: content_kind === "file" ? storage_path : null,
      loom_url: content_kind === "loom" ? loom_url : null,
      sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
      is_archived: false,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json({ error: "Slug already exists" }, { status: 409 });
    }
    const missing = responseIfMemberResourcesMissing(error);
    if (missing) {
      console.error("[admin resources POST] missing tables — apply supabase/migrations/017_member_resources.sql", error);
      return missing;
    }
    console.error("[admin resources POST]", error);
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }

  return Response.json({ resource: data }, { status: 201 });
}
