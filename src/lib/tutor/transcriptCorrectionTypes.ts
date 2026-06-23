/**
 * Transcript Correction Event Types
 *
 * Formal event data structures for capturing the full lifecycle of transcript
 * corrections in speak mode — what the learner said, what was corrected, why,
 * which engine made the decision, when the correction was surfaced, and whether
 * the learner acknowledged it.
 *
 * This is the foundation for Teacher Mercy's ability to diagnose, teach,
 * remember, adapt, self-check, and prove learner improvement.
 *
 * All pure type definitions — no I/O, no side effects.
 */

import type { CorrectionMode } from "./teacherMercyCorrectionTiming";
import type { VietlishInterferenceCategory } from "./vietlishLogicEngine";

// ─── Correction Source ─────────────────────────────────────────────────────

/**
 * Which engine or detector produced a specific correction.
 *
 * - stt-garble: STT misheard a word (e.g. "Sunday" → "sunny")
 * - phonetic-readback: transcriptSanity corrected a phonetically-close token
 *   during read-back mode (e.g. "hat" → "head")
 * - phonetic-confusable: transcriptSanity flagged a token as phonetically
 *   confusable but couldn't correct it (free-answer mode)
 * - grammar-rule: correctionEngine applied a grammar rule
 * - vietlish-pattern: vietlishLogicEngine detected L1 interference
 * - semantic-implausibility: correctionEngine detected semantically
 *   implausible construction
 * - stt-unclear: transcript was too garbled to correct — flagged for retry
 */
export type TranscriptCorrectionSource =
  | "stt-garble"
  | "phonetic-readback"
  | "phonetic-confusable"
  | "grammar-rule"
  | "vietlish-pattern"
  | "semantic-implausibility"
  | "stt-unclear";

// ─── Individual Correction ──────────────────────────────────────────────────

/**
 * A single atomic correction applied to a transcript.
 * Multiple corrections can apply to one transcript (e.g. STT fix + grammar fix).
 */
export interface TranscriptCorrection {
  /** Which engine/detector produced this correction */
  source: TranscriptCorrectionSource;
  /** Character position in the original transcript where correction applies */
  position: number;
  /** The original token or phrase that was corrected */
  originalToken: string;
  /** The corrected token or phrase */
  correctedToken: string;
  /** Confidence of this correction (0.0–1.0) */
  confidence: number;
  /** Rule ID from the correction engine, if applicable */
  ruleId: string | null;
  /** Vietnamese explanation of what was corrected */
  explanationVi: string | null;
  /** English explanation of what was corrected */
  explanationEn: string | null;
}

// ─── Correction Event ───────────────────────────────────────────────────────

/**
 * A complete transcript correction event capturing one turn of speak practice.
 *
 * This is the atomic unit of proof — each event records:
 * 1. What the learner said (original transcript)
 * 2. What should have been said (corrected transcript)
 * 3. Individual corrections applied and by which engine
 * 4. When/how the teacher decided to surface the correction
 * 5. Whether the learner acknowledged it
 * 6. The pronunciation match quality
 */
export interface TranscriptCorrectionEvent {
  /** Unique event ID */
  id: string;
  /** Unix ms timestamp */
  timestamp: number;
  /** Session identifier */
  sessionId: string;
  /** Turn number within the session */
  turnNumber: number;
  /** Which tutor mode produced this event */
  mode: "speak" | "grammar" | "conversation";

  /** The raw transcript from speech-to-text */
  originalTranscript: string;
  /** The fully corrected transcript, or null if no correction was needed */
  correctedTranscript: string | null;
  /** The target/practice sentence, if in read-back mode */
  targetSentence: string | null;

  /** Individual corrections applied */
  corrections: TranscriptCorrection[];

  /** The timing decision for when to surface corrections */
  timingMode: CorrectionMode | null;
  /** Human-readable reason for the timing decision */
  timingReason: string | null;
  /** If delayed, how many turns to wait */
  delayTurns: number | null;

