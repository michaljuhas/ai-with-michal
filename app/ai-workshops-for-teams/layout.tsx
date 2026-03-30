import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Workshops for Teams & Companies | AI with Michal",
  description:
    "Private AI workshops for recruiting, marketing, sales, and operations teams. Hands-on sessions that help your company implement practical AI workflows and improve team productivity.",
  keywords: [
    "AI workshops for teams",
    "corporate AI workshop",
    "AI training for companies",
    "AI recruiting workshop",
    "AI productivity workshop",
    "team AI training",
  ],
  alternates: {
    canonical: "/ai-workshops-for-teams",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Workshops for Teams & Companies",
    description:
      "Book private, practical AI workshops tailored to your team across recruiting, marketing, sales, and operations.",
    url: "/ai-workshops-for-teams",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI workshops for company teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Workshops for Teams & Companies",
    description:
      "Private, hands-on AI workshops that help teams build real workflows and improve performance.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function AIWorkshopsForTeamsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
