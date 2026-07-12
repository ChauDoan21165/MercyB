// Business Invoice & Receipt Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: invoice Indonesian is polite, precise, and document-heavy:
// `faktur`, `invoice`, `kuitansi`, `tanda terima`, `jatuh tempo`,
// `pembayaran`, `nomor PO`, and `bukti bayar`.

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
  cell_id?: string;
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
  cell_id?: string;
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_business_invoice_receipt",
    level: "B1",
    category: "business",
    title_vi: "Faktur, invoice và kuitansi trong kinh doanh",
    title_en: "Business invoices and receipts",
    sentences: [
      {
        en: "Tolong kirim invoice untuk pesanan ini.",
        vi: "Làm ơn gửi invoice cho đơn hàng này.",
        pronunciation_focus: [
          "TO-long KI-rim IN-vois UN-tuk pe-SA-nan I-ni - `invoice` = hóa đơn yêu cầu thanh toán; `pesanan` = đơn hàng.",
          "Lỗi người Việt: dùng `nota` cho mọi giấy tiền. `Invoice` yêu cầu thanh toán; `nota/kuitansi` là biên nhận/hóa đơn sau giao dịch.",
          "Luyện: `Tolong kirim invoice.`",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim IN-voice OON-took pe-SA-nan EE-nee - `invoice` = request-for-payment invoice; `pesanan` = order.",
          "VN-speaker trap: using `nota` for every money document. `Invoice` requests payment; `nota/kuitansi` records a transaction.",
          "Drill: `Tolong kirim invoice.`",
        ],
      },
      {
        en: "Apakah faktur pajak sudah dibuat?",
        vi: "Hóa đơn thuế đã được lập chưa?",
        pronunciation_focus: [
          "a-PA-kah FAK-tur PA-jak SU-dah di-BU-at - `faktur pajak` = hóa đơn thuế; `dibuat` = được lập.",
          "Lỗi người Việt: bỏ bị động `di-`. Văn bản kế toán rất hay dùng `dibuat`, `dikirim`, `diterima`.",
          "Luyện: `Faktur pajak sudah dibuat?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah FAK-toor PA-jak SOO-dah dee-BOO-at - `faktur pajak` = tax invoice; `dibuat` = made/issued.",
          "VN-speaker trap: dropping passive `di-`. Accounting language often uses `dibuat`, `dikirim`, `diterima`.",
          "Drill: `Faktur pajak sudah dibuat?`",
        ],
      },
      {
        en: "Nomor PO harus dicantumkan di invoice.",
        vi: "Số PO phải được ghi trên invoice.",
        pronunciation_focus: [
          "NO-mor pe-O HA-rus di-can-TUM-kan di IN-vois - `nomor PO` = số đơn đặt hàng; `dicantumkan` = được ghi kèm.",
          "Lỗi người Việt: hỏi `apa nomor PO`. Khi hỏi số/mã, dùng `berapa nomor PO?`.",
          "Luyện: `Nomor PO dicantumkan di invoice.`",
        ],
        pronunciation_focus_en: [
          "NO-mor peh-O HA-roos dee-chan-TOOM-kan dee IN-voice - `nomor PO` = purchase order number; `dicantumkan` = included/listed.",
          "VN-speaker trap: asking `apa nomor PO`. For a number/code, use `berapa nomor PO?`.",
          "Drill: `Nomor PO dicantumkan di invoice.`",
        ],
      },
      {
        en: "Tanggal jatuh tempo pembayaran kapan?",
        vi: "Ngày đến hạn thanh toán là khi nào?",
        pronunciation_focus: [
          "TANG-gal ja-TUH TEM-po pem-ba-YA-ran KA-pan - `jatuh tempo` = đến hạn; `pembayaran` = thanh toán.",
          "Lỗi người Việt: dịch từng chữ `rơi thời gian`. Cụm cố định tài chính là `jatuh tempo`.",
          "Luyện: `Jatuh tempo pembayaran kapan?`",
        ],
        pronunciation_focus_en: [
          "TANG-gal ja-TOOH TEM-po pem-ba-YA-ran KA-pan - `jatuh tempo` = due date; `pembayaran` = payment.",
          "VN-speaker trap: translating it literally as 'fall time'. The fixed finance phrase is `jatuh tempo`.",
          "Drill: `Jatuh tempo pembayaran kapan?`",
        ],
      },
      {
        en: "Pembayaran sudah kami transfer pagi ini.",
        vi: "Chúng tôi đã chuyển khoản thanh toán sáng nay.",
        pronunciation_focus: [
          "pem-ba-YA-ran SU-dah KA-mi TRANS-fer PA-gi I-ni - `kami` = chúng tôi, không gồm người nghe; `transfer` = chuyển khoản.",
          "Lỗi người Việt: dùng `kita` trong email cho khách. Công ty nói `kami` khi không gồm người nhận.",
          "Luyện: `Pembayaran sudah kami transfer.`",
        ],
        pronunciation_focus_en: [
          "pem-ba-YA-ran SOO-dah KA-mee TRANS-fer PA-gee EE-nee - `kami` = we excluding the listener; `transfer` = transfer.",
          "VN-speaker trap: using `kita` in client emails. A company says `kami` when excluding the recipient.",
          "Drill: `Pembayaran sudah kami transfer.`",
        ],
      },
      {
        en: "Saya lampirkan bukti bayar di email ini.",
        vi: "Tôi đính kèm chứng từ thanh toán trong email này.",
        pronunciation_focus: [
          "SA-ya lam-PIR-kan BUK-ti BA-yar di I-mel I-ni - `lampirkan` = đính kèm; `bukti bayar` = chứng từ thanh toán.",
          "Lỗi người Việt: nói `kirim bukti` được, nhưng trong email trang trọng dùng `lampirkan bukti bayar`.",
          "Luyện: `Saya lampirkan bukti bayar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya lam-PEER-kan BOOK-tee BA-yar dee EE-mail EE-nee - `lampirkan` = attach; `bukti bayar` = payment proof.",
          "VN-speaker note: `kirim bukti` is understood, but formal email uses `lampirkan bukti bayar`.",
          "Drill: `Saya lampirkan bukti bayar.`",
        ],
      },
      {
        en: "Mohon konfirmasi setelah pembayaran diterima.",
        vi: "Xin xác nhận sau khi nhận được thanh toán.",
        pronunciation_focus: [
          "MO-hon kon-fir-MA-si se-TE-lah pem-ba-YA-ran di-te-RI-ma - `mohon` = xin/mong; `diterima` = được nhận.",
          "Lỗi người Việt: dùng `tolong` cũng được, nhưng email kinh doanh mượt hơn với `mohon`.",
          "Luyện: `Mohon konfirmasi setelah pembayaran diterima.`",
        ],
        pronunciation_focus_en: [
          "MO-hon kon-feer-MA-see se-TE-lah pem-ba-YA-ran dee-te-REE-ma - `mohon` = kindly/request; `diterima` = received.",
          "VN-speaker note: `tolong` works, but business email sounds smoother with `mohon`.",
          "Drill: `Mohon konfirmasi setelah pembayaran diterima.`",
        ],
      },
      {
        en: "Kuitansi asli akan kami kirim lewat kurir.",
        vi: "Bản gốc phiếu thu/biên nhận sẽ được chúng tôi gửi qua courier.",
        pronunciation_focus: [
          "kui-TAN-si AS-li A-kan KA-mi KI-rim LE-wat KU-rir - `kuitansi` = phiếu thu/biên nhận; `asli` = bản gốc.",
          "Lỗi người Việt: `kwitansi` cũng hay thấy, nhưng dạng chuẩn KBBI là `kuitansi`.",
          "Luyện: `Kuitansi asli akan kami kirim.`",
        ],
        pronunciation_focus_en: [
          "kwee-TAN-see AS-lee A-kan KA-mee KEE-rim LEH-wat KOO-rir - `kuitansi` = receipt; `asli` = original.",
          "VN-speaker note: `kwitansi` is common, but the standard spelling is `kuitansi`.",
          "Drill: `Kuitansi asli akan kami kirim.`",
        ],
      },
      {
        en: "Tanda terima barang sudah ditandatangani.",
        vi: "Biên bản nhận hàng đã được ký.",
        pronunciation_focus: [
          "TAN-da te-RI-ma BA-rang SU-dah di-tan-da-TA-ngan-i - `tanda terima` = biên nhận; `ditandatangani` = được ký.",
          "Lỗi người Việt: dịch 'ký tên' thành `tulis nama`. Ký văn bản là `tanda tangan` / `ditandatangani`.",
          "Luyện: `Tanda terima sudah ditandatangani.`",
        ],
        pronunciation_focus_en: [
          "TAN-da te-REE-ma BA-rang SOO-dah dee-tan-da-TA-ngan-ee - `tanda terima` = receipt/acknowledgment; `ditandatangani` = signed.",
          "VN-speaker trap: translating 'sign name' as `tulis nama`. Signing a document is `tanda tangan` / `ditandatangani`.",
          "Drill: `Tanda terima sudah ditandatangani.`",
        ],
      },
      {
        en: "Ada perbedaan jumlah antara invoice dan pembayaran.",
        vi: "Có chênh lệch số tiền giữa invoice và thanh toán.",
        pronunciation_focus: [
          "A-da per-BE-da-an JUM-lah an-TA-ra IN-vois dan pem-ba-YA-ran - `perbedaan jumlah` = chênh lệch số tiền/số lượng.",
          "Lỗi người Việt: dùng `nomor` cho số tiền. `Nomor` là số định danh; số lượng/số tiền là `jumlah`.",
          "Luyện: `Ada perbedaan jumlah.`",
        ],
        pronunciation_focus_en: [
          "A-da per-BEH-da-an JOOM-lah an-TA-ra IN-voice dan pem-ba-YA-ran - `perbedaan jumlah` = amount difference.",
          "VN-speaker trap: using `nomor` for an amount. `Nomor` is an ID number; amount/quantity is `jumlah`.",
          "Drill: `Ada perbedaan jumlah.`",
        ],
      },
      {
        en: "Mohon revisi invoice sesuai nomor PO terbaru.",
        vi: "Xin chỉnh sửa invoice theo số PO mới nhất.",
        pronunciation_focus: [
          "MO-hon re-VI-si IN-vois se-SU-ai NO-mor pe-O ter-BA-ru - `revisi` = chỉnh sửa; `sesuai` = theo/phù hợp với.",
          "Lỗi người Việt: nói `ikut PO` trong email nghe quá khẩu ngữ. Viết chuẩn: `sesuai nomor PO`.",
          "Luyện: `Mohon revisi invoice sesuai nomor PO.`",
        ],
        pronunciation_focus_en: [
          "MO-hon re-VEE-see IN-voice se-SOO-ai NO-mor peh-O ter-BA-roo - `revisi` = revise; `sesuai` = according to/matching.",
          "VN-speaker trap: writing `ikut PO` in email sounds too casual. Use `sesuai nomor PO`.",
          "Drill: `Mohon revisi invoice sesuai nomor PO.`",
        ],
      },
      {
        en: "Kami akan memproses pembayaran setelah dokumen lengkap.",
        vi: "Chúng tôi sẽ xử lý thanh toán sau khi giấy tờ đầy đủ.",
        pronunciation_focus: [
          "KA-mi A-kan mem-PRO-ses pem-ba-YA-ran se-TE-lah do-ku-MEN LENG-kap - `memproses pembayaran` = xử lý thanh toán.",
          "Lỗi người Việt: nói `proses pembayaran` trơ trong văn bản trang trọng. Động từ đầy đủ là `memproses`.",
          "Luyện: `Kami akan memproses pembayaran.`",
        ],
        pronunciation_focus_en: [
          "KA-mee A-kan mem-PRO-ses pem-ba-YA-ran se-TE-lah do-koo-MEN LENG-kap - `memproses pembayaran` = process payment.",
          "VN-speaker trap: bare `proses pembayaran` in formal writing. The full verb is `memproses`.",
          "Drill: `Kami akan memproses pembayaran.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong kinh doanh Indonesia, `invoice` và `faktur` thường dùng để yêu cầu thanh toán, còn `kuitansi`, `nota`, hoặc `tanda terima` chứng minh đã nhận tiền/hàng. Email kế toán hay dùng `mohon`, `terlampir`, `jatuh tempo`, `bukti bayar`, `nomor PO`, và các bị động `dikirim`, `diterima`, `ditandatangani`. Với giao dịch có thuế, `faktur pajak` là giấy tờ riêng và cần thông tin công ty chính xác.",
    cultural_notes_en:
      "In Indonesian business, `invoice` and `faktur` commonly request payment, while `kuitansi`, `nota`, or `tanda terima` prove that money/goods were received. Accounting emails often use `mohon`, `terlampir`, `jatuh tempo`, `bukti bayar`, `nomor PO`, and passives like `dikirim`, `diterima`, `ditandatangani`. For taxable transactions, `faktur pajak` is a separate document and needs accurate company information.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi viết email kế toán, dùng khung lịch sự: `Mohon kirim invoice`, `Saya lampirkan bukti bayar`, `Mohon konfirmasi setelah pembayaran diterima`, `Mohon revisi invoice sesuai nomor PO`. Tránh dùng `aku/kamu`; dùng `saya/kami/Bapak/Ibu`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in accounting email, use polite frames: `Mohon kirim invoice`, `Saya lampirkan bukti bayar`, `Mohon konfirmasi setelah pembayaran diterima`, `Mohon revisi invoice sesuai nomor PO`. Avoid `aku/kamu`; use `saya/kami/Bapak/Ibu`.",
    vocabulary: [
      {
        cell_id: "3a216928-8209-455d-b783-8ffffef1f346",
        word: "faktur",
        en: "invoice / tax invoice",
        vi: "hóa đơn / hóa đơn thuế",
        pos: "noun",
        pronunciation_vi: "FAK-tur",
        pronunciation_en: "FAK-toor",
      },
      {
        cell_id: "41f0694a-0bfa-4a7b-a3cd-d5bb496e1770",
        word: "invoice",
        en: "invoice",
        vi: "invoice / hóa đơn yêu cầu thanh toán",
        pos: "noun",
        pronunciation_vi: "IN-vois",
        pronunciation_en: "IN-voice",
      },
      {
        cell_id: "330e0eab-c1cf-441b-a9a3-ff9bfc41860e",
        word: "kuitansi",
        en: "receipt",
        vi: "phiếu thu / biên nhận",
        pos: "noun",
        pronunciation_vi: "kui-TAN-si",
        pronunciation_en: "kwee-TAN-see",
      },
      {
        cell_id: "eded2f17-46d5-4c7c-a6b4-aac0f87a6bce",
        word: "tanda terima",
        en: "receipt / acknowledgment",
        vi: "biên nhận",
        pos: "noun phrase",
        pronunciation_vi: "TAN-da te-RI-ma",
        pronunciation_en: "TAN-da te-REE-ma",
      },
      {
        cell_id: "119c0abe-5ad7-4ce4-bcbc-5c0611240077",
        word: "jatuh tempo",
        en: "due date / due",
        vi: "đến hạn",
        pos: "noun phrase",
        pronunciation_vi: "ja-TUH TEM-po",
        pronunciation_en: "ja-TOOH TEM-po",
      },
      {
        cell_id: "f9cc970e-5b8a-4967-a873-506d47bf6144",
        word: "pembayaran",
        en: "payment",
        vi: "thanh toán",
        pos: "noun",
        pronunciation_vi: "pem-ba-YA-ran",
        pronunciation_en: "pem-ba-YA-ran",
      },
      {
        cell_id: "69492021-ed86-412b-8eed-8099622e87db",
        word: "nomor PO",
        en: "purchase order number",
        vi: "số PO / số đơn đặt hàng",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor pe-O",
        pronunciation_en: "NO-mor peh-O",
      },
      {
        cell_id: "fb289233-638c-4853-b089-8b3dc73f3d43",
        word: "bukti bayar",
        en: "payment proof",
        vi: "chứng từ thanh toán",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti BA-yar",
        pronunciation_en: "BOOK-tee BA-yar",
      },
      {
        cell_id: "9038812a-2006-4728-bcfc-31064d5ccd4d",
        word: "terlampir",
        en: "attached",
        vi: "đính kèm",
        pos: "adjective",
        pronunciation_vi: "ter-LAM-pir",
        pronunciation_en: "ter-LAM-peer",
      },
      {
        cell_id: "47cd213b-8654-47fd-8af5-690090c93f27",
        word: "ditandatangani",
        en: "signed",
        vi: "được ký",
        pos: "verb",
        pronunciation_vi: "di-tan-da-TA-ngan-i",
        pronunciation_en: "dee-tan-da-TA-ngan-ee",
      },
      {
        cell_id: "065398c5-aa3b-4b70-a107-8a464ec4d9b7",
        word: "revisi invoice",
        en: "invoice revision",
        vi: "chỉnh sửa invoice",
        pos: "noun phrase",
        pronunciation_vi: "re-VI-si IN-vois",
        pronunciation_en: "re-VEE-see IN-voice",
      },
      {
        cell_id: "9b893d6f-8c33-4087-9dcd-0b5d271a99af",
        word: "faktur pajak",
        en: "tax invoice",
        vi: "hóa đơn thuế",
        pos: "noun phrase",
        pronunciation_vi: "FAK-tur PA-jak",
        pronunciation_en: "FAK-toor PA-jak",
      },
    ],
    dialogue: [
      {
        cell_id: "f4768f22-7962-46a0-a789-f7b1aadf1fc7",
        speaker: "Vendor",
        text: "Selamat siang, Bu. Invoice dan faktur pajak sudah kami kirim lewat email.",
        vi: "Chào buổi trưa, chị. Invoice và hóa đơn thuế chúng tôi đã gửi qua email.",
        en: "Good afternoon, ma'am. We have sent the invoice and tax invoice by email.",
      },
      {
        cell_id: "89521fce-ed3b-4c7e-a7ed-b135201c3497",
        speaker: "Finance",
        text: "Terima kasih. Mohon cantumkan nomor PO di invoice.",
        vi: "Cảm ơn. Vui lòng ghi số PO trên invoice.",
        en: "Thank you. Please include the PO number on the invoice.",
      },
      {
        cell_id: "ebf6173f-152a-4519-a14c-0437592682d1",
        speaker: "Vendor",
        text: "Baik, kami revisi hari ini. Kapan jatuh tempo pembayarannya?",
        vi: "Vâng, hôm nay chúng tôi chỉnh sửa. Khi nào đến hạn thanh toán?",
        en: "Okay, we will revise it today. When is the payment due date?",
      },
      {
        cell_id: "350433a4-41f7-4464-9d54-022a6e6d479a",
        speaker: "Finance",
        text: "Tujuh hari setelah dokumen lengkap. Setelah transfer, kami kirim bukti bayar.",
        vi: "Bảy ngày sau khi giấy tờ đầy đủ. Sau khi chuyển khoản, chúng tôi gửi chứng từ thanh toán.",
        en: "Seven days after the documents are complete. After transfer, we will send payment proof.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi đính kèm chứng từ thanh toán trong email này.",
        answer: "Saya lampirkan bukti bayar di email ini.",
      },
      {
        type: "fill_blank",
        prompt: "Tanggal ____ tempo pembayaran kapan?",
        answer: "jatuh",
        explanation_vi: "`jatuh tempo` = đến hạn / due date.",
        explanation_en: "`jatuh tempo` = due date.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'payment proof'?",
        choices: ["bukti bayar", "nomor PO", "tanda terima", "jatuh tempo"],
        answer: "bukti bayar",
      },
      {
        type: "matching",
        pairs: [
          ["kuitansi", "phiếu thu / biên nhận"],
          ["faktur pajak", "hóa đơn thuế"],
          ["nomor PO", "số đơn đặt hàng"],
          ["pembayaran", "thanh toán"],
        ],
      },
    ],
  },
];

export default lessons;
