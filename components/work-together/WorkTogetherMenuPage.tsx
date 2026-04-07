"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import WorkTogetherServiceAccordions from "@/components/work-together/WorkTogetherServiceAccordions";
import { getWorkTogetherNavMenuServices } from "@/lib/work-together-services";

const services = getWorkTogetherNavMenuServices();

export default function WorkTogetherMenuPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-100/40 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-[10%] left-[20%] w-[70%] h-[70%] rounded-full bg-emerald-100/30 blur-3xl"
        />
      </div>

      <div className="relative z-10">
        <section className="pt-28 pb-16 px-6 border-b border-slate-200/50 bg-white/40 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-blue-600 text-sm font-semibold tracking-widest uppercase"
            >
              Work together
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-4 text-3xl md:text-4xl font-bold text-slate-900"
            >
              Ways we can work together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed"
            >
              Mentoring, private workshops, advisory, and implementation packages. Open any row for
              details — pricing stays visible. Prefer a single form?{" "}
              <Link href="/contact" className="text-blue-600 font-medium hover:underline">
                Contact
              </Link>
              .
            </motion.p>
          </div>
        </section>

        <section className="py-12 md:py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <WorkTogetherServiceAccordions services={services} />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 md:mt-24 max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-slate-200/50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-5">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Not sure which option is right for you?
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
                Tell me a bit about your team and your goals, and I'll get back to you with a tailored proposal and recommendations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-blue-600/20 group"
              >
                Get in touch
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
