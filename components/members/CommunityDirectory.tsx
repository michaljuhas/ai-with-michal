"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommunityMember = {
  clerkUserId: string;
  name: string;
  imageUrl: string | null;
  country: string | null;
  aiLevel: "offline" | "chatting" | "systemizing" | "automating" | "ai_native" | null;
  jobFunction: "recruiting_ta_hr" | "gtm" | "business_ops" | "builder_founder" | null;
  linkedinUrl: string | null;
  isHost?: boolean;
};

// ─── Display maps ─────────────────────────────────────────────────────────────

const AI_LEVEL_LABEL: Record<string, string> = {
  offline: "Not yet using AI",
  chatting: "Chatting with AI",
  systemizing: "Systemizing",
  automating: "Automating",
  ai_native: "AI Native",
};

const AI_LEVEL_COLOR: Record<string, string> = {
  offline: "bg-slate-100 text-slate-600",
  chatting: "bg-sky-50 text-sky-700",
  systemizing: "bg-blue-50 text-blue-700",
  automating: "bg-indigo-50 text-indigo-700",
  ai_native: "bg-violet-50 text-violet-700",
};

const AI_LEVEL_ORDER = ["offline", "chatting", "systemizing", "automating", "ai_native"];

const FUNCTION_LABEL: Record<string, string> = {
  recruiting_ta_hr: "Recruiting & HR",
  gtm: "GTM / Sales",
  business_ops: "Business Ops",
  builder_founder: "Builder / Founder",
};

const FUNCTION_COLOR: Record<string, string> = {
  recruiting_ta_hr: "bg-teal-50 text-teal-700",
  gtm: "bg-amber-50 text-amber-700",
  business_ops: "bg-emerald-50 text-emerald-700",
  builder_founder: "bg-rose-50 text-rose-700",
};

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: CommunityMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`group flex flex-col rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
      member.isHost
        ? "bg-gradient-to-b from-blue-50 to-white border-blue-200 hover:border-blue-300"
        : "bg-white border-slate-100 hover:border-slate-200"
    }`}>
      {/* Avatar + LinkedIn */}
      <div className="flex items-start justify-between mb-3">
        <div className="relative">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={56}
              height={56}
              className={`rounded-full object-cover ring-2 shadow-sm ${member.isHost ? "ring-blue-300" : "ring-white"}`}
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold shadow-sm">
              {initials}
            </span>
          )}
          {member.isHost && (
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow ring-2 ring-white leading-none">
              Host
            </span>
          )}
        </div>

        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl.startsWith("http") ? member.linkedinUrl : `https://${member.linkedinUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1 mb-2">
        {member.name}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {member.jobFunction && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${FUNCTION_COLOR[member.jobFunction]}`}>
            {FUNCTION_LABEL[member.jobFunction]}
          </span>
        )}
        {member.aiLevel && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${AI_LEVEL_COLOR[member.aiLevel]}`}>
            {AI_LEVEL_LABEL[member.aiLevel]}
          </span>
        )}
      </div>

      {/* Country */}
      {member.country && (
        <div className="mt-auto flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{member.country}</span>
        </div>
      )}
    </div>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {label}
      {active && (
        <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CommunityDirectory({
  members,
  showFilters = true,
}: {
  members: CommunityMember[];
  showFilters?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedAiLevel, setSelectedAiLevel] = useState<string | null>(null);

  // Derive unique filter options from actual data
  const countries = useMemo(
    () =>
      [...new Set(members.map((m) => m.country).filter(Boolean) as string[])].sort(),
    [members]
  );

  const functions = useMemo(
    () =>
      (Object.keys(FUNCTION_LABEL) as string[]).filter((f) =>
        members.some((m) => m.jobFunction === f)
      ),
    [members]
  );

  const aiLevels = useMemo(
    () =>
      AI_LEVEL_ORDER.filter((l) => members.some((m) => m.aiLevel === l)),
    [members]
  );

  // Filter
  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !(m.country ?? "").toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedCountry && m.country !== selectedCountry) return false;
      if (selectedFunction && m.jobFunction !== selectedFunction) return false;
      if (selectedAiLevel && m.aiLevel !== selectedAiLevel) return false;
      return true;
    });
  }, [members, search, selectedCountry, selectedFunction, selectedAiLevel]);

  const hasActiveFilters = !!(search || selectedCountry || selectedFunction || selectedAiLevel);

  function clearAll() {
    setSearch("");
    setSelectedCountry(null);
    setSelectedFunction(null);
    setSelectedAiLevel(null);
  }

  // When filters are hidden render the unfiltered list directly
  const displayMembers = showFilters ? filtered : members;

  return (
    <div>
      {/* Filter bar */}
      {showFilters && <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="relative max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 transition"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Role filters */}
          {functions.map((f) => (
            <FilterPill
              key={f}
              label={FUNCTION_LABEL[f]}
              active={selectedFunction === f}
              onClick={() => setSelectedFunction(selectedFunction === f ? null : f)}
            />
          ))}

          {/* AI level filters */}
          {aiLevels.map((l) => (
            <FilterPill
              key={l}
              label={AI_LEVEL_LABEL[l]}
              active={selectedAiLevel === l}
              onClick={() => setSelectedAiLevel(selectedAiLevel === l ? null : l)}
            />
          ))}

          {/* Country filters (only countries with 2+ members to avoid clutter, or top 8) */}
          {countries.slice(0, 8).map((c) => (
            <FilterPill
              key={c}
              label={c}
              active={selectedCountry === c}
              onClick={() => setSelectedCountry(selectedCountry === c ? null : c)}
            />
          ))}

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="ml-1 text-xs text-slate-400 underline underline-offset-2 hover:text-slate-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>}

      {/* Result count */}
      <p className="mb-4 text-xs text-slate-400 font-medium tracking-wide uppercase">
        {showFilters
          ? filtered.length === members.length
            ? `${members.length} members`
            : `${filtered.length} of ${members.length} members`
          : `${members.length} member${members.length !== 1 ? "s" : ""}`}
      </p>

      {/* Grid */}
      {displayMembers.length > 0 ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayMembers.map((member) => (
            <MemberCard key={member.clerkUserId} member={member} />
          ))}
        </div>
      ) : showFilters ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">No members match your filters</p>
          <button onClick={clearAll} className="mt-3 text-xs text-blue-600 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">No attendees yet</p>
          <p className="mt-1 text-xs text-slate-400">Members who purchase access will appear here.</p>
        </div>
      )}
    </div>
  );
}
