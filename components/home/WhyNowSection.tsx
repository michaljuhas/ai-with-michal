"use client";

import { motion } from "framer-motion";
import { TrendingDown, Users, Zap } from "lucide-react";

const shifts = [
  {
    icon: TrendingDown,
    stat: "LinkedIn response rates are dropping — fast.",
    detail:
      "What worked 2 years ago barely works today. Candidates are overwhelmed and tuning out.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Users,
    stat: "The same candidates get contacted by dozens of recruiters.",
    detail:
      "If you're finding them on LinkedIn, so is everyone else. There's no competitive advantage left.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Zap,
    stat: "The advantage is shifting to recruiters who use AI — now.",
    detail:
      "Early adopters are already building talent pools nobody else has access to. Every week you wait, they get further ahead.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export default function WhyNowSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Why Now
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            The Window Is Closing
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
            Recruiting is changing faster than most people realize.
            The ones who move first win.
          </p>
        </motion.div>

        <div className="space-y-5">
          {shifts.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.stat}
                className={`flex items-start gap-5 rounded-2xl ${item.bg} p-6 md:p-8`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className={`shrink-0 mt-0.5 ${item.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-lg leading-snug">
                    {item.stat}
                  </p>
                  <p className="text-slate-600 mt-1.5 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="mt-10 text-center text-slate-800 font-semibold text-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          You can keep doing what everyone else is doing.
          <br />
          Or you can{" "}
          <span className="text-blue-600">build something they don&apos;t have</span>.
        </motion.p>
      </div>
    </section>
  );
}
