// src/languages/swahili/lessons.ts
//
// Swahili (Kiswahili) metadata registry and shared types for the
// consolidated A1–C2 lesson pack. Categories span all six CEFR levels
// with contributions from multiple authoring waves merged into one
// canonical list.
//
// Swahili uses the Latin alphabet and is largely phonetic — a big win
// for Vietnamese speakers: NO tones, NO grammatical gender, consistent
// penultimate stress. The main learning curve is the noun-class system
// (ngeli) and the verb prefix chain.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";

export type SwahiliCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type SwahiliCategoryId =
  // A1 — beginner survival (A1 wave)
  | "greetings"
  | "introductions"
  | "numbers"
  | "questions"
  | "food"
  | "directions"
  | "family"
  // A2 — elementary daily life (fresh scaffold)
  | "daily_routine"
  | "shopping"
  | "transport"
  | "time"
  | "weather"
  | "housing"
  // B1 — intermediate (B1 wave)
  | "work_tasks"
  | "health_pharmacy"
  | "public_services"
  | "opinions_reasons"
  | "past_narration"
  | "workplace"
  | "opinions"
  | "past_future"
  | "healthcare"
  | "register"
  // B2 — upper intermediate (B2 wave)
  | "media"
  | "reported_speech"
  | "debate"
  | "verb_extensions"
  | "formal_writing"
  | "business"
  | "conditional"
  | "passive_voice"
  // C1 — advanced (scaffold)
  | "academic"
  | "presentations"
  | "literary"
  | "noun_classes"
  // C1 — advanced (C1 wave)
  | "complex_sentences"
  | "relative_clauses"
  | "narrative"
  | "cultural_nuances"
  // C2 — mastery (C2 wave)
  | "academic_discourse"
  | "advanced_grammar"
  | "formal_register"
  | "idioms_proverbs"
  | "legal_admin"
  | "literary_analysis"
  | "news_editorial"
  | "philosophical"
  | "political_diplomacy"
  | "literature"
  | "poetry"
  | "political"
  | "legal"
  | "humor"
  | "fluency";

