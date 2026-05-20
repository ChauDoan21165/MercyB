import { describe, expect, it } from "vitest";

import {
  calculatePlacementAcceptanceRate,
  cefrDistance,
  clampValidationScore,
  estimatePlacementTokens,
  isPlacementAdaptiveCefrLevel,
  isPlacementAdaptiveModality,
  isPlacementAdaptiveRejectionCode,
  normalizeRejectionReason,
  validateGeneratedItemShape,
} from "../../src/types/placementAdaptiveItems";

const baseItem = {
  id: "item-1",
  modality: "reading" as const,
  targetCefr: "B1" as const,
  learnerL1: "vi",
  targetLanguage: "en",
  skillFocus: "main idea",
  difficultyConstraints: ["straightforward familiar topic"],
  title: "Bus schedule notice",
  promptText: "Read the notice and answer the question.",
  passageText: "The bus leaves at 7:30 unless it rains.",
  questionText: "When does the bus leave?",
  questionType: "short_answer" as const,
  expectedAnswer: "7:30",
  rubricDimensions: ["main_idea_grasp", "detail_extraction"],
  vietnameseL1Targets: ["preposition-selection-transfer"],
  ageBand: "13+" as const,
  estimatedResponseSeconds: 45,
  metadata: {
    batchId: "test",
    cycle: 0,
    promptVersion: "a35-v1",
    generatedAt: "2026-05-20T00:00:00.000Z",
    provider: "openai" as const,
    model: "gpt-4o-mini",
    latencyMs: 100,
    tokensInput: 10,
    tokensOutput: 10,
    estimatedCostUsd: 0.001,
  },
};

describe("placement adaptive item schemas", () => {
  it("accepts valid CEFR levels", () => {
    expect(isPlacementAdaptiveCefrLevel("A1")).toBe(true);
    expect(isPlacementAdaptiveCefrLevel("C2")).toBe(true);
  });

  it("rejects invalid CEFR levels", () => {
    expect(isPlacementAdaptiveCefrLevel("B3")).toBe(false);
  });

  it("accepts supported modalities", () => {
    expect(isPlacementAdaptiveModality("reading")).toBe(true);
    expect(isPlacementAdaptiveModality("speaking")).toBe(true);
  });

  it("rejects unsupported modalities", () => {
    expect(isPlacementAdaptiveModality("conversation")).toBe(false);
  });

  it("accepts known rejection codes", () => {
    expect(isPlacementAdaptiveRejectionCode("too_easy")).toBe(true);
  });

  it("rejects unknown rejection codes", () => {
    expect(isPlacementAdaptiveRejectionCode("too_generic")).toBe(false);
  });

  it("calculates CEFR distance", () => {
    expect(cefrDistance("A1", "B1")).toBe(2);
  });

  it("clamps high validation scores", () => {
    expect(clampValidationScore(2)).toBe(1);
  });

  it("clamps low validation scores", () => {
    expect(clampValidationScore(-1)).toBe(0);
  });

  it("estimates tokens for non-empty text", () => {
    expect(estimatePlacementTokens("abcd efgh")).toBeGreaterThan(0);
  });

  it("returns zero acceptance rate when no validations exist", () => {
    expect(calculatePlacementAcceptanceRate(1, 0)).toBe(0);
  });

  it("calculates acceptance rate to four decimals", () => {
    expect(calculatePlacementAcceptanceRate(1, 3)).toBe(0.3333);
  });

  it("normalizes malformed rejection reasons", () => {
    expect(normalizeRejectionReason({ code: "unknown" as never }).code).toBe("malformed");
  });

  it("validates a complete reading item", () => {
    expect(validateGeneratedItemShape(baseItem)).toEqual([]);
  });

  it("requires reading answer fields", () => {
    const errors = validateGeneratedItemShape({ ...baseItem, expectedAnswer: "" });
    expect(errors).toContain("reading items require passageText, questionText, and expectedAnswer");
  });

  it("requires listening transcript fields", () => {
    const errors = validateGeneratedItemShape({
      ...baseItem,
      modality: "listening",
      passageText: undefined,
      audioTranscript: "",
    });
    expect(errors).toContain(
      "listening items require audioTranscript, questionText, and expectedAnswer",
    );
  });

  it("requires speaking open response", () => {
    const errors = validateGeneratedItemShape({
      ...baseItem,
      modality: "speaking",
      questionType: "short_answer",
      passageText: undefined,
    });
    expect(errors).toContain("speaking items must use open_response");
  });

  it("requires Vietnamese L1 targets", () => {
    const errors = validateGeneratedItemShape({ ...baseItem, vietnameseL1Targets: [] });
    expect(errors).toContain("vietnameseL1Targets must not be empty");
  });
});
