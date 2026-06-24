/**
 * Golden Tests — Fake-Certainty and Overclaim Guard (O1-O8)
 *
 * These are REGRESSION TESTS that verify the overclaim guard produces
 * EXACT, known-good decisions for representative inputs.
 *
 * If any of these tests break, it means the overclaim detection behavior has
 * changed — intentionally or not. Golden test failures require a
 * CONSCIOUS review.
 *
 * What makes these "golden":
 *   1. Exact output assertions — decision, canShow, isBlocked, decidingGate
 *   2. Full O1-O8 pipeline coverage with per-gate verification
 *   3. Organized by gate and scenario — mirrors the gate chain structure
 *   4. Both PASS (good responses) and firing (bad responses) cases covered
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";
import {
  guardOverclaim,
  guardOverclaimQuick,
  formatOverclaimTelemetry,
  OVERCLAIM_DECISION_CATALOG,
  OVERCLAIM_GATE_CATALOG,
  type OverclaimGuardInput,
  type OverclaimGuardResult,
  type OverclaimDecision,
} from "../overclaimGuard";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** A well-formed, honest response — should pass all gates. */
function honestResponseVi(): string {
  return (
    "Mình hiểu ý bạn. 🔍 Bạn viết: \"I go to market yesterday.\" " +
    "💡 Gợi ý: \"I went to the market yesterday.\" " +
    "📝 Giải thích: Khi có 'yesterday', động từ thường ở quá khứ 'went'. " +
    "Đây là quy tắc thường gặp — tuy có một số động từ bất quy tắc, " +
    "nhưng 'go' → 'went' là một trong những trường hợp phổ biến nhất. " +
    "Bạn thử đặt một câu khác với 'yesterday' nhé?"
  );
}

/** An honest response with appropriate hedging. */
function hedgedResponseVi(): string {
  return (
    "Chào bạn! Hầu hết các động từ trong tiếng Anh khi ở thì quá khứ " +
    "thường thêm -ed. Nhưng có một số động từ bất quy tắc không theo " +
    "quy tắc này — và 'go' là một trong số đó. " +
    "Đây là điều mà đa số người học đều cần thời gian để quen."
  );
}

/** A short, simple response (no rule claims) — should pass. */
function simpleResponseVi(): string {
  return "Hay quá! Kể thêm cho mình nghe về chuyến đi chợ hôm qua của bạn đi!";
}

function input(overrides: Partial<OverclaimGuardInput> = {}): OverclaimGuardInput {
  return {
    explanationVi: honestResponseVi(),
    ...overrides,
  };
}

/** Assert the result has the expected shape. */
function assertResultShape(result: OverclaimGuardResult) {
  expect(result).toHaveProperty("decision");
  expect(result).toHaveProperty("canShow");
  expect(result).toHaveProperty("needsRevision");
  expect(result).toHaveProperty("isBlocked");
  expect(result).toHaveProperty("gates");
  expect(result).toHaveProperty("passedCount");
  expect(result).toHaveProperty("firedCount");
  expect(result).toHaveProperty("decidingGate");
  expect(result).toHaveProperty("summaryVi");
  expect(result).toHaveProperty("summaryEn");
  expect(result).toHaveProperty("allMatchedSnippets");
  expect(result.decision).oneOf(["PASS", "FLAG", "REVISE", "BLOCK"]);
}

// ─── Catalog Validation ──────────────────────────────────────────────────────

