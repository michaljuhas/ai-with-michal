import type { Metadata } from "next";
import Link from "next/link";
import UpcomingWorkshopCards from "@/components/workshops/UpcomingWorkshopCards";
import { PUBLIC_WORKSHOPS } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "Page not found | AI with Michal",
  description: "This page no longer exists. Browse upcoming workshops or return home.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const now = new Date();
  const upcoming = PUBLIC_WORKSHOPS.filter((w) => w.date >= now).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-28">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 md:px-10 md:py-14 shadow-sm">
          <p className="text-center text-blue-600 text-xs font-semibold tracking-widest uppercase mb-4">
            404
          </p>
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            This page no longer exists
          </h1>
          <p className="mt-5 text-center text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            You may want to check our upcoming workshops
          </p>

          <div className="mt-12 md:mt-14">
            <UpcomingWorkshopCards workshops={upcoming} />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workshops"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              All workshops
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
