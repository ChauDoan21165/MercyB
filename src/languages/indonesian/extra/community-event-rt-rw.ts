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
    id: 'community-event-rt-rw',
    title: 'Rapat RT/RW dan acara lingkungan',
    level: 'A2',
    topic: 'RT/RW meeting, neighborhood dues, community cleanup, announcements, security, Independence Day events, attendance list',
    vietnamese_title: 'Họp RT/RW và hoạt động khu dân cư',
    english_title: 'Community Event RT/RW',
    pronunciation_focus: [
      'RT và RW là đơn vị dân cư địa phương. RT dibaca er-te, RW dibaca er-we; thường nói Pak RT, Bu RT, Pak RW.',
      'Rapat RT nghĩa là cuộc họp khu/tổ dân cư. Rapat đọc RA-pat, không phải "ra-pát" với âm sắc như tiếng Việt.',
      'Iuran warga là khoản đóng góp/phí cư dân. Hỏi số tiền dùng berapa: Berapa iuran warga bulan ini?',
      'Kerja bakti là hoạt động dọn dẹp/làm việc chung vì khu phố. Gần với gotong royong nhưng là hoạt động cụ thể.',
      'Keamanan lingkungan nghĩa là an ninh khu dân cư. Siskamling là hệ thống canh gác/an ninh cộng đồng ở nhiều nơi.',
      'Daftar hadir là danh sách ký tên điểm danh. Hadir nghĩa là có mặt; tidak hadir nghĩa là vắng mặt.',
    ],
    pronunciation_focus_en: [
      'RT and RW are local neighborhood units. RT is read er-te, RW is read er-we; people often say Pak RT, Bu RT, Pak RW.',
      'Rapat RT means a neighborhood meeting. Rapat is pronounced RA-pat, with a clean final -t.',
      'Iuran warga means neighborhood dues or resident contributions. Ask amounts with berapa: Berapa iuran warga bulan ini?',
      'Kerja bakti is a communal cleanup or service activity. It is related to gotong royong but refers to a concrete activity.',
      'Keamanan lingkungan means neighborhood security. Siskamling is a community security/watch system in many areas.',
      'Daftar hadir is an attendance list or sign-in sheet. Hadir means present; tidak hadir means absent.',
    ],
    sentences: [
      {
        en: 'Malam ini ada rapat RT di balai warga.',
        vi: 'Tối nay có họp RT ở nhà sinh hoạt khu dân cư.',
        pronunciation: 'MA-lam i-ni A-da RA-pat er-te di BA-lai WAR-ga',
      },
      {
        en: 'Saya mau membayar iuran warga bulan ini.',
        vi: 'Tôi muốn đóng khoản phí cư dân tháng này.',
        pronunciation: 'SA-ya mau mem-BA-yar I-u-ran WAR-ga BU-lan i-ni',
      },
      {
        en: 'Kapan jadwal kerja bakti minggu ini?',
        vi: 'Lịch lao động/dọn dẹp chung tuần này là khi nào?',
        pronunciation: 'KA-pan JAD-wal KER-ja BAK-ti MING-gu i-ni',
      },
      {
        en: 'Pengumuman dari Pak RT sudah dikirim di grup warga.',
        vi: 'Thông báo từ ông trưởng RT đã được gửi trong nhóm cư dân.',
        pronunciation: 'pe-ngu-MU-man DA-ri pak er-te SU-dah di-KI-rim di grup WAR-ga',
      },
      {
        en: 'Keamanan lingkungan perlu dijaga bersama.',
        vi: 'An ninh khu dân cư cần được cùng nhau giữ gìn.',
        pronunciation: 'ke-a-MA-nan ling-KUNG-an PER-lu di-JA-ga ber-SA-ma',
      },
      {
        en: 'Untuk acara 17 Agustus, warga diminta membawa makanan ringan.',
        vi: 'Đối với sự kiện 17 tháng 8, cư dân được yêu cầu mang đồ ăn nhẹ.',
        pronunciation: 'UN-tuk a-CA-ra tu-JUH be-LAS a-GUS-tus WAR-ga di-MIN-ta mem-BA-wa ma-KA-nan RI-ngan',
      },
      {
        en: 'Tolong isi daftar hadir sebelum rapat dimulai.',
        vi: 'Vui lòng điền danh sách điểm danh trước khi cuộc họp bắt đầu.',
        pronunciation: 'TO-long I-si DAF-tar HA-dir se-BE-lum RA-pat di-MU-lai',
      },
      {
        en: 'Kalau tidak bisa hadir, mohon kabari pengurus RT.',
        vi: 'Nếu không thể có mặt, xin báo cho ban quản lý RT.',
        pronunciation: 'KA-lau TI-dak BI-sa HA-dir MO-hon ka-BA-ri pe-NGU-rus er-te',
      },
    ],
    vocabulary: [
      {
        cell_id: "b0981ad8-bb47-47c1-9565-1fa1a3789961",
        word: 'rapat RT',
        meaning_vi: 'cuộc họp RT/khu dân cư',
        meaning_en: 'neighborhood RT meeting',
        example: 'Rapat RT dimulai jam delapan malam.',
        example_vi: 'Cuộc họp RT bắt đầu lúc tám giờ tối.',
      },
      {
        cell_id: "fc162039-695c-4c31-afc3-63c7842cf081",
        word: 'iuran warga',
        meaning_vi: 'khoản đóng góp/phí của cư dân',
        meaning_en: 'resident dues or neighborhood contribution',
        example: 'Iuran warga dipakai untuk kebersihan dan keamanan.',
        example_vi: 'Khoản phí cư dân được dùng cho vệ sinh và an ninh.',
      },
      {
        cell_id: "2b289bc3-1d5d-4199-bb71-ad427dffeba5",
        word: 'kerja bakti',
        meaning_vi: 'lao động/dọn dẹp chung vì cộng đồng',
        meaning_en: 'community cleanup or communal service',
        example: 'Hari Minggu ada kerja bakti membersihkan selokan.',
        example_vi: 'Chủ nhật có hoạt động dọn dẹp chung để làm sạch cống rãnh.',
      },
      {
        cell_id: "271196a2-602f-4e8d-9435-0b6e22822f5a",
        word: 'pengumuman',
        meaning_vi: 'thông báo',
        meaning_en: 'announcement',
        example: 'Pengumuman ditempel di papan informasi.',
        example_vi: 'Thông báo được dán trên bảng thông tin.',
      },
      {
        cell_id: "14f362c5-fd84-488c-b2a9-543031090e60",
        word: 'keamanan lingkungan',
        meaning_vi: 'an ninh khu dân cư',
        meaning_en: 'neighborhood security',
        example: 'Keamanan lingkungan dibahas dalam rapat RW.',
        example_vi: 'An ninh khu dân cư được thảo luận trong cuộc họp RW.',
      },
      {
        cell_id: "c3da6749-3fa8-4e5f-ac89-b37cd670f649",
        word: 'acara 17 Agustus',
        meaning_vi: 'sự kiện ngày 17 tháng 8, Quốc khánh Indonesia',
        meaning_en: 'August 17 Independence Day event',
        example: 'Anak-anak ikut lomba dalam acara 17 Agustus.',
        example_vi: 'Trẻ em tham gia cuộc thi trong sự kiện 17 tháng 8.',
      },
      {
        cell_id: "865d6317-4e48-4308-858d-f3f63de8a013",
        word: 'daftar hadir',
        meaning_vi: 'danh sách điểm danh/ký tên',
        meaning_en: 'attendance list or sign-in sheet',
        example: 'Daftar hadir ada di meja depan.',
        example_vi: 'Danh sách điểm danh ở bàn phía trước.',
      },
      {
        cell_id: "1bceca80-db1d-4adc-8f5d-430180e5d9ae",
        word: 'pengurus RT',
        meaning_vi: 'ban quản lý/người phụ trách RT',
        meaning_en: 'RT neighborhood committee or officers',
        example: 'Pengurus RT membantu mengatur acara warga.',
        example_vi: 'Ban RT giúp tổ chức sự kiện cư dân.',
      },
    ],
    dialogue: [
      {
        cell_id: "3ba357ae-88cd-4c58-b417-2fa18f1447f6",
        speaker: 'Warga Baru',
        line: 'Selamat malam, Pak. Saya warga baru di RT ini.',
        vi: 'Chào buổi tối bác/anh. Tôi là cư dân mới ở RT này.',
        en: 'Good evening, Sir. I am a new resident in this RT.',
      },
      {
        cell_id: "bb945afc-1e0d-4084-82ea-eac53b2947af",
        speaker: 'Pak RT',
        line: 'Selamat malam. Silakan isi daftar hadir dulu.',
        vi: 'Chào buổi tối. Mời điền danh sách điểm danh trước.',
        en: 'Good evening. Please fill in the attendance list first.',
      },
      {
        cell_id: "2d78ced7-b426-4b0e-9ee4-358407657ffb",
        speaker: 'Warga Baru',
        line: 'Baik, Pak. Berapa iuran warga per bulan?',
        vi: 'Vâng. Khoản phí cư dân mỗi tháng là bao nhiêu?',
        en: 'All right. How much are the neighborhood dues per month?',
      },
      {
        cell_id: "19fa0f58-8e4d-4b00-b5f9-dc02d1ca91ee",
        speaker: 'Pak RT',
        line: 'Iuran bulan ini lima puluh ribu rupiah untuk kebersihan dan keamanan.',
        vi: 'Khoản phí tháng này là năm mươi nghìn rupiah cho vệ sinh và an ninh.',
        en: 'This month’s dues are fifty thousand rupiah for cleanliness and security.',
      },
      {
        cell_id: "39bcbe97-0473-4806-a3f9-0e2cdc88ecaa",
        speaker: 'Warga Baru',
        line: 'Apakah minggu ini ada kerja bakti?',
        vi: 'Tuần này có lao động/dọn dẹp chung không?',
        en: 'Is there a community cleanup this week?',
      },
      {
        cell_id: "4f8cfb53-7ccc-46f2-b655-a61466adad24",
        speaker: 'Pak RT',
        line: 'Ada. Hari Minggu pagi, sekaligus persiapan acara 17 Agustus.',
        vi: 'Có. Sáng Chủ nhật, đồng thời chuẩn bị cho sự kiện 17 tháng 8.',
        en: 'Yes. Sunday morning, and it is also preparation for the August 17 event.',
      },
    ],
    cultural_notes_vi: [
      'RT (Rukun Tetangga) và RW (Rukun Warga) là cấu trúc quản lý cộng đồng rất quen thuộc ở Indonesia. Người mới chuyển đến thường được khuyên melapor ke Pak RT/Bu RT.',
      'Iuran warga thường dùng cho vệ sinh, an ninh, đèn đường, hoạt động cộng đồng, hoặc sự kiện đặc biệt. Mức phí tùy khu.',
      'Kerja bakti thể hiện tinh thần gotong royong: cùng dọn đường, selokan, khu chung, hoặc chuẩn bị sự kiện.',
      'Ngày 17 Agustus là Quốc khánh Indonesia. Nhiều khu dân cư tổ chức lomba, trang trí, ăn uống chung, và acara warga.',
    ],
    cultural_notes_en: [
      'RT (Rukun Tetangga) and RW (Rukun Warga) are familiar community structures in Indonesia. New residents are often advised to report to the local Pak RT or Bu RT.',
      'Neighborhood dues are often used for cleaning, security, street lights, community activities, or special events. The amount depends on the neighborhood.',
      'Kerja bakti expresses gotong royong: residents clean streets, drains, shared spaces, or prepare for events together.',
      'August 17 is Indonesia’s Independence Day. Many neighborhoods organize games, decorations, shared food, and local community events.',
    ],
    tip_advice_vi: [
      'Câu hữu ích cho cư dân mới: Saya warga baru di RT ini. Tôi là cư dân mới ở RT này.',
      'Khi hỏi phí, dùng Berapa iuran warga per bulan? Không dùng apa vì đang hỏi số tiền.',
      'Khi vắng họp, nói lịch sự: Maaf, saya tidak bisa hadir. Nanti saya kabari pengurus RT.',
      'Trong thông báo cộng đồng, diminta + động từ nghĩa là "được yêu cầu..." Ví dụ: warga diminta membawa makanan ringan.',
    ],
    tip_advice_en: [
      'Useful line for new residents: Saya warga baru di RT ini. I am a new resident in this RT.',
      'When asking about dues, use Berapa iuran warga per bulan? Do not use apa because you are asking for an amount.',
      'When absent from a meeting, say politely: Maaf, saya tidak bisa hadir. Nanti saya kabari pengurus RT.',
      'In community announcements, diminta + verb means "are asked/requested to..." Example: warga diminta membawa makanan ringan.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Tolong isi ____ hadir sebelum rapat dimulai.',
        answer: 'daftar',
        explanation_vi: 'Daftar hadir là danh sách điểm danh/ký tên trước cuộc họp.',
        explanation_en: 'Daftar hadir is the attendance list or sign-in sheet before a meeting.',
      },
      {
        type: 'choice',
        prompt: 'Which sentence asks about monthly neighborhood dues?',
        answer: 'Berapa iuran warga per bulan?',
        explanation_vi: 'Berapa dùng để hỏi số tiền/số lượng; iuran warga là khoản đóng góp của cư dân.',
        explanation_en: 'Berapa asks for an amount; iuran warga means neighborhood dues or resident contribution.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: There is an RT meeting tonight.',
        answer: 'Malam ini ada rapat RT.',
        explanation_vi: 'Malam ini là tối nay; ada rapat RT là có họp RT.',
        explanation_en: 'Malam ini means tonight; ada rapat RT means there is an RT meeting.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell Pak RT that you cannot attend and will inform the RT committee.',
        answer: 'Maaf, saya tidak bisa hadir. Nanti saya kabari pengurus RT.',
        explanation_vi: 'Tidak bisa hadir là không thể có mặt; kabari nghĩa là báo tin/cho biết.',
        explanation_en: 'Tidak bisa hadir means cannot attend; kabari means inform or let someone know.',
      },
    ],
  },
];
