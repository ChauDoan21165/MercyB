/**
 * EN→VN Vietnamese tone-contrast / listen-compare drill — EXTENSION SET.
 *
 * Namespaced extension of the minimal-tone-pair pattern in
 * `./minimal-pairs.ts`. CONTENT ONLY — this module is NOT imported by
 * `scoreTone.ts` or by any scorer / threshold file. It exists purely as
 * reviewable data + a syllable manifest for the TTS step.
 *
 * TRUST FLOOR (sacred): a WRONG tone correction is worse than NO tone
 * correction. The six Northern tones split into:
 *   - ABOVE floor (acoustically separable today, safer to score later):
 *     ngang (level), sắc (rising), huyền (falling), nặng (low-stopped).
 *   - BELOW floor (MUST stay abstained): hỏi and ngã. Southern dialect
 *     merges hỏi/ngã entirely. They appear here ONLY as listen-compare
 *     content (learner listens; no confident scoring) and are marked
 *     `trustFloor: 'below'` + `listenCompareOnly: true`. They are NOT
 *     promoted to scored drills, and NO scorer threshold is touched to
 *     force them to pass.
 *
 * NATIVE VALIDATION GATE: nothing here is native-clean until Chau signs
 * off. Every pair carries `needsChauValidation: true` and a Vietnamese
 * `validationNote` describing what Chau must confirm (correct word,
 * natural contour, regional caveat). If a syllable was not certain to be
 * a real Vietnamese word with that tone + meaning, it was DROPPED rather
 * than guessed.
 *
 * Audio path convention: `/audio/tones/<syllable>.mp3`. Audio binaries
 * are NOT committed here — Chau runs the TTS step (Azure vi-VN) later;
 * this module only enumerates the syllables needing generation.
 */

import type { MinimalTonePair, ToneTarget, ViTone } from "./minimal-pairs";

export type TrustFloor = "above" | "below";

export type PendingTonePair = MinimalTonePair & {
  /** ALWAYS true — nothing is native-clean until Chau signs off. */
  needsChauValidation: true;
  /** 'below' = listen-compare only, abstained from scoring. */
  trustFloor: TrustFloor;
  /** true whenever trustFloor === 'below'. */
  listenCompareOnly: boolean;
  /** VN note: what Chau must verify (correct word, natural contour, regional caveat). */
  validationNote: string;
};

/**
 * ASCII tone tag per ViTone — used in the storage-safe audio key.
 * Supabase Storage object keys must be ASCII, so the accented `ViTone`
 * name cannot appear in the key.
 */
const TONE_TAG: Record<ViTone, string> = {
  ngang: "ngang",
  sắc: "sac",
  huyền: "huyen",
  hỏi: "hoi",
  ngã: "nga",
  nặng: "nang",
};

/**
 * Strip every Vietnamese diacritic (tone marks AND base-vowel marks:
 * circumflex, breve, horn) to a plain-ASCII base, plus đ→d. NFD splits
 * precomposed letters into base + combining marks; we drop the marks.
 */
