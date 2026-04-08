import type { Metadata } from "next";
import WorkTogetherMenuPage from "@/components/work-together/WorkTogetherMenuPage";

export const metadata: Metadata = {
  title: "Work Together | AI with Michal",
  description:
    "Bi-weekly mentoring, group circles, private workshops, advisory board, and hands-on AI implementation — explore options and pricing.",
  alternates: {
    canonical: "/work-together",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Work Together | AI with Michal",
    description:
      "Mentoring, group circles, private workshops, advisory, and hands-on AI implementation — explore options and pricing.",
    url: "/work-together",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Work together with AI with Michal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Together | AI with Michal",
    description:
      "Mentoring, workshops, advisory, and AI implementation — pick what fits your team.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function WorkTogetherRoute() {
  return <WorkTogetherMenuPage />;
}
