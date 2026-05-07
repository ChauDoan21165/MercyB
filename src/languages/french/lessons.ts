// src/languages/french/lessons.ts
//
// 20 French lessons for Vietnamese learners (5 intro + 15 topic-based).
// Each lesson: vocabulary, example sentences, dialogue, exercises, and
// pronunciation focus written for Vietnamese speakers.
//
// Shape mirrors the profession-pack content.ts pattern so the page UI
// stays consistent across verticals.
//
// Hand-crafted; no AI-generated filler.

export type FrenchCategoryId =
  | "greetings"
  | "numbers"
  | "common_phrases"
  | "basic_grammar"
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
  | "fluency";

export type FrenchCategoryMeta = {
  id: FrenchCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const FRENCH_CATEGORIES: ReadonlyArray<FrenchCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi và giới thiệu", title_en: "Greetings and introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm", title_en: "Numbers", expected_count: 1 },
  { id: "common_phrases", title_vi: "Câu giao tiếp thông dụng", title_en: "Common phrases", expected_count: 1 },
  { id: "basic_grammar", title_vi: "Ngữ pháp cơ bản", title_en: "Basic grammar", expected_count: 1 },
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
  { id: "fluency", title_vi: "Lưu loát", title_en: "Fluency", expected_count: 5 },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, any>;

export type FrenchCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type FrenchLesson = {
  id: string;
  category: FrenchCategoryId;
  level: FrenchCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: { idiom: string; literal: string; meaning: string; example: string }[];
};

// ── 1. Greetings ────────────────────────────────────────────────────────

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

const _cache = new Map<FrenchCefrLevel, FrenchLesson[]>();

const _importers: Record<
  FrenchCefrLevel,
  () => Promise<{ default: FrenchLesson[] }>
> = {
  A1: () => import("./lessons-a1"),
  A2: () => import("./lessons-a2"),
  B1: () => import("./lessons-b1"),
  B2: () => import("./lessons-b2"),
  C1: () => import("./lessons-c1"),
  C2: () => import("./lessons-c2"),
};

export async function loadLessonsForLevel(
  level: FrenchCefrLevel,
): Promise<FrenchLesson[]> {
  const cached = _cache.get(level);
  if (cached) return cached;
  const mod = await _importers[level]();
  _cache.set(level, mod.default);
  return mod.default;
}

export async function loadAllLessons(): Promise<FrenchLesson[]> {
  const levels: FrenchCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const arrays = await Promise.all(levels.map(loadLessonsForLevel));
  return arrays.flat();
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: FrenchCategoryId,
): FrenchLesson[] {
  const out: FrenchLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): FrenchLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const FRENCH_TOTAL_LESSONS = 111;
