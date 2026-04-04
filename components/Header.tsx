"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronDown, Menu, X } from "lucide-react";
import { isAdminUser } from "@/lib/config";

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
    user?.fullName?.split(" ")[0] ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Account";
  const avatarUrl = user?.imageUrl ?? null;
  const isAdmin = isAdminUser(user?.id);

  async function handleSignOut() {
    setOpen(false);
    await signOut({ redirectUrl: "/" });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        {/* Avatar */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={28}
            height={28}
            className="rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="max-w-[96px] truncate">{displayName}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-[60]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* User identity header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={32}
                height={32}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

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
          <Link
            href="/billing"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Billing
          </Link>
          <div className="border-t border-slate-100">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              Log out
            </button>
          </div>
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

/** Remount on `pathname` so the drawer closes on navigation without an effect. */
function MobileNavBar({
  pathname,
  isSignedIn,
}: {
  pathname: string;
  isSignedIn: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const mobileNavLinkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `block text-base font-medium px-4 py-3 rounded-lg transition-colors ${
      active
        ? "text-blue-600 bg-blue-50"
        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
    }`;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        className="md:hidden shrink-0 p-2 -mr-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="w-full basis-full md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link
                href="/workshops"
                className={mobileNavLinkClass("/workshops")}
                onClick={closeMobile}
              >
                Workshops
              </Link>
              <Link
                href="/ai-mentoring"
                className={mobileNavLinkClass("/ai-mentoring")}
                onClick={closeMobile}
              >
                Mentoring
              </Link>
              <Link
                href="/for-teams"
                className={mobileNavLinkClass("/for-teams")}
                onClick={closeMobile}
              >
                For Teams
              </Link>
              <Link
                href="/ai-workshops-for-teams"
                className={`${mobileNavLinkClass("/ai-workshops-for-teams")} pl-8 text-sm`}
                onClick={closeMobile}
              >
                AI Workshops for Teams
              </Link>
              <Link
                href="/ai-integrations"
                className={`${mobileNavLinkClass("/ai-integrations")} pl-8 text-sm`}
                onClick={closeMobile}
              >
                AI Integrations
              </Link>
              {isSignedIn && (
                <Link
                  href="/members"
                  className={mobileNavLinkClass("/members")}
                  onClick={closeMobile}
                >
                  Members
                </Link>
              )}
              <div className="border-t border-slate-200 mt-2 pt-2">
                {isSignedIn ? (
                  <UserMenu />
                ) : (
                  <Link
                    href="/login"
                    className="block text-base font-medium px-4 py-3 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    onClick={closeMobile}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
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
      <div className="max-w-7xl mx-auto px-6 min-h-16 flex flex-wrap items-center justify-between">
        <Link href="/" className="group">
          <span className="text-slate-900 font-bold text-lg tracking-tight">
            AI{" "}
            <span className="text-blue-600">with</span>{" "}
            Michal
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/workshops"
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
          <div className="w-px h-5 bg-slate-200 mx-1" />
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Log in
            </Link>
          )}
        </div>

        <MobileNavBar key={pathname} pathname={pathname} isSignedIn={!!isSignedIn} />
      </div>
    </motion.header>
  );
}
