"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORK_TOGETHER_SERVICES } from "@/lib/work-together-services";
import WorkTogetherServiceAccordions from "@/components/work-together/WorkTogetherServiceAccordions";

export default function WorkTogetherSection() {
  return (
    <section id="work-together" className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Work together
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            What we offer
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            A concise menu for teams and leaders. Expand a row for detail — pricing stays visible.{" "}
            <Link href="/work-together" className="text-blue-600 font-medium hover:underline">
              Open full Work Together page
            </Link>
            .
          </p>
        </motion.div>

        <WorkTogetherServiceAccordions services={WORK_TOGETHER_SERVICES} />
      </div>
    </section>
  );
}
