// src/languages/arabic/lessons.ts
//
// Metadata and source-data contract for the Arabic lesson pack.
//
// Arabic is right-to-left and script-bearing. The canonical target text lives
// in `ar`; romanization is a learner aid only. Display text must preserve the
// authored Arabic script, while answer matching may normalize harakat, tatweel,
// alef/hamza variants, digits, and related typing variance in normalize.ts.
//
// Course stance: Modern Standard Arabic first. Dialect notes are allowed as
// small, labeled learner notes and must not become canonical answer keys unless
// an exercise explicitly teaches dialect recognition.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";

export type ArabicCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type ArabicCategoryId =
  | "script_orientation"
  | "greetings"
  | "introductions"
  | "classroom_survival"
  | "numbers_time"
  | "daily_routine"
  | "shopping"
  | "transport"
  | "appointments"
  | "housing"
  | "housing_public_services"
  | "work"
  | "health"
  | "public_services"
  | "opinions"
  | "past_narration"
  | "meetings"
  | "formal_complaint"
  | "professional_writing"
  | "disagreement"
  | "complex_grammar"
  | "academic_speaking"
  | "academic_writing"
  | "argumentation"
  | "media_analysis"
  | "nuanced_opinion"
  | "media_discussion"
  | "professional_register"
  | "formal_debate"
  | "high_register_debate"
  | "literary_analysis"
  | "literary_media_analysis"
  | "rhetoric"
  | "academic_discourse"
  | "translation_style"
  | "sensitive_discourse";

export type ArabicCategoryMeta = {
  id: ArabicCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type ArabicDialectNote = {
  region: "egyptian" | "levantine" | "gulf" | "maghrebi" | "general-spoken";
  ar?: string;
  romanization?: string;
  note_vi: string;
  note_en: string;
};

export type ArabicSentence = {
  /** Modern Standard Arabic target text. */
  ar: string;
  /** Practical Latin transliteration; learner aid, not answer source of truth. */
  romanization: string;
  en: string;
  vi: string;
  /** Pronunciation hints calibrated for Vietnamese-speaker learners. */
  pronunciation_focus?: string[];
  /** Pronunciation hints calibrated for English-speaker learners. */
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
  dialect_notes?: ArabicDialectNote[];
};

export type ArabicVocabEntry = {
  ar: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
  dialect_notes?: ArabicDialectNote[];
};

export type ArabicDialogueLine = {
  speaker: string;
  ar: string;
  romanization: string;
  en: string;
  vi: string;
  register?: "neutral" | "formal" | "polite" | "colloquial-note";
};

export type ArabicExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
  accepted_answers?: string[];
  hint_vi?: string;
  hint_en?: string;
};

export type ArabicExerciseMatching = {
  type: "matching";
  instruction_vi: string;
  instruction_en: string;
  pairs: Array<{
    ar: string;
    meaning_vi: string;
    meaning_en?: string;
  }>;
};

export type ArabicExerciseTranslation = {
  type: "translation";
  vi: string;
  en: string;
  ar: string;
  romanization?: string;
  accepted_answers?: string[];
};

export type ArabicExercise =
  | ArabicExerciseFillBlank
  | ArabicExerciseMatching
  | ArabicExerciseTranslation;

export type ArabicLesson = {
  id: string;
  category: ArabicCategoryId;
  level: ArabicCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary?: ArabicVocabEntry[];
  sentences: ArabicSentence[];
  dialogue?: ArabicDialogueLine[];
  exercises?: ArabicExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export type ArabicLanguageMeta = {
  code: "ar";
  nativeName: string;
  name_vi: string;
  name_en: string;
  script: string;
  scriptUnicodeRange: string;
  direction: "rtl";
  canonicalRegister: "Modern Standard Arabic";
  levels: ReadonlyArray<ArabicCefrLevel>;
};

export const ARABIC_VALIDATED_LEVELS: ReadonlyArray<ArabicCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const ARABIC_LANGUAGE: ArabicLanguageMeta = {
  code: "ar",
  nativeName: "العربية الفصحى",
  name_vi: "Tiếng Ả Rập chuẩn hiện đại",
  name_en: "Modern Standard Arabic",
  script: "Arabic",
  scriptUnicodeRange: "U+0600-U+06FF",
  direction: "rtl",
  canonicalRegister: "Modern Standard Arabic",
  levels: ARABIC_VALIDATED_LEVELS,
};

export const ARABIC_EXPECTED_LESSON_COUNTS_BY_LEVEL: Record<
  ArabicCefrLevel,
  number
> = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 5,
  C2: 5,
};

