// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import {
  cefrDistance,
  combineAssessment,
  gradeSpeakingSample,
  handleRequest,
  projectTranscriptAssessment,
  validateRequest,
  type Deps,
} from "../core";
import {
  CEFR_LEVELS,
  type CEFRAssessment,
  type CEFRLevel,
} from "../../_shared/cefr/types";
import type {
  GradeSpeakingRequest,
  PronunciationAssessment,
  TranscriptSubskills,
} from "../types";
import { SPEAKING_CALIBRATION_CORPUS } from "../../../../src/data/placement/v3/calibration/speaking-corpus";

const baseRequest: GradeSpeakingRequest = {
  promptId: "b2-s-opinion",
  taskText: "Explain whether students should study abroad.",
  userResponse: "I believe students should study abroad because it builds confidence and helps them understand different cultures.",
  targetLanguage: "en",
  userId: "user-1",
  audioBase64: btoa("fake wav"),
  responseDurationMs: 18_000,
};

function transcriptJson(level: CEFRLevel, flags = []) {
  return {
    overall: { level, confidence: 0.88 },
    subskills: {
      grammar: subskill(level, "Grammar control fits the transcript."),
      vocabulary: subskill(level, "Vocabulary range fits the transcript."),
      fluency: subskill(level, "Transcript shows connected spoken delivery."),
    },
    strengths: ["Answers the prompt", "Uses connected speech"],
    gaps: level === "C2" ? [] : ["Needs more precision under time pressure"],
    l1InterferenceFlags: flags,
    recommendedFocusAreas: ["spoken_fluency"],
  };
}

function subskill(level: CEFRLevel, notes: string) {
  return { level, confidence: 0.84, notes };
}

function pronunciation(score: number): PronunciationAssessment {
  const level = score >= 92 ? "C2" : score >= 84 ? "C1" : score >= 74 ? "B2" : score >= 62 ? "B1" : score >= 45 ? "A2" : "A1";
  return {
    ok: true,
    provider: "azure",
    score,
    level,
    confidence: score > 80 ? 0.88 : 0.72,
    wordScores: [
      {
        word: "think",
        heard: "think",
        score,
        status: score >= 85 ? "correct" : score >= 60 ? "close" : "wrong",
        phonemes: [
          { word: "think", phoneme: "θ", score, status: score >= 85 ? "correct" : score >= 60 ? "close" : "wrong" },
          { word: "think", phoneme: "k", score, status: score >= 85 ? "correct" : score >= 60 ? "close" : "wrong" },
        ],
      },
    ],
    phonemeScores: [
      { word: "think", phoneme: "θ", score, status: score >= 85 ? "correct" : score >= 60 ? "close" : "wrong" },
      { word: "think", phoneme: "k", score, status: score >= 85 ? "correct" : score >= 60 ? "close" : "wrong" },
    ],
    flags: score < 60
      ? [
          { pattern: "th-stopping-and-fronting", severity: "med", examples: ["think"] },
          { pattern: "final-consonant-cluster-reduction", severity: "high", examples: ["think"] },
        ]
      : [],
  };
}

function makeDeps(level: CEFRLevel, pronunciationScore = 90, flags = []): Deps {
  return {
    callAi: vi.fn().mockResolvedValue({
      ok: true,
      json: transcriptJson(level, flags),
      raw: JSON.stringify(transcriptJson(level, flags)),
      provider: "openai",
      model: "gpt-4o-mini",
      latencyMs: 250,
    }),
    scorePronunciation: vi.fn().mockResolvedValue(pronunciation(pronunciationScore)),
  };
}

