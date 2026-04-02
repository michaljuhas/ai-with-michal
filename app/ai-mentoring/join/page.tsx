"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { MENTORING_OPTIONS, MentoringTier } from "@/lib/stripe";
import CredibilityBadges from "@/components/CredibilityBadges";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function fireMetaEvent(event_name: string, event_id?: string) {
  fetch("/api/meta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name,
      event_source_url: window.location.href,
      fbc: getCookie("_fbc"),
      fbp: getCookie("_fbp"),
      ...(event_id ? { event_id } : {}),
    }),
  }).catch(() => {});
}

export default function MentoringJoinPage() {
  const [loading, setLoading] = useState<MentoringTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  async function handleCheckout(tier: MentoringTier) {
    if (!user) {
      posthog.capture("mentoring_checkout_attempted_unauthenticated", { tier });
      const product = encodeURIComponent(`mentoring:${tier}`);
      window.location.assign(
        `/register?redirect_url=${encodeURIComponent("/ai-mentoring/join")}&product=${product}`
      );
      return;
    }

    fetch("/api/registrations/interested-in", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: `mentoring:${tier}` }),
    }).catch(() => {});

    setLoading(tier);
    setError(null);
    const option = MENTORING_OPTIONS.find((o) => o.id === tier);
    posthog.capture("mentoring_checkout_initiated", {
      tier,
      price: option?.price,
      name: option?.name,
    });
    fireMetaEvent("AddToCart");

    try {
      const res = await fetch("/api/mentoring-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, cancelUrl: "/ai-mentoring/join" }),
      });

      const data = await res.json();

      if (res.status === 401) {
        posthog.capture("mentoring_checkout_error", {
          tier,
          reason: "unauthorized",
        });
        const product = encodeURIComponent(`mentoring:${tier}`);
        window.location.assign(
          `/register?redirect_url=${encodeURIComponent("/ai-mentoring/join")}&product=${product}`
        );
        return;
      }

      if (data.url) {
        window.location.assign(data.url);
      } else {
        posthog.capture("mentoring_checkout_error", {
          tier,
          reason: "no_url",
        });
        setError("Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch (err) {
      posthog.captureException(err);
      posthog.capture("mentoring_checkout_error", {
        tier,
        reason: "network_error",
      });
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-violet-600 text-xs font-semibold tracking-widest uppercase">
            AI Mentoring
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Choose Your Mentoring Plan
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Join our inner circle and accelerate your AI adoption with personal
            guidance.
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {MENTORING_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              className={`relative rounded-2xl border p-8 ${
                option.recommended
                  ? "bg-violet-600 border-violet-600 shadow-2xl shadow-violet-500/25"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {option.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    <Star size={11} fill="currentColor" />
                    Recommended
                  </span>
                </div>
              )}

              <h2
                className={`font-bold text-xl mb-2 ${
                  option.recommended ? "text-white" : "text-slate-900"
                }`}
              >
                {option.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span
                  className={`text-4xl font-extrabold ${
                    option.recommended ? "text-white" : "text-slate-900"
                  }`}
                >
                  €{option.price}
                </span>
                <span
                  className={`text-sm ${
                    option.recommended ? "text-violet-200" : "text-slate-400"
                  }`}
                >
                  /month
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {option.includes.map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2.5 text-sm ${
                      option.recommended
                        ? "text-violet-100"
                        : "text-slate-600"
                    }`}
                  >
                    <CheckCircle
                      size={16}
                      className={`shrink-0 ${
                        option.recommended
                          ? "text-white"
                          : "text-violet-600"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(option.id)}
                disabled={loading !== null}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-all group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                  option.recommended
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {loading === option.id ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Get {option.name}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            <strong className="text-emerald-700">Cancel anytime.</strong> No
            lock-in, no questions asked. If it&apos;s not the right fit, cancel
            your subscription whenever you want.
          </p>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <CredibilityBadges />
        </motion.div>

        <motion.p
          className="mt-6 text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Secure checkout powered by Stripe · Tax included in price
        </motion.p>
      </div>
    </div>
  );
}
