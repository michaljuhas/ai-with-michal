"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Magnet,
  Send,
  UserSearch,
  Database,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import posthog from "posthog-js";

const packages = [
  {
    icon: Magnet,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    contactServiceId: "ai-for-inbound-marketing",
    title: "AI for Inbound Marketing",
    description:
      "AI-powered lead gen such as a dynamic quiz to segment your leads and personalize follow-ups. Capture higher-quality leads, route them automatically, and tailor every touchpoint based on their profile.",
    idealFor: ["Marketing", "GTM", "Demand Gen"],
  },
  {
    icon: Send,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    contactServiceId: "ai-for-outbound-sales",
    title: "AI for Outbound Sales",
    description:
      "Research targets with AI, monitor websites and career pages for buying signals, and score prospective leads before your reps pick up the phone.",
    idealFor: ["Sales", "BDR / SDR", "GTM"],
  },
  {
    icon: UserSearch,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    contactServiceId: "ai-for-candidate-sourcing",
    title: "AI for Candidate Sourcing",
    description:
      "Source candidates at scale, pre-screen applications, and engage top prospects with personalized outreach — so your team spends time on conversations, not spreadsheets.",
    idealFor: ["Recruiting", "TA", "HR"],
  },
  {
    icon: Database,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    contactServiceId: "niche-talent-pool-booster",
    title: "Niche Talent Pool Booster",
    description:
      "Combine candidate data sources to build a proprietary niche talent pool. Ideal for agencies specializing in a vertical and owning a defensible, always-fresh pipeline.",
    idealFor: ["Recruiting Agencies", "Executive Search"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

function goContact(source: "hero" | "card", serviceId?: string) {
  posthog.capture(source === "hero" ? "b2b_hero_cta_clicked" : "b2b_card_cta_clicked", {
    page: "ai_implementation",
    destination: "/contact",
    ...(serviceId ? { service_id: serviceId } : {}),
  });
}

export default function AIImplementationPage() {
  return (
    <main className="min-h-screen bg-white">
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
            Hands-on AI implementation
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Less slide deck, more working systems. We help you ship AI-powered workflows across
            marketing, sales, and recruiting — the parts of the business where speed and pipeline
            actually show up on the P&amp;L.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              onClick={() => goContact("hero")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20"
            >
              Get in touch
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
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
              Problems we solve
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Pick the outcome that matches your bottleneck. Tell us your context on the contact form —
              we&apos;ll confirm scope and book a call to go deeper.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              const href = `/contact?service=${encodeURIComponent(pkg.contactServiceId)}`;
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

                  <Link
                    href={href}
                    onClick={() => goContact("card", pkg.contactServiceId)}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors group"
                  >
                    Get in touch
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 mb-6">
            Ready to scope timing, stack, and ownership? Send the form — then book a call on the next
            screen.
          </p>
          <Link
            href="/contact"
            onClick={() => goContact("hero")}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to contact form
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
