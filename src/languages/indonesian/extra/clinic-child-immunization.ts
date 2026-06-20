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
    id: 'clinic-child-immunization',
    title: 'Imunisasi anak di klinik dan puskesmas',
    level: 'A2',
    topic: 'child immunization, vaccine schedule, immunization card, mild fever, Posyandu, puskesmas, queue, midwife',
    vietnamese_title: 'Tiêm chủng cho trẻ ở phòng khám và puskesmas',
    english_title: 'Child Immunization at the Clinic',
    pronunciation_focus: [
      'Imunisasi anak nghĩa là tiêm/chủng ngừa cho trẻ. Vaksin là thuốc/vắc-xin; imunisasi là hoạt động hoặc lịch tiêm.',
      'Jadwal vaksin nghĩa là lịch vắc-xin. Jadwal imunisasi cũng rất tự nhiên trong puskesmas atau Posyandu.',
      'Kartu imunisasi là thẻ tiêm chủng. Ở nhiều nơi thông tin cũng được ghi trong buku KIA.',
      'Demam ringan nghĩa là sốt nhẹ. Ringan nghĩa là nhẹ, còn berat nghĩa là nặng.',
      'Puskesmas là pusat kesehatan masyarakat, trạm/y tế công cộng cấp địa phương. Đọc pus-KES-mas.',
      'Bidan nghĩa là nữ hộ sinh/hộ sinh. Ở puskesmas và Posyandu, bidan thường hỗ trợ ibu dan anak.',
    ],
    pronunciation_focus_en: [
      'Imunisasi anak means child immunization. Vaksin is the vaccine; imunisasi is the activity or schedule.',
      'Jadwal vaksin means vaccine schedule. Jadwal imunisasi is also very natural at a puskesmas or Posyandu.',
      'Kartu imunisasi is the immunization card. In many places, the information is also recorded in the buku KIA.',
      'Demam ringan means mild fever. Ringan means light/mild, while berat means heavy/severe.',
      'Puskesmas is the local public health center. It is pronounced pus-KES-mas.',
      'Bidan means midwife. At puskesmas and Posyandu, a bidan often helps with mother-and-child health.',
    ],
    sentences: [
      {
        en: 'Saya mau imunisasi anak saya hari ini.',
        vi: 'Hôm nay tôi muốn tiêm chủng cho con tôi.',
        pronunciation: 'SA-ya mau i-mu-ni-SA-si A-nak SA-ya HA-ri i-ni',
      },
      {
        en: 'Apakah jadwal vaksin anak saya sudah benar?',
        vi: 'Lịch vắc-xin của con tôi đã đúng chưa?',
        pronunciation: 'a-PA-kah JAD-wal VAK-sin A-nak SA-ya SU-dah be-NAR',
      },
      {
        en: 'Ini kartu imunisasi dan buku KIA anak saya.',
        vi: 'Đây là thẻ tiêm chủng và sổ KIA của con tôi.',
        pronunciation: 'I-ni KAR-tu i-mu-ni-SA-si dan BU-ku ka-i-a A-nak SA-ya',
      },
      {
        en: 'Kami sudah ambil nomor antrean di puskesmas.',
        vi: 'Chúng tôi đã lấy số thứ tự ở puskesmas.',
        pronunciation: 'KA-mi SU-dah AM-bil NO-mor AN-tre-an di pus-KES-mas',
      },
      {
        en: 'Bidan akan memeriksa kartu imunisasi dulu.',
        vi: 'Hộ sinh sẽ kiểm tra thẻ tiêm chủng trước.',
        pronunciation: 'BI-dan A-kan me-me-RIK-sa KAR-tu i-mu-ni-SA-si DU-lu',
      },
      {
        en: 'Setelah imunisasi, anak bisa demam ringan.',
        vi: 'Sau khi tiêm chủng, trẻ có thể sốt nhẹ.',
        pronunciation: 'se-TE-lah i-mu-ni-SA-si A-nak BI-sa de-MAM RIN-gan',
      },
      {
        en: 'Kapan harus kembali untuk imunisasi berikutnya?',
        vi: 'Khi nào phải quay lại cho lần tiêm chủng tiếp theo?',
        pronunciation: 'KA-pan HA-rus kem-BA-li UN-tuk i-mu-ni-SA-si be-RI-kut-nya',
      },
      {
        en: 'Tolong catat tanggal vaksin di kartu imunisasi.',
        vi: 'Vui lòng ghi ngày tiêm vắc-xin vào thẻ tiêm chủng.',
        pronunciation: 'TO-long CA-tat TANG-gal VAK-sin di KAR-tu i-mu-ni-SA-si',
      },
    ],
    vocabulary: [
      {
        word: 'imunisasi anak',
        meaning_vi: 'tiêm/chủng ngừa cho trẻ',
        meaning_en: 'child immunization',
        example: 'Imunisasi anak dilakukan sesuai jadwal.',
        example_vi: 'Tiêm chủng cho trẻ được thực hiện theo lịch.',
      },
      {
        word: 'jadwal vaksin',
        meaning_vi: 'lịch vắc-xin',
        meaning_en: 'vaccine schedule',
        example: 'Jadwal vaksin berikutnya bulan depan.',
        example_vi: 'Lịch vắc-xin tiếp theo là tháng sau.',
      },
      {
        word: 'kartu imunisasi',
        meaning_vi: 'thẻ tiêm chủng',
        meaning_en: 'immunization card',
        example: 'Jangan lupa membawa kartu imunisasi.',
        example_vi: 'Đừng quên mang thẻ tiêm chủng.',
      },
      {
        word: 'demam ringan',
        meaning_vi: 'sốt nhẹ',
        meaning_en: 'mild fever',
        example: 'Anak saya demam ringan setelah vaksin.',
        example_vi: 'Con tôi sốt nhẹ sau khi tiêm vắc-xin.',
      },
      {
        word: 'Posyandu',
        meaning_vi: 'điểm y tế cộng đồng ở khu dân cư',
        meaning_en: 'community health post',
        example: 'Posyandu membantu mengecek jadwal imunisasi.',
        example_vi: 'Posyandu hỗ trợ kiểm tra lịch tiêm chủng.',
      },
      {
        word: 'puskesmas',
        meaning_vi: 'trung tâm y tế công cộng địa phương',
        meaning_en: 'local public health center',
        example: 'Kami datang ke puskesmas untuk imunisasi.',
        example_vi: 'Chúng tôi đến puskesmas để tiêm chủng.',
      },
      {
        word: 'antrean',
        meaning_vi: 'hàng chờ, số/lượt chờ',
        meaning_en: 'queue',
        example: 'Antrean imunisasi cukup panjang pagi ini.',
        example_vi: 'Hàng chờ tiêm chủng khá dài sáng nay.',
      },
      {
        word: 'bidan',
        meaning_vi: 'hộ sinh, nữ hộ sinh',
        meaning_en: 'midwife',
        example: 'Bidan menjelaskan jadwal vaksin berikutnya.',
        example_vi: 'Hộ sinh giải thích lịch vắc-xin tiếp theo.',
      },
    ],
    dialogue: [
      {
        speaker: 'Orang Tua',
        line: 'Selamat pagi, Bu. Saya mau imunisasi anak saya.',
        vi: 'Chào buổi sáng cô/chị. Tôi muốn tiêm chủng cho con tôi.',
        en: 'Good morning. I want my child to get immunized.',
      },
      {
        speaker: 'Petugas',
        line: 'Selamat pagi. Silakan ambil nomor antrean dulu.',
        vi: 'Chào buổi sáng. Mời lấy số thứ tự trước.',
        en: 'Good morning. Please take a queue number first.',
      },
      {
        speaker: 'Orang Tua',
        line: 'Ini kartu imunisasi dan buku KIA anak saya.',
        vi: 'Đây là thẻ tiêm chủng và sổ KIA của con tôi.',
        en: 'This is my child’s immunization card and KIA book.',
      },
      {
        speaker: 'Bidan',
        line: 'Baik, saya cek jadwal vaksinnya dulu.',
        vi: 'Vâng, tôi kiểm tra lịch vắc-xin trước.',
        en: 'All right, I will check the vaccine schedule first.',
      },
      {
        speaker: 'Orang Tua',
        line: 'Kalau anak demam ringan setelah imunisasi, saya harus bagaimana?',
        vi: 'Nếu con sốt nhẹ sau khi tiêm chủng, tôi phải làm thế nào?',
        en: 'If my child has a mild fever after immunization, what should I do?',
      },
      {
        speaker: 'Bidan',
        line: 'Nanti saya jelaskan. Jangan lupa kembali sesuai jadwal berikutnya.',
        vi: 'Lát nữa tôi sẽ giải thích. Đừng quên quay lại theo lịch tiếp theo.',
        en: 'I will explain later. Do not forget to return according to the next schedule.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, imunisasi anak có thể được thực hiện tại Posyandu, puskesmas, klinik, hoặc rumah sakit tùy nơi ở và loại layanan.',
      'Kartu imunisasi và buku KIA giúp ghi tanggal vaksin, jenis vaksin, và jadwal berikutnya. Khi đi tiêm nên mang cả hai nếu có.',
      'Bidan, perawat, hoặc dokter có thể giải thích jadwal vaksin và phản ứng thông thường như demam ringan.',
      'Antrean ở puskesmas có thể đông vào buổi sáng, nên nhiều gia đình datang lebih awal untuk mengambil nomor antrean.',
    ],
    cultural_notes_en: [
      'In Indonesia, child immunization may happen at Posyandu, a puskesmas, clinic, or hospital depending on location and service type.',
      'The immunization card and buku KIA record vaccine dates, vaccine types, and next schedules. Bring both if available.',
      'A midwife, nurse, or doctor may explain the vaccine schedule and common reactions such as mild fever.',
      'Queues at puskesmas can be busy in the morning, so many families arrive early to get a queue number.',
    ],
    tip_advice_vi: [
      'Câu hỏi hữu ích: Kapan imunisasi berikutnya? hoặc Kapan harus kembali? đều hỏi lịch lần sau.',
      'Khi hỏi về lịch, dùng jadwal vaksin hoặc jadwal imunisasi. Cả hai đều tự nhiên trong ngữ cảnh y tế trẻ em.',
      'Dùng catat khi muốn nhân viên ghi thông tin: Tolong catat tanggal vaksin di kartu imunisasi.',
      'Demam ringan là sốt nhẹ; nếu muốn hỏi lời khuyên, dùng khung aman: Sebaiknya saya bagaimana?',
    ],
    tip_advice_en: [
      'Useful questions: Kapan imunisasi berikutnya? or Kapan harus kembali? both ask about the next schedule.',
      'For schedules, use jadwal vaksin or jadwal imunisasi. Both are natural in child-health settings.',
      'Use catat when asking staff to record information: Tolong catat tanggal vaksin di kartu imunisasi.',
      'Demam ringan means mild fever; to ask for advice, use the safe frame: Sebaiknya saya bagaimana?',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Tolong catat tanggal vaksin di kartu ____.',
        answer: 'imunisasi',
        explanation_vi: 'Kartu imunisasi là thẻ tiêm chủng, nơi ghi lịch và ngày tiêm.',
        explanation_en: 'Kartu imunisasi is the immunization card where vaccine dates and schedules are recorded.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “mild fever”?',
        answer: 'demam ringan',
        explanation_vi: 'Demam là sốt; ringan là nhẹ.',
        explanation_en: 'Demam means fever; ringan means mild or light.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: When is the next vaccine schedule?',
        answer: 'Kapan jadwal vaksin berikutnya?',
        explanation_vi: 'Kapan hỏi khi nào; jadwal vaksin là lịch vắc-xin; berikutnya là tiếp theo.',
        explanation_en: 'Kapan asks when; jadwal vaksin is vaccine schedule; berikutnya means next.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell the clinic staff that you brought your child’s immunization card and KIA book.',
        answer: 'Ini kartu imunisasi dan buku KIA anak saya.',
        explanation_vi: 'Ini dùng để đưa giấy tờ; anak saya là con của tôi.',
        explanation_en: 'Ini is used when presenting documents; anak saya means my child.',
      },
    ],
  },
];
