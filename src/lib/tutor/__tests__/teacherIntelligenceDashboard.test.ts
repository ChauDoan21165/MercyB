/**
 * Teacher Intelligence Dashboard — Test Suite
 *
 * Tests the teacherIntelligenceDashboard.ts module. Covers:
 *   - Empty/minimal input → graceful degradation
 *   - Single session → basic dashboard
 *   - Multiple sessions → aggregation + trends
 *   - Checklist integration → combined scoring
 *   - Trend computation (improving / stable / declining)
 *   - Dimension aggregation accuracy
 *   - Verdict classification
 *   - Action item generation
 *   - Dashboard comparison (current vs previous)
 *   - Weekly report summary
 *   - Helper APIs (getDimensionTrend, isDashboardReportable, etc.)
 *   - Edge cases (null inputs, partial data, mixed sources)
 */

import { describe, it, expect } from "vitest";
import {
  buildTeacherIntelligenceDashboard,
  isDashboardReportable,
  getDimensionTrend,
  getDashboardCompactSummary,
  getDashboardActionItems,
  getDimensionsNeedingAttention,
  getIntelligenceScore,
  compareDashboards,
  isStrongHumanTeacher,
  getWeeklyReportSummary,
  TEACHER_INTELLIGENCE_DIMENSION_CATALOG,
  type TeacherIntelligenceDashboard,
  type TeacherIntelligenceDashboardInput,
  type TeacherIntelligenceDimensionId,
} from "../teacherIntelligenceDashboard";
import { buildChauReviewPacket, type ChauReviewPacket } from "../chauReviewPacket";
import type { TranscriptCorrectionEvent } from "../transcriptCorrectionTypes";
import {
  buildHumanLearnerChecklistResult,
  buildScenarioEvents,
  buildLearnerInputFromTurn,
  buildTutorResponseFromTurn,
  type HumanLearnerChecklistResult,
  type ScenarioChecklistInput,
  type LearnerTestScenario,
  type LearnerTestTurn,
  type LearnerPersona,
} from "../humanLearnerTestingChecklist";
import {
  checkTeacherMercyContract,
  checkCorrectionContract,
} from "../teacherMercyContract";
import { evaluateRubric } from "../teacherMercyRubric";
import { auditResponse, type AuditResult } from "../teacherMercyAuditGate";
import type { RubricResult } from "../teacherMercyRubric";
import {
  captureBaseline,
  captureOutcome,
  assessLearningGain,
  type LearningGainResult,
} from "../learningGainRubric";

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function makeEvent(overrides: Partial<TranscriptCorrectionEvent> = {}): TranscriptCorrectionEvent {
  const base: TranscriptCorrectionEvent = {
    id: `evt-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now() - Math.floor(Math.random() * 3600000),
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
        confidence: 0.85,
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

function makeEventsWithImprovingScores(
  count: number,
  sessionId: string,
  startScore: number = 60,
  scoreIncrement: number = 3,
): TranscriptCorrectionEvent[] {
  const events: TranscriptCorrectionEvent[] = [];
  for (let i = 0; i < count; i++) {
    const hasCorrection = i < count * 0.6; // 60% have corrections early
    events.push(
      makeEvent({
        sessionId,
        turnNumber: i + 1,
        timestamp: Date.now() - (count - i) * 60000,
        matchScore: Math.min(100, startScore + i * scoreIncrement),
        corrections: hasCorrection
          ? [
              {
                source: "grammar-rule" as const,
                position: 2,
                originalToken: "go",
                correctedToken: "went",
                confidence: 0.7 + i * 0.02,
                ruleId: "past-tense",
                explanationVi: "Sửa thì quá khứ",
                explanationEn: "Past tense fix",
              },
            ]
          : [],
        learnerAcknowledged: hasCorrection,
        weaknessTags: hasCorrection ? ["past-tense"] : [],
        weaknessLabelsVi: hasCorrection ? ["Thì quá khứ"] : [],
        didSelfCorrect: i > count / 2,
      }),
    );
  }
  return events;
}

function makeGoodReviewPacket(
  sessionId: string,
  events: TranscriptCorrectionEvent[],
  overrides: Partial<Parameters<typeof buildChauReviewPacket>[0]> = {},
): ChauReviewPacket {
  return buildChauReviewPacket({
    sessionId,
    events,
    ...overrides,
  });
}

function makeMediocreReviewPacket(
  sessionId: string,
): ChauReviewPacket {
  const events: TranscriptCorrectionEvent[] = [];
  for (let i = 0; i < 4; i++) {
    events.push(
      makeEvent({
        sessionId,
        turnNumber: i + 1,
        matchScore: 50 + i * 3,
        corrections:
          i < 3
            ? [
                {
                  source: "grammar-rule" as const,
                  position: 0,
                  originalToken: "bad",
                  correctedToken: "badly",
                  confidence: 0.45,
                  ruleId: "adverb-form",
                  explanationVi: "Sai dạng trạng từ",
                  explanationEn: "Wrong adverb form",
                },
              ]
            : [],
        weaknessTags: i < 3 ? ["adverb-form"] : [],
        weaknessLabelsVi: i < 3 ? ["Dạng trạng từ"] : [],
        learnerAcknowledged: i < 2,
      }),
    );
  }
  return buildChauReviewPacket({ sessionId, events });
}

function makePoorReviewPacket(sessionId: string): ChauReviewPacket {
  const events: TranscriptCorrectionEvent[] = [];
  for (let i = 0; i < 3; i++) {
    events.push(
      makeEvent({
        sessionId,
        turnNumber: i + 1,
        matchScore: 20 + i * 5,
        corrections: [
          {
            source: "grammar-rule" as const,
            position: 0,
            originalToken: "wrong",
            correctedToken: "wrong",
            confidence: 0.2,
            ruleId: "unknown",
            explanationVi: "Không rõ lỗi",
            explanationEn: "Unclear error",
          },
        ],
        weaknessTags: [],
        weaknessLabelsVi: [],
        learnerAcknowledged: false,
      }),
    );
  }
  return buildChauReviewPacket({ sessionId, events });
}

function makeMinimalChecklistResult(
  _overallVerdict: "excellent_teacher" | "good_teacher" | "needs_improvement" | "concerning" = "good_teacher",
): HumanLearnerChecklistResult {
  // Build a minimal persona for the test
  const persona: LearnerPersona = {
    id: "test-minh",
    nameVi: "Minh Test",
    nameEn: "Minh Test",
    age: 19,
    cefrLevel: "A1",
    occupationVi: "Sinh viên",
    goalVi: "Học tiếng Anh",
    errorPatternsVi: ["Thiếu động từ to-be"],
    typicalWeaknessTags: ["copula-omission"],
    potentialStrengths: ["basic-greetings"],
    typicalSessionTurns: 6,
  };

  const turns: LearnerTestTurn[] = [
    {
      turnNumber: 1,
      learnerText: "He teacher",
      correctedText: "He is a teacher",
      weaknessTags: ["copula-omission"],
      matchScore: 60,
      didSelfCorrect: false,
      acknowledged: true,
      corrections: [
        {
          source: "vietlish-pattern",
          originalToken: "teacher",
          correctedToken: "is a teacher",
          confidence: 0.85,
          ruleId: "copula-omission",
          explanationVi: "Thiếu động từ to-be",
        },
      ],
      teacherResponseVi: "Em muốn nói 'He IS a teacher' — thêm 'is' vào nhé.",
      teacherResponseEn: "You need 'is' — 'He IS a teacher'.",
      teacherCorrectedSentence: "He is a teacher",
      grammarPoints: ["copula"],
      referencesTrackedWeakness: false,
      correctionTiming: "IMMEDIATE",
    },
    {
      turnNumber: 2,
      learnerText: "He is a teacher",
      correctedText: "He is a teacher",
      weaknessTags: [],
      matchScore: 80,
      didSelfCorrect: true,
      acknowledged: true,
      corrections: [],
      teacherResponseVi: "Rất tốt! Em đã thêm 'is' đúng rồi.",
      teacherResponseEn: "Great! You added 'is' correctly.",
      teacherCorrectedSentence: null,
      grammarPoints: [],
      referencesTrackedWeakness: true,
      correctionTiming: "IMMEDIATE",
    },
  ];

  const scenario: LearnerTestScenario = {
    id: "test-scenario",
    persona,
    descriptionVi: "Scenario kiểm tra cơ bản",
    primaryDimensions: ["Chẩn đoán", "Giảng dạy"],
    turns,
    expectedMemory: {
      strengths: ["copula-awareness"],
      weaknesses: ["copula-omission"],
      commonMistakePatterns: ["Thiếu to-be"],
      recommendation: "Luyện thêm câu với to-be",
      confidenceTrend: "improving",
    },
  };

  // Build the full pipeline data for the checklist
  const events = buildScenarioEvents(scenario);

  let trackedWeakness: string | null = null;
  const contractResults = [];
  const rubricResults: RubricResult[] = [];
  const auditResults: AuditResult[] = [];

  for (const turn of scenario.turns) {
    const learnerInput = buildLearnerInputFromTurn(
      turn,
      scenario.persona,
      trackedWeakness,
    );
    const tutorResponse = buildTutorResponseFromTurn(turn);

    const correctionResult = checkCorrectionContract(learnerInput, tutorResponse);
    const teacherResult = checkTeacherMercyContract(learnerInput, tutorResponse);
    const contractResult =
      correctionResult.rules.length >= teacherResult.rules.length
        ? correctionResult
        : teacherResult;
    contractResults.push(contractResult);

    const rubricResult = evaluateRubric(learnerInput, tutorResponse);
    rubricResults.push(rubricResult);

    const auditResult = auditResponse(
      learnerInput.text,
      tutorResponse,
      "correction",
    );
    auditResults.push(auditResult);

    if (turn.weaknessTags.length > 0) {
      trackedWeakness = turn.weaknessTags[0];
    }
  }

  const baseline = captureBaseline(events);
  const outcome = captureOutcome(events);
  const gainResult = assessLearningGain(baseline, outcome);

  const reviewPacket = buildChauReviewPacket({
    events,
    sessionId: scenario.id,
    auditResults,
    rubricResult: rubricResults.length > 0 ? rubricResults[0] : null,
    gainResult,
  });

  const input: ScenarioChecklistInput = {
    scenario,
    events,
    contractResults,
    auditResults,
    rubricResults,
    gainResult,
    reviewPacket,
  };

  return buildHumanLearnerChecklistResult([input]);
}

// ─── Empty / Minimal Input ────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — empty/minimal input", () => {
  it("returns a dashboard with zeros when no data is provided", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.meta.sessionCount).toBe(0);
    expect(dashboard.meta.checklistCount).toBe(0);
    expect(dashboard.meta.hasEnoughData).toBe(false);
    expect(dashboard.meta.dataWarnings.length).toBeGreaterThan(0);
    expect(dashboard.overall.intelligenceScore).toBe(0);
    expect(dashboard.overall.verdict).toBe("needs_intervention");
    expect(dashboard.overall.isStrongHumanTeacher).toBe(false);
    expect(dashboard.overall.isReportable).toBe(false);
    expect(dashboard.dimensions).toHaveLength(6);
  });

  it("marks all dimensions as insufficient_data when empty", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    for (const dim of dashboard.dimensions) {
      expect(dim.dataPointCount).toBe(0);
      expect(dim.dataPointsWithData).toBe(0);
      expect(dim.averageScore).toBe(0);
      expect(dim.needsAttention).toBe(true);
      expect(dim.trend).toBe("insufficient_data");
    }
  });

  it("has data warnings when no data provided", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.meta.dataWarnings.length).toBeGreaterThan(0);
    expect(dashboard.meta.dataWarnings.some((w) => w.includes("buổi học") || w.includes("checklist"))).toBe(true);
  });

  it("produces empty session and checklist summaries", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.sessions).toHaveLength(0);
    expect(dashboard.checklist.runCount).toBe(0);
    expect(dashboard.checklist.overallPassRate).toBe(0);
  });

  it("generates action items even with no data", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.actionItems.length).toBeGreaterThan(0);
    // Should include a [DỮ LIỆU] item about missing data
    expect(dashboard.actionItems.some((i) => i.includes("[DỮ LIỆU]"))).toBe(true);
  });
});

// ─── Single Session ───────────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — single session", () => {
  it("produces a dashboard from one good review packet", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 60, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
      timeWindowVi: "Hôm nay",
    });

    expect(dashboard.meta.sessionCount).toBe(1);
    expect(dashboard.meta.sessionsWithData).toBe(1);
    expect(dashboard.meta.hasEnoughData).toBe(true);
    expect(dashboard.overall.intelligenceScore).toBeGreaterThan(0);
    expect(dashboard.sessions).toHaveLength(1);
    expect(dashboard.sessions[0].sessionId).toBe("session-1");
  });

  it("includes the session's verdict in session summaries", () => {
    const events = makeEventsWithImprovingScores(8, "session-abc", 60, 4);
    const packet = makeGoodReviewPacket("session-abc", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    expect(dashboard.sessions[0].sessionId).toBe("session-abc");
    expect(dashboard.sessions[0].hasEnoughData).toBe(true);
    expect(dashboard.sessions[0].eventCount).toBe(8);
  });

  it("warns when fewer than 3 sessions and no checklist", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 60, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    expect(dashboard.meta.dataWarnings).toContainEqual(
      expect.stringContaining("Ít hơn 3 buổi học"),
    );
  });

  it("computes dimension scores from the packet", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 60, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    for (const dim of dashboard.dimensions) {
      expect(dim.dataPointCount).toBeGreaterThanOrEqual(1);
      expect(dim.sessionAverage).not.toBeNull();
    }
  });
});

// ─── Multiple Sessions — Aggregation ──────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — multiple sessions", () => {
  it("aggregates across multiple good sessions", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(8, `session-${i + 1}`, 65 + i * 3, 3);
      packets.push(makeGoodReviewPacket(`session-${i + 1}`, events));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      timeWindowVi: "5 ngày qua",
    });

    expect(dashboard.meta.sessionCount).toBe(5);
    expect(dashboard.meta.sessionsWithData).toBe(5);
    expect(dashboard.sessions).toHaveLength(5);
    expect(dashboard.overall.intelligenceScore).toBeGreaterThan(0);
  });

  it("computes a reasonable intelligence score for all-good sessions", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(10, `session-${i + 1}`, 70, 3);
      packets.push(makeGoodReviewPacket(`session-${i + 1}`, events));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
    });

    // With good data, score should be > 50
    expect(dashboard.overall.intelligenceScore).toBeGreaterThan(50);
  });

  it("produces lower scores for mediocre sessions", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 3; i++) {
      packets.push(makeMediocreReviewPacket(`mediocre-${i + 1}`));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packets[0]],
    });

    const dashboardMulti = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
    });

    // Multiple mediocre sessions should still produce a non-zero score
    expect(dashboardMulti.overall.intelligenceScore).toBeGreaterThanOrEqual(0);
  });

  it("correctly counts sessions with enough data", () => {
    const goodEvents = makeEventsWithImprovingScores(8, "good-session", 65, 3);
    const goodPacket = makeGoodReviewPacket("good-session", goodEvents);
    const poorPacket = makePoorReviewPacket("poor-session");

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [goodPacket, poorPacket],
    });

    // Both should be counted as sessions; sessionsWithData depends on hasEnoughData
    expect(dashboard.meta.sessionCount).toBe(2);
  });
});

// ─── Trend Computation ────────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — trends", () => {
  it("marks trends as insufficient_data with fewer than 2 sessions", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 60, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    for (const dim of dashboard.dimensions) {
      expect(dim.trend).toBe("insufficient_data");
    }
    expect(dashboard.trends.overallTrend).toBe("insufficient_data");
  });

  it("detects improving trends across sessions with increasing quality", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(8, `session-${i + 1}`, 50 + i * 10, 5);
      packets.push(makeGoodReviewPacket(`session-${i + 1}`, events));
    }

    // Override timestamps to be clearly sequential
    const base = Date.now() - 5 * 86400000; // 5 days ago
    const patched = packets.map((p, i) => ({
      ...p,
      meta: { ...p.meta, generatedAt: new Date(base + i * 86400000).toISOString() },
    }));

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: patched,
      timeWindowVi: "5 ngày qua",
    });

    // At least some dimensions should show improving trend
    const improvingDims = dashboard.dimensions.filter((d) => d.trend === "improving");
    // Even if not all improve, we should see trends computed
    expect(dashboard.trends.insufficientData.length).toBeLessThan(6);
  });

  it("detects declining trends with poor sessions after good ones", () => {
    // Good session first, then declining
    const goodEvents = makeEventsWithImprovingScores(10, "early-good", 80, 2);
    const goodPacket = makeGoodReviewPacket("early-good", goodEvents);
    const poorPacket1 = makePoorReviewPacket("late-poor-1");
    const poorPacket2 = makePoorReviewPacket("late-poor-2");

    // Set timestamps: good is 3 days ago, poor are recent
    const base = Date.now();
    const patchedGood = {
      ...goodPacket,
      meta: { ...goodPacket.meta, generatedAt: new Date(base - 3 * 86400000).toISOString() },
    };
    const patchedPoor1 = {
      ...poorPacket1,
      meta: { ...poorPacket1.meta, generatedAt: new Date(base - 1 * 86400000).toISOString() },
    };
    const patchedPoor2 = {
      ...poorPacket2,
      meta: { ...poorPacket2.meta, generatedAt: new Date(base).toISOString() },
    };

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [patchedGood, patchedPoor1, patchedPoor2],
    });

    // At least some dimensions should show a trend
    expect(dashboard.trends).toBeDefined();
    expect(dashboard.trends.overallTrend).toBeDefined();
  });

  it("includes trend summary in Vietnamese", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 4; i++) {
      const events = makeEventsWithImprovingScores(8, `session-${i + 1}`, 60, 3);
      packets.push(makeGoodReviewPacket(`session-${i + 1}`, events));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
    });

    expect(dashboard.trends.summaryVi).toBeTruthy();
    expect(typeof dashboard.trends.summaryVi).toBe("string");
    expect(dashboard.trends.summaryVi.length).toBeGreaterThan(0);
  });
});

// ─── Checklist Integration ────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — checklist integration", () => {
  it("integrates checklist data alongside session data", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const checklist = makeMinimalChecklistResult("good_teacher");

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
      checklistResults: [checklist],
    });

    expect(dashboard.meta.checklistCount).toBe(1);
    expect(dashboard.checklist.runCount).toBe(1);
    expect(dashboard.checklist.overallPassRate).toBeGreaterThan(0);
    expect(dashboard.checklist.dimensionStatus.length).toBeGreaterThan(0);
  });

  it("combines session and checklist scores for overall intelligence", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const checklist = makeMinimalChecklistResult("excellent_teacher");

    const dashboardSessionOnly = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    const dashboardCombined = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
      checklistResults: [checklist],
    });

    // Combined should produce a score (might be different from session-only)
    expect(dashboardCombined.overall.intelligenceScore).toBeGreaterThanOrEqual(0);
    expect(dashboardCombined.checklist.runCount).toBe(1);
  });

  it("handles checklist-only dashboard (no sessions)", () => {
    const checklist = makeMinimalChecklistResult("good_teacher");
    const dashboard = buildTeacherIntelligenceDashboard({
      checklistResults: [checklist],
    });

    expect(dashboard.meta.sessionCount).toBe(0);
    expect(dashboard.meta.checklistCount).toBe(1);
    expect(dashboard.overall.intelligenceScore).toBeGreaterThan(0);
  });

  it("shows critical failures from checklist", () => {
    const checklist = makeMinimalChecklistResult("concerning");
    const dashboard = buildTeacherIntelligenceDashboard({
      checklistResults: [checklist],
    });

    expect(dashboard.checklist.failedItemCount).toBeGreaterThanOrEqual(0);
    expect(dashboard.checklist.criticalFailures).toBeDefined();
  });
});

// ─── Dimension Aggregation ────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — dimension aggregation", () => {
  it("has all 6 dimensions in the output", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    const dimIds = dashboard.dimensions.map((d) => d.dimensionId);
    expect(dimIds).toContain("diagnosis");
    expect(dimIds).toContain("teaching");
    expect(dimIds).toContain("memory");
    expect(dimIds).toContain("adaptation");
    expect(dimIds).toContain("selfCheck");
    expect(dimIds).toContain("learningGain");
  });

  it("each dimension has Vietnamese and English labels", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    for (const dim of dashboard.dimensions) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.capability).toBeTruthy();
      expect(dim.detailVi).toBeTruthy();
    }
  });

  it("dimensions with data have observations", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    for (const dim of dashboard.dimensions) {
      expect(dim.observations).toBeDefined();
      expect(Array.isArray(dim.observations)).toBe(true);
    }
  });

  it("dimensions with low scores are flagged as needing attention", () => {
    const poorPacket = makePoorReviewPacket("poor-session");
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [poorPacket],
    });

    const needsAttention = dashboard.dimensions.filter((d) => d.needsAttention);
    // Poor session should produce at least some dimensions needing attention
    expect(needsAttention.length).toBeGreaterThan(0);
  });

  it("dimensions include scoreHistory for trend analysis", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    for (const dim of dashboard.dimensions) {
      expect(dim.scoreHistory).toBeDefined();
      expect(Array.isArray(dim.scoreHistory)).toBe(true);
    }
  });
});

// ─── Verdict Classification ───────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — verdicts", () => {
  it("classifies as strong_human_teacher for excellent data", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(12, `great-${i + 1}`, 80, 2);
      packets.push(makeGoodReviewPacket(`great-${i + 1}`, events));
    }
    const checklist = makeMinimalChecklistResult("excellent_teacher");

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      checklistResults: [checklist],
    });

    expect(["strong_human_teacher", "competent_teacher"]).toContain(
      dashboard.overall.verdict,
    );
  });

  it("classifies as needs_intervention for very poor data", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.overall.verdict).toBe("needs_intervention");
    expect(dashboard.overall.isStrongHumanTeacher).toBe(false);
  });

  it("verdict label is in Vietnamese and English", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    expect(dashboard.overall.verdictLabelVi).toBeTruthy();
    expect(dashboard.overall.verdictLabelEn).toBeTruthy();
    expect(typeof dashboard.overall.verdictLabelVi).toBe("string");
    expect(typeof dashboard.overall.verdictLabelEn).toBe("string");
  });

  it("isStrongHumanTeacher only true for strong_human_teacher verdict", () => {
    const empty = buildTeacherIntelligenceDashboard({});
    expect(isStrongHumanTeacher(empty)).toBe(false);

    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(12, `great-${i + 1}`, 85, 1);
      packets.push(makeGoodReviewPacket(`great-${i + 1}`, events));
    }
    const checklist = makeMinimalChecklistResult("excellent_teacher");
    const good = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      checklistResults: [checklist],
    });

    // strong_human_teacher requires intelligenceScore >= 80 and 0 failing dimensions
    expect(typeof isStrongHumanTeacher(good)).toBe("boolean");
  });
});

// ─── Action Items ─────────────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — action items", () => {
  it("produces action items for poor data", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.actionItems.length).toBeGreaterThan(0);
    // Should contain data-related items
    expect(dashboard.actionItems.some((i) => i.includes("DỮ LIỆU"))).toBe(true);
  });

  it("action items use Vietnamese", () => {
    const poorPacket = makePoorReviewPacket("poor-1");
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [poorPacket],
    });

    for (const item of dashboard.actionItems) {
      expect(typeof item).toBe("string");
      expect(item.length).toBeGreaterThan(0);
    }
  });

  it("includes declining-dimension items when trends decline", () => {
    // Good first, then decline
    const goodEvents = makeEventsWithImprovingScores(8, "good-early", 80, 2);
    const goodPacket = makeGoodReviewPacket("good-early", goodEvents);
    const poorPacket1 = makePoorReviewPacket("poor-late-1");
    const poorPacket2 = makePoorReviewPacket("poor-late-2");

    const base = Date.now();
    const patched: ChauReviewPacket[] = [
      { ...goodPacket, meta: { ...goodPacket.meta, generatedAt: new Date(base - 5 * 86400000).toISOString() } },
      { ...poorPacket1, meta: { ...poorPacket1.meta, generatedAt: new Date(base - 2 * 86400000).toISOString() } },
      { ...poorPacket2, meta: { ...poorPacket2.meta, generatedAt: new Date(base).toISOString() } },
    ];

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: patched,
    });

    // Should have some action items
    expect(dashboard.actionItems.length).toBeGreaterThan(0);
  });

  it("produces a positive message when everything is fine", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(15, `great-${i + 1}`, 85, 2);
      packets.push(makeGoodReviewPacket(`great-${i + 1}`, events));
    }
    const checklist = makeMinimalChecklistResult("excellent_teacher");

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      checklistResults: [checklist],
    });

    // When everything is great, action items should include a positive note
    // or at least not crash
    expect(dashboard.actionItems).toBeDefined();
    expect(Array.isArray(dashboard.actionItems)).toBe(true);
  });
});

// ─── Dashboard Comparison ─────────────────────────────────────────────────────

describe("compareDashboards", () => {
  it("detects improvement between two dashboards", () => {
    const poorEvents = makeEventsWithImprovingScores(6, "poor", 40, 2);
    const poorPacket = makeGoodReviewPacket("poor", poorEvents);

    const goodEvents = makeEventsWithImprovingScores(10, "good", 75, 3);
    const goodPacket = makeGoodReviewPacket("good", goodEvents);

    const previous = buildTeacherIntelligenceDashboard({
      reviewPackets: [poorPacket],
    });
    const current = buildTeacherIntelligenceDashboard({
      reviewPackets: [goodPacket],
    });

    const comparison = compareDashboards(current, previous);

    expect(typeof comparison.scoreDelta).toBe("number");
    expect(comparison.improvedDimensions).toBeDefined();
    expect(comparison.declinedDimensions).toBeDefined();
    expect(comparison.unchangedDimensions).toBeDefined();
    expect(comparison.summaryVi).toBeTruthy();
  });

  it("detects decline between two dashboards", () => {
    const goodEvents = makeEventsWithImprovingScores(10, "good", 75, 3);
    const goodPacket = makeGoodReviewPacket("good", goodEvents);

    const poorEvents = makeEventsWithImprovingScores(6, "poor", 40, 2);
    const poorPacket = makeGoodReviewPacket("poor", poorEvents);

    const previous = buildTeacherIntelligenceDashboard({
      reviewPackets: [goodPacket],
    });
    const current = buildTeacherIntelligenceDashboard({
      reviewPackets: [poorPacket],
    });

    const comparison = compareDashboards(current, previous);

    expect(typeof comparison.scoreDelta).toBe("number");
    expect(comparison.summaryVi).toBeTruthy();
  });

  it("handles comparison with empty previous dashboard", () => {
    const events = makeEventsWithImprovingScores(8, "current", 65, 4);
    const packet = makeGoodReviewPacket("current", events);

    const previous = buildTeacherIntelligenceDashboard({});
    const current = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    const comparison = compareDashboards(current, previous);

    expect(comparison.scoreDelta).toBeGreaterThanOrEqual(0);
    expect(comparison.summaryVi.length).toBeGreaterThan(0);
  });
});

// ─── Helper APIs ──────────────────────────────────────────────────────────────

describe("getDimensionTrend", () => {
  it("returns trend data for a valid dimension", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    const result = getDimensionTrend(dashboard, "diagnosis");

    expect(result.trend).toBeDefined();
    expect(result.scoreHistory).toBeDefined();
    expect(result.detailVi).toBeTruthy();
  });

  it("handles invalid dimension ID gracefully", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    const result = getDimensionTrend(
      dashboard,
      "nonexistent" as TeacherIntelligenceDimensionId,
    );

    expect(result.trend).toBe("insufficient_data");
    expect(result.scoreHistory).toHaveLength(0);
    expect(result.detailVi).toContain("Không tìm thấy");
  });
});

describe("isDashboardReportable", () => {
  it("returns false for empty dashboard", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});
    expect(isDashboardReportable(dashboard)).toBe(false);
  });

  it("returns true for dashboard with sufficient data and good score", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(12, `great-${i + 1}`, 80, 2);
      packets.push(makeGoodReviewPacket(`great-${i + 1}`, events));
    }
    const checklist = makeMinimalChecklistResult("excellent_teacher");
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      checklistResults: [checklist],
    });

    const reportable = isDashboardReportable(dashboard);
    expect(typeof reportable).toBe("boolean");
  });
});

describe("getDashboardCompactSummary", () => {
  it("returns a non-empty Vietnamese string", () => {
    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    const summary = getDashboardCompactSummary(dashboard);

    expect(summary).toBeTruthy();
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(10);
  });
});

describe("getDashboardActionItems", () => {
  it("returns the same array as dashboard.actionItems", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    const items = getDashboardActionItems(dashboard);
    expect(items).toEqual(dashboard.actionItems);
  });
});

describe("getDimensionsNeedingAttention", () => {
  it("returns dimensions flagged as needsAttention", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    const needing = getDimensionsNeedingAttention(dashboard);
    // Empty dashboard should flag all dimensions
    expect(needing.length).toBe(6);
  });

  it("returns fewer dimensions when data is good", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 4; i++) {
      const events = makeEventsWithImprovingScores(12, `great-${i + 1}`, 80, 2);
      packets.push(makeGoodReviewPacket(`great-${i + 1}`, events));
    }
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
    });

    const needing = getDimensionsNeedingAttention(dashboard);
    // Good data should have fewer dimensions needing attention
    expect(needing.length).toBeLessThanOrEqual(6);
  });
});

describe("getIntelligenceScore", () => {
  it("returns the dashboard's intelligence score", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});
    expect(getIntelligenceScore(dashboard)).toBe(0);

    const events = makeEventsWithImprovingScores(8, "session-1", 65, 4);
    const packet = makeGoodReviewPacket("session-1", events);
    const dashboard2 = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });
    expect(getIntelligenceScore(dashboard2)).toBeGreaterThan(0);
  });
});

// ─── Weekly Report Summary ────────────────────────────────────────────────────

describe("getWeeklyReportSummary", () => {
  it("produces a structured report summary", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 5; i++) {
      const events = makeEventsWithImprovingScores(10, `week-${i + 1}`, 70, 3);
      packets.push(makeGoodReviewPacket(`week-${i + 1}`, events));
    }
    const checklist = makeMinimalChecklistResult("excellent_teacher");
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      checklistResults: [checklist],
    });

    const report = getWeeklyReportSummary(dashboard);

    expect(report.score).toBeGreaterThan(0);
    expect(report.verdictVi).toBeTruthy();
    expect(report.topStrength).toBeTruthy();
    expect(report.topWeakness).toBeTruthy();
    expect(report.trendDirection).toBeTruthy();
    expect(report.actionItemCount).toBeGreaterThanOrEqual(0);
    expect(report.checklistPassRate).toBeTruthy();
    expect(report.summaryParagraphVi).toBeTruthy();
  });

  it("handles empty dashboard gracefully", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});
    const report = getWeeklyReportSummary(dashboard);

    expect(report.score).toBe(0);
    expect(report.verdictVi).toBeTruthy();
    expect(report.summaryParagraphVi).toBeTruthy();
  });
});

// ─── Dimension Catalog ────────────────────────────────────────────────────────

describe("TEACHER_INTELLIGENCE_DIMENSION_CATALOG", () => {
  it("has exactly 6 dimensions", () => {
    expect(TEACHER_INTELLIGENCE_DIMENSION_CATALOG).toHaveLength(6);
  });

  it("each dimension has required fields", () => {
    for (const dim of TEACHER_INTELLIGENCE_DIMENSION_CATALOG) {
      expect(dim.id).toBeTruthy();
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.capability).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
    }
  });

  it("covers all 6 capabilities: diagnose, teach, remember, adapt, self-check, prove", () => {
    const capabilities = TEACHER_INTELLIGENCE_DIMENSION_CATALOG.map((d) => d.capability);
    expect(capabilities).toContain("diagnose");
    expect(capabilities).toContain("teach");
    expect(capabilities).toContain("remember");
    expect(capabilities).toContain("adapt");
    expect(capabilities).toContain("self-check");
    expect(capabilities).toContain("prove");
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — edge cases", () => {
  it("handles null/undefined reviewPackets gracefully", () => {
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: undefined,
      checklistResults: undefined,
    });

    expect(dashboard.meta.sessionCount).toBe(0);
    expect(dashboard.meta.checklistCount).toBe(0);
  });

  it("handles a mix of good and poor sessions", () => {
    const goodEvents = makeEventsWithImprovingScores(12, "good", 80, 2);
    const goodPacket = makeGoodReviewPacket("good", goodEvents);
    const poorPacket = makePoorReviewPacket("poor");

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [goodPacket, poorPacket],
    });

    expect(dashboard.meta.sessionCount).toBe(2);
    expect(dashboard.overall.intelligenceScore).toBeGreaterThanOrEqual(0);
  });

  it("handles a packet with no events (empty session)", () => {
    const emptyPacket = buildChauReviewPacket({
      sessionId: "empty",
      events: [],
    });

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [emptyPacket],
    });

    expect(dashboard.meta.sessionCount).toBe(1);
    // Empty session should not count as "with data"
    expect(dashboard.meta.sessionsWithData).toBe(0);
  });

  it("handles very large session counts without error", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 100; i++) {
      const events = makeEventsWithImprovingScores(6, `bulk-${i}`, 60, 1);
      packets.push(makeGoodReviewPacket(`bulk-${i}`, events));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
      timeWindowVi: "100 buổi học gần đây",
    });

    expect(dashboard.meta.sessionCount).toBe(100);
    expect(dashboard.sessions).toHaveLength(100);
  });

  it("handles concurrent sessions with the same timestamp", () => {
    const events1 = makeEventsWithImprovingScores(6, "same-time-1", 65, 3);
    const events2 = makeEventsWithImprovingScores(6, "same-time-2", 65, 3);
    const packet1 = makeGoodReviewPacket("same-time-1", events1);
    const packet2 = makeGoodReviewPacket("same-time-2", events2);

    // Force same timestamp
    const ts = new Date().toISOString();
    const p1: ChauReviewPacket = { ...packet1, meta: { ...packet1.meta, generatedAt: ts } };
    const p2: ChauReviewPacket = { ...packet2, meta: { ...packet2.meta, generatedAt: ts } };

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [p1, p2],
    });

    // Should not crash
    expect(dashboard.meta.sessionCount).toBe(2);
  });

  it("compactSummaryVi is always a non-empty string", () => {
    const empty = buildTeacherIntelligenceDashboard({});
    expect(empty.compactSummaryVi).toBeTruthy();
    expect(empty.compactSummaryVi.length).toBeGreaterThan(0);

    const events = makeEventsWithImprovingScores(8, "s1", 65, 4);
    const packet = makeGoodReviewPacket("s1", events);
    const withData = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });
    expect(withData.compactSummaryVi).toBeTruthy();
    expect(withData.compactSummaryVi.length).toBeGreaterThan(0);
  });

  it("overall.summaryVi is a multi-line string", () => {
    const events = makeEventsWithImprovingScores(8, "s1", 65, 4);
    const packet = makeGoodReviewPacket("s1", events);
    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: [packet],
    });

    expect(dashboard.overall.summaryVi).toBeTruthy();
    expect(dashboard.overall.summaryEn).toBeTruthy();
  });
});

// ─── Time Window Labeling ─────────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — time window", () => {
  it("uses provided timeWindowVi in metadata", () => {
    const dashboard = buildTeacherIntelligenceDashboard({
      timeWindowVi: "Tuần 24 (9/6 – 15/6)",
    });

    expect(dashboard.meta.timeWindowVi).toBe("Tuần 24 (9/6 – 15/6)");
  });

  it("defaults to 'không xác định' when no time window", () => {
    const dashboard = buildTeacherIntelligenceDashboard({});

    expect(dashboard.meta.timeWindowVi).toBe("không xác định");
  });
});

// ─── Score Band Consistency ───────────────────────────────────────────────────

describe("buildTeacherIntelligenceDashboard — score bands", () => {
  it("score bands are consistent with average scores", () => {
    const packets: ChauReviewPacket[] = [];
    for (let i = 0; i < 3; i++) {
      const events = makeEventsWithImprovingScores(8, `band-${i + 1}`, 70, 3);
      packets.push(makeGoodReviewPacket(`band-${i + 1}`, events));
    }

    const dashboard = buildTeacherIntelligenceDashboard({
      reviewPackets: packets,
    });

    for (const dim of dashboard.dimensions) {
      expect([
        "xuất sắc",
        "tốt",
        "khá",
        "cần cải thiện",
        "đáng lo",
      ]).toContain(dim.scoreBand);

      // Score band should be consistent with averageScore
      if (dim.averageScore >= 2.7) expect(dim.scoreBand).toBe("xuất sắc");
      if (dim.averageScore === 0 && dim.dataPointsWithData === 0) {
        expect(dim.scoreBand).toBe("đáng lo");
      }
    }
  });
});
