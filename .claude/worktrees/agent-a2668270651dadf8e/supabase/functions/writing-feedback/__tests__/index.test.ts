// @vitest-environment node
//
// Path: supabase/functions/writing-feedback/__tests__/index.test.ts
//
// handleRequest tests via injected `Deps`. No real Supabase, no real
// AI calls. Mirrors the azure-phoneme split + the chatJsonWithFailover
// JSON-mode contract.

import { describe, it, expect, vi } from "vitest";

import {
  buildAiInput,
  handleRequest,
  projectAiResponse,
  WRITING_FEEDBACK_LIMITS,
  type Deps,
  type PromptContext,
} from "../core";

const samplePrompt: PromptContext = {
  id: "we_sick_leave",
  title_en: "Asking for sick leave",
  scenario_en: "You came down with a fever and need to email your manager.",
  target_words_min: 60,
  target_words_max: 120,
};

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi.fn().mockResolvedValue({ id: "user-1" }),
    rateLimit: vi.fn().mockResolvedValue(undefined),
    getPromptById: vi.fn().mockReturnValue(samplePrompt),
    callAi: vi.fn().mockResolvedValue({
      ok: true,
      json: {
        score: 80,
        summary_vi: "Tạm ổn.",
        summary_en: "Decent.",
        corrections: [],
        vocabulary: [],
        grammar: [],
        cultural_notes_vi: [],
        cultural_notes_en: [],
      },
      raw: "{}",
    }),
    logCall: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeReq(body: Record<string, unknown>): Request {
  return new Request("https://test.example.com/writing-feedback", {
    method: "POST",
    headers: {
      Authorization: "Bearer test-jwt",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("handleRequest — auth", () => {
  it("returns 401 when JWT resolution fails", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(50),
        time_spent_seconds: 10,
      }),
      deps,
    );
    expect(res.status).toBe(401);
    expect(deps.callAi).not.toHaveBeenCalled();
  });
});

describe("handleRequest — rate limit", () => {
  it("returns 429 when rateLimit throws RATE_LIMIT_EXCEEDED", async () => {
    const deps = makeDeps({
      rateLimit: vi.fn().mockImplementation(() => {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }),
    });
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(50),
      }),
      deps,
    );
    expect(res.status).toBe(429);
    expect(deps.callAi).not.toHaveBeenCalled();
  });
});

describe("handleRequest — validation", () => {
  it("rejects an unknown prompt with 404", async () => {
    const deps = makeDeps({ getPromptById: vi.fn().mockReturnValue(null) });
    const res = await handleRequest(
      makeReq({
        prompt_id: "ghost",
        submission_text: "x".repeat(50),
      }),
      deps,
    );
    expect(res.status).toBe(404);
  });

  it("rejects too-short submissions with 400", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      makeReq({ prompt_id: samplePrompt.id, submission_text: "short" }),
      deps,
    );
    expect(res.status).toBe(400);
    expect(deps.callAi).not.toHaveBeenCalled();
  });

  it("rejects oversize submissions with 400", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(WRITING_FEEDBACK_LIMITS.MAX_SUBMISSION_LEN + 1),
      }),
      deps,
    );
    expect(res.status).toBe(400);
  });
});

describe("handleRequest — happy path", () => {
  it("returns 200 with the projected feedback payload", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(80),
        time_spent_seconds: 60,
      }),
      deps,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.score).toBe(80);
    expect(body.summary_vi).toBe("Tạm ổn.");
    expect(deps.callAi).toHaveBeenCalledTimes(1);
    expect(deps.logCall).toHaveBeenCalledWith(
      expect.objectContaining({ status: "ok", score: 80 }),
    );
  });

  it("caps maxTokens at 1000 (the brief's hard cost limit)", async () => {
    const deps = makeDeps();
    await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(80),
      }),
      deps,
    );
    const callArg = (deps.callAi as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg.maxTokens).toBe(WRITING_FEEDBACK_LIMITS.MAX_OUTPUT_TOKENS);
    expect(callArg.maxTokens).toBe(1000);
  });
});

describe("handleRequest — AI failure", () => {
  it("returns 503 when callAi throws", async () => {
    const deps = makeDeps({
      callAi: vi.fn().mockRejectedValue(new Error("upstream down")),
    });
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(80),
      }),
      deps,
    );
    expect(res.status).toBe(503);
  });

  it("returns 503 when callAi resolves with ok:false", async () => {
    const deps = makeDeps({
      callAi: vi.fn().mockResolvedValue({ ok: false, json: {}, raw: "" }),
    });
    const res = await handleRequest(
      makeReq({
        prompt_id: samplePrompt.id,
        submission_text: "x".repeat(80),
      }),
      deps,
    );
    expect(res.status).toBe(503);
  });
});

describe("buildAiInput", () => {
  it("includes the prompt scenario and the target word range in the user message", () => {
    const input = buildAiInput(samplePrompt, "Hello manager.");
    expect(input.userMessage).toContain(samplePrompt.title_en);
    expect(input.userMessage).toContain(samplePrompt.scenario_en);
    expect(input.userMessage).toContain("60–120");
    expect(input.userMessage).toContain("Hello manager.");
    expect(input.systemPrompt).toContain("Vietnamese");
    expect(input.maxTokens).toBe(1000);
  });
});

describe("projectAiResponse", () => {
  it("caps corrections, vocabulary, grammar at the documented maxima", () => {
    const out = projectAiResponse({
      score: 90,
      summary_vi: "Tốt.",
      summary_en: "Good.",
      corrections: Array(20).fill({ original: "a", suggested: "b" }),
      vocabulary: Array(20).fill({ user_word: "x", better: "y" }),
      grammar: Array(20).fill({ snippet: "s", corrected: "c" }),
    });
    expect(out.corrections.length).toBeLessThanOrEqual(6);
    expect(out.vocabulary.length).toBeLessThanOrEqual(5);
    expect(out.grammar.length).toBeLessThanOrEqual(6);
  });
});
