// src/lib/pronunciation/scoringEngine.ts
//
// Pronunciation scoring engine — v1.
//
// What this is:
//   A thin wrapper around the existing Azure Pronunciation Assessment
//   path (`./cloudScorer.ts → scoreCloud()`) that exposes a flatter,
//   simpler contract for the new pronunciation SRS feature
//   (pronunciation_srs_enabled, off by default).
//
// Why a separate file:
//   `scorer.ts` already defines `scorePronunciation` and a 2-field
//   `PhonemeScore` type, both built around word-level scoring with
//   nested phonemes. The SRS feature needs a TOP-LEVEL phoneme array
//   with extra fields (expected/got/position/confidence) so the spaced-
//   repetition scheduler can key off individual phonemes. Adding those
//   fields to the existing types would break ~20 call sites, so this
//   module owns the SRS-shaped contract and adapts the existing rich
//   result down to it.
//
// Provider hierarchy:
//   1. Azure (via `scoreCloud`) — full word + phoneme breakdown when
//      a Supabase JWT is available. Production path.
//   2. Stub fallback — when cloud is unreachable / the user is
//      anonymous / the daily Azure cap is hit, return a zero-confidence
//      stub so callers can render a "scoring unavailable, please try
//      again" UI instead of crashing.
//
// Limitations (v1, NOT production-grade):
//   - Cloud-only real scoring. There is no browser-side phoneme ASR;
//     the local `./scorer.ts` is a transcript-vs-target text aligner,
//     not a phoneme assessor.
//   - The stub fallback signals failure via `status: "scoring-failed"`
//     and returns `overallScore: null` + empty arrays. Callers MUST
//     branch on `status` and render a retry UI, never treat the result
//     as "scored 0".
//   - `expectedPhonemes` is informational only on this v1: when cloud
//     succeeds we trust Azure's per-phoneme breakdown; when cloud fails
//     we deliberately do NOT echo the expected phonemes back as fake
//     zero-score entries (would be indistinguishable from a real bad
//     attempt). The parameter is kept on the signature for forward
//     compatibility with a future drill-mode that targets specific
//     phonemes.
//   - Replace this engine with Speechace or a direct Azure SDK
//     integration before turning the SRS feature on for real users.
//
// Backend safety:
//   This module does NOT touch the new `pronunciation_srs_items` /
//   `vocabulary_srs_items` tables or any RPC. It only adapts existing
//   scoring infra into a shape the SRS scheduler can consume.

import { supabase } from "@/lib/supabaseClient";
import { scoreCloud } from "./cloudScorer";
import type { ScoreResult } from "./scorer";

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export interface PhonemeScore {
  /** Phoneme symbol — IPA-flavoured (Azure mixes IPA with SAPI tokens). */
  phoneme: string;
  /** 0..100 — provider's accuracy score for this phoneme. */
  score: number;
  /** Phoneme the learner was expected to produce at this position. */
  expected: string;
  /** Best-effort symbol of what the learner actually produced. May
   *  equal `expected` when only a score-deviation is known, or be empty
   *  when the provider returns no realisation hypothesis. */
  got: string;
  /** Zero-based position of this phoneme in the utterance. */
  position: number;
  /** 0..1 — provider self-reported confidence; in v1 this is derived
   *  from `score / 100` since Azure's assessment doesn't surface a
   *  separate confidence field. */
  confidence: number;
}

