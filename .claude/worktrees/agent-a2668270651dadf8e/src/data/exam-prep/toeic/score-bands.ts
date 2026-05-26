// TOEIC Listening & Reading scoring (10–990 scale).
//
// The official ETS scaling is non-linear and proprietary; we ship a
// transparent linear approximation that:
//   - Splits the 10–990 scale evenly between Listening (5–495) and
//     Reading (5–495) — 100 questions per section, so each correct
//     question contributes ~4.9 points to its section.
//   - Rounds to the nearest 5, matching official TOEIC reporting.
//   - Floors at 5 per section (the official minimum) and caps at
//     495 per section (the official maximum).
//
// CEFR alignment uses the publicly-available ETS-published mapping
// (TOEIC L&R → CEFR). These thresholds are widely cited and used by
// employers and immigration services. Keep them in lockstep with the
// "Official band labels" comment block below.

export type CEFRLevel =
  | "below_a1"
  | "a1"
  | "a2"
  | "b1"
  | "b2"
  | "c1"
  | "c2";

export interface TOEICScoreBand {
  id: CEFRLevel;
  /** Lower bound (inclusive) on the 10–990 scale. */
  minScore: number;
  /** Upper bound (inclusive). */
  maxScore: number;
  label_en: string;
  label_vi: string;
  description_en: string;
  description_vi: string;
}

// Official band labels (10–990 scale, common ETS / immigration usage):
//   below_a1: 10  – 220  → Beginner (cannot perform basic tasks)
//   a1:       225 – 405  → Elementary (basic personal info)
//   a2:       410 – 550  → Pre-intermediate (familiar topics)
//   b1:       555 – 780  → Intermediate (work tasks, some abstract)
//   b2:       785 – 900  → Upper-intermediate (most work contexts)
//   c1:       905 – 940  → Advanced (effective social/work)
//   c2:       945 – 990  → Mastery (any context)
//
// Some sources cite slightly different cutoffs; we adopt the most
// common one used by Vietnamese immigration / job posting boards.

export const TOEIC_SCORE_BANDS: readonly TOEICScoreBand[] = [
  {
    id: "below_a1",
    minScore: 10,
    maxScore: 220,
    label_en: "Beginner",
    label_vi: "Sơ cấp (mới bắt đầu)",
    description_en:
      "Can recognize a few basic English words but cannot complete tasks reliably.",
    description_vi:
      "Có thể nhận ra một vài từ tiếng Anh cơ bản nhưng chưa hoàn thành được nhiệm vụ ổn định.",
  },
  {
    id: "a1",
    minScore: 225,
    maxScore: 405,
    label_en: "Elementary (A1)",
    label_vi: "A1 — Sơ cấp",
    description_en:
      "Can introduce themselves and handle very basic personal exchanges.",
    description_vi:
      "Có thể giới thiệu bản thân và trao đổi thông tin rất cơ bản.",
  },
  {
    id: "a2",
    minScore: 410,
    maxScore: 550,
    label_en: "Pre-intermediate (A2)",
    label_vi: "A2 — Tiền trung cấp",
    description_en:
      "Can discuss familiar topics and handle simple workplace communication.",
    description_vi:
      "Có thể trao đổi về các chủ đề quen thuộc và giao tiếp nơi làm việc đơn giản.",
  },
  {
    id: "b1",
    minScore: 555,
    maxScore: 780,
    label_en: "Intermediate (B1)",
    label_vi: "B1 — Trung cấp",
    description_en:
      "Can complete most work tasks in English, with some struggle on abstract topics.",
    description_vi:
      "Có thể hoàn thành phần lớn công việc bằng tiếng Anh, hơi khó khăn với chủ đề trừu tượng.",
  },
  {
    id: "b2",
    minScore: 785,
    maxScore: 900,
    label_en: "Upper-intermediate (B2)",
    label_vi: "B2 — Trên trung cấp",
    description_en:
      "Comfortable in most professional contexts. Common minimum for skilled-immigration jobs.",
    description_vi:
      "Thoải mái trong hầu hết môi trường làm việc. Mức tối thiểu thường gặp cho công việc định cư có tay nghề.",
  },
  {
    id: "c1",
    minScore: 905,
    maxScore: 940,
    label_en: "Advanced (C1)",
    label_vi: "C1 — Nâng cao",
    description_en:
      "Effective in social, academic, and professional life. Negotiates with native speakers fluently.",
    description_vi:
      "Hiệu quả trong giao tiếp xã hội, học thuật và công việc. Đàm phán với người bản ngữ trôi chảy.",
  },
  {
    id: "c2",
    minScore: 945,
    maxScore: 990,
    label_en: "Mastery (C2)",
    label_vi: "C2 — Thông thạo",
    description_en:
      "Functions essentially as a native speaker in any context.",
    description_vi:
      "Sử dụng tiếng Anh gần như người bản ngữ trong mọi ngữ cảnh.",
  },
] as const;

