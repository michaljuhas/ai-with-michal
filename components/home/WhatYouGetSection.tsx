"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  FileText,
  MessageSquare,
  PlayCircle,
  Users,
} from "lucide-react";
import Image from "next/image";

const assets = [
  {
    icon: BookOpen,
    title: "Members-Area Pre-Training",
    desc: "Get access before the live session so you can learn the key ideas before we build together.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "Real Recruiting Workflow Examples",
    desc: "See practical examples for talent pools, AI pre-screening, and repetitive recruiting tasks.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: PlayCircle,
    title: "90-Minute Live Workshop",
    desc: "Build the workflow live with Michal, ask questions, and follow along step by step.",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: FileText,
    title: "Practical Notes and Examples",
    desc: "Leave with concrete ideas you can adapt to your own roles, hiring process, and team setup.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Private Work Group Access",
    desc: "Share your automations, get inspired by other recruiters, and keep the momentum going after the workshop.",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: MessageSquare,
    title: "Live Q&A with Michal",
    desc: "Get help tailoring the workflow to your hiring volume, team, and current AI skill level.",
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
            Your Access
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            What You Get Before, During, and After the Workshop
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            This is designed to help recruiters actually put AI workflows into practice,
            not just watch another presentation.
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
