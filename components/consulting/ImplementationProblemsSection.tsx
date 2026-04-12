"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import posthog from "posthog-js";
import { IMPLEMENTATION_PROBLEMS_PACKAGES } from "@/lib/implementation-problems";

function goContact(serviceId: string) {
  posthog.capture("b2b_card_cta_clicked", {
    page: "consulting_implementation",
    destination: "/contact",
    service_id: serviceId,
  });
}

export default function ImplementationProblemsSection() {
  return (
    <section className="mt-8 pt-6 border-t border-slate-200/60">
      <h2 className="text-lg font-bold text-slate-900 md:text-xl mb-2">Problems we solve</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-2xl">
        Pick the outcome that matches your bottleneck. Tell us your context on the contact form — we
        will confirm scope and book a call to go deeper.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {IMPLEMENTATION_PROBLEMS_PACKAGES.map((pkg, i) => {
          const Icon = pkg.icon;
          const href = `/contact?service=${encodeURIComponent(pkg.contactServiceId)}`;
          return (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${pkg.iconBg}`}>
                <Icon size={20} className={pkg.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{pkg.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">{pkg.description}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400 font-medium mr-0.5">Ideal for:</span>
                  {pkg.idealFor.map((label) => (
                    <span
                      key={label}
                      className="text-[10px] bg-white text-slate-600 font-medium px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={href}
                onClick={() => goContact(pkg.contactServiceId)}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors group"
              >
                Get in touch
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
