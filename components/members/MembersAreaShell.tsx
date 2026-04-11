"use client";

import type { ReactNode } from "react";
import MembersSidebar from "./MembersSidebar";

export default function MembersAreaShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 mb-6 lg:mb-8">
          Members Area
        </p>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <MembersSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
