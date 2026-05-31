// @vitest-environment jsdom
//
// Step 7 smoke harness:
// - Always validates the no-Azure fallback path used in CI today.
// - Provides an explicit live-Azure shape smoke that stays skipped unless
//   local/dev env opts in. It does not fabricate Azure phoneme or tone output.

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/teacher-mercy/TeacherMercyVoiceControls", () => ({
  default: ({
    active,
    activeLabel,
    inactiveLabel,
    unavailableLabel,
    supported,
    onToggle,
  }: {
    active?: boolean;
    activeLabel: string;
    inactiveLabel: string;
    unavailableLabel: string;
    supported: boolean;
    onToggle: () => void;
  }) =>
    supported ? (
      <button type="button" onClick={onToggle}>
        {active ? activeLabel : inactiveLabel}
      </button>
    ) : (
      <div role="status">{unavailableLabel}</div>
    ),
}));

vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(),
}));

import SpeakPracticeMode from "@/components/ai-tutor/SpeakPracticeMode";
import { adaptSpeakPronunciationResult } from "@/components/ai-tutor/speakPronunciationResultAdapter";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";
import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";
import { flatPitchSamples, sparsePitchSamples } from "../__fixtures__/toneContourFixtures";
import {
  scorePronunciationWithStep7Fallback,
  type NormalizedPronunciationScoreResult,
} from "../cloudScorer";
import { scoreTone } from "../scoreTone";
import { scoreToneContour, type ToneContourScoreResult } from "../toneContourScorer";

const blobToWavPcm16kMock = vi.mocked(blobToWavPcm16k);

const SMOKE_AUDIO_BLOB = new Blob([new Uint8Array([0, 1, 2, 3])], {
  type: "audio/webm",
});

const SAMPLE_UTTERANCES = [
  {
    target: "I went to school yesterday.",
    learner: "I go to school yesterday.",
    expectedContour: "falling" as const,
  },
  {
    target: "Did you eat lunch?",
    learner: "Did you eat lunch?",
    expectedContour: "rising" as const,
  },
  {
    target: "My voice should go up?",
    learner: "My voice should go up?",
    expectedContour: "rising" as const,
  },
];

const LIVE_AZURE_ENABLED =
  process.env.STEP7_LIVE_AZURE_SMOKE === "true" &&
  process.env.VITE_AZURE_PHONEME_BATCH_ENABLED === "true" &&
  Boolean(process.env.VITE_SUPABASE_URL) &&
  Boolean(process.env.STEP7_SMOKE_USER_JWT);

const liveAzureIt = LIVE_AZURE_ENABLED ? it : it.skip;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderSpeakSmoke(
  targetSentence: string,
  repeatInput: string,
  pronunciationResult: ReturnType<typeof adaptSpeakPronunciationResult>,
) {
  render(
    <SpeakPracticeMode
      targetSentence={targetSentence}
      repeatInput={repeatInput}
      pronunciationResult={pronunciationResult}
      micSupported
      micListening={false}
      ttsSupported
      ttsSpeaking={false}
      ttsPreparing={false}
      followUpPrompt={null}
      followUpIsPivot={false}
      followUpTtsSpeaking={false}
      followUpTtsPreparing={false}
      onMicToggle={vi.fn()}
      onReadTarget={vi.fn()}
      onReadFollowUp={vi.fn()}
      onRepeatInputChange={vi.fn()}
      tutorCopy={getTutorCopy("en", "vi")}
    />,
  );
}

function expectWellFormedScore(result: NormalizedPronunciationScoreResult) {
  expect(result.overallScore).toEqual(expect.any(Number));
  expect(result.overallScore).toBeGreaterThanOrEqual(0);
  expect(result.overallScore).toBeLessThanOrEqual(100);
  expect(result.messageKey).toMatch(/^pronunciation\.score\./);
  expect(result.labelKind).toMatch(/^(sentence_match|pronunciation_detail)$/);
  expect(Array.isArray(result.wordScores)).toBe(true);
}

function expectSafeFallback(result: NormalizedPronunciationScoreResult) {
  expectWellFormedScore(result);
  expect(result.mode).toBe("local_sentence_match");
  expect(result.provider).toBe("local");
  expect(result.useLocalFallback).toBe(true);
  expect(result.labelKind).toBe("sentence_match");
  expect(result.phonemeScores).toBeUndefined();
}

