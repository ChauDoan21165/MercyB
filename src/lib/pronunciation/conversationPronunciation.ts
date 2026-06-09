// Conversation-turn English pronunciation scoring (C-owned DATA layer).
//
// Turns a REAL learner speech attempt into a stable, structured pronunciation
// result that Lane A can fold into the next conversation AI response (e.g.
// "Try 'think' again — your /θ/ sounded closer to /t/, common for Vietnamese
// speakers."). C returns data only; Lane A owns the conversation engine and
// decides how to phrase the feedback. This module does NOT build, import, or
// call the conversation/DeepSeek engine.
//
// Provider: Azure Speech pronunciation assessment ONLY (via the existing
// cloudScorer → azure-phoneme edge function). ElevenLabs is never used for
// scoring. On low confidence / poor audio / non-Azure fallback we return a
// retry state — never a fabricated number.
//
// ISOLATION: English pronunciation scoring is kept strictly separate from tone
// scoring. This module defines its OWN flag threshold and does not import any
// tone scorer, tone thresholds, tone normalization, or tone wording.

import {
  scorePronunciationWithStep7Fallback,
  type NormalizedPronunciationScoreResult,
} from "@/lib/pronunciation/cloudScorer";
import {
  buildEnglishPronunciationFeedbackDisplay,
  type EnglishPronunciationFeedbackCategory,
  type EnglishPronunciationFeedbackItem,
  type EnglishPronunciationScoreResult,
} from "@/lib/pronunciation/englishPronunciationFeedback";
import { PHONEME_SUBSTITUTIONS } from "@/lib/pronunciation/vn-phoneme-map";
import type { Accent } from "@/data/pronunciation/multiAccentReferences";

/**
 * English-pronunciation phoneme flag threshold. DELIBERATELY local to this
 * module — it must NOT be shared with the tone scorer's thresholds.
 */
export const CONVERSATION_PHONEME_FLAG_THRESHOLD = 85;

/** Minimum bytes for a recording to be treated as a real attempt. */
const MIN_REAL_AUDIO_BYTES = 1200;

export type ConversationPronunciationQuality =
  | "ok"
  | "low_confidence"
  | "no_audio"
  | "scoring_unavailable";

export type ConversationFlaggedPhoneme = {
  phoneme: string;
  score: number;
  flagged: boolean;
  expectedSound: string;
  observedOrLikelySound: string;
  /** Null when not flagged or no Vietnamese pattern applies. */
  vietnameseInterferencePattern: string | null;
  /** Learner-facing, low-shame, Vietnamese-calibrated hint. Null when not flagged. */
  learnerFacingHint: string | null;
};

export type ConversationWordPronunciation = {
  word: string;
  score: number;
  phonemes: ConversationFlaggedPhoneme[];
};

export type ConversationPronunciationCostCap = {
  remaining: number;
  limit: number;
};

/**
 * Stable contract Lane A consumes. `provider`/`mode` are fixed string literals
 * so the conversation layer can branch on them safely.
 */
export type ConversationPronunciationResult = {
  provider: "azure";
  mode: "english-pronunciation-conversation";
  /** Null whenever we did not get a real Azure measurement (no guessed number). */
  overallScore: number | null;
  words: ConversationWordPronunciation[];
  quality: ConversationPronunciationQuality;
  confidence: "ok" | "low";
  /** True when the learner should simply try the utterance again. */
  shouldAskRetry: boolean;
  /** Cost/cap metadata when the caller already knows it; otherwise null. */
  costCap: ConversationPronunciationCostCap | null;
};

export type ScoreConversationTurnInput = {
  /** Real learner recording (MediaRecorder blob). */
  audioBlob: Blob | null | undefined;
  /** The English sentence the learner was attempting. */
  target: string;
  /** Browser STT transcript (used by the honest local fallback path). */
  transcript?: string;
  /** Azure scoring enabled (premium/trial + cap gate decided by the caller). */
  step7Enabled: boolean;
  /** Bearer JWT for the edge function (required when step7Enabled). */
  userJwt?: string;
  accent?: Accent;
  supabaseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  /** Optional cap metadata to echo back to Lane A. */
  costCap?: ConversationPronunciationCostCap | null;
  /** Test seam: inject the underlying scorer. */
  scoreImpl?: typeof scorePronunciationWithStep7Fallback;
};

// Maps an English-feedback category to the sounds + Vietnamese interference
// label used in the structured output. Bilingual learner hint comes from the
// feedback item's own guidanceVi.
const CATEGORY_SOUNDS: Record<
  EnglishPronunciationFeedbackCategory,
  { expected: string; observed: string; pattern: string; symbols: string[] }
