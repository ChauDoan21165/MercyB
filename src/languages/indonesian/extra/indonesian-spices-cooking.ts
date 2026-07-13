// Indonesian Spices & Home Cooking (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack. The shape mirrors sibling Indonesian extra
// files: Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// `pronunciation_focus` contains Vietnamese L1 notes, and
// `pronunciation_focus_en` is the English companion in the same order.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const indonesianSpicesCookingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_spices_home_cooking",
    level: "B1",
    category: "food_cooking",
    title_vi: "Gia vị bếp Indonesia và món nhà nấu",
    title_en: "Indonesian kitchen spices and home cooking",
    sentences: [
      {
        en: "Bumbu dapur Indonesia biasanya mulai dari bawang merah dan bawang putih.",
        vi: "Gia vị bếp Indonesia thường bắt đầu từ hành tím và tỏi.",
        pronunciation_focus: [
          "BUM-bu DA-pur - `bumbu dapur` = gia vị/nền nêm trong bếp.",
          "`bawang merah` = hành tím; nghĩa đen là 'hành đỏ'.",
          "`bawang putih` = tỏi; nghĩa đen là 'hành trắng'. Đây là false friend dễ nhầm với hành trắng Việt Nam.",
          "Luyện: `Bumbu dapur mulai dari bawang.`",
        ],
        pronunciation_focus_en: [
          "BUM-boo DA-poor - `bumbu dapur` = kitchen spices/seasoning base.",
          "`bawang merah` = shallot; literally 'red onion'.",
          "`bawang putih` = garlic; literally 'white onion'. This can mislead Vietnamese learners.",
          "Drill: `Bumbu dapur mulai dari bawang.`",
        ],
      },
      {
        en: "Cabai merah membuat masakan lebih pedas dan berwarna.",
        vi: "Ớt đỏ làm món ăn cay hơn và có màu sắc hơn.",
        pronunciation_focus: [
          "cha-BAI ME-rah - chữ `c` trong `cabai` đọc như 'ch', không phải 'k'.",
          "`membuat masakan lebih pedas` = làm món ăn cay hơn.",
          "`berwarna` = có màu; tiền tố ber- thường chỉ 'có/mang tính'.",
          "Luyện: `Cabai membuat masakan pedas.`",
        ],
        pronunciation_focus_en: [
          "cha-BAI ME-rah - `c` in `cabai` is pronounced 'ch', not 'k'.",
          "`membuat masakan lebih pedas` = makes the dish spicier.",
          "`berwarna` = colorful/has color; ber- often marks 'having/being'.",
          "Drill: `Cabai membuat masakan pedas.`",
        ],
      },
      {
        en: "Kunyit memberi warna kuning pada nasi kuning dan soto.",
        vi: "Nghệ tạo màu vàng cho nasi kuning và soto.",
        pronunciation_focus: [
          "KU-nyit - `kunyit` = nghệ; âm `ny` giống 'nh' tiếng Việt.",
          "`memberi warna` = cho/tạo màu; trang trọng hơn `kasih warna`.",
          "`pada` = cho/ở trên/trong; dùng tự nhiên khi nói màu hoặc tác động lên món ăn.",
          "Luyện: `Kunyit memberi warna kuning.`",
        ],
        pronunciation_focus_en: [
          "KOO-nyit - `kunyit` = turmeric; `ny` is like Spanish ñ / Vietnamese nh.",
          "`memberi warna` = gives color; more formal than `kasih warna`.",
          "`pada` = to/on/in; natural for color or effect on a dish.",
          "Drill: `Kunyit memberi warna kuning.`",
        ],
      },
      {
        en: "Jahe sering dipakai untuk masakan hangat dan minuman tradisional.",
        vi: "Gừng thường được dùng cho món ăn ấm nóng và đồ uống truyền thống.",
        pronunciation_focus: [
          "JA-he - `jahe` = gừng; không kéo thành một âm.",
          "`sering dipakai` = thường được dùng; `di-` tạo bị động rất phổ biến trong công thức.",
          "`hangat` = ấm, không nhất thiết là cay.",
          "Luyện: `Jahe sering dipakai.`",
        ],
        pronunciation_focus_en: [
          "JA-he - `jahe` = ginger; keep two syllables.",
          "`sering dipakai` = often used; `di-` makes a very common passive in recipes.",
          "`hangat` = warm, not necessarily spicy.",
          "Drill: `Jahe sering dipakai.`",
        ],
      },
      {
        en: "Tumis bawang sampai harum sebelum memasukkan cabai.",
        vi: "Phi/xào hành tỏi cho thơm trước khi cho ớt vào.",
        pronunciation_focus: [
          "TU-mis BA-wang sam-PAI HA-rum - `tumis` = xào/phi nhanh với ít dầu.",
          "`sampai harum` = đến khi thơm; cụm này xuất hiện rất nhiều trong công thức Indonesia.",
          "`memasukkan` = cho vào/đưa vào; gốc `masuk` + meN-...-kan.",
          "Luyện: `Tumis bawang sampai harum.`",
        ],
        pronunciation_focus_en: [
          "TOO-mis BA-wang sam-PAI HA-room - `tumis` = saute/stir-fry briefly in oil.",
          "`sampai harum` = until fragrant; this phrase is everywhere in Indonesian recipes.",
          "`memasukkan` = to put in; root `masuk` plus meN-...-kan.",
          "Drill: `Tumis bawang sampai harum.`",
        ],
      },
      {
        en: "Masukkan santan pelan-pelan supaya tidak pecah.",
        vi: "Cho nước cốt dừa vào từ từ để không bị tách dầu/vón.",
        pronunciation_focus: [
          "SAN-tan - `santan` = nước cốt dừa, không phải nước dừa trong.",
          "`pelan-pelan` = từ từ; lặp từ chỉ cách làm, không phải số nhiều.",
          "`santan pecah` = nước cốt dừa bị tách; cụm nấu ăn rất tự nhiên.",
          "Luyện: `Masukkan santan pelan-pelan.`",
        ],
        pronunciation_focus_en: [
          "SAN-tan - `santan` = coconut milk, not clear coconut water.",
          "`pelan-pelan` = slowly; reduplication marks manner, not plural.",
          "`santan pecah` = coconut milk splits/curdles; a natural cooking phrase.",
          "Drill: `Masukkan santan pelan-pelan.`",
        ],
      },
      {
        en: "Ibu saya menggoreng ikan dengan bumbu kunyit dan bawang putih.",
        vi: "Mẹ tôi chiên cá với gia vị nghệ và tỏi.",
        pronunciation_focus: [
          "meng-GO-reng I-kan - `menggoreng` = chiên/rán; gốc `goreng`.",
          "`dengan bumbu` = với gia vị/nền ướp; không cần dịch 'bằng' cứng nhắc.",
          "Lỗi người Việt: `goreng` là tính từ trong `nasi goreng`, nhưng động từ đầy đủ là `menggoreng`.",
          "Luyện: `Ibu menggoreng ikan.`",
        ],
        pronunciation_focus_en: [
          "meng-GO-reng EE-kan - `menggoreng` = to fry; root `goreng`.",
          "`dengan bumbu` = with seasoning/spice paste; do not over-translate as only 'by means of'.",
          "VN-speaker trap: `goreng` appears as an adjective in `nasi goreng`, but the full verb is `menggoreng`.",
          "Drill: `Ibu menggoreng ikan.`",
        ],
      },
      {
        en: "Resep rumahan biasanya memakai takaran kira-kira.",
        vi: "Công thức nhà nấu thường dùng định lượng áng chừng.",
        pronunciation_focus: [
          "RE-sep ru-MA-han - `resep rumahan` = công thức/món kiểu gia đình.",
          "`takaran` = định lượng; từ gốc `takar`.",
          "`kira-kira` = khoảng chừng/ước lượng; cực kỳ hữu ích khi nấu ăn.",
          "Luyện: `Pakai takaran kira-kira.`",
        ],
        pronunciation_focus_en: [
          "RE-sep roo-MA-han - `resep rumahan` = home-style recipe.",
          "`takaran` = measurement/amount; from root `takar`.",
          "`kira-kira` = approximately/by estimate; very useful in cooking.",
          "Drill: `Pakai takaran kira-kira.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Nấu ăn Indonesia thường bắt đầu bằng `bumbu`: hành tím (`bawang merah`), tỏi (`bawang putih`), ớt (`cabai`), nghệ (`kunyit`), gừng (`jahe`) và nhiều gia vị khác được giã/xay rồi xào thơm. `Tumis bumbu sampai harum` là câu gần như công thức nền cho nhiều món nhà nấu. `Santan` tạo vị béo cho gulai, opor, rendang, sayur lodeh, nhưng phải đun nhẹ để không `pecah`. Món gia đình thường dùng `takaran kira-kira`, giống cách nấu Việt Nam: nêm bằng mắt, mũi và kinh nghiệm.",
    cultural_notes_en:
      "Indonesian cooking often starts with `bumbu`: shallots (`bawang merah`), garlic (`bawang putih`), chili (`cabai`), turmeric (`kunyit`), ginger (`jahe`), and other spices ground or chopped into a base, then sauteed until fragrant. `Tumis bumbu sampai harum` is a foundation line for many home dishes. `Santan` adds richness to gulai, opor, rendang, and sayur lodeh, but it must be heated gently so it does not split. Home recipes often use `takaran kira-kira`, much like Vietnamese cooking by eye, smell, and experience.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dịch `bumbu` chỉ là 'gia vị' khô. Trong bếp Indonesia, `bumbu` thường là hỗn hợp hành, tỏi, ớt, nghệ, gừng được giã/xay thành nền vị. Nhớ cặp `tumis` = xào/phi ít dầu, `goreng/menggoreng` = chiên/rán. `Santan` là nước cốt dừa béo; `air kelapa` mới là nước dừa uống.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not reduce `bumbu` to dry 'spices'. In Indonesian kitchens, `bumbu` is often a ground/chopped flavor base of shallot, garlic, chili, turmeric, ginger, and more. Keep `tumis` = saute/stir-fry in a little oil, while `goreng/menggoreng` = fry. `Santan` is rich coconut milk; `air kelapa` is drinkable coconut water.",
    vocabulary: [
      {
        cell_id: "d9365f45-b3d6-4ba9-b526-5a1b149a5b06",
        word: "bumbu dapur",
        en: "kitchen spices / seasoning base",
        vi: "gia vị bếp / nền nêm",
        pos: "noun phrase",
        pronunciation_vi: "BUM-bu DA-pur",
        pronunciation_en: "BUM-boo DA-poor",
      },
      {
        cell_id: "01ec85e9-a0cb-4d29-a4d9-05b66919ce1f",
        word: "bawang merah",
        en: "shallot",
        vi: "hành tím",
        pos: "noun",
        pronunciation_vi: "BA-wang ME-rah",
        pronunciation_en: "BA-wang ME-rah",
      },
      {
        cell_id: "371d4dae-0725-46ea-9900-80bc91fbb1a0",
        word: "bawang putih",
        en: "garlic",
        vi: "tỏi",
        pos: "noun",
        pronunciation_vi: "BA-wang PU-tih",
        pronunciation_en: "BA-wang POO-tih",
      },
      {
        cell_id: "0304d32d-8fb9-418c-863a-1a7c96d24494",
        word: "cabai",
        en: "chili",
        vi: "ớt",
        pos: "noun",
        pronunciation_vi: "cha-BAI",
        pronunciation_en: "cha-BAI",
      },
      {
        cell_id: "7092de8a-2c45-41bb-97db-a3bede87de6d",
        word: "kunyit",
        en: "turmeric",
        vi: "nghệ",
        pos: "noun",
        pronunciation_vi: "KU-nyit",
        pronunciation_en: "KOO-nyit",
      },
      {
        cell_id: "6db6e495-7b99-4b0c-b71c-369121a3f181",
        word: "jahe",
        en: "ginger",
        vi: "gừng",
        pos: "noun",
        pronunciation_vi: "JA-he",
        pronunciation_en: "JA-he",
      },
      {
        cell_id: "aed0322b-2adc-4f64-af08-09ec387b5810",
        word: "santan",
        en: "coconut milk",
        vi: "nước cốt dừa",
        pos: "noun",
        pronunciation_vi: "SAN-tan",
        pronunciation_en: "SAN-tan",
      },
      {
        cell_id: "3763b948-d290-4889-8996-01c9af88f9f5",
        word: "tumis",
        en: "to saute / stir-fry lightly",
        vi: "xào / phi ít dầu",
        pos: "verb",
        pronunciation_vi: "TU-mis",
        pronunciation_en: "TOO-mis",
      },
      {
        cell_id: "8aeb954e-fd9e-46d2-897c-cb0097073efb",
        word: "goreng",
        en: "fried / fry",
        vi: "chiên / rán",
        pos: "verb / adjective",
        pronunciation_vi: "GO-reng",
        pronunciation_en: "GO-reng",
      },
      {
        cell_id: "072606bc-a1fa-4b8a-b3c4-26ef3338bcb3",
        word: "resep rumahan",
        en: "home-style recipe",
        vi: "công thức/món nhà nấu",
        pos: "noun phrase",
        pronunciation_vi: "RE-sep ru-MA-han",
        pronunciation_en: "RE-sep roo-MA-han",
      },
    ],
    dialogue: [
      {
        cell_id: "1b94c5f7-51e6-4996-8ae0-e2cb15af7b8b",
        speaker: "Mai",
        text: "Bu, bumbu untuk ayam goreng ini apa saja?",
        vi: "Cô ơi, gia vị cho món gà chiên này gồm những gì?",
        en: "Ma'am, what spices are used for this fried chicken?",
      },
      {
        cell_id: "b88f6c1a-d8a4-4c8b-a10e-c3c0395e2d08",
        speaker: "Ibu Sari",
        text: "Pakai bawang putih, kunyit, jahe, garam, dan sedikit cabai.",
        vi: "Dùng tỏi, nghệ, gừng, muối và một ít ớt.",
        en: "Use garlic, turmeric, ginger, salt, and a little chili.",
      },
      {
        cell_id: "d6b5342b-1a90-455f-ab50-664b03ad0eaa",
        speaker: "Mai",
        text: "Bumbunya ditumis dulu atau langsung digoreng?",
        vi: "Gia vị được xào trước hay chiên luôn?",
        en: "Should the spice base be sauteed first or fried directly?",
      },
      {
        cell_id: "0d09c2dc-e16b-485e-a17a-77f968dd4bbb",
        speaker: "Ibu Sari",
        text: "Tumis dulu sampai harum, baru masukkan ayam.",
        vi: "Xào trước cho thơm, rồi mới cho gà vào.",
        en: "Saute it first until fragrant, then add the chicken.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "bawang merah", answer: "hành tím" },
          { prompt: "bawang putih", answer: "tỏi" },
          { prompt: "kunyit", answer: "nghệ" },
          { prompt: "santan", answer: "nước cốt dừa" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "___ bawang sampai harum. (xào/phi)",
            answer: "Tumis",
            options: ["Tumis", "Tidur", "Tanya"],
          },
          {
            prompt: "Kunyit memberi warna ___ pada nasi kuning. (vàng)",
            answer: "kuning",
            options: ["kuning", "kering", "kurang"],
          },
          {
            prompt: "Masukkan ___ pelan-pelan supaya tidak pecah. (nước cốt dừa)",
            answer: "santan",
            options: ["santan", "sayur", "sendok"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Phi hành tỏi cho thơm.", answer: "Tumis bawang sampai harum." },
          { prompt: "Gừng thường được dùng trong đồ uống truyền thống.", answer: "Jahe sering dipakai untuk minuman tradisional." },
          { prompt: "Công thức nhà nấu thường dùng định lượng áng chừng.", answer: "Resep rumahan biasanya memakai takaran kira-kira." },
        ],
      },
    ],
  },
];

export default indonesianSpicesCookingLessons;
