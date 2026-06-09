import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";

import {
  scoreConversationTurn,
  toConversationPromptSummary,
  formatConversationPronunciationForPrompt,
  type ConversationPronunciationResult,
  type ConversationPronunciationPromptSummary,
} from "@/lib/pronunciation/conversationPronunciation";
import type { NormalizedPronunciationScoreResult } from "@/lib/pronunciation/cloudScorer";

// > MIN_REAL_AUDIO_BYTES so it counts as a real attempt.
const realBlob = () => new Blob([new Uint8Array(2000)], { type: "audio/webm" });

function azureResult(
  overrides: Partial<NormalizedPronunciationScoreResult> = {},
): NormalizedPronunciationScoreResult {
  return {
    mode: "azure_phoneme_batch",
    provider: "azure",
    overallScore: 72,
    wordScores: [],
    phonemeScores: [],
    messageKey: "pronunciation.score.azure_phoneme_batch",
    labelKind: "pronunciation_detail",
    useLocalFallback: false,
    ...overrides,
  };
}

// ── The 3 canonical Lane A inputs, each scored into the full data contract ──

async function goodPronunciation(): Promise<ConversationPronunciationResult> {
  // Every phoneme clears the flag threshold; heard === word → no feedback items.
  return scoreConversationTurn({
    audioBlob: realBlob(),
    target: "hello there",
    step7Enabled: true,
    userJwt: "jwt",
    costCap: { remaining: 7, limit: 12 },
    scoreImpl: vi.fn(async () =>
      azureResult({
        overallScore: 96,
        wordScores: [
          {
            word: "hello",
            heard: "hello",
            score: 96,
            status: "correct",
            phonemes: [
              { phoneme: "h", score: 97 },
              { phoneme: "eh", score: 95 },
              { phoneme: "l", score: 96 },
              { phoneme: "ow", score: 94 },
            ],
          },
        ],
        phonemeScores: [],
      }),
    ),
  });
}

async function thetaToTInterference(): Promise<ConversationPronunciationResult> {
  return scoreConversationTurn({
    audioBlob: realBlob(),
    target: "I think so",
    step7Enabled: true,
    userJwt: "jwt",
    costCap: { remaining: 6, limit: 12 },
    scoreImpl: vi.fn(async () =>
      azureResult({
        overallScore: 72,
        wordScores: [
          {
            word: "think",
            heard: "tink",
            score: 55,
            status: "close",
            phonemes: [
              { phoneme: "th", score: 40 },
              { phoneme: "ih", score: 95 },
              { phoneme: "ng", score: 92 },
              { phoneme: "k", score: 94 },
            ],
          },
        ],
        phonemeScores: [{ word: "think", phoneme: "th", score: 40 }],
      }),
    ),
  });
}

async function droppedFinalConsonant(): Promise<ConversationPronunciationResult> {
  return scoreConversationTurn({
    audioBlob: realBlob(),
    target: "I like books",
    step7Enabled: true,
    userJwt: "jwt",
    costCap: { remaining: 5, limit: 12 },
    scoreImpl: vi.fn(async () =>
      azureResult({
        overallScore: 74,
        wordScores: [
          {
            word: "books",
            heard: "book",
            score: 60,
            status: "close",
            phonemes: [
              { phoneme: "b", score: 95 },
              { phoneme: "uh", score: 93 },
              { phoneme: "k", score: 92 },
              { phoneme: "s", score: 8 },
            ],
          },
        ],
        phonemeScores: [{ word: "books", phoneme: "s", score: 8 }],
      }),
    ),
  });
}

describe("toConversationPromptSummary — compact, prompt-ready summary", () => {
  it("returns the stable compact shape Lane A injects (good pronunciation example)", async () => {
    const summary = toConversationPromptSummary(await goodPronunciation());

    // Example payload #1 — GOOD: a number, no focus, no retry.
    expect(summary).toEqual<ConversationPronunciationPromptSummary>({
      provider: "azure",
      mode: "english-pronunciation-conversation",
      overallScore: 96,
      shouldAskRetry: false,
      retryReason: null,
      focus: [],
      capRemaining: 7,
    });
  });

  it("/θ/ → /t/ interference → one compact focus with a Vietnamese-specific hint (example #2)", async () => {
    const summary = toConversationPromptSummary(await thetaToTInterference());

    expect(summary.shouldAskRetry).toBe(false);
    expect(summary.overallScore).toBe(72);
    expect(summary.focus).toHaveLength(1);
    const [focus] = summary.focus;
    expect(focus.word).toBe("think");
    expect(focus.expected).toMatch(/θ|th/i);
    expect(focus.heard).toMatch(/t|d/i);
    expect(focus.vietnameseInterference ?? "").toMatch(/th|θ/i);
    // Learner-facing hint present and compact.
    expect((focus.hint ?? "").length).toBeGreaterThan(0);
    expect((focus.hint ?? "").length).toBeLessThanOrEqual(120);
  });

  it("dropped final consonant → one compact focus naming the missing sound (example #3)", async () => {
    const summary = toConversationPromptSummary(await droppedFinalConsonant());

    expect(summary.shouldAskRetry).toBe(false);
    expect(summary.focus).toHaveLength(1);
    const [focus] = summary.focus;
    expect(focus.word).toBe("books");
    expect(focus.heard).toMatch(/drop|s|z/i);
    expect(focus.vietnameseInterference ?? "").toBeTruthy();
    expect((focus.hint ?? "").length).toBeGreaterThan(0);
  });

  it("caps the number of focus items (compactness) and keeps the worst words first", async () => {
    const many = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "this that bath three",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () =>
        azureResult({
          overallScore: 50,
          wordScores: ["this", "that", "bath", "three"].map((w, i) => ({
            word: w,
            heard: w.replace("th", "t"),
            score: 40 + i, // ascending so order is deterministic
            status: "close" as const,
            phonemes: [{ phoneme: "th", score: 30 + i }],
          })),
          phonemeScores: [],
        }),
      ),
    });
    const summary = toConversationPromptSummary(many, { maxFocus: 2 });
    expect(summary.focus).toHaveLength(2);
    // Worst (lowest word score) first.
    expect(summary.focus[0].word).toBe("this");
    expect(summary.focus[1].word).toBe("that");
  });

  it("trims long hints to the prompt budget", async () => {
    const result = await thetaToTInterference();
    const summary = toConversationPromptSummary(result, { maxHintChars: 12 });
    const hint = summary.focus[0]?.hint ?? "";
    expect(hint.length).toBeLessThanOrEqual(12);
  });
});

