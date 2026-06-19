// src/languages/thai/searchGlossary.ts
//
// Thai search glossary / romanization index (A9, Wave 3).
//
// A flat, searchable index that lets a learner find a Thai word by typing
// English, Vietnamese, romanization, OR Thai script. Each entry carries
// aliases/synonyms and topic tags so partial and cross-language queries
// still hit.
//
// The core is derived from the curated ./vocabulary.ts list (single source
// of truth for the headwords) and enriched here with search aliases + tags;
// a curated block of extra search-only phrases (travel, shopping, health,
// directions) is appended.
//
// Scope guardrails:
//   • No audio, no TTS, no mic, no Azure, no pronunciation scoring.
//   • `rom` and aliases are plain reading/search aids — they do NOT encode
//     tone. Tone-awareness notes appear only where a word is famously
//     tone-confusable.
//   • Native review is DEFERRED.

import { THAI_VOCABULARY } from "./vocabulary";
import type { ThaiVocabCategory } from "./vocabulary";

export type ThaiGlossaryEntry = {
  /** Thai script (the headword) */
  th: string;
  /** plain romanization reading aid (no tone encoded) */
  rom: string;
  /** Vietnamese gloss */
  vi: string;
  /** English gloss */
  en: string;
  /** alternate search terms: romanization variants + VI/EN synonyms */
  aliases: ReadonlyArray<string>;
  /** topic tags for filtering / faceted search */
  tags: ReadonlyArray<string>;
  /** optional bilingual tone-confusability note (no scoring) */
  toneNote?: string;
};

// ── helpers ───────────────────────────────────────────────────────────