function withToneContour(
  result: NormalizedPronunciationScoreResult,
  toneContour: ToneContourScoreResult & { expectedContour: "rising" | "falling" },
) {
  return {
    ...result,
    toneContour,
  };
}

async function resolveSmokeWavBlob(): Promise<Blob> {
  const path = process.env.STEP7_SMOKE_WAV_PATH;
  if (path) {
    const { readFile } = await import("node:fs/promises");
    const bytes = await readFile(path);
    return new Blob([bytes], { type: "audio/wav" });
  }

  return new Blob([new Uint8Array(44 + 1600)], { type: "audio/wav" });
}

function liveFetchWithoutJsdomSignal(
  calledUrls: string[],
  responseStatuses: number[],
  fetchErrors: string[],
): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    calledUrls.push(String(input));
    const { signal: _jsdomSignal, body, ...runtimeInit } = init ?? {};
    try {
      const response = await fetch(input, {
        ...runtimeInit,
        body: await toNodeFetchBody(body),
      });
      responseStatuses.push(response.status);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 120) : "unknown_fetch_error";
      const cause =
        err instanceof Error && err.cause instanceof Error
          ? ` cause=${err.cause.message.slice(0, 120)}`
          : "";
      fetchErrors.push(`${message}${cause}`);
      throw err;
    }
  }) as typeof fetch;
}

async function toNodeFetchBody(body: BodyInit | null | undefined): Promise<BodyInit | null | undefined> {
  if (!(body instanceof FormData)) return body;

  const nodeFormData = new FormData();
  for (const [key, value] of body.entries()) {
    if (value instanceof Blob) {
      nodeFormData.append(key, new Blob([await value.arrayBuffer()], { type: value.type }), "recording.wav");
    } else {
      nodeFormData.append(key, value);
    }
  }
  return nodeFormData;
}

