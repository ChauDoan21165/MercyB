// src/languages/thai/writtenContrastDrills.ts
//
// Thai written contrast (minimal pair) drills for tone/meaning awareness
// (A9, Wave 4), for Vietnamese- and English-speaking learners.
//
// Each drill shows a near-identical written pair whose tone (or a single
// letter) changes the meaning. Every drill carries four components required
// by the spec:
//   • writtenContrast  — what differs on the page
//   • meaningContrast  — how the meanings differ
//   • learnerWarning   — the pitfall + the honest no-audio limit
//   • practicePrompt   — a WRITTEN practice task (no speaking required)
//
// Scope guardrails:
//   • No audio, no TTS, no mic, no Azure, NO pronunciation scoring.
//   • Romanization is a plain reading aid and does NOT encode tone.
//   • Companion data: ./toneBasics.ts, ./toneDrills.ts, ./vocabulary.ts.
//   • Native review is DEFERRED.

import type { ThaiToneId } from "./toneBasics";

export type ThaiContrastKind = "tone" | "spelling";

export type ContrastWord = {
  th: string;
  rom: string;
  tone: ThaiToneId;
  vi: string;
  en: string;
};

export type ThaiWrittenContrastDrill = {
  id: string;
  kind: ThaiContrastKind;
  a: ContrastWord;
  b: ContrastWord;
  writtenContrast_vi: string;
  writtenContrast_en: string;
  meaningContrast_vi: string;
  meaningContrast_en: string;
  learnerWarning_vi: string;
  learnerWarning_en: string;
  practicePrompt_vi: string;
  practicePrompt_en: string;
};

// ── tone-name helpers ───────────────────────────────────────────────────

const TONE_VI: Record<ThaiToneId, string> = {
  mid: "thanh trung",
  low: "thanh thấp",
  falling: "thanh xuống",
  high: "thanh cao",
  rising: "thanh lên",
};
const TONE_EN: Record<ThaiToneId, string> = {
  mid: "mid",
  low: "low",
  falling: "falling",
  high: "high",
  rising: "rising",
};

// ── seed data (the curated minimal pairs) ───────────────────────────────

type Seed = {
  id: string;
  kind: ThaiContrastKind;
  a: ContrastWord;
  b: ContrastWord;
  /** optional extra learner note, appended bilingually */
  note_vi?: string;
  note_en?: string;
};

const w = (th: string, rom: string, tone: ThaiToneId, vi: string, en: string): ContrastWord => ({
  th, rom, tone, vi, en,
});

