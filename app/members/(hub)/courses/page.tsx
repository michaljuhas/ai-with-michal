import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { getCourseBySlug } from "@/lib/courses";
import { userHasPaidCourseOrder } from "@/lib/course-access";
import { isAdminUser } from "@/lib/config";
const FIRST_PRINCIPLES_SLUG = "first-principles-sourcing" as const;

export default async function MembersCoursesPage() {
  const { userId } = await auth();
  const course = getCourseBySlug(FIRST_PRINCIPLES_SLUG);
  const supabase = createServiceClient();

  const hasAccess =
    !!userId &&
    (isAdminUser(userId) ||
      (await userHasPaidCourseOrder(supabase, userId, FIRST_PRINCIPLES_SLUG)));

  const coursePublicHref = `/training/${FIRST_PRINCIPLES_SLUG}`;
  const fromPrice =
    course != null ? `from €${course.prices.basic}` : "from €490";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Courses
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-500">
          Self-paced programs you can buy and complete on your own schedule.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 max-w-3xl">
        <li>
          <div className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512m0-14.256A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25a8.984 8.984 0 01-3 .512m-12-2.25V6.042m12 11.208V6.042"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              First Principles in Talent Sourcing
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              A structured deep dive into how modern sourcing actually works — from problem framing to
              outreach and pipeline thinking.
            </p>

            {hasAccess ? (
              <div className="mt-5">
                <Link
                  href={coursePublicHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                >
                  View course
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">
                <p className="text-sm text-slate-700">
                  You haven&apos;t purchased this course yet. When you&apos;re ready, pricing starts at{" "}
                  <span className="font-semibold text-slate-900">{fromPrice}</span>
                  <span className="text-slate-500"> (excl. VAT where applicable).</span>
                </p>
                <Link
                  href={coursePublicHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 underline-offset-2 hover:text-blue-800 hover:underline"
                >
                  Learn more
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </li>
      </ul>
    </>
  );
}
