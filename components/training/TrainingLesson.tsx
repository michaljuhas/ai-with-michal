import Link from "next/link";
import type { ReactNode } from "react";
import type { TrainingLesson as TrainingLessonType } from "@/lib/training";

type TrainingLessonProps = {
  lesson: TrainingLessonType;
  previousLesson: Pick<TrainingLessonType, "title" | "path"> | null;
  nextLesson: Pick<TrainingLessonType, "title" | "path"> | null;
  children: ReactNode;
  /** When true, skip the lesson header card and render children directly (e.g. for custom full-bleed components) */
  hideTitle?: boolean;
};

export default function TrainingLesson({
  lesson,
  previousLesson,
  nextLesson,
  children,
  hideTitle = false,
}: TrainingLessonProps) {
  return (
    <div className="space-y-6">
      {hideTitle ? (
        children
      ) : (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            {lesson.section === "pre-training" ? "Pre-training" : "Live Workshop"}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            {lesson.description}
          </p>
        </div>

        <article
          className={[
            "text-[15px] leading-7 text-slate-700",
            "[&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4",
            "[&_blockquote]:my-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-slate-700",
            "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]",
            "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-slate-900 sm:[&_h1]:text-4xl",
            "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900",
            "[&_hr]:my-8 [&_hr]:border-slate-200",
            "[&_li]:text-slate-700",
            "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
            "[&_p]:my-5 [&_p]:text-slate-700",
            "[&_strong]:font-semibold [&_strong]:text-slate-900",
            "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
          ].join(" ")}
        >
          {children}
        </article>
      </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {previousLesson ? (
          <Link
            href={previousLesson.path}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Previous
            </p>
            <p className="mt-2 font-semibold text-slate-900">{previousLesson.title}</p>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextLesson ? (
          <Link
            href={nextLesson.path}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/60"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Next
            </p>
            <p className="mt-2 font-semibold text-slate-900">{nextLesson.title}</p>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
}
