import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mentoring — 1-on-1 & Group Sessions | AI with Michal",
  description:
    "Accelerate your AI adoption with personalized mentoring. Join our VIP inner circle for 1-on-1 sessions with Michal Juhas, group mentoring, and dedicated workshops for solopreneurs and founders.",
  alternates: {
    canonical: "/ai-mentoring",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Mentoring — 1-on-1 & Group Sessions | AI with Michal",
    description:
      "Accelerate your AI adoption with personalized mentoring. Join our VIP inner circle for 1-on-1 sessions, group mentoring, and dedicated workshops.",
    url: "/ai-mentoring",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI mentoring with Michal Juhas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Mentoring — 1-on-1 & Group Sessions | AI with Michal",
    description:
      "Personalized mentoring, group circles, and dedicated workshops for solopreneurs and founders.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function AIMentoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