const SEEDS: Seed[] = [
  { id: "klai", kind: "tone", a: w("ไกล", "klai", "mid", "xa", "far"), b: w("ใกล้", "klai", "falling", "gần", "near"),
    note_vi: "Cặp kinh điển: 'xa' và 'gần' chỉ khác thanh.", note_en: "Classic pair: 'far' vs 'near' differ only by tone." },
  { id: "suea", kind: "tone", a: w("เสือ", "suea", "rising", "con hổ", "tiger"), b: w("เสื้อ", "suea", "falling", "áo", "shirt") },
  { id: "khao-white-news", kind: "tone", a: w("ขาว", "khao", "rising", "trắng", "white"), b: w("ข่าว", "khao", "low", "tin tức", "news") },
  { id: "pa", kind: "tone", a: w("ป่า", "pa", "low", "rừng", "forest"), b: w("ป้า", "pa", "falling", "bác / dì", "aunt") },
  { id: "mai-not-wood", kind: "tone", a: w("ไม่", "mai", "falling", "không (phủ định)", "not"), b: w("ไม้", "mai", "high", "gỗ / cây", "wood"),
    note_vi: "Nhóm 'mai' rất dễ lẫn: ไม่, ไม้, ใหม่, ไหม.", note_en: "The 'mai' family is easily confused: ไม่, ไม้, ใหม่, ไหม." },
  { id: "mai-new-q", kind: "tone", a: w("ใหม่", "mai", "low", "mới", "new"), b: w("ไหม", "mai", "rising", "tiểu từ hỏi / tơ", "question particle / silk") },
  { id: "ma-come-horse", kind: "tone", a: w("มา", "ma", "mid", "đến", "to come"), b: w("ม้า", "ma", "high", "con ngựa", "horse") },
  { id: "ma-dog-horse", kind: "tone", a: w("หมา", "ma", "rising", "con chó", "dog"), b: w("ม้า", "ma", "high", "con ngựa", "horse") },
  { id: "kha-leg-i", kind: "tone", a: w("ขา", "kha", "rising", "chân (cẳng chân)", "leg"), b: w("ข้า", "kha", "falling", "tôi / kẻ hầu", "I / servant") },
  { id: "kha-value-trade", kind: "tone", a: w("ค่า", "kha", "falling", "giá trị / phí", "value / fee"), b: w("ค้า", "kha", "high", "buôn bán", "to trade") },
  { id: "na-field-face", kind: "tone", a: w("นา", "na", "mid", "ruộng", "rice field"), b: w("หน้า", "na", "falling", "mặt / trang", "face / page") },
  { id: "ya-med-grandma", kind: "tone", a: w("ยา", "ya", "mid", "thuốc", "medicine"), b: w("ย่า", "ya", "falling", "bà nội", "paternal grandmother") },
  { id: "ya-dont-grass", kind: "tone", a: w("อย่า", "ya", "low", "đừng", "don't"), b: w("หญ้า", "ya", "falling", "cỏ", "grass") },
  { id: "thi-time-at", kind: "tone", a: w("ที", "thi", "mid", "lần / lượt", "time / once"), b: w("ที่", "thi", "falling", "ở / tại / cái mà", "at / that") },
  { id: "khai-sell-egg", kind: "tone", a: w("ขาย", "khai", "rising", "bán", "to sell"), b: w("ไข่", "khai", "low", "trứng", "egg") },
  { id: "kai-khai-spell", kind: "spelling", a: w("ไก่", "kai", "low", "con gà", "chicken"), b: w("ไข่", "khai", "low", "trứng", "egg"),
    note_vi: "Khác phụ âm đầu ก/ข khi viết → nghĩa khác.", note_en: "Different initial consonant ก/ข in writing → different meaning." },
  { id: "kao-old-nine", kind: "tone", a: w("เก่า", "kao", "low", "cũ", "old"), b: w("เก้า", "kao", "falling", "chín (số 9)", "nine") },
  { id: "khao-knee-enter", kind: "tone", a: w("เข่า", "khao", "low", "đầu gối", "knee"), b: w("เข้า", "khao", "falling", "vào / đi vào", "to enter") },
  { id: "khao-he-knee", kind: "tone", a: w("เขา", "khao", "rising", "anh ấy / cô ấy / núi", "he / she / mountain"), b: w("เข่า", "khao", "low", "đầu gối", "knee") },
  { id: "lom-wind-fall", kind: "tone", a: w("ลม", "lom", "mid", "gió", "wind"), b: w("ล้ม", "lom", "high", "ngã / đổ", "to fall") },
  { id: "pu-crab-grandpa", kind: "tone", a: w("ปู", "pu", "mid", "con cua", "crab"), b: w("ปู่", "pu", "low", "ông nội", "paternal grandfather") },
  { id: "phi-sibling-ghost", kind: "tone", a: w("พี่", "phi", "falling", "anh / chị", "older sibling"), b: w("ผี", "phi", "rising", "ma", "ghost") },
  { id: "mi-have-bear", kind: "tone", a: w("มี", "mi", "mid", "có", "to have"), b: w("หมี", "mi", "rising", "con gấu", "bear") },
  { id: "suai-pretty-unlucky", kind: "tone", a: w("สวย", "suai", "rising", "đẹp", "beautiful"), b: w("ซวย", "suai", "mid", "xui xẻo", "unlucky") },
  { id: "thong-gold-belly", kind: "tone", a: w("ทอง", "thong", "mid", "vàng (kim loại)", "gold"), b: w("ท้อง", "thong", "high", "bụng", "belly") },
  { id: "thao-equal-foot", kind: "tone", a: w("เท่า", "thao", "falling", "bằng nhau", "equal"), b: w("เท้า", "thao", "high", "bàn chân", "foot") },
  { id: "si-color-four", kind: "tone", a: w("สี", "si", "rising", "màu", "color"), b: w("สี่", "si", "low", "bốn (số 4)", "four") },
  { id: "chang-elephant-tech", kind: "tone", a: w("ช้าง", "chang", "high", "con voi", "elephant"), b: w("ช่าง", "chang", "falling", "thợ / kệ nó", "craftsman / never mind") },
  { id: "nam-name-water", kind: "tone", a: w("นาม", "nam", "mid", "tên / danh", "name"), b: w("น้ำ", "nam", "high", "nước", "water"),
    note_vi: "Nguyên âm dài/ngắn cũng khác (naam vs nam).", note_en: "Vowel length also differs (naam vs nam)." },
  { id: "tha-apply-pier", kind: "tone", a: w("ทา", "tha", "mid", "bôi / thoa", "to apply"), b: w("ท่า", "tha", "falling", "bến / tư thế", "pier / posture") },
  { id: "ru-hole-know", kind: "tone", a: w("รู", "ru", "mid", "lỗ / hốc", "hole"), b: w("รู้", "ru", "high", "biết", "to know") },
  { id: "chai-yes-use", kind: "tone", a: w("ใช่", "chai", "falling", "đúng / phải", "yes / correct"), b: w("ใช้", "chai", "high", "dùng / sử dụng", "to use") },
  { id: "len-play-mud", kind: "tone", a: w("เล่น", "len", "falling", "chơi", "to play"), b: w("เลน", "len", "mid", "bùn", "mud") },
  { id: "pho-enough-father", kind: "tone", a: w("พอ", "pho", "mid", "đủ", "enough"), b: w("พ่อ", "pho", "falling", "bố / ba", "father") },
  { id: "mae-mother-even", kind: "tone", a: w("แม่", "mae", "falling", "mẹ", "mother"), b: w("แม้", "mae", "high", "dù / dẫu", "even though") },
  { id: "khon-person-search", kind: "tone", a: w("คน", "khon", "mid", "người", "person"), b: w("ค้น", "khon", "high", "tìm kiếm", "to search") },
  { id: "doi-mountain-inferior", kind: "tone", a: w("ดอย", "doi", "mid", "núi (vùng cao)", "mountain"), b: w("ด้อย", "doi", "falling", "kém / thua", "inferior") },
  { id: "nong-sibling-swamp", kind: "tone", a: w("น้อง", "nong", "high", "em (em út)", "younger sibling"), b: w("หนอง", "nong", "rising", "đầm lầy / mủ", "swamp / pus") },
  { id: "ha-seek-five", kind: "tone", a: w("หา", "ha", "rising", "tìm", "to look for"), b: w("ห้า", "ha", "falling", "năm (số 5)", "five") },
  { id: "fan-fang-spell", kind: "spelling", a: w("ฟัน", "fan", "mid", "răng / chém", "tooth / to slash"), b: w("ฟัง", "fang", "mid", "nghe", "to listen"),
    note_vi: "Khác phụ âm cuối น/ง khi viết → nghĩa khác.", note_en: "Different final consonant น/ง in writing → different meaning." },
  { id: "rian-riang-spell", kind: "spelling", a: w("เรียน", "rian", "mid", "học", "to study"), b: w("เรียง", "riang", "mid", "sắp xếp / xếp hàng", "to arrange"),
    note_vi: "Khác phụ âm cuối น/ง khi viết.", note_en: "Different final consonant น/ง in writing." },
  { id: "khoi-wait-gradually", kind: "tone", a: w("คอย", "khoi", "mid", "đợi / chờ", "to wait"), b: w("ค่อย", "khoi", "falling", "từ từ / dần dần", "gradually") },
  { id: "mai-q-burn", kind: "tone", a: w("ไหม", "mai", "rising", "tiểu từ hỏi", "question particle"), b: w("ไหม้", "mai", "falling", "cháy", "to burn") },
  { id: "mu-pig-group", kind: "tone", a: w("หมู", "mu", "rising", "con heo / thịt heo", "pig / pork"), b: w("หมู่", "mu", "low", "nhóm / tiểu đội", "group / squad") },
  { id: "nang-lady-sit", kind: "tone", a: w("นาง", "nang", "mid", "bà / cô (danh xưng)", "lady / Mrs"), b: w("นั่ง", "nang", "falling", "ngồi", "to sit") },
  { id: "chan-i-floor", kind: "tone", a: w("ฉัน", "chan", "rising", "tôi (thân mật)", "I (informal)"), b: w("ชั้น", "chan", "high", "tầng / lớp", "floor / class") },
];

