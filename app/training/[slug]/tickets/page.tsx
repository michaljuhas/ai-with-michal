import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import CourseTicketsPageClient from "./CourseTicketsPageClient";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseTicketsPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !course.published) notFound();

  return <CourseTicketsPageClient courseSlug={slug} />;
}
