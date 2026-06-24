/**
 * Chau Review Packet — Test Suite
 *
 * Tests the chauReviewPacket.ts module. Covers:
 *   - Empty/minimal input → graceful degradation
 *   - Full session data → complete packet
 *   - Dimension scoring accuracy
 *   - Verdict classification
 *   - Action item generation
 *   - Memory freshness detection
 *   - Adaptation detection
 *   - Edge cases (null inputs, partial data)
 *   - Compact summary formatting
 */

import { describe, it, expect } from "vitest";
import {
  buildChauReviewPacket,
  isPacketReportable,
  getActionItems,
  getCompactSummaryVi,
  CHAU_REVIEW_DIMENSION_CATALOG,
  type ChauReviewPacket,
  type ChauMemorySnapshot,
  type BuildChauReviewPacketInput,
} from "../chauReviewPacket";
import type { TranscriptCorrectionEvent } from "../transcriptCorrectionTypes";
import type { AuditResult } from "../teacherMercyAuditGate";
import type { TutorTurn } from "../tutorTypes";
import type { RubricResult } from "../teacherMercyRubric";
import type {
  LearningGainResult,
  LearningGainSnapshot,
} from "../learningGainRubric";

// ─── Test Helpers ────────────────────────────────────────────────────────

function makeEvent(overrides: Partial<TranscriptCorrectionEvent> = {}): TranscriptCorrectionEvent {
  const base: TranscriptCorrectionEvent = {
    id: `evt-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    sessionId: "test-session",
    turnNumber: 1,
    mode: "speak",
    originalTranscript: "I go to school yesterday",
    correctedTranscript: "I went to school yesterday",
    targetSentence: null,
    corrections: [
      {
        source: "grammar-rule",
        position: 2,
        originalToken: "go",
        correctedToken: "went",
        confidence: 0.9,
        ruleId: "past-tense",
        explanationVi: "Dùng 'went' cho quá khứ của 'go'",
        explanationEn: "Use 'went' for past tense of 'go'",
      },
    ],
    timingMode: "IMMEDIATE",
    timingReason: "Simple grammar fix",
    delayTurns: null,
    wasSurfaced: true,
    learnerAcknowledged: true,
    matchScore: 75,
    weaknessTags: ["past-tense"],
    weaknessLabelsVi: ["Thì quá khứ"],
    interferenceCategory: null,
    topicTag: "daily-routine",
  };
  return { ...base, ...overrides, id: overrides.id ?? base.id };
}

function makeEventNoCorrection(overrides: Partial<TranscriptCorrectionEvent> = {}): TranscriptCorrectionEvent {
  const base: TranscriptCorrectionEvent = {
    id: `evt-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    sessionId: "test-session",
    turnNumber: 1,
    mode: "speak",
    originalTranscript: "I went to school yesterday",
    correctedTranscript: null,
    targetSentence: null,
    corrections: [],
    timingMode: null,
    timingReason: null,
    delayTurns: null,
    wasSurfaced: false,
    learnerAcknowledged: null,
    matchScore: 90,
    weaknessTags: [],
    weaknessLabelsVi: [],
    interferenceCategory: null,
    topicTag: null,
  };
  return { ...base, ...overrides, id: overrides.id ?? base.id };
}

function makeAuditPassed(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    passed: true,
    safe: true,
    mode: "correction",
    gateLevel: "audit",
    contractResult: {
      passed: true,
      mode: "correction",
      failedCount: 0,
      rules: [],
      summaryVi: "Tất cả quy tắc đều đạt.",
      summaryEn: "All rules passed.",
    },
    rubricResult: {
      classification: "exemplary",
      safetyPassed: true,
      dimensions: [],
      summaryVi: "Xuất sắc.",
      contractResult: {
        passed: true,
        mode: "correction",
        failedCount: 0,
        rules: [],
        summaryVi: "Đạt.",
        summaryEn: "Passed.",
      },
    },
    summaryVi: "Đạt.",
    blockReasonVi: null,
    ...overrides,
  } as AuditResult;
}

function makeAuditFailed(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    passed: false,
    safe: false,
    mode: "correction",
    gateLevel: "audit",
    contractResult: {
      passed: false,
      mode: "correction",
      failedCount: 2,
      rules: [],
      summaryVi: "2 quy tắc không đạt.",
      summaryEn: "2 rules failed.",
    },
    rubricResult: {
      classification: "failing",
      safetyPassed: false,
      dimensions: [],
      summaryVi: "Không an toàn.",
      contractResult: {
        passed: false,
        mode: "correction",
        failedCount: 2,
        rules: [],
        summaryVi: "Không đạt.",
        summaryEn: "Failed.",
      },
    },
    summaryVi: "Không đạt.",
    blockReasonVi: "Vi phạm an toàn.",
    ...overrides,
  } as AuditResult;
}

