"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function GuaranteeSection() {
  return (
    <section className="py-16 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-white border border-emerald-200 rounded-2xl p-10 text-center shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={28} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Try It Risk-Free
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            Attend the workshop. If you don&apos;t like it, just send me a
            message and I&apos;ll refund you — no awkward questions, no forms
            to fill.
          </p>
          <p className="text-emerald-700 font-semibold text-lg mb-2">
            Your investment is protected.
          </p>
          <p className="text-slate-500 text-sm">
            Refund policy applies to attendees only. If you miss the workshop, the ticket is non-refundable.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
