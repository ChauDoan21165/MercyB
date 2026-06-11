// api/_lib/__tests__/deepseekSpeak.test.ts
//
// Verifies that buildDeepSeekSpeakFollowUp returns a typed SpeakFollowUpError
// for infrastructure failures (missing key, API error, network error) and
// returns null for genuine unclear-input cases (API worked, bad question).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildDeepSeekSpeakFollowUp } from "../deepseekSpeak.js";

const BASE_INPUT = {
  transcript: "I went to the market yesterday.",
  learnerLevel: "beginner",
  currentTopic: "daily-routine",
  recentTurns: [] as Array<{ role: "learner" | "assistant"; text: string }>,
};

describe("buildDeepSeekSpeakFollowUp", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns SpeakFollowUpError when DEEPSEEK_API_KEY is missing", async () => {
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: {} });
    expect(result).toEqual({ ok: false, retryable: true, reason: "speak_followup_unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns SpeakFollowUpError when the API returns a non-ok status", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: { DEEPSEEK_API_KEY: "sk-test" } });
    expect(result).toEqual({ ok: false, retryable: true, reason: "speak_followup_unavailable" });
  });

  it("returns SpeakFollowUpError when fetch throws (network/timeout)", async () => {
    fetchMock.mockRejectedValue(new Error("network failure"));
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: { DEEPSEEK_API_KEY: "sk-test" } });
    expect(result).toEqual({ ok: false, retryable: true, reason: "speak_followup_unavailable" });
  });

  it("returns null (genuine unclear input) when the API responds but produces no valid question", async () => {
    const body = JSON.stringify({ choices: [{ message: { content: "okay" } }] });
    fetchMock.mockResolvedValue(new Response(body, { status: 200, headers: { "Content-Type": "application/json" } }));
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: { DEEPSEEK_API_KEY: "sk-test" } });
    // "okay" has no trailing "?" so normalizeSpeakQuestion returns "" → null
    expect(result).toBeNull();
  });

  it("returns a question when the API responds with a valid follow-up", async () => {
    const body = JSON.stringify({ choices: [{ message: { content: "What did you buy there?" } }] });
    fetchMock.mockResolvedValue(new Response(body, { status: 200, headers: { "Content-Type": "application/json" } }));
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: { DEEPSEEK_API_KEY: "sk-test" } });
    expect(result).toMatchObject({ question: "What did you buy there?", provider: "deepseek" });
  });

  it("never returns SPEAK_REPEAT_CLARIFICATION for missing-key failure", async () => {
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: {} });
    expect(result).not.toBeNull();
    if (result && "question" in result) {
      expect(result.question).not.toMatch(/Mercy chưa nghe rõ/);
    }
  });
});
