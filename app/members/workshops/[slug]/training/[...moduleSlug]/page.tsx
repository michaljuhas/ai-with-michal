import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import TrainingLesson from "@/components/training/TrainingLesson";
import SessionNotesEditor from "@/components/session-notes/SessionNotesEditor";
import {
  getWorkshopBySlug,
  getWorkshopLessonBySlug,
  getWorkshopLessonNeighbors,
  getWorkshopTrainingLessons,
  workshops,
} from "@/lib/workshops";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";
const SESSION_NOTES_SLUG = ["live-workshop", "session-notes"];

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

  // Session notes: render live DB-backed editor instead of static MDX
  const isSessionNotes = moduleSlug.join("/") === SESSION_NOTES_SLUG.join("/");
  if (isSessionNotes) {
    const { userId } = await auth();
    const isAdmin = userId === ADMIN_USER_ID;
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("workshop_session_notes")
      .select("content, updated_at")
      .eq("workshop_slug", slug)
      .maybeSingle();

    return (
      <TrainingLesson lesson={lesson} previousLesson={previous} nextLesson={next} hideTitle>
        <SessionNotesEditor
          workshopSlug={slug}
          initialContent={data?.content ?? ""}
          initialUpdatedAt={data?.updated_at ?? null}
          isAdmin={isAdmin}
        />
      </TrainingLesson>
    );
  }

  const Content = lesson.Component;

  return (
    <TrainingLesson lesson={lesson} previousLesson={previous} nextLesson={next}>
      <Content />
    </TrainingLesson>
  );
}
