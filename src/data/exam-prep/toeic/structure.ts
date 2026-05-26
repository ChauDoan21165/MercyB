// Step 11 — TOEIC Listening & Reading test structure.
//
// Authoritative reference for the official TOEIC L&R format:
//   - 200 questions total (100 Listening + 100 Reading)
//   - Listening: 4 parts, ~45 minutes
//   - Reading: 3 parts, 75 minutes
//   - Total time (excluding paperwork): 120 minutes
//
// MercyBlade ships ORIGINAL practice content modeled on the TOEIC
// format. We do not redistribute real ETS questions. The numbers
// below match official ETS section structure so practice timing
// translates 1:1 to the real exam.

export type TOEICPartId =
  | "listening_photographs"
  | "listening_question_response"
  | "listening_conversations"
  | "listening_talks"
  | "reading_incomplete_sentences"
  | "reading_text_completion"
  | "reading_comprehension";

export type TOEICDifficulty = "easy" | "medium" | "hard";

export interface TOEICSection {
  id: TOEICPartId;
  /** Official TOEIC part number (1–7). */
  partNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  group: "listening" | "reading";

  name_en: string;
  name_vi: string;

  description_en: string;
  description_vi: string;

  /** Number of questions in this part on the real test. */
  questionCount: number;
  /**
   * Time budget in minutes for this part.
   *
   * Listening parts: total Listening section is timed at ~45 minutes
   * (audio length is fixed by ETS). We attribute the per-part minutes
   * proportionally to question count, used as the practice-mode timer.
   *
   * Reading parts: official ETS guidance is 75 minutes shared across
   * Reading parts 5–7. We attribute a recommended budget per part
   * (used as the practice-mode timer); the test itself does not
   * enforce per-part timing, but the practice version does so the
   * learner can pace.
   */
  timeLimitMinutes: number;
  difficultyRange: readonly TOEICDifficulty[];
}

export const TOEIC_SECTIONS: readonly TOEICSection[] = [
  // ── Listening ─────────────────────────────────────────────────────────
  {
    id: "listening_photographs",
    partNumber: 1,
    group: "listening",
    name_en: "Part 1 — Photographs",
    name_vi: "Phần 1 — Mô tả tranh",
    description_en:
      "Look at a photograph and pick the statement that best describes it. 4 audio choices per photo.",
    description_vi:
      "Nhìn tranh và chọn câu mô tả đúng nhất. Mỗi tranh có 4 lựa chọn nghe.",
    questionCount: 6,
    timeLimitMinutes: 4,
    difficultyRange: ["easy", "medium"],
  },
  {
    id: "listening_question_response",
    partNumber: 2,
    group: "listening",
    name_en: "Part 2 — Question-Response",
    name_vi: "Phần 2 — Hỏi-đáp",
    description_en:
      "Hear a question or statement and pick the most natural response from 3 choices. No printed text.",
    description_vi:
      "Nghe một câu hỏi hoặc câu nói và chọn câu trả lời tự nhiên nhất trong 3 lựa chọn. Không có văn bản in.",
    questionCount: 25,
    timeLimitMinutes: 9,
    difficultyRange: ["easy", "medium", "hard"],
  },
  {
    id: "listening_conversations",
    partNumber: 3,
    group: "listening",
    name_en: "Part 3 — Conversations",
    name_vi: "Phần 3 — Hội thoại",
    description_en:
      "Listen to a 30-40 second conversation between 2-3 people, then answer 3 questions about each.",
    description_vi:
      "Nghe hội thoại 30-40 giây giữa 2-3 người, sau đó trả lời 3 câu hỏi cho mỗi đoạn.",
    questionCount: 39,
    timeLimitMinutes: 17,
    difficultyRange: ["medium", "hard"],
  },
  {
    id: "listening_talks",
    partNumber: 4,
    group: "listening",
    name_en: "Part 4 — Short Talks",
    name_vi: "Phần 4 — Bài nói ngắn",
    description_en:
      "Listen to a single-speaker talk (announcement, voicemail, ad), then answer 3 questions per talk.",
    description_vi:
      "Nghe bài nói của một người (thông báo, hộp thư, quảng cáo), sau đó trả lời 3 câu hỏi cho mỗi bài.",
    questionCount: 30,
    timeLimitMinutes: 15,
    difficultyRange: ["medium", "hard"],
  },

  // ── Reading ───────────────────────────────────────────────────────────
  {
    id: "reading_incomplete_sentences",
    partNumber: 5,
    group: "reading",
    name_en: "Part 5 — Incomplete Sentences",
    name_vi: "Phần 5 — Câu không hoàn chỉnh",
    description_en:
      "Single-blank grammar/vocabulary questions with 4 multiple-choice options.",
    description_vi:
      "Câu hỏi ngữ pháp/từ vựng với một chỗ trống và 4 lựa chọn.",
    questionCount: 30,
    timeLimitMinutes: 18,
    difficultyRange: ["easy", "medium", "hard"],
  },
  {
    id: "reading_text_completion",
    partNumber: 6,
    group: "reading",
    name_en: "Part 6 — Text Completion",
    name_vi: "Phần 6 — Điền đoạn văn",
    description_en:
      "Short passage (email, memo, notice) with 4 blanks. Mix of word-level and full-sentence inserts.",
    description_vi:
      "Đoạn văn ngắn (email, ghi chú) với 4 chỗ trống. Bao gồm cả từ và câu hoàn chỉnh.",
    questionCount: 16,
    timeLimitMinutes: 8,
    difficultyRange: ["medium", "hard"],
  },
  {
    id: "reading_comprehension",
    partNumber: 7,
    group: "reading",
    name_en: "Part 7 — Reading Comprehension",
    name_vi: "Phần 7 — Đọc hiểu",
    description_en:
      "Single, double, and triple passages followed by 2-5 questions each. Articles, ads, web chats, schedules.",
    description_vi:
      "Đoạn văn đơn, đôi, ba kèm 2-5 câu hỏi mỗi đoạn. Bài báo, quảng cáo, chat, lịch trình.",
    questionCount: 54,
    timeLimitMinutes: 49,
    difficultyRange: ["medium", "hard"],
  },
] as const;

/** Total questions on the real TOEIC L&R: 200. */
export const TOEIC_TOTAL_QUESTIONS: number = TOEIC_SECTIONS.reduce(
  (sum, s) => sum + s.questionCount,
  0,
);

/** Recommended total time across all 7 parts: ~120 minutes. */
export const TOEIC_TOTAL_TIME_MINUTES: number = TOEIC_SECTIONS.reduce(
  (sum, s) => sum + s.timeLimitMinutes,
  0,
);

export const TOEIC_LISTENING_SECTIONS = TOEIC_SECTIONS.filter(
  (s) => s.group === "listening",
);
export const TOEIC_READING_SECTIONS = TOEIC_SECTIONS.filter(
  (s) => s.group === "reading",
);

export function getSectionById(id: string): TOEICSection | null {
  return TOEIC_SECTIONS.find((s) => s.id === id) ?? null;
}
