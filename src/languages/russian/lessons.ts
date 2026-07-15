// src/languages/russian/lessons.ts
//
// Russian study foundation converted from the local Vietnamese-Russian archive.
// Batch 1 intentionally ships only a compact A1/A2/B1 subset.

export type RussianCategoryId =
  | "script_foundation"
  | "daily_survival"
  | "case_control"
  | "connected_speech"
  | "practical_tasks";

export type RussianCategoryMeta = {
  id: RussianCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const RUSSIAN_LANGUAGE_META = {
  code: "ru",
  slug: "russian",
  name_en: "Russian",
  name_vi: "Tiếng Nga",
  native_name: "Русский",
  script: "Cyrillic",
} as const;

export const RUSSIAN_CATEGORIES: ReadonlyArray<RussianCategoryMeta> = [
  {
    id: "script_foundation",
    title_vi: "Chữ Cyrillic và phát âm nền",
    title_en: "Cyrillic and pronunciation foundation",
    expected_count: 1,
  },
  {
    id: "daily_survival",
    title_vi: "Giao tiếp sinh hoạt A1",
    title_en: "A1 daily survival communication",
    expected_count: 3,
  },
  {
    id: "case_control",
    title_vi: "Kiểm soát câu và cách A2",
    title_en: "A2 sentence and case control",
    expected_count: 4,
  },
  {
    id: "connected_speech",
    title_vi: "Nói nối ý B1",
    title_en: "B1 connected speech",
    expected_count: 2,
  },
  {
    id: "practical_tasks",
    title_vi: "Tình huống thực tế B1",
    title_en: "B1 practical situations",
    expected_count: 2,
  },
];

export type RussianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type RussianSentence = {
  russian: string;
  romanization: string;
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type RussianVocabEntry = {
  cell_id?: string;
  word: string;
  romanization: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type RussianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  romanization?: string;
  vi: string;
  en?: string;
};

export type RussianExerciseItem = {
  prompt: string;
  answer: string;
  options?: string[];
};

export type RussianExercise = {
  type: "matching" | "translation" | "fill_blank";
  instruction_vi: string;
  instruction_en?: string;
  items: RussianExerciseItem[];
};

export type RussianLesson = {
  id: string;
  category: RussianCategoryId;
  level: RussianCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences: RussianSentence[];
  vocabulary?: RussianVocabEntry[];
  dialogue?: RussianDialogueLine[];
  exercises?: RussianExercise[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
};

const _cache = new Map<string, RussianLesson[]>();

export async function loadLessonsForLevel(
  level: RussianCefrLevel,
): Promise<RussianLesson[]> {
  if (_cache.has(level)) return _cache.get(level) ?? [];

  if (level === "A1") {
    const mod = await import("./lessons-a1");
    _cache.set(level, mod.lessons);
    return mod.lessons;
  }

  if (level === "A2") {
    const mod = await import("./lessons-a2");
    _cache.set(level, mod.lessons);
    return mod.lessons;
  }

  if (level === "B1") {
    const mod = await import("./lessons-b1");
    _cache.set(level, mod.lessons);
    return mod.lessons;
  }

  _cache.set(level, []);
  return [];
}

export async function loadAllLessons(): Promise<RussianLesson[]> {
  const levels = await Promise.all([
    loadLessonsForLevel("A1"),
    loadLessonsForLevel("A2"),
    loadLessonsForLevel("B1"),
  ]);
  return levels.flat();
}

export function getLessonsByCategory(category: RussianCategoryId): RussianLesson[] {
  const out: RussianLesson[] = [];
  for (const arr of _cache.values()) {
    for (const lesson of arr) {
      if (lesson.category === category) out.push(lesson);
    }
  }
  return out;
}

export function getLessonById(id: number | string): RussianLesson | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((lesson) => lesson.id === id);
    if (found) return found;
  }
  return undefined;
}

export const RUSSIAN_LEVEL_COUNTS: Record<RussianCefrLevel, number> = {
  A1: 4,
  A2: 4,
  B1: 4,
  B2: 0,
  C1: 0,
  C2: 0,
};

export const RUSSIAN_TOTAL_LESSONS = Object.values(RUSSIAN_LEVEL_COUNTS).reduce(
  (sum, count) => sum + count,
  0,
);
