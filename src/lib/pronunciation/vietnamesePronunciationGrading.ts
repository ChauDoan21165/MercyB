import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";
import type { ExtractedPitchContour } from "./vietnameseToneScorer";
import { scoreVietnameseToneAttempt } from "./vietnameseToneScorer";

export type VietnameseToneName =
  | "level"
  | "falling"
  | "rising"
  | "dipping"
  | "broken-rising"
  | "heavy";

export type VietnameseToneId = "ngang" | "huyen" | "sac" | "hoi" | "nga" | "nang";

export type ToneSuppressionReason =
  | "low_voicing"
  | "low_confidence"
  | "ambiguous_contour"
  | "alignment_uncertain"
  | "native_ear_validation_required"
  | "missing_pitch_contour";

export type AzureVietnamesePhonemeScore = {
  phoneme: string;
  accuracy: number;
};

export type AzureVietnameseWordScore = {
  word: string;
  accuracy: number;
  errorType: string | null;
  offsetMs: number | null;
  durationMs: number | null;
  phonemes: AzureVietnamesePhonemeScore[];
};

export type AzureVietnamesePronunciationResult = {
  provider: "azure";
  locale: "vi-VN";
  targetText: string;
  displayText: string;
  overallAccuracy: number;
  fluency: number | null;
  prosody: number | null;
  words: AzureVietnameseWordScore[];
  raw: unknown;
};

export type VietnameseTargetSyllable = {
  syllable: string;
  normalized: string;
  toneId: VietnameseToneId;
  toneName: VietnameseToneName;
  wordIndex: number;
  syllableIndex: number;
};

export type VietnameseToneGrade = {
  syllable: VietnameseTargetSyllable;
  toneScore: number | null;
  correct: boolean | null;
  confidence: number;
  reason: ToneSuppressionReason | "contour_match" | "contour_mismatch";
  diagnosticOnly: true;
};

export type VietnamesePronunciationGradeResult = {
  targetText: string;
  syllables: VietnameseTargetSyllable[];
  azure: AzureVietnamesePronunciationResult;
  toneGrades: VietnameseToneGrade[];
  learnerToneDisplayAllowed: false;
};

export type AzureVietnameseRawResponse = {
  RecognitionStatus?: string;
  DisplayText?: string;
  NBest?: Array<{
    Display?: string;
    AccuracyScore?: number;
    FluencyScore?: number;
    ProsodyScore?: number;
    Words?: Array<{
      Word?: string;
      Offset?: number;
      Duration?: number;
      AccuracyScore?: number;
      ErrorType?: string;
      Phonemes?: Array<{
        Phoneme?: string;
        AccuracyScore?: number;
      }>;
    }>;
  }>;
};

export type ScoreVietnamesePronunciationV1Input = {
  audioBlob: Blob;
  targetText: string;
  userJwt: string;
  supabaseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  syllableContours?: Partial<Record<string, ExtractedPitchContour>>;
};

const DEFAULT_TIMEOUT_MS = 12_000;

const TONE_BY_MARK: Record<string, { id: VietnameseToneId; name: VietnameseToneName }> = {
  "\u0300": { id: "huyen", name: "falling" },
  "\u0301": { id: "sac", name: "rising" },
  "\u0309": { id: "hoi", name: "dipping" },
  "\u0303": { id: "nga", name: "broken-rising" },
  "\u0323": { id: "nang", name: "heavy" },
};

const TONE_TARGET_BY_ID = {
  ngang: "level",
  huyen: "falling",
  sac: "rising",
  hoi: "unsupported",
  nga: "unsupported",
  nang: "unsupported",
} as const;

