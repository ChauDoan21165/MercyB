type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation?: string;
  pronunciation_vi?: string;
};

type VocabEntry = {
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
  example_vi: string;
};

type DialogueLine = {
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
    id: 'community-health-posyandu',
    title: 'Posyandu dan kesehatan anak di lingkungan',
    level: 'A2',
    topic: 'community health, Posyandu, baby weighing, immunization, monthly schedule',
    vietnamese_title: 'Posyandu và chăm sóc sức khỏe trẻ em ở khu dân cư',
    english_title: 'Community Health Posyandu',
    pronunciation_focus: [
      'Posyandu thường đọc là po-syan-du. Đây là viết tắt quen thuộc cho trạm/dịch vụ y tế cộng đồng tại khu dân cư.',
      'Kader nghĩa là tình nguyện viên/cán bộ cộng đồng, không nhất thiết là bác sĩ. Đọc âm cuối -r nhẹ.',
      'Timbang là động từ "cân". Nói timbang bayi để chỉ cân em bé; jangan pakai berat sebagai kata kerja.',
      'Imunisasi nghĩa là tiêm/chủng ngừa theo lịch. Vaksin là vắc-xin; imunisasi là hoạt động/lịch chủng ngừa.',
      'Buku KIA đọc từng chữ cái ka-i-a. Đây là sổ sức khỏe ibu dan anak, nên mang theo khi đến Posyandu.',
      'Antrean và antrian đều gặp trong đời sống; antrean thường dùng trong văn viết chuẩn hơn.',
    ],
    pronunciation_focus_en: [
      'Posyandu is usually pronounced po-syan-du. It is a familiar term for a local community health service post.',
      'Kader means a community volunteer or local health worker, not necessarily a doctor. Keep the final -r light.',
      'Timbang is the verb "to weigh." Say timbang bayi for weighing a baby; do not use berat as a verb.',
      'Imunisasi refers to immunization or the immunization schedule. Vaksin is the vaccine itself.',
      'Buku KIA is read letter by letter: ka-i-a. It is the maternal and child health book, so bring it to Posyandu.',
      'Both antrean and antrian appear in daily speech; antrean is the more standard written form.',
    ],
    sentences: [
      {
        en: 'Kapan jadwal Posyandu bulan ini?',
        vi: 'Lịch Posyandu tháng này là khi nào?',
        pronunciation: 'KA-pan JAD-wal po-SYAN-du BU-lan i-ni',
      },
      {
        en: 'Saya mau menimbang bayi saya.',
        vi: 'Tôi muốn cân em bé của tôi.',
        pronunciation: 'SA-ya mau me-NIM-bang BA-yi SA-ya',
      },
      {
        en: 'Tolong catat berat badan anak saya di buku KIA.',
        vi: 'Nhờ ghi cân nặng của con tôi vào sổ KIA.',
        pronunciation: 'TO-long CA-tat BE-rat BA-dan A-nak SA-ya di BU-ku ka-i-a',
      },
      {
        en: 'Apakah hari ini ada imunisasi?',
        vi: 'Hôm nay có tiêm/chủng ngừa không?',
        pronunciation: 'a-PA-kah HA-ri i-ni A-da i-mu-ni-SA-si',
      },
      {
        en: 'Bayi saya sudah dapat vitamin A.',
        vi: 'Em bé của tôi đã được vitamin A.',
        pronunciation: 'BA-yi SA-ya SU-dah DA-pat VI-ta-min a',
      },
      {
        en: 'Saya ambil nomor antrean dulu.',
        vi: 'Tôi lấy số thứ tự trước.',
        pronunciation: 'SA-ya AM-bil NO-mor AN-tre-an DU-lu',
      },
      {
        en: 'Kader Posyandu menjelaskan jadwal imunisasi berikutnya.',
        vi: 'Cán bộ/tình nguyện viên Posyandu giải thích lịch chủng ngừa tiếp theo.',
        pronunciation: 'KA-der po-SYAN-du men-je-LAS-kan JAD-wal i-mu-ni-SA-si be-RI-kut-nya',
      },
      {
        en: 'Kalau anak demam setelah imunisasi, sebaiknya saya bagaimana?',
        vi: 'Nếu con bị sốt sau khi tiêm/chủng ngừa, tôi nên làm thế nào?',
        pronunciation: 'KA-lau A-nak DE-mam se-TE-lah i-mu-ni-SA-si se-BA-ik-nya SA-ya ba-GAI-ma-na',
      },
    ],
    vocabulary: [
      {
        word: 'Posyandu',
        meaning_vi: 'điểm/trạm y tế cộng đồng ở khu dân cư',
        meaning_en: 'community health post',
        example: 'Besok pagi ada Posyandu di balai RT.',
        example_vi: 'Sáng mai có Posyandu ở nhà sinh hoạt tổ dân phố.',
      },
      {
        word: 'kader',
        meaning_vi: 'tình nguyện viên/cán bộ cộng đồng',
        meaning_en: 'community volunteer or local health worker',
        example: 'Kader membantu orang tua mengisi buku KIA.',
        example_vi: 'Cán bộ cộng đồng giúp phụ huynh điền sổ KIA.',
      },
      {
        word: 'timbang bayi',
        meaning_vi: 'cân em bé',
        meaning_en: 'weigh a baby',
        example: 'Setiap bulan kami timbang bayi di Posyandu.',
        example_vi: 'Mỗi tháng chúng tôi cân em bé ở Posyandu.',
      },
      {
        word: 'imunisasi',
        meaning_vi: 'tiêm/chủng ngừa',
        meaning_en: 'immunization',
        example: 'Jangan lupa jadwal imunisasi bulan depan.',
        example_vi: 'Đừng quên lịch chủng ngừa tháng sau.',
      },
      {
        word: 'vitamin',
        meaning_vi: 'vitamin',
        meaning_en: 'vitamin',
        example: 'Anak saya sudah menerima vitamin dari kader.',
        example_vi: 'Con tôi đã nhận vitamin từ cán bộ cộng đồng.',
      },
      {
        word: 'buku KIA',
        meaning_vi: 'sổ sức khỏe mẹ và bé',
        meaning_en: 'maternal and child health book',
        example: 'Saya selalu membawa buku KIA saat ke Posyandu.',
        example_vi: 'Tôi luôn mang sổ KIA khi đi Posyandu.',
      },
      {
        word: 'jadwal bulanan',
        meaning_vi: 'lịch hằng tháng',
        meaning_en: 'monthly schedule',
        example: 'Jadwal bulanan ditempel di papan informasi.',
        example_vi: 'Lịch hằng tháng được dán trên bảng thông tin.',
      },
      {
        word: 'antrean',
        meaning_vi: 'hàng chờ, lượt chờ',
        meaning_en: 'queue',
        example: 'Antrean timbang bayi cukup panjang pagi ini.',
        example_vi: 'Hàng chờ cân em bé khá dài sáng nay.',
      },
    ],
    dialogue: [
      {
        speaker: 'Ibu',
        line: 'Selamat pagi, Bu. Saya mau ikut Posyandu hari ini.',
        vi: 'Chào buổi sáng cô/chị. Hôm nay tôi muốn tham gia Posyandu.',
        en: 'Good morning. I want to join Posyandu today.',
      },
      {
        speaker: 'Kader',
        line: 'Selamat pagi. Silakan ambil nomor antrean dulu.',
        vi: 'Chào buổi sáng. Mời lấy số thứ tự trước.',
        en: 'Good morning. Please take a queue number first.',
      },
      {
        speaker: 'Ibu',
        line: 'Ini buku KIA anak saya. Hari ini perlu imunisasi tidak?',
        vi: 'Đây là sổ KIA của con tôi. Hôm nay có cần chủng ngừa không?',
        en: 'This is my child’s KIA book. Does my child need immunization today?',
      },
      {
        speaker: 'Kader',
        line: 'Saya cek dulu. Setelah timbang bayi, nanti kami catat berat badannya.',
        vi: 'Tôi kiểm tra trước. Sau khi cân em bé, chúng tôi sẽ ghi cân nặng.',
        en: 'Let me check first. After weighing the baby, we will record the weight.',
      },
      {
        speaker: 'Ibu',
        line: 'Kalau ada jadwal bulanan berikutnya, tolong beri tahu saya.',
        vi: 'Nếu có lịch hằng tháng tiếp theo, xin báo cho tôi biết.',
        en: 'Please tell me the next monthly schedule if it is available.',
      },
      {
        speaker: 'Kader',
        line: 'Baik, jadwal bulan depan hari Rabu minggu kedua.',
        vi: 'Được, lịch tháng sau là thứ Tư tuần thứ hai.',
        en: 'Sure, next month’s schedule is on the second Wednesday.',
      },
    ],
    cultural_notes_vi: [
      'Posyandu thường là hoạt động định kỳ trong khu dân cư, thường có kader, nhân viên y tế, và phụ huynh đưa trẻ đến cân, kiểm tra tăng trưởng, nhận vitamin, hoặc theo dõi lịch imunisasi.',
      'Buku KIA rất quan trọng vì ghi lịch khám, cân nặng, chiều cao, imunisasi, và thông tin sức khỏe mẹ con. Khi đến Posyandu nên mang theo sổ này.',
      'Kader thường là người địa phương hỗ trợ tổ chức và ghi chép. Với câu hỏi y khoa phức tạp, nên hỏi bidan, perawat, puskesmas, hoặc dokter.',
      'Ở nhiều nơi, người dân lấy nomor antrean rồi chờ đến lượt timbang bayi hoặc konsultasi singkat.',
    ],
    cultural_notes_en: [
      'Posyandu is often a regular neighborhood activity where community volunteers, health staff, and parents track child growth, vitamins, and immunization schedules.',
      'The buku KIA is important because it records visits, weight, height, immunizations, and maternal-child health information. Bring it to Posyandu.',
      'Kader are usually local community helpers who organize and record information. For more complex medical questions, ask a midwife, nurse, public health center, or doctor.',
      'In many places, people take a queue number and wait for baby weighing or a short consultation.',
    ],
    tip_advice_vi: [
      'Mẫu lịch sự: Tolong catat... nghĩa là "xin/nhờ ghi..." Dùng được với kader khi cần ghi thông tin vào buku KIA.',
      'Mẫu hỏi an toàn: Sebaiknya saya bagaimana? nghĩa là "tôi nên làm thế nào?" Hữu ích khi hỏi sau imunisasi hoặc khi trẻ sốt.',
      'Khi không chắc về lịch, hỏi: Kapan jadwal Posyandu bulan ini? hoặc Apakah ada jadwal bulanan?',
    ],
    tip_advice_en: [
      'Polite pattern: Tolong catat... means "please record..." Use it with a kader when information needs to be written in the buku KIA.',
      'Safe question pattern: Sebaiknya saya bagaimana? means "What should I do?" It is useful after immunization or if a child has a fever.',
      'When unsure about the schedule, ask: Kapan jadwal Posyandu bulan ini? or Apakah ada jadwal bulanan?',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Saya mau ____ bayi saya di Posyandu.',
        answer: 'menimbang',
        explanation_vi: 'Dùng menimbang để nói "cân" em bé. Berat là danh từ/tính từ "nặng/cân nặng", không phải động từ trong câu này.',
        explanation_en: 'Use menimbang for "to weigh" a baby. Berat means weight/heavy, not the verb needed here.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase asks for the monthly Posyandu schedule?',
        answer: 'Kapan jadwal Posyandu bulan ini?',
        explanation_vi: 'Kapan hỏi "khi nào", jadwal là lịch, bulan ini là tháng này.',
        explanation_en: 'Kapan asks "when," jadwal means schedule, and bulan ini means this month.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Please record my child’s weight in the KIA book.',
        answer: 'Tolong catat berat badan anak saya di buku KIA.',
        explanation_vi: 'Tolong catat là cách nhờ lịch sự; berat badan là cân nặng cơ thể; buku KIA là sổ mẹ và bé.',
        explanation_en: 'Tolong catat is a polite request; berat badan means body weight; buku KIA is the maternal-child health book.',
      },
      {
        type: 'roleplay',
        prompt: 'You arrive at Posyandu and need to ask whether there is immunization today.',
        answer: 'Apakah hari ini ada imunisasi?',
        explanation_vi: 'Apakah mở đầu câu hỏi có/không. Hari ini là hôm nay, ada imunisasi là có chủng ngừa.',
        explanation_en: 'Apakah starts a yes/no question. Hari ini means today, and ada imunisasi means there is immunization.',
      },
    ],
  },
];