export interface PronunciationResult {
  /** Outcome marker. `"ok"` means the cloud provider returned a real
   *  assessment. `"scoring-failed"` means we couldn't score this
   *  attempt (anonymous user, network error, daily cap, Azure error)
   *  — callers MUST treat the rest of the result as empty/unknown
   *  and render a retry UI rather than a 0% score. */
  status: "ok" | "scoring-failed";
  /** 0..100 — overall pronunciation accuracy. `null` when
   *  `status === "scoring-failed"` so callers can distinguish
   *  "actually scored 0" from "couldn't score". */
  overallScore: number | null;
  /** Top-level, position-ordered phoneme breakdown. Empty when
   *  `status === "scoring-failed"`. */
  phonemeScores: PhonemeScore[];
  /** Distinct phonemes whose confidence < WEAK_CONFIDENCE_THRESHOLD
   *  (0.6). Order preserved by first-appearance. SRS scheduler uses
   *  this to pick targets. Empty when `status === "scoring-failed"`. */
  weakPhonemes: string[];
  /** Provider's transcription of what the learner said. Empty string
   *  when `status === "scoring-failed"`. */
  transcription: string;
  /** The reference sentence the learner was asked to read. */
  referenceText: string;
  /** Raw audio blob — passed through so the caller can re-score, store,
   *  or attach to a session attempt without re-recording. */
  audioBlob?: Blob;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Phonemes whose normalised confidence falls below this threshold are
 *  flagged as weak and surfaced to the SRS scheduler. Threshold is
 *  expressed on the 0..1 confidence scale (= 60 on the 0..100 score
 *  scale) so it composes with `PhonemeScore.confidence` directly. */
const WEAK_CONFIDENCE_THRESHOLD = 0.6;

/** Validity gates for cloud results — Azure occasionally returns
 *  `ok: true` with a degenerate payload (overallScore 0, no phoneme
 *  evidence, empty transcript, or pure-noise transcription) on poor-
 *  audio attempts. `isTrustedPronunciationResult` enforces every gate
 *  so a "0" never reaches the UI as a real score. Until we explicitly
 *  support true-zero scoring, 0 means scoring failure. */
const TRUSTED_MIN_TRANSCRIPTION_LENGTH = 2;
const TRUSTED_MIN_PHONEME_CONFIDENCE = 0.5;
/** Letter-class regex used by `hasUsableTranscriptionContent` to reject
 *  pure-punctuation / pure-digit / pure-whitespace transcriptions. The
 *  range covers ASCII Latin + Latin-1 Supplement + Latin Extended-A/B
 *  + Latin Extended Additional (Vietnamese diacritics). */
const LETTER_CLASS_RE = /[A-Za-zÀ-ɏḀ-ỿ]/;

/** Phonemes that Vietnamese L1 speakers most often mispronounce in
 *  English, with a short coaching label. Sourced from the existing
 *  `vn-phoneme-map.ts` problem-pair tables (TH→T, R↔L) plus the
 *  "Frequent Mispronunciations" set documented in
 *  reports/plan-phoneme-scoring-azure-2026-04-26.md. The SRS scheduler
 *  filters incoming `weakPhonemes` against this list to bias drill
 *  selection toward known-problem targets and away from
 *  ASR-flakiness false positives. */
export const VIETNAMESE_L1_PHONEME_TARGETS: ReadonlyArray<{
  phoneme: string;
  label: string;
}> = [
  { phoneme: "θ", label: "voiceless TH (think, three)" },
  { phoneme: "ð", label: "voiced TH (this, that)" },
  { phoneme: "r", label: "American R (right, around)" },
  { phoneme: "l", label: "L in coda (call, hill)" },
  { phoneme: "v", label: "V (very, never) — often confused with /z/" },
  { phoneme: "z", label: "Z (zoo, easy)" },
  { phoneme: "ʃ", label: "SH (she, fish)" },
  { phoneme: "ʒ", label: "ZH (measure, vision)" },
  { phoneme: "tʃ", label: "CH (chair, watch)" },
  { phoneme: "dʒ", label: "J (job, edge)" },
  { phoneme: "æ", label: "short A (cat, bad)" },
  { phoneme: "ʌ", label: "schwa-A (cup, much)" },
  { phoneme: "ɪ", label: "short I (sit, bit) vs long ee" },
  { phoneme: "iː", label: "long EE (seat, beat)" },
  { phoneme: "ə", label: "schwa (about, support)" },
  { phoneme: "t", label: "final T (cat, bit) — often dropped" },
  { phoneme: "d", label: "final D (bed, good) — often dropped" },
  { phoneme: "k", label: "final K (back, work) — often dropped" },
  { phoneme: "s", label: "final S (kiss, was)" },
];

/** Stable mock for tests, Storybook, and pre-cloud UI scaffolding.
 *  Mirrors a realistic VN-learner attempt at "I think the answer is
 *  three." with weakness on /θ/ and /r/. */
export const MOCK_PRONUNCIATION_RESULT: PronunciationResult = {
  status: "ok",
  overallScore: 72,
  referenceText: "I think the answer is three.",
  transcription: "I sink the answer is tree.",
  weakPhonemes: ["θ", "r"],
  phonemeScores: [
    { phoneme: "aɪ", score: 92, expected: "aɪ", got: "aɪ", position: 0, confidence: 0.92 },
    { phoneme: "θ", score: 38, expected: "θ", got: "s", position: 1, confidence: 0.38 },
    { phoneme: "ɪ", score: 85, expected: "ɪ", got: "ɪ", position: 2, confidence: 0.85 },
    { phoneme: "ŋ", score: 80, expected: "ŋ", got: "ŋ", position: 3, confidence: 0.80 },
    { phoneme: "k", score: 78, expected: "k", got: "k", position: 4, confidence: 0.78 },
    { phoneme: "ð", score: 88, expected: "ð", got: "ð", position: 5, confidence: 0.88 },
    { phoneme: "ə", score: 90, expected: "ə", got: "ə", position: 6, confidence: 0.90 },
    { phoneme: "æ", score: 82, expected: "æ", got: "æ", position: 7, confidence: 0.82 },
    { phoneme: "n", score: 95, expected: "n", got: "n", position: 8, confidence: 0.95 },
    { phoneme: "s", score: 88, expected: "s", got: "s", position: 9, confidence: 0.88 },
    { phoneme: "ɚ", score: 76, expected: "ɚ", got: "ə", position: 10, confidence: 0.76 },
    { phoneme: "ɪ", score: 84, expected: "ɪ", got: "ɪ", position: 11, confidence: 0.84 },
    { phoneme: "z", score: 90, expected: "z", got: "z", position: 12, confidence: 0.90 },
    { phoneme: "θ", score: 42, expected: "θ", got: "t", position: 13, confidence: 0.42 },
    { phoneme: "r", score: 55, expected: "r", got: "ɾ", position: 14, confidence: 0.55 },
    { phoneme: "iː", score: 86, expected: "iː", got: "iː", position: 15, confidence: 0.86 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a recorded utterance against a reference sentence.
 *
 * v1 behaviour:
 *   - Resolves the current Supabase JWT, calls `scoreCloud`
 *     (Azure Pronunciation Assessment via the existing edge fn),
 *     adapts the result into the flat `PronunciationResult` shape,
 *     and returns it.
 *   - On any cloud failure (anonymous user, network error, daily cap
 *     reached, Azure 5xx, conversion error), returns a fallback with
 *     `status: "scoring-failed"`, `overallScore: null`, and empty
 *     phoneme arrays. Callers MUST branch on `status` to render a
 *     retry UI rather than treating the result as a real 0% score.
 *
 * @param audioBlob       Raw recording (typically WebM/Opus from MediaRecorder).
 * @param referenceText   The sentence the learner was reading.
 * @param expectedPhonemes Reserved for a future drill-mode that will
 *                        target specific phonemes. Currently informational
 *                        only — when cloud succeeds Azure's breakdown
 *                        wins; when cloud fails we return an empty
 *                        phonemeScores array (NOT a zero-score skeleton)
 *                        so failure is unambiguous.
 */
export async function scorePronunciation(
  audioBlob: Blob,
  referenceText: string,
  expectedPhonemes?: readonly string[],
): Promise<PronunciationResult> {
  // 1. Resolve auth — anonymous users skip cloud and get the stub.
  let userJwt: string | undefined;
  try {
    const { data } = await supabase.auth.getSession();
    userJwt = data.session?.access_token;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[scoringEngine] getSession failed:", err);
    }
  }

  if (!userJwt) {
    if (import.meta.env.DEV) {
      console.warn(
        "[scoringEngine] no JWT — anonymous user, returning scoring-failed",
      );
    }
    return buildStubResult(referenceText, audioBlob);
  }

  // 2. Cloud scoring — wrap the existing Azure path.
  try {
    const cloud = await scoreCloud({
      audioBlob,
      target: referenceText,
      userJwt,
    });
    return adaptCloudResult(cloud, referenceText, audioBlob);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[scoringEngine] cloud scoring threw, returning scoring-failed:", err);
    }
    return buildStubResult(referenceText, audioBlob);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function adaptCloudResult(
  cloud: ScoreResult,
  referenceText: string,
  audioBlob: Blob,
): PronunciationResult {
  const phonemeScores: PhonemeScore[] = [];
  let position = 0;

  for (const word of cloud.wordScores) {
    const heard = word.heard ?? "";
    const phonemes = word.phonemes ?? [];
    for (const p of phonemes) {
      phonemeScores.push({
        phoneme: p.phoneme,
        score: p.score,
        expected: p.phoneme,
        // The cloud scorer surfaces `heard` per word, not per phoneme.
        // We attach the whole word's heard string so the UI can show
        // "expected /θ/ in 'think', heard 'sink'" without losing context.
        got: heard,
        position,
        confidence: clamp01(p.score / 100),
      });
      position += 1;
    }
  }

  const weakPhonemes = collectWeakPhonemes(phonemeScores);

  // Reconstruct transcription from the per-word `heard` strings — the
  // existing ScoreResult shape doesn't expose a single transcript.
  const transcription = cloud.wordScores
    .map((w) => (w.heard && w.heard.length > 0 ? w.heard : w.word))
    .filter((s) => s.length > 0)
    .join(" ");

  // Validity gate — only return status:"ok" when every signal is
  // usable. Any failure here demotes the attempt to "scoring-failed"
  // so a literal 0 / empty payload can never render as a real score.
  // The transcription is preserved through the failure path when it
  // contains usable letter content, so callers can show the learner
  // "we heard X but couldn't score it" instead of dropping the audio
  // recognition entirely.
  const candidate = {
    overallScore: cloud.overallScore,
    phonemeScores,
    transcription,
  };
  const trust = isTrustedPronunciationResult(candidate);
  if (!trust.trusted) {
    if (import.meta.env.DEV) {
      console.warn(
        `[scoringEngine] downgraded cloud ok→scoring-failed: ${trust.reason}`,
        {
          overallScore: cloud.overallScore,
          phonemeCount: phonemeScores.length,
          transcriptionLength: transcription.length,
          transcriptionPreview: transcription.slice(0, 60),
        },
      );
    }
    return buildStubResult(
      referenceText,
      audioBlob,
      hasUsableTranscriptionContent(transcription) ? transcription : "",
    );
  }

  return {
    status: "ok",
    overallScore: cloud.overallScore,
    phonemeScores,
    weakPhonemes,
    transcription,
    referenceText,
    audioBlob,
  };
}

/**
 * Decides whether a cloud-derived candidate result can be trusted
 * enough to surface as `status: "ok"` to the SRS scheduler / UI.
 *
 * Returns `{ trusted: true }` only when EVERY rule passes:
 *   - overallScore is a finite, > 0 number
 *   - phonemeScores is non-empty
 *   - transcription has usable letter content (not pure punctuation /
 *     digits / noise) and is at least
 *     TRUSTED_MIN_TRANSCRIPTION_LENGTH chars after trim
 *   - at least one phoneme has score > 0 OR confidence >=
 *     TRUSTED_MIN_PHONEME_CONFIDENCE — ensures we have at least one
 *     usable evidence point even if the overall score is low
 *
 * Otherwise returns `{ trusted: false, reason }`. The `reason` string
 * is dev-only diagnostics — callers should NOT key UI off it.
 */
export function isTrustedPronunciationResult(
  candidate: {
    overallScore: number | null | undefined;
    phonemeScores: PhonemeScore[];
    transcription: string;
  },
): { trusted: true } | { trusted: false; reason: string } {
  const { overallScore, phonemeScores, transcription } = candidate;

  if (overallScore == null) {
    return { trusted: false, reason: "overallScore is null/undefined" };
  }
  if (!Number.isFinite(overallScore)) {
    return { trusted: false, reason: "overallScore is not finite" };
  }
  if (overallScore <= 0) {
    return { trusted: false, reason: "overallScore <= 0" };
  }
  if (phonemeScores.length === 0) {
    return { trusted: false, reason: "phonemeScores is empty" };
  }
  if (!hasUsableTranscriptionContent(transcription)) {
    return {
      trusted: false,
      reason: "transcription empty, too short, or pure noise/punctuation",
    };
  }
  const hasUsableEvidence = phonemeScores.some(
    (p) => p.score > 0 || p.confidence >= TRUSTED_MIN_PHONEME_CONFIDENCE,
  );
  if (!hasUsableEvidence) {
    return {
      trusted: false,
      reason: `no phoneme with score>0 or confidence>=${TRUSTED_MIN_PHONEME_CONFIDENCE}`,
    };
  }

  return { trusted: true };
}

function hasUsableTranscriptionContent(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length < TRUSTED_MIN_TRANSCRIPTION_LENGTH) return false;
  // Reject strings whose entire content is punctuation / digits /
  // whitespace — Azure occasionally returns "..." or "—" on poor-audio.
  if (!LETTER_CLASS_RE.test(trimmed)) return false;
  return true;
}

/**
 * Build the failure-shape result. Always sets status:"scoring-failed",
 * overallScore:null, and empty arrays. Optionally preserves a partial
 * transcription so the caller can surface "we heard X but couldn't
 * score it" UX. The caller is responsible for only passing
 * transcriptions that already pass `hasUsableTranscriptionContent` —
 * we trust the input here so this stays a small, side-effect-free
 * helper.
 */
function buildStubResult(
  referenceText: string,
  audioBlob: Blob,
  preservedTranscription: string = "",
): PronunciationResult {
  return {
    status: "scoring-failed",
    overallScore: null,
    phonemeScores: [],
    weakPhonemes: [],
    transcription: preservedTranscription,
    referenceText,
    audioBlob,
  };
}

function collectWeakPhonemes(scores: PhonemeScore[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of scores) {
    if (p.confidence >= WEAK_CONFIDENCE_THRESHOLD) continue;
    if (seen.has(p.phoneme)) continue;
    seen.add(p.phoneme);
    out.push(p.phoneme);
  }
  return out;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
