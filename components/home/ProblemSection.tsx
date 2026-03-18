"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Users } from "lucide-react";
import Image from "next/image";

const problems = [
  {
    icon: Users,
    text: "You're messaging the same candidates as hundreds of other recruiters",
  },
  {
    icon: TrendingDown,
    text: "Response rates keep dropping — and it's only getting worse",
  },
  {
    icon: AlertTriangle,
    text: "The best people already ignore recruiter outreach",
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
            Let&apos;s Be Honest About LinkedIn
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            You already feel it. The same searches, the same profiles, the same
            silence in your inbox. Every recruiter is fishing in the same pond —
            and the pond is getting crowded.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative w-full">
            <Image
              src="/linkedin-recruiter-screenshot-cropped.jpg"
              alt="LinkedIn recruiter search showing saturated candidate pools"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-8">
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              You spend hours searching, filtering, and writing personalized
              messages — only to find out ten other recruiters got there first.
              It&apos;s exhausting, and it&apos;s not your fault.
            </p>
            <p className="text-slate-900 font-semibold text-xl">
              The recruiters who win today are the ones who{" "}
              <span className="text-blue-600">look where nobody else is looking</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
