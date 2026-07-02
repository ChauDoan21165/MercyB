// src/languages/italian/extra/3000-word-frequency.ts
//
// Italian 3000-word frequency study track for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/D1-italian-3000-word-frequency.md.
//
// Not a raw dictionary: a frequency-based system of 300 anchor words (30
// bands of 10) that each expand into 10 study items, reaching ~3000 usable
// vocabulary items. High-frequency function words, verbs, nouns, adjectives,
// adverbs, connectors, and collocations come first.
//
// Shape mirrors the sibling extra files (verb-drill-system.ts,
// pronunciation-error-clinic.ts): LessonSentence / VocabEntry / Exercise,
// with a single `lesson` export. Types are inlined because
// src/languages/italian/lessons.ts does not exist yet — keep this file
// self-contained until the Italian registry lands.
//
// Vietnamese-first: every anchor carries a `vi` gloss; `pronunciation_vi`
// holds the Vietnamese-facing pronunciation/grammar note, `l1_note_vi` the
// L1 note (the predictable Vietnamese-speaker mistake), and
// `correction_drill` the production drill. English companions
// (`pronunciation_en`, `l1_note_en`) preserve the original source notes.

export type LessonSentence = {
  // The Italian target line the learner speaks (a frame or rule example).
  en: string;
  // Vietnamese meaning.
  vi: string;
  // L1 = Vietnamese-speaker note (pronunciation / grammar / mistake / drill).
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  // Italian word, with article/forms where the source gives them.
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-facing pronunciation / grammar note.
  pronunciation_vi: string;
  // English companion (the original source note).
  pronunciation_en?: string;
  // ── Frequency-pack extras (the source 5-column table) ──
  // Which frequency band this anchor belongs to.
  band?: string;
  // L1 note: the common Vietnamese-speaker mistake, Vietnamese-first.
  l1_note_vi?: string;
  // English companion (the original source mistake column).
  l1_note_en?: string;
  // Correction / production drill.
  correction_drill?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill-blank, translation, answer-key) vary.
