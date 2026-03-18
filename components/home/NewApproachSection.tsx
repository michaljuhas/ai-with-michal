"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Find candidates that nobody else has contacted yet",
  "Let AI do the research and analysis for you",
  "Get ready-to-use candidate profiles in minutes",
  "Build a personal talent pool you can reuse anytime",
];

export default function NewApproachSection() {
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
            There&apos;s a Better Way
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            What If AI Could Do Your Sourcing?
          </h2>
        </motion.div>

        <motion.div
          className="bg-blue-50 border border-blue-100 rounded-2xl p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-slate-600 text-lg mb-4">
            Imagine having a system that works for you around the clock —
            finding great people from places like ContactOut, Apollo, Coresignal, BrightData, 
            GitHub, conferences, and online communities such as Discord that most recruiters 
            never think to look.
          </p>
          <p className="text-slate-600 text-lg mb-8">
            No more copy-pasting. No more guessing. Just a steady flow of
            qualified, untapped candidates.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
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
          <p className="mt-8 text-blue-700 font-semibold text-lg">
            That&apos;s exactly what we&apos;ll build together — step by step — in this workshop.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
