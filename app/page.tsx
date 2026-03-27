import HeroSection from "@/components/home/HeroSection";
import RecruiterFomoSection from "@/components/home/RecruiterFomoSection";
import HostIntroSection from "@/components/home/HostIntroSection";
import ProblemSection from "@/components/home/ProblemSection";
import NewApproachSection from "@/components/home/NewApproachSection";
import ToolsSection from "@/components/home/ToolsSection";
import WhatYouBuildSection from "@/components/home/WhatYouBuildSection";
import WhoItsForSection from "@/components/home/WhoItsForSection";
import AgendaSection from "@/components/home/AgendaSection";
import WhatYouGetSection from "@/components/home/WhatYouGetSection";
import PricingSection from "@/components/home/PricingSection";
import GuaranteeSection from "@/components/home/GuaranteeSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCTA from "@/components/home/FinalCTA";
import VideoTestimonialSection from "@/components/VideoTestimonialSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <RecruiterFomoSection />
      <HostIntroSection />
      <ProblemSection />
      <NewApproachSection />
      <ToolsSection />
      <WhatYouBuildSection />
      <WhoItsForSection />
      <AgendaSection />
      <WhatYouGetSection />
      <VideoTestimonialSection />
      <PricingSection />
      <GuaranteeSection />
      <AboutSection />
      <FinalCTA />
    </main>
  );
}
