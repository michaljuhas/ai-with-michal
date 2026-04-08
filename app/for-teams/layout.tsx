import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training & Implementation for Teams | AI with Michal",
  description:
    "Custom AI workshops and integration services for companies. From half-day team workshops to full AI implementation projects — delivered by Michal Juhas, Josef Nevoral, and team.",
  alternates: {
    canonical: "/for-teams",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Training & Implementation for Teams | AI with Michal",
    description:
      "Custom AI workshops and integration services for companies. From half-day team workshops to full AI implementation projects.",
    url: "/for-teams",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI training and implementation for teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Training & Implementation for Teams | AI with Michal",
    description:
      "Custom AI workshops and hands-on implementation for companies — from half-day sessions to full projects.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function ForTeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
