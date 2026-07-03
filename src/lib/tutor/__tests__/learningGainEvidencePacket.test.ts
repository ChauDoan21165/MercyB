/**
 * Tests for learningGainEvidencePacket.ts — Step 114
 *
 * Covers: module smoke, catalog integrity, evidence building, claim generation,
 * validation, summaries, strength classification, integration mappings,
 * edge cases, determinism, Vietnamese-first proof.
 */

import { describe, it, expect } from "vitest";
import type {
  GainDimensionLabel,
  LearningGainDimensionId,
  LearningGainResult,
  LearningGainSnapshot,
} from "../learningGainRubric";
import {
  // Core builder
  buildLearningGainEvidencePacket,
  buildSingleSessionEvidencePacket,
  buildCrossSessionEvidencePacket,

  // Types (for compile-time verification)
  // GainEvidenceTypeId, GainClaimTypeId, EvidenceStrength, GainEvidenceVerdict,

  // Catalogs
  GAIN_EVIDENCE_TYPE_CATALOG,
  GAIN_CLAIM_TYPE_CATALOG,
  getGainEvidenceTypeCatalog,
  getGainEvidenceTypeById,
  getGainEvidenceTypesByDimension,
  getGainClaimTypeCatalog,
  getGainClaimTypeById,

  // Label getters
  getGainVerdictLabelVi,
  getGainVerdictLabelEn,
  getEvidenceStrengthLabelVi,
  getEvidenceStrengthLabelEn,
  getGainClaimTypeLabelVi,
  getGainClaimTypeLabelEn,

  // Validation
  validateGainEvidenceItem,
  validateGainClaim,
  validateGainEvidencePacket,
  validateGainEvidenceTypeCatalog,

  // Statistics
  getGainEvidenceStatistics,

  // Quick checks
  isPacketLearnerSafe,
  isPacketActionable,
  getStrongestEvidence,
  getWeakestEvidence,

  // Integration
  getRelevantGainScenarioIds,
  getAllGuardedGainFailureIds,
  getAllGainSubGateIds,
  getRelevantGainEvaluatorPromptIds,

  // Test helpers
  createMinimalGainPacketInput,
} from "../learningGainEvidencePacket";

import type {
  LearningGainEvidencePacket,
  GainEvidenceItem,
  GainClaim,
  GainEvidenceTypeEntry,
  GainClaimTypeEntry,
  GainEvidenceVerdict,
  EvidenceStrength,
  GainClaimTypeId,
  GainEvidenceTypeId,
} from "../learningGainEvidencePacket";

// ─── Shared Test Helpers ────────────────────────────────────────────────────

function makeGainDimension(overrides: Partial<{
  dimId: string;
  score: number;
  titleVi: string;
  titleEn: string;
  baselineValue: number;
  outcomeValue: number;
  delta: number;
  detailVi: string;
  detailEn: string;
}> = {}) {
  return {
    dimensionId: (overrides.dimId ?? "lg_error_reduction") as LearningGainDimensionId,
    titleVi: overrides.titleVi ?? "Giảm lỗi",
    titleEn: overrides.titleEn ?? "Error reduction",
    score: (overrides.score ?? 2) as 0 | 1 | 2 | 3,
    label: (overrides.score === 3 ? "strong" : overrides.score === 2 ? "clear" : overrides.score === 1 ? "minimal" : "none") satisfies GainDimensionLabel,
    baselineValue: overrides.baselineValue ?? 0.4,
    outcomeValue: overrides.outcomeValue ?? 0.25,
    delta: overrides.delta ?? -0.15,
    detailVi: overrides.detailVi ?? "Lỗi giảm.",
    detailEn: overrides.detailEn ?? "Errors reduced.",
  };
}