// ── build full drills from seeds (compact + consistent) ─────────────────

function buildDrill(s: Seed): ThaiWrittenContrastDrill {
  const { a, b, kind } = s;

  const writtenContrast_vi =
    kind === "tone"
      ? `${a.th} (${a.rom}) và ${b.th} (${b.rom}) trông gần giống nhau nhưng khác thanh: ${TONE_VI[a.tone]} so với ${TONE_VI[b.tone]}.`
      : `${a.th} (${a.rom}) và ${b.th} (${b.rom}) chỉ khác một chữ/phụ âm khi viết.`;
  const writtenContrast_en =
    kind === "tone"
      ? `${a.th} (${a.rom}) and ${b.th} (${b.rom}) look nearly identical but differ in tone: ${TONE_EN[a.tone]} vs ${TONE_EN[b.tone]}.`
      : `${a.th} (${a.rom}) and ${b.th} (${b.rom}) differ by a single letter/consonant in writing.`;

  const meaningContrast_vi = `${a.th} = ${a.vi}; ${b.th} = ${b.vi}.`;
  const meaningContrast_en = `${a.th} = ${a.en}; ${b.th} = ${b.en}.`;

  const baseWarn_vi =
    kind === "tone"
      ? "Thanh điệu quyết định nghĩa, không phải mặt chữ cái. Đây là bài tập nhận biết bằng chữ viết — không âm thanh, không chấm phát âm."
      : "Chỉ một chữ/phụ âm khác nhau đã đổi nghĩa; đọc kỹ mặt chữ. Bài tập nhận biết bằng chữ viết — không âm thanh, không chấm phát âm.";
  const baseWarn_en =
    kind === "tone"
      ? "Tone decides the meaning here, not the letters. This is a written-recognition exercise — no audio, no pronunciation scoring."
      : "A single differing letter/consonant changes the meaning; read the spelling carefully. Written-recognition only — no audio, no pronunciation scoring.";
  const learnerWarning_vi = s.note_vi ? `${baseWarn_vi} ${s.note_vi}` : baseWarn_vi;
  const learnerWarning_en = s.note_en ? `${baseWarn_en} ${s.note_en}` : baseWarn_en;

  const practicePrompt_vi = `Tự viết lại ${a.th} (${a.rom}) và ${b.th} (${b.rom}), ghi nghĩa từng từ và khoanh chỗ khác nhau khi viết. (Không cần đọc thành tiếng.)`;
  const practicePrompt_en = `Write out ${a.th} (${a.rom}) and ${b.th} (${b.rom}), note each meaning, and circle the written difference. (No speaking required.)`;

  return {
    id: s.id,
    kind,
    a,
    b,
    writtenContrast_vi,
    writtenContrast_en,
    meaningContrast_vi,
    meaningContrast_en,
    learnerWarning_vi,
    learnerWarning_en,
    practicePrompt_vi,
    practicePrompt_en,
  };
}

export const THAI_WRITTEN_CONTRAST_DRILLS: ReadonlyArray<ThaiWrittenContrastDrill> =
  SEEDS.map(buildDrill);

export default THAI_WRITTEN_CONTRAST_DRILLS;
