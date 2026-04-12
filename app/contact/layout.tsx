import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Work with Michal | AI with Michal",
  description:
    "Tell us what you need: mentoring, consulting sprints, advisory, or hands-on AI implementation. We'll follow up and help you book a call.",
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact | AI with Michal",
    description: "Get in touch to scope workshops, mentoring, or implementation for your team.",
    url: "/contact",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Contact AI with Michal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | AI with Michal",
    description: "Scope workshops, mentoring, or AI implementation for your team.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