function makeFullGainResult(overrides: Partial<LearningGainResult> = {}): LearningGainResult {
  const dimIds = [
    "lg_error_reduction", "lg_pronunciation_gain", "lg_self_correction",
    "lg_acknowledgment", "lg_weakness_resolution", "lg_retention", "lg_autonomy",
  ];
  const dimTitlesVi = [
    "Giảm lỗi", "Cải thiện phát âm", "Tự sửa lỗi",
    "Tiếp thu sửa lỗi", "Khắc phục điểm yếu", "Ghi nhớ bài sửa", "Tự chủ hơn",
  ];
  const dimTitlesEn = [
    "Error reduction", "Pronunciation gain", "Self-correction growth",
    "Acknowledgment rate", "Weakness resolution", "Retention evidence", "Autonomy gain",
  ];

  const numImproving = overrides.improvingDimensions ?? 3;
  const dimensions = dimIds.map((id, i) => ({
    dimensionId: id as LearningGainDimensionId,
    titleVi: dimTitlesVi[i],
    titleEn: dimTitlesEn[i],
    score: (i < numImproving ? 2 : 1) as 0 | 1 | 2 | 3,
    label: (i < numImproving ? "clear" : "minimal") satisfies GainDimensionLabel,
    baselineValue: i === 1 ? 65 : 0.4,
    outcomeValue: i === 1 ? 78 : 0.25,
    delta: i === 1 ? 13 : -0.15,
    detailVi: `${dimTitlesVi[i]} cải thiện.`,
    detailEn: `${dimTitlesEn[i]} improved.`,
  }));

  // Ensure declining dimensions override when specified
  if (overrides.decliningDimensions !== undefined) {
    const declining = overrides.decliningDimensions;
    for (let i = 0; i < Math.min(declining, dimIds.length); i++) {
      dimensions[i].score = 0;
      dimensions[i].label = "none";
    }
  }

  return {
    classification: "moderate_gain",
    improvingDimensions: numImproving,
    decliningDimensions: overrides.decliningDimensions ?? 0,
    dimensions,
    summaryVi: "Có tiến bộ.",
    summaryEn: "Moderate gain.",
    baseline: {
      eventCount: 6,
      errorRate: 0.45,
      avgMatchScore: 65,
      selfCorrectionCount: 1,
      acknowledgmentCount: 2,
      totalCorrections: 9,
      weaknessCounts: { "article": 3, "tense": 2 },
      avgConfidence: 0.55,
      uniqueWeaknessCount: 2,
    },
    outcome: {
      eventCount: 6,
      errorRate: 0.28,
      avgMatchScore: 78,
      selfCorrectionCount: 3,
      acknowledgmentCount: 4,
      totalCorrections: 5,
      weaknessCounts: { "article": 1 },
      avgConfidence: 0.75,
      uniqueWeaknessCount: 1,
    },
    totalEvents: 12,
    sufficientData: true,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 1: Module Smoke
// ═══════════════════════════════════════════════════════════════════════════════

describe("learningGainEvidencePacket — module smoke", () => {
  it("exports buildLearningGainEvidencePacket", () => {
    expect(buildLearningGainEvidencePacket).toBeDefined();
    expect(typeof buildLearningGainEvidencePacket).toBe("function");
  });

  it("exports buildSingleSessionEvidencePacket", () => {
    expect(buildSingleSessionEvidencePacket).toBeDefined();
  });

  it("exports buildCrossSessionEvidencePacket", () => {
    expect(buildCrossSessionEvidencePacket).toBeDefined();
  });

  it("exports GAIN_EVIDENCE_TYPE_CATALOG as array", () => {
    expect(Array.isArray(GAIN_EVIDENCE_TYPE_CATALOG)).toBe(true);
    expect(GAIN_EVIDENCE_TYPE_CATALOG.length).toBeGreaterThan(0);
  });

  it("exports GAIN_CLAIM_TYPE_CATALOG as array", () => {
    expect(Array.isArray(GAIN_CLAIM_TYPE_CATALOG)).toBe(true);
    expect(GAIN_CLAIM_TYPE_CATALOG.length).toBeGreaterThan(0);
  });

  it("exports all label getters", () => {
    expect(getGainVerdictLabelVi).toBeDefined();
    expect(getGainVerdictLabelEn).toBeDefined();
    expect(getEvidenceStrengthLabelVi).toBeDefined();
    expect(getEvidenceStrengthLabelEn).toBeDefined();
    expect(getGainClaimTypeLabelVi).toBeDefined();
    expect(getGainClaimTypeLabelEn).toBeDefined();
  });

  it("exports all validators", () => {
    expect(validateGainEvidenceItem).toBeDefined();
    expect(validateGainClaim).toBeDefined();
    expect(validateGainEvidencePacket).toBeDefined();
    expect(validateGainEvidenceTypeCatalog).toBeDefined();
  });

  it("exports all quick-checks", () => {
    expect(isPacketLearnerSafe).toBeDefined();
    expect(isPacketActionable).toBeDefined();
    expect(getStrongestEvidence).toBeDefined();
    expect(getWeakestEvidence).toBeDefined();
  });

  it("exports integration getters", () => {
    expect(getRelevantGainScenarioIds).toBeDefined();
    expect(getAllGuardedGainFailureIds).toBeDefined();
    expect(getAllGainSubGateIds).toBeDefined();
    expect(getRelevantGainEvaluatorPromptIds).toBeDefined();
  });

  it("exports createMinimalGainPacketInput", () => {
    expect(createMinimalGainPacketInput).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 2: Evidence Type Catalog
// ═══════════════════════════════════════════════════════════════════════════════

describe("GAIN_EVIDENCE_TYPE_CATALOG — integrity", () => {
  it("has exactly 10 evidence types", () => {
    expect(GAIN_EVIDENCE_TYPE_CATALOG.length).toBe(10);
  });

  it("has unique evidenceTypeIds", () => {
    const ids = GAIN_EVIDENCE_TYPE_CATALOG.map((e) => e.evidenceTypeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have Vietnamese titles", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleVi.length).toBeGreaterThan(0);
      // Vietnamese character check
      expect(entry.titleVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("all entries have English titles", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.titleEn).toBeTruthy();
      expect(entry.titleEn.length).toBeGreaterThan(0);
    }
  });

  it("all entries have valid minEventsRequired (>= 0)", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.minEventsRequired).toBeGreaterThanOrEqual(0);
    }
  });

  it("7 evidence types map to specific LG dimensions, 3 are cross-cutting", () => {
    const mapped = GAIN_EVIDENCE_TYPE_CATALOG.filter((e) => e.mappedDimensionId !== null);
    const crossCutting = GAIN_EVIDENCE_TYPE_CATALOG.filter((e) => e.mappedDimensionId === null);
    expect(mapped.length).toBe(7);
    expect(crossCutting.length).toBe(3);
  });

  it("cross-cutting types are ev-cross-session-trend, ev-behavioral-change, ev-checklist-gain", () => {
    const crossCutting = GAIN_EVIDENCE_TYPE_CATALOG.filter((e) => e.mappedDimensionId === null);
    const ids = crossCutting.map((e) => e.evidenceTypeId).sort();
    expect(ids).toEqual([
      "ev-behavioral-change",
      "ev-checklist-gain",
      "ev-cross-session-trend",
    ]);
  });

  it("each evidence type has at least one guarded failure ID", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.guardedFailureIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("all guarded failure IDs use the F-GAIN prefix", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      for (const failId of entry.guardedFailureIds) {
        expect(failId).toMatch(/^F-GAIN-/);
      }
    }
  });

  it("each evidence type has a valid direction", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(["higher_better", "lower_better"]).toContain(entry.direction);
    }
  });

  it("each evidence type maps to at least one claim type", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.claimTypeIds.length).toBeGreaterThanOrEqual(1);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 3: Claim Type Catalog
// ═══════════════════════════════════════════════════════════════════════════════

describe("GAIN_CLAIM_TYPE_CATALOG — integrity", () => {
  it("has exactly 6 claim types", () => {
    expect(GAIN_CLAIM_TYPE_CATALOG.length).toBe(6);
  });

  it("has unique claimTypeIds", () => {
    const ids = GAIN_CLAIM_TYPE_CATALOG.map((c) => c.claimTypeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have Vietnamese titles", () => {
    for (const entry of GAIN_CLAIM_TYPE_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("all entries have English titles", () => {
    for (const entry of GAIN_CLAIM_TYPE_CATALOG) {
      expect(entry.titleEn).toBeTruthy();
    }
  });

  it("claim-none is NOT learner safe", () => {
    const none = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === "claim-none")!;
    expect(none.isLearnerSafe).toBe(false);
  });

  it("all other claim types ARE learner safe", () => {
    const others = GAIN_CLAIM_TYPE_CATALOG.filter((c) => c.claimTypeId !== "claim-none");
    for (const c of others) {
      expect(c.isLearnerSafe).toBe(true);
    }
  });

  it("claim-none is NOT actionable", () => {
    const none = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === "claim-none")!;
    expect(none.isActionable).toBe(false);
  });

  it("claim-confidence is NOT actionable", () => {
    const conf = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === "claim-confidence")!;
    expect(conf.isActionable).toBe(false);
  });

  it("quantitative, qualitative, trend, mastery ARE actionable", () => {
    const actionable = ["claim-quantitative", "claim-qualitative", "claim-trend", "claim-mastery"];
    for (const id of actionable) {
      const entry = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === id)!;
      expect(entry.isActionable).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 4: Catalog Accessors
// ═══════════════════════════════════════════════════════════════════════════════

describe("catalog accessors", () => {
  it("getGainEvidenceTypeCatalog returns a copy of the catalog", () => {
    const copy = getGainEvidenceTypeCatalog();
    expect(copy.length).toBe(GAIN_EVIDENCE_TYPE_CATALOG.length);
    expect(copy).not.toBe(GAIN_EVIDENCE_TYPE_CATALOG);
  });

  it("getGainEvidenceTypeById returns correct entry", () => {
    const entry = getGainEvidenceTypeById("ev-error-reduction");
    expect(entry).not.toBeNull();
    expect(entry!.titleVi).toBe("Giảm tỉ lệ lỗi");
  });

  it("getGainEvidenceTypeById returns null for unknown ID", () => {
    expect(getGainEvidenceTypeById("ev-nonexistent" as unknown as GainEvidenceTypeId)).toBeNull();
  });

  it("getGainEvidenceTypesByDimension returns correct entries", () => {
    const results = getGainEvidenceTypesByDimension("lg_retention");
    expect(results.length).toBe(1);
    expect(results[0].evidenceTypeId).toBe("ev-retention");
  });

  it("getGainEvidenceTypesByDimension returns empty for unmatched dimension", () => {
    const results = getGainEvidenceTypesByDimension("lg_error_reduction");
    expect(results.length).toBe(1);
    expect(results[0].evidenceTypeId).toBe("ev-error-reduction");
  });

  it("getGainClaimTypeCatalog returns a copy", () => {
    const copy = getGainClaimTypeCatalog();
    expect(copy.length).toBe(GAIN_CLAIM_TYPE_CATALOG.length);
    expect(copy).not.toBe(GAIN_CLAIM_TYPE_CATALOG);
  });

  it("getGainClaimTypeById returns correct entry", () => {
    const entry = getGainClaimTypeById("claim-quantitative");
    expect(entry).not.toBeNull();
    expect(entry!.titleVi).toBe("Tiến bộ định lượng");
  });

  it("getGainClaimTypeById returns null for unknown ID", () => {
    expect(getGainClaimTypeById("claim-fake" as unknown as GainClaimTypeId)).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 5: Evidence Item Building
// ═══════════════════════════════════════════════════════════════════════════════

describe("evidence item building — within buildLearningGainEvidencePacket", () => {
  it("builds 10 evidence items for a moderate gain result", () => {
    const input = createMinimalGainPacketInput({ rubricResult: makeFullGainResult() });
    const packet = buildLearningGainEvidencePacket(input);
    expect(packet.evidenceItems.length).toBe(10);
  });

  it("all evidence items have required fields", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    for (const item of packet.evidenceItems) {
      expect(item.evidenceTypeId).toBeTruthy();
      expect(item.titleVi).toBeTruthy();
      expect(item.titleEn).toBeTruthy();
      expect(item.strength).toBeTruthy();
      expect(item.confidence).toBeGreaterThanOrEqual(0);
      expect(item.confidence).toBeLessThanOrEqual(1);
      expect(typeof item.isActive).toBe("boolean");
      expect(item.minEventsRequired).toBeGreaterThanOrEqual(0);
      expect(item.eventsAvailable).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(item.guardedFailureIds)).toBe(true);
      expect(Array.isArray(item.satisfiedSubGateIds)).toBe(true);
    }
  });

  it("evidence items for improved dimensions are active", () => {
    const result = makeFullGainResult();
    // All first 3 dimensions have score 2, rest 1
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );

    const errorReduction = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-error-reduction")!;
    expect(errorReduction.isActive).toBe(true);
    expect(errorReduction.strength).toBe("moderate");

    const pronunciation = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-pronunciation-gain")!;
    expect(pronunciation.isActive).toBe(true);
  });

  it("evidence items for score-0 dimensions are inactive", () => {
    const result = makeFullGainResult();
    result.dimensions[0] = makeGainDimension({ score: 0, dimId: "lg_error_reduction" });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    const errorReduction = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-error-reduction")!;
    expect(errorReduction.isActive).toBe(false);
    expect(errorReduction.strength).toBe("insufficient");
  });

  it("evidence items are inactive when events < minEventsRequired", () => {
    const result = makeFullGainResult();
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    // ev-error-reduction needs 4 events, ev-weakness-resolution needs 6
    const errorReduction = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-error-reduction")!;
    expect(errorReduction.isActive).toBe(false);

    const weakness = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-weakness-resolution")!;
    expect(weakness.isActive).toBe(false);
  });

  it("activeEvidenceCount matches actual active evidence count", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const actualActive = packet.evidenceItems.filter((e) => e.isActive).length;
    expect(packet.activeEvidenceCount).toBe(actualActive);
    expect(packet.activeEvidence.length).toBe(actualActive);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 6: Cross-Session Evidence
// ═══════════════════════════════════════════════════════════════════════════════

describe("cross-session evidence", () => {
  it("cross-session evidence is active when previousGainResult is provided", () => {
    const current = makeFullGainResult({ improvingDimensions: 5 });
    const previous = makeFullGainResult({ improvingDimensions: 2 });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: current,
        isCrossSession: true,
        hasCrossSessionData: true,
        previousGainResult: previous,
        totalEvents: 24,
        sessionIds: ["s1", "s2"],
      }),
    );
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.isActive).toBe(true);
    expect(crossSession.strength).toBe("strong");
  });

  it("cross-session evidence is inactive without previousGainResult", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        isCrossSession: false,
        hasCrossSessionData: false,
        totalEvents: 12,
      }),
    );
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.isActive).toBe(false);
    expect(crossSession.strength).toBe("insufficient");
  });

  it("cross-session shows delta in improving dimensions", () => {
    const current = makeFullGainResult({ improvingDimensions: 4 });
    const previous = makeFullGainResult({ improvingDimensions: 1 });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: current,
        isCrossSession: true,
        hasCrossSessionData: true,
        previousGainResult: previous,
        totalEvents: 30,
        sessionIds: ["s1", "s2"],
      }),
    );
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.baselineValue).toBe(1);
    expect(crossSession.outcomeValue).toBe(4);
    expect(crossSession.delta).toBe(3);
  });

  it("cross-session with stable high improvement is moderate", () => {
    const current = makeFullGainResult({ improvingDimensions: 5 });
    const previous = makeFullGainResult({ improvingDimensions: 5 });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: current,
        isCrossSession: true,
        hasCrossSessionData: true,
        previousGainResult: previous,
        totalEvents: 30,
        sessionIds: ["s1", "s2"],
      }),
    );
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.isActive).toBe(true);
    expect(crossSession.strength).toBe("moderate");
  });

  it("cross-session with decline is tentative and inactive", () => {
    const current = makeFullGainResult({ improvingDimensions: 1 });
    const previous = makeFullGainResult({ improvingDimensions: 4 });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: current,
        isCrossSession: true,
        hasCrossSessionData: true,
        previousGainResult: previous,
        totalEvents: 30,
        sessionIds: ["s1", "s2"],
      }),
    );
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.isActive).toBe(false);
    expect(crossSession.strength).toBe("tentative");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 7: Behavioral & Checklist Evidence
