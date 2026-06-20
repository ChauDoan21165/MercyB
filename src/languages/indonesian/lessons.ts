// src/languages/indonesian/lessons.ts
//
// Indonesian (Bahasa Indonesia) metadata registry for the validated top-level
// lesson files. The public page is not wired yet; these helpers mirror the
// Portuguese registry shape while keeping generated extra/** material out of
// exports.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { IndonesianLessonInput } from "./normalize";

export type IndonesianCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type IndonesianCategoryId =
  | "greetings"
  | "introductions"
  | "numbers"
  | "questions"
  | "food"
  | "directions"
  | "family"
  | "daily_routine"
  | "shopping"
  | "transport"
  | "time"
  | "weather"
  | "housing"
  | "workplace"
  | "opinions"
  | "past_future"
  | "healthcare"
  | "register"
  | "media"
  | "formal_writing"
  | "business"
  | "debate"
  | "conditional"
  | "passive_voice"
  | "academic"
  | "presentations"
  | "literary"
  | "affixation"
  | "literature"
  | "poetry"
  | "political"
  | "legal"
  | "humor"
  | "fluency";

export type IndonesianCategoryMeta = {
  id: IndonesianCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type IndonesianLesson = IndonesianLessonInput & {
  category: IndonesianCategoryId;
};

export const INDONESIAN_VALIDATED_LEVELS: ReadonlyArray<IndonesianCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const INDONESIAN_CATEGORIES: ReadonlyArray<IndonesianCategoryMeta> = [
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
  // B1 — intermediate
  { id: "workplace", title_vi: "Công việc", title_en: "Workplace", expected_count: 1 },
  { id: "opinions", title_vi: "Bày tỏ ý kiến", title_en: "Opinions", expected_count: 1 },
  { id: "past_future", title_vi: "Quá khứ và tương lai", title_en: "Past and future", expected_count: 1 },
  { id: "healthcare", title_vi: "Y tế", title_en: "Healthcare", expected_count: 1 },
  { id: "register", title_vi: "Trang trọng và thân mật", title_en: "Formal vs informal register", expected_count: 1 },
  // B2 — upper intermediate
  { id: "media", title_vi: "Tin tức và truyền thông", title_en: "News and media", expected_count: 1 },
  { id: "formal_writing", title_vi: "Viết trang trọng", title_en: "Formal writing", expected_count: 1 },
  { id: "business", title_vi: "Tiếng Indonesia thương mại", title_en: "Business Indonesian", expected_count: 1 },
  { id: "debate", title_vi: "Tranh luận quan điểm", title_en: "Debating opinions", expected_count: 1 },
  { id: "conditional", title_vi: "Câu điều kiện", title_en: "Conditionals", expected_count: 1 },
  { id: "passive_voice", title_vi: "Thể bị động (di-)", title_en: "Passive voice (di-)", expected_count: 1 },
  // C1 — advanced
  { id: "academic", title_vi: "Tiếng Indonesia học thuật", title_en: "Academic Indonesian", expected_count: 1 },
  { id: "presentations", title_vi: "Thuyết trình chuyên nghiệp", title_en: "Professional presentations", expected_count: 1 },
  { id: "literary", title_vi: "Ngôn ngữ văn chương", title_en: "Literary language", expected_count: 1 },
  { id: "affixation", title_vi: "Phụ tố nâng cao", title_en: "Advanced affixation", expected_count: 1 },
  // C2 — mastery
  { id: "literature", title_vi: "Văn học", title_en: "Literature", expected_count: 1 },
  { id: "poetry", title_vi: "Thơ ca (pantun, gurindam)", title_en: "Poetry (pantun, gurindam)", expected_count: 1 },
  { id: "political", title_vi: "Diễn ngôn chính trị", title_en: "Political discourse", expected_count: 1 },
  { id: "legal", title_vi: "Ngôn ngữ pháp lý và hành chính", title_en: "Legal and bureaucratic language", expected_count: 1 },
  { id: "humor", title_vi: "Hài hước và châm biếm", title_en: "Humor and satire", expected_count: 1 },
  { id: "fluency", title_vi: "Diễn đạt như người bản xứ", title_en: "Native-level fluency", expected_count: 1 },
];

export const INDONESIAN_TOTAL_LESSONS = INDONESIAN_CATEGORIES.reduce(
  (sum, c) => sum + c.expected_count,
  0,
);

// Top-level language descriptor for the public page header / language picker.
export const INDONESIAN_LANGUAGE_META = {
  /** ISO-639-1 code for Bahasa Indonesia. */
  code: "id",
  /** Endonym shown to learners. */
  nativeName: "Bahasa Indonesia",
  /** Vietnamese display name. */
  name_vi: "Tiếng Indonesia",
  /** English display name. */
  name_en: "Indonesian",
  /** Script is plain Latin — no special rendering / romanization layer. */
  script: "latin",
  /** Indonesian carries no tone and no inflection — easier footing for VN L1. */
  hasTones: false,
  levels: INDONESIAN_VALIDATED_LEVELS,
  totalLessons: INDONESIAN_TOTAL_LESSONS,
} as const;

export type IndonesianLanguageMeta = typeof INDONESIAN_LANGUAGE_META;
