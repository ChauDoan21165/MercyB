import { describe, expect, it, vi } from "vitest";
import {
  createAzureSpeakingGrader,
  createHttpWritingGrader,
  fallbackAssessment,
  gradeWithClient,
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
  });

  it("stub grader returns plausible speaking result", async () => {
    const result = await stubGrade(input({
      modality: "speaking",
      responseText: "I want to improve my pronunciation and speak clearly.",
    }));
    expect(result.ok).toBe(true);
    expect(result.version).toBe("stub-speaking-grader-v1");
  });

  it("routes speaking input through the Azure speaking grader when supplied", async () => {
    const result = await gradeWithClient(input({
      modality: "speaking",
      audioStoragePath: "validation.wav",
    }), {
      async gradeWriting() {
        throw new Error("writing path should not run");
      },
      async gradeSpeaking() {
        return {
          ok: true,
          assessment: {
            overallLevel: "B1",
            confidence: 0.8,
            metadata: { provider: "azure" },
          },
          version: "azure-speaking-pronunciation-assessment",
        };
      },
    });

    expect(result.ok).toBe(true);
    expect(result.version).toBe("azure-speaking-pronunciation-assessment");
    expect(result.assessment.metadata?.provider).toBe("azure");
  });

  it("normalizes successful Azure speaking pronunciation responses", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({
        RecognitionStatus: "Success",
        DisplayText: "I want to improve my pronunciation.",
        NBest: [
          {
            PronScore: 78,
            AccuracyScore: 80,
            FluencyScore: 72,
            CompletenessScore: 90,
            Words: [
              {
                Word: "pronunciation",
                AccuracyScore: 62,
                Phonemes: [{ Phoneme: "n", AccuracyScore: 55 }],
              },
            ],
          },
        ],
      }), { status: 200 })
    );
    const client = createAzureSpeakingGrader({
      azureKey: "key",
      fetchImpl,
      loadAudio: async () => new ArrayBuffer(44),
    });

    const result = await client.gradeSpeaking(input({
      modality: "speaking",
      audioStoragePath: "validation.wav",
      responseText: "I want to improve my pronunciation.",
    }));

    expect(result.ok).toBe(true);
    expect(result.version).toBe("azure-speaking-pronunciation-assessment");
    expect(result.assessment.overallLevel).toBe("A1");
    expect(result.assessment.metadata).toMatchObject({
      provider: "azure",
      providerPath: "placement-v3-speaking",
      fallback: false,
      pronunciationScore: 78,
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("marks Azure speaking timeouts with retryable recovery metadata", async () => {
    const fetchImpl = vi.fn((_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      })
    );
    const client = createAzureSpeakingGrader({
      azureKey: "key",
      fetchImpl,
      timeoutMs: 1,
      loadAudio: async () => new ArrayBuffer(44),
    });

    const result = await client.gradeSpeaking(input({
      modality: "speaking",
      audioStoragePath: "validation.wav",
    }));

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("timeout");
    expect(result.assessment.metadata).toMatchObject({
      fallback: true,
      errorCode: "timeout",
      providerTimeout: true,
      retryable: true,
      recoverable: true,
    });
  });

  it("fallback assessment marks low confidence", () => {
    const result = fallbackAssessment(input(), "network_error", "failed");
    expect(result.assessment.confidence).toBe(0.35);
    expect(result.assessment.metadata?.fallback).toBe(true);
  });
});
