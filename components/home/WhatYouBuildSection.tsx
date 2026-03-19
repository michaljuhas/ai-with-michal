"use client";

import { motion } from "framer-motion";
import { CheckCircle, User, Sparkles, ThumbsUp, AlertTriangle } from "lucide-react";

export default function WhatYouBuildSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Your Outcome
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            What You Will Have After This Workshop
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            Not slides. Not theory. A <span className="text-slate-800 font-semibold">working system</span> you
            can use on Monday morning.
          </p>
        </motion.div>

        {/* What the system does */}
        <motion.div
          className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-800 font-semibold text-lg mb-5">
            A working system that:
          </p>
          <div className="space-y-3">
            {[
              "Finds candidates from GitHub, conferences, and other sources your competitors aren't using",
              "Generates AI-powered candidate summaries automatically (see example below)",
              "Stores every candidate in a structured talent pool you own and control",
              "Works for any role — engineering, product, design, leadership",
            ].map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Realistic AI output example */}
        <motion.div
          className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} className="text-blue-500" />
            Real Example — AI-Generated Candidate Summary
          </div>

          <div className="p-8 space-y-6">
            {/* Candidate header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-lg">Senior Rust Engineer</p>
                <p className="text-slate-400 text-sm">Found via GitHub · Open Source Contributor</p>
              </div>
            </div>

            {/* Summary */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">AI Summary</p>
              <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                Built low-latency trading systems at a top quant fund. Strong
                systems programming background with deep Rust expertise.
                Contributor to the Tokio async runtime. Presented at RustConf
                2025 on zero-copy serialization.
              </p>
            </div>

            {/* Strengths & Risks side by side */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <ThumbsUp size={14} className="text-emerald-600" />
                  <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Strengths</p>
                </div>
                <ul className="space-y-2">
                  {[
                    "HFT / low-latency experience",
                    "Deep Rust expertise",
                    "Performance optimization",
                    "Open source track record",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2 text-slate-700 text-sm">
                      <span className="text-emerald-500 mt-1">●</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Risks</p>
                </div>
                <ul className="space-y-2">
                  {[
                    "No leadership experience yet",
                    "May prefer IC roles only",
                  ].map((r) => (
                    <li key={r} className="flex items-start gap-2 text-slate-700 text-sm">
                      <span className="text-amber-400 mt-1">●</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Fit score */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Potential Fit</p>
                <span className="text-emerald-600 text-sm font-bold">Strong Match</span>
              </div>
              <div className="mt-2 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-4/5" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          This is generated automatically. You just provide the role — AI does the rest.
        </motion.p>
      </div>
    </section>
  );
}
