/**
 * Teacher Mercy Rubric — Fixture Examples
 *
 * Annotated examples of rubric evaluations covering all 7 dimensions.
 * Each fixture includes the learner input, the tutor response, the expected
 * rubric classification, and per-dimension expected scores.
 *
 * These fixtures are used by teacherMercyRubric.test.ts to validate the
 * rubric evaluator, and can be used as reference examples for future steps
 * when building prompts or evaluators.
 *
 * IMPORTANT: Acknowledgment markers in the contract (teacherMercyContract.ts)
 * are CASE-SENSITIVE. "Mình hiểu" (capital M) does NOT match "mình hiểu".
 * Use "bạn muốn nói" or "ý của bạn" or lowercase "mình hiểu" in fixtures.
 */

import type {
  ContractLearnerInput,
  ContractTutorResponse,
} from "../../teacherMercyContract";

// ─── Fixture Type ───────────────────────────────────────────────────────

export type RubricFixture = {
  /** Human-readable name describing the scenario. */
  name: string;
  /** What this fixture proves about the rubric. */
  proves: string;
  learnerInput: ContractLearnerInput;
  response: ContractTutorResponse;
  /** Expected overall classification. */
  expectedClassification: string;
  /** Expected per-dimension scores (dimensionId → score). */
  expectedDimensionScores: Record<string, number>;
};

// ─── Fixture Helpers ────────────────────────────────────────────────────

function learner(overrides: Partial<ContractLearnerInput> = {}): ContractLearnerInput {
  return {
    text: "Yesterday I go to market and buy vegetable.",
    cefrLevel: "A2",
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
    ...overrides,
  };
}

// ─── Fixture 1 — Exemplary Correction ───────────────────────────────────
//
// A well-formed correction response that should pass all dimensions.
// Proves: meaning-first, one correction, no fake praise, Vietnamese
// interference explanation, face-saving language, weakness memory,
// one follow-up.