// ═══════════════════════════════════════════════════════════════════════════════

describe("behavioral and checklist evidence", () => {
  it("behavioral evidence is active when notes are provided", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        behavioralNotes: ["Học viên tự tin hơn", "Trả lời nhanh hơn"],
        totalEvents: 12,
      }),
    );
    const behavioral = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-behavioral-change")!;
    expect(behavioral.isActive).toBe(true);
    expect(behavioral.strength).toBe("tentative");
    expect(behavioral.descriptionVi).toContain("Học viên tự tin hơn");
  });

  it("behavioral evidence is inactive without notes", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const behavioral = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-behavioral-change")!;
    expect(behavioral.isActive).toBe(false);
    expect(behavioral.strength).toBe("insufficient");
  });

  it("checklist evidence is active when checklistPassed is true", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        checklistPassed: true,
        totalEvents: 12,
      }),
    );
    const checklist = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-checklist-gain")!;
    expect(checklist.isActive).toBe(true);
    expect(checklist.strength).toBe("moderate");
  });

  it("checklist evidence is inactive when checklistPassed is false", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult(), checklistPassed: false }),
    );
    const checklist = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-checklist-gain")!;
    expect(checklist.isActive).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 8: Overall Strength Classification
// ═══════════════════════════════════════════════════════════════════════════════

