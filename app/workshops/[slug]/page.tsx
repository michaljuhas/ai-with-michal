import { notFound } from "next/navigation";
import { getPublicWorkshopBySlug, isOpen, getTimezoneConverterUrl } from "@/lib/workshops";
import { getPaidOrderCount } from "@/lib/order-count";
import AiInRecruitingPage from "@/components/workshops/2026-04-16-ai-in-recruiting/WorkshopPage";
import SourcingAutomationPage from "@/components/workshops/2026-04-23-sourcing-automation/WorkshopPage";
import ClaudeCoworkRecruitingPage from "@/components/workshops/2026-05-07-claude-cowork-recruiting/WorkshopPage";

const workshopPages: Record<string, React.ComponentType<{
  open: boolean;
  displayDate: string;
  displayTime: string;
  workshopDate: Date;
  workshopSlug: string;
  timezoneConverterUrl: string;
  initialSoldCount: number;
}>> = {
  "2026-04-16-ai-in-recruiting": AiInRecruitingPage,
  "2026-04-23-sourcing-automation": SourcingAutomationPage,
  "2026-05-07-claude-cowork-recruiting": ClaudeCoworkRecruitingPage,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params;
  const workshop = getPublicWorkshopBySlug(slug);
  if (!workshop) notFound();

  const PageComponent = workshopPages[slug];
  if (!PageComponent) notFound();

  const initialSoldCount = await getPaidOrderCount(workshop.slug);

  return (
    <PageComponent
      open={isOpen(workshop)}
      displayDate={workshop.displayDate}
      displayTime={workshop.displayTime}
      workshopDate={workshop.date}
      workshopSlug={workshop.slug}
      timezoneConverterUrl={getTimezoneConverterUrl(workshop.date)}
      initialSoldCount={initialSoldCount}
    />
  );
}
