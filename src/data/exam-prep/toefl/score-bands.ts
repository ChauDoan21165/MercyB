// src/data/exam-prep/toefl/score-bands.ts
//
// TOEFL iBT scoring: 0–30 per section, 0–120 total.
//
// Unlike IELTS (0.5-band steps) or TOEIC (10–990 linear mapping),
// TOEFL uses a 0–30 scale per section with no official ETS-published
// linear formula. Raw correct counts are converted to scaled scores
// via ETS's proprietary equating tables, which vary slightly per test
// form.
//
// For MercyBlade's estimator, we use the common approximation:
//   - Each section-based practice returns a raw correct count.
//   - We map raw → scaled via a lookup table derived from publicly
//     available ETS practice-test conversion charts (TOEFL iBT
//     Official Guide, 6th Ed., and ETS-published sample forms).
//   - The mapping is rounded to plausible ranges; it is NOT an
//     official ETS product and the UI must include a caveat:
//     "This is an estimate — real scores vary by test form."
//
// CEFR alignment uses ETS's published TOEFL iBT → CEFR mapping
// (https://www.ets.org/toefl/institutions/scores/compare/).

export type CEFRLevel =
  | "below_a2"
  | "a2"
  | "b1"
  | "b2"
  | "c1"
  | "c2";

export interface TOEFLScoreBand {
  id: CEFRLevel;
  /** Lower bound (inclusive) on the 0–120 scale. */
  minTotal: number;
  /** Upper bound (inclusive). */
  maxTotal: number;
  label_en: string;
  label_vi: string;
  description_en: string;
  description_vi: string;
}

// Official ETS TOEFL iBT → CEFR total score mapping (public):
//   below A2:  0 – 29   → Beginner
//   A2:       30 – 41   → Elementary
//   B1:       42 – 71   → Intermediate
//   B2:       72 – 94   → Upper Intermediate
//   C1:       95 – 113  → Advanced
//   C2:      114 – 120  → Proficient
//
// Source: https://www.ets.org/toefl/institutions/scores/compare/

export const TOEFL_SCORE_BANDS: readonly TOEFLScoreBand[] = [
  {
    id: "below_a2",
    minTotal: 0,
    maxTotal: 29,
    label_en: "Below A2 — Beginner",
    label_vi: "Dưới A2 — Mới bắt đầu",
    description_en:
      "Can understand and use very basic English phrases. Not yet able to function independently in an English-speaking academic environment.",
    description_vi:
      "Có thể hiểu và dùng các cụm tiếng Anh rất cơ bản. Chưa thể hoạt động độc lập trong môi trường học thuật tiếng Anh.",
  },
  {
    id: "a2",
    minTotal: 30,
    maxTotal: 41,
    label_en: "A2 — Elementary",
    label_vi: "A2 — Sơ cấp",
    description_en:
      "Can communicate in simple, routine tasks. Understands short, clearly articulated speech on familiar topics.",
    description_vi:
      "Có thể giao tiếp trong các tình huống đơn giản, quen thuộc. Hiểu được bài nói ngắn, rõ ràng về chủ đề quen thuộc.",
  },
  {
    id: "b1",
    minTotal: 42,
    maxTotal: 71,
    label_en: "B1 — Intermediate",
    label_vi: "B1 — Trung cấp",
    description_en:
      "Can handle most everyday situations. Understands main points of clear standard speech. Most US community colleges accept scores in this range for conditional admission.",
    description_vi:
      "Có thể xử lý hầu hết tình huống hàng ngày. Hiểu được ý chính của bài nói rõ ràng. Nhiều cao đẳng cộng đồng Mỹ chấp nhận mức điểm này để nhập học có điều kiện.",
  },
  {
    id: "b2",
    minTotal: 72,
    maxTotal: 94,
    label_en: "B2 — Upper Intermediate",
    label_vi: "B2 — Trên trung cấp",
    description_en:
      "Can participate effectively in academic discussions. Understands lectures with some complex arguments. Common minimum for US undergraduate admission (typically 79–80+).",
    description_vi:
      "Có thể tham gia hiệu quả vào thảo luận học thuật. Hiểu được bài giảng có lập luận phức tạp. Mức tối thiểu phổ biến để vào đại học Mỹ (thường 79–80+).",
  },
  {
    id: "c1",
    minTotal: 95,
    maxTotal: 113,
    label_en: "C1 — Advanced",
    label_vi: "C1 — Nâng cao",
    description_en:
      "Can produce clear, well-structured academic writing. Understands a wide range of demanding texts and lectures. Typical target for graduate admission and professional licensure.",
    description_vi:
      "Có thể viết bài học thuật rõ ràng, có cấu trúc tốt. Hiểu được nhiều loại văn bản và bài giảng khó. Mức mục tiêu điển hình cho cao học và chứng chỉ hành nghề.",
  },
  {
    id: "c2",
    minTotal: 114,
    maxTotal: 120,
    label_en: "C2 — Proficient",
    label_vi: "C2 — Thành thạo",
    description_en:
      "Functions at near-native level in academic and professional English. Can summarise complex information from multiple sources coherently.",
    description_vi:
      "Sử dụng tiếng Anh học thuật và chuyên nghiệp gần như người bản ngữ. Có thể tóm tắt thông tin phức tạp từ nhiều nguồn một cách mạch lạc.",
  },
] as const;

