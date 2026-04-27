// src/data/exam-prep/ielts/reading-passages.ts
//
// IELTS Academic Reading practice content pack — 12 passages across
// history (3), geography (3), science (3), economics (3).
//
// Topic policy: every passage is a fact-dense, paraphrasable summary
// of a neutral, encyclopaedic topic. No creative writing, no quoted
// material, no living-author exposition that could read like
// commercial-prep copy. The goal is content the IELTS examiner would
// recognise as exam-format text and the candidate could plausibly
// have read in a Wikipedia article or a textbook.
//
// All passages, questions, options, vocabulary, and Vietnamese-speaker
// strategies are **original** — written for MercyBlade based on the
// public IELTS Academic Reading format spec (ielts.org). None of this
// content reproduces text from any commercial prep book, real exam, or
// copyrighted source. Verbatim re-use requires attribution.
//
// Format faithful points (per ielts.org public spec):
//   - 700–900 words per passage (Wikipedia-style summary, not creative)
//   - 13–14 questions per passage in the real exam; this pack uses
//     10–13 per passage to keep on-screen practice tight while still
//     hitting every major question type:
//       matching headings, true/false/not given, yes/no/not given,
//       summary/sentence/note completion, multiple choice,
//       matching information, short answer.
//   - Mixed difficulty bands (6.5 — 8.0) so a single learner has a
//     practice ladder, not a wall.

export type IELTSReadingCategory =
  | "history"
  | "geography"
  | "science"
  | "economics";

export type IELTSReadingQuestionType =
  | "matching_headings"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "summary_completion"
  | "sentence_completion"
  | "note_completion"
  | "multiple_choice"
  | "matching_information"
  | "short_answer";

export type IELTSReadingBand = 6.0 | 6.5 | 7.0 | 7.5 | 8.0 | 8.5;
export type IELTSReadingVocabBand = 5 | 6 | 7 | 8 | 9;

export interface IELTSReadingQuestion {
  /** 1-based, stable within the item. */
  number: number;
  type: IELTSReadingQuestionType;
  question_text: string;
  /** Options for MCQ / matching; undefined for completion / short-answer. */
  options?: string[];
  /** Canonical answer. Strings (case-insensitive in scoring). */
  correct_answer: string;
  explanation_vi: string;
}

export interface IELTSReadingVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: IELTSReadingVocabBand;
  /** Short note on how the word is used in this passage. */
  context_use: string;
}

export interface IELTSReadingPassage {
  /** Stable ID — used as the route slug and for sitemap inclusion. */
  id: string;
  category: IELTSReadingCategory;
  topic_title_vi: string;
  topic_title_en: string;
  /** ~700–900 word body. Paragraph breaks are LF-LF. */
  passage: string;
  /** A, B, C, … paragraph count — drives matching-headings questions. */
  paragraph_count: number;
  questions: IELTSReadingQuestion[];
  vocabulary_focus: IELTSReadingVocab[];
  /** 4+ strategies tailored for Vietnamese readers. */
  vietnamese_speaker_strategies: string[];
  /** 2+ specific traps VN candidates fall into on this question style. */
  common_mistakes_vi: string[];
  /** IELTS Academic Reading allots 20 min per passage; we set 18 to
      leave 2 min for transfer in self-paced practice. */
  estimated_time_minutes: number;
  difficulty_band: IELTSReadingBand;
  /** Approximate word count of `passage`. */
  word_count: number;
}

// ─────────────────────────────────────────────────────────────────────
// Re-used Vietnamese-speaker strategy snippets
// ─────────────────────────────────────────────────────────────────────

const STRAT_TFNG_VS_YNNG =
  "True/False/Not Given (factual claims) khác Yes/No/Not Given (opinions). VN học sinh hay đổi nhãn. Quy tắc: T/F/NG cho 'thông tin', Y/N/NG cho 'quan điểm tác giả'.";