describe("gradeSpeakingSample", () => {
  it.each(SPEAKING_CALIBRATION_CORPUS.slice(0, 6))(
    "grades calibration fixture $id within one CEFR level",
    async (fixture) => {
      const expected = fixture.expectedLevel as CEFRLevel;
      const deps = makeDeps(expected, 82);
      const result = await gradeSpeakingSample({
        ...baseRequest,
        promptId: fixture.promptId,
        taskText: fixture.id,
        userResponse: fixture.userResponse,
      }, deps);

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.error);
      expect(cefrDistance(result.assessment.overall.level, expected)).toBeLessThanOrEqual(1);
      expect(result.assessment.subskills).toHaveProperty("grammar");
      expect(result.assessment.subskills).toHaveProperty("vocabulary");
      expect(result.assessment.subskills).toHaveProperty("fluency");
      expect(result.assessment.subskills).toHaveProperty("pronunciation");
    },
  );

  it("combines transcript CEFR with Azure pronunciation subskill", async () => {
    const result = await gradeSpeakingSample(baseRequest, makeDeps("B2", 91));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("B2");
    expect(result.assessment.subskills.pronunciation.level).toBe("C1");
    expect(result.pronunciation.score).toBe(91);
  });

  it("low pronunciation lowers overall CEFR despite a strong transcript", async () => {
    const good = await gradeSpeakingSample(baseRequest, makeDeps("C1", 94));
    const bad = await gradeSpeakingSample(baseRequest, makeDeps("C1", 38));

    expect(good.ok && bad.ok).toBe(true);
    if (!good.ok || !bad.ok) throw new Error("unexpected failure");
    expect(CEFR_LEVELS.indexOf(bad.assessment.overall.level)).toBeLessThan(
      CEFR_LEVELS.indexOf(good.assessment.overall.level),
    );
    expect(bad.assessment.overall.level).toBe("B2");
  });

  it("does not collapse transcript CEFR when Azure pronunciation is unavailable", async () => {
    const deps = makeDeps("B2", 90);
    deps.scorePronunciation = vi.fn().mockResolvedValue({
      ok: false,
      provider: "azure",
      score: 0,
      level: "A1",
      confidence: 0,
      wordScores: [],
      phonemeScores: [],
      flags: [],
      rawReason: "azure_phoneme_timeout",
    } satisfies PronunciationAssessment);

    const result = await gradeSpeakingSample(baseRequest, deps);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("B2");
    expect(result.assessment.overall.confidence).toBeLessThan(0.88);
    expect(result.assessment.gaps).toContain("Pronunciation evidence is unavailable; retry audio scoring.");
  });

  it("keeps low-confidence phoneme data as feedback without lowering overall CEFR", async () => {
    const deps = makeDeps("B2", 90);
    deps.scorePronunciation = vi.fn().mockResolvedValue({
      ...pronunciation(30),
      confidence: 0.2,
    } satisfies PronunciationAssessment);

    const result = await gradeSpeakingSample(baseRequest, deps);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("B2");
    expect(result.assessment.subskills.pronunciation.level).toBe("A1");
    expect(result.assessment.subskills.pronunciation.notes).toContain("Evidence confidence is low");
    expect(result.assessment.gaps).toContain("Pronunciation evidence was low confidence; retry audio scoring for a firmer estimate.");
  });

  it("keeps transcript CEFR primary when malformed Azure evidence is low-confidence", async () => {
    const deps = makeDeps("C1", 90);
    deps.scorePronunciation = vi.fn().mockResolvedValue({
      ok: true,
      provider: "azure",
      score: 0,
      level: "A1",
      confidence: 0.2,
      wordScores: [],
      phonemeScores: [],
      flags: [],
      rawReason: "azure_phoneme_missing_score_and_phonemes",
    } satisfies PronunciationAssessment);

    const result = await gradeSpeakingSample(baseRequest, deps);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("C1");
    expect(result.assessment.subskills.pronunciation.level).toBe("A1");
    expect(result.assessment.subskills.pronunciation.notes).toContain("Evidence confidence is low");
  });

  it("bounds usable pronunciation influence to one CEFR level below a strong transcript", async () => {
    const result = await gradeSpeakingSample(baseRequest, makeDeps("C2", 20));

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("C1");
  });

  it("surfaces VN L1 phoneme flags in the combined CEFRAssessment", async () => {
    const result = await gradeSpeakingSample(baseRequest, makeDeps("B2", 42));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.l1InterferenceFlags.map((flag) => flag.pattern)).toEqual(
      expect.arrayContaining([
        "th-stopping-and-fronting",
        "final-consonant-cluster-reduction",
      ]),
    );
  });

  it("returns ai_unavailable when transcript grading is unavailable", async () => {
    const deps = makeDeps("B1");
    deps.callAi = vi.fn().mockResolvedValue({
      ok: false,
      json: {},
      raw: "",
      provider: "none",
      model: "",
      latencyMs: 0,
    });
    const result = await gradeSpeakingSample(baseRequest, deps);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unexpected success");
    expect(result.errorCode).toBe("ai_unavailable");
    expect(result.modelTrace).toMatchObject({
      provider: "none",
      model: "gpt-4o-mini",
      latencyMs: 0,
      fallback: true,
      errorCode: "ai_unavailable",
    });
  });

  it("rejects malformed AI subskill JSON", async () => {
    const deps = makeDeps("B1");
    deps.callAi = vi.fn().mockResolvedValue({
      ok: true,
      json: { overall: { level: "B1" }, subskills: {} },
      raw: "{}",
      provider: "openai",
      model: "gpt-4o-mini",
      latencyMs: 1,
    });
    const result = await gradeSpeakingSample(baseRequest, deps);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unexpected success");
    expect(result.errorCode).toBe("invalid_ai_response");
    expect(result.modelTrace).toMatchObject({
      provider: "openai",
      model: "gpt-4o-mini",
      latencyMs: 1,
      fallback: true,
      errorCode: "invalid_ai_response",
    });
  });

  it("normalizes partial speaking provider metadata without changing scores", async () => {
    const deps = makeDeps("B1", 80);
    deps.callAi = vi.fn().mockResolvedValue({
      ok: true,
      json: transcriptJson("B1"),
      raw: JSON.stringify(transcriptJson("B1")),
      provider: "gemini",
      model: "",
      latencyMs: -12,
    });

    const result = await gradeSpeakingSample(baseRequest, deps);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.assessment.overall.level).toBe("B1");
    expect(result.modelTrace).toMatchObject({
      provider: "gemini",
      model: "gpt-4o-mini",
      latencyMs: 0,
      tokensInput: expect.any(Number),
      tokensOutput: expect.any(Number),
    });
  });
});

