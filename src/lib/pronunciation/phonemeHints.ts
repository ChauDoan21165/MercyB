/**
 * Phoneme-level coaching hints for Vietnamese learners.
 *
 * Maps Azure Pronunciation Assessment phoneme symbols (a mix of IPA and
 * SAPI / X-SAMPA flavoured strings — Azure isn't perfectly canonical) to
 * a one-line bilingual coaching hint that surfaces in the Speak-tab
 * tooltip when a phoneme scores below the "good" threshold.
 *
 * Coverage targets the sounds Vietnamese L1 speakers most often confuse
 * or drop:
 *   - Dental fricatives /θ/ /ð/ — typically realised as /t/ /d/
 *   - /r/ vs /l/, especially in onset clusters
 *   - Lax /æ/ /ɪ/ vs tense /eɪ/ /iː/
 *   - Postalveolar /ʃ/ /ʒ/ /tʃ/ /dʒ/
 *   - Velar nasal /ŋ/ in word-final position
 *   - Final-consonant release: /t/ /d/ /k/ /s/ /z/ in coda
 *
 * Anything not in the table falls through to GENERIC_LOW_HINT — kept
 * intentionally short. Quality > coverage.
 */

export type PhonemeHint = {
  en: string;
  vi: string;
  /**
   * One short English word that demonstrates the phoneme cleanly.
   * Used both for the visible "giống trong từ <word>" line and as
   * the audio target when the learner taps the per-phoneme play
   * button — TTS engines pronounce real words far more reliably
   * than isolated IPA symbols.
   *
   * Optional so legacy callers (and `GENERIC_LOW_HINT`) don't break;
   * every entry in HINTS below provides one.
   */
  example_word?: string;
  /** Vietnamese gloss of the example word ("think" → "nghĩ"). */
  example_word_vi?: string;
};

/** Used when a low-scoring phoneme isn't in the dictionary. */
export const GENERIC_LOW_HINT: PhonemeHint = {
  en: "Try again — focus on this sound.",
  vi: "Thử lại — tập trung vào âm này.",
};

/**
 * Lookup is case-insensitive and stripped of whitespace. The keys here
 * are the lowercased canonical form Azure tends to emit; aliases below
 * map common variants onto a single canonical entry.
 */