describe("toConversationPromptSummary — safety invariants", () => {
  it("NEVER includes raw audio in the prompt payload", async () => {
    const summary = toConversationPromptSummary(await thetaToTInterference());
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toMatch(/audio|blob|arraybuffer|base64|webm|data:/i);
    // No binary-ish fields leaked onto the object graph.
    for (const value of Object.values(summary)) {
      expect(value).not.toBeInstanceOf(Blob);
      expect(value).not.toBeInstanceOf(ArrayBuffer);
    }
  });

  it("retry / poor audio → retry directive with NO fake score and NO focus", async () => {
    // no_audio path.
    const noAudio = await scoreConversationTurn({
      audioBlob: null,
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => azureResult()),
    });
    const noAudioSummary = toConversationPromptSummary(noAudio);
    expect(noAudioSummary.shouldAskRetry).toBe(true);
    expect(noAudioSummary.overallScore).toBeNull();
    expect(noAudioSummary.retryReason).toBe("no_audio");
    expect(noAudioSummary.focus).toEqual([]);

    // low_confidence (non-Azure local fallback) path.
    const lowConf = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(
        async (): Promise<NormalizedPronunciationScoreResult> => ({
          mode: "local_sentence_match",
          provider: "local",
          overallScore: 80,
          messageKey: "pronunciation.score.local_sentence_match",
          labelKind: "sentence_match",
          useLocalFallback: true,
        }),
      ),
    });
    const lowConfSummary = toConversationPromptSummary(lowConf);
    expect(lowConfSummary.shouldAskRetry).toBe(true);
    expect(lowConfSummary.overallScore).toBeNull();
    expect(lowConfSummary.retryReason).toBe("low_confidence");
    expect(lowConfSummary.focus).toEqual([]);
  });

  it("does NOT import or use any tone scorer / tone threshold", () => {
    const src = readFileSync(
      "src/lib/pronunciation/conversationPronunciation.ts",
      "utf8",
    );
    expect(src).not.toMatch(/scoreTone|vietnameseToneScorer|toneContourScorer|f0Pitch/);
    expect(src).not.toMatch(/TONE_[A-Z_]*THRESHOLD/);
    // No import statement (line-scoped) pulls in a tone module.
    expect(src).not.toMatch(/^\s*import[^\n]*tone/im);
  });
});

describe("formatConversationPronunciationForPrompt — compact prompt line", () => {
  it("renders a retry directive with no score for poor audio", async () => {
    const noAudio = await scoreConversationTurn({
      audioBlob: null,
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => azureResult()),
    });
    const line = formatConversationPronunciationForPrompt(
      toConversationPromptSummary(noAudio),
    );
    expect(line).toMatch(/again/i);
    expect(line).not.toMatch(/\d+\/100/);
  });

  it("renders a compact focus line for /θ/ → /t/", async () => {
    const line = formatConversationPronunciationForPrompt(
      toConversationPromptSummary(await thetaToTInterference()),
    );
    expect(line).toMatch(/PRONUNCIATION/);
    expect(line).toMatch(/think/);
    expect(line).toMatch(/72\/100/);
    // Compact: a single line, no raw audio.
    expect(line).not.toMatch(/\n/);
    expect(line).not.toMatch(/audio|blob/i);
  });

  it("renders a clean-speech line with no coaching for good pronunciation", async () => {
    const line = formatConversationPronunciationForPrompt(
      toConversationPromptSummary(await goodPronunciation()),
    );
    expect(line).toMatch(/clear/i);
    expect(line).toMatch(/96\/100/);
  });
});
