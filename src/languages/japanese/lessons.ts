// Type definitions for Japanese lesson data.
// Lessons 1-20 have vocabulary + grammar + examples only.
// Lessons 21-50 add dialogue + exercises.

export type JapaneseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type JapaneseVocabEntry = {
  japanese: string;
  english: string;
};

export type JapaneseGrammarPoint = {
  point: string;
  explanation: string;
};

export type JapaneseExample = {
  japanese: string;
  english: string;
  pronunciation_focus?: string[];
};

export type JapaneseDialogueLine = {
  speaker: string;
  japanese: string;
  english: string;
};

export type JapaneseExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type JapaneseExerciseMatching = {
  type: "matching";
  pairs: { japanese: string; english: string }[];
  instruction: string;
};

export type JapaneseExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  japanese: string;
};

export type JapaneseExercise =
  | JapaneseExerciseFillBlank
  | JapaneseExerciseMatching
  | JapaneseExerciseTranslation;

export type JapaneseLesson = {
  id: number;
  title: string;
  // Optional bilingual title fields (added for B2 calibration samples)
  title_vi?: string;
  title_en?: string;
  category?: string;
  level: JapaneseCefrLevel;
  vocabulary: JapaneseVocabEntry[];
  // Grammar is present on lessons 1-50 but optional on B2 calibration samples
  grammar?: JapaneseGrammarPoint[];
  examples: JapaneseExample[];
  dialogue?: JapaneseDialogueLine[];
  exercises?: JapaneseExercise[];
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: JapaneseDialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: { idiom: string; literal: string; meaning: string; example: string }[];
};

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

// Phase 3: lesson data now fetched from Supabase via useLessonData / fetchLessonsBatch.
// These stubs preserve the exported API surface for backward compat.
const _cache = new Map<string, JapaneseLesson[]>();
export async function loadLessonsForLevel(
  _level: JapaneseCefrLevel,
): Promise<JapaneseLesson[]> {
  return [];
}
export async function loadAllLessons(): Promise<JapaneseLesson[]> {
  return [];
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: string,
): JapaneseLesson[] {
  const out: JapaneseLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): JapaneseLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const JAPANESE_TOTAL_LESSONS = 151;
