import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { WorkgroupPost, WorkgroupReply, WorkgroupPostWithReplies } from "@/lib/supabase";
import { getWorkshopBySlug } from "@/lib/workshops";
import { sendWorkgroupBroadcast } from "@/lib/email";
import { isAdminUser } from "@/lib/config";
import { userHasProWorkshopOrder } from "@/lib/workshop-access";
import { listClerkUserIdsWithActiveAnnualMembership } from "@/lib/membership-access";
import { fetchClerkUserImageMap } from "@/lib/discussion-posts";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workshopSlug: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workshopSlug } = await params;

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

  const { data: posts, error: postsError } = await supabase
    .from("workgroup_posts")
    .select("*")
    .eq("workshop_slug", workshopSlug)
    .order("created_at", { ascending: false });

  if (postsError) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const allPosts = (posts as WorkgroupPost[]) ?? [];
  const postIds = allPosts.map((p) => p.id);

  let replies: WorkgroupReply[] = [];
  let repliesError = null as null | { message?: string };

  if (postIds.length > 0) {
    const r = await supabase
      .from("workgroup_replies")
      .select("*")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });
    replies = (r.data as WorkgroupReply[] | null) ?? [];
    repliesError = r.error;
  }

  if (repliesError) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  // Collect all unique clerk_user_ids across posts + replies to batch-fetch avatars
  const allReplies = (replies as WorkgroupReply[]) ?? [];
  const userIds = [
    ...new Set([
      ...allPosts.map((p) => p.clerk_user_id),
      ...allReplies.map((r) => r.clerk_user_id),
    ]),
  ].filter(Boolean);

  const imageMap =
    userIds.length > 0 ? await fetchClerkUserImageMap(userIds) : new Map<string, string | null>();

  const repliesMap = new Map<string, WorkgroupReply[]>();
  for (const reply of allReplies) {
    if (!repliesMap.has(reply.post_id)) {
      repliesMap.set(reply.post_id, []);
    }
    repliesMap.get(reply.post_id)!.push({
      ...reply,
      author_image_url: imageMap.get(reply.clerk_user_id) ?? null,
    });
  }

  const postsWithReplies: WorkgroupPostWithReplies[] = allPosts.map((post) => ({
    ...post,
    author_image_url: imageMap.get(post.clerk_user_id) ?? null,
    replies: repliesMap.get(post.id) ?? [],
  }));

  return Response.json({ posts: postsWithReplies });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workshopSlug: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workshopSlug } = await params;
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

  const user = await currentUser();
  const authorEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const authorName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : null;

  let body: { headline?: string; body?: string; broadcast?: boolean; image_url?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { headline, body: postBody, broadcast, image_url } = body;

  if (!headline?.trim() || !postBody?.trim()) {
    return Response.json({ error: "Headline and body are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("workgroup_posts")
    .insert({
      workshop_slug: workshopSlug,
      clerk_user_id: userId,
      author_email: authorEmail,
      author_name: authorName,
      headline: headline.trim(),
      body: postBody.trim(),
      image_url: image_url ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }

  // Optional email broadcast to all workshop attendees (admin-only — UI also hides the toggle)
  let broadcastResult: { sent?: number; error?: string } = {};
  if (broadcast === true && isAdminUser(userId)) {
    try {
      // Paid orders for this workshop + active annual members (same access as directory)
      const { data: orders } = await supabase
        .from("orders")
        .select("clerk_user_id")
        .eq("workshop_slug", workshopSlug)
        .eq("status", "paid");

      const orderIds = [...new Set((orders ?? []).map((o: { clerk_user_id: string }) => o.clerk_user_id))];
      const annualIds = await listClerkUserIdsWithActiveAnnualMembership(supabase);
      const attendeeIds = [...new Set([...orderIds, ...annualIds])];

      // Get email addresses from registrations
      const { data: registrations } = await supabase
        .from("registrations")
        .select("clerk_user_id, email")
        .in("clerk_user_id", attendeeIds.length > 0 ? attendeeIds : ["__none__"]);

      const recipients = (registrations ?? []).map((r: { clerk_user_id: string; email: string }) => ({
        email: r.email,
        name: r.email.split("@")[0],
      }));

      const displayName = authorName || authorEmail.split("@")[0] || "Michal";

      const result = await sendWorkgroupBroadcast({
        authorName: displayName,
        workshopTitle: workshop.title,
        workshopSlug,
        headline: headline.trim(),
        body: postBody.trim(),
        authorImageUrl: user?.imageUrl ?? undefined,
        imageUrl: image_url ?? undefined,
        recipients,
      });
      broadcastResult = { sent: result.sent };
    } catch (err) {
      console.error("[workgroup broadcast]", err);
      broadcastResult = { error: "Broadcast failed but post was saved." };
    }
  }

  return Response.json({ post: data, broadcast: broadcastResult }, { status: 201 });
}
