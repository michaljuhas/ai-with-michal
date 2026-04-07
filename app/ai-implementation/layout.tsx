import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hands-on AI Implementation for Teams | AI with Michal",
  description:
    "We ship working AI workflows in your business: inbound leads, outbound sales, recruiting pipelines, and proprietary talent data — delivered hands-on, not slideware.",
  keywords: [
    "AI implementation",
    "AI automation for business",
    "AI recruiting workflows",
    "AI sales automation",
    "AI marketing lead generation",
  ],
  alternates: {
    canonical: "/ai-implementation",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Hands-on AI Implementation | AI with Michal",
    description:
      "From lead gen to sourcing to niche talent pools — practical AI workflows implemented in your stack with guidance from practitioners.",
    url: "/ai-implementation",
    type: "website",
    images: [{ url: "/workshop-og.jpeg", width: 2048, height: 1152, alt: "AI implementation for teams" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hands-on AI Implementation | AI with Michal",
    description: "Live workflows for marketing, sales, and recruiting — built with your team.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function AIImplementationLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
