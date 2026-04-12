import Link from "next/link";
import { Calendar, Clock, ArrowRight, Users } from "lucide-react";
import type { Workshop } from "@/lib/workshops";
import {
  getDaysUntil,
  getTimezoneConverterUrl,
  isOpen,
  parseWorkshopIcsUtc,
} from "@/lib/workshops";
import WorkshopTimezonesPopover from "@/components/workshops/WorkshopTimezonesPopover";

const cardAccents = [
  {
    gradient: "from-blue-50 via-white to-white",
    border: "border-blue-100 hover:border-blue-300",
    dateBg: "bg-blue-600",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
    levelBadge: "bg-blue-50 border-blue-200 text-blue-800",
    arrow: "group-hover:text-blue-500",
  },
  {
    gradient: "from-violet-50 via-white to-white",
    border: "border-violet-100 hover:border-violet-300",
    dateBg: "bg-violet-600",
    badgeBg: "bg-violet-50 border-violet-200 text-violet-700",
    levelBadge: "bg-violet-50 border-violet-200 text-violet-800",
    arrow: "group-hover:text-violet-500",
  },
  {
    gradient: "from-cyan-50 via-white to-white",
    border: "border-cyan-100 hover:border-cyan-300",
    dateBg: "bg-cyan-600",
    badgeBg: "bg-cyan-50 border-cyan-200 text-cyan-700",
    levelBadge: "bg-cyan-50 border-cyan-200 text-cyan-800",
    arrow: "group-hover:text-cyan-500",
  },
] as const;

type Props = {
  workshops: Workshop[];
  emptyMessage?: string;
};

export default function UpcomingWorkshopCards({
  workshops,
  emptyMessage = "No upcoming workshops scheduled yet.",
}: Props) {
  if (workshops.length === 0) {
    return <p className="text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {workshops.map((workshop, i) => {
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
          <div
            key={workshop.slug}
            className={`group relative flex flex-col gap-4 rounded-2xl border bg-gradient-to-br ${accent.gradient} ${accent.border} hover:shadow-md transition-all p-5`}
          >
            <Link
              href={`/workshops/${workshop.slug}`}
              className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label={`${workshop.title} — ${workshop.displayDate}`}
            />
            <div className="relative z-10 flex flex-col gap-4 pointer-events-none">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`inline-flex items-center gap-2.5 ${accent.dateBg} text-white rounded-xl px-3 py-2`}
                >
                  <span className="text-2xl font-extrabold leading-none">
                    {workshop.date.getDate()}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                    {workshop.date.toLocaleString("en-US", { month: "short" })}
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold border px-3 py-1.5 rounded-full shrink-0 ${
                    open
                      ? accent.badgeBg
                      : "bg-slate-100 border-slate-200 text-slate-400"
                  }`}
                >
                  {badgeLabel}
                </span>
              </div>

              <span
                className={`inline-flex w-fit text-xs font-semibold border px-2.5 py-1 rounded-lg ${accent.levelBadge}`}
              >
                {workshop.levelLabel}
              </span>

              <h2 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-slate-700 transition-colors">
                {workshop.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">{workshop.cardSummary}</p>

              <p className="flex items-start gap-2 text-xs text-slate-500 leading-snug">
                <Users
                  size={14}
                  className="shrink-0 mt-0.5 text-slate-400"
                  aria-hidden
                />
                <span>
                  <span className="font-semibold text-slate-600">For:</span>{" "}
                  {workshop.audienceLabel}
                </span>
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {workshop.displayDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {workshop.displayTime}
                    <span className="pointer-events-auto inline-flex items-center">
                      <WorkshopTimezonesPopover
                        start={workshop.date}
                        end={parseWorkshopIcsUtc(workshop.endDate)}
                        timezoneConverterUrl={getTimezoneConverterUrl(workshop.date)}
                      />
                    </span>
                  </span>
                </div>
                <ArrowRight
                  size={18}
                  className={`shrink-0 text-slate-300 ${accent.arrow} group-hover:translate-x-0.5 transition-all`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
