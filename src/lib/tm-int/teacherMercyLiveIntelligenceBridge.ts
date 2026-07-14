/**
 * Teacher Mercy Live Intelligence Bridge
 *
 * Runtime adapter between a live learner turn and Teacher Mercy's existing
 * decision/dashboard/handoff surfaces. It does not make provider calls and it
 * does not replace the decision engine. Its job is to normalize the live turn,
 * preserve the teaching decision and evidence signals, and emit a deterministic
 * packet that the UI or handoff/audit layers can trust.
 */

import {
  isCorrectionDeferred,
  isCorrectionVisible,
  type TeacherDecision,
} from "../tutor/teacherDecisionEngine";
import type {
  TeacherIntelligenceDashboard,
  TeacherIntelligenceDimensionId,
} from "../tutor/teacherIntelligenceDashboard";

export type BridgeProvider = "local" | "openai" | "deepseek" | "gemini" | "fallback";
export type BridgeTurnLanguage = "en" | "vi" | "mixed" | "unknown";
export type BridgeRisk = "empty_input" | "mixed_language" | "repeated_answer" | "stale_memory" | "provider_fallback" | "low_readiness" | "fake_confidence";
export type BridgeNextStep =
  | "show_correction"
  | "queue_correction"
  | "ask_follow_up"
  | "show_minimal_hint"
  | "explain_pattern"
  | "recover_gently"
  | "continue_practice";

export interface TeacherMercyLiveLearnerTurn {
  turnId: string;
  sessionId: string;
  learnerText: string;
  targetLanguage: string;
  timestampIso?: string;
  topicTag?: string | null;
}

export interface TeacherMercyLiveMemoryState {
  lastLearnerText?: string | null;
  lastTopicTag?: string | null;
  lastWeaknessTags?: string[];
  lastUpdatedTurnIndex?: number | null;
  currentTurnIndex?: number | null;
}

export interface TeacherMercyLiveProviderState {
  provider: BridgeProvider;
  usedFallback?: boolean;
  retryCount?: number;
  failureReason?: string | null;
}

export interface TeacherMercyLiveBridgeInput {
  turn: TeacherMercyLiveLearnerTurn;
  decision: TeacherDecision;
  dashboard?: TeacherIntelligenceDashboard | null;
  memory?: TeacherMercyLiveMemoryState | null;
  provider?: TeacherMercyLiveProviderState | null;
  nowIso?: string;
}

export interface TeacherMercyLiveBridgePacket {
  packetVersion: "teacher-mercy-live-bridge.v1";
  turn: {
    turnId: string;
    sessionId: string;
    timestampIso: string;
    normalizedText: string;
    language: BridgeTurnLanguage;
    isEmpty: boolean;
    isRepeatedAnswer: boolean;
    topicTag: string | null;
    carriedTopicTag: string | null;
  };
  teaching: {
    action: TeacherDecision["action"];
    timingMode: TeacherDecision["timingMode"];
    reasonCode: string;
    nextStep: BridgeNextStep;
    correctionVisible: boolean;
    feedbackEligible: boolean;
    minimalHint: string | null;
    learnerMessageVi: string;
    internalRationaleEn: string;
  };
  evidence: {
    ruleIds: string[];
    weaknessTags: string[];
    dashboardScore: number | null;
    dashboardVerdict: string | null;
    dimensionsNeedingAttention: TeacherIntelligenceDimensionId[];
    readinessStatus: string;
    provider: BridgeProvider;
    usedProviderFallback: boolean;
    retryCount: number;
    risks: BridgeRisk[];
    confidenceLabel: "evidence_backed" | "limited_evidence" | "blocked";
  };
  audit: {
    deterministicKey: string;
    safeToSerialize: true;
    noPlaceholderOutput: boolean;
    noFakeConfidence: boolean;
    uiCopySource: "teacherMercyLiveIntelligenceBridge";
  };
}

const PLACEHOLDER_RE = /\b(?:todo|placeholder|lorem ipsum|fixme|stub)\b/i;
const VIETNAMESE_MARK_RE = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
const ENGLISH_WORD_RE = /[a-z]{2,}/i;

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function detectLanguage(text: string): BridgeTurnLanguage {
  if (!text) return "unknown";
  const hasVietnamese = VIETNAMESE_MARK_RE.test(text);
  const hasEnglish = ENGLISH_WORD_RE.test(text);
  if (hasVietnamese && hasEnglish) return "mixed";
  if (hasVietnamese) return "vi";
  if (hasEnglish) return "en";
  return "unknown";
}

