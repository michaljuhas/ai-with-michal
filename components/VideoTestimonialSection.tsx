"use client";

import { motion } from "framer-motion";

export default function VideoTestimonialSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            What people say about Michal&apos;s training
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Deep expertise in both IT and recruiting, combined into a practical,
            high-quality training experience.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {/* Portrait (9:16) container — max 360px wide so it looks natural */}
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/Vf1JxldBjsQ?rel=0&modestbranding=1"
                title="Video testimonial — Michal's training"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
