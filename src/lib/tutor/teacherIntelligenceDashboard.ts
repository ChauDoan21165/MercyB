/**
 * Teacher Intelligence Scoring Dashboard
 *
 * Aggregates Teacher Mercy's performance across multiple tutoring sessions
 * and human-learner testing checklist runs into a unified intelligence score
 * dashboard. Designed to answer the question Chau asks every day:
 *
 *   "Is Teacher Mercy acting like a strong human teacher today?"
 *
 * The dashboard combines two data sources:
 *   1. ChauReviewPacket — per-session 6-dimension teacher evaluation
 *   2. HumanLearnerChecklistResult — systematic testing with learner personas
 *
 * It produces:
 *   - Overall teacher intelligence score (0–100)
 *   - Per-dimension aggregate scores with trends
 *   - Cross-session trend analysis (improving / stable / declining)
 *   - Chau's daily action items (what needs attention today)
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Key APIs:
 *   buildTeacherIntelligenceDashboard({ packets, checklists })
 *   getDashboardCompactSummary(dashboard)
 *   getDashboardActionItems(dashboard)
 *   getDimensionTrend(dashboard, dimensionId)
 *   isDashboardReportable(dashboard)
 */

import {
  type ChauReviewPacket,
  type ChauReviewVerdict,
  type ChauDimensionReview,
  CHAU_REVIEW_DIMENSION_CATALOG,
} from "./chauReviewPacket";
import {
  type HumanLearnerChecklistResult,
  type HumanLearnerDimensionSummary,
  type ChecklistItemStatus,
} from "./humanLearnerTestingChecklist";
import type { LearningGainResult } from "./learningGainRubric";

// ─── Dashboard Types ──────────────────────────────────────────────────────────

/** 6 teacher intelligence dimensions (matches ChauReviewPacket + checklist) */
export type TeacherIntelligenceDimensionId =
  | "diagnosis"
  | "teaching"
  | "memory"
  | "adaptation"
  | "selfCheck"
  | "learningGain";

/** Trend direction for a dimension over time */
export type DashboardTrend = "improving" | "stable" | "declining" | "insufficient_data";

/** Qualitative score band */
export type DashboardScoreBand = "xuất sắc" | "tốt" | "khá" | "cần cải thiện" | "đáng lo";

/** Overall dashboard verdict */
export type DashboardVerdict =
  | "strong_human_teacher"
  | "competent_teacher"
  | "developing_teacher"
  | "needs_intervention";

/**
 * A normalized score record for a single session or checklist run.
 * All dimensions mapped to 0–3 for cross-source comparison.
 */
export interface TeacherDimensionScore {
  /** Which dimension */
  dimensionId: TeacherIntelligenceDimensionId;
  /** Vietnamese label */
  titleVi: string;
  /** English label */
  titleEn: string;
  /** Normalized score 0–3 */
  score: 0 | 1 | 2 | 3;
  /** Whether enough data existed for this dimension */
  hasData: boolean;
  /** Key observation in Vietnamese */
  observationVi: string;
  /** Source: "session" or "checklist" */
  source: "session" | "checklist";
  /** Source identifier (sessionId or checklist runId) */
  sourceId: string;
  /** Source timestamp (ISO) */
  timestamp: string;
}

/**
 * Aggregate score for one dimension across all sessions and checklists.
 */
export interface TeacherIntelligenceDimensionDashboard {
  /** Dimension identifier */
  dimensionId: TeacherIntelligenceDimensionId;
  /** Vietnamese title */
  titleVi: string;
  /** English title */
  titleEn: string;
  /** Capability category (diagnose / teach / remember / adapt / self-check / prove) */
  capability: string;
  /** Average score across all data sources (0–3) */
  averageScore: number;
  /** Number of data points (sessions + checklists contributing) */
  dataPointCount: number;
  /** Number of data points with actual data (not insufficient_data) */
  dataPointsWithData: number;
  /** Per-source breakdown */
  sessionAverage: number | null;
  checklistAverage: number | null;
  /** Trend over time */
  trend: DashboardTrend;
  /** Historical scores (oldest first) for trend calculation */
  scoreHistory: Array<{ score: number; source: string; timestamp: string }>;
  /** Score band */
  scoreBand: DashboardScoreBand;
  /** Vietnamese observations aggregated across sources */
  observations: string[];
  /** Whether this dimension needs Chau's attention */
  needsAttention: boolean;
  /** Why this dimension needs attention (Vietnamese) */
  attentionReasonVi: string | null;
  /** Dashboard-specific detail in Vietnamese */
  detailVi: string;
}

/**
 * Cross-session trend analysis for all dimensions.
 */
export interface TeacherIntelligenceTrends {
  /** Dimensions currently improving */
  improving: TeacherIntelligenceDimensionId[];
  /** Dimensions stable */
  stable: TeacherIntelligenceDimensionId[];
  /** Dimensions declining */
  declining: TeacherIntelligenceDimensionId[];
  /** Dimensions without enough data for trend */
  insufficientData: TeacherIntelligenceDimensionId[];
  /** Overall trend direction */
  overallTrend: DashboardTrend;
  /** Vietnamese summary of trends */
  summaryVi: string;
}

/**
 * Summary of a single session's contribution to the dashboard.
 */
export interface SessionScoreSummary {
  /** Session ID */
  sessionId: string;
  /** When the session occurred (ISO) */
  timestamp: string;
  /** Overall verdict from the review packet */
  verdict: ChauReviewVerdict;
  /** Overall score 0–3 */
  overallScore: 0 | 1 | 2 | 3;
  /** Per-dimension scores */
  dimensionScores: Record<string, number>;
  /** Number of events in the session */
  eventCount: number;
  /** Whether this session had enough data */
  hasEnoughData: boolean;
  /** Compact Vietnamese summary */
  compactSummaryVi: string;
}

