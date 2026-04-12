import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Layers, TrendingUp } from "lucide-react";
import type { WorkshopSeriesId } from "@/lib/workshop-series";
import { WORKSHOP_SERIES } from "@/lib/workshop-series";

function seriesIcon(id: WorkshopSeriesId): ReactNode {
  const wrap = (node: ReactNode, boxClass: string) => (
    <div
      className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${boxClass}`}
    >
      {node}
    </div>
  );
  switch (id) {
    case "recruiting":
      return wrap(<Layers size={16} />, "bg-emerald-50 border-emerald-200 text-emerald-600");
    case "gtm":
      return wrap(<TrendingUp size={16} />, "bg-emerald-50 border-emerald-200 text-emerald-600");
    case "agency":
    default:
      return wrap(<Building2 size={16} />, "bg-emerald-50 border-emerald-200 text-emerald-600");
  }
}

type Props = {
  activeSeries: WorkshopSeriesId;
};

export default function WorkshopsSeriesNav({ activeSeries }: Props) {
  return (
    <nav
      aria-label="Workshop series"
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm"
    >
      <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-500">Series</p>
      <div className="space-y-0.5">
        {WORKSHOP_SERIES.map((s) => {
          const href = `/workshops?series=${s.id}`;
          const isActive = s.id === activeSeries;
          return (
            <Link
              key={s.id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-colors ${
                isActive
                  ? "bg-blue-50 border border-blue-100"
                  : "border border-transparent hover:bg-slate-50"
              }`}
            >
              {seriesIcon(s.id)}
              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-900 leading-snug">
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
