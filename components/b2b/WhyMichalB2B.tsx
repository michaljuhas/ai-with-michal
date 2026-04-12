"use client";

import { Star, Globe2, Youtube, GraduationCap, Video, Building2 } from "lucide-react";
import AboutMichalGallery from "@/components/AboutMichalGallery";

const stats = [
  { icon: Building2, value: "20+", label: "Companies Trained (US, UK, EU)", iconColor: "text-blue-500" },
  { icon: Star, value: "190+", label: "Trustpilot Reviews", iconColor: "text-yellow-500" },
  { icon: Video, value: "100+", label: "Webinars & Sessions", iconColor: "text-teal-500" },
  { icon: GraduationCap, value: "50k+", label: "Course Students Globally", iconColor: "text-violet-500" },
  { icon: Youtube, value: "1M+", label: "YouTube Views", iconColor: "text-red-500" },
  { icon: Globe2, value: "3 Regions", label: "US · UK · EU Clients", iconColor: "text-orange-500" },
];

export default function WhyMichalB2B() {
  return (
    <AboutMichalGallery title="Why Michal?" heading="Real workshops. Real results." stats={stats}>
      <p>
        I&apos;ve run hands-on AI workshops and consulting engagements for 20+ companies
        across the US, UK, and EU — from fast-growing recruiting agencies and TA teams
        to marketing and sales orgs looking to rethink how they work.
      </p>
      <p>
        My sessions are practical, not theoretical. Teams leave with working workflows,
        real tools, and the confidence to keep building. No fluff, no generic AI hype —
        just concrete automation strategies tailored to your team&apos;s function and
        current skill level.
      </p>
    </AboutMichalGallery>
  );
}
