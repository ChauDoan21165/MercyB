// src/data/richLessonsPilot.ts
//
// Typed loader for the Step 4 RichLesson pilot bundle. The JSON file is
// the editable surface (so writers / linters can hand-author lessons
// without touching TS); this module gives the rest of the app a
// type-safe Map keyed by tag.

import type { WeaknessTag } from "@/lib/weakness/weakness-catalog";
import type { RichLesson } from "@/lib/weakness/richLessonSchema";
import pilotJson from "./rich-lessons-pilot.json";

interface PilotFile {
  _meta: { schema: string; step: string; note: string };
  lessons: RichLesson[];
}

const file = pilotJson as unknown as PilotFile;

export const RICH_LESSONS_PILOT: readonly RichLesson[] = Object.freeze(
  file.lessons.slice(),
);

const byTag: Map<WeaknessTag, RichLesson> = new Map();
for (const lesson of RICH_LESSONS_PILOT) {
  byTag.set(lesson.tag, lesson);
}

/** Look up a pilot RichLesson by tag, or null if no pilot exists yet. */
export function getRichLessonPilot(tag: string): RichLesson | null {
  return byTag.get(tag as WeaknessTag) ?? null;
}

/** Tags that currently have a hand-authored RichLesson pilot. */
export const RICH_LESSON_PILOT_TAGS: readonly WeaknessTag[] = Object.freeze(
  RICH_LESSONS_PILOT.map((l) => l.tag),
);
