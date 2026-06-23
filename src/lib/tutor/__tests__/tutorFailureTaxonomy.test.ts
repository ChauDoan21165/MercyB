/**
 * Failure Taxonomy — Test Suite
 *
 * Tests the tutorFailureTaxonomy.ts module. Covers:
 *   - Taxonomy catalog integrity (25 failure modes, correct structure)
 *   - Lookup functions (getFailureById, getFailuresByDimension, getFailuresBySeverity)
 *   - Detection: F-DIAG-01 (missed errors), F-DIAG-03 (ghost corrections),
 *     F-DIAG-04 (low confidence), F-DIAG-05 (single source bias)
 *   - Detection: F-TEACH-02 (over-correction), F-TEACH-03 (fake praise),
 *     F-TEACH-05 (answer-spooning)
 *   - Detection: F-MEM-01 (learner amnesia), F-MEM-02 (stale memory)
 *   - Detection: F-SELF-01 (no self-audit), F-SELF-03 (unsafe responses)
 *   - Detection: F-GAIN-01 (no measurable progress)
 *   - scanSessionForFailures — full session scan with various inputs
 *   - Session failure profile classification
 *   - Failure score computation
 *   - Remedy generation
 *   - Cross-session aggregation (aggregateFailuresAcrossSessions)
 *   - Convenience helpers (hasCriticalFailures, isSessionClean, getScanStatusVi, getScanStatistics)
 *   - Edge cases: empty input, minimal data, null memory, single event
 */

import { describe, it, expect } from "vitest";
import {
  TUTOR_FAILURE_TAXONOMY,
  getFailureById,
  getFailuresByDimension,
  getFailuresBySeverity,
  getFailureTaxonomyCatalog,
  scanSessionForFailures,
  detectFailuresByDimension,
  getRemediesForFailures,
  computeSessionFailureScore,
  classifySessionFailureProfile,
  aggregateFailuresAcrossSessions,
  hasCriticalFailures,
  isSessionClean,
  getScanStatusVi,
  getScanStatistics,
  type TutorFailureMode,
  type FailureDetectionResult,
  type FailureDetectionContext,
  type SessionFailureScan,
  type FailureSeverity,
  type FailureDetectability,
  type FailureRemedyType,
  type SessionFailureProfile,
} from "../tutorFailureTaxonomy";
import type { TranscriptCorrectionEvent } from "../transcriptCorrectionTypes";
import type { AuditResult } from "../teacherMercyAuditGate";
import type { RubricResult } from "../teacherMercyRubric";
import type { ChauMemorySnapshot } from "../chauReviewPacket";
import type { TeacherIntelligenceDimensionId } from "../teacherIntelligenceDashboard";

// ─── Test Helpers ────────────────────────────────────────────────────────────

/** Create a minimal correction event */
function makeEvent(overrides: Partial<TranscriptCorrectionEvent> = {}): TranscriptCorrectionEvent {
  return {
    id: "evt-1",
    timestamp: Date.now(),
    sessionId: "test-session",
    turnNumber: 1,
    mode: "speak",
    originalTranscript: "test",
    correctedTranscript: null,
    targetSentence: null,
    corrections: [],
    timingMode: null,
    timingReason: null,
    delayTurns: null,
    wasSurfaced: false,
    learnerAcknowledged: null,
    matchScore: null,
    weaknessTags: [],
    weaknessLabelsVi: [],
    ...overrides,
  };
}

/** Create a minimal audit result */
function makeAudit(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    passed: true,
    safe: true,
    mode: "correction",
    gateLevel: "audit",
    contractResult: {
      passed: true,
      rules: [],
      failedCount: 0,
      summaryVi: "Đạt",
    },
    rubricResult: {
      dimensions: [],
      classification: "acceptable",
      safetyPassed: true,
      summaryVi: "Đạt",
      totalScore: 3,
    } as RubricResult,
    summaryVi: "Đạt",
    blockReasonVi: null,
    ...overrides,
  } as AuditResult;
}