describe("Overclaim guard catalogs", () => {
  it("has 4 decision types in catalog", () => {
    expect(OVERCLAIM_DECISION_CATALOG).toHaveLength(4);
    const decisions = OVERCLAIM_DECISION_CATALOG.map((d) => d.decision);
    expect(decisions).toEqual(["PASS", "FLAG", "REVISE", "BLOCK"]);
  });

  it("has 8 gates in catalog", () => {
    expect(OVERCLAIM_GATE_CATALOG).toHaveLength(8);
    const gateIds = OVERCLAIM_GATE_CATALOG.map((g) => g.gateId);
    expect(gateIds).toEqual([
      "O1_ABSOLUTE_CERTAINTY",
      "O2_FAKE_STATISTICS",
      "O3_OVERPROMISING_OUTCOMES",
      "O4_CLAIMING_LEARNER_STATE",
      "O5_MISSING_HEDGE",
      "O6_OVERCLAIMING_SCOPE",
      "O7_NO_EXCEPTIONS_CLAIM",
      "O8_OVERCLAIMING_AUTHORITY",
    ]);
  });

  it("has correct severity levels", () => {
    const severities = OVERCLAIM_GATE_CATALOG.map((g) => g.severity);
    expect(severities).toEqual([
      "REVISE",  // O1
      "BLOCK",   // O2
      "REVISE",  // O3
      "FLAG",    // O4
      "FLAG",    // O5
      "REVISE",  // O6
      "REVISE",  // O7
      "FLAG",    // O8
    ]);
  });
});

// ─── PASS Cases — Honest Responses ──────────────────────────────────────────

describe("PASS — honest responses (all gates pass)", () => {
  it("PASSes a well-formed honest explanation", () => {
    const result = guardOverclaim(input({ explanationVi: honestResponseVi() }));
    assertResultShape(result);
    expect(result.decision).toBe("PASS");
    expect(result.canShow).toBe(true);
    expect(result.isBlocked).toBe(false);
    expect(result.needsRevision).toBe(false);
    expect(result.firedCount).toBe(0);
    expect(result.decidingGate).toBeNull();
    expect(result.gates).toHaveLength(8);
    // All gates should pass
    for (const gate of result.gates) {
      expect(gate.passed).toBe(true);
      expect(gate.decision).toBeNull();
    }
  });

  it("PASSes a hedged response with appropriate softening", () => {
    const result = guardOverclaim(input({ explanationVi: hedgedResponseVi() }));
    expect(result.decision).toBe("PASS");
    expect(result.canShow).toBe(true);
    expect(result.firedCount).toBe(0);
  });

  it("PASSes a simple conversational response with no claims", () => {
    const result = guardOverclaim(input({ explanationVi: simpleResponseVi() }));
    expect(result.decision).toBe("PASS");
    expect(result.canShow).toBe(true);
    expect(result.firedCount).toBe(0);
  });

  it("PASSes an empty string (edge case)", () => {
    const result = guardOverclaim(input({ explanationVi: "" }));
    expect(result.decision).toBe("PASS");
    expect(result.firedCount).toBe(0);
  });

  it("PASSes via quick convenience API", () => {
    const result = guardOverclaimQuick(honestResponseVi());
    expect(result.decision).toBe("PASS");
    expect(result.canShow).toBe(true);
  });
});

// ─── O1 — Absolute Certainty Language ────────────────────────────────────────

