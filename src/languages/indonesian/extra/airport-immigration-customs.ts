// Airport, immigration, and customs Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: airport Indonesian is polite, procedural, and document-heavy:
// `bandara`, `imigrasi`, `bea cukai`, `paspor`, `bagasi`, `barang bawaan`,
// `formulir kedatangan`, and `pemeriksaan`.

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
    id: "indonesian_airport_immigration_customs",
    level: "B1",
    category: "travel",
    title_vi: "Sân bay, nhập cảnh và hải quan",
    title_en: "Airport, immigration, and customs Indonesian",
    sentences: [
      {
        en: "Di mana loket imigrasi untuk paspor asing?",
        vi: "Quầy nhập cảnh cho hộ chiếu nước ngoài ở đâu?",
        pronunciation_focus: [
          "di MA-na LO-ket i-mi-GRA-si UN-tuk PAS-por A-sing - `loket imigrasi` = quầy nhập cảnh; `paspor asing` = hộ chiếu nước ngoài.",
          "Lỗi người Việt: nói `passport` trong câu Indonesia. Từ tự nhiên là `paspor`.",
          "Luyện: `Di mana loket imigrasi?`",
        ],
        pronunciation_focus_en: [
          "dee MA-na LO-ket ee-mee-GRA-see OON-took PAS-por A-sing - `loket imigrasi` = immigration counter; `paspor asing` = foreign passport.",
          "VN-speaker trap: saying English `passport` inside Indonesian. Natural Indonesian is `paspor`.",
          "Drill: `Di mana loket imigrasi?`",
        ],
      },
      {
        en: "Saya datang untuk liburan selama dua minggu.",
        vi: "Tôi đến để du lịch trong hai tuần.",
        pronunciation_focus: [
          "SA-ya DA-tang UN-tuk li-BU-ran se-LA-ma DU-a MING-gu - `liburan` = kỳ nghỉ/du lịch; `selama` = trong thời gian.",
          "Lỗi người Việt: bỏ `selama` trước thời lượng. Với câu nhập cảnh, nói rõ `selama dua minggu`.",
          "Luyện: `Saya datang untuk liburan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya DA-tang OON-took lee-BOO-ran se-LA-ma DOO-a MING-goo - `liburan` = vacation; `selama` = for a duration.",
          "VN-speaker trap: dropping `selama` before a duration. At immigration, make the duration explicit.",
          "Drill: `Saya datang untuk liburan.`",
        ],
      },
      {
        en: "Alamat hotel saya ada di formulir kedatangan.",
        vi: "Địa chỉ khách sạn của tôi có trong tờ khai nhập cảnh.",
        pronunciation_focus: [
          "A-la-mat ho-TEL SA-ya A-da di for-mu-LIR ke-da-TA-ngan - `formulir kedatangan` = tờ khai nhập cảnh/arrival form.",
          "Lỗi người Việt: `formulir` là biểu mẫu; đừng dùng `formula` vì nghe như công thức.",
          "Luyện: `Alamat ada di formulir.`",
        ],
        pronunciation_focus_en: [
          "A-la-mat ho-TEL SA-ya A-da dee for-moo-LEER ke-da-TA-ngan - `formulir kedatangan` = arrival form.",
          "VN-speaker trap: `formulir` means form; avoid `formula`, which sounds like a formula.",
          "Drill: `Alamat ada di formulir.`",
        ],
      },
      {
        en: "Bagasi saya belum keluar di konveyor.",
        vi: "Hành lý ký gửi của tôi chưa ra ở băng chuyền.",
        pronunciation_focus: [
          "ba-GA-si SA-ya be-LUM KE-lu-ar di kon-VE-yor - `bagasi` = hành lý ký gửi; `konveyor` = băng chuyền.",
          "Lỗi người Việt: dùng `koper` cho mọi hành lý. `Koper` là vali; `bagasi` là hành lý trong ngữ cảnh sân bay.",
          "Luyện: `Bagasi saya belum keluar.`",
        ],
        pronunciation_focus_en: [
          "ba-GA-see SA-ya be-LOOM KE-loo-ar dee kon-VE-yor - `bagasi` = checked baggage; `konveyor` = conveyor belt.",
          "VN-speaker trap: using `koper` for all luggage. `Koper` is a suitcase; airport luggage is often `bagasi`.",
          "Drill: `Bagasi saya belum keluar.`",
        ],
      },
      {
        en: "Saya hanya membawa barang bawaan pribadi.",
        vi: "Tôi chỉ mang đồ cá nhân.",
        pronunciation_focus: [
          "SA-ya HA-nya mem-BA-wa BA-rang ba-WA-an pri-BA-di - `barang bawaan` = đồ mang theo; `pribadi` = cá nhân.",
          "Lỗi người Việt: nói `barang tangan` để dịch carry-on nghe không tự nhiên. Dùng `barang bawaan`.",
          "Luyện: `Barang bawaan pribadi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-nya mem-BA-wa BA-rang ba-WA-an pree-BA-dee - `barang bawaan` = carried items; `pribadi` = personal.",
          "VN-speaker trap: translating carry-on as `barang tangan` sounds unnatural. Use `barang bawaan`.",
          "Drill: `Barang bawaan pribadi.`",
        ],
      },
      {
        en: "Apakah saya perlu melewati bea cukai?",
        vi: "Tôi có cần đi qua hải quan không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya PER-lu me-le-WA-ti BE-a CU-kai - `bea cukai` = hải quan; `melewati` = đi qua.",
          "Lỗi người Việt: `cukai` một mình là thuế/thuế tiêu thụ; hải quan là cụm `bea cukai`.",
          "Luyện: `Melewati bea cukai.`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya PER-loo me-le-WA-tee BEH-a CHOO-kai - `bea cukai` = customs; `melewati` = pass through.",
          "VN-speaker trap: `cukai` alone means excise/tax; customs is the phrase `bea cukai`.",
          "Drill: `Melewati bea cukai.`",
        ],
      },
      {
        en: "Saya tidak membawa barang yang harus dideklarasikan.",
        vi: "Tôi không mang hàng hóa phải khai báo.",
        pronunciation_focus: [
          "SA-ya ti-DAK mem-BA-wa BA-rang yang HA-rus di-de-kla-ra-SI-kan - `dideklarasikan` = được khai báo.",
          "Lỗi người Việt: dùng `lapor` được trong nói thường, nhưng ở hải quan cụm chính xác là `dideklarasikan`.",
          "Luyện: `Barang yang harus dideklarasikan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya tee-DAK mem-BA-wa BA-rang yang HA-roos dee-deh-kla-ra-SEE-kan - `dideklarasikan` = declared.",
          "VN-speaker note: `lapor` can work in casual speech, but customs language commonly uses `dideklarasikan`.",
          "Drill: `Barang yang harus dideklarasikan.`",
        ],
      },
      {
        en: "Petugas meminta saya membuka koper untuk pemeriksaan.",
        vi: "Nhân viên yêu cầu tôi mở vali để kiểm tra.",
        pronunciation_focus: [
          "pe-TU-gas me-MIN-ta SA-ya mem-BU-ka KO-per UN-tuk pe-me-RIK-sa-an - `petugas` = nhân viên/cán bộ; `pemeriksaan` = kiểm tra.",
          "Lỗi người Việt: `periksa` là động từ gốc; danh từ thủ tục là `pemeriksaan`.",
          "Luyện: `Untuk pemeriksaan.`",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas me-MIN-ta SA-ya mem-BOO-ka KO-per OON-took peh-me-RIK-sa-an - `petugas` = officer/staff; `pemeriksaan` = inspection.",
          "VN-speaker trap: `periksa` is the root verb; the procedure noun is `pemeriksaan`.",
          "Drill: `Untuk pemeriksaan.`",
        ],
      },
      {
        en: "Apakah cairan ini boleh dibawa ke kabin?",
        vi: "Chất lỏng này có được mang vào khoang cabin không?",
        pronunciation_focus: [
          "a-PA-kah CAI-ran I-ni BO-leh di-BA-wa ke KA-bin - `cairan` = chất lỏng; `kabin` = khoang cabin.",
          "Lỗi người Việt: hỏi `bisa bawa` nghe ổn, nhưng với quy định sân bay `boleh dibawa` rõ hơn về được phép.",
          "Luyện: `Boleh dibawa ke kabin?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah CHAI-ran EE-nee BO-leh dee-BA-wa keh KA-bin - `cairan` = liquid; `kabin` = cabin.",
          "VN-speaker note: `bisa bawa` is understood, but airport rules sound clearer with `boleh dibawa`.",
          "Drill: `Boleh dibawa ke kabin?`",
        ],
      },
      {
        en: "Saya perlu mengambil bagasi transit dulu.",
        vi: "Tôi cần lấy hành lý quá cảnh trước.",
        pronunciation_focus: [
          "SA-ya PER-lu me-NGAM-bil ba-GA-si TRAN-sit DU-lu - `mengambil bagasi` = lấy hành lý; `transit` = quá cảnh.",
          "Lỗi người Việt: `ambil` là dạng thân mật; trong câu đầy đủ với `saya perlu`, dùng `mengambil` nghe gọn và chuẩn hơn.",
          "Luyện: `Mengambil bagasi dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo meh-NGAM-bil ba-GA-see TRAN-sit DOO-loo - `mengambil bagasi` = collect baggage; `transit` = transit.",
          "VN-speaker note: `ambil` is casual; after `saya perlu`, `mengambil` sounds fuller and more standard.",
          "Drill: `Mengambil bagasi dulu.`",
        ],
      },
      {
        en: "Paspor saya sudah dicap oleh petugas imigrasi.",
        vi: "Hộ chiếu của tôi đã được nhân viên nhập cảnh đóng dấu.",
        pronunciation_focus: [
          "PAS-por SA-ya SU-dah di-CAP O-leh pe-TU-gas i-mi-GRA-si - `dicap` = được đóng dấu; `oleh` = bởi.",
          "Lỗi người Việt: nói `stempel` là con dấu, nhưng hành động đóng dấu trong câu này là `dicap`.",
          "Luyện: `Paspor sudah dicap.`",
        ],
        pronunciation_focus_en: [
          "PAS-por SA-ya SOO-dah dee-CHAP O-leh peh-TOO-gas ee-mee-GRA-see - `dicap` = stamped; `oleh` = by.",
          "VN-speaker trap: `stempel` is a stamp/seal, but the action here is `dicap`.",
          "Drill: `Paspor sudah dicap.`",
        ],
      },
      {
        en: "Ke mana saya harus pergi setelah pemeriksaan bea cukai?",
        vi: "Tôi phải đi đâu sau khi kiểm tra hải quan?",
        pronunciation_focus: [
          "ke MA-na SA-ya HA-rus per-GI se-TE-lah pe-me-RIK-sa-an BE-a CU-kai - `setelah` = sau khi; `harus pergi` = phải đi.",
          "Lỗi người Việt: trong sân bay, hỏi hướng bằng `ke mana` rõ hơn chỉ nói `di mana`.",
          "Luyện: `Ke mana setelah bea cukai?`",
        ],
        pronunciation_focus_en: [
          "keh MA-na SA-ya HA-roos per-GEE se-TE-lah peh-me-RIK-sa-an BEH-a CHOO-kai - `setelah` = after; `harus pergi` = must go.",
          "VN-speaker trap: at the airport, ask directions with `ke mana`, not only location with `di mana`.",
          "Drill: `Ke mana setelah bea cukai?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở sân bay Indonesia, các bước thường gồm imigrasi, lấy bagasi, rồi bea cukai. Câu trả lời nên ngắn, rõ mục đích chuyến đi, thời gian ở lại, địa chỉ lưu trú và đồ mang theo. Bài này giúp luyện ngôn ngữ du lịch, không thay thế quy định nhập cảnh/hải quan hiện hành.",
    cultural_notes_en:
      "At Indonesian airports, the usual flow is immigration, baggage claim, then customs. Answers should be brief and clear about trip purpose, length of stay, accommodation address, and carried items. This lesson teaches travel language and does not replace current immigration or customs rules.",
    tip_advice_vi:
      "Khi nói với petugas, dùng câu lịch sự ngắn: `Saya datang untuk liburan`, `Alamat hotel ada di formulir`, `Saya tidak membawa barang yang harus dideklarasikan`. Nếu chưa hiểu, nói `Maaf, bisa diulang pelan-pelan?`",
    tip_advice_en:
      "When speaking with officers, use short polite sentences: `Saya datang untuk liburan`, `Alamat hotel ada di formulir`, `Saya tidak membawa barang yang harus dideklarasikan`. If you do not understand, say `Maaf, bisa diulang pelan-pelan?`",
    vocabulary: [
      {
        word: "bandara",
        en: "airport",
        vi: "sân bay",
        pos: "noun",
        pronunciation_vi: "ban-DA-ra",
        pronunciation_en: "ban-DA-ra",
      },
      {
        word: "imigrasi",
        en: "immigration",
        vi: "nhập cảnh/di trú",
        pos: "noun",
        pronunciation_vi: "i-mi-GRA-si",
        pronunciation_en: "ee-mee-GRA-see",
      },
      {
        word: "bea cukai",
        en: "customs",
        vi: "hải quan",
        pos: "noun phrase",
        pronunciation_vi: "BE-a CU-kai",
        pronunciation_en: "BEH-a CHOO-kai",
      },
      {
        word: "paspor",
        en: "passport",
        vi: "hộ chiếu",
        pos: "noun",
        pronunciation_vi: "PAS-por",
        pronunciation_en: "PAS-por",
      },
      {
        word: "bagasi",
        en: "baggage",
        vi: "hành lý ký gửi",
        pos: "noun",
        pronunciation_vi: "ba-GA-si",
        pronunciation_en: "ba-GA-see",
      },
      {
        word: "barang bawaan",
        en: "carried items; belongings",
        vi: "đồ mang theo",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang ba-WA-an",
        pronunciation_en: "BA-rang ba-WA-an",
      },
      {
        word: "formulir kedatangan",
        en: "arrival form",
        vi: "tờ khai nhập cảnh",
        pos: "noun phrase",
        pronunciation_vi: "for-mu-LIR ke-da-TA-ngan",
        pronunciation_en: "for-moo-LEER ke-da-TA-ngan",
      },
      {
        word: "pemeriksaan",
        en: "inspection; check",
        vi: "kiểm tra",
        pos: "noun",
        pronunciation_vi: "pe-me-RIK-sa-an",
        pronunciation_en: "peh-me-RIK-sa-an",
      },
      {
        word: "petugas",
        en: "officer; staff member",
        vi: "nhân viên/cán bộ",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
      {
        word: "dideklarasikan",
        en: "declared",
        vi: "được khai báo",
        pos: "verb",
        pronunciation_vi: "di-de-kla-ra-SI-kan",
        pronunciation_en: "dee-deh-kla-ra-SEE-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Petugas Imigrasi",
        text: "Selamat datang. Tujuan Anda ke Indonesia untuk apa?",
        vi: "Chào mừng. Mục đích của anh/chị đến Indonesia là gì?",
        en: "Welcome. What is your purpose for coming to Indonesia?",
      },
      {
        speaker: "Penumpang",
        text: "Saya datang untuk liburan selama dua minggu. Alamat hotel ada di formulir kedatangan.",
        vi: "Tôi đến du lịch trong hai tuần. Địa chỉ khách sạn có trong tờ khai nhập cảnh.",
        en: "I am here for vacation for two weeks. The hotel address is on the arrival form.",
      },
      {
        speaker: "Petugas Bea Cukai",
        text: "Apakah ada barang yang harus dideklarasikan?",
        vi: "Có hàng hóa nào phải khai báo không?",
        en: "Do you have any items that must be declared?",
      },
      {
        speaker: "Penumpang",
        text: "Tidak ada. Saya hanya membawa barang bawaan pribadi.",
        vi: "Không có. Tôi chỉ mang đồ cá nhân.",
        en: "No. I only have personal belongings.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi đến để du lịch trong hai tuần.”",
        prompt_en: "Translate into Indonesian: “I am here for vacation for two weeks.”",
        answer: "Saya datang untuk liburan selama dua minggu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Apakah saya perlu melewati ____ cukai?",
        prompt_en: "Fill in the blank: Apakah saya perlu melewati ____ cukai?",
        answer: "bea",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “tờ khai nhập cảnh”?",
        prompt_en: "Which phrase means “arrival form”?",
        choices: ["formulir kedatangan", "bagasi transit", "loket imigrasi"],
        answer: "formulir kedatangan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `pemeriksaan` = ?",
        prompt_en: "Match the meaning: `pemeriksaan` = ?",
        answer: "inspection; check",
      },
    ],
  },
];

export default lessons;
