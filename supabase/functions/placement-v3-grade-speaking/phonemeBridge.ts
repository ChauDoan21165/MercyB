import {
  type AzurePhonemeResponse,
  type GradeSpeakingRequest,
  type NormalizedPhonemeScore,
  type NormalizedWordPronunciation,
  type PronunciationAssessment,
  type PronunciationFlag,
} from "./types.ts";
import { VN_L1_INTERFERENCE_PATTERNS } from "../../../src/data/placement/vnL1Interference.ts";

export type PhonemeBridgeDeps = {
  fetch: typeof fetch;
  functionBaseUrl: string;
  serviceRoleKey: string;
  userAccessToken?: string | null;
  timeoutMs?: number;
  retryDelaysMs?: number[];
  loadAudioBytes?: (audioStoragePath: string) => Promise<{
    bytes: Uint8Array;
    contentType?: string | null;
  } | null>;
};

const DEFAULT_CONTENT_TYPE = "audio/wav";
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRY_DELAYS_MS = [150, 450];

/**
 * Confirmed local `azure-phoneme` contract:
 * - request multipart fields: audio, target_text, roomId, lineId, optional accent
 * - success: { ok:true, provider:"azure", score, word_scores, audio_seconds, cost_usd_cents }
 * - word_scores: [{ word, heard, score, status, phonemes:[{ phoneme, score }] }]
 * - degraded: { ok:false, use_local:true, reason }
 *
 * Defensive assumptions kept local to this adapter: phoneme arrays may be
 * missing, duplicated, or malformed; score fields may be absent. Those cases
 * must degrade to bounded confidence instead of crashing speaking grading.
 *
 * Auth contract: `azure-phoneme` resolves the learner through the bearer
 * token, so the session caller must forward the user JWT here. The service
 * role key remains the `apikey` used for internal edge-function invocation.
 */
export async function scorePronunciationWithAzure(
  request: GradeSpeakingRequest,
  deps: PhonemeBridgeDeps,
): Promise<PronunciationAssessment> {
  const userAccessToken = deps.userAccessToken?.trim();
  if (!userAccessToken) {
    return failedPronunciation("missing_learner_jwt");
  }

  const audio = await resolveAudio(request, deps);
  if (!audio) {
    return failedPronunciation("missing_audio");
  }

  const endpoint = `${deps.functionBaseUrl.replace(/\/$/, "")}/azure-phoneme`;
  const response = await fetchWithRetry(endpoint, () => buildAzureForm(request, audio), {
    ...deps,
    userAccessToken,
  });
  if (!response.ok) return failedPronunciation(response.reason);

  let body: AzurePhonemeResponse;
  try {
    body = await response.value.json() as AzurePhonemeResponse;
  } catch {
    return failedPronunciation("azure_phoneme_invalid_json");
  }

  return normalizeAzurePhonemeResponse(body);
}

export function normalizeAzurePhonemeResponse(
  body: AzurePhonemeResponse,
): PronunciationAssessment {
  if (!isRecord(body) || body.ok !== true || body.provider !== "azure") {
    return failedPronunciation(
      isRecord(body) && body.reason
        ? `azure_phoneme_${String(body.reason)}`
        : "azure_phoneme_unavailable",
    );
  }

  const rawWordScores = Array.isArray(body.word_scores) ? body.word_scores : [];
  const wordScores = rawWordScores.map(normalizeWord).filter(Boolean) as NormalizedWordPronunciation[];
  const phonemeScores = wordScores.flatMap((word) => word.phonemes);
  const rawScore = scoreToNumber(body.score);
  const score = clampScore(
    rawScore !== null ? rawScore : average(phonemeScores.map((item) => item.score)),
  );
  const rawReason = evidenceReason(body, wordScores, phonemeScores, rawScore);

  return {
    ok: true,
    provider: "azure",
    score,
    level: levelFromPronunciation(score),
    confidence: confidenceFromEvidence(score, phonemeScores.length),
    wordScores,
    phonemeScores,
    flags: detectVietnamesePhonemeFlags(wordScores),
    ...(rawReason ? { rawReason } : {}),
  };
}

