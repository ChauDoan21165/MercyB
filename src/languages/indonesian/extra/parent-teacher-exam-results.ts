// Parent-Teacher Exam Results Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const parentTeacherExamResultsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_parent_teacher_exam_results",
    level: "B1",
    category: "education_family",
    title_vi: "Ket qua kiem tra: trao doi giua phu huynh va giao vien",
    title_en: "Exam results: conversations between parents and teachers",
    sentences: [
      {
        en: "Saya ingin membahas hasil ujian anak saya.",
        vi: "Tôi muốn trao đổi về kết quả bài kiểm tra của con tôi.",
        pronunciation_focus: [
          "`membahas` = trao đổi về / bàn về; tự nhiên hơn `ngomongin` trong bối cảnh trường học.",
          "`hasil ujian` = kết quả bài kiểm tra; dùng cho nilai, rapor, atau tes.",
          "Loi nguoi Viet: noi `score` hay `nilai` roi dung ngay. Cau hoan chinh `hasil ujian` nghe lich su hon khi gap giao vien.",
        ],
        pronunciation_focus_en: [
          "`membahas` means discuss; more natural than casual `ngomongin` in a school context.",
          "`hasil ujian` means exam result; used for grades, report cards, or tests.",
          "VN-speaker trap: jumping straight to `score` or `nilai`. The full phrase `hasil ujian` sounds more polite with a teacher.",
        ],
      },
      {
        en: "Nilai matematika anak saya turun dibanding semester lalu.",
        vi: "Điểm toán của con tôi giảm so với học kỳ trước.",
        pronunciation_focus: [
          "`turun` = giảm; rất hay dùng cho nilai, harga, atau performa.",
          "`dibanding semester lalu` = so với học kỳ trước; `semester lalu` đứng sau để chỉ mốc thời gian.",
          "Loi nguoi Viet: dung `lebih rendah` moi luc. Trong noi chac gon, `turun dibanding semester lalu` rat tu nhien.",
        ],
        pronunciation_focus_en: [
          "`turun` means decrease; very common for grades, prices, or performance.",
          "`dibanding semester lalu` means compared with last semester; the time marker follows the phrase.",
          "VN-speaker note: using `lebih rendah` all the time works, but `turun dibanding semester lalu` sounds very natural.",
        ],
      },
      {
        en: "Apakah anak saya perlu remedial?",
        vi: "Con tôi có cần học bù hay thi lại không?",
        pronunciation_focus: [
          "`perlu remedial` = cần học bù/thi lại; istilah sekolah yang sangat umum.",
          "`apakah` membuka pertanyaan sopan dan jelas.",
          "Loi nguoi Viet: hoi `harus ulang?` nghe qua cung. `remedial` la tu quen dung trong truong hoc Indonesia.",
        ],
        pronunciation_focus_en: [
          "`perlu remedial` means need remedial work or a retake; a very common school term.",
          "`apakah` opens a polite, clear yes/no question.",
          "VN-speaker trap: asking `harus ulang?` can sound too rough. `remedial` is the standard school term.",
        ],
      },
      {
        en: "Guru menyarankan bimbingan belajar tambahan di rumah.",
        vi: "Giáo viên đề nghị học thêm kèm tại nhà.",
        pronunciation_focus: [
          "`menyarankan` = đề nghị/khuyên; dùng tốt khi giáo viên đưa saran.",
          "`bimbingan belajar` = học thêm, học kèm; cụm rất phổ biến ở Indonesia.",
          "Loi nguoi Viet: noi `les privat` qua sat tieng Anh. `bimbingan belajar` la tu meo tren lop va trong giao tiep voi nguoi lon.",
        ],
        pronunciation_focus_en: [
          "`menyarankan` means suggest/recommend; useful for teacher advice.",
          "`bimbingan belajar` means tutoring or extra study support; very common in Indonesia.",
          "VN-speaker trap: using English `les privat` too much. `bimbingan belajar` is the natural Indonesian phrase.",
        ],
      },
      {
        en: "Wali kelas akan menjelaskan catatan perkembangan belajar.",
        vi: "Giáo viên chủ nhiệm sẽ giải thích ghi chú về tiến bộ học tập.",
        pronunciation_focus: [
          "`wali kelas` = giáo viên chủ nhiệm; term penting trong sekolah Indonesia.",
          "`catatan perkembangan belajar` = ghi chú về tiến bộ học tập; nghe formal và cocok untuk rapat orang tua.",
          "Loi nguoi Viet: doi thanh `teacher head` hoac `class wali` khong tu nhien. Tu dung la `wali kelas`.",
        ],
        pronunciation_focus_en: [
          "`wali kelas` means homeroom teacher/class adviser; an important school term in Indonesia.",
          "`catatan perkembangan belajar` means notes on learning progress; formal and suitable for parent meetings.",
          "VN-speaker trap: translating `teacher head` or `class wali` literally. The correct term is `wali kelas`.",
        ],
      },
      {
        en: "Kami melihat kebiasaan belajar anak sudah mulai lebih teratur.",
        vi: "Chúng tôi thấy thói quen học tập của con đã bắt đầu có trật tự hơn.",
        pronunciation_focus: [
          "`kebiasaan belajar` = thói quen học tập; rất hay dùng khi nói với phụ huynh.",
          "`mulai lebih teratur` = bắt đầu có trật tự hơn; `teratur` chỉ sự đều đặn, có nề nếp.",
          "Loi nguoi Viet: dich thang `habit study` nghe khong tu nhien. `kebiasaan belajar` la cum dung de trao doi ve tre em.",
        ],
        pronunciation_focus_en: [
          "`kebiasaan belajar` means study habits; very common when talking with parents.",
          "`mulai lebih teratur` means starting to become more organized; `teratur` implies regularity and routine.",
          "VN-speaker trap: literal `habit study` sounds unnatural. `kebiasaan belajar` is the right phrase for children.",
        ],
      },
      {
        en: "Nilai rapor sudah mencakup tugas harian dan ujian.",
        vi: "Điểm trong học bạ đã bao gồm bài tập hằng ngày và bài kiểm tra.",
        pronunciation_focus: [
          "`nilai rapor` = điểm trong học bạ/bảng điểm; `rapor` sangat penting di sekolah Indonesia.",
          "`mencakup` = bao gồm; formal hơn `termasuk` dalam laporan.",
          "Loi nguoi Viet: dung `score book` hay `report card nilai` chen tieng Anh. `nilai rapor` la cau gan goc hon.",
        ],
        pronunciation_focus_en: [
          "`nilai rapor` means report card grades; `rapor` is very important in Indonesian schools.",
          "`mencakup` means include/cover; more formal than `termasuk` in a report.",
          "VN-speaker trap: mixing in `score book` or `report card`. `nilai rapor` is the natural Indonesian phrase.",
        ],
      },
      {
        en: "Target semester depan adalah menaikkan nilai membaca.",
        vi: "Mục tiêu học kỳ tới là nâng điểm đọc hiểu.",
        pronunciation_focus: [
          "`target semester depan` = mục tiêu học kỳ tới; umum dalam rapat guru-orangtua.",
          "`menaikkan nilai` = nâng điểm; đây là verba yang wajar untuk target akademik.",
          "Loi nguoi Viet: noi `increase score` nghe dau vo. `menaikkan nilai` la cach noi Indonesia ro rang va tu nhien.",
        ],
        pronunciation_focus_en: [
          "`target semester depan` means next semester's target; common in parent-teacher conversations.",
          "`menaikkan nilai` means raise/improve the grade; a natural verb for academic goals.",
          "VN-speaker trap: using `increase score` directly. `menaikkan nilai` is clearer and natural Indonesian.",
        ],
      },
      {
        en: "Saya akan membantu mengawasi kebiasaan belajar di rumah.",
        vi: "Tôi sẽ giúp theo dõi thói quen học tập ở nhà.",
        pronunciation_focus: [
          "`mengawasi` = theo dõi/giám sát; dùng được khi phụ huynh và guru sepakat.",
          "`di rumah` = ở nhà; vị trí rõ, dễ áp dụng cho rutinitas anak.",
          "Loi nguoi Viet: noi `jaga belajar` qua ngan. `mengawasi kebiasaan belajar` la cau day du hon.",
        ],
        pronunciation_focus_en: [
          "`mengawasi` means monitor/supervise; useful when parents and teachers agree on support.",
          "`di rumah` means at home; clear for daily child routines.",
          "VN-speaker trap: too-short `jaga belajar`. `mengawasi kebiasaan belajar` is more complete.",
        ],
      },
      {
        en: "Kalau perlu, kita bisa jadwalkan pertemuan ulang bulan depan.",
        vi: "Nếu cần, chúng ta có thể sắp xếp gặp lại vào tháng sau.",
        pronunciation_focus: [
          "`jadwalkan pertemuan ulang` = sắp xếp buổi gặp lại; sangat berguna untuk tindak lanjut.",
          "`bulan depan` = tháng sau; cụm thời gian sederhana yang umum dalam sekolah.",
          "Loi nguoi Viet: hoi `next meeting kapan?` mau manh tieng Anh. `jadwalkan pertemuan ulang` mem va chuyen nghiep hon.",
        ],
        pronunciation_focus_en: [
          "`jadwalkan pertemuan ulang` means schedule another meeting; very useful for follow-up.",
          "`bulan depan` means next month; a simple and common time phrase in schools.",
          "VN-speaker trap: saying `next meeting kapan?` with too much English. `jadwalkan pertemuan ulang` sounds smoother.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, buổi trao đổi giữa phụ huynh và giáo viên thường xoay quanh nilai rapor, kebiasaan belajar, remedial, dan target semester. Wali kelas là người liên hệ chính, còn bimbingan belajar hoặc les tambahan thường được xem là giải pháp hỗ trợ, chứ không phải điều xấu. Khi nói về điểm số, nên tập trung vào perkembangan, kebiasaan, dan langkah berikutnya thay vì phán xét trực tiếp anak.",
    cultural_notes_en:
      "In Indonesia, parent-teacher conversations often focus on report card grades, study habits, remedial work, and semester goals. The homeroom teacher is the main contact, and tutoring or extra lessons are usually seen as support rather than a negative sign. When discussing grades, it is better to focus on progress, habits, and next steps instead of directly judging the child.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng khung an toàn `Saya ingin membahas...`, `Apakah perlu remedial?`, `Guru menyarankan...`, `Target semester depan...`. Nhớ rằng `wali kelas` là giáo viên chủ nhiệm, `rapor` là học bạ/bảng điểm, và `membahas` nghe lịch sự hơn `ngomongin`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use safe frames like `Saya ingin membahas...`, `Apakah perlu remedial?`, `Guru menyarankan...`, `Target semester depan...`. Remember that `wali kelas` is the homeroom teacher, `rapor` is the report card, and `membahas` sounds more polite than `ngomongin`.",
    vocabulary: [
      {
        cell_id: "6578cd3f-1a2e-466c-9ebf-ef79ae5f8ddf",
        word: "hasil ujian",
        en: "exam results",
        vi: "ket qua bai kiem tra",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil U-ji-an",
        pronunciation_en: "HAH-seel oo-JEE-an",
      },
      {
        cell_id: "adb968e3-807d-47aa-a6fb-f6e44c64e88f",
        word: "nilai rapor",
        en: "report card grades",
        vi: "diem trong hoc ba",
        pos: "noun phrase",
        pronunciation_vi: "NI-lai RA-por",
        pronunciation_en: "NEE-lie RAH-por",
      },
      {
        cell_id: "ef23edd6-5398-40e1-9655-5a32a3ddf7bf",
        word: "remedial",
        en: "remedial work / retake",
        vi: "hoc but / thi lai",
        pos: "noun",
        pronunciation_vi: "re-me-DI-al",
        pronunciation_en: "reh-MEE-dee-uhl",
      },
      {
        cell_id: "0a3282ac-56e5-48ee-894e-8a49c5de46fe",
        word: "bimbingan belajar",
        en: "tutoring",
        vi: "hoc kem / hoc them",
        pos: "noun phrase",
        pronunciation_vi: "BIM-bing-an be-LA-jar",
        pronunciation_en: "BIM-bing-an beh-LAH-jar",
      },
      {
        cell_id: "f1b2bb29-4dad-4972-8a70-6206abec7cbd",
        word: "wali kelas",
        en: "homeroom teacher",
        vi: "giao vien chu nhiem",
        pos: "noun phrase",
        pronunciation_vi: "WA-li KE-las",
        pronunciation_en: "WAH-lee KEH-las",
      },
      {
        cell_id: "e3ba06f8-46dc-4d89-9878-0f6da9aa9896",
        word: "kebiasaan belajar",
        en: "study habits",
        vi: "thoi quen hoc tap",
        pos: "noun phrase",
        pronunciation_vi: "ke-bi-A-sa-an be-LA-jar",
        pronunciation_en: "keh-bee-AH-sah-an beh-LAH-jar",
      },
      {
        cell_id: "3ea5695f-4304-4ac4-bebf-34474860d921",
        word: "rapor",
        en: "report card",
        vi: "hoc ba / bang diem",
        pos: "noun",
        pronunciation_vi: "RA-por",
        pronunciation_en: "RAH-por",
      },
      {
        cell_id: "b7be577a-34aa-43d6-bdad-74c7e61cae57",
        word: "target semester",
        en: "semester target",
        vi: "muc tieu hoc ky",
        pos: "noun phrase",
        pronunciation_vi: "TAR-get se-MES-ter",
        pronunciation_en: "TAR-get seh-MES-ter",
      },
    ],
    dialogue: [
      {
        cell_id: "ec50818e-a195-46d5-a939-1efe4ebafdf2",
        speaker: "Orang Tua",
        text: "Selamat sore, Bu. Saya ingin membahas hasil ujian anak saya.",
        vi: "Chào buổi chiều ạ, cô. Tôi muốn trao đổi về kết quả bài kiểm tra của con tôi.",
        en: "Good afternoon, ma'am. I would like to discuss my child's exam results.",
      },
      {
        cell_id: "6f1cb99e-ed74-4734-806c-03909f8c9a89",
        speaker: "Wali Kelas",
        text: "Tentu, Bu. Nilainya memang turun dibanding semester lalu.",
        vi: "Vâng ạ, đúng là điểm có giảm so với học kỳ trước.",
        en: "Of course. The grades did drop compared with last semester.",
      },
      {
        cell_id: "ebe4f440-357f-4398-9f87-310e5a0ecacb",
        speaker: "Orang Tua",
        text: "Apakah anak saya perlu remedial atau bimbingan belajar tambahan?",
        vi: "Con tôi có cần học bù hoặc học thêm kèm không ạ?",
        en: "Does my child need remedial work or additional tutoring?",
      },
      {
        cell_id: "e244edeb-0264-46f7-ae44-a0cf933bee32",
        speaker: "Wali Kelas",
        text: "Kami melihat kebiasaan belajarnya sudah mulai lebih teratur.",
        vi: "Chúng tôi thấy thói quen học tập của cháu đã bắt đầu có trật tự hơn.",
        en: "We can see that the study habit is starting to become more regular.",
      },
      {
        cell_id: "886a0a7a-b6e9-401b-846a-1f5fc294cf36",
        speaker: "Orang Tua",
        text: "Baik, saya akan membantu mengawasi kebiasaan belajar di rumah.",
        vi: "Vâng, tôi sẽ giúp theo dõi thói quen học tập ở nhà.",
        en: "Alright, I will help monitor the study routine at home.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dich sang tieng Indonesia: Tôi muốn trao đổi về kết quả bài kiểm tra của con tôi.",
        prompt_en: "Translate into Indonesian: I want to discuss my child's exam results.",
        answer: "Saya ingin membahas hasil ujian anak saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: Apakah anak saya perlu ___?",
        prompt_en: "Fill in the correct word: Apakah anak saya perlu ___?",
        answer: "remedial",
        explanation_vi: "`remedial` = hoc but / thi lai.",
        explanation_en: "`remedial` means remedial work / retake.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cum nao dung de chi giao vien chu nhiem?",
        prompt_en: "Which phrase means homeroom teacher?",
        choices: ["wali kelas", "guru besar", "teman sekolah", "kelas wali"],
        answer: "wali kelas",
      },
      {
        type: "short_answer",
        prompt_vi: "Viet mot cau lich su hoi co can hoc them kem khong.",
        prompt_en: "Write one polite sentence asking whether tutoring is needed.",
        sample_answer: "Apakah anak saya perlu bimbingan belajar tambahan?",
      },
    ],
  },
];
