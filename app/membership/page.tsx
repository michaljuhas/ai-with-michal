import type { Metadata } from "next";
import { CANONICAL_SITE_ORIGIN } from "@/lib/config";
import MembershipSalesContent from "@/components/membership/MembershipSalesContent";

export const metadata: Metadata = {
  title: "AI Recruiting Systems Membership | AI with Michal",
  description:
    "Annual membership — live workshops, recordings, workgroups, and systems to turn AI into a recruiting engine. €890/year.",
  alternates: { canonical: `${CANONICAL_SITE_ORIGIN}/membership` },
};

export default function MembershipSalesPage() {
  return <MembershipSalesContent />;
}
