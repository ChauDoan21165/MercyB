// src/languages/indonesian/extra/indonesian-islands.ts
//
// Indonesian islands & regional-travel pack for Vietnamese learners.
// Covers: the major islands (Jawa, Bali, Sumatra, Kalimantan, Sulawesi, Papua),
// island-hopping travel vocabulary (pulau, kapal, feri, pantai, wisata,
// oleh-oleh), and regional differences (suku, bahasa daerah, adat). Hand-crafted,
// no filler.
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
  cell_id?: string;
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
  cell_id?: string;
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

export const indonesianIslandsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_pulau_pulau_utama",
    level: "A1",
    category: "geography",
    title_vi: "Các hòn đảo lớn của Indonesia",
    title_en: "Indonesia's major islands",
    sentences: [
      {
        en: "Indonesia adalah negara dengan ribuan pulau.",
        vi: "Indonesia là quốc gia có hàng nghìn hòn đảo.",
        pronunciation_focus: [
          "negara → neu-GA-ra, 'quốc gia/đất nước'",
          "ribuan → ri-BU-an, 'hàng nghìn' (gốc ribu = nghìn + -an)",
          "pulau → PU-lau, 'hòn đảo'",
        ],
        pronunciation_focus_en: [
          "negara → 'ne-GA-ra' — country/nation",
          "ribuan → 'ree-BOO-an' — thousands (root 'ribu' = thousand + '-an')",
          "pulau → 'POO-lau' — island",
        ],
      },
      {
        en: "Pulau Jawa adalah pulau yang paling ramai.",
        vi: "Đảo Java là hòn đảo đông dân nhất.",
        pronunciation_focus: [
          "Jawa → JA-wa, đảo Java — thủ đô Jakarta nằm ở đây",
          "yang → từ nối 'mà/cái mà', dùng để mô tả danh từ",
          "paling ramai → 'đông/nhộn nhịp nhất' (paling = nhất)",
        ],
        pronunciation_focus_en: [
          "Jawa → 'JA-wa' — Java; the capital Jakarta sits here",
          "yang → relative word 'that/which', links a description to a noun",
          "paling ramai → 'most crowded/busiest' (paling = most)",
        ],
      },
      {
        en: "Bali terkenal karena pantainya yang indah.",
        vi: "Bali nổi tiếng vì những bãi biển đẹp.",
        pronunciation_focus: [
          "terkenal → ter-keu-NAL, 'nổi tiếng'",
          "karena → ka-REU-na, 'vì/bởi vì'",
          "pantainya → 'bãi biển (của nó)' (pantai + -nya); indah = đẹp",
        ],
        pronunciation_focus_en: [
          "terkenal → 'ter-ke-NAL' — famous",
          "karena → 'ka-REH-na' — because",
          "pantainya → 'its beaches' (pantai + '-nya'); indah = beautiful",
        ],
      },
      {
        en: "Sumatra ada di sebelah barat Jawa.",
        vi: "Sumatra nằm ở phía tây đảo Java.",
        pronunciation_focus: [
          "ada di → 'nằm ở/có ở' (ada = có, di = ở)",
          "sebelah → seu-beu-LAH, 'phía/bên'",
          "barat → BA-rat, 'phía tây'",
        ],
        pronunciation_focus_en: [
          "ada di → 'is located at' (ada = there is, di = at)",
          "sebelah → 'se-be-LAH' — side/direction",
          "barat → 'BA-rat' — west",
        ],
      },
      {
        en: "Saya ingin pergi ke Papua suatu hari.",
        vi: "Tôi muốn đến Papua một ngày nào đó.",
        pronunciation_focus: [
          "ingin → I-ngin, 'muốn' (trang trọng hơn 'mau')",
          "pergi ke → 'đi đến' (pergi = đi, ke = đến)",
          "suatu hari → 'một ngày nào đó'",
        ],
        pronunciation_focus_en: [
          "ingin → 'EE-ngin' — to want (more formal than 'mau')",
          "pergi ke → 'to go to' (pergi = go, ke = to)",
          "suatu hari → 'someday'",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là quốc đảo lớn nhất thế giới với hơn 17.000 hòn đảo ('pulau'). Năm đảo lớn nhất: Jawa (đông dân nhất, có thủ đô Jakarta), Sumatra (phía tây), Kalimantan (phần Indonesia của đảo Borneo), Sulawesi (hình chữ K), và Papua (phía đông, rừng rậm). Bali tuy nhỏ nhưng nổi tiếng thế giới vì du lịch. Khẩu hiệu quốc gia 'Bhinneka Tunggal Ika' nghĩa là 'Thống nhất trong đa dạng'.",
    cultural_notes_en:
      "Indonesia is the world's largest archipelago, with over 17,000 islands ('pulau'). The five biggest: Jawa (most populous, home to the capital Jakarta), Sumatra (in the west), Kalimantan (the Indonesian part of Borneo), Sulawesi (K-shaped), and Papua (in the east, dense rainforest). Bali is small but world-famous for tourism. The national motto 'Bhinneka Tunggal Ika' means 'Unity in Diversity'.",
    tip_advice_vi:
      "Mẹo cho người Việt: học bốn hướng để chỉ vị trí đảo — utara (bắc), selatan (nam), barat (tây), timur (đông). Indonesia không chia động từ theo thì, nên 'Saya pergi' có thể là đi/đã đi/sẽ đi — ngữ cảnh và mốc thời gian ('besok', 'suatu hari') quyết định. Từ 'pulau' luôn đứng TRƯỚC tên đảo: Pulau Jawa, Pulau Bali (giống 'đảo' + tên trong tiếng Việt).",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the four directions to place an island — utara (north), selatan (south), barat (west), timur (east). Indonesian verbs don't inflect for tense, so 'Saya pergi' can mean go/went/will go — context and time words ('besok', 'suatu hari') decide. The word 'pulau' always comes BEFORE the island name: Pulau Jawa, Pulau Bali (just like Vietnamese 'đảo' + name).",
    vocabulary: [
      {
        cell_id: "41b2a194-bc17-4819-acb0-702cd6c897b9",
        word: "pulau",
        en: "island",
        vi: "hòn đảo",
        pos: "noun",
        pronunciation_vi: "PU-lau",
        pronunciation_en: "POO-lau",
      },
      {
        cell_id: "8882f83a-9513-42a2-927f-b9b70a9ddf26",
        word: "negara",
        en: "country / nation",
        vi: "quốc gia",
        pos: "noun",
        pronunciation_vi: "neu-GA-ra",
        pronunciation_en: "ne-GA-ra",
      },
      {
        cell_id: "a5f25ac3-f802-437f-b3b7-3601955b5c29",
        word: "pantai",
        en: "beach",
        vi: "bãi biển",
        pos: "noun",
        pronunciation_vi: "PAN-tai",
        pronunciation_en: "PAN-tai",
      },
      {
        cell_id: "14cc2ac1-4ee2-45df-93bc-deda5c789eed",
        word: "laut",
        en: "sea",
        vi: "biển",
        pos: "noun",
        pronunciation_vi: "LA-ut",
        pronunciation_en: "LA-oot",
      },
      {
        cell_id: "39151c80-3c79-4305-b5de-56942a3b7fcf",
        word: "gunung",
        en: "mountain",
        vi: "núi",
        pos: "noun",
        pronunciation_vi: "GU-nung",
        pronunciation_en: "GOO-noong",
      },
      {
        cell_id: "38208165-9ad4-4671-a6de-3a58a45d2f6d",
        word: "barat",
        en: "west",
        vi: "phía tây",
        pos: "noun",
        pronunciation_vi: "BA-rat",
        pronunciation_en: "BA-rat",
      },
      {
        cell_id: "2368ed3a-5991-46f8-8359-0971fd7619df",
        word: "timur",
        en: "east",
        vi: "phía đông",
        pos: "noun",
        pronunciation_vi: "TI-mur",
        pronunciation_en: "TEE-moor",
      },
      {
        cell_id: "3db0a99b-6425-4b25-b288-ace869112768",
        word: "terkenal",
        en: "famous",
        vi: "nổi tiếng",
        pos: "adjective",
        pronunciation_vi: "ter-keu-NAL",
        pronunciation_en: "ter-ke-NAL",
      },
    ],
    dialogue: [
      {
        cell_id: "5fe21bb9-5ee6-4694-b53b-5dfb0569b1f6",
        speaker: "Wisatawan",
        text: "Pulau apa yang paling ramai di Indonesia?",
        vi: "Hòn đảo nào đông dân nhất Indonesia?",
        en: "Which island is the most crowded in Indonesia?",
      },
      {
        cell_id: "fdb73877-8359-424e-a44d-0b8a667fba41",
        speaker: "Pemandu",
        text: "Pulau Jawa. Jakarta, ibu kota, ada di sana.",
        vi: "Đảo Java. Jakarta, thủ đô, nằm ở đó.",
        en: "Java. Jakarta, the capital, is there.",
      },
      {
        cell_id: "551ebda0-dcf0-4e47-ab4b-d41a4361db46",
        speaker: "Wisatawan",
        text: "Kalau mau ke pantai yang indah, ke mana?",
        vi: "Nếu muốn đến bãi biển đẹp thì đi đâu?",
        en: "If I want to go to a beautiful beach, where should I go?",
      },
      {
        cell_id: "a9bb6f82-f410-409a-9481-c3edb13c6f55",
        speaker: "Pemandu",
        text: "Ke Bali, tentu saja. Pantainya terkenal di seluruh dunia.",
        vi: "Đến Bali, dĩ nhiên rồi. Bãi biển ở đó nổi tiếng khắp thế giới.",
        en: "To Bali, of course. Its beaches are famous all over the world.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ địa lý còn thiếu:",
        instruction_en: "Fill in the missing geography word:",
        items: [
          {
            prompt: "Indonesia punya ribuan ___. (hòn đảo)",
            answer: "pulau",
            options: ["pulau", "pasar", "pintu"],
          },
          {
            prompt: "Bali terkenal karena ___-nya yang indah. (bãi biển)",
            answer: "pantai",
            options: ["pantai", "pajak", "panas"],
          },
          {
            prompt: "Sumatra ada di sebelah ___ Jawa. (phía tây)",
            answer: "barat",
            options: ["barat", "besar", "bandara"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pulau", answer: "hòn đảo" },
          { prompt: "laut", answer: "biển" },
          { prompt: "gunung", answer: "núi" },
          { prompt: "timur", answer: "phía đông" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Indonesia là quốc gia có hàng nghìn hòn đảo.", answer: "Indonesia adalah negara dengan ribuan pulau." },
          { prompt: "Bali nổi tiếng vì những bãi biển đẹp.", answer: "Bali terkenal karena pantainya yang indah." },
          { prompt: "Tôi muốn đến Papua một ngày nào đó.", answer: "Saya ingin pergi ke Papua suatu hari." },
        ],
      },
    ],
  },
  {
    id: "indonesian_island_hopping_travel",
    level: "A2",
    category: "transport",
    title_vi: "Đi tàu giữa các đảo — du lịch đảo",
    title_en: "Island hopping — inter-island travel",
    sentences: [
      {
        en: "Bagaimana cara pergi dari Jawa ke Bali?",
        vi: "Đi từ Java sang Bali bằng cách nào?",
        pronunciation_focus: [
          "bagaimana → ba-gai-MA-na, 'như thế nào/làm sao'",
          "cara → CHA-ra, 'cách (thức)'",
          "dari … ke … → 'từ … đến …'",
        ],
        pronunciation_focus_en: [
          "bagaimana → 'ba-gai-MA-na' — how",
          "cara → 'CHA-ra' — way/method",
          "dari … ke … → 'from … to …'",
        ],
      },
      {
        en: "Anda bisa naik feri atau pesawat.",
        vi: "Bạn có thể đi phà hoặc máy bay.",
        pronunciation_focus: [
          "Anda → AN-da, 'bạn/ông/bà' lịch sự",
          "feri → FE-ri, 'phà' (mượn 'ferry')",
          "atau → A-tau, 'hoặc/hay'",
        ],
        pronunciation_focus_en: [
          "Anda → 'AN-da' — polite 'you'",
          "feri → 'FEH-ree' — ferry (loanword)",
          "atau → 'A-tau' — or",
        ],
      },
      {
        en: "Perjalanan dengan kapal memakan waktu satu jam.",
        vi: "Chuyến đi bằng tàu mất một tiếng.",
        pronunciation_focus: [
          "perjalanan → 'chuyến đi/hành trình' (gốc jalan = đi + per-…-an)",
          "kapal → KA-pal, 'tàu thuyền'",
          "memakan waktu → 'mất thời gian' (thành ngữ, đen: 'ăn thời gian')",
        ],
        pronunciation_focus_en: [
          "perjalanan → 'journey/trip' (root 'jalan' = to go + 'per-…-an')",
          "kapal → 'KA-pal' — ship/boat",
          "memakan waktu → 'to take time' (idiom, lit. 'to eat time')",
        ],
      },
      {
        en: "Jangan lupa beli oleh-oleh untuk keluarga.",
        vi: "Đừng quên mua quà về cho gia đình.",
        pronunciation_focus: [
          "jangan → JA-ngan, 'đừng' (cấm/khuyên)",
          "lupa → LU-pa, 'quên'",
          "oleh-oleh → 'quà (đặc sản mang về)' — từ lặp, nét văn hóa",
        ],
        pronunciation_focus_en: [
          "jangan → 'JA-ngan' — don't (prohibition)",
          "lupa → 'LOO-pa' — to forget",
          "oleh-oleh → 'souvenir/local gift to bring home' — reduplicated word, a cultural staple",
        ],
      },
      {
        en: "Tempat wisata di Lombok juga sangat bagus.",
        vi: "Các điểm du lịch ở Lombok cũng rất đẹp.",
        pronunciation_focus: [
          "tempat wisata → 'điểm du lịch' (tempat = nơi, wisata = du lịch)",
          "juga → JU-ga, 'cũng'",
          "sangat bagus → 'rất tốt/đẹp' (sangat = rất)",
        ],
        pronunciation_focus_en: [
          "tempat wisata → 'tourist spot' (tempat = place, wisata = tourism)",
          "juga → 'JOO-ga' — also/too",
          "sangat bagus → 'very good/nice' (sangat = very)",
        ],
      },
    ],
    cultural_notes_vi:
      "Vì là quốc đảo, người Indonesia di chuyển giữa các đảo bằng máy bay ('pesawat'), phà ('feri') và tàu thủy ('kapal'). Tuyến phà Ketapang–Gilimanuk nối Java và Bali chỉ mất khoảng một tiếng. Mua 'oleh-oleh' (quà đặc sản vùng miền) mang về cho người thân là một nét văn hóa rất quan trọng — mỗi đảo có đặc sản riêng. Lombok, Komodo, Raja Ampat (Papua) là các điểm du lịch ('tempat wisata') đang lên.",
    cultural_notes_en:
      "Being an archipelago, Indonesians travel between islands by plane ('pesawat'), ferry ('feri') and ship ('kapal'). The Ketapang–Gilimanuk ferry linking Java and Bali takes only about an hour. Buying 'oleh-oleh' (regional specialty gifts) to bring home to relatives is a big cultural expectation — each island has its own specialty. Lombok, Komodo, and Raja Ampat (Papua) are rising tourist spots ('tempat wisata').",
    tip_advice_vi:
      "Mẹo cho người Việt: 'oleh-oleh' là từ lặp (reduplication) — tiếng Indonesia hay lặp từ để tạo nghĩa mới hoặc số nhiều (jalan-jalan = đi dạo, pulau-pulau = các đảo). Để hỏi cách làm, dùng 'Bagaimana cara + động từ?'. Hai từ 'hoặc' khác nhau: 'atau' (hoặc, trong câu kể/hỏi) — đừng nhầm với 'apakah'. 'Jangan + động từ' = đừng làm gì.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'oleh-oleh' is a reduplication — Indonesian often doubles a word to make a new meaning or a plural (jalan-jalan = to stroll, pulau-pulau = islands). To ask how to do something, use 'Bagaimana cara + verb?'. Note 'atau' = 'or' in statements/questions — don't confuse it with the yes/no marker 'apakah'. 'Jangan + verb' = don't do something.",
    vocabulary: [
      {
        cell_id: "c1f76332-d6ea-495a-8ec1-c869cb8e9147",
        word: "kapal",
        en: "ship / boat",
        vi: "tàu thủy",
        pos: "noun",
        pronunciation_vi: "KA-pal",
        pronunciation_en: "KA-pal",
      },
      {
        cell_id: "41a014e9-61a1-41a2-acf9-65523fb45678",
        word: "feri",
        en: "ferry",
        vi: "phà",
        pos: "noun",
        pronunciation_vi: "FE-ri",
        pronunciation_en: "FEH-ree",
      },
      {
        cell_id: "1134f16e-6bf0-4225-abf5-ff02321c8aa4",
        word: "perjalanan",
        en: "journey / trip",
        vi: "chuyến đi",
        pos: "noun",
        pronunciation_vi: "per-ja-LA-nan",
        pronunciation_en: "per-ja-LA-nan",
      },
      {
        cell_id: "712a2d13-39cc-498a-968c-a620821dd586",
        word: "wisata",
        en: "tourism / sightseeing",
        vi: "du lịch",
        pos: "noun",
        pronunciation_vi: "wi-SA-ta",
        pronunciation_en: "wee-SA-ta",
      },
      {
        cell_id: "cf402ada-2818-4b5d-b751-01840fff58d6",
        word: "oleh-oleh",
        en: "souvenir / regional gift",
        vi: "quà đặc sản mang về",
        pos: "noun",
        pronunciation_vi: "Ô-lèh-Ô-lèh",
        pronunciation_en: "OH-leh-OH-leh",
      },
      {
        cell_id: "074275ea-61e1-49e8-b6fd-605096e5f082",
        word: "cara",
        en: "way / method",
        vi: "cách thức",
        pos: "noun",
        pronunciation_vi: "CHA-ra",
        pronunciation_en: "CHA-ra",
      },
      {
        cell_id: "e0766add-9081-40b1-8b9e-7a3956a41625",
        word: "atau",
        en: "or",
        vi: "hoặc / hay",
        pos: "conjunction",
        pronunciation_vi: "A-tau",
        pronunciation_en: "A-tau",
      },
      {
        cell_id: "f20ae5e3-93b6-4465-97b6-c328cf7b4351",
        word: "jangan",
        en: "don't (prohibition)",
        vi: "đừng",
        pos: "particle",
        pronunciation_vi: "JA-ngan",
        pronunciation_en: "JA-ngan",
      },
    ],
    dialogue: [
      {
        cell_id: "2338dfa4-3097-4e41-b532-9b4fb334060f",
        speaker: "Wisatawan",
        text: "Bagaimana cara pergi dari Jawa ke Bali?",
        vi: "Đi từ Java sang Bali bằng cách nào?",
        en: "How do I get from Java to Bali?",
      },
      {
        cell_id: "5796e19e-40f2-4763-bebd-df9bb3c4b575",
        speaker: "Petugas",
        text: "Bisa naik feri atau pesawat. Feri lebih murah.",
        vi: "Có thể đi phà hoặc máy bay. Phà rẻ hơn.",
        en: "You can take a ferry or a plane. The ferry is cheaper.",
      },
      {
        cell_id: "31dc2efe-5cf6-48c8-baef-25d8e0eafdea",
        speaker: "Wisatawan",
        text: "Perjalanan dengan kapal berapa lama?",
        vi: "Chuyến đi bằng tàu mất bao lâu?",
        en: "How long is the journey by ship?",
      },
      {
        cell_id: "b64c4e38-ea52-4b41-b88f-03617434b3cc",
        speaker: "Petugas",
        text: "Sekitar satu jam. Jangan lupa beli oleh-oleh, ya!",
        vi: "Khoảng một tiếng. Đừng quên mua quà nhé!",
        en: "About one hour. Don't forget to buy souvenirs!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ du lịch còn thiếu:",
        instruction_en: "Fill in the missing travel word:",
        items: [
          {
            prompt: "Anda bisa naik ___ atau pesawat. (phà)",
            answer: "feri",
            options: ["feri", "foto", "fakta"],
          },
          {
            prompt: "Jangan lupa beli ___ untuk keluarga. (quà)",
            answer: "oleh-oleh",
            options: ["oleh-oleh", "obat", "orang"],
          },
          {
            prompt: "___ cara pergi ke Bali? (như thế nào)",
            answer: "Bagaimana",
            options: ["Bagaimana", "Berapa", "Bisa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kapal", answer: "tàu thủy" },
          { prompt: "wisata", answer: "du lịch" },
          { prompt: "perjalanan", answer: "chuyến đi" },
          { prompt: "atau", answer: "hoặc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Bạn có thể đi phà hoặc máy bay.", answer: "Anda bisa naik feri atau pesawat." },
          { prompt: "Chuyến đi bằng tàu mất một tiếng.", answer: "Perjalanan dengan kapal memakan waktu satu jam." },
          { prompt: "Đừng quên mua quà về cho gia đình.", answer: "Jangan lupa beli oleh-oleh untuk keluarga." },
        ],
      },
    ],
  },
  {
    id: "indonesian_regional_differences",
    level: "B1",
    category: "culture",
    title_vi: "Khác biệt vùng miền — dân tộc, tiếng địa phương, phong tục",
    title_en: "Regional differences — ethnicities, local languages, customs",
    sentences: [
      {
        en: "Setiap pulau punya suku dan budaya yang berbeda.",
        vi: "Mỗi hòn đảo có dân tộc và văn hóa khác nhau.",
        pronunciation_focus: [
          "setiap → seu-TI-ap, 'mỗi/mọi'",
          "suku → SU-ku, 'dân tộc/tộc người'",
          "berbeda → ber-BE-da, 'khác nhau' (gốc beda + ber-)",
        ],
        pronunciation_focus_en: [
          "setiap → 'se-TEE-ap' — each/every",
          "suku → 'SOO-koo' — ethnic group",
          "berbeda → 'ber-BEH-da' — different (root 'beda' + 'ber-')",
        ],
      },
      {
        en: "Di Jawa, banyak orang berbicara bahasa Jawa di rumah.",
        vi: "Ở Java, nhiều người nói tiếng Java ở nhà.",
        pronunciation_focus: [
          "banyak orang → 'nhiều người' (banyak = nhiều)",
          "berbicara → ber-bi-CHA-ra, 'nói chuyện' (gốc bicara + ber-)",
          "bahasa Jawa → 'tiếng Java' — tiếng địa phương, khác bahasa Indonesia",
        ],
        pronunciation_focus_en: [
          "banyak orang → 'many people' (banyak = many)",
          "berbicara → 'ber-bee-CHA-ra' — to speak (root 'bicara' + 'ber-')",
          "bahasa Jawa → 'Javanese' — a regional language, distinct from bahasa Indonesia",
        ],
      },
      {
        en: "Bahasa Indonesia adalah bahasa persatuan untuk semua suku.",
        vi: "Tiếng Indonesia là ngôn ngữ chung của mọi dân tộc.",
        pronunciation_focus: [
          "bahasa persatuan → 'ngôn ngữ đoàn kết/thống nhất' (gốc satu = một)",
          "untuk semua → 'cho tất cả' (semua = tất cả)",
          "L1 note: 'bahasa' = ngôn ngữ — đừng nhầm là 'tiếng ồn'",
        ],
        pronunciation_focus_en: [
          "bahasa persatuan → 'unifying language' (root 'satu' = one)",
          "untuk semua → 'for all' (semua = all)",
          "note: 'bahasa' = language — a false friend is unlikely but worth flagging",
        ],
      },
      {
        en: "Adat istiadat di Bali sangat berbeda dengan di Sumatra.",
        vi: "Phong tục tập quán ở Bali rất khác so với ở Sumatra.",
        pronunciation_focus: [
          "adat istiadat → 'phong tục tập quán' (cụm từ đôi cố định)",
          "sangat berbeda → 'rất khác'",
          "berbeda dengan → 'khác với' — luôn đi cùng 'dengan'",
        ],
        pronunciation_focus_en: [
          "adat istiadat → 'customs and traditions' (a fixed binomial)",
          "sangat berbeda → 'very different'",
          "berbeda dengan → 'different from' — always pairs with 'dengan'",
        ],
      },
      {
        en: "Walaupun berbeda-beda, kita tetap satu bangsa.",
        vi: "Dù khác biệt, chúng ta vẫn là một dân tộc.",
        pronunciation_focus: [
          "walaupun → wa-lau-PUN, 'mặc dù/dù'",
          "berbeda-beda → 'muôn màu/đa dạng' (từ lặp nhấn mạnh sự đa dạng)",
          "tetap satu bangsa → 'vẫn là một quốc gia/dân tộc' (tetap = vẫn)",
        ],
        pronunciation_focus_en: [
          "walaupun → 'wa-lau-POON' — although/even though",
          "berbeda-beda → 'all different/diverse' (reduplication stressing variety)",
          "tetap satu bangsa → 'still one nation' (tetap = still/remain)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có hơn 1.300 dân tộc ('suku') và hơn 700 tiếng địa phương ('bahasa daerah'): Jawa, Sunda, Batak, Minang, Bugis, Dayak, Papua… Tiếng Indonesia ('bahasa Indonesia') là 'bahasa persatuan' — ngôn ngữ chung do nhà nước chuẩn hóa để mọi dân tộc giao tiếp được với nhau, dù ở nhà họ vẫn nói tiếng mẹ đẻ. 'Adat istiadat' (phong tục) khác nhau rõ rệt: lễ hỏa táng Ngaben ở Bali theo Hindu, nhà sàn Rumah Gadang của người Minang ở Sumatra. Khẩu hiệu 'Bhinneka Tunggal Ika' (Thống nhất trong đa dạng) chính là để diễn tả điều này.",
    cultural_notes_en:
      "Indonesia has over 1,300 ethnic groups ('suku') and more than 700 regional languages ('bahasa daerah'): Javanese, Sundanese, Batak, Minang, Bugis, Dayak, Papuan, and more. Indonesian ('bahasa Indonesia') is the 'bahasa persatuan' — a state-standardized common language so all ethnic groups can communicate, even though they still speak their mother tongue at home. 'Adat istiadat' (customs) differ sharply: Bali's Hindu Ngaben cremation, the Minang's Rumah Gadang stilt houses in Sumatra. The motto 'Bhinneka Tunggal Ika' (Unity in Diversity) captures exactly this.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt 'bahasa Indonesia' (quốc ngữ, ai cũng học) với 'bahasa daerah' (tiếng địa phương như bahasa Jawa, bahasa Sunda). Tiền tố 'ber-' biến danh từ thành 'có/làm': bicara → berbicara (nói chuyện), beda → berbeda (khác). Từ lặp 'berbeda-beda' nhấn mạnh sự đa dạng (≠ chỉ 'khác'). Cặp tương phản hay dùng: 'walaupun … tetap …' = 'mặc dù … vẫn …'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish 'bahasa Indonesia' (the national language everyone learns) from 'bahasa daerah' (regional languages like Javanese, Sundanese). The 'ber-' prefix turns a noun into 'to have/do': bicara → berbicara (to converse), beda → berbeda (to differ). The reduplication 'berbeda-beda' stresses diversity (≠ just 'different'). A handy contrast frame: 'walaupun … tetap …' = 'although … still …'.",
    vocabulary: [
      {
        cell_id: "f498eefc-f20c-45f4-a5b8-35703b8deedb",
        word: "suku",
        en: "ethnic group",
        vi: "dân tộc / tộc người",
        pos: "noun",
        pronunciation_vi: "SU-ku",
        pronunciation_en: "SOO-koo",
      },
      {
        cell_id: "28062ada-33d2-44e3-9406-4fb262503730",
        word: "budaya",
        en: "culture",
        vi: "văn hóa",
        pos: "noun",
        pronunciation_vi: "bu-DA-ya",
        pronunciation_en: "boo-DA-ya",
      },
      {
        cell_id: "436f8af7-4e0a-459f-9677-159217c01ebe",
        word: "bahasa daerah",
        en: "regional language",
        vi: "tiếng địa phương",
        pos: "noun phrase",
        pronunciation_vi: "ba-HA-sa DA-e-rah",
        pronunciation_en: "ba-HA-sa DA-e-rah",
      },
      {
        cell_id: "a42c2016-067e-4ae1-b161-a6f2e187921f",
        word: "berbeda",
        en: "to be different",
        vi: "khác nhau",
        pos: "verb / adjective",
        pronunciation_vi: "ber-BE-da",
        pronunciation_en: "ber-BEH-da",
      },
      {
        cell_id: "34823be5-2a82-4585-a6eb-69db1ebe1e48",
        word: "adat istiadat",
        en: "customs and traditions",
        vi: "phong tục tập quán",
        pos: "noun phrase",
        pronunciation_vi: "A-dat is-ti-A-dat",
        pronunciation_en: "A-dat ees-tee-A-dat",
      },
      {
        cell_id: "ec500c18-d580-474f-bfd1-954fae2d2851",
        word: "persatuan",
        en: "unity",
        vi: "sự đoàn kết / thống nhất",
        pos: "noun",
        pronunciation_vi: "per-sa-TU-an",
        pronunciation_en: "per-sa-TOO-an",
      },
      {
        cell_id: "96cf5d3d-4ba6-4c12-ae8f-d388cf425b60",
        word: "bangsa",
        en: "nation / people",
        vi: "dân tộc / quốc gia",
        pos: "noun",
        pronunciation_vi: "BANG-sa",
        pronunciation_en: "BANG-sa",
      },
      {
        cell_id: "02049137-7fb3-4ba7-b349-3cf49cbea013",
        word: "walaupun",
        en: "although",
        vi: "mặc dù",
        pos: "conjunction",
        pronunciation_vi: "wa-lau-PUN",
        pronunciation_en: "wa-lau-POON",
      },
    ],
    dialogue: [
      {
        cell_id: "815f5ce6-8f7f-4c07-acb2-e6412e5fa436",
        speaker: "Turis",
        text: "Apakah semua orang Indonesia berbicara bahasa yang sama?",
        vi: "Có phải tất cả người Indonesia đều nói cùng một thứ tiếng không?",
        en: "Do all Indonesians speak the same language?",
      },
      {
        cell_id: "74851457-1f89-4750-8b8b-99be1c6959a7",
        speaker: "Warga",
        text: "Bahasa Indonesia, ya. Tapi di rumah, banyak yang pakai bahasa daerah.",
        vi: "Tiếng Indonesia thì có. Nhưng ở nhà, nhiều người dùng tiếng địa phương.",
        en: "Indonesian, yes. But at home, many use their regional language.",
      },
      {
        cell_id: "177559af-8476-44d9-a8db-f13144858a7b",
        speaker: "Turis",
        text: "Jadi setiap suku punya budaya sendiri?",
        vi: "Vậy mỗi dân tộc có văn hóa riêng à?",
        en: "So each ethnic group has its own culture?",
      },
      {
        cell_id: "9d68abc2-bacf-460f-a402-b489b60fcd86",
        speaker: "Warga",
        text: "Betul. Walaupun berbeda-beda, kita tetap satu bangsa.",
        vi: "Đúng vậy. Dù khác biệt, chúng ta vẫn là một dân tộc.",
        en: "Exactly. Though we're all different, we're still one nation.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về vùng miền còn thiếu:",
        instruction_en: "Fill in the missing regional word:",
        items: [
          {
            prompt: "Setiap pulau punya ___ dan budaya yang berbeda. (dân tộc)",
            answer: "suku",
            options: ["suku", "surat", "suka"],
          },
          {
            prompt: "Di rumah, banyak orang pakai ___. (tiếng địa phương)",
            answer: "bahasa daerah",
            options: ["bahasa daerah", "bahasa asing", "bahasa tubuh"],
          },
          {
            prompt: "___ berbeda-beda, kita tetap satu bangsa. (mặc dù)",
            answer: "Walaupun",
            options: ["Walaupun", "Walikota", "Waktu"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "suku", answer: "dân tộc" },
          { prompt: "budaya", answer: "văn hóa" },
          { prompt: "adat istiadat", answer: "phong tục tập quán" },
          { prompt: "persatuan", answer: "sự đoàn kết" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Mỗi hòn đảo có dân tộc và văn hóa khác nhau.", answer: "Setiap pulau punya suku dan budaya yang berbeda." },
          { prompt: "Tiếng Indonesia là ngôn ngữ chung của mọi dân tộc.", answer: "Bahasa Indonesia adalah bahasa persatuan untuk semua suku." },
          { prompt: "Dù khác biệt, chúng ta vẫn là một dân tộc.", answer: "Walaupun berbeda-beda, kita tetap satu bangsa." },
        ],
      },
    ],
  },
];

export default indonesianIslandsLessons;