function uniqueSorted(values: readonly string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))].sort();
}

function isRepeatedAnswer(current: string, previous: string | null | undefined): boolean {
  return Boolean(previous && normalizeText(previous).toLowerCase() === current.toLowerCase());
}

function isMemoryStale(memory: TeacherMercyLiveMemoryState | null | undefined): boolean {
  if (!memory) return false;
  const current = memory.currentTurnIndex;
  const updated = memory.lastUpdatedTurnIndex;
  return typeof current === "number" && typeof updated === "number" && current - updated >= 5;
}

function dimensionsNeedingAttention(dashboard: TeacherIntelligenceDashboard | null | undefined): TeacherIntelligenceDimensionId[] {
  return dashboard?.dimensions
    .filter((dimension) => dimension.needsAttention)
    .map((dimension) => dimension.dimensionId) ?? [];
}

function correctionRuleIds(decision: TeacherDecision): string[] {
  return uniqueSorted([
    ...(decision.correction?.appliedRuleIds ?? []),
    ...decision.allCandidates.flatMap((candidate) => candidate.appliedRuleIds),
  ]);
}

function weaknessTags(decision: TeacherDecision, memory: TeacherMercyLiveMemoryState | null | undefined): string[] {
  return uniqueSorted([
    decision.enrichment?.weaknessInput?.errorCategory ?? "",
    decision.enrichment?.matchedRuleId ?? "",
    ...(memory?.lastWeaknessTags ?? []),
  ]);
}

function nextStepForDecision(decision: TeacherDecision, risks: BridgeRisk[]): BridgeNextStep {
  if (risks.includes("empty_input")) return "recover_gently";
  if (decision.hintLadder?.decision === "HINT_MINIMAL") return "show_minimal_hint";
  switch (decision.action) {
    case "CORRECT_NOW":
      return "show_correction";
    case "DEFER":
      return "queue_correction";
    case "FOLLOW_UP_FIRST":
      return "ask_follow_up";
    case "EXPLAIN_PATTERN":
      return "explain_pattern";
    case "SUPPRESS":
      return "continue_practice";
  }
}

function minimalHint(decision: TeacherDecision): string | null {
  if (decision.hintLadder?.decision !== "HINT_MINIMAL") return null;
  const rule = decision.correction?.appliedRuleIds[0] ?? "pattern";
  return `Look again at ${rule}.`;
}

function learnerMessageVi(decision: TeacherDecision, nextStep: BridgeNextStep, risks: BridgeRisk[]): string {
  if (risks.includes("empty_input")) return "Mercy chưa thấy câu trả lời. Bạn thử nhập lại một câu ngắn nhé.";
  if (nextStep === "show_minimal_hint") return "Mercy sẽ gợi ý nhẹ trước, để bạn tự sửa thêm một bước.";
  if (nextStep === "ask_follow_up") return "Mercy sẽ hỏi thêm một câu trước khi sửa trực tiếp.";
  if (nextStep === "queue_correction") return "Mercy đã ghi nhận lỗi này và sẽ quay lại đúng lúc hơn.";
  if (nextStep === "explain_pattern") return "Mercy sẽ giải thích quy luật vì lỗi này đang lặp lại.";
  if (nextStep === "show_correction") return decision.rationaleVi || "Mercy sẽ sửa điểm quan trọng nhất ngay bây giờ.";
  return "Mercy tiếp tục bài học và không ngắt nhịp lúc này.";
}

function collectRisks(params: {
  isEmpty: boolean;
  language: BridgeTurnLanguage;
  repeated: boolean;
  staleMemory: boolean;
  provider: TeacherMercyLiveProviderState | null | undefined;
  decision: TeacherDecision;
  dashboard: TeacherIntelligenceDashboard | null | undefined;
}): BridgeRisk[] {
  const risks: BridgeRisk[] = [];
  if (params.isEmpty) risks.push("empty_input");
  if (params.language === "mixed") risks.push("mixed_language");
  if (params.repeated) risks.push("repeated_answer");
  if (params.staleMemory) risks.push("stale_memory");
  if (params.provider?.usedFallback || params.provider?.provider === "fallback") risks.push("provider_fallback");
  if (params.decision.readiness.decision !== "READY_NOW") risks.push("low_readiness");
  if ((params.dashboard?.overall.intelligenceScore ?? 100) < 60 && params.decision.action === "CORRECT_NOW") {
    risks.push("fake_confidence");
  }
  return risks;
}

