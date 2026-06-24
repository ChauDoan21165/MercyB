import { describe, expect, it } from "vitest";
import {
  evaluateRubric,
  evaluateRubricFocused,
  isResponseSafe,
  TEACHER_MERCY_RUBRIC_CATALOG,
  type RubricResult,
  type RubricDimensionResult,
} from "../teacherMercyRubric";
import { ALL_RUBRIC_FIXTURES } from "./fixtures/teacherMercyRubric.fixtures";
import type { ContractLearnerInput, ContractTutorResponse } from "../teacherMercyContract";

// ─── Helpers ────────────────────────────────────────────────────────────

function learner(overrides: Partial<ContractLearnerInput> = {}): ContractLearnerInput {
  return {
    text: "Yesterday I go to market.",
    cefrLevel: "A2",
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
    ...overrides,
  };
}

function goodResponse(overrides: Partial<ContractTutorResponse> = {}): ContractTutorResponse {
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

// ─── Fixture-Based Tests ─────────────────────────────────────────────────

describe("evaluateRubric — fixture-driven", () => {
  for (const fixture of ALL_RUBRIC_FIXTURES) {
    it(`fixture: ${fixture.name} → ${fixture.expectedClassification}`, () => {
      const result = evaluateRubric(fixture.learnerInput, fixture.response);

      // Check classification
      expect(
        result.classification,
        `Classification mismatch for "${fixture.name}": expected ${fixture.expectedClassification}, got ${result.classification}. Summary: ${result.summaryVi}`,
      ).toBe(fixture.expectedClassification);

      // Check each dimension score
      for (const [dimId, expectedScore] of Object.entries(
        fixture.expectedDimensionScores,
      )) {
        const dim = result.dimensions.find((d) => d.dimensionId === dimId);
        expect(dim, `Dimension "${dimId}" not found in result`).toBeDefined();
        expect(
          dim!.score,
          `Dimension "${dimId}" score mismatch for "${fixture.name}": expected ${expectedScore}, got ${dim!.score}. Detail: ${dim!.detailVi}`,
        ).toBe(expectedScore);
      }
    });
  }
});

// ─── Dimension Mapping ──────────────────────────────────────────────────

describe("evaluateRubric — dimension mapping", () => {
  it("has exactly 7 dimensions", () => {
    const result = evaluateRubric(learner(), goodResponse());
    expect(result.dimensions).toHaveLength(7);
  });

  it("every dimension has a valid score 0-3", () => {
    const result = evaluateRubric(learner(), goodResponse());
    for (const dim of result.dimensions) {
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(dim.score).toBeLessThanOrEqual(3);
      expect(["excellent", "good", "needs_work", "failing"]).toContain(dim.label);
    }
  });

  it("every dimension has Vietnamese and English titles", () => {
    const result = evaluateRubric(learner(), goodResponse());
    for (const dim of result.dimensions) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.detailVi).toBeTruthy();
    }
  });

  it("every dimension has source rule IDs", () => {
    const result = evaluateRubric(learner(), goodResponse());
    for (const dim of result.dimensions) {
      expect(dim.sourceRuleIds.length).toBeGreaterThan(0);
      expect(dim.ruleResults.length).toBe(dim.sourceRuleIds.length);
    }
  });

  it("rule results match source rule IDs", () => {
    const result = evaluateRubric(learner(), goodResponse());
    for (const dim of result.dimensions) {
      const ruleIds = dim.ruleResults.map((r) => r.ruleId);
      expect(ruleIds.sort()).toEqual([...dim.sourceRuleIds].sort());
    }
  });
});

// ─── Classification Logic ────────────────────────────────────────────────

