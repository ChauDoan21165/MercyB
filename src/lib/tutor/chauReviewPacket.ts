/**
 * Chau Review Packet Template
 *
 * A structured review packet that Chau uses to evaluate Teacher Mercy's
 * tutoring performance across one session. Produces a single-page summary
 * covering all six teacher capabilities:
 *
 *   1. Diagnose  — what did Mercy find?
 *   2. Teach     — how did Mercy teach?
 *   3. Remember  — what does Mercy remember about this learner?
 *   4. Adapt     — how did Mercy adjust to the learner?
 *   5. Self-check — did Mercy validate its own decisions?
 *   6. Prove improvement — did the learner get better?
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Designed for Chau's review workflow:
 *   1. Open a session in the review tool.
 *   2. Run buildChauReviewPacket(session, memory, audits).
 *   3. Scan the 6-dimension summary.
 *   4. Read action items.
 *   5. Decide: pass, fix, or escalate.
 */

import type { TranscriptCorrectionEvent } from "./transcriptCorrectionTypes";
import {
  buildCorrectionProof,
  getCorrectionStats,
  getImprovementTrail,
} from "./transcriptCorrectionCollector";
import type { TranscriptCorrectionProof } from "./transcriptCorrectionTypes";
import {
  captureBaseline,
  captureOutcome,
  assessLearningGain,
  hasMeasurableGain,
  isReportableGain,
  LEARNING_GAIN_DIMENSION_CATALOG,
  type LearningGainResult,
  type LearningGainDimensionId,
} from "./learningGainRubric";
import type { AuditResult } from "./teacherMercyAuditGate";
import type { TutorTurn } from "./tutorTypes";
import type { RubricResult } from "./teacherMercyRubric";

// ─── Memory summary (lightweight, no ai-tutor import dependency) ──────────

/** A lightweight view of what Mercy remembers about a learner. */
export interface ChauMemorySnapshot {
  /** Strengths Mercy has identified */
  strengths: string[];
  /** Weaknesses / topics needing review */
  needsReview: string[];
  /** Common mistake patterns */
  commonMistakePatterns: string[];
  /** Recommended next focus */
  nextRecommendedFocus: string;
  /** Confidence trend */
  confidenceTrend: string;
  /** Total corrections recorded */
  totalCorrections: number;
  /** When the memory was last updated (ISO string or null) */
  lastUpdatedAt: string | null;
}

// ─── Chau review packet types ─────────────────────────────────────────────

export type ChauReviewVerdict =
  | "excellent_teacher"
  | "good_teacher"
  | "needs_improvement"
  | "concerning";

export type ChauReviewDimensionLabel =
  | "xuất sắc"
  | "tốt"
  | "cần cải thiện"
  | "đáng lo";

export interface ChauDimensionReview {
  /** Dimension identifier */
  dimensionId: string;
  /** Vietnamese label */
  titleVi: string;
  /** English label */
  titleEn: string;
  /** Score 0–3 */
  score: 0 | 1 | 2 | 3;
  /** Qualitative label */
  label: ChauReviewDimensionLabel;
  /** Key observations Chau should read */
  observations: string[];
  /** Questions for Chau to consider */
  reviewQuestions: string[];
  /** Whether this dimension has enough data */
  hasData: boolean;
}

export interface ChauReviewPacket {
  /** Packet metadata */
  meta: {
    /** When this packet was generated (ISO) */
    generatedAt: string;
    /** Session identifier */
    sessionId: string;
    /** Number of events in the session */
    eventCount: number;
    /** Number of tutor turns */
    turnCount: number;
    /** Whether enough data exists for a meaningful review */
    hasEnoughData: boolean;
    /** Data quality warnings */
    dataWarnings: string[];
  };

  // ─── 1. Diagnose ──────────────────────────────────────────────────────

