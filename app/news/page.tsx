"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { NEWS_ARTICLES } from "@/lib/news";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsPage() {
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
            News
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5"
          >
            Latest from AI with Michal
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            New tools, skills, and resources to help you work smarter with AI.
          </motion.p>
        </div>
      </section>

      {/* Articles */}
      <section className="pt-10 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {NEWS_ARTICLES.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => {}}
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 px-6 py-5 gap-3">
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={12} aria-hidden />
                        {article.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} aria-hidden />
                        {formatDate(article.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
