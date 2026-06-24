import { describe, expect, it } from "vitest";
import {
  checkTeacherMercyContract,
  checkCorrectionContract,
  checkConversationContract,
  checkR1_MeaningFirst,
  checkR2_OneCorrectionMax,
  checkR3_NoFakePraise,
  checkR4_OneFollowUp,
  checkR5_RememberWeakness,
  checkR6_VietnameseInterference,
  checkR7_StrategicSilence,
  checkR8_FaceSaving,
  checkR9_SelfCorrectionSpace,
  checkR10_NextPracticeWhenHelpful,
  TEACHER_MERCY_CONTRACT_CATALOG,
  type ContractLearnerInput,
  type ContractTutorResponse,
} from "../teacherMercyContract";

// ─── Test Fixtures ──────────────────────────────────────────────────────

function defaultLearner(input: Partial<ContractLearnerInput> = {}): ContractLearnerInput {
  return {
    text: "I go to market yesterday.",
    cefrLevel: "A2",
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
    ...input,
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

// ─── R1 — Meaning First ─────────────────────────────────────────────────

describe("R1 — Meaning First", () => {
  it("passes when acknowledgment comes before correction", () => {
    const result = checkR1_MeaningFirst(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("acknowledgment_before_correction");
  });

  it("fails when correction comes before any acknowledgment", () => {
    const result = checkR1_MeaningFirst(
      defaultLearner(),
      goodResponse({
        vi: "🔍 Bạn viết: \"I go to market.\" 💡 Gợi ý: \"I went to the market.\" Động từ cần chia quá khứ.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("correction_without_acknowledgment");
  });

  it("fails when correction appears before acknowledgment in response", () => {
    const result = checkR1_MeaningFirst(
      defaultLearner(),
      goodResponse({
        vi: "💡 Gợi ý: \"I went.\" — đây là cách nói đúng. Mình hiểu bạn muốn nói về hôm qua.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("correction_before_acknowledgment");
  });

  it("passes when there are no correction markers (pure conversation)", () => {
    const result = checkR1_MeaningFirst(
      defaultLearner(),
      goodResponse({
        vi: "Mình hiểu bạn muốn kể về ngày hôm qua. Bạn đã làm gì thú vị không?",
        correctedSentence: undefined,
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_correction_markers");
  });
});

// ─── R2 — One Correction Max ────────────────────────────────────────────

describe("R2 — One Correction Max", () => {
  it("passes with exactly one correction block", () => {
    const result = checkR2_OneCorrectionMax(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("single_correction");
  });

  it("passes with no corrections (conversation mode)", () => {
    const result = checkR2_OneCorrectionMax(
      defaultLearner(),
      goodResponse({
        vi: "Hay quá, bạn kể tiếp đi!",
        correctedSentence: undefined,
        correctionCount: 0,
        grammarPoints: [],
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_correction_needed");
  });

  it("fails with two correction blocks", () => {
    const result = checkR2_OneCorrectionMax(
      defaultLearner(),
      goodResponse({
        vi: "🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" 🔍 Bạn viết: \"to market.\" 💡 Gợi ý: \"to the market.\"",
        correctionCount: 2,
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("multiple_correction_blocks");
  });

  it("fails when grammarPoints exceed 3", () => {
    const result = checkR2_OneCorrectionMax(
      defaultLearner(),
      goodResponse({
        grammarPoints: ["past tense", "articles", "prepositions", "word order"],
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("too_many_grammar_points");
  });

  it("passes with up to 3 grammar points", () => {
    const result = checkR2_OneCorrectionMax(
      defaultLearner(),
      goodResponse({
        grammarPoints: ["past tense", "articles", "prepositions"],
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R3 — No Fake Praise ────────────────────────────────────────────────

describe("R3 — No Fake Praise", () => {
  it("passes with appropriate encouragement", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
  });

  it("fails when response contains 'hoàn hảo'", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse({
        vi: "Câu này hoàn hảo! Bạn giỏi quá.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("inflated_praise_detected");
  });

  it("fails when response contains 'xuất sắc'", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse({
        vi: "Xuất sắc! Bạn nói rất tốt.",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("fails when response contains 'perfect'", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse({
        vi: "Perfect! That was flawless.",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("fails when response claims native-like pronunciation", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse({
        vi: "Phát âm của bạn chuẩn như người bản xứ!",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("allows genuine encouragement words like 'tốt', 'rõ ràng', 'tự nhiên'", () => {
    const result = checkR3_NoFakePraise(
      defaultLearner(),
      goodResponse({
        vi: "Rất tốt! Câu này nghe rất tự nhiên và rõ ràng.",
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R4 — One Follow-Up ─────────────────────────────────────────────────

describe("R4 — One Follow-Up", () => {
  it("passes with exactly one question mark", () => {
    const result = checkR4_OneFollowUp(
      defaultLearner(),
      goodResponse({
        vi: "Mình hiểu rồi. Bạn đã mua gì ở chợ hôm qua?",
        followUpQuestionCount: 1,
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("single_question");
  });

  it("passes with zero questions (answering learner's question)", () => {
    const result = checkR4_OneFollowUp(
      defaultLearner(),
      goodResponse({
        vi: "Thì quá khứ đơn dùng để nói về hành động đã xảy ra và kết thúc trong quá khứ.",
        followUpQuestionCount: 0,
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_question_answer_mode");
  });

  it("fails with multiple question marks", () => {
    const result = checkR4_OneFollowUp(
      defaultLearner(),
      goodResponse({
        vi: "Bạn đã đi đâu? Mua gì? Có vui không?",
        followUpQuestionCount: 3,
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("multiple_questions");
  });

  it("detects question barrage even without explicit count", () => {
    const result = checkR4_OneFollowUp(
      defaultLearner(),
      goodResponse({
        vi: "Bạn thích món đó không? Tại sao? Kể thêm đi?",
        followUpQuestionCount: undefined, // let it count markers
      }),
    );
    expect(result.passed).toBe(false);
  });
});

// ─── R5 — Remember Weakness ─────────────────────────────────────────────

describe("R5 — Remember Weakness", () => {
  it("passes when no weakness is tracked yet", () => {
    const result = checkR5_RememberWeakness(
      defaultLearner({ trackedWeakness: null }),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_tracked_weakness");
  });

  it("passes when correction references the tracked weakness", () => {
    const result = checkR5_RememberWeakness(
      defaultLearner({ trackedWeakness: "past-tense" }),
      goodResponse({
        vi: "Đây là điểm mình đang theo dõi — thì quá khứ. Như lần trước, bạn cần nhớ chia động từ khi có 'yesterday'.",
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("weakness_referenced");
  });

  it("passes when tracked weakness is not relevant to this correction", () => {
    const result = checkR5_RememberWeakness(
      defaultLearner({ trackedWeakness: "articles" }),
      goodResponse(), // this response corrects past tense, not articles
    );
    // R5 is permissive — doesn't fail if weakness is irrelevant
    expect(result.passed).toBe(true);
  });

  it("passes when correction references weakness with 'vẫn là'", () => {
    const result = checkR5_RememberWeakness(
      defaultLearner({ trackedWeakness: "past-tense" }),
      goodResponse({
        vi: "Vẫn là thì quá khứ — lần này bạn dùng đúng 'went' rồi, nhưng còn 'yesterday' ở cuối câu cần 'the' trước 'market'.",
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R6 — Vietnamese Interference ───────────────────────────────────────

describe("R6 — Vietnamese Interference", () => {
  it("passes when no transfer note is present", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({ transferErrorNote: undefined }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_transfer_note_needed");
  });

  it("passes with a valid Vietnamese transfer note", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({
        transferErrorNote: "Trong tiếng Việt, bạn nói 'Tôi đi chợ hôm qua' không cần đổi động từ, nhưng tiếng Anh cần chia thì quá khứ.",
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("valid_transfer_note");
  });

  it("fails when transfer note doesn't contain Vietnamese content", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({
        transferErrorNote: "In English, verbs change form to show past tense.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("transfer_note_english_only");
  });

  it("fails when transfer note is English-only (no Vietnamese diacritics)", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({
        transferErrorNote: "Vietnamese does not have tense marking on verbs, so learners often forget past tense.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("transfer_note_english_only");
  });

  it("fails when transfer note has Vietnamese text but no L1 reference", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({
        transferErrorNote: "Động từ cần được chia ở thì quá khứ khi có yesterday.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("transfer_note_missing_vietnamese_reference");
  });

  it("passes with empty transfer note", () => {
    const result = checkR6_VietnameseInterference(
      defaultLearner(),
      goodResponse({ transferErrorNote: "" }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R7 — Strategic Silence ─────────────────────────────────────────────

describe("R7 — Strategic Silence", () => {
  it("passes with confident correction", () => {
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("confident_correction");
  });

  it("passes with uncertainty but no correction", () => {
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse({
        vi: "Mình không chắc lắm về cách dùng từ này. Bạn có thể nói lại theo cách khác không?",
        correctedSentence: undefined,
        correctionCount: 0,
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_correction_or_uncertainty");
  });

  it("fails when correction co-occurs with 'mình không chắc'", () => {
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse({
        vi: "Mình không chắc lắm, nhưng có lẽ câu đúng là: 💡 Gợi ý: \"I went.\"",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("correction_with_uncertainty");
  });

  it("fails when correction co-occurs with 'hình như'", () => {
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse({
        vi: "Hình như câu này cần sửa: 💡 Gợi ý: \"I have been.\"",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("fails when correction co-occurs with 'mình đoán'", () => {
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse({
        vi: "Mình đoán câu đúng là 'I have gone'. 💡 Gợi ý: \"I have gone.\"",
      }),
    );
    expect(result.passed).toBe(false);
  });
});

// ─── R8 — Face Saving ───────────────────────────────────────────────────

describe("R8 — Face Saving", () => {
  it("passes with face-saving language", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
  });

  it("fails when 'bạn sai' appears", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse({
        vi: "Bạn sai rồi — câu này phải dùng 'went'.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("face_threatening_language");
  });

  it("fails when 'sai rồi' appears", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse({
        vi: "Sai rồi! Phải là 'I went' mới đúng.",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("fails when 'you are wrong' appears", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse({
        vi: "You are wrong. It should be 'went'.",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("fails when 'lỗi cơ bản' shames the learner", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse({
        vi: "Đây là lỗi cơ bản — đáng lẽ phải biết rồi.",
      }),
    );
    expect(result.passed).toBe(false);
  });

  it("allows 'chưa tự nhiên lắm' as face-saving correction", () => {
    const result = checkR8_FaceSaving(
      defaultLearner(),
      goodResponse({
        vi: "Câu này chưa tự nhiên lắm. Để mình gợi ý cách nói khác nhé.",
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R9 — Self-Correction Space ─────────────────────────────────────────

describe("R9 — Self-Correction Space", () => {
  it("passes when learner did not self-correct", () => {
    const result = checkR9_SelfCorrectionSpace(
      defaultLearner({ didSelfCorrect: false }),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_self_correction");
  });

  it("passes when self-correction is acknowledged", () => {
    const result = checkR9_SelfCorrectionSpace(
      defaultLearner({ didSelfCorrect: true }),
      goodResponse({
        vi: "Đúng rồi, bạn đã tự sửa rất tốt! 'I went' là chính xác. Mình chỉ thêm một chút: nhớ thêm 'the' trước 'market' nhé.",
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("self_correction_acknowledged");
  });

  it("fails when learner self-corrected but Mercy ignores it", () => {
    const result = checkR9_SelfCorrectionSpace(
      defaultLearner({ didSelfCorrect: true }),
      goodResponse({
        vi: "🔍 Bạn viết: \"I buy.\" 💡 Gợi ý: \"I bought.\" Nhớ dùng quá khứ với 'yesterday'.",
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("self_correction_not_acknowledged");
  });

  it("acknowledges self-correction with 'bạn đã tự chỉnh'", () => {
    const result = checkR9_SelfCorrectionSpace(
      defaultLearner({ didSelfCorrect: true }),
      goodResponse({
        vi: "Bạn đã tự chỉnh từ 'buy' thành 'bought' — rất tốt! Mình chỉ thêm 'the' vào trước 'market' cho tự nhiên hơn.",
      }),
    );
    expect(result.passed).toBe(true);
  });

  it("acknowledges self-correction with 'chính xác, bạn đã tự'", () => {
    const result = checkR9_SelfCorrectionSpace(
      defaultLearner({ didSelfCorrect: true }),
      goodResponse({
        vi: "Chính xác, bạn đã tự sửa đúng rồi. 'Went' mới là quá khứ của 'go'.",
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── R10 — Next Practice When Helpful ────────────────────────────────────

describe("R10 — Next Practice When Helpful", () => {
  it("passes with one next step", () => {
    const result = checkR10_NextPracticeWhenHelpful(
      defaultLearner(),
      goodResponse({
        nextSteps: [{ labelVi: "Thử câu khác" }],
      }),
    );
    expect(result.passed).toBe(true);
  });

  it("passes with zero next steps", () => {
    const result = checkR10_NextPracticeWhenHelpful(
      defaultLearner(),
      goodResponse({
        nextSteps: [],
      }),
    );
    expect(result.passed).toBe(true);
    expect(result.reasonCode).toBe("no_next_steps_conversation_flow");
  });

  it("fails with more than 3 next steps", () => {
    const result = checkR10_NextPracticeWhenHelpful(
      defaultLearner(),
      goodResponse({
        nextSteps: [
          { labelVi: "Thử câu khác" },
          { labelVi: "Luyện nói" },
          { labelVi: "Học ngữ pháp" },
          { labelVi: "Làm bài tập" },
        ],
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("too_many_next_steps");
  });

  it("fails when a next step has an empty label", () => {
    const result = checkR10_NextPracticeWhenHelpful(
      defaultLearner(),
      goodResponse({
        nextSteps: [
          { labelVi: "Thử câu khác" },
          { labelVi: "" },
        ],
      }),
    );
    expect(result.passed).toBe(false);
    expect(result.reasonCode).toBe("next_step_missing_label");
  });

  it("passes with up to 3 valid next steps", () => {
    const result = checkR10_NextPracticeWhenHelpful(
      defaultLearner(),
      goodResponse({
        nextSteps: [
          { labelVi: "Thử câu khác" },
          { labelVi: "Luyện nói" },
          { labelVi: "Học ngữ pháp" },
        ],
      }),
    );
    expect(result.passed).toBe(true);
  });
});

// ─── Composite Checks ───────────────────────────────────────────────────

describe("checkTeacherMercyContract — full contract", () => {
  it("passes a well-formed correction response", () => {
    const result = checkTeacherMercyContract(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.passed).toBe(true);
    expect(result.failedCount).toBe(0);
    expect(result.rules).toHaveLength(10);
  });

  it("fails a response with multiple violations", () => {
    const result = checkTeacherMercyContract(
      defaultLearner({ didSelfCorrect: true }),
      {
        vi: "Sai rồi! Bạn viết sai hoàn toàn. 🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" 🔍 Bạn viết: \"market.\" 💡 Gợi ý: \"the market.\" Bạn có hiểu không? Tại sao sai? Kể thêm đi?",
        correctedSentence: "I went.",
        grammarPoints: ["past tense", "articles", "prepositions", "word order", "subject-verb agreement"],
        nextSteps: [
          { labelVi: "A" },
          { labelVi: "B" },
          { labelVi: "C" },
          { labelVi: "D" },
        ],
      },
    );

    expect(result.passed).toBe(false);
    // Should fail: R2 (multiple corrections), R4 (multiple questions), R8 (face-threatening), R9 (ignored self-correction), R10 (too many next steps)
    expect(result.failedCount).toBeGreaterThanOrEqual(4);
    const failedIds = result.rules.filter((r) => !r.passed).map((r) => r.ruleId);
    expect(failedIds).toContain("R2_ONE_CORRECTION_MAX");
    expect(failedIds).toContain("R8_FACE_SAVING");
    expect(failedIds).toContain("R9_SELF_CORRECTION_SPACE");
    expect(failedIds).toContain("R10_NEXT_PRACTICE_WHEN_HELPFUL");
  });

  it("passes a pure conversation response with no corrections", () => {
    const result = checkTeacherMercyContract(
      defaultLearner({ trackedWeakness: "past-tense" }),
      {
        vi: "Mình hiểu, cuối tuần của bạn nghe vui quá! Bạn đã đi đâu nữa không?",
        nextSteps: [],
        correctionCount: 0,
        followUpQuestionCount: 1,
      },
    );
    expect(result.passed).toBe(true);
  });

  it("reports failed rule count and summary in Vietnamese", () => {
    const result = checkTeacherMercyContract(
      defaultLearner(),
      {
        vi: "Hoàn hảo! Xuất sắc! Bạn sai rồi. Bạn có hiểu không? Tại sao? Khi nào?",
        nextSteps: [],
        followUpQuestionCount: 3,
      },
    );

    expect(result.passed).toBe(false);
    expect(result.failedCount).toBeGreaterThanOrEqual(2);
    expect(result.summaryVi).toContain("quy tắc không đạt");
  });
});

// ─── Mode-Specific Contracts ─────────────────────────────────────────────

describe("checkCorrectionContract — correction mode", () => {
  it("validates correction-specific rules (6 rules)", () => {
    const result = checkCorrectionContract(
      defaultLearner(),
      goodResponse(),
    );
    expect(result.rules).toHaveLength(6);
    expect(result.passed).toBe(true);
    const ruleIds = result.rules.map((r) => r.ruleId);
    expect(ruleIds).toContain("R1_MEANING_FIRST");
    expect(ruleIds).toContain("R2_ONE_CORRECTION_MAX");
    expect(ruleIds).toContain("R3_NO_FAKE_PRAISE");
    expect(ruleIds).toContain("R6_VIETNAMESE_INTERFERENCE");
    expect(ruleIds).toContain("R7_STRATEGIC_SILENCE");
    expect(ruleIds).toContain("R8_FACE_SAVING");
    // Should NOT include conversation rules
    expect(ruleIds).not.toContain("R4_ONE_FOLLOW_UP");
  });
});

describe("checkConversationContract — conversation mode", () => {
  it("validates conversation-specific rules (7 rules)", () => {
    const result = checkConversationContract(
      defaultLearner({ trackedWeakness: "articles" }),
      {
        vi: "Chuyện đó thú vị thật! Bạn thấy thế nào về trải nghiệm đó?",
        nextSteps: [],
        followUpQuestionCount: 1,
      },
    );
    expect(result.rules).toHaveLength(7);
    expect(result.passed).toBe(true);
    const ruleIds = result.rules.map((r) => r.ruleId);
    expect(ruleIds).toContain("R4_ONE_FOLLOW_UP");
    expect(ruleIds).toContain("R5_REMEMBER_WEAKNESS");
    expect(ruleIds).toContain("R9_SELF_CORRECTION_SPACE");
    expect(ruleIds).toContain("R10_NEXT_PRACTICE_WHEN_HELPFUL");
    // Should NOT include correction-heavy rules
    expect(ruleIds).not.toContain("R2_ONE_CORRECTION_MAX");
    expect(ruleIds).not.toContain("R7_STRATEGIC_SILENCE");
  });
});

// ─── Contract Catalog ────────────────────────────────────────────────────

describe("TEACHER_MERCY_CONTRACT_CATALOG", () => {
  it("has exactly 10 rules", () => {
    expect(TEACHER_MERCY_CONTRACT_CATALOG).toHaveLength(10);
  });

  it("every rule has a unique id", () => {
    const ids = TEACHER_MERCY_CONTRACT_CATALOG.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rule has Vietnamese and English titles", () => {
    for (const rule of TEACHER_MERCY_CONTRACT_CATALOG) {
      expect(rule.titleVi).toBeTruthy();
      expect(rule.titleEn).toBeTruthy();
      expect(rule.descriptionVi).toBeTruthy();
      expect(rule.category).toBeTruthy();
    }
  });

  it("covers all five categories", () => {
    const categories = new Set(TEACHER_MERCY_CONTRACT_CATALOG.map((r) => r.category));
    expect(categories).toContain("warmth");
    expect(categories).toContain("correction");
    expect(categories).toContain("conversation");
    expect(categories).toContain("memory");
    expect(categories).toContain("interference");
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles empty vi response gracefully", () => {
    const result = checkTeacherMercyContract(
      defaultLearner(),
      { vi: "", nextSteps: [] },
    );
    // R1: no markers found → passes but with no_correction_markers
    // R2-R8: mostly pass on empty
    // R9: no self-correction → passes
    // R10: no nextSteps → passes
    expect(result.rules).toHaveLength(10);
    // All rules should not throw, just return results
    for (const rule of result.rules) {
      expect(rule.ruleId).toBeTruthy();
      expect(typeof rule.passed).toBe("boolean");
      expect(rule.detailVi).toBeTruthy();
      expect(rule.reasonCode).toBeTruthy();
    }
  });

  it("handles undefined optional fields", () => {
    const result = checkTeacherMercyContract(
      defaultLearner({ cefrLevel: null, trackedWeakness: null }),
      {
        vi: "Mình hiểu rồi.",
      },
    );
    expect(result.rules).toHaveLength(10);
  });

  it("does not flag 'mình không chắc' in quotes as R7 violation", () => {
    // If Mercy quotes the learner saying "mình không chắc", that's not her uncertainty
    const result = checkR7_StrategicSilence(
      defaultLearner(),
      goodResponse({
        vi: "Bạn nói là 'mình không chắc' — ý bạn là bạn chưa tự tin về câu này? Mình sẽ giúp bạn.",
        correctedSentence: undefined,
      }),
    );
    // This is a subtle case — the current implementation doesn't distinguish
    // quoted uncertainty from Mercy's own. This test documents the current behavior.
    expect(result.passed).toBe(true); // no correction present
  });
});