export type SwahiliCategoryMeta = {
  id: SwahiliCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

// ── Shared authoring types ───────────────────────────────────────────

export type SwahiliSentenceInput = {
  /** Swahili target text (preferred slot). */
  sw?: string;
  /** Alternative native slot used by some authoring waves. */
  kiswahili?: string;
  /** English gloss. */
  en?: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type SwahiliVocabInput = {
  /** Swahili word (B1 wave uses `sw`). */
  sw?: string;
  /** Swahili word (A1/B2/C2 waves use `word`). */
  word?: string;
  en: string;
  vi: string;
  pos?: string;
  /** Noun class for nouns (e.g. "ki/vi", "m/wa", "n/n"). */
  ngeli?: string;
  pronunciation_vi?: string;
  pronunciation_en?: string;
};

export type SwahiliDialogueInput = {
  speaker: string;
  /** Dialogue text (B1 wave uses `sw`). */
  sw?: string;
  /** Dialogue text (A1/B2/C2 waves use `text`). */
  text?: string;
  vi?: string;
  en?: string;
};

export type SwahiliIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type SwahiliLessonInput = {
  id: string;
  category: SwahiliCategoryId;
  level: SwahiliCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences: SwahiliSentenceInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  vocabulary?: SwahiliVocabInput[];
  dialogue?: SwahiliDialogueInput[];
  exercises?: Array<Record<string, any>>;
  dialogue_long?: SwahiliDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  register_notes_vi?: string;
  register_notes_en_field?: string;
  idiom_glosses?: SwahiliIdiomGlossInput[];
  content?: string;
};

export type SwahiliLesson = SwahiliLessonInput;

export const SWAHILI_VALIDATED_LEVELS: ReadonlyArray<SwahiliCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const SWAHILI_CATEGORIES: ReadonlyArray<SwahiliCategoryMeta> = [
  // A1 — beginner survival
  { id: "greetings", title_vi: "Chào hỏi", title_en: "Greetings", expected_count: 1 },
  { id: "introductions", title_vi: "Giới thiệu bản thân", title_en: "Introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm 1–100", title_en: "Numbers 1–100", expected_count: 1 },
  { id: "questions", title_vi: "Câu hỏi cơ bản", title_en: "Basic questions", expected_count: 1 },
  { id: "food", title_vi: "Gọi món và ăn uống", title_en: "Food and ordering", expected_count: 1 },
  { id: "directions", title_vi: "Hỏi đường", title_en: "Directions", expected_count: 1 },
  { id: "family", title_vi: "Gia đình", title_en: "Family", expected_count: 1 },
  // A2 — elementary daily life
  { id: "daily_routine", title_vi: "Sinh hoạt hàng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "shopping", title_vi: "Mua sắm và trả giá", title_en: "Shopping and bargaining", expected_count: 1 },
  { id: "transport", title_vi: "Đi lại", title_en: "Transport", expected_count: 1 },
  { id: "time", title_vi: "Thời gian và lịch", title_en: "Time and calendar", expected_count: 1 },
  { id: "weather", title_vi: "Thời tiết", title_en: "Weather", expected_count: 1 },
  { id: "housing", title_vi: "Nhà ở và thuê nhà", title_en: "Housing", expected_count: 1 },
  // B1 — intermediate (B1 wave)
  { id: "work_tasks", title_vi: "Công việc và hạn chót", title_en: "Work tasks and deadlines", expected_count: 1 },
  { id: "health_pharmacy", title_vi: "Hiệu thuốc và theo dõi sức khỏe", title_en: "Pharmacy and health follow-up", expected_count: 1 },
  { id: "public_services", title_vi: "Giấy tờ và dịch vụ công", title_en: "Documents and public services", expected_count: 1 },
  { id: "opinions_reasons", title_vi: "Ý kiến và lý do", title_en: "Opinions and reasons", expected_count: 1 },
  { id: "past_narration", title_vi: "Kể chuyện quá khứ", title_en: "Past narration", expected_count: 1 },
  // B1 — intermediate (A1 scaffold)
  { id: "workplace", title_vi: "Công việc", title_en: "Workplace", expected_count: 1 },
  { id: "opinions", title_vi: "Bày tỏ ý kiến", title_en: "Opinions", expected_count: 1 },
  { id: "past_future", title_vi: "Quá khứ và tương lai", title_en: "Past and future", expected_count: 1 },
  { id: "healthcare", title_vi: "Y tế", title_en: "Healthcare", expected_count: 1 },
  { id: "register", title_vi: "Trang trọng và thân mật", title_en: "Formal vs informal register", expected_count: 1 },
  // B2 — upper intermediate (B2 wave)
  { id: "media", title_vi: "Tin tức và truyền thông", title_en: "News and media", expected_count: 1 },
  { id: "reported_speech", title_vi: "Tường thuật lời nói", title_en: "Reported speech", expected_count: 1 },
  { id: "debate", title_vi: "Tranh luận quan điểm", title_en: "Debating opinions", expected_count: 1 },
  { id: "verb_extensions", title_vi: "Vinyambuo vya vitenzi — đuôi mở rộng động từ", title_en: "Verb extensions", expected_count: 1 },
  // B2 — upper intermediate (A1 scaffold)
  { id: "formal_writing", title_vi: "Viết trang trọng", title_en: "Formal writing", expected_count: 1 },
  { id: "business", title_vi: "Tiếng Swahili thương mại", title_en: "Business Swahili", expected_count: 1 },
  { id: "conditional", title_vi: "Câu điều kiện", title_en: "Conditionals", expected_count: 1 },
  { id: "passive_voice", title_vi: "Thể bị động", title_en: "Passive voice", expected_count: 1 },
  // C1 — advanced (scaffold)
  { id: "academic", title_vi: "Tiếng Swahili học thuật", title_en: "Academic Swahili", expected_count: 1 },
  { id: "presentations", title_vi: "Thuyết trình chuyên nghiệp", title_en: "Professional presentations", expected_count: 1 },
  { id: "literary", title_vi: "Ngôn ngữ văn chương", title_en: "Literary language", expected_count: 1 },
  { id: "noun_classes", title_vi: "Hệ thống lớp danh từ (ngeli)", title_en: "Noun class system (ngeli)", expected_count: 1 },
  // C1 — advanced (C1 wave)
  { id: "complex_sentences", title_vi: "Xây dựng câu phức", title_en: "Complex sentence building", expected_count: 1 },
  { id: "relative_clauses", title_vi: "Mệnh đề quan hệ chuyên sâu", title_en: "Relative clauses in depth", expected_count: 1 },
  { id: "narrative", title_vi: "Kể chuyện và tường thuật", title_en: "Narrative and storytelling", expected_count: 1 },
  { id: "cultural_nuances", title_vi: "Sắc thái văn hóa trong giao tiếp", title_en: "Cultural nuances in communication", expected_count: 1 },
  // C2 — mastery (C2 wave)
  { id: "academic_discourse", title_vi: "Diễn ngôn học thuật", title_en: "Academic discourse", expected_count: 1 },
  { id: "advanced_grammar", title_vi: "Ngữ pháp nâng cao: chuỗi lớp danh từ", title_en: "Advanced grammar: noun class chains", expected_count: 1 },
  { id: "formal_register", title_vi: "Văn phong trang trọng và kính ngữ", title_en: "Formal register and honorifics", expected_count: 1 },
  { id: "idioms_proverbs", title_vi: "Thành ngữ và tục ngữ (methali)", title_en: "Idioms and proverbs (methali)", expected_count: 1 },
  { id: "legal_admin", title_vi: "Ngôn ngữ pháp lý và hành chính", title_en: "Legal and administrative language", expected_count: 1 },
  { id: "literary_analysis", title_vi: "Phân tích văn học và tu từ", title_en: "Literary analysis and rhetoric", expected_count: 1 },
  { id: "news_editorial", title_vi: "Phân tích tin tức và xã luận", title_en: "News analysis and editorials", expected_count: 1 },
  { id: "philosophical", title_vi: "Diễn ngôn triết học và trừu tượng", title_en: "Philosophical and abstract discourse", expected_count: 1 },
  { id: "political_diplomacy", title_vi: "Ngôn ngữ chính trị và ngoại giao", title_en: "Political and diplomatic language", expected_count: 1 },
  // C2 — mastery (A1 scaffold)
  { id: "literature", title_vi: "Văn học", title_en: "Literature", expected_count: 1 },
  { id: "poetry", title_vi: "Thơ ca (mashairi, tenzi)", title_en: "Poetry (mashairi, tenzi)", expected_count: 1 },
  { id: "political", title_vi: "Diễn ngôn chính trị", title_en: "Political discourse", expected_count: 1 },
  { id: "legal", title_vi: "Ngôn ngữ pháp lý và hành chính", title_en: "Legal and bureaucratic language", expected_count: 1 },
  { id: "humor", title_vi: "Hài hước và châm biếm", title_en: "Humor and satire", expected_count: 1 },
  { id: "fluency", title_vi: "Diễn đạt như người bản xứ", title_en: "Native-level fluency", expected_count: 1 },
];

export const SWAHILI_TOTAL_LESSONS = SWAHILI_CATEGORIES.reduce(
  (sum, c) => sum + c.expected_count,
  0,
);

// Top-level language descriptor for the public page header / language picker.
export const SWAHILI_LANGUAGE_META = {
  /** ISO-639-1 code for Kiswahili. */
  code: "sw",
  /** Endonym shown to learners. */
  nativeName: "Kiswahili",
  /** Vietnamese display name. */
  name_vi: "Tiếng Swahili",
  /** English display name. */
  name_en: "Swahili",
  /** Script is plain Latin — no special rendering / romanization layer. */
  script: "latin",
  /** Swahili carries no tone and consistent penultimate stress — easier footing for VN L1. */
  hasTones: false,
  levels: SWAHILI_VALIDATED_LEVELS,
  totalLessons: SWAHILI_TOTAL_LESSONS,
} as const;

export type SwahiliLanguageMeta = typeof SWAHILI_LANGUAGE_META;
