// Workplace HR Conflict Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for handling workplace conflict with HRD:
// mediation, warnings, coworkers, managers, written reports, and professional
// solutions. Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const workplaceHrConflictLessons: IndonesianLesson[] = [
  {
    id: "indonesian_workplace_hr_conflict",
    level: "B1",
    category: "workplace",
    title_vi: "Konflik kerja với HRD: nói chuyện chuyên nghiệp",
    title_en: "Workplace conflict with HR: speaking professionally",
    sentences: [
      {
        en: "Saya ingin membicarakan konflik kerja dengan HRD.",
        vi: "Tôi muốn trao đổi về mâu thuẫn công việc với phòng nhân sự.",
        pronunciation_focus: [
          "kon-FLIK KER-ja - `konflik kerja` = mâu thuẫn/xung đột công việc.",
          "`membicarakan` = trao đổi/bàn về; lịch sự hơn `ngomongin` trong công sở.",
          "`HRD` ở Indonesia thường đọc từng chữ: ha-er-de, không đọc liền như tiếng Anh.",
          "Luyện: `Saya ingin membicarakan konflik kerja dengan HRD.`",
        ],
        pronunciation_focus_en: [
          "kon-FLIK KER-ja - `konflik kerja` = workplace conflict.",
          "`membicarakan` = discuss/talk over; more professional than casual `ngomongin`.",
          "`HRD` in Indonesia is often read letter by letter: ha-er-de, not as one English word.",
          "Drill: `Saya ingin membicarakan konflik kerja dengan HRD.`",
        ],
      },
      {
        en: "Saya merasa komunikasi dengan rekan kerja saya kurang baik.",
        vi: "Tôi cảm thấy giao tiếp với đồng nghiệp của tôi chưa tốt.",
        pronunciation_focus: [
          "ko-mu-ni-KA-si - `komunikasi` = giao tiếp; dùng được trong văn phòng.",
          "`rekan kerja` = đồng nghiệp; trang trọng hơn `teman kantor`.",
          "`kurang baik` = chưa tốt/không ổn lắm; mềm hơn nói thẳng `buruk`.",
          "Luyện: `Komunikasi kami kurang baik.`",
        ],
        pronunciation_focus_en: [
          "ko-mu-ni-KA-si - `komunikasi` = communication; natural office wording.",
          "`rekan kerja` = coworker/colleague; more formal than `teman kantor`.",
          "`kurang baik` = not very good; softer than blunt `buruk`.",
          "Drill: `Komunikasi kami kurang baik.`",
        ],
      },
      {
        en: "Atasan saya menyarankan mediasi supaya masalahnya jelas.",
        vi: "Cấp trên của tôi đề nghị hòa giải để vấn đề rõ ràng.",
        pronunciation_focus: [
          "a-TA-san - `atasan` = cấp trên/sếp; thường dùng trong HR và công sở.",
          "`menyarankan mediasi` = đề nghị hòa giải; `mediasi` là từ chính thức.",
          "`supaya` = để/nhằm; giống `agar`, dùng tự nhiên trong lời giải thích.",
          "Luyện: `Atasan menyarankan mediasi.`",
        ],
        pronunciation_focus_en: [
          "a-TA-san - `atasan` = superior/manager; common in HR and office contexts.",
          "`menyarankan mediasi` = recommend mediation; `mediasi` is the formal term.",
          "`supaya` = so that/in order to; similar to `agar`, natural in explanations.",
          "Drill: `Atasan menyarankan mediasi.`",
        ],
      },
      {
        en: "Saya tidak ingin menyalahkan siapa pun, saya ingin mencari solusi profesional.",
        vi: "Tôi không muốn đổ lỗi cho ai cả, tôi muốn tìm giải pháp chuyên nghiệp.",
        pronunciation_focus: [
          "me-nya-LAH-kan - `menyalahkan` = đổ lỗi; âm `ny` giống nh nhẹ.",
          "`siapa pun` = bất kỳ ai/ai cả; viết tách trong cụm này.",
          "`solusi profesional` = giải pháp chuyên nghiệp; cụm mượn quốc tế rất dễ nhận ra.",
          "Luyện: `Saya ingin mencari solusi profesional.`",
        ],
        pronunciation_focus_en: [
          "me-nya-LAH-kan - `menyalahkan` = blame; `ny` is a soft ny sound.",
          "`siapa pun` = anyone/anybody; written separately in this phrase.",
          "`solusi profesional` = professional solution; an easy international loan phrase.",
          "Drill: `Saya ingin mencari solusi profesional.`",
        ],
      },
      {
        en: "HRD meminta kami menjelaskan kronologi kejadian secara tertulis.",
        vi: "HR yêu cầu chúng tôi giải thích trình tự sự việc bằng văn bản.",
        pronunciation_focus: [
          "kro-no-lo-GI ke-JA-di-an - `kronologi kejadian` = trình tự/diễn biến sự việc.",
          "`secara tertulis` = bằng văn bản; quan trọng khi báo cáo cho HRD.",
          "Lỗi người Việt: dịch `viết xuống` thành `tulis turun`. Cụm đúng là `secara tertulis`.",
          "Luyện: `Jelaskan kronologi kejadian secara tertulis.`",
        ],
        pronunciation_focus_en: [
          "kro-no-lo-GI ke-JA-di-an - `kronologi kejadian` = chronology of events.",
          "`secara tertulis` = in writing; important for HR reports.",
          "VN-speaker trap: translating 'write down' as `tulis turun`. Use `secara tertulis`.",
          "Drill: `Jelaskan kronologi kejadian secara tertulis.`",
        ],
      },
      {
        en: "Saya menerima teguran lisan dari atasan minggu lalu.",
        vi: "Tuần trước tôi nhận nhắc nhở miệng từ cấp trên.",
        pronunciation_focus: [
          "te-GU-ran LI-san - `teguran lisan` = nhắc nhở/cảnh cáo bằng lời.",
          "`menerima teguran` = nhận nhắc nhở; dùng được khi kể sự việc với HRD.",
          "`minggu lalu` = tuần trước; `lalu` đứng sau danh từ thời gian.",
          "Luyện: `Saya menerima teguran lisan.`",
        ],
        pronunciation_focus_en: [
          "te-GU-ran LEE-san - `teguran lisan` = verbal warning/reprimand.",
          "`menerima teguran` = receive a warning; appropriate when explaining to HR.",
          "`minggu lalu` = last week; `lalu` follows the time noun.",
          "Drill: `Saya menerima teguran lisan.`",
        ],
      },
      {
        en: "Apakah surat peringatan ini masuk ke catatan karyawan?",
        vi: "Thư cảnh cáo này có được đưa vào hồ sơ nhân viên không?",
        pronunciation_focus: [
          "SU-rat pe-RI-ngat-an - `surat peringatan` = thư cảnh cáo/cảnh báo chính thức.",
          "`catatan karyawan` = hồ sơ/ghi chú nhân viên; không phải `buku pekerja`.",
          "`apakah` mở câu hỏi trang trọng hơn câu nói thường.",
          "Luyện: `Apakah ini masuk ke catatan karyawan?`",
        ],
        pronunciation_focus_en: [
          "SU-rat pe-REE-ngat-an - `surat peringatan` = formal warning letter.",
          "`catatan karyawan` = employee record; not `buku pekerja`.",
          "`apakah` opens a more formal yes/no question.",
          "Drill: `Apakah ini masuk ke catatan karyawan?`",
        ],
      },
      {
        en: "Saya mohon kesempatan untuk memperbaiki cara kerja saya.",
        vi: "Tôi xin cơ hội để cải thiện cách làm việc của tôi.",
        pronunciation_focus: [
          "MO-hon ke-sem-PAT-an - `mohon kesempatan` = xin cơ hội; rất lịch sự.",
          "`memperbaiki` = cải thiện/sửa cho tốt hơn; gốc `baik` = tốt.",
          "Lỗi người Việt: nói `kasih saya chance` quá suồng sã. Dùng `mohon kesempatan` với HRD.",
          "Luyện: `Saya mohon kesempatan untuk memperbaiki cara kerja saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ke-sem-PAT-an - `mohon kesempatan` = request an opportunity; very polite.",
          "`memperbaiki` = improve/fix; root `baik` = good.",
          "VN-speaker trap: saying casual `kasih saya chance`. Use `mohon kesempatan` with HR.",
          "Drill: `Saya mohon kesempatan untuk memperbaiki cara kerja saya.`",
        ],
      },
      {
        en: "Kami sepakat membuat batasan kerja yang lebih jelas.",
        vi: "Chúng tôi đồng ý đặt ranh giới công việc rõ ràng hơn.",
        pronunciation_focus: [
          "se-PA-kat - `sepakat` = thống nhất/đồng ý sau thảo luận.",
          "`batasan kerja` = ranh giới/giới hạn công việc; dùng khi phân vai hoặc trách nhiệm.",
          "`lebih jelas` = rõ hơn; tính từ đứng sau danh từ hoặc sau `lebih`.",
          "Luyện: `Kami sepakat membuat batasan kerja.`",
        ],
        pronunciation_focus_en: [
          "se-PA-kat - `sepakat` = agree/reach agreement after discussion.",
          "`batasan kerja` = work boundaries; useful for roles and responsibilities.",
          "`lebih jelas` = clearer; adjectives come after nouns or after `lebih`.",
          "Drill: `Kami sepakat membuat batasan kerja.`",
        ],
      },
      {
        en: "Mohon konfirmasi hasil mediasi melalui email.",
        vi: "Xin xác nhận kết quả hòa giải qua email.",
        pronunciation_focus: [
          "kon-fir-MA-si HA-sil me-di-A-si - `hasil mediasi` = kết quả buổi hòa giải.",
          "`melalui email` = qua email; cách nói công sở tự nhiên.",
          "`mohon konfirmasi` lịch sự và chắc hơn `tolong jawab`.",
          "Luyện: `Mohon konfirmasi hasil mediasi.`",
        ],
        pronunciation_focus_en: [
          "kon-fir-MA-si HA-sil me-di-A-si - `hasil mediasi` = mediation result.",
          "`melalui email` = by/through email; natural office wording.",
          "`mohon konfirmasi` is more professional than `tolong jawab`.",
          "Drill: `Mohon konfirmasi hasil mediasi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều công ty Indonesia, xung đột công việc nên được xử lý theo chuỗi: nói với `atasan`, ghi `kronologi kejadian`, mời `HRD` nếu cần, rồi làm `mediasi`. Giọng điệu quan trọng: tránh đổ lỗi cá nhân, dùng từ như `komunikasi`, `solusi`, `profesional`, `sepakat`, `batasan kerja`. `Teguran lisan` thường nhẹ hơn `surat peringatan` (SP), nhưng mỗi công ty có quy định nội bộ khác nhau. Khi vấn đề nhạy cảm, nên xin xác nhận bằng email để có hồ sơ rõ ràng.",
    cultural_notes_en:
      "In many Indonesian companies, workplace conflict is handled in stages: speak with the `atasan`, write a `kronologi kejadian`, involve `HRD` if needed, then hold `mediasi`. Tone matters: avoid personal blame and use words like `komunikasi`, `solusi`, `profesional`, `sepakat`, and `batasan kerja`. A `teguran lisan` is usually lighter than a `surat peringatan` (SP), but each company has its own internal rules. For sensitive issues, ask for email confirmation so the record is clear.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong xung đột công sở, đừng mở đầu bằng `dia salah` hoặc `saya marah`. Mẫu an toàn là: `Saya ingin membicarakan konflik kerja`, rồi mô tả `kronologi kejadian`, nói cảm nhận bằng `saya merasa...`, và đề xuất `solusi profesional`. Với HRD, dùng `saya`, `Bapak/Ibu`, `mohon`, `apakah`, `secara tertulis`; tránh `aku/kamu` và tiếng lóng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in workplace conflict, do not open with `dia salah` or `saya marah`. A safer frame is: `Saya ingin membicarakan konflik kerja`, then describe the `kronologi kejadian`, express impact with `saya merasa...`, and propose a `solusi profesional`. With HRD, use `saya`, `Bapak/Ibu`, `mohon`, `apakah`, and `secara tertulis`; avoid `aku/kamu` and slang.",
    vocabulary: [
      {
        word: "konflik kerja",
        en: "workplace conflict",
        vi: "mâu thuẫn công việc",
        pos: "noun phrase",
        pronunciation_vi: "kon-FLIK KER-ja",
        pronunciation_en: "kon-FLIK KER-ja",
      },
      {
        word: "HRD",
        en: "human resources department",
        vi: "phòng nhân sự",
        pos: "noun",
        pronunciation_vi: "ha-er-DE",
        pronunciation_en: "ha-er-DAY",
      },
      {
        word: "mediasi",
        en: "mediation",
        vi: "hòa giải",
        pos: "noun",
        pronunciation_vi: "me-di-A-si",
        pronunciation_en: "me-dee-A-see",
      },
      {
        word: "teguran",
        en: "warning / reprimand",
        vi: "nhắc nhở / cảnh cáo",
        pos: "noun",
        pronunciation_vi: "te-GU-ran",
        pronunciation_en: "te-GOO-ran",
      },
      {
        word: "surat peringatan",
        en: "warning letter",
        vi: "thư cảnh cáo",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat pe-RI-ngat-an",
        pronunciation_en: "SOO-rat pe-REE-ngat-an",
      },
      {
        word: "rekan kerja",
        en: "coworker / colleague",
        vi: "đồng nghiệp",
        pos: "noun phrase",
        pronunciation_vi: "re-KAN KER-ja",
        pronunciation_en: "re-KAN KER-ja",
      },
      {
        word: "atasan",
        en: "superior / manager",
        vi: "cấp trên / sếp",
        pos: "noun",
        pronunciation_vi: "a-TA-san",
        pronunciation_en: "a-TA-san",
      },
      {
        word: "kronologi kejadian",
        en: "chronology of events",
        vi: "diễn biến sự việc",
        pos: "noun phrase",
        pronunciation_vi: "kro-no-lo-GI ke-JA-di-an",
        pronunciation_en: "kro-no-lo-GI ke-JA-dee-an",
      },
      {
        word: "solusi profesional",
        en: "professional solution",
        vi: "giải pháp chuyên nghiệp",
        pos: "noun phrase",
        pronunciation_vi: "so-LU-si pro-fe-si-o-NAL",
        pronunciation_en: "so-LOO-see pro-fe-see-o-NAL",
      },
      {
        word: "secara tertulis",
        en: "in writing",
        vi: "bằng văn bản",
        pos: "adverbial phrase",
        pronunciation_vi: "se-CA-ra ter-TU-lis",
        pronunciation_en: "se-CHA-ra ter-TOO-lis",
      },
    ],
    dialogue: [
      {
        speaker: "Karyawan",
        text: "Selamat pagi, Bu. Saya ingin membicarakan konflik kerja dengan rekan saya.",
        vi: "Chào buổi sáng chị. Tôi muốn trao đổi về mâu thuẫn công việc với đồng nghiệp của tôi.",
        en: "Good morning, ma'am. I would like to discuss a workplace conflict with my coworker.",
      },
      {
        speaker: "HRD",
        text: "Baik. Bisa jelaskan kronologi kejadiannya secara tertulis?",
        vi: "Được. Anh/chị có thể giải thích diễn biến sự việc bằng văn bản không?",
        en: "All right. Can you explain the chronology of events in writing?",
      },
      {
        speaker: "Karyawan",
        text: "Bisa, Bu. Saya tidak ingin menyalahkan siapa pun, saya ingin mencari solusi profesional.",
        vi: "Được ạ. Tôi không muốn đổ lỗi cho ai cả, tôi muốn tìm giải pháp chuyên nghiệp.",
        en: "Yes, ma'am. I do not want to blame anyone; I want to find a professional solution.",
      },
      {
        speaker: "HRD",
        text: "Kalau begitu, kami akan mengatur mediasi dengan atasan dan rekan kerja Anda.",
        vi: "Vậy thì chúng tôi sẽ sắp xếp buổi hòa giải với cấp trên và đồng nghiệp của anh/chị.",
        en: "In that case, we will arrange mediation with your manager and coworker.",
      },
      {
        speaker: "Karyawan",
        text: "Terima kasih. Mohon hasil mediasi dikonfirmasi melalui email.",
        vi: "Cảm ơn. Xin xác nhận kết quả hòa giải qua email.",
        en: "Thank you. Please confirm the mediation result by email.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ công sở còn thiếu:",
        instruction_en: "Fill in the missing workplace phrase:",
        items: [
          {
            prompt: "Saya ingin membicarakan ___ kerja dengan HRD.",
            answer: "konflik",
            options: ["konflik", "kantin", "cuti"],
          },
          {
            prompt: "HRD meminta kronologi kejadian secara ___.",
            answer: "tertulis",
            options: ["tertulis", "terlambat", "terbalik"],
          },
          {
            prompt: "Saya ingin mencari solusi ___.",
            answer: "profesional",
            options: ["profesional", "pribadi", "panas"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "HRD", answer: "phòng nhân sự" },
          { prompt: "mediasi", answer: "hòa giải" },
          { prompt: "teguran lisan", answer: "nhắc nhở bằng lời" },
          { prompt: "surat peringatan", answer: "thư cảnh cáo" },
          { prompt: "rekan kerja", answer: "đồng nghiệp" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn trao đổi về mâu thuẫn công việc với HR.",
            answer: "Saya ingin membicarakan konflik kerja dengan HRD.",
          },
          {
            prompt: "Tôi không muốn đổ lỗi cho ai cả.",
            answer: "Saya tidak ingin menyalahkan siapa pun.",
          },
          {
            prompt: "Xin xác nhận kết quả hòa giải qua email.",
            answer: "Mohon konfirmasi hasil mediasi melalui email.",
          },
        ],
      },
    ],
  },
];

export default workplaceHrConflictLessons;