export const ARABIC_CATEGORIES: ReadonlyArray<ArabicCategoryMeta> = [
  { id: "script_orientation", title_vi: "Chữ viết và hướng đọc", title_en: "Script and reading direction", expected_count: 1 },
  { id: "greetings", title_vi: "Chào hỏi", title_en: "Greetings", expected_count: 1 },
  { id: "introductions", title_vi: "Giới thiệu bản thân", title_en: "Introductions", expected_count: 1 },
  { id: "classroom_survival", title_vi: "Câu sinh tồn trong lớp học", title_en: "Classroom survival", expected_count: 1 },
  { id: "numbers_time", title_vi: "Số, ngày và giờ", title_en: "Numbers, days, and time", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hằng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "shopping", title_vi: "Mua sắm", title_en: "Shopping", expected_count: 1 },
  { id: "transport", title_vi: "Đi lại", title_en: "Transport", expected_count: 1 },
  { id: "appointments", title_vi: "Đặt lịch hẹn", title_en: "Appointments", expected_count: 1 },
  { id: "housing", title_vi: "Nhà ở", title_en: "Housing", expected_count: 1 },
  { id: "public_services", title_vi: "Dịch vụ công", title_en: "Public services", expected_count: 2 },
  { id: "work", title_vi: "Công việc", title_en: "Work", expected_count: 1 },
  { id: "health", title_vi: "Sức khỏe", title_en: "Health", expected_count: 1 },
  { id: "opinions", title_vi: "Ý kiến và lý do", title_en: "Opinions and reasons", expected_count: 1 },
  { id: "past_narration", title_vi: "Kể chuyện quá khứ", title_en: "Past narration", expected_count: 1 },
  { id: "meetings", title_vi: "Cuộc họp", title_en: "Meetings", expected_count: 1 },
  { id: "formal_complaint", title_vi: "Khiếu nại trang trọng", title_en: "Formal complaint", expected_count: 1 },
  { id: "professional_writing", title_vi: "Viết chuyên nghiệp", title_en: "Professional writing", expected_count: 1 },
  { id: "disagreement", title_vi: "Bất đồng lịch sự", title_en: "Polite disagreement", expected_count: 1 },
  { id: "complex_grammar", title_vi: "Ngữ pháp phức hợp", title_en: "Complex grammar", expected_count: 1 },
  { id: "academic_speaking", title_vi: "Trình bày học thuật", title_en: "Academic speaking", expected_count: 1 },
  { id: "argumentation", title_vi: "Lập luận học thuật", title_en: "Academic argumentation", expected_count: 1 },
  { id: "media_analysis", title_vi: "Phân tích truyền thông", title_en: "Media analysis", expected_count: 1 },
  { id: "professional_register", title_vi: "Văn phong nghề nghiệp", title_en: "Professional register", expected_count: 1 },
  { id: "academic_writing", title_vi: "Viết học thuật", title_en: "Academic writing", expected_count: 1 },
  { id: "literary_analysis", title_vi: "Phân tích văn học", title_en: "Literary analysis", expected_count: 1 },
  { id: "rhetoric", title_vi: "Tu từ và hàm ý", title_en: "Rhetoric and implication", expected_count: 1 },
  { id: "high_register_debate", title_vi: "Tranh biện văn phong cao", title_en: "High-register debate", expected_count: 1 },
  { id: "translation_style", title_vi: "Lựa chọn phong cách dịch", title_en: "Translation style choices", expected_count: 1 },
  { id: "sensitive_discourse", title_vi: "Diễn ngôn nhạy cảm trung lập", title_en: "Neutral sensitive discourse", expected_count: 1 },
];

export const ARABIC_TOTAL_LESSONS = ARABIC_CATEGORIES.reduce(
  (total, category) => total + category.expected_count,
  0,
);
