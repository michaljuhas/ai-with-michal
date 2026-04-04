"use client";

import { useRef, useState, useEffect } from "react";

type NewPostFormProps = {
  workshopSlug: string;
  onSuccess: () => void;
  isAdmin?: boolean;
};

const URL_RE = /https?:\/\/[^\s"'<>]+/;

function extractUrl(text: string): string | null {
  const match = text.match(URL_RE);
  return match ? match[0] : null;
}

export default function NewPostForm({ workshopSlug, onSuccess, isAdmin = false }: NewPostFormProps) {
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [broadcast, setBroadcast] = useState(false);

  // File-upload image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Link-preview image (URL fetched from og:image — no upload needed)
  const [linkImageUrl, setLinkImageUrl] = useState<string | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [lastCheckedUrl, setLastCheckedUrl] = useState<string | null>(null);
  const [dismissedPreviewUrl, setDismissedPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-fetch OG image when a URL appears in the body text
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const url = extractUrl(body);

      if (!url) {
        // URL removed from body — clear link preview if that was the source
        if (!imageFile && linkImageUrl) {
          setImagePreview(null);
          setLinkImageUrl(null);
        }
        return;
      }

      // Already have a file attachment — don't override
      if (imageFile) return;

      // Same URL as last attempt, or user already dismissed it
      if (url === lastCheckedUrl || url === dismissedPreviewUrl) return;

      setLastCheckedUrl(url);
      setIsFetchingPreview(true);

      try {
        const res = await fetch(
          `/api/workgroup/link-preview?url=${encodeURIComponent(url)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            setLinkImageUrl(data.imageUrl);
            setImagePreview(data.imageUrl);
          }
        }
      } catch {
        // Silently fail — link preview is best-effort
      } finally {
        setIsFetchingPreview(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setError(null);
    // Clear any link preview and use the uploaded file instead
    setLinkImageUrl(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    // If this was an auto-fetched link preview, remember to not re-fetch it
    if (!imageFile && linkImageUrl) {
      setDismissedPreviewUrl(lastCheckedUrl);
    }
    if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setLinkImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetForm() {
    setHeadline("");
    setBody("");
    setBroadcast(false);
    if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setLinkImageUrl(null);
    setIsFetchingPreview(false);
    setLastCheckedUrl(null);
    setDismissedPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!headline.trim() || !body.trim()) {
      setError("Please fill in both the headline and your question.");
      return;
    }

    setSubmitting(true);

    let finalImageUrl: string | undefined;

    if (imageFile) {
      // Upload the selected file
      setUploadProgress(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/workgroup/upload-image", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          setError(data.error ?? "Image upload failed. Please try again.");
          setSubmitting(false);
          setUploadProgress(false);
          return;
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      } catch {
        setError("Image upload failed. Please try again.");
        setSubmitting(false);
        setUploadProgress(false);
        return;
      } finally {
        setUploadProgress(false);
      }
    } else if (linkImageUrl) {
      // Use the OG image URL directly — no upload needed
      finalImageUrl = linkImageUrl;
    }

    try {
      const res = await fetch(`/api/workgroup/${workshopSlug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          body,
          broadcast,
          image_url: finalImageUrl ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      resetForm();
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

  const submitLabel = () => {
    if (uploadProgress) return "Uploading image…";
    if (submitting) return broadcast ? "Posting & sending…" : "Posting…";
    return broadcast ? "Post & send email" : "Post to workgroup";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">New post</p>
        <button
          type="button"
          onClick={handleClose}
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

      {/* Image attachment */}
      <div>
        <p className="block text-xs font-semibold text-slate-600 mb-1.5">Image (optional)</p>

        {isFetchingPreview && !imagePreview && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading link preview…
          </div>
        )}

        {imagePreview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl border border-slate-200 max-w-[320px] w-full h-auto max-h-48 object-cover"
            />
            {linkImageUrl && !imageFile && (
              <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                Link preview
              </span>
            )}
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-slate-700 text-white hover:bg-red-600 transition-colors shadow"
              aria-label="Remove image"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : !isFetchingPreview && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4a3 3 0 014.24 0L16 16m-2-2l1.59-1.59A3 3 0 0119.41 12L20 12M14 8h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Attach image
            <span className="text-xs text-slate-400">JPG, PNG · max 5 MB</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Attach image"
        />
      </div>

      {/* Broadcast checkbox — admin only */}
      {isAdmin && (
        <label className="flex items-start gap-3 cursor-pointer group">
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
              Emails all workshop members with the headline, post content, and image (if attached).
            </span>
          </div>
        </label>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitLabel()}
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
