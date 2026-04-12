"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { MemberResource } from "@/lib/supabase";

type AdminResourcesClientProps = {
  initialResources: MemberResource[];
};

export default function AdminResourcesClient({ initialResources }: AdminResourcesClientProps) {
  const [resources, setResources] = useState(initialResources);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "unlisted">("unlisted");
  const [contentKind, setContentKind] = useState<"file" | "loom">("file");
  const [loomUrl, setLoomUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const reload = useCallback(async () => {
    const res = await fetch("/api/admin/members/resources");
    if (!res.ok) return;
    const data = await res.json();
    setResources(data.resources ?? []);
  }, []);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  async function patch(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/members/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Update failed");
        return;
      }
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this resource and its file (if any)?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/members/resources/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Delete failed");
        return;
      }
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      let storage_path: string | null = null;
      if (contentKind === "file") {
        if (!file) {
          setError("Choose a PDF file.");
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/admin/members/resources/upload", { method: "POST", body: fd });
        if (!up.ok) {
          const j = await up.json().catch(() => ({}));
          setError(j.error ?? "Upload failed");
          return;
        }
        const uj = await up.json();
        storage_path = uj.storage_path;
      }

      const res = await fetch("/api/admin/members/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          tagline: tagline.trim(),
          description: description.trim() || null,
          visibility,
          content_kind: contentKind,
          storage_path: contentKind === "file" ? storage_path : null,
          loom_url: contentKind === "loom" ? loomUrl.trim() : null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Create failed");
        return;
      }
      setSlug("");
      setTitle("");
      setTagline("");
      setDescription("");
      setLoomUrl("");
      setFile(null);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">All resources</h2>
          <p className="text-sm text-slate-500 mt-1">
            Public items appear for every member; unlisted only after a grant (lead gen). Members:{" "}
            <Link href="/members/resources" className="text-blue-600 underline underline-offset-2">
              /members/resources
            </Link>
            , detail{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">/members/resources/[slug]</code>.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Archived</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => (
                <tr key={r.id} className="text-slate-700">
                  <td className="px-4 py-3 font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="font-medium text-slate-900 truncate">{r.title}</div>
                    <div className="text-xs text-slate-500 truncate">{r.tagline}</div>
                  </td>
                  <td className="px-4 py-3">{r.content_kind}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        patch(r.id, {
                          visibility: r.visibility === "public" ? "unlisted" : "public",
                        })
                      }
                      className="text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {r.visibility}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => patch(r.id, { is_archived: !r.is_archived })}
                      className="text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {r.is_archived ? "yes" : "no"}
                    </button>
                  </td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <Link
                      href={`/members/resources/${r.slug}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </Link>
                    <button type="button" disabled={busy} onClick={() => remove(r.id)} className="text-red-600 hover:underline disabled:opacity-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {resources.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-slate-500">No resources yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Add resource</h2>
        <form onSubmit={handleCreate} className="grid gap-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g. sourcing-checklist"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "unlisted")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="public">public</option>
              <option value="unlisted">unlisted</option>
            </select>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-2">Content kind</span>
            <label className="mr-4 inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="resource-content-kind"
                value="file"
                checked={contentKind === "file"}
                onChange={() => setContentKind("file")}
              />
              PDF file
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="resource-content-kind"
                value="loom"
                checked={contentKind === "loom"}
                onChange={() => setContentKind("loom")}
              />
              Loom video
            </label>
          </div>
          {contentKind === "file" ? (
            <div key="resource-input-file">
              <label className="block text-xs font-semibold text-slate-600 mb-1">PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          ) : (
            <div key="resource-input-loom">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loom URL</label>
              <input
                value={loomUrl}
                onChange={(e) => setLoomUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://www.loom.com/share/..."
              />
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Create resource"}
          </button>
        </form>
      </section>
    </div>
  );
}
