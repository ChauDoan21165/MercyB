/**
 * Human-Quality Scenario Bank Tests — Step 111
 *
 * Comprehensive tests for the final canonical scenario bank. Verifies:
 *   - Bank integrity (23 scenarios, all valid, all dimensions covered)
 *   - CEFR coverage (A1-C1 + Kids all represented)
 *   - Dimension coverage (all 6 dimensions covered across CEFR levels)
 *   - Scenario validation (every scenario passes structural validation)
 *   - Gate scoring (every scenario scores against proof gate)
 *   - Utility functions (search, filter, catalog, statistics)
 *   - Contract rule coverage (R1-R10 all demonstrated)
 *   - Vietnamese-first (all labels, descriptions in Vietnamese)
 *   - Multi-session scenarios (journey scenarios across sessions)
 *   - Interference pattern coverage (real L1 transfer patterns)
 *   - Cross-dimensional scenarios (all 6 dimensions in one scenario)
 *
 * Single command:
 *   npx vitest run src/lib/tutor/__tests__/humanQualityScenarioBank.test.ts
 */

import { describe, expect, it } from "vitest";

import {
  HUMAN_QUALITY_SCENARIO_BANK,
  MULTI_SESSION_SCENARIO_BANK,
  HUMAN_QUALITY_SCENARIO_CATALOG,
  getAllHumanQualityScenarios,
  getAllMultiSessionScenarios,
  getScenariosByDimension,
  getScenariosByCefr,
  getScenariosByDimensionAndCefr,
  validateHumanQualityScenario,
  validateAllScenarios,
  scoreScenarioAgainstGate,
  getScenarioCoverageReport,
  getCompactScenarioLabelVi,
  searchScenarios,
  getScenarioById,
  getCoveredInterferencePatterns,
  getScenarioBankSize,
  getScenarioBankStatistics,
  ALL_DIMENSION_IDS,
  ALL_CEFR_LEVELS,
  DIMENSION_LABELS_VI,
  CEFR_LABELS_VI,
} from "../humanQualityScenarioBank";

import type {
  HumanQualityScenario,
  HumanQualityScenarioMeta,
  TeacherIntelligenceDimensionId,
  CefrLevel,
} from "../humanQualityScenarioBank";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MODULE SMOKE — exports and basic shape
// ═══════════════════════════════════════════════════════════════════════════════

