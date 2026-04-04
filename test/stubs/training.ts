/**
 * Test stub: real `lib/training.ts` imports MDX; Vitest aliases here to keep unit tests fast.
 */
import type { ComponentType } from "react";

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

export const trainingLessons: TrainingLesson[] = [];
export const trainingSections: TrainingSection[] = [];

export function getDefaultTrainingLesson() {
  return null;
}

export function getTrainingLessonBySlug(_slug: string[]) {
  return null;
}

export function getTrainingLessonNeighbors(_path: string) {
  return { previous: null, next: null };
}
