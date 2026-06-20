// School Parent Meeting Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_school_parent_meeting",
    level: "A2",
    category: "education",
    title_vi: "Họp phụ huynh và trao đổi với giáo viên",
    title_en: "Parent-teacher meetings and school communication",
    sentences: [
      {
        en: "Besok ada rapat orang tua di sekolah.",
        vi: "Ngày mai có họp phụ huynh ở trường.",
        pronunciation_focus: [
          "BE-sok A-da RA-pat o-RANG TU-a di se-KO-lah -- `rapat orang tua` = họp phụ huynh.",
          "Lỗi người Việt: dịch 'phụ huynh' thành một từ lạ. Trong Indonesia thường nói thẳng `orang tua` = cha mẹ/phụ huynh.",
          "Luyện: `Ada rapat orang tua besok.`",
        ],
        pronunciation_focus_en: [
          "BE-sok A-da RA-pat o-RANG TOO-a di se-KO-lah -- `rapat orang tua` = parent meeting.",
          "VN-speaker trap: looking for a special word for 'parent'. Indonesian often simply uses `orang tua` = parents.",
          "Drill: `Ada rapat orang tua besok.`",
        ],
      },
      {
        en: "Saya mau bertemu wali kelas anak saya.",
        vi: "Tôi muốn gặp giáo viên chủ nhiệm của con tôi.",
        pronunciation_focus: [
          "SA-ya mau ber-TE-mu WA-li KE-las A-nak SA-ya -- `wali kelas` = giáo viên chủ nhiệm.",
          "`anak saya` = con tôi, sở hữu đứng sau danh từ. Không nói theo thứ tự tiếng Việt `saya anak`.",
          "Luyện: `Saya mau bertemu wali kelas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau ber-TE-mu WA-li KE-las A-nak SA-ya -- `wali kelas` = homeroom teacher/class teacher.",
          "`anak saya` = my child; possession follows the noun. Do not copy Vietnamese order as `saya anak`.",
          "Drill: `Saya mau bertemu wali kelas.`",
        ],
      },
      {
        en: "Bagaimana nilai anak saya semester ini?",
        vi: "Điểm của con tôi học kỳ này thế nào?",
        pronunciation_focus: [
          "ba-gai-MA-na NI-lai A-nak SA-ya se-MES-ter I-ni -- `nilai` = điểm số; `bagaimana` = thế nào.",
          "Lỗi người Việt: hỏi `berapa nilai` khi muốn nhận xét tổng quát. `Berapa` hỏi con số; `bagaimana` hỏi tình hình.",
          "Luyện: `Bagaimana nilai anak saya?`",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na NI-lai A-nak SA-ya se-MES-ter I-ni -- `nilai` = grade/score; `bagaimana` = how.",
          "VN-speaker trap: asking `berapa nilai` when you want a general evaluation. `Berapa` asks a number; `bagaimana` asks the situation.",
          "Drill: `Bagaimana nilai anak saya?`",
        ],
      },
      {
        en: "Anak saya sering lupa mengerjakan PR.",
        vi: "Con tôi thường quên làm bài tập về nhà.",
        pronunciation_focus: [
          "A-nak SA-ya SE-ring LU-pa me-nger-JA-kan pe-er -- `PR` đọc `pe-er`, nghĩa là bài tập về nhà.",
          "`mengerjakan PR` = làm bài tập. Đừng dùng `bekerja PR`; `bekerja` là đi làm/làm việc.",
          "Luyện: `Anak saya lupa mengerjakan PR.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya SE-ring LU-pa me-nger-JA-kan pe-er -- `PR` is pronounced `pe-er`, meaning homework.",
          "`mengerjakan PR` = do homework. Do not use `bekerja PR`; `bekerja` means to work at a job.",
          "Drill: `Anak saya lupa mengerjakan PR.`",
        ],
      },
      {
        en: "Seragam sekolah harus dipakai setiap Senin.",
        vi: "Đồng phục trường phải được mặc mỗi thứ Hai.",
        pronunciation_focus: [
          "se-RA-gam se-KO-lah HA-rus di-PA-kai se-TI-ap SE-nin -- `seragam` = đồng phục; `dipakai` = được mặc/dùng.",
          "Lỗi người Việt: dùng `memakai` khi nói quy định chung. Với quy định, bị động `harus dipakai` nghe tự nhiên.",
          "Luyện: `Seragam harus dipakai setiap Senin.`",
        ],
        pronunciation_focus_en: [
          "se-RA-gam se-KO-lah HA-rus di-PA-kai se-TI-ap SE-nin -- `seragam` = uniform; `dipakai` = worn/used.",
          "VN-speaker trap: using active `memakai` for a general rule. For rules, passive `harus dipakai` sounds natural.",
          "Drill: `Seragam harus dipakai setiap Senin.`",
        ],
      },
      {
        en: "Anak saya izin tidak masuk karena sakit.",
        vi: "Con tôi xin phép nghỉ học vì bị ốm.",
        pronunciation_focus: [
          "A-nak SA-ya I-zin TI-dak MA-suk ka-RE-na SA-kit -- `izin tidak masuk` = xin phép vắng/nghỉ học.",
          "`tidak masuk` trong ngữ cảnh trường/làm việc = không đi học/không đi làm, không phải 'không vào'.",
          "Luyện: `Izin tidak masuk karena sakit.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya EE-zin TI-dak MA-suk ka-RE-na SA-kit -- `izin tidak masuk` = request absence.",
          "`tidak masuk` in school/work contexts means absent, not literally 'not entering'.",
          "Drill: `Izin tidak masuk karena sakit.`",
        ],
      },
      {
        en: "Kegiatan sekolah minggu depan dimulai jam berapa?",
        vi: "Hoạt động của trường tuần sau bắt đầu lúc mấy giờ?",
        pronunciation_focus: [
          "ke-GI-a-tan se-KO-lah MING-gu de-PAN di-MU-lai jam be-RA-pa -- `kegiatan sekolah` = hoạt động trường.",
          "Mẹo: `minggu depan` = tuần sau; `jam berapa` = mấy giờ. Không cần thêm giới từ trước `jam`.",
          "Luyện: `Kegiatan sekolah dimulai jam berapa?`",
        ],
        pronunciation_focus_en: [
          "ke-GI-a-tan se-KO-lah MING-gu de-PAN di-MU-lai jam be-RA-pa -- `kegiatan sekolah` = school activity.",
          "Tip: `minggu depan` = next week; `jam berapa` = what time. No extra preposition before `jam`.",
          "Drill: `Kegiatan sekolah dimulai jam berapa?`",
        ],
      },
      {
        en: "Tolong kabari saya kalau ada perubahan jadwal.",
        vi: "Xin báo cho tôi nếu có thay đổi lịch.",
        pronunciation_focus: [
          "TO-long ka-BA-ri SA-ya KA-lau A-da pe-ru-BA-han JAD-wal -- `kabari` = báo tin cho; `perubahan jadwal` = thay đổi lịch.",
          "`Tolong + động từ` là cách nhờ lịch sự, rất hữu ích khi nói với giáo viên hoặc văn phòng trường.",
          "Luyện: `Tolong kabari saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long ka-BA-ri SA-ya KA-lau A-da pe-ru-BA-han JAD-wal -- `kabari` = inform/tell; `perubahan jadwal` = schedule change.",
          "`Tolong + verb` is a polite request pattern, useful with teachers or the school office.",
          "Drill: `Tolong kabari saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `rapat orang tua` hoặc `rapat wali murid` là buổi họp giữa phụ huynh và nhà trường. Giáo viên chủ nhiệm thường gọi là `wali kelas`. Phụ huynh có thể hỏi về `nilai`, `PR`, đồng phục (`seragam`), lịch hoạt động trường, và cách xin phép nghỉ học. Khi nói với giáo viên, dùng `Pak/Bu` và câu lịch sự như `Saya mau bertanya...`, `Tolong kabari saya...`, hoặc `Terima kasih atas informasinya`.",
    cultural_notes_en:
      "In Indonesia, `rapat orang tua` or `rapat wali murid` is a parent-school meeting. The homeroom/class teacher is usually called `wali kelas`. Parents may ask about grades, homework, uniforms, school activity schedules, and how to request absence. When speaking to teachers, use `Pak/Bu` and polite frames like `Saya mau bertanya...`, `Tolong kabari saya...`, or `Terima kasih atas informasinya`.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `nilai` (điểm), `PR` (bài tập về nhà), `seragam` (đồng phục), `izin tidak masuk` (xin nghỉ/vắng), và `kegiatan sekolah` (hoạt động trường). Tiếng Indonesia không chia động từ, nên câu hỏi rất gọn: `Bagaimana nilai anak saya?`, `PR-nya apa?`, `Kegiatan dimulai jam berapa?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `nilai` (grade), `PR` (homework), `seragam` (uniform), `izin tidak masuk` (request absence), and `kegiatan sekolah` (school activity). Indonesian has no verb conjugation, so questions stay compact: `Bagaimana nilai anak saya?`, `PR-nya apa?`, `Kegiatan dimulai jam berapa?`",
    vocabulary: [
      {
        word: "rapat orang tua",
        en: "parent meeting",
        vi: "họp phụ huynh",
        pos: "noun phrase",
        pronunciation_vi: "RA-pat o-RANG TU-a",
        pronunciation_en: "RA-pat o-RANG TOO-a",
      },
      {
        word: "wali kelas",
        en: "homeroom teacher / class teacher",
        vi: "giáo viên chủ nhiệm",
        pos: "noun phrase",
        pronunciation_vi: "WA-li KE-las",
        pronunciation_en: "WA-li KE-las",
      },
      {
        word: "nilai",
        en: "grade / score",
        vi: "điểm số",
        pos: "noun",
        pronunciation_vi: "NI-lai",
        pronunciation_en: "NEE-lai",
      },
      {
        word: "PR",
        en: "homework",
        vi: "bài tập về nhà",
        pos: "noun",
        pronunciation_vi: "pe-er",
        pronunciation_en: "peh-er",
      },
      {
        word: "seragam",
        en: "uniform",
        vi: "đồng phục",
        pos: "noun",
        pronunciation_vi: "se-RA-gam",
        pronunciation_en: "se-RA-gam",
      },
      {
        word: "izin tidak masuk",
        en: "request absence",
        vi: "xin phép nghỉ/vắng",
        pos: "phrase",
        pronunciation_vi: "I-zin TI-dak MA-suk",
        pronunciation_en: "EE-zin TI-dak MA-suk",
      },
      {
        word: "kegiatan sekolah",
        en: "school activity",
        vi: "hoạt động trường",
        pos: "noun phrase",
        pronunciation_vi: "ke-GI-a-tan se-KO-lah",
        pronunciation_en: "ke-GI-a-tan se-KO-lah",
      },
      {
        word: "kabari",
        en: "inform / let someone know",
        vi: "báo tin cho",
        pos: "verb",
        pronunciation_vi: "ka-BA-ri",
        pronunciation_en: "ka-BA-ri",
      },
      {
        word: "jadwal",
        en: "schedule",
        vi: "lịch",
        pos: "noun",
        pronunciation_vi: "JAD-wal",
        pronunciation_en: "JAD-wal",
      },
      {
        word: "sakit",
        en: "sick",
        vi: "ốm / đau",
        pos: "adjective",
        pronunciation_vi: "SA-kit",
        pronunciation_en: "SA-kit",
      },
    ],
    dialogue: [
      {
        speaker: "Orang tua",
        text: "Selamat pagi, Bu. Saya orang tua dari Minh.",
        vi: "Chào buổi sáng cô. Tôi là phụ huynh của Minh.",
        en: "Good morning, ma'am. I am Minh's parent.",
      },
      {
        speaker: "Wali kelas",
        text: "Selamat pagi. Silakan duduk. Mau bertanya tentang apa?",
        vi: "Chào buổi sáng. Mời anh/chị ngồi. Anh/chị muốn hỏi về việc gì?",
        en: "Good morning. Please sit. What would you like to ask about?",
      },
      {
        speaker: "Orang tua",
        text: "Bagaimana nilai dan PR anak saya semester ini?",
        vi: "Điểm và bài tập về nhà của con tôi học kỳ này thế nào?",
        en: "How are my child's grades and homework this semester?",
      },
      {
        speaker: "Wali kelas",
        text: "Nilainya cukup baik, tapi PR sering terlambat.",
        vi: "Điểm khá tốt, nhưng bài tập về nhà thường nộp trễ.",
        en: "The grades are quite good, but homework is often late.",
      },
      {
        speaker: "Orang tua",
        text: "Baik, Bu. Tolong kabari saya kalau ada masalah.",
        vi: "Vâng cô. Xin báo cho tôi nếu có vấn đề.",
        en: "Okay, ma'am. Please let me know if there is a problem.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn gặp giáo viên chủ nhiệm của con tôi.",
        prompt_en: "Translate into Indonesian: I want to meet my child's homeroom teacher.",
        answer: "Saya mau bertemu wali kelas anak saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Anak saya izin tidak masuk karena ____.",
        prompt_en: "Fill in the blank: Anak saya izin tidak masuk karena ____.",
        answer: "sakit",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["rapat orang tua", "họp phụ huynh / parent meeting"],
          ["wali kelas", "giáo viên chủ nhiệm / homeroom teacher"],
          ["PR", "bài tập về nhà / homework"],
          ["seragam", "đồng phục / uniform"],
        ],
      },
    ],
    content:
      "Useful school-meeting chunks: `Saya orang tua dari...` (I am the parent of...), `Saya mau bertemu wali kelas` (I want to meet the homeroom teacher), `Bagaimana nilai anak saya?` (how are my child's grades?), `Anak saya izin tidak masuk karena sakit` (my child requests absence because of illness), and `Tolong kabari saya` (please let me know).",
  },
];
