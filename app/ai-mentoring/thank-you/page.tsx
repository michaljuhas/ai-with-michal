"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CalendarCheck,
  Users,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { PUBLIC_CONTACT_EMAIL, SITE } from "@/lib/config";
import posthog from "posthog-js";

const nextSteps = [
  {
    icon: Users,
    title: "Join the private group",
    description:
      "You'll receive an invite to our dedicated mentoring group within 24 hours.",
  },
  {
    icon: CalendarCheck,
    title: "Weekly implementation calls",
    description:
      "Calendar invites for the upcoming calls will land in your inbox shortly.",
  },
  {
    icon: MessageCircle,
    title: "Your first 1-on-1",
    description:
      "We'll schedule your first personal session after the onboarding call.",
  },
];

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      posthog.capture("mentoring_payment_completed", {
        $insert_id: `mentoring_purchase_${sessionId}`,
        stripe_session_id: sessionId,
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Success header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={32} />
            </div>
          </div>
          <span className="text-emerald-600 text-xs font-semibold tracking-widest uppercase">
            Payment Confirmed
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Welcome to the inner circle!
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            Your mentoring subscription is active. Let&apos;s get you set up.
          </p>
        </motion.div>

        {/* Book onboarding call */}
        <motion.div
          className="bg-violet-600 rounded-2xl p-8 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CalendarCheck size={28} className="text-violet-200 mx-auto mb-3" />
          <h2 className="text-white font-bold text-xl mb-2">
            Book your onboarding call
          </h2>
          <p className="text-violet-100 text-sm mb-6 max-w-md mx-auto">
            Book a free onboarding call where we&apos;ll walk you through
            everything and get you set up.
          </p>
          <a
            href={SITE.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              posthog.capture("mentoring_onboarding_call_booked")
            }
            className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold px-6 py-3.5 rounded-xl transition-colors group"
          >
            Book a call
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>

        {/* What happens next */}
        <motion.div
          className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="text-slate-900 font-semibold text-lg mb-6">
            What happens next
          </h2>
          <div className="space-y-5">
            {nextSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-medium text-sm">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.p
          className="text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Questions? Reach out at{" "}
          <a
            href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
            className="text-violet-600 hover:underline"
          >
            {PUBLIC_CONTACT_EMAIL}
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default function MentoringThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
