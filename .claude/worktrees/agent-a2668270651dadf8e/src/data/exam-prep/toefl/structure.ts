// src/data/exam-prep/toefl/structure.ts
//
// TOEFL iBT structure metadata (post-July 2023 "TOEFL iBT Enhanced"
// format). This file is the source of truth for time budgets, question
// counts, task counts, and section IDs across TOEFL prep pages and the
// score estimator.
//
// The 2023 revision shortened the test from ~3 hours to <2 hours:
//   - Reading: 2 passages (was 3–4), 20 questions, ~35 min
//   - Listening: 3 lectures + 2 conversations, 28 questions, ~36 min
//   - Speaking: 4 tasks, ~16 min
//   - Writing: 2 tasks, ~29 min
//
// Scoring: 0–30 per section → 0–120 total. No penalty for wrong answers.
//
// All durations are stored in seconds so timer components can work
// without conversion. UI surfaces convert to "X min" via secondsToMinutes.

export type TOEFLSectionId = "reading" | "listening" | "speaking" | "writing";

export type TOEFLReadingPassageId = "reading_passage_1" | "reading_passage_2";

export type TOEFLListeningItemId =
  | "listening_conversation_1"
  | "listening_conversation_2"
  | "listening_lecture_1"
  | "listening_lecture_2"
  | "listening_lecture_3";

export type TOEFLSpeakingTaskId =
  | "speaking_task_1"
  | "speaking_task_2"
  | "speaking_task_3"
  | "speaking_task_4";

export type TOEFLWritingTaskId = "writing_task_1" | "writing_task_2";

export type TOEFLSection = {
  id: TOEFLSectionId;
  /** Section name in English. UI keeps Vietnamese in display layer. */
  name_en: string;
  name_vi: string;
  /** Total clock time the test allots, in seconds. */
  durationSec: number;
  /** Question/task count for sections that use a fixed count. */
  questionCount: number;
  /** Brief Vietnamese learner note shown on the overview card. */
  description_vi: string;
};

export const TOEFL_SECTIONS: ReadonlyArray<TOEFLSection> = [
  {
    id: "reading",
    name_en: "Reading",
    name_vi: "Đọc",
    durationSec: 35 * 60,
    questionCount: 20,
    description_vi:
      "2 đoạn văn học thuật, mỗi đoạn 10 câu hỏi. Tổng 20 câu trong 35 phút. Đề tài từ khoa học, lịch sử, nghệ thuật đến xã hội học.",
  },
  {
    id: "listening",
    name_en: "Listening",
    name_vi: "Nghe",
    durationSec: 36 * 60,
    questionCount: 28,
    description_vi:
      "3 bài giảng + 2 hội thoại, tổng 28 câu hỏi trong 36 phút. Giọng Bắc Mỹ là chính, có thể có giọng Anh, Úc, New Zealand.",
  },
  {
    id: "speaking",
    name_en: "Speaking",
    name_vi: "Nói",
    durationSec: 16 * 60,
    questionCount: 4,
    description_vi:
      "4 task: 1 task độc lập (ý kiến cá nhân) + 3 task tích hợp (đọc/nghe rồi nói). Tổng ~16 phút. Nói vào micro, máy ghi âm gửi về ETS chấm.",
  },
  {
    id: "writing",
    name_en: "Writing",
    name_vi: "Viết",
    durationSec: 29 * 60,
    questionCount: 2,
    description_vi:
      "Task 1: Integrated Writing — đọc + nghe rồi viết tóm tắt (~20 phút). Task 2: Writing for an Academic Discussion — viết bài đóng góp ý kiến (~10 phút).",
  },
] as const;

// ── Reading detail ───────────────────────────────────────────────────────────

export const TOEFL_READING_PASSAGES: ReadonlyArray<{
  id: TOEFLReadingPassageId;
  name_en: string;
  name_vi: string;
  questionCount: number;
}> = [
  {
    id: "reading_passage_1",
    name_en: "Passage 1",
    name_vi: "Đoạn 1",
    questionCount: 10,
  },
  {
    id: "reading_passage_2",
    name_en: "Passage 2",
    name_vi: "Đoạn 2",
    questionCount: 10,
  },
];

// ── Listening detail ─────────────────────────────────────────────────────────

