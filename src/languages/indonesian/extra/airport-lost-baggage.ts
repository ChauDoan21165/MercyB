// Airport Lost Baggage Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_airport_lost_baggage",
    level: "B1",
    category: "travel",
    title_vi: "Thất lạc hành lý ở sân bay",
    title_en: "Lost baggage at the airport",
    sentences: [
      {
        en: "Bagasi saya belum keluar di ban berjalan.",
        vi: "Hành lý ký gửi của tôi chưa ra ở băng chuyền.",
        pronunciation_focus: [
          "ba-GA-si SA-ya be-LUM ke-LU-ar di ban ber-JA-lan -- `bagasi` = hành lý ký gửi; `ban berjalan` = băng chuyền.",
          "Lỗi người Việt: dùng `barang` cho hành lý máy bay. Ở sân bay, nói `bagasi` rõ hơn.",
          "Luyện: `Bagasi saya belum keluar.`",
        ],
        pronunciation_focus_en: [
          "ba-GA-si SA-ya be-LOOM ke-LOO-ar di ban ber-JA-lan -- `bagasi` = checked baggage; `ban berjalan` = conveyor belt.",
          "VN-speaker trap: using `barang` for airport luggage. At the airport, `bagasi` is clearer.",
          "Drill: `Bagasi saya belum keluar.`",
        ],
      },
      {
        en: "Koper saya hilang setelah penerbangan dari Jakarta.",
        vi: "Va-li của tôi bị mất sau chuyến bay từ Jakarta.",
        pronunciation_focus: [
          "KO-per SA-ya HI-lang se-TE-lah pe-ner-BA-ngan da-ri Ja-KAR-ta -- `koper` = va-li; `penerbangan` = chuyến bay.",
          "`hilang` = mất/thất lạc. Không cần thêm `sudah` nếu đang báo tình huống hiện tại.",
          "Luyện: `Koper saya hilang.`",
        ],
        pronunciation_focus_en: [
          "KO-per SA-ya HEE-lang se-TE-lah pe-ner-BA-ngan da-ri Ja-KAR-ta -- `koper` = suitcase; `penerbangan` = flight.",
          "`Hilang` = missing/lost. You do not need `sudah` when reporting the current situation.",
          "Drill: `Koper saya hilang.`",
        ],
      },
      {
        en: "Saya mau membuat klaim bagasi hilang.",
        vi: "Tôi muốn lập yêu cầu xử lý hành lý thất lạc.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at klaim ba-GA-si HI-lang -- `klaim bagasi` = yêu cầu/báo cáo hành lý thất lạc.",
          "Mẹo: với hãng bay, dùng `membuat klaim` hoặc `mengajukan klaim`, không nói `minta koper` đơn giản.",
          "Luyện: `Saya mau membuat klaim bagasi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at claim ba-GA-si HEE-lang -- `klaim bagasi` = lost-baggage claim/report.",
          "Tip: with an airline, use `membuat klaim` or `mengajukan klaim`, not just `minta koper`.",
          "Drill: `Saya mau membuat klaim bagasi.`",
        ],
      },
      {
        en: "Ini nomor penerbangan dan boarding pass saya.",
        vi: "Đây là số chuyến bay và thẻ lên máy bay của tôi.",
        pronunciation_focus: [
          "I-ni NO-mor pe-ner-BA-ngan dan BOR-ding pas SA-ya -- `nomor penerbangan` = số chuyến bay.",
          "Trong giấy tờ sân bay, `nomor` rất quan trọng: nomor penerbangan, nomor paspor, nomor klaim.",
          "Luyện: `Ini nomor penerbangan saya.`",
        ],
        pronunciation_focus_en: [
          "EE-ni NO-mor pe-ner-BA-ngan dan BOR-ding pass SA-ya -- `nomor penerbangan` = flight number.",
          "In airport paperwork, `nomor` matters: flight number, passport number, claim number.",
          "Drill: `Ini nomor penerbangan saya.`",
        ],
      },
      {
        en: "Label bagasi saya masih ada di tiket.",
        vi: "Nhãn hành lý của tôi vẫn còn trên vé.",
        pronunciation_focus: [
          "LA-bel ba-GA-si SA-ya MA-sih A-da di TI-ket -- `label bagasi` = nhãn/thẻ hành lý; `masih ada` = vẫn còn.",
          "Lỗi người Việt: nói `stiker koper` được hiểu, nhưng thuật ngữ sân bay tự nhiên hơn là `label bagasi`.",
          "Luyện: `Label bagasi saya masih ada.`",
        ],
        pronunciation_focus_en: [
          "LA-bel ba-GA-si SA-ya MA-sih A-da di TEE-ket -- `label bagasi` = baggage tag/label; `masih ada` = still there.",
          "VN-speaker trap: `stiker koper` may be understood, but the natural airport term is `label bagasi`.",
          "Drill: `Label bagasi saya masih ada.`",
        ],
      },
      {
        en: "Koper saya berwarna hitam, ukurannya besar, dan ada pita merah.",
        vi: "Va-li của tôi màu đen, cỡ lớn, và có ruy-băng đỏ.",
        pronunciation_focus: [
          "KO-per SA-ya ber-WAR-na HI-tam, u-KU-ran-nya BE-sar, dan A-da PI-ta ME-rah -- `berwarna` = có màu; `pita` = ruy-băng.",
          "Mẹo: mô tả hành lý theo màu, ukuran, merek, tanda khusus: `warna`, `ukuran`, `merek`, `ciri khusus`.",
          "Luyện: `Koper saya berwarna hitam.`",
        ],
        pronunciation_focus_en: [
          "KO-per SA-ya ber-WAR-na HEE-tam, u-KU-ran-nya BE-sar, dan A-da PEE-ta ME-rah -- `berwarna` = colored; `pita` = ribbon.",
          "Tip: describe luggage by color, size, brand, special mark: `warna`, `ukuran`, `merek`, `ciri khusus`.",
          "Drill: `Koper saya berwarna hitam.`",
        ],
      },
      {
        en: "Petugas bandara meminta saya mengisi laporan kehilangan.",
        vi: "Nhân viên sân bay yêu cầu tôi điền báo cáo thất lạc.",
        pronunciation_focus: [
          "pe-TU-gas ban-DA-ra me-MIN-ta SA-ya meng-I-si la-PO-ran ke-hi-LANG-an -- `petugas bandara` = nhân viên sân bay; `laporan kehilangan` = báo cáo mất/thất lạc.",
          "`mengisi laporan` = điền báo cáo/biểu mẫu; khác với `melapor` = đi trình báo.",
          "Luyện: `Saya mengisi laporan kehilangan.`",
        ],
        pronunciation_focus_en: [
          "pe-TOO-gas ban-DA-ra me-MIN-ta SA-ya meng-EE-si la-PO-ran ke-hi-LANG-an -- `petugas bandara` = airport staff; `laporan kehilangan` = loss report.",
          "`Mengisi laporan` = fill out a report/form; different from `melapor` = report an incident.",
          "Drill: `Saya mengisi laporan kehilangan.`",
        ],
      },
      {
        en: "Kapan bagasi saya bisa dikirim ke hotel?",
        vi: "Khi nào hành lý của tôi có thể được gửi đến khách sạn?",
        pronunciation_focus: [
          "KA-pan ba-GA-si SA-ya BI-sa di-KI-rim ke ho-TEL -- `dikirim` = được gửi; `ke hotel` = đến khách sạn.",
          "Bị động `di-` rất hữu ích khi hỏi dịch vụ: `dikirim`, `diantar`, `ditemukan`, `diproses`.",
          "Luyện: `Kapan bagasi saya bisa dikirim?`",
        ],
        pronunciation_focus_en: [
          "KA-pan ba-GA-si SA-ya BEE-sa di-KEE-rim ke ho-TEL -- `dikirim` = be sent; `ke hotel` = to the hotel.",
          "The `di-` passive is useful for service questions: `dikirim`, `diantar`, `ditemukan`, `diproses`.",
          "Drill: `Kapan bagasi saya bisa dikirim?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi bagasi hilang ở sân bay Indonesia, hãy đến konter bagasi hilang atau customer service maskapai càng sớm càng tốt. Chuẩn bị boarding pass, label bagasi, nomor penerbangan, paspor/KTP, alamat hotel, và số điện thoại. Mô tả koper bằng màu, ukuran, merek, và ciri khusus. Nhân viên thường sẽ membuat `laporan kehilangan` hoặc `klaim bagasi`, rồi cho nomor laporan để theo dõi.",
    cultural_notes_en:
      "When baggage is lost at an Indonesian airport, go to the lost-baggage counter or airline customer service as soon as possible. Prepare your boarding pass, baggage tag, flight number, passport/KTP, hotel address, and phone number. Describe the suitcase by color, size, brand, and special marks. Staff will usually make a `laporan kehilangan` or `klaim bagasi`, then give you a report number for tracking.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm sân bay theo nhóm: `bagasi hilang`, `koper`, `klaim bagasi`, `nomor penerbangan`, `label bagasi`, `petugas bandara`, `laporan kehilangan`. Khi căng thẳng, dùng câu ngắn rõ: `Bagasi saya belum keluar`, `Ini label bagasi saya`, `Kapan bisa dikirim ke hotel?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn airport chunks in groups: `bagasi hilang`, `koper`, `klaim bagasi`, `nomor penerbangan`, `label bagasi`, `petugas bandara`, `laporan kehilangan`. Under stress, use short clear sentences: `Bagasi saya belum keluar`, `Ini label bagasi saya`, `Kapan bisa dikirim ke hotel?`.",
    vocabulary: [
      {
        word: "bagasi hilang",
        en: "lost baggage",
        vi: "hành lý thất lạc",
        pos: "noun phrase",
        pronunciation_vi: "ba-GA-si HI-lang",
        pronunciation_en: "ba-GA-si HEE-lang",
      },
      {
        word: "koper",
        en: "suitcase",
        vi: "va-li",
        pos: "noun",
        pronunciation_vi: "KO-per",
        pronunciation_en: "KO-per",
      },
      {
        word: "klaim bagasi",
        en: "baggage claim/report",
        vi: "yêu cầu xử lý hành lý",
        pos: "noun phrase",
        pronunciation_vi: "klaim ba-GA-si",
        pronunciation_en: "claim ba-GA-si",
      },
      {
        word: "nomor penerbangan",
        en: "flight number",
        vi: "số chuyến bay",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor pe-ner-BA-ngan",
        pronunciation_en: "NO-mor pe-ner-BA-ngan",
      },
      {
        word: "label bagasi",
        en: "baggage tag",
        vi: "nhãn hành lý",
        pos: "noun phrase",
        pronunciation_vi: "LA-bel ba-GA-si",
        pronunciation_en: "LA-bel ba-GA-si",
      },
      {
        word: "petugas bandara",
        en: "airport staff",
        vi: "nhân viên sân bay",
        pos: "noun phrase",
        pronunciation_vi: "pe-TU-gas ban-DA-ra",
        pronunciation_en: "pe-TOO-gas ban-DA-ra",
      },
      {
        word: "laporan kehilangan",
        en: "loss report",
        vi: "báo cáo thất lạc/mất đồ",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran ke-hi-LANG-an",
        pronunciation_en: "la-PO-ran ke-hi-LANG-an",
      },
      {
        word: "ciri khusus",
        en: "special identifying mark",
        vi: "đặc điểm nhận dạng riêng",
        pos: "noun phrase",
        pronunciation_vi: "CI-ri KHU-sus",
        pronunciation_en: "CHEE-ri KHU-sus",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Permisi, bagasi saya belum keluar di ban berjalan.",
        vi: "Xin phép, hành lý của tôi chưa ra ở băng chuyền.",
        en: "Excuse me, my baggage has not come out on the conveyor belt.",
      },
      {
        speaker: "Petugas bandara",
        text: "Boleh lihat boarding pass dan label bagasinya?",
        vi: "Tôi xem thẻ lên máy bay và nhãn hành lý được không?",
        en: "May I see your boarding pass and baggage tag?",
      },
      {
        speaker: "Penumpang",
        text: "Ini nomor penerbangan dan label bagasi saya.",
        vi: "Đây là số chuyến bay và nhãn hành lý của tôi.",
        en: "Here are my flight number and baggage tag.",
      },
      {
        speaker: "Petugas bandara",
        text: "Tolong jelaskan warna, ukuran, dan ciri khusus koper Anda.",
        vi: "Xin hãy mô tả màu, kích cỡ, và đặc điểm riêng của va-li anh/chị.",
        en: "Please describe the color, size, and special marks of your suitcase.",
      },
      {
        speaker: "Penumpang",
        text: "Kopernya hitam besar, ada pita merah, dan alamat hotel saya ada di formulir.",
        vi: "Va-li màu đen lớn, có ruy-băng đỏ, và địa chỉ khách sạn của tôi có trong mẫu đơn.",
        en: "The suitcase is large and black, has a red ribbon, and my hotel address is on the form.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Hành lý của tôi chưa ra.'",
        prompt_en: "Translate into Indonesian: 'My baggage has not come out yet.'",
        answer: "Bagasi saya belum keluar.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Ini label ____ saya.`",
        prompt_en: "Fill in the blank: `Ini label ____ saya.`",
        answer: "bagasi",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["nomor penerbangan", "số chuyến bay"],
          ["laporan kehilangan", "báo cáo thất lạc"],
          ["petugas bandara", "nhân viên sân bay"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở quầy bagasi hilang. Báo rằng koper chưa ra, đưa nomor penerbangan và label bagasi, mô tả koper, và hỏi khi nào có thể gửi đến hotel.",
        prompt_en:
          "You are at the lost-baggage counter. Say your suitcase has not come out, provide the flight number and baggage tag, describe the suitcase, and ask when it can be sent to the hotel.",
      },
    ],
    content:
      "Use this lesson for Indonesian airport conversations about missing checked baggage: reporting lost luggage, showing a baggage tag and flight number, describing a suitcase, filling out a loss report, and asking when the baggage can be sent to a hotel.",
  },
];
