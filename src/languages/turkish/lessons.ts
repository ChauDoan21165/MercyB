// src/languages/turkish/lessons.ts
//
// Turkish metadata and shared authoring types for the local A1-C2 public
// lesson pack. Keep this file independent from ./index so the language barrel
// can aggregate lesson arrays without circular imports.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";

export type TurkishCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type TurkishCategoryId =
  | "greetings"
  | "vowel_harmony"
  | "introductions"
  | "numbers_time"
  | "food"
  | "daily_life"
  | "shopping"
  | "directions"
  | "home_family"
  | "travel"
  | "cases"
  | "work"
  | "past_future"
  | "healthcare"
  | "formal_register"
  | "media"
  | "complaints"
  | "reported_speech"
  | "debate"
  | "workplace"
  | "academic"
  | "policy"
  | "literature"
  | "presentations"
  | "nuance"
  | "research"
  | "legal_admin"
  | "rhetoric"
  | "news_analysis"
  | "mastery";

export type TurkishCategoryMeta = {
  id: TurkishCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type TurkishSentenceInput = {
  tr: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
};

export type TurkishVocabInput = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos?: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type TurkishDialogueInput = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type TurkishExerciseInput =
  | {
      type: "fill_blank";
      question: string;
      answer: string;
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi?: string;
      instruction_en?: string;
      pairs: Array<{ a: string; b: string }>;
    }
  | {
      type: "translation";
      vietnamese: string;
      english?: string;
      turkish: string;
    };

export type TurkishIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type TurkishLessonInput = {
  id: string;
  category: TurkishCategoryId;
  level: TurkishCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences: TurkishSentenceInput[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  vocabulary: TurkishVocabInput[];
  dialogue?: TurkishDialogueInput[];
  exercises?: TurkishExerciseInput[];
  dialogue_long?: TurkishDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: TurkishIdiomGlossInput[];
};

export type TurkishLesson = TurkishLessonInput;

export const TURKISH_VALIDATED_LEVELS: ReadonlyArray<TurkishCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const TURKISH_CATEGORIES: ReadonlyArray<TurkishCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi", title_en: "Greetings", expected_count: 1 },
  { id: "vowel_harmony", title_vi: "Hài hòa nguyên âm", title_en: "Vowel harmony", expected_count: 1 },
  { id: "introductions", title_vi: "Giới thiệu bản thân", title_en: "Introductions", expected_count: 1 },
  { id: "numbers_time", title_vi: "Số và thời gian", title_en: "Numbers and time", expected_count: 1 },
  { id: "food", title_vi: "Ăn uống", title_en: "Food and cafes", expected_count: 1 },
  { id: "daily_life", title_vi: "Sinh hoạt hàng ngày", title_en: "Daily life", expected_count: 1 },
  { id: "shopping", title_vi: "Mua sắm", title_en: "Shopping", expected_count: 1 },
  { id: "directions", title_vi: "Hỏi đường", title_en: "Directions", expected_count: 1 },
  { id: "home_family", title_vi: "Nhà cửa và gia đình", title_en: "Home and family", expected_count: 1 },
  { id: "travel", title_vi: "Du lịch", title_en: "Travel", expected_count: 1 },
  { id: "cases", title_vi: "Các cách trong tiếng Thổ", title_en: "Turkish cases", expected_count: 1 },
  { id: "work", title_vi: "Công việc", title_en: "Work", expected_count: 1 },
  { id: "past_future", title_vi: "Quá khứ và tương lai", title_en: "Past and future", expected_count: 1 },
  { id: "healthcare", title_vi: "Y tế", title_en: "Healthcare", expected_count: 1 },
  { id: "formal_register", title_vi: "Văn phong trang trọng", title_en: "Formal register", expected_count: 1 },
  { id: "media", title_vi: "Tin tức và truyền thông", title_en: "Media and news", expected_count: 1 },
  { id: "complaints", title_vi: "Khiếu nại lịch sự", title_en: "Polite complaints", expected_count: 1 },
  { id: "reported_speech", title_vi: "Tường thuật lời nói", title_en: "Reported speech", expected_count: 1 },
  { id: "debate", title_vi: "Tranh luận", title_en: "Debate", expected_count: 1 },
  { id: "workplace", title_vi: "Công sở nâng cao", title_en: "Advanced workplace", expected_count: 1 },
  { id: "academic", title_vi: "Ngôn ngữ học thuật", title_en: "Academic language", expected_count: 1 },
  { id: "policy", title_vi: "Chính sách và xã hội", title_en: "Policy and society", expected_count: 1 },
  { id: "literature", title_vi: "Văn học", title_en: "Literature", expected_count: 1 },
  { id: "presentations", title_vi: "Thuyết trình", title_en: "Presentations", expected_count: 1 },
  { id: "nuance", title_vi: "Sắc thái lập luận", title_en: "Nuance in argument", expected_count: 1 },
  { id: "research", title_vi: "Nghiên cứu", title_en: "Research language", expected_count: 1 },
  { id: "legal_admin", title_vi: "Pháp lý và hành chính", title_en: "Legal and administrative", expected_count: 1 },
  { id: "rhetoric", title_vi: "Tu từ", title_en: "Rhetoric", expected_count: 1 },
  { id: "news_analysis", title_vi: "Phân tích tin tức", title_en: "News analysis", expected_count: 1 },
  { id: "mastery", title_vi: "Diễn đạt thuần thục", title_en: "Mastery", expected_count: 1 },
];

export const TURKISH_TOTAL_LESSONS = TURKISH_CATEGORIES.reduce(
  (sum, category) => sum + category.expected_count,
  0,
);

export const TURKISH_LANGUAGE_META = {
  code: "tr",
  nativeName: "Türkçe",
  name_vi: "Tiếng Thổ Nhĩ Kỳ",
  name_en: "Turkish",
  script: "latin",
  hasTones: false,
  levels: TURKISH_VALIDATED_LEVELS,
  totalLessons: TURKISH_TOTAL_LESSONS,
} as const;

export type TurkishLanguageMeta = typeof TURKISH_LANGUAGE_META;