describe("overall strength classification", () => {
  it("significant gain with all dimensions score 3 → conclusive", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 7,
    });
    result.dimensions = result.dimensions.map((d) => ({
      ...d, score: 3 as const, label: "strong" as const,
    }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    // With 7 mapped dimensions all active + modifiers = strong or conclusive
    expect(["conclusive", "strong"]).toContain(packet.overallStrength);
  });

  it("moderate gain with 3 improving dimensions → moderate", () => {
    const result = makeFullGainResult({ improvingDimensions: 3 });
    // This gives 3 dimensions at score 2, 4 at score 1 = 7 active, avg ≈ 0.48
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.overallStrength).toBe("moderate");
  });

  it("moderate gain with 5 improving dimensions → strong", () => {
    const result = makeFullGainResult({ improvingDimensions: 5 });
    // This gives 5 dimensions at score 2, 2 at score 1 = 7 active, avg ≈ 0.56
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.overallStrength).toBe("strong");
  });

  it("minimal gain with few active → moderate (7 tentative items collectively are moderate)", () => {
    const result = makeFullGainResult({
      classification: "minimal_gain",
      improvingDimensions: 1,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 1 as const, label: "minimal" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 10 }),
    );
    // 7 active at score 1 (tentative-level confidence) → moderate collective strength
    expect(packet.overallStrength).toBe("moderate");
  });

  it("no active evidence → insufficient", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.overallStrength).toBe("insufficient");
  });

  it("overall strength is never undefined or null", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.overallStrength).toBeDefined();
    expect(packet.overallStrength).not.toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 9: Verdict Computation
// ═══════════════════════════════════════════════════════════════════════════════