describe("O1 — Absolute certainty language", () => {
  it("REVISE: 'luôn luôn' in grammar explanation", () => {
    const text = "Khi có 'yesterday', bạn luôn luôn phải dùng thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(result.needsRevision).toBe(true);
    expect(result.allMatchedSnippets.length).toBeGreaterThan(0);

    const o1Gate = result.gates[0];
    expect(o1Gate.gateId).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(o1Gate.passed).toBe(false);
    expect(o1Gate.decision).toBe("REVISE");
    expect(o1Gate.reasonCode).toBe("o1_absolute_language");
  });

  it("REVISE: 'không bao giờ' in grammar explanation", () => {
    const text = "Người bản xứ không bao giờ nói 'I go to market yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'tất cả các trường hợp' claim", () => {
    const text = "Quy tắc này áp dụng cho tất cả các trường hợp có 'yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: '100% đúng' claim", () => {
    const text = "Cách dùng này 100% đúng trong mọi tình huống.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'always' without hedging in English", () => {
    const text = "You must always use the past tense with 'yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'never' without hedging in English", () => {
    const text = "Native speakers never say 'I go to market yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("PASSes 'usually' which is appropriately hedged", () => {
    // "always" pattern triggers only if no hedging words nearby
    const text = "You should usually use past tense with 'yesterday', though there are exceptions.";
    const result = guardOverclaim(input({ explanationVi: text }));
    // O1 should pass because "usually" is hedging nearby "always" isn't present
    const o1Gate = result.gates.find((g) => g.gateId === "O1_ABSOLUTE_CERTAINTY");
    if (o1Gate) expect(o1Gate.passed).toBe(true);
  });

  it("REVISE: short-circuits on first match (O1 fires before O2-O8)", () => {
    // Contains both absolute language AND other issues
    const text = "Bạn luôn luôn phải dùng 'went'. Theo nghiên cứu, 90% người Việt sai cái này.";
    const result = guardOverclaim(input({ explanationVi: text }));
    // O1 fires first, before O2 (fake statistics)
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(result.gates.length).toBeLessThan(8); // short-circuited
  });
});

// ─── O2 — Fake Statistics / Made-Up Data ─────────────────────────────────────

describe("O2 — Fake statistics / made-up data", () => {
  it("BLOCK: '90% người học' claim", () => {
    const text = "Khoảng 90% người học tiếng Anh mắc lỗi này.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
    expect(result.isBlocked).toBe(true);
    expect(result.canShow).toBe(false);

    const o2Idx = result.gates.findIndex((g) => g.gateId === "O2_FAKE_STATISTICS");
    expect(o2Idx).toBeGreaterThanOrEqual(0);
    const o2Gate = result.gates[o2Idx];
    expect(o2Gate.passed).toBe(false);
    expect(o2Gate.decision).toBe("BLOCK");
    expect(o2Gate.reasonCode).toBe("o2_fake_statistics");
    expect(o2Gate.matchedSnippet).toBeTruthy();
  });

  it("BLOCK: 'theo nghiên cứu' claim", () => {
    const text = "Theo nghiên cứu, đây là lỗi phổ biến nhất của người Việt.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("BLOCK: 'số liệu cho thấy' claim", () => {
    const text = "Số liệu cho thấy hầu hết người Việt gặp khó khăn với thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("BLOCK: 'thống kê cho thấy' claim", () => {
    const text = "Thống kê cho thấy 70% người học sai quy tắc này trong lần đầu.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("BLOCK: 'research shows' in English", () => {
    const text = "Research shows that Vietnamese learners struggle with past tense.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("BLOCK: 'studies prove' in English", () => {
    const text = "Studies prove that this is the most common error.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("BLOCK: 'hầu hết người Việt đều mắc' without evidence", () => {
    const text = "Hầu hết người Việt đều mắc lỗi này khi mới học.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("PASSes: 'nhiều người học' (general observation, not fake stat)", () => {
    const text = "Nhiều người học thường gặp khó khăn với thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    // "nhiều người học" without a percentage or "research" should NOT trigger O2
    const o2Gate = result.gates.find((g) => g.gateId === "O2_FAKE_STATISTICS");
    if (o2Gate) expect(o2Gate.passed).toBe(true);
  });
});

// ─── O3 — Overpromising Outcomes ─────────────────────────────────────────────

describe("O3 — Overpromising outcomes", () => {
  it("REVISE: 'sẽ không bao giờ sai nữa'", () => {
    // O1 fires first because "không bao giờ" is absolute language (O1 > O3)
    const text = "Chỉ cần nhớ quy tắc này, bạn sẽ không bao giờ sai nữa.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(result.needsRevision).toBe(true);
  });

  it("REVISE: 'bảo đảm bạn sẽ'", () => {
    const text = "Mình bảo đảm bạn sẽ nhớ quy tắc này sau bài hôm nay.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O3_OVERPROMISING_OUTCOMES");
  });

  it("REVISE: 'cam đoan bạn sẽ'", () => {
    // O1 fires first because "không bao giờ" is absolute language (O1 > O3)
    const text = "Cô cam đoan bạn sẽ không bao giờ mắc lỗi này nữa.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'chỉ cần nhớ quy tắc này là đủ'", () => {
    const text = "Quy tắc thì quá khứ rất đơn giản — chỉ cần nhớ quy tắc này là đủ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O3_OVERPROMISING_OUTCOMES");
  });

  it("REVISE: 'sau bài này bạn sẽ nói như người bản xứ'", () => {
    const text = "Sau bài này bạn sẽ nói tiếng Anh như người bản xứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O3_OVERPROMISING_OUTCOMES");
  });

  it("REVISE: 'guarantee' in English", () => {
    const text = "I guarantee you'll master this rule after today's lesson.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O3_OVERPROMISING_OUTCOMES");
  });

  it("PASSes: realistic encouragement (not overpromising)", () => {
    const text = "Từ từ rồi bạn sẽ quen thôi. Ai cũng cần thời gian để nhớ những động từ bất quy tắc mà.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o3Gate = result.gates.find((g) => g.gateId === "O3_OVERPROMISING_OUTCOMES");
    if (o3Gate) expect(o3Gate.passed).toBe(true);
  });
});

// ─── O4 — Claiming Knowledge of Learner's Internal State ─────────────────────

describe("O4 — Claiming learner internal state", () => {
  it("FLAG: 'bạn đang bối rối'", () => {
    const text = "Mình thấy bạn đang bối rối với thì quá khứ. Để mình giải thích lại nhé.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
    expect(result.canShow).toBe(true); // FLAG still allows showing
    expect(result.isBlocked).toBe(false);

    const o4Idx = result.gates.findIndex((g) => g.gateId === "O4_CLAIMING_LEARNER_STATE");
    expect(o4Idx).toBeGreaterThanOrEqual(0);
    const o4Gate = result.gates[o4Idx];
    expect(o4Gate.passed).toBe(false);
    expect(o4Gate.decision).toBe("FLAG");
    expect(o4Gate.reasonCode).toBe("o4_claiming_learner_state");
  });

  it("FLAG: 'bạn đang cảm thấy tự ti'", () => {
    const text = "Đừng lo, mình biết bạn đang cảm thấy tự ti vì sai nhiều.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
  });

  it("FLAG: 'bạn không tự tin'", () => {
    const text = "Bạn không tự tin khi dùng thì quá khứ phải không?";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
  });

  it("FLAG: 'bạn nghĩ rằng' (mind-reading)", () => {
    const text = "Bạn nghĩ rằng 'go' ở quá khứ vẫn là 'go' vì nó ngắn gọn.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
  });

  it("FLAG: 'bạn đang gặp khó khăn với'", () => {
    const text = "Bạn đang gặp khó khăn với việc chọn đúng thì của động từ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
  });

  it("FLAG: 'bạn chưa nắm được'", () => {
    const text = "Có vẻ bạn chưa nắm được cách chia động từ bất quy tắc.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O4_CLAIMING_LEARNER_STATE");
  });

  it("PASSes: asking instead of asserting about learner state", () => {
    const text = "Bạn có thấy thì quá khứ hơi khó không? Nhiều bạn cũng thấy vậy lúc đầu.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o4Gate = result.gates.find((g) => g.gateId === "O4_CLAIMING_LEARNER_STATE");
    if (o4Gate) expect(o4Gate.passed).toBe(true);
  });
});

