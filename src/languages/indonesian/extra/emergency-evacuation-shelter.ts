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
    id: 'emergency-evacuation-shelter',
    title: 'Tempat evakuasi dan posko pengungsian',
    level: 'B1',
    topic: 'evacuation shelter, command post, evacuees, logistics, family list, food aid, security, official information',
    vietnamese_title: 'Điểm sơ tán và nơi trú tạm khẩn cấp',
    english_title: 'Emergency Evacuation Shelter',
    pronunciation_focus: [
      'Tempat evakuasi nghĩa là điểm/nơi sơ tán. Tempat = nơi chốn; evakuasi = sơ tán.',
      'Posko là viết tắt quen thuộc của pos komando, nghĩa là điểm chỉ huy/hỗ trợ trong tình huống khẩn cấp.',
      'Pengungsi là người sơ tán/người lánh nạn. Mengungsi là hành động đi sơ tán.',
      'Logistik trong cứu trợ nghĩa là hàng thiết yếu như makanan, air bersih, selimut, obat-obatan.',
      'Daftar keluarga nghĩa là danh sách gia đình. Daftar cũng có thể là danh sách hoặc đăng ký, tùy ngữ cảnh.',
      'Informasi resmi nghĩa là thông tin chính thức. Resmi đọc res-MI, không nhấn như tiếng Anh.',
    ],
    pronunciation_focus_en: [
      'Tempat evakuasi means evacuation place or shelter. Tempat means place; evakuasi means evacuation.',
      'Posko is a familiar abbreviation of pos komando, meaning a command/help post in an emergency.',
      'Pengungsi means evacuee or displaced person. Mengungsi is the act of evacuating.',
      'Logistik in relief contexts means essential supplies such as food, clean water, blankets, and medicine.',
      'Daftar keluarga means family list. Daftar can mean list or registration depending on context.',
      'Informasi resmi means official information. Resmi is pronounced res-MI.',
    ],
    sentences: [
      {
        en: 'Di mana tempat evakuasi yang terdekat?',
        vi: 'Nơi sơ tán gần nhất ở đâu?',
        pronunciation: 'di MA-na TEM-pat e-va-ku-A-si yang ter-DE-kat',
      },
      {
        en: 'Kami diarahkan ke posko pengungsian di balai desa.',
        vi: 'Chúng tôi được hướng dẫn đến điểm trú tạm ở nhà sinh hoạt/văn phòng làng.',
        pronunciation: 'KA-mi di-a-RAH-kan ke POS-ko pe-NGUNG-si-an di BA-lai DE-sa',
      },
      {
        en: 'Semua pengungsi harus mengisi daftar keluarga.',
        vi: 'Tất cả người sơ tán phải điền danh sách gia đình.',
        pronunciation: 'se-MU-a pe-NGUNG-si HA-rus meng-I-si DAF-tar ke-LU-ar-ga',
      },
      {
        en: 'Logistik akan dibagikan setelah data dicatat.',
        vi: 'Hàng cứu trợ sẽ được phát sau khi dữ liệu được ghi lại.',
        pronunciation: 'lo-GIS-tik A-kan di-ba-GI-kan se-TE-lah DA-ta di-CA-tat',
      },
      {
        en: 'Bantuan makanan tersedia untuk anak-anak dan lansia.',
        vi: 'Hỗ trợ thực phẩm có sẵn cho trẻ em và người cao tuổi.',
        pronunciation: 'ban-TU-an ma-KA-nan ter-SE-di-a UN-tuk A-nak A-nak dan LAN-si-a',
      },
      {
        en: 'Keamanan di tempat evakuasi dijaga oleh petugas.',
        vi: 'An ninh tại nơi sơ tán được nhân viên/cán bộ bảo vệ.',
        pronunciation: 'ke-a-MA-nan di TEM-pat e-va-ku-A-si di-JA-ga O-leh pe-TU-gas',
      },
      {
        en: 'Tolong ikuti informasi resmi dari BPBD.',
        vi: 'Vui lòng theo dõi thông tin chính thức từ BPBD.',
        pronunciation: 'TO-long i-KU-ti in-for-MA-si res-MI DA-ri be-pe-be-de',
      },
      {
        en: 'Jika ada anggota keluarga yang hilang, segera lapor ke posko.',
        vi: 'Nếu có thành viên gia đình bị mất liên lạc, hãy báo ngay cho điểm hỗ trợ.',
        pronunciation: 'JI-ka A-da ang-GO-ta ke-LU-ar-ga yang HI-lang se-GE-ra la-POR ke POS-ko',
      },
    ],
    vocabulary: [
      {
        cell_id: "b47e9060-4e2a-4565-a075-c5d4fd89b245",
        word: 'tempat evakuasi',
        meaning_vi: 'nơi/điểm sơ tán',
        meaning_en: 'evacuation shelter or place',
        example: 'Tempat evakuasi dibuka di gedung sekolah.',
        example_vi: 'Nơi sơ tán được mở tại tòa nhà trường học.',
      },
      {
        cell_id: "68a7f926-d701-4c5f-8ba4-a8973fe0e23c",
        word: 'posko',
        meaning_vi: 'điểm chỉ huy/hỗ trợ khẩn cấp',
        meaning_en: 'command or emergency support post',
        example: 'Relawan berkumpul di posko utama.',
        example_vi: 'Tình nguyện viên tập trung ở điểm hỗ trợ chính.',
      },
      {
        cell_id: "d333b9a9-1723-4d7f-b264-f7a25859f657",
        word: 'pengungsi',
        meaning_vi: 'người sơ tán, người lánh nạn',
        meaning_en: 'evacuee or displaced person',
        example: 'Pengungsi membutuhkan air bersih dan selimut.',
        example_vi: 'Người sơ tán cần nước sạch và chăn.',
      },
      {
        cell_id: "7d393f4e-a50f-461e-885a-890ef9f6bf0c",
        word: 'logistik',
        meaning_vi: 'hàng hậu cần/cứu trợ thiết yếu',
        meaning_en: 'relief supplies or logistics',
        example: 'Logistik makanan tiba sore ini.',
        example_vi: 'Hàng cứu trợ thực phẩm đến chiều nay.',
      },
      {
        cell_id: "b0bccd3a-c921-48ac-841a-ec343100eba2",
        word: 'daftar keluarga',
        meaning_vi: 'danh sách gia đình',
        meaning_en: 'family list',
        example: 'Daftar keluarga dipakai untuk pembagian bantuan.',
        example_vi: 'Danh sách gia đình được dùng để phân phát hỗ trợ.',
      },
      {
        cell_id: "50137df9-7488-4e55-a476-bfd6b7507277",
        word: 'bantuan makanan',
        meaning_vi: 'hỗ trợ thực phẩm',
        meaning_en: 'food aid',
        example: 'Bantuan makanan dibagikan dua kali sehari.',
        example_vi: 'Hỗ trợ thực phẩm được phát hai lần mỗi ngày.',
      },
      {
        cell_id: "3ec4bcc8-c7d3-4491-854b-d1aed0d0f759",
        word: 'keamanan',
        meaning_vi: 'an ninh, sự an toàn',
        meaning_en: 'security or safety',
        example: 'Keamanan posko dijaga sepanjang malam.',
        example_vi: 'An ninh điểm hỗ trợ được bảo vệ suốt đêm.',
      },
      {
        cell_id: "d746e34b-d122-4c2f-9ab2-55d974ace97d",
        word: 'informasi resmi',
        meaning_vi: 'thông tin chính thức',
        meaning_en: 'official information',
        example: 'Jangan percaya kabar yang bukan informasi resmi.',
        example_vi: 'Đừng tin tin tức không phải thông tin chính thức.',
      },
    ],
    dialogue: [
      {
        cell_id: "d490e1e0-11ef-46ec-97dc-9f7e26e6682b",
        speaker: 'Warga',
        line: 'Pak, di mana tempat evakuasi yang terdekat?',
        vi: 'Anh/chú ơi, nơi sơ tán gần nhất ở đâu?',
        en: 'Sir, where is the nearest evacuation shelter?',
      },
      {
        cell_id: "3983b4f1-5259-4049-b95b-d276382f6032",
        speaker: 'Petugas',
        line: 'Silakan menuju posko pengungsian di balai desa.',
        vi: 'Vui lòng đi đến điểm trú tạm ở balai desa.',
        en: 'Please go to the evacuation post at the village hall.',
      },
      {
        cell_id: "229e7d94-8f72-4afe-b07b-63da92e9d34c",
        speaker: 'Warga',
        line: 'Apakah kami harus mengisi daftar keluarga?',
        vi: 'Chúng tôi có phải điền danh sách gia đình không?',
        en: 'Do we need to fill in a family list?',
      },
      {
        cell_id: "905beba4-4336-431d-8603-82694674a4e3",
        speaker: 'Petugas',
        line: 'Iya, data keluarga harus dicatat sebelum logistik dibagikan.',
        vi: 'Có, dữ liệu gia đình phải được ghi lại trước khi hàng cứu trợ được phát.',
        en: 'Yes, family data must be recorded before supplies are distributed.',
      },
      {
        cell_id: "d7a262d8-d9a4-4fc7-bcde-139802735d5f",
        speaker: 'Warga',
        line: 'Anak saya butuh bantuan makanan dan obat.',
        vi: 'Con tôi cần hỗ trợ thực phẩm và thuốc.',
        en: 'My child needs food aid and medicine.',
      },
      {
        cell_id: "fdde54b3-9b4a-4f52-9cc2-c941188764d6",
        speaker: 'Petugas',
        line: 'Baik, nanti lapor ke meja logistik. Ikuti informasi resmi dari posko.',
        vi: 'Vâng, lát nữa báo ở bàn hậu cần. Hãy theo dõi thông tin chính thức từ điểm hỗ trợ.',
        en: 'All right, report to the logistics desk later. Follow official information from the post.',
      },
    ],
    cultural_notes_vi: [
      'Trong thiên tai ở Indonesia, posko có thể được lập tại balai desa, sekolah, masjid, kantor kelurahan, hoặc gedung umum lainnya.',
      'Daftar keluarga thường cần để biết số người, trẻ em, lansia, phụ nữ mang thai, người sakit, và kebutuhan khusus.',
      'Logistik có thể bao gồm nasi bungkus, air bersih, selimut, popok, obat-obatan, tenda, dan perlengkapan kebersihan.',
      'Thông tin nên theo sumber resmi như BPBD, BNPB, pemerintah daerah, petugas posko, hoặc pengumuman resmi, bukan pesan berantai yang belum jelas.',
    ],
    cultural_notes_en: [
      'During disasters in Indonesia, a posko may be set up at a village hall, school, mosque, kelurahan office, or other public building.',
      'A family list is often needed to record number of people, children, elderly people, pregnant women, sick people, and special needs.',
      'Logistics may include packed rice meals, clean water, blankets, diapers, medicines, tents, and hygiene supplies.',
      'Information should come from official sources such as BPBD, BNPB, local government, post officers, or official announcements, not unclear forwarded messages.',
    ],
    tip_advice_vi: [
      'Câu sống còn: Di mana tempat evakuasi yang terdekat? và Saya mau lapor anggota keluarga yang hilang.',
      'Phân biệt mengungsi = đi sơ tán và pengungsi = người sơ tán.',
      'Khi xin hỗ trợ, nói rõ nhóm cần giúp: anak-anak, lansia, ibu hamil, orang sakit, atau penyandang disabilitas.',
      'Trong thông báo chính thức, bị động di- rất thường gặp: dicatat, dibagikan, diarahkan, dijaga.',
    ],
    tip_advice_en: [
      'Survival lines: Di mana tempat evakuasi yang terdekat? and Saya mau lapor anggota keluarga yang hilang.',
      'Distinguish mengungsi = to evacuate and pengungsi = evacuee.',
      'When asking for aid, state the group clearly: children, elderly people, pregnant women, sick people, or people with disabilities.',
      'In official notices, the passive di- is common: dicatat, dibagikan, diarahkan, dijaga.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Semua pengungsi harus mengisi daftar ____.',
        answer: 'keluarga',
        explanation_vi: 'Daftar keluarga là danh sách gia đình dùng để ghi dữ liệu ở nơi sơ tán.',
        explanation_en: 'Daftar keluarga is the family list used to record data at an evacuation shelter.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “official information”?',
        answer: 'informasi resmi',
        explanation_vi: 'Resmi nghĩa là chính thức; informasi resmi là thông tin chính thức.',
        explanation_en: 'Resmi means official; informasi resmi means official information.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Where is the nearest evacuation shelter?',
        answer: 'Di mana tempat evakuasi yang terdekat?',
        explanation_vi: 'Di mana hỏi ở đâu; tempat evakuasi là nơi sơ tán; terdekat là gần nhất.',
        explanation_en: 'Di mana asks where; tempat evakuasi means evacuation shelter; terdekat means nearest.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell the officer that your child needs food aid and medicine.',
        answer: 'Anak saya butuh bantuan makanan dan obat.',
        explanation_vi: 'Butuh nghĩa là cần; bantuan makanan là hỗ trợ thực phẩm; obat là thuốc.',
        explanation_en: 'Butuh means need; bantuan makanan means food aid; obat means medicine.',
      },
    ],
  },
];
