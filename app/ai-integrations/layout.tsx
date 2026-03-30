import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Integrations for Recruiting, Sales & Marketing Teams | AI with Michal",
  description:
    "Standardized AI integration packages for recruiting, marketing, sales, and operations teams. Automate lead generation, outreach, sourcing, and internal workflows without long custom builds.",
  keywords: [
    "AI integrations",
    "AI automation services",
    "AI recruiting automation",
    "AI sales automation",
    "AI marketing automation",
    "business workflow automation",
  ],
  alternates: {
    canonical: "/ai-integrations",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Integrations for Recruiting, Sales & Marketing Teams",
    description:
      "Implement practical AI automations for recruiting, marketing, sales, and operations with proven, standardized integration packages.",
    url: "/ai-integrations",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI Integrations for teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integrations for Recruiting, Sales & Marketing Teams",
    description:
      "Standardized AI integration packages to automate recruiting, marketing, sales, and business workflows.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function AIIntegrationsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
