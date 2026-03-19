"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, ArrowRight, Loader2 } from "lucide-react";
import { TICKET_OPTIONS, PriceTier } from "@/lib/stripe";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

export default function TicketsPage() {
  const [loading, setLoading] = useState<PriceTier | null>(null);
  const { user } = useUser();

  useEffect(() => {
    posthog.capture("ticket_tier_viewed");
  }, []);

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    }
  }, [user]);

  async function handleCheckout(tier: PriceTier) {
    setLoading(tier);
    const option = TICKET_OPTIONS.find((o) => o.id === tier);
    posthog.capture("checkout_initiated", {
      tier,
      price: option?.price,
      name: option?.name,
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
        posthog.capture("checkout_error", { tier, reason: "no_url" });
        setLoading(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      posthog.captureException(err);
      posthog.capture("checkout_error", { tier, reason: "network_error" });
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
            Step 2 of 3
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Choose Your Ticket
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Select the option that works best for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TICKET_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              className={`relative rounded-2xl border p-8 ${
                option.recommended
                  ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/25"
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

              <h2 className={`font-bold text-xl mb-2 ${option.recommended ? "text-white" : "text-slate-900"}`}>
                {option.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-extrabold ${option.recommended ? "text-white" : "text-slate-900"}`}>
                  €{option.price}
                </span>
                <span className={`text-sm ${option.recommended ? "text-blue-200" : "text-slate-400"}`}>
                  one-time
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {option.includes.map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2.5 text-sm ${option.recommended ? "text-blue-100" : "text-slate-600"}`}
                  >
                    <CheckCircle size={16} className={`shrink-0 ${option.recommended ? "text-white" : "text-blue-600"}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(option.id)}
                disabled={loading !== null}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-all group disabled:opacity-70 disabled:cursor-not-allowed ${
                  option.recommended
                    ? "bg-white text-blue-600 hover:bg-blue-50"
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

        <motion.p
          className="mt-8 text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Secure checkout powered by Stripe · Full refund if not satisfied
        </motion.p>
      </div>
    </div>
  );
}
