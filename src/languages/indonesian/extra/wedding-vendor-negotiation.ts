// Wedding vendor negotiation Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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
    id: "indonesian_wedding_vendor_negotiation",
    level: "B1",
    category: "wedding",
    title_vi: "Mặc cả với vendor đám cưới",
    title_en: "Wedding vendor negotiation",
    sentences: [
      {
        en: "Saya sedang membandingkan paket harga dari beberapa vendor.",
        vi: "Tôi đang so sánh gói giá từ vài nhà cung cấp dịch vụ.",
        pronunciation_focus: [
          "mem-ban-DING-kan pa-ket HAR-ga = so sánh; `paket harga` là gói giá trọn bộ.",
          "`beberapa vendor` = vài vendor/nhà cung cấp; từ `vendor` được dùng rất nhiều trong dịch vụ cưới.",
          "Lỗi người Việt: nói `banding harga` theo kiểu tiếng Việt. Dạng đúng là `membandingkan`.",
        ],
        pronunciation_focus_en: [
          "`membandingkan` means compare; `paket harga` is a price package.",
          "`beberapa vendor` = several vendors/providers; `vendor` is widely used in wedding services.",
          "VN-speaker trap: saying `banding harga` like Vietnamese. The correct verb is `membandingkan`.",
        ],
      },
      {
        en: "Apakah paket ini sudah termasuk katering dan dekorasi?",
        vi: "Gói này đã bao gồm phục vụ ăn uống và trang trí chưa?",
        pronunciation_focus: [
          "A-pa-kah pa-KET I-ni SU-dah ter-MASuk ka-TER-ing dan de-ko-RA-si - `termasuk` = bao gồm.",
          "`katering` và `dekorasi` thường được hỏi cùng lúc khi chọn gói cưới.",
          "Lỗi người Việt: hỏi `include` nửa Anh nửa Indo. Hỏi tự nhiên là `sudah termasuk...`.",
        ],
        pronunciation_focus_en: [
          "Is this package already included with catering and decoration?",
          "`katering` and `dekorasi` are often asked together when choosing a wedding package.",
          "VN-speaker trap: mixing in English `include`. Natural Indonesian is `sudah termasuk...`.",
        ],
      },
      {
        en: "Kami ingin biaya DP yang tidak terlalu besar.",
        vi: "Chúng tôi muốn khoản đặt cọc không quá lớn.",
        pronunciation_focus: [
          "`biaya DP` = tiền đặt cọc/tiền cọc đầu; DP thường rút gọn từ down payment.",
          "`tidak terlalu besar` = không quá lớn; cách nói mềm khi thương lượng.",
          "Lỗi người Việt: dùng `deposit` cho mọi khoản cọc. Ở đây vendor thường nói `DP`.",
        ],
        pronunciation_focus_en: [
          "`biaya DP` = down payment / deposit amount; DP is a common abbreviation.",
          "`tidak terlalu besar` = not too large; a softer negotiation phrase.",
          "VN-speaker trap: using `deposit` for every deposit. In vendor talk, people often say `DP`.",
        ],
      },
      {
        en: "Kalau kami ambil paket lengkap, apakah ada diskon?",
        vi: "Nếu chúng tôi lấy gói trọn bộ, có giảm giá không?",
        pronunciation_focus: [
          "`ambil paket lengkap` = chọn/lấy gói đầy đủ; `lengkap` = trọn bộ.",
          "`apakah ada diskon` là khung lịch sự khi hỏi giảm giá.",
          "Lỗi người Việt: hỏi `murah?` quá ngắn. Hỏi đầy đủ hơn là `apakah ada diskon?`.",
        ],
        pronunciation_focus_en: [
          "`ambil paket lengkap` = take the full package; `lengkap` = complete.",
          "`apakah ada diskon` is a polite discount question.",
          "VN-speaker trap: using just `murah?` which is too short. A fuller question is `apakah ada diskon?`.",
        ],
      },
      {
        en: "Fotografernya bisa datang dari acara akad sampai resepsi?",
        vi: "Nhiếp ảnh gia có thể đến từ lễ akad đến tiệc cưới không?",
        pronunciation_focus: [
          "`fotografernya` = nhiếp ảnh gia của gói này; `dari ... sampai ...` = từ ... đến ...",
          "`akad` là nghi lễ chính, `resepsi` là tiệc đón khách sau đó.",
          "Lỗi người Việt: dịch `acara` thành `event` trong câu này. `Acara` ở đây là `lễ/chuỗi sự kiện`.",
        ],
        pronunciation_focus_en: [
          "`fotografernya` = the photographer for this package; `dari ... sampai ...` = from ... to ...",
          "`akad` is the core ceremony, while `resepsi` is the reception after it.",
          "VN-speaker trap: translating `acara` as English `event` inside the sentence. Here it means the ceremony/event sequence.",
        ],
      },
      {
        en: "Kami ingin revisi pesanan warna bunga.",
        vi: "Chúng tôi muốn sửa lại đơn hàng về màu hoa.",
        pronunciation_focus: [
          "`revisi pesanan` = sửa đơn; `warna bunga` = màu hoa.",
          "`revisi` nghe chuyên nghiệp hơn `ganti-ganti` khi nói về thay đổi đơn đặt dịch vụ.",
          "Lỗi người Việt: dùng `edit` thay cho `revisi`. Với đơn hàng, từ tự nhiên là `revisi`.",
        ],
        pronunciation_focus_en: [
          "`revisi pesanan` = order revision; `warna bunga` = flower color.",
          "`revisi` sounds more professional than `ganti-ganti` for service-order changes.",
          "VN-speaker trap: using `edit` for revisions. For orders, the natural term is `revisi`.",
        ],
      },
      {
        en: "Berapa lama waktu persiapan sebelum acara dimulai?",
        vi: "Cần bao lâu để chuẩn bị trước khi chương trình bắt đầu?",
        pronunciation_focus: [
          "`waktu persiapan` = thời gian chuẩn bị; `sebelum acara dimulai` = trước khi sự kiện bắt đầu.",
          "`dimulai` là bị động từ `mulai`; hay dùng để hỏi lịch trình.",
          "Lỗi người Việt: hỏi `siap kapan?` ngắn quá. Hỏi rõ là `berapa lama waktu persiapan...`.",
        ],
        pronunciation_focus_en: [
          "`waktu persiapan` = preparation time; `sebelum acara dimulai` = before the event starts.",
          "`dimulai` is the passive form of `mulai`; common for schedule questions.",
          "VN-speaker trap: asking too bluntly `siap kapan?`. Ask clearly: `berapa lama waktu persiapan...`.",
        ],
      },
      {
        en: "Kami perlu jadwal acara yang lebih jelas.",
        vi: "Chúng tôi cần lịch trình chương trình rõ hơn.",
        pronunciation_focus: [
          "`jadwal acara` = lịch trình sự kiện; `lebih jelas` = rõ hơn.",
          "`lebih jelas` giúp yêu cầu nhà cung cấp gửi timeline chi tiết, không mơ hồ.",
          "Lỗi người Việt: nói `agenda`. Từ này có thể hiểu, nhưng trong dịch vụ cưới `jadwal acara` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`jadwal acara` = event schedule; `lebih jelas` = clearer/more detailed.",
          "`lebih jelas` asks the vendor for a more detailed timeline instead of vague wording.",
          "VN-speaker trap: using `agenda`. It may be understood, but `jadwal acara` is more natural in wedding services.",
        ],
      },
      {
        en: "Kalau ada perubahan, tolong kabari kami secepatnya.",
        vi: "Nếu có thay đổi, vui lòng báo cho chúng tôi càng sớm càng tốt.",
        pronunciation_focus: [
          "`kalau ada perubahan` = nếu có thay đổi; `secepatnya` = càng sớm càng tốt.",
          "`kabari` là dạng nói thường, rất tự nhiên với vendor atau teman kerja.",
          "Lỗi người Việt: dùng câu quá cứng như `beri informasi`. `Kabari kami` mềm và tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`kalau ada perubahan` = if there are changes; `secepatnya` = as soon as possible.",
          "`kabari` is casual and very natural with vendors or coworkers.",
          "VN-speaker trap: using a stiff `beri informasi`. `Kabari kami` is softer and more natural.",
        ],
      },
      {
        en: "Mari kita sepakati harga dan isi paketnya dulu.",
        vi: "Hãy thống nhất giá và nội dung gói trước đã.",
        pronunciation_focus: [
          "`sepakati` = thống nhất/chốt lại; `isi paketnya` = nội dung trong gói.",
          "`dulu` ở cuối câu làm câu nghe mềm hơn: trước hết chốt giá, rồi mới bàn tiếp.",
          "Lỗi người Việt: dịch từng chữ `agree price`. Câu tự nhiên là `mari kita sepakati harga...`.",
        ],
        pronunciation_focus_en: [
          "`sepakati` = agree on / settle; `isi paketnya` = package contents.",
          "`dulu` at the end softens the sentence: first settle the price, then discuss more.",
          "VN-speaker trap: translating literally `agree price`. Natural Indonesian is `mari kita sepakati harga...`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong đàm phán dịch vụ cưới ở Indonesia, người ta thường hỏi rõ isi paket, DP, revisi pesanan, jadwal acara, dan apakah ada diskon kalau ambil paket lengkap. Giao tiếp lịch sự, ngắn gọn, và cụ thể thường hiệu quả hơn nói vòng vo. Vendor cưới có thể là katering, dekorasi, fotografer, MC, make-up artist, hoặc penyewa gedung.",
    cultural_notes_en:
      "In Indonesian wedding-service negotiation, people usually ask clearly about package contents, DP, order revisions, event schedules, and whether there is a discount for taking the full package. Polite, short, and specific communication is often more effective than speaking around the issue. Wedding vendors may include catering, decoration, photographers, MCs, make-up artists, or venue rentals.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi hỏi giá, dùng `Apakah ada diskon?`, `Kami ingin paket lengkap`, `Berapa DP-nya?`, và `Kapan revisi pesanan terakhir?` Từ `bisa` hỏi khả năng, còn `boleh` hỏi phép/được cho phép, nên `Boleh revisi pesanan?` nghe tự nhiên hơn trong thương lượng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when asking about price, use `Apakah ada diskon?`, `Kami ingin paket lengkap`, `Berapa DP-nya?`, and `Kapan revisi pesanan terakhir?` `Bisa` asks about ability, while `boleh` asks permission, so `Boleh revisi pesanan?` sounds natural in negotiation.",
    vocabulary: [
      {
        word: "vendor",
        en: "vendor; service provider",
        vi: "nhà cung cấp dịch vụ",
        pos: "noun",
        pronunciation_vi: "VEN-dor",
        pronunciation_en: "VEN-dor",
      },
      {
        word: "katering",
        en: "catering",
        vi: "dịch vụ ăn uống",
        pos: "noun",
        pronunciation_vi: "ka-TER-ing",
        pronunciation_en: "ka-TER-ing",
      },
      {
        word: "dekorasi",
        en: "decoration",
        vi: "trang trí",
        pos: "noun",
        pronunciation_vi: "de-ko-RA-si",
        pronunciation_en: "deh-ko-RA-see",
      },
      {
        word: "fotografer",
        en: "photographer",
        vi: "nhiếp ảnh gia",
        pos: "noun",
        pronunciation_vi: "fo-to-GRA-fer",
        pronunciation_en: "fo-to-GRA-fer",
      },
      {
        word: "paket harga",
        en: "price package",
        vi: "gói giá",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket HAR-ga",
        pronunciation_en: "PA-ket HAR-ga",
      },
      {
        word: "DP",
        en: "down payment; deposit",
        vi: "khoản đặt cọc",
        pos: "noun abbreviation",
        pronunciation_vi: "de-pe",
        pronunciation_en: "dee-PEE",
      },
      {
        word: "revisi pesanan",
        en: "order revision",
        vi: "sửa đơn hàng",
        pos: "noun phrase",
        pronunciation_vi: "re-vi-SI pe-SA-nan",
        pronunciation_en: "reh-vee-SEE peh-SA-nan",
      },
      {
        word: "jadwal acara",
        en: "event schedule",
        vi: "lịch trình sự kiện",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal A-ca-ra",
        pronunciation_en: "JAD-wal A-cha-ra",
      },
      {
        word: "diskon",
        en: "discount",
        vi: "giảm giá",
        pos: "noun",
        pronunciation_vi: "DIS-kon",
        pronunciation_en: "DIS-kon",
      },
      {
        word: "isi paket",
        en: "package contents",
        vi: "nội dung gói",
        pos: "noun phrase",
        pronunciation_vi: "I-si PA-ket",
        pronunciation_en: "EE-see PA-ket",
      },
    ],
    dialogue: [
      {
        speaker: "Calon Pengantin",
        text: "Kami sedang membandingkan paket harga dari beberapa vendor.",
        vi: "Chúng tôi đang so sánh gói giá từ vài nhà cung cấp.",
        en: "We are comparing the price packages from several vendors.",
      },
      {
        speaker: "Vendor",
        text: "Baik. Paket ini sudah termasuk katering, dekorasi, dan fotografer.",
        vi: "Vâng. Gói này đã bao gồm catering, trang trí, và nhiếp ảnh gia.",
        en: "Sure. This package already includes catering, decoration, and a photographer.",
      },
      {
        speaker: "Calon Pengantin",
        text: "Kalau kami ambil paket lengkap, apakah ada diskon?",
        vi: "Nếu chúng tôi lấy gói trọn bộ, có giảm giá không?",
        en: "If we take the full package, is there a discount?",
      },
      {
        speaker: "Vendor",
        text: "Ada, dan DP-nya bisa dibayar dua tahap.",
        vi: "Có, và tiền đặt cọc có thể trả làm hai đợt.",
        en: "Yes, and the down payment can be paid in two stages.",
      },
      {
        speaker: "Calon Pengantin",
        text: "Kami ingin revisi pesanan warna bunga sebelum jadwal acara final.",
        vi: "Chúng tôi muốn sửa đơn về màu hoa trước lịch trình cuối cùng.",
        en: "We want to revise the flower color order before the final event schedule.",
      },
      {
        speaker: "Vendor",
        text: "Tentu, silakan kirim revisinya secepatnya supaya kami bisa menyesuaikan.",
        vi: "Dĩ nhiên, vui lòng gửi bản sửa sớm để chúng tôi có thể điều chỉnh.",
        en: "Of course, please send the revision as soon as possible so we can adjust it.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Nếu chúng tôi lấy gói trọn bộ, có giảm giá không?'",
        answer: "Kalau kami ambil paket lengkap, apakah ada diskon?",
        explanation_vi: "Dung cau hoi lich su ve giam gia voi `apakah ada diskon`.",
        explanation_en: "Use a polite discount question with `apakah ada diskon`.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: Apakah paket ini sudah termasuk katering dan ____?",
        answer: "dekorasi",
        explanation_vi: "Keterangan goi cuoi hay di cap `katering dan dekorasi`.",
        explanation_en: "Wedding packages often pair `katering dan dekorasi`.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi xin sua don hang?",
        answer: "Boleh revisi pesanan?",
        explanation_vi: "Boleh hoi phep/duoc cho phep, nghe mem hon `bisa`.",
        explanation_en: "`Boleh` asks permission and sounds softer than `bisa`.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai co dau chu re va vendor, noi ve DP, diskon, revisi, va jadwal acara.",
        answer: "Kami ingin paket lengkap. Berapa DP-nya? Apakah ada diskon? Kapan revisi pesanan terakhir? Kami juga perlu jadwal acara yang jelas.",
        explanation_vi: "Dung nhieu cau ngan, ro, va lich su.",
        explanation_en: "Use short, clear, and polite sentences.",
      },
    ],
  },
];
