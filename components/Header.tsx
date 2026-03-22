"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import RegisterButton from "@/components/RegisterButton";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Account";
  const isAdmin = user?.id === ADMIN_USER_ID;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <span>{displayName}</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { isSignedIn } = useUser();

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

        <div className="flex items-center gap-3">
          {isHomepage && !isSignedIn && (
            <RegisterButton
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 group whitespace-nowrap"
              disabledClassName="text-sm font-semibold bg-slate-200 text-slate-400 px-5 py-2 rounded-lg cursor-not-allowed whitespace-nowrap"
            />
          )}
          {isSignedIn && <UserMenu />}
        </div>
      </div>
    </motion.header>
  );
}