/**
 * The full Teacher Intelligence Dashboard.
 *
 * This is the main output — a comprehensive view of Teacher Mercy's
 * performance across all sessions and checklist runs, designed to be
 * rendered in a dashboard UI or printed as a daily report.
 */
export interface TeacherIntelligenceDashboard {
  /** Dashboard metadata */
  meta: {
    /** When this dashboard was generated (ISO) */
    generatedAt: string;
    /** Number of sessions included */
    sessionCount: number;
    /** Number of checklist runs included */
    checklistCount: number;
    /** Number of sessions with enough data */
    sessionsWithData: number;
    /** Time window covered (human-readable, Vietnamese) */
    timeWindowVi: string;
    /** Whether enough total data exists for a meaningful dashboard */
    hasEnoughData: boolean;
    /** Data quality warnings */
    dataWarnings: string[];
  };

  /** Overall teacher intelligence */
  overall: {
    /** Overall intelligence score (0–100 scale) */
    intelligenceScore: number;
    /** Dashboard verdict */
    verdict: DashboardVerdict;
    /** Vietnamese label for the verdict */
    verdictLabelVi: string;
    /** English label for the verdict */
    verdictLabelEn: string;
    /** Vietnamese summary suitable for dashboard display */
    summaryVi: string;
    /** English summary for internal use */
    summaryEn: string;
    /** Whether Teacher Mercy meets the "strong human teacher" bar */
    isStrongHumanTeacher: boolean;
    /** Whether the dashboard is reportable to stakeholders */
    isReportable: boolean;
  };

  /** Per-dimension aggregate scores */
  dimensions: TeacherIntelligenceDimensionDashboard[];

  /** Trend analysis across all data sources */
  trends: TeacherIntelligenceTrends;

  /** Per-session breakdown */
  sessions: SessionScoreSummary[];

  /** Checklist integration summary */
  checklist: {
    /** Number of checklist runs included */
    runCount: number;
    /** Overall pass rate across all items */
    overallPassRate: number;
    /** Per-dimension checklist pass/fail summary */
    dimensionStatus: Array<{
      dimensionId: string;
      titleVi: string;
      passCount: number;
      partialCount: number;
      failCount: number;
      insufficientDataCount: number;
      passed: boolean;
    }>;
    /** Number of checklist items that failed */
    failedItemCount: number;
    /** Key failures that need Chau's attention */
    criticalFailures: string[];
  };

  /** Action items for Chau, prioritized */
  actionItems: string[];

  /** Compact one-line Vietnamese summary for dashboard header */
  compactSummaryVi: string;
}

// ─── Dashboard Input ──────────────────────────────────────────────────────────

export interface TeacherIntelligenceDashboardInput {
  /** Review packets from tutoring sessions (most recent first) */
  reviewPackets?: ChauReviewPacket[];
  /** Human learner checklist results */
  checklistResults?: HumanLearnerChecklistResult[];
  /** Time window description (e.g., "7 ngày qua", "30 ngày qua") */
  timeWindowVi?: string;
  /** Dashboard label (e.g., "Hôm nay", "Tuần 24") */
  label?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DIMENSION_NAMES: Record<
  TeacherIntelligenceDimensionId,
  { titleVi: string; titleEn: string; capability: string }
> = {
  diagnosis: {
    titleVi: "Chẩn đoán",
    titleEn: "Diagnose",
    capability: "diagnose",
  },
  teaching: {
    titleVi: "Giảng dạy",
    titleEn: "Teach",
    capability: "teach",
  },
  memory: {
    titleVi: "Ghi nhớ",
    titleEn: "Remember",
    capability: "remember",
  },
  adaptation: {
    titleVi: "Thích ứng",
    titleEn: "Adapt",
    capability: "adapt",
  },
  selfCheck: {
    titleVi: "Tự kiểm",
    titleEn: "Self-check",
    capability: "self-check",
  },
  learningGain: {
    titleVi: "Chứng minh tiến bộ",
    titleEn: "Prove improvement",
    capability: "prove",
  },
};

const ALL_DIMENSION_IDS: TeacherIntelligenceDimensionId[] = [
  "diagnosis",
  "teaching",
  "memory",
  "adaptation",
  "selfCheck",
  "learningGain",
];

// ─── Score band calculation ───────────────────────────────────────────────────

function computeScoreBand(avgScore: number, dataPointCount: number): DashboardScoreBand {
  if (dataPointCount === 0) return "đáng lo";
  if (avgScore >= 2.7) return "xuất sắc";
  if (avgScore >= 2.0) return "tốt";
  if (avgScore >= 1.3) return "khá";
  if (avgScore >= 0.5) return "cần cải thiện";
  return "đáng lo";
}

// ─── Verdict calculation ──────────────────────────────────────────────────────

function computeVerdict(
  intelligenceScore: number,
  failingDimensions: number,
  dataPointCount: number,
): DashboardVerdict {
  if (dataPointCount === 0) return "needs_intervention";
  if (intelligenceScore >= 80 && failingDimensions === 0) return "strong_human_teacher";
  if (intelligenceScore >= 60 && failingDimensions <= 1) return "competent_teacher";
  if (intelligenceScore >= 35 && failingDimensions <= 3) return "developing_teacher";
  return "needs_intervention";
}

function verdictLabel(verdict: DashboardVerdict): { vi: string; en: string } {
  switch (verdict) {
    case "strong_human_teacher":
      return {
        vi: "Giáo viên xuất sắc — dạy như người thật",
        en: "Strong human teacher — teaches like a real person",
      };
    case "competent_teacher":
      return {
        vi: "Giáo viên tốt — dạy ổn, vài điểm cần cải thiện",
        en: "Competent teacher — solid, minor improvements needed",
      };
    case "developing_teacher":
      return {
        vi: "Giáo viên đang phát triển — cần theo dõi thêm",
        en: "Developing teacher — needs monitoring and improvement",
      };
    case "needs_intervention":
      return {
        vi: "Cần can thiệp — Chau phải xem ngay",
        en: "Needs intervention — Chau must review immediately",
      };
  }
}

// ─── Trend calculation ────────────────────────────────────────────────────────

function computeTrend(
  scoreHistory: Array<{ score: number; timestamp: string }>,
): DashboardTrend {
  if (scoreHistory.length < 2) return "insufficient_data";

  // Use simple linear regression on the last N points (up to 10)
  const points = scoreHistory.slice(-10);
  const n = points.length;

  // Normalize timestamps to hours from first point
  const firstTs = new Date(points[0].timestamp).getTime();
  if (Number.isNaN(firstTs)) return "insufficient_data";

  const xs: number[] = [];
  const ys: number[] = [];

  for (let i = 0; i < n; i++) {
    const ts = new Date(points[i].timestamp).getTime();
    if (Number.isNaN(ts)) continue;
    xs.push((ts - firstTs) / (1000 * 60 * 60)); // hours
    ys.push(points[i].score);
  }

  if (xs.length < 2) return "insufficient_data";

  // Linear regression slope
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < xs.length; i++) {
    numerator += (xs[i] - meanX) * (ys[i] - meanY);
    denominator += (xs[i] - meanX) ** 2;
  }

