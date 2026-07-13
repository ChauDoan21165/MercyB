// src/languages/vietnamese/lessons.ts
//
// Vietnamese lessons for foreigners living in Vietnam.
// Per-level lesson data lives in lessons-{level}.ts and is lazy-loaded
// on demand so the initial page chunk stays small.
//
// Types and the loadLessonsForLevel() API are stable; the per-level
// files carry the actual lesson arrays.

import { lessons as vietnameseLessonsA1 } from "./lessons-a1";
import { lessons as vietnameseLessonsA2 } from "./lessons-a2";
import { lessons as vietnameseLessonsB1 } from "./lessons-b1";
import { lessons as vietnameseLessonsB2 } from "./lessons-b2";
import { lessons as vietnameseLessonsC1 } from "./lessons-c1";
import { lessons as vietnameseLessonsC2 } from "./lessons-c2";

export type VietnameseCefrLevel = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2";

export type VietnamesePhrase = {
  english: string;
  vietnamese: string;
  pronunciation: string;
  context: string;
};

export type VietnameseDialogueLine = {
  cell_id?: string;
  speaker: string;
  vietnamese: string;
  english: string;
  pronunciation: string;
};

export type VietnameseLesson = {
  id: number;
  level: VietnameseCefrLevel;
  title_en: string;
  subtitle: string;
  intro: string;
  phrases: VietnamesePhrase[];
  dialogue?: VietnameseDialogueLine[];
  cultural_note: string;
  tip: string;
};

// ── Lazy lesson registry ────────────────────────────────────────────────
//
// Local-first runtime loader. The authored Vietnamese corpus lives in
// lessons-{level}.ts. Browser/Judge replay must not render 0 lessons merely
// because Supabase is empty, unavailable, or slow.

const _cache = new Map<VietnameseCefrLevel, VietnameseLesson[]>();

// Keep VIETNAMESE_LESSONS as a sync re-export for backward compatibility.
// It is backfilled whenever async loaders run.
export const VIETNAMESE_LESSONS: VietnameseLesson[] = [];

function localVietnameseLessonsForLevel(level: VietnameseCefrLevel): readonly VietnameseLesson[] {
  switch (level) {
    case "A1":
      return vietnameseLessonsA1;
    case "A2":
      return vietnameseLessonsA2;
    case "B1":
      return vietnameseLessonsB1;
    case "B2":
      return vietnameseLessonsB2;
    case "C1":
      return vietnameseLessonsC1;
    case "C2":
      return vietnameseLessonsC2;
    case "A1+":
      return [];
  }
}

function syncVietnameseLessonBackfill() {
  VIETNAMESE_LESSONS.length = 0;
  const seen = new Set<string>();
  for (const batch of _cache.values()) {
    for (const lesson of batch) {
      const key = `${lesson.level}:${lesson.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        VIETNAMESE_LESSONS.push(lesson);
      }
    }
  }
}

export async function loadVietnameseLessonsForLevel(
  level: VietnameseCefrLevel,
): Promise<VietnameseLesson[]> {
  const cached = _cache.get(level);
  if (cached) return cached;

  const batch = [...localVietnameseLessonsForLevel(level)];
  _cache.set(level, batch);
  syncVietnameseLessonBackfill();
  return batch;
}

export async function loadAllVietnameseLessons(): Promise<VietnameseLesson[]> {
  const levels: VietnameseCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const batches = await Promise.all(
    levels.map((level) => loadVietnameseLessonsForLevel(level)),
  );
  syncVietnameseLessonBackfill();
  return ([] as VietnameseLesson[]).concat(...batches);
}

export function getCachedVietnameseLessons(): VietnameseLesson[] {
  const out: VietnameseLesson[] = [];
  for (const arr of _cache.values()) out.push(...arr);
  return out;
}

export function getCachedVietnameseLessonsByLevel(
  level: VietnameseCefrLevel,
): VietnameseLesson[] {
  return _cache.get(level) ?? [];
}

/** Total lesson count across every level. Keep in sync with per-level files. */
export const VIETNAMESE_TOTAL_LESSONS = 536;
