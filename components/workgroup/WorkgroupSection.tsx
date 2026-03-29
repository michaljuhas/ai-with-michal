"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorkgroupPostWithReplies } from "@/lib/supabase";
import NewPostForm from "./NewPostForm";
import PostCard from "./PostCard";

type WorkgroupSectionProps = {
  workshopSlug: string;
};

export default function WorkgroupSection({ workshopSlug }: WorkgroupSectionProps) {
  const [posts, setPosts] = useState<WorkgroupPostWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/workgroup/${workshopSlug}/posts`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data.posts ?? []);
      setError(null);
    } catch {
      setError("Could not load the discussion. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [workshopSlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Discussion
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Workgroup</h2>
          <p className="mt-1 text-sm text-slate-500">
            Post questions, share ideas, and connect with others in this workshop.
          </p>
        </div>
        {!loading && (
          <button
            type="button"
            onClick={fetchPosts}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
            aria-label="Refresh"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {/* New post form */}
      <NewPostForm workshopSlug={workshopSlug} onSuccess={fetchPosts} />

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-100 animate-pulse"
            />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">No posts yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Be the first to post a question or share something with the group.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              workshopSlug={workshopSlug}
              onUpdate={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