  if (denominator === 0) return "stable";

  const slope = numerator / denominator;
  // Slope is per-hour; normalize to per-10-hours for interpretability
  const normalizedSlope = slope * 10;

  if (normalizedSlope > 0.15) return "improving";
  if (normalizedSlope < -0.15) return "declining";
  return "stable";
}

// ─── Map ChauReviewPacket → dimension scores ──────────────────────────────────

/**
 * Extract normalized dimension scores from a ChauReviewPacket.
 * Maps the 6 review dimensions to the dashboard's dimension IDs.
 */
function mapPacketToDimensionScores(
  packet: ChauReviewPacket,
): TeacherDimensionScore[] {
  const dimensionMap: Record<string, ChauDimensionReview> = {
    diagnosis: packet.diagnosis.review,
    teaching: packet.teaching.review,
    memory: packet.memory.review,
    adaptation: packet.adaptation.review,
    selfCheck: packet.selfCheck.review,
    learningGain: packet.learningGain.review,
  };

  const bestObservation = (dim: ChauDimensionReview): string => {
    if (dim.observations.length > 0) return dim.observations[0];
    return dim.hasData
      ? "✓ Có dữ liệu để đánh giá."
      : "⚠ Không đủ dữ liệu để đánh giá.";
  };

  return ALL_DIMENSION_IDS.map((dimId) => {
    const dim = dimensionMap[dimId];
    const names = DIMENSION_NAMES[dimId];
    return {
      dimensionId: dimId,
      titleVi: names.titleVi,
      titleEn: names.titleEn,
      score: dim.score as 0 | 1 | 2 | 3,
      hasData: dim.hasData,
      observationVi: bestObservation(dim),
      source: "session" as const,
      sourceId: packet.meta.sessionId,
      timestamp: packet.meta.generatedAt,
    };
  });
}

/**
 * Extract normalized dimension scores from a HumanLearnerChecklistResult.
 * Converts checklist dimension pass/fail to 0–3 scale.
 */
function mapChecklistToDimensionScores(
  result: HumanLearnerChecklistResult,
): TeacherDimensionScore[] {
  // Map checklist dimension IDs to dashboard dimension IDs
  const checklistDimMap: Record<string, TeacherIntelligenceDimensionId> = {
    "Chẩn đoán": "diagnosis",
    "Giảng dạy": "teaching",
    "Ghi nhớ": "memory",
    "Thích ứng": "adaptation",
    "Tự kiểm": "selfCheck",
    "Chứng minh tiến bộ": "learningGain",
  };

  const scoreFromChecklistStatus = (
    dim: HumanLearnerDimensionSummary,
  ): 0 | 1 | 2 | 3 => {
    if (dim.itemCount === 0) return 0;
    const passRate =
      (dim.statusCounts.pass + dim.statusCounts.partial * 0.5) / dim.itemCount;
    if (passRate >= 0.9) return 3;
    if (passRate >= 0.7) return 2;
    if (passRate >= 0.4) return 1;
    return 0;
  };

  return result.dimensions.map((dim) => {
    const dashboardId =
      checklistDimMap[dim.titleVi] || ("diagnosis" as TeacherIntelligenceDimensionId);
    const names = DIMENSION_NAMES[dashboardId];
    return {
      dimensionId: dashboardId,
      titleVi: names.titleVi,
      titleEn: names.titleEn,
      score: scoreFromChecklistStatus(dim),
      hasData: dim.itemCount > 0,
      observationVi: dim.summaryVi || `${dim.itemCount} mục kiểm tra, ${dim.statusCounts.pass} đạt.`,
      source: "checklist" as const,
      sourceId: `checklist-${result.generatedAt}`,
      timestamp: result.generatedAt,
    };
  });
}

// ─── Dimension aggregation ────────────────────────────────────────────────────

