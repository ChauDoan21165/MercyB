import { describe, expect, it } from "vitest";

import {
  buildTeacherMercyLiveIntelligenceBridgePacket,
  serializeTeacherMercyLiveBridgePacket,
  summarizeTeacherMercyLiveBridgePacket,
  type TeacherMercyLiveBridgeInput,
} from "../teacherMercyLiveIntelligenceBridge";
import type { TeacherDecision } from "../../tutor/teacherDecisionEngine";
import type { TeacherIntelligenceDashboard } from "../../tutor/teacherIntelligenceDashboard";

function decision(overrides: Partial<TeacherDecision> = {}): TeacherDecision {
  return {
    action: "CORRECT_NOW",
    correction: {
      correctedText: "She is happy today.",
      appliedRuleIds: ["en-vn-copula-be-adjective"],
      severity: "lesson_target",
    },
    timingMode: "IMMEDIATE",
    rationaleVi: "Câu này cần động từ to be trước tính từ.",
    rationaleEn: "Copula is required before the adjective.",
    reasonCode: "lesson_target_immediate",
    allCandidates: [
      {
        correctedText: "She is happy today.",
        appliedRuleIds: ["en-vn-copula-be-adjective"],
        severity: "lesson_target",
      },
    ],
    enrichment: {
      weaknessInput: {
        errorCategory: "copula-omission",
        grammarPoint: "be-verb",
        l1: "vi",
        exemplarPattern: "She happy -> She is happy",
      },
      interferenceCategory: "missing_word",
      matchedRuleId: "en-vn-copula-be-adjective",
      isL1TransferError: true,
      weaknessLabelVi: "Thiếu động từ to be",
      weaknessLabelEn: "Missing be verb",
    },
    suppressionDecision: null,
    hintLadder: null,
    readiness: {
      decision: "READY_NOW",
      reason: "Ready",
      reasonCode: "readiness_ready_now",
    },
    ...overrides,
  };
}

function dashboard(overrides: Partial<TeacherIntelligenceDashboard["overall"]> = {}): TeacherIntelligenceDashboard {
  return {
    meta: {
      generatedAt: "2026-07-13T00:00:00.000Z",
      sessionCount: 2,
      checklistCount: 1,
      sessionsWithData: 2,
      timeWindowVi: "2 buổi gần nhất",
      hasEnoughData: true,
      dataWarnings: [],
    },
    overall: {
      intelligenceScore: 82,
      verdict: "competent_teacher",
      verdictLabelVi: "Giáo viên vững",
      verdictLabelEn: "Competent teacher",
      summaryVi: "Mercy đang dạy ổn định.",
      summaryEn: "Mercy is teaching consistently.",
      isStrongHumanTeacher: false,
      isReportable: true,
      hasEnoughData: true,
      ...overrides,
    } as TeacherIntelligenceDashboard["overall"],
    dimensions: [
      {
        dimensionId: "diagnosis",
        titleVi: "Chẩn đoán",
        titleEn: "Diagnosis",
        capability: "diagnose",
        averageScore: 2.7,
        dataPointCount: 2,
        dataPointsWithData: 2,
        sessionAverage: 2.7,
        checklistAverage: null,
        trend: "stable",
        scoreHistory: [],
        scoreBand: "tốt",
        observations: [],
        needsAttention: false,
        attentionReasonVi: null,
        detailVi: "Ổn định",
      },
      {
        dimensionId: "memory",
        titleVi: "Ghi nhớ",
        titleEn: "Memory",
        capability: "remember",
        averageScore: 1.5,
        dataPointCount: 2,
        dataPointsWithData: 2,
        sessionAverage: 1.5,
        checklistAverage: null,
        trend: "declining",
        scoreHistory: [],
        scoreBand: "cần cải thiện",
        observations: [],
        needsAttention: true,
        attentionReasonVi: "Bộ nhớ yếu.",
        detailVi: "Cần xem lại.",
      },
    ],
    trends: {
      improving: [],
      stable: ["diagnosis"],
      declining: ["memory"],
      insufficientData: [],
      overallTrend: "stable",
      summaryVi: "Ổn định.",
    },
    sessions: [],
    checklist: {
      runCount: 1,
      overallPassRate: 0.8,
      dimensionStatus: [],
      failedItemCount: 0,
      criticalFailures: [],
    },
    actionItems: [],
    compactSummaryVi: "Mercy ổn định.",
  };
}

