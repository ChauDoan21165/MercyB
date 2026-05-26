// src/languages/vietnamese/lessons.ts
//
// Vietnamese lessons for foreigners living in Vietnam.
// Per-level lesson data lives in lessons-{level}.ts and is lazy-loaded
// on demand so the initial page chunk stays small.
//
// Types and the loadLessonsForLevel() API are stable; the per-level
// files carry the actual lesson arrays.

export type VietnameseCefrLevel = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2";

export type VietnamesePhrase = {
  english: string;
  vietnamese: string;
  pronunciation: string;
  context: string;
};

export type VietnameseDialogueLine = {
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

// Phase 3: lesson data now fetched from Supabase via useLessonData / fetchLessonsBatch.
// These stubs preserve the exported API surface for backward compat.
const _cache = new Map<VietnameseCefrLevel, VietnameseLesson[]>();

export async function loadVietnameseLessonsForLevel(
  _level: VietnameseCefrLevel,
): Promise<VietnameseLesson[]> {
  return [];
}

export async function loadAllVietnameseLessons(): Promise<VietnameseLesson[]> {
  return [];
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// must await loadAllVietnameseLessons / loadVietnameseLessonsForLevel first.
// Returns empty array when cache is cold.

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

// Keep VIETNAMESE_LESSONS as a sync re-export for backward compatibility.
// It returns whatever is currently in the cache (empty until first load).
// Callers that need lessons at module-init time should await
// loadAllVietnameseLessons() first, then use getCachedVietnameseLessons().
export const VIETNAMESE_LESSONS: VietnameseLesson[] = [];

// Backfill VIETNAMESE_LESSONS when lessons are loaded. This preserves
// backward compat for any code that does `VIETNAMESE_LESSONS.filter(...)`
// after awaiting loadAllVietnameseLessons().
function _syncBackfill(lessons: VietnameseLesson[]) {
  VIETNAMESE_LESSONS.length = 0;
  VIETNAMESE_LESSONS.push(...lessons);
}



/** Total lesson count across every level. Keep in sync with per-level files. */
export const VIETNAMESE_TOTAL_LESSONS = 536;
