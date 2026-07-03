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

function normalizeConversationCostCap(
  costCap: ConversationPronunciationCostCap | null | undefined,
): ConversationPronunciationCostCap | null {
  if (!costCap) return null;
  const remaining = Number.isFinite(costCap.remaining) ? Math.max(0, costCap.remaining) : 0;
  const limit = Number.isFinite(costCap.limit) ? Math.max(0, costCap.limit) : 0;
  return { remaining, limit };
}

function normalizeTimeoutMs(timeoutMs: number | undefined): number | undefined {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : undefined;
}

function isConversationPronunciationResult(value: unknown): value is ConversationPronunciationResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<ConversationPronunciationResult>;
  return (
    result.provider === "azure" &&
    result.mode === "english-pronunciation-conversation" &&
    (typeof result.overallScore === "number" || result.overallScore === null) &&
    Array.isArray(result.words) &&
    (result.quality === "ok" ||
      result.quality === "low_confidence" ||
      result.quality === "no_audio" ||
      result.quality === "scoring_unavailable") &&
    (result.confidence === "ok" || result.confidence === "low") &&
    typeof result.shouldAskRetry === "boolean"
  );
}

export function hasRealLearnerConversationAudio(input: {
  audioBlob?: Blob | null;
  audioSource: ConversationAudioSource;
}): boolean {
  if (input.audioSource !== "learner_recording" || !input.audioBlob) return false;
  try {
    return typeof input.audioBlob.size === "number" && Number.isFinite(input.audioBlob.size) && input.audioBlob.size > 0;
  } catch {
    return false;
  }
}

export async function scoreLearnerConversationPronunciation(
  input: ConversationPronunciationAdapterInput,
): Promise<ConversationPronunciationResult> {
  const costCap = normalizeConversationCostCap(input.costCap);

  if (!hasRealLearnerConversationAudio(input)) {
    return emptyConversationPronunciationResult("no_audio", costCap);
  }

  if (!input.target.trim()) {
    return emptyConversationPronunciationResult("scoring_unavailable", costCap);
  }

  if (!input.step7Enabled) {
    return emptyConversationPronunciationResult("scoring_unavailable", costCap, false);
  }

  const scorer = input.scoreImpl ?? scoreConversationTurn;
  try {
    const result = await scorer({
      audioBlob: input.audioBlob,
      target: input.target,
      transcript: input.transcript,
      step7Enabled: input.step7Enabled,
      userJwt: input.userJwt,
      accent: input.accent,
      supabaseUrl: input.supabaseUrl,
      fetchImpl: input.fetchImpl,
      timeoutMs: normalizeTimeoutMs(input.timeoutMs),
      costCap,
    });
    return isConversationPronunciationResult(result)
      ? { ...result, costCap: normalizeConversationCostCap(result.costCap) }
      : emptyConversationPronunciationResult("scoring_unavailable", costCap);
  } catch {
    return emptyConversationPronunciationResult("scoring_unavailable", costCap);
  }
}
