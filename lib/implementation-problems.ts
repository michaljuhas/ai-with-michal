import type { LucideIcon } from "lucide-react";
import { Magnet, Send, UserSearch, Database } from "lucide-react";

export type ImplementationProblemPackage = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  contactServiceId: string;
  title: string;
  description: string;
  idealFor: string[];
};

/** Shared “Problems we solve” cards — used on /ai-implementation and consulting implementation pages. */
export const IMPLEMENTATION_PROBLEMS_PACKAGES: ImplementationProblemPackage[] = [
  {
    icon: Magnet,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    contactServiceId: "ai-for-inbound-marketing",
    title: "AI for Inbound Marketing",
    description:
      "AI-powered lead gen such as a dynamic quiz to segment your leads and personalize follow-ups. Capture higher-quality leads, route them automatically, and tailor every touchpoint based on their profile.",
    idealFor: ["Marketing", "GTM", "Demand Gen"],
  },
  {
    icon: Send,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    contactServiceId: "ai-for-outbound-sales",
    title: "AI for Outbound Sales",
    description:
      "Research targets with AI, monitor websites and career pages for buying signals, and score prospective leads before your reps pick up the phone.",
    idealFor: ["Sales", "BDR / SDR", "GTM"],
  },
  {
    icon: UserSearch,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    contactServiceId: "ai-for-candidate-sourcing",
    title: "AI for Candidate Sourcing",
    description:
      "Source candidates at scale, pre-screen applications, and engage top prospects with personalized outreach — so your team spends time on conversations, not spreadsheets.",
    idealFor: ["Recruiting", "TA", "HR"],
  },
  {
    icon: Database,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    contactServiceId: "niche-talent-pool-booster",
    title: "Niche Talent Pool Booster",
    description:
      "Combine candidate data sources to build a proprietary niche talent pool. Ideal for agencies specializing in a vertical and owning a defensible, always-fresh pipeline.",
    idealFor: ["Recruiting Agencies", "Executive Search"],
  },
];
