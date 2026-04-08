"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, ExternalLink, Copy, Share2 } from "lucide-react";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";
import {
  CURRENT_WORKSHOP_SLUG,
  getPublicWorkshopBySlug,
  getWorkshopCalendarEvent,
  getTimezoneConverterUrl,
} from "@/lib/workshops";
import WorkshopAddToCalendar from "@/components/WorkshopAddToCalendar";
import posthog from "posthog-js";

const WORKSHOP_URL = "https://aiwithmichal.com";

function ShareButtons() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(WORKSHOP_URL).then(() => {
      setCopied(true);
      posthog.capture("referral_link_copied");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(WORKSHOP_URL)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent("Join me at this AI recruiting workshop")}&body=${encodeURIComponent(`Hey, I just signed up for this workshop on building AI talent pools outside LinkedIn. Thought you might find it useful: ${WORKSHOP_URL}`)}`;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => posthog.capture("referral_shared", { channel: "linkedin" })}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
      >
        <Share2 size={14} />
        Share on LinkedIn
      </a>
      <a
        href={emailUrl}
        onClick={() => posthog.capture("referral_shared", { channel: "email" })}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
      >
        <ExternalLink size={14} />
        Send via Email
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
      >
        <Copy size={14} />
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const workshopSlugParam = searchParams.get("workshop_slug") ?? "";
  const publicWorkshop =
    getPublicWorkshopBySlug(workshopSlugParam) ??
    getPublicWorkshopBySlug(CURRENT_WORKSHOP_SLUG)!;
  const calendarEvent = getWorkshopCalendarEvent(publicWorkshop.slug)!;
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);

  useEffect(() => {
    const slug = publicWorkshop.slug;
    const stripeQ =
      sessionId && sessionId.length > 0
        ? `&session_id=${encodeURIComponent(sessionId)}`
        : "";
    fetch(`/api/meeting-url?workshopSlug=${encodeURIComponent(slug)}${stripeQ}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((d) => setMeetingUrl(d?.url ?? null))
      .catch(() => {});
  }, [publicWorkshop.slug, sessionId]);

  useEffect(() => {
    // Client-side payment tracking: fires when the user lands on this page.
    // Uses the same $insert_id as the server-side webhook event so PostHog
    // deduplicates if both paths succeed.
    if (sessionId) {
      posthog.capture("payment_completed", {
        $insert_id: `purchase_${sessionId}`,
        stripe_session_id: sessionId,
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl" />
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
            You&apos;re in! See you at the workshop.
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            A confirmation email with your access details has been sent to your
            inbox.
          </p>
        </motion.div>

        {/* Workshop details */}
        <motion.div
          className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-slate-900 font-semibold text-lg mb-5">
            Workshop Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-slate-900 font-medium">{publicWorkshop.displayDate}</p>
                <p className="text-slate-500 text-sm">{publicWorkshop.displayTime}</p>
                <a
                  href={getTimezoneConverterUrl(publicWorkshop.date)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Check your local time
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="text-sm">
              <span className="text-slate-700 font-medium">Location: </span>
              {meetingUrl ? (
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {meetingUrl}
                </a>
              ) : (
                <span className="text-slate-500">{publicWorkshop.location}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Add to Calendar — same instants as PUBLIC_WORKSHOPS (see getWorkshopCalendarEvent) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <WorkshopAddToCalendar
            event={calendarEvent}
            variant="card"
            source="thank_you"
            workshopSlug={publicWorkshop.slug}
            icsFilename={`workshop-${publicWorkshop.slug}.ics`}
            fetchMeetingUrl={false}
            sharedMeetingUrl={meetingUrl}
          />
        </motion.div>

        {/* Share / refer a colleague */}
        <motion.div
          className="mt-6 bg-blue-600 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-blue-100 text-xs font-semibold tracking-widest uppercase mb-2">
            Know a recruiter who&apos;d love this?
          </p>
          <h2 className="text-white font-bold text-xl mb-3">
            Share the workshop with a colleague
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            Forward this link — early registrants get the best price before it fills up.
          </p>
          <ShareButtons />
        </motion.div>

        {!sessionId && (
          <motion.p
            className="mt-6 text-center text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            If you have any questions, contact us at{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {PUBLIC_CONTACT_EMAIL}
            </a>
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default function ThankYouPage() {
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
