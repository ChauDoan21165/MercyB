// Type definitions for Chinese lesson data
// Mirrors the schema used by all 50 lessons; types derived from existing data.

export type ChineseVocabEntry = {
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseSentence = {
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
  pronunciation_focus?: string[];
};

export type ChineseDialogueLine = {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type ChineseExerciseMatching = {
  type: "matching";
  pairs: ChineseVocabEntry[];
  instruction: string;
};

export type ChineseExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  chinese: string;
  pinyin: string;
};

export type ChineseExercise =
  | ChineseExerciseFillBlank
  | ChineseExerciseMatching
  | ChineseExerciseTranslation;

export type ChineseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// Category meta — parallels FRENCH_CATEGORIES / GERMAN_CATEGORIES shape.
// Categories listed here are the ones currently used in the lesson data
// (study_career = Cat 1 Học tập & Nghề nghiệp, cultural_communication =
// Cat 2 Giao tiếp Văn hóa, fluency = B2 calibration sample). New B2
// rounds add to this list as they ship.
export type ChineseCategoryId =
  | "study_career"
  | "cultural_communication"
  | "travel_mobility"
  | "personal_social"
  | "fluency"
  | "academic_discourse"
  | "professional_negotiation"
  | "literary_criticism";

export type ChineseCategoryMeta = {
  id: ChineseCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const CHINESE_CATEGORIES: ReadonlyArray<ChineseCategoryMeta> = [
  { id: "study_career", title_vi: "Học tập & Nghề nghiệp", title_en: "Study & Career", expected_count: 10 },
  { id: "cultural_communication", title_vi: "Giao tiếp Văn hóa", title_en: "Cultural Communication", expected_count: 10 },
  { id: "travel_mobility", title_vi: "Du lịch & Di chuyển", title_en: "Travel & Mobility", expected_count: 10 },
  { id: "personal_social", title_vi: "Quan hệ cá nhân & Xã hội", title_en: "Personal & Social Relationships", expected_count: 10 },
  { id: "fluency", title_vi: "Lưu loát", title_en: "Fluency", expected_count: 5 },
  { id: "academic_discourse", title_vi: "Diễn ngôn học thuật", title_en: "Academic Discourse", expected_count: 10 },
  { id: "professional_negotiation", title_vi: "Đàm phán chuyên nghiệp", title_en: "Professional Negotiation", expected_count: 10 },
  { id: "literary_criticism", title_vi: "Phê bình văn học", title_en: "Literary Criticism", expected_count: 10 },
];

export type IdiomGloss = {
  idiom: string;
  literal: string;
  meaning: string;
  example: string;
};

// B2-specific dialogue line — adds Vietnamese gloss to the existing
// {speaker, chinese, pinyin, english} shape used by lessons 1-50.
export type ChineseB2DialogueLine = {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseLesson = {
  id: number;
  level: ChineseCefrLevel;
  title: string;
  pinyin: string;
  topic: string;
  vocab: ChineseVocabEntry[];
  sentences: ChineseSentence[];
  dialogue: ChineseDialogueLine[];
  exercises: ChineseExercise[];
  // B2-specific optional fields (Phase 2 conversation-focused lessons).
  // All optional — existing A1/A2/B1 lessons typecheck unchanged.
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  dialogue_long?: ChineseB2DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: IdiomGloss[];
  // Forward-compatible fields for the cross-language B2 template.
  // Legacy `title` / `topic` remain authoritative until the renderer reads these.
  category?: ChineseCategoryId;
  title_vi?: string;
  title_en?: string;
};

// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

const _cache = new Map<ChineseCefrLevel, ChineseLesson[]>();

const _importers: Record<
  ChineseCefrLevel,
  () => Promise<{ default: ChineseLesson[] }>
> = {
  A1: () => import("./lessons-a1"),
  A2: () => import("./lessons-a2"),
  B1: () => import("./lessons-b1"),
  B2: () => import("./lessons-b2"),
  C1: () => import("./lessons-c1"),
  C2: () => import("./lessons-c2"),
};

export async function loadLessonsForLevel(
  level: ChineseCefrLevel,
): Promise<ChineseLesson[]> {
  const cached = _cache.get(level);
  if (cached) return cached;
  const mod = await _importers[level]();
  _cache.set(level, mod.default);
  return mod.default;
}

export async function loadAllLessons(): Promise<ChineseLesson[]> {
  const levels: ChineseCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const arrays = await Promise.all(levels.map(loadLessonsForLevel));
  return arrays.flat();
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: ChineseCategoryId,
): ChineseLesson[] {
  const out: ChineseLesson[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): ChineseLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const CHINESE_TOTAL_LESSONS = 129;
