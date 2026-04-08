import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasPaidWorkshopOrder } from "@/lib/workshop-access";
import { getWorkshopBySlug } from "@/lib/workshops";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!getWorkshopBySlug(slug)) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
  }

  const supabase = createServiceClient();
  if (!isAdminUser(userId)) {
    const paid = await userHasPaidWorkshopOrder(supabase, userId, slug);
    if (!paid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("workshop_session_notes")
    .select("content, updated_at")
    .eq("workshop_slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ content: data?.content ?? "", updated_at: data?.updated_at ?? null });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();

  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;

  let content: string | undefined;
  try {
    const body = await req.json();
    content = body.content;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof content !== "string") {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("workshop_session_notes")
    .upsert(
      { workshop_slug: slug, content, updated_at: new Date().toISOString() },
      { onConflict: "workshop_slug" }
    );

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
