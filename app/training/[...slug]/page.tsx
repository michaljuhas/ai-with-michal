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

  return {
    title: `${lesson.title} | Training | AI with Michal`,
    description: lesson.description,
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
