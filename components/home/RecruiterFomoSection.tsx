"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const desktopScreenshots = [
  "/linkedin-screenshots/big-patrick-burke.jpeg",
  "/linkedin-screenshots/big-sarah-chan.jpeg",
  "/linkedin-screenshots/big-thomas-bueler.jpeg",
];

const mobileScreenshots = [
  "/linkedin-screenshots/small-chris-lowe.jpeg",
  "/linkedin-screenshots/small-jamie-jay-lions.jpeg",
  "/linkedin-screenshots/small-preston-1.jpeg",
];

const workshopPerks = [
  "See what high-leverage recruiting with AI actually looks like",
  "Build practical workflows live with Michal and other recruiters",
  "Leave with templates, examples, and a clearer path forward",
];

export default function RecruiterFomoSection() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            AI In Recruiting
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Plenty of recruiters already use Claude Code and AI workflows. Are you?
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            The uncomfortable truth is that AI is already becoming part of recruiter
            performance. If you still treat it like an optional extra, you are giving
            faster recruiters an advantage over you every week.
          </p>
          <p className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold leading-relaxed text-slate-900 shadow-sm">
            Teams are not just rewarding recruiters who use AI well. They are steadily
            making manual recruiters easier to ignore, easier to outperform, and easier to replace.
          </p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-3 gap-5 mb-10">
          {desktopScreenshots.map((src, index) => (
            <motion.div
              key={src}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Image
                src={src}
                alt="LinkedIn post about recruiters adopting AI tools"
                width={900}
                height={1400}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:hidden mb-10">
          {mobileScreenshots.map((src, index) => (
            <motion.div
              key={src}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Image
                src={src}
                alt="LinkedIn post about recruiters adopting AI tools"
                width={700}
                height={1200}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center rounded-3xl border border-blue-100 bg-white p-6 md:p-8 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <Image
              src="/Zoom-Video-Meeting.jpg"
              alt="Live Zoom workshop with recruiters attending"
              width={1400}
              height={900}
              className="w-full h-auto object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              To stay relevant in the job market and increase your productivity, join our upcoming workshop: AI in recruiting and talent acquisition.
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Start with pre-training in the members area, then join the live session
              to see how recruiters use Claude Code and workflow automation to handle
              sourcing, screening, reporting, and repetitive execution faster. After
              the workshop, you will know what good looks like and how to start applying it.
            </p>
            <div className="mt-6 space-y-3">
              {workshopPerks.map((perk) => (
                <div key={perk} className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-700">
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
