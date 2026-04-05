import HeroSectionForRecruiters from "./HeroSectionForRecruiters";
import RecruiterFomoSection from "./RecruiterFomoSection";
import HostIntroSection from "./HostIntroSection";
import ProblemSection from "./ProblemSection";
import NewApproachSection from "./NewApproachSection";
import ToolsSection from "./ToolsSection";
import WhatYouBuildSection from "./WhatYouBuildSection";
import WhoItsForSection from "./WhoItsForSection";
import AgendaSection from "./AgendaSection";
import WhatYouGetSection from "@/components/workshops/WhatYouGetSection";
import HowItWorksSection from "@/components/workshops/HowItWorksSection";
import VideoTestimonialSection from "@/components/VideoTestimonialSection";
import PricingSection from "@/components/workshops/PricingSection";
import GuaranteeSection from "@/components/workshops/GuaranteeSection";
import AboutSection from "@/components/workshops/AboutSection";
import FinalCTA from "@/components/workshops/FinalCTA";

interface WorkshopPageProps {
  open: boolean;
  displayDate: string;
  displayTime: string;
  workshopDate: Date;
  workshopSlug: string;
  timezoneConverterUrl: string;
}

export default function WorkshopPage({
  open,
  displayDate,
  displayTime,
  workshopDate,
  workshopSlug,
  timezoneConverterUrl,
}: WorkshopPageProps) {
  return (
    <main>
      <HeroSectionForRecruiters open={open} displayDate={displayDate} workshopDate={workshopDate} workshopSlug={workshopSlug} />
      <RecruiterFomoSection />
      <HostIntroSection />
      <ProblemSection />
      <NewApproachSection />
      <ToolsSection />
      <WhatYouBuildSection />
      <WhoItsForSection />
      <AgendaSection />
      <WhatYouGetSection />
      <HowItWorksSection />
      <VideoTestimonialSection />
      <PricingSection open={open} displayDate={displayDate} displayTime={displayTime} workshopSlug={workshopSlug} timezoneConverterUrl={timezoneConverterUrl} />
      <GuaranteeSection />
      <AboutSection />
      <FinalCTA open={open} workshopSlug={workshopSlug} />
    </main>
  );
}
