// src/languages/italian/extra/verb-drill-system.ts
//
// Italian verb drill system for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/C3-italian-verb-drill-system.md.
//
// Vietnamese verbs do not conjugate, so Italian verb skill has to be trained
// as a reflex: subject ending, tense, auxiliary (avere vs essere), participle
// agreement, and the second-verb (infinitive) form after a modal. This file
// turns the B3 verb atlas into daily production drills.
//
// Shape mirrors the French lessons-a1.ts pattern and the sibling
// pronunciation-error-clinic.ts (LessonSentence / VocabEntry / Exercise) so
// the page UI stays consistent across verticals. Types are inlined because
// src/languages/italian/lessons.ts does not exist yet — keep this file
// self-contained until the Italian registry lands.
//
// Vietnamese-first: every drill carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-speaker (L1) production note, `pronunciation_focus_en`
// the English-speaker companion. For a verb drill these notes describe the
// grammar reflex being trained, not phonetics.

export type LessonSentence = {
  en: string;
  vi: string;
  // L1 = Vietnamese-speaker production notes (the verb reflex being trained).
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker conjugation/usage hint.
  pronunciation_vi: string;
  // English-speaker conjugation/usage hint.
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (drill table, rotation, error log) can vary.
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
  id: "italian_verb_drill_system",
  category: "grammar",
  level: "B1",
  title_vi: "Hệ thống luyện chia động từ tiếng Ý",
  title_en: "Italian verb drill system",

  sentences: [
    {
      en: "I speak Italian.",
      vi: "Tôi nói tiếng Ý.",
      pronunciation_focus: [
        "Chia đuôi theo chủ ngữ: 'Parlo italiano', KHÔNG để nguyên thể 'Io parlare'",
        "io = -o: parl-O",
      ],
      pronunciation_focus_en: [
        "Conjugate the ending for the subject: 'Parlo italiano', never the infinitive 'Io parlare'",
        "io ending = -o: parl-O",
      ],
    },
    {
      en: "We understand the question.",
      vi: "Chúng tôi hiểu câu hỏi.",
      pronunciation_focus: [
        "noi = -iamo: 'Capiamo la domanda', KHÔNG nói 'Noi capisce'",
        "'capire' không thêm -isc- ở ngôi noi/voi",
      ],
      pronunciation_focus_en: [
        "noi ending = -iamo: 'Capiamo la domanda', not 'Noi capisce'",
        "'capire' drops the -isc- infix at noi/voi",
      ],
    },
    {
      en: "Can I come in?",
      vi: "Tôi có thể vào không?",
      pronunciation_focus: [
        "Modal + nguyên thể: 'Posso entrare?', KHÔNG chia hai động từ ('Posso entro?')",
        "posso mang ngôi; entrare giữ nguyên thể",
      ],
      pronunciation_focus_en: [
        "Modal + infinitive: 'Posso entrare?', never two conjugated verbs ('Posso entro?')",
        "posso carries the person; entrare stays infinitive",
      ],
    },
    {
      en: "We have to go now.",
      vi: "Chúng tôi phải đi bây giờ.",
      pronunciation_focus: [
        "'Dobbiamo andare adesso' — động từ thứ hai luôn nguyên thể",
        "Lỗi hay gặp: 'Dobbiamo andiamo' (chia cả hai)",
      ],
      pronunciation_focus_en: [
        "'Dobbiamo andare adesso' — the second verb is always the infinitive",
        "Common error: 'Dobbiamo andiamo' (both conjugated)",
      ],
    },
    {
      en: "Yesterday I worked.",
      vi: "Hôm qua tôi đã làm việc.",
      pronunciation_focus: [
        "Trạng từ quá khứ KHÔNG đủ: phải dùng 'Ieri ho lavorato' (avere + quá khứ phân từ)",
        "KHÔNG nói 'Ieri lavoro'",
      ],
      pronunciation_focus_en: [
        "A past adverb is not enough: use 'Ieri ho lavorato' (avere + past participle)",
        "Not 'Ieri lavoro'",
      ],
    },
    {
      en: "We took the train.",
      vi: "Chúng tôi đã lấy tàu.",
      pronunciation_focus: [
        "Quá khứ phân từ bất quy tắc: 'Abbiamo preso il treno', KHÔNG phải 'prenduto'",
        "prendere → preso",
      ],
      pronunciation_focus_en: [
        "Irregular past participle: 'Abbiamo preso il treno', not 'prenduto'",
        "prendere → preso",
      ],
    },
    {
      en: "I went to work.",
      vi: "Tôi đã đi làm.",
      pronunciation_focus: [
        "Động từ chuyển động dùng essere: 'Sono andato/a al lavoro', KHÔNG nói 'Ho andato'",
        "Phân từ hợp giống/số với chủ ngữ: nam -o, nữ -a",
      ],
      pronunciation_focus_en: [
        "Motion verbs take essere: 'Sono andato/a al lavoro', never 'Ho andato'",
        "The participle agrees with the subject: male -o, female -a",
      ],
    },
    {
      en: "She arrived late.",
      vi: "Cô ấy đã đến muộn.",
      pronunciation_focus: [
        "'Lei è arrivata tardi' — essere + hợp giống cái -a",
        "KHÔNG nói 'Lei ha arrivato'",
      ],
      pronunciation_focus_en: [
        "'Lei è arrivata tardi' — essere + feminine agreement -a",
        "Not 'Lei ha arrivato'",
      ],
    },
    {
      en: "When I was little, I lived in Vietnam.",
      vi: "Khi còn nhỏ tôi sống ở Việt Nam.",
      pronunciation_focus: [
        "Nền/thói quen trong quá khứ dùng imperfetto: 'Quando ero piccolo, vivevo in Vietnam'",
        "KHÔNG dùng passato prossimo ('ho vissuto') cho trạng thái kéo dài",
      ],
      pronunciation_focus_en: [
        "Background/habit in the past uses the imperfect: 'Quando ero piccolo, vivevo in Vietnam'",
        "Don't use the passato prossimo ('ho vissuto') for an ongoing state",
      ],
    },
    {
      en: "I will talk to the manager.",
      vi: "Tôi sẽ nói với quản lý.",
      pronunciation_focus: [
        "Hiện tại dùng được cho lịch trình ('Parlo con il capo'); tương lai để nhấn quyết định ('Parlerò con il capo')",
        "Chọn thì có chủ đích, đừng chỉ dựa vào trạng từ thời gian",
      ],
      pronunciation_focus_en: [
        "Present works for a schedule ('Parlo con il capo'); the future emphasises a decision ('Parlerò con il capo')",
        "Choose the tense on purpose; don't lean on a time adverb alone",
      ],
    },
    {
      en: "I wake up at six.",
      vi: "Tôi thức dậy lúc sáu giờ.",
      pronunciation_focus: [
        "Động từ phản thân cần đại từ: 'Mi sveglio alle sei', KHÔNG bỏ 'mi'",
        "Quá khứ phản thân dùng essere: 'Mi sono svegliato/a'",
      ],
      pronunciation_focus_en: [
        "Reflexive verbs need the pronoun: 'Mi sveglio alle sei', never drop 'mi'",
        "Reflexive past uses essere: 'Mi sono svegliato/a'",
      ],
    },
    {
      en: "I like pizza.",
      vi: "Tôi thích pizza.",
      pronunciation_focus: [
        "Với piacere, vật được thích là chủ ngữ: 'Mi piace la pizza', KHÔNG nói 'Io piace'",
        "Vật số nhiều → 'piacciono': 'Mi piacciono i film italiani'",
      ],
      pronunciation_focus_en: [
        "With piacere, the liked thing is the subject: 'Mi piace la pizza', never 'Io piace'",
        "Plural thing → 'piacciono': 'Mi piacciono i film italiani'",
      ],
    },
    {
      en: "Wait here, please.",
      vi: "Chờ ở đây.",
      pronunciation_focus: [
        "Mệnh lệnh thân mật 'Aspetta qui' / trang trọng 'Aspetti qui' — KHÔNG dùng nguyên thể làm lệnh",
        "Phủ định thân mật = non + nguyên thể: 'Non entrare'",
      ],
      pronunciation_focus_en: [
        "Informal command 'Aspetta qui' / formal 'Aspetti qui' — never use the infinitive as a command",
        "Negative informal = non + infinitive: 'Non entrare'",
      ],
    },
  ],

  cultural_notes_vi:
    "Động từ tiếng Việt không biến đổi, nên với người Việt mọi thông tin về 'ai làm' và 'làm khi nào' phải được rèn thành phản xạ ở đuôi động từ và trợ động từ — không thể chờ suy nghĩ. Bốn điểm người Ý nghe ra ngay là: (1) chia đuôi theo chủ ngữ thay vì để nguyên thể; (2) chọn đúng trợ động từ avere/essere ở quá khứ; (3) hợp giống/số của quá khứ phân từ khi dùng essere; (4) giữ động từ thứ hai ở nguyên thể sau modal. 'Fato' và 'fatto', 'ho andato' và 'sono andato' là ranh giới giữa nghe-như-người-bản-xứ và nghe-như-người-mới-học.",
  cultural_notes_en:
    "Vietnamese verbs don't inflect, so for a Vietnamese speaker all the 'who does it' and 'when' information has to become a reflex in the verb ending and the auxiliary — there's no time to think. The four things Italians notice instantly: (1) conjugating the ending for the subject instead of leaving the infinitive; (2) picking the right auxiliary avere/essere in the past; (3) agreeing the past participle in gender/number when essere is used; (4) keeping the second verb in the infinitive after a modal. 'Ho andato' vs 'sono andato' is the line between sounding native and sounding like a beginner.",
  tip_advice_vi:
    "Quy trình luyện mỗi ngày: (1) che cột tiếng Ý; (2) nói đáp án to TRƯỚC khi kiểm tra; (3) lặp lại câu sửa ba lần; (4) đánh dấu lỗi theo loại (đuôi, thì, trợ động từ, phân từ, modal, phản thân, piacere); (5) làm lại các dòng sai vào hôm sau. Đừng sửa mười lỗi cùng lúc — chọn một mã lỗi (V-END, V-PAST-E…) và luyện đến khi thành phản xạ.",
  tip_advice_en:
    "Daily routine: (1) cover the Italian column; (2) say the answer aloud BEFORE checking; (3) repeat the correction sentence three times; (4) mark errors by type (ending, tense, auxiliary, participle, modal, reflexive, piacere); (5) redo missed rows the next day. Don't fix ten errors at once — pick one error code (V-END, V-PAST-E…) and drill it until it's a reflex.",

  vocabulary: [
    {
      word: "andare",
      en: "to go",
      vi: "đi",
      pos: "verb (irreg., essere)",
      pronunciation_vi: "vado, vai, va, andiamo, andate, vanno — quá khứ: sono andato/a",
      pronunciation_en: "vado, vai, va, andiamo, andate, vanno — past: sono andato/a",
    },
    {
      word: "fare",
      en: "to do / to make",
      vi: "làm",
      pos: "verb (irreg., avere)",
      pronunciation_vi: "faccio, fai, fa, facciamo, fate, fanno — quá khứ: ho fatto (đôi 'tt')",
      pronunciation_en: "faccio, fai, fa, facciamo, fate, fanno — past: ho fatto (double 'tt')",
    },
    {
      word: "capire",
      en: "to understand",
      vi: "hiểu",
      pos: "verb (-isc-, avere)",
      pronunciation_vi: "capisco, capisci, capisce, capiamo, capite, capiscono — noi/voi KHÔNG có -isc-",
      pronunciation_en: "capisco, capisci, capisce, capiamo, capite, capiscono — no -isc- at noi/voi",
    },
    {
      word: "potere",
      en: "can / to be able to",
      vi: "có thể",
      pos: "modal verb",
      pronunciation_vi: "posso, puoi, può, possiamo, potete, possono — + nguyên thể (posso entrare)",
      pronunciation_en: "posso, puoi, può, possiamo, potete, possono — + infinitive (posso entrare)",
    },
    {
      word: "dovere",
      en: "must / to have to",
      vi: "phải",
      pos: "modal verb",
      pronunciation_vi: "devo, devi, deve, dobbiamo, dovete, devono — + nguyên thể (devo lavorare)",
      pronunciation_en: "devo, devi, deve, dobbiamo, dovete, devono — + infinitive (devo lavorare)",
    },
    {
      word: "volere",
      en: "to want",
      vi: "muốn",
      pos: "modal verb",
      pronunciation_vi: "voglio, vuoi, vuole, vogliamo, volete, vogliono — Lei trang trọng = vuole",
      pronunciation_en: "voglio, vuoi, vuole, vogliamo, volete, vogliono — formal Lei = vuole",
    },
    {
      word: "sapere",
      en: "to know / to know how to",
      vi: "biết",
      pos: "verb (irreg.)",
      pronunciation_vi: "so, sai, sa, sappiamo, sapete, sanno — kỹ năng: sapere + nguyên thể (so parlare)",
      pronunciation_en: "so, sai, sa, sappiamo, sapete, sanno — for a skill: sapere + infinitive (so parlare)",
    },
    {
      word: "essere",
      en: "to be",
      vi: "là / thì",
      pos: "verb (irreg., auxiliary)",
      pronunciation_vi: "sono, sei, è, siamo, siete, sono — trợ động từ cho động từ chuyển động/phản thân; quá khứ: sono stato/a",
      pronunciation_en: "sono, sei, è, siamo, siete, sono — auxiliary for motion/reflexive verbs; past: sono stato/a",
    },
    {
      word: "avere",
      en: "to have",
      vi: "có",
      pos: "verb (irreg., auxiliary)",
      pronunciation_vi: "ho, hai, ha, abbiamo, avete, hanno — trợ động từ đa số; tuổi dùng avere: avevo 20 anni",
      pronunciation_en: "ho, hai, ha, abbiamo, avete, hanno — default auxiliary; age uses avere: avevo 20 anni",
    },
    {
      word: "piacere",
      en: "to like (lit. to be pleasing)",
      vi: "thích",
      pos: "verb (special structure)",
      pronunciation_vi: "mi/ti/gli/le/ci/vi piace (số ít) · piacciono (số nhiều); vật được thích là chủ ngữ",
      pronunciation_en: "mi/ti/gli/le/ci/vi piace (sing.) · piacciono (plur.); the liked thing is the subject",
    },
    {
      word: "svegliarsi",
      en: "to wake up (oneself)",
      vi: "thức dậy",
      pos: "reflexive verb",
      pronunciation_vi: "mi sveglio, ti svegli… — quá khứ với essere: mi sono svegliato/a",
      pronunciation_en: "mi sveglio, ti svegli… — past with essere: mi sono svegliato/a",
    },
    {
      word: "tornare",
      en: "to return / to come back",
      vi: "quay lại / về",
      pos: "verb (essere)",
      pronunciation_vi: "torno, torni… — quá khứ với essere: siamo tornati/e (KHÔNG 'abbiamo tornato')",
      pronunciation_en: "torno, torni… — past with essere: siamo tornati/e (not 'abbiamo tornato')",
    },
  ],

  dialogue: [
    {
      speaker: "Maestro",
      text: "Oggi alleniamo una sola cosa: l'ausiliare. Avere o essere?",
      vi: "Hôm nay ta luyện đúng một thứ: trợ động từ. Avere hay essere?",
      en: "Today we train just one thing: the auxiliary. Avere or essere?",
    },
    {
      speaker: "Linh",
      text: "Ho andato al lavoro… no, sono andato al lavoro.",
      vi: "'Ho andato'… không, 'Sono andato al lavoro' mới đúng.",
      en: "'Ho andato'… no, 'Sono andato al lavoro' is right.",
    },
    {
      speaker: "Maestro",
      text: "Bene. 'Andare' è movimento: essere + accordo. Sei uomo, quindi -o.",
      vi: "Tốt. 'Andare' là chuyển động: essere + hợp giống. Em là nam nên -o.",
      en: "Good. 'Andare' is motion: essere + agreement. You're male, so -o.",
    },
    {
      speaker: "Linh",
      text: "Dobbiamo andare adesso, non 'dobbiamo andiamo'.",
      vi: "'Dobbiamo andare adesso', không phải 'dobbiamo andiamo'.",
      en: "'Dobbiamo andare adesso', not 'dobbiamo andiamo'.",
    },
  ],

  exercises: [
    {
      type: "drill_codes",
      instruction_vi:
        "Mã lỗi — biết mình đang luyện kỹ năng nào và điều kiện đạt:",
      instruction_en:
        "Drill codes — know which skill you're training and the pass condition:",
      items: [
        { code: "V-END", prompt: "Đuôi hiện tại", vi: "Lỗi VN: để nguyên thể hoặc một dạng cố định", answer: "Đuôi đúng theo chủ ngữ, không ngập ngừng" },
        { code: "V-MOD", prompt: "Modal + nguyên thể", vi: "Lỗi VN: chia cả hai động từ", answer: "posso/devo/voglio + nguyên thể" },
        { code: "V-PAST-A", prompt: "Quá khứ với avere", vi: "Lỗi VN: dùng hiện tại sau trạng từ quá khứ", answer: "Đúng trợ động từ + quá khứ phân từ" },
        { code: "V-PAST-E", prompt: "Quá khứ với essere", vi: "Lỗi VN: nói 'ho andato'", answer: "essere + hợp giống/số" },
        { code: "V-IMP", prompt: "Imperfetto", vi: "Lỗi VN: dùng passato prossimo cho mọi quá khứ", answer: "Nền/thói quen dùng imperfetto" },
        { code: "V-FUT", prompt: "Tương lai/kế hoạch", vi: "Lỗi VN: chỉ có trạng từ thời gian, thiếu động từ chia", answer: "Chọn đúng hiện-tại-cho-lịch-trình hoặc thì tương lai" },
        { code: "V-REFL", prompt: "Phản thân", vi: "Lỗi VN: bỏ mi/ti/si", answer: "Đúng đại từ phản thân + trợ động từ" },
        { code: "V-PIAC", prompt: "piacere", vi: "Lỗi VN: nói 'io piace'", answer: "Động từ hợp với vật được thích" },
        { code: "V-CMD", prompt: "Mệnh lệnh", vi: "Lỗi VN: dùng nguyên thể làm lệnh", answer: "Đúng dạng thân mật/trang trọng" },
      ],
    },
    {
      type: "present_endings",
      instruction_vi:
        "Khởi động — che cột đúng, nói đuôi theo chủ ngữ trước khi kiểm tra (V-END):",
      instruction_en:
        "Warm-up — cover the correct column, say the subject ending before checking (V-END):",
      pronunciation_focus: ["chia đuôi theo chủ ngữ, không để nguyên thể"],
      pronunciation_focus_en: ["conjugate the ending for the subject, not the infinitive"],
      items: [
        { prompt: "Tôi nói tiếng Ý.", wrong: "Io parlare italiano.", answer: "Parlo italiano." },
        { prompt: "Bạn sống ở Milan à?", wrong: "Tu vivere a Milano?", answer: "Vivi a Milano?" },
        { prompt: "Cô ấy làm việc hôm nay.", wrong: "Lei lavorare oggi.", answer: "Lei lavora oggi." },
        { prompt: "Chúng tôi hiểu câu hỏi.", wrong: "Noi capisce la domanda.", answer: "Capiamo la domanda." },
        { prompt: "Các bạn mở cửa.", wrong: "Voi apre la porta.", answer: "Aprite la porta." },
        { prompt: "Họ đến lúc tám giờ.", wrong: "Loro arriva alle otto.", answer: "Arrivano alle otto." },
        { prompt: "Tôi lấy tàu.", wrong: "Io prendere treno.", answer: "Prendo il treno." },
        { prompt: "Bạn uống cà phê không?", wrong: "Tu bere caffè?", answer: "Bevi un caffè?" },
        { prompt: "Anh ấy đọc tài liệu.", wrong: "Lui leggere documento.", answer: "Lui legge il documento." },
        { prompt: "Chúng tôi kết thúc lúc năm giờ.", wrong: "Noi finisce alle cinque.", answer: "Finiamo alle cinque." },
      ],
    },
    {
      type: "subject_rotation",
      instruction_vi:
        "Xoay chủ ngữ — đọc to cả sáu ngôi cho mỗi động từ, để ý lỗi hay gặp (V-END):",
      instruction_en:
        "Subject rotation — say all six persons for each verb, watch the common mistake (V-END):",
      verbs: [
        {
          infinitive: "andare",
          gloss_vi: "đi",
          forms: [
            { subject: "io", italian: "vado", vi: "tôi đi", wrong: "io andare", drill: "Vado al lavoro." },
            { subject: "tu", italian: "vai", vi: "bạn đi", wrong: "tu va", drill: "Vai a casa?" },
            { subject: "lui/lei", italian: "va", vi: "anh ấy/cô ấy đi", wrong: "lui andare", drill: "Lei va in ufficio." },
            { subject: "noi", italian: "andiamo", vi: "chúng tôi đi", wrong: "noi va", drill: "Andiamo insieme." },
            { subject: "voi", italian: "andate", vi: "các bạn đi", wrong: "voi va", drill: "Andate adesso?" },
            { subject: "loro", italian: "vanno", vi: "họ đi", wrong: "loro va", drill: "Vanno in Italia." },
          ],
        },
        {
          infinitive: "fare",
          gloss_vi: "làm",
          forms: [
            { subject: "io", italian: "faccio", vi: "tôi làm", wrong: "io fare", drill: "Faccio una domanda." },
            { subject: "tu", italian: "fai", vi: "bạn làm", wrong: "tu fa", drill: "Fai questo lavoro?" },
            { subject: "lui/lei", italian: "fa", vi: "anh ấy/cô ấy làm", wrong: "lui fare", drill: "Fa il turno di notte." },
            { subject: "noi", italian: "facciamo", vi: "chúng tôi làm", wrong: "noi fa", drill: "Facciamo una pausa." },
            { subject: "voi", italian: "fate", vi: "các bạn làm", wrong: "voi fa", drill: "Fate attenzione." },
            { subject: "loro", italian: "fanno", vi: "họ làm", wrong: "loro fa", drill: "Fanno il controllo." },
          ],
        },
        {
          infinitive: "capire",
          gloss_vi: "hiểu",
          forms: [
            { subject: "io", italian: "capisco", vi: "tôi hiểu", wrong: "io capi", drill: "Capisco un po'." },
            { subject: "tu", italian: "capisci", vi: "bạn hiểu", wrong: "tu capisce", drill: "Capisci la regola?" },
            { subject: "lui/lei", italian: "capisce", vi: "anh ấy/cô ấy hiểu", wrong: "lei capi", drill: "Non capisce bene." },
            { subject: "noi", italian: "capiamo", vi: "chúng tôi hiểu", wrong: "noi capisciamo", drill: "Capiamo la domanda." },
            { subject: "voi", italian: "capite", vi: "các bạn hiểu", wrong: "voi capisce", drill: "Capite adesso?" },
            { subject: "loro", italian: "capiscono", vi: "họ hiểu", wrong: "loro capisce", drill: "Capiscono tutto." },
          ],
        },
      ],
    },
    {
      type: "modal_infinitive",
      instruction_vi:
        "Modal + nguyên thể — động từ thứ hai luôn giữ nguyên thể (V-MOD):",
      instruction_en:
        "Modal + infinitive — the second verb always stays infinitive (V-MOD):",
      items: [
        { prompt: "Tôi có thể vào không?", wrong: "Posso entro?", answer: "Posso entrare?", note: "Modal + nguyên thể." },
        { prompt: "Bạn có thể giúp tôi không?", wrong: "Puoi aiuti me?", answer: "Puoi aiutarmi?", note: "'aiutare' giữ nguyên thể." },
        { prompt: "Tôi phải làm việc hôm nay.", wrong: "Devo lavoro oggi.", answer: "Devo lavorare oggi.", note: "'devo' mang ngôi." },
        { prompt: "Chúng tôi phải đi bây giờ.", wrong: "Dobbiamo andiamo adesso.", answer: "Dobbiamo andare adesso.", note: "Động từ thứ hai nguyên thể." },
        { prompt: "Tôi muốn ăn.", wrong: "Voglio mangio.", answer: "Voglio mangiare.", note: "Không chia động từ thứ hai." },
        { prompt: "Họ muốn học tiếng Ý.", wrong: "Vogliono imparano italiano.", answer: "Vogliono imparare l'italiano.", note: "Mạo từ với tên ngôn ngữ." },
        { prompt: "Ông/bà muốn trả tiền bây giờ không?", wrong: "Lei vuoi paga adesso?", answer: "Vuole pagare adesso?", note: "Lei trang trọng = vuole." },
        { prompt: "Tôi biết nói tiếng Ý một chút.", wrong: "So parlo italiano un po'.", answer: "So parlare un po' italiano.", note: "'sapere' + nguyên thể cho kỹ năng." },
        { prompt: "Tôi không thể đến.", wrong: "Non posso vengo.", answer: "Non posso venire.", note: "'venire' nguyên thể." },
        { prompt: "Bạn phải ký ở đây.", wrong: "Devi firmi qui.", answer: "Devi firmare qui.", note: "Câu công việc." },
      ],
    },
    {
      type: "past_avere",
      instruction_vi:
        "Quá khứ với avere — trạng từ quá khứ chưa đủ, cần avere + quá khứ phân từ (V-PAST-A):",
      instruction_en:
        "Past with avere — a past adverb isn't enough; use avere + past participle (V-PAST-A):",
      items: [
        { prompt: "Hôm qua tôi đã làm việc.", wrong: "Ieri lavoro.", answer: "Ieri ho lavorato.", note: "Trạng từ quá khứ chưa đủ." },
        { prompt: "Tôi đã ăn lúc tám giờ.", wrong: "Io ho mangio alle otto.", answer: "Ho mangiato alle otto.", note: "Phân từ 'mangiato'." },
        { prompt: "Cô ấy đã xem phim.", wrong: "Lei ha vedere il film.", answer: "Lei ha visto il film.", note: "Phân từ bất quy tắc." },
        { prompt: "Chúng tôi đã lấy tàu.", wrong: "Noi abbiamo prenduto il treno.", answer: "Abbiamo preso il treno.", note: "'preso', không phải 'prenduto'." },
        { prompt: "Họ đã mở cửa.", wrong: "Loro hanno aprito la porta.", answer: "Hanno aperto la porta.", note: "'aperto', không phải 'aprito'." },
        { prompt: "Tôi đã viết tin nhắn.", wrong: "Ho scrivuto un messaggio.", answer: "Ho scritto un messaggio.", note: "'scritto'." },
        { prompt: "Bạn đã đọc tài liệu chưa?", wrong: "Hai legguto il documento?", answer: "Hai letto il documento?", note: "'letto'." },
        { prompt: "Tôi đã hỏi giúp đỡ.", wrong: "Ho chieduto aiuto.", answer: "Ho chiesto aiuto.", note: "'chiesto'." },
        { prompt: "Chúng tôi đã trả lời ngay.", wrong: "Abbiamo risponduto subito.", answer: "Abbiamo risposto subito.", note: "'risposto'." },
        { prompt: "Tôi đã làm xong.", wrong: "Ho fato tutto.", answer: "Ho fatto tutto.", note: "Đôi 'tt'." },
      ],
    },
    {
      type: "past_essere",
      instruction_vi:
        "Quá khứ với essere — động từ chuyển động/đổi trạng thái cần essere + hợp giống/số (V-PAST-E):",
      instruction_en:
        "Past with essere — motion/change-of-state verbs need essere + agreement (V-PAST-E):",
      items: [
        { prompt: "Tôi đã đi làm.", wrong: "Ho andato al lavoro.", answer: "Sono andato/a al lavoro.", note: "Giống của người nói quyết định -o/-a." },
        { prompt: "Cô ấy đã đến muộn.", wrong: "Lei ha arrivato tardi.", answer: "Lei è arrivata tardi.", note: "Giống cái -a." },
        { prompt: "Anh ấy đã về nhà.", wrong: "Lui ha tornato a casa.", answer: "Lui è tornato a casa.", note: "Chuyển động/quay về." },
        { prompt: "Chúng tôi đã ra ngoài.", wrong: "Abbiamo uscito.", answer: "Siamo usciti/e.", note: "Hợp số nhiều." },
        { prompt: "Họ đã vào văn phòng.", wrong: "Hanno entrato in ufficio.", answer: "Sono entrati/e in ufficio.", note: "essere." },
        { prompt: "Tôi đã ở Ý.", wrong: "Ho stato in Italia.", answer: "Sono stato/a in Italia.", note: "Quá khứ của stare/essere." },
        { prompt: "Bạn đã sinh ở đâu?", wrong: "Dove hai nato?", answer: "Dove sei nato/a?", note: "'nascere' dùng essere." },
        { prompt: "Các cô ấy đã khởi hành.", wrong: "Hanno partito.", answer: "Sono partite.", note: "Giống cái số nhiều -e." },
        { prompt: "Marco và Linh đã đến.", wrong: "Marco e Linh hanno venuto.", answer: "Marco e Linh sono venuti.", note: "Số nhiều hỗn hợp mặc định giống đực." },
        { prompt: "Chúng tôi đã quay lại lúc sáu giờ.", wrong: "Abbiamo tornato alle sei.", answer: "Siamo tornati/e alle sei.", note: "'tornare' dùng essere." },
      ],
    },
    {
      type: "imperfect_vs_passato",
      instruction_vi:
        "Imperfetto vs passato prossimo — nền/thói quen dùng imperfetto (V-IMP):",
      instruction_en:
        "Imperfect vs passato prossimo — background/habit uses the imperfect (V-IMP):",
      items: [
        { prompt: "Khi còn nhỏ tôi sống ở Việt Nam.", over_simple: "Quando ero piccolo, ho vissuto in Vietnam.", answer: "Quando ero piccolo, vivevo in Vietnam.", when: "Nền/thói quen." },
        { prompt: "Trước đây tôi làm ở kho.", over_simple: "Prima ho lavorato in un magazzino.", answer: "Prima lavoravo in un magazzino.", when: "Trạng thái/công việc kéo dài." },
        { prompt: "Mỗi ngày tôi bắt xe buýt.", over_simple: "Ogni giorno ho preso l'autobus.", answer: "Ogni giorno prendevo l'autobus.", when: "Thói quen lặp lại." },
        { prompt: "Lúc đó tôi 20 tuổi.", over_simple: "Ero 20 anni.", answer: "Avevo 20 anni.", when: "Tuổi dùng avere." },
        { prompt: "Trời lạnh.", over_simple: "Ha fatto freddo.", answer: "Faceva freddo.", when: "Thời tiết làm nền." },
        { prompt: "Tôi đang học khi bạn gọi.", over_simple: "Ho studiato quando hai chiamato.", answer: "Studiavo quando hai chiamato.", when: "Hành động đang diễn ra bị cắt ngang." },
        { prompt: "Chúng tôi không biết quy tắc.", over_simple: "Non abbiamo saputo la regola.", answer: "Non sapevamo la regola.", when: "Trạng thái biết." },
        { prompt: "Anh ấy muốn giúp.", over_simple: "Ha voluto aiutare.", answer: "Voleva aiutare.", when: "Ý định/nền." },
      ],
    },
    {
      type: "future_plans",
      instruction_vi:
        "Tương lai và kế hoạch — hiện tại dùng được cho lịch trình, tương lai để nhấn (V-FUT):",
      instruction_en:
        "Future and plans — present works for a schedule, future for emphasis (V-FUT):",
      items: [
        { prompt: "Ngày mai tôi làm việc.", good: "Domani lavoro.", explicit_future: "Domani lavorerò.", note: "Hiện tại ổn cho lịch trình." },
        { prompt: "Tuần sau tôi đi Ý.", good: "La settimana prossima vado in Italia.", explicit_future: "La settimana prossima andrò in Italia.", note: "Tương lai để nhấn/trang trọng." },
        { prompt: "Tôi sẽ nói với quản lý.", good: "Parlo con il capo.", explicit_future: "Parlerò con il capo.", note: "Lời hứa/quyết định." },
        { prompt: "Chúng tôi sẽ có thời gian.", good: "Abbiamo tempo.", explicit_future: "Avremo tempo.", note: "Dự đoán." },
        { prompt: "Họ sẽ đến lúc tám giờ.", good: "Vengono alle otto.", explicit_future: "Verranno alle otto.", note: "Kế hoạch vs dự đoán." },
        { prompt: "Tôi sẽ làm hết sức.", good: "Faccio il possibile.", explicit_future: "Farò il possibile.", note: "Câu thông dụng." },
      ],
    },
    {
      type: "reflexive",
      instruction_vi:
        "Phản thân — đừng bỏ mi/ti/si; quá khứ phản thân dùng essere (V-REFL):",
      instruction_en:
        "Reflexive — don't drop mi/ti/si; reflexive past uses essere (V-REFL):",
      items: [
        { prompt: "Tôi thức dậy lúc sáu giờ.", wrong: "Sveglio alle sei.", answer: "Mi sveglio alle sei.", note: "Cần 'mi'." },
        { prompt: "Bạn tên là gì?", wrong: "Cosa nome tu?", answer: "Come ti chiami?", note: "Cách hỏi tên dùng phản thân." },
        { prompt: "Tôi cảm thấy mệt.", wrong: "Sento stanco.", answer: "Mi sento stanco/a.", note: "'sentirsi'." },
        { prompt: "Cô ấy mặc đồ nhanh.", wrong: "Lei veste veloce.", answer: "Lei si veste in fretta.", note: "Phản thân." },
        { prompt: "Tôi đã thức dậy sớm.", wrong: "Mi ho svegliato presto.", answer: "Mi sono svegliato/a presto.", note: "Quá khứ phản thân dùng essere." },
        { prompt: "Chúng tôi đã rửa tay.", wrong: "Abbiamo lavato noi mani.", answer: "Ci siamo lavati le mani.", note: "Phản thân + bộ phận cơ thể." },
      ],
    },
    {
      type: "piacere",
      instruction_vi:
        "piacere — vật được thích là chủ ngữ, động từ hợp với vật đó (V-PIAC):",
      instruction_en:
        "piacere — the liked thing is the subject; the verb agrees with it (V-PIAC):",
      items: [
        { prompt: "Tôi thích pizza.", wrong: "Io piace la pizza.", answer: "Mi piace la pizza.", note: "Vật được thích = chủ ngữ." },
        { prompt: "Tôi thích phim Ý.", wrong: "Mi piace i film italiani.", answer: "Mi piacciono i film italiani.", note: "Vật số nhiều." },
        { prompt: "Bạn thích Roma không?", wrong: "Tu piace Roma?", answer: "Ti piace Roma?", note: "'ti' = với bạn." },
        { prompt: "Ông/bà thích cà phê không?", wrong: "Lei piace il caffè?", answer: "Le piace il caffè?", note: "'Le' gián tiếp trang trọng." },
        { prompt: "Chúng tôi thích làm việc ở đây.", wrong: "Ci piacciono lavorare qui.", answer: "Ci piace lavorare qui.", note: "Nguyên thể = số ít." },
        { prompt: "Tôi không thích chờ.", wrong: "Mi non piace aspettare.", answer: "Non mi piace aspettare.", note: "'non' đứng trước clitic + động từ." },
      ],
    },
    {
      type: "commands",
      instruction_vi:
        "Mệnh lệnh — thân mật vs trang trọng; phủ định thân mật = non + nguyên thể (V-CMD):",
      instruction_en:
        "Commands — informal vs formal; negative informal = non + infinitive (V-CMD):",
      items: [
        { prompt: "Chờ ở đây.", informal: "Aspetta qui.", formal: "Aspetti qui.", mistake: "aspettare qui." },
        { prompt: "Nói chậm.", informal: "Parla piano.", formal: "Parli piano.", mistake: "Nguyên thể làm lệnh." },
        { prompt: "Lấy tài liệu.", informal: "Prendi il documento.", formal: "Prenda il documento.", mistake: "Sai đuôi." },
        { prompt: "Đặt ở đây.", informal: "Metti qui.", formal: "Metta qui.", mistake: "mettere qui." },
        { prompt: "Mở cửa.", informal: "Apri la porta.", formal: "Apra la porta.", mistake: "Thiếu mạo từ." },
        { prompt: "Đừng vào.", informal: "Non entrare.", formal: "Non entri.", mistake: "Phủ định thân mật = nguyên thể." },
        { prompt: "Đừng chạm vào cái này.", informal: "Non toccare questo.", formal: "Non tocchi questo.", mistake: "Câu an toàn." },
        { prompt: "Xin nhắc lại.", informal: "Ripeti, per favore.", formal: "Ripeta, per favore.", mistake: "Trang trọng ở nơi làm việc." },
      ],
    },
    {
      type: "mixed_rounds",
      instruction_vi:
        "Vòng tốc độ hỗn hợp — che cột tiếng Ý, nói nhanh và đúng cả thì lẫn trợ động từ:",
      instruction_en:
        "Mixed speed rounds — cover the Italian column, say it fast and right on tense + auxiliary:",
      rounds: [
        {
          round: 1,
          items: [
            { vi: "Tôi nói chậm.", italian: "Parlo piano." },
            { vi: "Bạn hiểu không?", italian: "Capisci?" },
            { vi: "Chúng tôi phải đi.", italian: "Dobbiamo andare." },
            { vi: "Hôm qua tôi đã làm việc.", italian: "Ieri ho lavorato." },
            { vi: "Cô ấy đã đến.", italian: "Lei è arrivata." },
            { vi: "Tôi thích cà phê.", italian: "Mi piace il caffè." },
            { vi: "Đừng vào.", italian: "Non entrare." },
            { vi: "Tôi đã thức dậy sớm.", italian: "Mi sono svegliato/a presto." },
          ],
        },
        {
          round: 2,
          items: [
            { vi: "Họ sống ở Ý.", italian: "Vivono in Italia." },
            { vi: "Ông/bà muốn trả tiền không?", italian: "Vuole pagare?" },
            { vi: "Tôi đã thấy vấn đề.", italian: "Ho visto il problema." },
            { vi: "Chúng tôi đã ra ngoài.", italian: "Siamo usciti/e." },
            { vi: "Trước đây tôi làm ở kho.", italian: "Prima lavoravo in un magazzino." },
            { vi: "Tôi sẽ nói với quản lý.", italian: "Parlerò con il capo." },
            { vi: "Tôi không thích chờ.", italian: "Non mi piace aspettare." },
            { vi: "Hãy đặt cái này ở đây.", italian: "Metti questo qui." },
          ],
        },
      ],
    },
    {
      type: "error_log",
      instruction_vi:
        "Mẫu nhật ký lỗi — điền sau mỗi buổi luyện, đánh dấu loại lỗi để biết cần làm lại gì:",
      instruction_en:
        "Error log template — fill after each session; mark the error type so you know what to redo:",
      columns: ["Ngày", "Câu sai", "Mã lỗi", "Câu đúng", "Làm lại mai?"],
      error_codes: ["V-END", "V-MOD", "V-PAST-A", "V-PAST-E", "V-IMP", "V-FUT", "V-REFL", "V-PIAC", "V-CMD"],
      items: [
        { date: "", missed: "", code: "", correct: "", redrill: "yes/no" },
      ],
    },
    {
      type: "seven_day_cycle",
      instruction_vi:
        "Chu kỳ luyện động từ 7 ngày — mỗi ngày một trọng tâm và sản lượng tối thiểu:",
      instruction_en:
        "Seven-day verb drill cycle — one focus and a minimum output per day:",
      items: [
        { day: 1, main: "Đuôi hiện tại", minimum: "50 câu hiện tại đúng." },
        { day: 2, main: "Modal + nguyên thể", minimum: "40 câu modal." },
        { day: 3, main: "Quá khứ với avere", minimum: "40 câu quá khứ." },
        { day: 4, main: "Quá khứ với essere", minimum: "40 câu quá khứ chuyển động/phản thân." },
        { day: 5, main: "Imperfetto vs passato prossimo", minimum: "30 câu đối lập." },
        { day: 6, main: "Phản thân + piacere", minimum: "40 câu cấu trúc đặc biệt." },
        { day: 7, main: "Vòng tốc độ hỗn hợp", minimum: "Tất cả dòng sai trong tuần, đọc to lại cho đúng." },
      ],
    },
    {
      type: "answer_key",
      instruction_vi:
        "Đáp án / tự kiểm — câu sai nếu đổi trợ động từ, bỏ đại từ phản thân, chia động từ thứ hai sau modal, hoặc bỏ hợp giống/số bắt buộc:",
      instruction_en:
        "Answer key / self-check — wrong if you change the auxiliary, drop a reflexive pronoun, conjugate the second verb after a modal, or remove required agreement:",
      items: [
        { wrong: "Ho andato", correct: "Sono andato/a" },
        { wrong: "Mi ho svegliato", correct: "Mi sono svegliato/a" },
        { wrong: "Ci piacciono lavorare", correct: "Ci piace lavorare" },
        { wrong: "Dobbiamo andiamo", correct: "Dobbiamo andare" },
        { wrong: "Lei vuoi paga", correct: "Vuole pagare" },
        { wrong: "Ero 20 anni", correct: "Avevo 20 anni" },
        { wrong: "Prendi (làm lệnh) — đúng ngữ cảnh", correct: "'Non entrare' = phủ định thân mật; 'Non entri' = trang trọng" },
      ],
      pass_condition_vi:
        "Đạt khi qua hai vòng hỗn hợp liên tiếp, mỗi loại không quá một lỗi: đuôi hiện tại, modal, quá khứ avere, quá khứ essere, imperfetto, tương lai, phản thân, piacere, mệnh lệnh.",
      pass_condition_en:
        "Pass after two consecutive mixed rounds with no more than one error per category: present ending, modal, avere past, essere past, imperfect, future, reflexive, piacere, command.",
    },
  ],
};

export default lesson;
