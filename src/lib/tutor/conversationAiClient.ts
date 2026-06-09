import { resolveApiUrl } from "@/lib/apiBase";

export const CONVERSATION_AI_ENDPOINT = "/api/mercy-ai";
export const CONVERSATION_AI_TURN_MODEL = "gpt-4o-mini";
export const CONVERSATION_AI_QUALITY_GATE_MODEL = "gpt-4o";
export const CONVERSATION_AI_MAX_TURNS = 50;

export type ConversationAiRole = "learner" | "assistant" | "developer";

export type ConversationAiMessage = {
  role: ConversationAiRole;
  text: string;
};

export type ConversationAiCorrection = {
  original: string;
  corrected: string;
  explanationVi: string;
  interferencePattern: string;
  confidence: "high";
};

export type ConversationAiSummary = {
  practiced: string[];
  errorsCaught: string[];
  progressNote: string;
};

export type ConversationAiCost = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedUsd: number;
};

export type ConversationAiModelIntent = "conversation_turn" | "quality_gate";

export type ConversationAiPromptMetadata = {
  scenarioId: string;
  topicId?: string | null;
  locale?: "vi" | "en";
  promptVersion?: string;
  vietlishExampleCount?: number;
  warmthPatternCount?: number;
};

export type ConversationAiEntitlementState = {
  isPremium: boolean;
  status?: string | null;
  currentPeriodEnd?: string | null;
  provider?: string | null;
};

export type ConversationAiTurnCapContext = {
  turnCount: number;
  maxTurns?: number;
};

export type SendConversationAiTurnInput = {
  accessToken?: string | null;
  scenarioId: string;
  learnerText: string;
  messages: ConversationAiMessage[];
  promptMetadata: ConversationAiPromptMetadata;
  entitlement: ConversationAiEntitlementState;
  turnCap: ConversationAiTurnCapContext;
  modelIntent?: ConversationAiModelIntent;
  qualityGate?: boolean;
  fetcher?: typeof fetch;
};

export type ConversationAiSuccess = {
  ok: true;
  fallback: false;
  status: number;
  reply: string;
  correction: ConversationAiCorrection | null;
  summary: ConversationAiSummary | null;
  cost: Partial<ConversationAiCost>;
  provider: "openai";
  model: string;
  correctionGateModel: string;
};

export type ConversationAiFailureReason =
  | "entitlement_required"
  | "cost_cap"
  | "network"
  | "invalid_response"
  | "api_error";

export type ConversationAiFailure = {
  ok: false;
  fallback: true;
  status: number | null;
  reason: ConversationAiFailureReason;
  reply: string;
  correction: null;
  summary: null;
  cost: {};
  provider: "local-fallback";
  model: typeof CONVERSATION_AI_TURN_MODEL;
  correctionGateModel: typeof CONVERSATION_AI_QUALITY_GATE_MODEL;
};

export type ConversationAiResult = ConversationAiSuccess | ConversationAiFailure;

