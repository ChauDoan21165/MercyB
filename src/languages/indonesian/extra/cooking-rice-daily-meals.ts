// Cooking Rice & Daily Meals Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_cooking_rice_daily_meals",
    level: "A2",
    category: "food",
    title_vi: "Nấu cơm và bữa ăn hằng ngày",
    title_en: "Cooking rice and daily meals",
    sentences: [
      {
        en: "Saya mau masak nasi untuk makan siang.",
        vi: "Tôi muốn nấu cơm cho bữa trưa.",
        pronunciation_focus: [
          "SA-ya mau MA-sak NA-si UN-tuk MA-kan si-ANG -- `masak nasi` = nấu cơm; `makan siang` = bữa trưa/ăn trưa.",
          "Lỗi người Việt: dịch 'cơm' lúc nào cũng là `beras`. `Beras` = gạo sống; `nasi` = cơm đã nấu.",
          "Luyện: `Saya mau masak nasi untuk makan siang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau MA-sak NA-si OON-tuk MA-kan see-ANG -- `masak nasi` = cook rice; `makan siang` = lunch.",
          "VN-speaker trap: translating 'cơm' as `beras` every time. `Beras` = uncooked rice; `nasi` = cooked rice.",
          "Drill: `Saya mau masak nasi untuk makan siang.`",
        ],
      },
      {
        en: "Berasnya sudah dicuci sebelum masuk rice cooker.",
        vi: "Gạo đã được vo/rửa trước khi cho vào nồi cơm điện.",
        pronunciation_focus: [
          "BE-ras-nya SU-dah di-CU-ci se-BE-lum MA-suk rais KU-ker -- `dicuci` = được rửa; `rice cooker` = nồi cơm điện.",
          "`c` trong `cuci` đọc 'ch': di-CHU-chi. Đây là lỗi phát âm rất hay gặp của người Việt.",
          "Luyện: `Berasnya sudah dicuci.`",
        ],
        pronunciation_focus_en: [
          "BE-ras-nya SOO-dah di-CHOO-chee se-BE-lum MA-suk rice COO-ker -- `dicuci` = washed; `rice cooker` = rice cooker.",
          "`c` in `cuci` sounds like 'ch': di-CHOO-chee. This is a common Vietnamese-speaker pronunciation trap.",
          "Drill: `Berasnya sudah dicuci.`",
        ],
      },
      {
        en: "Airnya jangan terlalu banyak, nanti nasinya lembek.",
        vi: "Đừng cho quá nhiều nước, lát nữa cơm sẽ nhão.",
        pronunciation_focus: [
          "A-ir-nya JA-ngan ter-LA-lu BA-nyak, NAN-ti NA-si-nya LEM-bek -- `lembek` = mềm nhão.",
          "`jangan terlalu...` = đừng quá...; dùng cho nấu ăn rất nhiều: `jangan terlalu asin`, `jangan terlalu pedas`.",
          "Luyện: `Airnya jangan terlalu banyak.`",
        ],
        pronunciation_focus_en: [
          "A-ir-nya JA-ngan ter-LA-loo BA-nyak, NAN-ti NA-si-nya LEM-bek -- `lembek` = mushy/too soft.",
          "`jangan terlalu...` = don't make it too...; common in cooking: `jangan terlalu asin`, `jangan terlalu pedas`.",
          "Drill: `Airnya jangan terlalu banyak.`",
        ],
      },
      {
        en: "Lauknya hari ini ayam goreng dan telur dadar.",
        vi: "Món ăn kèm hôm nay là gà chiên và trứng chiên.",
        pronunciation_focus: [
          "LA-uk-nya HA-ri I-ni A-yam GO-reng dan te-LUR DA-dar -- `lauk` = món mặn/món ăn kèm cơm.",
          "Lỗi người Việt: nói `makanan samping` theo từng chữ. Trong bữa cơm Indonesia, món ăn với cơm là `lauk`.",
          "Luyện: `Lauknya ayam goreng dan telur dadar.`",
        ],
        pronunciation_focus_en: [
          "LA-ook-nya HA-ri EE-ni A-yam GO-reng dan te-LOOR DA-dar -- `lauk` = side dish/protein eaten with rice.",
          "VN-speaker trap: literal `makanan samping`. In an Indonesian rice meal, dishes eaten with rice are `lauk`.",
          "Drill: `Lauknya ayam goreng dan telur dadar.`",
        ],
      },
      {
        en: "Saya masak sayur bening supaya tidak terlalu berat.",
        vi: "Tôi nấu canh rau trong để bữa ăn không quá nặng.",
        pronunciation_focus: [
          "SA-ya MA-sak SA-yur BE-ning su-PA-ya TI-dak ter-LA-lu BE-rat -- `sayur bening` = canh rau trong/nhẹ.",
          "`supaya` = để/nhằm cho. Không cần chia động từ sau `supaya`.",
          "Luyện: `Saya masak sayur bening.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-sak SA-yur BE-ning soo-PA-ya TI-dak ter-LA-loo BE-rat -- `sayur bening` = clear vegetable soup.",
          "`supaya` = so that/in order to. No verb conjugation after `supaya`.",
          "Drill: `Saya masak sayur bening.`",
        ],
      },
      {
        en: "Sambalnya sedikit saja, saya tidak kuat pedas.",
        vi: "Cho sambal một chút thôi, tôi không ăn cay giỏi.",
        pronunciation_focus: [
          "SAM-bal-nya se-DI-kit SA-ja, SA-ya TI-dak KU-at pe-DAS -- `tidak kuat pedas` = không chịu cay được.",
          "Mẹo: `kuat pedas` là cách nói tự nhiên hơn dịch từng chữ 'ăn cay được'.",
          "Luyện: `Saya tidak kuat pedas.`",
        ],
        pronunciation_focus_en: [
          "SAM-bal-nya se-DEE-kit SA-ja, SA-ya TI-dak KOO-at pe-DAS -- `tidak kuat pedas` = cannot handle spicy food.",
          "Tip: `kuat pedas` is more natural than a literal translation of 'can eat spicy'.",
          "Drill: `Saya tidak kuat pedas.`",
        ],
      },
      {
        en: "Saya siapkan bekal untuk anak sebelum sekolah.",
        vi: "Tôi chuẩn bị cơm hộp cho con trước khi đi học.",
        pronunciation_focus: [
          "SA-ya si-AP-kan BE-kal UN-tuk A-nak se-BE-lum se-KO-lah -- `bekal` = đồ ăn mang theo/cơm hộp.",
          "Lỗi người Việt: dùng `kotak nasi` cho ý 'cơm mang theo'. Từ tự nhiên là `bekal`.",
          "Luyện: `Saya siapkan bekal untuk anak.`",
        ],
        pronunciation_focus_en: [
          "SA-ya see-AP-kan BE-kal OON-tuk A-nak se-BE-lum se-KO-lah -- `bekal` = packed meal/food to bring.",
          "VN-speaker trap: using `kotak nasi` for the idea of packed lunch. The natural word is `bekal`.",
          "Drill: `Saya siapkan bekal untuk anak.`",
        ],
      },
      {
        en: "Masakan rumahan biasanya lebih sederhana tapi enak.",
        vi: "Món nhà nấu thường đơn giản hơn nhưng ngon.",
        pronunciation_focus: [
          "ma-SA-kan ru-MA-han bi-A-sa-nya LE-bih se-der-HA-na TA-pi E-nak -- `masakan rumahan` = món nhà nấu.",
          "`lebih + tính từ` = hơn: `lebih sederhana`, `lebih enak`, `lebih murah`.",
          "Luyện: `Masakan rumahan lebih sederhana tapi enak.`",
        ],
        pronunciation_focus_en: [
          "ma-SA-kan roo-MA-han bee-A-sa-nya LE-bih se-der-HA-na TA-pi E-nak -- `masakan rumahan` = home cooking.",
          "`lebih + adjective` = more: `lebih sederhana`, `lebih enak`, `lebih murah`.",
          "Drill: `Masakan rumahan lebih sederhana tapi enak.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong bữa ăn Indonesia, `nasi` thường là trung tâm bữa ăn, đi cùng `lauk` như gà, cá, trứng, tempe, tahu; thêm `sayur` và `sambal`. `Rice cooker` rất phổ biến trong gia đình, giống nồi cơm điện ở Việt Nam. `Bekal` là đồ ăn mang theo đi học hoặc đi làm. `Masakan rumahan` nhấn mạnh món nhà nấu, đơn giản, quen miệng, không phải đồ nhà hàng.",
    cultural_notes_en:
      "In Indonesian meals, `nasi` is often the center, served with `lauk` such as chicken, fish, egg, tempeh, or tofu, plus vegetables and sambal. A `rice cooker` is common at home, just like in Vietnam. `Bekal` is food packed for school or work. `Masakan rumahan` emphasizes simple, familiar home cooking rather than restaurant food.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `beras` (gạo sống), `nasi` (cơm chín), `lauk` (món ăn kèm cơm), `sayur` (rau/canh rau), `sambal` (tương ớt), và `bekal` (cơm/đồ ăn mang theo). Cấu trúc nấu ăn rất gọn vì không chia động từ: `Saya masak nasi`, `Saya siapkan bekal`, `Saya tidak kuat pedas`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `beras` (uncooked rice), `nasi` (cooked rice), `lauk` (dish eaten with rice), `sayur` (vegetables/vegetable soup), `sambal` (chili paste), and `bekal` (packed meal). Cooking sentences stay compact because Indonesian has no verb conjugation: `Saya masak nasi`, `Saya siapkan bekal`, `Saya tidak kuat pedas`.",
    vocabulary: [
      {
        word: "nasi",
        en: "cooked rice",
        vi: "cơm chín",
        pos: "noun",
        pronunciation_vi: "NA-si",
        pronunciation_en: "NA-see",
      },
      {
        word: "beras",
        en: "uncooked rice",
        vi: "gạo sống",
        pos: "noun",
        pronunciation_vi: "BE-ras",
        pronunciation_en: "BE-ras",
      },
      {
        word: "lauk",
        en: "side dish eaten with rice",
        vi: "món ăn kèm cơm",
        pos: "noun",
        pronunciation_vi: "LA-uk",
        pronunciation_en: "LA-ook",
      },
      {
        word: "sayur",
        en: "vegetables / vegetable dish",
        vi: "rau / món rau",
        pos: "noun",
        pronunciation_vi: "SA-yur",
        pronunciation_en: "SA-yur",
      },
      {
        word: "sambal",
        en: "chili paste",
        vi: "tương ớt sambal",
        pos: "noun",
        pronunciation_vi: "SAM-bal",
        pronunciation_en: "SAM-bal",
      },
      {
        word: "rice cooker",
        en: "rice cooker",
        vi: "nồi cơm điện",
        pos: "noun",
        pronunciation_vi: "rais KU-ker",
        pronunciation_en: "rice COO-ker",
      },
      {
        word: "bekal",
        en: "packed meal",
        vi: "cơm/đồ ăn mang theo",
        pos: "noun",
        pronunciation_vi: "BE-kal",
        pronunciation_en: "BE-kal",
      },
      {
        word: "makan siang",
        en: "lunch",
        vi: "bữa trưa / ăn trưa",
        pos: "noun / verb phrase",
        pronunciation_vi: "MA-kan si-ANG",
        pronunciation_en: "MA-kan see-ANG",
      },
      {
        word: "masakan rumahan",
        en: "home cooking",
        vi: "món nhà nấu",
        pos: "noun phrase",
        pronunciation_vi: "ma-SA-kan ru-MA-han",
        pronunciation_en: "ma-SA-kan roo-MA-han",
      },
      {
        word: "tidak kuat pedas",
        en: "cannot handle spicy food",
        vi: "không chịu cay được",
        pos: "phrase",
        pronunciation_vi: "TI-dak KU-at pe-DAS",
        pronunciation_en: "TI-dak KOO-at pe-DAS",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Nasinya sudah matang di rice cooker?",
        vi: "Cơm trong nồi cơm điện đã chín chưa?",
        en: "Is the rice already cooked in the rice cooker?",
      },
      {
        speaker: "Anak",
        text: "Sudah, Bu. Lauknya apa untuk makan siang?",
        vi: "Rồi mẹ. Món ăn kèm cho bữa trưa là gì?",
        en: "Yes, Mom. What side dish is for lunch?",
      },
      {
        speaker: "Ibu",
        text: "Ada ayam goreng, sayur bening, dan sambal sedikit.",
        vi: "Có gà chiên, canh rau trong, và một chút sambal.",
        en: "There is fried chicken, clear vegetable soup, and a little sambal.",
      },
      {
        speaker: "Anak",
        text: "Tolong sambalnya sedikit saja. Saya tidak kuat pedas.",
        vi: "Làm ơn cho sambal ít thôi. Con không chịu cay được.",
        en: "Please only a little sambal. I cannot handle spicy food.",
      },
      {
        speaker: "Ibu",
        text: "Baik. Bekalnya juga sudah saya siapkan.",
        vi: "Được. Cơm hộp cũng mẹ chuẩn bị rồi.",
        en: "Okay. I have also prepared the packed meal.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn nấu cơm cho bữa trưa.",
        prompt_en: "Translate into Indonesian: I want to cook rice for lunch.",
        answer: "Saya mau masak nasi untuk makan siang.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: ____ = gạo sống, nasi = cơm chín.",
        prompt_en: "Fill in the blank: ____ = uncooked rice, nasi = cooked rice.",
        answer: "Beras",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["nasi", "cơm chín / cooked rice"],
          ["lauk", "món ăn kèm cơm / side dish"],
          ["bekal", "đồ ăn mang theo / packed meal"],
          ["masakan rumahan", "món nhà nấu / home cooking"],
        ],
      },
    ],
    content:
      "Useful daily-meal chunks: `Saya mau masak nasi` (I want to cook rice), `Berasnya sudah dicuci` (the uncooked rice has been washed), `Lauknya apa?` (what is the side dish?), `Sambalnya sedikit saja` (only a little sambal), `Saya siapkan bekal` (I prepare a packed meal), and `Masakan rumahan enak` (home cooking is delicious).",
  },
];
