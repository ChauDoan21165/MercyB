/**
 * Transcript Correction Bridge
 *
 * Bridges the existing correction pipeline (correctionEngine, transcriptSanity,
 * correctionTimingIntegration, correctionExperienceEnricher) with the new
 * transcript correction event system.
 *
 * Pure functions only — no I/O, no side effects. Takes existing pipeline
 * outputs and produces TranscriptCorrectionEvents without modifying the
 * source modules.
 */

import type { CorrectionEngineResult } from "./correctionEngine";
import {
  correctWithTutorRules,
  findAndFixSttGarble,
  findSemanticImplausibility,
} from "./correctionEngine";
import type { CorrectionTimingResult, CorrectionMode } from "./teacherMercyCorrectionTiming";
import type { EnrichedCorrectionContext } from "./correctionExperienceEnricher";
import { enrichCorrectionExperience } from "./correctionExperienceEnricher";
import type { VietlishLogicDiagnosisResult, VietlishInterferenceCategory } from "./vietlishLogicEngine";
import { diagnoseVietlishLogicWithMatch } from "./vietlishLogicEngine";

import {
  type TranscriptCorrectionSource,
  type TranscriptCorrection,
  type TranscriptCorrectionEventInput,
  TRANSCRIPT_CORRECTION_SOURCE_CATALOG,
} from "./transcriptCorrectionTypes";

// ─── Bridge: Correction Engine → Correction Events ─────────────────────────

export interface BridgeInput {
  /** The raw transcript from speech-to-text */
  transcript: string;
  /** The target/practice sentence (for read-back mode), if any */
  targetSentence?: string | null;
  /** The mode that produced this transcript */
  mode?: "speak" | "grammar" | "conversation";
  /** Optional match score from pronunciation scoring */
  matchScore?: number | null;
  /** Whether the learner acknowledged corrections (null = not yet known) */
  learnerAcknowledged?: boolean | null;
  /** Session identifier */
  sessionId?: string | null;
  /** Turn number */
  turnNumber?: number | null;
  /** Topic tag from speak conversation */
  topicTag?: string | null;
}

export interface BridgeResult {
  /** The transcript correction event input, ready for the collector */
  eventInput: TranscriptCorrectionEventInput;
  /** The individual corrections derived from the pipeline */
  allCorrections: TranscriptCorrection[];
  /** The correction engine result (for caller's use) */
  correctionResult: CorrectionEngineResult;
  /** The Vietlish diagnosis result (for caller's use) */
  vietlishResult: VietlishLogicDiagnosisResult | null;
  /** The enriched correction context (for caller's use) */
  enrichment: EnrichedCorrectionContext | null;
  /** Whether any corrections were found */
  hasCorrections: boolean;
  /** Summary in Vietnamese */
  summaryVi: string;
  /** Summary in English */
  summaryEn: string;
}

/**
 * Run the full correction bridge: transcript → corrections → event input.
 *
 * This is the main entry point for the speak mode flow. It runs:
 * 1. STT garble detection on the raw transcript
 * 2. Semantic implausibility check
 * 3. Vietlish L1 interference diagnosis
 * 4. Aggregates all corrections into a single event input
 */
