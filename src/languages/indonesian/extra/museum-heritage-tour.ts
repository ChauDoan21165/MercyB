// Museum & Heritage Tour Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

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
    id: "indonesian_museum_heritage_tour",
    level: "A2",
    category: "travel",
    title_vi: "Tham quan bảo tàng và di sản văn hóa",
    title_en: "Museum and heritage tours",
    sentences: [
      {
        en: "Saya mau berkunjung ke museum sejarah.",
        vi: "Tôi muốn tham quan bảo tàng lịch sử.",
        pronunciation_focus: [
          "SA-ya MAU ber-KUN-jung ke mu-SE-um se-JA-rah - `berkunjung` = thăm/tham quan; `museum sejarah` = bảo tàng lịch sử.",
          "Lỗi người Việt: dùng `mengunjungi ke`. Chọn một: `berkunjung ke museum` hoặc `mengunjungi museum`.",
          "Luyện: `Saya mau berkunjung ke museum sejarah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU ber-KUN-joong ke mu-SE-um se-JA-rah - `berkunjung` = visit; `museum sejarah` = history museum.",
          "VN-speaker trap: saying `mengunjungi ke`. Choose one: `berkunjung ke museum` or `mengunjungi museum`.",
          "Drill: `Saya mau berkunjung ke museum sejarah.`",
        ],
      },
      {
        en: "Apakah bangunan ini termasuk cagar budaya?",
        vi: "Tòa nhà này có thuộc diện di sản văn hóa được bảo tồn không?",
        pronunciation_focus: [
          "a-pa-KAH ba-NGU-nan I-ni ter-MA-suk CA-gar bu-DA-ya - `cagar budaya` = di sản văn hóa được bảo vệ; `termasuk` = thuộc/bao gồm.",
          "Lỗi người Việt: đọc `cagar` như ka-gar. Chữ `c` tiếng Indonesia = 'ch': CHA-gar.",
          "Luyện: `Apakah bangunan ini termasuk cagar budaya?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH ba-NGU-nan I-ni ter-MA-suk CHA-gar bu-DA-ya - `cagar budaya` = protected cultural heritage; `termasuk` = included/classified as.",
          "VN-speaker trap: reading `cagar` as ka-gar. Indonesian `c` = 'ch': CHA-gar.",
          "Drill: `Apakah bangunan ini termasuk cagar budaya?`",
        ],
      },
      {
        en: "Kami ingin ikut tur dengan pemandu.",
        vi: "Chúng tôi muốn tham gia tour có hướng dẫn viên.",
        pronunciation_focus: [
          "KA-mi I-ngin I-kut tur de-NGAN pe-MAN-du - `pemandu` = người hướng dẫn; `ikut tur` = tham gia tour.",
          "Lỗi người Việt: dùng `kita` khi nói với nhân viên. Nếu không bao gồm người nghe, dùng `kami`.",
          "Luyện: `Kami ingin ikut tur dengan pemandu.`",
        ],
        pronunciation_focus_en: [
          "KA-mi I-ngin I-kut tour de-NGAN pe-MAN-doo - `pemandu` = guide; `ikut tur` = join a tour.",
          "VN-speaker trap: using `kita` with staff. If the listener is not included, use `kami`.",
          "Drill: `Kami ingin ikut tur dengan pemandu.`",
        ],
      },
      {
        en: "Berapa harga tiket masuk untuk rombongan?",
        vi: "Giá vé vào cửa cho đoàn là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga TI-ket MA-suk un-TUK rom-BONG-an - `tiket masuk` = vé vào cửa; `rombongan` = đoàn/nhóm đi chung.",
          "Lỗi người Việt: nói `tiket masuk harga berapa`. Câu tự nhiên hơn là `berapa harga tiket masuk`.",
          "Luyện: `Berapa harga tiket masuk untuk rombongan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga TI-ket MA-suk un-TUK rom-BONG-an - `tiket masuk` = entrance ticket; `rombongan` = group.",
          "VN-speaker trap: saying `tiket masuk harga berapa`. More natural: `berapa harga tiket masuk`.",
          "Drill: `Berapa harga tiket masuk untuk rombongan?`",
        ],
      },
      {
        en: "Pameran ini tentang sejarah lokal.",
        vi: "Triển lãm này nói về lịch sử địa phương.",
        pronunciation_focus: [
          "pa-ME-ran I-ni ten-TANG se-JA-rah LO-kal - `pameran` = triển lãm; `sejarah lokal` = lịch sử địa phương.",
          "Lỗi người Việt: dùng `cerita lokal` cho lịch sử. `Sejarah lokal` là cụm chuẩn hơn trong bảo tàng.",
          "Luyện: `Pameran ini tentang sejarah lokal.`",
        ],
        pronunciation_focus_en: [
          "pa-ME-ran I-ni ten-TANG se-JA-rah LO-kal - `pameran` = exhibition; `sejarah lokal` = local history.",
          "VN-speaker trap: using `cerita lokal` for history. `Sejarah lokal` is the standard museum phrase.",
          "Drill: `Pameran ini tentang sejarah lokal.`",
        ],
      },
      {
        en: "Apakah boleh mengambil foto di dalam museum?",
        vi: "Có được chụp ảnh trong bảo tàng không?",
        pronunciation_focus: [
          "a-pa-KAH BO-leh me-NGAM-bil FO-to di DA-lam mu-SE-um - `boleh` = được phép; `mengambil foto` = chụp ảnh.",
          "Lỗi người Việt: dùng `bisa` khi hỏi phép. `Bisa` = có thể; `boleh` = được phép.",
          "Luyện: `Apakah boleh mengambil foto di dalam museum?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH BO-leh me-NGAM-bil FO-to di DA-lam mu-SE-um - `boleh` = allowed/may; `mengambil foto` = take photos.",
          "VN-speaker trap: using `bisa` when asking permission. `Bisa` = able to; `boleh` = allowed to.",
          "Drill: `Apakah boleh mengambil foto di dalam museum?`",
        ],
      },
      {
        en: "Aturan foto di ruangan ini berbeda.",
        vi: "Quy định chụp ảnh trong phòng này khác.",
        pronunciation_focus: [
          "a-TU-ran FO-to di ru-A-ngan I-ni ber-BE-da - `aturan foto` = quy định chụp ảnh; `berbeda` = khác.",
          "Lỗi người Việt: dịch `luật ảnh`. Trong nơi tham quan, dùng `aturan foto` hoặc `peraturan foto`.",
          "Luyện: `Aturan foto di ruangan ini berbeda.`",
        ],
        pronunciation_focus_en: [
          "a-TU-ran FO-to di ru-A-ngan I-ni ber-BE-da - `aturan foto` = photo rules; `berbeda` = different.",
          "VN-speaker trap: translating 'photo law'. At visitor sites, use `aturan foto` or `peraturan foto`.",
          "Drill: `Aturan foto di ruangan ini berbeda.`",
        ],
      },
      {
        en: "Tolong jangan menyentuh koleksi museum.",
        vi: "Xin đừng chạm vào hiện vật/sưu tập của bảo tàng.",
        pronunciation_focus: [
          "TO-long JA-ngan me-NYEN-tuh ko-LEK-si mu-SE-um - `jangan` = đừng; `menyentuh` = chạm; `koleksi` = bộ sưu tập/hiện vật.",
          "Lỗi người Việt: dùng `tidak` để cấm. Cấm/lệnh đừng làm dùng `jangan`, không dùng `tidak`.",
          "Luyện: `Tolong jangan menyentuh koleksi museum.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan me-NYEN-tooh ko-LEK-see mu-SE-um - `jangan` = don't; `menyentuh` = touch; `koleksi` = collection/artifacts.",
          "VN-speaker trap: using `tidak` for prohibition. For 'don't', use `jangan`, not `tidak`.",
          "Drill: `Tolong jangan menyentuh koleksi museum.`",
        ],
      },
      {
        en: "Rombongan sekolah akan datang jam sepuluh.",
        vi: "Đoàn học sinh sẽ đến lúc mười giờ.",
        pronunciation_focus: [
          "rom-BONG-an se-KO-lah A-kan DA-tang jam se-PU-luh - `rombongan sekolah` = đoàn trường học; `akan` = sẽ.",
          "Lỗi người Việt: đặt `sekolah rombongan`. Danh từ chính đứng trước: `rombongan sekolah`.",
          "Luyện: `Rombongan sekolah akan datang jam sepuluh.`",
        ],
        pronunciation_focus_en: [
          "rom-BONG-an se-KO-lah A-kan DA-tang jam se-PU-luh - `rombongan sekolah` = school group; `akan` = will.",
          "VN-speaker trap: saying `sekolah rombongan`. Head noun first: `rombongan sekolah`.",
          "Drill: `Rombongan sekolah akan datang jam sepuluh.`",
        ],
      },
      {
        en: "Pemandu menjelaskan makna benda bersejarah ini.",
        vi: "Hướng dẫn viên giải thích ý nghĩa của hiện vật lịch sử này.",
        pronunciation_focus: [
          "pe-MAN-du men-je-LAS-kan MAK-na BEN-da ber-se-JA-rah I-ni - `menjelaskan` = giải thích; `benda bersejarah` = hiện vật lịch sử.",
          "Lỗi người Việt: nói `barang sejarah`. Cụm trang trọng hơn trong bảo tàng là `benda bersejarah`.",
          "Luyện: `Pemandu menjelaskan makna benda bersejarah ini.`",
        ],
        pronunciation_focus_en: [
          "pe-MAN-doo men-je-LAS-kan MAK-na BEN-da ber-se-JA-rah I-ni - `menjelaskan` = explain; `benda bersejarah` = historical object/artifact.",
          "VN-speaker trap: saying `barang sejarah`. In museums, the more formal phrase is `benda bersejarah`.",
          "Drill: `Pemandu menjelaskan makna benda bersejarah ini.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có rất nhiều `museum`, di tích và `cagar budaya`, từ bảo tàng quốc gia đến bảo tàng địa phương, cung điện, đền, nhà cổ và khu phố lịch sử. Ở nhiều nơi, giá `tiket masuk` có thể khác cho khách nội địa, khách quốc tế, sinh viên hoặc `rombongan`. Quy định chụp ảnh thay đổi theo phòng: có nơi được chụp không flash, có nơi cấm hoàn toàn. Khi đi cùng `pemandu`, nên nghe hướng dẫn về lối đi, trang phục, khu vực cấm và cách tôn trọng hiện vật.",
    cultural_notes_en:
      "Indonesia has many museums, historical sites, and protected `cagar budaya`, from national museums to local museums, palaces, temples, old houses, and historic neighborhoods. At many places, `tiket masuk` may differ for domestic visitors, international visitors, students, or groups. Photo rules vary by room: some allow no-flash photos, others prohibit photography entirely. With a `pemandu`, follow guidance about routes, clothing, restricted areas, and respecting artifacts.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong bảo tàng, học theo cụm: `tiket masuk`, `cagar budaya`, `pameran sejarah lokal`, `aturan foto`, `rombongan`, `pemandu`. Khi hỏi phép, dùng `boleh`: `Apakah boleh mengambil foto?`. Khi nói vị trí, `di dalam museum` = bên trong bảo tàng; khi nói đi tới, dùng `ke museum`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn museum chunks: `tiket masuk`, `cagar budaya`, `pameran sejarah lokal`, `aturan foto`, `rombongan`, `pemandu`. For permission, use `boleh`: `Apakah boleh mengambil foto?`. For location, `di dalam museum` = inside the museum; for movement, use `ke museum`.",
    vocabulary: [
      {
        cell_id: "336cf9d8-8014-48a8-87e3-1aaa9b746c22",
        word: "museum",
        en: "museum",
        vi: "bảo tàng",
        pos: "noun",
        pronunciation_vi: "mu-SE-um",
        pronunciation_en: "moo-SEH-um",
      },
      {
        cell_id: "1572ba3b-d9f5-4ee1-b024-3a281edffe69",
        word: "cagar budaya",
        en: "protected cultural heritage",
        vi: "di sản văn hóa được bảo tồn",
        pos: "noun phrase",
        pronunciation_vi: "CHA-gar bu-DA-ya",
        pronunciation_en: "CHA-gar boo-DA-ya",
      },
      {
        cell_id: "b2341326-045a-4e2c-b360-f5cc2ce99091",
        word: "pemandu",
        en: "guide",
        vi: "hướng dẫn viên",
        pos: "noun",
        pronunciation_vi: "pe-MAN-du",
        pronunciation_en: "pe-MAN-doo",
      },
      {
        cell_id: "8b4dc6e2-29e6-4004-9054-a6c69f188619",
        word: "tiket masuk",
        en: "entrance ticket",
        vi: "vé vào cửa",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket MA-suk",
        pronunciation_en: "TEE-ket MAH-sook",
      },
      {
        cell_id: "d24aa62e-1539-494f-b1d9-f0958d852332",
        word: "pameran",
        en: "exhibition",
        vi: "triển lãm",
        pos: "noun",
        pronunciation_vi: "pa-ME-ran",
        pronunciation_en: "pa-MEH-ran",
      },
      {
        cell_id: "6bc06a8a-78d8-4809-9661-7db57ad326c6",
        word: "sejarah lokal",
        en: "local history",
        vi: "lịch sử địa phương",
        pos: "noun phrase",
        pronunciation_vi: "se-JA-rah LO-kal",
        pronunciation_en: "se-JAH-rah LO-kal",
      },
      {
        cell_id: "54a25624-a02e-4e2e-a379-1135d6e23c58",
        word: "aturan foto",
        en: "photo rules",
        vi: "quy định chụp ảnh",
        pos: "noun phrase",
        pronunciation_vi: "a-TU-ran FO-to",
        pronunciation_en: "a-TOO-ran FO-to",
      },
      {
        cell_id: "71bb6db7-bc74-4156-9cee-a61e10c47729",
        word: "rombongan",
        en: "group",
        vi: "đoàn / nhóm đi chung",
        pos: "noun",
        pronunciation_vi: "rom-BONG-an",
        pronunciation_en: "rom-BONG-an",
      },
      {
        cell_id: "41277ccd-187f-4de0-82f5-87a5f0344958",
        word: "benda bersejarah",
        en: "historical artifact/object",
        vi: "hiện vật lịch sử",
        pos: "noun phrase",
        pronunciation_vi: "BEN-da ber-se-JA-rah",
        pronunciation_en: "BEN-da ber-se-JAH-rah",
      },
      {
        cell_id: "963bc673-e084-474a-9be3-a5c5fbe550b1",
        word: "koleksi museum",
        en: "museum collection",
        vi: "bộ sưu tập/hiện vật bảo tàng",
        pos: "noun phrase",
        pronunciation_vi: "ko-LEK-si mu-SE-um",
        pronunciation_en: "ko-LEK-see moo-SEH-um",
      },
    ],
    dialogue: [
      {
        cell_id: "dcffbaf8-f4c6-4d9c-a287-4c834085f993",
        speaker: "Pengunjung",
        text: "Selamat pagi. Berapa harga tiket masuk untuk rombongan?",
        vi: "Chào buổi sáng. Giá vé vào cửa cho đoàn là bao nhiêu?",
        en: "Good morning. How much is the entrance ticket for a group?",
      },
      {
        cell_id: "2b34e698-3d63-47fe-ab6a-f4d33e529b95",
        speaker: "Petugas",
        text: "Untuk rombongan, ada diskon. Mau ikut tur dengan pemandu?",
        vi: "Với đoàn thì có giảm giá. Có muốn tham gia tour với hướng dẫn viên không?",
        en: "For a group, there is a discount. Do you want to join a guided tour?",
      },
      {
        cell_id: "477621f6-0b1c-451d-ab7b-db52edc14172",
        speaker: "Pengunjung",
        text: "Iya, kami ingin belajar tentang sejarah lokal.",
        vi: "Vâng, chúng tôi muốn học về lịch sử địa phương.",
        en: "Yes, we want to learn about local history.",
      },
      {
        cell_id: "6515fccc-c23f-4c3e-84f4-0a3228ffbcc6",
        speaker: "Petugas",
        text: "Baik. Di beberapa ruangan, foto tidak boleh pakai flash.",
        vi: "Được. Ở một số phòng, chụp ảnh không được dùng flash.",
        en: "Okay. In some rooms, photos may not use flash.",
      },
      {
        cell_id: "577dd400-cb12-402a-978c-726b5467fc28",
        speaker: "Pengunjung",
        text: "Baik, kami akan mengikuti aturan museum.",
        vi: "Vâng, chúng tôi sẽ tuân theo quy định của bảo tàng.",
        en: "Okay, we will follow the museum rules.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Berapa harga tiket ____ untuk rombongan?`",
        prompt_en: "Fill in the blank: `Berapa harga tiket ____ untuk rombongan?`",
        answer: "masuk",
        explanation_vi: "`tiket masuk` = vé vào cửa.",
        explanation_en: "`tiket masuk` = entrance ticket.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Cagar budaya` nghĩa là gì?",
        prompt_en: "What does `cagar budaya` mean?",
        choices: ["di sản văn hóa được bảo tồn", "quầy bán vé", "đoàn học sinh"],
        answer: "di sản văn hóa được bảo tồn",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Có được chụp ảnh trong bảo tàng không?`",
        prompt_en: "Translate into Indonesian: `May we take photos inside the museum?`",
        answer: "Apakah boleh mengambil foto di dalam museum?",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm tham quan.",
        prompt_en: "Match the museum-tour phrases correctly.",
        pairs: [
          ["pemandu", "guide / hướng dẫn viên"],
          ["pameran", "exhibition / triển lãm"],
          ["rombongan", "group / đoàn"],
        ],
      },
    ],
  },
];
