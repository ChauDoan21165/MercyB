// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  cefrDistance,
  gradeWritingSample,
  handleRequest,
  projectAssessment,
  validateRequest,
  type Deps,
} from "../core";
import { buildWritingGradePrompt } from "../../_shared/cefr/promptBuilder";
import {
  CEFR_LEVELS,
  CEFRSubskill,
  type CEFRAssessment,
  type CEFRLevel,
} from "../../_shared/cefr/types";
import type { FixturePromptMeta, GradeWritingRequest } from "../types";

const fixturesDir = join(
  process.cwd(),
  "supabase/functions/placement-v3-grade-writing/__tests__/fixtures",
);

const promptRows = JSON.parse(
  readFileSync(join(fixturesDir, "prompts.json"), "utf8"),
) as FixturePromptMeta[];

const fixtureFiles: Record<CEFRLevel, string> = {
  A1: "a1-response.txt",
  A2: "a2-response.txt",
  B1: "b1-response.txt",
  B2: "b2-response.txt",
  C1: "c1-response.txt",
  C2: "c2-response.txt",
};

function fixtureRequest(meta: FixturePromptMeta): GradeWritingRequest {
  return {
    promptId: meta.promptId,
    taskText: meta.taskText,
    userResponse: readFileSync(
      join(fixturesDir, fixtureFiles[meta.expectedLevel]),
      "utf8",
    ).trim(),
    userId: null,
    targetLanguage: "en",
  };
}

function mockAssessment(level: CEFRLevel, response: string): CEFRAssessment {
  const levelIndex = CEFR_LEVELS.indexOf(level);
  const grammarLevel =
    level === "A1" || level === "A2" || level === "B1"
      ? CEFR_LEVELS[Math.max(0, levelIndex - 1)]
      : level;
  const hasL1Flags = level === "A1" || level === "A2" || level === "B1";

  return {
    overall: { level, confidence: 0.86 },
    subskills: {
      [CEFRSubskill.Grammar]: {
        level: grammarLevel,
        confidence: 0.82,
        notes: "Grammar control is the limiting subskill for this sample.",
      },
      [CEFRSubskill.Vocabulary]: {
        level,
        confidence: 0.84,
        notes: "Vocabulary range fits the expected fixture band.",
      },
      [CEFRSubskill.Coherence]: {
        level,
        confidence: 0.83,
        notes: "Ideas are sequenced at the expected level.",
      },
      [CEFRSubskill.TaskAchievement]: {
        level,
        confidence: 0.85,
        notes: "The response addresses the Sunday routine prompt.",
      },
    },
    strengths: ["Responds to the prompt", "Includes concrete routine details"],
    gaps:
      level === "C1" || level === "C2"
        ? []
        : ["Improve sentence control", "Use more precise time markers"],
    l1InterferenceFlags: hasL1Flags
      ? [
          {
            pattern: level === "A1" ? "missing_articles" : "tense_aspect_confusion",
            severity: level === "A1" ? "high" : "med",
            examples: [response.split(".")[0]],
          },
        ]
      : [],
    recommendedFocusAreas:
      level === "A1"
        ? ["basic_sentence_order", "articles"]
        : ["routine_narration", "cohesion"],
  };
}

function makeDeps(meta: FixturePromptMeta, response: string): Deps {
  return {
    callAi: vi.fn().mockResolvedValue({
      ok: true,
      json: mockAssessment(meta.expectedLevel, response),
      raw: JSON.stringify(mockAssessment(meta.expectedLevel, response)),
      provider: "openai",
      model: "gpt-4o-mini",
      latencyMs: 321,
    }),
  };
}

function expectExactAssessmentShape(assessment: CEFRAssessment) {
  expect(Object.keys(assessment).sort()).toEqual([
    "gaps",
    "l1InterferenceFlags",
    "overall",
    "recommendedFocusAreas",
    "strengths",
    "subskills",
  ]);
  expect(Object.keys(assessment.overall).sort()).toEqual([
    "confidence",
    "level",
  ]);
  expect(Object.keys(assessment.subskills).sort()).toEqual([
    CEFRSubskill.Coherence,
    CEFRSubskill.Grammar,
    CEFRSubskill.TaskAchievement,
    CEFRSubskill.Vocabulary,
  ].sort());
  for (const subskill of Object.values(assessment.subskills)) {
    expect(Object.keys(subskill).sort()).toEqual([
      "confidence",
      "level",
      "notes",
    ]);
  }
}

