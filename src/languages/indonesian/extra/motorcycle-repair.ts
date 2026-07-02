// Motorcycle Repair Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Repair-shop register note: at a `bengkel motor`, people speak directly and
// practically: `ban bocor`, `ganti oli`, `rem blong`, `aki soak`, `servis rutin`,
// `spare part`, and `biaya perbaikan`. The goal is to describe the fault, ask
// the cost, approve parts, and confirm when the bike is ready.

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
    id: "indonesian_motorcycle_repair",
    level: "A2",
    category: "transport",
    title_vi: "Sửa xe máy ở bengkel",
    title_en: "Motorcycle repair at the bengkel",
    sentences: [
      {
        en: "Mas, saya mau servis motor.",
        vi: "Anh ơi, tôi muốn bảo dưỡng xe máy.",
        pronunciation_focus: [
          "mas, SA-ya mau SER-vis MO-tor - `bengkel` = tiệm sửa xe; `servis motor` = bảo dưỡng/sửa xe máy.",
          "Lỗi người Việt: `motor` trong Indonesia là xe máy, không phải chỉ động cơ như tiếng Việt.",
          "Luyện: `Saya mau servis motor.`",
        ],
        pronunciation_focus_en: [
          "mas, SA-ya mau SER-vis MO-tor - `bengkel` = repair shop; `servis motor` = service/repair a motorbike.",
          "VN-speaker trap: Indonesian `motor` means motorbike, not just the engine.",
          "Drill: `Saya mau servis motor.`",
        ],
      },
      {
        en: "Ban belakang bocor, bisa ditambal?",
        vi: "Lốp sau bị thủng, vá được không?",
        pronunciation_focus: [
          "ban be-LA-kang BO-cor, BI-sa di-TAM-bal - `ban bocor` = lốp thủng/xì; `tambal` = vá.",
          "Lỗi người Việt: dùng `rusak` cho mọi thứ. Lốp xì hoặc ống rò dùng `bocor`.",
          "Luyện: `Ban belakang bocor.`",
        ],
        pronunciation_focus_en: [
          "ban be-LA-kang BO-chor, BEE-sa dee-TAM-bal - `ban bocor` = leaking/flat tire; `tambal` = patch.",
          "VN-speaker trap: using `rusak` for everything. A tire or pipe leak is `bocor`.",
          "Drill: `Ban belakang bocor.`",
        ],
      },
      {
        en: "Saya perlu ganti oli mesin.",
        vi: "Tôi cần thay dầu máy.",
        pronunciation_focus: [
          "SA-ya PER-lu GAN-ti O-li ME-sin - `ganti oli` = thay dầu; `oli mesin` = dầu máy.",
          "Lỗi người Việt: nói `minyak mesin`. Trong xe máy, dầu nhớt là `oli`, không phải `minyak`.",
          "Luyện: `Perlu ganti oli mesin.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo GAN-tee O-lee MEH-sin - `ganti oli` = change oil; `oli mesin` = engine oil.",
          "VN-speaker trap: saying `minyak mesin`. For vehicle oil, use `oli`, not `minyak`.",
          "Drill: `Perlu ganti oli mesin.`",
        ],
      },
      {
        en: "Rem depan kurang pakem.",
        vi: "Phanh trước không ăn lắm.",
        pronunciation_focus: [
          "rem de-PAN KU-rang PA-kem - `rem` = phanh; `pakem` = ăn/chắc/hiệu quả.",
          "Lỗi người Việt: dịch 'không ăn phanh' thành `tidak makan`. Tiếng Indonesia nói `rem kurang pakem`.",
          "Luyện: `Rem depan kurang pakem.`",
        ],
        pronunciation_focus_en: [
          "rem de-PAN KOO-rang PA-kem - `rem` = brake; `pakem` = grips well/effective.",
          "VN-speaker trap: translating 'the brake doesn't bite' as `tidak makan`. Indonesian says `rem kurang pakem`.",
          "Drill: `Rem depan kurang pakem.`",
        ],
      },
      {
        en: "Akinya lemah, motor susah dinyalakan.",
        vi: "Ắc quy yếu, xe máy khó khởi động.",
        pronunciation_focus: [
          "A-ki-nya LE-mah, MO-tor SU-sah di-NYA-la-kan - `aki` = ắc quy; `dinyalakan` = được bật/khởi động.",
          "Lỗi người Việt: đọc `ny` trong `dinyalakan` tách rời. `ny` là một âm như 'nh' tiếng Việt.",
          "Luyện: `Akinya lemah.`",
        ],
        pronunciation_focus_en: [
          "A-kee-nya LEH-mah, MO-tor SOO-sah dee-NYA-la-kan - `aki` = battery; `dinyalakan` = started/turned on.",
          "VN-speaker trap: splitting `ny` in `dinyalakan`. `ny` is one sound, like Vietnamese 'nh'.",
          "Drill: `Akinya lemah.`",
        ],
      },
      {
        en: "Mesinnya bunyi kasar.",
        vi: "Máy kêu thô/ồn bất thường.",
        pronunciation_focus: [
          "ME-sin-nya BU-nyi KA-sar - `bunyi` = âm thanh/kêu; `kasar` = thô, không êm.",
          "Lỗi người Việt: nói `mesin suara`. Dùng cấu trúc tự nhiên: `mesinnya bunyi kasar`.",
          "Luyện: `Mesinnya bunyi kasar.`",
        ],
        pronunciation_focus_en: [
          "MEH-sin-nya BOO-nyee KA-sar - `bunyi` = sound/noise; `kasar` = rough.",
          "VN-speaker trap: saying `mesin suara`. Natural phrasing is `mesinnya bunyi kasar`.",
          "Drill: `Mesinnya bunyi kasar.`",
        ],
      },
      {
        en: "Kapan terakhir servis rutin?",
        vi: "Lần bảo dưỡng định kỳ gần nhất là khi nào?",
        pronunciation_focus: [
          "KA-pan ter-A-khir SER-vis ru-TIN - `terakhir` = cuối/gần nhất; `servis rutin` = bảo dưỡng định kỳ.",
          "Lỗi người Việt: dùng `biasa` cho định kỳ. Lịch bảo dưỡng nói `rutin`.",
          "Luyện: `Servis rutin kapan terakhir?`",
        ],
        pronunciation_focus_en: [
          "KA-pan ter-A-khir SER-vis roo-TEEN - `terakhir` = last/most recent; `servis rutin` = routine service.",
          "VN-speaker trap: using `biasa` for scheduled maintenance. Use `rutin`.",
          "Drill: `Servis rutin kapan terakhir?`",
        ],
      },
      {
        en: "Apakah perlu ganti spare part?",
        vi: "Có cần thay phụ tùng không?",
        pronunciation_focus: [
          "a-PA-kah PER-lu GAN-ti SPER-part - `spare part` = phụ tùng; cũng có từ chuẩn `suku cadang`.",
          "Lỗi người Việt: ở bengkel người ta hay nói `spare part`; trong văn bản chính thức dùng `suku cadang`.",
          "Luyện: `Perlu ganti spare part?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah PER-loo GAN-tee SPARE-part - `spare part` = replacement part; formal Indonesian also has `suku cadang`.",
          "VN-speaker note: mechanics often say `spare part`; formal writing uses `suku cadang`.",
          "Drill: `Perlu ganti spare part?`",
        ],
      },
      {
        en: "Kalau pakai spare part asli, berapa biayanya?",
        vi: "Nếu dùng phụ tùng chính hãng thì chi phí bao nhiêu?",
        pronunciation_focus: [
          "KA-lau PA-kai SPER-part AS-li, be-RA-pa BI-a-ya-nya - `asli` = chính hãng/gốc; `biaya` = chi phí.",
          "Lỗi người Việt: `asli` không chỉ là 'thật' chung chung; trong tiệm sửa xe nghĩa là chính hãng/original.",
          "Luyện: `Berapa biayanya?`",
        ],
        pronunciation_focus_en: [
          "KA-lau PA-kai SPARE-part AS-lee, be-RA-pa BEE-a-ya-nya - `asli` = genuine/original; `biaya` = cost.",
          "VN-speaker trap: `asli` is not only 'real'; in repair shops it means genuine/original parts.",
          "Drill: `Berapa biayanya?`",
        ],
      },
      {
        en: "Tolong cek tekanan angin ban.",
        vi: "Làm ơn kiểm tra áp suất hơi của lốp.",
        pronunciation_focus: [
          "TO-long cek te-KA-nan A-ngin ban - `tekanan angin` = áp suất hơi; `ban` = lốp.",
          "Lỗi người Việt: dịch từng chữ 'bơm bánh' không đủ rõ. Ở bengkel hỏi `cek tekanan angin ban`.",
          "Luyện: `Cek tekanan angin ban.`",
        ],
        pronunciation_focus_en: [
          "TO-long chek te-KA-nan A-ngin ban - `tekanan angin` = air pressure; `ban` = tire.",
          "VN-speaker trap: a word-for-word 'pump the wheel' is vague. At the shop ask `cek tekanan angin ban`.",
          "Drill: `Cek tekanan angin ban.`",
        ],
      },
      {
        en: "Motornya bisa selesai sore ini?",
        vi: "Xe máy có thể xong chiều nay không?",
        pronunciation_focus: [
          "MO-tor-nya BI-sa se-LE-sai SO-re I-ni - `selesai` = xong; `sore ini` = chiều nay.",
          "Lỗi người Việt: nói `habis` cho công việc xong. Sửa xe xong là `selesai`.",
          "Luyện: `Bisa selesai sore ini?`",
        ],
        pronunciation_focus_en: [
          "MO-tor-nya BEE-sa se-LEH-sai SO-reh EE-nee - `selesai` = finished; `sore ini` = this afternoon.",
          "VN-speaker trap: using `habis` for a completed job. A repair is `selesai`.",
          "Drill: `Bisa selesai sore ini?`",
        ],
      },
      {
        en: "Minta nota perbaikan, ya.",
        vi: "Cho tôi xin hóa đơn/phiếu sửa chữa nhé.",
        pronunciation_focus: [
          "MIN-ta NO-ta per-ba-I-kan, ya - `nota` = hóa đơn/phiếu; `perbaikan` = việc sửa chữa.",
          "Lỗi người Việt: `bukti` là bằng chứng/biên nhận chung; ở bengkel hỏi `nota` là tự nhiên.",
          "Luyện: `Minta nota perbaikan, ya.`",
        ],
        pronunciation_focus_en: [
          "MIN-ta NO-ta per-ba-EE-kan, ya - `nota` = receipt; `perbaikan` = repair.",
          "VN-speaker trap: `bukti` is general proof/receipt; at a bengkel, `nota` is natural.",
          "Drill: `Minta nota perbaikan, ya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `bengkel motor` có ở hầu hết khu dân cư. Có bengkel chính hãng như Honda/Yamaha và bengkel umum nhỏ hơn. Với việc đơn giản như `tambal ban`, `ganti oli`, chỉnh `rem`, kiểm tra `aki`, thường có thể chờ tại chỗ. Với thay phụ tùng, hãy hỏi rõ `spare part asli` hay `KW`/không chính hãng, `biaya perbaikan`, và thời gian `selesai`.",
    cultural_notes_en:
      "In Indonesia, `bengkel motor` shops are common in almost every neighborhood. There are official Honda/Yamaha workshops and smaller general repair shops. For simple jobs like `tambal ban`, `ganti oli`, brake adjustment, or battery checks, you can often wait on site. For replacement parts, ask clearly whether the part is `asli` or `KW`/non-original, the `biaya perbaikan`, and when it will be `selesai`.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dùng một từ `rusak` cho mọi lỗi. Lốp thủng là `ban bocor`; phanh không ăn là `rem kurang pakem`; bình yếu là `aki lemah` hoặc `aki soak`; máy kêu lạ là `mesinnya bunyi kasar`. Khung vàng ở bengkel: `Saya mau servis motor`, `Berapa biayanya?`, `Perlu ganti spare part?`, `Bisa selesai sore ini?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not use only `rusak` for every fault. A flat tire is `ban bocor`; weak brakes are `rem kurang pakem`; a weak battery is `aki lemah` or `aki soak`; rough engine noise is `mesinnya bunyi kasar`. Golden bengkel frames: `Saya mau servis motor`, `Berapa biayanya?`, `Perlu ganti spare part?`, `Bisa selesai sore ini?`.",
    vocabulary: [
      {
        word: "bengkel motor",
        en: "motorcycle repair shop",
        vi: "tiệm sửa xe máy",
        pos: "noun phrase",
        pronunciation_vi: "BENG-kel MO-tor",
        pronunciation_en: "BENG-kel MO-tor",
      },
      {
        word: "ban bocor",
        en: "flat/leaking tire",
        vi: "lốp thủng / xì hơi",
        pos: "noun phrase",
        pronunciation_vi: "ban BO-cor",
        pronunciation_en: "ban BO-chor",
      },
      {
        word: "tambal ban",
        en: "patch a tire",
        vi: "vá lốp",
        pos: "verb phrase",
        pronunciation_vi: "TAM-bal ban",
        pronunciation_en: "TAM-bal ban",
      },
      {
        word: "ganti oli",
        en: "change oil",
        vi: "thay dầu nhớt",
        pos: "verb phrase",
        pronunciation_vi: "GAN-ti O-li",
        pronunciation_en: "GAN-tee O-lee",
      },
      {
        word: "rem",
        en: "brake",
        vi: "phanh",
        pos: "noun",
        pronunciation_vi: "rem",
        pronunciation_en: "rem",
      },
      {
        word: "aki",
        en: "vehicle battery",
        vi: "ắc quy",
        pos: "noun",
        pronunciation_vi: "A-ki",
        pronunciation_en: "A-kee",
      },
      {
        word: "servis rutin",
        en: "routine service",
        vi: "bảo dưỡng định kỳ",
        pos: "noun phrase",
        pronunciation_vi: "SER-vis ru-TIN",
        pronunciation_en: "SER-vis roo-TEEN",
      },
      {
        word: "spare part",
        en: "replacement part",
        vi: "phụ tùng",
        pos: "noun",
        pronunciation_vi: "SPER-part",
        pronunciation_en: "SPARE-part",
      },
      {
        word: "suku cadang",
        en: "spare part (formal)",
        vi: "phụ tùng / linh kiện",
        pos: "noun phrase",
        pronunciation_vi: "SU-ku CA-dang",
        pronunciation_en: "SOO-koo CHA-dang",
      },
      {
        word: "biaya perbaikan",
        en: "repair cost",
        vi: "chi phí sửa chữa",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya per-ba-I-kan",
        pronunciation_en: "BEE-a-ya per-ba-EE-kan",
      },
      {
        word: "pakem",
        en: "grippy/effective",
        vi: "ăn / chắc / hiệu quả",
        pos: "adjective",
        pronunciation_vi: "PA-kem",
        pronunciation_en: "PA-kem",
      },
      {
        word: "nota",
        en: "receipt",
        vi: "hóa đơn / phiếu",
        pos: "noun",
        pronunciation_vi: "NO-ta",
        pronunciation_en: "NO-ta",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Mas, ban belakang bocor dan rem depan kurang pakem.",
        vi: "Anh ơi, lốp sau bị thủng và phanh trước không ăn lắm.",
        en: "Sir, the rear tire is flat and the front brake is weak.",
      },
      {
        speaker: "Mekanik",
        text: "Baik, saya cek dulu. Kapan terakhir servis rutin?",
        vi: "Vâng, tôi kiểm tra trước. Lần bảo dưỡng định kỳ gần nhất là khi nào?",
        en: "Okay, I will check first. When was the last routine service?",
      },
      {
        speaker: "Pelanggan",
        text: "Sudah lama. Kalau perlu ganti spare part, kabari saya dulu.",
        vi: "Lâu rồi. Nếu cần thay phụ tùng, báo tôi trước nhé.",
        en: "It has been a long time. If parts need replacing, tell me first.",
      },
      {
        speaker: "Mekanik",
        text: "Siap. Nanti saya beri tahu biaya perbaikannya.",
        vi: "Được. Lát nữa tôi sẽ báo chi phí sửa chữa.",
        en: "Sure. I will tell you the repair cost later.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Lốp sau bị thủng, vá được không?",
        answer: "Ban belakang bocor, bisa ditambal?",
      },
      {
        type: "fill_blank",
        prompt: "Saya perlu ganti ____ mesin.",
        answer: "oli",
        explanation_vi: "`ganti oli mesin` = thay dầu máy.",
        explanation_en: "`ganti oli mesin` = change engine oil.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'the front brake is not very effective'?",
        choices: [
          "Rem depan kurang pakem.",
          "Akinya lemah.",
          "Ban belakang bocor.",
          "Minta nota perbaikan.",
        ],
        answer: "Rem depan kurang pakem.",
      },
      {
        type: "matching",
        pairs: [
          ["bengkel motor", "tiệm sửa xe máy"],
          ["ban bocor", "lốp thủng"],
          ["aki", "ắc quy"],
          ["biaya perbaikan", "chi phí sửa chữa"],
        ],
      },
    ],
  },
];

export default lessons;
