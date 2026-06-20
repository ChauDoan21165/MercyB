// src/languages/indonesian/extra/childcare-parenting.ts
//
// Indonesian childcare & parenting pack for Vietnamese learners.
// Covers: early childhood & schooling (PAUD, TK, daycare), infant health at the
// Posyandu (imunisasi, ASI, weighing), and everyday parenting talk (anak,
// bayi, mengasuh, popok). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the Indonesian pack has no sibling lessons.ts registry yet
// (A7 owns it) — this file is self-contained on purpose. Types are NOT exported
// and the lesson array uses a unique name so a future barrel `export *` cannot
// collide with the sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, any>;

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

export const childcareParentingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_early_schooling_paud_tk",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Trường mầm non — PAUD, TK và nhà trẻ",
    title_en: "Early schooling — PAUD, TK and daycare",
    sentences: [
      {
        en: "Saya mau mendaftarkan anak saya ke PAUD.",
        vi: "Tôi muốn đăng ký cho con tôi vào trường mầm non (PAUD).",
        pronunciation_focus: [
          "mendaftarkan → 'đăng ký (cho ai)' — gốc daftar + men-…-kan",
          "anak saya → 'con của tôi' — sở hữu đặt SAU danh từ",
          "PAUD → đọc 'pa-UD', giáo dục mầm non sớm",
        ],
        pronunciation_focus_en: [
          "mendaftarkan → 'to enroll (someone)' — root 'daftar' + 'men-…-kan'",
          "anak saya → 'my child' — possessor follows the noun (like 'con của tôi')",
          "PAUD → said 'pa-OOD' — early childhood education",
        ],
      },
      {
        en: "Berapa biaya pendaftaran dan SPP per bulan?",
        vi: "Phí ghi danh và học phí mỗi tháng là bao nhiêu?",
        pronunciation_focus: [
          "biaya → bi-A-ya, 'chi phí'",
          "pendaftaran → 'việc ghi danh' (daftar + pen-…-an)",
          "SPP → 'ès-pe-pe', học phí hàng tháng; per bulan = mỗi tháng",
        ],
        pronunciation_focus_en: [
          "biaya → 'bee-A-ya' — cost/fee",
          "pendaftaran → 'registration' (daftar + 'pen-…-an')",
          "SPP → 'ess-peh-peh' — monthly tuition; per bulan = per month",
        ],
      },
      {
        en: "Anak saya berumur empat tahun.",
        vi: "Con tôi bốn tuổi.",
        pronunciation_focus: [
          "berumur → 'có tuổi/được… tuổi' (gốc umur + ber-)",
          "empat tahun → 'bốn tuổi/năm'",
          "không có động từ 'to be' — 'berumur' đứng thẳng",
        ],
        pronunciation_focus_en: [
          "berumur → 'to be … years old' (root 'umur' + 'ber-')",
          "empat tahun → 'four years'",
          "no separate 'to be' verb — 'berumur' carries it",
        ],
      },
      {
        en: "Jam berapa anak-anak dijemput dari sekolah?",
        vi: "Mấy giờ các cháu được đón từ trường?",
        pronunciation_focus: [
          "anak-anak → 'các cháu/trẻ con' — lặp từ chỉ số nhiều",
          "dijemput → 'được đón' — di- bị động + gốc jemput",
          "jam berapa → 'mấy giờ'",
        ],
        pronunciation_focus_en: [
          "anak-anak → 'children' — reduplication marks the plural",
          "dijemput → 'are picked up' — passive 'di-' + root 'jemput'",
          "jam berapa → 'what time'",
        ],
      },
      {
        en: "Apakah ada makan siang dan tidur siang di sekolah?",
        vi: "Ở trường có ăn trưa và ngủ trưa không?",
        pronunciation_focus: [
          "makan siang → 'bữa trưa' (makan = ăn, siang = trưa)",
          "tidur siang → 'ngủ trưa'",
          "apakah → đánh dấu câu hỏi có/không ở đầu câu",
        ],
        pronunciation_focus_en: [
          "makan siang → 'lunch' (makan = eat, siang = midday)",
          "tidur siang → 'afternoon nap'",
          "apakah → fronted yes/no question marker",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống mầm non Indonesia: 'PAUD' (Pendidikan Anak Usia Dini — giáo dục trẻ thơ, 0–6 tuổi), 'TK' (Taman Kanak-Kanak — mẫu giáo, 4–6 tuổi, giai đoạn ngay trước tiểu học 'SD'). Nhà trẻ tư gọi là 'daycare' hoặc 'tempat penitipan anak (TPA)'. Học phí hàng tháng gọi là 'SPP'. Nhiều gia đình còn nhờ ông bà hoặc 'pengasuh/baby sitter' (người trông trẻ) thay vì gửi nhà trẻ.",
    cultural_notes_en:
      "Indonesia's early-education ladder: 'PAUD' (Pendidikan Anak Usia Dini — early childhood, ages 0–6) and 'TK' (Taman Kanak-Kanak — kindergarten, ages 4–6, right before primary school 'SD'). Private daycare is called 'daycare' or 'tempat penitipan anak (TPA)'. Monthly tuition is 'SPP'. Many families rely on grandparents or a 'pengasuh/baby sitter' (nanny) instead of daycare.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'berumur + số + tahun' là cách nói tuổi — không cần động từ 'là'. 'Anak saya berumur empat tahun' (con tôi bốn tuổi). Khung đăng ký vạn năng: 'Saya mau mendaftarkan … ke …' (Tôi muốn đăng ký … vào …). Nhớ chuỗi cấp học viết tắt: PAUD → TK → SD (tiểu học) → SMP (cấp 2) → SMA (cấp 3).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'berumur + number + tahun' states an age — no 'to be' verb needed. 'Anak saya berumur empat tahun' (my child is four). Reusable enrollment frame: 'Saya mau mendaftarkan … ke …' (I want to enroll … in …). Memorize the school-level abbreviations: PAUD → TK → SD (primary) → SMP (junior high) → SMA (senior high).",
    vocabulary: [
      {
        word: "anak",
        en: "child",
        vi: "con / đứa trẻ",
        pos: "noun",
        pronunciation_vi: "A-nak",
        pronunciation_en: "A-nak",
      },
      {
        word: "PAUD",
        en: "early childhood education",
        vi: "giáo dục mầm non sớm",
        pos: "noun (proper)",
        pronunciation_vi: "pa-UD",
        pronunciation_en: "pa-OOD",
      },
      {
        word: "TK (Taman Kanak-Kanak)",
        en: "kindergarten",
        vi: "trường mẫu giáo",
        pos: "noun",
        pronunciation_vi: "te-KA",
        pronunciation_en: "teh-KA",
      },
      {
        word: "mendaftarkan",
        en: "to enroll / register (someone)",
        vi: "đăng ký (cho ai)",
        pos: "verb",
        pronunciation_vi: "men-daf-TAR-kan",
        pronunciation_en: "men-daf-TAR-kan",
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
        word: "SPP",
        en: "monthly tuition fee",
        vi: "học phí hàng tháng",
        pos: "noun",
        pronunciation_vi: "ès-pe-pe",
        pronunciation_en: "ess-peh-peh",
      },
      {
        word: "berumur",
        en: "to be … years old",
        vi: "được … tuổi",
        pos: "verb",
        pronunciation_vi: "ber-U-mur",
        pronunciation_en: "ber-OO-moor",
      },
      {
        word: "pengasuh",
        en: "carer / nanny",
        vi: "người trông trẻ",
        pos: "noun",
        pronunciation_vi: "peng-A-suh",
        pronunciation_en: "peng-A-sooh",
      },
      {
        word: "tidur siang",
        en: "afternoon nap",
        vi: "ngủ trưa",
        pos: "noun / verb",
        pronunciation_vi: "TI-dur SI-ang",
        pronunciation_en: "TEE-door SEE-ang",
      },
    ],
    dialogue: [
      {
        speaker: "Orang tua",
        text: "Selamat pagi. Saya mau mendaftarkan anak saya ke PAUD ini.",
        vi: "Chào buổi sáng. Tôi muốn đăng ký cho con vào trường mầm non này.",
        en: "Good morning. I'd like to enroll my child in this PAUD.",
      },
      {
        speaker: "Guru",
        text: "Baik, Bu. Anaknya berumur berapa?",
        vi: "Vâng, chị. Cháu mấy tuổi ạ?",
        en: "Sure, ma'am. How old is your child?",
      },
      {
        speaker: "Orang tua",
        text: "Empat tahun. Berapa SPP per bulan?",
        vi: "Bốn tuổi. Học phí mỗi tháng bao nhiêu?",
        en: "Four years old. How much is the monthly tuition?",
      },
      {
        speaker: "Guru",
        text: "Tiga ratus ribu. Sudah termasuk makan siang dan tidur siang.",
        vi: "Ba trăm nghìn. Đã bao gồm ăn trưa và ngủ trưa.",
        en: "Three hundred thousand. It includes lunch and nap time.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về trường mầm non còn thiếu:",
        instruction_en: "Fill in the missing early-schooling word:",
        items: [
          {
            prompt: "Saya mau ___ anak saya ke PAUD. (đăng ký)",
            answer: "mendaftarkan",
            options: ["mendaftarkan", "membersihkan", "memberikan"],
          },
          {
            prompt: "Anak saya ___ empat tahun. (được… tuổi)",
            answer: "berumur",
            options: ["berumur", "berbicara", "berjalan"],
          },
          {
            prompt: "Berapa ___ per bulan? (học phí)",
            answer: "SPP",
            options: ["SPP", "SIM", "STNK"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "anak", answer: "con / đứa trẻ" },
          { prompt: "TK", answer: "trường mẫu giáo" },
          { prompt: "pengasuh", answer: "người trông trẻ" },
          { prompt: "tidur siang", answer: "ngủ trưa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Con tôi bốn tuổi.", answer: "Anak saya berumur empat tahun." },
          { prompt: "Phí ghi danh là bao nhiêu?", answer: "Berapa biaya pendaftaran?" },
          { prompt: "Ở trường có ăn trưa không?", answer: "Apakah ada makan siang di sekolah?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_posyandu_imunisasi_asi",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Posyandu — tiêm chủng, cân nặng và sữa mẹ (ASI)",
    title_en: "Posyandu — immunization, weighing and breast milk (ASI)",
    sentences: [
      {
        en: "Bayi saya perlu imunisasi bulan ini.",
        vi: "Em bé của tôi cần tiêm chủng tháng này.",
        pronunciation_focus: [
          "bayi → BA-yi, 'em bé/trẻ sơ sinh'",
          "imunisasi → i-mu-ni-SA-si, 'tiêm chủng'",
          "perlu → PER-lu, 'cần'",
        ],
        pronunciation_focus_en: [
          "bayi → 'BA-yee' — baby/infant",
          "imunisasi → 'ee-moo-nee-SA-see' — immunization",
          "perlu → 'PER-loo' — to need",
        ],
      },
      {
        en: "Setiap bulan kami menimbang berat badan bayi di Posyandu.",
        vi: "Mỗi tháng chúng tôi cân trọng lượng em bé ở Posyandu.",
        pronunciation_focus: [
          "menimbang → 'cân (đo)' (gốc timbang)",
          "berat badan → 'cân nặng' (berat = nặng, badan = thân thể)",
          "Posyandu → pos-YAN-du, trạm y tế cộng đồng cho mẹ và bé",
        ],
        pronunciation_focus_en: [
          "menimbang → 'to weigh' (root 'timbang')",
          "berat badan → 'body weight' (berat = heavy, badan = body)",
          "Posyandu → 'pos-YAN-doo' — community health post for mothers and infants",
        ],
      },
      {
        en: "Saya memberi ASI eksklusif sampai bayi berumur enam bulan.",
        vi: "Tôi cho bú sữa mẹ hoàn toàn đến khi bé sáu tháng tuổi.",
        pronunciation_focus: [
          "memberi → 'cho/đưa' (gốc beri)",
          "ASI → 'A-si', viết tắt Air Susu Ibu = sữa mẹ",
          "eksklusif → 'hoàn toàn/độc nhất' (mượn 'exclusive')",
        ],
        pronunciation_focus_en: [
          "memberi → 'to give' (root 'beri')",
          "ASI → 'A-see' — Air Susu Ibu = breast milk",
          "eksklusif → 'exclusive' — i.e. breast milk only",
        ],
      },
      {
        en: "Anak saya demam setelah disuntik. Apakah itu normal?",
        vi: "Con tôi bị sốt sau khi tiêm. Điều đó có bình thường không?",
        pronunciation_focus: [
          "disuntik → 'được tiêm' — di- bị động + gốc suntik",
          "setelah → seu-teu-LAH, 'sau khi'",
          "normal → NOR-mal, 'bình thường'",
        ],
        pronunciation_focus_en: [
          "disuntik → 'got an injection' — passive 'di-' + root 'suntik'",
          "setelah → 'se-te-LAH' — after",
          "normal → 'NOR-mal' — normal",
        ],
      },
      {
        en: "Kapan jadwal imunisasi berikutnya?",
        vi: "Lịch tiêm chủng tiếp theo là khi nào?",
        pronunciation_focus: [
          "kapan → KA-pan, 'khi nào'",
          "jadwal → JAD-wal, 'lịch/thời gian biểu'",
          "berikutnya → 'tiếp theo'",
        ],
        pronunciation_focus_en: [
          "kapan → 'KA-pan' — when",
          "jadwal → 'JAD-wal' — schedule",
          "berikutnya → 'the next one'",
        ],
      },
    ],
    cultural_notes_vi:
      "'Posyandu' (Pos Pelayanan Terpadu) là trạm y tế cộng đồng cấp thôn/xóm, do tình nguyện viên 'kader' điều hành mỗi tháng một lần: cân bé, tiêm chủng, phát vitamin A, tư vấn dinh dưỡng. Hoàn toàn miễn phí. 'ASI' (Air Susu Ibu = sữa mẹ) được khuyến nghị 'eksklusif' (hoàn toàn) đến 6 tháng. Sổ theo dõi sức khỏe trẻ là 'buku KIA' (Kesehatan Ibu dan Anak) màu hồng. Đây là xương sống của y tế dự phòng cho trẻ ở Indonesia.",
    cultural_notes_en:
      "A 'Posyandu' (Pos Pelayanan Terpadu) is a neighborhood-level community health post, run monthly by 'kader' volunteers: weighing babies, immunizations, vitamin A, and nutrition advice. It's free. 'ASI' (Air Susu Ibu = breast milk) is recommended 'eksklusif' (exclusively) until 6 months. The child's health record is the pink 'buku KIA' (Kesehatan Ibu dan Anak). It's the backbone of Indonesia's preventive child healthcare.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt 'memberi' (cho/đưa — chủ động) với 'diberi' (được cho — bị động). Nhãn y tế hay dùng bị động 'di-': disuntik (được tiêm), ditimbang (được cân), diberi vitamin (được phát vitamin). Học viết tắt: ASI (sữa mẹ), KIA (sức khỏe mẹ & bé), Posyandu (trạm y tế cộng đồng). Khung hỏi lịch: 'Kapan jadwal … berikutnya?'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish 'memberi' (to give — active) from 'diberi' (to be given — passive). Medical labels lean on passive 'di-': disuntik (was injected), ditimbang (was weighed), diberi vitamin (was given vitamins). Learn the abbreviations: ASI (breast milk), KIA (maternal & child health), Posyandu (community health post). Schedule-question frame: 'Kapan jadwal … berikutnya?'.",
    vocabulary: [
      {
        word: "bayi",
        en: "baby / infant",
        vi: "em bé",
        pos: "noun",
        pronunciation_vi: "BA-yi",
        pronunciation_en: "BA-yee",
      },
      {
        word: "imunisasi",
        en: "immunization",
        vi: "tiêm chủng",
        pos: "noun",
        pronunciation_vi: "i-mu-ni-SA-si",
        pronunciation_en: "ee-moo-nee-SA-see",
      },
      {
        word: "Posyandu",
        en: "community health post",
        vi: "trạm y tế cộng đồng",
        pos: "noun (proper)",
        pronunciation_vi: "pos-YAN-du",
        pronunciation_en: "pos-YAN-doo",
      },
      {
        word: "ASI (Air Susu Ibu)",
        en: "breast milk",
        vi: "sữa mẹ",
        pos: "noun",
        pronunciation_vi: "A-si",
        pronunciation_en: "A-see",
      },
      {
        word: "menimbang",
        en: "to weigh",
        vi: "cân (đo)",
        pos: "verb",
        pronunciation_vi: "meu-nim-BANG",
        pronunciation_en: "me-nim-BANG",
      },
      {
        word: "berat badan",
        en: "body weight",
        vi: "cân nặng",
        pos: "noun",
        pronunciation_vi: "beu-RAT BA-dan",
        pronunciation_en: "be-RAT BA-dan",
      },
      {
        word: "disuntik",
        en: "to be injected / given a shot",
        vi: "được tiêm",
        pos: "verb (passive)",
        pronunciation_vi: "di-SUN-tik",
        pronunciation_en: "dee-SOON-tik",
      },
      {
        word: "jadwal",
        en: "schedule",
        vi: "lịch / thời gian biểu",
        pos: "noun",
        pronunciation_vi: "JAD-wal",
        pronunciation_en: "JAD-wal",
      },
      {
        word: "vitamin",
        en: "vitamin",
        vi: "vitamin",
        pos: "noun",
        pronunciation_vi: "vi-ta-MIN",
        pronunciation_en: "vee-ta-MIN",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Bu kader, bayi saya perlu imunisasi bulan ini?",
        vi: "Chị tình nguyện ơi, em bé tôi tháng này cần tiêm chủng không?",
        en: "Volunteer, does my baby need an immunization this month?",
      },
      {
        speaker: "Kader",
        text: "Iya, Bu. Kita timbang dulu, lalu disuntik.",
        vi: "Vâng, chị. Mình cân trước, rồi tiêm.",
        en: "Yes, ma'am. We'll weigh first, then give the shot.",
      },
      {
        speaker: "Ibu",
        text: "Nanti dia demam tidak setelah disuntik?",
        vi: "Sau khi tiêm cháu có bị sốt không?",
        en: "Will she get a fever after the injection?",
      },
      {
        speaker: "Kader",
        text: "Mungkin sedikit, itu normal. Tetap beri ASI, ya.",
        vi: "Có thể hơi sốt, đó là bình thường. Vẫn cho bú sữa mẹ nhé.",
        en: "Maybe a little, that's normal. Keep breastfeeding, okay.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về Posyandu còn thiếu:",
        instruction_en: "Fill in the missing Posyandu word:",
        items: [
          {
            prompt: "Bayi saya perlu ___ bulan ini. (tiêm chủng)",
            answer: "imunisasi",
            options: ["imunisasi", "informasi", "imigrasi"],
          },
          {
            prompt: "Setiap bulan kami ___ berat badan bayi. (cân)",
            answer: "menimbang",
            options: ["menimbang", "membaca", "menutup"],
          },
          {
            prompt: "Anak saya demam setelah ___. (được tiêm)",
            answer: "disuntik",
            options: ["disuntik", "ditutup", "ditolak"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bayi", answer: "em bé" },
          { prompt: "ASI", answer: "sữa mẹ" },
          { prompt: "berat badan", answer: "cân nặng" },
          { prompt: "jadwal", answer: "lịch" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Em bé của tôi cần tiêm chủng tháng này.", answer: "Bayi saya perlu imunisasi bulan ini." },
          { prompt: "Tôi cho bú sữa mẹ hoàn toàn đến sáu tháng.", answer: "Saya memberi ASI eksklusif sampai enam bulan." },
          { prompt: "Lịch tiêm chủng tiếp theo là khi nào?", answer: "Kapan jadwal imunisasi berikutnya?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_everyday_parenting",
    level: "B1",
    category: "childcare_parenting",
    title_vi: "Nuôi dạy con hằng ngày — chăm sóc và kỷ luật nhẹ nhàng",
    title_en: "Everyday parenting — caregiving and gentle discipline",
    sentences: [
      {
        en: "Tolong jaga adik selama saya pergi.",
        vi: "Làm ơn trông em trong lúc tôi đi vắng.",
        pronunciation_focus: [
          "jaga → JA-ga, 'trông/giữ'",
          "adik → A-dik, 'em (nhỏ hơn)' — khác kakak (anh/chị)",
          "selama → seu-LA-ma, 'trong suốt/trong lúc'",
        ],
        pronunciation_focus_en: [
          "jaga → 'JA-ga' — to watch/look after",
          "adik → 'A-dik' — younger sibling (vs. 'kakak' = older sibling)",
          "selama → 'se-LA-ma' — during / while",
        ],
      },
      {
        en: "Sudah waktunya ganti popok dan mandi.",
        vi: "Đã đến giờ thay tã và tắm.",
        pronunciation_focus: [
          "sudah waktunya → 'đã đến lúc/giờ'",
          "ganti popok → 'thay tã' (ganti = đổi, popok = tã)",
          "mandi → MAN-di, 'tắm'",
        ],
        pronunciation_focus_en: [
          "sudah waktunya → 'it's time'",
          "ganti popok → 'change the diaper' (ganti = change, popok = diaper)",
          "mandi → 'MAN-dee' — to bathe",
        ],
      },
      {
        en: "Jangan main gadget terlalu lama, ya, Nak.",
        vi: "Đừng chơi điện thoại quá lâu nhé, con.",
        pronunciation_focus: [
          "jangan → JANG-an, 'đừng' (phủ định mệnh lệnh)",
          "gadget → 'gad-get', thiết bị điện tử (mượn)",
          "Nak → gọi trìu mến 'con' (rút gọn của anak)",
        ],
        pronunciation_focus_en: [
          "jangan → 'JANG-an' — 'don't' (negative imperative)",
          "gadget → 'gad-jet' — electronic device (loanword)",
          "Nak → affectionate 'child/kiddo' (short for 'anak')",
        ],
      },
      {
        en: "Kalau kamu rajin belajar, nanti Ibu beri hadiah.",
        vi: "Nếu con chăm học, lát nữa mẹ sẽ thưởng.",
        pronunciation_focus: [
          "kalau → KA-lau, 'nếu'",
          "rajin → RA-jin, 'chăm chỉ'",
          "Ibu (mẹ) tự xưng ngôi ba với con — nét văn hoá; hadiah = phần thưởng",
        ],
        pronunciation_focus_en: [
          "kalau → 'KA-low' — if",
          "rajin → 'RA-jin' — diligent / hardworking",
          "a mother refers to herself in the third person ('Ibu') to her child — cultural; hadiah = reward",
        ],
      },
      {
        en: "Anak itu sangat manja kepada ibunya.",
        vi: "Đứa bé đó rất nũng nịu với mẹ.",
        pronunciation_focus: [
          "manja → MAN-ja, 'nũng nịu/được nuông chiều'",
          "kepada → keu-pa-DA, 'đối với/tới (người)'",
          "ibunya → 'mẹ của nó' (ibu + -nya)",
        ],
        pronunciation_focus_en: [
          "manja → 'MAN-ja' — clingy / spoiled / craving affection",
          "kepada → 'ke-pa-DA' — toward / to (a person)",
          "ibunya → 'his/her mother' (ibu + '-nya')",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong gia đình Indonesia, cha mẹ thường tự xưng ngôi ba khi nói với con — 'Ibu' (mẹ), 'Ayah/Bapak' (cha) — thay vì 'tôi/anh', để dạy con cách xưng hô kính trọng. Gọi con trìu mến là 'Nak'. Vai vế anh em phân biệt rõ: 'kakak' (anh/chị lớn) và 'adik' (em nhỏ) — không có từ trung tính như 'sibling'. 'Manja' (nũng nịu) thường được nhìn nhận tích cực với trẻ nhỏ. Ông bà thường tham gia sâu vào việc nuôi cháu.",
    cultural_notes_en:
      "In Indonesian families, parents often refer to themselves in the third person to their children — 'Ibu' (mom), 'Ayah/Bapak' (dad) — instead of 'I', to model respectful address. A child is affectionately called 'Nak'. Sibling rank is explicit: 'kakak' (older sibling) and 'adik' (younger sibling) — there's no neutral 'sibling' word. 'Manja' (clingy/affectionate) is usually viewed positively in small children. Grandparents are often deeply involved in raising the kids.",
    tip_advice_vi:
      "Mẹo cho người Việt: vai vế anh em đặt theo TUỔI giống tiếng Việt — kakak (anh/chị), adik (em) — không có từ chung như tiếng Anh 'sibling', nên dễ với người Việt. Câu điều kiện dùng 'kalau' (nếu) + mệnh đề, không cần 'thì': 'Kalau rajin, nanti dapat hadiah.' Phủ định mệnh lệnh luôn dùng 'jangan', không phải 'tidak': Jangan + động từ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: sibling terms are ranked by AGE just like Vietnamese — kakak (older), adik (younger) — with no English-style neutral 'sibling', so this feels natural. Conditionals use 'kalau' (if) + clause, no 'then' needed: 'Kalau rajin, nanti dapat hadiah.' Negative commands always use 'jangan', never 'tidak': Jangan + verb.",
    vocabulary: [
      {
        word: "jaga",
        en: "to watch / look after",
        vi: "trông / giữ",
        pos: "verb",
        pronunciation_vi: "JA-ga",
        pronunciation_en: "JA-ga",
      },
      {
        word: "popok",
        en: "diaper",
        vi: "tã",
        pos: "noun",
        pronunciation_vi: "PÔ-pok",
        pronunciation_en: "POH-pok",
      },
      {
        word: "mandi",
        en: "to bathe",
        vi: "tắm",
        pos: "verb",
        pronunciation_vi: "MAN-di",
        pronunciation_en: "MAN-dee",
      },
      {
        word: "kakak",
        en: "older sibling",
        vi: "anh / chị",
        pos: "noun",
        pronunciation_vi: "KA-kak",
        pronunciation_en: "KA-kak",
      },
      {
        word: "adik",
        en: "younger sibling",
        vi: "em",
        pos: "noun",
        pronunciation_vi: "A-dik",
        pronunciation_en: "A-dik",
      },
      {
        word: "rajin",
        en: "diligent / hardworking",
        vi: "chăm chỉ",
        pos: "adjective",
        pronunciation_vi: "RA-jin",
        pronunciation_en: "RA-jin",
      },
      {
        word: "manja",
        en: "clingy / spoiled (affectionate)",
        vi: "nũng nịu",
        pos: "adjective",
        pronunciation_vi: "MAN-ja",
        pronunciation_en: "MAN-ja",
      },
      {
        word: "hadiah",
        en: "gift / reward",
        vi: "phần thưởng / quà",
        pos: "noun",
        pronunciation_vi: "ha-DI-ah",
        pronunciation_en: "ha-DEE-ah",
      },
      {
        word: "nakal",
        en: "naughty",
        vi: "nghịch ngợm / hư",
        pos: "adjective",
        pronunciation_vi: "NA-kal",
        pronunciation_en: "NA-kal",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Kakak, tolong jaga adik selama Ibu masak, ya.",
        vi: "Con (lớn) ơi, trông em giúp mẹ trong lúc mẹ nấu ăn nhé.",
        en: "Sweetie (older child), please watch your little sibling while Mom cooks.",
      },
      {
        speaker: "Anak",
        text: "Iya, Bu. Tapi adik nakal, main gadget terus.",
        vi: "Vâng mẹ. Nhưng em hư lắm, cứ chơi điện thoại suốt.",
        en: "Okay, Mom. But the little one is naughty, always on the gadget.",
      },
      {
        speaker: "Ibu",
        text: "Bilang, 'Jangan main gadget terlalu lama.' Suruh dia mandi.",
        vi: "Bảo em: 'Đừng chơi điện thoại quá lâu.' Bảo em đi tắm.",
        en: "Tell him, 'Don't play on the gadget too long.' Have him take a bath.",
      },
      {
        speaker: "Anak",
        text: "Baik. Kalau dia rajin, boleh dapat hadiah?",
        vi: "Dạ. Nếu em ngoan thì được thưởng không ạ?",
        en: "Okay. If he behaves, can he get a reward?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nuôi dạy con còn thiếu:",
        instruction_en: "Fill in the missing parenting word:",
        items: [
          {
            prompt: "Tolong ___ adik selama saya pergi. (trông)",
            answer: "jaga",
            options: ["jaga", "jual", "jalan"],
          },
          {
            prompt: "Sudah waktunya ganti ___ dan mandi. (tã)",
            answer: "popok",
            options: ["popok", "pintu", "piring"],
          },
          {
            prompt: "___ main gadget terlalu lama, Nak. (đừng)",
            answer: "Jangan",
            options: ["Jangan", "Jadi", "Justru"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kakak", answer: "anh / chị" },
          { prompt: "adik", answer: "em" },
          { prompt: "rajin", answer: "chăm chỉ" },
          { prompt: "hadiah", answer: "phần thưởng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Làm ơn trông em trong lúc tôi đi vắng.", answer: "Tolong jaga adik selama saya pergi." },
          { prompt: "Đã đến giờ thay tã và tắm.", answer: "Sudah waktunya ganti popok dan mandi." },
          { prompt: "Nếu con chăm học, mẹ sẽ thưởng.", answer: "Kalau kamu rajin belajar, Ibu beri hadiah." },
        ],
      },
    ],
  },
];

export default childcareParentingLessons;