function asciiBase(syllable: string): string {
  return syllable
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Storage-safe audio key: `<ascii-base>-<tone>`. Plain ASCII `[a-z0-9-]`,
 * collision-free across this set, survives `getPublicUrl` unchanged, and
 * keeps the accented `syllable` field as the human/display value.
 * e.g. `xé`(sắc) → `xe-sac`, `của`(hỏi) → `cua-hoi`, `cũ`(ngã) → `cu-nga`.
 */
function toneAudioKey(syllable: string, tone: ViTone): string {
  return `${asciiBase(syllable)}-${TONE_TAG[tone]}`;
}

const audio = (syllable: string, tone: ViTone): string =>
  `/audio/tones/${toneAudioKey(syllable, tone)}.mp3`;

/** Tone shape labels reused from the minimal-pairs convention. */
const SHAPE: Record<ViTone, string> = {
  ngang: "level",
  sắc: "rising",
  huyền: "falling",
  hỏi: "dipping-rising",
  ngã: "broken-rising",
  nặng: "low-stopped",
};

const t = (syllable: string, tone: ViTone): ToneTarget => ({
  syllable,
  tone,
  shapeEn: SHAPE[tone],
  audioPath: audio(syllable, tone),
  source: "lane-c-en-vn-tone-extra",
});

/**
 * ABOVE-FLOOR pairs — contrasts among ngang / sắc / huyền / nặng only.
 * Real A1/A2 high-frequency Vietnamese words; near-minimal tone pairs.
 * Still pending Chau validation; nothing is wired to the scorer.
 */
const ABOVE_FLOOR: PendingTonePair[] = [
  {
    id: "xe-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [t("xe", "ngang"), t("xé", "sắc")],
    glossEn: "level vs rising — ‘vehicle’ vs ‘to tear’",
    glossVi: "ngang vs sắc — ‘xe’ (xe máy) vs ‘xé’ (xé giấy)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘xe’/‘xé’ và đường nét thanh ngang vs sắc tự nhiên giọng Bắc.",
  },
  {
    id: "an-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [t("an", "ngang"), t("án", "sắc")],
    glossEn: "level vs rising — ‘peace / safety’ vs ‘sentence / verdict’",
    glossVi: "ngang vs sắc — ‘an’ (bình an) vs ‘án’ (bản án)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘an’/‘án’ và đường nét thanh tự nhiên giọng Bắc.",
  },
  {
    id: "que-ngang-vs-huyen",
    family: "a1-vocab",
    contrast: [t("que", "ngang"), t("quê", "huyền")],
    glossEn: "level vs falling — ‘stick’ vs ‘hometown’",
    glossVi: "ngang vs huyền — ‘que’ (que tăm) vs ‘quê’ (quê hương)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘que’/‘quê’ và đường nét thanh ngang vs huyền tự nhiên giọng Bắc.",
  },
  {
    id: "co-ngang-vs-huyen",
    family: "a1-vocab",
    contrast: [t("co", "ngang"), t("cò", "huyền")],
    glossEn: "level vs falling — ‘to contract / shrink’ vs ‘stork / trigger’",
    glossVi: "ngang vs huyền — ‘co’ (co lại) vs ‘cò’ (con cò / cò súng)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘co’/‘cò’ và đường nét thanh ngang vs huyền.",
  },
  {
    id: "la-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [t("la", "ngang"), t("lá", "sắc")],
    glossEn: "level vs rising — ‘to shout / yell’ vs ‘leaf’",
    glossVi: "ngang vs sắc — ‘la’ (la hét) vs ‘lá’ (chiếc lá)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Chau đã duyệt (KEEP) — ‘la’ (la hét) vs ‘lá’ (chiếc lá).",
  },
  {
    id: "tra-ngang-vs-huyen",
    family: "a1-vocab",
    contrast: [t("tra", "ngang"), t("trà", "huyền")],
    glossEn: "level vs falling — ‘to look up / insert’ vs ‘tea’",
    glossVi: "ngang vs huyền — ‘tra’ (tra từ điển) vs ‘trà’ (uống trà)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘tra’/‘trà’ và đường nét thanh tự nhiên.",
  },
  {
    id: "gia-sac-vs-huyen",
    family: "a1-vocab",
    contrast: [t("giá", "sắc"), t("già", "huyền")],
    glossEn: "rising vs falling — ‘price / bean sprout’ vs ‘old (elderly)’",
    glossVi: "sắc vs huyền — ‘giá’ (giá tiền / giá đỗ) vs ‘già’ (người già)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận ‘giá’/‘già’ là cặp tối thiểu thật và nghĩa đúng.",
  },
  {
    id: "hoa-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [t("hoa", "ngang"), t("hóa", "sắc")],
    glossEn: "level vs rising — ‘flower’ vs ‘to transform / -ize’",
    glossVi: "ngang vs sắc — ‘hoa’ (bông hoa) vs ‘hóa’ (biến hóa)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘hoa’/‘hóa’ và đường nét thanh ngang vs sắc.",
  },
  {
    id: "ngon-ngang-vs-nang",
    family: "a1-vocab",
    contrast: [t("ngon", "ngang"), t("ngọn", "nặng")],
    glossEn: "level vs low-stopped — ‘tasty / delicious’ vs ‘treetop / classifier’",
    glossVi: "ngang vs nặng — ‘ngon’ (ăn ngon) vs ‘ngọn’ (ngọn cây / ngọn núi)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘ngon’/‘ngọn’ và đường nét thanh tự nhiên.",
  },
  {
    id: "ta-sac-vs-huyen",
    family: "a1-vocab",
    contrast: [t("tá", "sắc"), t("tà", "huyền")],
    glossEn: "rising vs falling — ‘a dozen’ vs ‘evil / slanting’",
    glossVi: "sắc vs huyền — ‘tá’ (một tá = 12) vs ‘tà’ (tà ác / tà áo)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘tá’/‘tà’ và đường nét thanh sắc vs huyền.",
  },
  {
    id: "lo-ngang-vs-nang",
    family: "a1-vocab",
    contrast: [t("lo", "ngang"), t("lọ", "nặng")],
    glossEn: "level vs low-stopped — ‘to worry’ vs ‘jar / bottle’",
    glossVi: "ngang vs nặng — ‘lo’ (lo lắng) vs ‘lọ’ (cái lọ)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘lo’/‘lọ’ và đường nét thanh tự nhiên giọng Bắc.",
  },
  {
    id: "thu-ngang-vs-sac",
    family: "a1-vocab",
    contrast: [t("thu", "ngang"), t("thú", "sắc")],
    glossEn: "level vs rising — ‘autumn / to collect’ vs ‘animal / pleasure’",
    glossVi: "ngang vs sắc — ‘thu’ (mùa thu / thu tiền) vs ‘thú’ (thú vật / thú vị)",
    needsChauValidation: true,
    trustFloor: "above",
    listenCompareOnly: false,
    validationNote: "Xác nhận nghĩa ‘thu’/‘thú’ và đường nét thanh ngang vs sắc tự nhiên giọng Bắc.",
  },
];

/**
 * BELOW-FLOOR pairs — any contrast touching hỏi or ngã. ABSTAINED from
 * scoring; LISTEN-COMPARE only (`listenCompareOnly: true`). Southern
 * speakers merge hỏi/ngã, so a confident automated correction here would
 * break the trust floor. These are presented for the learner's ear, not
 * for a pass/fail verdict.
 */
const BELOW_FLOOR: PendingTonePair[] = [
  {
    id: "cua-ngang-vs-hoi",
    family: "a1-vocab",
    contrast: [t("cua", "ngang"), t("của", "hỏi")],
    glossEn: "level vs dipping-rising — ‘crab’ vs ‘of / belonging to’ (LISTEN-COMPARE; hỏi abstained)",
    glossVi: "ngang vs hỏi — ‘cua’ (con cua) vs ‘của’ (sở hữu) — chỉ NGHE-SO-SÁNH, không chấm điểm",
    needsChauValidation: true,
    trustFloor: "below",
    listenCompareOnly: true,
    validationNote:
      "hỏi/ngã dưới ngưỡng — chỉ nghe-so-sánh. Xác nhận nghĩa ‘cua’/‘của’; KHÔNG đưa vào chấm điểm.",
  },
  {
    id: "ve-ngang-vs-ngax",
    family: "a1-vocab",
    contrast: [t("ve", "ngang"), t("vẽ", "ngã")],
    glossEn: "level vs broken-rising — ‘cicada’ vs ‘to draw’ (LISTEN-COMPARE; ngã abstained)",
    glossVi: "ngang vs ngã — ‘ve’ (con ve) vs ‘vẽ’ (vẽ tranh) — chỉ NGHE-SO-SÁNH, không chấm điểm",
    needsChauValidation: true,
    trustFloor: "below",
    listenCompareOnly: true,
    validationNote:
      "ngã dưới ngưỡng — chỉ nghe-so-sánh. Xác nhận nghĩa ‘ve’/‘vẽ’; KHÔNG đưa vào chấm điểm.",
  },
  {
    id: "bo-huyen-vs-hoi",
    family: "a1-vocab",
    contrast: [t("bò", "huyền"), t("bỏ", "hỏi")],
    glossEn: "falling vs dipping-rising — ‘cow’ vs ‘to drop / leave / give up’ (LISTEN-COMPARE; hỏi abstained)",
    glossVi: "huyền vs hỏi — ‘bò’ (con bò) vs ‘bỏ’ (bỏ đi) — chỉ NGHE-SO-SÁNH",
    needsChauValidation: true,
    trustFloor: "below",
    listenCompareOnly: true,
    validationNote:
      "Chau đã duyệt (KEEP, chỉ nghe-so-sánh) — ‘bò’ (con bò) vs ‘bỏ’ (bỏ đi); hỏi dưới ngưỡng, KHÔNG chấm điểm.",
  },
  {
    id: "hoi-vs-nga-cua-cux",
    family: "a1-vocab",
    contrast: [t("củ", "hỏi"), t("cũ", "ngã")],
    glossEn: "dipping-rising vs broken-rising — ‘root / tuber’ vs ‘old (used)’ (LISTEN-COMPARE; Southern merges this pair)",
    glossVi: "hỏi vs ngã — ‘củ’ (củ khoai) vs ‘cũ’ (đồ cũ) — giọng Nam thường gộp; chỉ NGHE-SO-SÁNH, không chấm điểm",
    needsChauValidation: true,
    trustFloor: "below",
    listenCompareOnly: true,
    validationNote:
      "Cặp hỏi/ngã thuần — giọng Nam gộp hoàn toàn. TUYỆT ĐỐI không chấm điểm. Xác nhận nghĩa ‘củ’/‘cũ’.",
  },
];

/**
 * The full extension set: above-floor (scorable later, after Chau
 * validation) + below-floor (listen-compare only, permanently abstained
 * until/unless the acoustic floor moves).
 */
export const TONE_CONTRAST_EXTRA: PendingTonePair[] = [
  ...ABOVE_FLOOR,
  ...BELOW_FLOOR,
];

/**
 * Distinct tone targets across the extension set — used by the
 * reference-audio generation script to enumerate the syllables needing
 * TTS. Deduplicated by syllable string (mirrors the
 * TONE_REFERENCE_SYLLABLES IIFE pattern in minimal-pairs.ts).
 */
export const TONE_CONTRAST_EXTRA_SYLLABLES: ToneTarget[] = (() => {
  const seen = new Map<string, ToneTarget>();
  for (const pair of TONE_CONTRAST_EXTRA) {
    for (const target of pair.contrast) {
      if (!seen.has(target.syllable)) {
        seen.set(target.syllable, target);
      }
    }
  }
  return [...seen.values()];
})();