describe("projectTranscriptAssessment", () => {
  it("projects transcript-only grammar, vocabulary, and fluency subskills", () => {
    const result = projectTranscriptAssessment(transcriptJson("B1"));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(Object.keys(result.assessment.subskills).sort()).toEqual([
      "fluency",
      "grammar",
      "vocabulary",
    ]);
  });

  it("rejects invalid CEFR levels", () => {
    const result = projectTranscriptAssessment(transcriptJson("B1") as unknown as Record<string, unknown>);
    (result.ok && (result.assessment.level = "Z9" as CEFRLevel));
    expect(projectTranscriptAssessment({ overall: { level: "Z9" }, subskills: {} }).ok).toBe(false);
  });
});

describe("combineAssessment", () => {
  it("keeps shared CEFR compatibility keys while adding fluency and pronunciation", () => {
    const projected = projectTranscriptAssessment(transcriptJson("B1"));
    expect(projected.ok).toBe(true);
    if (!projected.ok) throw new Error(projected.error);
    const assessment: CEFRAssessment = combineAssessment(projected.assessment, pronunciation(72));
    expect(assessment.subskills).toHaveProperty("grammar");
    expect(assessment.subskills).toHaveProperty("vocabulary");
    expect(assessment.subskills).toHaveProperty("coherence");
    expect(assessment.subskills).toHaveProperty("taskAchievement");
    expect(assessment.subskills).toHaveProperty("fluency");
    expect(assessment.subskills).toHaveProperty("pronunciation");
  });
});

describe("handleRequest and validateRequest", () => {
  it("returns standard error shape for missing audio", async () => {
    const result = validateRequest({
      promptId: "p1",
      taskText: "Speak",
      userResponse: "hello",
      targetLanguage: "en",
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unexpected success");
    expect(result.errorCode).toBe("missing_audio");
  });

  it("rejects empty transcript text before grading", () => {
    const result = validateRequest({
      promptId: "p1",
      taskText: "Speak",
      userResponse: "",
      targetLanguage: "en",
      audioBase64: btoa("fake wav"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unexpected success");
    expect(result.errorCode).toBe("invalid_response_length");
  });

  it("returns 200 with assessment, modelTrace, and pronunciation", async () => {
    const deps = makeDeps("B1", 80);
    const res = await handleRequest(
      new Request("https://test.example.com/placement-v3-grade-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baseRequest),
      }),
      deps,
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.assessment.overall.level).toBe("B1");
    expect(body.pronunciation.provider).toBe("azure");
    expect(body.modelTrace.model).toBe("gpt-4o-mini");
  });

  it("returns invalid_json for malformed request bodies", async () => {
    const res = await handleRequest(
      new Request("https://test.example.com/placement-v3-grade-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
      makeDeps("A2"),
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      ok: false,
      errorCode: "invalid_json",
    });
  });

  it("rejects unsupported methods", async () => {
    const res = await handleRequest(
      new Request("https://test.example.com/placement-v3-grade-speaking", {
        method: "GET",
      }),
      makeDeps("A2"),
    );

    expect(res.status).toBe(405);
  });
});
