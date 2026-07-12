// src/languages/german/lessons.ts
//
// 20 German lessons for Vietnamese learners (5 intro + 15 topic-based).
// Each lesson: vocabulary, example sentences, dialogue, exercises, and
// pronunciation focus written for Vietnamese speakers.
//
// Shape mirrors the profession-pack content.ts pattern so the page UI
// stays consistent across verticals.
//
// Hand-crafted; no AI-generated filler.

export type GermanCategoryId =
  | "greetings"
  | "numbers"
  | "common_phrases"
  | "cases_intro"
  | "food"
  | "family"
  | "daily_routine"
  | "weather"
  | "time"
  | "colors"
  | "clothes"
  | "transportation"
  | "house"
  | "hobbies"
  | "health"
  | "work"
  | "travel"
  | "emotions"
  | "past_tense"
  | "future_plans"
  | "workplace"
  | "life_admin"
  | "society"
  | "expressions"
  | "advanced_grammar"
  | "public_communication"
  | "fluency"
  | "arts_criticism"
  | "civic_discourse"
  | "rhetoric_capstone";

export type GermanCategoryMeta = {
  id: GermanCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const GERMAN_CATEGORIES: ReadonlyArray<GermanCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi và giới thiệu", title_en: "Greetings and introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm", title_en: "Numbers", expected_count: 1 },
  { id: "common_phrases", title_vi: "Câu giao tiếp thông dụng", title_en: "Common phrases", expected_count: 1 },
  { id: "cases_intro", title_vi: "Giới thiệu về cách (cách 1 và cách 4)", title_en: "Cases introduction (nominative and accusative)", expected_count: 1 },
  { id: "food", title_vi: "Ẩm thực và gọi món", title_en: "Food and ordering", expected_count: 1 },
  { id: "family", title_vi: "Gia đình", title_en: "Family", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hàng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "weather", title_vi: "Thời tiết", title_en: "Weather", expected_count: 1 },
  { id: "time", title_vi: "Thời gian", title_en: "Time", expected_count: 1 },
  { id: "colors", title_vi: "Màu sắc", title_en: "Colors", expected_count: 1 },
  { id: "clothes", title_vi: "Quần áo", title_en: "Clothes", expected_count: 1 },
  { id: "transportation", title_vi: "Giao thông", title_en: "Transportation", expected_count: 1 },
  { id: "house", title_vi: "Nhà cửa", title_en: "House", expected_count: 1 },
  { id: "hobbies", title_vi: "Sở thích", title_en: "Hobbies", expected_count: 1 },
  { id: "health", title_vi: "Sức khỏe", title_en: "Health", expected_count: 1 },
  { id: "work", title_vi: "Công việc", title_en: "Work", expected_count: 1 },
  { id: "travel", title_vi: "Du lịch", title_en: "Travel", expected_count: 1 },
  { id: "emotions", title_vi: "Cảm xúc", title_en: "Emotions", expected_count: 1 },
  { id: "past_tense", title_vi: "Thì quá khứ", title_en: "Past tense", expected_count: 1 },
  { id: "future_plans", title_vi: "Kế hoạch tương lai", title_en: "Future plans", expected_count: 1 },
  { id: "workplace", title_vi: "Công sở", title_en: "Workplace", expected_count: 5 },
  { id: "life_admin", title_vi: "Thủ tục hành chính", title_en: "Administrative tasks", expected_count: 5 },
  { id: "society", title_vi: "Xã hội", title_en: "Society", expected_count: 5 },
  { id: "expressions", title_vi: "Biểu đạt", title_en: "Expressions", expected_count: 5 },
  { id: "advanced_grammar", title_vi: "Ngữ pháp nâng cao", title_en: "Advanced grammar", expected_count: 5 },
  { id: "public_communication", title_vi: "Truyền thông công chúng", title_en: "Public communication", expected_count: 10 },
  { id: "fluency", title_vi: "Nói trôi chảy", title_en: "Fluency", expected_count: 5 },
];

// Bilingual pedagogy fields. Every Vietnamese-language pedagogy slot has
// an optional `_en` mirror so the same lesson serves both Vietnamese
// learners (default) and English learners (when LessonRenderer is
// invoked with uiLanguage="en"). Mirrors are optional so existing
// six-language content compiles unchanged while the German→English
// translation work rolls out level by level (A1 first; A2-C2 follow).

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  /** English-speaker-calibrated phonological hints. Same length /
   *  same ordering as pronunciation_focus when present. Anchored to
   *  English phonology (e.g. "g → hard 'g' as in 'go'") rather than
   *  Vietnamese phonology ("g → g cứng"). */
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  /** English-speaker-friendly phonetic spelling. Uppercase stressed
   *  syllable, hyphens between syllables, anchored to English vowels. */
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi: string;
};

export type ExerciseItem = {
  prompt: string;
  answer: string;
  options?: string[];
};

export type Exercise = {
  type: "fill_blank" | "matching" | "translation";
  instruction_vi: string;
  /** English mirror of instruction_vi. */
  instruction_en?: string;
  pronunciation_focus: string[];
  /** English mirror of pronunciation_focus. Same length / ordering as VI. */
  pronunciation_focus_en?: string[];
  items: ExerciseItem[];
};

export type GermanCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type GermanIdiomGloss = {
  idiom: string;
  literal: string;
  /** English mirror of literal. B2+ packs. */
  literal_en?: string;
  meaning: string;
  /** English mirror of meaning. B2+ packs. */
  meaning_en?: string;
  example: string;
  /** English mirror of example. B2+ packs. */
  example_en?: string;
};

export type GermanLesson = {
  id: string;
  category: GermanCategoryId;
  level: GermanCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  /** English mirror of cultural_notes_vi. Same facts, calibrated for
   *  an English-speaking audience (Vietnamese-comparison framing
   *  swapped for English/Anglophone-comparison where appropriate). */
  cultural_notes_en?: string;
  tip_advice_vi: string;
  /** English mirror of tip_advice_vi. */
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  /** English mirror of roleplay_prompts. B2+ only. */
  roleplay_prompts_en?: string[];
  register_notes?: string;
  /** English mirror of register_notes. B2+ only. */
  register_notes_en?: string;
  idiom_glosses?: GermanIdiomGloss[];
};

// ── 1. Greetings ────────────────────────────────────────────────────────

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

// Phase 3: lesson data now fetched from Supabase via useLessonData / fetchLessonsBatch.
// These stubs preserve the exported API surface for backward compat.
const _cache = new Map<string, GermanLesson[]>();
export async function loadLessonsForLevel(
  _level: GermanCefrLevel,
): Promise<GermanLesson[]> {
  return [];
}
export async function loadAllLessons(): Promise<GermanLesson[]> {
  return [];
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: GermanCategoryId,
): GermanLesson[] {
  const out: GermanLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): GermanLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const GERMAN_TOTAL_LESSONS = 151;
