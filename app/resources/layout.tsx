import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free AI Recruiting Resources, Guides & Templates | AI with Michal",
  description:
    "Download practical AI recruiting resources, including prompt libraries and sourcing tool guides. Free templates and playbooks to improve sourcing, screening, and outreach workflows.",
  keywords: [
    "AI recruiting resources",
    "recruiting prompt guide",
    "AI sourcing tools",
    "talent acquisition templates",
    "recruiting automation guide",
    "AI recruiting playbook",
  ],
  alternates: {
    canonical: "/resources",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Free AI Recruiting Resources, Guides & Templates",
    description:
      "Access free AI recruiting guides, prompt collections, and sourcing resources to help your team work faster and smarter.",
    url: "/resources",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Free AI recruiting resources and guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Recruiting Resources, Guides & Templates",
    description:
      "Free prompt guides and sourcing resources for recruiters and talent teams.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function ResourcesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
