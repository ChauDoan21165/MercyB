// src/languages/indonesian/extra/negation-patterns.ts
//
// Indonesian negation pack for Vietnamese learners.
// The single hardest "easy" topic: Indonesian uses FIVE different negators where
// Vietnamese mostly leans on "không" / "chưa" / "đừng". This pack drills which
// negator goes with which context:
//   - tidak  → negates verbs & adjectives ("not")
//   - bukan  → negates nouns & for contrast ("not (a) …, but …")
//   - belum  → "not yet" (the answer is still pending)
//   - jangan → negative command ("don't")
//   - tanpa  → "without"
// Hand-crafted, no filler.
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

export const negationPatternsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_negation_tidak_vs_bukan",
    level: "A1",
    category: "grammar_negation",
    title_vi: "Phủ định cốt lõi — tidak (động từ/tính từ) và bukan (danh từ)",
    title_en: "Core negation — tidak (verbs/adjectives) vs bukan (nouns)",
    sentences: [
      {
        en: "Saya tidak mengerti.",
        vi: "Tôi không hiểu.",
        pronunciation_focus: [
          "tidak → TI-dak, phủ định ĐỘNG TỪ và TÍNH TỪ",
          "mengerti → meng-er-TI, 'hiểu' (động từ)",
          "đặt 'tidak' TRƯỚC động từ, giống 'không' tiếng Việt",
        ],
        pronunciation_focus_en: [
          "tidak → 'TEE-dak' — negates VERBS and ADJECTIVES",
          "mengerti → 'meng-er-TEE' — to understand (a verb)",
          "place 'tidak' BEFORE the verb, just like Vietnamese 'không'",
        ],
      },
      {
        en: "Makanan ini tidak pedas.",
        vi: "Món này không cay.",
        pronunciation_focus: [
          "tidak + pedas (tính từ) → 'không cay'",
          "tính từ cũng dùng 'tidak', không dùng 'bukan'",
          "lỗi hay gặp: *bukan pedas (SAI) → tidak pedas (ĐÚNG)",
        ],
        pronunciation_focus_en: [
          "tidak + pedas (adjective) → 'not spicy'",
          "adjectives also take 'tidak', never 'bukan'",
          "common slip: *bukan pedas (WRONG) → tidak pedas (RIGHT)",
        ],
      },
      {
        en: "Dia bukan dokter, dia perawat.",
        vi: "Anh ấy không phải bác sĩ, anh ấy là y tá.",
        pronunciation_focus: [
          "bukan → BU-kan, phủ định DANH TỪ ('không phải là …')",
          "bukan dokter → 'không phải bác sĩ'",
          "tương đương 'không phải' tiếng Việt, khác hẳn 'không'",
        ],
        pronunciation_focus_en: [
          "bukan → 'BOO-kan' — negates NOUNS ('not a …')",
          "bukan dokter → 'not a doctor'",
          "maps to Vietnamese 'không phải', distinct from plain 'không'",
        ],
      },
      {
        en: "Ini bukan masalah besar.",
        vi: "Đây không phải là vấn đề lớn.",
        pronunciation_focus: [
          "bukan + masalah (danh từ) → 'không phải vấn đề'",
          "masalah → ma-SA-lah, 'vấn đề'",
          "quy tắc vàng: danh từ → bukan; động/tính từ → tidak",
        ],
        pronunciation_focus_en: [
          "bukan + masalah (noun) → 'not a problem'",
          "masalah → 'ma-SA-lah' — problem",
          "golden rule: noun → bukan; verb/adjective → tidak",
        ],
      },
      {
        en: "Saya tidak suka kopi, tetapi bukan berarti saya benci.",
        vi: "Tôi không thích cà phê, nhưng không có nghĩa là tôi ghét.",
        pronunciation_focus: [
          "tidak suka → 'không thích' (suka là động từ)",
          "bukan berarti → 'không có nghĩa là' (cụm cố định dùng bukan)",
          "một câu dùng cả hai để thấy rõ sự khác biệt",
        ],
        pronunciation_focus_en: [
          "tidak suka → 'don't like' (suka is a verb)",
          "bukan berarti → 'doesn't mean' (a fixed phrase that takes bukan)",
          "one sentence using both to make the contrast crisp",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là điểm ngữ pháp khó nhất với người Việt vì tiếng Việt chỉ cần 'không' cho gần như mọi thứ, còn tiếng Indonesia tách đôi: 'tidak' cho ĐỘNG TỪ và TÍNH TỪ; 'bukan' cho DANH TỪ (và để đối lập 'không phải … mà là …'). Trong văn nói, 'tidak' hay rút thành 'nggak/gak/tak', còn 'bukan' thành 'bukannya'. Nhưng quy tắc loại từ thì không đổi.",
    cultural_notes_en:
      "This is the toughest negation point for Vietnamese speakers because Vietnamese uses 'không' for almost everything, while Indonesian splits it: 'tidak' for VERBS and ADJECTIVES; 'bukan' for NOUNS (and for the contrastive 'not … but …'). In speech, 'tidak' often shortens to 'nggak/gak/tak' and 'bukan' to 'bukannya', but the word-class rule stays the same.",
    tip_advice_vi:
      "Mẹo cho người Việt: hỏi 'từ bị phủ định là loại gì?' — Danh từ? → bukan. Động từ / tính từ? → tidak. Ví dụ: bukan guru (không phải giáo viên), tidak pergi (không đi), tidak mahal (không đắt). Mẹo nhớ: bu-KAN đi với danh từ (cả hai bắt đầu bằng phụ âm 'mạnh'). Câu đối lập 'A bukan …, melainkan B' luôn dùng bukan.",
    tip_advice_en:
      "Tip for Vietnamese speakers: ask 'what word-class am I negating?' — Noun? → bukan. Verb/adjective? → tidak. e.g. bukan guru (not a teacher), tidak pergi (doesn't go), tidak mahal (not expensive). Memory hook: BUkan ↔ Benda/noun. The contrastive frame 'A bukan …, melainkan B' (not A, but rather B) always takes bukan.",
    vocabulary: [
      {
        word: "tidak",
        en: "not (verbs & adjectives)",
        vi: "không (cho động từ/tính từ)",
        pos: "negator",
        pronunciation_vi: "TI-dak",
        pronunciation_en: "TEE-dak",
      },
      {
        word: "bukan",
        en: "not (a) … (nouns / contrast)",
        vi: "không phải (cho danh từ)",
        pos: "negator",
        pronunciation_vi: "BU-kan",
        pronunciation_en: "BOO-kan",
      },
      {
        word: "nggak / gak",
        en: "not (informal 'tidak')",
        vi: "không (khẩu ngữ)",
        pos: "negator (informal)",
        pronunciation_vi: "ng-GAK / gak",
        pronunciation_en: "ng-GAK / gak",
      },
      {
        word: "mengerti",
        en: "to understand",
        vi: "hiểu",
        pos: "verb",
        pronunciation_vi: "meng-er-TI",
        pronunciation_en: "meng-er-TEE",
      },
      {
        word: "masalah",
        en: "problem",
        vi: "vấn đề",
        pos: "noun",
        pronunciation_vi: "ma-SA-lah",
        pronunciation_en: "ma-SA-lah",
      },
      {
        word: "berarti",
        en: "to mean",
        vi: "có nghĩa là",
        pos: "verb",
        pronunciation_vi: "ber-AR-ti",
        pronunciation_en: "ber-AR-tee",
      },
      {
        word: "suka",
        en: "to like",
        vi: "thích",
        pos: "verb",
        pronunciation_vi: "SU-ka",
        pronunciation_en: "SOO-ka",
      },
      {
        word: "perawat",
        en: "nurse",
        vi: "y tá",
        pos: "noun",
        pronunciation_vi: "peu-RA-wat",
        pronunciation_en: "pe-RA-wat",
      },
    ],
    dialogue: [
      {
        speaker: "Andi",
        text: "Kamu suka durian?",
        vi: "Bạn thích sầu riêng không?",
        en: "Do you like durian?",
      },
      {
        speaker: "Lan",
        text: "Tidak, saya tidak suka baunya.",
        vi: "Không, tôi không thích mùi của nó.",
        en: "No, I don't like the smell.",
      },
      {
        speaker: "Andi",
        text: "Itu bukan masalah. Coba yang manis ini.",
        vi: "Đó không phải vấn đề. Thử quả ngọt này xem.",
        en: "That's not a problem. Try this sweet one.",
      },
      {
        speaker: "Lan",
        text: "Ini bukan durian, kan? Ini nangka!",
        vi: "Đây không phải sầu riêng đúng không? Đây là mít!",
        en: "This isn't durian, is it? It's jackfruit!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn 'tidak' hoặc 'bukan' cho đúng loại từ:",
        instruction_en: "Choose 'tidak' or 'bukan' to match the word class:",
        items: [
          {
            prompt: "Dia ___ dokter, dia perawat. (danh từ → ?)",
            answer: "bukan",
            options: ["bukan", "tidak"],
          },
          {
            prompt: "Makanan ini ___ pedas. (tính từ → ?)",
            answer: "tidak",
            options: ["tidak", "bukan"],
          },
          {
            prompt: "Saya ___ mengerti. (động từ → ?)",
            answer: "tidak",
            options: ["tidak", "bukan"],
          },
          {
            prompt: "Ini ___ masalah besar. (danh từ → ?)",
            answer: "bukan",
            options: ["bukan", "tidak"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ phủ định với cách dùng:",
        instruction_en: "Match each negator with its use:",
        items: [
          { prompt: "tidak", answer: "phủ định động từ / tính từ" },
          { prompt: "bukan", answer: "phủ định danh từ / đối lập" },
          { prompt: "gak", answer: "'tidak' khẩu ngữ" },
          { prompt: "bukan berarti", answer: "không có nghĩa là" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chú ý chọn đúng từ phủ định):",
        instruction_en: "Translate into Indonesian (mind the right negator):",
        items: [
          { prompt: "Tôi không hiểu.", answer: "Saya tidak mengerti." },
          { prompt: "Món này không cay.", answer: "Makanan ini tidak pedas." },
          { prompt: "Anh ấy không phải bác sĩ.", answer: "Dia bukan dokter." },
        ],
      },
    ],
  },
  {
    id: "indonesian_negation_belum_vs_tidak",
    level: "A2",
    category: "grammar_negation",
    title_vi: "belum (chưa) so với tidak (không) và sudah (đã/rồi)",
    title_en: "belum ('not yet') vs tidak ('not') and sudah ('already')",
    sentences: [
      {
        en: "Saya belum makan.",
        vi: "Tôi chưa ăn.",
        pronunciation_focus: [
          "belum → beu-LUM, 'chưa' — việc CHƯA xảy ra nhưng còn có thể",
          "khác 'tidak makan' (không ăn — phủ nhận dứt khoát)",
          "khớp gần như 1-1 với 'chưa' của tiếng Việt",
        ],
        pronunciation_focus_en: [
          "belum → 'be-LOOM' — 'not yet'; the action hasn't happened but still might",
          "contrast 'tidak makan' (doesn't/won't eat — a flat negation)",
          "maps almost 1-to-1 to Vietnamese 'chưa'",
        ],
      },
      {
        en: "Apakah kamu sudah selesai? — Belum.",
        vi: "Bạn xong chưa? — Chưa.",
        pronunciation_focus: [
          "sudah … ? → 'đã … chưa?' — câu hỏi hoàn thành",
          "trả lời 'Belum' (chưa) hoặc 'Sudah' (rồi) — KHÔNG trả lời 'tidak'",
          "cặp đối: sudah (rồi) ↔ belum (chưa)",
        ],
        pronunciation_focus_en: [
          "sudah … ? → 'have you already …?'",
          "answer 'Belum' (not yet) or 'Sudah' (already) — NEVER 'tidak' here",
          "the pair: sudah (already) ↔ belum (not yet)",
        ],
      },
      {
        en: "Dia belum menikah, tapi punya pacar.",
        vi: "Anh ấy chưa kết hôn, nhưng có người yêu.",
        pronunciation_focus: [
          "belum menikah → 'chưa kết hôn' (còn ngỏ khả năng tương lai)",
          "nếu nói 'tidak menikah' → 'không lấy vợ/chồng' (quyết định không)",
          "menikah → meu-NI-kah, 'kết hôn'",
        ],
        pronunciation_focus_en: [
          "belum menikah → 'not married yet' (leaves the future open)",
          "saying 'tidak menikah' → 'does not marry' (a decision not to)",
          "menikah → 'me-NEE-kah' — to marry",
        ],
      },
      {
        en: "Maaf, saya belum bisa berbahasa Indonesia dengan lancar.",
        vi: "Xin lỗi, tôi chưa nói tiếng Indonesia trôi chảy được.",
        pronunciation_focus: [
          "belum bisa → 'chưa thể' (đang học, sẽ được)",
          "berbahasa Indonesia → 'nói tiếng Indonesia'",
          "lancar → LAN-char, 'trôi chảy/lưu loát'",
        ],
        pronunciation_focus_en: [
          "belum bisa → 'cannot yet' (still learning, will get there)",
          "berbahasa Indonesia → 'to speak Indonesian'",
          "lancar → 'LAN-char' — fluent / smooth",
        ],
      },
      {
        en: "Anak itu belum tidur karena belum mengantuk.",
        vi: "Đứa bé đó chưa ngủ vì chưa buồn ngủ.",
        pronunciation_focus: [
          "belum tidur … belum mengantuk → 'chưa ngủ … chưa buồn ngủ'",
          "lặp 'belum' tự nhiên khi cả hai vế còn ngỏ",
          "mengantuk → meng-AN-tuk, 'buồn ngủ'",
        ],
        pronunciation_focus_en: [
          "belum tidur … belum mengantuk → 'not asleep yet … not sleepy yet'",
          "repeating 'belum' is natural when both clauses are still pending",
          "mengantuk → 'meng-AN-took' — sleepy",
        ],
      },
    ],
    cultural_notes_vi:
      "'Belum' là một trong những từ dễ nhất cho người Việt vì khớp gần hoàn hảo với 'chưa'. Cái bẫy là khi dịch ngược: người Việt hay buột miệng 'tidak' cho câu hỏi 'sudah … ?'. Quy tắc: hỏi bằng 'sudah' (đã/rồi) thì trả lời 'sudah' (rồi) hoặc 'belum' (chưa), tuyệt đối không 'tidak'. Người Indonesia rất hay hỏi 'Sudah makan?' (Ăn cơm chưa?) như lời chào — đáp 'Sudah' hoặc 'Belum'.",
    cultural_notes_en:
      "'Belum' is one of the easiest words for Vietnamese speakers because it lines up almost perfectly with 'chưa'. The trap is the reverse direction: Vietnamese speakers blurt 'tidak' in answer to a 'sudah … ?' question. Rule: a question with 'sudah' (already) is answered 'sudah' (yes) or 'belum' (not yet), never 'tidak'. Indonesians often greet with 'Sudah makan?' (Have you eaten?) — reply 'Sudah' or 'Belum'.",
    tip_advice_vi:
      "Mẹo cho người Việt: dịch thẳng — 'belum' = 'chưa', 'sudah' = 'đã/rồi', 'tidak' = 'không'. Khi nghe câu hỏi có 'sudah', phản xạ trả lời 'Sudah/Belum', đừng 'tidak'. Phân biệt sắc thái: 'belum menikah' (chưa cưới — còn có thể) vs 'tidak menikah' (không cưới — đã quyết). Chọn 'belum' khi việc đó còn ngỏ trong tương lai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: translate directly — 'belum' = 'chưa', 'sudah' = 'đã/rồi', 'tidak' = 'không'. When a question contains 'sudah', reflexively answer 'Sudah/Belum', not 'tidak'. Feel the nuance: 'belum menikah' (not married yet — still possible) vs 'tidak menikah' (does not marry — decided). Pick 'belum' whenever the outcome is still open.",
    vocabulary: [
      {
        word: "belum",
        en: "not yet",
        vi: "chưa",
        pos: "negator",
        pronunciation_vi: "beu-LUM",
        pronunciation_en: "be-LOOM",
      },
      {
        word: "sudah",
        en: "already / done",
        vi: "đã / rồi",
        pos: "aspect marker",
        pronunciation_vi: "SU-dah",
        pronunciation_en: "SOO-dah",
      },
      {
        word: "selesai",
        en: "finished / done",
        vi: "xong / hoàn thành",
        pos: "verb / adjective",
        pronunciation_vi: "seu-leu-SAI",
        pronunciation_en: "se-le-SIGH",
      },
      {
        word: "menikah",
        en: "to marry",
        vi: "kết hôn",
        pos: "verb",
        pronunciation_vi: "meu-NI-kah",
        pronunciation_en: "me-NEE-kah",
      },
      {
        word: "lancar",
        en: "fluent / smooth",
        vi: "trôi chảy / lưu loát",
        pos: "adjective",
        pronunciation_vi: "LAN-char",
        pronunciation_en: "LAN-char",
      },
      {
        word: "mengantuk",
        en: "sleepy",
        vi: "buồn ngủ",
        pos: "adjective",
        pronunciation_vi: "meng-AN-tuk",
        pronunciation_en: "meng-AN-took",
      },
      {
        word: "pacar",
        en: "boyfriend / girlfriend",
        vi: "người yêu",
        pos: "noun",
        pronunciation_vi: "PA-char",
        pronunciation_en: "PA-char",
      },
      {
        word: "bisa",
        en: "can / able to",
        vi: "có thể / được",
        pos: "verb",
        pronunciation_vi: "BI-sa",
        pronunciation_en: "BEE-sa",
      },
    ],
    dialogue: [
      {
        speaker: "Bos",
        text: "Laporannya sudah selesai?",
        vi: "Báo cáo xong chưa?",
        en: "Is the report finished?",
      },
      {
        speaker: "Karyawan",
        text: "Belum, Pak. Saya butuh satu jam lagi.",
        vi: "Chưa ạ. Tôi cần thêm một tiếng.",
        en: "Not yet, sir. I need one more hour.",
      },
      {
        speaker: "Bos",
        text: "Kamu sudah makan siang?",
        vi: "Cậu ăn trưa chưa?",
        en: "Have you had lunch?",
      },
      {
        speaker: "Karyawan",
        text: "Belum sempat. Nanti setelah laporan selesai.",
        vi: "Chưa kịp. Lát nữa sau khi xong báo cáo.",
        en: "Haven't had time. Later, after the report's done.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn 'belum', 'sudah' hoặc 'tidak':",
        instruction_en: "Choose 'belum', 'sudah' or 'tidak':",
        items: [
          {
            prompt: "Sudah makan? — ___, masih lapar nanti makan. (chưa)",
            answer: "Belum",
            options: ["Belum", "Tidak", "Bukan"],
          },
          {
            prompt: "Dia ___ menikah, tapi punya pacar. (chưa)",
            answer: "belum",
            options: ["belum", "tidak", "bukan"],
          },
          {
            prompt: "Saya ___ suka kopi, tidak akan pernah. (không — dứt khoát)",
            answer: "tidak",
            options: ["tidak", "belum", "bukan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "belum", answer: "chưa" },
          { prompt: "sudah", answer: "đã / rồi" },
          { prompt: "tidak", answer: "không (dứt khoát)" },
          { prompt: "lancar", answer: "trôi chảy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi chưa ăn.", answer: "Saya belum makan." },
          { prompt: "Bạn xong chưa? — Chưa.", answer: "Apakah kamu sudah selesai? — Belum." },
          { prompt: "Anh ấy chưa kết hôn.", answer: "Dia belum menikah." },
        ],
      },
    ],
  },
  {
    id: "indonesian_negation_jangan_tanpa",
    level: "B1",
    category: "grammar_negation",
    title_vi: "jangan (đừng — mệnh lệnh) và tanpa (không có / thiếu)",
    title_en: "jangan ('don't' — commands) and tanpa ('without')",
    sentences: [
      {
        en: "Jangan lupa membawa payung.",
        vi: "Đừng quên mang theo ô.",
        pronunciation_focus: [
          "jangan → JANG-an, 'đừng' — CHỈ dùng cho mệnh lệnh phủ định",
          "đừng dùng 'tidak' để ra lệnh: *tidak lupa (SAI nghĩa)",
          "payung → PA-yung, 'cái ô/dù'",
        ],
        pronunciation_focus_en: [
          "jangan → 'JANG-an' — 'don't'; ONLY for negative commands",
          "never use 'tidak' to give a command: *tidak lupa (wrong meaning)",
          "payung → 'PA-yoong' — umbrella",
        ],
      },
      {
        en: "Jangan khawatir, semuanya akan baik-baik saja.",
        vi: "Đừng lo, mọi thứ sẽ ổn thôi.",
        pronunciation_focus: [
          "jangan khawatir → 'đừng lo' (cụm trấn an rất thông dụng)",
          "khawatir → kha-WA-tir, 'lo lắng'",
          "baik-baik saja → 'ổn cả thôi' (lặp từ)",
        ],
        pronunciation_focus_en: [
          "jangan khawatir → 'don't worry' (a very common reassurance)",
          "khawatir → 'kha-WA-teer' — worried",
          "baik-baik saja → 'just fine' (reduplication)",
        ],
      },
      {
        en: "Tolong jangan merokok di sini.",
        vi: "Làm ơn đừng hút thuốc ở đây.",
        pronunciation_focus: [
          "tolong + jangan → 'làm ơn đừng …' (lệnh lịch sự)",
          "merokok → meu-RÔ-kok, 'hút thuốc'",
          "thêm 'tolong' làm câu cấm mềm và lịch sự hơn",
        ],
        pronunciation_focus_en: [
          "tolong + jangan → 'please don't …' (a polite command)",
          "merokok → 'me-ROH-kok' — to smoke",
          "adding 'tolong' softens the prohibition and makes it polite",
        ],
      },
      {
        en: "Saya minum kopi tanpa gula.",
        vi: "Tôi uống cà phê không đường.",
        pronunciation_focus: [
          "tanpa → TAN-pa, 'không có/thiếu' — đứng TRƯỚC danh từ",
          "tanpa gula → 'không (có) đường'",
          "khác 'tidak': tanpa = thiếu vắng một thứ, không phủ định động từ",
        ],
        pronunciation_focus_en: [
          "tanpa → 'TAN-pa' — 'without'; goes BEFORE a noun",
          "tanpa gula → 'without sugar'",
          "unlike 'tidak': tanpa marks the absence of a thing, not verb negation",
        ],
      },
      {
        en: "Dia pergi tanpa mengucapkan selamat tinggal.",
        vi: "Anh ấy đi mà không nói lời tạm biệt.",
        pronunciation_focus: [
          "tanpa + động từ → 'mà không (làm gì)' = 'without doing'",
          "mengucapkan → 'nói ra/thốt' (gốc ucap)",
          "selamat tinggal → 'tạm biệt (người ở lại)'",
        ],
        pronunciation_focus_en: [
          "tanpa + verb → 'without doing' (tanpa can precede a verb too)",
          "mengucapkan → 'to utter/say' (root 'ucap')",
          "selamat tinggal → 'goodbye' (said to the one staying)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Jangan' phủ định MỆNH LỆNH (cấm/khuyên đừng) — không bao giờ thay được bằng 'tidak'. Người Indonesia rất hay đệm 'jangan khawatir' (đừng lo) và 'jangan lupa' (đừng quên). Thêm 'tolong' (làm ơn) hoặc 'ya' cuối câu để lịch sự: 'Jangan merokok, ya.' 'Tanpa' (không có) đứng trước danh từ HOẶC động từ ('tanpa gula' = không đường; 'tanpa berkata' = không nói gì) — gần với 'không … gì cả' nhưng gọn hơn.",
    cultural_notes_en:
      "'Jangan' negates COMMANDS (prohibitions/advice not to) — it can never be swapped for 'tidak'. Indonesians constantly use 'jangan khawatir' (don't worry) and 'jangan lupa' (don't forget). Add 'tolong' (please) or a final 'ya' for politeness: 'Jangan merokok, ya.' 'Tanpa' (without) precedes a noun OR a verb ('tanpa gula' = without sugar; 'tanpa berkata' = without speaking) — close to Vietnamese 'mà không …' but more compact.",
    tip_advice_vi:
      "Mẹo cho người Việt: muốn ra lệnh phủ định? → LUÔN 'jangan', không bao giờ 'tidak'. 'Jangan + động từ' = 'Đừng + động từ'. Muốn nói 'thiếu/không có một thứ'? → 'tanpa + danh từ'. Bộ năm phủ định hoàn chỉnh: tidak (động/tính từ), bukan (danh từ), belum (chưa), jangan (đừng), tanpa (không có). Hỏi đúng câu là chọn đúng từ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: want a negative command? → ALWAYS 'jangan', never 'tidak'. 'Jangan + verb' = 'Don't + verb'. Want 'lacking / without a thing'? → 'tanpa + noun'. The full set of five negators: tidak (verb/adj), bukan (noun), belum (not yet), jangan (don't), tanpa (without). Ask the right question and the right negator follows.",
    vocabulary: [
      {
        word: "jangan",
        en: "don't (negative command)",
        vi: "đừng",
        pos: "negator (imperative)",
        pronunciation_vi: "JANG-an",
        pronunciation_en: "JANG-an",
      },
      {
        word: "tanpa",
        en: "without",
        vi: "không có / thiếu",
        pos: "preposition",
        pronunciation_vi: "TAN-pa",
        pronunciation_en: "TAN-pa",
      },
      {
        word: "lupa",
        en: "to forget",
        vi: "quên",
        pos: "verb",
        pronunciation_vi: "LU-pa",
        pronunciation_en: "LOO-pa",
      },
      {
        word: "khawatir",
        en: "worried",
        vi: "lo lắng",
        pos: "adjective",
        pronunciation_vi: "kha-WA-tir",
        pronunciation_en: "kha-WA-teer",
      },
      {
        word: "merokok",
        en: "to smoke",
        vi: "hút thuốc",
        pos: "verb",
        pronunciation_vi: "meu-RÔ-kok",
        pronunciation_en: "me-ROH-kok",
      },
      {
        word: "payung",
        en: "umbrella",
        vi: "cái ô / dù",
        pos: "noun",
        pronunciation_vi: "PA-yung",
        pronunciation_en: "PA-yoong",
      },
      {
        word: "gula",
        en: "sugar",
        vi: "đường",
        pos: "noun",
        pronunciation_vi: "GU-la",
        pronunciation_en: "GOO-la",
      },
      {
        word: "selamat tinggal",
        en: "goodbye (to the one staying)",
        vi: "tạm biệt",
        pos: "phrase",
        pronunciation_vi: "seu-LA-mat TING-gal",
        pronunciation_en: "se-LA-mat TING-gal",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Mau pergi? Jangan lupa bawa payung, hari mau hujan.",
        vi: "Định đi à? Đừng quên mang ô, trời sắp mưa.",
        en: "Going out? Don't forget the umbrella, it's about to rain.",
      },
      {
        speaker: "Anak",
        text: "Iya, Bu. Tolong buatkan kopi tanpa gula, ya.",
        vi: "Vâng mẹ. Làm ơn pha cà phê không đường giúp con nhé.",
        en: "Okay, Mom. Please make me coffee without sugar.",
      },
      {
        speaker: "Ibu",
        text: "Jangan minum kopi terlalu banyak. Tidak baik untuk lambung.",
        vi: "Đừng uống cà phê quá nhiều. Không tốt cho dạ dày.",
        en: "Don't drink too much coffee. It's not good for your stomach.",
      },
      {
        speaker: "Anak",
        text: "Jangan khawatir, Bu. Cuma satu cangkir.",
        vi: "Đừng lo mẹ. Chỉ một cốc thôi.",
        en: "Don't worry, Mom. Just one cup.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn 'jangan' hoặc 'tanpa':",
        instruction_en: "Choose 'jangan' or 'tanpa':",
        items: [
          {
            prompt: "___ lupa membawa payung. (đừng)",
            answer: "Jangan",
            options: ["Jangan", "Tanpa"],
          },
          {
            prompt: "Saya minum kopi ___ gula. (không có)",
            answer: "tanpa",
            options: ["tanpa", "jangan"],
          },
          {
            prompt: "Tolong ___ merokok di sini. (đừng)",
            answer: "jangan",
            options: ["jangan", "tanpa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ phủ định với cách dùng:",
        instruction_en: "Match each negator with its use:",
        items: [
          { prompt: "jangan", answer: "đừng (mệnh lệnh phủ định)" },
          { prompt: "tanpa", answer: "không có / thiếu" },
          { prompt: "tidak", answer: "không (động từ/tính từ)" },
          { prompt: "belum", answer: "chưa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chọn đúng từ phủ định):",
        instruction_en: "Translate into Indonesian (pick the right negator):",
        items: [
          { prompt: "Đừng quên mang theo ô.", answer: "Jangan lupa membawa payung." },
          { prompt: "Tôi uống cà phê không đường.", answer: "Saya minum kopi tanpa gula." },
          { prompt: "Làm ơn đừng hút thuốc ở đây.", answer: "Tolong jangan merokok di sini." },
        ],
      },
    ],
  },
];

export default negationPatternsLessons;
