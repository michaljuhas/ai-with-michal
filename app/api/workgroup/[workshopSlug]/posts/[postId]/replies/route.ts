import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasProWorkshopOrder } from "@/lib/workshop-access";
import { getWorkshopBySlug } from "@/lib/workshops";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workshopSlug: string; postId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, workshopSlug } = await params;

  const workshop = getWorkshopBySlug(workshopSlug);
  if (!workshop) {
    return Response.json({ error: "Workshop not found" }, { status: 404 });
  }

  const supabase = createServiceClient();
  if (!isAdminUser(userId)) {
    const allowed = await userHasProWorkshopOrder(supabase, userId, workshopSlug);
    if (!allowed) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { body: replyBody } = body;

  if (!replyBody?.trim()) {
    return Response.json({ error: "Reply body is required" }, { status: 400 });
  }

  const user = await currentUser();
  const authorEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const authorName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : null;
  const isAdmin = isAdminUser(userId);

  // Verify the post exists in this workshop
  const { data: post, error: postError } = await supabase
    .from("workgroup_posts")
    .select("id")
    .eq("id", postId)
    .eq("workshop_slug", workshopSlug)
    .single();

  if (postError || !post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("workgroup_replies")
    .insert({
      post_id: postId,
      clerk_user_id: userId,
      author_email: authorEmail,
      author_name: authorName,
      is_admin: isAdmin,
      body: replyBody.trim(),
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: "Failed to create reply" }, { status: 500 });
  }

  return Response.json({ reply: data }, { status: 201 });
}
