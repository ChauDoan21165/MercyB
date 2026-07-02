// Clothing Shopping & Size Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_clothing_shopping_size",
    level: "A2",
    category: "shopping",
    title_vi: "Mua quần áo: size, phòng thử và đổi hàng",
    title_en: "Clothing shopping: sizes, fitting rooms and exchanges",
    sentences: [
      {
        en: "Ukuran baju ini ada yang lebih besar?",
        vi: "Áo này có cỡ lớn hơn không?",
        pronunciation_focus: [
          "u-KU-ran BA-ju I-ni A-da yang LE-bih BE-sar -- `ukuran baju` = cỡ quần áo; `lebih besar` = lớn hơn.",
          "Lỗi người Việt: hỏi `besar ukuran ada?` theo thứ tự tiếng Việt. Câu tự nhiên: `ada yang lebih besar?`",
          "Luyện: `Ada yang lebih besar?`",
        ],
        pronunciation_focus_en: [
          "u-KU-ran BA-joo EE-ni A-da yang LE-bih BE-sar -- `ukuran baju` = clothing size; `lebih besar` = bigger.",
          "VN-speaker trap: asking `besar ukuran ada?` with Vietnamese word order. Natural: `ada yang lebih besar?`",
          "Drill: `Ada yang lebih besar?`",
        ],
      },
      {
        en: "Boleh coba di kamar pas?",
        vi: "Tôi thử trong phòng thử đồ được không?",
        pronunciation_focus: [
          "BO-leh CO-ba di KA-mar pas -- `kamar pas` = phòng thử đồ; `boleh coba` = thử được không.",
          "`boleh` hỏi xin phép. Đừng dùng `bisa` nếu trọng tâm là phép lịch sự trước khi thử đồ.",
          "Luyện: `Boleh coba di kamar pas?`",
        ],
        pronunciation_focus_en: [
          "BO-leh CHO-ba di KA-mar pas -- `kamar pas` = fitting room; `boleh coba` = may I try it.",
          "`Boleh` asks permission. Do not use `bisa` if the focus is polite permission before trying clothes.",
          "Drill: `Boleh coba di kamar pas?`",
        ],
      },
      {
        en: "Bahan kainnya adem dan tidak panas.",
        vi: "Chất vải mát và không nóng.",
        pronunciation_focus: [
          "BA-han KAIN-nya A-dem dan TI-dak PA-nas -- `bahan kain` = chất vải; `adem` = mát/dễ chịu.",
          "Mẹo: với quần áo ở Indonesia nóng ẩm, `adem` là lời khen rất tự nhiên cho vải mặc mát.",
          "Luyện: `Bahan kainnya adem.`",
        ],
        pronunciation_focus_en: [
          "BA-han KAIN-nya A-dem dan TI-dak PA-nas -- `bahan kain` = fabric material; `adem` = cool/comfortable.",
          "Tip: in hot, humid Indonesia, `adem` is a natural compliment for comfortable, cool fabric.",
          "Drill: `Bahan kainnya adem.`",
        ],
      },
      {
        en: "Ada diskon untuk model ini?",
        vi: "Mẫu này có giảm giá không?",
        pronunciation_focus: [
          "A-da DIS-kon UN-tuk MO-del I-ni -- `diskon` = giảm giá; `model` = kiểu/mẫu.",
          "Lỗi người Việt: dùng `potongan` mọi lúc. Trong cửa hàng quần áo, `diskon` rất phổ biến và dễ hiểu.",
          "Luyện: `Ada diskon untuk model ini?`",
        ],
        pronunciation_focus_en: [
          "A-da DIS-kon OON-tuk MO-del EE-ni -- `diskon` = discount; `model` = style/model.",
          "VN-speaker trap: using `potongan` every time. In clothing stores, `diskon` is common and clear.",
          "Drill: `Ada diskon untuk model ini?`",
        ],
      },
      {
        en: "Kalau tidak cocok, bisa tukar barang?",
        vi: "Nếu không hợp/vừa, có thể đổi hàng không?",
        pronunciation_focus: [
          "KA-lau TI-dak CO-cok, BI-sa TU-kar BA-rang -- `tidak cocok` = không hợp/không vừa; `tukar barang` = đổi hàng.",
          "`cocok` đọc CHO-chok vì `c` trong tiếng Indonesia = 'ch', không phải 'k'.",
          "Luyện: `Bisa tukar barang?`",
        ],
        pronunciation_focus_en: [
          "KA-lau TI-dak CHO-chok, BEE-sa TOO-kar BA-rang -- `tidak cocok` = not suitable/not a good fit; `tukar barang` = exchange goods.",
          "`Cocok` is CHO-chok because Indonesian `c` = 'ch', not 'k'.",
          "Drill: `Bisa tukar barang?`",
        ],
      },
      {
        en: "Tolong simpan struk belanja untuk tukar ukuran.",
        vi: "Làm ơn giữ hóa đơn mua hàng để đổi cỡ.",
        pronunciation_focus: [
          "TO-long SIM-pan struk be-LAN-ja UN-tuk TU-kar u-KU-ran -- `struk belanja` = hóa đơn/biên lai mua hàng.",
          "Mẹo: nhiều cửa hàng chỉ cho đổi hàng nếu còn `struk`, tag, và hàng chưa dipakai.",
          "Luyện: `Simpan struk belanja.`",
        ],
        pronunciation_focus_en: [
          "TO-long SIM-pan struk be-LAN-ja OON-tuk TOO-kar u-KU-ran -- `struk belanja` = shopping receipt.",
          "Tip: many stores allow exchanges only if you still have the receipt, tags, and the item has not been worn.",
          "Drill: `Simpan struk belanja.`",
        ],
      },
      {
        en: "Warna hitamnya habis, ada warna biru?",
        vi: "Màu đen hết rồi, có màu xanh dương không?",
        pronunciation_focus: [
          "WAR-na HI-tam-nya HA-bis, A-da WAR-na BI-ru -- `warna` = màu; `habis` = hết hàng.",
          "Lỗi người Việt: `biru` là xanh dương, không phải xanh lá. Xanh lá là `hijau`.",
          "Luyện: `Ada warna biru?`",
        ],
        pronunciation_focus_en: [
          "WAR-na HEE-tam-nya HA-bis, A-da WAR-na BEE-roo -- `warna` = color; `habis` = sold out.",
          "VN-speaker trap: `biru` is blue, not green. Green is `hijau`.",
          "Drill: `Ada warna biru?`",
        ],
      },
      {
        en: "Modelnya bagus, tapi lengannya terlalu panjang.",
        vi: "Kiểu dáng đẹp, nhưng tay áo dài quá.",
        pronunciation_focus: [
          "MO-del-nya BA-gus, TA-pi LE-ngan-nya ter-LA-lu PAN-jang -- `lengan` = tay áo/cánh tay; `terlalu panjang` = dài quá.",
          "`terlalu + tính từ` = quá: `terlalu kecil`, `terlalu ketat`, `terlalu panjang`.",
          "Luyện: `Lengannya terlalu panjang.`",
        ],
        pronunciation_focus_en: [
          "MO-del-nya BA-gus, TA-pi LE-ngan-nya ter-LA-loo PAN-jang -- `lengan` = sleeve/arm; `terlalu panjang` = too long.",
          "`Terlalu + adjective` = too: `terlalu kecil`, `terlalu ketat`, `terlalu panjang`.",
          "Drill: `Lengannya terlalu panjang.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, cửa hàng quần áo trong mall thường có `kamar pas`, size S/M/L/XL, và chính sách đổi hàng phụ thuộc `struk belanja`, tag, và tình trạng chưa mặc. Ở chợ hoặc toko kecil, đổi hàng có thể linh hoạt hơn nhưng nên hỏi trước: `Bisa tukar ukuran?` Với khí hậu nóng, người mua hay hỏi chất vải có `adem`, không bí, không quá dày.",
    cultural_notes_en:
      "In Indonesia, mall clothing stores usually have fitting rooms, S/M/L/XL sizing, and exchange policies tied to the receipt, tags, and unworn condition. At markets or small shops, exchanges may be more flexible, but ask first: `Bisa tukar ukuran?` In the hot climate, buyers often ask whether fabric feels `adem`, breathable, and not too thick.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ các cụm mua quần áo `ukuran baju`, `kamar pas`, `bahan kain`, `ada diskon`, `tukar barang`, `struk belanja`, `warna`, `model`. Khi hỏi lịch sự, dùng `boleh` cho xin phép thử đồ và `bisa` cho khả năng đổi/trả.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize clothing-shopping chunks: `ukuran baju`, `kamar pas`, `bahan kain`, `ada diskon`, `tukar barang`, `struk belanja`, `warna`, `model`. Use `boleh` for permission to try something on and `bisa` for whether exchange/return is possible.",
    vocabulary: [
      {
        word: "ukuran baju",
        en: "clothing size",
        vi: "cỡ quần áo",
        pos: "noun phrase",
        pronunciation_vi: "u-KU-ran BA-ju",
        pronunciation_en: "u-KU-ran BA-joo",
      },
      {
        word: "kamar pas",
        en: "fitting room",
        vi: "phòng thử đồ",
        pos: "noun phrase",
        pronunciation_vi: "KA-mar pas",
        pronunciation_en: "KA-mar pas",
      },
      {
        word: "bahan kain",
        en: "fabric material",
        vi: "chất vải",
        pos: "noun phrase",
        pronunciation_vi: "BA-han KAIN",
        pronunciation_en: "BA-han KAIN",
      },
      {
        word: "diskon",
        en: "discount",
        vi: "giảm giá",
        pos: "noun",
        pronunciation_vi: "DIS-kon",
        pronunciation_en: "DIS-kon",
      },
      {
        word: "tukar barang",
        en: "exchange goods/items",
        vi: "đổi hàng",
        pos: "verb phrase",
        pronunciation_vi: "TU-kar BA-rang",
        pronunciation_en: "TOO-kar BA-rang",
      },
      {
        word: "struk belanja",
        en: "shopping receipt",
        vi: "hóa đơn mua hàng",
        pos: "noun phrase",
        pronunciation_vi: "struk be-LAN-ja",
        pronunciation_en: "struk be-LAN-ja",
      },
      {
        word: "warna",
        en: "color",
        vi: "màu sắc",
        pos: "noun",
        pronunciation_vi: "WAR-na",
        pronunciation_en: "WAR-na",
      },
      {
        word: "model",
        en: "style / model",
        vi: "kiểu dáng / mẫu",
        pos: "noun",
        pronunciation_vi: "MO-del",
        pronunciation_en: "MO-del",
      },
      {
        word: "cocok",
        en: "suitable / fits well",
        vi: "hợp / vừa",
        pos: "adjective",
        pronunciation_vi: "CO-cok",
        pronunciation_en: "CHO-chok",
      },
      {
        word: "terlalu ketat",
        en: "too tight",
        vi: "quá chật",
        pos: "phrase",
        pronunciation_vi: "ter-LA-lu KE-tat",
        pronunciation_en: "ter-LA-loo KE-tat",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Mbak, ukuran M untuk model ini masih ada?",
        vi: "Chị ơi, mẫu này còn cỡ M không?",
        en: "Miss, is size M for this style still available?",
      },
      {
        speaker: "Penjual",
        text: "Ada. Mau coba di kamar pas?",
        vi: "Còn. Bạn muốn thử trong phòng thử đồ không?",
        en: "Yes. Would you like to try it in the fitting room?",
      },
      {
        speaker: "Pembeli",
        text: "Boleh. Bahannya adem, tapi lengannya terlalu panjang.",
        vi: "Được. Vải mát, nhưng tay áo dài quá.",
        en: "Yes. The fabric is cool, but the sleeves are too long.",
      },
      {
        speaker: "Penjual",
        text: "Ada ukuran lebih kecil dan warna biru.",
        vi: "Có cỡ nhỏ hơn và màu xanh dương.",
        en: "There is a smaller size and a blue color.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau tidak cocok, bisa tukar barang dengan struk?",
        vi: "Nếu không hợp, có thể đổi hàng bằng hóa đơn không?",
        en: "If it does not fit, can I exchange it with the receipt?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi thử trong phòng thử đồ được không?",
        prompt_en: "Translate into Indonesian: May I try it in the fitting room?",
        answer: "Boleh coba di kamar pas?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Tolong simpan ____ belanja untuk tukar ukuran.",
        prompt_en: "Fill in the blank: Tolong simpan ____ belanja untuk tukar ukuran.",
        answer: "struk",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["ukuran baju", "cỡ quần áo / clothing size"],
          ["kamar pas", "phòng thử đồ / fitting room"],
          ["bahan kain", "chất vải / fabric material"],
          ["tukar barang", "đổi hàng / exchange items"],
        ],
      },
    ],
    content:
      "Useful clothing-shopping chunks: `Ukuran M masih ada?` (is size M still available?), `Boleh coba di kamar pas?` (may I try it in the fitting room?), `Bahan kainnya adem` (the fabric feels cool), `Ada diskon?` (is there a discount?), `Bisa tukar barang?` (can I exchange it?), and `Simpan struk belanja` (keep the receipt).",
  },
];
