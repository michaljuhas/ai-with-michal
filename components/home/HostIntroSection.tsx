"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WORKSHOP } from "@/lib/workshop";

export default function HostIntroSection() {
  return (
    <section className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start"
          >
            <Image
              src="/Michal profile - faded.png"
              alt="Michal Juhas"
              width={460}
              height={460}
              className="w-full max-w-sm md:max-w-none"
              priority
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-4">
              Your Host
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
              I&apos;m Michal and I help recruiters automate their most boring tasks with AI.
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              I&apos;ve trained thousands of talent acquisition professionals during my online
              workshops. The next one focuses on{" "}
              <strong className="text-slate-800">{WORKSHOP.title}</strong> — and here&apos;s
              more info:
            </p>

            {/* Workshop info card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
                Next Live Workshop
              </p>
              <p className="font-bold text-slate-900 text-lg leading-snug mb-2">
                {WORKSHOP.title}
              </p>
              <p className="text-sm text-slate-500">
                {WORKSHOP.displayDate} &middot; {WORKSHOP.displayTime}
              </p>
            </div>

            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Interested? Keep reading↓
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
