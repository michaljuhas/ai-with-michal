"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Puzzle,
  Users,
  CheckCircle2,
  Mail,
} from "lucide-react";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";
const offerings = [
  {
    icon: GraduationCap,
    title: "AI Workshops for Teams",
    description:
      "Hands-on workshops tailored to your team's needs — from recruiting workflow audits to personal productivity with AI. We come to you (or run it online) and leave your team with practical skills they can use the next day.",
    highlights: [
      "Recruiting workflow audit & automation plan",
      "Personal productivity with AI tools",
      "AI in recruiting — sourcing, screening, reporting",
      "Custom topics based on your team's challenges",
    ],
    href: "/ai-workshops-for-teams",
    cta: "Explore workshops",
    color: "blue",
  },
  {
    icon: Puzzle,
    title: "AI implementation",
    description:
      "We build and deploy AI-powered workflows directly into your business. From inbound lead gen to outbound sales automation, candidate sourcing, and talent pipeline management — we handle implementation end to end.",
    highlights: [
      "AI for inbound marketing & lead generation",
      "AI for outbound sales & prospecting",
      "AI for candidate sourcing & screening",
      "Talent pipeline automation",
    ],
    href: "/ai-implementation",
    cta: "Explore implementation",
    color: "emerald",
  },
];

export default function ForTeamsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 bg-emerald-50 mb-6">
              <Building2 size={12} />
              For companies & teams
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight max-w-3xl">
              AI training and{" "}
              <span className="text-emerald-600">implementation</span>{" "}
              for your team
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              From half-day workshops to full integration projects — delivered by
              Michal Juhas, Josef Nevoral, and a team of AI practitioners who build
              with these tools every day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/ai-workshops-for-teams"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors group shadow-lg shadow-emerald-600/20"
            >
              Explore workshops
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ai-implementation"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Explore implementation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Two Offerings */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-emerald-600 text-sm font-semibold tracking-widest uppercase">
              What we offer
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Two ways to bring AI to your team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {offerings.map((offering, i) => {
              const Icon = offering.icon;
              const isBlue = offering.color === "blue";
              return (
                <motion.div
                  key={offering.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={offering.href}
                    className="group block h-full bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-8 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className={`w-12 h-12 rounded-xl ${isBlue ? "bg-blue-50" : "bg-emerald-50"} flex items-center justify-center mb-5`}>
                      <Icon size={22} className={isBlue ? "text-blue-600" : "text-emerald-600"} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{offering.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {offering.description}
                    </p>
                    <ul className="space-y-2.5 mb-6">
                      {offering.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${isBlue ? "text-blue-500" : "text-emerald-500"}`} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${isBlue ? "text-blue-600" : "text-emerald-600"} group-hover:gap-2.5 transition-all`}>
                      {offering.cta}
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-emerald-600 text-sm font-semibold tracking-widest uppercase">
              Your team
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Delivered by practitioners
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Our trainers and implementers use AI tools daily in their own work.
              You get real experience, not recycled theory.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                  <Image
                    src="/Michal-Juhas-headshot-square-v1.jpg"
                    alt="Michal Juhas"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Michal Juhas</h3>
                  <p className="text-sm text-slate-500">AI Educator & Automation Expert</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                50,000+ students, 190+ Trustpilot reviews. Leads workshops on AI in
                recruiting, productivity, and workflow automation.
              </p>
              <MichalProfileLearnMoreLink className="mt-5 w-full" />
            </motion.div>

            <motion.div
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Users size={22} className="text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Josef Nevoral</h3>
                  <p className="text-sm text-slate-500">AI Integration Specialist</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Leads implementation projects — building AI-powered workflows, integrations,
                and automation systems for companies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-emerald-600">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={28} className="text-emerald-200 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Let&apos;s talk about your team
            </h2>
            <p className="text-emerald-100 mb-8">
              Every team is different. Tell us about your needs and we&apos;ll put together
              the right solution — workshops, implementation, or both.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <Mail size={16} />
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