// ─── O5 — Missing Hedge on Exception-Prone Rules ─────────────────────────────

describe("O5 — Missing hedge on rules", () => {
  it("FLAG: states rule without hedging", () => {
    const text = "Quy tắc này rất đơn giản: khi có 'yesterday', bạn dùng thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O5_MISSING_HEDGE");

    const o5Idx = result.gates.findIndex((g) => g.gateId === "O5_MISSING_HEDGE");
    expect(o5Idx).toBeGreaterThanOrEqual(0);
    const o5Gate = result.gates[o5Idx];
    expect(o5Gate.passed).toBe(false);
    expect(o5Gate.decision).toBe("FLAG");
    expect(o5Gate.reasonCode).toBe("o5_missing_hedge");
  });

  it("FLAG: 'công thức là' without hedging", () => {
    const text = "Công thức là: chủ ngữ + động từ quá khứ + tân ngữ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O5_MISSING_HEDGE");
  });

  it("FLAG: 'luôn phải' without hedging", () => {
    const text = "Bạn luôn phải thêm -ed vào động từ có quy tắc ở thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O5_MISSING_HEDGE");
  });

  it("FLAG: 'bắt buộc phải' without hedging", () => {
    const text = "Khi có dấu hiệu quá khứ, bạn bắt buộc phải chia động từ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O5_MISSING_HEDGE");
  });

  it("PASSes: rule stated WITH hedging ('thường')", () => {
    const text = "Quy tắc thường là: khi có 'yesterday', động từ thường ở quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o5Gate = result.gates.find((g) => g.gateId === "O5_MISSING_HEDGE");
    if (o5Gate) expect(o5Gate.passed).toBe(true);
  });

  it("PASSes: rule stated WITH hedging ('đa số')", () => {
    const text = "Công thức này áp dụng cho đa số động từ có quy tắc.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o5Gate = result.gates.find((g) => g.gateId === "O5_MISSING_HEDGE");
    if (o5Gate) expect(o5Gate.passed).toBe(true);
  });

  it("PASSes: rule stated WITH hedging ('hầu hết')", () => {
    const text = "Hầu hết các trường hợp có 'yesterday' đều dùng thì quá khứ. Quy tắc là vậy.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o5Gate = result.gates.find((g) => g.gateId === "O5_MISSING_HEDGE");
    if (o5Gate) expect(o5Gate.passed).toBe(true);
  });

  it("PASSes: no rule-claiming language at all", () => {
    const text = "Hay quá! Bạn kể thêm về chợ hôm qua đi!";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o5Gate = result.gates.find((g) => g.gateId === "O5_MISSING_HEDGE");
    if (o5Gate) {
      expect(o5Gate.passed).toBe(true);
      expect(o5Gate.reasonCode).toBe("o5_no_rule_claim");
    }
  });
});

