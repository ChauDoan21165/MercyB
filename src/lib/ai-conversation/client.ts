import type {
  AiConversationCost,
  AiConversationCorrection,
  AiConversationSummary,
  AiConversationTurn,
} from "./session";
import {
  getAiConversationScenario,
  type AiConversationScenarioId,
} from "./scenarios";
import {
  buildConversationPromptTemplate,
} from "@/lib/tutor/conversationPromptTemplates";
import {
  CONVERSATION_AI_MAX_TURNS,
  sendConversationAiTurn,
  type ConversationAiMessage,
  type ConversationAiResult,
} from "@/lib/tutor/conversationAiClient";
import {
  decideConversationTurnPolicy,
} from "@/lib/tutor/conversationTurnPolicy";
import {
  abstentionRedirectFromPronunciation,
  buildTurnWarmth,
} from "@/lib/tutor/conversationWarmth";
import {
  scoreLearnerConversationPronunciation,
  type ConversationAudioSource,
} from "@/lib/tutor/conversationPronunciationAdapter";

export type AiConversationTurnRequest = {
  scenarioId: AiConversationScenarioId;
  learnerText: string;
  history: AiConversationTurn[];
  turnCount: number;
  accessToken: string;
  hasPremium?: boolean;
  entitlementStatus?: string | null;
  audioBlob?: Blob | null;
  audioSource?: ConversationAudioSource;
};

export type AiConversationTurnResponse = {
  reply: string;
  correction: AiConversationCorrection | null;
  summary: AiConversationSummary | null;
  cost: Partial<AiConversationCost>;
  provider: "openai" | "local-fallback";
  pronunciationAbstention: ReturnType<typeof abstentionRedirectFromPronunciation>;
  entitlementGate?: boolean;
};

export async function sendAiConversationTurn(
  request: AiConversationTurnRequest,
): Promise<AiConversationTurnResponse> {
  if (request.hasPremium !== true) {
    return {
      reply: "Premium required",
      correction: null,
      summary: null,
      cost: {},
      provider: "local-fallback",
      pronunciationAbstention: null,
      entitlementGate: true,
    };
  }

  const scenario = getAiConversationScenario(request.scenarioId);
  const recentAssistantQuestions = request.history
    .filter((turn) => turn.role === "assistant" && /\?/.test(turn.text))
    .map((turn) => turn.text);
  const policy = decideConversationTurnPolicy({
    learnerText: request.learnerText,
    currentTopicId: scenario.id,
    topicLabel: scenario.title,
    turnsOnTopic: request.turnCount,
    recentQuestions: recentAssistantQuestions,
  });
  const promptTemplate = buildConversationPromptTemplate({
    topic: scenario.topic,
    learnerText: request.learnerText,
    turnCount: request.turnCount,
    recentAiTurns: request.history
      .filter((turn) => turn.role === "assistant")
      .map((turn) => turn.text)
      .slice(-6),
  });
  const pronunciation = await scoreLearnerConversationPronunciation({
    audioBlob: request.audioBlob ?? null,
    audioSource: request.audioSource ?? "text_only",
    target: recentAssistantQuestions.at(-1) ?? scenario.openingPrompt,
    transcript: request.learnerText,
    step7Enabled: Boolean(request.audioBlob && request.accessToken),
    userJwt: request.accessToken,
  });
  const pronunciationAbstention = abstentionRedirectFromPronunciation(pronunciation, {
    turnIndex: request.turnCount,
    suggestedNextPrompt:
      request.audioSource === "learner_recording"
        ? { vi: policy.promptInstruction, en: policy.promptInstruction }
        : null,
  });
  const warmth = buildTurnWarmth({
    warmthPatterns: scenario.warmthPatterns,
    interferenceNote: scenario.topic.l1InterferenceNotes?.[0] ?? null,
    outcome: "minor_slip",
    turnIndex: request.turnCount,
  });

  const result = await sendConversationAiTurn({
    accessToken: request.accessToken,
    scenarioId: scenario.id,
    learnerText: request.learnerText,
    messages: buildMessages(request.history, promptTemplate.systemPrompt, policy.promptInstruction),
    promptMetadata: {
      scenarioId: scenario.id,
      topicId: scenario.id,
      locale: "vi",
      promptVersion: "conversation-pure-v1",
      vietlishExampleCount: promptTemplate.systemPrompt.match(/Vietlish:/g)?.length ?? 0,
      warmthPatternCount: scenario.warmthPatterns.length,
    },
    entitlement: {
      isPremium: true,
      status: request.entitlementStatus ?? null,
    },
    turnCap: {
      turnCount: request.turnCount,
      maxTurns: CONVERSATION_AI_MAX_TURNS,
    },
    modelIntent: "conversation_turn",
    qualityGate: true,
  });

  return normalizeAiConversationResult(result, warmth, pronunciationAbstention);
}

function buildMessages(
  history: AiConversationTurn[],
  systemPrompt: string,
  policyInstruction: string,
): ConversationAiMessage[] {
  return [
    { role: "developer", text: systemPrompt },
    { role: "developer", text: `Deterministic turn policy: ${policyInstruction}` },
    ...history.map((turn) => ({
      role: turn.role,
      text: turn.text,
    })),
  ];
}

function normalizeAiConversationResult(
  result: ConversationAiResult,
  warmth: ReturnType<typeof buildTurnWarmth>,
  pronunciationAbstention: ReturnType<typeof abstentionRedirectFromPronunciation>,
): AiConversationTurnResponse {
  const reply = [warmth.vi, warmth.en, result.reply].filter(Boolean).join("\n");
  return {
    reply,
    correction: result.ok ? normalizeCorrection(result.correction) : null,
    summary: result.ok ? normalizeSummary(result.summary) : null,
    cost: result.cost,
    provider: result.provider === "openai" ? "openai" : "local-fallback",
    pronunciationAbstention,
  };
}

function normalizeCorrection(value: unknown): AiConversationCorrection | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const original = stringValue(record.original);
  const corrected = stringValue(record.corrected);
  const explanationVi = stringValue(record.explanationVi);
  const interferencePattern = stringValue(record.interferencePattern);
  if (!original || !corrected || !explanationVi || !interferencePattern) return null;
  return {
    original,
    corrected,
    explanationVi,
    interferencePattern,
    confidence: "high",
  };
}

function normalizeSummary(value: unknown): AiConversationSummary | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return {
    practiced: Array.isArray(record.practiced) ? record.practiced.map(stringValue).filter(Boolean) : [],
    errorsCaught: Array.isArray(record.errorsCaught) ? record.errorsCaught.map(stringValue).filter(Boolean) : [],
    progressNote: stringValue(record.progressNote),
  };
}

function normalizeCost(value: unknown): Partial<AiConversationCost> {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  return {
    promptTokens: numberValue(record.promptTokens),
    completionTokens: numberValue(record.completionTokens),
    totalTokens: numberValue(record.totalTokens),
    estimatedUsd: numberValue(record.estimatedUsd),
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
