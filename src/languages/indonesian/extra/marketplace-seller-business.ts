// src/languages/indonesian/extra/marketplace-seller-business.ts
//
// Indonesian marketplace-seller business pack for Vietnamese learners.
// Covers: jualan online, toko marketplace, stok produk, chat pembeli,
// pengiriman, rating toko, komplain, and promosi. Vietnamese-first with English
// companions, following the established Indonesian extra lesson shape.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const marketplaceSellerBusinessLessons: IndonesianLesson[] = [
  {
    id: "indonesian_marketplace_seller_store_stock",
    level: "B1",
    category: "business",
    title_vi: "Bán hàng online - toko, stok và chat pembeli",
    title_en: "Online selling - store, stock and buyer chat",
    sentences: [
      {
        en: "Saya mulai jualan online di toko marketplace.",
        vi: "Tôi bắt đầu bán hàng online trên shop marketplace.",
        pronunciation_focus: [
          "jualan online → JU-al-an ON-lain, bán hàng online; dạng nói thường từ gốc 'jual'",
          "toko marketplace → shop trên sàn; 'toko' = cửa hàng",
          "mulai → MU-lai, bắt đầu; không cần chia động từ theo thì",
        ],
        pronunciation_focus_en: [
          "jualan online → 'JOO-al-an ON-line' — online selling; colloquial form from root 'jual'",
          "toko marketplace → marketplace store; 'toko' = shop",
          "mulai → 'MOO-lai' — start; no tense conjugation needed",
        ],
      },
      {
        en: "Stok produk harus selalu diperbarui di aplikasi.",
        vi: "Tồn kho sản phẩm phải luôn được cập nhật trong ứng dụng.",
        pronunciation_focus: [
          "stok produk → hàng tồn/số lượng sản phẩm có sẵn",
          "harus selalu → phải luôn luôn",
          "diperbarui → được cập nhật; di-...-i bị động từ 'baru'",
        ],
        pronunciation_focus_en: [
          "stok produk → product stock/inventory",
          "harus selalu → must always",
          "diperbarui → updated; passive di-...-i from 'baru'",
        ],
      },
      {
        en: "Kalau stok habis, pesanan bisa dibatalkan otomatis.",
        vi: "Nếu hết hàng, đơn có thể bị hủy tự động.",
        pronunciation_focus: [
          "stok habis → hết hàng; 'habis' = hết",
          "pesanan → đơn hàng; danh từ từ gốc 'pesan'",
          "dibatalkan otomatis → bị hủy tự động; di- = bị động",
        ],
        pronunciation_focus_en: [
          "stok habis → out of stock; 'habis' = finished",
          "pesanan → order; noun from root 'pesan'",
          "dibatalkan otomatis → automatically canceled; di- = passive",
        ],
      },
      {
        en: "Balas chat pembeli dengan cepat dan sopan.",
        vi: "Trả lời chat của người mua nhanh và lịch sự.",
        pronunciation_focus: [
          "balas chat → trả lời chat/tin nhắn",
          "pembeli → pem-BE-li, người mua; gốc 'beli' = mua",
          "dengan cepat dan sopan → một cách nhanh và lịch sự",
        ],
        pronunciation_focus_en: [
          "balas chat → reply to chat/messages",
          "pembeli → 'pem-BEH-lee' — buyer; root 'beli' = buy",
          "dengan cepat dan sopan → quickly and politely",
        ],
      },
      {
        en: "Kak, barang ready dan bisa dikirim hari ini.",
        vi: "Bạn ơi, hàng có sẵn và có thể gửi hôm nay.",
        pronunciation_focus: [
          "Kak → cách gọi khách trung tính/lịch sự trong chat bán hàng",
          "barang ready → hàng có sẵn; seller slang rất phổ biến",
          "bisa dikirim → có thể được gửi; bị động di- trong app/chat",
        ],
        pronunciation_focus_en: [
          "Kak → neutral/polite customer address in seller chat",
          "barang ready → item is in stock; common seller slang",
          "bisa dikirim → can be shipped; passive di- in app/chat",
        ],
      },
    ],
    cultural_notes_vi:
      "Bán hàng trên marketplace Indonesia như Shopee, Tokopedia, TikTok Shop hoặc Lazada đòi hỏi phản hồi chat nhanh, stok akurat, foto produk jelas, và pengiriman tepat waktu. Người bán thường gọi khách là 'Kak' để lịch sự nhưng thân thiện. Nếu stok tidak cocok với aplikasi, pesanan có thể batal otomatis và ảnh hưởng rating toko.",
    cultural_notes_en:
      "Selling on Indonesian marketplaces such as Shopee, Tokopedia, TikTok Shop, or Lazada requires quick chat responses, accurate stock, clear product photos, and timely shipping. Sellers often address buyers as 'Kak' to sound polite but friendly. If stock does not match the app, orders may be canceled automatically and affect store ratings.",
    tip_advice_vi:
      "Mẹo cho người Việt: cặp 'jual' và 'beli' rất quan trọng. 'Penjual' = người bán, 'pembeli' = người mua. Trong chat seller, dùng 'kami' cho shop của mình, không dùng 'kita' vì 'kita' bao gồm cả khách.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the pair 'jual' and 'beli' is essential. 'Penjual' = seller, 'pembeli' = buyer. In seller chat, use 'kami' for your shop, not 'kita', because 'kita' includes the buyer.",
    vocabulary: [
      {
        cell_id: "bddb4486-5d17-4ec7-8bcf-47e45d3b4abb",
        word: "jualan online",
        en: "online selling",
        vi: "bán hàng online",
        pos: "noun / verb phrase",
        pronunciation_vi: "JU-al-an ON-lain",
        pronunciation_en: "JOO-al-an ON-line",
      },
      {
        cell_id: "a1c6b4f3-f2e7-4ec1-930d-8b9220f6ebb9",
        word: "toko marketplace",
        en: "marketplace store",
        vi: "shop trên sàn",
        pos: "noun phrase",
        pronunciation_vi: "TO-ko MAR-ket-pleis",
        pronunciation_en: "TO-ko MAR-ket-place",
      },
      {
        cell_id: "b7ca518a-046a-4891-8936-052c0fa021f0",
        word: "stok produk",
        en: "product stock",
        vi: "tồn kho sản phẩm",
        pos: "noun phrase",
        pronunciation_vi: "stok PRO-duk",
        pronunciation_en: "stok PRO-duk",
      },
      {
        cell_id: "6bed19cc-31b1-49d9-b989-fbe85a369389",
        word: "pembeli",
        en: "buyer",
        vi: "người mua",
        pos: "noun",
        pronunciation_vi: "pem-BE-li",
        pronunciation_en: "pem-BEH-lee",
      },
      {
        cell_id: "508ae3a3-7db4-4060-93d6-ae23cc479bf2",
        word: "pesanan",
        en: "order",
        vi: "đơn hàng",
        pos: "noun",
        pronunciation_vi: "pe-SA-nan",
        pronunciation_en: "pe-SA-nan",
      },
      {
        cell_id: "311ede6a-1781-4d2e-8b63-325a37569a5b",
        word: "dikirim",
        en: "sent / shipped",
        vi: "được gửi / được giao",
        pos: "passive verb",
        pronunciation_vi: "di-KI-rim",
        pronunciation_en: "dee-KEE-rim",
      },
      {
        cell_id: "f5643769-adc0-4241-b6ab-12200076c717",
        word: "dibatalkan",
        en: "canceled",
        vi: "bị hủy",
        pos: "passive verb",
        pronunciation_vi: "di-ba-TAL-kan",
        pronunciation_en: "dee-ba-TAL-kan",
      },
    ],
    dialogue: [
      {
        cell_id: "cbcdffbf-39c7-4c7e-801f-567a2ae2d897",
        speaker: "Pembeli",
        text: "Kak, barang ini ready? Bisa dikirim hari ini?",
        vi: "Bạn ơi, hàng này có sẵn không? Có thể gửi hôm nay không?",
        en: "Hi, is this item in stock? Can it be shipped today?",
      },
      {
        cell_id: "6b558bab-0884-4724-bb83-cf31b70ec5a0",
        speaker: "Penjual",
        text: "Ready, Kak. Stok masih ada dan bisa dikirim sore ini.",
        vi: "Còn hàng bạn nhé. Vẫn còn tồn kho và có thể gửi chiều nay.",
        en: "In stock. We still have stock and it can be shipped this afternoon.",
      },
      {
        cell_id: "1ec82fcb-2289-440a-afcc-f0ffa561d6a6",
        speaker: "Pembeli",
        text: "Kalau saya checkout sekarang, kapan sampai?",
        vi: "Nếu tôi checkout bây giờ, khi nào tới?",
        en: "If I check out now, when will it arrive?",
      },
      {
        cell_id: "10fcba10-787b-4460-a824-0de7de50d73f",
        speaker: "Penjual",
        text: "Estimasi dua sampai tiga hari, tergantung kurir.",
        vi: "Dự kiến hai đến ba ngày, tùy bên giao hàng.",
        en: "Estimated two to three days, depending on the courier.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ bán hàng marketplace còn thiếu:",
        instruction_en: "Fill in the missing marketplace-selling word:",
        items: [
          {
            prompt: "Saya mulai ___ online di toko marketplace. (bán hàng)",
            answer: "jualan",
            options: ["jualan", "jalan", "janji"],
          },
          {
            prompt: "Stok ___ harus selalu diperbarui. (sản phẩm)",
            answer: "produk",
            options: ["produk", "promo", "proses"],
          },
          {
            prompt: "Balas chat ___ dengan cepat. (người mua)",
            answer: "pembeli",
            options: ["pembeli", "penjual", "pengirim"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "jualan online", answer: "bán hàng online" },
          { prompt: "stok produk", answer: "tồn kho sản phẩm" },
          { prompt: "pesanan", answer: "đơn hàng" },
          { prompt: "dikirim", answer: "được gửi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi bắt đầu bán hàng online trên shop marketplace.", answer: "Saya mulai jualan online di toko marketplace." },
          { prompt: "Nếu hết hàng, đơn có thể bị hủy tự động.", answer: "Kalau stok habis, pesanan bisa dibatalkan otomatis." },
          { prompt: "Hàng có sẵn và có thể gửi hôm nay.", answer: "Barang ready dan bisa dikirim hari ini." },
        ],
      },
    ],
  },
  {
    id: "indonesian_marketplace_seller_shipping_rating_complaints",
    level: "B1",
    category: "business",
    title_vi: "Giao hàng, rating toko, komplain và promosi",
    title_en: "Shipping, store ratings, complaints and promotions",
    sentences: [
      {
        en: "Pengiriman terlambat bisa menurunkan rating toko.",
        vi: "Giao hàng trễ có thể làm giảm rating của shop.",
        pronunciation_focus: [
          "pengiriman → pe-ngi-RI-man, việc giao/gửi hàng",
          "terlambat → ter-LAM-bat, trễ/muộn",
          "menurunkan rating toko → làm giảm rating shop",
        ],
        pronunciation_focus_en: [
          "pengiriman → 'pe-ngee-REE-man' — shipping/delivery",
          "terlambat → 'ter-LAM-bat' — late",
          "menurunkan rating toko → lower the store rating",
        ],
      },
      {
        en: "Kalau ada komplain, jawab dengan jelas dan jangan emosi.",
        vi: "Nếu có khiếu nại, trả lời rõ ràng và đừng nổi nóng.",
        pronunciation_focus: [
          "komplain → kom-PLAIN, khiếu nại; loanword rất phổ biến",
          "jawab dengan jelas → trả lời rõ ràng",
          "jangan emosi → đừng nổi nóng/cảm tính",
        ],
        pronunciation_focus_en: [
          "komplain → 'kom-PLAIN' — complaint; very common loanword",
          "jawab dengan jelas → answer clearly",
          "jangan emosi → don't get emotional/angry",
        ],
      },
      {
        en: "Minta pembeli kirim foto sebagai bukti barang rusak.",
        vi: "Yêu cầu người mua gửi ảnh làm bằng chứng hàng bị hỏng.",
        pronunciation_focus: [
          "minta pembeli → yêu cầu/nhờ người mua",
          "sebagai bukti → làm bằng chứng; cụm chuẩn khi xử lý komplain",
          "barang rusak → hàng bị hỏng",
        ],
        pronunciation_focus_en: [
          "minta pembeli → ask the buyer",
          "sebagai bukti → as evidence; standard phrase for complaint handling",
          "barang rusak → damaged item",
        ],
      },
      {
        en: "Promosi gratis ongkir sering menarik pelanggan baru.",
        vi: "Khuyến mãi miễn phí ship thường thu hút khách hàng mới.",
        pronunciation_focus: [
          "promosi → pro-MO-si, khuyến mãi/quảng bá",
          "gratis ongkir → miễn phí vận chuyển; ongkir = ongkos kirim",
          "pelanggan baru → khách hàng mới",
        ],
        pronunciation_focus_en: [
          "promosi → 'pro-MOH-see' — promotion",
          "gratis ongkir → free shipping; ongkir = ongkos kirim",
          "pelanggan baru → new customers",
        ],
      },
      {
        en: "Kami sedang ikut promo tanggal kembar di marketplace.",
        vi: "Shop chúng tôi đang tham gia khuyến mãi ngày đôi trên marketplace.",
        pronunciation_focus: [
          "sedang ikut promo → đang tham gia khuyến mãi",
          "tanggal kembar → ngày đôi như 9.9, 10.10, 11.11",
          "kami → chúng tôi/shop chúng tôi; không bao gồm khách",
        ],
        pronunciation_focus_en: [
          "sedang ikut promo → currently joining a promotion",
          "tanggal kembar → double-date campaigns like 9.9, 10.10, 11.11",
          "kami → we/our shop; excludes the customer",
        ],
      },
      {
        en: "Setelah masalah selesai, minta pembeli memperbarui ulasan.",
        vi: "Sau khi vấn đề xong, nhờ người mua cập nhật đánh giá.",
        pronunciation_focus: [
          "setelah masalah selesai → sau khi vấn đề được xử lý xong",
          "memperbarui ulasan → cập nhật đánh giá/review",
          "L1 note: nói 'minta' mềm hơn ra lệnh 'harus'",
        ],
        pronunciation_focus_en: [
          "setelah masalah selesai → after the issue is resolved",
          "memperbarui ulasan → update a review",
          "VN-speaker note: 'minta' sounds softer than ordering with 'harus'",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong marketplace Indonesia, rating toko và ulasan ảnh hưởng mạnh đến kepercayaan pembeli. Người bán cần xử lý komplain bằng bukti, bahasa sopan, và solusi jelas: refund, retur, kirim ulang, atau potongan harga. 'Tanggal kembar' như 9.9 hoặc 11.11 là mùa promosi lớn, nhưng seller cần chuẩn bị stok, kurir, dan chat admin supaya pengiriman tidak terlambat.",
    cultural_notes_en:
      "In Indonesian marketplaces, store ratings and reviews strongly affect buyer trust. Sellers need to handle complaints with evidence, polite language, and clear solutions: refund, return, reshipment, or discount. 'Tanggal kembar' such as 9.9 or 11.11 are major promotion seasons, but sellers must prepare stock, couriers, and chat admins so shipping is not late.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi xử lý komplain, dùng giọng mềm nhưng rõ: 'Mohon kirim foto sebagai bukti', 'Kami cek dulu', 'Kami bantu proses retur'. 'Rating toko' không chỉ là điểm số; nó là uy tín của shop.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when handling complaints, use a soft but clear tone: 'Mohon kirim foto sebagai bukti', 'Kami cek dulu', 'Kami bantu proses retur'. 'Rating toko' is not just a score; it is store trust.",
    vocabulary: [
      {
        cell_id: "d0ca1cf7-a720-4b89-b223-257486dafa7c",
        word: "pengiriman",
        en: "shipping / delivery",
        vi: "giao hàng / vận chuyển",
        pos: "noun",
        pronunciation_vi: "pe-ngi-RI-man",
        pronunciation_en: "pe-ngee-REE-man",
      },
      {
        cell_id: "e38e6979-be28-40ea-bbc2-3058445bd022",
        word: "rating toko",
        en: "store rating",
        vi: "điểm đánh giá shop",
        pos: "noun phrase",
        pronunciation_vi: "RÉ-ting TO-ko",
        pronunciation_en: "REH-ting TO-ko",
      },
      {
        cell_id: "61d3b98b-890f-4d4a-95b1-084986ed63f4",
        word: "komplain",
        en: "complaint",
        vi: "khiếu nại",
        pos: "noun / verb",
        pronunciation_vi: "kom-PLAIN",
        pronunciation_en: "kom-PLAIN",
      },
      {
        cell_id: "cc0986ae-0396-4352-9ecd-7faf315472d4",
        word: "promosi",
        en: "promotion",
        vi: "khuyến mãi / quảng bá",
        pos: "noun",
        pronunciation_vi: "pro-MO-si",
        pronunciation_en: "pro-MOH-see",
      },
      {
        cell_id: "bee8b3d6-12a3-4197-95b7-f4852ba38fc2",
        word: "gratis ongkir",
        en: "free shipping",
        vi: "miễn phí ship",
        pos: "phrase",
        pronunciation_vi: "GRA-tis ONG-kir",
        pronunciation_en: "GRA-tis ONG-keer",
      },
      {
        cell_id: "9be99ede-9697-4217-b6dd-a9f3e88b952e",
        word: "bukti",
        en: "evidence / proof",
        vi: "bằng chứng",
        pos: "noun",
        pronunciation_vi: "BUK-ti",
        pronunciation_en: "BOOK-tee",
      },
      {
        cell_id: "60005cdd-17f5-42a8-b3b2-192461fc9a67",
        word: "ulasan",
        en: "review",
        vi: "đánh giá / nhận xét",
        pos: "noun",
        pronunciation_vi: "u-LA-san",
        pronunciation_en: "oo-LA-san",
      },
    ],
    dialogue: [
      {
        cell_id: "f1a94235-35f8-4c04-955e-435bc4642384",
        speaker: "Admin Toko",
        text: "Maaf, Kak. Pengiriman terlambat karena kurir sedang penuh.",
        vi: "Xin lỗi bạn. Giao hàng trễ vì bên vận chuyển đang quá tải.",
        en: "Sorry. Shipping is late because the courier is currently overloaded.",
      },
      {
        cell_id: "88a2d705-3acc-485a-95e7-59bf7b6ed78b",
        speaker: "Pembeli",
        text: "Kalau barang rusak saat sampai, bagaimana?",
        vi: "Nếu hàng bị hỏng khi tới nơi thì sao?",
        en: "What if the item is damaged when it arrives?",
      },
      {
        cell_id: "470dda9e-2d50-4174-b58e-690879164b00",
        speaker: "Admin Toko",
        text: "Mohon kirim foto sebagai bukti, nanti kami bantu proses komplain.",
        vi: "Vui lòng gửi ảnh làm bằng chứng, lát nữa bên tôi hỗ trợ xử lý khiếu nại.",
        en: "Please send photos as evidence, then we will help process the complaint.",
      },
      {
        cell_id: "ecf31f05-0f6f-4270-9d3d-79490de93da5",
        speaker: "Pembeli",
        text: "Baik. Kalau selesai, saya update ulasan.",
        vi: "Được. Nếu xong, tôi cập nhật đánh giá.",
        en: "Okay. If it is resolved, I will update the review.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ vận hành seller còn thiếu:",
        instruction_en: "Fill in the missing seller-operations word:",
        items: [
          {
            prompt: "Pengiriman terlambat bisa menurunkan ___ toko. (rating)",
            answer: "rating",
            options: ["rating", "retur", "rekening"],
          },
          {
            prompt: "Kalau ada ___, jawab dengan jelas. (khiếu nại)",
            answer: "komplain",
            options: ["komplain", "kampung", "koneksi"],
          },
          {
            prompt: "Promosi gratis ___ menarik pelanggan baru. (phí ship)",
            answer: "ongkir",
            options: ["ongkir", "order", "obral"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pengiriman", answer: "giao hàng" },
          { prompt: "rating toko", answer: "điểm đánh giá shop" },
          { prompt: "bukti", answer: "bằng chứng" },
          { prompt: "promosi", answer: "khuyến mãi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Giao hàng trễ có thể làm giảm rating của shop.", answer: "Pengiriman terlambat bisa menurunkan rating toko." },
          { prompt: "Yêu cầu người mua gửi ảnh làm bằng chứng hàng bị hỏng.", answer: "Minta pembeli kirim foto sebagai bukti barang rusak." },
          { prompt: "Shop chúng tôi đang tham gia khuyến mãi ngày đôi.", answer: "Kami sedang ikut promo tanggal kembar." },
        ],
      },
    ],
  },
];
