// src/languages/italian/extra/error-bank-vietnamese-speakers.ts
//
// Italian error bank for Vietnamese speakers.
// Converted from .local/vietnamese-italian-study/K9-italian-error-bank-vietnamese-speakers.md.
//
// Collects the grammar, writing, and tone mistakes Vietnamese speakers most
// often make in Italian — missing articles, wrong prepositions, untensed/
// unconjugated verbs, gender/plural agreement, blunt register, and word
// order. Use it as a correction checklist before sending a message, speaking
// in an exam, or writing a work/office text.
//
// Shape mirrors the French lessons-a1.ts pattern (LessonSentence /
// VocabEntry / Exercise) so the page UI stays consistent across verticals.
// Types are inlined because src/languages/italian/lessons.ts does not exist
// yet — keep this file self-contained until the Italian registry lands.
//
// Vietnamese-first: every entry carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-speaker (L1) note, `pronunciation_focus_en` the
// English-speaker companion.

export type LessonSentence = {
  en: string;
  vi: string;
  // L1 = Vietnamese-speaker correction/usage notes.
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (error-table, tone, practice) can vary.
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
  id: "italian_error_bank_vietnamese_speakers",
  category: "grammar",
  level: "B1",
  title_vi: "Ngân hàng lỗi tiếng Ý cho người Việt",
  title_en: "Italian error bank for Vietnamese speakers",

  sentences: [
    {
      en: "I have an appointment. → Ho un appuntamento. (NOT 'Ho appuntamento.')",
      vi: "Tôi có hẹn. → Ho un appuntamento.",
      pronunciation_focus: [
        "Tiếng Việt bỏ mạo từ ('có hẹn'), tiếng Ý thì KHÔNG: phải thêm 'un'",
        "Danh từ đếm được, số ít gần như luôn cần mạo từ (un / una / il / la)",
      ],
      pronunciation_focus_en: [
        "Vietnamese drops the article ('có hẹn'); Italian does not — you must add 'un'",
        "A singular countable noun almost always needs an article (un / una / il / la)",
      ],
    },
    {
      en: "I live in Italy. → Vivo in Italia. (NOT 'Vivo a Italia.')",
      vi: "Tôi sống ở Ý. → Vivo in Italia.",
      pronunciation_focus: [
        "Quốc gia dùng 'in' (in Italia); thành phố dùng 'a' (a Roma)",
        "Đừng dịch máy 'ở' = 'a' cho mọi trường hợp",
      ],
      pronunciation_focus_en: [
        "Countries take 'in' (in Italia); cities take 'a' (a Roma)",
        "Don't map Vietnamese 'ở' onto 'a' for every place",
      ],
    },
    {
      en: "I worked yesterday. → Ieri ho lavorato. (NOT 'Ieri lavoro.')",
      vi: "Hôm qua tôi làm việc. → Ieri ho lavorato.",
      pronunciation_focus: [
        "Tiếng Việt không chia thì — chỉ thêm 'hôm qua'. Tiếng Ý BẮT BUỘC chia thì quá khứ",
        "Quá khứ gần: avere/essere + quá khứ phân từ (ho lavorato)",
      ],
      pronunciation_focus_en: [
        "Vietnamese marks time with a word ('hôm qua') and leaves the verb bare; Italian must inflect for past tense",
        "Passato prossimo: avere/essere + past participle (ho lavorato)",
      ],
    },
    {
      en: "I went to the town hall. → Sono andato/a al Comune. (NOT 'Ho andato.')",
      vi: "Tôi đã đến Ủy ban. → Sono andato/a al Comune.",
      pronunciation_focus: [
        "Động từ di chuyển (andare) dùng 'essere', KHÔNG dùng 'avere'",
        "Với 'essere', phân từ hợp giống: andato (nam) / andata (nữ)",
      ],
      pronunciation_focus_en: [
        "Movement verbs (andare) take 'essere', not 'avere'",
        "With 'essere' the participle agrees in gender: andato (m) / andata (f)",
      ],
    },
    {
      en: "It's a (masculine) problem. → un problema (NOT 'una problema')",
      vi: "Một vấn đề. → un problema",
      pronunciation_focus: [
        "Từ kết thúc bằng -a thường là giống cái, NHƯNG 'problema' là ngoại lệ giống đực",
        "Cùng nhóm ngoại lệ: il sistema, il tema, il programma (gốc Hy Lạp -ma)",
      ],
      pronunciation_focus_en: [
        "Nouns in -a are usually feminine, BUT 'problema' is a masculine exception",
        "Same group: il sistema, il tema, il programma (Greek-origin -ma nouns)",
      ],
    },
    {
      en: "I'd like an answer. → Vorrei una risposta. (softer than 'Voglio risposta.')",
      vi: "Tôi muốn câu trả lời. → Vorrei una risposta.",
      pronunciation_focus: [
        "'Voglio' (tôi muốn) nghe như ra lệnh; 'Vorrei' (tôi muốn xin) lịch sự hơn nhiều",
        "Vẫn phải thêm mạo từ 'una' — bỏ mạo từ là lỗi kép",
      ],
      pronunciation_focus_en: [
        "'Voglio' (I want) sounds like an order; 'Vorrei' (I'd like) is far more polite",
        "Still add the article 'una' — dropping it is a second mistake",
      ],
    },
    {
      en: "I'll study Italian in the evening. → Studio italiano la sera. (NOT 'Io italiano studio sera.')",
      vi: "Tôi học tiếng Ý buổi tối. → Studio italiano la sera.",
      pronunciation_focus: [
        "Trật tự cơ bản: Chủ ngữ – Động từ – Bổ ngữ (động từ đứng SAU chủ ngữ, không dồn cuối câu)",
        "Bỏ được chủ ngữ 'io' vì đuôi động từ đã chỉ ngôi (studio = tôi học)",
      ],
      pronunciation_focus_en: [
        "Basic order is Subject–Verb–Object; the verb does not pile up at the end of the clause",
        "Drop the subject 'io' — the verb ending already shows the person (studio = I study)",
      ],
    },
    {
      en: "There's a water leak in the bathroom. → C'è una perdita d'acqua in bagno.",
      vi: "Có chỗ rò nước trong nhà tắm. → C'è una perdita d'acqua in bagno.",
      pronunciation_focus: [
        "Đừng xếp danh từ cạnh nhau kiểu Việt ('vấn đề nước nhà tắm') — Ý cần động từ + giới từ",
        "'C'è' = có (số ít); 'Ci sono' = có (số nhiều)",
      ],
      pronunciation_focus_en: [
        "Don't string nouns together as in Vietnamese ('problem water bathroom') — Italian needs a verb + prepositions",
        "'C'è' = there is (singular); 'Ci sono' = there are (plural)",
      ],
    },
  ],

  cultural_notes_vi:
    "Hầu hết lỗi của người Việt trong tiếng Ý đều bắt nguồn từ một điểm: tiếng Việt là ngôn ngữ KHÔNG biến hình — không mạo từ, không chia thì, không hợp giống/số. Tiếng Ý thì ngược lại, đánh dấu tất cả những thứ đó. Vì vậy bốn lỗi hay gặp nhất là (1) bỏ mạo từ, (2) để động từ ở dạng nguyên thể, (3) sai giới từ, (4) không hợp giống/số. Trong môi trường công sở hoặc thư từ chính thức, còn một lỗi thứ năm: nói quá thẳng. Dịch trực tiếp 'Tôi muốn...', 'Trả lời ngay' sang tiếng Ý nghe như ra lệnh; người Ý dùng thể điều kiện (Vorrei, Potrebbe) để làm mềm.",
  cultural_notes_en:
    "Most Vietnamese-speaker errors in Italian trace to one root: Vietnamese is an isolating language — no articles, no verb tense inflection, no gender/number agreement. Italian marks all of those. So the four most frequent errors are (1) dropping the article, (2) leaving the verb in the infinitive, (3) wrong preposition, (4) failed gender/number agreement. In a workplace or formal-writing setting there is a fifth: being too blunt. Translating 'Tôi muốn...' or 'Trả lời ngay' straight into Italian lands like an order; Italians soften with the conditional (Vorrei, Potrebbe).",
  tip_advice_vi:
    "Quy trình sửa lỗi 6 bước trước khi gửi tin nhắn hay nói: (1) Tìm động từ — đã chia thì chưa? (2) Thêm mạo từ còn thiếu. (3) Kiểm tra giới từ (in/a, di, al). (4) Kiểm tra giống/số. (5) Thêm dấu hiệu thời gian hoặc thì. (6) Làm mềm giọng điệu cho người đọc trang trọng (Voglio → Vorrei). Đọc lại câu một lượt theo đúng thứ tự này, mỗi lần chỉ soi một loại lỗi.",
  tip_advice_en:
    "A 6-step correction routine before you send a message or speak: (1) Find the verb — is it inflected for tense? (2) Add any missing articles. (3) Check prepositions (in/a, di, al). (4) Check gender/number. (5) Add a time marker or tense. (6) Soften the tone for a formal reader (Voglio → Vorrei). Run the sentence through these passes in order, hunting one error type at a time.",

  vocabulary: [
    {
      word: "un appuntamento",
      en: "an appointment",
      vi: "một cuộc hẹn",
      pos: "noun phrase (m)",
      pronunciation_vi: "un ap-pun-ta-MEN-to — đừng quên 'un'",
      pronunciation_en: "un ap-pun-ta-MEN-to — never drop the 'un'",
    },
    {
      word: "il documento",
      en: "the document",
      vi: "giấy tờ",
      pos: "noun (m)",
      pronunciation_vi: "il do-cu-MEN-to — 'Ho bisogno DEL documento'",
      pronunciation_en: "il do-cu-MEN-to — 'Ho bisogno DEL documento'",
    },
    {
      word: "il problema",
      en: "the problem",
      vi: "vấn đề",
      pos: "noun (m, irregular)",
      pronunciation_vi: "il pro-BLE-ma — giống ĐỰC dù kết thúc -a",
      pronunciation_en: "il pro-BLE-ma — MASCULINE despite the -a ending",
    },
    {
      word: "il sistema",
      en: "the system",
      vi: "hệ thống",
      pos: "noun (m, irregular)",
      pronunciation_vi: "il si-STE-ma — giống đực: 'IL sistema', không 'la sistema'",
      pronunciation_en: "il si-STE-ma — masculine: 'IL sistema', not 'la sistema'",
    },
    {
      word: "le informazioni",
      en: "the information / details",
      vi: "thông tin",
      pos: "noun (f, pl)",
      pronunciation_vi: "le in-for-ma-TSIO-ni — số nhiều cái: 'informazioni importanti'",
      pronunciation_en: "le in-for-ma-TSYO-nee — feminine plural: 'informazioni importanti'",
    },
    {
      word: "avere bisogno di",
      en: "to need",
      vi: "cần",
      pos: "verb phrase",
      pronunciation_vi: "a-VE-re bi-SO-nyo DI — luôn có 'di': 'ho bisogno DI aiuto'",
      pronunciation_en: "a-VE-re bi-SO-nyo DEE — always with 'di': 'ho bisogno DI aiuto'",
    },
    {
      word: "partecipare a",
      en: "to take part in / attend",
      vi: "tham gia",
      pos: "verb phrase",
      pronunciation_vi: "par-te-ci-PA-re A — cần 'a/alla': 'partecipo ALLA lezione'",
      pronunciation_en: "par-te-chee-PA-re AH — needs 'a/alla': 'partecipo ALLA lezione'",
    },
    {
      word: "andare",
      en: "to go",
      vi: "đi",
      pos: "verb (essere)",
      pronunciation_vi: "an-DA-re — quá khứ dùng essere: 'sono andato/a'",
      pronunciation_en: "an-DA-re — past with essere: 'sono andato/a'",
    },
    {
      word: "vorrei",
      en: "I'd like (polite)",
      vi: "tôi muốn xin (lịch sự)",
      pos: "verb (conditional)",
      pronunciation_vi: "vor-REI — mềm hơn 'voglio'; dùng khi yêu cầu",
      pronunciation_en: "vor-RAY — softer than 'voglio'; use for requests",
    },
    {
      word: "il malinteso",
      en: "the misunderstanding",
      vi: "sự hiểu lầm",
      pos: "noun (m)",
      pronunciation_vi: "il ma-lin-TE-so — 'Forse c'è stato un malinteso' (làm mềm xung đột)",
      pronunciation_en: "il ma-lin-TE-so — 'Forse c'è stato un malinteso' (defuses conflict)",
    },
  ],

  dialogue: [
    {
      speaker: "Linh",
      text: "Ho appuntamento domani. Voglio risposta.",
      vi: "(SAI) Ngày mai tôi có hẹn. Tôi muốn câu trả lời.",
      en: "(WRONG) I have appointment tomorrow. I want answer.",
    },
    {
      speaker: "Insegnante",
      text: "Quasi. Aggiungi gli articoli e ammorbidisci il tono.",
      vi: "Gần đúng. Thêm mạo từ và làm mềm giọng điệu.",
      en: "Almost. Add the articles and soften the tone.",
    },
    {
      speaker: "Linh",
      text: "Ho un appuntamento domani. Vorrei una risposta, per favore.",
      vi: "(ĐÚNG) Ngày mai tôi có một cuộc hẹn. Tôi muốn xin một câu trả lời ạ.",
      en: "(RIGHT) I have an appointment tomorrow. I'd like an answer, please.",
    },
    {
      speaker: "Insegnante",
      text: "Perfetto. Articoli, condizionale, 'per favore': suona naturale.",
      vi: "Hoàn hảo. Mạo từ, thể điều kiện, 'per favore': nghe tự nhiên.",
      en: "Perfect. Articles, conditional, 'per favore': it sounds natural.",
    },
  ],

  exercises: [
    {
      type: "error_table",
      title_vi: "Lỗi mạo từ",
      instruction_vi:
        "Tiếng Việt bỏ mạo từ; tiếng Ý cần. So sánh câu SAI với câu ĐÚNG:",
      instruction_en:
        "Vietnamese drops articles; Italian needs them. Compare the WRONG and RIGHT versions:",
      items: [
        {
          prompt: "Tôi có hẹn.",
          wrong: "Ho appuntamento.",
          answer: "Ho un appuntamento.",
        },
        {
          prompt: "Tôi cần giấy tờ.",
          wrong: "Ho bisogno documento.",
          answer: "Ho bisogno del documento.",
        },
        {
          prompt: "Văn phòng đóng cửa.",
          wrong: "Ufficio chiuso.",
          answer: "L'ufficio è chiuso.",
        },
        {
          prompt: "Có vấn đề.",
          wrong: "C'è problema.",
          answer: "C'è un problema.",
        },
        {
          prompt: "Tôi đã gửi email.",
          wrong: "Ho mandato email.",
          answer: "Ho mandato un'email.",
        },
      ],
    },
    {
      type: "error_table",
      title_vi: "Lỗi giới từ",
      instruction_vi:
        "Sai giới từ là lỗi rất phổ biến. Học cặp SAI → ĐÚNG cùng nghĩa tiếng Việt:",
      instruction_en:
        "Wrong prepositions are very common. Learn each WRONG → RIGHT pair with its Vietnamese gloss:",
      items: [
        {
          wrong: "Vivo a Italia.",
          answer: "Vivo in Italia.",
          vi: "Tôi sống ở Ý. (quốc gia = in)",
        },
        {
          wrong: "Vado in Roma.",
          answer: "Vado a Roma.",
          vi: "Tôi đi Rome. (thành phố = a)",
        },
        {
          wrong: "Parlo italiano con lavoro.",
          answer: "Parlo italiano al lavoro.",
          vi: "Tôi nói tiếng Ý ở chỗ làm.",
        },
        {
          wrong: "Ho bisogno aiuto.",
          answer: "Ho bisogno di aiuto.",
          vi: "Tôi cần giúp đỡ. (bisogno + di)",
        },
        {
          wrong: "Partecipo la lezione.",
          answer: "Partecipo alla lezione.",
          vi: "Tôi tham gia buổi học. (partecipare + a)",
        },
      ],
    },
    {
      type: "error_table",
      title_vi: "Lỗi động từ",
      instruction_vi:
        "Chia thì và chọn trợ động từ. So sánh SAI → ĐÚNG và lý do:",
      instruction_en:
        "Tense and auxiliary choice. Compare WRONG → RIGHT and the reason:",
      items: [
        {
          wrong: "Ieri lavoro.",
          answer: "Ieri ho lavorato.",
          why: "Thì quá khứ. / Past tense.",
        },
        {
          wrong: "Ho andato.",
          answer: "Sono andato/a.",
          why: "'andare' dùng 'essere'. / 'andare' uses 'essere'.",
        },
        {
          wrong: "Io essere stanco.",
          answer: "Sono stanco/a.",
          why: "Phải chia động từ. / Conjugate the verb.",
        },
        {
          wrong: "Lui avere problema.",
          answer: "Lui ha un problema.",
          why: "Chia động từ + thêm mạo từ. / Conjugate + add article.",
        },
        {
          wrong: "Penso che è utile.",
          answer: "Penso che sia utile.",
          why: "Thể giả định sau ý kiến. / Subjunctive after an opinion.",
        },
      ],
    },
    {
      type: "error_table",
      title_vi: "Lỗi giống và số nhiều",
      instruction_vi:
        "Hợp giống và số. So sánh SAI → ĐÚNG và ghi chú:",
      instruction_en:
        "Gender and number agreement. Compare WRONG → RIGHT and note:",
      items: [
        {
          wrong: "una problema",
          answer: "un problema",
          note: "ngoại lệ giống đực. / masculine exception.",
        },
        {
          wrong: "documento valida",
          answer: "documento valido",
          note: "hợp giống. / agreement.",
        },
        {
          wrong: "due documento",
          answer: "due documenti",
          note: "số nhiều. / plural.",
        },
        {
          wrong: "informazioni importante",
          answer: "informazioni importanti",
          note: "số nhiều giống cái. / feminine plural.",
        },
        {
          wrong: "la sistema",
          answer: "il sistema",
          note: "giống đực -ma. / masculine -ma.",
        },
      ],
    },
    {
      type: "tone_register",
      title_vi: "Lỗi giọng điệu (thư từ / công sở)",
      instruction_vi:
        "Dịch thẳng từ tiếng Việt nghe quá thẳng. Dùng bản 'Lịch sự hơn':",
      instruction_en:
        "A direct translation sounds blunt. Use the 'Better' version instead:",
      items: [
        {
          too_direct: "Voglio risposta.",
          better: "Vorrei una risposta.",
          vi: "Tôi muốn câu trả lời.",
        },
        {
          too_direct: "Dammi documento.",
          better: "Mi può dare il documento?",
          vi: "Đưa giấy tờ giúp tôi?",
        },
        {
          too_direct: "È colpa tua.",
          better: "Forse c'è stato un malinteso.",
          vi: "Có lẽ có hiểu lầm.",
        },
        {
          too_direct: "Non va bene.",
          better: "Questa soluzione non va bene per me.",
          vi: "Giải pháp này không phù hợp.",
        },
        {
          too_direct: "Rispondi subito.",
          better: "Potrebbe rispondere appena possibile?",
          vi: "Phản hồi sớm nhất được không?",
        },
      ],
    },
    {
      type: "error_table",
      title_vi: "Lỗi trật tự từ",
      instruction_vi:
        "Đừng dồn động từ ra cuối hay xếp danh từ cạnh nhau. So sánh SAI → ĐÚNG:",
      instruction_en:
        "Don't push the verb to the end or stack nouns. Compare WRONG → RIGHT:",
      items: [
        {
          wrong: "Io domani lavoro non posso.",
          answer: "Domani lavoro, quindi non posso.",
        },
        {
          wrong: "Problema acqua bagno.",
          answer: "C'è una perdita d'acqua in bagno.",
        },
        {
          wrong: "Documento io mandato ieri.",
          answer: "Ho mandato il documento ieri.",
        },
        {
          wrong: "Casa mia vicino stazione.",
          answer: "La mia casa è vicino alla stazione.",
        },
        {
          wrong: "Io italiano studio sera.",
          answer: "Studio italiano la sera.",
        },
      ],
    },
    {
      type: "correction_workflow",
      title_vi: "Quy trình sửa lỗi 6 bước",
      instruction_vi: "Chạy mỗi câu qua 6 bước này theo đúng thứ tự trước khi gửi:",
      instruction_en: "Run each sentence through these 6 steps in order before sending:",
      steps_vi: [
        "Tìm động từ.",
        "Thêm mạo từ còn thiếu.",
        "Kiểm tra giới từ.",
        "Kiểm tra giống/số.",
        "Thêm dấu hiệu thời gian hoặc thì.",
        "Làm mềm giọng điệu cho người đọc trang trọng.",
      ],
      steps_en: [
        "Find the verb.",
        "Add needed articles.",
        "Check prepositions.",
        "Check gender/plural.",
        "Add a time marker or tense.",
        "Soften the tone for formal readers.",
      ],
    },
    {
      type: "practice_test",
      title_vi: "Luyện tập — sửa các câu sau",
      instruction_vi:
        "Sửa từng câu, rồi đối chiếu với đáp án. Mỗi câu mắc ít nhất một lỗi ở trên:",
      instruction_en:
        "Correct each sentence, then check the answer key. Each one has at least one of the errors above:",
      items: [
        {
          prompt: "Ho problema con contratto.",
          answer: "Ho un problema con il contratto.",
          vi: "Tôi gặp vấn đề với hợp đồng. (thiếu mạo từ ×2)",
        },
        {
          prompt: "Vivo a Italia da tre anni.",
          answer: "Vivo in Italia da tre anni.",
          vi: "Tôi sống ở Ý ba năm rồi. (quốc gia = in)",
        },
        {
          prompt: "Ieri io andare Comune.",
          answer: "Ieri sono andato/a al Comune.",
          vi: "Hôm qua tôi đến Ủy ban. (chia thì + essere + giới từ)",
        },
        {
          prompt: "Voglio appuntamento domani.",
          answer: "Vorrei un appuntamento domani.",
          vi: "Tôi muốn một cuộc hẹn ngày mai. (làm mềm + mạo từ)",
        },
        {
          prompt: "Documento non valido?",
          answer: "Il documento non è valido?",
          vi: "Giấy tờ không hợp lệ à? (mạo từ + động từ)",
        },
      ],
    },
  ],
};

export default lesson;
