// Boarding House & Roommate Indonesian (Vietnamese -> Indonesian study track).
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
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
    id: "indonesian_boarding_house_roommate",
    level: "A2",
    category: "housing",
    title_vi: "Ở chung kos: bạn cùng phòng và việc nhà",
    title_en: "Boarding-house roommates and shared chores",
    sentences: [
      {
        en: "Saya punya teman sekamar baru.",
        vi: "Tôi có bạn cùng phòng mới.",
        pronunciation_focus: [
          "SA-ya PU-nya te-MAN se-KA-mar BA-ru - `teman sekamar` = bạn cùng phòng; `punya` = có/sở hữu.",
          "Lỗi người Việt: nói `teman kamar` vẫn hiểu, nhưng cụm tự nhiên hơn là `teman sekamar`.",
          "Luyện: `Saya punya teman sekamar baru.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya te-MAN se-KA-mar BA-ru - `teman sekamar` = roommate; `punya` = have/own.",
          "VN-speaker trap: `teman kamar` is understandable, but `teman sekamar` is more natural.",
          "Drill: `Saya punya teman sekamar baru.`",
        ],
      },
      {
        en: "Kami berbagi dapur dan kulkas.",
        vi: "Chúng tôi dùng chung bếp và tủ lạnh.",
        pronunciation_focus: [
          "KA-mi ber-BA-gi DA-pur dan KUL-kas - `berbagi` = chia sẻ/dùng chung; `dapur` = bếp; `kulkas` = tủ lạnh.",
          "Lỗi người Việt: dùng `kita` khi không bao gồm người nghe. Nói với người ngoài phòng thì dùng `kami`.",
          "Luyện: `Kami berbagi dapur dan kulkas.`",
        ],
        pronunciation_focus_en: [
          "KA-mi ber-BA-gi DA-pur dan KUL-kas - `berbagi` = share; `dapur` = kitchen; `kulkas` = refrigerator.",
          "VN-speaker trap: using `kita` when the listener is not included. Talking to someone outside the room, use `kami`.",
          "Drill: `Kami berbagi dapur dan kulkas.`",
        ],
      },
      {
        en: "Listrik bulan ini dibayar bersama.",
        vi: "Tiền điện tháng này được trả chung.",
        pronunciation_focus: [
          "LIS-trik BU-lan I-ni di-BA-yar ber-SA-ma - `listrik` = điện; `dibayar` = được trả; `bersama` = cùng nhau.",
          "Lỗi người Việt: né bị động. Với hóa đơn chung, `dibayar bersama` rất tự nhiên.",
          "Luyện: `Listrik bulan ini dibayar bersama.`",
        ],
        pronunciation_focus_en: [
          "LIS-trik BU-lan I-ni di-BA-yar ber-SA-ma - `listrik` = electricity; `dibayar` = is paid; `bersama` = together.",
          "VN-speaker trap: avoiding the passive. For shared bills, `dibayar bersama` sounds natural.",
          "Drill: `Listrik bulan ini dibayar bersama.`",
        ],
      },
      {
        en: "Giliran saya bersih-bersih kamar mandi hari ini.",
        vi: "Hôm nay đến lượt tôi dọn nhà tắm.",
        pronunciation_focus: [
          "GI-li-ran SA-ya ber-SIH-ber-SIH KA-mar MAN-di HA-ri I-ni - `giliran` = lượt; `bersih-bersih` = dọn dẹp.",
          "Lỗi người Việt: dùng `saya giliran`. Trật tự tự nhiên là `giliran saya` = đến lượt tôi.",
          "Luyện: `Giliran saya bersih-bersih kamar mandi hari ini.`",
        ],
        pronunciation_focus_en: [
          "GI-li-ran SA-ya ber-SIH-ber-SIH KA-mar MAN-di HA-ri I-ni - `giliran` = turn; `bersih-bersih` = clean/tidy up.",
          "VN-speaker trap: saying `saya giliran`. Natural order is `giliran saya` = my turn.",
          "Drill: `Giliran saya bersih-bersih kamar mandi hari ini.`",
        ],
      },
      {
        en: "Besok giliran kamu cuci piring.",
        vi: "Ngày mai đến lượt bạn rửa chén.",
        pronunciation_focus: [
          "BE-sok GI-li-ran KA-mu CU-ci PI-ring - `cuci piring` = rửa chén; `besok` = ngày mai.",
          "Lỗi người Việt: đọc `cuci` như ku-ki. Chữ `c` = 'ch': CHU-chi.",
          "Luyện: `Besok giliran kamu cuci piring.`",
        ],
        pronunciation_focus_en: [
          "BE-sok GI-li-ran KA-mu CHU-chi PI-ring - `cuci piring` = wash dishes; `besok` = tomorrow.",
          "VN-speaker trap: reading `cuci` as koo-kee. Indonesian `c` = 'ch': CHU-chi.",
          "Drill: `Besok giliran kamu cuci piring.`",
        ],
      },
      {
        en: "Boleh tamu menginap di kamar kita?",
        vi: "Khách có được ngủ lại trong phòng chúng ta không?",
        pronunciation_focus: [
          "BO-leh TA-mu me-NGI-nap di KA-mar KI-ta - `boleh` = được phép; `tamu menginap` = khách ngủ lại.",
          "Lỗi người Việt: dùng `bisa` khi hỏi phép. Luật nhà/kos dùng `boleh`, không phải `bisa`.",
          "Luyện: `Boleh tamu menginap di kamar kita?`",
        ],
        pronunciation_focus_en: [
          "BO-leh TA-mu me-NGI-nap di KA-mar KI-ta - `boleh` = allowed/may; `tamu menginap` = guest stays overnight.",
          "VN-speaker trap: using `bisa` when asking permission. House/kos rules use `boleh`, not `bisa`.",
          "Drill: `Boleh tamu menginap di kamar kita?`",
        ],
      },
      {
        en: "Tolong jangan pakai barang pribadi saya tanpa izin.",
        vi: "Làm ơn đừng dùng đồ cá nhân của tôi khi chưa xin phép.",
        pronunciation_focus: [
          "TO-long JA-ngan PA-kai BA-rang pri-BA-di SA-ya TAN-pa I-zin - `barang pribadi` = đồ cá nhân; `tanpa izin` = không có phép.",
          "Lỗi người Việt: dùng `tidak pakai` để cấm. Mệnh lệnh cấm dùng `jangan pakai`.",
          "Luyện: `Jangan pakai barang pribadi saya tanpa izin.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan PA-kai BA-rang pri-BA-di SA-ya TAN-pa I-zin - `barang pribadi` = personal belongings; `tanpa izin` = without permission.",
          "VN-speaker trap: using `tidak pakai` as a prohibition. Negative commands use `jangan pakai`.",
          "Drill: `Jangan pakai barang pribadi saya tanpa izin.`",
        ],
      },
      {
        en: "Maaf, suara musiknya agak keras.",
        vi: "Xin lỗi, tiếng nhạc hơi lớn.",
        pronunciation_focus: [
          "ma-AF, SU-a-ra MU-sik-nya A-gak KE-ras - `agak` = hơi; `keras` = lớn/to; `suaranya` = âm thanh đó.",
          "Lỗi người Việt: nói thẳng `musik keras!` nghe gắt. Thêm `maaf` và `agak` để nói nhẹ hơn.",
          "Luyện: `Maaf, suara musiknya agak keras.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SU-a-ra MU-sik-nya A-gak KE-ras - `agak` = a bit/rather; `keras` = loud; `suaranya` = the sound.",
          "VN-speaker trap: blunt `musik keras!` sounds harsh. Add `maaf` and `agak` to soften it.",
          "Drill: `Maaf, suara musiknya agak keras.`",
        ],
      },
      {
        en: "Kita bicarakan konflik kecil ini baik-baik.",
        vi: "Chúng ta nói chuyện tử tế về mâu thuẫn nhỏ này nhé.",
        pronunciation_focus: [
          "KI-ta bi-CA-ra-kan KON-flik KE-cil I-ni BAIK-baik - `konflik kecil` = mâu thuẫn nhỏ; `baik-baik` = tử tế/êm đẹp.",
          "Lỗi người Việt: dùng `kami` khi mời người nghe cùng giải quyết. Bao gồm người nghe thì dùng `kita`.",
          "Luyện: `Kita bicarakan konflik kecil ini baik-baik.`",
        ],
        pronunciation_focus_en: [
          "KI-ta bi-CHA-ra-kan KON-flik KE-chil I-ni BAIK-baik - `konflik kecil` = small conflict; `baik-baik` = calmly/properly.",
          "VN-speaker trap: using `kami` when inviting the listener to resolve it together. Including the listener uses `kita`.",
          "Drill: `Kita bicarakan konflik kecil ini baik-baik.`",
        ],
      },
      {
        en: "Kalau ada masalah, lebih baik bilang langsung.",
        vi: "Nếu có vấn đề, tốt hơn là nói trực tiếp.",
        pronunciation_focus: [
          "KA-lau A-da ma-SA-lah, LE-bih BA-ik BI-lang LANG-sung - `bilang langsung` = nói trực tiếp; `lebih baik` = tốt hơn.",
          "Lỗi người Việt: nói vòng quá dài. Câu ngắn `lebih baik bilang langsung` tự nhiên trong sinh hoạt chung.",
          "Luyện: `Kalau ada masalah, lebih baik bilang langsung.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da ma-SA-lah, LE-bih BA-ik BI-lang LANG-sung - `bilang langsung` = say it directly; `lebih baik` = better.",
          "VN-speaker trap: overexplaining. The short phrase `lebih baik bilang langsung` is natural in shared living.",
          "Drill: `Kalau ada masalah, lebih baik bilang langsung.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `kos` là mô hình phòng trọ rất phổ biến với sinh viên và người đi làm trẻ. Một số nơi có phòng riêng nhưng dùng chung `dapur`, kamar mandi, Wi-Fi hoặc khu giặt. Khi ở chung với `teman sekamar`, nên thống nhất từ đầu chuyện điện nước, lịch dọn dẹp, khách ngủ lại, đồ cá nhân và giờ yên tĩnh. Văn hóa Indonesia coi trọng hòa khí, nên khi góp ý hãy mở bằng `maaf` hoặc `tolong`, dùng `agak` để làm nhẹ lời phàn nàn, và tránh nói cộc.",
    cultural_notes_en:
      "`Kos` boarding houses are very common in Indonesia for students and young workers. Some places have private rooms but shared kitchens, bathrooms, Wi-Fi, or laundry areas. With a `teman sekamar`, agree early on electricity/water bills, cleaning turns, overnight guests, personal belongings, and quiet hours. Indonesian culture values harmony, so complaints are usually softened with `maaf` or `tolong`, `agak` makes a complaint gentler, and blunt speech is best avoided.",
    tip_advice_vi:
      "Mẹo cho người Việt: bốn mẫu sống còn khi ở chung là `giliran saya/kamu...` (đến lượt tôi/bạn), `boleh ...?` (xin phép), `jangan ... tanpa izin` (đừng ... khi chưa xin phép), và `kita bicarakan baik-baik` (mình nói chuyện tử tế). Phân biệt `kami` = chúng tôi không gồm người nghe và `kita` = chúng ta gồm người nghe.",
    tip_advice_en:
      "Tip for Vietnamese speakers: four survival patterns in shared housing are `giliran saya/kamu...` (my/your turn), `boleh ...?` (permission), `jangan ... tanpa izin` (don't ... without permission), and `kita bicarakan baik-baik` (let's talk it through calmly). Keep `kami` = we excluding the listener separate from `kita` = we including the listener.",
    vocabulary: [
      {
        word: "teman sekamar",
        en: "roommate",
        vi: "bạn cùng phòng",
        pos: "noun phrase",
        pronunciation_vi: "te-MAN se-KA-mar",
        pronunciation_en: "te-MAN se-KA-mar",
      },
      {
        word: "berbagi dapur",
        en: "share a kitchen",
        vi: "dùng chung bếp",
        pos: "verb phrase",
        pronunciation_vi: "ber-BA-gi DA-pur",
        pronunciation_en: "ber-BA-gi DA-poor",
      },
      {
        word: "bayar listrik",
        en: "pay electricity",
        vi: "trả tiền điện",
        pos: "verb phrase",
        pronunciation_vi: "BA-yar LIS-trik",
        pronunciation_en: "BA-yar LIS-trik",
      },
      {
        word: "giliran bersih-bersih",
        en: "cleaning turn",
        vi: "lượt dọn dẹp",
        pos: "noun phrase",
        pronunciation_vi: "GI-li-ran ber-SIH-ber-SIH",
        pronunciation_en: "GI-li-ran ber-SIH-ber-SIH",
      },
      {
        word: "tamu menginap",
        en: "overnight guest",
        vi: "khách ngủ lại",
        pos: "noun phrase",
        pronunciation_vi: "TA-mu me-NGI-nap",
        pronunciation_en: "TA-moo me-NGI-nap",
      },
      {
        word: "barang pribadi",
        en: "personal belongings",
        vi: "đồ cá nhân",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang pri-BA-di",
        pronunciation_en: "BA-rang pri-BA-dee",
      },
      {
        word: "tanpa izin",
        en: "without permission",
        vi: "không có phép / chưa xin phép",
        pos: "phrase",
        pronunciation_vi: "TAN-pa I-zin",
        pronunciation_en: "TAN-pa EE-zin",
      },
      {
        word: "konflik kecil",
        en: "small conflict",
        vi: "mâu thuẫn nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "KON-flik KE-chil",
        pronunciation_en: "KON-flik KE-chil",
      },
      {
        word: "baik-baik",
        en: "calmly / properly",
        vi: "tử tế / êm đẹp",
        pos: "adverb",
        pronunciation_vi: "BAIK-baik",
        pronunciation_en: "BAIK-baik",
      },
      {
        word: "bilang langsung",
        en: "say directly",
        vi: "nói trực tiếp",
        pos: "verb phrase",
        pronunciation_vi: "BI-lang LANG-sung",
        pronunciation_en: "BI-lang LANG-soong",
      },
    ],
    dialogue: [
      {
        speaker: "Linh",
        text: "Kita berbagi dapur, jadi bagaimana jadwal bersih-bersihnya?",
        vi: "Mình dùng chung bếp, vậy lịch dọn dẹp thế nào?",
        en: "We share the kitchen, so what is the cleaning schedule?",
      },
      {
        speaker: "Rani",
        text: "Hari ini giliran saya. Besok giliran kamu cuci piring.",
        vi: "Hôm nay đến lượt mình. Ngày mai đến lượt bạn rửa chén.",
        en: "Today is my turn. Tomorrow is your turn to wash dishes.",
      },
      {
        speaker: "Linh",
        text: "Baik. Untuk listrik, kita bayar bersama setiap akhir bulan?",
        vi: "Được. Về tiền điện, mình trả chung vào cuối mỗi tháng nhé?",
        en: "Okay. For electricity, do we pay together at the end of every month?",
      },
      {
        speaker: "Rani",
        text: "Iya. Satu lagi, kalau ada tamu menginap, bilang dulu, ya.",
        vi: "Ừ. Một điều nữa, nếu có khách ngủ lại thì báo trước nhé.",
        en: "Yes. One more thing: if there is an overnight guest, tell me first.",
      },
      {
        speaker: "Linh",
        text: "Setuju. Kalau ada masalah, kita bicarakan baik-baik.",
        vi: "Đồng ý. Nếu có vấn đề, mình nói chuyện tử tế nhé.",
        en: "Agreed. If there is a problem, let's talk it through calmly.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `____ saya bersih-bersih kamar mandi hari ini.`",
        prompt_en: "Fill in the blank: `____ saya bersih-bersih kamar mandi hari ini.`",
        answer: "Giliran",
        explanation_vi: "`giliran saya` = đến lượt tôi.",
        explanation_en: "`giliran saya` = my turn.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Barang pribadi` nghĩa là gì?",
        prompt_en: "What does `barang pribadi` mean?",
        choices: ["đồ cá nhân", "tiền điện", "khách ngủ lại"],
        answer: "đồ cá nhân",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Đừng dùng đồ cá nhân của tôi khi chưa xin phép.`",
        prompt_en: "Translate into Indonesian: `Do not use my personal belongings without permission.`",
        answer: "Jangan pakai barang pribadi saya tanpa izin.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm ở chung phòng.",
        prompt_en: "Match the shared-room phrases correctly.",
        pairs: [
          ["teman sekamar", "roommate / bạn cùng phòng"],
          ["tamu menginap", "overnight guest / khách ngủ lại"],
          ["giliran bersih-bersih", "cleaning turn / lượt dọn dẹp"],
        ],
      },
    ],
  },
];