/** Round to nearest 5 (matches official TOEIC reporting). */
function roundToFive(n: number): number {
  return Math.round(n / 5) * 5;
}

function clampSectionScore(raw: number): number {
  if (raw < 5) return 5;
  if (raw > 495) return 495;
  return roundToFive(raw);
}

export interface TOEICScoreEstimate {
  listeningScore: number; // 5–495
  readingScore: number; // 5–495
  totalScore: number; // 10–990
  band: TOEICScoreBand;
}

/**
 * Estimate the TOEIC score from a learner's correct counts in each
 * section. Each section's contribution to its half (Listening or
 * Reading) is proportional to (correct / questionCount). With 100
 * questions per half on the real test, our linear approximation
 * gives ~4.9 points per correct answer in that half.
 *
 * If the learner only attempted a subset of sections, we still
 * proportional-extrapolate within each side — but this comes with
 * a clear caveat in the result page UI ("estimate based on partial
 * sections"). The estimator function itself is purely mechanical.
 */
export function estimateTOEICScore(
  perSection: ReadonlyArray<{
    sectionId: string;
    correct: number;
    total: number;
  }>,
): TOEICScoreEstimate {
  let listeningRaw = 0;
  let readingRaw = 0;
  let listeningWeight = 0;
  let readingWeight = 0;

  for (const row of perSection) {
    if (row.total <= 0 || row.correct < 0) continue;
    const ratio = Math.min(1, row.correct / row.total);
    // The full Listening side is 100 q → 495 pts; full Reading side is
    // 100 q → 495 pts. The weight per section is its share of the 100-
    // question half (questionCount / 100).
    const found = TOEIC_SECTIONS_BY_ID[row.sectionId];
    if (!found) continue;
    const halfWeight = found.questionCount / 100;
    if (found.group === "listening") {
      listeningRaw += ratio * halfWeight * 495;
      listeningWeight += halfWeight;
    } else {
      readingRaw += ratio * halfWeight * 495;
      readingWeight += halfWeight;
    }
  }

  // If the learner skipped a side entirely, we leave that side at the
  // floor of 5 rather than extrapolating from zero data — a 0/0 in
  // Listening should NOT silently become "perfect Listening" or any
  // other phantom score.
  const listeningScore =
    listeningWeight > 0
      ? clampSectionScore(listeningRaw / listeningWeight)
      : 5;
  const readingScore =
    readingWeight > 0 ? clampSectionScore(readingRaw / readingWeight) : 5;

  const totalScore = listeningScore + readingScore;
  const band = bandForScore(totalScore);

  return { listeningScore, readingScore, totalScore, band };
}

export function bandForScore(score: number): TOEICScoreBand {
  for (const b of TOEIC_SCORE_BANDS) {
    if (score >= b.minScore && score <= b.maxScore) return b;
  }
  // Defensive: if the score lands above 990 due to a bug, return C2.
  if (score > 990) return TOEIC_SCORE_BANDS[TOEIC_SCORE_BANDS.length - 1];
  // Below 10 (theoretically impossible after clamping): return below_a1.
  return TOEIC_SCORE_BANDS[0];
}

// Internal lookup for fast section→group resolution. Built lazily so the
// import order between this file and structure.ts can't trip a circular
// init.
import { TOEIC_SECTIONS } from "./structure";
const TOEIC_SECTIONS_BY_ID: Record<
  string,
  (typeof TOEIC_SECTIONS)[number]
> = (() => {
  const out: Record<string, (typeof TOEIC_SECTIONS)[number]> = {};
  for (const s of TOEIC_SECTIONS) out[s.id] = s;
  return out;
})();
