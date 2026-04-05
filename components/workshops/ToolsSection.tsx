"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const tools = [
  { name: "Cursor", logo: "/logos/cursor.png" },
  { name: "ContactOut", logo: "/logos/contactout.ico" },
  { name: "Apollo", logo: "/logos/apollo.png" },
  { name: "Google Sheets", logo: "/logos/sheets.ico" },
  { name: "Make.com", logo: "/logos/make.ico" },
  { name: "OpenAI GPT", logo: "/logos/openai.png" },
  { name: "Gemini", logo: "/logos/gemini.png" },
  { name: "Claude", logo: "/logos/claude.ico" },
];

export default function ToolsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Real Tools, Real Results
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            You&apos;ll Learn to Connect Tools Into a System
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
            No need to be technical. I&apos;ll show you how these tools work
            together — and you&apos;ll set it up yourself during the workshop.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="flex flex-col items-center gap-3 bg-slate-50 rounded-xl py-6 px-4 hover:bg-slate-100 transition-colors"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Image
                src={tool.logo}
                alt={tool.name}
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="text-slate-700 text-sm font-medium text-center">
                {tool.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
