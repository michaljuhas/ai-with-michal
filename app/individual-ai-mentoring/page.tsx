"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const benefits_individual = [
  {
    icon: MessageCircle,
    title: "Bi-weekly 1-on-1 calls",
    description:
      "Private video calls every other week with Michal and the team, tailored to your business challenges and AI goals.",
  },
  {
    icon: Calendar,
    title: "Dedicated workshops",
    description:
      "Exclusive workshops for inner circle members — deeper dives on advanced topics and emerging AI tools.",
  },
  {
    icon: Zap,
    title: "Fast-track implementation",
    description:
      "Direct guidance on which AI tools to use, how to set them up, and what to automate first — less trial and error.",
  },
];

const whoItsFor = [
  "Solopreneurs who want to scale without hiring",
  "Founders building AI-first workflows into their business",
  "Professionals transitioning into AI-augmented roles",
  "Leaders who want personalized guidance instead of generic courses",
];

export default function IndividualMentoringPage() {
  return (
    <main>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-100/40 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-violet-700 border border-violet-200 rounded-full px-4 py-1.5 bg-violet-50 mb-6">
              <Sparkles size={12} />
              Individual mentoring
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight max-w-3xl">
              1-on-1 guidance to move faster with{" "}
              <span className="text-violet-600">AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Bi-weekly private calls with Michal: bring your real problems and projects, leave with
              concrete next steps on tools, workflows, and adoption — built for your business, not a
              generic syllabus.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Prefer a peer circle?{" "}
              <Link href="/group-ai-mentoring" className="text-violet-600 font-semibold hover:text-violet-700">
                See group mentoring →
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10"
          >
            <Link
              href="/ai-mentoring/join"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors group shadow-lg shadow-violet-600/20"
            >
              Sign up now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-violet-600 text-sm font-semibold tracking-widest uppercase">
              What you get
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Built around your agenda
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits_individual.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-violet-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-violet-600 text-sm font-semibold tracking-widest uppercase">
              Who it&apos;s for
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              For solopreneurs who want results
            </h2>
          </motion.div>

          <motion.div
            className="bg-violet-50 border border-violet-200 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ul className="space-y-4">
              {whoItsFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-violet-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-violet-600 text-sm font-semibold tracking-widest uppercase">
              How it works
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Simple, personal, effective
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Share what you want to achieve",
                desc: "First, share what you're trying to achieve or automate with AI.",
              },
              {
                step: "2",
                title: "Pick the right way to connect your tools and AI",
                desc: "Second, we'll look into it and discuss the most efficient way to connect tools and AI together — specific to your unique situation and the tools you use.",
              },
              {
                step: "3",
                title: "Implement and stay unblocked",
                desc: "Third, we'll help you implement and fix technical issues, so you're not stuck and blocked because you don't know what those IT buzzwords are.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex items-start gap-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-8 items-start bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src="/Michal-Juhas-headshot-square-v1.jpg"
                  alt="Michal Juhas"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Michal Juhas</h3>
              <p className="text-violet-600 text-sm font-medium mb-4">Your mentor</p>
              <p className="text-slate-600 leading-relaxed">
                50,000+ students, 190+ Trustpilot reviews, 1M+ YouTube views. Michal helps
                professionals adopt AI and build real workflows — not slide decks. In individual
                mentoring you get focused time on your challenges.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 bg-violet-600">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Target size={28} className="text-violet-200 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to go faster?
            </h2>
            <p className="text-violet-100 mb-8">
              Spots stay limited so the experience stays personal. See pricing and join online.
            </p>
            <Link
              href="/ai-mentoring/join"
              className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold px-6 py-3.5 rounded-xl transition-colors group"
            >
              Sign up now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
