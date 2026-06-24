import { beforeEach, describe, expect, it } from "vitest";
import {
  buildConversationMasteryPlanFromStoredEvidence,
  recordConversationTurnMasteryEvidence,
  redactVietnameseToneEvidence,
} from "@/lib/ai-conversation/learnerEvidence";
import {
  createEmptyLearnerHistoryProfile,
  getLearnerHistoryProfileKey,
  saveLearnerHistoryProfile,
  recordInterferencePattern,
} from "@/lib/tutor/learnerHistoryProfile";
import { buildVietnamesePronunciationGrade } from "@/lib/pronunciation/vietnamesePronunciationGrading";
import type { ConversationPronunciationPromptSummary } from "@/lib/pronunciation/conversationPronunciation";
import { FIXTURE_VN_LEARNER_B1_12_SESSIONS } from "./fixtures/learnerHistoryProfile.fixture";

const PRODUCT = "ai-tutor" as const;
const LANG = "en";
const NOW = 1_781_337_600_000;

// The FIXTURE_VN_LEARNER_B1_12_SESSIONS fixture uses EVAL_LAST_SESSION_AT
// (1_748_000_000_000) as its lastSeenAt. Use a timestamp close to it so
// interference patterns don't get pruned (60-day window). This is used for
// tests that need the fixture's interference patterns to survive.
const FIXTURE_NOW = 1_748_000_001_000; // ~1s after the fixture's last session

const focusedPronunciationEvidence: ConversationPronunciationPromptSummary = {
  provider: "azure",
  mode: "english-pronunciation-conversation",
  overallScore: 62,
  shouldAskRetry: false,
  retryReason: null,
  focus: [
    {
      word: "three",
      expected: "/θ/",
      heard: "/t/",
      vietnameseInterference: "th-stopping",
      hint: "Đưa lưỡi nhẹ giữa hai răng.",
    },
  ],
  capRemaining: 4,
};

beforeEach(() => {
  localStorage.clear();
});

describe("conversation learner evidence integration", () => {
  it("keeps tone scores behind the native-ear gate when recording tone evidence", () => {
    const grade = buildVietnamesePronunciationGrade({
      targetText: "má",
      azure: {
        provider: "azure",
        locale: "vi-VN",
        targetText: "má",
        displayText: "má",
        overallAccuracy: 95,
        fluency: 90,
        prosody: 88,
        raw: {},
        words: [
          {
            word: "má",
            accuracy: 95,
            errorType: null,
            offsetMs: 0,
            durationMs: 300,
            phonemes: [],
          },
        ],
      },
      syllableContours: {
        ma: contour([180, 184, 190, 199, 211, 225], 0.95, 0.9),
      },
    });

    const evidence = redactVietnameseToneEvidence(grade);

    expect(evidence.learnerToneDisplayAllowed).toBe(false);
    expect(JSON.stringify(evidence)).not.toContain("toneScore");
    expect(evidence.syllables[0]).toMatchObject({
      syllable: "má",
      toneId: "sac",
      reason: "contour_match",
    });
  });

  it("abstains on low-confidence tone evidence", () => {
    const grade = buildVietnamesePronunciationGrade({
      targetText: "má",
      azure: {
        provider: "azure",
        locale: "vi-VN",
        targetText: "má",
        displayText: "má",
        overallAccuracy: 92,
        fluency: 88,
        prosody: null,
        raw: {},
        words: [
          {
            word: "má",
            accuracy: 92,
            errorType: null,
            offsetMs: 0,
            durationMs: 300,
            phonemes: [],
          },
        ],
      },
      syllableContours: {
        ma: contour([100, 103, 104], 0.9, 0.3),
      },
    });

    expect(grade.toneGrades[0]).toMatchObject({
      toneScore: null,
      correct: null,
      reason: "low_confidence",
    });
    expect(redactVietnameseToneEvidence(grade).syllables[0].reason).toBe("low_confidence");
  });

  it("degrades sparse mastery evidence to confidence-limited instead of surfacing topic mastery", () => {
    saveLearnerHistoryProfile({
      ...createEmptyLearnerHistoryProfile(PRODUCT, LANG, NOW),
      sessionCount: 8,
    }, NOW);

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "I want order coffee.",
        corrected: "I want to order coffee.",
        explanationVi: "Cần 'to' sau want.",
        interferencePattern: "missing-infinitive-to",
        confidence: "high",
      },
      pronunciation: null,
      now: NOW,
    });
    const plan = buildConversationMasteryPlanFromStoredEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      now: NOW,
    });

    expect(result.abstainedReason).toBe("sparse_mastery_evidence");
    expect(result.topicMastery).toStrictEqual({});
    expect(plan[0].reasonCode).toBe("confidence_limited");
  });

  it("changes recommendations after pronunciation and correction evidence enter learner turns", () => {
    saveLearnerHistoryProfile({
      ...createEmptyLearnerHistoryProfile(PRODUCT, LANG, NOW),
      sessionCount: 8,
    }, NOW);

    let last = recordEvidenceTurn(NOW);
    last = recordEvidenceTurn(NOW + 1_000);
    last = recordEvidenceTurn(NOW + 2_000);

    expect(last.interactions.map((interaction) => interaction.skillId)).toEqual([
      "food:grammar",
      "food:speaking",
    ]);
    expect(last.topicMastery.food).toBeLessThan(50);
    expect(last.recommendation).toMatchObject({
      ruleFired: "mastery:lowest-topic-review",
      targetSkill: "food",
    });
  });
});

