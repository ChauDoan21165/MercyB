// src/languages/punjabi/searchGlossary.ts
//
// Search glossary / romanization index for Punjabi vocabulary.
// Gurmukhi is primary; English, Vietnamese, and romanization are search aids.
// No audio scoring. Native review is deferred.

import {
  PUNJABI_VOCABULARY,
  type PunjabiVocabEntry,
} from "@/languages/punjabi/vocabulary";

export type PunjabiSearchGlossaryEntry = {
  id: string;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  aliases: ReadonlyArray<string>;
  topicTags: ReadonlyArray<string>;
  scriptAwarenessNote?: {
    vi: string;
    en: string;
  };
};

const romanizationAliases: Record<string, ReadonlyArray<string>> = {
  "ਨਹੀਂ": ["nahin", "nahiin"],
  "ਤੁਸੀਂ": ["tusiin", "tusee"],
  "ਅਸੀਂ": ["asiin", "asee"],
  "ਕਿੱਥੇ": ["kithe", "kitthe"],
  "ਕਿਵੇਂ": ["kiven", "kivein"],
  "ਫਲ": ["fal", "phal"],
  "ਫਾਰਮੇਸੀ": ["farmesi", "pharmacy"],
  "ਵੱਡਾ": ["wadda", "vadda"],
  "ਸਕੂਲ": ["school", "sakool"],
  "ਰੇਲਵੇ ਸਟੇਸ਼ਨ": ["railway station", "relve station"],
  "ਰੈਸਟੋਰੈਂਟ": ["restaurant", "restorent"],
  "ਬਾਥਰੂਮ": ["bathroom", "bathrum"],
  "ਗੁਰਦੁਆਰਾ": ["gurdwara", "gurudwara"],
  "ਸ਼ਹਿਰ": ["shahir", "shehar"],
  "ਸ਼ੁਕਰੀਆ": ["shukria", "shukriya"],
  "ਸ਼ੁਭ ਰਾਤਰੀ": ["shubh ratri", "shubh raatri"],
  "ਸ਼ਾਮ": ["shaam", "sham"],
  "ਸ਼ੁੱਕਰਵਾਰ": ["shukarvaar", "shukkarvaar"],
};

const viSynonyms: Record<string, ReadonlyArray<string>> = {
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ": ["xin chao", "chao ban"],
  "ਧੰਨਵਾਦ": ["cam on", "cảm ơn bạn"],
  "ਮਾਫ਼ ਕਰਨਾ": ["xin loi", "thứ lỗi"],
  "ਕਿਰਪਾ ਕਰਕੇ": ["lam on", "vui long"],
  "ਹਾਂ": ["vang", "co"],
  "ਨਹੀਂ": ["khong", "không phải"],
  "ਪਰਿਵਾਰ": ["gia dinh", "nhà"],
  "ਮਾਂ": ["me", "má"],
  "ਪਿਤਾ": ["cha", "bo"],
  "ਪਾਣੀ": ["nuoc", "nước uống"],
  "ਚਾਹ": ["tra", "trà nóng"],
  "ਖਾਣਾ": ["thuc an", "an"],
  "ਘਰ": ["nha", "nhà ở"],
  "ਸਕੂਲ": ["truong hoc", "trường"],
  "ਦੁਕਾਨ": ["cua hang", "tiệm"],
  "ਹਸਪਤਾਲ": ["benh vien", "nhà thương"],
  "ਬੱਸ ਅੱਡਾ": ["ben xe buyt", "trạm xe buýt"],
  "ਹਵਾਈ ਅੱਡਾ": ["san bay", "phi trường"],
};

const enSynonyms: Record<string, ReadonlyArray<string>> = {
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ": ["hi", "greeting"],
  "ਧੰਨਵਾਦ": ["thanks", "thank-you"],
  "ਮਾਫ਼ ਕਰਨਾ": ["excuse me", "apology"],
  "ਕਿਰਪਾ ਕਰਕੇ": ["please", "kindly"],
  "ਹਾਂ": ["yes", "yeah"],
  "ਨਹੀਂ": ["no", "not"],
  "ਮੈਂ": ["me", "myself"],
  "ਤੁਸੀਂ": ["you formal", "you plural"],
  "ਪਰਿਵਾਰ": ["family", "household"],
  "ਮਾਂ": ["mom", "mum"],
  "ਪਿਤਾ": ["father", "dad"],
  "ਪਾਣੀ": ["water", "drink"],
  "ਚਾਹ": ["tea", "chai"],
  "ਖਾਣਾ": ["food", "meal"],
  "ਘਰ": ["home", "house"],
  "ਸਕੂਲ": ["school", "class"],
  "ਦੁਕਾਨ": ["store", "shop"],
  "ਹਸਪਤਾਲ": ["hospital", "clinic"],
  "ਬੱਸ ਅੱਡਾ": ["bus stop", "bus stand"],
  "ਹਵਾਈ ਅੱਡਾ": ["airport", "airfield"],
};

