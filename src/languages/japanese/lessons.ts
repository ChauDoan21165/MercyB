// Type definitions for Japanese lesson data.
// Lessons 1-20 have vocabulary + grammar + examples only.
// Lessons 21-50 add dialogue + exercises.

export type JapaneseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type JapaneseVocabEntry = {
  cell_id?: string;
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
  pronunciation_focus_en?: string[];
};

export type JapaneseDialogueLine = {
  cell_id?: string;
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
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: JapaneseDialogueLine[];
  roleplay_prompts?: string[];
  /** English mirror of roleplay_prompts. B2+ only. */
  roleplay_prompts_en?: string[];
  register_notes?: string;
  /** English mirror of register_notes. B2+ only. */
  register_notes_en?: string;
  idiom_glosses?: {
    idiom: string;
    literal: string;
    meaning: string;
    example: string;
    /** English mirror of literal. B2+ only. */
    literal_en?: string;
    /** English mirror of meaning. B2+ only. */
    meaning_en?: string;
    /** English mirror of example. B2+ only. */
    example_en?: string;
  }[];
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
