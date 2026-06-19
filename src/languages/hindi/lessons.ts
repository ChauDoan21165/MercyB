// src/languages/hindi/lessons.ts
//
// Metadata and source-data contract for the Hindi lesson pack.
//
// Hindi is Devanagari/LTR. The canonical target text lives in `hi`;
// romanization is a learner aid only. Display text must preserve lesson
// Devanagari as written, while answer matching may normalize carefully documented typing
// variance in normalize.ts.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";

export type HindiCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type HindiCategoryId =
  | "script_orientation"
  | "greetings"
  | "introductions"
  | "classroom_survival"
  | "numbers_time"
  | "daily_routine"
  | "family_people"
  | "food_shopping"
  | "transport_directions"
  | "health_appointments"
  | "housing_public_services"
  | "work_tasks"
  | "past_narration"
  | "public_services"
  | "health_pharmacy"
  | "opinions_reasons"
  | "meetings"
  | "formal_request_complaint"
  | "polite_disagreement"
  | "media_summary"
  | "professional_email"
  | "academic_presentation"
  | "report_analysis"
  | "nuanced_argument"
  | "media_discourse"
  | "professional_register"
  | "formal_debate"
  | "literary_analysis"
  | "rhetoric_subtext"
  | "register_style"
  | "hindi_urdu_register";

