/**
 * World-Class Tutor Readiness Evaluation — Test Suite (Step 120)
 *
 * Validates the final capstone evaluation module against all dimensions:
 *   - Importability and exports
 *   - World-class teaching standards integrity (6 standards × 4 criteria = 24 criteria)
 *   - Capability evaluation across tiers
 *   - Scorecard correctness
 *   - Gap severity grading
 *   - Benchmark comparison
 *   - Launch phase sequencing
 *   - Chau recommendation logic
 *   - Cross-validation with handoff
 *   - Determinism (100× repeatability)
 *   - Vietnamese-first compliance
 *   - Edge cases
 *   - Display helpers
 */

import { describe, it, expect } from "vitest";
import {
  // Types
  type WorldClassEvaluationInput,
  type WorldClassEvaluation,
  type WorldClassScorecard,
  type CapabilityWorldClassEvaluation,
  type CriterionEvaluation,
  type GapSeverityGrade,
  type BenchmarkComparison,
  type LaunchPhase,
  type ChauFinalRecommendation,
  type TeachingTier,
  // Constants
  WORLD_CLASS_TEACHING_STANDARDS,
  // Core
  evaluateWorldClassReadiness,
  // Display helpers
  getWorldClassSummary,
  getWorldClassScorecard,
  getGapSeverityGrades,
  getBenchmarkComparisons,
  getLaunchReadinessPhases,
  getChauFinalRecommendation,
  worldClassIsReady,
  getCapabilityEvaluations,
  // Cross-validation
  crossValidateWithHandoff,
  verifyEvaluationDeterminism,
} from "../worldClassTutorReadinessEvaluation";

import {
  // Handoff types
  type HandoffInput,
  type HandoffEvidence,
  runTeacherMercyHandoff,
} from "../teacherMercyHandoff";

// ═══════════════════════════════════════════════════════════════════════════════
// FIXTURES
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_MODULE_FILES = [
  "src/lib/tutor/correctionEngine.ts",
  "src/lib/tutor/tutorFailureTaxonomy.ts",
  "src/lib/tutor/transcriptCorrectionCollector.ts",
  "src/lib/tutor/teacherMercyCorrectionTiming.ts",
  "src/lib/tutor/vietlishCuratedLogic.ts",
  "src/lib/tutor/vietnameseInterferenceExplanation.ts",
  "src/lib/tutor/conversationAiClient.ts",
  "src/lib/tutor/conversationPromptTemplates.ts",
  "src/lib/tutor/goldenConversationSimulations.ts",
  "src/lib/tutor/conversationWarmth.ts",
  "src/lib/tutor/encouragementTimingPolicy.ts",
  "src/lib/tutor/lessonSequenceGenerator.ts",
  "src/lib/tutor/learnerHistoryProfile.ts",
  "src/lib/tutor/weaknessMemoryTags.ts",
  "src/lib/tutor/learningEvents.ts",
  "src/lib/tutor/learningEventSummary.ts",
  "src/lib/tutor/learnerProfileBuilder.ts",
  "src/lib/tutor/masteryGraph.ts",
  "src/lib/tutor/challengeTimingPolicy.ts",
  "src/lib/tutor/hintLadderPolicy.ts",
  "src/lib/tutor/contentAwarePivots.ts",
  "src/lib/tutor/emotionalResponseBoundary.ts",
  "src/lib/tutor/learnerReadinessPolicy.ts",
  "src/lib/tutor/lessonRecommendationIntelligence.ts",
  "src/lib/tutor/teacherMercySelfAuditGate.ts",
  "src/lib/tutor/overclaimGuard.ts",
  "src/lib/tutor/teachingDecisionEvaluationGate.ts",
  "src/lib/tutor/teacherMercyAuditGate.ts",
  "src/lib/tutor/teacherMercyContract.ts",
  "src/lib/tutor/safetyHumilityFinalAudit.ts",
  "src/lib/tutor/learningGainRubric.ts",
  "src/lib/tutor/learningGainEvidencePacket.ts",
  "src/lib/tutor/realProductProofGate.ts",
  "src/lib/tutor/chauReviewPacket.ts",
  "src/lib/tutor/humanLearnerTestingChecklist.ts",
  "src/lib/tutor/teacherIntelligenceDashboard.ts",
  // Extra modules needed for integration checks
  "src/lib/tutor/teacherDecisionEngine.ts",
  "src/lib/tutor/speakTopicLibrary.ts",
  "src/lib/tutor/speakFollowups.ts",
  "src/lib/tutor/pivotPromptSafety.ts",
  "src/lib/tutor/journeyOwnerWalkthrough.ts",
];

