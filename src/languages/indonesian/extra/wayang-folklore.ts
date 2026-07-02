// src/languages/indonesian/extra/wayang-folklore.ts
//
// Indonesian wayang & folklore pack for Vietnamese learners.
// Covers: the shadow-puppet art (wayang kulit, dalang, gamelan, layar), the
// epics and characters (Ramayana, Mahabharata, Punakawan, cerita rakyat), and
// the meaning/values and heritage status of wayang (filosofi, pesan moral,
// warisan budaya, UNESCO). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the per-file shapes diverge slightly between authoring waves —
// this file is self-contained on purpose. Types are NOT exported and the lesson
// array uses a unique name so a future barrel `export *` cannot collide with the
// sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const wayangFolkloreLessons: IndonesianLesson[] = [
  {
    id: "indonesian_wayang_what_is",
    level: "A1",
    category: "culture",
    title_vi: "Múa rối bóng wayang là gì",
    title_en: "What is wayang shadow puppetry",
    sentences: [
      {
        en: "Wayang kulit adalah pertunjukan boneka bayangan.",
        vi: "Wayang kulit là loại hình biểu diễn rối bóng.",
        pronunciation_focus: [
          "wayang kulit → WA-yang KU-lit, 'rối da' (rối bóng làm bằng da)",
          "pertunjukan → 'buổi biểu diễn' (gốc tunjuk + per-…-an)",
          "boneka bayangan → 'con rối bóng' (boneka = con rối, bayangan = bóng)",
        ],
        pronunciation_focus_en: [
          "wayang kulit → 'WA-yang KOO-lit' — 'leather puppet' (shadow puppets of leather)",
          "pertunjukan → 'a performance' (root 'tunjuk' + 'per-…-an')",
          "boneka bayangan → 'shadow puppet' (boneka = puppet, bayangan = shadow)",
        ],
      },
      {
        en: "Dalang memainkan semua tokoh sendirian.",
        vi: "Người điều khiển rối (dalang) tự mình diễn tất cả nhân vật.",
        pronunciation_focus: [
          "dalang → DA-lang, 'nghệ nhân điều khiển rối kiêm kể chuyện'",
          "memainkan → meu-ma-IN-kan, 'điều khiển/diễn (vai)' (gốc main + meN-…-kan)",
          "sendirian → 'một mình' (gốc sendiri = riêng + -an)",
        ],
        pronunciation_focus_en: [
          "dalang → 'DA-lang' — the puppeteer-narrator",
          "memainkan → 'me-ma-IN-kan' — to play/operate (a role) (root 'main' + 'meN-…-kan')",
          "sendirian → 'alone/by oneself' (root 'sendiri' = self + '-an')",
        ],
      },
      {
        en: "Bayangan boneka muncul di layar putih.",
        vi: "Bóng của con rối hiện lên trên màn vải trắng.",
        pronunciation_focus: [
          "bayangan → ba-YA-ngan, 'cái bóng'",
          "muncul → MUN-chul, 'hiện ra/xuất hiện'",
          "layar → LA-yar, 'màn (chiếu)'; putih = trắng",
        ],
        pronunciation_focus_en: [
          "bayangan → 'ba-YA-ngan' — the shadow",
          "muncul → 'MOON-chool' — to appear",
          "layar → 'LA-yar' — screen; putih = white",
        ],
      },
      {
        en: "Musik gamelan mengiringi pertunjukan.",
        vi: "Nhạc gamelan đệm cho buổi biểu diễn.",
        pronunciation_focus: [
          "gamelan → GA-meu-lan, dàn nhạc gõ truyền thống của Java/Bali",
          "mengiringi → 'đệm/hộ tống' (gốc iring + meN-…-i)",
          "musik → MU-sik, 'âm nhạc'",
        ],
        pronunciation_focus_en: [
          "gamelan → 'GA-me-lan' — the traditional Javanese/Balinese percussion ensemble",
          "mengiringi → 'to accompany' (root 'iring' + 'meN-…-i')",
          "musik → 'MOO-seek' — music",
        ],
      },
      {
        en: "Pertunjukan wayang bisa berlangsung sepanjang malam.",
        vi: "Buổi diễn wayang có thể kéo dài suốt đêm.",
        pronunciation_focus: [
          "berlangsung → ber-LANG-sung, 'diễn ra/kéo dài'",
          "sepanjang malam → 'suốt đêm' (sepanjang = suốt, malam = đêm)",
          "bisa → BI-sa, 'có thể'",
        ],
        pronunciation_focus_en: [
          "berlangsung → 'ber-LANG-soong' — to take place/last",
          "sepanjang malam → 'all night long' (sepanjang = throughout, malam = night)",
          "bisa → 'BEE-sa' — can/be able to",
        ],
      },
    ],
    cultural_notes_vi:
      "'Wayang kulit' (rối bóng bằng da) là loại hình sân khấu cổ truyền nổi tiếng nhất của Java và Bali. Một nghệ nhân duy nhất — 'dalang' — vừa điều khiển hàng chục con rối, vừa lồng giọng cho mọi nhân vật, vừa chỉ huy dàn nhạc 'gamelan'. Khán giả có thể ngồi xem bóng rối in trên 'layar' (màn vải trắng) hoặc xem phía sau thấy con rối thật. Một suất diễn truyền thống ('berlangsung') kéo dài 'sepanjang malam' — từ tối đến rạng sáng. Đây vừa là giải trí, vừa là nghi lễ.",
    cultural_notes_en:
      "'Wayang kulit' (leather shadow puppets) is the most famous traditional theater of Java and Bali. A single artist — the 'dalang' — simultaneously manipulates dozens of puppets, voices every character, and leads the 'gamelan' orchestra. The audience can watch the puppets' shadows cast on the 'layar' (white cloth screen) or sit behind to see the actual puppets. A traditional show 'lasts' ('berlangsung') 'all night long' — from dusk to dawn. It is at once entertainment and ritual.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'wayang' = rối; 'wayang kulit' = rối da/rối bóng (kulit = da). Để ý tiền tố động từ: main→memainkan (điều khiển/diễn), iring→mengiringi (đệm), langsung→berlangsung (diễn ra). 'se- + danh từ + lặp/từ' chỉ 'suốt': sepanjang malam (suốt đêm), sepanjang hari (suốt ngày). 'sendirian' = một mình (khác 'sendiri' = tự/riêng). Hãy liên hệ với múa rối nước Việt Nam để nhớ khái niệm.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'wayang' = puppet; 'wayang kulit' = leather/shadow puppet (kulit = leather/skin). Note the verb prefixes: main→memainkan (operate/play), iring→mengiringi (accompany), langsung→berlangsung (take place). 'sepanjang + noun' means 'throughout': sepanjang malam (all night), sepanjang hari (all day). 'sendirian' = alone (vs 'sendiri' = self/own). Relate it to Vietnamese water-puppetry to anchor the concept.",
    vocabulary: [
      {
        word: "wayang kulit",
        en: "leather shadow puppetry",
        vi: "rối bóng (bằng da)",
        pos: "noun",
        pronunciation_vi: "WA-yang KU-lit",
        pronunciation_en: "WA-yang KOO-lit",
      },
      {
        word: "dalang",
        en: "puppeteer-narrator",
        vi: "nghệ nhân điều khiển rối",
        pos: "noun",
        pronunciation_vi: "DA-lang",
        pronunciation_en: "DA-lang",
      },
      {
        word: "gamelan",
        en: "traditional percussion orchestra",
        vi: "dàn nhạc gõ truyền thống",
        pos: "noun",
        pronunciation_vi: "GA-meu-lan",
        pronunciation_en: "GA-me-lan",
      },
      {
        word: "layar",
        en: "screen",
        vi: "màn (chiếu)",
        pos: "noun",
        pronunciation_vi: "LA-yar",
        pronunciation_en: "LA-yar",
      },
      {
        word: "bayangan",
        en: "shadow",
        vi: "bóng",
        pos: "noun",
        pronunciation_vi: "ba-YA-ngan",
        pronunciation_en: "ba-YA-ngan",
      },
      {
        word: "pertunjukan",
        en: "performance / show",
        vi: "buổi biểu diễn",
        pos: "noun",
        pronunciation_vi: "per-tun-JU-kan",
        pronunciation_en: "per-toon-JOO-kan",
      },
      {
        word: "boneka",
        en: "puppet / doll",
        vi: "con rối / búp bê",
        pos: "noun",
        pronunciation_vi: "bô-NÉ-ka",
        pronunciation_en: "boh-NEH-ka",
      },
    ],
    dialogue: [
      {
        speaker: "Turis",
        text: "Apa itu wayang kulit?",
        vi: "Wayang kulit là gì vậy?",
        en: "What is wayang kulit?",
      },
      {
        speaker: "Pemandu",
        text: "Itu pertunjukan boneka bayangan. Dalang memainkan semua tokoh.",
        vi: "Đó là biểu diễn rối bóng. Dalang diễn tất cả nhân vật.",
        en: "It's a shadow-puppet performance. The dalang plays all the characters.",
      },
      {
        speaker: "Turis",
        text: "Musiknya apa yang mengiringi?",
        vi: "Nhạc gì đệm theo vậy?",
        en: "What music accompanies it?",
      },
      {
        speaker: "Pemandu",
        text: "Musik gamelan. Pertunjukannya bisa berlangsung sepanjang malam, lho.",
        vi: "Nhạc gamelan. Buổi diễn có thể kéo dài suốt đêm đó.",
        en: "Gamelan music. The show can go on all night, you know.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về wayang còn thiếu:",
        instruction_en: "Fill in the missing wayang word:",
        items: [
          {
            prompt: "___ memainkan semua tokoh sendirian. (người điều khiển rối)",
            answer: "Dalang",
            options: ["Dalang", "Dapur", "Dahan"],
          },
          {
            prompt: "Bayangan boneka muncul di ___ putih. (màn chiếu)",
            answer: "layar",
            options: ["layar", "lampu", "lantai"],
          },
          {
            prompt: "Musik ___ mengiringi pertunjukan. (dàn nhạc gõ)",
            answer: "gamelan",
            options: ["gamelan", "gajah", "gula"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "dalang", answer: "nghệ nhân điều khiển rối" },
          { prompt: "gamelan", answer: "dàn nhạc gõ truyền thống" },
          { prompt: "bayangan", answer: "bóng" },
          { prompt: "boneka", answer: "con rối" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Wayang kulit là loại hình biểu diễn rối bóng.", answer: "Wayang kulit adalah pertunjukan boneka bayangan." },
          { prompt: "Nhạc gamelan đệm cho buổi biểu diễn.", answer: "Musik gamelan mengiringi pertunjukan." },
          { prompt: "Buổi diễn wayang có thể kéo dài suốt đêm.", answer: "Pertunjukan wayang bisa berlangsung sepanjang malam." },
        ],
      },
    ],
  },
  {
    id: "indonesian_wayang_epics_characters",
    level: "A2",
    category: "culture",
    title_vi: "Sử thi và nhân vật — Ramayana, Mahabharata, Punakawan",
    title_en: "Epics & characters — Ramayana, Mahabharata, Punakawan",
    sentences: [
      {
        en: "Banyak cerita wayang berasal dari Ramayana dan Mahabharata.",
        vi: "Nhiều câu chuyện wayang bắt nguồn từ sử thi Ramayana và Mahabharata.",
        pronunciation_focus: [
          "cerita → cheu-RI-ta, 'câu chuyện'",
          "berasal dari → 'bắt nguồn/xuất thân từ' (gốc asal = nguồn gốc + ber-)",
          "Ramayana, Mahabharata → hai sử thi Ấn Độ, được Java hóa",
        ],
        pronunciation_focus_en: [
          "cerita → 'che-REE-ta' — story",
          "berasal dari → 'to originate from' (root 'asal' = origin + 'ber-')",
          "Ramayana, Mahabharata → two Indian epics, adapted in Java",
        ],
      },
      {
        en: "Tokoh utamanya sering seorang ksatria yang gagah berani.",
        vi: "Nhân vật chính thường là một hiệp sĩ dũng cảm.",
        pronunciation_focus: [
          "tokoh utama → 'nhân vật chính' (tokoh = nhân vật, utama = chính)",
          "seorang → 'một (người)' (lượng từ chỉ người: se- + orang)",
          "ksatria → ksa-TRI-a, 'hiệp sĩ/chiến binh quý tộc'; gagah berani = dũng mãnh can đảm",
        ],
        pronunciation_focus_en: [
          "tokoh utama → 'main character' (tokoh = character, utama = main)",
          "seorang → 'a (person)' (person classifier: se- + orang)",
          "ksatria → 'ksa-TREE-a' — knight/noble warrior; gagah berani = brave and valiant",
        ],
      },
      {
        en: "Punakawan adalah tokoh pelawak yang bijaksana.",
        vi: "Punakawan là các nhân vật hề nhưng đầy minh triết.",
        pronunciation_focus: [
          "Punakawan → pu-na-KA-wan, nhóm bốn nhân vật hề-hầu (Semar, Gareng, Petruk, Bagong)",
          "pelawak → peu-LA-wak, 'người gây cười/diễn viên hài'",
          "bijaksana → bi-jak-SA-na, 'khôn ngoan/minh triết'",
        ],
        pronunciation_focus_en: [
          "Punakawan → 'poo-na-KA-wan' — the four clown-servant figures (Semar, Gareng, Petruk, Bagong)",
          "pelawak → 'pe-LA-wak' — comedian/jester",
          "bijaksana → 'bee-jak-SA-na' — wise",
        ],
      },
      {
        en: "Cerita rakyat juga sering dimainkan dalam wayang.",
        vi: "Truyện dân gian cũng thường được diễn trong wayang.",
        pronunciation_focus: [
          "cerita rakyat → 'truyện dân gian' (rakyat = nhân dân)",
          "dimainkan → 'được diễn/trình diễn' (di- + main + -kan, dạng bị động)",
          "dalam → DA-lam, 'trong'",
        ],
        pronunciation_focus_en: [
          "cerita rakyat → 'folk tale' (rakyat = the people)",
          "dimainkan → 'be performed' (di- + main + -kan, passive)",
          "dalam → 'DA-lam' — in/within",
        ],
      },
      {
        en: "Setiap tokoh punya watak yang berbeda.",
        vi: "Mỗi nhân vật có tính cách khác nhau.",
        pronunciation_focus: [
          "setiap → seu-TI-ap, 'mỗi'",
          "watak → WA-tak, 'tính cách/tính nết'",
          "berbeda → ber-BÉ-da, 'khác nhau'",
        ],
        pronunciation_focus_en: [
          "setiap → 'se-TEE-ap' — each/every",
          "watak → 'WA-tak' — character/temperament",
          "berbeda → 'ber-BEH-da' — different",
        ],
      },
    ],
    cultural_notes_vi:
      "Phần lớn cốt truyện wayang lấy từ hai sử thi Ấn Độ — 'Ramayana' và 'Mahabharata' — nhưng đã được Java hóa qua nhiều thế kỷ. Nhân vật chính thường là 'ksatria' (hiệp sĩ quý tộc) như Arjuna, Rama. Đặc sắc riêng của Indonesia là nhóm 'Punakawan' (Semar, Gareng, Petruk, Bagong) — những nhân vật hề-hầu vừa chọc cười vừa nói lời 'bijaksana' (minh triết), thường lồng phê phán xã hội đương thời. Ngoài sử thi, 'cerita rakyat' (truyện dân gian) cũng được đưa lên sân khấu rối.",
    cultural_notes_en:
      "Most wayang plots come from two Indian epics — the 'Ramayana' and 'Mahabharata' — but heavily Javanized over centuries. The lead is usually a 'ksatria' (noble knight) like Arjuna or Rama. A uniquely Indonesian feature is the 'Punakawan' (Semar, Gareng, Petruk, Bagong) — clown-servant figures who both crack jokes and speak 'bijaksana' (wise) truths, often slipping in social commentary on the present day. Beyond the epics, 'cerita rakyat' (folk tales) are also staged.",
    tip_advice_vi:
      "Mẹo cho người Việt: lượng từ chỉ người là 'seorang' (một người) — 'seorang ksatria' = một hiệp sĩ; với vật khác dùng 'sebuah'. 'berasal dari' = bắt nguồn từ (mẫu câu kể nguồn gốc hữu ích). Dạng bị động 'di-…-kan': dimainkan = được diễn, diceritakan = được kể. 'setiap + danh từ' = mỗi. Học cụm 'tokoh utama' (nhân vật chính) và 'watak' (tính cách) để bàn về truyện.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the person classifier is 'seorang' (one person) — 'seorang ksatria' = a knight; for objects use 'sebuah'. 'berasal dari' = to originate from (a handy origin-telling frame). Passive 'di-…-kan': dimainkan = be performed, diceritakan = be told. 'setiap + noun' = each/every. Learn the phrases 'tokoh utama' (main character) and 'watak' (character/temperament) for discussing stories.",
    vocabulary: [
      {
        word: "cerita",
        en: "story",
        vi: "câu chuyện",
        pos: "noun",
        pronunciation_vi: "cheu-RI-ta",
        pronunciation_en: "che-REE-ta",
      },
      {
        word: "tokoh",
        en: "character / figure",
        vi: "nhân vật",
        pos: "noun",
        pronunciation_vi: "TÔ-koh",
        pronunciation_en: "TOH-koh",
      },
      {
        word: "ksatria",
        en: "knight / noble warrior",
        vi: "hiệp sĩ",
        pos: "noun",
        pronunciation_vi: "ksa-TRI-a",
        pronunciation_en: "ksa-TREE-a",
      },
      {
        word: "Punakawan",
        en: "the four clown-servant figures",
        vi: "nhóm nhân vật hề-hầu",
        pos: "noun (proper)",
        pronunciation_vi: "pu-na-KA-wan",
        pronunciation_en: "poo-na-KA-wan",
      },
      {
        word: "cerita rakyat",
        en: "folk tale",
        vi: "truyện dân gian",
        pos: "noun phrase",
        pronunciation_vi: "cheu-RI-ta RAK-yat",
        pronunciation_en: "che-REE-ta RAK-yat",
      },
      {
        word: "bijaksana",
        en: "wise",
        vi: "khôn ngoan / minh triết",
        pos: "adjective",
        pronunciation_vi: "bi-jak-SA-na",
        pronunciation_en: "bee-jak-SA-na",
      },
      {
        word: "watak",
        en: "character / temperament",
        vi: "tính cách",
        pos: "noun",
        pronunciation_vi: "WA-tak",
        pronunciation_en: "WA-tak",
      },
    ],
    dialogue: [
      {
        speaker: "Murid",
        text: "Cerita wayang itu dari mana asalnya, Bu?",
        vi: "Truyện wayang bắt nguồn từ đâu vậy cô?",
        en: "Where do wayang stories come from, ma'am?",
      },
      {
        speaker: "Guru",
        text: "Banyak yang berasal dari Ramayana dan Mahabharata.",
        vi: "Nhiều truyện bắt nguồn từ Ramayana và Mahabharata.",
        en: "Many originate from the Ramayana and Mahabharata.",
      },
      {
        speaker: "Murid",
        text: "Siapa Punakawan itu?",
        vi: "Punakawan là ai vậy?",
        en: "Who are the Punakawan?",
      },
      {
        speaker: "Guru",
        text: "Mereka tokoh pelawak yang bijaksana. Setiap tokoh punya watak berbeda.",
        vi: "Họ là các nhân vật hề nhưng minh triết. Mỗi nhân vật có tính cách khác nhau.",
        en: "They're wise clown figures. Each character has a different temperament.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về sử thi/nhân vật còn thiếu:",
        instruction_en: "Fill in the missing epic/character word:",
        items: [
          {
            prompt: "Banyak cerita wayang ___ dari Ramayana. (bắt nguồn)",
            answer: "berasal",
            options: ["berasal", "berangkat", "berhenti"],
          },
          {
            prompt: "___ adalah tokoh pelawak yang bijaksana. (nhóm hề-hầu)",
            answer: "Punakawan",
            options: ["Punakawan", "Pahlawan", "Pelayan"],
          },
          {
            prompt: "Setiap tokoh punya ___ yang berbeda. (tính cách)",
            answer: "watak",
            options: ["watak", "waktu", "warna"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "tokoh", answer: "nhân vật" },
          { prompt: "ksatria", answer: "hiệp sĩ" },
          { prompt: "cerita rakyat", answer: "truyện dân gian" },
          { prompt: "bijaksana", answer: "khôn ngoan" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Nhiều câu chuyện wayang bắt nguồn từ Ramayana và Mahabharata.", answer: "Banyak cerita wayang berasal dari Ramayana dan Mahabharata." },
          { prompt: "Truyện dân gian cũng thường được diễn trong wayang.", answer: "Cerita rakyat juga sering dimainkan dalam wayang." },
          { prompt: "Mỗi nhân vật có tính cách khác nhau.", answer: "Setiap tokoh punya watak yang berbeda." },
        ],
      },
    ],
  },
  {
    id: "indonesian_wayang_meaning_heritage",
    level: "B1",
    category: "culture",
    title_vi: "Ý nghĩa và di sản — triết lý, bài học, UNESCO",
    title_en: "Meaning & heritage — philosophy, lessons, UNESCO",
    sentences: [
      {
        en: "Setiap pertunjukan wayang mengandung pesan moral.",
        vi: "Mỗi buổi diễn wayang đều chứa đựng một bài học đạo đức.",
        pronunciation_focus: [
          "mengandung → meu-ngan-DUNG, 'chứa đựng/hàm chứa'",
          "pesan moral → 'thông điệp/bài học đạo đức'",
          "setiap → seu-TI-ap, 'mỗi'",
        ],
        pronunciation_focus_en: [
          "mengandung → 'me-ngan-DOONG' — to contain",
          "pesan moral → 'moral message/lesson'",
          "setiap → 'se-TEE-ap' — each/every",
        ],
      },
      {
        en: "Kisahnya menggambarkan pertarungan antara kebaikan dan kejahatan.",
        vi: "Câu chuyện khắc họa cuộc đấu tranh giữa thiện và ác.",
        pronunciation_focus: [
          "menggambarkan → 'khắc họa/mô tả' (gốc gambar = hình + meN-…-kan)",
          "pertarungan → 'cuộc đấu/giao tranh' (gốc tarung + per-…-an)",
          "kebaikan ↔ kejahatan → 'cái thiện' ↔ 'cái ác' (ke-…-an biến tính từ baik/jahat thành danh từ)",
        ],
        pronunciation_focus_en: [
          "menggambarkan → 'to depict/portray' (root 'gambar' = picture + 'meN-…-kan')",
          "pertarungan → 'a battle/struggle' (root 'tarung' + 'per-…-an')",
          "kebaikan ↔ kejahatan → 'goodness' ↔ 'evil' (ke-…-an turns baik/jahat into nouns)",
        ],
      },
      {
        en: "Filosofi wayang mengajarkan keseimbangan hidup.",
        vi: "Triết lý wayang dạy về sự cân bằng trong cuộc sống.",
        pronunciation_focus: [
          "filosofi → fi-lô-SÔ-fi, 'triết lý'",
          "mengajarkan → 'dạy/truyền dạy' (gốc ajar + meN-…-kan)",
          "keseimbangan → 'sự cân bằng' (gốc seimbang + ke-…-an)",
        ],
        pronunciation_focus_en: [
          "filosofi → 'fee-loh-SOH-fee' — philosophy",
          "mengajarkan → 'to teach' (root 'ajar' + 'meN-…-kan')",
          "keseimbangan → 'balance' (root 'seimbang' + 'ke-…-an')",
        ],
      },
      {
        en: "UNESCO mengakui wayang sebagai warisan budaya dunia.",
        vi: "UNESCO công nhận wayang là di sản văn hóa thế giới.",
        pronunciation_focus: [
          "mengakui → meu-nga-KU-i, 'công nhận/thừa nhận' (gốc aku + meN-…-i)",
          "sebagai → seu-ba-GAI, 'như là/với tư cách'",
          "warisan budaya → 'di sản văn hóa' (warisan = di sản, budaya = văn hóa)",
        ],
        pronunciation_focus_en: [
          "mengakui → 'me-nga-KOO-ee' — to recognize/acknowledge (root 'aku' + 'meN-…-i')",
          "sebagai → 'se-ba-GAI' — as",
          "warisan budaya → 'cultural heritage' (warisan = heritage, budaya = culture)",
        ],
      },
      {
        en: "Sayangnya, generasi muda semakin jarang menontonnya.",
        vi: "Đáng tiếc là thế hệ trẻ ngày càng ít xem nó.",
        pronunciation_focus: [
          "sayangnya → 'đáng tiếc là' (mở đầu nêu điều tiếc nuối)",
          "generasi muda → 'thế hệ trẻ'",
          "semakin jarang → 'ngày càng hiếm/ít' (semakin = ngày càng, jarang = hiếm)",
        ],
        pronunciation_focus_en: [
          "sayangnya → 'unfortunately' (opener for a regret)",
          "generasi muda → 'the younger generation'",
          "semakin jarang → 'increasingly rarely' (semakin = more and more, jarang = rare)",
        ],
      },
    ],
    cultural_notes_vi:
      "Wayang không chỉ để giải trí — nó là kho tàng triết lý. Mỗi suất diễn 'mengandung pesan moral' (hàm chứa bài học đạo đức), thường khắc họa 'pertarungan antara kebaikan dan kejahatan' (cuộc đấu thiện–ác). 'Filosofi' wayang đề cao sự cân bằng ('keseimbangan') và tự tri. Năm 2003, UNESCO 'mengakui' (công nhận) wayang là Kiệt tác Di sản truyền khẩu và phi vật thể của nhân loại ('warisan budaya dunia'). Tuy vậy, 'sayangnya' giới trẻ ngày càng ít xem — nên có nhiều nỗ lực hiện đại hóa wayang (wayang cải biên, nhân vật mới) để giữ gìn.",
    cultural_notes_en:
      "Wayang is not only entertainment — it is a trove of philosophy. Each show 'mengandung pesan moral' (carries a moral lesson), often depicting the 'pertarungan antara kebaikan dan kejahatan' (battle of good and evil). Wayang 'filosofi' prizes balance ('keseimbangan') and self-knowledge. In 2003, UNESCO 'mengakui' (recognized) wayang as a Masterpiece of the Oral and Intangible Heritage of Humanity ('world cultural heritage'). Still, 'sayangnya' the young watch it less and less — hence many efforts to modernize wayang (adapted shows, new characters) to preserve it.",
    tip_advice_vi:
      "Mẹo cho người Việt: vòng tiền tố–hậu tố 'ke-…-an' biến tính từ thành danh từ trừu tượng — baik→kebaikan (cái thiện), jahat→kejahatan (cái ác), seimbang→keseimbangan (sự cân bằng). Rất nhiều từ học thuật theo mẫu này. 'meN-…-kan' tạo động từ tha động: ajar→mengajarkan (dạy), gambar→menggambarkan (khắc họa). 'sebagai' = như là/với tư cách. Mở câu nêu tiếc nuối bằng 'Sayangnya, …'. 'semakin + tính từ' = ngày càng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the 'ke-…-an' circumfix turns adjectives into abstract nouns — baik→kebaikan (goodness), jahat→kejahatan (evil), seimbang→keseimbangan (balance). Tons of academic words follow this. 'meN-…-kan' makes transitive verbs: ajar→mengajarkan (teach), gambar→menggambarkan (depict). 'sebagai' = as/in the capacity of. Open a regret with 'Sayangnya, …'. 'semakin + adjective' = increasingly.",
    vocabulary: [
      {
        word: "pesan moral",
        en: "moral message / lesson",
        vi: "bài học đạo đức",
        pos: "noun phrase",
        pronunciation_vi: "peu-SAN MÔ-ral",
        pronunciation_en: "pe-SAN MOH-ral",
      },
      {
        word: "kebaikan",
        en: "goodness",
        vi: "cái thiện",
        pos: "noun",
        pronunciation_vi: "keu-ba-I-kan",
        pronunciation_en: "ke-ba-EE-kan",
      },
      {
        word: "kejahatan",
        en: "evil / crime",
        vi: "cái ác",
        pos: "noun",
        pronunciation_vi: "keu-ja-HA-tan",
        pronunciation_en: "ke-ja-HA-tan",
      },
      {
        word: "filosofi",
        en: "philosophy",
        vi: "triết lý",
        pos: "noun",
        pronunciation_vi: "fi-lô-SÔ-fi",
        pronunciation_en: "fee-loh-SOH-fee",
      },
      {
        word: "keseimbangan",
        en: "balance",
        vi: "sự cân bằng",
        pos: "noun",
        pronunciation_vi: "keu-seim-BA-ngan",
        pronunciation_en: "ke-seim-BA-ngan",
      },
      {
        word: "warisan budaya",
        en: "cultural heritage",
        vi: "di sản văn hóa",
        pos: "noun phrase",
        pronunciation_vi: "wa-RI-san bu-DA-ya",
        pronunciation_en: "wa-REE-san boo-DA-ya",
      },
      {
        word: "mengakui",
        en: "to recognize / acknowledge",
        vi: "công nhận",
        pos: "verb",
        pronunciation_vi: "meu-nga-KU-i",
        pronunciation_en: "me-nga-KOO-ee",
      },
    ],
    dialogue: [
      {
        speaker: "Mahasiswa",
        text: "Kenapa wayang dianggap penting, Pak?",
        vi: "Vì sao wayang được xem là quan trọng vậy thầy?",
        en: "Why is wayang considered important, sir?",
      },
      {
        speaker: "Dosen",
        text: "Karena setiap pertunjukan mengandung pesan moral dan filosofi hidup.",
        vi: "Vì mỗi buổi diễn đều hàm chứa bài học đạo đức và triết lý sống.",
        en: "Because each performance carries a moral lesson and a life philosophy.",
      },
      {
        speaker: "Mahasiswa",
        text: "Apakah dunia internasional mengakuinya?",
        vi: "Quốc tế có công nhận nó không ạ?",
        en: "Does the international community recognize it?",
      },
      {
        speaker: "Dosen",
        text: "Ya, UNESCO mengakuinya sebagai warisan budaya dunia. Sayangnya, generasi muda semakin jarang menontonnya.",
        vi: "Có, UNESCO công nhận là di sản văn hóa thế giới. Đáng tiếc, thế hệ trẻ ngày càng ít xem.",
        en: "Yes, UNESCO recognizes it as world cultural heritage. Unfortunately, the young watch it less and less.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về ý nghĩa/di sản còn thiếu:",
        instruction_en: "Fill in the missing meaning/heritage word:",
        items: [
          {
            prompt: "Setiap pertunjukan wayang mengandung ___. (bài học đạo đức)",
            answer: "pesan moral",
            options: ["pesan moral", "pesan singkat", "pesanan makanan"],
          },
          {
            prompt: "Filosofi wayang mengajarkan ___ hidup. (sự cân bằng)",
            answer: "keseimbangan",
            options: ["keseimbangan", "kecepatan", "keamanan"],
          },
          {
            prompt: "UNESCO ___ wayang sebagai warisan budaya dunia. (công nhận)",
            answer: "mengakui",
            options: ["mengakui", "menutup", "menjual"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kebaikan", answer: "cái thiện" },
          { prompt: "kejahatan", answer: "cái ác" },
          { prompt: "keseimbangan", answer: "sự cân bằng" },
          { prompt: "warisan budaya", answer: "di sản văn hóa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Câu chuyện khắc họa cuộc đấu tranh giữa thiện và ác.", answer: "Kisahnya menggambarkan pertarungan antara kebaikan dan kejahatan." },
          { prompt: "UNESCO công nhận wayang là di sản văn hóa thế giới.", answer: "UNESCO mengakui wayang sebagai warisan budaya dunia." },
          { prompt: "Đáng tiếc là thế hệ trẻ ngày càng ít xem nó.", answer: "Sayangnya, generasi muda semakin jarang menontonnya." },
        ],
      },
    ],
  },
];

export default wayangFolkloreLessons;