export async function sendConversationAiTurn(
  input: SendConversationAiTurnInput,
): Promise<ConversationAiResult> {
  const fetcher = input.fetcher ?? fetch;
  const turnCount = safeTurnCount(input.turnCap.turnCount);
  const maxTurns = input.turnCap.maxTurns ?? CONVERSATION_AI_MAX_TURNS;

  if (turnCount >= maxTurns) {
    return fallbackResult("cost_cap", 400);
  }

  const body = buildConversationAiRequestBody(input, turnCount, maxTurns);

  try {
    const response = await fetcher(resolveApiUrl(CONVERSATION_AI_ENDPOINT), {
      method: "POST",
      headers: buildHeaders(input.accessToken),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return fallbackResult(reasonForStatus(response.status), response.status);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return fallbackResult("invalid_response", response.status);
    }

    return normalizeConversationAiResponse(await response.json(), response.status);
  } catch {
    return fallbackResult("network", null);
  }
}

export function buildConversationAiRequestBody(
  input: SendConversationAiTurnInput,
  turnCount = safeTurnCount(input.turnCap.turnCount),
  maxTurns = input.turnCap.maxTurns ?? CONVERSATION_AI_MAX_TURNS,
) {
  const modelIntent = input.modelIntent ?? "conversation_turn";
  const messages = input.messages.map((message) => ({
    role: message.role,
    text: trimString(message.text),
  })).filter((message) => message.text);

  return {
    mode: "ai-conversation-turn",
    modelIntent,
    models: {
      turn: CONVERSATION_AI_TURN_MODEL,
      qualityGate: input.qualityGate === false ? null : CONVERSATION_AI_QUALITY_GATE_MODEL,
    },
    scenarioId: trimString(input.scenarioId),
    learnerText: trimString(input.learnerText),
    messages,
    history: messages
      .filter((message) => message.role === "learner" || message.role === "assistant")
      .map((message) => ({
        role: message.role,
        text: message.text,
      })),
    promptMetadata: {
      ...input.promptMetadata,
      scenarioId: trimString(input.promptMetadata.scenarioId || input.scenarioId),
    },
    entitlement: {
      isPremium: input.entitlement.isPremium === true,
      status: input.entitlement.status ?? null,
      currentPeriodEnd: input.entitlement.currentPeriodEnd ?? null,
      provider: input.entitlement.provider ?? null,
    },
    turnCount,
    maxTurns,
    turnCap: {
      turnCount,
      maxTurns,
      remaining: Math.max(0, maxTurns - turnCount),
    },
  };
}

function normalizeConversationAiResponse(value: unknown, status: number): ConversationAiResult {
  const record = isRecord(value) ? value : {};
  const reply = trimString(record.reply);
  if (!reply) return fallbackResult("invalid_response", status);

  return {
    ok: true,
    fallback: false,
    status,
    reply,
    correction: normalizeCorrection(record.correction),
    summary: normalizeSummary(record.summary),
    cost: normalizeCost(record.cost),
    provider: "openai",
    model: trimString(record.model) || CONVERSATION_AI_TURN_MODEL,
    correctionGateModel: trimString(record.correctionGateModel) || CONVERSATION_AI_QUALITY_GATE_MODEL,
  };
}

function fallbackResult(reason: ConversationAiFailureReason, status: number | null): ConversationAiFailure {
  return {
    ok: false,
    fallback: true,
    status,
    reason,
    reply: fallbackReply(reason),
    correction: null,
    summary: null,
    cost: {},
    provider: "local-fallback",
    model: CONVERSATION_AI_TURN_MODEL,
    correctionGateModel: CONVERSATION_AI_QUALITY_GATE_MODEL,
  };
}

function fallbackReply(reason: ConversationAiFailureReason): string {
  if (reason === "entitlement_required") {
    return "Bạn cần Premium để mở cuộc trò chuyện AI này. English: Premium is required for AI conversation practice.";
  }

  if (reason === "cost_cap") {
    return "Mình tạm dừng ở giới hạn lượt hôm nay để bảo vệ chi phí. English: The conversation limit was reached; please continue later.";
  }

  return "Mercy chưa lấy được câu trả lời AI an toàn, nên mình không đoán lỗi của bạn. English: Please try again in a moment with one short sentence.";
}

function reasonForStatus(status: number): ConversationAiFailureReason {
  if (status === 401 || status === 403) return "entitlement_required";
  if (status === 429) return "cost_cap";
  return "api_error";
}

function buildHeaders(accessToken?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = trimString(accessToken);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeCorrection(value: unknown): ConversationAiCorrection | null {
  if (!isRecord(value)) return null;
  const original = trimString(value.original);
  const corrected = trimString(value.corrected);
  const explanationVi = trimString(value.explanationVi);
  const interferencePattern = trimString(value.interferencePattern);
  if (!original || !corrected || !explanationVi || !interferencePattern) return null;
  if (value.confidence !== "high") return null;
  return {
    original,
    corrected,
    explanationVi,
    interferencePattern,
    confidence: "high",
  };
}

function normalizeSummary(value: unknown): ConversationAiSummary | null {
  if (!isRecord(value)) return null;
  return {
    practiced: stringArray(value.practiced),
    errorsCaught: stringArray(value.errorsCaught),
    progressNote: trimString(value.progressNote),
  };
}

function normalizeCost(value: unknown): Partial<ConversationAiCost> {
  if (!isRecord(value)) return {};
  return {
    promptTokens: numberValue(value.promptTokens),
    completionTokens: numberValue(value.completionTokens),
    totalTokens: numberValue(value.totalTokens),
    estimatedUsd: numberValue(value.estimatedUsd),
  };
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(trimString).filter(Boolean);
}

function safeTurnCount(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
