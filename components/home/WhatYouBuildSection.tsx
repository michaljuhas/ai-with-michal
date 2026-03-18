"use client";

import { motion } from "framer-motion";
import { CheckCircle, User, Building2, Sparkles } from "lucide-react";

const outcomes = [
  "Find great candidates nobody else has reached out to",
  "Get AI to analyze and summarize their profiles for you",
  "Present hiring managers with polished candidate briefs",
  "Reuse the same system for every new search you run",
];

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
            Walk Away With a Working System
          </h2>
          <p className="mt-4 text-slate-500 text-lg">
            This isn&apos;t theory. By the end of the workshop, you&apos;ll have
            something you can actually use on Monday morning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {outcomes.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-800 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Example output card */}
          <motion.div
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-5 text-slate-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles size={14} className="text-blue-500" />
              What Your Output Looks Like
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Sarah Chen</p>
                  <p className="text-slate-400 text-xs">Senior Backend Engineer · Stripe</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold mb-1">
                    <Building2 size={12} />
                    AI Summary
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Active open-source contributor. Led migration of payment
                    processing system. Speaker at GopherCon 2025.
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold mb-1">Strengths</p>
                  <div className="flex gap-2 flex-wrap">
                    {["Go", "Distributed Systems", "Open Source"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold mb-1">Potential Fit</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-4/5" />
                    </div>
                    <span className="text-emerald-600 text-xs font-semibold">High</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
