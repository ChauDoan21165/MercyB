// src/languages/german/vocabulary.ts
//
// 50 core German vocabulary items for Vietnamese learners.
// Hand-crafted selection prioritizing practical everyday use —
// greetings, numbers, food, travel, and common verbs Vietnamese
// learners need when starting German.
//
// Each entry: German word, English, Vietnamese gloss, part of speech,
// and a pronunciation hint written for Vietnamese speakers (phonetic
// approximations, common mistake warnings).

export type GermanVocabEntry = {
  cell_id?: string;
  de: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
};

export const GERMAN_VOCABULARY: ReadonlyArray<GermanVocabEntry> = [
  // ── Greetings & Politeness (10) ───────────────────────────────────────
  { de: "hallo", en: "hello", vi: "xin chào", pos: "interjection", pronunciation_vi: "HA-lô — giống 'hallo' tiếng Anh nhưng 'a' ngắn hơn" },
  { de: "guten Morgen", en: "good morning", vi: "chào buổi sáng", pos: "phrase", pronunciation_vi: "GU-tần MO-ghần — 'g' đọc 'g' cứng, 'en' đọc 'ần'" },
  { de: "guten Tag", en: "good day", vi: "chào buổi trưa", pos: "phrase", pronunciation_vi: "GU-tần TÁC — 'Tag' đọc 'tác' với 'a' dài" },
  { de: "guten Abend", en: "good evening", vi: "chào buổi tối", pos: "phrase", pronunciation_vi: "GU-tần A-bần — 'A' dài, 'bend' đọc 'bần'" },
  { de: "auf Wiedersehen", en: "goodbye (formal)", vi: "tạm biệt (lịch sự)", pos: "phrase", pronunciation_vi: "aop VÍ-đa-dê-ần — 'au' đọc 'ao', 'W' đọc 'V', 'eh' đọc 'ê'" },
  { de: "tschüss", en: "bye (informal)", vi: "tạm biệt (thân mật)", pos: "interjection", pronunciation_vi: "CHUÝT — 'tsch' đọc 'ch' bật hơi, 'ü' đọc 'uy' ngắn" },
  { de: "danke", en: "thank you", vi: "cảm ơn", pos: "interjection", pronunciation_vi: "ĐĂNG-kờ — 'a' đọc 'ă' ngắn, 'e' cuối đọc 'ơ' nhẹ" },
  { de: "bitte", en: "please / you're welcome", vi: "làm ơn / không có gì", pos: "interjection", pronunciation_vi: "BÍT-tờ — 'i' ngắn, 'e' cuối đọc 'ơ' nhẹ" },
  { de: "entschuldigung", en: "sorry / excuse me", vi: "xin lỗi", pos: "interjection", pronunciation_vi: "en-CHUN-đi-gùng — 'sch' đọc 's' nặng, 'ung' đọc 'ùng'" },
  { de: "es tut mir leid", en: "I'm sorry", vi: "tôi xin lỗi", pos: "phrase", pronunciation_vi: "ét TÚT mia LAIT — 'ei' đọc 'ai' như tiếng Anh 'lie'" },

  // ── Numbers 1-10 (10) ─────────────────────────────────────────────────
  { de: "eins", en: "one", vi: "một", pos: "number", pronunciation_vi: "AIN-x — 'ei' đọc 'ai', cuối có âm 's' nhẹ" },
  { de: "zwei", en: "two", vi: "hai", pos: "number", pronunciation_vi: "X-VAI — 'z' đọc 'x', 'ei' đọc 'ai'" },
  { de: "drei", en: "three", vi: "ba", pos: "number", pronunciation_vi: "ĐRAI — 'dr' đọc 'đ-r' nhanh, 'ei' đọc 'ai'" },
  { de: "vier", en: "four", vi: "bốn", pos: "number", pronunciation_vi: "PHIA — 'v' đọc 'ph', 'ie' đọc 'i' dài, 'r' cuối nhẹ" },
  { de: "fünf", en: "five", vi: "năm", pos: "number", pronunciation_vi: "PHUYNPH — 'ü' đọc 'uy', 'f' cuối đọc nhẹ" },
  { de: "sechs", en: "six", vi: "sáu", pos: "number", pronunciation_vi: "DÉC-X — 's' đọc 'd' như 'zoo', 'chs' đọc 'x'" },
  { de: "sieben", en: "seven", vi: "bảy", pos: "number", pronunciation_vi: "DÍ-bần — 's' đọc 'd', 'ie' đọc 'i' dài, 'en' đọc 'ần'" },
  { de: "acht", en: "eight", vi: "tám", pos: "number", pronunciation_vi: "ÁCHT — 'a' ngắn, 'cht' đọc 'cht' bật hơi nhẹ" },
  { de: "neun", en: "nine", vi: "chín", pos: "number", pronunciation_vi: "NOIN — 'eu' đọc 'oi', 'n' cuối đọc rõ" },
  { de: "zehn", en: "ten", vi: "mười", pos: "number", pronunciation_vi: "XÊN — 'z' đọc 'x', 'eh' đọc 'ê' dài, 'n' đọc rõ" },

  // ── Common Phrases (10) ───────────────────────────────────────────────
  { de: "wie geht es Ihnen", en: "how are you (formal)", vi: "bạn khỏe không (lịch sự)", pos: "phrase", pronunciation_vi: "vi GHÊT ét Í-nần — 'ie' đọc 'i' dài, 'Ih' viết hoa = lịch sự" },
  { de: "mir geht es gut", en: "I'm fine", vi: "tôi khỏe", pos: "phrase", pronunciation_vi: "mia GHÊT ét GÚT — 'g' cứng, 'u' đọc 'u' dài" },
  { de: "ich heiße", en: "my name is", vi: "tôi tên là", pos: "phrase", pronunciation_vi: "ÍCH HAI-xờ — 'ch' đọc nhẹ, 'ei' đọc 'ai', 'ß' đọc 'x'" },
  { de: "ich verstehe nicht", en: "I don't understand", vi: "tôi không hiểu", pos: "phrase", pronunciation_vi: "ÍCH phe-XTÊ-ờ NÍCHT — 'v' đọc 'ph', 'st' đọc 's-t', 'ch' đọc nhẹ" },
  { de: "sprechen Sie Englisch", en: "do you speak English", vi: "bạn nói tiếng Anh không", pos: "phrase", pronunciation_vi: "SPRÊ-chần DI ÉNG-lít-s — 'sch' đọc 's' nặng, 'ie' đọc 'i' dài" },
  { de: "ich möchte", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "phrase", pronunciation_vi: "ÍCH MỚCH-tờ — 'ö' đọc 'ơ' tròn môi, 'chte' đọc 'ch-tờ'" },
  { de: "wie viel kostet das", en: "how much does it cost", vi: "cái này giá bao nhiêu", pos: "phrase", pronunciation_vi: "vi PHIN CÓT-tệt ĐÁT — 'v' đọc 'ph', 'ie' đọc 'i' dài" },
  { de: "wo ist die Toilette", en: "where is the bathroom", vi: "nhà vệ sinh ở đâu", pos: "phrase", pronunciation_vi: "VÔ ÍT đi toa-LÉT-tờ — 'w' đọc 'v', 'ie' đọc 'i' dài" },
  { de: "die Rechnung bitte", en: "the check please", vi: "cho xin hóa đơn", pos: "phrase", pronunciation_vi: "đi RÉCH-nùng BÍT-tờ — 'Rech' đọc 'réch' với âm 'ch' nhẹ" },
  { de: "schönen Tag noch", en: "have a nice day", vi: "chúc một ngày tốt lành", pos: "phrase", pronunciation_vi: "SƠ-nần TÁC NÓC — 'sch' đọc 's' nặng, 'ö' đọc 'ơ' tròn môi" },

  // ── Food & Dining (10) ────────────────────────────────────────────────
  { de: "Brot", en: "bread", vi: "bánh mì", pos: "noun (n)", pronunciation_vi: "B-RÔT — 'o' đọc 'ô' dài, 't' cuối đọc rõ" },
  { de: "Käse", en: "cheese", vi: "phô mai", pos: "noun (m)", pronunciation_vi: "KÊ-dờ — 'ä' đọc 'e' mở như 'e' tiếng Việt" },
  { de: "Butter", en: "butter", vi: "bơ", pos: "noun (f)", pronunciation_vi: "BÚT-tờ — 'u' ngắn, 'er' đọc 'ờ' nhẹ" },
  { de: "Ei", en: "egg", vi: "trứng", pos: "noun (n)", pronunciation_vi: "AI — 'ei' đọc 'ai', giống 'I' tiếng Anh" },
  { de: "Hähnchen", en: "chicken", vi: "thịt gà", pos: "noun (n)", pronunciation_vi: "HÊN-chần — 'ä' đọc 'ê' mở, 'chen' nhẹ" },
  { de: "Gemüse", en: "vegetables", vi: "rau củ", pos: "noun (n)", pronunciation_vi: "ghờ-MUY-dờ — 'g' đọc 'g' cứng, 'ü' đọc 'uy'" },
  { de: "Wasser", en: "water", vi: "nước", pos: "noun (n)", pronunciation_vi: "VÁT-xờ — 'W' đọc 'V', 'a' ngắn, 'sser' đọc 'xờ'" },
  { de: "Wein", en: "wine", vi: "rượu vang", pos: "noun (m)", pronunciation_vi: "VAIN — 'W' đọc 'V', 'ei' đọc 'ai'" },
  { de: "Zucker", en: "sugar", vi: "đường", pos: "noun (m)", pronunciation_vi: "XÚC-cờ — 'Z' đọc 'x', 'u' ngắn, 'er' đọc 'ờ'" },
  { de: "Salz", en: "salt", vi: "muối", pos: "noun (n)", pronunciation_vi: "DAN-X — 'S' đọc 'd' như 'zoo', 'al' đọc 'an', 'z' đọc 'x'" },

  // ── Travel & Directions (5) ───────────────────────────────────────────
  { de: "Bahnhof", en: "train station", vi: "ga tàu", pos: "noun (m)", pronunciation_vi: "BAN-hốp — 'ah' đọc 'a' dài, 'hof' đọc 'hốp'" },
  { de: "Straße", en: "street", vi: "đường phố", pos: "noun (f)", pronunciation_vi: "S-TRÁT-xờ — 'a' đọc 'a' dài, 'ß' đọc 'x', 'e' cuối 'ờ'" },
  { de: "links", en: "left", vi: "bên trái", pos: "adverb", pronunciation_vi: "LÍNG-K-X — 'i' ngắn, 'nks' đọc 'ng-k-x' nhanh" },
  { de: "rechts", en: "right", vi: "bên phải", pos: "adverb", pronunciation_vi: "RÉCH-T-X — 'e' đọc 'ê', 'chts' đọc 'ch-t-x'" },
  { de: "weit", en: "far", vi: "xa", pos: "adverb", pronunciation_vi: "VAIT — 'W' đọc 'V', 'ei' đọc 'ai', 't' đọc rõ" },

  // ── Useful Verbs (5) ──────────────────────────────────────────────────
  { de: "sein", en: "to be", vi: "thì / là / ở", pos: "verb", pronunciation_vi: "DAIN — 's' đọc 'd' như 'zoo', 'ei' đọc 'ai'" },
  { de: "haben", en: "to have", vi: "có", pos: "verb", pronunciation_vi: "HA-bần — 'a' dài, 'en' đọc 'ần'" },
  { de: "essen", en: "to eat", vi: "ăn", pos: "verb", pronunciation_vi: "ÉT-xần — 'e' đọc 'é', 'ssen' đọc 'xần'" },
  { de: "trinken", en: "to drink", vi: "uống", pos: "verb", pronunciation_vi: "TRÍNG-kần — 'i' ngắn, 'nken' đọc 'ng-kần'" },
  { de: "schlafen", en: "to sleep", vi: "ngủ", pos: "verb", pronunciation_vi: "S-LA-phần — 'sch' đọc 's' nặng, 'a' dài, 'en' đọc 'ần'" },
];

export default GERMAN_VOCABULARY;
