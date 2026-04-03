import Link from "next/link";
import type { WorkshopDef, Stream } from "@/lib/workshops";

const STREAM_ACCENT: Record<Stream, { dot: string }> = {
  "recruiting-ta": { dot: "bg-blue-500" },
  gtm:            { dot: "bg-violet-500" },
  operations:     { dot: "bg-emerald-500" },
};

type WorkshopCardProps = {
  workshop: WorkshopDef;
  upcoming?: boolean;
};

export default function WorkshopCard({ workshop, upcoming = false }: WorkshopCardProps) {
  const { dot } = STREAM_ACCENT[workshop.stream];
  const day = workshop.date.getDate();
  const month = workshop.date.toLocaleString("en-US", { month: "short" });

  return (
    <Link
      href={`/members/workshops/${workshop.slug}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      {/* Calendar date block */}
      <div className="flex-shrink-0 flex flex-col items-center justify-start pt-0.5 w-10">
        <span className="text-xl font-bold text-slate-800 leading-none">{day}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">{month}</span>
        <span className={`mt-2 w-1.5 h-1.5 rounded-full ${dot}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {upcoming && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
          {workshop.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {workshop.description}
        </p>
      </div>

      <svg
        className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