// ─── O6 — Overclaiming Rule Scope ────────────────────────────────────────────

describe("O6 — Overclaiming rule scope", () => {
  it("REVISE: 'tất cả động từ'", () => {
    const text = "Tất cả động từ trong tiếng Anh đều phải chia ở thì quá khứ khi có 'yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");

    const o6Idx = result.gates.findIndex((g) => g.gateId === "O6_OVERCLAIMING_SCOPE");
    expect(o6Idx).toBeGreaterThanOrEqual(0);
    const o6Gate = result.gates[o6Idx];
    expect(o6Gate.passed).toBe(false);
    expect(o6Gate.decision).toBe("REVISE");
    expect(o6Gate.reasonCode).toBe("o6_overclaiming_scope");
  });

  it("REVISE: 'mọi động từ'", () => {
    const text = "Mọi động từ có quy tắc đều thêm -ed ở thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");
  });

  it("REVISE: 'tất cả danh từ'", () => {
    const text = "Tất cả danh từ số nhiều đều thêm 's' hoặc 'es'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");
  });

  it("REVISE: 'bất kỳ câu nào'", () => {
    const text = "Bất kỳ câu nào có 'yesterday' cũng phải dùng thì quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");
  });

  it("REVISE: 'không phân biệt'", () => {
    const text = "Quy tắc này áp dụng không phân biệt loại động từ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");
  });

  it("REVISE: 'all verbs' in English", () => {
    const text = "All verbs must take the past tense form when used with 'yesterday'.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O6_OVERCLAIMING_SCOPE");
  });

  it("PASSes: appropriately scoped claim", () => {
    const text = "Hầu hết động từ có quy tắc đều thêm -ed ở thì quá khứ, nhưng có một số ngoại lệ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o6Gate = result.gates.find((g) => g.gateId === "O6_OVERCLAIMING_SCOPE");
    if (o6Gate) expect(o6Gate.passed).toBe(true);
  });
});

