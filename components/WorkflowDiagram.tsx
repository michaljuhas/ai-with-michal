"use client";

import { motion } from "framer-motion";
import { Database, Brain, FileText, LayoutDashboard, ChevronDown } from "lucide-react";

const steps = [
  {
    icon: Database,
    label: "Alternative Candidate Sources",
    sublabel: "GitHub, conferences, company sites, datasets",
    color: "from-blue-50 to-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Brain,
    label: "AI Candidate Analysis",
    sublabel: "Automated profile processing",
    color: "from-violet-50 to-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: FileText,
    label: "Candidate Summary",
    sublabel: "Structured AI-generated profiles",
    color: "from-cyan-50 to-cyan-50",
    border: "border-cyan-200",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: LayoutDashboard,
    label: "Talent Pool Dashboard",
    sublabel: "Reusable, searchable talent pool",
    color: "from-emerald-50 to-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function WorkflowDiagram() {
  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-sm mx-auto">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.label}
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <div
              className={`w-full rounded-xl border ${step.border} bg-gradient-to-br ${step.color} p-4 flex items-center gap-4`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg ${step.iconBg} flex items-center justify-center ${step.iconColor}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm leading-tight">{step.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{step.sublabel}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.3 }}
                className="text-slate-300 my-1"
              >
                <ChevronDown size={20} />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
