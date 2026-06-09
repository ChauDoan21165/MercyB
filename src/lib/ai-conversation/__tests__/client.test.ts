import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_AI_CONVERSATION_SCENARIO_ID,
} from "@/lib/ai-conversation/scenarios";
import { sendAiConversationTurn } from "@/lib/ai-conversation/client";
import { sendConversationAiTurn } from "@/lib/tutor/conversationAiClient";

vi.mock("@/lib/tutor/conversationAiClient", async () => {
  const actual = await vi.importActual<typeof import("@/lib/tutor/conversationAiClient")>(
    "@/lib/tutor/conversationAiClient",
  );
  return {
    ...actual,
    sendConversationAiTurn: vi.fn(async () => ({
      ok: true,
      fallback: false,
      status: 200,
      reply: "Tiếng Việt: câu trả lời ổn.\nEnglish: What happened next?",
      correction: null,
      summary: null,
      cost: { totalTokens: 88, estimatedUsd: 0.0001 },
      provider: "openai",
      model: "gpt-4o-mini",
      correctionGateModel: "gpt-4o",
    })),
  };
});

describe("sendAiConversationTurn pure conversation adapter", () => {
  it("builds prompt, policy, entitlement, turn cap, and no-audio pronunciation contracts", async () => {
    const result = await sendAiConversationTurn({
      scenarioId: DEFAULT_AI_CONVERSATION_SCENARIO_ID,
      learnerText: "I responsible for reports.",
      history: [
        {
          id: "assistant-opening",
          role: "assistant",
          text: "What do you do at work?",
        },
      ],
      turnCount: 1,
      accessToken: "token",
      hasPremium: true,
    });

    expect(result.provider).toBe("openai");
    expect(result.reply).toContain("Tiếng Việt");
    expect(result.pronunciationAbstention?.trigger).toBe("no_audio");

    expect(sendConversationAiTurn).toHaveBeenCalledTimes(1);
    const request = vi.mocked(sendConversationAiTurn).mock.calls[0][0];
    expect(request.scenarioId).toBe(DEFAULT_AI_CONVERSATION_SCENARIO_ID);
    expect(request.entitlement.isPremium).toBe(true);
    expect(request.turnCap).toMatchObject({ turnCount: 1, maxTurns: 50 });
    expect(request.promptMetadata).toMatchObject({
      locale: "vi",
      promptVersion: "conversation-pure-v1",
    });
    expect(request.messages[0]).toMatchObject({ role: "developer" });
    expect(request.messages[0].text).toContain("Compact Vietlish examples");
    expect(request.messages[1].text).toContain("Deterministic turn policy");
    expect(request.messages.at(-1)).toMatchObject({
      role: "assistant",
      text: "What do you do at work?",
    });
  });
});
