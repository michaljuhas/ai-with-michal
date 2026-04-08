"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Users,
  Sparkles,
  Building2,
  Star,
  GraduationCap,
  Youtube,
  BookOpen,
  Video,
  Map,
} from "lucide-react";
import { WORKSHOP } from "@/lib/workshop";
import WorkTogetherSection from "@/components/work-together/WorkTogetherSection";

const stats = [
  { icon: Star, value: "190+", label: "Trustpilot Reviews", iconColor: "text-yellow-500" },
  { icon: BookOpen, value: "1,500+", label: "Udemy Ratings", iconColor: "text-violet-500" },
  { icon: Youtube, value: "1M+", label: "YouTube Views", iconColor: "text-red-500" },
  { icon: GraduationCap, value: "50k+", label: "Course Students", iconColor: "text-blue-500" },
  { icon: Video, value: "100+", label: "Webinars Hosted", iconColor: "text-teal-500" },
  { icon: Map, value: "5,000+", label: "Mind Maps Sold", iconColor: "text-orange-500" },
];

const pillars = [
  {
    icon: Calendar,
    title: "Online Workshops",
    description:
      "Bi-weekly live workshops where you learn practical AI workflows — not theory. Each session is hands-on with real tools and real use cases. Open to anyone.",
    highlight: `Next: ${WORKSHOP.displayDate}`,
    href: `/workshops`,
    cta: "See upcoming workshops",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "Personal Mentoring",
    description:
      "1-on-1 and group mentoring for solopreneurs and founders who want to accelerate their AI adoption. Join our inner circle with dedicated sessions and direct access to Michal and the team.",
    highlight: "VIP inner circle",
    href: "/individual-ai-mentoring",
    cta: "Individual mentoring",
    color: "violet",
  },
  {
    icon: Building2,
    title: "Consulting",
    description:
      "Custom AI training and implementation services for companies. From half-day workshops to full integration projects — delivered by Michal and his colleagues.",
    highlight: "Training & implementation",
    href: "/work-together",
    cta: "Explore options",
    color: "emerald",
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; badgeText: string; iconBg: string; iconText: string }> = {
  blue: {
    bg: "hover:border-blue-200",
    border: "border-slate-200",
    badge: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  violet: {
    bg: "hover:border-violet-200",
    border: "border-slate-200",
    badge: "bg-violet-50 border-violet-200",
    badgeText: "text-violet-700",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
  },
  emerald: {
    bg: "hover:border-emerald-200",
    border: "border-slate-200",
    badge: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
              Accelerate your{" "}
              <span className="text-blue-600">AI adoption</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Workshops, mentoring, and implementation services to help individuals and
              teams work smarter with AI. Led by Michal Juhas and his team of practitioners.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/workshops"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors group shadow-lg shadow-blue-600/20"
            >
              Join upcoming workshops
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/work-together"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Start working together
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
              How we help
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Three ways to level up with AI
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              const colors = colorMap[pillar.color];
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={pillar.href}
                    className={`group block h-full bg-white border ${colors.border} ${colors.bg} rounded-2xl p-8 shadow-sm transition-all hover:shadow-md`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}>
                      <Icon size={22} className={colors.iconText} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {pillar.description}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 ${colors.badge} ${colors.badgeText} mb-5`}>
                      {pillar.highlight}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
                      {pillar.cta}
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Credibility */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
              Who we are
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Led by Michal Juhas
            </h2>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <Image
                    src="/Michal-Juhas-headshot-square-v1.jpg"
                    alt="Michal Juhas"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-slate-900 text-2xl font-bold mb-1">Michal Juhas</h3>
                <p className="text-blue-600 text-sm font-medium mb-5">
                  AI Educator & Automation Expert
                </p>
                <p className="text-slate-600 leading-relaxed mb-3">
                  With years of experience in technical recruiting, AI education, and
                  workflow automation, Michal helps professionals and teams adopt AI in
                  ways that deliver real, measurable results — not just buzzwords.
                </p>
                <p className="text-slate-600 leading-relaxed mb-5">
                  From live workshops and 1-on-1 mentoring to enterprise-grade integration
                  projects, our mission is to make AI practical and accessible for everyone.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-5 border-t border-slate-100">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        className="flex items-center gap-2.5"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                      >
                        <Icon size={15} className={`shrink-0 ${stat.iconColor}`} />
                        <div>
                          <p className="text-slate-900 font-bold text-sm leading-tight">{stat.value}</p>
                          <p className="text-slate-400 text-xs leading-tight">{stat.label}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Not sure where to start?
            </h2>
            <p className="text-slate-600 mb-8">
              Reach out and we&apos;ll help you find the right path — whether it&apos;s a workshop,
              mentoring, or a custom solution for your team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <Users size={16} />
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