/**
 * Approximate raw → scaled score mapping per section.
 *
 * TOEFL Reading and Listening each have ~20–28 scored questions.
 * The ETS conversion tables are proprietary and vary per form;
 * this table uses a conservative linear approximation based on
 * publicly available practice-test data. The UI MUST display
 * a "this is an estimate" caveat.
 *
 * The Speaking and Writing sections are NOT auto-scored in this
 * scaffolding — they need human/AI evaluation. The estimator
 * prompts the user to self-estimate their section score (0–30)
 * or pulls from AI grading when that feature ships.
 */

/** Approximate Reading scaled score from raw correct (out of 20). */
export function estimateReadingScaled(rawCorrect: number): number {
  if (rawCorrect < 0) return 0;
  if (rawCorrect > 20) rawCorrect = 20;
  // Conservative approximation: 0 correct → 0, 20 correct → 30.
  // ETS tables are roughly linear with slight compression at extremes.
  const lookup: Record<number, number> = {
    0: 0, 1: 2, 2: 4, 3: 7, 4: 9, 5: 11, 6: 13, 7: 15,
    8: 17, 9: 18, 10: 19, 11: 20, 12: 21, 13: 22, 14: 23,
    15: 24, 16: 25, 17: 26, 18: 27, 19: 28, 20: 30,
  };
  return lookup[rawCorrect] ?? Math.round((rawCorrect / 20) * 30);
}

/** Approximate Listening scaled score from raw correct (out of 28). */
export function estimateListeningScaled(rawCorrect: number): number {
  if (rawCorrect < 0) return 0;
  if (rawCorrect > 28) rawCorrect = 28;
  const lookup: Record<number, number> = {
    0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 11, 7: 12,
    8: 13, 9: 14, 10: 15, 11: 16, 12: 17, 13: 18, 14: 19,
    15: 20, 16: 21, 17: 22, 18: 23, 19: 24, 20: 25, 21: 26,
    22: 27, 23: 28, 24: 29, 25: 29, 26: 29, 27: 30, 28: 30,
  };
  return lookup[rawCorrect] ?? Math.round((rawCorrect / 28) * 30);
}

export function bandForTotal(totalScore: number): TOEFLScoreBand {
  for (const b of TOEFL_SCORE_BANDS) {
    if (totalScore >= b.minTotal && totalScore <= b.maxTotal) return b;
  }
  if (totalScore > 120) return TOEFL_SCORE_BANDS[TOEFL_SCORE_BANDS.length - 1];
  return TOEFL_SCORE_BANDS[0];
}

export interface TOEFLScoreEstimate {
  readingScaled: number;   // 0–30
  listeningScaled: number; // 0–30
  speakingScaled: number;  // 0–30 (user-provided or AI-graded)
  writingScaled: number;   // 0–30 (user-provided or AI-graded)
  totalScore: number;      // 0–120
  band: TOEFLScoreBand;
}

/**
 * Estimate total TOEFL score from section-level inputs.
 *
 * Reading/Listening accept raw correct counts → scaled via lookup tables.
 * Speaking/Writing accept direct 0–30 estimates (from user or future AI).
 */
export function estimateTOEFLScore(inputs: {
  readingRaw?: number;    // 0–20
  listeningRaw?: number;  // 0–28
  speakingScaled?: number;  // 0–30
  writingScaled?: number;   // 0–30
}): TOEFLScoreEstimate {
  const readingScaled = inputs.readingRaw != null
    ? estimateReadingScaled(inputs.readingRaw)
    : 0;
  const listeningScaled = inputs.listeningRaw != null
    ? estimateListeningScaled(inputs.listeningRaw)
    : 0;
  const speakingScaled = inputs.speakingScaled ?? 0;
  const writingScaled = inputs.writingScaled ?? 0;

  const totalScore = readingScaled + listeningScaled + speakingScaled + writingScaled;
  const band = bandForTotal(totalScore);

  return {
    readingScaled,
    listeningScaled,
    speakingScaled,
    writingScaled,
    totalScore,
    band,
  };
}
