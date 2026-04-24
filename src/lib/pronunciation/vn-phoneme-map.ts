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

// ────────────────────────────────────────────────────────────────────────
// Phoneme tips — actionable teaching when a learner scores below band.
//
// PHONEME_SUBSTITUTIONS / WORD_OVERRIDES tell the scorer "this swap is
// partially acceptable." PHONEME_TIPS tell the UI "here's how to get
// closer." Kept side-by-side so both are editable in the same file.
// ────────────────────────────────────────────────────────────────────────

export interface PhonemeTip {
  /** Stable key used for dedup + lookup. Not shown to users. */
  phoneme: string;
  /** One short VN sentence naming the L1 gap. Shown as the card lede. */
  vnConfusion: string;
  /** Bilingual instruction on how to make the sound correctly. */
  articulation: { en: string; vi: string };
  /** 3–5 target words the learner can drill to practice this sound. */
  practiceWords: string[];
  /** What VN speakers typically produce instead. Useful for self-diagnosis. */
  commonErrors: string[];
}

export const PHONEME_TIPS: PhonemeTip[] = [
  {
    phoneme: 'th-voiceless',
    vnConfusion: 'Tiếng Việt không có âm "th" — thường bị đọc thành "t" hoặc "f".',
    articulation: {
      en: 'Put the tip of your tongue lightly between your teeth and blow air. No voice — just breath.',
      vi: 'Đặt đầu lưỡi nhẹ giữa hai hàm răng rồi thổi hơi ra. Không dùng giọng, chỉ hơi.',
    },
    practiceWords: ['think', 'thank', 'three', 'both', 'bath'],
    commonErrors: ['tink', 'tank', 'tree', 'bot', 'bat'],
  },
  {
    phoneme: 'th-voiced',
    vnConfusion: 'Âm "th" có giọng (trong "the", "this") thường bị đọc thành "d" hoặc "z".',
    articulation: {
      en: 'Tongue tip between teeth again, but this time add voice — the throat vibrates.',
      vi: 'Vẫn đầu lưỡi giữa răng, nhưng thêm giọng — cổ họng rung.',
    },
    practiceWords: ['the', 'this', 'that', 'mother', 'another'],
    commonErrors: ['da', 'dis', 'dat', 'mada', 'anada'],
  },
  {
    phoneme: 'v-vs-b',
    vnConfusion: '"v" thường bị đọc thành "b" vì miệng giống âm "b" trong tiếng Việt.',
    articulation: {
      en: 'For v, touch your upper teeth to your lower lip and let the air buzz. b uses both lips.',
      vi: 'Âm "v": răng trên chạm vào môi dưới, có rung. Âm "b": hai môi chạm nhau.',
    },
    practiceWords: ['very', 'live', 'love', 'have', 'visit'],
    commonErrors: ['bery', 'libe', 'lob', 'hab', 'bisit'],
  },
  {
    phoneme: 'z-voicing',
    vnConfusion: 'Âm "z" có rung giọng; tiếng Việt thường phát thành "s" không rung.',
    articulation: {
      en: 'Make an "s" then turn on your voice — you should feel a buzz in your throat.',
      vi: 'Phát âm "s" rồi thêm giọng — sẽ cảm thấy cổ họng rung.',
    },
    practiceWords: ['zoo', 'because', 'his', 'was', 'easy'],
    commonErrors: ['sus', 'because-s', 'hiss', 'wass', 'easy-s'],
  },
  {
    phoneme: 'sh',
    vnConfusion: '"sh" thường bị đọc thành "s" vì tiếng Việt không có âm này.',
    articulation: {
      en: 'Round your lips slightly and pull your tongue back from the s position. Hush-sound.',
      vi: 'Hơi tròn môi và kéo lưỡi lùi về sau so với "s". Giống âm "suỵt".',
    },
    practiceWords: ['she', 'ship', 'fish', 'wash', 'sure'],
    commonErrors: ['se', 'sip', 'fis', 'wass', 'sur'],
  },
  {
    phoneme: 'r-vs-l',
    vnConfusion: 'Âm "r" trong tiếng Anh khác với "r" tiếng Việt — không rung lưỡi, không như "l".',
    articulation: {
      en: 'Curl the tongue tip up and back without touching the roof. No trill, no tapping.',
      vi: 'Cong đầu lưỡi lên và lùi về sau nhưng không chạm vòm miệng. Không rung, không gõ.',
    },
    practiceWords: ['right', 'read', 'really', 'restaurant', 'remember'],
    commonErrors: ['light', 'lead', 'leally', 'lestaulant', 'lememba'],
  },
  {
    phoneme: 'l-initial',
    vnConfusion: '"l" đầu từ có thể bị trộn với "n" ở một số vùng miền Việt Nam.',
    articulation: {
      en: 'Touch the tip of your tongue to the ridge right behind your upper teeth, then release.',
      vi: 'Đầu lưỡi chạm vào lợi ngay sau răng trên, rồi thả ra.',
    },
    practiceWords: ['light', 'love', 'little', 'learn', 'long'],
    commonErrors: ['night', 'nove', 'nittle', 'nearn', 'nong'],
  },
  {
    phoneme: 'final-s',
    vnConfusion: 'Âm "s" cuối từ (số nhiều / ngôi thứ ba) thường bị bỏ — mất dấu hiệu ngữ pháp.',
    articulation: {
      en: 'Don\'t drop the final -s. Whistle the air out after the last consonant.',
      vi: 'Đừng bỏ "s" cuối. Thổi hơi nhẹ ra sau phụ âm cuối.',
    },
    practiceWords: ['books', 'cats', 'goes', 'likes', 'friends'],
    commonErrors: ['book', 'cat', 'go', 'like', 'friend'],
  },
  {
    phoneme: 'final-ed',
    vnConfusion: '"-ed" cuối (thì quá khứ) hay bị nuốt — nghe như ở thì hiện tại.',
    articulation: {
      en: 'Release the final -d or -t clearly. "walked" ends with a soft t; "called" ends with a d.',
      vi: 'Phát rõ "d" hoặc "t" cuối. "walked" kết thúc bằng "t"; "called" kết thúc bằng "d".',
    },
    practiceWords: ['walked', 'talked', 'called', 'learned', 'finished'],
    commonErrors: ['walk', 'talk', 'call', 'learn', 'finish'],
  },
  {
    phoneme: 'final-consonant',
    vnConfusion: 'Tiếng Việt hiếm khi thả hơi ở phụ âm cuối — dễ làm mất âm cuối trong tiếng Anh.',
    articulation: {
      en: 'Hold the consonant, then let a small puff of air escape. Word shapes become clearer.',
      vi: 'Giữ phụ âm rồi thả một hơi nhỏ ra. Âm cuối sẽ rõ hơn.',
    },
    practiceWords: ['stop', 'right', 'book', 'need', 'mouth'],
    commonErrors: ['sto', 'righ', 'boo', 'nee', 'mou'],
  },
  {
    phoneme: 'cluster-initial',
    vnConfusion: 'Tiếng Việt không có cụm phụ âm đầu từ (str-, spl-, br-, tr-…) nên hay thêm nguyên âm.',
    articulation: {
      en: 'Blend the consonants together without any vowel between them. One smooth motion.',
      vi: 'Nối các phụ âm liền nhau, không chêm nguyên âm nào ở giữa. Một chuyển động liền mạch.',
    },
    practiceWords: ['street', 'school', 'bread', 'three', 'please'],
    commonErrors: ['suh-treet', 'suh-kool', 'buh-read', 'tuh-ree', 'puh-lease'],
  },
  {
    phoneme: 'cluster-final',
    vnConfusion: 'Cụm phụ âm cuối (-st, -sk, -nd, -ft…) hay bị rút gọn thành một phụ âm.',
    articulation: {
      en: 'Hit every consonant in the final cluster. "last" ends with s + t, not just s.',
      vi: 'Phát đủ mọi phụ âm cuối. "last" kết thúc bằng s rồi t, không chỉ s.',
    },
    practiceWords: ['last', 'desk', 'find', 'soft', 'exist'],
    commonErrors: ['las', 'des', 'fine', 'sof', 'exis'],
  },
];

