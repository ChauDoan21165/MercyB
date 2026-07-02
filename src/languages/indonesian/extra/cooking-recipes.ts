// src/languages/indonesian/extra/cooking-recipes.ts
//
// Indonesian recipe-following pack for Vietnamese learners.
// Distinct from the sibling food-cooking.ts (which covers market shopping,
// sambal/rendang spice prep, and ordering at a warung): THIS pack teaches how to
// READ AND FOLLOW a written recipe — the "bahan" (ingredients) list, the "cara
// membuat" (method) with ordered "langkah" (steps), and measurement words —
// worked through three classic dishes: gado-gado, soto ayam, and nasi uduk.
// Hand-crafted, no filler.
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

export const cookingRecipesLessons: IndonesianLesson[] = [
  {
    id: "indonesian_reading_a_recipe",
    level: "A2",
    category: "cooking_recipes",
    title_vi: "Đọc một công thức — nguyên liệu, cách làm và các bước",
    title_en: "Reading a recipe — ingredients, method and steps",
    sentences: [
      {
        en: "Resep ini untuk empat porsi.",
        vi: "Công thức này cho bốn phần ăn.",
        pronunciation_focus: [
          "resep → RE-sep, 'công thức (nấu ăn)'; cũng nghĩa 'đơn thuốc'",
          "untuk → 'cho/để'",
          "empat porsi → 'bốn phần'; số trước đơn vị",
        ],
        pronunciation_focus_en: [
          "resep → 'REH-sep' — recipe (also means a medical prescription)",
          "untuk → 'for'",
          "empat porsi → 'four portions'; number before the unit",
        ],
      },
      {
        en: "Bahan-bahan: dua butir telur, segenggam tauge, dan dua sendok kecap.",
        vi: "Nguyên liệu: hai quả trứng, một nắm giá đỗ, và hai thìa nước tương.",
        pronunciation_focus: [
          "bahan-bahan → 'các nguyên liệu' — lặp từ chỉ số nhiều",
          "butir / sendok → loại từ: butir (quả/viên), sendok (thìa)",
          "kecap → KÉ-chap, 'nước tương' (KHÔNG phải tương cà — false friend!)",
        ],
        pronunciation_focus_en: [
          "bahan-bahan → 'ingredients' — reduplication marks the plural",
          "butir / sendok → measure words: butir (for eggs/grains), sendok (spoon)",
          "kecap → 'KEH-chap' — soy sauce (NOT 'ketchup' — a classic false friend!)",
        ],
      },
      {
        en: "Cara membuat: pertama, rebus telur sampai matang.",
        vi: "Cách làm: đầu tiên, luộc trứng cho chín.",
        pronunciation_focus: [
          "cara membuat → 'cách làm' (cara = cách, membuat = làm/chế biến)",
          "rebus → RE-bus, 'luộc'",
          "sampai matang → 'cho đến khi chín' (matang = chín)",
        ],
        pronunciation_focus_en: [
          "cara membuat → 'how to make / method' (cara = way, membuat = to make)",
          "rebus → 'REH-boos' — to boil",
          "sampai matang → 'until cooked/done' (matang = ripe/cooked)",
        ],
      },
      {
        en: "Kedua, potong sayuran kecil-kecil.",
        vi: "Thứ hai, cắt rau nhỏ ra.",
        pronunciation_focus: [
          "kedua → keu-DU-a, 'thứ hai' (số thứ tự: ke- + dua)",
          "potong → PÔ-tong, 'cắt/thái'",
          "kecil-kecil → 'nhỏ nhỏ/thành miếng nhỏ' (lặp = mức độ)",
        ],
        pronunciation_focus_en: [
          "kedua → 'ke-DOO-a' — 'second' (ordinal: ke- + dua)",
          "potong → 'POH-tong' — to cut/slice",
          "kecil-kecil → 'into small pieces' (reduplication = manner/degree)",
        ],
      },
      {
        en: "Terakhir, sajikan selagi hangat.",
        vi: "Cuối cùng, dọn ra khi còn nóng.",
        pronunciation_focus: [
          "terakhir → ter-A-khir, 'cuối cùng'",
          "sajikan → 'dọn ra/bày món' (gốc saji + -kan)",
          "selagi hangat → 'khi còn ấm/nóng' (selagi = trong khi, hangat = ấm)",
        ],
        pronunciation_focus_en: [
          "terakhir → 'ter-A-kheer' — last / finally",
          "sajikan → 'serve (it)' (root 'saji' + '-kan')",
          "selagi hangat → 'while warm' (selagi = while, hangat = warm)",
        ],
      },
    ],
    cultural_notes_vi:
      "Công thức Indonesia ('resep') luôn có hai phần: 'Bahan' / 'Bahan-bahan' (nguyên liệu) rồi 'Cara membuat' (cách làm) đánh số bước. Số thứ tự dùng tiền tố 'ke-': pertama (1), kedua (2), ketiga (3)… và đóng bằng 'terakhir' (cuối cùng). Đơn vị đo phổ biến: 'sendok makan/sdm' (thìa canh), 'sendok teh/sdt' (thìa cà phê), 'gelas' (cốc), 'butir' (quả/viên), 'siung' (tép, cho tỏi). CẢNH BÁO false friend: 'kecap' = nước tương, KHÔNG phải ketchup; tương cà là 'saus tomat'.",
    cultural_notes_en:
      "Indonesian recipes ('resep') always have two parts: 'Bahan' / 'Bahan-bahan' (ingredients), then numbered 'Cara membuat' (method) steps. Ordinals use the 'ke-' prefix: pertama (1st), kedua (2nd), ketiga (3rd)… closing with 'terakhir' (last). Common measures: 'sendok makan/sdm' (tablespoon), 'sendok teh/sdt' (teaspoon), 'gelas' (cup/glass), 'butir' (for eggs/grains), 'siung' (clove, for garlic). FALSE-FRIEND WARNING: 'kecap' = soy sauce, NOT ketchup; tomato ketchup is 'saus tomat'.",
    tip_advice_vi:
      "Mẹo cho người Việt: số thứ tự = 'ke-' + số đếm, trừ 'pertama' (thứ nhất, đặc biệt): kedua, ketiga, keempat… Học chuỗi bước: pertama → kedua → ketiga → terakhir. Lặp từ tả mức độ/cách thức, KHÔNG phải số nhiều: 'potong kecil-kecil' (cắt nhỏ ra), 'aduk pelan-pelan' (khuấy từ từ). Nhớ false friend chí mạng: kecap = nước tương.",
    tip_advice_en:
      "Tip for Vietnamese speakers: ordinals = 'ke-' + cardinal, except 'pertama' (1st, irregular): kedua, ketiga, keempat… Learn the step chain: pertama → kedua → ketiga → terakhir. Reduplication here marks manner/degree, NOT plural: 'potong kecil-kecil' (cut into small bits), 'aduk pelan-pelan' (stir slowly). Burn in the killer false friend: kecap = soy sauce.",
    vocabulary: [
      {
        word: "resep",
        en: "recipe",
        vi: "công thức nấu ăn",
        pos: "noun",
        pronunciation_vi: "RE-sep",
        pronunciation_en: "REH-sep",
      },
      {
        word: "bahan",
        en: "ingredient(s)",
        vi: "nguyên liệu",
        pos: "noun",
        pronunciation_vi: "BA-han",
        pronunciation_en: "BA-han",
      },
      {
        word: "cara membuat",
        en: "method / how to make",
        vi: "cách làm",
        pos: "phrase",
        pronunciation_vi: "CHA-ra mem-BU-at",
        pronunciation_en: "CHA-ra mem-BOO-at",
      },
      {
        word: "langkah",
        en: "step",
        vi: "bước",
        pos: "noun",
        pronunciation_vi: "LANG-kah",
        pronunciation_en: "LANG-kah",
      },
      {
        word: "kecap",
        en: "soy sauce (NOT ketchup)",
        vi: "nước tương",
        pos: "noun",
        pronunciation_vi: "KÉ-chap",
        pronunciation_en: "KEH-chap",
      },
      {
        word: "matang",
        en: "cooked / ripe / done",
        vi: "chín",
        pos: "adjective",
        pronunciation_vi: "MA-tang",
        pronunciation_en: "MA-tang",
      },
      {
        word: "sendok makan (sdm)",
        en: "tablespoon",
        vi: "thìa canh",
        pos: "noun (measure)",
        pronunciation_vi: "SEN-dok MA-kan",
        pronunciation_en: "SEN-dok MA-kan",
      },
      {
        word: "sajikan",
        en: "to serve",
        vi: "dọn ra / bày món",
        pos: "verb",
        pronunciation_vi: "SA-ji-kan",
        pronunciation_en: "SA-jee-kan",
      },
      {
        word: "terakhir",
        en: "last / finally",
        vi: "cuối cùng",
        pos: "adverb / adjective",
        pronunciation_vi: "ter-A-khir",
        pronunciation_en: "ter-A-kheer",
      },
    ],
    dialogue: [
      {
        speaker: "Murid",
        text: "Bu, resep ini untuk berapa porsi?",
        vi: "Cô ơi, công thức này cho mấy phần ăn?",
        en: "Teacher, how many portions is this recipe for?",
      },
      {
        speaker: "Guru masak",
        text: "Empat porsi. Pertama, siapkan semua bahan dulu.",
        vi: "Bốn phần. Đầu tiên, chuẩn bị tất cả nguyên liệu trước.",
        en: "Four portions. First, prepare all the ingredients.",
      },
      {
        speaker: "Murid",
        text: "Kecap ini berapa sendok?",
        vi: "Nước tương này mấy thìa ạ?",
        en: "How many spoons of soy sauce?",
      },
      {
        speaker: "Guru masak",
        text: "Dua sendok makan. Terakhir, sajikan selagi hangat.",
        vi: "Hai thìa canh. Cuối cùng, dọn ra khi còn nóng.",
        en: "Two tablespoons. Finally, serve it while warm.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về công thức còn thiếu:",
        instruction_en: "Fill in the missing recipe word:",
        items: [
          {
            prompt: "___ ini untuk empat porsi. (công thức)",
            answer: "Resep",
            options: ["Resep", "Rumah", "Rapat"],
          },
          {
            prompt: "Cara membuat: pertama, ___ telur sampai matang. (luộc)",
            answer: "rebus",
            options: ["rebus", "tulis", "tutup"],
          },
          {
            prompt: "___, sajikan selagi hangat. (cuối cùng)",
            answer: "Terakhir",
            options: ["Terakhir", "Pertama", "Kemarin"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bahan", answer: "nguyên liệu" },
          { prompt: "langkah", answer: "bước" },
          { prompt: "kecap", answer: "nước tương" },
          { prompt: "matang", answer: "chín" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Công thức này cho bốn phần ăn.", answer: "Resep ini untuk empat porsi." },
          { prompt: "Đầu tiên, luộc trứng cho chín.", answer: "Pertama, rebus telur sampai matang." },
          { prompt: "Cuối cùng, dọn ra khi còn nóng.", answer: "Terakhir, sajikan selagi hangat." },
        ],
      },
    ],
  },
  {
    id: "indonesian_gado_gado_soto",
    level: "B1",
    category: "cooking_recipes",
    title_vi: "Gado-gado và soto ayam — làm theo từng bước",
    title_en: "Gado-gado and soto ayam — step by step",
    sentences: [
      {
        en: "Untuk gado-gado, rebus sayuran seperti kangkung, tauge, dan kentang.",
        vi: "Với gado-gado, luộc rau như rau muống, giá đỗ, và khoai tây.",
        pronunciation_focus: [
          "gado-gado → 'gỏi rau trộn sốt đậu phộng' (lặp từ là tên món, không phải số nhiều)",
          "seperti → seu-PER-ti, 'như/giống'",
          "kangkung → KANG-kung, 'rau muống' (người Việt rất quen!)",
        ],
        pronunciation_focus_en: [
          "gado-gado → mixed vegetable salad with peanut sauce (the reduplication is the dish name, not a plural)",
          "seperti → 'se-PER-tee' — like / such as",
          "kangkung → 'KANG-koong' — water spinach (very familiar to Vietnamese!)",
        ],
      },
      {
        en: "Siram sayuran dengan bumbu kacang yang kental.",
        vi: "Rưới rau bằng sốt đậu phộng sệt.",
        pronunciation_focus: [
          "siram → SI-ram, 'rưới/dội (nước/sốt)'",
          "bumbu kacang → 'sốt đậu phộng' (kacang = đậu phộng/lạc)",
          "kental → KEN-tal, 'sệt/đặc'; yang kental = (loại) sệt",
        ],
        pronunciation_focus_en: [
          "siram → 'SEE-ram' — to pour/douse over",
          "bumbu kacang → 'peanut sauce' (kacang = peanut)",
          "kental → 'KEN-tal' — thick (of a liquid); yang kental = the thick kind",
        ],
      },
      {
        en: "Untuk soto ayam, rebus ayam dengan kunyit dan serai.",
        vi: "Với soto gà, ninh gà với nghệ và sả.",
        pronunciation_focus: [
          "soto ayam → 'súp/phở gà kiểu Indonesia' (ayam = gà)",
          "kunyit → KU-nyit, 'nghệ'; serai → SE-rai, 'sả'",
          "rebus → ở đây nghĩa 'ninh/hầm (lâu)'",
        ],
        pronunciation_focus_en: [
          "soto ayam → Indonesian chicken soup (ayam = chicken)",
          "kunyit → 'KOO-nyit' — turmeric; serai → 'SE-rai' — lemongrass",
          "rebus → here it means to simmer/stew (long boil)",
        ],
      },
      {
        en: "Suwir ayamnya, lalu masukkan kembali ke dalam kuah.",
        vi: "Xé nhỏ thịt gà, rồi cho lại vào nước dùng.",
        pronunciation_focus: [
          "suwir → SU-wir, 'xé (nhỏ thịt)'",
          "masukkan kembali → 'cho vào lại' (kembali = trở lại)",
          "ke dalam kuah → 'vào trong nước dùng' (dalam = trong)",
        ],
        pronunciation_focus_en: [
          "suwir → 'SOO-weer' — to shred (meat)",
          "masukkan kembali → 'put it back in' (kembali = back/again)",
          "ke dalam kuah → 'into the broth' (dalam = inside)",
        ],
      },
      {
        en: "Taburi dengan bawang goreng dan seledri sebelum disajikan.",
        vi: "Rắc hành phi và rau cần lên trước khi dọn ra.",
        pronunciation_focus: [
          "taburi → ta-BU-ri, 'rắc/rải lên (gốc tabur)'",
          "bawang goreng → 'hành phi' (bawang = hành, goreng = chiên)",
          "sebelum disajikan → 'trước khi được dọn ra' (di- bị động)",
        ],
        pronunciation_focus_en: [
          "taburi → 'ta-BOO-ree' — to sprinkle over (root 'tabur')",
          "bawang goreng → 'fried shallots' (bawang = onion, goreng = fried)",
          "sebelum disajikan → 'before it is served' (passive 'di-')",
        ],
      },
    ],
    cultural_notes_vi:
      "Gado-gado là 'salad' rau luộc của Indonesia, chan sốt đậu phộng ('bumbu kacang') — món chay tiện, gần gũi khẩu vị Việt vì có rau muống ('kangkung') và giá. Soto ayam là súp gà nghệ-sả, mỗi vùng một kiểu (Soto Lamongan, Soto Betawi…), ăn kèm cơm hoặc bún ('soun/bihun'), rắc hành phi ('bawang goreng') — y như món Việt. Nhiều nguyên liệu trùng với bếp Việt: nghệ (kunyit), sả (serai), riềng (lengkuas), lá chanh (daun jeruk).",
    cultural_notes_en:
      "Gado-gado is Indonesia's boiled-vegetable 'salad' drenched in peanut sauce ('bumbu kacang') — an easy vegetarian dish, friendly to Vietnamese taste because it uses water spinach ('kangkung') and bean sprouts. Soto ayam is a turmeric-lemongrass chicken soup with regional styles (Soto Lamongan, Soto Betawi…), served with rice or vermicelli ('soun/bihun') and topped with fried shallots ('bawang goreng') — just like Vietnamese dishes. Many ingredients overlap with Vietnamese cooking: turmeric (kunyit), lemongrass (serai), galangal (lengkuas), kaffir lime leaf (daun jeruk).",
    tip_advice_vi:
      "Mẹo cho người Việt: nhiều tên rau/gia vị Indonesia rất gần đời sống Việt — kangkung (rau muống), tauge (giá), kunyit (nghệ), serai (sả). Học một lần dùng được cho cả hai bếp. Động từ chế biến hay gặp trong soto/gado-gado: rebus (luộc/ninh), siram (rưới), suwir (xé), taburi (rắc). 'yang + tính từ' chọn loại: 'bumbu kacang yang kental' (sốt đậu loại sệt).",
    tip_advice_en:
      "Tip for Vietnamese speakers: many Indonesian vegetable/spice names sit close to everyday Vietnamese cooking — kangkung (water spinach), tauge (bean sprouts), kunyit (turmeric), serai (lemongrass). Learn them once, use them in both kitchens. Frequent cooking verbs in soto/gado-gado: rebus (boil/simmer), siram (pour over), suwir (shred), taburi (sprinkle). 'yang + adjective' picks a type: 'bumbu kacang yang kental' (the thick peanut sauce).",
    vocabulary: [
      {
        word: "gado-gado",
        en: "vegetable salad with peanut sauce",
        vi: "gỏi rau sốt đậu phộng",
        pos: "noun",
        pronunciation_vi: "GA-do GA-do",
        pronunciation_en: "GA-do GA-do",
      },
      {
        word: "soto ayam",
        en: "Indonesian chicken soup",
        vi: "súp gà nghệ-sả",
        pos: "noun",
        pronunciation_vi: "SÔ-to A-yam",
        pronunciation_en: "SOH-to A-yam",
      },
      {
        word: "kangkung",
        en: "water spinach",
        vi: "rau muống",
        pos: "noun",
        pronunciation_vi: "KANG-kung",
        pronunciation_en: "KANG-koong",
      },
      {
        word: "bumbu kacang",
        en: "peanut sauce",
        vi: "sốt đậu phộng",
        pos: "noun",
        pronunciation_vi: "BUM-bu KA-chang",
        pronunciation_en: "BOOM-boo KA-chang",
      },
      {
        word: "kunyit",
        en: "turmeric",
        vi: "nghệ",
        pos: "noun",
        pronunciation_vi: "KU-nyit",
        pronunciation_en: "KOO-nyit",
      },
      {
        word: "serai",
        en: "lemongrass",
        vi: "sả",
        pos: "noun",
        pronunciation_vi: "SE-rai",
        pronunciation_en: "SE-rai",
      },
      {
        word: "suwir",
        en: "to shred (meat)",
        vi: "xé (nhỏ thịt)",
        pos: "verb",
        pronunciation_vi: "SU-wir",
        pronunciation_en: "SOO-weer",
      },
      {
        word: "bawang goreng",
        en: "fried shallots",
        vi: "hành phi",
        pos: "noun",
        pronunciation_vi: "BA-wang GÔ-reng",
        pronunciation_en: "BA-wang GOH-reng",
      },
      {
        word: "kental",
        en: "thick (liquid)",
        vi: "sệt / đặc",
        pos: "adjective",
        pronunciation_vi: "KEN-tal",
        pronunciation_en: "KEN-tal",
      },
    ],
    dialogue: [
      {
        speaker: "Mai",
        text: "Saya mau coba masak gado-gado. Sayurannya apa saja?",
        vi: "Tôi muốn thử nấu gado-gado. Có những loại rau gì?",
        en: "I want to try making gado-gado. Which vegetables go in it?",
      },
      {
        speaker: "Sari",
        text: "Kangkung, tauge, kentang. Rebus dulu, lalu siram bumbu kacang.",
        vi: "Rau muống, giá, khoai tây. Luộc trước, rồi rưới sốt đậu phộng.",
        en: "Water spinach, bean sprouts, potato. Boil them first, then pour peanut sauce.",
      },
      {
        speaker: "Mai",
        text: "Kalau soto ayam, bumbunya beda?",
        vi: "Còn soto gà thì gia vị khác à?",
        en: "And for soto ayam, are the seasonings different?",
      },
      {
        speaker: "Sari",
        text: "Beda. Pakai kunyit dan serai. Ayamnya disuwir, lalu taburi bawang goreng.",
        vi: "Khác. Dùng nghệ và sả. Gà xé nhỏ, rồi rắc hành phi.",
        en: "Different. Use turmeric and lemongrass. Shred the chicken, then sprinkle fried shallots.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nấu ăn còn thiếu:",
        instruction_en: "Fill in the missing cooking word:",
        items: [
          {
            prompt: "Siram sayuran dengan ___ kacang. (sốt/gia vị)",
            answer: "bumbu",
            options: ["bumbu", "bahan", "buku"],
          },
          {
            prompt: "Rebus ayam dengan ___ dan serai. (nghệ)",
            answer: "kunyit",
            options: ["kunyit", "kangkung", "kentang"],
          },
          {
            prompt: "___ ayamnya, lalu masukkan ke kuah. (xé nhỏ)",
            answer: "Suwir",
            options: ["Suwir", "Siram", "Sajikan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối nguyên liệu với nghĩa tiếng Việt:",
        instruction_en: "Match each ingredient with its meaning:",
        items: [
          { prompt: "kangkung", answer: "rau muống" },
          { prompt: "kunyit", answer: "nghệ" },
          { prompt: "serai", answer: "sả" },
          { prompt: "bawang goreng", answer: "hành phi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Luộc rau như rau muống và giá đỗ.", answer: "Rebus sayuran seperti kangkung dan tauge." },
          { prompt: "Rưới rau bằng sốt đậu phộng sệt.", answer: "Siram sayuran dengan bumbu kacang yang kental." },
          { prompt: "Xé nhỏ thịt gà, rồi cho lại vào nước dùng.", answer: "Suwir ayamnya, lalu masukkan kembali ke dalam kuah." },
        ],
      },
    ],
  },
  {
    id: "indonesian_nasi_uduk_coconut_rice",
    level: "B1",
    category: "cooking_recipes",
    title_vi: "Nasi uduk — cơm dừa và mâm ăn kèm",
    title_en: "Nasi uduk — coconut rice and its sides",
    sentences: [
      {
        en: "Cuci beras sampai bersih, lalu tiriskan.",
        vi: "Vo gạo cho sạch, rồi để ráo.",
        pronunciation_focus: [
          "cuci → CHU-chi, 'rửa/vo'",
          "beras → beu-RAS, 'gạo (sống)'; KHÁC nasi (cơm đã nấu) — false friend!",
          "tiriskan → 'để ráo nước' (gốc tiris + -kan)",
        ],
        pronunciation_focus_en: [
          "cuci → 'CHOO-chee' — to wash",
          "beras → 'be-RAS' — uncooked rice; DIFFERENT from 'nasi' (cooked rice) — a false friend!",
          "tiriskan → 'drain (it)' (root 'tiris' + '-kan')",
        ],
      },
      {
        en: "Masak beras dengan santan, daun salam, dan serai.",
        vi: "Nấu gạo với nước cốt dừa, lá nguyệt quế Indonesia, và sả.",
        pronunciation_focus: [
          "santan → SAN-tan, 'nước cốt dừa' — làm cơm béo thơm",
          "daun salam → 'lá salam' (giống lá nguyệt quế Indonesia)",
          "masak → MA-sak, 'nấu'",
        ],
        pronunciation_focus_en: [
          "santan → 'SAN-tan' — coconut milk; gives the rice its richness",
          "daun salam → Indonesian bay leaf",
          "masak → 'MA-sak' — to cook",
        ],
      },
      {
        en: "Aduk sebentar supaya santan tidak pecah.",
        vi: "Khuấy một lát để nước cốt dừa không bị tách.",
        pronunciation_focus: [
          "aduk → A-duk, 'khuấy/đảo'",
          "sebentar → seu-ben-TAR, 'một lát/chốc'",
          "supaya … tidak pecah → 'để không bị tách/vữa' (pecah = vỡ/tách)",
        ],
        pronunciation_focus_en: [
          "aduk → 'A-dook' — to stir",
          "sebentar → 'se-ben-TAR' — a moment / briefly",
          "supaya … tidak pecah → 'so it doesn't split/curdle' (pecah = break)",
        ],
      },
      {
        en: "Kukus nasi sampai matang dan harum.",
        vi: "Hấp cơm cho đến khi chín và thơm.",
        pronunciation_focus: [
          "kukus → KU-kus, 'hấp'",
          "nasi → NA-si, 'cơm (đã nấu)'",
          "harum → HA-rum, 'thơm'",
        ],
        pronunciation_focus_en: [
          "kukus → 'KOO-koos' — to steam",
          "nasi → 'NA-see' — cooked rice",
          "harum → 'HA-room' — fragrant",
        ],
      },
      {
        en: "Sajikan nasi uduk dengan ayam goreng, telur, dan sambal.",
        vi: "Dọn nasi uduk kèm gà chiên, trứng, và sambal.",
        pronunciation_focus: [
          "nasi uduk → 'cơm dừa kiểu Betawi (Jakarta)'",
          "ayam goreng → 'gà chiên'",
          "dengan → 'kèm/với'; mâm ăn kèm gọi là 'lauk'",
        ],
        pronunciation_focus_en: [
          "nasi uduk → Betawi (Jakarta) coconut rice",
          "ayam goreng → 'fried chicken'",
          "dengan → 'with'; the side dishes are 'lauk'",
        ],
      },
    ],
    cultural_notes_vi:
      "Nasi uduk là cơm nấu nước cốt dừa ('santan') của người Betawi (Jakarta), thơm béo, ăn sáng rất phổ biến. Dọn kèm 'lauk' (món mặn ăn kèm): ayam goreng (gà chiên), telur (trứng), tempe/tahu (đậu nành lên men/đậu phụ), bawang goreng và sambal. CẢNH BÁO false friend quan trọng: 'beras' = gạo SỐNG, 'nasi' = cơm ĐÃ NẤU, 'padi' = lúa ngoài đồng — ba từ khác nhau cho cái người Việt chỉ gọi 'gạo/cơm/lúa'. Lá 'daun salam' KHÔNG phải lá nguyệt quế châu Âu, đừng thay thế.",
    cultural_notes_en:
      "Nasi uduk is Betawi (Jakarta) rice cooked in coconut milk ('santan') — rich, fragrant, a hugely popular breakfast. Served with 'lauk' (savory side dishes): ayam goreng (fried chicken), telur (egg), tempe/tahu (fermented soybean cake/tofu), fried shallots and sambal. IMPORTANT false-friend warning: 'beras' = RAW rice, 'nasi' = COOKED rice, 'padi' = rice plant in the field — three distinct words for what English/Vietnamese often blur. 'Daun salam' is NOT a European bay leaf; don't substitute.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ bộ ba từ 'gạo' — padi (cây lúa) → beras (gạo sống) → nasi (cơm chín). Nói 'masak nasi' (nấu cơm) nhưng 'cuci beras' (vo gạo) — chọn đúng từ theo trạng thái. Động từ nấu theo cách: rebus (luộc), kukus (hấp), goreng (chiên), tumis (xào), panggang (nướng). 'supaya/agar + (tidak) …' = 'để (không) …' diễn đạt mục đích: 'aduk supaya tidak pecah'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize the rice trio — padi (rice plant) → beras (raw rice) → nasi (cooked rice). You 'masak nasi' (cook rice) but 'cuci beras' (wash raw rice) — pick the word by state. Cooking verbs by method: rebus (boil), kukus (steam), goreng (fry), tumis (sauté), panggang (roast/grill). 'supaya/agar + (tidak) …' = 'so that (not) …' expresses purpose: 'aduk supaya tidak pecah'.",
    vocabulary: [
      {
        word: "nasi uduk",
        en: "Betawi coconut rice",
        vi: "cơm dừa kiểu Jakarta",
        pos: "noun",
        pronunciation_vi: "NA-si U-duk",
        pronunciation_en: "NA-see OO-dook",
      },
      {
        word: "beras",
        en: "raw (uncooked) rice",
        vi: "gạo sống",
        pos: "noun",
        pronunciation_vi: "beu-RAS",
        pronunciation_en: "be-RAS",
      },
      {
        word: "nasi",
        en: "cooked rice",
        vi: "cơm",
        pos: "noun",
        pronunciation_vi: "NA-si",
        pronunciation_en: "NA-see",
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
        word: "kukus",
        en: "to steam",
        vi: "hấp",
        pos: "verb",
        pronunciation_vi: "KU-kus",
        pronunciation_en: "KOO-koos",
      },
      {
        word: "cuci",
        en: "to wash",
        vi: "rửa / vo",
        pos: "verb",
        pronunciation_vi: "CHU-chi",
        pronunciation_en: "CHOO-chee",
      },
      {
        word: "lauk",
        en: "side dish (with rice)",
        vi: "món ăn kèm",
        pos: "noun",
        pronunciation_vi: "LA-uk",
        pronunciation_en: "LA-ook",
      },
      {
        word: "ayam goreng",
        en: "fried chicken",
        vi: "gà chiên",
        pos: "noun",
        pronunciation_vi: "A-yam GÔ-reng",
        pronunciation_en: "A-yam GOH-reng",
      },
      {
        word: "harum",
        en: "fragrant",
        vi: "thơm",
        pos: "adjective",
        pronunciation_vi: "HA-rum",
        pronunciation_en: "HA-room",
      },
    ],
    dialogue: [
      {
        speaker: "Nenek",
        text: "Cuci berasnya dulu sampai bersih, ya.",
        vi: "Vo gạo cho sạch trước nhé.",
        en: "Wash the rice clean first, okay.",
      },
      {
        speaker: "Cucu",
        text: "Sudah, Nek. Sekarang masak dengan santan?",
        vi: "Xong rồi bà. Giờ nấu với nước cốt dừa ạ?",
        en: "Done, Grandma. Now cook it with coconut milk?",
      },
      {
        speaker: "Nenek",
        text: "Iya, tambah daun salam dan serai. Aduk supaya santan tidak pecah.",
        vi: "Ừ, thêm lá salam và sả. Khuấy để nước cốt dừa không bị tách.",
        en: "Yes, add bay leaf and lemongrass. Stir so the coconut milk doesn't split.",
      },
      {
        speaker: "Cucu",
        text: "Lalu dikukus sampai matang. Lauknya ayam goreng, kan?",
        vi: "Rồi hấp cho chín. Món ăn kèm là gà chiên đúng không bà?",
        en: "Then steam it until done. The side is fried chicken, right?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nấu cơm dừa còn thiếu (chú ý beras vs nasi):",
        instruction_en: "Fill in the missing word (mind beras vs nasi):",
        items: [
          {
            prompt: "___ beras sampai bersih, lalu tiriskan. (vo/rửa)",
            answer: "Cuci",
            options: ["Cuci", "Kukus", "Suwir"],
          },
          {
            prompt: "Masak beras dengan ___ dan serai. (nước cốt dừa)",
            answer: "santan",
            options: ["santan", "sambal", "saus"],
          },
          {
            prompt: "___ nasi sampai matang dan harum. (hấp)",
            answer: "Kukus",
            options: ["Kukus", "Cuci", "Potong"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "beras", answer: "gạo sống" },
          { prompt: "nasi", answer: "cơm (đã nấu)" },
          { prompt: "kukus", answer: "hấp" },
          { prompt: "lauk", answer: "món ăn kèm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Vo gạo cho sạch, rồi để ráo.", answer: "Cuci beras sampai bersih, lalu tiriskan." },
          { prompt: "Nấu gạo với nước cốt dừa và sả.", answer: "Masak beras dengan santan dan serai." },
          { prompt: "Dọn nasi uduk kèm gà chiên và sambal.", answer: "Sajikan nasi uduk dengan ayam goreng dan sambal." },
        ],
      },
    ],
  },
];

export default cookingRecipesLessons;