// ─── O7 — Claiming "No Exceptions" ───────────────────────────────────────────

describe("O7 — Claiming 'no exceptions'", () => {
  it("REVISE: 'không có ngoại lệ'", () => {
    const text = "Quy tắc thì quá khứ trong tiếng Anh không có ngoại lệ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O7_NO_EXCEPTIONS_CLAIM");

    const o7Idx = result.gates.findIndex((g) => g.gateId === "O7_NO_EXCEPTIONS_CLAIM");
    expect(o7Idx).toBeGreaterThanOrEqual(0);
    const o7Gate = result.gates[o7Idx];
    expect(o7Gate.passed).toBe(false);
    expect(o7Gate.decision).toBe("REVISE");
    expect(o7Gate.reasonCode).toBe("o7_no_exceptions_claim");
  });

  it("REVISE: 'không có bất kỳ ngoại lệ nào'", () => {
    const text = "Không có bất kỳ ngoại lệ nào cho quy tắc này.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O7_NO_EXCEPTIONS_CLAIM");
  });

  it("REVISE: 'luôn luôn đúng'", () => {
    const text = "Quy tắc 'i before e except after c' luôn luôn đúng.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    // O1 fires first for "luôn luôn"
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'luôn đúng trong mọi trường hợp'", () => {
    // O1 fires first because "mọi trường hợp" is absolute language (O1 > O7)
    const text = "Cách dùng này luôn đúng trong mọi trường hợp.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'không bao giờ thay đổi'", () => {
    const text = "Động từ bất quy tắc không bao giờ thay đổi — bạn phải học thuộc.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    // O1 fires first for "không bao giờ"
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("REVISE: 'no exceptions' in English", () => {
    const text = "This grammar rule has no exceptions in standard English.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O7_NO_EXCEPTIONS_CLAIM");
  });

  it("PASSes: appropriately acknowledges exceptions", () => {
    const text = "Quy tắc này hầu như không có ngoại lệ — chỉ có vài trường hợp đặc biệt thôi.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o7Gate = result.gates.find((g) => g.gateId === "O7_NO_EXCEPTIONS_CLAIM");
    if (o7Gate) expect(o7Gate.passed).toBe(true);
  });
});

// ─── O8 — Overclaiming Teacher Authority ─────────────────────────────────────