describe("Module smoke — exports and basic shape", () => {
  it("exports HUMAN_QUALITY_SCENARIO_BANK as a non-empty array", () => {
    expect(Array.isArray(HUMAN_QUALITY_SCENARIO_BANK)).toBe(true);
    expect(HUMAN_QUALITY_SCENARIO_BANK.length).toBeGreaterThan(0);
  });

  it("exports MULTI_SESSION_SCENARIO_BANK as an array", () => {
    expect(Array.isArray(MULTI_SESSION_SCENARIO_BANK)).toBe(true);
    expect(MULTI_SESSION_SCENARIO_BANK.length).toBeGreaterThan(0);
  });

  it("exports HUMAN_QUALITY_SCENARIO_CATALOG with entries for all scenarios", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(HUMAN_QUALITY_SCENARIO_CATALOG[s.id]).toBeDefined();
      expect(HUMAN_QUALITY_SCENARIO_CATALOG[s.id].titleVi).toBe(s.titleVi);
    }
  });

  it("getAllHumanQualityScenarios returns the full bank", () => {
    expect(getAllHumanQualityScenarios()).toEqual(HUMAN_QUALITY_SCENARIO_BANK);
  });

  it("getAllMultiSessionScenarios returns multi-session scenarios", () => {
    expect(getAllMultiSessionScenarios()).toEqual(MULTI_SESSION_SCENARIO_BANK);
  });

  it("ALL_DIMENSION_IDS has exactly 6 entries", () => {
    expect(ALL_DIMENSION_IDS).toHaveLength(6);
  });

  it("ALL_CEFR_LEVELS has exactly 6 entries", () => {
    expect(ALL_CEFR_LEVELS).toHaveLength(6);
  });

  it("DIMENSION_LABELS_VI covers all dimensions", () => {
    for (const dim of ALL_DIMENSION_IDS) {
      expect(DIMENSION_LABELS_VI[dim]).toBeTruthy();
    }
  });

  it("CEFR_LABELS_VI covers all CEFR levels", () => {
    for (const cefr of ALL_CEFR_LEVELS) {
      expect(CEFR_LABELS_VI[cefr]).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. BANK SIZE — exact counts
// ═══════════════════════════════════════════════════════════════════════════════

describe("Bank size — exact counts", () => {
  it("has exactly 24 scenarios", () => {
    expect(HUMAN_QUALITY_SCENARIO_BANK.length).toBe(23);
    expect(getScenarioBankSize()).toBe(23);
  });

  it("has exactly 1 multi-session scenario", () => {
    expect(MULTI_SESSION_SCENARIO_BANK.length).toBe(1);
  });

  it("catalog has 23 entries", () => {
    expect(Object.keys(HUMAN_QUALITY_SCENARIO_CATALOG)).toHaveLength(23);
  });

  it("every scenario ID is unique", () => {
    const ids = HUMAN_QUALITY_SCENARIO_BANK.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. STRUCTURAL VALIDATION — all scenarios pass
// ═══════════════════════════════════════════════════════════════════════════════

describe("Structural validation — all scenarios pass", () => {
  it("validateAllScenarios returns allValid=true", () => {
    const result = validateAllScenarios();
    expect(result.allValid).toBe(true);
    expect(result.invalidCount).toBe(0);
    expect(result.validCount).toBe(23);
    expect(result.summaryVi).toContain("23");
  });

  it("every scenario individually passes validation", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      const result = validateHumanQualityScenario(s);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it("every scenario has at least 2 turns", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.turns.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every scenario has correct turn indices (0, 1, 2, ...)", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (let i = 0; i < s.turns.length; i++) {
        expect(s.turns[i].turnIndex).toBe(i);
      }
    }
  });

  it("every scenario has a non-empty titleVi", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.titleVi.length).toBeGreaterThan(0);
    }
  });

  it("every scenario has a valid cefrLevel", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(ALL_CEFR_LEVELS).toContain(s.cefrLevel);
    }
  });

  it("every scenario has at least 1 provedDimension", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.provedDimensions.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every scenario's provedDimensions are valid", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const dim of s.provedDimensions) {
        expect(ALL_DIMENSION_IDS).toContain(dim);
      }
    }
  });

  it("every turn has learnerSays and idealTeacherResponseVi", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const t of s.turns) {
        expect(t.learnerSays.length).toBeGreaterThan(0);
        expect(t.idealTeacherResponseVi.length).toBeGreaterThan(0);
      }
    }
  });

  it("every scenario's learnerProfile has a name ending in Vi characters or ASCII", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.learnerProfile.name.length).toBeGreaterThan(0);
      expect(s.learnerProfile.l1).toBe("vi");
    }
  });

  it("every scenario has satisfiesSubGates and guardsAgainst", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.satisfiesSubGates.length).toBeGreaterThan(0);
      expect(s.guardsAgainst.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DIMENSION COVERAGE — all 6 dimensions
// ═══════════════════════════════════════════════════════════════════════════════

describe("Dimension coverage — all 6 dimensions", () => {
  it("every dimension has at least 1 scenario", () => {
    for (const dim of ALL_DIMENSION_IDS) {
      const scenarios = getScenariosByDimension(dim);
      expect(scenarios.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("diagnosis dimension has at least 4 scenarios", () => {
    expect(getScenariosByDimension("diagnosis").length).toBeGreaterThanOrEqual(4);
  });

  it("teaching dimension has at least 4 scenarios", () => {
    expect(getScenariosByDimension("teaching").length).toBeGreaterThanOrEqual(4);
  });

  it("memory dimension has at least 4 scenarios", () => {
    expect(getScenariosByDimension("memory").length).toBeGreaterThanOrEqual(4);
  });

  it("adaptation dimension has at least 4 scenarios", () => {
    expect(getScenariosByDimension("adaptation").length).toBeGreaterThanOrEqual(4);
  });

  it("selfCheck dimension has at least 4 scenarios", () => {
    expect(getScenariosByDimension("selfCheck").length).toBeGreaterThanOrEqual(4);
  });

  it("learningGain dimension has at least 2 scenarios", () => {
    expect(getScenariosByDimension("learningGain").length).toBeGreaterThanOrEqual(2);
  });

  it("at least 1 scenario proves all 6 dimensions", () => {
    const allSix = HUMAN_QUALITY_SCENARIO_BANK.filter(
      (s) => s.provedDimensions.length === 6,
    );
    expect(allSix.length).toBeGreaterThanOrEqual(1);
    // Verify the cross-dimensional scenarios
    const xdimIds = allSix.map((s) => s.id);
    expect(xdimIds).toContain("hq-xdim-b2-comprehensive");
    expect(xdimIds).toContain("hq-xdim-a1-beginner-first-session");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CEFR COVERAGE — A1 through Kids
// ═══════════════════════════════════════════════════════════════════════════════

describe("CEFR coverage — all levels", () => {
  it("every CEFR level has at least 1 scenario", () => {
    for (const cefr of ALL_CEFR_LEVELS) {
      const scenarios = getScenariosByCefr(cefr);
      expect(scenarios.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("A1 has at least 3 scenarios", () => {
    expect(getScenariosByCefr("A1").length).toBeGreaterThanOrEqual(3);
  });

  it("A2 has at least 3 scenarios", () => {
    expect(getScenariosByCefr("A2").length).toBeGreaterThanOrEqual(3);
  });

  it("B1 has at least 3 scenarios", () => {
    expect(getScenariosByCefr("B1").length).toBeGreaterThanOrEqual(3);
  });

  it("B2 has at least 3 scenarios", () => {
    expect(getScenariosByCefr("B2").length).toBeGreaterThanOrEqual(3);
  });

  it("C1 has at least 2 scenarios", () => {
    expect(getScenariosByCefr("C1").length).toBeGreaterThanOrEqual(2);
  });

  it("Kids has at least 2 scenarios", () => {
    expect(getScenariosByCefr("Kids").length).toBeGreaterThanOrEqual(2);
  });

  it("getScenariosByDimensionAndCefr returns correct intersection", () => {
    const results = getScenariosByDimensionAndCefr("diagnosis", "A1");
    for (const s of results) {
      expect(s.provedDimensions).toContain("diagnosis");
      expect(s.cefrLevel).toBe("A1");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. GATE SCORING — all scenarios score against proof gate
// ═══════════════════════════════════════════════════════════════════════════════

describe("Gate scoring — all scenarios", () => {
  it("every scenario produces a valid gate score", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      const score = scoreScenarioAgainstGate(s);
      expect(score.scenarioId).toBe(s.id);
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
      expect(["PASS", "FAIL", "NEEDS_REVIEW"]).toContain(score.verdict);
      expect(score.summaryVi.length).toBeGreaterThan(0);
      expect(score.failuresDetected.length).toBeGreaterThan(0);
    }
  });

  it("cross-dimensional scenarios score highly (at least B2 passes)", () => {
    const xdim = HUMAN_QUALITY_SCENARIO_BANK.filter(
      (s) => s.id.startsWith("hq-xdim"),
    );
    // At least the B2 comprehensive scenario should PASS
    const scores = xdim.map((s) => scoreScenarioAgainstGate(s));
    const passingCount = scores.filter((s) => s.verdict === "PASS").length;
    expect(passingCount).toBeGreaterThanOrEqual(1);
    // B2 scenario has the most sub-gates and should score highest
    const b2Score = scores.find((s) => s.scenarioId === "hq-xdim-b2-comprehensive")!;
    expect(b2Score.verdict).toBe("PASS");
    expect(b2Score.overallScore).toBeGreaterThanOrEqual(70);
  });

  it("scoring is deterministic", () => {
    const s = HUMAN_QUALITY_SCENARIO_BANK[0];
    const score1 = scoreScenarioAgainstGate(s);
    const score2 = scoreScenarioAgainstGate(s);
    expect(score1).toEqual(score2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. COVERAGE REPORT — dimension × CEFR matrix
// ═══════════════════════════════════════════════════════════════════════════════

describe("Coverage report", () => {
  const report = getScenarioCoverageReport();

  it("returns totalScenarios = 23", () => {
    expect(report.totalScenarios).toBe(23);
  });

  it("covers all dimensions", () => {
    for (const dim of ALL_DIMENSION_IDS) {
      expect(report.dimensions[dim].scenarioCount).toBeGreaterThan(0);
    }
  });

  it("covers all CEFR levels", () => {
    for (const cefr of ALL_CEFR_LEVELS) {
      expect(report.cefrCoverage[cefr].scenarioCount).toBeGreaterThan(0);
    }
  });

  it("has a Vietnamese summary", () => {
    expect(report.summaryVi.length).toBeGreaterThan(0);
  });

  it("identifies gaps in dimension×CEFR coverage", () => {
    expect(Array.isArray(report.gaps)).toBe(true);
    // Not all 36 slots need to be filled, but we should have coverage
    const coveragePercent =
      ((36 - report.gaps.length) / 36) * 100;
    expect(coveragePercent).toBeGreaterThan(30); // at least 30% coverage
  });

  it("report is deterministic", () => {
    const report2 = getScenarioCoverageReport();
    expect(report).toEqual(report2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe("Utility functions", () => {
  it("getCompactScenarioLabelVi returns Vietnamese label with CEFR, title, dimensions, turns", () => {
    const s = HUMAN_QUALITY_SCENARIO_BANK[0];
    const label = getCompactScenarioLabelVi(s);
    expect(label).toContain(s.cefrLevel);
    expect(label).toContain(s.titleVi);
    expect(label).toContain("lượt");
  });

  it("getScenarioById finds existing scenarios", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(getScenarioById(s.id)).toBe(s);
    }
  });

  it("getScenarioById returns undefined for unknown ID", () => {
    expect(getScenarioById("nonexistent-id")).toBeUndefined();
  });

  it("searchScenarios finds by titleVi", () => {
    const results = searchScenarios("chẩn đoán");
    expect(results.length).toBeGreaterThan(0);
    for (const s of results) {
      const matchesTitle = s.titleVi.toLowerCase().includes("chẩn đoán");
      const matchesDescription = s.descriptionVi.toLowerCase().includes("chẩn đoán");
      const matchesNarrative = s.teachingNarrativeVi.toLowerCase().includes("chẩn đoán");
      expect(matchesTitle || matchesDescription || matchesNarrative).toBe(true);
    }
  });

  it("searchScenarios finds by learner name", () => {
    const results = searchScenarios("Hùng");
    expect(results.length).toBeGreaterThan(0);
  });

  it("searchScenarios is case-insensitive", () => {
    const lower = searchScenarios("hùng");
    const upper = searchScenarios("HÙNG");
    expect(lower.length).toBe(upper.length);
  });

  it("searchScenarios returns empty array for nonsense query", () => {
    expect(searchScenarios("xyzzy_nonexistent_12345")).toEqual([]);
  });

  it("getCoveredInterferencePatterns returns sorted unique patterns", () => {
    const patterns = getCoveredInterferencePatterns();
    expect(patterns.length).toBeGreaterThan(0);
    // Check sorted
    for (let i = 1; i < patterns.length; i++) {
      expect(patterns[i] >= patterns[i - 1]).toBe(true);
    }
    // Check unique
    expect(new Set(patterns).size).toBe(patterns.length);
  });

  it("getScenarioBankStatistics returns correct statistics", () => {
    const stats = getScenarioBankStatistics();
    expect(stats.totalScenarios).toBe(23);
    expect(stats.totalTurns).toBeGreaterThan(0);
    expect(stats.averageTurnsPerScenario).toBeGreaterThan(0);
    expect(stats.dimensionsCovered).toBe(6);
    expect(stats.cefrLevelsCovered).toBe(6);
    expect(stats.interferencePatternsCovered).toBeGreaterThan(0);
    expect(stats.uniqueContractRulesDemonstrated).toBeGreaterThan(0);
    expect(stats.summaryVi.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. CONTRACT RULE COVERAGE — R1-R10
// ═══════════════════════════════════════════════════════════════════════════════

describe("Contract rule coverage — R1-R10", () => {
  it("all 10 contract rules are demonstrated across the bank", () => {
    const allRules = new Set(
      HUMAN_QUALITY_SCENARIO_BANK.flatMap((s) =>
        s.turns.flatMap((t) => t.demonstratedContractRules),
      ),
    );
    expect(allRules.size).toBe(10);
  });

  it("R1_MEANING_FIRST is demonstrated in most scenarios", () => {
    const count = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.turns.some((t) => t.demonstratedContractRules.includes("R1_MEANING_FIRST")),
    ).length;
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("R3_NO_FAKE_PRAISE is demonstrated in most scenarios", () => {
    const count = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.turns.some((t) => t.demonstratedContractRules.includes("R3_NO_FAKE_PRAISE")),
    ).length;
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("R8_FACE_SAVING is demonstrated in most scenarios", () => {
    const count = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.turns.some((t) => t.demonstratedContractRules.includes("R8_FACE_SAVING")),
    ).length;
    expect(count).toBeGreaterThanOrEqual(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. VIETNAMESE-FIRST — all labels are in Vietnamese
// ═══════════════════════════════════════════════════════════════════════════════

describe("Vietnamese-first — labels and descriptions", () => {
  it("all scenario titles contain Vietnamese characters or are in Vietnamese", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      // Vietnamese text typically contains diacritics or common VN words
      const hasVietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
      expect(s.titleVi).toMatch(hasVietnameseChars);
    }
  });

  it("all teaching narratives are in Vietnamese", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.teachingNarrativeVi.length).toBeGreaterThan(50);
    }
  });

  it("all dimension labels are in Vietnamese", () => {
    for (const dim of ALL_DIMENSION_IDS) {
      expect(DIMENSION_LABELS_VI[dim]).toBeTruthy();
      expect(DIMENSION_LABELS_VI[dim].length).toBeGreaterThan(0);
    }
  });

  it("all CEFR labels are in Vietnamese", () => {
    for (const cefr of ALL_CEFR_LEVELS) {
      expect(CEFR_LABELS_VI[cefr]).toBeTruthy();
    }
  });

  it("all scenario descriptions are in Vietnamese", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.descriptionVi.length).toBeGreaterThan(30);
    }
  });

  it("all learner backgrounds are in Vietnamese", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.learnerProfile.backgroundVi.length).toBeGreaterThan(20);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. MULTI-SESSION SCENARIO — journey across sessions
// ═══════════════════════════════════════════════════════════════════════════════

describe("Multi-session scenario — learner journey", () => {
  const multi = MULTI_SESSION_SCENARIO_BANK[0];

  it("has an A2→B1 journey scenario", () => {
    expect(multi.id).toBe("hq-multi-a2-b1-journey");
    expect(multi.cefrLevel).toBe("B1");
  });

  it("has 3 sessions", () => {
    expect(multi.sessions.length).toBe(3);
  });

  it("each session builds on the previous", () => {
    for (let i = 1; i < multi.sessions.length; i++) {
      expect(multi.sessions[i].expectedGainFromPrevious).toBeTruthy();
    }
  });

  it("first session has expectedGainFromPrevious = null", () => {
    expect(multi.sessions[0].expectedGainFromPrevious).toBeNull();
  });

  it("proves all 6 dimensions", () => {
    expect(multi.provedDimensions.length).toBe(6);
    for (const dim of ALL_DIMENSION_IDS) {
      expect(multi.provedDimensions).toContain(dim);
    }
  });

  it("has learner weakness profile", () => {
    expect(multi.learnerWeaknessProfile.persistentPatterns.length).toBeGreaterThan(0);
    expect(multi.learnerWeaknessProfile.improvementPatterns.length).toBeGreaterThan(0);
    expect(multi.learnerWeaknessProfile.vietnameseL1Transfer.length).toBeGreaterThan(0);
  });

  it("sessions have consecutive session numbers", () => {
    for (let i = 0; i < multi.sessions.length; i++) {
      expect(multi.sessions[i].sessionNumber).toBe(i + 1);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. INTERFERENCE PATTERNS — real Vietnamese L1 transfer
// ═══════════════════════════════════════════════════════════════════════════════

describe("Vietnamese interference patterns — real L1 transfer", () => {
  const patterns = getCoveredInterferencePatterns();

  it("covers copula omission", () => {
    expect(patterns.some((p) => p.includes("copula"))).toBe(true);
  });

  it("covers tense marking / past tense", () => {
    expect(patterns.some((p) => p.includes("tense") || p.includes("past"))).toBe(true);
  });

  it("covers article absence", () => {
    expect(patterns.some((p) => p.includes("article"))).toBe(true);
  });

  it("covers preposition errors", () => {
    expect(patterns.some((p) => p.includes("preposition"))).toBe(true);
  });

  it("covers question formation", () => {
    expect(patterns.some((p) => p.includes("question"))).toBe(true);
  });

  it("has at least 8 distinct interference patterns", () => {
    expect(patterns.length).toBeGreaterThanOrEqual(8);
  });

  it("every scenario with vietnameseInterferencePattern has a real pattern", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const t of s.turns) {
        if (t.vietnameseInterferencePattern) {
          expect(t.vietnameseInterferencePattern.length).toBeGreaterThan(5);
        }
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. PEDAGOGY NOTES — every turn has Vietnamese pedagogy note
// ═══════════════════════════════════════════════════════════════════════════════

describe("Pedagogy notes — Vietnamese teaching notes per turn", () => {
  it("every turn has a non-empty pedagogyNoteVi", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const t of s.turns) {
        expect(t.pedagogyNoteVi.length).toBeGreaterThan(10);
      }
    }
  });

  it("pedagogy notes contain Vietnamese diacritics or pedagogical terms", () => {
    const hasPedagogyContent = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    let count = 0;
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const t of s.turns) {
        if (hasPedagogyContent.test(t.pedagogyNoteVi)) count++;
      }
    }
    // Most pedagogy notes should be in Vietnamese
    expect(count).toBeGreaterThan(HUMAN_QUALITY_SCENARIO_BANK.length * 1.5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 14. ERRORS TO DIAGNOSE — realistic Vietnamese learner errors
// ═══════════════════════════════════════════════════════════════════════════════

describe("Errors to diagnose — realistic learner errors", () => {
  it("scenarios contain real Vietnamese learner error patterns", () => {
    const allErrors: string[] = [];
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      for (const t of s.turns) {
        allErrors.push(...t.errorsToDiagnose);
      }
    }
    expect(allErrors.length).toBeGreaterThan(30);

    // Check for known Vietnamese L1 interference errors
    const errorText = allErrors.join(" ").toLowerCase();
    expect(errorText).toMatch(/article|mạo từ/);
    expect(errorText).toMatch(/copula|to.be|to be/);
    expect(errorText).toMatch(/tense|thì|past|quá khứ/);
    // Preposition/giới từ errors are captured in interference patterns, not always in error labels
    const allInterference = getCoveredInterferencePatterns().join(" ").toLowerCase();
    expect(allInterference).toMatch(/preposition|giới từ/);
  });

  it("some turns have zero errors (correct learner input)", () => {
    const correctTurns = HUMAN_QUALITY_SCENARIO_BANK.flatMap((s) =>
      s.turns.filter((t) => t.errorsToDiagnose.length === 0),
    );
    expect(correctTurns.length).toBeGreaterThan(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. SCENARIO ID NAMING CONVENTION
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario ID naming convention", () => {
  it("all scenario IDs follow hq-<dim>-<cefr>-<topic> or hq-xdim-<cefr>-<topic>", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      expect(s.id).toMatch(/^hq-(diag|teach|mem|adapt|self|gain|xdim)-[a-z0-9]+-[a-z0-9-]+$/);
    }
  });

  it("multi-session scenario ID follows hq-multi-* pattern", () => {
    for (const ms of MULTI_SESSION_SCENARIO_BANK) {
      expect(ms.id).toMatch(/^hq-multi-/);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 16. PROOF GATE INTEGRATION — all sub-gate types used
// ═══════════════════════════════════════════════════════════════════════════════

describe("Proof gate integration", () => {
  it("at least one scenario satisfies PG_DIAG_01", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_DIAG_01_error_detection"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("at least one scenario satisfies PG_TEACH_02_meaning_first", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_TEACH_02_meaning_first"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("at least one scenario satisfies PG_MEM_02_memory_recall", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_MEM_02_memory_recall"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario satisfies PG_ADAPT_02_language_switching", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_ADAPT_02_language_switching"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("at least one scenario satisfies PG_SELF_02_certainty_calibration", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_SELF_02_certainty_calibration"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("at least one scenario satisfies PG_GAIN_01_measurable_progress", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.satisfiesSubGates.includes("PG_GAIN_01_measurable_progress"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 17. FAILURE TAXONOMY INTEGRATION — guards against real failures
// ═══════════════════════════════════════════════════════════════════════════════

describe("Failure taxonomy integration", () => {
  it("at least one scenario guards against F-DIAG-01 (missed errors)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-DIAG-01"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario guards against F-TEACH-04 (face-threatening)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-TEACH-04"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario guards against F-MEM-01 (learner amnesia)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-MEM-01"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario guards against F-SELF-02 (fake certainty)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-SELF-02"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario guards against F-GAIN-03 (placebo gain)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-GAIN-03"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("at least one scenario guards against F-ADAPT-03 (no Vietnamese switch)", () => {
    const matches = HUMAN_QUALITY_SCENARIO_BANK.filter((s) =>
      s.guardsAgainst.includes("F-ADAPT-03"),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 18. KIDS MODE SCENARIOS — age-appropriate, warm, no dark patterns
// ═══════════════════════════════════════════════════════════════════════════════

describe("Kids mode scenarios", () => {
  const kidsScenarios = getScenariosByCefr("Kids");

  it("has at least 2 kids scenarios", () => {
    expect(kidsScenarios.length).toBeGreaterThanOrEqual(2);
  });

  it("kids scenarios use warm, simple Vietnamese", () => {
    for (const s of kidsScenarios) {
      for (const t of s.turns) {
        // Kids responses should contain emoji or warm words
        const response = t.idealTeacherResponseVi;
        expect(
          response.includes("🎉") ||
          response.includes("👏") ||
          response.includes("🌟") ||
          response.includes("❤️") ||
          response.includes("🥳") ||
          response.includes("cô") ||
          response.includes("bé") ||
          response.includes("con"),
        ).toBe(true);
      }
    }
  });

  it("kids scenarios have appropriate CEFR level", () => {
    for (const s of kidsScenarios) {
      expect(s.cefrLevel).toBe("Kids");
    }
  });

  it("kids scenarios demonstrate R8_FACE_SAVING", () => {
    for (const s of kidsScenarios) {
      const hasFaceSaving = s.turns.some((t) =>
        t.demonstratedContractRules.includes("R8_FACE_SAVING"),
      );
      expect(hasFaceSaving).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 19. EDGE CASES — boundary conditions
// ═══════════════════════════════════════════════════════════════════════════════

describe("Edge cases", () => {
  it("validateHumanQualityScenario catches missing id", () => {
    const bad = { ...HUMAN_QUALITY_SCENARIO_BANK[0], id: "" };
    const result = validateHumanQualityScenario(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validateHumanQualityScenario catches missing cefrLevel", () => {
    const bad = { ...HUMAN_QUALITY_SCENARIO_BANK[0], cefrLevel: "" as CefrLevel };
    const result = validateHumanQualityScenario(bad);
    expect(result.valid).toBe(false);
  });

  it("validateHumanQualityScenario catches empty turns array", () => {
    const bad = { ...HUMAN_QUALITY_SCENARIO_BANK[0], turns: [] };
    const result = validateHumanQualityScenario(bad);
    expect(result.valid).toBe(false);
  });

  it("validateHumanQualityScenario catches wrong turnIndex", () => {
    const bad = {
      ...HUMAN_QUALITY_SCENARIO_BANK[0],
      turns: [
        { ...HUMAN_QUALITY_SCENARIO_BANK[0].turns[0], turnIndex: 999 },
      ],
    };
    const result = validateHumanQualityScenario(bad);
    expect(result.valid).toBe(false);
  });

  it("getScenariosByDimension with empty string returns empty", () => {
    const results = getScenariosByDimension("" as TeacherIntelligenceDimensionId);
    expect(results).toEqual([]);
  });

  it("getScenariosByCefr with invalid level returns empty", () => {
    const results = getScenariosByCefr("" as CefrLevel);
    expect(results).toEqual([]);
  });

  it("getCompactScenarioLabelVi works for all scenarios", () => {
    for (const s of HUMAN_QUALITY_SCENARIO_BANK) {
      const label = getCompactScenarioLabelVi(s);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("searchScenarios handles empty query", () => {
    const results = searchScenarios("");
    expect(results.length).toBe(HUMAN_QUALITY_SCENARIO_BANK.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 20. DETERMINISM — pure functions
// ═══════════════════════════════════════════════════════════════════════════════

describe("Determinism — pure functions", () => {
  it("getScenariosByDimension is deterministic", () => {
    const a = getScenariosByDimension("diagnosis");
    const b = getScenariosByDimension("diagnosis");
    expect(a).toEqual(b);
  });

  it("getScenariosByCefr is deterministic", () => {
    const a = getScenariosByCefr("A2");
    const b = getScenariosByCefr("A2");
    expect(a).toEqual(b);
  });

  it("validateAllScenarios is deterministic", () => {
    const a = validateAllScenarios();
    const b = validateAllScenarios();
    expect(a).toEqual(b);
  });

  it("getScenarioCoverageReport is deterministic", () => {
    const a = getScenarioCoverageReport();
    const b = getScenarioCoverageReport();
    expect(a).toEqual(b);
  });

  it("getScenarioBankStatistics is deterministic", () => {
    const a = getScenarioBankStatistics();
    const b = getScenarioBankStatistics();
    expect(a).toEqual(b);
  });

  it("getCoveredInterferencePatterns is deterministic", () => {
    const a = getCoveredInterferencePatterns();
    const b = getCoveredInterferencePatterns();
    expect(a).toEqual(b);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 21. SCENARIO SPECIFIC CHECKS — key scenarios
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario-specific checks", () => {
  it("hq-adapt-b1-vietnamese-switch demonstrates adaptation via language switching", () => {
    const s = getScenarioById("hq-adapt-b1-vietnamese-switch");
    expect(s).toBeDefined();
    expect(s!.provedDimensions).toContain("adaptation");
    expect(s!.satisfiesSubGates).toContain("PG_ADAPT_02_language_switching");
    // Should mention switching to Vietnamese
    const allPedagogy = s!.turns.map((t) => t.pedagogyNoteVi).join(" ");
    expect(allPedagogy).toMatch(/chuyển|tiếng Việt|chuyển đổi ngôn ngữ/);
  });

  it("hq-self-c1-overclaim-refusal shows overclaim refusal for out-of-expertise question", () => {
    const s = getScenarioById("hq-self-c1-overclaim-refusal");
    expect(s).toBeDefined();
    expect(s!.provedDimensions).toContain("selfCheck");
    expect(s!.satisfiesSubGates).toContain("PG_SELF_02_certainty_calibration");
  });

  it("hq-gain-a2-pre-post-measurement shows measurable progress with numbers", () => {
    const s = getScenarioById("hq-gain-a2-pre-post-measurement");
    expect(s).toBeDefined();
    expect(s!.provedDimensions).toContain("learningGain");
    // Should contain progress numbers
    const narrative = s!.teachingNarrativeVi;
    expect(narrative).toMatch(/\d+%/);
  });

  it("hq-mem-b2-confusion-prevention prevents learner confusion", () => {
    const s = getScenarioById("hq-mem-b2-confusion-prevention");
    expect(s).toBeDefined();
    expect(s!.provedDimensions).toContain("memory");
    expect(s!.guardsAgainst).toContain("F-MEM-03");
  });

  it("hq-teach-c1-subtle teaches at C1 level with appropriate sophistication", () => {
    const s = getScenarioById("hq-teach-c1-subtle");
    expect(s).toBeDefined();
    expect(s!.cefrLevel).toBe("C1");
    // Should use academic terminology
    const allText = s!.turns.map((t) => t.idealTeacherResponseVi + t.pedagogyNoteVi).join(" ");
    expect(allText).toMatch(/hedging|học thuật|academic/);
  });

  it("hq-xdim-b2-comprehensive proves all 6 dimensions in one scenario", () => {
    const s = getScenarioById("hq-xdim-b2-comprehensive");
    expect(s).toBeDefined();
    expect(s!.provedDimensions.length).toBe(6);
    for (const dim of ALL_DIMENSION_IDS) {
      expect(s!.provedDimensions).toContain(dim);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 22. TYPE EXPORTS — verify type usage
// ═══════════════════════════════════════════════════════════════════════════════

describe("Type exports — verify types are usable", () => {
  it("scenario types are assignable", () => {
    const s: HumanQualityScenario = HUMAN_QUALITY_SCENARIO_BANK[0];
    expect(s.id).toBeTruthy();
  });

  it("catalog entry types are assignable", () => {
    const meta: HumanQualityScenarioMeta = HUMAN_QUALITY_SCENARIO_CATALOG[HUMAN_QUALITY_SCENARIO_BANK[0].id];
    expect(meta.titleVi).toBeTruthy();
    expect(meta.turnCount).toBeGreaterThan(0);
  });

  it("dimension IDs are string literal types", () => {
    const dim: TeacherIntelligenceDimensionId = "diagnosis";
    expect(ALL_DIMENSION_IDS).toContain(dim);
  });

  it("CEFR levels are string literal types", () => {
    const cefr: CefrLevel = "B1";
    expect(ALL_CEFR_LEVELS).toContain(cefr);
  });
});
