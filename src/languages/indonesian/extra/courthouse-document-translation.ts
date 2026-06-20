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
    id: 'courthouse-document-translation',
    title: 'Terjemahan dokumen resmi untuk pengadilan',
    level: 'B1',
    topic: 'document translation, sworn translator, certificate, diploma, legalization, notary, official documents, fees',
    vietnamese_title: 'Dịch giấy tờ chính thức cho tòa án',
    english_title: 'Courthouse Document Translation',
    pronunciation_focus: [
      'Terjemahan dokumen nghĩa là bản dịch tài liệu/giấy tờ. Menerjemahkan là động từ "dịch".',
      'Penerjemah tersumpah là biên dịch viên tuyên thệ/có chứng nhận pháp lý. Tersumpah nghĩa là đã tuyên thệ.',
      'Akta là giấy chứng nhận/hồ sơ hộ tịch như akta lahir hoặc akta nikah; đừng dịch thành "hành động".',
      'Ijazah nghĩa là bằng cấp/văn bằng tốt nghiệp. Transkrip nilai là bảng điểm.',
      'Legalisasi nghĩa là chứng thực/hợp pháp hóa giấy tờ. Trong hành chính, sering dipakai bersama notaris hoặc instansi resmi.',
      'Dokumen resmi nghĩa là giấy tờ chính thức. Resmi đọc res-MI, nghĩa là official/formal.',
    ],
    pronunciation_focus_en: [
      'Terjemahan dokumen means document translation. Menerjemahkan is the verb "to translate."',
      'Penerjemah tersumpah means a sworn translator. Tersumpah means sworn or legally certified.',
      'Akta means a certificate or civil-registry document such as birth or marriage certificate; do not read it as "action."',
      'Ijazah means diploma or graduation certificate. Transkrip nilai means academic transcript.',
      'Legalisasi means legalization or certification of documents. In administration, it often appears with a notary or official agency.',
      'Dokumen resmi means official documents. Resmi is pronounced res-MI and means official/formal.',
    ],
    sentences: [
      {
        en: 'Saya perlu terjemahan dokumen untuk pengadilan.',
        vi: 'Tôi cần bản dịch giấy tờ cho tòa án.',
        pronunciation: 'SA-ya PER-lu ter-je-MA-han DO-ku-men UN-tuk pe-nga-DI-lan',
      },
      {
        en: 'Apakah dokumen ini harus diterjemahkan oleh penerjemah tersumpah?',
        vi: 'Giấy tờ này có phải được dịch bởi biên dịch viên tuyên thệ không?',
        pronunciation: 'a-PA-kah DO-ku-men i-ni HA-rus di-ter-je-MAH-kan O-leh pe-ner-je-MAH ter-SUM-pah',
      },
      {
        en: 'Saya membawa akta lahir, ijazah, dan fotokopi paspor.',
        vi: 'Tôi mang giấy khai sinh, bằng tốt nghiệp và bản photo hộ chiếu.',
        pronunciation: 'SA-ya mem-BA-wa AK-ta LA-hir i-JA-zah dan fo-to-KO-pi PAS-por',
      },
      {
        en: 'Dokumen resmi ini perlu legalisasi notaris.',
        vi: 'Giấy tờ chính thức này cần chứng thực công chứng viên.',
        pronunciation: 'DO-ku-men res-MI i-ni PER-lu le-ga-li-SA-si no-TA-ris',
      },
      {
        en: 'Berapa biaya terjemahan per halaman?',
        vi: 'Phí dịch mỗi trang là bao nhiêu?',
        pronunciation: 'be-RA-pa BI-a-ya ter-je-MA-han per ha-LA-man',
      },
      {
        en: 'Kapan hasil terjemahannya bisa selesai?',
        vi: 'Khi nào bản dịch có thể hoàn thành?',
        pronunciation: 'KA-pan HA-sil ter-je-MA-han-nya BI-sa se-LE-sai',
      },
      {
        en: 'Tolong pastikan nama dan tanggal lahir ditulis sesuai dokumen asli.',
        vi: 'Vui lòng đảm bảo tên và ngày sinh được viết đúng theo giấy tờ gốc.',
        pronunciation: 'TO-long pas-TI-kan NA-ma dan TANG-gal LA-hir di-TU-lis se-SU-ai DO-ku-men AS-li',
      },
      {
        en: 'Saya membutuhkan salinan terjemahan yang sudah dicap dan ditandatangani.',
        vi: 'Tôi cần bản sao bản dịch đã được đóng dấu và ký tên.',
        pronunciation: 'SA-ya mem-bu-TUH-kan sa-LI-nan ter-je-MA-han yang SU-dah di-CAP dan di-tan-da-ta-NGA-ni',
      },
    ],
    vocabulary: [
      {
        word: 'terjemahan dokumen',
        meaning_vi: 'bản dịch tài liệu/giấy tờ',
        meaning_en: 'document translation',
        example: 'Terjemahan dokumen ini dipakai untuk sidang.',
        example_vi: 'Bản dịch giấy tờ này được dùng cho phiên tòa.',
      },
      {
        word: 'penerjemah tersumpah',
        meaning_vi: 'biên dịch viên tuyên thệ/có chứng nhận pháp lý',
        meaning_en: 'sworn translator',
        example: 'Pengadilan meminta penerjemah tersumpah.',
        example_vi: 'Tòa án yêu cầu biên dịch viên tuyên thệ.',
      },
      {
        word: 'akta',
        meaning_vi: 'giấy chứng nhận/hồ sơ hộ tịch',
        meaning_en: 'certificate or civil-registry deed',
        example: 'Akta lahir harus diterjemahkan ke bahasa Indonesia.',
        example_vi: 'Giấy khai sinh phải được dịch sang tiếng Indonesia.',
      },
      {
        word: 'ijazah',
        meaning_vi: 'bằng tốt nghiệp, văn bằng',
        meaning_en: 'diploma or graduation certificate',
        example: 'Ijazah dan transkrip nilai perlu dilegalisasi.',
        example_vi: 'Bằng tốt nghiệp và bảng điểm cần được chứng thực.',
      },
      {
        word: 'legalisasi',
        meaning_vi: 'chứng thực, hợp pháp hóa',
        meaning_en: 'legalization or certification',
        example: 'Legalisasi dilakukan setelah dokumen diterjemahkan.',
        example_vi: 'Việc chứng thực được làm sau khi giấy tờ được dịch.',
      },
      {
        word: 'notaris',
        meaning_vi: 'công chứng viên',
        meaning_en: 'notary',
        example: 'Notaris memeriksa salinan dokumen resmi.',
        example_vi: 'Công chứng viên kiểm tra bản sao giấy tờ chính thức.',
      },
      {
        word: 'dokumen resmi',
        meaning_vi: 'giấy tờ chính thức',
        meaning_en: 'official document',
        example: 'Dokumen resmi harus sesuai dengan nama di paspor.',
        example_vi: 'Giấy tờ chính thức phải khớp với tên trên hộ chiếu.',
      },
      {
        word: 'biaya terjemahan',
        meaning_vi: 'phí dịch thuật',
        meaning_en: 'translation fee',
        example: 'Biaya terjemahan dihitung per halaman.',
        example_vi: 'Phí dịch được tính theo từng trang.',
      },
    ],
    dialogue: [
      {
        speaker: 'Pemohon',
        line: 'Selamat pagi. Saya perlu terjemahan dokumen untuk pengadilan.',
        vi: 'Chào buổi sáng. Tôi cần bản dịch giấy tờ cho tòa án.',
        en: 'Good morning. I need document translation for court.',
      },
      {
        speaker: 'Petugas',
        line: 'Dokumennya apa saja, Pak?',
        vi: 'Các giấy tờ gồm những gì ạ?',
        en: 'What documents are they, Sir?',
      },
      {
        speaker: 'Pemohon',
        line: 'Ada akta lahir, ijazah, dan surat keterangan dari notaris.',
        vi: 'Có giấy khai sinh, bằng tốt nghiệp và giấy xác nhận từ công chứng viên.',
        en: 'There is a birth certificate, diploma, and statement letter from a notary.',
      },
      {
        speaker: 'Petugas',
        line: 'Untuk pengadilan, biasanya perlu penerjemah tersumpah.',
        vi: 'Đối với tòa án, thường cần biên dịch viên tuyên thệ.',
        en: 'For court, a sworn translator is usually needed.',
      },
      {
        speaker: 'Pemohon',
        line: 'Berapa biaya terjemahan dan legalisasinya?',
        vi: 'Phí dịch thuật và chứng thực là bao nhiêu?',
        en: 'How much are the translation and legalization fees?',
      },
      {
        speaker: 'Petugas',
        line: 'Biayanya dihitung per halaman. Hasilnya selesai tiga hari kerja.',
        vi: 'Phí được tính theo từng trang. Kết quả hoàn thành sau ba ngày làm việc.',
        en: 'The fee is calculated per page. The result is ready in three business days.',
      },
    ],
    cultural_notes_vi: [
      'Trong bối cảnh tòa án hoặc cơ quan nhà nước Indonesia, dokumen asing thường cần diterjemahkan oleh penerjemah tersumpah agar diterima secara resmi.',
      'Akta lahir, akta nikah, ijazah, transkrip nilai, surat kuasa, dan surat keterangan thường là những giấy tờ cần dịch hoặc legalisasi.',
      'Legalisasi có thể liên quan đến notaris, kementerian, kedutaan, hoặc instansi resmi khác tùy mục đích sử dụng.',
      'Luôn kiểm tra ejaan nama, tanggal lahir, nomor paspor, dan cap/tanda tangan vì sai một chữ có thể làm hồ sơ bị trả lại.',
    ],
    cultural_notes_en: [
      'For Indonesian courts or government offices, foreign documents often need to be translated by a sworn translator to be officially accepted.',
      'Birth certificates, marriage certificates, diplomas, transcripts, powers of attorney, and statement letters are common documents requiring translation or legalization.',
      'Legalization may involve a notary, ministry, embassy, or another official agency depending on the purpose.',
      'Always check name spelling, birth date, passport number, stamps, and signatures because even one wrong letter can cause a file to be returned.',
    ],
    tip_advice_vi: [
      'Câu hỏi quan trọng: Apakah perlu penerjemah tersumpah? nghĩa là có cần biên dịch viên tuyên thệ không?',
      'Khi hỏi phí, dùng Berapa biaya terjemahan per halaman? vì nhiều dịch vụ tính theo trang.',
      'Diterjemahkan là bị động "được dịch"; menerjemahkan là chủ động "dịch". Trong câu hành chính thường dùng bị động.',
      'Dokumen asli là bản gốc; salinan là bản sao; fotokopi là bản photo. Đừng lẫn ba từ này.',
    ],
    tip_advice_en: [
      'Key question: Apakah perlu penerjemah tersumpah? means do I need a sworn translator?',
      'For fees, ask Berapa biaya terjemahan per halaman? because many services charge per page.',
      'Diterjemahkan is passive "be translated"; menerjemahkan is active "translate." Administrative language often uses the passive.',
      'Dokumen asli is the original; salinan is a copy; fotokopi is a photocopy. Keep these three apart.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Dokumen ini harus diterjemahkan oleh penerjemah ____.',
        answer: 'tersumpah',
        explanation_vi: 'Penerjemah tersumpah là biên dịch viên tuyên thệ/có chứng nhận pháp lý.',
        explanation_en: 'Penerjemah tersumpah means sworn translator.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “official document”?',
        answer: 'dokumen resmi',
        explanation_vi: 'Resmi nghĩa là chính thức; dokumen resmi là giấy tờ chính thức.',
        explanation_en: 'Resmi means official; dokumen resmi means official document.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: How much is the translation fee per page?',
        answer: 'Berapa biaya terjemahan per halaman?',
        explanation_vi: 'Berapa hỏi số tiền; biaya terjemahan là phí dịch; per halaman là mỗi trang.',
        explanation_en: 'Berapa asks the amount; biaya terjemahan is translation fee; per halaman is per page.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask whether this document must be translated by a sworn translator.',
        answer: 'Apakah dokumen ini harus diterjemahkan oleh penerjemah tersumpah?',
        explanation_vi: 'Harus diterjemahkan là phải được dịch; oleh đánh dấu người thực hiện trong câu bị động.',
        explanation_en: 'Harus diterjemahkan means must be translated; oleh marks the doer in a passive sentence.',
      },
    ],
  },
];
