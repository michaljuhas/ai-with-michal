import { ADMIN_USER_IDS } from "@/lib/config";
import { buildMemberFeedExcerpt, type MemberFeedPreviewPost } from "@/lib/member-feed-preview";
import { createServiceClient } from "@/lib/supabase";

type MemberFeedRow = {
  id: string;
  headline: string;
  body: string;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
};

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("member_feed_posts")
    .select("id, headline, body, image_url, author_name, created_at")
    .in("clerk_user_id", [...ADMIN_USER_IDS])
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const rows = (data as MemberFeedRow[] | null) ?? [];
  const posts: MemberFeedPreviewPost[] = rows.map((row) => ({
    id: row.id,
    headline: row.headline,
    excerpt: buildMemberFeedExcerpt(row.body),
    image_url: row.image_url ?? null,
    author_name: row.author_name ?? null,
    created_at: row.created_at,
  }));

  return Response.json({ posts });
}
