// Smartphone Buying & Negotiation Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_smartphone_buying_negotiation",
    level: "B1",
    category: "shopping",
    title_vi: "Mua điện thoại và thương lượng giá",
    title_en: "Buying a smartphone and negotiating price",
    sentences: [
      {
        en: "Saya mau beli HP baru dengan garansi resmi.",
        vi: "Tôi muốn mua điện thoại mới có bảo hành chính hãng.",
        pronunciation_focus: [
          "SA-ya mau BE-li HA-pe BA-ru DE-ngan ga-RAN-si res-MI -- `HP` dibaca `ha-pe`, nghĩa là điện thoại; `garansi resmi` = bảo hành chính hãng.",
          "Lỗi người Việt: đọc `HP` như tiếng Anh. Ở Indonesia nói `ha-pe`, rất phổ biến trong cửa hàng.",
          "Luyện: `Saya mau beli HP baru.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BE-li HA-pe BA-ru DE-ngan ga-RAN-si res-MEE -- `HP` is read `ha-pe`, meaning phone; `garansi resmi` = official warranty.",
          "VN-speaker trap: reading `HP` like English. In Indonesia, say `ha-pe`; it is very common in shops.",
          "Drill: `Saya mau beli HP baru.`",
        ],
      },
      {
        en: "Spesifikasi HP ini cocok untuk kerja dan foto?",
        vi: "Thông số của điện thoại này có phù hợp cho công việc và chụp ảnh không?",
        pronunciation_focus: [
          "spe-si-fi-KA-si HA-pe I-ni CO-cok UN-tuk KER-ja dan FO-to -- `spesifikasi` = thông số; `cocok untuk` = phù hợp cho.",
          "`cocok` đọc CHO-chok vì `c` trong tiếng Indonesia = âm 'ch'.",
          "Luyện: `Spesifikasinya cocok untuk kerja?`",
        ],
        pronunciation_focus_en: [
          "spe-si-fi-KA-si HA-pe EE-ni CHO-chok OON-tuk KER-ja dan FO-to -- `spesifikasi` = specifications; `cocok untuk` = suitable for.",
          "`Cocok` is CHO-chok because Indonesian `c` makes a 'ch' sound.",
          "Drill: `Spesifikasinya cocok untuk kerja?`",
        ],
      },
      {
        en: "RAM-nya berapa, dan memorinya bisa ditambah?",
        vi: "RAM là bao nhiêu, và bộ nhớ có thể tăng thêm không?",
        pronunciation_focus: [
          "RAM-nya be-RA-pa, dan me-MO-ri-nya BI-sa di-TAM-bah -- `RAM-nya berapa` = RAM bao nhiêu; `memori` = bộ nhớ.",
          "Mẹo: hỏi thông số bằng `berapa`, không dùng `apa`: `RAM-nya berapa?`, `memorinya berapa?`",
          "Luyện: `RAM-nya berapa?`",
        ],
        pronunciation_focus_en: [
          "RAM-nya be-RA-pa, dan me-MO-ri-nya BEE-sa di-TAM-bah -- `RAM-nya berapa` = how much RAM; `memori` = storage/memory.",
          "Tip: ask specs with `berapa`, not `apa`: `RAM-nya berapa?`, `memorinya berapa?`",
          "Drill: `RAM-nya berapa?`",
        ],
      },
      {
        en: "Ada pilihan memori 128 GB atau 256 GB?",
        vi: "Có lựa chọn bộ nhớ 128 GB hoặc 256 GB không?",
        pronunciation_focus: [
          "A-da pi-LIH-an me-MO-ri se-RA-tus du-a pu-luh de-LA-pan gi-ga A-tau du-a RA-tus li-ma pu-luh E-nam gi-ga -- `pilihan` = lựa chọn.",
          "Trong cửa hàng, `memori` thường chỉ dung lượng lưu trữ; nếu cần rõ hơn có thể nói `memori internal`.",
          "Luyện: `Ada pilihan memori 256 GB?`",
        ],
        pronunciation_focus_en: [
          "A-da pi-LEE-han me-MO-ri 128 GB A-tau 256 GB -- `pilihan` = option/choice.",
          "In shops, `memori` often means storage capacity; for clarity you can say `memori internal`.",
          "Drill: `Ada pilihan memori 256 GB?`",
        ],
      },
      {
        en: "Kalau bayar cicilan, bunga dan biaya adminnya berapa?",
        vi: "Nếu trả góp, lãi và phí admin là bao nhiêu?",
        pronunciation_focus: [
          "KA-lau BA-yar ci-CIL-an, BU-nga dan bi-A-ya ad-MIN-nya be-RA-pa -- `cicilan` = trả góp; `bunga` = lãi.",
          "Lỗi người Việt: thấy `bunga` chỉ nghĩ là hoa. Trong tài chính, `bunga` = lãi suất/lãi.",
          "Luyện: `Kalau bayar cicilan, bunganya berapa?`",
        ],
        pronunciation_focus_en: [
          "KA-lau BA-yar chi-CHIL-an, BOO-nga dan bee-A-ya ad-MIN-nya be-RA-pa -- `cicilan` = installment; `bunga` = interest.",
          "VN-speaker trap: reading `bunga` only as flower. In finance, `bunga` means interest.",
          "Drill: `Kalau bayar cicilan, bunganya berapa?`",
        ],
      },
      {
        en: "HP lama saya bisa tukar tambah?",
        vi: "Điện thoại cũ của tôi có thể bù tiền đổi máy mới không?",
        pronunciation_focus: [
          "HA-pe LA-ma SA-ya BI-sa TU-kar TAM-bah -- `tukar tambah` = đổi cũ bù tiền lấy mới.",
          "`tukar` = đổi; `tambah` = thêm. Cụm `tukar tambah` rất hay gặp khi mua HP, xe, hoặc đồ điện tử.",
          "Luyện: `Bisa tukar tambah?`",
        ],
        pronunciation_focus_en: [
          "HA-pe LA-ma SA-ya BEE-sa TOO-kar TAM-bah -- `tukar tambah` = trade-in plus extra payment.",
          "`Tukar` = exchange; `tambah` = add. The phrase `tukar tambah` is common for phones, vehicles, and electronics.",
          "Drill: `Bisa tukar tambah?`",
        ],
      },
      {
        en: "Kalau saya ambil hari ini, bisa nego harga sedikit?",
        vi: "Nếu tôi lấy hôm nay, có thể thương lượng giá một chút không?",
        pronunciation_focus: [
          "KA-lau SA-ya AM-bil HA-ri I-ni, BI-sa NE-go HAR-ga se-DI-kit -- `nego harga` = thương lượng giá; `ambil` = lấy/mua trong ngữ cảnh mua hàng.",
          "Mẹo: `nego` thân mật hơn `negosiasi`, nhưng rất tự nhiên ở cửa hàng.",
          "Luyện: `Bisa nego harga sedikit?`",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya AM-bil HA-ri EE-ni, BEE-sa NE-go HAR-ga se-DEE-kit -- `nego harga` = negotiate the price; `ambil` = take/buy in a shopping context.",
          "Tip: `nego` is more casual than `negosiasi`, but very natural in shops.",
          "Drill: `Bisa nego harga sedikit?`",
        ],
      },
      {
        en: "Harga pasnya sudah termasuk charger dan pelindung layar?",
        vi: "Giá chốt đã bao gồm sạc và miếng dán bảo vệ màn hình chưa?",
        pronunciation_focus: [
          "HAR-ga pas-nya SU-dah ter-MA-suk CHAR-ger dan pe-LIN-dung LA-yar -- `harga pas` = giá chốt; `termasuk` = bao gồm.",
          "Lỗi người Việt: quên hỏi phụ kiện. Ở quầy HP, hỏi `sudah termasuk... ?` để tránh hiểu nhầm.",
          "Luyện: `Sudah termasuk charger?`",
        ],
        pronunciation_focus_en: [
          "HAR-ga pas-nya SOO-dah ter-MA-suk CHAR-ger dan pe-LIN-doong LA-yar -- `harga pas` = final/fixed price; `termasuk` = included.",
          "VN-speaker trap: forgetting to ask about accessories. At a phone counter, ask `sudah termasuk... ?` to avoid confusion.",
          "Drill: `Sudah termasuk charger?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, điện thoại thường gọi là `HP` đọc `ha-pe`. Khi mua ở toko HP hoặc mal, người mua hay hỏi `garansi resmi`, `RAM`, `memori`, `harga pas`, `cicilan`, và `tukar tambah`. Giá ở toko kecil có thể còn thương lượng nhẹ, nhưng trong toko resmi hoặc chuỗi lớn thường ít giảm hơn. Luôn hỏi rõ phụ kiện đi kèm, điều kiện garansi, và biaya admin nếu trả góp.",
    cultural_notes_en:
      "In Indonesia, a mobile phone is commonly called `HP`, pronounced `ha-pe`. When buying at a phone shop or mall, buyers often ask about `garansi resmi`, RAM, storage, final price, installments, and trade-in. Prices at small shops may allow light negotiation, while official stores or larger chains are usually less flexible. Always ask clearly about included accessories, warranty conditions, and admin fees if paying in installments.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm mua hàng: `beli HP`, `spesifikasi`, `RAM-nya berapa`, `memori 256 GB`, `garansi resmi`, `bayar cicilan`, `tukar tambah`, `nego harga`. Với giá và thông số, dùng `berapa`; với lựa chọn, dùng `ada pilihan... ?`; với phụ kiện, dùng `sudah termasuk... ?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn shopping chunks: `beli HP`, `spesifikasi`, `RAM-nya berapa`, `memori 256 GB`, `garansi resmi`, `bayar cicilan`, `tukar tambah`, `nego harga`. For price and specs, use `berapa`; for options, use `ada pilihan... ?`; for accessories, use `sudah termasuk... ?`.",
    vocabulary: [
      {
        word: "beli HP",
        en: "buy a phone",
        vi: "mua điện thoại",
        pos: "verb phrase",
        pronunciation_vi: "BE-li HA-pe",
        pronunciation_en: "BE-li HA-pe",
      },
      {
        word: "spesifikasi",
        en: "specifications",
        vi: "thông số kỹ thuật",
        pos: "noun",
        pronunciation_vi: "spe-si-fi-KA-si",
        pronunciation_en: "spe-si-fi-KA-see",
      },
      {
        word: "RAM",
        en: "RAM",
        vi: "RAM",
        pos: "noun",
        pronunciation_vi: "RAM",
        pronunciation_en: "RAM",
      },
      {
        word: "memori",
        en: "memory / storage",
        vi: "bộ nhớ / dung lượng lưu trữ",
        pos: "noun",
        pronunciation_vi: "me-MO-ri",
        pronunciation_en: "me-MO-ree",
      },
      {
        word: "garansi resmi",
        en: "official warranty",
        vi: "bảo hành chính hãng",
        pos: "noun phrase",
        pronunciation_vi: "ga-RAN-si res-MI",
        pronunciation_en: "ga-RAN-see res-MEE",
      },
      {
        word: "cicilan",
        en: "installments",
        vi: "trả góp",
        pos: "noun",
        pronunciation_vi: "ci-CIL-an",
        pronunciation_en: "chi-CHIL-an",
      },
      {
        word: "tukar tambah",
        en: "trade-in",
        vi: "đổi cũ bù tiền lấy mới",
        pos: "verb phrase",
        pronunciation_vi: "TU-kar TAM-bah",
        pronunciation_en: "TOO-kar TAM-bah",
      },
      {
        word: "nego harga",
        en: "negotiate the price",
        vi: "thương lượng giá",
        pos: "verb phrase",
        pronunciation_vi: "NE-go HAR-ga",
        pronunciation_en: "NE-go HAR-ga",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Permisi, saya mau beli HP baru dengan garansi resmi.",
        vi: "Xin phép, tôi muốn mua điện thoại mới có bảo hành chính hãng.",
        en: "Excuse me, I want to buy a new phone with official warranty.",
      },
      {
        speaker: "Penjual",
        text: "Boleh. Mau RAM berapa dan memori berapa?",
        vi: "Được. Anh/chị muốn RAM bao nhiêu và bộ nhớ bao nhiêu?",
        en: "Sure. How much RAM and storage do you want?",
      },
      {
        speaker: "Pembeli",
        text: "Saya cari yang RAM 8 GB dan memori 256 GB.",
        vi: "Tôi tìm loại RAM 8 GB và bộ nhớ 256 GB.",
        en: "I am looking for one with 8 GB RAM and 256 GB storage.",
      },
      {
        speaker: "Penjual",
        text: "Model ini ada cicilan, tapi ada biaya admin.",
        vi: "Mẫu này có trả góp, nhưng có phí admin.",
        en: "This model has installment payment, but there is an admin fee.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau HP lama saya tukar tambah, bisa nego harga sedikit?",
        vi: "Nếu tôi đổi máy cũ bù tiền, có thể thương lượng giá một chút không?",
        en: "If I trade in my old phone, can we negotiate the price a little?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Điện thoại cũ của tôi có thể đổi cũ bù tiền không?'",
        prompt_en: "Translate into Indonesian: 'Can my old phone be traded in?'",
        answer: "HP lama saya bisa tukar tambah?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau beli HP baru dengan garansi ____.`",
        prompt_en: "Fill in the blank: `Saya mau beli HP baru dengan garansi ____.`",
        answer: "resmi",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["nego harga", "thương lượng giá"],
          ["bayar cicilan", "trả góp"],
          ["pelindung layar", "miếng dán bảo vệ màn hình"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở toko HP. Hỏi về RAM, memori, garansi resmi, cicilan, tukar tambah, và xin nego harga nếu mua hôm nay.",
        prompt_en:
          "You are at a phone shop. Ask about RAM, storage, official warranty, installments, trade-in, and request price negotiation if buying today.",
      },
    ],
    content:
      "Use this lesson for practical Indonesian at a phone shop: comparing smartphone specs, asking about RAM and storage, checking official warranty, discussing installment payments, trading in an old phone, and negotiating the final price.",
  },
];