describe("Step 7 Azure-path smoke harness", () => {
  it("keeps no-Azure fallback scoring, tone, and Speak display safe for sample learner utterances", async () => {
    const fetchImpl = vi.fn();

    for (const [index, sample] of SAMPLE_UTTERANCES.entries()) {
      const result = await scorePronunciationWithStep7Fallback({
        audioBlob: SMOKE_AUDIO_BLOB,
        target: sample.target,
        transcript: sample.learner,
        step7Enabled: false,
        fetchImpl,
      });

      expectSafeFallback(result);

      const tone = scoreToneContour({
        expectedContour: sample.expectedContour,
        samples: index === 0 ? sparsePitchSamples : flatPitchSamples,
      });
      expect(tone.bucket).toBe("uncertain");
      expect(tone.confidence).toBeLessThan(0.65);

      const displayResult = adaptSpeakPronunciationResult(
        withToneContour(result, {
          ...tone,
          expectedContour: sample.expectedContour,
        }),
      );

      expect(displayResult).toMatchObject({
        mode: "local-fallback",
        provider: "local",
      });
      expect(displayResult?.phonemeScores).toBeUndefined();
      expect(displayResult?.toneContour).toBeUndefined();

      if (index === 0) {
        renderSpeakSmoke(sample.target, sample.learner, displayResult);

        expect(screen.getAllByTestId("ai-tutor-speak-score")).toHaveLength(1);
        const score = screen.getByTestId("ai-tutor-speak-score");
        expect(score).toHaveTextContent("Bạn nói giống câu mẫu khoảng");
        expect(score).toHaveTextContent(
          "Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.",
        );
        expect(screen.getByTestId("ai-tutor-speak-transcript")).toHaveTextContent(
          sample.learner,
        );
        expect(score).not.toHaveTextContent("Mercy đã chấm phát âm chi tiết hơn bằng từng âm.");
        expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
        expect(screen.queryByTestId("ai-tutor-speak-tone-contour")).not.toBeInTheDocument();
        cleanup();
      }
    }

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(blobToWavPcm16kMock).not.toHaveBeenCalled();
  });

  it("falls back safely when the Step 7 provider is enabled but unavailable", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("network unavailable"));
    blobToWavPcm16kMock.mockResolvedValueOnce(await resolveSmokeWavBlob());

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: SMOKE_AUDIO_BLOB,
      target: SAMPLE_UTTERANCES[1].target,
      transcript: SAMPLE_UTTERANCES[1].learner,
      step7Enabled: true,
      userJwt: "dev-smoke-token",
      supabaseUrl: "https://dev-smoke.supabase.co",
      fetchImpl,
      timeoutMs: 100,
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expectSafeFallback(result);

    const displayResult = adaptSpeakPronunciationResult(result);
    renderSpeakSmoke(SAMPLE_UTTERANCES[1].target, SAMPLE_UTTERANCES[1].learner, displayResult);

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Bạn nói giống câu mẫu khoảng");
    expect(score).not.toHaveTextContent("bằng từng âm");
    expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-speak-tone-contour")).not.toBeInTheDocument();
  });

  liveAzureIt("validates live Azure result shape and Speak rendering when local/dev env opts in", async () => {
    const smokeWavBlob = await resolveSmokeWavBlob();
    blobToWavPcm16kMock.mockResolvedValue(smokeWavBlob);
    const calledUrls: string[] = [];
    const responseStatuses: number[] = [];
    const fetchErrors: string[] = [];
    const liveFetch = liveFetchWithoutJsdomSignal(calledUrls, responseStatuses, fetchErrors);

    const sample = SAMPLE_UTTERANCES[2];
    const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
    expect(supabaseUrl).toBeTruthy();
    if (process.env.MERCYB_SMOKE_BASE_URL) {
      expect(process.env.MERCYB_SMOKE_BASE_URL).toMatch(/^https:\/\/mercyblade\.com\/?$/);
    }

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: SMOKE_AUDIO_BLOB,
      target: sample.target,
      transcript: sample.learner,
      step7Enabled: true,
      userJwt: process.env.STEP7_SMOKE_USER_JWT,
      supabaseUrl,
      fetchImpl: liveFetch,
      timeoutMs: Number(process.env.STEP7_SMOKE_TIMEOUT_MS ?? 15_000),
    });

    expectWellFormedScore(result);
    expect(calledUrls).toContain(`${supabaseUrl}/functions/v1/azure-phoneme`);
    if (result.mode !== "azure_phoneme_batch") {
      throw new Error(
        `live Azure smoke did not return phoneme evidence; mode=${result.mode}; provider=${
          result.provider ?? "unknown"
        }; edgeStatuses=${responseStatuses.join(",") || "none"}; fetchErrors=${
          fetchErrors.join(" | ") || "none"
        }`,
      );
    }

    const displayResult = adaptSpeakPronunciationResult(result);
    expect(displayResult).not.toBeNull();
    renderSpeakSmoke(sample.target, sample.learner, displayResult);

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toBeInTheDocument();

    expect(result.provider).toBe("azure");
    expect(result.labelKind).toBe("pronunciation_detail");
    expect(result.phonemeScores?.length).toBeGreaterThan(0);
    expect(displayResult?.mode).toBe("azure-batch");
    expect(displayResult?.phonemeScores?.length).toBeGreaterThan(0);
    expect(score).toHaveTextContent("Điểm tổng thể khoảng");
    expect(screen.getByTestId("ai-tutor-speak-word-detail")).toBeInTheDocument();

    const toneResult = await scoreTone({
      audioBlob: SMOKE_AUDIO_BLOB,
      targetSyllable: process.env.STEP7_SMOKE_TONE_TARGET ?? "má",
      userJwt: process.env.STEP7_SMOKE_USER_JWT ?? null,
      supabaseUrl,
      fetchImpl: liveFetch,
      timeoutMs: Number(process.env.STEP7_SMOKE_TIMEOUT_MS ?? 15_000),
    });
    if (toneResult.bucket === "unavailable") {
      throw new Error(`live tone smoke unavailable; reason=${toneResult.reason ?? "unknown"}`);
    }
    expect(toneResult.score).toEqual(expect.any(Number));
    expect(toneResult.score).toBeGreaterThanOrEqual(0);
    expect(toneResult.score).toBeLessThanOrEqual(100);

    expect(within(screen.getByTestId("ai-tutor-speak-practice")).getByTestId(
      "ai-tutor-speak-transcript",
    )).toHaveTextContent(sample.learner);
  }, Number(process.env.STEP7_SMOKE_TEST_TIMEOUT_MS ?? 30_000));
});
