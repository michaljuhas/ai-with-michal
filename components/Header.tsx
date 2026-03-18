"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import RegisterButton from "@/components/RegisterButton";

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            AI{" "}
            <span className="text-blue-600">with</span>{" "}
            Michal
          </span>
        </Link>

        {isHomepage && (
          <RegisterButton
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 group whitespace-nowrap"
            disabledClassName="text-sm font-semibold bg-slate-200 text-slate-400 px-5 py-2 rounded-lg cursor-not-allowed whitespace-nowrap"
          />
        )}
      </div>
    </motion.header>
  );
}
