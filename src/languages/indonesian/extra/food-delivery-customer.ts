// Food Delivery Customer Indonesian (Vietnamese -> Indonesian study track).
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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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

export const foodDeliveryCustomerLessons: IndonesianLesson[] = [
  {
    id: "indonesian_food_delivery_order_notes",
    level: "A2",
    category: "food",
    title_vi: "Đặt đồ ăn qua GoFood và GrabFood",
    title_en: "Ordering food through GoFood and GrabFood",
    sentences: [
      {
        en: "Saya mau pesan makanan lewat GoFood.",
        vi: "Tôi muốn đặt đồ ăn qua GoFood.",
        pronunciation_focus: [
          "SA-ya mau PE-san ma-KA-nan LE-wat GoFood — `pesan makanan` = đặt đồ ăn; `lewat` = qua/bằng.",
          "Lỗi người Việt: nói `order makanan` được trong nói thân mật, nhưng câu chuẩn hơn là `pesan makanan`.",
          "Luyện: `Saya mau pesan makanan lewat GoFood.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PE-san ma-KA-nan LE-wat GoFood — `pesan makanan` = order food; `lewat` = through/by.",
          "VN-speaker trap: `order makanan` is heard casually, but the cleaner standard phrase is `pesan makanan`.",
          "Drill: `Saya mau pesan makanan lewat GoFood.`",
        ],
      },
      {
        en: "Di catatan pesanan, tulis jangan terlalu pedas.",
        vi: "Trong ghi chú đơn hàng, viết là đừng cay quá.",
        pronunciation_focus: [
          "di ca-TA-tan pe-SA-nan, TU-lis JA-ngan ter-LA-lu pe-DAS — `catatan pesanan` = ghi chú đơn hàng.",
          "Lỗi người Việt: dùng `tidak pedas` khi muốn giảm độ cay. Nếu vẫn ăn cay nhẹ, nói `jangan terlalu pedas`.",
          "Luyện: `Tulis jangan terlalu pedas.`",
        ],
        pronunciation_focus_en: [
          "di cha-TA-tan pe-SA-nan, TOO-lis JA-ngan ter-LA-lu pe-DAS — `catatan pesanan` = order note.",
          "VN-speaker trap: using `tidak pedas` when you only mean less spicy. If mild spice is okay, say `jangan terlalu pedas`.",
          "Drill: `Tulis jangan terlalu pedas.`",
        ],
      },
      {
        en: "Alamat saya di apartemen Menara Biru, lobi utama.",
        vi: "Địa chỉ của tôi ở chung cư Menara Biru, sảnh chính.",
        pronunciation_focus: [
          "A-la-mat SA-ya di a-par-te-MEN Me-NA-ra BI-ru, LO-bi u-TA-ma — `alamat` = địa chỉ; `lobi utama` = sảnh chính.",
          "Lỗi người Việt: chỉ ghi tên tòa nhà mà thiếu điểm đón. Thêm `lobi`, `pintu masuk`, hoặc `pos satpam` giúp driver tìm nhanh.",
          "Luyện: `Alamat saya di lobi utama.`",
        ],
        pronunciation_focus_en: [
          "A-la-mat SA-ya di a-par-te-MEN Me-NA-ra BEE-ru, LO-bi u-TA-ma — `alamat` = address; `lobi utama` = main lobby.",
          "VN-speaker trap: giving only the building name. Add `lobi`, `pintu masuk`, or `pos satpam` so the driver can find you.",
          "Drill: `Alamat saya di lobi utama.`",
        ],
      },
      {
        en: "Saya pakai promo supaya ongkirnya lebih murah.",
        vi: "Tôi dùng mã khuyến mãi để phí ship rẻ hơn.",
        pronunciation_focus: [
          "SA-ya PA-kai PRO-mo su-PA-ya ONG-kir-nya le-BIH MU-rah — `pakai promo` = dùng khuyến mãi; `ongkir` = phí ship.",
          "Lỗi người Việt: dịch `phí ship` thành `biaya ship`. Trong app Indonesia, từ rất phổ biến là `ongkir`.",
          "Luyện: `Saya pakai promo supaya ongkirnya lebih murah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-kai PRO-mo su-PA-ya ONG-keer-nya le-BIH MOO-rah — `pakai promo` = use a promo; `ongkir` = shipping/delivery fee.",
          "VN-speaker trap: translating shipping fee as `biaya ship`. In Indonesian apps, the everyday word is `ongkir`.",
          "Drill: `Saya pakai promo supaya ongkirnya lebih murah.`",
        ],
      },
      {
        en: "Drivernya sudah ambil pesanan belum?",
        vi: "Tài xế đã lấy đơn chưa?",
        pronunciation_focus: [
          "DRAI-ver-nya SU-dah AM-bil pe-SA-nan be-LUM — `sudah...belum?` = đã...chưa; `ambil pesanan` = lấy đơn.",
          "Lỗi người Việt: hỏi `sudah ambil tidak?`. Với 'đã chưa', dùng cặp `sudah...belum?`.",
          "Luyện: `Drivernya sudah ambil pesanan belum?`",
        ],
        pronunciation_focus_en: [
          "DRY-ver-nya SOO-dah AM-bil pe-SA-nan be-LOOM — `sudah...belum?` = has ... yet; `ambil pesanan` = pick up the order.",
          "VN-speaker trap: asking `sudah ambil tidak?`. For 'has it happened yet', use `sudah...belum?`.",
          "Drill: `Drivernya sudah ambil pesanan belum?`",
        ],
      },
    ],
    cultural_notes_vi:
      "GoFood và GrabFood rất phổ biến ở các thành phố Indonesia. Người dùng thường so sánh `ongkir`, promo, rating nhà hàng, thời gian giao và phí dịch vụ trước khi đặt. Trong ghi chú, người Indonesia hay viết yêu cầu rất ngắn: `jangan pedas`, `tanpa bawang`, `sendok satu`, hoặc `saus dipisah`.",
    cultural_notes_en:
      "GoFood and GrabFood are very common in Indonesian cities. Customers often compare delivery fee, promos, restaurant rating, delivery time and service fees before ordering. In order notes, Indonesians usually write short requests: `jangan pedas`, `tanpa bawang`, `sendok satu`, or `saus dipisah`.",
    tip_advice_vi:
      "Ba khung cần nhớ: `Saya mau pesan...`, `Di catatan pesanan, tulis...`, và `Alamat saya di...`. Với app giao đồ ăn, `driver`, `promo`, `ongkir`, và `catatan pesanan` là từ khóa thực dụng nhất.",
    tip_advice_en:
      "Remember three frames: `Saya mau pesan...`, `Di catatan pesanan, tulis...`, and `Alamat saya di...`. For delivery apps, `driver`, `promo`, `ongkir`, and `catatan pesanan` are the most practical keywords.",
    vocabulary: [
      {
        cell_id: "b6731b17-f8f3-47e0-9a09-e40d1ef70b2d",
        word: "GoFood",
        en: "GoFood food delivery service",
        vi: "dịch vụ giao đồ ăn GoFood",
        pos: "proper noun",
        pronunciation_vi: "GO-fud",
        pronunciation_en: "GO-food",
      },
      {
        cell_id: "68422d04-240a-415c-96a9-2b1b39013552",
        word: "GrabFood",
        en: "GrabFood food delivery service",
        vi: "dịch vụ giao đồ ăn GrabFood",
        pos: "proper noun",
        pronunciation_vi: "GRAB-fud",
        pronunciation_en: "GRAB-food",
      },
      {
        cell_id: "5b318a7b-3a4f-4dd2-b429-d6a64f8a4180",
        word: "pesan makanan",
        en: "order food",
        vi: "đặt đồ ăn",
        pos: "verb phrase",
        pronunciation_vi: "PE-san ma-KA-nan",
        pronunciation_en: "PE-san ma-KA-nan",
      },
      {
        cell_id: "20eb7b5f-6582-412c-9cac-f0e0356d59cc",
        word: "catatan pesanan",
        en: "order note",
        vi: "ghi chú đơn hàng",
        pos: "noun phrase",
        pronunciation_vi: "ca-TA-tan pe-SA-nan",
        pronunciation_en: "cha-TA-tan pe-SA-nan",
      },
      {
        cell_id: "60b861e8-a0fa-480b-bd0a-b3bddf630692",
        word: "alamat",
        en: "address",
        vi: "địa chỉ",
        pos: "noun",
        pronunciation_vi: "A-la-mat",
        pronunciation_en: "A-la-mat",
      },
      {
        cell_id: "942c938e-4692-4005-986c-a8584d8ff217",
        word: "ongkir",
        en: "delivery fee / shipping fee",
        vi: "phí ship",
        pos: "noun",
        pronunciation_vi: "ONG-kir",
        pronunciation_en: "ONG-keer",
      },
    ],
    dialogue: [
      {
        cell_id: "2d471e36-47fd-4006-8e14-79adbe4f2d82",
        speaker: "Pelanggan",
        text: "Halo, Pak. Alamat saya di lobi utama apartemen.",
        vi: "A lô chú. Địa chỉ của tôi ở sảnh chính chung cư.",
        en: "Hello, sir. My address is at the main lobby of the apartment building.",
      },
      {
        cell_id: "88f0d9ad-df7e-44de-b717-ef304b8ce8ba",
        speaker: "Driver",
        text: "Baik, saya sudah ambil pesanannya.",
        vi: "Được, tôi đã lấy đơn rồi.",
        en: "Okay, I have picked up the order.",
      },
      {
        cell_id: "29346b1c-5e08-44a8-8a9f-e81f10824b8f",
        speaker: "Pelanggan",
        text: "Terima kasih. Tolong taruh di meja resepsionis.",
        vi: "Cảm ơn. Làm ơn để ở bàn lễ tân.",
        en: "Thank you. Please put it at the reception desk.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau ___ makanan lewat GoFood.`",
        prompt_en: "Fill in: `Saya mau ___ makanan lewat GoFood.`",
        answer: "pesan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Đừng cay quá.",
        prompt_en: "Translate to Indonesian: Not too spicy.",
        answer: "Jangan terlalu pedas.",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là phí ship/phí giao hàng?",
        prompt_en: "Which word means delivery/shipping fee?",
        options: ["ongkir", "alamat", "catatan"],
        answer: "ongkir",
      },
    ],
  },
  {
    id: "indonesian_food_delivery_problem_refund",
    level: "B1",
    category: "food",
    title_vi: "Khi đồ ăn bị đổ hoặc cần hoàn tiền",
    title_en: "When food spills or you need a refund",
    sentences: [
      {
        en: "Makanan saya tumpah waktu diantar.",
        vi: "Đồ ăn của tôi bị đổ lúc được giao.",
        pronunciation_focus: [
          "ma-KA-nan SA-ya TUM-pah WAK-tu di-AN-tar — `tumpah` = bị đổ/tràn; `diantar` = được giao/đưa đến.",
          "Lỗi người Việt: dùng `jatuh` cho đồ ăn bị đổ. `Jatuh` = rơi; nước/súp/sốt bị tràn là `tumpah`.",
          "Luyện: `Makanan saya tumpah waktu diantar.`",
        ],
        pronunciation_focus_en: [
          "ma-KA-nan SA-ya TOOM-pah WAK-tu di-AN-tar — `tumpah` = spilled; `diantar` = delivered.",
          "VN-speaker trap: using `jatuh` for spilled food. `Jatuh` means fell; liquids/sauce/soup spill with `tumpah`.",
          "Drill: `Makanan saya tumpah waktu diantar.`",
        ],
      },
      {
        en: "Pesanan saya tidak lengkap, ada minuman yang kurang.",
        vi: "Đơn của tôi không đủ, thiếu một đồ uống.",
        pronunciation_focus: [
          "pe-SA-nan SA-ya TI-dak leng-KAP, A-da mi-NU-man yang KU-rang — `tidak lengkap` = không đầy đủ; `kurang` = thiếu.",
          "Lỗi người Việt: nói `kurang minuman` hơi cụt. Tự nhiên hơn: `ada minuman yang kurang`.",
          "Luyện: `Ada minuman yang kurang.`",
        ],
        pronunciation_focus_en: [
          "pe-SA-nan SA-ya TEE-dak leng-KAP, A-da mi-NOO-man yang KOO-rang — `tidak lengkap` = incomplete; `kurang` = missing/short.",
          "VN-speaker trap: saying only `kurang minuman`. More natural: `ada minuman yang kurang`.",
          "Drill: `Ada minuman yang kurang.`",
        ],
      },
      {
        en: "Saya sudah kirim foto sebagai bukti.",
        vi: "Tôi đã gửi ảnh làm bằng chứng.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim FO-to se-BA-gai BUK-ti — `bukti` = bằng chứng; `sebagai` = như/làm.",
          "Lỗi người Việt: dịch 'bằng chứng' là `bukti bukti`. Một từ `bukti` là đủ.",
          "Luyện: `Saya sudah kirim foto sebagai bukti.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KEE-rim FO-to se-BA-gai BOOK-ti — `bukti` = proof/evidence; `sebagai` = as.",
          "VN-speaker trap: doubling `bukti` for 'evidence'. One `bukti` is enough.",
          "Drill: `Saya sudah kirim foto sebagai bukti.`",
        ],
      },
      {
        en: "Bagaimana cara ajukan refund di aplikasi?",
        vi: "Làm sao để yêu cầu hoàn tiền trong ứng dụng?",
        pronunciation_focus: [
          "ba-GAI-ma-na CA-ra a-JU-kan RI-fund di ap-li-KA-si — `ajukan refund` = yêu cầu hoàn tiền; `aplikasi` = ứng dụng.",
          "Lỗi người Việt: nói `minta kembali uang` vẫn hiểu nhưng dài. Trong app, `refund` và `ajukan refund` rất tự nhiên.",
          "Luyện: `Bagaimana cara ajukan refund?`",
        ],
        pronunciation_focus_en: [
          "ba-GAI-ma-na CHA-ra a-JOO-kan REE-fund di ap-li-KA-si — `ajukan refund` = submit/request a refund; `aplikasi` = app.",
          "VN-speaker trap: saying the long `minta kembali uang`. In apps, `refund` and `ajukan refund` are natural.",
          "Drill: `Bagaimana cara ajukan refund?`",
        ],
      },
      {
        en: "Saya mau komplain karena makanan datang terlambat.",
        vi: "Tôi muốn khiếu nại vì đồ ăn đến trễ.",
        pronunciation_focus: [
          "SA-ya mau kom-PLAIN ka-RE-na ma-KA-nan DA-tang ter-LAM-bat — `komplain` = khiếu nại; `terlambat` = trễ.",
          "Lỗi người Việt: nhầm `lama` và `terlambat`. `Lama` = lâu; `terlambat` = trễ so với giờ dự kiến.",
          "Luyện: `Makanan datang terlambat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau kom-PLAIN ka-RE-na ma-KA-nan DA-tang ter-LAM-bat — `komplain` = complain/file a complaint; `terlambat` = late.",
          "VN-speaker trap: mixing up `lama` and `terlambat`. `Lama` = takes long; `terlambat` = late against the expected time.",
          "Drill: `Makanan datang terlambat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi có vấn đề với GoFood hoặc GrabFood, người dùng thường báo qua menu bantuan trong app, kèm ảnh `bukti`. Với driver, giữ lời nhắn ngắn và lịch sự; với nhà hàng hoặc layanan pelanggan, dùng cụm rõ ràng như `pesanan tidak lengkap`, `makanan tumpah`, `datang terlambat`, và `ajukan refund`.",
    cultural_notes_en:
      "When there is a problem with GoFood or GrabFood, customers usually report it through the app's help menu with photo proof. With the driver, keep messages short and polite; with the restaurant or customer service, use clear phrases like `pesanan tidak lengkap`, `makanan tumpah`, `datang terlambat`, and `ajukan refund`.",
    tip_advice_vi:
      "Để khiếu nại rõ ràng, nói theo mẫu: vấn đề + thời điểm + bằng chứng. Ví dụ: `Makanan tumpah waktu diantar. Saya sudah kirim foto sebagai bukti.`",
    tip_advice_en:
      "For a clear complaint, use the pattern: problem + when it happened + proof. Example: `Makanan tumpah waktu diantar. Saya sudah kirim foto sebagai bukti.`",
    vocabulary: [
      {
        cell_id: "b5ff71d5-ac55-4ebe-94d6-8e36bdf996cd",
        word: "tumpah",
        en: "spilled",
        vi: "bị đổ / tràn",
        pos: "verb/adjective",
        pronunciation_vi: "TUM-pah",
        pronunciation_en: "TOOM-pah",
      },
      {
        cell_id: "b911aa0e-4e94-43df-a5b3-d498bdaef4c8",
        word: "refund",
        en: "refund",
        vi: "hoàn tiền",
        pos: "noun/verb",
        pronunciation_vi: "RI-fund",
        pronunciation_en: "REE-fund",
      },
      {
        cell_id: "0f310acc-29c4-4855-912a-493b530b0c11",
        word: "ajukan refund",
        en: "request a refund",
        vi: "yêu cầu hoàn tiền",
        pos: "verb phrase",
        pronunciation_vi: "a-JU-kan RI-fund",
        pronunciation_en: "a-JOO-kan REE-fund",
      },
      {
        cell_id: "04cd980a-fc91-4711-bd4d-cddfd482384b",
        word: "bukti",
        en: "proof / evidence",
        vi: "bằng chứng",
        pos: "noun",
        pronunciation_vi: "BUK-ti",
        pronunciation_en: "BOOK-ti",
      },
      {
        cell_id: "00a73493-5453-423c-abc7-4528aabb4c1f",
        word: "tidak lengkap",
        en: "incomplete",
        vi: "không đầy đủ",
        pos: "adjective phrase",
        pronunciation_vi: "TI-dak leng-KAP",
        pronunciation_en: "TEE-dak leng-KAP",
      },
      {
        cell_id: "3ef9b52b-b9cf-431d-8f20-953c0f01af9d",
        word: "terlambat",
        en: "late",
        vi: "trễ",
        pos: "adjective",
        pronunciation_vi: "ter-LAM-bat",
        pronunciation_en: "ter-LAM-bat",
      },
    ],
    dialogue: [
      {
        cell_id: "c162f6bf-63d2-4092-9d65-1324347057f8",
        speaker: "Pelanggan",
        text: "Maaf, makanan saya tumpah waktu diantar.",
        vi: "Xin lỗi, đồ ăn của tôi bị đổ lúc được giao.",
        en: "Sorry, my food spilled during delivery.",
      },
      {
        cell_id: "5b17b764-c06a-4f9f-8fbe-2ac865b5a4de",
        speaker: "Layanan Pelanggan",
        text: "Boleh kirim foto sebagai bukti?",
        vi: "Bạn có thể gửi ảnh làm bằng chứng không?",
        en: "Could you send a photo as proof?",
      },
      {
        cell_id: "a54e92ff-bc2f-40ba-bc68-9c1c21dab878",
        speaker: "Pelanggan",
        text: "Sudah saya kirim. Bagaimana cara ajukan refund?",
        vi: "Tôi đã gửi rồi. Làm sao để yêu cầu hoàn tiền?",
        en: "I already sent it. How do I request a refund?",
      },
      {
        cell_id: "7568124f-099e-430f-bc97-9c27fc355b4c",
        speaker: "Layanan Pelanggan",
        text: "Kami akan cek laporan Anda dulu.",
        vi: "Chúng tôi sẽ kiểm tra báo cáo của bạn trước.",
        en: "We will check your report first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Makanan saya ___ waktu diantar.`",
        prompt_en: "Fill in: `Makanan saya ___ waktu diantar.`",
        answer: "tumpah",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Đơn của tôi không đủ.",
        prompt_en: "Translate to Indonesian: My order is incomplete.",
        answer: "Pesanan saya tidak lengkap.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `bukti`, `refund`, `terlambat`.",
        prompt_en: "Match meanings: `bukti`, `refund`, `terlambat`.",
        pairs: [
          ["bukti", "bằng chứng / proof"],
          ["refund", "hoàn tiền / refund"],
          ["terlambat", "trễ / late"],
        ],
      },
    ],
  },
];