/** Split a gloss into lowercase search tokens (drops parentheticals). */
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .split(/[/,;]|\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

/**
 * Build alternate search terms from rom + glosses. Always returns at least
 * one entry. Canonical fields (rom/vi/en) are excluded so aliases stay
 * genuinely *alternate*.
 */
function buildAliases(rom: string, vi: string, en: string, extra: string[] = []): string[] {
  const set = new Set<string>();
  const add = (x: string) => {
    const v = x.trim().toLowerCase();
    if (v.length >= 2) set.add(v);
  };
  if (rom.includes(" ")) {
    add(rom.replace(/ /g, ""));
    add(rom.replace(/ /g, "-"));
  }
  tokenize(vi).forEach(add);
  tokenize(en).forEach(add);
  extra.forEach(add);
  set.delete(rom.toLowerCase());
  set.delete(vi.toLowerCase());
  set.delete(en.toLowerCase());
  if (set.size === 0) set.add(rom.toLowerCase().replace(/\s+/g, ""));
  return [...set];
}

const CATEGORY_TAGS: Record<ThaiVocabCategory, string[]> = {
  greetings: ["greetings", "social"],
  pronouns: ["pronouns", "grammar"],
  numbers: ["numbers"],
  time: ["time", "calendar"],
  family: ["family", "people"],
  food: ["food", "dining"],
  verbs: ["verbs"],
  adjectives: ["adjectives", "descriptions"],
  questions: ["questions", "grammar"],
  places: ["places", "travel"],
  colors: ["colors"],
  body: ["body", "health"],
  money: ["money", "shopping"],
  function: ["function", "grammar"],
};

// Tone-confusable headwords → bilingual awareness note (no scoring).
const TONE_NOTES: Record<string, string> = {
  ไกล: "VI: ไกล 'xa' (thanh trung) dễ lẫn với ใกล้ 'gần' (thanh xuống). EN: 'far' vs 'near' differ by tone.",
  ใกล้: "VI: ใกล้ 'gần' (thanh xuống) vs ไกล 'xa' (thanh trung). EN: 'near' vs 'far' differ by tone.",
  ขาว: "VI: ขาว 'trắng' (thanh lên) vs ข่าว 'tin tức' (thanh thấp). EN: 'white' vs 'news' differ by tone.",
  ข้าว: "VI: ข้าว 'cơm', ขาว 'trắng', ข่าว 'tin tức' — phân biệt bằng thanh. EN: rice / white / news differ by tone.",
  ไม่: "VI: ไม่ 'không' vs ไม้ 'gỗ' vs ใหม่ 'mới' — khác thanh, khác nghĩa. EN: not / wood / new differ by tone.",
  เก่า: "VI: เก่า 'cũ' (thanh thấp) dễ lẫn với เก้า 'chín, số 9' (thanh xuống). EN: 'old' vs 'nine' differ by tone.",
  เก้า: "VI: เก้า 'chín (số 9)' (thanh xuống) vs เก่า 'cũ' (thanh thấp). EN: 'nine' vs 'old' differ by tone.",
};

// ── derived core (from the curated vocabulary) ──────────────────────────

const CORE: ThaiGlossaryEntry[] = THAI_VOCABULARY.map((e) => {
  const entry: ThaiGlossaryEntry = {
    th: e.th,
    rom: e.rom,
    vi: e.vi,
    en: e.en,
    aliases: buildAliases(e.rom, e.vi, e.en),
    tags: [...CATEGORY_TAGS[e.category], e.level],
  };
  if (TONE_NOTES[e.th]) entry.toneNote = TONE_NOTES[e.th];
  return entry;
});

// ── curated search-only extras (phrases learners actually type) ─────────

type ExtraSeed = {
  th: string;
  rom: string;
  vi: string;
  en: string;
  tags: string[];
  aliasExtra?: string[];
  toneNote?: string;
};

const EXTRA_SEEDS: ExtraSeed[] = [
  // directions & getting around
  { th: "ตรงไป", rom: "trong pai", vi: "đi thẳng", en: "go straight", tags: ["directions", "travel"] },
  { th: "เลี้ยวซ้าย", rom: "liao sai", vi: "rẽ trái", en: "turn left", tags: ["directions", "travel"] },
  { th: "เลี้ยวขวา", rom: "liao khwa", vi: "rẽ phải", en: "turn right", tags: ["directions", "travel"] },
  { th: "ซ้าย", rom: "sai", vi: "trái (bên trái)", en: "left", tags: ["directions"] },
  { th: "ขวา", rom: "khwa", vi: "phải (bên phải)", en: "right", tags: ["directions"] },
  { th: "ที่นี่", rom: "thini", vi: "ở đây", en: "here", tags: ["directions", "function"] },
  { th: "ที่นั่น", rom: "thinan", vi: "ở đó", en: "there", tags: ["directions", "function"] },
  // shopping & money
  { th: "อันนี้", rom: "an ni", vi: "cái này", en: "this one", tags: ["shopping", "function"], aliasExtra: ["this", "cai nay"] },
  { th: "อันนั้น", rom: "an nan", vi: "cái đó", en: "that one", tags: ["shopping", "function"], aliasExtra: ["that", "cai do"] },
  { th: "เอาอันนี้", rom: "ao an ni", vi: "lấy cái này", en: "I'll take this one", tags: ["shopping"] },
  { th: "ไม่เอา", rom: "mai ao", vi: "không lấy / không cần", en: "I don't want it", tags: ["shopping", "function"] },
  { th: "ลดได้ไหม", rom: "lot dai mai", vi: "giảm giá được không?", en: "can you lower the price?", tags: ["shopping", "money"] },
  { th: "แพงไป", rom: "phaeng pai", vi: "đắt quá", en: "too expensive", tags: ["shopping", "money"] },
  { th: "เช็คบิล", rom: "chek bin", vi: "tính tiền", en: "check, please", tags: ["dining", "money"] },
  { th: "เงินสด", rom: "ngoen sot", vi: "tiền mặt", en: "cash", tags: ["money", "shopping"] },
  // dining extras
  { th: "อร่อยมาก", rom: "aroi mak", vi: "rất ngon", en: "very delicious", tags: ["dining", "food"] },
  { th: "เผ็ดมาก", rom: "phet mak", vi: "rất cay", en: "very spicy", tags: ["dining", "food"] },
  { th: "ไม่เผ็ด", rom: "mai phet", vi: "không cay", en: "not spicy", tags: ["dining", "food"] },
  { th: "น้ำแข็ง", rom: "nam khaeng", vi: "đá (lạnh)", en: "ice", tags: ["dining", "food"] },
  { th: "ร้อนมาก", rom: "ron mak", vi: "rất nóng", en: "very hot", tags: ["dining", "descriptions"] },
  // health & trouble
  { th: "ช่วยด้วย", rom: "chuai duai", vi: "cứu với!", en: "help!", tags: ["health", "emergency"] },
  { th: "ไม่สบาย", rom: "mai sabai", vi: "không khỏe / mệt", en: "unwell / not feeling well", tags: ["health"] },
  { th: "หมอ", rom: "mo", vi: "bác sĩ", en: "doctor", tags: ["health", "people"] },
  { th: "ยา", rom: "ya", vi: "thuốc", en: "medicine", tags: ["health"] },
  { th: "ตำรวจ", rom: "tamruat", vi: "cảnh sát", en: "police", tags: ["emergency", "people"] },
  { th: "ง่วงนอน", rom: "nguang non", vi: "buồn ngủ", en: "sleepy", tags: ["health", "descriptions"] },
  // communication
  { th: "พูดช้าๆ", rom: "phut cha cha", vi: "nói chậm lại", en: "please speak slowly", tags: ["communication"] },
  { th: "พูดอีกที", rom: "phut ik thi", vi: "nói lại lần nữa", en: "say it again", tags: ["communication"] },
  { th: "ไม่เข้าใจ", rom: "mai khao chai", vi: "tôi không hiểu", en: "I don't understand", tags: ["communication"] },
  { th: "เข้าใจแล้ว", rom: "khao chai laeo", vi: "hiểu rồi", en: "I understand now", tags: ["communication"] },
  { th: "พูดภาษาอังกฤษได้ไหม", rom: "phut phasa angkrit dai mai", vi: "nói tiếng Anh được không?", en: "do you speak English?", tags: ["communication"] },
  // languages, places, identity
  { th: "ภาษาไทย", rom: "phasa thai", vi: "tiếng Thái", en: "Thai language", tags: ["language"] },
  { th: "ภาษาอังกฤษ", rom: "phasa angkrit", vi: "tiếng Anh", en: "English language", tags: ["language"] },
  { th: "ภาษาเวียดนาม", rom: "phasa wiatnam", vi: "tiếng Việt", en: "Vietnamese language", tags: ["language"] },
  { th: "คนไทย", rom: "khon thai", vi: "người Thái", en: "Thai person", tags: ["people", "identity"] },
  { th: "คนเวียดนาม", rom: "khon wiatnam", vi: "người Việt", en: "Vietnamese person", tags: ["people", "identity"] },
  { th: "ประเทศไทย", rom: "prathet thai", vi: "nước Thái Lan", en: "Thailand", tags: ["places", "travel"] },
  { th: "เวียดนาม", rom: "wiatnam", vi: "Việt Nam", en: "Vietnam", tags: ["places", "travel"] },
  // common verbs/adjectives not in core
  { th: "เปิด", rom: "poet", vi: "mở", en: "to open", tags: ["verbs"] },
  { th: "ปิด", rom: "pit", vi: "đóng", en: "to close", tags: ["verbs"] },
  { th: "ขอ", rom: "kho", vi: "xin / cho tôi", en: "may I have / to request", tags: ["verbs", "function"] },
  { th: "รอ", rom: "ro", vi: "đợi / chờ", en: "to wait", tags: ["verbs"] },
  { th: "ช่วย", rom: "chuai", vi: "giúp", en: "to help", tags: ["verbs"] },
];

const EXTRA: ThaiGlossaryEntry[] = EXTRA_SEEDS.map((s) => {
  const entry: ThaiGlossaryEntry = {
    th: s.th,
    rom: s.rom,
    vi: s.vi,
    en: s.en,
    aliases: buildAliases(s.rom, s.vi, s.en, s.aliasExtra),
    tags: s.tags,
  };
  if (s.toneNote) entry.toneNote = s.toneNote;
  return entry;
});

// ── final index (deduped by Thai headword; core wins) ───────────────────

const seenTh = new Set<string>(CORE.map((e) => e.th));
export const THAI_SEARCH_GLOSSARY: ReadonlyArray<ThaiGlossaryEntry> = [
  ...CORE,
  ...EXTRA.filter((e) => !seenTh.has(e.th)),
];

// ── search ──────────────────────────────────────────────────────────────

/** True if `entry` matches the already-lowercased query `q`. */
function entryMatches(entry: ThaiGlossaryEntry, q: string): boolean {
  if (entry.th.includes(q)) return true; // Thai script (no case)
  if (entry.rom.toLowerCase().includes(q)) return true;
  if (entry.vi.toLowerCase().includes(q)) return true;
  if (entry.en.toLowerCase().includes(q)) return true;
  return entry.aliases.some((a) => a.includes(q));
}

/**
 * Search the glossary by English, Vietnamese, romanization, or Thai script.
 * Case-insensitive substring match across headword, glosses, and aliases.
 * Returns [] for an empty query.
 */
export function searchThaiGlossary(
  query: string,
  entries: ReadonlyArray<ThaiGlossaryEntry> = THAI_SEARCH_GLOSSARY,
): ThaiGlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter((e) => entryMatches(e, q));
}

export default THAI_SEARCH_GLOSSARY;
