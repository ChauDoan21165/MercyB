import { describe, expect, it } from "vitest";
import {
  auditResponse,
  auditResponseSafety,
  auditCorrectionQuick,
  auditConversationQuick,
  buildContractLearnerInput,
  buildContractTutorResponse,
  formatAuditSummary,
  formatAuditTelemetry,
  type AuditResult,
  type AuditMode,
} from "../teacherMercyAuditGate";
import type { ContractLearnerInput, ContractTutorResponse } from "../teacherMercyContract";

// ─── Shared Fixtures ──────────────────────────────────────────────────────

/** A learner input that should pass all rules with a good response. */
function a2LearnerInput(overrides: Partial<ContractLearnerInput> = {}): ContractLearnerInput {
  return {
    text: "I go to market yesterday.",
    cefrLevel: "A2",
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
    ...overrides,
  };
}

/**
 * A good correction response — acknowledges meaning before correction,
 * one correction block, no fake praise, Vietnamese interference note,
 * face-saving language. Designed to pass all rules.
 */
function goodCorrectionResponse(overrides: Partial<ContractTutorResponse> = {}): ContractTutorResponse {
  return {
    vi: "Mình hiểu ý bạn — bạn muốn nói là hôm qua bạn đã đi chợ. 🔍 Bạn viết: \"I go to market yesterday.\" 💡 Gợi ý: \"I went to the market yesterday.\" 📝 Giải thích: Khi có 'yesterday', động từ cần ở quá khứ 'went'. Bạn thử đặt một câu khác với 'yesterday' nhé?",
    correctedSentence: "I went to the market yesterday.",
    grammarPoints: ["past tense"],
    transferErrorNote: "Trong tiếng Việt, bạn nói 'Tôi đi chợ hôm qua' không cần đổi động từ, nhưng tiếng Anh cần chia thì quá khứ.",
    nextSteps: [{ labelVi: "Thử câu khác" }],
    correctionCount: 1,
    followUpQuestionCount: 1,
    ...overrides,
  };
}

/** A response that fails hard-safety rules: contains forbidden fake praise + no meaning acknowledgment. */
function fakePraiseCorrectionResponse(): ContractTutorResponse {
  return {
    vi: "Hoàn hảo! Bạn viết: \"I go to market yesterday.\" 🔍 Xuất sắc! Nhưng cần sửa: \"I went to the market yesterday.\"",
    correctedSentence: "I went to the market yesterday.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
  };
}

/** A response that fails R1 (no meaning acknowledgment before correction). */
function correctionWithoutAckResponse(): ContractTutorResponse {
  return {
    vi: "🔍 Bạn viết: \"I go to market yesterday.\" 💡 Gợi ý: \"I went to the market yesterday.\" Khi có 'yesterday', dùng quá khứ 'went'.",
    correctedSentence: "I went to the market yesterday.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
  };
}

/**
 * A good conversation response — warm acknowledgment, one follow-up question,
 * no fake praise, face-saving language.
 */
function goodConversationResponse(): ContractTutorResponse {
  return {
    vi: "Nghe thú vị quá! Bạn đã đi chợ hôm qua và mua rau à? Vậy bạn thường đi chợ vào ngày nào trong tuần?",
    followUpQuestionCount: 1,
    nextSteps: [],
  };
}

// ─── buildContractLearnerInput ────────────────────────────────────────────

describe("buildContractLearnerInput", () => {
  it("builds input with all fields provided", () => {
    const input = buildContractLearnerInput({
      text: "I go to market",
      cefrLevel: "B1",
      trackedWeakness: "past-tense",
      didSelfCorrect: true,
      l1: "vi",
    });
    expect(input.text).toBe("I go to market");
    expect(input.cefrLevel).toBe("B1");
    expect(input.trackedWeakness).toBe("past-tense");
    expect(input.didSelfCorrect).toBe(true);
    expect(input.l1).toBe("vi");
  });

  it("fills defaults when optional fields are omitted", () => {
    const input = buildContractLearnerInput({ text: "hello" });
    expect(input.cefrLevel).toBeNull();
    expect(input.trackedWeakness).toBeNull();
    expect(input.didSelfCorrect).toBe(false);
    expect(input.l1).toBe("vi");
  });
});

// ─── buildContractTutorResponse ───────────────────────────────────────────

describe("buildContractTutorResponse", () => {
  it("builds response with all fields provided", () => {
    const resp = buildContractTutorResponse({
      vi: "Xin chào",
      en: "Hello",
      correctedSentence: "Hello",
      grammarPoints: ["tense"],
      transferErrorNote: "VNote",
      nextSteps: [{ labelVi: "Tiếp" }],
      correctionCount: 1,
      followUpQuestionCount: 1,
    });
    expect(resp.vi).toBe("Xin chào");
    expect(resp.en).toBe("Hello");
    expect(resp.correctedSentence).toBe("Hello");
    expect(resp.grammarPoints).toEqual(["tense"]);
    expect(resp.transferErrorNote).toBe("VNote");
    expect(resp.nextSteps).toEqual([{ labelVi: "Tiếp" }]);
    expect(resp.correctionCount).toBe(1);
    expect(resp.followUpQuestionCount).toBe(1);
  });

  it("leaves optional fields undefined when omitted", () => {
    const resp = buildContractTutorResponse({ vi: "Hi" });
    expect(resp.vi).toBe("Hi");
    expect(resp.en).toBeUndefined();
    expect(resp.correctedSentence).toBeUndefined();
  });
});

