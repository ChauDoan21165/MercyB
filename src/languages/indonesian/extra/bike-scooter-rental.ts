// Bike and scooter rental Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 26 file. Covers sewa sepeda, sewa skuter, helm, deposit, kerusakan,
// durasi sewa, jalur aman, and pengembalian.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_bike_scooter_rental",
    level: "A2",
    category: "transport",
    title_vi: "Thuê xe đạp và xe skuter",
    title_en: "Bike and scooter rental",
    sentences: [
      {
        en: "Saya mau sewa sepeda selama dua jam.",
        vi: "Tôi muốn thuê xe đạp trong hai giờ.",
        pronunciation_focus: [
          "SA-ya mau SE-wa se-PE-da se-LA-ma DU-a jam - `sewa sepeda` = thuê xe đạp; `selama dua jam` = trong hai giờ.",
          "`sewa` dùng cho thuê/mướn. Người thuê nói `saya sewa`; chủ cho thuê cũng có thể nói `kami menyewakan`.",
          "Lỗi người Việt: bỏ `selama` trước thời lượng. Câu rõ hơn là `selama dua jam`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau SEH-wa seh-PEH-da seh-LA-ma DOO-a jam - `sewa sepeda` = rent a bicycle; `selama dua jam` = for two hours.",
          "`sewa` is used for rent/hire. A renter says `saya sewa`; a rental shop may say `kami menyewakan`.",
          "VN-speaker trap: dropping `selama` before a duration. Clearer: `selama dua jam`.",
        ],
      },
      {
        en: "Berapa harga sewa skuter per hari?",
        vi: "Giá thuê skuter mỗi ngày là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga SE-wa SKU-ter per HA-ri - `harga sewa` = giá thuê; `per hari` = mỗi ngày.",
          "`skuter` thường dùng cho scooter điện hoặc xe kiểu scooter; nếu là xe máy xăng, hỏi rõ `motor`.",
          "Lỗi người Việt: nói `berapa harga menyewa`. Tự nhiên hơn: `berapa harga sewa...`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga SEH-wa SKOO-ter per HA-ree - `harga sewa` = rental price; `per hari` = per day.",
          "`skuter` is often used for electric scooters or scooter-style vehicles; if it is a gas motorbike, clarify `motor`.",
          "VN-speaker trap: saying `berapa harga menyewa`. More natural: `berapa harga sewa...`.",
        ],
      },
      {
        en: "Apakah helm sudah termasuk dalam harga sewa?",
        vi: "Mũ bảo hiểm đã bao gồm trong giá thuê chưa?",
        pronunciation_focus: [
          "a-PA-kah helm SU-dah ter-MA-suk DA-lam HAR-ga SE-wa - `helm` = mũ bảo hiểm; `sudah termasuk` = đã bao gồm.",
          "`dalam harga sewa` = trong giá thuê. Câu này tránh hiểu nhầm về phí thêm.",
          "Lỗi người Việt: hỏi `sudah termasuk tidak?`. Với 'đã...chưa', dùng `sudah termasuk... belum?` hoặc câu trang trọng này.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah helm SOO-dah ter-MA-sook DA-lam HAR-ga SEH-wa - `helm` = helmet; `sudah termasuk` = already included.",
          "`dalam harga sewa` = in the rental price. This avoids confusion about extra fees.",
          "VN-speaker trap: asking `sudah termasuk tidak?`. For already/yet questions, use `sudah termasuk... belum?` or this formal form.",
        ],
      },
      {
        en: "Saya perlu meninggalkan deposit berapa?",
        vi: "Tôi cần để lại tiền đặt cọc bao nhiêu?",
        pronunciation_focus: [
          "SA-ya PER-lu me-ning-GAL-kan de-PO-sit be-RA-pa - `meninggalkan deposit` = để lại tiền cọc; `berapa` = bao nhiêu.",
          "`deposit` là từ mượn rất phổ biến khi thuê xe, phòng, hoặc thiết bị.",
          "Lỗi người Việt: nói `kasih jaminan berapa` có thể hiểu, nhưng `deposit` rõ hơn trong dịch vụ thuê.",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo meh-ning-GAL-kan deh-PO-sit be-RA-pa - `meninggalkan deposit` = leave a deposit; `berapa` = how much.",
          "`deposit` is a common loanword for renting vehicles, rooms, or equipment.",
          "VN-speaker note: `kasih jaminan berapa` may be understood, but `deposit` is clearer in rental services.",
        ],
      },
      {
        en: "Tolong cek kerusakan sebelum saya pakai.",
        vi: "Làm ơn kiểm tra hư hỏng trước khi tôi sử dụng.",
        pronunciation_focus: [
          "TO-long cek ke-ru-SA-kan se-BE-lum SA-ya PA-kai - `cek kerusakan` = kiểm tra hư hỏng; `sebelum saya pakai` = trước khi tôi dùng.",
          "`kerusakan` là danh từ 'hư hỏng/thiệt hại'. Chụp ảnh trước khi thuê là thói quen an toàn.",
          "Lỗi người Việt: nói `rusak apa?` quá ngắn. `Cek kerusakan` lịch sự và cụ thể hơn.",
        ],
        pronunciation_focus_en: [
          "TO-long chek keh-roo-SA-kan seh-BE-loom SA-ya PA-kai - `cek kerusakan` = check for damage; `sebelum saya pakai` = before I use it.",
          "`kerusakan` is the noun for damage. Taking photos before renting is a safe habit.",
          "VN-speaker note: `rusak apa?` is too short. `Cek kerusakan` is more polite and specific.",
        ],
      },
      {
        en: "Rem depan agak longgar, apakah masih aman?",
        vi: "Phanh trước hơi lỏng, còn an toàn không?",
        pronunciation_focus: [
          "rem DE-pan A-gak LONG-gar, a-PA-kah MA-sih A-man - `rem depan` = phanh trước; `longgar` = lỏng; `aman` = an toàn.",
          "`agak` làm câu mềm hơn: hơi/lành lạnh/một chút. Hữu ích khi báo vấn đề mà không cáo buộc.",
          "Lỗi người Việt: dùng `rem rusak` khi chỉ hơi lỏng. Nói cụ thể `agak longgar`.",
        ],
        pronunciation_focus_en: [
          "rem DEH-pan A-gak LONG-gar, a-PA-kah MA-sih A-man - `rem depan` = front brake; `longgar` = loose; `aman` = safe.",
          "`agak` softens the sentence: a bit/rather. Useful for reporting a problem without sounding accusatory.",
          "VN-speaker note: avoid `rem rusak` if it is only loose. Be specific: `agak longgar`.",
        ],
      },
      {
        en: "Jalur aman untuk pemula lewat mana?",
        vi: "Tuyến đường an toàn cho người mới đi qua đâu?",
        pronunciation_focus: [
          "JA-lur A-man UN-tuk pe-MU-la LE-wat MA-na - `jalur aman` = tuyến/làn đường an toàn; `pemula` = người mới.",
          "`lewat mana?` hỏi đi qua đường nào. Dùng khi hỏi route xe đạp/skuter.",
          "Lỗi người Việt: nói `jalan aman di mana` có thể hiểu là nơi an toàn ở đâu. `Jalur aman lewat mana?` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "JA-loor A-man OON-took pe-MOO-la LEH-wat MA-na - `jalur aman` = safe route/lane; `pemula` = beginner.",
          "`lewat mana?` asks which way to go through. Use it for bike/scooter routes.",
          "VN-speaker trap: `jalan aman di mana` can sound like 'where is a safe road/place?' `Jalur aman lewat mana?` is clearer.",
        ],
      },
      {
        en: "Durasi sewa bisa diperpanjang lewat aplikasi?",
        vi: "Thời hạn thuê có thể gia hạn qua ứng dụng không?",
        pronunciation_focus: [
          "du-RA-si SE-wa BI-sa di-per-PAN-jang LE-wat ap-li-KA-si - `durasi sewa` = thời lượng thuê; `diperpanjang` = được gia hạn.",
          "`lewat aplikasi` = qua ứng dụng. Trong nói thường cũng nghe `via aplikasi`.",
          "Lỗi người Việt: nói `tambah waktu` được, nhưng với thuê dịch vụ `diperpanjang` chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "doo-RA-see SEH-wa BEE-sa dee-per-PAN-jang LEH-wat ap-lee-KA-see - `durasi sewa` = rental duration; `diperpanjang` = extended.",
          "`lewat aplikasi` = through the app. Casual speech may also say `via aplikasi`.",
          "VN-speaker note: `tambah waktu` works, but for rentals `diperpanjang` is more precise.",
        ],
      },
      {
        en: "Kalau baterai skuter habis, saya harus hubungi siapa?",
        vi: "Nếu pin skuter hết, tôi phải liên hệ ai?",
        pronunciation_focus: [
          "KA-lau ba-te-RAI SKU-ter HA-bis, SA-ya HA-rus hu-BUNG-i SI-a-pa - `baterai habis` = hết pin; `hubungi siapa` = liên hệ ai.",
          "`habis` dùng cho hết pin, hết xăng, hết thời gian, hết tiền.",
          "Lỗi người Việt: nói `baterai mati` được, nhưng `baterai habis` rõ hơn khi pin cạn.",
        ],
        pronunciation_focus_en: [
          "KA-lau ba-teh-RAI SKOO-ter HA-bis, SA-ya HA-roos hoo-BOONG-ee SEE-a-pa - `baterai habis` = battery is empty/dead; `hubungi siapa` = contact whom.",
          "`habis` is used for battery, gas, time, or money running out.",
          "VN-speaker note: `baterai mati` can work, but `baterai habis` is clearer when the charge is depleted.",
        ],
      },
      {
        en: "Pengembalian sepeda harus di tempat yang sama?",
        vi: "Việc trả xe đạp phải ở cùng một chỗ không?",
        pronunciation_focus: [
          "pe-ngem-BA-li-an se-PE-da HA-rus di TEM-pat yang SA-ma - `pengembalian` = việc trả lại; `tempat yang sama` = cùng một chỗ.",
          "`pengembalian sepeda` là cách nói danh từ kiểu quy định. Nói thường: `kembalikan sepedanya di mana?`.",
          "Lỗi người Việt: dùng `pulang sepeda`. Trả lại đồ thuê là `mengembalikan` hoặc `pengembalian`.",
        ],
        pronunciation_focus_en: [
          "peh-ngem-BA-lee-an seh-PEH-da HA-roos dee TEM-pat yang SA-ma - `pengembalian` = return process; `tempat yang sama` = the same place.",
          "`pengembalian sepeda` is a rule/policy style noun phrase. Casual: `kembalikan sepedanya di mana?`.",
          "VN-speaker trap: saying `pulang sepeda`. Returning a rented item is `mengembalikan` or `pengembalian`.",
        ],
      },
      {
        en: "Saya sudah foto kondisi skuter sebelum berangkat.",
        vi: "Tôi đã chụp ảnh tình trạng skuter trước khi khởi hành.",
        pronunciation_focus: [
          "SA-ya SU-dah FO-to kon-DI-si SKU-ter se-BE-lum be-RANG-kat - `kondisi skuter` = tình trạng skuter; `sebelum berangkat` = trước khi đi.",
          "`foto` có thể dùng như động từ trong nói thường: chụp ảnh.",
          "Lỗi người Việt: dùng `mengambil foto` không sai, nhưng trong chat thuê xe `sudah foto` ngắn và tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah FO-to kon-DEE-see SKOO-ter seh-BE-loom beh-RANG-kat - `kondisi skuter` = scooter condition; `sebelum berangkat` = before leaving.",
          "`foto` can be used as a casual verb: take a photo.",
          "VN-speaker note: `mengambil foto` is not wrong, but in rental chat `sudah foto` is short and natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi thuê xe đạp, skuter, hoặc motor ở Indonesia, hãy hỏi rõ `harga sewa`, `deposit`, `durasi sewa`, helm có bao gồm không, và nơi `pengembalian`. Trước khi chạy, nên kiểm tra rem, lampu, ban, baterai/bensin, và chụp ảnh `kondisi` để tránh bị tính phí `kerusakan` cũ. Với skuter điện hoặc sepeda di khu du lịch, hỏi `jalur aman untuk pemula` rất thực tế.",
    cultural_notes_en:
      "When renting a bicycle, scooter, or motorbike in Indonesia, clarify the rental price, deposit, rental duration, whether a helmet is included, and the return location. Before riding, check brakes, lights, tires, battery/fuel, and photograph the condition to avoid being charged for old damage. With electric scooters or tourist-area bicycles, asking for a safe beginner route is very practical.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya mau sewa sepeda selama dua jam. Apakah helm sudah termasuk? Saya perlu meninggalkan deposit berapa? Tolong cek kerusakan sebelum saya pakai, dan pengembaliannya di mana?`",
    tip_advice_en:
      "Safe template: `Saya mau sewa sepeda selama dua jam. Apakah helm sudah termasuk? Saya perlu meninggalkan deposit berapa? Tolong cek kerusakan sebelum saya pakai, dan pengembaliannya di mana?`",
    vocabulary: [
      {
        cell_id: "8e27436f-4f95-4317-aea0-8dffe2b37e19",
        word: "sewa sepeda",
        en: "rent a bicycle",
        vi: "thuê xe đạp",
        pos: "verb phrase",
        pronunciation_vi: "SE-wa se-PE-da",
        pronunciation_en: "SEH-wa seh-PEH-da",
      },
      {
        cell_id: "fcffa5f8-aec5-463e-be02-c839971493fd",
        word: "sewa skuter",
        en: "rent a scooter",
        vi: "thuê skuter",
        pos: "verb phrase",
        pronunciation_vi: "SE-wa SKU-ter",
        pronunciation_en: "SEH-wa SKOO-ter",
      },
      {
        cell_id: "b507c248-3437-4a64-8436-50e77484994d",
        word: "helm",
        en: "helmet",
        vi: "mũ bảo hiểm",
        pos: "noun",
        pronunciation_vi: "helm",
        pronunciation_en: "helm",
      },
      {
        cell_id: "6031a3ad-8324-4b4a-b8a3-51859615c6b3",
        word: "deposit",
        en: "deposit",
        vi: "tiền đặt cọc",
        pos: "noun",
        pronunciation_vi: "de-PO-sit",
        pronunciation_en: "deh-PO-sit",
      },
      {
        cell_id: "ebcbcf00-12c2-46e2-aed8-c42f3163c866",
        word: "kerusakan",
        en: "damage",
        vi: "hư hỏng/thiệt hại",
        pos: "noun",
        pronunciation_vi: "ke-ru-SA-kan",
        pronunciation_en: "keh-roo-SA-kan",
      },
      {
        cell_id: "16d6a200-40f2-4a73-8154-b10cb2886d86",
        word: "durasi sewa",
        en: "rental duration",
        vi: "thời lượng thuê",
        pos: "noun",
        pronunciation_vi: "du-RA-si SE-wa",
        pronunciation_en: "doo-RA-see SEH-wa",
      },
      {
        cell_id: "e5b98d29-7369-47b0-9886-1dbec448839a",
        word: "jalur aman",
        en: "safe route/lane",
        vi: "tuyến/làn đường an toàn",
        pos: "noun",
        pronunciation_vi: "JA-lur A-man",
        pronunciation_en: "JA-loor A-man",
      },
      {
        cell_id: "b0818612-8e19-4d4e-a37d-321a5ef57b28",
        word: "pengembalian",
        en: "return process",
        vi: "việc trả lại",
        pos: "noun",
        pronunciation_vi: "pe-ngem-BA-li-an",
        pronunciation_en: "peh-ngem-BA-lee-an",
      },
      {
        cell_id: "6c759e63-7935-4e01-a987-4ef3a99b9b7a",
        word: "rem depan",
        en: "front brake",
        vi: "phanh trước",
        pos: "noun",
        pronunciation_vi: "rem DE-pan",
        pronunciation_en: "rem DEH-pan",
      },
      {
        cell_id: "a9e68e0c-cc74-49fc-9f10-dc25efc0912f",
        word: "baterai habis",
        en: "battery is empty",
        vi: "hết pin",
        pos: "phrase",
        pronunciation_vi: "ba-te-RAI HA-bis",
        pronunciation_en: "ba-teh-RAI HA-bis",
      },
    ],
    dialogue: [
      {
        cell_id: "a895e89a-c200-4a86-85bb-7a949c136151",
        speaker: "Penyewa",
        text: "Selamat pagi, saya mau sewa sepeda selama dua jam.",
        vi: "Chào buổi sáng, tôi muốn thuê xe đạp trong hai giờ.",
        en: "Good morning, I would like to rent a bicycle for two hours.",
      },
      {
        cell_id: "da2af63c-199f-4087-ac04-a680945e1ec8",
        speaker: "Petugas rental",
        text: "Bisa. Harga sewanya lima puluh ribu, dan deposit seratus ribu.",
        vi: "Được. Giá thuê là năm mươi nghìn, và tiền cọc một trăm nghìn.",
        en: "Sure. The rental price is fifty thousand, and the deposit is one hundred thousand.",
      },
      {
        cell_id: "fdfde8ac-48dd-40af-9c6d-66254d5a0719",
        speaker: "Penyewa",
        text: "Apakah helm sudah termasuk dalam harga sewa?",
        vi: "Mũ bảo hiểm đã bao gồm trong giá thuê chưa?",
        en: "Is the helmet included in the rental price?",
      },
      {
        cell_id: "9e0af530-4136-41a2-815b-f9c857fb7800",
        speaker: "Petugas rental",
        text: "Sudah termasuk. Tolong cek kondisi sepeda sebelum berangkat.",
        vi: "Đã bao gồm. Vui lòng kiểm tra tình trạng xe đạp trước khi đi.",
        en: "It is included. Please check the bike's condition before leaving.",
      },
      {
        cell_id: "53b01832-7442-45d6-9b7a-d7951da28c00",
        speaker: "Penyewa",
        text: "Rem depan agak longgar. Apakah masih aman?",
        vi: "Phanh trước hơi lỏng. Còn an toàn không?",
        en: "The front brake is a bit loose. Is it still safe?",
      },
      {
        cell_id: "d74bc451-ea7d-4f10-8eea-8e6e6cb8cf61",
        speaker: "Petugas rental",
        text: "Saya ganti dengan sepeda lain. Pengembaliannya di tempat yang sama.",
        vi: "Tôi đổi sang xe đạp khác. Việc trả xe ở cùng một chỗ.",
        en: "I will replace it with another bicycle. Return it at the same place.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn thuê xe đạp trong hai giờ.",
        prompt_en: "Translate into Indonesian: I want to rent a bicycle for two hours.",
        answer: "Saya mau sewa sepeda selama dua jam.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya perlu meninggalkan ___ berapa?",
        prompt_en: "Fill in the blank: Saya perlu meninggalkan ___ berapa?",
        answer: "deposit",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi hỏi tuyến an toàn cho người mới?",
        prompt_en: "Which sentence is most natural for asking a safe route for beginners?",
        options: [
          "Jalur aman untuk pemula lewat mana?",
          "Jalan aman mana saya?",
          "Aman pemula di mana jalan?",
        ],
        answer: "Jalur aman untuk pemula lewat mana?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["sewa skuter", "thuê skuter"],
          ["durasi sewa", "thời lượng thuê"],
          ["pengembalian", "việc trả lại"],
        ],
      },
    ],
    content:
      "Use this lesson for practical bike and scooter rentals: asking rental prices and duration, checking helmets and deposits, documenting damage, asking safe routes, extending rental time, and returning the vehicle clearly.",
  },
];
