import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveConsultingPage, getAllConsultingSlugParams } from "@/lib/consulting-pages";
import ConsultingSprintClient from "./ConsultingSprintClient";
import ConsultingHandsOnClient from "./ConsultingHandsOnClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllConsultingSlugParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveConsultingPage(slug);
  if (!resolved) return { title: "Consulting | AI with Michal" };

  const path = `/consulting/${slug}`;

  if (resolved.kind === "sprint") {
    const w = resolved.workshop;
    const description =
      w.body[0]?.slice(0, 155) ?? "Board-level AI consulting sprint for your leadership team.";
    return {
      title: `${w.title} | AI with Michal`,
      description,
      alternates: { canonical: path },
      openGraph: {
        title: w.title,
        description,
        url: path,
        siteName: "AI with Michal",
        type: "website",
        images: [{ url: "/workshop-og.jpeg", width: 2048, height: 1152, alt: w.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: w.title,
        description,
        images: ["/workshop-og.jpeg"],
      },
    };
  }

  const p = resolved.page;
  const description = p.body[0]?.slice(0, 155) ?? "Consulting with AI with Michal.";
  return {
    title: `${p.title} | AI with Michal`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: p.title,
      description,
      url: path,
      siteName: "AI with Michal",
      type: "website",
      images: [{ url: "/workshop-og.jpeg", width: 2048, height: 1152, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description,
      images: ["/workshop-og.jpeg"],
    },
  };
}

export default async function ConsultingDetailPage({ params }: Props) {
  const { slug } = await params;
  const resolved = resolveConsultingPage(slug);
  if (!resolved) notFound();

  if (resolved.kind === "sprint") {
    return <ConsultingSprintClient workshop={resolved.workshop} />;
  }

  return <ConsultingHandsOnClient page={resolved.page} />;
}
