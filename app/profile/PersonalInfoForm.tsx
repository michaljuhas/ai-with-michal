"use client";

import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

type Props = {
  linkedinUrl: string | null;
};

export default function PersonalInfoForm({ linkedinUrl }: Props) {
  const { user, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [linkedin, setLinkedin] = useState(linkedinUrl ?? "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Initialise once Clerk user is loaded
  const [initialised, setInitialised] = useState(false);
  if (isLoaded && user && !initialised) {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setInitialised(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus("idle");

    try {
      const jobs: Promise<unknown>[] = [];

      // Upload photo if changed
      if (pendingFile) {
        jobs.push(user.setProfileImage({ file: pendingFile }));
      }

      // Update name in Clerk
      const trimFirst = firstName.trim();
      const trimLast = lastName.trim();
      if (trimFirst !== (user.firstName ?? "") || trimLast !== (user.lastName ?? "")) {
        jobs.push(user.update({ firstName: trimFirst, lastName: trimLast }));
      }

      // Save LinkedIn to Supabase
      jobs.push(
        fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedin_url: linkedin.trim() || null }),
        }).then((r) => {
          if (!r.ok) throw new Error("API error");
        })
      );

      await Promise.all(jobs);
      setPendingFile(null);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = photoPreview ?? user?.imageUrl ?? null;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-5">Personal info</h2>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Photo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-blue-400 transition-all focus:outline-none focus:ring-blue-500"
            aria-label="Change profile photo"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Profile photo"
                fill
                className="object-cover"
                unoptimized={!!photoPreview}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Change photo
            </button>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or GIF. Synced to your account.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn profile URL</label>
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/your-handle"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || !isLoaded}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {status === "success" && (
            <span className="text-sm text-emerald-600 font-medium">Saved!</span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-600">Something went wrong. Please try again.</span>
          )}
        </div>
      </form>
    </section>
  );
}
