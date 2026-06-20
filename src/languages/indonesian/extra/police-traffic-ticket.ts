// Police traffic ticket Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: traffic-stop Indonesian should stay calm, formal, and document-focused:
// `tilang`, `surat kendaraan`, `SIM`, `STNK`, `pelanggaran lalu lintas`,
// `denda`, `sidang tilang`, and `etika bicara dengan polisi`.

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
    id: "indonesian_police_traffic_ticket",
    level: "B1",
    category: "legal",
    title_vi: "Bị cảnh sát giao thông phạt: SIM, STNK và tilang",
    title_en: "Police traffic tickets: SIM, STNK, and tilang",
    sentences: [
      {
        en: "Selamat siang, Pak. Ada apa, ya?",
        vi: "Chào anh. Có chuyện gì vậy ạ?",
        pronunciation_focus: [
          "se-la-MAT SI-ang, Pak. A-da A-pa, ya - `Pak` = cách gọi lịch sự với nam cảnh sát; `ada apa` = có chuyện gì.",
          "Lỗi người Việt: nói trống không với cảnh sát nghe cộc. Thêm `Pak` hoặc `Bu` giúp giữ giọng lịch sự.",
          "Luyện: `Selamat siang, Pak.`",
        ],
        pronunciation_focus_en: [
          "seh-la-MAT SEE-ang, Pak. A-da A-pa, ya - `Pak` = polite address for a male officer; `ada apa` = what is the matter.",
          "VN-speaker trap: addressing police without a title sounds blunt. Add `Pak` or `Bu` to stay polite.",
          "Drill: `Selamat siang, Pak.`",
        ],
      },
      {
        en: "Ini SIM dan STNK saya, Pak.",
        vi: "Đây là bằng lái và giấy đăng ký xe của tôi, thưa anh.",
        pronunciation_focus: [
          "I-ni SIM dan es-te-en-KA SA-ya, Pak - `SIM` = bằng lái; `STNK` = giấy đăng ký xe.",
          "Lỗi người Việt: đọc `STNK` thành một từ. Tiếng Indonesia đánh vần từng chữ: `es-te-en-ka`.",
          "Luyện: `Ini SIM dan STNK saya.`",
        ],
        pronunciation_focus_en: [
          "EE-nee SIM dan es-te-en-KA SA-ya, Pak - `SIM` = driver's license; `STNK` = vehicle registration.",
          "VN-speaker trap: reading `STNK` as one word. Indonesian spells the letters: `es-te-en-ka`.",
          "Drill: `Ini SIM dan STNK saya.`",
        ],
      },
      {
        en: "Apakah surat kendaraan saya lengkap?",
        vi: "Giấy tờ xe của tôi đầy đủ không?",
        pronunciation_focus: [
          "a-PA-kah SU-rat ken-da-RA-an SA-ya LENG-kap - `surat kendaraan` = giấy tờ xe; `lengkap` = đầy đủ.",
          "Lỗi người Việt: nói `kertas motor` nghe không tự nhiên. Dùng cụm chính xác `surat kendaraan`.",
          "Luyện: `Surat kendaraan lengkap?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SOO-rat ken-da-RA-an SA-ya LENG-kap - `surat kendaraan` = vehicle documents; `lengkap` = complete.",
          "VN-speaker trap: saying `kertas motor` sounds unnatural. Use the precise phrase `surat kendaraan`.",
          "Drill: `Surat kendaraan lengkap?`",
        ],
      },
      {
        en: "Saya kena tilang karena pelanggaran apa?",
        vi: "Tôi bị phạt vì vi phạm gì?",
        pronunciation_focus: [
          "SA-ya KE-na TI-lang ka-RE-na pe-lang-GA-ran A-pa - `kena tilang` = bị phạt giao thông; `pelanggaran` = vi phạm.",
          "Lỗi người Việt: nói `saya tilang`. Người bị phạt nói `kena tilang` hoặc `ditilang`.",
          "Luyện: `Saya kena tilang karena apa?`",
        ],
        pronunciation_focus_en: [
          "SA-ya KEH-na TEE-lang ka-REH-na peh-lang-GA-ran A-pa - `kena tilang` = receive a traffic ticket; `pelanggaran` = violation.",
          "VN-speaker trap: saying `saya tilang`. The person ticketed says `kena tilang` or `ditilang`.",
          "Drill: `Saya kena tilang karena apa?`",
        ],
      },
      {
        en: "Pelanggaran lalu lintasnya bisa dijelaskan, Pak?",
        vi: "Anh có thể giải thích lỗi vi phạm giao thông không?",
        pronunciation_focus: [
          "pe-lang-GA-ran LA-lu LIN-tas-nya BI-sa di-JE-las-kan, Pak - `pelanggaran lalu lintas` = vi phạm giao thông.",
          "Lỗi người Việt: phản ứng `saya tidak salah` ngay dễ căng. Hỏi `bisa dijelaskan` trước để hiểu lý do.",
          "Luyện: `Bisa dijelaskan, Pak?`",
        ],
        pronunciation_focus_en: [
          "peh-lang-GA-ran LA-loo LIN-tas-nya BEE-sa dee-JEH-las-kan, Pak - `pelanggaran lalu lintas` = traffic violation.",
          "VN-speaker trap: immediately saying `saya tidak salah` can escalate. Ask `bisa dijelaskan` first.",
          "Drill: `Bisa dijelaskan, Pak?`",
        ],
      },
      {
        en: "Saya minta surat tilang yang resmi.",
        vi: "Tôi xin biên bản phạt chính thức.",
        pronunciation_focus: [
          "SA-ya MIN-ta SU-rat TI-lang yang re-SMI - `surat tilang` = biên bản phạt; `resmi` = chính thức.",
          "Lỗi người Việt: ngại xin giấy tờ. Nói lịch sự `minta surat tilang resmi` là cách rõ ràng và đúng quy trình.",
          "Luyện: `Surat tilang yang resmi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MIN-ta SOO-rat TEE-lang yang res-MEE - `surat tilang` = official ticket notice; `resmi` = official.",
          "VN-speaker note: do not be afraid to ask for the document. `Minta surat tilang resmi` is clear and procedural.",
          "Drill: `Surat tilang yang resmi.`",
        ],
      },
      {
        en: "Berapa denda yang harus saya bayar?",
        vi: "Tiền phạt tôi phải trả là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa DEN-da yang HA-rus SA-ya BA-yar - `denda` = tiền phạt; `berapa` = bao nhiêu.",
          "Lỗi người Việt: hỏi tiền bằng `apa`. Giá, phí, tiền phạt đều hỏi bằng `berapa`.",
          "Luyện: `Berapa dendanya?`",
        ],
        pronunciation_focus_en: [
          "beh-RA-pa DEN-da yang HA-roos SA-ya BA-yar - `denda` = fine; `berapa` = how much.",
          "VN-speaker trap: asking amounts with `apa`. Prices, fees, and fines use `berapa`.",
          "Drill: `Berapa dendanya?`",
        ],
      },
      {
        en: "Apakah dendanya dibayar lewat bank atau aplikasi resmi?",
        vi: "Tiền phạt được trả qua ngân hàng hay ứng dụng chính thức?",
        pronunciation_focus: [
          "a-PA-kah DEN-da-nya di-BA-yar LE-wat bank A-tau ap-li-KA-si re-SMI - `dibayar lewat` = được trả qua; `aplikasi resmi` = ứng dụng chính thức.",
          "Lỗi người Việt: nói `bayar di aplikasi` không sai, nhưng với kênh thanh toán dùng `lewat` rất tự nhiên.",
          "Luyện: `Dibayar lewat bank?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah DEN-da-nya dee-BA-yar LEH-wat bank A-tau ap-lee-KA-see res-MEE - `dibayar lewat` = paid through; `aplikasi resmi` = official app.",
          "VN-speaker note: `bayar di aplikasi` is understood, but for payment channels `lewat` is natural.",
          "Drill: `Dibayar lewat bank?`",
        ],
      },
      {
        en: "Kapan jadwal sidang tilang saya?",
        vi: "Lịch phiên xử/giải quyết phạt giao thông của tôi là khi nào?",
        pronunciation_focus: [
          "KA-pan JAD-wal SI-dang TI-lang SA-ya - `sidang tilang` = phiên xử/giải quyết phạt giao thông; `jadwal` = lịch.",
          "Lỗi người Việt: `sidang` không chỉ vụ án lớn; trong tilang có thể có `sidang tilang`.",
          "Luyện: `Jadwal sidang tilang kapan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan JAD-wal SEE-dang TEE-lang SA-ya - `sidang tilang` = traffic ticket hearing; `jadwal` = schedule.",
          "VN-speaker note: `sidang` is not only for major cases; traffic tickets may involve `sidang tilang`.",
          "Drill: `Jadwal sidang tilang kapan?`",
        ],
      },
      {
        en: "Saya ingin bicara dengan sopan dan mengikuti prosedur.",
        vi: "Tôi muốn nói chuyện lịch sự và làm theo quy trình.",
        pronunciation_focus: [
          "SA-ya I-ngin bi-CA-ra de-NGAN SO-pan dan meng-I-ku-ti pro-se-DUR - `bicara dengan sopan` = nói lịch sự; `mengikuti prosedur` = theo quy trình.",
          "Lỗi người Việt: khi căng thẳng dễ dùng giọng cộc. Câu này báo hiệu bạn muốn hợp tác.",
          "Luyện: `Mengikuti prosedur.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin bee-CHA-ra deh-NGAN SO-pan dan meng-EE-koo-tee pro-seh-DOOR - `bicara dengan sopan` = speak politely; `mengikuti prosedur` = follow procedure.",
          "VN-speaker note: under stress, blunt tone is easy. This sentence signals cooperation.",
          "Drill: `Mengikuti prosedur.`",
        ],
      },
      {
        en: "Boleh saya mencatat nama petugas dan nomor surat tilang?",
        vi: "Tôi có thể ghi tên cán bộ và số biên bản phạt không?",
        pronunciation_focus: [
          "BO-leh SA-ya men-CA-tat NA-ma pe-TU-gas dan NO-mor SU-rat TI-lang - `mencatat` = ghi lại; `petugas` = cán bộ/nhân viên.",
          "Lỗi người Việt: `menulis` chung chung; khi ghi thông tin làm hồ sơ, `mencatat` tự nhiên hơn.",
          "Luyện: `Mencatat nomor surat tilang.`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya men-CHA-tat NA-ma peh-TOO-gas dan NO-mor SOO-rat TEE-lang - `mencatat` = record/write down; `petugas` = officer/staff.",
          "VN-speaker note: `menulis` is broad; for recording information for records, `mencatat` is more natural.",
          "Drill: `Mencatat nomor surat tilang.`",
        ],
      },
      {
        en: "Saya belum mengerti aturan ini, mohon dijelaskan pelan-pelan.",
        vi: "Tôi chưa hiểu quy định này, xin giải thích chậm giúp tôi.",
        pronunciation_focus: [
          "SA-ya be-LUM meng-ER-ti a-TU-ran I-ni, MO-hon di-JE-las-kan pe-LAN-pe-LAN - `mohon` = xin/vui lòng; `pelan-pelan` = chậm rãi.",
          "Lỗi người Việt: nói `saya tidak tahu` có thể nghe phòng thủ. `Belum mengerti` mềm hơn.",
          "Luyện: `Mohon dijelaskan pelan-pelan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya beh-LOOM meng-ER-tee a-TOO-ran EE-nee, MO-hon dee-JEH-las-kan peh-LAN-peh-LAN - `mohon` = please; `pelan-pelan` = slowly.",
          "VN-speaker trap: `saya tidak tahu` can sound defensive. `Belum mengerti` is softer.",
          "Drill: `Mohon dijelaskan pelan-pelan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi bị dừng xe ở Indonesia, nên giữ giọng bình tĩnh, gọi cảnh sát là `Pak`/`Bu`, chuẩn bị `SIM` và `STNK`, hỏi rõ `pelanggaran lalu lintas`, và yêu cầu `surat tilang resmi` nếu bị phạt. Tránh tranh cãi ngoài đường; hỏi về kênh thanh toán resmi, jadwal sidang tilang, và simpan semua bukti. Bài này dạy ngôn ngữ giao tiếp, không phải tư vấn pháp lý.",
    cultural_notes_en:
      "During a traffic stop in Indonesia, stay calm, address the officer as `Pak`/`Bu`, prepare your `SIM` and `STNK`, ask clearly about the traffic violation, and request an official ticket notice if ticketed. Avoid roadside arguments; ask about official payment channels, the traffic hearing schedule, and keep all evidence. This lesson teaches communication language, not legal advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng `kena tilang` hoặc `ditilang` khi bạn bị phạt; `menilang` là hành động của cảnh sát. Khi chưa hiểu, nói `mohon dijelaskan pelan-pelan` thay vì phản ứng gắt.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use `kena tilang` or `ditilang` when you receive a ticket; `menilang` is what the officer does. If you do not understand, say `mohon dijelaskan pelan-pelan` instead of reacting sharply.",
    vocabulary: [
      {
        word: "tilang",
        en: "traffic ticket",
        vi: "biên bản/phạt giao thông",
        pos: "noun / verb",
        pronunciation_vi: "TI-lang",
        pronunciation_en: "TEE-lang",
      },
      {
        word: "surat kendaraan",
        en: "vehicle documents",
        vi: "giấy tờ xe",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ken-da-RA-an",
        pronunciation_en: "SOO-rat ken-da-RA-an",
      },
      {
        word: "SIM",
        en: "driver's license",
        vi: "bằng lái",
        pos: "noun",
        pronunciation_vi: "sim",
        pronunciation_en: "sim",
      },
      {
        word: "STNK",
        en: "vehicle registration",
        vi: "giấy đăng ký xe",
        pos: "noun",
        pronunciation_vi: "es-te-en-KA",
        pronunciation_en: "es-teh-en-KA",
      },
      {
        word: "pelanggaran lalu lintas",
        en: "traffic violation",
        vi: "vi phạm giao thông",
        pos: "noun phrase",
        pronunciation_vi: "pe-lang-GA-ran LA-lu LIN-tas",
        pronunciation_en: "peh-lang-GA-ran LA-loo LIN-tas",
      },
      {
        word: "denda",
        en: "fine",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da",
        pronunciation_en: "DEN-da",
      },
      {
        word: "sidang tilang",
        en: "traffic ticket hearing",
        vi: "phiên xử/giải quyết phạt giao thông",
        pos: "noun phrase",
        pronunciation_vi: "SI-dang TI-lang",
        pronunciation_en: "SEE-dang TEE-lang",
      },
      {
        word: "petugas",
        en: "officer; staff member",
        vi: "cán bộ/nhân viên",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
      {
        word: "resmi",
        en: "official",
        vi: "chính thức",
        pos: "adjective",
        pronunciation_vi: "re-SMI",
        pronunciation_en: "res-MEE",
      },
      {
        word: "mengikuti prosedur",
        en: "follow procedure",
        vi: "làm theo quy trình",
        pos: "verb phrase",
        pronunciation_vi: "meng-I-ku-ti pro-se-DUR",
        pronunciation_en: "meng-EE-koo-tee pro-seh-DOOR",
      },
    ],
    dialogue: [
      {
        speaker: "Pengendara",
        text: "Selamat siang, Pak. Ada apa, ya?",
        vi: "Chào anh. Có chuyện gì vậy ạ?",
        en: "Good afternoon, officer. What is the matter?",
      },
      {
        speaker: "Polisi",
        text: "Bapak melakukan pelanggaran lalu lintas. Tolong tunjukkan SIM dan STNK.",
        vi: "Anh đã vi phạm giao thông. Vui lòng cho xem bằng lái và giấy đăng ký xe.",
        en: "You committed a traffic violation. Please show your license and vehicle registration.",
      },
      {
        speaker: "Pengendara",
        text: "Ini SIM dan STNK saya. Pelanggarannya bisa dijelaskan, Pak?",
        vi: "Đây là bằng lái và giấy đăng ký xe của tôi. Anh có thể giải thích lỗi vi phạm không?",
        en: "Here are my license and registration. Could you explain the violation, officer?",
      },
      {
        speaker: "Polisi",
        text: "Nanti tertulis di surat tilang. Dendanya dibayar lewat kanal resmi.",
        vi: "Lát nữa sẽ ghi trong biên bản phạt. Tiền phạt trả qua kênh chính thức.",
        en: "It will be written on the ticket notice. The fine is paid through official channels.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Đây là SIM và STNK của tôi.”",
        prompt_en: "Translate into Indonesian: “Here are my SIM and STNK.”",
        answer: "Ini SIM dan STNK saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Saya kena ____ karena pelanggaran lalu lintas.",
        prompt_en: "Fill in the blank: Saya kena ____ karena pelanggaran lalu lintas.",
        answer: "tilang",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “tiền phạt”?",
        prompt_en: "Which word means “fine”?",
        choices: ["denda", "saksi", "lampiran"],
        answer: "denda",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `sidang tilang` = ?",
        prompt_en: "Match the meaning: `sidang tilang` = ?",
        answer: "traffic ticket hearing",
      },
    ],
  },
];

export default lessons;