export function normalizeAzureVietnamesePronunciation(
  response: AzureVietnameseRawResponse,
  targetText: string,
): AzureVietnamesePronunciationResult {
  const nbest = response.NBest?.[0];
  const words = (nbest?.Words ?? []).map((word): AzureVietnameseWordScore => ({
    word: String(word.Word ?? "").trim(),
    accuracy: clampScore(word.AccuracyScore),
    errorType: word.ErrorType ? String(word.ErrorType) : null,
    offsetMs: azureTicksToMs(word.Offset),
    durationMs: azureTicksToMs(word.Duration),
    phonemes: (word.Phonemes ?? [])
      .map((phoneme) => ({
        phoneme: String(phoneme.Phoneme ?? "").trim(),
        accuracy: clampScore(phoneme.AccuracyScore),
      }))
      .filter((phoneme) => phoneme.phoneme.length > 0),
  }));

  return {
    provider: "azure",
    locale: "vi-VN",
    targetText,
    displayText: String(response.DisplayText ?? nbest?.Display ?? "").trim(),
    overallAccuracy: clampScore(nbest?.AccuracyScore),
    fluency: nullableScore(nbest?.FluencyScore),
    prosody: nullableScore(nbest?.ProsodyScore),
    words,
    raw: response,
  };
}

export function segmentVietnameseTarget(targetText: string): VietnameseTargetSyllable[] {
  const syllables: VietnameseTargetSyllable[] = [];
  const words = targetText
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, ""))
    .filter(Boolean);

  words.forEach((word, wordIndex) => {
    const pieces = word.split(/[-.]/).filter(Boolean);
    pieces.forEach((piece) => {
      const tone = detectVietnameseTone(piece);
      syllables.push({
        syllable: piece,
        normalized: normalizeVietnameseSyllable(piece),
        toneId: tone.id,
        toneName: tone.name,
        wordIndex,
        syllableIndex: syllables.length,
      });
    });
  });

  return syllables;
}

export function buildVietnamesePronunciationGrade(input: {
  targetText: string;
  azure: AzureVietnamesePronunciationResult;
  syllableContours?: Partial<Record<string, ExtractedPitchContour>>;
}): VietnamesePronunciationGradeResult {
  const syllables = segmentVietnameseTarget(input.targetText);
  const alignmentCertain = isScriptedTargetAligned(input.azure, syllables);
  const toneGrades = syllables.map((syllable) =>
    gradeToneForSyllable(
      syllable,
      resolveSyllableContour(syllable, syllables, input.syllableContours),
      alignmentCertain,
    ),
  );

  return {
    targetText: input.targetText,
    syllables,
    azure: input.azure,
    toneGrades,
    learnerToneDisplayAllowed: false,
  };
}

