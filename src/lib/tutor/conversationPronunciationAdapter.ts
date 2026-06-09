import {
  scoreConversationTurn,
  type ConversationPronunciationCostCap,
  type ConversationPronunciationQuality,
  type ConversationPronunciationResult,
  type ScoreConversationTurnInput,
} from "@/lib/pronunciation/conversationPronunciation";

export type ConversationAudioSource = "learner_recording" | "model_audio" | "text_only";

export type ConversationPronunciationAdapterInput = Omit<
  ScoreConversationTurnInput,
  "audioBlob" | "step7Enabled" | "scoreImpl"
> & {
  /** Real learner MediaRecorder blob. Model/TTS audio must never be passed as learner audio. */
  audioBlob?: Blob | null;
  audioSource: ConversationAudioSource;
  /** Premium/trial + cost-cap decision from the caller. */
  step7Enabled: boolean;
  scoreImpl?: typeof scoreConversationTurn;
};

function emptyConversationPronunciationResult(
  quality: ConversationPronunciationQuality,
  costCap: ConversationPronunciationCostCap | null,
  shouldAskRetry = true,
): ConversationPronunciationResult {
  return {
    provider: "azure",
    mode: "english-pronunciation-conversation",
    overallScore: null,
    words: [],
    quality,
    confidence: "low",
    shouldAskRetry,
    costCap,
  };
}

export function hasRealLearnerConversationAudio(input: {
  audioBlob?: Blob | null;
  audioSource: ConversationAudioSource;
}): boolean {
  return input.audioSource === "learner_recording" && Boolean(input.audioBlob && input.audioBlob.size > 0);
}

export async function scoreLearnerConversationPronunciation(
  input: ConversationPronunciationAdapterInput,
): Promise<ConversationPronunciationResult> {
  const costCap = input.costCap ?? null;

  if (!hasRealLearnerConversationAudio(input)) {
    return emptyConversationPronunciationResult("no_audio", costCap);
  }

  if (!input.step7Enabled) {
    return emptyConversationPronunciationResult("scoring_unavailable", costCap, false);
  }

  const scorer = input.scoreImpl ?? scoreConversationTurn;
  return scorer({
    audioBlob: input.audioBlob,
    target: input.target,
    transcript: input.transcript,
    step7Enabled: input.step7Enabled,
    userJwt: input.userJwt,
    accent: input.accent,
    supabaseUrl: input.supabaseUrl,
    fetchImpl: input.fetchImpl,
    timeoutMs: input.timeoutMs,
    costCap,
  });
}
