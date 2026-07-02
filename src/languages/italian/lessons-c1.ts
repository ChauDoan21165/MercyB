// Italian C1 lessons — Vietnamese-first (L1 = Vietnamese), English companion fields.
//
// Self-contained on purpose: unlike the French track, the Italian language
// folder does not yet ship a sibling `./lessons.ts` registry with a shared
// `ItalianLesson` type, so the structural types are declared inline here. They
// mirror the French `FrenchLesson` shape (src/languages/french/lessons.ts) field
// for field, so a future `lessons.ts` can lift these definitions out unchanged.
//
// Source material: .local/vietnamese-italian-study/ (O2 argumentation, O5
// academic vocabulary, O6 professional email, O8 critical-thinking language).
// The source markdown intentionally strips Italian accents; this file restores
// standard accented orthography (è, perché, più, così, qualità, …).

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianCategoryId =
  | "fluency"
  | "workplace"
  | "public_communication"
  | "advanced_grammar"
  | "society"
  | "expressions";

export type LessonSentence = {
  en: string;
  vi: string;
  // VN-speaker pronunciation aid: syllable break + STRESSED syllable in CAPS.
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
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

export type IdiomGloss = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

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
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: IdiomGloss[];
};

export const lessons: ItalianLesson[] = [
  // ── 1. Argumentative essay writing ────────────────────────────────────
  {
    id: "lscrittura_argomentativa",
    level: "C1",
    category: "fluency",
    title_vi: "Viết bài luận lập luận: luận đề, nhượng bộ, kết luận có sắc thái",
    title_en: "Writing an argumentative essay: thesis, concession, nuanced conclusion",
    sentences: [
      {
        en: "In recent years there has been much debate about the impact of technology on quality of life.",
        vi: "Trong những năm gần đây, người ta đã bàn luận nhiều về tác động của công nghệ đối với chất lượng cuộc sống.",
        pronunciation_focus: [
          "discusso → di-SKÚS-so (s đôi giữ dài hơn, không phải một âm s)",
          "tecnologia → tec-no-lo-GÌ-a (nhấn vào -GÌ-, bốn âm tiết rõ)",
          "qualità → kua-li-TÀ (nhấn âm cuối, dấu mở miệng)",
          "vita → VÍ-ta (t đơn, gọn)",
        ],
        pronunciation_focus_en: [
          "discusso → 'dee-SKOOS-so' (hold the double s noticeably longer than a single s)",
          "tecnologia → 'tek-no-lo-JEE-ah' (stress on -JEE-; four clear syllables)",
          "qualità → 'kwah-lee-TAH' (final-syllable stress marked by the accent)",
          "vita → 'VEE-tah' (clean single t, no aspiration)",
        ],
      },
      {
        en: "In my view, the question cannot be reduced to a simple opposition between progress and tradition.",
        vi: "Theo quan điểm của tôi, vấn đề không thể quy giản thành sự đối lập đơn giản giữa tiến bộ và truyền thống.",
        pronunciation_focus: [
          "avviso → av-VÍ-zo (v đôi; s giữa hai nguyên âm đọc thành 'z')",
          "questione → kue-STIÔ-ne (qu = 'kw', không phải 'k')",
          "ridotta → ri-DÔT-ta (t đôi giữ dài)",
          "opposizione → op-po-zi-TSIÔ-ne (zi = 'tsi'; p đôi)",
        ],
        pronunciation_focus_en: [
          "avviso → 'ahv-VEE-zo' (double v; the s between vowels turns to 'z')",
          "questione → 'kweh-STYOH-neh' (qu = 'kw', never just 'k')",
          "ridotta → 'ree-DOHT-tah' (hold the double t)",
          "opposizione → 'op-po-zee-TSYOH-neh' ('-zione' = 'TSYOH-neh'; double p)",
        ],
      },
      {
        en: "It is true that innovation offers effective tools; however, it also entails risks that are not negligible.",
        vi: "Đúng là sự đổi mới mang lại những công cụ hiệu quả; tuy nhiên, nó cũng kéo theo những rủi ro không thể xem nhẹ.",
        pronunciation_focus: [
          "innovazione → in-no-va-TSIÔ-ne (n đôi mở đầu)",
          "efficaci → ef-fi-KÀ-ci (f đôi; -ci = 'chi')",
          "tuttavia → tut-ta-VÍ-a (t đôi; nhấn -VÍ-)",
          "trascurabili → tra-sku-RÀ-bi-li (chùm 'tr' + 'sc' = 'sk')",
        ],
        pronunciation_focus_en: [
          "innovazione → 'een-no-vah-TSYOH-neh' (double n at the start)",
          "efficaci → 'ef-fee-KAH-chee' (double f; final -ci = 'chee')",
          "tuttavia → 'toot-tah-VEE-ah' (double t; stress on -VEE-)",
          "trascurabili → 'trah-skoo-RAH-bee-lee' (the 'sc' before u = 'sk')",
        ],
      },
      {
        en: "We must therefore distinguish between conscious use and an uncritical dependence on digital tools.",
        vi: "Vì vậy, cần phân biệt giữa việc sử dụng có ý thức và sự lệ thuộc thiếu phê phán vào các công cụ số.",
        pronunciation_focus: [
          "distinguere → di-STÍN-gue-re (gu = 'gw'; nhấn -STÍN-)",
          "consapevole → kon-sa-PÉ-vo-le (nhấn -PÉ-)",
          "dipendenza → di-pen-DÉN-tsa (z cuối = 'ts')",
          "acritica → a-KRÍ-ti-ka (c + r = 'k' cứng)",
        ],
        pronunciation_focus_en: [
          "distinguere → 'dee-STEEN-gweh-reh' (gu = 'gw'; stress on -STEEN-)",
          "consapevole → 'kon-sah-PEH-vo-leh' (stress on -PEH-)",
          "dipendenza → 'dee-pen-DEN-tsah' (final z = 'ts')",
          "acritica → 'ah-KREE-tee-kah' (c before r = hard 'k')",
        ],
      },
      {
        en: "In light of these considerations, I believe the most balanced solution lies in a regulated and critical approach.",
        vi: "Dựa trên những cân nhắc này, tôi cho rằng giải pháp cân bằng nhất nằm ở một cách tiếp cận có điều tiết và có tính phê phán.",
        pronunciation_focus: [
          "considerazioni → kon-si-de-ra-TSIÔ-ni (chuỗi dài, nhấn -TSIÔ-)",
          "equilibrata → e-kui-li-BRÀ-ta (qu = 'kw')",
          "risieda → ri-SIÈ-da (động từ subjunctive, nhấn -SIÈ-)",
          "approccio → ap-PRÔC-cio (p đôi + cc = 'tch' đôi)",
        ],
        pronunciation_focus_en: [
          "considerazioni → 'kon-see-deh-rah-TSYOH-nee' (long chain; stress -TSYOH-)",
          "equilibrata → 'eh-kwee-lee-BRAH-tah' (qu = 'kw')",
          "risieda → 'ree-SYEH-dah' (subjunctive; stress -SYEH-)",
          "approccio → 'ap-PROT-cho' (double p, then cc = a long 'tch')",
        ],
      },
    ],
    cultural_notes_vi:
      "Bài luận lập luận (« saggio argomentativo ») trong văn hoá học thuật và thi cử Ý (CILS, CELI cấp C1) đi theo một khung tu từ chặt chẽ, khác hẳn lối viết « nêu ý kiến rồi liệt kê lý do » mà người Việt quen dùng ở trường phổ thông.\n\nNgười chấm Ý KỲ VỌNG bốn điều:\n\n(1) MỘT LUẬN ĐỀ CÓ SẮC THÁI, không phải khẩu hiệu. Câu « La tecnologia è buona » bị xem là B1. Phải là « la questione non può essere ridotta a… » — đặt vấn đề như một thứ phức tạp ngay từ đầu.\n\n(2) NHƯỢNG BỘ BẮT BUỘC (« concessione »). Một bài luận một chiều — chỉ khen hoặc chỉ chê — bị trừ điểm nặng. Phải có « È vero che…, tuttavia… ». Người Việt thường bỏ bước này vì sợ « tự mâu thuẫn »; trong tu từ Ý, thừa nhận giới hạn của chính lập trường mình MỚI là dấu hiệu trưởng thành.\n\n(3) MỖI ĐOẠN MỘT CHỨC NĂNG. Không trộn dẫn chứng, phản biện và kết luận vào một đoạn. Người chấm đọc bố cục trước khi đọc nội dung.\n\n(4) KẾT LUẬN « CÓ ĐIỀU KIỆN », không tuyệt đối. « Alla luce di queste considerazioni » dẫn vào một lập trường đã được làm mềm bằng điều kiện (« a condizione che… », « purché… »).\n\nBẫy thường gặp của người Việt: (a) dùng từ đời thường trong văn trang trọng — « buono », « cosa », « tanto » thay vì « efficace », « aspetto », « significativo »; (b) lặp lại « problema » thay vì luân phiên « questione / tema / aspetto / criticità »; (c) dịch thẳng cấu trúc tiếng Việt « theo tôi nghĩ là… » thành « secondo me penso che… » (thừa, sai), trong khi tiếng Ý chỉ cần « A mio avviso… ».",
    cultural_notes_en:
      "The argumentative essay ('saggio argomentativo') in Italian academic and exam culture (CILS, CELI at C1) follows a tight rhetorical frame that differs from the 'state an opinion, then list reasons' style many learners bring from school.\n\nItalian markers expect four things: (1) A NUANCED THESIS, not a slogan — 'La tecnologia è buona' reads as B1; 'la questione non può essere ridotta a…' frames the issue as complex from the first line. (2) A MANDATORY CONCESSION ('concessione') — a one-sided essay is heavily penalised; you must include 'È vero che…, tuttavia…'. Conceding the limits of your own position is the mark of maturity in Italian rhetoric, not self-contradiction. (3) ONE FUNCTION PER PARAGRAPH — don't blend evidence, counter-argument and conclusion; the marker reads your structure before your content. (4) A CONDITIONAL CONCLUSION, not an absolute one — 'Alla luce di queste considerazioni' should introduce a position softened by a condition ('a condizione che…', 'purché…').\n\nCommon traps: (a) everyday words in formal prose — 'buono', 'cosa', 'tanto' instead of 'efficace', 'aspetto', 'significativo'; (b) repeating 'problema' instead of rotating 'questione / tema / aspetto / criticità'; (c) calquing 'I think that…' into the redundant, incorrect 'secondo me penso che…' when Italian needs only 'A mio avviso…'.",
    tip_advice_vi:
      "Khung 5 phần để viết một « saggio argomentativo » C1 (180–220 từ):\n\n(1) INTRODUZIONE — đặt vấn đề như một thứ phức tạp: « Negli ultimi anni si è discusso molto di… ». Một câu, không hơn.\n\n(2) TESI — nêu lập trường nhưng đã làm mềm: « A mio avviso, la questione non può essere ridotta a… ». Tránh « Secondo me è giusto/sbagliato » (quá nhị phân).\n\n(3) ARGOMENTO — một dẫn chứng cụ thể + giải thích VÌ SAO nó quan trọng: « Un esempio significativo è… ». Đừng nêu ví dụ rồi để đó.\n\n(4) CONCESSIONE — bắt buộc: « È vero che…, tuttavia… » hoặc « Occorre però distinguere tra… ». Đây là câu nâng bài từ B2 lên C1.\n\n(5) CONCLUSIONE — kết có điều kiện: « Alla luce di queste considerazioni, ritengo che… a condizione che… ».\n\nNÂNG CẤP TỪ VỰNG (đổi ngay khi viết):\n- « buono » → « efficace »\n- « una cosa importante » → « un aspetto rilevante »\n- « il testo dice » → « il testo sostiene / evidenzia »\n- « un problema grande » → « una questione complessa »\n- « molto » → « significativamente / notevolmente »\n\nDÙNG ÍT NHẤT 5 LIÊN TỪ: « inoltre » (thêm ý), « tuttavia » (đối lập), « di conseguenza » (hệ quả), « a condizione che » (điều kiện), « in conclusione » (kết).\n\nLuyện: viết đúng 5 câu trên cho đề « La tecnologia migliora davvero la qualità della vita? », rồi tự kiểm: lập trường có rõ mà không cứng nhắc? có ít nhất một nhượng bộ? mỗi đoạn một chức năng?",
    tip_advice_en:
      "A 5-part frame for a C1 'saggio argomentativo' (180–220 words):\n\n(1) INTRODUZIONE — frame the issue as complex: 'Negli ultimi anni si è discusso molto di…'. One sentence.\n(2) TESI — state a softened position: 'A mio avviso, la questione non può essere ridotta a…'. Avoid the binary 'Secondo me è giusto/sbagliato'.\n(3) ARGOMENTO — one concrete example PLUS why it matters: 'Un esempio significativo è…'. Never drop an example and move on.\n(4) CONCESSIONE — mandatory: 'È vero che…, tuttavia…' or 'Occorre però distinguere tra…'. This single move lifts the essay from B2 to C1.\n(5) CONCLUSIONE — a conditional close: 'Alla luce di queste considerazioni, ritengo che… a condizione che…'.\n\nVOCABULARY UPGRADES: 'buono' → 'efficace'; 'una cosa importante' → 'un aspetto rilevante'; 'il testo dice' → 'il testo sostiene / evidenzia'; 'un problema grande' → 'una questione complessa'; 'molto' → 'significativamente / notevolmente'.\n\nUSE AT LEAST 5 CONNECTORS: 'inoltre' (add), 'tuttavia' (contrast), 'di conseguenza' (consequence), 'a condizione che' (condition), 'in conclusione' (close).\n\nPractice: write exactly these five sentences for 'La tecnologia migliora davvero la qualità della vita?', then self-check: is the position clear but not rigid? at least one concession? one function per paragraph?",
    vocabulary: [
      {
        word: "a mio avviso",
        en: "in my view",
        vi: "theo quan điểm của tôi",
        pos: "loc.",
        pronunciation_vi: "a mí-o av-VÍ-zo",
        pronunciation_en: "ah MEE-oh ahv-VEE-zo — more formal than 'secondo me'; the double v is held, s = 'z'",
      },
      {
        word: "la questione",
        en: "the issue / matter",
        vi: "vấn đề (mang sắc thái học thuật)",
        pos: "n.f.",
        pronunciation_vi: "la kue-STIÔ-ne",
        pronunciation_en: "lah kweh-STYOH-neh — academic register; prefer it to repeating 'il problema'",
      },
      {
        word: "occorre distinguere tra",
        en: "one must distinguish between",
        vi: "cần phân biệt giữa",
        pos: "v.",
        pronunciation_vi: "ok-KÔR-re di-STÍN-gue-re tra",
        pronunciation_en: "ok-KOR-reh dee-STEEN-gweh-reh trah — 'occorre' (double c, double r) = 'it is necessary'",
      },
      {
        word: "è vero che… tuttavia",
        en: "it is true that… however",
        vi: "đúng là… tuy nhiên",
        pos: "loc.",
        pronunciation_vi: "è VÉ-ro ke… tut-ta-VÍ-a",
        pronunciation_en: "eh VEH-ro keh… toot-tah-VEE-ah — the core concession frame; 'che' = 'keh'",
      },
      {
        word: "comportare",
        en: "to entail / to involve",
        vi: "kéo theo / dẫn đến",
        pos: "v.",
        pronunciation_vi: "kom-por-TÀ-re",
        pronunciation_en: "kom-por-TAH-reh — false friend: NOT 'to comport oneself'; means 'to entail/bring about'",
      },
      {
        word: "non trascurabile",
        en: "not negligible",
        vi: "không thể xem nhẹ",
        pos: "adj.",
        pronunciation_vi: "non tra-sku-RÀ-bi-le",
        pronunciation_en: "non trah-skoo-RAH-bee-leh — 'sc' before u = 'sk'; a key C1 hedge for risks/effects",
      },
      {
        word: "alla luce di queste considerazioni",
        en: "in light of these considerations",
        vi: "dựa trên những cân nhắc này",
        pos: "loc.",
        pronunciation_vi: "al-la LÚ-ce di KUÉ-ste kon-si-de-ra-TSIÔ-ni",
        pronunciation_en: "ah-lah LOO-cheh dee KWEH-steh kon-see-deh-rah-TSYOH-nee — 'luce' = 'LOO-cheh'; standard essay-closing connector",
      },
      {
        word: "la complessità",
        en: "complexity",
        vi: "tính phức tạp",
        pos: "n.f.",
        pronunciation_vi: "la kom-ples-si-TÀ",
        pronunciation_en: "lah kom-ples-see-TAH — final stress; -ità abstract nouns are invariable in the plural",
      },
      {
        word: "sostenibile",
        en: "sustainable",
        vi: "bền vững",
        pos: "adj.",
        pronunciation_vi: "so-ste-NÍ-bi-le",
        pronunciation_en: "so-steh-NEE-bee-leh — both an environmental and a figurative 'tenable/defensible' sense",
      },
      {
        word: "a condizione che (+ congiuntivo)",
        en: "provided that (+ subjunctive)",
        vi: "với điều kiện là (đi với thức giả định)",
        pos: "loc.",
        pronunciation_vi: "a kon-di-TSIÔ-ne ke",
        pronunciation_en: "ah kon-dee-TSYOH-neh keh — TRIGGERS the subjunctive: 'a condizione che SIA…', not 'è'",
      },
    ],
    dialogue: [
      {
        speaker: "Prof.ssa Conti",
        text: "Minh, ha strutturato il saggio, ma la sua tesi è troppo netta. Dov'è la concessione?",
        vi: "Minh, em đã dựng được bố cục bài luận, nhưng luận đề của em quá dứt khoát. Phần nhượng bộ đâu rồi?",
        en: "Minh, you've structured the essay, but your thesis is too clear-cut. Where's the concession?",
      },
      {
        speaker: "Minh",
        text: "Pensavo che ammettere un limite indebolisse la mia posizione.",
        vi: "Em nghĩ thừa nhận một giới hạn sẽ làm yếu lập trường của em.",
        en: "I thought admitting a limit would weaken my position.",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "Al contrario: a livello C1, riconoscere un limite la rafforza. Aggiunga un 'È vero che…, tuttavia…'.",
        vi: "Ngược lại: ở trình độ C1, thừa nhận một giới hạn làm lập trường mạnh hơn. Hãy thêm một câu « È vero che…, tuttavia… ».",
        en: "On the contrary: at C1, acknowledging a limit strengthens it. Add an 'È vero che…, tuttavia…'.",
      },
      {
        speaker: "Minh",
        text: "Capito. Quindi: è vero che la tecnologia isola, tuttavia, usata con criterio, può anche avvicinare.",
        vi: "Em hiểu rồi. Vậy: đúng là công nghệ gây cô lập, tuy nhiên, nếu dùng có cân nhắc, nó cũng có thể kéo người ta lại gần nhau.",
        en: "Got it. So: it's true that technology isolates, yet, used sensibly, it can also bring people closer.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Prof.ssa Conti (ricevimento studenti)",
        text: "Allora, leggiamo insieme il suo saggio sull'impatto della tecnologia. L'introduzione promette bene.",
        vi: "Nào, chúng ta cùng đọc bài luận của em về tác động của công nghệ. Phần mở bài có vẻ hứa hẹn.",
        en: "Right, let's read your essay on the impact of technology together. The introduction is promising.",
      },
      {
        speaker: "Minh",
        text: "Ho aperto con 'Negli ultimi anni si è discusso molto dell'impatto della tecnologia sulla qualità della vita'. Volevo inquadrare la questione come complessa fin dall'inizio.",
        vi: "Em mở bằng câu « Negli ultimi anni si è discusso molto dell'impatto della tecnologia sulla qualità della vita ». Em muốn khung vấn đề như một thứ phức tạp ngay từ đầu.",
        en: "I opened with 'In recent years there's been much debate about the impact of technology on quality of life.' I wanted to frame the issue as complex from the start.",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "Ottimo verbo impersonale, 'si è discusso'. Però la tesi subito dopo — 'la tecnologia è dannosa' — crolla a livello B1. Troppo binaria.",
        vi: "Động từ vô nhân xưng « si è discusso » rất tốt. Nhưng luận đề ngay sau đó — « la tecnologia è dannosa » — rớt xuống mức B1. Quá nhị phân.",
        en: "Excellent impersonal verb, 'si è discusso'. But the thesis right after — 'technology is harmful' — collapses to B1. Too binary.",
      },
      {
        speaker: "Minh",
        text: "Come la riformulo senza perdere la posizione?",
        vi: "Em diễn đạt lại thế nào mà không mất lập trường?",
        en: "How do I reformulate it without losing my position?",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "Usi 'A mio avviso, la questione non può essere ridotta a una semplice opposizione tra progresso e tradizione'. Mantiene la sua voce, ma segnala sfumatura.",
        vi: "Em hãy dùng « A mio avviso, la questione non può essere ridotta a una semplice opposizione tra progresso e tradizione ». Vẫn giữ được tiếng nói của em, nhưng báo hiệu sắc thái.",
        en: "Use 'In my view, the question cannot be reduced to a simple opposition between progress and tradition.' It keeps your voice but signals nuance.",
      },
      {
        speaker: "Minh",
        text: "E il paragrafo centrale? Ho messo l'esempio degli smartphone a scuola.",
        vi: "Còn đoạn giữa thì sao ạ? Em đặt ví dụ về điện thoại thông minh ở trường.",
        en: "And the central paragraph? I put in the example of smartphones at school.",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "L'esempio c'è, ma lei non spiega perché conta. A C1 ogni esempio va commentato: dica che cosa dimostra, non solo che esiste.",
        vi: "Ví dụ thì có, nhưng em không giải thích vì sao nó quan trọng. Ở C1, mỗi ví dụ phải được bình luận: hãy nói nó chứng minh điều gì, chứ không chỉ nói nó tồn tại.",
        en: "The example is there, but you don't explain why it matters. At C1 every example must be commented on: say what it demonstrates, not just that it exists.",
      },
      {
        speaker: "Minh",
        text: "Quindi: 'Un esempio significativo è il divieto degli smartphone in alcune scuole, che evidenzia come la regolazione, più del divieto totale, produca risultati duraturi.'",
        vi: "Vậy: « Un esempio significativo è il divieto degli smartphone in alcune scuole, che evidenzia come la regolazione, più del divieto totale, produca risultati duraturi. »",
        en: "So: 'A significant example is the ban on smartphones in some schools, which shows how regulation, more than an outright ban, produces lasting results.'",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "Esatto, e ha persino infilato un congiuntivo dopo 'come… produca'. Ora le manca solo la concessione prima della conclusione.",
        vi: "Chính xác, và em còn lồng được một thức giả định sau « come… produca ». Bây giờ em chỉ còn thiếu phần nhượng bộ trước kết luận.",
        en: "Exactly, and you even slipped in a subjunctive after 'come… produca'. Now you're only missing the concession before the conclusion.",
      },
      {
        speaker: "Minh",
        text: "La chiudo così: 'È vero che nessuna regola è perfetta; tuttavia, alla luce di queste considerazioni, ritengo che un approccio regolato sia preferibile, a condizione che venga rivisto nel tempo.'",
        vi: "Em chốt thế này: « È vero che nessuna regola è perfetta; tuttavia, alla luce di queste considerazioni, ritengo che un approccio regolato sia preferibile, a condizione che venga rivisto nel tempo. »",
        en: "I'll close like this: 'It's true that no rule is perfect; however, in light of these considerations, I believe a regulated approach is preferable, provided it is revised over time.'",
      },
      {
        speaker: "Prof.ssa Conti",
        text: "Questo è un saggio C1. Concessione, congiuntivo, condizione finale: ci siamo.",
        vi: "Đây mới là một bài luận C1. Có nhượng bộ, có thức giả định, có điều kiện ở phần kết: được rồi đấy.",
        en: "That's a C1 essay. Concession, subjunctive, final condition: there we are.",
      },
    ],
    roleplay_prompts: [
      "Bạn nộp bài luận C1 cho giáo viên với đề « La tecnologia migliora davvero la qualità della vita? ». Trình bày miệng trong 2 phút theo đúng 5 phần: introduzione, tesi, argomento, concessione, conclusione.",
      "Giáo viên nói: « La sua tesi è troppo netta, manca la concessione. » Hãy đáp lại bằng cách thêm một câu « È vero che…, tuttavia… » phù hợp với lập trường của bạn.",
      "Bạn cùng lớp viết một bài một chiều chỉ khen công nghệ. Hãy góp ý lịch sự bằng tiếng Ý: chỉ ra rằng thiếu nhượng bộ và đề xuất một câu « Occorre però distinguere tra… ».",
    ],
    roleplay_prompts_en: [
      "You hand in your C1 essay on 'Does technology really improve quality of life?'. Present it orally for 2 minutes following the five parts: introduzione, tesi, argomento, concessione, conclusione.",
      "Your teacher says: 'Your thesis is too clear-cut, the concession is missing.' Respond by adding a fitting 'È vero che…, tuttavia…' that suits your position.",
      "A classmate has written a one-sided essay praising technology. Give polite feedback in Italian: point out the missing concession and propose a sentence starting 'Occorre però distinguere tra…'.",
    ],
    register_notes:
      "Văn viết lập luận C1 đòi hỏi register trang trọng, phi cảm xúc:\n\n- DANH HOÁ (nominalizzazione) là dấu hiệu C1 rõ nhất: « la regolazione dell'uso » thay « regolare l'uso »; « la sostenibilità della scelta » thay « se la scelta è sostenibile ».\n- ĐỘNG TỪ VÔ NHÂN XƯNG: « si è discusso », « si potrebbe sostenere che », « è opportuno distinguere » — xoá cái « io » thừa.\n- THỨC GIẢ ĐỊNH (congiuntivo) sau các cụm: « ritengo che… sia », « occorre che… venga », « a condizione che… sia ». Thiếu congiuntivo ở các neo này = đọc B2.\n- HEDGE tinh tế: « tutto sommato », « in una certa misura », « non sempre », « sotto certe condizioni » — KHÔNG « forse » trống rỗng.\n\nLIÊN TỪ C1 nên thuộc: « tuttavia », « inoltre », « di conseguenza », « al contrario », « non da ultimo », « alla luce di ciò », « in definitiva ».\n\nTRÁNH trong văn trang trọng: « un sacco di », « roba », « cosa » (dùng « aspetto / elemento / fattore »), « tanto » (dùng « notevolmente »), và lối nói khẩu ngữ « tipo… », « cioè… » đầu câu.",
    register_notes_en:
      "C1 argumentative writing demands a formal, de-personalised register:\n\n- NOMINALISATION ('nominalizzazione') is the clearest C1 marker: 'la regolazione dell'uso' over 'regolare l'uso'; 'la sostenibilità della scelta' over 'se la scelta è sostenibile'.\n- IMPERSONAL VERBS: 'si è discusso', 'si potrebbe sostenere che', 'è opportuno distinguere' — they delete the redundant 'io'.\n- SUBJUNCTIVE after anchors: 'ritengo che… sia', 'occorre che… venga', 'a condizione che… sia'. Missing the subjunctive at these points reads as B2.\n- PRECISE HEDGING: 'tutto sommato', 'in una certa misura', 'non sempre', 'sotto certe condizioni' — not an empty 'forse'.\n\nMemorise these C1 connectors: 'tuttavia', 'inoltre', 'di conseguenza', 'al contrario', 'non da ultimo', 'alla luce di ciò', 'in definitiva'.\n\nAvoid in formal prose: 'un sacco di', 'roba', 'cosa' (use 'aspetto / elemento / fattore'), 'tanto' (use 'notevolmente'), and spoken fillers like sentence-initial 'tipo…' or 'cioè…'.",
    idiom_glosses: [
      {
        idiom: "alla luce di (formale)",
        literal: "dưới ánh sáng của",
        literal_en: "in the light of",
        meaning: "Xét trên cơ sở của / căn cứ vào — dùng để dẫn vào kết luận sau khi đã cân nhắc.",
        meaning_en: "On the basis of / in view of — used to introduce a conclusion after weighing evidence. Closer to formal English 'in light of' than the literal image suggests.",
        example: "Alla luce dei dati raccolti, la prima ipotesi appare meno convincente.",
        example_en: "In light of the data gathered, the first hypothesis appears less convincing.",
      },
      {
        idiom: "non da ultimo (formale)",
        literal: "không phải từ cuối cùng",
        literal_en: "not from last",
        meaning: "Và không kém phần quan trọng — thêm một ý cuối mà vẫn nhấn mạnh tầm quan trọng của nó.",
        meaning_en: "Last but not least — adds a final point while still stressing its importance. A polished alternative to 'infine'.",
        example: "La proposta è costosa, complessa e, non da ultimo, difficile da applicare.",
        example_en: "The proposal is costly, complex and, not least, hard to apply.",
      },
      {
        idiom: "tutto sommato (idiomatico)",
        literal: "tất cả đã cộng lại",
        literal_en: "everything added up",
        meaning: "Xét cho cùng / nhìn chung — một hedge nhẹ trước một đánh giá cân bằng.",
        meaning_en: "All things considered / on balance — a soft hedge before a balanced judgement. Signals you've weighed both sides.",
        example: "Tutto sommato, i vantaggi superano gli svantaggi, purché si rispettino certe condizioni.",
        example_en: "All things considered, the advantages outweigh the disadvantages, provided certain conditions are met.",
      },
      {
        idiom: "ridurre a (una semplice opposizione)",
        literal: "rút gọn xuống thành",
        literal_en: "to reduce to",
        meaning: "Quy giản một vấn đề phức tạp thành một thứ đơn giản hoá quá mức — thường dùng phủ định để bác bỏ lối nhìn nhị phân.",
        meaning_en: "To reduce a complex issue to an oversimplification — typically used in the negative to reject a binary framing.",
        example: "Il dibattito non può essere ridotto a una semplice opposizione tra ricchi e poveri.",
        example_en: "The debate cannot be reduced to a simple opposition between rich and poor.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "È ___ che l'innovazione offre strumenti efficaci, ___ comporta anche dei rischi.",
        answer: "vero / tuttavia",
        hint_vi: "Công thức nhượng bộ chuẩn C1: « È ___ che…, ___ … » (đúng là… tuy nhiên…)",
        hint_en: "The standard C1 concession frame: 'È ___ che…, ___ …' (it is true that… however…)",
      },
      {
        type: "matching",
        pairs: [
          ["a mio avviso", "theo quan điểm của tôi (in my view)"],
          ["occorre distinguere tra", "cần phân biệt giữa (one must distinguish between)"],
          ["alla luce di ciò", "dựa trên điều đó (in light of that)"],
          ["a condizione che", "với điều kiện là (provided that)"],
        ],
        instruction: "Nối cụm liên kết C1 với nghĩa tiếng Việt",
        instruction_en: "Match the C1 connector with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Theo quan điểm của tôi, vấn đề không thể quy giản thành một sự đối lập đơn giản.",
        italian: "A mio avviso, la questione non può essere ridotta a una semplice opposizione.",
        english: "In my view, the question cannot be reduced to a simple opposition.",
      },
    ],
  },

  // ── 2. Critical-thinking language ─────────────────────────────────────
  {
    id: "lpensiero_critico",
    level: "C1",
    category: "society",
    title_vi: "Ngôn ngữ tư duy phản biện: đồng tình có sắc thái, phản đối lịch sự, đánh giá bằng chứng",
    title_en: "Critical-thinking language: nuanced agreement, polite disagreement, evaluating evidence",
    sentences: [
      {
        en: "I agree in general terms, but with one reservation.",
        vi: "Nhìn chung tôi đồng ý, nhưng có một điều cần lưu ý.",
        pronunciation_focus: [
          "d'accordo → dak-KÔR-do (c đôi giữ dài; nuốt dấu nháy)",
          "generale → ge-ne-RÀ-le (g + e = 'gie')",
          "riserva → ri-SÈR-va (s = 'z' giữa nguyên âm)",
        ],
        pronunciation_focus_en: [
          "d'accordo → 'dak-KOR-do' (double c held long; the apostrophe elides 'di')",
          "generale → 'jeh-neh-RAH-leh' (g before e = soft 'j')",
          "riserva → 'ree-SER-vah' (s between vowels leans toward 'z')",
        ],
      },
      {
        en: "This point seems debatable to me.",
        vi: "Điểm này theo tôi thấy còn phải bàn thêm.",
        pronunciation_focus: [
          "punto → PÚN-to (nguyên âm 'u' rõ như 'u' tiếng Việt)",
          "sembra → SÉM-bra (chùm 'mbr')",
          "discutibile → di-sku-TÍ-bi-le ('sc' + u = 'sk')",
        ],
        pronunciation_focus_en: [
          "punto → 'POON-toh' (clean 'oo' vowel)",
          "sembra → 'SEM-brah' (the 'mbr' cluster is fully voiced)",
          "discutibile → 'dee-skoo-TEE-bee-leh' ('sc' before u = 'sk')",
        ],
      },
      {
        en: "We need to distinguish between correlation and cause.",
        vi: "Cần phân biệt giữa tương quan và nguyên nhân.",
        pronunciation_focus: [
          "distinguere → di-STÍN-gue-re (gu = 'gw')",
          "correlazione → kor-re-la-TSIÔ-ne (r đôi)",
          "causa → KÀU-za (au = nguyên âm đôi 'au'; s = 'z')",
        ],
        pronunciation_focus_en: [
          "distinguere → 'dee-STEEN-gweh-reh' (gu = 'gw')",
          "correlazione → 'kor-reh-lah-TSYOH-neh' (double r, rolled)",
          "causa → 'KOW-zah' ('au' as one diphthong; s = 'z')",
        ],
      },
      {
        en: "Perhaps we're looking at the problem from two different perspectives.",
        vi: "Có lẽ chúng ta đang nhìn vấn đề từ hai góc độ khác nhau.",
        pronunciation_focus: [
          "guardando → guar-DÀN-do (gu = 'gw')",
          "problema → pro-BLÈ-ma (chùm 'bl' rõ)",
          "prospettive → pro-spet-TÍ-ve (t đôi)",
        ],
        pronunciation_focus_en: [
          "guardando → 'gwar-DAHN-doh' (gu = 'gw')",
          "problema → 'pro-BLEH-mah' (crisp 'bl' cluster)",
          "prospettive → 'pro-spet-TEE-veh' (double t held)",
        ],
      },
      {
        en: "A widely shared piece of content is not necessarily true.",
        vi: "Một nội dung được chia sẻ nhiều không nhất thiết là đúng.",
        pronunciation_focus: [
          "contenuto → kon-te-NÚ-to",
          "condiviso → kon-di-VÍ-zo (s = 'z')",
          "necessariamente → ne-ces-sa-ria-MÉN-te (c + e = 'che'; s đôi)",
        ],
        pronunciation_focus_en: [
          "contenuto → 'kon-teh-NOO-toh'",
          "condiviso → 'kon-dee-VEE-zo' (s = 'z')",
          "necessariamente → 'neh-ches-sah-ryah-MEN-teh' (c before e = 'ch'; double s)",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tranh luận học thuật và công sở Ý, « pensiero critico » không có nghĩa là phê phán gay gắt — mà là CHÍNH XÁC. Người Ý ở trình độ C1 đánh giá bạn qua năm câu hỏi ngầm: (1) Luận điểm là gì? (2) Bằng chứng nào? (3) Giới hạn ở đâu? (4) Có cách giải thích khác không? (5) Kết luận hợp lý là gì?\n\nKhác biệt văn hoá quan trọng với người Việt:\n\n(a) PHẢN ĐỐI PHẢI CÓ LỚP ĐỆM. Người Việt thường dựa vào quan hệ và ngữ cảnh để làm mềm bất đồng — « thôi để xem lại », im lặng, cười. Trong tranh luận Ý, sự mềm mỏng phải nằm TRONG CHÍNH NGÔN TỪ: « Non sono del tutto d'accordo », « Questo punto mi sembra discutibile ». Nói thẳng « Hai torto » (Anh sai rồi) bị xem là thô lỗ.\n\n(b) ĐỪNG TẤN CÔNG NGƯỜI, HÃY PHÊ Ý. Nói « questa proposta », « questo argomento », « questo punto » — không nói « tu » (anh/chị). Đây là quy tắc bất di bất dịch.\n\n(c) TRÁNH TỪ TUYỆT ĐỐI khi bằng chứng yếu: « sempre », « mai », « tutti », « nessuno ». Thay bằng « spesso », « raramente », « molti », « pochi ».\n\n(d) MỘT CÂU TRẢ LỜI MẠNH PHẢI CÓ GIỚI HẠN, không chỉ ý kiến. « A condizione che… », « Il limite principale è che… » nâng câu trả lời từ « nêu quan điểm » lên « tư duy phản biện ».\n\nBẫy hay gặp: bắt đầu câu bằng « No » quá thường xuyên. Dùng « Capisco il punto, però… » để mở.",
    cultural_notes_en:
      "In Italian academic and workplace debate, 'pensiero critico' (critical thinking) doesn't mean harsh criticism — it means PRECISION. At C1, Italians judge you on five implicit questions: (1) What's the claim? (2) What's the evidence? (3) Where are the limits? (4) Is there an alternative explanation? (5) What's a reasonable conclusion?\n\nKey cultural differences: (a) DISAGREEMENT NEEDS A CUSHION. Where some cultures soften dissent through relationship and context — silence, a smile, 'let's review it' — Italian debate puts the softening IN THE WORDS THEMSELVES: 'Non sono del tutto d'accordo', 'Questo punto mi sembra discutibile'. A blunt 'Hai torto' ('You're wrong') reads as rude. (b) ATTACK THE IDEA, NOT THE PERSON — say 'questa proposta', 'questo argomento', 'questo punto', not 'tu'. This is non-negotiable. (c) AVOID ABSOLUTES when evidence is thin: 'sempre', 'mai', 'tutti', 'nessuno' → use 'spesso', 'raramente', 'molti', 'pochi'. (d) A STRONG ANSWER INCLUDES A LIMIT, not just an opinion — 'A condizione che…', 'Il limite principale è che…' lifts a reply from 'stating a view' to 'critical thinking'.\n\nCommon trap: opening too many sentences with 'No'. Use 'Capisco il punto, però…' to open instead.",
    tip_advice_vi:
      "Khung « câu trả lời C1 » để vừa nêu quan điểm vừa thể hiện tư duy phản biện:\n\n« A mio avviso, ___. Da un lato, ___; dall'altro, ___. Il limite principale è che ___. Per questo, una soluzione equilibrata potrebbe essere ___. »\n\n(theo tôi… một mặt… mặt khác… giới hạn chính là… vì vậy giải pháp cân bằng có thể là…)\n\nĐỒNG TÌNH CÓ SẮC THÁI (đừng chỉ « Sì »):\n- « Sono d'accordo in linea generale. »\n- « Condivido questo punto, ma con una riserva. »\n- « Mi sembra un'osservazione valida. »\n\nPHẢN ĐỐI KHÔNG THÔ LỖ:\n- « Hai torto » → « Non sono del tutto d'accordo. »\n- « Questo è sbagliato » → « Questo punto mi sembra discutibile. »\n- « Non capisci » → « Forse stiamo guardando il problema da prospettive diverse. »\n\nĐÁNH GIÁ BẰNG CHỨNG (cụm vàng C1):\n- « I dati suggeriscono che… » (dữ liệu cho thấy)\n- « Non abbiamo prove sufficienti per dire che… » (chưa đủ bằng chứng)\n- « Bisogna distinguere tra correlazione e causa. »\n- « Potrebbe esserci un'altra spiegazione. »\n\nCÂU THÁCH THỨC LỊCH SỰ (challenge mà không gây hấn):\n- « Capisco il punto, però mi chiedo se… »\n- « È un'ipotesi interessante, ma quali dati la confermano? »\n- « Questo vale in tutti i casi o solo in alcuni contesti? »\n\nQuy tắc bản lề: mỗi lần nêu ý kiến, hãy gắn kèm MỘT giới hạn hoặc MỘT điều kiện. Đó là ranh giới giữa B2 và C1.",
    tip_advice_en:
      "A 'C1 answer' frame that states a view AND shows critical thinking:\n\n'A mio avviso, ___. Da un lato, ___; dall'altro, ___. Il limite principale è che ___. Per questo, una soluzione equilibrata potrebbe essere ___.'\n\nNUANCED AGREEMENT (don't just say 'Sì'): 'Sono d'accordo in linea generale.' / 'Condivido questo punto, ma con una riserva.' / 'Mi sembra un'osservazione valida.'\n\nDISAGREEMENT WITHOUT RUDENESS: 'Hai torto' → 'Non sono del tutto d'accordo.' / 'Questo è sbagliato' → 'Questo punto mi sembra discutibile.' / 'Non capisci' → 'Forse stiamo guardando il problema da prospettive diverse.'\n\nEVALUATING EVIDENCE (C1 gold): 'I dati suggeriscono che…' / 'Non abbiamo prove sufficienti per dire che…' / 'Bisogna distinguere tra correlazione e causa.' / 'Potrebbe esserci un'altra spiegazione.'\n\nPOLITE CHALLENGE FRAMES: 'Capisco il punto, però mi chiedo se…' / 'È un'ipotesi interessante, ma quali dati la confermano?' / 'Questo vale in tutti i casi o solo in alcuni contesti?'\n\nThe hinge rule: every time you state a view, attach ONE limit or ONE condition. That's the line between B2 and C1.",
    vocabulary: [
      {
        word: "condividere un punto",
        en: "to share / endorse a point",
        vi: "đồng tình với một luận điểm",
        pos: "v.",
        pronunciation_vi: "kon-di-VÍ-de-re un PÚN-to",
        pronunciation_en: "kon-dee-VEE-deh-reh oon POON-toh — also literally 'to share', but in debate = 'to agree with'",
      },
      {
        word: "discutibile",
        en: "debatable / questionable",
        vi: "còn phải bàn / đáng ngờ",
        pos: "adj.",
        pronunciation_vi: "di-sku-TÍ-bi-le",
        pronunciation_en: "dee-skoo-TEE-bee-leh — a polite way to flag a weak point without saying 'sbagliato'",
      },
      {
        word: "una riserva",
        en: "a reservation / caveat",
        vi: "một điều dè dặt / lưu ý",
        pos: "n.f.",
        pronunciation_vi: "ú-na ri-SÈR-va",
        pronunciation_en: "OO-nah ree-SER-vah — 'con una riserva' = 'with one caveat'; the s = 'z'",
      },
      {
        word: "distinguere tra correlazione e causa",
        en: "to distinguish correlation from cause",
        vi: "phân biệt tương quan và nguyên nhân",
        pos: "v.",
        pronunciation_vi: "di-STÍN-gue-re tra kor-re-la-TSIÔ-ne e KÀU-za",
        pronunciation_en: "dee-STEEN-gweh-reh trah kor-reh-lah-TSYOH-neh eh KOW-zah — the C1 analytical move par excellence",
      },
      {
        word: "le prove sono sufficienti",
        en: "the evidence is sufficient",
        vi: "bằng chứng đủ thuyết phục",
        pos: "loc.",
        pronunciation_vi: "le PRÔ-ve sono suf-fi-CIÈN-ti",
        pronunciation_en: "leh PRO-veh so-no soof-fee-CHEN-tee — 'prova' (evidence) vs 'prova' (rehearsal) is context-driven",
      },
      {
        word: "affidabile",
        en: "reliable / trustworthy",
        vi: "đáng tin cậy",
        pos: "adj.",
        pronunciation_vi: "af-fi-DÀ-bi-le",
        pronunciation_en: "af-fee-DAH-bee-leh — 'la fonte è affidabile?' = 'is the source reliable?'; double f",
      },
      {
        word: "una spiegazione alternativa",
        en: "an alternative explanation",
        vi: "một cách giải thích khác",
        pos: "n.f.",
        pronunciation_vi: "ú-na spie-ga-TSIÔ-ne al-ter-na-TÍ-va",
        pronunciation_en: "OO-nah spyeh-gah-TSYOH-neh al-ter-nah-TEE-vah — 'potrebbe esserci…' = 'there might be…'",
      },
      {
        word: "il limite principale",
        en: "the main limitation",
        vi: "giới hạn chính",
        pos: "n.m.",
        pronunciation_vi: "il LÍ-mi-te prin-ci-PÀ-le",
        pronunciation_en: "eel LEE-mee-teh preen-chee-PAH-leh — note: 'limite' stresses the FIRST syllable",
      },
      {
        word: "trovare un equilibrio tra",
        en: "to strike a balance between",
        vi: "tìm sự cân bằng giữa",
        pos: "v.",
        pronunciation_vi: "tro-VÀ-re un e-kui-LÍ-brio tra",
        pronunciation_en: "tro-VAH-reh oon eh-kwee-LEE-bryo trah — 'equilibrio' stresses -LEE-, qu = 'kw'",
      },
    ],
    dialogue: [
      {
        speaker: "Giulia",
        text: "Molti giovani leggono le notizie sui social, quindi i social sono la fonte migliore.",
        vi: "Nhiều người trẻ đọc tin tức trên mạng xã hội, vậy nên mạng xã hội là nguồn tốt nhất.",
        en: "Lots of young people read the news on social media, so social media is the best source.",
      },
      {
        speaker: "Khanh",
        text: "Capisco il punto, però mi chiedo se la popolarità di una fonte ne provi davvero l'affidabilità.",
        vi: "Mình hiểu ý bạn, nhưng mình tự hỏi liệu độ phổ biến của một nguồn có thực sự chứng minh độ đáng tin của nó không.",
        en: "I see your point, but I wonder whether a source's popularity really proves its reliability.",
      },
      {
        speaker: "Giulia",
        text: "In che senso? Se tutti lo leggono, qualcosa di valido ci sarà.",
        vi: "Ý bạn là sao? Nếu ai cũng đọc thì hẳn phải có gì đó đáng giá chứ.",
        en: "How do you mean? If everyone reads it, there must be something valid to it.",
      },
      {
        speaker: "Khanh",
        text: "Forse, ma bisogna distinguere tra popolarità e affidabilità. Un contenuto molto condiviso non è necessariamente vero.",
        vi: "Có thể, nhưng cần phân biệt giữa độ phổ biến và độ đáng tin. Một nội dung được chia sẻ nhiều không nhất thiết là đúng.",
        en: "Maybe, but we need to distinguish popularity from reliability. A widely shared piece of content isn't necessarily true.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Moderatore (dibattito di classe)",
        text: "Il tema di oggi: 'I social media sono una buona fonte di informazione?'. Khanh, apre lei.",
        vi: "Chủ đề hôm nay: « Mạng xã hội có phải là nguồn thông tin tốt không? ». Khanh, em mở đầu.",
        en: "Today's topic: 'Is social media a good source of information?'. Khanh, you open.",
      },
      {
        speaker: "Khanh",
        text: "La risposta, a mio avviso, dipende dal modo in cui vengono usati. Da un lato, i social permettono di ricevere notizie rapidamente; dall'altro, non sempre le informazioni sono verificate.",
        vi: "Theo em, câu trả lời phụ thuộc vào cách sử dụng. Một mặt, mạng xã hội cho phép nhận tin nhanh; mặt khác, thông tin không phải lúc nào cũng được kiểm chứng.",
        en: "The answer, in my view, depends on how they're used. On one hand, social media lets you get news fast; on the other, the information isn't always verified.",
      },
      {
        speaker: "Giulia",
        text: "Ma i giornali tradizionali sono lenti e a volte di parte. Almeno sui social senti tante voci.",
        vi: "Nhưng báo truyền thống thì chậm và đôi khi thiên vị. Ít nhất trên mạng xã hội bạn nghe được nhiều tiếng nói.",
        en: "But traditional papers are slow and sometimes biased. At least on social media you hear many voices.",
      },
      {
        speaker: "Khanh",
        text: "Condivido questo punto, ma con una riserva: tante voci non significano voci affidabili. Il rischio principale è confondere popolarità e affidabilità.",
        vi: "Mình đồng tình với điểm này, nhưng có một điều lưu ý: nhiều tiếng nói không có nghĩa là tiếng nói đáng tin. Rủi ro chính là nhầm lẫn giữa độ phổ biến và độ đáng tin.",
        en: "I share that point, but with one caveat: many voices doesn't mean reliable voices. The main risk is confusing popularity with reliability.",
      },
      {
        speaker: "Giulia",
        text: "Però non puoi dire che siano tutti inaffidabili. Molti esperti pubblicano direttamente sui social.",
        vi: "Nhưng bạn không thể nói tất cả đều không đáng tin. Nhiều chuyên gia đăng trực tiếp trên mạng xã hội.",
        en: "But you can't say they're all unreliable. Many experts publish directly on social media.",
      },
      {
        speaker: "Khanh",
        text: "Giusto, e infatti non lo direi. Bisogna distinguere caso per caso. Mi sembra un'osservazione valida la tua: la fonte conta più della piattaforma.",
        vi: "Đúng, và thực ra mình không nói thế. Cần phân biệt từng trường hợp. Mình thấy nhận xét của bạn có giá trị: nguồn quan trọng hơn nền tảng.",
        en: "Fair, and indeed I wouldn't say that. We have to judge case by case. I think your observation is valid: the source matters more than the platform.",
      },
      {
        speaker: "Moderatore",
        text: "Khanh, le faccio la domanda critica: questo vale in tutti i casi o solo in alcuni contesti?",
        vi: "Khanh, thầy hỏi em câu phản biện: điều đó đúng trong mọi trường hợp hay chỉ trong một số bối cảnh?",
        en: "Khanh, the critical question: does this hold in all cases, or only in some contexts?",
      },
      {
        speaker: "Khanh",
        text: "Solo in alcuni. Per le notizie urgenti, i social sono utili come punto di partenza. Per le decisioni importanti, però, le informazioni andrebbero controllate attraverso fonti più affidabili.",
        vi: "Chỉ trong một số thôi ạ. Với tin khẩn, mạng xã hội hữu ích như một điểm khởi đầu. Nhưng với những quyết định quan trọng, thông tin nên được kiểm tra qua các nguồn đáng tin hơn.",
        en: "Only in some. For urgent news, social media is useful as a starting point. For important decisions, though, the information should be checked against more reliable sources.",
      },
      {
        speaker: "Giulia",
        text: "Su questo siamo d'accordo. Forse stavamo guardando lo stesso problema da prospettive diverse.",
        vi: "Về điểm này thì chúng ta đồng ý. Có lẽ chúng ta đang nhìn cùng một vấn đề từ những góc độ khác nhau.",
        en: "On that we agree. Maybe we were looking at the same problem from different perspectives.",
      },
      {
        speaker: "Moderatore",
        text: "Ecco un buon dibattito C1: nessuno ha 'vinto', ma entrambi avete distinto, qualificato e concluso con equilibrio.",
        vi: "Đây mới là một cuộc tranh luận C1 tốt: không ai « thắng », nhưng cả hai đã phân biệt, làm rõ sắc thái và kết luận một cách cân bằng.",
        en: "That's a good C1 debate: no one 'won', but you both distinguished, qualified, and concluded with balance.",
      },
    ],
    roleplay_prompts: [
      "Một đồng nghiệp khẳng định: « Il lavoro da remoto è sempre migliore del lavoro in ufficio. » Hãy phản biện lịch sự: thừa nhận một lợi thế (« È vero che… »), rồi nêu một giới hạn (« tuttavia… ») và kết bằng một giải pháp cân bằng.",
      "Bạn nghe câu: « Le regole severe migliorano sempre la sicurezza. » Hãy thách thức từ tuyệt đối « sempre » bằng một câu hỏi phản biện và một điều kiện (« a condizione che… »).",
      "Trong cuộc họp, ai đó trình bày một biểu đồ và nói nó « chứng minh » một xu hướng. Hãy đặt câu hỏi đánh giá bằng chứng: nguồn có đáng tin không? mẫu có đại diện không? có cách giải thích khác không?",
    ],
    roleplay_prompts_en: [
      "A colleague asserts: 'Remote work is always better than office work.' Push back politely: concede an advantage ('È vero che…'), then name a limit ('tuttavia…'), and close with a balanced solution.",
      "You hear: 'Strict rules always improve safety.' Challenge the absolute 'sempre' with a critical question and a condition ('a condizione che…').",
      "In a meeting, someone shows a chart and says it 'proves' a trend. Ask evidence-evaluating questions: is the source reliable? is the sample representative? is there an alternative explanation?",
    ],
    register_notes:
      "Ngôn ngữ phản biện C1 sống ở register lịch sự-trang trọng, không hung hăng:\n\n- SOFTENER TRONG NGÔN TỪ, không dựa vào ngữ điệu: « non sono del tutto d'accordo », « mi sembra discutibile », « avrei qualche dubbio ». Thiếu softener = đọc thô.\n- ĐIỀU KIỆN CÁCH (condizionale) để hạ giọng khẳng định: « potrebbe esserci », « andrebbe controllato », « sarebbe utile » thay « c'è », « va controllato », « è utile ».\n- THỨC GIẢ ĐỊNH sau hoài nghi/khả năng: « non credo che sia », « mi chiedo se valga », « benché sembri convincente ».\n- TRÁNH TỪ TUYỆT ĐỐI khi bằng chứng yếu (« sempre / mai / tutti / nessuno »); thay bằng « spesso / raramente / molti / pochi ».\n\nCỤM CHUYỂN PHẢN BIỆN: « in primo luogo », « al contrario », « per contro », « detto questo », « ciò non toglie che », « resta da chiarire se ».\n\nTRÁNH: mở câu bằng « No » liên tục; tấn công người (« tu non… ») thay vì ý (« questa proposta… »); « secondo me » lặp lại — luân phiên với « a mio avviso », « dal mio punto di vista », « ritengo che ».",
    register_notes_en:
      "C1 critical-thinking language lives in a polite-formal, non-aggressive register:\n\n- SOFTENERS IN THE WORDS, not just the tone: 'non sono del tutto d'accordo', 'mi sembra discutibile', 'avrei qualche dubbio'. Missing softeners reads as blunt.\n- CONDITIONAL MOOD to lower the force of claims: 'potrebbe esserci', 'andrebbe controllato', 'sarebbe utile' over 'c'è', 'va controllato', 'è utile'.\n- SUBJUNCTIVE after doubt/possibility: 'non credo che sia', 'mi chiedo se valga', 'benché sembri convincente'.\n- AVOID ABSOLUTES when evidence is thin ('sempre / mai / tutti / nessuno'); use 'spesso / raramente / molti / pochi'.\n\nCritical connectors: 'in primo luogo', 'al contrario', 'per contro', 'detto questo', 'ciò non toglie che', 'resta da chiarire se'.\n\nAvoid: opening repeatedly with 'No'; attacking the person ('tu non…') rather than the idea ('questa proposta…'); repeating 'secondo me' — rotate with 'a mio avviso', 'dal mio punto di vista', 'ritengo che'.",
    idiom_glosses: [
      {
        idiom: "detto questo (idiomatico)",
        literal: "đã nói điều này",
        literal_en: "this said",
        meaning: "Tuy nhiên / dù vậy — chuyển từ một nhượng bộ sang một giới hạn, rất thông dụng trong tranh luận.",
        meaning_en: "That said / having said that — pivots from a concession to a qualification; a debate workhorse.",
        example: "Il servizio è migliorato. Detto questo, restano problemi sugli orari.",
        example_en: "The service has improved. That said, problems with the timetables remain.",
      },
      {
        idiom: "ciò non toglie che (formale)",
        literal: "điều đó không lấy đi việc rằng",
        literal_en: "that does not remove that",
        meaning: "Điều đó không có nghĩa là không / dù sao vẫn — thừa nhận một điểm nhưng giữ lập trường (đi với congiuntivo).",
        meaning_en: "That doesn't change the fact that / even so — concedes a point while holding your ground (takes the subjunctive).",
        example: "I dati sono parziali; ciò non toglie che il problema sia reale.",
        example_en: "The data is partial; even so, the problem is real.",
      },
      {
        idiom: "prendere con le pinze (idiomatico)",
        literal: "cầm bằng cái kẹp",
        literal_en: "to take with tongs",
        meaning: "Tiếp nhận một cách dè dặt, không tin ngay — như tiếng Anh 'take with a pinch of salt'.",
        meaning_en: "To take with a pinch of salt — to treat a claim cautiously rather than accept it outright.",
        example: "Questi sondaggi vanno presi con le pinze: il campione è piccolo.",
        example_en: "These polls should be taken with a pinch of salt: the sample is small.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Capisco il punto, ___ mi chiedo se la popolarità provi l'affidabilità.",
        answer: "però",
        hint_vi: "Liên từ đối lập mở đầu một câu thách thức lịch sự (nhưng / tuy nhiên)",
        hint_en: "The contrastive connector that opens a polite challenge ('but / however')",
      },
      {
        type: "matching",
        pairs: [
          ["Non sono del tutto d'accordo", "Tôi không hoàn toàn đồng ý (soften 'you're wrong')"],
          ["Questo punto mi sembra discutibile", "Điểm này còn phải bàn (this point seems debatable)"],
          ["Bisogna distinguere tra correlazione e causa", "Cần phân biệt tương quan và nguyên nhân"],
          ["Potrebbe esserci un'altra spiegazione", "Có thể có cách giải thích khác"],
        ],
        instruction: "Nối câu phản biện tiếng Ý với nghĩa/chức năng",
        instruction_en: "Match the Italian critical-thinking line with its meaning/function",
      },
      {
        type: "translation",
        vietnamese: "Đúng là nó hữu ích, tuy nhiên cần phân biệt giữa độ phổ biến và độ đáng tin.",
        italian: "È vero che è utile, tuttavia bisogna distinguere tra popolarità e affidabilità.",
        english: "It's true that it's useful; however, we must distinguish between popularity and reliability.",
      },
    ],
  },

  // ── 3. Professional email at C1 ───────────────────────────────────────
  {
    id: "lemail_professionale",
    level: "C1",
    category: "workplace",
    title_vi: "Email công việc C1: yêu cầu, khiếu nại và thương lượng với giọng vừa cứng vừa lịch sự",
    title_en: "C1 professional email: requests, complaints and negotiation with firm-but-polite tone",
    sentences: [
      {
        en: "I am writing to you regarding the employment contract sent to me yesterday.",
        vi: "Tôi viết thư liên quan đến hợp đồng lao động đã được gửi cho tôi hôm qua.",
        pronunciation_focus: [
          "scrivo → SKRÍ-vo ('sc' + r = 'skr')",
          "merito → MÉ-ri-to (nhấn âm đầu)",
          "contratto → kon-TRÀT-to (t đôi giữ dài)",
        ],
        pronunciation_focus_en: [
          "scrivo → 'SKREE-vo' ('sc' before r = 'skr')",
          "merito → 'MEH-ree-toh' (stress on first syllable)",
          "contratto → 'kon-TRAHT-toh' (hold the double t)",
        ],
      },
      {
        en: "I would be grateful if you could send me the document by Friday.",
        vi: "Tôi sẽ rất biết ơn nếu anh/chị có thể gửi tài liệu cho tôi trước thứ Sáu.",
        pronunciation_focus: [
          "grato → GRÀ-to (chùm 'gr')",
          "potesse → po-TÉS-se (s đôi; subjunctive)",
          "venerdì → ve-ner-DÌ (nhấn âm cuối có dấu)",
        ],
        pronunciation_focus_en: [
          "grato → 'GRAH-toh' (clean 'gr' cluster)",
          "potesse → 'po-TES-seh' (double s; imperfect subjunctive)",
          "venerdì → 'veh-ner-DEE' (final-syllable stress from the accent)",
        ],
      },
      {
        en: "I should like to report a service failure regarding the delivery scheduled for 12 June.",
        vi: "Tôi muốn báo về một sự cố dịch vụ liên quan đến đợt giao hàng dự kiến ngày 12 tháng 6.",
        pronunciation_focus: [
          "segnalare → se-nya-LÀ-re ('gn' = 'ny' như 'nh' tiếng Việt)",
          "disservizio → dis-ser-VÍ-tsio (s đôi; -zio = 'tsio')",
          "consegna → kon-SÉ-nya ('gn' = 'ny')",
        ],
        pronunciation_focus_en: [
          "segnalare → 'seh-nyah-LAH-reh' ('gn' = 'ny' as in canyon)",
          "disservizio → 'dees-ser-VEE-tsyo' (double s; -zio = 'tsyo')",
          "consegna → 'kon-SEH-nyah' ('gn' = 'ny')",
        ],
      },
      {
        en: "I therefore propose sending a first draft on Friday and the final version on Monday by noon.",
        vi: "Vì vậy tôi đề xuất gửi bản nháp đầu tiên vào thứ Sáu và bản cuối cùng vào thứ Hai trước trưa.",
        pronunciation_focus: [
          "propongo → pro-PÔN-go (nhấn -PÔN-)",
          "bozza → BÔT-tsa (zz = 'ts' đôi, giữ dài)",
          "definitiva → de-fi-ni-TÍ-va",
        ],
        pronunciation_focus_en: [
          "propongo → 'pro-PON-go' (stress on -PON-)",
          "bozza → 'BOT-tsah' (zz = a long 'ts')",
          "definitiva → 'deh-fee-nee-TEE-vah'",
        ],
      },
      {
        en: "I remain available for any clarifications and thank you in advance.",
        vi: "Tôi sẵn sàng nếu cần làm rõ thêm và xin cảm ơn anh/chị trước.",
        pronunciation_focus: [
          "disposizione → di-spo-zi-TSIÔ-ne (s = 'z'; -zione = 'tsione')",
          "chiarimenti → kia-ri-MÉN-ti ('chi' = 'ki' cứng)",
          "ringrazio → rin-GRÀ-tsio (-zio = 'tsio')",
        ],
        pronunciation_focus_en: [
          "disposizione → 'dees-po-zee-TSYOH-neh' (s = 'z'; -zione = 'TSYOH-neh')",
          "chiarimenti → 'kyah-ree-MEN-tee' ('chi' = hard 'ky')",
          "ringrazio → 'reen-GRAH-tsyo' (-zio = 'tsyo')",
        ],
      },
    ],
    cultural_notes_vi:
      "Email công việc tiếng Ý ở mức C1 không chỉ « đúng ngữ pháp » — nó kiểm soát GIỌNG, THỨ BẬC, THỜI ĐIỂM, RỦI RO và BƯỚC TIẾP THEO. Người viết phải nghe vừa chính xác mà không lạnh lùng, vừa cứng rắn mà không hung hăng, vừa súc tích mà không thiếu ngữ cảnh.\n\nNgười Việt mới đi làm ở Ý hay vấp ba lỗi register:\n\n(1) QUÁ THẲNG (dịch thẳng từ tiếng Việt mệnh lệnh): « Mandami subito il documento. » → thô. Phải là « Le sarei grato/a se potesse inviarmi il documento entro venerdì. » Lịch sự nhưng vẫn có hạn rõ.\n\n(2) QUÁ XIN LỖI (văn hoá khiêm nhường Việt dịch sai): « Scusi tanto, forse disturbo… » → nghe phục tùng. Email chuyên nghiệp không cần xin lỗi vì đã viết: « Le scrivo per chiederLe un chiarimento. »\n\n(3) KHIẾU NẠI CẢM TÍNH: « Questo non va bene, sono arrabbiato. » → mất uy tín. Nêu ẢNH HƯỞNG thay vì cảm xúc: « La situazione sta causando un ritardo operativo. »\n\nThang xưng hô (« register ladder ») rất quan trọng:\n- « Buongiorno, » → email công việc trung tính hằng ngày.\n- « Gentile Dott.ssa Rossi, » → người nhận chuyên nghiệp, có tên.\n- « Spett.le Ufficio, » → gửi văn phòng/công ty.\n- « Ciao Marco, » → đồng nghiệp đã quen.\n- « Con riferimento alla comunicazione del… » → khiếu nại/leo thang.\n\nLƯU Ý NGÔI: tiếng Ý trang trọng dùng ngôi « Lei » (viết hoa khi tôn trọng: « La ringrazio », « un Suo riscontro »). Đừng dùng « tu » với người chưa quen — đây là lỗi văn hoá nặng, không chỉ là lỗi ngữ pháp.",
    cultural_notes_en:
      "A C1 Italian work email isn't just 'grammatically correct' — it controls TONE, HIERARCHY, TIMING, RISK and NEXT STEPS. The writer must sound precise without being cold, firm without being aggressive, concise without losing context.\n\nThree register traps for newcomers: (1) TOO DIRECT (calquing an imperative): 'Mandami subito il documento.' → rude. Use 'Le sarei grato/a se potesse inviarmi il documento entro venerdì.' — polite, yet with a clear deadline. (2) OVER-APOLOGY: 'Scusi tanto, forse disturbo…' → sounds submissive. A professional email needn't apologise for existing: 'Le scrivo per chiederLe un chiarimento.' (3) EMOTIONAL COMPLAINT: 'Questo non va bene, sono arrabbiato.' → loses credibility. State the IMPACT, not the feeling: 'La situazione sta causando un ritardo operativo.'\n\nThe 'register ladder' matters: 'Buongiorno,' (neutral daily), 'Gentile Dott.ssa Rossi,' (named professional), 'Spett.le Ufficio,' (to an office/company), 'Ciao Marco,' (a colleague you know), 'Con riferimento alla comunicazione del…' (complaint/escalation).\n\nA NOTE ON 'YOU': formal Italian uses 'Lei', capitalised out of respect ('La ringrazio', 'un Suo riscontro'). Using 'tu' with someone you don't know is a serious cultural error, not just a grammar slip.",
    tip_advice_vi:
      "Cấu trúc 6 phần cho một email công việc C1:\n\n(1) OGGETTO (chủ đề) — chính xác, không mơ hồ: « Richiesta chiarimenti su contratto di lavoro ».\n(2) APERTURA — chào đúng thang xưng hô: « Gentile Sig.ra Ferri, ».\n(3) CONTESTO — vì sao viết: « Le scrivo in merito al contratto ricevuto ieri. »\n(4) RICHIESTA — cần gì, nêu rõ đối tượng: « Avrei bisogno di un chiarimento sull'orario settimanale. »\n(5) SCADENZA/AZIONE — bước tiếp theo có hạn: « Sarebbe possibile ricevere una risposta entro venerdì? »\n(6) CHIUSURA — kết chuyên nghiệp: « Resto a disposizione e La ringrazio. »\n\nNÂNG GIỌNG (vừa cứng vừa lịch sự):\n- « Mi serve il documento » → « Le sarei grato/a se potesse inviarmi il documento. »\n- « Il pacco non arriva » → « Desidero segnalare che la consegna prevista non è stata effettuata. »\n- « Rispondete presto » → « Vi chiedo cortesemente un riscontro entro domani. »\n\nCỤM EMAIL GIÁ TRỊ CAO:\n- « Le scrivo in merito a… » (mở chủ đề)\n- « Con riferimento a quanto concordato… » (theo dõi)\n- « Alla luce di quanto sopra… » (chuyển ý C1)\n- « Resto a disposizione per eventuali chiarimenti. » (kết)\n- « In attesa di un Suo gentile riscontro… » (kết trang trọng)\n- « entro e non oltre il 20 giugno » (hạn chót cứng)\n\nMẸO THƯƠNG LƯỢNG: khi không kịp hạn, đừng chỉ xin lùi — hãy ĐỀ XUẤT PHƯƠNG ÁN: « Le propongo di inviare una prima bozza venerdì e la versione definitiva lunedì entro le 12:00. » Điều này giữ dự án tiến tới mà không hy sinh chất lượng.",
    tip_advice_en:
      "A 6-part structure for a C1 work email:\n(1) OGGETTO (subject) — precise, never vague: 'Richiesta chiarimenti su contratto di lavoro'.\n(2) APERTURA — greet at the right rung: 'Gentile Sig.ra Ferri,'.\n(3) CONTESTO — why you're writing: 'Le scrivo in merito al contratto ricevuto ieri.'\n(4) RICHIESTA — what's needed, name the object: 'Avrei bisogno di un chiarimento sull'orario settimanale.'\n(5) SCADENZA/AZIONE — a dated next step: 'Sarebbe possibile ricevere una risposta entro venerdì?'\n(6) CHIUSURA — a professional close: 'Resto a disposizione e La ringrazio.'\n\nUPGRADE THE TONE (firm but polite): 'Mi serve il documento' → 'Le sarei grato/a se potesse inviarmi il documento.' / 'Il pacco non arriva' → 'Desidero segnalare che la consegna prevista non è stata effettuata.' / 'Rispondete presto' → 'Vi chiedo cortesemente un riscontro entro domani.'\n\nHIGH-VALUE PHRASES: 'Le scrivo in merito a…' (topic opener), 'Con riferimento a quanto concordato…' (follow-up), 'Alla luce di quanto sopra…' (C1 transition), 'Resto a disposizione per eventuali chiarimenti.' (close), 'In attesa di un Suo gentile riscontro…' (formal close), 'entro e non oltre il 20 giugno' (hard deadline).\n\nNEGOTIATION TIP: when you can't meet a deadline, don't merely ask for an extension — PROPOSE AN ALTERNATIVE: 'Le propongo di inviare una prima bozza venerdì e la versione definitiva lunedì entro le 12:00.' It keeps the project moving without sacrificing quality.",
    vocabulary: [
      {
        word: "Le scrivo in merito a",
        en: "I'm writing to you regarding",
        vi: "tôi viết liên quan đến",
        pos: "loc.",
        pronunciation_vi: "le SKRÍ-vo in MÉ-ri-to a",
        pronunciation_en: "leh SKREE-vo een MEH-ree-toh ah — 'Le' = formal 'to you' (Lei); the standard topic opener",
      },
      {
        word: "Le sarei grato/a se potesse",
        en: "I would be grateful if you could",
        vi: "tôi sẽ rất biết ơn nếu anh/chị có thể",
        pos: "loc.",
        pronunciation_vi: "le sa-RÈI GRÀ-to/a se po-TÉS-se",
        pronunciation_en: "leh sah-RAY GRAH-toh seh po-TES-seh — conditional + imperfect subjunctive = top-tier politeness",
      },
      {
        word: "segnalare un disservizio",
        en: "to report a service failure",
        vi: "báo một sự cố dịch vụ",
        pos: "v.",
        pronunciation_vi: "se-nya-LÀ-re un dis-ser-VÍ-tsio",
        pronunciation_en: "seh-nyah-LAH-reh oon dees-ser-VEE-tsyo — 'gn' = 'ny'; neutral, professional verb for complaints",
      },
      {
        word: "resto a disposizione",
        en: "I remain available",
        vi: "tôi sẵn sàng (nếu cần)",
        pos: "loc.",
        pronunciation_vi: "RÈS-to a di-spo-zi-TSIÔ-ne",
        pronunciation_en: "RES-toh ah dees-po-zee-TSYOH-neh — a standard professional sign-off before the greeting",
      },
      {
        word: "un riscontro",
        en: "a reply / feedback",
        vi: "phản hồi",
        pos: "n.m.",
        pronunciation_vi: "un ri-SKÔN-tro ('sc' + chùm 'ntr')",
        pronunciation_en: "oon ree-SKON-tro — more formal than 'risposta'; 'in attesa di un Suo riscontro'",
      },
      {
        word: "entro e non oltre",
        en: "by (and no later than)",
        vi: "chậm nhất là",
        pos: "loc.",
        pronunciation_vi: "ÉN-tro e non ÔL-tre",
        pronunciation_en: "EN-tro eh non OL-treh — a firm, unambiguous deadline marker for contracts and escalations",
      },
      {
        word: "alla luce di quanto sopra",
        en: "in light of the above",
        vi: "dựa trên những điều nêu trên",
        pos: "loc.",
        pronunciation_vi: "al-la LÚ-ce di KUÀN-to SÔ-pra",
        pronunciation_en: "ah-lah LOO-cheh dee KWAN-toh SO-prah — a C1 transition that ties a request to prior context",
      },
      {
        word: "cortesemente",
        en: "kindly / courteously",
        vi: "một cách lịch sự",
        pos: "adv.",
        pronunciation_vi: "kor-te-ze-MÉN-te",
        pronunciation_en: "kor-teh-zeh-MEN-teh — 'Vi chiedo cortesemente…' softens a firm request without weakening it",
      },
      {
        word: "qualora fosse necessario",
        en: "should it be necessary",
        vi: "nếu cần thiết",
        pos: "loc.",
        pronunciation_vi: "kua-LÔ-ra FÔS-se ne-ces-SÀ-rio",
        pronunciation_en: "kwah-LO-rah FOS-seh neh-ches-SAH-ryo — 'qualora' takes the subjunctive; very formal 'if'",
      },
    ],
    dialogue: [
      {
        speaker: "Collega (Marco)",
        text: "Lan, hai scritto al fornitore per il ritardo? Stavo per mandargli un messaggio arrabbiato.",
        vi: "Lan, cậu viết cho nhà cung cấp về việc trễ hàng chưa? Tớ đang định gửi cho họ một tin nhắn bực bội.",
        en: "Lan, did you write to the supplier about the delay? I was about to send them an angry message.",
      },
      {
        speaker: "Lan",
        text: "Aspetta, meglio non scrivere arrabbiati. Segnaliamo i fatti e l'impatto, non la rabbia.",
        vi: "Khoan đã, tốt nhất đừng viết khi đang bực. Mình báo cáo sự việc và ảnh hưởng, chứ không phải cơn giận.",
        en: "Wait — best not to write angry. We report the facts and the impact, not the anger.",
      },
      {
        speaker: "Marco",
        text: "Tipo come?",
        vi: "Kiểu như thế nào?",
        en: "Like how?",
      },
      {
        speaker: "Lan",
        text: "« Desidero segnalare che la consegna prevista per il 12 giugno non è stata effettuata. La mancata consegna sta causando un disagio organizzativo. » Fermo, ma professionale.",
        vi: "« Tôi muốn báo rằng đợt giao hàng dự kiến ngày 12 tháng 6 đã không được thực hiện. Việc không giao hàng đang gây khó khăn cho việc tổ chức công việc. » Cứng rắn, nhưng chuyên nghiệp.",
        en: "'I wish to report that the delivery scheduled for 12 June was not carried out. The missed delivery is causing organisational disruption.' Firm, but professional.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Dott. Romano (responsabile)",
        text: "Buongiorno, Minh. Ho ricevuto la sua email sulla scadenza. Mi spieghi la situazione.",
        vi: "Chào buổi sáng, Minh. Tôi đã nhận email của em về hạn nộp. Em giải thích tình hình đi.",
        en: "Good morning, Minh. I received your email about the deadline. Explain the situation to me.",
      },
      {
        speaker: "Minh",
        text: "La contatto in merito alla scadenza di venerdì. A causa di un ritardo nella ricezione dei dati, non mi sarà possibile completare il report con l'accuratezza richiesta entro quella data.",
        vi: "Em liên hệ về hạn thứ Sáu. Do chậm nhận dữ liệu, em sẽ không thể hoàn thành báo cáo với độ chính xác yêu cầu trước ngày đó.",
        en: "I'm contacting you about Friday's deadline. Due to a delay in receiving the data, I won't be able to complete the report to the required accuracy by that date.",
      },
      {
        speaker: "Dott. Romano",
        text: "Capisco. Però venerdì il cliente si aspetta qualcosa. Non posso presentarmi a mani vuote.",
        vi: "Tôi hiểu. Nhưng thứ Sáu khách hàng mong đợi một cái gì đó. Tôi không thể xuất hiện tay không.",
        en: "I understand. But on Friday the client expects something. I can't show up empty-handed.",
      },
      {
        speaker: "Minh",
        text: "Esatto, e per questo non Le chiedo solo un rinvio. Le propongo di inviare una prima bozza venerdì pomeriggio e la versione definitiva lunedì entro le 12:00.",
        vi: "Đúng vậy, và vì thế em không chỉ xin lùi hạn. Em đề xuất gửi bản nháp đầu tiên chiều thứ Sáu và bản cuối cùng vào thứ Hai trước 12:00.",
        en: "Exactly, which is why I'm not just asking for a postponement. I propose sending a first draft on Friday afternoon and the final version Monday by noon.",
      },
      {
        speaker: "Dott. Romano",
        text: "Una bozza venerdì potrebbe bastare per la riunione. La versione finale regge fino a lunedì?",
        vi: "Một bản nháp thứ Sáu có lẽ đủ cho cuộc họp. Bản cuối cùng giữ được đến thứ Hai chứ?",
        en: "A draft on Friday might be enough for the meeting. Does the final version hold until Monday?",
      },
      {
        speaker: "Minh",
        text: "Ritengo che questa soluzione permetta di mantenere il progetto in movimento senza compromettere la qualità del risultato. Resto naturalmente disponibile a valutare alternative.",
        vi: "Em cho rằng giải pháp này giúp dự án vẫn tiến tới mà không ảnh hưởng đến chất lượng kết quả. Em dĩ nhiên sẵn sàng xem xét các phương án khác.",
        en: "I believe this solution keeps the project moving without compromising the quality of the result. I naturally remain available to consider alternatives.",
      },
      {
        speaker: "Dott. Romano",
        text: "Va bene. Mi mandi una conferma scritta con le due date, così la giro al cliente.",
        vi: "Được. Em gửi cho tôi một xác nhận bằng văn bản với hai mốc thời gian, để tôi chuyển cho khách hàng.",
        en: "All right. Send me a written confirmation with the two dates, so I can forward it to the client.",
      },
      {
        speaker: "Minh",
        text: "Senz'altro. Le invio l'email entro un'ora, con oggetto 'Conferma nuove scadenze report'. La ringrazio per la disponibilità.",
        vi: "Chắc chắn rồi. Em sẽ gửi email trong vòng một giờ, với chủ đề « Conferma nuove scadenze report ». Em cảm ơn anh đã linh hoạt.",
        en: "Certainly. I'll send the email within an hour, subject 'Confirmation of new report deadlines'. Thank you for your flexibility.",
      },
      {
        speaker: "Dott. Romano",
        text: "Bene così. Apprezzo che abbia proposto una soluzione invece di limitarsi a segnalare il problema.",
        vi: "Tốt rồi. Tôi đánh giá cao việc em đã đề xuất một giải pháp thay vì chỉ báo cáo vấn đề.",
        en: "Good. I appreciate that you proposed a solution instead of just flagging the problem.",
      },
    ],
    roleplay_prompts: [
      "Viết một email C1 cho phòng Nhân sự (« Gentile Ufficio HR, ») để làm rõ số giờ làm hằng tuần: hợp đồng ghi 40 giờ nhưng buổi phỏng vấn nói 36 giờ. Phải có đủ 6 phần: oggetto, apertura, contesto, richiesta, scadenza, chiusura.",
      "Nhà cung cấp giao hàng trễ và không báo gì. Viết một email khiếu nại chuyên nghiệp: nêu sự việc + ảnh hưởng (« sta causando un disagio organizzativo »), yêu cầu một ngày giao mới đáng tin, tránh mọi ngôn ngữ cảm tính.",
      "Bạn không kịp hạn vì dữ liệu đến muộn. Đừng chỉ xin lùi — viết email đề xuất phương án (bozza + versione definitiva với hai mốc cụ thể) và kết bằng « Resto disponibile a valutare alternative. »",
    ],
    roleplay_prompts_en: [
      "Write a C1 email to HR ('Gentile Ufficio HR,') to clarify weekly working hours: the contract says 40 but the interview mentioned 36. Include all six parts: oggetto, apertura, contesto, richiesta, scadenza, chiusura.",
      "A supplier delivered late and said nothing. Write a professional complaint email: state the facts + impact ('sta causando un disagio organizzativo'), request a reliable new delivery date, and avoid any emotional language.",
      "You can't meet a deadline because data arrived late. Don't just ask for an extension — write an email proposing an alternative (draft + final version with two concrete dates) and close with 'Resto disponibile a valutare alternative.'",
    ],
    register_notes:
      "Register email công việc C1 nằm giữa « trang trọng » và « hiệu quả »:\n\n- NGÔI « LEI » VIẾT HOA khi tôn trọng: « La ringrazio », « un Suo riscontro », « se potesse ». Trộn « tu » và « Lei » trong cùng email = lỗi nặng.\n- ĐIỀU KIỆN CÁCH để lịch sự hoá yêu cầu: « Le sarei grato/a », « Sarebbe possibile », « Avrei bisogno di » — không « Voglio », « Mi serve ».\n- THỨC GIẢ ĐỊNH sau « qualora », « se potesse », « affinché »: « qualora fosse necessario », « se potesse confermare ».\n- DANH HOÁ cho giọng chuyên nghiệp: « la mancata consegna », « il ritardo nella ricezione », « la richiesta di chiarimenti ».\n\nCÂU KẾT CHUẨN (chọn theo mức trang trọng):\n- « Cordiali saluti, » → trang trọng trung tính (mặc định an toàn).\n- « Distinti saluti, » → rất trang trọng.\n- « Resto a disposizione e La ringrazio. » → chuyên nghiệp, ấm.\n- « A presto, » / « Un caro saluto, » → chỉ với đồng nghiệp đã quen.\n\nTRÁNH: emoji, dấu chấm than thừa, viết tắt khẩu ngữ (« cmq », « x » thay « per »), xin lỗi quá mức (« scusi tanto se disturbo »), và mệnh lệnh trần trụi (« mandami », « rispondete subito »).",
    register_notes_en:
      "A C1 work-email register sits between 'formal' and 'efficient':\n\n- CAPITALISED 'LEI' out of respect: 'La ringrazio', 'un Suo riscontro', 'se potesse'. Mixing 'tu' and 'Lei' in one email is a serious error.\n- CONDITIONAL MOOD to soften requests: 'Le sarei grato/a', 'Sarebbe possibile', 'Avrei bisogno di' — not 'Voglio', 'Mi serve'.\n- SUBJUNCTIVE after 'qualora', 'se potesse', 'affinché': 'qualora fosse necessario', 'se potesse confermare'.\n- NOMINALISATION for a professional tone: 'la mancata consegna', 'il ritardo nella ricezione', 'la richiesta di chiarimenti'.\n\nSTANDARD SIGN-OFFS (pick by formality): 'Cordiali saluti,' (neutral formal — the safe default); 'Distinti saluti,' (very formal); 'Resto a disposizione e La ringrazio.' (professional, warm); 'A presto,' / 'Un caro saluto,' (only with colleagues you know).\n\nAvoid: emoji, stray exclamation marks, chat abbreviations ('cmq', 'x' for 'per'), over-apology ('scusi tanto se disturbo'), and bare imperatives ('mandami', 'rispondete subito').",
    idiom_glosses: [
      {
        idiom: "restare a disposizione (formale)",
        literal: "ở lại trong sự sẵn có",
        literal_en: "to remain at (someone's) disposal",
        meaning: "Sẵn sàng hỗ trợ/làm rõ thêm — câu kết chuẩn mực, báo hiệu thiện chí mà vẫn chuyên nghiệp.",
        meaning_en: "To remain available to help/clarify — a standard professional closing that signals goodwill without servility.",
        example: "Resto a disposizione per qualsiasi ulteriore chiarimento.",
        example_en: "I remain available for any further clarification.",
      },
      {
        idiom: "con riferimento a (formale)",
        literal: "với sự tham chiếu đến",
        literal_en: "with reference to",
        meaning: "Liên quan đến (một thông báo/thoả thuận trước) — mở đầu trang trọng cho email theo dõi hoặc khiếu nại.",
        meaning_en: "With reference to (a prior message/agreement) — a formal opener for follow-ups or complaints.",
        example: "Con riferimento alla Sua email del 5 giugno, Le confermo quanto segue.",
        example_en: "With reference to your email of 5 June, I confirm the following.",
      },
      {
        idiom: "a mani vuote (idiomatico)",
        literal: "với hai bàn tay trống",
        literal_en: "with empty hands",
        meaning: "Tay không, không có kết quả để trình — dùng khi nói về việc đến họp/giao việc mà chẳng có gì.",
        meaning_en: "Empty-handed, with nothing to show — used about turning up to a meeting or deadline with no deliverable.",
        example: "Non posso presentarmi al cliente a mani vuote.",
        example_en: "I can't show up to the client empty-handed.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Le ___ grato se potesse inviarmi il documento entro venerdì.",
        answer: "sarei",
        hint_vi: "Điều kiện cách của « essere » để tạo câu yêu cầu siêu lịch sự (« Le ___ grato… »)",
        hint_en: "The conditional of 'essere' that builds the ultra-polite request 'Le ___ grato…' (I would be grateful)",
      },
      {
        type: "matching",
        pairs: [
          ["Le scrivo in merito a", "tôi viết liên quan đến (topic opener)"],
          ["Desidero segnalare un disservizio", "tôi muốn báo một sự cố dịch vụ (complaint)"],
          ["Resto a disposizione", "tôi sẵn sàng (professional close)"],
          ["entro e non oltre", "chậm nhất là (hard deadline)"],
        ],
        instruction: "Nối cụm email C1 với nghĩa/chức năng",
        instruction_en: "Match the C1 email phrase with its meaning/function",
      },
      {
        type: "translation",
        vietnamese: "Tôi muốn báo rằng đợt giao hàng dự kiến đã không được thực hiện; việc này đang gây khó khăn cho công việc.",
        italian: "Desidero segnalare che la consegna prevista non è stata effettuata; ciò sta causando un disagio organizzativo.",
        english: "I wish to report that the scheduled delivery was not carried out; this is causing organisational disruption.",
      },
    ],
  },

  // ── 4. Academic presentation register ─────────────────────────────────
  {
    id: "lpresentazione_accademica",
    level: "C1",
    category: "public_communication",
    title_vi: "Register học thuật: trình bày luận điểm, danh hoá và từ vựng chuyên môn",
    title_en: "Academic register: presenting a thesis, nominalisation and scholarly vocabulary",
    sentences: [
      {
        en: "The phenomenon cannot be explained by a single factor.",
        vi: "Hiện tượng không thể được giải thích bằng một yếu tố duy nhất.",
        pronunciation_focus: [
          "fenomeno → fe-NÔ-me-no (nhấn -NÔ-, không phải âm cuối)",
          "spiegato → spie-GÀ-to (chùm 'spi')",
          "fattore → fat-TÔ-re (t đôi giữ dài)",
        ],
        pronunciation_focus_en: [
          "fenomeno → 'feh-NO-meh-no' (stress on -NO-, not the last syllable)",
          "spiegato → 'spyeh-GAH-toh' ('spi' cluster glides to 'spy')",
          "fattore → 'fat-TOH-reh' (hold the double t)",
        ],
      },
      {
        en: "This interpretation presents some limitations.",
        vi: "Cách giải thích này có một số giới hạn.",
        pronunciation_focus: [
          "interpretazione → in-ter-pre-ta-TSIÔ-ne (chuỗi dài; -zione = 'tsione')",
          "presenta → pre-SÈN-ta",
          "limiti → LÍ-mi-ti (nhấn âm đầu)",
        ],
        pronunciation_focus_en: [
          "interpretazione → 'een-ter-preh-tah-TSYOH-neh' (long chain; -zione = 'TSYOH-neh')",
          "presenta → 'preh-SEN-tah'",
          "limiti → 'LEE-mee-tee' (stress the first syllable)",
        ],
      },
      {
        en: "The available data does not permit a definitive conclusion.",
        vi: "Dữ liệu hiện có không cho phép một kết luận dứt khoát.",
        pronunciation_focus: [
          "dati → DÀ-ti (số nhiều của 'dato')",
          "disponibili → di-spo-NÍ-bi-li",
          "definitiva → de-fi-ni-TÍ-va",
        ],
        pronunciation_focus_en: [
          "dati → 'DAH-tee' (plural of 'dato'; takes a plural verb)",
          "disponibili → 'dees-po-NEE-bee-lee'",
          "definitiva → 'deh-fee-nee-TEE-vah'",
        ],
      },
      {
        en: "It is appropriate to distinguish between immediate causes and structural causes.",
        vi: "Nên phân biệt giữa nguyên nhân tức thời và nguyên nhân cấu trúc.",
        pronunciation_focus: [
          "opportuno → op-por-TÚ-no (p đôi)",
          "immediate → im-me-DIÀ-te (m đôi mở đầu)",
          "strutturali → strut-tu-RÀ-li (chùm 'str' + t đôi)",
        ],
        pronunciation_focus_en: [
          "opportuno → 'op-por-TOO-no' (double p)",
          "immediate → 'eem-meh-DYAH-teh' (double m at the start)",
          "strutturali → 'stroot-too-RAH-lee' ('str' cluster + double t)",
        ],
      },
      {
        en: "The text adopts a critical yet balanced perspective.",
        vi: "Văn bản sử dụng một góc nhìn phê phán nhưng cân bằng.",
        pronunciation_focus: [
          "adotta → a-DÔT-ta (t đôi)",
          "prospettiva → pro-spet-TÍ-va (t đôi)",
          "equilibrata → e-kui-li-BRÀ-ta (qu = 'kw')",
        ],
        pronunciation_focus_en: [
          "adotta → 'ah-DOT-tah' (double t)",
          "prospettiva → 'pro-spet-TEE-vah' (double t)",
          "equilibrata → 'eh-kwee-lee-BRAH-tah' (qu = 'kw')",
        ],
      },
    ],
    cultural_notes_vi:
      "Trình bày học thuật bằng tiếng Ý (« esposizione accademica »: thuyết trình lớp C1, bảo vệ tesi, hội thảo) đánh giá không phải bạn biết bao nhiêu, mà bạn TRÌNH BÀY tri thức ấy với độ chính xác và sắc thái thế nào.\n\nBa kỳ vọng văn hoá:\n\n(1) DANH HOÁ (nominalizzazione) là dấu hiệu register cao nhất. Tiếng Ý học thuật chuộng « l'analisi del fenomeno » hơn « analizzare il fenomeno »; « la distinzione tra causa ed effetto » hơn « distinguere causa ed effetto ». Người Việt (và người nói tiếng Anh) thường thấy lối này « nặng nề/quan liêu » — nhưng trong tiếng Ý nó nghe « có học ». Hãy tin vào hình thức.\n\n(2) TỪ VỰNG CHÍNH XÁC, không đời thường. « buono » → « efficace »; « una cosa » → « un aspetto/elemento/fattore »; « il testo dice » → « il testo sostiene/evidenzia »; « molto » → « significativamente/notevolmente ». Lặp « problema » bị xem là nghèo vốn từ — luân phiên « questione/tema/aspetto/criticità ».\n\n(3) ĐỘNG TỪ HỌC THUẬT có cú pháp riêng: « sostenere che » (cho rằng), « evidenziare che » (nhấn mạnh rằng), « dipendere da » (phụ thuộc vào), « portare a » (dẫn đến), « distinguere tra… e… » (phân biệt giữa… và…), « trarre una conclusione » (rút ra kết luận).\n\nBẫy người Việt hay mắc: trình bày như một danh sách thành tựu (« Ho studiato X, ho trovato Y »). Tu từ học thuật Ý muốn bạn ĐỊNH KHUNG (« Il fenomeno presenta una complessità che… »), NÊU GIỚI HẠN (« Questa interpretazione presenta alcuni limiti »), và HEDGE kết luận (« I dati disponibili non permettono una conclusione definitiva »). Một kết luận không hedge ở C1 nghe giáo điều và sẽ bị chất vấn ngay.",
    cultural_notes_en:
      "Presenting academically in Italian ('esposizione accademica': C1 class talks, thesis defences, seminars) judges not how much you know, but how precisely and with what nuance you PRESENT it.\n\nThree cultural expectations: (1) NOMINALISATION is the highest register marker. Academic Italian favours 'l'analisi del fenomeno' over 'analizzare il fenomeno'; 'la distinzione tra causa ed effetto' over 'distinguere causa ed effetto'. Learners often feel this is 'heavy/bureaucratic' — but in Italian it sounds educated. Trust the form. (2) PRECISE, NON-EVERYDAY VOCABULARY: 'buono' → 'efficace'; 'una cosa' → 'un aspetto/elemento/fattore'; 'il testo dice' → 'il testo sostiene/evidenzia'; 'molto' → 'significativamente/notevolmente'. Repeating 'problema' reads as a poor vocabulary — rotate 'questione/tema/aspetto/criticità'. (3) ACADEMIC VERBS have their own syntax: 'sostenere che' (to argue that), 'evidenziare che' (to point out that), 'dipendere da' (to depend on), 'portare a' (to lead to), 'distinguere tra… e…', 'trarre una conclusione' (to draw a conclusion).\n\nA common trap: presenting as a list of achievements ('I studied X, I found Y'). Italian academic rhetoric wants you to FRAME ('Il fenomeno presenta una complessità che…'), STATE LIMITS ('Questa interpretazione presenta alcuni limiti'), and HEDGE the conclusion ('I dati disponibili non permettono una conclusione definitiva'). An unhedged C1 conclusion sounds dogmatic and invites immediate challenge.",
    tip_advice_vi:
      "Khung trình bày học thuật C1 (3–5 phút):\n\n(1) INQUADRAMENTO (định khung) — đặt đối tượng như một thứ phức tạp: « Il fenomeno che intendo analizzare presenta una complessità che non può essere ridotta a un solo fattore. »\n(2) TESI/POSIZIONE — nêu lập trường bằng động từ học thuật: « Sostengo che… » / « Il testo evidenzia che… » — KHÔNG « Penso che… secondo me ».\n(3) ANALISI — phân tích có cấu trúc, dùng danh hoá: « L'analisi dei dati rivela una distinzione tra cause immediate e cause strutturali. »\n(4) LIMITI — nêu giới hạn (bắt buộc ở C1): « Questa interpretazione presenta alcuni limiti, in particolare… »\n(5) CONCLUSIONE HEDGED — kết có dè dặt: « I dati disponibili non permettono una conclusione definitiva, ma suggeriscono che… »\n\nNÂNG CẤP TỪ VỰNG (đổi ngay khi nói/viết):\n- « un problema grande » → « una questione complessa »\n- « una cosa importante » → « un aspetto rilevante »\n- « il testo dice » → « il testo sostiene »\n- « questo fa vedere » → « questo evidenzia »\n- « un modo buono » → « un approccio efficace »\n\nCỤM DANH TỪ HỌC THUẬT nên thuộc:\n« un approccio efficace », « una questione complessa », « un fattore determinante », « una conseguenza significativa », « un punto di vista alternativo », « un presupposto implicito », « un ragionamento coerente », « un'analisi approfondita ».\n\nKẾT HỢP ĐỘNG-DANH chuẩn: « sostenere una tesi », « analizzare un fenomeno », « evidenziare un problema », « trarre una conclusione », « approfondire un tema », « confrontare due modelli ».\n\nLuyện: lấy một câu B1 (« Il testo dice che la tecnologia è buona ») và nâng lên C1 (« Il testo sostiene che la tecnologia possa rappresentare un fattore determinante, pur presentando alcuni limiti »). Để ý: động từ học thuật + danh hoá + congiuntivo + giới hạn.",
    tip_advice_en:
      "A C1 academic-presentation frame (3–5 minutes):\n(1) INQUADRAMENTO (framing) — pose the object as complex: 'Il fenomeno che intendo analizzare presenta una complessità che non può essere ridotta a un solo fattore.'\n(2) TESI/POSIZIONE — state the position with an academic verb: 'Sostengo che…' / 'Il testo evidenzia che…' — NOT 'Penso che… secondo me'.\n(3) ANALISI — structured analysis using nominalisation: 'L'analisi dei dati rivela una distinzione tra cause immediate e cause strutturali.'\n(4) LIMITI — state the limits (mandatory at C1): 'Questa interpretazione presenta alcuni limiti, in particolare…'\n(5) CONCLUSIONE HEDGED — a cautious close: 'I dati disponibili non permettono una conclusione definitiva, ma suggeriscono che…'\n\nVOCABULARY UPGRADES: 'un problema grande' → 'una questione complessa'; 'una cosa importante' → 'un aspetto rilevante'; 'il testo dice' → 'il testo sostiene'; 'questo fa vedere' → 'questo evidenzia'; 'un modo buono' → 'un approccio efficace'.\n\nMEMORISE these academic noun phrases: 'un approccio efficace', 'una questione complessa', 'un fattore determinante', 'una conseguenza significativa', 'un punto di vista alternativo', 'un presupposto implicito', 'un ragionamento coerente', \"un'analisi approfondita\".\n\nSTANDARD VERB–NOUN COLLOCATIONS: 'sostenere una tesi', 'analizzare un fenomeno', 'evidenziare un problema', 'trarre una conclusione', 'approfondire un tema', 'confrontare due modelli'.\n\nPractice: take a B1 sentence ('Il testo dice che la tecnologia è buona') and lift it to C1 ('Il testo sostiene che la tecnologia possa rappresentare un fattore determinante, pur presentando alcuni limiti'). Notice: academic verb + nominalisation + subjunctive + limit.",
    vocabulary: [
      {
        word: "sostenere una tesi",
        en: "to argue / defend a thesis",
        vi: "bảo vệ / cho rằng một luận điểm",
        pos: "v.",
        pronunciation_vi: "so-ste-NÉ-re ú-na TÈ-zi",
        pronunciation_en: "so-steh-NEH-reh OO-nah TEH-zee — 'sostenere' = both 'to support physically' and 'to argue'; 'tesi' s = 'z'",
      },
      {
        word: "evidenziare",
        en: "to highlight / point out",
        vi: "nhấn mạnh / làm nổi bật",
        pos: "v.",
        pronunciation_vi: "e-vi-den-TSIÀ-re (-zi- = 'tsi')",
        pronunciation_en: "eh-vee-den-TSYAH-reh (-zi- = 'tsy') — 'lo studio evidenzia che…' = 'the study points out that…'",
      },
      {
        word: "un fattore determinante",
        en: "a decisive factor",
        vi: "một yếu tố quyết định",
        pos: "n.m.",
        pronunciation_vi: "un fat-TÔ-re de-ter-mi-NÀN-te",
        pronunciation_en: "oon fat-TOH-reh deh-ter-mee-NAHN-teh — double t in 'fattore'; a core academic noun phrase",
      },
      {
        word: "una questione complessa",
        en: "a complex issue",
        vi: "một vấn đề phức tạp",
        pos: "n.f.",
        pronunciation_vi: "ú-na kue-STIÔ-ne kom-PLÈS-sa",
        pronunciation_en: "OO-nah kweh-STYOH-neh kom-PLES-sah — preferred over 'un problema grande'; double s in 'complessa'",
      },
      {
        word: "trarre una conclusione",
        en: "to draw a conclusion",
        vi: "rút ra một kết luận",
        pos: "v.",
        pronunciation_vi: "TRÀR-re ú-na kon-klu-ZIÔ-ne",
        pronunciation_en: "TRAR-reh OO-nah kon-kloo-ZYOH-neh — 'trarre' (double r) is irregular; 'traggo, trai, trae…'",
      },
      {
        word: "approfondire un tema",
        en: "to explore a topic in depth",
        vi: "đào sâu một chủ đề",
        pos: "v.",
        pronunciation_vi: "ap-pro-fon-DÍ-re un TÈ-ma",
        pronunciation_en: "ap-pro-fon-DEE-reh oon TEH-mah — '-isc-' verb: 'approfondisco, approfondisci…'; double p",
      },
      {
        word: "un presupposto implicito",
        en: "an implicit assumption",
        vi: "một giả định ngầm",
        pos: "n.m.",
        pronunciation_vi: "un pre-sup-PÔS-to im-PLÍ-ci-to",
        pronunciation_en: "oon preh-soop-POS-toh eem-PLEE-chee-toh — double p in 'presupposto'; 'implicito' c = 'ch'",
      },
      {
        word: "un ragionamento coerente",
        en: "a coherent line of reasoning",
        vi: "một lập luận nhất quán",
        pos: "n.m.",
        pronunciation_vi: "un ra-gio-na-MÉN-to ko-e-RÈN-te",
        pronunciation_en: "oon rah-jo-nah-MEN-toh ko-eh-REN-teh — 'gio' = 'jo'; the opposite is 'un ragionamento incoerente'",
      },
      {
        word: "rilevante",
        en: "relevant / significant",
        vi: "đáng kể / có liên quan",
        pos: "adj.",
        pronunciation_vi: "ri-le-VÀN-te",
        pronunciation_en: "ree-leh-VAHN-teh — false friend: leans more to 'significant' than English 'relevant'; opposite 'marginale'",
      },
    ],
    dialogue: [
      {
        speaker: "Prof. Bianchi",
        text: "Tien, la sua esposizione è chiara, ma il lessico è troppo quotidiano. 'Il testo dice una cosa importante' è da B1.",
        vi: "Tiên, phần trình bày của em rõ ràng, nhưng từ vựng quá đời thường. « Il testo dice una cosa importante » là mức B1.",
        en: "Tien, your presentation is clear, but the vocabulary is too everyday. 'The text says an important thing' is B1.",
      },
      {
        speaker: "Tien",
        text: "Come lo dico a livello C1?",
        vi: "Em nói thế nào ở mức C1 ạ?",
        en: "How do I say it at C1?",
      },
      {
        speaker: "Prof. Bianchi",
        text: "'Il testo evidenzia un aspetto rilevante.' Verbo accademico più nominalizzazione. E aggiunga sempre un limite.",
        vi: "« Il testo evidenzia un aspetto rilevante. » Động từ học thuật cộng với danh hoá. Và luôn thêm một giới hạn.",
        en: "'The text highlights a relevant aspect.' An academic verb plus nominalisation. And always add a limit.",
      },
      {
        speaker: "Tien",
        text: "Quindi: 'Il testo evidenzia un aspetto rilevante, pur presentando alcuni limiti metodologici.'",
        vi: "Vậy: « Il testo evidenzia un aspetto rilevante, pur presentando alcuni limiti metodologici. »",
        en: "So: 'The text highlights a relevant aspect, while presenting some methodological limitations.'",
      },
    ],
    dialogue_long: [
      {
        speaker: "Prof. Bianchi (seminario)",
        text: "Il seminario è suo, Tien. Quindici minuti: esposizione e poi discussione. Apra pure.",
        vi: "Buổi hội thảo là của em, Tiên. Mười lăm phút: trình bày rồi thảo luận. Em cứ bắt đầu.",
        en: "The seminar is yours, Tien. Fifteen minutes: presentation, then discussion. Please open.",
      },
      {
        speaker: "Tien",
        text: "Grazie. Il fenomeno che intendo analizzare — l'apprendimento di una seconda lingua in età adulta — presenta una complessità che non può essere ridotta a un solo fattore.",
        vi: "Cảm ơn thầy. Hiện tượng em định phân tích — việc học ngôn ngữ thứ hai ở tuổi trưởng thành — có một độ phức tạp không thể quy giản về một yếu tố duy nhất.",
        en: "Thank you. The phenomenon I intend to analyse — second-language learning in adulthood — presents a complexity that cannot be reduced to a single factor.",
      },
      {
        speaker: "Tien",
        text: "L'analisi dei dati raccolti rivela una distinzione utile tra cause immediate, come la motivazione, e cause strutturali, come l'esposizione quotidiana alla lingua.",
        vi: "Việc phân tích dữ liệu thu thập được cho thấy một sự phân biệt hữu ích giữa nguyên nhân tức thời, như động lực, và nguyên nhân cấu trúc, như sự tiếp xúc hằng ngày với ngôn ngữ.",
        en: "Analysis of the collected data reveals a useful distinction between immediate causes, such as motivation, and structural causes, such as daily exposure to the language.",
      },
      {
        speaker: "Prof. Bianchi",
        text: "Sostiene quindi che la motivazione sia secondaria rispetto all'esposizione?",
        vi: "Vậy em cho rằng động lực là thứ yếu so với sự tiếp xúc?",
        en: "Are you arguing, then, that motivation is secondary to exposure?",
      },
      {
        speaker: "Tien",
        text: "Non esattamente. Sostengo che i due fattori interagiscano, ma questa interpretazione presenta alcuni limiti: il campione è ridotto e i dati disponibili non permettono una conclusione definitiva.",
        vi: "Không hẳn ạ. Em cho rằng hai yếu tố tương tác với nhau, nhưng cách giải thích này có một số giới hạn: mẫu nhỏ và dữ liệu hiện có không cho phép một kết luận dứt khoát.",
        en: "Not exactly. I argue that the two factors interact, but this interpretation has some limits: the sample is small and the available data doesn't permit a definitive conclusion.",
      },
      {
        speaker: "Prof. Bianchi",
        text: "Apprezzo che lei stessa evidenzi i limiti. Quale presupposto implicito riconosce nel suo modello?",
        vi: "Tôi đánh giá cao việc chính em nêu ra các giới hạn. Em nhận thấy giả định ngầm nào trong mô hình của mình?",
        en: "I appreciate that you yourself highlight the limits. What implicit assumption do you recognise in your model?",
      },
      {
        speaker: "Tien",
        text: "Un presupposto implicito è che l'esposizione sia misurabile in modo affidabile. È un punto discutibile, che andrebbe approfondito in uno studio successivo.",
        vi: "Một giả định ngầm là sự tiếp xúc có thể đo lường một cách đáng tin cậy. Đó là một điểm còn phải bàn, nên được đào sâu trong một nghiên cứu sau.",
        en: "An implicit assumption is that exposure is reliably measurable. That's a debatable point, which should be explored in depth in a later study.",
      },
      {
        speaker: "Prof. Bianchi",
        text: "Ottimo. Ragionamento coerente, lessico preciso e una conclusione adeguatamente cauta. Questa è un'esposizione di livello C1.",
        vi: "Tuyệt vời. Lập luận nhất quán, từ vựng chính xác và một kết luận thận trọng đúng mức. Đây là một phần trình bày trình độ C1.",
        en: "Excellent. Coherent reasoning, precise vocabulary, and an appropriately cautious conclusion. This is a C1-level presentation.",
      },
    ],
    roleplay_prompts: [
      "Bạn trình bày 3 phút trong một hội thảo về một đề tài bạn chọn, bám đúng 5 phần: inquadramento, tesi (dùng « Sostengo che… »), analisi (có danh hoá), limiti, conclusione hedged.",
      "Giáo viên nói: « Il suo lessico è troppo quotidiano. » Hãy nâng cấp ngay tại chỗ ba câu B1 của bạn lên C1 bằng động từ học thuật + danh hoá + một giới hạn.",
      "Một người nghe hỏi: « Quale presupposto implicito c'è nel suo modello? » Hãy trả lời bằng cách nêu một giả định ngầm và thừa nhận nó « andrebbe approfondito ».",
    ],
    roleplay_prompts_en: [
      "Give a 3-minute seminar presentation on a topic of your choice, following the five parts: inquadramento, tesi (use 'Sostengo che…'), analisi (with nominalisation), limiti, hedged conclusione.",
      "Your teacher says: 'Your vocabulary is too everyday.' Upgrade three B1 sentences on the spot to C1 using an academic verb + nominalisation + a limit.",
      "A listener asks: 'What implicit assumption is there in your model?' Answer by naming an implicit assumption and conceding it 'andrebbe approfondito'.",
    ],
    register_notes:
      "Register học thuật C1 đòi hỏi xoá gần hết cái « io » cảm xúc và đặt hình thức lên hàng đầu:\n\n- DANH HOÁ là dấu hiệu rõ nhất: « l'analisi del fenomeno », « la distinzione tra X e Y », « la misurabilità del dato ». Thiếu danh hoá nghe như B2 dù nội dung đúng.\n- ĐỘNG TỪ VÔ NHÂN XƯNG/BỊ ĐỘNG: « si potrebbe sostenere che », « è opportuno distinguere », « va sottolineato che », « i dati raccolti rivelano ».\n- THỨC GIẢ ĐỊNH sau khẳng định học thuật và hoài nghi: « sostengo che i fattori interagiscano », « non si può affermare che la correlazione sia causale », « benché il campione sia ridotto ».\n- HEDGE chính xác: « i dati suggeriscono che », « tutto lascia pensare che », « sotto certe condizioni », « in via preliminare » — KHÔNG « forse », « può darsi » trống rỗng.\n\nCỤM CHUYỂN HỌC THUẬT: « in primo luogo », « per quanto riguarda », « va sottolineato che », « ne consegue che », « in definitiva », « resta da chiarire se ».\n\nTRÁNH trong thuyết trình học thuật: « una cosa », « tanto », « un sacco », « il testo dice » (dùng « sostiene/evidenzia »), và lối liệt kê thành tựu « ho fatto X, ho fatto Y » thay vì định khung và phân tích.",
    register_notes_en:
      "A C1 academic register requires deleting most of the emotional 'io' and putting form first:\n\n- NOMINALISATION is the clearest marker: 'l'analisi del fenomeno', 'la distinzione tra X e Y', 'la misurabilità del dato'. Without it, you sound B2 even when the content is right.\n- IMPERSONAL/PASSIVE VERBS: 'si potrebbe sostenere che', 'è opportuno distinguere', 'va sottolineato che', 'i dati raccolti rivelano'.\n- SUBJUNCTIVE after academic claims and doubt: 'sostengo che i fattori interagiscano', 'non si può affermare che la correlazione sia causale', 'benché il campione sia ridotto'.\n- PRECISE HEDGING: 'i dati suggeriscono che', 'tutto lascia pensare che', 'sotto certe condizioni', 'in via preliminare' — not an empty 'forse' or 'può darsi'.\n\nAcademic connectors: 'in primo luogo', 'per quanto riguarda', 'va sottolineato che', 'ne consegue che', 'in definitiva', 'resta da chiarire se'.\n\nAvoid in an academic talk: 'una cosa', 'tanto', 'un sacco', 'il testo dice' (use 'sostiene/evidenzia'), and the achievement-list style 'ho fatto X, ho fatto Y' instead of framing and analysing.",
    idiom_glosses: [
      {
        idiom: "ne consegue che (formale)",
        literal: "từ đó suy ra rằng",
        literal_en: "from it follows that",
        meaning: "Do đó suy ra / kéo theo rằng — dẫn một hệ quả logic từ luận điểm trước, rất chuẩn học thuật.",
        meaning_en: "It follows from this that — draws a logical consequence from a prior claim; a hallmark of academic prose.",
        example: "Il campione è ridotto; ne consegue che i risultati vanno interpretati con cautela.",
        example_en: "The sample is small; it follows that the results must be interpreted with caution.",
      },
      {
        idiom: "va sottolineato che (formale)",
        literal: "cần được gạch chân rằng",
        literal_en: "it must be underlined that",
        meaning: "Cần nhấn mạnh rằng — một dạng vô nhân xưng nâng tầm trang trọng, thay cho « è importante dire che ».",
        meaning_en: "It must be stressed that — an impersonal upgrade to 'it's important to say that'; takes the subjunctive ('che… sia').",
        example: "Va sottolineato che la correlazione non implica un rapporto di causa.",
        example_en: "It must be stressed that correlation does not imply a causal relationship.",
      },
      {
        idiom: "in via preliminare (formale)",
        literal: "theo con đường sơ bộ",
        literal_en: "by a preliminary route",
        meaning: "Một cách sơ bộ / tạm thời — hedge cho kết luận chưa hoàn chỉnh, báo hiệu sẽ còn được kiểm chứng.",
        meaning_en: "On a preliminary basis — hedges an incomplete conclusion, signalling it will be tested further.",
        example: "In via preliminare, i dati sembrano confermare l'ipotesi iniziale.",
        example_en: "On a preliminary basis, the data seems to confirm the initial hypothesis.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Il testo non « dice »: il testo ___ che la tecnologia possa rappresentare un fattore determinante.",
        answer: "sostiene",
        hint_vi: "Động từ học thuật thay « dice » (cho rằng / bảo vệ luận điểm)",
        hint_en: "The academic verb that replaces 'dice' ('argues / maintains that')",
      },
      {
        type: "matching",
        pairs: [
          ["sostenere una tesi", "bảo vệ một luận điểm (to argue a thesis)"],
          ["trarre una conclusione", "rút ra một kết luận (to draw a conclusion)"],
          ["un fattore determinante", "một yếu tố quyết định (a decisive factor)"],
          ["ne consegue che", "do đó suy ra rằng (it follows that)"],
        ],
        instruction: "Nối kết hợp/cụm học thuật với nghĩa tiếng Việt",
        instruction_en: "Match the academic collocation/phrase with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Dữ liệu hiện có không cho phép một kết luận dứt khoát, nhưng gợi ý rằng hai yếu tố tương tác với nhau.",
        italian: "I dati disponibili non permettono una conclusione definitiva, ma suggeriscono che i due fattori interagiscano.",
        english: "The available data does not permit a definitive conclusion, but suggests that the two factors interact.",
      },
    ],
  },
];

export default lessons;
