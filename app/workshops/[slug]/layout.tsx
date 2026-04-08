import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicWorkshopBySlug, PUBLIC_WORKSHOPS } from "@/lib/workshops";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateStaticParams() {
  return PUBLIC_WORKSHOPS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getPublicWorkshopBySlug(slug);
  if (!workshop) return {};

  const path = `/workshops/${slug}`;
  return {
    title: `${workshop.title} | AI with Michal`,
    description: workshop.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: workshop.title,
      description: workshop.description,
      url: path,
      siteName: "AI with Michal",
      type: "website",
      images: [
        {
          url: "/workshop-og.jpeg",
          width: 2048,
          height: 1152,
          alt: `${workshop.title} · ${workshop.displayDate}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.description,
      images: ["/workshop-og.jpeg"],
    },
  };
}

export default async function WorkshopLayout({ params, children }: Props) {
  const { slug } = await params;
  const workshop = getPublicWorkshopBySlug(slug);
  if (!workshop) notFound();

  return <>{children}</>;
}
