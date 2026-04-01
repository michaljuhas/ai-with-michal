import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mentoring — 1-on-1 & Group Sessions | AI with Michal",
  description:
    "Accelerate your AI adoption with personalized mentoring. Join our VIP inner circle for 1-on-1 sessions with Michal Juhas, group mentoring, and dedicated workshops for solopreneurs and founders.",
  openGraph: {
    title: "AI Mentoring — 1-on-1 & Group Sessions | AI with Michal",
    description:
      "Accelerate your AI adoption with personalized mentoring. Join our VIP inner circle for 1-on-1 sessions, group mentoring, and dedicated workshops.",
    type: "website",
  },
};

export default function AIMentoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
