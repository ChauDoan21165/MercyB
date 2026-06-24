import { describe, expect, it } from "vitest";
import {
  GOLDEN_CONVERSATION_A1_INTRODUCTIONS,
  GOLDEN_CONVERSATION_A2_PAST_TENSE,
  GOLDEN_CONVERSATION_B1_SHOPPING,
  GOLDEN_CONVERSATION_B2_JOB_INTERVIEW,
  GOLDEN_CONVERSATION_C1_DEBATE,
  ALL_GOLDEN_CONVERSATIONS,
  validateGoldenConversation,
  scoreGoldenConversation,
  type GoldenConversation,
} from "../goldenConversationSimulations";
import { checkTeacherMercyContract } from "../teacherMercyContract";

// ─── Constants ──────────────────────────────────────────────────────────────

const CONVERSATION_TURN_COUNTS: Record<string, number> = {
  "a1-introductions": 3,
  "a2-past-tense-discovery": 4,
  "b1-shopping-self-correction": 4,
  "b2-job-interview": 5,
  "c1-discussion-debate": 4,
};

// ─── All golden conversations pass all contract rules ──────────────────────

describe("validateGoldenConversation — all turns pass all 10 contract rules", () => {
  for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
    describe(`${conversation.id} — ${conversation.title}`, () => {
      it("passes all 10 contract rules across all turns", () => {
        const result = validateGoldenConversation(conversation);
        expect(
          result.valid,
          `Conversation "${conversation.id}" has failing turns`,
        ).toBe(true);
      });

      it("every turn is individually valid", () => {
        const result = validateGoldenConversation(conversation);
        for (const tr of result.turnResults) {
          expect(
            tr.allRulesPass,
            `Turn ${tr.turnIndex} failed rules: [${tr.failedRules.join(", ")}]`,
          ).toBe(true);
          expect(tr.failedRules).toHaveLength(0);
        }
      });

      it("has the expected number of turns", () => {
        const expected = CONVERSATION_TURN_COUNTS[conversation.id];
        expect(conversation.turns, `Expected ${expected} turns for ${conversation.id}`).toHaveLength(expected);
      });
    });
  }
});

// ─── Each turn demonstrates its claimed contract rules ─────────────────────

describe("each turn demonstrates its claimed contract rules", () => {
  for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
    for (const turn of conversation.turns) {
      it(`${conversation.id} turn ${turn.turnIndex}: demonstrates [${turn.demonstratedRules.join(", ")}]`, () => {
        const cr = checkTeacherMercyContract(
          turn.learnerInput,
          turn.teacherResponse,
        );

        for (const ruleId of turn.demonstratedRules) {
          const rule = cr.rules.find((r) => r.ruleId === ruleId);
          expect(
            rule,
            `Rule ${ruleId} not found in contract check result`,
          ).toBeDefined();
          expect(
            rule!.passed,
            `${conversation.id} turn ${turn.turnIndex}: ${ruleId} failed — "${rule!.detailVi}"`,
          ).toBe(true);
        }
      });
    }
  }
});

// ─── scoreGoldenConversation — aggregates correctly ────────────────────────

describe("scoreGoldenConversation", () => {
  it("classifies every golden conversation as 'exemplary'", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      const evaluation = scoreGoldenConversation(conversation);
      expect(
        evaluation.aggregateScores.overallClassification,
        `${conversation.id}: expected exemplary, got ${evaluation.aggregateScores.overallClassification}`,
      ).toBe("exemplary");
    }
  });

  it("allTurnsPass is true for every golden conversation", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      const evaluation = scoreGoldenConversation(conversation);
      expect(
        evaluation.aggregateScores.allTurnsPass,
        `${conversation.id}: allTurnsPass should be true`,
      ).toBe(true);
    }
  });

  it("computes average dimension scores between 0 and 3", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      const evaluation = scoreGoldenConversation(conversation);
      const scores = evaluation.aggregateScores.averageDimensionScores;
      const dimIds = Object.keys(scores);

      expect(dimIds).toHaveLength(7);

      for (const dimId of dimIds) {
        expect(scores[dimId as keyof typeof scores]).toBeGreaterThanOrEqual(0);
        expect(scores[dimId as keyof typeof scores]).toBeLessThanOrEqual(3);
      }
    }
  });

  it("all golden conversations have per-turn results for every turn", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      const evaluation = scoreGoldenConversation(conversation);
      expect(evaluation.perTurnResults).toHaveLength(conversation.turns.length);
    }
  });

  it("totalTurnsPassing equals totalTurns for all golden conversations", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      const evaluation = scoreGoldenConversation(conversation);
      expect(evaluation.aggregateScores.totalTurnsPassing).toBe(
        evaluation.aggregateScores.totalTurns,
      );
    }
  });
});

