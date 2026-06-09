import { describe, expect, it, vi } from "vitest";

import {
  hasRealLearnerConversationAudio,
  scoreLearnerConversationPronunciation,
} from "@/lib/tutor/conversationPronunciationAdapter";
import type { ConversationPronunciationResult } from "@/lib/pronunciation/conversationPronunciation";

function blobOfSize(size: number): Blob {
  return new Blob([new Uint8Array(size)], { type: "audio/webm" });
}

function scoredResult(overrides: Partial<ConversationPronunciationResult> = {}): ConversationPronunciationResult {
  return {
    provider: "azure",
    mode: "english-pronunciation-conversation",
    overallScore: 88,
    words: [],
    quality: "ok",
    confidence: "ok",
    shouldAskRetry: false,
    costCap: null,
    ...overrides,
  };
}

describe("conversationPronunciationAdapter", () => {
  it("detects only real learner MediaRecorder audio as scoreable", () => {
    expect(hasRealLearnerConversationAudio({ audioBlob: blobOfSize(1), audioSource: "learner_recording" })).toBe(true);
    expect(hasRealLearnerConversationAudio({ audioBlob: null, audioSource: "learner_recording" })).toBe(false);
    expect(hasRealLearnerConversationAudio({ audioBlob: blobOfSize(0), audioSource: "learner_recording" })).toBe(false);
    expect(hasRealLearnerConversationAudio({ audioBlob: blobOfSize(2000), audioSource: "model_audio" })).toBe(false);
    expect(hasRealLearnerConversationAudio({ audioBlob: undefined, audioSource: "text_only" })).toBe(false);
  });

  it("does not call C1 scoring for null, empty, text-only, or model audio", async () => {
    const scoreImpl = vi.fn(async () => scoredResult());
    const base = { target: "I think so", step7Enabled: true, scoreImpl };

    await expect(
      scoreLearnerConversationPronunciation({ ...base, audioBlob: null, audioSource: "learner_recording" }),
    ).resolves.toMatchObject({ quality: "no_audio", overallScore: null });
    await expect(
      scoreLearnerConversationPronunciation({ ...base, audioBlob: blobOfSize(0), audioSource: "learner_recording" }),
    ).resolves.toMatchObject({ quality: "no_audio", overallScore: null });
    await expect(
      scoreLearnerConversationPronunciation({ ...base, audioBlob: null, audioSource: "text_only" }),
    ).resolves.toMatchObject({ quality: "no_audio", overallScore: null });
    await expect(
      scoreLearnerConversationPronunciation({ ...base, audioBlob: blobOfSize(2000), audioSource: "model_audio" }),
    ).resolves.toMatchObject({ quality: "no_audio", overallScore: null });

    expect(scoreImpl).not.toHaveBeenCalled();
  });

  it("does not call C1 scoring when pronunciation scoring is not enabled", async () => {
    const scoreImpl = vi.fn(async () => scoredResult());

    const result = await scoreLearnerConversationPronunciation({
      audioBlob: blobOfSize(2000),
      audioSource: "learner_recording",
      target: "I think so",
      step7Enabled: false,
      costCap: { remaining: 0, limit: 3 },
      scoreImpl,
    });

    expect(scoreImpl).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      quality: "scoring_unavailable",
      overallScore: null,
      shouldAskRetry: false,
      costCap: { remaining: 0, limit: 3 },
    });
  });

  it("delegates real learner audio to C1 with the caller's gate and context", async () => {
    const scoreImpl = vi.fn(async () => scoredResult({ costCap: { remaining: 2, limit: 3 } }));
    const audioBlob = blobOfSize(2000);

    const result = await scoreLearnerConversationPronunciation({
      audioBlob,
      audioSource: "learner_recording",
      target: "I think so",
      transcript: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      costCap: { remaining: 2, limit: 3 },
      scoreImpl,
    });

    expect(scoreImpl).toHaveBeenCalledTimes(1);
    expect(scoreImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        audioBlob,
        target: "I think so",
        transcript: "I think so",
        step7Enabled: true,
        userJwt: "jwt",
        costCap: { remaining: 2, limit: 3 },
      }),
    );
    expect(result.overallScore).toBe(88);
  });
});
