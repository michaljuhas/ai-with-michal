import { redirect } from "next/navigation";
import { getDefaultTrainingLesson } from "@/lib/training";

export default function TrainingIndexPage() {
  const defaultLesson = getDefaultTrainingLesson();

  if (!defaultLesson) {
    redirect("/");
  }

  redirect(defaultLesson.path);
}
