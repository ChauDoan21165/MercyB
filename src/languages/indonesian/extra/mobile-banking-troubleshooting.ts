// Mobile Banking Troubleshooting Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_mobile_banking_troubleshooting",
    level: "B1",
    category: "finance",
    title_vi: "Xử lý sự cố mobile banking",
    title_en: "Mobile banking troubleshooting",
    sentences: [
      {
        en: "Mobile banking saya tidak bisa login.",
        vi: "Mobile banking của tôi không thể đăng nhập.",
        pronunciation_focus: [
          "MO-bile BAN-king SA-ya TI-dak BI-sa LO-gin -- `tidak bisa login` = không thể đăng nhập.",
          "Lỗi người Việt: đọc `login` quá kiểu tiếng Anh. Trong thực tế ngân hàng vẫn hay dùng từ này, nhưng câu nói nên rõ ràng và ngắn.",
          "Luyện: `Saya tidak bisa login.`",
        ],
        pronunciation_focus_en: [
          "MO-bile BAN-king SA-ya TEE-dak BEE-sa LO-gin -- `tidak bisa login` = cannot log in.",
          "VN-speaker trap: over-pronouncing `login` with English stress. In practice banks still use this word, but keep the sentence clear and short.",
          "Drill: `Saya tidak bisa login.`",
        ],
      },
      {
        en: "OTP-nya belum masuk ke nomor saya.",
        vi: "Mã OTP vẫn chưa vào số của tôi.",
        pronunciation_focus: [
          "O-TI-PI-nya be-LUM MA-suk ke NO-mor SA-ya -- `OTP` sering diucap satu-satu: O-TI-PI; `belum masuk` = vẫn chưa nhận được.",
          "Mẹo: `ke nomor saya` = đến số của tôi; rất tự nhiên khi nói về SMS atau app verification.",
          "Luyện: `OTP-nya belum masuk.`",
        ],
        pronunciation_focus_en: [
          "O-TI-PI-nya be-LOOM MA-suk ke NO-mor SA-ya -- `OTP` is often spelled out: O-TI-PI; `belum masuk` = has not arrived yet.",
          "Tip: `ke nomor saya` = to my number; very natural when talking about SMS or app verification.",
          "Drill: `OTP-nya belum masuk.`",
        ],
      },
      {
        en: "Transfer saya tertunda, tapi saldo sudah terpotong.",
        vi: "Chuyển khoản của tôi bị trì hoãn, nhưng số dư đã bị trừ.",
        pronunciation_focus: [
          "tran-SFER SA-ya ter-TUN-da, TA-pi SAL-do SU-dah ter-PO-tong -- `tertunda` = bị trì hoãn; `terpotong` = bị trừ.",
          "`saldo sudah terpotong` sangat penting: uang sudah keluar dari rekening, tapi transfer belum sampai.",
          "Luyện: `Transfer saya tertunda.`",
        ],
        pronunciation_focus_en: [
          "TRAN-sfer SA-ya ter-TOON-da, TA-pi SAL-doh SOO-dah ter-PO-tong -- `tertunda` = delayed; `terpotong` = deducted.",
          "`Saldo sudah terpotong` is important: the money left the account, but the transfer has not arrived.",
          "Drill: `Transfer saya tertunda.`",
        ],
      },
      {
        en: "Saldo saya tidak muncul setelah transfer masuk.",
        vi: "Số dư của tôi không hiện ra sau khi tiền chuyển vào.",
        pronunciation_focus: [
          "SAL-do SA-ya TI-dak MUN-cul se-te-LAH tran-SFER MA-suk -- `saldo` = số dư; `muncul` = hiện ra.",
          "Lỗi người Việt: dùng `keluar` cho mọi thứ. Với aplikasi, `muncul` = hiển thị lên màn hình.",
          "Luyện: `Saldo saya tidak muncul.`",
        ],
        pronunciation_focus_en: [
          "SAL-doh SA-ya TEE-dak MOON-chool se-te-LAH TRAN-sfer MA-suk -- `saldo` = balance; `muncul` = appear/show up.",
          "VN-speaker trap: using `keluar` for everything. With apps, `muncul` = appears on screen.",
          "Drill: `Saldo saya tidak muncul.`",
        ],
      },
      {
        en: "Saya lupa PIN dan akun saya terblokir.",
        vi: "Tôi quên PIN và tài khoản của tôi bị khóa.",
        pronunciation_focus: [
          "SA-ya LU-pa PIN dan A-kun SA-ya ter-BLO-kir -- `lupa PIN` = quên mã PIN; `terblokir` = bị khóa.",
          "`terblokir` dùng rất biasa untuk akun bank atau kartu; artinya akses sedang ditahan.",
          "Luyện: `Saya lupa PIN.`",
        ],
        pronunciation_focus_en: [
          "SA-ya LOO-pa PIN dan A-koon SA-ya ter-BLO-kir -- `lupa PIN` = forgot the PIN; `terblokir` = blocked.",
          "`Terblokir` is common for bank accounts or cards; it means access is currently suspended.",
          "Drill: `Saya lupa PIN.`",
        ],
      },
      {
        en: "Bisa bantu blokir akun sementara?",
        vi: "Có thể giúp khóa tài khoản tạm thời không?",
        pronunciation_focus: [
          "BI-sa BAN-tu BLO-kir A-kun se-men-TA-ra -- `blokir akun` = khóa tài khoản; `sementara` = tạm thời.",
          "Mẹo: ketika ada masalah keamanan, `sementara` membuat permintaan terdengar lebih spesifik dan aman.",
          "Luyện: `Bisa bantu blokir akun?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa BAN-too BLO-kir A-koon se-men-TA-ra -- `blokir akun` = block the account; `sementara` = temporarily.",
          "Tip: when there is a security issue, `sementara` makes the request more specific and safe.",
          "Drill: `Bisa bantu blokir akun?`",
        ],
      },
      {
        en: "Mohon cek, saya sudah lupa PIN kartu dan tidak bisa masuk aplikasi.",
        vi: "Xin kiểm tra giúp, tôi đã quên PIN thẻ và không thể vào ứng dụng.",
        pronunciation_focus: [
          "MO-hon cek, SA-ya SU-dah LU-pa PIN KAR-tu dan TI-dak BI-sa MA-suk ap-li-KA-si -- `mohon cek` = xin kiểm tra giúp.",
          "Lỗi người Việt: dùng `tolong lihat` cho semua kasus. Di layanan bank, `mohon cek` cukup natural dan sopan.",
          "Luyện: `Mohon cek, saya lupa PIN.`",
        ],
        pronunciation_focus_en: [
          "MO-hon chek, SA-ya SOO-dah LOO-pa PIN KAR-too dan TEE-dak BEE-sa MA-suk ap-li-KA-see -- `mohon cek` = please check; `aplikasi` = app.",
          "VN-speaker trap: using `tolong lihat` for every case. In bank service, `mohon cek` is natural and polite.",
          "Drill: `Mohon cek, saya lupa PIN.`",
        ],
      },
      {
        en: "Kalau masih ada masalah, saya akan hubungi call center.",
        vi: "Nếu vẫn có vấn đề, tôi sẽ gọi tổng đài.",
        pronunciation_focus: [
          "KA-lau MA-sih A-da ma-SA-lah, SA-ya A-kan HU-bu-ngi call cen-ter -- `hubungi` = liên hệ/gọi.",
          "Mẹo: `call center` sering dipakai langsung, tapi `menghubungi call center` atau `hubungi call center` sama-sama wajar.",
          "Luyện: `Saya akan hubungi call center.`",
        ],
        pronunciation_focus_en: [
          "KA-lau MA-sih A-da ma-SA-lah, SA-ya A-kan HU-boo-ngi call cen-ter -- `hubungi` = contact/call.",
          "Tip: `call center` is often used directly, but `menghubungi call center` or `hubungi call center` are both natural.",
          "Drill: `Saya akan hubungi call center.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Layanan mobile banking di Indonesia thường xử lý rất nhiều kasus: login gagal, OTP belum masuk, transfer tertunda, saldo tidak muncul, lupa PIN, atau akun terblokir. Khi bicara với customer service, sebutkan kronologi singkat: kapan mulai masalah, apa yang sudah dicoba, dan apakah uang sudah terpotong. Jangan bagikan OTP, PIN, atau password kepada siapa pun, bahkan ketika sedang panik.",
    cultural_notes_en:
      "Indonesian mobile-banking services handle many common issues: login failure, OTP not arriving, delayed transfers, balance not showing, forgotten PIN, or a blocked account. When speaking with customer service, give a short chronology: when the problem started, what you already tried, and whether the money has been deducted. Never share your OTP, PIN, or password with anyone, even when panicking.",
    tip_advice_vi:
      "Mẹo cho người Việt: học cụm vấn đề ngân hàng theo mẫu `tidak bisa login`, `OTP belum masuk`, `saldo tidak muncul`, `transfer tertunda`, `lupa PIN`, `akun terblokir`. Với CS, nói ngắn, rõ, theo urutan: masalah -> bukti -> tindakan đã thử -> yêu cầu.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn bank-issue chunks like `tidak bisa login`, `OTP belum masuk`, `saldo tidak muncul`, `transfer tertunda`, `lupa PIN`, `akun terblokir`. With customer service, speak briefly and clearly in order: problem -> evidence -> what you tried -> your request.",
    vocabulary: [
      {
        word: "mobile banking",
        en: "mobile banking",
        vi: "ngân hàng trên điện thoại",
        pos: "noun phrase",
        pronunciation_vi: "MO-bile BAN-king",
        pronunciation_en: "MO-bile BAN-king",
      },
      {
        word: "login gagal",
        en: "failed login",
        vi: "đăng nhập thất bại",
        pos: "noun phrase",
        pronunciation_vi: "LO-gin GA-gal",
        pronunciation_en: "LO-gin GA-gal",
      },
      {
        word: "OTP",
        en: "one-time password / code",
        vi: "mã một lần",
        pos: "noun",
        pronunciation_vi: "O-TI-PI",
        pronunciation_en: "O-TI-PI",
      },
      {
        word: "transfer tertunda",
        en: "delayed transfer",
        vi: "chuyển khoản bị trì hoãn",
        pos: "noun phrase",
        pronunciation_vi: "tran-SFER ter-TUN-da",
        pronunciation_en: "TRAN-sfer ter-TOON-da",
      },
      {
        word: "saldo",
        en: "balance",
        vi: "số dư",
        pos: "noun",
        pronunciation_vi: "SAL-do",
        pronunciation_en: "SAL-doh",
      },
      {
        word: "PIN",
        en: "PIN",
        vi: "mã PIN",
        pos: "noun",
        pronunciation_vi: "PIN",
        pronunciation_en: "PIN",
      },
      {
        word: "terblokir",
        en: "blocked",
        vi: "bị khóa",
        pos: "adjective",
        pronunciation_vi: "ter-BLO-kir",
        pronunciation_en: "ter-BLO-kir",
      },
      {
        word: "call center",
        en: "call center",
        vi: "tổng đài",
        pos: "noun",
        pronunciation_vi: "call cen-ter",
        pronunciation_en: "call cen-ter",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Permisi, saya tidak bisa login mobile banking sejak pagi.",
        vi: "Xin phép, sáng nay tôi không thể đăng nhập mobile banking.",
        en: "Excuse me, I have not been able to log in to mobile banking since this morning.",
      },
      {
        speaker: "CS",
        text: "Baik, apakah OTP sudah masuk ke nomor terdaftar?",
        vi: "Được rồi, OTP đã vào số đã đăng ký chưa?",
        en: "Okay, has the OTP arrived at the registered number?",
      },
      {
        speaker: "Nasabah",
        text: "Belum. Transfer saya juga tertunda dan saldo tidak muncul.",
        vi: "Chưa. Chuyển khoản của tôi cũng bị trì hoãn và số dư không hiện ra.",
        en: "Not yet. My transfer is also delayed and the balance is not showing.",
      },
      {
        speaker: "CS",
        text: "Mohon tunggu, saya cek akun Anda dulu.",
        vi: "Xin chờ, tôi kiểm tra tài khoản của anh/chị trước.",
        en: "Please wait, I will check your account first.",
      },
      {
        speaker: "Nasabah",
        text: "Kalau perlu, saya juga mau blokir akun sementara.",
        vi: "Nếu cần, tôi cũng muốn khóa tài khoản tạm thời.",
        en: "If necessary, I would also like to temporarily block the account.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'OTP vẫn chưa vào số của tôi.'",
        prompt_en: "Translate into Indonesian: 'The OTP has not arrived at my number yet.'",
        answer: "OTP-nya belum masuk ke nomor saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya lupa ____ dan akun saya terblokir.`",
        prompt_en: "Fill in the blank: `Saya lupa ____ dan akun saya terblokir.`",
        answer: "PIN",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["saldo tidak muncul", "số dư không hiện ra"],
          ["transfer tertunda", "chuyển khoản bị trì hoãn"],
          ["call center", "tổng đài"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn gọi tổng đài ngân hàng. Báo rằng login gagal, OTP belum masuk, saldo tidak muncul, dan tanya apakah perlu blokir akun sementara.",
        prompt_en:
          "You call the bank's call center. Report that login failed, the OTP has not arrived, the balance is not showing, and ask whether the account should be temporarily blocked.",
      },
    ],
    content:
      "Use this lesson for Indonesian mobile-banking troubleshooting: failed login, missing OTP, delayed transfers, missing balance display, forgotten PIN, blocked accounts, and calling the bank's call center.",
  },
];
