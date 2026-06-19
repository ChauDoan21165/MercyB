// src/languages/thai/toneBasics.ts
//
// Thai tone basics for Vietnamese- and English-speaking learners.
//
// This module is PURELY descriptive reference content. It explains, in
// writing, how the Thai tone system works and how it differs from the
// Vietnamese tone system. It deliberately contains:
//   • NO audio, NO TTS, NO recording, NO mic, NO Azure.
//   • NO pronunciation scoring, NO phoneme model, NO "you said it wrong"
//     feedback of any kind.
//
// Tone is auditory; text alone cannot teach a learner to *produce* a tone
// correctly. Every note here is framed as written awareness, and the
// `learnerWarnings` make that limitation explicit. Native review of the
// contour descriptions is DEFERRED.

export type ThaiToneId = "mid" | "low" | "falling" | "high" | "rising";

export type ThaiTone = {
  id: ThaiToneId;
  /** Thai name of the tone */
  name_th: string;
  /** Romanized tone name */
  name_rtgs: string;
  /** Vietnamese label */
  vi: string;
  /** English label */
  en: string;
  /** Written description of the pitch shape (NOT a recording) */
  contour_vi: string;
  contour_en: string;
  /** A common example word that carries this tone (Thai + reading aid) */
  example_th: string;
  example_rom: string;
  example_gloss_vi: string;
  example_gloss_en: string;
};

export type ThaiToneMark = {
  /** The combining mark on its own (sits above the consonant) */
  symbol: string;
  name_th: string;
  name_rtgs: string;
  vi: string;
  en: string;
};

export type LearnerWarning = {
  vi: string;
  en: string;
};

export type ViThaiContrast = {
  /** Short topic key */
  topic: string;
  vi: string;
  en: string;
};

/**
 * A *written* minimal contrast: same-looking syllable, different tone,
 * different meaning. Used only to show that tone changes meaning — it does
 * NOT and CANNOT teach the sound. Reading aids only.
 */
export type WrittenToneContrast = {
  a_th: string;
  a_rom: string;
  a_tone: ThaiToneId;
  a_gloss_vi: string;
  a_gloss_en: string;
  b_th: string;
  b_rom: string;
  b_tone: ThaiToneId;
  b_gloss_vi: string;
  b_gloss_en: string;
  note_vi: string;
  note_en: string;
};

// ── Overview ────────────────────────────────────────────────────────────

export const THAI_TONE_OVERVIEW = {
  vi:
    "Tiếng Thái là ngôn ngữ có thanh điệu, gồm 5 thanh: trung (bằng), thấp, " +
    "huyền-xuống (falling), cao, và hỏi-lên (rising). Cùng một âm tiết, đổi " +
    "thanh là đổi nghĩa. Khác với tiếng Việt, thanh điệu của một từ Thái KHÔNG " +
    "phải lúc nào cũng được đánh dấu rõ: nó được suy ra từ (1) nhóm phụ âm đầu " +
    "(cao/trung/thấp), (2) loại âm tiết (sống/chết), (3) độ dài nguyên âm, và " +
    "(4) dấu thanh nếu có. Vì vậy một dấu thanh Thái không tương ứng cố định với " +
    "một thanh duy nhất. Đây là phần chữ viết — KHÔNG thay thế việc nghe người " +
    "bản xứ.",
  en:
    "Thai is a tonal language with 5 tones: mid (level), low, falling, high, " +
    "and rising. The same syllable with a different tone is a different word. " +
    "Unlike Vietnamese, a Thai word's tone is NOT always written explicitly: it " +
    "is computed from (1) the initial consonant class (high/mid/low), (2) the " +
    "syllable type (live/dead), (3) the vowel length, and (4) the tone mark if " +
    "present. So a single Thai tone mark does not map to one fixed tone. This is " +
    "written reference only — it does not replace listening to native speakers.",
} as const;

// ── The five tones ──────────────────────────────────────────────────────

