import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — AI with Michal",
  description:
    "How AI with Michal uses cookies and similar technologies — PostHog, Clerk, advertising (Meta, LinkedIn), and first-party attribution.",
  alternates: {
    canonical: "/cookies",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cookie Policy | AI with Michal",
    description: "Cookie and storage information for aiwithmichal.com — Juhas Digital Services s.r.o.",
    url: "/cookies",
    siteName: "AI with Michal",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | AI with Michal",
    description: "How we use cookies and local storage on AI with Michal.",
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