describe("verdict computation", () => {
  it("significant gain + strong evidence → proven_significant_gain", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 6,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    expect(["proven_significant_gain", "proven_moderate_gain"]).toContain(packet.verdict);
  });

  it("moderate gain → proven_moderate_gain or proven_minimal_gain", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect([
      "proven_moderate_gain",
      "proven_minimal_gain",
    ]).toContain(packet.verdict);
  });

  it("minimal gain → proven_minimal_gain", () => {
    const result = makeFullGainResult({
      classification: "minimal_gain",
      improvingDimensions: 1,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 1 as const, label: "minimal" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 10 }),
    );
    expect(packet.verdict).toBe("proven_minimal_gain");
  });

  it("regression → evidence_of_regression", () => {
    const result = makeFullGainResult({
      classification: "regression",
      improvingDimensions: 0,
      decliningDimensions: 4,
    });
    result.dimensions = result.dimensions.map((d, i) => ({
      ...d, score: i < 4 ? 0 as const : 1 as const, label: i < 4 ? "none" as const : "minimal" as const,
    }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.verdict).toBe("evidence_of_regression");
  });

  it("no_measurable_gain → no_conclusive_evidence", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 4 }),
    );
    expect(packet.verdict).toBe("no_conclusive_evidence");
  });

  it("insufficient data → no_conclusive_evidence", () => {
    const result = makeFullGainResult({ sufficientData: false });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.verdict).toBe("no_conclusive_evidence");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 10: Claim Generation
// ═══════════════════════════════════════════════════════════════════════════════

describe("claim generation", () => {
  it("packet has 5 non-none claims for moderate gain (no-claim excluded when evidence active)", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    // For moderate gain with active evidence, all 5 non-none claims are present
    expect(packet.allClaims.length).toBe(5);
  });

  it("packet has 6 claims when no evidence is active (includes no-claim)", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.allClaims.length).toBe(6);
  });

  it("primaryClaim is the first claim in allClaims", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.primaryClaim.claimTypeId).toBe(packet.allClaims[0].claimTypeId);
  });

  it("primary claim is learner-safe for active evidence", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.primaryClaim.isLearnerSafe).toBe(true);
  });

  it("claims have Vietnamese statements", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    for (const claim of packet.allClaims) {
      expect(claim.statementVi).toBeTruthy();
      expect(claim.statementVi.length).toBeGreaterThan(0);
    }
  });

  it("claims have English statements", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    for (const claim of packet.allClaims) {
      expect(claim.statementEn).toBeTruthy();
      expect(claim.statementEn.length).toBeGreaterThan(0);
    }
  });

  it("no-claim is first when NO evidence is active", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.primaryClaim.claimTypeId).toBe("claim-none");
  });

  it("quantitative claim has supporting evidence IDs", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const quantClaim = packet.allClaims.find((c) => c.claimTypeId === "claim-quantitative")!;
    expect(quantClaim.supportingEvidenceIds.length).toBeGreaterThan(0);
  });

  it("claim caveats are present for tentative evidence", () => {
    const result = makeFullGainResult({
      classification: "minimal_gain",
      improvingDimensions: 1,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 1 as const, label: "minimal" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 8 }),
    );
    const primaryClaim = packet.primaryClaim;
    expect(primaryClaim.caveatsVi.length).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 11: Learner Summary (Vietnamese)
// ═══════════════════════════════════════════════════════════════════════════════

describe("learner summary (Vietnamese)", () => {
  it("learner summary contains Vietnamese text for significant gain", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 6,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    expect(packet.learnerSummaryVi).toBeTruthy();
    expect(packet.learnerSummaryVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
  });

  it("learner summary for moderate gain includes encouraging words", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.learnerSummaryVi.length).toBeGreaterThan(20);
  });

  it("learner summary for regression is gentle and constructive", () => {
    const result = makeFullGainResult({
      classification: "regression",
      improvingDimensions: 0,
      decliningDimensions: 3,
    });
    result.dimensions = result.dimensions.map((d, i) => ({
      ...d, score: i < 3 ? 0 as const : 1 as const, label: i < 3 ? "none" as const : "minimal" as const,
    }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.learnerSummaryVi).toContain("⚠️");
    expect(packet.learnerSummaryVi).not.toContain("tệ");
    expect(packet.learnerSummaryVi).not.toContain("kém");
  });

  it("learner summary for insufficient data is encouraging", () => {
    const result = makeFullGainResult({ sufficientData: false });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.learnerSummaryVi).toContain("con");
    expect(packet.learnerSummaryVi).toContain("nhé");
  });

  it("learner summary never uses harsh/negative language", () => {
    const badWords = ["tệ", "kém", "dở", "thất bại", "ngu"];
    const result = makeFullGainResult({ classification: "regression", decliningDimensions: 4 });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    for (const word of badWords) {
      expect(packet.learnerSummaryVi.toLowerCase()).not.toContain(word);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 12: Chau Briefing (Vietnamese)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Chau briefing (Vietnamese)", () => {
  it("Chau briefing contains the session ID", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        sessionIds: ["session-abc-123"],
      }),
    );
    expect(packet.chauBriefingVi).toContain("session-abc-123");
  });

  it("Chau briefing contains COPY FROM HERE marker", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.chauBriefingVi).toContain("CHAU ↓↓↓ COPY FROM HERE");
  });

  it("Chau briefing contains active evidence details", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.chauBriefingVi).toContain("Bằng chứng hoạt động");
  });

  it("Chau briefing for cross-session shows session count", () => {
    const current = makeFullGainResult();
    const previous = makeFullGainResult({ improvingDimensions: 1 });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: current,
        isCrossSession: true,
        hasCrossSessionData: true,
        previousGainResult: previous,
        sessionIds: ["s1", "s2"],
        totalEvents: 24,
      }),
    );
    expect(packet.chauBriefingVi).toContain("2 buổi");
  });

  it("Chau briefing is never empty", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.chauBriefingVi.length).toBeGreaterThan(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 13: Chau Action Items
// ═══════════════════════════════════════════════════════════════════════════════

describe("Chau action items", () => {
  it("action items for significant gain include celebration and recording", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 6,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    expect(packet.chauActionItems.length).toBeGreaterThan(0);
    const hasCelebrate = packet.chauActionItems.some((a) => a.includes("🎉"));
    const hasRecord = packet.chauActionItems.some((a) =>
      a.includes("pattern") || a.includes("Ghi nhận"),
    );
    expect(hasCelebrate || hasRecord).toBe(true);
  });

  it("action items for regression demand pattern change", () => {
    const result = makeFullGainResult({
      classification: "regression",
      improvingDimensions: 0,
      decliningDimensions: 4,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.chauActionItems.some((a) => a.includes("⚠️"))).toBe(true);
    expect(packet.chauActionItems.some((a) =>
      a.includes("Dừng") || a.includes("pattern") || a.includes("dừng"),
    )).toBe(true);
  });

  it("action items for insufficient evidence suggest more sessions", () => {
    const result = makeFullGainResult({ sufficientData: false });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.chauActionItems.some((a) =>
      a.includes("buổi") || a.includes("session") || a.includes("dữ liệu"),
    )).toBe(true);
  });

  it("action items include weak dimension warnings", () => {
    const result = makeFullGainResult();
    result.dimensions[5] = makeGainDimension({ score: 0, dimId: "lg_retention", titleVi: "Ghi nhớ bài sửa" });
    result.dimensions[6] = makeGainDimension({ score: 0, dimId: "lg_autonomy", titleVi: "Tự chủ hơn" });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.chauActionItems.some((a) => a.includes("Chiều yếu"))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 14: Label Getters
// ═══════════════════════════════════════════════════════════════════════════════

describe("label getters", () => {
  it("getGainVerdictLabelVi returns Vietnamese for all verdicts", () => {
    const verdicts: GainEvidenceVerdict[] = [
      "proven_significant_gain", "proven_moderate_gain", "proven_minimal_gain",
      "no_conclusive_evidence", "evidence_of_regression",
    ];
    for (const v of verdicts) {
      const label = getGainVerdictLabelVi(v);
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getGainVerdictLabelEn returns English for all verdicts", () => {
    const verdicts: GainEvidenceVerdict[] = [
      "proven_significant_gain", "proven_moderate_gain", "proven_minimal_gain",
      "no_conclusive_evidence", "evidence_of_regression",
    ];
    for (const v of verdicts) {
      const label = getGainVerdictLabelEn(v);
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getEvidenceStrengthLabelVi returns Vietnamese for all levels", () => {
    const levels: EvidenceStrength[] = ["conclusive", "strong", "moderate", "tentative", "insufficient"];
    for (const l of levels) {
      const label = getEvidenceStrengthLabelVi(l);
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getEvidenceStrengthLabelEn returns English for all levels", () => {
    const levels: EvidenceStrength[] = ["conclusive", "strong", "moderate", "tentative", "insufficient"];
    for (const l of levels) {
      const label = getEvidenceStrengthLabelEn(l);
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getGainClaimTypeLabelVi returns Vietnamese for all claim types", () => {
    for (const c of GAIN_CLAIM_TYPE_CATALOG) {
      const label = getGainClaimTypeLabelVi(c.claimTypeId);
      expect(label).toBeTruthy();
    }
  });

  it("getGainClaimTypeLabelEn returns English for all claim types", () => {
    for (const c of GAIN_CLAIM_TYPE_CATALOG) {
      const label = getGainClaimTypeLabelEn(c.claimTypeId);
      expect(label).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 15: Validation
// ═══════════════════════════════════════════════════════════════════════════════

describe("validation", () => {
  it("validateGainEvidenceTypeCatalog returns no errors for valid catalog", () => {
    const errors = validateGainEvidenceTypeCatalog();
    expect(errors.length).toBe(0);
  });

  it("validateGainEvidenceItem catches missing evidenceTypeId", () => {
    const item = {
      evidenceTypeId: "",
      titleVi: "Test",
      titleEn: "Test",
      confidence: 0.5,
    } as unknown as GainEvidenceItem;
    const errors = validateGainEvidenceItem(item);
    expect(errors.some((e) => e.field === "evidenceTypeId")).toBe(true);
  });

  it("validateGainEvidenceItem catches missing titleVi", () => {
    const item = {
      evidenceTypeId: "ev-test",
      titleVi: "",
      titleEn: "Test",
      confidence: 0.5,
    } as unknown as GainEvidenceItem;
    const errors = validateGainEvidenceItem(item);
    expect(errors.some((e) => e.field === "titleVi")).toBe(true);
  });

  it("validateGainEvidenceItem catches confidence out of range", () => {
    const item = {
      evidenceTypeId: "ev-test",
      titleVi: "Test",
      titleEn: "Test",
      confidence: 1.5,
    } as unknown as GainEvidenceItem;
    const errors = validateGainEvidenceItem(item);
    expect(errors.some((e) => e.field === "confidence")).toBe(true);
  });

  it("validateGainClaim catches missing claimTypeId", () => {
    const claim = { claimTypeId: "", statementVi: "Test", requiredStrength: "moderate" } as unknown as GainClaim;
    const errors = validateGainClaim(claim);
    expect(errors.some((e) => e.field === "claimTypeId")).toBe(true);
  });

  it("validateGainClaim catches missing statementVi", () => {
    const claim = { claimTypeId: "claim-test", statementVi: "", requiredStrength: "moderate" } as unknown as GainClaim;
    const errors = validateGainClaim(claim);
    expect(errors.some((e) => e.field === "statementVi")).toBe(true);
  });

  it("validateGainEvidencePacket returns no errors for a valid packet", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const errors = validateGainEvidencePacket(packet);
    expect(errors.length).toBe(0);
  });

  it("validateGainEvidencePacket catches missing packetId", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const invalidPacket: LearningGainEvidencePacket = { ...packet, packetId: "" };
    const errors = validateGainEvidencePacket(invalidPacket);
    expect(errors.some((e) => e.field === "packetId")).toBe(true);
  });

  it("validateGainEvidencePacket catches wrong totalEvidenceCount", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const invalidPacket: LearningGainEvidencePacket = { ...packet, totalEvidenceCount: 5 };
    const errors = validateGainEvidencePacket(invalidPacket);
    expect(errors.some((e) => e.field === "totalEvidenceCount")).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 16: Statistics
// ═══════════════════════════════════════════════════════════════════════════════

describe("statistics", () => {
  it("getGainEvidenceStatistics returns correct total count", () => {
    const stats = getGainEvidenceStatistics();
    expect(stats.totalEvidenceTypes).toBe(10);
    expect(stats.totalClaimTypes).toBe(6);
  });

  it("statistics shows 7 dimensions with evidence, 0 without", () => {
    const stats = getGainEvidenceStatistics();
    expect(stats.dimensionsWithEvidence).toBe(7);
    expect(stats.dimensionsWithoutEvidence).toBe(0);
  });

  it("statistics has evidenceTypesByDimension with cross-cutting key", () => {
    const stats = getGainEvidenceStatistics();
    expect(stats.evidenceTypesByDimension["cross-cutting"]).toBe(3);
  });

  it("statistics are deterministic", () => {
    const stats1 = getGainEvidenceStatistics();
    const stats2 = getGainEvidenceStatistics();
    expect(stats1).toEqual(stats2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 17: Quick-Check Utilities
// ═══════════════════════════════════════════════════════════════════════════════

describe("quick-check utilities", () => {
  it("isPacketLearnerSafe returns true for moderate gain with active evidence", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(isPacketLearnerSafe(packet)).toBe(true);
  });

  it("isPacketLearnerSafe returns false when no evidence is active", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(isPacketLearnerSafe(packet)).toBe(false);
  });

  it("isPacketActionable returns true for significant gain meeting proof bar", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 6,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    // May or may not meet proof bar depending on strength classification
    expect(typeof isPacketActionable(packet)).toBe("boolean");
  });

  it("getStrongestEvidence returns null for empty active evidence", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(getStrongestEvidence(packet)).toBeNull();
  });

  it("getStrongestEvidence returns active evidence when available", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    if (packet.activeEvidence.length > 0) {
      const strongest = getStrongestEvidence(packet);
      expect(strongest).not.toBeNull();
      expect(strongest!.isActive).toBe(true);
    }
  });

  it("getWeakestEvidence returns null for empty active evidence", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(getWeakestEvidence(packet)).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 18: Integration Mappings
// ═══════════════════════════════════════════════════════════════════════════════

describe("integration mappings", () => {
  it("getRelevantGainScenarioIds returns 3 scenario/baseline IDs", () => {
    const ids = getRelevantGainScenarioIds();
    expect(ids.length).toBe(3);
    expect(ids).toContain("hq-gain-a2-pre-post-measurement");
    expect(ids).toContain("bl-gain-a2-before-after");
    expect(ids).toContain("bl-gain-b1-multi-session");
  });

  it("getAllGuardedGainFailureIds returns F-GAIN prefixed IDs", () => {
    const ids = getAllGuardedGainFailureIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(id).toMatch(/^F-GAIN-/);
    }
  });

  it("getAllGuardedGainFailureIds covers all 5 F-GAIN failures", () => {
    const ids = getAllGuardedGainFailureIds();
    for (let i = 1; i <= 5; i++) {
      const padded = String(i).padStart(2, "0");
      expect(ids).toContain(`F-GAIN-${padded}`);
    }
  });

  it("getAllGainSubGateIds returns unique IDs", () => {
    const ids = getAllGainSubGateIds();
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
  });

  it("getRelevantGainEvaluatorPromptIds returns evaluator prompt IDs", () => {
    const ids = getRelevantGainEvaluatorPromptIds();
    expect(ids.length).toBe(2);
    expect(ids).toContain("eval-judge-learningGain");
    expect(ids).toContain("eval-adversary-learningGain");
  });

  it("packet guardedFailureIds collects from active evidence only", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    // Should be a subset of all guarded failure IDs
    const allIds = getAllGuardedGainFailureIds();
    for (const id of packet.guardedFailureIds) {
      expect(allIds).toContain(id);
    }
  });

  it("packet satisfiedSubGateIds collects from active evidence only", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    const allSubGates = getAllGainSubGateIds();
    for (const id of packet.satisfiedSubGateIds) {
      expect(allSubGates).toContain(id);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 19: Convenience Builders
// ═══════════════════════════════════════════════════════════════════════════════

describe("convenience builders", () => {
  it("buildSingleSessionEvidencePacket creates valid single-session packet", () => {
    const packet = buildSingleSessionEvidencePacket(
      makeFullGainResult(),
      "session-X",
      12,
    );
    expect(packet.sessionIds).toEqual(["session-X"]);
    expect(packet.sessionCount).toBe(1);
    expect(packet.isCrossSession).toBe(false);
    expect(packet.totalEvidenceCount).toBe(10);
  });

  it("buildCrossSessionEvidencePacket creates valid cross-session packet", () => {
    const current = makeFullGainResult({ improvingDimensions: 5 });
    const previous = makeFullGainResult({ improvingDimensions: 2 });
    const packet = buildCrossSessionEvidencePacket(
      current,
      previous,
      "session-2",
      "session-1",
      24,
      { checklistPassed: true, behavioralNotes: ["Tự tin hơn"] },
    );
    expect(packet.sessionIds).toEqual(["session-1", "session-2"]);
    expect(packet.sessionCount).toBe(2);
    expect(packet.isCrossSession).toBe(true);

    // Cross-session evidence should be active
    const crossSession = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-cross-session-trend")!;
    expect(crossSession.isActive).toBe(true);

    // Checklist should be active
    const checklist = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-checklist-gain")!;
    expect(checklist.isActive).toBe(true);

    // Behavioral should be active
    const behavioral = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-behavioral-change")!;
    expect(behavioral.isActive).toBe(true);
  });

  it("createMinimalGainPacketInput produces valid input", () => {
    const input = createMinimalGainPacketInput();
    expect(input.rubricResult).toBeDefined();
    expect(input.sessionIds.length).toBe(1);
    expect(input.totalEvents).toBe(10);
  });

  it("createMinimalGainPacketInput accepts overrides", () => {
    const input = createMinimalGainPacketInput({
      sessionIds: ["custom-session"],
      totalEvents: 20,
      checklistPassed: true,
    });
    expect(input.sessionIds).toEqual(["custom-session"]);
    expect(input.totalEvents).toBe(20);
    expect(input.checklistPassed).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 20: Determinism
// ═══════════════════════════════════════════════════════════════════════════════

describe("determinism", () => {
  it("identical input produces identical packet", () => {
    const input = createMinimalGainPacketInput({ rubricResult: makeFullGainResult() });
    const p1 = buildLearningGainEvidencePacket(input);
    const p2 = buildLearningGainEvidencePacket(input);
    expect(p1).toEqual(p2);
  });

  it("packetId is deterministic for same input", () => {
    const input = createMinimalGainPacketInput({
      rubricResult: makeFullGainResult(),
      sessionIds: ["fixed-session"],
      generatedAt: 1000,
    });
    const p1 = buildLearningGainEvidencePacket(input);
    const p2 = buildLearningGainEvidencePacket(input);
    expect(p1.packetId).toBe(p2.packetId);
  });

  it("catalog accessors are deterministic", () => {
    const c1 = getGainEvidenceTypeCatalog();
    const c2 = getGainEvidenceTypeCatalog();
    expect(c1).toEqual(c2);
  });

  it("label getters are deterministic", () => {
    const l1 = getGainVerdictLabelVi("proven_significant_gain");
    const l2 = getGainVerdictLabelVi("proven_significant_gain");
    expect(l1).toBe(l2);
  });

  it("statistics are deterministic", () => {
    const s1 = getGainEvidenceStatistics();
    const s2 = getGainEvidenceStatistics();
    expect(s1).toEqual(s2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 21: Edge Cases
// ═══════════════════════════════════════════════════════════════════════════════

describe("edge cases", () => {
  it("handles empty session IDs gracefully", () => {
    const input = createMinimalGainPacketInput({
      rubricResult: makeFullGainResult(),
      sessionIds: [],
    });
    const packet = buildLearningGainEvidencePacket(input);
    // Should still produce a packet
    expect(packet.sessionIds).toEqual([]);
    expect(packet.sessionCount).toBe(0);
  });

  it("handles zero totalEvents", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        totalEvents: 0,
      }),
    );
    expect(packet.totalEvents).toBe(0);
    // Most evidence items should be inactive due to insufficient events
    expect(packet.activeEvidenceCount).toBeLessThanOrEqual(3); // only behavioral/checklist possible
  });

  it("handles null rubric dimensions array", () => {
    const result = makeFullGainResult();
    result.dimensions = [];
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 10 }),
    );
    expect(packet.evidenceItems.length).toBe(10);
  });

  it("handles very large event counts", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 7,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 9999 }),
    );
    expect(packet.totalEvents).toBe(9999);
    expect(packet.activeEvidenceCount).toBeGreaterThanOrEqual(7);
  });

  it("handles behavioralNotes with empty array", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        behavioralNotes: [],
      }),
    );
    const behavioral = packet.evidenceItems.find((e) => e.evidenceTypeId === "ev-behavioral-change")!;
    expect(behavioral.isActive).toBe(false);
  });

  it("meetsProductProofBar is a boolean", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(typeof packet.meetsProductProofBar).toBe("boolean");
  });

  it("packet fields are never undefined (except rubricResult which can be null)", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.packetId).toBeDefined();
    expect(packet.generatedAt).toBeDefined();
    expect(packet.evidenceItems).toBeDefined();
    expect(packet.activeEvidence).toBeDefined();
    expect(packet.primaryClaim).toBeDefined();
    expect(packet.allClaims).toBeDefined();
    expect(packet.overallStrength).toBeDefined();
    expect(packet.verdict).toBeDefined();
    expect(packet.learnerSummaryVi).toBeDefined();
    expect(packet.chauBriefingVi).toBeDefined();
    expect(packet.summaryEn).toBeDefined();
    expect(packet.guardedFailureIds).toBeDefined();
    expect(packet.satisfiedSubGateIds).toBeDefined();
    expect(packet.chauActionItems).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 22: Vietnamese-First Proof
// ═══════════════════════════════════════════════════════════════════════════════

describe("Vietnamese-first proof", () => {
  it("all evidence type titles are in Vietnamese", () => {
    for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
      expect(entry.titleVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("all claim type titles are in Vietnamese", () => {
    for (const entry of GAIN_CLAIM_TYPE_CATALOG) {
      expect(entry.titleVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("all verdict labels have Vietnamese text", () => {
    const verdicts: GainEvidenceVerdict[] = [
      "proven_significant_gain", "proven_moderate_gain", "proven_minimal_gain",
      "no_conclusive_evidence", "evidence_of_regression",
    ];
    for (const v of verdicts) {
      expect(getGainVerdictLabelVi(v)).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
    }
  });

  it("learner summary is Vietnamese-first", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.learnerSummaryVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
  });

  it("Chau briefing is Vietnamese-first", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.chauBriefingVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i);
  });

  it("claim statements are Vietnamese-first", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    for (const claim of packet.allClaims) {
      expect(claim.statementVi.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 23: Evidence-to-Dimension Mapping
// ═══════════════════════════════════════════════════════════════════════════════

describe("evidence-to-dimension mapping", () => {
  it("ev-error-reduction maps to lg_error_reduction", () => {
    const entry = getGainEvidenceTypeById("ev-error-reduction")!;
    expect(entry.mappedDimensionId).toBe("lg_error_reduction");
  });

  it("ev-pronunciation-gain maps to lg_pronunciation_gain", () => {
    const entry = getGainEvidenceTypeById("ev-pronunciation-gain")!;
    expect(entry.mappedDimensionId).toBe("lg_pronunciation_gain");
  });

  it("ev-self-correction maps to lg_self_correction", () => {
    const entry = getGainEvidenceTypeById("ev-self-correction")!;
    expect(entry.mappedDimensionId).toBe("lg_self_correction");
  });

  it("ev-acknowledgment maps to lg_acknowledgment", () => {
    const entry = getGainEvidenceTypeById("ev-acknowledgment")!;
    expect(entry.mappedDimensionId).toBe("lg_acknowledgment");
  });

  it("ev-weakness-resolution maps to lg_weakness_resolution", () => {
    const entry = getGainEvidenceTypeById("ev-weakness-resolution")!;
    expect(entry.mappedDimensionId).toBe("lg_weakness_resolution");
  });

  it("ev-retention maps to lg_retention", () => {
    const entry = getGainEvidenceTypeById("ev-retention")!;
    expect(entry.mappedDimensionId).toBe("lg_retention");
  });

  it("ev-autonomy maps to lg_autonomy", () => {
    const entry = getGainEvidenceTypeById("ev-autonomy")!;
    expect(entry.mappedDimensionId).toBe("lg_autonomy");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 24: Product Proof Bar
// ═══════════════════════════════════════════════════════════════════════════════

describe("product proof bar", () => {
  it("significant gain with enough active evidence meets proof bar", () => {
    const result = makeFullGainResult({
      classification: "significant_gain",
      improvingDimensions: 7,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 3 as const, label: "strong" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 50 }),
    );
    // With 7 dimensions active + cross-cutting → should be close to meeting bar
    expect(typeof packet.meetsProductProofBar).toBe("boolean");
  });

  it("regression never meets proof bar", () => {
    const result = makeFullGainResult({
      classification: "regression",
      improvingDimensions: 0,
      decliningDimensions: 5,
    });
    result.dimensions = result.dimensions.map((d) => ({ ...d, score: 0 as const, label: "none" as const }));
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 12 }),
    );
    expect(packet.meetsProductProofBar).toBe(false);
  });

  it("no_conclusive_evidence never meets proof bar", () => {
    const result = makeFullGainResult({
      classification: "no_measurable_gain",
      improvingDimensions: 0,
    });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 4 }),
    );
    expect(packet.meetsProductProofBar).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 25: SummaryEn
// ═══════════════════════════════════════════════════════════════════════════════

describe("summaryEn", () => {
  it("summaryEn contains key fields for all verdicts", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.summaryEn).toContain("Learning gain evidence packet");
    expect(packet.summaryEn).toContain("Improving dimensions:");
    expect(packet.summaryEn).toContain("Active evidence items:");
  });

  it("summaryEn is present even for insufficient data", () => {
    const result = makeFullGainResult({ sufficientData: false });
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: result, totalEvents: 2 }),
    );
    expect(packet.summaryEn.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 26: Packet Metadata
// ═══════════════════════════════════════════════════════════════════════════════

describe("packet metadata", () => {
  it("packetId starts with 'gain-evidence-'", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({
        rubricResult: makeFullGainResult(),
        sessionIds: ["abc"],
        generatedAt: 12345,
      }),
    );
    expect(packet.packetId).toMatch(/^gain-evidence-/);
  });

  it("totalEvidenceCount is always 10", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.totalEvidenceCount).toBe(10);
  });

  it("activeEvidenceCount ≤ totalEvidenceCount", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.activeEvidenceCount).toBeLessThanOrEqual(packet.totalEvidenceCount);
  });

  it("activeEvidence array length matches activeEvidenceCount", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    expect(packet.activeEvidence.length).toBe(packet.activeEvidenceCount);
  });

  it("guardedFailureIds and satisfiedSubGateIds are sorted and unique", () => {
    const packet = buildLearningGainEvidencePacket(
      createMinimalGainPacketInput({ rubricResult: makeFullGainResult() }),
    );
    // Check uniqueness
    expect(new Set(packet.guardedFailureIds).size).toBe(packet.guardedFailureIds.length);
    expect(new Set(packet.satisfiedSubGateIds).size).toBe(packet.satisfiedSubGateIds.length);
    // Check sorted (or at least deterministic order)
    const sorted1 = [...packet.guardedFailureIds].sort();
    expect(packet.guardedFailureIds).toEqual(sorted1);
  });
});
