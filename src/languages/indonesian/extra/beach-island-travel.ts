// src/languages/indonesian/extra/beach-island-travel.ts
//
// Indonesian beach and island travel pack for Vietnamese learners.
// Covers: pantai, pulau, snorkeling, kapal, penginapan, sewa motor, tiket masuk,
// pemandu wisata, island hopping, and practical tourism questions.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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

export const beachIslandTravelLessons: IndonesianLesson[] = [
  {
    id: "indonesian_beach_island_booking",
    level: "A2",
    category: "travel",
    title_vi: "Du lịch đảo — bãi biển, tàu và chỗ ở",
    title_en: "Island travel — beach, boat and lodging",
    sentences: [
      {
        en: "Saya mau liburan ke pulau kecil dekat Lombok.",
        vi: "Tôi muốn đi nghỉ ở một đảo nhỏ gần Lombok.",
        pronunciation_focus: [
          "liburan ke pulau → đi nghỉ đến đảo; `ke` chỉ hướng/điểm đến.",
          "pulau kecil → đảo nhỏ; tính từ `kecil` đứng sau danh từ.",
          "Lỗi người Việt: nói `di pulau` khi đang đi tới. Điểm đến dùng `ke pulau`.",
        ],
        pronunciation_focus_en: [
          "liburan ke pulau → vacation to an island; `ke` marks direction/destination.",
          "pulau kecil → small island; adjective `kecil` follows the noun.",
          "VN-speaker trap: saying `di pulau` when going there. Destination uses `ke pulau`.",
        ],
      },
      {
        en: "Pantai mana yang ombaknya tenang untuk berenang?",
        vi: "Bãi biển nào có sóng êm để bơi?",
        pronunciation_focus: [
          "pantai mana → bãi biển nào; `mana` hỏi lựa chọn.",
          "ombaknya tenang → sóng của nó êm; `-nya` nối với danh từ trước.",
          "untuk berenang → để bơi; `berenang` = bơi.",
        ],
        pronunciation_focus_en: [
          "pantai mana → which beach; `mana` asks for a choice.",
          "ombaknya tenang → its waves are calm; `-nya` links back to the noun.",
          "untuk berenang → for swimming; `berenang` = to swim.",
        ],
      },
      {
        en: "Berapa harga kapal ke pulau itu?",
        vi: "Giá tàu/thuyền ra đảo đó bao nhiêu?",
        pronunciation_focus: [
          "harga kapal → giá tàu/thuyền; `kapal` dùng cho thuyền/tàu đi biển.",
          "ke pulau itu → đến đảo đó; `itu` đứng sau danh từ.",
          "Lỗi người Việt: hỏi `kapal berapa harga`. Tự nhiên hơn: `Berapa harga kapal ...?`",
        ],
        pronunciation_focus_en: [
          "harga kapal → boat/ferry price; `kapal` covers sea boats and ships.",
          "ke pulau itu → to that island; `itu` follows the noun.",
          "VN-speaker trap: `kapal berapa harga`. More natural: `Berapa harga kapal ...?`",
        ],
      },
      {
        en: "Apakah tiket masuk sudah termasuk parkir?",
        vi: "Vé vào cửa đã bao gồm tiền gửi xe chưa?",
        pronunciation_focus: [
          "tiket masuk → vé vào cửa; thường gặp ở bãi biển/điểm du lịch.",
          "sudah termasuk → đã bao gồm; hỏi xem có tính trong giá không.",
          "parkir → đỗ/gửi xe; trong du lịch có thể là phí gửi xe.",
        ],
        pronunciation_focus_en: [
          "tiket masuk → entrance ticket; common at beaches and attractions.",
          "sudah termasuk → already includes; asks whether it is included in the price.",
          "parkir → parking; in tourist spots this can mean a parking fee.",
        ],
      },
      {
        en: "Saya mencari penginapan yang dekat pantai.",
        vi: "Tôi đang tìm chỗ ở gần bãi biển.",
        pronunciation_focus: [
          "mencari penginapan → tìm chỗ ở/nhà nghỉ; `penginapan` rộng hơn `hotel`.",
          "dekat pantai → gần bãi biển; `dekat` không cần thêm `di`.",
          "Lỗi người Việt: nói `dekat di pantai`. Gọn và đúng: `dekat pantai`.",
        ],
        pronunciation_focus_en: [
          "mencari penginapan → looking for lodging; `penginapan` is broader than `hotel`.",
          "dekat pantai → near the beach; `dekat` does not need extra `di`.",
          "VN-speaker trap: saying `dekat di pantai`. Correct and short: `dekat pantai`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là quốc gia quần đảo, nên du lịch `pantai` và `pulau` rất phổ biến: Bali, Lombok, Kepulauan Seribu, Komodo, Raja Ampat, Belitung. Ở nhiều điểm, bạn sẽ trả `tiket masuk`, phí `parkir`, hoặc thuê `kapal` riêng/chung. `Penginapan` có thể là hotel, homestay, guesthouse, bungalow, hoặc losmen đơn giản.",
    cultural_notes_en:
      "Indonesia is an archipelago, so `pantai` and `pulau` travel is very common: Bali, Lombok, the Thousand Islands, Komodo, Raja Ampat, and Belitung. At many sites you pay `tiket masuk`, `parkir`, or rent a private/shared `kapal`. `Penginapan` can mean a hotel, homestay, guesthouse, bungalow, or simple lodge.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi di chuyển ra đảo dùng `ke pulau`; khi đang ở đảo dùng `di pulau`. Hỏi giá bằng khung `Berapa harga ...?`, hỏi bao gồm bằng `sudah termasuk ...?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when traveling to an island use `ke pulau`; when already on the island use `di pulau`. Ask price with `Berapa harga ...?`, and ask inclusion with `sudah termasuk ...?`.",
    vocabulary: [
      {
        cell_id: "3ff340f6-7040-4892-995b-e2f77b780f96",
        word: "pantai",
        en: "beach",
        vi: "bãi biển",
        pos: "noun",
        pronunciation_vi: "PAN-tai",
        pronunciation_en: "PAN-tai",
      },
      {
        cell_id: "5a9ccc04-9c62-43c0-87a4-40e79e83aa37",
        word: "pulau",
        en: "island",
        vi: "đảo",
        pos: "noun",
        pronunciation_vi: "PU-lau",
        pronunciation_en: "POO-lau",
      },
      {
        cell_id: "9fbc86d5-7b3c-4565-a9a6-86f8af9b73c3",
        word: "kapal",
        en: "boat / ship",
        vi: "tàu / thuyền",
        pos: "noun",
        pronunciation_vi: "KA-pal",
        pronunciation_en: "KA-pal",
      },
      {
        cell_id: "11720ae5-cf94-48c7-98ea-b462b68f8267",
        word: "tiket masuk",
        en: "entrance ticket",
        vi: "vé vào cửa",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket MA-suk",
        pronunciation_en: "TEE-ket MA-sook",
      },
      {
        cell_id: "e968e259-b2bc-41ca-a4f8-9f80aa1e8194",
        word: "penginapan",
        en: "lodging / accommodation",
        vi: "chỗ ở / nhà nghỉ",
        pos: "noun",
        pronunciation_vi: "pe-ngi-NA-pan",
        pronunciation_en: "peh-ngee-NA-pan",
      },
      {
        cell_id: "1afe81d4-3221-4f3a-b244-a865a3c17285",
        word: "ombak tenang",
        en: "calm waves",
        vi: "sóng êm",
        pos: "noun phrase",
        pronunciation_vi: "OM-bak te-NANG",
        pronunciation_en: "OM-bak teh-NANG",
      },
      {
        cell_id: "abfa37bf-cb71-4fa4-a842-4e82fa883627",
        word: "parkir",
        en: "parking",
        vi: "gửi/đỗ xe",
        pos: "noun / verb",
        pronunciation_vi: "PAR-kir",
        pronunciation_en: "PAR-keer",
      },
    ],
    dialogue: [
      {
        cell_id: "b2e7fa07-0478-495c-a3f5-d2adaa2e139e",
        speaker: "Wisatawan",
        text: "Permisi, berapa harga kapal ke pulau itu?",
        vi: "Xin lỗi, giá tàu ra đảo đó bao nhiêu?",
        en: "Excuse me, how much is the boat to that island?",
      },
      {
        cell_id: "c2c0f2df-18c7-40d3-8888-a46a2aa5da79",
        speaker: "Petugas",
        text: "Seratus lima puluh ribu pulang pergi.",
        vi: "Một trăm năm mươi nghìn khứ hồi.",
        en: "One hundred fifty thousand round trip.",
      },
      {
        cell_id: "d8f1a8a5-7787-4a52-9486-5079df630038",
        speaker: "Wisatawan",
        text: "Apakah tiket masuk sudah termasuk parkir?",
        vi: "Vé vào cửa đã bao gồm gửi xe chưa?",
        en: "Does the entrance ticket include parking?",
      },
      {
        cell_id: "e3f4926a-c8d8-48c1-a970-74d1c4a50f66",
        speaker: "Petugas",
        text: "Belum. Parkir dibayar terpisah di depan.",
        vi: "Chưa. Phí gửi xe trả riêng ở phía trước.",
        en: "No. Parking is paid separately at the front.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ du lịch đảo còn thiếu:",
        instruction_en: "Fill in the missing island-travel word:",
        items: [
          {
            prompt: "Saya mau liburan ke ___ kecil. (đảo)",
            answer: "pulau",
            options: ["pulau", "pulang", "pula"],
          },
          {
            prompt: "Berapa harga ___ ke pulau itu? (tàu/thuyền)",
            answer: "kapal",
            options: ["kapal", "kamar", "kartu"],
          },
          {
            prompt: "Saya mencari ___ yang dekat pantai. (chỗ ở)",
            answer: "penginapan",
            options: ["penginapan", "penghasilan", "pengalaman"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pantai", answer: "bãi biển" },
          { prompt: "tiket masuk", answer: "vé vào cửa" },
          { prompt: "ombak tenang", answer: "sóng êm" },
          { prompt: "parkir", answer: "gửi/đỗ xe" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đi nghỉ ở một đảo nhỏ gần Lombok.", answer: "Saya mau liburan ke pulau kecil dekat Lombok." },
          { prompt: "Giá tàu ra đảo đó bao nhiêu?", answer: "Berapa harga kapal ke pulau itu?" },
          { prompt: "Tôi đang tìm chỗ ở gần bãi biển.", answer: "Saya mencari penginapan yang dekat pantai." },
        ],
      },
    ],
  },
  {
    id: "indonesian_snorkeling_guide_motorbike",
    level: "B1",
    category: "travel",
    title_vi: "Snorkeling và tour đảo — hướng dẫn viên, xe máy và an toàn",
    title_en: "Snorkeling and island tours — guide, motorbike and safety",
    sentences: [
      {
        en: "Saya mau ikut tur snorkeling besok pagi.",
        vi: "Tôi muốn tham gia tour snorkeling sáng mai.",
        pronunciation_focus: [
          "ikut tur snorkeling → tham gia tour snorkeling; `ikut` = tham gia/đi cùng.",
          "besok pagi → sáng mai; thời gian đặt cuối câu rất tự nhiên.",
          "snorkeling → từ mượn tiếng Anh, thường dùng hơn bản dịch dài.",
        ],
        pronunciation_focus_en: [
          "ikut tur snorkeling → join a snorkeling tour; `ikut` = join/follow along.",
          "besok pagi → tomorrow morning; time at the end is natural.",
          "snorkeling → English loanword, more common than a long translation.",
        ],
      },
      {
        en: "Apakah alat snorkeling sudah termasuk dalam paket?",
        vi: "Dụng cụ snorkeling đã bao gồm trong gói chưa?",
        pronunciation_focus: [
          "alat snorkeling → dụng cụ snorkeling; `alat` = dụng cụ.",
          "sudah termasuk dalam paket → đã bao gồm trong gói.",
          "Lỗi người Việt: bỏ `dalam`. Cụm đầy đủ là `termasuk dalam paket`.",
        ],
        pronunciation_focus_en: [
          "alat snorkeling → snorkeling gear; `alat` = tool/equipment.",
          "sudah termasuk dalam paket → already included in the package.",
          "VN-speaker trap: dropping `dalam`. Full phrase: `termasuk dalam paket`.",
        ],
      },
      {
        en: "Kami butuh pemandu wisata yang tahu spot aman.",
        vi: "Chúng tôi cần hướng dẫn viên biết điểm an toàn.",
        pronunciation_focus: [
          "pemandu wisata → hướng dẫn viên du lịch; từ gốc `pandu` = dẫn đường.",
          "spot aman → điểm an toàn; `spot` là từ du lịch thường gặp.",
          "yang tahu → người/cái mà biết; `yang` nối mệnh đề mô tả.",
        ],
        pronunciation_focus_en: [
          "pemandu wisata → tour guide; root `pandu` = guide/lead.",
          "spot aman → safe spot; `spot` is common in tourism talk.",
          "yang tahu → who/that knows; `yang` links a describing clause.",
        ],
      },
      {
        en: "Di pulau ini bisa sewa motor per hari?",
        vi: "Trên đảo này có thể thuê xe máy theo ngày không?",
        pronunciation_focus: [
          "di pulau ini → ở/trên đảo này; vị trí dùng `di`.",
          "sewa motor → thuê xe máy; cụm rất quan trọng ở Bali/Lombok.",
          "per hari → theo ngày/mỗi ngày; dùng khi hỏi giá thuê.",
        ],
        pronunciation_focus_en: [
          "di pulau ini → on this island; location uses `di`.",
          "sewa motor → rent a motorbike; key phrase in Bali/Lombok.",
          "per hari → per day; used when asking rental prices.",
        ],
      },
      {
        en: "Jangan snorkeling terlalu jauh dari kapal.",
        vi: "Đừng snorkeling quá xa khỏi thuyền.",
        pronunciation_focus: [
          "jangan + động từ → đừng làm gì; cảnh báo an toàn.",
          "terlalu jauh → quá xa; `terlalu` = quá mức.",
          "dari kapal → khỏi/từ thuyền; `dari` = từ.",
        ],
        pronunciation_focus_en: [
          "jangan + verb → don't do something; safety warning.",
          "terlalu jauh → too far; `terlalu` = excessively.",
          "dari kapal → from the boat; `dari` = from.",
        ],
      },
      {
        en: "Kalau arus kuat, kita kembali ke pantai.",
        vi: "Nếu dòng chảy mạnh, chúng ta quay lại bãi biển.",
        pronunciation_focus: [
          "kalau arus kuat → nếu dòng chảy mạnh; `arus` = dòng nước/dòng chảy.",
          "kembali ke pantai → quay lại bãi biển; hướng trở về dùng `ke`.",
          "Lỗi người Việt: nói `arus keras`; với dòng nước tự nhiên hơn là `arus kuat`.",
        ],
        pronunciation_focus_en: [
          "kalau arus kuat → if the current is strong; `arus` = water current/flow.",
          "kembali ke pantai → return to the beach; direction back uses `ke`.",
          "VN-speaker trap: saying `arus keras`; for currents, `arus kuat` is more natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Tour đảo ở Indonesia thường bán theo `paket`: kapal, pemandu, alat snorkeling, makan siang, dan tiket masuk có thể bao gồm hoặc tính riêng. Ở các đảo du lịch, `sewa motor` rất phổ biến nhưng hãy hỏi helm, bensin, deposit, và kondisi motor. Khi snorkeling, nghe hướng dẫn `pemandu wisata`; dòng chảy (`arus`) có thể mạnh dù mặt biển nhìn yên.",
    cultural_notes_en:
      "Island tours in Indonesia are often sold as a `paket`: boat, guide, snorkeling gear, lunch, and entrance ticket may be included or charged separately. On tourist islands, `sewa motor` is common, but ask about helmet, fuel, deposit, and motorbike condition. When snorkeling, follow the `pemandu wisata`; currents (`arus`) can be strong even when the surface looks calm.",
    tip_advice_vi:
      "Mẹo cho người Việt: `alat` = dụng cụ, nên `alat snorkeling` là bộ dụng cụ snorkeling. Khi hỏi giá thuê, thêm `per hari`. Khi cảnh báo, dùng `jangan + động từ`: `Jangan snorkeling terlalu jauh`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `alat` = equipment, so `alat snorkeling` means snorkeling gear. When asking rental price, add `per hari`. For warnings, use `jangan + verb`: `Jangan snorkeling terlalu jauh`.",
    vocabulary: [
      {
        cell_id: "2cdb2679-0df3-4d8d-952e-73d20b96d669",
        word: "snorkeling",
        en: "snorkeling",
        vi: "lặn ngắm san hô bằng ống thở",
        pos: "noun / verb",
        pronunciation_vi: "SNOR-ke-ling",
        pronunciation_en: "SNOR-ke-ling",
      },
      {
        cell_id: "a7c4db5c-2131-4ddb-a176-60e86beb657b",
        word: "alat snorkeling",
        en: "snorkeling gear",
        vi: "dụng cụ snorkeling",
        pos: "noun phrase",
        pronunciation_vi: "A-lat SNOR-ke-ling",
        pronunciation_en: "A-lat SNOR-ke-ling",
      },
      {
        cell_id: "fad90cf0-ff16-46ec-9366-293b007dbf7a",
        word: "pemandu wisata",
        en: "tour guide",
        vi: "hướng dẫn viên du lịch",
        pos: "noun phrase",
        pronunciation_vi: "pe-MAN-du wi-SA-ta",
        pronunciation_en: "peh-MAN-doo wee-SA-ta",
      },
      {
        cell_id: "f0bdad84-60a6-4575-af79-c9ff5a7e21bb",
        word: "sewa motor",
        en: "rent a motorbike",
        vi: "thuê xe máy",
        pos: "verb phrase",
        pronunciation_vi: "SE-wa MO-tor",
        pronunciation_en: "SEH-wa MOH-tor",
      },
      {
        cell_id: "01aa04a3-9523-4d51-a4a7-7bd6ad78c1fb",
        word: "per hari",
        en: "per day",
        vi: "mỗi ngày / theo ngày",
        pos: "phrase",
        pronunciation_vi: "per HA-ri",
        pronunciation_en: "per HA-ree",
      },
      {
        cell_id: "bef97e78-62a1-4882-bd09-b59687dde06e",
        word: "arus kuat",
        en: "strong current",
        vi: "dòng chảy mạnh",
        pos: "noun phrase",
        pronunciation_vi: "A-rus KU-at",
        pronunciation_en: "A-roos KOO-at",
      },
      {
        cell_id: "85ff7ad5-3f20-4b2c-b1f0-4f76f89248ee",
        word: "paket",
        en: "package",
        vi: "gói tour / gói dịch vụ",
        pos: "noun",
        pronunciation_vi: "PA-ket",
        pronunciation_en: "PA-ket",
      },
    ],
    dialogue: [
      {
        cell_id: "0da4ce21-d049-4bf8-b16f-5348895aa649",
        speaker: "Wisatawan",
        text: "Saya mau ikut tur snorkeling besok pagi.",
        vi: "Tôi muốn tham gia tour snorkeling sáng mai.",
        en: "I want to join a snorkeling tour tomorrow morning.",
      },
      {
        cell_id: "33a8798b-0ad9-4918-9914-ccd18df8b69c",
        speaker: "Agen tur",
        text: "Bisa. Alat snorkeling dan pemandu wisata sudah termasuk.",
        vi: "Được. Dụng cụ snorkeling và hướng dẫn viên đã bao gồm.",
        en: "Yes. Snorkeling gear and a tour guide are included.",
      },
      {
        cell_id: "7563c9da-ac67-451e-871a-2b39574afb45",
        speaker: "Wisatawan",
        text: "Di pulau ini bisa sewa motor per hari?",
        vi: "Trên đảo này có thể thuê xe máy theo ngày không?",
        en: "Can I rent a motorbike per day on this island?",
      },
      {
        cell_id: "2fd10ead-293b-487b-a4bc-306faf1788f5",
        speaker: "Agen tur",
        text: "Bisa, tapi wajib pakai helm dan hati-hati kalau jalan basah.",
        vi: "Có thể, nhưng bắt buộc đội mũ bảo hiểm và cẩn thận nếu đường ướt.",
        en: "Yes, but you must wear a helmet and be careful if the road is wet.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ tour đảo còn thiếu:",
        instruction_en: "Fill in the missing island-tour word:",
        items: [
          {
            prompt: "Saya mau ikut tur ___ besok pagi. (snorkeling)",
            answer: "snorkeling",
            options: ["snorkeling", "sekolah", "selokan"],
          },
          {
            prompt: "Kami butuh ___ wisata. (hướng dẫn viên)",
            answer: "pemandu",
            options: ["pemandu", "pemilik", "pembeli"],
          },
          {
            prompt: "Di pulau ini bisa ___ motor per hari? (thuê)",
            answer: "sewa",
            options: ["sewa", "sawah", "sama"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "alat snorkeling", answer: "dụng cụ snorkeling" },
          { prompt: "pemandu wisata", answer: "hướng dẫn viên du lịch" },
          { prompt: "per hari", answer: "mỗi ngày / theo ngày" },
          { prompt: "arus kuat", answer: "dòng chảy mạnh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Dụng cụ snorkeling đã bao gồm trong gói chưa?", answer: "Apakah alat snorkeling sudah termasuk dalam paket?" },
          { prompt: "Đừng snorkeling quá xa khỏi thuyền.", answer: "Jangan snorkeling terlalu jauh dari kapal." },
          { prompt: "Nếu dòng chảy mạnh, chúng ta quay lại bãi biển.", answer: "Kalau arus kuat, kita kembali ke pantai." },
        ],
      },
    ],
  },
];
