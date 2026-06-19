// src/languages/portuguese/lessons.ts
//
// Brazilian Portuguese metadata registry for the validated top-level lesson
// files. The public page is not wired yet; these helpers mirror the French
// registry shape while keeping generated extra/** material out of exports.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { PortugueseLessonInput } from "./normalize";

export type PortugueseCefrLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type PortugueseCategoryId =
  | "greetings"
  | "introductions"
  | "numbers"
  | "food"
  | "directions"
  | "daily_routine"
  | "shopping"
  | "transport"
  | "appointments"
  | "housing"
  | "work"
  | "expressions"
  | "past_tense"
  | "health"
  | "house"
  | "arguments"
  | "meetings"
  | "complaints"
  | "subjunctive"
  | "professional_writing"
  | "fluency"
  | "workplace"
  | "literature"
  | "debate"
  | "rhetoric"
  | "register"
  | "academic";

export type PortugueseCategoryMeta = {
  id: PortugueseCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export type PortugueseLesson = PortugueseLessonInput & {
  category: PortugueseCategoryId;
};

export const PORTUGUESE_VALIDATED_LEVELS: ReadonlyArray<PortugueseCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const PORTUGUESE_CATEGORIES: ReadonlyArray<PortugueseCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi", title_en: "Greetings", expected_count: 1 },
  { id: "introductions", title_vi: "Giới thiệu bản thân", title_en: "Introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm", title_en: "Numbers", expected_count: 1 },
  { id: "food", title_vi: "Gọi món và ăn uống", title_en: "Food and ordering", expected_count: 1 },
  { id: "directions", title_vi: "Hỏi đường", title_en: "Directions", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hàng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "shopping", title_vi: "Mua sắm", title_en: "Shopping", expected_count: 2 },
  { id: "transport", title_vi: "Giao thông công cộng", title_en: "Transport", expected_count: 1 },
  { id: "appointments", title_vi: "Đặt lịch hẹn", title_en: "Appointments", expected_count: 1 },
  { id: "housing", title_vi: "Thuê nhà", title_en: "Housing", expected_count: 1 },
  { id: "work", title_vi: "Công việc", title_en: "Work", expected_count: 1 },
  { id: "expressions", title_vi: "Bày tỏ ý kiến", title_en: "Expressions", expected_count: 1 },
  { id: "past_tense", title_vi: "Kể chuyện quá khứ", title_en: "Past tense", expected_count: 1 },
  { id: "health", title_vi: "Sức khỏe", title_en: "Health", expected_count: 1 },
  { id: "house", title_vi: "Sự cố nhà cửa", title_en: "House problems", expected_count: 1 },
  { id: "arguments", title_vi: "Tranh luận lịch sự", title_en: "Polite disagreement", expected_count: 1 },
  { id: "meetings", title_vi: "Điều hành cuộc họp", title_en: "Running meetings", expected_count: 1 },
  { id: "complaints", title_vi: "Khiếu nại trang trọng", title_en: "Formal complaints", expected_count: 1 },
  { id: "subjunctive", title_vi: "Thức giả định", title_en: "Subjunctive", expected_count: 1 },
  { id: "professional_writing", title_vi: "Viết chuyên nghiệp", title_en: "Professional writing", expected_count: 1 },
  { id: "fluency", title_vi: "Diễn đạt lưu loát", title_en: "Fluency", expected_count: 3 },
  { id: "workplace", title_vi: "Công sở nâng cao", title_en: "Advanced workplace", expected_count: 1 },
  { id: "literature", title_vi: "Phân tích văn học", title_en: "Literature", expected_count: 1 },
  { id: "debate", title_vi: "Tranh biện trang trọng", title_en: "Formal debate", expected_count: 1 },
  { id: "rhetoric", title_vi: "Tu từ và hàm ý", title_en: "Rhetoric and subtext", expected_count: 1 },
  { id: "register", title_vi: "Sắc thái đăng ký ngôn ngữ", title_en: "Register", expected_count: 1 },
  { id: "academic", title_vi: "Diễn ngôn học thuật", title_en: "Academic discourse", expected_count: 1 },
];

export const PORTUGUESE_TOTAL_LESSONS = 30;

