// src/languages/indonesian/extra/pregnancy-health.ts
//
// Indonesian pregnancy & maternal-health pack for Vietnamese learners.
// Covers: announcing a pregnancy and antenatal check-ups at the Puskesmas /
// bidan (hamil, kontrol kehamilan, USG), giving birth and the newborn period
// (melahirkan, bidan, ASI), and family planning / postnatal care (KB, Posyandu,
// imunisasi). Hand-crafted, no filler.
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

export const pregnancyHealthLessons: IndonesianLesson[] = [
  {
    id: "indonesian_pregnancy_antenatal",
    level: "A2",
    category: "pregnancy_health",
    title_vi: "Mang thai và khám thai ở Puskesmas",
    title_en: "Pregnancy and antenatal check-ups at the Puskesmas",
    sentences: [
      {
        en: "Saya sedang hamil dua bulan.",
        vi: "Tôi đang mang thai hai tháng.",
        pronunciation_focus: [
          "sedang → SE-dang, 'đang' — dấu hiệu hành động/trạng thái tiếp diễn",
          "hamil → HA-mil, 'mang thai/có bầu'",
          "dua bulan → 'hai tháng'; số trước đơn vị",
        ],
        pronunciation_focus_en: [
          "sedang → 'SE-dang' — marks an ongoing state ('-ing'/currently)",
          "hamil → 'HA-mil' — pregnant",
          "dua bulan → 'two months'; number before the unit",
        ],
      },
      {
        en: "Saya mau periksa kehamilan di Puskesmas.",
        vi: "Tôi muốn khám thai ở trạm y tế (Puskesmas).",
        pronunciation_focus: [
          "periksa → peu-RIK-sa, 'khám/kiểm tra'",
          "kehamilan → 'thai kỳ/sự mang thai' (hamil + ke-…-an)",
          "Puskesmas → PUS-kes-mas, trung tâm y tế cộng đồng",
        ],
        pronunciation_focus_en: [
          "periksa → 'pe-RIK-sa' — to examine/check",
          "kehamilan → 'pregnancy' (hamil + circumfix 'ke-…-an')",
          "Puskesmas → 'POOS-kes-mas' — community health center",
        ],
      },
      {
        en: "Bidan menyarankan saya minum vitamin dan tablet tambah darah.",
        vi: "Nữ hộ sinh khuyên tôi uống vitamin và viên sắt bổ máu.",
        pronunciation_focus: [
          "bidan → BI-dan, 'nữ hộ sinh/bà đỡ'",
          "menyarankan → 'khuyên/đề nghị' (gốc saran)",
          "tablet tambah darah → 'viên bổ máu (sắt)' (darah = máu)",
        ],
        pronunciation_focus_en: [
          "bidan → 'BEE-dan' — midwife",
          "menyarankan → 'to recommend/advise' (root 'saran')",
          "tablet tambah darah → 'blood-boosting (iron) tablet' (darah = blood)",
        ],
      },
      {
        en: "Kapan jadwal USG berikutnya, Bu Bidan?",
        vi: "Lịch siêu âm tiếp theo là khi nào, cô hộ sinh?",
        pronunciation_focus: [
          "USG → 'u-és-ge', siêu âm",
          "jadwal → JAD-wal, 'lịch'",
          "Bu Bidan → cách gọi lịch sự nữ hộ sinh",
        ],
        pronunciation_focus_en: [
          "USG → 'oo-ess-geh' — ultrasound scan",
          "jadwal → 'JAD-wal' — schedule",
          "Bu Bidan → polite address for the midwife",
        ],
      },
      {
        en: "Saya sering merasa mual di pagi hari.",
        vi: "Tôi thường thấy buồn nôn vào buổi sáng.",
        pronunciation_focus: [
          "sering → SE-ring, 'thường/hay'",
          "merasa → 'cảm thấy' (gốc rasa)",
          "mual → MU-al, 'buồn nôn'",
        ],
        pronunciation_focus_en: [
          "sering → 'SE-ring' — often",
          "merasa → 'to feel' (root 'rasa')",
          "mual → 'MOO-al' — nauseous",
        ],
      },
    ],
    cultural_notes_vi:
      "'Puskesmas' (Pusat Kesehatan Masyarakat) là trung tâm y tế cộng đồng cấp xã/phường — nơi khám thai ('periksa kehamilan') cơ bản và miễn phí hoặc rất rẻ với BPJS. 'Bidan' (nữ hộ sinh) là người theo dõi thai kỳ và đỡ đẻ phổ biến nhất ở Indonesia, kể cả vùng nông thôn. Sổ theo dõi thai và trẻ là 'buku KIA' màu hồng. 'Tablet tambah darah' (viên sắt) được phát rộng rãi để phòng thiếu máu thai kỳ. Khám thai khuyến nghị ít nhất 6 lần.",
    cultural_notes_en:
      "A 'Puskesmas' (Pusat Kesehatan Masyarakat) is a district-level community health center — where basic antenatal care ('periksa kehamilan') is free or very cheap with BPJS. A 'bidan' (midwife) is the most common provider for prenatal monitoring and delivery across Indonesia, including rural areas. The pink 'buku KIA' tracks pregnancy and child health. 'Tablet tambah darah' (iron tablets) are distributed widely to prevent pregnancy anemia. At least six antenatal visits are recommended.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'sedang' đặt trước động từ = 'đang' (tiếp diễn): 'sedang hamil' (đang mang thai), 'sedang makan' (đang ăn). Không có thì như tiếng Anh, chỉ thêm dấu hiệu thời/thể. Cẩn thận false friend: 'hamil' = mang thai, KHÔNG liên quan tới 'hami/hâm' tiếng Việt. Khung hỏi lịch vạn năng: 'Kapan jadwal … berikutnya?' (Lịch … tiếp theo khi nào?).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'sedang' before a verb = the progressive 'currently/-ing': 'sedang hamil' (currently pregnant), 'sedang makan' (eating). There's no tense like English, just an aspect marker. Reusable schedule question: 'Kapan jadwal … berikutnya?' (When is the next …?). Note: 'periksa' (examine) is also the verb for any medical check.",
    vocabulary: [
      {
        word: "hamil",
        en: "pregnant",
        vi: "mang thai / có bầu",
        pos: "adjective",
        pronunciation_vi: "HA-mil",
        pronunciation_en: "HA-mil",
      },
      {
        word: "kehamilan",
        en: "pregnancy",
        vi: "thai kỳ",
        pos: "noun",
        pronunciation_vi: "keu-ha-MI-lan",
        pronunciation_en: "ke-ha-MEE-lan",
      },
      {
        word: "bidan",
        en: "midwife",
        vi: "nữ hộ sinh",
        pos: "noun",
        pronunciation_vi: "BI-dan",
        pronunciation_en: "BEE-dan",
      },
      {
        word: "Puskesmas",
        en: "community health center",
        vi: "trạm/trung tâm y tế cộng đồng",
        pos: "noun (proper)",
        pronunciation_vi: "PUS-kes-mas",
        pronunciation_en: "POOS-kes-mas",
      },
      {
        word: "periksa",
        en: "to examine / check",
        vi: "khám / kiểm tra",
        pos: "verb",
        pronunciation_vi: "peu-RIK-sa",
        pronunciation_en: "pe-RIK-sa",
      },
      {
        word: "USG",
        en: "ultrasound scan",
        vi: "siêu âm",
        pos: "noun",
        pronunciation_vi: "u-és-ge",
        pronunciation_en: "oo-ess-geh",
      },
      {
        word: "mual",
        en: "nauseous",
        vi: "buồn nôn",
        pos: "adjective",
        pronunciation_vi: "MU-al",
        pronunciation_en: "MOO-al",
      },
      {
        word: "vitamin",
        en: "vitamin",
        vi: "vitamin",
        pos: "noun",
        pronunciation_vi: "vi-ta-MIN",
        pronunciation_en: "vee-ta-MIN",
      },
      {
        word: "darah",
        en: "blood",
        vi: "máu",
        pos: "noun",
        pronunciation_vi: "DA-rah",
        pronunciation_en: "DA-rah",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Bu Bidan, saya sedang hamil dua bulan. Mau periksa.",
        vi: "Cô hộ sinh ơi, em đang mang thai hai tháng. Muốn khám ạ.",
        en: "Midwife, I'm two months pregnant. I'd like a check-up.",
      },
      {
        speaker: "Bidan",
        text: "Selamat, ya! Ada keluhan? Sering mual?",
        vi: "Chúc mừng nhé! Có khó chịu gì không? Hay buồn nôn không?",
        en: "Congratulations! Any complaints? Often nauseous?",
      },
      {
        speaker: "Pasien",
        text: "Iya, mual di pagi hari. Apa yang harus saya minum?",
        vi: "Vâng, buồn nôn buổi sáng. Em phải uống gì ạ?",
        en: "Yes, nausea in the morning. What should I take?",
      },
      {
        speaker: "Bidan",
        text: "Minum vitamin dan tablet tambah darah. Kita jadwalkan USG bulan depan.",
        vi: "Uống vitamin và viên bổ máu. Mình hẹn siêu âm tháng sau.",
        en: "Take vitamins and iron tablets. We'll schedule an ultrasound next month.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thai kỳ còn thiếu:",
        instruction_en: "Fill in the missing pregnancy word:",
        items: [
          {
            prompt: "Saya sedang ___ dua bulan. (mang thai)",
            answer: "hamil",
            options: ["hamil", "hampir", "harga"],
          },
          {
            prompt: "Saya mau periksa kehamilan di ___. (trạm y tế)",
            answer: "Puskesmas",
            options: ["Puskesmas", "Posyandu", "Pasar"],
          },
          {
            prompt: "Saya sering merasa ___ di pagi hari. (buồn nôn)",
            answer: "mual",
            options: ["mual", "manis", "murah"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "hamil", answer: "mang thai" },
          { prompt: "bidan", answer: "nữ hộ sinh" },
          { prompt: "USG", answer: "siêu âm" },
          { prompt: "darah", answer: "máu" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đang mang thai hai tháng.", answer: "Saya sedang hamil dua bulan." },
          { prompt: "Tôi muốn khám thai ở Puskesmas.", answer: "Saya mau periksa kehamilan di Puskesmas." },
          { prompt: "Lịch siêu âm tiếp theo là khi nào?", answer: "Kapan jadwal USG berikutnya?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_giving_birth",
    level: "B1",
    category: "pregnancy_health",
    title_vi: "Sinh con — chuyển dạ, nữ hộ sinh và bé sơ sinh",
    title_en: "Giving birth — labor, the midwife and the newborn",
    sentences: [
      {
        en: "Istri saya akan melahirkan minggu depan.",
        vi: "Vợ tôi sẽ sinh con vào tuần sau.",
        pronunciation_focus: [
          "akan → A-kan, 'sẽ' — dấu hiệu tương lai (không chia động từ)",
          "melahirkan → 'sinh (con)' (gốc lahir = sinh ra + me-…-kan)",
          "minggu depan → 'tuần sau'",
        ],
        pronunciation_focus_en: [
          "akan → 'A-kan' — 'will' (future marker; no verb conjugation)",
          "melahirkan → 'to give birth' (root 'lahir' = be born + 'me-…-kan')",
          "minggu depan → 'next week'",
        ],
      },
      {
        en: "Sudah mulai kontraksi, tolong panggil bidan!",
        vi: "Đã bắt đầu co thắt rồi, làm ơn gọi nữ hộ sinh!",
        pronunciation_focus: [
          "sudah mulai → 'đã bắt đầu'",
          "kontraksi → kon-TRAK-si, 'cơn co (chuyển dạ)'",
          "panggil → PANG-gil, 'gọi (người)'",
        ],
        pronunciation_focus_en: [
          "sudah mulai → 'has started'",
          "kontraksi → 'kon-TRAK-see' — contraction",
          "panggil → 'PANG-gil' — to call/summon",
        ],
      },
      {
        en: "Bayinya lahir dengan selamat dan sehat.",
        vi: "Em bé chào đời bình an và khỏe mạnh.",
        pronunciation_focus: [
          "bayinya → 'em bé (đó)' (bayi + -nya)",
          "lahir → LA-hir, 'ra đời/sinh ra'",
          "dengan selamat → 'một cách an toàn/bình an'",
        ],
        pronunciation_focus_en: [
          "bayinya → 'the baby' (bayi + '-nya')",
          "lahir → 'LA-hir' — to be born",
          "dengan selamat → 'safely' (dengan + adjective = adverb)",
        ],
      },
      {
        en: "Dokter menyarankan operasi caesar karena posisi bayi sungsang.",
        vi: "Bác sĩ khuyên mổ đẻ vì thai ngôi ngược.",
        pronunciation_focus: [
          "operasi caesar → 'mổ đẻ' (caesar đọc 'sé-sar')",
          "karena → 'vì/bởi vì'",
          "sungsang → SUNG-sang, 'ngôi ngược (thai)'",
        ],
        pronunciation_focus_en: [
          "operasi caesar → 'caesarean section' (said 'SEH-sar')",
          "karena → 'because'",
          "sungsang → 'SOONG-sang' — breech (baby position)",
        ],
      },
      {
        en: "Setelah melahirkan, ibu harus banyak istirahat.",
        vi: "Sau khi sinh, người mẹ phải nghỉ ngơi nhiều.",
        pronunciation_focus: [
          "setelah → seu-teu-LAH, 'sau khi'",
          "harus → HA-rus, 'phải/cần'",
          "istirahat → is-ti-RA-hat, 'nghỉ ngơi'",
        ],
        pronunciation_focus_en: [
          "setelah → 'se-te-LAH' — after",
          "harus → 'HA-roos' — must / have to",
          "istirahat → 'is-tee-RA-hat' — to rest",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, sinh thường ('persalinan normal') do 'bidan' đỡ là phổ biến nhất; ca khó hoặc 'sungsang' (ngôi ngược) chuyển lên bác sĩ và bệnh viện để 'operasi caesar' (mổ đẻ). BPJS chi trả phần lớn chi phí sinh. Sau sinh, nhiều gia đình giữ tập tục kiêng cữ và 'pijat' (xoa bóp) cho mẹ. Sữa non/sữa mẹ ('ASI') được khuyến khích cho bú sớm trong giờ đầu — gọi là 'IMD' (Inisiasi Menyusu Dini).",
    cultural_notes_en:
      "In Indonesia, normal delivery ('persalinan normal') attended by a 'bidan' is most common; difficult or 'sungsang' (breech) cases are referred to a doctor and hospital for an 'operasi caesar' (C-section). BPJS covers most delivery costs. After birth, many families observe confinement customs and postnatal 'pijat' (massage) for the mother. Early breastfeeding within the first hour — 'IMD' (Inisiasi Menyusu Dini) — is encouraged.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'akan' = 'sẽ' (tương lai), 'sudah' = 'đã/rồi' (hoàn thành), 'sedang' = 'đang' (tiếp diễn) — học bộ ba dấu hiệu thời/thể này thay cho việc chia động từ. Cấu trúc 'dengan + tính từ' = trạng từ: 'dengan selamat' (một cách an toàn), 'dengan baik' (một cách tốt). Phân biệt 'lahir' (sinh ra, nói về bé) và 'melahirkan' (sinh con, nói về mẹ).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'akan' = 'will' (future), 'sudah' = 'already/done' (perfect), 'sedang' = 'currently' (progressive) — learn this trio of aspect markers instead of conjugating. 'dengan + adjective' forms an adverb: 'dengan selamat' (safely), 'dengan baik' (well). Distinguish 'lahir' (to be born, about the baby) from 'melahirkan' (to give birth, about the mother).",
    vocabulary: [
      {
        word: "melahirkan",
        en: "to give birth",
        vi: "sinh con",
        pos: "verb",
        pronunciation_vi: "meu-la-HIR-kan",
        pronunciation_en: "me-la-HIR-kan",
      },
      {
        word: "lahir",
        en: "to be born",
        vi: "ra đời / sinh ra",
        pos: "verb",
        pronunciation_vi: "LA-hir",
        pronunciation_en: "LA-hir",
      },
      {
        word: "kontraksi",
        en: "contraction (labor)",
        vi: "cơn co (chuyển dạ)",
        pos: "noun",
        pronunciation_vi: "kon-TRAK-si",
        pronunciation_en: "kon-TRAK-see",
      },
      {
        word: "operasi caesar",
        en: "caesarean section",
        vi: "mổ đẻ",
        pos: "noun",
        pronunciation_vi: "o-peu-RA-si SÉ-sar",
        pronunciation_en: "o-pe-RA-see SEH-sar",
      },
      {
        word: "sungsang",
        en: "breech (position)",
        vi: "ngôi ngược",
        pos: "adjective",
        pronunciation_vi: "SUNG-sang",
        pronunciation_en: "SOONG-sang",
      },
      {
        word: "bayi",
        en: "baby / newborn",
        vi: "em bé / trẻ sơ sinh",
        pos: "noun",
        pronunciation_vi: "BA-yi",
        pronunciation_en: "BA-yee",
      },
      {
        word: "selamat",
        en: "safe / safely",
        vi: "an toàn / bình an",
        pos: "adjective",
        pronunciation_vi: "seu-LA-mat",
        pronunciation_en: "se-LA-mat",
      },
      {
        word: "istirahat",
        en: "to rest",
        vi: "nghỉ ngơi",
        pos: "verb / noun",
        pronunciation_vi: "is-ti-RA-hat",
        pronunciation_en: "is-tee-RA-hat",
      },
      {
        word: "persalinan",
        en: "delivery / childbirth",
        vi: "cuộc sinh nở",
        pos: "noun",
        pronunciation_vi: "per-sa-LI-nan",
        pronunciation_en: "per-sa-LEE-nan",
      },
    ],
    dialogue: [
      {
        speaker: "Suami",
        text: "Bu Bidan, istri saya sudah mulai kontraksi!",
        vi: "Cô hộ sinh ơi, vợ tôi đã bắt đầu co thắt rồi!",
        en: "Midwife, my wife's contractions have started!",
      },
      {
        speaker: "Bidan",
        text: "Tenang, Pak. Sudah berapa menit sekali?",
        vi: "Bình tĩnh, anh. Mấy phút một lần rồi?",
        en: "Stay calm, sir. How many minutes apart?",
      },
      {
        speaker: "Suami",
        text: "Sekitar lima menit. Apakah harus ke rumah sakit?",
        vi: "Khoảng năm phút. Có cần đến bệnh viện không?",
        en: "About five minutes. Should we go to the hospital?",
      },
      {
        speaker: "Bidan",
        text: "Kita coba persalinan normal dulu. Kalau sulit, baru caesar.",
        vi: "Mình thử sinh thường trước. Nếu khó thì mới mổ.",
        en: "Let's try a normal delivery first. If it's hard, then a C-section.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về sinh con còn thiếu:",
        instruction_en: "Fill in the missing childbirth word:",
        items: [
          {
            prompt: "Istri saya akan ___ minggu depan. (sinh con)",
            answer: "melahirkan",
            options: ["melahirkan", "melukis", "melompat"],
          },
          {
            prompt: "Sudah mulai ___, panggil bidan! (cơn co)",
            answer: "kontraksi",
            options: ["kontraksi", "koneksi", "konsumsi"],
          },
          {
            prompt: "Setelah melahirkan, ibu harus banyak ___. (nghỉ ngơi)",
            answer: "istirahat",
            options: ["istirahat", "istimewa", "istana"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "lahir", answer: "ra đời / sinh ra" },
          { prompt: "operasi caesar", answer: "mổ đẻ" },
          { prompt: "sungsang", answer: "ngôi ngược" },
          { prompt: "persalinan", answer: "cuộc sinh nở" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Vợ tôi sẽ sinh con vào tuần sau.", answer: "Istri saya akan melahirkan minggu depan." },
          { prompt: "Em bé chào đời bình an và khỏe mạnh.", answer: "Bayinya lahir dengan selamat dan sehat." },
          { prompt: "Sau khi sinh, người mẹ phải nghỉ ngơi nhiều.", answer: "Setelah melahirkan, ibu harus banyak istirahat." },
        ],
      },
    ],
  },
  {
    id: "indonesian_family_planning_postnatal",
    level: "B1",
    category: "pregnancy_health",
    title_vi: "Kế hoạch hóa gia đình (KB) và chăm sóc sau sinh",
    title_en: "Family planning (KB) and postnatal care",
    sentences: [
      {
        en: "Setelah melahirkan, saya mau ikut program KB.",
        vi: "Sau khi sinh, tôi muốn tham gia chương trình kế hoạch hóa gia đình (KB).",
        pronunciation_focus: [
          "ikut → I-kut, 'tham gia/theo'",
          "program → prô-GRAM, 'chương trình'",
          "KB → 'ka-be', viết tắt Keluarga Berencana = KHHGĐ",
        ],
        pronunciation_focus_en: [
          "ikut → 'EE-koot' — to join/follow",
          "program → 'proh-GRAM' — program",
          "KB → 'ka-beh' — Keluarga Berencana = family planning",
        ],
      },
      {
        en: "Ada beberapa pilihan kontrasepsi, seperti pil dan suntik.",
        vi: "Có vài lựa chọn tránh thai, như thuốc uống và thuốc tiêm.",
        pronunciation_focus: [
          "beberapa → beu-beu-RA-pa, 'vài/một số'",
          "pilihan → 'lựa chọn' (gốc pilih + -an)",
          "kontrasepsi → 'biện pháp tránh thai'; pil = viên, suntik = tiêm",
        ],
        pronunciation_focus_en: [
          "beberapa → 'be-be-RA-pa' — several / some",
          "pilihan → 'choice/option' (root 'pilih' + '-an')",
          "kontrasepsi → 'contraception'; pil = the pill, suntik = injection",
        ],
      },
      {
        en: "Saya akan membawa bayi ke Posyandu untuk imunisasi.",
        vi: "Tôi sẽ mang em bé đến Posyandu để tiêm chủng.",
        pronunciation_focus: [
          "membawa → 'mang/đưa' (gốc bawa)",
          "Posyandu → pos-YAN-du, trạm y tế cộng đồng cho mẹ và bé",
          "untuk → 'để/cho'; imunisasi = tiêm chủng",
        ],
        pronunciation_focus_en: [
          "membawa → 'to bring/take' (root 'bawa')",
          "Posyandu → 'pos-YAN-doo' — community post for mothers and infants",
          "untuk → 'for/in order to'; imunisasi = immunization",
        ],
      },
      {
        en: "Berat badan bayi naik dengan baik setiap bulan.",
        vi: "Cân nặng em bé tăng tốt mỗi tháng.",
        pronunciation_focus: [
          "berat badan → 'cân nặng'",
          "naik → NA-ik, 'tăng/lên'",
          "dengan baik → 'một cách tốt' (trạng từ)",
        ],
        pronunciation_focus_en: [
          "berat badan → 'body weight'",
          "naik → 'NA-ik' — to rise / go up",
          "dengan baik → 'well' (adverb)",
        ],
      },
      {
        en: "Bidan menyarankan agar saya tetap memberi ASI.",
        vi: "Nữ hộ sinh khuyên tôi nên tiếp tục cho bú sữa mẹ.",
        pronunciation_focus: [
          "agar → A-gar, 'để/rằng (mong muốn)' — nối mệnh đề khuyên bảo",
          "tetap → TE-tap, 'vẫn/tiếp tục'",
          "memberi ASI → 'cho bú sữa mẹ'",
        ],
        pronunciation_focus_en: [
          "agar → 'A-gar' — 'so that / that' (introduces a desired-outcome clause)",
          "tetap → 'TE-tap' — keep / remain",
          "memberi ASI → 'to breastfeed' (give breast milk)",
        ],
      },
    ],
    cultural_notes_vi:
      "'KB' (Keluarga Berencana — kế hoạch hóa gia đình) là chương trình quốc gia lâu đời của Indonesia, do BKKBN điều phối; tư vấn và phần lớn biện pháp tránh thai ('kontrasepsi') có ở Puskesmas/Posyandu, miễn phí hoặc rất rẻ. Sau sinh, mẹ và bé đến 'Posyandu' hằng tháng để cân, theo dõi tăng trưởng và tiêm chủng. Việc cho bú sữa mẹ ('ASI') được khuyến khích mạnh. Khẩu hiệu cũ nổi tiếng: 'Dua anak cukup' (hai con là đủ).",
    cultural_notes_en:
      "'KB' (Keluarga Berencana — family planning) is one of Indonesia's longest-running national programs, coordinated by BKKBN; counseling and most contraception ('kontrasepsi') are available free or cheaply at the Puskesmas/Posyandu. After birth, mother and baby attend the 'Posyandu' monthly for weighing, growth monitoring, and immunizations. Breastfeeding ('ASI') is strongly encouraged. The famous old slogan: 'Dua anak cukup' (two children is enough).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'agar' (và 'supaya') mở mệnh đề mong muốn/mục đích — 'menyarankan agar saya tetap memberi ASI' (khuyên rằng tôi nên tiếp tục cho bú). 'tetap + động từ' = 'vẫn tiếp tục…'. Hậu tố '-an' biến động từ thành danh từ: pilih→pilihan (lựa chọn), makan→makanan (thức ăn). Học chuỗi viết tắt y tế mẹ-bé: KB, ASI, Posyandu, Puskesmas, KIA.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'agar' (and 'supaya') introduce a purpose/wish clause — 'menyarankan agar saya tetap memberi ASI' (advises that I keep breastfeeding). 'tetap + verb' = 'keep on …'. The '-an' suffix turns verbs into nouns: pilih→pilihan (choice), makan→makanan (food). Learn the maternal-child health abbreviations: KB, ASI, Posyandu, Puskesmas, KIA.",
    vocabulary: [
      {
        word: "KB (Keluarga Berencana)",
        en: "family planning",
        vi: "kế hoạch hóa gia đình",
        pos: "noun (proper)",
        pronunciation_vi: "ka-be",
        pronunciation_en: "ka-beh",
      },
      {
        word: "kontrasepsi",
        en: "contraception",
        vi: "biện pháp tránh thai",
        pos: "noun",
        pronunciation_vi: "kon-tra-SEP-si",
        pronunciation_en: "kon-tra-SEP-see",
      },
      {
        word: "pilihan",
        en: "choice / option",
        vi: "lựa chọn",
        pos: "noun",
        pronunciation_vi: "pi-LI-han",
        pronunciation_en: "pee-LEE-han",
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
        word: "imunisasi",
        en: "immunization",
        vi: "tiêm chủng",
        pos: "noun",
        pronunciation_vi: "i-mu-ni-SA-si",
        pronunciation_en: "ee-moo-nee-SA-see",
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
        word: "berat badan",
        en: "body weight",
        vi: "cân nặng",
        pos: "noun",
        pronunciation_vi: "beu-RAT BA-dan",
        pronunciation_en: "be-RAT BA-dan",
      },
      {
        word: "tetap",
        en: "to keep / remain",
        vi: "vẫn / tiếp tục",
        pos: "adverb / verb",
        pronunciation_vi: "TE-tap",
        pronunciation_en: "TE-tap",
      },
      {
        word: "menyusui",
        en: "to breastfeed",
        vi: "cho con bú",
        pos: "verb",
        pronunciation_vi: "meu-nyu-SU-i",
        pronunciation_en: "me-nyoo-SOO-ee",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Bu Bidan, setelah melahirkan saya mau ikut KB.",
        vi: "Cô hộ sinh ơi, sau sinh em muốn tham gia KB.",
        en: "Midwife, after giving birth I'd like to join family planning.",
      },
      {
        speaker: "Bidan",
        text: "Bagus. Ada beberapa pilihan: pil, suntik, atau IUD.",
        vi: "Tốt. Có vài lựa chọn: thuốc uống, thuốc tiêm, hoặc vòng tránh thai.",
        en: "Good. There are several options: the pill, injection, or IUD.",
      },
      {
        speaker: "Ibu",
        text: "Saya masih menyusui. Yang mana paling aman?",
        vi: "Em vẫn đang cho bú. Cái nào an toàn nhất ạ?",
        en: "I'm still breastfeeding. Which is safest?",
      },
      {
        speaker: "Bidan",
        text: "Suntik aman untuk ibu menyusui. Tetap bawa bayi ke Posyandu, ya.",
        vi: "Thuốc tiêm an toàn cho mẹ đang cho bú. Vẫn mang bé đến Posyandu nhé.",
        en: "The injection is safe while breastfeeding. Keep bringing the baby to the Posyandu.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về KB / sau sinh còn thiếu:",
        instruction_en: "Fill in the missing family-planning/postnatal word:",
        items: [
          {
            prompt: "Setelah melahirkan, saya mau ikut program ___. (KHHGĐ)",
            answer: "KB",
            options: ["KB", "KK", "KTP"],
          },
          {
            prompt: "Saya akan membawa bayi ke Posyandu untuk ___. (tiêm chủng)",
            answer: "imunisasi",
            options: ["imunisasi", "informasi", "imigrasi"],
          },
          {
            prompt: "Bidan menyarankan agar saya ___ memberi ASI. (vẫn/tiếp tục)",
            answer: "tetap",
            options: ["tetap", "tutup", "tunggu"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kontrasepsi", answer: "biện pháp tránh thai" },
          { prompt: "pilihan", answer: "lựa chọn" },
          { prompt: "ASI", answer: "sữa mẹ" },
          { prompt: "menyusui", answer: "cho con bú" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Sau khi sinh, tôi muốn tham gia chương trình KB.", answer: "Setelah melahirkan, saya mau ikut program KB." },
          { prompt: "Tôi sẽ mang em bé đến Posyandu để tiêm chủng.", answer: "Saya akan membawa bayi ke Posyandu untuk imunisasi." },
          { prompt: "Cân nặng em bé tăng tốt mỗi tháng.", answer: "Berat badan bayi naik dengan baik setiap bulan." },
        ],
      },
    ],
  },
];

export default pregnancyHealthLessons;