describe("O8 — Overclaiming teacher authority", () => {
  it("FLAG: 'cô biết chắc'", () => {
    const text = "Cô biết chắc là bạn sẽ tiến bộ nhanh thôi.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");

    const o8Idx = result.gates.findIndex((g) => g.gateId === "O8_OVERCLAIMING_AUTHORITY");
    expect(o8Idx).toBeGreaterThanOrEqual(0);
    const o8Gate = result.gates[o8Idx];
    expect(o8Gate.passed).toBe(false);
    expect(o8Gate.decision).toBe("FLAG");
    expect(o8Gate.reasonCode).toBe("o8_overclaiming_authority");
  });

  it("FLAG: 'cô đảm bảo'", () => {
    const text = "Cô đảm bảo cách này sẽ giúp bạn nhớ lâu hơn.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    // O8 fires for "cô đảm bảo" (authority overclaim) — "đảm bảo" does not match O3's "bảo đảm"
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'cô chắc chắn'", () => {
    const text = "Cô chắc chắn đây là cách học hiệu quả nhất.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'tin cô đi'", () => {
    const text = "Tin cô đi, chỉ cần luyện tập thêm vài lần là bạn sẽ nhớ ngay.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'cô đã dạy hàng ngàn'", () => {
    const text = "Cô đã dạy hàng ngàn học viên và ai cũng gặp lỗi này lúc đầu.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'kinh nghiệm của cô'", () => {
    const text = "Kinh nghiệm của cô cho thấy đây là cách hiệu quả nhất.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'cô có thể khẳng định'", () => {
    const text = "Cô có thể khẳng định rằng bạn đang đi đúng hướng.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("FLAG: 'trust me' in English", () => {
    const text = "Trust me, this is the best way to learn irregular verbs.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("FLAG");
    expect(result.decidingGate).toBe("O8_OVERCLAIMING_AUTHORITY");
  });

  it("PASSes: confident but not overclaiming", () => {
    const text = "Cô thấy bạn đã tiến bộ nhiều rồi. Cố lên nhé!";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o8Gate = result.gates.find((g) => g.gateId === "O8_OVERCLAIMING_AUTHORITY");
    if (o8Gate) expect(o8Gate.passed).toBe(true);
  });

  it("PASSes: 'mình' (humble) instead of 'cô' authority", () => {
    const text = "Mình nghĩ cách này có thể giúp ích cho bạn. Bạn thử xem sao nhé?";
    const result = guardOverclaim(input({ explanationVi: text }));
    const o8Gate = result.gates.find((g) => g.gateId === "O8_OVERCLAIMING_AUTHORITY");
    if (o8Gate) expect(o8Gate.passed).toBe(true);
  });
});

// ─── Short-Circuit Behavior ──────────────────────────────────────────────────

describe("Short-circuit behavior", () => {
  it("O1 fires before O2 when both patterns present", () => {
    const text = "Bạn luôn luôn phải dùng 'went'. Theo nghiên cứu, 90% người Việt sai.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(result.gates.length).toBeLessThan(8);
  });

  it("O2 fires and BLOCKs even when later gates would FLAG", () => {
    const text = "Theo nghiên cứu, 80% người học sai. Cô biết chắc bạn sẽ tiến bộ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
    expect(result.gates.length).toBeLessThan(8);
  });

  it("Runs full chain when no gate fires", () => {
    const result = guardOverclaim(input({ explanationVi: honestResponseVi() }));
    expect(result.gates).toHaveLength(8);
    expect(result.decision).toBe("PASS");
    expect(result.decidingGate).toBeNull();
    expect(result.passedCount).toBe(8);
    expect(result.firedCount).toBe(0);
  });

  it("only one gate fires per run (short-circuit)", () => {
    // A text with issues at O1 level — should fire O1 and stop
    const text = "Bạn luôn luôn sai cái này. Ngoài ra còn thiếu hedge và overclaim scope.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.firedCount).toBe(1);
    expect(result.gates.filter((g) => g.decision !== null)).toHaveLength(1);
  });
});

// ─── Telemetry Formatter ─────────────────────────────────────────────────────

describe("formatOverclaimTelemetry", () => {
  it("produces valid telemetry for PASS result", () => {
    const result = guardOverclaim(input({ explanationVi: honestResponseVi() }));
    const telemetry = formatOverclaimTelemetry(result);

    expect(telemetry.decision).toBe("PASS");
    expect(telemetry.canShow).toBe(true);
    expect(telemetry.needsRevision).toBe(false);
    expect(telemetry.isBlocked).toBe(false);
    expect(telemetry.decidingGate).toBeNull();
    expect(telemetry.passedCount).toBe(8);
    expect(telemetry.firedCount).toBe(0);
    expect(telemetry.matchedSnippetCount).toBe(0);
    expect(telemetry.gateResults).toBeDefined();

    const gateResults = telemetry.gateResults as Record<string, unknown>;
    expect(Object.keys(gateResults)).toHaveLength(8);
    for (const gateId of Object.keys(gateResults)) {
      const gr = gateResults[gateId] as Record<string, unknown>;
      expect(gr.passed).toBe(true);
      expect(gr.decision).toBeNull();
      expect(typeof gr.reasonCode).toBe("string");
    }
  });

  it("produces valid telemetry for BLOCK result", () => {
    const text = "Theo nghiên cứu, 90% người Việt sai.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const telemetry = formatOverclaimTelemetry(result);

    expect(telemetry.decision).toBe("BLOCK");
    expect(telemetry.canShow).toBe(false);
    expect(telemetry.isBlocked).toBe(true);
    expect(telemetry.decidingGate).toBe("O2_FAKE_STATISTICS");
    expect(telemetry.matchedSnippetCount).toBe(1);

    const gateResults = telemetry.gateResults as Record<string, unknown>;
    const o2Result = gateResults["O2_FAKE_STATISTICS"] as Record<string, unknown>;
    expect(o2Result.passed).toBe(false);
    expect(o2Result.decision).toBe("BLOCK");
    expect(o2Result.hasSnippet).toBe(true);
  });

  it("produces valid telemetry for REVISE result", () => {
    const text = "Tất cả động từ đều phải chia ở quá khứ.";
    const result = guardOverclaim(input({ explanationVi: text }));
    const telemetry = formatOverclaimTelemetry(result);

    expect(telemetry.decision).toBe("REVISE");
    expect(telemetry.canShow).toBe(false);
    expect(telemetry.needsRevision).toBe(true);
    expect(telemetry.isBlocked).toBe(false);
  });

  it("produces valid telemetry for FLAG result", () => {
    const text = "Bạn đang bối rối với thì quá khứ phải không?";
    const result = guardOverclaim(input({ explanationVi: text }));
    const telemetry = formatOverclaimTelemetry(result);

    expect(telemetry.decision).toBe("FLAG");
    expect(telemetry.canShow).toBe(true);
    expect(telemetry.needsRevision).toBe(false);
    expect(telemetry.isBlocked).toBe(false);
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles very long response text", () => {
    const text = honestResponseVi().repeat(10); // ~1KB of text
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("PASS");
  });

  it("handles mixed Vietnamese-English response", () => {
    const text = "Trong tiếng Anh, research shows that 90% of learners make this mistake.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("handles response with only emoji and whitespace", () => {
    const text = "👍 👏 💪";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.decision).toBe("PASS");
  });

  it("extracts matched snippets for REVISE decisions", () => {
    const text = "Khi gặp 'yesterday', bạn luôn luôn phải dùng thì quá khứ nhé.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.allMatchedSnippets.length).toBeGreaterThan(0);
    expect(result.allMatchedSnippets[0]).toContain("luôn luôn");
  });

  it("extracts matched snippets for BLOCK decisions", () => {
    const text = "Theo nghiên cứu gần đây, 85% người học gặp lỗi này.";
    const result = guardOverclaim(input({ explanationVi: text }));
    expect(result.allMatchedSnippets.length).toBeGreaterThan(0);
    expect(result.allMatchedSnippets[0]).toContain("85%");
  });
});

// ─── Decision Enum Exhaustiveness ────────────────────────────────────────────

describe("Decision exhaustiveness", () => {
  it("covers all 4 decision types across tests", () => {
    const seen = new Set<OverclaimDecision>();

    // PASS
    seen.add(guardOverclaim(input({ explanationVi: honestResponseVi() })).decision);

    // FLAG — O4
    seen.add(guardOverclaim(input({ explanationVi: "Bạn đang bối rối phải không?" })).decision);

    // REVISE — O6
    seen.add(guardOverclaim(input({ explanationVi: "Tất cả động từ đều chia quá khứ." })).decision);

    // BLOCK — O2
    seen.add(guardOverclaim(input({ explanationVi: "Theo nghiên cứu, 90% sai." })).decision);

    expect(seen.has("PASS")).toBe(true);
    expect(seen.has("FLAG")).toBe(true);
    expect(seen.has("REVISE")).toBe(true);
    expect(seen.has("BLOCK")).toBe(true);
  });
});
