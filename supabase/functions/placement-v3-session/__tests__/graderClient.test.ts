import { describe, expect, it, vi } from "vitest";
import {
  createHttpWritingGrader,
  fallbackAssessment,
  stubGrade,
} from "../graderClient.ts";
import type { GraderInput } from "../types.ts";
import { FIRST_PROMPT } from "./fixtures/mock-sessions.ts";

function input(overrides: Partial<GraderInput> = {}): GraderInput {
  return {
    userId: "user-1",
    sessionId: "session-1",
    modality: "writing",
    prompt: FIRST_PROMPT,
    responseText: "I study English because it helps my work.",
    ...overrides,
  };
}

describe("placement v3 grader client", () => {
  it("returns assessment from successful writing grader call", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        version: "real",
        assessment: { overallLevel: "B1", confidence: 0.88 },
      }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });
    const result = await client.gradeWriting(input());
    expect(result.ok).toBe(true);
    expect(result.assessment.overallLevel).toBe("B1");
    expect(fetchImpl).toHaveBeenCalledOnce();
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1]?.body));
    expect(body).toMatchObject({
      promptId: FIRST_PROMPT.id,
      taskText: FIRST_PROMPT.promptText,
      userResponse: "I study English because it helps my work.",
      targetLanguage: "en",
    });
  });

  it("normalizes the actual writing grader CEFR shape", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        ok: true,
        modelTrace: { provider: "openai", model: "gpt-test" },
        assessment: {
          overall: { level: "B2", confidence: 0.77 },
          subskills: {
            grammar: { level: "B1", confidence: 0.7, notes: "article errors" },
          },
          strengths: ["clear organization"],
          gaps: ["articles"],
          l1InterferenceFlags: [
            { pattern: "article_omission", severity: "med", examples: ["missing a"] },
          ],
          recommendedFocusAreas: ["article control"],
        },
      }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });
    const result = await client.gradeWriting(input());
    expect(result.ok).toBe(true);
    expect(result.version).toBe("openai:gpt-test");
    expect(result.providerTrace).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      provider: "openai",
      model: "gpt-test",
      fallback: false,
    });
    expect(result.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      provider: "openai",
      model: "gpt-test",
      fallback: false,
    });
    expect(result.assessment).toMatchObject({
      overallLevel: "B2",
      confidence: 0.77,
      criteria: { grammar: { level: "B1", score: 0.7, evidence: "article errors" } },
      l1InterferenceFlags: [
        { patternId: "article_omission", severity: "medium", evidence: "missing a" },
      ],
    });
    expect(result.assessment.gaps).toContain("article control");
  });

  it("persists partial writing provider metadata with safe unknown defaults", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        ok: true,
        modelTrace: { provider: "openai" },
        assessment: { overallLevel: "B1", confidence: 0.8 },
      }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "super-secret-service-role-key",
      fetchImpl,
    });

    const result = await client.gradeWriting(input());

    expect(result.ok).toBe(true);
    expect(result.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      provider: "openai",
      model: "unknown",
      latencyMs: expect.any(Number),
      tokensInput: null,
      tokensOutput: null,
      fallback: false,
    });
    expect(JSON.stringify(result.assessment.metadata)).not.toContain("super-secret-service-role-key");
  });

  it("handles malformed JSON shape with fallback", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ bad: true }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });
    const result = await client.gradeWriting(input());
    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("malformed_json");
    expect(result.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      provider: "none",
      model: "unknown",
      fallback: true,
      errorCode: "malformed_json",
      httpStatus: 200,
    });
  });

  it("handles grader timeout with fallback", async () => {
    const fetchImpl = vi.fn((_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
      timeoutMs: 1,
    });
    const result = await client.gradeWriting(input());
    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("timeout");
    expect(result.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      provider: "none",
      model: "unknown",
      latencyMs: expect.any(Number),
      fallback: true,
      errorCode: "timeout",
    });
  });

  it("handles rate limit with fallback", async () => {
    const fetchImpl = vi.fn(async () => new Response("no", { status: 429 }));
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });
    const result = await client.gradeWriting(input());
    expect(result.errorCode).toBe("rate_limited");
    expect(result.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-writing",
      httpStatus: 429,
      fallback: true,
    });
  });

  it("calls the real speaking grader with transcript and audio path", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        ok: true,
        modelTrace: { provider: "openai", model: "gpt-speaking" },
        pronunciation: { provider: "azure", score: 58 },
        assessment: {
          overall: { level: "A2", confidence: 0.72 },
          subskills: {
            grammar: { level: "B2", confidence: 0.8, notes: "strong transcript grammar" },
            pronunciation: { level: "A2", confidence: 0.7, notes: "low phoneme accuracy" },
          },
          strengths: ["clear ideas"],
          gaps: ["final consonants"],
          l1InterferenceFlags: [
            { pattern: "final-consonant-cluster-reduction", severity: "high", examples: ["think"] },
          ],
          recommendedFocusAreas: ["vn_l1_pronunciation_patterns"],
        },
      }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });

    const result = await client.gradeSpeaking?.(input({
      modality: "speaking",
      authToken: "learner-jwt",
      audioStoragePath: "placement-audio/session-1/answer.wav",
      responseDurationMs: 18_000,
      responseText: "I think studying abroad is useful.",
    }));

    expect(result?.ok).toBe(true);
    expect(result?.assessment.overallLevel).toBe("A2");
    expect(result?.assessment.metadata).toMatchObject({
      gradingPath: "placement-v3-grade-speaking",
      provider: "openai",
      model: "gpt-speaking",
      tokensInput: null,
      tokensOutput: null,
      pronunciation: { provider: "azure", score: 58 },
      fallback: false,
    });
    expect(result?.version).toBe("openai:gpt-speaking:azure-phoneme");
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(String(fetchImpl.mock.calls[0][0])).toContain("placement-v3-grade-speaking");
    expect(fetchImpl.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer learner-jwt",
      apikey: "key",
    });
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1]?.body));
    expect(body).toMatchObject({
      promptId: FIRST_PROMPT.id,
      userResponse: "I think studying abroad is useful.",
      audioStoragePath: "placement-audio/session-1/answer.wav",
      responseDurationMs: 18_000,
    });
  });

  it("speaking grader requires learner JWT before calling the provider path", async () => {
    const fetchImpl = vi.fn(async () => new Response("no", { status: 200 }));
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });

    const result = await client.gradeSpeaking?.(input({
      modality: "speaking",
      audioStoragePath: "placement-audio/session-1/answer.wav",
      responseText: "I think studying abroad is useful.",
    }));

    expect(result?.ok).toBe(false);
    expect(result?.errorCode).toBe("missing_learner_jwt");
    expect(result?.version).toBe("fallback-speaking-grader-v1");
    expect(result?.assessment.metadata).toMatchObject({
      fallback: true,
      gradingPath: "placement-v3-grade-speaking",
      provider: "none",
      model: "unknown",
      latencyMs: null,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("speaking grader falls back safely on malformed provider JSON while forwarding learner JWT", async () => {
    const fetchImpl = vi.fn(async () => new Response("{", { status: 200 }));
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });

    const result = await client.gradeSpeaking?.(input({
      modality: "speaking",
      authToken: "learner-jwt",
      audioStoragePath: "placement-audio/session-1/answer.wav",
      responseText: "I think studying abroad is useful.",
    }));

    expect(result?.ok).toBe(false);
    expect(result?.errorCode).toBe("malformed_json");
    expect(result?.assessment.metadata).toMatchObject({
      fallback: true,
      gradingPath: "placement-v3-grade-speaking",
      errorCode: "malformed_json",
      httpStatus: 200,
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer learner-jwt",
      apikey: "key",
    });
  });

  it("speaking grader fallback preserves the real grader path", async () => {
    const fetchImpl = vi.fn(async () => new Response("no", { status: 500 }));
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });

    const result = await client.gradeSpeaking?.(input({
      modality: "speaking",
      authToken: "learner-jwt",
      audioStoragePath: "placement-audio/session-1/answer.wav",
      responseText: "I think studying abroad is useful.",
    }));

    expect(result?.ok).toBe(false);
    expect(result?.errorCode).toBe("http_error");
    expect(result?.version).toBe("fallback-speaking-grader-v1");
    expect(result?.assessment.metadata).toMatchObject({
      fallback: true,
      gradingPath: "placement-v3-grade-speaking",
      httpStatus: 500,
    });
  });

  it("conversation grading persists provider metadata defaults", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        assessment: {
          cefr: "B1",
          confidence: 0.74,
          strengths: ["keeps the conversation going"],
          gaps: ["past tense"],
        },
      }), { status: 200 })
    );
    const client = createHttpWritingGrader({
      functionBaseUrl: "https://example.supabase.co/functions/v1",
      serviceRoleKey: "key",
      fetchImpl,
    });

    const result = await client.gradeConversation?.(input({
      modality: "conversation",
      responseText: "I like learning English because I can talk with customers.",
    }));

    expect(result?.ok).toBe(true);
    expect(result?.assessment.metadata).toMatchObject({
      source: "placement-v3-mercy-conversation",
      gradingPath: "placement-v3-mercy-conversation",
      provider: "unknown",
      model: "unknown",
      latencyMs: expect.any(Number),
      fallback: false,
    });
  });

  it("stub grader returns plausible speaking result", async () => {
    const result = await stubGrade(input({
      modality: "speaking",
      responseText: "I want to improve my pronunciation and speak clearly.",
    }));
    expect(result.ok).toBe(true);
    expect(result.version).toBe("stub-speaking-grader-v1");
  });

  it("fallback assessment marks low confidence", () => {
    const result = fallbackAssessment(input(), "network_error", "failed");
    expect(result.assessment.confidence).toBe(0.35);
    expect(result.assessment.metadata?.fallback).toBe(true);
    expect(result.assessment.metadata?.gradingPath).toBe("placement-v3-grade-writing");
  });
});
