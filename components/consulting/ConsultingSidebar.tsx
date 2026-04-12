"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Mail, MonitorPlay, Zap } from "lucide-react";
import {
  getConsultingNavMenuServices,
  getWorkTogetherServiceHref,
  type WorkTogetherService,
} from "@/lib/work-together-services";

function serviceIconBox(service: WorkTogetherService) {
  const k = service.ctaKind;
  const wrap = (node: ReactNode, boxClass: string) => (
    <div
      className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${boxClass}`}
    >
      {node}
    </div>
  );
  switch (k) {
    case "private_workshop":
      return wrap(<MonitorPlay size={16} />, "bg-emerald-50 border-emerald-200 text-emerald-600");
    case "implementation_landing":
      return wrap(<Zap size={16} />, "bg-orange-50 border-orange-200 text-orange-600");
    case "contact":
    default:
      return wrap(<Mail size={16} />, "bg-slate-50 border-slate-200 text-slate-600");
  }
}

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-4 first:pt-0">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export default function ConsultingSidebar({ activeSlug }: { activeSlug: string }) {
  const services = getConsultingNavMenuServices();

  return (
    <nav aria-label="Consulting offerings" className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
      <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-500">Explore</p>
      <div className="space-y-0.5">
        {services.map((s) => (
          <div key={s.id}>
            {s.id === "using-ai-in-your-business" && <SectionRule label="Getting Started" />}
            {s.id === "levelling-ai-recruiting" && <SectionRule label="Deep-dive" />}
            {s.id === "advisory-board-member" && <SectionRule label="Hands-on" />}
            <Link
              href={getWorkTogetherServiceHref(s)}
              className={`flex items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-colors ${
                s.detailSlug === activeSlug
                  ? "bg-blue-50 border border-blue-100"
                  : "border border-transparent hover:bg-slate-50"
              }`}
            >
              {serviceIconBox(s)}
              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-900 leading-snug">
                {s.title}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
