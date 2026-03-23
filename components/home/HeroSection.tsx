"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import RegisterButton from "@/components/RegisterButton";
import CredibilityBadges from "@/components/CredibilityBadges";
import { getDaysUntilWorkshop, WORKSHOP } from "@/lib/workshop";

const highlights = [
  "Understand how top recruiters use AI at different levels of sophistication",
  "Build practical workflows with Claude Code and automation tools",
  "Handle more roles with less busywork and stronger output",
];

export default function HeroSection() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDaysLeft(getDaysUntilWorkshop());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/60 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 bg-blue-50">
              <Calendar size={12} />
              {WORKSHOP.displayDate} · Live 90-minute workshop
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-700 border border-slate-200 rounded-full px-4 py-1.5 bg-white">
              For recruiters and talent teams
            </span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 border border-amber-200 rounded-full px-3 py-1.5 bg-amber-50">
                🔥 {daysLeft} {daysLeft === 1 ? "day" : "days"} left
              </span>
            )}
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.02] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How to use AI in recruiting and talent acquisition like a Pro,{" "}
            <span className="text-blue-600">with Claude Code and workflow automation tools.</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            This is for recruiters and talent acquisition teams who want real
            leverage, not generic AI inspiration. You will see <strong>how modern recruiters
            use AI</strong> to research faster, screen faster, report faster, and operate
            at a level that used to require a much bigger team.
          </motion.p>

          <motion.div
            className="mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.23 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
              The market is already changing
            </p>
            <p className="mt-2 text-lg font-semibold leading-relaxed text-slate-900">
              Managers are starting to back recruiters who use AI to outperform,
              and replace those who still do everything manually.
            </p>
          </motion.div>

          <motion.div
            className="mt-6 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-slate-700 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RegisterButton />
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock size={14} />
              <span>90 minutes · Live online · Built around real recruiting workflows</span>
            </div>
            <p className="text-sm text-slate-500">
              Includes members-area pre-training, live walkthroughs, and recordings in the advanced tier.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 lg:mt-14"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
            <Image
              src="/seminar-belgrade-1-cropped.jpg"
              alt="Michal Juhas teaching recruiters in a live workshop"
              width={1600}
              height={900}
              className="w-full h-[260px] md:h-[420px] lg:h-[520px] object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />

            <div className="absolute left-5 right-5 bottom-5 flex flex-col gap-4 lg:left-8 lg:right-8 lg:bottom-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl text-white">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-100">
                  Live workshop walkthrough
                </p>
                <p className="mt-2 text-xl md:text-2xl font-semibold leading-tight">
                  See practical recruiting workflows in action, not just another slide deck.
                </p>
              </div>

              <div className="inline-flex self-start rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md text-white">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-blue-100">
                    What you will see
                  </p>
                  <p className="mt-1 text-sm md:text-base">
                    Claude Code, workflow automation, and real recruiter use cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <CredibilityBadges />
        </motion.div>
      </div>
    </section>
  );
}
