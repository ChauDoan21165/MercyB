// src/languages/punjabi/scriptBasics.ts
//
// Gurmukhi starter notes for Vietnamese-speaking and English-speaking
// learners. This is a reading-awareness reference, not audio training.
// No pronunciation scoring. Native review is deferred.

export type PunjabiScriptNoteKind =
  | "direction"
  | "letters"
  | "vowels"
  | "signs"
  | "pronunciation_awareness"
  | "shahmukhi_awareness";

export type PunjabiScriptNote = {
  id: string;
  kind: PunjabiScriptNoteKind;
  title_vi: string;
  title_en: string;
  gurmukhi?: string;
  romanization?: string;
  explanation_vi: string;
  explanation_en: string;
};

export type PunjabiLetter = {
  gurmukhi: string;
  name: string;
  romanization: string;
  example: string;
  exampleRomanization: string;
  vi: string;
  en: string;
};

export type PunjabiVowelSign = {
  sign: string;
  name: string;
  romanization: string;
  example: string;
  exampleRomanization: string;
  vi: string;
  en: string;
};

export const GURMUKHI_OVERVIEW = {
  vi: "Gurmukhi là chữ viết chính trong khóa Punjabi này. Chữ viết từ trái sang phải. Mỗi phụ âm thường có nguyên âm mặc định gần âm 'a'; các dấu nguyên âm đặt trước, sau, trên hoặc dưới phụ âm để đổi cách đọc.",
  en: "Gurmukhi is the primary script in this Punjabi course. It is written left to right. Each consonant usually carries an inherent short 'a'-like vowel; vowel signs appear before, after, above, or below a consonant to change the reading.",
} as const;

export const GURMUKHI_COMMON_LETTERS: ReadonlyArray<PunjabiLetter> = [
  { gurmukhi: "ਅ", name: "aira", romanization: "a", example: "ਅੱਜ", exampleRomanization: "ajj", vi: "chữ mang nguyên âm đầu; ví dụ: hôm nay", en: "initial vowel carrier; example: today" },
  { gurmukhi: "ਆ", name: "aira with kanna", romanization: "aa", example: "ਆਉਣਾ", exampleRomanization: "auna", vi: "âm aa dài; ví dụ: đến", en: "long aa sound; example: to come" },
  { gurmukhi: "ਇ", name: "iri", romanization: "i", example: "ਇਹ", exampleRomanization: "ih", vi: "nguyên âm i ngắn; ví dụ: cái này", en: "short i vowel; example: this" },
  { gurmukhi: "ਈ", name: "iri with bihari", romanization: "ii", example: "ਈਦ", exampleRomanization: "id", vi: "âm ii dài; ví dụ: Eid", en: "long ii sound; example: Eid" },
  { gurmukhi: "ਉ", name: "ura", romanization: "u", example: "ਉਹ", exampleRomanization: "oh", vi: "nguyên âm u/o đầu; ví dụ: người đó", en: "initial u/o vowel carrier; example: that person" },
  { gurmukhi: "ਸ", name: "sassa", romanization: "s", example: "ਸਾਲ", exampleRomanization: "saal", vi: "âm s; ví dụ: năm", en: "s sound; example: year" },
  { gurmukhi: "ਹ", name: "haha", romanization: "h", example: "ਹਾਂ", exampleRomanization: "haan", vi: "âm h; ví dụ: vâng", en: "h sound; example: yes" },
  { gurmukhi: "ਕ", name: "kakka", romanization: "k", example: "ਕਰਨਾ", exampleRomanization: "karna", vi: "âm k; ví dụ: làm", en: "k sound; example: to do" },
  { gurmukhi: "ਖ", name: "khakha", romanization: "kh", example: "ਖਾਣਾ", exampleRomanization: "khana", vi: "k bật hơi; ví dụ: ăn/thức ăn", en: "aspirated kh; example: food/to eat" },
  { gurmukhi: "ਗ", name: "gagga", romanization: "g", example: "ਗਰਮ", exampleRomanization: "garam", vi: "âm g; ví dụ: nóng", en: "g sound; example: hot" },
  { gurmukhi: "ਚ", name: "chacha", romanization: "ch", example: "ਚਾਹ", exampleRomanization: "chaah", vi: "âm ch; ví dụ: trà", en: "ch sound; example: tea" },
  { gurmukhi: "ਜ", name: "jajja", romanization: "j", example: "ਜਾਣਾ", exampleRomanization: "jana", vi: "âm j; ví dụ: đi", en: "j sound; example: to go" },
  { gurmukhi: "ਟ", name: "tainka", romanization: "t", example: "ਟਿਕਟ", exampleRomanization: "tikat", vi: "t quặt lưỡi; ví dụ: vé", en: "retroflex t; example: ticket" },
  { gurmukhi: "ਡ", name: "dadda", romanization: "d", example: "ਡਾਕਟਰ", exampleRomanization: "daaktar", vi: "d quặt lưỡi; ví dụ: bác sĩ", en: "retroflex d; example: doctor" },
  { gurmukhi: "ਤ", name: "tatta", romanization: "t", example: "ਤੁਸੀਂ", exampleRomanization: "tusi", vi: "t răng; ví dụ: bạn/quý vị", en: "dental t; example: you" },
  { gurmukhi: "ਦ", name: "dadda", romanization: "d", example: "ਦਿਨ", exampleRomanization: "din", vi: "d răng; ví dụ: ngày", en: "dental d; example: day" },
  { gurmukhi: "ਨ", name: "nanna", romanization: "n", example: "ਨਵਾਂ", exampleRomanization: "navaan", vi: "âm n; ví dụ: mới", en: "n sound; example: new" },
  { gurmukhi: "ਪ", name: "pappa", romanization: "p", example: "ਪਾਣੀ", exampleRomanization: "pani", vi: "âm p; ví dụ: nước", en: "p sound; example: water" },
  { gurmukhi: "ਫ", name: "phapha", romanization: "ph/f", example: "ਫਲ", exampleRomanization: "phal", vi: "ph/f theo từ; ví dụ: trái cây", en: "ph/f depending on word; example: fruit" },
  { gurmukhi: "ਬ", name: "babba", romanization: "b", example: "ਬੱਚਾ", exampleRomanization: "bachcha", vi: "âm b; ví dụ: đứa trẻ", en: "b sound; example: child" },
  { gurmukhi: "ਮ", name: "mamma", romanization: "m", example: "ਮਾਂ", exampleRomanization: "maan", vi: "âm m; ví dụ: mẹ", en: "m sound; example: mother" },
  { gurmukhi: "ਯ", name: "yayya", romanization: "y", example: "ਯਾਦ", exampleRomanization: "yaad", vi: "âm y; ví dụ: ký ức", en: "y sound; example: memory" },
  { gurmukhi: "ਰ", name: "rara", romanization: "r", example: "ਰਾਤ", exampleRomanization: "raat", vi: "âm r; ví dụ: đêm", en: "r sound; example: night" },
  { gurmukhi: "ਲ", name: "lalla", romanization: "l", example: "ਲੱਸੀ", exampleRomanization: "lassi", vi: "âm l; ví dụ: lassi", en: "l sound; example: lassi" },
  { gurmukhi: "ਵ", name: "vava", romanization: "v/w", example: "ਵੱਡਾ", exampleRomanization: "vadda", vi: "v/w tùy giọng; ví dụ: lớn", en: "v/w depending on accent; example: big" },
];

