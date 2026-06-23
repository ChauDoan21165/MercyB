/**
 * Transcript Correction Event Collector
 *
 * Pure functions to create, collect, and analyze transcript correction events.
 * No I/O, no side effects, fully deterministic.
 *
 * This module provides the proof infrastructure — given a session of events,
 * it can prove whether Teacher Mercy correctly diagnosed, taught, remembered,
 * adapted, self-checked, and helped the learner improve.
 */

import type { CorrectionMode } from "./teacherMercyCorrectionTiming";
import type { VietlishInterferenceCategory } from "./vietlishLogicEngine";
import {
  type TranscriptCorrection,
  type TranscriptCorrectionEvent,
  type TranscriptCorrectionEventInput,
  type TranscriptCorrectionProof,
  type TranscriptCorrectionSession,
  type TranscriptCorrectionSource,
  type ImprovementPoint,
  type ImprovementTrend,
  STT_LEVEL_SOURCES,
  GRAMMAR_LEVEL_SOURCES,
  SEMANTIC_LEVEL_SOURCES,
  TRANSCRIPT_CORRECTION_SOURCE_CATALOG,
} from "./transcriptCorrectionTypes";

// ─── Session ────────────────────────────────────────────────────────────────

/**
 * Create a new empty correction session.
 */
export function createCorrectionSession(
  sessionId?: string,
  now?: number,
): TranscriptCorrectionSession {
  const ts = normalizeTimestamp(now);
  return {
    sessionId: sessionId || createSessionId(ts),
    events: [],
    startedAt: ts,
    updatedAt: ts,
  };
}

/**
 * Record a correction event into a session (immutable — returns new session).
 */
export function recordCorrectionEvent(
  session: TranscriptCorrectionSession,
  input: TranscriptCorrectionEventInput,
  now?: number,
): { session: TranscriptCorrectionSession; event: TranscriptCorrectionEvent } {
  const ts = normalizeTimestamp(now);
  const event = createCorrectionEvent(input, session, ts);
  return {
    session: {
      ...session,
      events: [...session.events, event],
      updatedAt: ts,
    },
    event,
  };
}

// ─── Event Creation ─────────────────────────────────────────────────────────

/**
 * Create a single transcript correction event from input.
 */
export function createCorrectionEvent(
  input: TranscriptCorrectionEventInput,
  session?: TranscriptCorrectionSession,
  now?: number,
): TranscriptCorrectionEvent {
  const ts = normalizeTimestamp(now);
  const sid = input.sessionId || session?.sessionId || createSessionId(ts);
  const turn = input.turnNumber ?? ((session?.events.length ?? 0) + 1);

  return {
    id: createEventId(sid, turn, ts),
    timestamp: ts,
    sessionId: sid,
    turnNumber: turn,
    mode: input.mode ?? "speak",
    originalTranscript: input.originalTranscript,
    correctedTranscript: input.correctedTranscript ?? null,
    targetSentence: input.targetSentence ?? null,
    corrections: input.corrections ?? [],
    timingMode: input.timingMode ?? null,
    timingReason: input.timingReason ?? null,
    delayTurns: input.delayTurns ?? null,
    wasSurfaced: input.wasSurfaced ?? true,
    learnerAcknowledged: input.learnerAcknowledged ?? null,
    matchScore: typeof input.matchScore === "number" ? clampScore(input.matchScore) : null,
    weaknessTags: input.weaknessTags ?? [],
    weaknessLabelsVi: input.weaknessLabelsVi ?? [],
    interferenceCategory: input.interferenceCategory ?? null,
    topicTag: input.topicTag ?? null,
  };
}

// ─── Correction Helpers ─────────────────────────────────────────────────────

/**
 * Create a single atomic correction entry.
 */
export function createCorrection(params: {
  source: TranscriptCorrectionSource;
  position: number;
  originalToken: string;
  correctedToken: string;
  confidence: number;
  ruleId?: string | null;
  explanationVi?: string | null;
  explanationEn?: string | null;
}): TranscriptCorrection {
  return {
    source: params.source,
    position: clampNonNegative(params.position),
    originalToken: params.originalToken,
    correctedToken: params.correctedToken,
    confidence: clampConfidence(params.confidence),
    ruleId: params.ruleId ?? null,
    explanationVi: params.explanationVi ?? null,
    explanationEn: params.explanationEn ?? null,
  };
}

