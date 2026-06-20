// Skin allergy clinic Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 28 file. Covers alergi kulit, gatal, ruam, salep, dokter kulit,
// sabun, makanan pemicu, and kontrol ulang.
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
    id: "indonesian_clinic_skin_allergy",
    level: "A2",
    category: "health",
    title_vi: "Khám dị ứng da ở phòng khám",
    title_en: "Skin allergy clinic visit",
    sentences: [
      {
        en: "Saya mau periksa alergi kulit.",
        vi: "Tôi muốn khám dị ứng da.",
        pronunciation_focus: [
          "SA-ya mau pe-RIK-sa a-LER-gi KU-lit - `periksa` = khám/kiểm tra; `alergi kulit` = dị ứng da.",
          "`kulit` = da. Trong phòng khám, nói `periksa alergi kulit` rõ hơn chỉ nói `sakit kulit`.",
          "Lỗi người Việt: nói `alergi di kulit saya` được hiểu, nhưng cụm bệnh tự nhiên là `alergi kulit`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau pe-RIK-sa a-LER-gee KOO-lit - `periksa` = check/examine; `alergi kulit` = skin allergy.",
          "`kulit` = skin. At a clinic, `periksa alergi kulit` is clearer than only `sakit kulit`.",
          "VN-speaker note: `alergi di kulit saya` can be understood, but the natural condition phrase is `alergi kulit`.",
        ],
      },
      {
        en: "Kulit saya gatal sejak kemarin malam.",
        vi: "Da tôi bị ngứa từ tối qua.",
        pronunciation_focus: [
          "KU-lit SA-ya GA-tal se-JAK ke-MA-rin MA-lam - `gatal` = ngứa; `sejak` = từ khi/từ.",
          "`sejak kemarin malam` cho bác sĩ biết thời điểm bắt đầu triệu chứng.",
          "Lỗi người Việt: dịch 'ngứa' thành `sakit`. `Sakit` = đau/bệnh; `gatal` = ngứa.",
        ],
        pronunciation_focus_en: [
          "KOO-lit SA-ya GA-tal seh-JAK keh-MA-rin MA-lam - `gatal` = itchy; `sejak` = since.",
          "`sejak kemarin malam` tells the doctor when the symptom started.",
          "VN-speaker trap: translating 'itchy' as `sakit`. `Sakit` = painful/sick; `gatal` = itchy.",
        ],
      },
      {
        en: "Ada ruam merah di tangan dan leher.",
        vi: "Có phát ban đỏ ở tay và cổ.",
        pronunciation_focus: [
          "A-da RU-am ME-rah di TA-ngan dan LE-her - `ruam merah` = phát ban đỏ; `leher` = cổ.",
          "`di tangan dan leher` dùng `di` vì nói vị trí trên cơ thể.",
          "Lỗi người Việt: nói `merah-merah` được trong nói thường, nhưng ở phòng khám `ruam merah` chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "A-da ROO-am MEH-rah dee TA-ngan dan LEH-her - `ruam merah` = red rash; `leher` = neck.",
          "`di tangan dan leher` uses `di` because it states location on the body.",
          "VN-speaker note: `merah-merah` works casually, but at a clinic `ruam merah` is more precise.",
        ],
      },
      {
        en: "Ruamnya makin melebar setelah saya garuk.",
        vi: "Vết phát ban lan rộng hơn sau khi tôi gãi.",
        pronunciation_focus: [
          "RU-am-nya MA-kin me-LE-bar se-TE-lah SA-ya GA-ruk - `makin melebar` = ngày càng lan rộng; `garuk` = gãi.",
          "`-nya` trong `ruamnya` chỉ vết phát ban đang nói tới.",
          "Lỗi người Việt: dùng `gores` cho gãi. `Gores` = cào/xước; `garuk` = gãi vì ngứa.",
        ],
        pronunciation_focus_en: [
          "ROO-am-nya MA-kin meh-LEH-bar seh-TEH-lah SA-ya GA-rook - `makin melebar` = getting wider/spreading; `garuk` = scratch.",
          "`-nya` in `ruamnya` points to the rash being discussed.",
          "VN-speaker trap: using `gores` for scratching an itch. `Gores` = scrape; `garuk` = scratch because of itch.",
        ],
      },
      {
        en: "Saya ingin bertemu dokter kulit kalau ada.",
        vi: "Tôi muốn gặp bác sĩ da liễu nếu có.",
        pronunciation_focus: [
          "SA-ya I-ngin ber-TE-mu DOK-ter KU-lit KA-lau A-da - `dokter kulit` = bác sĩ da liễu; `kalau ada` = nếu có.",
          "`dokter kulit` là cách nói phổ biến; dạng đầy đủ hơn là `dokter spesialis kulit`.",
          "Lỗi người Việt: dịch từng chữ 'da liễu' khó nhớ. Trong nói thường, cứ dùng `dokter kulit`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin ber-TEH-moo DOK-ter KOO-lit KA-lau A-da - `dokter kulit` = dermatologist; `kalau ada` = if available.",
          "`dokter kulit` is common; the fuller form is `dokter spesialis kulit`.",
          "VN-speaker note: instead of searching for a formal dermatology term, use everyday `dokter kulit`.",
        ],
      },
      {
        en: "Apakah saya perlu salep atau obat minum?",
        vi: "Tôi có cần thuốc mỡ bôi hay thuốc uống không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya PER-lu SA-lep A-tau O-bat MI-num - `salep` = thuốc mỡ/kem bôi; `obat minum` = thuốc uống.",
          "`obat minum` phân biệt với thuốc bôi ngoài da như `salep`.",
          "Lỗi người Việt: gọi mọi thuốc là `obat`. Khi hỏi da liễu, tách rõ `salep` và `obat minum`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya PER-loo SA-lep A-tau O-bat MEE-noom - `salep` = ointment/cream; `obat minum` = oral medicine.",
          "`obat minum` distinguishes oral medicine from skin medicine like `salep`.",
          "VN-speaker note: avoid calling everything simply `obat`. In dermatology, separate `salep` and `obat minum`.",
        ],
      },
      {
        en: "Salep ini dipakai berapa kali sehari?",
        vi: "Thuốc bôi này dùng mấy lần một ngày?",
        pronunciation_focus: [
          "SA-lep I-ni di-PA-kai be-RA-pa KA-li se-HA-ri - `dipakai` = được dùng/bôi; `berapa kali sehari` = mấy lần một ngày.",
          "Với thuốc bôi, `dipakai` hoặc `dioleskan` đều tự nhiên; `dioleskan` trang trọng hơn.",
          "Lỗi người Việt: hỏi `minum salep` là sai vì salep là thuốc bôi, không uống.",
        ],
        pronunciation_focus_en: [
          "SA-lep EE-nee dee-PA-kai be-RA-pa KA-lee seh-HA-ree - `dipakai` = used/applied; `berapa kali sehari` = how many times per day.",
          "For ointment, both `dipakai` and `dioleskan` are natural; `dioleskan` is more formal.",
          "VN-speaker trap: asking `minum salep` is wrong because ointment is applied, not drunk.",
        ],
      },
      {
        en: "Saya baru ganti sabun mandi minggu ini.",
        vi: "Tôi mới đổi xà phòng/sữa tắm trong tuần này.",
        pronunciation_focus: [
          "SA-ya BA-ru GAN-ti SA-bun MAN-di MING-gu I-ni - `ganti sabun` = đổi xà phòng/sữa tắm; `sabun mandi` = xà phòng/sữa tắm tắm.",
          "`baru ganti` = mới đổi gần đây. Đây là thông tin hữu ích khi tìm tác nhân gây dị ứng.",
          "Lỗi người Việt: nói `sabun badan` không tự nhiên bằng `sabun mandi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-roo GAN-tee SA-boon MAN-dee MING-goo EE-nee - `ganti sabun` = change soap/body wash; `sabun mandi` = bath soap/body wash.",
          "`baru ganti` = recently changed. This is useful when identifying possible allergy triggers.",
          "VN-speaker note: `sabun badan` is less natural than `sabun mandi`.",
        ],
      },
      {
        en: "Mungkin ada makanan pemicu alergi.",
        vi: "Có thể có thức ăn kích hoạt dị ứng.",
        pronunciation_focus: [
          "MUNG-kin A-da ma-KA-nan pe-MI-cu a-LER-gi - `makanan pemicu` = thức ăn gây/kích hoạt; `mungkin` = có thể.",
          "`pemicu` là tác nhân kích hoạt, không nhất thiết là nguyên nhân duy nhất.",
          "Lỗi người Việt: nói `makanan penyebab` nghe quá chắc nếu chưa biết. `Pemicu` mềm và chính xác hơn khi nghi ngờ.",
        ],
        pronunciation_focus_en: [
          "MOONG-kin A-da ma-KA-nan peh-MEE-choo a-LER-gee - `makanan pemicu` = triggering food; `mungkin` = maybe.",
          "`pemicu` means trigger, not necessarily the only cause.",
          "VN-speaker note: `makanan penyebab` sounds too certain if not confirmed. `Pemicu` is softer and more accurate for suspicion.",
        ],
      },
      {
        en: "Saya makan udang sebelum ruamnya muncul.",
        vi: "Tôi đã ăn tôm trước khi vết phát ban xuất hiện.",
        pronunciation_focus: [
          "SA-ya MA-kan U-dang se-BE-lum RU-am-nya MUN-cul - `udang` = tôm; `muncul` = xuất hiện.",
          "`sebelum ruamnya muncul` đặt thứ tự thời gian rõ ràng cho bác sĩ.",
          "Lỗi người Việt: nói `ruam keluar` được hiểu nhưng `ruam muncul` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-kan OO-dang seh-BE-loom ROO-am-nya MOON-chool - `udang` = shrimp; `muncul` = appear.",
          "`sebelum ruamnya muncul` gives the doctor a clear timeline.",
          "VN-speaker note: `ruam keluar` may be understood, but `ruam muncul` is more natural.",
        ],
      },
      {
        en: "Kapan saya harus kontrol ulang?",
        vi: "Khi nào tôi phải tái khám?",
        pronunciation_focus: [
          "KA-pan SA-ya HA-rus KON-trol U-lang - `kontrol ulang` = tái khám/khám lại; `kapan` = khi nào.",
          "`kontrol` trong y tế Indonesia thường nghĩa là tái khám/theo dõi, không phải điều khiển.",
          "Lỗi người Việt: dịch 'khám lại' thành câu dài. Cụm tự nhiên là `kontrol ulang`.",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya HA-roos KON-trol OO-lang - `kontrol ulang` = follow-up visit; `kapan` = when.",
          "`kontrol` in Indonesian healthcare often means follow-up/checkup, not control.",
          "VN-speaker trap: translating 're-check' into a long phrase. The natural phrase is `kontrol ulang`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở phòng khám Indonesia, hãy mô tả dị ứng da bằng triệu chứng cụ thể: `gatal`, `ruam merah`, vị trí trên cơ thể, thời điểm bắt đầu, và những thay đổi gần đây như `ganti sabun` hoặc ăn món nghi ngờ là `makanan pemicu`. Nếu cần chuyên khoa, hỏi `dokter kulit` hoặc `dokter spesialis kulit`. Với thuốc bôi, hỏi rõ cách dùng, số lần mỗi ngày, và lịch `kontrol ulang`.",
    cultural_notes_en:
      "At an Indonesian clinic, describe a skin allergy with concrete symptoms: itching, red rash, body location, when it started, and recent changes such as changing soap or eating a suspected triggering food. If you need a specialist, ask for `dokter kulit` or `dokter spesialis kulit`. For ointment, clarify how to apply it, how many times per day, and the follow-up schedule.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya mau periksa alergi kulit. Kulit saya gatal dan ada ruam merah sejak kemarin. Saya baru ganti sabun mandi, dan saya makan udang sebelum ruamnya muncul. Apakah saya perlu salep, dan kapan kontrol ulang?`",
    tip_advice_en:
      "Safe template: `Saya mau periksa alergi kulit. Kulit saya gatal dan ada ruam merah sejak kemarin. Saya baru ganti sabun mandi, dan saya makan udang sebelum ruamnya muncul. Apakah saya perlu salep, dan kapan kontrol ulang?`",
    vocabulary: [
      {
        word: "alergi kulit",
        en: "skin allergy",
        vi: "dị ứng da",
        pos: "noun",
        pronunciation_vi: "a-LER-gi KU-lit",
        pronunciation_en: "a-LER-gee KOO-lit",
      },
      {
        word: "gatal",
        en: "itchy",
        vi: "ngứa",
        pos: "adjective",
        pronunciation_vi: "GA-tal",
        pronunciation_en: "GA-tal",
      },
      {
        word: "ruam",
        en: "rash",
        vi: "phát ban",
        pos: "noun",
        pronunciation_vi: "RU-am",
        pronunciation_en: "ROO-am",
      },
      {
        word: "salep",
        en: "ointment",
        vi: "thuốc mỡ/kem bôi",
        pos: "noun",
        pronunciation_vi: "SA-lep",
        pronunciation_en: "SA-lep",
      },
      {
        word: "dokter kulit",
        en: "dermatologist",
        vi: "bác sĩ da liễu",
        pos: "noun",
        pronunciation_vi: "DOK-ter KU-lit",
        pronunciation_en: "DOK-ter KOO-lit",
      },
      {
        word: "sabun mandi",
        en: "bath soap; body wash",
        vi: "xà phòng/sữa tắm",
        pos: "noun",
        pronunciation_vi: "SA-bun MAN-di",
        pronunciation_en: "SA-boon MAN-dee",
      },
      {
        word: "makanan pemicu",
        en: "triggering food",
        vi: "thức ăn kích hoạt dị ứng",
        pos: "noun",
        pronunciation_vi: "ma-KA-nan pe-MI-cu",
        pronunciation_en: "ma-KA-nan peh-MEE-choo",
      },
      {
        word: "kontrol ulang",
        en: "follow-up visit",
        vi: "tái khám",
        pos: "noun",
        pronunciation_vi: "KON-trol U-lang",
        pronunciation_en: "KON-trol OO-lang",
      },
      {
        word: "dioleskan",
        en: "applied by rubbing/spreading",
        vi: "được bôi",
        pos: "verb",
        pronunciation_vi: "di-o-LES-kan",
        pronunciation_en: "dee-o-LES-kan",
      },
      {
        word: "makin melebar",
        en: "spreading wider",
        vi: "ngày càng lan rộng",
        pos: "phrase",
        pronunciation_vi: "MA-kin me-LE-bar",
        pronunciation_en: "MA-kin meh-LEH-bar",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi, saya mau periksa alergi kulit.",
        vi: "Chào buổi sáng, tôi muốn khám dị ứng da.",
        en: "Good morning, I would like to have a skin allergy checked.",
      },
      {
        speaker: "Petugas klinik",
        text: "Gejalanya apa saja?",
        vi: "Các triệu chứng là gì?",
        en: "What symptoms do you have?",
      },
      {
        speaker: "Pasien",
        text: "Kulit saya gatal dan ada ruam merah di tangan sejak kemarin malam.",
        vi: "Da tôi bị ngứa và có phát ban đỏ ở tay từ tối qua.",
        en: "My skin is itchy and there is a red rash on my hand since last night.",
      },
      {
        speaker: "Petugas klinik",
        text: "Apakah Anda baru ganti sabun atau makan sesuatu yang berbeda?",
        vi: "Bạn có mới đổi xà phòng/sữa tắm hoặc ăn thứ gì khác không?",
        en: "Did you recently change soap or eat something different?",
      },
      {
        speaker: "Pasien",
        text: "Saya baru ganti sabun mandi, dan saya makan udang sebelum ruamnya muncul.",
        vi: "Tôi mới đổi sữa tắm, và tôi ăn tôm trước khi vết phát ban xuất hiện.",
        en: "I recently changed body wash, and I ate shrimp before the rash appeared.",
      },
      {
        speaker: "Petugas klinik",
        text: "Baik, dokter akan periksa dulu dan menjelaskan cara pakai salepnya.",
        vi: "Được, bác sĩ sẽ khám trước và giải thích cách dùng thuốc bôi.",
        en: "All right, the doctor will examine you first and explain how to use the ointment.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Da tôi bị ngứa từ tối qua.",
        prompt_en: "Translate into Indonesian: My skin has been itchy since last night.",
        answer: "Kulit saya gatal sejak kemarin malam.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Apakah saya perlu ___ atau obat minum?",
        prompt_en: "Fill in the blank: Apakah saya perlu ___ atau obat minum?",
        answer: "salep",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi hỏi lịch tái khám?",
        prompt_en: "Which sentence is most natural for asking the follow-up schedule?",
        options: [
          "Kapan saya harus kontrol ulang?",
          "Kapan saya kontrol lagi penyakit?",
          "Jam apa saya ulang kulit?",
        ],
        answer: "Kapan saya harus kontrol ulang?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["alergi kulit", "dị ứng da"],
          ["ruam merah", "phát ban đỏ"],
          ["makanan pemicu", "thức ăn kích hoạt dị ứng"],
        ],
      },
    ],
    content:
      "Use this lesson for clinic conversations about skin allergy symptoms, rash location, itchiness, ointment instructions, dermatologist availability, possible soap or food triggers, and follow-up appointments.",
  },
];
