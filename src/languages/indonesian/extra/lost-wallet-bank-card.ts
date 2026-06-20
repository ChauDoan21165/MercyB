// Indonesian lost wallet and bank card lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lostWalletBankCardLessons: IndonesianLesson[] = [
  {
    id: "indonesian_lost_wallet_police_report",
    level: "B1",
    category: "money_emergency",
    title_vi: "Mất ví và làm laporan kehilangan",
    title_en: "Lost wallet and filing a loss report",
    sentences: [
      {
        en: "Dompet saya hilang di dalam taksi online.",
        vi: "Ví của tôi bị mất trong xe taxi công nghệ.",
        pronunciation_focus: [
          "DOM-pet SA-ya HI-lang di DA-lam TAK-si ON-lain.",
          "`dompet hilang` = ví bị mất; `di dalam` = ở bên trong.",
          "L1 Việt: với đồ bị mất, dùng `hilang`, không dùng `kalah` hay `mati`.",
        ],
        pronunciation_focus_en: [
          "DOM-pet SA-ya HI-lang di DA-lam TAK-si ON-line.",
          "`dompet hilang` = wallet is lost; `di dalam` = inside.",
          "VN-speaker trap: for lost items, use `hilang`, not `kalah` or `mati`.",
        ],
      },
      {
        en: "Di dompet ada KTP, kartu ATM, dan uang tunai.",
        vi: "Trong ví có KTP, thẻ ATM và tiền mặt.",
        pronunciation_focus: [
          "di DOM-pet A-da ka-te-PE, KAR-tu A-TE-EM, dan U-ang TU-nai.",
          "`uang tunai` = tiền mặt; `kartu ATM` đọc từng chữ A-TE-EM.",
          "L1 Việt: `di dompet ada...` là cách nói tự nhiên để liệt kê đồ trong ví.",
        ],
        pronunciation_focus_en: [
          "di DOM-pet A-da ka-te-PE, KAR-tu A-TE-EM, dan OO-ang TU-nai.",
          "`uang tunai` = cash; spell `ATM` letter by letter: A-TE-EM.",
          "VN-speaker note: `di dompet ada...` is natural for listing what was in the wallet.",
        ],
      },
      {
        en: "Saya perlu membuat laporan kehilangan.",
        vi: "Tôi cần làm giấy/báo cáo mất đồ.",
        pronunciation_focus: [
          "SA-ya per-LU mem-BU-at la-PO-ran ke-hi-LANG-an.",
          "`laporan kehilangan` = báo cáo mất đồ; thường cần khi mất KTP/kartu.",
          "L1 Việt: `kehilangan` là danh từ/trạng thái bị mất, trang trọng hơn `hilang` trong giấy tờ.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU mem-BU-at la-PO-ran ke-hi-LANG-an.",
          "`laporan kehilangan` = loss report; often needed for lost ID/cards.",
          "VN-speaker note: `kehilangan` is the noun/state of loss, more formal than `hilang` in paperwork.",
        ],
      },
      {
        en: "Kapan terakhir Ibu membawa dompet itu?",
        vi: "Lần cuối cô/chị mang ví đó là khi nào?",
        pronunciation_focus: [
          "KA-pan ter-A-khir I-bu mem-BA-wa DOM-pet I-tu.",
          "`terakhir` = lần cuối; `membawa` = mang theo.",
          "L1 Việt: `Ibu` trong văn phòng/công an là cách gọi lịch sự cho phụ nữ trưởng thành.",
        ],
        pronunciation_focus_en: [
          "KA-pan ter-A-khir I-bu mem-BA-wa DOM-pet I-tu.",
          "`terakhir` = last; `membawa` = carry/bring.",
          "VN-speaker note: `Ibu` in an office/police setting is polite address for an adult woman.",
        ],
      },
      {
        en: "Tolong tulis nomor telepon saya di laporan.",
        vi: "Làm ơn ghi số điện thoại của tôi vào báo cáo.",
        pronunciation_focus: [
          "TO-long TU-lis NO-mor te-le-PON SA-ya di la-PO-ran.",
          "`nomor telepon` = số điện thoại; `di laporan` = trong báo cáo.",
          "L1 Việt: `tulis di laporan` = ghi vào báo cáo; dùng `di` cho vị trí trong giấy tờ.",
        ],
        pronunciation_focus_en: [
          "TO-long TU-lis NO-mor te-le-PON SA-ya di la-PO-ran.",
          "`nomor telepon` = phone number; `di laporan` = in the report.",
          "VN-speaker note: `tulis di laporan` = write in the report; use `di` for location inside paperwork.",
        ],
      },
    ],
    cultural_notes_vi:
      "Kalau dompet hilang di Indonesia, langkah aman adalah cek lokasi terakhir, hubungi pengemudi atau tempat yang dikunjungi, blokir kartu bank, lalu buat `laporan kehilangan` jika KTP, SIM, kartu bank, atau dokumen penting ikut hilang. Simpan nomor laporan, foto dokumen, dan bukti chat jika ada.",
    cultural_notes_en:
      "If a wallet is lost in Indonesia, safe steps are to check the last location, contact the driver or place visited, block bank cards, then file a `laporan kehilangan` if an ID, license, bank card, or important document was inside. Keep the report number, document photos, and chat evidence if any.",
    tip_advice_vi:
      "Mẫu cần thuộc: `Dompet saya hilang`, `Di dompet ada...`, `Saya perlu membuat laporan kehilangan`, `Kapan terakhir...?`. Người Việt nên phân biệt `hilang` (mất) và `kehilangan` (sự việc mất/bị mất trong văn bản).",
    tip_advice_en:
      "Chunks to memorize: `Dompet saya hilang`, `Di dompet ada...`, `Saya perlu membuat laporan kehilangan`, `Kapan terakhir...?`. Vietnamese speakers should distinguish `hilang` (lost) from formal `kehilangan` (loss/the state of losing).",
    vocabulary: [
      {
        word: "dompet hilang",
        en: "lost wallet",
        vi: "ví bị mất",
        pos: "noun phrase",
        pronunciation_vi: "DOM-pet HI-lang",
        pronunciation_en: "DOM-pet HEE-lang",
      },
      {
        word: "KTP",
        en: "Indonesian ID card",
        vi: "căn cước Indonesia",
        pos: "noun",
        pronunciation_vi: "ka-te-PE",
        pronunciation_en: "ka-te-PE",
      },
      {
        word: "uang tunai",
        en: "cash",
        vi: "tiền mặt",
        pos: "noun phrase",
        pronunciation_vi: "U-ang TU-nai",
        pronunciation_en: "OO-ang TOO-nai",
      },
      {
        word: "laporan kehilangan",
        en: "loss report",
        vi: "báo cáo/giấy xác nhận mất đồ",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran ke-hi-LANG-an",
        pronunciation_en: "la-PO-ran ke-hi-LANG-an",
      },
      {
        word: "terakhir",
        en: "last / most recent",
        vi: "lần cuối / gần nhất",
        pos: "adverb / adjective",
        pronunciation_vi: "ter-A-khir",
        pronunciation_en: "ter-A-khir",
      },
      {
        word: "nomor laporan",
        en: "report number",
        vi: "số báo cáo / mã vụ việc",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-PO-ran",
        pronunciation_en: "NO-mor la-PO-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Pelapor",
        text: "Permisi, Pak. Dompet saya hilang di dalam taksi online.",
        vi: "Xin lỗi anh/bác. Ví của tôi bị mất trong xe taxi công nghệ.",
        en: "Excuse me, Sir. My wallet was lost inside an online taxi.",
      },
      {
        speaker: "Petugas",
        text: "Di dompet ada dokumen apa saja?",
        vi: "Trong ví có những giấy tờ gì?",
        en: "What documents were inside the wallet?",
      },
      {
        speaker: "Pelapor",
        text: "Ada KTP, kartu ATM, dan uang tunai.",
        vi: "Có KTP, thẻ ATM và tiền mặt.",
        en: "There was an ID card, ATM card, and cash.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Kami buat laporan kehilangan dulu.",
        vi: "Được. Chúng tôi sẽ làm báo cáo mất đồ trước.",
        en: "Okay. We will make a loss report first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về mất ví:",
        instruction_en: "Fill in the suitable lost-wallet word:",
        items: [
          {
            prompt: "Dompet saya ___ di dalam taksi online. (mất)",
            answer: "hilang",
            options: ["hilang", "hujan", "hemat"],
          },
          {
            prompt: "Di dompet ada KTP, kartu ATM, dan uang ___. (tiền mặt)",
            answer: "tunai",
            options: ["tunai", "tutup", "tawar"],
          },
          {
            prompt: "Saya perlu membuat laporan ___. (mất đồ)",
            answer: "kehilangan",
            options: ["kehilangan", "kelurahan", "kesehatan"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Ví của tôi bị mất trong xe taxi công nghệ.", answer: "Dompet saya hilang di dalam taksi online." },
          { prompt: "Trong ví có KTP, thẻ ATM và tiền mặt.", answer: "Di dompet ada KTP, kartu ATM, dan uang tunai." },
          { prompt: "Tôi cần làm báo cáo mất đồ.", answer: "Saya perlu membuat laporan kehilangan." },
        ],
      },
    ],
  },
  {
    id: "indonesian_block_bank_card_customer_service",
    level: "B1",
    category: "money_emergency",
    title_vi: "Khóa kartu ATM và nói với customer service bank",
    title_en: "Blocking an ATM card and speaking with bank customer service",
    sentences: [
      {
        en: "Kartu ATM saya hilang, tolong segera diblokir.",
        vi: "Thẻ ATM của tôi bị mất, làm ơn khóa ngay.",
        pronunciation_focus: [
          "KAR-tu A-TE-EM SA-ya HI-lang, TO-long se-GE-ra di-blo-KIR.",
          "`blokir kartu` = khóa thẻ; dạng lịch sự ở quầy/call center là `tolong diblokir`.",
          "L1 Việt: với yêu cầu dịch vụ, bị động `diblokir` nghe tự nhiên hơn câu ra lệnh trực tiếp.",
        ],
        pronunciation_focus_en: [
          "KAR-tu A-TE-EM SA-ya HI-lang, TO-long se-GE-ra di-blo-KIR.",
          "`blokir kartu` = block/freeze a card; polite service phrasing is `tolong diblokir`.",
          "VN-speaker note: for service requests, passive `diblokir` sounds more natural than a direct command.",
        ],
      },
      {
        en: "Saya ingin bicara dengan customer service bank.",
        vi: "Tôi muốn nói chuyện với bộ phận chăm sóc khách hàng của ngân hàng.",
        pronunciation_focus: [
          "SA-ya I-ngin bi-CA-ra de-NGAN KAS-to-mer SER-vis bank.",
          "`customer service bank` = bộ phận hỗ trợ khách hàng ngân hàng; từ Anh-Indo rất phổ biến.",
          "L1 Việt: `ingin` trang trọng hơn `mau`, hợp khi nói với ngân hàng.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin bi-CHA-ra de-NGAN customer service bank.",
          "`customer service bank` = bank customer support; this English-Indonesian phrase is common.",
          "VN-speaker note: `ingin` is more formal than `mau`, suitable when speaking with a bank.",
        ],
      },
      {
        en: "Apakah ada transaksi terakhir setelah kartu hilang?",
        vi: "Có giao dịch gần nhất nào sau khi thẻ bị mất không?",
        pronunciation_focus: [
          "a-PA-kah A-da tran-SAK-si ter-A-khir se-TE-lah KAR-tu HI-lang.",
          "`transaksi terakhir` = giao dịch gần nhất/cuối cùng; `setelah` = sau khi.",
          "L1 Việt: `setelah kartu hilang` = sau khi thẻ bị mất, không dùng `di belakang` cho thời gian.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da tran-SAK-see ter-A-khir se-TE-lah KAR-tu HI-lang.",
          "`transaksi terakhir` = most recent/last transaction; `setelah` = after.",
          "VN-speaker trap: `setelah kartu hilang` = after the card was lost; do not use `di belakang` for time.",
        ],
      },
      {
        en: "KTP saya juga hilang, jadi saya perlu kartu pengganti.",
        vi: "KTP của tôi cũng bị mất, nên tôi cần thẻ thay thế.",
        pronunciation_focus: [
          "ka-te-PE SA-ya JU-ga HI-lang, JA-di SA-ya per-LU KAR-tu peng-GAN-ti.",
          "`kartu pengganti` = thẻ thay thế; `jadi` = nên/vì vậy.",
          "L1 Việt: `jadi` nối kết quả rất giống 'nên', đặt trước mệnh đề kết quả.",
        ],
        pronunciation_focus_en: [
          "ka-te-PE SA-ya JU-ga HI-lang, JA-di SA-ya per-LU KAR-tu peng-GAN-ti.",
          "`kartu pengganti` = replacement card; `jadi` = so/therefore.",
          "VN-speaker win: `jadi` connects a result like Vietnamese 'nên'; place it before the result clause.",
        ],
      },
      {
        en: "Mohon kirim nomor laporan ke email saya.",
        vi: "Xin gửi số báo cáo vào email của tôi.",
        pronunciation_focus: [
          "MO-hon KI-rim NO-mor la-PO-ran ke I-mel SA-ya.",
          "`mohon kirim` = xin gửi; `ke email` = đến email.",
          "L1 Việt: hướng gửi dùng `ke email`, không phải `di email`.",
        ],
        pronunciation_focus_en: [
          "MO-hon KI-rim NO-mor la-PO-ran ke E-mail SA-ya.",
          "`mohon kirim` = please send; `ke email` = to email.",
          "VN-speaker trap: sending direction uses `ke email`, not `di email`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Jika dompet atau kartu ATM hilang, segera hubungi customer service resmi bank, blokir kartu, dan cek transaksi terakhir. Jangan berikan PIN, OTP, CVV, password, atau kode verifikasi kepada siapa pun. Untuk kartu pengganti, bank biasanya meminta identitas, buku tabungan atau aplikasi, laporan kehilangan jika perlu, dan biaya penggantian kartu.",
    cultural_notes_en:
      "If a wallet or ATM card is lost, contact the bank's official customer service immediately, block the card, and check the latest transactions. Never give your PIN, OTP, CVV, password, or verification code to anyone. For a replacement card, the bank may ask for identity, passbook or app access, a loss report if needed, and a card replacement fee.",
    tip_advice_vi:
      "Mẫu ngân hàng cần thuộc: `tolong segera diblokir`, `customer service bank`, `transaksi terakhir`, `kartu pengganti`, `nomor laporan`. Người Việt nên nhớ `rekening` là tài khoản ngân hàng, còn `akun` thường dùng cho app/mạng xã hội.",
    tip_advice_en:
      "Banking chunks to memorize: `tolong segera diblokir`, `customer service bank`, `transaksi terakhir`, `kartu pengganti`, `nomor laporan`. Vietnamese speakers should remember `rekening` is a bank account, while `akun` is usually for apps/social media.",
    vocabulary: [
      {
        word: "kartu ATM",
        en: "ATM card",
        vi: "thẻ ATM",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu A-TE-EM",
        pronunciation_en: "KAR-tu A-TE-EM",
      },
      {
        word: "blokir kartu",
        en: "block a card",
        vi: "khóa thẻ",
        pos: "verb phrase",
        pronunciation_vi: "blo-KIR KAR-tu",
        pronunciation_en: "blo-KEER KAR-tu",
      },
      {
        word: "customer service bank",
        en: "bank customer service",
        vi: "chăm sóc khách hàng ngân hàng",
        pos: "noun phrase",
        pronunciation_vi: "KAS-to-mer SER-vis bank",
        pronunciation_en: "customer service bank",
      },
      {
        word: "transaksi terakhir",
        en: "latest transaction",
        vi: "giao dịch gần nhất",
        pos: "noun phrase",
        pronunciation_vi: "tran-SAK-si ter-A-khir",
        pronunciation_en: "tran-SAK-see ter-A-khir",
      },
      {
        word: "kartu pengganti",
        en: "replacement card",
        vi: "thẻ thay thế",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu peng-GAN-ti",
        pronunciation_en: "KAR-tu peng-GAN-tee",
      },
      {
        word: "kode verifikasi",
        en: "verification code",
        vi: "mã xác minh",
        pos: "noun phrase",
        pronunciation_vi: "KO-de ve-ri-fi-KA-si",
        pronunciation_en: "KO-de ve-ree-fee-KA-see",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Kartu ATM saya hilang, tolong segera diblokir.",
        vi: "Thẻ ATM của tôi bị mất, làm ơn khóa ngay.",
        en: "My ATM card is lost, please block it immediately.",
      },
      {
        speaker: "Customer Service",
        text: "Baik, Bu. Apakah KTP Ibu juga hilang?",
        vi: "Vâng, cô/chị. KTP của cô/chị cũng bị mất không?",
        en: "Okay, Ma'am. Was your ID card also lost?",
      },
      {
        speaker: "Nasabah",
        text: "Iya, KTP saya juga hilang bersama dompet.",
        vi: "Vâng, KTP của tôi cũng bị mất cùng ví.",
        en: "Yes, my ID card was also lost with the wallet.",
      },
      {
        speaker: "Customer Service",
        text: "Kami blokir kartu dulu, lalu Ibu bisa mengurus kartu pengganti.",
        vi: "Chúng tôi sẽ khóa thẻ trước, rồi cô/chị có thể làm thẻ thay thế.",
        en: "We will block the card first, then you can process a replacement card.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "blokir kartu", answer: "khóa thẻ" },
          { prompt: "customer service bank", answer: "chăm sóc khách hàng ngân hàng" },
          { prompt: "transaksi terakhir", answer: "giao dịch gần nhất" },
          { prompt: "kartu pengganti", answer: "thẻ thay thế" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Kartu ATM saya hilang, tolong segera ___. (khóa)",
            answer: "diblokir",
            options: ["diblokir", "dibayar", "dibuka"],
          },
          {
            prompt: "Apakah ada transaksi ___ setelah kartu hilang? (gần nhất)",
            answer: "terakhir",
            options: ["terakhir", "terbuka", "terlalu"],
          },
          {
            prompt: "Saya perlu kartu ___. (thay thế)",
            answer: "pengganti",
            options: ["pengganti", "penginapan", "pengurus"],
          },
        ],
      },
    ],
  },
];
