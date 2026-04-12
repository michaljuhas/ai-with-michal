import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, ChevronDown, Layers, TrendingUp } from "lucide-react";
import type { WorkshopSeriesDefinition, WorkshopSeriesId } from "@/lib/workshop-series";
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

function SeriesLinkRows({
  seriesList,
  activeSeries,
}: {
  seriesList: WorkshopSeriesDefinition[];
  activeSeries: WorkshopSeriesId;
}) {
  return (
    <>
      {seriesList.map((s) => {
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
    </>
  );
}

type Props = {
  activeSeries: WorkshopSeriesId;
};

export default function WorkshopsSeriesNav({ activeSeries }: Props) {
  const activeEntry = WORKSHOP_SERIES.find((s) => s.id === activeSeries);

  return (
    <nav aria-label="Workshop series">
      <div className="hidden xl:block rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
        <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-500">Series</p>
        <div className="space-y-0.5">
          <SeriesLinkRows seriesList={WORKSHOP_SERIES} activeSeries={activeSeries} />
        </div>
      </div>

      <div className="xl:hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-left marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-xl">
            <div className="min-w-0 pl-0.5">
              <p className="text-xs font-semibold text-slate-500">Series</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900 leading-snug">
                {activeEntry?.label ?? "Workshop series"}
              </p>
            </div>
            <ChevronDown
              size={20}
              className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-slate-200/80 px-3 pb-3 pt-1 max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain">
            <div className="space-y-0.5">
              <SeriesLinkRows seriesList={WORKSHOP_SERIES} activeSeries={activeSeries} />
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
}
