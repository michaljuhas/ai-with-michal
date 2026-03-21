"use client";

import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

const audience = [
  { title: "In-House Recruiters", desc: "Who want practical AI workflows they can use immediately" },
  { title: "Talent Acquisition Specialists", desc: "Who need to source and screen candidates faster" },
  { title: "Talent Acquisition Leads", desc: "Who want their team to stay ahead of the market shift" },
  { title: "Agency Recruiters", desc: "Who want to deliver faster, smarter candidate shortlists" },
  { title: "Recruitment Consultants", desc: "Who want to turn AI into a real recruiting advantage" },
  { title: "Technical Recruiters", desc: "Who need better ways to research and assess candidates" },
];

export default function WhoItsForSection() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Is This For You?
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Built for Recruiters and TA Teams Who Want to Stay Ahead
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            If you want to use AI to source, screen, and organize candidates more
            effectively, this workshop is built for you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {audience.map((person, i) => (
            <motion.div
              key={person.title}
              className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <UserCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-slate-900">{person.title}</p>
                <p className="text-slate-500 text-sm mt-0.5">{person.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-emerald-700 font-semibold text-lg">
            No coding or technical skills needed.
          </p>
          <p className="text-slate-500 mt-1">
            If you can use Google and LinkedIn, you can do this.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
