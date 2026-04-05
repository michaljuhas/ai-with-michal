"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const benefits = [
  "Research and compare candidates faster without reading every profile manually",
  "Generate stakeholder updates and candidate summaries in minutes",
  "Build repeatable sourcing, screening, and reporting workflows",
  "Spend more time on judgment and less time on admin",
];

export default function NewApproachSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            There&apos;s a Better Way
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            AI can handle more of the recruiting busywork
          </h2>
        </motion.div>

        <motion.div
          className="bg-blue-50 border border-blue-100 rounded-3xl p-8 md:p-10 lg:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-slate-700 text-lg mb-4 leading-relaxed">
                The point is not to sprinkle AI on top of a broken process. The point
                is to redesign the work so repetitive steps stop consuming your week.
              </p>
              <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                We&apos;ve seen recruiters use AI to triage inbound candidates, compare
                profiles, prepare manager updates, write recruiter-ready summaries,
                and keep talent pools organized without doing every step by hand.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-800 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 text-blue-700 font-semibold text-lg leading-relaxed">
                That&apos;s exactly what we&apos;ll build together, step by step, in this live workshop.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-blue-200 bg-white shadow-sm">
              <Image
                src="/recruiters-and-ta-teams-2024-vs-2026-square.png"
                alt="Comparison of how recruiters in agencies worked in 2024 versus 2026"
                width={1200}
                height={1200}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
