"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Magnet,
  Send,
  UserSearch,
  Database,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import B2BLeadForm from "@/components/b2b/B2BLeadForm";
import posthog from "posthog-js";

const packages = [
  {
    icon: Magnet,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "AI for Inbound Marketing",
    description:
      "Integrate AI-powered lead gen such as a dynamic quiz to segment your leads and personalize follow-ups. Capture higher-quality leads, route them automatically, and tailor every touchpoint based on their profile.",
    idealFor: ["Marketing", "GTM", "Demand Gen"],
  },
  {
    icon: Send,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "AI for Outbound Sales",
    description:
      "Integrate AI-powered outreach. Automatically research target companies with AI, monitor their websites and career pages for buying signals, and score prospective leads before your reps ever pick up the phone.",
    idealFor: ["Sales", "BDR / SDR", "GTM"],
  },
  {
    icon: UserSearch,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    title: "AI for Candidate Sourcing",
    description:
      "Integrate tools to source candidates at scale, automatically pre-screen applications, and engage top prospects with personalized AI-driven outreach — so your team spends time on conversations, not spreadsheets.",
    idealFor: ["Recruiting", "TA", "HR"],
  },
  {
    icon: Database,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    title: "Niche Talent Pool Booster",
    description:
      "Integrate several candidate data sources to build a proprietary niche talent pool. Ideal for recruiting agencies that want to specialize in a vertical and own a defensible, always-fresh pipeline of pre-qualified candidates.",
    idealFor: ["Recruiting Agencies", "Executive Search"],
  },
];

const AVAILABLE_SERVICES = packages.map((p) => p.title);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

export default function AIIntegrationsPage() {
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm(source: "hero" | "card", service?: string) {
    posthog.capture(
      source === "hero" ? "b2b_hero_cta_clicked" : "b2b_card_cta_clicked",
      { page: "integrations", ...(service ? { service } : {}) }
    );
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-4"
          >
            For Companies
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6"
          >
            AI Integrations
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Standardized AI packages to integrate intelligent automation into your
            recruiting, marketing, sales, and business operations — without months of
            custom development.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => scrollToForm("hero")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20"
            >
              Request more info &amp; pricing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-10 flex justify-center"
          >
            <ChevronDown size={20} className="text-slate-300 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Package cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Standardized AI packages
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Each package is a proven, opinionated setup — you get the tools, the workflows,
              and the hands-on guidance to make them work for your team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-5 hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${pkg.iconBg}`}>
                    <Icon size={22} className={pkg.iconColor} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{pkg.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{pkg.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-slate-400 font-medium mr-0.5">Ideal for:</span>
                      {pkg.idealFor.map((label) => (
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
                    onClick={() => scrollToForm("card", pkg.title)}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors group"
                  >
                    Request more info
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead capture form */}
      <section ref={formRef} className="py-20 px-6 bg-slate-50 scroll-mt-20">
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
              Let&apos;s scope your integration
            </h2>
            <p className="mt-3 text-slate-500">
              Fill in the form and I&apos;ll reply within 1 business day with a tailored proposal.
            </p>
          </motion.div>

          <B2BLeadForm
            interestType="integration"
            availableServices={AVAILABLE_SERVICES}
          />
        </div>
      </section>
    </main>
  );
}
