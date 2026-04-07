import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Individual AI Mentoring (1-on-1) | AI with Michal",
  description:
    "Bi-weekly 1-on-1 video calls with Michal. Personal guidance to adopt AI faster in your business — best practices, tooling, and workflows tailored to you.",
  openGraph: {
    title: "Individual AI Mentoring | AI with Michal",
    description: "1-on-1 mentoring to accelerate your AI adoption with direct access to Michal and the team.",
    type: "website",
  },
};

export default function IndividualMentoringLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
