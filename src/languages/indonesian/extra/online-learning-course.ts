// Online Learning Course Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_online_learning_course",
    level: "A2",
    category: "education",
    title_vi: "Học online: khóa học, bài tập và webinar",
    title_en: "Online learning: courses, assignments and webinars",
    sentences: [
      {
        en: "Saya ikut kelas online setiap malam.",
        vi: "Tôi tham gia lớp học online mỗi tối.",
        pronunciation_focus: [
          "SA-ya I-kut KE-las ON-lain se-TI-ap MA-lam - `ikut` = tham gia; `kelas online` = lớp online.",
          "Lỗi người Việt: nói `masuk kelas online` không sai khi vào lớp, nhưng `ikut kelas online` tự nhiên hơn cho việc tham gia khóa học.",
          "Luyện: `Saya ikut kelas online setiap malam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-kut KE-las ON-line se-TEE-ap MA-lam - `ikut` = join/participate; `kelas online` = online class.",
          "VN-speaker trap: `masuk kelas online` works for entering the class, but `ikut kelas online` is more natural for participating in a course.",
          "Drill: `Saya ikut kelas online setiap malam.`",
        ],
      },
      {
        en: "Kursus ini cocok untuk pemula.",
        vi: "Khóa học này phù hợp cho người mới bắt đầu.",
        pronunciation_focus: [
          "KUR-sus I-ni CO-cok un-TUK pe-MU-la - `kursus` = khóa học; `cocok` = phù hợp; `pemula` = người mới.",
          "Lỗi người Việt: đọc `cocok` như ko-kok. Chữ `c` trong tiếng Indonesia = 'ch': CHO-chok.",
          "Luyện: `Kursus ini cocok untuk pemula.`",
        ],
        pronunciation_focus_en: [
          "KUR-sus I-ni CHO-chok un-TUK pe-MU-la - `kursus` = course; `cocok` = suitable; `pemula` = beginner.",
          "VN-speaker trap: reading `cocok` as ko-kok. Indonesian `c` = 'ch': CHO-chok.",
          "Drill: `Kursus ini cocok untuk pemula.`",
        ],
      },
      {
        en: "Materi video bisa ditonton ulang.",
        vi: "Tài liệu video có thể xem lại.",
        pronunciation_focus: [
          "ma-TE-ri VI-de-o BI-sa di-TON-ton U-lang - `materi video` = nội dung/tài liệu video; `ditonton ulang` = được xem lại.",
          "Lỗi người Việt: nói `lihat ulang video`. Đối với video/phim, động từ tự nhiên là `tonton`, bị động `ditonton`.",
          "Luyện: `Materi video bisa ditonton ulang.`",
        ],
        pronunciation_focus_en: [
          "ma-TE-ri VEE-de-o BI-sa di-TON-ton U-lang - `materi video` = video material/content; `ditonton ulang` = watched again.",
          "VN-speaker trap: saying `lihat ulang video`. For videos/films, the natural verb is `tonton`, passive `ditonton`.",
          "Drill: `Materi video bisa ditonton ulang.`",
        ],
      },
      {
        en: "Tugas minggu ini harus dikumpulkan hari Jumat.",
        vi: "Bài tập tuần này phải nộp vào thứ Sáu.",
        pronunciation_focus: [
          "TU-gas MING-gu I-ni HA-rus di-KUM-pul-kan HA-ri JUM-at - `tugas` = bài tập/nhiệm vụ; `dikumpulkan` = được nộp.",
          "Lỗi người Việt: dùng chủ động `mengumpulkan` khi nhấn vào bài được nộp. Lịch học thường dùng bị động `tugas dikumpulkan`.",
          "Luyện: `Tugas harus dikumpulkan hari Jumat.`",
        ],
        pronunciation_focus_en: [
          "TU-gas MING-goo I-ni HA-rus di-KUM-pul-kan HA-ri JUM-at - `tugas` = assignment/task; `dikumpulkan` = submitted/turned in.",
          "VN-speaker trap: using active `mengumpulkan` when the assignment is the focus. Course schedules often use passive `tugas dikumpulkan`.",
          "Drill: `Tugas harus dikumpulkan hari Jumat.`",
        ],
      },
      {
        en: "Kalau lulus, peserta mendapat sertifikat digital.",
        vi: "Nếu đạt, học viên nhận chứng chỉ kỹ thuật số.",
        pronunciation_focus: [
          "KA-lau LU-lus, pe-SER-ta men-DA-pat ser-ti-fi-KAT di-gi-TAL - `lulus` = đạt/đỗ; `peserta` = người tham gia; `sertifikat` = chứng chỉ.",
          "Lỗi người Việt: nhầm `lulus` với `selesai`. `Selesai` = xong; `lulus` = đạt yêu cầu/đỗ.",
          "Luyện: `Kalau lulus, peserta mendapat sertifikat digital.`",
        ],
        pronunciation_focus_en: [
          "KA-lau LU-lus, pe-SER-ta men-DA-pat ser-ti-fi-KAT di-gi-TAL - `lulus` = pass; `peserta` = participant; `sertifikat` = certificate.",
          "VN-speaker trap: confusing `lulus` with `selesai`. `Selesai` = finished; `lulus` = passed/met requirements.",
          "Drill: `Kalau lulus, peserta mendapat sertifikat digital.`",
        ],
      },
      {
        en: "Saya bertanya di forum diskusi.",
        vi: "Tôi đặt câu hỏi trong diễn đàn thảo luận.",
        pronunciation_focus: [
          "SA-ya ber-TA-nya di FO-rum dis-KU-si - `bertanya` = hỏi; `forum diskusi` = diễn đàn thảo luận.",
          "Lỗi người Việt: nói `tanya di forum` được trong chat, nhưng câu đầy đủ học thuật hơn là `bertanya di forum diskusi`.",
          "Luyện: `Saya bertanya di forum diskusi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-TA-nya di FO-rum dis-KU-see - `bertanya` = ask; `forum diskusi` = discussion forum.",
          "VN-speaker trap: `tanya di forum` works in chat, but the fuller academic phrase is `bertanya di forum diskusi`.",
          "Drill: `Saya bertanya di forum diskusi.`",
        ],
      },
      {
        en: "Webinar besok mulai jam tujuh malam.",
        vi: "Webinar ngày mai bắt đầu lúc bảy giờ tối.",
        pronunciation_focus: [
          "WE-bi-nar BE-sok MU-lai jam TU-juh MA-lam - `webinar` = hội thảo online; `mulai` = bắt đầu.",
          "Lỗi người Việt: dùng `pagi/malam` sai khi nói giờ. `jam tujuh malam` = 7 giờ tối; `jam tujuh pagi` = 7 giờ sáng.",
          "Luyện: `Webinar besok mulai jam tujuh malam.`",
        ],
        pronunciation_focus_en: [
          "WE-bi-nar BE-sok MU-lai jam TU-juh MA-lam - `webinar` = online seminar; `mulai` = starts.",
          "VN-speaker trap: misusing `pagi/malam` with clock times. `jam tujuh malam` = 7 p.m.; `jam tujuh pagi` = 7 a.m.",
          "Drill: `Webinar besok mulai jam tujuh malam.`",
        ],
      },
      {
        en: "Saya membuat jadwal belajar sendiri.",
        vi: "Tôi tự lập lịch học cho mình.",
        pronunciation_focus: [
          "SA-ya mem-BU-at JAD-wal be-LA-jar sen-DI-ri - `jadwal belajar` = lịch học; `sendiri` = tự/một mình.",
          "Lỗi người Việt: đặt tính từ trước danh từ kiểu tiếng Anh. Đúng là `jadwal belajar`, không phải `belajar jadwal`.",
          "Luyện: `Saya membuat jadwal belajar sendiri.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BU-at JAD-wal be-LA-jar sen-DI-ri - `jadwal belajar` = study schedule; `sendiri` = by myself.",
          "VN-speaker trap: using English-style adjective order. Correct: `jadwal belajar`, not `belajar jadwal`.",
          "Drill: `Saya membuat jadwal belajar sendiri.`",
        ],
      },
      {
        en: "Koneksi internet saya kurang stabil.",
        vi: "Kết nối internet của tôi không ổn định lắm.",
        pronunciation_focus: [
          "ko-NEK-si IN-ter-net SA-ya KU-rang STA-bil - `koneksi` = kết nối; `kurang stabil` = chưa ổn định/không ổn lắm.",
          "Lỗi người Việt: nói `internet saya jelek` nghe hơi cộc. `Koneksi saya kurang stabil` lịch sự và cụ thể hơn.",
          "Luyện: `Koneksi internet saya kurang stabil.`",
        ],
        pronunciation_focus_en: [
          "ko-NEK-see IN-ter-net SA-ya KU-rang STA-bil - `koneksi` = connection; `kurang stabil` = not very stable.",
          "VN-speaker trap: saying blunt `internet saya jelek`. `Koneksi saya kurang stabil` is more polite and specific.",
          "Drill: `Koneksi internet saya kurang stabil.`",
        ],
      },
      {
        en: "Saya belum bisa mengakses materi kursus.",
        vi: "Tôi chưa truy cập được tài liệu khóa học.",
        pronunciation_focus: [
          "SA-ya be-LUM BI-sa meng-AK-ses ma-TE-ri KUR-sus - `belum bisa` = chưa thể; `mengakses` = truy cập.",
          "Lỗi người Việt: dùng `tidak bisa` khi ý là tạm thời chưa được. `Belum bisa` mềm hơn và phù hợp khi xin hỗ trợ.",
          "Luyện: `Saya belum bisa mengakses materi kursus.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM BI-sa meng-AK-ses ma-TE-ri KUR-sus - `belum bisa` = cannot yet; `mengakses` = access.",
          "VN-speaker trap: using `tidak bisa` when the issue may be temporary. `Belum bisa` is softer and fits support requests.",
          "Drill: `Saya belum bisa mengakses materi kursus.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Các khóa học online ở Indonesia thường dùng các từ mượn tiếng Anh như `webinar`, `forum`, `sertifikat digital`, nhưng cấu trúc câu vẫn là Bahasa Indonesia. Nhiều khóa có `materi video`, `tugas`, forum diskusi, jadwal belajar, và chứng chỉ sau khi `lulus`. Trong lớp online, học viên thường gọi giảng viên là `Pak`/`Bu` hoặc `Kak` tùy môi trường; khi hỏi hỗ trợ kỹ thuật, dùng giọng lịch sự như `Saya belum bisa mengakses...` thay vì đổ lỗi.",
    cultural_notes_en:
      "Online courses in Indonesia often use English loanwords such as `webinar`, `forum`, and `sertifikat digital`, but the sentence structure remains Indonesian. Many courses include video material, assignments, discussion forums, a study schedule, and a certificate after you pass. In online classes, learners often address instructors as `Pak`/`Bu` or `Kak` depending on the setting; for tech support, use polite wording like `Saya belum bisa mengakses...` rather than blaming.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm online-learning: `kelas online`, `ikut kursus`, `materi video`, `tugas dikumpulkan`, `sertifikat digital`, `forum diskusi`, `webinar`, `jadwal belajar`. Với lỗi kỹ thuật hoặc việc chưa xong, dùng `belum`: `belum bisa mengakses`, `tugas belum selesai`, `sertifikat belum keluar`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn online-learning chunks: `kelas online`, `ikut kursus`, `materi video`, `tugas dikumpulkan`, `sertifikat digital`, `forum diskusi`, `webinar`, `jadwal belajar`. For tech issues or unfinished actions, use `belum`: `belum bisa mengakses`, `tugas belum selesai`, `sertifikat belum keluar`.",
    vocabulary: [
      {
        word: "kelas online",
        en: "online class",
        vi: "lớp học online",
        pos: "noun phrase",
        pronunciation_vi: "KE-las ON-lain",
        pronunciation_en: "KEH-las ON-line",
      },
      {
        word: "kursus",
        en: "course",
        vi: "khóa học",
        pos: "noun",
        pronunciation_vi: "KUR-sus",
        pronunciation_en: "KUR-soos",
      },
      {
        word: "materi video",
        en: "video material",
        vi: "tài liệu video",
        pos: "noun phrase",
        pronunciation_vi: "ma-TE-ri VI-de-o",
        pronunciation_en: "ma-TEH-ri VEE-de-o",
      },
      {
        word: "tugas",
        en: "assignment / task",
        vi: "bài tập / nhiệm vụ",
        pos: "noun",
        pronunciation_vi: "TU-gas",
        pronunciation_en: "TOO-gas",
      },
      {
        word: "sertifikat",
        en: "certificate",
        vi: "chứng chỉ",
        pos: "noun",
        pronunciation_vi: "ser-ti-fi-KAT",
        pronunciation_en: "ser-ti-fi-KAT",
      },
      {
        word: "forum diskusi",
        en: "discussion forum",
        vi: "diễn đàn thảo luận",
        pos: "noun phrase",
        pronunciation_vi: "FO-rum dis-KU-si",
        pronunciation_en: "FO-rum dis-KOO-see",
      },
      {
        word: "webinar",
        en: "webinar / online seminar",
        vi: "hội thảo online",
        pos: "noun",
        pronunciation_vi: "WE-bi-nar",
        pronunciation_en: "WE-bi-nar",
      },
      {
        word: "jadwal belajar",
        en: "study schedule",
        vi: "lịch học",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal be-LA-jar",
        pronunciation_en: "JAD-wal be-LA-jar",
      },
      {
        word: "dikumpulkan",
        en: "submitted / turned in",
        vi: "được nộp",
        pos: "passive verb",
        pronunciation_vi: "di-KUM-pul-kan",
        pronunciation_en: "dee-KUM-pool-kan",
      },
      {
        word: "mengakses",
        en: "to access",
        vi: "truy cập",
        pos: "verb",
        pronunciation_vi: "meng-AK-ses",
        pronunciation_en: "meng-AK-ses",
      },
    ],
    dialogue: [
      {
        speaker: "Peserta",
        text: "Kak, saya belum bisa mengakses materi video.",
        vi: "Anh/chị ơi, tôi chưa truy cập được tài liệu video.",
        en: "Hi, I still cannot access the video material.",
      },
      {
        speaker: "Admin",
        text: "Baik. Apakah akun kursusnya sudah aktif?",
        vi: "Được. Tài khoản khóa học đã kích hoạt chưa?",
        en: "Okay. Is the course account already active?",
      },
      {
        speaker: "Peserta",
        text: "Sudah aktif, tapi koneksi internet saya kurang stabil.",
        vi: "Đã kích hoạt, nhưng kết nối internet của tôi không ổn định lắm.",
        en: "It is active, but my internet connection is not very stable.",
      },
      {
        speaker: "Admin",
        text: "Coba tonton ulang nanti. Tugas dikumpulkan hari Jumat.",
        vi: "Thử xem lại sau nhé. Bài tập nộp vào thứ Sáu.",
        en: "Try watching it again later. The assignment is submitted on Friday.",
      },
      {
        speaker: "Peserta",
        text: "Baik. Webinar besok mulai jam tujuh malam, ya?",
        vi: "Được. Webinar ngày mai bắt đầu lúc bảy giờ tối đúng không?",
        en: "Okay. The webinar tomorrow starts at seven in the evening, right?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Materi video bisa ditonton ____.`",
        prompt_en: "Fill in the blank: `Materi video bisa ditonton ____.`",
        answer: "ulang",
        explanation_vi: "`ditonton ulang` = được xem lại.",
        explanation_en: "`ditonton ulang` = watched again.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Sertifikat` nghĩa là gì?",
        prompt_en: "What does `sertifikat` mean?",
        choices: ["chứng chỉ", "diễn đàn", "bài tập"],
        answer: "chứng chỉ",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi chưa truy cập được tài liệu khóa học.`",
        prompt_en: "Translate into Indonesian: `I cannot yet access the course material.`",
        answer: "Saya belum bisa mengakses materi kursus.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm học online.",
        prompt_en: "Match the online-learning phrases correctly.",
        pairs: [
          ["forum diskusi", "discussion forum / diễn đàn thảo luận"],
          ["jadwal belajar", "study schedule / lịch học"],
          ["tugas", "assignment / bài tập"],
        ],
      },
    ],
  },
];