export const GURMUKHI_VOWEL_SIGNS: ReadonlyArray<PunjabiVowelSign> = [
  { sign: "ਾ", name: "kanna", romanization: "aa", example: "ਮਾ", exampleRomanization: "maa", vi: "dấu sau phụ âm, tạo âm aa dài", en: "written after the consonant, makes long aa" },
  { sign: "ਿ", name: "sihari", romanization: "i", example: "ਕਿ", exampleRomanization: "ki", vi: "viết trước phụ âm nhưng đọc sau; i ngắn", en: "written before but read after the consonant; short i" },
  { sign: "ੀ", name: "bihari", romanization: "ii", example: "ਕੀ", exampleRomanization: "ki", vi: "dấu ii dài", en: "long ii sign" },
  { sign: "ੁ", name: "aunkar", romanization: "u", example: "ਸੁ", exampleRomanization: "su", vi: "dấu u ngắn nằm dưới", en: "short u sign below" },
  { sign: "ੂ", name: "dulankar", romanization: "uu", example: "ਤੂ", exampleRomanization: "tu", vi: "dấu uu dài nằm dưới", en: "long uu sign below" },
  { sign: "ੇ", name: "lanv", romanization: "e", example: "ਮੇਰਾ", exampleRomanization: "mera", vi: "âm e", en: "e vowel sign" },
  { sign: "ੈ", name: "dulavan", romanization: "ai", example: "ਭੈਣ", exampleRomanization: "bhain", vi: "âm ai/ae", en: "ai/ae vowel sign" },
  { sign: "ੋ", name: "hora", romanization: "o", example: "ਦੋ", exampleRomanization: "do", vi: "âm o", en: "o vowel sign" },
  { sign: "ੌ", name: "kanaura", romanization: "au", example: "ਨੌਂ", exampleRomanization: "naun", vi: "âm au", en: "au vowel sign" },
];