function aggregateDimension(
  dimId: TeacherIntelligenceDimensionId,
  allScores: TeacherDimensionScore[],
): TeacherIntelligenceDimensionDashboard {
  const names = DIMENSION_NAMES[dimId];
  const dimScores = allScores.filter((s) => s.dimensionId === dimId);

  // Separate by source
  const sessionScores = dimScores.filter((s) => s.source === "session");
  const checklistScores = dimScores.filter((s) => s.source === "checklist");

  const dataPointsWithData = dimScores.filter((s) => s.hasData).length;

  // Compute averages
  const totalScore = dimScores.reduce((sum, s) => sum + s.score, 0);
  const averageScore = dimScores.length > 0 ? totalScore / dimScores.length : 0;

  const sessionTotal = sessionScores.reduce((sum, s) => sum + s.score, 0);
  const sessionAverage =
    sessionScores.length > 0 ? sessionTotal / sessionScores.length : null;

  const checklistTotal = checklistScores.reduce((sum, s) => sum + s.score, 0);
  const checklistAverage =
    checklistScores.length > 0 ? checklistTotal / checklistScores.length : null;

  // Score history for trend
  const scoreHistory = [...sessionScores, ...checklistScores]
    .filter((s) => s.hasData)
    .map((s) => ({ score: s.score, source: s.source, timestamp: s.timestamp }))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

  const trend = computeTrend(
    scoreHistory.map((h) => ({ score: h.score, timestamp: h.timestamp })),
  );

  const scoreBand = computeScoreBand(averageScore, dataPointsWithData);

  // Aggregate observations
  const observations: string[] = [];
  if (dimScores.length === 0) {
    observations.push("⚠ Không có dữ liệu cho chiều này.");
  } else {
    if (sessionScores.length > 0) {
      observations.push(
        `✓ ${sessionScores.length} buổi học có dữ liệu (trung bình: ${sessionAverage?.toFixed(1)}/3).`,
      );
    }
    if (checklistScores.length > 0) {
      observations.push(
        `✓ ${checklistScores.length} lần kiểm tra checklist (trung bình: ${checklistAverage?.toFixed(1)}/3).`,
      );
    }
    if (trend === "improving") {
      observations.push("↗ Đang cải thiện qua thời gian.");
    } else if (trend === "declining") {
      observations.push("↘ Đang giảm qua thời gian — cần chú ý.");
    }
    if (scoreBand === "đáng lo" || scoreBand === "cần cải thiện") {
      observations.push(
        `⚠ Điểm thấp (${averageScore.toFixed(1)}/3) — Chau nên xem lại dữ liệu gốc.`,
      );
    }
  }

  // Determine if needs attention
  const needsAttention =
    scoreBand === "đáng lo" ||
    scoreBand === "cần cải thiện" ||
    trend === "declining" ||
    dataPointsWithData === 0;

  let attentionReasonVi: string | null = null;
  if (needsAttention) {
    if (dataPointsWithData === 0) {
      attentionReasonVi = `Không có dữ liệu cho "${names.titleVi}". Cần thu thập thêm buổi học hoặc chạy checklist.`;
    } else if (scoreBand === "đáng lo") {
      attentionReasonVi = `"${names.titleVi}" đạt điểm rất thấp (${averageScore.toFixed(1)}/3). Xem lại dữ liệu các buổi học gần đây.`;
    } else if (trend === "declining") {
      attentionReasonVi = `"${names.titleVi}" đang có xu hướng giảm. Kiểm tra xem có thay đổi prompt hoặc contract gần đây không.`;
    } else {
      attentionReasonVi = `"${names.titleVi}" cần cải thiện (${averageScore.toFixed(1)}/3). Xem các mục hành động bên dưới.`;
    }
  }

  // Build detail
  const detailVi = [
    `Điểm trung bình: ${averageScore.toFixed(1)}/3`,
    `Số điểm dữ liệu: ${dataPointsWithData}`,
    `Xu hướng: ${
      trend === "improving"
        ? "đang cải thiện ↗"
        : trend === "declining"
          ? "đang giảm ↘"
          : trend === "stable"
            ? "ổn định →"
            : "chưa đủ dữ liệu"
    }`,
    sessionAverage !== null
      ? `Buổi học: ${sessionAverage.toFixed(1)}/3`
      : "Buổi học: chưa có",
    checklistAverage !== null
      ? `Checklist: ${checklistAverage.toFixed(1)}/3`
      : "Checklist: chưa có",
  ].join(" | ");

  return {
    dimensionId: dimId,
    titleVi: names.titleVi,
    titleEn: names.titleEn,
    capability: names.capability,
    averageScore,
    dataPointCount: dimScores.length,
    dataPointsWithData,
    sessionAverage,
    checklistAverage,
    trend,
    scoreHistory,
    scoreBand,
    observations,
    needsAttention,
    attentionReasonVi,
    detailVi,
  };
}

// ─── Trend analysis ───────────────────────────────────────────────────────────

function buildTrends(
  dimensions: TeacherIntelligenceDimensionDashboard[],
): TeacherIntelligenceTrends {
  const improving: TeacherIntelligenceDimensionId[] = [];
  const stable: TeacherIntelligenceDimensionId[] = [];
  const declining: TeacherIntelligenceDimensionId[] = [];
  const insufficientData: TeacherIntelligenceDimensionId[] = [];

  for (const dim of dimensions) {
    switch (dim.trend) {
      case "improving":
        improving.push(dim.dimensionId);
        break;
      case "stable":
        stable.push(dim.dimensionId);
        break;
      case "declining":
        declining.push(dim.dimensionId);
        break;
      case "insufficient_data":
        insufficientData.push(dim.dimensionId);
        break;
    }
  }

  // Overall trend
  let overallTrend: DashboardTrend;
  if (improving.length > declining.length && improving.length >= 3) {
    overallTrend = "improving";
  } else if (declining.length >= 3) {
    overallTrend = "declining";
  } else if (insufficientData.length === 6) {
    overallTrend = "insufficient_data";
  } else {
    overallTrend = "stable";
  }

  // Build summary
  const parts: string[] = [];
  if (improving.length > 0) {
    parts.push(
      `${improving.length} chiều đang cải thiện (${improving.map((id) => DIMENSION_NAMES[id].titleVi).join(", ")})`,
    );
  }
  if (declining.length > 0) {
    parts.push(
      `${declining.length} chiều đang giảm (${declining.map((id) => DIMENSION_NAMES[id].titleVi).join(", ")})`,
    );
  }
  if (stable.length > 0) {
    parts.push(`${stable.length} chiều ổn định`);
  }
  if (insufficientData.length > 0) {
    parts.push(`${insufficientData.length} chiều chưa đủ dữ liệu`);
  }

  const summaryVi =
    parts.length > 0
      ? parts.join(". ") + "."
      : "Chưa đủ dữ liệu để phân tích xu hướng.";

  return {
    improving,
    stable,
    declining,
    insufficientData,
    overallTrend,
    summaryVi,
  };
}

