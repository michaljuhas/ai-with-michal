const EXCERPT_MAX = 200;

/** Plain-text member feed body → single-line-ish excerpt for public previews. */
export function buildMemberFeedExcerpt(body: string | null | undefined): string {
  const collapsed = (body ?? "").replace(/\s+/g, " ").trim();
  if (collapsed.length <= EXCERPT_MAX) {
    return collapsed;
  }
  return `${collapsed.slice(0, EXCERPT_MAX).trimEnd()}…`;
}

export type MemberFeedPreviewPost = {
  id: string;
  headline: string;
  excerpt: string;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
};
