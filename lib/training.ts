import type { ComponentType } from "react";
import AiAdoptionLevelsContent, {
  lesson as aiAdoptionLevelsLesson,
} from "@/content/training/pre-training/ai-adoption-levels.mdx";
import ExamplesContent, {
  lesson as examplesLesson,
} from "@/content/training/pre-training/examples-of-what-other-recruiters-do.mdx";
import HowAiIsChangingRecruitingContent, {
  lesson as howAiIsChangingRecruitingLesson,
} from "@/content/training/pre-training/how-ai-is-changing-recruiting.mdx";
import WhatToExpectContent, {
  lesson as whatToExpectLesson,
} from "@/content/training/pre-training/what-to-expect-at-the-workshop.mdx";
import JoinContent, {
  lesson as joinLesson,
} from "@/content/training/live-workshop/join.mdx";
import RecordingContent, {
  lesson as recordingLesson,
} from "@/content/training/live-workshop/recording.mdx";

export type TrainingSectionKey = "pre-training" | "live-workshop";

export type TrainingLessonMeta = {
  title: string;
  description: string;
  section: TrainingSectionKey;
  order: number;
  slug: [string, string];
};

export type TrainingLesson = TrainingLessonMeta & {
  path: string;
  Component: ComponentType;
};

export type TrainingSection = {
  key: TrainingSectionKey;
  title: string;
  lessons: Array<Pick<TrainingLesson, "title" | "path" | "slug">>;
};

const sectionOrder: TrainingSectionKey[] = ["pre-training", "live-workshop"];

function createLesson(
  lesson: TrainingLessonMeta,
  Component: ComponentType
): TrainingLesson {
  return {
    ...lesson,
    path: `/training/${lesson.slug.join("/")}`,
    Component,
  };
}

export const trainingLessons: TrainingLesson[] = [
  createLesson(
    howAiIsChangingRecruitingLesson as TrainingLessonMeta,
    HowAiIsChangingRecruitingContent
  ),
  createLesson(aiAdoptionLevelsLesson as TrainingLessonMeta, AiAdoptionLevelsContent),
  createLesson(examplesLesson as TrainingLessonMeta, ExamplesContent),
  createLesson(whatToExpectLesson as TrainingLessonMeta, WhatToExpectContent),
  createLesson(joinLesson as TrainingLessonMeta, JoinContent),
  createLesson(recordingLesson as TrainingLessonMeta, RecordingContent),
].sort((a, b) => {
  if (a.section === b.section) {
    return a.order - b.order;
  }

  return sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section);
});

const sectionTitles: Record<TrainingSectionKey, string> = {
  "pre-training": "Pre-training",
  "live-workshop": "Live Workshop",
};

export const trainingSections: TrainingSection[] = (
  sectionOrder
).map((key) => ({
  key,
  title: sectionTitles[key],
  lessons: trainingLessons
    .filter((lesson) => lesson.section === key)
    .sort((a, b) => a.order - b.order)
    .map(({ title, path, slug }) => ({ title, path, slug })),
}));

export function getDefaultTrainingLesson() {
  return trainingSections[0]?.lessons[0] ?? null;
}

export function getTrainingLessonBySlug(slug: string[]) {
  return trainingLessons.find((lesson) => lesson.slug.join("/") === slug.join("/")) ?? null;
}

export function getTrainingLessonNeighbors(path: string) {
  const currentIndex = trainingLessons.findIndex((lesson) => lesson.path === path);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: trainingLessons[currentIndex - 1] ?? null,
    next: trainingLessons[currentIndex + 1] ?? null,
  };
}