// ─── Session Analysis ───────────────────────────────────────────────────────

/**
 * Build a complete proof artifact from a correction session.
 *
 * This is the main deliverable — it proves what Teacher Mercy did and
 * whether the learner improved.
 */
export function buildCorrectionProof(
  session: TranscriptCorrectionSession,
): TranscriptCorrectionProof {
  const events = session.events;
  const totalEvents = events.length;
  const totalCorrections = sumCorrections(events);
  const eventsWithCorrections = events.filter(
    (e) => e.corrections.length > 0,
  ).length;
  const eventsWithAcknowledgment = events.filter(
    (e) => e.learnerAcknowledged === true,
  ).length;
  const correctionsBySource = countCorrectionsBySource(events);
  const correctionsByCategory = categorizeCorrections(correctionsBySource);
  const topWeaknesses = computeTopWeaknesses(events);
  const improvementTrail = computeImprovementTrail(events);
  const learnerProgress = assessLearnerProgress(improvementTrail, totalCorrections);

  return {
    session,
    totalEvents,
    totalCorrections,
    eventsWithCorrections,
    eventsWithAcknowledgment,
    correctionsBySource,
    correctionsByCategory,
    topWeaknesses,
    improvementTrail,
    learnerProgress,
  };
}

/**
 * Get basic statistics from a session.
 */
export function getCorrectionStats(session: TranscriptCorrectionSession): {
  totalEvents: number;
  totalCorrections: number;
  eventsWithCorrections: number;
  correctionRate: number;
  acknowledgmentRate: number;
  averageConfidence: number;
  averageMatchScore: number | null;
} {
  const events = session.events;
  const totalEvents = events.length;
  const totalCorrections = sumCorrections(events);
  const eventsWithCorrections = events.filter(
    (e) => e.corrections.length > 0,
  ).length;
  const acknowledged = events.filter(
    (e) => e.learnerAcknowledged === true,
  ).length;
  const allCorrections = events.flatMap((e) => e.corrections);
  const avgConfidence =
    allCorrections.length > 0
      ? allCorrections.reduce((s, c) => s + c.confidence, 0) /
        allCorrections.length
      : 0;
  const scores = events
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  const avgScore = scores.length > 0
    ? scores.reduce((s, v) => s + v, 0) / scores.length
    : null;

  return {
    totalEvents,
    totalCorrections,
    eventsWithCorrections,
    correctionRate:
      totalEvents > 0 ? eventsWithCorrections / totalEvents : 0,
    acknowledgmentRate:
      eventsWithCorrections > 0 ? acknowledged / eventsWithCorrections : 0,
    averageConfidence: round2(avgConfidence),
    averageMatchScore: avgScore !== null ? round2(avgScore) : null,
  };
}

/**
 * Get the improvement trail from a session.
 */
export function getImprovementTrail(
  session: TranscriptCorrectionSession,
): ImprovementPoint[] {
  return computeImprovementTrail(session.events);
}

/**
 * Check whether a session proves improvement across multiple dimensions.
 *
 * Returns true if at least 2 of the 6 dimensions (diagnose, teach, remember,
 * adapt, self-check, prove) show evidence of working.
 */
export function provesImprovement(proof: TranscriptCorrectionProof): {
  passed: boolean;
  dimensions: Record<string, boolean>;
  summaryVi: string;
  summaryEn: string;
} {
  const dims = {
    diagnose: proof.totalEvents > 0 && proof.totalCorrections > 0,
    teach: proof.eventsWithAcknowledgment > 0,
    remember: proof.topWeaknesses.length > 0,
    adapt:
      proof.learnerProgress.matchScoreTrend === "improving" ||
      proof.learnerProgress.correctionRateTrend === "improving",
    selfCheck: hasHighConfidenceCorrections(proof.session.events),
    prove: proof.improvementTrail.length >= 3,
  };

  const passedCount = Object.values(dims).filter(Boolean).length;
  const passed = passedCount >= 2;

  const dimsVi = Object.entries(dims)
    .filter(([, v]) => v)
    .map(([k]) => dimensionLabelVi(k))
    .join(", ");

  return {
    passed,
    dimensions: dims,
    summaryVi: passed
      ? `Mercy đã chứng minh được ${passedCount}/6 khả năng: ${dimsVi}.`
      : `Mercy mới chứng minh được ${passedCount}/6 khả năng: ${dimsVi}. Cần thêm dữ liệu.`,
    summaryEn: passed
      ? `Mercy proved ${passedCount}/6 capabilities: ${dimsVi}.`
      : `Mercy proved only ${passedCount}/6 capabilities: ${dimsVi}. More data needed.`,
  };
}