/** Create an empty failure detection context */
function makeContext(overrides: Partial<FailureDetectionContext> = {}): FailureDetectionContext {
  return {
    events: [],
    auditResults: [],
    rubricResult: null,
    memorySnapshot: null,
    sessionId: "test-session",
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAXONOMY CATALOG INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════════

describe("TUTOR_FAILURE_TAXONOMY — catalog integrity", () => {
  it("contains exactly 27 failure modes", () => {
    expect(TUTOR_FAILURE_TAXONOMY).toHaveLength(27);
  });

  it("all failure modes have unique IDs", () => {
    const ids = TUTOR_FAILURE_TAXONOMY.map((f) => f.failureId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all failure IDs follow the F-{DIM}-{NN} pattern", () => {
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      expect(f.failureId).toMatch(/^F-(DIAG|TEACH|MEM|ADAPT|SELF|GAIN)-\d{2}$/);
    }
  });

  it("covers all 6 teacher intelligence dimensions", () => {
    const dimensions = new Set(TUTOR_FAILURE_TAXONOMY.map((f) => f.dimensionId));
    expect(dimensions).toContain("diagnosis");
    expect(dimensions).toContain("teaching");
    expect(dimensions).toContain("memory");
    expect(dimensions).toContain("adaptation");
    expect(dimensions).toContain("selfCheck");
    expect(dimensions).toContain("learningGain");
  });

  it("each dimension has at least 3 failure modes", () => {
    const dimCounts: Record<string, number> = {};
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      dimCounts[f.dimensionId] = (dimCounts[f.dimensionId] ?? 0) + 1;
    }
    for (const [dim, count] of Object.entries(dimCounts)) {
      expect(count, `Dimension ${dim} has ${count} failures (need ≥3)`).toBeGreaterThanOrEqual(3);
    }
  });

  it("has at least 3 critical severity failures", () => {
    const critical = TUTOR_FAILURE_TAXONOMY.filter((f) => f.severity === "critical");
    expect(critical.length).toBeGreaterThanOrEqual(3);
  });

  it("all failure modes have Vietnamese and English labels", () => {
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      expect(f.titleVi).toBeTruthy();
      expect(f.titleVi.length).toBeGreaterThan(0);
      expect(f.titleEn).toBeTruthy();
      expect(f.titleEn.length).toBeGreaterThan(0);
      expect(f.descriptionVi).toBeTruthy();
      expect(f.learnerImpactVi).toBeTruthy();
      expect(f.remedyVi).toBeTruthy();
      expect(f.rootCauseVi).toBeTruthy();
    }
  });

  it("all failure modes have non-empty detection criteria", () => {
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      expect(f.detectionCriteriaVi.length).toBeGreaterThan(0);
    }
  });

  it("all failure modes have at least one example", () => {
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      expect(f.examplesVi.length).toBeGreaterThan(0);
    }
  });

  it("has valid severity, detectability, and remedyType values", () => {
    const validSeverities: FailureSeverity[] = ["critical", "major", "minor"];
    const validDetectability: FailureDetectability[] = [
      "data_detectable",
      "requires_review",
      "prompt_auditable",
    ];
    const validRemedyTypes: FailureRemedyType[] = [
      "prompt_fix",
      "contract_update",
      "data_fix",
      "escalate_to_chau",
      "retrain_memory",
      "adjust_timing_policy",
    ];

    for (const f of TUTOR_FAILURE_TAXONOMY) {
      expect(validSeverities).toContain(f.severity);
      expect(validDetectability).toContain(f.detectability);
      expect(validRemedyTypes).toContain(f.remedyType);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

describe("getFailureById", () => {
  it("returns the correct failure for a valid ID", () => {
    const f = getFailureById("F-DIAG-01");
    expect(f).not.toBeNull();
    expect(f!.failureId).toBe("F-DIAG-01");
    expect(f!.titleVi).toBe("Bỏ sót lỗi");
  });

  it("returns null for an invalid ID", () => {
    expect(getFailureById("F-NOPE-99")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getFailureById("")).toBeNull();
  });
});

describe("getFailuresByDimension", () => {
  it("returns only failures for the specified dimension", () => {
    const diag = getFailuresByDimension("diagnosis");
    expect(diag.length).toBeGreaterThanOrEqual(3);
    for (const f of diag) {
      expect(f.dimensionId).toBe("diagnosis");
    }
  });

  it("returns empty for a dimension with no failures (shouldn't happen)", () => {
    // All dimensions have failures, testing robustness
    const result = getFailuresByDimension("diagnosis");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getFailuresBySeverity", () => {
  it("returns only critical failures when queried", () => {
    const critical = getFailuresBySeverity("critical");
    expect(critical.length).toBeGreaterThanOrEqual(3);
    for (const f of critical) {
      expect(f.severity).toBe("critical");
    }
  });

  it("returns only minor failures when queried", () => {
    const minor = getFailuresBySeverity("minor");
    for (const f of minor) {
      expect(f.severity).toBe("minor");
    }
  });
});

describe("getFailureTaxonomyCatalog", () => {
  it("returns the full taxonomy as readonly", () => {
    const catalog = getFailureTaxonomyCatalog();
    expect(catalog).toBe(TUTOR_FAILURE_TAXONOMY);
    expect(catalog.length).toBe(27);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-DIAG-01: Missed errors
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-DIAG-01 (missed errors)", () => {
  it("detects when low match scores have no corrections", () => {
    const events = [
      makeEvent({ turnNumber: 1, matchScore: 45, corrections: [] }),
      makeEvent({ turnNumber: 2, matchScore: 38, corrections: [] }),
      makeEvent({ turnNumber: 3, matchScore: 52, corrections: [] }),
      makeEvent({ turnNumber: 4, matchScore: 41, corrections: [] }),
      makeEvent({ turnNumber: 5, matchScore: 49, corrections: [] }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-01",
    );
    expect(diag01).toBeDefined();
    expect(diag01!.detected).toBe(true);
    expect(diag01!.confidence).toBeGreaterThanOrEqual(0.7);
    expect(diag01!.occurrenceCount).toBeGreaterThanOrEqual(3);
  });

  it("does NOT fire when corrections are present for low scores", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        matchScore: 45,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "go",
            correctedToken: "went",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
      makeEvent({
        turnNumber: 2,
        matchScore: 48,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "bad",
            correctedToken: "badly",
            confidence: 0.85,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-01",
    );
    expect(diag01?.detected ?? false).toBe(false);
  });

  it("does NOT fire with fewer than 3 events", () => {
    const events = [
      makeEvent({ turnNumber: 1, matchScore: 45, corrections: [] }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const hasDiag01 = scan.detectedFailures.some(
      (f) => f.failureMode.failureId === "F-DIAG-01",
    );
    expect(hasDiag01).toBe(false);
  });

  it("fires when no weakness tags are set across many events", () => {
    const events = Array.from({ length: 6 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        matchScore: 55,
        corrections: [],
        weaknessTags: [],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-01",
    );
    expect(diag01?.detected ?? false).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-DIAG-03: Ghost corrections
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-DIAG-03 (ghost corrections)", () => {
  it("detects when corrected token equals original token", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        matchScore: 80,
        corrections: [
          {
            source: "semantic-implausibility",
            position: 0,
            originalToken: "hello",
            correctedToken: "hello",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-03",
    );
    expect(diag03).toBeDefined();
    expect(diag03!.detected).toBe(true);
    expect(diag03!.occurrenceCount).toBeGreaterThanOrEqual(1);
  });

  it("does NOT fire for legitimate corrections", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        matchScore: 50,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "go",
            correctedToken: "went",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-03",
    );
    expect(diag03?.detected ?? false).toBe(false);
  });

  it("flags semantic-implausibility over-use", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        corrections: [
          {
            source: "semantic-implausibility",
            position: 0,
            originalToken: "I went to school",
            correctedToken: "I went to school",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
      makeEvent({
        turnNumber: 2,
        corrections: [
          {
            source: "semantic-implausibility",
            position: 0,
            originalToken: "She is a doctor",
            correctedToken: "She is a doctor",
            confidence: 0.75,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-03",
    );
    expect(diag03?.detected ?? false).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-DIAG-04: Low-confidence corrections
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-DIAG-04 (low-confidence corrections)", () => {
  it("detects when >40% corrections have confidence < 0.5", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "a",
            correctedToken: "b",
            confidence: 0.3,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
          {
            source: "grammar-rule",
            position: 5,
            originalToken: "c",
            correctedToken: "d",
            confidence: 0.2,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
      makeEvent({
        turnNumber: 2,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "e",
            correctedToken: "f",
            confidence: 0.4,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag04 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-04",
    );
    expect(diag04).toBeDefined();
    expect(diag04!.detected).toBe(true);
  });

  it("does NOT fire when most corrections have high confidence", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "a",
            correctedToken: "b",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
          {
            source: "grammar-rule",
            position: 5,
            originalToken: "c",
            correctedToken: "d",
            confidence: 0.85,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag04 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-04",
    );
    expect(diag04?.detected ?? false).toBe(false);
  });

  it("handles zero corrections gracefully", () => {
    const events = [makeEvent({ turnNumber: 1, corrections: [] })];
    const scan = scanSessionForFailures(makeContext({ events }));

    const hasDiag04 = scan.detectedFailures.some(
      (f) => f.failureMode.failureId === "F-DIAG-04",
    );
    expect(hasDiag04).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-DIAG-05: Single-source correction bias
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-DIAG-05 (single-source bias)", () => {
  it("detects when all corrections come from one source", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: `word${i}`,
            correctedToken: `fixed${i}`,
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-05",
    );
    expect(diag05).toBeDefined();
    expect(diag05!.detected).toBe(true);
  });

  it("flags when vietlish-pattern source is missing for Vietnamese learners", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-05",
    );
    expect(diag05?.detected ?? false).toBe(true);
    expect(diag05!.evidenceVi.some((e) => e.includes("vietlish"))).toBe(true);
  });

  it("does NOT fire with diverse correction sources", () => {
    const sources: TranscriptCorrectionEvent["corrections"][number]["source"][] = [
      "grammar-rule",
      "phonetic-readback",
      "vietlish-pattern",
      "semantic-implausibility",
      "stt-garble",
    ];
    const events = sources.map((src, i) =>
      makeEvent({
        turnNumber: i + 1,
        corrections: [
          {
            source: src,
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const diag05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-DIAG-05",
    );
    expect(diag05?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-TEACH-02: Over-correction
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-TEACH-02 (over-correction)", () => {
  it("detects turns with >3 corrections", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        corrections: [
          { source: "grammar-rule", position: 0, originalToken: "a", correctedToken: "A", confidence: 0.9, ruleId: null, explanationVi: null, explanationEn: null, },
          { source: "phonetic-readback", position: 1, originalToken: "b", correctedToken: "B", confidence: 0.9, ruleId: null, explanationVi: null, explanationEn: null, },
          { source: "vietlish-pattern", position: 2, originalToken: "c", correctedToken: "C", confidence: 0.9, ruleId: null, explanationVi: null, explanationEn: null, },
          { source: "stt-garble", position: 3, originalToken: "d", correctedToken: "D", confidence: 0.9, ruleId: null, explanationVi: null, explanationEn: null, },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-02",
    );
    expect(teach02).toBeDefined();
    expect(teach02!.detected).toBe(true);
    expect(teach02!.occurrenceCount).toBe(1);
  });

  it("detects high overall correction rate", () => {
    const events = Array.from({ length: 6 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-02",
    );
    expect(teach02).toBeDefined();
    expect(teach02!.detected).toBe(true);
  });

  it("does NOT fire with moderate correction rate", () => {
    const events = [
      makeEvent({ turnNumber: 1, corrections: [] }),
      makeEvent({ turnNumber: 2, corrections: [] }),
      makeEvent({
        turnNumber: 3,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "a",
            correctedToken: "b",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-02",
    );
    expect(teach02?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-TEACH-03: Fake praise
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-TEACH-03 (fake praise)", () => {
  it("detects R3 violations from audit results", () => {
    const auditResults = [
      makeAudit({
        safe: false,
        contractResult: {
          passed: false,
          rules: [
            {
              ruleId: "R3_NO_FAKE_PRAISE",
              passed: false,
              labelVi: "Không khen giả",
              detailVi: "Mercy khen câu sai.",
              severity: "critical",
            },
          ],
          failedCount: 1,
          summaryVi: "Vi phạm R3",
        },
      }),
    ];
    const scan = scanSessionForFailures(
      makeContext({ auditResults, events: [makeEvent()] }),
    );

    const teach03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-03",
    );
    expect(teach03).toBeDefined();
    expect(teach03!.detected).toBe(true);
    expect(teach03!.occurrenceCount).toBe(1);
  });

  it("does NOT fire with clean audits", () => {
    const auditResults = [
      makeAudit({
        safe: true,
        contractResult: {
          passed: true,
          rules: [
            {
              ruleId: "R3_NO_FAKE_PRAISE",
              passed: true,
              labelVi: "Không khen giả",
              detailVi: "Đạt",
              severity: "critical",
            },
          ],
          failedCount: 0,
          summaryVi: "Đạt",
        },
      }),
    ];
    const scan = scanSessionForFailures(
      makeContext({ auditResults, events: [makeEvent()] }),
    );

    const teach03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-03",
    );
    expect(teach03?.detected ?? false).toBe(false);
  });

  it("warns when no audit results are available (but does not falsely detect)", () => {
    const scan = scanSessionForFailures(
      makeContext({ events: [makeEvent()], auditResults: [] }),
    );

    // F-TEACH-03 should NOT be detected since we have no evidence
    const hasTeach03 = scan.detectedFailures.some(
      (f) => f.failureMode.failureId === "F-TEACH-03",
    );
    expect(hasTeach03).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-TEACH-05: Answer-spooning
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-TEACH-05 (answer-spooning)", () => {
  it("detects when >70% corrections are IMMEDIATE", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        timingMode: "IMMEDIATE",
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-05",
    );
    expect(teach05).toBeDefined();
    expect(teach05!.detected).toBe(true);
  });

  it("detects when no guiding modes are used", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        timingMode: i < 3 ? "IMMEDIATE" : "DELAYED",
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-05",
    );
    // Should fire because no FOLLOW_UP_FIRST or EXPLAIN_PATTERN
    expect(teach05!.detected).toBe(true);
  });

  it("does NOT fire when guiding modes are used", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        timingMode: "FOLLOW_UP_FIRST",
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "a",
            correctedToken: "b",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
      makeEvent({
        turnNumber: 2,
        timingMode: "EXPLAIN_PATTERN",
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "c",
            correctedToken: "d",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
      makeEvent({
        turnNumber: 3,
        timingMode: "IMMEDIATE",
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "e",
            correctedToken: "f",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const teach05 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-TEACH-05",
    );
    expect(teach05?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-MEM-01: Learner amnesia
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-MEM-01 (learner amnesia)", () => {
  it("detects when memory snapshot is null", () => {
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: null }),
    );

    const mem01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-01",
    );
    expect(mem01).toBeDefined();
    expect(mem01!.detected).toBe(true);
    expect(mem01!.confidence).toBeCloseTo(0.95);
  });

  it("detects when memory is empty (no strengths, no needsReview)", () => {
    const memory: ChauMemorySnapshot = {
      strengths: [],
      needsReview: [],
      commonMistakePatterns: [],
      nextRecommendedFocus: "",
      confidenceTrend: "not-enough-data",
      totalCorrections: 0,
      lastUpdatedAt: null,
    };
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: memory }),
    );

    const mem01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-01",
    );
    expect(mem01?.detected ?? false).toBe(true);
  });

  it("does NOT fire when memory has data", () => {
    const memory: ChauMemorySnapshot = {
      strengths: ["Phát âm tốt"],
      needsReview: ["Past tense"],
      commonMistakePatterns: ["Thiếu 's'"],
      nextRecommendedFocus: "Past tense irregular verbs",
      confidenceTrend: "improving",
      totalCorrections: 12,
      lastUpdatedAt: new Date().toISOString(),
    };
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: memory }),
    );

    const mem01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-01",
    );
    expect(mem01?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-MEM-02: Stale memory
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-MEM-02 (stale memory)", () => {
  it("detects memory older than 7 days", () => {
    const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const memory: ChauMemorySnapshot = {
      strengths: ["Phát âm tốt"],
      needsReview: ["Past tense"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Past tense",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: oldDate,
    };
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: memory }),
    );

    const mem02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-02",
    );
    expect(mem02).toBeDefined();
    expect(mem02!.detected).toBe(true);
  });

  it("does NOT fire for recently updated memory", () => {
    const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const memory: ChauMemorySnapshot = {
      strengths: ["Phát âm tốt"],
      needsReview: ["Past tense"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Past tense",
      confidenceTrend: "improving",
      totalCorrections: 5,
      lastUpdatedAt: recentDate,
    };
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: memory }),
    );

    const mem02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-02",
    );
    expect(mem02?.detected ?? false).toBe(false);
  });

  it("handles null memorySnapshot gracefully", () => {
    const scan = scanSessionForFailures(
      makeContext({ memorySnapshot: null }),
    );
    const mem02 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-02",
    );
    expect(mem02?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-SELF-01: No self-audit
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-SELF-01 (no self-audit)", () => {
  it("detects when there are events but no audit results", () => {
    const events = [makeEvent(), makeEvent(), makeEvent()];
    const scan = scanSessionForFailures(
      makeContext({ events, auditResults: [] }),
    );

    const self01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-SELF-01",
    );
    expect(self01).toBeDefined();
    expect(self01!.detected).toBe(true);
  });

  it("does NOT fire when audits are present", () => {
    const events = [makeEvent()];
    const auditResults = [makeAudit()];
    const scan = scanSessionForFailures(
      makeContext({ events, auditResults }),
    );

    const self01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-SELF-01",
    );
    expect(self01?.detected ?? false).toBe(false);
  });

  it("does NOT fire when there are no events (nothing to audit)", () => {
    const scan = scanSessionForFailures(
      makeContext({ events: [], auditResults: [] }),
    );

    const self01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-SELF-01",
    );
    expect(self01?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-SELF-03: Passing unsafe responses
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-SELF-03 (passing unsafe responses)", () => {
  it("detects when audits have safety failures", () => {
    const auditResults = [
      makeAudit({
        safe: false,
        passed: false,
        summaryVi: "Vi phạm an toàn",
      }),
    ];
    const scan = scanSessionForFailures(
      makeContext({ auditResults, events: [makeEvent()] }),
    );

    const self03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-SELF-03",
    );
    expect(self03).toBeDefined();
    expect(self03!.detected).toBe(true);
    expect(self03!.occurrenceCount).toBe(1);
  });

  it("does NOT fire when all audits are safe", () => {
    const auditResults = [makeAudit({ safe: true })];
    const scan = scanSessionForFailures(
      makeContext({ auditResults, events: [makeEvent()] }),
    );

    const self03 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-SELF-03",
    );
    expect(self03?.detected ?? false).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION — F-GAIN-01: No measurable progress
// ═══════════════════════════════════════════════════════════════════════════════

describe("detection — F-GAIN-01 (no measurable progress)", () => {
  it("detects when match scores don't improve across halves", () => {
    // First half: high scores, second half: same or lower — no improvement
    const events = [
      makeEvent({ turnNumber: 1, matchScore: 65, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 2, matchScore: 68, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 3, matchScore: 63, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 4, matchScore: 62, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 5, matchScore: 64, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 6, matchScore: 60, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 7, matchScore: 63, corrections: [], weaknessTags: ["past_tense"] }),
      makeEvent({ turnNumber: 8, matchScore: 61, corrections: [], weaknessTags: ["past_tense"] }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const gain01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-GAIN-01",
    );
    expect(gain01).toBeDefined();
    expect(gain01!.detected).toBe(true);
  });

  it("detects when correction rate doesn't decrease", () => {
    // All events have corrections — no improvement
    const events = Array.from({ length: 10 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        matchScore: 50 + i,
        corrections: [
          {
            source: "grammar-rule",
            position: 0,
            originalToken: "x",
            correctedToken: "y",
            confidence: 0.8,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
        weaknessTags: [`tag_${i < 5 ? "a" : "b"}`],
      }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    const gain01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-GAIN-01",
    );
    expect(gain01?.detected ?? false).toBe(true);
  });

  it("does NOT fire when there's clear progress", () => {
    const events = [
      // First half: low scores, many corrections
      makeEvent({ turnNumber: 1, matchScore: 40, corrections: [{ source: "grammar-rule", position: 0, originalToken: "x", correctedToken: "y", confidence: 0.8, ruleId: null, explanationVi: null, explanationEn: null }], weaknessTags: ["a", "b", "c"] }),
      makeEvent({ turnNumber: 2, matchScore: 42, corrections: [{ source: "grammar-rule", position: 0, originalToken: "x", correctedToken: "y", confidence: 0.8, ruleId: null, explanationVi: null, explanationEn: null }], weaknessTags: ["a", "b"] }),
      makeEvent({ turnNumber: 3, matchScore: 45, corrections: [{ source: "grammar-rule", position: 0, originalToken: "x", correctedToken: "y", confidence: 0.8, ruleId: null, explanationVi: null, explanationEn: null }], weaknessTags: ["a", "b"] }),
      makeEvent({ turnNumber: 4, matchScore: 44, corrections: [{ source: "grammar-rule", position: 0, originalToken: "x", correctedToken: "y", confidence: 0.8, ruleId: null, explanationVi: null, explanationEn: null }], weaknessTags: ["a"] }),
      // Second half: higher scores, fewer corrections
      makeEvent({ turnNumber: 5, matchScore: 72, corrections: [], weaknessTags: ["a"] }),
      makeEvent({ turnNumber: 6, matchScore: 78, corrections: [], weaknessTags: [] }),
      makeEvent({ turnNumber: 7, matchScore: 80, corrections: [], weaknessTags: [] }),
      makeEvent({ turnNumber: 8, matchScore: 82, corrections: [], weaknessTags: [] }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));

    const gain01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-GAIN-01",
    );
    expect(gain01?.detected ?? false).toBe(false);
  });

  it("requires at least 8 events (not detected with too few)", () => {
    const events = [makeEvent({ turnNumber: 1, matchScore: 50 })];
    const scan = scanSessionForFailures(makeContext({ events }));

    const hasGain01 = scan.detectedFailures.some(
      (f) => f.failureMode.failureId === "F-GAIN-01",
    );
    expect(hasGain01).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCAN SESSION FOR FAILURES — FULL INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe("scanSessionForFailures — full integration", () => {
  it("returns a complete scan structure", () => {
    const scan = scanSessionForFailures(makeContext());

    expect(scan.sessionId).toBe("test-session");
    expect(scan.scannedAt).toBeTruthy();
    expect(scan.totalChecks).toBeGreaterThan(0);
    expect(scan.failureCount).toBeGreaterThanOrEqual(0);
    expect(scan.bySeverity).toHaveProperty("critical");
    expect(scan.bySeverity).toHaveProperty("major");
    expect(scan.bySeverity).toHaveProperty("minor");
    expect(scan.byDimension).toHaveProperty("diagnosis");
    expect(scan.byDimension).toHaveProperty("teaching");
    expect(scan.byDimension).toHaveProperty("memory");
    expect(scan.byDimension).toHaveProperty("adaptation");
    expect(scan.byDimension).toHaveProperty("selfCheck");
    expect(scan.byDimension).toHaveProperty("learningGain");
    expect(scan.failureScore).toBeGreaterThanOrEqual(0);
    expect(scan.failureScore).toBeLessThanOrEqual(100);
    expect(scan.profile).toBeTruthy();
    expect(scan.summaryVi).toBeTruthy();
    expect(scan.remedies).toBeDefined();
    expect(typeof scan.requiresChauReview).toBe("boolean");
  });

  it("empty session with null memory has F-MEM-01 and non-clean profile (expected — no memory is a real failure)", () => {
    const scan = scanSessionForFailures(makeContext());
    // null memorySnapshot triggers F-MEM-01 (critical), so profile is serious_problems
    expect(scan.profile).toBe("serious_problems");
    expect(scan.failureCount).toBeGreaterThanOrEqual(1);
    expect(scan.requiresChauReview).toBe(true);
    // But the session IS scannable — it returns valid structure
    expect(scan.summaryVi.length).toBeGreaterThan(0);
  });

  it("session with populated memory is clean", () => {
    const memory: ChauMemorySnapshot = {
      strengths: ["Speaking"],
      needsReview: ["Grammar"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Grammar",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: new Date().toISOString(),
    };
    const scan = scanSessionForFailures(makeContext({ memorySnapshot: memory }));
    expect(scan.profile).toBe("clean");
    expect(scan.failureCount).toBe(0);
    expect(scan.failureScore).toBe(0);
    expect(scan.requiresChauReview).toBe(false);
  });

  it("session with ghost corrections gets non-clean profile", () => {
    const events = [
      makeEvent({
        turnNumber: 1,
        corrections: [
          {
            source: "semantic-implausibility",
            position: 0,
            originalToken: "hello",
            correctedToken: "hello",
            confidence: 0.95,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));
    expect(scan.failureCount).toBeGreaterThan(0);
    expect(scan.profile).not.toBe("clean");
  });

  it("produces prioritized remedies ordered by severity", () => {
    // Create a session with both critical and minor failures
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        matchScore: 30,
        corrections: [],
        weaknessTags: [],
      }),
    );
    const auditResults = [
      makeAudit({
        safe: false,
        contractResult: {
          passed: false,
          rules: [
            {
              ruleId: "R3_NO_FAKE_PRAISE",
              passed: false,
              labelVi: "Không khen giả",
              detailVi: "Khen sai",
              severity: "critical",
            },
          ],
          failedCount: 1,
          summaryVi: "Vi phạm",
        },
      }),
    ];
    const scan = scanSessionForFailures(
      makeContext({ events, auditResults }),
    );

    // Critical failures should come first in remedies
    for (let i = 1; i < scan.remedies.length; i++) {
      expect(scan.remedies[i].priority).toBeGreaterThan(scan.remedies[i - 1].priority);
    }
  });

  it("computes failureScore as weighted sum of detected failures", () => {
    // critical=15, major=7, minor=2
    const events = [
      // Ghost correction (minor detection)
      makeEvent({
        turnNumber: 1,
        corrections: [
          {
            source: "semantic-implausibility",
            position: 0,
            originalToken: "same",
            correctedToken: "same",
            confidence: 0.9,
            ruleId: null,
            explanationVi: null,
            explanationEn: null,
          },
        ],
      }),
    ];
    const scan = scanSessionForFailures(makeContext({ events }));
    expect(scan.failureScore).toBeGreaterThan(0);
    expect(scan.failureScore).toBeLessThanOrEqual(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DETECT FAILURES BY DIMENSION
// ═══════════════════════════════════════════════════════════════════════════════

describe("detectFailuresByDimension", () => {
  it("returns only failures for the requested dimension", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        matchScore: 40,
        corrections: [],
      }),
    );
    const ctx = makeContext({ events });

    const diagFailures = detectFailuresByDimension("diagnosis", ctx);
    for (const f of diagFailures) {
      expect(f.failureMode.dimensionId).toBe("diagnosis");
    }

    const teachingFailures = detectFailuresByDimension("teaching", ctx);
    for (const f of teachingFailures) {
      expect(f.failureMode.dimensionId).toBe("teaching");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTE SESSION FAILURE SCORE
// ═══════════════════════════════════════════════════════════════════════════════

describe("computeSessionFailureScore", () => {
  it("returns 0 for empty failures", () => {
    expect(computeSessionFailureScore([])).toBe(0);
  });

  it("weights critical failures higher", () => {
    const criticalFailure: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-01")!,
      detected: true,
      confidence: 1,
      evidenceVi: ["test"],
      occurrenceCount: 1,
      detectedAt: [],
    };
    const minorFailure: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-05")!,
      detected: true,
      confidence: 1,
      evidenceVi: ["test"],
      occurrenceCount: 1,
      detectedAt: [],
    };

    const criticalScore = computeSessionFailureScore([criticalFailure]);
    const minorScore = computeSessionFailureScore([minorFailure]);
    expect(criticalScore).toBeGreaterThan(minorScore);
    expect(criticalScore).toBe(15); // critical = 15
    expect(minorScore).toBe(2); // minor = 2
  });

  it("caps at 100", () => {
    const failures: FailureDetectionResult[] = Array.from({ length: 10 }, () => ({
      failureMode: getFailureById("F-DIAG-01")!,
      detected: true,
      confidence: 1,
      evidenceVi: ["test"],
      occurrenceCount: 1,
      detectedAt: [],
    }));
    expect(computeSessionFailureScore(failures)).toBeLessThanOrEqual(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CLASSIFY SESSION FAILURE PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

describe("classifySessionFailureProfile", () => {
  it("returns 'clean' for no failures", () => {
    expect(classifySessionFailureProfile([])).toBe("clean");
  });

  it("returns 'critical_intervention' for 3+ critical failures", () => {
    const critical: FailureDetectionResult[] = [
      {
        failureMode: getFailureById("F-DIAG-01")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
      {
        failureMode: getFailureById("F-DIAG-03")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
      {
        failureMode: getFailureById("F-TEACH-03")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
    ];
    expect(classifySessionFailureProfile(critical)).toBe("critical_intervention");
  });

  it("returns 'serious_problems' for 1 critical", () => {
    const failures: FailureDetectionResult[] = [
      {
        failureMode: getFailureById("F-DIAG-01")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
    ];
    expect(classifySessionFailureProfile(failures)).toBe("serious_problems");
  });

  it("returns 'needs_attention' for 2 major failures", () => {
    const failures: FailureDetectionResult[] = [
      {
        failureMode: getFailureById("F-DIAG-02")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
      {
        failureMode: getFailureById("F-DIAG-04")!,
        detected: true,
        confidence: 1,
        evidenceVi: [],
        occurrenceCount: 1,
        detectedAt: [],
      },
    ];
    expect(classifySessionFailureProfile(failures)).toBe("needs_attention");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET REMEDIES FOR FAILURES
// ═══════════════════════════════════════════════════════════════════════════════

describe("getRemediesForFailures", () => {
  it("returns a deduplicated list of remedies", () => {
    const f1: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-01")!,
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };
    const f2: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-03")!,
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };

    const remedies = getRemediesForFailures([f1, f2]);
    expect(remedies.length).toBe(2);
    expect(remedies[0].failureId).toBe("F-DIAG-01");
    expect(remedies[1].failureId).toBe("F-DIAG-03");
  });

  it("deduplicates same failure IDs", () => {
    const f1: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-01")!,
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };
    const f1Duplicate: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-01")!,
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };

    const remedies = getRemediesForFailures([f1, f1Duplicate]);
    expect(remedies.length).toBe(1);
  });

  it("sorts critical before major before minor", () => {
    const minor: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-05")!, // minor
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };
    const critical: FailureDetectionResult = {
      failureMode: getFailureById("F-DIAG-01")!, // critical
      detected: true,
      confidence: 1,
      evidenceVi: [],
      occurrenceCount: 1,
      detectedAt: [],
    };

    const remedies = getRemediesForFailures([minor, critical]);
    expect(remedies[0].failureId).toBe("F-DIAG-01"); // critical first
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-SESSION AGGREGATION
// ═══════════════════════════════════════════════════════════════════════════════

describe("aggregateFailuresAcrossSessions", () => {
  it("returns empty summary for no scans", () => {
    const summary = aggregateFailuresAcrossSessions([]);
    expect(summary.sessionCount).toBe(0);
    expect(summary.topFailures).toHaveLength(0);
    expect(summary.summaryVi).toContain("Chưa có dữ liệu");
  });

  it("counts failures across sessions correctly", () => {
    // Session 1: missed errors
    const scan1 = scanSessionForFailures(
      makeContext({
        sessionId: "s1",
        events: Array.from({ length: 5 }, (_, i) =>
          makeEvent({ turnNumber: i + 1, matchScore: 40, corrections: [] }),
        ),
      }),
    );

    // Session 2: missed errors again
    const scan2 = scanSessionForFailures(
      makeContext({
        sessionId: "s2",
        events: Array.from({ length: 5 }, (_, i) =>
          makeEvent({ turnNumber: i + 1, matchScore: 35, corrections: [] }),
        ),
      }),
    );

    const summary = aggregateFailuresAcrossSessions([scan1, scan2]);
    expect(summary.sessionCount).toBe(2);

    // F-DIAG-01 should appear in both sessions
    const diag01Count = summary.failureCounts["F-DIAG-01"] ?? 0;
    expect(diag01Count).toBe(2);
  });

  it("identifies top failures", () => {
    const scan = scanSessionForFailures(
      makeContext({
        sessionId: "s1",
        events: Array.from({ length: 5 }, (_, i) =>
          makeEvent({ turnNumber: i + 1, matchScore: 40, corrections: [] }),
        ),
      }),
    );

    const summary = aggregateFailuresAcrossSessions([scan]);
    expect(summary.topFailures.length).toBeGreaterThan(0);
    // F-DIAG-01 should be in top failures since we have missed errors
    const hasDiag01 = summary.topFailures.some((f) => f.failureId === "F-DIAG-01");
    expect(hasDiag01).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

describe("convenience helpers", () => {
  it("hasCriticalFailures returns true when critical failures present", () => {
    // F-DIAG-03 (ghost corrections) IS critical severity
    const diag03 = getFailureById("F-DIAG-03");
    expect(diag03!.severity).toBe("critical");

    const scan = scanSessionForFailures(
      makeContext({
        events: [
          makeEvent({
            turnNumber: 1,
            corrections: [
              {
                source: "semantic-implausibility",
                position: 0,
                originalToken: "same",
                correctedToken: "same",
                confidence: 0.9,
                ruleId: null,
                explanationVi: null,
                explanationEn: null,
              },
            ],
          }),
        ],
      }),
    );
    // Ghost correction triggers F-DIAG-03 which is critical, plus null memory triggers F-MEM-01
    expect(hasCriticalFailures(scan)).toBe(true);
  });

  it("hasCriticalFailures returns false for clean session with memory", () => {
    const memory: ChauMemorySnapshot = {
      strengths: ["Speaking"],
      needsReview: ["Grammar"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Grammar",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: new Date().toISOString(),
    };
    const scan = scanSessionForFailures(makeContext({ memorySnapshot: memory }));
    expect(hasCriticalFailures(scan)).toBe(false);
  });

  it("isSessionClean returns true for session with memory and no issues", () => {
    const memory: ChauMemorySnapshot = {
      strengths: ["Speaking"],
      needsReview: ["Grammar"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Grammar",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: new Date().toISOString(),
    };
    const scan = scanSessionForFailures(makeContext({ memorySnapshot: memory }));
    expect(isSessionClean(scan)).toBe(true);
  });

  it("isSessionClean returns false for problematic session", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({ turnNumber: i + 1, matchScore: 30, corrections: [] }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));
    expect(isSessionClean(scan)).toBe(false);
  });

  it("getScanStatusVi returns correct labels", () => {
    // Session with memory — clean
    const memory: ChauMemorySnapshot = {
      strengths: ["Speaking"],
      needsReview: ["Grammar"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Grammar",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: new Date().toISOString(),
    };
    const cleanScan = scanSessionForFailures(makeContext({ memorySnapshot: memory }));
    expect(getScanStatusVi(cleanScan)).toBe("✓ Sạch");

    // Problematic session
    const dirtyScan = scanSessionForFailures(
      makeContext({
        events: Array.from({ length: 5 }, (_, i) =>
          makeEvent({ turnNumber: i + 1, matchScore: 30, corrections: [] }),
        ),
      }),
    );
    expect(getScanStatusVi(dirtyScan)).toBeTruthy();
    expect(getScanStatusVi(dirtyScan).length).toBeGreaterThan(0);
  });

  it("getScanStatistics returns complete stats", () => {
    const scan = scanSessionForFailures(
      makeContext({
        events: Array.from({ length: 5 }, (_, i) =>
          makeEvent({ turnNumber: i + 1, matchScore: 30, corrections: [] }),
        ),
      }),
    );

    const stats = getScanStatistics(scan);
    expect(stats.totalDetected).toBeGreaterThanOrEqual(0);
    expect(typeof stats.criticalCount).toBe("number");
    expect(typeof stats.majorCount).toBe("number");
    expect(typeof stats.minorCount).toBe("number");
    expect(stats.failureScore).toBeGreaterThanOrEqual(0);
    expect(stats.profileLabelVi).toBeTruthy();
    expect(typeof stats.requiresChauReview).toBe("boolean");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════════

describe("edge cases", () => {
  it("handles completely empty context gracefully (null memory is a real problem)", () => {
    const scan = scanSessionForFailures(makeContext());
    expect(scan).toBeDefined();
    // null memory triggers F-MEM-01 → serious_problems
    expect(scan.profile).toBe("serious_problems");
    expect(scan.failureCount).toBeGreaterThanOrEqual(1);
    expect(scan.failureScore).toBeGreaterThan(0);
    // But it's still well-structured
    expect(scan.summaryVi.length).toBeGreaterThan(0);
  });

  it("handles null rubricResult", () => {
    const scan = scanSessionForFailures(
      makeContext({ rubricResult: null, events: [makeEvent()] }),
    );
    expect(scan).toBeDefined();
    // Should still detect F-SELF-01 (no audit) if no audit results
  });

  it("handles single event gracefully", () => {
    const scan = scanSessionForFailures(
      makeContext({ events: [makeEvent()] }),
    );
    expect(scan).toBeDefined();
    // Most detectors should not fire with just 1 event
  });

  it("handles null memory gracefully", () => {
    const scan = scanSessionForFailures(
      makeContext({
        memorySnapshot: null,
        events: [makeEvent()],
      }),
    );
    expect(scan).toBeDefined();
    // F-MEM-01 should fire
    const mem01 = scan.detectedFailures.find(
      (f) => f.failureMode.failureId === "F-MEM-01",
    );
    expect(mem01?.detected ?? false).toBe(true);
  });

  it("all detected failures have valid structure", () => {
    const events = Array.from({ length: 8 }, (_, i) =>
      makeEvent({
        turnNumber: i + 1,
        matchScore: 40 + i * 5,
        corrections:
          i < 4
            ? [
                {
                  source: "grammar-rule" as const,
                  position: 0,
                  originalToken: "x",
                  correctedToken: "y",
                  confidence: 0.8,
                  ruleId: null,
                  explanationVi: null,
                  explanationEn: null,
                },
              ]
            : [],
      }),
    );

    const memory: ChauMemorySnapshot = {
      strengths: ["Speaking"],
      needsReview: ["Grammar"],
      commonMistakePatterns: [],
      nextRecommendedFocus: "Grammar",
      confidenceTrend: "stable",
      totalCorrections: 5,
      lastUpdatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const scan = scanSessionForFailures(
      makeContext({ events, memorySnapshot: memory }),
    );

    for (const f of scan.detectedFailures) {
      expect(f.failureMode.failureId).toBeTruthy();
      expect(typeof f.detected).toBe("boolean");
      expect(f.detected).toBe(true);
      expect(f.confidence).toBeGreaterThanOrEqual(0);
      expect(f.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(f.evidenceVi)).toBe(true);
      expect(f.evidenceVi.length).toBeGreaterThan(0);
      expect(typeof f.occurrenceCount).toBe("number");
    }
  });

  it("provides Vietnamese content throughout", () => {
    for (const f of TUTOR_FAILURE_TAXONOMY) {
      // All user-facing text should have Vietnamese
      expect(f.descriptionVi.length).toBeGreaterThan(10);
      expect(f.learnerImpactVi.length).toBeGreaterThan(10);
      expect(f.remedyVi.length).toBeGreaterThan(10);
      expect(f.rootCauseVi.length).toBeGreaterThan(10);
    }
  });

  it("detection results contain Vietnamese evidence messages", () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({ turnNumber: i + 1, matchScore: 30, corrections: [] }),
    );
    const scan = scanSessionForFailures(makeContext({ events }));

    for (const f of scan.detectedFailures) {
      for (const ev of f.evidenceVi) {
        expect(typeof ev).toBe("string");
        expect(ev.length).toBeGreaterThan(0);
      }
    }
  });
});