  /** Whether the correction was shown to the learner */
  wasSurfaced: boolean;
  /** Whether the learner acknowledged / accepted the correction */
  learnerAcknowledged: boolean | null;

  /** Pronunciation match score (0–100), if computed */
  matchScore: number | null;

  /** Weakness categories triggered by this event */
  weaknessTags: string[];
  /** Vietnamese labels for the triggered weaknesses */
  weaknessLabelsVi: string[];
  /** Vietlish interference category, if detected */
  interferenceCategory: VietlishInterferenceCategory | null;

  /** Topic tag from speak conversation state */
  topicTag: string | null;
}

// ─── Session ────────────────────────────────────────────────────────────────

/**
 * Aggregates all correction events within one learning session.
 */
export interface TranscriptCorrectionSession {
  /** Session identifier */
  sessionId: string;
  /** All correction events in this session, ordered by timestamp */
  events: TranscriptCorrectionEvent[];
  /** Session start time (unix ms) */
  startedAt: number;
  /** Last update time (unix ms) */
  updatedAt: number;
}

// ─── Improvement Tracking ───────────────────────────────────────────────────

/**
 * A single data point in the learner's improvement trail.
 */
export interface ImprovementPoint {
  /** Turn number */
  turn: number;
  /** Match score at this turn (0–100), if computed */
  matchScore: number | null;
  /** Number of corrections applied at this turn */
  correctionCount: number;
  /** Cumulative corrections so far in the session */
  cumulativeCorrections: number;
  /** Whether the learner acknowledged the correction at this turn */
  acknowledged: boolean | null;
}

/**
 * Trend direction for a tracked metric.
 */
export type ImprovementTrend =
  | "improving"
  | "stable"
  | "declining"
  | "insufficient_data";

// ─── Proof Artifact ─────────────────────────────────────────────────────────

/**
 * A proof artifact that demonstrates learner improvement (or lack thereof)
 * across a session of transcript correction events.
 *
 * This is the deliverable that proves Teacher Mercy can:
 * - Diagnose: via correctionSources breakdown
 * - Teach: via timingMode distribution
 * - Remember: via weaknessTags
 * - Adapt: via improvementTrail trend
 * - Self-check: via confidence scores across corrections
 * - Prove improvement: via learnerProgress
 */
export interface TranscriptCorrectionProof {
  /** The session this proof is derived from */
  session: TranscriptCorrectionSession;

  /** Total number of correction events */
  totalEvents: number;
  /** Total number of individual corrections across all events */
  totalCorrections: number;
  /** Number of events where at least one correction was applied */
  eventsWithCorrections: number;
  /** Number of events where the learner acknowledged corrections */
  eventsWithAcknowledgment: number;

  /** Breakdown of corrections by source engine */
  correctionsBySource: Partial<Record<TranscriptCorrectionSource, number>>;

  /** High-level correction category counts */
  correctionsByCategory: {
    /** STT-level fixes (garble, phonetic) */
    stt: number;
    /** Grammar-level fixes (grammar rules) */
    grammar: number;
    /** Semantic-level fixes (implausibility, Vietlish) */
    semantic: number;
    /** Unclear / needs retry */
    unclear: number;
  };

  /** Top weakness categories with Vietnamese labels */
  topWeaknesses: Array<{
    category: string;
    labelVi: string;
    count: number;
  }>;

  /** Improvement trail data points */
  improvementTrail: ImprovementPoint[];

  /** Aggregate learner progress assessment */
  learnerProgress: {
    /** Trend in match scores over the session */
    matchScoreTrend: ImprovementTrend;
    /** Trend in correction count over the session */
    correctionRateTrend: ImprovementTrend;
    /** Vietnamese summary of progress */
    summaryVi: string;
    /** English summary of progress */
    summaryEn: string;
  };
}

// ─── Correction Event Input (for creating events) ───────────────────────────