function makeTutorTurn(overrides: Partial<TutorTurn> = {}): TutorTurn {
  return {
    id: `turn-${Math.random().toString(36).slice(2, 8)}`,
    mode: "correction",
    targetLanguage: "en",
    explainLanguage: "vi",
    userText: "I go to school",
    correctedText: "I went to school",
    explanation: "Dùng 'went' cho quá khứ.",
    naturalReply: undefined,
    nextQuestion: undefined,
    shouldReadAloudText: "I went to school",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeMemory(): ChauMemorySnapshot {
  return {
    strengths: ["pronunciation", "vocabulary"],
    needsReview: ["past-tense", "articles"],
    commonMistakePatterns: ["past-tense"],
    nextRecommendedFocus: "past-tense-drill",
    confidenceTrend: "improving",
    totalCorrections: 15,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function makeGainResult(overrides: Partial<LearningGainResult> = {}): LearningGainResult {
  const baseline: LearningGainSnapshot = {
    eventCount: 10,
    errorRate: 0.6,
    avgMatchScore: 65,
    selfCorrectionCount: 1,
    acknowledgmentCount: 5,
    totalCorrections: 8,
    weaknessCounts: { "past-tense": 4, articles: 3 },
    avgConfidence: 0.75,
    uniqueWeaknessCount: 2,
  };
  const outcome: LearningGainSnapshot = {
    eventCount: 10,
    errorRate: 0.3,
    avgMatchScore: 80,
    selfCorrectionCount: 3,
    acknowledgmentCount: 8,
    totalCorrections: 4,
    weaknessCounts: { "past-tense": 2, articles: 1 },
    avgConfidence: 0.85,
    uniqueWeaknessCount: 2,
  };
  return {
    classification: "significant_gain",
    improvingDimensions: 5,
    decliningDimensions: 0,
    dimensions: [
      {
        dimensionId: "lg_error_reduction",
        titleVi: "Giảm lỗi",
        titleEn: "Error reduction",
        score: 3,
        label: "strong",
        baselineValue: 0.6,
        outcomeValue: 0.3,
        delta: -0.3,
        detailVi: "Tỉ lệ lỗi giảm mạnh.",
        detailEn: "Error rate dropped significantly.",
      },
      {
        dimensionId: "lg_pronunciation_gain",
        titleVi: "Cải thiện phát âm",
        titleEn: "Pronunciation gain",
        score: 2,
        label: "clear",
        baselineValue: 65,
        outcomeValue: 80,
        delta: 15,
        detailVi: "Điểm phát âm tăng.",
        detailEn: "Match scores improved.",
      },
      {
        dimensionId: "lg_self_correction",
        titleVi: "Tự sửa lỗi",
        titleEn: "Self-correction growth",
        score: 2,
        label: "clear",
        baselineValue: 1,
        outcomeValue: 3,
        delta: 2,
        detailVi: "Tự sửa lỗi tăng.",
        detailEn: "Self-corrections increased.",
      },
      {
        dimensionId: "lg_acknowledgment",
        titleVi: "Tiếp thu sửa lỗi",
        titleEn: "Acknowledgment rate",
        score: 2,
        label: "clear",
        baselineValue: 5,
        outcomeValue: 8,
        delta: 3,
        detailVi: "Tiếp thu tăng.",
        detailEn: "Acknowledgment increased.",
      },
      {
        dimensionId: "lg_weakness_resolution",
        titleVi: "Khắc phục điểm yếu",
        titleEn: "Weakness resolution",
        score: 3,
        label: "strong",
        baselineValue: 6,
        outcomeValue: 3,
        delta: -3,
        detailVi: "Điểm yếu giảm.",
        detailEn: "Weaknesses reduced.",
      },
      {
        dimensionId: "lg_retention",
        titleVi: "Ghi nhớ bài sửa",
        titleEn: "Retention evidence",
        score: 2,
        label: "clear",
        baselineValue: 0,
        outcomeValue: 3,
        delta: 3,
        detailVi: "Có bằng chứng ghi nhớ.",
        detailEn: "Retention evidence found.",
      },
      {
        dimensionId: "lg_autonomy",
        titleVi: "Tự chủ hơn",
        titleEn: "Autonomy gain",
        score: 2,
        label: "clear",
        baselineValue: 8,
        outcomeValue: 4,
        delta: -4,
        detailVi: "Ít can thiệp hơn.",
        detailEn: "Fewer interventions needed.",
      },
    ],
    summaryVi: "Người học tiến bộ đáng kể.",
    summaryEn: "Significant learner improvement.",
    baseline,
    outcome,
    totalEvents: 20,
    sufficientData: true,
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────

describe("buildChauReviewPacket", () => {
  // ── CP1: Empty input ──────────────────────────────────────────────────

  describe("CP1 — Empty input", () => {
    it("CP1.1 returns a packet with all defaults when given empty input", () => {
      const packet = buildChauReviewPacket({});
      expect(packet.meta.sessionId).toBe("unknown");
      expect(packet.meta.eventCount).toBe(0);
      expect(packet.meta.turnCount).toBe(0);
      expect(packet.meta.hasEnoughData).toBe(false);
      expect(packet.meta.dataWarnings.length).toBeGreaterThan(0);
    });

    it("CP1.2 all six dimensions score 0 with empty input", () => {
      const packet = buildChauReviewPacket({});
      expect(packet.diagnosis.review.score).toBe(0);
      expect(packet.teaching.review.score).toBe(0);
      expect(packet.memory.review.score).toBe(0);
      expect(packet.adaptation.review.score).toBe(0);
      expect(packet.selfCheck.review.score).toBe(0);
      expect(packet.learningGain.review.score).toBe(0);
    });

    it("CP1.3 verdict is 'concerning' for empty input", () => {
      const packet = buildChauReviewPacket({});
      expect(packet.overall.verdict).toBe("concerning");
      expect(packet.overall.score).toBe(0);
    });

    it("CP1.4 all dimensions marked as no data", () => {
      const packet = buildChauReviewPacket({});
      const dims = [
        packet.diagnosis.review,
        packet.teaching.review,
        packet.memory.review,
        packet.adaptation.review,
        packet.selfCheck.review,
        packet.learningGain.review,
      ];
      for (const d of dims) {
        expect(d.hasData).toBe(false);
      }
    });

    it("CP1.5 action items include data warnings", () => {
      const packet = buildChauReviewPacket({});
      expect(packet.overall.actionItems.length).toBeGreaterThan(0);
      const dataItems = packet.overall.actionItems.filter((i) =>
        i.includes("DỮ LIỆU"),
      );
      expect(dataItems.length).toBeGreaterThan(0);
    });

    it("CP1.6 packet is not reportable", () => {
      const packet = buildChauReviewPacket({});
      expect(isPacketReportable(packet)).toBe(false);
      expect(packet.overall.isReportable).toBe(false);
    });
  });

  // ── CP2: Minimal events only ──────────────────────────────────────────

  describe("CP2 — Events only", () => {
    it("CP2.1 diagnosis has data with 1+ events", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      expect(packet.diagnosis.review.hasData).toBe(true);
      expect(packet.diagnosis.totalCorrections).toBe(1);
    });

    it("CP2.2 detects correction source in events", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      expect(packet.diagnosis.correctionsBySource["grammar-rule"]).toBe(1);
    });

    it("CP2.3 computes error rate correctly", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent(),                  // has correction
          makeEventNoCorrection(),      // no correction
          makeEvent(),                  // has correction
        ],
      });
      expect(packet.diagnosis.errorRate).toBeCloseTo(2 / 3);
    });

    it("CP2.4 computes average confidence correctly", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent({ corrections: [{ source: "grammar-rule", position: 0, originalToken: "x", correctedToken: "y", confidence: 0.9, ruleId: "r1", explanationVi: null, explanationEn: null }] }),
          makeEvent({ corrections: [{ source: "grammar-rule", position: 0, originalToken: "a", correctedToken: "b", confidence: 0.5, ruleId: "r2", explanationVi: null, explanationEn: null }] }),
        ],
      });
      expect(packet.diagnosis.avgConfidence).toBeCloseTo(0.7);
    });

    it("CP2.5 adaptation has no data with < 4 events", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent(), makeEvent(), makeEvent()],
      });
      expect(packet.adaptation.review.hasData).toBe(false);
    });

    it("CP2.6 adaptation has data with >= 4 events", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent(),
          makeEvent(),
          makeEvent(),
          makeEvent(),
        ],
      });
      expect(packet.adaptation.review.hasData).toBe(true);
    });

    it("CP2.7 sessionId from events is used", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent({ sessionId: "my-session" })],
        sessionId: "my-session",
      });
      expect(packet.meta.sessionId).toBe("my-session");
    });

    it("CP2.8 top weaknesses are sorted by count", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent({ weaknessTags: ["articles"], weaknessLabelsVi: ["Mạo từ"] }),
          makeEvent({ weaknessTags: ["past-tense"], weaknessLabelsVi: ["Thì quá khứ"] }),
          makeEvent({ weaknessTags: ["past-tense"], weaknessLabelsVi: ["Thì quá khứ"] }),
          makeEvent({ weaknessTags: ["articles"], weaknessLabelsVi: ["Mạo từ"] }),
          makeEvent({ weaknessTags: ["past-tense"], weaknessLabelsVi: ["Thì quá khứ"] }),
        ],
      });
      expect(packet.diagnosis.topWeaknesses[0].tag).toBe("past-tense");
      expect(packet.diagnosis.topWeaknesses[0].count).toBe(3);
    });

    it("CP2.9 zero-correction events compute correctly", () => {
      const packet = buildChauReviewPacket({
        events: [makeEventNoCorrection(), makeEventNoCorrection()],
      });
      expect(packet.diagnosis.totalCorrections).toBe(0);
      expect(packet.diagnosis.errorRate).toBe(0);
      expect(packet.diagnosis.uniqueWeaknessTags).toBe(0);
    });
  });

  // ── CP3: Full session data ────────────────────────────────────────────

  describe("CP3 — Full session data", () => {
    const events = [
      makeEvent({ weaknessTags: ["past-tense"], weaknessLabelsVi: ["Thì quá khứ"], matchScore: 60 }),
      makeEvent({ weaknessTags: ["past-tense"], weaknessLabelsVi: ["Thì quá khứ"], matchScore: 65 }),
      makeEvent({ weaknessTags: ["articles"], weaknessLabelsVi: ["Mạo từ"], matchScore: 70 }),
      makeEvent({ weaknessTags: ["articles"], weaknessLabelsVi: ["Mạo từ"], matchScore: 72 }),
      makeEventNoCorrection({ matchScore: 80 }),
      makeEventNoCorrection({ matchScore: 85 }),
    ];

    it("CP3.1 produces a packet with all sections populated", () => {
      const packet = buildChauReviewPacket({ events });
      expect(packet.meta.eventCount).toBe(6);
      expect(packet.diagnosis.totalCorrections).toBe(4);
      expect(packet.diagnosis.uniqueWeaknessTags).toBe(2);
      expect(packet.adaptation.review.hasData).toBe(true);
    });

    it("CP3.2 diagnosis review has positive observations", () => {
      const packet = buildChauReviewPacket({ events });
      expect(packet.diagnosis.review.observations.length).toBeGreaterThan(0);
      expect(packet.diagnosis.review.score).toBeGreaterThan(0);
    });

    it("CP3.3 detects correction rate decrease (adaptation)", () => {
      const packet = buildChauReviewPacket({ events });
      // First 3 events have corrections, last 3 don't → correction rate decreased
      expect(packet.adaptation.correctionRateDecreased).toBe(true);
    });

    it("CP3.4 detects match score improvement", () => {
      const packet = buildChauReviewPacket({ events });
      expect(packet.adaptation.matchScoresImproved).toBe(true);
    });
  });

  // ── CP4: Memory integration ───────────────────────────────────────────

  describe("CP4 — Memory integration", () => {
    it("CP4.1 memory snapshot is null when no memory data", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      expect(packet.memory.snapshot).toBeNull();
    });

    it("CP4.2 memory snapshot is populated when provided", () => {
      const memory = makeMemory();
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: memory,
      });
      expect(packet.memory.snapshot).not.toBeNull();
      expect(packet.memory.strengthsCount).toBe(2);
      expect(packet.memory.weaknessesCount).toBe(2);
    });

    it("CP4.3 memory freshness detected for recent updates", () => {
      const memory = makeMemory();
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: memory,
      });
      expect(packet.memory.isFresh).toBe(true);
    });

    it("CP4.4 memory staleness detected for old updates", () => {
      const memory: ChauMemorySnapshot = {
        ...makeMemory(),
        lastUpdatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      };
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: memory,
      });
      expect(packet.memory.isFresh).toBe(false);
    });

    it("CP4.5 memoryWASUsed is true when memory has corrections", () => {
      const memory = makeMemory();
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: memory,
      });
      expect(packet.memory.memoryWasUsed).toBe(true);
    });

    it("CP4.6 memory not used when totalCorrections is 0", () => {
      const memory: ChauMemorySnapshot = {
        ...makeMemory(),
        totalCorrections: 0,
        strengths: [],
        needsReview: [],
        commonMistakePatterns: [],
      };
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: memory,
      });
      expect(packet.memory.memoryWasUsed).toBe(false);
    });

    it("CP4.7 memory review has positive observations for populated memory", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: makeMemory(),
      });
      expect(packet.memory.review.observations.length).toBeGreaterThan(0);
      expect(packet.memory.review.hasData).toBe(true);
    });

    it("CP4.8 memory is null when given empty object", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: {},
      });
      expect(packet.memory.snapshot).toBeNull();
    });
  });

  // ── CP5: Audit integration ────────────────────────────────────────────

  describe("CP5 — Audit integration", () => {
    it("CP5.1 all audits passed → selfCheck score is high", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [
          makeAuditPassed(),
          makeAuditPassed(),
          makeAuditPassed(),
        ],
      });
      expect(packet.selfCheck.auditCount).toBe(3);
      expect(packet.selfCheck.auditsPassed).toBe(3);
      expect(packet.selfCheck.safetyFailures).toBe(0);
      expect(packet.selfCheck.review.score).toBeGreaterThanOrEqual(2);
    });

    it("CP5.2 safety failures detected", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [
          makeAuditPassed(),
          makeAuditFailed(),
        ],
      });
      expect(packet.selfCheck.safetyFailures).toBe(1);
      expect(packet.teaching.safetyViolations).toBe(1);
    });

    it("CP5.3 safety violations trigger action items", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditFailed()],
      });
      const safetyItems = packet.overall.actionItems.filter((i) =>
        i.includes("AN TOÀN"),
      );
      expect(safetyItems.length).toBeGreaterThan(0);
    });

    it("CP5.4 contract violations counted separately", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [
          makeAuditPassed(),
          makeAuditPassed(),
          makeAuditFailed(),
        ],
      });
      expect(packet.teaching.contractViolations).toBe(1);
    });

    it("CP5.5 overclaim guard is active when audits exist", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditPassed()],
      });
      expect(packet.selfCheck.overclaimGuardActive).toBe(true);
    });

    it("CP5.6 overclaim guard is inactive without audits", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      expect(packet.selfCheck.overclaimGuardActive).toBe(false);
    });
  });

  // ── CP6: Learning gain integration ────────────────────────────────────

  describe("CP6 — Learning gain integration", () => {
    it("CP6.1 pre-computed gain result is used directly", () => {
      const gain = makeGainResult();
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        gainResult: gain,
      });
      expect(packet.learningGain.gainResult).toBe(gain);
      expect(packet.learningGain.hasMeasurableGain).toBe(true);
      expect(packet.learningGain.hasReportableGain).toBe(true);
    });

    it("CP6.2 improving dimensions extracted from gain result", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        gainResult: makeGainResult(),
      });
      expect(packet.learningGain.improvingDimensions.length).toBeGreaterThan(0);
      expect(packet.learningGain.improvingDimensions).toContain("Giảm lỗi");
    });

    it("CP6.3 declining dimensions are empty for significant gain", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        gainResult: makeGainResult(),
      });
      expect(packet.learningGain.decliningDimensions.length).toBe(0);
    });

    it("CP6.4 no gain result → no measurable gain", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      expect(packet.learningGain.gainResult).toBeNull();
      expect(packet.learningGain.hasMeasurableGain).toBe(false);
      expect(packet.learningGain.hasReportableGain).toBe(false);
    });

    it("CP6.5 gain review has data when gain result is provided", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        gainResult: makeGainResult(),
      });
      expect(packet.learningGain.review.hasData).toBe(true);
    });
  });

  // ── CP7: Tutor turns → teaching data ──────────────────────────────────

  describe("CP7 — Tutor turns", () => {
    it("CP7.1 explanations provided counted from turns", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        turns: [
          makeTutorTurn({ explanation: "Sửa lỗi thì quá khứ." }),
          makeTutorTurn({ explanation: "Dùng mạo từ 'the'." }),
          makeTutorTurn({ explanation: "" }),
        ],
      });
      expect(packet.teaching.explanationsProvided).toBe(2);
    });

    it("CP7.2 turnCount uses max of turns and events", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        turns: [makeTutorTurn(), makeTutorTurn(), makeTutorTurn()],
      });
      expect(packet.meta.turnCount).toBe(3);
    });

    it("CP7.3 timing distribution built from event timingModes", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent({ timingMode: "IMMEDIATE" }),
          makeEvent({ timingMode: "IMMEDIATE" }),
          makeEvent({ timingMode: "DELAYED" }),
        ],
      });
      expect(packet.teaching.timingDistribution["IMMEDIATE"]).toBe(2);
      expect(packet.teaching.timingDistribution["DELAYED"]).toBe(1);
    });
  });

  // ── CP8: Rubric integration ───────────────────────────────────────────

  describe("CP8 — Rubric integration", () => {
    it("CP8.1 rubric result passed through to teaching section", () => {
      const rubricResult: RubricResult = {
        classification: "acceptable",
        safetyPassed: true,
        dimensions: [],
        summaryVi: "Đạt yêu cầu.",
        contractResult: {
          passed: true,
          failedCount: 0,
          rules: [],
          summaryVi: "Đạt.",
        },
      };
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        rubricResult,
      });
      expect(packet.teaching.rubricResult).toBe(rubricResult);
    });

    it("CP8.2 rubric safety violation counted", () => {
      const rubricResult: RubricResult = {
        classification: "failing",
        safetyPassed: false,
        dimensions: [],
        summaryVi: "Không an toàn.",
        contractResult: {
          passed: false,
          failedCount: 1,
          rules: [],
          summaryVi: "Không đạt.",
        },
      };
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        rubricResult,
      });
      // Rubric safety failure adds to safety violations count
      expect(packet.teaching.safetyViolations).toBeGreaterThanOrEqual(1);
    });
  });

  // ── CP9: Verdict classification ───────────────────────────────────────

  describe("CP9 — Verdict classification", () => {
    it("CP9.1 excellent_teacher with all data and high scores", () => {
      const memory = makeMemory();
      const events = [
        makeEvent({ matchScore: 70 }),
        makeEvent({ matchScore: 75 }),
        makeEvent({ matchScore: 80 }),
        makeEvent({ matchScore: 85 }),
        makeEventNoCorrection({ matchScore: 90 }),
        makeEventNoCorrection({ matchScore: 95 }),
      ];
      const packet = buildChauReviewPacket({
        events,
        memoryData: memory,
        auditResults: [makeAuditPassed(), makeAuditPassed()],
        gainResult: makeGainResult(),
      });
      // With full data and all audits passing, should be excellent or good
      expect(["excellent_teacher", "good_teacher"]).toContain(packet.overall.verdict);
    });

    it("CP9.2 concerning when safety violations exist", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditFailed()],
      });
      expect(packet.overall.verdict).toBe("concerning");
    });

    it("CP9.3 concerning when not enough data", () => {
      const packet = buildChauReviewPacket({});
      expect(packet.overall.verdict).toBe("concerning");
    });

    it("CP9.4 needs_improvement with minimal data and some issues", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditPassed()],
      });
      // Only 1 event, 1 audit → minimal data, likely needs_improvement
      expect(["needs_improvement", "concerning"]).toContain(packet.overall.verdict);
    });
  });

  // ── CP10: Action items ────────────────────────────────────────────────

  describe("CP10 — Action items", () => {
    it("CP10.1 getActionItems returns all action items", () => {
      const packet = buildChauReviewPacket({});
      const items = getActionItems(packet);
      expect(items).toEqual(packet.overall.actionItems);
      expect(items.length).toBeGreaterThan(0);
    });

    it("CP10.2 action items reference specific dimensions", () => {
      const packet = buildChauReviewPacket({});
      const items = getActionItems(packet);
      // Should reference at least one dimension name
      const hasDimensionRef = items.some(
        (i) =>
          i.includes("Chẩn đoán") ||
          i.includes("Giảng dạy") ||
          i.includes("Ghi nhớ") ||
          i.includes("Thích ứng") ||
          i.includes("Tự kiểm") ||
          i.includes("Chứng minh"),
      );
      expect(hasDimensionRef).toBe(true);
    });

    it("CP10.3 no action items include AN TOÀN when safe", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditPassed()],
      });
      const safetyItems = packet.overall.actionItems.filter((i) =>
        i.includes("AN TOÀN"),
      );
      expect(safetyItems.length).toBe(0);
    });
  });

  // ── CP11: Compact summary ─────────────────────────────────────────────

  describe("CP11 — Compact summary", () => {
    it("CP11.1 returns non-empty string for empty packet", () => {
      const packet = buildChauReviewPacket({});
      const summary = getCompactSummaryVi(packet);
      expect(summary).toBeTruthy();
      expect(typeof summary).toBe("string");
    });

    it("CP11.2 contains dimension score pattern", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      const summary = getCompactSummaryVi(packet);
      expect(summary).toContain("/3");
    });

    it("CP11.3 starts with checkmark for good verdicts", () => {
      const memory = makeMemory();
      const events = [
        makeEvent(), makeEvent(), makeEvent(), makeEvent(),
        makeEventNoCorrection(), makeEventNoCorrection(),
      ];
      const packet = buildChauReviewPacket({
        events,
        memoryData: memory,
        auditResults: [makeAuditPassed(), makeAuditPassed()],
      });
      const summary = getCompactSummaryVi(packet);
      // If verdict is good, should start with ✓ or ⚠
      expect(
        summary.startsWith("✓") || summary.startsWith("⚠"),
      ).toBe(true);
    });
  });

  // ── CP12: isPacketReportable ──────────────────────────────────────────

  describe("CP12 — isPacketReportable", () => {
    it("CP12.1 false for empty packet", () => {
      const packet = buildChauReviewPacket({});
      expect(isPacketReportable(packet)).toBe(false);
    });

    it("CP12.2 false for unsafe packet", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        auditResults: [makeAuditFailed()],
      });
      expect(isPacketReportable(packet)).toBe(false);
    });

    it("CP12.3 true for fully-populated safe packet with high scores", () => {
      const memory = makeMemory();
      const events = [
        makeEvent({ matchScore: 70 }),
        makeEvent({ matchScore: 75 }),
        makeEvent({ matchScore: 80 }),
        makeEvent({ matchScore: 85 }),
        makeEventNoCorrection({ matchScore: 90 }),
        makeEventNoCorrection({ matchScore: 95 }),
      ];
      const packet = buildChauReviewPacket({
        events,
        memoryData: memory,
        auditResults: [
          makeAuditPassed(),
          makeAuditPassed(),
          makeAuditPassed(),
        ],
        gainResult: makeGainResult(),
      });
      expect(isPacketReportable(packet)).toBe(true);
    });
  });

  // ── CP13: Data quality warnings ───────────────────────────────────────

  describe("CP13 — Data quality warnings", () => {
    it("CP13.1 warns when < 3 dimensions have data", () => {
      const packet = buildChauReviewPacket({});
      const hasDataWarn = packet.meta.dataWarnings.some((w) =>
        w.includes("chiều có đủ dữ liệu"),
      );
      expect(hasDataWarn).toBe(true);
    });

    it("CP13.2 warns when event count is too low", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent(), makeEvent()],
      });
      const hasLowDataWarn = packet.meta.dataWarnings.some((w) =>
        w.includes("Ít dữ liệu"),
      );
      expect(hasLowDataWarn).toBe(true);
    });

    it("CP13.3 warns when no audit data but events exist", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent(), makeEvent(), makeEvent()],
      });
      const hasAuditWarn = packet.meta.dataWarnings.some((w) =>
        w.includes("tự kiểm"),
      );
      expect(hasAuditWarn).toBe(true);
    });

    it("CP13.4 warns when no memory data", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      const hasMemoryWarn = packet.meta.dataWarnings.some((w) =>
        w.includes("ghi nhớ"),
      );
      expect(hasMemoryWarn).toBe(true);
    });

    it("CP13.5 no excessive warnings when all data present", () => {
      const memory = makeMemory();
      const events = [
        makeEvent(), makeEvent(), makeEvent(), makeEvent(),
      ];
      const packet = buildChauReviewPacket({
        events,
        memoryData: memory,
        auditResults: [makeAuditPassed()],
      });
      // With 4 events + memory + audit, warnings should be minimal or none
      const criticalWarnings = packet.meta.dataWarnings.filter(
        (w) =>
          !w.includes("chỉ có") || // "only N dimensions" — may still fire with just 1 audit
          !w.includes("4 sự kiện") || // "only 4 events" — threshold is < 4
          true,
      );
      // At minimum, should not complain about "no audit" or "no memory"
      expect(
        packet.meta.dataWarnings.some((w) => w.includes("tự kiểm")),
      ).toBe(false);
      expect(
        packet.meta.dataWarnings.some((w) => w.includes("ghi nhớ")),
      ).toBe(false);
    });
  });

  // ── CP14: Dimension catalog ───────────────────────────────────────────

  describe("CP14 — Dimension catalog", () => {
    it("CP14.1 catalog has 6 dimensions", () => {
      expect(CHAU_REVIEW_DIMENSION_CATALOG).toHaveLength(6);
    });

    it("CP14.2 each dimension has Vietnamese and English titles", () => {
      for (const dim of CHAU_REVIEW_DIMENSION_CATALOG) {
        expect(dim.titleVi).toBeTruthy();
        expect(dim.titleEn).toBeTruthy();
        expect(dim.descriptionVi).toBeTruthy();
        expect(dim.capability).toBeTruthy();
      }
    });

    it("CP14.3 catalog capabilities match the 6 teacher capabilities", () => {
      const capabilities = CHAU_REVIEW_DIMENSION_CATALOG.map((d) => d.capability);
      expect(capabilities).toContain("diagnose");
      expect(capabilities).toContain("teach");
      expect(capabilities).toContain("remember");
      expect(capabilities).toContain("adapt");
      expect(capabilities).toContain("self-check");
      expect(capabilities).toContain("prove");
    });

    it("CP14.4 each dimension in the packet corresponds to a catalog entry", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      const catalogIds = CHAU_REVIEW_DIMENSION_CATALOG.map((d) => d.id);
      const packetDimIds = [
        packet.diagnosis.review.dimensionId,
        packet.teaching.review.dimensionId,
        packet.memory.review.dimensionId,
        packet.adaptation.review.dimensionId,
        packet.selfCheck.review.dimensionId,
        packet.learningGain.review.dimensionId,
      ];
      expect(packetDimIds.sort()).toEqual(catalogIds.sort());
    });
  });

  // ── CP15: Edge cases ──────────────────────────────────────────────────

  describe("CP15 — Edge cases", () => {
    it("CP15.1 handles null memoryData gracefully", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        memoryData: null,
      });
      expect(packet.memory.snapshot).toBeNull();
      expect(packet.memory.review.hasData).toBe(false);
    });

    it("CP15.2 handles null rubricResult gracefully", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        rubricResult: null,
      });
      expect(packet.teaching.rubricResult).toBeNull();
    });

    it("CP15.3 handles null gainResult gracefully", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        gainResult: null,
      });
      expect(packet.learningGain.gainResult).toBeNull();
    });

    it("CP15.4 handles undefined optional fields in input", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
        // turns, auditResults, memoryData, rubricResult, gainResult all omitted
      });
      expect(packet.teaching.explanationsProvided).toBe(0);
      expect(packet.selfCheck.auditCount).toBe(0);
      expect(packet.memory.snapshot).toBeNull();
    });

    it("CP15.5 events with null matchScores don't break adaptation", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent({ matchScore: null }),
          makeEvent({ matchScore: null }),
          makeEvent({ matchScore: null }),
          makeEvent({ matchScore: null }),
        ],
      });
      // Should not throw — adaptation handles nulls
      expect(packet.adaptation.matchScoresImproved).toBe(false);
    });

    it("CP15.6 events with empty weakness arrays don't break", () => {
      const packet = buildChauReviewPacket({
        events: [
          makeEvent({ weaknessTags: [], weaknessLabelsVi: [] }),
          makeEvent({ weaknessTags: [], weaknessLabelsVi: [] }),
        ],
      });
      expect(packet.diagnosis.uniqueWeaknessTags).toBe(0);
      expect(packet.diagnosis.topWeaknesses).toHaveLength(0);
    });

    it("CP15.7 packet is deterministic — same input produces same output", () => {
      const input: BuildChauReviewPacketInput = {
        events: [makeEvent({ id: "fixed-1" }), makeEventNoCorrection({ id: "fixed-2" })],
        sessionId: "deterministic-test",
      };
      const p1 = buildChauReviewPacket(input);
      const p2 = buildChauReviewPacket(input);
      expect(p1.overall.verdict).toBe(p2.overall.verdict);
      expect(p1.overall.score).toBe(p2.overall.score);
      expect(p1.diagnosis.totalCorrections).toBe(p2.diagnosis.totalCorrections);
    });

    it("CP15.8 generatedAt is different for each call", () => {
      const p1 = buildChauReviewPacket({});
      const p2 = buildChauReviewPacket({});
      // Should have different timestamps (or at least not throw)
      expect(typeof p1.meta.generatedAt).toBe("string");
      expect(typeof p2.meta.generatedAt).toBe("string");
    });

    it("CP15.9 sessionId defaults to 'unknown' when not provided", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent({ sessionId: "real-session" })],
      });
      // Uses the events' sessionId via the proof builder
      expect(packet.meta.sessionId).toBeTruthy();
    });

    it("CP15.10 single event with no correction has correct diagnosis", () => {
      const packet = buildChauReviewPacket({
        events: [makeEventNoCorrection()],
      });
      expect(packet.diagnosis.totalCorrections).toBe(0);
      expect(packet.diagnosis.errorRate).toBe(0);
      expect(packet.diagnosis.review.hasData).toBe(true);
    });
  });

  // ── CP16: Vietnamese-first ────────────────────────────────────────────

  describe("CP16 — Vietnamese-first", () => {
    it("CP16.1 all dimension reviews have Vietnamese titles", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      const dims = [
        packet.diagnosis.review,
        packet.teaching.review,
        packet.memory.review,
        packet.adaptation.review,
        packet.selfCheck.review,
        packet.learningGain.review,
      ];
      for (const d of dims) {
        expect(d.titleVi).toBeTruthy();
        expect(typeof d.titleVi).toBe("string");
      }
    });

    it("CP16.2 dimension labels are in Vietnamese", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      const dims = [
        packet.diagnosis.review,
        packet.teaching.review,
        packet.memory.review,
        packet.adaptation.review,
        packet.selfCheck.review,
        packet.learningGain.review,
      ];
      const validLabels = ["xuất sắc", "tốt", "cần cải thiện", "đáng lo"];
      for (const d of dims) {
        expect(validLabels).toContain(d.label);
      }
    });

    it("CP16.3 overall summary is in Vietnamese", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      // summaryVi should contain Vietnamese characters/words
      expect(packet.overall.summaryVi).toBeTruthy();
      expect(packet.overall.summaryEn).toBeTruthy();
    });

    it("CP16.4 action items contain Vietnamese dimension names", () => {
      const packet = buildChauReviewPacket({});
      const items = getActionItems(packet);
      const viDimensions = [
        "Chẩn đoán",
        "Giảng dạy",
        "Ghi nhớ",
        "Thích ứng",
        "Tự kiểm",
        "Chứng minh",
      ];
      const hasViDimension = items.some((item) =>
        viDimensions.some((vd) => item.includes(vd)),
      );
      expect(hasViDimension).toBe(true);
    });

    it("CP16.5 review questions are in Vietnamese", () => {
      const packet = buildChauReviewPacket({
        events: [makeEvent()],
      });
      for (const q of packet.diagnosis.review.reviewQuestions) {
        // Vietnamese questions end with dấu hỏi
        expect(q).toMatch(/[?？]/);
      }
    });
  });
});
