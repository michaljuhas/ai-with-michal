import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training & Implementation for Teams | AI with Michal",
  description:
    "Custom AI workshops and integration services for companies. From half-day team workshops to full AI implementation projects — delivered by Michal Juhas, Josef Nevoral, and team.",
  openGraph: {
    title: "AI Training & Implementation for Teams | AI with Michal",
    description:
      "Custom AI workshops and integration services for companies. From half-day team workshops to full AI implementation projects.",
    type: "website",
  },
};

export default function ForTeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