function confidenceLabel(risks: readonly BridgeRisk[], ruleIds: readonly string[], dashboard: TeacherIntelligenceDashboard | null | undefined): "evidence_backed" | "limited_evidence" | "blocked" {
  if (risks.includes("empty_input") || risks.includes("fake_confidence")) return "blocked";
  if (ruleIds.length === 0 || !dashboard?.meta.hasEnoughData) return "limited_evidence";
  return "evidence_backed";
}

function deterministicKey(parts: {
  sessionId: string;
  turnId: string;
  normalizedText: string;
  action: string;
  reasonCode: string;
  nextStep: string;
}): string {
  return [
    parts.sessionId,
    parts.turnId,
    parts.normalizedText.toLowerCase(),
    parts.action,
    parts.reasonCode,
    parts.nextStep,
  ].join("|");
}

export function buildTeacherMercyLiveIntelligenceBridgePacket(
  input: TeacherMercyLiveBridgeInput,
): TeacherMercyLiveBridgePacket {
  const normalizedText = normalizeText(input.turn.learnerText);
  const language = detectLanguage(normalizedText);
  const repeated = isRepeatedAnswer(normalizedText, input.memory?.lastLearnerText);
  const staleMemory = isMemoryStale(input.memory);
  const provider = input.provider?.provider ?? "local";
  const ruleIds = correctionRuleIds(input.decision);
  const tags = weaknessTags(input.decision, input.memory);
  const risks = collectRisks({
    isEmpty: normalizedText.length === 0,
    language,
    repeated,
    staleMemory,
    provider: input.provider,
    decision: input.decision,
    dashboard: input.dashboard,
  });
  const nextStep = nextStepForDecision(input.decision, risks);
  const correctionVisible = isCorrectionVisible(input.decision);
  const feedbackEligible = correctionVisible && !isCorrectionDeferred(input.decision) && ruleIds.length > 0;
  const messageVi = learnerMessageVi(input.decision, nextStep, risks);

  return {
    packetVersion: "teacher-mercy-live-bridge.v1",
    turn: {
      turnId: input.turn.turnId,
      sessionId: input.turn.sessionId,
      timestampIso: input.turn.timestampIso ?? input.nowIso ?? "1970-01-01T00:00:00.000Z",
      normalizedText,
      language,
      isEmpty: normalizedText.length === 0,
      isRepeatedAnswer: repeated,
      topicTag: input.turn.topicTag ?? null,
      carriedTopicTag: input.turn.topicTag ?? input.memory?.lastTopicTag ?? null,
    },
    teaching: {
      action: input.decision.action,
      timingMode: input.decision.timingMode,
      reasonCode: input.decision.reasonCode,
      nextStep,
      correctionVisible,
      feedbackEligible,
      minimalHint: minimalHint(input.decision),
      learnerMessageVi: messageVi,
      internalRationaleEn: input.decision.rationaleEn,
    },
    evidence: {
      ruleIds,
      weaknessTags: tags,
      dashboardScore: input.dashboard?.overall.intelligenceScore ?? null,
      dashboardVerdict: input.dashboard?.overall.verdict ?? null,
      dimensionsNeedingAttention: dimensionsNeedingAttention(input.dashboard),
      readinessStatus: input.decision.readiness.decision,
      provider,
      usedProviderFallback: Boolean(input.provider?.usedFallback || provider === "fallback"),
      retryCount: Math.max(0, input.provider?.retryCount ?? 0),
      risks,
      confidenceLabel: confidenceLabel(risks, ruleIds, input.dashboard),
    },
    audit: {
      deterministicKey: deterministicKey({
        sessionId: input.turn.sessionId,
        turnId: input.turn.turnId,
        normalizedText,
        action: input.decision.action,
        reasonCode: input.decision.reasonCode,
        nextStep,
      }),
      safeToSerialize: true,
      noPlaceholderOutput: !PLACEHOLDER_RE.test(JSON.stringify({ messageVi, nextStep, ruleIds })),
      noFakeConfidence: !risks.includes("fake_confidence"),
      uiCopySource: "teacherMercyLiveIntelligenceBridge",
    },
  };
}

export function serializeTeacherMercyLiveBridgePacket(packet: TeacherMercyLiveBridgePacket): string {
  return JSON.stringify(packet);
}

export function summarizeTeacherMercyLiveBridgePacket(packet: TeacherMercyLiveBridgePacket): string {
  return [
    packet.turn.sessionId,
    packet.turn.turnId,
    packet.teaching.nextStep,
    packet.teaching.reasonCode,
    packet.evidence.confidenceLabel,
  ].join(" · ");
}
