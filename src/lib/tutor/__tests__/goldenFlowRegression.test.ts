import { describe, expect, it } from "vitest";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
} from "@/lib/tutor/correctionEngine";
import {
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUpByTopicId,
} from "@/lib/tutor/speakFollowups";
import {
  SPEAK_TOPIC_CORRECTION_CANDIDATES,
  buildSpeakTopicCorrectionWeave,
} from "@/lib/tutor/speakTopicLibrary";
import { diagnoseVietlishLogicWithMatch } from "@/lib/tutor/vietlishLogicEngine";

const grammarGoldenFixtures = [
  {
    input: "I buy a hat yesterday.",
    expected: "I bought a hat yesterday.",
    ruleId: "en-yesterday-irregular-beginner-past",
  },
  {
    input: "She go to school every day.",
    expected: "She goes to school every day.",
    ruleId: "en-step5-subject-verb-agreement",
  },
  {
    input: "I bought hat yesterday.",
    expected: "I bought a hat yesterday.",
    ruleId: "en-l4-missing-singular-article",
  },
  {
    input: "I go school.",
    expected: "I go to school.",
    ruleId: "en-step5-preposition-pattern",
  },
] as const;

describe("AI Tutor golden-flow regressions", () => {
  it("keeps deterministic Grammar corrections better than the input", () => {
    for (const fixture of grammarGoldenFixtures) {
      const result = correctWithTutorRules(fixture.input, "en");

      expect(result.status).toBe("corrected");
      expect(result.corrected).toBe(fixture.expected);
      expect(result.corrected).not.toBe(fixture.input);
      expect(result.appliedRuleIds).toContain(fixture.ruleId);
    }
  });

  it("abstains on unsupported Grammar uncertainty instead of emitting a fake correction", () => {
    const result = correctWithTutorRules("I run yesterday.", "en");

    expect(result).toEqual({
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    });
  });

  it("uses existing Speak precision-gate evidence for correction weaving", () => {
    for (const candidate of SPEAK_TOPIC_CORRECTION_CANDIDATES) {
      for (const positive of candidate.positives) {
        const weave = buildSpeakTopicCorrectionWeave(positive);
        if (candidate.status === "ship-safe") {
          expect(weave).toMatchObject({
            signalId: candidate.id,
            status: "ship-safe",
          });
        } else {
          expect(weave).toBeNull();
        }
      }

      for (const negative of candidate.confusableNegatives) {
        expect(buildSpeakTopicCorrectionWeave(negative)).toBeNull();
      }
    }
  });

  it("uses the current Speak sentence instead of stale seed state", () => {
    const topicId = resolveSpeakFollowUpTopicId({
      seedSentence: "I bought a hat yesterday.",
      learnerText: "I had dinner with my family.",
      currentTopicId: "bought-hat-yesterday",
    });
    const selection = selectSpeakFollowUpByTopicId(topicId, {
      askedQuestions: [],
      turnsOnTopic: 0,
      learnerText: "I had dinner with my family.",
    });

    expect(topicId).toBe("dinner-family");
    expect(selection.question).toBe("What did you eat?");
    expect(selection.question).not.toBe("Where did you buy it?");
  });

  it("keeps Logic deterministic and abstains to the local fallback for unknown patterns", () => {
    expect(diagnoseVietlishLogicWithMatch("I go school")).toMatchObject({
      isKnownPattern: true,
      patternId: "go-school",
      correctedExample: "I go to school.",
    });

    expect(diagnoseVietlishLogicWithMatch("My project feels ready but strange.")).toMatchObject({
      isKnownPattern: false,
      patternId: null,
      fallbackMessage: "Mercy can still explain the English logic. Try a common sentence like: I go school.",
    });
  });
});
