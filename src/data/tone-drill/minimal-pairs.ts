/**
 * §15 Axis 2 Bar #2 — Vietnamese tone production drill set.
 *
 * 12 minimal-tone contrasts sourced from the existing Vietnamese-
 * for-foreigners curriculum (NOT new authoring). The canonical
 * ma×6 set anchors to `src/languages/vietnamese/lessons-a1.ts:1746`
 * (lesson 37, "Pronunciation: The Six Tones Of Ma"). The remaining
 * six pairs draw from A1-level high-frequency vocabulary.
 *
 * Tone names use the canonical Vietnamese terms (`ngang`, `sắc`,
 * `huyền`, `hỏi`, `ngã`, `nặng`). Bias: six Northern tones. Southern
 * dialect collapses `hỏi`/`ngã`; the drill UI surfaces a tolerance
 * disclosure (see docs/axis-2/tone-production-design.md §2).
 *
 * Audio fixture files live in `public/audio/tones/`. They are
 * generated via `scripts/generate-tone-references.ts` (Azure TTS
 * vi-VN, run by an operator with AZURE_SPEECH_KEY). The audio
 * binaries are NOT committed by the agent — Chau commits them
 * after running the TTS step.
 */

export type ViTone = "ngang" | "sắc" | "huyền" | "hỏi" | "ngã" | "nặng";

export type ToneTarget = {
  /** The Vietnamese syllable, with its tone mark. */
  syllable: string;
  /** Canonical Vietnamese tone name. */
  tone: ViTone;
  /** English shape label — used in result-row copy. */
  shapeEn: string;
  /** Public path for the reference audio clip. */
  audioPath: string;
  /** Source anchor for review traceability. */
  source: string;
};

export type MinimalTonePair = {
  /** Stable id (kebab-case, append-only). */
  id: string;
  /** Family — `canonical-ma` for the ma×6 anchor; `a1-vocab` for the rest. */
  family: "canonical-ma" | "a1-vocab";
  /** Two contrasting tone targets sharing the same base segment. */
  contrast: [ToneTarget, ToneTarget];
  /** One-line learner-facing gloss in English. */
  glossEn: string;
  /** One-line learner-facing gloss in Vietnamese. */
  glossVi: string;
};

const audio = (syllable: string): string => `/audio/tones/${syllable}.mp3`;

/**
 * The canonical six-tone set, paired into five adjacent contrasts.
 * Every tone appears at least once; the spec test exercises the
 * `má` (sắc) vs `mã` (ngã) pair specifically — the hardest adjacent-
 * tone distinction for English-L1 learners and the Southern honour-
 * zone (see design §6).
 */
const CANONICAL_MA: MinimalTonePair[] = [
  {
    id: "ma-ngang-vs-sac",
    family: "canonical-ma",
    contrast: [
      { syllable: "ma", tone: "ngang", shapeEn: "level", audioPath: audio("ma"), source: "lessons-a1.ts:1755" },
      { syllable: "má", tone: "sắc", shapeEn: "rising", audioPath: audio("má"), source: "lessons-a1.ts:1755" },
    ],
    glossEn: "level vs rising — ‘ghost’ vs ‘mom / cheek’",
    glossVi: "ngang vs sắc — phân biệt giọng phẳng và giọng lên",
  },
  {
    id: "ma-ngang-vs-huyen",
    family: "canonical-ma",
    contrast: [
      { syllable: "ma", tone: "ngang", shapeEn: "level", audioPath: audio("ma"), source: "lessons-a1.ts:1755" },
      { syllable: "mà", tone: "huyền", shapeEn: "falling", audioPath: audio("mà"), source: "lessons-a1.ts:1755" },
    ],
    glossEn: "level vs falling — ‘ghost’ vs ‘but / that’",
    glossVi: "ngang vs huyền — phân biệt giọng phẳng và giọng xuống",
  },
  {
    id: "ma-sac-vs-nga",
    family: "canonical-ma",
    contrast: [
      { syllable: "má", tone: "sắc", shapeEn: "rising", audioPath: audio("má"), source: "lessons-a1.ts:1755" },
      { syllable: "mã", tone: "ngã", shapeEn: "broken-rising", audioPath: audio("mã"), source: "lessons-a1.ts:1755" },
    ],
    glossEn: "rising vs broken-rising — ‘mom / cheek’ vs ‘horse / code’ (the spec-test pair)",
    glossVi: "sắc vs ngã — phân biệt giọng lên và giọng gãy-lên (Mercy chấm điểm cặp này trong bài kiểm tra)",
  },
  {
    id: "ma-hoi-vs-nga",
    family: "canonical-ma",
    contrast: [
      { syllable: "mả", tone: "hỏi", shapeEn: "dipping-rising", audioPath: audio("mả"), source: "lessons-a1.ts:1755" },
      { syllable: "mã", tone: "ngã", shapeEn: "broken-rising", audioPath: audio("mã"), source: "lessons-a1.ts:1755" },
    ],
    glossEn: "dipping-rising vs broken-rising — ‘grave’ vs ‘horse / code’ (Southern speakers commonly merge this pair)",
    glossVi: "hỏi vs ngã — giọng miền Nam thường gộp hai dấu này, bạn không bị trừ điểm nếu phát âm theo giọng quê",
  },
  {
    id: "ma-sac-vs-nang",
    family: "canonical-ma",
    contrast: [
      { syllable: "má", tone: "sắc", shapeEn: "rising", audioPath: audio("má"), source: "lessons-a1.ts:1755" },
      { syllable: "mạ", tone: "nặng", shapeEn: "low-stopped", audioPath: audio("mạ"), source: "lessons-a1.ts:1761" },
    ],
    glossEn: "rising vs low-stopped — ‘mom / cheek’ vs ‘rice seedling’",
    glossVi: "sắc vs nặng — phân biệt giọng lên và giọng thấp-ngắt",
  },
  {
    id: "ma-huyen-vs-hoi",
    family: "canonical-ma",
    contrast: [
      { syllable: "mà", tone: "huyền", shapeEn: "falling", audioPath: audio("mà"), source: "lessons-a1.ts:1755" },
      { syllable: "mả", tone: "hỏi", shapeEn: "dipping-rising", audioPath: audio("mả"), source: "lessons-a1.ts:1755" },
    ],
    glossEn: "falling vs dipping-rising — ‘but / that’ vs ‘grave’",
    glossVi: "huyền vs hỏi — giọng xuống và giọng cong (xuống rồi lên)",
  },
];

