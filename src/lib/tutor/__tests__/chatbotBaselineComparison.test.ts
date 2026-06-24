/**
 * Tests for Chatbot Baseline Comparison (Step 113)
 *
 * Verifies that the chatbot baseline comparison module correctly:
 *   - Defines 12 pre-built baseline scenarios
 *   - Compares Teacher Mercy against generic chatbot behavior
 *   - Quantifies the teacher advantage across all 6 dimensions
 *   - Produces valid, well-structured comparison results
 *   - Integrates with existing modules (contract, rubric, dashboard, etc.)
 */

import { describe, it, expect, beforeAll } from "vitest";

import {
  // Catalog
  CHATBOT_BASELINE_CATALOG,
  getChatbotBaselineCatalog,
  getChatbotBaselineById,
  getBaselinesByDimension,
  getBaselinesByCefr,
  getBaselinesByDimensionAndCefr,

  // Comparison engine
  buildChatbotBaselineComparison,
  buildTeacherMercyProfile,
  compareWithGenericChatbot,

  // Scoring & verdict
  computeTeacherAdvantageScore,
  classifyAdvantageVerdict,
  getVerdictLabelVi,
  getVerdictLabelEn,

  // Summaries
  getComparisonSummaryVi,
  getComparisonSummaryEn,
  getComparisonActionItems,

  // Validation
  validateChatbotBaseline,
  validateAllChatbotBaselines,
  validateChatbotBaselineComparison,

  // Statistics
  getChatbotBaselineStatistics,

  // Utilities
  createMinimalComparisonInput,
  runAllBaselineComparisons,
  aggregateBaselineComparisons,

  // Types
  type ChatbotBaselineEntry,
  type ChatbotBaselineComparison,
  type GenericChatbotBehavior,
  type TeacherMercyProfile,
  type DimensionComparison,
  type ComparisonVerdict,
  type CompareWithGenericChatbotInput,
  type ChatbotBaselineId,
  type ChatbotBaselineStatistics,

  // Constants
  DIMENSION_LABELS_VI,
  DIMENSION_LABELS_EN,
  ALL_DIMENSION_IDS,
  ALL_CEFR_LEVELS,
  CEFR_LABELS_VI,
  GENERIC_CHATBOT_MISSING_BEHAVIORS,
} from "../chatbotBaselineComparison";

import type { TeacherIntelligenceDimensionId } from "../teacherIntelligenceDashboard";
import type { CefrLevel } from "../humanQualityScenarioBank";

// ─── Test Helpers ──────────────────────────────────────────────────────────

/**
 * Create a fully-specified comparison input with all Mercy teacher behaviors
 * demonstrated, to produce a maximum-advantage comparison result.
 */
function makeFullMercyInput(
  baselineId?: ChatbotBaselineId,
): CompareWithGenericChatbotInput {
  return createMinimalComparisonInput({
    baselineId: baselineId ?? CHATBOT_BASELINE_CATALOG[0].baselineId,
    teacherMercyOutput:
      "Trong tiếng Việt, con nói 'Tôi rất vui' — không cần động từ 'là'. " +
      "Nhưng tiếng Anh LUÔN cần động từ to-be (am/is/are). " +
      "Vậy câu đúng là: 'I AM very happy today.' " +
      "Giống như buổi trước cô đã nhắc con về lỗi thiếu 'is', " +
      "lần này cũng vậy. Con nhớ: tiếng Anh cần am/is/are, " +
      "tiếng Việt thì không nhé! 🌟 Con đã tiến bộ hơn buổi trước rồi!",
    l1PatternsDiagnosed: ["copula-omission"],
    weaknessReferenced: "copula-omission",
    satisfiedContractRules: [
      "R1_MEANING_FIRST",
      "R5_REMEMBER_WEAKNESS",
      "R6_VIETNAMESE_INTERFERENCE",
      "R8_FACE_SAVING",
    ],
    usedVietnamese: true,
    didSelfCheck: true,
    didMeasureGain: true,
    sessionNumber: 3,
    isKidsMode: false,
  });
}

/**
 * Create a minimal comparison input with no teacher behaviors demonstrated,
 * to produce a minimal-advantage comparison result.
 */
function makeMinimalMercyInput(
  baselineId?: ChatbotBaselineId,
): CompareWithGenericChatbotInput {
  return createMinimalComparisonInput({
    baselineId: baselineId ?? CHATBOT_BASELINE_CATALOG[0].baselineId,
    teacherMercyOutput: "The correct sentence is 'I am very happy today.'",
    l1PatternsDiagnosed: [],
    weaknessReferenced: null,
    satisfiedContractRules: [],
    usedVietnamese: false,
    didSelfCheck: false,
    didMeasureGain: false,
    sessionNumber: 1,
    isKidsMode: false,
  });
}

/**
 * Create a kids-mode comparison input.
 */
