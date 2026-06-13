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
} from "@/lib/tutor/learnerHistoryProfile";
import { buildVietnamesePronunciationGrade } from "@/lib/pronunciation/vietnamesePronunciationGrading";
import type { ConversationPronunciationPromptSummary } from "@/lib/pronunciation/conversationPronunciation";

const PRODUCT = "ai-tutor" as const;
const LANG = "en";
const NOW = 1_781_337_600_000;

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
