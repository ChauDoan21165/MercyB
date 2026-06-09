import { resolveApiUrl } from "@/lib/apiBase";
import { supabase } from "@/lib/supabaseClient";
import type {
  AiConversationCost,
  AiConversationCorrection,
  AiConversationSummary,
  AiConversationTurn,
} from "./session";
import type { AiConversationScenarioId } from "./scenarios";

export type AiConversationTurnRequest = {
  scenarioId: AiConversationScenarioId;
  learnerText: string;
  history: AiConversationTurn[];
  turnCount: number;
  accessToken: string;
};

export type AiConversationTurnResponse = {
  reply: string;
  correction: AiConversationCorrection | null;
  summary: AiConversationSummary | null;
  cost: Partial<AiConversationCost>;
  provider: "openai" | "supabase-fallback";
};

export async function sendAiConversationTurn(
  request: AiConversationTurnRequest,
): Promise<AiConversationTurnResponse> {
  const body = {
    mode: "ai-conversation-turn",
    scenarioId: request.scenarioId,
    learnerText: request.learnerText,
    turnCount: request.turnCount,
    history: request.history.map((turn) => ({
      role: turn.role,
      text: turn.text,
      correction: turn.correction ?? null,
    })),
  };

  try {
    const response = await fetch(resolveApiUrl("/api/mercy-ai"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      throw new Error(`api_unavailable:${response.status}`);
    }
    const data = await response.json();
    return normalizeAiConversationResponse(data, "openai");
  } catch (error) {
    if (!isLocalDev()) throw error;
    const { data, error: fallbackError } = await supabase.functions.invoke("ai-tutor", {
      body,
      headers: { Authorization: `Bearer ${request.accessToken}` },
    });
    if (fallbackError) throw fallbackError;
    return normalizeAiConversationResponse(data, "supabase-fallback");
  }
}

function normalizeAiConversationResponse(
  value: unknown,
  provider: "openai" | "supabase-fallback",
): AiConversationTurnResponse {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const correction = normalizeCorrection(record.correction);
  return {
    reply: typeof record.reply === "string" && record.reply.trim()
      ? record.reply.trim()
      : "I want to keep practicing this interview. Can you say that answer one more way?",
    correction,
    summary: normalizeSummary(record.summary),
    cost: normalizeCost(record.cost),
    provider,
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

function isLocalDev(): boolean {
  return Boolean(
    (import.meta as ImportMeta & { env?: Record<string, unknown> }).env?.DEV ||
      (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)),
  );
}
