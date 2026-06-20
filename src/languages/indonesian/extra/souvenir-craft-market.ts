// Souvenir Craft Market Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for craft markets and souvenirs: oleh-oleh,
// batik, carvings, woven goods, regional specialty items, prices, and polite
// bargaining. Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

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

export const souvenirCraftMarketLessons: IndonesianLesson[] = [
  {
    id: "indonesian_souvenir_craft_market",
    level: "A2",
    category: "shopping_culture",
    title_vi: "Mua oleh-oleh ở pasar kerajinan",
    title_en: "Buying souvenirs at a craft market",
    sentences: [
      {
        en: "Saya mau mencari oleh-oleh di pasar kerajinan.",
        vi: "Tôi muốn tìm quà lưu niệm/quà mang về ở chợ thủ công.",
        pronunciation_focus: [
          "o-leh O-leh - `oleh-oleh` = quà mang về sau chuyến đi, quà lưu niệm.",
          "`pasar kerajinan` = chợ hàng thủ công; `kerajinan` từ gốc `rajin` nhưng nghĩa là đồ thủ công.",
          "Lỗi người Việt: dịch `souvenir` nguyên tiếng Anh được hiểu, nhưng từ Indonesia rất tự nhiên là `oleh-oleh`.",
          "Luyện: `Saya mau mencari oleh-oleh.`",
        ],
        pronunciation_focus_en: [
          "o-leh O-leh - `oleh-oleh` = souvenirs/gifts brought back from a trip.",
          "`pasar kerajinan` = craft market; `kerajinan` comes from `rajin` but means crafts/handicrafts.",
          "VN-speaker trap: English `souvenir` may be understood, but the natural Indonesian word is `oleh-oleh`.",
          "Drill: `Saya mau mencari oleh-oleh.`",
        ],
      },
      {
        en: "Barang khas daerah apa yang paling terkenal di sini?",
        vi: "Món đặc sản/đồ đặc trưng vùng nào nổi tiếng nhất ở đây?",
        pronunciation_focus: [
          "khas DA-e-rah - `barang khas daerah` = hàng đặc trưng của vùng.",
          "`paling terkenal` = nổi tiếng nhất; `paling` tạo so sánh nhất.",
          "Lỗi người Việt: nói `barang lokal khusus` nghe dịch chữ. Cụm tự nhiên là `barang khas daerah`.",
          "Luyện: `Apa barang khas daerah di sini?`",
        ],
        pronunciation_focus_en: [
          "khas DA-e-rah - `barang khas daerah` = regional specialty item.",
          "`paling terkenal` = most famous; `paling` forms superlatives.",
          "VN-speaker trap: saying translated `barang lokal khusus`. Natural phrase: `barang khas daerah`.",
          "Drill: `Apa barang khas daerah di sini?`",
        ],
      },
      {
        en: "Batik tulis ini buatan tangan atau batik cap?",
        vi: "Batik vẽ này là làm thủ công hay batik dập khuôn?",
        pronunciation_focus: [
          "BA-tik TU-lis - `batik tulis` = batik vẽ tay/làm thủ công.",
          "`buatan tangan` = handmade; `batik cap` = batik dập khuôn.",
          "Lỗi người Việt: đọc `cap` như tiếng Anh. Chữ `c` Indonesia = ch, nên `cap` đọc gần `chap`.",
          "Luyện: `Ini buatan tangan atau batik cap?`",
        ],
        pronunciation_focus_en: [
          "BA-tik TU-lis - `batik tulis` = hand-drawn/handmade batik.",
          "`buatan tangan` = handmade; `batik cap` = stamped batik.",
          "VN-speaker trap: reading `cap` like English cap. Indonesian `c` = ch, so `cap` sounds close to `chap`.",
          "Drill: `Ini buatan tangan atau batik cap?`",
        ],
      },
      {
        en: "Saya suka ukiran kayu yang kecil dan mudah dibawa.",
        vi: "Tôi thích đồ chạm khắc gỗ nhỏ và dễ mang theo.",
        pronunciation_focus: [
          "u-KIR-an KA-yu - `ukiran kayu` = đồ chạm/khắc gỗ.",
          "`mudah dibawa` = dễ mang theo; bị động `di-` vì món đồ được mang.",
          "Lỗi người Việt: nói `kayu gambar` cho đồ khắc. Từ đúng là `ukiran`.",
          "Luyện: `Saya suka ukiran kayu kecil.`",
        ],
        pronunciation_focus_en: [
          "u-KIR-an KA-yu - `ukiran kayu` = wood carving.",
          "`mudah dibawa` = easy to carry; passive `di-` because the item is carried.",
          "VN-speaker trap: saying `kayu gambar` for carved wood. Correct word: `ukiran`.",
          "Drill: `Saya suka ukiran kayu kecil.`",
        ],
      },
      {
        en: "Anyaman bambu ini cocok untuk hadiah.",
        vi: "Đồ đan tre này hợp để làm quà tặng.",
        pronunciation_focus: [
          "a-NYA-man BAM-bu - `anyaman bambu` = đồ đan bằng tre.",
          "`cocok untuk hadiah` = hợp để làm quà; `c` trong `cocok` đọc ch.",
          "`hadiah` = quà tặng nói chung; `oleh-oleh` nhấn mạnh quà mang về từ chuyến đi.",
          "Luyện: `Anyaman bambu ini cocok untuk hadiah.`",
        ],
        pronunciation_focus_en: [
          "a-NYA-man BAM-boo - `anyaman bambu` = woven bamboo craft.",
          "`cocok untuk hadiah` = suitable as a gift; `c` in `cocok` is ch.",
          "`hadiah` = gift in general; `oleh-oleh` emphasizes a trip souvenir.",
          "Drill: `Anyaman bambu ini cocok untuk hadiah.`",
        ],
      },
      {
        en: "Harga satuannya berapa kalau saya beli lima?",
        vi: "Giá mỗi món là bao nhiêu nếu tôi mua năm cái?",
        pronunciation_focus: [
          "HAR-ga sa-TU-an - `harga satuan` = giá từng cái/đơn giá.",
          "`kalau saya beli lima` = nếu tôi mua năm; có thể bỏ danh từ khi ngữ cảnh rõ.",
          "Lỗi người Việt: hỏi `harga satu berapa` được hiểu nhưng kém tự nhiên hơn `harga satuannya berapa?`.",
          "Luyện: `Harga satuannya berapa?`",
        ],
        pronunciation_focus_en: [
          "HAR-ga sa-TOO-an - `harga satuan` = unit price.",
          "`kalau saya beli lima` = if I buy five; the item noun can be omitted when context is clear.",
          "VN-speaker trap: `harga satu berapa` is understood but less natural than `harga satuannya berapa?`.",
          "Drill: `Harga satuannya berapa?`",
        ],
      },
      {
        en: "Bisa tawar-menawar sedikit kalau beli beberapa barang?",
        vi: "Có thể mặc cả một chút nếu mua vài món không?",
        pronunciation_focus: [
          "TA-war me-NA-war - `tawar-menawar` = mặc cả qua lại.",
          "`beberapa barang` = vài món hàng; không cần classifier như tiếng Việt.",
          "Mẹo: mở bằng `bisa... sedikit?` nghe mềm và lịch sự hơn ép giá thẳng.",
          "Luyện: `Bisa tawar-menawar sedikit?`",
        ],
        pronunciation_focus_en: [
          "TA-war me-NA-war - `tawar-menawar` = bargaining back and forth.",
          "`beberapa barang` = several items; no classifier needed like Vietnamese.",
          "Tip: opening with `bisa... sedikit?` sounds softer and more polite than pushing price directly.",
          "Drill: `Bisa tawar-menawar sedikit?`",
        ],
      },
      {
        en: "Kalau harga pas, boleh minta bungkus yang aman?",
        vi: "Nếu giá đã chốt, tôi xin gói hàng chắc chắn được không?",
        pronunciation_focus: [
          "HAR-ga pas - `harga pas` = giá chốt/giá cố định, thường không giảm nữa.",
          "`bungkus yang aman` = gói bọc an toàn/chắc để mang đi.",
          "Lỗi người Việt: hiểu `pas` chỉ là vừa. Trong mua bán, `harga pas` thường là giá cuối.",
          "Luyện: `Boleh minta bungkus yang aman?`",
        ],
        pronunciation_focus_en: [
          "HAR-ga pas - `harga pas` = fixed/final price, often no more discount.",
          "`bungkus yang aman` = safe/protective wrapping for carrying.",
          "VN-speaker trap: reading `pas` only as fits/right. In shopping, `harga pas` often means final price.",
          "Drill: `Boleh minta bungkus yang aman?`",
        ],
      },
      {
        en: "Barang ini rapuh, jadi tolong bungkus dengan koran dan kardus.",
        vi: "Món này dễ vỡ, nên làm ơn gói bằng báo và thùng carton.",
        pronunciation_focus: [
          "RA-puh - `rapuh` = dễ vỡ/mỏng manh.",
          "`koran dan kardus` = báo và bìa/thùng carton; hay dùng để gói đồ thủ công.",
          "`jadi` ở đây = nên/vì vậy, nối lý do với yêu cầu.",
          "Luyện: `Barang ini rapuh.`",
        ],
        pronunciation_focus_en: [
          "RA-pooh - `rapuh` = fragile/brittle.",
          "`koran dan kardus` = newspaper and cardboard; common wrapping materials for crafts.",
          "`jadi` here = so/therefore, linking reason to request.",
          "Drill: `Barang ini rapuh.`",
        ],
      },
      {
        en: "Saya mau barang khas daerah yang ringan untuk dibawa pulang.",
        vi: "Tôi muốn món đặc trưng vùng nhẹ để mang về nhà.",
        pronunciation_focus: [
          "RI-ngan un-TUK di-BA-wa PU-lang - `ringan untuk dibawa pulang` = nhẹ để mang về.",
          "`dibawa pulang` = được mang về; cụm rất tự nhiên khi mua oleh-oleh.",
          "Lỗi người Việt: nói `bawa kembali rumah` nghe dịch chữ. Dùng `dibawa pulang`.",
          "Luyện: `Saya mau barang yang ringan.`",
        ],
        pronunciation_focus_en: [
          "RI-ngan un-TOOK di-BA-wa POO-lang - `ringan untuk dibawa pulang` = light enough to take home.",
          "`dibawa pulang` = taken home; very natural when buying souvenirs.",
          "VN-speaker trap: saying translated `bawa kembali rumah`. Use `dibawa pulang`.",
          "Drill: `Saya mau barang yang ringan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `oleh-oleh` là một phần văn hóa du lịch: người đi xa thường mua quà nhỏ cho gia đình, bạn bè hoặc đồng nghiệp. Ở `pasar kerajinan`, các món phổ biến gồm batik, ukiran kayu, anyaman bambu/rotan, đồ bạc, cà phê địa phương, hoặc barang khas daerah. Mặc cả có thể chấp nhận ở chợ truyền thống, nhưng nên giữ giọng vui vẻ: hỏi trước, cười, và tôn trọng nếu người bán nói `harga pas`.",
    cultural_notes_en:
      "In Indonesia, `oleh-oleh` is part of travel culture: people often bring small gifts back for family, friends, or coworkers. At a `pasar kerajinan`, common items include batik, wood carvings, woven bamboo/rattan goods, silverwork, local coffee, or regional specialty items. Bargaining is acceptable in traditional markets, but keep the tone friendly: ask first, smile, and respect it if the seller says `harga pas`.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `hadiah` = quà nói chung, `oleh-oleh` = quà mang về sau chuyến đi, `barang khas daerah` = món đặc trưng vùng. Khi mặc cả, dùng khung mềm: `Bisa tawar-menawar sedikit?`, `Kalau beli lima, bisa kurang?`, `Harga pas ya?`. Với đồ dễ vỡ, nhớ hỏi `boleh dibungkus aman?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `hadiah` = gift in general, `oleh-oleh` = trip souvenir/gift to bring home, and `barang khas daerah` = regional specialty item. For bargaining, use soft frames: `Bisa tawar-menawar sedikit?`, `Kalau beli lima, bisa kurang?`, `Harga pas ya?`. For fragile crafts, ask `boleh dibungkus aman?`.",
    vocabulary: [
      {
        word: "pasar kerajinan",
        en: "craft market",
        vi: "chợ thủ công",
        pos: "noun phrase",
        pronunciation_vi: "PA-sar ke-ra-JIN-an",
        pronunciation_en: "PA-sar ke-ra-JIN-an",
      },
      {
        word: "oleh-oleh",
        en: "souvenir / gift brought back",
        vi: "quà lưu niệm / quà mang về",
        pos: "noun",
        pronunciation_vi: "o-leh O-leh",
        pronunciation_en: "o-leh O-leh",
      },
      {
        word: "batik tulis",
        en: "hand-drawn batik",
        vi: "batik vẽ tay",
        pos: "noun phrase",
        pronunciation_vi: "BA-tik TU-lis",
        pronunciation_en: "BA-tik TOO-lis",
      },
      {
        word: "ukiran kayu",
        en: "wood carving",
        vi: "đồ chạm khắc gỗ",
        pos: "noun phrase",
        pronunciation_vi: "u-KIR-an KA-yu",
        pronunciation_en: "u-KEER-an KA-yoo",
      },
      {
        word: "anyaman bambu",
        en: "woven bamboo craft",
        vi: "đồ đan tre",
        pos: "noun phrase",
        pronunciation_vi: "a-NYA-man BAM-bu",
        pronunciation_en: "a-NYA-man BAM-boo",
      },
      {
        word: "barang khas daerah",
        en: "regional specialty item",
        vi: "món đặc trưng vùng",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang khas DA-e-rah",
        pronunciation_en: "BA-rang khas DA-e-rah",
      },
      {
        word: "harga satuan",
        en: "unit price",
        vi: "đơn giá",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga sa-TU-an",
        pronunciation_en: "HAR-ga sa-TOO-an",
      },
      {
        word: "tawar-menawar",
        en: "bargaining",
        vi: "mặc cả",
        pos: "noun / verb phrase",
        pronunciation_vi: "TA-war me-NA-war",
        pronunciation_en: "TA-war me-NA-war",
      },
      {
        word: "harga pas",
        en: "fixed / final price",
        vi: "giá chốt / giá cố định",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga pas",
        pronunciation_en: "HAR-ga pas",
      },
      {
        word: "rapuh",
        en: "fragile",
        vi: "dễ vỡ / mỏng manh",
        pos: "adjective",
        pronunciation_vi: "RA-puh",
        pronunciation_en: "RA-pooh",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, saya mau mencari oleh-oleh. Apa barang khas daerah yang terkenal di sini?",
        vi: "Cô ơi, tôi muốn tìm quà mang về. Món đặc trưng vùng nào nổi tiếng ở đây?",
        en: "Ma'am, I'm looking for souvenirs. What regional specialty item is famous here?",
      },
      {
        speaker: "Pedagang",
        text: "Ada batik tulis, ukiran kayu, dan anyaman bambu.",
        vi: "Có batik vẽ tay, đồ chạm khắc gỗ và đồ đan tre.",
        en: "There is hand-drawn batik, wood carving, and woven bamboo craft.",
      },
      {
        speaker: "Pembeli",
        text: "Harga satuannya berapa kalau saya beli lima?",
        vi: "Đơn giá bao nhiêu nếu tôi mua năm cái?",
        en: "What is the unit price if I buy five?",
      },
      {
        speaker: "Pedagang",
        text: "Kalau beli lima, saya bisa kasih diskon sedikit.",
        vi: "Nếu mua năm cái, tôi có thể giảm một chút.",
        en: "If you buy five, I can give a small discount.",
      },
      {
        speaker: "Pembeli",
        text: "Barang ini rapuh, jadi tolong bungkus yang aman, ya.",
        vi: "Món này dễ vỡ, nên làm ơn gói chắc chắn nhé.",
        en: "This item is fragile, so please wrap it safely.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ chợ thủ công còn thiếu:",
        instruction_en: "Fill in the missing craft-market phrase:",
        items: [
          {
            prompt: "Saya mau mencari ___ di pasar kerajinan.",
            answer: "oleh-oleh",
            options: ["oleh-oleh", "obat", "ongkos"],
          },
          {
            prompt: "Batik ___ ini buatan tangan.",
            answer: "tulis",
            options: ["tulis", "tutup", "turun"],
          },
          {
            prompt: "Barang ini ___, jadi tolong bungkus dengan aman.",
            answer: "rapuh",
            options: ["rapuh", "ramai", "rajin"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "pasar kerajinan", answer: "chợ thủ công" },
          { prompt: "ukiran kayu", answer: "đồ chạm khắc gỗ" },
          { prompt: "anyaman bambu", answer: "đồ đan tre" },
          { prompt: "harga satuan", answer: "đơn giá" },
          { prompt: "barang khas daerah", answer: "món đặc trưng vùng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn tìm quà mang về ở chợ thủ công.",
            answer: "Saya mau mencari oleh-oleh di pasar kerajinan.",
          },
          {
            prompt: "Có thể mặc cả một chút nếu mua vài món không?",
            answer: "Bisa tawar-menawar sedikit kalau beli beberapa barang?",
          },
          {
            prompt: "Món này dễ vỡ, nên làm ơn gói bằng báo và thùng carton.",
            answer: "Barang ini rapuh, jadi tolong bungkus dengan koran dan kardus.",
          },
        ],
      },
    ],
  },
];

export default souvenirCraftMarketLessons;
