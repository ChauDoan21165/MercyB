// Baby & Toddler Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian
// extra format: `en` holds the TARGET-LANGUAGE sentence (Indonesian), `vi`
// holds the Vietnamese gloss, and pronunciation_focus carries Vietnamese L1
// notes with English companion notes in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const babyToddlerLessons: IndonesianLesson[] = [
  {
    id: "indonesian_baby_toddler_posyandu",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Em bé và trẻ nhỏ — ASI, MPASI và Posyandu",
    title_en: "Baby and toddler care — ASI, MPASI and Posyandu",
    sentences: [
      {
        en: "Bayi saya baru lahir minggu lalu.",
        vi: "Em bé của tôi mới sinh tuần trước.",
        pronunciation_focus: [
          "BA-yi SA-ya BA-ru LA-hir MING-gu LA-lu — `bayi` = em bé sơ sinh; `baru lahir` = mới sinh.",
          "Lỗi người Việt: dùng `anak kecil` cho trẻ sơ sinh. Nói chính xác là `bayi`.",
          "Luyện: `Bayi saya baru lahir minggu lalu.`",
        ],
        pronunciation_focus_en: [
          "BA-yi SA-ya BA-ru LA-hir MING-gu LA-lu — `bayi` = baby/infant; `baru lahir` = newly born.",
          "VN-speaker trap: using `anak kecil` for a newborn. The precise word is `bayi`.",
          "Drill: `Bayi saya baru lahir minggu lalu.`",
        ],
      },
      {
        en: "Balita saya sudah bisa jalan.",
        vi: "Bé nhà tôi đã biết đi rồi.",
        pronunciation_focus: [
          "ba-LI-ta SA-ya SU-dah BI-sa JA-lan — `balita` = trẻ dưới năm tuổi; `bisa jalan` = biết đi/có thể đi.",
          "Lỗi người Việt: dịch từng chữ 'biết đi' thành `tahu jalan`. Khả năng làm gì dùng `bisa`, không `tahu`.",
          "Luyện: `Balita saya sudah bisa jalan.`",
        ],
        pronunciation_focus_en: [
          "ba-LEE-ta SA-ya SU-dah BEE-sa JA-lan — `balita` = child under five; `bisa jalan` = can walk.",
          "VN-speaker trap: translating 'knows how to walk' as `tahu jalan`. Ability uses `bisa`, not `tahu`.",
          "Drill: `Balita saya sudah bisa jalan.`",
        ],
      },
      {
        en: "Saya memberi ASI eksklusif selama enam bulan.",
        vi: "Tôi cho bú sữa mẹ hoàn toàn trong sáu tháng.",
        pronunciation_focus: [
          "mem-BE-ri A-es-I eks-klu-SIF se-LA-ma e-NAM BU-lan — `ASI` = sữa mẹ; `eksklusif` = hoàn toàn.",
          "Lỗi người Việt: nói `susu ibu` nghe dịch chữ. Thuật ngữ y tế và đời thường là `ASI`.",
          "Luyện: `Saya memberi ASI eksklusif selama enam bulan.`",
        ],
        pronunciation_focus_en: [
          "mem-BE-ri AH-ess-EE eks-klu-SEEF se-LA-ma e-NAM BU-lan — `ASI` = breast milk; `eksklusif` = exclusive.",
          "VN-speaker trap: saying translated `susu ibu`. The normal health term is `ASI`.",
          "Drill: `Saya memberi ASI eksklusif selama enam bulan.`",
        ],
      },
      {
        en: "Sekarang bayi saya mulai MPASI.",
        vi: "Bây giờ em bé của tôi bắt đầu ăn dặm.",
        pronunciation_focus: [
          "se-KA-rang BA-yi SA-ya mu-LAI em-pe-a-es-I — `MPASI` = thức ăn bổ sung sau giai đoạn ASI.",
          "Lỗi người Việt: nói `makan tambahan` được hiểu nhưng không chuẩn bằng `MPASI` trong y tế trẻ em.",
          "Luyện: `Sekarang bayi saya mulai MPASI.`",
        ],
        pronunciation_focus_en: [
          "se-KA-rang BA-yi SA-ya mu-LAI em-peh-ah-ess-EE — `MPASI` = complementary feeding after breast milk.",
          "VN-speaker trap: `makan tambahan` may be understood, but child-health settings use `MPASI`.",
          "Drill: `Sekarang bayi saya mulai MPASI.`",
        ],
      },
      {
        en: "Saya pantau tumbuh kembang anak di Posyandu.",
        vi: "Tôi theo dõi sự tăng trưởng và phát triển của con ở Posyandu.",
        pronunciation_focus: [
          "PAN-tau TUM-buh KEM-bang A-nak di po-SYAN-du — `tumbuh kembang` = tăng trưởng và phát triển; `pantau` = theo dõi.",
          "Lỗi người Việt: tách `tumbuh` và `kembang` như hai việc riêng. Cụm cố định là `tumbuh kembang`.",
          "Luyện: `Saya pantau tumbuh kembang anak di Posyandu.`",
        ],
        pronunciation_focus_en: [
          "PAN-tau TOOM-booh KEM-bang A-nak di po-SYAN-doo — `tumbuh kembang` = growth and development; `pantau` = monitor.",
          "VN-speaker trap: treating `tumbuh` and `kembang` as unrelated items. The fixed phrase is `tumbuh kembang`.",
          "Drill: `Saya pantau tumbuh kembang anak di Posyandu.`",
        ],
      },
      {
        en: "Kapan jadwal imunisasi berikutnya?",
        vi: "Lịch tiêm chủng tiếp theo là khi nào?",
        pronunciation_focus: [
          "KA-pan JAD-wal i-mu-ni-SA-si be-ri-KUT-nya — `imunisasi` = tiêm chủng; `berikutnya` = tiếp theo.",
          "Lỗi người Việt: dùng `vaksin` cho cả sự kiện tiêm. `vaksin` là vaccine; `imunisasi` là lịch/việc tiêm chủng.",
          "Luyện: `Kapan jadwal imunisasi berikutnya?`",
        ],
        pronunciation_focus_en: [
          "KA-pan JAD-wal i-mu-ni-SA-si be-ri-KOOT-nya — `imunisasi` = immunization; `berikutnya` = next.",
          "VN-speaker trap: using `vaksin` for the appointment. `vaksin` is the vaccine; `imunisasi` is the immunization event/schedule.",
          "Drill: `Kapan jadwal imunisasi berikutnya?`",
        ],
      },
      {
        en: "Popoknya harus diganti sekarang.",
        vi: "Tã của bé phải được thay bây giờ.",
        pronunciation_focus: [
          "PO-pok-nya HA-rus di-GAN-ti se-KA-rang — `popok` = tã; `diganti` = được thay.",
          "Lỗi người Việt: quên bị động `di-`. Với tã được thay: `popoknya diganti`, không phải `popoknya ganti`.",
          "Luyện: `Popoknya harus diganti sekarang.`",
        ],
        pronunciation_focus_en: [
          "PO-pok-nya HA-rus di-GAN-ti se-KA-rang — `popok` = diaper; `diganti` = be changed.",
          "VN-speaker trap: dropping passive `di-`. For a diaper being changed: `popoknya diganti`, not `popoknya ganti`.",
          "Drill: `Popoknya harus diganti sekarang.`",
        ],
      },
      {
        en: "Anak saya demam setelah imunisasi.",
        vi: "Con tôi bị sốt sau khi tiêm chủng.",
        pronunciation_focus: [
          "A-nak SA-ya de-MAM se-TE-lah i-mu-ni-SA-si — `demam` = sốt; `setelah` = sau khi.",
          "Lỗi người Việt: nói `panas` cho sốt trong tình huống y tế. Có thể nghe thấy `panas`, nhưng từ rõ nhất là `demam`.",
          "Luyện: `Anak saya demam setelah imunisasi.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya de-MAM se-TE-lah i-mu-ni-SA-si — `demam` = feverish; `setelah` = after.",
          "VN-speaker trap: using `panas` for fever in a medical setting. You may hear it casually, but `demam` is clearer.",
          "Drill: `Anak saya demam setelah imunisasi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "`Posyandu` là điểm dịch vụ y tế cộng đồng ở khu dân cư Indonesia, thường có cân đo trẻ, theo dõi `tumbuh kembang`, tư vấn ASI/MPASI và lịch `imunisasi`. `ASI eksklusif` thường được khuyến nghị trong 6 tháng đầu, rồi bắt đầu `MPASI`. Cha mẹ thường mang `buku KIA` để ghi cân nặng, chiều cao và lịch tiêm.",
    cultural_notes_en:
      "`Posyandu` is a community health post in Indonesian neighborhoods, commonly used for weighing children, tracking `tumbuh kembang`, ASI/MPASI counseling, and `imunisasi` schedules. `ASI eksklusif` is commonly recommended for the first six months, followed by `MPASI`. Parents often bring the `buku KIA` to record weight, height, and immunization dates.",
    tip_advice_vi:
      "Mẹo cho người Việt: `bayi` = em bé/sơ sinh, `balita` = trẻ dưới 5 tuổi, `anak` = con/trẻ nói chung. Trong y tế trẻ em, học các viết tắt ASI, MPASI, KIA vì người Indonesia dùng rất thường xuyên. Với lịch, dùng khung `Kapan jadwal ... berikutnya?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `bayi` = baby/infant, `balita` = under-five child, and `anak` = child in general. In child-health settings, learn the abbreviations ASI, MPASI, and KIA because Indonesians use them often. For schedules, use `Kapan jadwal ... berikutnya?`.",
    vocabulary: [
      { cell_id: "bd870e60-1b18-4e95-913c-bd855a5a77ab", word: "bayi", en: "baby / infant", vi: "em bé / trẻ sơ sinh", pos: "noun", pronunciation_vi: "BA-yi", pronunciation_en: "BA-yee" },
      { cell_id: "e6da8ed9-7fe4-4503-9df7-165e021b5be6", word: "balita", en: "child under five", vi: "trẻ dưới 5 tuổi", pos: "noun", pronunciation_vi: "ba-LI-ta", pronunciation_en: "ba-LEE-ta" },
      { cell_id: "62e889d4-4fc0-4942-b8d4-f98914185348", word: "ASI", en: "breast milk", vi: "sữa mẹ", pos: "noun", pronunciation_vi: "a-es-I", pronunciation_en: "ah-ess-EE" },
      { cell_id: "6873fc92-ad04-4b20-a5f0-1273aa4c8740", word: "MPASI", en: "complementary baby food", vi: "ăn dặm / thức ăn bổ sung", pos: "noun", pronunciation_vi: "em-pe-a-es-I", pronunciation_en: "em-peh-ah-ess-EE" },
      { cell_id: "17847c29-59cd-43ca-97bd-e296940ecb5a", word: "tumbuh kembang", en: "growth and development", vi: "tăng trưởng và phát triển", pos: "noun phrase", pronunciation_vi: "TUM-buh KEM-bang", pronunciation_en: "TOOM-booh KEM-bang" },
      { cell_id: "34e6e5ed-91a2-4ad8-bcf4-777d24266085", word: "imunisasi", en: "immunization", vi: "tiêm chủng", pos: "noun", pronunciation_vi: "i-mu-ni-SA-si", pronunciation_en: "i-mu-ni-SA-see" },
      { cell_id: "86762315-9ebf-470b-8f19-fe8ad73b4cc0", word: "Posyandu", en: "community health post", vi: "điểm y tế cộng đồng", pos: "noun (proper)", pronunciation_vi: "po-SYAN-du", pronunciation_en: "po-SYAN-doo" },
      { cell_id: "8d3dc46f-1231-4a6d-bda3-123ce3e507a6", word: "popok", en: "diaper", vi: "tã", pos: "noun", pronunciation_vi: "PO-pok", pronunciation_en: "PO-pok" },
      { cell_id: "e7d7cb60-cce2-49b0-af9a-8c7109912532", word: "demam", en: "fever", vi: "sốt", pos: "noun / adjective", pronunciation_vi: "de-MAM", pronunciation_en: "de-MAM" },
    ],
    dialogue: [
      {
        cell_id: "342f3c03-a3cf-4451-b3e2-5081f9cc3a16",
        speaker: "Orang tua",
        text: "Selamat pagi, Bu. Saya mau timbang bayi saya.",
        vi: "Chào buổi sáng cô. Tôi muốn cân em bé của tôi.",
        en: "Good morning, ma'am. I want to weigh my baby.",
      },
      {
        cell_id: "3d0b39c8-bf16-4e34-99c4-f1fafabca954",
        speaker: "Kader Posyandu",
        text: "Baik. Tolong bawa buku KIA dan kartu imunisasi.",
        vi: "Vâng. Làm ơn mang sổ KIA và thẻ tiêm chủng.",
        en: "Okay. Please bring the KIA book and immunization card.",
      },
      {
        cell_id: "2349635a-ab1a-4a11-b3c3-bc635a82313b",
        speaker: "Orang tua",
        text: "Kapan jadwal imunisasi berikutnya?",
        vi: "Lịch tiêm chủng tiếp theo là khi nào?",
        en: "When is the next immunization schedule?",
      },
      {
        cell_id: "2de2a1b1-6b9f-4e81-8fc2-f98b0f6baf93",
        speaker: "Kader Posyandu",
        text: "Bulan depan. Kalau demam tinggi, segera periksa ke Puskesmas.",
        vi: "Tháng sau. Nếu sốt cao, hãy đi khám ở Puskesmas ngay.",
        en: "Next month. If there is a high fever, get checked at the Puskesmas immediately.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Popoknya harus ___ sekarang.`",
        prompt_en: "Fill in the blank: `Popoknya harus ___ sekarang.`",
        answer: "diganti",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Lịch tiêm chủng tiếp theo là khi nào?",
        prompt_en: "Translate into Indonesian: When is the next immunization schedule?",
        answer: "Kapan jadwal imunisasi berikutnya?",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["bayi", "em bé / trẻ sơ sinh"],
          ["balita", "trẻ dưới 5 tuổi"],
          ["ASI", "sữa mẹ"],
          ["MPASI", "ăn dặm"],
          ["popok", "tã"],
        ],
      },
    ],
  },
];
