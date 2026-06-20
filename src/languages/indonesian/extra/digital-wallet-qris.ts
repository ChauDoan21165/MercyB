// Digital Wallet & QRIS Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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
    id: "indonesian_digital_wallet_qris",
    level: "A2",
    category: "money",
    title_vi: "Ví điện tử và thanh toán QRIS",
    title_en: "Digital wallets and QRIS payments",
    sentences: [
      {
        en: "Saya mau bayar pakai e-wallet.",
        vi: "Tôi muốn trả bằng ví điện tử.",
        pronunciation_focus: [
          "SA-ya mau BA-yar PA-kai I-WA-let - `bayar pakai` = trả bằng; `e-wallet` = ví điện tử.",
          "Lỗi người Việt: dùng `dengan` theo kiểu dịch chữ. Trong thanh toán hằng ngày, `bayar pakai GoPay/e-wallet` tự nhiên hơn.",
          "Luyện: `Saya mau bayar pakai e-wallet.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BA-yar PA-kai EE-WA-let - `bayar pakai` = pay with; `e-wallet` = digital wallet.",
          "VN-speaker trap: using literal `dengan`. In everyday payment speech, `bayar pakai GoPay/e-wallet` is more natural.",
          "Drill: `Saya mau bayar pakai e-wallet.`",
        ],
      },
      {
        en: "Bisa bayar pakai QRIS?",
        vi: "Có thể trả bằng QRIS không?",
        pronunciation_focus: [
          "BI-sa BA-yar PA-kai ku-RIS - `QRIS` thường đọc `ku-ris`; nghĩa là mã QR thanh toán chung ở Indonesia.",
          "Lỗi người Việt: đánh vần Q-R-I-S từng chữ. Ngoài đời nhiều người nói gọn `ku-ris`.",
          "Luyện: `Bisa bayar pakai QRIS?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa BA-yar PA-kai koo-RIS - `QRIS` is commonly said `ku-ris`; it is Indonesia's standard payment QR.",
          "VN-speaker trap: spelling Q-R-I-S letter by letter. In daily speech many people say `ku-ris`.",
          "Drill: `Bisa bayar pakai QRIS?`",
        ],
      },
      {
        en: "Saya scan QR-nya dulu, ya.",
        vi: "Tôi quét mã QR trước nhé.",
        pronunciation_focus: [
          "SA-ya skan ku-ER-nya DU-lu ya - `scan QR` = quét mã QR; `dulu` = trước đã.",
          "Lỗi người Việt: dịch `scan` thành `sapu` (= quét nhà). Quét mã dùng `scan`, không dùng `sapu`.",
          "Luyện: `Saya scan QR-nya dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya skan koo-ER-nya DOO-loo ya - `scan QR` = scan the QR code; `dulu` = first.",
          "VN-speaker trap: translating scan as `sapu` (= sweep). Scanning a code uses `scan`, not `sapu`.",
          "Drill: `Saya scan QR-nya dulu.`",
        ],
      },
      {
        en: "Saldo GoPay saya kurang.",
        vi: "Số dư GoPay của tôi không đủ.",
        pronunciation_focus: [
          "SAL-do go-PAI SA-ya KU-rang - `saldo` = số dư; `kurang` = thiếu/không đủ.",
          "Lỗi người Việt: nói `uang saya kurang` trong app. Với ví điện tử, nói rõ `saldo saya kurang`.",
          "Luyện: `Saldo GoPay saya kurang.`",
        ],
        pronunciation_focus_en: [
          "SAL-do go-PAI SA-ya KOO-rang - `saldo` = balance; `kurang` = insufficient.",
          "VN-speaker trap: saying `uang saya kurang` in an app context. For e-wallets, say `saldo saya kurang`.",
          "Drill: `Saldo GoPay saya kurang.`",
        ],
      },
      {
        en: "Saya perlu top up OVO dulu.",
        vi: "Tôi cần nạp tiền vào OVO trước đã.",
        pronunciation_focus: [
          "SA-ya per-LU top-AP O-vo DU-lu - `top up` = nạp tiền; `dulu` = trước đã.",
          "Lỗi người Việt: nói `isi uang OVO`. Cách tự nhiên: `top up OVO` hoặc `isi saldo OVO`.",
          "Luyện: `Saya perlu top up OVO dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO top-UP O-vo DOO-loo - `top up` = load funds; `dulu` = first.",
          "VN-speaker trap: saying `isi uang OVO`. Natural phrasing is `top up OVO` or `isi saldo OVO`.",
          "Drill: `Saya perlu top up OVO dulu.`",
        ],
      },
      {
        en: "DANA dan ShopeePay juga bisa dipakai di sini.",
        vi: "DANA và ShopeePay cũng có thể dùng ở đây.",
        pronunciation_focus: [
          "DA-na dan SHO-pi-pei JU-ga BI-sa di-PA-kai di SI-ni - `bisa dipakai` = có thể được dùng; `di sini` = ở đây.",
          "Lỗi người Việt: quên bị động `di-` trong ngôn ngữ app. `Bisa dipakai` rất tự nhiên cho phương thức thanh toán.",
          "Luyện: `ShopeePay bisa dipakai di sini.`",
        ],
        pronunciation_focus_en: [
          "DA-na dan SHO-pee-pay JOO-ga BEE-sa di-PA-kai di SEE-ni - `bisa dipakai` = can be used; `di sini` = here.",
          "VN-speaker trap: dropping passive `di-` in app/payment language. `Bisa dipakai` is very natural for payment methods.",
          "Drill: `ShopeePay bisa dipakai di sini.`",
        ],
      },
      {
        en: "Transaksi saya gagal, tapi saldo sudah terpotong.",
        vi: "Giao dịch của tôi thất bại, nhưng số dư đã bị trừ.",
        pronunciation_focus: [
          "tran-SAK-si SA-ya GA-gal, TA-pi SAL-do SU-dah ter-PO-tong - `transaksi gagal` = giao dịch thất bại; `terpotong` = bị trừ.",
          "Lỗi người Việt: nói `saldo hilang`. Trong thanh toán, số dư bị trừ là `saldo terpotong`.",
          "Luyện: `Transaksi gagal, saldo terpotong.`",
        ],
        pronunciation_focus_en: [
          "tran-SAK-see SA-ya GA-gal, TA-pi SAL-do SOO-dah ter-PO-tong - `transaksi gagal` = failed transaction; `terpotong` = deducted.",
          "VN-speaker trap: saying `saldo hilang`. In payments, deducted balance is `saldo terpotong`.",
          "Drill: `Transaksi gagal, saldo terpotong.`",
        ],
      },
      {
        en: "Tolong cek status pembayaran saya.",
        vi: "Làm ơn kiểm tra trạng thái thanh toán của tôi.",
        pronunciation_focus: [
          "TO-long cek STA-tus pem-ba-YA-ran SA-ya - `cek status` = kiểm tra trạng thái; `pembayaran` = việc thanh toán.",
          "Lỗi người Việt: dùng `lihat` cho kiểm tra hệ thống. Trong app/CS, dùng `cek status`.",
          "Luyện: `Tolong cek status pembayaran saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long chek STA-tus pem-ba-YA-ran SA-ya - `cek status` = check status; `pembayaran` = payment.",
          "VN-speaker trap: using `lihat` for a system check. In app/customer service contexts, use `cek status`.",
          "Drill: `Tolong cek status pembayaran saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "QRIS là chuẩn mã QR thanh toán chung ở Indonesia, thường dùng được với nhiều ví điện tử và app ngân hàng. Ở warung, quán cà phê, minimarket hoặc chợ, bạn có thể hỏi `Bisa QRIS?` hoặc `Bisa bayar pakai QRIS?`. GoPay, OVO, DANA và ShopeePay đều là ví điện tử quen thuộc; người bán thường chỉ cần bạn scan mã và cho xem bukti pembayaran nếu cần.",
    cultural_notes_en:
      "QRIS is Indonesia's shared QR payment standard and usually works with many e-wallets and banking apps. At a warung, cafe, minimarket, or market stall, you can ask `Bisa QRIS?` or `Bisa bayar pakai QRIS?`. GoPay, OVO, DANA, and ShopeePay are common e-wallets; sellers usually just need you to scan the code and show proof of payment if asked.",
    tip_advice_vi:
      "Mẹo cho người Việt: ba cụm sống còn là `bayar pakai ...` (trả bằng ...), `top up/isi saldo` (nạp số dư), và `transaksi gagal` (giao dịch lỗi). Khi tiền bị trừ, nói `saldo terpotong`; khi cần kiểm tra, nói `tolong cek status pembayaran saya`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: three survival phrases are `bayar pakai ...` (pay with ...), `top up/isi saldo` (load balance), and `transaksi gagal` (failed transaction). When money is deducted, say `saldo terpotong`; when you need help checking, say `tolong cek status pembayaran saya`.",
    vocabulary: [
      {
        word: "e-wallet",
        en: "digital wallet",
        vi: "ví điện tử",
        pos: "noun",
        pronunciation_vi: "I-WA-let",
        pronunciation_en: "EE-WA-let",
      },
      {
        word: "QRIS",
        en: "Indonesian QR payment standard",
        vi: "chuẩn thanh toán QRIS",
        pos: "noun",
        pronunciation_vi: "ku-RIS",
        pronunciation_en: "koo-RIS",
      },
      {
        word: "GoPay",
        en: "GoPay e-wallet",
        vi: "ví GoPay",
        pos: "proper noun",
        pronunciation_vi: "go-PAI",
        pronunciation_en: "go-PIE",
      },
      {
        word: "OVO",
        en: "OVO e-wallet",
        vi: "ví OVO",
        pos: "proper noun",
        pronunciation_vi: "O-vo",
        pronunciation_en: "OH-vo",
      },
      {
        word: "DANA",
        en: "DANA e-wallet",
        vi: "ví DANA",
        pos: "proper noun",
        pronunciation_vi: "DA-na",
        pronunciation_en: "DA-na",
      },
      {
        word: "ShopeePay",
        en: "ShopeePay e-wallet",
        vi: "ví ShopeePay",
        pos: "proper noun",
        pronunciation_vi: "SHO-pi-pei",
        pronunciation_en: "SHO-pee-pay",
      },
      {
        word: "top up",
        en: "top up / load funds",
        vi: "nạp tiền",
        pos: "verb phrase",
        pronunciation_vi: "top-AP",
        pronunciation_en: "top-UP",
      },
      {
        word: "scan QR",
        en: "scan QR code",
        vi: "quét mã QR",
        pos: "verb phrase",
        pronunciation_vi: "skan ku-ER",
        pronunciation_en: "scan cue-AR",
      },
      {
        word: "transaksi gagal",
        en: "failed transaction",
        vi: "giao dịch thất bại",
        pos: "noun phrase",
        pronunciation_vi: "tran-SAK-si GA-gal",
        pronunciation_en: "tran-SAK-see GA-gal",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Pak, bisa bayar pakai QRIS?",
        vi: "Chú ơi, có thể trả bằng QRIS không?",
        en: "Sir, can I pay with QRIS?",
      },
      {
        speaker: "Penjual",
        text: "Bisa. Silakan scan QR-nya di sini.",
        vi: "Được. Mời quét mã QR ở đây.",
        en: "Yes. Please scan the QR code here.",
      },
      {
        speaker: "Pembeli",
        text: "Saldo GoPay saya kurang. Saya top up dulu, ya.",
        vi: "Số dư GoPay của tôi không đủ. Tôi nạp tiền trước nhé.",
        en: "My GoPay balance is insufficient. I'll top up first.",
      },
      {
        speaker: "Pembeli",
        text: "Transaksi saya gagal, tapi saldo sudah terpotong.",
        vi: "Giao dịch của tôi thất bại, nhưng số dư đã bị trừ.",
        en: "My transaction failed, but the balance was deducted.",
      },
      {
        speaker: "Penjual",
        text: "Tolong cek status pembayaran di aplikasinya dulu.",
        vi: "Làm ơn kiểm tra trạng thái thanh toán trong app trước.",
        en: "Please check the payment status in the app first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau bayar ___ e-wallet.`",
        prompt_en: "Fill in the blank: `Saya mau bayar ___ e-wallet.`",
        answer: "pakai",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Giao dịch của tôi thất bại.",
        prompt_en: "Translate into Indonesian: My transaction failed.",
        answer: "Transaksi saya gagal.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["QRIS", "chuẩn thanh toán QR"],
          ["top up", "nạp tiền"],
          ["scan QR", "quét mã QR"],
          ["saldo", "số dư"],
          ["transaksi gagal", "giao dịch thất bại"],
        ],
      },
    ],
  },
];
