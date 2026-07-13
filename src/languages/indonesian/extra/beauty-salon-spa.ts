// Beauty Salon & Spa Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_beauty_salon_spa",
    level: "A2",
    category: "services",
    title_vi: "Salon và spa: đặt lịch, làm tóc, facial và chăm sóc da",
    title_en: "Salon and spa: booking, haircuts, facials and skincare",
    sentences: [
      {
        en: "Saya mau booking salon untuk potong rambut sore ini.",
        vi: "Tôi muốn đặt lịch salon để cắt tóc chiều nay.",
        pronunciation_focus: [
          "SA-ya mau BU-king SA-lon un-TUK PO-tong RAM-but SO-re I-ni - `booking salon` = đặt lịch salon; `potong rambut` = cắt tóc.",
          "Lỗi người Việt: dùng `cắt rambut` theo tiếng Việt. Tiếng Indonesia dùng động từ `potong`: `potong rambut`.",
          "Luyện: `Saya mau booking salon untuk potong rambut.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BOO-king SA-lon un-TUK PO-tong RAM-but SO-re I-ni - `booking salon` = book a salon appointment; `potong rambut` = haircut.",
          "VN-speaker trap: saying `cắt rambut` from Vietnamese. Indonesian uses `potong`: `potong rambut`.",
          "Drill: `Saya mau booking salon untuk potong rambut.`",
        ],
      },
      {
        en: "Ada jadwal kosong untuk creambath besok pagi?",
        vi: "Sáng mai còn lịch trống cho creambath không?",
        pronunciation_focus: [
          "A-da JAD-wal KO-song un-TUK krim-bat BE-sok PA-gi - `jadwal kosong` = lịch trống; `creambath` thường đọc `krim-bat`.",
          "Lỗi người Việt: đọc `creambath` hoàn toàn kiểu Anh. Ở Indonesia, dịch vụ này hay được nói gần như `krim-bat`.",
          "Luyện: `Ada jadwal kosong untuk creambath?`",
        ],
        pronunciation_focus_en: [
          "A-da JAD-wal KO-song un-TUK krim-baht BE-sok PA-gi - `jadwal kosong` = open slot; `creambath` is often said `krim-baht`.",
          "VN-speaker trap: pronouncing `creambath` fully in English. In Indonesia this service is often pronounced close to `krim-baht`.",
          "Drill: `Ada jadwal kosong untuk creambath?`",
        ],
      },
      {
        en: "Rambut saya jangan dipotong terlalu pendek.",
        vi: "Tóc của tôi đừng cắt quá ngắn.",
        pronunciation_focus: [
          "RAM-but SA-ya JA-ngan di-PO-tong ter-LA-lu PEN-dek - `jangan` = đừng; `dipotong` = được cắt/bị cắt.",
          "Lỗi người Việt: né bị động `di-`. Ở salon, yêu cầu tự nhiên là `jangan dipotong terlalu pendek`.",
          "Luyện: `Jangan dipotong terlalu pendek.`",
        ],
        pronunciation_focus_en: [
          "RAM-but SA-ya JA-ngan di-PO-tong ter-LA-lu PEN-dek - `jangan` = don't; `dipotong` = be cut.",
          "VN-speaker trap: avoiding passive `di-`. At a salon, the natural request is `jangan dipotong terlalu pendek`.",
          "Drill: `Jangan dipotong terlalu pendek.`",
        ],
      },
      {
        en: "Tolong rapikan bagian belakang saja.",
        vi: "Làm ơn chỉ tỉa gọn phần phía sau thôi.",
        pronunciation_focus: [
          "TO-long ra-PI-kan ba-GI-an be-la-KANG SA-ja - `rapikan` = làm gọn/tỉa gọn; `saja` = thôi/chỉ.",
          "Lỗi người Việt: đặt `saja` quá sớm. Câu tự nhiên: `bagian belakang saja` hoặc `dirapikan saja`.",
          "Luyện: `Rapikan bagian belakang saja.`",
        ],
        pronunciation_focus_en: [
          "TO-long ra-PI-kan ba-GI-an be-la-KANG SA-ja - `rapikan` = tidy/trim; `saja` = just/only.",
          "VN-speaker trap: placing `saja` too early. Natural phrasing: `bagian belakang saja` or `dirapikan saja`.",
          "Drill: `Rapikan bagian belakang saja.`",
        ],
      },
      {
        en: "Berapa harga paket facial dan spa?",
        vi: "Gói facial và spa giá bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga PA-ket FE-si-al dan spa - `harga paket` = giá gói; `facial` thường đọc `fe-si-al`.",
          "Lỗi người Việt: nói `paket harga`. Trật tự đúng là `harga paket` = giá của gói.",
          "Luyện: `Berapa harga paket facial dan spa?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga PA-ket FEH-see-al dan spa - `harga paket` = package price; `facial` is often `fe-si-al`.",
          "VN-speaker trap: saying `paket harga`. Correct order is `harga paket` = the package's price.",
          "Drill: `Berapa harga paket facial dan spa?`",
        ],
      },
      {
        en: "Saya punya kulit sensitif, jadi jangan pakai produk yang keras.",
        vi: "Tôi có da nhạy cảm, nên đừng dùng sản phẩm quá mạnh.",
        pronunciation_focus: [
          "SA-ya PU-nya KU-lit sen-si-TIF, JA-di JA-ngan PA-kai PRO-duk yang ke-RAS - `kulit sensitif` = da nhạy cảm; `keras` = mạnh/gắt.",
          "Lỗi người Việt: dịch `mạnh` thành `kuat`. Với sản phẩm chăm sóc da, nói `produk yang keras` hoặc `terlalu keras`.",
          "Luyện: `Saya punya kulit sensitif.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya KU-lit sen-si-TIF, JA-di JA-ngan PA-kai PRO-duk yang ke-RAS - `kulit sensitif` = sensitive skin; `keras` = harsh/strong.",
          "VN-speaker trap: translating 'strong' as `kuat`. For skincare products, say `produk yang keras` or `terlalu keras`.",
          "Drill: `Saya punya kulit sensitif.`",
        ],
      },
      {
        en: "Perawatan kulit ini cocok untuk kulit berminyak?",
        vi: "Liệu trình chăm sóc da này hợp với da dầu không?",
        pronunciation_focus: [
          "pe-ra-WA-tan KU-lit I-ni CO-cok un-TUK KU-lit ber-mi-NYAK - `perawatan kulit` = chăm sóc da; `berminyak` = có dầu.",
          "Lỗi người Việt: đọc `cocok` như ko-kok. Chữ `c` Indonesia = 'ch': CHO-chok.",
          "Luyện: `Cocok untuk kulit berminyak?`",
        ],
        pronunciation_focus_en: [
          "pe-ra-WA-tan KU-lit I-ni CHO-chok un-TUK KU-lit ber-mi-NYAK - `perawatan kulit` = skincare/treatment; `berminyak` = oily.",
          "VN-speaker trap: reading `cocok` as ko-kok. Indonesian `c` = 'ch': CHO-chok.",
          "Drill: `Cocok untuk kulit berminyak?`",
        ],
      },
      {
        en: "Facialnya berapa lama sampai selesai?",
        vi: "Facial mất bao lâu mới xong?",
        pronunciation_focus: [
          "FE-si-al-nya be-RA-pa LA-ma SAM-pai se-le-SAI - `berapa lama` = bao lâu; `sampai selesai` = cho đến khi xong.",
          "Lỗi người Việt: hỏi `berapa panjang waktu`. Cách tự nhiên hỏi thời lượng là `berapa lama`.",
          "Luyện: `Facialnya berapa lama?`",
        ],
        pronunciation_focus_en: [
          "FEH-see-al-nya be-RA-pa LA-ma SAM-pai se-le-SAI - `berapa lama` = how long; `sampai selesai` = until finished.",
          "VN-speaker trap: asking `berapa panjang waktu`. Natural duration question: `berapa lama`.",
          "Drill: `Facialnya berapa lama?`",
        ],
      },
      {
        en: "Tolong pijatnya pelan saja, jangan terlalu keras.",
        vi: "Massage làm ơn nhẹ thôi, đừng mạnh quá.",
        pronunciation_focus: [
          "TO-long PI-jat-nya PE-lan SA-ja, JA-ngan ter-LA-lu ke-RAS - `pijat` = massage; `pelan` = nhẹ/chậm.",
          "Lỗi người Việt: dùng `lambat` cho lực nhẹ. Với massage, `pelan` = nhẹ nhàng; `keras` = mạnh.",
          "Luyện: `Pijatnya pelan saja.`",
        ],
        pronunciation_focus_en: [
          "TO-long PI-jat-nya PE-lan SA-ja, JA-ngan ter-LA-lu ke-RAS - `pijat` = massage; `pelan` = gentle/slow.",
          "VN-speaker trap: using `lambat` for gentle pressure. For massage, `pelan` = gentle; `keras` = strong.",
          "Drill: `Pijatnya pelan saja.`",
        ],
      },
      {
        en: "Bisa bayar setelah perawatan selesai?",
        vi: "Có thể trả tiền sau khi liệu trình xong không?",
        pronunciation_focus: [
          "BI-sa BA-yar se-TE-lah pe-ra-WA-tan se-le-SAI - `setelah` = sau khi; `perawatan selesai` = liệu trình xong.",
          "Lỗi người Việt: đặt `setelah` cuối câu. Tiếng Indonesia dùng `setelah + cụm`: `setelah perawatan selesai`.",
          "Luyện: `Bisa bayar setelah perawatan selesai?`",
        ],
        pronunciation_focus_en: [
          "BI-sa BA-yar se-TE-lah pe-ra-WA-tan se-le-SAI - `setelah` = after; `perawatan selesai` = treatment is finished.",
          "VN-speaker trap: placing `setelah` at the end. Indonesian uses `setelah + phrase`: `setelah perawatan selesai`.",
          "Drill: `Bisa bayar setelah perawatan selesai?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `salon` có thể bao gồm cắt tóc, gội/sấy, creambath, nhuộm tóc, manikur, facial và spa nhẹ. Khi gọi nhân viên, `Mbak` dùng với phụ nữ trẻ, `Mas` với nam giới; ở nơi sang hơn có thể dùng `Bu/Pak`. Nhiều dịch vụ bán theo `paket`, nên hỏi `harga paket` và thời lượng trước. Nếu da nhạy cảm hoặc có dị ứng mỹ phẩm, nói rõ trước khi facial/spa.",
    cultural_notes_en:
      "In Indonesia, a `salon` may cover haircuts, shampoo/blow-dry, creambath, hair coloring, manicure, facials, and light spa services. Address staff as `Mbak` for a younger woman and `Mas` for a man; in more formal places use `Bu/Pak`. Many services are sold as a `paket`, so ask the package price and duration first. If you have sensitive skin or cosmetic allergies, say it before a facial/spa treatment.",
    tip_advice_vi:
      "Mẹo cho người Việt: `potong rambut` là cắt tóc, `rapikan` là tỉa gọn, `perawatan kulit` là chăm sóc da. Khi nhờ nhân viên, khung an toàn là `Tolong...` và `jangan terlalu...`: `Tolong rapikan`, `jangan terlalu pendek`, `jangan terlalu keras`. Nhớ `c` đọc như 'ch' trong `cocok`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `potong rambut` means haircut, `rapikan` means tidy/trim, and `perawatan kulit` means skincare/treatment. For staff requests, safe frames are `Tolong...` and `jangan terlalu...`: `Tolong rapikan`, `jangan terlalu pendek`, `jangan terlalu keras`. Remember `c` sounds like 'ch' in `cocok`.",
    vocabulary: [
      {
        cell_id: "66831816-0738-40c2-9c82-04cf9fb49e77",
        word: "salon",
        en: "beauty salon",
        vi: "tiệm làm tóc / salon",
        pos: "noun",
        pronunciation_vi: "SA-lon",
        pronunciation_en: "SA-lon",
      },
      {
        cell_id: "47f58c66-d787-4ecb-ad79-a78a06457cbb",
        word: "potong rambut",
        en: "haircut / cut hair",
        vi: "cắt tóc",
        pos: "verb phrase",
        pronunciation_vi: "PO-tong RAM-but",
        pronunciation_en: "PO-tong RAM-boot",
      },
      {
        cell_id: "610c7bb0-8900-4cbf-8374-f7bd4fdd6077",
        word: "creambath",
        en: "cream hair treatment",
        vi: "ủ tóc/massage da đầu kiểu Indonesia",
        pos: "noun",
        pronunciation_vi: "krim-bat",
        pronunciation_en: "krim-baht",
      },
      {
        cell_id: "9bc6c937-3ca7-4834-ab94-c414f90278b9",
        word: "facial",
        en: "facial treatment",
        vi: "chăm sóc da mặt",
        pos: "noun",
        pronunciation_vi: "FE-si-al",
        pronunciation_en: "FEH-see-al",
      },
      {
        cell_id: "937dbbf5-c2c5-4c96-b1b8-4e7a295b64ac",
        word: "spa",
        en: "spa",
        vi: "spa",
        pos: "noun",
        pronunciation_vi: "spa",
        pronunciation_en: "spa",
      },
      {
        cell_id: "77d92f44-92bf-4122-ae1a-29b31f313525",
        word: "booking",
        en: "booking / appointment",
        vi: "đặt lịch",
        pos: "noun/verb",
        pronunciation_vi: "BU-king",
        pronunciation_en: "BOO-king",
      },
      {
        cell_id: "7a85d36d-2be7-473b-9b92-2ac06927466d",
        word: "harga paket",
        en: "package price",
        vi: "giá gói",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga PA-ket",
        pronunciation_en: "HAR-ga PA-ket",
      },
      {
        cell_id: "0bcaf909-3183-429c-a211-fa33169026a7",
        word: "perawatan kulit",
        en: "skincare treatment",
        vi: "chăm sóc da",
        pos: "noun phrase",
        pronunciation_vi: "pe-ra-WA-tan KU-lit",
        pronunciation_en: "pe-ra-WA-tan KOO-lit",
      },
      {
        cell_id: "d39ba8c0-05f2-42ba-991b-8ed0a012ba24",
        word: "kulit sensitif",
        en: "sensitive skin",
        vi: "da nhạy cảm",
        pos: "noun phrase",
        pronunciation_vi: "KU-lit sen-si-TIF",
        pronunciation_en: "KOO-lit sen-si-TIF",
      },
      {
        cell_id: "2f73b6cd-59c8-4f5d-bc8c-a2820c6be04e",
        word: "rapikan",
        en: "tidy up / trim",
        vi: "tỉa gọn / làm gọn",
        pos: "verb",
        pronunciation_vi: "ra-PI-kan",
        pronunciation_en: "ra-PEE-kan",
      },
    ],
    dialogue: [
      {
        cell_id: "c97a0ac6-e37f-498b-b9ae-4aac5b84d463",
        speaker: "Pelanggan",
        text: "Mbak, saya mau booking untuk potong rambut dan creambath besok pagi.",
        vi: "Chị ơi, tôi muốn đặt lịch cắt tóc và creambath sáng mai.",
        en: "Miss, I want to book a haircut and creambath for tomorrow morning.",
      },
      {
        cell_id: "f0d671ab-6732-4c20-9dbb-6c8a825d1914",
        speaker: "Staf salon",
        text: "Bisa. Mau tambah facial atau spa juga?",
        vi: "Được ạ. Anh/chị muốn thêm facial hoặc spa không?",
        en: "Yes. Do you also want to add a facial or spa?",
      },
      {
        cell_id: "3aee8d8e-1d2c-441e-a4a5-d5a93abd9651",
        speaker: "Pelanggan",
        text: "Facial saja. Saya punya kulit sensitif, jadi jangan pakai produk yang keras.",
        vi: "Chỉ facial thôi. Tôi có da nhạy cảm, nên đừng dùng sản phẩm quá mạnh.",
        en: "Just a facial. I have sensitive skin, so please do not use harsh products.",
      },
      {
        cell_id: "ba456b91-7365-4701-8836-95adade50a86",
        speaker: "Staf salon",
        text: "Baik. Harga paketnya dua ratus ribu dan selesai sekitar dua jam.",
        vi: "Vâng. Giá gói là hai trăm nghìn và xong khoảng hai tiếng.",
        en: "Okay. The package price is two hundred thousand and it finishes in about two hours.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về salon và spa:",
        instruction_en: "Fill in the salon/spa word:",
        items: [
          {
            prompt: "Saya mau booking salon untuk ___ rambut. (cắt)",
            answer: "potong",
            options: ["potong", "pulang", "pasang"],
          },
          {
            prompt: "Berapa ___ paket facial dan spa? (giá)",
            answer: "harga",
            options: ["harga", "hari", "harus"],
          },
          {
            prompt: "Saya punya kulit ___. (nhạy cảm)",
            answer: "sensitif",
            options: ["sensitif", "santai", "selesai"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "creambath", answer: "ủ tóc/massage da đầu kiểu Indonesia" },
          { prompt: "facial", answer: "chăm sóc da mặt" },
          { prompt: "harga paket", answer: "giá gói" },
          { prompt: "perawatan kulit", answer: "chăm sóc da" },
          { prompt: "rapikan", answer: "tỉa gọn / làm gọn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn đặt lịch salon để cắt tóc chiều nay.",
            answer: "Saya mau booking salon untuk potong rambut sore ini.",
          },
          {
            prompt: "Tôi có da nhạy cảm, nên đừng dùng sản phẩm quá mạnh.",
            answer: "Saya punya kulit sensitif, jadi jangan pakai produk yang keras.",
          },
          {
            prompt: "Gói facial và spa giá bao nhiêu?",
            answer: "Berapa harga paket facial dan spa?",
          },
        ],
      },
    ],
  },
];
