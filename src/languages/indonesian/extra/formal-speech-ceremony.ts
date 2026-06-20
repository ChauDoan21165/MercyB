// Formal Speech & Ceremony Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register/ceremony notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_formal_speech_ceremony",
    level: "B2",
    category: "formal_speaking",
    title_vi: "Phát biểu trang trọng và dẫn chương trình buổi lễ",
    title_en: "Formal speeches and ceremony remarks",
    sentences: [
      {
        en: "Yang saya hormati Bapak dan Ibu sekalian.",
        vi: "Kính thưa quý ông bà/cô chú anh chị.",
        pronunciation_focus: [
          "yang SA-ya hor-MA-ti BA-pak dan I-bu se-KA-li-an - `yang saya hormati` = kính thưa/người tôi kính trọng; `sekalian` = toàn thể.",
          "Lỗi người Việt: mở đầu bằng `halo semua` trong buổi lễ. Với sambutan resmi, dùng `Yang saya hormati...`.",
          "Luyện: `Yang saya hormati Bapak dan Ibu sekalian.`",
        ],
        pronunciation_focus_en: [
          "yang SA-ya hor-MA-ti BA-pak dan I-bu se-KA-li-an - `yang saya hormati` = respected/honored; `sekalian` = all of you.",
          "VN-speaker trap: opening with `halo semua` in a ceremony. For formal remarks, use `Yang saya hormati...`.",
          "Drill: `Yang saya hormati Bapak dan Ibu sekalian.`",
        ],
      },
      {
        en: "Para hadirin yang berbahagia, selamat pagi.",
        vi: "Kính thưa quý vị đại biểu/khách mời thân mến, chào buổi sáng.",
        pronunciation_focus: [
          "PA-ra ha-DI-rin yang ber-ba-HA-gia, se-la-MAT PA-gi - `hadirin` = người tham dự; `yang berbahagia` = thân mến/vui mừng.",
          "Lỗi người Việt: dùng `orang-orang` cho khán giả. Trong văn lễ, dùng `hadirin`.",
          "Luyện: `Para hadirin yang berbahagia.`",
        ],
        pronunciation_focus_en: [
          "PA-ra ha-DEE-rin yang ber-ba-HA-gia, se-la-MAT PA-gi - `hadirin` = attendees/audience; `yang berbahagia` = honored/dear.",
          "VN-speaker trap: using `orang-orang` for the audience. Ceremony language uses `hadirin`.",
          "Drill: `Para hadirin yang berbahagia.`",
        ],
      },
      {
        en: "Pertama-tama, marilah kita panjatkan puji syukur kepada Tuhan Yang Maha Esa.",
        vi: "Trước hết, chúng ta hãy dâng lời tạ ơn lên Thượng Đế.",
        pronunciation_focus: [
          "per-TA-ma-TA-ma, ma-RI-lah KI-ta pan-JAT-kan PU-ji SYU-kur - cụm mở đầu rất trang trọng trong pidato Indonesia.",
          "Lỗi người Việt: dịch từng chữ `panjatkan` là trèo. Trong cụm này nghĩa là dâng/lời tạ ơn.",
          "Luyện: `Pertama-tama, marilah kita panjatkan puji syukur.`",
        ],
        pronunciation_focus_en: [
          "per-TA-ma-TA-ma, ma-RI-lah KI-ta pan-JAT-kan PU-ji SYU-kur - a very formal Indonesian speech opening.",
          "VN-speaker trap: taking `panjatkan` literally as climb. In this phrase it means offer/raise thanks.",
          "Drill: `Pertama-tama, marilah kita panjatkan puji syukur.`",
        ],
      },
      {
        en: "Atas nama panitia, kami mengucapkan terima kasih atas kehadiran Bapak dan Ibu.",
        vi: "Thay mặt ban tổ chức, chúng tôi xin cảm ơn sự hiện diện của quý vị.",
        pronunciation_focus: [
          "A-tas NA-ma pa-NI-ti-a, KA-mi me-ngu-CAP-kan te-ri-MA KA-sih A-tas ke-ha-DI-ran - `atas nama panitia` = thay mặt ban tổ chức.",
          "Lỗi người Việt: nói `terima kasih untuk datang`. Văn lễ dùng `terima kasih atas kehadiran`.",
          "Luyện: `Kami mengucapkan terima kasih atas kehadiran Bapak dan Ibu.`",
        ],
        pronunciation_focus_en: [
          "A-tas NA-ma pa-NEE-ti-a, KA-mi me-ngu-CHAP-kan te-ri-MA KA-sih A-tas ke-ha-DEE-ran - `atas nama panitia` = on behalf of the committee.",
          "VN-speaker trap: saying `terima kasih untuk datang`. Ceremony language uses `terima kasih atas kehadiran`.",
          "Drill: `Kami mengucapkan terima kasih atas kehadiran Bapak dan Ibu.`",
        ],
      },
      {
        en: "Acara ini tidak akan berjalan lancar tanpa dukungan semua pihak.",
        vi: "Sự kiện này sẽ không diễn ra suôn sẻ nếu không có sự hỗ trợ của tất cả các bên.",
        pronunciation_focus: [
          "a-CA-ra I-ni ti-DAK A-kan ber-JA-lan LAN-car TAN-pa du-KUNG-an se-MU-a PI-hak - `berjalan lancar` = diễn ra suôn sẻ.",
          "Lỗi người Việt: dịch `run smoothly` thành `lari lancar`. Sự kiện diễn ra là `berjalan lancar`.",
          "Luyện: `Acara berjalan lancar.`",
        ],
        pronunciation_focus_en: [
          "a-CHA-ra I-ni ti-DAK A-kan ber-JA-lan LAN-char TAN-pa du-KUNG-an se-MU-a PI-hak - `berjalan lancar` = run smoothly.",
          "VN-speaker trap: translating 'run smoothly' as `lari lancar`. Events `berjalan lancar`.",
          "Drill: `Acara berjalan lancar.`",
        ],
      },
      {
        en: "Sambutan resmi ini akan saya sampaikan secara singkat.",
        vi: "Tôi sẽ trình bày lời phát biểu chính thức này một cách ngắn gọn.",
        pronunciation_focus: [
          "sam-BU-tan res-MI I-ni A-kan SA-ya sam-PAI-kan se-CA-ra SING-kat - `sambutan resmi` = lời phát biểu chính thức; `secara singkat` = ngắn gọn.",
          "Lỗi người Việt: dùng `pidato` cho mọi lời nói. `Sambutan` thường là lời chào/phát biểu khai mạc ngắn.",
          "Luyện: `Saya sampaikan secara singkat.`",
        ],
        pronunciation_focus_en: [
          "sam-BOO-tan res-MI I-ni A-kan SA-ya sam-PAI-kan se-CHA-ra SING-kat - `sambutan resmi` = official remarks; `secara singkat` = briefly.",
          "VN-speaker trap: using `pidato` for every speech. `Sambutan` is often a short opening/welcome remark.",
          "Drill: `Saya sampaikan secara singkat.`",
        ],
      },
      {
        en: "Dengan mengucap bismillah, acara ini secara resmi saya buka.",
        vi: "Với lời bismillah, tôi chính thức khai mạc sự kiện này.",
        pronunciation_focus: [
          "de-NGAN me-ngu-CAP bis-mil-LAH, a-CA-ra I-ni se-CA-ra res-MI SA-ya BU-ka - công thức khai mạc phổ biến trong nhiều sự kiện Indonesia.",
          "Lỗi người Việt: dịch `mở sự kiện` thành `membuka event` trong lễ trang trọng. Dùng `acara ini secara resmi saya buka`.",
          "Luyện: `Acara ini secara resmi saya buka.`",
        ],
        pronunciation_focus_en: [
          "de-NGAN me-ngu-CHAP bis-mil-LAH, a-CHA-ra I-ni se-CHA-ra res-MI SA-ya BOO-ka - a common opening formula in Indonesian ceremonies.",
          "VN-speaker trap: saying `membuka event` in formal ceremony. Use `acara ini secara resmi saya buka`.",
          "Drill: `Acara ini secara resmi saya buka.`",
        ],
      },
      {
        en: "Kami mohon maaf apabila terdapat kekurangan dalam penyelenggaraan acara.",
        vi: "Chúng tôi xin lỗi nếu có thiếu sót trong việc tổ chức sự kiện.",
        pronunciation_focus: [
          "KA-mi MO-hon ma-AF a-pa-BI-la ter-DA-pat ke-ku-RANG-an da-LAM pe-nye-leng-ga-RA-an a-CA-ra - `apabila` = nếu; `kekurangan` = thiếu sót.",
          "Lỗi người Việt: dùng `kalau ada salah` trong văn lễ. Trang trọng hơn: `apabila terdapat kekurangan`.",
          "Luyện: `Kami mohon maaf apabila terdapat kekurangan.`",
        ],
        pronunciation_focus_en: [
          "KA-mi MO-hon ma-AF a-pa-BI-la ter-DA-pat ke-ku-RANG-an da-LAM pe-nye-leng-ga-RA-an a-CHA-ra - `apabila` = if; `kekurangan` = shortcomings.",
          "VN-speaker trap: saying casual `kalau ada salah` in a ceremony. More formal: `apabila terdapat kekurangan`.",
          "Drill: `Kami mohon maaf apabila terdapat kekurangan.`",
        ],
      },
      {
        en: "Semoga acara ini membawa manfaat bagi kita semua.",
        vi: "Hy vọng sự kiện này mang lại lợi ích cho tất cả chúng ta.",
        pronunciation_focus: [
          "se-MO-ga a-CA-ra I-ni mem-BA-wa man-FA-at ba-GI KI-ta se-MU-a - `semoga` = hy vọng/cầu mong; `manfaat` = lợi ích.",
          "Lỗi người Việt: nói `harap acara ini...` trơ. Câu chúc trang trọng dùng `Semoga...`.",
          "Luyện: `Semoga acara ini membawa manfaat.`",
        ],
        pronunciation_focus_en: [
          "se-MO-ga a-CHA-ra I-ni mem-BA-wa man-FA-at ba-GI KI-ta se-MU-a - `semoga` = hopefully/may; `manfaat` = benefit.",
          "VN-speaker trap: bare `harap acara ini...`. Formal well-wishing uses `Semoga...`.",
          "Drill: `Semoga acara ini membawa manfaat.`",
        ],
      },
      {
        en: "Demikian pidato singkat dari saya.",
        vi: "Đó là bài phát biểu ngắn của tôi.",
        pronunciation_focus: [
          "de-mi-KI-an pi-DA-to SING-kat da-ri SA-ya - `demikian` = như vậy/đó là; `pidato singkat` = bài phát biểu ngắn.",
          "Lỗi người Việt: kết thúc bằng `sudah selesai`. Trong pidato, dùng `Demikian... dari saya`.",
          "Luyện: `Demikian pidato singkat dari saya.`",
        ],
        pronunciation_focus_en: [
          "de-mi-KI-an pi-DA-to SING-kat da-ri SA-ya - `demikian` = thus/that is; `pidato singkat` = short speech.",
          "VN-speaker trap: ending with `sudah selesai`. In speeches, use `Demikian... dari saya`.",
          "Drill: `Demikian pidato singkat dari saya.`",
        ],
      },
      {
        en: "Terima kasih atas perhatian hadirin sekalian.",
        vi: "Xin cảm ơn sự chú ý của toàn thể quý vị.",
        pronunciation_focus: [
          "te-ri-MA KA-sih A-tas per-ha-TI-an ha-DI-rin se-KA-li-an - `perhatian` = sự chú ý; `hadirin sekalian` = toàn thể quý vị.",
          "Lỗi người Việt: dùng `terima kasih untuk perhatian`. Công thức chuẩn là `terima kasih atas perhatian`.",
          "Luyện: `Terima kasih atas perhatian.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih A-tas per-ha-TI-an ha-DEE-rin se-KA-li-an - `perhatian` = attention; `hadirin sekalian` = all attendees.",
          "VN-speaker trap: using `terima kasih untuk perhatian`. Standard formula: `terima kasih atas perhatian`.",
          "Drill: `Terima kasih atas perhatian.`",
        ],
      },
      {
        en: "Dengan ini, acara kita nyatakan ditutup.",
        vi: "Bằng lời này, chúng ta tuyên bố sự kiện kết thúc.",
        pronunciation_focus: [
          "de-NGAN I-ni, a-CA-ra KI-ta nya-TA-kan di-TU-tup - `dinyatakan ditutup` = được tuyên bố bế mạc/đóng lại.",
          "Lỗi người Việt: nói `acara selesai` quá thường. Bế mạc trang trọng dùng `acara dinyatakan ditutup`.",
          "Luyện: `Acara kita nyatakan ditutup.`",
        ],
        pronunciation_focus_en: [
          "de-NGAN I-ni, a-CHA-ra KI-ta nya-TA-kan di-TOO-tup - `dinyatakan ditutup` = declared closed.",
          "VN-speaker trap: saying casual `acara selesai`. Formal closing uses `acara dinyatakan ditutup`.",
          "Drill: `Acara kita nyatakan ditutup.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong buổi lễ Indonesia, `sambutan resmi` thường có khung quen thuộc: chào `hadirin`, tạ ơn Tuhan Yang Maha Esa, cảm ơn panitia và khách mời, nêu mục đích acara, khai mạc hoặc bế mạc bằng công thức trang trọng. Tùy sự kiện và tôn giáo, phần mở đầu có thể dùng salam Hồi giáo, salam lintas agama, hoặc lời chào trung tính. Điều quan trọng là giữ register nhất quán: `saya/kami`, `Bapak/Ibu`, `hadirin sekalian`, và động từ đầy đủ.",
    cultural_notes_en:
      "In Indonesian ceremonies, `sambutan resmi` often follows a familiar frame: greet the `hadirin`, express thanks to Tuhan Yang Maha Esa, thank the committee and guests, state the event purpose, then formally open or close the event. Depending on the event and religion, the opening may use an Islamic greeting, interfaith greetings, or a neutral salutation. The key is consistent register: `saya/kami`, `Bapak/Ibu`, `hadirin sekalian`, and full formal verbs.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dịch văn nói Việt Nam quá trực tiếp. Trong lễ trang trọng, dùng các công thức cố định: `Yang saya hormati...`, `Atas nama panitia...`, `Terima kasih atas...`, `Mohon maaf apabila...`, `Demikian... dari saya`. Tránh `kamu`, `halo semua`, `makasih`, `acaranya selesai` trong bối cảnh chính thức.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not translate casual Vietnamese speech too directly. In formal ceremonies, use fixed formulas: `Yang saya hormati...`, `Atas nama panitia...`, `Terima kasih atas...`, `Mohon maaf apabila...`, `Demikian... dari saya`. Avoid `kamu`, `halo semua`, `makasih`, and `acaranya selesai` in official settings.",
    vocabulary: [
      { word: "sambutan resmi", en: "official remarks", vi: "lời phát biểu chính thức", pos: "noun phrase", pronunciation_vi: "sam-BU-tan res-MI", pronunciation_en: "sam-BOO-tan res-MEE" },
      { word: "pembukaan acara", en: "event opening", vi: "khai mạc sự kiện", pos: "noun phrase", pronunciation_vi: "pem-BU-ka-an a-CA-ra", pronunciation_en: "pem-BOO-ka-an a-CHA-ra" },
      { word: "hadirin", en: "attendees / audience", vi: "quý vị tham dự", pos: "noun", pronunciation_vi: "ha-DI-rin", pronunciation_en: "ha-DEE-rin" },
      { word: "panitia", en: "committee", vi: "ban tổ chức", pos: "noun", pronunciation_vi: "pa-NI-ti-a", pronunciation_en: "pa-NEE-ti-a" },
      { word: "ucapan terima kasih", en: "expression of thanks", vi: "lời cảm ơn", pos: "noun phrase", pronunciation_vi: "u-CA-pan te-ri-MA KA-sih", pronunciation_en: "u-CHA-pan te-ri-MA KA-sih" },
      { word: "pidato singkat", en: "short speech", vi: "bài phát biểu ngắn", pos: "noun phrase", pronunciation_vi: "pi-DA-to SING-kat", pronunciation_en: "pi-DA-to SING-kat" },
      { word: "penutup acara", en: "event closing", vi: "bế mạc sự kiện", pos: "noun phrase", pronunciation_vi: "pe-NU-tup a-CA-ra", pronunciation_en: "pe-NOO-tup a-CHA-ra" },
      { word: "kehadiran", en: "attendance / presence", vi: "sự hiện diện", pos: "noun", pronunciation_vi: "ke-ha-DI-ran", pronunciation_en: "ke-ha-DEE-ran" },
      { word: "penyelenggaraan", en: "organization / running of an event", vi: "việc tổ chức", pos: "noun", pronunciation_vi: "pe-nye-leng-ga-RA-an", pronunciation_en: "pe-nye-leng-ga-RA-an" },
      { word: "hadirin sekalian", en: "all attendees", vi: "toàn thể quý vị", pos: "noun phrase", pronunciation_vi: "ha-DI-rin se-KA-li-an", pronunciation_en: "ha-DEE-rin se-KA-li-an" },
    ],
    dialogue: [
      {
        speaker: "MC",
        text: "Kami persilakan ketua panitia untuk memberikan sambutan.",
        vi: "Xin mời trưởng ban tổ chức lên phát biểu.",
        en: "We invite the committee chair to give opening remarks.",
      },
      {
        speaker: "Ketua Panitia",
        text: "Yang saya hormati Bapak dan Ibu sekalian. Atas nama panitia, kami mengucapkan terima kasih atas kehadiran Anda.",
        vi: "Kính thưa quý vị. Thay mặt ban tổ chức, chúng tôi xin cảm ơn sự hiện diện của quý vị.",
        en: "Honored ladies and gentlemen. On behalf of the committee, we thank you for your presence.",
      },
      {
        speaker: "Ketua Panitia",
        text: "Sambutan resmi ini akan saya sampaikan secara singkat.",
        vi: "Tôi sẽ trình bày lời phát biểu chính thức này một cách ngắn gọn.",
        en: "I will deliver these official remarks briefly.",
      },
      {
        speaker: "Ketua Panitia",
        text: "Demikian pidato singkat dari saya. Terima kasih atas perhatian hadirin sekalian.",
        vi: "Đó là bài phát biểu ngắn của tôi. Xin cảm ơn sự chú ý của toàn thể quý vị.",
        en: "That concludes my short speech. Thank you for your attention.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm trang trọng phù hợp:",
        instruction_en: "Fill in the appropriate formal phrase:",
        items: [
          {
            prompt: "Yang saya ___ Bapak dan Ibu sekalian. (kính trọng)",
            answer: "hormati",
            options: ["hormati", "hubungi", "hitung"],
          },
          {
            prompt: "Atas nama ___, kami mengucapkan terima kasih. (ban tổ chức)",
            answer: "panitia",
            options: ["panitia", "pantai", "panci"],
          },
          {
            prompt: "Demikian ___ singkat dari saya. (bài phát biểu)",
            answer: "pidato",
            options: ["pidato", "pintu", "paspor"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "sambutan resmi", answer: "lời phát biểu chính thức" },
          { prompt: "pembukaan acara", answer: "khai mạc sự kiện" },
          { prompt: "hadirin sekalian", answer: "toàn thể quý vị" },
          { prompt: "penutup acara", answer: "bế mạc sự kiện" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Thay mặt ban tổ chức, chúng tôi xin cảm ơn sự hiện diện của quý vị.", answer: "Atas nama panitia, kami mengucapkan terima kasih atas kehadiran Bapak dan Ibu." },
          { prompt: "Tôi sẽ trình bày lời phát biểu này một cách ngắn gọn.", answer: "Sambutan ini akan saya sampaikan secara singkat." },
          { prompt: "Xin cảm ơn sự chú ý của toàn thể quý vị.", answer: "Terima kasih atas perhatian hadirin sekalian." },
        ],
      },
    ],
  },
];

export default lessons;
