// src/languages/french/vocabulary.ts
//
// 50 core French vocabulary items for Vietnamese learners.
// Hand-crafted selection prioritizing practical everyday use —
// greetings, numbers, food, travel, and common verbs Vietnamese
// learners need when starting French.
//
// Each entry: French word, English, Vietnamese gloss, part of speech,
// and a pronunciation hint written for Vietnamese speakers (phonetic
// approximations, common mistake warnings).

export type FrenchVocabEntry = {
  fr: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
};

export const FRENCH_VOCABULARY: ReadonlyArray<FrenchVocabEntry> = [
  // ── Greetings & Politeness (10) ───────────────────────────────────────
  { fr: "bonjour", en: "hello / good morning", vi: "xin chào (ban ngày)", pos: "interjection", pronunciation_vi: "boong-DUA — chữ 'j' đọc như 'd' mềm, 'our' đọc 'ua'" },
  { fr: "bonsoir", en: "good evening", vi: "chào buổi tối", pos: "interjection", pronunciation_vi: "boong-XOA — 'oi' đọc là 'oa'" },
  { fr: "salut", en: "hi / bye (informal)", vi: "chào (thân mật)", pos: "interjection", pronunciation_vi: "xa-LUY — chữ 't' cuối KHÔNG đọc" },
  { fr: "au revoir", en: "goodbye", vi: "tạm biệt", pos: "interjection", pronunciation_vi: "ô rơ-VOA — 'oi' đọc 'oa', chữ 'r' cuối KHÔNG đọc" },
  { fr: "merci", en: "thank you", vi: "cảm ơn", pos: "interjection", pronunciation_vi: "me-XI — 'er' đọc 'e', 'ci' đọc 'xi'" },
  { fr: "s'il vous plaît", en: "please (formal)", vi: "làm ơn (lịch sự)", pos: "phrase", pronunciation_vi: "xin vu PLE — 'ai' đọc 'e' như tiếng Anh 'pleh'" },
  { fr: "pardon", en: "sorry / excuse me", vi: "xin lỗi", pos: "interjection", pronunciation_vi: "pa-ĐOONG — 'on' đọc 'oong' âm mũi, 'd' cuối KHÔNG đọc" },
  { fr: "excusez-moi", en: "excuse me (formal)", vi: "xin thứ lỗi (lịch sự)", pos: "phrase", pronunciation_vi: "ếch-xku-dê MOA — 'ez' đọc 'ê', 'oi' đọc 'oa'" },
  { fr: "de rien", en: "you're welcome", vi: "không có gì", pos: "phrase", pronunciation_vi: "đơ RI-ĂNG — 'ien' đọc 'i-ăng' âm mũi" },
  { fr: "enchanté", en: "nice to meet you", vi: "rất vui được gặp", pos: "adjective", pronunciation_vi: "oong-săng-TÊ — 'en' đọc 'oong' âm mũi, 'é' đọc 'ê'" },

  // ── Numbers 1-10 (10) ─────────────────────────────────────────────────
  { fr: "un", en: "one", vi: "một", pos: "number", pronunciation_vi: "ĂNG — âm mũi, không phải 'an'" },
  { fr: "deux", en: "two", vi: "hai", pos: "number", pronunciation_vi: "ĐƠ — 'eu' đọc 'ơ', 'x' cuối KHÔNG đọc" },
  { fr: "trois", en: "three", vi: "ba", pos: "number", pronunciation_vi: "THOA — 'oi' đọc 'oa', 's' cuối KHÔNG đọc" },
  { fr: "quatre", en: "four", vi: "bốn", pos: "number", pronunciation_vi: "KAT- — 'qu' đọc 'k', 'e' cuối KHÔNG đọc" },
  { fr: "cinq", en: "five", vi: "năm", pos: "number", pronunciation_vi: "XĂNG — 'in' đọc 'ăng' âm mũi giống 'un'" },
  { fr: "six", en: "six", vi: "sáu", pos: "number", pronunciation_vi: "XÍT — giống 'sit' tiếng Anh nhưng ngắn hơn" },
  { fr: "sept", en: "seven", vi: "bảy", pos: "number", pronunciation_vi: "XẸT — 'e' đọc 'ẹ' như tiếng Việt, 'pt' cuối đọc 't'" },
  { fr: "huit", en: "eight", vi: "tám", pos: "number", pronunciation_vi: "U-ÍT — 'h' KHÔNG đọc, 'ui' đọc 'u-i' nhanh" },
  { fr: "neuf", en: "nine", vi: "chín", pos: "number", pronunciation_vi: "NỚPH — 'eu' đọc 'ơ', 'f' cuối đọc nhẹ" },
  { fr: "dix", en: "ten", vi: "mười", pos: "number", pronunciation_vi: "ĐÍT — 'x' đọc 's' nhẹ, gần giống 'đít' nhưng êm hơn" },

  // ── Common Phrases (10) ───────────────────────────────────────────────
  { fr: "comment allez-vous", en: "how are you (formal)", vi: "bạn khỏe không (lịch sự)", pos: "phrase", pronunciation_vi: "co-măng ta-lê VU — 'ent' KHÔNG đọc, 'ez' đọc 'ê'" },
  { fr: "ça va", en: "how's it going / I'm fine", vi: "khỏe / ổn", pos: "phrase", pronunciation_vi: "xa VA — 'ç' đọc 'x', ngắn gọn như 'xà va'" },
  { fr: "je m'appelle", en: "my name is", vi: "tôi tên là", pos: "phrase", pronunciation_vi: "dơ ma-PEN — 'j' đọc 'd' mềm, 'elle' đọc 'en'" },
  { fr: "je ne comprends pas", en: "I don't understand", vi: "tôi không hiểu", pos: "phrase", pronunciation_vi: "dơ nơ coong-PRĂNG pa — 'en' đọc 'oong' âm mũi, 's' cuối KHÔNG đọc" },
  { fr: "parlez-vous anglais", en: "do you speak English", vi: "bạn có nói tiếng Anh không", pos: "phrase", pronunciation_vi: "pa-lê vu oong-GLE — 'an' đọc 'oong' âm mũi" },
  { fr: "je voudrais", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "phrase", pronunciation_vi: "dơ vu-ĐRE — 'ou' đọc 'u', 'ai' đọc 'e', 's' cuối KHÔNG đọc" },
  { fr: "combien ça coûte", en: "how much does it cost", vi: "cái này giá bao nhiêu", pos: "phrase", pronunciation_vi: "coong-bi-ĂNG xa CÚT — 'ien' đọc 'i-ăng' âm mũi" },
  { fr: "où sont les toilettes", en: "where is the bathroom", vi: "nhà vệ sinh ở đâu", pos: "phrase", pronunciation_vi: "u XOONG lê toa-LÉT — 'où' đọc 'u', 'sont' đọc 'xoong'" },
  { fr: "l'addition s'il vous plaît", en: "the check please", vi: "cho xin hóa đơn", pos: "phrase", pronunciation_vi: "la-đi-xi-ÔNG xin vu PLE — 'tion' đọc 'xi-ông'" },
  { fr: "bonne journée", en: "have a good day", vi: "chúc một ngày tốt lành", pos: "phrase", pronunciation_vi: "bonn dua-NÊ — 'j' đọc 'd' mềm, 'ée' đọc 'ê'" },

  // ── Food & Dining (10) ────────────────────────────────────────────────
  { fr: "pain", en: "bread", vi: "bánh mì", pos: "noun (m)", pronunciation_vi: "PANG — âm mũi, giống 'păng' nhưng mũi, 'n' cuối KHÔNG đọc rõ" },
  { fr: "fromage", en: "cheese", vi: "phô mai", pos: "noun (m)", pronunciation_vi: "phro-MA-D — 'fr' đọc 'phr', 'ge' đọc 'd' mềm như 'dờ'" },
  { fr: "beurre", en: "butter", vi: "bơ", pos: "noun (m)", pronunciation_vi: "BƠR — 'eu' đọc 'ơ', 'rr' đọc nhẹ, kéo dài âm 'r'" },
  { fr: "œuf", en: "egg", vi: "trứng", pos: "noun (m)", pronunciation_vi: "ỚPH — 'œu' đọc 'ơ', 'f' cuối đọc nhẹ. Số nhiều 'œufs' đọc 'Ớ' (bỏ f)" },
  { fr: "poulet", en: "chicken", vi: "thịt gà", pos: "noun (m)", pronunciation_vi: "pu-LE — 'ou' đọc 'u', 'et' đọc 'e', 't' cuối KHÔNG đọc" },
  { fr: "légumes", en: "vegetables", vi: "rau củ", pos: "noun (m pl)", pronunciation_vi: "lê-GUYM — 'é' đọc 'ê', 's' cuối KHÔNG đọc" },
  { fr: "eau", en: "water", vi: "nước", pos: "noun (f)", pronunciation_vi: "Ô — 'eau' đọc 'ô', giống chữ 'ô' tiếng Việt" },
  { fr: "vin", en: "wine", vi: "rượu vang", pos: "noun (m)", pronunciation_vi: "VANG — 'in' đọc 'ang' âm mũi" },
  { fr: "sucre", en: "sugar", vi: "đường", pos: "noun (m)", pronunciation_vi: "XUYC-rờ — 'u' đọc 'uy' như 'thuý' nhưng nhẹ" },
  { fr: "sel", en: "salt", vi: "muối", pos: "noun (m)", pronunciation_vi: "XEN — 'e' đọc 'e', 'l' cuối đọc nhẹ" },

  // ── Travel & Directions (5) ───────────────────────────────────────────
  { fr: "gare", en: "train station", vi: "ga tàu", pos: "noun (f)", pronunciation_vi: "GA — 'g' cứng, 'e' cuối KHÔNG đọc" },
  { fr: "rue", en: "street", vi: "đường phố", pos: "noun (f)", pronunciation_vi: "RUY — 'u' đọc 'uy' nhẹ, gần giống 'ruy'" },
  { fr: "à gauche", en: "to the left", vi: "bên trái", pos: "phrase", pronunciation_vi: "a GÔ-S — 'au' đọc 'ô', 'che' đọc 's' nhẹ" },
  { fr: "à droite", en: "to the right", vi: "bên phải", pos: "phrase", pronunciation_vi: "a ĐOÁT — 'oi' đọc 'oa', 'te' cuối đọc nhẹ" },
  { fr: "loin", en: "far", vi: "xa", pos: "adverb", pronunciation_vi: "LOANG — 'oi' đọc 'oa' âm mũi, 'n' tạo âm mũi" },

  // ── Useful Verbs (5) ──────────────────────────────────────────────────
  { fr: "être", en: "to be", vi: "thì / là / ở", pos: "verb", pronunciation_vi: "ÉT-rờ — 'ê' đọc 'ê' dài, 're' cuối đọc nhẹ" },
  { fr: "avoir", en: "to have", vi: "có", pos: "verb", pronunciation_vi: "a-VOA — 'oi' đọc 'oa', 'r' cuối đọc nhẹ" },
  { fr: "manger", en: "to eat", vi: "ăn", pos: "verb", pronunciation_vi: "moong-GIÊ — 'an' đọc 'oong' âm mũi, 'er' đọc 'ê'" },
  { fr: "boire", en: "to drink", vi: "uống", pos: "verb", pronunciation_vi: "BOA-rờ — 'oi' đọc 'oa', 're' cuối đọc nhẹ" },
  { fr: "dormir", en: "to sleep", vi: "ngủ", pos: "verb", pronunciation_vi: "đoa-MIA — 'or' đọc 'oa', 'ir' đọc 'ia', 'r' cuối đọc nhẹ" },
];

export default FRENCH_VOCABULARY;
