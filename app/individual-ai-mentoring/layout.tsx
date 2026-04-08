import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Individual AI Mentoring (1-on-1) | AI with Michal",
  description:
    "Bi-weekly 1-on-1 video calls with Michal. Personal guidance to adopt AI faster in your business — best practices, tooling, and workflows tailored to you.",
  alternates: {
    canonical: "/individual-ai-mentoring",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Individual AI Mentoring | AI with Michal",
    description: "1-on-1 mentoring to accelerate your AI adoption with direct access to Michal and the team.",
    url: "/individual-ai-mentoring",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Individual AI mentoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Individual AI Mentoring | AI with Michal",
    description:
      "Bi-weekly 1-on-1 calls — tooling and workflows tailored to your business.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function IndividualMentoringLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
