// src/languages/indonesian/extra/furniture-decorating.ts
//
// Indonesian furniture & home-decorating pack for Vietnamese learners.
// Covers: buying furniture and naming pieces (toko mebel, IKEA, Informa, kayu
// jati), measuring and choosing for a room (ukuran, warna, gaya, muat), and
// home renovation/interior decorating (renovasi, cat, pasang, tukang). No filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
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
type Exercise = Record<string, any>;

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

export const furnitureDecoratingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_home_buying_furniture",
    level: "A1",
    category: "home-furniture",
    title_vi: "Mua nội thất — bàn, ghế, tủ, giường",
    title_en: "Buying furniture — tables, chairs, cupboards, beds",
    sentences: [
      {
        en: "Saya mau beli meja dan kursi baru.",
        vi: "Tôi muốn mua bàn và ghế mới.",
        pronunciation_focus: [
          "meja → ME-ja, 'bàn'",
          "kursi → KUR-si, 'ghế'",
          "baru → BA-ru, 'mới' (đứng SAU danh từ: kursi baru = ghế mới)",
        ],
        pronunciation_focus_en: [
          "meja → 'MEH-ja' — table",
          "kursi → 'KOOR-see' — chair",
          "baru → 'BA-roo' — new (comes AFTER the noun: kursi baru)",
        ],
      },
      {
        en: "Lemari ini terbuat dari kayu jati.",
        vi: "Cái tủ này làm bằng gỗ tếch.",
        pronunciation_focus: [
          "lemari → le-MA-ri, 'tủ (quần áo/đồ)'",
          "terbuat dari → 'làm bằng/được làm từ'",
          "kayu jati → 'gỗ tếch' (kayu = gỗ, jati = cây tếch)",
        ],
        pronunciation_focus_en: [
          "lemari → 'le-MA-ree' — cupboard / wardrobe",
          "terbuat dari → 'made of / made from'",
          "kayu jati → 'teak wood' (kayu = wood, jati = teak)",
        ],
      },
      {
        en: "Berapa harga tempat tidur ini?",
        vi: "Cái giường này giá bao nhiêu?",
        pronunciation_focus: [
          "tempat tidur → 'giường' (tempat = chỗ, tidur = ngủ → 'chỗ ngủ')",
          "harga → HAR-ga, 'giá'",
          "berapa → be-RA-pa, 'bao nhiêu'",
        ],
        pronunciation_focus_en: [
          "tempat tidur → 'bed' (tempat = place, tidur = sleep → 'sleeping place')",
          "harga → 'HAR-ga' — price",
          "berapa → 'be-RA-pa' — how much",
        ],
      },
      {
        en: "Saya suka sofa yang warna abu-abu.",
        vi: "Tôi thích cái ghế sofa màu xám.",
        pronunciation_focus: [
          "sofa → SO-fa, 'ghế sofa/đi văng'",
          "yang → 'cái mà' (đại từ quan hệ, nối mô tả)",
          "abu-abu → 'màu xám' (từ láy; warna = màu)",
        ],
        pronunciation_focus_en: [
          "sofa → 'SOH-fa' — sofa / couch",
          "yang → 'the one that' (relative pronoun, links a description)",
          "abu-abu → 'grey' (reduplication; warna = colour)",
        ],
      },
      {
        en: "Tolong antar lemari ini ke rumah saya.",
        vi: "Làm ơn giao cái tủ này đến nhà tôi.",
        pronunciation_focus: [
          "antar → AN-tar, 'giao/chở đến'",
          "ke rumah saya → 'đến nhà tôi' (ke = đến, hướng)",
          "tolong → TO-long, 'làm ơn' (nhờ lịch sự)",
        ],
        pronunciation_focus_en: [
          "antar → 'AN-tar' — to deliver / take to",
          "ke rumah saya → 'to my house' (ke = to, directional)",
          "tolong → 'TOH-long' — please (polite request)",
        ],
      },
    ],
    cultural_notes_vi:
      "Mua nội thất ('mebel' hoặc 'furnitur') ở Indonesia: chuỗi lớn có IKEA (giá bình dân, tự lắp ráp), Informa, ACE Hardware; còn 'toko mebel' truyền thống thường bán đồ gỗ đặt làm. Indonesia nổi tiếng thế giới về đồ gỗ — đặc biệt 'kayu jati' (gỗ tếch) từ Jepara (Trung Java), trung tâm thủ công mộc. Đồ gỗ jati bền, đắt, được ưa chuộng. Từ vựng nền: meja (bàn), kursi (ghế), lemari (tủ), tempat tidur (giường), sofa, rak (kệ). Nhớ: tính từ (màu, chất liệu) đứng SAU danh từ.",
    cultural_notes_en:
      "Buying furniture ('mebel' or 'furnitur') in Indonesia: big chains include IKEA (affordable, flat-pack), Informa, ACE Hardware; traditional 'toko mebel' often sell custom-made wooden pieces. Indonesia is world-famous for woodwork — especially 'kayu jati' (teak) from Jepara (Central Java), the carpentry capital. Teak furniture is durable, pricey, and prized. Core vocabulary: meja (table), kursi (chair), lemari (cupboard), tempat tidur (bed), sofa, rak (shelf). Remember: adjectives (colour, material) come AFTER the noun.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhiều tên đồ nội thất là từ ghép trong suốt — 'tempat tidur' = 'chỗ + ngủ' = giường; 'ruang tamu' = 'phòng + khách' = phòng khách. Dễ đoán nghĩa khi tách ra. 'Yang' = 'cái mà' nối mô tả: 'sofa yang warna abu-abu' = ghế sofa (mà) màu xám. Màu láy: abu-abu (xám). 'Terbuat dari' = làm bằng (chất liệu): kayu (gỗ), besi (sắt), plastik (nhựa), kaca (kính). Hỏi giá: 'Berapa harga…?'; nhờ giao: 'Tolong antar … ke rumah saya.' Tính từ luôn đứng SAU danh từ — ngược với tiếng Anh nhưng quen với người Việt.",
    tip_advice_en:
      "Tip for Vietnamese speakers: many furniture names are transparent compounds — 'tempat tidur' = 'place + sleep' = bed; 'ruang tamu' = 'room + guest' = living room. Easy to parse once split. 'Yang' = 'the one that', linking a description: 'sofa yang warna abu-abu' = the grey sofa. Reduplicated colour: abu-abu (grey). 'Terbuat dari' = made of: kayu (wood), besi (iron), plastik (plastic), kaca (glass). Ask price: 'Berapa harga…?'; request delivery: 'Tolong antar … ke rumah saya.' Adjectives always come AFTER the noun — like Vietnamese, unlike English.",
    vocabulary: [
      { word: "mebel / furnitur", en: "furniture", vi: "nội thất / đồ gỗ", pos: "noun", pronunciation_vi: "ME-bel / fur-ni-TUR", pronunciation_en: "MEH-bel / foor-nee-TOOR" },
      { word: "meja", en: "table", vi: "bàn", pos: "noun", pronunciation_vi: "ME-ja", pronunciation_en: "MEH-ja" },
      { word: "kursi", en: "chair", vi: "ghế", pos: "noun", pronunciation_vi: "KUR-si", pronunciation_en: "KOOR-see" },
      { word: "lemari", en: "cupboard / wardrobe", vi: "tủ", pos: "noun", pronunciation_vi: "le-MA-ri", pronunciation_en: "le-MA-ree" },
      { word: "tempat tidur", en: "bed", vi: "giường", pos: "noun", pronunciation_vi: "tem-PAT TI-dur", pronunciation_en: "tem-PAT TEE-door" },
      { word: "sofa", en: "sofa / couch", vi: "ghế sofa", pos: "noun", pronunciation_vi: "SO-fa", pronunciation_en: "SOH-fa" },
      { word: "kayu jati", en: "teak wood", vi: "gỗ tếch", pos: "noun", pronunciation_vi: "KA-yu JA-ti", pronunciation_en: "KA-yoo JA-tee" },
      { word: "rak", en: "shelf / rack", vi: "kệ / giá", pos: "noun", pronunciation_vi: "rak", pronunciation_en: "rak" },
      { word: "abu-abu", en: "grey", vi: "màu xám", pos: "adj.", pronunciation_vi: "A-bu A-bu", pronunciation_en: "A-boo A-boo" },
    ],
    dialogue: [
      { speaker: "Pembeli", text: "Selamat siang. Saya mau beli meja dan kursi baru.", vi: "Chào buổi trưa. Tôi muốn mua bàn và ghế mới.", en: "Good afternoon. I'd like to buy a new table and chairs." },
      { speaker: "Penjual", text: "Silakan. Yang ini terbuat dari kayu jati, awet sekali.", vi: "Mời anh. Cái này làm bằng gỗ tếch, rất bền.", en: "Please. This one is made of teak, very durable." },
      { speaker: "Pembeli", text: "Bagus. Berapa harganya? Dan ada sofa warna abu-abu?", vi: "Đẹp đấy. Giá bao nhiêu? Và có ghế sofa màu xám không?", en: "Nice. How much is it? And do you have a grey sofa?" },
      { speaker: "Penjual", text: "Ada. Nanti tolong saya antar semua ke rumah Bapak, ya.", vi: "Có ạ. Lát tôi sẽ giao tất cả đến nhà anh nhé.", en: "We do. I'll deliver everything to your house later." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nội thất còn thiếu:",
        instruction_en: "Fill in the missing furniture word:",
        items: [
          { prompt: "Saya mau beli ___ dan kursi baru. (bàn)", answer: "meja", options: ["meja", "muka", "malam"] },
          { prompt: "___ ini terbuat dari kayu jati. (tủ)", answer: "Lemari", options: ["Lemari", "Lampu", "Lantai"] },
          { prompt: "Berapa harga ___ ini? (giường)", answer: "tempat tidur", options: ["tempat tidur", "tempat sampah", "tempat parkir"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kursi", answer: "ghế" },
          { prompt: "lemari", answer: "tủ" },
          { prompt: "tempat tidur", answer: "giường" },
          { prompt: "kayu jati", answer: "gỗ tếch" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mua bàn và ghế mới.", answer: "Saya mau beli meja dan kursi baru." },
          { prompt: "Cái tủ này làm bằng gỗ tếch.", answer: "Lemari ini terbuat dari kayu jati." },
          { prompt: "Làm ơn giao cái tủ này đến nhà tôi.", answer: "Tolong antar lemari ini ke rumah saya." },
        ],
      },
    ],
  },
  {
    id: "indonesian_home_measuring_choosing",
    level: "A2",
    category: "home-furniture",
    title_vi: "Đo đạc và chọn lựa — kích thước, màu sắc, vừa phòng",
    title_en: "Measuring and choosing — size, colour, fitting the room",
    sentences: [
      {
        en: "Lemari ini terlalu besar untuk kamar saya.",
        vi: "Cái tủ này quá lớn so với phòng tôi.",
        pronunciation_focus: [
          "terlalu → ter-LA-lu, 'quá/quá mức'",
          "besar → be-SAR, 'lớn/to'; ngược kecil = nhỏ",
          "kamar → KA-mar, 'phòng (ngủ)'",
        ],
        pronunciation_focus_en: [
          "terlalu → 'ter-LA-loo' — too / excessively",
          "besar → 'be-SAR' — big; opposite 'kecil' = small",
          "kamar → 'KA-mar' — (bed)room",
        ],
      },
      {
        en: "Berapa ukuran meja ini? Panjang dan lebarnya?",
        vi: "Bàn này kích thước bao nhiêu? Dài và rộng?",
        pronunciation_focus: [
          "ukuran → u-KU-ran, 'kích thước/cỡ' (gốc ukur = đo)",
          "panjang → PAN-jang, 'dài/chiều dài'",
          "lebar → LE-bar, 'rộng/chiều rộng'",
        ],
        pronunciation_focus_en: [
          "ukuran → 'oo-KOO-ran' — size / measurement (root 'ukur' = to measure)",
          "panjang → 'PAN-jang' — long / length",
          "lebar → 'LE-bar' — wide / width",
        ],
      },
      {
        en: "Apakah sofa ini muat di ruang tamu?",
        vi: "Cái sofa này có vừa phòng khách không?",
        pronunciation_focus: [
          "apakah → A-pa-kah, mở đầu câu hỏi có/không (trang trọng)",
          "muat → MU-at, 'vừa/chứa được'",
          "ruang tamu → 'phòng khách' (ruang = phòng, tamu = khách)",
        ],
        pronunciation_focus_en: [
          "apakah → 'A-pa-kah' — opens a yes/no question (formal)",
          "muat → 'MOO-at' — to fit / hold",
          "ruang tamu → 'living room' (ruang = room, tamu = guest)",
        ],
      },
      {
        en: "Saya lebih suka warna yang lebih terang.",
        vi: "Tôi thích màu sáng hơn.",
        pronunciation_focus: [
          "lebih suka → 'thích hơn' (lebih = hơn)",
          "warna → WAR-na, 'màu sắc'",
          "terang → te-RANG, 'sáng'; ngược gelap = tối",
        ],
        pronunciation_focus_en: [
          "lebih suka → 'prefer' (lebih = more)",
          "warna → 'WAR-na' — colour",
          "terang → 'te-RANG' — bright; opposite 'gelap' = dark",
        ],
      },
      {
        en: "Tolong ukur dulu sebelum membeli.",
        vi: "Làm ơn đo trước khi mua.",
        pronunciation_focus: [
          "ukur → U-kur, 'đo' (động từ gốc)",
          "dulu → DU-lu, 'trước (đã)' (làm việc gì trước)",
          "sebelum → se-BE-lum, 'trước khi'",
        ],
        pronunciation_focus_en: [
          "ukur → 'OO-koor' — to measure (the root verb)",
          "dulu → 'DOO-loo' — first / beforehand",
          "sebelum → 'se-BE-loom' — before",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi chọn nội thất, người Indonesia chú ý 'ukuran' (kích thước) để đồ 'muat' (vừa) với phòng. Đơn vị đo: meter (mét), sentimeter (cm). Các phòng trong nhà: ruang tamu (phòng khách), kamar tidur (phòng ngủ), dapur (bếp), kamar mandi (phòng tắm), ruang makan (phòng ăn). Nhà Indonesia thường có 'teras' (hiên) và đôi khi 'taman' (vườn). Phong cách ('gaya') phổ biến: minimalis (tối giản), modern, klasik, dan rustic. Đo trước khi mua ('ukur dulu sebelum membeli') là lời khuyên kinh điển để tránh đồ không vừa.",
    cultural_notes_en:
      "When choosing furniture, Indonesians check the 'ukuran' (size) so a piece will 'muat' (fit) the room. Units: meter, sentimeter (cm). Rooms: ruang tamu (living room), kamar tidur (bedroom), dapur (kitchen), kamar mandi (bathroom), ruang makan (dining room). Indonesian homes often have a 'teras' (porch) and sometimes a 'taman' (garden). Popular styles ('gaya'): minimalis, modern, klasik, rustic. 'Ukur dulu sebelum membeli' (measure first before buying) is the classic advice to avoid pieces that don't fit.",
    tip_advice_vi:
      "Mẹo cho người Việt: cặp kích thước cần thuộc — panjang (dài) ↔ lebar (rộng) ↔ tinggi (cao). 'Ukuran' là danh từ (cỡ), 'ukur' là động từ (đo) — gốc + tiền tố me- thành 'mengukur'. 'Terlalu' = quá (mức không mong muốn): terlalu besar (quá to), terlalu mahal (quá đắt). 'Muat' = vừa/chứa được — câu hỏi rất hữu ích: 'Apakah … muat?' (Cái … có vừa không?). So sánh: 'lebih suka' = thích hơn, 'lebih terang' = sáng hơn. Cặp màu: terang (sáng) ↔ gelap (tối). 'Dulu' đặt sau động từ = làm gì 'trước đã': 'ukur dulu' (đo trước đã).",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the dimension trio — panjang (length) ↔ lebar (width) ↔ tinggi (height). 'Ukuran' is the noun (size), 'ukur' the verb (measure) — with 'me-' it becomes 'mengukur'. 'Terlalu' = too (undesirably): terlalu besar (too big), terlalu mahal (too expensive). 'Muat' = to fit/hold — handy question: 'Apakah … muat?' (Does … fit?). Comparison: 'lebih suka' = prefer, 'lebih terang' = brighter. Colour pair: terang (bright) ↔ gelap (dark). 'Dulu' after a verb = do it 'first': 'ukur dulu' (measure first).",
    vocabulary: [
      { word: "ukuran", en: "size / measurement", vi: "kích thước / cỡ", pos: "noun", pronunciation_vi: "u-KU-ran", pronunciation_en: "oo-KOO-ran" },
      { word: "panjang", en: "long / length", vi: "dài / chiều dài", pos: "adj./noun", pronunciation_vi: "PAN-jang", pronunciation_en: "PAN-jang" },
      { word: "lebar", en: "wide / width", vi: "rộng / chiều rộng", pos: "adj./noun", pronunciation_vi: "LE-bar", pronunciation_en: "LE-bar" },
      { word: "tinggi", en: "tall / height", vi: "cao / chiều cao", pos: "adj./noun", pronunciation_vi: "TING-gi", pronunciation_en: "TEENG-gee" },
      { word: "muat", en: "to fit / hold", vi: "vừa / chứa được", pos: "verb", pronunciation_vi: "MU-at", pronunciation_en: "MOO-at" },
      { word: "ruang tamu", en: "living room", vi: "phòng khách", pos: "noun", pronunciation_vi: "RU-ang TA-mu", pronunciation_en: "ROO-ang TA-moo" },
      { word: "kamar", en: "room / bedroom", vi: "phòng", pos: "noun", pronunciation_vi: "KA-mar", pronunciation_en: "KA-mar" },
      { word: "warna", en: "colour", vi: "màu sắc", pos: "noun", pronunciation_vi: "WAR-na", pronunciation_en: "WAR-na" },
      { word: "terang", en: "bright", vi: "sáng", pos: "adj.", pronunciation_vi: "te-RANG", pronunciation_en: "te-RANG" },
    ],
    dialogue: [
      { speaker: "Pembeli", text: "Mas, berapa ukuran lemari ini? Panjang dan lebarnya?", vi: "Anh ơi, cái tủ này kích thước bao nhiêu? Dài và rộng?", en: "Excuse me, what's the size of this cupboard? Length and width?" },
      { speaker: "Penjual", text: "Panjang dua meter, lebar enam puluh sentimeter, Bu.", vi: "Dài hai mét, rộng sáu mươi xăng-ti-mét ạ.", en: "Two meters long, sixty centimeters wide, ma'am." },
      { speaker: "Pembeli", text: "Wah, terlalu besar untuk kamar saya. Apakah ada yang lebih kecil?", vi: "Ồ, quá to so với phòng tôi. Có cái nào nhỏ hơn không?", en: "Oh, too big for my room. Is there a smaller one?" },
      { speaker: "Penjual", text: "Ada, yang warna terang ini lebih kecil. Sebaiknya ukur dulu kamarnya, ya.", vi: "Có, cái màu sáng này nhỏ hơn. Tốt nhất đo phòng trước nhé.", en: "Yes, this bright-coloured one is smaller. Better measure your room first." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đo đạc/chọn lựa còn thiếu:",
        instruction_en: "Fill in the missing measuring/choosing word:",
        items: [
          { prompt: "Lemari ini ___ besar untuk kamar saya. (quá)", answer: "terlalu", options: ["terlalu", "tetapi", "tentang"] },
          { prompt: "Apakah sofa ini ___ di ruang tamu? (vừa)", answer: "muat", options: ["muat", "mahal", "macet"] },
          { prompt: "Tolong ___ dulu sebelum membeli. (đo)", answer: "ukur", options: ["ukur", "antar", "tutup"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "ukuran", answer: "kích thước" },
          { prompt: "panjang", answer: "dài" },
          { prompt: "muat", answer: "vừa / chứa được" },
          { prompt: "ruang tamu", answer: "phòng khách" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cái tủ này quá lớn so với phòng tôi.", answer: "Lemari ini terlalu besar untuk kamar saya." },
          { prompt: "Cái sofa này có vừa phòng khách không?", answer: "Apakah sofa ini muat di ruang tamu?" },
          { prompt: "Tôi thích màu sáng hơn.", answer: "Saya lebih suka warna yang lebih terang." },
        ],
      },
    ],
  },
  {
    id: "indonesian_home_renovation_decorating",
    level: "B1",
    category: "home-furniture",
    title_vi: "Sửa nhà và trang trí — sơn, lắp đặt, thuê thợ",
    title_en: "Renovation and decorating — painting, installing, hiring help",
    sentences: [
      {
        en: "Saya ingin merenovasi rumah dan mengecat dindingnya.",
        vi: "Tôi muốn sửa lại nhà và sơn tường.",
        pronunciation_focus: [
          "merenovasi → me-re-no-VA-si, 'sửa/cải tạo' (gốc renovasi)",
          "mengecat → me-nge-CHAT, 'sơn' (gốc cat = sơn, 'c' đọc 'ch')",
          "dinding → DIN-ding, 'tường/vách'",
        ],
        pronunciation_focus_en: [
          "merenovasi → 'me-re-no-VA-see' — to renovate (root 'renovasi')",
          "mengecat → 'me-nge-CHAT' — to paint (root 'cat', 'c' = 'ch')",
          "dinding → 'DEEN-deeng' — wall",
        ],
      },
      {
        en: "Saya mau memasang lampu baru di ruang tamu.",
        vi: "Tôi muốn lắp đèn mới ở phòng khách.",
        pronunciation_focus: [
          "memasang → me-ma-SANG, 'lắp/gắn/đặt' (gốc pasang)",
          "lampu → LAM-pu, 'đèn'",
          "di ruang tamu → 'ở phòng khách' (di = ở, tĩnh)",
        ],
        pronunciation_focus_en: [
          "memasang → 'me-ma-SANG' — to install / fit (root 'pasang')",
          "lampu → 'LAM-poo' — lamp / light",
          "di ruang tamu → 'in the living room' (di = static 'in')",
        ],
      },
      {
        en: "Saya akan memanggil tukang untuk memperbaiki atap.",
        vi: "Tôi sẽ gọi thợ đến sửa mái nhà.",
        pronunciation_focus: [
          "tukang → TU-kang, 'thợ (tay nghề)'; tukang cat = thợ sơn",
          "memperbaiki → mem-per-ba-I-ki, 'sửa chữa' (gốc baik = tốt)",
          "atap → A-tap, 'mái nhà'",
        ],
        pronunciation_focus_en: [
          "tukang → 'TOO-kang' — handyman / tradesman; tukang cat = painter",
          "memperbaiki → 'mem-per-ba-EE-kee' — to repair (root 'baik' = good)",
          "atap → 'A-tap' — roof",
        ],
      },
      {
        en: "Gaya minimalis sedang populer di kalangan anak muda.",
        vi: "Phong cách tối giản đang thịnh hành trong giới trẻ.",
        pronunciation_focus: [
          "gaya → GA-ya, 'phong cách/kiểu'",
          "minimalis → mi-ni-ma-LIS, 'tối giản' (mượn)",
          "kalangan anak muda → 'giới trẻ' (kalangan = giới, anak muda = người trẻ)",
        ],
        pronunciation_focus_en: [
          "gaya → 'GA-ya' — style",
          "minimalis → 'mee-nee-ma-LEES' — minimalist (loanword)",
          "kalangan anak muda → 'among young people' (kalangan = circle, anak muda = youth)",
        ],
      },
      {
        en: "Sebaiknya kita pilih warna netral supaya terlihat luas.",
        vi: "Tốt nhất ta nên chọn màu trung tính để trông rộng rãi.",
        pronunciation_focus: [
          "pilih → PI-lih, 'chọn/lựa'",
          "netral → NE-tral, 'trung tính' (màu)",
          "terlihat luas → 'trông rộng' (terlihat = trông có vẻ, luas = rộng rãi)",
        ],
        pronunciation_focus_en: [
          "pilih → 'PEE-leeh' — to choose",
          "netral → 'NE-tral' — neutral (colour)",
          "terlihat luas → 'looks spacious' (terlihat = appears, luas = spacious)",
        ],
      },
    ],
    cultural_notes_vi:
      "Sửa nhà ('renovasi') ở Indonesia thường thuê 'tukang' — thợ tay nghề: tukang bangunan (thợ xây), tukang cat (thợ sơn), tukang kayu (thợ mộc), tukang listrik (thợ điện), tukang ledeng (thợ nước). Người ta hay thuê theo ngày ('harian') hoặc khoán ('borongan'). Trang trí nội thất ('dekorasi interior') chuộng phong cách 'minimalis' và 'industrial' trong giới trẻ thành thị; nhà truyền thống dùng nhiều gỗ jati và đồ chạm khắc. Mẹo phổ biến: chọn 'warna netral' (màu trung tính: putih/trắng, krem/kem, abu-abu/xám) để phòng trông 'luas' (rộng). Động từ chủ động dùng nhiều tiền tố me-: mengecat (sơn), memasang (lắp), memperbaiki (sửa).",
    cultural_notes_en:
      "Home renovation ('renovasi') in Indonesia usually means hiring a 'tukang' — a tradesman: tukang bangunan (builder), tukang cat (painter), tukang kayu (carpenter), tukang listrik (electrician), tukang ledeng (plumber). They're hired by the day ('harian') or by contract ('borongan'). Interior decorating ('dekorasi interior') favors 'minimalis' and 'industrial' styles among urban youth; traditional homes use lots of teak and carved pieces. Common tip: pick 'warna netral' (neutral colours: putih/white, krem/cream, abu-abu/grey) to make a room look 'luas' (spacious). Active verbs use the 'me-' prefix heavily: mengecat (paint), memasang (install), memperbaiki (repair).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'tukang + việc' = thợ chuyên việc đó — tukang cat (thợ sơn), tukang kayu (thợ mộc), tukang listrik (thợ điện). Rất dễ tạo từ. Động từ sửa nhà đều dùng tiền tố me- (chủ động): cat → mengecat (sơn), pasang → memasang (lắp), perbaiki → memperbaiki (sửa). Khi đọc biển hiệu/hướng dẫn hay gặp dạng bị động di-: dicat (được sơn), dipasang (được lắp). 'Terlihat' = trông có vẻ (terlihat luas = trông rộng, terlihat mahal = trông đắt tiền). 'Sebaiknya' = tốt nhất nên (lời khuyên lịch sự). Phân biệt 'gaya' (phong cách) với 'gaja'… không có — chỉ cần nhớ gaya = style.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'tukang + task' = the tradesman for that job — tukang cat (painter), tukang kayu (carpenter), tukang listrik (electrician). Very productive. Renovation verbs all take the 'me-' (active) prefix: cat → mengecat (paint), pasang → memasang (install), perbaiki → memperbaiki (repair). On signs/instructions you'll often see the passive 'di-' form: dicat (gets painted), dipasang (gets installed). 'Terlihat' = appears/looks (terlihat luas = looks spacious, terlihat mahal = looks expensive). 'Sebaiknya' = it's best to (polite advice). Just remember 'gaya' = style.",
    vocabulary: [
      { word: "renovasi", en: "renovation", vi: "sửa chữa / cải tạo", pos: "noun", pronunciation_vi: "re-no-VA-si", pronunciation_en: "re-no-VA-see" },
      { word: "mengecat", en: "to paint", vi: "sơn", pos: "verb", pronunciation_vi: "me-nge-CHAT", pronunciation_en: "me-nge-CHAT" },
      { word: "dinding", en: "wall", vi: "tường / vách", pos: "noun", pronunciation_vi: "DIN-ding", pronunciation_en: "DEEN-deeng" },
      { word: "memasang", en: "to install / fit", vi: "lắp / gắn", pos: "verb", pronunciation_vi: "me-ma-SANG", pronunciation_en: "me-ma-SANG" },
      { word: "tukang", en: "tradesman / handyman", vi: "thợ", pos: "noun", pronunciation_vi: "TU-kang", pronunciation_en: "TOO-kang" },
      { word: "memperbaiki", en: "to repair", vi: "sửa chữa", pos: "verb", pronunciation_vi: "mem-per-ba-I-ki", pronunciation_en: "mem-per-ba-EE-kee" },
      { word: "gaya", en: "style", vi: "phong cách / kiểu", pos: "noun", pronunciation_vi: "GA-ya", pronunciation_en: "GA-ya" },
      { word: "netral", en: "neutral", vi: "trung tính", pos: "adj.", pronunciation_vi: "NE-tral", pronunciation_en: "NE-tral" },
      { word: "luas", en: "spacious / wide", vi: "rộng rãi", pos: "adj.", pronunciation_vi: "LU-as", pronunciation_en: "LOO-as" },
    ],
    dialogue: [
      { speaker: "Pemilik rumah", text: "Saya ingin merenovasi rumah dan mengecat dinding ruang tamu.", vi: "Tôi muốn sửa lại nhà và sơn tường phòng khách.", en: "I want to renovate the house and paint the living-room walls." },
      { speaker: "Tukang", text: "Baik, Pak. Mau warna apa? Sekarang gaya minimalis lagi populer.", vi: "Vâng anh. Anh muốn màu gì? Giờ phong cách tối giản đang thịnh.", en: "Alright, sir. What colour? Minimalist style is popular now." },
      { speaker: "Pemilik rumah", text: "Sebaiknya warna netral supaya ruangan terlihat luas.", vi: "Tốt nhất chọn màu trung tính để phòng trông rộng rãi.", en: "Better a neutral colour so the room looks spacious." },
      { speaker: "Tukang", text: "Setuju. Nanti saya juga pasang lampu baru dan perbaiki atap yang bocor.", vi: "Đồng ý. Lát tôi cũng lắp đèn mới và sửa mái nhà bị dột.", en: "Agreed. I'll also install new lights and fix the leaking roof." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ sửa nhà/trang trí còn thiếu:",
        instruction_en: "Fill in the missing renovation/decorating word:",
        items: [
          { prompt: "Saya ingin merenovasi rumah dan ___ dindingnya. (sơn)", answer: "mengecat", options: ["mengecat", "menonton", "membaca"] },
          { prompt: "Saya akan memanggil ___ untuk memperbaiki atap. (thợ)", answer: "tukang", options: ["tukang", "tamu", "tukar"] },
          { prompt: "Pilih warna netral supaya terlihat ___. (rộng)", answer: "luas", options: ["luas", "lama", "lupa"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "mengecat", answer: "sơn" },
          { prompt: "dinding", answer: "tường" },
          { prompt: "tukang", answer: "thợ" },
          { prompt: "memperbaiki", answer: "sửa chữa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn sửa lại nhà và sơn tường.", answer: "Saya ingin merenovasi rumah dan mengecat dindingnya." },
          { prompt: "Tôi sẽ gọi thợ đến sửa mái nhà.", answer: "Saya akan memanggil tukang untuk memperbaiki atap." },
          { prompt: "Tốt nhất ta nên chọn màu trung tính để trông rộng rãi.", answer: "Sebaiknya kita pilih warna netral supaya terlihat luas." },
        ],
      },
    ],
  },
];

export default furnitureDecoratingLessons;