export const THAI_TONES: ReadonlyArray<ThaiTone> = [
  {
    id: "mid",
    name_th: "เสียงสามัญ",
    name_rtgs: "siang saman",
    vi: "thanh trung (bằng)",
    en: "mid (level) tone",
    contour_vi: "Giữ cao độ đều, không lên không xuống — gần giống thanh 'ngang' của tiếng Việt.",
    contour_en: "Held steady, neither rising nor falling — roughly like Vietnamese level (ngang) tone.",
    example_th: "ปา",
    example_rom: "pa",
    example_gloss_vi: "ném",
    example_gloss_en: "to throw",
  },
  {
    id: "low",
    name_th: "เสียงเอก",
    name_rtgs: "siang ek",
    vi: "thanh thấp",
    en: "low tone",
    contour_vi: "Cao độ thấp và giữ đều ở mức thấp; không phải là tụt xuống mạnh.",
    contour_en: "Pitched low and held flat-ish at the bottom; not a sharp drop.",
    example_th: "ป่า",
    example_rom: "pa",
    example_gloss_vi: "rừng",
    example_gloss_en: "forest",
  },
  {
    id: "falling",
    name_th: "เสียงโท",
    name_rtgs: "siang tho",
    vi: "thanh xuống (falling)",
    en: "falling tone",
    contour_vi: "Bắt đầu cao rồi rơi xuống — phần nào giống thanh 'huyền' nhưng bắt đầu cao hơn.",
    contour_en: "Starts high then drops down — somewhat like Vietnamese huyền but starting higher.",
    example_th: "ป้า",
    example_rom: "pa",
    example_gloss_vi: "bác / dì (chị của cha mẹ)",
    example_gloss_en: "aunt (parent's older sibling)",
  },
  {
    id: "high",
    name_th: "เสียงตรี",
    name_rtgs: "siang tri",
    vi: "thanh cao",
    en: "high tone",
    contour_vi: "Cao độ cao, thường hơi đi lên ở cuối; không đều như thanh 'sắc' tiếng Việt.",
    contour_en: "High pitch, often rising slightly at the end; not identical to Vietnamese sắc.",
    example_th: "ป๊า",
    example_rom: "pa",
    example_gloss_vi: "ba / cha (thân mật)",
    example_gloss_en: "dad (colloquial)",
  },
  {
    id: "rising",
    name_th: "เสียงจัตวา",
    name_rtgs: "siang chattawa",
    vi: "thanh lên (rising)",
    en: "rising tone",
    contour_vi: "Bắt đầu thấp rồi đi lên — gần với thanh 'hỏi' của tiếng Việt về hình dáng.",
    contour_en: "Starts low then rises — close in shape to Vietnamese hỏi tone.",
    example_th: "ป๋า",
    example_rom: "pa",
    example_gloss_vi: "ba / bố (cách gọi thân mật khác)",
    example_gloss_en: "dad (another colloquial form)",
  },
];

// ── The four tone marks ─────────────────────────────────────────────────
// (Mid tone has no mark. Marks sit above the initial consonant.)

export const THAI_TONE_MARKS: ReadonlyArray<ThaiToneMark> = [
  {
    symbol: "่", // ่
    name_th: "ไม้เอก",
    name_rtgs: "mai ek",
    vi: "dấu mai ek — KHÔNG cố định một thanh: cho thanh thấp hoặc xuống tùy nhóm phụ âm.",
    en: "mai ek — not a fixed tone: yields low OR falling depending on consonant class.",
  },
  {
    symbol: "้", // ้
    name_th: "ไม้โท",
    name_rtgs: "mai tho",
    vi: "dấu mai tho — thường cho thanh xuống hoặc cao, tùy nhóm phụ âm.",
    en: "mai tho — usually yields falling OR high, depending on consonant class.",
  },
  {
    symbol: "๊", // ๊
    name_th: "ไม้ตรี",
    name_rtgs: "mai tri",
    vi: "dấu mai tri — cho thanh cao; chủ yếu dùng với phụ âm nhóm trung.",
    en: "mai tri — yields high tone; used mainly with mid-class consonants.",
  },
  {
    symbol: "๋", // ๋
    name_th: "ไม้จัตวา",
    name_rtgs: "mai chattawa",
    vi: "dấu mai chattawa — cho thanh lên (rising); ít gặp.",
    en: "mai chattawa — yields rising tone; relatively rare.",
  },
];

