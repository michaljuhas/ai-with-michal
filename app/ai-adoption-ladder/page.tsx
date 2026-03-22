"use client";

import { motion } from "framer-motion";
import {
  WifiOff,
  MessageCircle,
  Layers,
  Zap,
  Rocket,
  ArrowRight,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/config";

const stages = [
  {
    number: 1,
    name: "Offline",
    tagline: "Not using AI tools",
    icon: WifiOff,
    color: {
      bg: "bg-slate-900/60",
      border: "border-slate-700/60",
      badge: "bg-slate-800 text-slate-300",
      icon: "text-slate-400",
      number: "text-slate-600",
      glow: "from-slate-800/30 to-transparent",
      pill: "bg-slate-800/80 text-slate-300 ring-slate-700/50",
    },
    youreHereIf: [
      '"I\'ll just Google it."',
      '"AI doesn\'t really apply to my job."',
      '"I tried ChatGPT once — it wasn\'t that useful."',
    ],
    nextMoves: [
      "Try ChatGPT or Gemini for one real task this week",
      "Ask it to draft an email or summarize a document",
      "Notice where it saves you even 10 minutes",
    ],
  },
  {
    number: 2,
    name: "Chatting",
    tagline: "Using AI chat — starting from scratch every time",
    icon: MessageCircle,
    color: {
      bg: "bg-sky-950/60",
      border: "border-sky-700/50",
      badge: "bg-sky-900 text-sky-300",
      icon: "text-sky-400",
      number: "text-sky-800",
      glow: "from-sky-700/20 to-transparent",
      pill: "bg-sky-900/80 text-sky-300 ring-sky-700/50",
    },
    youreHereIf: [
      '"Let me open a new chat."',
      '"I use ChatGPT sometimes, when I remember."',
      '"I type my question and copy the answer."',
    ],
    nextMoves: [
      "Save your best prompts in a Notion doc or markdown file",
      "Explore Custom GPTs or Gemini Gems for repeated tasks",
      "Add context about yourself so AI knows who you are",
    ],
  },
  {
    number: 3,
    name: "Systemizing",
    tagline: "Custom GPTs, saved prompts, persistent memory",
    icon: Layers,
    color: {
      bg: "bg-blue-950/60",
      border: "border-blue-600/50",
      badge: "bg-blue-900 text-blue-300",
      icon: "text-blue-400",
      number: "text-blue-800",
      glow: "from-blue-600/20 to-transparent",
      pill: "bg-blue-900/80 text-blue-300 ring-blue-600/50",
    },
    youreHereIf: [
      '"I have a prompt for that."',
      '"My GPT knows my context."',
      '"AI feels like a junior colleague."',
    ],
    nextMoves: [
      "Identify 3 repetitive tasks that could run without you",
      "Explore n8n, Make.com, or Zapier for your first automation",
      "Connect AI to your existing tools (email, CRM, calendar)",
    ],
  },
  {
    number: 4,
    name: "Automating",
    tagline: "AI workflows run in the background — without you",
    icon: Zap,
    color: {
      bg: "bg-violet-950/60",
      border: "border-violet-600/50",
      badge: "bg-violet-900 text-violet-300",
      icon: "text-violet-400",
      number: "text-violet-800",
      glow: "from-violet-600/20 to-transparent",
      pill: "bg-violet-900/80 text-violet-300 ring-violet-600/50",
    },
    youreHereIf: [
      '"That runs automatically every morning."',
      '"I set it up once — it just works."',
      '"My team gets reports without me sending them."',
    ],
    nextMoves: [
      "Redesign a core process assuming AI exists from step one",
      "Stop automating old habits — build new, AI-first workflows",
      "Measure time saved and reinvest it into higher-leverage work",
    ],
  },
  {
    number: 5,
    name: "AI-Native",
    tagline: "Processes designed around AI from day one",
    icon: Rocket,
    color: {
      bg: "bg-emerald-950/60",
      border: "border-emerald-600/50",
      badge: "bg-emerald-900 text-emerald-300",
      icon: "text-emerald-400",
      number: "text-emerald-800",
      glow: "from-emerald-600/20 to-transparent",
      pill: "bg-emerald-900/80 text-emerald-300 ring-emerald-600/50",
    },
    youreHereIf: [
      '"I designed that process around AI from the start."',
      '"We don\'t do that manually anymore."',
      '"AI is our competitive advantage."',
    ],
    nextMoves: [
      "Share what works — document and teach your team",
      "Identify the next domain to transform",
      "Build proprietary workflows that are hard to replicate",
    ],
  },
];

const fadeUpBase = { opacity: 0, y: 28 };
const fadeUpVisible = { opacity: 1, y: 0 };
const fadeUpTransition = (i: number) => ({
  duration: 0.55,
  delay: i * 0.1,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number] as [number, number, number, number],
});

