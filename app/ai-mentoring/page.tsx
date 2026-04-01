"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Sparkles,
  MessageCircle,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const benefits = [
  {
    icon: MessageCircle,
    title: "1-on-1 Sessions",
    description:
      "Private sessions with Michal and the team, tailored to your specific business challenges and AI goals.",
  },
  {
    icon: Users,
    title: "Group Mentoring",
    description:
      "Learn alongside other ambitious solopreneurs and founders. Share wins, troubleshoot blockers, and grow together.",
  },
  {
    icon: Calendar,
    title: "Dedicated Workshops",
    description:
      "Exclusive workshops designed for inner circle members — deeper dives on advanced topics and emerging AI tools.",
  },
  {
    icon: Zap,
    title: "Fast-Track Implementation",
    description:
      "Skip the trial-and-error. Get direct guidance on which AI tools to use, how to set them up, and what to automate first.",
  },
];

const whoItsFor = [
  "Solopreneurs who want to scale without hiring",
  "Founders building AI-first workflows into their business",
  "Professionals transitioning into AI-augmented roles",
  "Small teams that want personalized guidance instead of generic courses",
];

export default function AIMentoringPage() {
  return (
    <main>
      {/* Hero */}
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
              VIP Inner Circle
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight max-w-3xl">
              Accelerate your{" "}
              <span className="text-violet-600">AI adoption</span>{" "}
              with personal guidance
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Join our mentoring program and get direct access to Michal and his team.
              1-on-1 sessions, group mentoring, and dedicated workshops — all tailored
              to your goals.
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
              Join the mentoring program
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What You Get */}
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
              Everything you need to move fast with AI
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => {
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

      {/* Who It's For */}
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
              Built for people who want results, not courses
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

      {/* How It Works */}
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
              { step: "1", title: "Reach out", desc: "Send us an email with a bit about yourself and what you want to achieve with AI." },
              { step: "2", title: "Discovery call", desc: "We'll have a short call to understand your situation and figure out the best way to help." },
              { step: "3", title: "Start mentoring", desc: "Get matched with the right format — 1-on-1, group, or both — and start your AI acceleration." },
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

      {/* About Michal */}
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
                50,000+ students, 190+ Trustpilot reviews, 1M+ YouTube views. Michal
                has spent years helping professionals adopt AI tools and build real
                workflows — not slide decks. When you join the mentoring program, you
                get his direct attention and guidance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
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
              Ready to accelerate?
            </h2>
            <p className="text-violet-100 mb-8">
              Spots are limited to keep the experience personal. Reach out today
              and let&apos;s talk about your AI goals.
            </p>
            <Link
              href="/ai-mentoring/join"
              className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold px-6 py-3.5 rounded-xl transition-colors group"
            >
              See pricing & join
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