const HINTS: Record<string, PhonemeHint> = {
  // ── Dental fricatives ──────────────────────────────────────────────
  th: {
    en: "Push your tongue tip lightly between your teeth and blow.",
    vi: "Đẩy đầu lưỡi ra giữa hai hàm răng rồi thổi nhẹ.",
    example_word: "think", example_word_vi: "nghĩ",
  },
  dh: {
    en: "Voiced 'th' — tongue between teeth, vibrate your throat.",
    vi: "Âm 'th' có giọng — lưỡi giữa răng, rung cổ họng.",
    example_word: "this", example_word_vi: "này",
  },

  // ── /r/ vs /l/ ─────────────────────────────────────────────────────
  r: {
    en: "Curl the tongue back without touching the roof.",
    vi: "Cong lưỡi về phía sau, không chạm vòm miệng.",
    example_word: "right", example_word_vi: "đúng",
  },
  l: {
    en: "Tongue tip touches just behind the upper teeth.",
    vi: "Đầu lưỡi chạm phía sau hàm răng trên.",
    example_word: "light", example_word_vi: "ánh sáng",
  },

  // ── Vowel pairs Vietnamese learners conflate ───────────────────────
  ae: {
    en: "Open the mouth wide and flatten the tongue — like 'cat'.",
    vi: "Mở miệng rộng, hạ lưỡi — giống từ 'cat'.",
    example_word: "cat", example_word_vi: "con mèo",
  },
  ah: {
    en: "Open and relaxed — like the 'a' in 'father'.",
    vi: "Âm mở, thả lỏng — như chữ 'a' trong 'father'.",
    example_word: "father", example_word_vi: "cha",
  },
  eh: {
    en: "Mouth half-open, like the 'e' in 'bed'.",
    vi: "Miệng mở vừa, giống chữ 'e' trong 'bed'.",
    example_word: "bed", example_word_vi: "giường",
  },
  ih: {
    en: "Short and lax — shorter than 'ee'.",
    vi: "Ngắn và lỏng — ngắn hơn 'ee'.",
    example_word: "ship", example_word_vi: "tàu",
  },
  iy: {
    en: "Long, tense 'ee' — smile slightly.",
    vi: "Âm 'ee' dài, căng — cười nhẹ một chút.",
    example_word: "sheep", example_word_vi: "con cừu",
  },
  uh: {
    en: "Short 'u' — relaxed, like the 'oo' in 'book'.",
    vi: "'u' ngắn, thả lỏng — như 'oo' trong 'book'.",
    example_word: "book", example_word_vi: "sách",
  },
  uw: {
    en: "Long 'oo' — round and push the lips forward.",
    vi: "'oo' dài — tròn và đẩy môi ra phía trước.",
    example_word: "food", example_word_vi: "thức ăn",
  },
  ey: {
    en: "Glide from 'e' into 'ee' — like 'day'.",
    vi: "Trượt từ 'e' sang 'ee' — như 'day'.",
    example_word: "day", example_word_vi: "ngày",
  },
  ay: {
    en: "Glide from 'a' into 'ee' — like 'buy'.",
    vi: "Trượt từ 'a' sang 'ee' — như 'buy'.",
    example_word: "buy", example_word_vi: "mua",
  },
  ow: {
    en: "Glide from 'o' into 'oo' — like 'go'.",
    vi: "Trượt từ 'o' sang 'oo' — như 'go'.",
    example_word: "go", example_word_vi: "đi",
  },
  aw: {
    en: "Glide from 'a' into 'oo' — like 'now'.",
    vi: "Trượt từ 'a' sang 'oo' — như 'now'.",
    example_word: "now", example_word_vi: "bây giờ",
  },
  oy: {
    en: "Glide from 'oh' into 'ee' — like 'boy'.",
    vi: "Trượt từ 'oh' sang 'ee' — như 'boy'.",
    example_word: "boy", example_word_vi: "cậu bé",
  },
  er: {
    en: "Curl the tongue and round the lips slightly — like 'her'.",
    vi: "Cong lưỡi, hơi tròn môi — như 'her'.",
    example_word: "her", example_word_vi: "cô ấy",
  },

  // ── Postalveolar fricatives + affricates ───────────────────────────
  sh: {
    en: "Round the lips and push air out — like calling for quiet.",
    vi: "Tròn môi, đẩy hơi ra — giống khi 'suỵt' bảo im lặng.",
    example_word: "shoe", example_word_vi: "giày",
  },
  zh: {
    en: "Voiced 'sh' — buzz the throat, lips slightly rounded.",
    vi: "'sh' có giọng — rung cổ họng, môi hơi tròn.",
    example_word: "measure", example_word_vi: "đo lường",
  },
  ch: {
    en: "Stop briefly then release with a 'sh' — like 'church'.",
    vi: "Chặn hơi rồi thả ra như 'sh' — như 'church'.",
    example_word: "church", example_word_vi: "nhà thờ",
  },
  jh: {
    en: "Voiced 'ch' — like the 'j' in 'judge'.",
    vi: "'ch' có giọng — như chữ 'j' trong 'judge'.",
    example_word: "judge", example_word_vi: "thẩm phán",
  },

  // ── Nasals ─────────────────────────────────────────────────────────
  ng: {
    en: "Back of the tongue touches the soft palate — don't add 'g'.",
    vi: "Cuống lưỡi chạm vòm mềm — không thêm âm 'g' phía sau.",
    example_word: "sing", example_word_vi: "hát",
  },
  n: {
    en: "Tongue tip on the ridge behind the teeth — air through the nose.",
    vi: "Đầu lưỡi chạm phía sau răng — hơi thoát qua mũi.",
    example_word: "no", example_word_vi: "không",
  },
  m: {
    en: "Close the lips fully — air through the nose.",
    vi: "Khép kín môi — hơi thoát qua mũi.",
    example_word: "moon", example_word_vi: "mặt trăng",
  },

  // ── Stops — coda position is the Vietnamese trouble spot ──────────
  t: {
    en: "Release the final 't' clearly — don't drop it.",
    vi: "Bật âm 't' cuối rõ ràng — đừng nuốt mất.",
    example_word: "hat", example_word_vi: "cái mũ",
  },
  d: {
    en: "Release the final 'd' with a small voiced burst.",
    vi: "Bật âm 'd' cuối có giọng — không bỏ qua.",
    example_word: "bed", example_word_vi: "giường",
  },
  k: {
    en: "Release the final 'k' — quick puff at the back.",
    vi: "Bật âm 'k' cuối — luồng hơi ngắn ở cuống họng.",
    example_word: "back", example_word_vi: "phía sau",
  },
  g: {
    en: "Voiced — back of the tongue on the soft palate, then release.",
    vi: "Có giọng — cuống lưỡi chạm vòm mềm rồi thả ra.",
    example_word: "go", example_word_vi: "đi",
  },
  p: {
    en: "Close the lips, then pop them open with breath.",
    vi: "Khép môi, rồi bật mở bằng hơi.",
    example_word: "pen", example_word_vi: "cái bút",
  },
  b: {
    en: "Voiced 'p' — vibrate the throat as the lips open.",
    vi: "'p' có giọng — rung cổ họng khi mở môi.",
    example_word: "ball", example_word_vi: "quả bóng",
  },

  // ── Sibilants in coda ─────────────────────────────────────────────
  s: {
    en: "Hiss like a snake — don't drop the final 's'.",
    vi: "Phát âm 's' như tiếng rắn — đừng bỏ 's' cuối.",
    example_word: "see", example_word_vi: "nhìn thấy",
  },
  z: {
    en: "Voiced 's' — hiss with throat vibration.",
    vi: "'s' có giọng — vừa kêu vừa rung cổ họng.",
    example_word: "zoo", example_word_vi: "vườn thú",
  },
  f: {
    en: "Upper teeth on lower lip — blow.",
    vi: "Răng trên chạm môi dưới — thổi nhẹ.",
    example_word: "fish", example_word_vi: "con cá",
  },
  v: {
    en: "Voiced 'f' — buzz with the lip-teeth contact.",
    vi: "'f' có giọng — rung khi răng chạm môi.",
    example_word: "very", example_word_vi: "rất",
  },

  // ── Schwa & approximants ──────────────────────────────────────────
  ax: {
    en: "Schwa — short, neutral 'uh' in unstressed syllables.",
    vi: "Schwa — 'uh' ngắn, trung tính ở âm không nhấn.",
    example_word: "about", example_word_vi: "về",
  },
  w: {
    en: "Round the lips fully, then glide out.",
    vi: "Tròn môi hết cỡ, rồi mở ra.",
    example_word: "water", example_word_vi: "nước",
  },
  y: {
    en: "Tongue high and front — like a quick 'ee' before the vowel.",
    vi: "Lưỡi cao, đưa về phía trước — như 'ee' nhanh trước nguyên âm.",
    example_word: "yes", example_word_vi: "vâng",
  },
  h: {
    en: "Soft breath — no vocal cord vibration.",
    vi: "Hơi thở nhẹ — không rung dây thanh.",
    example_word: "hello", example_word_vi: "xin chào",
  },
};

