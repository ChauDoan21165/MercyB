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
    id: 'advanced-formal-apologies',
    title: 'Mohon maaf, kekeliruan, dan tindak lanjut formal',
    level: 'B2',
    topic: 'formal apologies, mistakes, delays, responsibility, follow-up, corrections, formal language, maintaining relationships',
    vietnamese_title: 'Lời xin lỗi trang trọng, sai sót và cách xử lý',
    english_title: 'Advanced formal apologies',
    pronunciation_focus: [
      'Mohon maaf là cách xin lỗi rất trang trọng. Mohon terdengar lebih sopan dan sering dipakai dalam email atau rapat.',
      'Kekeliruan nghĩa là sai sót/lỗi nhầm lẫn. Từ ini terdengar lebih formal daripada kesalahan dalam banyak konteks.',
      'Keterlambatan nghĩa là sự chậm trễ. Dùng cho jadwal, pengiriman, respons, atau pertemuan.',
      'Tanggung jawab nghĩa là trách nhiệm. Dalam konteks formal, sering đi với frasa mengambil tanggung jawab.',
      'Tindak lanjut nghĩa là bước tiếp theo để xử lý. Cụm ini sangat umum trong công việc, dịch vụ, dan laporan.',
      'Meningkatkan hubungan nghĩa là duy trì/cải thiện quan hệ. Dalam kalimat formal, menjaga hubungan tetap baik rất tự nhiên.',
    ],
    pronunciation_focus_en: [
      'Mohon maaf is a very formal apology. Mohon sounds more polite and is common in email or meetings.',
      'Kekeliruan means mistake/error. It sounds more formal than kesalahan in many contexts.',
      'Keterlambatan means delay. Use it for schedules, deliveries, responses, or meetings.',
      'Tanggung jawab means responsibility. In formal contexts, it often appears with mengambil tanggung jawab.',
      'Tindak lanjut means next steps or follow-up action. It is very common in work, service, and reporting contexts.',
      'Menjaga hubungan tetap baik means maintaining a good relationship. In formal language, this is very natural.',
    ],
    sentences: [
      {
        en: 'Mohon maaf atas keterlambatan respons saya.',
        vi: 'Xin lỗi vì sự chậm trễ trong phản hồi của tôi.',
        pronunciation: 'MO-hon MA-af A-tas ke-ter-lam-BA-tan res-PONS SA-ya',
      },
      {
        en: 'Kami mengakui ada kekeliruan dalam data yang kami kirim.',
        vi: 'Chúng tôi thừa nhận có sai sót trong dữ liệu mà chúng tôi đã gửi.',
        pronunciation: 'KA-mi me-nga-KU-i A-da ke-ke-li-RU-an da-LAM DA-ta yang KA-mi KI-rim',
      },
      {
        en: 'Saya bertanggung jawab penuh atas kesalahan ini.',
        vi: 'Tôi chịu hoàn toàn trách nhiệm về lỗi này.',
        pronunciation: 'SA-ya ber-tang-GUNG ja-WAB pe-NUH A-tas ke-sa-LA-han I-ni',
      },
      {
        en: 'Kami sudah menyiapkan tindak lanjut untuk memperbaikinya.',
        vi: 'Chúng tôi đã chuẩn bị bước xử lý tiếp theo để khắc phục.',
        pronunciation: 'KA-mi SU-dah men-yi-a-PKAN tin-DAK lan-JUT UN-tuk mem-per-BAI-ki-nya',
      },
      {
        en: 'Mohon beri kami waktu untuk mengecek kembali.',
        vi: 'Xin vui lòng cho chúng tôi thời gian để kiểm tra lại.',
        pronunciation: 'MO-hon BE-ri KA-mi WAK-tu UN-tuk me-NGE-cek kem-BA-li',
      },
      {
        en: 'Kami akan mengirim surat penjelasan resmi hari ini.',
        vi: 'Chúng tôi sẽ gửi thư giải thích chính thức hôm nay.',
        pronunciation: 'KA-mi A-kan me-NGI-rim su-RAT pen-je-LAS-an res-MI HA-ri i-ni',
      },
      {
        en: 'Jika perlu, kami siap memberikan kompensasi yang wajar.',
        vi: 'Nếu cần, chúng tôi sẵn sàng đưa ra bồi thường hợp lý.',
        pronunciation: 'JI-ka per-LU KA-mi si-AP mem-be-ri-KAN kom-pen-SA-si yang WA-jar',
      },
      {
        en: 'Saya ingin menjaga hubungan baik dengan semua pihak.',
        vi: 'Tôi muốn giữ quan hệ tốt với tất cả các bên.',
        pronunciation: 'SA-ya I-ngin men-JA-ga hu-BUNG-an ba-IK de-NGAN se-MU-a PI-hak',
      },
    ],
    vocabulary: [
      {
        word: 'mohon maaf',
        meaning_vi: 'xin lỗi trang trọng',
        meaning_en: 'please accept my apologies',
        example: 'Mohon maaf atas gangguan ini.',
        example_vi: 'Xin lỗi vì sự phiền toái này.',
      },
      {
        word: 'kekeliruan',
        meaning_vi: 'sai sót, nhầm lẫn',
        meaning_en: 'mistake, error',
        example: 'Ada kekeliruan dalam email sebelumnya.',
        example_vi: 'Có sai sót trong email trước đó.',
      },
      {
        word: 'keterlambatan',
        meaning_vi: 'sự chậm trễ',
        meaning_en: 'delay, lateness',
        example: 'Keterlambatan terjadi karena cuaca buruk.',
        example_vi: 'Sự chậm trễ xảy ra do thời tiết xấu.',
      },
      {
        word: 'tanggung jawab',
        meaning_vi: 'trách nhiệm',
        meaning_en: 'responsibility',
        example: 'Kami mengambil tanggung jawab penuh.',
        example_vi: 'Chúng tôi nhận hoàn toàn trách nhiệm.',
      },
      {
        word: 'tindak lanjut',
        meaning_vi: 'bước xử lý tiếp theo',
        meaning_en: 'follow-up action',
        example: 'Tindak lanjut akan dibahas besok pagi.',
        example_vi: 'Bước xử lý tiếp theo sẽ được bàn sáng mai.',
      },
      {
        word: 'surat penjelasan',
        meaning_vi: 'thư giải thích',
        meaning_en: 'explanatory letter',
        example: 'Kami sudah menyiapkan surat penjelasan resmi.',
        example_vi: 'Chúng tôi đã chuẩn bị thư giải thích chính thức.',
      },
      {
        word: 'kompensasi',
        meaning_vi: 'bồi thường, đền bù',
        meaning_en: 'compensation',
        example: 'Perusahaan menawarkan kompensasi yang wajar.',
        example_vi: 'Công ty đề nghị mức bồi thường hợp lý.',
      },
      {
        word: 'hubungan baik',
        meaning_vi: 'quan hệ tốt',
        meaning_en: 'good relationship',
        example: 'Kami ingin menjaga hubungan baik dengan klien.',
        example_vi: 'Chúng tôi muốn giữ quan hệ tốt với khách hàng.',
      },
    ],
    dialogue: [
      {
        speaker: 'Karyawan',
        line: 'Mohon maaf atas keterlambatan respons saya.',
        vi: 'Xin lỗi vì sự chậm trễ trong phản hồi của tôi.',
        en: 'Please accept my apologies for the delay in my response.',
      },
      {
        speaker: 'Manajer',
        line: 'Tidak apa-apa. Apa ada kekeliruan dalam data yang dikirim?',
        vi: 'Không sao. Có sai sót nào trong dữ liệu đã gửi không?',
        en: 'No problem. Was there any mistake in the data sent?',
      },
      {
        speaker: 'Karyawan',
        line: 'Ya, kami menemukan kekeliruan dan sudah menyiapkan tindak lanjut.',
        vi: 'Vâng, chúng tôi đã phát hiện sai sót và đã chuẩn bị bước xử lý tiếp theo.',
        en: 'Yes, we found an error and have already prepared the follow-up action.',
      },
      {
        speaker: 'Manajer',
        line: 'Baik. Tolong kirim surat penjelasan resmi hari ini.',
        vi: 'Được. Vui lòng gửi thư giải thích chính thức hôm nay.',
        en: 'All right. Please send an official explanatory letter today.',
      },
      {
        speaker: 'Karyawan',
        line: 'Tentu. Kami bertanggung jawab penuh atas kesalahan ini.',
        vi: 'Chắc chắn rồi. Chúng tôi chịu hoàn toàn trách nhiệm về lỗi này.',
        en: 'Certainly. We take full responsibility for this mistake.',
      },
      {
        speaker: 'Manajer',
        line: 'Terima kasih. Yang penting, hubungan baik tetap terjaga.',
        vi: 'Cảm ơn. Điều quan trọng là vẫn giữ được quan hệ tốt.',
        en: 'Thank you. What matters is that the good relationship is preserved.',
      },
    ],
    cultural_notes_vi: [
      'Dalam email, surat, atau rapat di Indonesia, mohon maaf sering dipakai sebelum inti pesan, terutama jika ada keterlambatan, revisi, atau kesalahan layanan.',
      'Bahasa formal cenderung memakai struktur yang jelas: mengakui kekeliruan, menjelaskan tindak lanjut, dan menegaskan tanggung jawab tanpa terlalu defensif.',
      'Jika situasinya sensitif, kalimat seperti Kami mohon pengertian Anda atau Kami akan menindaklanjuti secepatnya terdengar sangat natural dan sopan.',
      'Menjaga hubungan baik sangat penting dalam konteks kerja. Karena itu, nada biasanya fokus pada solusi, bukan mencari siapa yang salah.',
    ],
    cultural_notes_en: [
      'In Indonesian email, letters, or meetings, mohon maaf is often used before the main message, especially when there is a delay, revision, or service error.',
      'Formal language usually follows a clear structure: acknowledge the mistake, explain the follow-up, and state responsibility without sounding overly defensive.',
      'If the situation is sensitive, phrases like Kami mohon pengertian Anda or Kami akan menindaklanjuti secepatnya sound very natural and polite.',
      'Maintaining good relationships is important in work contexts. The tone therefore usually focuses on solutions, not on blaming someone.',
    ],
    tip_advice_vi: [
      'Khung an toàn: Mohon maaf atas..., kami mengakui..., kami akan..., mohon beri kami waktu.... Đây là chuỗi rất tự nhiên trong thư formal.',
      'Nếu cần nhận trách nhiệm, dùng bertanggung jawab penuh atas... thay vì né tránh hoặc dùng câu quá dài.',
      'Untuk tindak lanjut, động từ hữu ích là menindaklanjuti, memperbaiki, mengecek kembali, dan mengirim surat penjelasan.',
      'Khi muốn giữ quan hệ, thêm câu penutup như Terima kasih atas pengertiannya hoặc Kami menghargai kerja samanya.',
    ],
    tip_advice_en: [
      'Safe frame: Mohon maaf atas..., kami mengakui..., kami akan..., mohon beri kami waktu.... This is a very natural sequence in formal writing.',
      'If you need to accept responsibility, use bertanggung jawab penuh atas... rather than avoiding it or making the sentence too long.',
      'For follow-up action, useful verbs are menindaklanjuti, memperbaiki, mengecek kembali, and mengirim surat penjelasan.',
      'To maintain the relationship, add a closing line such as Terima kasih atas pengertiannya or Kami menghargai kerja samanya.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Mohon maaf atas ____ respons saya.',
        answer: 'keterlambatan',
        explanation_vi: 'Keterlambatan là sự chậm trễ, rất tự nhiên trong xin lỗi trang trọng.',
        explanation_en: 'Keterlambatan means delay, which is very natural in a formal apology.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase is the most formal apology opener?',
        answer: 'mohon maaf',
        explanation_vi: 'Mohon maaf lịch sự và trang trọng hơn maaf saja trong email hoặc thư.',
        explanation_en: 'Mohon maaf is more polite and formal than just maaf in email or letters.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: We have prepared the follow-up action.',
        answer: 'Kami sudah menyiapkan tindak lanjut.',
        explanation_vi: 'Kami sudah = chúng tôi đã; menyiapkan = chuẩn bị; tindak lanjut = bước xử lý tiếp theo.',
        explanation_en: 'Kami sudah = we have already; menyiapkan = prepared; tindak lanjut = follow-up action.',
      },
      {
        type: 'roleplay',
        prompt: 'Apologize formally for a mistake and say you will send an official explanation today.',
        answer: 'Mohon maaf atas kekeliruan ini. Kami akan mengirim surat penjelasan resmi hari ini.',
        explanation_vi: 'Dùng mohon maaf atas + kekeliruan ini để nhận lỗi; sau đó nêu tindak lanjut rõ ràng.',
        explanation_en: 'Use mohon maaf atas + kekeliruan ini to accept the mistake, then state the follow-up clearly.',
      },
    ],
  },
];
