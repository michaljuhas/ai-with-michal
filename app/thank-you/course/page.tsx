"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/lib/courses";
import type { CoursePriceTier } from "@/lib/courses";
import posthog from "posthog-js";

function CourseThankYouContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course_slug") ?? "";
  const sessionId = searchParams.get("session_id") ?? "";
  const tier = (searchParams.get("tier") ?? "basic") as CoursePriceTier;

  const course = getCourseBySlug(courseSlug);
  const ticketOption = course?.ticketOptions.find((o) => o.id === tier);

  useEffect(() => {
    if (!sessionId) return;
    posthog.capture("course_purchased", {
      $insert_id: `course_purchase_${sessionId}`,
      course_slug: courseSlug,
      tier,
      stripe_session_id: sessionId,
    });
  }, [sessionId, courseSlug, tier]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Success header */}
        <motion.div
          className="text-center mb-10"
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
          <h1 className="text-3xl font-bold text-slate-900">
            You&apos;re enrolled!
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            {course.title}
          </p>
        </motion.div>

        {/* What's included */}
        {ticketOption && (
          <motion.div
            className="bg-white border border-slate-200 rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Your package — {ticketOption.name}
            </p>
            <ul className="space-y-3">
              {ticketOption.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Next step: book calls */}
        {course.schedulingUrl && (
          <motion.div
            className="bg-blue-600 rounded-2xl p-7 text-white text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Calendar size={28} className="mx-auto mb-4 text-blue-200" />
            <h2 className="text-xl font-bold mb-2">Book your 1-on-1 calls</h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Your enrollment includes {course.sessionsIncluded ?? 2}×{" "}
              {course.sessionDurationMinutes ?? 30}-minute sessions with Michal.
              Schedule them now while your motivation is high.
            </p>
            <a
              href={course.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                posthog.capture("course_call_booking_clicked", {
                  course_slug: courseSlug,
                  tier,
                })
              }
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Book your calls now
              <ArrowRight size={16} />
            </a>
          </motion.div>
        )}

        {/* Email note */}
        <motion.p
          className="text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          A confirmation email has been sent to you with all the details.
        </motion.p>
      </div>
    </div>
  );
}

export default function CourseThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <CourseThankYouContent />
    </Suspense>
  );
}