// ─── auditResponse — correction mode (audit level) ────────────────────────

describe("auditResponse — correction mode (non-blocking audit)", () => {
  it("passes a good correction response", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    expect(result.passed).toBe(true);
    expect(result.safe).toBe(true);
    expect(result.mode).toBe("correction");
    expect(result.gateLevel).toBe("audit");
    expect(result.blockReasonVi).toBeNull();
    expect(result.contractResult.failedCount).toBe(0);
  });

  it("fails on fake praise (R3 violation)", () => {
    const result = auditResponse(
      a2LearnerInput(),
      fakePraiseCorrectionResponse(),
      "correction",
      "audit",
    );
    expect(result.passed).toBe(false);
    expect(result.safe).toBe(false); // R3 is a hard-safety rule
    expect(result.contractResult.rules.find((r) => r.ruleId === "R3_NO_FAKE_PRAISE")?.passed).toBe(false);
    // audit mode: never blocks
    expect(result.blockReasonVi).toBeNull();
  });

  it("fails on correction without meaning acknowledgment (R1 violation)", () => {
    const result = auditResponse(
      a2LearnerInput(),
      correctionWithoutAckResponse(),
      "correction",
      "audit",
    );
    expect(result.passed).toBe(false);
    expect(result.contractResult.rules.find((r) => r.ruleId === "R1_MEANING_FIRST")?.passed).toBe(false);
    // R1 is not a hard-safety rule, so safe can still be true
    // Note: R3 check depends on whether fake praise words appear
  });

  it("returns rubric dimensions for correction mode", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    // Correction mode focuses on accuracy, correction_timing, specificity, safety, warmth
    const dimIds = result.rubricResult.dimensions.map((d) => d.dimensionId);
    expect(dimIds).toContain("accuracy");
    expect(dimIds).toContain("correction_timing");
    expect(dimIds).toContain("specificity");
    expect(dimIds).toContain("safety");
  });

  it("classifies a good response as exemplary or acceptable", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    expect(["exemplary", "acceptable"]).toContain(result.rubricResult.classification);
  });
});

// ─── auditResponse — conversation mode ────────────────────────────────────

describe("auditResponse — conversation mode", () => {
  it("passes a good conversation response", () => {
    const result = auditResponse(
      a2LearnerInput({ text: "I went to the market yesterday and bought vegetables." }),
      goodConversationResponse(),
      "conversation",
      "audit",
    );
    expect(result.passed).toBe(true);
    expect(result.safe).toBe(true);
    expect(result.mode).toBe("conversation");
  });

  it("returns conversation-focused rubric dimensions", () => {
    const result = auditResponse(
      a2LearnerInput({ text: "I like reading books." }),
      goodConversationResponse(),
      "conversation",
      "audit",
    );
    const dimIds = result.rubricResult.dimensions.map((d) => d.dimensionId);
    // Conversation mode focuses on warmth, follow_up_quality, learner_memory_use, safety, specificity
    expect(dimIds).toContain("warmth");
    expect(dimIds).toContain("follow_up_quality");
  });
});

// ─── auditResponse — block_unsafe gate level ──────────────────────────────

describe("auditResponse — block_unsafe gate level", () => {
  it("does not block a safe response", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "block_unsafe",
    );
    expect(result.gateLevel).toBe("block_unsafe");
    expect(result.blockReasonVi).toBeNull();
  });

  it("blocks a response that fails hard-safety rules", () => {
    const result = auditResponse(
      a2LearnerInput(),
      fakePraiseCorrectionResponse(),
      "correction",
      "block_unsafe",
    );
    expect(result.safe).toBe(false);
    expect(result.blockReasonVi).not.toBeNull();
    expect(result.blockReasonVi).toContain("quy tắc an toàn");
  });

  it("includes blocking reason in Vietnamese", () => {
    const result = auditResponse(
      a2LearnerInput(),
      fakePraiseCorrectionResponse(),
      "correction",
      "block_unsafe",
    );
    expect(result.blockReasonVi).toBeTruthy();
    expect(result.blockReasonVi).toContain("Không khen giả"); // R3 title
  });
});

// ─── auditResponseSafety (quick safety gate) ──────────────────────────────

