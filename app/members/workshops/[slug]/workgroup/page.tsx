import { notFound } from "next/navigation";
import { getWorkshopBySlug } from "@/lib/workshops";
import WorkgroupSection from "@/components/workgroup/WorkgroupSection";

type WorkgroupPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkgroupPage({ params }: WorkgroupPageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  return <WorkgroupSection workshopSlug={slug} />;
}
