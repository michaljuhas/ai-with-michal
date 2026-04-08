import { notFound } from "next/navigation";
import { getPublicWorkshopBySlug } from "@/lib/workshops";
import { getPaidOrderCount } from "@/lib/order-count";
import TicketsPageClient from "./TicketsPageClient";

type Props = { params: Promise<{ slug: string }> };

export default async function WorkshopTicketsPage({ params }: Props) {
  const { slug } = await params;
  const workshop = getPublicWorkshopBySlug(slug);
  if (!workshop) notFound();

  const initialSoldCount = await getPaidOrderCount(slug);

  return <TicketsPageClient initialSoldCount={initialSoldCount} />;
}
