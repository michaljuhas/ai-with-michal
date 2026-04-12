"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import {
  ArrowDown,
  ArrowRight,
  Layers,
  Library,
  MessageCircle,
  Sparkles,
  Video,
  Wrench,
} from "lucide-react";
import MembershipCheckoutButton from "@/components/membership/MembershipCheckoutButton";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";
import { getStoredTrackingParams } from "@/lib/tracking-params";

const ADOPTION_LADDER_SRC = "/news/2026-04-08-ai-adoption-maturity.jpg";

const coreWorkshops = [
  {
    title: "AI in Recruiting — Introduction (From Prompts to Systems)",
    body: "Understand the real landscape of AI in recruiting, what actually works, and how to move beyond basic prompting.",
  },
  {
    title: "Build an AI-Powered Talent Sourcing Engine (Beyond LinkedIn)",
    body: "Identify and build talent pools outside LinkedIn using alternative data sources and automation.",
  },
  {
    title: "Automate Candidate Research & Personalization at Scale",
    body: "Create workflows that enrich candidate data and generate highly personalized outreach automatically.",
  },
  {
    title: "Detect Hiring Signals Before Roles Go Public",
    body: "Identify early indicators of hiring needs and position yourself before competitors even see the job.",
  },
];

const deepDives = [
  "Build Your First End-to-End Recruiting Automation (Step-by-Step)",
  "AI-Powered Talent Mapping for Hard-to-Fill Roles",
  "Replace Manual Sourcing with Data Pipelines",
  "Prompt Engineering for Recruiters (Advanced Use Cases Only)",
  "Building a Repeatable Outreach System That Converts",
  "From Chaos to System: Designing Your Recruiting AI Stack",
];

