// Type definitions for Korean lesson data
// Mirrors the schema used by lessons 1-20; lessons 21-50 should be backfilled to match.

export type KoreanVocabEntry = {
  hangul: string;
  meaning: string;
};

export type KoreanSentence = {
  korean: string;
  romanized: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
};

export type KoreanDialogueLine = {
  speaker: string;
  hangul: string;
  /** English gloss. Pre-#514 this was wrongly mapped to the VI slot;
   *  #514 authored `text_vi` siblings as the true Vietnamese source. */
  meaning: string;
  text_ko?: string;
  /** Vietnamese gloss, authored ×544 in #514 (#509 §10.1 Option C).
   *  Normalizer: vi = text_vi ?? meaning (legacy fallback). */
  text_vi?: string;
  /** English sibling. Normalizer: en = text_en. */
  text_en?: string;
};

export type KoreanExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type KoreanExerciseMatching = {
  type: "matching";
  pairs: { hangul: string; meaning: string }[];
  instruction: string;
};

export type KoreanExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  hangul: string;
};

export type KoreanExercise =
  | KoreanExerciseFillBlank
  | KoreanExerciseMatching
  | KoreanExerciseTranslation;

export type KoreanCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IdiomGloss = {
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
};

// B2+ dialogue line (dialogue_long). Trilingual in source:
// `hangul` (Korean), `meaning` (English gloss) and `vi` (Vietnamese
// gloss). The normalizer maps `meaning` → en and `vi` → vi.
// (Post-#514 short-dialogue `KoreanDialogueLine.meaning` is likewise
// English — its Vietnamese is `text_vi`; only vocab `meaning` is VI.)
export type KoreanB2DialogueLine = {
  speaker: string;
  hangul: string;
  /** English gloss of the line. (Post-#514 short-dialogue
   *  `KoreanDialogueLine.meaning` is also English; its Vietnamese is
   *  `text_vi`. Only vocab `meaning` remains Vietnamese.) */
  meaning: string;
  /** Vietnamese gloss of the line. */
  vi?: string;
};

export type KoreanLesson = {
  id: number;
  level: KoreanCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  /** English mirror of intro_vi. Independent sibling — not a
   *  translation. Absent today; renderer badges the VI fallback. */
  intro_en?: string;
  vocabulary: KoreanVocabEntry[];
  sentences: KoreanSentence[];
  dialogue: KoreanDialogueLine[];
  exercises: KoreanExercise[];
  // B2-specific optional fields (Phase 2 conversation-focused lessons).
  // All optional — existing A1/A2/B1 lessons typecheck unchanged.
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  dialogue_long?: KoreanB2DialogueLine[];
  roleplay_prompts?: string[];
  /** English mirror of roleplay_prompts. B2+ only. */
  roleplay_prompts_en?: string[];
  register_notes?: string;
  /** English mirror of register_notes. B2+ only. */
  register_notes_en?: string;
  idiom_glosses?: IdiomGloss[];
};

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

// Phase 3: lesson data now fetched from Supabase via useLessonData / fetchLessonsBatch.
// These stubs preserve the exported API surface for backward compat.
const _cache = new Map<string, KoreanLesson[]>();
export async function loadLessonsForLevel(
  _level: KoreanCefrLevel,
): Promise<KoreanLesson[]> {
  return [];
}
export async function loadAllLessons(): Promise<KoreanLesson[]> {
  return [];
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: string,
): KoreanLesson[] {
  const out: KoreanLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): KoreanLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const KOREAN_TOTAL_LESSONS = 131;
