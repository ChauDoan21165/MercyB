import {
  DEFAULT_AI_CONVERSATION_SCENARIO_ID,
  type AiConversationScenarioId,
} from "./scenarios";

export const AI_CONVERSATION_MAX_TURNS = 50;

export type AiConversationRole = "learner" | "assistant";

export type AiConversationCorrection = {
  original: string;
  corrected: string;
  explanationVi: string;
  interferencePattern: string;
  confidence: "high";
};

export type AiConversationTurn = {
  id: string;
  role: AiConversationRole;
  text: string;
  correction?: AiConversationCorrection | null;
};

export type AiConversationCost = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedUsd: number;
};

export type AiConversationSummary = {
  practiced: string[];
  errorsCaught: string[];
  progressNote: string;
};

export type AiConversationSession = {
  id: string;
  scenarioId: AiConversationScenarioId;
  turns: AiConversationTurn[];
  learnerTurnCount: number;
  maxTurns: number;
  cost: AiConversationCost;
  ended: boolean;
  summary: AiConversationSummary | null;
};

export function createAiConversationSession(
  scenarioId: AiConversationScenarioId = DEFAULT_AI_CONVERSATION_SCENARIO_ID,
): AiConversationSession {
  return {
    id: `ai-conv-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    scenarioId,
    turns: [],
    learnerTurnCount: 0,
    maxTurns: AI_CONVERSATION_MAX_TURNS,
    cost: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedUsd: 0,
    },
    ended: false,
    summary: null,
  };
}

export function canSendAiConversationTurn(session: AiConversationSession): boolean {
  return !session.ended && session.learnerTurnCount < session.maxTurns;
}

export function addAiConversationCost(
  current: AiConversationCost,
  next?: Partial<AiConversationCost> | null,
): AiConversationCost {
  const promptTokens = current.promptTokens + safeNumber(next?.promptTokens);
  const completionTokens = current.completionTokens + safeNumber(next?.completionTokens);
  const totalTokens = current.totalTokens + safeNumber(next?.totalTokens);
  const estimatedUsd = current.estimatedUsd + safeNumber(next?.estimatedUsd);
  return { promptTokens, completionTokens, totalTokens, estimatedUsd };
}

export function buildAiConversationSummary(turns: AiConversationTurn[]): AiConversationSummary {
  const learnerTurns = turns.filter((turn) => turn.role === "learner").length;
  const corrections = turns
    .map((turn) => turn.correction)
    .filter((correction): correction is AiConversationCorrection => Boolean(correction));
  const errorsCaught = corrections.map((correction) => correction.interferencePattern);
  return {
    practiced: [
      "scenario conversation answers",
      "learner-specific follow-up questions",
      "clear Vietnamese-to-English transfer patterns",
    ],
    errorsCaught: [...new Set(errorsCaught)],
    progressNote:
      learnerTurns >= 4
        ? "You sustained a multi-turn interview practice and kept answering in context."
        : "You started the interview practice. Continue for four turns to build rhythm.",
  };
}

function safeNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
