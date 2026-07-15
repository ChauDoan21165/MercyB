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
    id: 'professional-networking',
    title: 'Networking profesional dan perkenalan sopan',
    level: 'B1',
    topic: 'networking, professional contacts, business cards, LinkedIn, business events, follow-up, cooperation, polite introductions',
    vietnamese_title: 'Networking chuyên nghiệp và giới thiệu lịch sự',
    english_title: 'Professional Networking',
    pronunciation_focus: [
      'Networking rất thường dùng trong tiếng Indonesia công sở, nhưng bisa juga dikatakan membangun jaringan profesional.',
      'Kenalan profesional berarti người quen/mối quan hệ trong công việc. Kenalan bukan hanya "làm quen", mà juga "người quen".',
      'Kartu nama nghĩa là danh thiếp. Nama là tên; kartu nama letterlijk "thẻ tên", nhưng nghĩa thực tế là business card.',
      'LinkedIn biasanya dibaca lingk-din hoặc link-in. Trong câu Indonesia, nói terhubung di LinkedIn rất tự nhiên.',
      'Follow up sering dipakai trong bisnis. Bentuk Indonesia yang lebih formal: tindak lanjut.',
      'Kerja sama ditulis dua kata untuk noun phrase "sự hợp tác"; bekerja sama là động từ "hợp tác".',
    ],
    pronunciation_focus_en: [
      'Networking is very common in Indonesian business speech, but you can also say membangun jaringan profesional.',
      'Kenalan profesional means a professional contact. Kenalan can mean both getting acquainted and an acquaintance/contact.',
      'Kartu nama means business card. Literally it is "name card," but its real meaning is business card.',
      'LinkedIn is commonly pronounced lingk-din or link-in. Terhubung di LinkedIn sounds natural in Indonesian.',
      'Follow up is common in business. The more formal Indonesian form is tindak lanjut.',
      'Kerja sama is written as two words for the noun phrase "cooperation"; bekerja sama is the verb "to collaborate."',
    ],
    sentences: [
      {
        en: 'Saya ingin memperluas jaringan profesional saya.',
        vi: 'Tôi muốn mở rộng mạng lưới chuyên nghiệp của tôi.',
        pronunciation: 'SA-ya I-ngin mem-per-LU-as ja-RI-ngan pro-fe-si-o-NAL SA-ya',
      },
      {
        en: 'Senang berkenalan dengan Bapak di acara bisnis ini.',
        vi: 'Rất vui được làm quen với anh/chú tại sự kiện kinh doanh này.',
        pronunciation: 'SE-nang ber-ke-NA-lan de-NGAN BA-pak di a-CA-ra BIS-nis i-ni',
      },
      {
        en: 'Boleh saya minta kartu nama Anda?',
        vi: 'Tôi có thể xin danh thiếp của anh/chị không?',
        pronunciation: 'BO-leh SA-ya MIN-ta KAR-tu NA-ma AN-da',
      },
      {
        en: 'Mari kita terhubung di LinkedIn.',
        vi: 'Chúng ta hãy kết nối trên LinkedIn.',
        pronunciation: 'MA-ri KI-ta ter-HU-bung di LINK-din',
      },
      {
        en: 'Saya akan follow up lewat email besok pagi.',
        vi: 'Tôi sẽ follow up qua email vào sáng mai.',
        pronunciation: 'SA-ya A-kan FO-low ap LE-wat E-mail BE-sok PA-gi',
      },
      {
        en: 'Perusahaan kami tertarik untuk bekerja sama.',
        vi: 'Công ty chúng tôi quan tâm đến việc hợp tác.',
        pronunciation: 'per-u-sa-HA-an KA-mi ter-TA-rik UN-tuk be-KER-ja SA-ma',
      },
      {
        en: 'Boleh saya perkenalkan diri secara singkat?',
        vi: 'Tôi có thể tự giới thiệu ngắn gọn không?',
        pronunciation: 'BO-leh SA-ya per-ke-NAL-kan DI-ri se-CA-ra SING-kat',
      },
      {
        en: 'Mohon hubungi saya kalau ada peluang kerja sama.',
        vi: 'Xin liên hệ với tôi nếu có cơ hội hợp tác.',
        pronunciation: 'MO-hon hu-BUNG-i SA-ya KA-lau A-da pe-LU-ang KER-ja SA-ma',
      },
    ],
    vocabulary: [
      {
        cell_id: "fa6473cf-f6d5-4fb4-bef8-3d06ff81dd26",
        word: 'networking',
        meaning_vi: 'networking, xây dựng quan hệ',
        meaning_en: 'networking',
        example: 'Networking penting untuk pengembangan karier.',
        example_vi: 'Networking quan trọng cho phát triển sự nghiệp.',
      },
      {
        cell_id: "f0c57ff2-882f-4cd2-b207-d812b4b536ba",
        word: 'jaringan profesional',
        meaning_vi: 'mạng lưới chuyên nghiệp',
        meaning_en: 'professional network',
        example: 'Dia punya jaringan profesional yang luas.',
        example_vi: 'Anh ấy/cô ấy có mạng lưới chuyên nghiệp rộng.',
      },
      {
        cell_id: "0f69a69f-3fdf-4fc6-a476-c28040db072e",
        word: 'kenalan profesional',
        meaning_vi: 'mối quan hệ/người quen chuyên nghiệp',
        meaning_en: 'professional contact',
        example: 'Saya mendapat beberapa kenalan profesional di acara itu.',
        example_vi: 'Tôi có vài mối quan hệ chuyên nghiệp tại sự kiện đó.',
      },
      {
        cell_id: "d0cda34c-9a02-4046-8b08-3b1b6d9563ea",
        word: 'kartu nama',
        meaning_vi: 'danh thiếp',
        meaning_en: 'business card',
        example: 'Kartu nama saya ada nomor HP dan email.',
        example_vi: 'Danh thiếp của tôi có số điện thoại và email.',
      },
      {
        cell_id: "434d753e-4f47-4e91-af8f-a64ac6929348",
        word: 'LinkedIn',
        meaning_vi: 'LinkedIn',
        meaning_en: 'LinkedIn',
        example: 'Saya sudah mengirim koneksi di LinkedIn.',
        example_vi: 'Tôi đã gửi lời kết nối trên LinkedIn.',
      },
      {
        cell_id: "9104e8ef-44a0-48e0-bfb8-dd64d208528e",
        word: 'acara bisnis',
        meaning_vi: 'sự kiện kinh doanh',
        meaning_en: 'business event',
        example: 'Acara bisnis itu dihadiri banyak pendiri startup.',
        example_vi: 'Sự kiện kinh doanh đó có nhiều nhà sáng lập startup tham dự.',
      },
      {
        cell_id: "cddfc9bb-5d17-4d4c-997f-0e7af76592bb",
        word: 'tindak lanjut',
        meaning_vi: 'follow-up, bước xử lý tiếp theo',
        meaning_en: 'follow-up',
        example: 'Tindak lanjut akan dikirim lewat email.',
        example_vi: 'Follow-up sẽ được gửi qua email.',
      },
      {
        cell_id: "22d48a1b-6d63-4b82-8437-f22a48b27419",
        word: 'kerja sama',
        meaning_vi: 'sự hợp tác',
        meaning_en: 'cooperation or collaboration',
        example: 'Kami terbuka untuk kerja sama jangka panjang.',
        example_vi: 'Chúng tôi sẵn sàng hợp tác dài hạn.',
      },
    ],
    dialogue: [
      {
        cell_id: "7806cf2d-ef5b-4060-aa66-ac2cc8d4c06b",
        speaker: 'Linh',
        line: 'Selamat sore, Pak. Saya Linh dari perusahaan teknologi kecil.',
        vi: 'Chào buổi chiều anh/chú. Tôi là Linh từ một công ty công nghệ nhỏ.',
        en: 'Good afternoon, Sir. I am Linh from a small technology company.',
      },
      {
        cell_id: "70dd2379-7317-4acc-a405-a5152dcc00ba",
        speaker: 'Budi',
        line: 'Selamat sore. Senang berkenalan. Bidang apa yang perusahaan Ibu kerjakan?',
        vi: 'Chào buổi chiều. Rất vui được làm quen. Công ty chị làm lĩnh vực gì?',
        en: 'Good afternoon. Nice to meet you. What field does your company work in?',
      },
      {
        cell_id: "769bd10f-e649-4f23-8358-10889f6c7c3d",
        speaker: 'Linh',
        line: 'Kami fokus pada aplikasi belajar bahasa. Boleh saya minta kartu nama Bapak?',
        vi: 'Chúng tôi tập trung vào ứng dụng học ngôn ngữ. Tôi có thể xin danh thiếp của anh/chú không?',
        en: 'We focus on language-learning apps. May I ask for your business card?',
      },
      {
        cell_id: "61bc7c12-75b5-48c1-8d1a-d0fb84be703e",
        speaker: 'Budi',
        line: 'Tentu. Mari kita juga terhubung di LinkedIn.',
        vi: 'Tất nhiên. Chúng ta cũng hãy kết nối trên LinkedIn.',
        en: 'Of course. Let us also connect on LinkedIn.',
      },
      {
        cell_id: "1ea14f5d-a17f-4024-9bce-cd09d176a0b7",
        speaker: 'Linh',
        line: 'Baik, Pak. Saya akan follow up lewat email besok pagi.',
        vi: 'Vâng. Tôi sẽ follow up qua email vào sáng mai.',
        en: 'All right. I will follow up by email tomorrow morning.',
      },
      {
        cell_id: "449fad3d-8d97-45f0-a163-4f7c4c6b04c8",
        speaker: 'Budi',
        line: 'Terima kasih. Saya tertarik membahas peluang kerja sama.',
        vi: 'Cảm ơn. Tôi quan tâm đến việc thảo luận cơ hội hợp tác.',
        en: 'Thank you. I am interested in discussing collaboration opportunities.',
      },
    ],
    cultural_notes_vi: [
      'Trong networking ở Indonesia, mở đầu bằng Selamat pagi/siang/sore và Pak/Bu giúp câu nghe lịch sự, nhất là khi mới gặp.',
      'Kartu nama vẫn hữu ích ở acara bisnis, nhưng nhiều người cũng langsung bertukar LinkedIn, WhatsApp, atau email.',
      'Follow up có thể dùng trong nói hằng ngày công sở. Trong email trang trọng, tindak lanjut nghe chỉnh hơn.',
      'Khi đề cập kerja sama, câu mềm như mungkin ada peluang kerja sama hoặc kami terbuka untuk kerja sama nghe tự nhiên và không ép buộc.',
    ],
    cultural_notes_en: [
      'In Indonesian networking, opening with Selamat pagi/siang/sore and Pak/Bu makes the interaction polite, especially with new contacts.',
      'Business cards are still useful at business events, but many people also exchange LinkedIn, WhatsApp, or email directly.',
      'Follow up is common in everyday office speech. In formal email, tindak lanjut sounds more polished.',
      'When mentioning collaboration, soft lines like mungkin ada peluang kerja sama or kami terbuka untuk kerja sama sound natural and non-pushy.',
    ],
    tip_advice_vi: [
      'Câu mở đầu an toàn: Senang berkenalan dengan Bapak/Ibu. Sau đó giới thiệu ngắn: Saya ... dari ...',
      'Để xin danh thiếp: Boleh saya minta kartu nama Anda? Với người lớn tuổi/cấp cao hơn, dùng Bapak/Ibu thay Anda.',
      'Để chuyển sang LinkedIn: Mari kita terhubung di LinkedIn. Nghe tự nhiên hơn dịch từng chữ "kết bạn LinkedIn".',
      'Để follow up lịch sự: Saya akan mengirim tindak lanjut lewat email hoặc Saya akan follow up lewat email.',
    ],
    tip_advice_en: [
      'Safe opener: Senang berkenalan dengan Bapak/Ibu. Then introduce yourself briefly: Saya ... dari ...',
      'To ask for a business card: Boleh saya minta kartu nama Anda? With older or higher-status people, use Bapak/Ibu instead of Anda.',
      'To move to LinkedIn: Mari kita terhubung di LinkedIn. It sounds more natural than translating "add friend on LinkedIn."',
      'For polite follow-up: Saya akan mengirim tindak lanjut lewat email or Saya akan follow up lewat email.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Boleh saya minta kartu ____ Anda?',
        answer: 'nama',
        explanation_vi: 'Kartu nama nghĩa là danh thiếp.',
        explanation_en: 'Kartu nama means business card.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “professional network”?',
        answer: 'jaringan profesional',
        explanation_vi: 'Jaringan là mạng lưới, profesional là chuyên nghiệp.',
        explanation_en: 'Jaringan means network, and profesional means professional.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Let us connect on LinkedIn.',
        answer: 'Mari kita terhubung di LinkedIn.',
        explanation_vi: 'Mari kita là "chúng ta hãy"; terhubung di LinkedIn là kết nối trên LinkedIn.',
        explanation_en: 'Mari kita means "let us"; terhubung di LinkedIn means connected on LinkedIn.',
      },
      {
        type: 'roleplay',
        prompt: 'Politely say that you will follow up by email tomorrow morning.',
        answer: 'Saya akan follow up lewat email besok pagi.',
        explanation_vi: 'Lewat email nghĩa là qua email; besok pagi là sáng mai.',
        explanation_en: 'Lewat email means via email; besok pagi means tomorrow morning.',
      },
    ],
  },
];
