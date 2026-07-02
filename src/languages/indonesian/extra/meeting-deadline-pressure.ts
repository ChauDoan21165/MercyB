// Meeting, Deadline & Work Pressure Indonesian (Vietnamese -> Indonesian study track).
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

export const meetingDeadlinePressureLessons: IndonesianLesson[] = [
  {
    id: "indonesian_meeting_deadline_priorities",
    level: "B1",
    category: "workplace",
    title_vi: "Họp ngắn, deadline và ưu tiên công việc",
    title_en: "Short meetings, deadlines and work priorities",
    sentences: [
      {
        en: "Kita perlu rapat singkat untuk membahas deadline proyek.",
        vi: "Chúng ta cần họp ngắn để bàn về deadline dự án.",
        pronunciation_focus: [
          "KI-ta PER-lu RA-pat SING-kat un-TUK mem-BA-has DED-lain PRO-yek - `rapat singkat` = họp ngắn; `membahas` = bàn/thảo luận.",
          "Lỗi người Việt: dùng `meeting` được trong văn phòng, nhưng `rapat` là từ Indonesia tự nhiên hơn trong câu đầy đủ.",
          "Luyện: `Kita perlu rapat singkat.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta PER-loo RA-pat SING-kat un-TOOK mem-BA-has DED-line PRO-yek - `rapat singkat` = short meeting; `membahas` = discuss.",
          "VN-speaker trap: `meeting` is heard in offices, but `rapat` is the natural Indonesian word in a full sentence.",
          "Drill: `Kita perlu rapat singkat.`",
        ],
      },
      {
        en: "Deadline laporan ini hari Jumat sore.",
        vi: "Deadline của báo cáo này là chiều thứ Sáu.",
        pronunciation_focus: [
          "DED-lain la-PO-ran I-ni HA-ri JUM-at SO-re - `laporan` = báo cáo; `Jumat sore` = chiều thứ Sáu.",
          "Lỗi người Việt: nói `deadline di Jumat`. Với hạn chót, nói gọn `deadline ... hari Jumat` hoặc `tenggatnya hari Jumat`.",
          "Luyện: `Deadline laporan ini hari Jumat.`",
        ],
        pronunciation_focus_en: [
          "DED-line la-PO-ran EE-ni HA-ri JUM-at SO-re - `laporan` = report; `Jumat sore` = Friday afternoon.",
          "VN-speaker trap: saying `deadline di Jumat`. For due dates, say `deadline ... hari Jumat` or `tenggatnya hari Jumat`.",
          "Drill: `Deadline laporan ini hari Jumat.`",
        ],
      },
      {
        en: "Mana prioritas kerja yang paling penting minggu ini?",
        vi: "Ưu tiên công việc nào là quan trọng nhất tuần này?",
        pronunciation_focus: [
          "MA-na pri-o-ri-TAS KER-ja yang PA-ling pen-TING MING-gu I-ni - `prioritas kerja` = ưu tiên công việc; `paling penting` = quan trọng nhất.",
          "Lỗi người Việt: dùng `utama` và `penting` lẫn nhau. `Prioritas utama` được, nhưng khi hỏi rõ dùng `mana yang paling penting?`.",
          "Luyện: `Mana yang paling penting minggu ini?`",
        ],
        pronunciation_focus_en: [
          "MA-na pri-o-ri-TAS KER-ja yang PA-ling pen-TING MING-goo EE-ni - `prioritas kerja` = work priority; `paling penting` = most important.",
          "VN-speaker trap: mixing `utama` and `penting`. `Prioritas utama` works, but for a clear question use `mana yang paling penting?`.",
          "Drill: `Mana yang paling penting minggu ini?`",
        ],
      },
      {
        en: "Pembagian tugas harus jelas sebelum kita mulai.",
        vi: "Việc phân chia nhiệm vụ phải rõ trước khi chúng ta bắt đầu.",
        pronunciation_focus: [
          "pem-BA-gi-an TU-gas HA-rus JE-las se-BE-lum KI-ta MU-lai - `pembagian tugas` = phân chia nhiệm vụ; `sebelum` = trước khi.",
          "Lỗi người Việt: nói `bagi kerja` trong bối cảnh chính thức hơi thô. Cụm chuyên nghiệp hơn là `pembagian tugas`.",
          "Luyện: `Pembagian tugas harus jelas.`",
        ],
        pronunciation_focus_en: [
          "pem-BA-gi-an TOO-gas HA-rus JE-las se-BE-lum KEE-ta MOO-lai - `pembagian tugas` = task division; `sebelum` = before.",
          "VN-speaker trap: saying `bagi kerja` in a formal setting. The more professional phrase is `pembagian tugas`.",
          "Drill: `Pembagian tugas harus jelas.`",
        ],
      },
      {
        en: "Saya akan kirim progres terbaru sebelum rapat.",
        vi: "Tôi sẽ gửi tiến độ mới nhất trước buổi họp.",
        pronunciation_focus: [
          "SA-ya A-kan KI-rim PRO-gres ter-BA-ru se-BE-lum RA-pat - `progres terbaru` = tiến độ mới nhất; `akan` = sẽ.",
          "Lỗi người Việt: dịch 'progress' thành `kemajuan` trong mọi câu. `Kemajuan` đúng, nhưng ở văn phòng `progres` rất phổ biến.",
          "Luyện: `Saya akan kirim progres terbaru.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan KEE-rim PRO-gres ter-BA-ru se-BE-lum RA-pat - `progres terbaru` = latest progress; `akan` = will.",
          "VN-speaker trap: translating progress as `kemajuan` everywhere. `Kemajuan` is correct, but office talk often uses `progres`.",
          "Drill: `Saya akan kirim progres terbaru.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường kerja Indonesia, từ mượn như `deadline`, `progres`, `update`, và `task` rất phổ biến, nhưng `rapat`, `tugas`, `prioritas`, và `pembagian tugas` vẫn nghe chuyên nghiệp. Khi deadline gần, nên nói rõ waktu, prioritas, siapa mengerjakan apa, dan progres terakhir.",
    cultural_notes_en:
      "In Indonesian workplaces, loanwords such as `deadline`, `progres`, `update`, and `task` are common, but `rapat`, `tugas`, `prioritas`, and `pembagian tugas` still sound professional. When a deadline is near, state the time, priorities, who does what, and the latest progress.",
    tip_advice_vi:
      "Khung cần nhớ: `rapat singkat`, `deadline laporan`, `prioritas kerja`, `pembagian tugas`, `progres terbaru`. Với đồng nghiệp, dùng `kita` nếu cả hai cùng chịu trách nhiệm.",
    tip_advice_en:
      "Useful frames: `rapat singkat`, `deadline laporan`, `prioritas kerja`, `pembagian tugas`, `progres terbaru`. With coworkers, use `kita` when both of you share responsibility.",
    vocabulary: [
      {
        word: "deadline",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun",
        pronunciation_vi: "DED-lain",
        pronunciation_en: "DED-line",
      },
      {
        word: "prioritas kerja",
        en: "work priority",
        vi: "ưu tiên công việc",
        pos: "noun phrase",
        pronunciation_vi: "pri-o-ri-TAS KER-ja",
        pronunciation_en: "pri-o-ri-TAS KER-ja",
      },
      {
        word: "rapat singkat",
        en: "short meeting",
        vi: "cuộc họp ngắn",
        pos: "noun phrase",
        pronunciation_vi: "RA-pat SING-kat",
        pronunciation_en: "RA-pat SING-kat",
      },
      {
        word: "pembagian tugas",
        en: "task division",
        vi: "phân chia nhiệm vụ",
        pos: "noun phrase",
        pronunciation_vi: "pem-BA-gi-an TU-gas",
        pronunciation_en: "pem-BA-gi-an TOO-gas",
      },
      {
        word: "progres terbaru",
        en: "latest progress",
        vi: "tiến độ mới nhất",
        pos: "noun phrase",
        pronunciation_vi: "PRO-gres ter-BA-ru",
        pronunciation_en: "PRO-gres ter-BA-ru",
      },
      {
        word: "laporan",
        en: "report",
        vi: "báo cáo",
        pos: "noun",
        pronunciation_vi: "la-PO-ran",
        pronunciation_en: "la-PO-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Manajer",
        text: "Kita perlu rapat singkat tentang deadline laporan.",
        vi: "Chúng ta cần họp ngắn về deadline báo cáo.",
        en: "We need a short meeting about the report deadline.",
      },
      {
        speaker: "Staf",
        text: "Baik. Saya akan kirim progres terbaru sebelum rapat.",
        vi: "Được. Tôi sẽ gửi tiến độ mới nhất trước buổi họp.",
        en: "Okay. I will send the latest progress before the meeting.",
      },
      {
        speaker: "Manajer",
        text: "Tolong siapkan juga daftar prioritas kerja minggu ini.",
        vi: "Làm ơn chuẩn bị cả danh sách ưu tiên công việc tuần này.",
        en: "Please also prepare the list of work priorities for this week.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kita perlu rapat ___ untuk membahas deadline.`",
        prompt_en: "Fill in: `Kita perlu rapat ___ untuk membahas deadline.`",
        answer: "singkat",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Việc phân chia nhiệm vụ phải rõ.",
        prompt_en: "Translate to Indonesian: The task division must be clear.",
        answer: "Pembagian tugas harus jelas.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là tiến độ mới nhất?",
        prompt_en: "Which phrase means latest progress?",
        options: ["progres terbaru", "rapat singkat", "tekanan kerja"],
        answer: "progres terbaru",
      },
    ],
  },
  {
    id: "indonesian_request_more_time_work_pressure",
    level: "B1",
    category: "workplace",
    title_vi: "Xin thêm thời gian và nói về áp lực công việc",
    title_en: "Asking for more time and talking about work pressure",
    sentences: [
      {
        en: "Apakah saya bisa minta waktu tambahan sampai besok pagi?",
        vi: "Tôi có thể xin thêm thời gian đến sáng mai không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya BI-sa MIN-ta WAK-tu tam-BA-han SAM-pai BE-sok PA-gi - `minta waktu tambahan` = xin thêm thời gian.",
          "Lỗi người Việt: nói `tambah waktu` nghe như thêm giờ chung chung. Khi xin gia hạn, dùng `minta waktu tambahan`.",
          "Luyện: `Saya bisa minta waktu tambahan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya BEE-sa MIN-ta WAK-tu tam-BA-han SAM-pai BE-sok PA-gi - `minta waktu tambahan` = ask for extra time.",
          "VN-speaker trap: saying `tambah waktu`, which sounds too general. For an extension, use `minta waktu tambahan`.",
          "Drill: `Saya bisa minta waktu tambahan?`",
        ],
      },
      {
        en: "Saya butuh tambahan waktu karena datanya belum lengkap.",
        vi: "Tôi cần thêm thời gian vì dữ liệu chưa đầy đủ.",
        pronunciation_focus: [
          "SA-ya BU-tuh tam-BA-han WAK-tu ka-RE-na DA-ta-nya be-LUM leng-KAP - `belum lengkap` = chưa đầy đủ; `datanya` = dữ liệu đó.",
          "Lỗi người Việt: dùng `tidak lengkap` khi ý là 'chưa'. Với tiến độ còn đang làm, `belum lengkap` tự nhiên hơn.",
          "Luyện: `Datanya belum lengkap.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tuh tam-BA-han WAK-tu ka-RE-na DA-ta-nya be-LOOM leng-KAP - `belum lengkap` = not complete yet; `datanya` = the data.",
          "VN-speaker trap: using `tidak lengkap` when you mean 'not yet'. For work in progress, `belum lengkap` is more natural.",
          "Drill: `Datanya belum lengkap.`",
        ],
      },
      {
        en: "Tekanan kerja minggu ini cukup tinggi.",
        vi: "Áp lực công việc tuần này khá cao.",
        pronunciation_focus: [
          "te-KA-nan KER-ja MING-gu I-ni CU-kup TING-gi - `tekanan kerja` = áp lực công việc; `cukup tinggi` = khá cao.",
          "Lỗi người Việt: dịch áp lực là `pressure` trong mọi câu. Trong tiếng Indonesia, `tekanan kerja` là cụm tự nhiên.",
          "Luyện: `Tekanan kerja cukup tinggi.`",
        ],
        pronunciation_focus_en: [
          "te-KA-nan KER-ja MING-goo EE-ni CHOO-kup TING-gi - `tekanan kerja` = work pressure; `cukup tinggi` = quite high.",
          "VN-speaker trap: using English `pressure` everywhere. Indonesian naturally says `tekanan kerja`.",
          "Drill: `Tekanan kerja cukup tinggi.`",
        ],
      },
      {
        en: "Saya khawatir kualitasnya turun kalau dipaksakan hari ini.",
        vi: "Tôi lo chất lượng sẽ giảm nếu bị ép hoàn thành hôm nay.",
        pronunciation_focus: [
          "SA-ya kha-WA-tir ku-a-li-TAS-nya TU-run KA-lau di-PAK-sa-kan HA-ri I-ni - `kualitasnya turun` = chất lượng giảm; `dipaksakan` = bị ép/gượng làm.",
          "Lỗi người Việt: nói thẳng `tidak bisa selesai` đôi khi nghe tiêu cực. Nêu rủi ro chất lượng giúp lý do chuyên nghiệp hơn.",
          "Luyện: `Saya khawatir kualitasnya turun.`",
        ],
        pronunciation_focus_en: [
          "SA-ya kha-WA-tir ku-a-li-TAS-nya TOO-run KA-lau di-PAK-sa-kan HA-ri EE-ni - `kualitasnya turun` = quality drops; `dipaksakan` = forced/rushed.",
          "VN-speaker trap: blunt `tidak bisa selesai` can sound negative. Mentioning quality risk makes the reason more professional.",
          "Drill: `Saya khawatir kualitasnya turun.`",
        ],
      },
      {
        en: "Kalau prioritasnya jelas, saya bisa fokus menyelesaikan yang paling penting.",
        vi: "Nếu ưu tiên rõ ràng, tôi có thể tập trung hoàn thành việc quan trọng nhất.",
        pronunciation_focus: [
          "KA-lau pri-o-ri-TAS-nya JE-las, SA-ya BI-sa FO-kus me-nye-le-SAI-kan yang PA-ling pen-TING - `fokus menyelesaikan` = tập trung hoàn thành.",
          "Lỗi người Việt: dùng `selesai` như ngoại động từ. Để nói 'hoàn thành cái gì', dùng `menyelesaikan`.",
          "Luyện: `Saya fokus menyelesaikan yang paling penting.`",
        ],
        pronunciation_focus_en: [
          "KA-lau pri-o-ri-TAS-nya JE-las, SA-ya BEE-sa FO-kus me-nye-le-SAI-kan yang PA-ling pen-TING - `fokus menyelesaikan` = focus on completing.",
          "VN-speaker trap: using `selesai` as a transitive verb. To say complete something, use `menyelesaikan`.",
          "Drill: `Saya fokus menyelesaikan yang paling penting.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi bị áp lực deadline ở Indonesia, cách nói chuyên nghiệp là không chỉ than khó. Hãy nêu alasan cụ thể, risiko, dan solusi: data belum lengkap, kualitas bisa turun, butuh waktu tambahan, atau perlu prioritas yang jelas. Cụm như `apakah saya bisa...`, `saya khawatir...`, và `kalau prioritasnya jelas...` giúp câu nghe lịch sự.",
    cultural_notes_en:
      "When under deadline pressure in Indonesia, professional wording should not only complain. State the reason, risk, and solution: data is incomplete, quality may drop, extra time is needed, or priorities need to be clear. Phrases like `apakah saya bisa...`, `saya khawatir...`, and `kalau prioritasnya jelas...` keep the tone polite.",
    tip_advice_vi:
      "Mẫu an toàn khi xin gia hạn: `Saya butuh tambahan waktu karena...` rồi thêm giải pháp: `Saya bisa kirim progres dulu` hoặc `Saya fokus menyelesaikan yang paling penting`.",
    tip_advice_en:
      "Safe extension pattern: `Saya butuh tambahan waktu karena...`, then add a solution: `Saya bisa kirim progres dulu` or `Saya fokus menyelesaikan yang paling penting`.",
    vocabulary: [
      {
        word: "minta waktu tambahan",
        en: "ask for extra time",
        vi: "xin thêm thời gian",
        pos: "verb phrase",
        pronunciation_vi: "MIN-ta WAK-tu tam-BA-han",
        pronunciation_en: "MIN-ta WAK-tu tam-BA-han",
      },
      {
        word: "tekanan kerja",
        en: "work pressure",
        vi: "áp lực công việc",
        pos: "noun phrase",
        pronunciation_vi: "te-KA-nan KER-ja",
        pronunciation_en: "te-KA-nan KER-ja",
      },
      {
        word: "belum lengkap",
        en: "not complete yet",
        vi: "chưa đầy đủ",
        pos: "adjective phrase",
        pronunciation_vi: "be-LUM leng-KAP",
        pronunciation_en: "be-LOOM leng-KAP",
      },
      {
        word: "dipaksakan",
        en: "forced / rushed",
        vi: "bị ép / làm gượng",
        pos: "verb",
        pronunciation_vi: "di-PAK-sa-kan",
        pronunciation_en: "di-PAK-sa-kan",
      },
      {
        word: "kualitasnya turun",
        en: "the quality drops",
        vi: "chất lượng giảm",
        pos: "phrase",
        pronunciation_vi: "ku-a-li-TAS-nya TU-run",
        pronunciation_en: "ku-a-li-TAS-nya TOO-run",
      },
      {
        word: "menyelesaikan",
        en: "to complete / finish something",
        vi: "hoàn thành việc gì",
        pos: "verb",
        pronunciation_vi: "me-nye-le-SAI-kan",
        pronunciation_en: "me-nye-le-SAI-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Staf",
        text: "Pak, apakah saya bisa minta waktu tambahan sampai besok pagi?",
        vi: "Anh/chú ơi, tôi có thể xin thêm thời gian đến sáng mai không?",
        en: "Sir, can I ask for extra time until tomorrow morning?",
      },
      {
        speaker: "Manajer",
        text: "Apa kendalanya?",
        vi: "Vướng mắc là gì?",
        en: "What is the obstacle?",
      },
      {
        speaker: "Staf",
        text: "Datanya belum lengkap, dan saya khawatir kualitasnya turun kalau dipaksakan hari ini.",
        vi: "Dữ liệu chưa đầy đủ, và tôi lo chất lượng giảm nếu ép hoàn thành hôm nay.",
        en: "The data is not complete yet, and I worry the quality will drop if it is forced today.",
      },
      {
        speaker: "Manajer",
        text: "Baik, kirim progres dulu sore ini.",
        vi: "Được, gửi tiến độ trước chiều nay.",
        en: "Okay, send the progress first this afternoon.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya butuh tambahan waktu karena datanya belum ___.`",
        prompt_en: "Fill in: `Saya butuh tambahan waktu karena datanya belum ___.`",
        answer: "lengkap",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Áp lực công việc tuần này khá cao.",
        prompt_en: "Translate to Indonesian: Work pressure this week is quite high.",
        answer: "Tekanan kerja minggu ini cukup tinggi.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `minta waktu tambahan`, `tekanan kerja`, `dipaksakan`.",
        prompt_en: "Match meanings: `minta waktu tambahan`, `tekanan kerja`, `dipaksakan`.",
        pairs: [
          ["minta waktu tambahan", "xin thêm thời gian / ask for extra time"],
          ["tekanan kerja", "áp lực công việc / work pressure"],
          ["dipaksakan", "bị ép / forced"],
        ],
      },
    ],
  },
];
