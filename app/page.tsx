import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import NewApproachSection from "@/components/home/NewApproachSection";
import ToolsSection from "@/components/home/ToolsSection";
import SystemSection from "@/components/home/SystemSection";
import WhatYouBuildSection from "@/components/home/WhatYouBuildSection";
import WhoItsForSection from "@/components/home/WhoItsForSection";
import AgendaSection from "@/components/home/AgendaSection";
import WhatYouGetSection from "@/components/home/WhatYouGetSection";
import PricingSection from "@/components/home/PricingSection";
import GuaranteeSection from "@/components/home/GuaranteeSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <NewApproachSection />
      <ToolsSection />
      <SystemSection />
      <WhatYouBuildSection />
      <WhoItsForSection />
      <AgendaSection />
      <WhatYouGetSection />
      <PricingSection />
      <GuaranteeSection />
      <AboutSection />
      <FinalCTA />
    </main>
  );
}