export const TOEFL_LISTENING_ITEMS: ReadonlyArray<{
  id: TOEFLListeningItemId;
  type: "conversation" | "lecture";
  name_en: string;
  name_vi: string;
  /** Typical question count for this item type. */
  questionCount: number;
}> = [
  {
    id: "listening_conversation_1",
    type: "conversation",
    name_en: "Conversation 1",
    name_vi: "Hội thoại 1",
    questionCount: 5,
  },
  {
    id: "listening_conversation_2",
    type: "conversation",
    name_en: "Conversation 2",
    name_vi: "Hội thoại 2",
    questionCount: 5,
  },
  {
    id: "listening_lecture_1",
    type: "lecture",
    name_en: "Lecture 1",
    name_vi: "Bài giảng 1",
    questionCount: 6,
  },
  {
    id: "listening_lecture_2",
    type: "lecture",
    name_en: "Lecture 2",
    name_vi: "Bài giảng 2",
    questionCount: 6,
  },
  {
    id: "listening_lecture_3",
    type: "lecture",
    name_en: "Lecture 3",
    name_vi: "Bài giảng 3",
    questionCount: 6,
  },
];

// ── Speaking detail ──────────────────────────────────────────────────────────

export const TOEFL_SPEAKING_TASKS: ReadonlyArray<{
  id: TOEFLSpeakingTaskId;
  /** "independent" = personal opinion; "integrated" = read/listen then speak. */
  type: "independent" | "integrated";
  /** Preparation time in seconds (after prompt, before recording). */
  preparationSec: number;
  /** Speaking time in seconds. */
  speakingSec: number;
  description_vi: string;
}> = [
  {
    id: "speaking_task_1",
    type: "independent",
    preparationSec: 15,
    speakingSec: 45,
    description_vi:
      "Independent Speaking — nói về ý kiến cá nhân. 15 giây chuẩn bị, 45 giây trả lời.",
  },
  {
    id: "speaking_task_2",
    type: "integrated",
    preparationSec: 30,
    speakingSec: 60,
    description_vi:
      "Integrated Speaking — đọc + nghe (campus situation), 30 giây chuẩn bị, 60 giây trả lời.",
  },
  {
    id: "speaking_task_3",
    type: "integrated",
    preparationSec: 30,
    speakingSec: 60,
    description_vi:
      "Integrated Speaking — đọc + nghe (academic topic), 30 giây chuẩn bị, 60 giây trả lời.",
  },
  {
    id: "speaking_task_4",
    type: "integrated",
    preparationSec: 20,
    speakingSec: 60,
    description_vi:
      "Integrated Speaking — chỉ nghe (academic lecture), 20 giây chuẩn bị, 60 giây trả lời.",
  },
];

// ── Writing detail ───────────────────────────────────────────────────────────

export const TOEFL_WRITING_TASKS: ReadonlyArray<{
  id: TOEFLWritingTaskId;
  type: "integrated" | "academic_discussion";
  /** Recommended word count (guideline, not hard limit). */
  recommendedWords: number;
  /** Recommended time, seconds. */
  recommendedSec: number;
  description_vi: string;
}> = [
  {
    id: "writing_task_1",
    type: "integrated",
    recommendedWords: 150,
    recommendedSec: 20 * 60,
    description_vi:
      "Integrated Writing — đọc một đoạn ngắn, nghe một bài giảng ngắn, rồi viết tóm tắt cách bài giảng phản biện hoặc bổ sung cho bài đọc. Khoảng 150–225 từ.",
  },
  {
    id: "writing_task_2",
    type: "academic_discussion",
    recommendedWords: 100,
    recommendedSec: 10 * 60,
    description_vi:
      "Writing for an Academic Discussion — đọc ý kiến của giáo sư và 2 sinh viên trong một diễn đàn online, rồi viết bài đóng góp ý kiến riêng. Khoảng 100 từ.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function secondsToMinutes(sec: number): number {
  return Math.round(sec / 60);
}

export function getSection(id: TOEFLSectionId): TOEFLSection | undefined {
  return TOEFL_SECTIONS.find((s) => s.id === id);
}

/** Total questions/tasks across all four sections. */
export const TOEFL_TOTAL_QUESTIONS = TOEFL_SECTIONS.reduce(
  (sum, s) => sum + s.questionCount,
  0,
);

/** Total test duration in minutes (approximate). */
export const TOEFL_TOTAL_DURATION_MIN = secondsToMinutes(
  TOEFL_SECTIONS.reduce((sum, s) => sum + s.durationSec, 0),
);
