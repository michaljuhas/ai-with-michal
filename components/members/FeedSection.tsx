"use client";

import { useCallback, useEffect, useState } from "react";
import type { MemberFeedPostWithReplies } from "@/lib/supabase";
import NewPostForm from "@/components/workgroup/NewPostForm";
import PostCard from "@/components/workgroup/PostCard";

const FEED_POSTS_ENDPOINT = "/api/members/feed/posts";
const FEED_REPLY_API_BASE = "/api/members/feed/posts";

type FeedSectionProps = {
  isAdmin: boolean;
};

export default function FeedSection({ isAdmin }: FeedSectionProps) {
  const [posts, setPosts] = useState<MemberFeedPostWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(FEED_POSTS_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data.posts ?? []);
      setError(null);
    } catch {
      setError("Could not load the feed. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      <div className="flex min-h-[1.75rem] justify-end">
        <button
          type="button"
          onClick={fetchPosts}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Refresh"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {isAdmin && (
        <NewPostForm
          uploadTarget={{ kind: "feed" }}
          postsEndpoint={FEED_POSTS_ENDPOINT}
          onSuccess={fetchPosts}
          isAdmin={isAdmin}
          broadcastHelpText="Emails all registered members (unique inboxes) with the headline, post content, and image (if attached)."
          openButtonLabel="New feed post"
          headlinePlaceholder="Headline for your update"
          bodyPlaceholder="What do you want members to know?"
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h13.5m-12-6.75h10.5a1.5 1.5 0 011.5 1.5v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25a1.5 1.5 0 011.5-1.5z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">No posts yet</p>
          <p className="mt-1 text-sm text-slate-400">
            {isAdmin
              ? "Create the first post using the button above."
              : "Check back soon for updates from Michal."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={fetchPosts}
              replyApiBase={FEED_REPLY_API_BASE}
            />
          ))}
        </div>
      )}
    </div>
  );
}
