// src/languages/korean/vocabulary.ts
//
// 50-word Korean starter vocabulary for Vietnamese learners.
// Hand-crafted — each word chosen from beginner textbook frequency
// lists (Sejong, Yonsei, Sogang) and practical daily contexts.
// Hangul + romanization + Vietnamese gloss + pronunciation tips.
//
// Shape: { hangul, romanized, en, vi, pos, pronunciation_hint? }

export type KoreanWord = {
  hangul: string;
  romanized: string;
  en: string;
  vi: string;
  pos: "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "phrase";
  pronunciation_hint?: string;
};

const KOREAN_VOCABULARY: KoreanWord[] = [
  // === Pronouns ===
  {
    hangul: "저",
    romanized: "jeo",
    en: "I / me (humble)",
    vi: "tôi (khiêm nhường)",
    pos: "pronoun",
    pronunciation_hint: "jơ — âm 'j' gần 'ch' nhẹ, không phải 'gi' tiếng Việt",
  },
  {
    hangul: "나",
    romanized: "na",
    en: "I / me (casual)",
    vi: "tôi / tao (thân mật)",
    pos: "pronoun",
    pronunciation_hint: "na — giống 'na' tiếng Việt. Chỉ dùng với bạn thân hoặc người nhỏ tuổi hơn.",
  },
  {
    hangul: "너",
    romanized: "neo",
    en: "you (casual)",
    vi: "mày (thân mật)",
    pos: "pronoun",
    pronunciation_hint: "nơ — âm 'eo' là một nguyên âm, đọc nhanh như 'nơ'.",
  },
  {
    hangul: "우리",
    romanized: "uri",
    en: "we / our",
    vi: "chúng tôi / của chúng tôi",
    pos: "pronoun",
    pronunciation_hint: "u-ri. Người Hàn nói 'uri nara' (nước của chúng tôi), 'uri eomma' (mẹ của chúng tôi).",
  },

  // === Greetings & basics ===
  {
    hangul: "안녕하세요",
    romanized: "annyeonghaseyo",
    en: "Hello (polite)",
    vi: "Xin chào (lịch sự)",
    pos: "phrase",
    pronunciation_hint: "an-nyơng-ha-sê-yô. 'nyơng' không phải 'nhương' — lưỡi chạm vòm.",
  },
  {
    hangul: "감사합니다",
    romanized: "gamsahamnida",
    en: "Thank you (formal)",
    vi: "Cảm ơn (trang trọng)",
    pos: "phrase",
    pronunciation_hint: "gam-sa-ham-ni-đa. 'hamnida' đọc thành 'hamnida', không phải 'ham-ni-đa' rời.",
  },
  {
    hangul: "고맙습니다",
    romanized: "gomapseumnida",
    en: "Thank you (polite)",
    vi: "Cảm ơn (lịch sự)",
    pos: "phrase",
    pronunciation_hint: "go-map-sưm-ni-đa. Nhẹ hơn gamsahamnida.",
  },
  {
    hangul: "죄송합니다",
    romanized: "joesonghamnida",
    en: "I'm sorry (formal)",
    vi: "Xin lỗi (trang trọng)",
    pos: "phrase",
    pronunciation_hint: "joe-song-ham-ni-đa. 'oe' đọc như 'uê' nhẹ.",
  },
  {
    hangul: "네",
    romanized: "ne",
    en: "Yes",
    vi: "Vâng / Dạ",
    pos: "adverb",
    pronunciation_hint: "nê. Trong hội thoại, 'ne' thường nghe như 'đê' vì mũi hóa.",
  },
  {
    hangul: "이름",
    romanized: "ireum",
    en: "name",
    vi: "tên",
    pos: "noun",
    pronunciation_hint: "i-rưm. 'r' là âm rung nhẹ — gần 'r' tiếng Việt nhưng nhẹ hơn.",
  },

  // === Verbs ===
  {
    hangul: "먹다",
    romanized: "meokda",
    en: "to eat",
    vi: "ăn",
    pos: "verb",
    pronunciation_hint: "mơk-đa. 'eo' = âm 'ơ' + môi hơi tròn. 'k' cuối = tắc, không bật.",
  },
  {
    hangul: "마시다",
    romanized: "masida",
    en: "to drink",
    vi: "uống",
    pos: "verb",
  },
  {
    hangul: "가다",
    romanized: "gada",
    en: "to go",
    vi: "đi",
    pos: "verb",
    pronunciation_hint: "ga-đa. 'g' không bật hơi, gần 'c' tiếng Việt hơn 'g'.",
  },
  {
    hangul: "오다",
    romanized: "oda",
    en: "to come",
    vi: "đến",
    pos: "verb",
  },
  {
    hangul: "하다",
    romanized: "hada",
    en: "to do",
    vi: "làm",
    pos: "verb",
    pronunciation_hint: "ha-đa. Động từ phổ biến NHẤT tiếng Hàn. Kết hợp với danh từ tạo động từ mới.",
  },
  {
    hangul: "보다",
    romanized: "boda",
    en: "to see / to watch",
    vi: "nhìn / xem",
    pos: "verb",
    pronunciation_hint: "bo-đa. 'b' không bật hơi, gần 'p' tiếng Việt hơn.",
  },
  {
    hangul: "듣다",
    romanized: "deutda",
    en: "to listen",
    vi: "nghe",
    pos: "verb",
    pronunciation_hint: "dưt-đa. Bất quy tắc: khi chia, ㄷ → ㄹ (deutda → deureoyo).",
  },
  {
    hangul: "말하다",
    romanized: "malhada",
    en: "to speak / to talk",
    vi: "nói",
    pos: "verb",
    pronunciation_hint: "mal-ha-đa. 말 (mal) = lời nói + 하다 = làm. 'Nói' dịch sát là 'làm lời nói'.",
  },
  {
    hangul: "읽다",
    romanized: "ikda",
    en: "to read",
    vi: "đọc",
    pos: "verb",
    pronunciation_hint: "ik-đa. ㄺ đọc là 'k' (không phải 'lg'). Bất quy tắc khi chia.",
  },
  {
    hangul: "쓰다",
    romanized: "sseuda",
    en: "to write / to use",
    vi: "viết / dùng",
    pos: "verb",
    pronunciation_hint: "sư-đa. 'eu' = âm 'ư' tiếng Việt.",
  },
  {
    hangul: "사다",
    romanized: "sada",
    en: "to buy",
    vi: "mua",
    pos: "verb",
  },

  // === Food & drink ===
  {
    hangul: "물",
    romanized: "mul",
    en: "water",
    vi: "nước",
    pos: "noun",
  },
  {
    hangul: "밥",
    romanized: "bap",
    en: "rice / meal / food",
    vi: "cơm / bữa ăn",
    pos: "noun",
    pronunciation_hint: "bap. 'p' cuối tắc nhẹ, môi khép. '밥 먹었어요?' = ăn cơm chưa (câu chào).",
  },
  {
    hangul: "차",
    romanized: "cha",
    en: "tea",
    vi: "trà",
    pos: "noun",
    pronunciation_hint: "cha — 'ch' bật hơi. Giống 'tra' tiếng Việt nhưng bật hơi mạnh đầu.",
  },
  {
    hangul: "고기",
    romanized: "gogi",
    en: "meat",
    vi: "thịt",
    pos: "noun",
  },
  {
    hangul: "생선",
    romanized: "saengseon",
    en: "fish (as food)",
    vi: "cá (thức ăn)",
    pos: "noun",
    pronunciation_hint: "seng-sơn. 'ae' đọc như 'e' mở (gần 'e' tiếng Việt nhưng mở hơn).",
  },
  {
    hangul: "라면",
    romanized: "ramyeon",
    en: "instant noodles / ramen",
    vi: "mì gói",
    pos: "noun",
    pronunciation_hint: "ra-myơn. 'r' đầu từ đọc gần 'l' — lưỡi chạm vòm rồi bật ra.",
  },

  // === Numbers (Sino-Korean) ===
  {
    hangul: "일",
    romanized: "il",
    en: "one (Sino-Korean)",
    vi: "một",
    pos: "noun",
    pronunciation_hint: "il. Hàn có 2 hệ số: Sino (일이삼) và Native (하나둘셋).",
  },
  {
    hangul: "이",
    romanized: "i",
    en: "two (Sino-Korean)",
    vi: "hai",
    pos: "noun",
  },
  {
    hangul: "삼",
    romanized: "sam",
    en: "three (Sino-Korean)",
    vi: "ba",
    pos: "noun",
  },
  {
    hangul: "사",
    romanized: "sa",
    en: "four (Sino-Korean)",
    vi: "bốn",
    pos: "noun",
    pronunciation_hint: "sa. Chú ý: 사 (4) và 싸 (rẻ) khác nhau bởi âm căng (tense).",
  },
  {
    hangul: "오",
    romanized: "o",
    en: "five (Sino-Korean)",
    vi: "năm",
    pos: "noun",
  },
  {
    hangul: "육",
    romanized: "yuk",
    en: "six (Sino-Korean)",
    vi: "sáu",
    pos: "noun",
  },
  {
    hangul: "칠",
    romanized: "chil",
    en: "seven (Sino-Korean)",
    vi: "bảy",
    pos: "noun",
    pronunciation_hint: "chil. 'ch' bật hơi mạnh.",
  },
  {
    hangul: "팔",
    romanized: "pal",
    en: "eight (Sino-Korean)",
    vi: "tám",
    pos: "noun",
    pronunciation_hint: "pal. 'p' bật hơi mạnh, khác 'b' không bật hơi trong 밥.",
  },
  {
    hangul: "구",
    romanized: "gu",
    en: "nine (Sino-Korean)",
    vi: "chín",
    pos: "noun",
  },
  {
    hangul: "십",
    romanized: "sip",
    en: "ten (Sino-Korean)",
    vi: "mười",
    pos: "noun",
    pronunciation_hint: "sip. 's' nhẹ hơn 'x' tiếng Việt — hơi giống 'sh' nhẹ.",
  },

  // === Places ===
  {
    hangul: "학교",
    romanized: "hakgyo",
    en: "school",
    vi: "trường học",
    pos: "noun",
    pronunciation_hint: "hak-gyo — 'g' trong 'gyo' đọc như 'k' không bật hơi + 'y'.",
  },
  {
    hangul: "집",
    romanized: "jip",
    en: "house / home",
    vi: "nhà",
    pos: "noun",
    pronunciation_hint: "jip. 'j' gần 'ch' không bật hơi. Phân biệt với 칩 (chip) = con chip.",
  },
  {
    hangul: "병원",
    romanized: "byeongwon",
    en: "hospital",
    vi: "bệnh viện",
    pos: "noun",
    pronunciation_hint: "byơng-wơn. 'byeong' = 'b' + 'yơng', môi căng. Không phải 'bi-ông'.",
  },
  {
    hangul: "가게",
    romanized: "gage",
    en: "shop / store",
    vi: "cửa hàng",
    pos: "noun",
  },

  // === Adjectives ===
  {
    hangul: "좋다",
    romanized: "jota",
    en: "to be good",
    vi: "tốt / thích",
    pos: "adjective",
    pronunciation_hint: "jo-tha. 'j' gần 'ch' nhẹ. 좋아요 (joayo) = tốt / em thích.",
  },
  {
    hangul: "나쁘다",
    romanized: "nappeuda",
    en: "to be bad",
    vi: "xấu / tệ",
    pos: "adjective",
    pronunciation_hint: "nap-pư-đa. Phụ âm đôi 'pp' căng hơn 'p' đơn.",
  },
  {
    hangul: "크다",
    romanized: "keuda",
    en: "to be big",
    vi: "to / lớn",
    pos: "adjective",
    pronunciation_hint: "khư-đa. 'k' bật hơi mạnh.",
  },
  {
    hangul: "작다",
    romanized: "jakda",
    en: "to be small",
    vi: "nhỏ",
    pos: "adjective",
    pronunciation_hint: "jak-đa. 'j' không bật hơi, khác 'ch' bật hơi trong 착하다 (chakhada — tốt bụng).",
  },
  {
    hangul: "맛있다",
    romanized: "masitda",
    en: "to be delicious",
    vi: "ngon",
    pos: "adjective",
    pronunciation_hint: "ma-sit-đa. 맛 (mat) = vị + 있다 (itda) = có → 'có vị' = ngon.",
  },
  {
    hangul: "비싸다",
    romanized: "bissada",
    en: "to be expensive",
    vi: "đắt",
    pos: "adjective",
    pronunciation_hint: "bi-xa-đa. Phụ âm đôi 'ss' căng.",
  },

  // === Daily life ===
  {
    hangul: "오늘",
    romanized: "oneul",
    en: "today",
    vi: "hôm nay",
    pos: "noun",
    pronunciation_hint: "o-nưl. 'eu' = âm 'ư'.",
  },
  {
    hangul: "내일",
    romanized: "naeil",
    en: "tomorrow",
    vi: "ngày mai",
    pos: "noun",
    pronunciation_hint: "ne-il. 'ae' = âm 'e' mở.",
  },
  {
    hangul: "지금",
    romanized: "jigeum",
    en: "now",
    vi: "bây giờ",
    pos: "adverb",
    pronunciation_hint: "ji-gưm. Phân biệt với 집 (jip — nhà) — khác phụ âm cuối.",
  },
];

export default KOREAN_VOCABULARY;
