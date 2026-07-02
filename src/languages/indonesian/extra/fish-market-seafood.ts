// Fish Market & Seafood Indonesian (Vietnamese -> Indonesian study track).
//
// NOTE: This file is self-contained and follows the established Indonesian
// extra lesson shape used by the sibling files in this directory.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE
// text (Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes, including common
// Vietnamese-speaker traps; `pronunciation_focus_en` is the English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus. */
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

export const fishMarketSeafoodLessons: IndonesianLesson[] = [
  {
    id: "indonesian_fish_market_buying",
    category: "shopping",
    level: "A2",
    title_vi: "Đi chợ cá: cá tươi, tôm và mực",
    title_en: "At the fish market: fresh fish, shrimp and squid",
    sentences: [
      {
        en: "Saya mau beli ikan segar di pasar ikan.",
        vi: "Tôi muốn mua cá tươi ở chợ cá.",
        pronunciation_focus: [
          "SA-ya mau be-LI I-kan SE-gar di PA-sar I-kan — `ikan segar` = cá tươi; `pasar ikan` = chợ cá.",
          "Lỗi người Việt: dùng `baru` cho 'tươi'. Với thực phẩm nói `segar`; `ikan baru` nghe như 'con cá mới'.",
          "Luyện: `Saya mau beli ikan segar di pasar ikan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau be-LEE EE-kan SE-gar di PA-sar EE-kan — `ikan segar` = fresh fish; `pasar ikan` = fish market.",
          "VN-speaker trap: using `baru` for fresh food. Use `segar`; `ikan baru` sounds like 'new fish'.",
          "Drill: `Saya mau beli ikan segar di pasar ikan.`",
        ],
      },
      {
        en: "Udangnya berapa satu kilo, Bu?",
        vi: "Tôm bao nhiêu một ký vậy cô?",
        pronunciation_focus: [
          "U-dang-nya be-RA-pa SA-tu KI-lo, Bu — `udang` = tôm; `satu kilo` = một ký; `Bu` = cô/bác gái.",
          "Lỗi người Việt: hỏi thiếu đơn vị. Ở chợ cá thường hỏi `berapa satu kilo?`, không chỉ `berapa?`.",
          "Luyện: `Udangnya berapa satu kilo, Bu?`",
        ],
        pronunciation_focus_en: [
          "OO-dang-nya be-RA-pa SA-too KEE-lo, Bu — `udang` = shrimp; `satu kilo` = one kilo; `Bu` = ma'am.",
          "VN-speaker trap: dropping the unit. At a fish market, ask `berapa satu kilo?`, not only `berapa?`.",
          "Drill: `Udangnya berapa satu kilo, Bu?`",
        ],
      },
      {
        en: "Cuminya masih segar atau sudah lama?",
        vi: "Mực này còn tươi hay để lâu rồi?",
        pronunciation_focus: [
          "CU-mi-nya MA-sih SE-gar A-tau SU-dah LA-ma — `cumi` = mực; `masih` = còn; `sudah lama` = đã lâu.",
          "Lỗi người Việt: đọc `cumi` với âm k. Chữ `c` Indonesia đọc như 'ch': `CU-mi` gần 'chu-mi'.",
          "Luyện: `Cuminya masih segar atau sudah lama?`",
        ],
        pronunciation_focus_en: [
          "CHOO-mi-nya MA-sih SE-gar A-tau SOO-dah LA-ma — `cumi` = squid; `masih` = still; `sudah lama` = old/kept long.",
          "VN-speaker trap: pronouncing Indonesian `c` like k. It is 'ch': `cumi` sounds like `choo-mi`.",
          "Drill: `Cuminya masih segar atau sudah lama?`",
        ],
      },
      {
        en: "Boleh tawar harga sedikit?",
        vi: "Tôi trả giá bớt một chút được không?",
        pronunciation_focus: [
          "BO-leh TA-war HAR-ga se-DI-kit — `boleh` = được phép; `tawar harga` = trả giá; `sedikit` = một chút.",
          "Lỗi người Việt: nói thẳng `kurang!` nghe hơi cộc. Mở bằng `boleh tawar harga sedikit?` lịch sự hơn.",
          "Luyện: `Boleh tawar harga sedikit?`",
        ],
        pronunciation_focus_en: [
          "BO-leh TA-war HAR-ga se-DEE-kit — `boleh` = may; `tawar harga` = bargain; `sedikit` = a little.",
          "VN-speaker trap: bluntly saying `kurang!`. Start with `boleh tawar harga sedikit?` for a softer bargain.",
          "Drill: `Boleh tawar harga sedikit?`",
        ],
      },
      {
        en: "Saya tidak mau yang bau amis terlalu kuat.",
        vi: "Tôi không muốn loại có mùi tanh quá nặng.",
        pronunciation_focus: [
          "SA-ya TI-dak mau yang bau A-mis ter-LA-lu KU-at — `bau amis` = mùi tanh; `terlalu kuat` = quá nặng/quá mạnh.",
          "Lỗi người Việt: dịch 'tanh' thành `busuk`. `Busuk` là thối/hỏng; mùi tanh cá là `amis`.",
          "Luyện: `Saya tidak mau yang bau amis terlalu kuat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak mau yang bau A-mis ter-LA-lu KOO-at — `bau amis` = fishy smell; `terlalu kuat` = too strong.",
          "VN-speaker trap: translating fishy smell as `busuk`. `Busuk` means rotten; the fish smell is `amis`.",
          "Drill: `Saya tidak mau yang bau amis terlalu kuat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, chợ cá thường nhộn nhịp từ rất sớm. Người mua nhìn mắt cá, mang cá, độ săn của thịt và mùi `amis` để đoán độ tươi. Trả giá nhẹ là bình thường ở chợ truyền thống, nhưng nên dùng giọng thân thiện và gọi người bán là `Bu`, `Pak`, `Mas`, hoặc `Mbak`.",
    cultural_notes_en:
      "Indonesian fish markets are often busiest early in the morning. Buyers check the eyes, gills, firmness and fishy smell to judge freshness. Light bargaining is normal in traditional markets, but keep the tone friendly and address sellers as `Bu`, `Pak`, `Mas`, or `Mbak`.",
    tip_advice_vi:
      "Khung hữu ích: `___ berapa satu kilo?`, `masih segar?`, `boleh tawar harga sedikit?`. Nhớ phân biệt `segar` = tươi, `amis` = tanh, `busuk` = thối/hỏng.",
    tip_advice_en:
      "Useful frames: `___ berapa satu kilo?`, `masih segar?`, `boleh tawar harga sedikit?`. Keep `segar` = fresh, `amis` = fishy, and `busuk` = rotten separate.",
    vocabulary: [
      {
        word: "pasar ikan",
        en: "fish market",
        vi: "chợ cá",
        pos: "noun",
        pronunciation_vi: "PA-sar I-kan",
        pronunciation_en: "PA-sar EE-kan",
      },
      {
        word: "ikan segar",
        en: "fresh fish",
        vi: "cá tươi",
        pos: "noun phrase",
        pronunciation_vi: "I-kan SE-gar",
        pronunciation_en: "EE-kan SE-gar",
      },
      {
        word: "udang",
        en: "shrimp / prawn",
        vi: "tôm",
        pos: "noun",
        pronunciation_vi: "U-dang",
        pronunciation_en: "OO-dang",
      },
      {
        word: "cumi",
        en: "squid",
        vi: "mực",
        pos: "noun",
        pronunciation_vi: "CU-mi",
        pronunciation_en: "CHOO-mi",
      },
      {
        word: "tawar harga",
        en: "to bargain over price",
        vi: "trả giá / mặc cả",
        pos: "verb phrase",
        pronunciation_vi: "TA-war HAR-ga",
        pronunciation_en: "TA-war HAR-ga",
      },
      {
        word: "bau amis",
        en: "fishy smell",
        vi: "mùi tanh",
        pos: "noun phrase",
        pronunciation_vi: "bau A-mis",
        pronunciation_en: "bau A-mis",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, udangnya berapa satu kilo?",
        vi: "Cô ơi, tôm bao nhiêu một ký?",
        en: "Ma'am, how much is the shrimp per kilo?",
      },
      {
        speaker: "Penjual",
        text: "Satu kilo delapan puluh ribu, masih segar.",
        vi: "Một ký tám mươi nghìn, còn tươi.",
        en: "One kilo is eighty thousand, still fresh.",
      },
      {
        speaker: "Pembeli",
        text: "Boleh tawar sedikit? Saya ambil dua kilo kalau cocok.",
        vi: "Bớt một chút được không? Nếu hợp giá tôi lấy hai ký.",
        en: "May I bargain a little? I'll take two kilos if the price works.",
      },
      {
        speaker: "Penjual",
        text: "Boleh, dua kilo seratus lima puluh ribu saja.",
        vi: "Được, hai ký một trăm năm mươi nghìn thôi.",
        en: "Sure, two kilos for one hundred fifty thousand.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau beli ikan ___ di pasar ikan.`",
        prompt_en: "Fill in: `Saya mau beli ikan ___ di pasar ikan.`",
        answer: "segar",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Mực này còn tươi không?",
        prompt_en: "Translate to Indonesian: Is this squid still fresh?",
        answer: "Cuminya masih segar?",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là 'mùi tanh'?",
        prompt_en: "Which phrase means 'fishy smell'?",
        options: ["bau amis", "ikan baru", "harga cocok"],
        answer: "bau amis",
      },
    ],
  },
  {
    id: "indonesian_seafood_cleaning_grilling",
    category: "food",
    level: "B1",
    title_vi: "Làm sạch hải sản và nướng",
    title_en: "Cleaning seafood and grilling",
    sentences: [
      {
        en: "Tolong ikannya dibersihkan sekalian.",
        vi: "Làm ơn làm sạch cá luôn giúp tôi.",
        pronunciation_focus: [
          "TO-long I-kan-nya di-BER-sih-kan se-KA-li-an — `dibersihkan` = được làm sạch; `sekalian` = tiện thể/luôn.",
          "Lỗi người Việt: nói `bersih ikan` theo trật tự tiếng Việt. Khi nhờ người bán làm sạch cá, dùng bị động `ikannya dibersihkan`.",
          "Luyện: `Tolong ikannya dibersihkan sekalian.`",
        ],
        pronunciation_focus_en: [
          "TO-long EE-kan-nya di-BER-sih-kan se-KA-li-an — `dibersihkan` = cleaned; `sekalian` = at the same time/as well.",
          "VN-speaker trap: saying `bersih ikan` by Vietnamese word order. When asking the seller to clean the fish, use passive `ikannya dibersihkan`.",
          "Drill: `Tolong ikannya dibersihkan sekalian.`",
        ],
      },
      {
        en: "Kepala dan sisiknya dibuang, ya.",
        vi: "Bỏ đầu và vảy đi nhé.",
        pronunciation_focus: [
          "ke-PA-la dan SI-sik-nya di-BU-ang, ya — `kepala` = đầu; `sisik` = vảy; `dibuang` = bị bỏ đi.",
          "Lỗi người Việt: `sisik` khác `kulit`. `Sisik` là vảy cá; `kulit` là da/vỏ.",
          "Luyện: `Kepala dan sisiknya dibuang, ya.`",
        ],
        pronunciation_focus_en: [
          "ke-PA-la dan SEE-sik-nya di-BOO-ang, ya — `kepala` = head; `sisik` = scales; `dibuang` = removed/thrown away.",
          "VN-speaker trap: mixing up `sisik` and `kulit`. `Sisik` means fish scales; `kulit` is skin.",
          "Drill: `Kepala dan sisiknya dibuang, ya.`",
        ],
      },
      {
        en: "Cumi ini mau saya masak bakar.",
        vi: "Mực này tôi muốn nấu kiểu nướng.",
        pronunciation_focus: [
          "CU-mi I-ni mau SA-ya MA-sak BA-kar — `masak bakar` = nấu kiểu nướng; `bakar` = nướng/đốt.",
          "Lỗi người Việt: dùng `panggang` cho mọi món nướng. Đời thường, hải sản nướng hay nói `bakar`: `ikan bakar`, `cumi bakar`.",
          "Luyện: `Cumi ini mau saya masak bakar.`",
        ],
        pronunciation_focus_en: [
          "CHOO-mi EE-ni mau SA-ya MA-sak BA-kar — `masak bakar` = cook by grilling; `bakar` = grill/burn.",
          "VN-speaker trap: using `panggang` for every kind of grilling. In daily seafood talk, `bakar` is common: `ikan bakar`, `cumi bakar`.",
          "Drill: `Cumi ini mau saya masak bakar.`",
        ],
      },
      {
        en: "Udang jangan dikupas semua.",
        vi: "Đừng bóc vỏ hết tất cả tôm.",
        pronunciation_focus: [
          "U-dang JA-ngan di-KU-pas SE-mu-a — `dikupas` = được bóc vỏ; `semua` = tất cả.",
          "Lỗi người Việt: đặt `jangan` sau động từ. Lệnh phủ định đứng trước cụm bị động: `jangan dikupas semua`.",
          "Luyện: `Udang jangan dikupas semua.`",
        ],
        pronunciation_focus_en: [
          "OO-dang JA-ngan di-KOO-pas se-MOO-a — `dikupas` = peeled; `semua` = all.",
          "VN-speaker trap: putting `jangan` after the verb. The negative command comes before the passive phrase: `jangan dikupas semua`.",
          "Drill: `Udang jangan dikupas semua.`",
        ],
      },
      {
        en: "Bisa dibungkus dengan es supaya tetap segar?",
        vi: "Có thể gói với đá để giữ tươi không?",
        pronunciation_focus: [
          "BI-sa di-BUNG-kus de-NGAN es su-PA-ya TE-tap SE-gar — `dibungkus` = được gói; `dengan es` = với đá; `supaya` = để/nhằm.",
          "Lỗi người Việt: dịch 'để' thành `untuk` trong mọi câu. Khi nói mục đích 'để cho vẫn tươi', `supaya tetap segar` rất tự nhiên.",
          "Luyện: `Bisa dibungkus dengan es supaya tetap segar?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa di-BOONG-kus de-NGAN es su-PA-ya TE-tap SE-gar — `dibungkus` = wrapped/packed; `dengan es` = with ice; `supaya` = so that.",
          "VN-speaker trap: translating every 'so that' as `untuk`. For a result/purpose clause, `supaya tetap segar` is natural.",
          "Drill: `Bisa dibungkus dengan es supaya tetap segar?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều người bán cá ở chợ truyền thống có thể làm sạch cá tại chỗ: bỏ vảy, bỏ ruột, chặt khúc hoặc gói với đá. Nếu định nướng, người mua thường nói `mau dibakar` hoặc `mau masak bakar` để người bán chuẩn bị phù hợp.",
    cultural_notes_en:
      "Many sellers in traditional markets can clean fish on the spot: remove scales, gut it, cut it into pieces, or pack it with ice. If you plan to grill it, buyers often say `mau dibakar` or `mau masak bakar` so the seller can prepare it accordingly.",
    tip_advice_vi:
      "Hải sản ở chợ dùng nhiều dạng bị động `di-`: `dibersihkan`, `dibuang`, `dikupas`, `dibungkus`. Đây là cách tự nhiên để nói việc bạn muốn người bán làm cho món hàng.",
    tip_advice_en:
      "Fish-market requests use many passive `di-` forms: `dibersihkan`, `dibuang`, `dikupas`, `dibungkus`. This is the natural way to describe what you want done to the item.",
    vocabulary: [
      {
        word: "dibersihkan",
        en: "cleaned",
        vi: "được làm sạch",
        pos: "verb",
        pronunciation_vi: "di-BER-sih-kan",
        pronunciation_en: "di-BER-sih-kan",
      },
      {
        word: "sisik",
        en: "fish scales",
        vi: "vảy cá",
        pos: "noun",
        pronunciation_vi: "SI-sik",
        pronunciation_en: "SEE-sik",
      },
      {
        word: "dibuang",
        en: "removed / thrown away",
        vi: "bị bỏ đi",
        pos: "verb",
        pronunciation_vi: "di-BU-ang",
        pronunciation_en: "di-BOO-ang",
      },
      {
        word: "masak bakar",
        en: "cook by grilling",
        vi: "nấu kiểu nướng",
        pos: "verb phrase",
        pronunciation_vi: "MA-sak BA-kar",
        pronunciation_en: "MA-sak BA-kar",
      },
      {
        word: "dikupas",
        en: "peeled",
        vi: "được bóc vỏ",
        pos: "verb",
        pronunciation_vi: "di-KU-pas",
        pronunciation_en: "di-KOO-pas",
      },
      {
        word: "dibungkus",
        en: "wrapped / packed",
        vi: "được gói",
        pos: "verb",
        pronunciation_vi: "di-BUNG-kus",
        pronunciation_en: "di-BOONG-kus",
      },
      {
        word: "tetap segar",
        en: "stay fresh",
        vi: "giữ tươi",
        pos: "phrase",
        pronunciation_vi: "TE-tap SE-gar",
        pronunciation_en: "TE-tap SE-gar",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Pak, ikannya tolong dibersihkan sekalian.",
        vi: "Chú ơi, làm sạch cá luôn giúp tôi.",
        en: "Sir, please clean the fish as well.",
      },
      {
        speaker: "Penjual",
        text: "Mau dibuang kepala dan sisiknya?",
        vi: "Có muốn bỏ đầu và vảy không?",
        en: "Do you want the head and scales removed?",
      },
      {
        speaker: "Pembeli",
        text: "Iya, tapi udangnya jangan dikupas semua.",
        vi: "Vâng, nhưng tôm đừng bóc vỏ hết.",
        en: "Yes, but don't peel all the shrimp.",
      },
      {
        speaker: "Penjual",
        text: "Baik. Nanti saya bungkus dengan es.",
        vi: "Được. Lát nữa tôi gói với đá.",
        en: "Okay. I'll pack it with ice.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Tolong ikannya ___ sekalian.`",
        prompt_en: "Fill in: `Tolong ikannya ___ sekalian.`",
        answer: "dibersihkan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Đừng bóc vỏ hết tất cả tôm.",
        prompt_en: "Translate to Indonesian: Don't peel all the shrimp.",
        answer: "Udang jangan dikupas semua.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `sisik`, `dibungkus`, `tetap segar`.",
        prompt_en: "Match meanings: `sisik`, `dibungkus`, `tetap segar`.",
        pairs: [
          ["sisik", "vảy cá / fish scales"],
          ["dibungkus", "được gói / wrapped"],
          ["tetap segar", "giữ tươi / stay fresh"],
        ],
      },
    ],
  },
];
