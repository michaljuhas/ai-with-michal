import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrainingLesson from "@/components/training/TrainingLesson";
import {
  getWorkshopBySlug,
  getWorkshopLessonBySlug,
  getWorkshopLessonNeighbors,
  getWorkshopTrainingLessons,
  workshops,
} from "@/lib/workshops";

type TrainingModulePageProps = {
  params: Promise<{ slug: string; moduleSlug: string[] }>;
};

export async function generateStaticParams() {
  const params: { slug: string; moduleSlug: string[] }[] = [];
  for (const workshop of workshops) {
    const lessons = getWorkshopTrainingLessons(workshop.slug);
    for (const lesson of lessons) {
      params.push({ slug: workshop.slug, moduleSlug: lesson.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: TrainingModulePageProps): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const lesson = getWorkshopLessonBySlug(slug, moduleSlug);

  if (!lesson) {
    return { title: "Training | AI with Michal" };
  }

  return {
    title: `${lesson.title} | Training | AI with Michal`,
    description: lesson.description,
  };
}

export default async function TrainingModulePage({ params }: TrainingModulePageProps) {
  const { slug, moduleSlug } = await params;

  const workshop = getWorkshopBySlug(slug);
  if (!workshop) notFound();

  const lesson = getWorkshopLessonBySlug(slug, moduleSlug);
  if (!lesson) notFound();

  const currentPath = `/members/workshops/${slug}/training/${moduleSlug.join("/")}`;
  const { previous, next } = getWorkshopLessonNeighbors(slug, currentPath);
  const Content = lesson.Component;

  return (
    <TrainingLesson lesson={lesson} previousLesson={previous} nextLesson={next}>
      <Content />
    </TrainingLesson>
  );
}
