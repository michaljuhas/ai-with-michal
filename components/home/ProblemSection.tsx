"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ClipboardPaste, FileSpreadsheet, SearchCheck } from "lucide-react";

const problems = [
  {
    icon: ClipboardPaste,
    text: "Copy-pasting prompts and outputs back and forth from ChatGPT",
  },
  {
    icon: SearchCheck,
    text: "Manually reviewing LinkedIn profiles one by one",
  },
  {
    icon: AlertTriangle,
    text: "Processing candidates one by one instead of through repeatable workflows",
  },
  {
    icon: FileSpreadsheet,
    text: "Manually preparing weekly or monthly reports for managers",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            If you are still doing things like in 2024, you&apos;re doing something wrong.
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Recruiters do not need more tabs, more copying, or more manual admin.
            They need systems. The teams moving ahead are replacing repetitive recruiter
            work with AI-assisted workflows that scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.text}
                className="bg-red-50 border border-red-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Icon className="text-red-500 mb-3" size={22} />
                <p className="text-slate-700 font-medium">{problem.text}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            You can still work this way for a while. But it is slower, harder to
            defend, and increasingly difficult to justify when other recruiters can
            cover more roles with better systems.
          </p>
          <p className="text-slate-900 font-semibold text-xl leading-relaxed">
            The new baseline is not just using AI. It is using AI{" "}
            <span className="text-blue-600">systematically</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
