// Bank savings and small investment Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 30 file. Covers tabungan, deposito, reksa dana, risiko, bunga,
// investasi kecil, tujuan keuangan, and konsultasi bank.
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
    id: "indonesian_bank_savings_investment",
    level: "B1",
    category: "money",
    title_vi: "Tiết kiệm và đầu tư nhỏ qua ngân hàng",
    title_en: "Bank savings and small investments",
    sentences: [
      {
        en: "Saya ingin memisahkan tabungan harian dan dana investasi.",
        vi: "Tôi muốn tách tiền tiết kiệm hằng ngày và quỹ đầu tư.",
        pronunciation_focus: [
          "SA-ya IN-gin me-mi-SAH-kan ta-BU-ngan HA-ri-an dan DA-na in-ves-TA-si - `memisahkan` = tách ra; `tabungan harian` = tiền/tài khoản tiết kiệm dùng thường ngày.",
          "`dana` trang trọng hơn `uang` khi nói về kế hoạch tài chính.",
          "Lỗi người Việt: dùng một từ `uang simpan` cho mọi thứ. Trong ngân hàng, `tabungan` = tiết kiệm; `dana investasi` = quỹ/vốn đầu tư.",
        ],
        pronunciation_focus_en: [
          "SA-ya IN-gin me-mi-SAH-kan ta-BOO-ngan HA-ree-an dan DA-na in-ves-TA-see - `memisahkan` = to separate; `tabungan harian` = daily-use savings.",
          "`dana` sounds more formal than `uang` when discussing financial planning.",
          "VN-speaker trap: using one phrase like `uang simpan` for everything. In banking, `tabungan` = savings; `dana investasi` = investment funds.",
        ],
      },
      {
        en: "Tujuan keuangan saya adalah dana darurat dan biaya pendidikan.",
        vi: "Mục tiêu tài chính của tôi là quỹ khẩn cấp và chi phí giáo dục.",
        pronunciation_focus: [
          "tu-JU-an ke-U-ang-an SA-ya a-DA-lah DA-na da-RU-rat dan BI-a-ya pen-di-DIK-an - `tujuan keuangan` = mục tiêu tài chính.",
          "`adalah` dùng tốt trong câu giải thích rõ ràng, nhất là khi nói với nhân viên ngân hàng.",
          "Lỗi người Việt: dịch 'mục tiêu' thành `target` quá Anh hóa. Cụm Indonesia tự nhiên là `tujuan keuangan`.",
        ],
        pronunciation_focus_en: [
          "too-JOO-an keh-OO-ang-an SA-ya a-DA-lah DA-na da-ROO-rat dan BEE-a-ya pen-dee-DEEK-an - `tujuan keuangan` = financial goal.",
          "`adalah` works well in clear explanatory sentences, especially with bank staff.",
          "VN-speaker trap: overusing English `target`. Natural Indonesian is `tujuan keuangan`.",
        ],
      },
      {
        en: "Berapa bunga tabungan per tahun untuk rekening ini?",
        vi: "Lãi tiết kiệm mỗi năm cho tài khoản này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BUNG-a ta-BU-ngan per TA-hun UN-tuk re-KE-ning I-ni - `bunga` trong tài chính = lãi/lãi suất.",
          "`per tahun` = mỗi năm; cũng có thể nói `per bulan` cho mỗi tháng.",
          "Lỗi người Việt: dịch lãi thành `untung`. `Untung` là lợi nhuận/lãi kinh doanh; lãi ngân hàng là `bunga`.",
        ],
        pronunciation_focus_en: [
          "beh-RA-pa BOONG-a ta-BOO-ngan per TA-hoon OON-took reh-KEH-ning EE-nee - `bunga` in finance = interest.",
          "`per tahun` = per year; you can also say `per bulan` for per month.",
          "VN-speaker trap: translating interest as `untung`. `Untung` is profit; bank interest is `bunga`.",
        ],
      },
      {
        en: "Deposito biasanya punya jangka waktu tertentu.",
        vi: "Tiền gửi kỳ hạn thường có một thời hạn nhất định.",
        pronunciation_focus: [
          "de-po-SI-to bi-A-sa-nya PU-nya JANG-ka WAK-tu ter-TEN-tu - `deposito` = tiền gửi kỳ hạn; `jangka waktu` = thời hạn.",
          "`biasanya` giúp tránh nói tuyệt đối; câu này mô tả đặc điểm chung, không hứa điều kiện cụ thể.",
          "Lỗi người Việt: nhầm `deposito` với `deposit` đặt cọc. Trong ngân hàng Indonesia, `deposito` thường là tiền gửi có kỳ hạn.",
        ],
        pronunciation_focus_en: [
          "deh-po-SEE-to bee-AH-sa-nya POO-nya JANG-ka WAK-too ter-TEN-too - `deposito` = time deposit; `jangka waktu` = term.",
          "`biasanya` avoids absolute claims; this sentence describes a general feature, not a specific product promise.",
          "VN-speaker trap: confusing `deposito` with a rental deposit. In Indonesian banking, `deposito` usually means a time deposit.",
        ],
      },
      {
        en: "Kalau saya menarik deposito sebelum jatuh tempo, apakah ada penalti?",
        vi: "Nếu tôi rút tiền gửi kỳ hạn trước ngày đáo hạn, có phạt không?",
        pronunciation_focus: [
          "KA-lau SA-ya me-NA-rik de-po-SI-to se-BE-lum ja-TUH TEM-po, a-PA-kah A-da pe-NAL-ti - `jatuh tempo` = đến hạn/đáo hạn.",
          "`apakah ada` là cách hỏi lịch sự, rõ ràng về phí hoặc điều kiện.",
          "Lỗi người Việt: dịch 'đáo hạn' thành `tanggal selesai`. Cụm tài chính phổ biến là `jatuh tempo`.",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya meh-NA-rik deh-po-SEE-to seh-BEH-loom ja-TOOH TEM-po, a-PA-kah A-da peh-NAL-tee - `jatuh tempo` = maturity/due date.",
          "`apakah ada` is a polite, clear way to ask about fees or conditions.",
          "VN-speaker trap: translating maturity as `tanggal selesai`. The common finance phrase is `jatuh tempo`.",
        ],
      },
      {
        en: "Saya tertarik reksa dana, tapi saya ingin memahami risikonya dulu.",
        vi: "Tôi quan tâm đến quỹ tương hỗ, nhưng tôi muốn hiểu rủi ro trước.",
        pronunciation_focus: [
          "SA-ya ter-TA-rik REK-sa DA-na, TA-pi SA-ya IN-gin me-ma-HA-mi RI-si-ko-nya DU-lu - `reksa dana` = quỹ tương hỗ/quỹ đầu tư.",
          "`dulu` ở cuối câu nghĩa là trước đã, làm câu nghe thận trọng.",
          "Lỗi người Việt: đọc `reksa dana` như một từ liền. Tách nhịp: `reksa` + `dana`.",
        ],
        pronunciation_focus_en: [
          "SA-ya ter-TA-rik REK-sa DA-na, TA-pee SA-ya IN-gin meh-ma-HA-mee REE-see-ko-nya DOO-loo - `reksa dana` = mutual fund/investment fund.",
          "`dulu` at the end means first/before anything else, making the sentence sound careful.",
          "VN-speaker trap: running `reksa dana` together. Keep two beats: `reksa` + `dana`.",
        ],
      },
      {
        en: "Profil risiko saya masih konservatif.",
        vi: "Hồ sơ rủi ro của tôi vẫn còn bảo thủ/an toàn.",
        pronunciation_focus: [
          "PRO-fil RI-si-ko SA-ya MA-sih kon-SER-va-tif - `profil risiko` = hồ sơ/mức chịu rủi ro.",
          "`masih` = vẫn còn; dùng khi bạn chưa sẵn sàng nhận rủi ro cao.",
          "Lỗi người Việt: nói `saya takut risiko` quá cảm tính. Với ngân hàng, `profil risiko saya konservatif` nghe chuyên nghiệp hơn.",
        ],
        pronunciation_focus_en: [
          "PRO-fil REE-see-ko SA-ya MA-see kon-SER-va-tif - `profil risiko` = risk profile.",
          "`masih` = still; use it when you are not ready for high risk.",
          "VN-speaker trap: saying emotional `saya takut risiko`. With a bank, `profil risiko saya konservatif` sounds more professional.",
        ],
      },
      {
        en: "Saya mau mulai dari investasi kecil setiap bulan.",
        vi: "Tôi muốn bắt đầu từ khoản đầu tư nhỏ mỗi tháng.",
        pronunciation_focus: [
          "SA-ya MAU mu-LAI DA-ri in-ves-TA-si KE-cil se-TI-ap BU-lan - `mulai dari` = bắt đầu từ; `setiap bulan` = mỗi tháng.",
          "`investasi kecil` không cần lặp số nhiều; tính từ đứng sau danh từ.",
          "Lỗi người Việt: đặt tính từ trước như tiếng Anh: `kecil investasi`. Đúng là `investasi kecil`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU moo-LAI DA-ree in-ves-TA-see KEH-chil seh-TEE-ap BOO-lan - `mulai dari` = start from; `setiap bulan` = every month.",
          "`investasi kecil` does not need plural marking; the adjective follows the noun.",
          "VN-speaker trap: putting the adjective first like English: `kecil investasi`. Correct Indonesian is `investasi kecil`.",
        ],
      },
      {
        en: "Apakah produk ini cocok untuk tujuan keuangan jangka pendek?",
        vi: "Sản phẩm này có phù hợp với mục tiêu tài chính ngắn hạn không?",
        pronunciation_focus: [
          "a-PA-kah PRO-duk I-ni CO-cok UN-tuk tu-JU-an ke-U-ang-an JANG-ka PEN-dek - `cocok untuk` = phù hợp với.",
          "`jangka pendek` = ngắn hạn; `jangka panjang` = dài hạn.",
          "Lỗi người Việt: hỏi trực tiếp `ini bagus?` quá chung. Hỏi `cocok untuk tujuan...` sẽ rõ hơn.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah PRO-duk EE-nee CHO-chok OON-took too-JOO-an keh-OO-ang-an JANG-ka PEN-dek - `cocok untuk` = suitable for.",
          "`jangka pendek` = short term; `jangka panjang` = long term.",
          "VN-speaker trap: asking broad `ini bagus?` Instead, ask `cocok untuk tujuan...` for a clearer answer.",
        ],
      },
      {
        en: "Boleh saya konsultasi bank sebelum memilih produk?",
        vi: "Tôi có thể tư vấn với ngân hàng trước khi chọn sản phẩm không?",
        pronunciation_focus: [
          "BO-leh SA-ya kon-sul-TA-si bank se-BE-lum me-MI-lih PRO-duk - `konsultasi bank` = tư vấn/trao đổi với ngân hàng.",
          "`boleh saya...` là cách lịch sự để xin phép hoặc yêu cầu dịch vụ.",
          "Lỗi người Việt: nói `minta advis` nửa Anh nửa Indonesia. Dùng `konsultasi` hoặc `minta penjelasan` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya kon-sool-TA-see bank seh-BEH-loom meh-MEE-lih PRO-duk - `konsultasi bank` = consult with the bank.",
          "`boleh saya...` is a polite way to ask permission or request a service.",
          "VN-speaker trap: saying half-English `minta advis`. Use `konsultasi` or `minta penjelasan` instead.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi nói chuyện với ngân hàng ở Indonesia, người học nên hỏi rõ mục tiêu tài chính, kỳ hạn, bunga, biaya, risiko, và điều kiện rút tiền trước khi chọn sản phẩm. Các câu trong bài này là ngôn ngữ thực hành, không phải lời khuyên đầu tư.",
    cultural_notes_en:
      "When speaking with a bank in Indonesia, learners should ask clearly about financial goals, term, interest, fees, risk, and withdrawal conditions before choosing a product. The sentences here are language practice, not investment advice.",
    tip_advice_vi:
      "Mẫu câu hữu ích: `Saya ingin memahami risikonya dulu`, `Apakah ada biaya tambahan?`, và `Produk ini cocok untuk tujuan jangka pendek atau panjang?` Trong tiếng Indonesia, tính từ thường đứng sau danh từ: `investasi kecil`, `jangka pendek`, `risiko tinggi`.",
    tip_advice_en:
      "Useful patterns: `Saya ingin memahami risikonya dulu`, `Apakah ada biaya tambahan?`, and `Produk ini cocok untuk tujuan jangka pendek atau panjang?` In Indonesian, adjectives usually follow nouns: `investasi kecil`, `jangka pendek`, `risiko tinggi`.",
    vocabulary: [
      {
        word: "tabungan",
        en: "savings; savings account",
        vi: "tiền tiết kiệm; tài khoản tiết kiệm",
        pos: "noun",
        pronunciation_vi: "ta-BU-ngan",
        pronunciation_en: "ta-BOO-ngan",
      },
      {
        word: "deposito",
        en: "time deposit",
        vi: "tiền gửi kỳ hạn",
        pos: "noun",
        pronunciation_vi: "de-po-SI-to",
        pronunciation_en: "deh-po-SEE-to",
      },
      {
        word: "reksa dana",
        en: "mutual fund; investment fund",
        vi: "quỹ tương hỗ; quỹ đầu tư",
        pos: "noun",
        pronunciation_vi: "REK-sa DA-na",
        pronunciation_en: "REK-sa DA-na",
      },
      {
        word: "risiko",
        en: "risk",
        vi: "rủi ro",
        pos: "noun",
        pronunciation_vi: "RI-si-ko",
        pronunciation_en: "REE-see-ko",
      },
      {
        word: "bunga",
        en: "interest",
        vi: "lãi; lãi suất",
        pos: "noun",
        pronunciation_vi: "BUNG-a",
        pronunciation_en: "BOONG-a",
      },
      {
        word: "investasi kecil",
        en: "small investment",
        vi: "khoản đầu tư nhỏ",
        pos: "phrase",
        pronunciation_vi: "in-ves-TA-si KE-cil",
        pronunciation_en: "in-ves-TA-see KEH-chil",
      },
      {
        word: "tujuan keuangan",
        en: "financial goal",
        vi: "mục tiêu tài chính",
        pos: "phrase",
        pronunciation_vi: "tu-JU-an ke-U-ang-an",
        pronunciation_en: "too-JOO-an keh-OO-ang-an",
      },
      {
        word: "konsultasi bank",
        en: "bank consultation",
        vi: "tư vấn với ngân hàng",
        pos: "phrase",
        pronunciation_vi: "kon-sul-TA-si bank",
        pronunciation_en: "kon-sool-TA-see bank",
      },
      {
        word: "jatuh tempo",
        en: "maturity date; due date",
        vi: "ngày đáo hạn; đến hạn",
        pos: "phrase",
        pronunciation_vi: "ja-TUH TEM-po",
        pronunciation_en: "ja-TOOH TEM-po",
      },
      {
        word: "jangka pendek",
        en: "short term",
        vi: "ngắn hạn",
        pos: "phrase",
        pronunciation_vi: "JANG-ka PEN-dek",
        pronunciation_en: "JANG-ka PEN-dek",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Selamat pagi. Saya ingin konsultasi tentang tabungan dan investasi kecil.",
        vi: "Chào buổi sáng. Tôi muốn tư vấn về tiết kiệm và đầu tư nhỏ.",
        en: "Good morning. I would like to consult about savings and small investments.",
      },
      {
        speaker: "Petugas bank",
        text: "Baik. Apa tujuan keuangan Bapak/Ibu?",
        vi: "Vâng. Mục tiêu tài chính của anh/chị là gì?",
        en: "Sure. What is your financial goal?",
      },
      {
        speaker: "Nasabah",
        text: "Saya ingin menyiapkan dana darurat dan mulai investasi kecil setiap bulan.",
        vi: "Tôi muốn chuẩn bị quỹ khẩn cấp và bắt đầu đầu tư nhỏ mỗi tháng.",
        en: "I want to prepare an emergency fund and start a small investment every month.",
      },
      {
        speaker: "Petugas bank",
        text: "Untuk dana darurat, tabungan lebih fleksibel daripada deposito.",
        vi: "Đối với quỹ khẩn cấp, tài khoản tiết kiệm linh hoạt hơn tiền gửi kỳ hạn.",
        en: "For an emergency fund, savings are more flexible than a time deposit.",
      },
      {
        speaker: "Nasabah",
        text: "Kalau reksa dana, bagaimana risiko dan biayanya?",
        vi: "Nếu là quỹ tương hỗ, rủi ro và chi phí như thế nào?",
        en: "For mutual funds, what are the risks and fees like?",
      },
      {
        speaker: "Petugas bank",
        text: "Kita bisa lihat profil risiko dulu sebelum memilih produk.",
        vi: "Chúng ta có thể xem hồ sơ rủi ro trước khi chọn sản phẩm.",
        en: "We can look at the risk profile first before choosing a product.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi muốn hiểu rủi ro trước.'",
        prompt_en: "Translate into Indonesian: 'I want to understand the risk first.'",
        answer: "Saya ingin memahami risikonya dulu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Berapa ____ tabungan per tahun?",
        prompt_en: "Fill in the correct word: Berapa ____ tabungan per tahun?",
        answer: "bunga",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ với nghĩa: deposito, reksa dana, tujuan keuangan, jatuh tempo.",
        prompt_en: "Match the phrases with meanings: deposito, reksa dana, tujuan keuangan, jatuh tempo.",
        answer: "deposito = time deposit; reksa dana = mutual fund; tujuan keuangan = financial goal; jatuh tempo = maturity/due date.",
      },
      {
        type: "roleplay",
        prompt_vi: "Đóng vai khách hàng hỏi nhân viên ngân hàng về tabungan, deposito, bunga, risiko, và investasi kecil.",
        prompt_en: "Roleplay as a customer asking bank staff about savings, time deposits, interest, risk, and small investments.",
        sample_answer: "Saya ingin konsultasi bank. Apa perbedaan tabungan dan deposito? Berapa bunganya, dan bagaimana risikonya kalau saya mulai dari investasi kecil?",
      },
    ],
  },
];
