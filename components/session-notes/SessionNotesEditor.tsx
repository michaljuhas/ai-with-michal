"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

type Props = {
  workshopSlug: string;
  initialContent: string;
  initialUpdatedAt: string | null;
  isAdmin: boolean;
};

function renderMarkdown(md: string): string {
  if (!md.trim()) return "";
  return marked.parse(md) as string;
}

function RelativeTime({ iso }: { iso: string | null }) {
  if (!iso) return null;
  const date = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  let label: string;
  if (diff < 60) label = "just now";
  else if (diff < 3600) label = `${Math.floor(diff / 60)}m ago`;
  else if (diff < 86400) label = `${Math.floor(diff / 3600)}h ago`;
  else label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <span className="text-xs text-slate-400" title={date.toLocaleString()}>
      Updated {label}
    </span>
  );
}

export default function SessionNotesEditor({
  workshopSlug,
  initialContent,
  initialUpdatedAt,
  isAdmin,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const html = renderMarkdown(content);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (editing) {
      setTimeout(() => {
        textareaRef.current?.focus();
        autoResize();
      }, 50);
    }
  }, [editing, autoResize]);

  function handleEdit() {
    setDraft(content);
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setSaveError(null);
  }

  function handleSave() {
    setSaveError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/workshops/${workshopSlug}/session-notes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: draft }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setSaveError(data.error ?? "Failed to save");
          return;
        }
        setContent(draft);
        setUpdatedAt(new Date().toISOString());
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch {
        setSaveError("Network error — please try again");
      }
    });
  }

  const isEmpty = !content.trim();

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Live Workshop
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Session notes</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Links, highlights, and key takeaways from the live session.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {updatedAt && !editing && <RelativeTime iso={updatedAt} />}
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          {isAdmin && !editing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Edit mode */}
      {editing ? (
        <div className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <span className="text-xs font-medium text-slate-500">Markdown editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            placeholder={"## Key takeaways\n\n- point 1\n- point 2\n\n## Useful links\n\n- [Title](https://...)"}
            className="w-full resize-none border-0 bg-white p-4 font-mono text-sm text-slate-800 placeholder-slate-300 outline-none min-h-[260px] leading-relaxed"
            spellCheck={false}
          />

          {saveError && (
            <div className="border-t border-red-100 bg-red-50 px-4 py-2">
              <p className="text-xs text-red-600">{saveError}</p>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center gap-4">
            <span className="text-[11px] text-slate-400">Supports Markdown · <kbd className="font-sans">⌘S</kbd> to save · <kbd className="font-sans">Esc</kbd> to cancel</span>
          </div>
        </div>
      ) : (
        /* Render mode */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isEmpty ? (
            <div className="px-8 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">No session notes yet</p>
              <p className="mt-1 text-sm text-slate-400">
                {isAdmin
                  ? "Click Edit to add notes during the live session."
                  : "Notes will appear here during the live session."}
              </p>
            </div>
          ) : (
            <div
              className="session-notes-content px-8 py-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      )}
    </div>
  );
}