export function bridgeTranscriptToCorrectionEvents(
  input: BridgeInput,
): BridgeResult {
  const transcript = input.transcript.trim();
  const corrections: TranscriptCorrection[] = [];

  // Step 1: Detect and fix STT garble
  const garbleFix = findAndFixSttGarble(transcript);
  let workingTranscript = transcript;

  if (garbleFix && garbleFix.type === "fix") {
    corrections.push({
      source: "stt-garble",
      position: 0,
      originalToken: transcript,
      correctedToken: garbleFix.corrected,
      confidence: 0.85,
      ruleId: garbleFix.ruleId,
      explanationVi: sttGarbleExplanationVi(garbleFix.corrected),
      explanationEn: sttGarbleExplanationEn(garbleFix.corrected),
    });
    workingTranscript = garbleFix.corrected;
  } else if (garbleFix && garbleFix.type === "abstain") {
    corrections.push({
      source: "stt-unclear",
      position: 0,
      originalToken: transcript,
      correctedToken: transcript,
      confidence: 0.3,
      ruleId: null,
      explanationVi: "Mercy chưa chắc bạn định nói gì — bạn nói lại nhé.",
      explanationEn: "Unclear — please repeat.",
    });
  }

  // Step 2: Check semantic implausibility
  const semanticSignal = findSemanticImplausibility(workingTranscript);
  if (semanticSignal) {
    corrections.push({
      source: "semantic-implausibility",
      position: 0,
      originalToken: workingTranscript,
      correctedToken: workingTranscript, // engine can't auto-correct semantics
      confidence: 0.6,
      ruleId: semanticSignal.id,
      explanationVi: semanticSignal.clarificationHint,
      explanationEn: `Possibly meant: ${semanticSignal.positives.join(" or ")}`,
    });
  }

  // Step 3: Run Vietlish L1 interference diagnosis
  const vietlishResult = diagnoseVietlishLogicWithMatch(workingTranscript);
  if (vietlishResult.isKnownPattern) {
    corrections.push({
      source: "vietlish-pattern",
      position: 0,
      originalToken: workingTranscript,
      correctedToken: vietlishResult.correctedExample,
      confidence: 0.8,
      ruleId: vietlishResult.patternId,
      explanationVi: vietlishResult.vietnameseThinking,
      explanationEn: vietlishResult.englishLogic,
    });
  }

  // Step 4: Run the full correction engine
  const correctionResult = correctWithTutorRules(workingTranscript);

  if (correctionResult.status === "corrected") {
    // Add grammar corrections from each applied rule
    for (const ruleId of correctionResult.appliedRuleIds) {
      const sourceLabel = getSourceLabelForRuleId(ruleId);
      corrections.push({
        source: "grammar-rule",
        position: 0,
        originalToken: workingTranscript,
        correctedToken: correctionResult.corrected,
        confidence: 0.9,
        ruleId,
        explanationVi: grammarRuleExplanationVi(ruleId),
        explanationEn: grammarRuleExplanationEn(ruleId),
      });
    }
  }

  // Step 5: Enrich with weakness context
  const allRuleIds = correctionResult.appliedRuleIds;
  const enrichment =
    allRuleIds.length > 0
      ? enrichCorrectionExperience(allRuleIds, workingTranscript, "vi")
      : null;

  // Step 6: Build event input
  const correctedTranscript =
    correctionResult.status === "corrected"
      ? correctionResult.corrected
      : corrections.some((c) => c.source === "stt-garble")
        ? (corrections.find((c) => c.source === "stt-garble")!).correctedToken
        : null;

  const weaknessTags = enrichment?.weaknessInput
    ? [enrichment.weaknessInput.errorCategory]
    : [];
  const weaknessLabelsVi = enrichment?.weaknessLabelVi
    ? [enrichment.weaknessLabelVi]
    : [];

  const eventInput: TranscriptCorrectionEventInput = {
    originalTranscript: transcript,
    correctedTranscript:
      correctedTranscript !== transcript ? correctedTranscript : null,
    targetSentence: input.targetSentence ?? null,
    mode: input.mode ?? "speak",
    corrections,
    timingMode: null, // caller sets this after timing decision
    timingReason: null,
    wasSurfaced: true,
    learnerAcknowledged: input.learnerAcknowledged ?? null,
    matchScore: input.matchScore ?? null,
    weaknessTags,
    weaknessLabelsVi,
    interferenceCategory: enrichment?.interferenceCategory ?? null,
    topicTag: input.topicTag ?? null,
    sessionId: input.sessionId ?? null,
    turnNumber: input.turnNumber ?? null,
  };

  const hasCorrections = corrections.length > 0;

  return {
    eventInput,
    allCorrections: corrections,
    correctionResult,
    vietlishResult: vietlishResult.isKnownPattern ? vietlishResult : null,
    enrichment,
    hasCorrections,
    summaryVi: buildBridgeSummaryVi(corrections, hasCorrections),
    summaryEn: buildBridgeSummaryEn(corrections, hasCorrections),
  };
}

/**
 * Enrich an existing event input with a timing decision.
 *
 * Call this after the timing engine has decided when/how to surface corrections.
 */
export function applyTimingToEvent(
  eventInput: TranscriptCorrectionEventInput,
  timing: CorrectionTimingResult,
): TranscriptCorrectionEventInput {
  return {
    ...eventInput,
    timingMode: timing.mode,
    timingReason: timing.reason,
    delayTurns: timing.delayTurns ?? null,
    wasSurfaced: timing.mode !== "SUPPRESS",
  };
}

/**
 * Mark a correction event as acknowledged by the learner.
 */
export function markEventAcknowledged(
  eventInput: TranscriptCorrectionEventInput,
): TranscriptCorrectionEventInput {
  return {
    ...eventInput,
    learnerAcknowledged: true,
  };
}

// ─── Source Label Mapping ──────────────────────────────────────────────────

