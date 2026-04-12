import type { Metadata } from "next";
import WorkTogetherMenuPage from "@/components/work-together/WorkTogetherMenuPage";

export const metadata: Metadata = {
  title: "Consulting | AI with Michal",
  description:
    "AI consulting sprints for leadership teams, domain deep-dives, advisory board, and hands-on implementation — explore options and pricing.",
  alternates: {
    canonical: "/consulting",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Consulting | AI with Michal",
    description:
      "Board-level AI consulting, structured sprints, advisory, and hands-on implementation — explore options and pricing.",
    url: "/consulting",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI consulting with Michal Juhas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consulting | AI with Michal",
    description:
      "Structured consulting sprints, advisory, and AI implementation — pick what fits your organization.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function ConsultingHubPage() {
  return <WorkTogetherMenuPage />;
}