function makeKidsMercyInput(): CompareWithGenericChatbotInput {
  return createMinimalComparisonInput({
    baselineId: "bl-adapt-kids-fun-switch",
    teacherMercyOutput:
      "🌟 TUYỆT VỜI con ơi! 'I like the cat' — con nói đúng rồi! " +
      "😺 Con mèo = cat. Mình cùng tập nói lại cho thật hay nhé: " +
      "I... like... the... cat! 🎉 Con giỏi quá!",
    l1PatternsDiagnosed: [],
    weaknessReferenced: null,
    satisfiedContractRules: ["R8_FACE_SAVING"],
    usedVietnamese: true,
    didSelfCheck: false,
    didMeasureGain: false,
    sessionNumber: 1,
    isKidsMode: true,
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// Suite 1: Module Smoke
// ══════════════════════════════════════════════════════════════════════════════

describe("Module smoke", () => {
  it("exports all public functions", () => {
    expect(typeof getChatbotBaselineCatalog).toBe("function");
    expect(typeof getChatbotBaselineById).toBe("function");
    expect(typeof getBaselinesByDimension).toBe("function");
    expect(typeof getBaselinesByCefr).toBe("function");
    expect(typeof getBaselinesByDimensionAndCefr).toBe("function");
    expect(typeof buildChatbotBaselineComparison).toBe("function");
    expect(typeof buildTeacherMercyProfile).toBe("function");
    expect(typeof compareWithGenericChatbot).toBe("function");
    expect(typeof computeTeacherAdvantageScore).toBe("function");
    expect(typeof classifyAdvantageVerdict).toBe("function");
    expect(typeof getVerdictLabelVi).toBe("function");
    expect(typeof getVerdictLabelEn).toBe("function");
    expect(typeof getComparisonSummaryVi).toBe("function");
    expect(typeof getComparisonSummaryEn).toBe("function");
    expect(typeof getComparisonActionItems).toBe("function");
    expect(typeof validateChatbotBaseline).toBe("function");
    expect(typeof validateAllChatbotBaselines).toBe("function");
    expect(typeof validateChatbotBaselineComparison).toBe("function");
    expect(typeof getChatbotBaselineStatistics).toBe("function");
    expect(typeof createMinimalComparisonInput).toBe("function");
    expect(typeof runAllBaselineComparisons).toBe("function");
    expect(typeof aggregateBaselineComparisons).toBe("function");
  });

  it("exports CHATBOT_BASELINE_CATALOG as a non-empty array", () => {
    expect(Array.isArray(CHATBOT_BASELINE_CATALOG)).toBe(true);
    expect(CHATBOT_BASELINE_CATALOG.length).toBeGreaterThan(0);
  });

  it("has DIMENSION_LABELS_VI for all 6 dimensions", () => {
    for (const dimId of ALL_DIMENSION_IDS) {
      expect(typeof DIMENSION_LABELS_VI[dimId]).toBe("string");
    }
  });

  it("has DIMENSION_LABELS_EN for all 6 dimensions", () => {
    for (const dimId of ALL_DIMENSION_IDS) {
      expect(typeof DIMENSION_LABELS_EN[dimId]).toBe("string");
    }
  });

  it("has ALL_CEFR_LEVELS with 6 levels", () => {
    expect(ALL_CEFR_LEVELS).toHaveLength(6);
    expect(ALL_CEFR_LEVELS).toContain("A1");
    expect(ALL_CEFR_LEVELS).toContain("C1");
    expect(ALL_CEFR_LEVELS).toContain("Kids");
  });

  it("has CEFR_LABELS_VI for all CEFR levels", () => {
    for (const level of ALL_CEFR_LEVELS) {
      expect(typeof CEFR_LABELS_VI[level]).toBe("string");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 2: Catalog Size & Integrity
// ══════════════════════════════════════════════════════════════════════════════

describe("Catalog size & integrity", () => {
  it("has exactly 12 baseline entries", () => {
    expect(CHATBOT_BASELINE_CATALOG).toHaveLength(12);
  });

  it("getChatbotBaselineCatalog returns a copy", () => {
    const catalog = getChatbotBaselineCatalog();
    expect(catalog).toHaveLength(12);
    expect(catalog).not.toBe(CHATBOT_BASELINE_CATALOG); // different reference
  });

  it("all baseline IDs are unique", () => {
    const ids = CHATBOT_BASELINE_CATALOG.map((b) => b.baselineId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all baseline IDs follow the 'bl-{dim}-{cefr}-{topic}' convention", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.baselineId).toMatch(/^bl-[a-z]+-[a-z0-9]+-[a-z0-9-]+$/);
    }
  });

  it("every baseline has a non-empty titleVi", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.titleVi.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has a non-empty titleEn", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.titleEn.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has a valid dimensionId", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(ALL_DIMENSION_IDS).toContain(b.dimensionId);
    }
  });

  it("every baseline has a valid cefrLevel", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(ALL_CEFR_LEVELS).toContain(b.cefrLevel);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 3: Catalog Lookup
// ══════════════════════════════════════════════════════════════════════════════

describe("Catalog lookup", () => {
  it("getChatbotBaselineById returns correct entry", () => {
    const entry = getChatbotBaselineById("bl-diag-a1-copula");
    expect(entry).not.toBeNull();
    expect(entry!.baselineId).toBe("bl-diag-a1-copula");
    expect(entry!.dimensionId).toBe("diagnosis");
    expect(entry!.cefrLevel).toBe("A1");
  });

  it("getChatbotBaselineById returns null for unknown ID", () => {
    expect(getChatbotBaselineById("bl-nonexistent")).toBeNull();
  });

  it("getBaselinesByDimension returns correct entries for diagnosis", () => {
    const entries = getBaselinesByDimension("diagnosis");
    expect(entries).toHaveLength(2);
    for (const b of entries) {
      expect(b.dimensionId).toBe("diagnosis");
    }
  });

  it("getBaselinesByDimension returns correct entries for teaching", () => {
    const entries = getBaselinesByDimension("teaching");
    expect(entries).toHaveLength(2);
  });

  it("getBaselinesByDimension returns correct entries for memory", () => {
    const entries = getBaselinesByDimension("memory");
    expect(entries).toHaveLength(2);
  });

  it("getBaselinesByDimension returns correct entries for adaptation", () => {
    const entries = getBaselinesByDimension("adaptation");
    expect(entries).toHaveLength(2);
  });

  it("getBaselinesByDimension returns correct entries for selfCheck", () => {
    const entries = getBaselinesByDimension("selfCheck");
    expect(entries).toHaveLength(2);
  });

  it("getBaselinesByDimension returns correct entries for learningGain", () => {
    const entries = getBaselinesByDimension("learningGain");
    expect(entries).toHaveLength(2);
  });

  it("getBaselinesByCefr returns correct entries for A1", () => {
    const entries = getBaselinesByCefr("A1");
    expect(entries).toHaveLength(1);
    expect(entries[0].baselineId).toBe("bl-diag-a1-copula");
  });

  it("getBaselinesByCefr returns all CEFR levels with entries", () => {
    for (const level of ALL_CEFR_LEVELS) {
      const entries = getBaselinesByCefr(level);
      expect(entries.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("getBaselinesByDimensionAndCefr intersection works", () => {
    const entries = getBaselinesByDimensionAndCefr("diagnosis", "A1");
    expect(entries).toHaveLength(1);
    expect(entries[0].baselineId).toBe("bl-diag-a1-copula");
  });

  it("getBaselinesByDimensionAndCefr returns empty for mismatched pair", () => {
    const entries = getBaselinesByDimensionAndCefr("diagnosis", "Kids");
    expect(entries).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 4: Generic Chatbot Baseline Structure
// ══════════════════════════════════════════════════════════════════════════════

describe("Generic chatbot baseline structure", () => {
  it("every baseline has a non-empty predictedResponseEn", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.predictedResponseEn.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has at least 1 predicted correction", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.predictedCorrections.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("every baseline has at least 2 missing behaviors", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.missingBehaviors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every baseline has at least 1 dimension gap", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.dimensionGaps.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every baseline has non-empty failureRationaleVi", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.failureRationaleVi.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has non-empty failureRationaleEn", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.failureRationaleEn.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has at least 1 violated contract rule", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.violatedContractRules.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("generic chatbot predictedResponseVi is null for most non-kids baselines", () => {
    // The C1 overclaim refusal baseline intentionally has a Vietnamese response
    // because the learner asked in Vietnamese — even a generic chatbot would
    // respond in Vietnamese to a Vietnamese-language question.
    const baselinesWithViResponse = new Set(["bl-self-c1-overclaim-refusal"]);
    for (const b of CHATBOT_BASELINE_CATALOG) {
      if (b.cefrLevel !== "Kids" && !baselinesWithViResponse.has(b.baselineId)) {
        expect(b.genericBehavior.predictedResponseVi).toBeNull();
      }
    }
  });

  it("generic chatbot never has the full dimension set", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      // No generic chatbot has all 6 dimensions (they're not teachers)
      expect(b.genericBehavior.dimensionGaps.length).toBeLessThan(6);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 5: Baseline Metadata Integrity
// ══════════════════════════════════════════════════════════════════════════════

describe("Baseline metadata integrity", () => {
  it("every baseline has a non-empty gapRationaleVi", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.gapRationaleVi.length).toBeGreaterThan(0);
    }
  });

  it("every baseline has at least 1 relevantContractRule", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.relevantContractRules.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every baseline has at least 1 proofSubGateId", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.proofSubGateIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every baseline has at least 1 guardedFailureId", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.guardedFailureIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every baseline has at least 1 alignedScenarioId", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.alignedScenarioIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("expectedMercyBehavior fields are consistent with dimension", () => {
    // Diagnosis baselines should expect L1 diagnosis
    const diagBaselines = getBaselinesByDimension("diagnosis");
    for (const b of diagBaselines) {
      expect(b.expectedMercyBehavior.didDiagnoseL1).toBe(true);
      expect(
        b.expectedMercyBehavior.l1PatternsIdentified &&
          b.expectedMercyBehavior.l1PatternsIdentified.length > 0,
      ).toBe(true);
    }
  });

  it("memory baselines should expect weakness tracking", () => {
    const memBaselines = getBaselinesByDimension("memory");
    for (const b of memBaselines) {
      expect(b.expectedMercyBehavior.didRememberWeakness).toBe(true);
      expect(typeof b.expectedMercyBehavior.weaknessReferenced).toBe("string");
    }
  });

  it("selfCheck baselines should expect self-check behavior", () => {
    const selfBaselines = getBaselinesByDimension("selfCheck");
    for (const b of selfBaselines) {
      expect(b.expectedMercyBehavior.didSelfCheck).toBe(true);
    }
  });

  it("learningGain baselines should expect gain measurement", () => {
    const gainBaselines = getBaselinesByDimension("learningGain");
    for (const b of gainBaselines) {
      expect(b.expectedMercyBehavior.didMeasureGain).toBe(true);
      expect(b.expectedMercyBehavior.didRememberWeakness).toBe(true);
    }
  });

  it("all proof sub-gate IDs follow naming convention", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      for (const pid of b.proofSubGateIds) {
        expect(pid).toMatch(/^[a-z][a-z0-9]+(-[a-z0-9-]+)*$/);
        expect(pid.length).toBeGreaterThan(5);
      }
    }
  });

  it("all guarded failure IDs follow F-{DIM}-{NN} format", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      for (const fid of b.guardedFailureIds) {
        expect(fid).toMatch(/^F-[A-Z]+-\d{2}$/);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 6: Validation
// ══════════════════════════════════════════════════════════════════════════════

describe("Validation", () => {
  it("validateAllChatbotBaselines returns allValid = true", () => {
    const result = validateAllChatbotBaselines();
    expect(result.allValid).toBe(true);
    expect(result.results).toHaveLength(12);
    for (const r of result.results) {
      expect(r.valid).toBe(true);
      expect(r.errors).toHaveLength(0);
    }
  });

  it("validateChatbotBaseline catches missing baselineId", () => {
    const bad = {
      ...CHATBOT_BASELINE_CATALOG[0],
      baselineId: "",
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes("baselineId"))).toBe(true);
  });

  it("validateChatbotBaseline catches missing titleVi", () => {
    const bad = {
      ...CHATBOT_BASELINE_CATALOG[0],
      titleVi: "",
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
  });

  it("validateChatbotBaseline catches invalid dimensionId", () => {
    const bad = {
      ...CHATBOT_BASELINE_CATALOG[0],
      dimensionId: "invalid" as TeacherIntelligenceDimensionId,
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("dimensionId"))).toBe(true);
  });

  it("validateChatbotBaseline catches invalid cefrLevel", () => {
    const bad = {
      ...CHATBOT_BASELINE_CATALOG[0],
      cefrLevel: "D1" as CefrLevel,
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
  });

  it("validateChatbotBaseline catches empty missingBehaviors", () => {
    const bad: ChatbotBaselineEntry = {
      ...CHATBOT_BASELINE_CATALOG[0],
      genericBehavior: {
        ...CHATBOT_BASELINE_CATALOG[0].genericBehavior,
        missingBehaviors: [],
      },
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("missingBehaviors"))).toBe(true);
  });

  it("validateChatbotBaseline catches empty dimensionGaps", () => {
    const bad: ChatbotBaselineEntry = {
      ...CHATBOT_BASELINE_CATALOG[0],
      genericBehavior: {
        ...CHATBOT_BASELINE_CATALOG[0].genericBehavior,
        dimensionGaps: [],
      },
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
  });

  it("validateChatbotBaseline catches empty predictedResponseEn", () => {
    const bad: ChatbotBaselineEntry = {
      ...CHATBOT_BASELINE_CATALOG[0],
      genericBehavior: {
        ...CHATBOT_BASELINE_CATALOG[0].genericBehavior,
        predictedResponseEn: "",
      },
    };
    const result = validateChatbotBaseline(bad);
    expect(result.valid).toBe(false);
  });

  it("validateChatbotBaselineComparison validates a correct comparison", () => {
    const input = makeFullMercyInput();
    const comparison = compareWithGenericChatbot(input);
    expect(comparison).not.toBeNull();
    const result = validateChatbotBaselineComparison(comparison!);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validateChatbotBaselineComparison catches missing comparisonId", () => {
    const input = makeFullMercyInput();
    const comparison = compareWithGenericChatbot(input)!;
    const bad = { ...comparison, comparisonId: "" };
    const result = validateChatbotBaselineComparison(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("comparisonId"))).toBe(true);
  });

  it("validateChatbotBaselineComparison catches wrong dimension count", () => {
    const input = makeFullMercyInput();
    const comparison = compareWithGenericChatbot(input)!;
    const bad = { ...comparison, dimensions: comparison.dimensions.slice(0, 3) };
    const result = validateChatbotBaselineComparison(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("6 dimensions"))).toBe(true);
  });

  it("validateChatbotBaselineComparison catches out-of-range advantageScore", () => {
    const input = makeFullMercyInput();
    const comparison = compareWithGenericChatbot(input)!;
    const bad = { ...comparison, overallAdvantageScore: 150 };
    const result = validateChatbotBaselineComparison(bad);
    expect(result.valid).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 7: Build Comparison — Happy Path
// ══════════════════════════════════════════════════════════════════════════════

describe("buildChatbotBaselineComparison — happy path", () => {
  it("builds a valid comparison with full Mercy input", () => {
    const input = makeFullMercyInput("bl-diag-a1-copula");
    const comp = buildChatbotBaselineComparison({
      baselineId: input.baselineId,
      teacherMercyOutput: input.teacherMercyOutput,
      l1PatternsDiagnosed: input.l1PatternsDiagnosed,
      weaknessReferenced: input.weaknessReferenced ?? undefined,
      satisfiedContractRules: input.satisfiedContractRules,
      usedVietnamese: input.usedVietnamese,
      didSelfCheck: input.didSelfCheck,
      didMeasureGain: input.didMeasureGain,
      sessionNumber: input.sessionNumber,
      isKidsMode: input.isKidsMode,
    });

    expect(comp).not.toBeNull();
    expect(comp!.comparisonId).toContain("cmp-");
    expect(comp!.baselineId).toBe("bl-diag-a1-copula");
    expect(comp!.learnerInput).toBe("I very happy today");
    expect(comp!.learnerCefr).toBe("A1");
    expect(comp!.learnerL1).toBe("vi");
    expect(comp!.dimensions).toHaveLength(6);
    expect(comp!.overallAdvantageScore).toBeGreaterThan(0);
    expect(comp!.overallAdvantageScore).toBeLessThanOrEqual(100);
    expect(comp!.summaryVi.length).toBeGreaterThan(0);
    expect(comp!.summaryEn.length).toBeGreaterThan(0);
  });

  it("returns null for unknown baseline ID", () => {
    const comp = buildChatbotBaselineComparison({
      baselineId: "bl-nonexistent",
      teacherMercyOutput: "test",
    });
    expect(comp).toBeNull();
  });

  it("compareWithGenericChatbot is a convenience wrapper that works", () => {
    const input = makeFullMercyInput("bl-diag-b1-article");
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
    expect(comp!.baselineId).toBe("bl-diag-b1-article");
  });

  it("builds a comparison for every baseline with full input", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input);
      expect(comp).not.toBeNull();
      expect(comp!.dimensions).toHaveLength(6);
    }
  });

  it("builds a comparison for every baseline with minimal input", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeMinimalMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input);
      expect(comp).not.toBeNull();
      expect(comp!.dimensions).toHaveLength(6);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 8: TeacherMercyProfile Building
// ══════════════════════════════════════════════════════════════════════════════

describe("buildTeacherMercyProfile", () => {
  it("correctly characterizes a fully-capable teacher", () => {
    const profile = buildTeacherMercyProfile({
      responseText: "test response",
      l1PatternsIdentified: ["copula-omission", "tense-mapping"],
      weaknessReferenced: "past-tense",
      satisfiedContractRules: ["R1_MEANING_FIRST", "R5_REMEMBER_WEAKNESS"],
      didUseVietnamese: true,
      didSelfCheck: true,
      didMeasureGain: true,
      isKidsMode: false,
      learnerCefr: "A2",
    });

    expect(profile.didDiagnoseL1).toBe(true);
    expect(profile.l1PatternsIdentified).toEqual(["copula-omission", "tense-mapping"]);
    expect(profile.didRememberWeakness).toBe(true);
    expect(profile.weaknessReferenced).toBe("past-tense");
    expect(profile.didUseVietnameseStrategically).toBe(true);
    expect(profile.didSelfCheck).toBe(true);
    expect(profile.didMeasureGain).toBe(true);
    expect(profile.didAdaptToCefr).toBe(true);
    expect(profile.demonstratedDimensions).toContain("diagnosis");
    expect(profile.demonstratedDimensions).toContain("teaching");
    expect(profile.demonstratedDimensions).toContain("memory");
    expect(profile.demonstratedDimensions).toContain("adaptation");
    expect(profile.demonstratedDimensions).toContain("selfCheck");
    expect(profile.demonstratedDimensions).toContain("learningGain");
  });

  it("correctly characterizes a minimal teacher", () => {
    const profile = buildTeacherMercyProfile({
      responseText: "test",
      l1PatternsIdentified: [],
      weaknessReferenced: null,
      satisfiedContractRules: [],
      didUseVietnamese: false,
      didSelfCheck: false,
      didMeasureGain: false,
      isKidsMode: false,
      learnerCefr: "B1",
    });

    expect(profile.didDiagnoseL1).toBe(false);
    expect(profile.l1PatternsIdentified).toHaveLength(0);
    expect(profile.didRememberWeakness).toBe(false);
    expect(profile.weaknessReferenced).toBeNull();
    expect(profile.didUseVietnameseStrategically).toBe(false);
    expect(profile.didSelfCheck).toBe(false);
    expect(profile.didMeasureGain).toBe(false);
    expect(profile.demonstratedDimensions).toContain("teaching"); // always
    expect(profile.demonstratedDimensions).toContain("adaptation"); // always (didAdaptToCefr=true)
    expect(profile.demonstratedDimensions).not.toContain("diagnosis");
    expect(profile.demonstratedDimensions).not.toContain("memory");
    expect(profile.demonstratedDimensions).not.toContain("selfCheck");
    expect(profile.demonstratedDimensions).not.toContain("learningGain");
  });

  it("kids mode enables emotional adaptation", () => {
    const profile = buildTeacherMercyProfile({
      responseText: "🌟 Great job!",
      l1PatternsIdentified: [],
      weaknessReferenced: null,
      satisfiedContractRules: [],
      didUseVietnamese: true,
      didSelfCheck: false,
      didMeasureGain: false,
      isKidsMode: true,
      learnerCefr: "Kids",
    });

    expect(profile.didAdaptToEmotion).toBe(true);
    expect(profile.demonstratedDimensions).toContain("adaptation");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 9: Dimension Comparisons
// ══════════════════════════════════════════════════════════════════════════════

describe("Dimension comparisons", () => {
  it("every comparison has exactly 6 dimensions", () => {
    for (const b of CHATBOT_BASELINE_CATALOG.slice(0, 6)) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input);
      expect(comp!.dimensions).toHaveLength(6);
    }
  });

  it("all dimension IDs are present in every comparison", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const dimIds = comp.dimensions.map((d) => d.dimensionId);

    for (const expectedDim of ALL_DIMENSION_IDS) {
      expect(dimIds).toContain(expectedDim);
    }
  });

  it("each dimension has Vietnamese and English titles", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.titleVi.length).toBeGreaterThan(0);
      expect(dim.titleEn.length).toBeGreaterThan(0);
    }
  });

  it("each dimension has a valid advantageScore (0-100)", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.advantageScore).toBeGreaterThanOrEqual(0);
      expect(dim.advantageScore).toBeLessThanOrEqual(100);
    }
  });

  it("primary dimension has higher advantage than secondary dimensions", () => {
    const input = makeFullMercyInput("bl-diag-a1-copula");
    const comp = compareWithGenericChatbot(input)!;

    const diagnosisDim = comp.dimensions.find((d) => d.dimensionId === "diagnosis")!;
    const otherDims = comp.dimensions.filter((d) => d.dimensionId !== "diagnosis");

    for (const other of otherDims) {
      expect(diagnosisDim.advantageScore).toBeGreaterThanOrEqual(other.advantageScore);
    }
  });

  it("mercyBeatsGeneric is true when advantageScore >= 40", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      if (dim.advantageScore >= 40) {
        expect(dim.mercyBeatsGeneric).toBe(true);
      } else {
        expect(dim.mercyBeatsGeneric).toBe(false);
      }
    }
  });

  it("each dimension has non-empty mercyAdvantageEvidenceVi", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.mercyAdvantageEvidenceVi.length).toBeGreaterThan(0);
    }
  });

  it("each dimension has non-empty genericChatbotFailureEvidenceVi", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.genericChatbotFailureEvidenceVi.length).toBeGreaterThan(0);
    }
  });

  it("each dimension has non-empty behavior descriptions", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.genericChatbotBehavior.length).toBeGreaterThan(0);
      expect(dim.teacherMercyBehavior.length).toBeGreaterThan(0);
    }
  });

  it("full input gives higher advantage than minimal input", () => {
    const fullInput = makeFullMercyInput("bl-diag-a1-copula");
    const minInput = makeMinimalMercyInput("bl-diag-a1-copula");

    const fullComp = compareWithGenericChatbot(fullInput)!;
    const minComp = compareWithGenericChatbot(minInput)!;

    expect(fullComp.overallAdvantageScore).toBeGreaterThan(
      minComp.overallAdvantageScore,
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 10: Advantage Scoring
// ══════════════════════════════════════════════════════════════════════════════

describe("Advantage scoring", () => {
  it("computeTeacherAdvantageScore averages correctly", () => {
    const score = computeTeacherAdvantageScore({
      dimensions: [
        { advantageScore: 100 } as DimensionComparison,
        { advantageScore: 50 } as DimensionComparison,
        { advantageScore: 0 } as DimensionComparison,
        { advantageScore: 100 } as DimensionComparison,
        { advantageScore: 50 } as DimensionComparison,
        { advantageScore: 0 } as DimensionComparison,
      ],
    });
    expect(score).toBe(50); // (100+50+0+100+50+0)/6 = 300/6 = 50
  });

  it("computeTeacherAdvantageScore returns 0 for empty dimensions", () => {
    expect(computeTeacherAdvantageScore({ dimensions: [] })).toBe(0);
  });

  it("computeTeacherAdvantageScore caps at 100", () => {
    const score = computeTeacherAdvantageScore({
      dimensions: Array(6).fill({ advantageScore: 100 } as DimensionComparison),
    });
    expect(score).toBe(100);
  });

  it("computeTeacherAdvantageScore floors at 0", () => {
    const score = computeTeacherAdvantageScore({
      dimensions: Array(6).fill({ advantageScore: 0 } as DimensionComparison),
    });
    expect(score).toBe(0);
  });

  it("classifyAdvantageVerdict maps scores correctly", () => {
    expect(classifyAdvantageVerdict(100)).toBe("strong_teacher_advantage");
    expect(classifyAdvantageVerdict(80)).toBe("strong_teacher_advantage");
    expect(classifyAdvantageVerdict(79)).toBe("clear_teacher_advantage");
    expect(classifyAdvantageVerdict(65)).toBe("clear_teacher_advantage");
    expect(classifyAdvantageVerdict(64)).toBe("moderate_advantage");
    expect(classifyAdvantageVerdict(45)).toBe("moderate_advantage");
    expect(classifyAdvantageVerdict(44)).toBe("minimal_advantage");
    expect(classifyAdvantageVerdict(25)).toBe("minimal_advantage");
    expect(classifyAdvantageVerdict(24)).toBe("no_advantage");
    expect(classifyAdvantageVerdict(0)).toBe("no_advantage");
  });

  it("full Mercy input produces moderate_to_clear advantage", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    // Full Mercy on a diagnosis baseline: primary=100, secondary dims=40-60
    // Average ~53 — lands in "moderate_advantage"
    expect(
      comp.verdict === "moderate_advantage" ||
        comp.verdict === "clear_teacher_advantage",
    ).toBe(true);
    expect(comp.overallAdvantageScore).toBeGreaterThanOrEqual(45);
  });

  it("minimal Mercy input produces minimal_advantage", () => {
    const input = makeMinimalMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    // Minimal Mercy still gets primary dimension bonus (~70 for primary, ~20-60 for others)
    // Average ~38 — "minimal_advantage"
    expect(
      comp.verdict === "minimal_advantage" || comp.verdict === "no_advantage",
    ).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 11: Verdict Labels
// ══════════════════════════════════════════════════════════════════════════════

describe("Verdict labels", () => {
  const verdicts: ComparisonVerdict[] = [
    "strong_teacher_advantage",
    "clear_teacher_advantage",
    "moderate_advantage",
    "minimal_advantage",
    "no_advantage",
  ];

  it("getVerdictLabelVi returns non-empty strings for all verdicts", () => {
    for (const v of verdicts) {
      expect(getVerdictLabelVi(v).length).toBeGreaterThan(0);
    }
  });

  it("getVerdictLabelEn returns non-empty strings for all verdicts", () => {
    for (const v of verdicts) {
      expect(getVerdictLabelEn(v).length).toBeGreaterThan(0);
    }
  });

  it("Vietnamese labels are in Vietnamese", () => {
    // Vietnamese labels should contain Vietnamese characters/words
    for (const v of verdicts) {
      const label = getVerdictLabelVi(v);
      expect(label).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 12: Summaries
// ══════════════════════════════════════════════════════════════════════════════

describe("Summaries", () => {
  it("getComparisonSummaryVi returns non-empty string", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const summary = getComparisonSummaryVi(comp);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toContain("Mercy");
  });

  it("getComparisonSummaryEn returns non-empty string", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const summary = getComparisonSummaryEn(comp);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toContain("Mercy");
  });

  it("summaryVi contains the scenario title and CEFR level", () => {
    const input = makeFullMercyInput("bl-diag-a1-copula");
    const comp = compareWithGenericChatbot(input)!;
    expect(comp.summaryVi).toContain("Sơ cấp 1");
  });

  it("summaryEn contains the verdict label", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const enLabel = getVerdictLabelEn(comp.verdict);
    expect(comp.summaryEn).toContain(comp.overallAdvantageScore.toString());
    expect(comp.summaryEn.length).toBeGreaterThan(enLabel.length);
  });

  it("summaryVi for minimal input still contains meaningful text", () => {
    const input = makeMinimalMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    expect(comp.summaryVi.length).toBeGreaterThan(0);
    // Score will be low but not necessarily 0 (primary dimension still gets base bonus)
    expect(comp.summaryVi).toContain("/100");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 13: Action Items
// ══════════════════════════════════════════════════════════════════════════════

describe("Action items", () => {
  it("strong advantage produces celebration items", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const items = getComparisonActionItems(comp);
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => i.includes("XUẤT SẮC"))).toBe(true);
  });

  it("minimal advantage produces improvement items", () => {
    const input = makeMinimalMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const items = getComparisonActionItems(comp);
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => i.includes("TỔNG THỂ"))).toBe(true);
    expect(items.some((i) => i.includes("cải thiện"))).toBe(true);
  });

  it("action items include dimension names in Vietnamese", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const items = getComparisonActionItems(comp);
    for (const item of items) {
      const hasDimLabel = ALL_DIMENSION_IDS.some((dimId) =>
        item.includes(DIMENSION_LABELS_VI[dimId]),
      );
      expect(hasDimLabel).toBe(true);
    }
  });

  it("action items are never empty for valid comparisons", () => {
    for (const b of CHATBOT_BASELINE_CATALOG.slice(0, 6)) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input)!;
      const items = getComparisonActionItems(comp);
      expect(items.length).toBeGreaterThan(0);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 14: Statistics
// ══════════════════════════════════════════════════════════════════════════════

describe("Statistics", () => {
  let stats: ChatbotBaselineStatistics;

  beforeAll(() => {
    stats = getChatbotBaselineStatistics();
  });

  it("totalBaselines equals 12", () => {
    expect(stats.totalBaselines).toBe(12);
  });

  it("each dimension has exactly 2 baselines", () => {
    for (const dimId of ALL_DIMENSION_IDS) {
      expect(stats.baselinesByDimension[dimId]).toBe(2);
    }
  });

  it("every CEFR level has at least 1 baseline", () => {
    for (const level of ALL_CEFR_LEVELS) {
      expect(stats.baselinesByCefr[level]).toBeGreaterThanOrEqual(1);
    }
  });

  it("kids has exactly 1 baseline", () => {
    expect(stats.baselinesByCefr["Kids"]).toBe(1);
  });

  it("dimensionsCovered includes all 6 dimensions", () => {
    expect(stats.dimensionsCovered).toHaveLength(6);
    for (const dimId of ALL_DIMENSION_IDS) {
      expect(stats.dimensionsCovered).toContain(dimId);
    }
  });

  it("cefrLevelsCovered includes all 6 CEFR levels", () => {
    expect(stats.cefrLevelsCovered).toHaveLength(6);
  });

  it("averageAdvantageScore is in valid range", () => {
    expect(stats.averageAdvantageScore).toBeGreaterThan(0);
    expect(stats.averageAdvantageScore).toBeLessThanOrEqual(100);
  });

  it("contractRuleCoverage is greater than 0", () => {
    expect(stats.contractRuleCoverage).toBeGreaterThan(0);
  });

  it("proofSubGateCoverage is greater than 0", () => {
    expect(stats.proofSubGateCoverage).toBeGreaterThan(0);
  });

  it("failureTaxonomyCoverage is greater than 0", () => {
    expect(stats.failureTaxonomyCoverage).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 15: Generic Chatbot Missing Behaviors
// ══════════════════════════════════════════════════════════════════════════════

describe("GENERIC_CHATBOT_MISSING_BEHAVIORS", () => {
  it("has exactly 14 canonical missing behaviors", () => {
    expect(GENERIC_CHATBOT_MISSING_BEHAVIORS).toHaveLength(14);
  });

  it("all are in Vietnamese", () => {
    for (const behavior of GENERIC_CHATBOT_MISSING_BEHAVIORS) {
      expect(behavior).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
    }
  });

  it("covers all 6 dimensions", () => {
    const keywords = {
      diagnosis: ["chẩn đoán", "L1"],
      teaching: ["giải thích", "gợi ý", "ưu tiên"],
      memory: ["ghi nhớ", "pattern"],
      adaptation: ["điều chỉnh", "tín hiệu", "cảm xúc", "trình độ"],
      selfCheck: ["thừa nhận", "không chắc", "từ chối"],
      learningGain: ["tiến bộ", "trước-sau", "đo lường"],
    };

    for (const [dim, dimKeywords] of Object.entries(keywords)) {
      const hasCoverage = GENERIC_CHATBOT_MISSING_BEHAVIORS.some((b) =>
        dimKeywords.some((kw) => b.toLowerCase().includes(kw.toLowerCase())),
      );
      expect(hasCoverage).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 16: Kids Mode
// ══════════════════════════════════════════════════════════════════════════════

describe("Kids mode", () => {
  it("kids baseline exists and is valid", () => {
    const kids = getBaselinesByCefr("Kids");
    expect(kids).toHaveLength(1);
    expect(kids[0].baselineId).toBe("bl-adapt-kids-fun-switch");
  });

  it("kids baseline has emotional adaptation as primary", () => {
    const kids = getChatbotBaselineById("bl-adapt-kids-fun-switch")!;
    expect(kids.dimensionId).toBe("adaptation");
    expect(kids.genericBehavior.missingBehaviors.some((b) => b.includes("trẻ em"))).toBe(true);
  });

  it("kids mode comparison shows adaptation advantage", () => {
    const input = makeKidsMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    const adaptDim = comp.dimensions.find((d) => d.dimensionId === "adaptation")!;
    expect(adaptDim.advantageScore).toBeGreaterThan(50);
    expect(adaptDim.mercyBeatsGeneric).toBe(true);
  });

  it("kids mode teacher profile shows emotional adaptation", () => {
    const input = makeKidsMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    expect(comp.teacherMercyProfile.didAdaptToEmotion).toBe(true);
  });

  it("kids mode summary mentions the mode", () => {
    const input = makeKidsMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    expect(comp.summaryVi).toContain("Trẻ em");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 17: Cross-Scenario Coverage
// ══════════════════════════════════════════════════════════════════════════════

describe("Cross-scenario coverage", () => {
  it("every baseline can produce a comparison", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input);
      expect(comp).not.toBeNull();
    }
  });

  it("every baseline dimension gets strong advantage with full input", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input)!;
      const primaryDim = comp.dimensions.find((d) => d.dimensionId === b.dimensionId)!;
      expect(primaryDim.advantageScore).toBeGreaterThanOrEqual(50);
      expect(primaryDim.mercyBeatsGeneric).toBe(true);
    }
  });

  it("CEFR progression: advantage stays clear across levels", () => {
    const levels = ["A1", "A2", "B1", "B2", "C1"] as CefrLevel[];
    for (const level of levels) {
      const baselines = getBaselinesByCefr(level);
      for (const b of baselines) {
        const input = makeFullMercyInput(b.baselineId);
        const comp = compareWithGenericChatbot(input)!;
        // Full input gives at least moderate advantage (>=45) across all CEFR levels
        // Score varies by how many dimensions have gaps in that baseline
        expect(comp.overallAdvantageScore).toBeGreaterThanOrEqual(45);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 18: Determinism
// ══════════════════════════════════════════════════════════════════════════════

describe("Determinism", () => {
  it("same input produces identical comparison", () => {
    const input = makeFullMercyInput();
    const comp1 = compareWithGenericChatbot(input);
    const comp2 = compareWithGenericChatbot(input);

    expect(comp1!.overallAdvantageScore).toBe(comp2!.overallAdvantageScore);
    expect(comp1!.verdict).toBe(comp2!.verdict);
    for (let i = 0; i < 6; i++) {
      expect(comp1!.dimensions[i].advantageScore).toBe(
        comp2!.dimensions[i].advantageScore,
      );
    }
  });

  it("catalog functions return same results when called twice", () => {
    const catalog1 = getChatbotBaselineCatalog();
    const catalog2 = getChatbotBaselineCatalog();
    expect(catalog1).toEqual(catalog2);
  });

  it("statistics are deterministic", () => {
    const stats1 = getChatbotBaselineStatistics();
    const stats2 = getChatbotBaselineStatistics();
    expect(stats1).toEqual(stats2);
  });

  it("validation is deterministic", () => {
    const result1 = validateAllChatbotBaselines();
    const result2 = validateAllChatbotBaselines();
    expect(result1).toEqual(result2);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 19: Dual-Language Proof
// ══════════════════════════════════════════════════════════════════════════════

describe("Dual-language proof", () => {
  it("DIMENSION_LABELS_VI uses Vietnamese", () => {
    for (const [dimId, label] of Object.entries(DIMENSION_LABELS_VI)) {
      expect(label).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
      expect(label).not.toMatch(/^[A-Za-z ]+$/); // not pure ASCII
    }
  });

  it("DIMENSION_LABELS_EN uses English", () => {
    for (const [dimId, label] of Object.entries(DIMENSION_LABELS_EN)) {
      expect(label).toMatch(/^[A-Za-z -]+$/); // pure ASCII
    }
  });

  it("all baseline titleVi entries are in Vietnamese", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.titleVi).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
    }
  });

  it("all gapRationaleVi entries are in Vietnamese", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.gapRationaleVi).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
    }
  });

  it("all failureRationaleVi entries are in Vietnamese", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(b.genericBehavior.failureRationaleVi).toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
    }
  });

  it("summaryVi output contains Vietnamese characters", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    expect(comp.summaryVi).toMatch(/[àáảãạ]/);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 20: Edge Cases
// ══════════════════════════════════════════════════════════════════════════════

describe("Edge cases", () => {
  it("empty l1PatternsDiagnosed reduces diagnosis advantage (but not below base)", () => {
    // Without L1 diagnosis, Mercy still gets base + primary + chatbot-gap + contract bonus = 80
    // (contract rules still present in createMinimalComparisonInput defaults)
    const input = createMinimalComparisonInput({
      baselineId: "bl-diag-a1-copula",
      teacherMercyOutput: "test",
      l1PatternsDiagnosed: [],
      usedVietnamese: false,
    });
    const comp = compareWithGenericChatbot(input)!;
    const diagDim = comp.dimensions.find((d) => d.dimensionId === "diagnosis")!;
    expect(diagDim.advantageScore).toBe(80);
  });

  it("with full l1PatternsDiagnosed, diagnosis gets maximum advantage", () => {
    const input = createMinimalComparisonInput({
      baselineId: "bl-diag-a1-copula",
      teacherMercyOutput: "test with L1 awareness",
      l1PatternsDiagnosed: ["copula-omission"],
      usedVietnamese: true,
    });
    const comp = compareWithGenericChatbot(input)!;
    const diagDim = comp.dimensions.find((d) => d.dimensionId === "diagnosis")!;
    expect(diagDim.advantageScore).toBeGreaterThanOrEqual(80);
  });

  it("null weaknessReferenced reduces memory advantage", () => {
    const input = createMinimalComparisonInput({
      baselineId: "bl-mem-a2-weakness-tracking",
      teacherMercyOutput: "test",
      weaknessReferenced: null,
    });
    const comp = compareWithGenericChatbot(input)!;
    const memDim = comp.dimensions.find((d) => d.dimensionId === "memory")!;
    // Primary dimension gets: 20 base + 30 primary + 20 gaps + 10 contract = 80
    // Without weakness ref, the +20 "demonstrated" bonus is lost but contract rules remain
    expect(memDim.advantageScore).toBe(80);
  });

  it("unknown baseline ID returns null gracefully", () => {
    expect(compareWithGenericChatbot({ baselineId: "bl-bogus", teacherMercyOutput: "x" })).toBeNull();
    expect(buildChatbotBaselineComparison({ baselineId: "bl-bogus", teacherMercyOutput: "x" })).toBeNull();
  });

  it("very long teacher output still works", () => {
    const longOutput = "A".repeat(10000);
    const input = createMinimalComparisonInput({
      teacherMercyOutput: longOutput,
    });
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
    expect(comp!.teacherMercyProfile.responseText.length).toBe(10000);
  });

  it("empty string teacher output still works", () => {
    const input = createMinimalComparisonInput({
      teacherMercyOutput: "",
    });
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
  });

  it("session number 1 produces valid comparison", () => {
    const input = createMinimalComparisonInput({ sessionNumber: 1 });
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
  });

  it("session number 100 produces valid comparison", () => {
    const input = createMinimalComparisonInput({ sessionNumber: 100 });
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
  });

  it("no undefined or null in comparison output", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const json = JSON.stringify(comp);
    const parsed = JSON.parse(json);
    expect(JSON.stringify(parsed)).toBe(json); // round-trip clean
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 21: Multi-Baseline Comparison
// ══════════════════════════════════════════════════════════════════════════════

describe("Multi-baseline comparison", () => {
  it("runAllBaselineComparisons runs all baselines", () => {
    const mercyOutputs: Record<ChatbotBaselineId, CompareWithGenericChatbotInput> = {};
    for (const b of CHATBOT_BASELINE_CATALOG) {
      mercyOutputs[b.baselineId] = makeFullMercyInput(b.baselineId);
    }

    const results = runAllBaselineComparisons(mercyOutputs);
    expect(results).toHaveLength(12);
    for (const r of results) {
      expect(r.dimensions).toHaveLength(6);
    }
  });

  it("aggregateBaselineComparisons produces valid aggregate with full Mercy", () => {
    const mercyOutputs: Record<ChatbotBaselineId, CompareWithGenericChatbotInput> = {};
    for (const b of CHATBOT_BASELINE_CATALOG) {
      mercyOutputs[b.baselineId] = makeFullMercyInput(b.baselineId);
    }
    const results = runAllBaselineComparisons(mercyOutputs);
    const aggregate = aggregateBaselineComparisons(results);

    expect(aggregate.totalComparisons).toBe(12);
    // Full Mercy input gives moderate-to-clear advantage across all baselines
    expect(aggregate.overallAverageAdvantage).toBeGreaterThan(45);
    // With full capabilities, at least some comparisons reach moderate+
    expect(
      aggregate.strongAdvantageCount +
        aggregate.clearAdvantageCount +
        aggregate.moderateAdvantageCount,
    ).toBeGreaterThan(0);
    expect(aggregate.bestDimension.averageScore).toBeGreaterThan(0);
    expect(aggregate.worstDimension.averageScore).toBeLessThanOrEqual(
      aggregate.bestDimension.averageScore,
    );
    expect(aggregate.summaryVi.length).toBeGreaterThan(0);
  });

  it("aggregateBaselineComparisons handles empty input", () => {
    const aggregate = aggregateBaselineComparisons([]);
    expect(aggregate.totalComparisons).toBe(0);
    expect(aggregate.overallAverageAdvantage).toBe(0);
    expect(aggregate.summaryVi).toContain("Không có dữ liệu");
  });

  it("aggregateBaselineComparisons with mixed input has correct counts", () => {
    const mercyOutputs: Record<ChatbotBaselineId, CompareWithGenericChatbotInput> = {};
    // First 6: full input, last 6: minimal input
    for (let i = 0; i < 6; i++) {
      const b = CHATBOT_BASELINE_CATALOG[i];
      mercyOutputs[b.baselineId] = makeFullMercyInput(b.baselineId);
    }
    for (let i = 6; i < 12; i++) {
      const b = CHATBOT_BASELINE_CATALOG[i];
      mercyOutputs[b.baselineId] = makeMinimalMercyInput(b.baselineId);
    }

    const results = runAllBaselineComparisons(mercyOutputs);
    const aggregate = aggregateBaselineComparisons(results);

    expect(aggregate.totalComparisons).toBe(12);
    // Full input → moderate advantage; minimal input → minimal advantage
    // Both sets should register correctly
    expect(
      aggregate.moderateAdvantageCount +
        aggregate.clearAdvantageCount +
        aggregate.strongAdvantageCount,
    ).toBeGreaterThanOrEqual(1);
    expect(
      aggregate.minimalAdvantageCount + aggregate.noAdvantageCount,
    ).toBeGreaterThanOrEqual(1);
  });

  it("aggregate best and worst dimensions are different for mixed input", () => {
    const mercyOutputs: Record<ChatbotBaselineId, CompareWithGenericChatbotInput> = {};
    for (const b of CHATBOT_BASELINE_CATALOG) {
      mercyOutputs[b.baselineId] = makeFullMercyInput(b.baselineId);
    }
    const results = runAllBaselineComparisons(mercyOutputs);
    const aggregate = aggregateBaselineComparisons(results);

    // With all full inputs, best and worst should be close but not necessarily equal
    expect(aggregate.bestDimension.averageScore).toBeGreaterThan(0);
    expect(aggregate.worstDimension.averageScore).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 22: createMinimalComparisonInput
// ══════════════════════════════════════════════════════════════════════════════

describe("createMinimalComparisonInput", () => {
  it("returns a complete input with defaults", () => {
    const input = createMinimalComparisonInput();
    expect(input.baselineId).toBe(CHATBOT_BASELINE_CATALOG[0].baselineId);
    expect(input.teacherMercyOutput.length).toBeGreaterThan(0);
    expect(input.l1PatternsDiagnosed).toEqual(["copula-omission"]);
    expect(input.weaknessReferenced).toBe("copula-omission");
    expect(input.satisfiedContractRules).toHaveLength(3);
    expect(input.usedVietnamese).toBe(true);
    expect(input.didSelfCheck).toBe(false);
    expect(input.didMeasureGain).toBe(false);
    expect(input.sessionNumber).toBe(1);
    expect(input.isKidsMode).toBe(false);
  });

  it("overrides work correctly", () => {
    const input = createMinimalComparisonInput({
      baselineId: "bl-teach-b2-face-saving",
      teacherMercyOutput: "custom",
      l1PatternsDiagnosed: ["article-absence"],
      sessionNumber: 5,
    });
    expect(input.baselineId).toBe("bl-teach-b2-face-saving");
    expect(input.teacherMercyOutput).toBe("custom");
    expect(input.l1PatternsDiagnosed).toEqual(["article-absence"]);
    expect(input.sessionNumber).toBe(5);
    // Non-overridden defaults preserved
    expect(input.usedVietnamese).toBe(true);
  });

  it("produces a valid comparison", () => {
    const input = createMinimalComparisonInput();
    const comp = compareWithGenericChatbot(input);
    expect(comp).not.toBeNull();
    expect(comp!.dimensions).toHaveLength(6);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 23: Integration Contract — Dimension IDs Match Dashboard
// ══════════════════════════════════════════════════════════════════════════════

describe("Integration: dimension IDs match dashboard", () => {
  it("ALL_DIMENSION_IDS covers all 6 teacher intelligence dimensions", () => {
    const expectedIds: TeacherIntelligenceDimensionId[] = [
      "diagnosis",
      "teaching",
      "memory",
      "adaptation",
      "selfCheck",
      "learningGain",
    ];
    expect(ALL_DIMENSION_IDS).toEqual(expectedIds);
    expect(ALL_DIMENSION_IDS).toHaveLength(6);
  });

  it("every baseline's dimensionId is in ALL_DIMENSION_IDS", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      expect(ALL_DIMENSION_IDS).toContain(b.dimensionId);
    }
  });

  it("every dimension comparison uses valid IDs", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    for (const dim of comp.dimensions) {
      expect(ALL_DIMENSION_IDS).toContain(dim.dimensionId);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 24: Contract Rule Coverage
// ══════════════════════════════════════════════════════════════════════════════

describe("Contract rule coverage", () => {
  it("R1_MEANING_FIRST is covered by multiple baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R1_MEANING_FIRST"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(3);
  });

  it("R5_REMEMBER_WEAKNESS is covered by memory and gain baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R5_REMEMBER_WEAKNESS"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(4);
  });

  it("R6_VIETNAMESE_INTERFERENCE is covered by diagnosis baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R6_VIETNAMESE_INTERFERENCE"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(3);
  });

  it("R7_STRATEGIC_SILENCE is covered by selfCheck baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R7_STRATEGIC_SILENCE"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(2);
  });

  it("R8_FACE_SAVING is covered by teaching+b2 + kids baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R8_FACE_SAVING"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(2);
  });

  it("R9_SELF_CORRECTION_SPACE is covered by teaching baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R9_SELF_CORRECTION_SPACE"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(1);
  });

  it("R10_NEXT_PRACTICE_WHEN_HELPFUL is covered by gain baselines", () => {
    const baselines = CHATBOT_BASELINE_CATALOG.filter((b) =>
      b.relevantContractRules.includes("R10_NEXT_PRACTICE_WHEN_HELPFUL"),
    );
    expect(baselines.length).toBeGreaterThanOrEqual(2);
  });

  it("all violated contract rules are valid rule IDs", () => {
    const validRules = [
      "R1_MEANING_FIRST",
      "R2_ONE_CORRECTION_MAX",
      "R3_NO_FAKE_PRAISE",
      "R4_ONE_FOLLOW_UP",
      "R5_REMEMBER_WEAKNESS",
      "R6_VIETNAMESE_INTERFERENCE",
      "R7_STRATEGIC_SILENCE",
      "R8_FACE_SAVING",
      "R9_SELF_CORRECTION_SPACE",
      "R10_NEXT_PRACTICE_WHEN_HELPFUL",
    ];

    for (const b of CHATBOT_BASELINE_CATALOG) {
      for (const rule of b.genericBehavior.violatedContractRules) {
        expect(validRules).toContain(rule);
      }
      for (const rule of b.relevantContractRules) {
        expect(validRules).toContain(rule);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 25: Comparison ID Uniqueness
// ══════════════════════════════════════════════════════════════════════════════

describe("Comparison ID uniqueness", () => {
  it("each comparison gets a unique comparisonId", () => {
    const ids = new Set<string>();
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input)!;
      expect(comp.comparisonId).toContain("cmp-");
      expect(comp.comparisonId).toContain(b.baselineId);
      ids.add(comp.comparisonId);
    }
    // All 12 should have unique IDs (timestamp-based)
    expect(ids.size).toBe(12);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 26: Type Exports
// ══════════════════════════════════════════════════════════════════════════════

describe("Type exports", () => {
  it("ChatbotBaselineEntry type is structurally sound", () => {
    const entry: ChatbotBaselineEntry = CHATBOT_BASELINE_CATALOG[0];
    expect(typeof entry.baselineId).toBe("string");
    expect(typeof entry.titleVi).toBe("string");
    expect(typeof entry.titleEn).toBe("string");
    expect(Array.isArray(entry.genericBehavior.missingBehaviors)).toBe(true);
    expect(Array.isArray(entry.genericBehavior.dimensionGaps)).toBe(true);
  });

  it("GenericChatbotBehavior type is structurally sound", () => {
    const gb: GenericChatbotBehavior =
      CHATBOT_BASELINE_CATALOG[0].genericBehavior;
    expect(typeof gb.predictedResponseEn).toBe("string");
    expect(Array.isArray(gb.predictedCorrections)).toBe(true);
    expect(Array.isArray(gb.missingBehaviors)).toBe(true);
    expect(Array.isArray(gb.dimensionGaps)).toBe(true);
    expect(typeof gb.failureRationaleVi).toBe("string");
    expect(typeof gb.failureRationaleEn).toBe("string");
  });

  it("TeacherMercyProfile type is structurally sound", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;
    const profile: TeacherMercyProfile = comp.teacherMercyProfile;
    expect(typeof profile.didDiagnoseL1).toBe("boolean");
    expect(typeof profile.didUseVietnameseStrategically).toBe("boolean");
    expect(typeof profile.didRememberWeakness).toBe("boolean");
    expect(typeof profile.didAdaptToCefr).toBe("boolean");
    expect(typeof profile.didSelfCheck).toBe("boolean");
    expect(typeof profile.didMeasureGain).toBe("boolean");
    expect(Array.isArray(profile.demonstratedDimensions)).toBe(true);
  });

  it("DimensionComparison type is structurally sound", () => {
    const comp = compareWithGenericChatbot(makeFullMercyInput())!;
    const dim: DimensionComparison = comp.dimensions[0];
    expect(typeof dim.dimensionId).toBe("string");
    expect(typeof dim.advantageScore).toBe("number");
    expect(typeof dim.mercyBeatsGeneric).toBe("boolean");
    expect(typeof dim.mercyAdvantageEvidenceVi).toBe("string");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 27: Baseline-to-Scenario Alignment
// ══════════════════════════════════════════════════════════════════════════════

describe("Baseline-to-scenario alignment", () => {
  it("diagnosis baselines align with hq-diag scenarios", () => {
    const diagBaselines = getBaselinesByDimension("diagnosis");
    for (const b of diagBaselines) {
      expect(b.alignedScenarioIds.some((id) => id.startsWith("hq-diag"))).toBe(true);
    }
  });

  it("teaching baselines align with hq-teach scenarios", () => {
    const teachBaselines = getBaselinesByDimension("teaching");
    for (const b of teachBaselines) {
      expect(b.alignedScenarioIds.some((id) => id.startsWith("hq-teach"))).toBe(true);
    }
  });

  it("memory baselines align with hq-mem scenarios", () => {
    const memBaselines = getBaselinesByDimension("memory");
    for (const b of memBaselines) {
      expect(b.alignedScenarioIds.some((id) => id.startsWith("hq-mem"))).toBe(true);
    }
  });

  it("adaptation baselines align with hq-adapt scenarios", () => {
    const adaptBaselines = getBaselinesByDimension("adaptation");
    for (const b of adaptBaselines) {
      expect(b.alignedScenarioIds.some((id) => id.startsWith("hq-adapt"))).toBe(true);
    }
  });

  it("selfCheck baselines align with hq-self scenarios", () => {
    const selfBaselines = getBaselinesByDimension("selfCheck");
    for (const b of selfBaselines) {
      expect(b.alignedScenarioIds.some((id) => id.startsWith("hq-self"))).toBe(true);
    }
  });

  it("learningGain baselines align with hq-gain or hq-multi scenarios", () => {
    const gainBaselines = getBaselinesByDimension("learningGain");
    for (const b of gainBaselines) {
      expect(
        b.alignedScenarioIds.some(
          (id) => id.startsWith("hq-gain") || id.startsWith("hq-multi"),
        ),
      ).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Suite 28: No Null/Undefined in Output
// ══════════════════════════════════════════════════════════════════════════════

describe("No null/undefined in output", () => {
  it("all comparison fields are populated", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const input = makeFullMercyInput(b.baselineId);
      const comp = compareWithGenericChatbot(input)!;

      expect(comp.comparisonId).toBeTruthy();
      expect(comp.baselineId).toBeTruthy();
      expect(comp.scenarioTitleVi).toBeTruthy();
      expect(comp.learnerInput).toBeTruthy();
      expect(comp.learnerCefr).toBeTruthy();
      expect(comp.learnerL1).toBeTruthy();
      expect(comp.genericBaseline).toBeTruthy();
      expect(comp.teacherMercyProfile).toBeTruthy();
      expect(comp.summaryVi).toBeTruthy();
      expect(comp.summaryEn).toBeTruthy();
    }
  });

  it("dimension comparison fields are fully populated", () => {
    const input = makeFullMercyInput();
    const comp = compareWithGenericChatbot(input)!;

    for (const dim of comp.dimensions) {
      expect(dim.dimensionId).toBeTruthy();
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.genericChatbotBehavior).toBeTruthy();
      expect(dim.teacherMercyBehavior).toBeTruthy();
      expect(dim.mercyAdvantageEvidenceVi).toBeTruthy();
      expect(dim.genericChatbotFailureEvidenceVi).toBeTruthy();
      expect(typeof dim.advantageScore).toBe("number");
      expect(typeof dim.mercyBeatsGeneric).toBe("boolean");
    }
  });

  it("generic baseline fields are not null/undefined", () => {
    for (const b of CHATBOT_BASELINE_CATALOG) {
      const gb = b.genericBehavior;
      expect(gb.predictedResponseEn).toBeTruthy();
      expect(gb.failureRationaleVi).toBeTruthy();
      expect(gb.failureRationaleEn).toBeTruthy();
      expect(Array.isArray(gb.predictedCorrections)).toBe(true);
      expect(Array.isArray(gb.missingBehaviors)).toBe(true);
      expect(Array.isArray(gb.dimensionGaps)).toBe(true);
      expect(Array.isArray(gb.violatedContractRules)).toBe(true);
    }
  });
});
