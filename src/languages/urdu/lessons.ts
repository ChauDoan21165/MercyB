// src/languages/urdu/lessons.ts
//
// Metadata and source-data contract for the Urdu lesson pack.
//
// Urdu is right-to-left and script-bearing. The canonical target text lives in
// `ur`; romanization is a learner aid only. Display text must preserve authored
// Urdu script, while answer matching may normalize optional diacritics, tatweel,
// keyboard letter variants, digits, punctuation, and whitespace in normalize.ts.
//
// Course stance: educated everyday Urdu first, then formal/professional/media
// registers. Hindi/Hindustani grammar can guide curriculum planning, but Urdu
// remains its own product module because script, directionality, typography,
// vocabulary/register, and normalization risks differ.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";

export type UrduCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type UrduCategoryId =
  | "script_orientation"
  | "greetings_politeness"
  | "introductions_identity"
  | "classroom_survival"
  | "numbers_time_prices"
  | "daily_routine"
  | "family_home"
  | "food_shopping"
  | "transport_directions"
  | "appointments_health"
  | "housing_public_services"
  | "workplace_tasks"
  | "past_narration"
  | "health"
  | "public_services"
  | "opinions_reasons"
  | "meetings_agenda"
  | "formal_request_complaint"
  | "summary_media"
  | "polite_disagreement"
  | "professional_writing"
  | "academic_presentation"
  | "professional_correspondence"
  | "media_discussion"
  | "nuanced_argument"
  | "report_findings"
  | "formal_debate"
  | "literary_media_analysis"
  | "translation_style"
  | "rhetoric_subtext"
  | "register_revision";

export type UrduCategoryMeta = {
  id: UrduCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type UrduRegisterNote = {
  register: "everyday" | "polite" | "formal" | "professional" | "media" | "literary";
  note_vi: string;
  note_en: string;
};

export type UrduSentence = {
  /** Urdu target text in Perso-Arabic script. */
  ur: string;
  /** Practical learner romanization; support only, not answer source of truth. */
  romanization: string;
  en: string;
  vi: string;
  /** Pronunciation hints calibrated for Vietnamese-speaker learners. */
  pronunciation_focus?: string[];
  /** Pronunciation hints calibrated for English-speaker learners. */
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
  register_notes?: UrduRegisterNote[];
};

export type UrduVocabEntry = {
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
  register_notes?: UrduRegisterNote[];
};

export type UrduDialogueLine = {
  speaker: string;
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  register?: "neutral" | "polite" | "formal" | "professional";
};

export type UrduExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
  accepted_answers?: string[];
  hint_vi?: string;
  hint_en?: string;
};

export type UrduExerciseMatching = {
  type: "matching";
  instruction_vi: string;
  instruction_en: string;
  pairs: Array<{
    ur: string;
    meaning_vi: string;
    meaning_en?: string;
  }>;
};

export type UrduExerciseTranslation = {
  type: "translation";
  vi: string;
  en: string;
  ur: string;
  romanization?: string;
  accepted_answers?: string[];
};

export type UrduExercise =
  | UrduExerciseFillBlank
  | UrduExerciseMatching
  | UrduExerciseTranslation;

export type UrduLesson = {
  id: string;
  category: UrduCategoryId;
  level: UrduCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary?: UrduVocabEntry[];
  sentences: UrduSentence[];
  dialogue?: UrduDialogueLine[];
  exercises?: UrduExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export type UrduLanguageMeta = {
  code: "ur";
  nativeName: string;
  name_vi: string;
  name_en: string;
  script: string;
  scriptUnicodeRange: string;
  direction: "rtl";
  canonicalRegister: "Educated everyday Urdu";
  typographyNote: string;
  levels: ReadonlyArray<UrduCefrLevel>;
};

export const URDU_VALIDATED_LEVELS: ReadonlyArray<UrduCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const URDU_LANGUAGE: UrduLanguageMeta = {
  code: "ur",
  nativeName: "اردو",
  name_vi: "Tiếng Urdu",
  name_en: "Urdu",
  script: "Urdu Perso-Arabic",
  scriptUnicodeRange: "U+0600-U+06FF",
  direction: "rtl",
  canonicalRegister: "Educated everyday Urdu",
  typographyNote:
    "Urdu should render native text with scoped dir=\"rtl\" lang=\"ur\". Nastaliq is preferred culturally, but no font promise is made in W2.",
  levels: URDU_VALIDATED_LEVELS,
};

export const URDU_EXPECTED_LESSON_COUNTS_BY_LEVEL: Record<
  UrduCefrLevel,
  number
> = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 5,
  C2: 5,
};

