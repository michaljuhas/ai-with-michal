"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Star,
  GraduationCap,
  Youtube,
  BookOpen,
  Video,
  Map,
  Presentation,
  PlayCircle,
  Mic2,
} from "lucide-react";
import { WORKSHOP } from "@/lib/workshop";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";
import MemberFeedShowcase from "@/components/home/MemberFeedShowcase";

const stats = [
  { icon: Star, value: "190+", label: "Trustpilot Reviews", iconColor: "text-yellow-500" },
  { icon: BookOpen, value: "1,500+", label: "Udemy Ratings", iconColor: "text-violet-500" },
  { icon: Youtube, value: "1M+", label: "YouTube Views", iconColor: "text-red-500" },
  { icon: GraduationCap, value: "50k+", label: "Course Students", iconColor: "text-blue-500" },
  { icon: Video, value: "100+", label: "Webinars Hosted", iconColor: "text-teal-500" },
  { icon: Map, value: "5,000+", label: "Mind Maps Sold", iconColor: "text-orange-500" },
];

/** "How we help" cards — each uses a photo from `/public` (no icon components). */
const helpPillars = [
  {
    imageSrc: "/screenshare-workshop-AI-in-Recruiting-Apr2.jpg",
    imageAlt: "Live online workshop — AI in Recruiting screenshare",
    title: "Online Workshops",
    description:
      "Bi-weekly live workshops where you learn practical AI workflows — not theory. Each session is hands-on with real tools and real use cases. Open to anyone.",
    highlight: `Next: ${WORKSHOP.displayDate}`,
    href: `/workshops`,
    cta: "See upcoming workshops",
    color: "blue",
  },
  {
    imageSrc: "/individual-mentoring.jpg",
    imageAlt: "Individual and small-group AI mentoring session",
    title: "Personal Mentoring",
    description:
      "1-on-1 and group mentoring for solopreneurs and founders who want to accelerate their AI adoption. Join our inner circle with dedicated sessions and direct access to Michal and the team.",
    highlight: "VIP inner circle",
    href: "/individual-ai-mentoring",
    cta: "Individual mentoring",
    color: "violet",
  },
  {
    imageSrc: "/team-workshop-ai.jpg",
    imageAlt: "In-person AI workshop for a recruiting and TA team",
    title: "Consulting",
    description:
      "Custom AI training and implementation services for companies. From half-day workshops to full integration projects — delivered by Michal and his colleagues.",
    highlight: "Training & implementation",
    href: "/consulting",
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
              href="/membership"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors group shadow-lg shadow-blue-600/20"
            >
              Become a member
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero → lead magnet: floating bridge (ornament + soft rails) */}
      <div
        className="relative z-20 -mt-6 flex justify-center px-6 pb-1 md:-mt-8 md:pb-2"
        aria-hidden
      >
        <div className="flex w-full max-w-lg items-center gap-5 md:max-w-xl md:gap-6">
          <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent via-slate-300/70 to-slate-200/50" />
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.18)] ring-4 ring-blue-500/[0.07] backdrop-blur-sm md:h-[3.25rem] md:w-[3.25rem]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-blue-50/90 via-white to-amber-50/40" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="relative h-[22px] w-[22px] text-blue-600/85 md:h-6 md:w-6"
              aria-hidden
            >
              <path
                d="M5 18V14M9 18V9M13 18V11M17 18V6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="h-px min-w-0 flex-1 bg-gradient-to-l from-transparent via-slate-300/70 to-slate-200/50" />
        </div>
      </div>

      {/* Lead magnet: seminar presentation (premium framing) */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/80 px-6 pb-16 pt-10 md:pb-24 md:pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.07),transparent)]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-12 md:shadow-[0_32px_90px_-24px_rgba(15,23,42,0.14)]"
          >
            <div className="grid gap-12 md:grid-cols-2 md:gap-14 md:items-center">
              <div className="order-2 md:order-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900/90">
                    <Presentation size={13} className="text-amber-700 shrink-0" aria-hidden />
                    Talk recording
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    <Mic2 size={13} className="text-slate-500 shrink-0" aria-hidden />
                    Live recruiter audience
                  </span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600/90">
                  Member-exclusive
                </p>
                <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl md:leading-[1.12]">
                  The right way to adopt AI in Recruiting
                </h2>
                <p className="mt-3 text-sm font-medium text-slate-500 md:text-base">
                  The same narrative, visuals, and structure from a recent closed-room session — not a generic slide deck.
                </p>
                <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
                  Get free immediate access to the same presentation I delivered recently to a group of
                  ambitious recruiters. I spoke about the AI ladder (how to go from chatting, through
                  systemizing, to automating), and how to set the right foundation to build on.
                </p>
                <ul className="mt-6 flex flex-col gap-3 border-l-2 border-blue-100 pl-4 text-sm text-slate-700 md:text-[0.9375rem]">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
                    <span>How to move from ad-hoc chatting to repeatable workflows and real automation.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
                    <span>What to put in place first so every later AI investment actually compounds.</span>
                  </li>
                </ul>
                <div className="mt-9">
                  <Link
                    href="/members/resources/test0104?ref=homepage-seminar"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 ring-1 ring-blue-500/30 transition-[transform,box-shadow] hover:from-blue-600 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/30 group"
                  >
                    <PlayCircle size={22} className="opacity-95 group-hover:scale-105 transition-transform" aria-hidden />
                    Watch the presentation
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
                  </Link>
                  <p className="mt-3 text-xs text-slate-500">
                    Free with a member account · one click after sign-in
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="order-1 md:order-2"
              >
                <div className="relative mx-auto w-full max-w-lg md:max-w-none">
                  <div
                    className="pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-blue-500/20 via-slate-200/40 to-amber-200/30 opacity-90 blur-sm"
                    aria-hidden
                  />
                  {/*
                    aspect + overflow must live on the same box as next/image fill,
                    or the inner height collapses (fill positions the img out of flow).
                  */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-slate-900/10 shadow-2xl shadow-slate-900/20">
                    <Image
                      src="/seminar-belgrade-v2.jpg"
                      alt="Michal presenting on AI in recruiting to an audience in Belgrade"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                        From the room
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-white md:text-xl">
                        Real session · same flow you will unlock
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
            {helpPillars.map((pillar, i) => {
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
                    <div
                      className={`relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80 ${colors.iconBg}`}
                    >
                      <Image
                        src={pillar.imageSrc}
                        alt={pillar.imageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
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

                <MichalProfileLearnMoreLink className="mt-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MemberFeedShowcase />

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
