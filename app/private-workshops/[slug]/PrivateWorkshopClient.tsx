"use client";

import { motion } from "framer-motion";
import { MonitorPlay, Sparkles, ClipboardList, Search, Map, Users, MessageSquareText } from "lucide-react";
import PrivateWorkshopCtas from "./PrivateWorkshopCtas";
import FlexibleDeliverySection from "@/components/private-workshops/FlexibleDeliverySection";

interface WorkshopData {
  title: string;
  body: string[];
  priceLabel: string;
  contactServiceId: string;
  slug: string;
}

export default function PrivateWorkshopClient({ workshop }: { workshop: WorkshopData }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative flex flex-col items-center justify-start md:justify-center pt-24 md:pt-20 pb-12 px-4 overflow-hidden">
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
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/60 blur-3xl"
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
          className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/50 blur-3xl"
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
          className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-violet-100/40 blur-3xl"
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            <MonitorPlay size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Sprint &amp; Private Workshop
          </p>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6">
          {workshop.title}
        </h1>

        <div className="space-y-4 text-slate-600 leading-relaxed">
          {workshop.body.map((para, idx) => (
            <p key={idx} className="text-sm md:text-base">
              {para}
            </p>
          ))}
        </div>

        {/* Sprint breakdown */}
        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            What&apos;s included in a sprint
          </p>
          <ol className="space-y-3">
            {[
              { icon: ClipboardList, label: "Questionnaire & management brief", desc: "You fill in a structured brief so I arrive with full context on your team, challenges, and goals." },
              { icon: Search,        label: "My preparation",                  desc: "I research your business, map relevant AI tools and workflows, and design the session around your specific situation." },
              { icon: Map,           label: "Roadmap",                         desc: "A prioritized, written action plan delivered before the workshop so leadership can review and align in advance." },
              { icon: Users,         label: "Management workshop",             desc: "A focused working session with your leadership team — hands-on, not slides. We walk through the roadmap and build together." },
              { icon: MessageSquareText, label: "Follow-up",                       desc: "A check-in call a few weeks after to review what moved, unblock questions, and adjust priorities if needed." },
            ].map(({ icon: Icon, label, desc }, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 mt-0.5">
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Investment</p>
              <p className="text-lg font-bold text-slate-900">{workshop.priceLabel}</p>
            </div>
          </div>

          <PrivateWorkshopCtas contactServiceId={workshop.contactServiceId} pageSlug={workshop.slug} />
        </div>
      </motion.div>
      </div>

      <FlexibleDeliverySection />
    </main>
  );
}