describe("evaluateRubric — classification", () => {
  it("classifies a perfect response as 'exemplary'", () => {
    const result = evaluateRubric(learner({ trackedWeakness: "past-tense" }), goodResponse());
    expect(result.classification).toBe("exemplary");
    expect(result.safetyPassed).toBe(true);
  });

  it("classifies fake praise as 'failing'", () => {
    const result = evaluateRubric(
      learner(),
      goodResponse({
        vi: "Hoàn hảo! Bạn giỏi quá!",
        nextSteps: [],
      }),
    );
    expect(result.classification).toBe("failing");
    expect(result.safetyPassed).toBe(false);
  });

  it("classifies face-threatening language as 'failing'", () => {
    const result = evaluateRubric(
      learner(),
      goodResponse({
        vi: "Bạn sai rồi! Phải là 'went'.",
      }),
    );
    expect(result.classification).toBe("failing");
    expect(result.safetyPassed).toBe(false);
  });

  it("classifies uncertain correction as 'failing'", () => {
    const result = evaluateRubric(
      learner(),
      goodResponse({
        vi: "Mình không chắc lắm, nhưng 💡 Gợi ý: \"I went.\"",
      }),
    );
    expect(result.classification).toBe("failing");
    expect(result.safetyPassed).toBe(false);
  });

  it("classifies multiple violations as 'needs_revision'", () => {
    const result = evaluateRubric(
      learner({ didSelfCorrect: true }),
      {
        vi: "🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" 🔍 Bạn viết: \"market.\" 💡 Gợi ý: \"the market.\" Bạn hiểu chưa? Tại sao sai? Kể thêm đi?",
        correctedSentence: "I went.",
        grammarPoints: ["past tense", "articles", "prepositions", "word order"],
        nextSteps: [
          { labelVi: "A" },
          { labelVi: "B" },
          { labelVi: "C" },
          { labelVi: "D" },
        ],
      },
    );
    expect(result.classification).toBe("needs_revision");
    expect(result.safetyPassed).toBe(true);
  });

  it("classifies a conversational response as 'exemplary'", () => {
    const result = evaluateRubric(
      learner({ trackedWeakness: "past-tense" }),
      {
        vi: "Mình hiểu, cuối tuần của bạn nghe vui quá! Bạn đã đi đâu nữa không?",
        nextSteps: [],
        correctionCount: 0,
        followUpQuestionCount: 1,
      },
    );
    expect(result.classification).toBe("exemplary");
  });
});

// ─── Summary Text ────────────────────────────────────────────────────────