/**
 * Six A1-vocabulary contrasts drawn from high-frequency lessons in
 * `src/languages/vietnamese/lessons-a1.ts`. These are real words a
 * learner has already seen by mid-A1, not invented syllables.
 */
const A1_VOCAB: MinimalTonePair[] = [
  {
    id: "la-vs-la-sac",
    family: "a1-vocab",
    contrast: [
      { syllable: "la", tone: "ngang", shapeEn: "level", audioPath: audio("la"), source: "lessons-a1.ts:A1 vocab" },
      { syllable: "lá", tone: "sắc", shapeEn: "rising", audioPath: audio("lá"), source: "lessons-a1.ts:A1 vocab" },
    ],
    glossEn: "level vs rising — ‘to scold’ vs ‘leaf’",
    glossVi: "ngang vs sắc — ‘la’ (mắng) vs ‘lá’ (lá cây)",
  },
  {
    id: "ba-vs-ba-huyen",
    family: "a1-vocab",
    contrast: [
      { syllable: "ba", tone: "ngang", shapeEn: "level", audioPath: audio("ba"), source: "lessons-a1.ts:family terms" },
      { syllable: "bà", tone: "huyền", shapeEn: "falling", audioPath: audio("bà"), source: "lessons-a1.ts:family terms" },
    ],
    glossEn: "level vs falling — ‘three / dad’ vs ‘grandmother’",
    glossVi: "ngang vs huyền — ‘ba’ (số ba / cha) vs ‘bà’ (bà nội/ngoại)",
  },
  {
    id: "ca-sac-vs-huyen",
    family: "a1-vocab",
    contrast: [
      { syllable: "cá", tone: "sắc", shapeEn: "rising", audioPath: audio("cá"), source: "lessons-a1.ts:food" },
      { syllable: "cà", tone: "huyền", shapeEn: "falling", audioPath: audio("cà"), source: "lessons-a1.ts:food" },
    ],
    glossEn: "rising vs falling — ‘fish’ vs ‘tomato / eggplant’",
    glossVi: "sắc vs huyền — ‘cá’ (con cá) vs ‘cà’ (cà chua, cà tím)",
  },
  {
    id: "co-sac-vs-nang",
    family: "a1-vocab",
    contrast: [
      { syllable: "có", tone: "sắc", shapeEn: "rising", audioPath: audio("có"), source: "lessons-a1.ts:high-frequency" },
      { syllable: "cọ", tone: "nặng", shapeEn: "low-stopped", audioPath: audio("cọ"), source: "lessons-a1.ts:high-frequency" },
    ],
    glossEn: "rising vs low-stopped — ‘to have’ vs ‘to rub / scrub’",
    glossVi: "sắc vs nặng — ‘có’ (có cái gì đó) vs ‘cọ’ (cọ rửa)",
  },
  {
    id: "toi-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [
      { syllable: "tôi", tone: "ngang", shapeEn: "level", audioPath: audio("tôi"), source: "lessons-a1.ts:daily" },
      { syllable: "tối", tone: "sắc", shapeEn: "rising", audioPath: audio("tối"), source: "lessons-a1.ts:daily" },
    ],
    glossEn: "level vs rising — ‘I’ vs ‘evening / dark’",
    glossVi: "ngang vs sắc — ‘tôi’ (đại từ ngôi 1) vs ‘tối’ (buổi tối / tối)",
  },
  {
    id: "ban-sac-vs-nang",
    family: "a1-vocab",
    contrast: [
      { syllable: "bán", tone: "sắc", shapeEn: "rising", audioPath: audio("bán"), source: "lessons-a1.ts:high-frequency" },
      { syllable: "bạn", tone: "nặng", shapeEn: "low-stopped", audioPath: audio("bạn"), source: "lessons-a1.ts:high-frequency" },
    ],
    glossEn: "rising vs low-stopped — ‘to sell’ vs ‘friend’",
    glossVi: "sắc vs nặng — ‘bán’ (bán hàng) vs ‘bạn’ (bạn bè)",
  },
];

export const TONE_DRILL_PAIRS: readonly MinimalTonePair[] = [
  ...CANONICAL_MA,
  ...A1_VOCAB,
];

/**
 * Distinct tone targets across the whole drill set — used by the
 * reference-audio generation script to enumerate the syllables
 * needing TTS. Deduplicated by syllable string.
 */
export const TONE_REFERENCE_SYLLABLES: readonly ToneTarget[] = (() => {
  const seen = new Map<string, ToneTarget>();
  for (const pair of TONE_DRILL_PAIRS) {
    for (const target of pair.contrast) {
      if (!seen.has(target.syllable)) {
        seen.set(target.syllable, target);
      }
    }
  }
  return [...seen.values()];
})();

/**
 * The pair the spec test exercises — `má` (sắc) vs `mã` (ngã). The
 * hardest adjacent-tone distinction in the six-tone set and the
 * Southern honour-zone (see design §6).
 */
export const SPEC_TEST_PAIR_ID = "ma-sac-vs-nga" as const;