> = {
  theta_sound: {
    expected: "/θ/ or /ð/",
    observed: "/t/ or /d/",
    pattern: "th-stopping (Vietnamese /θ,ð/ → /t,d/)",
    symbols: ["th", "θ", "ð", "t", "d", "dh"],
  },
  final_consonant_deletion: {
    expected: "final consonant",
    observed: "(dropped)",
    pattern: "final consonant deletion (Vietnamese codas are limited)",
    symbols: [],
  },
  final_t_d_deletion: {
    expected: "final /t/ or /d/",
    observed: "(dropped)",
    pattern: "final /t,d/ deletion",
    symbols: ["t", "d"],
  },
  final_p_deletion: { expected: "final /p/", observed: "(dropped)", pattern: "final /p/ deletion", symbols: ["p"] },
  final_b_deletion: { expected: "final /b/", observed: "(dropped)", pattern: "final /b/ deletion", symbols: ["b"] },
  final_k_deletion: { expected: "final /k/", observed: "(dropped)", pattern: "final /k/ deletion", symbols: ["k"] },
  final_g_deletion: { expected: "final /g/", observed: "(dropped)", pattern: "final /g/ deletion", symbols: ["g"] },
  consonant_cluster: {
    expected: "consonant cluster",
    observed: "(simplified)",
    pattern: "consonant-cluster simplification",
    symbols: ["s", "t", "k", "st", "sk", "sp", "str"],
  },
  sh_s_contrast: { expected: "/ʃ/", observed: "/s/", pattern: "/ʃ/ → /s/", symbols: ["sh", "ʃ", "s"] },
  z_s_contrast: { expected: "/z/", observed: "/s/", pattern: "/z/ → /s/", symbols: ["z", "s"] },
  zh_sound: { expected: "/ʒ/", observed: "/z/ or /s/", pattern: "/ʒ/ substitution", symbols: ["zh", "ʒ"] },
  r_l_contrast: { expected: "/r/", observed: "/l/", pattern: "/r/–/l/ confusion", symbols: ["r", "l"] },
  v_w_contrast: { expected: "/v/", observed: "/w/ or /b/", pattern: "/v/–/w/ confusion", symbols: ["v", "w", "b"] },
  ending_s: {
    expected: "final /s/ or /z/",
    observed: "(dropped)",
    pattern: "missing plural / 3rd-person -s",
    symbols: ["s", "z"],
  },
  ending_ed: {
    expected: "final /t/, /d/ or /ɪd/",
    observed: "(dropped)",
    pattern: "missing past-tense -ed",
    symbols: ["t", "d", "ɪd", "id"],
  },
  word_stress: {
    expected: "stress on the stressed syllable",
    observed: "even syllable timing",
    pattern: "English word stress vs Vietnamese syllable timing",
    symbols: [],
  },
};

function emptyResult(
  quality: ConversationPronunciationQuality,
  costCap: ConversationPronunciationCostCap | null,
): ConversationPronunciationResult {
  return {
    provider: "azure",
    mode: "english-pronunciation-conversation",
    overallScore: null,
    words: [],
    quality,
    confidence: "low",
    shouldAskRetry: true,
    costCap,
  };
}

/** Adapt cloudScorer's normalized result into the English-feedback input shape. */
function toEnglishResult(
  result: NormalizedPronunciationScoreResult,
): EnglishPronunciationScoreResult {
  return {
    mode: "azure-batch",
    provider: "azure",
    overallScore: result.overallScore,
    words: (result.wordScores ?? []).map((w) => ({
      word: w.word,
      accuracyScore: w.score,
      phonemes: (w.phonemes ?? []).map((p) => ({
        phoneme: p.phoneme,
        accuracyScore: p.score,
      })),
    })),
    phonemeScores: (result.phonemeScores ?? []).map((p) => ({
      phoneme: p.phoneme,
      accuracyScore: p.score,
      word: p.word,
    })),
  };
}

/** Vietnamese interference for a flagged phoneme straight from the L1 sub map. */
function substitutionFor(phoneme: string): { pattern: string; hint: string; observed: string } | null {
  const key = phoneme.trim().toLowerCase();
  if (!key) return null;
  const rule = PHONEME_SUBSTITUTIONS.find((r) => r.target.replace(/\$$/, "") === key);
  if (!rule) return null;
  return {
    pattern: rule.labelEn,
    hint: rule.labelVi,
    observed: rule.substitute ? `/${rule.substitute}/` : "(dropped)",
  };
}

/**
 * Score one real learner conversation turn. Returns structured data only.
 * Never fabricates a number: empty/failed audio → no_audio retry; non-Azure
 * fallback or low confidence → low_confidence retry.
 */
