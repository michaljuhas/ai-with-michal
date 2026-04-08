import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "News | AI with Michal",
  description:
    "Latest updates from AI with Michal: practical AI workflows, workshop insights, tools, and implementation playbooks.",
  keywords: [
    "AI news",
    "AI workshops",
    "AI tools",
    "recruiting automation",
    "AI with Michal",
  ],
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "News | AI with Michal",
    description:
      "Latest updates from AI with Michal: practical AI workflows, workshop insights, tools, and implementation playbooks.",
    url: "/news",
    type: "website",
    siteName: "AI with Michal",
    images: [
      {
        url: "/news/candidate-sourcer-skill-thumbnail.png",
        width: 1280,
        height: 720,
        alt: "AI with Michal News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "News | AI with Michal",
    description:
      "Latest updates from AI with Michal: practical AI workflows, workshop insights, tools, and implementation playbooks.",
    images: ["/news/candidate-sourcer-skill-thumbnail.png"],
  },
};

export default function NewsLayout({ children }: { children: ReactNode }) {
  return children;
}
