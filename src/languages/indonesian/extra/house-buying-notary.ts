// Indonesian extra lesson: House buying and notary process.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi: string;
  en: string;
};

export type IndonesianExercise = {
  type: 'translation' | 'fill_blank' | 'multiple_choice' | 'matching';
  prompt_vi: string;
  prompt_en: string;
  answer: string;
  choices?: string[];
};

export type IndonesianCefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  pronunciation_focus: string[];
  pronunciation_focus_en: string[];
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  tip_advice_vi: string[];
  tip_advice_en: string[];
  vocabulary: IndonesianVocabEntry[];
  dialogue: IndonesianDialogueLine[];
  exercises: IndonesianExercise[];
};

export const lessons: IndonesianLesson[] = [
  {
    id: 'indonesian_house_buying_notary',
    category: 'housing',
    level: 'B1',
    title_vi: 'Mua nhà: notaris, AJB và sang tên',
    title_en: 'Buying a house: notary, AJB, and title transfer',
    sentences: [
      {
        en: 'Kami mau membuat janji dengan notaris.',
        vi: 'Chúng tôi muốn đặt lịch hẹn với công chứng viên/notary.',
      },
      {
        en: 'Notaris akan memeriksa sertifikat tanah.',
        vi: 'Notary sẽ kiểm tra giấy chứng nhận đất.',
      },
      {
        en: 'Apakah sertifikat tanah ini asli dan bersih?',
        vi: 'Giấy chứng nhận đất này có thật và không vướng vấn đề không?',
      },
      {
        en: 'Kapan AJB bisa ditandatangani?',
        vi: 'Khi nào AJB có thể được ký?',
      },
      {
        en: 'Biaya notaris ditanggung oleh siapa?',
        vi: 'Phí notary do ai chịu?',
      },
      {
        en: 'Kami perlu pengecekan sertifikat sebelum bayar DP.',
        vi: 'Chúng tôi cần kiểm tra giấy chứng nhận trước khi trả tiền đặt cọc.',
      },
      {
        en: 'Setelah AJB, proses balik nama berapa lama?',
        vi: 'Sau AJB, quá trình sang tên mất bao lâu?',
      },
      {
        en: 'Nama di sertifikat harus sesuai dengan KTP.',
        vi: 'Tên trên giấy chứng nhận phải khớp với KTP.',
      },
      {
        en: 'Tolong siapkan fotokopi KTP dan NPWP.',
        vi: 'Vui lòng chuẩn bị bản photo KTP và NPWP.',
      },
      {
        en: 'Jangan tanda tangan sebelum membaca semua pasal.',
        vi: 'Đừng ký tên trước khi đọc tất cả các điều khoản.',
      },
      {
        en: 'Apakah ada pajak pembeli yang harus dibayar?',
        vi: 'Có thuế bên mua nào phải trả không?',
      },
      {
        en: 'Kami minta salinan dokumen setelah tanda tangan.',
        vi: 'Chúng tôi xin bản sao giấy tờ sau khi ký.',
      },
    ],
    pronunciation_focus: [
      '“notaris” đọc gần như “no-ta-ris”, nghĩa là notary/công chứng viên trong giao dịch nhà đất; đừng nhầm với “nota” là hóa đơn/ghi chú.',
      '“AJB” là viết tắt của “Akta Jual Beli”. Khi nói, có thể đánh vần từng chữ: “a-je-be”.',
      '“sertifikat tanah” cụ thể hơn “surat tanah”; dùng khi hỏi giấy chứng nhận quyền liên quan đến đất/nhà.',
      '“balik nama” là sang tên chủ sở hữu, không dịch từng chữ là “quay tên”.',
      '“biaya notaris ditanggung oleh siapa?” là cách hỏi lịch sự về bên chịu phí.',
      '“pengecekan sertifikat” nhấn mạnh việc kiểm tra tình trạng giấy tờ trước khi trả tiền lớn.',
      '“tanda tangan” là ký tên; không dùng “tulis nama” khi nói về chữ ký pháp lý.',
      '“sesuai dengan KTP” nghĩa là khớp/đúng theo KTP, hay dùng khi kiểm tra hồ sơ cá nhân.',
      '“pasal” là điều khoản trong văn bản; khi mua nhà nên hỏi nếu có pasal chưa rõ.',
    ],
    pronunciation_focus_en: [
      '“notaris” is pronounced roughly “no-ta-ris” and means notary in property transactions; do not confuse it with “nota,” a receipt or note.',
      '“AJB” stands for “Akta Jual Beli.” In speech, spell it letter by letter: “a-je-be.”',
      '“sertifikat tanah” is more specific than “surat tanah”; use it when asking about land or property certificates.',
      '“balik nama” means title transfer, not literally “turn name.”',
      '“biaya notaris ditanggung oleh siapa?” is a polite way to ask who bears the notary fee.',
      '“pengecekan sertifikat” emphasizes checking document status before making a large payment.',
      '“tanda tangan” means signature or to sign; do not use “tulis nama” for a legal signature.',
      '“sesuai dengan KTP” means matching the ID card, common in personal-document checks.',
      '“pasal” means a clause or article in a document; ask questions if a property clause is unclear.',
    ],
    cultural_notes_vi: [
      'Trong giao dịch nhà đất ở Indonesia, người mua thường làm việc với notaris/PPAT để xử lý AJB, kiểm tra chứng nhận và thủ tục sang tên.',
      'Các khoản phí có thể gồm phí notary, thuế bên mua/bên bán và phí hành chính. Bài này chỉ dạy ngôn ngữ, không phải tư vấn pháp lý.',
      'Nên hỏi rõ bản gốc, bản sao, thời hạn xử lý và ai chịu từng khoản phí trước khi ký.',
    ],
    cultural_notes_en: [
      'In Indonesian property transactions, buyers often work with a notaris/PPAT for the AJB, certificate checks, and title transfer.',
      'Costs may include notary fees, buyer/seller taxes, and administrative fees. This lesson teaches language, not legal advice.',
      'Ask clearly about originals, copies, processing time, and who pays each fee before signing.',
    ],
    tip_advice_vi: [
      'Khi chưa chắc, dùng “Bisa dijelaskan lagi?” để yêu cầu giải thích lại một điều khoản.',
      'Trước khi chuyển tiền lớn, hãy hỏi “Apakah sertifikat sudah dicek?” để xác nhận việc kiểm tra giấy tờ.',
      'Nếu cần bản sao, nói “Kami minta salinan dokumen” thay vì chỉ nói “minta kertas”.',
    ],
    tip_advice_en: [
      'When unsure, use “Bisa dijelaskan lagi?” to ask for a clause to be explained again.',
      'Before transferring a large amount, ask “Apakah sertifikat sudah dicek?” to confirm the document check.',
      'If you need copies, say “Kami minta salinan dokumen” instead of the vague “minta kertas.”',
    ],
    vocabulary: [
      {
        cell_id: "9c54e2ec-8e88-40bb-9364-1748fc430b8a",
        word: 'notaris',
        meaning_vi: 'công chứng viên/notary',
        meaning_en: 'notary',
        example: 'Kami bertemu notaris hari Jumat.',
      },
      {
        cell_id: "ecd2c626-8ee6-4fa8-b096-afed77f1d38f",
        word: 'AJB',
        meaning_vi: 'hợp đồng/chứng thư mua bán, Akta Jual Beli',
        meaning_en: 'sale and purchase deed',
        example: 'AJB ditandatangani setelah dokumen lengkap.',
      },
      {
        cell_id: "743e7d03-7191-4f23-a7ca-3cd7fa71497e",
        word: 'sertifikat tanah',
        meaning_vi: 'giấy chứng nhận đất',
        meaning_en: 'land certificate',
        example: 'Notaris memeriksa sertifikat tanah.',
      },
      {
        cell_id: "07509a78-1339-4bd2-be40-9a892a99715d",
        word: 'balik nama',
        meaning_vi: 'sang tên',
        meaning_en: 'title transfer',
        example: 'Proses balik nama membutuhkan beberapa minggu.',
      },
      {
        cell_id: "8b523d25-5fb5-4a0f-8947-98ca6cff2997",
        word: 'biaya notaris',
        meaning_vi: 'phí notary',
        meaning_en: 'notary fee',
        example: 'Biaya notaris dibicarakan sebelum tanda tangan.',
      },
      {
        cell_id: "ad7391cf-4de8-4bbe-aa0a-37324de6aa71",
        word: 'pengecekan sertifikat',
        meaning_vi: 'việc kiểm tra giấy chứng nhận',
        meaning_en: 'certificate check',
        example: 'Pengecekan sertifikat penting sebelum bayar DP.',
      },
      {
        cell_id: "049a10a1-295d-48ec-895c-24e8b5d18392",
        word: 'tanda tangan',
        meaning_vi: 'chữ ký; ký tên',
        meaning_en: 'signature; to sign',
        example: 'Jangan tanda tangan kalau belum paham.',
      },
      {
        cell_id: "4fafdb1e-82a9-4710-a009-df05389a4970",
        word: 'pasal',
        meaning_vi: 'điều khoản',
        meaning_en: 'clause; article',
        example: 'Pasal ini menjelaskan jadwal pembayaran.',
      },
      {
        cell_id: "ab3f0740-d5ba-45c9-a9be-6eaa4253315e",
        word: 'salinan dokumen',
        meaning_vi: 'bản sao giấy tờ',
        meaning_en: 'document copy',
        example: 'Kami perlu salinan dokumen untuk arsip.',
      },
      {
        cell_id: "b65b8600-d007-4a54-86a2-24da1282c8dd",
        word: 'ditanggung oleh siapa',
        meaning_vi: 'do ai chịu/trả',
        meaning_en: 'borne or paid by whom',
        example: 'Pajak pembeli ditanggung oleh siapa?',
      },
    ],
    dialogue: [
      {
        cell_id: "0d50a9d5-077d-44cc-94e4-ca6f84e45e7d",
        speaker: 'Pembeli',
        text: 'Selamat siang, kami mau membuat janji dengan notaris untuk pembelian rumah.',
        vi: 'Chào buổi trưa, chúng tôi muốn đặt lịch với notary để mua nhà.',
        en: 'Good afternoon, we would like to make an appointment with the notary for a house purchase.',
      },
      {
        cell_id: "11621f4f-b329-46f5-a75f-fedbd1b83928",
        speaker: 'Staf Notaris',
        text: 'Baik. Tolong siapkan KTP, NPWP, dan salinan sertifikat tanah.',
        vi: 'Được. Vui lòng chuẩn bị KTP, NPWP và bản sao giấy chứng nhận đất.',
        en: 'Sure. Please prepare your ID card, tax number, and a copy of the land certificate.',
      },
      {
        cell_id: "50250dff-a846-496f-9407-91f2e201b356",
        speaker: 'Pembeli',
        text: 'Sebelum bayar DP, apakah bisa dilakukan pengecekan sertifikat?',
        vi: 'Trước khi trả đặt cọc, có thể kiểm tra giấy chứng nhận không?',
        en: 'Before paying the deposit, can the certificate check be done?',
      },
      {
        cell_id: "9ab3564a-a58a-4532-8e3e-d9c1ec1dda85",
        speaker: 'Staf Notaris',
        text: 'Bisa. Setelah hasilnya jelas, kita jadwalkan tanda tangan AJB dan proses balik nama.',
        vi: 'Có thể. Sau khi kết quả rõ, chúng ta sẽ xếp lịch ký AJB và làm thủ tục sang tên.',
        en: 'Yes. After the result is clear, we will schedule the AJB signing and title-transfer process.',
      },
    ],
    exercises: [
      {
        type: 'translation',
        prompt_vi: 'Dịch sang tiếng Indonesia: “Phí notary do ai chịu?”',
        prompt_en: 'Translate into Indonesian: “Who pays the notary fee?”',
        answer: 'Biaya notaris ditanggung oleh siapa?',
      },
      {
        type: 'fill_blank',
        prompt_vi: 'Điền từ còn thiếu: Setelah AJB, proses ____ nama berapa lama?',
        prompt_en: 'Fill in the blank: Setelah AJB, proses ____ nama berapa lama?',
        answer: 'balik',
      },
      {
        type: 'multiple_choice',
        prompt_vi: 'Cụm nào nghĩa là “kiểm tra giấy chứng nhận”?',
        prompt_en: 'Which phrase means “certificate check”?',
        answer: 'pengecekan sertifikat',
        choices: ['pengecekan sertifikat', 'potong sertifikat', 'tulis sertifikat'],
      },
      {
        type: 'matching',
        prompt_vi: 'Ghép nghĩa: AJB = ?',
        prompt_en: 'Match the meaning: AJB = ?',
        answer: 'Akta Jual Beli',
      },
    ],
  },
];

export default lessons;