// ─── Timing Decision Analysis ───────────────────────────────────────────────

/**
 * Analyze the distribution of timing decisions across a session.
 */
export function analyzeTimingDecisions(
  session: TranscriptCorrectionSession,
): Array<{ mode: CorrectionMode; count: number; labelVi: string }> {
  const counts = new Map<CorrectionMode, number>();
  for (const event of session.events) {
    if (event.timingMode) {
      counts.set(event.timingMode, (counts.get(event.timingMode) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([mode, count]) => ({
      mode,
      count,
      labelVi: timingModeLabelVi(mode),
    }))
    .sort((a, b) => b.count - a.count);
}

// ─── Internal Helpers ───────────────────────────────────────────────────────

function createSessionId(ts: number): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `tx-${ts.toString(36)}-${random}`;
}

function createEventId(sessionId: string, turn: number, ts: number): string {
  return `${sessionId}-t${turn}-${ts.toString(36)}`;
}

function sumCorrections(events: TranscriptCorrectionEvent[]): number {
  return events.reduce((sum, e) => sum + e.corrections.length, 0);
}

function countCorrectionsBySource(
  events: TranscriptCorrectionEvent[],
): Partial<Record<TranscriptCorrectionSource, number>> {
  const counts: Partial<Record<TranscriptCorrectionSource, number>> = {};
  for (const event of events) {
    for (const c of event.corrections) {
      counts[c.source] = (counts[c.source] ?? 0) + 1;
    }
  }
  return counts;
}

function categorizeCorrections(
  bySource: Partial<Record<TranscriptCorrectionSource, number>>,
): { stt: number; grammar: number; semantic: number; unclear: number } {
  let stt = 0;
  let grammar = 0;
  let semantic = 0;
  let unclear = 0;

  for (const [source, count] of Object.entries(bySource)) {
    const n = count ?? 0;
    if ((STT_LEVEL_SOURCES as string[]).includes(source)) {
      if (source === "stt-unclear") {
        unclear += n;
      } else {
        stt += n;
      }
    } else if ((GRAMMAR_LEVEL_SOURCES as string[]).includes(source)) {
      grammar += n;
    } else if ((SEMANTIC_LEVEL_SOURCES as string[]).includes(source)) {
      semantic += n;
    }
  }

  return { stt, grammar, semantic, unclear };
}

function computeTopWeaknesses(
  events: TranscriptCorrectionEvent[],
): Array<{ category: string; labelVi: string; count: number }> {
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();

  for (const event of events) {
    for (let i = 0; i < event.weaknessTags.length; i++) {
      const tag = event.weaknessTags[i];
      const label = event.weaknessLabelsVi[i] ?? tag;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
      labels.set(tag, label);
    }
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      labelVi: labels.get(category) ?? category,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function computeImprovementTrail(
  events: TranscriptCorrectionEvent[],
): ImprovementPoint[] {
  let cumulative = 0;
  return events.map((event) => {
    cumulative += event.corrections.length;
    return {
      turn: event.turnNumber,
      matchScore: event.matchScore,
      correctionCount: event.corrections.length,
      cumulativeCorrections: cumulative,
      acknowledged: event.learnerAcknowledged,
    };
  });
}

function assessLearnerProgress(
  trail: ImprovementPoint[],
  totalCorrections: number,
): TranscriptCorrectionProof["learnerProgress"] {
  const matchScoreTrend = computeTrend(
    trail.map((p) => p.matchScore).filter((s): s is number => s !== null),
    "higher_better",
  );
  const correctionRateTrend = computeTrend(
    trail.map((p) => p.correctionCount),
    "lower_better",
  );

  const summaryVi = buildProgressSummaryVi(
    matchScoreTrend,
    correctionRateTrend,
    trail.length,
    totalCorrections,
  );
  const summaryEn = buildProgressSummaryEn(
    matchScoreTrend,
    correctionRateTrend,
    trail.length,
    totalCorrections,
  );

  return {
    matchScoreTrend,
    correctionRateTrend,
    summaryVi,
    summaryEn,
  };
}

function computeTrend(
  values: number[],
  direction: "higher_better" | "lower_better",
): ImprovementTrend {
  if (values.length < 2) return "insufficient_data";

  // Split into first half and second half, compare medians
  const mid = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, mid);
  const secondHalf = values.slice(mid);

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const threshold = direction === "higher_better" ? 1.0 : 0.05;
  const delta = secondAvg - firstAvg;

  if (direction === "higher_better") {
    if (delta > threshold) return "improving";
    if (delta < -threshold) return "declining";
  } else {
    if (delta < -threshold) return "improving";
    if (delta > threshold) return "declining";
  }

  return "stable";
}

function buildProgressSummaryVi(
  matchTrend: ImprovementTrend,
  corrTrend: ImprovementTrend,
  totalTurns: number,
  totalCorrections: number,
): string {
  if (totalTurns < 2) return "Chưa đủ dữ liệu để đánh giá tiến bộ.";

  const parts: string[] = [];

  if (matchTrend === "improving") {
    parts.push("Điểm phát âm đang tăng dần");
  } else if (matchTrend === "declining") {
    parts.push("Điểm phát âm đang giảm");
  } else if (matchTrend === "stable") {
    parts.push("Điểm phát âm ổn định");
  }

  if (corrTrend === "improving") {
    parts.push("số lỗi cần sửa đang giảm");
  } else if (corrTrend === "declining") {
    parts.push("số lỗi cần sửa đang tăng");
  } else if (corrTrend === "stable") {
    parts.push("số lỗi cần sửa ổn định");
  }

  if (parts.length === 0) {
    return `Qua ${totalTurns} lượt, chưa thấy xu hướng rõ ràng.`;
  }

  return `${parts.join(", ")} qua ${totalTurns} lượt luyện tập (tổng ${totalCorrections} lỗi được sửa).`;
}

function buildProgressSummaryEn(
  matchTrend: ImprovementTrend,
  corrTrend: ImprovementTrend,
  totalTurns: number,
  totalCorrections: number,
): string {
  if (totalTurns < 2) return "Not enough data to assess progress.";

  const parts: string[] = [];

  if (matchTrend === "improving") parts.push("Pronunciation scores improving");
  else if (matchTrend === "declining") parts.push("Pronunciation scores declining");
  else if (matchTrend === "stable") parts.push("Pronunciation scores stable");

  if (corrTrend === "improving") parts.push("corrections needed decreasing");
  else if (corrTrend === "declining") parts.push("corrections needed increasing");
  else if (corrTrend === "stable") parts.push("corrections needed stable");

  return `${parts.join(", ")} over ${totalTurns} practice turns (${totalCorrections} total corrections).`;
}

function hasHighConfidenceCorrections(
  events: TranscriptCorrectionEvent[],
): boolean {
  for (const event of events) {
    for (const c of event.corrections) {
      if (c.confidence >= 0.7) return true;
    }
  }
  return false;
}

function timingModeLabelVi(mode: CorrectionMode): string {
  const labels: Record<CorrectionMode, string> = {
    IMMEDIATE: "Sửa ngay",
    DELAYED: "Sửa sau",
    SUPPRESS: "Tạm bỏ qua",
    FOLLOW_UP_FIRST: "Hỏi lại trước",
    EXPLAIN_PATTERN: "Giải thích quy luật",
  };
  return labels[mode] ?? mode;
}

function dimensionLabelVi(key: string): string {
  const labels: Record<string, string> = {
    diagnose: "chẩn đoán",
    teach: "dạy",
    remember: "ghi nhớ",
    adapt: "thích nghi",
    selfCheck: "tự kiểm",
    prove: "chứng minh",
  };
  return labels[key] ?? key;
}

// ─── Math Helpers ───────────────────────────────────────────────────────────

function normalizeTimestamp(value?: number): number {
  return Number.isFinite(value) && Number(value) >= 0
    ? Math.floor(Number(value))
    : Date.now();
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampConfidence(value: number): number {
  return Math.min(1.0, Math.max(0.0, value));
}

function clampNonNegative(value: number): number {
  return Math.max(0, Math.floor(value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