// ─── Session summaries ────────────────────────────────────────────────────────

function buildSessionSummaries(
  packets: ChauReviewPacket[],
): SessionScoreSummary[] {
  return packets.map((p) => {
    const dimensionScores: Record<string, number> = {};
    dimensionScores["diagnosis"] = p.diagnosis.review.score;
    dimensionScores["teaching"] = p.teaching.review.score;
    dimensionScores["memory"] = p.memory.review.score;
    dimensionScores["adaptation"] = p.adaptation.review.score;
    dimensionScores["selfCheck"] = p.selfCheck.review.score;
    dimensionScores["learningGain"] = p.learningGain.review.score;

    return {
      sessionId: p.meta.sessionId,
      timestamp: p.meta.generatedAt,
      verdict: p.overall.verdict,
      overallScore: p.overall.score,
      dimensionScores,
      eventCount: p.meta.eventCount,
      hasEnoughData: p.meta.hasEnoughData,
      compactSummaryVi:
        p.overall.summaryVi ||
        `${p.meta.sessionId}: ${p.overall.verdict} (${p.overall.score}/3)`,
    };
  });
}

// ─── Checklist integration ────────────────────────────────────────────────────

function buildChecklistSummary(
  results: HumanLearnerChecklistResult[],
): TeacherIntelligenceDashboard["checklist"] {
  if (results.length === 0) {
    return {
      runCount: 0,
      overallPassRate: 0,
      dimensionStatus: [],
      failedItemCount: 0,
      criticalFailures: [],
    };
  }

  // Aggregate all items across all runs
  const allItems = results.flatMap((r) => r.items);

  const passCount = allItems.filter((i) => i.status === "pass").length;
  const partialCount = allItems.filter((i) => i.status === "partial").length;
  const totalItems = allItems.length;
  const overallPassRate =
    totalItems > 0
      ? (passCount + partialCount * 0.5) / totalItems
      : 0;

  // Per-dimension aggregation
  const dimMap = new Map<
    string,
    {
      titleVi: string;
      passCount: number;
      partialCount: number;
      failCount: number;
      insufficientDataCount: number;
    }
  >();

  for (const item of allItems) {
    if (!dimMap.has(item.dimension)) {
      dimMap.set(item.dimension, {
        titleVi: item.dimension,
        passCount: 0,
        partialCount: 0,
        failCount: 0,
        insufficientDataCount: 0,
      });
    }
    const entry = dimMap.get(item.dimension)!;
    if (item.status === "pass") entry.passCount++;
    else if (item.status === "partial") entry.partialCount++;
    else if (item.status === "fail") entry.failCount++;
    else entry.insufficientDataCount++;
  }

  const dimensionStatus = Array.from(dimMap.entries()).map(([dimId, counts]) => {
    const total = counts.passCount + counts.partialCount + counts.failCount + counts.insufficientDataCount;
    const passed = counts.failCount === 0 && counts.passCount >= total * 0.5;
    return {
      dimensionId: dimId,
      titleVi: counts.titleVi,
      passCount: counts.passCount,
      partialCount: counts.partialCount,
      failCount: counts.failCount,
      insufficientDataCount: counts.insufficientDataCount,
      passed,
    };
  });

  const failedItemCount = allItems.filter((i) => i.status === "fail").length;

  const criticalFailures = allItems
    .filter((i) => i.status === "fail")
    .slice(0, 10)
    .map((i) => `[${i.dimension}] ${i.descriptionVi}: ${i.evidenceVi}`);

  return {
    runCount: results.length,
    overallPassRate,
    dimensionStatus,
    failedItemCount,
    criticalFailures,
  };
}

// ─── Intelligence score computation ───────────────────────────────────────────

/**
 * Compute the overall teacher intelligence score on a 0–100 scale.
 *
 * Combines:
 *   - 60% from session review packet averages (weighted by data availability)
 *   - 40% from checklist pass rates
 *
 * Falls back gracefully when only one source is available.
 */
function computeIntelligenceScore(
  dimensions: TeacherIntelligenceDimensionDashboard[],
  checklistSummary: TeacherIntelligenceDashboard["checklist"],
  sessionCount: number,
  checklistCount: number,
): number {
  const dimsWithData = dimensions.filter((d) => d.dataPointsWithData > 0);
  if (dimsWithData.length === 0 && checklistCount === 0) return 0;

  // Session contribution: average of dimension scores mapped to 0–100
  let sessionScore = 0;
  if (dimsWithData.length > 0) {
    const avgDimScore = dimsWithData.reduce((s, d) => s + d.averageScore, 0) / dimsWithData.length;
    sessionScore = (avgDimScore / 3) * 100;
  }

  // Checklist contribution: pass rate mapped to 0–100
  const checklistScore = checklistCount > 0 ? checklistSummary.overallPassRate * 100 : 0;

  // Weighted combination
  if (sessionCount > 0 && checklistCount > 0) {
    return Math.round(sessionScore * 0.6 + checklistScore * 0.4);
  }
  if (sessionCount > 0) {
    return Math.round(sessionScore);
  }
  if (checklistCount > 0) {
    return Math.round(checklistScore);
  }
  return 0;
}

// ─── Action items ─────────────────────────────────────────────────────────────

