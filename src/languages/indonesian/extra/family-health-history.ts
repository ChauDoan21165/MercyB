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
    id: 'family-health-history',
    title: 'Riwayat kesehatan keluarga',
    level: 'B1',
    topic: 'family health history, hereditary disease, diabetes, blood pressure, allergies, family doctor, medical records',
    vietnamese_title: 'Tiền sử sức khỏe gia đình',
    english_title: 'Family Health History',
    pronunciation_focus: [
      'Riwayat kesehatan keluarga nghĩa là tiền sử sức khỏe gia đình. Riwayat = lịch sử/tiền sử trong ngữ cảnh y tế.',
      'Penyakit turunan nghĩa là bệnh di truyền. Turunan ở đây là truyền từ gia đình, không phải "xuống xe".',
      'Diabetes thường dùng trong bệnh viện; kencing manis là cách nói đời thường cho tiểu đường.',
      'Tekanan darah nghĩa là huyết áp. Tekanan darah tinggi = huyết áp cao; tekanan darah rendah = huyết áp thấp.',
      'Alergi đọc a-LER-gi. Nói alergi obat, alergi makanan, hoặc alergi debu để nói dị ứng thuốc, thức ăn, bụi.',
      'Catatan medis là hồ sơ y tế. Nếu muốn xin bản sao, dùng salinan catatan medis.',
    ],
    pronunciation_focus_en: [
      'Riwayat kesehatan keluarga means family health history. Riwayat means history/background in medical contexts.',
      'Penyakit turunan means hereditary disease. Turunan here means passed down in the family.',
      'Diabetes is common in clinical settings; kencing manis is an everyday term for diabetes.',
      'Tekanan darah means blood pressure. Tekanan darah tinggi is high blood pressure; tekanan darah rendah is low blood pressure.',
      'Alergi is pronounced a-LER-gi. Say alergi obat, alergi makanan, or alergi debu for medicine, food, or dust allergies.',
      'Catatan medis means medical records. To ask for a copy, use salinan catatan medis.',
    ],
    sentences: [
      {
        en: 'Dokter menanyakan riwayat kesehatan keluarga saya.',
        vi: 'Bác sĩ hỏi về tiền sử sức khỏe gia đình của tôi.',
        pronunciation: 'DOK-ter me-NA-nya-kan ri-WA-yat ke-SE-hat-an ke-LU-ar-ga SA-ya',
      },
      {
        en: 'Ayah saya punya riwayat diabetes.',
        vi: 'Bố tôi có tiền sử bệnh tiểu đường.',
        pronunciation: 'A-yah SA-ya PU-nya ri-WA-yat di-a-BE-tes',
      },
      {
        en: 'Ibu saya sering mengalami tekanan darah tinggi.',
        vi: 'Mẹ tôi thường bị huyết áp cao.',
        pronunciation: 'I-bu SA-ya se-RING me-nga-LA-mi te-KA-nan DA-rah TING-gi',
      },
      {
        en: 'Apakah penyakit ini termasuk penyakit turunan?',
        vi: 'Bệnh này có thuộc loại bệnh di truyền không?',
        pronunciation: 'a-PA-kah pe-NYA-kit I-ni ter-MA-suk pe-NYA-kit tu-RU-nan',
      },
      {
        en: 'Saya alergi obat tertentu, terutama antibiotik.',
        vi: 'Tôi dị ứng với một số thuốc, đặc biệt là kháng sinh.',
        pronunciation: 'SA-ya a-LER-gi O-bat ter-TEN-tu ter-u-TA-ma an-ti-bi-O-tik',
      },
      {
        en: 'Dokter keluarga saya menyimpan catatan medis lama.',
        vi: 'Bác sĩ gia đình của tôi lưu hồ sơ y tế cũ.',
        pronunciation: 'DOK-ter ke-LU-ar-ga SA-ya me-NYIM-pan ca-TA-tan ME-dis LA-ma',
      },
      {
        en: 'Saya belum tahu riwayat kesehatan dari pihak ibu.',
        vi: 'Tôi chưa biết tiền sử sức khỏe từ bên mẹ.',
        pronunciation: 'SA-ya be-LUM TA-hu ri-WA-yat ke-SE-hat-an DA-ri PI-hak I-bu',
      },
      {
        en: 'Tolong catat alergi saya di berkas pasien.',
        vi: 'Vui lòng ghi dị ứng của tôi vào hồ sơ bệnh nhân.',
        pronunciation: 'TO-long CA-tat a-LER-gi SA-ya di BER-kas PA-si-en',
      },
    ],
    vocabulary: [
      {
        word: 'riwayat kesehatan keluarga',
        meaning_vi: 'tiền sử sức khỏe gia đình',
        meaning_en: 'family health history',
        example: 'Riwayat kesehatan keluarga penting untuk pemeriksaan awal.',
        example_vi: 'Tiền sử sức khỏe gia đình quan trọng cho lần kiểm tra ban đầu.',
      },
      {
        word: 'penyakit turunan',
        meaning_vi: 'bệnh di truyền',
        meaning_en: 'hereditary disease',
        example: 'Dokter bertanya apakah ada penyakit turunan.',
        example_vi: 'Bác sĩ hỏi có bệnh di truyền nào không.',
      },
      {
        word: 'diabetes',
        meaning_vi: 'bệnh tiểu đường',
        meaning_en: 'diabetes',
        example: 'Kakek saya menderita diabetes sejak lama.',
        example_vi: 'Ông tôi bị tiểu đường từ lâu.',
      },
      {
        word: 'tekanan darah',
        meaning_vi: 'huyết áp',
        meaning_en: 'blood pressure',
        example: 'Tekanan darah saya perlu dicek secara rutin.',
        example_vi: 'Huyết áp của tôi cần được kiểm tra định kỳ.',
      },
      {
        word: 'alergi',
        meaning_vi: 'dị ứng',
        meaning_en: 'allergy',
        example: 'Saya punya alergi makanan laut.',
        example_vi: 'Tôi bị dị ứng hải sản.',
      },
      {
        word: 'dokter keluarga',
        meaning_vi: 'bác sĩ gia đình',
        meaning_en: 'family doctor',
        example: 'Dokter keluarga memberi rujukan ke spesialis.',
        example_vi: 'Bác sĩ gia đình cho giấy chuyển tuyến đến chuyên khoa.',
      },
      {
        word: 'catatan medis',
        meaning_vi: 'hồ sơ y tế',
        meaning_en: 'medical records',
        example: 'Catatan medis lama membantu dokter memahami kondisi saya.',
        example_vi: 'Hồ sơ y tế cũ giúp bác sĩ hiểu tình trạng của tôi.',
      },
      {
        word: 'pihak ibu',
        meaning_vi: 'bên mẹ',
        meaning_en: 'mother’s side of the family',
        example: 'Ada riwayat tekanan darah tinggi dari pihak ibu.',
        example_vi: 'Có tiền sử huyết áp cao từ bên mẹ.',
      },
    ],
    dialogue: [
      {
        speaker: 'Dokter',
        line: 'Apakah ada riwayat kesehatan keluarga yang perlu saya tahu?',
        vi: 'Có tiền sử sức khỏe gia đình nào tôi cần biết không?',
        en: 'Is there any family health history I should know about?',
      },
      {
        speaker: 'Pasien',
        line: 'Ayah saya punya diabetes, dan ibu saya tekanan darah tinggi.',
        vi: 'Bố tôi bị tiểu đường, và mẹ tôi bị huyết áp cao.',
        en: 'My father has diabetes, and my mother has high blood pressure.',
      },
      {
        speaker: 'Dokter',
        line: 'Apakah ada penyakit turunan lain di keluarga?',
        vi: 'Có bệnh di truyền nào khác trong gia đình không?',
        en: 'Are there any other hereditary diseases in the family?',
      },
      {
        speaker: 'Pasien',
        line: 'Saya belum tahu dari pihak ibu, tapi saya bisa cek catatan medis lama.',
        vi: 'Tôi chưa biết từ bên mẹ, nhưng tôi có thể kiểm tra hồ sơ y tế cũ.',
        en: 'I do not know from my mother’s side yet, but I can check old medical records.',
      },
      {
        speaker: 'Dokter',
        line: 'Baik. Ada alergi obat atau alergi makanan?',
        vi: 'Được. Có dị ứng thuốc hoặc dị ứng thức ăn không?',
        en: 'All right. Any medicine or food allergies?',
      },
      {
        speaker: 'Pasien',
        line: 'Saya alergi antibiotik tertentu. Tolong catat di berkas pasien.',
        vi: 'Tôi dị ứng với một số kháng sinh. Vui lòng ghi vào hồ sơ bệnh nhân.',
        en: 'I am allergic to certain antibiotics. Please record it in the patient file.',
      },
    ],
    cultural_notes_vi: [
      'Khi khám bệnh ở Indonesia, bác sĩ có thể hỏi tentang riwayat kesehatan keluarga, đặc biệt với diabetes, tekanan darah tinggi, penyakit jantung, kanker, atau alergi berat.',
      'Nếu không biết rõ tiền sử của gia đình, có thể nói Saya belum tahu hoặc Saya akan tanya keluarga dulu. Điều này tự nhiên và trung thực.',
      'Dokter keluarga không phải lúc nào cũng phổ biến theo cùng nghĩa như ở các nước khác, nhưng cụm này vẫn hiểu là bác sĩ thường theo dõi gia đình hoặc bệnh nhân.',
      'Catatan medis có thể ở klinik, rumah sakit, puskesmas, hoặc aplikasi kesehatan. Khi chuyển nơi khám, bản tóm tắt hoặc salinan catatan medis rất hữu ích.',
    ],
    cultural_notes_en: [
      'During medical visits in Indonesia, doctors may ask about family health history, especially diabetes, high blood pressure, heart disease, cancer, or severe allergies.',
      'If you do not know your family history clearly, you can say Saya belum tahu or Saya akan tanya keluarga dulu. This is natural and honest.',
      'Dokter keluarga may not always work exactly like a family doctor in other countries, but the phrase is understood as a doctor who regularly follows a family or patient.',
      'Medical records may be held at a clinic, hospital, puskesmas, or health app. When changing providers, a summary or copy of records is useful.',
    ],
    tip_advice_vi: [
      'Mẫu trả lời ngắn: Ayah saya punya diabetes. Ibu saya tekanan darah tinggi. Saya alergi antibiotik.',
      'Punya trong hội thoại y tế đời thường rất tự nhiên: punya riwayat, punya alergi, punya tekanan darah tinggi.',
      'Phân biệt penyakit = bệnh, riwayat = tiền sử, gejala = triệu chứng, alergi = dị ứng.',
      'Khi cần chắc chắn thông tin được ghi lại, nói Tolong catat... hoặc Mohon dicatat di berkas pasien.',
    ],
    tip_advice_en: [
      'Short answer patterns: Ayah saya punya diabetes. Ibu saya tekanan darah tinggi. Saya alergi antibiotik.',
      'Punya is natural in everyday medical conversation: punya riwayat, punya alergi, punya tekanan darah tinggi.',
      'Distinguish penyakit = disease, riwayat = history, gejala = symptoms, alergi = allergy.',
      'When you need information recorded, say Tolong catat... or Mohon dicatat di berkas pasien.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Dokter menanyakan riwayat kesehatan ____ saya.',
        answer: 'keluarga',
        explanation_vi: 'Cụm đầy đủ là riwayat kesehatan keluarga, nghĩa là tiền sử sức khỏe gia đình.',
        explanation_en: 'The full phrase is riwayat kesehatan keluarga, meaning family health history.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “hereditary disease”?',
        answer: 'penyakit turunan',
        explanation_vi: 'Penyakit turunan là bệnh di truyền hoặc bệnh có tính gia đình.',
        explanation_en: 'Penyakit turunan means hereditary disease or a condition passed down in a family.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: My mother has high blood pressure.',
        answer: 'Ibu saya punya tekanan darah tinggi.',
        explanation_vi: 'Ibu saya = mẹ tôi; punya = có; tekanan darah tinggi = huyết áp cao.',
        explanation_en: 'Ibu saya = my mother; punya = has; tekanan darah tinggi = high blood pressure.',
      },
      {
        type: 'roleplay',
        prompt: 'You are at a clinic. Tell the doctor that your father has diabetes and you are allergic to certain antibiotics.',
        answer: 'Ayah saya punya diabetes, dan saya alergi antibiotik tertentu.',
        explanation_vi: 'Dùng punya diabetes cho "có/bị tiểu đường" và alergi antibiotik tertentu cho "dị ứng một số kháng sinh".',
        explanation_en: 'Use punya diabetes for “has diabetes” and alergi antibiotik tertentu for “allergic to certain antibiotics.”',
      },
    ],
  },
];