// ── Learner warnings (the honest limits) ────────────────────────────────

export const THAI_TONE_LEARNER_WARNINGS: ReadonlyArray<LearnerWarning> = [
  {
    vi: "Chữ viết không dạy bạn PHÁT ÂM thanh điệu. Phần mô tả cao độ ở đây chỉ là hình dung; bạn vẫn cần nghe người bản xứ để bắt đúng âm.",
    en: "Text cannot teach you to PRODUCE a tone. The pitch descriptions here are only mental pictures; you still need native audio to get it right.",
  },
  {
    vi: "Dấu thanh Thái KHÔNG ánh xạ 1-1 sang một thanh duy nhất. Cùng một dấu (ví dụ mai ek) cho thanh khác nhau tùy nhóm phụ âm đầu (cao/trung/thấp).",
    en: "Thai tone marks do NOT map 1-to-1 to a single tone. The same mark (e.g. mai ek) gives different tones depending on the initial consonant class.",
  },
  {
    vi: "Nhiều âm tiết KHÔNG có dấu thanh nhưng vẫn mang thanh điệu — thanh được suy ra từ nhóm phụ âm, loại âm tiết sống/chết và độ dài nguyên âm.",
    en: "Many syllables have NO tone mark yet still carry a tone — it is inferred from consonant class, live/dead syllable type, and vowel length.",
  },
  {
    vi: "Đừng giả định thanh Thái 'bằng' thanh Việt. Các so sánh ở đây chỉ là điểm tựa ban đầu; hình dáng cao độ và điểm bắt đầu vẫn khác nhau.",
    en: "Do not assume Thai tones 'equal' Vietnamese tones. The comparisons here are only starting anchors; contour shape and starting pitch still differ.",
  },
  {
    vi: "Romanization (rom) trong dữ liệu KHÔNG ghi thanh điệu. Đừng dựa vào nó để đoán thanh — hãy đọc chữ Thái và bối cảnh.",
    en: "The romanization (rom) in the data does NOT encode tone. Don't rely on it to guess the tone — read the Thai script and context.",
  },
];

// ── Careful Vietnamese ↔ Thai contrast ──────────────────────────────────

export const VI_THAI_TONE_CONTRASTS: ReadonlyArray<ViThaiContrast> = [
  {
    topic: "số lượng thanh / number of tones",
    vi: "Tiếng Việt (phương ngữ Bắc) có 6 thanh; tiếng Thái có 5 thanh. Không có ánh xạ 1-1 giữa hai hệ.",
    en: "Northern Vietnamese has 6 tones; Thai has 5. There is no one-to-one mapping between the two systems.",
  },
  {
    topic: "cách ghi thanh / how tone is written",
    vi: "Tiếng Việt ghi thanh bằng dấu cố định trên MỌI âm tiết (à á ả ã ạ). Tiếng Thái suy ra thanh từ phụ âm + âm tiết + dấu, và nhiều từ không có dấu thanh.",
    en: "Vietnamese marks tone with fixed diacritics on EVERY syllable (à á ả ã ạ). Thai computes tone from consonant + syllable + mark, and many words carry no tone mark.",
  },
  {
    topic: "lợi thế cho người Việt / advantage for Vietnamese speakers",
    vi: "Người Việt đã quen 'nghe ra thanh' nên dễ chấp nhận ý tưởng thanh điệu đổi nghĩa — nhưng phải học LẠI hình dáng từng thanh Thái, không bê nguyên thanh Việt sang.",
    en: "Vietnamese speakers already 'hear tone', so the idea that tone changes meaning is easy to accept — but each Thai tone's shape must be re-learned, not copied from Vietnamese.",
  },
  {
    topic: "âm tiết chết / dead syllables",
    vi: "Tiếng Thái phân biệt âm tiết 'sống' và 'chết' (kết thúc bằng p/t/k hoặc nguyên âm ngắn), ảnh hưởng tới thanh. Tiếng Việt cũng có âm tắc cuối nhưng quy tắc thanh khác hẳn.",
    en: "Thai distinguishes 'live' vs 'dead' syllables (ending in p/t/k or a short vowel), which affects tone. Vietnamese also has final stops but its tone rules are entirely different.",
  },
  {
    topic: "thanh xuống vs huyền / falling vs huyền",
    vi: "Thanh 'xuống' của Thái bắt đầu CAO rồi rơi; thanh 'huyền' của Việt bắt đầu thấp và đi xuống đều. Nghe giống nhưng không bằng nhau.",
    en: "Thai falling tone starts HIGH then drops; Vietnamese huyền starts low and trails down gently. They sound similar but are not equal.",
  },
];

