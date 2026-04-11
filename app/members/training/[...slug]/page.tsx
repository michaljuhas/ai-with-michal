import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrainingLesson from "@/components/training/TrainingLesson";
import {
  getTrainingLessonBySlug,
  getTrainingLessonNeighbors,
  trainingLessons,
} from "@/lib/training";

type TrainingLessonPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  return trainingLessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: TrainingLessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getTrainingLessonBySlug(slug);

  if (!lesson) {
    return {
      title: "Training | AI with Michal",
    };
  }

  const path = `/members/training/${slug.join("/")}`;
  return {
    title: `${lesson.title} | Training | AI with Michal`,
    description: lesson.description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      url: `https://aiwithmichal.com${path}`,
      siteName: "AI with Michal",
      type: "website",
      images: [
        {
          url: "/workshop-og.jpeg",
          width: 2048,
          height: 1152,
          alt: lesson.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: lesson.title,
      description: lesson.description,
      images: ["/workshop-og.jpeg"],
    },
  };
}

export default async function TrainingLessonPage({
  params,
}: TrainingLessonPageProps) {
  const { slug } = await params;
  const lesson = getTrainingLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const { previous, next } = getTrainingLessonNeighbors(lesson.path);
  const Content = lesson.Component;

  return (
    <TrainingLesson lesson={lesson} previousLesson={previous} nextLesson={next}>
      <Content />
    </TrainingLesson>
  );
}
