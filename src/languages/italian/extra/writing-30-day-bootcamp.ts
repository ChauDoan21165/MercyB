// src/languages/italian/extra/writing-30-day-bootcamp.ts
//
// Italian writing 30-day bootcamp for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/I1-italian-writing-30-day-bootcamp.md.
//
// A 30-day writing plan: SMS, forms, work messages, formal emails, complaints,
// and short essays/opinions. The model texts that carry real Italian writing
// become `sentences`; the Core Writing Formula and form fields become
// `vocabulary`; the 5-step daily method becomes `dialogue`; the practice
// prompts, answer key, Vietnamese-speaker grammar notes, and rubric become
// `exercises`.
//
// Shape mirrors the sibling audio-shadowing-30-day-bootcamp.ts (LessonSentence /
// VocabEntry / Exercise) so the page UI stays consistent across verticals. Types
// are inlined because src/languages/italian/lessons.ts does not exist yet — keep
// this file self-contained until the Italian registry lands.
//
// Vietnamese-first: every line carries a `vi` gloss. Because this is a WRITING
// pack, `pronunciation_focus` holds the Vietnamese-speaker (L1) WRITING note —
// the grammar/structure mistakes a Vietnamese speaker makes — and
// `pronunciation_focus_en` is its English-speaker companion (same length + order).