/**
 * Aliases — many Azure responses use different casings or IPA-like
 * variants (e.g. "θ" for "th"). Map them all onto the canonical key.
 */
const ALIASES: Record<string, string> = {
  "θ": "th",
  "ð": "dh",
  "ʃ": "sh",
  "ʒ": "zh",
  "tʃ": "ch",
  "dʒ": "jh",
  "ŋ": "ng",
  "æ": "ae",
  "ɑ": "ah",
  "ɛ": "eh",
  "ɪ": "ih",
  "i": "iy",
  "ʊ": "uh",
  "u": "uw",
  "eɪ": "ey",
  "aɪ": "ay",
  "oʊ": "ow",
  "aʊ": "aw",
  "ɔɪ": "oy",
  "ɝ": "er",
  "ɚ": "er",
  "ə": "ax",
};

/**
 * Look up a hint for a given phoneme symbol. Returns the GENERIC_LOW_HINT
 * when nothing matches — callers never have to handle null.
 */
export function getPhonemeHint(symbol: string): PhonemeHint {
  const raw = (symbol ?? "").trim();
  if (!raw) return GENERIC_LOW_HINT;
  const lower = raw.toLowerCase();
  const canonical = ALIASES[raw] ?? ALIASES[lower] ?? lower;
  return HINTS[canonical] ?? GENERIC_LOW_HINT;
}

/** Threshold below which a phoneme should show its hint. */
export const LOW_PHONEME_THRESHOLD = 85;
