"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { TrainingSection } from "@/lib/training";

type TrainingSidebarProps = {
  sections: TrainingSection[];
  sidebarTitle?: string;
  sidebarDescription?: string;
  backHref?: string;
  overviewHref?: string;
  membersHref?: string;
  workgroupHref?: string;
  hasWorkgroupAccess?: boolean;
  recordingUrl?: string;
  hasRecordingAccess?: boolean;
};

export default function TrainingSidebar({
  sections,
  backHref,
  overviewHref,
  membersHref,
  workgroupHref,
  hasWorkgroupAccess,
  recordingUrl,
  hasRecordingAccess,
}: TrainingSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const allLessons = sections.flatMap((section) => section.lessons);

  return (
    <div className="space-y-2">
      {backHref && (
        <Link
          href={backHref}
          className="flex items-center gap-1.5 px-1 pb-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to workshops
        </Link>
      )}

      {/* Mobile: single select */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <label
          htmlFor="training-lesson-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Jump to
        </label>
        <select
          id="training-lesson-select"
          value={pathname}
          onChange={(event) => router.push(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
        >
          {allLessons.map((lesson) => (
            <option key={lesson.path} value={lesson.path}>
              {lesson.title}
            </option>
          ))}
          {membersHref && (
            <option value={membersHref}>👥 Members</option>
          )}
          {workgroupHref && (
            <option value={workgroupHref}>💬 Workgroup discussion</option>
          )}
        </select>
        {workgroupHref && (
          <Link
            href={workgroupHref}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Go to workgroup
          </Link>
        )}
      </div>

      {/* Desktop: single unified card */}
      <nav className="hidden lg:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {/* Overview */}
        {overviewHref && (
          <div className="p-3">
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Overview
            </p>
            <Link
              href={overviewHref}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                pathname === overviewHref
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Workshop overview
            </Link>
            {membersHref && (
              <Link
                href={membersHref}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  pathname === membersHref
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Members
              </Link>
            )}
          </div>
        )}

        {/* Training sections */}
        {sections.map((section) => (
          <div key={section.key} className="border-t border-slate-100 p-3">
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.lessons.map((lesson) => {
                const isActive = pathname === lesson.path;
                return (
                  <Link
                    key={lesson.path}
                    href={lesson.path}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {lesson.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Discussion */}
        {workgroupHref && (
          <div className="border-t border-slate-100 p-3">
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 flex items-center gap-2">
              Discussion
              <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Pro</span>
            </p>
            {hasWorkgroupAccess ? (
              <Link
                href={workgroupHref}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  pathname === workgroupHref
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Workgroup
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed select-none">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Workgroup</span>
              </div>
            )}
          </div>
        )}

        {/* Recording — always visible */}
        <div className="border-t border-slate-100 p-3">
          <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 flex items-center gap-2">
            Recording
            <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Pro</span>
          </p>
          {recordingUrl && hasRecordingAccess ? (
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch recording
            </a>
          ) : (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed select-none">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{recordingUrl ? "Watch recording" : "Coming soon"}</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
