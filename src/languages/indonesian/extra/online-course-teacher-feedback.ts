type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation?: string;
  pronunciation_vi?: string;
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
  example_vi: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  line: string;
  vi: string;
  en: string;
};

type Exercise = {
  type: 'fill_blank' | 'translate' | 'choice' | 'roleplay';
  prompt: string;
  answer: string;
  explanation_vi: string;
  explanation_en: string;
};

type IndonesianCefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

type IndonesianLesson = {
  id: string;
  title: string;
  level: IndonesianCefrLevel;
  topic: string;
  vietnamese_title: string;
  english_title: string;
  pronunciation_focus: string[];
  pronunciation_focus_en: string[];
  sentences: IndonesianLessonSentence[];
  vocabulary: VocabEntry[];
  dialogue: DialogueLine[];
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  tip_advice_vi: string[];
  tip_advice_en: string[];
  exercises: Exercise[];
};

export const lessons: IndonesianLesson[] = [
  {
    id: 'online-course-teacher-feedback',
    title: 'Feedback guru dalam kursus online',
    level: 'B1',
    topic: 'teacher feedback, online assignments, revision comments, grading rubric, deadline, class discussion, answer improvement',
    vietnamese_title: 'Phản hồi của giáo viên trong khóa học online',
    english_title: 'Online Course Teacher Feedback',
    pronunciation_focus: [
      'Feedback guru là phản hồi của giáo viên. Dalam konteks kursus online, feedback bisa berupa komentar tugas, catatan perbaikan, atau saran diskusi.',
      'Tugas online nghĩa là bài tập trực tuyến. Tugas di sini bisa berupa эсai, jawaban pendek, forum post, atau presentasi video.',
      'Komentar revisi adalah chú thích để sửa bài. Revisi = sửa lại/chỉnh sửa; komentar = nhận xét bằng chữ.',
      'Rubrik nilai adalah bảng tiêu chí chấm điểm. Rubrik membantu siswa tahu aspek apa yang dinilai.',
      'Deadline nghĩa là hạn chót. Dalam kelas online, deadline penting karena sering ada pengumpulan otomatis.',
      'Perbaikan jawaban berarti cải thiện câu trả lời. Jangan anggap kritik sebagai penolakan; sering kali itu arahan untuk versi berikutnya.',
    ],
    pronunciation_focus_en: [
      'Teacher feedback means feedback from the teacher. In online courses, feedback can be task comments, revision notes, or discussion suggestions.',
      'Tugas online means online assignment. Here it can be an essay, short answer, forum post, or video presentation.',
      'Komentar revisi are comments for revision. Revisi = revise/edit; komentar = written remarks.',
      'Rubrik nilai means grading rubric. A rubric helps students know what is being assessed.',
      'Deadline means due date. In online classes, deadlines matter because submission is often automatic.',
      'Perbaikan jawaban means improving an answer. Do not treat criticism as rejection; it is often guidance for the next version.',
    ],
    sentences: [
      {
        en: 'Saya sudah membaca feedback dari guru.',
        vi: 'Tôi đã đọc phản hồi từ giáo viên.',
        pronunciation: 'SA-ya SU-dah mem-BA-ca FEED-bak da-ri GU-ru',
      },
      {
        en: 'Ada komentar revisi pada tugas online saya.',
        vi: 'Có nhận xét chỉnh sửa trên bài tập trực tuyến của tôi.',
        pronunciation: 'A-da ko-men-TAR re-VI-si pa-da TU-gas ON-lain SA-ya',
      },
      {
        en: 'Saya belum paham bagian rubrik nilainya.',
        vi: 'Tôi chưa hiểu phần bảng tiêu chí chấm điểm.',
        pronunciation: 'SA-ya be-LUM PA-ham ba-GI-an RU-brik NI-lai-nya',
      },
      {
        en: 'Apakah saya masih bisa mengumpulkan sebelum deadline?',
        vi: 'Tôi còn có thể nộp trước hạn chót không?',
        pronunciation: 'a-PA-kah SA-ya MA-sih BI-sa meng-kum-pul-KAN se-BE-lum DEAD-lain',
      },
      {
        en: 'Guru menyarankan perbaikan jawaban di bagian kesimpulan.',
        vi: 'Giáo viên gợi ý sửa câu trả lời ở phần kết luận.',
        pronunciation: 'GU-ru men-ya-RAN-kan per-BAI-kan ja-WA-ban di ba-GI-an ke-sim-PU-lan',
      },
      {
        en: 'Saya ingin ikut diskusi kelas untuk menjelaskan maksud saya.',
        vi: 'Tôi muốn tham gia thảo luận lớp để giải thích ý của mình.',
        pronunciation: 'SA-ya I-ngin I-kut dis-KU-si ke-las UN-tuk men-je-LAS-kan MAK-sud SA-ya',
      },
      {
        en: 'Terima kasih, saya akan revisi jawaban saya.',
        vi: 'Cảm ơn, tôi sẽ sửa câu trả lời của mình.',
        pronunciation: 'te-RI-ma KA-sih SA-ya A-kan re-VI-si ja-WA-ban SA-ya',
      },
      {
        en: 'Tolong beri saya contoh jawaban yang lebih baik.',
        vi: 'Vui lòng cho tôi ví dụ câu trả lời tốt hơn.',
        pronunciation: 'TO-long be-RI SA-ya con-TOH ja-WA-ban yang le-BIH BAIK',
      },
    ],
    vocabulary: [
      {
        cell_id: "5b4b9ece-6ea3-4c5d-a300-d27bdec6fc5c",
        word: 'feedback guru',
        meaning_vi: 'phản hồi của giáo viên',
        meaning_en: 'teacher feedback',
        example: 'Feedback guru sangat membantu saya.',
        example_vi: 'Phản hồi của giáo viên giúp tôi rất nhiều.',
      },
      {
        cell_id: "f1e01faf-cce2-4e5b-a3e5-0ff49c64e8d9",
        word: 'tugas online',
        meaning_vi: 'bài tập trực tuyến',
        meaning_en: 'online assignment',
        example: 'Tugas online harus dikumpulkan sebelum malam ini.',
        example_vi: 'Bài tập trực tuyến phải nộp trước tối nay.',
      },
      {
        cell_id: "f6de10fa-0e6e-4015-a372-06137a40e47a",
        word: 'komentar revisi',
        meaning_vi: 'nhận xét chỉnh sửa',
        meaning_en: 'revision comments',
        example: 'Saya membaca komentar revisi satu per satu.',
        example_vi: 'Tôi đọc từng nhận xét chỉnh sửa một.',
      },
      {
        cell_id: "66c2c689-e1c8-4a64-a620-db662f00b9a9",
        word: 'rubrik nilai',
        meaning_vi: 'bảng tiêu chí chấm điểm',
        meaning_en: 'grading rubric',
        example: 'Rubrik nilai menjelaskan aspek yang dinilai.',
        example_vi: 'Bảng tiêu chí chấm điểm giải thích các phần được chấm.',
      },
      {
        cell_id: "de08e085-2bec-4ce3-bcb8-9950b3eeba30",
        word: 'deadline',
        meaning_vi: 'hạn chót',
        meaning_en: 'deadline',
        example: 'Deadline tugas ini hari Jumat.',
        example_vi: 'Hạn chót của bài này là thứ Sáu.',
      },
      {
        cell_id: "ee6af3eb-6f74-49e5-84f4-ddc7125c6fa8",
        word: 'diskusi kelas',
        meaning_vi: 'thảo luận lớp',
        meaning_en: 'class discussion',
        example: 'Diskusi kelas membantu kami saling belajar.',
        example_vi: 'Thảo luận lớp giúp chúng tôi học hỏi lẫn nhau.',
      },
      {
        cell_id: "467a3014-144d-4e6d-afaa-30c66a8edd89",
        word: 'perbaikan jawaban',
        meaning_vi: 'sửa/cải thiện câu trả lời',
        meaning_en: 'answer improvement',
        example: 'Perbaikan jawaban perlu dilakukan di bagian akhir.',
        example_vi: 'Cần sửa câu trả lời ở phần cuối.',
      },
      {
        cell_id: "73787f9a-3073-4787-8b8b-52f804942bc4",
        word: 'pengumpulan otomatis',
        meaning_vi: 'nộp tự động',
        meaning_en: 'automatic submission',
        example: 'Platform ini punya pengumpulan otomatis.',
        example_vi: 'Nền tảng này có tính năng nộp tự động.',
      },
    ],
    dialogue: [
      {
        cell_id: "f359d3b8-68c8-4e9e-b0e5-11c223d3b0c8",
        speaker: 'Siswa',
        line: 'Bu, saya sudah membaca feedback dari guru.',
        vi: 'Cô ơi, em đã đọc phản hồi từ giáo viên.',
        en: 'Ma’am, I have already read the teacher feedback.',
      },
      {
        cell_id: "16f09c41-37e5-49d5-b188-2970d94b129c",
        speaker: 'Guru',
        line: 'Bagus. Silakan lihat komentar revisi pada tugas online Anda.',
        vi: 'Tốt. Hãy xem các nhận xét chỉnh sửa trên bài tập trực tuyến của bạn.',
        en: 'Good. Please look at the revision comments on your online assignment.',
      },
      {
        cell_id: "677abe3c-f78e-44ba-9eab-b4a273bb835a",
        speaker: 'Siswa',
        line: 'Saya belum paham bagian rubrik nilainya.',
        vi: 'Em chưa hiểu phần bảng tiêu chí chấm điểm.',
        en: 'I do not yet understand the grading rubric section.',
      },
      {
        cell_id: "85802ac4-4b31-4137-ac20-8af32417d1b1",
        speaker: 'Guru',
        line: 'Tidak apa-apa. Nanti kita bahas di diskusi kelas.',
        vi: 'Không sao. Lát nữa chúng ta sẽ bàn trong phần thảo luận lớp.',
        en: 'No problem. We will discuss it in class discussion later.',
      },
      {
        cell_id: "af180923-1176-4115-854d-61e7ab5a99a5",
        speaker: 'Siswa',
        line: 'Apakah saya masih bisa mengumpulkan sebelum deadline?',
        vi: 'Em còn có thể nộp trước hạn chót không ạ?',
        en: 'Can I still submit before the deadline?',
      },
      {
        cell_id: "30e247f0-318a-42ee-8200-18636070e547",
        speaker: 'Guru',
        line: 'Bisa, tapi tolong lakukan perbaikan jawaban dulu.',
        vi: 'Được, nhưng vui lòng sửa câu trả lời trước đã.',
        en: 'Yes, but please do the answer improvement first.',
      },
    ],
    cultural_notes_vi: [
      'Trong kursus online ở Indonesia, guru sering memberi feedback singkat lewat komentar, rubrik, atau pesan pribadi. Siswa biasanya diminta revisi sebelum deadline berikutnya.',
      'Tugas online bisa dikumpulkan lewat platform belajar, Google Classroom, Moodle, atau LMS lain. Jika ada pengumpulan otomatis, jangan chờ đến phút cuối.',
      'Diskusi kelas sering dùng để klarifikasi jawaban, bukan để “tranh cãi”. Tanggapi komentar dengan sopan: Terima kasih, saya akan revisi.',
      'Rubrik nilai membantu siswa paham aspek yang dinilai, misalnya isi, struktur, ketepatan bahasa, dan partisipasi.',
    ],
    cultural_notes_en: [
      'In online courses in Indonesia, teachers often give short feedback through comments, rubrics, or private messages. Students are usually asked to revise before the next deadline.',
      'Online assignments may be submitted through a learning platform, Google Classroom, Moodle, or another LMS. If submission is automatic, do not wait until the last minute.',
      'Class discussion is often used to clarify answers, not to argue. Respond to comments politely: Terima kasih, saya akan revisi.',
      'A grading rubric helps students understand what is assessed, such as content, structure, language accuracy, and participation.',
    ],
    tip_advice_vi: [
      'Khung phản hồi tốt: Saya sudah membaca..., Saya akan revisi..., Terima kasih, Bu. Đây là cách trả lời rất tự nhiên.',
      'Nếu chưa hiểu, hỏi thẳng phần cụ thể: Saya belum paham bagian rubrik nilainya. 또는 Tolong beri saya contoh jawaban yang lebih baik.',
      'Komentar revisi thường không phải là chê bai. Itu umpan balik untuk versi berikutnya.',
      'Deadline là hạn chót. Nếu platform có pengumpulan otomatis, kiểm tra giờ đóng trước khi gửi.',
    ],
    tip_advice_en: [
      'Good response frame: Saya sudah membaca..., Saya akan revisi..., Terima kasih, Bu. This is a very natural reply pattern.',
      'If you do not understand, ask about the specific part: Saya belum paham bagian rubrik nilainya. or Tolong beri saya contoh jawaban yang lebih baik.',
      'Revision comments are often not criticism. They are feedback for the next version.',
      'Deadline means due date. If the platform has automatic submission, check the closing time before sending.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Saya sudah membaca ____ dari guru.',
        answer: 'feedback',
        explanation_vi: 'Feedback guru là phản hồi của giáo viên.',
        explanation_en: 'Feedback guru means teacher feedback.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “grading rubric”?',
        answer: 'rubrik nilai',
        explanation_vi: 'Rubrik nilai là bảng tiêu chí chấm điểm.',
        explanation_en: 'Rubrik nilai means grading rubric.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Can I still submit before the deadline?',
        answer: 'Apakah saya masih bisa mengumpulkan sebelum deadline?',
        explanation_vi: 'Masih bisa = vẫn còn có thể; mengumpulkan = nộp bài; sebelum deadline = trước hạn chót.',
        explanation_en: 'Masih bisa = can still; mengumpulkan = submit; sebelum deadline = before the deadline.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask the teacher for a better example answer and say you will revise your work.',
        answer: 'Tolong beri saya contoh jawaban yang lebih baik. Terima kasih, saya akan revisi jawaban saya.',
        explanation_vi: 'Tolong beri saya contoh... là cách xin ví dụ; saya akan revisi là hứa sẽ sửa bài.',
        explanation_en: 'Tolong beri saya contoh... asks for an example; saya akan revisi says you will revise the work.',
      },
    ],
  },
];
