"use client";

import { motion } from "framer-motion";
import { Video, Map, BookOpen, PlayCircle, Wand2 } from "lucide-react";
import Image from "next/image";

const items = [
  {
    icon: Video,
    title: "Live Workshop (90 min)",
    desc: "Hands-on session where we build it together, step by step.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Map,
    title: "Workflow Blueprint",
    desc: "A visual cheat-sheet of the full system so you never get lost.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: BookOpen,
    title: "Sourcing Playbook",
    desc: "Where to find hidden candidates — with real examples for each source.",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: PlayCircle,
    title: "Full Recording",
    desc: "Rewatch at your own pace. Available right after the session.",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Wand2,
    title: "AI Prompts & Templates",
    desc: "Copy-paste prompts to analyze candidates instantly.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
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
            Everything Included
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            What You Get
          </h2>
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
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={item.iconColor} size={20} />
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
