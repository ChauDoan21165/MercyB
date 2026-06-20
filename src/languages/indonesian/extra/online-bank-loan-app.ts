// Online bank loan app Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 22 file. Covers pinjaman online, aplikasi, bunga, tenor, limit,
// verifikasi KTP, jatuh tempo, and penagihan.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
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
    id: "indonesian_online_bank_loan_app",
    level: "B1",
    category: "money",
    title_vi: "Vay online qua ứng dụng ngân hàng",
    title_en: "Online loan apps and bank borrowing",
    sentences: [
      {
        en: "Saya sedang mempertimbangkan pinjaman online lewat aplikasi bank.",
        vi: "Tôi đang cân nhắc khoản vay online qua ứng dụng ngân hàng.",
        pronunciation_focus: [
          "SA-ya SE-dang mem-per-tim-BANG-kan pin-JA-man ON-lain LE-wat ap-li-KA-si bank - `pinjaman online` = khoản vay online; `lewat aplikasi` = qua ứng dụng.",
          "`mempertimbangkan` nghe thận trọng hơn `mau ambil` khi nói về nợ/vay.",
          "Lỗi người Việt: nói `pinjam online` cho danh từ khoản vay. Danh từ là `pinjaman online`; động từ là `meminjam` hoặc `mengajukan pinjaman`.",
        ],
        pronunciation_focus_en: [
          "SA-ya SE-dang mem-per-tim-BANG-kan pin-JA-man ON-line LE-wat ap-li-KA-see bank - `pinjaman online` = online loan; `lewat aplikasi` = through an app.",
          "`mempertimbangkan` sounds more careful than `mau ambil` when discussing debt/borrowing.",
          "VN-speaker trap: saying `pinjam online` for the loan noun. The noun is `pinjaman online`; the verb is `meminjam` or `mengajukan pinjaman`.",
        ],
      },
      {
        en: "Sebelum mengajukan pinjaman, saya mau cek bunga dan biaya admin.",
        vi: "Trước khi nộp hồ sơ vay, tôi muốn kiểm tra lãi và phí admin.",
        pronunciation_focus: [
          "se-BE-lum me-nga-JU-kan pin-JA-man, SA-ya MAU cek BUNG-a dan BI-a-ya AD-min - `mengajukan pinjaman` = nộp hồ sơ vay; `bunga` = lãi.",
          "`bunga` trong tài chính là lãi/lãi suất, không phải hoa.",
          "Lỗi người Việt: dịch lãi thành `untung`. Với khoản vay, dùng `bunga`; với lợi nhuận kinh doanh mới dùng `untung`.",
        ],
        pronunciation_focus_en: [
          "se-BE-lum me-nga-JOO-kan pin-JA-man, SA-ya MAU chek BOONG-a dan BEE-a-ya AD-min - `mengajukan pinjaman` = apply for a loan; `bunga` = interest.",
          "`bunga` in finance means interest, not flower.",
          "VN-speaker trap: translating interest as `untung`. For loans, use `bunga`; `untung` is business profit.",
        ],
      },
      {
        en: "Tenornya bisa tiga bulan, enam bulan, atau satu tahun?",
        vi: "Kỳ hạn có thể là ba tháng, sáu tháng, hoặc một năm không?",
        pronunciation_focus: [
          "TE-nor-nya BI-sa TI-ga BU-lan, e-NAM BU-lan, a-TAU SA-tu TA-hun - `tenor` = kỳ hạn vay.",
          "Sau số đếm, danh từ không lặp số nhiều: `tiga bulan`, không phải `tiga bulan-bulan`.",
          "Lỗi người Việt: dùng `waktu pinjam` dài dòng. Trong tài chính, từ gọn và phổ biến là `tenor`.",
        ],
        pronunciation_focus_en: [
          "TE-nor-nya BEE-sa TEE-ga BOO-lan, e-NAM BOO-lan, a-TAU SA-too TA-hoon - `tenor` = loan term.",
          "After numbers, nouns are not pluralized: `tiga bulan`, not `tiga bulan-bulan`.",
          "VN-speaker trap: using a long phrase like `waktu pinjam`. In finance, the compact common word is `tenor`.",
        ],
      },
      {
        en: "Limit pinjaman saya hanya dua juta rupiah.",
        vi: "Hạn mức vay của tôi chỉ là hai triệu rupiah.",
        pronunciation_focus: [
          "LI-mit pin-JA-man SA-ya HA-nya DU-a JU-ta ru-PI-ah - `limit pinjaman` = hạn mức vay; `dua juta` = 2.000.000.",
          "`hanya` = chỉ, dùng để nhấn mạnh hạn mức thấp hoặc giới hạn.",
          "Lỗi người Việt: bỏ bậc tiền. Phải nói `dua juta`, không chỉ `dua`.",
        ],
        pronunciation_focus_en: [
          "LEE-mit pin-JA-man SA-ya HA-nya DOO-a JOO-ta roo-PEE-ah - `limit pinjaman` = loan limit; `dua juta` = 2,000,000.",
          "`hanya` = only, used to emphasize a low amount or limit.",
          "VN-speaker trap: dropping the money scale. Say `dua juta`, not just `dua`.",
        ],
      },
      {
        en: "Aplikasi meminta verifikasi KTP dan foto wajah.",
        vi: "Ứng dụng yêu cầu xác minh KTP và ảnh khuôn mặt.",
        pronunciation_focus: [
          "ap-li-KA-si me-MIN-ta ve-ri-fi-KA-si KA-TE-PE dan FO-to WA-jah - `verifikasi KTP` = xác minh căn cước; `foto wajah` = ảnh khuôn mặt.",
          "`KTP` đọc từng chữ ka-te-pe. Nếu là người nước ngoài, có thể cần paspor/KITAS tùy dịch vụ.",
          "Lỗi người Việt: nói `verify KTP` nửa Anh nửa Indo. Cụm Indonesia tự nhiên là `verifikasi KTP`.",
        ],
        pronunciation_focus_en: [
          "ap-li-KA-see me-MIN-ta ve-ree-fee-KA-see KA-TE-PE dan FO-to WA-jah - `verifikasi KTP` = ID verification; `foto wajah` = face photo.",
          "`KTP` is spelled ka-te-pe. Foreigners may need passport/KITAS depending on the service.",
          "VN-speaker trap: saying half-English `verify KTP`. Natural Indonesian is `verifikasi KTP`.",
        ],
      },
      {
        en: "Kapan dana pinjaman akan cair ke rekening saya?",
        vi: "Khi nào tiền vay sẽ được giải ngân vào tài khoản của tôi?",
        pronunciation_focus: [
          "KA-pan DA-na pin-JA-man A-kan CA-ir ke re-KE-ning SA-ya - `dana cair` = tiền được giải ngân; `rekening` = tài khoản ngân hàng.",
          "`cair` nghĩa gốc là lỏng/tan, nhưng trong tài chính nghĩa là tiền được giải ngân.",
          "Lỗi người Việt: nói `uang keluar` cho giải ngân. Từ tài chính tự nhiên là `dana cair`.",
        ],
        pronunciation_focus_en: [
          "KA-pan DA-na pin-JA-man A-kan CHA-ir ke re-KE-ning SA-ya - `dana cair` = funds are disbursed; `rekening` = bank account.",
          "`cair` literally means liquid/melted, but in finance it means funds are disbursed.",
          "VN-speaker trap: saying `uang keluar` for disbursement. The natural finance term is `dana cair`.",
        ],
      },
      {
        en: "Tanggal jatuh tempo cicilan pertama kapan?",
        vi: "Ngày đến hạn của khoản trả góp đầu tiên là khi nào?",
        pronunciation_focus: [
          "TANG-gal ja-TUH TEM-po ci-CIL-an per-TA-ma KA-pan - `jatuh tempo` = đến hạn; `cicilan pertama` = khoản trả góp đầu tiên.",
          "`tanggal` hỏi ngày cụ thể trong tháng; `kapan` hỏi thời điểm chung.",
          "Lỗi người Việt: dịch 'đến hạn' thành `datang waktu`. Cụm cố định là `jatuh tempo`.",
        ],
        pronunciation_focus_en: [
          "TANG-gal ja-TOOH TEM-po chee-CIL-an per-TA-ma KA-pan - `jatuh tempo` = due date; `cicilan pertama` = first installment.",
          "`tanggal` asks for a calendar date; `kapan` asks when generally.",
          "VN-speaker trap: translating due date as `datang waktu`. The fixed phrase is `jatuh tempo`.",
        ],
      },
      {
        en: "Kalau telat bayar, berapa denda per hari?",
        vi: "Nếu trả chậm, tiền phạt mỗi ngày là bao nhiêu?",
        pronunciation_focus: [
          "KA-lau TE-lat BA-yar, be-RA-pa DEN-da per HA-ri - `telat bayar` = trả chậm; `denda` = tiền phạt.",
          "`per hari` = mỗi ngày; dùng khi hỏi phí/phạt tính theo ngày.",
          "Lỗi người Việt: dùng `salah bayar` cho trả chậm. Đúng là `telat bayar` hoặc trang trọng hơn `terlambat membayar`.",
        ],
        pronunciation_focus_en: [
          "KA-lau TE-lat BA-yar, be-RA-pa DEN-da per HA-ree - `telat bayar` = pay late; `denda` = penalty/fine.",
          "`per hari` = per day; used when asking daily fees/penalties.",
          "VN-speaker trap: using `salah bayar` for late payment. Correct: `telat bayar`, or more formal `terlambat membayar`.",
        ],
      },
      {
        en: "Saya menerima pesan penagihan sebelum jatuh tempo.",
        vi: "Tôi nhận được tin nhắn nhắc thu nợ trước ngày đến hạn.",
        pronunciation_focus: [
          "SA-ya me-ne-RI-ma PE-san pe-na-GIH-an se-BE-lum ja-TUH TEM-po - `penagihan` = việc nhắc/thu nợ; `sebelum` = trước khi.",
          "`pesan penagihan` có thể là SMS, WhatsApp, hoặc thông báo trong app.",
          "Lỗi người Việt: dịch `đòi nợ` quá mạnh trong mọi trường hợp. `Penagihan` là từ trung tính/chính thức hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-ne-REE-ma PE-san pe-na-GEE-han se-BE-lum ja-TOOH TEM-po - `penagihan` = billing/collection; `sebelum` = before.",
          "`pesan penagihan` can be SMS, WhatsApp, or in-app notification.",
          "VN-speaker trap: translating debt collection too aggressively every time. `Penagihan` is more neutral/formal.",
        ],
      },
      {
        en: "Saya ingin melunasi pinjaman lebih awal tanpa biaya tambahan.",
        vi: "Tôi muốn tất toán khoản vay sớm mà không có phí thêm.",
        pronunciation_focus: [
          "SA-ya I-ngin me-lu-NA-si pin-JA-man LE-bih A-wal TAN-pa BI-a-ya tam-BAH-an - `melunasi` = trả hết/tất toán; `lebih awal` = sớm hơn.",
          "`tanpa biaya tambahan` = không có phí bổ sung, câu quan trọng trước khi tất toán sớm.",
          "Lỗi người Việt: nói `bayar habis` nghe đời thường. Trong tài chính, dùng `melunasi pinjaman`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin me-loo-NA-see pin-JA-man LE-bih A-wal TAN-pa BEE-a-ya tam-BAH-an - `melunasi` = pay off fully; `lebih awal` = earlier.",
          "`tanpa biaya tambahan` = without extra fees, an important phrase before early payoff.",
          "VN-speaker trap: saying casual `bayar habis`. In finance, use `melunasi pinjaman`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `pinjaman online` thường được gọi tắt là `pinjol`. Có dịch vụ hợp pháp qua ngân hàng/fintech được giám sát, nhưng cũng có app rủi ro cao hoặc lừa đảo. Khi đọc điều khoản, đừng chỉ nhìn `limit` hoặc tiền giải ngân nhanh; hãy hỏi rõ `bunga`, `biaya admin`, `tenor`, `jatuh tempo`, `denda`, quyền truy cập dữ liệu, và aturan `penagihan`. Nếu có nghi ngờ, kiểm tra tên dịch vụ qua kênh chính thức trước khi gửi KTP hoặc dữ liệu cá nhân.",
    cultural_notes_en:
      "In Indonesia, `pinjaman online` is often shortened to `pinjol`. Some services are legitimate bank/fintech products under supervision, but risky or fraudulent apps also exist. When reading terms, do not look only at `limit` or fast disbursement; ask about `bunga`, `biaya admin`, `tenor`, `jatuh tempo`, `denda`, data access, and `penagihan` rules. If suspicious, verify the service through official channels before sending ID or personal data.",
    tip_advice_vi:
      "Mẹo cho người Việt: `bunga` = lãi, `tenor` = kỳ hạn, `limit` = hạn mức, `jatuh tempo` = ngày đến hạn, `denda` = phạt, `melunasi` = tất toán. Trong app vay tiền, `rekening` là tài khoản ngân hàng, còn `akun` là tài khoản ứng dụng. Câu sống còn: `Total yang harus saya bayar berapa?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: `bunga` = interest, `tenor` = term, `limit` = limit, `jatuh tempo` = due date, `denda` = penalty, `melunasi` = pay off fully. In loan apps, `rekening` is the bank account, while `akun` is the app account. Survival question: `Total yang harus saya bayar berapa?`",
    vocabulary: [
      { word: "pinjaman online", en: "online loan", vi: "khoản vay online", pos: "noun phrase", pronunciation_vi: "pin-JA-man ON-lain", pronunciation_en: "pin-JA-man ON-line" },
      { word: "aplikasi bank", en: "bank app", vi: "ứng dụng ngân hàng", pos: "noun phrase", pronunciation_vi: "ap-li-KA-si bank", pronunciation_en: "ap-li-KA-see bank" },
      { word: "bunga", en: "interest", vi: "lãi/lãi suất", pos: "noun", pronunciation_vi: "BUNG-a", pronunciation_en: "BOONG-a" },
      { word: "tenor", en: "loan term", vi: "kỳ hạn vay", pos: "noun", pronunciation_vi: "TE-nor", pronunciation_en: "TE-nor" },
      { word: "limit pinjaman", en: "loan limit", vi: "hạn mức vay", pos: "noun phrase", pronunciation_vi: "LI-mit pin-JA-man", pronunciation_en: "LEE-mit pin-JA-man" },
      { word: "verifikasi KTP", en: "ID-card verification", vi: "xác minh KTP/căn cước", pos: "noun phrase", pronunciation_vi: "ve-ri-fi-KA-si KA-TE-PE", pronunciation_en: "ve-ree-fee-KA-see KA-TE-PE" },
      { word: "jatuh tempo", en: "due date", vi: "đến hạn/ngày đáo hạn", pos: "noun phrase", pronunciation_vi: "ja-TUH TEM-po", pronunciation_en: "ja-TOOH TEM-po" },
      { word: "penagihan", en: "billing / collection", vi: "nhắc/thu nợ", pos: "noun", pronunciation_vi: "pe-na-GIH-an", pronunciation_en: "pe-na-GEE-han" },
      { word: "denda", en: "fine / penalty", vi: "tiền phạt", pos: "noun", pronunciation_vi: "DEN-da", pronunciation_en: "DEN-da" },
      { word: "melunasi pinjaman", en: "pay off a loan", vi: "tất toán khoản vay", pos: "verb phrase", pronunciation_vi: "me-lu-NA-si pin-JA-man", pronunciation_en: "me-loo-NA-see pin-JA-man" },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Saya mau tanya soal pinjaman online di aplikasi bank.",
        vi: "Tôi muốn hỏi về khoản vay online trong ứng dụng ngân hàng.",
        en: "I want to ask about the online loan in the bank app.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Ibu mau cek limit, bunga, atau tenor pinjaman?",
        vi: "Được. Chị muốn kiểm tra hạn mức, lãi, hay kỳ hạn vay?",
        en: "Sure. Would you like to check the loan limit, interest, or term?",
      },
      {
        speaker: "Nasabah",
        text: "Saya mau tahu total yang harus saya bayar sampai lunas.",
        vi: "Tôi muốn biết tổng số tiền tôi phải trả cho đến khi tất toán.",
        en: "I want to know the total amount I must pay until it is fully paid off.",
      },
      {
        speaker: "Petugas",
        text: "Nanti aplikasi akan menampilkan bunga, biaya admin, dan tanggal jatuh tempo.",
        vi: "Lát nữa ứng dụng sẽ hiển thị lãi, phí admin và ngày đến hạn.",
        en: "The app will show the interest, admin fee, and due date.",
      },
      {
        speaker: "Nasabah",
        text: "Kalau saya melunasi lebih awal, apakah ada biaya tambahan?",
        vi: "Nếu tôi tất toán sớm, có phí thêm không?",
        en: "If I pay it off early, is there an extra fee?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "jatuh tempo", answer: "ngày đến hạn" },
          { prompt: "bunga", answer: "lãi/lãi suất" },
          { prompt: "limit pinjaman", answer: "hạn mức vay" },
          { prompt: "penagihan", answer: "nhắc/thu nợ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Trước khi vay, tôi muốn kiểm tra lãi và phí admin.", answer: "Sebelum mengajukan pinjaman, saya mau cek bunga dan biaya admin." },
          { prompt: "Ngày đến hạn của khoản trả góp đầu tiên là khi nào?", answer: "Tanggal jatuh tempo cicilan pertama kapan?" },
          { prompt: "Tôi muốn tất toán khoản vay sớm.", answer: "Saya ingin melunasi pinjaman lebih awal." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Aplikasi meminta verifikasi ___ dan foto wajah.", answer: "KTP" },
          { prompt: "Kalau telat bayar, berapa ___ per hari?", answer: "denda" },
          { prompt: "Kapan dana pinjaman akan ___ ke rekening saya?", answer: "cair" },
        ],
      },
    ],
  },
];
