"use client";

import { motion } from "framer-motion";
import { CheckCircle, Star, Calendar, Users } from "lucide-react";
import { WORKSHOP } from "@/lib/workshop";
import RegisterButton from "@/components/RegisterButton";
import { useEffect, useState } from "react";

const plans = [
  {
    name: "Workshop Ticket",
    price: 79,
    includes: [
      "Members-area pre-training",
      "Live 90-minute workshop",
      "Live Q&A with Michal",
    ],
    recommended: false,
    cta: "Get My Ticket",
  },
  {
    name: "Workshop + Toolkit",
    price: 129,
    includes: [
      "Everything in Workshop Ticket",
      "Full recording — rewatch forever",
      "Private work group access",
      "Bonus workflow examples and notes",
      "Extra recruiting automation resources",
    ],
    recommended: true,
    cta: "Get Workshop + Toolkit",
  },
];

export default function PricingSection() {
  const [soldCount, setSoldCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/count")
      .then((r) => r.json())
      .then((d) => setSoldCount(d.count ?? null))
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Simple Pricing
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Choose What Works for You
          </h2>
          <p className="mt-4 text-slate-500 text-lg">
            One-time payment. No subscription. No hidden fees.
          </p>
        </motion.div>

        {/* Social proof */}
        {soldCount !== null && soldCount > 0 && (
          <motion.div
            className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Users size={15} className="text-blue-500" />
            <span>
              <strong className="text-slate-700">{soldCount}</strong> people already registered
            </span>
          </motion.div>
        )}

        {/* Date & time banner */}
        <motion.div
          className="flex items-center justify-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Calendar size={20} className="text-blue-600 shrink-0" />
          <div className="text-center">
            <p className="text-slate-900 font-bold">{WORKSHOP.displayDate}</p>
            <p className="text-slate-500 text-sm">{WORKSHOP.displayTime}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.recommended
                  ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/25"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    <Star size={11} fill="currentColor" />
                    Best Value
                  </span>
                </div>
              )}

              <h3 className={`font-bold text-xl mb-2 ${plan.recommended ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-extrabold ${plan.recommended ? "text-white" : "text-slate-900"}`}>
                  €{plan.price}
                </span>
                <span className={`text-sm ${plan.recommended ? "text-blue-200" : "text-slate-400"}`}>
                  one-time
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.includes.map((item) => (
                  <li key={item} className={`flex items-center gap-2.5 text-sm ${plan.recommended ? "text-blue-100" : "text-slate-600"}`}>
                    <CheckCircle size={16} className={plan.recommended ? "text-white shrink-0" : "text-blue-600 shrink-0"} />
                    {item}
                  </li>
                ))}
              </ul>

              <RegisterButton
                label={plan.cta}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all group ${
                  plan.recommended
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
                disabledClassName="flex items-center justify-center w-full py-3.5 rounded-xl font-semibold text-sm bg-slate-200 text-slate-400 cursor-not-allowed"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