export type LessonSentence = {
  // The Italian model text (this is the line the learner copies and adapts).
  en: string;
  vi: string;
  // L1 = Vietnamese-speaker writing/grammar notes for this model.
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker usage hint.
  pronunciation_vi: string;
  // English-speaker usage hint.
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (practice, grammar-fix, rubric) can vary.
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
  id: "italian_writing_30_day_bootcamp",
  category: "writing",
  level: "A2",
  title_vi: "Bootcamp viết tiếng Ý 30 ngày",
  title_en: "Italian writing 30-day bootcamp",

  sentences: [
    // ── Days 1–5: SMS (short messages) ──────────────────────────────────
    {
      en: "Arrivo con dieci minuti di ritardo.",
      vi: "Tôi đến trễ 10 phút.",
      pronunciation_focus: [
        "'con ... di ritardo' = 'trễ ...': nhớ giới từ 'di' trước 'ritardo'",
        "Dùng thì hiện tại 'Arrivo' cho việc sắp xảy ra — tiếng Ý không cần thì tương lai ở đây",
      ],
      pronunciation_focus_en: [
        "'con ... di ritardo' = 'late by ...': keep the preposition 'di' before 'ritardo'",
        "Present tense 'Arrivo' covers the near future — no future tense needed here",
      ],
    },
    {
      en: "Oggi non posso venire perché sto male.",
      vi: "Hôm nay tôi không đến được vì bệnh.",
      pronunciation_focus: [
        "'perché' (vì) phải có dấu — nó nối lý do, khác với câu hỏi 'perché?' (tại sao?)",
        "'sto male' (tôi thấy không khỏe) dùng động từ 'stare', KHÔNG dùng 'sono male'",
      ],
      pronunciation_focus_en: [
        "'perché' (because) carries an accent — it links a reason, distinct from the question 'perché?' (why?)",
        "'sto male' (I feel unwell) uses 'stare', never 'sono male'",
      ],
    },
    {
      en: "Può mandarmi l'indirizzo?",
      vi: "Gửi địa chỉ cho tôi được không?",
      pronunciation_focus: [
        "'Può' (lịch sự, ngôi Lei) thay cho 'Puoi' khi viết cho người lạ/cấp trên",
        "Đại từ 'mi' gắn vào cuối động từ nguyên thể: mandar + mi = 'mandarmi'",
      ],
      pronunciation_focus_en: [
        "'Può' (polite, Lei form) replaces 'Puoi' when writing to a stranger/superior",
        "The pronoun 'mi' attaches to the end of the infinitive: mandar + mi = 'mandarmi'",
      ],
    },
    {
      en: "Ho ricevuto il messaggio, grazie.",
      vi: "Tôi đã nhận tin nhắn, cảm ơn.",
      pronunciation_focus: [
        "Thì quá khứ gần (passato prossimo): 'ho' (avere) + 'ricevuto' (quá khứ phân từ)",
        "Người Việt hay quên trợ động từ — phải có 'ho', không viết 'ricevuto il messaggio' trống",
      ],
      pronunciation_focus_en: [
        "Present perfect (passato prossimo): 'ho' (avere) + 'ricevuto' (past participle)",
        "Vietnamese speakers often drop the auxiliary — you need 'ho', not a bare 'ricevuto il messaggio'",
      ],
    },
    {
      en: "Ci vediamo domani alle nove.",
      vi: "Hẹn gặp ngày mai lúc 9h.",
      pronunciation_focus: [
        "'alle nove' (lúc 9 giờ): giờ dùng 'alle' + số nhiều; ngoại lệ 'all'una' (lúc 1 giờ)",
        "'Ci vediamo' (chúng ta gặp nhau) là cụm phản thân cố định — học thuộc cả cụm",
      ],
      pronunciation_focus_en: [
        "'alle nove' (at 9): clock times use 'alle' + plural; the exception is 'all'una' (at 1)",
        "'Ci vediamo' (we'll see each other) is a fixed reflexive chunk — memorise it whole",
      ],
    },

    // ── Days 11–15: Work messages ───────────────────────────────────────
    {
      en: "Buongiorno, oggi arrivo con dieci minuti di ritardo.",
      vi: "Chào buổi sáng, hôm nay tôi đến trễ 10 phút.",
      pronunciation_focus: [
        "Tin nhắn công việc nên mở đầu bằng 'Buongiorno,' — đừng nhắn cộc lốc",
        "'di ritardo' giữ nguyên giới từ 'di' — đây là lỗi giới từ rất hay gặp",
      ],
      pronunciation_focus_en: [
        "Open a work message with 'Buongiorno,' — don't fire off a bare line",
        "'di ritardo' keeps the preposition 'di' — a very common preposition slip",
      ],
    },
    {
      en: "Ho finito il compito e ho avvisato il supervisore.",
      vi: "Tôi xong việc và đã báo giám sát.",
      pronunciation_focus: [
        "Hai động từ quá khứ gần, mỗi cái cần trợ động từ 'ho': ho finito ... ho avvisato",
        "'il supervisore' có mạo từ — danh từ tiếng Ý hiếm khi đứng trần",
      ],
      pronunciation_focus_en: [
        "Two present-perfect verbs, each needs its own 'ho': ho finito ... ho avvisato",
        "'il supervisore' takes an article — Italian nouns rarely stand bare",
      ],
    },
    {
      en: "Ho bisogno di aiuto con questo compito.",
      vi: "Tôi cần giúp với việc này.",
      pronunciation_focus: [
        "'avere bisogno DI' — bắt buộc có 'di'; viết 'ho bisogno aiuto' là SAI",
        "'con questo compito' (với việc này): 'questo' hợp giống đực số ít",
      ],
      pronunciation_focus_en: [
        "'avere bisogno DI' — the 'di' is obligatory; 'ho bisogno aiuto' is WRONG",
        "'con questo compito' (with this task): 'questo' agrees masculine singular",
      ],
    },
    {
      en: "Non ho capito bene le istruzioni.",
      vi: "Tôi chưa hiểu rõ hướng dẫn.",
      pronunciation_focus: [
        "Phủ định: 'Non' đứng TRƯỚC trợ động từ 'ho', không đứng trước phân từ",
        "'le istruzioni' số nhiều giống cái — mạo từ 'le', đuôi '-i'",
      ],
      pronunciation_focus_en: [
        "Negation: 'Non' goes BEFORE the auxiliary 'ho', not before the participle",
        "'le istruzioni' is feminine plural — article 'le', ending '-i'",
      ],
    },

    // ── Days 16–20: Formal email ────────────────────────────────────────
    {
      en: "Buongiorno, mi chiamo ___ e scrivo per chiedere informazioni su ___. Vorrei sapere quali documenti sono necessari. La ringrazio per l'aiuto. Cordiali saluti, ___.",
      vi: "Xin chào, tôi tên ___ và viết để hỏi thông tin về ___. Tôi muốn biết cần giấy tờ nào. Xin cảm ơn sự giúp đỡ. Trân trọng, ___.",
      pronunciation_focus: [
        "'scrivo PER chiedere' — 'per' + nguyên thể để diễn đạt mục đích; KHÔNG viết 'scrivo chiedere'",
        "'documenti necessari' — tính từ hợp số nhiều giống đực, KHÔNG để 'necessario'",
        "'La ringrazio' viết hoa 'La' — đại từ kính ngữ ngôi Lei",
      ],
      pronunciation_focus_en: [
        "'scrivo PER chiedere' — 'per' + infinitive expresses purpose; never 'scrivo chiedere'",
        "'documenti necessari' — adjective agrees masculine plural, not 'necessario'",
        "'La ringrazio' capitalises 'La' — the polite Lei-form object pronoun",
      ],
    },

    // ── Days 21–25: Complaint ───────────────────────────────────────────
    {
      en: "Buongiorno, scrivo per segnalare un problema con ___. Il problema è iniziato il ___. Chiedo gentilmente di controllare e di farmi sapere il prossimo passo. Grazie.",
      vi: "Xin chào, tôi viết để báo một vấn đề với ___. Vấn đề bắt đầu ngày ___. Kính xin kiểm tra và cho tôi biết bước tiếp theo. Cảm ơn.",
      pronunciation_focus: [
        "'scrivo per segnalare' — lại là 'per' + nguyên thể (mục đích)",
        "'è iniziato' dùng trợ động từ 'essere' (không phải 'avere') với động từ chỉ sự thay đổi/khởi đầu",
        "'di controllare e di farmi sapere' — 'chiedere DI' + nguyên thể; lặp 'di' cho mỗi việc",
      ],
      pronunciation_focus_en: [
        "'scrivo per segnalare' — again 'per' + infinitive (purpose)",
        "'è iniziato' takes 'essere' (not 'avere') for verbs of change/beginning",
        "'di controllare e di farmi sapere' — 'chiedere DI' + infinitive; repeat 'di' for each action",
      ],
    },

    // ── Days 26–30: Short opinion ───────────────────────────────────────
    {
      en: "Secondo me studiare italiano ogni giorno è importante. La lingua serve al lavoro, dal medico e negli uffici. Per esempio, quando ho un problema devo spiegarmi bene. In conclusione, anche dieci minuti al giorno sono utili.",
      vi: "Theo tôi, học tiếng Ý mỗi ngày là quan trọng. Ngôn ngữ cần cho công việc, ở chỗ bác sĩ và trong các cơ quan. Ví dụ, khi tôi gặp vấn đề tôi phải diễn đạt rõ. Tóm lại, dù chỉ 10 phút mỗi ngày cũng hữu ích.",
      pronunciation_focus: [
        "Khung ý kiến: 'Secondo me ...' (mở) → 'Per esempio ...' (dẫn chứng) → 'In conclusione ...' (kết)",
        "Giới từ co lại: 'al lavoro' (a+il), 'dal medico' (da+il), 'negli uffici' (in+gli)",
        "'studiare ... è importante' — dùng nguyên thể làm chủ ngữ, không chia ngôi",
      ],
      pronunciation_focus_en: [
        "Opinion frame: 'Secondo me ...' (open) → 'Per esempio ...' (example) → 'In conclusione ...' (close)",
        "Contracted prepositions: 'al lavoro' (a+il), 'dal medico' (da+il), 'negli uffici' (in+gli)",
        "'studiare ... è importante' — infinitive as subject, no conjugation",
      ],
    },
  ],

  vocabulary: [
    // ── Core Writing Formula (the six building blocks of any message) ────
    {
      cell_id: "2a90e0b2-30de-4610-b839-27127ff2f148",
      word: "Buongiorno,",
      en: "greeting — hello / good morning",
      vi: "xin chào",
      pos: "formula: greeting",
      pronunciation_vi:
        "Mở đầu mọi tin nhắn/email lịch sự bằng 'Buongiorno,' (đến ~6h tối) hoặc 'Buonasera,' (tối)",
      pronunciation_en:
        "Open any polite message with 'Buongiorno,' (until ~6 PM) or 'Buonasera,' (evening)",
    },
    {
      cell_id: "7242d778-9c06-42ae-89f8-3212795bd0f8",
      word: "mi chiamo ___",
      en: "identity — my name is ___",
      vi: "tôi tên là ___",
      pos: "formula: identity",
      pronunciation_vi: "Động từ phản thân 'chiamarsi': mi chiamo / ti chiami / si chiama",
      pronunciation_en: "Reflexive verb 'chiamarsi': mi chiamo / ti chiami / si chiama",
    },
    {
      cell_id: "9d08320d-8cc6-428c-ad32-d6b0a97cc1ab",
      word: "scrivo per...",
      en: "reason — I am writing to...",
      vi: "tôi viết để...",
      pos: "formula: reason",
      pronunciation_vi: "'per' + động từ nguyên thể = mục đích: scrivo per chiedere / per segnalare",
      pronunciation_en: "'per' + infinitive = purpose: scrivo per chiedere / per segnalare",
    },
    {
      cell_id: "e281f521-f765-486f-a592-cf135647675b",
      word: "vorrei chiedere...",
      en: "request — I would like to ask...",
      vi: "tôi muốn xin/hỏi...",
      pos: "formula: request",
      pronunciation_vi: "'vorrei' (điều kiện cách) lịch sự hơn 'voglio' (tôi muốn — nghe như ra lệnh)",
      pronunciation_en: "'vorrei' (conditional) is more polite than 'voglio' (I want — sounds like an order)",
    },
    {
      cell_id: "d8babde9-3238-469e-b78c-df2e1ee49620",
      word: "La ringrazio",
      en: "thanks — I thank you (formal)",
      vi: "xin cảm ơn ông/bà",
      pos: "formula: thanks",
      pronunciation_vi: "Viết hoa 'La' — kính ngữ ngôi Lei; trang trọng hơn 'grazie'",
      pronunciation_en: "Capitalised 'La' — polite Lei pronoun; more formal than 'grazie'",
    },
    {
      cell_id: "1e606d97-a786-4ab6-a8bb-6f36723520fe",
      word: "Cordiali saluti",
      en: "closing — kind regards",
      vi: "trân trọng",
      pos: "formula: closing",
      pronunciation_vi: "Câu kết chuẩn cho email trang trọng; thân mật hơn thì 'A presto'",
      pronunciation_en: "Standard sign-off for a formal email; for friendly tone use 'A presto'",
    },

    // ── Form fields (Days 6–10) ─────────────────────────────────────────
    {
      cell_id: "85b28e28-d0ad-4e03-af32-203196e41970",
      word: "Nome",
      en: "given name",
      vi: "tên",
      pos: "form field",
      pronunciation_vi: "Ô 'Nome' = tên gọi (không phải họ)",
      pronunciation_en: "The 'Nome' box = your first/given name",
    },
    {
      cell_id: "270276fd-6e50-4a77-b36f-0dbb72a253e6",
      word: "Cognome",
      en: "family name / surname",
      vi: "họ",
      pos: "form field",
      pronunciation_vi: "'Cognome' = họ; người Việt hay điền nhầm vào ô 'Nome'",
      pronunciation_en: "'Cognome' = surname; learners often swap it with 'Nome'",
    },
    {
      cell_id: "6a1e6a1d-7632-461d-b906-cdf754a52c13",
      word: "Data di nascita",
      en: "date of birth",
      vi: "ngày sinh",
      pos: "form field",
      pronunciation_vi: "Định dạng Ý là ngày/tháng/năm (gg/mm/aaaa)",
      pronunciation_en: "Italian format is day/month/year (gg/mm/aaaa)",
    },
    {
      cell_id: "e8df8114-cd36-4e7f-9fe1-c33c22ca9b8b",
      word: "Luogo di nascita",
      en: "place of birth",
      vi: "nơi sinh",
      pos: "form field",
      pronunciation_vi: "Ghi thành phố/tỉnh nơi sinh",
      pronunciation_en: "Enter the town/city of birth",
    },
    {
      cell_id: "ade99c12-3880-4240-bdeb-75c56c09851d",
      word: "Indirizzo",
      en: "address",
      vi: "địa chỉ",
      pos: "form field",
      pronunciation_vi: "'Indirizzo' có 'zz' đôi — viết đủ hai chữ z",
      pronunciation_en: "'Indirizzo' has a double 'zz' — write both z's",
    },
    {
      cell_id: "7c04f8e1-fcc8-45ec-a8da-ec58e2f595f3",
      word: "Codice fiscale",
      en: "tax code",
      vi: "mã số thuế",
      pos: "form field",
      pronunciation_vi: "Mã định danh thuế bắt buộc ở Ý — như số định danh cá nhân",
      pronunciation_en: "The mandatory Italian tax/ID code — like a personal identification number",
    },
  ],

  // The 5-step daily method (repurposes `dialogue` as a numbered routine).
  dialogue: [
    {
      cell_id: "1050e4f3-c898-42b7-966f-13392d10b978",
      speaker: "Passo 1",
      text: "Copia un testo modello.",
      vi: "Chép một văn bản mẫu.",
      en: "Copy one model text.",
    },
    {
      cell_id: "77ef4327-f370-4516-a6ba-450ed51201f7",
      speaker: "Passo 2",
      text: "Segna gli articoli e le preposizioni.",
      vi: "Đánh dấu mạo từ và giới từ.",
      en: "Mark articles and prepositions.",
    },
    {
      cell_id: "0c2baeb1-d1d7-4247-be7e-1fb470352153",
      speaker: "Passo 3",
      text: "Cambia nomi, date e dettagli.",
      vi: "Thay tên, ngày tháng và chi tiết.",
      en: "Replace names, dates, and details.",
    },
    {
      cell_id: "d28f8a5d-47a9-4e7d-bd36-98813a74ef57",
      speaker: "Passo 4",
      text: "Scrivi la tua versione.",
      vi: "Viết phiên bản của riêng bạn.",
      en: "Write your own version.",
    },
    {
      cell_id: "3f533836-c528-49ce-8cd6-082a298a2669",
      speaker: "Passo 5",
      text: "Correggi un errore tipico dei vietnamiti.",
      vi: "Sửa một lỗi điển hình của người Việt.",
      en: "Correct one Vietnamese-speaker mistake.",
    },
  ],

  exercises: [
    // Vietnamese-speaker grammar notes (wrong → correct).
    {
      type: "grammar_fix",
      instruction_vi:
        "Lỗi ngữ pháp điển hình của người Việt — sửa từ SAI sang ĐÚNG và nhớ điểm cần chú ý:",
      instruction_en:
        "Typical Vietnamese-speaker grammar mistakes — fix WRONG to CORRECT and note the focus point:",
      items: [
        {
          prompt: "scrivo chiedere",
          answer: "scrivo per chiedere",
          focus_vi: "'per' + động từ nguyên thể (mục đích)",
          focus_en: "'per' + infinitive (purpose)",
        },
        {
          prompt: "ho bisogno aiuto",
          answer: "ho bisogno di aiuto",
          focus_vi: "giới từ 'di' sau 'avere bisogno'",
          focus_en: "the preposition 'di' after 'avere bisogno'",
        },
        {
          prompt: "documenti necessario",
          answer: "documenti necessari",
          focus_vi: "tính từ hợp số nhiều",
          focus_en: "plural agreement",
        },
        {
          prompt: "vivo Italia",
          answer: "vivo in Italia",
          focus_vi: "giới từ 'in' trước tên nước",
          focus_en: "the preposition 'in' before a country",
        },
      ],
    },
    // Practice prompts + model answers (answer key).
    {
      type: "practice",
      instruction_vi: "Bài tập viết — viết bản của bạn, rồi so với đáp án mẫu:",
      instruction_en: "Writing practice — write your own, then compare to the model answer:",
      items: [
        {
          prompt: "Viết một SMS báo bạn đến trễ.",
          prompt_en: "Write an SMS saying you are late.",
          answer: "Buongiorno, arrivo con dieci minuti di ritardo. Mi scusi.",
        },
        {
          prompt: "Điền form với năm trường thông tin.",
          prompt_en: "Fill a form with five fields.",
          answer: "Nome, Cognome, Data di nascita, Indirizzo, Codice fiscale.",
        },
        {
          prompt: "Viết email trang trọng hỏi xin giấy tờ.",
          prompt_en: "Write a formal email asking for documents.",
          answer:
            "Dùng email mẫu Days 16–20: Buongiorno, mi chiamo ___ e scrivo per chiedere informazioni su ___. Vorrei sapere quali documenti sono necessari. La ringrazio per l'aiuto. Cordiali saluti, ___.",
        },
        {
          prompt: "Viết khiếu nại về hệ thống sưởi.",
          prompt_en: "Write a complaint about heating.",
          answer: "Scrivo per segnalare un problema con il riscaldamento.",
        },
        {
          prompt: "Viết ý kiến ngắn về việc học tiếng Ý.",
          prompt_en: "Write a short opinion about learning Italian.",
          answer: "Dùng khung: Secondo me... Per esempio... In conclusione...",
        },
      ],
    },
    // Self-assessment rubric (1–5).
    {
      type: "rubric",
      instruction_vi: "Tự chấm bài viết của bạn theo thang điểm 1–5:",
      instruction_en: "Self-score your writing on a 1–5 scale:",
      items: [
        { prompt: "1", answer: "Chỉ có từ rời rạc.", answer_en: "words only" },
        {
          prompt: "2",
          answer: "Hiểu được nhưng thiếu cấu trúc.",
          answer_en: "understandable but missing structure",
        },
        {
          prompt: "3",
          answer: "Thông điệp rõ nhưng còn vài lỗi.",
          answer_en: "clear message with some errors",
        },
        {
          prompt: "4",
          answer: "Đúng giọng điệu và cấu trúc.",
          answer_en: "correct tone and structure",
        },
        {
          prompt: "5",
          answer: "Tự nhiên, lịch sự và chính xác.",
          answer_en: "natural, polite, and accurate",
        },
      ],
    },
  ],

  content:
    "Mục tiêu 30 ngày: SMS, email, điền form, khiếu nại, bài luận ngắn. Mỗi ngày làm theo 5 bước (chép mẫu → đánh dấu mạo từ & giới từ → thay chi tiết → viết bản của mình → sửa một lỗi). Lộ trình: Ngày 1–5 SMS → Ngày 6–10 form → Ngày 11–15 tin nhắn công việc → Ngày 16–20 email trang trọng → Ngày 21–25 khiếu nại → Ngày 26–30 ý kiến ngắn.",

  cultural_notes_vi:
    "Kế hoạch viết 30 ngày này dạy người Việt viết những văn bản đời thực bằng tiếng Ý: tin nhắn, email, điền form, khiếu nại và bài luận ngắn. Văn hóa viết của Ý coi trọng sự lịch sự: tin nhắn công việc và email luôn mở đầu bằng 'Buongiorno,' và kết bằng 'Cordiali saluti'. Ngôi 'Lei' (kính ngữ) dùng khi viết cho người lạ hoặc cấp trên — viết hoa 'La', 'Le'. Bốn lỗi cố hữu của người Việt khi viết tiếng Ý: thiếu giới từ ('per', 'di', 'in'), tính từ không hợp số/giống, quên trợ động từ ở thì quá khứ, và viết câu cộc lốc không có lời chào.",
  cultural_notes_en:
    "This 30-day writing plan teaches Vietnamese learners to produce real-world Italian texts: messages, emails, forms, complaints, and short essays. Italian writing culture prizes politeness: work messages and emails open with 'Buongiorno,' and close with 'Cordiali saluti'. The polite 'Lei' form is used when writing to a stranger or a superior — capitalise 'La', 'Le'. The four recurring Vietnamese-speaker writing errors: dropped prepositions ('per', 'di', 'in'), adjectives that fail number/gender agreement, missing auxiliaries in the past tense, and bare lines with no greeting.",

  tip_advice_vi:
    "Làm đúng 5 bước mỗi ngày: chép một văn bản mẫu, đánh dấu mạo từ và giới từ, thay tên/ngày/chi tiết, viết bản của riêng bạn, rồi chỉ sửa MỘT lỗi điển hình của người Việt. Nhớ công thức cốt lõi 6 phần (chào → giới thiệu → lý do → yêu cầu → cảm ơn → kết) — nó dựng được gần như mọi tin nhắn và email. Ưu tiên giới từ ('per', 'di', 'in') và sự hợp giống/số trước, vì đó là hai lỗi làm câu tiếng Ý 'sai' nhất.",
  tip_advice_en:
    "Run the same 5-step loop every day: copy a model text, mark the articles and prepositions, swap names/dates/details, write your own version, then fix ONE typical Vietnamese-speaker error. Memorise the 6-part core formula (greeting → identity → reason → request → thanks → closing) — it builds almost any message or email. Prioritise prepositions ('per', 'di', 'in') and gender/number agreement first; those two are what make Italian sentences read as 'wrong'.",
};

export default lesson;
