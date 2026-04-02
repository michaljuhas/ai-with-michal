"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { TrainingSection } from "@/lib/training";

type TrainingSidebarProps = {
  sections: TrainingSection[];
  sidebarTitle?: string;
  sidebarDescription?: string;
  backHref?: string;
  workgroupHref?: string;
  recordingUrl?: string;
  hasRecordingAccess?: boolean;
};

export default function TrainingSidebar({
  sections,
  backHref,
  workgroupHref,
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
          Workshop overview
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

      {/* Desktop: one card per section */}
      <nav className="hidden space-y-2 lg:block">
        {sections.map((section) => (
          <div
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
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

        {workgroupHref && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Discussion
            </p>
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
          </div>
        )}

        {recordingUrl && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Recording
            </p>
            {hasRecordingAccess ? (
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
                <span>Watch recording</span>
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-slate-300">Pro</span>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
