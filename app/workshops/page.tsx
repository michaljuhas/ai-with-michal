import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { PUBLIC_WORKSHOPS, isOpen, getDaysUntil } from "@/lib/workshops";

export const metadata = {
  title: "Upcoming Workshops | AI with Michal",
  description:
    "Live 90-minute online workshops for recruiters and talent teams. Practical AI workflows you can apply immediately.",
};

const cardAccents = [
  {
    gradient: "from-blue-50 via-white to-white",
    border: "border-blue-100 hover:border-blue-300",
    dateBg: "bg-blue-600",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
    arrow: "group-hover:text-blue-500",
  },
  {
    gradient: "from-violet-50 via-white to-white",
    border: "border-violet-100 hover:border-violet-300",
    dateBg: "bg-violet-600",
    badgeBg: "bg-violet-50 border-violet-200 text-violet-700",
    arrow: "group-hover:text-violet-500",
  },
  {
    gradient: "from-cyan-50 via-white to-white",
    border: "border-cyan-100 hover:border-cyan-300",
    dateBg: "bg-cyan-600",
    badgeBg: "bg-cyan-50 border-cyan-200 text-cyan-700",
    arrow: "group-hover:text-cyan-500",
  },
];

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
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24 md:py-24">
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
            {upcoming.map((workshop, i) => {
              const open = isOpen(workshop);
              const daysLeft = getDaysUntil(workshop);
              const accent = cardAccents[i % cardAccents.length];
              const badgeLabel = !open
                ? "Registration closed"
                : daysLeft === 0
                ? "Today"
                : daysLeft === 1
                ? "Tomorrow"
                : `${daysLeft} days left`;

              return (
                <Link
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  className={`group relative flex flex-col gap-4 rounded-2xl border bg-gradient-to-br ${accent.gradient} ${accent.border} hover:shadow-md transition-all p-5`}
                >
                  {/* Top row: date pill + badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`inline-flex items-center gap-2.5 ${accent.dateBg} text-white rounded-xl px-3 py-2`}>
                      <span className="text-2xl font-extrabold leading-none">
                        {workshop.date.getDate()}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                        {workshop.date.toLocaleString("en-US", { month: "short" })}
                      </span>
                    </div>

                    <span className={`text-xs font-semibold border px-3 py-1.5 rounded-full shrink-0 ${
                      open
                        ? accent.badgeBg
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-slate-700 transition-colors">
                    {workshop.title}
                  </h2>

                  {/* Meta + arrow */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {workshop.displayDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {workshop.displayTime}
                      </span>
                    </div>
                    <ArrowRight
                      size={18}
                      className={`shrink-0 text-slate-300 ${accent.arrow} group-hover:translate-x-0.5 transition-all`}
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
                <div
                  key={workshop.slug}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4"
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
                    <h3 className="text-sm font-medium text-slate-500 leading-snug">
                      {workshop.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{workshop.displayDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
