// api/_lib/__tests__/deepseekSpeak.test.ts
//
// Provider-fallback contract for buildDeepSeekSpeakFollowUp:
//   - DeepSeek is primary; Gemini is fallback on missing key / 5xx / network / empty response.
//   - Neither key → typed SpeakFollowUpError (retryable).
//   - AI returned content but no valid question → null (genuine unclear input).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildDeepSeekSpeakFollowUp } from "../deepseekSpeak.js";

const BASE_INPUT = {
  transcript: "I went to the market yesterday.",
  learnerLevel: "beginner",
  currentTopic: "daily-routine",
  recentTurns: [] as Array<{ role: "learner" | "assistant"; text: string }>,
};

const DS_OK_BODY = JSON.stringify({ choices: [{ message: { content: "What did you buy there?" } }] });
const GEM_OK_BODY = JSON.stringify({
  candidates: [{ content: { parts: [{ text: "Did you go alone?" }] } }],
});
const OK_HEADERS = { "Content-Type": "application/json" };

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

function isDeepSeekCall(url: unknown): boolean {
  return typeof url === "string" && url === DEEPSEEK_URL;
}

describe("buildDeepSeekSpeakFollowUp — provider fallback", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Case 1: DeepSeek key only → DeepSeek used ─────────────────────────
  it("case1: DeepSeek key only → DeepSeek is used and answers", async () => {
    fetchMock.mockResolvedValue(new Response(DS_OK_BODY, { status: 200, headers: OK_HEADERS }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-ds-only" },
    });
    expect(result).toMatchObject({ question: "What did you buy there?", provider: "deepseek" });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(isDeepSeekCall(fetchMock.mock.calls[0]?.[0])).toBe(true);
  });

  // ── Case 2: Gemini key only → Gemini used ────────────────────────────
  it("case2: Gemini key only → Gemini is used and answers", async () => {
    fetchMock.mockResolvedValue(new Response(GEM_OK_BODY, { status: 200, headers: OK_HEADERS }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { GEMINI_API_KEY: "gk-only" },
    });
    expect(result).toMatchObject({ question: "Did you go alone?", provider: "gemini" });
    // DeepSeek was skipped (no key), only one fetch call to Gemini
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(isDeepSeekCall(fetchMock.mock.calls[0]?.[0])).toBe(false);
  });

  // ── Case 3a: Both keys → DeepSeek wins ───────────────────────────────
  it("case3a: both keys, DeepSeek healthy → DeepSeek wins", async () => {
    fetchMock.mockResolvedValue(new Response(DS_OK_BODY, { status: 200, headers: OK_HEADERS }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-ds", GEMINI_API_KEY: "gk-test" },
    });
    expect(result).toMatchObject({ question: "What did you buy there?", provider: "deepseek" });
    // Only DeepSeek called — Gemini not attempted
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(isDeepSeekCall(fetchMock.mock.calls[0]?.[0])).toBe(true);
  });

  // ── Case 3b: Both keys, DeepSeek 500 → Gemini answers ─────────────────
  it("case3b: both keys, DeepSeek 500 → falls over to Gemini", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("{}", { status: 500 }))          // DeepSeek 500
      .mockResolvedValueOnce(new Response(GEM_OK_BODY, { status: 200, headers: OK_HEADERS })); // Gemini OK
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-ds", GEMINI_API_KEY: "gk-test" },
    });
    expect(result).toMatchObject({ question: "Did you go alone?", provider: "gemini" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // ── Case 4: Neither key → typed error intact ──────────────────────────
  it("case4: neither key → SpeakFollowUpError (typed retryable)", async () => {
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: {} });
    expect(result).toEqual({ ok: false, retryable: true, reason: "speak_followup_unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // ── Regression: DeepSeek network failure → Gemini ────────────────────
  it("DeepSeek network throw → falls over to Gemini", async () => {
    fetchMock
      .mockRejectedValueOnce(new Error("network failure"))
      .mockResolvedValueOnce(new Response(GEM_OK_BODY, { status: 200, headers: OK_HEADERS }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-ds", GEMINI_API_KEY: "gk-test" },
    });
    expect(result).toMatchObject({ provider: "gemini" });
  });

  // ── Regression: both fail → typed error ──────────────────────────────
  it("both providers fail → SpeakFollowUpError", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("{}", { status: 500 }))
      .mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-ds", GEMINI_API_KEY: "gk-test" },
    });
    expect(result).toEqual({ ok: false, retryable: true, reason: "speak_followup_unavailable" });
  });

  // ── Regression: DeepSeek OK but no valid question → null ─────────────
  it("DeepSeek answers but question fails normalization → null (genuine unclear)", async () => {
    const body = JSON.stringify({ choices: [{ message: { content: "okay" } }] });
    fetchMock.mockResolvedValue(new Response(body, { status: 200, headers: OK_HEADERS }));
    const result = await buildDeepSeekSpeakFollowUp({
      ...BASE_INPUT,
      env: { DEEPSEEK_API_KEY: "sk-test", GEMINI_API_KEY: "gk-test" },
    });
    // "okay" has no trailing "?" → normalization returns "" → null
    expect(result).toBeNull();
    // Gemini not attempted because DeepSeek returned content (just not a valid question)
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  // ── Regression: never returns SPEAK_REPEAT_CLARIFICATION for missing key
  it("missing key failure is never the canned clarification string", async () => {
    const result = await buildDeepSeekSpeakFollowUp({ ...BASE_INPUT, env: {} });
    expect(result).not.toBeNull();
    if (result && "question" in result) {
      expect(result.question).not.toMatch(/Mercy chưa nghe rõ/);
    }
  });
});