function buildDashboardActionItems(
  dimensions: TeacherIntelligenceDimensionDashboard[],
  trends: TeacherIntelligenceTrends,
  checklistSummary: TeacherIntelligenceDashboard["checklist"],
): string[] {
  const items: string[] = [];

  // Critical: declining dimensions
  for (const dimId of trends.declining) {
    const dim = dimensions.find((d) => d.dimensionId === dimId);
    if (dim) {
      items.push(
        `[KHẨN] "${dim.titleVi}" đang giảm — kiểm tra prompt, contract, hoặc dữ liệu gần đây.`,
      );
    }
  }

  // Critical: failing dimensions (score band "đáng lo")
  for (const dim of dimensions) {
    if (dim.scoreBand === "đáng lo" && dim.dataPointsWithData > 0) {
      items.push(
        `[KHẨN] "${dim.titleVi}" đạt mức "đáng lo" (${dim.averageScore.toFixed(1)}/3). Xem lại toàn bộ buổi học gần nhất.`,
      );
    }
  }

  // Warning: needs-attention dimensions
  for (const dim of dimensions) {
    if (dim.needsAttention && dim.scoreBand !== "đáng lo") {
      items.push(
        `[CẦN XEM] "${dim.titleVi}" cần chú ý — ${dim.attentionReasonVi || "xem chi tiết bên dưới."}`,
      );
    }
  }

  // Checklist failures
  if (checklistSummary.failedItemCount > 0) {
    items.push(
      `[CHECKLIST] ${checklistSummary.failedItemCount} mục kiểm tra thất bại. Xem danh sách lỗi nghiêm trọng trong phần checklist.`,
    );
  }

  // Data quality
  const dimsWithoutData = dimensions.filter((d) => d.dataPointsWithData === 0);
  if (dimsWithoutData.length > 0) {
    items.push(
      `[DỮ LIỆU] ${dimsWithoutData.length} chiều không có dữ liệu: ${dimsWithoutData.map((d) => d.titleVi).join(", ")}. Cần chạy thêm buổi học hoặc checklist.`,
    );
  }

  // Overall: if everything is fine
  if (items.length === 0) {
    items.push(
      "✓ Tất cả các chiều đều ổn. Tiếp tục theo dõi định kỳ.",
    );
  }

  return items;
}

// ─── Compact summary ──────────────────────────────────────────────────────────

