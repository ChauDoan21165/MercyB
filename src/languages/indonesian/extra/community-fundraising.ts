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
    id: 'community-fundraising',
    title: 'Penggalangan dana dan laporan dana warga',
    level: 'B1',
    topic: 'fundraising, donations, joint account, fund report, committee, transparency, community support, fundraising target',
    vietnamese_title: 'Gây quỹ và báo cáo quỹ của cộng đồng',
    english_title: 'Community Fundraising',
    pronunciation_focus: [
      'Penggalangan dana nghĩa là gây quỹ. Penggalangan berasal dari kata dasar galang, jadi nghe formal và thường dùng cho acara komunitas.',
      'Donasi nghĩa là quyên góp, còn sumbangan cũng rất tự nhiên trong ngữ cảnh warga dan acara sosial.',
      'Rekening bersama là tài khoản chung. Rekening dùng cho tài khoản ngân hàng, bukan akun aplikasi.',
      'Laporan dana nghĩa là báo cáo quỹ. Laporan phải jelas, termasuk pemasukan dan pengeluaran.',
      'Panitia nghĩa là ban tổ chức. Trong acara komunitas, panitia sering mengurus donasi dan pencatatan.',
      'Transparansi nghĩa là tính minh bạch. Ini sangat penting saat menjelaskan penggunaan dana.',
    ],
    pronunciation_focus_en: [
      'Penggalangan dana means fundraising. Penggalangan comes from the root galang and sounds formal for community events.',
      'Donasi means donation, and sumbangan is also very natural in neighborhood and social-event contexts.',
      'Rekening bersama means joint bank account. Rekening is for bank accounts, not app accounts.',
      'Laporan dana means fund report. A report should be clear, including income and expenses.',
      'Panitia means organizing committee. In community events, the committee often handles donations and records.',
      'Transparansi means transparency. It is very important when explaining how money is used.',
    ],
    sentences: [
      {
        en: 'Kami sedang mengadakan penggalangan dana untuk tetangga yang sakit.',
        vi: 'Chúng tôi đang tổ chức gây quỹ cho người hàng xóm bị bệnh.',
        pronunciation: 'KA-mi se-DANG meng-a-DA-kan peng-ga-LANG-an DA-na UN-tuk te-TANG-ga yang SA-kit',
      },
      {
        en: 'Apakah saya bisa memberikan donasi lewat rekening bersama?',
        vi: 'Tôi có thể quyên góp qua tài khoản chung không?',
        pronunciation: 'a-PA-kah SA-ya BI-sa mem-be-ri-KAN do-NA-si le-WAT re-KEN-ing ber-SA-ma',
      },
      {
        en: 'Panitia akan menyiapkan laporan dana minggu depan.',
        vi: 'Ban tổ chức sẽ chuẩn bị báo cáo quỹ vào tuần tới.',
        pronunciation: 'pa-NI-ti-a A-kan men-yi-a-PKAN la-POR-an DA-na MING-gu de-PAN',
      },
      {
        en: 'Kami ingin memastikan transparansi penggunaan dana.',
        vi: 'Chúng tôi muốn đảm bảo tính minh bạch trong việc sử dụng quỹ.',
        pronunciation: 'KA-mi I-ngin me-mas-TI-kan trans-pa-RAN-si peng-gu-NA-an DA-na',
      },
      {
        en: 'Target dana kami masih kurang sedikit.',
        vi: 'Mục tiêu quỹ của chúng tôi vẫn còn thiếu một chút.',
        pronunciation: 'TAR-get DA-na KA-mi MA-sih KU-rang se-DI-kit',
      },
      {
        en: 'Warga sudah banyak yang ikut membantu.',
        vi: 'Người dân đã có nhiều người tham gia giúp đỡ.',
        pronunciation: 'WAR-ga SU-dah BA-nyak yang I-kut mem-BAN-tu',
      },
      {
        en: 'Kalau ada bukti transfer, tolong kirim ke panitia.',
        vi: 'Nếu có bằng chứng chuyển khoản, vui lòng gửi cho ban tổ chức.',
        pronunciation: 'KA-lau A-da BUK-ti trans-FER TO-long KI-rim ke pa-NI-ti-a',
      },
      {
        en: 'Terima kasih atas bantuan warga dan partisipasinya.',
        vi: 'Cảm ơn sự giúp đỡ và sự tham gia của người dân.',
        pronunciation: 'te-RI-ma KA-sih A-tas ban-TU-an WAR-ga dan par-ti-si-PA-si-nya',
      },
    ],
    vocabulary: [
      {
        cell_id: "38448a2d-dfb0-40e1-aed5-f89c269f25fd",
        word: 'penggalangan dana',
        meaning_vi: 'gây quỹ',
        meaning_en: 'fundraising',
        example: 'Penggalangan dana dilakukan lewat acara komunitas.',
        example_vi: 'Gây quỹ được thực hiện qua sự kiện cộng đồng.',
      },
      {
        cell_id: "68ec02b6-dba7-429b-a2e7-d34d39ce39b5",
        word: 'donasi',
        meaning_vi: 'quyên góp',
        meaning_en: 'donation',
        example: 'Donasi bisa dikirim hari ini.',
        example_vi: 'Khoản quyên góp có thể được gửi hôm nay.',
      },
      {
        cell_id: "02f08634-8189-4ef2-91fe-9eda131b72f9",
        word: 'rekening bersama',
        meaning_vi: 'tài khoản chung',
        meaning_en: 'joint account',
        example: 'Semua donasi masuk ke rekening bersama.',
        example_vi: 'Tất cả tiền quyên góp vào tài khoản chung.',
      },
      {
        cell_id: "1a0be03a-ae07-4589-a9da-61730cdce268",
        word: 'laporan dana',
        meaning_vi: 'báo cáo quỹ',
        meaning_en: 'fund report',
        example: 'Laporan dana dibagikan ke warga setiap minggu.',
        example_vi: 'Báo cáo quỹ được chia cho người dân mỗi tuần.',
      },
      {
        cell_id: "5781d3c5-f678-4464-a2bb-111d9e7cf640",
        word: 'panitia',
        meaning_vi: 'ban tổ chức',
        meaning_en: 'committee',
        example: 'Panitia mencatat semua pemasukan dan pengeluaran.',
        example_vi: 'Ban tổ chức ghi lại mọi khoản thu chi.',
      },
      {
        cell_id: "d90fe84a-bb9c-44fa-8fec-c607351d78af",
        word: 'transparansi',
        meaning_vi: 'tính minh bạch',
        meaning_en: 'transparency',
        example: 'Transparansi membuat warga lebih percaya.',
        example_vi: 'Tính minh bạch làm người dân tin tưởng hơn.',
      },
      {
        cell_id: "cfccb5d0-bdb4-4d52-a7c8-1a0631ccfb72",
        word: 'bantuan warga',
        meaning_vi: 'sự giúp đỡ của người dân',
        meaning_en: 'community support',
        example: 'Bantuan warga sangat membantu keluarga itu.',
        example_vi: 'Sự giúp đỡ của người dân rất hữu ích cho gia đình đó.',
      },
      {
        cell_id: "53158d43-4003-470b-b85d-3c6e8cd56e51",
        word: 'target dana',
        meaning_vi: 'mục tiêu số tiền',
        meaning_en: 'fundraising target',
        example: 'Target dana kami belum tercapai.',
        example_vi: 'Mục tiêu quỹ của chúng tôi chưa đạt được.',
      },
    ],
    dialogue: [
      {
        cell_id: "00d56c10-17bd-4e64-af86-df47f608df0b",
        speaker: 'Ketua Panitia',
        line: 'Kami sedang mengadakan penggalangan dana untuk tetangga yang sakit.',
        vi: 'Chúng tôi đang tổ chức gây quỹ cho người hàng xóm bị bệnh.',
        en: 'We are holding a fundraising drive for a sick neighbor.',
      },
      {
        cell_id: "be76358f-f698-40ab-9fb9-8e16481f93ea",
        speaker: 'Warga',
        line: 'Baik, saya mau ikut donasi. Apakah ada rekening bersama?',
        vi: 'Được, tôi muốn quyên góp. Có tài khoản chung không?',
        en: 'Okay, I want to donate. Is there a joint account?',
      },
      {
        cell_id: "0047da07-572e-40c4-8118-2557c58fef81",
        speaker: 'Ketua Panitia',
        line: 'Ada. Semua donasi kami catat untuk laporan dana.',
        vi: 'Có. Chúng tôi ghi lại mọi khoản quyên góp cho báo cáo quỹ.',
        en: 'Yes. We record all donations for the fund report.',
      },
      {
        cell_id: "2dcd79d6-49bf-426e-b4b3-36923c888323",
        speaker: 'Warga',
        line: 'Bagus. Saya senang kalau transparansi penggunaan dananya jelas.',
        vi: 'Tốt quá. Tôi thích khi việc sử dụng quỹ minh bạch và rõ ràng.',
        en: 'Great. I like it when the use of funds is transparent and clear.',
      },
      {
        cell_id: "715f3298-f25e-462b-a7e8-0b6c3d86fa2a",
        speaker: 'Ketua Panitia',
        line: 'Tentu. Laporan dana akan kami kirim ke semua warga minggu depan.',
        vi: 'Chắc chắn rồi. Chúng tôi sẽ gửi báo cáo quỹ cho tất cả người dân vào tuần tới.',
        en: 'Of course. We will send the fund report to all residents next week.',
      },
      {
        cell_id: "a1ebf3c4-91ad-4df3-9967-8f0f97dc3134",
        speaker: 'Warga',
        line: 'Terima kasih. Saya juga akan mengajak warga lain membantu.',
        vi: 'Cảm ơn. Tôi cũng sẽ rủ những người dân khác giúp đỡ.',
        en: 'Thank you. I will also invite other residents to help.',
      },
    ],
    cultural_notes_vi: [
      'Di lingkungan Indonesia, penggalangan dana thường được tổ chức cho tetangga sakit, keluarga terkena musibah, pembangunan fasilitas kecil, atau bantuan darurat.',
      'Panitia biasanya mencatat donasi, bukti transfer, dan pengeluaran. Banyak warga muốn ada transparansi, jadi laporan dana sangat penting.',
      'Rekening bersama là cách phổ biến để mengumpulkan donasi secara rapi. Jangan campur với rekening pribadi nếu tujuan acara adalah dana publik.',
      'Jika perlu, panitia bisa membagikan ringkasan pemasukan dan pengeluaran lewat grup WhatsApp warga atau papan pengumuman.',
    ],
    cultural_notes_en: [
      'In Indonesian neighborhoods, fundraising is often organized for a sick neighbor, a family hit by hardship, a small facility project, or emergency aid.',
      'The committee usually records donations, transfer receipts, and expenses. Many residents want transparency, so a fund report is important.',
      'A joint account is a common way to collect donations neatly. Do not mix it with a personal account if the event is for public funds.',
      'If needed, the committee can share a summary of income and expenses through the neighborhood WhatsApp group or an announcement board.',
    ],
    tip_advice_vi: [
      'Câu hỏi hữu ích: Apakah ada rekening bersama? dan Kapan laporan dana dibagikan?',
      'Khi muốn nhấn mạnh minh bạch, dùng transparansi penggunaan dana atau laporan dana yang jelas.',
      'Nếu bạn là panitia, câu yang aman là: Semua donasi kami catat dan akan kami laporkan.',
      'Dalam konteks komunitas, bantuan warga dan partisipasinya là cách nói mềm, lịch sự, và rất tự nhiên.',
    ],
    tip_advice_en: [
      'Useful questions: Apakah ada rekening bersama? and Kapan laporan dana dibagikan?',
      'To emphasize transparency, use transparansi penggunaan dana or laporan dana yang jelas.',
      'If you are on the committee, a safe line is: Semua donasi kami catat dan akan kami laporkan.',
      'In community contexts, bantuan warga and partisipasinya are soft, polite, and very natural phrases.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Semua donasi masuk ke rekening ____.',
        answer: 'bersama',
        explanation_vi: 'Rekening bersama là tài khoản chung cho quỹ cộng đồng.',
        explanation_en: 'Rekening bersama means a joint account for community funds.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “fund report”?',
        answer: 'laporan dana',
        explanation_vi: 'Laporan dana là báo cáo quỹ, dùng để ghi thu chi.',
        explanation_en: 'Laporan dana means fund report, used to show income and expenses.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: We want to maintain transparency.',
        answer: 'Kami ingin memastikan transparansi.',
        explanation_vi: 'Memastikan = đảm bảo; transparansi = tính minh bạch.',
        explanation_en: 'Memastikan means to ensure; transparansi means transparency.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask politely if you can donate through a joint account.',
        answer: 'Apakah saya bisa memberikan donasi lewat rekening bersama?',
        explanation_vi: 'Apakah... bisa là khung hỏi lịch sự; lewat rekening bersama nêu rõ cách chuyển tiền.',
        explanation_en: 'Apakah... bisa is a polite question frame; lewat rekening bersama specifies the transfer method.',
      },
    ],
  },
];
