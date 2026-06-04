import { beforeEach, describe, expect, it, vi } from "vitest";

import { emitFeatureOutcome } from "@/lib/analytics";
import {
  emitPronunciationFeatureOutcome,
  PRONUNCIATION_FEATURE_OUTCOME_KEYS,
} from "../pronunciationFeatureOutcome";

vi.mock("@/lib/analytics", () => ({
  emitFeatureOutcome: vi.fn(),
}));

const emitFeatureOutcomeMock = vi.mocked(emitFeatureOutcome);

describe("emitPronunciationFeatureOutcome", () => {
  beforeEach(() => {
    emitFeatureOutcomeMock.mockClear();
  });

  it("reuses the shared feature-outcome contract for pronunciation attempts", () => {
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.englishFeedback,
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
        activity_counting_field: "feature_outcome_events.completed",
        counts_toward_d1_d7_gate: true,
      }),
    );
    expect(emitFeatureOutcomeMock).toHaveBeenNthCalledWith(
      2,
      "pronunciation.vn_en_english_feedback_mvp",
      "completed",
      expect.objectContaining({
        learner_input: "I bought a ha yesterday.",
        abstained: false,
        abstain_reason: null,
        learner_outcome: "try_again",
      }),
    );
  });

  it("captures abstain reason for unsupported Vietnamese tone attempts", () => {
    emitPronunciationFeatureOutcome({
      featureKey: PRONUNCIATION_FEATURE_OUTCOME_KEYS.vietnameseTone,
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
        abstained: true,
        abstain_reason: "unsupported_tone",
        learner_outcome: "cant_assess_yet",
      }),
    );
  });
});
