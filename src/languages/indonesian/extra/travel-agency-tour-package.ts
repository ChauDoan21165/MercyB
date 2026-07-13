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
    id: 'travel-agency-tour-package',
    title: 'Paket tur dan rencana perjalanan dengan agen',
    level: 'B1',
    topic: 'travel agency, tour package, sightseeing schedule, hotel, transport, deposit, cancellation, tour guide',
    vietnamese_title: 'Gói tour và kế hoạch chuyến đi với công ty du lịch',
    english_title: 'Travel Agency Tour Package',
    pronunciation_focus: [
      'Agen perjalanan nghĩa là công ty/đại lý du lịch. Agen ở đây không phải gián điệp mà là bên trung gian dịch vụ.',
      'Paket tur là gói tour. Paket = gói; tur = tour/chuyến du lịch trọn gói.',
      'Uang muka nghĩa là tiền đặt cọc hoặc khoản trả trước. Dalam konteks travel, uang muka sering dipakai sebagai deposit.',
      'Pembatalan nghĩa là việc hủy. Dalam layanan travel, pembatalan sering punya aturan dan biaya riêng.',
      'Pemandu wisata nghĩa là hướng dẫn viên du lịch. Pemandu membantu jadwal, transportasi, dan informasi tempat.',
      'Jadwal wisata nghĩa là lịch tham quan. Jadwal bisa harian, jadi penting untuk cek urutan kegiatan.',
    ],
    pronunciation_focus_en: [
      'Agen perjalanan means travel agency. Agen here is not a spy, but a service intermediary.',
      'Paket tur means tour package. Paket = package; tur = tour/all-in trip.',
      'Uang muka means advance payment or deposit. In travel contexts, it often functions as the deposit.',
      'Pembatalan means cancellation. In travel services, cancellation often has its own rules and fee.',
      'Pemandu wisata means tour guide. A guide helps with the schedule, transport, and place information.',
      'Jadwal wisata means sightseeing schedule. The schedule can be daily, so it is important to check the order of activities.',
    ],
    sentences: [
      {
        en: 'Saya ingin bertanya tentang paket tur ke Bali.',
        vi: 'Tôi muốn hỏi về gói tour đi Bali.',
        pronunciation: 'SA-ya I-ngin ber-TAN-ya ten-TANG pa-KET TUR ke BA-li',
      },
      {
        en: 'Apakah harga itu sudah termasuk hotel dan transportasi?',
        vi: 'Giá đó đã bao gồm khách sạn và phương tiện đi lại chưa?',
        pronunciation: 'a-PA-kah HAR-ga i-TU SU-dah ter-MASUK ho-TEL dan trans-por-TA-si',
      },
      {
        en: 'Kami perlu jadwal wisata hariannya dulu.',
        vi: 'Chúng tôi cần lịch tham quan hằng ngày trước.',
        pronunciation: 'KA-mi per-LU JAD-wal wi-SA-ta ha-RI-an-nya DU-lu',
      },
      {
        en: 'Berapa uang muka yang harus dibayar?',
        vi: 'Phải trả bao nhiêu tiền cọc?',
        pronunciation: 'be-RA-pa u-ANG MU-ka yang ha-RUS di-BA-yar',
      },
      {
        en: 'Saya mau paket yang bisa dibatalkan dengan mudah.',
        vi: 'Tôi muốn gói có thể hủy dễ dàng.',
        pronunciation: 'SA-ya mau pa-KET yang BI-sa di-ba-TAL-kan de-NGAN MU-dah',
      },
      {
        en: 'Apakah ada pemandu wisata untuk grup kami?',
        vi: 'Có hướng dẫn viên du lịch cho nhóm của chúng tôi không?',
        pronunciation: 'a-PA-kah A-da pe-MAN-du wi-SA-ta un-TUK grup KA-mi',
      },
      {
        en: 'Kami ingin tahu waktu bebas di malam hari.',
        vi: 'Chúng tôi muốn biết thời gian tự do vào buổi tối.',
        pronunciation: 'KA-mi I-ngin TA-hu wak-tu be-BAS di MA-lam HA-ri',
      },
      {
        en: 'Tolong kirim bukti pembayaran dan detail hotelnya.',
        vi: 'Vui lòng gửi bằng chứng thanh toán và chi tiết khách sạn.',
        pronunciation: 'TO-long KI-rim BUK-ti pem-ba-YAR-an dan de-TAIL ho-TEL-nya',
      },
    ],
    vocabulary: [
      {
        cell_id: "aaff15d3-71c6-4045-af09-8a1cfc1e4d08",
        word: 'agen perjalanan',
        meaning_vi: 'công ty/đại lý du lịch',
        meaning_en: 'travel agency',
        example: 'Agen perjalanan ini punya banyak pilihan paket.',
        example_vi: 'Công ty du lịch này có nhiều lựa chọn gói tour.',
      },
      {
        cell_id: "0d78fa4f-57ad-4122-a799-279865036899",
        word: 'paket tur',
        meaning_vi: 'gói tour',
        meaning_en: 'tour package',
        example: 'Paket tur itu sudah termasuk makan siang.',
        example_vi: 'Gói tour đó đã bao gồm bữa trưa.',
      },
      {
        cell_id: "99a29090-3ce8-41ff-a48b-38d5d26bce17",
        word: 'jadwal wisata',
        meaning_vi: 'lịch tham quan',
        meaning_en: 'sightseeing schedule',
        example: 'Jadwal wisata akan dikirim lewat email.',
        example_vi: 'Lịch tham quan sẽ được gửi qua email.',
      },
      {
        cell_id: "dbea25b8-7357-44ac-9f73-b0d04c5b4aed",
        word: 'hotel',
        meaning_vi: 'khách sạn',
        meaning_en: 'hotel',
        example: 'Hotel dalam paket ini bintang tiga.',
        example_vi: 'Khách sạn trong gói này là 3 sao.',
      },
      {
        cell_id: "b3078b6c-8680-4885-bc6c-16f296125815",
        word: 'transportasi',
        meaning_vi: 'phương tiện đi lại',
        meaning_en: 'transportation',
        example: 'Transportasi dari bandara sudah disiapkan.',
        example_vi: 'Phương tiện từ sân bay đã được chuẩn bị.',
      },
      {
        cell_id: "74477d82-867f-4b37-8a0a-c8f1a3a701d8",
        word: 'uang muka',
        meaning_vi: 'tiền đặt cọc, tiền trả trước',
        meaning_en: 'deposit, advance payment',
        example: 'Uang muka perlu dibayar hari ini.',
        example_vi: 'Tiền cọc cần được trả hôm nay.',
      },
      {
        cell_id: "c3da58a6-42dd-4c15-b7ab-ada80870669b",
        word: 'pembatalan',
        meaning_vi: 'việc hủy',
        meaning_en: 'cancellation',
        example: 'Kebijakan pembatalan perlu dibaca dulu.',
        example_vi: 'Cần đọc trước chính sách hủy.',
      },
      {
        cell_id: "3bb022a9-7e49-4fc9-b96c-68dd54f6ae66",
        word: 'pemandu wisata',
        meaning_vi: 'hướng dẫn viên du lịch',
        meaning_en: 'tour guide',
        example: 'Pemandu wisata akan menemani kami sepanjang hari.',
        example_vi: 'Hướng dẫn viên du lịch sẽ đi cùng chúng tôi cả ngày.',
      },
    ],
    dialogue: [
      {
        cell_id: "677e5939-f26c-4eb2-9b7c-1c29b96463b9",
        speaker: 'Pelanggan',
        line: 'Selamat pagi, saya ingin bertanya tentang paket tur ke Bali.',
        vi: 'Chào buổi sáng, tôi muốn hỏi về gói tour đi Bali.',
        en: 'Good morning, I would like to ask about a tour package to Bali.',
      },
      {
        cell_id: "c67339f2-5e27-47ea-b983-67a5520d1c8d",
        speaker: 'Staf Agen',
        line: 'Tentu. Apakah harga itu sudah termasuk hotel dan transportasi?',
        vi: 'Tất nhiên. Giá đó đã bao gồm khách sạn và phương tiện đi lại chưa?',
        en: 'Of course. Is that price already inclusive of hotel and transport?',
      },
      {
        cell_id: "e9a8335f-cb48-4b6c-995e-9a8ab578922e",
        speaker: 'Pelanggan',
        line: 'Kami juga perlu jadwal wisata hariannya.',
        vi: 'Chúng tôi cũng cần lịch tham quan hằng ngày.',
        en: 'We also need the daily sightseeing schedule.',
      },
      {
        cell_id: "e40b64bf-02b1-4fd5-bb70-0d72c7ca7e1a",
        speaker: 'Staf Agen',
        line: 'Baik. Saya kirim detail hotel, transportasi, dan pemandu wisata.',
        vi: 'Được. Tôi sẽ gửi chi tiết khách sạn, phương tiện và hướng dẫn viên du lịch.',
        en: 'All right. I will send the hotel, transport, and tour guide details.',
      },
      {
        cell_id: "681efcb8-4981-4c5c-ac18-93552cc82de7",
        speaker: 'Pelanggan',
        line: 'Berapa uang muka yang harus dibayar?',
        vi: 'Phải trả bao nhiêu tiền cọc?',
        en: 'How much deposit do we need to pay?',
      },
      {
        cell_id: "7ed5520b-599b-4d2b-83df-e87253daf6a6",
        speaker: 'Staf Agen',
        line: 'Uang muka lima puluh persen. Pembatalan bisa dilakukan sesuai kebijakan.',
        vi: 'Tiền cọc là 50%. Việc hủy có thể được thực hiện theo chính sách.',
        en: 'The deposit is fifty percent. Cancellation can be done according to policy.',
      },
    ],
    cultural_notes_vi: [
      'Di Indonesia, agen perjalanan thường menjual paket tur yang sudah termasuk hotel, transportasi, tiket masuk, atau pemandu wisata. Namun, selalu cek detailnya karena tidak semua paket sama.',
      'Uang muka thường diperlukan agar pemesanan dianggap pasti. Sebelum bayar, baca kebijakan pembatalan dan apakah ada biaya jika jadwal berubah.',
      'Nếu đi bersama keluarga atau rombongan kecil, agen bisa menyesuaikan jadwal wisata dan jenis hotel. Hỏi dengan jelas supaya tidak ada salah paham.',
      'Bukti pembayaran dan detail jadwal sebaiknya disimpan, terutama jika ada perubahan waktu penjemputan atau penginapan.',
    ],
    cultural_notes_en: [
      'In Indonesia, travel agencies often sell tour packages that already include hotel, transport, entrance tickets, or a tour guide. Still, check the details because not every package is the same.',
      'A deposit is often required so the booking counts as confirmed. Before paying, read the cancellation policy and whether there is a fee if the schedule changes.',
      'If you travel with family or a small group, the agency may adjust the sightseeing schedule and hotel type. Ask clearly so there is no misunderstanding.',
      'Payment proof and schedule details should be kept, especially if pickup time or accommodation changes.',
    ],
    tip_advice_vi: [
      'Khung hỏi nhanh: Apakah harga itu sudah termasuk hotel dan transportasi? và Berapa uang muka yang harus dibayar?',
      'Nếu muốn gói linh hoạt, dùng bisa dibatalkan dengan mudah hoặc sesuai kebijakan pembatalan.',
      'Pemandu wisata là người giúp chuyến đi trôi chảy. Jika perlu, hỏi apakah ada pemandu wisata untuk grup kami.',
      'Khi thanh toán, hãy minta bukti: Tolong kirim bukti pembayaran dan detail hotelnya.',
    ],
    tip_advice_en: [
      'Quick question frames: Apakah harga itu sudah termasuk hotel dan transportasi? and Berapa uang muka yang harus dibayar?',
      'If you want flexibility, use bisa dibatalkan dengan mudah or sesuai kebijakan pembatalan.',
      'A pemandu wisata helps the trip run smoothly. If needed, ask whether there is a tour guide for your group.',
      'When paying, ask for proof: Tolong kirim bukti pembayaran dan detail hotelnya.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Kami perlu ____ wisata hariannya dulu.',
        answer: 'jadwal',
        explanation_vi: 'Jadwal wisata là lịch trình tham quan.',
        explanation_en: 'Jadwal wisata means sightseeing schedule.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “deposit”?',
        answer: 'uang muka',
        explanation_vi: 'Uang muka trong ngữ cảnh tour là tiền cọc/tiền trả trước.',
        explanation_en: 'Uang muka in travel contexts means deposit or advance payment.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Is the price already including hotel and transportation?',
        answer: 'Apakah harga itu sudah termasuk hotel dan transportasi?',
        explanation_vi: 'Sudah termasuk = đã bao gồm; hotel dan transportasi = khách sạn và phương tiện đi lại.',
        explanation_en: 'Sudah termasuk = already included; hotel dan transportasi = hotel and transportation.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask the travel agency if the package can be canceled easily and if a guide is included.',
        answer: 'Saya mau paket yang bisa dibatalkan dengan mudah. Apakah ada pemandu wisata untuk grup kami?',
        explanation_vi: 'Bisa dibatalkan dengan mudah = có thể hủy dễ dàng; pemandu wisata = hướng dẫn viên du lịch.',
        explanation_en: 'Bisa dibatalkan dengan mudah = can be canceled easily; pemandu wisata = tour guide.',
      },
    ],
  },
];
