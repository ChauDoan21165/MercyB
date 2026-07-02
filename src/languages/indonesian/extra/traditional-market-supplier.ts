// Traditional Market Supplier Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const traditionalMarketSupplierLessons: IndonesianLesson[] = [
  {
    id: "indonesian_market_supplier_wholesale_stock",
    level: "A2",
    category: "business",
    title_vi: "Nhà cung cấp ở chợ: giá sỉ và tồn kho",
    title_en: "Market suppliers: wholesale prices and stock",
    sentences: [
      {
        en: "Saya cari supplier pasar untuk stok warung.",
        vi: "Tôi tìm nhà cung cấp ở chợ cho hàng tồn của warung.",
        pronunciation_focus: [
          "SA-ya CA-ri su-PLAI-er PA-sar un-TUK stok WA-rung - `supplier pasar` = nhà cung cấp ở chợ; `stok warung` = hàng cho quán/tiệm nhỏ.",
          "Lỗi người Việt: dùng `penyedia` trong hội thoại chợ nghe quá trang trọng. Trong kinh doanh nhỏ, `supplier` rất tự nhiên.",
          "Luyện: `Saya cari supplier pasar untuk stok warung.`",
        ],
        pronunciation_focus_en: [
          "SA-ya CHA-ri su-PLY-er PA-sar un-TOOK stok WA-roong - `supplier pasar` = market supplier; `stok warung` = stock for a small shop.",
          "VN-speaker trap: using formal `penyedia` in market talk. In small business, `supplier` is very natural.",
          "Drill: `Saya cari supplier pasar untuk stok warung.`",
        ],
      },
      {
        en: "Kalau ambil banyak, bisa dapat harga grosir?",
        vi: "Nếu lấy nhiều, có được giá sỉ không?",
        pronunciation_focus: [
          "KA-lau AM-bil BA-nyak, BI-sa DA-pat HAR-ga GRO-sir - `ambil banyak` = lấy nhiều; `harga grosir` = giá sỉ.",
          "Lỗi người Việt: dịch 'giá sỉ' thành `harga si`. Tiếng Indonesia dùng `harga grosir` hoặc `harga partai`.",
          "Luyện: `Bisa dapat harga grosir?`",
        ],
        pronunciation_focus_en: [
          "KA-lau AM-bil BA-nyak, BEE-sa DA-pat HAR-ga GRO-seer - `ambil banyak` = take/buy a lot; `harga grosir` = wholesale price.",
          "VN-speaker trap: translating 'wholesale price' literally. Indonesian uses `harga grosir` or `harga partai`.",
          "Drill: `Bisa dapat harga grosir?`",
        ],
      },
      {
        en: "Stok barang minggu ini masih aman.",
        vi: "Tồn kho tuần này vẫn ổn.",
        pronunciation_focus: [
          "stok BA-rang MING-gu I-ni MA-sih A-man - `stok barang` = hàng tồn; `masih aman` = vẫn ổn/chưa thiếu.",
          "Lỗi người Việt: hiểu `aman` chỉ là an toàn. Trong kinh doanh, `stok aman` nghĩa là lượng hàng còn đủ.",
          "Luyện: `Stok barang masih aman.`",
        ],
        pronunciation_focus_en: [
          "stok BA-rang MING-goo EE-ni MA-sih A-man - `stok barang` = inventory; `masih aman` = still okay/sufficient.",
          "VN-speaker trap: reading `aman` only as safe. In business talk, `stok aman` means stock is still enough.",
          "Drill: `Stok barang masih aman.`",
        ],
      },
      {
        en: "Saya sudah langganan di toko ini sejak tahun lalu.",
        vi: "Tôi đã là khách quen của cửa hàng này từ năm ngoái.",
        pronunciation_focus: [
          "SA-ya SU-dah lang-GA-nan di TO-ko I-ni se-JAK TA-hun LA-lu - `langganan` = khách quen/mối quen; `sejak` = từ khi/từ.",
          "Lỗi người Việt: nhầm `pelanggan` và `langganan`. `Pelanggan` = khách hàng; `langganan` = mối quen/quan hệ mua đều.",
          "Luyện: `Saya sudah langganan di toko ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah lang-GA-nan di TO-ko EE-ni se-JAK TA-hoon LA-loo - `langganan` = regular customer/supplier relationship; `sejak` = since.",
          "VN-speaker trap: mixing `pelanggan` and `langganan`. `Pelanggan` = customer; `langganan` = regular subscription/customer relationship.",
          "Drill: `Saya sudah langganan di toko ini.`",
        ],
      },
      {
        en: "Tolong buatkan nota untuk pembelian hari ini.",
        vi: "Làm ơn viết hóa đơn/phiếu mua hàng cho lần mua hôm nay.",
        pronunciation_focus: [
          "TO-long BU-at-kan NO-ta un-TUK pem-BE-li-an HA-ri I-ni - `nota` = phiếu/biên nhận; `buatkan` = làm giúp.",
          "Lỗi người Việt: dùng `faktur` cho mọi hóa đơn. Ở chợ, `nota` tự nhiên hơn; `faktur` trang trọng hơn.",
          "Luyện: `Tolong buatkan nota.`",
        ],
        pronunciation_focus_en: [
          "TO-long BOO-at-kan NO-ta un-TOOK pem-BE-li-an HA-ri EE-ni - `nota` = receipt/note; `buatkan` = make for someone.",
          "VN-speaker trap: using `faktur` for every receipt. At markets, `nota` is more natural; `faktur` is more formal.",
          "Drill: `Tolong buatkan nota.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở chợ truyền thống Indonesia, quan hệ `langganan` rất quan trọng. Người mua đều đặn thường được giá tốt hơn, được giữ hàng khi stok terbatas, hoặc được báo trước khi harga naik. Với supplier quen, lời nói lịch sự và thanh toán đúng hẹn thường quan trọng ngang với mặc cả.",
    cultural_notes_en:
      "In Indonesian traditional markets, `langganan` relationships matter. Regular buyers may get better prices, have goods held when stock is limited, or be warned before prices rise. With a regular supplier, polite communication and paying on time can matter as much as bargaining.",
    tip_advice_vi:
      "Khung hữu ích: `bisa dapat harga grosir?`, `stok barang masih aman`, `tolong buatkan nota`. Phân biệt `harga grosir` = giá sỉ, `harga eceran` = giá lẻ, và `harga modal` = giá vốn.",
    tip_advice_en:
      "Useful frames: `bisa dapat harga grosir?`, `stok barang masih aman`, `tolong buatkan nota`. Separate `harga grosir` = wholesale price, `harga eceran` = retail price, and `harga modal` = cost price.",
    vocabulary: [
      {
        word: "supplier pasar",
        en: "market supplier",
        vi: "nhà cung cấp ở chợ",
        pos: "noun phrase",
        pronunciation_vi: "su-PLAI-er PA-sar",
        pronunciation_en: "su-PLY-er PA-sar",
      },
      {
        word: "harga grosir",
        en: "wholesale price",
        vi: "giá sỉ",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga GRO-sir",
        pronunciation_en: "HAR-ga GRO-seer",
      },
      {
        word: "stok barang",
        en: "inventory / goods stock",
        vi: "hàng tồn",
        pos: "noun phrase",
        pronunciation_vi: "stok BA-rang",
        pronunciation_en: "stok BA-rang",
      },
      {
        word: "langganan",
        en: "regular customer / subscription relationship",
        vi: "khách quen / mối quen",
        pos: "noun",
        pronunciation_vi: "lang-GA-nan",
        pronunciation_en: "lang-GA-nan",
      },
      {
        word: "nota",
        en: "receipt / purchase note",
        vi: "phiếu mua hàng / hóa đơn chợ",
        pos: "noun",
        pronunciation_vi: "NO-ta",
        pronunciation_en: "NO-ta",
      },
      {
        word: "harga eceran",
        en: "retail price",
        vi: "giá lẻ",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga e-CE-ran",
        pronunciation_en: "HAR-ga e-CHE-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Pak, kalau saya ambil dua karung, bisa dapat harga grosir?",
        vi: "Chú ơi, nếu tôi lấy hai bao thì có được giá sỉ không?",
        en: "Sir, if I take two sacks, can I get the wholesale price?",
      },
      {
        speaker: "Supplier",
        text: "Bisa, apalagi kalau jadi langganan.",
        vi: "Được, nhất là nếu trở thành khách quen.",
        en: "Yes, especially if you become a regular customer.",
      },
      {
        speaker: "Pembeli",
        text: "Baik. Tolong buatkan nota untuk pembelian hari ini.",
        vi: "Được. Làm ơn viết phiếu mua hàng cho lần mua hôm nay.",
        en: "Okay. Please make a receipt for today's purchase.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kalau ambil banyak, bisa dapat harga ___?`",
        prompt_en: "Fill in: `Kalau ambil banyak, bisa dapat harga ___?`",
        answer: "grosir",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Làm ơn viết phiếu mua hàng.",
        prompt_en: "Translate to Indonesian: Please make a receipt.",
        answer: "Tolong buatkan nota.",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là khách quen/mối quen?",
        prompt_en: "Which word means regular customer relationship?",
        options: ["langganan", "eceran", "nota"],
        answer: "langganan",
      },
    ],
  },
  {
    id: "indonesian_supplier_delivery_quality_negotiation",
    level: "B1",
    category: "business",
    title_vi: "Giao hàng, chất lượng và thương lượng với supplier",
    title_en: "Delivery, quality and supplier negotiation",
    sentences: [
      {
        en: "Pengiriman bisa sampai warung sebelum jam tujuh pagi?",
        vi: "Việc giao hàng có thể tới warung trước bảy giờ sáng không?",
        pronunciation_focus: [
          "pe-ngi-RIM-an BI-sa SAM-pai WA-rung se-BE-lum jam TU-juh PA-gi - `pengiriman` = việc giao hàng; `sebelum` = trước.",
          "Lỗi người Việt: dùng `kirim` cho danh từ. `Kirim` = gửi/giao; `pengiriman` = việc giao hàng.",
          "Luyện: `Pengiriman bisa sampai sebelum jam tujuh?`",
        ],
        pronunciation_focus_en: [
          "pe-ngi-RIM-an BEE-sa SAM-pai WA-roong se-BE-lum jam TOO-juh PA-gi - `pengiriman` = delivery; `sebelum` = before.",
          "VN-speaker trap: using `kirim` as the noun. `Kirim` = send/deliver; `pengiriman` = delivery.",
          "Drill: `Pengiriman bisa sampai sebelum jam tujuh?`",
        ],
      },
      {
        en: "Kualitas barang harus dicek sebelum dikirim.",
        vi: "Chất lượng hàng phải được kiểm tra trước khi giao.",
        pronunciation_focus: [
          "ku-a-li-TAS BA-rang HA-rus di-CEK se-BE-lum di-KI-rim - `kualitas barang` = chất lượng hàng; `dicek` = được kiểm tra.",
          "Lỗi người Việt: nói `kualitas harus cek`. Với bị động, dùng `harus dicek`.",
          "Luyện: `Kualitas barang harus dicek.`",
        ],
        pronunciation_focus_en: [
          "ku-a-li-TAS BA-rang HA-rus di-CHEK se-BE-lum di-KEE-rim - `kualitas barang` = goods quality; `dicek` = checked.",
          "VN-speaker trap: saying `kualitas harus cek`. In passive form, use `harus dicek`.",
          "Drill: `Kualitas barang harus dicek.`",
        ],
      },
      {
        en: "Kalau ada barang rusak, saya bisa tukar?",
        vi: "Nếu có hàng hỏng, tôi có thể đổi không?",
        pronunciation_focus: [
          "KA-lau A-da BA-rang RU-sak, SA-ya BI-sa TU-kar - `barang rusak` = hàng hỏng; `tukar` = đổi.",
          "Lỗi người Việt: dùng `ganti` và `tukar` lẫn nhau. `Tukar barang` = đổi hàng; `ganti rugi` = bồi thường.",
          "Luyện: `Kalau barang rusak, bisa tukar?`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da BA-rang ROO-sak, SA-ya BEE-sa TOO-kar - `barang rusak` = damaged goods; `tukar` = exchange.",
          "VN-speaker trap: mixing `ganti` and `tukar`. `Tukar barang` = exchange goods; `ganti rugi` = compensation.",
          "Drill: `Kalau barang rusak, bisa tukar?`",
        ],
      },
      {
        en: "Kita bisa negosiasi harga kalau pembelian rutin.",
        vi: "Chúng ta có thể thương lượng giá nếu mua đều đặn.",
        pronunciation_focus: [
          "KI-ta BI-sa ne-go-si-A-si HAR-ga KA-lau pem-BE-li-an ru-TIN - `negosiasi harga` = thương lượng giá; `pembelian rutin` = việc mua đều đặn.",
          "Lỗi người Việt: dùng `tawar` cho mọi hoàn cảnh. Với quan hệ supplier dài hạn, `negosiasi harga` nghe chuyên nghiệp hơn.",
          "Luyện: `Kita bisa negosiasi harga.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta BEE-sa ne-go-see-A-see HAR-ga KA-lau pem-BE-li-an roo-TEEN - `negosiasi harga` = price negotiation; `pembelian rutin` = regular purchasing.",
          "VN-speaker trap: using `tawar` for every situation. In a long-term supplier relationship, `negosiasi harga` sounds more professional.",
          "Drill: `Kita bisa negosiasi harga.`",
        ],
      },
      {
        en: "Saya bayar sebagian dulu, sisanya setelah barang datang.",
        vi: "Tôi trả một phần trước, phần còn lại sau khi hàng đến.",
        pronunciation_focus: [
          "SA-ya BA-yar se-BA-gi-an DU-lu, SI-sa-nya se-TE-lah BA-rang DA-tang - `sebagian` = một phần; `sisanya` = phần còn lại.",
          "Lỗi người Việt: dịch 'cọc' thành `taruh uang` thô. Có thể nói `bayar sebagian dulu` hoặc `bayar DP`.",
          "Luyện: `Saya bayar sebagian dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-yar se-BA-gi-an DOO-loo, SEE-sa-nya se-TE-lah BA-rang DA-tang - `sebagian` = part; `sisanya` = the rest.",
          "VN-speaker trap: translating deposit as rough `taruh uang`. Say `bayar sebagian dulu` or `bayar DP`.",
          "Drill: `Saya bayar sebagian dulu.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Supplier chợ thường làm việc từ rất sớm vì warung, quán ăn, và người bán lẻ cần hàng trước giờ mở bán. Một hubungan langganan yang baik biasanya jelas tentang harga, jadwal pengiriman, kualitas barang, nota, và cách xử lý barang rusak.",
    cultural_notes_en:
      "Market suppliers often work very early because warung owners, food stalls, and retailers need goods before opening. A good regular supplier relationship is usually clear about prices, delivery schedule, goods quality, receipts, and how damaged goods are handled.",
    tip_advice_vi:
      "Khi thương lượng, nói điều kiện cụ thể: số lượng, lịch mua, thời gian giao, và cách thanh toán. Mẫu mạnh: `kalau pembelian rutin`, `sebelum dikirim`, `setelah barang datang`.",
    tip_advice_en:
      "When negotiating, state concrete terms: quantity, purchase schedule, delivery time, and payment method. Strong frames: `kalau pembelian rutin`, `sebelum dikirim`, `setelah barang datang`.",
    vocabulary: [
      {
        word: "pengiriman",
        en: "delivery / shipment",
        vi: "việc giao hàng",
        pos: "noun",
        pronunciation_vi: "pe-ngi-RIM-an",
        pronunciation_en: "pe-ngi-RIM-an",
      },
      {
        word: "kualitas barang",
        en: "goods quality",
        vi: "chất lượng hàng",
        pos: "noun phrase",
        pronunciation_vi: "ku-a-li-TAS BA-rang",
        pronunciation_en: "ku-a-li-TAS BA-rang",
      },
      {
        word: "barang rusak",
        en: "damaged goods",
        vi: "hàng hỏng",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang RU-sak",
        pronunciation_en: "BA-rang ROO-sak",
      },
      {
        word: "negosiasi",
        en: "negotiation",
        vi: "thương lượng",
        pos: "noun",
        pronunciation_vi: "ne-go-si-A-si",
        pronunciation_en: "ne-go-see-A-see",
      },
      {
        word: "pembelian rutin",
        en: "regular purchasing",
        vi: "việc mua đều đặn",
        pos: "noun phrase",
        pronunciation_vi: "pem-BE-li-an ru-TIN",
        pronunciation_en: "pem-BE-li-an roo-TEEN",
      },
      {
        word: "sisanya",
        en: "the rest / remaining amount",
        vi: "phần còn lại",
        pos: "noun",
        pronunciation_vi: "SI-sa-nya",
        pronunciation_en: "SEE-sa-nya",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, pengiriman bisa sampai sebelum jam tujuh pagi?",
        vi: "Cô ơi, hàng giao có thể tới trước bảy giờ sáng không?",
        en: "Ma'am, can the delivery arrive before seven in the morning?",
      },
      {
        speaker: "Supplier",
        text: "Bisa, asal pesanannya dikonfirmasi malam sebelumnya.",
        vi: "Được, miễn là đơn được xác nhận từ tối hôm trước.",
        en: "Yes, as long as the order is confirmed the night before.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau ada barang rusak, bisa ditukar besok?",
        vi: "Nếu có hàng hỏng, có thể đổi ngày mai không?",
        en: "If there are damaged goods, can they be exchanged tomorrow?",
      },
      {
        speaker: "Supplier",
        text: "Bisa, asal ada foto dan nota pembelian.",
        vi: "Được, miễn là có ảnh và phiếu mua hàng.",
        en: "Yes, as long as there is a photo and purchase receipt.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kualitas barang harus ___ sebelum dikirim.`",
        prompt_en: "Fill in: `Kualitas barang harus ___ sebelum dikirim.`",
        answer: "dicek",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi trả một phần trước.",
        prompt_en: "Translate to Indonesian: I pay part first.",
        answer: "Saya bayar sebagian dulu.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `pengiriman`, `barang rusak`, `sisanya`.",
        prompt_en: "Match meanings: `pengiriman`, `barang rusak`, `sisanya`.",
        pairs: [
          ["pengiriman", "việc giao hàng / delivery"],
          ["barang rusak", "hàng hỏng / damaged goods"],
          ["sisanya", "phần còn lại / the rest"],
        ],
      },
    ],
  },
];