export default function AiAdoptionLadderPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/8 blur-[100px]" />
        </div>

        {/* Stage pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {stages.map((s) => (
            <span
              key={s.number}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ${s.color.pill}`}
            >
              <s.icon size={11} />
              {s.name}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
        >
          Your{" "}
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            AI Adoption
          </span>{" "}
          Ladder
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative z-10 mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          5 stages every professional goes through when adopting AI.
          <br className="hidden sm:block" />
          Find where you are — then learn exactly what to do next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative z-10 mt-10"
        >
          <Link
            href={SITE.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-xl shadow-white/10"
          >
            Book a call with Michal
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 mt-20 flex flex-col items-center gap-2 text-slate-600 text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── 5 Stage Cards ───────────────────────────────────────── */}
      <section className="px-6 pb-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.number}
                initial={fadeUpBase}
                whileInView={fadeUpVisible}
                viewport={{ once: true }}
                transition={fadeUpTransition(i)}
                className={`relative flex flex-col rounded-2xl border p-6 ${stage.color.bg} ${stage.color.border} backdrop-blur-sm overflow-hidden`}
              >
                {/* Subtle inner glow */}
                <div
                  className={`pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${stage.color.glow}`}
                />

                {/* Stage number — large watermark */}
                <span
                  className={`absolute bottom-4 right-5 text-8xl font-black opacity-[0.07] select-none leading-none ${stage.color.number}`}
                >
                  {stage.number}
                </span>

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between mb-5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${stage.color.badge}`}
                  >
                    Stage {stage.number}
                  </span>
                  <Icon size={20} className={stage.color.icon} />
                </div>

                {/* Stage name */}
                <h2 className="relative z-10 text-xl font-bold text-white mb-1">
                  {stage.name}
                </h2>
                <p className="relative z-10 text-xs text-slate-400 leading-relaxed mb-6">
                  {stage.tagline}
                </p>

                {/* You're here if */}
                <div className="relative z-10 mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    You&apos;re here if&hellip;
                  </p>
                  <ul className="space-y-1.5">
                    {stage.youreHereIf.map((line, j) => (
                      <li key={j} className="text-xs text-slate-300 italic leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next moves */}
                <div className="relative z-10 mt-auto">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Next moves
                  </p>
                  <ul className="space-y-2">
                    {stage.nextMoves.map((move, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle
                          size={13}
                          className={`mt-0.5 shrink-0 ${stage.color.icon}`}
                        />
                        <span className="text-xs text-slate-300 leading-relaxed">
                          {move}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Connector visual ─────────────────────────────────────── */}
      <section className="py-8 px-6 max-w-[1440px] mx-auto hidden lg:block">
        <div className="flex items-center justify-between px-4">
          {stages.map((stage, i) => (
            <div key={stage.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    i === 0
                      ? "bg-slate-500 border-slate-500"
                      : i === 1
                      ? "bg-sky-500 border-sky-500"
                      : i === 2
                      ? "bg-blue-500 border-blue-500"
                      : i === 3
                      ? "bg-violet-500 border-violet-500"
                      : "bg-emerald-500 border-emerald-500"
                  }`}
                />
                <span className="mt-2 text-xs text-slate-500">{stage.name}</span>
              </div>
              {i < stages.length - 1 && (
                <div className="flex-1 flex items-center mx-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-slate-600" />
                  <ChevronRight size={14} className="text-slate-600 -mx-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Deep Dive — domains ──────────────────────────────────── */}
      <section className="px-6 py-24 max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The biggest leap? From Chatting to Systemizing.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Most people stay stuck at stage 2 for months — or years. The jump to
            stage 3 changes everything. AI stops being a tool you open and starts
            being a system that works{" "}
            <span className="text-white font-medium">with</span> you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Talent Acquisition",
              emoji: "🎯",
              items: [
                "Stage 2 → Drafting JDs with ChatGPT",
                "Stage 3 → Custom GPT with your employer brand voice",
                "Stage 4 → Auto-sourcing + outreach pipelines",
                "Stage 5 → AI-screened candidates before human review",
              ],
            },
            {
              title: "Marketing & Content",
              emoji: "📣",
              items: [
                "Stage 2 → Generating post ideas on demand",
                "Stage 3 → Brand voice in memory, batch creation",
                "Stage 4 → Scheduled content workflows, auto-publishing",
                "Stage 5 → Data-driven content designed around AI output",
              ],
            },
            {
              title: "Sales & Operations",
              emoji: "⚡",
              items: [
                "Stage 2 → AI-written follow-up emails",
                "Stage 3 → Proposal templates + objection GPTs",
                "Stage 4 → CRM updates via automation, auto-reports",
                "Stage 5 → Sales playbooks built AI-first from day one",
              ],
            },
          ].map((domain, i) => (
            <motion.div
              key={domain.title}
              initial={fadeUpBase}
              whileInView={fadeUpVisible}
              viewport={{ once: true }}
              transition={fadeUpTransition(i)}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-7"
            >
              <div className="text-3xl mb-3">{domain.emoji}</div>
              <h3 className="text-lg font-bold text-white mb-4">{domain.title}</h3>
              <ul className="space-y-2.5">
                {domain.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <ArrowRight
                      size={13}
                      className="mt-1 shrink-0 text-slate-600"
                    />
                    <span className="text-sm text-slate-400 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="relative px-6 py-28 overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/12 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
            Work with Michal
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Not sure where you or your team stands?
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Book a free 30-minute call. We&apos;ll identify your current stage,
            find the highest-leverage move, and map a practical path to the next
            level — for you and your team.
          </p>

          <Link
            href={SITE.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold text-base shadow-2xl shadow-blue-600/30"
          >
            Book a call with Michal
            <ArrowRight size={18} />
          </Link>

          <p className="mt-5 text-xs text-slate-600">
            No commitment. 30 minutes. Fully focused on your situation.
          </p>
        </motion.div>
      </section>

      {/* ── Footer note ─────────────────────────────────────────── */}
      <div className="border-t border-slate-900 py-8 px-6 text-center">
        <p className="text-xs text-slate-700">
          © {new Date().getFullYear()} Michal Juhas ·{" "}
          <Link href="/" className="hover:text-slate-500 transition-colors">
            aiwithmichal.com
          </Link>
        </p>
      </div>
    </main>
  );
}
