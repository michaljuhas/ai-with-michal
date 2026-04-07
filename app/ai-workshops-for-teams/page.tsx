"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  Users,
  TrendingUp,
  ArrowDown,
  ChevronDown,
  CheckCircle2,
  Star,
} from "lucide-react";
import B2BLeadForm from "@/components/b2b/B2BLeadForm";
import WhyMichalB2B from "@/components/b2b/WhyMichalB2B";
import posthog from "posthog-js";

const workshops = [
  {
    icon: Search,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "Recruiting Workflow Audit",
    description:
      "Identify manual bottlenecks in your hiring process and get a prioritized AI automation plan. We map your current workflow end-to-end, pinpoint the highest-ROI opportunities, and leave you with a concrete roadmap to act on immediately.",
    idealFor: ["Recruiting Agencies"],
  },
  {
    icon: Zap,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "Workshop on Personal Productivity with AI",
    description:
      "Inspire your team to take full advantage of AI in their daily work. A practical session covering the mindset shift, the best tools, and the workflows that actually save time — no matter which department your people sit in.",
    idealFor: ["Recruiting", "Marketing", "Sales", "Operations"],
  },
  {
    icon: Users,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    title: "Workshop on AI in Recruiting",
    description:
      "Elevate your team in how they use AI for sourcing, screening, and reporting. From building talent pipelines with AI to pre-screening candidates at scale, this workshop turns recruiters into AI-powered hiring machines.",
    idealFor: ["Recruiting", "HR", "TA"],
  },
  {
    icon: TrendingUp,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    title: "Workshop on AI in Marketing & Sales",
    description:
      "Elevate your GTM team in how they use AI for research, content, outreach, and pipeline generation. Practical workflows your team can deploy the same week.",
    idealFor: ["GTM", "Marketing", "Sales"],
  },
];

const AVAILABLE_SERVICES = ["How To Use AI In Your Business", ...workshops.map((w) => w.title)];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

export default function AIWorkshopsForTeamsPage() {
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm(source: "hero" | "card", service?: string) {
    posthog.capture(
      source === "hero" ? "b2b_hero_cta_clicked" : "b2b_card_cta_clicked",
      { page: "workshops", ...(service ? { service } : {}) }
    );
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-10 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-4"
          >
            For Teams &amp; Companies
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6"
          >
            AI Workshops for Teams
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Private workshops and consulting to help your team get real value from AI —
            in recruiting, sales, marketing, or across all operations.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              type="button"
              onClick={() => scrollToForm("hero")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Request more info &amp; pricing
              <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-5 flex justify-center"
          >
            <ChevronDown size={20} className="text-slate-300 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Featured Workshop */}
      <section className="pt-12 pb-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star size={120} className="text-blue-600" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm mb-6">
                <Star size={16} className="fill-blue-700" />
                Most Popular
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How To Use AI In Your Business
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                A highly customizable workshop designed to uncover the best AI opportunities specific to your company. We start with your unique context and end with an actionable roadmap.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {[
                  "Input about your business (questionnaire from management)",
                  "1 hour preparation for the workshop",
                  "1 hour workshop to discuss",
                  "Follow-up and roadmap for AI opportunities",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-blue-600 mt-1 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToForm("card", "How To Use AI In Your Business")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-base group cursor-pointer"
              >
                Request this workshop
                <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workshop cards */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Other Popular Workshops
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Each session is tailored to your team&apos;s context, tech stack, and skill level.
              All workshops can be delivered remotely or on-site.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshops.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-5 hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${w.iconBg}`}>
                    <Icon size={22} className={w.iconColor} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{w.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{w.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-slate-400 font-medium mr-0.5">Ideal for:</span>
                      {w.idealFor.map((label) => (
                        <span
                          key={label}
                          className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToForm("card", w.title)}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors group cursor-pointer"
                  >
                    Request more info
                    <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Michal */}
      <WhyMichalB2B />

      {/* Lead capture form */}
      <section ref={formRef} className="py-20 px-6 bg-white scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
              Get in touch
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Let&apos;s talk about your team
            </h2>
            <p className="mt-3 text-slate-500">
              Fill in the form and I&apos;ll reply within one business day with next steps. Pricing for
              private workshops and services is on the site.
            </p>
          </motion.div>

          <B2BLeadForm
            interestType="workshop"
            availableServices={AVAILABLE_SERVICES}
          />
        </div>
      </section>
    </main>
  );
}
