"use client";

import { motion } from "framer-motion";

const agenda = [
  {
    step: "01",
    title: "Different Levels of AI Use in Recruiting",
    desc: "See the progression from basic prompting to high-leverage recruiting systems so you know where you are and what better looks like.",
    duration: "~20 min",
  },
  {
    step: "02",
    title: "Three Advanced Workflow Examples",
    desc: "Walk through practical examples for sourcing, screening, and reporting so you can see how serious recruiters actually use AI day to day.",
    duration: "~35 min",
  },
  {
    step: "03",
    title: "Deep Dive into Claude Code",
    desc: "Understand why Claude Code matters, how it fits into recruiter workflows, and how to use it without getting lost in technical complexity.",
    duration: "~25 min",
  },
  {
    step: "04",
    title: "Live Q&A and Next Steps",
    desc: "Ask questions, pressure-test your own recruiting setup, and leave with a clearer plan for what to implement first.",
    duration: "~10 min",
  },
];

export default function AgendaSection() {
  return (
    <section id="agenda" className="scroll-mt-32 py-24 px-6 bg-white">
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
          <p className="mt-4 text-slate-500">
            Every minute is practical. The goal is to show how strong recruiters use AI,
            what advanced workflows look like, and where Claude Code fits in.
          </p>
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
