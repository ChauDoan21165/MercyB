// src/languages/italian/lessons-b1.ts
//
// Italian B1 lessons for Vietnamese learners.
//
// Shape mirrors the French lesson pattern (src/languages/french/lessons-b1.ts)
// so the page UI stays consistent across language verticals. Types are defined
// inline here so this file is self-contained (the italian/ package has no
// shared lessons.ts yet); when one is added, swap these to a type-only import.
//
// Hand-crafted from the .local Vietnamese→Italian study track (T5/S3 B1 maps,
// A3 grammar, K9 error bank, B1 pronunciation scripts). No AI-generated filler.
//
// Pronunciation conventions for Vietnamese readers:
//   - c/g before e,i → "ch"/"gi"; before a,o,u → "k"/"g" (ghê → "g", chi → "k")
//   - gli → soft "li" (≈ ly);  gn → "nh";  z → "ts"/"dz";  r → tapped/trilled
//   - double consonants (ll, tt, nn, ss…) are HELD longer — load-bearing in Italian
//   - every final vowel is pronounced; never drop it the way Vietnamese clips endings

export type ItalianCategoryId =
  | "society"
  | "life_admin"
  | "house"
  | "work"
  | "health"
  | "expressions";

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonSentence = {
  en: string;
  vi: string;
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
  pronunciation_vi: string;
  // English-speaker pronunciation hint with the stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill-blank, matching, translation) can vary.
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, italian, english?
export type Exercise = Record<string, unknown>;

export type ItalianLesson = {
  id: string;
  category: ItalianCategoryId;
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

export const lessons: ItalianLesson[] = [
  {
    id: "italian_society_opinions",
    level: "B1",
    category: "society",
    title_vi: "Bày tỏ ý kiến",
    title_en: "Expressing opinions",
    sentences: [
      {
        en: "In my opinion, learning Italian is essential.",
        vi: "Theo tôi, học tiếng Ý là cần thiết.",
        pronunciation_focus: [
          "secondo→xê-CON-đô",
          "essenziale→ét-xen-DZI-a-lê",
        ],
        pronunciation_focus_en: [
          "secondo → 'seh-KOHN-doh' — stress the middle 'KON'; final -o is a clean vowel, not dropped",
          "essenziale → 'es-sen-TSYAH-leh' — double-s is held; the 'z' sounds 'ts'; every vowel pronounced",
        ],
      },
      {
        en: "The main reason is that it helps with work.",
        vi: "Lý do chính là nó giúp ích cho công việc.",
        pronunciation_focus: [
          "motivo→mô-TI-vô",
          "perché→pe-CHÊ",
        ],
        pronunciation_focus_en: [
          "motivo → 'moh-TEE-voh' — stress on 'TEE'; tapped Italian 'r'-free word, keep it crisp",
          "perché → 'per-KEH' — final stress (clap only on KEH); 'ch' is a hard 'k', never English 'ch'",
        ],
      },
      {
        en: "For example, I can talk to my colleagues.",
        vi: "Ví dụ, tôi có thể nói chuyện với đồng nghiệp.",
        pronunciation_focus: [
          "esempio→ê-DEM-pi-ô",
          "colleghi→côl-LÊ-ghi",
        ],
        pronunciation_focus_en: [
          "esempio → 'eh-ZEM-pyoh' — the s between vowels sounds 'z'; -pio glides into one syllable",
          "colleghi → 'kol-LEH-gee' — hold the double-l; 'gh' keeps a hard 'g' before i (not 'j')",
        ],
      },
      {
        en: "However, there is also a problem.",
        vi: "Nhưng cũng có một vấn đề.",
        pronunciation_focus: [
          "però→pe-RÒ",
          "problema→prô-BLÊ-ma",
        ],
        pronunciation_focus_en: [
          "però → 'peh-ROH' — final stress on the accented 'ò'; one quick tapped r",
          "problema → 'proh-BLEH-mah' — masculine despite the -a ending (un problema); stress on 'BLE'",
        ],
      },
      {
        en: "I partly agree, but I see it differently.",
        vi: "Tôi đồng ý một phần, nhưng tôi thấy khác.",
        pronunciation_focus: [
          "d'accordo→đác-COR-đô",
          "diversamente→đi-ver-xa-MEN-tê",
        ],
        pronunciation_focus_en: [
          "d'accordo → 'dak-KOR-doh' — hold the double-c (a real beat of silence then 'kor')",
          "diversamente → 'dee-ver-sah-MEN-teh' — five even syllables, main stress on 'MEN'",
        ],
      },
    ],
    cultural_notes_vi: "Người Ý thích tranh luận và mong bạn nêu lý do, không chỉ nói 'có/không'. Câu trả lời B1 cần: ý kiến + lý do + ví dụ. Mở đầu lịch sự bằng 'Secondo me…', 'Penso che…', 'Per me…'. Lưu ý: sau 'penso che' động từ thường ở thể giả định (congiuntivo): 'Penso che sia utile', không phải 'Penso che è utile'.",
    cultural_notes_en: "Italians enjoy debate and expect you to give a reason, not just 'yes/no'. A B1-level answer needs opinion + reason + example. Open politely with 'Secondo me…' (in my opinion), 'Penso che…' (I think that), 'Per me…' (for me). Watch the grammar trap: 'penso che' usually triggers the subjunctive — 'Penso che sia utile', not 'Penso che è utile'.",
    tip_advice_vi: "Học khung 3 bước: 'Secondo me… perché… per esempio…'. Khi bí từ, đừng im — diễn đạt lại bằng 'Voglio dire che…' (Ý tôi là…). Để phản biện nhẹ nhàng dùng 'Non sono del tutto d'accordo' thay vì 'Hai torto' (Bạn sai).",
    tip_advice_en: "Drill the 3-step frame: 'Secondo me… perché… per esempio…'. When you blank on a word, don't go silent — reformulate with 'Voglio dire che…' (what I mean is…). To disagree gently use 'Non sono del tutto d'accordo' (I don't fully agree) instead of the blunt 'Hai torto' (you're wrong).",
    vocabulary: [
      { cell_id: "aeeb070e-cdb8-4ae9-bb95-0c0985b2874c", word: "secondo me", en: "in my opinion", vi: "theo tôi", pos: "espr.", pronunciation_vi: "xê-CON-đô mê", pronunciation_en: "seh-KOHN-doh meh — literally 'according to me'; the go-to opinion opener" },
      { cell_id: "94d83ab8-4a6a-4f8d-be31-5c5cf00ff39f", word: "il motivo", en: "reason", vi: "lý do", pos: "n.m.", pronunciation_vi: "il mô-TI-vô", pronunciation_en: "eel moh-TEE-voh — stress 'TEE'; pairs with 'il motivo principale' (the main reason)" },
      { cell_id: "4b52e0a5-54c4-4330-bbb5-fbb5fa4d895e", word: "l'esempio", en: "example", vi: "ví dụ", pos: "n.m.", pronunciation_vi: "lê-DEM-pi-ô", pronunciation_en: "leh-ZEM-pyoh — s→'z' between vowels; 'per esempio' = for example" },
      { cell_id: "5fdb1284-be30-43cb-9259-075abb29af91", word: "il vantaggio", en: "advantage", vi: "lợi ích", pos: "n.m.", pronunciation_vi: "il van-TÁT-giô", pronunciation_en: "eel van-TAHD-joh — double-g is 'dj' and held; -ggio is one beat" },
      { cell_id: "21ab9118-185e-4f1a-9a90-e84c696615ed", word: "lo svantaggio", en: "disadvantage", vi: "bất lợi", pos: "n.m.", pronunciation_vi: "lô dvan-TÁT-giô", pronunciation_en: "loh zvan-TAHD-joh — 'lo' (not 'il') before s+consonant; sv- blends to 'zv'" },
      { cell_id: "ec06c775-dd4a-40d6-8494-9c2cb0d4f2f5", word: "essere d'accordo", en: "to agree", vi: "đồng ý", pos: "v.", pronunciation_vi: "ét-xê-rê đác-COR-đô", pronunciation_en: "ES-seh-reh dak-KOR-doh — hold the double-c; 'sono d'accordo' = I agree" },
      { cell_id: "fdbd5dbf-32ba-4e42-b4b4-707928e6ec96", word: "però", en: "however / but", vi: "nhưng", pos: "cong.", pronunciation_vi: "pe-RÒ", pronunciation_en: "peh-ROH — final stress; softer/more conversational than 'ma'" },
      { cell_id: "53ca6457-1235-4108-82d5-9e405b685a07", word: "quindi", en: "therefore", vi: "vì vậy", pos: "cong.", pronunciation_vi: "QUIN-đi", pronunciation_en: "KWEEN-dee — 'qu' is 'kw'; stress the first syllable; links a conclusion" },
      { cell_id: "d36d05db-d326-4196-b6d8-81a4bfaae4a4", word: "anche se", en: "even though", vi: "mặc dù", pos: "cong.", pronunciation_vi: "AN-kê xê", pronunciation_en: "AHN-keh seh — 'che' here is 'keh'; introduces a concession" },
      { cell_id: "86bdc512-f30b-4880-974c-f137535128ee", word: "infatti", en: "in fact / indeed", vi: "thật vậy", pos: "avv.", pronunciation_vi: "in-FÁT-ti", pronunciation_en: "een-FAHT-tee — hold the double-t; confirms what was just said" },
    ],
    dialogue: [
      { cell_id: "19aecffc-8429-49ca-9601-58aa97fadda8", speaker: "A", text: "Secondo te, è importante imparare l'italiano?", en: "In your opinion, is it important to learn Italian?", vi: "Theo bạn, học tiếng Ý có quan trọng không?" },
      { cell_id: "a542f0fa-2efd-473c-85fe-7af9e7b88a78", speaker: "B", text: "Sì, secondo me è essenziale, perché aiuta al lavoro.", en: "Yes, in my opinion it's essential, because it helps at work.", vi: "Có, theo mình là cần thiết, vì nó giúp ích cho công việc." },
      { cell_id: "ab2e8544-2165-4a51-9f89-f338de478439", speaker: "A", text: "Però all'inizio è difficile, no?", en: "But at the start it's hard, right?", vi: "Nhưng lúc đầu khó nhỉ?" },
      { cell_id: "d9f3d2b7-4724-4a6a-9412-d72f644eaa9f", speaker: "B", text: "Sono d'accordo in parte, quindi consiglio di studiare ogni giorno.", en: "I partly agree, so I recommend studying every day.", vi: "Mình đồng ý một phần, vì vậy mình khuyên nên học mỗi ngày." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ me, l'italiano è utile per il lavoro.", answer: "Secondo", hint_vi: "từ mở đầu ý kiến, nghĩa 'theo'", hint_en: "the opinion opener meaning 'according to' (Secondo me…)" },
      { type: "matching", pairs: [["il motivo", "lý do (reason)"], ["però", "nhưng (however)"], ["essere d'accordo", "đồng ý (to agree)"]], instruction: "Nối từ tiếng Ý với nghĩa tiếng Việt", instruction_en: "Match the Italian word with its Vietnamese meaning" },
      { type: "translation", vietnamese: "Theo tôi, đó là một ý tưởng tốt vì nó tiết kiệm thời gian.", english: "In my opinion, it's a good idea because it saves time.", italian: "Secondo me, è una buona idea perché fa risparmiare tempo." },
    ],
  },
  {
    id: "italian_society_paststory",
    level: "B1",
    category: "society",
    title_vi: "Kể chuyện quá khứ",
    title_en: "Telling a past story",
    sentences: [
      {
        en: "When I arrived in Italy, I was afraid.",
        vi: "Khi tôi đến Ý, tôi đã sợ.",
        pronunciation_focus: [
          "arrivato→ar-ri-VA-tô",
          "paura→pa-U-ra",
        ],
        pronunciation_focus_en: [
          "arrivato → 'ar-ree-VAH-toh' — hold the double-r (trill it a touch longer); stress 'VAH'",
          "paura → 'pah-OO-rah' — three full vowels, no diphthong glide; stress 'OO'",
        ],
      },
      {
        en: "At first I didn't understand anything.",
        vi: "Ban đầu tôi không hiểu gì cả.",
        pronunciation_focus: [
          "all'inizio→al-li-NI-DZI-ô",
          "niente→NI-en-tê",
        ],
        pronunciation_focus_en: [
          "all'inizio → 'al-lee-NEE-tsyoh' — double-l held; the 'z' is a 'ts'; -zio glides to one beat",
          "niente → 'NYEN-teh' — 'nie' becomes 'nye'; final -e clearly voiced",
        ],
      },
      {
        en: "Before, I worked in a warehouse.",
        vi: "Trước đây, tôi làm việc ở kho.",
        pronunciation_focus: [
          "prima→PRI-ma",
          "lavoravo→la-vô-RA-vô",
        ],
        pronunciation_focus_en: [
          "prima → 'PREE-mah' — stress first syllable; one quick tapped r",
          "lavoravo → 'lah-voh-RAH-voh' — the imperfetto ending '-avo' means 'I used to / was …ing'",
        ],
      },
      {
        en: "Then I decided to study Italian.",
        vi: "Rồi tôi quyết định học tiếng Ý.",
        pronunciation_focus: [
          "poi→pôi",
          "deciso→đê-CI-dô",
        ],
        pronunciation_focus_en: [
          "poi → 'poy' — one syllable, like English 'poy'; don't add a vowel after",
          "deciso → 'deh-CHEE-zoh' — 'ci' before a vowel is 'chee'; s→'z' between vowels",
        ],
      },
      {
        en: "In the end I realized I had improved.",
        vi: "Cuối cùng tôi nhận ra mình đã tiến bộ.",
        pronunciation_focus: [
          "alla fine→al-la FI-nê",
          "migliorato→mi-li-ô-RA-tô",
        ],
        pronunciation_focus_en: [
          "alla fine → 'AL-lah FEE-neh' — hold the double-l; both words keep their final vowels",
          "migliorato → 'mee-lyoh-RAH-toh' — 'gli' is the soft 'ly' sound; never 'mig-lio'",
        ],
      },
    ],
    cultural_notes_vi: "Câu chuyện B1 dùng HAI thì quá khứ: 'imperfetto' cho bối cảnh/thói quen (ero, avevo, lavoravo = 'tôi đã là/có/từng làm') và 'passato prossimo' cho sự kiện (sono arrivato, ho deciso = 'tôi đã đến/quyết định'). Nhớ: động từ di chuyển/thay đổi (andare, arrivare, partire) dùng 'essere' và phải hợp giống: 'sono arrivato' (nam) / 'sono arrivata' (nữ).",
    cultural_notes_en: "A B1 story uses TWO past tenses: the 'imperfetto' for background/habits (ero, avevo, lavoravo = 'I was / had / used to work') and the 'passato prossimo' for events (sono arrivato, ho deciso = 'I arrived / decided'). Remember: motion/change verbs (andare, arrivare, partire) take 'essere' and must agree in gender — 'sono arrivato' (m.) / 'sono arrivata' (f.).",
    tip_advice_vi: "Dựng khung 5 nhịp: mở đầu (Quando sono arrivato…) → bối cảnh (All'inizio avevo paura) → vấn đề (Il problema era che…) → hành động (Ho deciso di…) → kết quả/bài học (Alla fine ho capito che…). Mỗi câu nối bằng một liên từ: poi, dopo, però, quindi.",
    tip_advice_en: "Build a 5-beat frame: opener (Quando sono arrivato…) → background (All'inizio avevo paura) → problem (Il problema era che…) → action (Ho deciso di…) → result/lesson (Alla fine ho capito che…). Glue each step with one connector: poi, dopo, però, quindi.",
    vocabulary: [
      { cell_id: "9c51a5c6-9127-45a9-b77e-ac7e8e6d3b3d", word: "quando", en: "when", vi: "khi", pos: "cong.", pronunciation_vi: "QUAN-đô", pronunciation_en: "KWAHN-doh — 'qu' = 'kw'; opens a time clause" },
      { cell_id: "a8c942c3-89e3-4c64-a4d3-3a52956b51f7", word: "all'inizio", en: "at first", vi: "ban đầu", pos: "espr.", pronunciation_vi: "al-li-NI-DZI-ô", pronunciation_en: "al-lee-NEE-tsyoh — double-l held; 'z' is 'ts'" },
      { cell_id: "0ce61a3e-178d-46fc-8975-437bed85b06a", word: "prima", en: "before", vi: "trước đây", pos: "avv.", pronunciation_vi: "PRI-ma", pronunciation_en: "PREE-mah — often pairs with imperfetto: 'prima lavoravo…'" },
      { cell_id: "c0c17e74-40f2-40c6-b7cc-f7bdc5c8af61", word: "poi", en: "then", vi: "rồi, sau đó", pos: "avv.", pronunciation_vi: "pôi", pronunciation_en: "poy — single syllable; sequences events" },
      { cell_id: "c55cc9f2-8fbd-4767-a308-35259d152998", word: "dopo", en: "after", vi: "sau", pos: "avv./prep.", pronunciation_vi: "ĐÔ-pô", pronunciation_en: "DOH-poh — 'dopo alcuni mesi' = after a few months" },
      { cell_id: "e355623b-c644-4bfa-bf08-4ccb3b190f75", word: "alla fine", en: "in the end", vi: "cuối cùng", pos: "espr.", pronunciation_vi: "al-la FI-nê", pronunciation_en: "AL-lah FEE-neh — closes the story" },
      { cell_id: "9164adad-d64c-475c-b8b7-2880ebd2b58a", word: "decidere", en: "to decide", vi: "quyết định", pos: "v.", pronunciation_vi: "đê-CI-đê-rê", pronunciation_en: "deh-CHEE-deh-reh — 'ho deciso di…' = I decided to…; takes 'di' + infinitive" },
      { cell_id: "74cb464d-2bc9-4ffb-84b8-5402822b4eba", word: "capire", en: "to understand", vi: "hiểu", pos: "v.", pronunciation_vi: "ca-PI-rê", pronunciation_en: "kah-PEE-reh — 'ho capito che…' = I understood that…" },
      { cell_id: "4f4e8981-53ad-496a-977e-64b845c0c7f4", word: "rendersi conto", en: "to realize", vi: "nhận ra", pos: "v.", pronunciation_vi: "REN-đer-xi CON-tô", pronunciation_en: "REN-der-see KOHN-toh — 'mi sono reso/a conto che…' = I realized that…" },
      { cell_id: "f83ed94d-1400-4628-bcb4-3b73cab2633b", word: "migliorare", en: "to improve", vi: "tiến bộ, cải thiện", pos: "v.", pronunciation_vi: "mi-li-ô-RA-rê", pronunciation_en: "mee-lyoh-RAH-reh — 'gli' soft 'ly'; stress 'RAH'" },
    ],
    dialogue: [
      { cell_id: "fd28d5ea-2533-45fa-acd6-2339d36ddcef", speaker: "A", text: "Com'è stato il tuo primo mese in Italia?", en: "How was your first month in Italy?", vi: "Tháng đầu ở Ý của bạn thế nào?" },
      { cell_id: "195cb32c-f82c-4cb3-9f60-5c2834be1509", speaker: "B", text: "All'inizio avevo paura, non capivo niente.", en: "At first I was afraid, I didn't understand anything.", vi: "Ban đầu mình sợ, chẳng hiểu gì." },
      { cell_id: "de06d9d4-849a-4a88-a551-b83bb6b79a84", speaker: "A", text: "E poi cosa hai fatto?", en: "And then what did you do?", vi: "Rồi bạn làm gì?" },
      { cell_id: "33b40793-9e69-4dae-9d43-e20a5029b5db", speaker: "B", text: "Ho deciso di studiare ogni giorno, e alla fine sono migliorato molto.", en: "I decided to study every day, and in the end I improved a lot.", vi: "Mình quyết định học mỗi ngày, và cuối cùng tiến bộ nhiều." },
    ],
    exercises: [
      { type: "fill-blank", question: "Quando ___ arrivato in Italia, avevo paura.", answer: "sono", hint_vi: "trợ động từ cho 'arrivare' — dùng 'essere', không phải 'avere'", hint_en: "the auxiliary for 'arrivare' is 'essere' → 'sono arrivato', not 'ho arrivato'" },
      { type: "matching", pairs: [["all'inizio", "ban đầu (at first)"], ["alla fine", "cuối cùng (in the end)"], ["decidere", "quyết định (to decide)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Trước đây tôi làm việc ở kho, rồi tôi đổi nghề.", english: "Before, I worked in a warehouse, then I changed jobs.", italian: "Prima lavoravo in magazzino, poi ho cambiato lavoro." },
    ],
  },
  {
    id: "italian_admin_residency",
    level: "B1",
    category: "life_admin",
    title_vi: "Cơ quan hành chính và cư trú",
    title_en: "Public office and residency",
    sentences: [
      {
        en: "I need to update my residency.",
        vi: "Tôi cần cập nhật cư trú.",
        pronunciation_focus: [
          "aggiornare→at-giôr-NA-rê",
          "residenza→rê-xi-ĐEN-dza",
        ],
        pronunciation_focus_en: [
          "aggiornare → 'ad-johr-NAH-reh' — double-g is a held 'dj'; -gior is 'johr'",
          "residenza → 'reh-zee-DEN-tsah' — s→'z' between vowels; final -za is 'tsah'",
        ],
      },
      {
        en: "My permit expires in July.",
        vi: "Giấy phép của tôi hết hạn vào tháng Bảy.",
        pronunciation_focus: [
          "permesso→per-MÉS-xô",
          "scade→XCA-đê",
        ],
        pronunciation_focus_en: [
          "permesso → 'per-MES-soh' — hold the double-s; one tapped r",
          "scade → 'SKAH-deh' — 'sc' before a is 'sk'; final -e voiced",
        ],
      },
      {
        en: "Which documents are needed?",
        vi: "Cần những giấy tờ nào?",
        pronunciation_focus: [
          "quali→QUA-li",
          "documenti→đô-cu-MEN-ti",
        ],
        pronunciation_focus_en: [
          "quali → 'KWAH-lee' — 'qu' = 'kw'; plural of 'quale'",
          "documenti → 'doh-koo-MEN-tee' — final -i marks the plural (one documento, due documenti)",
        ],
      },
      {
        en: "The application was rejected. I'd like to understand what is missing.",
        vi: "Đơn bị từ chối. Tôi muốn hiểu thiếu gì.",
        pronunciation_focus: [
          "respinta→ré-XPIN-ta",
          "manca→MAN-ca",
        ],
        pronunciation_focus_en: [
          "respinta → 'res-PEEN-tah' — feminine past participle agreeing with 'la domanda'",
          "manca → 'MAHN-kah' — 'ca' is hard 'kah'; 'cosa manca?' = what's missing?",
        ],
      },
      {
        en: "So I have to bring these documents?",
        vi: "Vậy tôi phải mang những giấy tờ này?",
        pronunciation_focus: [
          "quindi→QUIN-đi",
          "portare→por-TA-rê",
        ],
        pronunciation_focus_en: [
          "quindi → 'KWEEN-dee' — used here to confirm/recap ('so…?')",
          "portare → 'por-TAH-reh' — tapped r; 'devo portare' = I have to bring",
        ],
      },
    ],
    cultural_notes_vi: "Ở Ý, thủ tục giấy tờ rất quan trọng và thường cần đặt lịch hẹn (appuntamento) tại Comune (UBND xã/phường) hoặc Questura (sở cảnh sát, cho permesso di soggiorno). Luôn mang bản gốc + bản photocopy. Người làm việc ở quầy thường nói nhanh — đừng ngại nhờ 'Può ripetere, per favore?' (Nhắc lại giúp ạ?). Lưu ý lỗi giới từ: 'Vivo in Italia' (không phải 'a Italia'), nhưng 'Vado a Roma' (tên thành phố dùng 'a').",
    cultural_notes_en: "In Italy, paperwork is serious and usually needs a booked appointment (appuntamento) at the Comune (town hall) or the Questura (police HQ, for the permesso di soggiorno). Always bring originals plus photocopies. Counter staff often speak fast — don't hesitate to ask 'Può ripetere, per favore?' (Could you repeat, please?). Preposition trap: 'Vivo in Italia' (not 'a Italia'), but 'Vado a Roma' (cities take 'a').",
    tip_advice_vi: "Mở đầu lịch sự với 'Buongiorno, vorrei…' rồi nêu việc. Câu vàng khi không rõ: 'Quali documenti servono?' (Cần giấy tờ nào?) và 'Quindi devo portare questi documenti?' (Vậy tôi phải mang giấy này?). Ghi lại ngày hết hạn — 'la scadenza' — vào điện thoại.",
    tip_advice_en: "Open politely with 'Buongiorno, vorrei…' then state your business. Two gold-standard questions when unsure: 'Quali documenti servono?' (Which documents are needed?) and 'Quindi devo portare questi documenti?' (So I have to bring these documents?). Save the expiry date — 'la scadenza' — in your phone.",
    vocabulary: [
      { cell_id: "a8f3b94d-8cc3-4a66-ad06-1a4fef29d164", word: "la residenza", en: "residency", vi: "nơi cư trú", pos: "n.f.", pronunciation_vi: "la rê-xi-ĐEN-dza", pronunciation_en: "lah reh-zee-DEN-tsah — official registered address" },
      { cell_id: "5a46de99-22a1-48de-b4d0-07f82c4dfd38", word: "il permesso di soggiorno", en: "residence permit", vi: "giấy phép cư trú", pos: "n.m.", pronunciation_vi: "il per-MÉS-xô đi xôt-GIOR-nô", pronunciation_en: "eel per-MES-soh dee sod-JOR-noh — the key immigration document" },
      { cell_id: "cf208f17-2bbb-48c9-ab92-b730eaff1f10", word: "il documento", en: "document", vi: "giấy tờ", pos: "n.m.", pronunciation_vi: "il đô-cu-MEN-tô", pronunciation_en: "eel doh-koo-MEN-toh — plural 'documenti'" },
      { cell_id: "0cbac490-bc16-4fae-a2e8-27aecd2197e3", word: "la domanda", en: "application / request", vi: "đơn", pos: "n.f.", pronunciation_vi: "la đô-MAN-đa", pronunciation_en: "lah doh-MAHN-dah — 'fare domanda' = to apply; also means 'question'" },
      { cell_id: "41670d50-dd8f-4d97-8190-95743b7fdcfd", word: "la scadenza", en: "deadline / expiry", vi: "hạn chót", pos: "n.f.", pronunciation_vi: "la xca-ĐEN-dza", pronunciation_en: "lah skah-DEN-tsah — 'scade' = it expires" },
      { cell_id: "4ed6b0e1-caaf-49a6-85f4-728a09f4a7b4", word: "aggiornare", en: "to update", vi: "cập nhật", pos: "v.", pronunciation_vi: "at-giôr-NA-rê", pronunciation_en: "ad-johr-NAH-reh — double-g held 'dj'" },
      { cell_id: "c88be508-d0f5-45f6-9ccb-226e77d97345", word: "servire", en: "to be needed", vi: "cần", pos: "v.", pronunciation_vi: "xer-VI-rê", pronunciation_en: "ser-VEE-reh — 'cosa serve?' = what's needed?" },
      { cell_id: "23cd479a-43a0-4ea3-9c77-a2c4bb00c479", word: "compilare il modulo", en: "to fill in the form", vi: "điền mẫu", pos: "v.", pronunciation_vi: "côm-pi-LA-rê il MÔ-đu-lô", pronunciation_en: "kom-pee-LAH-reh eel MOH-doo-loh — 'modulo' = form, stress first syllable" },
      { cell_id: "30467d21-c37a-4d21-bb7e-b997a7c5174d", word: "l'appuntamento", en: "appointment", vi: "lịch hẹn", pos: "n.m.", pronunciation_vi: "láp-pun-ta-MEN-tô", pronunciation_en: "lap-poon-tah-MEN-toh — double-p held; 'ho un appuntamento'" },
      { cell_id: "b41544d6-9bd3-453e-980d-4b4bbf7f9533", word: "il Comune", en: "town hall", vi: "ủy ban xã/phường", pos: "n.m.", pronunciation_vi: "il cô-MU-nê", pronunciation_en: "eel koh-MOO-neh — the municipal office for residency, certificates" },
    ],
    dialogue: [
      { cell_id: "cfb02fed-a475-4294-8886-13eb7bc350e5", speaker: "A", text: "Buongiorno, vorrei aggiornare la residenza.", en: "Good morning, I'd like to update my residency.", vi: "Chào anh/chị, tôi muốn cập nhật cư trú." },
      { cell_id: "1cc27cc0-04ed-46fc-ac38-0c7617b5942a", speaker: "B", text: "Va bene. Ha portato i documenti?", en: "All right. Did you bring the documents?", vi: "Được. Anh/chị mang giấy tờ chưa?" },
      { cell_id: "95212480-c4e6-45be-a830-6eb6bfec24a4", speaker: "A", text: "Quali documenti servono esattamente?", en: "Which documents are needed exactly?", vi: "Cần chính xác giấy tờ nào ạ?" },
      { cell_id: "c3f1499e-3eb9-42b5-b4cb-831c6a9a8e65", speaker: "B", text: "Carta d'identità, contratto d'affitto e una marca da bollo.", en: "ID card, rental contract and a tax stamp.", vi: "Thẻ căn cước, hợp đồng thuê nhà và một tem thuế." },
    ],
    exercises: [
      { type: "fill-blank", question: "Il permesso ___ a luglio.", answer: "scade", hint_vi: "động từ nghĩa 'hết hạn', chia ngôi thứ 3 số ít", hint_en: "verb meaning 'expires', 3rd-person singular (il permesso scade)" },
      { type: "matching", pairs: [["la residenza", "nơi cư trú (residency)"], ["la scadenza", "hạn chót (deadline)"], ["l'appuntamento", "lịch hẹn (appointment)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi muốn hiểu giấy tờ nào còn thiếu.", english: "I'd like to understand which documents are missing.", italian: "Vorrei capire quali documenti mancano." },
    ],
  },
  {
    id: "italian_house_landlord",
    level: "B1",
    category: "house",
    title_vi: "Vấn đề nhà thuê và chủ nhà",
    title_en: "Housing problems and the landlord",
    sentences: [
      {
        en: "I'm reporting a water leak.",
        vi: "Tôi báo một chỗ rò nước.",
        pronunciation_focus: [
          "segnalo→xê-NHA-lô",
          "perdita→PER-đi-ta",
        ],
        pronunciation_focus_en: [
          "segnalo → 'seh-NYAH-loh' — 'gn' is the Vietnamese 'nh' sound (≈ canyon)",
          "perdita → 'PER-dee-tah' — stress the FIRST syllable, not the middle",
        ],
      },
      {
        en: "It's been happening since last night.",
        vi: "Nó xảy ra từ tối qua.",
        pronunciation_focus: [
          "succede→xut-CHE-đê",
          "da ieri→đa I-ê-ri",
        ],
        pronunciation_focus_en: [
          "succede → 'soot-CHEH-deh' — double-c before e is 't-cheh' (held then 'cheh')",
          "da ieri sera → 'dah YEH-ree SEH-rah' — 'da' marks 'since'; 'ieri' is 'YEH-ree'",
        ],
      },
      {
        en: "Could you send a technician?",
        vi: "Anh/chị gửi kỹ thuật viên được không?",
        pronunciation_focus: [
          "potrebbe→pô-TRÉB-bê",
          "tecnico→TEC-ni-cô",
        ],
        pronunciation_focus_en: [
          "potrebbe → 'poh-TREB-beh' — conditional, very polite; hold the double-b",
          "tecnico → 'TEK-nee-koh' — stress the first syllable; both c's are hard 'k'",
        ],
      },
      {
        en: "I understand, but the problem remains.",
        vi: "Tôi hiểu, nhưng vấn đề vẫn còn.",
        pronunciation_focus: [
          "capisco→ca-PI-xcô",
          "resta→RÉ-xta",
        ],
        pronunciation_focus_en: [
          "capisco → 'kah-PEES-koh' — 'sc' before o is 'sk'; stress 'PEES'",
          "resta → 'RES-tah' — 'il problema resta' = the problem remains/stays",
        ],
      },
      {
        en: "I'd like to find a solution.",
        vi: "Tôi muốn tìm một giải pháp.",
        pronunciation_focus: [
          "vorrei→vôr-RÊI",
          "soluzione→xô-lu-DZI-ô-nê",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — hold the double-r; the polite 'I would like'",
          "soluzione → 'soh-loo-TSYOH-neh' — -zione is 'tsyoh-neh', never English '-shun'",
        ],
      },
    ],
    cultural_notes_vi: "Khi báo hỏng hóc cho chủ nhà (il padrone di casa / il proprietario), người Ý bắt đầu bằng SỰ KIỆN, không bằng lời than phiền: 'Le segnalo una perdita d'acqua' (Tôi báo anh/chị một chỗ rò nước). Dùng 'Le' (lịch sự, ngôi 'Lei') với chủ nhà, không dùng 'ti'. Hợp đồng thuê (il contratto d'affitto) và tiền cọc (la caparra) nên có giấy tờ rõ ràng.",
    cultural_notes_en: "When reporting a fault to a landlord (il padrone di casa / il proprietario), Italians lead with the FACT, not a complaint: 'Le segnalo una perdita d'acqua' (I'm reporting a water leak to you). Use the polite 'Le' (the formal 'Lei' form) with a landlord, not 'ti'. Keep the rental contract (il contratto d'affitto) and deposit (la caparra) documented in writing.",
    tip_advice_vi: "Tránh câu cộc lốc 'C'è problema acqua' — nói cả câu: 'C'è una perdita d'acqua in bagno'. Yêu cầu lịch sự bằng thể điều kiện: 'Potrebbe mandare un tecnico?' thay vì 'Manda un tecnico'. Nếu chưa được giải quyết, nhấn nhẹ: 'Capisco, però il problema resta'.",
    tip_advice_en: "Avoid clipped fragments like 'C'è problema acqua' — say the full clause: 'C'è una perdita d'acqua in bagno'. Make requests in the conditional: 'Potrebbe mandare un tecnico?' rather than the bossy 'Manda un tecnico'. If it's still unresolved, press gently: 'Capisco, però il problema resta'.",
    vocabulary: [
      { cell_id: "0c5f654d-b75d-400b-ae9b-901552c8508a", word: "il proprietario", en: "landlord / owner", vi: "chủ nhà", pos: "n.m.", pronunciation_vi: "il prô-pri-ê-TA-ri-ô", pronunciation_en: "eel proh-pryeh-TAH-ryoh — also 'il padrone di casa'" },
      { cell_id: "f9c2c8b9-d896-423f-b9d3-9635f90b117d", word: "il contratto d'affitto", en: "rental contract", vi: "hợp đồng thuê nhà", pos: "n.m.", pronunciation_vi: "il côn-TRÁT-tô đáf-FIT-tô", pronunciation_en: "eel kon-TRAHT-toh daf-FEET-toh — two held double-t's" },
      { cell_id: "2bb1867a-09f5-4ce9-aa59-6abe58983cd0", word: "la perdita d'acqua", en: "water leak", vi: "rò nước", pos: "n.f.", pronunciation_vi: "la PER-đi-ta ĐAC-qua", pronunciation_en: "lah PER-dee-tah DAHK-kwah — 'acqua' has a hard 'kw'" },
      { cell_id: "bff5d49e-445a-40c5-b931-1fc666b45ca4", word: "segnalare", en: "to report (a fault)", vi: "báo (sự cố)", pos: "v.", pronunciation_vi: "xê-nha-LA-rê", pronunciation_en: "seh-nyah-LAH-reh — 'gn' = 'nh'; 'Le segnalo…' = I'm reporting to you" },
      { cell_id: "436d3ce7-8c66-4821-89c0-88dcaa3a2be0", word: "il tecnico", en: "technician", vi: "kỹ thuật viên", pos: "n.m.", pronunciation_vi: "il TEC-ni-cô", pronunciation_en: "eel TEK-nee-koh — stress first syllable" },
      { cell_id: "2a4760a4-5157-4b8a-aed6-fe572cae754c", word: "riparare", en: "to repair", vi: "sửa", pos: "v.", pronunciation_vi: "ri-pa-RA-rê", pronunciation_en: "ree-pah-RAH-reh — 'la riparazione' = the repair" },
      { cell_id: "6e7ea80c-f68d-4197-98f2-ae2fac405277", word: "la caparra", en: "deposit", vi: "tiền cọc", pos: "n.f.", pronunciation_vi: "la ca-PÁR-ra", pronunciation_en: "lah kah-PAHR-rah — hold the double-r" },
      { cell_id: "635ae2bd-3e95-440f-b94c-cecd889f370e", word: "l'affitto", en: "rent", vi: "tiền thuê", pos: "n.m.", pronunciation_vi: "láf-FIT-tô", pronunciation_en: "laf-FEET-toh — double-f and double-t both held" },
      { cell_id: "aaa14b92-8911-40a2-892c-22fcc16130f0", word: "il bagno", en: "bathroom", vi: "phòng tắm", pos: "n.m.", pronunciation_vi: "il BA-nhô", pronunciation_en: "eel BAH-nyoh — 'gn' = 'nh'" },
      { cell_id: "b2607981-ed6b-4602-ba23-4376c11acdb7", word: "la soluzione", en: "solution", vi: "giải pháp", pos: "n.f.", pronunciation_vi: "la xô-lu-DZI-ô-nê", pronunciation_en: "lah soh-loo-TSYOH-neh — -zione = 'tsyoh-neh'" },
    ],
    dialogue: [
      { cell_id: "6f988dce-ab73-47dc-9a61-3cd548a41544", speaker: "A", text: "Buonasera, Le segnalo una perdita d'acqua in bagno.", en: "Good evening, I'm reporting a water leak in the bathroom.", vi: "Chào buổi tối, tôi báo anh/chị một chỗ rò nước trong phòng tắm." },
      { cell_id: "1f78ad34-a9a0-4298-b30a-729bae1099c5", speaker: "B", text: "Da quando succede?", en: "Since when has it been happening?", vi: "Bị từ khi nào vậy?" },
      { cell_id: "40af3ced-1f2f-4c89-ae4a-ab3a55248f3b", speaker: "A", text: "Da ieri sera. Potrebbe mandare un tecnico?", en: "Since last night. Could you send a technician?", vi: "Từ tối qua. Anh/chị gửi kỹ thuật viên được không?" },
      { cell_id: "d0e4bc01-45e3-4d89-bbd2-323c95906cce", speaker: "B", text: "Va bene, mando qualcuno domani mattina.", en: "All right, I'll send someone tomorrow morning.", vi: "Được, mai sáng tôi cho người tới." },
    ],
    exercises: [
      { type: "fill-blank", question: "Le ___ una perdita d'acqua in cucina.", answer: "segnalo", hint_vi: "động từ 'báo sự cố', ngôi 'io' (tôi)", hint_en: "verb 'to report a fault', 'io' form (Le segnalo…)" },
      { type: "matching", pairs: [["il proprietario", "chủ nhà (landlord)"], ["la caparra", "tiền cọc (deposit)"], ["riparare", "sửa (to repair)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi hiểu, nhưng vấn đề vẫn còn và tôi muốn một giải pháp.", english: "I understand, but the problem remains and I'd like a solution.", italian: "Capisco, però il problema resta e vorrei una soluzione." },
    ],
  },
  {
    id: "italian_work_communication",
    level: "B1",
    category: "work",
    title_vi: "Giao tiếp tại nơi làm việc",
    title_en: "Workplace communication",
    sentences: [
      {
        en: "I'd like to clarify the procedure.",
        vi: "Tôi muốn làm rõ quy trình.",
        pronunciation_focus: [
          "chiarire→ki-a-RI-rê",
          "procedura→prô-cê-ĐU-ra",
        ],
        pronunciation_focus_en: [
          "chiarire → 'kyah-REE-reh' — 'chi' is a hard 'ky', never English 'ch'",
          "procedura → 'proh-cheh-DOO-rah' — 'ce' is soft 'cheh'; stress 'DOO'",
        ],
      },
      {
        en: "I think there's been a misunderstanding.",
        vi: "Tôi nghĩ đã có hiểu lầm.",
        pronunciation_focus: [
          "credo→CRÊ-đô",
          "malinteso→ma-lin-TÊ-dô",
        ],
        pronunciation_focus_en: [
          "credo → 'KREH-doh' — 'credo che ci sia…' softens a complaint",
          "malinteso → 'mah-leen-TEH-zoh' — s→'z' between vowels; a face-saving word",
        ],
      },
      {
        en: "I see a possible risk.",
        vi: "Tôi thấy một rủi ro có thể xảy ra.",
        pronunciation_focus: [
          "rischio→RI-xki-ô",
          "possibile→pôs-XI-bi-lê",
        ],
        pronunciation_focus_en: [
          "rischio → 'REES-kyoh' — 'schi' is 'skyoh'; tapped r at the start",
          "possibile → 'pos-SEE-bee-leh' — hold the double-s; stress 'SEE'",
        ],
      },
      {
        en: "Maybe it's better to talk to the supervisor.",
        vi: "Có lẽ nên nói với người phụ trách.",
        pronunciation_focus: [
          "forse→FOR-xê",
          "responsabile→ré-xpon-XA-bi-lê",
        ],
        pronunciation_focus_en: [
          "forse → 'FOR-seh' — 'maybe'; the soft opener for suggestions",
          "responsabile → 'res-pon-SAH-bee-leh' — the person in charge; stress 'SAH'",
        ],
      },
      {
        en: "I can work shifts and I'm reliable.",
        vi: "Tôi có thể làm theo ca và tôi đáng tin.",
        pronunciation_focus: [
          "turni→TUR-ni",
          "affidabile→af-fi-ĐA-bi-lê",
        ],
        pronunciation_focus_en: [
          "su turni → 'soo TOOR-nee' — 'su turni' (not 'in turni') = on shifts",
          "affidabile → 'af-fee-DAH-bee-leh' — hold the double-f; stress 'DAH'",
        ],
      },
    ],
    cultural_notes_vi: "Ở công sở Ý, dùng ngôi lịch sự 'Lei' với cấp trên và đồng nghiệp mới; chuyển sang 'tu' khi được mời ('Diamoci del tu'). Khi có lỗi, người Ý giữ thể diện bằng cách nói 'Credo ci sia stato un malinteso' (Tôi nghĩ có hiểu lầm) thay vì đổ lỗi 'È colpa tua' (Lỗi tại bạn). An toàn lao động (la sicurezza) được coi trọng — nêu rủi ro được đánh giá cao, không bị xem là phàn nàn.",
    cultural_notes_en: "In an Italian workplace, use the polite 'Lei' with bosses and new colleagues; switch to 'tu' only when invited ('Diamoci del tu'). When something goes wrong, Italians save face with 'Credo ci sia stato un malinteso' (I think there's been a misunderstanding) rather than the accusatory 'È colpa tua' (it's your fault). Workplace safety (la sicurezza) is taken seriously — flagging a risk is respected, not seen as complaining.",
    tip_advice_vi: "Diễn đạt vấn đề một cách hợp tác: 'Forse è meglio parlarne con il responsabile' (Có lẽ nên bàn với người phụ trách). Khi nhận việc, dùng câu chắc chắn: 'Posso lavorare su turni', 'Sono puntuale e affidabile'. Tránh dịch sát 'in turni' — đúng là 'su turni'.",
    tip_advice_en: "Frame problems collaboratively: 'Forse è meglio parlarne con il responsabile' (Maybe it's better to discuss it with the supervisor). When taking on work, use confident set phrases: 'Posso lavorare su turni', 'Sono puntuale e affidabile'. Avoid the literal 'in turni' — the correct collocation is 'su turni'.",
    vocabulary: [
      { cell_id: "58059f63-ebce-441a-ba87-2d76b3785690", word: "la procedura", en: "procedure", vi: "quy trình", pos: "n.f.", pronunciation_vi: "la prô-cê-ĐU-ra", pronunciation_en: "lah proh-cheh-DOO-rah — 'ce' is soft 'cheh'" },
      { cell_id: "a7229307-3202-4e61-9ac2-805bfdc30521", word: "il malinteso", en: "misunderstanding", vi: "hiểu lầm", pos: "n.m.", pronunciation_vi: "il ma-lin-TÊ-dô", pronunciation_en: "eel mah-leen-TEH-zoh — the polite face-saving word" },
      { cell_id: "282b87db-8b04-4786-99bd-598cc8c40aae", word: "il rischio", en: "risk", vi: "rủi ro", pos: "n.m.", pronunciation_vi: "il RI-xki-ô", pronunciation_en: "eel REES-kyoh — 'schi' = 'skyoh'" },
      { cell_id: "0c01294a-37e5-484f-9973-5bc21231430a", word: "la sicurezza", en: "safety", vi: "an toàn", pos: "n.f.", pronunciation_vi: "la xi-cu-RÉT-tsa", pronunciation_en: "lah see-koo-RET-tsah — double-z is held 'tts'" },
      { cell_id: "2987117d-1203-4149-9ecf-a0d10c751127", word: "il responsabile", en: "supervisor / person in charge", vi: "người phụ trách", pos: "n.m.", pronunciation_vi: "il ré-xpon-XA-bi-lê", pronunciation_en: "eel res-pon-SAH-bee-leh — stress 'SAH'" },
      { cell_id: "563b76b7-03b1-489e-93b7-b5a91ff844dd", word: "il turno", en: "shift", vi: "ca làm", pos: "n.m.", pronunciation_vi: "il TUR-nô", pronunciation_en: "eel TOOR-noh — 'lavorare su turni' = to work shifts" },
      { cell_id: "6cc7edcd-4fb3-47eb-937e-b725aec1601f", word: "la mansione", en: "task / job duty", vi: "nhiệm vụ", pos: "n.f.", pronunciation_vi: "la man-XI-ô-nê", pronunciation_en: "lah man-SYOH-neh — -sione = 'syoh-neh'" },
      { cell_id: "308822b8-74a2-4ef3-94f4-38e72bbb9d93", word: "affidabile", en: "reliable", vi: "đáng tin", pos: "agg.", pronunciation_vi: "af-fi-ĐA-bi-lê", pronunciation_en: "af-fee-DAH-bee-leh — hold the double-f" },
      { cell_id: "5bf0ca3b-3e13-489d-add8-a93fecac7214", word: "puntuale", en: "punctual", vi: "đúng giờ", pos: "agg.", pronunciation_vi: "pun-tu-A-lê", pronunciation_en: "poon-too-AH-leh — four syllables, stress 'AH'" },
      { cell_id: "7acf204f-2ea1-400f-92b1-6aa34d26cf6a", word: "chiarire", en: "to clarify", vi: "làm rõ", pos: "v.", pronunciation_vi: "ki-a-RI-rê", pronunciation_en: "kyah-REE-reh — 'chi' is hard 'ky'" },
    ],
    dialogue: [
      { cell_id: "20702d0f-7a46-477d-8a23-0b93a566d379", speaker: "A", text: "Scusi, vorrei chiarire la procedura per gli ordini.", en: "Excuse me, I'd like to clarify the procedure for the orders.", vi: "Xin lỗi, tôi muốn làm rõ quy trình cho đơn hàng." },
      { cell_id: "55eb181d-6573-4f5a-bbed-6d6736f0ebdd", speaker: "B", text: "Certo. Cosa non è chiaro?", en: "Of course. What isn't clear?", vi: "Được chứ. Chỗ nào chưa rõ?" },
      { cell_id: "5bac7586-7c52-4619-b2ef-c8bf083697be", speaker: "A", text: "Credo ci sia stato un malinteso sul turno di domani.", en: "I think there's been a misunderstanding about tomorrow's shift.", vi: "Tôi nghĩ có hiểu lầm về ca ngày mai." },
      { cell_id: "c5025595-540a-4442-9556-5f574b928ad9", speaker: "B", text: "Hai ragione, parliamone con il responsabile.", en: "You're right, let's discuss it with the supervisor.", vi: "Bạn nói đúng, mình bàn với người phụ trách nhé." },
    ],
    exercises: [
      { type: "fill-blank", question: "Posso lavorare ___ turni, sono affidabile.", answer: "su", hint_vi: "giới từ đi với 'turni' — KHÔNG dùng 'in'", hint_en: "the preposition that collocates with 'turni' — it's 'su', not 'in'" },
      { type: "matching", pairs: [["il malinteso", "hiểu lầm (misunderstanding)"], ["la sicurezza", "an toàn (safety)"], ["affidabile", "đáng tin (reliable)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi thấy một rủi ro, có lẽ nên nói với người phụ trách.", english: "I see a risk; maybe it's better to talk to the supervisor.", italian: "Vedo un rischio, forse è meglio parlarne con il responsabile." },
    ],
  },
  {
    id: "italian_health_doctor",
    level: "B1",
    category: "health",
    title_vi: "Đi khám bác sĩ",
    title_en: "At the doctor",
    sentences: [
      {
        en: "I've had a backache for three days.",
        vi: "Tôi đau lưng ba ngày nay.",
        pronunciation_focus: [
          "mal di schiena→man đi XKI-ê-na",
          "da tre giorni→đa trê GIOR-ni",
        ],
        pronunciation_focus_en: [
          "mal di schiena → 'mahl dee SKYEH-nah' — 'schi' is 'sky'; 'mal di' + body part = ache",
          "da tre giorni → 'dah treh JOR-nee' — 'da' = 'for/since' with a time span",
        ],
      },
      {
        en: "I have a fever and a sore throat.",
        vi: "Tôi bị sốt và đau họng.",
        pronunciation_focus: [
          "la febbre→la FÉB-brê",
          "mal di gola→man đi GÔ-la",
        ],
        pronunciation_focus_en: [
          "la febbre → 'lah FEB-breh' — note the article: 'ho LA febbre', not 'ho febbre'; hold double-b",
          "mal di gola → 'mahl dee GOH-lah' — 'gola' = throat; 'g' before o is hard",
        ],
      },
      {
        en: "My chest hurts when I breathe.",
        vi: "Tôi đau ngực khi thở.",
        pronunciation_focus: [
          "mi fa male→mi fa MA-lê",
          "il petto→il PÉT-tô",
        ],
        pronunciation_focus_en: [
          "mi fa male → 'mee fah MAH-leh' — literally 'it makes me pain'; the natural way to say 'it hurts'",
          "il petto → 'eel PET-toh' — hold the double-t; 'petto' = chest",
        ],
      },
      {
        en: "Can you prescribe me a medicine?",
        vi: "Bác sĩ kê thuốc cho tôi được không?",
        pronunciation_focus: [
          "prescrivere→pré-XCRI-vê-rê",
          "medicina→mê-đi-CI-na",
        ],
        pronunciation_focus_en: [
          "prescrivere → 'pres-KREE-veh-reh' — 'scr' is 'skr'; stress 'KREE'",
          "medicina → 'meh-dee-CHEE-nah' — 'ci' is soft 'chee'; stress 'CHEE'",
        ],
      },
      {
        en: "Where is the nearest pharmacy?",
        vi: "Hiệu thuốc gần nhất ở đâu?",
        pronunciation_focus: [
          "farmacia→far-ma-CI-a",
          "più vicina→pi-U vi-CI-na",
        ],
        pronunciation_focus_en: [
          "farmacia → 'far-mah-CHEE-ah' — 'cia' here is 'CHEE-ah', stress on 'CHEE'",
          "più vicina → 'pyoo vee-CHEE-nah' — 'più' is one syllable 'pyoo'; 'vicina' = near (f.)",
        ],
      },
    ],
    cultural_notes_vi: "Ở Ý có y tế công (il Servizio Sanitario Nazionale). Bạn cần đăng ký bác sĩ gia đình (il medico di base / medico di famiglia) tại ASL địa phương — bác sĩ này khám miễn phí và viết đơn thuốc (la ricetta). Hiệu thuốc (la farmacia) bán nhiều thuốc cần đơn. Cấp cứu gọi 112 hoặc đến Pronto Soccorso. Cấu trúc vàng để tả triệu chứng: 'Ho mal di + bộ phận' và 'Mi fa male + il/la + bộ phận'.",
    cultural_notes_en: "Italy has public healthcare (il Servizio Sanitario Nazionale). You register a family doctor (il medico di base / medico di famiglia) at your local ASL — visits are free and they write the prescription (la ricetta). The pharmacy (la farmacia) dispenses many prescription-only medicines. For emergencies dial 112 or go to Pronto Soccorso. Two gold structures for symptoms: 'Ho mal di + body part' and 'Mi fa male + il/la + body part'.",
    tip_advice_vi: "Tả thời gian bằng 'da': 'Ho mal di testa DA ieri' (Tôi đau đầu từ hôm qua). Đừng quên mạo từ với 'febbre': 'Ho LA febbre'. Để xin đơn thuốc lịch sự: 'Mi può prescrivere qualcosa?' (Bác sĩ kê gì cho tôi được không?). Học cặp 'Ho mal di…' (đau theo kiểu nhức) vs 'Mi fa male…' (chỗ đó đau khi chạm/cử động).",
    tip_advice_en: "Express duration with 'da': 'Ho mal di testa DA ieri' (I've had a headache since yesterday). Don't drop the article with 'febbre': 'Ho LA febbre'. To ask for a prescription politely: 'Mi può prescrivere qualcosa?' (Could you prescribe me something?). Learn the pair 'Ho mal di…' (a dull ache) vs 'Mi fa male…' (a specific part hurts on touch/movement).",
    vocabulary: [
      { cell_id: "49192abc-c052-4e16-86c5-8c223bd4697c", word: "il medico di base", en: "family doctor", vi: "bác sĩ gia đình", pos: "n.m.", pronunciation_vi: "il MÊ-đi-cô đi BA-dê", pronunciation_en: "eel MEH-dee-koh dee BAH-zeh — your registered GP" },
      { cell_id: "623253d2-d0f0-4183-b339-a004ecd04c00", word: "il sintomo", en: "symptom", vi: "triệu chứng", pos: "n.m.", pronunciation_vi: "il XIN-tô-mô", pronunciation_en: "eel SEEN-toh-moh — stress first syllable; plural 'sintomi'" },
      { cell_id: "d4afcad4-dc01-489f-836d-2ed0c01d8da9", word: "la febbre", en: "fever", vi: "sốt", pos: "n.f.", pronunciation_vi: "la FÉB-brê", pronunciation_en: "lah FEB-breh — 'ho la febbre'; hold the double-b" },
      { cell_id: "f49b50a1-452b-4296-8a6d-a33461d5ac83", word: "il dolore", en: "pain", vi: "cơn đau", pos: "n.m.", pronunciation_vi: "il đô-LÔ-rê", pronunciation_en: "eel doh-LOH-reh — stress 'LOH'" },
      { cell_id: "a7744155-7626-4392-a473-5e70b4763d08", word: "la ricetta", en: "prescription", vi: "đơn thuốc", pos: "n.f.", pronunciation_vi: "la ri-CHÉT-ta", pronunciation_en: "lah ree-CHET-tah — 'ce' soft 'cheh'; hold double-t. Also means 'recipe'!" },
      { cell_id: "da43af8f-15c4-46ad-b791-2ee7f02d01fa", word: "la medicina", en: "medicine", vi: "thuốc", pos: "n.f.", pronunciation_vi: "la mê-đi-CI-na", pronunciation_en: "lah meh-dee-CHEE-nah — also 'il farmaco'" },
      { cell_id: "03d4c52a-4d18-4b6a-866f-1d176a392fc4", word: "la farmacia", en: "pharmacy", vi: "hiệu thuốc", pos: "n.f.", pronunciation_vi: "la far-ma-CI-a", pronunciation_en: "lah far-mah-CHEE-ah — green-cross sign on the street" },
      { cell_id: "2d6f52ec-6064-4059-b4f7-3ec527c26327", word: "prescrivere", en: "to prescribe", vi: "kê (đơn)", pos: "v.", pronunciation_vi: "pré-XCRI-vê-rê", pronunciation_en: "pres-KREE-veh-reh — 'scr' = 'skr'" },
      { cell_id: "114ad8e7-187e-42ba-939f-f4aadf67e484", word: "il Pronto Soccorso", en: "A&E / emergency room", vi: "phòng cấp cứu", pos: "n.m.", pronunciation_vi: "il PRON-tô xôc-COR-xô", pronunciation_en: "eel PRON-toh sok-KOR-soh — hospital emergency unit" },
      { cell_id: "b002d94e-0e48-4c03-a85f-f43b27196055", word: "guarire", en: "to recover / heal", vi: "khỏi bệnh", pos: "v.", pronunciation_vi: "gua-RI-rê", pronunciation_en: "gwah-REE-reh — 'gu' is 'gw'; stress 'REE'" },
    ],
    dialogue: [
      { cell_id: "8a1376c7-a454-468c-b04c-a99b899d7c3b", speaker: "Medico", text: "Buongiorno, mi dica. Quali sintomi ha?", en: "Good morning, tell me. What symptoms do you have?", vi: "Chào anh/chị, nói tôi nghe. Anh/chị có triệu chứng gì?" },
      { cell_id: "42d0da2a-8585-42f6-9fe9-4826d40d84a7", speaker: "Paziente", text: "Da tre giorni ho mal di schiena e ho la febbre.", en: "For three days I've had a backache and a fever.", vi: "Ba ngày nay tôi đau lưng và bị sốt." },
      { cell_id: "56704b7f-ea05-41d7-894b-b8d480fb7552", speaker: "Medico", text: "Le prescrivo una medicina. La prenda due volte al giorno.", en: "I'll prescribe you a medicine. Take it twice a day.", vi: "Tôi kê thuốc cho anh/chị. Uống ngày hai lần." },
      { cell_id: "3c1e07de-727b-47f9-b611-98d8a12b4aeb", speaker: "Paziente", text: "Grazie. Dov'è la farmacia più vicina?", en: "Thank you. Where is the nearest pharmacy?", vi: "Cảm ơn. Hiệu thuốc gần nhất ở đâu ạ?" },
    ],
    exercises: [
      { type: "fill-blank", question: "Ho ___ di testa da ieri.", answer: "mal", hint_vi: "cấu trúc 'đau …': 'Ho ___ di + bộ phận'", hint_en: "the 'ache' structure: 'Ho ___ di + body part' (mal di testa)" },
      { type: "matching", pairs: [["la febbre", "sốt (fever)"], ["la ricetta", "đơn thuốc (prescription)"], ["la farmacia", "hiệu thuốc (pharmacy)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi đau họng từ hai ngày nay, bác sĩ kê thuốc cho tôi được không?", english: "I've had a sore throat for two days; could you prescribe me a medicine?", italian: "Ho mal di gola da due giorni, mi può prescrivere una medicina?" },
    ],
  },
  {
    id: "italian_work_interview",
    level: "B1",
    category: "work",
    title_vi: "Phỏng vấn xin việc",
    title_en: "Job interview",
    sentences: [
      {
        en: "Good morning, my name is Minh and I have experience in a warehouse.",
        vi: "Chào buổi sáng, tôi tên Minh và tôi có kinh nghiệm ở kho.",
        pronunciation_focus: [
          "mi chiamo→mi KI-a-mô",
          "esperienza→é-xpê-RI-en-dza",
        ],
        pronunciation_focus_en: [
          "mi chiamo → 'mee KYAH-moh' — 'chia' is 'kyah'; 'mi chiamo' = my name is",
          "esperienza → 'es-peh-RYEN-tsah' — 'rien' glides to 'ryen'; final -za is 'tsah'",
        ],
      },
      {
        en: "I'm punctual and reliable.",
        vi: "Tôi đúng giờ và đáng tin.",
        pronunciation_focus: [
          "puntuale→pun-tu-A-lê",
          "affidabile→af-fi-ĐA-bi-lê",
        ],
        pronunciation_focus_en: [
          "puntuale → 'poon-too-AH-leh' — keep all four vowels distinct",
          "affidabile → 'af-fee-DAH-bee-leh' — hold the double-f; stress 'DAH'",
        ],
      },
      {
        en: "I'm improving my Italian.",
        vi: "Tôi đang cải thiện tiếng Ý.",
        pronunciation_focus: [
          "sto migliorando→xtô mi-li-ô-RAN-đô",
          "italiano→i-ta-LI-a-nô",
        ],
        pronunciation_focus_en: [
          "sto migliorando → 'stoh mee-lyoh-RAHN-doh' — 'gli' soft 'ly'; 'sto + gerund' = I'm …ing",
          "italiano → 'ee-tah-LYAH-noh' — five syllables, stress 'LYAH'; don't reduce to 'italyan'",
        ],
      },
      {
        en: "I can work shifts and I'm available immediately.",
        vi: "Tôi có thể làm theo ca và sẵn sàng bắt đầu ngay.",
        pronunciation_focus: [
          "su turni→xu TUR-ni",
          "disponibile→đi-xpô-NI-bi-lê",
        ],
        pronunciation_focus_en: [
          "su turni → 'soo TOOR-nee' — 'su turni' = on shifts (not 'in turni')",
          "disponibile da subito → 'dee-spoh-NEE-bee-leh dah SOO-bee-toh' = available from right now",
        ],
      },
      {
        en: "In the future I'd like to grow professionally.",
        vi: "Trong tương lai tôi muốn phát triển nghề nghiệp.",
        pronunciation_focus: [
          "nel futuro→nel fu-TU-rô",
          "crescere→CRÊ-xê-rê",
        ],
        pronunciation_focus_en: [
          "nel futuro → 'nel foo-TOO-roh' — stress 'TOO'",
          "crescere → 'KREH-sheh-reh' — 'sce' is 'sheh'; here means 'to grow/develop'",
        ],
      },
    ],
    cultural_notes_vi: "Phỏng vấn ở Ý dùng ngôi lịch sự 'Lei'. Nhà tuyển dụng hỏi 'Mi parli di lei' (Hãy kể về anh/chị) và 'punti di forza e debolezza' (điểm mạnh, điểm yếu). Câu cố định rất được việc: 'Sono disponibile da subito' (Sẵn sàng ngay), 'Posso lavorare su turni'. Nên hỏi lại về hợp đồng: 'Quale tipo di contratto offrite?'. Đúng giờ là điều bắt buộc — đến sớm 10 phút.",
    cultural_notes_en: "Italian interviews use the polite 'Lei'. Employers ask 'Mi parli di lei' (tell me about yourself) and about 'punti di forza e debolezza' (strengths and weaknesses). Fixed phrases pay off: 'Sono disponibile da subito' (available immediately), 'Posso lavorare su turni'. It's good to ask about the contract: 'Quale tipo di contratto offrite?'. Punctuality is non-negotiable — arrive 10 minutes early.",
    tip_advice_vi: "Chú ý giới từ: 'Ho esperienza IN magazzino/edilizia/vendita' (kinh nghiệm trong…). Biến điểm yếu thành điểm tiến bộ: 'Sto migliorando il mio italiano'. Kết thúc lịch sự: 'La ringrazio per il colloquio' (Cảm ơn anh/chị đã phỏng vấn). Tránh 'sono libero subito' — dùng 'sono disponibile da subito'.",
    tip_advice_en: "Mind the preposition: 'Ho esperienza IN magazzino/edilizia/vendita' (experience in…). Turn a weakness into progress: 'Sto migliorando il mio italiano'. Close politely: 'La ringrazio per il colloquio' (thank you for the interview). Avoid 'sono libero subito' — say 'sono disponibile da subito'.",
    vocabulary: [
      { cell_id: "3c591ece-d962-4c29-9603-725a5d39fac2", word: "il colloquio", en: "interview", vi: "buổi phỏng vấn", pos: "n.m.", pronunciation_vi: "il côl-LÔ-qui-ô", pronunciation_en: "eel kol-LOH-kwyoh — hold double-l; 'qui' is 'kwee'" },
      { cell_id: "415db3d5-20d9-43f9-acbb-aa06adcd5047", word: "l'esperienza", en: "experience", vi: "kinh nghiệm", pos: "n.f.", pronunciation_vi: "lé-xpê-RI-en-dza", pronunciation_en: "les-peh-RYEN-tsah — 'esperienza IN' + sector" },
      { cell_id: "69c15bfa-a4f6-43a5-a7c4-2b6fdacd30ed", word: "il contratto", en: "contract", vi: "hợp đồng", pos: "n.m.", pronunciation_vi: "il côn-TRÁT-tô", pronunciation_en: "eel kon-TRAHT-toh — hold the double-t" },
      { cell_id: "aae63210-73f8-4c6e-981e-041613d2bd84", word: "disponibile", en: "available", vi: "sẵn sàng, rảnh", pos: "agg.", pronunciation_vi: "đi-xpô-NI-bi-lê", pronunciation_en: "dee-spoh-NEE-bee-leh — 'da subito' = from right now" },
      { cell_id: "915287c8-9333-434d-8ce3-c9815c280a99", word: "il punto di forza", en: "strength", vi: "điểm mạnh", pos: "n.m.", pronunciation_vi: "il PUN-tô đi FOR-tsa", pronunciation_en: "eel POON-toh dee FOR-tsah — 'forza' = strength; 'z' is 'ts'" },
      { cell_id: "3c16657e-b38c-4f34-b64c-ab01d9b2ce84", word: "assumere", en: "to hire", vi: "tuyển dụng", pos: "v.", pronunciation_vi: "ás-XU-mê-rê", pronunciation_en: "as-SOO-meh-reh — hold double-s; stress 'SOO'" },
      { cell_id: "a9812850-b8b3-446c-9ebc-542e4c1aec30", word: "lo stipendio", en: "salary", vi: "lương", pos: "n.m.", pronunciation_vi: "lô xti-PEN-đi-ô", pronunciation_en: "loh stee-PEN-dyoh — 'lo' before s+consonant" },
      { cell_id: "77b78ad1-867e-4073-89cf-4eee217d29b1", word: "il curriculum", en: "CV / résumé", vi: "sơ yếu lý lịch", pos: "n.m.", pronunciation_vi: "il cur-RI-cu-lum", pronunciation_en: "eel koor-REE-koo-loom — Latin loan, kept as is" },
      { cell_id: "325aee28-24f1-41e9-b4a9-905466f7e0c7", word: "crescere", en: "to grow / develop", vi: "phát triển", pos: "v.", pronunciation_vi: "CRÊ-xê-rê", pronunciation_en: "KREH-sheh-reh — 'sce' is 'sheh'" },
      { cell_id: "ac5bbd01-ffd2-4e49-ab7d-8ecf02b5201c", word: "puntuale", en: "punctual", vi: "đúng giờ", pos: "agg.", pronunciation_vi: "pun-tu-A-lê", pronunciation_en: "poon-too-AH-leh — stress 'AH'" },
    ],
    dialogue: [
      { cell_id: "a15164db-d711-4e7d-afbb-624297cc0c56", speaker: "Intervistatore", text: "Buongiorno, mi parli un po' di lei.", en: "Good morning, tell me a bit about yourself.", vi: "Chào anh/chị, kể tôi nghe đôi chút về anh/chị." },
      { cell_id: "b38250e1-b38f-4ab0-bb11-ab00e7008bd0", speaker: "Candidato", text: "Mi chiamo Minh, ho esperienza in magazzino e sono affidabile.", en: "My name is Minh, I have warehouse experience and I'm reliable.", vi: "Tôi tên Minh, có kinh nghiệm ở kho và tôi đáng tin." },
      { cell_id: "4933798e-b533-4787-bf05-dbe67c8d25a2", speaker: "Intervistatore", text: "Quando può iniziare?", en: "When can you start?", vi: "Anh/chị bắt đầu được khi nào?" },
      { cell_id: "2aca468c-a6b5-478a-abe5-01ff9dd79ed3", speaker: "Candidato", text: "Sono disponibile da subito e posso lavorare su turni.", en: "I'm available immediately and I can work shifts.", vi: "Tôi sẵn sàng ngay và có thể làm theo ca." },
    ],
    exercises: [
      { type: "fill-blank", question: "Ho esperienza ___ magazzino.", answer: "in", hint_vi: "giới từ với 'esperienza' + lĩnh vực", hint_en: "the preposition with 'esperienza' + a sector: 'esperienza in magazzino'" },
      { type: "matching", pairs: [["il colloquio", "buổi phỏng vấn (interview)"], ["disponibile", "sẵn sàng (available)"], ["assumere", "tuyển dụng (to hire)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi đúng giờ, đáng tin và sẵn sàng bắt đầu ngay.", english: "I'm punctual, reliable and available to start immediately.", italian: "Sono puntuale, affidabile e disponibile da subito." },
    ],
  },
  {
    id: "italian_expr_problemsolving",
    level: "B1",
    category: "expressions",
    title_vi: "Giải quyết vấn đề một cách lịch sự",
    title_en: "Polite problem-solving",
    sentences: [
      {
        en: "I'd like a reply as soon as possible.",
        vi: "Tôi mong nhận được phản hồi sớm nhất có thể.",
        pronunciation_focus: [
          "vorrei→vôr-RÊI",
          "risposta→ri-XPÔ-xta",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — the conditional softener; far politer than 'voglio' (I want)",
          "risposta → 'ree-SPOH-stah' — 'sp' clean blend; final -a voiced",
        ],
      },
      {
        en: "Could you give me the document, please?",
        vi: "Anh/chị đưa giấy tờ giúp tôi được không?",
        pronunciation_focus: [
          "mi può dare→mi pu-Ò ĐA-rê",
          "per favore→per fa-VÔ-rê",
        ],
        pronunciation_focus_en: [
          "mi può dare → 'mee pwoh DAH-reh' — 'può' is one syllable 'pwoh'; the polite 'can you'",
          "per favore → 'per fah-VOH-reh' — 'please'; keep every final vowel",
        ],
      },
      {
        en: "Maybe there's been a misunderstanding.",
        vi: "Có lẽ đã có một hiểu lầm.",
        pronunciation_focus: [
          "forse→FOR-xê",
          "malinteso→ma-lin-TÊ-dô",
        ],
        pronunciation_focus_en: [
          "forse → 'FOR-seh' — opens a face-saving sentence instead of blaming",
          "malinteso → 'mah-leen-TEH-zoh' — replaces 'è colpa tua' (it's your fault)",
        ],
      },
      {
        en: "This solution doesn't work for me.",
        vi: "Giải pháp này không phù hợp với tôi.",
        pronunciation_focus: [
          "soluzione→xô-lu-DZI-ô-nê",
          "non va bene→non va BÊ-nê",
        ],
        pronunciation_focus_en: [
          "soluzione → 'soh-loo-TSYOH-neh' — -zione = 'tsyoh-neh'",
          "non va bene → 'non vah BEH-neh' — literally 'it doesn't go well'; the natural 'it doesn't work'",
        ],
      },
      {
        en: "I'm not sure I understood correctly.",
        vi: "Tôi không chắc đã hiểu đúng.",
        pronunciation_focus: [
          "non sono sicuro→non xô-nô xi-CU-rô",
          "aver capito→a-VER ca-PI-tô",
        ],
        pronunciation_focus_en: [
          "non sono sicuro → 'non SOH-noh see-KOO-roh' — say 'sicura' if you're female",
          "aver capito → 'ah-VER kah-PEE-toh' — 'di aver capito' = of having understood",
        ],
      },
    ],
    cultural_notes_vi: "Tiếng Ý lịch sự dựa vào THỂ ĐIỀU KIỆN (condizionale): 'vorrei' thay 'voglio', 'potrebbe' thay 'deve'. Người Ý tránh đổ lỗi trực tiếp; thay 'È colpa tua' bằng 'Forse c'è stato un malinteso'. Để từ chối nhẹ nhàng, nêu lý do: 'Questa soluzione non va bene per me, perché…'. Khi không chắc, dùng 'Non sono sicuro di aver capito' — câu này cứu bạn trong mọi cuộc nói chuyện.",
    cultural_notes_en: "Polite Italian runs on the CONDITIONAL: 'vorrei' instead of 'voglio', 'potrebbe' instead of 'deve'. Italians avoid direct blame; swap 'È colpa tua' (it's your fault) for 'Forse c'è stato un malinteso' (maybe there's been a misunderstanding). To decline gently, give a reason: 'Questa soluzione non va bene per me, perché…'. When unsure, use 'Non sono sicuro di aver capito' — it rescues you in any conversation.",
    tip_advice_vi: "Quy tắc 1 phút: trước khi yêu cầu gì, đổi động từ sang điều kiện. 'Dammi…' → 'Mi potrebbe dare…'; 'Voglio…' → 'Vorrei…'; 'Rispondi subito' → 'Potrebbe rispondere appena possibile?'. Khi xác nhận lại để chắc chắn: 'Quindi devo…?'. Khi lỡ lời: 'Non volevo essere scortese' (Tôi không có ý bất lịch sự).",
    tip_advice_en: "One-minute rule: before any request, shift the verb to the conditional. 'Dammi…' → 'Mi potrebbe dare…'; 'Voglio…' → 'Vorrei…'; 'Rispondi subito' → 'Potrebbe rispondere appena possibile?'. To confirm and be sure: 'Quindi devo…?'. To repair a slip: 'Non volevo essere scortese' (I didn't mean to be rude).",
    vocabulary: [
      { cell_id: "5d412cb4-cf6f-4a14-86fb-36e4b27b4b35", word: "vorrei", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "v.", pronunciation_vi: "vôr-RÊI", pronunciation_en: "vor-RAY — conditional of 'volere'; the politeness workhorse" },
      { cell_id: "929e035c-5290-485d-9d63-afe1dd17f9f8", word: "potrebbe", en: "could you (formal)", vi: "anh/chị có thể", pos: "v.", pronunciation_vi: "pô-TRÉB-bê", pronunciation_en: "poh-TREB-beh — conditional of 'potere'; hold double-b" },
      { cell_id: "c3e81d1b-9ea0-42d9-99fd-ed638daf828b", word: "per favore", en: "please", vi: "làm ơn", pos: "espr.", pronunciation_vi: "per fa-VÔ-rê", pronunciation_en: "per fah-VOH-reh — also 'per cortesia' in formal settings" },
      { cell_id: "e3000f83-21ae-4b69-a955-5d785be44f85", word: "il malinteso", en: "misunderstanding", vi: "hiểu lầm", pos: "n.m.", pronunciation_vi: "il ma-lin-TÊ-dô", pronunciation_en: "eel mah-leen-TEH-zoh — defuses blame" },
      { cell_id: "9196e519-1b52-4404-85e6-fa95e0df03a3", word: "la soluzione", en: "solution", vi: "giải pháp", pos: "n.f.", pronunciation_vi: "la xô-lu-DZI-ô-nê", pronunciation_en: "lah soh-loo-TSYOH-neh — 'trovare una soluzione'" },
      { cell_id: "ab4948a5-4200-4868-814f-e82a2ab28897", word: "non va bene", en: "it doesn't work / isn't ok", vi: "không ổn", pos: "espr.", pronunciation_vi: "non va BÊ-nê", pronunciation_en: "non vah BEH-neh — add 'per me' to make it about you, not the person" },
      { cell_id: "2ea5f8f0-e2a6-497a-a105-6e82b2301cd3", word: "appena possibile", en: "as soon as possible", vi: "sớm nhất có thể", pos: "espr.", pronunciation_vi: "ap-PÊ-na pôs-XI-bi-lê", pronunciation_en: "ap-PEH-nah pos-SEE-bee-leh — hold both double consonants" },
      { cell_id: "10bb0789-fc5d-4eda-8538-49746a1bb862", word: "scortese", en: "rude / impolite", vi: "bất lịch sự", pos: "agg.", pronunciation_vi: "xcor-TÊ-dê", pronunciation_en: "skor-TEH-zeh — 'non volevo essere scortese' = I didn't mean to be rude" },
      { cell_id: "d68f4577-f6c6-4b4d-96bd-1d32b02efcb3", word: "chiarire", en: "to clarify", vi: "làm rõ", pos: "v.", pronunciation_vi: "ki-a-RI-rê", pronunciation_en: "kyah-REE-reh — 'chi' hard 'ky'" },
      { cell_id: "c3927ad5-decf-4805-be4b-6ec3a13ef55c", word: "quindi", en: "so / therefore", vi: "vậy thì", pos: "cong.", pronunciation_vi: "QUIN-đi", pronunciation_en: "KWEEN-dee — 'Quindi devo…?' confirms a recap" },
    ],
    dialogue: [
      { cell_id: "31e510f6-3bef-4944-8bf1-58e2ee5eaeec", speaker: "A", text: "Mi può dare il modulo, per favore?", en: "Could you give me the form, please?", vi: "Anh/chị đưa tôi tờ mẫu được không ạ?" },
      { cell_id: "0b55ba83-1b36-4202-9881-b55bf7267d88", speaker: "B", text: "Certo. Però manca la sua firma.", en: "Of course. But your signature is missing.", vi: "Được. Nhưng còn thiếu chữ ký của anh/chị." },
      { cell_id: "587edab5-f21a-41f9-ba04-16c439dcbc6f", speaker: "A", text: "Mi scusi, non sono sicuro di aver capito. Quindi devo firmare qui?", en: "Sorry, I'm not sure I understood. So I have to sign here?", vi: "Xin lỗi, tôi không chắc đã hiểu. Vậy tôi ký ở đây phải không?" },
      { cell_id: "605b22b1-9401-4b81-9472-5564fdc85884", speaker: "B", text: "Esatto. Poi me lo riporti appena possibile.", en: "Exactly. Then bring it back to me as soon as possible.", vi: "Chính xác. Rồi mang lại cho tôi sớm nhất có thể nhé." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ una risposta appena possibile. (lịch sự, từ 'volere')", answer: "Vorrei", hint_vi: "thể điều kiện của 'volere' — lịch sự hơn 'voglio'", hint_en: "the conditional of 'volere' — politer than 'voglio' (Vorrei…)" },
      { type: "matching", pairs: [["potrebbe", "anh/chị có thể (could you)"], ["il malinteso", "hiểu lầm (misunderstanding)"], ["scortese", "bất lịch sự (rude)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Có lẽ đã có hiểu lầm; tôi muốn tìm một giải pháp.", english: "Maybe there's been a misunderstanding; I'd like to find a solution.", italian: "Forse c'è stato un malinteso; vorrei trovare una soluzione." },
    ],
  },
];

export default lessons;
