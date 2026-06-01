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
type ResponseSummarySource = {
  status: number;
  clone: () => { text: () => Promise<string> };
};
type SmokeAuthFetch = (
  input: string,
  init?: Parameters<typeof nodeFetch>[1],
) => Promise<{ status: number; text: () => Promise<string> }>;
type LiveSmokeTokenSource = "env_jwt" | "runtime_mint";
type LiveSmokeTokenResult = {
  token: string;
  source: LiveSmokeTokenSource;
};

const SMOKE_AUDIO_BLOB = new Blob([new Uint8Array([0, 1, 2, 3])], {
  type: "audio/webm",
});

const AZURE_PHONEME_EDGE_PATH = "/functions/v1/azure-phoneme";
const SAFE_EDGE_RESPONSE_FIELDS = [
  "ok",
  "use_local",
  "reason",
  "error",
  "provider",
  "mode",
] as const;
const SAFE_RESPONSE_TEXT_LIMIT = 240;

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
  Boolean(process.env.VITE_SUPABASE_URL);

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

function buildSilentWavPcm16k(seconds = 0.1): ArrayBuffer {
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

  return buffer;
}

function liveFetchWithoutJsdomSignal(
  calledUrls: string[],
  responseStatuses: number[],
  fetchErrors: string[],
  responseSummaries: string[],
  fallbackAudioBlob: Blob,
): typeof fetch {
  return (async (...args: Parameters<typeof fetch>) => {
    const [input, init] = args;
    const requestUrl = String(input);
    calledUrls.push(requestUrl);
    const { signal: _jsdomSignal, body, ...runtimeInit } = init ?? {};
    try {
      const response = await nodeFetch(requestUrl, {
        ...runtimeInit,
        body: await toNodeFetchBody(body, fallbackAudioBlob),
      } as Parameters<typeof nodeFetch>[1]);
      responseStatuses.push(response.status);
      await captureAzurePhonemeResponseSummary(requestUrl, response, responseSummaries);
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

async function resolveLiveSmokeUserJwt(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: SmokeAuthFetch = nodeFetch,
): Promise<LiveSmokeTokenResult> {
  const staticJwt = env.STEP7_SMOKE_USER_JWT?.trim();
  if (staticJwt) {
    return { token: staticJwt, source: "env_jwt" };
  }

  const email = env.STEP7_SMOKE_USER_EMAIL?.trim();
  const password = env.STEP7_SMOKE_USER_PASSWORD;
  if (!email || !password) {
    throw new Error("missing smoke-user credentials; no token minted");
  }

  const supabaseUrl = env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !anonKey) {
    throw new Error("missing Supabase Auth config; no token minted");
  }

  const response = await fetchImpl(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const bodyText = await response.text();
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `smoke-user login failed; status=${response.status}; body=${summarizeSafeAuthBody(
        bodyText,
      )}`,
    );
  }

  const parsed = parseJsonObject(bodyText);
  const accessToken = parsed && typeof parsed.access_token === "string"
    ? parsed.access_token.trim()
    : "";
  if (!accessToken) {
    throw new Error("smoke-user login did not return access_token; no token minted");
  }
  return { token: accessToken, source: "runtime_mint" };
}

function logLiveSmokeTokenSource(
  tokenResult: LiveSmokeTokenResult,
  log: (message: string) => void = console.info,
): void {
  log(`[step7Smoke] tokenSource=${tokenResult.source}; tokenLength=${tokenResult.token.length}`);
}

async function captureAzurePhonemeResponseSummary(
  requestUrl: string,
  response: ResponseSummarySource,
  responseSummaries: string[],
): Promise<void> {
  if (!requestUrl.includes(AZURE_PHONEME_EDGE_PATH)) return;
  responseSummaries.push(await summarizeSafeEdgeResponse(response));
}

async function summarizeSafeEdgeResponse(response: ResponseSummarySource): Promise<string> {
  let text = "";
  try {
    text = await response.clone().text();
  } catch {
    return JSON.stringify({ status: response.status });
  }

  if (!text.trim()) {
    return JSON.stringify({ status: response.status });
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return JSON.stringify(sanitizeEdgeJson(response.status, parsed));
  } catch {
    return JSON.stringify({ status: response.status });
  }
}

function sanitizeEdgeJson(status: number, parsed: unknown): Record<string, unknown> {
  const summary: Record<string, unknown> = { status };
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return summary;
  }

  const record = parsed as Record<string, unknown>;
  for (const field of SAFE_EDGE_RESPONSE_FIELDS) {
    if (field in record && isSafePrimitive(record[field])) {
      summary[field] =
        typeof record[field] === "string"
          ? sanitizeSafeResponseText(record[field])
          : record[field];
    }
  }
  const wordScores = Array.isArray(record.word_scores) ? record.word_scores : [];
  const phonemeScores = Array.isArray(record.phoneme_scores) ? record.phoneme_scores : [];
  summary.word_scores_length = wordScores.length;
  summary.nested_phoneme_count = wordScores.reduce((count, wordScore) => {
    if (!wordScore || typeof wordScore !== "object" || Array.isArray(wordScore)) {
      return count;
    }
    const phonemes = (wordScore as Record<string, unknown>).phonemes;
    return count + (Array.isArray(phonemes) ? phonemes.length : 0);
  }, 0);
  summary.phoneme_scores_length = phonemeScores.length;
  summary.has_score = "score" in record;
  summary.has_overall_score = "overall_score" in record;
  return summary;
}

function isSafePrimitive(value: unknown): value is string | number | boolean | null {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function sanitizeSafeResponseText(value: string): string {
  return value
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[redacted_jwt]")
    .replace(/data:audio\/[^;]+;base64,[A-Za-z0-9+/=]+/g, "[redacted_audio_data]")
    .replace(/[^\t\n\r -~]/g, "")
    .slice(0, SAFE_RESPONSE_TEXT_LIMIT);
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function summarizeSafeAuthBody(text: string): string {
  const parsed = parseJsonObject(text);
  if (!parsed) return sanitizeSafeResponseText(text);

  const summary: Record<string, string> = {};
  for (const field of ["error", "error_description", "msg", "message"]) {
    const value = parsed[field];
    if (typeof value === "string") {
      summary[field] = sanitizeSafeResponseText(value);
    }
  }
  return Object.keys(summary).length > 0 ? JSON.stringify(summary) : "{}";
}

function hasLiveAzurePhonemeEvidence(result: NormalizedPronunciationScoreResult): boolean {
  return result.mode === "azure_phoneme_batch" && (result.phonemeScores?.length ?? 0) > 0;
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

  it("captures only sanitized Azure edge response details for live-smoke failures", async () => {
    const summaries: string[] = [];
    const response = new Response(
      JSON.stringify({
        ok: false,
        use_local: true,
        reason: "azure_error",
        error: "provider_unavailable",
        provider: "local",
        mode: "local_sentence_match",
        score: 81,
        overall_score: 81,
        word_scores: [
          {
            word: "private-word",
            score: 82,
            phonemes: [
              { phoneme: "private-phoneme", score: 70 },
              { phoneme: "private-phoneme-2", score: 71 },
            ],
          },
          { word: "private-word-2", score: 83, phonemes: [] },
        ],
        phoneme_scores: [
          { word: "private-word", phoneme: "private-phoneme", score: 70 },
        ],
        transcript: "do not log learner transcript",
        token: "eyJabc.def.ghi",
      }),
      { status: 200 },
    );

    await captureAzurePhonemeResponseSummary(
      "https://dev-smoke.supabase.co/functions/v1/azure-phoneme",
      response,
      summaries,
    );

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toContain('"status":200');
    expect(summaries[0]).toContain('"use_local":true');
    expect(summaries[0]).toContain('"reason":"azure_error"');
    expect(summaries[0]).toContain('"error":"provider_unavailable"');
    expect(summaries[0]).toContain('"word_scores_length":2');
    expect(summaries[0]).toContain('"nested_phoneme_count":2');
    expect(summaries[0]).toContain('"phoneme_scores_length":1');
    expect(summaries[0]).toContain('"has_score":true');
    expect(summaries[0]).toContain('"has_overall_score":true');
    expect(summaries[0]).not.toContain("transcript");
    expect(summaries[0]).not.toContain("eyJabc");
    expect(summaries[0]).not.toContain("private-word");
    expect(summaries[0]).not.toContain("private-phoneme");
    expect(Object.keys(JSON.parse(summaries[0]) as Record<string, unknown>).sort()).toEqual([
      "error",
      "has_overall_score",
      "has_score",
      "mode",
      "nested_phoneme_count",
      "ok",
      "phoneme_scores_length",
      "provider",
      "reason",
      "status",
      "use_local",
      "word_scores_length",
    ]);
  });

  it("fails safely when no static JWT or smoke-user credentials are available", async () => {
    const fetchImpl = vi.fn();

    await expect(resolveLiveSmokeUserJwt(
      {
        VITE_SUPABASE_URL: "https://dev-smoke.supabase.co",
        VITE_SUPABASE_ANON_KEY: "anon-key",
      },
      fetchImpl,
    )).rejects.toThrow("missing smoke-user credentials; no token minted");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("uses an existing static smoke JWT without attempting runtime login", async () => {
    const fetchImpl = vi.fn();

    const tokenResult = await resolveLiveSmokeUserJwt(
      { STEP7_SMOKE_USER_JWT: "static-smoke-jwt" },
      fetchImpl,
    );

    expect(tokenResult).toEqual({ token: "static-smoke-jwt", source: "env_jwt" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("mints a runtime smoke-user access token without logging the token value", async () => {
    const dummyEmail = ["step7", "smoke", "user"].join("_");
    const dummyPassword = ["dummy", "smoke", "password"].join("_");
    const dummyToken = ["runtime", "token", "value"].join("_");
    const fetchImpl = vi.fn<SmokeAuthFetch>().mockResolvedValue({
      status: 200,
      text: async () => JSON.stringify({ access_token: dummyToken }),
    });
    const log = vi.fn();

    const tokenResult = await resolveLiveSmokeUserJwt(
      {
        VITE_SUPABASE_URL: "https://dev-smoke.supabase.co/",
        VITE_SUPABASE_ANON_KEY: "anon-key",
        STEP7_SMOKE_USER_EMAIL: dummyEmail,
        STEP7_SMOKE_USER_PASSWORD: dummyPassword,
      },
      fetchImpl,
    );
    logLiveSmokeTokenSource(tokenResult, log);

    expect(tokenResult).toEqual({ token: dummyToken, source: "runtime_mint" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://dev-smoke.supabase.co/auth/v1/token?grant_type=password",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          apikey: "anon-key",
          authorization: "Bearer anon-key",
          "content-type": "application/json",
        }),
      }),
    );
    expect(log).toHaveBeenCalledWith("[step7Smoke] tokenSource=runtime_mint; tokenLength=19");
    expect(log.mock.calls.flat().join(" ")).not.toContain(dummyEmail);
    expect(log.mock.calls.flat().join(" ")).not.toContain(dummyPassword);
    expect(log.mock.calls.flat().join(" ")).not.toContain(dummyToken);
  });

  it("requires live Azure mode plus phoneme evidence for a green live smoke", () => {
    expect(hasLiveAzurePhonemeEvidence({
      mode: "azure_phoneme_batch",
      provider: "azure",
      overallScore: 82,
      messageKey: "pronunciation.score.azure_phoneme_batch",
      labelKind: "pronunciation_detail",
      useLocalFallback: false,
      phonemeScores: [{ word: "voice", phoneme: "v", score: 91 }],
    })).toBe(true);
    expect(hasLiveAzurePhonemeEvidence({
      mode: "azure_phoneme_batch",
      provider: "azure",
      overallScore: 82,
      messageKey: "pronunciation.score.azure_phoneme_batch",
      labelKind: "pronunciation_detail",
      useLocalFallback: false,
      phonemeScores: [],
    })).toBe(false);
    expect(hasLiveAzurePhonemeEvidence({
      mode: "local_sentence_match",
      provider: "local",
      overallScore: 82,
      messageKey: "pronunciation.score.local_sentence_match",
      labelKind: "sentence_match",
      useLocalFallback: true,
    })).toBe(false);
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
    const responseSummaries: string[] = [];
    const liveFetch = liveFetchWithoutJsdomSignal(
      calledUrls,
      responseStatuses,
      fetchErrors,
      responseSummaries,
      smokeWavBlob,
    );

    const sample = SAMPLE_UTTERANCES[2];
    const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
    expect(supabaseUrl).toBeTruthy();
    if (process.env.MERCYB_SMOKE_BASE_URL) {
      expect(process.env.MERCYB_SMOKE_BASE_URL).toMatch(/^https:\/\/mercyblade\.com\/?$/);
    }
    const tokenResult = await resolveLiveSmokeUserJwt();
    logLiveSmokeTokenSource(tokenResult);

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: SMOKE_AUDIO_BLOB,
      target: sample.target,
      transcript: sample.learner,
      step7Enabled: true,
      userJwt: tokenResult.token,
      supabaseUrl,
      fetchImpl: liveFetch,
      timeoutMs: Number(process.env.STEP7_SMOKE_TIMEOUT_MS ?? 15_000),
    });

    expectWellFormedScore(result);
    expect(calledUrls).toContain(`${supabaseUrl}/functions/v1/azure-phoneme`);
    if (!hasLiveAzurePhonemeEvidence(result)) {
      throw new Error(
        `live Azure smoke did not return phoneme evidence; mode=${result.mode}; provider=${
          result.provider ?? "unknown"
        }; tokenSource=${tokenResult.source}; tokenLength=${tokenResult.token.length
        }; edgeStatuses=${responseStatuses.join(",") || "none"}; fetchErrors=${
          fetchErrors.join(" | ") || "none"
        }; edgeResponses=${
          responseSummaries.join(" | ") || "none"
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
      userJwt: tokenResult.token,
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
