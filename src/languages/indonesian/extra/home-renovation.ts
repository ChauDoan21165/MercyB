// Home Renovation Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_home_renovation",
    level: "A2",
    category: "housing",
    title_vi: "Cải tạo nhà: thợ, sơn tường, mái dột",
    title_en: "Home renovation: workers, wall paint and leaking roofs",
    sentences: [
      {
        en: "Saya mau renovasi rumah bulan depan.",
        vi: "Tôi muốn cải tạo nhà vào tháng sau.",
        pronunciation_focus: [
          "SA-ya mau re-no-VA-si RU-mah BU-lan de-PAN -- `renovasi rumah` = cải tạo/sửa sang nhà.",
          "Mẹo: `bulan depan` = tháng sau; `depan` nghĩa gốc là phía trước nhưng dùng cho thời gian sắp tới.",
          "Luyện: `Saya mau renovasi rumah bulan depan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau re-no-VA-si ROO-mah BOO-lan de-PAN -- `renovasi rumah` = home renovation.",
          "Tip: `bulan depan` = next month; `depan` literally means front but marks upcoming time.",
          "Drill: `Saya mau renovasi rumah bulan depan.`",
        ],
      },
      {
        en: "Saya butuh tukang untuk cat tembok.",
        vi: "Tôi cần thợ để sơn tường.",
        pronunciation_focus: [
          "SA-ya BU-tuh TU-kang UN-tuk chat TEM-bok -- `tukang` = thợ; `cat tembok` = sơn tường.",
          "Lỗi người Việt: đọc `cat` như tiếng Anh 'cat'. Trong Indonesia, `c` đọc 'ch': `cat` = chat.",
          "Luyện: `Saya butuh tukang untuk cat tembok.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tuh TOO-kang OON-tuk chat TEM-bok -- `tukang` = tradesperson; `cat tembok` = wall paint / paint walls.",
          "VN-speaker trap: reading `cat` like English 'cat'. Indonesian `c` is 'ch': `cat` = chat.",
          "Drill: `Saya butuh tukang untuk cat tembok.`",
        ],
      },
      {
        en: "Keramik kamar mandi perlu diganti.",
        vi: "Gạch men phòng tắm cần được thay.",
        pronunciation_focus: [
          "ke-RA-mik KA-mar MAN-di PER-lu di-GAN-ti -- `keramik` = gạch men; `diganti` = được thay.",
          "`perlu diganti` là mẫu rất hữu ích khi nói việc sửa nhà: cần được thay, không nêu ai làm.",
          "Luyện: `Keramik perlu diganti.`",
        ],
        pronunciation_focus_en: [
          "ke-RA-mik KA-mar MAN-di PER-loo di-GAN-ti -- `keramik` = ceramic tile; `diganti` = replaced.",
          "`perlu diganti` is a useful renovation pattern: needs to be replaced, without naming who does it.",
          "Drill: `Keramik perlu diganti.`",
        ],
      },
      {
        en: "Atap bocor kalau hujan deras.",
        vi: "Mái nhà bị dột khi mưa to.",
        pronunciation_focus: [
          "A-tap BO-chor KA-lau HU-jan de-RAS -- `atap` = mái; `bocor` = dột/rò rỉ; `hujan deras` = mưa to.",
          "Lỗi người Việt: dùng `rusak` cho mọi thứ. Mái dột, ống nước rò, vòi chảy đều dùng `bocor`.",
          "Luyện: `Atap bocor kalau hujan.`",
        ],
        pronunciation_focus_en: [
          "A-tap BO-chor KA-lau HOO-jan de-RAS -- `atap` = roof; `bocor` = leaking; `hujan deras` = heavy rain.",
          "VN-speaker trap: using `rusak` for everything. Leaking roofs, pipes, and taps use `bocor`.",
          "Drill: `Atap bocor kalau hujan.`",
        ],
      },
      {
        en: "Bahan bangunannya sudah dibeli semua?",
        vi: "Vật liệu xây dựng đã được mua hết chưa?",
        pronunciation_focus: [
          "BA-han ba-NGU-nan-nya SU-dah di-BE-li se-MU-a -- `bahan bangunan` = vật liệu xây dựng.",
          "`sudah` hỏi việc đã xong chưa; rất hợp với mua vật liệu, đặt lịch, thanh toán.",
          "Luyện: `Bahan bangunannya sudah dibeli?`",
        ],
        pronunciation_focus_en: [
          "BA-han ba-NGOO-nan-nya SOO-dah di-BE-li se-MOO-a -- `bahan bangunan` = building materials.",
          "`sudah` asks whether something is already done; useful for buying materials, scheduling, and payment.",
          "Drill: `Bahan bangunannya sudah dibeli?`",
        ],
      },
      {
        en: "Berapa biaya renovasi sampai selesai?",
        vi: "Chi phí cải tạo đến khi xong là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa bi-A-ya re-no-VA-si SAM-pai se-le-SAI -- `biaya` = chi phí; `sampai selesai` = đến khi hoàn thành.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Tiền/chi phí phải hỏi bằng `berapa`: `biayanya berapa?`",
          "Luyện: `Berapa biaya renovasi?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa bee-A-ya re-no-VA-si SAM-pai se-le-SAI -- `biaya` = cost; `sampai selesai` = until finished.",
          "VN-speaker trap: asking price with `apa`. Money/cost questions use `berapa`: `biayanya berapa?`",
          "Drill: `Berapa biaya renovasi?`",
        ],
      },
      {
        en: "Jadwal kerja tukang mulai jam delapan pagi.",
        vi: "Lịch làm việc của thợ bắt đầu lúc tám giờ sáng.",
        pronunciation_focus: [
          "JAD-wal KER-ja TU-kang MU-lai jam de-LA-pan PA-gi -- `jadwal kerja` = lịch làm việc; `mulai` = bắt đầu.",
          "`jam delapan pagi` = 8 giờ sáng. Không cần giới từ trước `jam` trong câu giờ giấc này.",
          "Luyện: `Jadwal kerja mulai jam delapan pagi.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal KER-ja TOO-kang MOO-lai jam de-LA-pan PA-gi -- `jadwal kerja` = work schedule; `mulai` = starts.",
          "`jam delapan pagi` = 8 a.m. No extra preposition is needed before `jam` here.",
          "Drill: `Jadwal kerja mulai jam delapan pagi.`",
        ],
      },
      {
        en: "Tolong kabari saya kalau ada biaya tambahan.",
        vi: "Xin báo cho tôi nếu có chi phí phát sinh.",
        pronunciation_focus: [
          "TO-long ka-BA-ri SA-ya KA-lau A-da bi-A-ya tam-BA-han -- `biaya tambahan` = chi phí thêm/phát sinh.",
          "`Tolong + động từ` là mẫu nhờ lịch sự. Dùng với thợ để chốt giao tiếp rõ ràng trước khi phát sinh tiền.",
          "Luyện: `Tolong kabari saya kalau ada biaya tambahan.`",
        ],
        pronunciation_focus_en: [
          "TO-long ka-BA-ri SA-ya KA-lau A-da bee-A-ya tam-BA-han -- `biaya tambahan` = additional cost.",
          "`Tolong + verb` is a polite request frame. Use it with workers to keep communication clear before extra costs appear.",
          "Drill: `Tolong kabari saya kalau ada biaya tambahan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `tukang` là cách gọi chung cho thợ tay nghề: thợ sơn, thợ mái, thợ điện, thợ nước. Khi cải tạo nhà, nên hỏi rõ phạm vi việc, ai mua `bahan bangunan`, chi phí nhân công, lịch làm việc, và khả năng có `biaya tambahan`. Với việc nhỏ có thể thỏa thuận miệng, nhưng việc lớn nên ghi lại danh sách việc, giá, ngày bắt đầu, ngày dự kiến xong, và điều kiện thanh toán.",
    cultural_notes_en:
      "In Indonesia, `tukang` is the general word for a skilled tradesperson: painter, roofer, electrician, plumber. For renovations, clarify the scope, who buys the building materials, labor cost, work schedule, and possible additional costs. Small jobs may be agreed verbally, but larger work should have a written list of tasks, price, start date, expected finish date, and payment terms.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ các cặp rất thực dụng: `cat tembok` (sơn tường), `keramik diganti` (gạch được thay), `atap bocor` (mái dột), `bahan bangunan` (vật liệu), `biaya renovasi` (chi phí cải tạo), `jadwal kerja` (lịch làm). Tiếng Indonesia không chia động từ, nên tập cụm cố định giúp nói nhanh với thợ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize practical chunks: `cat tembok` (paint walls), `keramik diganti` (tiles replaced), `atap bocor` (roof leaks), `bahan bangunan` (materials), `biaya renovasi` (renovation cost), `jadwal kerja` (work schedule). Indonesian has no verb conjugation, so fixed chunks help you speak quickly with workers.",
    vocabulary: [
      {
        word: "renovasi rumah",
        en: "home renovation",
        vi: "cải tạo nhà",
        pos: "noun phrase",
        pronunciation_vi: "re-no-VA-si RU-mah",
        pronunciation_en: "re-no-VA-si ROO-mah",
      },
      {
        word: "tukang",
        en: "tradesperson / worker",
        vi: "thợ",
        pos: "noun",
        pronunciation_vi: "TU-kang",
        pronunciation_en: "TOO-kang",
      },
      {
        word: "cat tembok",
        en: "wall paint / paint walls",
        vi: "sơn tường",
        pos: "noun / verb phrase",
        pronunciation_vi: "chat TEM-bok",
        pronunciation_en: "chat TEM-bok",
      },
      {
        word: "keramik",
        en: "ceramic tile",
        vi: "gạch men",
        pos: "noun",
        pronunciation_vi: "ke-RA-mik",
        pronunciation_en: "ke-RA-mik",
      },
      {
        word: "atap bocor",
        en: "leaking roof",
        vi: "mái dột",
        pos: "phrase",
        pronunciation_vi: "A-tap BO-chor",
        pronunciation_en: "A-tap BO-chor",
      },
      {
        word: "bahan bangunan",
        en: "building materials",
        vi: "vật liệu xây dựng",
        pos: "noun phrase",
        pronunciation_vi: "BA-han ba-NGU-nan",
        pronunciation_en: "BA-han ba-NGOO-nan",
      },
      {
        word: "biaya",
        en: "cost / fee",
        vi: "chi phí",
        pos: "noun",
        pronunciation_vi: "bi-A-ya",
        pronunciation_en: "bee-A-ya",
      },
      {
        word: "jadwal kerja",
        en: "work schedule",
        vi: "lịch làm việc",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal KER-ja",
        pronunciation_en: "JAD-wal KER-ja",
      },
      {
        word: "biaya tambahan",
        en: "additional cost",
        vi: "chi phí phát sinh",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya tam-BA-han",
        pronunciation_en: "bee-A-ya tam-BA-han",
      },
      {
        word: "selesai",
        en: "finished",
        vi: "xong / hoàn thành",
        pos: "adjective / verb",
        pronunciation_vi: "se-le-SAI",
        pronunciation_en: "se-le-SAI",
      },
    ],
    dialogue: [
      {
        speaker: "Pemilik rumah",
        text: "Pak, saya mau renovasi rumah kecil-kecilan.",
        vi: "Anh ơi, tôi muốn cải tạo nhà một chút.",
        en: "Sir, I want to do a small home renovation.",
      },
      {
        speaker: "Tukang",
        text: "Bagian mana yang mau direnovasi?",
        vi: "Phần nào muốn cải tạo ạ?",
        en: "Which part do you want renovated?",
      },
      {
        speaker: "Pemilik rumah",
        text: "Tembok mau dicat, keramik kamar mandi perlu diganti, dan atap bocor.",
        vi: "Tường cần sơn, gạch men phòng tắm cần thay, và mái bị dột.",
        en: "The walls need painting, the bathroom tiles need replacing, and the roof leaks.",
      },
      {
        speaker: "Tukang",
        text: "Saya hitung dulu biaya bahan bangunan dan ongkos kerja.",
        vi: "Tôi tính trước chi phí vật liệu xây dựng và tiền công.",
        en: "I will calculate the cost of materials and labor first.",
      },
      {
        speaker: "Pemilik rumah",
        text: "Baik, tolong kabari saya kalau ada biaya tambahan.",
        vi: "Vâng, xin báo cho tôi nếu có chi phí phát sinh.",
        en: "Okay, please let me know if there are additional costs.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn cải tạo nhà vào tháng sau.",
        prompt_en: "Translate into Indonesian: I want to renovate the house next month.",
        answer: "Saya mau renovasi rumah bulan depan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Atap ____ kalau hujan deras.",
        prompt_en: "Fill in the blank: Atap ____ kalau hujan deras.",
        answer: "bocor",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["tukang", "thợ / tradesperson"],
          ["cat tembok", "sơn tường / paint walls"],
          ["bahan bangunan", "vật liệu xây dựng / building materials"],
          ["biaya tambahan", "chi phí phát sinh / additional cost"],
        ],
      },
    ],
    content:
      "Useful renovation chunks: `Saya mau renovasi rumah` (I want to renovate the house), `Saya butuh tukang` (I need a worker), `Atap bocor` (the roof leaks), `Berapa biaya renovasi?` (how much is the renovation cost?), and `Tolong kabari saya kalau ada biaya tambahan` (please let me know if there are additional costs).",
  },
];