export async function scoreConversationTurn(
  input: ScoreConversationTurnInput,
): Promise<ConversationPronunciationResult> {
  const costCap = input.costCap ?? null;

  // Cost discipline / real-attempt guard: never score empty/failed recordings.
  if (!input.audioBlob || input.audioBlob.size < MIN_REAL_AUDIO_BYTES) {
    return emptyResult("no_audio", costCap);
  }
  if (!input.target?.trim()) {
    return emptyResult("scoring_unavailable", costCap);
  }

  const scorer = input.scoreImpl ?? scorePronunciationWithStep7Fallback;
  let result: NormalizedPronunciationScoreResult;
  try {
    result = await scorer({
      audioBlob: input.audioBlob,
      target: input.target,
      transcript: input.transcript,
      step7Enabled: input.step7Enabled,
      userJwt: input.userJwt,
      accent: input.accent,
      supabaseUrl: input.supabaseUrl,
      fetchImpl: input.fetchImpl,
      timeoutMs: input.timeoutMs,
    });
  } catch {
    return emptyResult("low_confidence", costCap);
  }

  // Honest gating: only a real Azure per-phoneme measurement yields a number
  // and detail. The local sentence-match fallback → ask the learner to retry.
  const isAzure =
    !result.useLocalFallback &&
    result.provider === "azure" &&
    result.mode === "azure_phoneme_batch" &&
    Array.isArray(result.wordScores) &&
    result.wordScores.length > 0;
  if (!isAzure) {
    return { ...emptyResult("low_confidence", costCap), confidence: "low" };
  }

  // VN-specific feedback items (bilingual, name the exact word/sound), capped.
  const display = buildEnglishPronunciationFeedbackDisplay({
    targetSentence: input.target,
    result: toEnglishResult(result),
  });
  const itemByWord = new Map<string, EnglishPronunciationFeedbackItem>();
  for (const item of display?.items ?? []) {
    const key = item.targetWord.trim().toLowerCase();
    if (!itemByWord.has(key)) itemByWord.set(key, item);
  }

  const words: ConversationWordPronunciation[] = (result.wordScores ?? []).map((w) => {
    const item = itemByWord.get(w.word.trim().toLowerCase()) ?? null;
    const cat = item ? CATEGORY_SOUNDS[item.category] : null;
    let itemAttached = false;

    const phonemes: ConversationFlaggedPhoneme[] = (w.phonemes ?? []).map((p) => {
      const flagged = p.score < CONVERSATION_PHONEME_FLAG_THRESHOLD;
      if (!flagged) {
        return {
          phoneme: p.phoneme,
          score: p.score,
          flagged: false,
          expectedSound: `/${p.phoneme}/`,
          observedOrLikelySound: `/${p.phoneme}/`,
          vietnameseInterferencePattern: null,
          learnerFacingHint: null,
        };
      }
      // Prefer the rich, production VN feedback item when its category matches
      // this phoneme; otherwise fall back to the L1 substitution table.
      const symbolMatches = cat?.symbols.includes(p.phoneme.trim().toLowerCase());
      if (item && cat && (symbolMatches || cat.symbols.length === 0) && !itemAttached) {
        itemAttached = true;
        return {
          phoneme: p.phoneme,
          score: p.score,
          flagged: true,
          expectedSound: cat.expected,
          observedOrLikelySound: cat.observed,
          vietnameseInterferencePattern: cat.pattern,
          learnerFacingHint: item.guidanceVi,
        };
      }
      const sub = substitutionFor(p.phoneme);
      return {
        phoneme: p.phoneme,
        score: p.score,
        flagged: true,
        expectedSound: `/${p.phoneme}/`,
        observedOrLikelySound: sub?.observed ?? "unclear",
        vietnameseInterferencePattern: sub?.pattern ?? null,
        learnerFacingHint: sub?.hint ?? null,
      };
    });

    // A dropped sound may not appear as a low-scoring phoneme. If the word
    // carries a deletion/stress feedback item that wasn't attached above,
    // surface it as an explicit flagged entry so Lane A can name it.
    if (item && cat && !itemAttached) {
      phonemes.push({
        phoneme: cat.expected,
        score: 0,
        flagged: true,
        expectedSound: cat.expected,
        observedOrLikelySound: cat.observed,
        vietnameseInterferencePattern: cat.pattern,
        learnerFacingHint: item.guidanceVi,
      });
    }

    return { word: w.word, score: w.score, phonemes };
  });

  return {
    provider: "azure",
    mode: "english-pronunciation-conversation",
    overallScore: result.overallScore,
    words,
    quality: "ok",
    confidence: "ok",
    shouldAskRetry: false,
    costCap,
  };
}