  diagnosis: {
    /** Total individual corrections applied */
    totalCorrections: number;
    /** Unique weakness tags detected */
    uniqueWeaknessTags: number;
    /** Top 5 weakness tags with counts */
    topWeaknesses: Array<{ tag: string; labelVi: string; count: number }>;
    /** Correction source breakdown */
    correctionsBySource: Record<string, number>;
    /** Error rate: events with corrections / total events */
    errorRate: number;
    /** Average correction confidence (0–1) */
    avgConfidence: number;
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── 2. Teach ─────────────────────────────────────────────────────────

  teaching: {
    /** Number of explanations provided */
    explanationsProvided: number;
    /** Number of hints surfaced */
    hintsSurfaced: number;
    /** Per-timing-mode distribution */
    timingDistribution: Record<string, number>;
    /** Rubric evaluation (if available) */
    rubricResult: RubricResult | null;
    /** Number of safety violations */
    safetyViolations: number;
    /** Number of contract violations */
    contractViolations: number;
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── 3. Remember ──────────────────────────────────────────────────────

  memory: {
    /** Memory snapshot (null if no memory data) */
    snapshot: ChauMemorySnapshot | null;
    /** Whether memory was used during the session */
    memoryWasUsed: boolean;
    /** Number of tracked strengths */
    strengthsCount: number;
    /** Number of tracked weaknesses */
    weaknessesCount: number;
    /** Whether memory is fresh (updated within 24h) */
    isFresh: boolean;
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── 4. Adapt ─────────────────────────────────────────────────────────

  adaptation: {
    /** Whether difficulty shifted during the session */
    difficultyAdjusted: boolean;
    /** Whether pacing changed */
    pacingChanged: boolean;
    /** Whether correction rate decreased in second half */
    correctionRateDecreased: boolean;
    /** Whether match scores improved in second half */
    matchScoresImproved: boolean;
    /** Adaptation evidence observations */
    evidenceObservations: string[];
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── 5. Self-check ────────────────────────────────────────────────────

  selfCheck: {
    /** Number of audit results provided */
    auditCount: number;
    /** How many audits passed */
    auditsPassed: number;
    /** How many audits failed hard safety */
    safetyFailures: number;
    /** Self-correction events detected */
    selfCorrectionEvents: number;
    /** Whether the overclaim guard was exercised */
    overclaimGuardActive: boolean;
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── 6. Prove improvement ─────────────────────────────────────────────

  learningGain: {
    /** Full learning gain result (null if not enough data) */
    gainResult: LearningGainResult | null;
    /** Whether measurable gain was detected */
    hasMeasurableGain: boolean;
    /** Whether gain is strong enough to report to learner */
    hasReportableGain: boolean;
    /** Dimensions showing improvement (score ≥ 2) */
    improvingDimensions: string[];
    /** Dimensions showing decline */
    decliningDimensions: string[];
    /** Chau's dimension review */
    review: ChauDimensionReview;
  };

  // ─── Overall verdict ──────────────────────────────────────────────────

  overall: {
    /** Overall score 0–3 */
    score: 0 | 1 | 2 | 3;
    /** Verdict classification */
    verdict: ChauReviewVerdict;
    /** Vietnamese summary of the review */
    summaryVi: string;
    /** English summary of the review */
    summaryEn: string;
    /** Action items for Chau — what to look at, fix, or escalate */
    actionItems: string[];
    /** Whether this session is reportable to stakeholders */
    isReportable: boolean;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────

const DIMENSION_NAMES: Record<
  string,
  { titleVi: string; titleEn: string }
> = {
  diagnosis: { titleVi: "Chẩn đoán", titleEn: "Diagnose" },
  teaching: { titleVi: "Giảng dạy", titleEn: "Teach" },
  memory: { titleVi: "Ghi nhớ", titleEn: "Remember" },
  adaptation: { titleVi: "Thích ứng", titleEn: "Adapt" },
  selfCheck: { titleVi: "Tự kiểm", titleEn: "Self-check" },
  learningGain: {
    titleVi: "Chứng minh tiến bộ",
    titleEn: "Prove improvement",
  },
};

const REVIEW_QUESTIONS: Record<string, string[]> = {
  diagnosis: [
    "Mercy có phát hiện đúng loại lỗi không?",
    "Điểm yếu được gắn nhãn có chính xác không?",
    "Mercy có bỏ sót lỗi quan trọng nào không?",
  ],
  teaching: [
    "Lời giải thích có rõ ràng, dễ hiểu không?",
    "Mercy có sửa quá nhiều một lúc không?",
    "Có vi phạm quy tắc an toàn hay thể diện nào không?",
  ],
  memory: [
    "Mercy có nhắc đến điểm yếu cũ khi liên quan không?",
    "Mercy có nhớ đúng người học này không?",
    "Thông tin ghi nhớ có bị sai lệch không?",
  ],
  adaptation: [
    "Mercy có điều chỉnh độ khó phù hợp không?",
    "Mercy có chuyển sang tiếng Việt khi cần không?",
    "Tốc độ sửa lỗi có giảm khi người học tiến bộ không?",
  ],
  selfCheck: [
    "Mercy có tự phát hiện và sửa lời khen giả không?",
    "Kết quả tự kiểm có khớp với đánh giá của Chau không?",
    "Mercy có bỏ qua lỗi an toàn nào không?",
  ],
  learningGain: [
    "Người học có thực sự tiến bộ trong buổi học này không?",
    "Chiều nào cải thiện rõ nhất? Chiều nào tệ nhất?",
    "Kết quả có đáng để báo cáo cho người học không?",
  ],
};

// ─── Scoring helpers ─────────────────────────────────────────────────────

function scoreToLabel(score: number): ChauReviewDimensionLabel {
  if (score >= 3) return "xuất sắc";
  if (score >= 2) return "tốt";
  if (score >= 1) return "cần cải thiện";
  return "đáng lo";
}

function dimensionScoreFromObservations(
  observations: string[],
  hasData: boolean,
): 0 | 1 | 2 | 3 {
  if (!hasData) return 0;
  // Positive observations outnumber concerns
  const positive = observations.filter(
    (o) =>
      o.startsWith("✓") ||
      o.startsWith("Đạt") ||
      o.startsWith("Có") ||
      o.includes("tốt") ||
      o.includes("đúng"),
  ).length;
  const concerns = observations.filter(
    (o) =>
      o.startsWith("⚠") ||
      o.startsWith("Không") ||
      o.includes("vi phạm") ||
      o.includes("thiếu"),
  ).length;
  const total = positive + concerns;
  if (total === 0) return 1; // has data but no clear signal
  const ratio = positive / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio >= 0.3) return 1;
  return 0;
}

function computeOverallScore(dimensions: ChauDimensionReview[]): 0 | 1 | 2 | 3 {
  if (dimensions.length === 0) return 0;
  const total = dimensions.reduce((s, d) => s + d.score, 0);
  const avg = total / dimensions.length;
  if (avg >= 2.5) return 3;
  if (avg >= 1.8) return 2;
  if (avg >= 0.8) return 1;
  return 0;
}

function computeVerdict(
  score: number,
  safetyViolations: number,
  hasEnoughData: boolean,
): ChauReviewVerdict {
  if (!hasEnoughData) return "concerning";
  if (safetyViolations > 0) return "concerning";
  if (score >= 3) return "excellent_teacher";
  if (score >= 2) return "good_teacher";
  if (score >= 1) return "needs_improvement";
  return "concerning";
}

function buildOverallSummaryVi(
  verdict: ChauReviewVerdict,
  dimensions: ChauDimensionReview[],
): string {
  const dimSummary = dimensions
    .map((d) => `${d.titleVi}: ${d.score}/3`)
    .join(", ");
  switch (verdict) {
    case "excellent_teacher":
      return `Xuất sắc — Teacher Mercy thể hiện như một giáo viên giỏi trong buổi học này. Tất cả sáu chiều đều đạt tốt trở lên. (${dimSummary})`;
    case "good_teacher":
      return `Tốt — Teacher Mercy dạy ổn, có một vài điểm nhỏ cần cải thiện. (${dimSummary})`;
    case "needs_improvement":
      return `Cần cải thiện — Một số chiều chưa đạt. Chau nên xem lại các mục hành động bên dưới. (${dimSummary})`;
    case "concerning":
      return `Đáng lo — Có vi phạm an toàn hoặc thiếu dữ liệu nghiêm trọng. Chau cần xem xét ngay. (${dimSummary})`;
  }
}

function buildOverallSummaryEn(
  verdict: ChauReviewVerdict,
  dimensions: ChauDimensionReview[],
): string {
  const dimSummary = dimensions
    .map((d) => `${d.titleEn}: ${d.score}/3`)
    .join(", ");
  switch (verdict) {
    case "excellent_teacher":
      return `Excellent — Teacher Mercy performed like a strong human teacher. All six dimensions scored well. (${dimSummary})`;
    case "good_teacher":
      return `Good — Teacher Mercy taught well with minor areas for improvement. (${dimSummary})`;
    case "needs_improvement":
      return `Needs improvement — Several dimensions fell short. Review action items below. (${dimSummary})`;
    case "concerning":
      return `Concerning — Safety violations or critical data gaps. Requires immediate review. (${dimSummary})`;
  }
}

// ─── Memory snapshot builder ─────────────────────────────────────────────

function buildMemorySnapshot(
  memoryData: Partial<ChauMemorySnapshot> | null | undefined,
): ChauMemorySnapshot | null {
  if (!memoryData) return null;
  const hasAnyData =
    (memoryData.strengths && memoryData.strengths.length > 0) ||
    (memoryData.needsReview && memoryData.needsReview.length > 0) ||
    (memoryData.commonMistakePatterns &&
      memoryData.commonMistakePatterns.length > 0);
  if (!hasAnyData && !memoryData.confidenceTrend) return null;
  return {
    strengths: memoryData.strengths ?? [],
    needsReview: memoryData.needsReview ?? [],
    commonMistakePatterns: memoryData.commonMistakePatterns ?? [],
    nextRecommendedFocus: memoryData.nextRecommendedFocus ?? "",
    confidenceTrend: memoryData.confidenceTrend ?? "not-enough-data",
    totalCorrections: memoryData.totalCorrections ?? 0,
    lastUpdatedAt: memoryData.lastUpdatedAt ?? null,
  };
}

function isMemoryFresh(lastUpdatedAt: string | null): boolean {
  if (!lastUpdatedAt) return false;
  const ms = new Date(lastUpdatedAt).getTime();
  if (Number.isNaN(ms)) return false;
  return Date.now() - ms < 24 * 60 * 60 * 1000;
}

// ─── Dimension builders ──────────────────────────────────────────────────

function buildDiagnosisReview(
  proof: TranscriptCorrectionProof | null,
  events: TranscriptCorrectionEvent[],
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = events.length > 0;

  if (!hasData || !proof) {
    return {
      dimensionId: "diagnosis",
      ...DIMENSION_NAMES.diagnosis,
      score: 0,
      label: "đáng lo",
      observations: ["⚠ Không có dữ liệu sự kiện để chẩn đoán."],
      reviewQuestions: REVIEW_QUESTIONS.diagnosis,
      hasData: false,
    };
  }

  // Observation: correction coverage
  if (proof.totalCorrections > 0) {
    observations.push(
      `✓ Mercy đã phát hiện ${proof.totalCorrections} lỗi trong ${proof.totalEvents} lượt.`,
    );
  } else if (proof.totalEvents >= 3) {
    observations.push(
      "⚠ Mercy không phát hiện lỗi nào dù có nhiều lượt — có thể bỏ sót.",
    );
  } else {
    observations.push("✓ Không có lỗi nào để sửa — người học viết tốt.");
  }

  // Observation: weakness tags
  const weaknessTags = new Set<string>();
  for (const e of events) {
    for (const t of e.weaknessTags) weaknessTags.add(t);
  }
  if (weaknessTags.size > 0) {
    observations.push(
      `✓ Mercy đã gắn nhãn ${weaknessTags.size} loại điểm yếu khác nhau.`,
    );
  } else if (proof.totalCorrections > 2) {
    observations.push("⚠ Có sửa lỗi nhưng không gắn nhãn điểm yếu.");
  }

  // Observation: correction source diversity
  const sources = Object.keys(proof.correctionsBySource).length;
  if (sources >= 3) {
    observations.push(
      `✓ Mercy dùng ${sources} nguồn sửa lỗi khác nhau (đa dạng).`,
    );
  } else if (sources === 0 && proof.totalCorrections > 0) {
    observations.push("⚠ Không rõ nguồn sửa lỗi.");
  }

  // Observation: average confidence
  const avgConf =
    proof.totalCorrections > 0
      ? events.reduce((s, e) => {
          const confs = e.corrections.map((c) => c.confidence);
          return (
            s +
            (confs.length > 0
              ? confs.reduce((a, b) => a + b, 0) / confs.length
              : 0)
          );
        }, 0) / events.filter((e) => e.corrections.length > 0).length || 0
      : 0;

  if (avgConf >= 0.7 && proof.totalCorrections > 0) {
    observations.push(
      `✓ Độ tự tin sửa lỗi trung bình cao (${Math.round(avgConf * 100)}%).`,
    );
  } else if (avgConf < 0.4 && proof.totalCorrections > 0) {
    observations.push(
      `⚠ Độ tự tin sửa lỗi thấp (${Math.round(avgConf * 100)}%) — Mercy không chắc về sửa lỗi của mình.`,
    );
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "diagnosis",
    ...DIMENSION_NAMES.diagnosis,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.diagnosis,
    hasData,
  };
}

function buildTeachingReview(
  proof: TranscriptCorrectionProof | null,
  auditResults: AuditResult[],
  rubricResult: RubricResult | null,
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = proof !== null || auditResults.length > 0 || rubricResult !== null;

  if (!hasData) {
    return {
      dimensionId: "teaching",
      ...DIMENSION_NAMES.teaching,
      score: 0,
      label: "đáng lo",
      observations: ["⚠ Không có dữ liệu giảng dạy để đánh giá."],
      reviewQuestions: REVIEW_QUESTIONS.teaching,
      hasData: false,
    };
  }

  // Rubric observations
  if (rubricResult) {
    const dims = rubricResult.dimensions;
    const dimSummary = dims.map((d) => `${d.titleVi}: ${d.score}/3`).join(", ");
    observations.push(
      `✓ Đánh giá rubric: ${rubricResult.classification}. (${dimSummary})`,
    );

    // Call out specific failing dimensions
    const failing = dims.filter((d) => d.score <= 1);
    if (failing.length > 0) {
      observations.push(
        `⚠ ${failing.length} chiều rubric chưa đạt: ${failing.map((d) => d.titleVi).join(", ")}.`,
      );
    }
  } else if (proof && proof.totalEvents > 0) {
    observations.push("⚠ Không có đánh giá rubric — không thể xác nhận chất lượng giảng dạy.");
  }

  // Audit observations
  if (auditResults.length > 0) {
    const passed = auditResults.filter((a) => a.passed).length;
    const unsafe = auditResults.filter((a) => !a.safe).length;
    observations.push(
      `✓ Audit: ${passed}/${auditResults.length} lượt đạt hợp đồng.`,
    );
    if (unsafe > 0) {
      observations.push(
        `⚠ ${unsafe} lượt vi phạm quy tắc an toàn — cần xem xét ngay.`,
      );
    } else {
      observations.push("✓ Không có vi phạm an toàn.");
    }
  }

  // Correction timing diversity
  if (proof && proof.totalEvents > 0) {
    const correctionRate =
      proof.eventsWithCorrections / Math.max(1, proof.totalEvents);
    if (correctionRate > 0.8 && proof.totalEvents >= 5) {
      observations.push(
        `⚠ Mercy sửa lỗi trong ${Math.round(correctionRate * 100)}% lượt — có thể đang sửa quá nhiều.`,
      );
    } else if (correctionRate > 0) {
      observations.push(
        `✓ Tỉ lệ sửa lỗi ${Math.round(correctionRate * 100)}% — phù hợp.`,
      );
    }
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "teaching",
    ...DIMENSION_NAMES.teaching,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.teaching,
    hasData,
  };
}

function buildMemoryReview(
  snapshot: ChauMemorySnapshot | null,
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = snapshot !== null;

  if (!hasData) {
    return {
      dimensionId: "memory",
      ...DIMENSION_NAMES.memory,
      score: 0,
      label: "đáng lo",
      observations: ["⚠ Không có dữ liệu ghi nhớ — Mercy chưa nhớ gì về người học này."],
      reviewQuestions: REVIEW_QUESTIONS.memory,
      hasData: false,
    };
  }

  if (snapshot.strengths.length > 0) {
    observations.push(
      `✓ Mercy ghi nhận ${snapshot.strengths.length} điểm mạnh: ${snapshot.strengths.slice(0, 3).join(", ")}.`,
    );
  } else {
    observations.push("⚠ Mercy chưa ghi nhận điểm mạnh nào.");
  }

  if (snapshot.needsReview.length > 0) {
    observations.push(
      `✓ Mercy theo dõi ${snapshot.needsReview.length} điểm cần ôn tập: ${snapshot.needsReview.slice(0, 3).join(", ")}.`,
    );
  } else if (snapshot.totalCorrections >= 3) {
    observations.push(
      "⚠ Có sửa lỗi nhưng không theo dõi điểm cần ôn tập.",
    );
  }

  if (snapshot.commonMistakePatterns.length > 0) {
    observations.push(
      `✓ Mercy phát hiện ${snapshot.commonMistakePatterns.length} mẫu lỗi lặp lại.`,
    );
  }

  if (snapshot.nextRecommendedFocus) {
    observations.push(
      `✓ Gợi ý trọng tâm tiếp theo: "${snapshot.nextRecommendedFocus}".`,
    );
  }

  if (isMemoryFresh(snapshot.lastUpdatedAt)) {
    observations.push("✓ Bộ nhớ được cập nhật trong 24h qua — còn mới.");
  } else if (snapshot.lastUpdatedAt) {
    observations.push("⚠ Bộ nhớ cũ — chưa được cập nhật trong 24h qua.");
  }

  if (snapshot.totalCorrections === 0 && snapshot.strengths.length === 0) {
    observations.push("⚠ Bộ nhớ trống — Mercy chưa thu thập đủ dữ liệu.");
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "memory",
    ...DIMENSION_NAMES.memory,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.memory,
    hasData,
  };
}

function buildAdaptationReview(
  proof: TranscriptCorrectionProof | null,
  events: TranscriptCorrectionEvent[],
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = events.length >= 4; // need enough events to detect adaptation

  if (!hasData || !proof) {
    return {
      dimensionId: "adaptation",
      ...DIMENSION_NAMES.adaptation,
      score: 0,
      label: "đáng lo",
      observations: [
        events.length === 0
          ? "⚠ Không có dữ liệu."
          : `⚠ Chỉ có ${events.length} lượt — không đủ để đánh giá khả năng thích ứng.`,
      ],
      reviewQuestions: REVIEW_QUESTIONS.adaptation,
      hasData: false,
    };
  }

  // Split events in half to detect adaptation
  const mid = Math.floor(events.length / 2);
  const firstHalf = events.slice(0, mid);
  const secondHalf = events.slice(mid);

  const firstCorrections = firstHalf.filter((e) => e.corrections.length > 0).length;
  const secondCorrections = secondHalf.filter((e) => e.corrections.length > 0).length;
  const firstRate = firstCorrections / Math.max(1, firstHalf.length);
  const secondRate = secondCorrections / Math.max(1, secondHalf.length);

  // Correction rate adaptation
  if (secondRate < firstRate * 0.8) {
    observations.push(
      `✓ Tỉ lệ sửa lỗi giảm từ ${Math.round(firstRate * 100)}% → ${Math.round(secondRate * 100)}% — Mercy thích ứng tốt khi người học tiến bộ.`,
    );
  } else if (secondRate > firstRate * 1.3) {
    observations.push(
      `⚠ Tỉ lệ sửa lỗi tăng từ ${Math.round(firstRate * 100)}% → ${Math.round(secondRate * 100)}% — Mercy sửa nhiều hơn dù đáng lẽ phải ít đi.`,
    );
  } else if (firstRate > 0 || secondRate > 0) {
    observations.push(
      `✓ Tỉ lệ sửa lỗi ổn định (${Math.round(firstRate * 100)}% → ${Math.round(secondRate * 100)}%).`,
    );
  }

  // Match score adaptation
  const firstScores = firstHalf
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  const secondScores = secondHalf
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  if (firstScores.length >= 2 && secondScores.length >= 2) {
    const firstAvg =
      firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
    const secondAvg =
      secondScores.reduce((a, b) => a + b, 0) / secondScores.length;
    if (secondAvg > firstAvg + 5) {
      observations.push(
        `✓ Điểm phát âm tăng từ ${Math.round(firstAvg)} → ${Math.round(secondAvg)} — Mercy đã giúp cải thiện phát âm.`,
      );
    } else if (secondAvg < firstAvg - 5) {
      observations.push(
        `⚠ Điểm phát âm giảm từ ${Math.round(firstAvg)} → ${Math.round(secondAvg)}.`,
      );
    }
  }

  // Weakness tag diversity changes
  const firstTags = new Set(firstHalf.flatMap((e) => e.weaknessTags));
  const secondTags = new Set(secondHalf.flatMap((e) => e.weaknessTags));
  if (secondTags.size < firstTags.size && firstTags.size > 0) {
    observations.push(
      `✓ Số loại điểm yếu giảm từ ${firstTags.size} → ${secondTags.size} — người học đang khắc phục điểm yếu.`,
    );
  }

  // Adaptation evidence from improvement trail
  if (proof.improvementTrail.length >= 3) {
    const trail = proof.improvementTrail;
    const earlyErrors =
      trail.slice(0, 3).reduce((s, p) => s + p.correctionCount, 0) /
      Math.min(3, trail.length);
    const lateErrors =
      trail.slice(-3).reduce((s, p) => s + p.correctionCount, 0) /
      Math.min(3, trail.length);
    if (lateErrors < earlyErrors * 0.7 && earlyErrors > 0) {
      observations.push(
        "✓ Mercy đã giảm can thiệp sửa lỗi về cuối buổi — người học tự chủ hơn.",
      );
    }
  }

  if (observations.length <= 1) {
    observations.push("⚠ Chưa thấy bằng chứng thích ứng rõ ràng trong buổi học này.");
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "adaptation",
    ...DIMENSION_NAMES.adaptation,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.adaptation,
    hasData,
  };
}

function buildSelfCheckReview(
  auditResults: AuditResult[],
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = auditResults.length > 0;

  if (!hasData) {
    return {
      dimensionId: "selfCheck",
      ...DIMENSION_NAMES.selfCheck,
      score: 0,
      label: "đáng lo",
      observations: ["⚠ Không có dữ liệu tự kiểm — không biết Mercy có tự đánh giá không."],
      reviewQuestions: REVIEW_QUESTIONS.selfCheck,
      hasData: false,
    };
  }

  const passed = auditResults.filter((a) => a.passed).length;
  const unsafe = auditResults.filter((a) => !a.safe).length;
  const total = auditResults.length;

  observations.push(
    `✓ ${passed}/${total} lượt tự kiểm đạt hợp đồng.`,
  );

  if (unsafe === 0) {
    observations.push("✓ Không có vi phạm an toàn — Mercy giữ thể diện tốt.");
  } else {
    observations.push(
      `⚠ ${unsafe} lượt vi phạm an toàn — cần Chau xem xét từng lượt.`,
    );
  }

  // Dimension score breakdown from rubric classifications
  const rubricClassifications = auditResults
    .map((a) => a.rubricResult?.classification)
    .filter(Boolean);
  if (rubricClassifications.length > 0) {
    const exemplary = rubricClassifications.filter(
      (c) => c === "exemplary",
    ).length;
    const acceptable = rubricClassifications.filter(
      (c) => c === "acceptable",
    ).length;
    const needsRevision = rubricClassifications.filter(
      (c) => c === "needs_revision",
    ).length;
    const failing = rubricClassifications.filter(
      (c) => c === "failing",
    ).length;
    observations.push(
      `✓ Phân loại rubric: ${exemplary} xuất sắc, ${acceptable} đạt, ${needsRevision} cần sửa, ${failing} không an toàn.`,
    );
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "selfCheck",
    ...DIMENSION_NAMES.selfCheck,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.selfCheck,
    hasData,
  };
}

function buildLearningGainReview(
  gainResult: LearningGainResult | null,
): ChauDimensionReview {
  const observations: string[] = [];
  const hasData = gainResult !== null && gainResult.sufficientData;

  if (!hasData) {
    return {
      dimensionId: "learningGain",
      ...DIMENSION_NAMES.learningGain,
      score: 0,
      label: "đáng lo",
      observations: [
        gainResult
          ? "⚠ Không đủ dữ liệu để đánh giá mức độ tiến bộ."
          : "⚠ Không có dữ liệu đánh giá tiến bộ.",
      ],
      reviewQuestions: REVIEW_QUESTIONS.learningGain,
      hasData: false,
    };
  }

  const dims = gainResult.dimensions;
  const improving = dims.filter((d) => d.score >= 2);
  const declining = dims.filter((d) => d.score === 0);

  observations.push(
    `✓ Phân loại tổng thể: ${gainResult.summaryVi}`,
  );

  if (improving.length > 0) {
    observations.push(
      `✓ ${improving.length} chiều cải thiện: ${improving.map((d) => d.titleVi).join(", ")}.`,
    );
  }

  if (declining.length > 0) {
    observations.push(
      `⚠ ${declining.length} chiều giảm: ${declining.map((d) => d.titleVi).join(", ")}.`,
    );
  }

  if (improving.length === 0 && declining.length === 0 && gainResult.dimensions.length > 0) {
    observations.push("⚠ Không thấy cải thiện hay giảm rõ rệt — buổi học chưa tạo khác biệt.");
  }

  const score = dimensionScoreFromObservations(observations, hasData);

  return {
    dimensionId: "learningGain",
    ...DIMENSION_NAMES.learningGain,
    score,
    label: scoreToLabel(score),
    observations,
    reviewQuestions: REVIEW_QUESTIONS.learningGain,
    hasData,
  };
}

// ─── Action item generation ──────────────────────────────────────────────

function generateActionItems(
  dimensions: ChauDimensionReview[],
  safetyViolations: number,
  auditSafetyFailures: number,
): string[] {
  const items: string[] = [];

  for (const dim of dimensions) {
    if (dim.score === 0) {
      items.push(
        `[${dim.titleVi}] Khẩn cấp — chiều "${dim.titleVi}" đạt 0 điểm. Xem lại toàn bộ dữ liệu buổi học.`,
      );
    } else if (dim.score === 1) {
      items.push(
        `[${dim.titleVi}] Cần cải thiện — chiều "${dim.titleVi}" có vấn đề. Đọc các quan sát và câu hỏi đánh giá.`,
      );
    }
  }

  if (safetyViolations > 0 || auditSafetyFailures > 0) {
    items.push(
      `[AN TOÀN] Phát hiện ${safetyViolations + auditSafetyFailures} vi phạm an toàn/thể diện. Chau cần xem từng lượt vi phạm và quyết định có cần sửa prompt/contract không.`,
    );
  }

  const dimsWithoutData = dimensions.filter((d) => !d.hasData);
  if (dimsWithoutData.length > 0) {
    items.push(
      `[DỮ LIỆU] ${dimsWithoutData.length} chiều thiếu dữ liệu: ${dimsWithoutData.map((d) => d.titleVi).join(", ")}. Cần tích hợp thêm nguồn dữ liệu hoặc đánh dấu là "không đánh giá được".`,
    );
  }

  return items;
}

// ─── Public API ──────────────────────────────────────────────────────────

export interface BuildChauReviewPacketInput {
  /** Correction events from a session */
  events?: TranscriptCorrectionEvent[];
  /** Tutor turns (for explanation/hint counts) */
  turns?: TutorTurn[];
  /** Audit results from the audit gate */
  auditResults?: AuditResult[];
  /** Rubric result (from teacherMercyRubric.evaluateRubric) */
  rubricResult?: RubricResult | null;
  /** Memory snapshot (lightweight or from ai-tutor/learningMemory) */
  memoryData?: Partial<ChauMemorySnapshot> | null;
  /** Pre-computed learning gain result */
  gainResult?: LearningGainResult | null;
  /** Session identifier */
  sessionId?: string;
}

/**
 * Build a Chau Review Packet from session data.
 *
 * This is the main entry point. Provide whatever data you have — the function
 * gracefully degrades for missing inputs and surfaces data quality warnings.
 *
 * Pure function — no I/O, no side effects, deterministic.
 *
 * @example
 * ```ts
 * const packet = buildChauReviewPacket({
 *   events: session.events,
 *   auditResults: audits,
 *   memoryData: memory,
 *   sessionId: "session-abc",
 * });
 * // Read packet.overall.actionItems for what Chau should do next
 * ```
 */
export function buildChauReviewPacket(
  input: BuildChauReviewPacketInput,
): ChauReviewPacket {
  const {
    events = [],
    turns = [],
    auditResults = [],
    rubricResult = null,
    memoryData = null,
    gainResult = null,
    sessionId = "unknown",
  } = input;

  const generatedAt = new Date().toISOString();
  const eventCount = events.length;
  const turnCount = Math.max(turns.length, eventCount);

  // Build proof from events
  const proof: TranscriptCorrectionProof | null =
    events.length > 0
      ? buildCorrectionProof({
          sessionId: sessionId || "unknown",
          events,
          startedAt: events[0]?.timestamp ?? Date.now(),
          updatedAt: events[events.length - 1]?.timestamp ?? Date.now(),
        })
      : null;

  // Build memory snapshot
  const memorySnapshot = buildMemorySnapshot(memoryData);

  // Compute learning gain if not provided but events available
  let computedGain = gainResult;
  if (!computedGain && events.length >= 4) {
    const mid = Math.floor(events.length / 2);
    const baseline = captureBaseline(events.slice(0, mid));
    const outcome = captureOutcome(events.slice(mid));
    computedGain = assessLearningGain(baseline, outcome);
  }

  // ─── Compute dimension reviews ──────────────────────────────────────

  const diagnosisReview = buildDiagnosisReview(proof, events);
  const teachingReview = buildTeachingReview(proof, auditResults, rubricResult);
  const memoryReview = buildMemoryReview(memorySnapshot);
  const adaptationReview = buildAdaptationReview(proof, events);
  const selfCheckReview = buildSelfCheckReview(auditResults);
  const learningGainReview = buildLearningGainReview(computedGain);

  const dimensions = [
    diagnosisReview,
    teachingReview,
    memoryReview,
    adaptationReview,
    selfCheckReview,
    learningGainReview,
  ];

  // ─── Compute overall ────────────────────────────────────────────────

  const safetyViolations =
    (rubricResult && !rubricResult.safetyPassed ? 1 : 0) +
    auditResults.filter((a) => !a.safe).length;

  const contractViolations = auditResults.filter((a) => !a.passed).length;

  const hasEnoughData = dimensions.filter((d) => d.hasData).length >= 3;
  const dataWarnings: string[] = [];
  if (!hasEnoughData) {
    dataWarnings.push(
      `Chỉ ${dimensions.filter((d) => d.hasData).length}/6 chiều có đủ dữ liệu — cần ít nhất 3/6.`,
    );
  }
  if (eventCount < 4 && eventCount > 0) {
    dataWarnings.push(
      `Ít dữ liệu: chỉ có ${eventCount} sự kiện — không đủ để đánh giá thích ứng và tiến bộ.`,
    );
  }
  if (auditResults.length === 0 && eventCount > 0) {
    dataWarnings.push(
      "Không có dữ liệu tự kiểm — không thể xác nhận Mercy tự đánh giá đúng.",
    );
  }
  if (!memorySnapshot) {
    dataWarnings.push(
      "Không có dữ liệu ghi nhớ — không thể đánh giá khả năng nhớ của Mercy.",
    );
  }

  const overallScore = computeOverallScore(dimensions);
  const verdict = computeVerdict(overallScore, safetyViolations, hasEnoughData);

  // ─── Build diagnosis section ────────────────────────────────────────

  const correctBySource: Record<string, number> = {};
  if (proof) {
    for (const [source, count] of Object.entries(proof.correctionsBySource)) {
      correctBySource[source] = count;
    }
  }

  const tagCounts: Record<string, number> = {};
  const tagLabels: Record<string, string> = {};
  for (const e of events) {
    for (let i = 0; i < e.weaknessTags.length; i++) {
      const tag = e.weaknessTags[i];
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      if (e.weaknessLabelsVi[i]) {
        tagLabels[tag] = e.weaknessLabelsVi[i];
      }
    }
  }
  const topWeaknesses = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({
      tag,
      labelVi: tagLabels[tag] ?? tag,
      count,
    }));

  const totalCorrections = proof?.totalCorrections ?? 0;
  const eventsWithCorrections = proof?.eventsWithCorrections ?? 0;
  const errorRate =
    eventCount > 0 ? eventsWithCorrections / eventCount : 0;

  const avgConfidence =
    totalCorrections > 0
      ? events
          .flatMap((e) => e.corrections)
          .reduce((s, c) => s + c.confidence, 0) / totalCorrections
      : 0;

  // ─── Build teaching section ─────────────────────────────────────────

  const explanationsProvided = turns.filter(
    (t) => t.explanation && t.explanation.trim().length > 0,
  ).length;

  const hintsSurfaced = events.filter(
    (e) => e.timingMode && e.wasSurfaced,
  ).length;

  const timingDist: Record<string, number> = {};
  for (const e of events) {
    if (e.timingMode) {
      timingDist[e.timingMode] = (timingDist[e.timingMode] ?? 0) + 1;
    }
  }

  // ─── Build adaptation section ───────────────────────────────────────

  let correctionRateDecreased = false;
  let matchScoresImproved = false;
  const evidenceObservations: string[] = [];

  if (events.length >= 4) {
    const mid = Math.floor(events.length / 2);
    const first = events.slice(0, mid);
    const second = events.slice(mid);
    const firstCR =
      first.filter((e) => e.corrections.length > 0).length /
      Math.max(1, first.length);
    const secondCR =
      second.filter((e) => e.corrections.length > 0).length /
      Math.max(1, second.length);
    correctionRateDecreased = secondCR < firstCR;

    const firstScores = first
      .map((e) => e.matchScore)
      .filter((s): s is number => s !== null);
    const secondScores = second
      .map((e) => e.matchScore)
      .filter((s): s is number => s !== null);
    if (firstScores.length >= 2 && secondScores.length >= 2) {
      const firstAvg =
        firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
      const secondAvg =
        secondScores.reduce((a, b) => a + b, 0) / secondScores.length;
      matchScoresImproved = secondAvg > firstAvg;
    }

    if (correctionRateDecreased) {
      evidenceObservations.push(
        `Tỉ lệ sửa lỗi giảm từ nửa đầu (${Math.round(firstCR * 100)}%) → nửa sau (${Math.round(secondCR * 100)}%).`,
      );
    }
    if (matchScoresImproved) {
      evidenceObservations.push(
        "Điểm phát âm trung bình tăng trong nửa sau buổi học.",
      );
    }
  }

  // ─── Build self-check section ───────────────────────────────────────

  const auditsPassed = auditResults.filter((a) => a.passed).length;
  const safetyFailures = auditResults.filter((a) => !a.safe).length;
  const selfCorrectionEvents = events.filter(
    (e) =>
      e.weaknessTags.some((t) =>
        t.includes("self_correction") || t.includes("self-correct"),
      ),
  ).length;

  // ─── Build learning gain section ────────────────────────────────────

  const improvingGainDims = computedGain
    ? computedGain.dimensions
        .filter((d) => d.score >= 2)
        .map((d) => d.titleVi)
    : [];
  const decliningGainDims = computedGain
    ? computedGain.dimensions
        .filter((d) => d.score === 0)
        .map((d) => d.titleVi)
    : [];

  // ─── Assemble packet ────────────────────────────────────────────────

  return {
    meta: {
      generatedAt,
      sessionId: sessionId || "unknown",
      eventCount,
      turnCount,
      hasEnoughData,
      dataWarnings,
    },

    diagnosis: {
      totalCorrections,
      uniqueWeaknessTags: Object.keys(tagCounts).length,
      topWeaknesses,
      correctionsBySource: correctBySource,
      errorRate,
      avgConfidence,
      review: diagnosisReview,
    },

    teaching: {
      explanationsProvided,
      hintsSurfaced,
      timingDistribution: timingDist,
      rubricResult,
      safetyViolations:
        (rubricResult && !rubricResult.safetyPassed ? 1 : 0) +
        auditResults.filter((a) => !a.safe).length,
      contractViolations,
      review: teachingReview,
    },

    memory: {
      snapshot: memorySnapshot,
      memoryWasUsed: memorySnapshot !== null && memorySnapshot.totalCorrections > 0,
      strengthsCount: memorySnapshot?.strengths.length ?? 0,
      weaknessesCount: memorySnapshot?.needsReview.length ?? 0,
      isFresh: isMemoryFresh(memorySnapshot?.lastUpdatedAt ?? null),
      review: memoryReview,
    },

    adaptation: {
      difficultyAdjusted: correctionRateDecreased || matchScoresImproved,
      pacingChanged: correctionRateDecreased,
      correctionRateDecreased,
      matchScoresImproved,
      evidenceObservations,
      review: adaptationReview,
    },

    selfCheck: {
      auditCount: auditResults.length,
      auditsPassed,
      safetyFailures,
      selfCorrectionEvents,
      overclaimGuardActive: auditResults.length > 0,
      review: selfCheckReview,
    },

    learningGain: {
      gainResult: computedGain,
      hasMeasurableGain: computedGain ? hasMeasurableGain(computedGain) : false,
      hasReportableGain: computedGain ? isReportableGain(computedGain) : false,
      improvingDimensions: improvingGainDims,
      decliningDimensions: decliningGainDims,
      review: learningGainReview,
    },

    overall: {
      score: overallScore,
      verdict,
      summaryVi: buildOverallSummaryVi(verdict, dimensions),
      summaryEn: buildOverallSummaryEn(verdict, dimensions),
      actionItems: generateActionItems(
        dimensions,
        safetyViolations,
        safetyFailures,
      ),
      isReportable:
        hasEnoughData && verdict !== "concerning" && overallScore >= 2,
    },
  };
}

/**
 * Quick check: is this review packet in a reportable state?
 * Returns true if Chau can share this packet with stakeholders.
 */
export function isPacketReportable(packet: ChauReviewPacket): boolean {
  return packet.overall.isReportable;
}

/**
 * Extract a flat list of all action items from a review packet.
 * Useful for Chau's task management integration.
 */
export function getActionItems(packet: ChauReviewPacket): string[] {
  return [...packet.overall.actionItems];
}

/**
 * Get a compact Vietnamese summary of the review packet (1–2 lines).
 * Suitable for dashboard or notification previews.
 */
export function getCompactSummaryVi(packet: ChauReviewPacket): string {
  const dimScores = [
    packet.diagnosis.review,
    packet.teaching.review,
    packet.memory.review,
    packet.adaptation.review,
    packet.selfCheck.review,
    packet.learningGain.review,
  ]
    .map((d) => `${d.score}/3`)
    .join("·");

  return `${packet.overall.verdict === "excellent_teacher" ? "✓" : packet.overall.verdict === "good_teacher" ? "✓" : "⚠"} ${packet.overall.summaryVi.split("—")[0].trim()} [${dimScores}]`;
}

// ─── Dimension catalog ──────────────────────────────────────────────────

export const CHAU_REVIEW_DIMENSION_CATALOG: ReadonlyArray<{
  id: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  capability: string;
}> = [
  {
    id: "diagnosis",
    titleVi: "Chẩn đoán",
    titleEn: "Diagnose",
    descriptionVi:
      "Mercy có phát hiện đúng lỗi, gắn nhãn điểm yếu chính xác, và dùng đa dạng nguồn sửa lỗi không?",
    capability: "diagnose",
  },
  {
    id: "teaching",
    titleVi: "Giảng dạy",
    titleEn: "Teach",
    descriptionVi:
      "Mercy có sửa lỗi đúng lúc, giải thích rõ ràng, không khen giả, và giữ thể diện người học không?",
    capability: "teach",
  },
  {
    id: "memory",
    titleVi: "Ghi nhớ",
    titleEn: "Remember",
    descriptionVi:
      "Mercy có nhớ điểm mạnh, điểm yếu, và mẫu lỗi của người học để dùng trong buổi sau không?",
    capability: "remember",
  },
  {
    id: "adaptation",
    titleVi: "Thích ứng",
    titleEn: "Adapt",
    descriptionVi:
      "Mercy có điều chỉnh độ khó, tốc độ, và ngôn ngữ phù hợp với tiến bộ của người học không?",
    capability: "adapt",
  },
  {
    id: "selfCheck",
    titleVi: "Tự kiểm",
    titleEn: "Self-check",
    descriptionVi:
      "Mercy có tự đánh giá chất lượng câu trả lời trước khi gửi cho người học không?",
    capability: "self-check",
  },
  {
    id: "learningGain",
    titleVi: "Chứng minh tiến bộ",
    titleEn: "Prove improvement",
    descriptionVi:
      "Có bằng chứng cho thấy người học đã tiến bộ trong buổi học này không?",
    capability: "prove",
  },
];
