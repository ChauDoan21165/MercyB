import { beforeEach, describe, expect, it, vi } from "vitest";

import { emitFeatureOutcome } from "@/lib/analytics";
import {
  emitPronunciationFeatureOutcome,
  PRONUNCIATION_FEATURE_OUTCOME_KEYS,
  resetPronunciationFeatureOutcomeSessionDedupeForTests,
} from "../pronunciationFeatureOutcome";

vi.mock("@/lib/analytics", () => ({
  emitFeatureOutcome: vi.fn(),
}));

const emitFeatureOutcomeMock = vi.mocked(emitFeatureOutcome);

describe("emitPronunciationFeatureOutcome", () => {
  beforeEach(() => {
    emitFeatureOutcomeMock.mockClear();
    resetPronunciationFeatureOutcomeSessionDedupeForTests();
  });

  it("reuses the shared feature-outcome contract for pronunciation attempts", () => {
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.englishFeedback,
      sessionId: "speak-session-1",
      direction: "vn_to_en_english_pronunciation",
      promptContext: {
        target_text: "I bought a hat yesterday.",
        source: "ai_tutor_speak",
      },
      learnerInput: "I bought a ha yesterday.",
      scoredResult: {
        overall_score: 72,
        feedback_items: ["final_t_d_deletion"],
      },
      abstained: false,
      learnerOutcome: "try_again",
    });

    expect(emitFeatureOutcomeMock).toHaveBeenCalledTimes(2);
    expect(emitFeatureOutcomeMock).toHaveBeenNthCalledWith(
      1,
      "pronunciation.vn_en_english_feedback_mvp",
      "shown",
      expect.objectContaining({
        direction: "vn_to_en_english_pronunciation",
        session_id: "speak-session-1",
        activity_counting_field: "feature_outcome_events.completed",
        counts_toward_d1_d7_gate: true,
      }),
    );
    expect(emitFeatureOutcomeMock).toHaveBeenNthCalledWith(
      2,
      "pronunciation.vn_en_english_feedback_mvp",
      "completed",
      expect.objectContaining({
        session_id: "speak-session-1",
        learner_input: "I bought a ha yesterday.",
        scored_result: {
          overall_score: 72,
          feedback_items: ["final_t_d_deletion"],
        },
        abstained: false,
        abstain_reason: null,
        learner_outcome: "try_again",
      }),
    );
  });

  it("captures abstain reason for unsupported Vietnamese tone attempts", () => {
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
      sessionId: "tone-session-1",
      direction: "en_to_vi_tone",
      promptContext: {
        target_text: "mã",
        tone: "nga",
        source: "ai_tutor_speak",
      },
      learnerInput: "mã",
      scoredResult: {
        tone: "nga",
        supported: false,
      },
      abstained: true,
      abstainReason: "unsupported_tone",
      learnerOutcome: "cant_assess_yet",
    });

    expect(emitFeatureOutcomeMock).toHaveBeenCalledWith(
      "pronunciation.en_vn_tone_feedback_mvp",
      "completed",
      expect.objectContaining({
        direction: "en_to_vi_tone",
        session_id: "tone-session-1",
        abstained: true,
        abstain_reason: "unsupported_tone",
        learner_outcome: "cant_assess_yet",
      }),
    );
  });

  it("emits completed once per feature key and Speak session while shown remains per attempt", () => {
    for (const learnerInput of ["I bought a ha yesterday.", "I bought a hat yesterday."]) {
      emitPronunciationFeatureOutcome({
        featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.englishFeedback,
        sessionId: "speak-session-repeat",
        direction: "vn_to_en_english_pronunciation",
        promptContext: {
          target_text: "I bought a hat yesterday.",
          source: "ai_tutor_speak",
        },
        learnerInput,
        scoredResult: {
          overall_score: learnerInput.includes("hat") ? 92 : 72,
          feedback_items: learnerInput.includes("hat") ? ["correct"] : ["final_t_d_deletion"],
        },
        abstained: false,
        learnerOutcome: learnerInput.includes("hat") ? "correct" : "try_again",
      });
    }

    expect(emitFeatureOutcomeMock.mock.calls.filter(([, event]) => event === "shown")).toHaveLength(2);
    const completedCalls = emitFeatureOutcomeMock.mock.calls.filter(([, event]) => event === "completed");
    expect(completedCalls).toHaveLength(1);
    expect(completedCalls[0]).toEqual([
      "pronunciation.vn_en_english_feedback_mvp",
      "completed",
      expect.objectContaining({
        session_id: "speak-session-repeat",
        learner_input: "I bought a ha yesterday.",
        learner_outcome: "try_again",
      }),
    ]);
  });

  it("allows a new Speak session to emit another completed event for the same feature key", () => {
    for (const sessionId of ["tone-session-a", "tone-session-b"]) {
      emitPronunciationFeatureOutcome({
        featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
        sessionId,
        direction: "en_to_vi_tone",
        promptContext: {
          target_text: "má",
          tone: "sac",
          source: "ai_tutor_speak",
          supported: true,
        },
        learnerInput: "má",
        scoredResult: {
          tone: "sac",
          bucket: "pass",
          score: 91,
          reason: null,
        },
        abstained: false,
        learnerOutcome: "correct",
      });
    }

    const completedCalls = emitFeatureOutcomeMock.mock.calls.filter(([, event]) => event === "completed");
    expect(completedCalls).toHaveLength(2);
    expect(completedCalls.map(([featureKey, , payload]) => ({
      featureKey,
      sessionId: payload?.session_id,
    }))).toEqual([
      {
        featureKey: "pronunciation.en_vn_tone_feedback_mvp",
        sessionId: "tone-session-a",
      },
      {
        featureKey: "pronunciation.en_vn_tone_feedback_mvp",
        sessionId: "tone-session-b",
      },
    ]);
  });

  it("dedups completed independently for both pronunciation feature keys", () => {
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
      sessionId: "shared-speak-session",
      direction: "en_to_vi_tone",
      promptContext: {
        target_text: "má",
        tone: "sac",
        source: "ai_tutor_speak",
      },
      learnerInput: "má",
      scoredResult: { tone: "sac", bucket: "pass", score: 90 },
      abstained: false,
      learnerOutcome: "correct",
    });
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.englishFeedback,
      sessionId: "shared-speak-session",
      direction: "vn_to_en_english_pronunciation",
      promptContext: {
        target_text: "I bought a hat yesterday.",
        source: "ai_tutor_speak",
      },
      learnerInput: "I bought a hat yesterday.",
      scoredResult: { overall_score: 92, feedback_items: [] },
      abstained: false,
      learnerOutcome: "correct",
    });

    const completedKeys = emitFeatureOutcomeMock.mock.calls
      .filter(([, event]) => event === "completed")
      .map(([featureKey]) => featureKey);
    expect(completedKeys).toEqual([
      "pronunciation.en_vn_tone_feedback_mvp",
      "pronunciation.vn_en_english_feedback_mvp",
    ]);
  });
});
