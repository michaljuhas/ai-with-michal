"use client";

import { useState } from "react";
import type { WorkgroupPostWithReplies } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type PostCardProps = {
  post: WorkgroupPostWithReplies;
  workshopSlug: string;
  onUpdate: () => void;
};

export default function PostCard({ post, workshopSlug, onUpdate }: PostCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayAuthor = post.author_name || post.author_email;

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!replyBody.trim()) {
      setError("Please write a reply.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/workgroup/${workshopSlug}/posts/${post.id}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: replyBody }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setReplyBody("");
      setReplyOpen(false);
      onUpdate();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Post header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 flex-shrink-0">
            {displayAuthor.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">{displayAuthor}</p>
            <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-2">{post.headline}</h3>
        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{post.body}</p>
      </div>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-4">
          {post.replies.map((reply) => {
            const replyAuthor = reply.author_name || reply.author_email || "Member";
            return (
              <div key={reply.id} className="flex gap-3">
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    reply.is_admin
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {replyAuthor.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-slate-700">{replyAuthor}</span>
                    {reply.is_admin && (
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                        Admin
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{formatDate(reply.created_at)}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{reply.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply form — visible to all signed-in users */}
      <div className={`border-t border-slate-100 px-5 py-3 ${post.replies.length > 0 ? "bg-slate-50" : ""}`}>
        {!replyOpen ? (
          <button
            type="button"
            onClick={() => setReplyOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Reply
          </button>
        ) : (
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write your reply…"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyOpen(false);
                  setError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
