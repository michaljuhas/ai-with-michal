import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrivateWorkshopBySlug, PRIVATE_WORKSHOP_SLUGS } from "@/lib/private-workshops";
import PrivateWorkshopClient from "./PrivateWorkshopClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRIVATE_WORKSHOP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getPrivateWorkshopBySlug(slug);
  if (!w) return { title: "Workshop | AI with Michal" };
  const description =
    w.body[0]?.slice(0, 155) ?? "Private workshop for your management team.";
  const path = `/private-workshops/${slug}`;
  return {
    title: `${w.title} | AI with Michal`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: w.title,
      description,
      url: path,
      siteName: "AI with Michal",
      type: "website",
      images: [
        {
          url: "/workshop-og.jpeg",
          width: 2048,
          height: 1152,
          alt: w.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: w.title,
      description,
      images: ["/workshop-og.jpeg"],
    },
  };
}

export default async function PrivateWorkshopPage({ params }: Props) {
  const { slug } = await params;
  const w = getPrivateWorkshopBySlug(slug);
  if (!w) notFound();

  return <PrivateWorkshopClient workshop={w} />;
}
