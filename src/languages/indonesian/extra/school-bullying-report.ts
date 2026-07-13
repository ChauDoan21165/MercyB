// School bullying report Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained Wave 32 extra lesson. Indonesian target text lives in `en`,
// Vietnamese glosses live in `vi`, and Vietnamese L1 notes have English
// companion explanations in pronunciation_focus_en.

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
    id: "indonesian_school_bullying_report",
    level: "B1",
    category: "school_family",
    title_vi: "Báo cáo bắt nạt ở trường",
    title_en: "Reporting school bullying",
    sentences: [
      {
        en: "Saya ingin melaporkan perundungan yang dialami anak saya.",
        vi: "Tôi muốn báo cáo việc bắt nạt mà con tôi đã trải qua.",
        pronunciation_focus: [
          "SA-ya I-ngin me-LA-por-kan pe-run-DUNG-an yang di-A-la-mi A-nak SA-ya - `perundungan` = bắt nạt; `dialami anak saya` = con tôi trải qua.",
          "Lỗi người Việt: dùng `bullying` có thể hiểu, nhưng trong báo cáo trường học `perundungan` trang trọng và rõ hơn.",
          "Luyện: `Saya ingin melaporkan perundungan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-LA-por-kan peh-roon-DOONG-an yang dee-A-la-mee A-nak SA-ya - `perundungan` = bullying; `dialami anak saya` = experienced by my child.",
          "VN-speaker trap: English `bullying` may be understood, but `perundungan` is clearer and more formal in school reports.",
          "Drill: `Saya ingin melaporkan perundungan.`",
        ],
      },
      {
        en: "Anak saya diejek oleh beberapa teman sekelas.",
        vi: "Con tôi bị vài bạn cùng lớp chế giễu.",
        pronunciation_focus: [
          "A-nak SA-ya di-E-jek O-leh be-be-RA-pa te-MAN se-KE-las - `diejek` = bị chế giễu; `teman sekelas` = bạn cùng lớp.",
          "`oleh` đánh dấu người gây hành động trong câu bị động. Với chuyện nhạy cảm, câu bị động giúp nghe bình tĩnh hơn.",
          "Luyện: `Anak saya diejek oleh teman sekelas.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya dee-EH-jek O-leh beh-beh-RA-pa teh-MAN seh-KEH-las - `diejek` = mocked/teased; `teman sekelas` = classmates.",
          "`Oleh` marks the actor in a passive sentence. For sensitive issues, passive wording can sound calmer.",
          "Drill: `Anak saya diejek oleh teman sekelas.`",
        ],
      },
      {
        en: "Kami punya bukti chat dari grup kelas.",
        vi: "Chúng tôi có bằng chứng tin nhắn từ nhóm lớp.",
        pronunciation_focus: [
          "KA-mi PU-nya BUK-ti chat da-RI grup KE-las - `bukti chat` = bằng chứng tin nhắn; `grup kelas` = nhóm lớp.",
          "`punya bukti` là cách nói tự nhiên. Trong văn bản chính thức có thể dùng `memiliki bukti`.",
          "Luyện: `Kami punya bukti chat.`",
        ],
        pronunciation_focus_en: [
          "KA-mee POO-nya BOOK-tee chat da-REE groop KEH-las - `bukti chat` = chat evidence; `grup kelas` = class group.",
          "`Punya bukti` is natural speech. In formal writing, `memiliki bukti` is also possible.",
          "Drill: `Kami punya bukti chat.`",
        ],
      },
      {
        en: "Tolong sampaikan laporan ini kepada wali kelas.",
        vi: "Làm ơn chuyển báo cáo này cho giáo viên chủ nhiệm.",
        pronunciation_focus: [
          "TO-long sam-PAI-kan la-PO-ran I-ni ke-PA-da WA-li KE-las - `wali kelas` = giáo viên chủ nhiệm; `sampaikan` = chuyển/trao lại thông tin.",
          "`kepada` dùng cho người nhận thông tin. Đừng dùng `ke wali kelas` trong văn bản lịch sự nếu muốn trang trọng hơn.",
          "Luyện: `Sampaikan kepada wali kelas.`",
        ],
        pronunciation_focus_en: [
          "TO-long sam-PIE-kan la-PO-ran EE-nee keh-PA-da WA-lee KEH-las - `wali kelas` = homeroom teacher; `sampaikan` = pass on/convey.",
          "`Kepada` marks the recipient. Use it instead of casual `ke wali kelas` in more polite writing.",
          "Drill: `Sampaikan kepada wali kelas.`",
        ],
      },
      {
        en: "Apakah guru sudah berbicara dengan siswa yang terlibat?",
        vi: "Giáo viên đã nói chuyện với những học sinh liên quan chưa?",
        pronunciation_focus: [
          "a-pa-KAH GU-ru SU-dah ber-bi-CA-ra de-NGAN SIS-wa yang ter-LI-bat - `siswa yang terlibat` = học sinh liên quan.",
          "`terlibat` trung lập hơn `bersalah` khi nhà trường vẫn đang kiểm tra sự việc.",
          "Luyện: `Siswa yang terlibat sudah diajak bicara?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH GOO-roo SOO-dah ber-bee-CHA-ra deh-NGAN SIS-wa yang ter-LEE-bat - `siswa yang terlibat` = involved students.",
          "`Terlibat` is more neutral than `bersalah` while the school is still checking the situation.",
          "Drill: `Siswa yang terlibat sudah diajak bicara?`",
        ],
      },
      {
        en: "Kami meminta mediasi dengan orang tua siswa tersebut.",
        vi: "Chúng tôi đề nghị hòa giải với phụ huynh của học sinh đó.",
        pronunciation_focus: [
          "KA-mi me-MIN-ta me-di-A-si de-NGAN O-rang TU-a SIS-wa ter-SE-but - `mediasi` = hòa giải; `orang tua siswa` = phụ huynh học sinh.",
          "`meminta mediasi` lịch sự hơn `mau ketemu untuk marah`. Câu này giữ mục tiêu giải quyết vấn đề.",
          "Luyện: `Kami meminta mediasi.`",
        ],
        pronunciation_focus_en: [
          "KA-mee meh-MIN-ta meh-dee-A-see deh-NGAN O-rang TOO-a SIS-wa ter-SEH-boot - `mediasi` = mediation; `orang tua siswa` = student's parents.",
          "`Meminta mediasi` is more constructive than saying you want to meet angrily. It keeps the focus on resolution.",
          "Drill: `Kami meminta mediasi.`",
        ],
      },
      {
        en: "Mohon pastikan keamanan anak saya di kelas dan saat istirahat.",
        vi: "Xin hãy bảo đảm an toàn cho con tôi trong lớp và lúc nghỉ giải lao.",
        pronunciation_focus: [
          "MO-hon pas-TI-kan ke-a-MA-nan A-nak SA-ya di KE-las dan SA-at is-ti-RA-hat - `keamanan anak` = an toàn của trẻ; `saat istirahat` = lúc nghỉ.",
          "`mohon pastikan` là yêu cầu lịch sự nhưng rõ ràng. Dùng khi cần nhà trường có hành động cụ thể.",
          "Luyện: `Mohon pastikan keamanan anak saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon pas-TEE-kan keh-a-MA-nan A-nak SA-ya dee KEH-las dan SA-at is-tee-RA-hat - `keamanan anak` = child safety; `saat istirahat` = during break.",
          "`Mohon pastikan` is polite but clear. Use it when asking the school to take concrete action.",
          "Drill: `Mohon pastikan keamanan anak saya.`",
        ],
      },
      {
        en: "Anak saya takut masuk sekolah sejak kejadian itu.",
        vi: "Con tôi sợ đi học từ sau sự việc đó.",
        pronunciation_focus: [
          "A-nak SA-ya TA-kut MA-suk se-KO-lah se-JAK ke-JA-di-an I-tu - `takut masuk sekolah` = sợ đi học; `sejak kejadian itu` = từ sự việc đó.",
          "`masuk sekolah` trong ngữ cảnh này nghĩa là đi học/đến trường, không phải chỉ bước vào cổng.",
          "Luyện: `Sejak kejadian itu, anak saya takut masuk sekolah.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya TA-koot MA-sook seh-KO-lah seh-JAK keh-JA-dee-an EE-too - `takut masuk sekolah` = afraid to go to school; `sejak kejadian itu` = since that incident.",
          "`Masuk sekolah` here means attend/go to school, not only physically enter the gate.",
          "Drill: `Sejak kejadian itu, anak saya takut masuk sekolah.`",
        ],
      },
      {
        en: "Kami ingin ada tindak lanjut tertulis dari pihak sekolah.",
        vi: "Chúng tôi muốn có phản hồi/xử lý tiếp bằng văn bản từ phía nhà trường.",
        pronunciation_focus: [
          "KA-mi I-ngin A-da TIN-dak LAN-jut ter-TU-lis da-RI PI-hak se-KO-lah - `tindak lanjut tertulis` = xử lý tiếp bằng văn bản.",
          "`pihak sekolah` = phía nhà trường. Cụm này lịch sự khi nói về trách nhiệm của trường.",
          "Luyện: `Kami minta tindak lanjut tertulis.`",
        ],
        pronunciation_focus_en: [
          "KA-mee EE-ngin A-da TIN-dak LAN-joot ter-TOO-lis da-REE PEE-hak seh-KO-lah - `tindak lanjut tertulis` = written follow-up.",
          "`Pihak sekolah` = the school side/administration. It is a polite way to refer to school responsibility.",
          "Drill: `Kami minta tindak lanjut tertulis.`",
        ],
      },
      {
        en: "Kalau perundungan berlanjut, kami akan membuat laporan resmi.",
        vi: "Nếu việc bắt nạt tiếp diễn, chúng tôi sẽ làm báo cáo chính thức.",
        pronunciation_focus: [
          "KA-lau pe-run-DUNG-an ber-LAN-jut, KA-mi A-kan mem-BU-at la-PO-ran res-MI - `berlanjut` = tiếp diễn; `laporan resmi` = báo cáo chính thức.",
          "`kalau ... berlanjut` là cách nêu ranh giới rõ mà vẫn lịch sự.",
          "Luyện: `Kalau berlanjut, kami akan membuat laporan resmi.`",
        ],
        pronunciation_focus_en: [
          "KA-lau peh-roon-DOONG-an ber-LAN-joot, KA-mee A-kan mem-BOO-at la-PO-ran res-MEE - `berlanjut` = continue; `laporan resmi` = official report.",
          "`Kalau ... berlanjut` sets a clear boundary while staying polite.",
          "Drill: `Kalau berlanjut, kami akan membuat laporan resmi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, phụ huynh thường bắt đầu bằng cách nói chuyện với `wali kelas` hoặc guru BK/konselor sekolah trước khi nâng lên kepala sekolah. Với perundungan, nên ghi ngày giờ, tempat kejadian, nama siswa yang terlibat, saksi, dan `bukti chat` nếu có. Dùng giọng bình tĩnh: `Saya ingin melaporkan...`, `Mohon pastikan keamanan anak saya...`, và `Kami ingin ada tindak lanjut tertulis...`.",
    cultural_notes_en:
      "In Indonesia, parents often begin by speaking with the homeroom teacher or school counselor before escalating to the principal. For bullying, record the date, time, location, involved students, witnesses, and any chat evidence. Keep a calm tone: `Saya ingin melaporkan...`, `Mohon pastikan keamanan anak saya...`, and `Kami ingin ada tindak lanjut tertulis...`.",
    tip_advice_vi:
      "Mẹo cho người Việt: tránh mở đầu bằng lời buộc tội quá mạnh như `anak itu jahat`. Hãy dùng từ trung lập trước: `siswa yang terlibat`, `kejadian ini`, `perundungan`, `bukti chat`, `mediasi`, `tindak lanjut tertulis`. Nếu cần bảo vệ trẻ ngay, câu quan trọng là `Mohon pastikan keamanan anak saya di kelas dan saat istirahat.`",
    tip_advice_en:
      "Tip for Vietnamese speakers: avoid opening with a harsh accusation like `anak itu jahat`. Start with neutral terms: `siswa yang terlibat`, `kejadian ini`, `perundungan`, `bukti chat`, `mediasi`, `tindak lanjut tertulis`. If immediate child safety matters, the key sentence is `Mohon pastikan keamanan anak saya di kelas dan saat istirahat.`",
    vocabulary: [
      { cell_id: "cd434f53-8116-47aa-9e14-605e33656683", word: "perundungan", en: "bullying", vi: "bắt nạt", pos: "noun", pronunciation_vi: "pe-run-DUNG-an", pronunciation_en: "peh-roon-DOONG-an" },
      { cell_id: "833062d6-11ab-4ac6-9d93-181fe33b5985", word: "melaporkan", en: "to report", vi: "báo cáo", pos: "verb", pronunciation_vi: "me-LA-por-kan", pronunciation_en: "meh-LA-por-kan" },
      { cell_id: "6465b13a-c54f-4ba3-8912-47bfb75fc58a", word: "wali kelas", en: "homeroom teacher", vi: "giáo viên chủ nhiệm", pos: "noun phrase", pronunciation_vi: "WA-li KE-las", pronunciation_en: "WA-lee KEH-las" },
      { cell_id: "ea540c3c-6595-4712-9c0c-af0966ce0ebf", word: "bukti chat", en: "chat evidence", vi: "bằng chứng tin nhắn", pos: "noun phrase", pronunciation_vi: "BUK-ti chat", pronunciation_en: "BOOK-tee chat" },
      { cell_id: "0517698e-2988-48c4-b115-2f1e65e3e2b9", word: "teman sekelas", en: "classmate", vi: "bạn cùng lớp", pos: "noun phrase", pronunciation_vi: "te-MAN se-KE-las", pronunciation_en: "teh-MAN seh-KEH-las" },
      { cell_id: "7ca6109a-230c-40b8-8410-9f0e1493f036", word: "mediasi", en: "mediation", vi: "hòa giải", pos: "noun", pronunciation_vi: "me-di-A-si", pronunciation_en: "meh-dee-A-see" },
      { cell_id: "e335d4a1-f56b-49e6-a475-ebf6bcd5315f", word: "orang tua", en: "parent / guardian", vi: "phụ huynh / cha mẹ", pos: "noun phrase", pronunciation_vi: "O-rang TU-a", pronunciation_en: "O-rang TOO-a" },
      { cell_id: "6c169a35-819c-4f8d-8a94-310f60dc6320", word: "keamanan anak", en: "child safety", vi: "an toàn của trẻ", pos: "noun phrase", pronunciation_vi: "ke-a-MA-nan A-nak", pronunciation_en: "keh-a-MA-nan A-nak" },
      { cell_id: "e96a6d66-f5fa-44f0-90c9-ebe687d0a237", word: "tindak lanjut", en: "follow-up action", vi: "xử lý tiếp / phản hồi tiếp", pos: "noun phrase", pronunciation_vi: "TIN-dak LAN-jut", pronunciation_en: "TIN-dak LAN-joot" },
      { cell_id: "e38e475e-4dcb-4dca-807e-6b0422889e9e", word: "laporan resmi", en: "official report", vi: "báo cáo chính thức", pos: "noun phrase", pronunciation_vi: "la-PO-ran res-MI", pronunciation_en: "la-PO-ran res-MEE" },
    ],
    dialogue: [
      {
        cell_id: "4e335c12-9ad7-4e96-b6e1-cf706e6ea287",
        speaker: "Orang tua",
        text: "Bu, saya ingin melaporkan perundungan yang dialami anak saya.",
        vi: "Cô ơi, tôi muốn báo cáo việc bắt nạt mà con tôi đã trải qua.",
        en: "Ma'am, I would like to report bullying that my child experienced.",
      },
      {
        cell_id: "6dd65966-0206-40e3-a7d9-ea09927ab465",
        speaker: "Wali kelas",
        text: "Baik, Pak. Apakah ada bukti atau saksi?",
        vi: "Vâng, thưa anh. Có bằng chứng hoặc nhân chứng không?",
        en: "All right, sir. Is there evidence or a witness?",
      },
      {
        cell_id: "7a32badf-2702-4830-9caf-b6ee8c1e641f",
        speaker: "Orang tua",
        text: "Kami punya bukti chat dari grup kelas dan nama teman sekelas yang terlibat.",
        vi: "Chúng tôi có bằng chứng tin nhắn từ nhóm lớp và tên các bạn cùng lớp liên quan.",
        en: "We have chat evidence from the class group and the names of classmates involved.",
      },
      {
        cell_id: "3cf33125-3454-4ec7-8109-1e48d58034c8",
        speaker: "Wali kelas",
        text: "Saya akan bicara dengan siswa yang terlibat dan menghubungi orang tua mereka.",
        vi: "Tôi sẽ nói chuyện với các học sinh liên quan và liên hệ phụ huynh của các em.",
        en: "I will speak with the involved students and contact their parents.",
      },
      {
        cell_id: "8683f110-452c-4625-b3b2-f42178ae1ea9",
        speaker: "Orang tua",
        text: "Mohon pastikan keamanan anak saya di kelas dan saat istirahat.",
        vi: "Xin hãy bảo đảm an toàn cho con tôi trong lớp và lúc nghỉ giải lao.",
        en: "Please make sure my child is safe in class and during break.",
      },
      {
        cell_id: "2b7a510c-c4da-4e62-9408-37ffc73f8ade",
        speaker: "Wali kelas",
        text: "Kami akan membuat tindak lanjut tertulis setelah mediasi.",
        vi: "Chúng tôi sẽ làm phản hồi bằng văn bản sau buổi hòa giải.",
        en: "We will provide written follow-up after mediation.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn báo cáo việc bắt nạt.",
        prompt_en: "Translate into Indonesian: I want to report bullying.",
        answer: "Saya ingin melaporkan perundungan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kami punya ____ chat dari grup kelas.",
        prompt_en: "Fill in the blank: Kami punya ____ chat dari grup kelas.",
        answer: "bukti",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`wali kelas` nghĩa là gì?",
        prompt_en: "What does `wali kelas` mean?",
        choices: ["giáo viên chủ nhiệm / homeroom teacher", "bảo vệ trường / school security guard", "bạn cùng lớp / classmate"],
        answer: "giáo viên chủ nhiệm / homeroom teacher",
      },
      {
        type: "politeness_rewrite",
        prompt_vi: "Viết lại lịch sự hơn: Anak itu jahat, saya mau marah.",
        prompt_en: "Rewrite more politely: Anak itu jahat, saya mau marah.",
        answer: "Kami ingin meminta mediasi dengan orang tua siswa yang terlibat.",
      },
    ],
  },
];

export default lessons;
