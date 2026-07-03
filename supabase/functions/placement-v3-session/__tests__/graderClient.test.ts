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

  it("stub speaking grader treats text as first-class degraded evidence when audio is missing", async () => {
    const result = await stubGrade(input({
      modality: "speaking",
      responseText: "I want to improve pronunciation because clear speech helps my job interviews.",
      audioStoragePath: undefined,
    }));
    expect(result.ok).toBe(true);
    expect(result.assessment.confidence).toBeLessThanOrEqual(0.55);
    expect(result.assessment.confidence).toBeGreaterThan(0);
    expect(result.assessment.metadata).toMatchObject({
      speakingEvidenceStatus: "degraded_text_fallback",
      cefrEvidence: "text_fallback",
    });
    expect(result.assessment.gaps).toContain(
      "Speaking was scored from typed/transcribed text because audio evidence was unavailable.",
    );
  });

  it("stub speaking grader does not count unavailable audio as a wrong answer", async () => {
    const result = await stubGrade(input({
      modality: "speaking",
      responseText: "",
      audioStoragePath: "unplayable",
    }));
    expect(result.ok).toBe(true);
    expect(result.assessment.confidence).toBe(0);
    expect(result.assessment.metadata).toMatchObject({
      speakingEvidenceStatus: "not_counted",
      audioEvidence: "unavailable_or_unplayable",
      cefrEvidence: "none",
    });
  });

  it("fallback assessment marks low confidence", () => {
    const result = fallbackAssessment(input(), "network_error", "failed");
    expect(result.assessment.confidence).toBe(0.35);
    expect(result.assessment.metadata?.fallback).toBe(true);
  });
});
