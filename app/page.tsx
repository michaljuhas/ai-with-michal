import HeroSection from "@/components/home/HeroSection";
import RecruiterFomoSection from "@/components/home/RecruiterFomoSection";
import HostIntroSection from "@/components/home/HostIntroSection";
import ProblemSection from "@/components/home/ProblemSection";
import NewApproachSection from "@/components/home/NewApproachSection";
import ToolsSection from "@/components/home/ToolsSection";
import SystemSection from "@/components/home/SystemSection";
import WhatYouBuildSection from "@/components/home/WhatYouBuildSection";
import WhoItsForSection from "@/components/home/WhoItsForSection";
import AgendaSection from "@/components/home/AgendaSection";
import WhatYouGetSection from "@/components/home/WhatYouGetSection";
import WhyNowSection from "@/components/home/WhyNowSection";
import PricingSection from "@/components/home/PricingSection";
import GuaranteeSection from "@/components/home/GuaranteeSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <RecruiterFomoSection />
      <HostIntroSection />
      <ProblemSection />
      <NewApproachSection />
      <ToolsSection />
      <SystemSection />
      <WhatYouBuildSection />
      <WhoItsForSection />
      <AgendaSection />
      <WhatYouGetSection />
      <WhyNowSection />
      <PricingSection />
      <GuaranteeSection />
      <AboutSection />
      <FinalCTA />
    </main>
  );
}
