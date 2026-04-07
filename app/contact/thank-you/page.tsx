"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/config";
import posthog from "posthog-js";

export default function ContactThankYouPage() {
  useEffect(() => {
    posthog.capture("contact_thank_you_viewed");
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-5">
            <CheckCircle2 className="text-green-600" size={28} />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">Step 1</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Thanks — received</h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            I&apos;ll reply within one business day. When you&apos;re ready, lock in a time with me directly.
          </p>

          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">Step 2</p>
          <a
            href={SITE.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[240px] bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20"
            onClick={() =>
              posthog.capture("contact_booking_link_clicked", { source: "contact_thank_you" })
            }
          >
            <CalendarDays size={18} />
            Book a call with Michal
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="mt-8 text-sm text-slate-500">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
