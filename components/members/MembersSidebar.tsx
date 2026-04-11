"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/members/feed",
    label: "Feed",
    match: (p: string) => p === "/members/feed" || p.startsWith("/members/feed/"),
    icon: IconFeed,
  },
  {
    href: "/members",
    label: "Workshops",
    match: (p: string) => p === "/members",
    icon: IconWorkshops,
  },
  {
    href: "/members/courses",
    label: "Courses",
    match: (p: string) => p === "/members/courses" || p.startsWith("/members/courses/"),
    icon: IconCourses,
  },
  {
    href: "/members/community",
    label: "Members",
    match: (p: string) => p === "/members/community" || p.startsWith("/members/community/"),
    icon: IconMembers,
  },
] as const;

export default function MembersSidebar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 lg:w-56">
      <div className="lg:sticky lg:top-24">
        <p className="hidden lg:block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">
          Navigate
        </p>
        <nav
          className="flex flex-row flex-wrap gap-1.5 border-b border-slate-200 pb-4 mb-2 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:border-r lg:border-slate-200 lg:pr-6 lg:pb-0 lg:mb-0"
          aria-label="Members area"
        >
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full ${
                  active
                    ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    active
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:ring-1 group-hover:ring-slate-200"
                  }`}
                >
                  <Icon active={active} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function IconFeed({ active }: { active: boolean }) {
  const c = active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600";
  return (
    <svg className={`h-5 w-5 ${c}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

function IconWorkshops({ active }: { active: boolean }) {
  const c = active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600";
  return (
    <svg className={`h-5 w-5 ${c}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
      />
    </svg>
  );
}

function IconCourses({ active }: { active: boolean }) {
  const c = active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600";
  return (
    <svg className={`h-5 w-5 ${c}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512m0-14.256A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25a8.984 8.984 0 01-3 .512m-12-2.25V6.042m12 11.208V6.042"
      />
    </svg>
  );
}

function IconMembers({ active }: { active: boolean }) {
  const c = active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600";
  return (
    <svg className={`h-5 w-5 ${c}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}
