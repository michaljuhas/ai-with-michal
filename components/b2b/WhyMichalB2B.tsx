"use client";

import { motion } from "framer-motion";
import { Star, Globe2, Youtube, GraduationCap, Video, Building2 } from "lucide-react";
import Image from "next/image";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";

const stats = [
  { icon: Building2, value: "20+", label: "Companies Trained (US, UK, EU)", iconColor: "text-blue-500" },
  { icon: Star, value: "190+", label: "Trustpilot Reviews", iconColor: "text-yellow-500" },
  { icon: Video, value: "100+", label: "Webinars & Sessions", iconColor: "text-teal-500" },
  { icon: GraduationCap, value: "50k+", label: "Course Students Globally", iconColor: "text-violet-500" },
  { icon: Youtube, value: "1M+", label: "YouTube Views", iconColor: "text-red-500" },
  { icon: Globe2, value: "3 Regions", label: "US · UK · EU Clients", iconColor: "text-orange-500" },
];

export default function WhyMichalB2B() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Why Michal?
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Real workshops. Real results.
          </h2>
        </motion.div>

        <motion.div
          className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src="/Michal-Juhas-headshot-square-v1.jpg"
                  alt="Michal Juhas"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-slate-900 text-2xl font-bold mb-1">Michal Juhas</h3>
              <p className="text-blue-600 text-sm font-medium mb-5">
                AI Recruiting &amp; Automation Expert
              </p>
              <p className="text-slate-600 leading-relaxed mb-3">
                I&apos;ve run hands-on AI workshops and consulting engagements for 20+ companies
                across the US, UK, and EU — from fast-growing recruiting agencies and TA teams
                to marketing and sales orgs looking to rethink how they work.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                My sessions are practical, not theoretical. Teams leave with working workflows,
                real tools, and the confidence to keep building. No fluff, no generic AI hype —
                just concrete automation strategies tailored to your team&apos;s function and
                current skill level.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-5 border-t border-slate-100">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="flex items-center gap-2.5"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                    >
                      <Icon size={15} className={`shrink-0 ${stat.iconColor}`} />
                      <div>
                        <p className="text-slate-900 font-bold text-sm leading-tight">{stat.value}</p>
                        <p className="text-slate-400 text-xs leading-tight">{stat.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <MichalProfileLearnMoreLink className="mt-6" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