function input(overrides: Partial<TeacherMercyLiveBridgeInput> = {}): TeacherMercyLiveBridgeInput {
  return {
    turn: {
      turnId: "turn-1",
      sessionId: "session-1",
      learnerText: "  She   happy today. ",
      targetLanguage: "en",
      topicTag: "daily-life",
    },
    decision: decision(),
    dashboard: dashboard(),
    memory: {
      lastLearnerText: "I go yesterday.",
      lastTopicTag: "past-tense",
      lastWeaknessTags: ["past-tense"],
      lastUpdatedTurnIndex: 3,
      currentTurnIndex: 4,
    },
    provider: { provider: "openai", retryCount: 0 },
    nowIso: "2026-07-13T12:00:00.000Z",
    ...overrides,
  };
}

describe("teacherMercyLiveIntelligenceBridge", () => {
  it("builds an immediate correction packet with feedback eligibility and preserved evidence", () => {
    const packet = buildTeacherMercyLiveIntelligenceBridgePacket(input());

    expect(packet.turn.normalizedText).toBe("She happy today.");
    expect(packet.turn.language).toBe("en");
    expect(packet.turn.carriedTopicTag).toBe("daily-life");
    expect(packet.teaching.nextStep).toBe("show_correction");
    expect(packet.teaching.correctionVisible).toBe(true);
    expect(packet.teaching.feedbackEligible).toBe(true);
    expect(packet.evidence.ruleIds).toEqual(["en-vn-copula-be-adjective"]);
    expect(packet.evidence.weaknessTags).toEqual(["copula-omission", "en-vn-copula-be-adjective", "past-tense"]);
    expect(packet.evidence.dimensionsNeedingAttention).toEqual(["memory"]);
    expect(packet.evidence.confidenceLabel).toBe("evidence_backed");
    expect(packet.audit.noPlaceholderOutput).toBe(true);
  });

  it("handles empty repeated stale input as a recovery path without fake correction UI", () => {
    const packet = buildTeacherMercyLiveIntelligenceBridgePacket(input({
      turn: {
        turnId: "turn-2",
        sessionId: "session-1",
        learnerText: "   ",
        targetLanguage: "en",
      },
      decision: decision({
        action: "SUPPRESS",
        correction: null,
        allCandidates: [],
        reasonCode: "empty_text",
        timingMode: "SUPPRESS",
      }),
      memory: {
        lastLearnerText: "",
        lastUpdatedTurnIndex: 1,
        currentTurnIndex: 8,
      },
    }));

    expect(packet.turn.isEmpty).toBe(true);
    expect(packet.teaching.nextStep).toBe("recover_gently");
    expect(packet.teaching.correctionVisible).toBe(false);
    expect(packet.teaching.feedbackEligible).toBe(false);
    expect(packet.evidence.risks).toEqual(expect.arrayContaining(["empty_input", "stale_memory"]));
    expect(packet.evidence.confidenceLabel).toBe("blocked");
  });

  it("flags mixed-language fallback turns without breaking serialization", () => {
    const packet = buildTeacherMercyLiveIntelligenceBridgePacket(input({
      turn: {
        turnId: "turn-3",
        sessionId: "session-1",
        learnerText: "Tôi happy today",
        targetLanguage: "en",
      },
      provider: {
        provider: "deepseek",
        usedFallback: true,
        retryCount: 1,
        failureReason: "openai_429",
      },
    }));

    expect(packet.turn.language).toBe("mixed");
    expect(packet.evidence.provider).toBe("deepseek");
    expect(packet.evidence.usedProviderFallback).toBe(true);
    expect(packet.evidence.retryCount).toBe(1);
    expect(packet.evidence.risks).toEqual(expect.arrayContaining(["mixed_language", "provider_fallback"]));
    expect(JSON.parse(serializeTeacherMercyLiveBridgePacket(packet))).toMatchObject({
      packetVersion: "teacher-mercy-live-bridge.v1",
    });
  });

  it("blocks fake confidence when dashboard evidence is weak but the decision wants immediate correction", () => {
    const packet = buildTeacherMercyLiveIntelligenceBridgePacket(input({
      dashboard: dashboard({ intelligenceScore: 45 }),
    }));

    expect(packet.evidence.risks).toContain("fake_confidence");
    expect(packet.evidence.confidenceLabel).toBe("blocked");
    expect(packet.audit.noFakeConfidence).toBe(false);
  });

  it("is deterministic for the same evidence packet", () => {
    const first = buildTeacherMercyLiveIntelligenceBridgePacket(input());
    const second = buildTeacherMercyLiveIntelligenceBridgePacket(input());

    expect(second).toEqual(first);
    expect(summarizeTeacherMercyLiveBridgePacket(first)).toBe(
      "session-1 · turn-1 · show_correction · lesson_target_immediate · evidence_backed",
    );
  });
});
