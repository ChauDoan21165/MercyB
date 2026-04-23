/**
 * Vietnamese-speaker phoneme substitution table.
 *
 * When a Vietnamese learner says an English word, certain sounds tend to
 * come out "wrong" by a native-English standard but are **systematically**
 * substituted — not random guesses. We give partial credit for those so
 * the overall pronunciation score reflects intelligibility, not accent.
 *
 * Two layers of data:
 *   1. `PHONEME_SUBSTITUTIONS` — sound-level rules ("th → t gets 75%
 *      credit"). The scorer derives acceptable variants at runtime.
 *   2. `WORD_OVERRIDES` — explicit word→variant mappings for common
 *      cases where the sound rule is too narrow (whole-syllable shifts,
 *      unreleased stops, final-consonant deletions).
 *
 * Credit values:
 *   1.00 = exact match (reserved for the scorer; not used here)
 *   0.85 = very close, ship-it at scoring time (e.g. final -s drop)
 *   0.75 = recognisable, common L1-transfer substitution
 *   0.60 = significant drift but still identifiable
 *   below 0.60 → treat as wrong, not close
 *
 * Curated list. Keep additions judgement-driven, not encyclopedic —
 * we're biased toward "would a Vietnamese teacher call this acceptable
 * for a beginner?" rather than phonetic textbook truth.
 */

export type PhonemeSubRule = {
  /** The English target sound (rough spelling, not IPA). */
  target: string;
  /** What Vietnamese speakers often say instead. */
  substitute: string;
  /** Partial-credit value 0..1. */
  credit: number;
  /** Short label for feedback messages (EN). */
  labelEn: string;
  /** Short label for feedback messages (VN). */
  labelVi: string;
};

/**
 * Substitution rules applied at word-level via simple string replace.
 * Order matters: earlier rules apply first when building variants.
 */
export const PHONEME_SUBSTITUTIONS: PhonemeSubRule[] = [
  // Voiceless "th" → "t" (think, thank, three)
  { target: 'th', substitute: 't',  credit: 0.75,
    labelEn: 'th → t (tongue between teeth for th)',
    labelVi: 'th → t (để lưỡi giữa hai hàm răng khi phát âm "th")' },
  // Voiceless "th" → "f" (less common in VN, but happens)
  { target: 'th', substitute: 'f',  credit: 0.60,
    labelEn: 'th → f', labelVi: 'th → f' },
  // v → b (very → bery, live → libe)
  { target: 'v',  substitute: 'b',  credit: 0.70,
    labelEn: 'v → b (lip + teeth for v, not two lips)',
    labelVi: 'v → b ("v" cần răng chạm môi, không phải hai môi)' },
  // z → s (zebra → sebra, was → wass)
  { target: 'z',  substitute: 's',  credit: 0.80,
    labelEn: 'z → s (add a buzz for z)',
    labelVi: 'z → s (thêm tiếng "rung" cho "z")' },
  // sh → s (she → se)
  { target: 'sh', substitute: 's',  credit: 0.70,
    labelEn: 'sh → s (round the lips for sh)',
    labelVi: 'sh → s (tròn môi khi phát âm "sh")' },
  // j → d (judge → dudge) or j → z in some regions
  { target: 'j',  substitute: 'd',  credit: 0.65,
    labelEn: 'j → d', labelVi: 'j → d' },
  // r → l (some northern VN speakers flip these)
  { target: 'r',  substitute: 'l',  credit: 0.70,
    labelEn: 'r → l', labelVi: 'r → l' },
  { target: 'l',  substitute: 'n',  credit: 0.70,
    labelEn: 'l → n (tip of tongue touches ridge behind teeth for l)',
    labelVi: 'l → n (đầu lưỡi chạm lợi trên cho âm "l")' },
  // Final -s drop (books → book)
  { target: 's$', substitute: '',   credit: 0.85,
    labelEn: 'final -s dropped (English marks plural / 3rd-person on the word)',
    labelVi: 'mất âm "s" cuối (tiếng Anh đánh dấu số nhiều / ngôi thứ 3 bằng âm này)' },
  // Final -ed drop (walked → walk)
  { target: 'ed$', substitute: '',  credit: 0.85,
    labelEn: 'final -ed dropped (past tense cue)',
    labelVi: 'mất âm "ed" cuối (dấu chỉ thì quá khứ)' },
];

