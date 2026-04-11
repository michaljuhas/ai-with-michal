import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/courses";
import CourseCard from "@/components/courses/CourseCard";

export const metadata: Metadata = {
  title: "Training | AI with Michal",
  description:
    "Structured training programs for recruiters and talent professionals who want to master sourcing and AI from first principles.",
  robots: { index: false, follow: false },
};

export default function TrainingCatalogPage() {
  const courses = getPublishedCourses();

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Training
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Build Skills That Last
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Structured programs that teach you how to think, not just which tools to use.
            Each training goes deep on first principles so AI becomes a multiplier, not a
            crutch.
          </p>
        </div>

        {courses.length === 0 ? (
          <p className="text-slate-400">No training programs available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {courses.map((course, i) => (
              <CourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
