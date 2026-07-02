// Online ticket event refund Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

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
    id: "indonesian_online_ticket_event_refund",
    level: "B1",
    category: "travel",
    title_vi: "Hoàn tiền vé online cho sự kiện",
    title_en: "Online ticket refund for events",
    sentences: [
      {
        en: "Saya membeli tiket online untuk konser ini.",
        vi: "Tôi đã mua vé online cho buổi hòa nhạc này.",
        pronunciation_focus: [
          "SA-ya mem-be-LI TI-ket on-LAIN un-TUK KON-ser I-ni - `tiket online` = vé online; `konser` = buổi hòa nhạc.",
          "Lỗi người Việt: dùng `beli ticket` trộn Anh/Indonesia. Dalam konteks resmi, gunakan `tiket`.",
          "Luyện: `Saya beli tiket online.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-beh-LEE TEE-ket on-LINE oon-TOOK KON-ser EE-nee - `tiket online` = online ticket; `konser` = concert.",
          "VN-speaker trap: mixing `ticket` and Indonesian. In formal contexts, use `tiket`.",
          "Drill: `Saya beli tiket online.`",
        ],
      },
      {
        en: "Barcode tiket saya tidak bisa dipindai di pintu masuk.",
        vi: "Mã barcode vé của tôi không quét được ở cổng vào.",
        pronunciation_focus: [
          "BAR-code TI-ket SA-ya ti-DAK BI-sa di-PIN-dai di PIN-tu MA-suk - `dipindai` = được quét; `pintu masuk` = cổng vào.",
          "Lỗi người Việt: nói `scan barcode` được, nhưng `dipindai` là từ Indonesia tự nhiên hơn trong câu đầy đủ.",
          "Luyện: `Barcode saya tidak bisa dipindai.`",
        ],
        pronunciation_focus_en: [
          "BAR-code TEE-ket SA-ya tee-DAK BEE-sa dee-PIN-die dee PIN-too MA-sook - `dipindai` = scanned; `pintu masuk` = entrance gate.",
          "VN-speaker trap: `scan barcode` is understood, but `dipindai` sounds more natural in a full Indonesian sentence.",
          "Drill: `Barcode saya tidak bisa dipindai.`",
        ],
      },
      {
        en: "Jadwal acara berubah dan saya tidak bisa datang.",
        vi: "Lịch chương trình đã thay đổi và tôi không thể đến.",
        pronunciation_focus: [
          "JAD-wal A-ca-ra be-RU-bah dan SA-ya ti-DAK BI-sa DA-tang - `jadwal acara` = lịch sự kiện; `berubah` = thay đổi.",
          "`tidak bisa datang` cocok untuk alasan không thể tham dự. Không cần dịch dài kiểu `saya sibuk` nếu muốn nêu lý do chính.",
          "Luyện: `Jadwal acara berubah.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal A-cha-ra beh-ROO-bah dan SA-ya tee-DAK BEE-sa DAH-tang - `jadwal acara` = event schedule; `berubah` = changed.",
          "`Tidak bisa datang` fits when you cannot attend. You do not need a longer explanation unless asked.",
          "Drill: `Jadwal acara berubah.`",
        ],
      },
      {
        en: "Saya ingin minta refund karena acaranya dibatalkan.",
        vi: "Tôi muốn xin hoàn tiền vì sự kiện đã bị hủy.",
        pronunciation_focus: [
          "SA-ya I-ngin MIN-ta ri-FAN ka-RE-na a-CA-ra-nya di-ba-TAL-kan - `minta refund` = xin hoàn tiền; `dibatalkan` = bị hủy.",
          "Lỗi người Việt: dùng `cancel` như tiếng Anh trong câu Indonesia. Với hal formal, `dibatalkan` lebih natural.",
          "Luyện: `Saya minta refund.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin MIN-ta REE-fund ka-REH-na a-CHA-ra-nya dee-ba-TAL-kan - `minta refund` = request a refund; `dibatalkan` = canceled.",
          "VN-speaker trap: using English `cancel` inside Indonesian. For formal situations, `dibatalkan` is more natural.",
          "Drill: `Saya minta refund.`",
        ],
      },
      {
        en: "Saya sudah mengirim bukti pembayaran melalui email.",
        vi: "Tôi đã gửi bằng chứng thanh toán qua email.",
        pronunciation_focus: [
          "SA-ya SU-dah me-NGI-rim BUK-ti pem-ba-YAR-an me-la-LU-i i-ME-il - `bukti pembayaran` = bằng chứng thanh toán; `melalui email` = qua email.",
          "Lỗi người Việt: nói `bukti bayar` vẫn dùng được trong chat, nhưng `bukti pembayaran` lebih lengkap untuk layanan pelanggan.",
          "Luyện: `Saya kirim bukti pembayaran.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah meh-NGEE-rim BOOK-ti pem-ba-YAR-an meh-la-LOO-ee ee-MALE - `bukti pembayaran` = proof of payment; `melalui email` = via email.",
          "VN-speaker trap: `bukti bayar` may work in chat, but `bukti pembayaran` is more complete for customer support.",
          "Drill: `Saya kirim bukti pembayaran.`",
        ],
      },
      {
        en: "Apakah tiket saya masih berlaku setelah jadwal berubah?",
        vi: "Vé của tôi còn hiệu lực sau khi lịch thay đổi không?",
        pronunciation_focus: [
          "a-pa-KAH TI-ket SA-ya MA-sih ber-LA-ku se-TE-lah JAD-wal be-RU-bah - `masih berlaku` = còn hiệu lực; `setelah` = sau khi.",
          "Lỗi người Việt: nói `masih hidup` cho vé hoặc mã QR. Với tiket, gunakan `masih berlaku`.",
          "Luyện: `Tiket saya masih berlaku?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH TEE-ket SA-ya MA-sih ber-LA-koo seh-TEH-lah JAD-wal beh-ROO-bah - `masih berlaku` = still valid; `setelah` = after.",
          "VN-speaker trap: `masih hidup` for tickets or QR codes. For tickets, use `masih berlaku`.",
          "Drill: `Tiket saya masih berlaku?`",
        ],
      },
      {
        en: "Customer service berkata refund akan diproses dalam tujuh hari kerja.",
        vi: "Bộ phận customer service nói hoàn tiền sẽ được xử lý trong bảy ngày làm việc.",
        pronunciation_focus: [
          "cus-TOM-er ser-VIS ber-KA-ta ri-FAN A-kan di-pro-SES da-LAM TU-juh HA-ri ker-JA - `diproses` = được xử lý; `hari kerja` = ngày làm việc.",
          "Lỗi người Việt: dùng `service customer` đảo ngược. Cách tự nhiên là `customer service` hoặc `layanan pelanggan`.",
          "Luyện: `Refund diproses dalam tujuh hari kerja.`",
        ],
        pronunciation_focus_en: [
          "CUS-toh-mer SER-vis ber-KA-ta REE-fund A-kan dee-proh-SES da-LAM TOO-juh HA-ree ker-JA - `diproses` = processed; `hari kerja` = working days.",
          "VN-speaker trap: reversing to `service customer`. Natural order is `customer service` or `layanan pelanggan`.",
          "Drill: `Refund diproses dalam tujuh hari kerja.`",
        ],
      },
      {
        en: "Tolong kirim nomor pesanan dan kode booking saya.",
        vi: "Làm ơn gửi cho tôi số đơn hàng và mã booking của tôi.",
        pronunciation_focus: [
          "TO-long KI-rim NO-mor pe-SA-nan dan KO-de BOO-king SA-ya - `nomor pesanan` = số đơn hàng; `kode booking` = mã đặt chỗ.",
          "Lỗi người Việt: nói `nomor order` được trong chat, nhưng `nomor pesanan` rõ hơn và dễ hiểu trong tiếng Indonesia.",
          "Luyện: `Nomor pesanan saya di mana?`",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim NO-mor peh-SA-nan dan KO-deh BOO-king SA-ya - `nomor pesanan` = order number; `kode booking` = booking code.",
          "VN-speaker trap: `nomor order` works in chat, but `nomor pesanan` is clearer and more Indonesian.",
          "Drill: `Nomor pesanan saya di mana?`",
        ],
      },
      {
        en: "Saya ingin komplain karena jadwal event berubah mendadak.",
        vi: "Tôi muốn khiếu nại vì lịch sự kiện đổi đột ngột.",
        pronunciation_focus: [
          "SA-ya I-ngin kom-PLAIN ka-RE-na JAD-wal E-vent be-RU-bah men-da-DAK - `komplain` = khiếu nại; `mendadak` = đột ngột.",
          "Lỗi người Việt: dùng `protes` quá mạnh. Với customer service, `komplain` lebih aman dan umum.",
          "Luyện: `Saya mau komplain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin kom-PLAIN ka-REH-na JAD-wal EV-ent beh-ROO-bah men-da-DAK - `komplain` = complain; `mendadak` = suddenly.",
          "VN-speaker trap: `protes` can sound too strong. For customer service, `komplain` is safer and common.",
          "Drill: `Saya mau komplain.`",
        ],
      },
      {
        en: "Apakah ada pengembalian dana ke rekening saya?",
        vi: "Có hoàn tiền về tài khoản của tôi không?",
        pronunciation_focus: [
          "a-pa-KAH A-da pe-ngem-ba-LI-an DA-na ke re-KE-ning SA-ya - `pengembalian dana` = hoàn tiền; `rekening` = tài khoản ngân hàng.",
          "Lỗi người Việt: nhầm `rekening` với `rekening telpon`. Trong refund, `rekening` thường là tài khoản bank.",
          "Luyện: `Pengembalian dana ke rekening saya?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da peh-ngem-ba-LEE-an DA-na keh reh-KEH-ning SA-ya - `pengembalian dana` = fund return/refund; `rekening` = bank account.",
          "VN-speaker trap: confusing `rekening` with phone credit. In refunds, `rekening` usually means a bank account.",
          "Drill: `Pengembalian dana ke rekening saya?`",
        ],
      },
      {
        en: "Saya butuh bukti pembayaran untuk laporan kantor.",
        vi: "Tôi cần bằng chứng thanh toán cho báo cáo của công ty/cơ quan.",
        pronunciation_focus: [
          "SA-ya BU-tuh BUK-ti pem-ba-YAR-an un-TUK la-PO-ran KAN-tor - `butuh` = cần; `laporan kantor` = báo cáo công ty/cơ quan.",
          "Lỗi người Việt: chỉ nói `saya perlu bukti` được, nhưng với chứng từ tài chính, `bukti pembayaran` cụ thể hơn.",
          "Luyện: `Saya butuh bukti pembayaran.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh BOOK-ti pem-ba-YAR-an oon-TOOK la-PO-ran KAN-tor - `butuh` = need; `laporan kantor` = office report.",
          "VN-speaker trap: only saying `saya perlu bukti` is vague. For financial documents, `bukti pembayaran` is more specific.",
          "Drill: `Saya butuh bukti pembayaran.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, vé sự kiện thường mua qua nền tảng online và được kiểm tra bằng barcode hoặc QR code ở cổng vào. Nếu event đổi lịch, nhà tổ chức thường nêu rõ chính sách: vé vẫn berlaku, đổi jadwal, atau refund. Khi liên hệ customer service, người mua nên gửi nomor pesanan, bukti pembayaran, email, dan tangkapan layar barcode nếu cần.",
    cultural_notes_en:
      "In Indonesia, event tickets are often bought online and checked with a barcode or QR code at the entrance. If the event schedule changes, organizers usually state the policy clearly: the ticket remains valid, the event is rescheduled, or a refund is available. When contacting customer service, buyers should send the order number, proof of payment, email, and a screenshot of the barcode if needed.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya membeli tiket online untuk konser ini. Barcode tiket saya tidak bisa dipindai. Jadwal acara berubah dan saya ingin minta refund. Saya sudah mengirim bukti pembayaran melalui email. Apakah tiket saya masih berlaku?`",
    tip_advice_en:
      "Safe template: `Saya membeli tiket online untuk konser ini. Barcode tiket saya tidak bisa dipindai. Jadwal acara berubah dan saya ingin minta refund. Saya sudah mengirim bukti pembayaran melalui email. Apakah tiket saya masih berlaku?`",
    vocabulary: [
      { word: "tiket online", en: "online ticket", vi: "vé online", pos: "noun phrase", pronunciation_vi: "TI-ket on-LAIN", pronunciation_en: "TEE-ket on-LINE" },
      { word: "barcode", en: "barcode", vi: "mã vạch / barcode", pos: "noun", pronunciation_vi: "BAR-code", pronunciation_en: "BAR-code" },
      { word: "dipindai", en: "scanned", vi: "được quét", pos: "verb (passive)", pronunciation_vi: "di-PIN-dai", pronunciation_en: "dee-PIN-die" },
      { word: "jadwal acara", en: "event schedule", vi: "lịch sự kiện", pos: "noun phrase", pronunciation_vi: "JAD-wal A-ca-ra", pronunciation_en: "JAD-wal A-cha-ra" },
      { word: "refund", en: "refund", vi: "hoàn tiền", pos: "noun / verb", pronunciation_vi: "ri-FAN", pronunciation_en: "REE-fund" },
      { word: "bukti pembayaran", en: "proof of payment", vi: "bằng chứng thanh toán", pos: "noun phrase", pronunciation_vi: "BUK-ti pem-ba-YAR-an", pronunciation_en: "BOOK-ti pem-ba-YAR-an" },
      { word: "customer service", en: "customer service", vi: "bộ phận chăm sóc khách hàng", pos: "noun phrase", pronunciation_vi: "cus-TOM-er ser-VIS", pronunciation_en: "CUS-toh-mer SER-vis" },
      { word: "nomor pesanan", en: "order number", vi: "số đơn hàng", pos: "noun phrase", pronunciation_vi: "NO-mor pe-SA-nan", pronunciation_en: "NO-mor peh-SA-nan" },
      { word: "pengembalian dana", en: "refund / fund return", vi: "hoàn tiền", pos: "noun phrase", pronunciation_vi: "pe-ngem-ba-LI-an DA-na", pronunciation_en: "peh-ngem-ba-LEE-an DA-na" },
      { word: "masih berlaku", en: "still valid", vi: "vẫn còn hiệu lực", pos: "phrase", pronunciation_vi: "MA-sih ber-LA-ku", pronunciation_en: "MA-sih ber-LA-koo" },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Halo, saya ingin minta refund untuk tiket konser saya.",
        vi: "Xin chào, tôi muốn xin hoàn tiền cho vé concert của tôi.",
        en: "Hello, I would like to request a refund for my concert ticket.",
      },
      {
        speaker: "Customer service",
        text: "Baik, boleh kirim nomor pesanan dan bukti pembayaran?",
        vi: "Vâng, anh/chị có thể gửi số đơn hàng và bằng chứng thanh toán không?",
        en: "All right, could you send the order number and proof of payment?",
      },
      {
        speaker: "Pelanggan",
        text: "Tentu, saya sudah kirim lewat email.",
        vi: "Tất nhiên, tôi đã gửi qua email rồi.",
        en: "Of course, I have already sent it by email.",
      },
      {
        speaker: "Customer service",
        text: "Terima kasih. Jadwal event memang berubah, jadi tiket Anda masih berlaku atau bisa diproses refund.",
        vi: "Cảm ơn. Lịch sự kiện đúng là đã thay đổi, nên vé của anh/chị vẫn còn hiệu lực hoặc có thể được xử lý hoàn tiền.",
        en: "Thank you. The event schedule did change, so your ticket is still valid or the refund can be processed.",
      },
      {
        speaker: "Pelanggan",
        text: "Saya memilih refund, karena saya tidak bisa datang pada tanggal baru.",
        vi: "Tôi chọn hoàn tiền vì tôi không thể đến vào ngày mới.",
        en: "I choose the refund because I cannot attend on the new date.",
      },
      {
        speaker: "Customer service",
        text: "Baik, refund akan diproses dalam tujuh hari kerja.",
        vi: "Vâng, hoàn tiền sẽ được xử lý trong bảy ngày làm việc.",
        en: "All right, the refund will be processed within seven working days.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn xin hoàn tiền vì sự kiện đã bị hủy.",
        prompt_en: "Translate into Indonesian: I want to request a refund because the event was canceled.",
        answer: "Saya ingin minta refund karena acaranya dibatalkan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Barcode tiket saya tidak bisa ____ di pintu masuk.",
        prompt_en: "Fill in the blank: Barcode tiket saya tidak bisa ____ di pintu masuk.",
        answer: "dipindai",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`masih berlaku` nghĩa là gì?",
        prompt_en: "What does `masih berlaku` mean?",
        choices: ["vẫn còn hiệu lực / still valid", "đã bị hủy / canceled", "đã thanh toán / paid"],
        answer: "vẫn còn hiệu lực / still valid",
      },
      {
        type: "rewrite_polite",
        prompt_vi: "Viết lại lịch sự hơn: Saya mau uang saya balik sekarang.",
        prompt_en: "Rewrite more politely: I want my money back now.",
        answer: "Saya ingin minta refund dan mohon diproses sesuai kebijakan.",
      },
    ],
  },
];

export default lessons;