/**
 * Whole-word overrides for high-frequency learner targets where sound-
 * level rules miss. Each entry lists accepted variants with explicit
 * credit values.
 */
export const WORD_OVERRIDES: Record<
  string,
  Array<{ variant: string; credit: number }>
> = {
  think:   [{ variant: 'tink',  credit: 0.75 }, { variant: 'fink',  credit: 0.60 }],
  thank:   [{ variant: 'tank',  credit: 0.75 }],
  three:   [{ variant: 'tree',  credit: 0.75 }, { variant: 'free',  credit: 0.60 }],
  that:    [{ variant: 'dat',   credit: 0.75 }, { variant: 'zat',   credit: 0.60 }],
  the:     [{ variant: 'da',    credit: 0.75 }, { variant: 'de',    credit: 0.75 }],
  very:    [{ variant: 'bery',  credit: 0.70 }],
  live:    [{ variant: 'libe',  credit: 0.70 }, { variant: 'lib',   credit: 0.65 }],
  love:    [{ variant: 'lob',   credit: 0.65 }, { variant: 'lop',   credit: 0.55 }],
  she:     [{ variant: 'se',    credit: 0.70 }],
  ship:    [{ variant: 'sip',   credit: 0.70 }],
  juice:   [{ variant: 'duice', credit: 0.65 }, { variant: 'dus',   credit: 0.55 }],
  zoo:     [{ variant: 'su',    credit: 0.80 }],
  little:  [{ variant: 'lit-tuh', credit: 0.80 }, { variant: 'littuh', credit: 0.80 }],
  people:  [{ variant: 'pipo',  credit: 0.70 }, { variant: 'peepo', credit: 0.75 }],
  water:   [{ variant: 'wader', credit: 0.80 }, { variant: 'woder', credit: 0.75 }],
};

/**
 * Given a target English word, return the variants we'll accept with
 * partial credit. Includes the WORD_OVERRIDES entries plus a few
 * machine-generated variants from PHONEME_SUBSTITUTIONS.
 *
 * The generated variants are conservative — one substitution at a time,
 * not combinatorial — to avoid runaway false positives.
 */
export function getAcceptedVariants(
  targetWord: string,
): Array<{ variant: string; credit: number; rule?: PhonemeSubRule }> {
  const word = String(targetWord || '').toLowerCase().trim();
  if (!word) return [];

  const out: Array<{ variant: string; credit: number; rule?: PhonemeSubRule }> = [];

  // 1) Hand-curated overrides.
  const overrides = WORD_OVERRIDES[word];
  if (overrides) {
    for (const o of overrides) {
      out.push({ variant: o.variant, credit: o.credit });
    }
  }

  // 2) Machine-generated, one substitution at a time.
  for (const rule of PHONEME_SUBSTITUTIONS) {
    const isAnchor = rule.target.endsWith('$');
    const targetRaw = isAnchor ? rule.target.slice(0, -1) : rule.target;
    if (isAnchor) {
      if (word.endsWith(targetRaw) && targetRaw.length > 0) {
        const variant = word.slice(0, word.length - targetRaw.length) + rule.substitute;
        if (variant !== word) out.push({ variant, credit: rule.credit, rule });
      }
    } else if (word.includes(targetRaw)) {
      const variant = word.split(targetRaw).join(rule.substitute);
      if (variant !== word) out.push({ variant, credit: rule.credit, rule });
    }
  }

  // Dedupe by (variant) — keep the highest-credit entry.
  const best = new Map<string, { variant: string; credit: number; rule?: PhonemeSubRule }>();
  for (const v of out) {
    const prev = best.get(v.variant);
    if (!prev || v.credit > prev.credit) best.set(v.variant, v);
  }
  return Array.from(best.values());
}
