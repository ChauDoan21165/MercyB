// src/languages/indonesian/extra/online-shopping-marketplace.ts
//
// Indonesian online-shopping marketplace pack for Vietnamese learners.
// Covers: Tokopedia, Shopee, checkout, ongkir, COD, retur barang, ulasan,
// penjual, and voucher. Vietnamese-first with English companions, following the
// established Indonesian extra lesson shape.

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
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, any>;

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

export const onlineShoppingMarketplaceLessons: IndonesianLesson[] = [
  {
    id: "indonesian_marketplace_checkout_payment",
    level: "A2",
    category: "shopping",
    title_vi: "Mua hàng trên Tokopedia và Shopee",
    title_en: "Shopping on Tokopedia and Shopee",
    sentences: [
      {
        en: "Saya mau beli barang ini di Tokopedia.",
        vi: "Tôi muốn mua món hàng này trên Tokopedia.",
        pronunciation_focus: [
          "mau beli → muốn mua; trong nói thường 'mau' tự nhiên hơn 'ingin'",
          "barang ini → món hàng này; barang = hàng/đồ",
          "di Tokopedia → trên Tokopedia; với ứng dụng/web vẫn dùng 'di'",
        ],
        pronunciation_focus_en: [
          "mau beli → want to buy; in speech 'mau' is more natural than 'ingin'",
          "barang ini → this item; barang = goods/item",
          "di Tokopedia → on Tokopedia; apps/websites still take 'di'",
        ],
      },
      {
        en: "Sebelum checkout, cek ongkir ke alamat saya dulu.",
        vi: "Trước khi checkout, kiểm tra phí ship đến địa chỉ của tôi trước.",
        pronunciation_focus: [
          "sebelum checkout → trước khi thanh toán/đặt đơn; checkout dùng thẳng trong app",
          "cek ongkir → kiểm tra phí gửi hàng; ongkir = ongkos kirim",
          "alamat saya → địa chỉ của tôi; đừng nhầm 'alamat' với 'alamat email' בלבד",
        ],
        pronunciation_focus_en: [
          "sebelum checkout → before checking out/placing the order; checkout is used directly in apps",
          "cek ongkir → check shipping cost; ongkir = ongkos kirim",
          "alamat saya → my address; 'alamat' is any address, not only email address",
        ],
      },
      {
        en: "Voucher gratis ongkir bisa dipakai untuk pesanan ini.",
        vi: "Voucher miễn phí ship có thể dùng cho đơn này.",
        pronunciation_focus: [
          "voucher → VOU-cher, mã ưu đãi; thường đi với 'pakai'",
          "gratis ongkir → miễn phí vận chuyển",
          "bisa dipakai → có thể được dùng; bị động di- rất phổ biến trong app",
        ],
        pronunciation_focus_en: [
          "voucher → 'VOW-cher' — promo code/coupon; often used with 'pakai'",
          "gratis ongkir → free shipping",
          "bisa dipakai → can be used; passive di- is very common in app language",
        ],
      },
      {
        en: "Apakah toko ini menerima COD?",
        vi: "Shop này có nhận COD không?",
        pronunciation_focus: [
          "apakah → a-PA-kah, mở câu hỏi có/không trang trọng",
          "toko ini → shop/cửa hàng này",
          "menerima COD → nhận COD; COD đọc từng chữ 'si-o-di'",
        ],
        pronunciation_focus_en: [
          "apakah → 'a-PA-kah' — formal yes/no question opener",
          "toko ini → this shop/store",
          "menerima COD → accepts COD; COD is spelled out 'see-oh-dee'",
        ],
      },
      {
        en: "Kalau bayar COD, uangnya disiapkan untuk kurir.",
        vi: "Nếu trả COD, tiền được chuẩn bị sẵn cho shipper.",
        pronunciation_focus: [
          "kalau bayar COD → nếu trả tiền khi nhận hàng",
          "uangnya disiapkan → tiền được chuẩn bị sẵn; di- = bị động",
          "kurir → KU-rir, người giao hàng/shipper",
        ],
        pronunciation_focus_en: [
          "kalau bayar COD → if paying cash on delivery",
          "uangnya disiapkan → the money is prepared; di- = passive",
          "kurir → 'KOO-rir' — courier/delivery person",
        ],
      },
    ],
    cultural_notes_vi:
      "Tokopedia và Shopee là hai marketplace rất quen thuộc ở Indonesia. Người mua thường so sánh giá, phí vận chuyển ('ongkir'), voucher, rating shop, và ulasan trước khi checkout. 'Gratis ongkir' là cụm cực quan trọng vì phí ship giữa đảo/thành phố có thể cao. COD vẫn phổ biến ở nhiều nơi, nhưng không phải shop nào cũng bật COD. Khi chat với penjual, người mua thường gọi lịch sự là 'Kak' dù không biết tuổi.",
    cultural_notes_en:
      "Tokopedia and Shopee are two very familiar marketplaces in Indonesia. Buyers usually compare price, shipping cost ('ongkir'), vouchers, shop rating, and reviews before checkout. 'Gratis ongkir' is a key phrase because shipping between islands/cities can be expensive. COD is still common in many places, but not every shop enables it. In seller chat, buyers often politely address the seller as 'Kak' regardless of age.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'ongkir' là viết tắt của 'ongkos kirim', giống cách Việt Nam nói 'phí ship'. Trong app, nhiều động từ dùng bị động di-: 'dipakai' (được dùng), 'dikirim' (được gửi), 'dibatalkan' (bị hủy). Đừng dịch 'checkout' quá cứng; người Indonesia dùng luôn 'checkout' như động từ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'ongkir' is short for 'ongkos kirim', similar to saying 'shipping fee'. App language uses many passive di- verbs: 'dipakai' (used), 'dikirim' (sent), 'dibatalkan' (canceled). Don't over-translate 'checkout'; Indonesians use 'checkout' directly as a verb.",
    vocabulary: [
      {
        word: "Tokopedia",
        en: "Tokopedia marketplace",
        vi: "sàn Tokopedia",
        pos: "proper noun",
        pronunciation_vi: "to-ko-PE-dia",
        pronunciation_en: "to-ko-PEH-dee-a",
      },
      {
        word: "Shopee",
        en: "Shopee marketplace",
        vi: "sàn Shopee",
        pos: "proper noun",
        pronunciation_vi: "SHO-pi",
        pronunciation_en: "SHO-pee",
      },
      {
        word: "checkout",
        en: "checkout / place order",
        vi: "checkout / chốt đơn",
        pos: "verb / noun",
        pronunciation_vi: "CHEK-aut",
        pronunciation_en: "CHEK-out",
      },
      {
        word: "ongkir",
        en: "shipping fee",
        vi: "phí ship",
        pos: "noun",
        pronunciation_vi: "ONG-kir",
        pronunciation_en: "ONG-keer",
      },
      {
        word: "voucher",
        en: "voucher / coupon",
        vi: "mã ưu đãi",
        pos: "noun",
        pronunciation_vi: "VOU-cher",
        pronunciation_en: "VOW-cher",
      },
      {
        word: "COD",
        en: "cash on delivery",
        vi: "trả tiền khi nhận hàng",
        pos: "noun",
        pronunciation_vi: "si-o-di",
        pronunciation_en: "see-oh-dee",
      },
      {
        word: "kurir",
        en: "courier",
        vi: "người giao hàng / shipper",
        pos: "noun",
        pronunciation_vi: "KU-rir",
        pronunciation_en: "KOO-rir",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Kak, barang ini ready di Shopee?",
        vi: "Bạn ơi, món này còn hàng trên Shopee không?",
        en: "Hi, is this item in stock on Shopee?",
      },
      {
        speaker: "Penjual",
        text: "Ready, Kak. Silakan checkout, nanti pakai voucher gratis ongkir.",
        vi: "Còn hàng bạn nhé. Mời checkout, lát nữa dùng voucher miễn phí ship.",
        en: "In stock. Please checkout and use the free-shipping voucher.",
      },
      {
        speaker: "Pembeli",
        text: "Bisa COD tidak? Saya mau bayar ke kurir.",
        vi: "COD được không? Tôi muốn trả cho shipper.",
        en: "Is COD available? I want to pay the courier.",
      },
      {
        speaker: "Penjual",
        text: "Bisa. Setelah checkout, sistem akan cek ongkir otomatis.",
        vi: "Được. Sau khi checkout, hệ thống sẽ tự kiểm tra phí ship.",
        en: "Yes. After checkout, the system will check shipping automatically.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ marketplace còn thiếu:",
        instruction_en: "Fill in the missing marketplace word:",
        items: [
          {
            prompt: "Sebelum ___, cek ongkir dulu. (checkout)",
            answer: "checkout",
            options: ["checkout", "cetak", "catat"],
          },
          {
            prompt: "Voucher gratis ___ bisa dipakai. (phí ship)",
            answer: "ongkir",
            options: ["ongkir", "ongkos", "online"],
          },
          {
            prompt: "Apakah toko ini menerima ___? (trả tiền khi nhận hàng)",
            answer: "COD",
            options: ["COD", "KTP", "ATM"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "voucher", answer: "mã ưu đãi" },
          { prompt: "ongkir", answer: "phí ship" },
          { prompt: "kurir", answer: "người giao hàng" },
          { prompt: "checkout", answer: "chốt đơn / thanh toán" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Trước khi checkout, kiểm tra phí ship trước.", answer: "Sebelum checkout, cek ongkir dulu." },
          { prompt: "Voucher miễn phí ship có thể dùng cho đơn này.", answer: "Voucher gratis ongkir bisa dipakai untuk pesanan ini." },
          { prompt: "Shop này có nhận COD không?", answer: "Apakah toko ini menerima COD?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_marketplace_return_review_seller",
    level: "B1",
    category: "shopping",
    title_vi: "Chat với người bán - đổi trả và đánh giá",
    title_en: "Chatting with sellers - returns and reviews",
    sentences: [
      {
        en: "Saya mau tanya ke penjual sebelum membeli.",
        vi: "Tôi muốn hỏi người bán trước khi mua.",
        pronunciation_focus: [
          "mau tanya → muốn hỏi; tanya = hỏi",
          "penjual → pen-JU-al, người bán; gốc 'jual' = bán",
          "sebelum membeli → trước khi mua; membeli trang trọng hơn 'beli'",
        ],
        pronunciation_focus_en: [
          "mau tanya → want to ask; tanya = ask",
          "penjual → 'pen-JOO-al' — seller; root 'jual' = sell",
          "sebelum membeli → before buying; membeli is more formal than 'beli'",
        ],
      },
      {
        en: "Tolong kirim foto asli barangnya, bukan foto katalog.",
        vi: "Làm ơn gửi ảnh thật của hàng, không phải ảnh catalog.",
        pronunciation_focus: [
          "tolong kirim → làm ơn gửi",
          "foto asli → ảnh thật/gốc; asli = thật/chính gốc",
          "bukan foto katalog → không phải ảnh catalog; 'bukan' phủ định danh từ",
        ],
        pronunciation_focus_en: [
          "tolong kirim → please send",
          "foto asli → real/original photo; asli = genuine/original",
          "bukan foto katalog → not a catalog photo; 'bukan' negates nouns",
        ],
      },
      {
        en: "Kalau barang rusak, apakah bisa retur barang?",
        vi: "Nếu hàng bị hỏng, có thể trả hàng không?",
        pronunciation_focus: [
          "barang rusak → hàng hỏng; rusak dùng cho đồ bị lỗi/hỏng",
          "apakah bisa → có thể không; cách hỏi lịch sự",
          "retur barang → trả/hoàn hàng; từ marketplace mượn từ 'return'",
        ],
        pronunciation_focus_en: [
          "barang rusak → damaged item; rusak is used for broken/defective goods",
          "apakah bisa → is it possible; polite question form",
          "retur barang → return goods; marketplace loanword from 'return'",
        ],
      },
      {
        en: "Pembeli harus mengajukan retur lewat aplikasi.",
        vi: "Người mua phải gửi yêu cầu trả hàng qua ứng dụng.",
        pronunciation_focus: [
          "pembeli → pem-BE-li, người mua; gốc 'beli' = mua",
          "mengajukan retur → nộp/gửi yêu cầu trả hàng",
          "lewat aplikasi → qua ứng dụng; 'lewat' = qua/bằng kênh",
        ],
        pronunciation_focus_en: [
          "pembeli → 'pem-BEH-lee' — buyer; root 'beli' = buy",
          "mengajukan retur → submit/request a return",
          "lewat aplikasi → through the app; 'lewat' = via/through",
        ],
      },
      {
        en: "Setelah paket diterima, jangan lupa beri ulasan.",
        vi: "Sau khi nhận gói hàng, đừng quên để lại đánh giá.",
        pronunciation_focus: [
          "paket diterima → gói hàng được nhận; di- = bị động",
          "jangan lupa → đừng quên",
          "beri ulasan → cho/để lại đánh giá; ulasan = review",
        ],
        pronunciation_focus_en: [
          "paket diterima → the package is received; di- = passive",
          "jangan lupa → don't forget",
          "beri ulasan → give/leave a review; ulasan = review",
        ],
      },
      {
        en: "Ulasan bintang lima membantu toko kecil lebih dipercaya.",
        vi: "Đánh giá năm sao giúp shop nhỏ được tin tưởng hơn.",
        pronunciation_focus: [
          "bintang lima → năm sao; bintang = sao",
          "membantu → mem-BAN-tu, giúp đỡ",
          "lebih dipercaya → được tin tưởng hơn; dipercaya = được tin",
        ],
        pronunciation_focus_en: [
          "bintang lima → five stars; bintang = star",
          "membantu → 'mem-BAN-too' — help",
          "lebih dipercaya → trusted more; dipercaya = trusted/believed",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong marketplace Indonesia, chat giữa pembeli và penjual thường ngắn nhưng lịch sự: 'Kak, barang ready?', 'Bisa retur?', 'Tolong kirim foto asli'. Người mua xem 'ulasan' và rating trước khi mua, đặc biệt với shop nhỏ. Khi hàng lỗi, quy trình thường phải lewat aplikasi: ajukan retur, unggah foto/video bukti, rồi chờ keputusan platform atau penjual. Đừng chuyển tiền ngoài aplikasi nếu không cần, vì bảo vệ pembeli yếu hơn.",
    cultural_notes_en:
      "In Indonesian marketplaces, chats between buyer and seller are usually short but polite: 'Kak, barang ready?', 'Bisa retur?', 'Tolong kirim foto asli'. Buyers check 'ulasan' and ratings before buying, especially with smaller shops. If an item is defective, the process usually has to go through the app: request a return, upload photo/video evidence, then wait for the platform or seller's decision. Avoid transferring money outside the app when possible, because buyer protection is weaker.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt cặp gốc rất quan trọng: 'jual' = bán, 'beli' = mua; 'penjual' = người bán, 'pembeli' = người mua. Với phủ định, 'bukan' phủ định danh từ: 'bukan foto katalog'; 'tidak' phủ định động từ/tính từ: 'tidak rusak'. Trong app, 'retur' là danh từ/động từ mượn, rất tự nhiên hơn dịch dài.",
    tip_advice_en:
      "Tip for Vietnamese speakers: keep the core pair clear: 'jual' = sell, 'beli' = buy; 'penjual' = seller, 'pembeli' = buyer. For negation, 'bukan' negates nouns: 'bukan foto katalog'; 'tidak' negates verbs/adjectives: 'tidak rusak'. In apps, 'retur' is a natural loanword as noun/verb, better than a long translation.",
    vocabulary: [
      {
        word: "penjual",
        en: "seller",
        vi: "người bán",
        pos: "noun",
        pronunciation_vi: "pen-JU-al",
        pronunciation_en: "pen-JOO-al",
      },
      {
        word: "pembeli",
        en: "buyer",
        vi: "người mua",
        pos: "noun",
        pronunciation_vi: "pem-BE-li",
        pronunciation_en: "pem-BEH-lee",
      },
      {
        word: "retur barang",
        en: "item return",
        vi: "trả hàng",
        pos: "noun / verb phrase",
        pronunciation_vi: "re-TUR BA-rang",
        pronunciation_en: "re-TOOR BA-rang",
      },
      {
        word: "ulasan",
        en: "review",
        vi: "đánh giá / nhận xét",
        pos: "noun",
        pronunciation_vi: "u-LA-san",
        pronunciation_en: "oo-LA-san",
      },
      {
        word: "foto asli",
        en: "real/original photo",
        vi: "ảnh thật",
        pos: "noun phrase",
        pronunciation_vi: "FO-to AS-li",
        pronunciation_en: "FO-to AS-lee",
      },
      {
        word: "barang rusak",
        en: "damaged item",
        vi: "hàng bị hỏng",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang RU-sak",
        pronunciation_en: "BA-rang ROO-sak",
      },
      {
        word: "bintang lima",
        en: "five stars",
        vi: "năm sao",
        pos: "noun phrase",
        pronunciation_vi: "BIN-tang LI-ma",
        pronunciation_en: "BIN-tang LEE-ma",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Kak, saya mau tanya. Bisa kirim foto asli barangnya?",
        vi: "Bạn ơi, tôi muốn hỏi. Có thể gửi ảnh thật của hàng không?",
        en: "Hi, I want to ask something. Can you send a real photo of the item?",
      },
      {
        speaker: "Penjual",
        text: "Bisa, Kak. Nanti saya kirim lewat chat.",
        vi: "Được bạn. Lát nữa tôi gửi qua chat.",
        en: "Yes. I'll send it later through chat.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau barang rusak saat sampai, bisa retur barang?",
        vi: "Nếu hàng bị hỏng khi tới nơi, có thể trả hàng không?",
        en: "If the item is damaged when it arrives, can I return it?",
      },
      {
        speaker: "Penjual",
        text: "Bisa ajukan retur lewat aplikasi dengan foto bukti.",
        vi: "Có thể gửi yêu cầu trả hàng qua ứng dụng với ảnh bằng chứng.",
        en: "You can request a return through the app with photo evidence.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chat marketplace còn thiếu:",
        instruction_en: "Fill in the missing marketplace-chat word:",
        items: [
          {
            prompt: "Saya mau tanya ke ___. (người bán)",
            answer: "penjual",
            options: ["penjual", "pembeli", "penumpang"],
          },
          {
            prompt: "Kalau barang rusak, bisa ___ barang? (trả hàng)",
            answer: "retur",
            options: ["retur", "rating", "resi"],
          },
          {
            prompt: "Jangan lupa beri ___. (đánh giá)",
            answer: "ulasan",
            options: ["ulasan", "ukuran", "urusan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "penjual", answer: "người bán" },
          { prompt: "pembeli", answer: "người mua" },
          { prompt: "foto asli", answer: "ảnh thật" },
          { prompt: "barang rusak", answer: "hàng bị hỏng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn hỏi người bán trước khi mua.", answer: "Saya mau tanya ke penjual sebelum membeli." },
          { prompt: "Nếu hàng bị hỏng, có thể trả hàng không?", answer: "Kalau barang rusak, apakah bisa retur barang?" },
          { prompt: "Sau khi nhận gói hàng, đừng quên để lại đánh giá.", answer: "Setelah paket diterima, jangan lupa beri ulasan." },
        ],
      },
    ],
  },
];