/**
 * Pick the most likely phoneme focus for a wrong/close learner slot.
 * Uses WORD_OVERRIDES (authoritative per-word mapping) first, then
 * falls back to surface spelling patterns. Returns null when nothing
 * matches — the caller should omit that slot from the feedback set
 * rather than guessing wildly.
 */
export function inferPhonemeForWord(
  targetWord: string,
  heardWord?: string,
): PhonemeTip | null {
  const word = String(targetWord || '').toLowerCase().trim();
  if (!word) return null;
  const heard = (heardWord ?? '').toLowerCase().trim();

  // Per-word overrides first. Known L1-interference targets always map
  // to a single best tip — the scorer's WORD_OVERRIDES tells us which.
  const perWordMap: Record<string, string> = {
    think: 'th-voiceless',
    thank: 'th-voiceless',
    three: 'th-voiceless',
    both: 'th-voiceless',
    bath: 'th-voiceless',
    that: 'th-voiced',
    this: 'th-voiced',
    the: 'th-voiced',
    very: 'v-vs-b',
    live: 'v-vs-b',
    love: 'v-vs-b',
    have: 'v-vs-b',
    visit: 'v-vs-b',
    zoo: 'z-voicing',
    was: 'z-voicing',
    his: 'z-voicing',
    because: 'z-voicing',
    she: 'sh',
    ship: 'sh',
    fish: 'sh',
    wash: 'sh',
    sure: 'sh',
    juice: 'sh',
  };
  const direct = perWordMap[word];
  if (direct) return findTip(direct);

  // Word-shape heuristics.
  if (/^th/.test(word)) {
    // "th" initial — voicing depends on the word; we can't tell without
    // a phonology lookup, so pick the more teachable case (voiceless).
    return findTip('th-voiceless');
  }
  if (/th/.test(word)) {
    return findTip('th-voiceless');
  }
  if (word.startsWith('sh') || word.endsWith('sh')) {
    return findTip('sh');
  }
  if (word.endsWith('ed') && word.length > 3) {
    return findTip('final-ed');
  }
  if (
    word.length > 2 &&
    word.endsWith('s') &&
    !/(ss|us|is|as|os)$/.test(word) // avoid matching "his", "this", "boss" etc.
  ) {
    return findTip('final-s');
  }
  // Initial cluster of ≥2 consonants (heuristic).
  if (/^[bcdfghjklmnpqrstvwxyz]{2,}/.test(word)) {
    return findTip('cluster-initial');
  }
  // Final cluster of ≥2 consonants.
  if (/[bcdfghjklmnpqrstvwxyz]{2,}$/.test(word)) {
    return findTip('cluster-final');
  }
  // v or b confusion based on heard swap.
  if (/v/.test(word) && heard && /b/.test(heard)) {
    return findTip('v-vs-b');
  }
  // r/l confusion based on heard swap.
  if (/r/.test(word) && heard && /l/.test(heard) && !/l/.test(word)) {
    return findTip('r-vs-l');
  }
  // l-initial confusion with n.
  if (word.startsWith('l') && heard.startsWith('n')) {
    return findTip('l-initial');
  }

  return null;
}

function findTip(phoneme: string): PhonemeTip | null {
  return PHONEME_TIPS.find((t) => t.phoneme === phoneme) ?? null;
}
