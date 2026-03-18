"use client";

import { motion } from "framer-motion";
import { Globe, Search, Brain, FileText, LayoutDashboard, ChevronDown } from "lucide-react";

const steps = [
  {
    icon: Globe,
    label: "Discover Hidden Talent",
    sublabel: "ContactOut, Apollo, Coresignal, BrightData, GitHub, and online communities — places others aren't looking",
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Search,
    label: "AI Finds the Right People",
    sublabel: "Automatically surfaces candidates who match what you need",
    bg: "bg-violet-50 border-violet-200",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: Brain,
    label: "Instant Profile Analysis",
    sublabel: "AI reads their work and tells you why they're a fit",
    bg: "bg-pink-50 border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: FileText,
    label: "Ready-to-Use Summaries",
    sublabel: "Share with hiring managers — no extra formatting needed",
    bg: "bg-cyan-50 border-cyan-200",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: LayoutDashboard,
    label: "Your Own Talent Pool",
    sublabel: "A growing database of candidates you can search anytime",
    bg: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function SystemSection() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            A Simple System You Can Set Up in 90 Minutes
          </h2>
          <p className="mt-4 text-slate-500 text-lg">
            No coding, no complicated tools. Just follow along and you&apos;ll walk
            away with this working for you.
          </p>
        </motion.div>

        <div className="flex flex-col items-center max-w-md mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className={`w-full rounded-xl border ${step.bg} p-5 flex items-center gap-4`}>
                  <div className={`shrink-0 w-10 h-10 rounded-lg ${step.iconBg} flex items-center justify-center ${step.iconColor}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{step.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.sublabel}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="text-slate-300 my-1.5">
                    <ChevronDown size={20} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
