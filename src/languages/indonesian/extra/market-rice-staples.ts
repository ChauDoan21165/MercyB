// Market Rice & Staples Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_market_rice_staples",
    level: "A2",
    category: "shopping",
    title_vi: "Mua nhu yếu phẩm: gạo, dầu, trứng và đường",
    title_en: "Buying staples: rice, cooking oil, eggs and sugar",
    sentences: [
      {
        en: "Saya mau belanja bulanan untuk sembako.",
        vi: "Tôi muốn mua sắm hằng tháng cho đồ nhu yếu phẩm.",
        pronunciation_focus: [
          "SA-ya mau bel-LAN-ja bu-LA-nan un-TUK sem-BA-ko -- `belanja bulanan` = mua sắm hằng tháng; `sembako` = nhu yếu phẩm.",
          "Lỗi người Việt: dịch `monthly shopping` từng chữ. Trong Indonesia, cụm tự nhiên là `belanja bulanan`.",
          "Luyện: `Saya mau belanja bulanan.`",
        ],
        pronunciation_focus_en: [
          "SAH-ya mau bel-LAN-ja boo-LA-nan OON-took sem-BAH-ko -- `belanja bulanan` = monthly shopping; `sembako` = basic necessities.",
          "VN-speaker trap: translating `monthly shopping` word by word. Natural Indonesian is `belanja bulanan`.",
          "Drill: `Saya mau belanja bulanan.`",
        ],
      },
      {
        en: "Berasnya berapa per kilo?",
        vi: "Gạo tính bao nhiêu tiền một ký?",
        pronunciation_focus: [
          "be-RAS-nya be-RA-pa per KI-lo -- `per kilo` = theo kg; rất hay dùng ở pasar và toko.",
          "Lỗi người Việt: nói `satu kilo berapa` vẫn hiểu, nhưng hỏi giá chuẩn hơn là `berapa per kilo`.",
          "Luyện: `Beras berapa per kilo?`",
        ],
        pronunciation_focus_en: [
          "beh-RAS-nya beh-RA-pa per KEE-loh -- `per kilo` = per kilogram; very common at markets and shops.",
          "VN-speaker trap: `satu kilo berapa` may be understood, but `berapa per kilo` is the standard price question.",
          "Drill: `Beras berapa per kilo?`",
        ],
      },
      {
        en: "Minyak gorengnya naik harga minggu ini.",
        vi: "Dầu ăn tăng giá tuần này.",
        pronunciation_focus: [
          "MIN-yak GO-reng-nya naik HAR-ga MING-gu i-NI -- `naik harga` = tăng giá.",
          "Lỗi người Việt: nói `harga naik` vẫn đúng, nhưng `naik harga` rất tự nhiên khi nói giá hàng hóa.",
          "Luyện: `Minyak goreng naik harga.`",
        ],
        pronunciation_focus_en: [
          "MIN-yak GOH-reng-nya naik HAR-ga MEENG-goo ee-NEE -- `naik harga` = go up in price.",
          "VN-speaker trap: `harga naik` is okay, but `naik harga` is very natural for goods prices.",
          "Drill: `Minyak goreng naik harga.`",
        ],
      },
      {
        en: "Telurnya masih ada atau sudah habis?",
        vi: "Trứng còn không hay đã hết rồi?",
        pronunciation_focus: [
          "te-LUR-nya MA-sih A-da a-TAU SU-dah HA-bis -- `masih ada` = vẫn còn; `habis` = hết hàng.",
          "Lỗi người Việt: dùng `kosong` cho hàng hóa. Khi hỏi tồn hàng, `habis` là từ tự nhiên hơn.",
          "Luyện: `Telurnya habis?`",
        ],
        pronunciation_focus_en: [
          "te-LOOR-nya MAH-seeh AH-da ah-TAW SOO-dah HA-bees -- `masih ada` = still available; `habis` = sold out.",
          "VN-speaker trap: using `kosong` for goods. For stock, `habis` is the natural word.",
          "Drill: `Telurnya habis?`",
        ],
      },
      {
        en: "Saya cari gula yang kiloan, bukan yang sachet.",
        vi: "Tôi tìm loại đường tính theo ký, không phải gói nhỏ.",
        pronunciation_focus: [
          "SA-ya CA-ri GU-la yang ki-LO-an, BU-kan yang sa-SHET -- `kiloan` = bán theo cân/kg; `sachet` = gói nhỏ.",
          "Lỗi người Việt: đọc `kiloan` như tiếng Anh. Trong Indonesia, `kiloan` là từ rất phổ biến ở pasar.",
          "Luyện: `Saya cari gula kiloan.`",
        ],
        pronunciation_focus_en: [
          "SAH-ya CHA-ree GOO-lah yang kee-LO-an, BOO-kan yang sa-SHET -- `kiloan` = sold by the kilogram; `sachet` = small packet.",
          "VN-speaker trap: reading `kiloan` like English. In Indonesian, `kiloan` is very common at markets.",
          "Drill: `Saya cari gula kiloan.`",
        ],
      },
      {
        en: "Bisa kasih tahu merek beras yang paling murah?",
        vi: "Có thể cho tôi biết loại gạo nào rẻ nhất không?",
        pronunciation_focus: [
          "BI-sa KA-sih TA-hu ME-rek be-RAS yang pa-LING MU-rah -- `merek` = nhãn hiệu; `paling murah` = rẻ nhất.",
          "Lỗi người Việt: dùng `brand` liên tục. Trong Indonesia, `merek` là từ chuẩn và dễ hiểu hơn.",
          "Luyện: `Merek beras yang murah.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa KA-sih TA-hoo MEH-rek beh-RAS yang pah-LEENG MOO-rah -- `merek` = brand; `paling murah` = cheapest.",
          "VN-speaker trap: overusing `brand`. In Indonesian, `merek` is standard and clear.",
          "Drill: `Merek beras yang murah.`",
        ],
      },
      {
        en: "Kalau beli dua kilo, ada potongan harga?",
        vi: "Nếu mua hai ký, có giảm giá không?",
        pronunciation_focus: [
          "KA-lau be-LI DU-a KI-lo, A-da po-TONG-an HAR-ga -- `potongan harga` = giảm giá.",
          "Lỗi người Việt: hỏi `diskon` luôn cũng được, tapi `potongan harga` nghe tự nhiên ở warung/toko kecil.",
          "Luyện: `Ada potongan harga?`",
        ],
        pronunciation_focus_en: [
          "KAH-lau beh-LEE DOO-ah KEE-loh, AH-da poh-TONG-an HAR-ga -- `potongan harga` = price reduction/discount.",
          "VN-speaker trap: `diskon` is okay, but `potongan harga` sounds very natural in small shops and stalls.",
          "Drill: `Ada potongan harga?`",
        ],
      },
      {
        en: "Stoknya habis, jadi saya harus cari di toko lain.",
        vi: "Hết hàng rồi, nên tôi phải tìm ở cửa hàng khác.",
        pronunciation_focus: [
          "stok-nya HA-bis, JA-di SA-ya HA-rus CA-ri di TO-ko LA-in -- `stok habis` = hết hàng.",
          "Lỗi người Việt: nói `no stock` theo tiếng Anh. Cụm Indonesia gọn và tự nhiên là `stok habis`.",
          "Luyện: `Stoknya habis.`",
        ],
        pronunciation_focus_en: [
          "STOK-nya HA-bees, JAH-dee SAH-ya HA-roos CHA-ree dee TOH-koh LYEEN -- `stok habis` = out of stock.",
          "VN-speaker trap: saying `no stock` in English. The Indonesian phrase is short and natural: `stok habis`.",
          "Drill: `Stoknya habis.`",
        ],
      },
      {
        en: "Belanja bulanan kami biasanya dilakukan hari Sabtu.",
        vi: "Việc mua sắm hằng tháng của chúng tôi thường làm vào thứ Bảy.",
        pronunciation_focus: [
          "be-LAN-ja bu-LA-nan KA-mi bi-A-sa-nya di-la-ku-KAN HA-ri SAB-tu -- `dilakukan` = được thực hiện.",
          "Lỗi người Việt: nói `shopping bulanan` lẫn tiếng Anh. `Belanja bulanan` là cụm chuẩn.",
          "Luyện: `Belanja bulanan dilakukan hari Sabtu.`",
        ],
        pronunciation_focus_en: [
          "be-LAN-ja boo-LA-nan KAH-mee bee-AH-sah-nya dee-lah-koo-KAN HA-ree SAB-too -- `dilakukan` = carried out / done.",
          "VN-speaker trap: mixing `shopping bulanan`. `Belanja bulanan` is the standard phrase.",
          "Drill: `Belanja bulanan dilakukan hari Sabtu.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, từ `sembako` rất quen trong đời sống hằng ngày và thường chỉ nhóm nhu yếu phẩm như beras, minyak goreng, gula, telur, mie instan, garam, dan kebutuhan dapur lain. Ở pasar truyền thống, người bán thường bán theo kilo atau per bungkus, và khách hay hỏi `berapa per kilo?`, `ada potongan harga?`, hoặc `stok habis?`. Nếu giá naik, cách nói thẳng nhưng lịch sự về thay đổi giá sẽ tự nhiên hơn là than phiền quá mạnh.",
    cultural_notes_en:
      "In Indonesia, `sembako` is a very common everyday word for staple goods like rice, cooking oil, sugar, eggs, instant noodles, salt, and other kitchen necessities. At traditional markets, sellers often sell by the kilogram or per package, and customers frequently ask `berapa per kilo?`, `ada potongan harga?`, or `stok habis?`. If prices rise, speaking about the change plainly but politely sounds more natural than complaining too strongly.",
    tip_advice_vi:
      "Khung cần nhớ: `belanja bulanan`, `berapa per kilo?`, `naik harga`, `stok habis`, `potongan harga`, `merek`, `kiloan`. Khi mua hàng ở pasar, hỏi trực tiếp nhưng lịch sự sẽ hiệu quả hơn câu dài.",
    tip_advice_en:
      "Useful frames: `belanja bulanan`, `berapa per kilo?`, `naik harga`, `stok habis`, `potongan harga`, `merek`, `kiloan`. When shopping at the market, direct but polite questions work better than long sentences.",
    vocabulary: [
      {
        word: "sembako",
        en: "basic necessities / staple goods",
        vi: "nhu yếu phẩm",
        pos: "noun",
        pronunciation_vi: "sem-BA-ko",
        pronunciation_en: "sem-BAH-koh",
      },
      {
        word: "beras",
        en: "uncooked rice",
        vi: "gạo sống",
        pos: "noun",
        pronunciation_vi: "be-RAS",
        pronunciation_en: "beh-RAS",
      },
      {
        word: "minyak goreng",
        en: "cooking oil",
        vi: "dầu ăn",
        pos: "noun phrase",
        pronunciation_vi: "MIN-yak GO-reng",
        pronunciation_en: "MIN-yahk GOH-reng",
      },
      {
        word: "telur",
        en: "egg",
        vi: "trứng",
        pos: "noun",
        pronunciation_vi: "te-LUR",
        pronunciation_en: "te-LOOR",
      },
      {
        word: "gula",
        en: "sugar",
        vi: "đường",
        pos: "noun",
        pronunciation_vi: "GU-la",
        pronunciation_en: "GOO-lah",
      },
      {
        word: "kiloan",
        en: "sold by the kilogram",
        vi: "bán theo ký",
        pos: "adjective / noun",
        pronunciation_vi: "ki-LO-an",
        pronunciation_en: "kee-LOH-an",
      },
      {
        word: "stok habis",
        en: "out of stock",
        vi: "hết hàng",
        pos: "phrase",
        pronunciation_vi: "stok HA-bis",
        pronunciation_en: "stok HA-bees",
      },
      {
        word: "belanja bulanan",
        en: "monthly shopping",
        vi: "mua sắm hằng tháng",
        pos: "noun phrase",
        pronunciation_vi: "be-LAN-ja bu-LA-nan",
        pronunciation_en: "be-LAN-ja boo-LA-nan",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Pak, berasnya berapa per kilo?",
        vi: "Chú ơi, gạo tính bao nhiêu một ký?",
        en: "Sir, how much is the rice per kilo?",
      },
      {
        speaker: "Penjual",
        text: "Hari ini harganya naik sedikit, tapi masih ada potongan harga kalau beli dua kilo.",
        vi: "Hôm nay giá tăng một chút, nhưng vẫn có giảm giá nếu mua hai ký.",
        en: "The price went up a little today, but there is still a discount if you buy two kilos.",
      },
      {
        speaker: "Pembeli",
        text: "Baik, saya ambil beras, minyak goreng, telur, dan gula.",
        vi: "Được, tôi lấy gạo, dầu ăn, trứng và đường.",
        en: "Okay, I’ll take rice, cooking oil, eggs, and sugar.",
      },
      {
        speaker: "Penjual",
        text: "Silakan. Untuk belanja bulanan, stok kami masih aman.",
        vi: "Mời anh/chị. Với mua sắm hằng tháng, hàng của chúng tôi vẫn còn đủ.",
        en: "Sure. For monthly shopping, our stock is still sufficient.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau belanja ___ untuk sembako.`",
        prompt_en: "Fill in: `Saya mau belanja ___ untuk sembako.`",
        answer: "bulanan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Gạo tính bao nhiêu tiền một ký?",
        prompt_en: "Translate to Indonesian: How much is rice per kilo?",
        answer: "Berasnya berapa per kilo?",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Hết hàng rồi, nên tôi phải tìm ở cửa hàng khác.",
        prompt_en: "Translate to Indonesian: It’s out of stock, so I have to look in another shop.",
        answer: "Stoknya habis, jadi saya harus cari di toko lain.",
      },
      {
        type: "choose_best_phrase",
        prompt_vi: "Chọn cụm tự nhiên nhất khi hỏi hàng hóa có hết không.",
        prompt_en: "Choose the most natural phrase when asking whether goods are sold out.",
        options: ["stok habis", "barang tidur", "harga tutup"],
        answer: "stok habis",
      },
    ],
  },
];

