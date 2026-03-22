"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const outcomes = [
  "A complete understanding of the different levels recruiters use AI to become more productive and handle more roles at once",
  "A clearer view of how recruiters can move from handling 5 roles to operating more like someone handling 15",
  "A set of templates and workflow examples you can adapt in your own recruiting practice",
  "Access to video recordings you can revisit and share with your colleagues",
  "More confidence that you are on the right path, building relevant skills, and reducing the risk of becoming obsolete or laid off",
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
            What You Will Have After This Workshop
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            Not more vague AI advice. A clearer operating model, stronger templates,
            and practical examples you can use in your recruiting work immediately.
          </p>
        </motion.div>

        <motion.div
          className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-800 font-semibold text-lg mb-5">
            You should leave with:
          </p>
          <div className="space-y-3">
            {outcomes.map((item, i) => (
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
      </div>
    </section>
  );
}
