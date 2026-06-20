// Indonesian property viewing and rental lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
  content?: string;
};

export const propertyViewingRentalLessons: IndonesianLesson[] = [
  {
    id: "indonesian_property_viewing_kost_house",
    level: "A2",
    category: "housing",
    title_vi: "Đi xem nhà và survei kos",
    title_en: "Viewing a house and surveying a kost",
    sentences: [
      {
        en: "Saya mau lihat rumah yang disewakan.",
        vi: "Tôi muốn xem căn nhà đang cho thuê.",
        pronunciation_focus: [
          "SA-ya MAU LI-hat RU-mah yang di-SE-wa-kan.",
          "`lihat rumah` = xem nhà; `disewakan` = được cho thuê/chủ cho thuê.",
          "L1 Việt: phân biệt `menyewa` = đi thuê, `menyewakan` = cho thuê. Biển nhà thường ghi `disewakan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU LI-hat RU-mah yang di-SE-wa-kan.",
          "`lihat rumah` = view a house; `disewakan` = being rented out by the owner.",
          "VN-speaker trap: `menyewa` = rent from, `menyewakan` = rent out. Rental signs often say `disewakan`.",
        ],
      },
      {
        en: "Kapan saya bisa survei kos ini?",
        vi: "Khi nào tôi có thể đi xem/khảo sát phòng trọ này?",
        pronunciation_focus: [
          "KA-pan SA-ya BI-sa SUR-vei kos I-ni.",
          "`survei kos` = đi xem phòng trọ trước khi thuê; từ `survei` rất phổ biến trong nói hằng ngày.",
          "L1 Việt: hỏi lịch dùng `kapan`, không dùng `jam berapa` nếu chưa biết ngày.",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya BI-sa SUR-vei kos I-ni.",
          "`survei kos` = view/check a kost before renting; `survei` is common in daily speech.",
          "VN-speaker note: ask scheduling with `kapan`, not `jam berapa` if the day is not known yet.",
        ],
      },
      {
        en: "Fasilitas apa saja yang sudah tersedia?",
        vi: "Có sẵn những tiện nghi nào?",
        pronunciation_focus: [
          "fa-si-li-TAS A-pa SA-ja yang SU-dah ter-SE-di-a.",
          "`fasilitas` = tiện nghi/cơ sở vật chất; `apa saja` hỏi cả danh sách.",
          "L1 Việt: thêm `saja` để hỏi nhiều món: AC, Wi-Fi, kasur, lemari, dapur.",
        ],
        pronunciation_focus_en: [
          "fa-si-li-TAS A-pa SA-ja yang SU-dah ter-SE-di-a.",
          "`fasilitas` = facilities/amenities; `apa saja` asks for the full list.",
          "VN-speaker note: add `saja` to ask for multiple items: AC, Wi-Fi, bed, wardrobe, kitchen.",
        ],
      },
      {
        en: "Lokasinya dekat halte atau stasiun?",
        vi: "Vị trí có gần trạm xe buýt hoặc nhà ga không?",
        pronunciation_focus: [
          "lo-KA-si-nya de-KAT HAL-te A-tau sta-SI-un.",
          "`lokasinya` = vị trí đó; `halte` = trạm xe buýt; `stasiun` = nhà ga.",
          "L1 Việt: `dekat` đứng trước nơi chốn: `dekat halte`, không cần thêm `dengan`.",
        ],
        pronunciation_focus_en: [
          "lo-KA-si-nya de-KAT HAL-te A-tau sta-SI-un.",
          "`lokasinya` = the location; `halte` = bus stop; `stasiun` = station.",
          "VN-speaker trap: `dekat` goes directly before a place: `dekat halte`; no `dengan` needed.",
        ],
      },
      {
        en: "Lingkungannya aman untuk pulang malam?",
        vi: "Khu vực này có an toàn để về muộn không?",
        pronunciation_focus: [
          "ling-KUNG-an-nya A-man UN-tuk PU-lang MA-lam.",
          "`lingkungan` = môi trường/khu vực xung quanh; `aman` = an toàn.",
          "L1 Việt: `pulang malam` = về nhà muộn/ban đêm, không phải 'đêm về'.",
        ],
        pronunciation_focus_en: [
          "ling-KUNG-an-nya A-man UN-tuk PU-lang MA-lam.",
          "`lingkungan` = surrounding area/neighborhood; `aman` = safe.",
          "VN-speaker note: `pulang malam` = come home late/at night, not 'night returns'.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di Indonesia, sebelum menyewa kos, kontrakan, atau rumah, calon penyewa thường `survei` langsung untuk cek kondisi kamar, kamar mandi, ventilasi, fasilitas, keamanan, akses transportasi, dan suasana lingkungan. Jangan hanya percaya foto. Tanyakan juga aturan tamu, jam malam, parkir, listrik, air, Wi-Fi, dan siapa yang bertanggung jawab kalau ada kerusakan.",
    cultural_notes_en:
      "In Indonesia, before renting a kost, kontrakan, or house, prospective tenants often do an in-person `survei` to check the room, bathroom, ventilation, facilities, security, transport access, and neighborhood feel. Do not rely only on photos. Also ask about guest rules, curfew, parking, electricity, water, Wi-Fi, and who is responsible if something breaks.",
    tip_advice_vi:
      "Mẫu hỏi nhanh: `Kapan bisa survei?`, `Fasilitas apa saja?`, `Lokasinya dekat...?`, `Lingkungannya aman?`, `Boleh lihat kamar mandinya?`. Người Việt nên nhớ `lokasi` là vị trí, còn `tempat` là nơi/chỗ nói chung.",
    tip_advice_en:
      "Quick question frames: `Kapan bisa survei?`, `Fasilitas apa saja?`, `Lokasinya dekat...?`, `Lingkungannya aman?`, `Boleh lihat kamar mandinya?`. Vietnamese speakers should note `lokasi` = location, while `tempat` = place in general.",
    vocabulary: [
      {
        word: "lihat rumah",
        en: "view a house",
        vi: "đi xem nhà",
        pos: "verb phrase",
        pronunciation_vi: "LI-hat RU-mah",
        pronunciation_en: "LEE-hat ROO-mah",
      },
      {
        word: "survei kos",
        en: "view/check a kost",
        vi: "đi xem/khảo sát phòng trọ",
        pos: "verb phrase",
        pronunciation_vi: "SUR-vei kos",
        pronunciation_en: "SUR-vay kos",
      },
      {
        word: "fasilitas",
        en: "facilities / amenities",
        vi: "tiện nghi / cơ sở vật chất",
        pos: "noun",
        pronunciation_vi: "fa-si-li-TAS",
        pronunciation_en: "fa-see-lee-TAS",
      },
      {
        word: "lokasi",
        en: "location",
        vi: "vị trí",
        pos: "noun",
        pronunciation_vi: "lo-KA-si",
        pronunciation_en: "lo-KA-see",
      },
      {
        word: "keamanan",
        en: "security / safety",
        vi: "an ninh / sự an toàn",
        pos: "noun",
        pronunciation_vi: "ke-a-MA-nan",
        pronunciation_en: "ke-a-MA-nan",
      },
      {
        word: "lingkungan",
        en: "neighborhood / surroundings",
        vi: "khu vực xung quanh / môi trường",
        pos: "noun",
        pronunciation_vi: "ling-KUNG-an",
        pronunciation_en: "ling-KOONG-an",
      },
    ],
    dialogue: [
      {
        speaker: "Calon Penyewa",
        text: "Selamat sore, Pak. Saya mau lihat rumah yang disewakan.",
        vi: "Chào buổi chiều bác/anh. Tôi muốn xem căn nhà đang cho thuê.",
        en: "Good afternoon, Sir. I would like to view the house for rent.",
      },
      {
        speaker: "Pemilik",
        text: "Silakan. Mau lihat kamar depan dulu?",
        vi: "Mời vào. Muốn xem phòng phía trước trước không?",
        en: "Please. Would you like to see the front room first?",
      },
      {
        speaker: "Calon Penyewa",
        text: "Boleh. Fasilitas apa saja yang sudah tersedia?",
        vi: "Được ạ. Có sẵn những tiện nghi nào?",
        en: "Sure. What facilities are already available?",
      },
      {
        speaker: "Pemilik",
        text: "Sudah ada AC, kasur, lemari, Wi-Fi, dan tempat parkir.",
        vi: "Đã có máy lạnh, giường, tủ, Wi-Fi và chỗ đậu xe.",
        en: "There is AC, a bed, wardrobe, Wi-Fi, and parking space.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về đi xem nhà/phòng:",
        instruction_en: "Fill in the suitable property-viewing word:",
        items: [
          {
            prompt: "Saya mau ___ rumah yang disewakan. (xem)",
            answer: "lihat",
            options: ["lihat", "lewat", "lupa"],
          },
          {
            prompt: "Kapan saya bisa ___ kos ini? (khảo sát/xem)",
            answer: "survei",
            options: ["survei", "sarapan", "setor"],
          },
          {
            prompt: "Fasilitas apa ___ yang sudah tersedia? (những gì)",
            answer: "saja",
            options: ["saja", "sakit", "salah"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn xem căn nhà đang cho thuê.", answer: "Saya mau lihat rumah yang disewakan." },
          { prompt: "Có sẵn những tiện nghi nào?", answer: "Fasilitas apa saja yang sudah tersedia?" },
          { prompt: "Khu vực này có an toàn để về muộn không?", answer: "Lingkungannya aman untuk pulang malam?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_rental_price_deposit_owner_questions",
    level: "B1",
    category: "housing",
    title_vi: "Hỏi pemilik về giá thuê, deposit và aturan",
    title_en: "Asking the owner about rent, deposit, and rules",
    sentences: [
      {
        en: "Harga sewanya berapa per bulan, Pak?",
        vi: "Giá thuê mỗi tháng là bao nhiêu ạ?",
        pronunciation_focus: [
          "HAR-ga SE-wa-nya be-RA-pa per BU-lan, Pak.",
          "`harga sewa` = giá thuê; `per bulan` = mỗi tháng.",
          "L1 Việt: hỏi tiền dùng `berapa`, không dùng `apa`: `berapa harga sewanya?`.",
        ],
        pronunciation_focus_en: [
          "HAR-ga SE-wa-nya be-RA-pa per BU-lan, Pak.",
          "`harga sewa` = rental price; `per bulan` = per month.",
          "VN-speaker trap: ask money amounts with `berapa`, not `apa`: `berapa harga sewanya?`.",
        ],
      },
      {
        en: "Apakah deposit bisa dikembalikan saat saya pindah?",
        vi: "Tiền cọc có thể được trả lại khi tôi dọn đi không?",
        pronunciation_focus: [
          "a-PA-kah de-PO-sit BI-sa di-kem-BA-li-kan saat SA-ya PIN-dah.",
          "`deposit` = tiền cọc; `dikembalikan` = được trả lại/hoàn lại.",
          "L1 Việt: bị động `di-` rất thường trong hợp đồng: `dibayar`, `dikembalikan`, `dipotong`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah de-PO-sit BI-sa di-kem-BA-li-kan saat SA-ya PIN-dah.",
          "`deposit` = deposit; `dikembalikan` = returned/refunded.",
          "VN-speaker note: passive `di-` is common in contracts: `dibayar`, `dikembalikan`, `dipotong`.",
        ],
      },
      {
        en: "Listrik, air, dan Wi-Fi sudah termasuk harga sewa?",
        vi: "Điện, nước và Wi-Fi đã bao gồm trong giá thuê chưa?",
        pronunciation_focus: [
          "LIS-trik, A-ir, dan WAI-fai SU-dah ter-MA-suk HAR-ga SE-wa.",
          "`sudah termasuk` = đã bao gồm; `air` trong Indonesia nghĩa là nước, đọc A-ir.",
          "L1 Việt: đừng đọc `air` như tiếng Anh. Nói hai âm rõ: A-ir.",
        ],
        pronunciation_focus_en: [
          "LIS-trik, A-ir, dan WAI-fai SU-dah ter-MA-suk HAR-ga SE-wa.",
          "`sudah termasuk` = already included; Indonesian `air` means water and is pronounced A-ir.",
          "VN-speaker trap: do not read `air` like English. Say two clear vowels: A-ir.",
        ],
      },
      {
        en: "Boleh saya tanya aturan tamu dan jam malam?",
        vi: "Tôi có thể hỏi về quy định khách và giờ giới nghiêm không?",
        pronunciation_focus: [
          "BO-leh SA-ya TAN-ya a-TUR-an TA-mu dan jam MA-lam.",
          "`aturan tamu` = quy định về khách; `jam malam` = giờ đóng cửa/giờ giới nghiêm.",
          "L1 Việt: `boleh saya tanya...` làm câu hỏi mềm hơn khi hỏi chủ nhà.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya TAN-ya a-TUR-an TA-mu dan jam MA-lam.",
          "`aturan tamu` = guest rules; `jam malam` = curfew/late-night rule.",
          "VN-speaker note: `boleh saya tanya...` softens the question when speaking to an owner.",
        ],
      },
      {
        en: "Kalau ada kerusakan, siapa yang bertanggung jawab?",
        vi: "Nếu có hư hỏng, ai chịu trách nhiệm?",
        pronunciation_focus: [
          "KA-lau A-da ke-RU-sa-kan, SI-a-pa yang ber-tang-GUNG JA-wab.",
          "`kerusakan` = hư hỏng; `bertanggung jawab` = chịu trách nhiệm.",
          "L1 Việt: `siapa yang...` là khung hỏi người chịu trách nhiệm, giống 'ai là người...'.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da ke-ROO-sa-kan, SI-a-pa yang ber-tang-GOONG JA-wab.",
          "`kerusakan` = damage; `bertanggung jawab` = be responsible.",
          "VN-speaker win: `siapa yang...` asks who is responsible, like Vietnamese 'ai là người...'.",
        ],
      },
    ],
    cultural_notes_vi:
      "Saat tanya pemilik rumah atau ibu/bapak kos, gunakan `Pak/Bu` dan pertanyaan jelas. Hal penting: harga sewa, deposit, listrik, air, Wi-Fi, parkir, keamanan, aturan tamu, jam malam, durasi sewa, dan tanggung jawab perbaikan. Jika setuju, minta semua kesepakatan ditulis supaya tidak salah paham.",
    cultural_notes_en:
      "When asking a homeowner or kost owner, use `Pak/Bu` and clear questions. Important points include rent, deposit, electricity, water, Wi-Fi, parking, security, guest rules, curfew, rental duration, and repair responsibility. If you agree, ask for all terms to be written down to avoid misunderstandings.",
    tip_advice_vi:
      "Cụm nên thuộc trước khi trả tiền: `harga sewa`, `deposit dikembalikan`, `sudah termasuk`, `aturan tamu`, `bertanggung jawab`, `kesepakatan tertulis`. Người Việt nên phân biệt `boleh` (xin phép) và `bisa` (khả năng/có thể thực hiện).",
    tip_advice_en:
      "Chunks to know before paying: `harga sewa`, `deposit dikembalikan`, `sudah termasuk`, `aturan tamu`, `bertanggung jawab`, `kesepakatan tertulis`. Vietnamese speakers should distinguish `boleh` (permission) from `bisa` (ability/possibility).",
    vocabulary: [
      {
        word: "harga sewa",
        en: "rental price",
        vi: "giá thuê",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga SE-wa",
        pronunciation_en: "HAR-ga SE-wa",
      },
      {
        word: "deposit",
        en: "deposit",
        vi: "tiền đặt cọc",
        pos: "noun",
        pronunciation_vi: "de-PO-sit",
        pronunciation_en: "de-PO-sit",
      },
      {
        word: "dikembalikan",
        en: "returned / refunded",
        vi: "được trả lại / hoàn lại",
        pos: "verb",
        pronunciation_vi: "di-kem-BA-li-kan",
        pronunciation_en: "di-kem-BA-lee-kan",
      },
      {
        word: "aturan tamu",
        en: "guest rules",
        vi: "quy định về khách",
        pos: "noun phrase",
        pronunciation_vi: "a-TUR-an TA-mu",
        pronunciation_en: "a-TOOR-an TA-moo",
      },
      {
        word: "jam malam",
        en: "curfew / late-night rule",
        vi: "giờ giới nghiêm / giờ đóng cổng",
        pos: "noun phrase",
        pronunciation_vi: "jam MA-lam",
        pronunciation_en: "jam MA-lam",
      },
      {
        word: "bertanggung jawab",
        en: "to be responsible",
        vi: "chịu trách nhiệm",
        pos: "verb phrase",
        pronunciation_vi: "ber-tang-GUNG JA-wab",
        pronunciation_en: "ber-tang-GOONG JA-wab",
      },
    ],
    dialogue: [
      {
        speaker: "Calon Penyewa",
        text: "Harga sewanya berapa per bulan, Bu?",
        vi: "Giá thuê mỗi tháng là bao nhiêu ạ?",
        en: "How much is the rent per month, Ma'am?",
      },
      {
        speaker: "Pemilik",
        text: "Tiga juta per bulan, belum termasuk listrik dan air.",
        vi: "Ba triệu mỗi tháng, chưa bao gồm điện và nước.",
        en: "Three million per month, not including electricity and water.",
      },
      {
        speaker: "Calon Penyewa",
        text: "Apakah deposit bisa dikembalikan saat saya pindah?",
        vi: "Tiền cọc có thể được trả lại khi tôi dọn đi không?",
        en: "Can the deposit be returned when I move out?",
      },
      {
        speaker: "Pemilik",
        text: "Bisa, kalau tidak ada kerusakan dan semua tagihan sudah dibayar.",
        vi: "Có thể, nếu không có hư hỏng và mọi hóa đơn đã được trả.",
        en: "Yes, if there is no damage and all bills have been paid.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "harga sewa", answer: "giá thuê" },
          { prompt: "deposit", answer: "tiền đặt cọc" },
          { prompt: "aturan tamu", answer: "quy định về khách" },
          { prompt: "bertanggung jawab", answer: "chịu trách nhiệm" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Harga sewanya berapa per ___? (tháng)",
            answer: "bulan",
            options: ["bulan", "badan", "bahan"],
          },
          {
            prompt: "Deposit bisa ___ saat saya pindah? (được trả lại)",
            answer: "dikembalikan",
            options: ["dikembalikan", "dikirimkan", "ditinggalkan"],
          },
          {
            prompt: "Kalau ada kerusakan, siapa yang bertanggung ___? (trách nhiệm)",
            answer: "jawab",
            options: ["jawab", "jalan", "jajan"],
          },
        ],
      },
    ],
  },
];