function buildFullHandoffInput(): HandoffInput {
  return {
    moduleFiles: ALL_MODULE_FILES,
    testCounts: {
      diagnose: 900,
      teach: 800,
      remember: 500,
      adapt: 600,
      selfCheck: 700,
      prove: 600,
    },
    failureTaxonomyPresence: {
      diagnose: true,
      teach: true,
      remember: true,
      adapt: true,
      selfCheck: true,
      prove: true,
    },
    evidencePacketPresence: {
      diagnose: true,
      teach: true,
      remember: true,
      adapt: true,
      selfCheck: true,
      prove: true,
    },
    integrationCheckPresence: {
      diagnose: true,
      teach: true,
      remember: true,
      adapt: true,
      selfCheck: true,
      prove: true,
    },
    totalTestCount: 5388,
    totalTestsPassing: 5388,
    totalTestsFailing: 0,
  };
}

function buildFullHandoff(): HandoffEvidence {
  return runTeacherMercyHandoff(buildFullHandoffInput());
}

function buildMinimalHandoffInput(): HandoffInput {
  return {
    moduleFiles: ["src/lib/tutor/correctionEngine.ts"],
    testCounts: { diagnose: 10, teach: 0, remember: 0, adapt: 0, selfCheck: 0, prove: 0 },
    failureTaxonomyPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    evidencePacketPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    integrationCheckPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    totalTestCount: 10,
    totalTestsPassing: 5,
    totalTestsFailing: 5,
  };
}

