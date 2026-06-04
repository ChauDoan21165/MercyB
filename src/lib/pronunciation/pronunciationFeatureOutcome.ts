import { emitFeatureOutcome, type AnalyticsPayload } from "@/lib/analytics";

export const PRONUNCIATION_FEATURE_OUTCOME_KEYS = {
  englishFeedback: "pronunciation.vn_en_english_feedback_mvp",
  vietnameseTone: "pronunciation.en_vn_tone_feedback_mvp",
} as const;

export type PronunciationFeatureOutcomeKey =
  (typeof PRONUNCIATION_FEATURE_OUTCOME_KEYS)[keyof typeof PRONUNCIATION_FEATURE_OUTCOME_KEYS];

export type PronunciationLanguageDirection =
  | "en_to_vi_tone"
  | "vn_to_en_english_pronunciation";

export type PronunciationFeatureOutcomeInput = {
  featureKey: PronunciationFeatureOutcomeKey;
  direction: PronunciationLanguageDirection;
  promptContext: AnalyticsPayload;
  learnerInput: string;
  scoredResult: AnalyticsPayload;
  abstained: boolean;
  abstainReason?: string | null;
  learnerOutcome: string;
};

function cleanText(value: string): string {
  return String(value ?? "").trim().slice(0, 500);
}

export function emitPronunciationFeatureOutcome(input: PronunciationFeatureOutcomeInput): void {
  const basePayload: AnalyticsPayload = {
    direction: input.direction,
    prompt_context: input.promptContext,
    activity_counting_field: "feature_outcome_events.completed",
    counts_toward_d1_d7_gate: true,
  };

  void emitFeatureOutcome(input.featureKey, "shown", basePayload);
  void emitFeatureOutcome(input.featureKey, "completed", {
    ...basePayload,
    learner_input: cleanText(input.learnerInput),
    scored_result: input.scoredResult,
    abstained: input.abstained,
    abstain_reason: input.abstainReason ?? null,
    learner_outcome: input.learnerOutcome,
  });
}
