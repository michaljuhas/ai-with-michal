import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Group AI Mentoring Circles | AI with Michal",
  description:
    "Join a dedicated mentoring circle — Recruiting, GTM, Ops, or Solopreneurs. Learn alongside peers with live calls and shared wins.",
  openGraph: {
    title: "Group AI Mentoring | AI with Michal",
    description: "Circles for Recruiting, GTM, Ops, and Solopreneurs — group mentoring with Michal.",
    type: "website",
  },
};

export default function GroupMentoringLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
