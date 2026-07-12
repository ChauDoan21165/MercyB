// Office Onboarding & New Job Indonesian (Vietnamese -> Indonesian study track).
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

export const officeOnboardingNewJobLessons: IndonesianLesson[] = [
  {
    id: "indonesian_office_onboarding_first_day",
    level: "A2",
    category: "workplace",
    title_vi: "Ngày đầu đi làm và orientasi kerja",
    title_en: "First day at work and onboarding orientation",
    sentences: [
      {
        en: "Hari ini hari pertama saya di kantor baru.",
        vi: "Hôm nay là ngày đầu tiên của tôi ở văn phòng mới.",
        pronunciation_focus: [
          "HA-ri I-ni HA-ri per-TA-ma SA-ya di KAN-tor BA-ru - `hari pertama` = ngày đầu tiên; `kantor baru` = văn phòng/công ty mới.",
          "Lỗi người Việt: nói `hari satu` theo dịch thẳng. Thứ tự/số thứ tự là `pertama`, không phải `satu`.",
          "Luyện: `Hari ini hari pertama saya.`",
        ],
        pronunciation_focus_en: [
          "HA-ri EE-ni HA-ri per-TA-ma SA-ya di KAN-tor BA-ru - `hari pertama` = first day; `kantor baru` = new office/company.",
          "VN-speaker trap: saying literal `hari satu`. Ordinal 'first' is `pertama`, not `satu`.",
          "Drill: `Hari ini hari pertama saya.`",
        ],
      },
      {
        en: "Saya ikut orientasi kerja dengan HRD pagi ini.",
        vi: "Sáng nay tôi tham gia buổi định hướng công việc với HRD.",
        pronunciation_focus: [
          "SA-ya I-kut o-ri-en-TA-si KER-ja de-NGAN ha-er-de PA-gi I-ni - `orientasi kerja` = định hướng/nhập môn công việc.",
          "Lỗi người Việt: dịch `orientation` thành `arah`. Trong công ty dùng `orientasi`, không phải `arah`.",
          "Luyện: `Saya ikut orientasi kerja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-kut o-ri-en-TA-si KER-ja de-NGAN ha-er-de PA-gi EE-ni - `orientasi kerja` = work orientation/onboarding.",
          "VN-speaker trap: translating orientation as `arah`. In a company, use `orientasi`, not `arah`.",
          "Drill: `Saya ikut orientasi kerja.`",
        ],
      },
      {
        en: "Di mana saya bisa ambil ID karyawan?",
        vi: "Tôi có thể lấy thẻ nhân viên ở đâu?",
        pronunciation_focus: [
          "di MA-na SA-ya BI-sa AM-bil I-de kar-YA-wan - `ID karyawan` = thẻ/mã nhân viên; `ambil` = lấy.",
          "Lỗi người Việt: dùng `KTP karyawan`. `KTP` là căn cước nhà nước; thẻ công ty là `ID karyawan` hoặc `kartu karyawan`.",
          "Luyện: `Di mana ambil ID karyawan?`",
        ],
        pronunciation_focus_en: [
          "di MA-na SA-ya BEE-sa AM-bil EE-de kar-YA-wan - `ID karyawan` = employee ID/card; `ambil` = pick up/get.",
          "VN-speaker trap: saying `KTP karyawan`. `KTP` is a government ID; a company card is `ID karyawan` or `kartu karyawan`.",
          "Drill: `Di mana ambil ID karyawan?`",
        ],
      },
      {
        en: "Email kantor saya belum aktif.",
        vi: "Email công ty của tôi chưa hoạt động.",
        pronunciation_focus: [
          "E-mail KAN-tor SA-ya be-LUM AK-tif - `email kantor` = email công ty; `belum aktif` = chưa hoạt động.",
          "Lỗi người Việt: dùng `tidak aktif` khi ý là chưa được kích hoạt. Với trạng thái onboarding, `belum aktif` tự nhiên hơn.",
          "Luyện: `Email kantor saya belum aktif.`",
        ],
        pronunciation_focus_en: [
          "E-mail KAN-tor SA-ya be-LOOM AK-tif - `email kantor` = work email; `belum aktif` = not active yet.",
          "VN-speaker trap: using `tidak aktif` when it has not been activated yet. For onboarding status, `belum aktif` is more natural.",
          "Drill: `Email kantor saya belum aktif.`",
        ],
      },
      {
        en: "Siapa mentor saya selama masa onboarding?",
        vi: "Ai là mentor của tôi trong thời gian onboarding?",
        pronunciation_focus: [
          "SI-a-pa MEN-tor SA-ya se-LA-ma MA-sa on-BOAR-ding - `mentor` = người hướng dẫn; `selama` = trong suốt.",
          "Lỗi người Việt: hỏi `mentor saya siapa?` được, nhưng câu đầy đủ `Siapa mentor saya...?` lịch sự hơn khi hỏi HRD.",
          "Luyện: `Siapa mentor saya?`",
        ],
        pronunciation_focus_en: [
          "SEE-a-pa MEN-tor SA-ya se-LA-ma MA-sa on-BOAR-ding - `mentor` = mentor/guide; `selama` = during/throughout.",
          "VN-speaker trap: `mentor saya siapa?` is understandable, but `Siapa mentor saya...?` is more polite with HR.",
          "Drill: `Siapa mentor saya?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều công ty Indonesia, ngày đầu thường có `orientasi kerja` với HRD, pengenalan tim, pengambilan ID karyawan, aktivasi email kantor, và penjelasan aturan kantor. Người mới thường dùng `saya`, `Bapak/Ibu`, `boleh saya tanya`, và tránh giọng quá thân mật trước khi quen đội.",
    cultural_notes_en:
      "In many Indonesian companies, the first day includes HR orientation, team introductions, employee ID pickup, work email activation, and explanation of office rules. New employees usually use `saya`, `Bapak/Ibu`, `boleh saya tanya`, and avoid overly casual speech before they know the team.",
    tip_advice_vi:
      "Khung hữu ích ngày đầu: `Saya ikut orientasi kerja`, `Di mana saya bisa ambil ID karyawan?`, `Email kantor saya belum aktif`, `Siapa mentor saya?`.",
    tip_advice_en:
      "Useful first-day frames: `Saya ikut orientasi kerja`, `Di mana saya bisa ambil ID karyawan?`, `Email kantor saya belum aktif`, `Siapa mentor saya?`.",
    vocabulary: [
      {
        cell_id: "ebfceb1f-dd64-4a77-9df8-03a4121272c7",
        word: "orientasi kerja",
        en: "work orientation / onboarding",
        vi: "định hướng công việc / onboarding",
        pos: "noun phrase",
        pronunciation_vi: "o-ri-en-TA-si KER-ja",
        pronunciation_en: "o-ri-en-TA-si KER-ja",
      },
      {
        cell_id: "ca7b061f-fa8f-4ba1-8687-5210a7a6b648",
        word: "hari pertama",
        en: "first day",
        vi: "ngày đầu tiên",
        pos: "noun phrase",
        pronunciation_vi: "HA-ri per-TA-ma",
        pronunciation_en: "HA-ri per-TA-ma",
      },
      {
        cell_id: "4beda5e2-f48c-4ce5-b8a3-1ea8533a9880",
        word: "ID karyawan",
        en: "employee ID",
        vi: "thẻ/mã nhân viên",
        pos: "noun phrase",
        pronunciation_vi: "I-de kar-YA-wan",
        pronunciation_en: "EE-de kar-YA-wan",
      },
      {
        cell_id: "b16e640b-948a-428a-8bf7-86ab5417b2b5",
        word: "email kantor",
        en: "work email",
        vi: "email công ty",
        pos: "noun phrase",
        pronunciation_vi: "E-mail KAN-tor",
        pronunciation_en: "E-mail KAN-tor",
      },
      {
        cell_id: "7fefbbe1-6b47-48fc-9175-d2e0758dcd47",
        word: "mentor",
        en: "mentor",
        vi: "người hướng dẫn",
        pos: "noun",
        pronunciation_vi: "MEN-tor",
        pronunciation_en: "MEN-tor",
      },
      {
        cell_id: "2c416672-cea4-4d68-9298-eccd9a703454",
        word: "aturan kantor",
        en: "office rules",
        vi: "quy định văn phòng",
        pos: "noun phrase",
        pronunciation_vi: "a-TU-ran KAN-tor",
        pronunciation_en: "a-TOO-ran KAN-tor",
      },
    ],
    dialogue: [
      {
        cell_id: "cd297750-5c6c-4029-977d-0e7c4b616bfc",
        speaker: "Karyawan Baru",
        text: "Selamat pagi, Bu. Hari ini hari pertama saya.",
        vi: "Chào buổi sáng chị/cô. Hôm nay là ngày đầu tiên của tôi.",
        en: "Good morning, ma'am. Today is my first day.",
      },
      {
        cell_id: "f24f50ff-a93e-4ede-ac16-952527bc05d9",
        speaker: "HRD",
        text: "Selamat datang. Nanti Anda ikut orientasi kerja dulu.",
        vi: "Chào mừng. Lát nữa bạn tham gia buổi định hướng công việc trước.",
        en: "Welcome. Later you will join the work orientation first.",
      },
      {
        cell_id: "02bb9d14-2baa-417d-9f63-2d5fca768903",
        speaker: "Karyawan Baru",
        text: "Baik. Di mana saya bisa ambil ID karyawan?",
        vi: "Vâng. Tôi có thể lấy thẻ nhân viên ở đâu?",
        en: "Okay. Where can I pick up my employee ID?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya ikut ___ kerja dengan HRD.`",
        prompt_en: "Fill in: `Saya ikut ___ kerja dengan HRD.`",
        answer: "orientasi",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Email công ty của tôi chưa hoạt động.",
        prompt_en: "Translate to Indonesian: My work email is not active yet.",
        answer: "Email kantor saya belum aktif.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là thẻ/mã nhân viên?",
        prompt_en: "Which phrase means employee ID?",
        options: ["ID karyawan", "KTP kantor", "aturan kantor"],
        answer: "ID karyawan",
      },
    ],
  },
  {
    id: "indonesian_training_office_rules_probation",
    level: "B1",
    category: "workplace",
    title_vi: "Pelatihan, aturan kantor và masa percobaan",
    title_en: "Training, office rules and probation period",
    sentences: [
      {
        en: "Jadwal pelatihan saya sudah dikirim lewat email kantor.",
        vi: "Lịch đào tạo của tôi đã được gửi qua email công ty.",
        pronunciation_focus: [
          "JAD-wal pe-LA-ti-han SA-ya SU-dah di-KI-rim LE-wat E-mail KAN-tor - `jadwal pelatihan` = lịch đào tạo; `dikirim` = được gửi.",
          "Lỗi người Việt: nói `jadwal training` được trong văn phòng, nhưng `jadwal pelatihan` nghe chuẩn và tự nhiên hơn trong văn bản.",
          "Luyện: `Jadwal pelatihan sudah dikirim.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal pe-LA-ti-han SA-ya SOO-dah di-KEE-rim LE-wat E-mail KAN-tor - `jadwal pelatihan` = training schedule; `dikirim` = sent.",
          "VN-speaker trap: `jadwal training` is heard in offices, but `jadwal pelatihan` sounds more standard in writing.",
          "Drill: `Jadwal pelatihan sudah dikirim.`",
        ],
      },
      {
        en: "Saya perlu memahami aturan kantor sebelum mulai bekerja.",
        vi: "Tôi cần hiểu quy định văn phòng trước khi bắt đầu làm việc.",
        pronunciation_focus: [
          "SA-ya PER-lu me-ma-HA-mi a-TU-ran KAN-tor se-BE-lum MU-lai be-KER-ja - `memahami` = hiểu/nắm được; `aturan kantor` = quy định văn phòng.",
          "Lỗi người Việt: dùng `mengerti aturan` được trong nói thường, nhưng `memahami aturan` nghe chuyên nghiệp hơn.",
          "Luyện: `Saya perlu memahami aturan kantor.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo me-ma-HA-mi a-TOO-ran KAN-tor se-BE-lum MOO-lai be-KER-ja - `memahami` = understand/grasp; `aturan kantor` = office rules.",
          "VN-speaker trap: `mengerti aturan` works casually, but `memahami aturan` sounds more professional.",
          "Drill: `Saya perlu memahami aturan kantor.`",
        ],
      },
      {
        en: "Masa percobaan saya berlangsung selama tiga bulan.",
        vi: "Thời gian thử việc của tôi kéo dài ba tháng.",
        pronunciation_focus: [
          "MA-sa per-CO-ba-an SA-ya ber-LANG-sung se-LA-ma TI-ga BU-lan - `masa percobaan` = thời gian thử việc; `berlangsung` = kéo dài/diễn ra.",
          "Lỗi người Việt: dùng `masa coba` theo dịch ngắn. Cụm công sở chuẩn là `masa percobaan`.",
          "Luyện: `Masa percobaan saya tiga bulan.`",
        ],
        pronunciation_focus_en: [
          "MA-sa per-CHO-ba-an SA-ya ber-LANG-soong se-LA-ma TEE-ga BOO-lan - `masa percobaan` = probation period; `berlangsung` = lasts/takes place.",
          "VN-speaker trap: saying shortened `masa coba`. The standard office phrase is `masa percobaan`.",
          "Drill: `Masa percobaan saya tiga bulan.`",
        ],
      },
      {
        en: "Kalau ada pertanyaan, saya bisa tanya ke mentor dulu.",
        vi: "Nếu có câu hỏi, tôi có thể hỏi mentor trước.",
        pronunciation_focus: [
          "KA-lau A-da per-TA-nya-an, SA-ya BI-sa TA-nya ke MEN-tor DU-lu - `pertanyaan` = câu hỏi; `dulu` = trước đã.",
          "Lỗi người Việt: dùng `bertanya mentor` thiếu giới từ. Hỏi ai đó dùng `tanya ke mentor` trong nói thường, hoặc `bertanya kepada mentor` trang trọng.",
          "Luyện: `Saya bisa tanya ke mentor dulu.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da per-TA-nya-an, SA-ya BEE-sa TA-nya ke MEN-tor DOO-loo - `pertanyaan` = question; `dulu` = first.",
          "VN-speaker trap: saying `bertanya mentor` without a preposition. In speech use `tanya ke mentor`, or formal `bertanya kepada mentor`.",
          "Drill: `Saya bisa tanya ke mentor dulu.`",
        ],
      },
      {
        en: "Saya ingin tahu penilaian selama masa percobaan.",
        vi: "Tôi muốn biết cách đánh giá trong thời gian thử việc.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu pe-ni-LAI-an se-LA-ma MA-sa per-CO-ba-an - `penilaian` = đánh giá; `selama masa percobaan` = trong thời gian thử việc.",
          "Lỗi người Việt: dùng `nilai` khi cần danh từ quá trình đánh giá. `Nilai` = điểm/giá trị; `penilaian` = việc đánh giá.",
          "Luyện: `Saya ingin tahu penilaian selama masa percobaan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin TA-hoo pe-ni-LAI-an se-LA-ma MA-sa per-CHO-ba-an - `penilaian` = evaluation/assessment; `selama masa percobaan` = during probation.",
          "VN-speaker trap: using `nilai` when you need the evaluation process. `Nilai` = score/value; `penilaian` = assessment.",
          "Drill: `Saya ingin tahu penilaian selama masa percobaan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong onboarding ở Indonesia, nhân viên mới thường được giải thích aturan kantor, jam kerja, absensi, cuti, pelatihan, mentor, và masa percobaan. `Masa percobaan` phổ biến trong hợp đồng; nên hỏi rõ durasi, penilaian, dan siapa yang menjadi mentor.",
    cultural_notes_en:
      "During onboarding in Indonesia, new employees are usually told about office rules, working hours, attendance, leave, training, mentors, and probation. `Masa percobaan` is common in contracts; ask clearly about duration, evaluation, and who your mentor is.",
    tip_advice_vi:
      "Khi chưa rõ, hỏi mềm bằng `Boleh saya tanya...?`, `Saya ingin tahu...`, hoặc `Kalau ada pertanyaan, saya bisa tanya ke siapa?`. Tránh `kamu` với HRD/atasan; dùng `Bapak/Ibu` hoặc tên + Pak/Bu.",
    tip_advice_en:
      "When unsure, ask softly with `Boleh saya tanya...?`, `Saya ingin tahu...`, or `Kalau ada pertanyaan, saya bisa tanya ke siapa?`. Avoid `kamu` with HR/manager; use `Bapak/Ibu` or name + Pak/Bu.",
    vocabulary: [
      {
        cell_id: "68fe9999-c393-4387-91ab-992950427f84",
        word: "pelatihan",
        en: "training",
        vi: "đào tạo",
        pos: "noun",
        pronunciation_vi: "pe-LA-ti-han",
        pronunciation_en: "pe-LA-ti-han",
      },
      {
        cell_id: "2f9e94ee-96ac-4f7f-bb75-89d19a4ee1e3",
        word: "masa percobaan",
        en: "probation period",
        vi: "thời gian thử việc",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa per-CO-ba-an",
        pronunciation_en: "MA-sa per-CHO-ba-an",
      },
      {
        cell_id: "8b8d176b-d28b-4a73-857a-a971abce4d76",
        word: "penilaian",
        en: "evaluation / assessment",
        vi: "việc đánh giá",
        pos: "noun",
        pronunciation_vi: "pe-ni-LAI-an",
        pronunciation_en: "pe-ni-LAI-an",
      },
      {
        cell_id: "7922ae0d-367a-405b-a87e-0f97a15e751e",
        word: "memahami",
        en: "to understand / grasp",
        vi: "hiểu / nắm được",
        pos: "verb",
        pronunciation_vi: "me-ma-HA-mi",
        pronunciation_en: "me-ma-HA-mi",
      },
      {
        cell_id: "70e87d1c-13d4-4d07-97a9-11ee3b6685c9",
        word: "absensi",
        en: "attendance",
        vi: "chấm công / điểm danh",
        pos: "noun",
        pronunciation_vi: "ab-SEN-si",
        pronunciation_en: "ab-SEN-si",
      },
      {
        cell_id: "2a3561b2-d142-41c5-984a-561cbcf2292b",
        word: "jam kerja",
        en: "working hours",
        vi: "giờ làm việc",
        pos: "noun phrase",
        pronunciation_vi: "jam KER-ja",
        pronunciation_en: "jam KER-ja",
      },
    ],
    dialogue: [
      {
        cell_id: "867160cb-4b9a-4d2f-80e6-b7663c672d11",
        speaker: "Karyawan Baru",
        text: "Pak, jadwal pelatihan saya sudah dikirim lewat email?",
        vi: "Anh/chú ơi, lịch đào tạo của tôi đã được gửi qua email chưa?",
        en: "Sir, has my training schedule been sent by email?",
      },
      {
        cell_id: "922c73d2-c620-48b3-b4d8-7a8d7cc7fbcf",
        speaker: "Mentor",
        text: "Sudah. Tolong baca juga aturan kantor dan jam kerja.",
        vi: "Rồi. Làm ơn đọc cả quy định văn phòng và giờ làm việc.",
        en: "Yes. Please also read the office rules and working hours.",
      },
      {
        cell_id: "c036e4b4-2046-44e0-9a63-9e6e152e61b8",
        speaker: "Karyawan Baru",
        text: "Baik. Saya juga ingin tahu penilaian selama masa percobaan.",
        vi: "Vâng. Tôi cũng muốn biết cách đánh giá trong thời gian thử việc.",
        en: "Okay. I also want to know the evaluation during the probation period.",
      },
      {
        cell_id: "2367d196-afd3-4209-af50-8c07b28720d0",
        speaker: "Mentor",
        text: "Nanti kita bahas setelah sesi pelatihan pertama.",
        vi: "Lát nữa chúng ta bàn sau buổi đào tạo đầu tiên.",
        en: "We will discuss it later after the first training session.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Masa ___ saya berlangsung selama tiga bulan.`",
        prompt_en: "Fill in: `Masa ___ saya berlangsung selama tiga bulan.`",
        answer: "percobaan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi cần hiểu quy định văn phòng.",
        prompt_en: "Translate to Indonesian: I need to understand the office rules.",
        answer: "Saya perlu memahami aturan kantor.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `pelatihan`, `penilaian`, `jam kerja`.",
        prompt_en: "Match meanings: `pelatihan`, `penilaian`, `jam kerja`.",
        pairs: [
          ["pelatihan", "đào tạo / training"],
          ["penilaian", "đánh giá / evaluation"],
          ["jam kerja", "giờ làm việc / working hours"],
        ],
      },
    ],
  },
];
