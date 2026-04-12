"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Users, MonitorPlay, Zap, Mail, ArrowRight } from "lucide-react";
import {
  getWorkTogetherCtaLabel,
  getWorkTogetherServiceHref,
  type WorkTogetherService,
} from "@/lib/work-together-services";

function getServiceIconBg(kind: WorkTogetherService["ctaKind"]) {
  switch (kind) {
    case "mentoring_individual":
      return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-600";
    case "mentoring_group":
      return "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 text-violet-600";
    case "private_workshop":
      return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600";
    case "implementation_landing":
      return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-600";
    case "contact":
    default:
      return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-slate-600";
  }
}

function getServiceIcon(kind: WorkTogetherService["ctaKind"]) {
  switch (kind) {
    case "mentoring_individual":
      return <User size={20} />;
    case "mentoring_group":
      return <Users size={20} />;
    case "private_workshop":
      return <MonitorPlay size={20} />;
    case "implementation_landing":
      return <Zap size={20} />;
    case "contact":
    default:
      return <Mail size={20} />;
  }
}

function AccordionItem({ service, isOpen, onToggle }: { service: WorkTogetherService; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(248, 250, 252, 0.8)",
        borderColor: isOpen ? "rgba(226, 232, 240, 1)" : "rgba(241, 245, 249, 1)",
      }}
      className={`border rounded-2xl overflow-hidden transition-shadow duration-300 ${
        isOpen ? "shadow-md shadow-slate-200/50" : "hover:shadow-sm hover:border-slate-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="group w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${getServiceIconBg(service.ctaKind)}`}>
            {getServiceIcon(service.ctaKind)}
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {service.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-0.5 sm:hidden">
              {service.priceLabel}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-6 sm:pl-4">
          <p className="text-sm md:text-base font-bold text-slate-900 whitespace-nowrap hidden sm:block">
            {service.priceLabel}
          </p>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-slate-100 text-slate-600" : "bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300"
            }`}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 sm:pl-[72px]">
              <div className="h-px w-full bg-slate-100 mb-5" />
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line max-w-3xl">
                  {service.description}
                </p>
                <Link
                  href={getWorkTogetherServiceHref(service)}
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-md hover:shadow-blue-600/20 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getWorkTogetherCtaLabel(service)}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkTogetherServiceAccordions({
  services,
}: {
  services: WorkTogetherService[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const firstServiceId = services[0]?.id;
  const gettingStartedDividerPt =
    firstServiceId === "using-ai-in-your-business" ? "pt-0" : "pt-8";

  return (
    <div className="space-y-3">
      {services.map((s) => (
        <div key={s.id} className="space-y-3">
          {s.id === "bi-weekly-individual-mentoring" && (
            <div className="flex items-center gap-4 pb-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Mentoring
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}
          {s.id === "using-ai-in-your-business" && (
            <div className={`flex items-center gap-4 ${gettingStartedDividerPt} pb-3`}>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Getting Started
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}
          {s.id === "levelling-ai-recruiting" && (
            <div className="flex items-center gap-4 pt-8 pb-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Deep-dive
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}
          {s.id === "advisory-board-member" && (
            <div className="flex items-center gap-4 pt-8 pb-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Hands-on
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}
          <AccordionItem
            service={s}
            isOpen={openId === s.id}
            onToggle={() => setOpenId(openId === s.id ? null : s.id)}
          />
        </div>
      ))}
    </div>
  );
}