export type HindiCategoryMeta = {
  id: HindiCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type HindiSentence = {
  /** Standard Hindi target text in Devanagari. */
  hi: string;
  /** Practical learner romanization; not the answer source of truth. */
  romanization: string;
  en: string;
  vi: string;
  /** Pronunciation hints calibrated for Vietnamese-speaker learners. */
  pronunciation_focus?: string[];
  /** Pronunciation hints calibrated for English-speaker learners. */
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type HindiDialogueLine = {
  speaker: string;
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  register?: "neutral" | "polite" | "formal" | "spoken-note";
};

export type HindiExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
  accepted_answers?: string[];
  accepted_romanizations?: string[];
  hint_vi?: string;
  hint_en?: string;
};

export type HindiExerciseMatching = {
  type: "matching";
  instruction_vi: string;
  instruction_en: string;
  pairs: Array<{
    hi: string;
    meaning_vi: string;
    meaning_en?: string;
  }>;
};

export type HindiExerciseTranslation = {
  type: "translation";
  vi: string;
  en: string;
  hi: string;
  romanization?: string;
  accepted_answers?: string[];
  accepted_romanizations?: string[];
};

export type HindiExercise =
  | HindiExerciseFillBlank
  | HindiExerciseMatching
  | HindiExerciseTranslation;

export type HindiLesson = {
  id: string;
  category: HindiCategoryId;
  level: HindiCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary?: HindiVocabEntry[];
  sentences: HindiSentence[];
  dialogue?: HindiDialogueLine[];
  exercises?: HindiExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export type HindiLanguageMeta = {
  code: "hi";
  nativeName: string;
  name_vi: string;
  name_en: string;
  script: string;
  scriptUnicodeRange: string;
  direction: "ltr";
  canonicalRegister: "Standard Hindi";
  levels: ReadonlyArray<HindiCefrLevel>;
};

export const HINDI_VALIDATED_LEVELS: ReadonlyArray<HindiCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const HINDI_LANGUAGE: HindiLanguageMeta = {
  code: "hi",
  nativeName: "हिन्दी",
  name_vi: "Tiếng Hindi",
  name_en: "Hindi",
  script: "Devanagari",
  scriptUnicodeRange: "U+0900-U+097F",
  direction: "ltr",
  canonicalRegister: "Standard Hindi",
  levels: HINDI_VALIDATED_LEVELS,
};

export const HINDI_EXPECTED_LESSON_COUNTS_BY_LEVEL: Record<
  HindiCefrLevel,
  number
> = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 5,
  C2: 5,
};

export const HINDI_CATEGORIES: ReadonlyArray<HindiCategoryMeta> = [
  { id: "script_orientation", title_vi: "Chữ Devanagari và hướng đọc", title_en: "Devanagari and reading direction", expected_count: 1 },
  { id: "greetings", title_vi: "Chào hỏi và lịch sự", title_en: "Greetings and politeness", expected_count: 1 },
  { id: "introductions", title_vi: "Giới thiệu bản thân", title_en: "Introductions", expected_count: 1 },
  { id: "classroom_survival", title_vi: "Câu sinh tồn trong lớp học", title_en: "Classroom survival", expected_count: 1 },
  { id: "numbers_time", title_vi: "Số, ngày và giờ", title_en: "Numbers, days, and time", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hằng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "family_people", title_vi: "Gia đình và con người", title_en: "Family and people", expected_count: 1 },
  { id: "food_shopping", title_vi: "Ăn uống và mua sắm", title_en: "Food and shopping", expected_count: 1 },
  { id: "transport_directions", title_vi: "Đi lại và hỏi đường", title_en: "Transport and directions", expected_count: 1 },
  { id: "health_appointments", title_vi: "Sức khỏe và lịch hẹn", title_en: "Health and appointments", expected_count: 1 },
  { id: "housing_public_services", title_vi: "Nhà ở và dịch vụ công", title_en: "Housing and public services", expected_count: 1 },
  { id: "work_tasks", title_vi: "Công việc và hạn chót", title_en: "Work tasks and deadlines", expected_count: 1 },
  { id: "past_narration", title_vi: "Kể chuyện quá khứ", title_en: "Past narration", expected_count: 1 },
  { id: "public_services", title_vi: "Giấy tờ và dịch vụ công", title_en: "Documents and public services", expected_count: 1 },
  { id: "health_pharmacy", title_vi: "Hiệu thuốc và theo dõi sức khỏe", title_en: "Pharmacy and health follow-up", expected_count: 1 },
  { id: "opinions_reasons", title_vi: "Ý kiến và lý do", title_en: "Opinions and reasons", expected_count: 1 },
  { id: "meetings", title_vi: "Cuộc họp", title_en: "Meetings", expected_count: 1 },
  { id: "formal_request_complaint", title_vi: "Yêu cầu và khiếu nại trang trọng", title_en: "Formal requests and complaints", expected_count: 1 },
  { id: "polite_disagreement", title_vi: "Bất đồng lịch sự", title_en: "Polite disagreement", expected_count: 1 },
  { id: "media_summary", title_vi: "Tóm tắt truyền thông", title_en: "Media summary", expected_count: 1 },
  { id: "professional_email", title_vi: "Email chuyên nghiệp", title_en: "Professional email", expected_count: 1 },
  { id: "academic_presentation", title_vi: "Trình bày học thuật", title_en: "Academic presentation", expected_count: 1 },
  { id: "report_analysis", title_vi: "Tóm tắt và phân tích báo cáo", title_en: "Report summary and analysis", expected_count: 1 },
  { id: "nuanced_argument", title_vi: "Lập luận có sắc thái", title_en: "Nuanced argument", expected_count: 1 },
  { id: "media_discourse", title_vi: "Diễn ngôn truyền thông", title_en: "Media discourse", expected_count: 1 },
  { id: "professional_register", title_vi: "Chuyển đổi văn phong nghề nghiệp", title_en: "Professional register switching", expected_count: 1 },
  { id: "formal_debate", title_vi: "Tranh biện trang trọng", title_en: "Formal debate", expected_count: 1 },
  { id: "literary_analysis", title_vi: "Phân tích văn học", title_en: "Literary analysis", expected_count: 1 },
  { id: "rhetoric_subtext", title_vi: "Tu từ và hàm ý", title_en: "Rhetoric and subtext", expected_count: 1 },
  { id: "register_style", title_vi: "Văn phong và đăng ký ngôn ngữ", title_en: "Register and style", expected_count: 1 },
  { id: "hindi_urdu_register", title_vi: "Nhận biết Hindi/Urdu theo văn phong", title_en: "Hindi/Urdu register awareness", expected_count: 1 },
];

export const HINDI_TOTAL_LESSONS = HINDI_CATEGORIES.reduce(
  (total, category) => total + category.expected_count,
  0,
);