export async function scoreVietnamesePronunciationV1(
  input: ScoreVietnamesePronunciationV1Input,
): Promise<VietnamesePronunciationGradeResult> {
  const supabaseUrl = resolveSupabaseUrl(input.supabaseUrl);
  if (!supabaseUrl) {
    throw new Error("missing_supabase_url");
  }

  const wavBlob = await blobToWavPcm16k(input.audioBlob);
  const formData = new FormData();
  formData.append("audio", wavBlob, "recording.wav");
  formData.append("target_text", input.targetText);
  formData.append("target_locale", "vi-VN");
  formData.append("context", "tone-drill");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const fetchImpl = input.fetchImpl ?? globalThis.fetch;
  let response: Response;
  try {
    response = await fetchImpl(`${supabaseUrl}/functions/v1/azure-phoneme`, {
      method: "POST",
      headers: { Authorization: `Bearer ${input.userJwt}` },
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`azure_vietnamese_pronunciation_http_${response.status}`);
  }

  const body = await response.json();
  if (body?.ok !== true) {
    throw new Error(`azure_vietnamese_pronunciation_unavailable:${String(body?.reason ?? "unknown")}`);
  }

  const azure = normalizeAzureVietnamesePronunciation(
    {
      RecognitionStatus: "Success",
      DisplayText: body.display_text ?? input.targetText,
      NBest: [
        {
          Display: body.display_text ?? input.targetText,
          AccuracyScore: body.overall_score ?? body.score,
          FluencyScore: body.fluency_score,
          ProsodyScore: body.prosody_score,
          Words: (body.word_scores ?? []).map((word: Record<string, unknown>) => ({
            Word: word.word,
            Offset: word.offset,
            Duration: word.duration,
            AccuracyScore: word.score,
            ErrorType: word.error_type,
            Phonemes: word.phonemes,
          })),
        },
      ],
    },
    input.targetText,
  );

  return buildVietnamesePronunciationGrade({
    targetText: input.targetText,
    azure,
    syllableContours: input.syllableContours,
  });
}

export function isScriptedTargetAligned(
  azure: Pick<AzureVietnamesePronunciationResult, "words">,
  syllables: VietnameseTargetSyllable[],
): boolean {
  if (azure.words.length === 0 || syllables.length === 0) return false;
  const expectedWords = groupTargetWords(syllables);
  if (azure.words.length !== expectedWords.length) return false;
  return azure.words.every((word, index) => {
    if (word.accuracy < 45 || word.errorType === "Omission") return false;
    return normalizeAlignmentWord(word.word) === normalizeAlignmentWord(expectedWords[index]);
  });
}

function groupTargetWords(syllables: VietnameseTargetSyllable[]): string[] {
  const words: string[] = [];
  syllables.forEach((syllable) => {
    words[syllable.wordIndex] = [words[syllable.wordIndex], syllable.syllable].filter(Boolean).join("-");
  });
  return words.filter(Boolean);
}

function resolveSyllableContour(
  syllable: VietnameseTargetSyllable,
  allSyllables: VietnameseTargetSyllable[],
  contours: Partial<Record<string, ExtractedPitchContour>> | undefined,
): ExtractedPitchContour | undefined {
  if (!contours) return undefined;

  const explicitKeys = [
    `syllable:${syllable.syllableIndex}`,
    `${syllable.wordIndex}:${syllable.syllableIndex}`,
    syllable.syllable,
  ];
  for (const key of explicitKeys) {
    const contour = contours[key];
    if (contour) return contour;
  }

  const normalizedIsUnique =
    allSyllables.filter((candidate) => candidate.normalized === syllable.normalized).length === 1;
  return normalizedIsUnique ? contours[syllable.normalized] : undefined;
}

function gradeToneForSyllable(
  syllable: VietnameseTargetSyllable,
  contour: ExtractedPitchContour | undefined,
  alignmentCertain: boolean,
): VietnameseToneGrade {
  if (!alignmentCertain) {
    return suppressed(syllable, "alignment_uncertain", 0);
  }
  if (!contour) {
    return suppressed(syllable, "missing_pitch_contour", 0);
  }
  if (contour.voicedRatio < 0.45) {
    return suppressed(syllable, "low_voicing", contour.extractionConfidence);
  }
  if (contour.extractionConfidence < 0.5) {
    return suppressed(syllable, "low_confidence", contour.extractionConfidence);
  }

  const result = scoreVietnameseToneAttempt({
    contour,
    target: {
      syllable: syllable.syllable,
      tone: syllable.toneId,
      expectedContour: TONE_TARGET_BY_ID[syllable.toneId],
    },
  });

  if (result.score === null) {
    return suppressed(
      syllable,
      result.reason === "unsupported-tone-for-mvp" ? "native_ear_validation_required" : "ambiguous_contour",
      result.confidence,
    );
  }

  return {
    syllable,
    toneScore: Math.round(result.score * 100),
    correct: result.bucket === "close",
    confidence: result.confidence,
    reason: result.bucket === "close" ? "contour_match" : "contour_mismatch",
    diagnosticOnly: true,
  };
}

function detectVietnameseTone(syllable: string): { id: VietnameseToneId; name: VietnameseToneName } {
  const decomposed = syllable.normalize("NFD");
  for (const mark of decomposed) {
    const tone = TONE_BY_MARK[mark];
    if (tone) return tone;
  }
  return { id: "ngang", name: "level" };
}

function normalizeVietnameseSyllable(syllable: string): string {
  return syllable
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300\u0301\u0309\u0303\u0323]/g, "")
    .normalize("NFC");
}

function normalizeAlignmentWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, "");
}

function suppressed(
  syllable: VietnameseTargetSyllable,
  reason: ToneSuppressionReason,
  confidence: number,
): VietnameseToneGrade {
  return {
    syllable,
    toneScore: null,
    correct: null,
    confidence: clamp01(confidence),
    reason,
    diagnosticOnly: true,
  };
}

function resolveSupabaseUrl(override?: string): string | null {
  if (override?.trim()) return override.trim().replace(/\/+$/, "");
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
    const url = env?.VITE_SUPABASE_URL ?? "";
    return url.trim() ? url.trim().replace(/\/+$/, "") : null;
  } catch {
    return null;
  }
}

function azureTicksToMs(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value / 10_000);
}

function nullableScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return clampScore(value);
}

function clampScore(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
