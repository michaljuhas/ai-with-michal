"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { CURRENT_WORKSHOP_SLUG } from "@/lib/workshops";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  async function handleSignOut() {
    setOpen(false);
    await signOut({ redirectUrl: "/" });
  }

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
        <div
          className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-[60]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function ForTeamsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        For Teams
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-[60]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Link
            href="/for-teams"
            className="block px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Overview
          </Link>
          <Link
            href="/ai-workshops-for-teams"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            AI Workshops for Teams
          </Link>
          <Link
            href="/ai-integrations"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            AI Integrations
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const navLinkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      active
        ? "text-blue-600 bg-blue-50"
        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
    }`;
  };

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

        <div className="flex items-center gap-1">
          <Link
            href={`/workshops/${CURRENT_WORKSHOP_SLUG}`}
            className={navLinkClass("/workshops")}
          >
            Workshops
          </Link>
          <Link
            href="/ai-mentoring"
            className={navLinkClass("/ai-mentoring")}
          >
            Mentoring
          </Link>
          <ForTeamsDropdown />
          {isSignedIn && (
            <Link
              href="/members"
              className={navLinkClass("/members")}
            >
              Members
            </Link>
          )}
          {isSignedIn && <UserMenu />}
        </div>
      </div>
    </motion.header>
  );
}
