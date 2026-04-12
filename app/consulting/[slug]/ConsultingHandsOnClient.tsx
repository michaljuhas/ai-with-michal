"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles, Zap } from "lucide-react";
import type { ConsultingHandsOnRecord } from "@/lib/consulting-hands-on";
import ConsultingSidebar from "@/components/consulting/ConsultingSidebar";
import ConsultingPhotoMosaic from "@/components/consulting/ConsultingPhotoMosaic";
import FlexibleDeliverySection from "@/components/consulting/FlexibleDeliverySection";
import ImplementationProblemsSection from "@/components/consulting/ImplementationProblemsSection";
import PrivateWorkshopCtas from "./PrivateWorkshopCtas";

export default function ConsultingHandsOnClient({ page }: { page: ConsultingHandsOnRecord }) {
  const isImplementation = page.variant === "implementation";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/60 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/50 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-violet-100/40 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-10">
          <header className="mb-5 border-b border-slate-200/80 pb-4 md:mb-6 md:pb-5">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Consulting</h1>
          </header>

          <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(220px,300px)] xl:items-start xl:gap-6">
            <aside className="order-1 xl:sticky xl:top-24 shrink-0">
              <ConsultingSidebar activeSlug={page.slug} />
            </aside>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="order-2 min-w-0 w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-2xl shadow-slate-200/50 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
                    isImplementation
                      ? "bg-orange-50 border-orange-100 text-orange-600"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  {isImplementation ? <Zap size={20} /> : <Mail size={20} />}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {isImplementation ? "Hands-on implementation" : "Advisory retainer"}
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 leading-tight md:text-3xl mb-5">{page.title}</h2>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                {page.body.map((para, idx) => (
                  <p key={idx} className="text-sm md:text-base">
                    {para}
                  </p>
                ))}
              </div>

              {isImplementation && <ImplementationProblemsSection />}

              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Investment</p>
                    <p className="text-lg font-bold text-slate-900">{page.priceLabel}</p>
                  </div>
                </div>

                <PrivateWorkshopCtas contactServiceId={page.serviceId} pageSlug={page.slug} />
              </div>
            </motion.div>

            <aside className="order-3 xl:sticky xl:top-24 shrink-0">
              <ConsultingPhotoMosaic />
            </aside>
          </div>
        </div>
      </div>

      <FlexibleDeliverySection />
    </main>
  );
}