// ── Written minimal contrasts (meaning changes, sound not taught) ───────

export const WRITTEN_TONE_CONTRASTS: ReadonlyArray<WrittenToneContrast> = [
  {
    a_th: "ป่า", a_rom: "pa", a_tone: "low", a_gloss_vi: "rừng", a_gloss_en: "forest",
    b_th: "ป้า", b_rom: "pa", b_tone: "falling", b_gloss_vi: "bác / dì", b_gloss_en: "aunt",
    note_vi: "Cùng phụ âm và nguyên âm, chỉ khác dấu thanh → nghĩa khác hẳn. (Chỉ để thấy thanh đổi nghĩa, không dạy âm.)",
    note_en: "Same consonant and vowel, only the tone mark differs → totally different meaning. (Shows tone changes meaning; does not teach the sound.)",
  },
  {
    a_th: "ไกล", a_rom: "klai", a_tone: "mid", a_gloss_vi: "xa", a_gloss_en: "far",
    b_th: "ใกล้", b_rom: "klai", b_tone: "falling", b_gloss_vi: "gần", b_gloss_en: "near",
    note_vi: "Cặp nổi tiếng: 'xa' và 'gần' đọc gần giống nhau, chỉ khác thanh — đối lập NGHĨA hoàn toàn. Hãy đọc bằng chữ Thái, đừng dựa vào rom.",
    note_en: "Famous pair: 'far' and 'near' look almost the same and differ mainly by tone — opposite meanings. Read by Thai script, not by rom.",
  },
  {
    a_th: "เสือ", a_rom: "suea", a_tone: "rising", a_gloss_vi: "con hổ", a_gloss_en: "tiger",
    b_th: "เสื้อ", b_rom: "suea", b_tone: "falling", b_gloss_vi: "áo", b_gloss_en: "shirt",
    note_vi: "Khác dấu thanh (rising vs falling) → 'hổ' vs 'áo'. Đừng đoán bằng romanization.",
    note_en: "Different tone (rising vs falling) → 'tiger' vs 'shirt'. Don't guess from the romanization.",
  },
  {
    a_th: "ขาว", a_rom: "khao", a_tone: "rising", a_gloss_vi: "trắng", a_gloss_en: "white",
    b_th: "ข่าว", b_rom: "khao", b_tone: "low", b_gloss_vi: "tin tức", b_gloss_en: "news",
    note_vi: "Cùng đọc 'khao' nhưng khác thanh → 'trắng' vs 'tin tức'. Thanh là yếu tố phân biệt.",
    note_en: "Both read 'khao' but differ by tone → 'white' vs 'news'. Tone is the distinguishing feature.",
  },
];

export default {
  THAI_TONE_OVERVIEW,
  THAI_TONES,
  THAI_TONE_MARKS,
  THAI_TONE_LEARNER_WARNINGS,
  VI_THAI_TONE_CONTRASTS,
  WRITTEN_TONE_CONTRASTS,
};
