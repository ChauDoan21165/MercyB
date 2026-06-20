// Medical billing and payment plan Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: hospital billing Indonesian is polite, precise, and document-heavy:
// `tagihan rumah sakit`, `cicilan`, `kasir`, `rincian biaya`, `asuransi`,
// `keringanan biaya`, `bukti bayar`, and `jatuh tempo`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
    id: "indonesian_medical_billing_payment_plan",
    level: "B1",
    category: "health",
    title_vi: "Hóa đơn bệnh viện và kế hoạch trả góp",
    title_en: "Hospital billing and payment plans",
    sentences: [
      {
        en: "Saya mau menanyakan tagihan rumah sakit.",
        vi: "Tôi muốn hỏi về hóa đơn bệnh viện.",
        pronunciation_focus: [
          "SA-ya mau me-na-NYA-kan ta-GI-han RU-mah SA-kit - `tagihan rumah sakit` = hóa đơn/khoản phải trả của bệnh viện.",
          "Lỗi người Việt: dùng `bill hospital` hoặc `harga rumah sakit`. Cụm tự nhiên là `tagihan rumah sakit`.",
          "Luyện: `Menanyakan tagihan rumah sakit.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau meh-na-NYA-kan ta-GEE-han ROO-mah SA-kit - `tagihan rumah sakit` = hospital bill.",
          "VN-speaker trap: saying `bill hospital` or `harga rumah sakit`. Natural phrasing is `tagihan rumah sakit`.",
          "Drill: `Menanyakan tagihan rumah sakit.`",
        ],
      },
      {
        en: "Bisa minta rincian biaya rawat inap?",
        vi: "Có thể xin chi tiết chi phí nằm viện không?",
        pronunciation_focus: [
          "BI-sa MIN-ta rin-CI-an BI-a-ya RA-wat I-nap - `rincian biaya` = chi tiết chi phí; `rawat inap` = điều trị nội trú.",
          "Lỗi người Việt: chỉ hỏi `berapa?` chưa đủ. Khi cần kiểm tra hóa đơn, hỏi `rincian biaya`.",
          "Luyện: `Minta rincian biaya.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa MIN-ta rin-CHEE-an BEE-a-ya RA-wat EE-nap - `rincian biaya` = cost breakdown; `rawat inap` = inpatient care.",
          "VN-speaker note: asking only `berapa?` is not enough. To review a bill, ask for `rincian biaya`.",
          "Drill: `Minta rincian biaya.`",
        ],
      },
      {
        en: "Kasir rumah sakit ada di lantai berapa?",
        vi: "Quầy thu ngân bệnh viện ở tầng mấy?",
        pronunciation_focus: [
          "ka-SIR RU-mah SA-kit A-da di LAN-tai be-RA-pa - `kasir` = thu ngân/quầy thanh toán; `lantai berapa` = tầng mấy.",
          "Lỗi người Việt: dùng `berapa lantai` sẽ hỏi số tầng của tòa nhà. Hỏi vị trí dùng `di lantai berapa`.",
          "Luyện: `Kasir di lantai berapa?`",
        ],
        pronunciation_focus_en: [
          "ka-SEER ROO-mah SA-kit A-da dee LAN-tai beh-RA-pa - `kasir` = cashier/payment counter; `lantai berapa` = which floor.",
          "VN-speaker trap: `berapa lantai` asks how many floors the building has. For location, use `di lantai berapa`.",
          "Drill: `Kasir di lantai berapa?`",
        ],
      },
      {
        en: "Apakah tagihan ini sudah dikurangi asuransi?",
        vi: "Hóa đơn này đã được trừ bảo hiểm chưa?",
        pronunciation_focus: [
          "a-PA-kah ta-GI-han I-ni SU-dah di-ku-RANG-i a-su-RAN-si - `dikurangi asuransi` = được trừ phần bảo hiểm.",
          "Lỗi người Việt: dùng `asuransi potong` thiếu tự nhiên. Câu hóa đơn dùng bị động `dikurangi asuransi`.",
          "Luyện: `Sudah dikurangi asuransi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah ta-GEE-han EE-nee SOO-dah dee-koo-RANG-ee a-soo-RAN-see - `dikurangi asuransi` = reduced by insurance coverage.",
          "VN-speaker trap: `asuransi potong` sounds unnatural. Billing language uses passive `dikurangi asuransi`.",
          "Drill: `Sudah dikurangi asuransi?`",
        ],
      },
      {
        en: "Biaya mana yang tidak ditanggung asuransi?",
        vi: "Khoản phí nào không được bảo hiểm chi trả?",
        pronunciation_focus: [
          "BI-a-ya MA-na yang TI-dak di-TANG-gung a-su-RAN-si - `ditanggung asuransi` = được bảo hiểm chi trả.",
          "Lỗi người Việt: dịch `cover` thành `cover` trong câu Indonesia. Dùng `ditanggung asuransi`.",
          "Luyện: `Tidak ditanggung asuransi.`",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya MA-na yang TEE-dak dee-TANG-goong a-soo-RAN-see - `ditanggung asuransi` = covered by insurance.",
          "VN-speaker trap: inserting English `cover`. Use `ditanggung asuransi`.",
          "Drill: `Tidak ditanggung asuransi.`",
        ],
      },
      {
        en: "Apakah rumah sakit menyediakan cicilan?",
        vi: "Bệnh viện có cung cấp trả góp không?",
        pronunciation_focus: [
          "a-PA-kah RU-mah SA-kit me-nye-DI-a-kan ci-CI-lan - `cicilan` = trả góp/khoản trả góp; `menyediakan` = cung cấp.",
          "Lỗi người Việt: nói `bayar sedikit-sedikit` hiểu được nhưng không chuyên nghiệp. Từ đúng là `cicilan`.",
          "Luyện: `Menyediakan cicilan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah ROO-mah SA-kit meh-nyeh-DEE-a-kan chee-CHEE-lan - `cicilan` = installment plan; `menyediakan` = provide.",
          "VN-speaker note: `bayar sedikit-sedikit` is understandable but informal. The right term is `cicilan`.",
          "Drill: `Menyediakan cicilan?`",
        ],
      },
      {
        en: "Saya ingin mengajukan keringanan biaya.",
        vi: "Tôi muốn xin giảm/giãn chi phí.",
        pronunciation_focus: [
          "SA-ya I-ngin me-nga-JU-kan ke-ri-NGAN-an BI-a-ya - `keringanan biaya` = giảm nhẹ/hỗ trợ chi phí.",
          "Lỗi người Việt: nói `minta diskon rumah sakit` nghe kém trang trọng. Dùng `mengajukan keringanan biaya`.",
          "Luyện: `Mengajukan keringanan biaya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-nga-JOO-kan keh-ree-NGAN-an BEE-a-ya - `keringanan biaya` = fee relief/reduction assistance.",
          "VN-speaker trap: `minta diskon rumah sakit` sounds informal. Use `mengajukan keringanan biaya`.",
          "Drill: `Mengajukan keringanan biaya.`",
        ],
      },
      {
        en: "Dokumen apa saja yang diperlukan untuk cicilan?",
        vi: "Cần những giấy tờ gì để trả góp?",
        pronunciation_focus: [
          "DO-ku-men A-pa SA-ja yang di-per-LU-kan UN-tuk ci-CI-lan - `apa saja` = những gì; `diperlukan` = được cần/yêu cầu.",
          "Lỗi người Việt: bỏ `saja` làm câu nghe như hỏi một giấy tờ. `Apa saja` hỏi cả danh sách.",
          "Luyện: `Dokumen apa saja yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "DO-koo-men A-pa SA-ja yang dee-per-LOO-kan OON-took chee-CHEE-lan - `apa saja` = what all; `diperlukan` = required.",
          "VN-speaker trap: dropping `saja` makes it sound like one document. `Apa saja` asks for the whole list.",
          "Drill: `Dokumen apa saja yang diperlukan?`",
        ],
      },
      {
        en: "Tanggal jatuh tempo pembayaran pertama kapan?",
        vi: "Ngày đến hạn thanh toán đầu tiên là khi nào?",
        pronunciation_focus: [
          "TANG-gal ja-TUH TEM-po pem-ba-YA-ran per-TA-ma KA-pan - `jatuh tempo` = đến hạn; `pembayaran pertama` = khoản thanh toán đầu tiên.",
          "Lỗi người Việt: dịch từng chữ `rơi thời gian`. Cụm tài chính cố định là `jatuh tempo`.",
          "Luyện: `Jatuh tempo pembayaran kapan?`",
        ],
        pronunciation_focus_en: [
          "TANG-gal ja-TOOH TEM-po pem-ba-YA-ran per-TA-ma KA-pan - `jatuh tempo` = due date; `pembayaran pertama` = first payment.",
          "VN-speaker trap: translating it literally as 'fall time'. The fixed finance phrase is `jatuh tempo`.",
          "Drill: `Jatuh tempo pembayaran kapan?`",
        ],
      },
      {
        en: "Saya sudah transfer pembayaran, ini bukti bayar.",
        vi: "Tôi đã chuyển khoản thanh toán, đây là chứng từ thanh toán.",
        pronunciation_focus: [
          "SA-ya SU-dah TRANS-fer pem-ba-YA-ran, I-ni BUK-ti BA-yar - `bukti bayar` = chứng từ thanh toán.",
          "Lỗi người Việt: nói `foto transfer` được hiểu, nhưng ở kasir dùng `bukti bayar` rõ hơn.",
          "Luyện: `Ini bukti bayar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah TRANS-fer pem-ba-YA-ran, EE-nee BOOK-tee BA-yar - `bukti bayar` = proof of payment.",
          "VN-speaker note: `foto transfer` is understood, but at the cashier `bukti bayar` is clearer.",
          "Drill: `Ini bukti bayar.`",
        ],
      },
      {
        en: "Mohon kuitansi asli setelah pembayaran diterima.",
        vi: "Xin biên nhận bản gốc sau khi thanh toán được nhận.",
        pronunciation_focus: [
          "MO-hon kui-TAN-si AS-li se-TE-lah pem-ba-YA-ran di-te-RI-ma - `kuitansi asli` = biên nhận bản gốc; `diterima` = được nhận.",
          "Lỗi người Việt: dùng `nota` cho mọi giấy tiền. Với biên nhận thanh toán, `kuitansi` chính xác hơn.",
          "Luyện: `Mohon kuitansi asli.`",
        ],
        pronunciation_focus_en: [
          "MO-hon kwee-TAN-see AS-lee seh-TEH-lah pem-ba-YA-ran dee-teh-REE-ma - `kuitansi asli` = original receipt; `diterima` = received.",
          "VN-speaker trap: using `nota` for every payment paper. For a payment receipt, `kuitansi` is more precise.",
          "Drill: `Mohon kuitansi asli.`",
        ],
      },
      {
        en: "Kalau terlambat bayar cicilan, apakah ada denda?",
        vi: "Nếu trả góp trễ, có tiền phạt không?",
        pronunciation_focus: [
          "KA-lau ter-LAM-bat BA-yar ci-CI-lan, a-PA-kah A-da DEN-da - `terlambat bayar` = trả trễ; `denda` = tiền phạt.",
          "Lỗi người Việt: dùng `hukuman` cho tiền phạt. Với tiền trả trễ, dùng `denda`.",
          "Luyện: `Ada denda kalau terlambat?`",
        ],
        pronunciation_focus_en: [
          "KA-lau ter-LAM-bat BA-yar chee-CHEE-lan, a-PA-kah A-da DEN-da - `terlambat bayar` = pay late; `denda` = fine.",
          "VN-speaker trap: using `hukuman` for a money fine. For late payment, use `denda`.",
          "Drill: `Ada denda kalau terlambat?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở bệnh viện Indonesia, thanh toán thường qua `kasir`, và bệnh nhân có thể xin `rincian biaya`, kiểm tra phần `ditanggung asuransi`, giữ `bukti bayar`, và xin `kuitansi asli`. Một số nơi có thể hỗ trợ `cicilan` hoặc `keringanan biaya`, nhưng điều kiện tùy bệnh viện. Bài này dạy ngôn ngữ thanh toán, không phải tư vấn tài chính/y tế.",
    cultural_notes_en:
      "At Indonesian hospitals, payment usually goes through the `kasir`, and patients can request a cost breakdown, check what is covered by insurance, keep proof of payment, and request an original receipt. Some places may support installments or fee relief, but conditions vary by hospital. This lesson teaches billing language, not financial or medical advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi chưa rõ hóa đơn, hỏi `rincian biaya`; khi hỏi bảo hiểm, dùng `ditanggung asuransi`; khi xin trả góp, dùng `cicilan`; khi xin hỗ trợ phí, dùng `keringanan biaya`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when the bill is unclear, ask for `rincian biaya`; for insurance coverage, use `ditanggung asuransi`; for installments, use `cicilan`; for fee assistance, use `keringanan biaya`.",
    vocabulary: [
      {
        word: "tagihan rumah sakit",
        en: "hospital bill",
        vi: "hóa đơn/khoản phải trả bệnh viện",
        pos: "noun phrase",
        pronunciation_vi: "ta-GI-han RU-mah SA-kit",
        pronunciation_en: "ta-GEE-han ROO-mah SA-kit",
      },
      {
        word: "cicilan",
        en: "installment",
        vi: "trả góp/khoản trả góp",
        pos: "noun",
        pronunciation_vi: "ci-CI-lan",
        pronunciation_en: "chee-CHEE-lan",
      },
      {
        word: "kasir",
        en: "cashier; payment counter",
        vi: "thu ngân/quầy thanh toán",
        pos: "noun",
        pronunciation_vi: "ka-SIR",
        pronunciation_en: "ka-SEER",
      },
      {
        word: "rincian biaya",
        en: "cost breakdown",
        vi: "chi tiết chi phí",
        pos: "noun phrase",
        pronunciation_vi: "rin-CI-an BI-a-ya",
        pronunciation_en: "rin-CHEE-an BEE-a-ya",
      },
      {
        word: "asuransi",
        en: "insurance",
        vi: "bảo hiểm",
        pos: "noun",
        pronunciation_vi: "a-su-RAN-si",
        pronunciation_en: "a-soo-RAN-see",
      },
      {
        word: "keringanan biaya",
        en: "fee relief",
        vi: "hỗ trợ/giảm nhẹ chi phí",
        pos: "noun phrase",
        pronunciation_vi: "ke-ri-NGAN-an BI-a-ya",
        pronunciation_en: "keh-ree-NGAN-an BEE-a-ya",
      },
      {
        word: "bukti bayar",
        en: "proof of payment",
        vi: "chứng từ thanh toán",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti BA-yar",
        pronunciation_en: "BOOK-tee BA-yar",
      },
      {
        word: "jatuh tempo",
        en: "due date",
        vi: "đến hạn",
        pos: "noun phrase",
        pronunciation_vi: "ja-TUH TEM-po",
        pronunciation_en: "ja-TOOH TEM-po",
      },
      {
        word: "kuitansi asli",
        en: "original receipt",
        vi: "biên nhận bản gốc",
        pos: "noun phrase",
        pronunciation_vi: "kui-TAN-si AS-li",
        pronunciation_en: "kwee-TAN-see AS-lee",
      },
      {
        word: "denda",
        en: "fine",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da",
        pronunciation_en: "DEN-da",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Permisi, saya mau menanyakan tagihan rumah sakit dan rincian biaya.",
        vi: "Xin lỗi, tôi muốn hỏi về hóa đơn bệnh viện và chi tiết chi phí.",
        en: "Excuse me, I would like to ask about the hospital bill and cost breakdown.",
      },
      {
        speaker: "Kasir",
        text: "Baik. Sebagian biaya sudah dikurangi asuransi, tetapi ada biaya yang belum ditanggung.",
        vi: "Được. Một phần chi phí đã được trừ bảo hiểm, nhưng có khoản chưa được chi trả.",
        en: "All right. Part of the cost has been reduced by insurance, but some costs are not covered.",
      },
      {
        speaker: "Pasien",
        text: "Apakah saya bisa mengajukan cicilan atau keringanan biaya?",
        vi: "Tôi có thể xin trả góp hoặc hỗ trợ giảm chi phí không?",
        en: "Can I apply for installments or fee relief?",
      },
      {
        speaker: "Kasir",
        text: "Bisa kami jelaskan syaratnya. Tolong siapkan dokumen dan simpan bukti bayar.",
        vi: "Chúng tôi có thể giải thích điều kiện. Vui lòng chuẩn bị giấy tờ và giữ chứng từ thanh toán.",
        en: "We can explain the requirements. Please prepare the documents and keep proof of payment.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi muốn xin chi tiết chi phí.”",
        prompt_en: "Translate into Indonesian: “I want to ask for the cost breakdown.”",
        answer: "Saya mau minta rincian biaya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Tanggal ____ tempo pembayaran pertama kapan?",
        prompt_en: "Fill in the blank: Tanggal ____ tempo pembayaran pertama kapan?",
        answer: "jatuh",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “trả góp”?",
        prompt_en: "Which word means “installment plan/payment”?",
        choices: ["cicilan", "kuitansi", "kasir"],
        answer: "cicilan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `bukti bayar` = ?",
        prompt_en: "Match the meaning: `bukti bayar` = ?",
        answer: "proof of payment",
      },
    ],
  },
];

export default lessons;