describe("intelligent recommendation wiring", () => {
  it("produces intelligent recommendation when CEFR, goals, and profile signal are available", () => {
    // Seed a profile with enough signal — B1 fixture has interference
    // patterns and 12 sessions, well above the cold-start threshold.
    // Use FIXTURE_NOW so interference patterns don't get pruned (60d window).
    saveLearnerHistoryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, FIXTURE_NOW);

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "I go to market yesterday.",
        corrected: "I went to the market yesterday.",
        explanationVi: "Cần dùng 'went' cho quá khứ và thêm 'the'.",
        interferencePattern: "tense-omission",
        confidence: "high",
      },
      pronunciation: null,
      cefrLevel: "B1",
      goals: ["daily_conversation"],
      now: FIXTURE_NOW,
    });

    // Base recommendation still works
    expect(result.recommendation).not.toBeNull();

    // Intelligent recommendation is produced
    expect(result.intelligentRecommendation).not.toBeNull();
    expect(result.intelligentRecommendation!.strategy).toBeDefined();
    expect(result.intelligentRecommendation!.challengeLevel).toBeDefined();
    expect(result.intelligentRecommendation!.teacherReasonVi).toBeTruthy();
    expect(result.intelligentRecommendation!.preambleVi).toBeTruthy();
    expect(result.intelligentRecommendation!.diversityNoteVi).toBeTruthy();

    // Teacher reason is in Vietnamese (contains diacritics)
    expect(result.intelligentRecommendation!.teacherReasonVi).toMatch(/[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựýỳỷỹỵ]/);

    // Base recommendation path is unchanged — it's the same underlying engine
    expect(result.recommendation!.ruleFired).toBeTruthy();
  });

  it("returns null intelligent recommendation when profile has no signal and no CEFR/goals are provided", () => {
    // Fresh profile — no interference, 1 session, cold start territory
    saveLearnerHistoryProfile(
      createEmptyLearnerHistoryProfile(PRODUCT, LANG, NOW),
      NOW,
    );

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "He go school.",
        corrected: "He goes to school.",
        explanationVi: "Cần 'goes' với 'he' và thêm 'to'.",
        interferencePattern: "subj-verb-agreement",
        confidence: "high",
      },
      pronunciation: null,
      // No CEFR, no goals — intelligence layer has nothing to work with
      cefrLevel: null,
      goals: [],
      now: NOW,
    });

    // Base recommendation works (fallback)
    expect(result.recommendation).toBeNull(); // cold-start: no recommendation from base either

    // Intelligent recommendation is null — not enough signal
    expect(result.intelligentRecommendation).toBeNull();
  });

  it("produces intelligent recommendation when CEFR is provided even with sparse profile", () => {
    // Sparse profile but external CEFR signal → intelligence activates
    saveLearnerHistoryProfile(
      {
        ...createEmptyLearnerHistoryProfile(PRODUCT, LANG, NOW),
        sessionCount: 5, // enough sessions to cross the signal threshold
      },
      NOW,
    );

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "I go to market yesterday.",
        corrected: "I went to the market yesterday.",
        explanationVi: "Cần dùng 'went' cho quá khứ và thêm 'the'.",
        interferencePattern: "tense-omission",
        confidence: "high",
      },
      pronunciation: null,
      cefrLevel: "A2",
      goals: null,
      now: NOW,
    });

    // Intelligent recommendation activates from sessionCount + CEFR
    expect(result.intelligentRecommendation).not.toBeNull();
    // A2 + sessionCount=5 + no interference → should pick stretch_zone or
    // build_confidence depending on session count
    expect(result.intelligentRecommendation!.teacherReasonVi).toBeTruthy();
  });

  it("all fields on intelligent recommendation are populated correctly for a B1 learner with goals", () => {
    saveLearnerHistoryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, FIXTURE_NOW);

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "I go to market yesterday.",
        corrected: "I went to the market yesterday.",
        explanationVi: "Cần dùng 'went' cho quá khứ và thêm 'the'.",
        interferencePattern: "tense-omission",
        confidence: "high",
      },
      pronunciation: null,
      cefrLevel: "B1",
      goals: ["daily_conversation", "ielts_preparation"],
      now: FIXTURE_NOW,
    });

    const ir = result.intelligentRecommendation;
    expect(ir).not.toBeNull();

    // Strategy — B1 with strong interference (missing-article ×5, tense-omission ×3) → target_weakness
    expect(ir!.strategy).toBe("target_weakness");

    // Challenge level — B1 + target_weakness → moderate (per calibrateChallengeLevel)
    expect(ir!.challengeLevel).toBe("moderate");

    // Goal alignment — "daily_conversation" serves conversation-focused skills
    expect(typeof ir!.alignedWithGoals).toBe("boolean");
    expect(Array.isArray(ir!.servedGoals)).toBe(true);

    // Recency — only one interaction at FIXTURE_NOW, respects recency
    expect(ir!.respectsRecency).toBe(true);
    expect(ir!.recencyOverlaps).toEqual([]);

    // Teacher-quality messages
    expect(ir!.teacherReasonVi.length).toBeGreaterThan(10);
    expect(ir!.preambleVi.length).toBeGreaterThan(5);
    expect(ir!.diversityNoteVi.length).toBeGreaterThan(5);

    // Target skill mentions the interference-driven weakness
    expect(ir!.base.targetSkill).toMatch(/article|tense|agreement|preposition/);
  });

  it("falls back gracefully when cefrLevel is garbage text", () => {
    saveLearnerHistoryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, FIXTURE_NOW);

    const result = recordConversationTurnMasteryEvidence({
      product: PRODUCT,
      targetLanguage: LANG,
      scenarioId: "topic-ordering-food",
      provider: "openai",
      correction: {
        original: "I go to market yesterday.",
        corrected: "I went to the market yesterday.",
        explanationVi: "Cần dùng 'went' cho quá khứ và thêm 'the'.",
        interferencePattern: "tense-omission",
        confidence: "high",
      },
      pronunciation: null,
      cefrLevel: "NOT_A_REAL_LEVEL",
      goals: [],
      now: FIXTURE_NOW,
    });

    // Intelligence still activates (profile has signal from interference patterns)
    expect(result.intelligentRecommendation).not.toBeNull();
    // CEFR is normalized to null (unrecognized string) — but interference patterns
    // still drive target_weakness strategy (Rule 3 fires before CEFR-based defaults).
    // Challenge calibration uses null CEFR → safe middle ground.
    expect(result.intelligentRecommendation!.strategy).toBe("target_weakness");
    // With null CEFR + target_weakness → moderate (safe middle ground per calibrateChallengeLevel)
    expect(result.intelligentRecommendation!.challengeLevel).toBe("moderate");
  });
});

function recordEvidenceTurn(now: number) {
  return recordConversationTurnMasteryEvidence({
    product: PRODUCT,
    targetLanguage: LANG,
    scenarioId: "topic-ordering-food",
    provider: "openai",
    correction: {
      original: "I want order coffee.",
      corrected: "I want to order coffee.",
      explanationVi: "Cần 'to' sau want.",
      interferencePattern: "missing-infinitive-to",
      confidence: "high",
    },
    pronunciation: focusedPronunciationEvidence,
    now,
  });
}

function contour(values: number[], voicedRatio: number, extractionConfidence: number) {
  return {
    samples: values.map((f0Hz, index) => ({
      timeMs: index * 70,
      f0Hz,
      confidence: extractionConfidence,
    })),
    durationMs: (values.length - 1) * 70,
    voicedRatio,
    medianF0Hz: values[Math.floor(values.length / 2)] ?? null,
    extractionConfidence,
    reason: "ok" as const,
  };
}