describe("auditResponseSafety", () => {
  it("returns safe:true for a good response", () => {
    const result = auditResponseSafety(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
    );
    expect(result.safe).toBe(true);
    expect(result.failedRules).toHaveLength(0);
    expect(result.reasonVi).toBeNull();
  });

  it("returns safe:false for a response with fake praise (R3)", () => {
    const result = auditResponseSafety(
      a2LearnerInput(),
      fakePraiseCorrectionResponse(),
      "correction",
    );
    expect(result.safe).toBe(false);
    expect(result.failedRules.length).toBeGreaterThan(0);
    expect(result.failedRules.some((r) => r.ruleId === "R3_NO_FAKE_PRAISE")).toBe(true);
    expect(result.reasonVi).toContain("Phản hồi bị chặn");
  });

  it("returns safe:false for a response with face-threatening language", () => {
    const response = buildContractTutorResponse({
      vi: "Bạn sai rồi. Câu này sai hoàn toàn. 🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\"",
      correctedSentence: "I went.",
      correctionCount: 1,
    });
    const result = auditResponseSafety(a2LearnerInput(), response, "correction");
    // "sai" appearing in a shaming pattern should trigger R8
    expect(result.failedRules.some((r) => r.ruleId === "R8_FACE_SAVING")).toBe(true);
  });
});

// ─── auditCorrectionQuick (convenience) ────────────────────────────────────

describe("auditCorrectionQuick", () => {
  it("passes a good quick correction", () => {
    const result = auditCorrectionQuick(
      "I go to market yesterday",
      "Mình hiểu ý bạn — bạn muốn nói là hôm qua bạn đã đi chợ. 🔍 Bạn viết: \"I go to market yesterday.\" 💡 Gợi ý: \"I went to the market yesterday.\"",
      "I went to the market yesterday.",
      "A2",
    );
    expect(result.passed).toBe(true);
    expect(result.mode).toBe("correction");
  });

  it("detects fake praise in quick correction", () => {
    const result = auditCorrectionQuick(
      "hello",
      "Hoàn hảo! Xuất sắc!",
      "hello",
      "A1",
    );
    expect(result.passed).toBe(false);
    expect(result.safe).toBe(false);
  });

  it("accepts null cefrLevel", () => {
    const result = auditCorrectionQuick(
      "I go to market yesterday",
      "Mình hiểu ý bạn — bạn muốn nói là hôm qua bạn đã đi chợ. 🔍 Bạn viết: \"I go to market yesterday.\" 💡 Gợi ý: \"I went to the market yesterday.\"",
      "I went to the market yesterday.",
    );
    expect(result.passed).toBe(true);
  });
});

// ─── auditConversationQuick (convenience) ──────────────────────────────────

describe("auditConversationQuick", () => {
  it("passes a good quick conversation response", () => {
    const result = auditConversationQuick(
      "I went to the market yesterday and bought vegetables",
      "Nghe thú vị quá! Bạn đã mua rau gì ở chợ vậy?",
      1,
      "A2",
    );
    expect(result.passed).toBe(true);
    expect(result.mode).toBe("conversation");
  });
});

// ─── formatAuditSummary ────────────────────────────────────────────────────

describe("formatAuditSummary", () => {
  it("includes classification and dimension scores", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    const summary = formatAuditSummary(result);
    expect(summary).toContain("[");
    expect(summary).toContain("]");
    // Should include dimension names with scores
    expect(summary).toMatch(/Ấm áp: \d\/3/);
  });
});

// ─── formatAuditTelemetry ─────────────────────────────────────────────────

describe("formatAuditTelemetry", () => {
  it("returns a structured record with no learner PII", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    const telemetry = formatAuditTelemetry(result);
    expect(telemetry.classification).toBeTruthy();
    expect(telemetry.passed).toBe(true);
    expect(telemetry.safe).toBe(true);
    expect(telemetry.mode).toBe("correction");
    expect(telemetry.gateLevel).toBe("audit");
    expect(telemetry.failedRuleIds).toEqual([]);
    expect(telemetry.failedCount).toBe(0);
    expect(telemetry.dimensionScores).toBeDefined();
    // Must NOT contain learner text
    const str = JSON.stringify(telemetry);
    expect(str).not.toContain("I go to market");
    expect(str).not.toContain("yesterday");
  });

  it("includes failed rule IDs when response fails", () => {
    const result = auditResponse(
      a2LearnerInput(),
      fakePraiseCorrectionResponse(),
      "correction",
      "audit",
    );
    const telemetry = formatAuditTelemetry(result);
    expect(telemetry.passed).toBe(false);
    expect((telemetry.failedRuleIds as string[]).length).toBeGreaterThan(0);
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────

describe("auditResponse — edge cases", () => {
  it("handles empty learner text gracefully", () => {
    const result = auditResponse(
      a2LearnerInput({ text: "" }),
      goodCorrectionResponse(),
      "correction",
      "audit",
    );
    // Should not throw
    expect(result.contractResult).toBeDefined();
    expect(result.rubricResult).toBeDefined();
  });

  it("handles empty response vi text gracefully", () => {
    const result = auditResponse(
      a2LearnerInput({ text: "hello" }),
      buildContractTutorResponse({ vi: "" }),
      "correction",
      "audit",
    );
    // Should not throw
    expect(result.contractResult).toBeDefined();
  });

  it("full mode runs all 10 rules", () => {
    const result = auditResponse(
      a2LearnerInput(),
      goodCorrectionResponse(),
      "full",
      "audit",
    );
    expect(result.contractResult.rules.length).toBe(10);
    expect(result.mode).toBe("full");
  });
});
