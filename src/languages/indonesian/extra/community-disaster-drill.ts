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
    id: 'community-disaster-drill',
    title: 'Simulasi bencana dan latihan evakuasi warga',
    level: 'B1',
    topic: 'disaster drill, evacuation practice, siren, gathering point, volunteers, attendance list, staff instructions',
    vietnamese_title: 'Diễn tập bão lũ và luyện sơ tán cộng đồng',
    english_title: 'Community Disaster Drill',
    pronunciation_focus: [
      'Simulasi bencana nghĩa là mô phỏng/diễn tập bencana. Simulasi dipakai để latihan sebelum kejadian nyata.',
      'Latihan evakuasi nghĩa là thực hành sơ tán. Evakuasi = di chuyển ra khỏi area berbahaya.',
      'Sirene là còi báo động. Di Indonesia, sirene atau alarm dipakai untuk memberi tanda mulai latihan.',
      'Titik kumpul nghĩa là điểm tập trung. Dalam drill, titik kumpul sangat penting untuk cek semua orang sudah aman.',
      'Daftar hadir nghĩa là danh sách điểm danh. Hadir = có mặt; daftar hadir dipakai untuk memeriksa peserta.',
      'Instruksi petugas nghĩa là hướng dẫn của cán bộ/nhân viên. Petugas bisa dari RT, RW, BPBD, atau relawan.',
    ],
    pronunciation_focus_en: [
      'Simulasi bencana means disaster simulation or drill. Simulasi is used to practice before a real event.',
      'Latihan evakuasi means evacuation practice. Evakuasi = moving away from a dangerous area.',
      'Sirene means siren/alarm. In Indonesia, a siren or alarm is used to signal the start of the drill.',
      'Titik kumpul means assembly point. In a drill, this is important for checking that everyone is safe.',
      'Daftar hadir means attendance list. Hadir = present; daftar hadir is used to check participants.',
      'Instruksi petugas means staff instructions. The staff can be from RT, RW, BPBD, or volunteers.',
    ],
    sentences: [
      {
        en: 'Hari ini ada simulasi bencana di lingkungan kami.',
        vi: 'Hôm nay có diễn tập bão lũ trong khu dân cư của chúng tôi.',
        pronunciation: 'HA-ri i-NI A-da si-mu-LA-si ben-CA-na di ling-KUNG-an KA-mi',
      },
      {
        en: 'Semua warga harus ikut latihan evakuasi.',
        vi: 'Tất cả cư dân phải tham gia luyện sơ tán.',
        pronunciation: 'se-MU-a WAR-ga ha-RUS I-kut la-TIH-an e-va-ku-A-si',
      },
      {
        en: 'Tolong dengarkan instruksi petugas dengan baik.',
        vi: 'Vui lòng nghe hướng dẫn của nhân viên một cách cẩn thận.',
        pronunciation: 'TO-long de-ngar-KAN in-STRUK-si pe-TU-gas de-NGAN ba-IK',
      },
      {
        en: 'Kita berkumpul di titik kumpul utama.',
        vi: 'Chúng ta tập trung ở điểm tập trung chính.',
        pronunciation: 'KI-ta ber-KUM-pul di ti-TIK KUM-pul u-TA-ma',
      },
      {
        en: 'Saya sudah tanda tangan di daftar hadir.',
        vi: 'Tôi đã ký tên trong danh sách điểm danh.',
        pronunciation: 'SA-ya SU-dah TAN-da TAN-gan di DAF-tar ha-DIR',
      },
      {
        en: 'Relawan membantu mengarahkan peserta ke tempat aman.',
        vi: 'Tình nguyện viên giúp hướng dẫn người tham gia đến nơi an toàn.',
        pronunciation: 're-LA-wan mem-BAN-tu meng-a-RAH-kan pe-ser-TA ke TEM-pat A-man',
      },
      {
        en: 'Sirene berbunyi sebagai tanda mulai latihan.',
        vi: 'Còi báo động kêu như dấu hiệu bắt đầu luyện tập.',
        pronunciation: 'si-RE-ne ber-BU-nyi se-ba-GAI TAN-da mu-LAI la-TIH-an',
      },
      {
        en: 'Setelah selesai, kami kembali ke rumah masing-masing.',
        vi: 'Sau khi kết thúc, chúng tôi quay về nhà của mình.',
        pronunciation: 'se-TE-lah se-LE-sai KA-mi kem-BA-li ke RU-mah ma-SING ma-SING',
      },
    ],
    vocabulary: [
      {
        cell_id: "652b2936-0483-4b36-9c7a-446129449944",
        word: 'simulasi bencana',
        meaning_vi: 'diễn tập bão lũ / mô phỏng bencana',
        meaning_en: 'disaster drill',
        example: 'Simulasi bencana dilakukan setiap tahun.',
        example_vi: 'Diễn tập bão lũ được thực hiện mỗi năm.',
      },
      {
        cell_id: "f3cc5c8f-63ad-4ee4-9461-ee0b57b63fc9",
        word: 'latihan evakuasi',
        meaning_vi: 'luyện sơ tán',
        meaning_en: 'evacuation practice',
        example: 'Latihan evakuasi membuat warga lebih siap.',
        example_vi: 'Luyện sơ tán giúp cư dân sẵn sàng hơn.',
      },
      {
        cell_id: "5d86e4fc-4b03-4ef3-9585-e7587bece5dd",
        word: 'sirene',
        meaning_vi: 'còi báo động',
        meaning_en: 'siren',
        example: 'Sirene dibunyikan sebagai tanda mulai.',
        example_vi: 'Còi báo động được bật lên như dấu hiệu bắt đầu.',
      },
      {
        cell_id: "d6dfd45b-7914-4ec5-a2b0-5fe8a124f914",
        word: 'titik kumpul',
        meaning_vi: 'điểm tập trung',
        meaning_en: 'assembly point',
        example: 'Titik kumpul berada di lapangan sekolah.',
        example_vi: 'Điểm tập trung ở sân trường.',
      },
      {
        cell_id: "05f88fea-b58c-4e42-a15e-ee728ae52164",
        word: 'relawan',
        meaning_vi: 'tình nguyện viên',
        meaning_en: 'volunteer',
        example: 'Relawan membantu warga lanjut usia.',
        example_vi: 'Tình nguyện viên giúp người cao tuổi.',
      },
      {
        cell_id: "abc6f26a-0dd7-4182-bd6a-5f1dce0fe5e2",
        word: 'daftar hadir',
        meaning_vi: 'danh sách điểm danh',
        meaning_en: 'attendance list',
        example: 'Daftar hadir harus diisi semua peserta.',
        example_vi: 'Danh sách điểm danh phải được tất cả người tham gia điền.',
      },
      {
        cell_id: "40f340cf-b969-4046-b3f5-3da3b78c8018",
        word: 'instruksi petugas',
        meaning_vi: 'hướng dẫn của nhân viên/cán bộ',
        meaning_en: 'staff instructions',
        example: 'Ikuti instruksi petugas sampai selesai.',
        example_vi: 'Hãy theo hướng dẫn của nhân viên cho đến khi kết thúc.',
      },
      {
        cell_id: "2f8eeea4-9550-41f3-806e-ccdd1895d37d",
        word: 'area aman',
        meaning_vi: 'khu vực an toàn',
        meaning_en: 'safe area',
        example: 'Semua orang diarahkan ke area aman.',
        example_vi: 'Mọi người được hướng dẫn đến khu vực an toàn.',
      },
    ],
    dialogue: [
      {
        cell_id: "0b0ea09f-f87e-47dc-b242-cbbd3ccfa99f",
        speaker: 'Petugas',
        line: 'Selamat pagi, hari ini ada simulasi bencana.',
        vi: 'Chào buổi sáng, hôm nay có diễn tập bão lũ.',
        en: 'Good morning, today we have a disaster drill.',
      },
      {
        cell_id: "4dda1dab-b66a-4ca9-b42c-c9ebbf9d0093",
        speaker: 'Warga',
        line: 'Baik, kami akan ikut latihan evakuasi.',
        vi: 'Được, chúng tôi sẽ tham gia luyện sơ tán.',
        en: 'All right, we will join the evacuation practice.',
      },
      {
        cell_id: "4d3543c9-d648-442d-bf0d-abf49a20eaf2",
        speaker: 'Petugas',
        line: 'Tolong dengarkan instruksi petugas dan jangan panik.',
        vi: 'Vui lòng nghe hướng dẫn của nhân viên và đừng hoảng loạn.',
        en: 'Please listen to the staff instructions and do not panic.',
      },
      {
        cell_id: "27d148b3-7cf0-4f3c-8f42-8495323c2cf5",
        speaker: 'Warga',
        line: 'Kami berkumpul di titik kumpul utama, ya.',
        vi: 'Chúng tôi tập trung ở điểm tập trung chính nhé.',
        en: 'We gather at the main assembly point, okay.',
      },
      {
        cell_id: "ff64efe4-df1b-464d-8ec2-ad0c94cd585c",
        speaker: 'Relawan',
        line: 'Silakan isi daftar hadir sebelum masuk ke area aman.',
        vi: 'Vui lòng điền danh sách điểm danh trước khi vào khu vực an toàn.',
        en: 'Please fill in the attendance list before entering the safe area.',
      },
      {
        cell_id: "a54b049a-3936-4194-9a1a-57f330ee4ddc",
        speaker: 'Petugas',
        line: 'Terima kasih. Setelah selesai, semua peserta boleh pulang.',
        vi: 'Cảm ơn. Sau khi kết thúc, tất cả người tham gia có thể về.',
        en: 'Thank you. After it is finished, all participants may go home.',
      },
    ],
    cultural_notes_vi: [
      'Di Indonesia, simulasi bencana bisa dilakukan di sekolah, kantor, perumahan, masjid, atau lingkungan RT/RW. Tujuannya agar warga tahu apa yang harus dilakukan saat keadaan nyata.',
      'Titik kumpul biasanya ditentukan sebelum latihan dimulai. Peserta harus mendengar instruksi petugas, lalu mengumpulkan diri di sana untuk dicek.',
      'Daftar hadir penting untuk memastikan semua peserta sudah keluar dari area bahaya dan tidak ada yang tertinggal.',
      'Relawan atau petugas bisa memberi arahan tentang jalur evakuasi, prioritas anak-anak dan lansia, serta cara bergerak yang tenang.',
    ],
    cultural_notes_en: [
      'In Indonesia, disaster drills can happen at schools, offices, housing complexes, mosques, or RT/RW neighborhood areas. The goal is to help residents know what to do in a real emergency.',
      'The assembly point is usually chosen before the drill starts. Participants should listen to staff instructions and gather there for a headcount.',
      'An attendance list is important to make sure everyone has left the danger area and no one is left behind.',
      'Volunteers or staff may give directions about evacuation routes, priority for children and elderly people, and how to move calmly.',
    ],
    tip_advice_vi: [
      'Khung câu hữu ích: Tolong dengarkan instruksi petugas, Kita berkumpul di titik kumpul utama, và Saya sudah tanda tangan di daftar hadir.',
      'Khi latihan, jangan chỉ chạy nhanh. Lebih penting adalah mengikuti jalur evakuasi dan tetap tenang.',
      'Jika tidak tahu nơi tập trung, hỏi: Titik kumpul di mana? atau Kami harus ke mana?',
      'Dalam pengumuman resmi, kata kerja sering berbentuk pasif: dibunyikan, diarahkan, diisi, dikumpulkan.',
    ],
    tip_advice_en: [
      'Useful frames: Tolong dengarkan instruksi petugas, Kita berkumpul di titik kumpul utama, and Saya sudah tanda tangan di daftar hadir.',
      'During the drill, do not just run fast. It is more important to follow the evacuation route and stay calm.',
      'If you do not know the assembly point, ask: Titik kumpul di mana? or Kami harus ke mana?',
      'In official announcements, verbs are often passive: dibunyikan, diarahkan, diisi, dikumpulkan.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Semua warga harus ikut latihan ____.',
        answer: 'evakuasi',
        explanation_vi: 'Latihan evakuasi là luyện sơ tán.',
        explanation_en: 'Latihan evakuasi means evacuation practice.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “assembly point”?',
        answer: 'titik kumpul',
        explanation_vi: 'Titik kumpul là điểm tập trung của người tham gia.',
        explanation_en: 'Titik kumpul means the gathering or assembly point.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Please listen to the staff instructions.',
        answer: 'Tolong dengarkan instruksi petugas.',
        explanation_vi: 'Tolong dengarkan = vui lòng nghe; instruksi petugas = hướng dẫn của nhân viên/cán bộ.',
        explanation_en: 'Tolong dengarkan = please listen; instruksi petugas = staff instructions.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell the volunteer that you have already signed the attendance list and are waiting at the main assembly point.',
        answer: 'Saya sudah tanda tangan di daftar hadir. Kami berkumpul di titik kumpul utama.',
        explanation_vi: 'Tanda tangan di daftar hadir là ký tên vào danh sách điểm danh; titik kumpul utama là điểm tập trung chính.',
        explanation_en: 'Tanda tangan di daftar hadir = sign the attendance list; titik kumpul utama = main assembly point.',
      },
    ],
  },
];
