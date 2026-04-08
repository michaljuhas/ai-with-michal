import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Group AI Mentoring Circles | AI with Michal",
  description:
    "Join a dedicated mentoring circle — Recruiting, GTM, Ops, or Solopreneurs. Learn alongside peers with live calls and shared wins.",
  alternates: {
    canonical: "/group-ai-mentoring",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Group AI Mentoring | AI with Michal",
    description: "Circles for Recruiting, GTM, Ops, and Solopreneurs — group mentoring with Michal.",
    url: "/group-ai-mentoring",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Group AI mentoring circles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Group AI Mentoring | AI with Michal",
    description:
      "Mentoring circles for Recruiting, GTM, Ops, and Solopreneurs — live calls and shared wins.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function GroupMentoringLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
