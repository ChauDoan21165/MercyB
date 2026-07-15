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
    id: 'bank-account-opening',
    title: 'Buka rekening bank di Indonesia',
    level: 'A2',
    topic: 'open a bank account, KTP, initial deposit, passbook, debit card, mobile banking, signature, admin fee',
    vietnamese_title: 'Mở tài khoản ngân hàng ở Indonesia',
    english_title: 'Bank Account Opening',
    pronunciation_focus: [
      'Buka rekening nghĩa là mở tài khoản ngân hàng. Trong ngân hàng dùng rekening, không dùng akun theo kiểu app.',
      'KTP đọc từng chữ ka-te-pe. Người nước ngoài thường dùng paspor dan KITAS/KITAP thay vì KTP.',
      'Setoran awal nghĩa là khoản nộp ban đầu. Setoran berasal dari setor, nghĩa là nộp/gửi tiền vào ngân hàng.',
      'Buku tabungan là sổ tiết kiệm/sổ tài khoản. Tabungan liên quan đến menabung, nghĩa là tiết kiệm.',
      'Kartu debit là thẻ ghi nợ. Jangan campur dengan kartu kredit, yaitu thẻ tín dụng.',
      'Biaya admin nghĩa là phí quản lý/phí admin. Khi hỏi số tiền, dùng berapa: Berapa biaya adminnya?',
    ],
    pronunciation_focus_en: [
      'Buka rekening means open a bank account. In banking, use rekening, not app-style akun.',
      'KTP is read letter by letter: ka-te-pe. Foreigners usually use paspor and KITAS/KITAP instead of KTP.',
      'Setoran awal means initial deposit. Setoran comes from setor, meaning to deposit money into a bank.',
      'Buku tabungan is a passbook or savings account book. Tabungan is related to menabung, to save money.',
      'Kartu debit means debit card. Do not confuse it with kartu kredit, which is a credit card.',
      'Biaya admin means admin or maintenance fee. For amounts, ask with berapa: Berapa biaya adminnya?',
    ],
    sentences: [
      {
        en: 'Saya mau buka rekening tabungan.',
        vi: 'Tôi muốn mở tài khoản tiết kiệm.',
        pronunciation: 'SA-ya mau BU-ka re-KE-ning ta-BU-ngan',
      },
      {
        en: 'Dokumen apa saja yang diperlukan?',
        vi: 'Cần những giấy tờ nào?',
        pronunciation: 'DO-ku-men A-pa SA-ja yang di-per-LU-kan',
      },
      {
        en: 'Ini KTP dan tanda tangan saya.',
        vi: 'Đây là KTP và chữ ký của tôi.',
        pronunciation: 'I-ni ka-te-pe dan TAN-da TA-ngan SA-ya',
      },
      {
        en: 'Berapa setoran awal untuk rekening ini?',
        vi: 'Khoản nộp ban đầu cho tài khoản này là bao nhiêu?',
        pronunciation: 'be-RA-pa se-TO-ran A-wal UN-tuk re-KE-ning i-ni',
      },
      {
        en: 'Apakah saya akan mendapat buku tabungan?',
        vi: 'Tôi sẽ nhận được sổ tài khoản/sổ tiết kiệm không?',
        pronunciation: 'a-PA-kah SA-ya A-kan men-DA-pat BU-ku ta-BU-ngan',
      },
      {
        en: 'Saya ingin kartu debit dan mobile banking.',
        vi: 'Tôi muốn thẻ ghi nợ và mobile banking.',
        pronunciation: 'SA-ya I-ngin KAR-tu DE-bit dan MO-bail BANG-king',
      },
      {
        en: 'Biaya admin per bulan berapa?',
        vi: 'Phí admin mỗi tháng là bao nhiêu?',
        pronunciation: 'BI-a-ya AD-min per BU-lan be-RA-pa',
      },
      {
        en: 'Tolong bantu aktifkan mobile banking saya.',
        vi: 'Vui lòng giúp kích hoạt mobile banking của tôi.',
        pronunciation: 'TO-long BAN-tu ak-TIF-kan MO-bail BANG-king SA-ya',
      },
    ],
    vocabulary: [
      {
        cell_id: "1123fd84-95de-4957-a15b-082088104a97",
        word: 'buka rekening',
        meaning_vi: 'mở tài khoản ngân hàng',
        meaning_en: 'open a bank account',
        example: 'Saya mau buka rekening di cabang ini.',
        example_vi: 'Tôi muốn mở tài khoản ở chi nhánh này.',
      },
      {
        cell_id: "1ab6b12c-f971-4aec-b010-c04d94d91315",
        word: 'KTP',
        meaning_vi: 'thẻ căn cước Indonesia',
        meaning_en: 'Indonesian identity card',
        example: 'Nasabah perlu membawa KTP asli.',
        example_vi: 'Khách hàng cần mang KTP bản gốc.',
      },
      {
        cell_id: "f6cbd33d-5ca3-4d1f-83be-aa3fe323057d",
        word: 'setoran awal',
        meaning_vi: 'khoản nộp ban đầu',
        meaning_en: 'initial deposit',
        example: 'Setoran awal minimal seratus ribu rupiah.',
        example_vi: 'Khoản nộp ban đầu tối thiểu là một trăm nghìn rupiah.',
      },
      {
        cell_id: "1d207e1f-e7fe-4425-bc8e-6b70005aba04",
        word: 'buku tabungan',
        meaning_vi: 'sổ tiết kiệm/sổ tài khoản',
        meaning_en: 'savings passbook',
        example: 'Buku tabungan bisa dicetak di cabang bank.',
        example_vi: 'Sổ tài khoản có thể được in tại chi nhánh ngân hàng.',
      },
      {
        cell_id: "020a2d9e-fa54-4bf3-8f1c-a2054d01f42d",
        word: 'kartu debit',
        meaning_vi: 'thẻ ghi nợ',
        meaning_en: 'debit card',
        example: 'Kartu debit saya bisa dipakai untuk tarik tunai.',
        example_vi: 'Thẻ ghi nợ của tôi có thể dùng để rút tiền mặt.',
      },
      {
        cell_id: "378c2842-0cc1-48ca-874d-dcd6b64806ef",
        word: 'mobile banking',
        meaning_vi: 'dịch vụ ngân hàng trên điện thoại',
        meaning_en: 'mobile banking',
        example: 'Mobile banking memudahkan transfer dan cek saldo.',
        example_vi: 'Mobile banking giúp chuyển khoản và kiểm tra số dư dễ hơn.',
      },
      {
        cell_id: "1e13ba8b-7921-42d1-a5cc-1c12eaa679b1",
        word: 'tanda tangan',
        meaning_vi: 'chữ ký, ký tên',
        meaning_en: 'signature',
        example: 'Tanda tangan di formulir harus sama dengan KTP.',
        example_vi: 'Chữ ký trên mẫu đơn phải giống với KTP.',
      },
      {
        cell_id: "b69157e8-5cf4-432e-a961-308facf6d81c",
        word: 'biaya admin',
        meaning_vi: 'phí admin/phí quản lý',
        meaning_en: 'admin or maintenance fee',
        example: 'Biaya admin dipotong setiap bulan.',
        example_vi: 'Phí admin được trừ mỗi tháng.',
      },
    ],
    dialogue: [
      {
        cell_id: "bb757676-877f-4f46-9569-cde067e70a74",
        speaker: 'Nasabah',
        line: 'Selamat pagi. Saya mau buka rekening tabungan.',
        vi: 'Chào buổi sáng. Tôi muốn mở tài khoản tiết kiệm.',
        en: 'Good morning. I would like to open a savings account.',
      },
      {
        cell_id: "7f78ffb6-4b7f-4917-b047-a0e82030b17e",
        speaker: 'Petugas Bank',
        line: 'Selamat pagi. Boleh lihat KTP dan nomor HP, Pak?',
        vi: 'Chào buổi sáng. Tôi có thể xem KTP và số điện thoại của anh không?',
        en: 'Good morning. May I see your KTP and phone number, Sir?',
      },
      {
        cell_id: "a9ff1454-d9c9-43da-af27-c09047dfb46c",
        speaker: 'Nasabah',
        line: 'Ini KTP saya. Berapa setoran awalnya?',
        vi: 'Đây là KTP của tôi. Khoản nộp ban đầu là bao nhiêu?',
        en: 'This is my KTP. How much is the initial deposit?',
      },
      {
        cell_id: "2c798feb-29a6-4083-843c-a8e99e100de0",
        speaker: 'Petugas Bank',
        line: 'Setoran awal minimal seratus ribu rupiah.',
        vi: 'Khoản nộp ban đầu tối thiểu là một trăm nghìn rupiah.',
        en: 'The minimum initial deposit is one hundred thousand rupiah.',
      },
      {
        cell_id: "0876489e-89fd-408b-ad3b-038584e83063",
        speaker: 'Nasabah',
        line: 'Saya juga ingin kartu debit dan mobile banking.',
        vi: 'Tôi cũng muốn thẻ ghi nợ và mobile banking.',
        en: 'I also want a debit card and mobile banking.',
      },
      {
        cell_id: "9405cec7-d930-4e0a-a4cd-3f507ea139db",
        speaker: 'Petugas Bank',
        line: 'Baik. Silakan isi formulir dan tanda tangan di sini.',
        vi: 'Vâng. Vui lòng điền mẫu đơn và ký tên ở đây.',
        en: 'All right. Please fill out the form and sign here.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, buka rekening thường cần KTP cho công dân Indonesia. Người nước ngoài có thể được yêu cầu paspor, KITAS/KITAP, NPWP, hoặc dokumen tambahan tùy ngân hàng.',
      'Rekening dùng cho tài khoản ngân hàng; akun dùng nhiều hơn cho app, email, hoặc mạng xã hội. Đây là bẫy lớn cho người Việt.',
      'Một số ngân hàng vẫn dùng buku tabungan, nhưng nhiều layanan hiện nay chuyển sang e-statement và mobile banking.',
      'Biaya admin, setoran awal, limit kartu debit, dan fitur mobile banking có thể khác nhau giữa từng loại rekening.',
    ],
    cultural_notes_en: [
      'In Indonesia, opening an account usually requires KTP for Indonesian citizens. Foreigners may be asked for a passport, KITAS/KITAP, NPWP, or additional documents depending on the bank.',
      'Rekening is used for bank accounts; akun is more common for apps, email, or social media. This is a major trap for Vietnamese learners.',
      'Some banks still use passbooks, but many services now use e-statements and mobile banking.',
      'Admin fees, initial deposits, debit card limits, and mobile banking features vary by account type.',
    ],
    tip_advice_vi: [
      'Câu mở đầu nên nhớ: Saya mau buka rekening tabungan. Nếu hỏi giấy tờ: Dokumen apa saja yang diperlukan?',
      'Khi hỏi tiền, dùng berapa: Berapa setoran awalnya? Berapa biaya admin per bulan?',
      'Dùng mendapat hoặc dapat khi hỏi sẽ nhận gì: Apakah saya akan mendapat buku tabungan?',
      'Untuk dịch vụ app ngân hàng: Tolong bantu aktifkan mobile banking saya nghe tự nhiên và lịch sự.',
    ],
    tip_advice_en: [
      'Memorize the opener: Saya mau buka rekening tabungan. To ask about documents: Dokumen apa saja yang diperlukan?',
      'For money questions, use berapa: Berapa setoran awalnya? Berapa biaya admin per bulan?',
      'Use mendapat or dapat when asking what you will receive: Apakah saya akan mendapat buku tabungan?',
      'For banking app service, Tolong bantu aktifkan mobile banking saya sounds natural and polite.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Saya mau buka ____ tabungan.',
        answer: 'rekening',
        explanation_vi: 'Trong ngân hàng dùng rekening cho tài khoản, không dùng akun.',
        explanation_en: 'In banking, use rekening for an account, not akun.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “initial deposit”?',
        answer: 'setoran awal',
        explanation_vi: 'Setoran là khoản nộp/gửi tiền, awal là ban đầu.',
        explanation_en: 'Setoran means deposit/payment into an account, and awal means initial.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: How much is the monthly admin fee?',
        answer: 'Biaya admin per bulan berapa?',
        explanation_vi: 'Biaya admin là phí admin; per bulan là mỗi tháng; berapa hỏi số tiền.',
        explanation_en: 'Biaya admin means admin fee; per bulan means per month; berapa asks the amount.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask the bank staff to help activate your mobile banking.',
        answer: 'Tolong bantu aktifkan mobile banking saya.',
        explanation_vi: 'Tolong bantu làm câu lịch sự; aktifkan nghĩa là kích hoạt/bật.',
        explanation_en: 'Tolong bantu makes the request polite; aktifkan means activate or turn on.',
      },
    ],
  },
];
