"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function WorkshopsAnimatedShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/60 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/50 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-violet-100/40 blur-3xl"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
