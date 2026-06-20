// Furniture delivery and assembly Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 34 file. Covers beli furnitur, pengiriman, rakit lemari, meja, kursi,
// ongkos kirim, barang rusak, and jadwal teknisi.
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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

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
    id: "indonesian_furniture_delivery_assembly",
    level: "A2",
    category: "shopping_home",
    title_vi: "Mua nội thất, giao hàng và lắp ráp",
    title_en: "Furniture delivery and assembly",
    sentences: [
      {
        en: "Saya mau beli furnitur untuk kamar kos saya.",
        vi: "Tôi muốn mua nội thất cho phòng trọ của tôi.",
        pronunciation_focus: [
          "SA-ya mau be-LI fur-ni-TUR UN-tuk KA-mar KOS SA-ya - `furnitur` = nội thất/đồ nội thất; `kamar kos` = phòng trọ.",
          "`mau beli` là cách nói tự nhiên, rất thường nghe trong mua sắm hằng ngày.",
          "Lỗi người Việt: dịch `furniture` theo số nhiều. Trong Indonesia, `furnitur` dùng như danh từ chung.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau be-LEE foor-nee-TOOR OON-took KA-mar KOS SA-ya - `furnitur` = furniture; `kamar kos` = boarding room.",
          "`Mau beli` is a natural everyday shopping phrase.",
          "VN-speaker trap: forcing an English plural feeling onto `furniture`. In Indonesian, `furnitur` is a general noun.",
        ],
      },
      {
        en: "Toko ini bisa kirim ke rumah saya?",
        vi: "Cửa hàng này có thể giao đến nhà tôi không?",
        pronunciation_focus: [
          "TO-ko I-ni BI-sa KI-rim ke RU-mah SA-ya - `kirim` = gửi/giao; `ke rumah saya` = đến nhà tôi.",
          "`bisa` hỏi khả năng dịch vụ, không nhất thiết là phép cho cá nhân.",
          "Lỗi người Việt: nói `antar ke rumah` được, nhưng ở cửa hàng `kirim` rất phổ biến.",
        ],
        pronunciation_focus_en: [
          "TOH-ko EE-nee BEE-sa KEE-rim keh ROO-mah SA-ya - `kirim` = send/deliver; `ke rumah saya` = to my house.",
          "`Bisa` asks whether the service is available, not necessarily personal permission.",
          "VN-speaker trap: `antar ke rumah` is possible, but in stores `kirim` is very common.",
        ],
      },
      {
        en: "Berapa ongkos kirim dan ongkos rakitnya?",
        vi: "Phí giao hàng và phí lắp ráp là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa ONG-kos KI-rim dan ONG-kos RA-kit-nya - `ongkos kirim` = phí giao hàng; `ongkos rakit` = phí lắp ráp.",
          "`ongkos` là chi phí/cước. Ở Indonesia, cụm này nghe rất tự nhiên trong mua bán.",
          "Lỗi người Việt: hỏi `harga delivery` trộn tiếng Anh. Tự nhiên hơn: `ongkos kirim`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ONG-kos KEE-rim dan ONG-kos RA-kit-nya - `ongkos kirim` = shipping fee; `ongkos rakit` = assembly fee.",
          "`Ongkos` means cost/fare. In Indonesia this sounds very natural in shopping contexts.",
          "VN-speaker trap: mixing in `harga delivery`. More natural: `ongkos kirim`.",
        ],
      },
      {
        en: "Saya pesan lemari, meja, dan dua kursi.",
        vi: "Tôi đặt mua tủ, bàn và hai ghế.",
        pronunciation_focus: [
          "SA-ya pe-SAN le-MA-ri me-JA dan DU-a KUR-si - `lemari` = tủ; `meja` = bàn; `kursi` = ghế.",
          "`pesan` = đặt mua/đặt hàng. Dùng khi mua qua toko online hoặc chat penjual.",
          "Lỗi người Việt: `order` hiểu được, nhưng `pesan` là từ Indonesia tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya pe-SAN leh-MA-ree MEH-ja dan DOO-a KOOR-see - `lemari` = wardrobe/cabinet; `meja` = table; `kursi` = chair.",
          "`Pesan` = order. Use it when buying through an online store or chatting with a seller.",
          "VN-speaker trap: `order` is understood, but `pesan` is more natural Indonesian.",
        ],
      },
      {
        en: "Apakah rakit lemari termasuk dalam harga?",
        vi: "Lắp ráp tủ đã bao gồm trong giá chưa?",
        pronunciation_focus: [
          "a-PA-kah RA-kit le-MA-ri ter-MA-suk DA-lam HAR-ga - `rakit lemari` = lắp ráp tủ; `termasuk` = bao gồm.",
          "`rakit` là động từ ghép rất thường nghe với furnitur. Có thể nói `rakit meja` hoặc `rakit kursi`.",
          "Lỗi người Việt: dùng `assemble` trộn tiếng Anh. Từ tự nhiên là `rakit`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah RA-kit leh-MA-ree ter-MA-sook DA-lam HAR-ga - `rakit lemari` = assemble a wardrobe/cabinet; `termasuk` = included.",
          "`Rakit` is a very common verb with furniture. You can say `rakit meja` or `rakit kursi`.",
          "VN-speaker trap: mixing in English `assemble`. The natural Indonesian word is `rakit`.",
        ],
      },
      {
        en: "Saya ingin jadwal teknisi untuk besok pagi.",
        vi: "Tôi muốn lịch kỹ thuật viên vào sáng mai.",
        pronunciation_focus: [
          "SA-ya I-ngin JAD-wal tek-NI-si UN-tuk be-SOK PA-gi - `jadwal teknisi` = lịch kỹ thuật viên; `besok pagi` = sáng mai.",
          "`teknisi` = kỹ thuật viên/thợ lắp đặt. Dùng cho người đến lắp ráp hoặc sửa chữa.",
          "Lỗi người Việt: nói `schedule teknisi`. Trong Indonesia, `jadwal` là từ đúng.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin JAD-wal tek-NEE-see OON-took beh-SOK PA-gee - `jadwal teknisi` = technician schedule; `besok pagi` = tomorrow morning.",
          "`Teknisi` = technician/install worker. Use it for the person who comes to assemble or repair.",
          "VN-speaker trap: saying `schedule teknisi`. In Indonesian, `jadwal` is the right word.",
        ],
      },
      {
        en: "Barangnya boleh ditinggal di lobi dulu?",
        vi: "Hàng hóa có thể để ở sảnh trước không?",
        pronunciation_focus: [
          "BA-rang-nya BO-leh di-TING-gal di LO-bi DU-lu - `ditinggal` = được để lại; `lobi` = sảnh.",
          "`dulu` ở cuối làm câu nhẹ hơn: để tạm trước đã.",
          "Lỗi người Việt: nói `leave barang` trộn tiếng Anh. Nói `ditinggal` hoặc `ditaruh` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "BA-rang-nya BO-leh dee-TING-gal dee LOH-bee DOO-loo - `ditinggal` = left/kept temporarily; `lobi` = lobby.",
          "`Dulu` at the end softens the request: leave it temporarily first.",
          "VN-speaker trap: mixing in English `leave barang`. Use `ditinggal` or `ditaruh` instead.",
        ],
      },
      {
        en: "Kalau ada barang rusak, tolong foto dulu sebelum dibawa.",
        vi: "Nếu có món nào bị hỏng, làm ơn chụp ảnh trước khi mang đi.",
        pronunciation_focus: [
          "KA-lau A-da BA-rang RU-sak, TO-long FO-to DU-lu se-BE-lum di-BA-wa - `barang rusak` = đồ bị hỏng; `foto dulu` = chụp ảnh trước.",
          "`sebelum dibawa` = trước khi được mang đi. Đây là hướng dẫn quan trọng cho kiểm tra hàng.",
          "Lỗi người Việt: chỉ nói `foto`. Trong tình huống khiếu nại, thêm `dulu` và `sebelum` để rất rõ.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da BA-rang ROO-sak, TO-long FO-to DOO-loo seh-BE-loom dee-BA-wa - `barang rusak` = damaged item; `foto dulu` = take a photo first.",
          "`Sebelum dibawa` = before it is taken away. This is important for checking items.",
          "VN-speaker note: just saying `foto` is too short. Add `dulu` and `sebelum` for clarity in complaints.",
        ],
      },
      {
        en: "Saya mau komplain kalau meja datang penyok.",
        vi: "Tôi muốn khiếu nại nếu bàn đến mà bị móp.",
        pronunciation_focus: [
          "SA-ya mau kom-PLAIN KA-lau ME-ja DA-tang PE-NYOK - `komplain` = khiếu nại; `penyok` = bị móp/bẹp.",
          "`meja datang penyok` nghe tự nhiên trong hàng hóa/hậu cần: món hàng đến với tình trạng lỗi.",
          "Lỗi người Việt: dùng `rusak` mọi lúc. Với móp nhẹ, `penyok` cụ thể hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau kom-PLAIN KA-lau MEH-ja DAH-tang PEH-NYOK - `komplain` = complain; `penyok` = dented/bent.",
          "`Meja datang penyok` sounds natural in delivery/logistics: the item arrives damaged.",
          "VN-speaker trap: using `rusak` all the time. For a dent, `penyok` is more specific.",
        ],
      },
      {
        en: "Tolong kirim teknisi lagi kalau ada bagian yang kurang pas.",
        vi: "Làm ơn cử kỹ thuật viên đến lại nếu có phần nào chưa khớp.",
        pronunciation_focus: [
          "TO-long KI-rim tek-NI-si LA-gi KA-lau A-da ba-gi-AN yang KU-rang PAS - `kurang pas` = chưa khớp/chưa vừa; `lagi` = lại.",
          "`kirim teknisi lagi` = gửi kỹ thuật viên đến lại; cụm này hợp khi yêu cầu sửa ulang.",
          "Lỗi người Việt: nói `kurang cocok` hiểu được, nhưng `kurang pas` tự nhiên hơn cho lắp ráp/bản lề.",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim tek-NEE-see LA-gee KA-lau A-da ba-gee-AN yang KOO-rang PAS - `kurang pas` = not quite fitting; `lagi` = again.",
          "`Kirim teknisi lagi` = send the technician again; useful for asking for a re-fix.",
          "VN-speaker note: `kurang cocok` is understandable, but `kurang pas` is more natural for assembly/fitting issues.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi mua furnitur ở Indonesia, người bán thường tách rõ `harga barang`, `ongkos kirim`, và `ongkos rakit`. Nếu barang datang penyok atau kurang pas saat dirakit, sebaiknya foto bukti dulu dan hubungi toko dengan bahasa sopan. Với barang besar seperti lemari atau meja, mengatur `jadwal teknisi` rất quan trọng karena pengiriman dan perakitan sering dilakukan terpisah.",
    cultural_notes_en:
      "When buying furniture in Indonesia, sellers often separate item price, shipping fee, and assembly fee. If items arrive dented or do not fit well during assembly, take photo evidence first and contact the store politely. For large items like wardrobes or tables, setting the technician schedule is important because delivery and assembly are often handled separately.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya mau beli furnitur untuk kamar kos saya. Berapa ongkos kirim dan ongkos rakitnya? Kalau ada barang rusak, tolong foto dulu sebelum dibawa. Saya ingin jadwal teknisi untuk besok pagi.`",
    tip_advice_en:
      "Safe template: `Saya mau beli furnitur untuk kamar kos saya. Berapa ongkos kirim dan ongkos rakitnya? Kalau ada barang rusak, tolong foto dulu sebelum dibawa. Saya ingin jadwal teknisi untuk besok pagi.`",
    vocabulary: [
      {
        word: "furnitur",
        en: "furniture",
        vi: "nội thất",
        pos: "noun",
        pronunciation_vi: "fur-ni-TUR",
        pronunciation_en: "foor-nee-TOOR",
      },
      {
        word: "pengiriman",
        en: "delivery/shipping",
        vi: "giao hàng/vận chuyển",
        pos: "noun",
        pronunciation_vi: "pe-ngi-RI-man",
        pronunciation_en: "peh-ngi-REE-man",
      },
      {
        word: "rakit lemari",
        en: "assemble a wardrobe/cabinet",
        vi: "lắp ráp tủ",
        pos: "verb phrase",
        pronunciation_vi: "RA-kit le-MA-ri",
        pronunciation_en: "RA-kit leh-MA-ree",
      },
      {
        word: "meja",
        en: "table",
        vi: "bàn",
        pos: "noun",
        pronunciation_vi: "ME-ja",
        pronunciation_en: "MEH-ja",
      },
      {
        word: "kursi",
        en: "chair",
        vi: "ghế",
        pos: "noun",
        pronunciation_vi: "KUR-si",
        pronunciation_en: "KOOR-see",
      },
      {
        word: "ongkos kirim",
        en: "shipping fee",
        vi: "phí giao hàng",
        pos: "noun phrase",
        pronunciation_vi: "ONG-kos KI-rim",
        pronunciation_en: "ONG-kos KEE-rim",
      },
      {
        word: "barang rusak",
        en: "damaged item",
        vi: "món hàng bị hỏng",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang RU-sak",
        pronunciation_en: "BA-rang ROO-sak",
      },
      {
        word: "penyok",
        en: "dented; bent",
        vi: "bị móp",
        pos: "adjective",
        pronunciation_vi: "PE-nyok",
        pronunciation_en: "PEH-nyok",
      },
      {
        word: "jadwal teknisi",
        en: "technician schedule",
        vi: "lịch kỹ thuật viên",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal tek-NI-si",
        pronunciation_en: "JAD-wal tek-NEE-see",
      },
      {
        word: "kurang pas",
        en: "not quite fitting",
        vi: "chưa khớp/chưa vừa",
        pos: "phrase",
        pronunciation_vi: "KU-rang PAS",
        pronunciation_en: "KOO-rang PAS",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Saya mau beli furnitur untuk kamar kos saya.",
        vi: "Tôi muốn mua nội thất cho phòng trọ của tôi.",
        en: "I want to buy furniture for my boarding room.",
      },
      {
        speaker: "Penjual",
        text: "Baik, kami bisa kirim besok sore.",
        vi: "Được, chúng tôi có thể giao vào chiều mai.",
        en: "Sure, we can deliver tomorrow afternoon.",
      },
      {
        speaker: "Pembeli",
        text: "Berapa ongkos kirim dan ongkos rakitnya?",
        vi: "Phí giao hàng và phí lắp ráp là bao nhiêu?",
        en: "How much are the shipping and assembly fees?",
      },
      {
        speaker: "Penjual",
        text: "Kalau ada barang rusak, tolong foto dulu sebelum dibawa.",
        vi: "Nếu có hàng bị hỏng, làm ơn chụp ảnh trước khi mang đi.",
        en: "If there is a damaged item, please take a photo first before it is taken away.",
      },
      {
        speaker: "Pembeli",
        text: "Saya ingin jadwal teknisi untuk besok pagi.",
        vi: "Tôi muốn lịch kỹ thuật viên vào sáng mai.",
        en: "I want a technician schedule for tomorrow morning.",
      },
      {
        speaker: "Penjual",
        text: "Baik, kami catat nomor pesanan Anda.",
        vi: "Được, chúng tôi ghi lại số đơn hàng của bạn.",
        en: "All right, we will note your order number.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn mua nội thất cho phòng trọ của tôi.",
        prompt_en: "Translate into Indonesian: I want to buy furniture for my boarding room.",
        answer: "Saya mau beli furnitur untuk kamar kos saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Berapa ___ kirim dan ongkos rakitnya?",
        prompt_en: "Fill in the blank: Berapa ___ kirim dan ongkos rakitnya?",
        answer: "ongkos",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi hỏi hàng bị móp?",
        prompt_en: "Which sentence is most natural when asking about a dented item?",
        options: [
          "Kalau ada barang rusak, tolong foto dulu sebelum dibawa.",
          "Kalau barang sakit, ambil foto cepat.",
          "Barang ini rusak saya mau foto nanti saja.",
        ],
        answer: "Kalau ada barang rusak, tolong foto dulu sebelum dibawa.",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["ongkos kirim", "phí giao hàng"],
          ["rakit lemari", "lắp ráp tủ"],
          ["jadwal teknisi", "lịch kỹ thuật viên"],
        ],
      },
    ],
    content:
      "Use this lesson for practical furniture buying: asking delivery and assembly fees, scheduling technicians, checking for damaged or dented items, and keeping the tone polite during complaints or rescheduling.",
  },
];
