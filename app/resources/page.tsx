"use client";

import { motion } from "framer-motion";
import { Download, FileText, Calendar, Users } from "lucide-react";
import RegisterButton from "@/components/RegisterButton";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const resources = [
  {
    title: "Recruiting Prompts Guide",
    description:
      "A curated collection of AI prompts for every stage of the recruiting workflow — from writing job descriptions to screening candidates and crafting outreach messages.",
    file: "/recruiting-prompts-guide.pdf",
    filename: "recruiting-prompts-guide.pdf",
    tag: "Prompts",
  },
  {
    title: "Sourcing Tools Guide",
    description:
      "An overview of the most effective AI-powered sourcing tools available today, with practical tips on how to integrate them into your existing workflow.",
    file: "/sourcing-tools-guide.pdf",
    filename: "sourcing-tools-guide.pdf",
    tag: "Tools",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-16 pb-10 px-6 border-b border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-widest uppercase"
          >
            Free Resources
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5"
          >
            Guides for AI-Powered Recruiting
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            A selection of the resources we use in our workshops — free to
            download, no sign-up needed.
          </motion.p>
        </div>
      </section>

      {/* Resource cards */}
      <section className="pt-10 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {resources.map((resource, i) => (
              <motion.a
                key={resource.file}
                href={resource.file}
                download={resource.filename}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden"
              >
                {/* Card top */}
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-5 border-b border-slate-100">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                    {resource.tag}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 px-6 py-5 gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    <Download
                      size={15}
                      className="group-hover:-translate-y-0.5 transition-transform"
                    />
                    Download PDF
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Hint that more exists */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center text-sm text-slate-400"
          >
            Additional templates, checklists, and workflows are shared
            exclusively with workshop attendees.
          </motion.p>
        </div>
      </section>

      {/* Workshop CTA */}
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-widest uppercase">
              <Calendar size={12} />
              April 2nd · Live Workshop
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">
              Ready to put these into practice?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Join the live 90-minute workshop and build real AI workflows for
              recruiting — with hands-on practice and direct Q&amp;A.
            </p>

            <div className="flex flex-col items-center gap-4">
              <RegisterButton
                label="Get my ticket — from €79"
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
      </section>
    </main>
  );
}
