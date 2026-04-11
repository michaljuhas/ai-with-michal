import { auth, currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberFeedPost, MemberFeedReply, MemberFeedPostWithReplies } from "@/lib/supabase";
import { sendMemberFeedBroadcast } from "@/lib/email";
import { isAdminUser } from "@/lib/config";
import { fetchClerkUserImageMap } from "@/lib/discussion-posts";
import type { NextRequest } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: posts, error: postsError } = await supabase
    .from("member_feed_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const allPosts = (posts as MemberFeedPost[]) ?? [];
  const postIds = allPosts.map((p) => p.id);

  let replies: MemberFeedReply[] = [];
  let repliesError = null as null | { message?: string };

  if (postIds.length > 0) {
    const r = await supabase
      .from("member_feed_replies")
      .select("*")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });
    replies = (r.data as MemberFeedReply[] | null) ?? [];
    repliesError = r.error;
  }

  if (repliesError) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const allReplies = replies;
  const userIds = [
    ...new Set([
      ...allPosts.map((p) => p.clerk_user_id),
      ...allReplies.map((r) => r.clerk_user_id),
    ]),
  ].filter(Boolean);

  const imageMap = await fetchClerkUserImageMap(userIds);

  const repliesMap = new Map<string, MemberFeedReply[]>();
  for (const reply of allReplies) {
    if (!repliesMap.has(reply.post_id)) {
      repliesMap.set(reply.post_id, []);
    }
    repliesMap.get(reply.post_id)!.push({
      ...reply,
      author_image_url: imageMap.get(reply.clerk_user_id) ?? null,
    });
  }

  const postsWithReplies: MemberFeedPostWithReplies[] = allPosts.map((post) => ({
    ...post,
    author_image_url: imageMap.get(post.clerk_user_id) ?? null,
    replies: repliesMap.get(post.id) ?? [],
  }));

  return Response.json({ posts: postsWithReplies });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
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
    .from("member_feed_posts")
    .insert({
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

  let broadcastResult: { sent?: number; error?: string } = {};
  if (broadcast === true) {
    try {
      const { data: registrations } = await supabase
        .from("registrations")
        .select("email")
        .not("email", "is", null);

      const seen = new Set<string>();
      const recipients: { email: string; name: string }[] = [];
      for (const row of registrations ?? []) {
        const raw = (row as { email: string }).email?.trim();
        if (!raw) continue;
        const key = raw.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        recipients.push({
          email: raw,
          name: raw.split("@")[0],
        });
      }

      const displayName = authorName || authorEmail.split("@")[0] || "Michal";

      const result = await sendMemberFeedBroadcast({
        authorName: displayName,
        headline: headline.trim(),
        body: postBody.trim(),
        authorImageUrl: user?.imageUrl ?? undefined,
        imageUrl: image_url ?? undefined,
        recipients,
      });
      broadcastResult = { sent: result.sent };
    } catch (err) {
      console.error("[member feed broadcast]", err);
      broadcastResult = { error: "Broadcast failed but post was saved." };
    }
  }

  return Response.json({ post: data, broadcast: broadcastResult }, { status: 201 });
}
