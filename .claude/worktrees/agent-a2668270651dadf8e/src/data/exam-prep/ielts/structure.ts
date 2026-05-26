// src/data/exam-prep/ielts/structure.ts
//
// IELTS Academic structure metadata. This file is the source of truth
// for time budgets, question counts, and section IDs across the prep
// pages and band estimator.
//
// We deliberately model the canonical Academic version (the Vietnamese
// diaspora taking IELTS for AU/CA/UK migration is overwhelmingly
// Academic; General Training has the same band scale and different
// Reading/Writing prompts only). Adding a `mode: "academic" | "general"`
// flag is a follow-up if Chau decides to support both.
//
// All durations are stored in seconds so timer components can work
// without conversion. UI surfaces convert to "X min" via secondsToMinutes.

export type IELTSSectionId = "listening" | "reading" | "writing" | "speaking";

export type IELTSWritingTaskId = "writing_task_1" | "writing_task_2";

export type IELTSSpeakingPartId =
  | "speaking_part_1"
  | "speaking_part_2"
  | "speaking_part_3";

export type IELTSSection = {
  id: IELTSSectionId;
  /** Section name in English. UI keeps Vietnamese in display layer. */
  name_en: string;
  name_vi: string;
  /** Total clock time the test allots, in seconds. */
  durationSec: number;
  /** Question count for sections that use a fixed count. */
  questionCount: number | null;
  /** Brief Vietnamese learner note shown on the overview card. */
  description_vi: string;
};

export const IELTS_SECTIONS: ReadonlyArray<IELTSSection> = [
  {
    id: "listening",
    name_en: "Listening",
    name_vi: "Nghe",
    durationSec: 30 * 60,
    questionCount: 40,
    description_vi:
      "4 đoạn ghi âm, tăng dần độ khó. Tổng 40 câu hỏi trong 30 phút (chưa tính 10 phút chuyển đáp án ở bài thi giấy).",
  },
  {
    id: "reading",
    name_en: "Reading",
    name_vi: "Đọc",
    durationSec: 60 * 60,
    questionCount: 40,
    description_vi:
      "3 bài đọc dài, 40 câu hỏi, 60 phút. Đề Academic dùng văn bản học thuật; đề General Training nhẹ hơn.",
  },
  {
    id: "writing",
    name_en: "Writing",
    name_vi: "Viết",
    durationSec: 60 * 60,
    questionCount: 2,
    description_vi:
      "Hai bài: Task 1 (mô tả biểu đồ — 150 từ — 20 phút) và Task 2 (bài luận — 250 từ — 40 phút).",
  },
  {
    id: "speaking",
    name_en: "Speaking",
    name_vi: "Nói",
    durationSec: 14 * 60,
    questionCount: null,
    description_vi:
      "Phỏng vấn 1-1 với giám khảo, kéo dài 11–14 phút, gồm Part 1 (giới thiệu), Part 2 (bài nói dài), Part 3 (thảo luận).",
  },
] as const;

export const IELTS_WRITING_TASKS: ReadonlyArray<{
  id: IELTSWritingTaskId;
  /** Required minimum word count. */
  minWords: number;
  /** Recommended time, seconds. */
  recommendedSec: number;
  prompt_vi_summary: string;
  prompt_en_summary: string;
}> = [
  {
    id: "writing_task_1",
    minWords: 150,
    recommendedSec: 20 * 60,
    prompt_vi_summary:
      "Mô tả biểu đồ, bảng số liệu, hoặc sơ đồ trong khoảng 150 từ.",
    prompt_en_summary:
      "Describe a chart, table, or diagram in at least 150 words.",
  },
  {
    id: "writing_task_2",
    minWords: 250,
    recommendedSec: 40 * 60,
    prompt_vi_summary:
      "Viết bài luận khoảng 250 từ trả lời một câu hỏi/quan điểm.",
    prompt_en_summary:
      "Write a 250-word essay responding to a question or opinion prompt.",
  },
];

export const IELTS_SPEAKING_PARTS: ReadonlyArray<{
  id: IELTSSpeakingPartId;
  durationSec: number;
  description_vi: string;
}> = [
  {
    id: "speaking_part_1",
    durationSec: 5 * 60,
    description_vi:
      "Giới thiệu — giám khảo hỏi 4–5 câu về bản thân, công việc, sở thích.",
  },
  {
    id: "speaking_part_2",
    durationSec: 4 * 60,
    description_vi:
      "Bài nói dài — bạn có 1 phút chuẩn bị, sau đó nói liên tục 1–2 phút về một chủ đề.",
  },
  {
    id: "speaking_part_3",
    durationSec: 5 * 60,
    description_vi:
      "Thảo luận — câu hỏi sâu hơn liên quan đến chủ đề Part 2.",
  },
];

export function secondsToMinutes(sec: number): number {
  return Math.round(sec / 60);
}

export function getSection(id: IELTSSectionId): IELTSSection | undefined {
  return IELTS_SECTIONS.find((s) => s.id === id);
}
