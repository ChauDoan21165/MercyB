import { describe, expect, it, vi } from "vitest";
import {
  buildConversationAiRequestBody,
  CONVERSATION_AI_MAX_TURNS,
  CONVERSATION_AI_QUALITY_GATE_MODEL,
  CONVERSATION_AI_TURN_MODEL,
  sendConversationAiTurn,
  type SendConversationAiTurnInput,
} from "@/lib/tutor/conversationAiClient";

const baseInput: SendConversationAiTurnInput = {
  accessToken: "jwt_123",
  scenarioId: "job-interview",
  learnerText: "I responsible for customer support.",
  messages: [
    { role: "developer", text: "Stay in the job interview scenario." },
    { role: "assistant", text: "Tell me about your last role." },
    { role: "learner", text: "I responsible for customer support." },
  ],
  promptMetadata: {
    scenarioId: "job-interview",
    topicId: "work-job-interview",
    locale: "vi",
    promptVersion: "test",
    vietlishExampleCount: 3,
    warmthPatternCount: 2,
  },
  entitlement: {
    isPremium: true,
    status: "active",
    currentPeriodEnd: "2026-07-01T00:00:00.000Z",
    provider: "stripe",
  },
  turnCap: {
    turnCount: 7,
    maxTurns: CONVERSATION_AI_MAX_TURNS,
  },
};

describe("conversationAiClient", () => {
  it("posts the Lane A request shape to /api/mercy-ai and parses success", async () => {
    const fetcher = vi.fn(async () => jsonResponse({
      reply: "That is useful experience. What kind of customers did you help most often?",
      correction: {
        original: "I responsible",
        corrected: "I am responsible",
        explanationVi: "Tiếng Anh cần 'am' trước tính từ/trách nhiệm.",
        interferencePattern: "Vietnamese omits be before adjectives",
        confidence: "high",
      },
      summary: {
        practiced: ["job interview answers"],
        errorsCaught: ["Vietnamese omits be before adjectives"],
        progressNote: "Bạn đang trả lời đúng chủ đề.",
      },
      cost: {
        promptTokens: 100,
        completionTokens: 40,
        totalTokens: 140,
        estimatedUsd: 0.000039,
      },
      model: CONVERSATION_AI_TURN_MODEL,
      correctionGateModel: CONVERSATION_AI_QUALITY_GATE_MODEL,
    }));

    const result = await sendConversationAiTurn({ ...baseInput, fetcher });

    expect(result.ok).toBe(true);
    expect(result.reply).toContain("customers");
    expect(result.correction?.corrected).toBe("I am responsible");
    expect(fetcher).toHaveBeenCalledWith("/api/mercy-ai", expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer jwt_123",
      },
    }));

    const body = JSON.parse(String(fetcher.mock.calls[0][1]?.body));
    expect(body).toMatchObject({
      mode: "ai-conversation-turn",
      modelIntent: "conversation_turn",
      models: {
        turn: "gpt-4o-mini",
        qualityGate: "gpt-4o",
      },
      scenarioId: "job-interview",
      learnerText: "I responsible for customer support.",
      promptMetadata: {
        scenarioId: "job-interview",
        topicId: "work-job-interview",
        locale: "vi",
      },
      entitlement: {
        isPremium: true,
        status: "active",
        currentPeriodEnd: "2026-07-01T00:00:00.000Z",
        provider: "stripe",
      },
      turnCount: 7,
      maxTurns: 50,
    });
    expect(body.entitlement).not.toHaveProperty("price_id");
    expect(body.history).toEqual([
      { role: "assistant", text: "Tell me about your last role." },
      { role: "learner", text: "I responsible for customer support." },
    ]);
  });

  it("fails closed for 401/403 entitlement errors with Vietnamese-primary premium copy", async () => {
    const fetcher = vi.fn(async () => jsonResponse({ error: "Premium required" }, 403));

    const result = await sendConversationAiTurn({ ...baseInput, fetcher });

    expect(result).toMatchObject({
      ok: false,
      fallback: true,
      status: 403,
      reason: "entitlement_required",
      correction: null,
      provider: "local-fallback",
    });
    expect(result.reply).toMatch(/^Bạn cần Premium/);
  });

  it("fails closed for 429 cost-cap responses without fabricating correction", async () => {
    const fetcher = vi.fn(async () => jsonResponse({ error: "Too many requests" }, 429));

    const result = await sendConversationAiTurn({ ...baseInput, fetcher });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("cost_cap");
    expect(result.correction).toBeNull();
    expect(result.reply).toContain("giới hạn");
  });

  it("does not call fetch when the local 50-turn session cap is reached", async () => {
    const fetcher = vi.fn();

    const result = await sendConversationAiTurn({
      ...baseInput,
      fetcher,
      turnCap: { turnCount: 50, maxTurns: 50 },
    });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      ok: false,
      reason: "cost_cap",
      correction: null,
    });
  });

  it("fails closed for network failure with Vietnamese-primary retry copy", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    });

    const result = await sendConversationAiTurn({ ...baseInput, fetcher });

    expect(result).toMatchObject({
      ok: false,
      fallback: true,
      status: null,
      reason: "network",
      correction: null,
    });
    expect(result.reply).toMatch(/^Mercy chưa lấy được/);
  });

  it("drops incomplete or non-high-confidence corrections from successful responses", async () => {
    const fetcher = vi.fn(async () => jsonResponse({
      reply: "I understand. What was the hardest customer problem you solved?",
      correction: {
        original: "I responsible",
        corrected: "I am responsible",
        explanationVi: "Có thể cần 'am'.",
        interferencePattern: "be omission",
        confidence: "low",
      },
    }));

    const result = await sendConversationAiTurn({ ...baseInput, fetcher });

    expect(result.ok).toBe(true);
    expect(result.correction).toBeNull();
  });

  it("builds a quality-gate request shape when requested by A1", () => {
    const body = buildConversationAiRequestBody({
      ...baseInput,
      modelIntent: "quality_gate",
      qualityGate: true,
    });

    expect(body.modelIntent).toBe("quality_gate");
    expect(body.models).toEqual({
      turn: CONVERSATION_AI_TURN_MODEL,
      qualityGate: CONVERSATION_AI_QUALITY_GATE_MODEL,
    });
    expect(body.turnCap.remaining).toBe(43);
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
