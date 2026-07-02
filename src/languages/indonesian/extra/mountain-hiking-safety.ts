// Mountain Hiking Safety Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_mountain_hiking_safety",
    level: "B1",
    category: "travel",
    title_vi: "An toàn khi leo núi ở Indonesia",
    title_en: "Mountain hiking safety in Indonesia",
    sentences: [
      {
        en: "Kami mau naik gunung besok pagi.",
        vi: "Chúng tôi muốn leo núi sáng mai.",
        pronunciation_focus: [
          "KA-mi mau NAIK GU-nung BE-sok PA-gi -- `naik gunung` = leo núi/đi trekking lên núi.",
          "Lỗi người Việt: dịch từng chữ `mendaki gunung` luôn đúng nhưng trang trọng hơn; nói thường ngày rất hay dùng `naik gunung`.",
          "Luyện: `Kami mau naik gunung besok pagi.`",
        ],
        pronunciation_focus_en: [
          "KA-mi mau NAIK GU-nung BE-sok PA-gi -- `naik gunung` = hike/climb a mountain.",
          "VN-speaker trap: `mendaki gunung` is correct but more formal; everyday speech often uses `naik gunung`.",
          "Drill: `Kami mau naik gunung besok pagi.`",
        ],
      },
      {
        en: "Jalur pendakian mana yang paling aman?",
        vi: "Tuyến đường leo núi nào an toàn nhất?",
        pronunciation_focus: [
          "JA-lur pen-da-KI-an MA-na yang PA-ling A-man -- `jalur pendakian` = tuyến đường leo núi; `paling aman` = an toàn nhất.",
          "`yang paling + tính từ` = nhất: `paling aman`, `paling dekat`, `paling sulit`.",
          "Luyện: `Jalur pendakian mana yang paling aman?`",
        ],
        pronunciation_focus_en: [
          "JA-lur pen-da-KEE-an MA-na yang PA-ling A-man -- `jalur pendakian` = hiking trail; `paling aman` = safest.",
          "`Yang paling + adjective` = the most: `paling aman`, `paling dekat`, `paling sulit`.",
          "Drill: `Jalur pendakian mana yang paling aman?`",
        ],
      },
      {
        en: "Kami harus daftar di pos registrasi dulu.",
        vi: "Chúng tôi phải đăng ký ở trạm đăng ký trước.",
        pronunciation_focus: [
          "KA-mi HA-rus DAF-tar di pos re-gis-TRA-si DU-lu -- `pos registrasi` = trạm đăng ký; `dulu` = trước đã.",
          "Mẹo an toàn: nhiều núi yêu cầu đăng ký, ghi số người, tuyến đi, và giờ dự kiến turun.",
          "Luyện: `Kami harus daftar di pos registrasi.`",
        ],
        pronunciation_focus_en: [
          "KA-mi HA-rus DAF-tar di pos re-gis-TRA-si DOO-loo -- `pos registrasi` = registration post; `dulu` = first.",
          "Safety tip: many mountains require registration, group size, route, and expected descent time.",
          "Drill: `Kami harus daftar di pos registrasi.`",
        ],
      },
      {
        en: "Apakah perlu sewa porter untuk membawa logistik?",
        vi: "Có cần thuê porter để mang đồ hậu cần không?",
        pronunciation_focus: [
          "a-pa-KAH per-LU SE-wa POR-ter UN-tuk mem-BA-wa lo-GIS-tik -- `porter` = người khuân đồ; `logistik` = đồ tiếp tế/hậu cần.",
          "`perlu sewa... ?` = có cần thuê không; dùng cho `porter`, `tenda`, `alat masak`.",
          "Luyện: `Perlu sewa porter?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH per-LOO SE-wa POR-ter OON-tuk mem-BA-wa lo-GIS-tik -- `porter` = porter; `logistik` = supplies/logistics.",
          "`Perlu sewa... ?` = do we need to rent/hire; useful for `porter`, `tenda`, `alat masak`.",
          "Drill: `Perlu sewa porter?`",
        ],
      },
      {
        en: "Cuaca di puncak sangat dingin malam hari.",
        vi: "Thời tiết trên đỉnh rất lạnh vào ban đêm.",
        pronunciation_focus: [
          "CU-a-ca di PUN-cak SA-ngat DI-ngin MA-lam HA-ri -- `cuaca` = thời tiết; `puncak` = đỉnh; `dingin` = lạnh.",
          "Lỗi người Việt: đọc `cuaca` như 'kuaka'. Chữ `c` Indonesia = 'ch': CHU-a-cha.",
          "Luyện: `Cuaca di puncak sangat dingin.`",
        ],
        pronunciation_focus_en: [
          "CHU-a-cha di PUN-chak SA-ngat DI-ngin MA-lam HA-ri -- `cuaca` = weather; `puncak` = summit; `dingin` = cold.",
          "VN-speaker trap: reading `cuaca` with a k sound. Indonesian `c` = 'ch': CHU-a-cha.",
          "Drill: `Cuaca di puncak sangat dingin.`",
        ],
      },
      {
        en: "Tenda harus dipasang sebelum gelap.",
        vi: "Lều phải được dựng trước khi trời tối.",
        pronunciation_focus: [
          "TEN-da HA-rus di-PA-sang se-BE-lum GE-lap -- `tenda` = lều; `dipasang` = được dựng/lắp; `gelap` = tối.",
          "Bị động `di-` rất tự nhiên trong hướng dẫn an toàn: `dipasang`, `dibawa`, `diperiksa`.",
          "Luyện: `Tenda harus dipasang sebelum gelap.`",
        ],
        pronunciation_focus_en: [
          "TEN-da HA-rus di-PA-sang se-BE-lum GE-lap -- `tenda` = tent; `dipasang` = set up; `gelap` = dark.",
          "Passive `di-` is natural in safety instructions: `dipasang`, `dibawa`, `diperiksa`.",
          "Drill: `Tenda harus dipasang sebelum gelap.`",
        ],
      },
      {
        en: "Kami tersesat dan tidak menemukan jalur.",
        vi: "Chúng tôi bị lạc và không tìm thấy đường mòn.",
        pronunciation_focus: [
          "KA-mi ter-SE-sat dan TI-dak me-ne-MU-kan JA-lur -- `tersesat` = bị lạc; `jalur` = đường/tuyến.",
          "Lỗi người Việt: bỏ `ter-`. `Sesat` là sai/lạc; trạng thái bị lạc là `tersesat`.",
          "Luyện: `Kami tersesat.`",
        ],
        pronunciation_focus_en: [
          "KA-mi ter-SE-sat dan TI-dak me-ne-MOO-kan JA-lur -- `tersesat` = lost; `jalur` = route/trail.",
          "VN-speaker trap: dropping `ter-`. `Sesat` means wrong/astray; the state of being lost is `tersesat`.",
          "Drill: `Kami tersesat.`",
        ],
      },
      {
        en: "Tolong hubungi petugas pos kalau kami belum turun.",
        vi: "Làm ơn liên hệ nhân viên trạm nếu chúng tôi chưa xuống núi.",
        pronunciation_focus: [
          "TO-long hu-BUNG-i pe-TU-gas pos KA-lau KA-mi be-LUM TU-run -- `hubungi` = liên hệ; `belum turun` = chưa xuống.",
          "`belum` = chưa, khác `tidak` = không. Trong an toàn leo núi, `belum turun` là tín hiệu cần kiểm tra.",
          "Luyện: `Hubungi petugas pos kalau kami belum turun.`",
        ],
        pronunciation_focus_en: [
          "TO-long hu-BOONG-i pe-TOO-gas pos KA-lau KA-mi be-LUM TOO-run -- `hubungi` = contact; `belum turun` = have not descended yet.",
          "`Belum` = not yet, different from `tidak` = not. In hiking safety, `belum turun` is a check-in warning.",
          "Drill: `Hubungi petugas pos kalau kami belum turun.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Leo núi ở Indonesia rất phổ biến, nhất là các núi lửa như Rinjani, Semeru, Merbabu, Prau, Bromo. Nhiều tuyến yêu cầu đăng ký ở `pos registrasi`, trả phí, và ghi rencana pendakian. Thời tiết trên núi có thể lạnh và thay đổi nhanh dù dưới chân núi nóng. Hãy mang logistik đủ, áo ấm, đèn, nước, P3K, và luôn báo rute serta waktu turun kepada petugas atau teman.",
    cultural_notes_en:
      "Mountain hiking is popular in Indonesia, especially volcanoes such as Rinjani, Semeru, Merbabu, Prau, and Bromo. Many trails require registration at a `pos registrasi`, a fee, and a hiking plan. Summit weather can be cold and change quickly even when the base is hot. Bring enough supplies, warm clothes, a light, water, first aid, and always tell the post or a friend your route and descent time.",
    tip_advice_vi:
      "Mẹo cho người Việt: các cụm sống còn là `naik gunung`, `jalur pendakian`, `pos registrasi`, `sewa porter`, `cuaca dingin`, `pasang tenda`, `logistik`, `tersesat`. Khi cần giúp, nói ngắn: `Kami tersesat`, `Kami butuh bantuan`, `Tolong hubungi petugas pos`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: survival chunks are `naik gunung`, `jalur pendakian`, `pos registrasi`, `sewa porter`, `cuaca dingin`, `pasang tenda`, `logistik`, `tersesat`. When you need help, keep it short: `Kami tersesat`, `Kami butuh bantuan`, `Tolong hubungi petugas pos`.",
    vocabulary: [
      {
        word: "naik gunung",
        en: "go mountain hiking",
        vi: "leo núi",
        pos: "verb phrase",
        pronunciation_vi: "NAIK GU-nung",
        pronunciation_en: "NAIK GU-noong",
      },
      {
        word: "jalur pendakian",
        en: "hiking trail",
        vi: "tuyến đường leo núi",
        pos: "noun phrase",
        pronunciation_vi: "JA-lur pen-da-KI-an",
        pronunciation_en: "JA-lur pen-da-KEE-an",
      },
      {
        word: "pos registrasi",
        en: "registration post",
        vi: "trạm đăng ký",
        pos: "noun phrase",
        pronunciation_vi: "pos re-gis-TRA-si",
        pronunciation_en: "pos re-gis-TRA-see",
      },
      {
        word: "porter",
        en: "porter",
        vi: "người khuân đồ",
        pos: "noun",
        pronunciation_vi: "POR-ter",
        pronunciation_en: "POR-ter",
      },
      {
        word: "cuaca dingin",
        en: "cold weather",
        vi: "thời tiết lạnh",
        pos: "noun phrase",
        pronunciation_vi: "CU-a-ca DI-ngin",
        pronunciation_en: "CHU-a-cha DI-ngin",
      },
      {
        word: "tenda",
        en: "tent",
        vi: "lều",
        pos: "noun",
        pronunciation_vi: "TEN-da",
        pronunciation_en: "TEN-da",
      },
      {
        word: "logistik",
        en: "supplies / logistics",
        vi: "đồ hậu cần / tiếp tế",
        pos: "noun",
        pronunciation_vi: "lo-GIS-tik",
        pronunciation_en: "lo-GIS-tik",
      },
      {
        word: "tersesat",
        en: "lost",
        vi: "bị lạc",
        pos: "verb / adjective",
        pronunciation_vi: "ter-SE-sat",
        pronunciation_en: "ter-SE-sat",
      },
      {
        word: "puncak",
        en: "summit",
        vi: "đỉnh núi",
        pos: "noun",
        pronunciation_vi: "PUN-cak",
        pronunciation_en: "PUN-chak",
      },
      {
        word: "turun",
        en: "descend / go down",
        vi: "xuống núi / đi xuống",
        pos: "verb",
        pronunciation_vi: "TU-run",
        pronunciation_en: "TOO-run",
      },
    ],
    dialogue: [
      {
        speaker: "Pendaki",
        text: "Pak, kami mau daftar naik gunung.",
        vi: "Chú ơi, chúng tôi muốn đăng ký leo núi.",
        en: "Sir, we want to register for hiking.",
      },
      {
        speaker: "Petugas pos",
        text: "Lewat jalur mana, dan berapa orang?",
        vi: "Đi theo tuyến nào, và bao nhiêu người?",
        en: "Which route, and how many people?",
      },
      {
        speaker: "Pendaki",
        text: "Lewat jalur utama, empat orang. Apakah perlu porter?",
        vi: "Theo tuyến chính, bốn người. Có cần porter không?",
        en: "Via the main trail, four people. Do we need a porter?",
      },
      {
        speaker: "Petugas pos",
        text: "Kalau logistik banyak, lebih baik sewa porter.",
        vi: "Nếu nhiều đồ hậu cần, tốt hơn nên thuê porter.",
        en: "If you have many supplies, it is better to hire a porter.",
      },
      {
        speaker: "Pendaki",
        text: "Baik. Kalau kami belum turun besok siang, tolong hubungi nomor ini.",
        vi: "Vâng. Nếu trưa mai chúng tôi chưa xuống, xin liên hệ số này.",
        en: "Okay. If we have not descended by tomorrow noon, please contact this number.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Chúng tôi bị lạc và cần giúp đỡ.",
        prompt_en: "Translate into Indonesian: We are lost and need help.",
        answer: "Kami tersesat dan butuh bantuan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kami harus daftar di pos ____ dulu.",
        prompt_en: "Fill in the blank: Kami harus daftar di pos ____ dulu.",
        answer: "registrasi",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["jalur pendakian", "tuyến đường leo núi / hiking trail"],
          ["tenda", "lều / tent"],
          ["tersesat", "bị lạc / lost"],
          ["logistik", "đồ hậu cần / supplies"],
        ],
      },
    ],
    content:
      "Useful hiking-safety chunks: `Kami mau naik gunung` (we want to hike), `Jalur mana yang paling aman?` (which trail is safest?), `Kami harus daftar di pos registrasi` (we must register at the post), `Tenda harus dipasang sebelum gelap` (the tent must be set up before dark), `Kami tersesat` (we are lost), and `Tolong hubungi petugas pos` (please contact the post officer).",
  },
];
