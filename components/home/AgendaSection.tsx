"use client";

import { motion } from "framer-motion";

const agenda = [
  {
    step: "01",
    title: "Why Sourcing Is Broken",
    desc: "What changed, why LinkedIn alone isn't enough anymore, and where the opportunity is.",
    duration: "~10 min",
  },
  {
    step: "02",
    title: "The AI Talent Discovery Framework",
    desc: "A simple mental model for thinking about sourcing with AI — no jargon, just common sense.",
    duration: "~15 min",
  },
  {
    step: "03",
    title: "Build Your System (Together)",
    desc: "I'll walk you through it step by step. You'll follow along and have a working setup by the end.",
    duration: "~45 min",
  },
  {
    step: "04",
    title: "Adapt It to Your Roles",
    desc: "How to tweak the system for different positions, industries, and seniority levels.",
    duration: "~10 min",
  },
  {
    step: "05",
    title: "Live Q&A",
    desc: "Ask me anything. We'll troubleshoot, customize, and make sure you're set up for success.",
    duration: "~10 min",
  },
];

export default function AgendaSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            What We&apos;ll Cover
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            90 Minutes, Zero Fluff
          </h2>
          <p className="mt-4 text-slate-500">Every minute is practical. You&apos;ll be building, not just watching.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-slate-200 to-transparent" />

          <div className="space-y-6">
            {agenda.map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center relative z-10">
                  <span className="text-blue-600 font-bold text-sm">{item.step}</span>
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 pt-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-slate-900 font-semibold text-lg">{item.title}</h3>
                    <span className="text-slate-400 text-xs shrink-0 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