export const GURMUKHI_STARTER_NOTES: ReadonlyArray<PunjabiScriptNote> = [
  {
    id: "gurmukhi_direction",
    kind: "direction",
    title_vi: "Hướng viết",
    title_en: "Writing direction",
    gurmukhi: "ਪੰਜਾਬੀ",
    romanization: "punjabi",
    explanation_vi: "Gurmukhi viết từ trái sang phải, giống tiếng Việt và tiếng Anh. Từ thường có đường ngang trên đầu nối các chữ trong cùng một từ.",
    explanation_en: "Gurmukhi is written left to right, like Vietnamese and English. Words often have a headline that connects letters within the word.",
  },
  {
    id: "gurmukhi_inherent_vowel",
    kind: "letters",
    title_vi: "Nguyên âm mặc định",
    title_en: "Inherent vowel",
    gurmukhi: "ਕ",
    romanization: "ka",
    explanation_vi: "Một phụ âm đơn như ਕ thường được đọc với nguyên âm mặc định gần 'a'. Dấu nguyên âm sẽ đổi âm này.",
    explanation_en: "A bare consonant such as ਕ is usually read with an inherent short 'a'-like vowel. Vowel signs change that vowel.",
  },
  {
    id: "gurmukhi_vowel_placement",
    kind: "vowels",
    title_vi: "Vị trí dấu nguyên âm",
    title_en: "Vowel sign placement",
    gurmukhi: "ਕਿ ਕੀ ਕੁ ਕੂ ਕੇ ਕੈ ਕੋ ਕੌ",
    romanization: "ki ki ku ku ke kai ko kau",
    explanation_vi: "Dấu nguyên âm có thể đứng trước, sau, trên hoặc dưới phụ âm. Dấu ਿ viết trước phụ âm nhưng vẫn đọc sau phụ âm.",
    explanation_en: "Vowel signs can sit before, after, above, or below the consonant. The sign ਿ is written before the consonant but read after it.",
  },
  {
    id: "gurmukhi_nasalization",
    kind: "signs",
    title_vi: "Dấu mũi hóa",
    title_en: "Nasalization marks",
    gurmukhi: "ਂ ਂ",
    romanization: "tippi / bindi",
    explanation_vi: "ਟਿੱਪੀ (ੰ) và ਬਿੰਦੀ (ਂ) thường báo hiệu âm mũi. Người học tiếng Việt có thể liên hệ với âm cuối m/n/ng nhưng không nên xem là giống hệt.",
    explanation_en: "Tippi (ੰ) and bindi (ਂ) often signal nasalization. Vietnamese speakers can relate this to final m/n/ng sounds, but they are not identical.",
  },
  {
    id: "gurmukhi_aspiration",
    kind: "pronunciation_awareness",
    title_vi: "Bật hơi",
    title_en: "Aspiration awareness",
    gurmukhi: "ਕ / ਖ, ਗ / ਘ, ਪ / ਫ",
    romanization: "k / kh, g / gh, p / ph",
    explanation_vi: "Nhiều cặp chữ khác nhau ở bật hơi. Romanization kh/gh/ph là gợi ý đọc chữ, không phải bài luyện phát âm có chấm điểm.",
    explanation_en: "Many letter pairs differ by aspiration. Romanization such as kh/gh/ph is a reading cue, not scored pronunciation training.",
  },
  {
    id: "gurmukhi_retroflex",
    kind: "pronunciation_awareness",
    title_vi: "Âm quặt lưỡi",
    title_en: "Retroflex awareness",
    gurmukhi: "ਟ ਡ ਣ",
    romanization: "t d n",
    explanation_vi: "ਟ, ਡ, ਣ là nhóm quặt lưỡi. Tiếng Việt và tiếng Anh không đánh dấu kiểu này trong chữ Latin, nên hãy xem đây là cảnh báo nhận diện khi đọc.",
    explanation_en: "ਟ, ਡ, ਣ are retroflex letters. Vietnamese and English do not mark this contrast in ordinary Latin spelling, so treat it as a reading-awareness cue.",
  },
  {
    id: "gurmukhi_tone_awareness",
    kind: "pronunciation_awareness",
    title_vi: "Ý thức về thanh điệu Punjabi",
    title_en: "Punjabi tone awareness",
    gurmukhi: "ਘਰ, ਕੋੜਾ",
    romanization: "ghar, kora",
    explanation_vi: "Punjabi có tương phản thanh điệu trong một số từ, nhưng Gurmukhi không ghi thanh bằng hệ dấu như tiếng Việt. Khóa này chỉ ghi chú nhận biết bằng chữ, không chấm phát âm.",
    explanation_en: "Punjabi has tonal contrasts in some words, but Gurmukhi does not mark tone with a Vietnamese-style tone-mark system. This course gives written awareness only, with no pronunciation scoring.",
  },
  {
    id: "gurmukhi_shahmukhi_awareness",
    kind: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi awareness",
    explanation_vi: "Punjabi cũng có thể được viết bằng Shahmukhi trong cộng đồng Pakistan. Khóa này dùng Gurmukhi làm chính và chỉ nhắc Shahmukhi để người học biết có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ.",
    explanation_en: "Punjabi can also be written in Shahmukhi in Pakistani communities. This course uses Gurmukhi as primary and mentions Shahmukhi only so learners know another script exists; this is not a full Shahmukhi course.",
  },
];

export default GURMUKHI_STARTER_NOTES;
