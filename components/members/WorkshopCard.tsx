import Link from "next/link";
import type { WorkshopDef, Stream } from "@/lib/workshops";
import { STREAMS } from "@/lib/workshops";

const STREAM_COLORS: Record<Stream, string> = {
  "recruiting-ta": "bg-blue-100 text-blue-700",
  gtm: "bg-violet-100 text-violet-700",
  operations: "bg-emerald-100 text-emerald-700",
};

type WorkshopCardProps = {
  workshop: WorkshopDef;
};

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  const now = new Date();
  const isUpcoming = workshop.date >= now;
  const streamColor = STREAM_COLORS[workshop.stream];
  const streamLabel = STREAMS[workshop.stream].label;

  return (
    <Link
      href={`/members/workshops/${workshop.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${streamColor}`}>
              {streamLabel}
            </span>
            {isUpcoming && (
              <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Upcoming
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
            {workshop.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{workshop.displayDate}</p>
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
      </div>
    </Link>
  );
}
