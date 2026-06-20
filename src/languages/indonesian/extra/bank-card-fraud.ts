// Bank Card Fraud Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
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
    id: "indonesian_bank_card_fraud",
    level: "B1",
    category: "money",
    title_vi: "Mất thẻ ATM và giao dịch đáng ngờ",
    title_en: "Lost ATM cards and suspicious transactions",
    sentences: [
      {
        en: "Kartu ATM saya hilang, tolong segera diblokir.",
        vi: "Thẻ ATM của tôi bị mất, làm ơn khóa ngay.",
        pronunciation_focus: [
          "KAR-tu A-TE-EM SA-ya HI-lang, TO-long se-GE-ra di-blo-KIR - `kartu ATM hilang` = thẻ ATM bị mất; `diblokir` = được/bị khóa.",
          "Lỗi người Việt: nói `tolong blokir` được hiểu, nhưng với yêu cầu dịch vụ, bị động `tolong diblokir` lịch sự và tự nhiên hơn.",
          "Luyện: `Kartu ATM saya hilang.`",
        ],
        pronunciation_focus_en: [
          "KAR-tu A-TE-EM SA-ya HI-lang, TO-long se-GE-ra di-blo-KIR - `kartu ATM hilang` = lost ATM card; `diblokir` = be blocked.",
          "VN-speaker trap: `tolong blokir` is understood, but for service requests passive `tolong diblokir` is more polite and natural.",
          "Drill: `Kartu ATM saya hilang.`",
        ],
      },
      {
        en: "Ada transaksi mencurigakan di rekening saya.",
        vi: "Có giao dịch đáng ngờ trong tài khoản ngân hàng của tôi.",
        pronunciation_focus: [
          "A-da tran-SAK-si men-cu-ri-GA-kan di re-KE-ning SA-ya - `transaksi mencurigakan` = giao dịch đáng ngờ.",
          "Lỗi người Việt: đọc `c` như k. Trong `mencurigakan`, `c` đọc như 'ch': men-chu-ri-GA-kan.",
          "Luyện: `Ada transaksi mencurigakan.`",
        ],
        pronunciation_focus_en: [
          "A-da tran-SAK-see men-choo-ree-GA-kan di re-KE-ning SA-ya - `transaksi mencurigakan` = suspicious transaction.",
          "VN-speaker trap: reading `c` as k. In `mencurigakan`, `c` sounds like 'ch': men-choo-ree-GA-kan.",
          "Drill: `Ada transaksi mencurigakan.`",
        ],
      },
      {
        en: "Saya mau lapor bank karena kartu saya disalahgunakan.",
        vi: "Tôi muốn báo ngân hàng vì thẻ của tôi bị sử dụng sai mục đích.",
        pronunciation_focus: [
          "SA-ya mau la-POR bank ka-RE-na KAR-tu SA-ya di-sa-lah-gu-NA-kan - `lapor bank` = báo ngân hàng; `disalahgunakan` = bị lạm dụng.",
          "Lỗi người Việt: nói `kartu saya dipakai orang` vẫn hiểu, nhưng báo cáo chính thức nên dùng `disalahgunakan`.",
          "Luyện: `Saya mau lapor bank.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau la-POR bank ka-RE-na KAR-tu SA-ya di-sa-lah-goo-NA-kan - `lapor bank` = report to the bank; `disalahgunakan` = misused.",
          "VN-speaker trap: `kartu saya dipakai orang` is understood, but official reports are better with `disalahgunakan`.",
          "Drill: `Saya mau lapor bank.`",
        ],
      },
      {
        en: "Tolong blokir kartu debit saya sementara.",
        vi: "Làm ơn khóa thẻ ghi nợ của tôi tạm thời.",
        pronunciation_focus: [
          "TO-long BLO-kir KAR-tu DE-bit SA-ya se-men-TA-ra - `blokir kartu` = khóa thẻ; `sementara` = tạm thời.",
          "Lỗi người Việt: dùng `matikan kartu` theo kiểu tắt. Với thẻ ngân hàng, dùng `blokir kartu`.",
          "Luyện: `Tolong blokir kartu debit saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long BLO-kir KAR-tu DE-bit SA-ya se-men-TA-ra - `blokir kartu` = block/freeze a card; `sementara` = temporarily.",
          "VN-speaker trap: saying `matikan kartu` like turning something off. For bank cards, use `blokir kartu`.",
          "Drill: `Tolong blokir kartu debit saya.`",
        ],
      },
      {
        en: "Saya tidak pernah memberikan PIN kepada siapa pun.",
        vi: "Tôi chưa bao giờ đưa mã PIN cho bất kỳ ai.",
        pronunciation_focus: [
          "SA-ya ti-DAK PER-nah mem-BE-ri-kan pin ke-PA-da SI-a-pa pun - `tidak pernah` = chưa bao giờ; `siapa pun` = bất kỳ ai.",
          "Lỗi người Việt: bỏ `pun`. Trong cảnh báo bảo mật, `siapa pun` nhấn mạnh không đưa cho bất kỳ ai.",
          "Luyện: `Jangan berikan PIN kepada siapa pun.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ti-DAK PER-nah mem-BE-ri-kan PIN ke-PA-da SI-a-pa pun - `tidak pernah` = never; `siapa pun` = anyone at all.",
          "VN-speaker trap: dropping `pun`. In security warnings, `siapa pun` emphasizes not to give it to anyone.",
          "Drill: `Jangan berikan PIN kepada siapa pun.`",
        ],
      },
      {
        en: "Rekening saya sepertinya dibobol.",
        vi: "Tài khoản ngân hàng của tôi hình như bị xâm nhập/rút trộm.",
        pronunciation_focus: [
          "re-KE-ning SA-ya se-PER-ti-nya di-BO-bol - `rekening dibobol` = tài khoản bị xâm nhập/rút trộm.",
          "Lỗi người Việt: dùng `akun` cho ngân hàng. Trong ngân hàng, nói `rekening`; `akun` hợp với app/mạng xã hội.",
          "Luyện: `Rekening saya dibobol.`",
        ],
        pronunciation_focus_en: [
          "re-KE-ning SA-ya se-PER-ti-nya di-BO-bol - `rekening dibobol` = bank account was breached/drained.",
          "VN-speaker trap: using `akun` for bank account. Banking uses `rekening`; `akun` fits apps/social media.",
          "Drill: `Rekening saya dibobol.`",
        ],
      },
      {
        en: "Saya perlu bicara dengan customer service sekarang.",
        vi: "Tôi cần nói chuyện với bộ phận chăm sóc khách hàng ngay bây giờ.",
        pronunciation_focus: [
          "SA-ya per-LU bi-CA-ra de-NGAN KAS-to-mer SER-vis se-KA-rang - `customer service` = chăm sóc khách hàng.",
          "Lỗi người Việt: dịch dài `layanan pelanggan` không sai, nhưng ở ngân hàng/app người ta rất hay nói `customer service`.",
          "Luyện: `Saya perlu bicara dengan customer service.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO bi-CHA-ra de-NGAN customer service se-KA-rang - `customer service` = customer support.",
          "VN-speaker trap: formal `layanan pelanggan` is correct, but banks/apps commonly say `customer service`.",
          "Drill: `Saya perlu bicara dengan customer service.`",
        ],
      },
      {
        en: "Apakah dana yang hilang bisa dikembalikan?",
        vi: "Số tiền bị mất có thể được hoàn lại không?",
        pronunciation_focus: [
          "a-PA-kah DA-na yang HI-lang BI-sa di-kem-BA-li-kan - `dana yang hilang` = số tiền bị mất; `dikembalikan` = được hoàn lại.",
          "Lỗi người Việt: nói `uang kembali?` quá rút gọn. Câu rõ hơn: `bisa dikembalikan?`.",
          "Luyện: `Dana bisa dikembalikan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah DA-na yang HI-lang BI-sa di-kem-BA-li-kan - `dana yang hilang` = missing/lost funds; `dikembalikan` = returned/refunded.",
          "VN-speaker trap: saying clipped `uang kembali?`. Clearer: `bisa dikembalikan?`.",
          "Drill: `Dana bisa dikembalikan?`",
        ],
      },
      {
        en: "Saya sudah mengganti PIN lewat ATM resmi.",
        vi: "Tôi đã đổi mã PIN qua cây ATM chính thức.",
        pronunciation_focus: [
          "SA-ya SU-dah meng-GAN-ti pin LE-wat A-TE-EM res-MI - `mengganti PIN` = đổi PIN; `resmi` = chính thức.",
          "Lỗi người Việt: dùng `di ATM` cho kênh/thao tác. Cả `di ATM` và `lewat ATM` được, nhưng `lewat` nhấn mạnh qua kênh ATM.",
          "Luyện: `Saya sudah mengganti PIN.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah meng-GAN-ti PIN LE-wat A-TE-EM res-MI - `mengganti PIN` = change PIN; `resmi` = official.",
          "VN-speaker trap: overusing `di ATM` for the channel/action. `di ATM` and `lewat ATM` work, but `lewat` emphasizes via ATM.",
          "Drill: `Saya sudah mengganti PIN.`",
        ],
      },
      {
        en: "Mohon kirim nomor laporan kasus ini.",
        vi: "Mong anh/chị gửi số báo cáo của vụ việc này.",
        pronunciation_focus: [
          "MO-hon KI-rim NO-mor la-POR-an KA-sus I-ni - `nomor laporan` = số báo cáo/mã vụ việc; `mohon` = mong/xin.",
          "Lỗi người Việt: hỏi `apa nomor laporan`. Khi hỏi số/mã, dùng `berapa` hoặc yêu cầu `kirim nomor laporan`.",
          "Luyện: `Mohon kirim nomor laporan.`",
        ],
        pronunciation_focus_en: [
          "MO-hon KI-rim NO-mor la-POR-an KA-sus I-ni - `nomor laporan` = report/case number; `mohon` = kindly request.",
          "VN-speaker trap: asking `apa nomor laporan`. For a number/code, use `berapa` or request `kirim nomor laporan`.",
          "Drill: `Mohon kirim nomor laporan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi thẻ ATM mất hoặc có transaksi mencurigakan ở Indonesia, bước an toàn là segera blokir kartu qua mobile banking, call center resmi, hoặc cabang bank. Không bao giờ đưa PIN, OTP, CVV, hoặc mật khẩu cho người gọi tự nhận từ bank. Nhiều ngân hàng dùng từ `customer service`, `call center`, `blokir kartu`, `lapor transaksi`, và `nomor laporan`. Hãy lưu bukti như tangkapan layar, SMS, mutasi rekening, và thời gian giao dịch.",
    cultural_notes_en:
      "When an ATM card is lost or there is a suspicious transaction in Indonesia, the safe step is to block the card immediately via mobile banking, the official call center, or a bank branch. Never give PIN, OTP, CVV, or passwords to callers claiming to be from the bank. Banks often use terms like `customer service`, `call center`, `blokir kartu`, `lapor transaksi`, and `nomor laporan`. Keep evidence such as screenshots, SMS, account statements, and transaction times.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong ngân hàng dùng `rekening`, không phải `akun`. Câu khẩn cấp nên thuộc lòng: `Kartu ATM saya hilang, tolong segera diblokir`, `Ada transaksi mencurigakan`, `Rekening saya sepertinya dibobol`, và `Saya tidak pernah memberikan PIN kepada siapa pun`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in banking use `rekening`, not `akun`. Memorize these emergency lines: `Kartu ATM saya hilang, tolong segera diblokir`, `Ada transaksi mencurigakan`, `Rekening saya sepertinya dibobol`, and `Saya tidak pernah memberikan PIN kepada siapa pun`.",
    vocabulary: [
      {
        word: "kartu ATM hilang",
        en: "lost ATM card",
        vi: "thẻ ATM bị mất",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu A-TE-EM HI-lang",
        pronunciation_en: "KAR-tu A-TE-EM HI-lang",
      },
      {
        word: "transaksi mencurigakan",
        en: "suspicious transaction",
        vi: "giao dịch đáng ngờ",
        pos: "noun phrase",
        pronunciation_vi: "tran-SAK-si men-chu-ri-GA-kan",
        pronunciation_en: "tran-SAK-see men-choo-ree-GA-kan",
      },
      {
        word: "blokir kartu",
        en: "block/freeze a card",
        vi: "khóa thẻ",
        pos: "verb phrase",
        pronunciation_vi: "BLO-kir KAR-tu",
        pronunciation_en: "BLO-keer KAR-too",
      },
      {
        word: "lapor bank",
        en: "report to the bank",
        vi: "báo ngân hàng",
        pos: "verb phrase",
        pronunciation_vi: "la-POR bank",
        pronunciation_en: "la-POR bank",
      },
      {
        word: "PIN",
        en: "PIN",
        vi: "mã PIN",
        pos: "noun",
        pronunciation_vi: "pin",
        pronunciation_en: "pin",
      },
      {
        word: "rekening dibobol",
        en: "account breached/drained",
        vi: "tài khoản bị xâm nhập/rút trộm",
        pos: "phrase",
        pronunciation_vi: "re-KE-ning di-BO-bol",
        pronunciation_en: "re-KE-ning di-BO-bol",
      },
      {
        word: "customer service",
        en: "customer service",
        vi: "chăm sóc khách hàng",
        pos: "noun",
        pronunciation_vi: "KAS-to-mer SER-vis",
        pronunciation_en: "customer service",
      },
      {
        word: "nomor laporan",
        en: "report number",
        vi: "số báo cáo/mã vụ việc",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-POR-an",
        pronunciation_en: "NO-mor la-POR-an",
      },
      {
        word: "dana hilang",
        en: "missing funds",
        vi: "số tiền bị mất",
        pos: "noun phrase",
        pronunciation_vi: "DA-na HI-lang",
        pronunciation_en: "DA-na HI-lang",
      },
      {
        word: "disalahgunakan",
        en: "misused",
        vi: "bị lạm dụng/sử dụng sai mục đích",
        pos: "passive verb",
        pronunciation_vi: "di-sa-lah-gu-NA-kan",
        pronunciation_en: "di-sa-lah-goo-NA-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Halo, kartu ATM saya hilang. Tolong segera diblokir.",
        vi: "Alo, thẻ ATM của tôi bị mất. Làm ơn khóa ngay.",
        en: "Hello, my ATM card is lost. Please block it immediately.",
      },
      {
        speaker: "Customer Service",
        text: "Baik, Pak. Apakah ada transaksi mencurigakan?",
        vi: "Vâng ạ. Có giao dịch đáng ngờ không?",
        en: "Okay, sir. Is there any suspicious transaction?",
      },
      {
        speaker: "Nasabah",
        text: "Ada. Rekening saya sepertinya dibobol, dan saya tidak pernah memberikan PIN.",
        vi: "Có. Tài khoản của tôi hình như bị xâm nhập, và tôi chưa bao giờ đưa mã PIN.",
        en: "Yes. My account seems to have been breached, and I never gave out my PIN.",
      },
      {
        speaker: "Customer Service",
        text: "Kami buatkan laporan. Mohon simpan nomor laporan ini.",
        vi: "Chúng tôi sẽ lập báo cáo. Xin lưu số báo cáo này.",
        en: "We will create a report. Please keep this report number.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thẻ ngân hàng và gian lận:",
        instruction_en: "Fill in the bank-card fraud word:",
        items: [
          {
            prompt: "Kartu ATM saya hilang, tolong segera ___. (khóa)",
            answer: "diblokir",
            options: ["diblokir", "dibuka", "dibayar"],
          },
          {
            prompt: "Ada transaksi ___ di rekening saya. (đáng ngờ)",
            answer: "mencurigakan",
            options: ["mencurigakan", "menyenangkan", "menguntungkan"],
          },
          {
            prompt: "Rekening saya sepertinya ___. (bị xâm nhập/rút trộm)",
            answer: "dibobol",
            options: ["dibobol", "dibeli", "dibawa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "blokir kartu", answer: "khóa thẻ" },
          { prompt: "lapor bank", answer: "báo ngân hàng" },
          { prompt: "PIN", answer: "mã PIN" },
          { prompt: "customer service", answer: "chăm sóc khách hàng" },
          { prompt: "nomor laporan", answer: "số báo cáo/mã vụ việc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Thẻ ATM của tôi bị mất, làm ơn khóa ngay.",
            answer: "Kartu ATM saya hilang, tolong segera diblokir.",
          },
          {
            prompt: "Có giao dịch đáng ngờ trong tài khoản ngân hàng của tôi.",
            answer: "Ada transaksi mencurigakan di rekening saya.",
          },
          {
            prompt: "Tôi chưa bao giờ đưa mã PIN cho bất kỳ ai.",
            answer: "Saya tidak pernah memberikan PIN kepada siapa pun.",
          },
        ],
      },
    ],
  },
];
