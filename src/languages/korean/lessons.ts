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
};

export type KoreanDialogueLine = {
  speaker: string;
  hangul: string;
  meaning: string;
  text_ko?: string;
  text_vi?: string;
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
};

// B2-specific dialogue line — adds Vietnamese gloss to the existing
// {speaker, hangul, meaning} shape used by lessons 1-50.
export type KoreanB2DialogueLine = {
  speaker: string;
  hangul: string;
  meaning: string;
  vi?: string;
};

export type KoreanLesson = {
  id: number;
  level: KoreanCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  vocabulary: KoreanVocabEntry[];
  sentences: KoreanSentence[];
  dialogue: KoreanDialogueLine[];
  exercises: KoreanExercise[];
  // B2-specific optional fields (Phase 2 conversation-focused lessons).
  // All optional — existing A1/A2/B1 lessons typecheck unchanged.
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  dialogue_long?: KoreanB2DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: IdiomGloss[];
};

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

const _cache = new Map<KoreanCefrLevel, KoreanLesson[]>();

const _importers: Record<
  KoreanCefrLevel,
  () => Promise<{ default: KoreanLesson[] }>
> = {
  A1: () => import("./lessons-a1"),
  A2: () => import("./lessons-a2"),
  B1: () => import("./lessons-b1"),
  B2: () => import("./lessons-b2"),
  C1: () => import("./lessons-c1"),
  C2: () => import("./lessons-c2"),
};

export async function loadLessonsForLevel(
  level: KoreanCefrLevel,
): Promise<KoreanLesson[]> {
  const cached = _cache.get(level);
  if (cached) return cached;
  const mod = await _importers[level]();
  _cache.set(level, mod.default);
  return mod.default;
}

export async function loadAllLessons(): Promise<KoreanLesson[]> {
  const levels: KoreanCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const arrays = await Promise.all(levels.map(loadLessonsForLevel));
  return arrays.flat();
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
export const KOREAN_TOTAL_LESSONS = 121;
