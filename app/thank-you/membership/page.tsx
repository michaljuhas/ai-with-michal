"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

function MembershipThankYouInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  useEffect(() => {
    if (!sessionId) return;
    posthog.capture("membership_purchased", {
      $insert_id: `membership_${sessionId}`,
      stripe_session_id: sessionId,
    });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Payment confirmed
          </p>
          <h1 className="text-3xl font-bold text-slate-900">You&apos;re in</h1>
          <p className="mt-3 text-slate-600 text-lg leading-relaxed">
            Your annual AI Recruiting Systems membership is active. Open the member hub for workshops,
            recordings, workgroups, and your included First Principles course.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <Link
            href="/members"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Go to member hub
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Billing
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function MembershipThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading…
        </div>
      }
    >
      <MembershipThankYouInner />
    </Suspense>
  );
}
