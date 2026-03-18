"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";
import RegisterButton from "@/components/RegisterButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/60 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-700 mb-6 border border-blue-200 rounded-full px-4 py-1.5 bg-blue-50">
                Live Workshop · 90 Minutes
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Find Top Talent{" "}
              <span className="text-blue-600">Before Anyone Else Does</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-slate-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The best recruiters aren&apos;t just searching harder — they&apos;re
              searching smarter. In this hands-on workshop, I&apos;ll show you how
              to <b>use AI to discover amazing candidates</b> that your competition
              will never find.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RegisterButton />
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock size={14} />
                <span>90 minutes · Hands-on · No coding needed</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/seminar-belgrade-1.jpg"
              alt="Michal Juhas presenting at a live workshop"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
