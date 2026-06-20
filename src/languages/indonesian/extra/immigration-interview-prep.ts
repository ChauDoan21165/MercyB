// Immigration Interview Prep Indonesian (Vietnamese -> Indonesian study track).
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

export const immigrationInterviewPrepLessons: IndonesianLesson[] = [
  {
    id: "indonesian_immigration_interview_basic_answers",
    level: "B1",
    category: "life_admin",
    title_vi: "Chuẩn bị phỏng vấn nhập cư",
    title_en: "Preparing for an immigration interview",
    sentences: [
      {
        en: "Saya datang untuk wawancara imigrasi.",
        vi: "Tôi đến để phỏng vấn nhập cư.",
        pronunciation_focus: [
          "SA-ya DA-tang un-TUK wa-wan-CA-ra i-mi-GRA-si - `wawancara imigrasi` = phỏng vấn nhập cư.",
          "Lỗi người Việt: dùng `interview` trong văn phòng hành chính. Ở imigrasi, `wawancara` nghe chuẩn và lịch sự hơn.",
          "Luyện: `Saya datang untuk wawancara imigrasi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya DA-tang un-TOOK wa-wan-CHA-ra i-mi-GRA-si - `wawancara imigrasi` = immigration interview.",
          "VN-speaker trap: using English `interview` in an official office. At immigration, `wawancara` sounds more standard and polite.",
          "Drill: `Saya datang untuk wawancara imigrasi.`",
        ],
      },
      {
        en: "Tujuan tinggal saya adalah bekerja di Jakarta.",
        vi: "Mục đích cư trú của tôi là làm việc ở Jakarta.",
        pronunciation_focus: [
          "tu-JU-an TING-gal SA-ya a-DA-lah be-KER-ja di Ja-KAR-ta - `tujuan tinggal` = mục đích lưu trú/cư trú.",
          "Lỗi người Việt: chỉ nói `saya kerja`. Khi petugas hỏi mục đích, trả lời đầy đủ `Tujuan tinggal saya adalah...`.",
          "Luyện: `Tujuan tinggal saya adalah bekerja.`",
        ],
        pronunciation_focus_en: [
          "too-JOO-an TING-gal SA-ya a-DA-lah be-KER-ja di Ja-KAR-ta - `tujuan tinggal` = purpose of stay.",
          "VN-speaker trap: only saying `saya kerja`. When an officer asks purpose, answer fully: `Tujuan tinggal saya adalah...`.",
          "Drill: `Tujuan tinggal saya adalah bekerja.`",
        ],
      },
      {
        en: "Saya sudah menyiapkan dokumen pendukung.",
        vi: "Tôi đã chuẩn bị giấy tờ hỗ trợ.",
        pronunciation_focus: [
          "SA-ya SU-dah me-nyi-AP-kan do-ku-MEN pen-DU-kung - `dokumen pendukung` = giấy tờ hỗ trợ/bổ sung.",
          "Lỗi người Việt: nói `dokumen support`. Cụm hành chính tự nhiên là `dokumen pendukung`.",
          "Luyện: `Saya sudah menyiapkan dokumen pendukung.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-nyi-AP-kan do-ku-MEN pen-DOO-kung - `dokumen pendukung` = supporting documents.",
          "VN-speaker trap: saying `dokumen support`. The natural administrative phrase is `dokumen pendukung`.",
          "Drill: `Saya sudah menyiapkan dokumen pendukung.`",
        ],
      },
      {
        en: "Sponsor saya adalah perusahaan tempat saya bekerja.",
        vi: "Bên bảo lãnh của tôi là công ty nơi tôi làm việc.",
        pronunciation_focus: [
          "SPON-sor SA-ya a-DA-lah per-u-sa-HA-an tem-PAT SA-ya be-KER-ja - `sponsor` = bên bảo lãnh/tài trợ; `tempat saya bekerja` = nơi tôi làm việc.",
          "Lỗi người Việt: dịch sponsor là người tài trợ tiền. Trong imigrasi, `sponsor` có thể là công ty, trường, hoặc người bảo lãnh.",
          "Luyện: `Sponsor saya adalah perusahaan.`",
        ],
        pronunciation_focus_en: [
          "SPON-sor SA-ya a-DA-lah per-u-sa-HA-an tem-PAT SA-ya be-KER-ja - `sponsor` = sponsor/guarantor; `tempat saya bekerja` = where I work.",
          "VN-speaker trap: reading sponsor only as financial sponsor. In immigration, `sponsor` may be a company, school, or guarantor.",
          "Drill: `Sponsor saya adalah perusahaan.`",
        ],
      },
      {
        en: "Saya akan menjawab dengan singkat dan jelas.",
        vi: "Tôi sẽ trả lời ngắn gọn và rõ ràng.",
        pronunciation_focus: [
          "SA-ya A-kan men-JA-wab de-NGAN SING-kat dan JE-las - `jawaban singkat` = câu trả lời ngắn; `jelas` = rõ.",
          "Lỗi người Việt: trả lời quá dài vì muốn giải thích hết. Trong wawancara imigrasi, `singkat dan jelas` thường tốt hơn.",
          "Luyện: `Jawab dengan singkat dan jelas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan men-JA-wab de-NGAN SING-kat dan JE-las - `jawaban singkat` = short answer; `jelas` = clear.",
          "VN-speaker trap: over-answering to explain everything. In immigration interviews, `singkat dan jelas` is often better.",
          "Drill: `Jawab dengan singkat dan jelas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Wawancara imigrasi ở Indonesia thường hỏi mục đích tinggal, alamat, sponsor, pekerjaan/sekolah, dokumen pendukung, và rencana perjalanan. Cách nói nên formal: dùng `saya`, `Bapak/Ibu`, `mohon`, và trả lời đúng câu hỏi, không lan man.",
    cultural_notes_en:
      "Immigration interviews in Indonesia often ask about purpose of stay, address, sponsor, work/school, supporting documents, and travel plans. Use formal wording: `saya`, `Bapak/Ibu`, `mohon`, and answer the exact question without rambling.",
    tip_advice_vi:
      "Khung an toàn: `Tujuan tinggal saya adalah...`, `Sponsor saya adalah...`, `Saya sudah menyiapkan...`. Nếu không hiểu, nói `Maaf, bisa diulang pelan-pelan?` thay vì đoán.",
    tip_advice_en:
      "Safe frames: `Tujuan tinggal saya adalah...`, `Sponsor saya adalah...`, `Saya sudah menyiapkan...`. If you do not understand, say `Maaf, bisa diulang pelan-pelan?` instead of guessing.",
    vocabulary: [
      {
        word: "wawancara imigrasi",
        en: "immigration interview",
        vi: "phỏng vấn nhập cư",
        pos: "noun phrase",
        pronunciation_vi: "wa-wan-CA-ra i-mi-GRA-si",
        pronunciation_en: "wa-wan-CHA-ra i-mi-GRA-si",
      },
      {
        word: "tujuan tinggal",
        en: "purpose of stay",
        vi: "mục đích lưu trú",
        pos: "noun phrase",
        pronunciation_vi: "tu-JU-an TING-gal",
        pronunciation_en: "too-JOO-an TING-gal",
      },
      {
        word: "dokumen pendukung",
        en: "supporting documents",
        vi: "giấy tờ hỗ trợ/bổ sung",
        pos: "noun phrase",
        pronunciation_vi: "do-ku-MEN pen-DU-kung",
        pronunciation_en: "do-ku-MEN pen-DOO-kung",
      },
      {
        word: "sponsor",
        en: "sponsor / guarantor",
        vi: "bên bảo lãnh",
        pos: "noun",
        pronunciation_vi: "SPON-sor",
        pronunciation_en: "SPON-sor",
      },
      {
        word: "jawaban singkat",
        en: "short answer",
        vi: "câu trả lời ngắn",
        pos: "noun phrase",
        pronunciation_vi: "ja-WA-ban SING-kat",
        pronunciation_en: "ja-WA-ban SING-kat",
      },
      {
        word: "sopan",
        en: "polite",
        vi: "lịch sự",
        pos: "adjective",
        pronunciation_vi: "SO-pan",
        pronunciation_en: "SO-pan",
      },
    ],
    dialogue: [
      {
        speaker: "Petugas",
        text: "Apa tujuan tinggal Anda di Indonesia?",
        vi: "Mục đích lưu trú của bạn ở Indonesia là gì?",
        en: "What is your purpose of stay in Indonesia?",
      },
      {
        speaker: "Pemohon",
        text: "Tujuan tinggal saya adalah bekerja di Jakarta.",
        vi: "Mục đích cư trú của tôi là làm việc ở Jakarta.",
        en: "My purpose of stay is to work in Jakarta.",
      },
      {
        speaker: "Petugas",
        text: "Siapa sponsor Anda?",
        vi: "Ai là bên bảo lãnh của bạn?",
        en: "Who is your sponsor?",
      },
      {
        speaker: "Pemohon",
        text: "Sponsor saya adalah perusahaan tempat saya bekerja.",
        vi: "Bên bảo lãnh của tôi là công ty nơi tôi làm việc.",
        en: "My sponsor is the company where I work.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya datang untuk wawancara ___.`",
        prompt_en: "Fill in: `Saya datang untuk wawancara ___.`",
        answer: "imigrasi",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi đã chuẩn bị giấy tờ hỗ trợ.",
        prompt_en: "Translate to Indonesian: I have prepared supporting documents.",
        answer: "Saya sudah menyiapkan dokumen pendukung.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là mục đích lưu trú?",
        prompt_en: "Which phrase means purpose of stay?",
        options: ["tujuan tinggal", "jawaban singkat", "riwayat perjalanan"],
        answer: "tujuan tinggal",
      },
    ],
  },
  {
    id: "indonesian_travel_history_polite_answers",
    level: "B1",
    category: "life_admin",
    title_vi: "Lịch sử đi lại và trả lời lịch sự",
    title_en: "Travel history and polite answers",
    sentences: [
      {
        en: "Riwayat perjalanan saya ada di paspor lama.",
        vi: "Lịch sử đi lại của tôi có trong hộ chiếu cũ.",
        pronunciation_focus: [
          "ri-WA-yat per-ja-LA-nan SA-ya A-da di PAS-por LA-ma - `riwayat perjalanan` = lịch sử đi lại; `paspor lama` = hộ chiếu cũ.",
          "Lỗi người Việt: dùng `sejarah perjalanan`. Với hồ sơ cá nhân, dùng `riwayat`, không phải `sejarah`.",
          "Luyện: `Riwayat perjalanan saya ada di paspor.`",
        ],
        pronunciation_focus_en: [
          "ri-WA-yat per-ja-LA-nan SA-ya A-da di PAS-por LA-ma - `riwayat perjalanan` = travel history; `paspor lama` = old passport.",
          "VN-speaker trap: saying `sejarah perjalanan`. For personal records, use `riwayat`, not `sejarah`.",
          "Drill: `Riwayat perjalanan saya ada di paspor.`",
        ],
      },
      {
        en: "Saya pernah tinggal di Indonesia selama enam bulan.",
        vi: "Tôi từng sống ở Indonesia trong sáu tháng.",
        pronunciation_focus: [
          "SA-ya PER-nah TING-gal di in-do-NE-sia se-LA-ma e-NAM BU-lan - `pernah` = đã từng; `selama` = trong thời gian.",
          "Lỗi người Việt: bỏ `pernah` khi nói kinh nghiệm từng xảy ra. `Saya tinggal...` có thể nghe như hiện tại.",
          "Luyện: `Saya pernah tinggal di Indonesia.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-nah TING-gal di in-do-NE-sia se-LA-ma e-NAM BOO-lan - `pernah` = have ever/once; `selama` = for a duration.",
          "VN-speaker trap: dropping `pernah` for past experience. `Saya tinggal...` may sound like the present.",
          "Drill: `Saya pernah tinggal di Indonesia.`",
        ],
      },
      {
        en: "Maaf, bisa diulang pelan-pelan?",
        vi: "Xin lỗi, có thể nhắc lại chậm chậm không?",
        pronunciation_focus: [
          "ma-AF, BI-sa di-U-lang PE-lan-PE-lan - `diulang` = được nhắc lại; `pelan-pelan` = chậm chậm.",
          "Lỗi người Việt: im lặng hoặc đoán khi không hiểu. Câu này lịch sự và an toàn ở quầy imigrasi.",
          "Luyện: `Maaf, bisa diulang pelan-pelan?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, BEE-sa di-OO-lang PE-lan-PE-lan - `diulang` = repeated; `pelan-pelan` = slowly.",
          "VN-speaker trap: staying silent or guessing when you do not understand. This is polite and safe at immigration.",
          "Drill: `Maaf, bisa diulang pelan-pelan?`",
        ],
      },
      {
        en: "Saya kurang paham pertanyaannya.",
        vi: "Tôi chưa hiểu rõ câu hỏi.",
        pronunciation_focus: [
          "SA-ya KU-rang PA-ham per-TA-nya-an-nya - `kurang paham` = chưa hiểu rõ; `pertanyaannya` = câu hỏi đó.",
          "Lỗi người Việt: nói `tidak tahu` khi ý là không hiểu câu hỏi. `Kurang paham` mềm và chính xác hơn.",
          "Luyện: `Saya kurang paham pertanyaannya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya KOO-rang PA-ham per-TA-nya-an-nya - `kurang paham` = do not quite understand; `pertanyaannya` = the question.",
          "VN-speaker trap: saying `tidak tahu` when you mean you did not understand the question. `Kurang paham` is softer and more accurate.",
          "Drill: `Saya kurang paham pertanyaannya.`",
        ],
      },
      {
        en: "Saya akan menjawab sesuai dokumen saya.",
        vi: "Tôi sẽ trả lời theo đúng giấy tờ của tôi.",
        pronunciation_focus: [
          "SA-ya A-kan men-JA-wab se-SU-ai do-ku-MEN SA-ya - `sesuai` = phù hợp/theo đúng; `dokumen saya` = giấy tờ của tôi.",
          "Lỗi người Việt: thêm thông tin không có trong hồ sơ. `Sesuai dokumen` nhắc bạn trả lời nhất quán với giấy tờ.",
          "Luyện: `Jawab sesuai dokumen.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan men-JA-wab se-SU-ai do-ku-MEN SA-ya - `sesuai` = according to/matching; `dokumen saya` = my documents.",
          "VN-speaker trap: adding information not in the file. `Sesuai dokumen` reminds you to answer consistently with documents.",
          "Drill: `Jawab sesuai dokumen.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong wawancara imigrasi, nếu không hiểu câu hỏi, tốt hơn là xin nhắc lại thay vì đoán. Trả lời nên singkat, jujur, sopan, dan sesuai dokumen. Đừng dùng `aku`, `nggak`, hoặc tiếng lóng khi nói với petugas.",
    cultural_notes_en:
      "In an immigration interview, if you do not understand the question, it is better to ask for repetition than to guess. Answers should be short, honest, polite, and consistent with documents. Avoid `aku`, `nggak`, or slang when speaking to an officer.",
    tip_advice_vi:
      "Ba câu cứu nguy: `Maaf, bisa diulang pelan-pelan?`, `Saya kurang paham pertanyaannya`, `Saya akan menjawab sesuai dokumen saya.`",
    tip_advice_en:
      "Three rescue sentences: `Maaf, bisa diulang pelan-pelan?`, `Saya kurang paham pertanyaannya`, `Saya akan menjawab sesuai dokumen saya.`",
    vocabulary: [
      {
        word: "riwayat perjalanan",
        en: "travel history",
        vi: "lịch sử đi lại",
        pos: "noun phrase",
        pronunciation_vi: "ri-WA-yat per-ja-LA-nan",
        pronunciation_en: "ri-WA-yat per-ja-LA-nan",
      },
      {
        word: "pernah",
        en: "ever / once did",
        vi: "đã từng",
        pos: "adverb",
        pronunciation_vi: "PER-nah",
        pronunciation_en: "PER-nah",
      },
      {
        word: "diulang",
        en: "repeated",
        vi: "được nhắc lại",
        pos: "verb",
        pronunciation_vi: "di-U-lang",
        pronunciation_en: "di-OO-lang",
      },
      {
        word: "pelan-pelan",
        en: "slowly",
        vi: "chậm chậm",
        pos: "adverb",
        pronunciation_vi: "PE-lan-PE-lan",
        pronunciation_en: "PE-lan-PE-lan",
      },
      {
        word: "kurang paham",
        en: "do not quite understand",
        vi: "chưa hiểu rõ",
        pos: "phrase",
        pronunciation_vi: "KU-rang PA-ham",
        pronunciation_en: "KOO-rang PA-ham",
      },
      {
        word: "sesuai dokumen",
        en: "according to the documents",
        vi: "theo đúng giấy tờ",
        pos: "phrase",
        pronunciation_vi: "se-SU-ai do-ku-MEN",
        pronunciation_en: "se-SU-ai do-ku-MEN",
      },
    ],
    dialogue: [
      {
        speaker: "Petugas",
        text: "Apakah Anda pernah tinggal di Indonesia sebelumnya?",
        vi: "Bạn đã từng sống ở Indonesia trước đây chưa?",
        en: "Have you ever lived in Indonesia before?",
      },
      {
        speaker: "Pemohon",
        text: "Ya, saya pernah tinggal di Indonesia selama enam bulan.",
        vi: "Có, tôi từng sống ở Indonesia trong sáu tháng.",
        en: "Yes, I once lived in Indonesia for six months.",
      },
      {
        speaker: "Petugas",
        text: "Riwayat perjalanan Anda ada di paspor lama?",
        vi: "Lịch sử đi lại của bạn có trong hộ chiếu cũ không?",
        en: "Is your travel history in the old passport?",
      },
      {
        speaker: "Pemohon",
        text: "Ya, riwayat perjalanan saya ada di paspor lama.",
        vi: "Vâng, lịch sử đi lại của tôi có trong hộ chiếu cũ.",
        en: "Yes, my travel history is in the old passport.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Maaf, bisa diulang ___?`",
        prompt_en: "Fill in: `Maaf, bisa diulang ___?`",
        answer: "pelan-pelan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi chưa hiểu rõ câu hỏi.",
        prompt_en: "Translate to Indonesian: I do not quite understand the question.",
        answer: "Saya kurang paham pertanyaannya.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `riwayat perjalanan`, `pernah`, `sesuai dokumen`.",
        prompt_en: "Match meanings: `riwayat perjalanan`, `pernah`, `sesuai dokumen`.",
        pairs: [
          ["riwayat perjalanan", "lịch sử đi lại / travel history"],
          ["pernah", "đã từng / ever"],
          ["sesuai dokumen", "theo đúng giấy tờ / according to documents"],
        ],
      },
    ],
  },
];
