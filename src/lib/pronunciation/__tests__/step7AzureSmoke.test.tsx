// @vitest-environment jsdom
//
// Step 7 smoke harness:
// - Always validates the no-Azure fallback path used in CI today.
// - Provides an explicit live-Azure shape smoke that stays skipped unless
//   local/dev env opts in. It does not fabricate Azure phoneme or tone output.

import { cleanup, render, screen, within } from "@testing-library/react";
import { fetch as nodeFetch, File as NodeFile, FormData as NodeFormData } from "undici";
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
type NodeFetchInit = NonNullable<Parameters<typeof nodeFetch>[1]>;
type NodeFetchBody = NodeFetchInit["body"];

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

  return new Blob([buildSilentWavPcm16k()], { type: "audio/wav" });
}

function buildSilentWavPcm16k(seconds = 0.1): Uint8Array {
  const sampleRate = 16_000;
  const bitsPerSample = 16;
  const channels = 1;
  const bytesPerSample = bitsPerSample / 8;
  const sampleCount = Math.max(1, Math.round(seconds * sampleRate));
  const dataSize = sampleCount * channels * bytesPerSample;
  const fileSize = 36 + dataSize;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeAscii = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeAscii(0, "RIFF");
  view.setUint32(4, fileSize, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bitsPerSample, true);
  writeAscii(36, "data");
  view.setUint32(40, dataSize, true);

  return new Uint8Array(buffer);
}

function liveFetchWithoutJsdomSignal(
  calledUrls: string[],
  responseStatuses: number[],
  fetchErrors: string[],
  fallbackAudioBlob: Blob,
): typeof fetch {
  return (async (...args: Parameters<typeof fetch>) => {
    const [input, init] = args;
    calledUrls.push(String(input));
    const { signal: _jsdomSignal, body, ...runtimeInit } = init ?? {};
    try {
      const response = await nodeFetch(String(input), {
        ...runtimeInit,
        body: await toNodeFetchBody(body, fallbackAudioBlob),
      } as Parameters<typeof nodeFetch>[1]);
      responseStatuses.push(response.status);
      return response as unknown as Response;
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

async function toNodeFetchBody(
  body: BodyInit | null | undefined,
  fallbackAudioBlob: Blob,
): Promise<NodeFetchBody | undefined> {
  if (!(body instanceof FormData)) return body as NodeFetchBody | undefined;

  const nodeFormData = new NodeFormData();
  for (const [key, value] of body.entries()) {
    if (typeof value === "string") {
      nodeFormData.append(key, value);
      continue;
    }

    const valueName = getFileName(value);
    const valueType = getBlobType(value);
    const arrayBufferReader = getArrayBufferReader(value);
    const textReader = getTextReader(value);

    if (arrayBufferReader) {
      nodeFormData.append(
        key,
        new NodeFile([Buffer.from(await arrayBufferReader())], valueName, {
          type: valueType,
        }),
      );
    } else if (textReader) {
      nodeFormData.append(
        key,
        new NodeFile([await textReader()], valueName, { type: valueType }),
      );
    } else if (key === "audio") {
      nodeFormData.append(
        key,
        new NodeFile([Buffer.from(await readBlobArrayBuffer(fallbackAudioBlob))], valueName, {
          type: fallbackAudioBlob.type,
        }),
      );
    } else {
      nodeFormData.append(key, String(value));
    }
  }
  return nodeFormData as NodeFetchBody;
}

function getArrayBufferReader(value: unknown): (() => Promise<ArrayBuffer>) | null {
  const arrayBuffer = (value as { arrayBuffer?: unknown })?.arrayBuffer;
  return typeof arrayBuffer === "function"
    ? () => arrayBuffer.call(value) as Promise<ArrayBuffer>
    : null;
}

function getTextReader(value: unknown): (() => Promise<string>) | null {
  const text = (value as { text?: unknown })?.text;
  return typeof text === "function"
    ? () => text.call(value) as Promise<string>
    : null;
}

function getFileName(value: unknown): string {
  const name = (value as { name?: unknown })?.name;
  return typeof name === "string" && name ? name : "recording.wav";
}

function getBlobType(value: unknown): string {
  const type = (value as { type?: unknown })?.type;
  return typeof type === "string" ? type : "";
}

async function readBlobArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof (blob as { arrayBuffer?: unknown }).arrayBuffer === "function") {
    return blob.arrayBuffer();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("file_reader_failed"));
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("file_reader_non_array_buffer"));
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

describe("Step 7 Azure-path smoke harness", () => {
  it("rebuilds mixed live-smoke FormData without treating string fields as blobs", async () => {
    const formData = new FormData();
    const audioBlob = new Blob([new Uint8Array([1, 2, 3])], { type: "audio/wav" });
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("target_text", "My voice should go up?");

    const rebuilt = await toNodeFetchBody(formData, audioBlob);

    expect(rebuilt).toBeInstanceOf(NodeFormData);
    expect((rebuilt as unknown as NodeFormData).get("target_text")).toBe("My voice should go up?");
    const audio = (rebuilt as unknown as NodeFormData).get("audio");
    expect(audio).toBeInstanceOf(NodeFile);
    expect((audio as NodeFile).size).toBe(3);
    expect((audio as NodeFile).type).toBe("audio/wav");
  });

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
    const liveFetch = liveFetchWithoutJsdomSignal(
      calledUrls,
      responseStatuses,
      fetchErrors,
      smokeWavBlob,
    );

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