function getSourceLabelForRuleId(ruleId: string): TranscriptCorrectionSource {
  if (ruleId.startsWith("en-stt-")) return "stt-garble";
  if (ruleId.startsWith("en-semantic-")) return "semantic-implausibility";
  return "grammar-rule";
}

// ─── Explanation Builders ──────────────────────────────────────────────────

function sttGarbleExplanationVi(corrected: string): string {
  return `Máy nghe nhầm — Mercy nghĩ bạn định nói "${corrected}".`;
}

function sttGarbleExplanationEn(corrected: string): string {
  return `STT misheard — Mercy thinks you meant "${corrected}".`;
}

function grammarRuleExplanationVi(ruleId: string): string {
  const map: Record<string, string> = {
    "en-article-a-an": "Thiếu mạo từ a/an trước danh từ.",
    "en-article-the": "Thiếu hoặc thừa mạo từ the.",
    "en-past-tense": "Động từ cần chia thì quá khứ.",
    "en-third-person-s": "Động từ cần thêm -s/-es cho ngôi thứ ba số ít.",
    "en-subject-verb-agreement": "Chủ ngữ và động từ chưa hợp nhất.",
    "en-be-copula": "Thiếu động từ to be.",
    "en-preposition": "Giới từ chưa chính xác.",
    "en-word-order": "Trật tự từ chưa đúng.",
    "en-plural": "Danh từ cần ở dạng số nhiều.",
    "en-possessive": "Thiếu sở hữu cách.",
    "en-double-negation": "Phủ định kép không chuẩn trong tiếng Anh.",
    "en-capitalization": "Cần viết hoa đầu câu.",
    "en-punctuation": "Thiếu dấu câu cuối câu.",
    "en-question-form": "Cấu trúc câu hỏi chưa đúng.",
    "en-runon": "Câu quá dài — nên tách thành nhiều câu ngắn.",
    "en-collocation": "Cụm từ chưa tự nhiên trong tiếng Anh.",
    "en-word-choice": "Từ chọn chưa phù hợp với ngữ cảnh.",
  };
  return map[ruleId] ?? `Lỗi ngữ pháp (${ruleId}).`;
}

function grammarRuleExplanationEn(ruleId: string): string {
  const map: Record<string, string> = {
    "en-article-a-an": "Missing article a/an before noun.",
    "en-article-the": "Missing or extra article the.",
    "en-past-tense": "Verb needs past tense form.",
    "en-third-person-s": "Verb needs -s/-es for third person singular.",
    "en-subject-verb-agreement": "Subject-verb agreement issue.",
    "en-be-copula": "Missing to be verb.",
    "en-preposition": "Incorrect preposition.",
    "en-word-order": "Incorrect word order.",
    "en-plural": "Noun should be plural.",
    "en-possessive": "Missing possessive form.",
    "en-double-negation": "Double negation is non-standard in English.",
    "en-capitalization": "Sentence should start with capital letter.",
    "en-punctuation": "Missing terminal punctuation.",
    "en-question-form": "Incorrect question structure.",
    "en-runon": "Run-on sentence — split into shorter sentences.",
    "en-collocation": "Phrase is not natural in English.",
    "en-word-choice": "Word choice not suitable for context.",
  };
  return map[ruleId] ?? `Grammar error (${ruleId}).`;
}

// ─── Summary Builders ───────────────────────────────────────────────────────

function buildBridgeSummaryVi(
  corrections: TranscriptCorrection[],
  hasCorrections: boolean,
): string {
  if (!hasCorrections) return "Không phát hiện lỗi nào.";

  const sources = new Set(corrections.map((c) => c.source));
  const parts: string[] = [];

  for (const source of sources) {
    const meta = TRANSCRIPT_CORRECTION_SOURCE_CATALOG.find(
      (m) => m.source === source,
    );
    const count = corrections.filter((c) => c.source === source).length;
    const label = meta?.labelVi ?? source;
    parts.push(`${count} ${label}`);
  }

  return `Phát hiện: ${parts.join(", ")}.`;
}

function buildBridgeSummaryEn(
  corrections: TranscriptCorrection[],
  hasCorrections: boolean,
): string {
  if (!hasCorrections) return "No corrections detected.";

  const sources = new Set(corrections.map((c) => c.source));
  const parts: string[] = [];

  for (const source of sources) {
    const meta = TRANSCRIPT_CORRECTION_SOURCE_CATALOG.find(
      (m) => m.source === source,
    );
    const count = corrections.filter((c) => c.source === source).length;
    const label = meta?.labelEn ?? source;
    parts.push(`${count} ${label}`);
  }

  return `Detected: ${parts.join(", ")}.`;
}
