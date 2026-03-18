"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users } from "lucide-react";
import RegisterButton from "@/components/RegisterButton";

export default function FinalCTA() {
  return (
    <section className="relative py-24 px-6 bg-slate-900 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Michal profile photo — faded at the bottom */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Image
              src="/Michal profile - faded.png"
              alt="Michal Juhas"
              width={500}
              height={600}
              className="w-full max-w-sm mx-auto h-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-widest uppercase">
              Don&apos;t Get Left Behind
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Competition Is Already Using AI. Are You?
            </h2>
            <p className="text-slate-400 text-xl mb-4">
              Recruiting is changing fast. The ones who adapt now will have
              the biggest advantage.
            </p>
            <p className="text-slate-300 text-lg mb-10">
              Join me for 90 minutes and walk away with a system that puts you
              ahead of 95% of recruiters.
            </p>

            <div className="flex flex-col items-center lg:items-start gap-4">
              <RegisterButton
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl transition-all duration-200 text-lg group shadow-2xl shadow-blue-600/30 whitespace-nowrap"
                disabledClassName="inline-flex items-center gap-2 bg-slate-600 text-slate-400 font-bold px-10 py-5 rounded-xl text-lg cursor-not-allowed whitespace-nowrap"
              />
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Users size={14} />
                <span>Limited seats for the live session.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
