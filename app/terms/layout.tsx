import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — AI with Michal",
  description:
    "Terms governing use of the AI with Michal website, workshops, mentoring, and purchases processed via Stripe — Juhas Digital Services s.r.o.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Use | AI with Michal",
    description: "Terms of Use for AI with Michal workshops, mentoring, and related services.",
    url: "/terms",
    siteName: "AI with Michal",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use | AI with Michal",
    description: "Terms governing use of AI with Michal services.",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