/**
 * Input for creating a transcript correction event.
 * Mirrors TranscriptCorrectionEvent but with optional/nullable fields
 * that are filled in by the collector.
 */
export interface TranscriptCorrectionEventInput {
  originalTranscript: string;
  correctedTranscript?: string | null;
  targetSentence?: string | null;
  mode?: "speak" | "grammar" | "conversation";
  corrections?: TranscriptCorrection[];
  timingMode?: CorrectionMode | null;
  timingReason?: string | null;
  delayTurns?: number | null;
  wasSurfaced?: boolean;
  learnerAcknowledged?: boolean | null;
  matchScore?: number | null;
  weaknessTags?: string[];
  weaknessLabelsVi?: string[];
  interferenceCategory?: VietlishInterferenceCategory | null;
  topicTag?: string | null;
  sessionId?: string | null;
  turnNumber?: number | null;
  timestamp?: number | null;
}

// ─── Catalog Metadata ──────────────────────────────────────────────────────

/**
 * Human-readable metadata for each correction source.
 * Vietnamese-first — all labels lead with Vietnamese.
 */
export const TRANSCRIPT_CORRECTION_SOURCE_CATALOG: Array<{
  source: TranscriptCorrectionSource;
  labelVi: string;
  labelEn: string;
  descriptionVi: string;
}> = [
  {
    source: "stt-garble",
    labelVi: "Nghe nhầm (STT)",
    labelEn: "STT mishear",
    descriptionVi:
      "Máy nghe nhầm một từ — Mercy sửa lại từ đúng dựa trên ngữ cảnh.",
  },
  {
    source: "phonetic-readback",
    labelVi: "Phát âm gần đúng (đọc lại)",
    labelEn: "Phonetic read-back correction",
    descriptionVi:
      "Bạn phát âm gần đúng nhưng chưa chính xác — Mercy sửa lại từ mục tiêu.",
  },
  {
    source: "phonetic-confusable",
    labelVi: "Phát âm dễ nhầm",
    labelEn: "Phonetically confusable",
    descriptionVi:
      "Từ bạn nói dễ bị nhầm với từ khác — Mercy cần bạn nói lại cho rõ.",
  },
  {
    source: "grammar-rule",
    labelVi: "Ngữ pháp",
    labelEn: "Grammar rule",
    descriptionVi:
      "Lỗi ngữ pháp được phát hiện và sửa bởi bộ luật ngữ pháp.",
  },
  {
    source: "vietlish-pattern",
    labelVi: "Ảnh hưởng tiếng Việt",
    labelEn: "Vietlish interference",
    descriptionVi:
      "Lỗi do thói quen từ tiếng Việt — Mercy giải thích gốc rễ tiếng mẹ đẻ.",
  },
  {
    source: "semantic-implausibility",
    labelVi: "Nghĩa không hợp lý",
    labelEn: "Semantic implausibility",
    descriptionVi:
      "Câu nói có nghĩa không hợp lý — Mercy đoán ý định của bạn.",
  },
  {
    source: "stt-unclear",
    labelVi: "Không nghe rõ",
    labelEn: "STT unclear",
    descriptionVi:
      "Máy không nghe rõ — Mercy yêu cầu bạn nói lại.",
  },
];

/**
 * All correction sources that are STT/phonetic-level (not grammar).
 */
export const STT_LEVEL_SOURCES: TranscriptCorrectionSource[] = [
  "stt-garble",
  "phonetic-readback",
  "phonetic-confusable",
  "stt-unclear",
];

/**
 * All correction sources that are grammar-level.
 */
export const GRAMMAR_LEVEL_SOURCES: TranscriptCorrectionSource[] = [
  "grammar-rule",
];

/**
 * All correction sources that are semantic-level.
 */
export const SEMANTIC_LEVEL_SOURCES: TranscriptCorrectionSource[] = [
  "vietlish-pattern",
  "semantic-implausibility",
];