async function fetchWithRetry(
  endpoint: string,
  buildBody: () => FormData,
  deps: PhonemeBridgeDeps,
): Promise<{ ok: true; value: Response } | { ok: false; reason: string }> {
  const retryDelays = deps.retryDelaysMs ?? DEFAULT_RETRY_DELAYS_MS;
  const maxAttempts = retryDelays.length + 1;
  let lastReason = "azure_phoneme_network_error";

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      Math.max(1, deps.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    );

    try {
      const response = await deps.fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${deps.userAccessToken}`,
          apikey: deps.serviceRoleKey,
        },
        body: buildBody(),
        signal: controller.signal,
      });

      if (response.ok) return { ok: true, value: response };

      lastReason = `azure_phoneme_http_${response.status}`;
      if (!isRetryableStatus(response.status)) {
        return { ok: false, reason: lastReason };
      }
    } catch (err) {
      lastReason = isAbortError(err)
        ? "azure_phoneme_timeout"
        : "azure_phoneme_network_error";
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < retryDelays.length) {
      await sleep(Math.max(0, retryDelays[attempt]));
    }
  }

  return { ok: false, reason: lastReason };
}

function buildAzureForm(
  request: GradeSpeakingRequest,
  audio: { bytes: Uint8Array; contentType: string },
): FormData {
  const form = new FormData();
  form.append("audio", new Blob([audio.bytes], { type: audio.contentType }), "placement-speaking.wav");
  form.append("target_text", request.taskText);
  form.append("roomId", "placement-v3");
  form.append("lineId", request.promptId);
  if (request.accent) form.append("accent", request.accent);
  return form;
}

export function detectVietnamesePhonemeFlags(
  wordScores: NormalizedWordPronunciation[],
): PronunciationFlag[] {
  const lowFinals = wordScores.filter((word) => {
    const final = word.phonemes.at(-1);
    return final && isFinalConsonant(final.phoneme) && final.score < 60;
  });
  const thIssues = wordScores.flatMap((word) =>
    word.phonemes
      .filter((phoneme) => isThPhoneme(phoneme.phoneme) && phoneme.score < 70)
      .map(() => word.word),
  );
  const vowelReductions = wordScores.flatMap((word) =>
    word.phonemes
      .filter((phoneme) => isVowel(phoneme.phoneme) && phoneme.score < 55)
      .map(() => word.word),
  );

  const patternIds = new Set(
    VN_L1_INTERFERENCE_PATTERNS
      .filter((pattern) => pattern.category === "phonology")
      .map((pattern) => pattern.id),
  );

  return [
    patternIds.has("final-consonant-cluster-reduction")
      ? flag("final-consonant-cluster-reduction", "high", lowFinals.map((word) => word.word))
      : null,
    patternIds.has("th-stopping-and-fronting")
      ? flag("th-stopping-and-fronting", "med", thIssues)
      : null,
    patternIds.has("diphthong-monophthong-reduction")
      ? flag("diphthong-monophthong-reduction", "med", vowelReductions)
      : null,
  ].filter(Boolean) as PronunciationFlag[];
}

async function resolveAudio(
  request: GradeSpeakingRequest,
  deps: PhonemeBridgeDeps,
): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  if (request.audioBase64) {
    try {
      return {
        bytes: base64ToBytes(request.audioBase64),
        contentType: request.audioContentType || DEFAULT_CONTENT_TYPE,
      };
    } catch {
      return null;
    }
  }
  if (request.audioStoragePath && deps.loadAudioBytes) {
    const loaded = await deps.loadAudioBytes(request.audioStoragePath);
    if (!loaded) return null;
    return {
      bytes: loaded.bytes,
      contentType: loaded.contentType || request.audioContentType || DEFAULT_CONTENT_TYPE,
    };
  }
  return null;
}

function normalizeWord(raw: NonNullable<AzurePhonemeResponse["word_scores"]>[number]): NormalizedWordPronunciation | null {
  if (!isRecord(raw)) return null;
  const word = String(raw.word ?? "").trim();
  if (!word) return null;
  const seen = new Set<string>();
  const rawPhonemes = Array.isArray(raw.phonemes) ? raw.phonemes : [];
  const phonemes = rawPhonemes.map((phoneme) => {
    if (!isRecord(phoneme)) return null;
    const label = String(phoneme.phoneme ?? "").trim();
    if (!label) return null;
    const rawScore = scoreToNumber(phoneme.score);
    if (rawScore === null) return null;
    const score = clampScore(rawScore);
    const duplicateKey = `${word.toLowerCase()}:${label.toLowerCase()}`;
    if (seen.has(duplicateKey)) return null;
    seen.add(duplicateKey);
    return {
      word,
      phoneme: label,
      score,
      status: statusFromScore(score),
    };
  }).filter(Boolean) as NormalizedPhonemeScore[];
  const rawScore = scoreToNumber(raw.score);
  const score = clampScore(
    rawScore !== null ? rawScore : average(phonemes.map((phoneme) => phoneme.score)),
  );
  return {
    word,
    heard: String(raw.heard ?? raw.word ?? "").trim(),
    score,
    status: statusFromScore(score),
    phonemes,
  };
}

function evidenceReason(
  body: AzurePhonemeResponse,
  wordScores: NormalizedWordPronunciation[],
  phonemeScores: NormalizedPhonemeScore[],
  rawScore: number | null,
): string | undefined {
  if (rawScore === null && phonemeScores.length === 0) {
    return "azure_phoneme_missing_score_and_phonemes";
  }
  if (phonemeScores.length === 0) {
    return wordScores.length > 0
      ? "azure_phoneme_missing_phonemes"
      : "azure_phoneme_missing_word_scores";
  }
  const expectedWordCount = Array.isArray(body.word_scores) ? body.word_scores.length : 0;
  if (expectedWordCount > 0 && wordScores.length === 0) {
    return "azure_phoneme_malformed_word_scores";
  }
  return undefined;
}

function failedPronunciation(reason: string): PronunciationAssessment {
  return {
    ok: false,
    provider: "azure",
    score: 0,
    level: "A1",
    confidence: 0,
    wordScores: [],
    phonemeScores: [],
    flags: [],
    rawReason: reason,
  };
}

export function levelFromPronunciation(score: number) {
  if (score >= 92) return "C2";
  if (score >= 84) return "C1";
  if (score >= 74) return "B2";
  if (score >= 62) return "B1";
  if (score >= 45) return "A2";
  return "A1";
}

function confidenceFromEvidence(score: number, phonemeCount: number): number {
  if (phonemeCount === 0) return 0.2;
  const evidence = Math.min(0.25, phonemeCount / 80);
  const accuracy = score / 200;
  return clamp01(0.3 + evidence + accuracy);
}

function statusFromScore(score: number): "correct" | "close" | "wrong" {
  if (score >= 85) return "correct";
  if (score >= 60) return "close";
  return "wrong";
}

function flag(
  pattern: string,
  severity: PronunciationFlag["severity"],
  examples: string[],
): PronunciationFlag | null {
  const unique = [...new Set(examples.filter(Boolean))].slice(0, 4);
  return unique.length > 0 ? { pattern, severity, examples: unique } : null;
}

function isFinalConsonant(phoneme: string): boolean {
  return /^(t|d|k|g|p|b|s|z|ʃ|ʒ|tʃ|dʒ|f|v|θ|ð|m|n|ŋ|l|r)$/i.test(phoneme);
}

function isThPhoneme(phoneme: string): boolean {
  return phoneme === "θ" || phoneme === "ð" || /^th$/i.test(phoneme);
}

function isVowel(phoneme: string): boolean {
  return /^(i|ɪ|e|ɛ|æ|ɑ|ɒ|ɔ|ʊ|u|ʌ|ə|ɜ|eɪ|oʊ|aɪ|aʊ|ɔɪ)$/i.test(phoneme);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function scoreToNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function clamp01(raw: number): number {
  return Math.max(0, Math.min(1, Number(raw.toFixed(2))));
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function isAbortError(err: unknown): boolean {
  return typeof err === "object" &&
    err !== null &&
    "name" in err &&
    String((err as { name?: unknown }).name) === "AbortError";
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