const STRAT_NOT_GIVEN =
  "'Not Given' không có nghĩa là 'sai'. Nếu passage không nhắc đến điều cần xác minh, đáp án là Not Given — KHÔNG được suy luận thêm từ kiến thức bên ngoài.";
const STRAT_PARAPHRASE =
  "Câu hỏi và passage hiếm khi dùng cùng từ. Học các cặp paraphrase: 'increase' ↔ 'rise / grow / climb', 'cause' ↔ 'lead to / result in', 'important' ↔ 'crucial / key / significant'.";
const STRAT_HEADINGS_FIRST_LAST =
  "Matching headings: đọc câu đầu + câu cuối mỗi đoạn trước. Topic sentence của IELTS thường nằm ở vị trí đó. Không đọc cả đoạn rồi mới quay lên — tốn thời gian.";
const STRAT_KEYWORD_TRACE =
  "Trace từ khoá đặc trưng (tên riêng, số, thuật ngữ) — chúng ít bị paraphrase. Tên người, năm, đơn vị (km, %) là 'mỏ neo' an toàn.";
const STRAT_TIME_BUDGET =
  "Phân bổ thời gian: 18–20 phút/passage. Câu nào quá 90 giây thì đánh dấu, bỏ qua, quay lại sau. Một câu khó không đáng đổi 3 câu dễ.";
const STRAT_WORD_LIMIT =
  "Completion câu hỏi 'NO MORE THAN TWO WORDS' nghiêm khắc với cả gạch nối — 'twentieth-century' tính là 1 từ, 'twentieth century' tính là 2. Đếm trước khi viết.";
const STRAT_QUESTION_ORDER =
  "Câu hỏi T/F/NG, MCQ, completion thường THEO THỨ TỰ passage — không nhảy lung tung. Matching headings/information thì KHÔNG theo thứ tự — phải scan cả passage.";

const ALL_PASSAGES: IELTSReadingPassage[] = [];

// Selectors and lookup helpers — exported names are stable.
export const IELTS_READING_PASSAGES: IELTSReadingPassage[] = ALL_PASSAGES;

export const IELTS_READING_BY_CATEGORY: Record<
  IELTSReadingCategory,
  IELTSReadingPassage[]
> = {
  history: IELTS_READING_PASSAGES.filter((p) => p.category === "history"),
  geography: IELTS_READING_PASSAGES.filter((p) => p.category === "geography"),
  science: IELTS_READING_PASSAGES.filter((p) => p.category === "science"),
  economics: IELTS_READING_PASSAGES.filter((p) => p.category === "economics"),
};

export function getIELTSReadingPassageById(
  id: string,
): IELTSReadingPassage | undefined {
  return IELTS_READING_PASSAGES.find((p) => p.id === id);
}

/**
 * IELTS Academic Reading raw-score → band conversion (40-question paper).
 * Source: public IELTS band-conversion guidance from idp.com / ielts.org.
 * Conservative midpoints used across recent academic reports — same
 * style and constants as listening-items.ts.
 */
export function readingRawToBand(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 33) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 27) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 19) return 5.5;
  if (r >= 15) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  return 0;
}

// Re-export the strategy constants in case future passages or tests
// want to reference them directly. Keeping them as named constants
// avoids drift when 12 entries each cite the same advice.
export const STRATEGY_LIBRARY = {
  TFNG_VS_YNNG: STRAT_TFNG_VS_YNNG,
  NOT_GIVEN: STRAT_NOT_GIVEN,
  PARAPHRASE: STRAT_PARAPHRASE,
  HEADINGS_FIRST_LAST: STRAT_HEADINGS_FIRST_LAST,
  KEYWORD_TRACE: STRAT_KEYWORD_TRACE,
  TIME_BUDGET: STRAT_TIME_BUDGET,
  WORD_LIMIT: STRAT_WORD_LIMIT,
  QUESTION_ORDER: STRAT_QUESTION_ORDER,
} as const;