export type Exercise = Record<string, unknown>;

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLesson = {
  id: string;
  category: string;
  level: ItalianCefrLevel;
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

export const lesson: ItalianLesson = {
  id: "italian_3000_word_frequency",
  category: "vocabulary",
  level: "A2",
  title_vi: "3000 từ tiếng Ý theo tần suất",
  title_en: "Italian 3000-word frequency track",

  // ── Vietnamese-Speaker Rules + Core Sentence Frames ──
  // Each rule/frame shows the Italian line, its Vietnamese meaning, the L1
  // note, the predictable Vietnamese-speaker mistake, and a drill.
  sentences: [
    // Vietnamese-Speaker Rules
    {
      en: "il lavoro · la casa · gli amici",
      vi: "QUY TẮC: danh từ tiếng Ý thường cần mạo từ.",
      pronunciation_focus: [
        "Mỗi danh từ phải đi kèm mạo từ — tiếng Việt không có hệ thống mạo từ",
        "LỖI người Việt: bỏ mạo từ vì tiếng Việt không có",
        "DRILL: đọc mọi danh từ kèm mạo từ — 'il lavoro', 'la casa', 'gli amici'",
      ],
      pronunciation_focus_en: [
        "Italian nouns normally need articles",
        "Mistake: dropping articles because Vietnamese has no article system",
        "Drill: say every noun with article — il lavoro, la casa, gli amici",
      ],
    },
    {
      en: "casa, case, una casa, due case",
      vi: "QUY TẮC: nguyên âm cuối đổi theo số/giống (nhà / các nhà).",
      pronunciation_focus: [
        "Nguyên âm cuối mang tín hiệu số và giống",
        "LỖI người Việt: nuốt nguyên âm cuối, mất tín hiệu ngữ pháp",
        "DRILL: 'casa, case, una casa, due case'",
      ],
      pronunciation_focus_en: [
        "Final vowel changes number/gender",
        "Mistake: dropping the final vowel and losing the grammar signal",
        "Drill: casa, case, una casa, due case",
      ],
    },
    {
      en: "fat-to · set-te · bel-lo",
      vi: "QUY TẮC: phụ âm đôi có thể đổi nghĩa (fatto = đã làm / fato = số phận).",
      pronunciation_focus: [
        "Phụ âm đôi có thể đổi nghĩa",
        "LỖI người Việt: đọc phụ âm đôi quá ngắn",
        "DRILL: gõ nhịp 'fat-to', 'set-te', 'bel-lo'",
      ],
      pronunciation_focus_en: [
        "Double consonants can change meaning",
        "Mistake: making double consonants too short",
        "Drill: tap fat-to, set-te, bel-lo",
      ],
    },
    {
      en: "per-CHÉ · cit-TÀ · uni-versi-TÀ",
      vi: "QUY TẮC: từ có dấu thường nhấn âm cuối (tại sao / thành phố / đại học).",
      pronunciation_focus: [
        "Trọng âm rơi vào âm cuối ở nhiều từ có dấu",
        "LỖI người Việt: theo thói quen nhấn âm đầu",
        "DRILL: vỗ tay vào âm cuối — 'per-CHÉ', 'cit-TÀ'",
      ],
      pronunciation_focus_en: [
        "Final stress is common in accented words",
        "Mistake: stressing the first syllable by habit",
        "Drill: clap on the final syllable — per-CHÉ, cit-TÀ",
      ],
    },
    {
      en: "sono · ho · faccio · vado",
      vi: "QUY TẮC: động từ bất quy tắc tần suất cao phải thành phản xạ (là / có / làm / đi).",
      pronunciation_focus: [
        "Các động từ bất quy tắc essere/avere/fare/andare phải tự động",
        "LỖI người Việt: cố suy luận mọi dạng dưới áp lực",
        "DRILL: luyện cụm 'sono', 'ho', 'faccio', 'vado'",
      ],
      pronunciation_focus_en: [
        "High-frequency irregular verbs must be automatic",
        "Mistake: trying to build every form logically under pressure",
        "Drill: chunks — sono, ho, faccio, vado",
      ],
    },
    {
      en: "a Roma · in Italia · da Marco · di notte",
      vi: "QUY TẮC: giới từ không ánh xạ 1:1 sang tiếng Việt (đến/ở/từ/của/cho/với).",
      pronunciation_focus: [
        "Giới từ a/in/da/di/per/con không khớp 1:1 với tiếng Việt",
        "LỖI người Việt: dùng một giới từ cho nhiều nghĩa",
        "DRILL: học theo cụm — 'a Roma', 'in Italia', 'da Marco', 'di notte'",
      ],
      pronunciation_focus_en: [
        "Prepositions do not map 1:1 to Vietnamese",
        "Mistake: using one preposition for many meanings",
        "Drill: memorize chunks — a Roma, in Italia, da Marco, di notte",
      ],
    },
    // Core Sentence Frames
    {
      en: "Ho bisogno di ___.",
      vi: "Tôi cần ___.",
      pronunciation_focus: [
        "'bisogno di' + danh từ/động từ nguyên thể",
        "LỖI người Việt: thiếu 'di'",
        "DRILL: 'Ho bisogno di aiuto / tempo / lavorare'",
      ],
      pronunciation_focus_en: [
        "bisogno di + noun/infinitive",
        "Mistake: missing 'di'",
        "Drill: Ho bisogno di aiuto / tempo / lavorare",
      ],
    },
    {
      en: "Vorrei ___.",
      vi: "Tôi muốn ___.",
      pronunciation_focus: [
        "Điều kiện cách lịch sự",
        "LỖI người Việt: dùng 'voglio' quá thẳng",
        "DRILL: 'Vorrei un caffè / parlare / capire'",
      ],
      pronunciation_focus_en: [
        "Polite conditional",
        "Mistake: using 'voglio' too directly",
        "Drill: Vorrei un caffè / parlare / capire",
      ],
    },
    {
      en: "Non riesco a ___.",
      vi: "Tôi không thể xoay xở ___.",
      pronunciation_focus: [
        "'riuscire a' + động từ nguyên thể",
        "LỖI người Việt: thiếu 'a'",
        "DRILL: 'Non riesco a capire / venire / finire'",
      ],
      pronunciation_focus_en: [
        "riuscire a + infinitive",
        "Mistake: missing 'a'",
        "Drill: Non riesco a capire / venire / finire",
      ],
    },
    {
      en: "Devo ___.",
      vi: "Tôi phải ___.",
      pronunciation_focus: [
        "'dovere' + động từ nguyên thể",
        "LỖI người Việt: chia luôn động từ thứ hai",
        "DRILL: 'Devo andare', KHÔNG phải 'devo vado'",
      ],
      pronunciation_focus_en: [
        "dovere + infinitive",
        "Mistake: conjugating the second verb",
        "Drill: Devo andare, not devo vado",
      ],
    },
    {
      en: "Posso ___?",
      vi: "Tôi có thể ___ không?",
      pronunciation_focus: [
        "'potere' + động từ nguyên thể",
        "LỖI người Việt: trật tự từ kiểu tiếng Việt",
        "DRILL: 'Posso entrare? Posso chiedere?'",
      ],
      pronunciation_focus_en: [
        "potere + infinitive",
        "Mistake: word order carried over from Vietnamese",
        "Drill: Posso entrare? Posso chiedere?",
      ],
    },
    {
      en: "Mi serve ___.",
      vi: "Tôi cần ___.",
      pronunciation_focus: [
        "Cụm diễn đạt nhu cầu thực tế",
        "LỖI người Việt: chỉ dùng mãi 'ho bisogno'",
        "DRILL: 'Mi serve una penna / un documento'",
      ],
      pronunciation_focus_en: [
        "Practical need phrase",
        "Mistake: overusing only 'ho bisogno'",
        "Drill: Mi serve una penna / un documento",
      ],
    },
    {
      en: "C'è / ci sono ___.",
      vi: "Có ___.",
      pronunciation_focus: [
        "Tồn tại số ít / số nhiều",
        "LỖI người Việt: dùng 'è' cho mọi nghĩa 'có'",
        "DRILL: 'C'è un problema', 'ci sono due problemi'",
      ],
      pronunciation_focus_en: [
        "Singular/plural existence",
        "Mistake: using 'è' for all 'có'",
        "Drill: C'è un problema; ci sono due problemi",
      ],
    },
    {
      en: "Penso che ___.",
      vi: "Tôi nghĩ rằng ___.",
      pronunciation_focus: [
        "Khung diễn đạt ý kiến",
        "LỖI người Việt: né tránh 'che'",
        "DRILL: nói trọn mệnh đề sau 'che'",
      ],
      pronunciation_focus_en: [
        "Opinion frame",
        "Mistake: avoiding 'che'",
        "Drill: say the full clause after 'che'",
      ],
    },
    {
      en: "Anche se ___.",
      vi: "Mặc dù ___.",
      pronunciation_focus: [
        "Liên từ nhượng bộ",
        "LỖI người Việt: chỉ dùng 'ma'",
        "DRILL: 'Anche se è difficile, continuo'",
      ],
      pronunciation_focus_en: [
        "Concession connector",
        "Mistake: using only 'ma'",
        "Drill: Anche se è difficile, continuo",
      ],
    },
    {
      en: "Prima di ___.",
      vi: "Trước khi ___.",
      pronunciation_focus: [
        "Cùng chủ ngữ + động từ nguyên thể",
        "LỖI người Việt: thiếu 'di'",
        "DRILL: 'Prima di uscire', 'prima di decidere'",
      ],
      pronunciation_focus_en: [
        "Same subject + infinitive",
        "Mistake: missing 'di'",
        "Drill: Prima di uscire; prima di decidere",
      ],
    },
  ],

  cultural_notes_vi:
    "Đây không phải từ điển. Đây là hệ thống học theo tần suất: 300 từ neo (30 nhóm, mỗi nhóm 10 từ), mỗi từ mở rộng thành 10 mục học (từ gốc, nghĩa Việt, một cụm, một từ trái nghĩa, một từ liên quan, một câu hiện tại, một câu quá khứ/tương lai, một gợi ý nghe, một lỗi người Việt, một bài chữa). Công thức: 300 từ neo × 10 mục = 3000 mục từ vựng dùng được. Cách này tốt hơn học thuộc 3000 bản dịch rời rạc vì từ tiếng Ý đổi theo giống, số, thì, giới từ và phong cách.",
  cultural_notes_en:
    "This is not a dictionary — it is a frequency-based study system. 300 anchor words (30 bands of 10) each expand into 10 study items (base word, Vietnamese meaning, one phrase, one opposite, one related word, a present-tense sentence, a past/future sentence, a listening cue, a Vietnamese-speaker mistake, a correction drill). Formula: 300 anchors × 10 items = 3000 usable vocabulary items. More useful than 3000 isolated translations because Italian words change by gender, number, tense, preposition, and register.",
  tip_advice_vi:
    "Chu trình 25 phút mỗi ngày: chọn 10 từ neo, đọc tiếng Ý to, che phần tiếng Việt và dịch, dựng một cụm + một câu cho mỗi từ, tự thu âm 10 câu, nghe lại để kiểm tra nguyên âm cuối / phụ âm đôi / trọng âm / mạo từ, rồi ôn 10 từ hôm qua trước khi thêm từ mới. Lịch tuần: T2 từ chức năng + động từ; T3 người, gia đình, cơ thể, cảm xúc; T4 nhà, đồ ăn, sinh hoạt; T5 công việc, trường, tiền, hành chính; T6 di chuyển, thời gian, nơi chốn; T7 tính từ, trạng từ, liên từ; CN chính tả, nói, ôn. Đi hết 10 từ neo/ngày trong 30 ngày, rồi lặp lại cả chu trình với câu tự đặt.",
  tip_advice_en:
    "Daily 25-minute cycle: pick 10 anchors, read the Italian aloud, cover the Vietnamese and translate, build one phrase + one sentence per word, record yourself reading the 10 sentences, then listen for final vowels, double consonants, stress, and articles; review yesterday's 10 before adding new ones. Weekly rotation: Mon function words + verbs; Tue people/family/body/feelings; Wed home/food/daily life; Thu work/school/money/government; Fri movement/time/places; Sat adjectives/adverbs/connectors; Sun dictation/speaking/review. Work 10 anchors a day for 30 days, then repeat the cycle with your own sentences.",

  vocabulary: [
    // ── Band 1 — Top Function Words ──
    { word: "di", en: "of / from / about", vi: "của / từ / về", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Giới từ tần suất cao nhất; kết hợp với mạo từ: 'del', 'della'", pronunciation_en: "Most frequent preposition; combines with articles: del, della", l1_note_vi: "Dịch máy móc mọi 'của' của tiếng Việt", l1_note_en: "Translating every Vietnamese 'của' mechanically", correction_drill: "il libro di Marco; sono del Vietnam" },
    { word: "a", en: "to / at / in", vi: "ở / đến / lúc", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Dùng với thành phố và giờ: 'a Roma', 'alle otto'", pronunciation_en: "Cities and times: a Roma, alle otto", l1_note_vi: "Nói 'in Roma'", l1_note_en: "Using 'in Roma'", correction_drill: "a Roma; a casa; alle otto" },
    { word: "da", en: "from / at someone's / by", vi: "từ / ở nhà ai / bởi", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Nguồn gốc, thời lượng, người/nơi", pronunciation_en: "Source, duration, person/place", l1_note_vi: "Nhầm với 'di'", l1_note_en: "Confusing with 'di'", correction_drill: "da Hanoi; da Marco; da due anni" },
    { word: "in", en: "in / to", vi: "ở / trong / đến", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Quốc gia, phòng, phương tiện: 'in Italia', 'in banca'", pronunciation_en: "Countries, rooms, transport: in Italia, in banca", l1_note_vi: "Nói 'a Italia'", l1_note_en: "Using 'a Italia'", correction_drill: "Luyện tên quốc gia với 'in'" },
    { word: "con", en: "with / by", vi: "với / bằng", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Người đi cùng hoặc công cụ", pronunciation_en: "Companion or instrument", l1_note_vi: "Bỏ giới từ", l1_note_en: "Dropping the preposition", correction_drill: "con me; con il treno; con calma" },
    { word: "per", en: "for / to / because of / for (duration)", vi: "cho / để / vì / trong bao lâu", pos: "preposition", band: "1 · Function words", pronunciation_vi: "Mục đích và thời lượng", pronunciation_en: "Purpose and duration", l1_note_vi: "Dùng 'a' cho mục đích", l1_note_en: "Using 'a' for purpose", correction_drill: "per favore; per studiare; per due giorni" },
    { word: "e", en: "and", vi: "và", pos: "conjunction", band: "1 · Function words", pronunciation_vi: "Nối từ hoặc mệnh đề", pronunciation_en: "Links words or clauses", l1_note_vi: "Nhầm 'e' (và) với 'è' (là) khi viết", l1_note_en: "Confusing 'e' with 'è' = is in writing", correction_drill: "Marco e Anna; Marco è italiano" },
    { word: "o", en: "or", vi: "hoặc", pos: "conjunction", band: "1 · Function words", pronunciation_vi: "Liên từ lựa chọn", pronunciation_en: "Choice connector", l1_note_vi: "Đọc kéo dài như 'o' tiếng Anh", l1_note_en: "Pronouncing like an English long o", correction_drill: "o questo o quello (đọc ngắn)" },
    { word: "ma", en: "but", vi: "nhưng", pos: "conjunction", band: "1 · Function words", pronunciation_vi: "Tương phản mạnh", pronunciation_en: "Strong contrast", l1_note_vi: "Lạm dụng thay vì 'però', 'invece'", l1_note_en: "Overusing it instead of 'però', 'invece'", correction_drill: "Đặt 5 câu tương phản" },
    { word: "che", en: "that / which / than", vi: "rằng / cái mà / hơn", pos: "conjunction / pronoun", band: "1 · Function words", pronunciation_vi: "Nối mệnh đề và đại từ quan hệ", pronunciation_en: "Clause linker and relative word", l1_note_vi: "Bỏ 'che' vì tiếng Việt có thể lược", l1_note_en: "Omitting it because Vietnamese can skip it", correction_drill: "Penso che; so che; il libro che leggo" },

    // ── Band 2 — Articles and Pronouns ──
    { word: "il", en: "the (m. sing.)", vi: "mạo từ nam số ít", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Trước nhiều danh từ giống đực", pronunciation_en: "Before many masculine nouns", l1_note_vi: "Bỏ mạo từ", l1_note_en: "Dropping the article", correction_drill: "il lavoro; il treno; il documento" },
    { word: "lo", en: "the (m. sing.)", vi: "mạo từ nam số ít", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Trước 's+phụ âm', 'z', 'gn', v.v.", pronunciation_en: "Before s+consonant, z, gn, etc.", l1_note_vi: "Nói 'il studente'", l1_note_en: "Using 'il studente'", correction_drill: "lo studente; lo zaino; lo gnocco" },
    { word: "la", en: "the (f. sing.)", vi: "mạo từ nữ số ít", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Giống cái số ít", pronunciation_en: "Feminine singular", l1_note_vi: "Dùng 'il' cho mọi danh từ", l1_note_en: "Using 'il' for all nouns", correction_drill: "la casa; la pratica; la domanda" },
    { word: "l'", en: "the (before a vowel)", vi: "mạo từ trước nguyên âm", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Trước nguyên âm", pronunciation_en: "Before a vowel", l1_note_vi: "Viết 'la amica' ở dạng thường", l1_note_en: "Writing 'la amica' in normal form", correction_drill: "l'amica; l'ufficio" },
    { word: "i", en: "the (m. pl.)", vi: "mạo từ nam số nhiều", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Số nhiều của nhiều danh từ 'il'", pronunciation_en: "Plural of many 'il' nouns", l1_note_vi: "Dùng mạo từ số ít với danh từ số nhiều", l1_note_en: "Using a singular article with a plural noun", correction_drill: "i documenti; i treni" },
    { word: "gli", en: "the (m. pl.)", vi: "mạo từ nam số nhiều", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Số nhiều của 'lo'/danh từ nguyên âm; 'gli' đọc mềm", pronunciation_en: "Plural of lo/vowel nouns; soft 'gli' sound", l1_note_vi: "Đọc cứng 'g-li'", l1_note_en: "Pronouncing a hard 'g-li'", correction_drill: "gli studenti; gli amici" },
    { word: "le", en: "the (f. pl.)", vi: "mạo từ nữ số nhiều", pos: "article", band: "2 · Articles & pronouns", pronunciation_vi: "Giống cái số nhiều", pronunciation_en: "Feminine plural", l1_note_vi: "Nói 'la case'", l1_note_en: "Saying 'la case'", correction_drill: "le case; le domande" },
    { word: "io / tu", en: "I / you", vi: "tôi / bạn", pos: "pronoun", band: "2 · Articles & pronouns", pronunciation_vi: "Đại từ chủ ngữ thường được lược", pronunciation_en: "Pronouns are often omitted", l1_note_vi: "Lạm dụng đại từ chủ ngữ", l1_note_en: "Overusing subject pronouns", correction_drill: "Io parlo; Parlo italiano" },
    { word: "lui / lei", en: "he / she (also formal 'Lei' = you)", vi: "anh ấy / cô ấy", pos: "pronoun", band: "2 · Articles & pronouns", pronunciation_vi: "'Lei' viết hoa là 'ngài/ông/bà' (kính ngữ)", pronunciation_en: "Also formal 'Lei' = you", l1_note_vi: "Nhầm 'lei' (cô ấy) với 'Lei' kính ngữ", l1_note_en: "Confusing 'lei' (she) and formal 'Lei' (you)", correction_drill: "Lei come si chiama?" },
    { word: "noi / voi / loro", en: "we / you (pl.) / they", vi: "chúng tôi / các bạn / họ", pos: "pronoun", band: "2 · Articles & pronouns", pronunciation_vi: "Chủ ngữ số nhiều", pronunciation_en: "Plural subjects", l1_note_vi: "Dùng động từ số ít với chủ ngữ số nhiều", l1_note_en: "Using a singular verb with a plural subject", correction_drill: "noi siamo; voi siete; loro sono" },

    // ── Band 3 — Essential Verbs 1 ──
    { word: "essere", en: "to be", vi: "là / ở trạng thái", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "sono, sei, è, siamo, siete, sono", pronunciation_en: "sono, sei, è, siamo, siete, sono", l1_note_vi: "Nói 'io essere'", l1_note_en: "Saying 'io essere'", correction_drill: "Luyện tất cả các dạng mỗi ngày" },
    { word: "avere", en: "to have", vi: "có", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "ho, hai, ha, abbiamo, avete, hanno; 'h' câm", pronunciation_en: "ho, hai, ha, abbiamo, avete, hanno; h silent", l1_note_vi: "Đọc thành tiếng chữ 'h'", l1_note_en: "Pronouncing the 'h'", correction_drill: "Ho fame; ho tempo; ho 30 anni" },
    { word: "fare", en: "to do / make", vi: "làm", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "Bất quy tắc: faccio, fai, fa", pronunciation_en: "Irregular: faccio, fai, fa", l1_note_vi: "Nói 'io fare'", l1_note_en: "Saying 'io fare'", correction_drill: "Faccio una domanda; fa caldo" },
    { word: "andare", en: "to go", vi: "đi", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "Bất quy tắc: vado, vai, va", pronunciation_en: "Irregular: vado, vai, va", l1_note_vi: "Nói 'ando'", l1_note_en: "Saying 'ando'", correction_drill: "Vado a casa; andiamo al lavoro" },
    { word: "venire", en: "to come", vi: "đến", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "vengo, vieni, viene", pronunciation_en: "vengo, vieni, viene", l1_note_vi: "Nhầm 'andare' và 'venire'", l1_note_en: "Confusing 'andare' and 'venire'", correction_drill: "Vado da Marco; Marco viene da me" },
    { word: "dire", en: "to say / tell", vi: "nói", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "dico, dici, dice", pronunciation_en: "dico, dici, dice", l1_note_vi: "Dùng 'parlare' cho mọi nghĩa 'nói'", l1_note_en: "Using 'parlare' for all 'nói'", correction_drill: "Dico la verità; parlo italiano" },
    { word: "potere", en: "can / to be able to", vi: "có thể", pos: "verb (modal)", band: "3 · Essential verbs 1", pronunciation_vi: "posso, puoi, può", pronunciation_en: "posso, puoi, può", l1_note_vi: "Thêm 'di' trước động từ nguyên thể", l1_note_en: "Adding 'di' before the infinitive", correction_drill: "Posso entrare?" },
    { word: "dovere", en: "must / to have to", vi: "phải", pos: "verb (modal)", band: "3 · Essential verbs 1", pronunciation_vi: "devo, devi, deve", pronunciation_en: "devo, devi, deve", l1_note_vi: "Chia luôn động từ thứ hai", l1_note_en: "Conjugating the second verb", correction_drill: "Devo lavorare, KHÔNG phải 'devo lavoro'" },
    { word: "volere", en: "to want", vi: "muốn", pos: "verb (modal)", band: "3 · Essential verbs 1", pronunciation_vi: "voglio, vuoi, vuole; lịch sự 'vorrei'", pronunciation_en: "voglio, vuoi, vuole; polite 'vorrei'", l1_note_vi: "Dùng 'voglio' với người lạ", l1_note_en: "Using 'voglio' with strangers", correction_drill: "Vorrei un caffè" },
    { word: "sapere", en: "to know (facts / how to)", vi: "biết", pos: "verb (irregular)", band: "3 · Essential verbs 1", pronunciation_vi: "Kiến thức/khả năng; 'so'", pronunciation_en: "Knowledge/ability; 'so'", l1_note_vi: "Nhầm với 'conoscere'", l1_note_en: "Confusing with 'conoscere'", correction_drill: "So parlare; conosco Marco" },

    // ── Band 4 — Essential Verbs 2 ──
    { word: "vedere", en: "to see", vi: "nhìn / thấy", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "'vedo'", pronunciation_en: "'vedo'", l1_note_vi: "Nhầm với 'guardare'", l1_note_en: "Confusing with 'guardare'", correction_drill: "Vedo un problema; guardo la TV" },
    { word: "guardare", en: "to look / watch", vi: "nhìn / xem", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "Nhìn chủ động", pronunciation_en: "Active looking", l1_note_vi: "Dùng cho việc thấy tình cờ", l1_note_en: "Using it for accidental seeing", correction_drill: "Guardo il documento" },
    { word: "prendere", en: "to take / catch / have", vi: "lấy / bắt / dùng", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "Rất phổ biến: tàu, cà phê, thuốc", pronunciation_en: "Very common: train, coffee, medicine", l1_note_vi: "Chỉ dịch là 'take'", l1_note_en: "Translating only as 'take'", correction_drill: "Prendo il treno; prendo un caffè" },
    { word: "mettere", en: "to put / place / put on", vi: "đặt / để / mặc", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "'tt' đôi", pronunciation_en: "Double 'tt'", l1_note_vi: "Phụ âm đôi quá ngắn", l1_note_en: "Too-short double consonant", correction_drill: "Metto la giacca; metto qui" },
    { word: "dare", en: "to give", vi: "đưa / cho", pos: "verb (irregular)", band: "4 · Essential verbs 2", pronunciation_vi: "do, dai, dà", pronunciation_en: "do, dai, dà", l1_note_vi: "Nhầm giới từ 'da' và động từ 'dà'", l1_note_en: "Confusing 'da' (prep.) and 'dà' (verb)", correction_drill: "Mi dà una mano?" },
    { word: "trovare", en: "to find", vi: "tìm thấy", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "Cũng phản thân 'trovarsi' = nằm ở", pronunciation_en: "Also reflexive 'trovarsi' = be located", l1_note_vi: "Luôn dùng theo nghĩa 'gặp'", l1_note_en: "Using it for 'meet' always", correction_drill: "Trovo le chiavi; mi trovo in ufficio" },
    { word: "lasciare", en: "to leave (behind) / let", vi: "để lại / rời", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "Dùng cho đồ vật và sự cho phép", pronunciation_en: "Useful for objects and permission", l1_note_vi: "Chỉ hiểu là 'rời đi'", l1_note_en: "Confusing with depart only", correction_drill: "Ho lasciato il telefono a casa" },
    { word: "parlare", en: "to speak / talk", vi: "nói chuyện / nói ngôn ngữ", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "'parlare con', 'parlare italiano'", pronunciation_en: "parlare con, parlare italiano", l1_note_vi: "Nói 'parlare a' cho việc trò chuyện", l1_note_en: "Saying 'parlare a' for conversation", correction_drill: "Parlo con Anna" },
    { word: "chiedere", en: "to ask / request", vi: "hỏi / yêu cầu", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "'chiedere a qualcuno di'", pronunciation_en: "chiedere a qualcuno di", l1_note_vi: "Sai chuỗi giới từ", l1_note_en: "Wrong preposition chain", correction_drill: "Chiedo a Marco di aiutarmi" },
    { word: "rispondere", en: "to answer / reply", vi: "trả lời", pos: "verb", band: "4 · Essential verbs 2", pronunciation_vi: "'rispondere a'", pronunciation_en: "rispondere a", l1_note_vi: "Thiếu 'a'", l1_note_en: "Missing 'a'", correction_drill: "Rispondo alla domanda" },

    // ── Band 5 — People and Family ──
    { word: "persona", en: "person", vi: "người", pos: "noun (f)", band: "5 · People & family", pronunciation_vi: "Danh từ giống cái", pronunciation_en: "Feminine noun", l1_note_vi: "Dùng mạo từ giống đực", l1_note_en: "Using a masculine article", correction_drill: "una persona; le persone" },
    { word: "uomo", en: "man", vi: "đàn ông", pos: "noun (m)", band: "5 · People & family", pronunciation_vi: "Số nhiều bất quy tắc: 'uomini'", pronunciation_en: "Irregular plural: uomini", l1_note_vi: "Nói 'uomos'", l1_note_en: "Saying 'uomos'", correction_drill: "un uomo; due uomini" },
    { word: "donna", en: "woman", vi: "phụ nữ", pos: "noun (f)", band: "5 · People & family", pronunciation_vi: "'nn' đôi", pronunciation_en: "Double 'nn'", l1_note_vi: "/n/ quá ngắn", l1_note_en: "Too short /n/", correction_drill: "don-na; una donna" },
    { word: "bambino / bambina", en: "boy / girl, child", vi: "bé trai / bé gái", pos: "noun (m/f)", band: "5 · People & family", pronunciation_vi: "Đuôi giống quan trọng", pronunciation_en: "Gender ending matters", l1_note_vi: "Nuốt nguyên âm cuối", l1_note_en: "Dropping the final vowel", correction_drill: "Ghép cặp giống đực/giống cái" },
    { word: "amico / amica", en: "friend (m/f)", vi: "bạn nam / bạn nữ", pos: "noun (m/f)", band: "5 · People & family", pronunciation_vi: "Số nhiều: 'amici/amiche'", pronunciation_en: "Plural: amici/amiche", l1_note_vi: "Quên thay đổi chính tả", l1_note_en: "Forgetting the spelling change", correction_drill: "un amico; un'amica; gli amici" },
    { word: "famiglia", en: "family", vi: "gia đình", pos: "noun (f)", band: "5 · People & family", pronunciation_vi: "'gli' đọc mềm", pronunciation_en: "Soft 'gli'", l1_note_vi: "Đọc cứng 'g-l'", l1_note_en: "Hard 'g-l' pronunciation", correction_drill: "fa-MI-glia" },
    { word: "madre", en: "mother", vi: "mẹ", pos: "noun (f)", band: "5 · People & family", pronunciation_vi: "Thường 'mia madre', không mạo từ", pronunciation_en: "Usually 'mia madre' without article", l1_note_vi: "Nói 'la mia madre'", l1_note_en: "Saying 'la mia madre'", correction_drill: "mia madre; mio padre" },
    { word: "padre", en: "father", vi: "bố", pos: "noun (m)", band: "5 · People & family", pronunciation_vi: "Thường 'mio padre'", pronunciation_en: "Usually 'mio padre'", l1_note_vi: "Cùng lỗi mạo từ với người thân", l1_note_en: "Same article issue", correction_drill: "mio padre lavora" },
    { word: "figlio / figlia", en: "son / daughter", vi: "con trai / con gái", pos: "noun (m/f)", band: "5 · People & family", pronunciation_vi: "'gli' đọc mềm", pronunciation_en: "Soft 'gli'", l1_note_vi: "Đọc cứng 'fig-li-o'", l1_note_en: "Hard 'fig-li-o'", correction_drill: "fi-lyo, rồi nói kiểu Ý" },
    { word: "marito / moglie", en: "husband / wife", vi: "chồng / vợ", pos: "noun (m/f)", band: "5 · People & family", pronunciation_vi: "'moglie' có 'gli' mềm", pronunciation_en: "'moglie' has soft 'gli'", l1_note_vi: "Nói 'mog-lie'", l1_note_en: "Saying 'mog-lie'", correction_drill: "mio marito; mia moglie" },

    // ── Band 6 — Body, Health, Feelings ──
    { word: "corpo", en: "body", vi: "cơ thể", pos: "noun (m)", band: "6 · Body, health, feelings", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Nuốt 'o' cuối", l1_note_en: "Dropping the final 'o'", correction_drill: "il corpo" },
    { word: "testa", en: "head", vi: "đầu", pos: "noun (f)", band: "6 · Body, health, feelings", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Sai mạo từ", l1_note_en: "Wrong article", correction_drill: "la testa" },
    { word: "mano", en: "hand", vi: "tay", pos: "noun (f)", band: "6 · Body, health, feelings", pronunciation_vi: "Giống cái dù tận cùng 'o': 'la mano'", pronunciation_en: "Feminine despite ending in 'o': la mano", l1_note_vi: "Nói 'il mano'", l1_note_en: "Saying 'il mano'", correction_drill: "la mano; le mani" },
    { word: "occhio", en: "eye", vi: "mắt", pos: "noun (m)", band: "6 · Body, health, feelings", pronunciation_vi: "Số nhiều 'occhi'", pronunciation_en: "Plural 'occhi'", l1_note_vi: "Không nghe ra âm 'chi'", l1_note_en: "Not hearing the 'chi' sound", correction_drill: "un occhio; due occhi" },
    { word: "cuore", en: "heart", vi: "tim", pos: "noun (m)", band: "6 · Body, health, feelings", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Đọc 'cuo' phẳng", l1_note_en: "Pronouncing 'cuo' flat", correction_drill: "il cuore" },
    { word: "dolore", en: "pain", vi: "đau", pos: "noun (m)", band: "6 · Body, health, feelings", pronunciation_vi: "'Ho dolore' / 'mi fa male'", pronunciation_en: "Ho dolore / mi fa male", l1_note_vi: "Nói 'sono dolore'", l1_note_en: "Saying 'sono dolore'", correction_drill: "Mi fa male la testa" },
    { word: "fame", en: "hunger", vi: "đói", pos: "noun (f)", band: "6 · Body, health, feelings", pronunciation_vi: "Tiếng Ý nói 'ho fame'", pronunciation_en: "Italian says 'ho fame'", l1_note_vi: "Nói 'sono fame'", l1_note_en: "Saying 'sono fame'", correction_drill: "Ho fame" },
    { word: "sete", en: "thirst", vi: "khát", pos: "noun (f)", band: "6 · Body, health, feelings", pronunciation_vi: "Tiếng Ý nói 'ho sete'", pronunciation_en: "Italian says 'ho sete'", l1_note_vi: "Nói 'sono sete'", l1_note_en: "Saying 'sono sete'", correction_drill: "Ho sete" },
    { word: "stanco / stanca", en: "tired", vi: "mệt", pos: "adjective", band: "6 · Body, health, feelings", pronunciation_vi: "Hợp giống", pronunciation_en: "Gender agreement", l1_note_vi: "Một đuôi tính từ cho tất cả", l1_note_en: "One adjective ending for everyone", correction_drill: "Chọn đúng dạng của bạn" },
    { word: "paura", en: "fear", vi: "sợ", pos: "noun (f)", band: "6 · Body, health, feelings", pronunciation_vi: "'avere paura'", pronunciation_en: "avere paura", l1_note_vi: "Nói 'sono paura'", l1_note_en: "Saying 'sono paura'", correction_drill: "Ho paura; non ho paura" },

    // ── Band 7 — Home and Daily Objects ──
    { word: "casa", en: "house / home", vi: "nhà", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nuốt 'a' cuối", l1_note_en: "Dropping the final 'a'", correction_drill: "a casa; la casa" },
    { word: "stanza", en: "room", vi: "phòng", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Sai trọng âm và nguyên âm cuối", l1_note_en: "Stress and final vowel", correction_drill: "una stanza grande" },
    { word: "letto", en: "bed", vi: "giường", pos: "noun (m)", band: "7 · Home & daily objects", pronunciation_vi: "'tt' đôi", pronunciation_en: "Double 'tt'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "let-to" },
    { word: "tavolo", en: "table", vi: "bàn", pos: "noun (m)", band: "7 · Home & daily objects", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Nhầm với 'tavola'", l1_note_en: "Confusing with 'tavola'", correction_drill: "il tavolo; a tavola" },
    { word: "sedia", en: "chair", vi: "ghế", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Đọc 'dia' thành một âm không rõ", l1_note_en: "Pronouncing 'dia' as one unclear sound", correction_drill: "se-di-a" },
    { word: "porta", en: "door", vi: "cửa", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với 'portare'", l1_note_en: "Confusing with 'portare'", correction_drill: "la porta è aperta" },
    { word: "finestra", en: "window", vi: "cửa sổ", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Thêm nguyên âm trước cụm phụ âm", l1_note_en: "Extra vowel before the cluster", correction_drill: "fi-nes-tra" },
    { word: "chiave", en: "key", vi: "chìa khóa", pos: "noun (f)", band: "7 · Home & daily objects", pronunciation_vi: "'chi' = /ki/", pronunciation_en: "'chi' = /ki/", l1_note_vi: "Đọc như 'ch' tiếng Anh", l1_note_en: "Reading it like English 'ch'", correction_drill: "la chiave; le chiavi" },
    { word: "telefono", en: "phone", vi: "điện thoại", pos: "noun (m)", band: "7 · Home & daily objects", pronunciation_vi: "Trọng âm 'te-LE-fo-no'", pronunciation_en: "Stress te-LE-fo-no", l1_note_vi: "Nhấn âm cuối", l1_note_en: "Stressing the last syllable", correction_drill: "Vỗ tay vào 'LE'" },
    { word: "vestito", en: "dress / suit / garment", vi: "quần áo / váy", pos: "noun (m)", band: "7 · Home & daily objects", pronunciation_vi: "Có thể là váy/bộ vest/món đồ mặc", pronunciation_en: "Can mean dress/suit/clothing item", l1_note_vi: "Dịch quá hẹp", l1_note_en: "Translating too narrowly", correction_drill: "Dùng theo ngữ cảnh cụm từ" },

    // ── Band 8 — Food and Shopping ──
    { word: "acqua", en: "water", vi: "nước", pos: "noun (f)", band: "8 · Food & shopping", pronunciation_vi: "'cq' = /kkw/", pronunciation_en: "'cq' = /kkw/", l1_note_vi: "Đọc /k/ yếu", l1_note_en: "Saying a weak /k/", correction_drill: "ac-qua" },
    { word: "pane", en: "bread", vi: "bánh mì", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "Có 'e' cuối", pronunciation_en: "Final 'e'", l1_note_vi: "Dừng ở 'pan'", l1_note_en: "Ending at 'pan'", correction_drill: "un pane; il pane" },
    { word: "riso", en: "rice", vi: "gạo / cơm", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Nhầm với 'riso' = tiếng cười", l1_note_en: "Confusing with laugh 'riso' context", correction_drill: "mangio riso" },
    { word: "carne", en: "meat", vi: "thịt", pos: "noun (f)", band: "8 · Food & shopping", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nuốt 'e' cuối", l1_note_en: "Dropping the final 'e'", correction_drill: "la carne" },
    { word: "pesce", en: "fish", vi: "cá", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "'sce' = /she/", pronunciation_en: "'sce' = /she/", l1_note_vi: "Đọc cứng 'ske'", l1_note_en: "Hard 'ske'", correction_drill: "pe-sce" },
    { word: "verdura", en: "vegetable(s)", vi: "rau", pos: "noun (f)", band: "8 · Food & shopping", pronunciation_vi: "Thường số ít gộp", pronunciation_en: "Often singular collective", l1_note_vi: "Mặc định nói số nhiều", l1_note_en: "Saying plural by default", correction_drill: "mangio verdura" },
    { word: "frutta", en: "fruit", vi: "trái cây", pos: "noun (f)", band: "8 · Food & shopping", pronunciation_vi: "'tt' đôi; danh từ gộp", pronunciation_en: "Double 'tt'; collective", l1_note_vi: "/t/ quá ngắn", l1_note_en: "Too-short /t/", correction_drill: "frut-ta" },
    { word: "caffè", en: "coffee", vi: "cà phê", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Nguyên âm cuối yếu", l1_note_en: "Weak final vowel", correction_drill: "caf-FÈ" },
    { word: "conto", en: "bill / account", vi: "hóa đơn / tài khoản", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "Hóa đơn nhà hàng: 'il conto'", pronunciation_en: "Restaurant bill: il conto", l1_note_vi: "Chỉ hiểu là 'account'", l1_note_en: "Confusing with 'account' only", correction_drill: "Il conto, per favore" },
    { word: "prezzo", en: "price", vi: "giá", pos: "noun (m)", band: "8 · Food & shopping", pronunciation_vi: "'zz' = /tts/", pronunciation_en: "'zz' = /tts/", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z sound", correction_drill: "prez-zo" },

    // ── Band 9 — Time ──
    { word: "tempo", en: "time / weather", vi: "thời gian / thời tiết", pos: "noun (m)", band: "9 · Time", pronunciation_vi: "Ngữ cảnh quyết định nghĩa", pronunciation_en: "Context decides", l1_note_vi: "Luôn dịch là thời tiết", l1_note_en: "Translating always as weather", correction_drill: "Ho tempo; che tempo fa?" },
    { word: "ora", en: "hour / now", vi: "giờ / bây giờ", pos: "noun (f) / adverb", band: "9 · Time", pronunciation_vi: "'Che ora è?'", pronunciation_en: "Che ora è?", l1_note_vi: "Nói 'quanto tempo' để hỏi giờ", l1_note_en: "Saying 'quanto tempo' for clock time", correction_drill: "Che ora è?" },
    { word: "giorno", en: "day", vi: "ngày", pos: "noun (m)", band: "9 · Time", pronunciation_vi: "'gio' = jo", pronunciation_en: "'gio' = jo", l1_note_vi: "Đọc g cứng", l1_note_en: "Hard g", correction_drill: "buongiorno; ogni giorno" },
    { word: "settimana", en: "week", vi: "tuần", pos: "noun (f)", band: "9 · Time", pronunciation_vi: "'tt' đôi", pronunciation_en: "Double 'tt'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "set-ti-ma-na" },
    { word: "mese", en: "month", vi: "tháng", pos: "noun (m)", band: "9 · Time", pronunciation_vi: "Có 'e' cuối", pronunciation_en: "Final 'e'", l1_note_vi: "Nuốt nguyên âm", l1_note_en: "Dropping the vowel", correction_drill: "un mese" },
    { word: "anno", en: "year", vi: "năm", pos: "noun (m)", band: "9 · Time", pronunciation_vi: "'nn' đôi; 'hanno' = họ có", pronunciation_en: "Double 'nn'; 'hanno' = they have", l1_note_vi: "Nhầm khi viết", l1_note_en: "Confusing in writing", correction_drill: "un anno; loro hanno" },
    { word: "oggi", en: "today", vi: "hôm nay", pos: "adverb", band: "9 · Time", pronunciation_vi: "'gg' = j mạnh", pronunciation_en: "'gg' = strong j", l1_note_vi: "Đọc g cứng", l1_note_en: "Hard g", correction_drill: "oggi lavoro" },
    { word: "domani", en: "tomorrow", vi: "ngày mai", pos: "adverb", band: "9 · Time", pronunciation_vi: "Không phải Chủ Nhật ('domenica')", pronunciation_en: "Not Sunday ('domenica')", l1_note_vi: "Nhầm 'domani/domenica'", l1_note_en: "Confusing 'domani'/'domenica'", correction_drill: "Ghép cả hai" },
    { word: "ieri", en: "yesterday", vi: "hôm qua", pos: "adverb", band: "9 · Time", pronunciation_vi: "Theo sau là thì quá khứ", pronunciation_en: "Useful but past tense follows", l1_note_vi: "Dùng thì hiện tại sau 'ieri'", l1_note_en: "Using present after 'ieri'", correction_drill: "Ieri ho lavorato" },
    { word: "sempre / mai", en: "always / never", vi: "luôn luôn / không bao giờ", pos: "adverb", band: "9 · Time", pronunciation_vi: "'mai' thường đi với 'non'", pronunciation_en: "'mai' often with 'non'", l1_note_vi: "Dùng 'mai' một mình để phủ định", l1_note_en: "Saying 'mai' alone for negative", correction_drill: "Non fumo mai" },

    // ── Band 10 — Places and Movement ──
    { word: "posto", en: "place / spot", vi: "chỗ / nơi", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "Nơi chốn chung", pronunciation_en: "Generic place", l1_note_vi: "Lạm dụng cho mọi địa điểm", l1_note_en: "Overusing for all locations", correction_drill: "un posto libero" },
    { word: "strada", en: "road / street", vi: "đường", pos: "noun (f)", band: "10 · Places & movement", pronunciation_vi: "Cụm 'str'", pronunciation_en: "'str' cluster", l1_note_vi: "Thêm nguyên âm", l1_note_en: "Adding an extra vowel", correction_drill: "stra-da, không phải 'sư-tra-da'" },
    { word: "città", en: "city", vi: "thành phố", pos: "noun (f)", band: "10 · Places & movement", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Âm cuối yếu", l1_note_en: "Weak final syllable", correction_drill: "cit-TÀ" },
    { word: "paese", en: "country / village", vi: "nước / làng", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "Ngữ cảnh quan trọng", pronunciation_en: "Context important", l1_note_vi: "Chỉ dịch là 'country'", l1_note_en: "Translating only as country", correction_drill: "il mio paese" },
    { word: "scuola", en: "school", vi: "trường", pos: "noun (f)", band: "10 · Places & movement", pronunciation_vi: "'scu' = sku", pronunciation_en: "'scu' = sku", l1_note_vi: "Đọc 'sh'", l1_note_en: "Saying 'sh'", correction_drill: "a scuola" },
    { word: "lavoro", en: "work / workplace", vi: "công việc / nơi làm", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "'al lavoro'", pronunciation_en: "al lavoro", l1_note_vi: "Nói 'a lavoro' trong mọi trường hợp", l1_note_en: "Saying 'a lavoro' in all cases", correction_drill: "vado al lavoro" },
    { word: "ufficio", en: "office", vi: "văn phòng", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "'ff' đôi; 'ci' = cho", pronunciation_en: "Double 'ff'; 'ci' = cho", l1_note_vi: "/f/ quá yếu", l1_note_en: "Too weak /f/", correction_drill: "uf-fi-cio" },
    { word: "stazione", en: "station", vi: "ga", pos: "noun (f)", band: "10 · Places & movement", pronunciation_vi: "'zione' = tsyo-ne", pronunciation_en: "'zione' = tsyo-ne", l1_note_vi: "Đọc 'sh' kiểu Anh", l1_note_en: "English 'sh'", correction_drill: "alla stazione" },
    { word: "ospedale", en: "hospital", vi: "bệnh viện", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Sai mạo từ", l1_note_en: "Wrong article", correction_drill: "in ospedale" },
    { word: "negozio", en: "shop / store", vi: "cửa hàng", pos: "noun (m)", band: "10 · Places & movement", pronunciation_vi: "Âm 'zio'", pronunciation_en: "'zio' sound", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "un negozio aperto" },

    // ── Band 11 — Work and Administration ──
    { word: "documento", en: "document / ID papers", vi: "tài liệu / giấy tờ", pos: "noun (m)", band: "11 · Work & administration", pronunciation_vi: "Nhấn 'MEN'", pronunciation_en: "Stress 'MEN'", l1_note_vi: "Nuốt 'o' cuối", l1_note_en: "Dropping the final 'o'", correction_drill: "il documento" },
    { word: "modulo", en: "form", vi: "mẫu đơn", pos: "noun (m)", band: "11 · Work & administration", pronunciation_vi: "Nhấn âm đầu", pronunciation_en: "Stress first syllable", l1_note_vi: "Đọc quá phẳng", l1_note_en: "Saying it too flat", correction_drill: "compilare il modulo" },
    { word: "domanda", en: "question / application", vi: "câu hỏi / đơn", pos: "noun (f)", band: "11 · Work & administration", pronunciation_vi: "Ngữ cảnh quyết định", pronunciation_en: "Context decides", l1_note_vi: "Chỉ dịch là 'câu hỏi'", l1_note_en: "Translating only as question", correction_drill: "fare una domanda; presentare domanda" },
    { word: "risposta", en: "answer / reply", vi: "câu trả lời", pos: "noun (f)", band: "11 · Work & administration", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Dùng động từ làm danh từ", l1_note_en: "Using the verb as a noun", correction_drill: "aspetto una risposta" },
    { word: "firma", en: "signature", vi: "chữ ký", pos: "noun (f)", band: "11 · Work & administration", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với 'ditta' (công ty)", l1_note_en: "Confusing with company 'ditta'", correction_drill: "mettere la firma" },
    { word: "permesso", en: "permit / permission", vi: "giấy phép / sự cho phép", pos: "noun (m)", band: "11 · Work & administration", pronunciation_vi: "'ss' đôi", pronunciation_en: "Double 'ss'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "permesso di soggiorno" },
    { word: "pratica", en: "case / paperwork", vi: "hồ sơ / thủ tục", pos: "noun (f)", band: "11 · Work & administration", pronunciation_vi: "Hồ sơ hành chính", pronunciation_en: "Administrative case", l1_note_vi: "Dịch là 'practice'", l1_note_en: "Translating as 'practice'", correction_drill: "la pratica è bloccata" },
    { word: "appuntamento", en: "appointment", vi: "lịch hẹn", pos: "noun (m)", band: "11 · Work & administration", pronunciation_vi: "'pp', 'tt' đôi", pronunciation_en: "Double 'pp', 'tt'", l1_note_vi: "Phụ âm đôi quá ngắn", l1_note_en: "Short doubles", correction_drill: "un appuntamento alle nove" },
    { word: "responsabile", en: "person in charge", vi: "người phụ trách", pos: "noun / adjective", band: "11 · Work & administration", pronunciation_vi: "Danh từ/tính từ", pronunciation_en: "Noun/adjective", l1_note_vi: "Chỉ dịch là tính từ", l1_note_en: "Translating as only adjective", correction_drill: "il responsabile" },
    { word: "turno", en: "shift", vi: "ca làm", pos: "noun (m)", band: "11 · Work & administration", pronunciation_vi: "Ca làm việc", pronunciation_en: "Work shift", l1_note_vi: "Chỉ hiểu là 'lượt' trong trò chơi", l1_note_en: "Confusing with turn in games only", correction_drill: "il turno di notte" },

    // ── Band 12 — Money and Numbers ──
    { word: "uno / una", en: "one / a", vi: "một", pos: "number / article", band: "12 · Money & numbers", pronunciation_vi: "Có giống trước danh từ", pronunciation_en: "Gendered before nouns", l1_note_vi: "Dùng 'uno' cho tất cả", l1_note_en: "Using 'uno' for all", correction_drill: "un euro; una casa" },
    { word: "due / tre", en: "two / three", vi: "hai / ba", pos: "number", band: "12 · Money & numbers", pronunciation_vi: "Dạng cố định", pronunciation_en: "Stable forms", l1_note_vi: "Thêm dấu số nhiều vào số đếm", l1_note_en: "Adding a plural marker to the number", correction_drill: "due euro; tre giorni" },
    { word: "dieci", en: "ten", vi: "mười", pos: "number", band: "12 · Money & numbers", pronunciation_vi: "'ci' = chi", pronunciation_en: "'ci' = chi", l1_note_vi: "Đọc cứng 'ki'", l1_note_en: "Hard 'ki'", correction_drill: "dieci minuti" },
    { word: "cento", en: "hundred", vi: "một trăm", pos: "number", band: "12 · Money & numbers", pronunciation_vi: "'ce' = che", pronunciation_en: "'ce' = che", l1_note_vi: "Đọc k cứng", l1_note_en: "Hard k", correction_drill: "cento euro" },
    { word: "mille", en: "thousand", vi: "một nghìn", pos: "number", band: "12 · Money & numbers", pronunciation_vi: "'ll' đôi", pronunciation_en: "Double 'll'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "mille euro" },
    { word: "euro", en: "euro", vi: "euro", pos: "noun (m)", band: "12 · Money & numbers", pronunciation_vi: "Thường không đổi số ít/số nhiều", pronunciation_en: "Usually same singular/plural in Italian use", l1_note_vi: "Nói 'euros'", l1_note_en: "Saying 'euros'", correction_drill: "un euro; dieci euro" },
    { word: "soldi", en: "money", vi: "tiền", pos: "noun (m pl)", band: "12 · Money & numbers", pronunciation_vi: "Danh từ số nhiều", pronunciation_en: "Plural noun", l1_note_vi: "Dùng mạo từ số ít", l1_note_en: "Using a singular article", correction_drill: "i soldi" },
    { word: "prezzo", en: "price", vi: "giá", pos: "noun (m)", band: "12 · Money & numbers", pronunciation_vi: "'zz' mạnh", pronunciation_en: "'zz' strong", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "il prezzo è alto" },
    { word: "pagare", en: "to pay", vi: "trả tiền", pos: "verb", band: "12 · Money & numbers", pronunciation_vi: "Động từ", pronunciation_en: "Verb", l1_note_vi: "Nhầm với danh từ 'pagamento'", l1_note_en: "Confusing with noun 'pagamento'", correction_drill: "Pago con carta" },
    { word: "carta / contanti", en: "card / cash", vi: "thẻ / tiền mặt", pos: "noun (f) / noun (m pl)", band: "12 · Money & numbers", pronunciation_vi: "'carta' cũng là giấy/thẻ", pronunciation_en: "'carta' also paper/card", l1_note_vi: "Dịch 'card' quá rộng", l1_note_en: "Translating card too broadly", correction_drill: "con carta; in contanti" },

    // ── Band 13 — Adjectives 1 ──
    { word: "grande", en: "big / large", vi: "lớn", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Cùng đuôi số ít cho m/f", pronunciation_en: "Same singular ending for m/f", l1_note_vi: "Nuốt 'e' cuối", l1_note_en: "Dropping the final 'e'", correction_drill: "una casa grande" },
    { word: "piccolo / piccola", en: "small", vi: "nhỏ", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Hòa hợp đổi đuôi", pronunciation_en: "Agreement changes", l1_note_vi: "Một dạng cho mọi danh từ", l1_note_en: "One form for all nouns", correction_drill: "Ghép danh từ + tính từ" },
    { word: "buono / buona", en: "good", vi: "tốt / ngon", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Thường rút thành 'buon' trước danh từ", pronunciation_en: "Often before noun as 'buon'", l1_note_vi: "Dùng một đuôi duy nhất", l1_note_en: "Using one ending", correction_drill: "un buon caffè; una buona idea" },
    { word: "cattivo / cattiva", en: "bad", vi: "xấu / tệ", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Hòa hợp giống", pronunciation_en: "Agreement", l1_note_vi: "Quên nguyên âm cuối", l1_note_en: "Forgetting the final vowel", correction_drill: "una cattiva idea" },
    { word: "bello / bella", en: "beautiful / nice", vi: "đẹp", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Đổi trước danh từ: 'bel', 'bella'", pronunciation_en: "Changes before nouns: bel, bella", l1_note_vi: "Lạm dụng dạng gốc", l1_note_en: "Overusing the base form", correction_drill: "un bel giorno; una bella casa" },
    { word: "nuovo / nuova", en: "new", vi: "mới", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Hòa hợp giống", pronunciation_en: "Agreement", l1_note_vi: "Nuốt đuôi", l1_note_en: "Dropping the ending", correction_drill: "un nuovo lavoro" },
    { word: "vecchio / vecchia", en: "old", vi: "cũ / già", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "'chi' cứng", pronunciation_en: "'chi' hard", l1_note_vi: "Đọc 'ch' kiểu Anh", l1_note_en: "Pronouncing 'ch' English", correction_drill: "una vecchia macchina" },
    { word: "facile", en: "easy", vi: "dễ", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Không đổi cho m/f số ít", pronunciation_en: "Invariable for m/f singular", l1_note_vi: "Thêm đuôi giống", l1_note_en: "Adding a gender ending", correction_drill: "un lavoro facile; una domanda facile" },
    { word: "difficile", en: "difficult", vi: "khó", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Nhấn âm giữa", pronunciation_en: "Stress middle", l1_note_vi: "Nuốt 'e' cuối", l1_note_en: "Dropping the final 'e'", correction_drill: "è difficile" },
    { word: "importante", en: "important", vi: "quan trọng", pos: "adjective", band: "13 · Adjectives 1", pronunciation_vi: "Có 'e' cuối; m/f số ít", pronunciation_en: "Final 'e'; m/f singular", l1_note_vi: "Kết thúc quá đột ngột", l1_note_en: "Ending too abruptly", correction_drill: "una cosa importante" },

    // ── Band 14 — Adjectives 2 ──
    { word: "alto / alta", en: "tall / high", vi: "cao / đắt", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Ngữ cảnh: chiều cao hoặc giá", pronunciation_en: "Context: height or price", l1_note_vi: "Chỉ dịch là 'cao'", l1_note_en: "Translating only as tall", correction_drill: "prezzo alto; persona alta" },
    { word: "basso / bassa", en: "low / short", vi: "thấp", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "'ss' đôi", pronunciation_en: "Double 'ss'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "prezzo basso" },
    { word: "lungo / lunga", en: "long", vi: "dài", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "'ng' + g cứng", pronunciation_en: "'ng' + hard g", l1_note_vi: "Thiếu nguyên âm cuối", l1_note_en: "Final vowel missing", correction_drill: "una strada lunga" },
    { word: "corto / corta", en: "short", vi: "ngắn", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Hòa hợp giống", pronunciation_en: "Agreement", l1_note_vi: "Dùng một dạng", l1_note_en: "Using one form", correction_drill: "una pausa corta" },
    { word: "aperto / aperta", en: "open", vi: "mở", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Quá khứ phân từ làm tính từ", pronunciation_en: "Past participle adjective", l1_note_vi: "Nhầm với động từ 'mở'", l1_note_en: "Confusing with verb open", correction_drill: "la porta è aperta" },
    { word: "chiuso / chiusa", en: "closed", vi: "đóng", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "'chi' = ki", pronunciation_en: "'chi' = ki", l1_note_vi: "Đọc 'ch' kiểu Anh", l1_note_en: "English ch", correction_drill: "il negozio è chiuso" },
    { word: "libero / libera", en: "free / available", vi: "rảnh / trống / tự do", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Hay dùng cho thời gian/chỗ", pronunciation_en: "Common in time/place", l1_note_vi: "Chỉ dịch là 'free/miễn phí'", l1_note_en: "Translating only free/no money", correction_drill: "sei libero?; posto libero" },
    { word: "occupato / occupata", en: "busy / taken", vi: "bận / bị chiếm", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Nhịp như phụ âm đôi", pronunciation_en: "Double-like rhythm", l1_note_vi: "Chỉ dịch là 'có việc làm'", l1_note_en: "Translating only employed", correction_drill: "sono occupato" },
    { word: "sicuro / sicura", en: "sure / safe", vi: "chắc chắn / an toàn", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Ngữ cảnh quyết định", pronunciation_en: "Context decides", l1_note_vi: "Dùng cho cả hai nghĩa mà không xét ngữ cảnh", l1_note_en: "Using for both without context", correction_drill: "sei sicuro?; un posto sicuro" },
    { word: "pronto / pronta", en: "ready", vi: "sẵn sàng", pos: "adjective", band: "14 · Adjectives 2", pronunciation_vi: "Cụm 'pr'", pronunciation_en: "'pr' cluster", l1_note_vi: "Thêm nguyên âm trước 'pr'", l1_note_en: "Adding a vowel before 'pr'", correction_drill: "sono pronto/pronta" },

    // ── Band 15 — Adverbs and Quantity ──
    { word: "molto", en: "very / a lot", vi: "rất / nhiều", pos: "adverb / adjective", band: "15 · Adverbs & quantity", pronunciation_vi: "Trước tính từ hoặc với động từ", pronunciation_en: "Before adjectives or with verbs", l1_note_vi: "Lạm dụng 'tanto' tùy tiện", l1_note_en: "Overusing 'tanto' randomly", correction_drill: "molto bene; lavoro molto" },
    { word: "poco", en: "little / few", vi: "ít", pos: "adverb / adjective", band: "15 · Adverbs & quantity", pronunciation_vi: "Có thể là tính từ/trạng từ", pronunciation_en: "Can be adjective/adverb", l1_note_vi: "Nhầm với 'piccolo'", l1_note_en: "Confusing with 'piccolo'", correction_drill: "ho poco tempo" },
    { word: "troppo", en: "too much / too", vi: "quá", pos: "adverb / adjective", band: "15 · Adverbs & quantity", pronunciation_vi: "'pp' đôi", pronunciation_en: "Double 'pp'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "troppo caro" },
    { word: "abbastanza", en: "enough / fairly", vi: "đủ / khá", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "'bb', 'zz' đôi", pronunciation_en: "Double 'bb', 'zz'", l1_note_vi: "Phụ âm yếu", l1_note_en: "Weak consonants", correction_drill: "abbastanza bene" },
    { word: "più", en: "more", vi: "hơn / thêm", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "So sánh hơn", pronunciation_en: "Comparative", l1_note_vi: "Thiếu dấu khi viết trang trọng", l1_note_en: "Missing accent in formal writing", correction_drill: "più grande; di più" },
    { word: "meno", en: "less", vi: "ít hơn", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "So sánh kém", pronunciation_en: "Comparative", l1_note_vi: "Nhầm 'meno' với nghĩa giờ kém", l1_note_en: "Confusing with 'meno' clock time", correction_drill: "meno caro; meno tempo" },
    { word: "già", en: "already", vi: "đã / rồi", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "Thường đứng trước quá khứ phân từ", pronunciation_en: "Often before past participle", l1_note_vi: "Đặt linh hoạt như tiếng Việt", l1_note_en: "Placing it loosely like Vietnamese", correction_drill: "ho già finito" },
    { word: "ancora", en: "still / again / more", vi: "vẫn / nữa", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "Ngữ cảnh quyết định", pronunciation_en: "Context decides", l1_note_vi: "Chỉ dịch là 'again'", l1_note_en: "Translating only 'again'", correction_drill: "ancora qui; ancora una volta" },
    { word: "quasi", en: "almost", vi: "gần như", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "Diễn đạt xấp xỉ", pronunciation_en: "Useful approximation", l1_note_vi: "Đọc như tiếng Anh", l1_note_en: "Pronouncing as English", correction_drill: "quasi pronto" },
    { word: "subito", en: "immediately", vi: "ngay lập tức", pos: "adverb", band: "15 · Adverbs & quantity", pronunciation_vi: "Nhấn âm đầu", pronunciation_en: "Stress first syllable", l1_note_vi: "Dùng 'adesso' cho mọi nghĩa 'ngay'", l1_note_en: "Using 'adesso' for all 'ngay'", correction_drill: "vengo subito" },

    // ── Band 16 — Connectors ──
    { word: "perché", en: "why / because", vi: "tại sao / bởi vì", pos: "conjunction", band: "16 · Connectors", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Trọng âm cuối yếu", l1_note_en: "Weak final stress", correction_drill: "Perché studi? Perché mi serve" },
    { word: "quindi", en: "so / therefore", vi: "vì vậy", pos: "conjunction", band: "16 · Connectors", pronunciation_vi: "Liên từ chỉ kết quả", pronunciation_en: "Result connector", l1_note_vi: "Chỉ dùng 'allora'", l1_note_en: "Using only 'allora'", correction_drill: "quindi dobbiamo..." },
    { word: "però", en: "however / but", vi: "tuy nhiên", pos: "conjunction", band: "16 · Connectors", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Trọng âm phẳng", l1_note_en: "Flat stress", correction_drill: "però non posso" },
    { word: "anche", en: "also / even", vi: "cũng / ngay cả", pos: "adverb / conjunction", band: "16 · Connectors", pronunciation_vi: "'anche se' = ngay cả khi", pronunciation_en: "'anche se' = even if", l1_note_vi: "Chỉ dùng như 'also'", l1_note_en: "Using only as 'also'", correction_drill: "anche io; anche se" },
    { word: "invece", en: "instead / on the contrary", vi: "thay vào đó / ngược lại", pos: "adverb", band: "16 · Connectors", pronunciation_vi: "Tương phản", pronunciation_en: "Contrast", l1_note_vi: "Chỉ dịch là 'instead'", l1_note_en: "Translating as only 'instead'", correction_drill: "io invece resto" },
    { word: "mentre", en: "while", vi: "trong khi", pos: "conjunction", band: "16 · Connectors", pronunciation_vi: "Đồng thời/tương phản", pronunciation_en: "Simultaneous/contrast", l1_note_vi: "Theo sau bằng động từ nguyên thể sai", l1_note_en: "Following with infinitive incorrectly", correction_drill: "mentre lavoro" },
    { word: "prima", en: "before / first", vi: "trước", pos: "adverb / preposition", band: "16 · Connectors", pronunciation_vi: "Thường 'prima di'", pronunciation_en: "Often 'prima di'", l1_note_vi: "Thiếu 'di'", l1_note_en: "Missing 'di'", correction_drill: "prima di uscire" },
    { word: "dopo", en: "after / then", vi: "sau", pos: "adverb / preposition", band: "16 · Connectors", pronunciation_vi: "'dopo il lavoro', 'dopo aver...'", pronunciation_en: "dopo il lavoro, dopo aver...", l1_note_vi: "Nhầm với 'poi'", l1_note_en: "Confusing with 'poi'", correction_drill: "Ghép 'dopo' và 'poi'" },
    { word: "senza", en: "without", vi: "không có / mà không", pos: "preposition", band: "16 · Connectors", pronunciation_vi: "Thường với danh từ hoặc động từ nguyên thể", pronunciation_en: "Usually with noun or infinitive", l1_note_vi: "Đặt động từ chia ngay sau", l1_note_en: "Putting a finite verb directly after", correction_drill: "senza soldi; senza parlare" },
    { word: "durante", en: "during", vi: "trong suốt", pos: "preposition", band: "16 · Connectors", pronunciation_vi: "Theo sau là danh từ", pronunciation_en: "Followed by noun", l1_note_vi: "Dùng với động từ nguyên thể", l1_note_en: "Using with infinitive", correction_drill: "durante la riunione" },

    // ── Band 17 — Communication ──
    { word: "parola", en: "word", vi: "từ", pos: "noun (f)", band: "17 · Communication", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với 'parlare'", l1_note_en: "Confusing with 'parlare'", correction_drill: "una parola nuova" },
    { word: "frase", en: "sentence", vi: "câu", pos: "noun (f)", band: "17 · Communication", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nuốt 'e' cuối", l1_note_en: "Dropping the final 'e'", correction_drill: "una frase utile" },
    { word: "lingua", en: "language / tongue", vi: "ngôn ngữ", pos: "noun (f)", band: "17 · Communication", pronunciation_vi: "'lingua' g cứng (không phải 'gli')", pronunciation_en: "'lingua' hard g (not 'gli')", l1_note_vi: "Lẫn lộn cách phát âm", l1_note_en: "Pronunciation confusion", correction_drill: "la lingua italiana" },
    { word: "italiano", en: "Italian (language / person)", vi: "tiếng Ý / người Ý", pos: "noun / adjective", band: "17 · Communication", pronunciation_vi: "Hòa hợp: 'italiano/italiana'", pronunciation_en: "Agreement: italiano/italiana", l1_note_vi: "Viết hoa tính từ chỉ quốc tịch", l1_note_en: "Capitalizing nationality adjectives", correction_drill: "sono vietnamita, studio italiano" },
    { word: "capire", en: "to understand", vi: "hiểu", pos: "verb", band: "17 · Communication", pronunciation_vi: "Hiện tại 'capisco'", pronunciation_en: "'capisco' present", l1_note_vi: "Nói 'sono capito'", l1_note_en: "Saying 'sono capito'", correction_drill: "Non capisco" },
    { word: "spiegare", en: "to explain", vi: "giải thích", pos: "verb", band: "17 · Communication", pronunciation_vi: "'spiegare a qualcuno'", pronunciation_en: "spiegare a qualcuno", l1_note_vi: "Thiếu người gián tiếp", l1_note_en: "Missing the indirect person", correction_drill: "Mi può spiegare?" },
    { word: "ripetere", en: "to repeat", vi: "lặp lại", pos: "verb", band: "17 · Communication", pronunciation_vi: "Nhấn 'TE'", pronunciation_en: "Stress 'TE'", l1_note_vi: "Đọc quá phẳng", l1_note_en: "Saying it too flat", correction_drill: "Può ripetere?" },
    { word: "scrivere", en: "to write", vi: "viết", pos: "verb", band: "17 · Communication", pronunciation_vi: "'scrivo'", pronunciation_en: "'scrivo'", l1_note_vi: "Nhầm với 'iscrivere'", l1_note_en: "Confusing with 'iscrivere'", correction_drill: "scrivo un messaggio" },
    { word: "leggere", en: "to read", vi: "đọc", pos: "verb", band: "17 · Communication", pronunciation_vi: "'gg' đôi mềm", pronunciation_en: "Double 'gg' soft", l1_note_vi: "Đọc g cứng", l1_note_en: "Hard g", correction_drill: "leggo un libro" },
    { word: "ascoltare", en: "to listen", vi: "nghe", pos: "verb", band: "17 · Communication", pronunciation_vi: "Nghe chủ động", pronunciation_en: "Active listening", l1_note_vi: "Nhầm với 'sentire'", l1_note_en: "Confusing with 'sentire'", correction_drill: "ascolto la lezione; sento un rumore" },

    // ── Band 18 — Technology and Media ──
    { word: "computer", en: "computer", vi: "máy tính", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "Từ mượn; mạo từ 'il'", pronunciation_en: "Loanword; article 'il'", l1_note_vi: "Đọc kiểu Anh hoàn toàn", l1_note_en: "Italian pronunciation, not English-only", correction_drill: "il computer" },
    { word: "telefono", en: "phone", vi: "điện thoại", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "Nhấn 'LE'", pronunciation_en: "Stress 'LE'", l1_note_vi: "Sai trọng âm", l1_note_en: "Wrong stress", correction_drill: "il telefono" },
    { word: "messaggio", en: "message", vi: "tin nhắn", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "'ss' đôi, 'gg' mềm", pronunciation_en: "Double 'ss', 'gg' soft", l1_note_vi: "Phụ âm đôi quá ngắn", l1_note_en: "Too short doubles", correction_drill: "un messaggio" },
    { word: "email", en: "email", vi: "email", pos: "noun (f)", band: "18 · Technology & media", pronunciation_vi: "Thường giống cái: 'un'email', 'la mail'", pronunciation_en: "Often feminine: un'email, la mail", l1_note_vi: "Không chắc về mạo từ", l1_note_en: "Wrong-article uncertainty", correction_drill: "mandare un'email" },
    { word: "sito", en: "website / site", vi: "trang web", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Chỉ hiểu là địa điểm vật lý", l1_note_en: "Translating as physical site only", correction_drill: "il sito web" },
    { word: "rete", en: "network / net", vi: "mạng", pos: "noun (f)", band: "18 · Technology & media", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với vật 'lưới'", l1_note_en: "Confusing with net object", correction_drill: "la rete" },
    { word: "password", en: "password", vi: "mật khẩu", pos: "noun (f)", band: "18 · Technology & media", pronunciation_vi: "Thường giống cái trong sử dụng", pronunciation_en: "Often feminine in use", l1_note_vi: "Phát âm Anh quá mạnh", l1_note_en: "English pronunciation too strong", correction_drill: "la password" },
    { word: "video", en: "video", vi: "video", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "Giống đực, số nhiều thường không đổi", pronunciation_en: "Masculine, often unchanged plural", l1_note_vi: "Dùng số nhiều kiểu Anh", l1_note_en: "Saying an English plural", correction_drill: "un video; due video" },
    { word: "notizia", en: "news (item)", vi: "tin tức", pos: "noun (f)", band: "18 · Technology & media", pronunciation_vi: "Giống cái; số nhiều 'notizie'", pronunciation_en: "Feminine; plural 'notizie'", l1_note_vi: "Dùng số ít cho tất cả", l1_note_en: "Using singular for all", correction_drill: "le notizie" },
    { word: "programma", en: "program", vi: "chương trình", pos: "noun (m)", band: "18 · Technology & media", pronunciation_vi: "Giống đực dù tận cùng 'a'", pronunciation_en: "Masculine despite 'a'", l1_note_vi: "Nói 'la programma'", l1_note_en: "Saying 'la programma'", correction_drill: "il programma" },

    // ── Band 19 — Education ──
    { word: "scuola", en: "school", vi: "trường", pos: "noun (f)", band: "19 · Education", pronunciation_vi: "'scu' đọc cứng (sku)", pronunciation_en: "'scu' hard (sku)", l1_note_vi: "Đọc thành âm 'sh'", l1_note_en: "Using an 'sh' sound", correction_drill: "a scuola" },
    { word: "classe", en: "class", vi: "lớp", pos: "noun (f)", band: "19 · Education", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nuốt 'e' cuối", l1_note_en: "Dropping the final 'e'", correction_drill: "in classe" },
    { word: "lezione", en: "lesson", vi: "bài học / buổi học", pos: "noun (f)", band: "19 · Education", pronunciation_vi: "Âm 'zione' (tsiô-ne)", pronunciation_en: "'zione' sound", l1_note_vi: "Đọc thành 'sh' kiểu Anh", l1_note_en: "English 'sh'", correction_drill: "una lezione" },
    { word: "insegnante", en: "teacher", vi: "giáo viên", pos: "noun (m/f)", band: "19 · Education", pronunciation_vi: "Dùng cho cả nam/nữ; mạo từ đổi", pronunciation_en: "Can be m/f; the article changes", l1_note_vi: "Tưởng đuôi quyết định giống", l1_note_en: "Assuming the ending marks gender", correction_drill: "l'insegnante (theo ngữ cảnh)" },
    { word: "studente / studentessa", en: "student (m / f)", vi: "học sinh / sinh viên (nam/nữ)", pos: "noun (m/f)", band: "19 · Education", pronunciation_vi: "Danh từ phân giống", pronunciation_en: "Gendered noun", l1_note_vi: "Dùng một dạng cho cả hai", l1_note_en: "Using one form for both", correction_drill: "Ghép cả hai dạng" },
    { word: "libro", en: "book", vi: "sách", pos: "noun (m)", band: "19 · Education", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Nuốt 'o' cuối", l1_note_en: "Dropping the final 'o'", correction_drill: "un libro" },
    { word: "quaderno", en: "notebook", vi: "vở", pos: "noun (m)", band: "19 · Education", pronunciation_vi: "'qua' = kwa", pronunciation_en: "'qua' = kwa", l1_note_vi: "Theo thói quen 'qua' tiếng Việt", l1_note_en: "Vietnamese 'qua' habit", correction_drill: "un quaderno" },
    { word: "esercizio", en: "exercise", vi: "bài tập", pos: "noun (m)", band: "19 · Education", pronunciation_vi: "Âm 'zio' (tsio)", pronunciation_en: "'zio' sound", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "fare un esercizio" },
    { word: "esame", en: "exam", vi: "kỳ thi", pos: "noun (m)", band: "19 · Education", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Dùng sai mạo từ", l1_note_en: "Wrong article", correction_drill: "un esame difficile" },
    { word: "voto", en: "grade / vote", vi: "điểm", pos: "noun (m)", band: "19 · Education", pronunciation_vi: "Cũng nghĩa 'phiếu bầu'", pronunciation_en: "Also means vote", l1_note_vi: "Ngữ cảnh quyết định nghĩa", l1_note_en: "Context decides", correction_drill: "un buon voto" },

    // ── Band 20 — Travel and Transport ──
    { word: "treno", en: "train", vi: "tàu", pos: "noun (m)", band: "20 · Travel & transport", pronunciation_vi: "Cụm 'tr'", pronunciation_en: "'tr' cluster", l1_note_vi: "Thêm nguyên âm thừa", l1_note_en: "Adding an extra vowel", correction_drill: "tre-no" },
    { word: "autobus", en: "bus", vi: "xe buýt", pos: "noun (m)", band: "20 · Travel & transport", pronunciation_vi: "Giống đực, thường không đổi số nhiều", pronunciation_en: "Masculine, often unchanged plural", l1_note_vi: "Phát âm Anh quá mạnh", l1_note_en: "English pronunciation too strong", correction_drill: "l'autobus" },
    { word: "macchina", en: "car / machine", vi: "xe hơi / máy", pos: "noun (f)", band: "20 · Travel & transport", pronunciation_vi: "'cc' đôi, 'chi' cứng", pronunciation_en: "Double 'cc', hard 'chi'", l1_note_vi: "Phụ âm đôi quá yếu", l1_note_en: "Weak double", correction_drill: "mac-chi-na" },
    { word: "biglietto", en: "ticket", vi: "vé", pos: "noun (m)", band: "20 · Travel & transport", pronunciation_vi: "'gli' mềm, 'tt' đôi", pronunciation_en: "'gli' soft, double 'tt'", l1_note_vi: "Đọc 'g-l' cứng", l1_note_en: "Hard 'g-l'", correction_drill: "bi-gliet-to" },
    { word: "viaggio", en: "trip / journey", vi: "chuyến đi", pos: "noun (m)", band: "20 · Travel & transport", pronunciation_vi: "'gg' đôi mềm", pronunciation_en: "Double 'gg' soft", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "un viaggio lungo" },
    { word: "aeroporto", en: "airport", vi: "sân bay", pos: "noun (m)", band: "20 · Travel & transport", pronunciation_vi: "Nhiều nguyên âm liền", pronunciation_en: "Many vowels", l1_note_vi: "Nuốt nguyên âm giữa", l1_note_en: "Swallowing the middle vowels", correction_drill: "a-e-ro-por-to" },
    { word: "strada", en: "street / road", vi: "đường", pos: "noun (f)", band: "20 · Travel & transport", pronunciation_vi: "Cụm 'str'", pronunciation_en: "'str' cluster", l1_note_vi: "Thêm nguyên âm thừa", l1_note_en: "Extra vowel", correction_drill: "stra-da" },
    { word: "fermata", en: "stop (bus / tram)", vi: "trạm dừng", pos: "noun (f)", band: "20 · Travel & transport", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với động từ 'fermare'", l1_note_en: "Confusing with 'fermare'", correction_drill: "la fermata" },
    { word: "partire", en: "to leave / depart", vi: "khởi hành", pos: "verb", band: "20 · Travel & transport", pronunciation_vi: "'parto, parti, parte'", pronunciation_en: "'parto' present", l1_note_vi: "Nhầm với 'uscire'", l1_note_en: "Confusing with 'uscire'", correction_drill: "il treno parte" },
    { word: "arrivare", en: "to arrive", vi: "đến", pos: "verb", band: "20 · Travel & transport", pronunciation_vi: "'rr' đôi", pronunciation_en: "Double 'rr'", l1_note_vi: "Âm /r/ quá yếu", l1_note_en: "Too weak /r/", correction_drill: "arrivo alle otto" },

    // ── Band 21 — High-Value Verbs 3 ──
    { word: "entrare", en: "to enter", vi: "vào", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "'entrare in'", pronunciation_en: "'entrare in'", l1_note_vi: "Thiếu giới từ", l1_note_en: "Missing the preposition", correction_drill: "entro in casa" },
    { word: "uscire", en: "to go out", vi: "ra ngoài", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Bất quy tắc 'esco, esci, esce'", pronunciation_en: "Irregular 'esco, esci, esce'", l1_note_vi: "Chia đều thành 'uscisco'", l1_note_en: "Saying regular 'uscisco'", correction_drill: "Luyện các dạng bất quy tắc" },
    { word: "restare", en: "to stay / remain", vi: "ở lại / vẫn", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Gần nghĩa 'rimanere'", pronunciation_en: "Similar to 'rimanere'", l1_note_vi: "Chỉ dịch là 'nghỉ'", l1_note_en: "Translating as only 'rest'", correction_drill: "resto qui" },
    { word: "tornare", en: "to return / come back", vi: "trở lại", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "'tornare a'", pronunciation_en: "'tornare a'", l1_note_vi: "Nhầm với 'ritornare'", l1_note_en: "Confusing with 'ritornare'", correction_drill: "torno a casa" },
    { word: "portare", en: "to bring / carry", vi: "mang / đưa", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Mang/đem", pronunciation_en: "Carry/bring", l1_note_vi: "Nhầm với danh từ 'porta' (cửa)", l1_note_en: "Confusing with door 'porta'", correction_drill: "porto i documenti" },
    { word: "comprare", en: "to buy", vi: "mua", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Động từ đều", pronunciation_en: "Regular verb", l1_note_vi: "Nhầm với 'prendere'", l1_note_en: "Confusing with 'prendere'", correction_drill: "compro il pane" },
    { word: "vendere", en: "to sell", vi: "bán", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Động từ đều", pronunciation_en: "Regular", l1_note_vi: "Sai trọng âm", l1_note_en: "Wrong stress", correction_drill: "vendo la macchina" },
    { word: "aspettare", en: "to wait", vi: "chờ", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "'tt' đôi", pronunciation_en: "Double-like 'tt'", l1_note_vi: "Nhầm 'chờ' với 'sperare' (hy vọng)", l1_note_en: "Translating 'wait' as 'sperare'", correction_drill: "aspetto il treno" },
    { word: "aiutare", en: "to help", vi: "giúp", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "'aiutare a' + nguyên thể", pronunciation_en: "'aiutare a'", l1_note_vi: "Thiếu 'a' trước nguyên thể", l1_note_en: "Missing 'a' before the infinitive", correction_drill: "mi aiuta a capire" },
    { word: "provare", en: "to try / feel", vi: "thử / cảm thấy", pos: "verb", band: "21 · High-value verbs 3", pronunciation_vi: "Ngữ cảnh quyết định nghĩa", pronunciation_en: "Context decides", l1_note_vi: "Chỉ dịch là 'thử'", l1_note_en: "Translating only as 'try'", correction_drill: "provo a parlare; provo dolore" },

    // ── Band 22 — High-Value Verbs 4 ──
    { word: "pensare", en: "to think", vi: "nghĩ", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'pensare a/di/che' tùy cấu trúc", pronunciation_en: "'pensare a/di/che' depends on structure", l1_note_vi: "Dùng một giới từ cho tất cả", l1_note_en: "One preposition for all", correction_drill: "penso a te; penso che..." },
    { word: "credere", en: "to believe / think", vi: "tin / nghĩ", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'credere a' (người), 'credere che' (mệnh đề)", pronunciation_en: "'credere a' person, 'credere che' clause", l1_note_vi: "Sai giới từ", l1_note_en: "Wrong preposition", correction_drill: "credo a Marco; credo che sia vero" },
    { word: "ricordare", en: "to remember", vi: "nhớ", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'ricordare' hoặc 'ricordarsi di'", pronunciation_en: "'ricordare' or 'ricordarsi di'", l1_note_vi: "Lẫn lộn hai dạng", l1_note_en: "Mixing the forms", correction_drill: "ricordo il nome; mi ricordo di te" },
    { word: "dimenticare", en: "to forget", vi: "quên", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'dimenticare' hoặc 'dimenticarsi di'", pronunciation_en: "'dimenticare' or 'dimenticarsi di'", l1_note_vi: "Thiếu phản thân/giới từ", l1_note_en: "Missing the reflexive/preposition", correction_drill: "ho dimenticato le chiavi" },
    { word: "imparare", en: "to learn", vi: "học được", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "Sự tiếp thu", pronunciation_en: "Acquisition", l1_note_vi: "Dùng 'studiare' cho mọi việc học", l1_note_en: "Using 'studiare' for all learning", correction_drill: "imparo parole nuove" },
    { word: "studiare", en: "to study", vi: "học / nghiên cứu", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "Hoạt động học", pronunciation_en: "The activity", l1_note_vi: "Nhầm với 'imparare'", l1_note_en: "Confusing with 'imparare'", correction_drill: "studio italiano" },
    { word: "lavorare", en: "to work", vi: "làm việc", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'lavorare in/a/per/con'", pronunciation_en: "'lavorare in/a/per/con'", l1_note_vi: "Sai giới từ", l1_note_en: "Wrong preposition", correction_drill: "lavoro in ufficio; lavoro per..." },
    { word: "vivere", en: "to live", vi: "sống", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'vivo a Roma', 'vivo in Italia'", pronunciation_en: "'vivo a Roma', 'vivo in Italia'", l1_note_vi: "Sai giới từ thành phố/quốc gia", l1_note_en: "Wrong city/country preposition", correction_drill: "Luyện thành phố và quốc gia" },
    { word: "abitare", en: "to live / reside", vi: "sống / cư trú", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "Thiên về địa chỉ/nơi ở", pronunciation_en: "More about address/residence", l1_note_vi: "Chỉ dùng 'vivere'", l1_note_en: "Using only 'vivere'", correction_drill: "abito in via Roma" },
    { word: "succedere", en: "to happen", vi: "xảy ra", pos: "verb", band: "22 · High-value verbs 4", pronunciation_vi: "'che cosa è successo?'", pronunciation_en: "'che cosa è successo?'", l1_note_vi: "Dịch nhầm là 'thành công'", l1_note_en: "Translating as 'success'", correction_drill: "cosa succede?" },

    // ── Band 23 — Work Actions ──
    { word: "iniziare", en: "to begin / start", vi: "bắt đầu", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'iniziare a'", pronunciation_en: "'iniziare a'", l1_note_vi: "Thiếu 'a'", l1_note_en: "Missing 'a'", correction_drill: "inizio a lavorare" },
    { word: "finire", en: "to finish", vi: "hoàn thành / kết thúc", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'finire di' + nguyên thể", pronunciation_en: "'finire di' + infinitive", l1_note_vi: "Thiếu 'di'", l1_note_en: "Missing 'di'", correction_drill: "finisco di scrivere" },
    { word: "continuare", en: "to continue", vi: "tiếp tục", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'continuare a'", pronunciation_en: "'continuare a'", l1_note_vi: "Thiếu 'a'", l1_note_en: "Missing 'a'", correction_drill: "continuo a studiare" },
    { word: "preparare", en: "to prepare", vi: "chuẩn bị", pos: "verb", band: "23 · Work actions", pronunciation_vi: "Động từ đều", pronunciation_en: "Regular", l1_note_vi: "Lạm dụng 'fare pronto'", l1_note_en: "Overusing 'fare pronto'", correction_drill: "preparo il documento" },
    { word: "controllare", en: "to check / control", vi: "kiểm tra", pos: "verb", band: "23 · Work actions", pronunciation_vi: "Cũng nghĩa 'điều khiển'", pronunciation_en: "Also means control", l1_note_vi: "Chỉ dịch là 'điều khiển'", l1_note_en: "Translating only as 'control'", correction_drill: "controllo i dati" },
    { word: "organizzare", en: "to organize", vi: "tổ chức / sắp xếp", pos: "verb", band: "23 · Work actions", pronunciation_vi: "Âm 'zz'", pronunciation_en: "'zz' sound", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "organizzo il lavoro" },
    { word: "cambiare", en: "to change", vi: "thay đổi", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'cambio'", pronunciation_en: "'cambio'", l1_note_vi: "Chỉ hiểu là 'đổi tiền'", l1_note_en: "Confusing with exchange only", correction_drill: "cambio turno" },
    { word: "risolvere", en: "to solve", vi: "giải quyết", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'risolvo'", pronunciation_en: "'risolvo'", l1_note_vi: "Dịch nhầm là 'hòa tan'", l1_note_en: "Translating as 'dissolve'", correction_drill: "risolvo il problema" },
    { word: "scegliere", en: "to choose", vi: "chọn", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'scelgo'; 'sce' = she", pronunciation_en: "'scelgo'; 'sce' = she", l1_note_vi: "Đọc 'sk' cứng", l1_note_en: "Hard 'sk'", correction_drill: "scelgo questa opzione" },
    { word: "decidere", en: "to decide", vi: "quyết định", pos: "verb", band: "23 · Work actions", pronunciation_vi: "'decido'", pronunciation_en: "'decido'", l1_note_vi: "Lạm dụng 'scegliere'", l1_note_en: "Overusing 'scegliere'", correction_drill: "decido domani" },

    // ── Band 24 — Government and Immigration ──
    { word: "comune", en: "town hall / municipality", vi: "ủy ban / thành phố", pos: "noun (m)", band: "24 · Government & immigration", pronunciation_vi: "Văn phòng hành chính địa phương", pronunciation_en: "Local municipal office", l1_note_vi: "Chỉ dịch là 'chung/phổ biến'", l1_note_en: "Translating only as 'common'", correction_drill: "vado al comune" },
    { word: "questura", en: "police / immigration HQ", vi: "sở cảnh sát / di trú", pos: "noun (f)", band: "24 · Government & immigration", pronunciation_vi: "Cơ quan cảnh sát/di trú", pronunciation_en: "Immigration/police office", l1_note_vi: "Không nhận ra cơ quan quan trọng", l1_note_en: "Not recognizing this key institution", correction_drill: "appuntamento in questura" },
    { word: "residenza", en: "residence", vi: "cư trú", pos: "noun (f)", band: "24 · Government & immigration", pronunciation_vi: "Âm 'z'", pronunciation_en: "'z' sound", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "cambio di residenza" },
    { word: "permesso", en: "permit", vi: "giấy phép", pos: "noun (m)", band: "24 · Government & immigration", pronunciation_vi: "Cụm 'permesso di soggiorno'", pronunciation_en: "'permesso di soggiorno'", l1_note_vi: "Quá chung khi thiếu cụm", l1_note_en: "Too generic without the phrase", correction_drill: "Học cả cụm đầy đủ" },
    { word: "soggiorno", en: "stay / living room", vi: "lưu trú", pos: "noun (m)", band: "24 · Government & immigration", pronunciation_vi: "'gg' mềm", pronunciation_en: "'gg' soft", l1_note_vi: "Đọc g cứng", l1_note_en: "Hard g", correction_drill: "permesso di soggiorno" },
    { word: "codice fiscale", en: "tax code", vi: "mã số thuế", pos: "noun phrase (m)", band: "24 · Government & immigration", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Dịch từng chữ một", l1_note_en: "Translating word-by-word", correction_drill: "Nói cả cụm" },
    { word: "tessera sanitaria", en: "health card", vi: "thẻ y tế", pos: "noun phrase (f)", band: "24 · Government & immigration", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Quên hòa hợp tính từ", l1_note_en: "Forgetting adjective agreement", correction_drill: "la tessera sanitaria" },
    { word: "richiesta", en: "request / application", vi: "yêu cầu / đơn", pos: "noun (f)", band: "24 · Government & immigration", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với 'domanda'", l1_note_en: "Confusing with 'domanda'", correction_drill: "fare una richiesta" },
    { word: "certificato", en: "certificate", vi: "giấy chứng nhận", pos: "noun (m)", band: "24 · Government & immigration", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Nuốt nguyên âm cuối", l1_note_en: "Dropping the final vowel", correction_drill: "un certificato" },
    { word: "scadenza", en: "deadline / expiry", vi: "hạn chót / ngày hết hạn", pos: "noun (f)", band: "24 · Government & immigration", pronunciation_vi: "'sc' = sh trước e; có 'z'", pronunciation_en: "'sc' = sh before e; 'z'", l1_note_vi: "Đọc 'sk' cứng", l1_note_en: "Hard 'sk'", correction_drill: "la scadenza è domani" },

    // ── Band 25 — Healthcare ──
    { word: "medico", en: "doctor", vi: "bác sĩ", pos: "noun (m/f)", band: "25 · Healthcare", pronunciation_vi: "Giống cái có thể là 'medica'", pronunciation_en: "Feminine can be 'medica'", l1_note_vi: "Sai mạo từ/giống theo ngữ cảnh", l1_note_en: "Article/gender by context", correction_drill: "il medico; la medica" },
    { word: "farmacia", en: "pharmacy", vi: "hiệu thuốc", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "Giống cái; nhấn 'ci'", pronunciation_en: "Feminine; stress 'ci'", l1_note_vi: "Sai trọng âm", l1_note_en: "Wrong stress", correction_drill: "in farmacia" },
    { word: "ricetta", en: "prescription / recipe", vi: "đơn thuốc / công thức", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "'tt' đôi", pronunciation_en: "Double 'tt'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "la ricetta medica" },
    { word: "medicina", en: "medicine", vi: "thuốc / y học", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Nhầm với 'bác sĩ'", l1_note_en: "Confusing with doctor", correction_drill: "prendo la medicina" },
    { word: "visita", en: "visit / examination", vi: "buổi khám / buổi thăm", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "Giống cái", pronunciation_en: "Feminine", l1_note_vi: "Chỉ dịch là 'thăm'", l1_note_en: "Translating only as visit", correction_drill: "una visita medica" },
    { word: "febbre", en: "fever", vi: "sốt", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "'bb' đôi", pronunciation_en: "Double 'bb'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "ho la febbre" },
    { word: "tosse", en: "cough", vi: "ho", pos: "noun (f)", band: "25 · Healthcare", pronunciation_vi: "'ss' đôi", pronunciation_en: "Double 'ss'", l1_note_vi: "Quá ngắn", l1_note_en: "Too short", correction_drill: "ho la tosse" },
    { word: "sangue", en: "blood", vi: "máu", pos: "noun (m)", band: "25 · Healthcare", pronunciation_vi: "'gue' đọc cứng", pronunciation_en: "'gue' hard", l1_note_vi: "Lúng túng phát âm", l1_note_en: "Pronunciation uncertainty", correction_drill: "esame del sangue" },
    { word: "urgente", en: "urgent", vi: "khẩn cấp", pos: "adjective", band: "25 · Healthcare", pronunciation_vi: "'gente' = âm j", pronunciation_en: "'gente' = j sound", l1_note_vi: "Đọc g cứng", l1_note_en: "Hard g", correction_drill: "è urgente" },
    { word: "pronto soccorso", en: "emergency room", vi: "cấp cứu", pos: "noun phrase (m)", band: "25 · Healthcare", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Dịch từng chữ một", l1_note_en: "Translating word by word", correction_drill: "Học cả cụm" },

    // ── Band 26 — Collocation Bank 1 ──
    { word: "fare una domanda", en: "to ask a question", vi: "đặt câu hỏi", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Tiếng Ý dùng 'fare'", pronunciation_en: "Italian uses 'fare'", l1_note_vi: "Chỉ dịch trực tiếp 'hỏi'", l1_note_en: "Translating as direct 'ask' only", correction_drill: "Lặp lại nguyên cụm" },
    { word: "prendere una decisione", en: "to make a decision", vi: "đưa ra quyết định", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "'prendere' + danh từ", pronunciation_en: "'prendere' + noun", l1_note_vi: "Nói 'fare decisione'", l1_note_en: "Saying 'fare decisione'", correction_drill: "Dùng nguyên cụm" },
    { word: "avere ragione", en: "to be right", vi: "đúng / có lý", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Nghĩa đen 'có lý do'", pronunciation_en: "Literally 'have reason'", l1_note_vi: "Nói 'essere ragione'", l1_note_en: "Saying 'essere ragione'", correction_drill: "Hai ragione" },
    { word: "avere torto", en: "to be wrong", vi: "sai / không có lý", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Trái nghĩa 'ragione'", pronunciation_en: "Opposite of 'ragione'", l1_note_vi: "Dịch theo nghĩa đen", l1_note_en: "Translating literally", correction_drill: "Ho torto" },
    { word: "dare una mano", en: "to lend a hand", vi: "giúp một tay", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Thành ngữ", pronunciation_en: "Idiom", l1_note_vi: "Dịch từng chữ một", l1_note_en: "Translating word-by-word only", correction_drill: "Mi dai una mano?" },
    { word: "fare attenzione", en: "to pay attention", vi: "chú ý", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "'fare' + danh từ", pronunciation_en: "'fare' + noun", l1_note_vi: "Nói 'dare attenzione'", l1_note_en: "Saying 'dare attenzione'", correction_drill: "Fai attenzione" },
    { word: "perdere tempo", en: "to waste time", vi: "mất thời gian", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "'perdere' = mất", pronunciation_en: "'perdere' = lose", l1_note_vi: "Dùng 'mancare tempo'", l1_note_en: "Using 'mancare tempo'", correction_drill: "Non voglio perdere tempo" },
    { word: "risparmiare tempo", en: "to save time", vi: "tiết kiệm thời gian", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "'risparmiare'", pronunciation_en: "'risparmiare'", l1_note_vi: "Chỉ hiểu là tiết kiệm tiền", l1_note_en: "Translating as save money only", correction_drill: "risparmio tempo" },
    { word: "tenere conto di", en: "to take into account", vi: "tính đến / xem xét", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Cụm trang trọng", pronunciation_en: "Formal phrase", l1_note_vi: "Thiếu 'di'", l1_note_en: "Missing 'di'", correction_drill: "Tieni conto di questo" },
    { word: "rendersi conto di", en: "to realize", vi: "nhận ra", pos: "collocation", band: "26 · Collocation bank 1", pronunciation_vi: "Cụm phản thân", pronunciation_en: "Reflexive phrase", l1_note_vi: "Lạm dụng 'realizzare'", l1_note_en: "Overusing 'realizzare'", correction_drill: "Mi rendo conto del problema" },

    // ── Band 27 — Collocation Bank 2 ──
    { word: "andare d'accordo", en: "to get along", vi: "hòa thuận", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Nói 'andare accordo'", l1_note_en: "Saying 'andare accordo'", correction_drill: "Vado d'accordo con lei" },
    { word: "essere in ritardo", en: "to be late", vi: "bị trễ", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "'in ritardo'", pronunciation_en: "'in ritardo'", l1_note_vi: "Nói 'sono tardi'", l1_note_en: "Saying 'sono tardi'", correction_drill: "Sono in ritardo" },
    { word: "essere puntuale", en: "to be on time", vi: "đúng giờ", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Tính từ", pronunciation_en: "Adjective", l1_note_vi: "Luôn nói 'sono in tempo'", l1_note_en: "Always saying 'sono in tempo'", correction_drill: "Sono puntuale" },
    { word: "mettere in ordine", en: "to tidy up", vi: "sắp xếp ngăn nắp", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Dịch quá sát nghĩa đen", l1_note_en: "Translating too literally", correction_drill: "metto in ordine la stanza" },
    { word: "avere fretta", en: "to be in a hurry", vi: "vội", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Tiếng Ý dùng 'avere'", pronunciation_en: "Italian uses 'avere'", l1_note_vi: "Nói 'sono fretta'", l1_note_en: "Saying 'sono fretta'", correction_drill: "Ho fretta" },
    { word: "fare la fila", en: "to queue", vi: "xếp hàng", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "'fila' = hàng/dãy", pronunciation_en: "'fila' = line/queue", l1_note_vi: "Dịch bằng 'linea'", l1_note_en: "Translating with 'linea'", correction_drill: "faccio la fila" },
    { word: "prendere appuntamento", en: "to make an appointment", vi: "đặt lịch hẹn", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "'prendere' + lịch hẹn", pronunciation_en: "'prendere' + appointment", l1_note_vi: "Nói 'fare appuntamento'", l1_note_en: "Saying 'fare appuntamento'", correction_drill: "prendo appuntamento" },
    { word: "cambiare idea", en: "to change one's mind", vi: "đổi ý", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "'idea' giống cái", pronunciation_en: "'idea' feminine", l1_note_vi: "Nói 'cambiare mente'", l1_note_en: "Saying 'cambiare mente'", correction_drill: "Ho cambiato idea" },
    { word: "essere d'accordo", en: "to agree", vi: "đồng ý", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Bỏ 'd''", l1_note_en: "Dropping the 'd''", correction_drill: "Sono d'accordo" },
    { word: "fare in tempo", en: "to make it in time", vi: "kịp giờ", pos: "collocation", band: "27 · Collocation bank 2", pronunciation_vi: "Cụm cố định", pronunciation_en: "Fixed phrase", l1_note_vi: "Nhầm với thời tiết/thời gian", l1_note_en: "Confusing with weather time", correction_drill: "Faccio in tempo?" },

    // ── Band 28 — Abstract C1 Words ──
    { word: "situazione", en: "situation", vi: "tình hình", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Âm 'zione'", pronunciation_en: "'zione' sound", l1_note_vi: "Đọc 'sh' kiểu Anh", l1_note_en: "English 'sh'", correction_drill: "la situazione è chiara" },
    { word: "problema", en: "problem", vi: "vấn đề", pos: "noun (m)", band: "28 · Abstract C1 words", pronunciation_vi: "Giống đực dù tận cùng 'a'", pronunciation_en: "Masculine despite 'a'", l1_note_vi: "Nói 'la problema'", l1_note_en: "Saying 'la problema'", correction_drill: "il problema" },
    { word: "soluzione", en: "solution", vi: "giải pháp", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Âm 'zione'", pronunciation_en: "'zione' sound", l1_note_vi: "Đuôi yếu", l1_note_en: "Weak ending", correction_drill: "una soluzione semplice" },
    { word: "motivo", en: "reason / motive", vi: "lý do", pos: "noun (m)", band: "28 · Abstract C1 words", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Chỉ hiểu là 'động lực'", l1_note_en: "Confusing with motivation only", correction_drill: "per questo motivo" },
    { word: "risultato", en: "result", vi: "kết quả", pos: "noun (m)", band: "28 · Abstract C1 words", pronunciation_vi: "Giống đực", pronunciation_en: "Masculine", l1_note_vi: "Sai trọng âm", l1_note_en: "Wrong stress", correction_drill: "un buon risultato" },
    { word: "possibilità", en: "possibility", vi: "khả năng", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Trọng âm cuối yếu", l1_note_en: "Weak final stress", correction_drill: "possibili-TÀ" },
    { word: "responsabilità", en: "responsibility", vi: "trách nhiệm", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Nhấn âm cuối", pronunciation_en: "Final stress", l1_note_vi: "Trọng âm cuối yếu", l1_note_en: "Weak final stress", correction_drill: "responsabili-TÀ" },
    { word: "differenza", en: "difference", vi: "sự khác biệt", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Âm 'z'", pronunciation_en: "'z' sound", l1_note_vi: "Âm z yếu", l1_note_en: "Weak z", correction_drill: "la differenza" },
    { word: "conseguenza", en: "consequence", vi: "hậu quả", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Liên từ trang trọng", pronunciation_en: "Formal connector word", l1_note_vi: "Không nhận ra trong bản tin", l1_note_en: "Not recognizing it in news", correction_drill: "di conseguenza" },
    { word: "esperienza", en: "experience", vi: "kinh nghiệm / trải nghiệm", pos: "noun (f)", band: "28 · Abstract C1 words", pronunciation_vi: "Không dùng 'x'; cụm 'sper'", pronunciation_en: "No 'x'; 'sper' cluster", l1_note_vi: "Phát âm kiểu Anh", l1_note_en: "English-like pronunciation", correction_drill: "esperienza lavorativa" },

    // ── Band 29 — Frequency Review Lists ──
    // Compact review rows: each `word` is a 10-item set to drill as a block.
    { word: "allora, adesso, qui, lì, sopra, sotto, dentro, fuori, vicino, lontano", en: "then, now, here, there, above, below, inside, outside, near, far", vi: "vậy thì, bây giờ, đây, đó, trên, dưới, trong, ngoài, gần, xa", pos: "adverbs (place/time)", band: "29 · Frequency review lists", pronunciation_vi: "Trạng từ nơi chốn/thời gian", pronunciation_en: "Place/time adverbs", l1_note_vi: "Nhầm 'lì' và 'là'", l1_note_en: "Confusing 'lì' and 'là'", correction_drill: "Đặt 10 câu chỉ vị trí" },
    { word: "tutto, niente, qualcosa, qualcuno, nessuno, ogni, altro, stesso, tale, quale", en: "everything, nothing, something, someone, no one, every, other, same, such, which", vi: "tất cả, không gì, cái gì đó, ai đó, không ai, mỗi, khác, cùng, như vậy, nào", pos: "indefinites", band: "29 · Frequency review lists", pronunciation_vi: "Đại từ/định từ bất định", pronunciation_en: "Indefinites", l1_note_vi: "Thiếu hòa hợp cho 'altro/stesso'", l1_note_en: "Missing agreement for 'altro/stesso'", correction_drill: "Ghép với danh từ" },
    { word: "meglio, peggio, bene, male, forse, davvero, almeno, soltanto, comunque, quasi", en: "better, worse, well, badly, maybe, really, at least, only, anyway, almost", vi: "tốt hơn, tệ hơn, tốt, xấu, có lẽ, thật sự, ít nhất, chỉ, dù sao, gần như", pos: "adverbs", band: "29 · Frequency review lists", pronunciation_vi: "Trạng từ", pronunciation_en: "Adverbs", l1_note_vi: "Đặt trạng từ vụng về", l1_note_en: "Placing adverbs awkwardly", correction_drill: "Thêm vào câu đã biết" },
    { word: "rosso, bianco, nero, verde, blu, giallo, grigio, chiaro, scuro, colorato", en: "red, white, black, green, blue, yellow, grey, light, dark, colourful", vi: "đỏ, trắng, đen, xanh lá, xanh dương, vàng, xám, sáng, tối, nhiều màu", pos: "adjectives (colours)", band: "29 · Frequency review lists", pronunciation_vi: "Màu sắc/tính từ", pronunciation_en: "Colours/adjectives", l1_note_vi: "Quên hòa hợp", l1_note_en: "Forgetting agreement", correction_drill: "una macchina rossa; un vestito nero" },
    { word: "caldo, freddo, pulito, sporco, pieno, vuoto, normale, strano, utile, necessario", en: "hot, cold, clean, dirty, full, empty, normal, strange, useful, necessary", vi: "nóng, lạnh, sạch, bẩn, đầy, trống, bình thường, lạ, hữu ích, cần thiết", pos: "adjectives", band: "29 · Frequency review lists", pronunciation_vi: "Tính từ thực dụng", pronunciation_en: "Practical adjectives", l1_note_vi: "Nói 'sono caldo' cho thời tiết/cơ thể", l1_note_en: "Saying 'sono caldo' for weather/body", correction_drill: "fa caldo; ho caldo" },

    // ── Band 30 — 300 Anchor Expansion Checklist ──
    // Method rows: each `word` is a study pattern that expands every anchor word
    // into ~10 usable items, reaching the ~3000-item target.
    { word: "articolo + nome", en: "article + noun", vi: "mạo từ + danh từ", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Mọi danh từ cần mạo từ và số nhiều", pronunciation_en: "Every noun gets article and plural", l1_note_vi: "Học danh từ mà không học giống", l1_note_en: "Learning nouns without gender", correction_drill: "Mỗi danh từ: il/la, số nhiều, một tính từ" },
    { word: "verbo + preposizione", en: "verb + preposition", vi: "động từ + giới từ", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Nhiều động từ cần giới từ cố định", pronunciation_en: "Many verbs require fixed prepositions", l1_note_vi: "Dịch thẳng từ tiếng Việt", l1_note_en: "Translating Vietnamese directly", correction_drill: "Mỗi động từ: một cụm giới từ" },
    { word: "aggettivo + accordo", en: "adjective + agreement", vi: "tính từ + hòa hợp", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Đổi theo giống/số", pronunciation_en: "Gender/number changes", l1_note_vi: "Một dạng tính từ cho mọi danh từ", l1_note_en: "One adjective form for all nouns", correction_drill: "Tạo dạng đực/cái/số ít/số nhiều" },
    { word: "parola + collocazione", en: "word + collocation", vi: "từ + cụm cố định", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Tiếng Ý tự nhiên dùng cụm", pronunciation_en: "Natural Italian uses chunks", l1_note_vi: "Học từ rời rạc", l1_note_en: "Isolated word memorization", correction_drill: "Học một cụm cho mỗi từ" },
    { word: "parola + contrario", en: "word + opposite", vi: "từ + trái nghĩa", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Xây mạng lưới trí nhớ", pronunciation_en: "Builds a memory network", l1_note_vi: "Không có trí nhớ tương phản", l1_note_en: "No contrast memory", correction_drill: "Ghép cặp trái nghĩa" },
    { word: "parola + famiglia", en: "word + word family", vi: "từ + họ từ", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Động từ/danh từ/tính từ/trạng từ", pronunciation_en: "Verb/noun/adjective/adverb", l1_note_vi: "Không nhận ra các dạng liên quan", l1_note_en: "Not recognizing related forms", correction_drill: "lavoro/lavorare/lavoratore" },
    { word: "parola + domanda", en: "word + question", vi: "từ + câu hỏi", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Kích hoạt kỹ năng nói", pronunciation_en: "Activates speaking", l1_note_vi: "Chỉ nhận diện thụ động", l1_note_en: "Passive recognition only", correction_drill: "Đặt một câu hỏi với mỗi từ" },
    { word: "parola + passato", en: "word + past tense", vi: "từ + quá khứ", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Nhận diện trong truyện/tin", pronunciation_en: "Recognition in stories/news", l1_note_vi: "Chỉ học thì hiện tại", l1_note_en: "Only present-tense study", correction_drill: "Đặt một câu quá khứ" },
    { word: "parola + ascolto", en: "word + listening", vi: "từ + nghe", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Nhận ra lời nói nhanh rút gọn", pronunciation_en: "Recognize reduced fast speech", l1_note_vi: "Từ vựng chỉ học qua đọc", l1_note_en: "Reading-only vocabulary", correction_drill: "Ghi âm và nhại theo câu" },
    { word: "parola + errore VN", en: "word + Vietnamese-speaker error", vi: "từ + lỗi người Việt", pos: "study method", band: "30 · 300 anchor expansion checklist", pronunciation_vi: "Sửa lỗi có thể dự đoán", pronunciation_en: "Fix predictable errors", l1_note_vi: "Lặp lại lỗi đã hằn sâu", l1_note_en: "Repeating fossilized mistakes", correction_drill: "Viết một chỉnh sửa cá nhân" },
  ],
};

export default lesson;