describe("evaluateRubric — summaryVi", () => {
  it("summary includes Vietnamese text", () => {
    const result = evaluateRubric(learner(), goodResponse());
    expect(result.summaryVi).toBeTruthy();
    // Vietnamese summary should contain diacritics (basic check)
    expect(result.summaryVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
  });

  it("summary changes with classification", () => {
    const exemplary = evaluateRubric(learner({ trackedWeakness: "past-tense" }), goodResponse());
    const failing = evaluateRubric(learner(), { vi: "Hoàn hảo! Bạn sai rồi!", nextSteps: [] });

    expect(exemplary.summaryVi).not.toBe(failing.summaryVi);
    expect(exemplary.summaryVi).toContain("Xuất sắc");
    expect(failing.summaryVi).toContain("Không an toàn");
  });
});

// ─── Safety Gate ─────────────────────────────────────────────────────────

describe("isResponseSafe", () => {
  it("returns true for a well-formed response", () => {
    expect(isResponseSafe(learner(), goodResponse())).toBe(true);
  });

  it("returns false when fake praise is present", () => {
    expect(
      isResponseSafe(
        learner(),
        goodResponse({ vi: "Hoàn hảo! Tuyệt vời!" }),
      ),
    ).toBe(false);
  });

  it("returns false when face-threatening language is present", () => {
    expect(
      isResponseSafe(
        learner(),
        goodResponse({ vi: "Bạn sai rồi! Không đúng." }),
      ),
    ).toBe(false);
  });

  it("returns false when correction mixed with uncertainty", () => {
    expect(
      isResponseSafe(
        learner(),
        goodResponse({
          vi: "Mình không chắc, nhưng 💡 Gợi ý: \"I went.\"",
        }),
      ),
    ).toBe(false);
  });

  it("returns true for a conversation-only response", () => {
    expect(
      isResponseSafe(
        learner(),
        {
          vi: "Mình hiểu rồi. Bạn kể tiếp đi!",
          nextSteps: [],
        },
      ),
    ).toBe(true);
  });
});

// ─── Focused Evaluator ──────────────────────────────────────────────────

describe("evaluateRubricFocused", () => {
  it("'full' mode returns all 7 dimensions", () => {
    const result = evaluateRubricFocused(learner(), goodResponse(), "full");
    expect(result.dimensions).toHaveLength(7);
  });

  it("'correction' mode returns 5 dimensions", () => {
    const result = evaluateRubricFocused(learner(), goodResponse(), "correction");
    expect(result.dimensions).toHaveLength(5);
    const ids = result.dimensions.map((d) => d.dimensionId);
    expect(ids).toContain("accuracy");
    expect(ids).toContain("correction_timing");
    expect(ids).toContain("specificity");
    expect(ids).toContain("safety");
    expect(ids).toContain("warmth");
    expect(ids).not.toContain("follow_up_quality");
    expect(ids).not.toContain("learner_memory_use");
  });

  it("'conversation' mode returns 5 dimensions", () => {
    const result = evaluateRubricFocused(learner({ trackedWeakness: "articles" }), {
      vi: "Hay quá! Bạn thấy trải nghiệm đó thế nào?",
      nextSteps: [],
      followUpQuestionCount: 1,
    }, "conversation");
    expect(result.dimensions).toHaveLength(5);
    const ids = result.dimensions.map((d) => d.dimensionId);
    expect(ids).toContain("warmth");
    expect(ids).toContain("follow_up_quality");
    expect(ids).toContain("learner_memory_use");
    expect(ids).toContain("safety");
    expect(ids).toContain("specificity");
    expect(ids).not.toContain("accuracy");
    expect(ids).not.toContain("correction_timing");
  });

  it("'correction' mode still catches safety failures", () => {
    const result = evaluateRubricFocused(
      learner(),
      { vi: "Hoàn hảo! Bạn giỏi quá!", nextSteps: [] },
      "correction",
    );
    expect(result.classification).toBe("failing");
    expect(result.safetyPassed).toBe(false);
  });

  it("'conversation' mode still catches safety failures", () => {
    const result = evaluateRubricFocused(
      learner(),
      { vi: "Bạn sai rồi! Có hiểu không? Tại sao sai? Khi nào?", followUpQuestionCount: 3, nextSteps: [] },
      "conversation",
    );
    expect(result.classification).toBe("failing");
    expect(result.safetyPassed).toBe(false);
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────

describe("evaluateRubric — edge cases", () => {
  it("handles empty vi response", () => {
    const result = evaluateRubric(learner(), { vi: "", nextSteps: [] });
    expect(result.dimensions).toHaveLength(7);
    // Should not throw, should produce valid results
    for (const dim of result.dimensions) {
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(dim.score).toBeLessThanOrEqual(3);
      expect(dim.detailVi).toBeTruthy();
    }
  });

  it("handles undefined optional fields", () => {
    const result = evaluateRubric(
      learner({ cefrLevel: null, trackedWeakness: null }),
      { vi: "Mình hiểu rồi." },
    );
    expect(result.dimensions).toHaveLength(7);
    // All dimensions should produce valid results
    for (const dim of result.dimensions) {
      expect(typeof dim.score).toBe("number");
      expect(typeof dim.label).toBe("string");
    }
  });

  it("contractResult is included in rubric result", () => {
    const result = evaluateRubric(learner(), goodResponse());
    expect(result.contractResult).toBeDefined();
    expect(result.contractResult.rules).toHaveLength(10);
    expect(typeof result.contractResult.passed).toBe("boolean");
  });

  it("scoring: all rules passed → dimension score 3", () => {
    const result = evaluateRubric(learner({ trackedWeakness: "past-tense" }), goodResponse());
    const warmth = result.dimensions.find((d) => d.dimensionId === "warmth")!;
    expect(warmth.score).toBe(3);
    expect(warmth.label).toBe("excellent");
  });

  it("scoring: half rules passed → dimension score 1", () => {
    // R8 passes, but R3 fails (fake praise) → warmth = 1/2 = 50% → score 1
    const result = evaluateRubric(
      learner(),
      goodResponse({ vi: "Câu này chưa tự nhiên lắm, nhưng hoàn hảo!" }),
    );
    const warmth = result.dimensions.find((d) => d.dimensionId === "warmth")!;
    expect(warmth.score).toBe(1);
    expect(warmth.label).toBe("needs_work");
  });
});

// ─── Rubric Catalog ──────────────────────────────────────────────────────

describe("TEACHER_MERCY_RUBRIC_CATALOG", () => {
  it("has exactly 7 dimensions", () => {
    expect(TEACHER_MERCY_RUBRIC_CATALOG).toHaveLength(7);
  });

  it("every dimension has a unique id", () => {
    const ids = TEACHER_MERCY_RUBRIC_CATALOG.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every dimension has Vietnamese and English titles", () => {
    for (const dim of TEACHER_MERCY_RUBRIC_CATALOG) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
      expect(dim.ruleCount).toBeGreaterThan(0);
    }
  });

  it("all expected dimension IDs are present", () => {
    const ids = TEACHER_MERCY_RUBRIC_CATALOG.map((d) => d.id);
    expect(ids).toContain("warmth");
    expect(ids).toContain("accuracy");
    expect(ids).toContain("correction_timing");
    expect(ids).toContain("specificity");
    expect(ids).toContain("follow_up_quality");
    expect(ids).toContain("learner_memory_use");
    expect(ids).toContain("safety");
  });
});