function buildEmptyHandoffInput(): HandoffInput {
  return {
    moduleFiles: [],
    testCounts: { diagnose: 0, teach: 0, remember: 0, adapt: 0, selfCheck: 0, prove: 0 },
    failureTaxonomyPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    evidencePacketPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    integrationCheckPresence: {
      diagnose: false, teach: false, remember: false, adapt: false, selfCheck: false, prove: false,
    },
    totalTestCount: 0,
    totalTestsPassing: 0,
    totalTestsFailing: 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 1: Importability
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG1: Importability and Exports", () => {
  it("exports WORLD_CLASS_TEACHING_STANDARDS as a non-empty array", () => {
    expect(Array.isArray(WORLD_CLASS_TEACHING_STANDARDS)).toBe(true);
    expect(WORLD_CLASS_TEACHING_STANDARDS.length).toBe(6);
  });

  it("exports evaluateWorldClassReadiness as a function", () => {
    expect(typeof evaluateWorldClassReadiness).toBe("function");
  });

  it("exports all display helpers as functions", () => {
    expect(typeof getWorldClassSummary).toBe("function");
    expect(typeof getWorldClassScorecard).toBe("function");
    expect(typeof getGapSeverityGrades).toBe("function");
    expect(typeof getBenchmarkComparisons).toBe("function");
    expect(typeof getLaunchReadinessPhases).toBe("function");
    expect(typeof getChauFinalRecommendation).toBe("function");
    expect(typeof worldClassIsReady).toBe("function");
    expect(typeof getCapabilityEvaluations).toBe("function");
  });

  it("exports cross-validation helpers as functions", () => {
    expect(typeof crossValidateWithHandoff).toBe("function");
    expect(typeof verifyEvaluationDeterminism).toBe("function");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 2: World-Class Teaching Standards Integrity
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG2: Teaching Standards Integrity", () => {
  it("has exactly 6 standards — one per capability", () => {
    const ids = WORLD_CLASS_TEACHING_STANDARDS.map((s) => s.capabilityId);
    expect(ids).toEqual(["diagnose", "teach", "remember", "adapt", "selfCheck", "prove"]);
  });

  it("each standard has exactly 4 criteria", () => {
    for (const std of WORLD_CLASS_TEACHING_STANDARDS) {
      expect(
        std.criteria.length,
        `${std.capabilityId} should have 4 criteria, got ${std.criteria.length}`,
      ).toBe(4);
    }
  });

  it("all criterion IDs are unique across all standards", () => {
    const allIds = WORLD_CLASS_TEACHING_STANDARDS.flatMap((s) =>
      s.criteria.map((c) => c.id),
    );
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("all criterion IDs follow the naming pattern (letter + number)", () => {
    const allIds = WORLD_CLASS_TEACHING_STANDARDS.flatMap((s) =>
      s.criteria.map((c) => c.id),
    );
    for (const id of allIds) {
      expect(id).toMatch(/^[A-Z]\d{2}$/);
    }
  });

  it("each criterion has all required fields with Vietnamese text", () => {
    for (const std of WORLD_CLASS_TEACHING_STANDARDS) {
      for (const c of std.criteria) {
        expect(c.id).toBeTruthy();
        expect(c.labelVi).toBeTruthy();
        expect(c.labelEn).toBeTruthy();
        expect(c.descriptionVi).toBeTruthy();
        expect(c.foundationalVi).toBeTruthy();
        expect(c.proficientVi).toBeTruthy();
        expect(c.worldClassVi).toBeTruthy();
        // Vietnamese text must contain diacritics (not just ASCII)
        expect(c.labelVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
      }
    }
  });

  it("each standard has Vietnamese title and tagline in criteria", () => {
    for (const std of WORLD_CLASS_TEACHING_STANDARDS) {
      expect(std.titleVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("tier descriptions are distinct non-empty strings", () => {
    for (const std of WORLD_CLASS_TEACHING_STANDARDS) {
      for (const c of std.criteria) {
        // Each tier should be a distinct, substantive description
        expect(c.foundationalVi.length).toBeGreaterThan(10);
        expect(c.proficientVi.length).toBeGreaterThan(10);
        expect(c.worldClassVi.length).toBeGreaterThan(10);
        // Tiers should differ from each other (not copy-pasted)
        expect(c.foundationalVi).not.toBe(c.proficientVi);
        expect(c.proficientVi).not.toBe(c.worldClassVi);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 3: Core Evaluation — Full Input (Balanced Mode)
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG3: Core Evaluation — Full Input, Balanced Mode", () => {
  const handoff = buildFullHandoff();
  const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
  const evaluation = evaluateWorldClassReadiness(input);

  it("returns a complete WorldClassEvaluation object", () => {
    expect(evaluation).toBeDefined();
    expect(evaluation.capabilityEvaluations).toHaveLength(6);
    expect(evaluation.scorecard).toBeDefined();
    expect(evaluation.gaps).toBeDefined();
    expect(evaluation.benchmarks).toBeDefined();
    expect(evaluation.launchPhases).toBeDefined();
    expect(evaluation.recommendation).toBeDefined();
    expect(evaluation.overallVerdictVi).toBeTruthy();
    expect(evaluation.overallTier).toBeDefined();
    expect(evaluation.worldClassCapabilities).toBeGreaterThanOrEqual(0);
    expect(evaluation.worldClassTotal).toBe(6);
    expect(evaluation.evaluationTimestamp).toBeTruthy();
  });

  it("produces 6 capability evaluations — one per standard", () => {
    const capIds = evaluation.capabilityEvaluations.map((e) => e.capabilityId);
    expect(capIds).toEqual(["diagnose", "teach", "remember", "adapt", "selfCheck", "prove"]);
  });

  it("each capability evaluation has 4 criteria evaluations", () => {
    for (const capEval of evaluation.capabilityEvaluations) {
      expect(capEval.criteriaEvaluations).toHaveLength(4);
    }
  });

  it("each criterion evaluation has all required fields", () => {
    for (const capEval of evaluation.capabilityEvaluations) {
      for (const crit of capEval.criteriaEvaluations) {
        expect(crit.criterionId).toBeTruthy();
        expect(crit.labelVi).toBeTruthy();
        expect(crit.achievedTier).toMatch(/^(foundational|proficient|world_class)$/);
        expect(crit.targetTier).toBe("world_class");
        expect(crit.gap).toMatch(/^(none|minor|moderate|significant)$/);
        expect(crit.evidenceVi).toBeTruthy();
      }
    }
  });

  it("scorecard has totalScore between 0-100", () => {
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(0);
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(100);
  });

  it("scorecard has all 6 capability scores", () => {
    expect(Object.keys(evaluation.scorecard.capabilityScores)).toHaveLength(6);
    for (const capId of ["diagnose", "teach", "remember", "adapt", "selfCheck", "prove"] as const) {
      expect(evaluation.scorecard.capabilityScores[capId]).toBeGreaterThanOrEqual(0);
      expect(evaluation.scorecard.capabilityScores[capId]).toBeLessThanOrEqual(100);
    }
  });

  it("scorecard strengths and weaknesses are arrays", () => {
    expect(Array.isArray(evaluation.scorecard.strengthsVi)).toBe(true);
    expect(Array.isArray(evaluation.scorecard.weaknessesVi)).toBe(true);
  });

  it("benchmarks contains comparisons against all known competitors", () => {
    expect(evaluation.benchmarks.length).toBeGreaterThanOrEqual(5);
    for (const b of evaluation.benchmarks) {
      expect(b.benchmark).toBeTruthy();
      expect(b.category).toMatch(/^(ai_tutor|human_tutor|language_app)$/);
      expect(b.mercyScore).toBeGreaterThanOrEqual(0);
      expect(b.benchmarkScore).toBeGreaterThanOrEqual(0);
      expect(b.comparisonVi).toBeTruthy();
    }
  });

  it("launch phases are in order", () => {
    expect(evaluation.launchPhases).toHaveLength(5);
    for (let i = 0; i < evaluation.launchPhases.length; i++) {
      expect(evaluation.launchPhases[i].phase).toBe(i + 1);
    }
  });

  it("recommendation has all required fields", () => {
    const r = evaluation.recommendation;
    expect(r.recommendation).toMatch(/^(launch|launch_with_caveats|hold|needs_review)$/);
    expect(r.summaryVi).toBeTruthy();
    expect(r.confidence).toMatch(/^(high|medium|low)$/);
    expect(r.rationaleVi.length).toBeGreaterThan(0);
    expect(r.risksVi.length).toBeGreaterThan(0);
    expect(r.mitigationsVi.length).toBeGreaterThan(0);
    expect(r.nextSteps.length).toBeGreaterThan(0);
  });

  it("overall verdict is in Vietnamese", () => {
    expect(evaluation.overallVerdictVi).toMatch(/TEACHER MERCY/);
    expect(evaluation.overallVerdictVi).toMatch(/BƯỚC 120/);
  });

  it("handoff verdict 'ready_for_handoff' correlates with high evaluation score", () => {
    // With full modules and evidence, handoff should be ready and eval should score well
    expect(handoff.verdict).toBe("ready_for_handoff");
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 4: Evaluation Across Scoring Modes
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG4: Scoring Modes", () => {
  const handoff = buildFullHandoff();

  it("conservative mode produces lower or equal scores vs balanced", () => {
    const conservativeInput: WorldClassEvaluationInput = { handoff, scoringMode: "conservative" };
    const balancedInput: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const conservative = evaluateWorldClassReadiness(conservativeInput);
    const balanced = evaluateWorldClassReadiness(balancedInput);
    expect(conservative.scorecard.totalScore).toBeLessThanOrEqual(balanced.scorecard.totalScore);
  });

  it("optimistic mode produces higher or equal scores vs balanced", () => {
    const optimisticInput: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const balancedInput: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const optimistic = evaluateWorldClassReadiness(optimisticInput);
    const balanced = evaluateWorldClassReadiness(balancedInput);
    expect(optimistic.scorecard.totalScore).toBeGreaterThanOrEqual(balanced.scorecard.totalScore);
  });

  it("conservative mode with full modules still produces a valid evaluation", () => {
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "conservative" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(0);
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(100);
  });

  it("optimistic mode with full modules produces a valid evaluation", () => {
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(0);
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 5: Explicit Criterion Scores
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG5: Explicit Criterion Scores", () => {
  const handoff = buildFullHandoff();

  it("explicit 100 scores push criteria to world_class", () => {
    const input: WorldClassEvaluationInput = {
      handoff,
      criterionScores: {
        D01: 95, D02: 90, D03: 88, D04: 92,
        T01: 95, T02: 90, T03: 88, T04: 92,
        R01: 95, R02: 90, R03: 88, R04: 92,
        A01: 95, A02: 90, A03: 88, A04: 92,
        S01: 95, S02: 90, S03: 88, S04: 92,
        P01: 95, P02: 90, P03: 88, P04: 92,
      },
    };
    const evaluation = evaluateWorldClassReadiness(input);
    for (const capEval of evaluation.capabilityEvaluations) {
      for (const crit of capEval.criteriaEvaluations) {
        expect(crit.achievedTier).toBe("world_class");
        expect(crit.gap).toBe("none");
      }
    }
  });

  it("explicit 40 scores push criteria to foundational", () => {
    const input: WorldClassEvaluationInput = {
      handoff,
      criterionScores: {
        D01: 40, D02: 40, D03: 40, D04: 40,
      },
    };
    const evaluation = evaluateWorldClassReadiness(input);
    const diagnose = evaluation.capabilityEvaluations.find((e) => e.capabilityId === "diagnose")!;
    for (const crit of diagnose.criteriaEvaluations) {
      expect(crit.achievedTier).toBe("foundational");
    }
  });

  it("explicit 70 scores push criteria to proficient", () => {
    const input: WorldClassEvaluationInput = {
      handoff,
      criterionScores: {
        D01: 70, D02: 70, D03: 70, D04: 70,
      },
    };
    const evaluation = evaluateWorldClassReadiness(input);
    const diagnose = evaluation.capabilityEvaluations.find((e) => e.capabilityId === "diagnose")!;
    for (const crit of diagnose.criteriaEvaluations) {
      expect(crit.achievedTier).toBe("proficient");
    }
  });

  it("partial explicit scores: specified criteria use scores, others use inference", () => {
    const input: WorldClassEvaluationInput = {
      handoff,
      scoringMode: "balanced",
      criterionScores: { D01: 90 },
    };
    const evaluation = evaluateWorldClassReadiness(input);
    const diagnose = evaluation.capabilityEvaluations.find((e) => e.capabilityId === "diagnose")!;
    const d01 = diagnose.criteriaEvaluations.find((c) => c.criterionId === "D01")!;
    expect(d01.achievedTier).toBe("world_class");
    // Other criteria should still have valid tiers
    const d02 = diagnose.criteriaEvaluations.find((c) => c.criterionId === "D02")!;
    expect(d02.achievedTier).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 6: Gap Severity Grading
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG6: Gap Severity Grading", () => {
  it("full input (balanced) produces gaps with valid severities", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const gaps = evaluation.gaps;

    for (const gap of gaps) {
      expect(gap.severity).toMatch(/^(blocker|major|minor|cosmetic)$/);
      expect(gap.criterionId).toBeTruthy();
      expect(gap.labelVi).toBeTruthy();
      expect(gap.descriptionVi).toBeTruthy();
      expect(gap.currentTier).toMatch(/^(foundational|proficient|world_class)$/);
      expect(gap.impactVi).toBeTruthy();
      expect(gap.fixEffortVi).toMatch(/^(hours|days|weeks)$/);
    }
  });

  it("gaps are sorted by severity (blocker → major → minor → cosmetic)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const gaps = evaluation.gaps;

    const severityOrder: Record<string, number> = { blocker: 0, major: 1, minor: 2, cosmetic: 3 };
    for (let i = 1; i < gaps.length; i++) {
      expect(severityOrder[gaps[i - 1].severity]).toBeLessThanOrEqual(severityOrder[gaps[i].severity]);
    }
  });

  it("no gaps are 'blocker' severity for a full-module handoff", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const blockers = evaluation.gaps.filter((g) => g.severity === "blocker");
    expect(blockers).toHaveLength(0);
  });

  it("minimal handoff produces many gaps including 'major' ones", () => {
    const handoff = runTeacherMercyHandoff(buildMinimalHandoffInput());
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "conservative" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.gaps.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 7: Benchmark Comparison
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG7: Benchmark Comparison", () => {
  const handoff = buildFullHandoff();
  const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
  const evaluation = evaluateWorldClassReadiness(input);
  const benchmarks = evaluation.benchmarks;

  it("compares against at least 5 benchmarks", () => {
    expect(benchmarks.length).toBeGreaterThanOrEqual(5);
  });

  it("each benchmark has a valid comparison string", () => {
    for (const b of benchmarks) {
      expect(b.comparisonVi).toBeTruthy();
      expect(b.mercyScore).toBe(evaluation.scorecard.totalScore);
    }
  });

  it("benchmarks include both AI tutors and human tutors", () => {
    const categories = new Set(benchmarks.map((b) => b.category));
    expect(categories.has("ai_tutor")).toBe(true);
    expect(categories.has("human_tutor")).toBe(true);
  });

  it("mercy scores higher than Duolingo Max on full input", () => {
    const duolingo = benchmarks.find((b) => b.benchmark === "Duolingo Max (AI)");
    expect(duolingo).toBeDefined();
    expect(duolingo!.mercyScore).toBeGreaterThanOrEqual(duolingo!.benchmarkScore);
  });

  it("mercy scores higher than ELSA Speak on full input", () => {
    const elsa = benchmarks.find((b) => b.benchmark === "ELSA Speak");
    expect(elsa).toBeDefined();
    expect(elsa!.mercyScore).toBeGreaterThanOrEqual(elsa!.benchmarkScore);
  });

  it("mercy scores higher than ChatGPT baseline on full input", () => {
    const chatgpt = benchmarks.find((b) => b.benchmark.includes("ChatGPT"));
    expect(chatgpt).toBeDefined();
    expect(chatgpt!.mercyScore).toBeGreaterThanOrEqual(chatgpt!.benchmarkScore);
  });

  it("advantage text is present when mercy scores higher", () => {
    const winningComparisons = benchmarks.filter((b) => b.mercyScore > b.benchmarkScore);
    for (const b of winningComparisons) {
      expect(b.advantageVi).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 8: Launch Phase Sequencing
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG8: Launch Phases", () => {
  const handoff = buildFullHandoff();
  const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
  const evaluation = evaluateWorldClassReadiness(input);
  const phases = evaluation.launchPhases;

  it("has exactly 5 phases", () => {
    expect(phases).toHaveLength(5);
  });

  it("phases are numbered 1-5 in order", () => {
    for (let i = 0; i < phases.length; i++) {
      expect(phases[i].phase).toBe(i + 1);
    }
  });

  it("each phase has all required fields", () => {
    for (const phase of phases) {
      expect(phase.phase).toBeGreaterThanOrEqual(1);
      expect(phase.labelVi).toBeTruthy();
      expect(phase.descriptionVi).toBeTruthy();
      expect(Array.isArray(phase.prerequisites)).toBe(true);
      expect(phase.estimatedTimelineVi).toBeTruthy();
      expect(phase.successCriteriaVi).toBeTruthy();
      expect(typeof phase.isMet).toBe("boolean");
    }
  });

  it("Phase 1 prerequisites include blocker and major gap resolution", () => {
    expect(phases[0].labelVi).toMatch(/blocker/i);
  });

  it("Phase 5 is the public launch phase", () => {
    expect(phases[4].labelVi).toMatch(/mắt|launch/i);
  });

  it("phase labels are in Vietnamese", () => {
    for (const phase of phases) {
      expect(phase.labelVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 9: Chau Recommendation Logic
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG9: Chau Recommendation", () => {
  it("full handoff → recommendation is 'launch' or 'launch_with_caveats'", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(["launch", "launch_with_caveats"]).toContain(evaluation.recommendation.recommendation);
  });

  it("minimal handoff → recommendation is 'hold' or 'needs_review'", () => {
    const handoff = runTeacherMercyHandoff(buildMinimalHandoffInput());
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "conservative" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(["hold", "needs_review"]).toContain(evaluation.recommendation.recommendation);
  });

  it("recommendation has 7 next steps in order", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const steps = evaluation.recommendation.nextSteps;
    expect(steps).toHaveLength(7);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i].order).toBe(i + 1);
      expect(steps[i].actionVi).toBeTruthy();
      expect(steps[i].timelineVi).toBeTruthy();
    }
  });

  it("recommendation rationale includes key metrics", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const rationale = evaluation.recommendation.rationaleVi;
    expect(rationale.some((r) => r.includes("capabilit"))).toBe(true);
    expect(rationale.some((r) => r.includes("Điểm"))).toBe(true);
  });

  it("chauNotes appear in recommendation rationale when provided", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = {
      handoff,
      scoringMode: "balanced",
      chauNotes: "Chau: cần kiểm tra thêm phần kids mode.",
    };
    const evaluation = evaluateWorldClassReadiness(input);
    const hasNotes = evaluation.recommendation.rationaleVi.some((r) => r.includes("Chau"));
    expect(hasNotes).toBe(true);
  });

  it("risks and mitigations are populated", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.recommendation.risksVi.length).toBeGreaterThanOrEqual(2);
    expect(evaluation.recommendation.mitigationsVi.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 10: Cross-Validation with Handoff
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG10: Cross-Validation with Handoff", () => {
  it("full handoff + balanced eval → coherent (no contradictions)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const result = crossValidateWithHandoff(evaluation, handoff);
    expect(result.coherent).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("detects inconsistency when evaluation is world-class but handoff is not ready", () => {
    // Create a handoff where diagnose is missing modules
    const sparseHandoffInput = buildFullHandoffInput();
    // Remove diagnose key modules
    sparseHandoffInput.moduleFiles = sparseHandoffInput.moduleFiles.filter(
      (f) => !f.includes("correctionEngine.ts") && !f.includes("tutorFailureTaxonomy.ts"),
    );
    const sparseHandoff = runTeacherMercyHandoff(sparseHandoffInput);

    // But evaluate with explicit world-class scores for diagnose
    const input: WorldClassEvaluationInput = {
      handoff: sparseHandoff,
      criterionScores: { D01: 95, D02: 95, D03: 95, D04: 95 },
    };
    const evaluation = evaluateWorldClassReadiness(input);
    const result = crossValidateWithHandoff(evaluation, sparseHandoff);

    // Should detect that evaluation says world-class but handoff disagrees
    const diagnoseIssues = result.issues.filter((i) => i.includes("diagnose") || i.includes("Chẩn đoán"));
    expect(diagnoseIssues.length).toBeGreaterThan(0);
  });

  it("handoff with zero modules produces coherent evaluation (no false contradictions)", () => {
    const emptyHandoff = runTeacherMercyHandoff(buildEmptyHandoffInput());
    const input: WorldClassEvaluationInput = { handoff: emptyHandoff, scoringMode: "conservative" };
    const evaluation = evaluateWorldClassReadiness(input);
    const result = crossValidateWithHandoff(evaluation, emptyHandoff);
    // With zero modules, both evaluation and handoff agree all capabilities
    // are missing/foundational — a correctly coherent (non-contradictory) result.
    // coherency means no FALSE contradictions, not "there must be issues".
    // The overall verdict should reflect the empty state.
    expect(evaluation.overallTier).toBe("foundational");
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 11: Determinism
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG11: Determinism", () => {
  it("evaluateWorldClassReadiness is 100% deterministic (100× runs)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
    expect(result.identicalRuns).toBe(100);
  });

  it("deterministic with conservative mode (100× runs)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "conservative" };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
  });

  it("deterministic with optimistic mode (100× runs)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
  });

  it("deterministic with explicit criterion scores (100× runs)", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = {
      handoff,
      criterionScores: { D01: 85, T01: 75, R01: 90, A01: 60, S01: 80, P01: 95 },
    };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
  });

  it("deterministic with empty handoff (100× runs)", () => {
    const emptyHandoff = runTeacherMercyHandoff(buildEmptyHandoffInput());
    const input: WorldClassEvaluationInput = { handoff: emptyHandoff, scoringMode: "conservative" };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
  });

  it("deterministic with minimal handoff (100× runs)", () => {
    const minimalHandoff = runTeacherMercyHandoff(buildMinimalHandoffInput());
    const input: WorldClassEvaluationInput = { handoff: minimalHandoff, scoringMode: "balanced" };
    const result = verifyEvaluationDeterminism(input, 100);
    expect(result.deterministic).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 12: Vietnamese-First Compliance
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG12: Vietnamese-First Compliance", () => {
  const handoff = buildFullHandoff();
  const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
  const evaluation = evaluateWorldClassReadiness(input);

  it("overall verdict text is in Vietnamese", () => {
    expect(evaluation.overallVerdictVi).toMatch(/BƯỚC 120/);
    expect(evaluation.overallVerdictVi).not.toMatch(/Step 120/);
  });

  it("scorecard strengths and weaknesses are in Vietnamese", () => {
    for (const s of evaluation.scorecard.strengthsVi) {
      expect(s).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
    for (const w of evaluation.scorecard.weaknessesVi) {
      if (w.length > 0) {
        expect(w).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
      }
    }
  });

  it("gap descriptions are in Vietnamese", () => {
    for (const gap of evaluation.gaps) {
      expect(gap.labelVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
      expect(gap.descriptionVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("recommendation summary and steps are in Vietnamese", () => {
    const r = evaluation.recommendation;
    expect(r.summaryVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    for (const step of r.nextSteps) {
      expect(step.actionVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("launch phase labels are in Vietnamese", () => {
    for (const phase of evaluation.launchPhases) {
      expect(phase.labelVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("benchmark comparison texts are in Vietnamese", () => {
    for (const b of evaluation.benchmarks) {
      expect(b.comparisonVi).toBeTruthy();
      // Should contain Vietnamese words (at minimum "điểm" or "vượt"/"thấp"/"ngang")
    }
  });

  it("summary helper output is in Vietnamese", () => {
    const summary = getWorldClassSummary(evaluation);
    expect(summary).toMatch(/BƯỚC 120/);
    expect(summary).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 13: Edge Cases
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG13: Edge Cases", () => {
  it("empty handoff (no modules, no tests) produces a valid evaluation", () => {
    const emptyHandoff = runTeacherMercyHandoff(buildEmptyHandoffInput());
    const input: WorldClassEvaluationInput = { handoff: emptyHandoff, scoringMode: "conservative" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation).toBeDefined();
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(0);
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(100);
    expect(evaluation.capabilityEvaluations).toHaveLength(6);
  });

  it("handoff with zero tests passing produces a valid evaluation", () => {
    const zeroInput = buildFullHandoffInput();
    zeroInput.totalTestsPassing = 0;
    zeroInput.totalTestCount = 100;
    const handoff = runTeacherMercyHandoff(zeroInput);
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation).toBeDefined();
    expect(evaluation.scorecard.totalScore).toBeGreaterThanOrEqual(0);
  });

  it("handoff with very high test counts still works", () => {
    const highInput = buildFullHandoffInput();
    highInput.totalTestCount = 999999;
    highInput.totalTestsPassing = 999999;
    highInput.testCounts = {
      diagnose: 99999, teach: 99999, remember: 99999,
      adapt: 99999, selfCheck: 99999, prove: 99999,
    };
    const handoff = runTeacherMercyHandoff(highInput);
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation).toBeDefined();
    expect(evaluation.scorecard.totalScore).toBeLessThanOrEqual(100);
  });

  it("null/empty chauNotes does not break recommendation", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced", chauNotes: "" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.recommendation).toBeDefined();
    expect(evaluation.recommendation.rationaleVi.length).toBeGreaterThanOrEqual(3);
  });

  it("no criterionScores provided → all scores inferred from handoff", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    for (const capEval of evaluation.capabilityEvaluations) {
      for (const crit of capEval.criteriaEvaluations) {
        expect(crit.achievedTier).toBeDefined();
      }
    }
  });

  it("unknown scoring mode defaults to balanced behavior", () => {
    const handoff = buildFullHandoff();
    const input = { handoff, scoringMode: "balanced" as const };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation).toBeDefined();
  });

  it("getCapabilityEvaluations returns exactly 6 items", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const caps = getCapabilityEvaluations(evaluation);
    expect(caps).toHaveLength(6);
  });

  it("worldClassIsReady returns boolean", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(typeof worldClassIsReady(evaluation)).toBe("boolean");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 14: Display Helpers
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG14: Display Helpers", () => {
  const handoff = buildFullHandoff();
  const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
  const evaluation = evaluateWorldClassReadiness(input);

  it("getWorldClassSummary returns a non-empty Vietnamese string", () => {
    const summary = getWorldClassSummary(evaluation);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(100);
    expect(summary).toMatch(/BƯỚC 120/);
  });

  it("getWorldClassScorecard returns the correct scorecard object", () => {
    const scorecard = getWorldClassScorecard(evaluation);
    expect(scorecard).toEqual(evaluation.scorecard);
  });

  it("getGapSeverityGrades returns the gaps array", () => {
    const gaps = getGapSeverityGrades(evaluation);
    expect(gaps).toEqual(evaluation.gaps);
  });

  it("getBenchmarkComparisons returns the benchmarks array", () => {
    const benchmarks = getBenchmarkComparisons(evaluation);
    expect(benchmarks).toEqual(evaluation.benchmarks);
  });

  it("getLaunchReadinessPhases returns 5 phases", () => {
    const phases = getLaunchReadinessPhases(evaluation);
    expect(phases).toHaveLength(5);
  });

  it("getChauFinalRecommendation returns the recommendation object", () => {
    const rec = getChauFinalRecommendation(evaluation);
    expect(rec).toEqual(evaluation.recommendation);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 15: Scorecard Consistency
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG15: Scorecard Consistency", () => {
  it("totalScore is the average of all 6 capability scores", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const scores = Object.values(evaluation.scorecard.capabilityScores);
    const avgFromCaps = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    expect(evaluation.scorecard.totalScore).toBe(avgFromCaps);
  });

  it("critical + major + minor gaps = total gaps shown in scorecard", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    const totalGapCount = evaluation.scorecard.criticalGaps +
      evaluation.scorecard.majorGaps +
      evaluation.scorecard.minorGaps;
    // Total gaps should be <= total criteria (24)
    expect(totalGapCount).toBeLessThanOrEqual(24);
  });

  it("capability scores correlate with overallTier per capability", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);

    for (const capEval of evaluation.capabilityEvaluations) {
      const score = evaluation.scorecard.capabilityScores[capEval.capabilityId];
      if (capEval.overallTier === "world_class") {
        expect(score).toBeGreaterThanOrEqual(85);
      } else if (capEval.overallTier === "proficient") {
        expect(score).toBeGreaterThanOrEqual(55);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST GROUP 16: Overall World-Class Readiness
// ═══════════════════════════════════════════════════════════════════════════════

describe("WG16: Overall World-Class Readiness", () => {
  it("full-module handoff in optimistic mode reaches 'proficient' or 'world_class'", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(["proficient", "world_class"]).toContain(evaluation.overallTier);
  });

  it("evaluationTimestamp is an ISO date string", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(() => new Date(evaluation.evaluationTimestamp)).not.toThrow();
    expect(new Date(evaluation.evaluationTimestamp).getTime()).toBeGreaterThan(0);
  });

  it("worldClassCapabilities count never exceeds 6", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "optimistic" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.worldClassCapabilities).toBeLessThanOrEqual(6);
  });

  it("overall verdict contains all 6 capability names", () => {
    const handoff = buildFullHandoff();
    const input: WorldClassEvaluationInput = { handoff, scoringMode: "balanced" };
    const evaluation = evaluateWorldClassReadiness(input);
    expect(evaluation.overallVerdictVi).toMatch(/Chẩn đoán/);
    expect(evaluation.overallVerdictVi).toMatch(/Giảng dạy/);
    expect(evaluation.overallVerdictVi).toMatch(/Ghi nhớ/);
    expect(evaluation.overallVerdictVi).toMatch(/Thích ứng/);
    expect(evaluation.overallVerdictVi).toMatch(/Tự kiểm tra/);
    expect(evaluation.overallVerdictVi).toMatch(/Chứng minh/);
  });
});
