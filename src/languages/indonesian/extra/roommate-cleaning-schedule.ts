// Roommate Cleaning Schedule Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

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

export const roommateCleaningScheduleLessons: IndonesianLesson[] = [
  {
    id: "indonesian_roommate_cleaning_schedule_chores",
    level: "A2",
    category: "housing",
    title_vi: "Ở chung nhà: lịch dọn dẹp và việc nhà",
    title_en: "Housemates: cleaning schedule and chores",
    sentences: [
      {
        en: "Kita perlu buat jadwal bersih-bersih mingguan.",
        vi: "Chúng ta cần làm lịch dọn dẹp hằng tuần.",
        pronunciation_focus: [
          "KI-ta PER-lu BU-at JAD-wal ber-SIH-ber-SIH MING-gu-an - `jadwal bersih-bersih` = lịch dọn dẹp; `mingguan` = hằng tuần.",
          "Lỗi người Việt: dùng `kami` khi đang nói với bạn cùng nhà. Nếu người nghe cũng nằm trong nhóm, dùng `kita`.",
          "Luyện: `Kita perlu buat jadwal bersih-bersih.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta PER-loo BOO-at JAD-wal ber-SIH-ber-SIH MING-goo-an - `jadwal bersih-bersih` = cleaning schedule; `mingguan` = weekly.",
          "VN-speaker trap: using `kami` when speaking to a housemate. If the listener is included, use `kita`.",
          "Drill: `Kita perlu buat jadwal bersih-bersih.`",
        ],
      },
      {
        en: "Hari ini giliran saya cuci piring.",
        vi: "Hôm nay đến lượt tôi rửa chén.",
        pronunciation_focus: [
          "HA-ri I-ni GI-li-ran SA-ya CU-ci PI-ring - `giliran saya` = đến lượt tôi; `cuci piring` = rửa chén.",
          "Lỗi người Việt: nói `saya giliran`. Trật tự tự nhiên là `giliran saya`.",
          "Luyện: `Giliran saya cuci piring.`",
        ],
        pronunciation_focus_en: [
          "HA-ri EE-ni GI-li-ran SA-ya CHOO-chi PEE-ring - `giliran saya` = my turn; `cuci piring` = wash dishes.",
          "VN-speaker trap: saying `saya giliran`. Natural order is `giliran saya`.",
          "Drill: `Giliran saya cuci piring.`",
        ],
      },
      {
        en: "Besok giliran kamu buang sampah.",
        vi: "Ngày mai đến lượt bạn đổ rác.",
        pronunciation_focus: [
          "BE-sok GI-li-ran KA-mu BU-ang SAM-pah - `buang sampah` = đổ/vứt rác; `besok` = ngày mai.",
          "Lỗi người Việt: dịch 'đổ rác' thành `tuang sampah`. Rác dùng `buang sampah`, không dùng `tuang`.",
          "Luyện: `Besok giliran kamu buang sampah.`",
        ],
        pronunciation_focus_en: [
          "BE-sok GI-li-ran KA-mu BOO-ang SAM-pah - `buang sampah` = throw out trash; `besok` = tomorrow.",
          "VN-speaker trap: translating 'pour out trash' as `tuang sampah`. Trash uses `buang sampah`, not `tuang`.",
          "Drill: `Besok giliran kamu buang sampah.`",
        ],
      },
      {
        en: "Kamar mandi harus dibersihkan dua kali seminggu.",
        vi: "Phòng tắm phải được dọn hai lần một tuần.",
        pronunciation_focus: [
          "KA-mar MAN-di HA-rus di-BER-sih-kan DU-a KA-li se-MING-gu - `kamar mandi` = phòng tắm/nhà vệ sinh; `dibersihkan` = được dọn sạch.",
          "Lỗi người Việt: né bị động `di-`. Với lịch việc nhà, `harus dibersihkan` tự nhiên hơn `harus bersihkan`.",
          "Luyện: `Kamar mandi harus dibersihkan.`",
        ],
        pronunciation_focus_en: [
          "KA-mar MAN-di HA-rus di-BER-sih-kan DOO-a KA-li se-MING-goo - `kamar mandi` = bathroom; `dibersihkan` = cleaned.",
          "VN-speaker trap: avoiding passive `di-`. For chore schedules, `harus dibersihkan` is more natural than `harus bersihkan`.",
          "Drill: `Kamar mandi harus dibersihkan.`",
        ],
      },
      {
        en: "Tolong jangan biarkan piring kotor menumpuk.",
        vi: "Làm ơn đừng để chén bẩn chất đống.",
        pronunciation_focus: [
          "TO-long JA-ngan bi-AR-kan PI-ring KO-tor me-NUM-puk - `piring kotor` = chén/đĩa bẩn; `menumpuk` = chất đống.",
          "Lỗi người Việt: nói `piring banyak` khi muốn nói chén bẩn dồn lại. Cụm đúng là `piring kotor menumpuk`.",
          "Luyện: `Jangan biarkan piring kotor menumpuk.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan bi-AR-kan PEE-ring KO-tor me-NOOM-puk - `piring kotor` = dirty dishes; `menumpuk` = pile up.",
          "VN-speaker trap: saying `piring banyak` when you mean dirty dishes have piled up. Use `piring kotor menumpuk`.",
          "Drill: `Jangan biarkan piring kotor menumpuk.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở kos, apartemen bersama, hoặc rumah kontrakan, người ở chung thường thỏa thuận việc nhà bằng `jadwal bersih-bersih`. Nói thẳng nhưng nhẹ rất quan trọng: dùng `tolong`, `giliran`, `kesepakatan`, và tránh giọng ra lệnh quá gắt.",
    cultural_notes_en:
      "In boarding houses, shared apartments, or rented houses, housemates often agree on chores through a `jadwal bersih-bersih`. Direct but gentle wording matters: use `tolong`, `giliran`, `kesepakatan`, and avoid sounding too commanding.",
    tip_advice_vi:
      "Khung cần nhớ: `giliran saya/kamu`, `buang sampah`, `cuci piring`, `kamar mandi harus dibersihkan`. Với người ở chung, `kita` bao gồm cả người nghe; `kami` thì không.",
    tip_advice_en:
      "Useful frames: `giliran saya/kamu`, `buang sampah`, `cuci piring`, `kamar mandi harus dibersihkan`. With housemates, `kita` includes the listener; `kami` does not.",
    vocabulary: [
      {
        word: "jadwal bersih-bersih",
        en: "cleaning schedule",
        vi: "lịch dọn dẹp",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal ber-SIH-ber-SIH",
        pronunciation_en: "JAD-wal ber-SIH-ber-SIH",
      },
      {
        word: "teman serumah",
        en: "housemate",
        vi: "bạn cùng nhà",
        pos: "noun phrase",
        pronunciation_vi: "te-MAN se-RU-mah",
        pronunciation_en: "te-MAN se-ROO-mah",
      },
      {
        word: "cuci piring",
        en: "wash dishes",
        vi: "rửa chén",
        pos: "verb phrase",
        pronunciation_vi: "CU-ci PI-ring",
        pronunciation_en: "CHOO-chi PEE-ring",
      },
      {
        word: "buang sampah",
        en: "throw out trash",
        vi: "đổ rác",
        pos: "verb phrase",
        pronunciation_vi: "BU-ang SAM-pah",
        pronunciation_en: "BOO-ang SAM-pah",
      },
      {
        word: "kamar mandi",
        en: "bathroom",
        vi: "phòng tắm / nhà vệ sinh",
        pos: "noun phrase",
        pronunciation_vi: "KA-mar MAN-di",
        pronunciation_en: "KA-mar MAN-di",
      },
      {
        word: "giliran",
        en: "turn",
        vi: "lượt",
        pos: "noun",
        pronunciation_vi: "GI-li-ran",
        pronunciation_en: "GI-li-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Ari",
        text: "Kita perlu buat jadwal bersih-bersih mingguan.",
        vi: "Chúng ta cần làm lịch dọn dẹp hằng tuần.",
        en: "We need to make a weekly cleaning schedule.",
      },
      {
        speaker: "Lina",
        text: "Setuju. Hari ini giliran saya cuci piring.",
        vi: "Đồng ý. Hôm nay đến lượt tôi rửa chén.",
        en: "Agreed. Today is my turn to wash dishes.",
      },
      {
        speaker: "Ari",
        text: "Besok saya buang sampah, lalu kamu bersihkan kamar mandi.",
        vi: "Ngày mai tôi đổ rác, rồi bạn dọn phòng tắm.",
        en: "Tomorrow I will take out the trash, then you clean the bathroom.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Hari ini ___ saya cuci piring.`",
        prompt_en: "Fill in: `Hari ini ___ saya cuci piring.`",
        answer: "giliran",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Ngày mai đến lượt bạn đổ rác.",
        prompt_en: "Translate to Indonesian: Tomorrow is your turn to take out the trash.",
        answer: "Besok giliran kamu buang sampah.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là rửa chén?",
        prompt_en: "Which phrase means wash dishes?",
        options: ["cuci piring", "buang sampah", "jadwal mingguan"],
        answer: "cuci piring",
      },
    ],
  },
  {
    id: "indonesian_roommate_cleaning_agreement_conflict",
    level: "B1",
    category: "housing",
    title_vi: "Thỏa thuận dọn dẹp với bạn cùng nhà",
    title_en: "Cleaning agreements with housemates",
    sentences: [
      {
        en: "Kita perlu kesepakatan yang jelas tentang giliran bersih-bersih.",
        vi: "Chúng ta cần thỏa thuận rõ ràng về lượt dọn dẹp.",
        pronunciation_focus: [
          "KI-ta PER-lu ke-se-PA-ka-tan yang JE-las ten-TANG GI-li-ran ber-SIH-ber-SIH - `kesepakatan` = thỏa thuận; `jelas` = rõ ràng.",
          "Lỗi người Việt: dùng `setuju` như danh từ. `Setuju` = đồng ý; danh từ 'thỏa thuận' là `kesepakatan`.",
          "Luyện: `Kita perlu kesepakatan yang jelas.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta PER-loo ke-se-PA-ka-tan yang JE-las ten-TANG GI-li-ran ber-SIH-ber-SIH - `kesepakatan` = agreement; `jelas` = clear.",
          "VN-speaker trap: using `setuju` as a noun. `Setuju` = agree; the noun 'agreement' is `kesepakatan`.",
          "Drill: `Kita perlu kesepakatan yang jelas.`",
        ],
      },
      {
        en: "Kalau kamu sibuk, tolong tukar giliran dari awal.",
        vi: "Nếu bạn bận, làm ơn đổi lượt từ đầu.",
        pronunciation_focus: [
          "KA-lau KA-mu SI-buk, TO-long TU-kar GI-li-ran da-ri A-wal - `tukar giliran` = đổi lượt; `dari awal` = từ đầu/sớm.",
          "Lỗi người Việt: nói `ganti giliran` vẫn hiểu, nhưng `tukar giliran` tự nhiên hơn khi hai người đổi lượt cho nhau.",
          "Luyện: `Tolong tukar giliran dari awal.`",
        ],
        pronunciation_focus_en: [
          "KA-lau KA-mu SEE-buk, TO-long TOO-kar GI-li-ran da-ri A-wal - `tukar giliran` = swap turns; `dari awal` = from the start/early.",
          "VN-speaker trap: `ganti giliran` is understandable, but `tukar giliran` is more natural when two people swap turns.",
          "Drill: `Tolong tukar giliran dari awal.`",
        ],
      },
      {
        en: "Saya merasa tidak adil kalau tugas selalu menumpuk di satu orang.",
        vi: "Tôi cảm thấy không công bằng nếu việc luôn dồn vào một người.",
        pronunciation_focus: [
          "SA-ya me-RA-sa TI-dak A-dil KA-lau TU-gas se-LA-lu me-NUM-puk di SA-tu O-rang - `tidak adil` = không công bằng; `tugas menumpuk` = việc dồn lại.",
          "Lỗi người Việt: nói thẳng `kamu malas` dễ gây cãi nhau. Nói cảm nhận bằng `saya merasa tidak adil` mềm hơn.",
          "Luyện: `Saya merasa tidak adil.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-RA-sa TEE-dak A-dil KA-lau TOO-gas se-LA-loo me-NOOM-puk di SA-too O-rang - `tidak adil` = unfair; `tugas menumpuk` = tasks pile up.",
          "VN-speaker trap: bluntly saying `kamu malas` can start a fight. `Saya merasa tidak adil` is softer.",
          "Drill: `Saya merasa tidak adil.`",
        ],
      },
      {
        en: "Mari kita tulis aturan sederhana di grup chat.",
        vi: "Hãy viết quy định đơn giản trong nhóm chat.",
        pronunciation_focus: [
          "MA-ri KI-ta TU-lis a-TU-ran se-der-HA-na di grup chat - `mari kita` = chúng ta hãy; `aturan sederhana` = quy định đơn giản.",
          "Lỗi người Việt: dùng `ayo` trong mọi tình huống. `Ayo` thân mật; `mari kita` nghe hợp hơn khi đề xuất bình tĩnh.",
          "Luyện: `Mari kita tulis aturan sederhana.`",
        ],
        pronunciation_focus_en: [
          "MA-ri KEE-ta TOO-lis a-TOO-ran se-der-HA-na di group chat - `mari kita` = let's; `aturan sederhana` = simple rules.",
          "VN-speaker trap: using `ayo` in every setting. `Ayo` is casual; `mari kita` sounds calmer for a proposal.",
          "Drill: `Mari kita tulis aturan sederhana.`",
        ],
      },
      {
        en: "Kalau ada masalah, kita bicara baik-baik dulu.",
        vi: "Nếu có vấn đề, chúng ta nói chuyện tử tế trước.",
        pronunciation_focus: [
          "KA-lau A-da MA-sa-lah, KI-ta bi-CA-ra BAIK-BAIK DU-lu - `bicara baik-baik` = nói chuyện tử tế/êm đẹp; `dulu` = trước đã.",
          "Lỗi người Việt: dịch 'nói chuyện đàng hoàng' quá cứng. Cụm tự nhiên là `bicara baik-baik`.",
          "Luyện: `Kita bicara baik-baik dulu.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da MA-sa-lah, KEE-ta bi-CHA-ra BAIK-BAIK DOO-loo - `bicara baik-baik` = talk it through nicely; `dulu` = first.",
          "VN-speaker trap: over-literal wording for 'talk properly'. Natural phrase: `bicara baik-baik`.",
          "Drill: `Kita bicara baik-baik dulu.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhà ở chung, người Indonesia thường cố tránh làm người khác mất mặt. Vì vậy, khi có vấn đề về việc nhà, nên nói bằng cảm nhận và thỏa thuận: `saya merasa`, `kita perlu kesepakatan`, `mari kita`, `bicara baik-baik`.",
    cultural_notes_en:
      "In shared housing, Indonesians often try to avoid making someone lose face. When there is a chore problem, speak through feelings and agreements: `saya merasa`, `kita perlu kesepakatan`, `mari kita`, `bicara baik-baik`.",
    tip_advice_vi:
      "Muốn góp ý mà không gây căng thẳng: tránh quy chụp như `kamu malas`; dùng mẫu `Saya merasa... kalau...` và đề xuất `Mari kita...`. Đây là cách lịch sự để giữ quan hệ với teman serumah.",
    tip_advice_en:
      "To give feedback without escalating: avoid labels like `kamu malas`; use `Saya merasa... kalau...` and propose `Mari kita...`. This is a polite way to preserve the housemate relationship.",
    vocabulary: [
      {
        word: "kesepakatan",
        en: "agreement",
        vi: "thỏa thuận",
        pos: "noun",
        pronunciation_vi: "ke-se-PA-ka-tan",
        pronunciation_en: "ke-se-PA-ka-tan",
      },
      {
        word: "tukar giliran",
        en: "swap turns",
        vi: "đổi lượt",
        pos: "verb phrase",
        pronunciation_vi: "TU-kar GI-li-ran",
        pronunciation_en: "TOO-kar GI-li-ran",
      },
      {
        word: "tidak adil",
        en: "unfair",
        vi: "không công bằng",
        pos: "adjective phrase",
        pronunciation_vi: "TI-dak A-dil",
        pronunciation_en: "TEE-dak A-dil",
      },
      {
        word: "aturan sederhana",
        en: "simple rules",
        vi: "quy định đơn giản",
        pos: "noun phrase",
        pronunciation_vi: "a-TU-ran se-der-HA-na",
        pronunciation_en: "a-TOO-ran se-der-HA-na",
      },
      {
        word: "bicara baik-baik",
        en: "talk calmly/nicely",
        vi: "nói chuyện tử tế / êm đẹp",
        pos: "verb phrase",
        pronunciation_vi: "bi-CA-ra BAIK-BAIK",
        pronunciation_en: "bi-CHA-ra BAIK-BAIK",
      },
      {
        word: "tugas menumpuk",
        en: "tasks pile up",
        vi: "việc dồn lại",
        pos: "phrase",
        pronunciation_vi: "TU-gas me-NUM-puk",
        pronunciation_en: "TOO-gas me-NOOM-puk",
      },
    ],
    dialogue: [
      {
        speaker: "Dina",
        text: "Aku merasa tidak adil kalau piring kotor selalu menumpuk.",
        vi: "Tôi thấy không công bằng nếu chén bẩn cứ luôn chất đống.",
        en: "I feel it is unfair when dirty dishes always pile up.",
      },
      {
        speaker: "Rafi",
        text: "Maaf, minggu ini aku sibuk. Bisa tukar giliran?",
        vi: "Xin lỗi, tuần này tôi bận. Có thể đổi lượt không?",
        en: "Sorry, I am busy this week. Can we swap turns?",
      },
      {
        speaker: "Dina",
        text: "Bisa, tapi mari kita tulis kesepakatan di grup chat.",
        vi: "Được, nhưng hãy viết thỏa thuận trong nhóm chat.",
        en: "Yes, but let's write the agreement in the group chat.",
      },
      {
        speaker: "Rafi",
        text: "Setuju. Kalau ada masalah, kita bicara baik-baik dulu.",
        vi: "Đồng ý. Nếu có vấn đề, chúng ta nói chuyện tử tế trước.",
        en: "Agreed. If there is a problem, let's talk it through calmly first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kita perlu ___ yang jelas.`",
        prompt_en: "Fill in: `Kita perlu ___ yang jelas.`",
        answer: "kesepakatan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Chúng ta nói chuyện tử tế trước.",
        prompt_en: "Translate to Indonesian: Let's talk calmly first.",
        answer: "Kita bicara baik-baik dulu.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `tukar giliran`, `tidak adil`, `kesepakatan`.",
        prompt_en: "Match meanings: `tukar giliran`, `tidak adil`, `kesepakatan`.",
        pairs: [
          ["tukar giliran", "đổi lượt / swap turns"],
          ["tidak adil", "không công bằng / unfair"],
          ["kesepakatan", "thỏa thuận / agreement"],
        ],
      },
    ],
  },
];
