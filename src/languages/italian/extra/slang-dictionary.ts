// src/languages/italian/extra/slang-dictionary.ts
//
// Italian slang & informal-speech dictionary for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/F7-italian-slang-dictionary.md.
//
// Helps Vietnamese learners RECOGNIZE common Italian slang, informal
// expressions, youth language, and casual speech. Core rule: understand
// slang before using it. Many expressions are friendly with peers but wrong
// with bosses, officials, teachers, landlords, doctors, and older strangers.
//
// Shape mirrors the sibling extra files (pronunciation-error-clinic.ts,
// 3000-word-frequency.ts): LessonSentence / VocabEntry / Exercise with a
// single `lesson` export. Types are inlined because
// src/languages/italian/lessons.ts does not exist yet — keep this file
// self-contained until the Italian registry lands.
//
// Vietnamese-first: every entry carries a `vi` gloss; `pronunciation_focus`
// and `l1_note_vi` hold the Vietnamese-speaker (L1) notes, with English
// companions (`pronunciation_focus_en`, `l1_note_en`) preserving the source.

export type LessonSentence = {
  // The informal Italian line the learner should recognize.
  en: string;
  // Vietnamese meaning.
  vi: string;
  // L1 = Vietnamese-speaker note (register / safer alternative / use warning).
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  // Slang or informal Italian term.
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-facing register / pronunciation note.
  pronunciation_vi: string;
  // English companion (the original source note).
  pronunciation_en?: string;
  // ── Slang-pack extras ──
  // The neutral / standard Italian equivalent.
  standard?: string;
  // L1 note: the predictable Vietnamese-speaker mistake, Vietnamese-first.
  l1_note_vi?: string;
  // English companion to the L1 note.
  l1_note_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (safety table, rewrite, answer key) vary.
export type Exercise = Record<string, any>;

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
  id: "italian_slang_dictionary",
  category: "expressions",
  level: "B1",
  title_vi: "Từ điển tiếng lóng và khẩu ngữ tiếng Ý",
  title_en: "Italian slang & informal-speech dictionary",

  sentences: [
    {
      en: "Boh, non ho capito.",
      vi: "Không biết nữa, tôi chưa hiểu.",
      pronunciation_focus: [
        "'Boh' = 'không biết' kiểu rất thân mật — chỉ dùng với bạn bè",
        "Lịch sự/an toàn hơn: 'Non ho capito bene.'",
      ],
      pronunciation_focus_en: [
        "'Boh' = a very casual 'I dunno' — friends only",
        "Safer standard form: 'Non ho capito bene.'",
      ],
    },
    {
      en: "Dai, andiamo!",
      vi: "Thôi nào, đi thôi!",
      pronunciation_focus: [
        "'Dai!' là lời giục/cổ vũ thân thiện, không trang trọng",
        "Trung tính hơn: 'Andiamo.'",
      ],
      pronunciation_focus_en: [
        "'Dai!' is a friendly nudge/encouragement — informal",
        "More neutral: 'Andiamo.'",
      ],
    },
    {
      en: "È stato un casino.",
      vi: "Đó là một mớ rắc rối.",
      pronunciation_focus: [
        "'un casino' = mớ hỗn độn; TRÁNH dùng trong văn cảnh trang trọng",
        "An toàn: 'È stato un problema complicato.'",
      ],
      pronunciation_focus_en: [
        "'un casino' = a mess; AVOID in formal contexts",
        "Safe: 'È stato un problema complicato.'",
      ],
    },
    {
      en: "Che figata questo posto!",
      vi: "Chỗ này đỉnh quá!",
      pronunciation_focus: [
        "'Che figata!' = 'đỉnh quá / hay quá' — rất thân mật",
        "Trang nhã hơn: 'Questo posto è molto bello.'",
      ],
      pronunciation_focus_en: [
        "'Che figata!' = 'how cool!' — very informal",
        "More polite: 'Questo posto è molto bello.'",
      ],
    },
    {
      en: "Ci becchiamo domani.",
      vi: "Mai gặp nhé.",
      pronunciation_focus: [
        "'beccare/ci becchiamo' = gặp nhau, kiểu suồng sã",
        "Chuẩn: 'Ci vediamo domani.'",
      ],
      pronunciation_focus_en: [
        "'beccare / ci becchiamo' = to meet up, casual",
        "Standard: 'Ci vediamo domani.'",
      ],
    },
    {
      en: "Tranquillo, ci penso io.",
      vi: "Yên tâm, tôi lo.",
      pronunciation_focus: [
        "'Tranquillo' (hay rút gọn 'tranqui') = yên tâm — thân mật",
        "Trang trọng: 'Non si preoccupi, me ne occupo io.'",
      ],
      pronunciation_focus_en: [
        "'Tranquillo' (often clipped to 'tranqui') = relax/no worries — informal",
        "Formal: 'Non si preoccupi, me ne occupo io.'",
      ],
    },
  ],

  cultural_notes_vi:
    "Quy tắc an toàn về văn cảnh — biết khi nào DÙNG được tiếng lóng:\n" +
    "• Bạn bè thân: được, nếu bạn hiểu rõ họ → tiếng Ý suồng sã thoải mái.\n" +
    "• Đồng nghiệp trẻ: đôi khi → dùng câu thân mật nhẹ.\n" +
    "• Sếp/quản lý: thường là KHÔNG → tiếng Ý lịch sự chuẩn.\n" +
    "• Cơ quan hành chính / cảnh sát / bác sĩ: KHÔNG → tiếng Ý trang trọng.\n" +
    "• Phỏng vấn xin việc: KHÔNG → tiếng Ý chuyên nghiệp.\n" +
    "• Tin nhắn: đôi khi → tùy mức độ thân thiết.\n" +
    "Viết tắt kiểu giới trẻ (cmq, nn, tvb, raga...) chỉ dùng với bạn bè. ĐỪNG nhắn 'nn' cho chủ nhà, nhà trường, công ty hay cơ quan công.",
  cultural_notes_en:
    "Context safety rule — knowing when slang is OK:\n" +
    "• Close friends: yes, if you know them well → casual Italian.\n" +
    "• Young coworkers: sometimes → light informal phrases.\n" +
    "• Manager: usually no → standard polite Italian.\n" +
    "• City hall / police / doctor: no → formal Italian.\n" +
    "• Job interview: no → professional Italian.\n" +
    "• Text messages: sometimes → depends on the relationship.\n" +
    "Youth text abbreviations (cmq, nn, tvb, raga...) are friends-only. Never write 'nn' to a landlord, school, employer, or public office.",
  tip_advice_vi:
    "Nguyên tắc số một: HIỂU tiếng lóng trước khi DÙNG. Nghe và nhận ra được nhiều hơn là dùng. Nhiều cụm thân thiện với bạn bè nhưng sai chỗ với sếp, cán bộ, thầy cô, chủ nhà, bác sĩ và người lớn tuổi lạ. Khi không chắc, chọn câu chuẩn — không ai chê bạn vì nói lịch sự, nhưng dùng lóng sai chỗ thì mất điểm ngay.",
  tip_advice_en:
    "Rule #1: UNDERSTAND slang before you USE it. Aim to recognize far more than you produce. Many expressions are friendly with peers but wrong with bosses, officials, teachers, landlords, doctors, and older strangers. When unsure, pick the standard line — nobody penalizes you for being polite, but slang in the wrong place costs you instantly.",

  vocabulary: [
    {
      word: "Boh",
      en: "I dunno / no idea",
      vi: "không biết",
      pos: "interjection",
      standard: "Non lo so",
      pronunciation_vi: "Rất thông dụng, suồng sã. Lạm dụng nghe thiếu quan tâm.",
      pronunciation_en: "Very common, informal. Overusing it sounds uninterested.",
      l1_note_vi: "Đừng lạm dụng 'boh' — nghe như bạn không quan tâm; thay bằng 'Non lo so ancora.'",
      l1_note_en: "Don't overuse 'boh' — it sounds uninterested; prefer 'Non lo so ancora.'",
    },
    {
      word: "Dai!",
      en: "Come on! / let's go!",
      vi: "thôi nào / cố lên",
      pos: "interjection",
      standard: "Andiamo / su",
      pronunciation_vi: "Thân thiện, dùng để giục hoặc cổ vũ.",
      pronunciation_en: "Friendly — used to urge or encourage.",
    },
    {
      word: "Che figata!",
      en: "How cool! / awesome!",
      vi: "hay quá / đỉnh quá",
      pos: "exclamation",
      standard: "Che bello!",
      pronunciation_vi: "Rất thân mật. Tránh với người lớn tuổi hoặc nơi trang trọng.",
      pronunciation_en: "Very informal. Avoid with elders or in formal settings.",
    },
    {
      word: "Un casino",
      en: "a mess / chaos",
      vi: "một mớ hỗn độn",
      pos: "noun (m)",
      standard: "Un grande disordine / problema",
      pronunciation_vi: "Tránh dùng trong văn cảnh trang trọng.",
      pronunciation_en: "Avoid formal use.",
      l1_note_vi: "Trong phỏng vấn đừng nói 'un casino' (thiếu chuyên nghiệp) → 'una situazione complessa.'",
      l1_note_en: "In an interview don't say 'un casino' (unprofessional) → 'una situazione complessa.'",
    },
    {
      word: "Tipo",
      en: "like / for example (filler)",
      vi: "kiểu như",
      pos: "filler",
      standard: "Come / per esempio",
      pronunciation_vi: "Từ đệm trong khẩu ngữ giới trẻ.",
      pronunciation_en: "Filler in youth speech.",
    },
    {
      word: "Magari",
      en: "maybe / I wish",
      vi: "có lẽ / ước gì",
      pos: "adverb",
      standard: "Forse / sarebbe bello",
      pronunciation_vi: "Thông dụng, không phải lúc nào cũng là lóng.",
      pronunciation_en: "Common — not always slang.",
    },
    {
      word: "Beccare",
      en: "to meet / catch / run into",
      vi: "gặp / bắt gặp",
      pos: "verb",
      standard: "Incontrare / trovare",
      pronunciation_vi: "Suồng sã.",
      pronunciation_en: "Informal.",
    },
    {
      word: "Fregarsene",
      en: "to not care",
      vi: "không quan tâm",
      pos: "verb (reflexive)",
      standard: "Non interessarsi",
      pronunciation_vi: "Có thể nghe thô lỗ — cẩn thận chỗ dùng.",
      pronunciation_en: "Can be rude — mind where you use it.",
    },
    {
      word: "Cavolo",
      en: "darn / shoot (mild)",
      vi: "trời ơi / chết thật",
      pos: "interjection",
      standard: "Accidenti",
      pronunciation_vi: "Nhẹ nhàng (uyển ngữ thay cho từ tục).",
      pronunciation_en: "Mild (a euphemism for a stronger word).",
    },
    {
      word: "Meno male",
      en: "thank goodness",
      vi: "may quá",
      pos: "expression",
      standard: "Per fortuna",
      pronunciation_vi: "An toàn và thông dụng.",
      pronunciation_en: "Safe and common.",
    },
    {
      word: "Figurati",
      en: "don't mention it / no problem",
      vi: "không có gì",
      pos: "expression",
      standard: "Prego / non c'è problema",
      pronunciation_vi: "Thân mật nhưng dễ chịu.",
      pronunciation_en: "Informal-friendly.",
    },
    {
      word: "Tranqui",
      en: "chill / no worries",
      vi: "yên tâm",
      pos: "adjective (clipped)",
      standard: "Tranquillo",
      pronunciation_vi: "Kiểu giới trẻ / nhắn tin (rút gọn của 'tranquillo').",
      pronunciation_en: "Youth/text style (clipped from 'tranquillo').",
    },
    // ── Youth / text abbreviations (chỉ dùng với bạn bè) ──
    {
      word: "cmq",
      en: "anyway",
      vi: "dù sao",
      pos: "text abbr.",
      standard: "comunque",
      pronunciation_vi: "Chỉ dùng khi nhắn tin với bạn.",
      pronunciation_en: "Texting with friends only.",
    },
    {
      word: "xché / perché",
      en: "why / because",
      vi: "tại sao / bởi vì",
      pos: "text abbr.",
      standard: "perché",
      pronunciation_vi: "'x' thay cho 'per' trong nhắn tin.",
      pronunciation_en: "'x' stands in for 'per' in texting.",
    },
    {
      word: "qnd",
      en: "when",
      vi: "khi nào",
      pos: "text abbr.",
      standard: "quando",
      pronunciation_vi: "Viết tắt nhắn tin.",
      pronunciation_en: "Texting shorthand.",
    },
    {
      word: "nn",
      en: "not",
      vi: "không",
      pos: "text abbr.",
      standard: "non",
      pronunciation_vi: "Viết tắt nhắn tin.",
      pronunciation_en: "Texting shorthand.",
      l1_note_vi: "ĐỪNG viết 'nn posso' cho chủ nhà (nghe cẩu thả) → 'Purtroppo non posso.'",
      l1_note_en: "Don't write 'nn posso' to a landlord (looks careless) → 'Purtroppo non posso.'",
    },
    {
      word: "tvb",
      en: "I care about you / love ya",
      vi: "thương bạn / quý bạn",
      pos: "text abbr.",
      standard: "ti voglio bene",
      pronunciation_vi: "Tình cảm, chỉ với người thân/bạn thân.",
      pronunciation_en: "Affectionate — close friends/family only.",
    },
    {
      word: "raga",
      en: "guys / folks",
      vi: "các bạn",
      pos: "text abbr.",
      standard: "ragazzi",
      pronunciation_vi: "Gọi nhóm bạn, thân mật.",
      pronunciation_en: "Addressing a group of friends, casual.",
    },
    {
      word: "ok, ci sta",
      en: "okay / that makes sense",
      vi: "được / hợp lý",
      pos: "expression",
      standard: "va bene / ha senso",
      pronunciation_vi: "Khẩu ngữ tán đồng.",
      pronunciation_en: "Casual agreement.",
    },
  ],

  dialogue: [
    // Bối cảnh thân mật (bạn bè) — tiếng lóng được chấp nhận.
    {
      speaker: "Friend",
      text: "Vieni stasera?",
      vi: "Tối nay bạn đến không?",
    },
    {
      speaker: "Learner",
      text: "Boh, forse arrivo tardi dal lavoro.",
      vi: "Không biết nữa, có lẽ tôi đi làm về muộn.",
    },
    {
      speaker: "Friend",
      text: "Dai, vieni anche solo per un'ora.",
      vi: "Thôi mà, đến một tiếng thôi cũng được.",
    },
    {
      speaker: "Learner",
      text: "Va bene, ci becchiamo alle nove.",
      vi: "Được, gặp nhau lúc 9 giờ.",
    },
  ],

  exercises: [
    {
      type: "formal_context_dialogue",
      instruction_vi:
        "Cùng nội dung, nhưng bối cảnh TRANG TRỌNG (với sếp) — chú ý không dùng lóng:",
      instruction_en:
        "Same content, but a FORMAL context (with an employer) — note the absence of slang:",
      items: [
        {
          speaker: "Employer",
          prompt: "Può venire stasera?",
          vi: "Tối nay anh/chị đến được không?",
        },
        {
          speaker: "Learner",
          prompt: "Non lo so ancora, devo controllare il turno.",
          vi: "Tôi chưa biết, tôi cần kiểm tra ca làm.",
        },
        {
          speaker: "Employer",
          prompt: "Mi aggiorni appena possibile.",
          vi: "Cập nhật cho tôi sớm nhất có thể.",
        },
        {
          speaker: "Learner",
          prompt: "Certamente, le scrivo entro le cinque.",
          vi: "Chắc chắn, tôi viết cho ông/bà trước 5 giờ.",
        },
      ],
    },
    {
      type: "vietnamese_speaker_mistakes",
      instruction_vi:
        "Lỗi người Việt hay mắc → vì sao rủi ro → cách nói tốt hơn:",
      instruction_en:
        "Common Vietnamese-speaker mistakes → why it's risky → a better choice:",
      items: [
        {
          prompt: "Dùng 'ciao capo' với quản lý.",
          why_vi: "Quá suồng sã hoặc nghe như đùa cợt.",
          why_en: "Too casual or joking.",
          better: "Buongiorno, posso chiederle una cosa?",
        },
        {
          prompt: "Nói 'un casino' trong phỏng vấn.",
          why_vi: "Thiếu chuyên nghiệp.",
          why_en: "Unprofessional.",
          better: "Una situazione complessa.",
        },
        {
          prompt: "Nhắn 'nn posso' cho chủ nhà.",
          why_vi: "Nghe cẩu thả.",
          why_en: "Looks careless.",
          better: "Purtroppo non posso.",
        },
        {
          prompt: "Bắt chước tiếng lóng vùng miền.",
          why_vi: "Có thể nghe giả tạo hoặc thô lỗ.",
          why_en: "May sound fake or rude.",
          better: "Dùng tiếng Ý chuẩn. (Use standard Italian.)",
        },
        {
          prompt: "Lạm dụng 'boh'.",
          why_vi: "Nghe như không quan tâm.",
          why_en: "Sounds uninterested.",
          better: "Non lo so ancora.",
        },
      ],
    },
    {
      type: "classify_register",
      instruction_vi:
        "Đánh dấu mỗi câu là 'informal' (suồng sã) hay 'formal-safe' (an toàn trang trọng):",
      instruction_en:
        "Mark each phrase as 'informal' or 'formal-safe':",
      items: [
        { prompt: "Boh, non lo so.", answer: "informal" },
        { prompt: "Non lo so ancora.", answer: "formal-safe" },
        { prompt: "Che figata!", answer: "informal" },
        { prompt: "Questo posto è molto bello.", answer: "formal-safe" },
        { prompt: "Ci becchiamo domani.", answer: "informal" },
        { prompt: "Ci vediamo domani.", answer: "formal-safe" },
      ],
    },
    {
      type: "rewrite_standard",
      instruction_vi:
        "Viết lại bằng tiếng Ý chuẩn (trang trọng / trung tính):",
      instruction_en:
        "Rewrite in standard (formal / neutral) Italian:",
      items: [
        {
          prompt: "È stato un casino.",
          answer: "È stata una situazione complicata.",
        },
        {
          prompt: "Tranqui, ci penso io.",
          answer: "Non si preoccupi, me ne occupo io.",
        },
        {
          prompt: "Dai, mandami 'sta cosa.",
          answer: "Può mandarmi questa cosa, per favore?",
        },
        {
          prompt: "Boh, chiedi a lui.",
          answer: "Non lo so, può chiedere a lui.",
        },
        {
          prompt: "Raga, arriviamo tardi.",
          answer: "Ragazzi, arriviamo tardi.",
        },
      ],
    },
  ],
};

export default lesson;