export const FIXTURE_EXEMPLARY_CORRECTION: RubricFixture = {
  name: "Exemplary correction — past tense with Vietnamese interference note",
  proves: "All 7 dimensions score 3/3 when Mercy responds perfectly",
  learnerInput: learner({ trackedWeakness: "past-tense" }),
  response: {
    // NOTE: "bạn muốn nói" is an acknowledgment marker (case-sensitive match).
    // "bạn muốn kể" would NOT match — test the contract, not our assumptions.
    vi: "bạn muốn nói là hôm qua bạn đi chợ mua rau phải không? Mình hiểu rồi. 🔍 Bạn viết: \"Yesterday I go to market and buy vegetable.\" 💡 Gợi ý: \"Yesterday I went to the market and bought vegetables.\" 📝 Giải thích: Khi có 'yesterday', cả 'go' và 'buy' cần ở quá khứ — 'went' và 'bought'. Ngoài ra 'vegetable' cần số nhiều 'vegetables'. Như lần trước mình đã lưu ý, thì quá khứ là điểm bạn cần chú ý. Bạn thử đặt một câu tương tự với 'last week' nhé?",
    correctedSentence: "Yesterday I went to the market and bought vegetables.",
    grammarPoints: ["past tense irregular verbs", "plural nouns"],
    transferErrorNote: "Trong tiếng Việt, bạn nói 'Hôm qua tôi đi chợ mua rau' — động từ không thay đổi. Nhưng tiếng Anh bắt buộc chia thì quá khứ khi có 'yesterday'.",
    nextSteps: [{ labelVi: "Thử câu tương tự với 'last week'" }],
    correctionCount: 1,
    followUpQuestionCount: 1,
  },
  expectedClassification: "exemplary",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 2 — Pure Conversation (No Correction) ──────────────────────
//
// A conversational response with no corrections. R2 and R7 are trivially
// satisfied because no correction is present.
// Proves: conversation mode scores well when no correction is attempted.

export const FIXTURE_PURE_CONVERSATION: RubricFixture = {
  name: "Pure conversation — no correction attempted",
  proves: "Rubric handles conversation-only responses (no correction markers)",
  learnerInput: learner({ trackedWeakness: "articles" }),
  response: {
    vi: "Cuối tuần của bạn nghe thú vị quá! Bạn có gặp ai đặc biệt ở đó không?",
    nextSteps: [],
    correctionCount: 0,
    followUpQuestionCount: 1,
  },
  expectedClassification: "exemplary",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 3 — Fake Praise Failure ────────────────────────────────────
//
// Mercy calls a simple A1 sentence "hoàn hảo" — safety and warmth fail.
// Proves: R3 violation triggers safety=failing, overall classification=failing.
// Note: specificity stays at 3 because R6 and R8 are not violated by fake praise.

export const FIXTURE_FAKE_PRAISE_FAILURE: RubricFixture = {
  name: "Fake praise — 'hoàn hảo' for a simple sentence",
  proves: "Safety dimension catches inflated praise and classifies as 'failing'",
  learnerInput: learner(),
  response: {
    vi: "Hoàn hảo! Bạn giỏi quá! Câu này tuyệt vời.",
    nextSteps: [],
    correctionCount: 0,
    followUpQuestionCount: 0,
  },
  expectedClassification: "failing",
  expectedDimensionScores: {
    warmth: 1,       // R3 fails, R8 passes → 1/2
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,   // R6 and R8 both pass (no transfer note needed, no face threat)
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 2,        // R3 fails, R7 passes, R8 passes → 2/3 = 67% → score 2
  },
};

// ─── Fixture 4 — Face-Threatening Language ──────────────────────────────
//
// Mercy says "bạn sai rồi" — face-saving fails, safety fails.
// Proves: R8 violation makes rubric classify as 'failing'.

export const FIXTURE_FACE_THREATENING: RubricFixture = {
  name: "Face-threatening — 'bạn sai rồi' shames the learner",
  proves: "Rubric classifies face-threatening language as 'failing'",
  learnerInput: learner(),
  response: {
    vi: "Bạn sai rồi! Câu này không đúng. Phải là 'I went' mới đúng.",
    correctedSentence: "I went.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
    followUpQuestionCount: 0,
  },
  expectedClassification: "failing",
  expectedDimensionScores: {
    warmth: 1,        // R3 passes, R8 fails → 1/2
    accuracy: 3,
    correction_timing: 3,
    specificity: 1,   // R6 passes (no note), R8 fails → 1/2
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 2,        // R3 passes, R7 passes, R8 fails → 2/3 = 67% → score 2
  },
};

// ─── Fixture 5 — Multiple Corrections + Question Barrage ─────────────────
//
// Mercy corrects two things and asks three questions.
// Proves: accuracy, correction_timing, and follow_up_quality all score low.
// R2 fails (multiple correction blocks), R4 fails (multiple questions),
// R10 passes (no next steps → valid). R7 passes (no uncertainty).

export const FIXTURE_OVER_CORRECTION: RubricFixture = {
  name: "Over-correction — two corrections + three questions",
  proves: "Accuracy, correction_timing, and follow_up_quality detect over-correction",
  learnerInput: learner(),
  response: {
    vi: "🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" 🔍 Bạn viết: \"to market.\" 💡 Gợi ý: \"to the market.\" Bạn hiểu chưa? Có khó không? Bạn thử lại nhé?",
    correctedSentence: "I went to the market.",
    grammarPoints: ["past tense", "articles", "prepositions", "word order"],
    correctionCount: 2,
    followUpQuestionCount: 3,
  },
  expectedClassification: "needs_revision",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 1,             // R2 fails, R7 passes → 1/2 = 50% → score 1
    correction_timing: 0,    // R1 fails (no ack), R2 fails (multiple blocks + too many grammar points) → 0/2 → score 0
    specificity: 3,
    follow_up_quality: 2,    // R4 fails (3 questions), R9 passes (no self-correction), R10 passes (no next steps) → 2/3 = 67% → score 2
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 6 — Strategic Silence Violation ─────────────────────────────
//
// Mercy corrects while saying "mình không chắc" — violates R7.
// Proves: accuracy dimension catches uncertainty-with-correction.
// R1 also fails because there's no acknowledgment marker before correction.

export const FIXTURE_UNCERTAIN_CORRECTION: RubricFixture = {
  name: "Uncertain correction — 'mình không chắc' + correction",
  proves: "Rubric catches strategic silence violation",
  learnerInput: learner(),
  response: {
    vi: "Mình không chắc lắm, nhưng có lẽ câu đúng là: 💡 Gợi ý: \"I have went.\"",
    correctedSentence: "I have went.",
    correctionCount: 1,
    followUpQuestionCount: 0,
  },
  expectedClassification: "failing",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 1,             // R2 passes (1 correction), R7 fails → 1/2
    correction_timing: 1,    // R1 fails (no ack), R2 passes → 1/2
    specificity: 3,
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 2,               // R3 passes, R7 fails, R8 passes → 2/3 = 67% → score 2
  },
};

// ─── Fixture 7 — Ignored Self-Correction ─────────────────────────────────
//
// Learner self-corrected but Mercy ignores it and just corrects again.
// Proves: follow_up_quality dimension catches missing acknowledgment.
// R1 also fails: "🔍 Bạn viết:" appears before any acknowledgment.

export const FIXTURE_IGNORED_SELF_CORRECTION: RubricFixture = {
  name: "Ignored self-correction — learner fixed it, Mercy ignores",
  proves: "Follow-up quality dimension catches missing self-correction acknowledgment",
  learnerInput: learner({ didSelfCorrect: true }),
  response: {
    vi: "🔍 Bạn viết: \"I buy.\" 💡 Gợi ý: \"I bought.\" Nhớ dùng quá khứ.",
    correctedSentence: "I bought.",
    correctionCount: 1,
    followUpQuestionCount: 0,
  },
  expectedClassification: "needs_revision",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 1,    // R1 fails (no ack before correction), R2 passes → 1/2
    specificity: 3,
    follow_up_quality: 2,    // R4 passes (0 questions), R9 fails, R10 passes → 2/3 = 67% → score 2
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 8 — Empty Transfer Note (Valid) ─────────────────────────────
//
// Mercy corrects without a Vietnamese transfer note — valid because not
// every error needs one.
// Proves: specificity dimension passes when transfer note is absent (R6
// has no_transfer_note_needed reason code).

export const FIXTURE_NO_TRANSFER_NOTE: RubricFixture = {
  name: "No transfer note — correction without L1 explanation is valid",
  proves: "Specificity dimension does not penalize absence of transfer note",
  learnerInput: learner(),
  response: {
    // Uses "bạn muốn nói" as acknowledgment marker (case-sensitive match)
    vi: "bạn muốn nói là hôm qua bạn đã đi chợ. 🔍 Bạn viết: \"I go to market.\" 💡 Gợi ý: \"I went to the market.\" Thì quá khứ của 'go' là 'went'. Bạn thử lại nhé?",
    correctedSentence: "I went to the market.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
    followUpQuestionCount: 1,
  },
  expectedClassification: "exemplary",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 9 — Too Many Next Steps ─────────────────────────────────────
//
// Mercy recommends 5 next steps — violates R10.
// Proves: follow_up_quality catches too-many-next-steps (R10 now in
// follow_up_quality dimension).

export const FIXTURE_TOO_MANY_NEXT_STEPS: RubricFixture = {
  name: "Too many next steps — 5 recommendations",
  proves: "Rubric catches excessive next-step recommendations via follow_up_quality",
  learnerInput: learner(),
  response: {
    vi: "Mình hiểu rồi. Hãy làm các bước sau.",
    nextSteps: [
      { labelVi: "Bài tập 1" },
      { labelVi: "Bài tập 2" },
      { labelVi: "Bài tập 3" },
      { labelVi: "Bài tập 4" },
      { labelVi: "Bài tập 5" },
    ],
    correctionCount: 0,
    followUpQuestionCount: 0,
  },
  expectedClassification: "needs_revision",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,
    follow_up_quality: 2,     // R4 passes, R9 passes, R10 fails (5 next steps) → 2/3 = 67% → score 2
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 10 — Weakness Memory Reference ──────────────────────────────
//
// Mercy references the learner's tracked weakness ("past-tense") naturally
// in her correction.
// Proves: learner_memory_use dimension scores 3/3 when weakness is referenced.

export const FIXTURE_WEAKNESS_REFERENCED: RubricFixture = {
  name: "Weakness referenced naturally during correction",
  proves: "Learner-memory dimension detects weakness reference patterns",
  learnerInput: learner({ trackedWeakness: "past-tense" }),
  response: {
    // Uses "bạn muốn nói" as acknowledgment marker (case-sensitive match)
    vi: "bạn muốn nói về chuyện hôm qua. 🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" Như lần trước mình đã lưu ý, đây là điểm mình đang theo dõi — thì quá khứ vẫn cần luyện thêm. Bạn thử một câu khác với 'last night' nhé?",
    correctedSentence: "I went.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
    followUpQuestionCount: 1,
  },
  expectedClassification: "exemplary",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 3,
    specificity: 3,
    follow_up_quality: 3,
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── Fixture 11 — Meaning-First Violation ────────────────────────────────
//
// Mercy jumps straight to correction without acknowledging meaning.
// Proves: correction_timing dimension catches meaning-first violation.

export const FIXTURE_MEANING_NOT_FIRST: RubricFixture = {
  name: "Correction before meaning acknowledgment",
  proves: "Correction_timing dimension detects when meaning is not acknowledged first",
  learnerInput: learner(),
  response: {
    vi: "🔍 Bạn viết: \"I go.\" 💡 Gợi ý: \"I went.\" Động từ cần chia quá khứ.",
    correctedSentence: "I went.",
    grammarPoints: ["past tense"],
    correctionCount: 1,
    followUpQuestionCount: 0,
  },
  expectedClassification: "needs_revision",
  expectedDimensionScores: {
    warmth: 3,
    accuracy: 3,
    correction_timing: 1,    // R1 fails (no ack), R2 passes → 1/2
    specificity: 3,
    follow_up_quality: 3,    // R4 passes (0 questions), R9 passes (no self-correction), R10 passes (no next steps) → 3/3
    learner_memory_use: 3,
    safety: 3,
  },
};

// ─── All Fixtures ────────────────────────────────────────────────────────

export const ALL_RUBRIC_FIXTURES: RubricFixture[] = [
  FIXTURE_EXEMPLARY_CORRECTION,
  FIXTURE_PURE_CONVERSATION,
  FIXTURE_FAKE_PRAISE_FAILURE,
  FIXTURE_FACE_THREATENING,
  FIXTURE_OVER_CORRECTION,
  FIXTURE_UNCERTAIN_CORRECTION,
  FIXTURE_IGNORED_SELF_CORRECTION,
  FIXTURE_NO_TRANSFER_NOTE,
  FIXTURE_TOO_MANY_NEXT_STEPS,
  FIXTURE_WEAKNESS_REFERENCED,
  FIXTURE_MEANING_NOT_FIRST,
];
