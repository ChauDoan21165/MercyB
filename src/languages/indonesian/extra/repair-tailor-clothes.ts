// Clothes Repair & Tailor Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_repair_tailor_clothes",
    level: "A2",
    category: "services",
    title_vi: "Sửa quần áo và đi tiệm may",
    title_en: "Clothes repair and visiting a tailor",
    sentences: [
      {
        en: "Saya mau permak baju ini.",
        vi: "Tôi muốn sửa bộ quần áo này.",
        pronunciation_focus: [
          "SA-ya mau PER-mak BA-ju I-ni -- `permak baju` = sửa/chỉnh quần áo cho vừa.",
          "Lỗi người Việt: dùng `memperbaiki baju` cho mọi việc. Ở tiệm may, từ đời thường rất tự nhiên là `permak`.",
          "Luyện: `Saya mau permak baju ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PER-mak BA-joo EE-ni -- `permak baju` = alter/fix clothes to fit.",
          "VN-speaker trap: using `memperbaiki baju` for everything. At a tailor, the everyday word is `permak`.",
          "Drill: `Saya mau permak baju ini.`",
        ],
      },
      {
        en: "Ada penjahit dekat sini?",
        vi: "Gần đây có thợ may không?",
        pronunciation_focus: [
          "A-da pen-JA-hit de-KAT SI-ni -- `penjahit` = thợ may; `dekat sini` = gần đây.",
          "`pen-...` thường tạo danh từ người làm nghề: `jahit` = may, `penjahit` = thợ may.",
          "Luyện: `Ada penjahit dekat sini?`",
        ],
        pronunciation_focus_en: [
          "A-da pen-JA-hit de-KAT SEE-ni -- `penjahit` = tailor; `dekat sini` = near here.",
          "`Pen-...` often forms a person noun: `jahit` = sew, `penjahit` = tailor.",
          "Drill: `Ada penjahit dekat sini?`",
        ],
      },
      {
        en: "Tolong ukur badan saya dulu.",
        vi: "Làm ơn đo người tôi trước.",
        pronunciation_focus: [
          "TO-long U-kur BA-dan SA-ya DU-lu -- `ukur badan` = đo số đo cơ thể; `dulu` = trước đã.",
          "Mẹo: `tolong + động từ` là cách nhờ lịch sự trong dịch vụ: `tolong ukur`, `tolong jahit`, `tolong pendekkan`.",
          "Luyện: `Tolong ukur badan saya dulu.`",
        ],
        pronunciation_focus_en: [
          "TO-long OO-kur BA-dan SA-ya DOO-loo -- `ukur badan` = take body measurements; `dulu` = first.",
          "Tip: `tolong + verb` is a polite service request: `tolong ukur`, `tolong jahit`, `tolong pendekkan`.",
          "Drill: `Tolong ukur badan saya dulu.`",
        ],
      },
      {
        en: "Celana ini kepanjangan, bisa dipendekkan?",
        vi: "Cái quần này dài quá, có thể cắt/ngắn lại không?",
        pronunciation_focus: [
          "ce-LA-na I-ni ke-pan-JANG-an, BI-sa di-pen-DEK-kan -- `kepanjangan` = dài quá; `dipendekkan` = được làm ngắn lại.",
          "Lỗi người Việt: nói `terlalu panjang` được, nhưng trong khẩu ngữ sửa đồ `kepanjangan` rất tự nhiên.",
          "Luyện: `Celana ini kepanjangan.`",
        ],
        pronunciation_focus_en: [
          "che-LA-na EE-ni ke-pan-JANG-an, BEE-sa di-pen-DEK-kan -- `kepanjangan` = too long; `dipendekkan` = shortened.",
          "VN-speaker trap: `terlalu panjang` works, but for alterations `kepanjangan` sounds very natural.",
          "Drill: `Celana ini kepanjangan.`",
        ],
      },
      {
        en: "Kancing kemeja saya lepas, bisa dijahit lagi?",
        vi: "Nút áo sơ mi của tôi bị bung, có thể may lại không?",
        pronunciation_focus: [
          "KAN-ching ke-ME-ja SA-ya LE-pas, BI-sa di-JA-hit LA-gi -- `kancing` = nút áo; `lepas` = bung/rơi ra.",
          "`dijahit lagi` = được may lại. Dùng bị động `di-` vì bạn yêu cầu dịch vụ được làm trên đồ của mình.",
          "Luyện: `Kancing kemeja saya lepas.`",
        ],
        pronunciation_focus_en: [
          "KAN-ching ke-ME-ja SA-ya LE-pas, BEE-sa di-JA-hit LA-gi -- `kancing` = button; `lepas` = came off.",
          "`Dijahit lagi` = sewn again. Use passive `di-` because you request a service done to your item.",
          "Drill: `Kancing kemeja saya lepas.`",
        ],
      },
      {
        en: "Bahan kainnya agak tipis, jangan dijahit terlalu kencang.",
        vi: "Chất vải hơi mỏng, đừng may quá chặt.",
        pronunciation_focus: [
          "BA-han KAIN-nya A-gak TI-pis, JA-ngan di-JA-hit ter-LA-lu KEN-chang -- `bahan kain` = chất/vật liệu vải.",
          "`agak` = hơi; `jangan terlalu...` = đừng quá... Cặp này hữu ích khi dặn thợ may.",
          "Luyện: `Bahan kainnya agak tipis.`",
        ],
        pronunciation_focus_en: [
          "BA-han KAIN-nya A-gak TEE-pis, JA-ngan di-JA-hit ter-LA-loo KEN-chang -- `bahan kain` = fabric material.",
          "`Agak` = a bit; `jangan terlalu...` = don't make it too... Useful when giving a tailor instructions.",
          "Drill: `Bahan kainnya agak tipis.`",
        ],
      },
      {
        en: "Ongkos jahitnya berapa kalau selesai besok?",
        vi: "Tiền công may là bao nhiêu nếu xong ngày mai?",
        pronunciation_focus: [
          "ONG-kos JA-hit-nya be-RA-pa KA-lau se-le-SAI BE-sok -- `ongkos jahit` = tiền công may/sửa.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Với tiền công/chi phí, hỏi `berapa`: `ongkosnya berapa?`",
          "Luyện: `Ongkos jahitnya berapa?`",
        ],
        pronunciation_focus_en: [
          "ONG-kos JA-hit-nya be-RA-pa KA-lau se-le-SAI BE-sok -- `ongkos jahit` = sewing/alteration fee.",
          "VN-speaker trap: asking price with `apa`. For fees/costs, ask `berapa`: `ongkosnya berapa?`",
          "Drill: `Ongkos jahitnya berapa?`",
        ],
      },
      {
        en: "Saya ambil baju ini hari Sabtu sore.",
        vi: "Tôi lấy bộ đồ này vào chiều thứ Bảy.",
        pronunciation_focus: [
          "SA-ya AM-bil BA-ju I-ni HA-ri SAB-tu SO-re -- `ambil` = lấy/nhận lại; `Sabtu sore` = chiều thứ Bảy.",
          "Trong dịch vụ, `ambil` thường nghĩa là quay lại lấy đồ đã làm xong, không phải 'mua'.",
          "Luyện: `Saya ambil hari Sabtu sore.`",
        ],
        pronunciation_focus_en: [
          "SA-ya AM-bil BA-joo EE-ni HA-ri SAB-too SO-re -- `ambil` = pick up; `Sabtu sore` = Saturday afternoon/evening.",
          "In service contexts, `ambil` often means picking up a finished item, not buying it.",
          "Drill: `Saya ambil hari Sabtu sore.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, tiệm sửa quần áo nhỏ thường ghi `permak jeans`, `permak baju`, hoặc `penjahit`. Việc phổ biến gồm cắt gấu quần, bóp eo, thay khóa kéo, may lại kancing, và sửa áo dài/rộng. Hãy nói rõ ngày cần lấy đồ, hỏi `ongkos jahit`, và nếu vải mỏng hoặc đồ đắt tiền thì dặn trước để thợ cẩn thận.",
    cultural_notes_en:
      "In Indonesia, small alteration shops often advertise `permak jeans`, `permak baju`, or `penjahit`. Common jobs include hemming pants, taking in the waist, replacing zippers, sewing buttons back on, and adjusting clothes that are too long or too loose. State when you need pickup, ask the sewing fee, and warn the tailor if the fabric is thin or the garment is valuable.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm dịch vụ: `permak baju`, `ukur badan`, `celana kepanjangan`, `jahit kancing`, `bahan kain`, `ongkos jahit`. Tiếng Indonesia hay dùng bị động `di-` khi yêu cầu sửa đồ: `dipendekkan`, `dijahit`, `dikecilkan`, `diganti`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn service chunks: `permak baju`, `ukur badan`, `celana kepanjangan`, `jahit kancing`, `bahan kain`, `ongkos jahit`. Indonesian often uses passive `di-` when requesting alterations: `dipendekkan`, `dijahit`, `dikecilkan`, `diganti`.",
    vocabulary: [
      {
        word: "permak baju",
        en: "alter/fix clothes",
        vi: "sửa quần áo",
        pos: "verb phrase",
        pronunciation_vi: "PER-mak BA-ju",
        pronunciation_en: "PER-mak BA-joo",
      },
      {
        word: "penjahit",
        en: "tailor",
        vi: "thợ may",
        pos: "noun",
        pronunciation_vi: "pen-JA-hit",
        pronunciation_en: "pen-JA-hit",
      },
      {
        word: "ukur badan",
        en: "take body measurements",
        vi: "đo người / lấy số đo",
        pos: "verb phrase",
        pronunciation_vi: "U-kur BA-dan",
        pronunciation_en: "OO-kur BA-dan",
      },
      {
        word: "celana kepanjangan",
        en: "pants are too long",
        vi: "quần dài quá",
        pos: "phrase",
        pronunciation_vi: "ce-LA-na ke-pan-JANG-an",
        pronunciation_en: "che-LA-na ke-pan-JANG-an",
      },
      {
        word: "jahit kancing",
        en: "sew a button",
        vi: "may nút áo",
        pos: "verb phrase",
        pronunciation_vi: "JA-hit KAN-ching",
        pronunciation_en: "JA-hit KAN-ching",
      },
      {
        word: "bahan kain",
        en: "fabric material",
        vi: "chất vải / vật liệu vải",
        pos: "noun phrase",
        pronunciation_vi: "BA-han KAIN",
        pronunciation_en: "BA-han KAIN",
      },
      {
        word: "ongkos jahit",
        en: "sewing fee",
        vi: "tiền công may",
        pos: "noun phrase",
        pronunciation_vi: "ONG-kos JA-hit",
        pronunciation_en: "ONG-kos JA-hit",
      },
      {
        word: "dipendekkan",
        en: "shortened",
        vi: "được làm ngắn lại",
        pos: "verb",
        pronunciation_vi: "di-pen-DEK-kan",
        pronunciation_en: "di-pen-DEK-kan",
      },
      {
        word: "dikecilkan",
        en: "made smaller / taken in",
        vi: "được sửa nhỏ lại",
        pos: "verb",
        pronunciation_vi: "di-ke-CHIL-kan",
        pronunciation_en: "di-ke-CHIL-kan",
      },
      {
        word: "ambil",
        en: "pick up / take",
        vi: "lấy / nhận lại",
        pos: "verb",
        pronunciation_vi: "AM-bil",
        pronunciation_en: "AM-bil",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Mbak, saya mau permak celana ini.",
        vi: "Chị ơi, tôi muốn sửa cái quần này.",
        en: "Miss, I want to alter these pants.",
      },
      {
        speaker: "Penjahit",
        text: "Bagian mana yang mau dipermak?",
        vi: "Phần nào muốn sửa ạ?",
        en: "Which part do you want altered?",
      },
      {
        speaker: "Pelanggan",
        text: "Celananya kepanjangan. Tolong dipendekkan sedikit.",
        vi: "Quần dài quá. Làm ơn sửa ngắn lại một chút.",
        en: "The pants are too long. Please shorten them a little.",
      },
      {
        speaker: "Penjahit",
        text: "Baik. Ongkos jahitnya tiga puluh ribu.",
        vi: "Được. Tiền công may là ba mươi nghìn.",
        en: "Okay. The sewing fee is thirty thousand.",
      },
      {
        speaker: "Pelanggan",
        text: "Bisa selesai besok sore? Saya ambil setelah kerja.",
        vi: "Có thể xong chiều mai không? Tôi lấy sau giờ làm.",
        en: "Can it be finished tomorrow afternoon? I will pick it up after work.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Cái quần này dài quá, có thể sửa ngắn lại không?",
        prompt_en: "Translate into Indonesian: These pants are too long, can they be shortened?",
        answer: "Celana ini kepanjangan, bisa dipendekkan?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kancing kemeja saya ____, bisa dijahit lagi?",
        prompt_en: "Fill in the blank: Kancing kemeja saya ____, bisa dijahit lagi?",
        answer: "lepas",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["penjahit", "thợ may / tailor"],
          ["ukur badan", "đo người / take measurements"],
          ["ongkos jahit", "tiền công may / sewing fee"],
          ["dipendekkan", "được làm ngắn lại / shortened"],
        ],
      },
    ],
    content:
      "Useful tailor chunks: `Saya mau permak baju ini` (I want to alter these clothes), `Tolong ukur badan saya` (please take my measurements), `Celana ini kepanjangan` (these pants are too long), `Kancingnya lepas` (the button came off), `Ongkos jahitnya berapa?` (how much is the sewing fee?), and `Saya ambil hari Sabtu` (I will pick it up on Saturday).",
  },
];
