"use client";

import { useState } from "react";

type NewPostFormProps = {
  workshopSlug: string;
  onSuccess: () => void;
  isAdmin?: boolean;
};

export default function NewPostForm({ workshopSlug, onSuccess, isAdmin = false }: NewPostFormProps) {
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [broadcast, setBroadcast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!headline.trim() || !body.trim()) {
      setError("Please fill in both the headline and your question.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/workgroup/${workshopSlug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, body, broadcast }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setHeadline("");
      setBody("");
      setBroadcast(false);
      setOpen(false);
      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-500 transition hover:border-blue-300 hover:text-blue-600 w-full"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Post a question or share something with the group
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">New post</p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div>
        <label htmlFor="post-headline" className="block text-xs font-semibold text-slate-600 mb-1.5">
          Headline
        </label>
        <input
          id="post-headline"
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="What's your question or topic?"
          maxLength={200}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="post-body" className="block text-xs font-semibold text-slate-600 mb-1.5">
          Details
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share context, a specific challenge, or what you've already tried…"
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>

      {/* Broadcast checkbox — admin only */}
      {isAdmin && <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            id="broadcast"
            checked={broadcast}
            onChange={(e) => setBroadcast(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-4 w-4 rounded border border-slate-300 bg-white transition peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:border-blue-400 flex items-center justify-center">
            {broadcast && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
        </div>
        <div>
          <span className="block text-sm font-medium text-slate-700 leading-snug">
            Send email broadcast
          </span>
          <span className="block text-xs text-slate-400 mt-0.5 leading-relaxed">
            Emails all workshop members with the headline and post content.
          </span>
        </div>
      </label>}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? broadcast
              ? "Posting & sending…"
              : "Posting…"
            : broadcast
              ? "Post & send email"
              : "Post to workgroup"
          }
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