const scriptNotes: Record<string, PunjabiSearchGlossaryEntry["scriptAwarenessNote"]> = {
  "ਕਿੱਥੇ": {
    vi: "Dấu ਿ viết trước phụ âm nhưng đọc sau; romanization kitthe chỉ là hỗ trợ tìm kiếm.",
    en: "The ਿ sign is written before the consonant but read after it; kitthe is a search aid.",
  },
  "ਫਲ": {
    vi: "ਫ có thể được romanize là ph hoặc f; hãy ưu tiên tìm bằng Gurmukhi khi có thể.",
    en: "ਫ may be romanized as ph or f; prefer Gurmukhi search when possible.",
  },
  "ਵੱਡਾ": {
    vi: "ਵ có thể gần v hoặc w tùy giọng; romanization không phải chấm phát âm.",
    en: "ਵ can be close to v or w by accent; romanization is not pronunciation scoring.",
  },
  "ਟਿਕਟ": {
    vi: "ਟ là t quặt lưỡi; chữ Latin t không luôn phân biệt được với ਤ.",
    en: "ਟ is retroflex t; Latin t does not always distinguish it from ਤ.",
  },
  "ਮਾਂ": {
    vi: "ਂ báo mũi hóa; khi tìm bằng Latin, thử cả maan và man nếu cần.",
    en: "ਂ marks nasalization; when searching in Latin letters, try both maan and man if needed.",
  },
  "ਗੁਰਦੁਆਰਾ": {
    vi: "Punjabi cũng có Shahmukhi trong một số cộng đồng; mục này chỉ hỗ trợ nhận biết, không phải khóa Shahmukhi đầy đủ.",
    en: "Punjabi also has Shahmukhi in some communities; this is awareness only, not a full Shahmukhi course.",
  },
};

const splitGloss = (value: string): string[] =>
  value
    .split(/[/(),]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);

const compact = (values: ReadonlyArray<string>): ReadonlyArray<string> => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    const key = normalized.toLocaleLowerCase();
    if (normalized.length > 0 && !seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
};

const buildAliases = (entry: PunjabiVocabEntry): ReadonlyArray<string> =>
  compact([
    entry.gurmukhi,
    entry.romanization,
    ...splitGloss(entry.vi),
    ...splitGloss(entry.en),
    ...(romanizationAliases[entry.gurmukhi] ?? []),
    ...(viSynonyms[entry.gurmukhi] ?? []),
    ...(enSynonyms[entry.gurmukhi] ?? []),
  ]);

const toSearchEntry = (entry: PunjabiVocabEntry, index: number): PunjabiSearchGlossaryEntry => ({
  id: `pa-search-${String(index + 1).padStart(3, "0")}`,
  gurmukhi: entry.gurmukhi,
  romanization: entry.romanization,
  vi: entry.vi,
  en: entry.en,
  aliases: buildAliases(entry),
  topicTags: compact(["punjabi", "gurmukhi", entry.topic, entry.level]),
  scriptAwarenessNote: scriptNotes[entry.gurmukhi],
});

export const PUNJABI_SEARCH_GLOSSARY: ReadonlyArray<PunjabiSearchGlossaryEntry> =
  PUNJABI_VOCABULARY.map(toSearchEntry);

export const PUNJABI_SEARCH_SCRIPT_AWARENESS = {
  vi: "Tìm kiếm hỗ trợ Gurmukhi, romanization, tiếng Việt và tiếng Anh. Gurmukhi là nguồn chính; romanization chỉ là gợi ý đọc/tìm kiếm. Shahmukhi được nhắc để nhận biết rằng Punjabi có hệ chữ khác trong một số cộng đồng, không phải khóa Shahmukhi đầy đủ.",
  en: "Search supports Gurmukhi, romanization, Vietnamese, and English. Gurmukhi is the primary source; romanization is only a reading/search aid. Shahmukhi is mentioned so learners know Punjabi has another script in some communities, not as a full Shahmukhi course.",
} as const;

export const findPunjabiSearchEntries = (query: string): ReadonlyArray<PunjabiSearchGlossaryEntry> => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) {
    return [];
  }

  return PUNJABI_SEARCH_GLOSSARY.filter((entry) =>
    [
      entry.gurmukhi,
      entry.romanization,
      entry.vi,
      entry.en,
      ...entry.aliases,
      ...entry.topicTags,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
};

export default PUNJABI_SEARCH_GLOSSARY;
