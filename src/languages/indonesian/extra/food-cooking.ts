// src/languages/indonesian/extra/food-cooking.ts
//
// Indonesian food & cooking survival pack for Vietnamese learners.
// Covers: shopping at the traditional market (pasar) for spices and produce,
// cooking iconic dishes (rendang, sambal, nasi goreng) with kitchen verbs, and
// describing taste / spice level. Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the Indonesian pack has no sibling lessons.ts registry yet
// (A7 owns it) — this file is self-contained on purpose. Types are NOT exported
// and the lesson array uses a unique name so a future barrel `export *` cannot
// collide with the sibling extra packs.
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

export const foodCookingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_market_shopping",
    level: "A1",
    category: "food_cooking",
    title_vi: "Đi chợ — mua rau, gia vị và trả giá",
    title_en: "At the market — buying produce, spices and haggling",
    sentences: [
      {
        en: "Berapa harga cabai satu kilo?",
        vi: "Ớt một ký giá bao nhiêu?",
        pronunciation_focus: [
          "berapa harga → 'giá bao nhiêu' — câu hỏi giá chuẩn ở chợ",
          "cabai → cha-BAI, 'ớt' ('c' luôn đọc 'ch')",
          "satu kilo → 'một ký'; số đứng TRƯỚC đơn vị, không có loại từ phức tạp",
        ],
        pronunciation_focus_en: [
          "berapa harga → 'how much (the) price' — the standard market question",
          "cabai → 'cha-BYE' — chili; 'c' is always 'ch'",
          "satu kilo → 'one kilo'; the number precedes the unit, no fancy classifiers",
        ],
      },
      {
        en: "Boleh kurang sedikit, Bu?",
        vi: "Bớt một chút được không cô?",
        pronunciation_focus: [
          "boleh → BÔ-léh, 'được/có thể' — xin phép, hỏi giảm giá",
          "kurang → KU-rang, 'bớt/thiếu'",
          "Bu → gọi phụ nữ lớn tuổi (Ibu); Pak gọi đàn ông (Bapak)",
        ],
        pronunciation_focus_en: [
          "boleh → 'BOH-leh' — 'may I / is it allowed' — used to ask for a discount",
          "kurang → 'KOO-rang' — less / reduce",
          "Bu → address for an older woman (short for Ibu); Pak for a man (Bapak)",
        ],
      },
      {
        en: "Saya mau beli bawang merah dan bawang putih.",
        vi: "Tôi muốn mua hành tím và tỏi.",
        pronunciation_focus: [
          "mau beli → 'muốn mua' — hai động từ liền nhau, không chia",
          "bawang merah → 'hành đỏ' = hành tím (merah = đỏ)",
          "bawang putih → 'hành trắng' = tỏi (putih = trắng)",
        ],
        pronunciation_focus_en: [
          "mau beli → 'want (to) buy' — two bare verbs in a row, no conjugation",
          "bawang merah → 'red onion' = shallot (merah = red)",
          "bawang putih → 'white onion' = garlic (putih = white)",
        ],
      },
      {
        en: "Tomatnya masih segar?",
        vi: "Cà chua còn tươi không?",
        pronunciation_focus: [
          "tomatnya → 'cà chua ấy/đó' — hậu tố -nya làm rõ vật đang nói",
          "masih → MA-sih, 'vẫn/còn'",
          "segar → SE-gar, 'tươi'",
        ],
        pronunciation_focus_en: [
          "tomatnya → 'the tomato(es)' — suffix '-nya' marks a known/definite item",
          "masih → 'MA-sih' — still",
          "segar → 'SEH-gar' — fresh",
        ],
      },
      {
        en: "Totalnya berapa semua?",
        vi: "Tổng cộng tất cả bao nhiêu?",
        pronunciation_focus: [
          "totalnya → 'tổng số đó' (total + -nya)",
          "berapa → beu-RA-pa, 'bao nhiêu'",
          "semua → seu-MU-a, 'tất cả'",
        ],
        pronunciation_focus_en: [
          "totalnya → 'the total' (total + '-nya')",
          "berapa → 'be-RA-pa' — how much/many",
          "semua → 'se-MOO-a' — all",
        ],
      },
    ],
    cultural_notes_vi:
      "Chợ truyền thống Indonesia gọi là 'pasar'. Trả giá ('tawar-menawar') là chuyện bình thường, thậm chí được mong đợi — nhưng nhẹ nhàng, vui vẻ. Gọi người bán bằng 'Bu' (phụ nữ) hoặc 'Pak' (đàn ông) để lịch sự. Đơn vị thường là 'kilo' (kg) hoặc 'ikat' (bó, cho rau). Bộ ba gia vị nền tảng: bawang merah (hành tím), bawang putih (tỏi), cabai (ớt).",
    cultural_notes_en:
      "An Indonesian traditional market is a 'pasar'. Haggling ('tawar-menawar') is normal, even expected — but keep it light and friendly. Address the vendor as 'Bu' (woman) or 'Pak' (man) to be polite. Common units are 'kilo' (kg) or 'ikat' (a bunch, for greens). The foundational spice trio: bawang merah (shallots), bawang putih (garlic), cabai (chili).",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Indonesia KHÔNG có loại từ rắc rối như tiếng Việt (con, cái, quả…) — chỉ cần 'số + danh từ': 'dua tomat' (hai cà chua), 'tiga cabai' (ba quả ớt). Ghép màu để nhớ rau củ: bawang MERAH (đỏ→hành tím), bawang PUTIH (trắng→tỏi). Học một câu trả giá vạn năng: 'Boleh kurang, Bu?'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian has NO tricky classifiers (unlike Vietnamese con/cái/quả) — just 'number + noun': 'dua tomat' (two tomatoes), 'tiga cabai' (three chilies). Learn produce by its color word: bawang MERAH (red→shallot), bawang PUTIH (white→garlic). Memorize one all-purpose haggle line: 'Boleh kurang, Bu?'.",
    vocabulary: [
      {
        word: "pasar",
        en: "market",
        vi: "chợ",
        pos: "noun",
        pronunciation_vi: "PA-sar",
        pronunciation_en: "PA-sar",
      },
      {
        word: "cabai",
        en: "chili",
        vi: "ớt",
        pos: "noun",
        pronunciation_vi: "cha-BAI",
        pronunciation_en: "cha-BYE",
      },
      {
        word: "bawang merah",
        en: "shallot",
        vi: "hành tím",
        pos: "noun",
        pronunciation_vi: "BA-wang ME-rah",
        pronunciation_en: "BA-wang MEH-rah",
      },
      {
        word: "bawang putih",
        en: "garlic",
        vi: "tỏi",
        pos: "noun",
        pronunciation_vi: "BA-wang PU-tih",
        pronunciation_en: "BA-wang POO-tih",
      },
      {
        word: "segar",
        en: "fresh",
        vi: "tươi",
        pos: "adjective",
        pronunciation_vi: "SE-gar",
        pronunciation_en: "SEH-gar",
      },
      {
        word: "murah",
        en: "cheap",
        vi: "rẻ",
        pos: "adjective",
        pronunciation_vi: "MU-rah",
        pronunciation_en: "MOO-rah",
      },
      {
        word: "mahal",
        en: "expensive",
        vi: "đắt",
        pos: "adjective",
        pronunciation_vi: "MA-hal",
        pronunciation_en: "MA-hal",
      },
      {
        word: "kilo",
        en: "kilogram",
        vi: "ký / kilôgam",
        pos: "noun",
        pronunciation_vi: "KI-lô",
        pronunciation_en: "KEE-loh",
      },
      {
        word: "sayur",
        en: "vegetable",
        vi: "rau",
        pos: "noun",
        pronunciation_vi: "SA-yur",
        pronunciation_en: "SA-yoor",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, berapa harga cabai satu kilo?",
        vi: "Cô ơi, ớt một ký giá bao nhiêu?",
        en: "Ma'am, how much is one kilo of chili?",
      },
      {
        speaker: "Penjual",
        text: "Empat puluh ribu, Mas. Masih segar semua.",
        vi: "Bốn mươi nghìn, em. Còn tươi hết.",
        en: "Forty thousand, young man. All still fresh.",
      },
      {
        speaker: "Pembeli",
        text: "Boleh kurang sedikit, Bu?",
        vi: "Bớt một chút được không cô?",
        en: "Can you make it a bit less, ma'am?",
      },
      {
        speaker: "Penjual",
        text: "Ya sudah, tiga puluh lima ribu. Mau berapa kilo?",
        vi: "Thôi được, ba mươi lăm nghìn. Lấy mấy ký?",
        en: "Alright, thirty-five thousand. How many kilos?",
      },
      {
        speaker: "Pembeli",
        text: "Setengah kilo saja. Terima kasih, Bu.",
        vi: "Nửa ký thôi. Cảm ơn cô.",
        en: "Just half a kilo. Thank you, ma'am.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đi chợ còn thiếu:",
        instruction_en: "Fill in the missing market word:",
        items: [
          {
            prompt: "Berapa ___ cabai satu kilo? (giá)",
            answer: "harga",
            options: ["harga", "hari", "harus"],
          },
          {
            prompt: "Boleh ___ sedikit, Bu? (bớt)",
            answer: "kurang",
            options: ["kurang", "kurus", "kuning"],
          },
          {
            prompt: "Tomatnya masih ___? (tươi)",
            answer: "segar",
            options: ["segar", "sabar", "sukar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bawang merah", answer: "hành tím" },
          { prompt: "bawang putih", answer: "tỏi" },
          { prompt: "murah", answer: "rẻ" },
          { prompt: "mahal", answer: "đắt" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Ớt một ký giá bao nhiêu?", answer: "Berapa harga cabai satu kilo?" },
          { prompt: "Tôi muốn mua tỏi.", answer: "Saya mau beli bawang putih." },
          { prompt: "Tổng cộng bao nhiêu?", answer: "Totalnya berapa?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_cooking_rendang_sambal",
    level: "A2",
    category: "food_cooking",
    title_vi: "Nấu ăn — rendang, sambal và động từ bếp núc",
    title_en: "Cooking — rendang, sambal and kitchen verbs",
    sentences: [
      {
        en: "Pertama, haluskan bumbu sampai lembut.",
        vi: "Đầu tiên, xay nhuyễn gia vị cho mịn.",
        pronunciation_focus: [
          "pertama → per-TA-ma, 'đầu tiên/thứ nhất'",
          "haluskan → 'làm cho nhuyễn' — gốc halus (mịn) + hậu tố -kan (làm cho)",
          "bumbu → BUM-bu, 'gia vị đã giã/xay' (khác rempah = gia vị khô)",
        ],
        pronunciation_focus_en: [
          "pertama → 'per-TA-ma' — first",
          "haluskan → 'make (it) smooth' — root 'halus' (fine) + suffix '-kan' (make/cause)",
          "bumbu → 'BOOM-boo' — the ground spice paste (vs. 'rempah' = dry whole spices)",
        ],
      },
      {
        en: "Tumis bumbu dengan minyak sampai harum.",
        vi: "Phi gia vị với dầu cho đến khi thơm.",
        pronunciation_focus: [
          "tumis → TU-mis, 'xào/phi (gia vị)'",
          "dengan → DENG-an, 'với/bằng'",
          "harum → HA-rum, 'thơm'",
        ],
        pronunciation_focus_en: [
          "tumis → 'TOO-mis' — to sauté / stir-fry (especially aromatics)",
          "dengan → 'DENG-an' — with / using",
          "harum → 'HA-room' — fragrant",
        ],
      },
      {
        en: "Masukkan daging dan santan, lalu masak dengan api kecil.",
        vi: "Cho thịt và nước cốt dừa vào, rồi nấu lửa nhỏ.",
        pronunciation_focus: [
          "masukkan → 'cho vào' — gốc masuk (vào) + -kan",
          "santan → SAN-tan, 'nước cốt dừa' — linh hồn của rendang",
          "api kecil → 'lửa nhỏ' (api = lửa, kecil = nhỏ)",
        ],
        pronunciation_focus_en: [
          "masukkan → 'put (it) in' — root 'masuk' (enter) + '-kan'",
          "santan → 'SAN-tan' — coconut milk; the soul of rendang",
          "api kecil → 'small fire' = low heat (api = fire, kecil = small)",
        ],
      },
      {
        en: "Aduk terus supaya tidak gosong.",
        vi: "Khuấy liên tục để không bị cháy khét.",
        pronunciation_focus: [
          "aduk → A-duk, 'khuấy/đảo'",
          "terus → teu-RUS, 'liên tục/tiếp tục'",
          "supaya → su-PA-ya, 'để/cho'; gosong = cháy khét",
        ],
        pronunciation_focus_en: [
          "aduk → 'A-dook' — to stir",
          "terus → 'te-ROOS' — continuously / keep going",
          "supaya → 'soo-PA-ya' — so that; gosong = burnt/scorched",
        ],
      },
      {
        en: "Sambal ini terlalu pedas untuk saya.",
        vi: "Sambal này cay quá đối với tôi.",
        pronunciation_focus: [
          "sambal → SAM-bal, tương ớt giã của Indonesia",
          "terlalu → ter-LA-lu, 'quá (mức)' — ter- + lalu",
          "pedas → peu-DAS, 'cay'",
        ],
        pronunciation_focus_en: [
          "sambal → 'SAM-bal' — Indonesia's pounded chili relish",
          "terlalu → 'ter-LA-loo' — too / excessively (ter- + lalu)",
          "pedas → 'pe-DAS' — spicy",
        ],
      },
    ],
    cultural_notes_vi:
      "Rendang (món bò om nước cốt dừa của người Minangkabau, Tây Sumatra) từng được bình chọn là món ăn ngon nhất thế giới. Bí quyết là nấu lửa nhỏ rất lâu cho nước cốt dừa (santan) cạn và thấm. 'Sambal' là tương ớt giã, có hàng trăm biến thể vùng miền. 'Bumbu' là hỗn hợp gia vị giã nhuyễn — nền tảng của hầu hết món Indonesia. Người Indonesia ăn rất cay; hỏi 'pedas atau tidak?' (cay hay không?) khi gọi món.",
    cultural_notes_en:
      "Rendang (the Minangkabau slow-cooked beef in coconut milk, from West Sumatra) has been voted the world's most delicious dish. The secret is very low heat for a long time until the coconut milk (santan) reduces and caramelizes. 'Sambal' is a pounded chili relish with hundreds of regional variants. 'Bumbu' is the ground spice paste — the base of most Indonesian dishes. Indonesians eat very spicy; expect 'pedas atau tidak?' (spicy or not?) when ordering.",
    tip_advice_vi:
      "Mẹo cho người Việt: hậu tố '-kan' biến tính từ/động từ thành 'làm cho…' — rất hệ thống trong công thức nấu ăn: halus→haluskan (làm nhuyễn), masuk→masukkan (cho vào), panas→panaskan (làm nóng). Học gốc + '-kan' là đọc được công thức. Mức cay tăng dần: tidak pedas → sedikit pedas → pedas → terlalu pedas (cay quá).",
    tip_advice_en:
      "Tip for Vietnamese speakers: the suffix '-kan' turns an adjective/verb into 'make/cause to…' — very systematic in recipes: halus→haluskan (grind fine), masuk→masukkan (put in), panas→panaskan (heat up). Learn root + '-kan' and you can read any recipe. Spice scale: tidak pedas (not spicy) → sedikit pedas → pedas → terlalu pedas (too spicy).",
    vocabulary: [
      {
        word: "tumis",
        en: "to sauté / stir-fry",
        vi: "xào / phi",
        pos: "verb",
        pronunciation_vi: "TU-mis",
        pronunciation_en: "TOO-mis",
      },
      {
        word: "rebus",
        en: "to boil",
        vi: "luộc / ninh",
        pos: "verb",
        pronunciation_vi: "RE-bus",
        pronunciation_en: "REH-boos",
      },
      {
        word: "goreng",
        en: "to fry",
        vi: "chiên / rán",
        pos: "verb",
        pronunciation_vi: "GÔ-reng",
        pronunciation_en: "GOH-reng",
      },
      {
        word: "santan",
        en: "coconut milk",
        vi: "nước cốt dừa",
        pos: "noun",
        pronunciation_vi: "SAN-tan",
        pronunciation_en: "SAN-tan",
      },
      {
        word: "bumbu",
        en: "spice paste / seasoning",
        vi: "gia vị (giã nhuyễn)",
        pos: "noun",
        pronunciation_vi: "BUM-bu",
        pronunciation_en: "BOOM-boo",
      },
      {
        word: "sambal",
        en: "chili relish",
        vi: "tương ớt giã",
        pos: "noun",
        pronunciation_vi: "SAM-bal",
        pronunciation_en: "SAM-bal",
      },
      {
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "peu-DAS",
        pronunciation_en: "pe-DAS",
      },
      {
        word: "manis",
        en: "sweet",
        vi: "ngọt",
        pos: "adjective",
        pronunciation_vi: "MA-nis",
        pronunciation_en: "MA-nis",
      },
      {
        word: "aduk",
        en: "to stir",
        vi: "khuấy / đảo",
        pos: "verb",
        pronunciation_vi: "A-duk",
        pronunciation_en: "A-dook",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Ayo, kita masak rendang hari ini. Sudah haluskan bumbunya?",
        vi: "Nào, hôm nay mình nấu rendang. Đã xay nhuyễn gia vị chưa?",
        en: "Come, let's cook rendang today. Have you ground the spice paste?",
      },
      {
        speaker: "Anak",
        text: "Sudah, Bu. Sekarang saya tumis sampai harum.",
        vi: "Rồi ạ, mẹ. Bây giờ con phi cho thơm.",
        en: "Yes, Mom. Now I'll sauté it until fragrant.",
      },
      {
        speaker: "Ibu",
        text: "Bagus. Masukkan daging dan santan, masak api kecil.",
        vi: "Tốt. Cho thịt và nước cốt dừa vào, nấu lửa nhỏ.",
        en: "Good. Add the meat and coconut milk, cook on low heat.",
      },
      {
        speaker: "Anak",
        text: "Berapa lama, Bu?",
        vi: "Bao lâu vậy mẹ?",
        en: "How long, Mom?",
      },
      {
        speaker: "Ibu",
        text: "Tiga jam, sambil diaduk supaya tidak gosong.",
        vi: "Ba tiếng, vừa nấu vừa khuấy để không bị cháy khét.",
        en: "Three hours, stirring it so it doesn't burn.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ bếp núc còn thiếu:",
        instruction_en: "Fill in the missing kitchen verb:",
        items: [
          {
            prompt: "Pertama, ___ bumbu sampai lembut. (xay nhuyễn)",
            answer: "haluskan",
            options: ["haluskan", "hangatkan", "hilangkan"],
          },
          {
            prompt: "___ bumbu dengan minyak sampai harum. (phi)",
            answer: "Tumis",
            options: ["Tumis", "Tutup", "Tunggu"],
          },
          {
            prompt: "___ daging dan santan. (cho vào)",
            answer: "Masukkan",
            options: ["Masukkan", "Matikan", "Mainkan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ / từ vị với nghĩa tiếng Việt:",
        instruction_en: "Match each verb / taste word with its meaning:",
        items: [
          { prompt: "goreng", answer: "chiên / rán" },
          { prompt: "rebus", answer: "luộc / ninh" },
          { prompt: "pedas", answer: "cay" },
          { prompt: "manis", answer: "ngọt" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Phi gia vị cho đến khi thơm.", answer: "Tumis bumbu sampai harum." },
          { prompt: "Khuấy liên tục để không bị cháy.", answer: "Aduk terus supaya tidak gosong." },
          { prompt: "Sambal này cay quá.", answer: "Sambal ini terlalu pedas." },
        ],
      },
    ],
  },
  {
    id: "indonesian_ordering_describing_food",
    level: "A2",
    category: "food_cooking",
    title_vi: "Gọi món và nói về hương vị ở quán",
    title_en: "Ordering and describing taste at an eatery",
    sentences: [
      {
        en: "Saya mau pesan nasi goreng satu porsi.",
        vi: "Tôi muốn gọi một phần cơm chiên.",
        pronunciation_focus: [
          "pesan → peu-SAN, 'gọi món/đặt'",
          "nasi goreng → 'cơm chiên' (nasi = cơm, goreng = chiên)",
          "satu porsi → 'một phần'; số trước đơn vị",
        ],
        pronunciation_focus_en: [
          "pesan → 'pe-SAN' — to order",
          "nasi goreng → 'fried rice' (nasi = rice, goreng = fried)",
          "satu porsi → 'one portion'; number before the unit",
        ],
      },
      {
        en: "Jangan terlalu pedas, ya.",
        vi: "Đừng cay quá nhé.",
        pronunciation_focus: [
          "jangan → JANG-an, 'đừng' — phủ định mệnh lệnh",
          "terlalu pedas → 'cay quá'",
          "ya cuối câu → 'nhé', làm mềm yêu cầu",
        ],
        pronunciation_focus_en: [
          "jangan → 'JANG-an' — 'don't' (negative imperative)",
          "terlalu pedas → 'too spicy'",
          "sentence-final 'ya' → softens the request, like 'okay?/please'",
        ],
      },
      {
        en: "Minumnya es teh manis, ya.",
        vi: "Đồ uống cho trà đá ngọt nhé.",
        pronunciation_focus: [
          "minumnya → 'đồ uống' (minum = uống + -nya)",
          "es teh manis → 'trà đá ngọt' (es = đá, teh = trà, manis = ngọt)",
          "es phát âm 'ès', không phải 'i-ét'",
        ],
        pronunciation_focus_en: [
          "minumnya → 'the drink' (minum = drink + '-nya')",
          "es teh manis → 'sweet iced tea' (es = ice, teh = tea, manis = sweet)",
          "es is said 'ess', not spelled out",
        ],
      },
      {
        en: "Makanannya enak sekali!",
        vi: "Món ăn ngon lắm!",
        pronunciation_focus: [
          "makanannya → 'món ăn (đó)' (makan→makanan = thức ăn, + -nya)",
          "enak → É-nak, 'ngon'",
          "sekali sau tính từ → 'rất/lắm': enak sekali = ngon lắm",
        ],
        pronunciation_focus_en: [
          "makanannya → 'the food' (makan→makanan = food, + '-nya')",
          "enak → 'EH-nak' — delicious / tasty",
          "'sekali' after an adjective → 'very': enak sekali = very tasty",
        ],
      },
      {
        en: "Bisa minta tambah sambal?",
        vi: "Cho xin thêm sambal được không?",
        pronunciation_focus: [
          "bisa → BI-sa, 'có thể/được'",
          "minta → MIN-ta, 'xin/yêu cầu'",
          "tambah → TAM-bah, 'thêm'",
        ],
        pronunciation_focus_en: [
          "bisa → 'BEE-sa' — can / able to",
          "minta → 'MIN-ta' — to ask for / request",
          "tambah → 'TAM-bah' — to add / more",
        ],
      },
    ],
    cultural_notes_vi:
      "Quán ăn bình dân gọi là 'warung'. Nasi goreng (cơm chiên) là món quốc dân, ăn bất cứ lúc nào kể cả sáng. 'Es teh manis' (trà đá ngọt) là đồ uống mặc định. Khi khen món ăn, nói 'Enak!' là người nấu rất vui. Để mềm yêu cầu, thêm 'ya' cuối câu. Mẫu lịch sự để xin: 'Bisa minta…?' (cho xin… được không?).",
    cultural_notes_en:
      "A casual eatery is a 'warung'. Nasi goreng (fried rice) is the national comfort dish, eaten any time including breakfast. 'Es teh manis' (sweet iced tea) is the default drink. Saying 'Enak!' to praise the food delights the cook. Soften any request with a final 'ya'. The polite request frame is 'Bisa minta…?' (could I please have…?).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'sekali' đặt SAU tính từ nghĩa là 'rất' (enak sekali = rất ngon), nhưng 'sekali' đứng riêng lại nghĩa 'một lần' — chú ý vị trí. Hậu tố '-nya' trên đồ ăn/đồ uống ('minumnya', 'makanannya') giống như mạo từ 'cái/món đó' — rất thông dụng khi gọi món. Phủ định mệnh lệnh dùng 'jangan', không phải 'tidak'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'sekali' AFTER an adjective means 'very' (enak sekali = very tasty), but 'sekali' alone means 'once' — mind the position. The '-nya' suffix on food/drink ('minumnya', 'makanannya') works like 'the' — very common when ordering. For negative commands use 'jangan', not 'tidak'.",
    vocabulary: [
      {
        word: "pesan",
        en: "to order",
        vi: "gọi món",
        pos: "verb",
        pronunciation_vi: "peu-SAN",
        pronunciation_en: "pe-SAN",
      },
      {
        word: "warung",
        en: "small eatery / food stall",
        vi: "quán ăn bình dân",
        pos: "noun",
        pronunciation_vi: "WA-rung",
        pronunciation_en: "WA-roong",
      },
      {
        word: "nasi goreng",
        en: "fried rice",
        vi: "cơm chiên",
        pos: "noun",
        pronunciation_vi: "NA-si GÔ-reng",
        pronunciation_en: "NA-see GOH-reng",
      },
      {
        word: "enak",
        en: "delicious / tasty",
        vi: "ngon",
        pos: "adjective",
        pronunciation_vi: "É-nak",
        pronunciation_en: "EH-nak",
      },
      {
        word: "minum",
        en: "drink",
        vi: "đồ uống / uống",
        pos: "noun / verb",
        pronunciation_vi: "MI-num",
        pronunciation_en: "MEE-noom",
      },
      {
        word: "es teh manis",
        en: "sweet iced tea",
        vi: "trà đá ngọt",
        pos: "noun",
        pronunciation_vi: "ès té MA-nis",
        pronunciation_en: "ess teh MA-nis",
      },
      {
        word: "tambah",
        en: "to add / more",
        vi: "thêm",
        pos: "verb",
        pronunciation_vi: "TAM-bah",
        pronunciation_en: "TAM-bah",
      },
      {
        word: "kenyang",
        en: "full (after eating)",
        vi: "no",
        pos: "adjective",
        pronunciation_vi: "keu-NYANG",
        pronunciation_en: "ke-NYANG",
      },
      {
        word: "asin",
        en: "salty",
        vi: "mặn",
        pos: "adjective",
        pronunciation_vi: "A-sin",
        pronunciation_en: "AH-sin",
      },
    ],
    dialogue: [
      {
        speaker: "Pelayan",
        text: "Mau pesan apa, Mas?",
        vi: "Anh muốn gọi gì ạ?",
        en: "What would you like to order, sir?",
      },
      {
        speaker: "Tamu",
        text: "Nasi goreng satu, jangan terlalu pedas, ya.",
        vi: "Một cơm chiên, đừng cay quá nhé.",
        en: "One fried rice, not too spicy, please.",
      },
      {
        speaker: "Pelayan",
        text: "Minumnya apa?",
        vi: "Đồ uống gì ạ?",
        en: "And to drink?",
      },
      {
        speaker: "Tamu",
        text: "Es teh manis. Oh, bisa minta tambah sambal?",
        vi: "Trà đá ngọt. À, cho xin thêm sambal được không?",
        en: "Sweet iced tea. Oh, could I have extra sambal?",
      },
      {
        speaker: "Pelayan",
        text: "Tentu. Ditunggu, ya.",
        vi: "Tất nhiên. Anh đợi chút nhé.",
        en: "Of course. Please wait a moment.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ gọi món còn thiếu:",
        instruction_en: "Fill in the missing ordering word:",
        items: [
          {
            prompt: "Saya mau ___ nasi goreng. (gọi món)",
            answer: "pesan",
            options: ["pesan", "pasar", "pulang"],
          },
          {
            prompt: "___ terlalu pedas, ya. (đừng)",
            answer: "Jangan",
            options: ["Jangan", "Jadi", "Juga"],
          },
          {
            prompt: "Makanannya ___ sekali! (ngon)",
            answer: "enak",
            options: ["enak", "enam", "entah"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ vị giác với nghĩa tiếng Việt:",
        instruction_en: "Match each taste word with its meaning:",
        items: [
          { prompt: "enak", answer: "ngon" },
          { prompt: "asin", answer: "mặn" },
          { prompt: "kenyang", answer: "no" },
          { prompt: "warung", answer: "quán ăn bình dân" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn gọi một phần cơm chiên.", answer: "Saya mau pesan nasi goreng satu porsi." },
          { prompt: "Món ăn ngon lắm!", answer: "Makanannya enak sekali!" },
          { prompt: "Cho xin thêm sambal được không?", answer: "Bisa minta tambah sambal?" },
        ],
      },
    ],
  },
];

export default foodCookingLessons;