function buildCompactSummaryVi(
  verdict: DashboardVerdict,
  intelligenceScore: number,
  dimensions: TeacherIntelligenceDimensionDashboard[],
  trends: TeacherIntelligenceTrends,
): string {
  const label = verdictLabel(verdict);
  const dimsWithData = dimensions.filter((d) => d.dataPointsWithData > 0);
  const bestDim = [...dimensions]
    .filter((d) => d.dataPointsWithData > 0)
    .sort((a, b) => b.averageScore - a.averageScore)[0];
  const worstDim = [...dimensions]
    .filter((d) => d.dataPointsWithData > 0)
    .sort((a, b) => a.averageScore - b.averageScore)[0];

  const parts = [
    `Điểm thông minh giáo viên: ${intelligenceScore}/100 — ${label.vi}`,
  ];

  if (bestDim) {
    parts.push(`Mạnh nhất: ${bestDim.titleVi} (${bestDim.averageScore.toFixed(1)}/3)`);
  }
  if (worstDim && worstDim.dimensionId !== bestDim?.dimensionId) {
    parts.push(`Cần cải thiện nhất: ${worstDim.titleVi} (${worstDim.averageScore.toFixed(1)}/3)`);
  }

  if (trends.overallTrend === "improving") {
    parts.push("Xu hướng: đang cải thiện ↗");
  } else if (trends.overallTrend === "declining") {
    parts.push("Xu hướng: đang giảm ↘ — cần chú ý!");
  }

  return parts.join(" | ");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a Teacher Intelligence Dashboard.
 *
 * Aggregates data from tutoring session review packets and human learner
 * testing checklists into a comprehensive intelligence score dashboard.
 *
 * Pure function — no I/O, no side effects, deterministic.
 *
 * @example
 * ```ts
 * const dashboard = buildTeacherIntelligenceDashboard({
 *   reviewPackets: [packet1, packet2, packet3],
 *   checklistResults: [checklistResult],
 *   timeWindowVi: "7 ngày qua",
 * });
 *
 * // Dashboard header
 * console.log(dashboard.compactSummaryVi);
 * // → "Điểm thông minh giáo viên: 82/100 — Giáo viên xuất sắc..."
 *
 * // Action items for Chau
 * for (const item of dashboard.actionItems) {
 *   console.log(item);
 * }
 * ```
 */
export function buildTeacherIntelligenceDashboard(
  input: TeacherIntelligenceDashboardInput,
): TeacherIntelligenceDashboard {
  const {
    reviewPackets = [],
    checklistResults = [],
    timeWindowVi = "không xác định",
    label = "",
  } = input;

  const generatedAt = new Date().toISOString();

  // Filter to packets with enough data
  const validPackets = reviewPackets.filter((p) => p.meta.hasEnoughData);
  const sessionCount = reviewPackets.length;
  const checklistCount = checklistResults.length;
  const sessionsWithData = validPackets.length;

  // Data warnings
  const dataWarnings: string[] = [];
  if (sessionCount === 0 && checklistCount === 0) {
    dataWarnings.push(
      "⚠ Không có buổi học hoặc checklist nào — dashboard trống.",
    );
  }
  if (sessionCount > 0 && sessionsWithData === 0) {
    dataWarnings.push(
      "⚠ Tất cả buổi học đều không đủ dữ liệu để đánh giá.",
    );
  }
  if (sessionCount < 3 && checklistCount === 0) {
    dataWarnings.push(
      "⚠ Ít hơn 3 buổi học và không có checklist — xu hướng có thể không chính xác.",
    );
  }

  const hasEnoughData = sessionsWithData > 0 || checklistCount > 0;

  // ─── Map all data sources to unified dimension scores ──────────────────

  const allScores: TeacherDimensionScore[] = [];

  for (const packet of reviewPackets) {
    allScores.push(...mapPacketToDimensionScores(packet));
  }

  for (const result of checklistResults) {
    allScores.push(...mapChecklistToDimensionScores(result));
  }

  // ─── Aggregate dimensions ──────────────────────────────────────────────

  const dimensions = ALL_DIMENSION_IDS.map((dimId) =>
    aggregateDimension(dimId, allScores),
  );

  // ─── Build sub-components ──────────────────────────────────────────────

  const trends = buildTrends(dimensions);
  const sessions = buildSessionSummaries(reviewPackets);
  const checklist = buildChecklistSummary(checklistResults);

  // ─── Compute overall intelligence score ────────────────────────────────

  const intelligenceScore = computeIntelligenceScore(
    dimensions,
    checklist,
    sessionCount,
    checklistCount,
  );

  // Count failing dimensions for verdict
  const failingDimensions = dimensions.filter(
    (d) => d.scoreBand === "đáng lo" && d.dataPointsWithData > 0,
  ).length;

  const verdict = computeVerdict(
    intelligenceScore,
    failingDimensions,
    sessionsWithData + checklistCount,
  );

  const verdictLabels = verdictLabel(verdict);

  // ─── Build overall summary ─────────────────────────────────────────────

  const dimSummary = dimensions
    .map((d) => `${d.titleVi}: ${d.averageScore.toFixed(1)}/3 (${d.scoreBand})`)
    .join(", ");

  const summaryVi = [
    `Điểm thông minh giáo viên: ${intelligenceScore}/100 — ${verdictLabels.vi}.`,
    `Dựa trên ${sessionCount} buổi học (${sessionsWithData} có dữ liệu) và ${checklistCount} lần kiểm tra checklist.`,
    `Chi tiết: ${dimSummary}.`,
    `Xu hướng: ${trends.summaryVi}`,
  ].join("\n");

  const summaryEn = [
    `Teacher Intelligence Score: ${intelligenceScore}/100 — ${verdictLabels.en}.`,
    `Based on ${sessionCount} sessions (${sessionsWithData} with data) and ${checklistCount} checklist runs.`,
    `Details: ${dimSummary}.`,
    `Trends: ${improvingCount(dimensions)} improving, ${decliningCount(dimensions)} declining.`,
  ].join("\n");

  // ─── Build action items ────────────────────────────────────────────────

  const actionItems = buildDashboardActionItems(dimensions, trends, checklist);

  // ─── Build compact summary ─────────────────────────────────────────────

  const compactSummaryVi = buildCompactSummaryVi(
    verdict,
    intelligenceScore,
    dimensions,
    trends,
  );

  return {
    meta: {
      generatedAt,
      sessionCount,
      checklistCount,
      sessionsWithData,
      timeWindowVi,
      hasEnoughData,
      dataWarnings,
    },
    overall: {
      intelligenceScore,
      verdict,
      verdictLabelVi: verdictLabels.vi,
      verdictLabelEn: verdictLabels.en,
      summaryVi,
      summaryEn,
      isStrongHumanTeacher: verdict === "strong_human_teacher",
      isReportable: hasEnoughData && intelligenceScore >= 50,
    },
    dimensions,
    trends,
    sessions,
    checklist,
    actionItems,
    compactSummaryVi,
  };
}

// ─── Dashboard query helpers ──────────────────────────────────────────────────

/**
 * Check if the dashboard has enough data to be reportable to stakeholders.
 */
export function isDashboardReportable(
  dashboard: TeacherIntelligenceDashboard,
): boolean {
  return dashboard.meta.hasEnoughData && dashboard.overall.intelligenceScore >= 40;
}

/**
 * Get the trend for a specific dimension.
 */
export function getDimensionTrend(
  dashboard: TeacherIntelligenceDashboard,
  dimensionId: TeacherIntelligenceDimensionId,
): {
  trend: DashboardTrend;
  scoreHistory: Array<{ score: number; source: string; timestamp: string }>;
  detailVi: string;
} {
  const dim = dashboard.dimensions.find((d) => d.dimensionId === dimensionId);
  if (!dim) {
    return {
      trend: "insufficient_data",
      scoreHistory: [],
      detailVi: `Không tìm thấy chiều "${dimensionId}".`,
    };
  }
  return {
    trend: dim.trend,
    scoreHistory: dim.scoreHistory,
    detailVi: dim.detailVi,
  };
}

/**
 * Get the compact one-line Vietnamese summary for the dashboard header.
 */
export function getDashboardCompactSummary(
  dashboard: TeacherIntelligenceDashboard,
): string {
  return dashboard.compactSummaryVi;
}

/**
 * Get prioritized action items for Chau.
 */
export function getDashboardActionItems(
  dashboard: TeacherIntelligenceDashboard,
): string[] {
  return dashboard.actionItems;
}

/**
 * Get all dimensions that need Chau's attention.
 */
export function getDimensionsNeedingAttention(
  dashboard: TeacherIntelligenceDashboard,
): TeacherIntelligenceDimensionDashboard[] {
  return dashboard.dimensions.filter((d) => d.needsAttention);
}

/**
 * Get the teacher intelligence score as a simple number for dashboard widgets.
 */
export function getIntelligenceScore(
  dashboard: TeacherIntelligenceDashboard,
): number {
  return dashboard.overall.intelligenceScore;
}

/**
 * Compare two dashboards (e.g., this week vs last week) and detect changes.
 * Returns a summary of what improved, what declined, and what stayed the same.
 */
export function compareDashboards(
  current: TeacherIntelligenceDashboard,
  previous: TeacherIntelligenceDashboard,
): {
  scoreDelta: number;
  improvedDimensions: string[];
  declinedDimensions: string[];
  unchangedDimensions: string[];
  summaryVi: string;
} {
  const improvedDimensions: string[] = [];
  const declinedDimensions: string[] = [];
  const unchangedDimensions: string[] = [];

  for (const dimId of ALL_DIMENSION_IDS) {
    const cur = current.dimensions.find((d) => d.dimensionId === dimId);
    const prev = previous.dimensions.find((d) => d.dimensionId === dimId);

    if (!cur || !prev) {
      unchangedDimensions.push(DIMENSION_NAMES[dimId].titleVi);
      continue;
    }

    const delta = cur.averageScore - prev.averageScore;
    if (delta > 0.3) {
      improvedDimensions.push(cur.titleVi);
    } else if (delta < -0.3) {
      declinedDimensions.push(cur.titleVi);
    } else {
      unchangedDimensions.push(cur.titleVi);
    }
  }

  const scoreDelta = current.overall.intelligenceScore - previous.overall.intelligenceScore;

  const parts: string[] = [];
  if (scoreDelta > 0) {
    parts.push(`Điểm tăng ${scoreDelta} điểm so với kỳ trước.`);
  } else if (scoreDelta < 0) {
    parts.push(`Điểm giảm ${Math.abs(scoreDelta)} điểm so với kỳ trước.`);
  } else {
    parts.push("Điểm không đổi so với kỳ trước.");
  }

  if (improvedDimensions.length > 0) {
    parts.push(`${improvedDimensions.length} chiều cải thiện: ${improvedDimensions.join(", ")}.`);
  }
  if (declinedDimensions.length > 0) {
    parts.push(`${declinedDimensions.length} chiều giảm: ${declinedDimensions.join(", ")}.`);
  }

  return {
    scoreDelta,
    improvedDimensions,
    declinedDimensions,
    unchangedDimensions,
    summaryVi: parts.join(" "),
  };
}

/**
 * Assess whether Teacher Mercy passes the "strong human teacher" bar.
 * Returns true only if the overall verdict is "strong_human_teacher".
 */
export function isStrongHumanTeacher(
  dashboard: TeacherIntelligenceDashboard,
): boolean {
  return dashboard.overall.isStrongHumanTeacher;
}

/**
 * Get a weekly report suitable for Chau's review workflow.
 * Produces a structured summary with all the information Chau needs
 * to make a decision about Teacher Mercy's performance today.
 */
export function getWeeklyReportSummary(
  dashboard: TeacherIntelligenceDashboard,
): {
  score: number;
  verdictVi: string;
  topStrength: string;
  topWeakness: string;
  trendDirection: string;
  actionItemCount: number;
  checklistPassRate: string;
  summaryParagraphVi: string;
} {
  const dimsWithData = dashboard.dimensions.filter((d) => d.dataPointsWithData > 0);
  const sorted = [...dimsWithData].sort((a, b) => b.averageScore - a.averageScore);

  const topStrength = sorted[0]?.titleVi ?? "Chưa có dữ liệu";
  const topWeakness = sorted[sorted.length - 1]?.titleVi ?? "Chưa có dữ liệu";

  const checklistPassRate =
    dashboard.checklist.runCount > 0
      ? `${Math.round(dashboard.checklist.overallPassRate * 100)}%`
      : "Chưa có";

  const trendDirection =
    dashboard.trends.overallTrend === "improving"
      ? "đang cải thiện ↗"
      : dashboard.trends.overallTrend === "declining"
        ? "đang giảm ↘"
        : dashboard.trends.overallTrend === "stable"
          ? "ổn định →"
          : "chưa đủ dữ liệu";

  const summaryParagraphVi = [
    `Điểm thông minh giáo viên tuần này: ${dashboard.overall.intelligenceScore}/100.`,
    `Xếp loại: ${dashboard.overall.verdictLabelVi}.`,
    `Mạnh nhất: ${topStrength}. Yếu nhất: ${topWeakness}.`,
    `Xu hướng: ${trendDirection}.`,
    `${dashboard.actionItems.length} mục hành động cần xem.`,
    `Tỉ lệ đạt checklist: ${checklistPassRate}.`,
  ].join(" ");

  return {
    score: dashboard.overall.intelligenceScore,
    verdictVi: dashboard.overall.verdictLabelVi,
    topStrength,
    topWeakness,
    trendDirection,
    actionItemCount: dashboard.actionItems.length,
    checklistPassRate,
    summaryParagraphVi,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function improvingCount(
  dimensions: TeacherIntelligenceDimensionDashboard[],
): number {
  return dimensions.filter((d) => d.trend === "improving").length;
}

function decliningCount(
  dimensions: TeacherIntelligenceDimensionDashboard[],
): number {
  return dimensions.filter((d) => d.trend === "declining").length;
}

// ─── Re-export catalog for consumers ──────────────────────────────────────────

export const TEACHER_INTELLIGENCE_DIMENSION_CATALOG: ReadonlyArray<{
  id: TeacherIntelligenceDimensionId;
  titleVi: string;
  titleEn: string;
  capability: string;
  descriptionVi: string;
}> = [
  {
    id: "diagnosis",
    titleVi: "Chẩn đoán",
    titleEn: "Diagnose",
    capability: "diagnose",
    descriptionVi:
      "Mercy có phát hiện đúng lỗi và gắn nhãn điểm yếu chính xác không?",
  },
  {
    id: "teaching",
    titleVi: "Giảng dạy",
    titleEn: "Teach",
    capability: "teach",
    descriptionVi:
      "Mercy có giải thích rõ ràng, sửa lỗi đúng lúc, giữ thể diện người học không?",
  },
  {
    id: "memory",
    titleVi: "Ghi nhớ",
    titleEn: "Remember",
    capability: "remember",
    descriptionVi:
      "Mercy có nhớ điểm yếu cũ của người học để áp dụng vào buổi sau không?",
  },
  {
    id: "adaptation",
    titleVi: "Thích ứng",
    titleEn: "Adapt",
    capability: "adapt",
    descriptionVi:
      "Mercy có điều chỉnh độ khó, tốc độ, ngôn ngữ theo tiến bộ của người học không?",
  },
  {
    id: "selfCheck",
    titleVi: "Tự kiểm",
    titleEn: "Self-check",
    capability: "self-check",
    descriptionVi:
      "Mercy có tự kiểm tra câu trả lời trước khi gửi cho người học không?",
  },
  {
    id: "learningGain",
    titleVi: "Chứng minh tiến bộ",
    titleEn: "Prove improvement",
    capability: "prove",
    descriptionVi:
      "Có bằng chứng cho thấy người học đã tiến bộ qua các buổi học không?",
  },
];