const benefits = [
  {
    icon: Video,
    title: "Monthly live workshops",
    body: "2-hour deep dives · one specific outcome per session",
  },
  {
    icon: Wrench,
    title: "Real workflows (not theory)",
    body: "n8n / Make.com automations, sourcing systems, personalization pipelines, data enrichment flows",
  },
  {
    icon: MessageCircle,
    title: "Workgroup access",
    body: "Ask questions anytime, share use cases, get feedback",
  },
  {
    icon: Library,
    title: "Full recording library",
    body: "Access all past sessions — revisit and implement at your pace",
  },
  {
    icon: Layers,
    title: "Templates & systems",
    body: "Copy-paste workflows, structured prompt frameworks, sourcing maps and strategies",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function trackMembershipNav(target: string) {
  posthog.capture("membership_in_page_nav", { target, pathname: "/membership" });
}

export default function MembershipSalesContent() {
  const pageViewSent = useRef(false);
  const { user } = useUser();

  useEffect(() => {
    if (pageViewSent.current) return;
    pageViewSent.current = true;
    const urlRef =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("ref")
        : null;
    const stored = getStoredTrackingParams();
    const ref = urlRef ?? stored?.ref;
    posthog.capture("membership_page_viewed", {
      pathname: "/membership",
      ...(ref ? { ref } : {}),
      ...(stored?.utm_source ? { utm_source: stored.utm_source } : {}),
      ...(stored?.utm_medium ? { utm_medium: stored.utm_medium } : {}),
      ...(stored?.utm_campaign ? { utm_campaign: stored.utm_campaign } : {}),
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    posthog.identify(user.id, {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName ?? undefined,
    });
  }, [user]);

  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              {...fadeUp}
              className="text-sm font-semibold tracking-widest uppercase text-blue-600"
            >
              Annual membership
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight"
            >
              Build AI-powered recruiting systems — not just prompts
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              Monthly workshops, real workflows, and hands-on systems to help you source faster, personalize at
              scale, and close better candidates.
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Investment</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">€890</p>
                <p className="text-xs text-slate-500">per year · one payment</p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <MembershipCheckoutButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !shadow-lg !shadow-blue-600/20" />
                <Link
                  href="#ladder"
                  onClick={() => trackMembershipNav("ladder")}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                  See the adoption ladder
                  <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" aria-hidden />
                </Link>
              </div>
            </motion.div>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="mt-10 text-xs text-slate-500"
            >
              Built by ex-CTO &amp; recruiter · 50,000+ professionals trained
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:col-span-7"
          >
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-900/10 shadow-2xl shadow-slate-900/10 bg-white">
              <Image
                src={ADOPTION_LADDER_SRC}
                alt="AI adoption maturity ladder — from isolated experiments to agents executing full workflows"
                width={1400}
                height={880}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent px-6 py-6 pt-20">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  Systems, not experiments
                </p>
                <p className="mt-1 max-w-prose text-sm leading-snug text-slate-200">
                  Membership is designed to move you up this ladder — with live builds, recordings, and peer
                  momentum.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative px-6 py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Most recruiters are stuck at &quot;prompt level&quot;
          </h2>
          <ul className="mt-8 space-y-4 border-l-2 border-blue-200 pl-6 text-slate-600 text-lg leading-relaxed">
            <li>Using ChatGPT for simple tasks — no real productivity gains</li>
            <li>Still sourcing manually on LinkedIn</li>
            <li>Personalization does not scale</li>
            <li>No repeatable system across the team</li>
            <li>AI feels powerful — but messy and inconsistent</li>
          </ul>
          <p className="mt-10 text-xl font-medium text-slate-900 md:text-2xl">
            The gap is not tools. <span className="text-blue-600">It is systems.</span>
          </p>
        </motion.div>
      </section>

      {/* Full-bleed ladder */}
      <section
        id="ladder"
        className="scroll-mt-24 border-y border-slate-200 bg-white px-6 py-20 md:py-28"
      >
        <motion.div {...fadeUp} className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                The maturity model
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Where are you on the adoption ladder?
              </h2>
            </div>
            <Link
              href="#workshops"
              onClick={() => trackMembershipNav("workshops")}
              className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors md:self-auto"
            >
              Skip to workshop curriculum
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-500" aria-hidden />
              Included in your membership journey
            </div>
            <Image
              src={ADOPTION_LADDER_SRC}
              alt="AI adoption maturity ladder in detail"
              width={1400}
              height={880}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="px-6 py-20 md:py-24 bg-slate-50">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-12 md:py-12 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            This membership turns AI into a recruiting engine
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Every month, you do not just learn AI — you implement it in your recruiting practice. We break down
            real workflows used in recruiting teams and show you how to build them step by step.
          </p>
        </motion.div>
      </section>

      {/* Workshops */}
      <section id="workshops" className="scroll-mt-20 px-6 py-20 md:py-28 bg-white">
        <motion.div {...fadeUp} className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-blue-600">Curriculum</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Workshops you&apos;ll attend
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              High-impact sessions designed for immediate implementation — one outcome per session.
            </p>
          </div>
          
          <p className="font-semibold uppercase tracking-wider text-slate-900 text-sm mb-6">Core workshops</p>
          <div className="grid gap-6 md:grid-cols-2">
            {coreWorkshops.map((w, i) => (
              <motion.article
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-4">
                  {i + 1}
                </span>
                <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
                  {w.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{w.body}</p>
              </motion.article>
            ))}
          </div>
          
          <div className="mt-16 border-t border-slate-200 pt-12">
            <p className="font-semibold uppercase tracking-wider text-slate-900 text-sm mb-6">
              Additional deep-dive sessions (examples)
            </p>
            <ul className="columns-1 gap-x-12 text-slate-600 sm:columns-2">
              {deepDives.map((t) => (
                <li key={t} className="relative mb-4 break-inside-avoid pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-blue-500">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* What you get */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What you get
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl md:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <h3 className="relative text-xl font-bold text-white md:text-2xl">
              Exclusive course: First Principles in Talent Sourcing
            </h3>
            <p className="relative mt-4 max-w-2xl text-slate-300 leading-relaxed">
              Our flagship course — not available as a generic download. Built from 100+ sourcing webinars
              (2022–2024) and refined with 2,500+ HR professionals. Most recruiters learn tools; this teaches you how
              to think. AI amplifies your sourcing — but only if your fundamentals are correct.
            </p>
            <p className="relative mt-6 text-sm font-semibold text-blue-400">
              Non-member price from €490 — <span className="text-white">included with membership</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Outcomes + How */}
      <section className="px-6 py-20 md:py-28 bg-white">
        <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What you&apos;ll be able to do
            </h2>
            <ul className="mt-8 space-y-5">
              {[
                "Build talent pools outside LinkedIn",
                "Automate candidate research and enrichment",
                "Personalize outreach at scale",
                "Identify hiring signals before roles go public",
                "Create repeatable sourcing systems for your team",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-slate-700"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span className="leading-relaxed text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              How it works
            </h2>
            <ol className="mt-8 space-y-6">
              {["Join the membership", "Attend live workshops or watch recordings", "Implement workflows in your own recruiting process"].map(
                (step, i) => (
                  <li key={step} className="flex gap-5 items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="pt-2 font-medium text-lg leading-snug text-slate-800">{step}</span>
                  </li>
                )
              )}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 md:py-28">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-8 py-12 text-center shadow-xl md:px-10 md:py-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,99,235,0.05),transparent_50%)]" />
          <p className="relative text-xs font-semibold uppercase tracking-widest text-blue-600">Annual only</p>
          <h2 className="relative mt-3 text-2xl font-bold text-slate-900 md:text-3xl">AI Recruiting Systems membership</h2>
          <p className="relative mt-6 text-5xl font-bold text-slate-900 md:text-6xl">€890</p>
          <p className="relative mt-2 text-sm text-slate-500">per year · prepaid</p>
          <ul className="relative mx-auto mt-8 max-w-sm space-y-3 text-left text-slate-700">
            <li className="flex gap-3 items-start">
              <span className="text-blue-500 font-bold">✓</span> <span>Full access to all live workshops (12+ per year)</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-500 font-bold">✓</span> <span>Full recording library</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-500 font-bold">✓</span> <span>Workgroup access (ongoing Q&amp;A and support)</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-500 font-bold">✓</span> <span>Templates &amp; systems library</span>
            </li>
          </ul>
          <p className="relative mt-8 text-sm text-slate-500">
            Best for recruiters who want to build real systems, not experiment occasionally.
          </p>
          <div className="relative mt-8 flex justify-center">
            <MembershipCheckoutButton className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !shadow-lg !shadow-blue-600/20" />
          </div>
        </motion.div>
      </section>

      {/* Positioning */}
      <section className="px-6 py-20 md:py-24 bg-white">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Built for recruiters who want an edge
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 md:gap-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Not for
              </p>
              <ul className="mt-5 space-y-3 text-slate-600">
                <li className="flex gap-2 items-center"><span className="text-slate-400">✕</span> People looking for generic AI tips</li>
                <li className="flex gap-2 items-center"><span className="text-slate-400">✕</span> Recruiters who will not implement</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                For
              </p>
              <ul className="mt-5 space-y-3 text-slate-900 font-medium">
                <li className="flex gap-2 items-center"><span className="text-blue-500">✓</span> Agency recruiters</li>
                <li className="flex gap-2 items-center"><span className="text-blue-500">✓</span> Talent leaders</li>
                <li className="flex gap-2 items-center"><span className="text-blue-500">✓</span> Operators who want systems, not hacks</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Who we are
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">About Michal</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Michal is an ex-CTO turned recruiting and AI systems expert at the intersection of technology and talent
            acquisition. He has worked with 30+ clients across the US, UK, EU, and UAE; placed 100+ highly specialized
            candidates; delivered 100+ sourcing webinars; and trained 50,000+ HR and IT professionals through platforms
            like Udemy and Tech Recruitment Academy. He builds and implements real recruiting systems — and shows you
            how to do the same.
          </p>
          <div className="mt-8 flex justify-center">
            <MichalProfileLearnMoreLink />
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 md:py-28 bg-white">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl text-center mb-12">FAQ</h2>
          <dl className="space-y-8">
            {[
              {
                q: "Do I need technical skills?",
                a: "No. We show practical setups step by step.",
              },
              {
                q: "Are tools included?",
                a: "No, but we use accessible tools like n8n, Make, and AI APIs.",
              },
              {
                q: "Is this a subscription?",
                a: "You pay annually upfront (one payment). Your access runs for 12 months from the start date shown in Billing after purchase. You can renew for another year when your term ends.",
              },
              {
                q: "Will this work for my niche?",
                a: "Yes — principles apply across industries.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                <dt className="font-bold text-slate-900 text-lg">{q}</dt>
                <dd className="mt-2 text-slate-600 leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-center text-white md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(37,99,235,0.15),transparent)]" />
        <motion.div {...fadeUp} className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Stop experimenting. Start building recruiting systems.
          </h2>
          <p className="mt-6 text-lg text-slate-300">
            One annual payment · full workshop &amp; course access · member community
          </p>
          <div className="mt-10 flex justify-center">
            <MembershipCheckoutButton
              className="!bg-blue-600 hover:!bg-blue-500 !text-white !shadow-xl !shadow-blue-600/30 px-8 py-4 text-lg"
              label="Join membership"
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
