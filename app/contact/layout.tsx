import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Work with Michal | AI with Michal",
  description:
    "Tell us what you need: mentoring, private workshops, advisory, or hands-on AI implementation. We’ll follow up and help you book a call.",
  openGraph: {
    title: "Contact | AI with Michal",
    description: "Get in touch to scope workshops, mentoring, or implementation for your team.",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
