"use client";

import { motion } from "framer-motion";
import { BookOpen, MonitorPlay, MessageCircle } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: null,
    title: "Prepare with members-only pre-training",
    description:
      "Each workshop has a dedicated members area with short pre-training modules — about 10 minutes each. Work through them before the live session so you arrive prepared and get significantly more out of the time together.",
    image: "/workshop-page-screenshot.jpeg",
    imageAlt: "Members area with pre-training modules",
    imageLeft: false,
  },
  {
    number: "02",
    icon: MonitorPlay,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: null,
    title: "Join live and build hands-on with Michal",
    description:
      "This is not a static course or a slide deck. Join Michal and other practitioners for a 90-minute live session where you build real AI workflows together, step by step. Ask questions, follow along, and leave with something that works.",
    image: "/screenshare-workshop-AI-in-Recruiting-Apr2.jpg",
    imageAlt: "Live workshop session with screenshare",
    imageLeft: true,
  },
  {
    number: "03",
    icon: MessageCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "Pro",
    title: "Get direct feedback in the Workgroup",
    description:
      "Pro members get access to a dedicated workgroup after the session. Commit to one concrete improvement, share your progress, and get personal feedback from Michal within a week or two. This is a rare opportunity to get direct, specific insights on what you're building.",
    image: "/workgroup-screenshot-2026-04-02.jpeg",
    imageAlt: "Pro workgroup discussion",
    imageLeft: false,
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeSlide = (fromLeft: boolean) => ({
  initial: { opacity: 0, x: fromLeft ? -32 : 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: EASE },
});

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            The Experience
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            Every workshop follows three phases — each designed to take you from
            context to capability.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-28">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const textCol = (
              <motion.div
                {...fadeSlide(step.imageLeft)}
                className="flex flex-col justify-center"
              >
                {/* Step number */}
                <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-slate-300 mb-4">
                  Step {step.number}
                </p>

                {/* Icon + badge row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={step.iconColor} size={22} />
                  </div>
                  {step.badge && (
                    <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      {step.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 leading-snug mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed max-w-md">
                  {step.description}
                </p>

                {/* Connector dot — hidden on last step */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex items-center gap-2 mt-8">
                    <span className="block w-2 h-2 rounded-full bg-slate-200" />
                    <span className="block w-1.5 h-1.5 rounded-full bg-slate-100" />
                    <span className="block w-1 h-1 rounded-full bg-slate-100" />
                  </div>
                )}
              </motion.div>
            );

            const imageCol = (
              <motion.div
                {...fadeSlide(!step.imageLeft)}
                className="relative group"
              >
                {/* Subtle glow behind image */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60 blur-2xl -z-10" />

                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/8"
                >
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    width={1200}
                    height={750}
                    className="w-full h-auto object-cover"
                    priority={i === 0}
                  />
                </motion.div>

                {/* Step number watermark */}
                <span className="absolute -top-5 -right-4 text-[80px] font-black text-slate-100 select-none pointer-events-none leading-none">
                  {step.number}
                </span>
              </motion.div>
            );

            return (
              <div
                key={step.number}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {step.imageLeft ? (
                  <>
                    {imageCol}
                    {textCol}
                  </>
                ) : (
                  <>
                    {textCol}
                    {imageCol}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
