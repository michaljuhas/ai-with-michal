"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { TrainingSection } from "@/lib/training";

type TrainingSidebarProps = {
  sections: TrainingSection[];
};

export default function TrainingSidebar({ sections }: TrainingSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const allLessons = sections.flatMap((section) => section.lessons);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          Training Access
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Work through the pre-training before the live session so everyone starts
          with the same foundation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <label
          htmlFor="training-lesson-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Jump to lesson
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
        </select>
      </div>

      <nav className="hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block">
        {sections.map((section) => (
          <div key={section.key} className="mb-6 last:mb-0">
            <p className="px-3 pb-3 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.lessons.map((lesson) => {
                const isActive = pathname === lesson.path;

                return (
                  <Link
                    key={lesson.path}
                    href={lesson.path}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
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
      </nav>
    </div>
  );
}