describe("gradeWritingSample fixture calibration", () => {
  it.each(promptRows)(
    "grades $expectedLevel fixture within one CEFR level",
    async (meta) => {
      const request = fixtureRequest(meta);
      const deps = makeDeps(meta, request.userResponse);
      const result = await gradeWritingSample(request, deps);

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.error);

      expect(cefrDistance(result.assessment.overall.level, meta.expectedLevel))
        .toBeLessThanOrEqual(1);
      if (meta.expectedLevel === "A1") {
        expect(["A1", "A2"]).toContain(
          result.assessment.subskills.grammar.level,
        );
      }
      if (meta.expectedLevel === "A2") {
        expect(["A1", "A2", "B1"]).toContain(
          result.assessment.subskills.grammar.level,
        );
      }
      if (["A1", "A2", "B1"].includes(meta.expectedLevel)) {
        expect(result.assessment.l1InterferenceFlags.length).toBeGreaterThan(0);
      }
      expect(result.assessment.strengths.length).toBeGreaterThan(0);
      if (["A1", "A2", "B1", "B2"].includes(meta.expectedLevel)) {
        expect(result.assessment.gaps.length).toBeGreaterThan(0);
      }
      expectExactAssessmentShape(result.assessment);
      expect(result.modelTrace.provider).toBe("openai");
      expect(result.modelTrace.tokensInput).toBeGreaterThan(0);
      expect(result.modelTrace.tokensOutput).toBeGreaterThan(0);
    },
  );
});

describe("buildWritingGradePrompt", () => {
  it("includes CEFR rubric, schema, VN L1 interference anchors, and the learner text", () => {
    const request = fixtureRequest(promptRows[0]);
    const prompt = buildWritingGradePrompt(request);

    expect(prompt.systemPrompt).toContain("CEFR writing rubric");
    expect(prompt.systemPrompt).toContain("missing_articles");
    expect(prompt.systemPrompt).toContain("tense_aspect_confusion");
    expect(prompt.userMessage).toContain(request.taskText);
    expect(prompt.userMessage).toContain(request.userResponse);
    expect(prompt.userMessage).toContain('"overall"');
    expect(prompt.userMessage).toContain('"taskAchievement"');
  });
});

describe("projectAssessment", () => {
  it("rejects malformed AI JSON", () => {
    const result = projectAssessment({ overall: { level: "B1" } });
    expect(result.ok).toBe(false);
  });

  it("clamps confidence and caps list lengths", () => {
    const raw = mockAssessment("B1", "I go park.");
    raw.overall.confidence = 2;
    raw.strengths = ["a", "b", "c", "d", "e"];
    const result = projectAssessment(raw as unknown as Record<string, unknown>);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.confidence).toBe(1);
    expect(result.assessment.strengths).toHaveLength(4);
  });
});

describe("handleRequest", () => {
  it("returns MercyBlade standard error shape for invalid requests", async () => {
    const deps = makeDeps(promptRows[0], "");
    const res = await handleRequest(
      new Request("https://test.example.com/placement-v3-grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
      deps,
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: "promptId is required.",
      errorCode: "missing_prompt_id",
    });
  });

  it("returns 200 with assessment and modelTrace on success", async () => {
    const request = fixtureRequest(promptRows[2]);
    const deps = makeDeps(promptRows[2], request.userResponse);
    const res = await handleRequest(
      new Request("https://test.example.com/placement-v3-grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }),
      deps,
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.assessment.overall.level).toBe("B1");
    expect(body.modelTrace.model).toBe("gpt-4o-mini");
  });
});

describe("validateRequest", () => {
  it("accepts optional null userId and target language en", () => {
    const result = validateRequest(fixtureRequest(promptRows[1]));
    expect(result.ok).toBe(true);
  });

  it("rejects target languages outside the API contract", () => {
    const request = { ...fixtureRequest(promptRows[1]), targetLanguage: "fr" };
    const result = validateRequest(request);
    expect(result.ok).toBe(false);
  });
});
