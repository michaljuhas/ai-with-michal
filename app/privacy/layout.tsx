import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI with Michal",
  description:
    "How Juhas Digital Services s.r.o. collects, uses, and protects personal data for AI with Michal workshops, mentoring, and the website.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | AI with Michal",
    description:
      "Privacy information for AI with Michal — workshops, mentoring, and related services by Juhas Digital Services s.r.o.",
    url: "/privacy",
    siteName: "AI with Michal",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | AI with Michal",
    description: "How we handle personal data for AI with Michal.",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