export const URDU_CATEGORIES: ReadonlyArray<UrduCategoryMeta> = [
  { id: "script_orientation", title_vi: "Chữ Urdu và hướng đọc", title_en: "Urdu script and reading direction", expected_count: 1 },
  { id: "greetings_politeness", title_vi: "Chào hỏi và lịch sự", title_en: "Greetings and politeness", expected_count: 1 },
  { id: "introductions_identity", title_vi: "Giới thiệu bản thân", title_en: "Introductions and identity", expected_count: 1 },
  { id: "classroom_survival", title_vi: "Câu sinh tồn trong lớp học", title_en: "Classroom survival", expected_count: 1 },
  { id: "numbers_time_prices", title_vi: "Số, giờ và giá cả", title_en: "Numbers, time, and prices", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hằng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "family_home", title_vi: "Gia đình và nhà cửa", title_en: "Family and home", expected_count: 1 },
  { id: "food_shopping", title_vi: "Ăn uống và mua sắm", title_en: "Food and shopping", expected_count: 1 },
  { id: "transport_directions", title_vi: "Đi lại và hỏi đường", title_en: "Transport and directions", expected_count: 1 },
  { id: "appointments_health", title_vi: "Lịch hẹn và sức khỏe cơ bản", title_en: "Appointments and health basics", expected_count: 1 },
  { id: "housing_public_services", title_vi: "Nhà ở và dịch vụ công", title_en: "Housing and public services", expected_count: 1 },
  { id: "workplace_tasks", title_vi: "Nhiệm vụ công việc", title_en: "Workplace tasks", expected_count: 1 },
  { id: "past_narration", title_vi: "Kể chuyện quá khứ", title_en: "Past narration", expected_count: 1 },
  { id: "health", title_vi: "Sức khỏe", title_en: "Health", expected_count: 1 },
  { id: "public_services", title_vi: "Dịch vụ công", title_en: "Public services", expected_count: 1 },
  { id: "opinions_reasons", title_vi: "Ý kiến và lý do", title_en: "Opinions and reasons", expected_count: 1 },
  { id: "meetings_agenda", title_vi: "Cuộc họp và chương trình", title_en: "Meetings and agenda", expected_count: 1 },
  { id: "formal_request_complaint", title_vi: "Yêu cầu và khiếu nại trang trọng", title_en: "Formal request and complaint", expected_count: 1 },
  { id: "summary_media", title_vi: "Tóm tắt truyền thông", title_en: "Summary and media comprehension", expected_count: 1 },
  { id: "polite_disagreement", title_vi: "Bất đồng lịch sự", title_en: "Polite disagreement", expected_count: 1 },
  { id: "professional_writing", title_vi: "Viết chuyên nghiệp", title_en: "Professional writing", expected_count: 1 },
  { id: "academic_presentation", title_vi: "Trình bày học thuật", title_en: "Academic presentation", expected_count: 1 },
  { id: "professional_correspondence", title_vi: "Thư từ chuyên nghiệp", title_en: "Professional correspondence", expected_count: 1 },
  { id: "media_discussion", title_vi: "Thảo luận truyền thông", title_en: "Media discussion and attribution", expected_count: 1 },
  { id: "nuanced_argument", title_vi: "Lập luận có sắc thái", title_en: "Nuanced argument", expected_count: 1 },
  { id: "report_findings", title_vi: "Báo cáo kết quả và khuyến nghị", title_en: "Report findings and recommendations", expected_count: 1 },
  { id: "formal_debate", title_vi: "Tranh biện trang trọng", title_en: "Formal debate", expected_count: 1 },
  { id: "literary_media_analysis", title_vi: "Phân tích văn học và truyền thông", title_en: "Literary and media analysis", expected_count: 1 },
  { id: "translation_style", title_vi: "Lựa chọn phong cách dịch", title_en: "Translation style choices", expected_count: 1 },
  { id: "rhetoric_subtext", title_vi: "Tu từ và hàm ý", title_en: "Rhetoric and subtext", expected_count: 1 },
  { id: "register_revision", title_vi: "Chỉnh sửa văn phong", title_en: "Register switching and revision", expected_count: 1 },
];

export const URDU_TOTAL_LESSONS = URDU_CATEGORIES.reduce(
  (total, category) => total + category.expected_count,
  0,
);
