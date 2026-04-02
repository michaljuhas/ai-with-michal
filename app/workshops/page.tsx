import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { PUBLIC_WORKSHOPS, isOpen, getDaysUntil } from "@/lib/workshops";

export const metadata = {
  title: "Upcoming Workshops | AI with Michal",
  description:
    "Live 90-minute online workshops for recruiters and talent teams. Practical AI workflows you can apply immediately.",
};

export default function WorkshopsPage() {
  const now = new Date();
  const upcoming = PUBLIC_WORKSHOPS.filter((w) => w.date >= now).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const past = PUBLIC_WORKSHOPS.filter((w) => w.date < now).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-14">
          <p className="text-blue-600 text-xs font-semibold tracking-widest uppercase mb-3">
            Live Online Workshops
          </p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Upcoming Workshops
          </h1>
          <p className="mt-4 text-slate-500 text-lg leading-relaxed">
            90-minute live sessions for recruiters and talent teams. Practical
            AI workflows — no fluff, no slides-only decks.
          </p>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((workshop) => {
              const open = isOpen(workshop);
              const daysLeft = getDaysUntil(workshop);

              return (
                <Link
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all px-6 py-5"
                >
                  {/* Date block */}
                  <div className="shrink-0 w-16 text-center">
                    <p className="text-2xl font-bold text-slate-900 leading-none">
                      {workshop.date.getDate()}
                    </p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">
                      {workshop.date.toLocaleString("en-US", { month: "short" })}
                    </p>
                  </div>

                  <div className="w-px h-10 bg-slate-100 hidden sm:block" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                      {workshop.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {workshop.displayDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {workshop.displayTime}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    {open ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        {daysLeft === 0
                          ? "Today"
                          : daysLeft === 1
                          ? "Tomorrow"
                          : `${daysLeft} days left`}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        Registration closed
                      </span>
                    )}
                    <ArrowRight
                      size={16}
                      className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400">No upcoming workshops scheduled yet.</p>
        )}

        {/* Past workshops */}
        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
              Past Workshops
            </h2>
            <div className="space-y-3">
              {past.map((workshop) => (
                <Link
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all px-6 py-4"
                >
                  <div className="shrink-0 w-16 text-center">
                    <p className="text-xl font-bold text-slate-400 leading-none">
                      {workshop.date.getDate()}
                    </p>
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                      {workshop.date.toLocaleString("en-US", { month: "short" })}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-500 leading-snug group-hover:text-slate-700 transition-colors">
                      {workshop.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{workshop.displayDate}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-300 group-hover:text-slate-400 shrink-0 transition-colors hidden sm:block"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
