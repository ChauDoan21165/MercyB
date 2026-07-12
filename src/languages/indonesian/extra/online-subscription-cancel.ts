// Online Subscription Cancellation Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
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

export const onlineSubscriptionCancelLessons: IndonesianLesson[] = [
  {
    id: "indonesian_online_subscription_cancel_trial",
    level: "A2",
    category: "digital_life",
    title_vi: "Hủy langganan online và masa percobaan",
    title_en: "Canceling online subscriptions and trial periods",
    sentences: [
      {
        en: "Saya mau batal langganan online sebelum masa percobaan selesai.",
        vi: "Tôi muốn hủy gói đăng ký online trước khi thời gian dùng thử kết thúc.",
        pronunciation_focus: [
          "SA-ya mau BA-tal lang-GA-nan ON-lain se-BE-lum MA-sa per-CO-ba-an se-LE-sai - `batal langganan` = hủy đăng ký; `masa percobaan` = thời gian dùng thử.",
          "Lỗi người Việt: nói `cancel langganan` được hiểu, nhưng câu Indonesia tự nhiên hơn là `batal langganan`.",
          "Luyện: `Saya mau batal langganan online.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BA-tal lang-GA-nan ON-line se-BE-lum MA-sa per-CHO-ba-an se-LE-sai - `batal langganan` = cancel a subscription; `masa percobaan` = trial period.",
          "VN-speaker trap: `cancel langganan` is understood, but more natural Indonesian is `batal langganan`.",
          "Drill: `Saya mau batal langganan online.`",
        ],
      },
      {
        en: "Akun premium saya masih aktif sampai akhir bulan.",
        vi: "Tài khoản premium của tôi vẫn còn hoạt động đến cuối tháng.",
        pronunciation_focus: [
          "A-kun PRE-mi-um SA-ya MA-sih AK-tif SAM-pai A-khir BU-lan - `akun premium` = tài khoản trả phí/premium; `masih aktif` = vẫn còn hoạt động.",
          "Lỗi người Việt: dùng `rekening` cho tài khoản app. `Rekening` là tài khoản ngân hàng; app/web dùng `akun`.",
          "Luyện: `Akun premium saya masih aktif.`",
        ],
        pronunciation_focus_en: [
          "A-kun PRE-mi-um SA-ya MA-sih AK-tif SAM-pai A-khir BOO-lan - `akun premium` = premium/paid account; `masih aktif` = still active.",
          "VN-speaker trap: using `rekening` for an app account. `Rekening` is a bank account; apps/websites use `akun`.",
          "Drill: `Akun premium saya masih aktif.`",
        ],
      },
      {
        en: "Saya tidak mau tagihan otomatis bulan depan.",
        vi: "Tôi không muốn bị tính phí tự động vào tháng sau.",
        pronunciation_focus: [
          "SA-ya TI-dak mau ta-GI-han o-to-MA-tis BU-lan de-PAN - `tagihan otomatis` = hóa đơn/tính phí tự động; `bulan depan` = tháng sau.",
          "Lỗi người Việt: nói `bayar otomatis` khi ý là bị tính phí. Từ phía khách hàng, `tagihan otomatis` rõ hơn.",
          "Luyện: `Saya tidak mau tagihan otomatis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak mau ta-GEE-han o-to-MA-tis BOO-lan de-PAN - `tagihan otomatis` = automatic billing/charge; `bulan depan` = next month.",
          "VN-speaker trap: saying `bayar otomatis` when you mean being charged. From the customer's side, `tagihan otomatis` is clearer.",
          "Drill: `Saya tidak mau tagihan otomatis.`",
        ],
      },
      {
        en: "Kartu kredit saya sudah terhubung ke aplikasi ini.",
        vi: "Thẻ tín dụng của tôi đã được liên kết với ứng dụng này.",
        pronunciation_focus: [
          "KAR-tu KRE-dit SA-ya SU-dah ter-HU-bung ke ap-li-KA-si I-ni - `kartu kredit` = thẻ tín dụng; `terhubung` = được kết nối/liên kết.",
          "Lỗi người Việt: dịch 'liên kết thẻ' thành `ikat kartu`. Với app, dùng `terhubung` hoặc `ditautkan`.",
          "Luyện: `Kartu kredit saya terhubung ke aplikasi.`",
        ],
        pronunciation_focus_en: [
          "KAR-too KRE-dit SA-ya SOO-dah ter-HOO-boong ke ap-li-KA-si EE-ni - `kartu kredit` = credit card; `terhubung` = connected/linked.",
          "VN-speaker trap: translating 'link a card' as `ikat kartu`. For apps, use `terhubung` or `ditautkan`.",
          "Drill: `Kartu kredit saya terhubung ke aplikasi.`",
        ],
      },
      {
        en: "Tolong konfirmasi kalau langganannya sudah dibatalkan.",
        vi: "Làm ơn xác nhận nếu gói đăng ký đã được hủy.",
        pronunciation_focus: [
          "TO-long kon-fir-MA-si KA-lau lang-GA-nan-nya SU-dah di-BA-tal-kan - `dikonfirmasi`/`konfirmasi` = xác nhận; `dibatalkan` = được hủy.",
          "Lỗi người Việt: né bị động `di-`. Trong app/support, `langganannya sudah dibatalkan` rất tự nhiên.",
          "Luyện: `Langganannya sudah dibatalkan.`",
        ],
        pronunciation_focus_en: [
          "TO-long kon-fir-MA-si KA-lau lang-GA-nan-nya SOO-dah di-BA-tal-kan - `konfirmasi` = confirm; `dibatalkan` = canceled.",
          "VN-speaker trap: avoiding passive `di-`. In app/support language, `langganannya sudah dibatalkan` is natural.",
          "Drill: `Langganannya sudah dibatalkan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nhiều dịch vụ streaming, aplikasi belajar, cloud storage, dan app premium dùng `tagihan otomatis` qua kartu kredit, kartu debit, e-wallet, hoặc toko aplikasi. Trước khi dùng masa percobaan, người dùng nên cek tanggal selesai, cara batal langganan, dan metode pembayaran yang terhubung.",
    cultural_notes_en:
      "In Indonesia, many streaming services, learning apps, cloud storage, and premium apps use automatic billing through credit cards, debit cards, e-wallets, or app stores. Before using a trial period, users should check the end date, cancellation method, and linked payment method.",
    tip_advice_vi:
      "Khung cần nhớ: `batal langganan`, `masa percobaan`, `tagihan otomatis`, `akun premium`, `kartu kredit terhubung`. Khi chat support, xin xác nhận bằng `Tolong konfirmasi...`.",
    tip_advice_en:
      "Useful frames: `batal langganan`, `masa percobaan`, `tagihan otomatis`, `akun premium`, `kartu kredit terhubung`. In support chat, ask for confirmation with `Tolong konfirmasi...`.",
    vocabulary: [
      {
        cell_id: "64d0dc47-460a-445b-b537-27577885a005",
        word: "langganan online",
        en: "online subscription",
        vi: "gói đăng ký online",
        pos: "noun phrase",
        pronunciation_vi: "lang-GA-nan ON-lain",
        pronunciation_en: "lang-GA-nan ON-line",
      },
      {
        cell_id: "3b36656b-3037-4617-a65a-380a145f71b9",
        word: "batal langganan",
        en: "cancel a subscription",
        vi: "hủy đăng ký",
        pos: "verb phrase",
        pronunciation_vi: "BA-tal lang-GA-nan",
        pronunciation_en: "BA-tal lang-GA-nan",
      },
      {
        cell_id: "4bdde1f0-8c8a-4ab6-8f30-4997b132aee2",
        word: "tagihan otomatis",
        en: "automatic billing",
        vi: "tính phí/hóa đơn tự động",
        pos: "noun phrase",
        pronunciation_vi: "ta-GI-han o-to-MA-tis",
        pronunciation_en: "ta-GEE-han o-to-MA-tis",
      },
      {
        cell_id: "aed8d024-fb4b-4015-9063-e0a63975f958",
        word: "kartu kredit",
        en: "credit card",
        vi: "thẻ tín dụng",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu KRE-dit",
        pronunciation_en: "KAR-too KRE-dit",
      },
      {
        cell_id: "ca9e84ca-dc05-45cf-a350-12170910aac4",
        word: "akun premium",
        en: "premium account",
        vi: "tài khoản premium/trả phí",
        pos: "noun phrase",
        pronunciation_vi: "A-kun PRE-mi-um",
        pronunciation_en: "A-kun PRE-mi-um",
      },
      {
        cell_id: "3e871d6d-0f55-439f-82f2-af17daaa1997",
        word: "masa percobaan",
        en: "trial period",
        vi: "thời gian dùng thử",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa per-CO-ba-an",
        pronunciation_en: "MA-sa per-CHO-ba-an",
      },
    ],
    dialogue: [
      {
        cell_id: "30327068-b23d-4b05-a841-c7c74883fd20",
        speaker: "Pelanggan",
        text: "Halo, saya mau batal langganan online sebelum masa percobaan selesai.",
        vi: "A lô, tôi muốn hủy gói đăng ký online trước khi thời gian dùng thử kết thúc.",
        en: "Hello, I want to cancel my online subscription before the trial period ends.",
      },
      {
        cell_id: "7060b408-87b6-48b8-8ffb-b69000b38e8a",
        speaker: "Customer Service",
        text: "Baik. Akun premium Anda masih aktif sampai akhir bulan.",
        vi: "Vâng. Tài khoản premium của bạn vẫn hoạt động đến cuối tháng.",
        en: "Okay. Your premium account is still active until the end of the month.",
      },
      {
        cell_id: "71d332c3-322d-4721-a1d4-1a684d92829a",
        speaker: "Pelanggan",
        text: "Tolong pastikan tidak ada tagihan otomatis bulan depan.",
        vi: "Làm ơn đảm bảo không có tính phí tự động vào tháng sau.",
        en: "Please make sure there is no automatic billing next month.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau batal ___ online.`",
        prompt_en: "Fill in: `Saya mau batal ___ online.`",
        answer: "langganan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi không muốn bị tính phí tự động tháng sau.",
        prompt_en: "Translate to Indonesian: I do not want automatic billing next month.",
        answer: "Saya tidak mau tagihan otomatis bulan depan.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là thời gian dùng thử?",
        prompt_en: "Which phrase means trial period?",
        options: ["masa percobaan", "tagihan otomatis", "akun premium"],
        answer: "masa percobaan",
      },
    ],
  },
  {
    id: "indonesian_subscription_refund_billing_dispute",
    level: "B1",
    category: "digital_life",
    title_vi: "Refund và tranh chấp tagihan otomatis",
    title_en: "Refunds and automatic billing disputes",
    sentences: [
      {
        en: "Saya sudah batal langganan, tetapi masih kena tagihan.",
        vi: "Tôi đã hủy đăng ký, nhưng vẫn bị tính phí.",
        pronunciation_focus: [
          "SA-ya SU-dah BA-tal lang-GA-nan, te-TA-pi MA-sih ke-NA ta-GI-han - `kena tagihan` = bị tính phí/bị ghi hóa đơn.",
          "Lỗi người Việt: dùng `dapat tagihan` khi ý là bị trừ tiền. `Kena tagihan` nhấn mạnh người dùng bị tính phí.",
          "Luyện: `Saya masih kena tagihan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah BA-tal lang-GA-nan, te-TA-pi MA-sih ke-NA ta-GEE-han - `kena tagihan` = got charged/billed.",
          "VN-speaker trap: using `dapat tagihan` when you mean being charged. `Kena tagihan` emphasizes the user was billed.",
          "Drill: `Saya masih kena tagihan.`",
        ],
      },
      {
        en: "Saya ingin mengajukan refund untuk tagihan terakhir.",
        vi: "Tôi muốn yêu cầu hoàn tiền cho khoản tính phí gần nhất.",
        pronunciation_focus: [
          "SA-ya I-ngin meng-a-JU-kan RI-fund un-TUK ta-GI-han ter-a-KHIR - `mengajukan refund` = nộp/yêu cầu hoàn tiền; `tagihan terakhir` = khoản tính phí gần nhất.",
          "Lỗi người Việt: nói `minta kembali uang` dài và kém tự nhiên trong app. Dùng `mengajukan refund` trong support.",
          "Luyện: `Saya ingin mengajukan refund.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meng-a-JOO-kan REE-fund un-TOOK ta-GEE-han ter-a-KHIR - `mengajukan refund` = submit/request a refund; `tagihan terakhir` = latest charge.",
          "VN-speaker trap: long `minta kembali uang` sounds less natural in app support. Use `mengajukan refund`.",
          "Drill: `Saya ingin mengajukan refund.`",
        ],
      },
      {
        en: "Bukti pembayaran dan email pembatalan sudah saya lampirkan.",
        vi: "Tôi đã đính kèm bằng chứng thanh toán và email hủy.",
        pronunciation_focus: [
          "BUK-ti pem-ba-YAR-an dan E-mail pem-ba-TA-lan SU-dah SA-ya lam-PIR-kan - `bukti pembayaran` = bằng chứng thanh toán; `email pembatalan` = email hủy.",
          "Lỗi người Việt: đặt `sudah` cuối câu theo kiểu 'rồi'. Trong Indonesia, `sudah saya lampirkan` đứng trước động từ/chủ thể hành động.",
          "Luyện: `Bukti sudah saya lampirkan.`",
        ],
        pronunciation_focus_en: [
          "BOOK-ti pem-ba-YAR-an dan E-mail pem-ba-TA-lan SOO-dah SA-ya lam-PEER-kan - `bukti pembayaran` = proof of payment; `email pembatalan` = cancellation email.",
          "VN-speaker trap: putting `sudah` at the end like Vietnamese 'rồi'. Indonesian uses `sudah saya lampirkan` before the action.",
          "Drill: `Bukti sudah saya lampirkan.`",
        ],
      },
      {
        en: "Mohon cek status refund saya.",
        vi: "Mong anh/chị kiểm tra trạng thái hoàn tiền của tôi.",
        pronunciation_focus: [
          "MO-hon cek STA-tus RI-fund SA-ya - `mohon` = xin/mong; `status refund` = trạng thái hoàn tiền.",
          "Lỗi người Việt: dùng `tolong` không sai, nhưng trong email/chat hỗ trợ, `mohon` lịch sự hơn.",
          "Luyện: `Mohon cek status refund saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon chek STA-tus REE-fund SA-ya - `mohon` = kindly/request; `status refund` = refund status.",
          "VN-speaker trap: `tolong` is not wrong, but in support email/chat, `mohon` is more polite.",
          "Drill: `Mohon cek status refund saya.`",
        ],
      },
      {
        en: "Apakah kartu kredit saya akan ditagih lagi bulan depan?",
        vi: "Thẻ tín dụng của tôi có bị tính phí lại vào tháng sau không?",
        pronunciation_focus: [
          "a-PA-kah KAR-tu KRE-dit SA-ya A-kan di-TA-gih LA-gi BU-lan de-PAN - `ditagih lagi` = bị tính phí/đòi tiền lại.",
          "Lỗi người Việt: dùng `tagih lagi saya` sai trật tự. Khi thẻ là chủ ngữ, dùng bị động `kartu kredit saya akan ditagih lagi`.",
          "Luyện: `Apakah saya akan ditagih lagi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah KAR-too KRE-dit SA-ya A-kan di-TA-gih LA-gi BOO-lan de-PAN - `ditagih lagi` = charged/billed again.",
          "VN-speaker trap: saying `tagih lagi saya` with the wrong order. When the card is the subject, use passive `kartu kredit saya akan ditagih lagi`.",
          "Drill: `Apakah saya akan ditagih lagi?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi tranh chấp tagihan langganan online, support thường meminta bukti pembayaran, email pembatalan, tanggal tagihan, dan metode pembayaran. Simpan screenshot halaman pembatalan, nomor tiket, dan email konfirmasi agar mudah follow up.",
    cultural_notes_en:
      "When disputing online subscription charges, support often asks for proof of payment, cancellation email, billing date, and payment method. Keep screenshots of the cancellation page, ticket number, and confirmation email for follow-up.",
    tip_advice_vi:
      "Mẫu komplain rõ: masalah + bukti + yêu cầu. Ví dụ: `Saya sudah batal langganan, tetapi masih kena tagihan. Bukti pembayaran sudah saya lampirkan. Saya ingin mengajukan refund.`",
    tip_advice_en:
      "Clear complaint pattern: problem + evidence + request. Example: `Saya sudah batal langganan, tetapi masih kena tagihan. Bukti pembayaran sudah saya lampirkan. Saya ingin mengajukan refund.`",
    vocabulary: [
      {
        cell_id: "2ef1766a-703c-41e4-b1f5-eca453b326c6",
        word: "kena tagihan",
        en: "got charged / billed",
        vi: "bị tính phí",
        pos: "verb phrase",
        pronunciation_vi: "ke-NA ta-GI-han",
        pronunciation_en: "ke-NA ta-GEE-han",
      },
      {
        cell_id: "139857c7-70d2-4bb8-95ee-76c30041ca5e",
        word: "mengajukan refund",
        en: "request a refund",
        vi: "yêu cầu hoàn tiền",
        pos: "verb phrase",
        pronunciation_vi: "meng-a-JU-kan RI-fund",
        pronunciation_en: "meng-a-JOO-kan REE-fund",
      },
      {
        cell_id: "fb97033e-67a5-41e2-b329-ed203cd72b68",
        word: "bukti pembayaran",
        en: "proof of payment",
        vi: "bằng chứng thanh toán",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti pem-ba-YAR-an",
        pronunciation_en: "BOOK-ti pem-ba-YAR-an",
      },
      {
        cell_id: "f24fa945-6cf6-4725-875b-819e2a2d395d",
        word: "email pembatalan",
        en: "cancellation email",
        vi: "email hủy đăng ký",
        pos: "noun phrase",
        pronunciation_vi: "E-mail pem-ba-TA-lan",
        pronunciation_en: "E-mail pem-ba-TA-lan",
      },
      {
        cell_id: "0187d382-0432-4777-806b-0f03bd9b49ac",
        word: "status refund",
        en: "refund status",
        vi: "trạng thái hoàn tiền",
        pos: "noun phrase",
        pronunciation_vi: "STA-tus RI-fund",
        pronunciation_en: "STA-tus REE-fund",
      },
      {
        cell_id: "3ea2ecea-5f24-46b5-ba54-11b3314cf069",
        word: "ditagih lagi",
        en: "charged again",
        vi: "bị tính phí lại",
        pos: "verb phrase",
        pronunciation_vi: "di-TA-gih LA-gi",
        pronunciation_en: "di-TA-gih LA-gi",
      },
    ],
    dialogue: [
      {
        cell_id: "5fdd907f-7f34-48c4-b5cb-532b91e5c92e",
        speaker: "Pelanggan",
        text: "Saya sudah batal langganan, tetapi masih kena tagihan.",
        vi: "Tôi đã hủy đăng ký, nhưng vẫn bị tính phí.",
        en: "I already canceled the subscription, but I was still charged.",
      },
      {
        cell_id: "0d1aea7d-30ab-4791-81fa-a8981ec11f7c",
        speaker: "Customer Service",
        text: "Mohon kirim bukti pembayaran dan email pembatalan.",
        vi: "Vui lòng gửi bằng chứng thanh toán và email hủy.",
        en: "Please send proof of payment and the cancellation email.",
      },
      {
        cell_id: "60efd9bd-8ff4-4c96-9f1c-d4ef6fa448fd",
        speaker: "Pelanggan",
        text: "Sudah saya lampirkan. Saya ingin mengajukan refund.",
        vi: "Tôi đã đính kèm rồi. Tôi muốn yêu cầu hoàn tiền.",
        en: "I have attached them. I want to request a refund.",
      },
      {
        cell_id: "31397da8-b1c2-42f1-9ac4-5cad3244d967",
        speaker: "Customer Service",
        text: "Baik, kami akan cek status refund Anda.",
        vi: "Vâng, chúng tôi sẽ kiểm tra trạng thái hoàn tiền của bạn.",
        en: "Okay, we will check your refund status.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya sudah batal langganan, tetapi masih kena ___.`",
        prompt_en: "Fill in: `Saya sudah batal langganan, tetapi masih kena ___.`",
        answer: "tagihan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi muốn yêu cầu hoàn tiền.",
        prompt_en: "Translate to Indonesian: I want to request a refund.",
        answer: "Saya ingin mengajukan refund.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `bukti pembayaran`, `email pembatalan`, `ditagih lagi`.",
        prompt_en: "Match meanings: `bukti pembayaran`, `email pembatalan`, `ditagih lagi`.",
        pairs: [
          ["bukti pembayaran", "bằng chứng thanh toán / proof of payment"],
          ["email pembatalan", "email hủy đăng ký / cancellation email"],
          ["ditagih lagi", "bị tính phí lại / charged again"],
        ],
      },
    ],
  },
];
