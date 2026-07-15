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
    id: 'teacher-parent-chat',
    title: 'Chat guru dan orang tua di grup kelas',
    level: 'A2',
    topic: 'teacher-parent chat, WhatsApp class group, sick leave, homework, school announcements, polite chat etiquette',
    vietnamese_title: 'Nhắn tin với giáo viên và nhóm WhatsApp lớp',
    english_title: 'Teacher-Parent Chat',
    pronunciation_focus: [
      'Guru nghĩa là giáo viên. Với giáo viên, thường gọi Pak/Bu + tên hoặc cukup Pak Guru/Bu Guru.',
      'Grup WhatsApp kelas thường được viết tắt là grup WA kelas. WA đọc theo kiểu Indonesia: we-a hoặc wa.',
      'Izin sakit nghĩa là xin phép nghỉ vì ốm. Đừng dịch từng chữ "cho phép bệnh"; izin ở đây là xin phép/vắng mặt.',
      'Tugas anak là bài tập của con. Tugas có thể là việc được giao hoặc bài tập, tùy ngữ cảnh trường học.',
      'Pengumuman sekolah nghĩa là thông báo của trường. Trong chat, dùng "Terima kasih atas informasinya" để trả lời lịch sự.',
      'Sopan santun chat: tránh gửi tin quá khuya, tránh viết toàn chữ in hoa, và dùng salam/pembuka ngắn.',
    ],
    pronunciation_focus_en: [
      'Guru means teacher. With teachers, parents often use Pak/Bu plus name, or simply Pak Guru/Bu Guru.',
      'Grup WhatsApp kelas is often shortened to grup WA kelas. WA may be pronounced we-a or wa in Indonesian.',
      'Izin sakit means asking permission to be absent because of illness. Izin here means leave/permission, not "allow sickness."',
      'Tugas anak means the child’s assignment or homework. Tugas can mean assigned work or homework depending on school context.',
      'Pengumuman sekolah means a school announcement. In chat, "Terima kasih atas informasinya" is a polite reply.',
      'Chat etiquette: avoid messaging too late, avoid all caps, and use a short greeting or opener.',
    ],
    sentences: [
      {
        en: 'Selamat pagi, Bu Guru. Saya orang tua dari Dimas.',
        vi: 'Chào buổi sáng cô giáo. Tôi là phụ huynh của Dimas.',
        pronunciation: 'se-LA-mat PA-gi bu GU-ru SA-ya O-rang TU-a DA-ri DI-mas',
      },
      {
        en: 'Maaf, hari ini anak saya izin sakit.',
        vi: 'Xin lỗi, hôm nay con tôi xin nghỉ vì bị ốm.',
        pronunciation: 'MA-af HA-ri i-ni A-nak SA-ya I-zin SA-kit',
      },
      {
        en: 'Apakah ada tugas yang harus dikumpulkan besok?',
        vi: 'Có bài tập nào phải nộp vào ngày mai không?',
        pronunciation: 'a-PA-kah A-da TU-gas yang HA-rus di-KUM-pul-kan BE-sok',
      },
      {
        en: 'Saya sudah membaca pengumuman di grup WhatsApp kelas.',
        vi: 'Tôi đã đọc thông báo trong nhóm WhatsApp lớp.',
        pronunciation: 'SA-ya SU-dah mem-BA-ca pe-ngu-MU-man di grup WATS-ap KE-las',
      },
      {
        en: 'Terima kasih atas informasinya, Pak.',
        vi: 'Cảm ơn thầy/cô về thông tin đó.',
        pronunciation: 'te-RI-ma KA-sih A-tas in-for-MA-si-nya pak',
      },
      {
        en: 'Boleh saya tanya tentang tugas matematika anak saya?',
        vi: 'Tôi có thể hỏi về bài tập toán của con tôi không?',
        pronunciation: 'BO-leh SA-ya TAN-ya ten-TANG TU-gas ma-te-MA-ti-ka A-nak SA-ya',
      },
      {
        en: 'Mohon maaf kalau saya mengganggu di luar jam sekolah.',
        vi: 'Xin lỗi nếu tôi làm phiền ngoài giờ học.',
        pronunciation: 'MO-hon MA-af KA-lau SA-ya meng-GANG-gu di LU-ar jam se-KO-lah',
      },
      {
        en: 'Nanti saya kirim foto surat izin ke wali kelas.',
        vi: 'Lát nữa tôi sẽ gửi ảnh giấy xin phép cho giáo viên chủ nhiệm.',
        pronunciation: 'NAN-ti SA-ya KI-rim FO-to SU-rat I-zin ke WA-li KE-las',
      },
    ],
    vocabulary: [
      {
        cell_id: "2406fa9d-bad4-45b6-9e10-6015651cd10d",
        word: 'guru',
        meaning_vi: 'giáo viên',
        meaning_en: 'teacher',
        example: 'Bu Guru mengirim pengumuman di grup kelas.',
        example_vi: 'Cô giáo gửi thông báo trong nhóm lớp.',
      },
      {
        cell_id: "c3a2c4b4-f166-4785-85b4-60e308c9fff4",
        word: 'orang tua murid',
        meaning_vi: 'phụ huynh học sinh',
        meaning_en: 'student’s parent or guardian',
        example: 'Orang tua murid diminta membaca pengumuman sekolah.',
        example_vi: 'Phụ huynh học sinh được yêu cầu đọc thông báo của trường.',
      },
      {
        cell_id: "455b18a6-6e19-404a-9c27-f03cdfe90a41",
        word: 'grup WhatsApp kelas',
        meaning_vi: 'nhóm WhatsApp của lớp',
        meaning_en: 'class WhatsApp group',
        example: 'Jadwal ujian dibagikan di grup WhatsApp kelas.',
        example_vi: 'Lịch thi được chia sẻ trong nhóm WhatsApp của lớp.',
      },
      {
        cell_id: "64f589fe-663a-4fac-8864-da2dc788c40e",
        word: 'izin sakit',
        meaning_vi: 'xin nghỉ vì ốm',
        meaning_en: 'sick leave or absence due to illness',
        example: 'Anak saya izin sakit hari ini.',
        example_vi: 'Hôm nay con tôi xin nghỉ vì bị ốm.',
      },
      {
        cell_id: "70d7f1a7-562b-4d5e-b361-50fb578bdf2c",
        word: 'tugas anak',
        meaning_vi: 'bài tập/việc được giao của con',
        meaning_en: 'child’s assignment or homework',
        example: 'Saya ingin memastikan tugas anak saya.',
        example_vi: 'Tôi muốn xác nhận bài tập của con tôi.',
      },
      {
        cell_id: "b05043e5-d4cd-44ec-934f-efbf5ba71222",
        word: 'pengumuman sekolah',
        meaning_vi: 'thông báo của trường',
        meaning_en: 'school announcement',
        example: 'Pengumuman sekolah dikirim sore ini.',
        example_vi: 'Thông báo của trường được gửi chiều nay.',
      },
      {
        cell_id: "dcad91ce-2031-405a-94d4-45dca0b62322",
        word: 'wali kelas',
        meaning_vi: 'giáo viên chủ nhiệm',
        meaning_en: 'homeroom teacher',
        example: 'Silakan hubungi wali kelas kalau anak belum masuk.',
        example_vi: 'Vui lòng liên hệ giáo viên chủ nhiệm nếu con chưa vào lớp.',
      },
      {
        cell_id: "336f78b3-0900-4ad0-94c1-17a31fa9b942",
        word: 'sopan santun chat',
        meaning_vi: 'phép lịch sự khi nhắn tin',
        meaning_en: 'chat etiquette',
        example: 'Sopan santun chat penting saat menghubungi guru.',
        example_vi: 'Phép lịch sự khi nhắn tin rất quan trọng khi liên hệ giáo viên.',
      },
    ],
    dialogue: [
      {
        cell_id: "8ce5623b-8626-415e-84f0-bf9b6944cc5f",
        speaker: 'Orang Tua',
        line: 'Selamat pagi, Bu. Maaf mengganggu. Hari ini anak saya izin sakit.',
        vi: 'Chào buổi sáng cô. Xin lỗi làm phiền. Hôm nay con tôi xin nghỉ vì bị ốm.',
        en: 'Good morning, Ma’am. Sorry to bother you. My child is absent due to illness today.',
      },
      {
        cell_id: "df6ff226-c76e-4674-9bc8-dc2ed456eb1e",
        speaker: 'Guru',
        line: 'Selamat pagi. Baik, semoga lekas sembuh. Tolong kirim surat izin ya, Bu.',
        vi: 'Chào buổi sáng. Vâng, mong bé mau khỏe. Chị vui lòng gửi giấy xin phép nhé.',
        en: 'Good morning. All right, I hope your child gets well soon. Please send a leave note.',
      },
      {
        cell_id: "379f3d40-4da0-4765-9bd9-5a6c38076709",
        speaker: 'Orang Tua',
        line: 'Baik, Bu. Nanti saya kirim foto surat izin ke wali kelas.',
        vi: 'Vâng cô. Lát nữa tôi sẽ gửi ảnh giấy xin phép cho giáo viên chủ nhiệm.',
        en: 'Sure. I will send a photo of the leave note to the homeroom teacher later.',
      },
      {
        cell_id: "bdbfc944-badb-41f8-a902-38558cac0550",
        speaker: 'Orang Tua',
        line: 'Apakah ada tugas yang perlu dikerjakan di rumah?',
        vi: 'Có bài tập nào cần làm ở nhà không?',
        en: 'Is there any assignment that needs to be done at home?',
      },
      {
        cell_id: "5fe6fa06-3c6d-4379-a68b-5c08d1bb62a5",
        speaker: 'Guru',
        line: 'Ada tugas matematika. Detailnya sudah saya kirim di grup WhatsApp kelas.',
        vi: 'Có bài tập toán. Chi tiết tôi đã gửi trong nhóm WhatsApp lớp.',
        en: 'There is a math assignment. I already sent the details in the class WhatsApp group.',
      },
      {
        cell_id: "d4e1b5ae-8b51-464b-bc0e-048421f430b0",
        speaker: 'Orang Tua',
        line: 'Terima kasih atas informasinya, Bu.',
        vi: 'Cảm ơn cô về thông tin đó.',
        en: 'Thank you for the information, Ma’am.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, nhóm WhatsApp lớp rất phổ biến để giáo viên gửi pengumuman sekolah, jadwal ujian, tugas, hoặc thông tin acara sekolah.',
      'Khi nhắn giáo viên, phụ huynh thường dùng Pak/Bu, salam ngắn, và câu xin lỗi nếu nhắn ngoài giờ. Ví dụ: Maaf mengganggu, Bu.',
      'Izin sakit nên nêu ngắn gọn: anak saya izin sakit hari ini. Nếu trường cần giấy, dùng surat izin hoặc surat dokter.',
      'Trong nhóm lớp, nên phản hồi ngắn gọn và không spam. Nếu câu hỏi riêng về con mình, tốt hơn nhắn pribadi ke wali kelas.',
    ],
    cultural_notes_en: [
      'In Indonesia, class WhatsApp groups are very common for school announcements, exam schedules, assignments, and school event information.',
      'When messaging a teacher, parents usually use Pak/Bu, a short greeting, and an apology if messaging outside school hours. Example: Maaf mengganggu, Bu.',
      'For sick leave, keep the message brief: anak saya izin sakit hari ini. If the school needs documentation, use surat izin or surat dokter.',
      'In the class group, reply briefly and avoid spamming. If the question is only about your child, it is better to message the homeroom teacher privately.',
    ],
    tip_advice_vi: [
      'Khung lịch sự: Selamat pagi, Bu/Pak. Maaf mengganggu. Saya mau tanya... Dùng được khi nhắn giáo viên.',
      'Để xin nghỉ: Hari ini anak saya izin sakit. Nếu muốn lịch sự hơn, thêm Mohon izin.',
      'Để hỏi bài tập: Apakah ada tugas yang harus dikumpulkan besok? Từ dikumpulkan nghĩa là được nộp/thu lại.',
      'Khi đã hiểu thông báo, chỉ cần Terima kasih atas informasinya. Không cần trả lời dài trong nhóm lớp.',
    ],
    tip_advice_en: [
      'Polite frame: Selamat pagi, Bu/Pak. Maaf mengganggu. Saya mau tanya... Use it when messaging a teacher.',
      'For absence due to illness: Hari ini anak saya izin sakit. To sound more polite, add Mohon izin.',
      'To ask about homework: Apakah ada tugas yang harus dikumpulkan besok? Dikumpulkan means submitted or collected.',
      'When you understand an announcement, Terima kasih atas informasinya is enough. Long replies are not needed in the class group.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Maaf, hari ini anak saya ____ sakit.',
        answer: 'izin',
        explanation_vi: 'Izin sakit là cụm tự nhiên để nói xin nghỉ vì bị ốm.',
        explanation_en: 'Izin sakit is the natural phrase for being absent because of illness.',
      },
      {
        type: 'choice',
        prompt: 'Which sentence is the most polite way to start a private chat with a teacher?',
        answer: 'Selamat pagi, Bu. Maaf mengganggu. Saya mau tanya tentang tugas anak saya.',
        explanation_vi: 'Câu này có chào hỏi, xin lỗi làm phiền, và nêu mục đích rõ ràng.',
        explanation_en: 'This sentence has a greeting, a polite apology for interrupting, and a clear purpose.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Thank you for the information, Sir.',
        answer: 'Terima kasih atas informasinya, Pak.',
        explanation_vi: 'Atas informasinya là cách lịch sự để nói "về thông tin đó". Pak dùng cho thầy/nam giới.',
        explanation_en: 'Atas informasinya is a polite way to say "for the information." Pak is used for a male teacher or respectful male address.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask whether there is any homework that must be submitted tomorrow.',
        answer: 'Apakah ada tugas yang harus dikumpulkan besok?',
        explanation_vi: 'Apakah mở câu hỏi có/không; tugas là bài tập; dikumpulkan besok là nộp vào ngày mai.',
        explanation_en: 'Apakah starts a yes/no question; tugas means assignment; dikumpulkan besok means submitted tomorrow.',
      },
    ],
  },
];
