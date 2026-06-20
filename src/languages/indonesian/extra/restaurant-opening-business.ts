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
    id: 'restaurant-opening-business',
    title: 'Buka restoran dan mengelola usaha makanan',
    level: 'B1',
    topic: 'restaurant opening, menu, chef, business permit, ingredient suppliers, promotion, customers, online reviews',
    vietnamese_title: 'Mở nhà hàng và quản lý kinh doanh ăn uống',
    english_title: 'Restaurant Opening Business',
    pronunciation_focus: [
      'Buka restoran nghĩa là mở nhà hàng. Buka cũng dùng cho mở cửa hàng, warung, hoặc usaha baru.',
      'Menu trong tiếng Indonesia đọc ME-nu, nghĩa là thực đơn hoặc danh sách món. Jangan campur dengan "makanan" yang berarti đồ ăn.',
      'Koki nghĩa là đầu bếp. Chef cũng được dùng, nhưng koki tự nhiên trong lời nói hằng ngày và tuyển dụng.',
      'Izin usaha là giấy phép kinh doanh. Izin = phép/giấy phép; usaha = kinh doanh.',
      'Supplier bahan nghĩa là nhà cung cấp nguyên liệu. Bahan makanan là nguyên liệu thực phẩm, bukan "vật liệu xây dựng" trong ngữ cảnh này.',
      'Ulasan online là đánh giá online. Ulasan berbeda dari rating: ulasan là lời nhận xét, rating thường là số sao.',
    ],
    pronunciation_focus_en: [
      'Buka restoran means to open a restaurant. Buka is also used for opening a shop, warung, or new business.',
      'Menu in Indonesian is pronounced ME-nu and means menu or list of dishes. Do not confuse it with makanan, meaning food.',
      'Koki means cook or chef. Chef is also used, but koki is natural in daily speech and hiring contexts.',
      'Izin usaha means business permit. Izin means permit/permission; usaha means business.',
      'Supplier bahan means ingredient supplier. Bahan makanan means food ingredients in this context.',
      'Ulasan online means online review. Ulasan is the written comment, while rating is usually the star score.',
    ],
    sentences: [
      {
        en: 'Saya berencana buka restoran kecil tahun ini.',
        vi: 'Tôi dự định mở một nhà hàng nhỏ trong năm nay.',
        pronunciation: 'SA-ya ber-ren-CA-na BU-ka res-to-RAN ke-CIL TA-hun i-ni',
      },
      {
        en: 'Kami sedang menyusun menu makanan dan minuman.',
        vi: 'Chúng tôi đang soạn thực đơn món ăn và đồ uống.',
        pronunciation: 'KA-mi SE-dang me-NYU-sun ME-nu ma-KA-nan dan mi-NU-man',
      },
      {
        en: 'Restoran ini membutuhkan koki yang berpengalaman.',
        vi: 'Nhà hàng này cần đầu bếp có kinh nghiệm.',
        pronunciation: 'res-to-RAN i-ni mem-bu-TUH-kan KO-ki yang ber-pe-nga-LA-man',
      },
      {
        en: 'Izin usaha harus diurus sebelum restoran dibuka.',
        vi: 'Giấy phép kinh doanh phải được xử lý trước khi nhà hàng mở cửa.',
        pronunciation: 'I-zin u-SA-ha HA-rus di-U-rus se-BE-lum res-to-RAN di-BU-ka',
      },
      {
        en: 'Kami mencari supplier bahan yang segar dan stabil.',
        vi: 'Chúng tôi tìm nhà cung cấp nguyên liệu tươi và ổn định.',
        pronunciation: 'KA-mi men-CA-ri su-PLAI-er BA-han yang SE-gar dan STA-bil',
      },
      {
        en: 'Promosi pembukaan akan diumumkan lewat Instagram.',
        vi: 'Khuyến mãi khai trương sẽ được thông báo qua Instagram.',
        pronunciation: 'pro-MO-si pem-BU-ka-an A-kan di-u-MUM-kan LE-wat IN-sta-gram',
      },
      {
        en: 'Pelanggan pertama memberi ulasan online yang bagus.',
        vi: 'Khách hàng đầu tiên đưa ra đánh giá online tốt.',
        pronunciation: 'pe-LANG-gan per-TA-ma mem-BE-ri u-LA-san ON-lain yang BA-gus',
      },
      {
        en: 'Kalau ada komplain, kami harus menanggapi dengan sopan.',
        vi: 'Nếu có phàn nàn, chúng tôi phải phản hồi một cách lịch sự.',
        pronunciation: 'KA-lau A-da kom-PLAIN KA-mi HA-rus me-nang-GA-pi de-NGAN SO-pan',
      },
    ],
    vocabulary: [
      {
        word: 'buka restoran',
        meaning_vi: 'mở nhà hàng',
        meaning_en: 'open a restaurant',
        example: 'Mereka mau buka restoran dekat kampus.',
        example_vi: 'Họ muốn mở nhà hàng gần trường đại học.',
      },
      {
        word: 'menu',
        meaning_vi: 'thực đơn',
        meaning_en: 'menu',
        example: 'Menu baru kami fokus pada masakan rumahan.',
        example_vi: 'Thực đơn mới của chúng tôi tập trung vào món ăn gia đình.',
      },
      {
        word: 'koki',
        meaning_vi: 'đầu bếp',
        meaning_en: 'cook or chef',
        example: 'Koki utama datang jam tujuh pagi.',
        example_vi: 'Đầu bếp chính đến lúc bảy giờ sáng.',
      },
      {
        word: 'izin usaha',
        meaning_vi: 'giấy phép kinh doanh',
        meaning_en: 'business permit',
        example: 'Pemilik restoran sedang mengurus izin usaha.',
        example_vi: 'Chủ nhà hàng đang làm giấy phép kinh doanh.',
      },
      {
        word: 'supplier bahan',
        meaning_vi: 'nhà cung cấp nguyên liệu',
        meaning_en: 'ingredient supplier',
        example: 'Supplier bahan mengirim sayur setiap pagi.',
        example_vi: 'Nhà cung cấp nguyên liệu giao rau mỗi sáng.',
      },
      {
        word: 'promosi',
        meaning_vi: 'khuyến mãi, quảng bá',
        meaning_en: 'promotion',
        example: 'Promosi pembukaan berlaku selama tiga hari.',
        example_vi: 'Khuyến mãi khai trương áp dụng trong ba ngày.',
      },
      {
        word: 'pelanggan',
        meaning_vi: 'khách hàng',
        meaning_en: 'customer',
        example: 'Pelanggan tetap sering memesan menu yang sama.',
        example_vi: 'Khách quen thường gọi cùng một món.',
      },
      {
        word: 'ulasan online',
        meaning_vi: 'đánh giá online',
        meaning_en: 'online review',
        example: 'Ulasan online sangat memengaruhi restoran baru.',
        example_vi: 'Đánh giá online ảnh hưởng rất lớn đến nhà hàng mới.',
      },
    ],
    dialogue: [
      {
        speaker: 'Pemilik',
        line: 'Saya mau buka restoran kecil bulan depan.',
        vi: 'Tôi muốn mở một nhà hàng nhỏ vào tháng tới.',
        en: 'I want to open a small restaurant next month.',
      },
      {
        speaker: 'Konsultan',
        line: 'Menu sudah siap? Izin usaha juga perlu diurus.',
        vi: 'Thực đơn đã sẵn sàng chưa? Giấy phép kinh doanh cũng cần được làm.',
        en: 'Is the menu ready? The business permit also needs to be handled.',
      },
      {
        speaker: 'Pemilik',
        line: 'Menu hampir siap, tapi kami masih mencari koki utama.',
        vi: 'Thực đơn gần xong, nhưng chúng tôi vẫn đang tìm đầu bếp chính.',
        en: 'The menu is almost ready, but we are still looking for a head cook.',
      },
      {
        speaker: 'Konsultan',
        line: 'Bagaimana dengan supplier bahan?',
        vi: 'Còn nhà cung cấp nguyên liệu thì sao?',
        en: 'How about the ingredient supplier?',
      },
      {
        speaker: 'Pemilik',
        line: 'Kami sudah punya supplier sayur, daging, dan bumbu.',
        vi: 'Chúng tôi đã có nhà cung cấp rau, thịt và gia vị.',
        en: 'We already have suppliers for vegetables, meat, and spices.',
      },
      {
        speaker: 'Konsultan',
        line: 'Bagus. Jangan lupa promosi pembukaan dan pantau ulasan online.',
        vi: 'Tốt. Đừng quên khuyến mãi khai trương và theo dõi đánh giá online.',
        en: 'Good. Do not forget the opening promotion and monitor online reviews.',
      },
    ],
    cultural_notes_vi: [
      'Khi mở restoran ở Indonesia, chủ quán thường phải nghĩ đến menu, lokasi, izin usaha, supplier bahan, harga jual, promosi, dan ulasan online.',
      'Từ pelanggan dùng cho khách hàng trả tiền. Tamu là khách đến chơi hoặc khách trong khách sạn/nhà hàng, nhưng trong kinh doanh nên dùng pelanggan khi nói về tệp khách.',
      'Ulasan online trên Google Maps, GrabFood, GoFood, atau media sosial có thể ảnh hưởng lớn đến restoran baru.',
      'Promosi pembukaan thường có diskon, paket hemat, gratis minuman, atau unggahan Instagram/TikTok untuk menarik pelanggan pertama.',
    ],
    cultural_notes_en: [
      'When opening a restaurant in Indonesia, owners usually need to think about the menu, location, business permit, ingredient suppliers, selling prices, promotion, and online reviews.',
      'Pelanggan means paying customers. Tamu can mean guests in hospitality, but pelanggan is better when talking about a customer base.',
      'Online reviews on Google Maps, GrabFood, GoFood, or social media can strongly affect a new restaurant.',
      'Opening promotions often include discounts, value bundles, free drinks, or Instagram/TikTok posts to attract the first customers.',
    ],
    tip_advice_vi: [
      'Cụm sống còn: buka restoran, susun menu, cari koki, urus izin usaha, cari supplier bahan, dan pantau ulasan online.',
      'Khi nói "làm giấy phép", dùng mengurus izin usaha hoặc izin usaha diurus. Jangan dùng membuat izin nếu muốn nghe tự nhiên.',
      'Untuk nguyên liệu, dùng bahan hoặc bahan makanan. Bumbu là gia vị; sayur là rau; daging là thịt.',
      'Khi phản hồi đánh giá xấu, dùng kalimat sopan: Terima kasih atas masukannya. Kami akan memperbaiki layanan kami.',
    ],
    tip_advice_en: [
      'Core phrases: buka restoran, susun menu, cari koki, urus izin usaha, cari supplier bahan, and pantau ulasan online.',
      'For handling permits, use mengurus izin usaha or izin usaha diurus. Membuat izin is understandable but less natural.',
      'For ingredients, use bahan or bahan makanan. Bumbu means spices/seasoning; sayur means vegetables; daging means meat.',
      'When responding to a bad review, use polite wording: Terima kasih atas masukannya. Kami akan memperbaiki layanan kami.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Kami sedang mencari ____ bahan yang segar.',
        answer: 'supplier',
        explanation_vi: 'Supplier bahan là nhà cung cấp nguyên liệu. Cụm này rất phổ biến trong kinh doanh nhà hàng.',
        explanation_en: 'Supplier bahan means ingredient supplier. This phrase is common in restaurant business.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “business permit”?',
        answer: 'izin usaha',
        explanation_vi: 'Izin nghĩa là giấy phép/phép, usaha nghĩa là kinh doanh.',
        explanation_en: 'Izin means permit or permission, and usaha means business.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: The first customers gave good online reviews.',
        answer: 'Pelanggan pertama memberi ulasan online yang bagus.',
        explanation_vi: 'Pelanggan là khách hàng, pertama là đầu tiên, ulasan online là đánh giá online.',
        explanation_en: 'Pelanggan means customers, pertama means first, and ulasan online means online reviews.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell a consultant that your menu is almost ready but you are still looking for a head cook.',
        answer: 'Menu hampir siap, tapi kami masih mencari koki utama.',
        explanation_vi: 'Hampir siap là gần sẵn sàng; koki utama là đầu bếp chính.',
        explanation_en: 'Hampir siap means almost ready; koki utama means head cook or main chef.',
      },
    ],
  },
];
