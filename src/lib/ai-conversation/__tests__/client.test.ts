import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_AI_CONVERSATION_SCENARIO_ID,
} from "@/lib/ai-conversation/scenarios";
import { sendAiConversationTurn, buildLearnerMemoryNote } from "@/lib/ai-conversation/client";
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
  beforeEach(() => {
    vi.mocked(sendConversationAiTurn).mockClear();
  });

  it("gates non-premium before warmth, pronunciation, or provider request work", async () => {
    const result = await sendAiConversationTurn({
      scenarioId: DEFAULT_AI_CONVERSATION_SCENARIO_ID,
      learnerText: "I want order food.",
      history: [
        {
          id: "assistant-opening",
          role: "assistant",
          text: "What would you like to order?",
        },
      ],
      turnCount: 0,
      accessToken: "token",
      hasPremium: false,
    });

    expect(result).toMatchObject({
      provider: "local-fallback",
      entitlementGate: true,
      correction: null,
      summary: null,
      cost: {},
    });
    expect(result.reply).toBe("Premium required");
    expect(result.reply).not.toMatch(/chỉ một chỗ nhỏ|one small thing/i);
    expect(result.pronunciationAbstention).toBeNull();
    expect(sendConversationAiTurn).not.toHaveBeenCalled();
  });

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

  it("keeps learner-led turns grounded in the learner seed instead of a preset scenario", async () => {
    await sendAiConversationTurn({
      scenarioId: "learner-led",
      learnerText: "This morning my bus was late and I felt nervous.",
      history: [],
      turnCount: 0,
      accessToken: "token",
      hasPremium: true,
    });

    const request = vi.mocked(sendConversationAiTurn).mock.calls[0][0];
    expect(request.scenarioId).toBe("learner-led");
    expect(request.scenario).toMatchObject({
      id: "learner-led",
      title: "Mercy follows your words",
    });
    expect(request.messages.map((message) => message.text).join("\n")).toContain(
      "This morning my bus was late and I felt nervous.",
    );
    expect(request.messages.map((message) => message.text).join("\n")).not.toContain(
      "Job interview practice",
    );
  });

  // Step-12 cross-session memory recall.
  it("injects the returning-learner memory note into the prompt and reports memoryRecalled", async () => {
    const result = await sendAiConversationTurn({
      scenarioId: DEFAULT_AI_CONVERSATION_SCENARIO_ID,
      learnerText: "I responsible for reports.",
      history: [{ id: "assistant-opening", role: "assistant", text: "What do you do?" }],
      turnCount: 1,
      accessToken: "token",
      hasPremium: true,
      learnerMemory: {
        interferencePatterns: ["article omission", "missing copula"],
        recentFocus: "present-simple",
      },
    });

    expect(result.memoryRecalled).toBe(true);
    const request = vi.mocked(sendConversationAiTurn).mock.calls[0][0];
    const promptText = request.messages.map((m) => m.text).join("\n");
    expect(promptText).toContain("RETURNING LEARNER MEMORY");
    expect(promptText).toContain("article omission");
    expect(promptText).toContain("present-simple");
  });

  it("adds no memory note and reports memoryRecalled=false for a first-ever session (no memory)", async () => {
    const result = await sendAiConversationTurn({
      scenarioId: DEFAULT_AI_CONVERSATION_SCENARIO_ID,
      learnerText: "I responsible for reports.",
      history: [{ id: "assistant-opening", role: "assistant", text: "What do you do?" }],
      turnCount: 1,
      accessToken: "token",
      hasPremium: true,
    });

    expect(result.memoryRecalled).toBe(false);
    const request = vi.mocked(sendConversationAiTurn).mock.calls[0][0];
    expect(request.messages.map((m) => m.text).join("\n")).not.toContain("RETURNING LEARNER MEMORY");
  });

  it("treats empty memory (no patterns, no focus) as nothing to recall", async () => {
    const result = await sendAiConversationTurn({
      scenarioId: DEFAULT_AI_CONVERSATION_SCENARIO_ID,
      learnerText: "I responsible for reports.",
      history: [{ id: "assistant-opening", role: "assistant", text: "What do you do?" }],
      turnCount: 1,
      accessToken: "token",
      hasPremium: true,
      learnerMemory: { interferencePatterns: [], recentFocus: null },
    });

    expect(result.memoryRecalled).toBe(false);
  });
});

describe("buildLearnerMemoryNote", () => {
  it("returns null when there is nothing to recall", () => {
    expect(buildLearnerMemoryNote(null)).toBeNull();
    expect(buildLearnerMemoryNote({ interferencePatterns: [], recentFocus: null })).toBeNull();
    expect(buildLearnerMemoryNote({ interferencePatterns: ["  "], recentFocus: "" })).toBeNull();
  });

  it("caps to the top 3 interference patterns and includes the recent focus", () => {
    const note = buildLearnerMemoryNote({
      interferencePatterns: ["a", "b", "c", "d"],
      recentFocus: "tenses",
    });
    expect(note).toContain("a; b; c");
    expect(note).not.toContain("; d");
    expect(note).toContain("tenses");
    expect(note).toContain("RETURNING LEARNER MEMORY");
  });
});