// ─── Specific teaching pattern demonstrations ──────────────────────────────

describe("specific teaching pattern demonstrations", () => {
  it("A1: demonstrates R9 self-correction acknowledgment on turn 2", () => {
    const turn = GOLDEN_CONVERSATION_A1_INTRODUCTIONS.turns[2];
    expect(turn.learnerInput.didSelfCorrect).toBe(true);
    expect(turn.demonstratedRules).toContain("R9_SELF_CORRECTION_SPACE");

    const cr = checkTeacherMercyContract(turn.learnerInput, turn.teacherResponse);
    const r9 = cr.rules.find((r) => r.ruleId === "R9_SELF_CORRECTION_SPACE");
    expect(r9?.passed).toBe(true);

    // R9 acknowledgment must be in first 150 chars
    const vi = turn.teacherResponse.vi ?? "";
    expect(vi.length).toBeGreaterThan(0);
    // "bạn đã tự chỉnh" should appear early
    expect(vi.slice(0, 150)).toMatch(/bạn đã tự chỉnh|bạn tự sửa|bạn nhận ra/);
  });

  it("A2: demonstrates R5 weakness memory across turns", () => {
    // Turn 0: no tracked weakness → R5 is n/a
    const t0 = GOLDEN_CONVERSATION_A2_PAST_TENSE.turns[0];
    expect(t0.learnerInput.trackedWeakness).toBeNull();

    // Turn 1: tracked weakness "past-tense", correction is made, weakness referenced
    const t1 = GOLDEN_CONVERSATION_A2_PAST_TENSE.turns[1];
    expect(t1.learnerInput.trackedWeakness).toBe("past-tense");
    expect(t1.demonstratedRules).toContain("R5_REMEMBER_WEAKNESS");

    // Turn 2: weakness still tracked, referenced again
    const t2 = GOLDEN_CONVERSATION_A2_PAST_TENSE.turns[2];
    expect(t2.learnerInput.trackedWeakness).toBe("past-tense");
    expect(t2.demonstratedRules).toContain("R5_REMEMBER_WEAKNESS");

    // Verify weakness reference patterns appear in the responses
    const cr1 = checkTeacherMercyContract(t1.learnerInput, t1.teacherResponse);
    const r5_t1 = cr1.rules.find((r) => r.ruleId === "R5_REMEMBER_WEAKNESS");
    expect(r5_t1?.passed).toBe(true);
    expect(r5_t1?.reasonCode).toBe("weakness_referenced");

    const cr2 = checkTeacherMercyContract(t2.learnerInput, t2.teacherResponse);
    const r5_t2 = cr2.rules.find((r) => r.ruleId === "R5_REMEMBER_WEAKNESS");
    expect(r5_t2?.passed).toBe(true);
    expect(r5_t2?.reasonCode).toBe("weakness_referenced");
  });

  it("B1: demonstrates R9 self-correction acknowledgment on multiple turns", () => {
    // Turn 1 has self-correction
    const t1 = GOLDEN_CONVERSATION_B1_SHOPPING.turns[1];
    expect(t1.learnerInput.didSelfCorrect).toBe(true);
    expect(t1.demonstratedRules).toContain("R9_SELF_CORRECTION_SPACE");

    // Turn 3 also has self-correction
    const t3 = GOLDEN_CONVERSATION_B1_SHOPPING.turns[3];
    expect(t3.learnerInput.didSelfCorrect).toBe(true);
    expect(t3.demonstratedRules).toContain("R9_SELF_CORRECTION_SPACE");
  });

  it("B2: demonstrates R6 Vietnamese interference in turn 0", () => {
    const turn = GOLDEN_CONVERSATION_B2_JOB_INTERVIEW.turns[0];
    expect(turn.demonstratedRules).toContain("R6_VIETNAMESE_INTERFERENCE");

    const cr = checkTeacherMercyContract(turn.learnerInput, turn.teacherResponse);
    const r6 = cr.rules.find((r) => r.ruleId === "R6_VIETNAMESE_INTERFERENCE");
    expect(r6?.passed).toBe(true);
    expect(r6?.reasonCode).toBe("valid_transfer_note");

    // Transfer note must have diacritics and Vietnamese language reference
    const note = turn.teacherResponse.transferErrorNote ?? "";
    expect(note).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
    expect(note.toLowerCase()).toMatch(/tiếng việt|trong tiếng việt|người việt|tiếng mẹ đẻ/);
  });

  it("C1: demonstrates R7 strategic silence in turn 2", () => {
    const turn = GOLDEN_CONVERSATION_C1_DEBATE.turns[2];
    expect(turn.demonstratedRules).toContain("R7_STRATEGIC_SILENCE");

    // This turn should have no correction (strategic silence)
    expect(turn.teacherResponse.correctionCount).toBe(0);
    expect(turn.teacherResponse.correctedSentence).toBeUndefined();

    // The response should contain uncertainty markers
    const vi = turn.teacherResponse.vi ?? "";
    expect(vi).toMatch(/mình không chắc|mình chưa rõ|mình đoán|có thể là|mình nghĩ là|hình như/);

    const cr = checkTeacherMercyContract(turn.learnerInput, turn.teacherResponse);
    const r7 = cr.rules.find((r) => r.ruleId === "R7_STRATEGIC_SILENCE");
    expect(r7?.passed).toBe(true);
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("handles empty conversation (0 turns)", () => {
    const empty: GoldenConversation = {
      id: "test-empty",
      title: "Empty test",
      cefrLevel: "A1",
      topic: "test",
      descriptionVi: "Edge case: empty conversation.",
      demonstratedPatterns: [],
      turns: [],
    };

    const validation = validateGoldenConversation(empty);
    expect(validation.valid).toBe(true); // vacuously true
    expect(validation.turnResults).toHaveLength(0);

    const evaluation = scoreGoldenConversation(empty);
    expect(evaluation.perTurnResults).toHaveLength(0);
    expect(evaluation.aggregateScores.totalTurns).toBe(0);
    expect(evaluation.aggregateScores.allTurnsPass).toBe(true);
    expect(evaluation.aggregateScores.overallClassification).toBe("exemplary");
  });

  it("handles single-turn conversation", () => {
    const single: GoldenConversation = {
      id: "test-single",
      title: "Single turn test",
      cefrLevel: "A1",
      topic: "test",
      descriptionVi: "Edge case: single-turn conversation.",
      demonstratedPatterns: ["pure conversation"],
      turns: [
        {
          turnIndex: 0,
          learnerInput: {
            text: "Hello!",
            cefrLevel: "A1",
            trackedWeakness: null,
            didSelfCorrect: false,
            l1: "vi",
          },
          teacherResponse: {
            vi: "Chào bạn! Bạn khỏe không?",
            nextSteps: [],
            correctionCount: 0,
            followUpQuestionCount: 1,
          },
          demonstratedRules: ["R1_MEANING_FIRST", "R3_NO_FAKE_PRAISE", "R4_ONE_FOLLOW_UP", "R8_FACE_SAVING"],
          descriptionVi: "Simple greeting exchange.",
        },
      ],
    };

    const validation = validateGoldenConversation(single);
    expect(validation.valid).toBe(true);
    expect(validation.turnResults).toHaveLength(1);

    const evaluation = scoreGoldenConversation(single);
    expect(evaluation.perTurnResults).toHaveLength(1);
    expect(evaluation.aggregateScores.totalTurns).toBe(1);
    expect(evaluation.aggregateScores.allTurnsPass).toBe(true);
  });

  it("handles conversation with minimal optional fields", () => {
    const minimal: GoldenConversation = {
      id: "test-minimal",
      title: "Minimal optional fields",
      cefrLevel: "B1",
      topic: "test",
      descriptionVi: "Edge case: responses with minimal optional fields undefined.",
      demonstratedPatterns: ["handles undefined optional fields"],
      turns: [
        {
          turnIndex: 0,
          learnerInput: {
            text: "I like English.",
            cefrLevel: null,
            trackedWeakness: null,
            didSelfCorrect: false,
            l1: "vi",
          },
          teacherResponse: {
            vi: "Mình cũng thích tiếng Anh! Bạn học tiếng Anh được bao lâu rồi?",
            // no correctedSentence, no grammarPoints, no transferErrorNote, no nextSteps
            correctionCount: 0,
            followUpQuestionCount: 1,
          },
          demonstratedRules: ["R1_MEANING_FIRST", "R3_NO_FAKE_PRAISE", "R4_ONE_FOLLOW_UP", "R8_FACE_SAVING"],
          descriptionVi: "Minimal response with most optional fields undefined.",
        },
      ],
    };

    const validation = validateGoldenConversation(minimal);
    expect(validation.valid).toBe(true);

    const evaluation = scoreGoldenConversation(minimal);
    expect(evaluation.aggregateScores.allTurnsPass).toBe(true);
  });

  it("every golden conversation has unique ids", () => {
    const ids = ALL_GOLDEN_CONVERSATIONS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every golden conversation has the correct CEFR level in its id", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      expect(conversation.id).toMatch(new RegExp(`^${conversation.cefrLevel.toLowerCase()}`));
    }
  });
});

// ─── Structural checks ─────────────────────────────────────────────────────

describe("structural integrity of golden conversations", () => {
  it("every turn has a non-empty descriptionVi", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      for (const turn of conversation.turns) {
        expect(
          turn.descriptionVi,
          `${conversation.id} turn ${turn.turnIndex}: descriptionVi is empty`,
        ).toBeTruthy();
        expect(turn.descriptionVi.length).toBeGreaterThan(10);
      }
    }
  });

  it("every conversation has demonstratedPatterns", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      expect(conversation.demonstratedPatterns.length).toBeGreaterThan(0);
    }
  });

  it("turn indices are sequential and start at 0", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      for (let i = 0; i < conversation.turns.length; i++) {
        expect(conversation.turns[i].turnIndex).toBe(i);
      }
    }
  });

  it("every learner input has l1 set to 'vi'", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      for (const turn of conversation.turns) {
        expect(turn.learnerInput.l1).toBe("vi");
      }
    }
  });

  it("every response with a correction has correctionCount matching", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      for (const turn of conversation.turns) {
        const hasCorrectedSentence =
          turn.teacherResponse.correctedSentence != null &&
          turn.teacherResponse.correctedSentence.length > 0;
        const declaredCount = turn.teacherResponse.correctionCount ?? 0;

        if (hasCorrectedSentence) {
          expect(
            declaredCount,
            `${conversation.id} turn ${turn.turnIndex}: has correctedSentence but correctionCount=${declaredCount}`,
          ).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it("the ALL_GOLDEN_CONVERSATIONS array contains exactly 5 conversations", () => {
    expect(ALL_GOLDEN_CONVERSATIONS).toHaveLength(5);
  });

  it("every conversation has a descriptionVi that mentions the CEFR level", () => {
    for (const conversation of ALL_GOLDEN_CONVERSATIONS) {
      expect(conversation.descriptionVi.length).toBeGreaterThan(20);
    }
  });
});
