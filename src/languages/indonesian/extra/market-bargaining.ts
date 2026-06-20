// Traditional Market Bargaining Indonesian (Vietnamese -> Indonesian study track).
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_market_bargaining",
    level: "A2",
    category: "shopping",
    title_vi: "Đi chợ truyền thống và mặc cả",
    title_en: "Traditional market bargaining",
    sentences: [
      {
        en: "Saya mau belanja di pasar tradisional.",
        vi: "Tôi muốn đi mua sắm ở chợ truyền thống.",
        pronunciation_focus: [
          "SA-ya mau be-LAN-ja di PA-sar tra-di-si-o-NAL -- `pasar tradisional` = chợ truyền thống.",
          "Lỗi người Việt: dùng `ke` khi đang nói vị trí mua sắm. `Di pasar` = ở chợ; `ke pasar` = đi đến chợ.",
          "Luyện: `Saya belanja di pasar tradisional.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau be-LAN-ja di PA-sar tra-di-si-o-NAL -- `pasar tradisional` = traditional market.",
          "VN-speaker trap: using `ke` when describing where shopping happens. `Di pasar` = at the market; `ke pasar` = to the market.",
          "Drill: `Saya belanja di pasar tradisional.`",
        ],
      },
      {
        en: "Bu, mangga ini berapa sekilo?",
        vi: "Cô ơi, xoài này bao nhiêu một ký?",
        pronunciation_focus: [
          "Bu, MANG-ga I-ni be-RA-pa se-KI-lo -- `sekilo` = một ký; `berapa` = bao nhiêu.",
          "Mẹo: ở chợ, hỏi theo cân rất thường: `berapa sekilo?`, `dua kilo berapa?`, `setengah kilo boleh?`",
          "Luyện: `Ini berapa sekilo?`",
        ],
        pronunciation_focus_en: [
          "Bu, MANG-ga EE-ni be-RA-pa se-KEE-lo -- `sekilo` = one kilo; `berapa` = how much.",
          "Tip: market prices are often by weight: `berapa sekilo?`, `dua kilo berapa?`, `setengah kilo boleh?`",
          "Drill: `Ini berapa sekilo?`",
        ],
      },
      {
        en: "Bisa tawar-menawar sedikit, Pak?",
        vi: "Có thể mặc cả một chút không chú?",
        pronunciation_focus: [
          "BI-sa TA-war me-NA-war se-DI-kit, Pak -- `tawar-menawar` = mặc cả/trao đổi giá qua lại.",
          "Lỗi người Việt: lẫn `tawar` = nhạt/không mặn với `menawar` = trả giá. Cụm chợ là `tawar-menawar`.",
          "Luyện: `Bisa tawar-menawar sedikit?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa TA-war me-NA-war se-DEE-kit, Pak -- `tawar-menawar` = bargaining back and forth.",
          "VN-speaker trap: confusing `tawar` = bland/not salty with `menawar` = to offer a price. The market chunk is `tawar-menawar`.",
          "Drill: `Bisa tawar-menawar sedikit?`",
        ],
      },
      {
        en: "Kalau harga pas, saya langsung beli.",
        vi: "Nếu giá cố định/vừa giá, tôi mua ngay.",
        pronunciation_focus: [
          "KA-lau HAR-ga pas, SA-ya LANG-sung be-LI -- `harga pas` = giá chốt/giá đúng, thường không mặc cả thêm.",
          "`pas` có thể là 'vừa/đúng'. Ở chợ, `harga pas` thường nghĩa là giá đã chốt, không giảm nữa.",
          "Luyện: `Kalau harga pas, saya langsung beli.`",
        ],
        pronunciation_focus_en: [
          "KA-lau HAR-ga pas, SA-ya LANG-soong be-LEE -- `harga pas` = fixed/final price, often no more bargaining.",
          "`Pas` can mean exact/right. At a market, `harga pas` often means the final fixed price.",
          "Drill: `Kalau harga pas, saya langsung beli.`",
        ],
      },
      {
        en: "Saya langganan di sini, boleh diskon sedikit?",
        vi: "Tôi là khách quen ở đây, giảm giá một chút được không?",
        pronunciation_focus: [
          "SA-ya lang-GA-nan di SI-ni, BO-leh DIS-kon se-DI-kit -- `langganan` = khách quen; `diskon` = giảm giá.",
          "Lỗi người Việt: nói `pelanggan lama saya`. Người mua nói `saya langganan di sini` = tôi hay mua ở đây.",
          "Luyện: `Saya langganan di sini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya lang-GA-nan di SEE-ni, BO-leh DIS-kon se-DEE-kit -- `langganan` = regular customer; `diskon` = discount.",
          "VN-speaker trap: saying `pelanggan lama saya`. As the buyer, say `saya langganan di sini` = I buy here regularly.",
          "Drill: `Saya langganan di sini.`",
        ],
      },
      {
        en: "Sayurnya masih segar, ya?",
        vi: "Rau vẫn còn tươi phải không?",
        pronunciation_focus: [
          "SA-yur-nya MA-sih SE-gar, ya -- `sayur` = rau; `segar` = tươi; `masih` = vẫn/còn.",
          "Mẹo: `masih segar?` là câu kiểm tra độ tươi tự nhiên hơn dịch từng chữ `baru tidak?`.",
          "Luyện: `Sayurnya masih segar?`",
        ],
        pronunciation_focus_en: [
          "SA-yur-nya MA-sih SE-gar, ya -- `sayur` = vegetables; `segar` = fresh; `masih` = still.",
          "Tip: `masih segar?` is the natural freshness question, better than a literal `baru tidak?`.",
          "Drill: `Sayurnya masih segar?`",
        ],
      },
      {
        en: "Kalau beli tiga kilo, harganya bisa kurang?",
        vi: "Nếu mua ba ký, giá có bớt được không?",
        pronunciation_focus: [
          "KA-lau be-LI TI-ga KI-lo, HAR-ga-nya BI-sa KU-rang -- `bisa kurang?` = bớt được không.",
          "Lợi thế người Việt: mặc cả theo số lượng giống văn hóa chợ Việt. Cụm Indonesia: `kalau beli... bisa kurang?`",
          "Luyện: `Kalau beli tiga kilo, bisa kurang?`",
        ],
        pronunciation_focus_en: [
          "KA-lau be-LEE TEE-ga KEE-lo, HAR-ga-nya BEE-sa KOO-rang -- `bisa kurang?` = can it be less?",
          "VN-speaker win: quantity bargaining matches Vietnamese market culture. Indonesian frame: `kalau beli... bisa kurang?`",
          "Drill: `Kalau beli tiga kilo, bisa kurang?`",
        ],
      },
      {
        en: "Pedagang itu kasih harga bagus untuk pelanggan tetap.",
        vi: "Người bán đó cho giá tốt cho khách quen cố định.",
        pronunciation_focus: [
          "pe-DA-gang I-tu KA-sih HAR-ga BA-gus UN-tuk pe-LANG-gan TE-tap -- `pedagang` = người bán; `pelanggan tetap` = khách quen.",
          "Lỗi người Việt: dùng `penjual` mọi lúc. `Pedagang` rất tự nhiên cho người bán ở chợ.",
          "Luyện: `Pedagang itu kasih harga bagus.`",
        ],
        pronunciation_focus_en: [
          "pe-DA-gang EE-too KA-sih HAR-ga BA-goos OON-tuk pe-LANG-gan TE-tap -- `pedagang` = vendor/trader; `pelanggan tetap` = regular customer.",
          "VN-speaker trap: using `penjual` every time. `Pedagang` is very natural for a market vendor.",
          "Drill: `Pedagang itu kasih harga bagus.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở `pasar tradisional`, mặc cả thường tự nhiên hơn ở siêu thị hoặc cửa hàng có bảng giá. Tuy vậy, nếu người bán nói `harga pas`, đó thường là giá chốt. Gọi người bán bằng `Bu`, `Pak`, `Mas`, hoặc `Mbak` sẽ lịch sự hơn. Khách quen (`langganan` / `pelanggan tetap`) đôi khi được giá tốt hơn, được chọn đồ tươi hơn, hoặc được làm tròn giá. Mua theo `kiloan` rất phổ biến cho trái cây, rau, cá, thịt, và gia vị.",
    cultural_notes_en:
      "At a `pasar tradisional`, bargaining is more normal than in supermarkets or shops with posted prices. Still, if the vendor says `harga pas`, that usually means the final fixed price. Addressing vendors as `Bu`, `Pak`, `Mas`, or `Mbak` sounds polite. Regular customers (`langganan` / `pelanggan tetap`) may get better prices, fresher picks, or rounded prices. Buying by the kilo is common for fruit, vegetables, fish, meat, and spices.",
    tip_advice_vi:
      "Mẹo cho người Việt: các câu chợ quan trọng là `berapa sekilo?`, `bisa kurang?`, `boleh diskon?`, `masih segar?`, `saya langganan di sini`. Nhớ phân biệt `di pasar` (ở chợ) và `ke pasar` (đi tới chợ), `harga pas` (giá chốt) và `harga murah` (giá rẻ).",
    tip_advice_en:
      "Tip for Vietnamese speakers: key market lines are `berapa sekilo?`, `bisa kurang?`, `boleh diskon?`, `masih segar?`, `saya langganan di sini`. Keep apart `di pasar` (at the market) and `ke pasar` (to the market), plus `harga pas` (fixed/final price) and `harga murah` (cheap price).",
    vocabulary: [
      {
        word: "pasar tradisional",
        en: "traditional market",
        vi: "chợ truyền thống",
        pos: "noun phrase",
        pronunciation_vi: "PA-sar tra-di-si-o-NAL",
        pronunciation_en: "PA-sar tra-di-si-o-NAL",
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
        word: "langganan",
        en: "regular customer / to be a regular",
        vi: "khách quen / mua quen",
        pos: "noun / verb",
        pronunciation_vi: "lang-GA-nan",
        pronunciation_en: "lang-GA-nan",
      },
      {
        word: "kiloan",
        en: "by the kilo",
        vi: "tính theo ký",
        pos: "adjective / noun",
        pronunciation_vi: "ki-LO-an",
        pronunciation_en: "kee-LO-an",
      },
      {
        word: "segar",
        en: "fresh",
        vi: "tươi",
        pos: "adjective",
        pronunciation_vi: "SE-gar",
        pronunciation_en: "SE-gar",
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
        word: "pedagang",
        en: "vendor / trader",
        vi: "người bán / tiểu thương",
        pos: "noun",
        pronunciation_vi: "pe-DA-gang",
        pronunciation_en: "pe-DA-gang",
      },
      {
        word: "pelanggan tetap",
        en: "regular customer",
        vi: "khách quen cố định",
        pos: "noun phrase",
        pronunciation_vi: "pe-LANG-gan TE-tap",
        pronunciation_en: "pe-LANG-gan TE-tap",
      },
      {
        word: "bisa kurang?",
        en: "can it be cheaper?",
        vi: "bớt được không?",
        pos: "phrase",
        pronunciation_vi: "BI-sa KU-rang",
        pronunciation_en: "BEE-sa KOO-rang",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, tomat ini berapa sekilo?",
        vi: "Cô ơi, cà chua này bao nhiêu một ký?",
        en: "Ma'am, how much are these tomatoes per kilo?",
      },
      {
        speaker: "Pedagang",
        text: "Dua puluh ribu sekilo. Masih segar, baru datang pagi ini.",
        vi: "Hai mươi nghìn một ký. Vẫn tươi, mới về sáng nay.",
        en: "Twenty thousand per kilo. Still fresh, just arrived this morning.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau saya ambil dua kilo, bisa kurang?",
        vi: "Nếu tôi lấy hai ký, bớt được không?",
        en: "If I take two kilos, can it be cheaper?",
      },
      {
        speaker: "Pedagang",
        text: "Untuk langganan, delapan belas ribu sekilo saja.",
        vi: "Cho khách quen thì mười tám nghìn một ký thôi.",
        en: "For a regular customer, just eighteen thousand per kilo.",
      },
      {
        speaker: "Pembeli",
        text: "Oke, saya ambil dua kilo. Tolong pilih yang segar.",
        vi: "Được, tôi lấy hai ký. Làm ơn chọn loại tươi.",
        en: "Okay, I will take two kilos. Please choose the fresh ones.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Xoài này bao nhiêu một ký?",
        prompt_en: "Translate into Indonesian: How much are these mangoes per kilo?",
        answer: "Mangga ini berapa sekilo?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kalau beli tiga kilo, harganya bisa ____?",
        prompt_en: "Fill in the blank: Kalau beli tiga kilo, harganya bisa ____?",
        answer: "kurang",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["pasar tradisional", "chợ truyền thống / traditional market"],
          ["harga pas", "giá chốt / fixed price"],
          ["langganan", "khách quen / regular customer"],
          ["segar", "tươi / fresh"],
        ],
      },
    ],
    content:
      "Useful market chunks: `Berapa sekilo?` (how much per kilo?), `Bisa kurang?` (can it be cheaper?), `Harga pas?` (fixed price?), `Saya langganan di sini` (I am a regular here), `Masih segar?` (is it still fresh?), and `Tolong pilih yang segar` (please choose the fresh ones).",
  },
];
