// src/languages/indonesian/extra/pronunciation-guide.ts
//
// Indonesian Pronunciation Guide built specifically for VIETNAMESE speakers.
// Indonesian uses the Latin alphabet and is mostly phonetic, so it is one of the
// EASIER languages for Vietnamese learners — but a handful of sounds and habits
// cause predictable mistakes. This pack drills exactly those:
//   1. r / l distinction (Vietnamese conflates and softens both)
//   2. word-initial 'ng-' (easy medially in Vietnamese, hard at word start)
//   3. vowel differences (Indonesian schwa 'e', clean vowels, vowel sequences)
//   4. stress patterns (Vietnamese has tone, not stress — Indonesian has stress)
//   5. consonant traps: c = 'ch', j, the glottal 'k', and final consonants
//
// Vietnamese-first: every `pronunciation_focus` entry is the Vietnamese-facing
// drill (with the predictable L1 mistake called out); `pronunciation_focus_en`
// is the English-speaker companion (same order). The `en` field on each sentence
// holds the Indonesian target word/phrase being drilled.
//
// Self-contained inline types (mirrors the sibling extra packs); swap for a
// shared import when src/languages/indonesian/lessons.ts lands.

export type LessonSentence = {
  en: string; // Indonesian target word/phrase
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
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
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. The r / l distinction
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_pron_r_vs_l",
    level: "A1",
    category: "pronunciation",
    title_vi: "Phân biệt R và L — rung lưỡi vs đầu lưỡi",
    title_en: "The r / l distinction — rolled r vs clear l",
    sentences: [
      {
        en: "lari (chạy) vs lali — dengar bedanya",
        vi: "lari (chạy) — chữ 'r' phải RUNG lưỡi, không thành 'l' hay 'd'",
        pronunciation_focus: [
          "lari → LA-ri; 'l' đầu lưỡi rõ, 'r' rung nhẹ đầu lưỡi (như tiếng Tây Ban Nha)",
          "LỖI người Việt: đọc 'r' thành 'd'/'z' (Bắc) hoặc 'r' nhẹ (Nam) → nghe sai",
          "'r' Indonesia là âm rung (tap/trill), KHÔNG phải 'r' tiếng Anh cong lưỡi",
          "Tập: đặt đầu lưỡi sau răng trên, bật hơi cho lưỡi rung",
        ],
        pronunciation_focus_en: [
          "lari → 'LAH-ree'; clear tip-of-tongue 'l', lightly tapped/trilled 'r' (Spanish-like)",
          "Vietnamese error: rendering 'r' as 'd'/'z' (North) or a weak 'r' (South)",
          "Indonesian 'r' is a tap/trill, NOT the curled English 'r'",
          "Drill: tongue tip behind upper teeth, push air to make it vibrate",
        ],
      },
      {
        en: "merah (đỏ) vs melah",
        vi: "merah (đỏ) — 'r' giữa từ phải rõ, đừng nuốt thành 'l'",
        pronunciation_focus: [
          "merah → ME-rah; nghe rõ tiếng rung 'r' ở giữa",
          "đối lập: malah (ME-lah) nghĩa khác hẳn — sai 'r/l' là sai nghĩa",
          "'h' cuối từ là hơi thở nhẹ, có phát âm (merah ≠ mera)",
        ],
        pronunciation_focus_en: [
          "merah → 'MEH-rah'; clear medial trilled 'r'",
          "contrast: 'malah' ('MAH-lah') means something different — r/l errors change meaning",
          "final 'h' is a soft breath, it IS pronounced (merah ≠ mera)",
        ],
      },
      {
        en: "lurus (thẳng), belok (rẽ), kanan (phải), kiri (trái)",
        vi: "Bộ chỉ đường — đầy r và l, luyện cùng lúc",
        pronunciation_focus: [
          "lurus → LU-rus: 'l' rõ + 'r' rung; kiri → KI-ri: hai 'r'? không, một 'r' + 'i'",
          "kiri (trái) → KI-ri, kanan (phải) → KA-nan — đừng lẫn l/r ở đây",
          "belok → BE-lok: 'l' rõ ràng",
          "LỖI điển hình: 'kiri' thành 'kili', 'lurus' thành 'rurus'",
        ],
        pronunciation_focus_en: [
          "lurus → 'LOO-roos': clear 'l' + trilled 'r'; kiri → 'KEE-ree'",
          "kiri (left) → 'KEE-ree', kanan (right) → 'KAH-nan'",
          "belok → 'BEH-lok': crisp 'l'",
          "Typical error: 'kiri' → 'kili', 'lurus' → 'rurus'",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt có cả 'l' và 'r', nhưng 'r' tiếng Việt rất khác 'r' Indonesia: miền Bắc đọc 'r' gần như 'd'/'z' (ra → da/za), miền Nam đọc 'r' nhẹ hơn. 'r' Indonesia là âm RUNG đầu lưỡi (alveolar tap/trill), giống tiếng Tây Ban Nha hay tiếng Ý. Đây là sự khác biệt phát âm số một của người Việt. Tin tốt: âm 'l' của bạn đã đúng sẵn. Chỉ cần tập rung 'r' và GIỮ rõ ràng hai âm — vì nhiều cặp từ chỉ khác nhau r/l (lari/lali, merah/melah).",
    cultural_notes_en:
      "Vietnamese has both 'l' and 'r', but the Vietnamese 'r' differs sharply from Indonesian: Northern speakers say 'r' almost as 'd'/'z', Southern speakers use a softer 'r'. The Indonesian 'r' is an alveolar tap/trill like Spanish or Italian. This is the number-one pronunciation gap for Vietnamese learners. Good news: your 'l' is already correct. Just train the trilled 'r' and keep the two sounds distinct — many word pairs differ only by r/l.",
    tip_advice_vi:
      "Bài tập rung 'r': nói nhanh 'tara-tara-tara' hay 'butter' kiểu Mỹ thật nhanh — lưỡi sẽ tự bật rung. Mỗi ngày đọc to: lari, lurus, merah, kiri, ratus, ribu, benar. Ghi âm lại, so với người bản xứ. Đừng để 'r' biến thành 'd' hay 'g'.",
    tip_advice_en:
      "Trill drill: say a fast American 'butter/ladder' or 'tara-tara-tara' — the tongue taps naturally. Read aloud daily: lari, lurus, merah, kiri, ratus, ribu, benar. Record and compare to natives. Don't let 'r' drift into 'd' or 'g'.",
    vocabulary: [
      { word: "lari", en: "to run", vi: "chạy", pos: "verb", pronunciation_vi: "LA-ri (r rung)", pronunciation_en: "LAH-ree (trilled r)" },
      { word: "merah", en: "red", vi: "đỏ", pos: "adjective", pronunciation_vi: "ME-rah", pronunciation_en: "MEH-rah" },
      { word: "kiri", en: "left", vi: "trái", pos: "noun", pronunciation_vi: "KI-ri", pronunciation_en: "KEE-ree" },
      { word: "lurus", en: "straight", vi: "thẳng", pos: "adjective", pronunciation_vi: "LU-rus", pronunciation_en: "LOO-roos" },
      { word: "benar", en: "correct, true", vi: "đúng", pos: "adjective", pronunciation_vi: "be-NAR", pronunciation_en: "buh-NAR" },
      { word: "ribu", en: "thousand", vi: "nghìn", pos: "number", pronunciation_vi: "RI-bu", pronunciation_en: "REE-boo" },
    ],
    exercises: [
      {
        type: "minimal_pairs",
        instruction_vi: "Đọc to từng cặp, giữ rõ r vs l:",
        instruction_en: "Read each pair aloud, keep r vs l distinct:",
        items: [
          { prompt: "lari ↔ lali", answer: "r rung vs l đầu lưỡi" },
          { prompt: "merah ↔ malah", answer: "r vs l giữa từ" },
          { prompt: "kiri ↔ kili", answer: "giữ 'r' rung trong kiri" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Word-initial 'ng-'
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_pron_initial_ng",
    level: "A2",
    category: "pronunciation",
    title_vi: "Âm 'ng' ĐẦU từ — thử thách lớn nhất",
    title_en: "Word-initial 'ng-' — the biggest hurdle",
    sentences: [
      {
        en: "nasi (cơm) — nhưng nganga, ngeri, ngantuk bắt đầu bằng 'ng'",
        vi: "Âm 'ng' đầu từ: tiếng Việt có 'ng' CUỐI (mang) và GIỮA, nhưng hiếm khi ĐẦU",
        pronunciation_focus: [
          "Tiếng Việt CÓ 'ng' đầu (Nguyễn, ngà, nga) — đây là LỢI THẾ lớn của người Việt!",
          "ngantuk → ngan-TUK = buồn ngủ; bắt đầu giống 'nga' trong 'ngà voi'",
          "Mẹo: nói 'ăn' rồi giữ phần 'ng' ở cổ họng, bỏ nguyên âm đầu",
          "So với người Anh: họ KHÔNG thể nói 'ng' đầu — người Việt thì được",
        ],
        pronunciation_focus_en: [
          "Vietnamese HAS initial 'ng' (Nguyễn, ngà) — a real advantage here!",
          "ngantuk → 'ngan-TOOK' = sleepy; starts like Vietnamese 'nga'",
          "Trick: say 'singer', isolate the 'ng', then start a word with it",
          "English speakers genuinely struggle with initial 'ng'; Vietnamese speakers don't",
        ],
      },
      {
        en: "mengerti (hiểu), mengambil (lấy), mengantar (đưa đón)",
        vi: "Tiền tố meN- biến thành 'meng-' trước nguyên âm và g/k/h",
        pronunciation_focus: [
          "mengerti → me-nger-TI = hiểu; 'nge' giữa, dễ cho người Việt",
          "mengambil → me-ngam-BIL = lấy (meN- + ambil)",
          "quy tắc: meN- + gốc bắt đầu bằng nguyên âm → 'meng-'",
          "âm 'ng' ở đây nằm giữa từ — RẤT dễ với người Việt",
        ],
        pronunciation_focus_en: [
          "mengerti → 'muh-nger-TEE' = to understand; medial 'ng', easy",
          "mengambil → 'muh-ngam-BIL' = to take (meN- + ambil)",
          "rule: meN- before a vowel-initial root → 'meng-'",
          "the 'ng' is medial here — very easy for Vietnamese speakers",
        ],
      },
      {
        en: "ngomong (nói), nggak (không), ngapain (làm gì)",
        vi: "Trong tiếng lóng, RẤT nhiều từ bắt đầu bằng 'ng'",
        pronunciation_focus: [
          "ngomong → ngo-MONG = nói chuyện (gaul); 'ng' đầu rõ ràng",
          "nggak → NG-gak = không; 'ngg' = ng + g, giữ cả hai",
          "ngapain → nga-PA-in = làm gì",
          "người Việt phát âm những từ này TỰ NHIÊN — tận dụng đi",
        ],
        pronunciation_focus_en: [
          "ngomong → 'ngo-MONG' = to talk (slang); clear initial 'ng'",
          "nggak → 'NG-gak' = not; 'ngg' = ng followed by g, keep both",
          "ngapain → 'nga-PAH-in' = doing what",
          "Vietnamese speakers nail these naturally — use the advantage",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là lĩnh vực người Việt VƯỢT TRỘI so với mọi người học khác. Tiếng Việt có phụ âm đầu 'ng/ngh' (Nguyễn, nghe, ngon, ngà) mà hầu hết ngôn ngữ khác không có. Trong tiếng Indonesia, 'ng' đầu từ xuất hiện khắp nơi: trong tiếng lóng (ngomong, nggak, ngapain) và đặc biệt trong tiền tố động từ meN- khi biến thành 'meng-' (mengerti, mengambil, menganga). Người Anh-Mỹ phải tập hàng tháng để nói 'ng' đầu; bạn đã có sẵn. Chỉ cần nhận ra 'ng' là MỘT âm (velar nasal), không phải 'n' + 'g' rời. Lưu ý phân biệt 'ng' (một âm) với 'ngg' (ng + g cứng, như trong 'tangga', 'mangga').",
    cultural_notes_en:
      "This is where Vietnamese learners OUTPERFORM everyone else. Vietnamese has the initial 'ng/ngh' consonant (Nguyễn, nghe, ngon) that most languages lack. In Indonesian, initial 'ng' is everywhere: in slang (ngomong, nggak, ngapain) and especially in the meN- verb prefix becoming 'meng-' (mengerti, mengambil). English speakers train for months to say initial 'ng'; you already have it. Just recognise 'ng' as ONE sound (velar nasal), not 'n' + 'g'. Distinguish 'ng' (one sound) from 'ngg' (ng + hard g, as in 'tangga', 'mangga').",
    tip_advice_vi:
      "Khai thác lợi thế: mỗi khi thấy 'ng' đầu từ Indonesia, nhớ ngay âm 'ng' trong 'Nguyễn/ngà/ngon' của bạn. Đọc to: ngomong, ngantuk, ngapain, mengerti. Đừng tách thành 'n-g'. Phân biệt: mangga (xoài, ng+g) ≠ manga.",
    tip_advice_en:
      "Lean into the advantage: whenever you see initial 'ng', recall your native 'ng' in 'Nguyễn/ngon'. Read aloud: ngomong, ngantuk, ngapain, mengerti. Never split it into 'n-g'. Distinguish: mangga (mango, ng+g) ≠ manga.",
    vocabulary: [
      { word: "ngomong", en: "to talk (slang)", vi: "nói chuyện", pos: "verb", pronunciation_vi: "ngo-MONG", pronunciation_en: "ngo-MONG" },
      { word: "ngantuk", en: "sleepy", vi: "buồn ngủ", pos: "adjective", pronunciation_vi: "ngan-TUK", pronunciation_en: "ngan-TOOK" },
      { word: "mengerti", en: "to understand", vi: "hiểu", pos: "verb", pronunciation_vi: "me-nger-TI", pronunciation_en: "muh-nger-TEE" },
      { word: "mengambil", en: "to take", vi: "lấy", pos: "verb", pronunciation_vi: "me-ngam-BIL", pronunciation_en: "muh-ngam-BIL" },
      { word: "mangga", en: "mango", vi: "xoài", pos: "noun", pronunciation_vi: "MANG-ga (ng+g)", pronunciation_en: "MANG-gah (ng+g)" },
      { word: "bunga", en: "flower", vi: "hoa", pos: "noun", pronunciation_vi: "BU-nga", pronunciation_en: "BOO-ngah" },
    ],
    exercises: [
      {
        type: "read_aloud",
        instruction_vi: "Đọc to, dùng âm 'ng' tiếng Việt:",
        instruction_en: "Read aloud using your native 'ng':",
        items: [
          { prompt: "ngomong", answer: "ngo-MONG (như 'ngon' + 'mong')" },
          { prompt: "mengerti", answer: "me-nger-TI" },
          { prompt: "ngapain", answer: "nga-PA-in" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Phân biệt 'ng' (1 âm) với 'ngg' (ng+g):",
        instruction_en: "Distinguish 'ng' (one sound) from 'ngg':",
        items: [
          { prompt: "bu___a = hoa (1 âm)", answer: "ng", options: ["ng", "ngg"] },
          { prompt: "ma___a = xoài (ng+g)", answer: "ngg", options: ["ng", "ngg"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Vowels — the schwa 'e' and clean vowels
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_pron_vowels",
    level: "A1",
    category: "pronunciation",
    title_vi: "Nguyên âm — chữ 'e' hai cách đọc và nguyên âm trong trẻo",
    title_en: "Vowels — the two-faced 'e' and clean vowels",
    sentences: [
      {
        en: "emas (vàng, e câm) vs enak (ngon, e mở)",
        vi: "Chữ 'e' có HAI cách đọc: 'ơ' câm (schwa) và 'e' mở rõ",
        pronunciation_focus: [
          "emas → ə-MAS: 'e' đọc như 'ơ' nhẹ tiếng Việt (schwa)",
          "enak → E-nak: 'e' đọc như 'e' tiếng Việt (mở, rõ)",
          "KHÔNG có dấu phân biệt trên chữ — phải HỌC THUỘC từng từ",
          "schwa 'e' (ơ): besar, sebelah, kemarin; e mở: enak, meja, sore",
        ],
        pronunciation_focus_en: [
          "emas → 'uh-MAS': 'e' as schwa (the 'a' in 'about')",
          "enak → 'EH-nak': 'e' as open 'e' (the 'e' in 'bet')",
          "the spelling does NOT mark which — you memorise per word",
          "schwa 'e': besar, sebelah, kemarin; open 'e': enak, meja, sore",
        ],
      },
      {
        en: "a, i, u, o — nguyên âm trong trẻo, không biến đổi",
        vi: "5 nguyên âm Indonesia phát âm SẠCH, rõ, không kéo dài hay đổi giọng",
        pronunciation_focus: [
          "a → 'a' (như 'ba'), i → 'i' (như 'mi'), u → 'u' (như 'mu')",
          "o → 'ô' (như 'cô'), e → 'ơ' hoặc 'e' (xem trên)",
          "KHÔNG có thanh điệu! Đây là điểm DỄ — bỏ thói quen lên/xuống giọng",
          "LỖI người Việt: thêm dấu (sắc/huyền) vô tình → nghe lạ",
        ],
        pronunciation_focus_en: [
          "a → 'ah', i → 'ee', u → 'oo', o → 'oh', e → schwa or 'eh'",
          "vowels are pure, short, no diphthong drift",
          "NO tones! This is the EASY part — drop any rising/falling habit",
          "Vietnamese error: accidentally adding a tone contour → sounds off",
        ],
      },
      {
        en: "air (nước), bau (mùi), saat (lúc) — chuỗi nguyên âm",
        vi: "Hai nguyên âm cạnh nhau đọc TÁCH, mỗi âm một nhịp",
        pronunciation_focus: [
          "air → A-ir (2 âm tiết: a + ir), KHÔNG đọc 'e' kiểu tiếng Anh",
          "bau → BA-u (ba + u), saat → SA-at (sa + at)",
          "LỖI: nuốt thành một âm (air → 'e', bau → 'bao')",
          "mỗi nguyên âm giữ giá trị riêng, đọc rõ từng cái",
        ],
        pronunciation_focus_en: [
          "air → 'AH-eer' (two syllables: a + ir), NOT English 'air'",
          "bau → 'BAH-oo' (ba + u), saat → 'SAH-at' (sa + at)",
          "error: collapsing into one sound (air → 'air', bau → 'bow')",
          "each vowel keeps its own value — say them separately",
        ],
      },
    ],
    cultural_notes_vi:
      "Tin vui lớn nhất cho người Việt: tiếng Indonesia KHÔNG CÓ THANH ĐIỆU. Sau bao năm vật lộn với 6 thanh tiếng Việt, bạn được nghỉ ngơi — chỉ cần đọc đều, rõ. Cạm bẫy duy nhất về nguyên âm là chữ 'e' đọc hai kiểu: schwa 'ơ' (besar = bơ-SAR) hoặc 'e' mở (enak = E-nak). Không có dấu phân biệt, phải học thuộc. Năm nguyên âm a-i-u-e-o phát âm sạch và ngắn, gần giống tiếng Việt KHÔNG dấu. Chuỗi nguyên âm (air, bau, saat, pulau) đọc tách rời từng âm, đừng nuốt — đây là lỗi phổ biến vì tiếng Việt hay ghép nguyên âm thành vần.",
    cultural_notes_en:
      "The best news for Vietnamese learners: Indonesian has NO TONES. After wrestling six Vietnamese tones, you get a rest — just speak evenly and clearly. The one vowel trap is the letter 'e' with two readings: schwa 'uh' (besar) or open 'eh' (enak), unmarked in spelling, learned per word. The five vowels a-i-u-e-o are pure and short, close to toneless Vietnamese vowels. Vowel sequences (air, bau, saat, pulau) are pronounced as separate syllables — don't merge them, a common error since Vietnamese binds vowels into single rhymes.",
    tip_advice_vi:
      "Quy tắc: khi gặp từ mới có 'e', tra từ điển xem schwa hay e-mở rồi đánh dấu lại. Bài tập bỏ thanh điệu: đọc câu Indonesia với giọng PHẲNG hoàn toàn, như robot — rồi mới thêm ngữ điệu tự nhiên (nhấn trọng âm, không phải thanh). Tách nguyên âm: a-ir, ba-u, sa-at.",
    tip_advice_en:
      "Rule: for any new word with 'e', check the dictionary for schwa vs open-e and mark it. Tone-removal drill: read Indonesian flat like a robot first, then add natural intonation (stress, not tone). Split vowels: a-ir, ba-u, sa-at.",
    vocabulary: [
      { word: "emas", en: "gold", vi: "vàng", pos: "noun", pronunciation_vi: "ə-MAS (e câm)", pronunciation_en: "uh-MAS (schwa)" },
      { word: "enak", en: "tasty, pleasant", vi: "ngon", pos: "adjective", pronunciation_vi: "E-nak (e mở)", pronunciation_en: "EH-nak (open e)" },
      { word: "besar", en: "big", vi: "to, lớn", pos: "adjective", pronunciation_vi: "bə-SAR (e câm)", pronunciation_en: "buh-SAR (schwa)" },
      { word: "air", en: "water", vi: "nước", pos: "noun", pronunciation_vi: "A-ir (2 âm)", pronunciation_en: "AH-eer (2 syl.)" },
      { word: "pulau", en: "island", vi: "đảo", pos: "noun", pronunciation_vi: "PU-lau", pronunciation_en: "POO-lau" },
      { word: "sore", en: "afternoon", vi: "buổi chiều", pos: "noun", pronunciation_vi: "SO-re (e mở)", pronunciation_en: "SOH-reh (open e)" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chữ 'e' này đọc schwa (ơ) hay mở (e)?",
        instruction_en: "Is this 'e' a schwa (uh) or open (eh)?",
        items: [
          { prompt: "besar (to, lớn)", answer: "schwa (ơ)", options: ["schwa (ơ)", "mở (e)"] },
          { prompt: "enak (ngon)", answer: "mở (e)", options: ["schwa (ơ)", "mở (e)"] },
          { prompt: "sore (chiều)", answer: "mở (e)", options: ["schwa (ơ)", "mở (e)"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Stress patterns
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_pron_stress",
    level: "A2",
    category: "pronunciation",
    title_vi: "Trọng âm — Indonesia có nhấn âm, không có thanh điệu",
    title_en: "Stress — Indonesian has stress, not tone",
    sentences: [
      {
        en: "makan (MA-kan), minum (MI-num), belajar (be-LA-jar)",
        vi: "Trọng âm thường rơi vào âm tiết ÁP CUỐI (gần cuối)",
        pronunciation_focus: [
          "makan → MA-kan: nhấn âm đầu (2 âm tiết → áp cuối = đầu)",
          "belajar → be-LA-jar: 3 âm tiết, nhấn áp cuối 'LA'",
          "quy tắc chung: trọng âm vào âm tiết áp cuối (penultimate)",
          "khác THANH ĐIỆU: nhấn = đọc TO/DÀI hơn, không lên/xuống cao độ",
        ],
        pronunciation_focus_en: [
          "makan → 'MA-kan': stress the first (penultimate of 2)",
          "belajar → 'buh-LA-jar': 3 syllables, stress penult 'LA'",
          "general rule: stress falls on the penultimate syllable",
          "unlike TONE: stress = louder/longer, not a pitch contour",
        ],
      },
      {
        en: "Nếu áp cuối là schwa, trọng âm dời sang cuối",
        vi: "Ngoại lệ: âm áp cuối là 'e câm' (schwa) → nhấn âm cuối",
        pronunciation_focus: [
          "kemeja (áo sơ mi) → ke-ME-ja: 'me' không phải schwa → nhấn 'ME'",
          "tertawa (cười) → ter-ta-WA: nếu áp cuối yếu, nhấn dời cuối",
          "đa số trường hợp cứ nhấn áp cuối là an toàn",
          "đừng lo quá: trọng âm Indonesia khá NHẸ, sai cũng vẫn hiểu",
        ],
        pronunciation_focus_en: [
          "kemeja (shirt) → 'kuh-MEH-jah': 'me' isn't schwa → stress 'ME'",
          "tertawa (to laugh) → 'ter-tah-WA': weak penult shifts stress to final",
          "in most cases, stressing the penult is safe",
          "don't overthink it: Indonesian stress is light; errors stay intelligible",
        ],
      },
      {
        en: "Thêm hậu tố → trọng âm DỜI theo (vẫn áp cuối)",
        vi: "Khi thêm -an, -kan, -i, trọng âm dịch để giữ vị trí áp cuối",
        pronunciation_focus: [
          "makan (MA-kan) → makanan (ma-KA-nan): nhấn dời sang 'KA'",
          "ajar (A-jar) → ajaran (a-JA-ran): nhấn theo về 'JA'",
          "trọng âm 'trượt' theo độ dài từ — luôn bám âm áp cuối",
          "đây là vì sao từ có tiền/hậu tố nghe khác gốc",
        ],
        pronunciation_focus_en: [
          "makan ('MA-kan') → makanan ('mah-KA-nan'): stress moves to 'KA'",
          "ajar ('A-jar') → ajaran ('ah-JA-ran'): stress shifts to 'JA'",
          "stress 'slides' with word length — always tracking the penult",
          "this is why affixed words sound different from their root",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là khái niệm cần CHUYỂN TƯ DUY cho người Việt. Tiếng Việt dùng THANH ĐIỆU (cao độ lên xuống thay đổi nghĩa: ma/má/mà/mả/mã/mạ). Tiếng Indonesia dùng TRỌNG ÂM (một âm tiết đọc to và dài hơn, không đổi nghĩa). Đừng áp thanh điệu Việt lên từ Indonesia — sẽ nghe 'có giọng'. Quy tắc đơn giản: nhấn âm tiết ÁP CUỐI (penultimate). makan→MA-kan, belajar→be-LA-jar, terima kasih→te-RI-ma KA-sih. Khi thêm hậu tố, trọng âm dời theo để vẫn rơi vào áp cuối (makan→makanan: ma-KA-nan). Tin vui: trọng âm Indonesia khá nhẹ và đều, nên ngay cả khi nhấn sai, người ta vẫn hiểu bạn — khác hẳn sai thanh điệu tiếng Việt là sai nghĩa hẳn.",
    cultural_notes_en:
      "This requires a MINDSET SHIFT for Vietnamese speakers. Vietnamese uses TONE (pitch contour changes meaning: ma/má/mà/mả/mã/mạ). Indonesian uses STRESS (one syllable louder and longer, meaning unchanged). Don't map Vietnamese tones onto Indonesian words — it sounds accented. Simple rule: stress the PENULTIMATE syllable. makan→MA-kan, belajar→buh-LA-jar. Adding a suffix shifts stress to keep it on the penult (makan→makanan: mah-KA-nan). Good news: Indonesian stress is light and even, so even misplaced stress stays intelligible — unlike a wrong Vietnamese tone, which changes the word entirely.",
    tip_advice_vi:
      "Bài tập: gõ nhịp tay vào âm tiết áp cuối khi đọc — MA(gõ)-kan, be-LA(gõ)-jar. Đọc câu Indonesia với cao độ PHẲNG, chỉ thay đổi ĐỘ TO/DÀI ở âm nhấn. Tự ghi âm và kiểm tra xem có vô tình thêm dấu sắc/huyền không.",
    tip_advice_en:
      "Drill: tap your hand on the penult syllable as you read — MA(tap)-kan, buh-LA(tap)-jar. Read Indonesian at flat pitch, varying only loudness/length on the stressed syllable. Record yourself and check you haven't slipped in a Vietnamese tone.",
    vocabulary: [
      { word: "makan", en: "to eat", vi: "ăn", pos: "verb", pronunciation_vi: "MA-kan", pronunciation_en: "MA-kan" },
      { word: "belajar", en: "to study", vi: "học", pos: "verb", pronunciation_vi: "be-LA-jar", pronunciation_en: "buh-LA-jar" },
      { word: "makanan", en: "food", vi: "thức ăn", pos: "noun", pronunciation_vi: "ma-KA-nan", pronunciation_en: "mah-KA-nan" },
      { word: "terima kasih", en: "thank you", vi: "cảm ơn", pos: "phrase", pronunciation_vi: "te-RI-ma KA-sih", pronunciation_en: "tuh-REE-mah KA-see" },
      { word: "kemeja", en: "shirt", vi: "áo sơ mi", pos: "noun", pronunciation_vi: "ke-ME-ja", pronunciation_en: "kuh-MEH-jah" },
      { word: "tertawa", en: "to laugh", vi: "cười", pos: "verb", pronunciation_vi: "ter-ta-WA", pronunciation_en: "ter-tah-WA" },
    ],
    exercises: [
      {
        type: "stress_mark",
        instruction_vi: "Đánh dấu âm tiết nhấn (áp cuối):",
        instruction_en: "Mark the stressed (penultimate) syllable:",
        items: [
          { prompt: "minum (uống)", answer: "MI-num" },
          { prompt: "belajar (học)", answer: "be-LA-jar" },
          { prompt: "makanan (thức ăn)", answer: "ma-KA-nan" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Consonant traps — c, j, glottal k, final consonants
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_pron_consonant_traps",
    level: "A2",
    category: "pronunciation",
    title_vi: "Bẫy phụ âm — c, j, k cuối câm, phụ âm cuối",
    title_en: "Consonant traps — c, j, glottal k, final consonants",
    sentences: [
      {
        en: "cabai (ớt), cuci (giặt), baca (đọc) — c LUÔN là 'ch'",
        vi: "Chữ 'c' tiếng Indonesia LUÔN đọc 'ch' (cha), không bao giờ 'k' hay 's'",
        pronunciation_focus: [
          "cabai → cha-BAI = ớt; cuci → CHU-chi = giặt",
          "baca → BA-cha = đọc; cinta → CHIN-ta = tình yêu",
          "LỖI số 1 người Việt/Anh: đọc 'c' thành 'k' (cabai → 'kabai' SAI)",
          "ghi nhớ: c = ch, mọi lúc mọi nơi",
        ],
        pronunciation_focus_en: [
          "cabai → 'cha-BAI' = chili; cuci → 'CHOO-chee' = to wash",
          "baca → 'BAH-cha' = to read; cinta → 'CHEEN-tah' = love",
          "top error: reading 'c' as 'k' (cabai → 'kabai' WRONG)",
          "remember: c = ch, always",
        ],
      },
      {
        en: "jalan (đường), juga (cũng), saja (chỉ) — j như tiếng Anh",
        vi: "Chữ 'j' đọc như 'j' tiếng Anh (jam), không phải 'gi' hay 'z'",
        pronunciation_focus: [
          "jalan → JA-lan = đường; juga → JU-ga = cũng",
          "saja → SA-ja = chỉ, thôi",
          "LỖI người Việt: đọc 'j' thành 'gi' (jalan → 'gia-lan' SAI)",
          "j Indonesia = phụ âm tắc-xát hữu thanh như 'j' trong 'July'",
        ],
        pronunciation_focus_en: [
          "jalan → 'JAH-lan' = road; juga → 'JOO-gah' = also",
          "saja → 'SAH-jah' = only/just",
          "Vietnamese error: 'j' as 'gi' (jalan → 'zya-lan')",
          "Indonesian j = voiced affricate, the 'j' in 'July'",
        ],
      },
      {
        en: "bapak (BA-pa'), tidak (TI-da'), anak (A-na') — k cuối câm",
        vi: "Chữ 'k' CUỐI từ thường đọc như âm tắc thanh hầu (glottal stop), gần như câm",
        pronunciation_focus: [
          "bapak → BA-pa' : 'k' cuối không bật hơi, ngắt ở cổ họng",
          "tidak → TI-da' (thường gaul thành 'tida'/'ngga')",
          "giống âm tắc trong tiếng Việt: 'bác' đọc cụt, không bật 'k'",
          "người Việt CÓ âm tắc thanh hầu sẵn — lợi thế",
        ],
        pronunciation_focus_en: [
          "bapak → 'BAH-pa(k)': final 'k' unreleased, a glottal catch",
          "tidak → 'TEE-da(k)' (often slangs to 'tida'/'ngga')",
          "like the cut-off stop in Vietnamese 'bác' — no released 'k'",
          "Vietnamese speakers already have the glottal stop — an advantage",
        ],
      },
      {
        en: "Phụ âm cuối: rumah (h thở), makan (n rõ), benar (r rung nhẹ)",
        vi: "Phụ âm cuối ĐỀU phát âm — đừng nuốt như tiếng Việt hay làm",
        pronunciation_focus: [
          "rumah → RU-mah: 'h' cuối là hơi thở nhẹ, có phát âm",
          "makan → MA-kan: 'n' cuối rõ ràng, lưỡi chạm lợi",
          "benar → be-NAR: 'r' cuối vẫn rung nhẹ (đừng bỏ)",
          "LỖI người Việt: nuốt phụ âm cuối (rumah → 'ruma', benar → 'bena')",
        ],
        pronunciation_focus_en: [
          "rumah → 'ROO-mah': final 'h' is a soft breath, pronounced",
          "makan → 'MA-kan': final 'n' clear, tongue to ridge",
          "benar → 'buh-NAR': final 'r' still lightly trilled (don't drop it)",
          "Vietnamese error: swallowing final consonants (rumah → 'ruma')",
        ],
      },
    ],
    cultural_notes_vi:
      "Phụ âm tiếng Indonesia gần như đọc đúng mặt chữ — rất phù hợp người Việt. Nhưng 4 bẫy cần nhớ: (1) 'c' LUÔN = 'ch' (cabai = cha-BAI), không bao giờ 'k'. Đây là lỗi số một. (2) 'j' = 'j' tiếng Anh (jalan = JA-lan), không phải 'gi'/'z'. (3) 'k' CUỐI từ là âm tắc thanh hầu gần câm (bapak = BA-pa') — may mắn người Việt có sẵn âm này (như 'bác', 'tóc'). (4) Phụ âm cuối khác (h, n, r, m, ng) ĐỀU phải đọc rõ — người Việt hay nuốt nên phải tập giữ: rumah có 'h', benar có 'r'. Ngoài ra: 'ny' = 'nh' (nyamuk = nha-muk), 'sy' = 's' nhẹ (syukur), 'kh' = âm khạc nhẹ (khusus), 'g' luôn cứng (như 'go', không phải 'j').",
    cultural_notes_en:
      "Indonesian consonants are nearly spelled-as-said — great for Vietnamese speakers. But four traps: (1) 'c' is ALWAYS 'ch' (cabai = cha-BAI), never 'k' — the top error. (2) 'j' = English 'j' (jalan = JAH-lan), not 'gi'/'z'. (3) Final 'k' is a near-silent glottal stop (bapak = 'BAH-pa') — luckily Vietnamese already has this (như 'bác'). (4) Other final consonants (h, n, r, m, ng) are ALL pronounced — Vietnamese speakers tend to swallow them, so practise keeping them: rumah has 'h', benar has 'r'. Also: 'ny' = ñ/'nh' (nyamuk), 'sy' = soft 's' (syukur), 'kh' = light guttural (khusus), 'g' always hard (as in 'go', never 'j').",
    tip_advice_vi:
      "Ưu tiên sửa 'c' = 'ch' trước — đây là lỗi nghe rõ nhất. Đọc to hàng ngày: cabai, cuci, baca, cinta, cantik. Sau đó tập 'j' (jalan, juga) và giữ phụ âm cuối (rumah-h, benar-r). Âm 'k' cuối: nghĩ tới cách bạn đọc 'bác' tiếng Việt — cụt, không bật hơi.",
    tip_advice_en:
      "Fix 'c' = 'ch' first — it's the most audible error. Read daily: cabai, cuci, baca, cinta, cantik. Then drill 'j' (jalan, juga) and hold final consonants (rumah-h, benar-r). Final 'k': think of Vietnamese 'bác' — cut off, unreleased.",
    vocabulary: [
      { word: "cabai", en: "chili", vi: "ớt", pos: "noun", pronunciation_vi: "cha-BAI (c=ch)", pronunciation_en: "cha-BAI (c=ch)" },
      { word: "baca", en: "to read", vi: "đọc", pos: "verb", pronunciation_vi: "BA-cha", pronunciation_en: "BAH-cha" },
      { word: "jalan", en: "road, to walk", vi: "đường, đi bộ", pos: "noun/verb", pronunciation_vi: "JA-lan", pronunciation_en: "JAH-lan" },
      { word: "tidak", en: "not, no", vi: "không", pos: "adverb", pronunciation_vi: "TI-da' (k câm)", pronunciation_en: "TEE-da(k)" },
      { word: "rumah", en: "house", vi: "nhà", pos: "noun", pronunciation_vi: "RU-mah (h thở)", pronunciation_en: "ROO-mah (breathy h)" },
      { word: "nyamuk", en: "mosquito", vi: "muỗi", pos: "noun", pronunciation_vi: "nya-MUK (ny=nh)", pronunciation_en: "nya-MOOK (ny=ñ)" },
    ],
    dialogue: [
      { speaker: "Guru", text: "Coba baca kata ini: 'cabai'. Bukan 'kabai' ya.", vi: "Thử đọc từ này: 'cabai'. Không phải 'kabai' nhé.", en: "Try reading this word: 'cabai'. Not 'kabai', okay." },
      { speaker: "Murid", text: "Cha-bai. Jadi 'c' selalu 'ch'?", vi: "Cha-bai. Vậy 'c' luôn là 'ch'?", en: "Cha-bai. So 'c' is always 'ch'?" },
      { speaker: "Guru", text: "Betul! Baca, cuci, cinta — semua 'ch'.", vi: "Đúng vậy! Baca, cuci, cinta — đều 'ch'.", en: "Correct! Baca, cuci, cinta — all 'ch'." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chữ 'c' dưới đây đọc là gì?",
        instruction_en: "How is each 'c' below read?",
        items: [
          { prompt: "cinta (tình yêu)", answer: "ch (CHIN-ta)", options: ["ch (CHIN-ta)", "k (KIN-ta)", "s (SIN-ta)"] },
          { prompt: "cuci (giặt)", answer: "ch (CHU-chi)", options: ["ch (CHU-chi)", "k (KU-ki)", "s (SU-si)"] },
        ],
      },
      {
        type: "read_aloud",
        instruction_vi: "Đọc to, giữ phụ âm cuối:",
        instruction_en: "Read aloud, keep the final consonant:",
        items: [
          { prompt: "rumah", answer: "RU-mah (đừng bỏ 'h')" },
          { prompt: "benar", answer: "be-NAR (đừng bỏ 'r')" },
          { prompt: "bapak", answer: "BA-pa' ('k' tắc thanh hầu)" },
        ],
      },
    ],
  },
];

export default lessons;
