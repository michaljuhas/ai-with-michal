"use client";

import { motion } from "framer-motion";
import { Workflow, Bot, Globe, Database, PlayCircle, FileText } from "lucide-react";
import Image from "next/image";

const assets = [
  {
    icon: Workflow,
    title: "Talent Discovery Workflow Blueprint",
    desc: "A visual step-by-step map of the entire system — print it, pin it, follow it.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "AI Candidate Analysis Templates",
    desc: "Copy-paste prompts that turn raw profiles into structured summaries with strengths, risks, and fit scores.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: Globe,
    title: "10+ Alternative Candidate Sources",
    desc: "A curated list of where to find engineers, designers, and leaders outside LinkedIn — with real examples.",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: Database,
    title: "Reusable Talent Pool Structure",
    desc: "A ready-made database template to organize, search, and track every candidate you discover.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: PlayCircle,
    title: "Full Workshop Recording",
    desc: "Rewatch at your own pace. Available immediately after the live session.",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: FileText,
    title: "90-Minute Live Implementation",
    desc: "Not a lecture — you build the system live with me. Ask questions, get help in real time.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function WhatYouGetSection() {
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
            Your Toolkit
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            You Get the AI Talent Discovery System
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            This isn&apos;t just a workshop — it&apos;s a complete toolkit you keep
            forever and use for every search.
          </p>
        </motion.div>

        {/* Laptop mockup */}
        <motion.div
          className="mb-12 rounded-2xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/windows-laptop-mockup-template-at-the-office.jpg"
            alt="Workshop preview on a laptop screen"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={item.iconColor} size={20} />
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
