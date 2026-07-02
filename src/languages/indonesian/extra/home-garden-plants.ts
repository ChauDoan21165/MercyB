// Home Garden & Plants Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_home_garden_plants",
    level: "A2",
    category: "daily-life",
    title_vi: "Cây trong nhà và vườn nhỏ",
    title_en: "Home plants and a small garden",
    sentences: [
      {
        en: "Saya mau membeli tanaman rumah yang mudah dirawat.",
        vi: "Tôi muốn mua cây trong nhà dễ chăm sóc.",
        pronunciation_focus: [
          "SA-ya mau mem-BE-li ta-NA-man RU-mah yang MU-dah di-RA-wat -- `tanaman rumah` = cây trong nhà; `mudah dirawat` = dễ chăm sóc.",
          "Lỗi người Việt: dùng `pohon` cho mọi cây. `Pohon` thường là cây thân gỗ; cây cảnh/cây chậu dùng `tanaman`.",
          "Luyện: `Saya mau membeli tanaman rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BE-li ta-NA-man ROO-mah yang MOO-dah di-RA-wat -- `tanaman rumah` = houseplant; `mudah dirawat` = easy to care for.",
          "VN-speaker trap: using `pohon` for every plant. `Pohon` is usually a tree; potted/ornamental plants use `tanaman`.",
          "Drill: `Saya mau membeli tanaman rumah.`",
        ],
      },
      {
        en: "Tanaman ini perlu disiram setiap pagi?",
        vi: "Cây này cần được tưới mỗi sáng không?",
        pronunciation_focus: [
          "ta-NA-man I-ni per-LU di-SI-ram se-TI-ap PA-gi -- `disiram` = được tưới; `setiap pagi` = mỗi sáng.",
          "Mẹo: trong chăm cây, bị động `di-` rất tự nhiên: `disiram`, `dipupuk`, `dipindah`.",
          "Luyện: `Tanaman ini perlu disiram?`",
        ],
        pronunciation_focus_en: [
          "ta-NA-man EE-ni per-LOO di-SEE-ram se-TEE-ap PA-gi -- `disiram` = watered; `setiap pagi` = every morning.",
          "Tip: in plant care, `di-` passives are natural: `disiram`, `dipupuk`, `dipindah`.",
          "Drill: `Tanaman ini perlu disiram?`",
        ],
      },
      {
        en: "Jangan terlalu banyak air, nanti akarnya busuk.",
        vi: "Đừng tưới quá nhiều nước, lát nữa rễ sẽ bị thối.",
        pronunciation_focus: [
          "JA-ngan ter-LA-lu BA-nyak A-ir, NAN-ti A-kar-nya BU-suk -- `akar` = rễ; `busuk` = thối.",
          "`jangan terlalu...` = đừng quá...; dùng tốt với `banyak air`, `panas`, `sering disiram`.",
          "Luyện: `Jangan terlalu banyak air.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan ter-LA-loo BA-nyak A-ir, NAN-ti A-kar-nya BOO-suk -- `akar` = root; `busuk` = rotten.",
          "`Jangan terlalu...` = don't make it too...; useful with `banyak air`, `panas`, `sering disiram`.",
          "Drill: `Jangan terlalu banyak air.`",
        ],
      },
      {
        en: "Saya butuh pot yang lebih besar untuk tanaman hias ini.",
        vi: "Tôi cần chậu lớn hơn cho cây cảnh này.",
        pronunciation_focus: [
          "SA-ya BU-tuh pot yang LE-bih BE-sar UN-tuk ta-NA-man HI-as I-ni -- `pot` = chậu; `tanaman hias` = cây cảnh.",
          "Mẹo: `lebih + tính từ` = hơn: `lebih besar`, `lebih kecil`, `lebih ringan`.",
          "Luyện: `Saya butuh pot yang lebih besar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tuh pot yang LE-bih BE-sar OON-tuk ta-NA-man HEE-as EE-ni -- `pot` = pot; `tanaman hias` = ornamental plant.",
          "Tip: `lebih + adjective` = more: `lebih besar`, `lebih kecil`, `lebih ringan`.",
          "Drill: `Saya butuh pot yang lebih besar.`",
        ],
      },
      {
        en: "Pupuk apa yang cocok untuk kebun kecil di rumah?",
        vi: "Loại phân bón nào phù hợp cho vườn nhỏ ở nhà?",
        pronunciation_focus: [
          "PU-puk A-pa yang CO-cok UN-tuk KE-bun KE-cil di RU-mah -- `pupuk` = phân bón; `kebun kecil` = vườn nhỏ.",
          "`cocok` đọc CHO-chok vì `c` trong tiếng Indonesia = âm 'ch'.",
          "Luyện: `Pupuk apa yang cocok?`",
        ],
        pronunciation_focus_en: [
          "POO-puk A-pa yang CHO-chok OON-tuk KE-boon KE-chil di ROO-mah -- `pupuk` = fertilizer; `kebun kecil` = small garden.",
          "`Cocok` is CHO-chok because Indonesian `c` makes a 'ch' sound.",
          "Drill: `Pupuk apa yang cocok?`",
        ],
      },
      {
        en: "Daunnya mulai kuning, mungkin kurang cahaya matahari.",
        vi: "Lá bắt đầu vàng, có thể thiếu ánh nắng mặt trời.",
        pronunciation_focus: [
          "DA-un-nya MU-lai KU-ning, MUNG-kin KU-rang CA-ha-ya ma-ta-HA-ri -- `daun` = lá; `cahaya matahari` = ánh nắng mặt trời.",
          "Lỗi người Việt: nói `matahari kurang` nghe thiếu tự nhiên. Dùng `kurang cahaya matahari`.",
          "Luyện: `Tanaman ini kurang cahaya matahari.`",
        ],
        pronunciation_focus_en: [
          "DA-oon-nya MOO-lai KOO-ning, MOONG-kin KOO-rang CHA-ha-ya ma-ta-HA-ri -- `daun` = leaf; `cahaya matahari` = sunlight.",
          "VN-speaker trap: saying `matahari kurang`, which sounds unnatural. Use `kurang cahaya matahari`.",
          "Drill: `Tanaman ini kurang cahaya matahari.`",
        ],
      },
      {
        en: "Ada hama tanaman kecil di bawah daun.",
        vi: "Có sâu/bọ hại cây nhỏ ở dưới lá.",
        pronunciation_focus: [
          "A-da HA-ma ta-NA-man KE-cil di BA-wah DA-un -- `hama tanaman` = sâu/bọ hại cây; `di bawah daun` = dưới lá.",
          "`hama` dùng cho sinh vật gây hại cây, khác với `serangga` chỉ là côn trùng nói chung.",
          "Luyện: `Ada hama tanaman di bawah daun.`",
        ],
        pronunciation_focus_en: [
          "A-da HA-ma ta-NA-man KE-chil di BA-wah DA-oon -- `hama tanaman` = plant pest; `di bawah daun` = under the leaves.",
          "`Hama` means pests that harm plants, while `serangga` is insects in general.",
          "Drill: `Ada hama tanaman di bawah daun.`",
        ],
      },
      {
        en: "Tanaman ini lebih cocok di tempat teduh.",
        vi: "Cây này phù hợp hơn ở nơi râm mát.",
        pronunciation_focus: [
          "ta-NA-man I-ni LE-bih CO-cok di TEM-pat te-DUH -- `tempat teduh` = nơi râm mát/bóng râm.",
          "Mẹo: ở Indonesia nắng mạnh, hỏi `cocok di tempat teduh atau kena matahari langsung?` rất thực tế.",
          "Luyện: `Tanaman ini cocok di tempat teduh.`",
        ],
        pronunciation_focus_en: [
          "ta-NA-man EE-ni LE-bih CHO-chok di TEM-pat te-DOOH -- `tempat teduh` = shady place.",
          "Tip: in strong Indonesian sun, asking `cocok di tempat teduh atau kena matahari langsung?` is practical.",
          "Drill: `Tanaman ini cocok di tempat teduh.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhà phố, kos, hoặc apartemen Indonesia, nhiều người trồng `tanaman hias` trong pot nhỏ, treo ở ban công, hoặc làm `kebun kecil` với cabai, daun bawang, kemangi. Khí hậu nóng ẩm giúp cây lớn nhanh nhưng cũng dễ có `hama tanaman`, rễ busuk vì tưới quá nhiều, hoặc daun kuning vì thiếu/cường độ ánh sáng không hợp. Khi mua cây, hỏi rõ lịch menyiram, pupuk, ukuran pot, dan kebutuhan cahaya matahari.",
    cultural_notes_en:
      "In Indonesian houses, kosts, or apartments, many people keep `tanaman hias` in small pots, hang them on balconies, or make a `kebun kecil` with chili, scallion, or basil. The hot humid climate helps plants grow quickly but also brings plant pests, root rot from overwatering, or yellow leaves when sunlight is wrong. When buying plants, ask clearly about watering schedule, fertilizer, pot size, and sunlight needs.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `tanaman` (cây/cây trồng), `pohon` (cây thân gỗ), `daun` (lá), `akar` (rễ), `pot` (chậu), `pupuk` (phân bón). Với chăm sóc cây, các câu bị động như `perlu disiram`, `perlu dipupuk`, `harus dipindah` rất tự nhiên.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `tanaman` (plant), `pohon` (tree), `daun` (leaf), `akar` (root), `pot` (pot), and `pupuk` (fertilizer). For plant care, passive phrases like `perlu disiram`, `perlu dipupuk`, and `harus dipindah` sound natural.",
    vocabulary: [
      {
        word: "tanaman rumah",
        en: "houseplant",
        vi: "cây trong nhà",
        pos: "noun phrase",
        pronunciation_vi: "ta-NA-man RU-mah",
        pronunciation_en: "ta-NA-man ROO-mah",
      },
      {
        word: "menyiram",
        en: "to water",
        vi: "tưới nước",
        pos: "verb",
        pronunciation_vi: "me-NYI-ram",
        pronunciation_en: "me-NYEE-ram",
      },
      {
        word: "pupuk",
        en: "fertilizer",
        vi: "phân bón",
        pos: "noun",
        pronunciation_vi: "PU-puk",
        pronunciation_en: "POO-puk",
      },
      {
        word: "pot",
        en: "plant pot",
        vi: "chậu cây",
        pos: "noun",
        pronunciation_vi: "pot",
        pronunciation_en: "pot",
      },
      {
        word: "hama tanaman",
        en: "plant pest",
        vi: "sâu/bọ hại cây",
        pos: "noun phrase",
        pronunciation_vi: "HA-ma ta-NA-man",
        pronunciation_en: "HA-ma ta-NA-man",
      },
      {
        word: "kebun kecil",
        en: "small garden",
        vi: "vườn nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "KE-bun KE-cil",
        pronunciation_en: "KE-boon KE-chil",
      },
      {
        word: "tanaman hias",
        en: "ornamental plant",
        vi: "cây cảnh",
        pos: "noun phrase",
        pronunciation_vi: "ta-NA-man HI-as",
        pronunciation_en: "ta-NA-man HEE-as",
      },
      {
        word: "cahaya matahari",
        en: "sunlight",
        vi: "ánh nắng mặt trời",
        pos: "noun phrase",
        pronunciation_vi: "CA-ha-ya ma-ta-HA-ri",
        pronunciation_en: "CHA-ha-ya ma-ta-HA-ri",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Permisi, saya mau tanaman rumah yang mudah dirawat.",
        vi: "Xin phép, tôi muốn cây trong nhà dễ chăm sóc.",
        en: "Excuse me, I want a houseplant that is easy to care for.",
      },
      {
        speaker: "Penjual tanaman",
        text: "Boleh. Tanaman hias ini cocok untuk tempat teduh.",
        vi: "Được. Cây cảnh này phù hợp với nơi râm mát.",
        en: "Sure. This ornamental plant is suitable for a shady spot.",
      },
      {
        speaker: "Pembeli",
        text: "Perlu disiram setiap hari atau dua hari sekali?",
        vi: "Cần tưới mỗi ngày hay hai ngày một lần?",
        en: "Does it need to be watered every day or once every two days?",
      },
      {
        speaker: "Penjual tanaman",
        text: "Dua hari sekali cukup. Jangan terlalu banyak air.",
        vi: "Hai ngày một lần là đủ. Đừng tưới quá nhiều nước.",
        en: "Once every two days is enough. Do not use too much water.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau ada hama tanaman, pupuk atau obat apa yang cocok?",
        vi: "Nếu có sâu/bọ hại cây, phân bón hoặc thuốc nào phù hợp?",
        en: "If there are plant pests, what fertilizer or treatment is suitable?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Cây này cần được tưới mỗi sáng không?'",
        prompt_en: "Translate into Indonesian: 'Does this plant need to be watered every morning?'",
        answer: "Tanaman ini perlu disiram setiap pagi?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya butuh ____ yang lebih besar untuk tanaman ini.`",
        prompt_en: "Fill in the blank: `Saya butuh ____ yang lebih besar untuk tanaman ini.`",
        answer: "pot",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["tanaman hias", "cây cảnh"],
          ["hama tanaman", "sâu/bọ hại cây"],
          ["cahaya matahari", "ánh nắng mặt trời"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở cửa hàng cây. Hỏi cây trong nhà dễ chăm sóc, lịch tưới, loại phân bón, kích cỡ chậu, và cần nắng hay bóng râm.",
        prompt_en:
          "You are at a plant shop. Ask for an easy houseplant, watering schedule, fertilizer type, pot size, and whether it needs sun or shade.",
      },
    ],
    content:
      "Use this lesson for practical Indonesian around houseplants and small gardens: buying easy-care plants, asking about watering, fertilizer, pots, plant pests, ornamental plants, and sunlight needs.",
  },
];
