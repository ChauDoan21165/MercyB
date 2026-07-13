// Italian C2 lessons — Vietnamese-first (L1 = Vietnamese), English companion fields.
//
// Self-contained on purpose: like lessons-c1.ts, the Italian language folder does
// not yet ship a sibling `./lessons.ts` registry with a shared `ItalianLesson`
// type, so the structural types are declared inline here. They mirror the French
// `FrenchLesson` shape (src/languages/french/lessons.ts) field for field, so a
// future `lessons.ts` can lift these definitions out unchanged.
//
// Source material: .local/vietnamese-italian-study/ (U5 idiom & metaphor bank,
// U6 register & tone control, U7 argument & debate system, V7 humor/irony/
// subtext). The source markdown intentionally strips Italian accents; this file
// restores standard accented orthography (è, perché, più, così, qualità, sé, …).

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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
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
  // ── 1. Register and tone control ──────────────────────────────────────
  {
    id: "lregistro_e_sfumatura",
    level: "C2",
    category: "fluency",
    title_vi: "Làm chủ văn phong và sắc thái: chọn giọng điệu một cách có chủ ý",
    title_en: "Mastering register and nuance: choosing tone deliberately",
    sentences: [
      {
        en: "The question cannot be settled with a simple formula.",
        vi: "Vấn đề không thể được giải quyết bằng một công thức đơn giản.",
        pronunciation_focus: [
          "questione → kue-STIÔ-ne (qu = 'kw', không phải 'k')",
          "liquidata → li-kui-DÀ-ta (qu = 'kw'; t đơn gọn)",
          "formula → FÓR-mu-la (nhấn âm đầu, không phải -mu-)",
          "semplice → SÉM-pli-ce (-ce = 'che'; nhấn âm đầu)",
        ],
        pronunciation_focus_en: [
          "questione → 'kweh-STYOH-neh' (qu = 'kw', never just 'k')",
          "liquidata → 'lee-kwee-DAH-tah' (qu = 'kw'; clean single t)",
          "formula → 'FOR-moo-lah' (stress the first syllable, not -mu-)",
          "semplice → 'SEM-plee-cheh' (final -ce = 'cheh'; stress the first syllable)",
        ],
      },
      {
        en: "On the one hand, the demand for efficiency is understandable; on the other, too quick a solution risks being counterproductive.",
        vi: "Một mặt, nhu cầu hiệu quả là điều dễ hiểu; mặt khác, một giải pháp quá nhanh có nguy cơ phản tác dụng.",
        pronunciation_focus: [
          "esigenza → e-zi-GÈN-tsa (s giữa nguyên âm = 'z'; -gen- = 'gen' nhẹ)",
          "efficienza → ef-fi-CIÈN-tsa (f đôi; -cien- = 'chen')",
          "soluzione → so-lu-TSIÔ-ne (-zione = 'TSIÔ-ne')",
          "controproducente → con-tro-pro-du-CÈN-te (chuỗi dài, nhấn -CÈN-)",
        ],
        pronunciation_focus_en: [
          "esigenza → 'eh-zee-JEN-tsah' (s between vowels = 'z'; soft -gen-)",
          "efficienza → 'ef-fee-CHEN-tsah' (double f; -cien- = 'chen')",
          "soluzione → 'so-loo-TSYOH-neh' (-zione = 'TSYOH-neh')",
          "controproducente → 'kon-tro-pro-doo-CHEN-teh' (long chain, stress -CHEN-)",
        ],
      },
      {
        en: "In my view, the point is not to choose between caution and innovation, but to set transparent, verifiable, and socially sustainable criteria.",
        vi: "Theo tôi, vấn đề không phải là chọn giữa thận trọng và đổi mới, mà là thiết lập những tiêu chí minh bạch, kiểm chứng được và bền vững về mặt xã hội.",
        pronunciation_focus: [
          "avviso → av-VÍ-zo (v đôi; s giữa nguyên âm = 'z')",
          "prudenza → pru-DÈN-tsa (-denza = 'DÈN-tsa')",
          "trasparenti → tra-spa-RÈN-ti (chùm 'tr' + 'sp')",
          "verificabili → ve-ri-fi-KÀ-bi-li (nhấn -KÀ-, năm âm tiết)",
        ],
        pronunciation_focus_en: [
          "avviso → 'ahv-VEE-zo' (double v; s between vowels = 'z')",
          "prudenza → 'proo-DEN-tsah' (-denza = 'DEN-tsah')",
          "trasparenti → 'trah-spah-REN-tee' (the 'tr' + 'sp' clusters)",
          "verificabili → 'veh-ree-fee-KAH-bee-lee' (stress -KAH-, five syllables)",
        ],
      },
      {
        en: "I understand the point, but I would introduce a distinction.",
        vi: "Tôi hiểu ý đó, nhưng tôi muốn thêm một sự phân biệt.",
        pronunciation_focus: [
          "capisco → ca-PÍS-co (sc trước 'o' = 'sk')",
          "introdurrei → in-tro-dur-RÈI (r đôi; điều kiện cách)",
          "distinzione → di-stin-TSIÔ-ne (-zione = 'TSIÔ-ne')",
        ],
        pronunciation_focus_en: [
          "capisco → 'kah-PEES-ko' (sc before 'o' = 'sk')",
          "introdurrei → 'een-tro-door-RAY' (double r; conditional mood)",
          "distinzione → 'dee-steen-TSYOH-neh' (-zione = 'TSYOH-neh')",
        ],
      },
      {
        en: "This is a matter that is anything but marginal.",
        vi: "Đây là một khía cạnh hoàn toàn không hề thứ yếu.",
        pronunciation_focus: [
          "aspetto → a-SPÈT-to (t đôi giữ dài)",
          "tutt'altro → tut-t'ÀL-tro (t đôi + nuốt nguyên âm)",
          "marginale → mar-gi-NÀ-le (-gi- = 'ji' nhẹ)",
        ],
        pronunciation_focus_en: [
          "aspetto → 'ah-SPET-to' (hold the double t)",
          "tutt'altro → 'toot-TAL-tro' (double t plus the elision)",
          "marginale → 'mar-jee-NAH-leh' (soft -gi- = 'jee')",
        ],
      },
      {
        en: "The matter deserves a more cautious assessment.",
        vi: "Vấn đề xứng đáng được đánh giá một cách thận trọng hơn.",
        pronunciation_focus: [
          "merita → MÈ-ri-ta (nhấn âm đầu, không phải -ri-)",
          "valutazione → va-lu-ta-TSIÔ-ne (-zione = 'TSIÔ-ne')",
          "cauta → CÀU-ta ('au' là một âm đôi liền)",
        ],
        pronunciation_focus_en: [
          "merita → 'MEH-ree-tah' (stress the first syllable, not -ree-)",
          "valutazione → 'vah-loo-tah-TSYOH-neh' (-zione = 'TSYOH-neh')",
          "cauta → 'KOW-tah' ('au' is one gliding diphthong)",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở cấp C2, người Ý đánh giá năng lực không phải qua việc bạn nói đúng ngữ pháp — điều đó đã được giả định — mà qua việc bạn CHỌN GIỌNG ĐIỆU (registro) phù hợp với quan hệ và tình huống. Một câu hoàn toàn đúng nhưng sai văn phong (ví dụ quá suồng sã với cấp trên, hoặc quá trịnh trọng với đồng nghiệp) bị coi là dấu hiệu của người chưa thật sự thuộc về môi trường.\n\nBA TRỤC SẮC THÁI cần phân biệt:\n\n(1) SFUMATURA (sắc thái) — sự khác biệt tinh tế về mức độ. So sánh: « Non sono d'accordo » (thẳng) với « Non condivido pienamente » (mềm, chừa đường lui). Người Việt thường nói thẳng hoặc im lặng; tiếng Ý C2 có cả một thang độ ở giữa.\n\n(2) SOTTINTESO (điều ngầm hiểu) — điều không nói ra nhưng người nghe phải hiểu. « La soluzione presenta alcune criticità » KHÔNG có nghĩa 'có vài vấn đề nhỏ'; nó thường là cách lịch sự để nói 'giải pháp này không ổn'.\n\n(3) REGISTRO (cấp độ ngôn ngữ) — formale / neutro / colloquiale. Cùng một ý 'tôi không đồng ý' có năm cách nói khác nhau tùy người đối diện là sếp, đồng nghiệp, hay bạn bè.\n\nKHÁC BIỆT VĂN HÓA QUAN TRỌNG: văn hóa giao tiếp Ý (đặc biệt trong công việc và tranh luận công khai) coi trọng NHƯỢNG BỘ TRƯỚC, PHÊ PHÁN SAU. Bạn gần như luôn thừa nhận phần đúng của đối phương (« Capisco il punto… ») trước khi đưa ra bất đồng. Lao thẳng vào phản bác bị coi là thô và, nghịch lý thay, kém thuyết phục hơn.\n\nBẪY ĐẶC THÙ NGƯỜI VIỆT: nhịp điệu tiếng Việt thường gộp nhiều ý vào một câu dài. Tiếng Ý C2 trang trọng lại tách ý thành các mệnh đề có khớp nối rõ (« Da un lato… dall'altro… »; « Pur riconoscendo… tuttavia… »). Dịch nguyên nhịp Việt sang Ý tạo ra câu 'đúng nhưng phẳng' (corretto ma piatto) — đây chính là ranh giới giữa C1 và C2.",
    cultural_notes_en:
      "At C2, Italians judge competence not by grammatical correctness — that is assumed — but by whether you choose a register that fits the relationship and the situation. A fully correct sentence in the wrong register (too casual with a superior, too formal with a peer) marks you as someone not yet truly inside the environment.\n\nThree axes of nuance to distinguish: SFUMATURA (subtle gradations of degree — e.g. blunt 'Non sono d'accordo' vs. cushioned 'Non condivido pienamente'); SOTTINTESO (what is implied but not said — 'presenta alcune criticità' is often a polite way to say 'this doesn't work'); REGISTRO (formal / neutral / colloquial). Italian work and debate culture prizes CONCESSION BEFORE CRITIQUE: you almost always acknowledge the other side ('Capisco il punto…') before disagreeing. A Vietnamese-speaker trap: Vietnamese rhythm packs ideas into long sentences, while formal C2 Italian splits them into clearly hinged clauses ('Da un lato… dall'altro…'). Translating Vietnamese rhythm directly produces sentences that are 'corretto ma piatto' — correct but flat — exactly the C1/C2 boundary.",
    tip_advice_vi:
      "THANG ĐỘ GIỌNG ĐIỆU (register ladder) — học thuộc năm bậc cho cùng một ý 'tôi không đồng ý', đi từ trung tính đến hòa giải:\n\n- TRUNG TÍNH: « Non condivido pienamente questa lettura. » (Tôi không hoàn toàn đồng ý cách hiểu này.)\n- NGOẠI GIAO: « Capisco il punto, ma introdurrei una distinzione. » (Tôi hiểu ý, nhưng muốn thêm một phân biệt.)\n- SẮC BÉN: « Questa argomentazione non mi sembra sostenibile. » (Lập luận này không có vẻ vững.)\n- SUY NGẪM: « La questione merita una valutazione più cauta. » (Vấn đề cần đánh giá thận trọng hơn.)\n- HÒA GIẢI: « Possiamo trovare un punto di equilibrio. » (Chúng ta có thể tìm điểm cân bằng.)\n\nQUY TRÌNH 8 BƯỚC khi gặp một văn bản hoặc phát biểu C2:\n1. Xác định thông điệp tường minh.\n2. Xác định giả định ngầm (presupposto).\n3. Gắn nhãn văn phong: formale / neutro / colloquiale / ironico / diplomatico.\n4. Rút ra hai kết hợp từ (collocazioni).\n5. Viết lại một câu bằng tiếng Ý đơn giản.\n6. Viết lại CHÍNH câu đó ở mức C2.\n7. Giải thích ý nghĩa bằng tiếng Việt mà KHÔNG làm phẳng sắc thái.\n8. Tự tạo một câu gốc cùng văn phong.\n\nCÔNG CỤ NÂNG SẮC THÁI — thêm các từ điều biến để tránh câu 'phẳng':\n- « in parte » (một phần), « tendenzialmente » (về xu hướng), « non necessariamente » (không nhất thiết), « a mio avviso » (theo tôi), « pur con alcuni limiti » (dù còn vài giới hạn).\n\nNÂNG CẤP từ bình thường lên C2 (luyện hằng ngày):\n- « È importante. » → « Si tratta di un aspetto tutt'altro che marginale. »\n- « Il testo è difficile. » → « Il testo presenta una densità concettuale notevole. »\n- « La soluzione non va bene. » → « La soluzione presenta criticità difficilmente trascurabili. »\n\nNĂM LỖI THƯỜNG GẶP của người Việt và cách sửa:\n- Đúng ngữ pháp nhưng phẳng → thêm từ điều biến (in parte, tendenzialmente).\n- Quá thẳng khi bất đồng → nhượng bộ trước, phê sau.\n- Mang nhịp Việt vào Ý → tách ý dài thành các mệnh đề Ý.\n- Dùng thành ngữ máy móc → chỉ dùng khi giọng điệu hợp.\n- Quá trang trọng → chọn văn phong theo quan hệ, không phải theo mặc định.",
    tip_advice_en:
      "Memorize the register ladder — five levels for the same idea 'I disagree', from neutral to conciliatory: 'Non condivido pienamente…' / 'Capisco il punto, ma introdurrei una distinzione.' / 'Questa argomentazione non mi sembra sostenibile.' / 'La questione merita una valutazione più cauta.' / 'Possiamo trovare un punto di equilibrio.' Then run the 8-step procedure on any C2 text: explicit message → hidden assumption → tag the register → extract two collocations → rewrite once in plain Italian → rewrite at C2 → explain in Vietnamese without flattening nuance → produce one original sentence in the same register. Lift flat sentences with modulators ('in parte', 'tendenzialmente', 'non necessariamente', 'a mio avviso'). The five recurring Vietnamese-speaker errors: correct-but-flat (add modulators); too direct in disagreement (concede first); Vietnamese rhythm in Italian (split into clauses); mechanical idioms (use only when the tone fits); over-formality (choose register by relationship, not by default).",
    vocabulary: [
      {
        cell_id: "d556dfab-68b4-4a2b-9097-4df0b6ff02a7",
        word: "la sfumatura",
        en: "the nuance / shade of meaning",
        vi: "sắc thái",
        pos: "n.f.",
        pronunciation_vi: "sfu-ma-TÚ-ra",
        pronunciation_en: "lah sfoo-mah-TOO-rah — distinguishing tone from intention; literally a 'shading'",
      },
      {
        cell_id: "ebc50d1b-c278-4423-b098-955ef06df000",
        word: "il sottinteso",
        en: "the implied meaning",
        vi: "điều ngầm hiểu",
        pos: "n.m.",
        pronunciation_vi: "sot-tin-TÉ-zo",
        pronunciation_en: "eel sot-teen-TEH-zo — what is meant but not said; double t held",
      },
      {
        cell_id: "5ec3fd2f-d331-497f-b748-8df842f13166",
        word: "il registro",
        en: "the register / level of language",
        vi: "văn phong / cấp độ ngôn ngữ",
        pos: "n.m.",
        pronunciation_vi: "re-GÍS-tro",
        pronunciation_en: "eel reh-JEES-tro — choosing formal, neutral, or colloquial; soft -gi-",
      },
      {
        cell_id: "a3a2f246-90e6-4f16-a797-f8c1a9d8f0a0",
        word: "incisivo",
        en: "incisive / forceful",
        vi: "sắc bén, mạnh",
        pos: "adj.",
        pronunciation_vi: "in-ci-ZÍ-vo",
        pronunciation_en: "een-chee-ZEE-vo — speaking or writing with force; -ci- = 'chee', s = 'z'",
      },
      {
        cell_id: "f61be951-ca5b-42f3-9d69-d4629911c0c2",
        word: "prolisso",
        en: "long-winded / verbose",
        vi: "dài dòng",
        pos: "adj.",
        pronunciation_vi: "pro-LÍS-so",
        pronunciation_en: "pro-LEES-so — hold the double s; said of text that should be cut",
      },
      {
        cell_id: "530b7e94-4910-4c2a-a839-eeebada659b7",
        word: "fuorviante",
        en: "misleading",
        vi: "gây hiểu sai",
        pos: "adj.",
        pronunciation_vi: "fuor-VIÀN-te",
        pronunciation_en: "fwor-VYAHN-teh — used to criticize a misleading formulation",
      },
      {
        cell_id: "81f51746-d1fa-4f11-8001-5d782245de69",
        word: "plausibile",
        en: "plausible",
        vi: "hợp lý, có cơ sở",
        pos: "adj.",
        pronunciation_vi: "plau-ZÍ-bi-le",
        pronunciation_en: "plow-ZEE-bee-leh — used to weigh a hypothesis; s = 'z'",
      },
      {
        cell_id: "66b0aa22-c241-4122-be47-7bc2594c69da",
        word: "controproducente",
        en: "counterproductive",
        vi: "phản tác dụng",
        pos: "adj.",
        pronunciation_vi: "con-tro-pro-du-CÈN-te",
        pronunciation_en: "kon-tro-pro-doo-CHEN-teh — describing negative effects; -cen- = 'chen'",
      },
      {
        cell_id: "1be54631-d7b5-47b6-87bb-a4224e25b03b",
        word: "ridimensionare",
        en: "to scale down / put in proportion",
        vi: "đặt vấn đề đúng mức",
        pos: "v.",
        pronunciation_vi: "ri-di-men-sio-NÀ-re",
        pronunciation_en: "ree-dee-men-syo-NAH-reh — to right-size an alarm without ignoring it",
      },
      {
        cell_id: "d107b68a-fe49-452c-ab3c-1d6fd11aa8d9",
        word: "prendere le distanze",
        en: "to distance oneself (from a view)",
        vi: "giữ khoảng cách quan điểm",
        pos: "loc. v.",
        pronunciation_vi: "PRÈN-de-re le di-STÀN-tse",
        pronunciation_en: "PREN-deh-reh leh dee-STAHN-tseh — to mark distance from a simplistic reading",
      },
    ],
    dialogue: [
      {
        cell_id: "4433689a-6e42-4b5a-8eb0-ee408ea8fe60",
        speaker: "Relatrice",
        text: "Lei sostiene che la digitalizzazione vada accelerata. Non condivido pienamente: introdurrei una distinzione tra efficienza e accessibilità.",
        vi: "Cô cho rằng cần đẩy nhanh số hóa. Tôi không hoàn toàn đồng ý: tôi muốn phân biệt giữa hiệu quả và khả năng tiếp cận.",
      },
      {
        cell_id: "b838268b-8fc2-4085-9900-a8e5cf04ea4f",
        speaker: "Linh",
        text: "Capisco il punto e in parte lo condivido. Tuttavia, mi sembra che si rischi di ridimensionare un problema reale.",
        vi: "Tôi hiểu ý và phần nào đồng ý. Tuy nhiên, tôi e rằng ta có nguy cơ xem nhẹ một vấn đề có thật.",
      },
      {
        cell_id: "7ea59987-9565-4e42-890c-5a90fe812358",
        speaker: "Relatrice",
        text: "Diciamo che la sua formulazione, così com'è, risulta un po' fuorviante.",
        vi: "Nói đúng hơn, cách diễn đạt của cô, như hiện tại, có hơi gây hiểu sai.",
      },
      {
        cell_id: "d02a9dee-3d50-4bfe-b7ce-cce6b9bd2b93",
        speaker: "Linh",
        text: "Accetto il rilievo. Allora prendo le distanze da una lettura troppo ottimistica e propongo criteri verificabili.",
        vi: "Tôi chấp nhận nhận xét đó. Vậy tôi giữ khoảng cách với một cách đọc quá lạc quan và đề xuất các tiêu chí kiểm chứng được.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Moderatore (tavola rotonda, Università di Bologna)",
        text: "Apriamo il dibattito. La domanda è netta: l'intelligenza artificiale nella scuola va incoraggiata o frenata? Le do tre minuti.",
        vi: "Ta mở phần tranh luận. Câu hỏi rất rõ: trí tuệ nhân tạo trong nhà trường nên được khuyến khích hay kìm hãm? Tôi cho cô ba phút.",
      },
      {
        speaker: "Linh",
        text: "La questione non può essere liquidata con una formula semplice, e proprio per questo eviterei sia l'entusiasmo acritico sia il rifiuto preventivo. Da un lato, è comprensibile l'esigenza di efficienza; dall'altro, una soluzione troppo rapida rischia di produrre effetti controproducenti.",
        vi: "Vấn đề không thể giải quyết bằng một công thức đơn giản, và chính vì vậy tôi tránh cả sự hào hứng thiếu phê phán lẫn sự khước từ định kiến. Một mặt, nhu cầu hiệu quả là dễ hiểu; mặt khác, một giải pháp quá nhanh có nguy cơ phản tác dụng.",
      },
      {
        speaker: "Linh",
        text: "Il punto, a mio avviso, non è scegliere tra prudenza e innovazione, ma stabilire criteri trasparenti, verificabili e socialmente sostenibili. Senza questi criteri, ogni discussione resta sul piano delle impressioni.",
        vi: "Theo tôi, vấn đề không phải là chọn giữa thận trọng và đổi mới, mà là thiết lập các tiêu chí minh bạch, kiểm chứng được và bền vững về mặt xã hội. Không có những tiêu chí đó, mọi cuộc bàn luận chỉ dừng ở mức cảm tính.",
      },
      {
        speaker: "Contraddittore",
        text: "Mi permetta: questa è una posizione comoda. Lei evita di prendere posizione dietro la parola «criteri».",
        vi: "Cho phép tôi: đây là một lập trường tiện lợi. Cô tránh nêu rõ quan điểm sau từ « tiêu chí ».",
      },
      {
        speaker: "Linh",
        text: "Capisco l'obiezione, ma non la trovo decisiva. Prendere posizione, al livello giusto, significa appunto indicare i criteri: chi valuta, con quali dati, e con quale possibilità di revisione. Il resto, mi consenta, è retorica.",
        vi: "Tôi hiểu phản bác, nhưng không thấy nó mang tính quyết định. Nêu rõ quan điểm, ở mức đúng đắn, chính là chỉ ra tiêu chí: ai đánh giá, bằng dữ liệu nào, và với khả năng xem xét lại ra sao. Phần còn lại, xin phép, chỉ là tu từ.",
      },
    ],
    roleplay_prompts: [
      "Bạn bất đồng với sếp trong cuộc họp. Hãy diễn đạt ý đó ở ba bậc: trung tính, ngoại giao, và sắc bén — và giải thích bạn sẽ chọn bậc nào với sếp.",
      "Một đồng nghiệp đưa ra đề xuất bạn thấy chưa ổn. Hãy nhượng bộ phần đúng trước (« Capisco… »), rồi nêu bất đồng bằng một mệnh đề có khớp nối (« Tuttavia… »).",
      "Viết lại câu phẳng « La soluzione non va bene » thành phiên bản C2 có sắc thái, rồi giải thích bằng tiếng Việt mỗi từ điều biến bạn đã thêm.",
    ],
    roleplay_prompts_en: [
      "You disagree with your boss in a meeting. Express it at three levels — neutral, diplomatic, sharp — and explain which you would pick with a superior.",
      "A colleague makes a proposal you find weak. Concede the valid part first ('Capisco…'), then voice your disagreement with a hinged clause ('Tuttavia…').",
      "Rewrite the flat sentence 'La soluzione non va bene' into a nuanced C2 version, then explain in Vietnamese each modulator you added.",
    ],
    register_notes:
      "Cùng một bất đồng có thể đi từ « Non sono d'accordo » (suồng sã, dùng với bạn bè) đến « Non condivido pienamente questa posizione » (trang trọng, dùng trong họp hoặc viết). Với cấp trên, gần như luôn mở bằng nhượng bộ (« Capisco il punto, ma… ») trước khi phê. « Non sta in piedi » chấp nhận được trong họp nhưng cần làm mềm với người trên; trong văn bản hành chính/pháp lý, ưu tiên chính xác hơn thành ngữ (« risulta poco sostenibile » thay cho « non sta in piedi »).",
    register_notes_en:
      "The same disagreement ranges from casual 'Non sono d'accordo' (with friends) to formal 'Non condivido pienamente questa posizione' (meetings, writing). With superiors, open with a concession ('Capisco il punto, ma…') before the critique. 'Non sta in piedi' works in a meeting but must be softened upward; in legal/administrative writing, prefer precision over idiom ('risulta poco sostenibile' rather than 'non sta in piedi').",
    exercises: [
      {
        type: "fill-blank",
        question: "Capisco il punto, ma ________ una distinzione tra principio e applicazione.",
        answer: "introdurrei",
        hint_vi: "Điều kiện cách của 'introdurre' — làm mềm lời bất đồng.",
        hint_en: "Conditional of 'introdurre' — softens the disagreement.",
      },
      {
        type: "matching",
        pairs: [
          ["la sfumatura", "sắc thái (the nuance)"],
          ["il sottinteso", "điều ngầm hiểu (the implied meaning)"],
          ["controproducente", "phản tác dụng (counterproductive)"],
          ["prendere le distanze", "giữ khoảng cách quan điểm (to distance oneself)"],
        ],
        instruction: "Nối từ vựng C2 với nghĩa tiếng Việt",
        instruction_en: "Match the C2 vocabulary with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Theo tôi, điểm chính không phải là chọn giữa thận trọng và đổi mới, mà là thiết lập tiêu chí minh bạch.",
        italian: "A mio avviso, il punto non è scegliere tra prudenza e innovazione, ma stabilire criteri trasparenti.",
        english: "In my view, the point is not to choose between caution and innovation, but to set transparent criteria.",
      },
    ],
  },

  // ── 2. Idioms and metaphors ───────────────────────────────────────────
  {
    id: "lidiomi_e_metafore",
    level: "C2",
    category: "expressions",
    title_vi: "Thành ngữ và ẩn dụ C2: dùng đúng ngữ cảnh, đúng giọng, đúng quan hệ",
    title_en: "C2 idioms and metaphors: right context, right tone, right relationship",
    sentences: [
      {
        en: "Before deciding, let's take stock of the situation.",
        vi: "Trước khi quyết định, hãy tổng kết lại tình hình.",
        pronunciation_focus: [
          "prima → PRÍ-ma (chùm 'pr'; nhấn âm đầu)",
          "decidere → de-CÍ-de-re (-ci- = 'chi'; nhấn âm giữa)",
          "facciamo → fac-CIÀ-mo (-cci- = 'chi' kép, giữ dài)",
          "situazione → si-tua-TSIÔ-ne (-zione = 'TSIÔ-ne')",
        ],
        pronunciation_focus_en: [
          "prima → 'PREE-mah' ('pr' cluster; stress the first syllable)",
          "decidere → 'deh-CHEE-deh-reh' (-ci- = 'chee'; stress the middle)",
          "facciamo → 'fah-CHAH-mo' (-cci- = doubled 'ch', held longer)",
          "situazione → 'see-twah-TSYOH-neh' (-zione = 'TSYOH-neh')",
        ],
      },
      {
        en: "The proposal, as it stands, doesn't hold up.",
        vi: "Đề xuất, như hiện tại, không vững.",
        pronunciation_focus: [
          "proposta → pro-PÓS-ta (chùm 'pr'; s + t gọn)",
          "così com'è → co-SÌ co-MÈ (cả hai trọng âm cuối, dấu mở)",
          "non sta in piedi → non sta in PIÈ-di ('piedi' = 'PIÈ-di')",
        ],
        pronunciation_focus_en: [
          "proposta → 'pro-POS-tah' ('pr' cluster; crisp s + t)",
          "così com'è → 'ko-ZEE ko-MEH' (both final-stressed, open vowels)",
          "non sta in piedi → 'non stah een PYEH-dee' (literally 'does not stand on its feet')",
        ],
      },
      {
        en: "This figure is a warning sign.",
        vi: "Con số này là một tín hiệu cảnh báo.",
        pronunciation_focus: [
          "questo → KUÉS-to (qu = 'kw'; s + t gọn)",
          "dato → DÀ-to (t đơn, gọn)",
          "campanello → cam-pa-NÈL-lo (l đôi giữ dài)",
          "d'allarme → dal-LÀR-me (l đôi)",
        ],
        pronunciation_focus_en: [
          "questo → 'KWEH-sto' (qu = 'kw'; crisp s + t)",
          "dato → 'DAH-to' (clean single t)",
          "campanello → 'kam-pah-NEL-lo' (hold the double l)",
          "d'allarme → 'dahl-LAR-meh' (double l)",
        ],
      },
      {
        en: "The privacy issue is slippery ground.",
        vi: "Chủ đề quyền riêng tư là một vùng dễ rủi ro.",
        pronunciation_focus: [
          "tema → TÈ-ma (è mở; nhấn âm đầu)",
          "privacy → PRÀI-va-si (mượn từ tiếng Anh, đọc kiểu Ý)",
          "terreno → ter-RÈ-no (r đôi)",
          "scivoloso → sci-vo-LÓ-zo (sci = 'shi'; s giữa nguyên âm = 'z')",
        ],
        pronunciation_focus_en: [
          "tema → 'TEH-mah' (open è; stress the first syllable)",
          "privacy → 'PRY-vah-see' (English loanword, Italianized)",
          "terreno → 'ter-REH-no' (double r)",
          "scivoloso → 'shee-vo-LOH-zo' (sci = 'sh'; s between vowels = 'z')",
        ],
      },
      {
        en: "I'd say the real knot to untie is not technology itself, but the way it's introduced.",
        vi: "Tôi cho rằng nút thắt thật sự không phải là công nghệ tự thân, mà là cách nó được đưa vào.",
        pronunciation_focus: [
          "direi → di-RÈI (điều kiện cách; trọng âm cuối)",
          "nodo → NÒ-do (ò mở; nhấn âm đầu)",
          "sciogliere → SCIÓ-glie-re (sci = 'shi'; -gli- = 'lyi')",
          "tecnologia → tec-no-lo-GÌ-a (nhấn -GÌ-, bốn âm tiết)",
        ],
        pronunciation_focus_en: [
          "direi → 'dee-RAY' (conditional; final-stressed)",
          "nodo → 'NOH-do' (open ò; stress the first syllable)",
          "sciogliere → 'SHOH-lyeh-reh' (sci = 'sh'; -gli- = 'ly')",
          "tecnologia → 'tek-no-lo-JEE-ah' (stress -JEE-, four syllables)",
        ],
      },
      {
        en: "Without training, digitalization risks falling apart at the seams.",
        vi: "Nếu không có đào tạo, số hóa có nguy cơ lủng củng ở nhiều chỗ.",
        pronunciation_focus: [
          "senza → SÈN-tsa (-nza = 'n-tsa')",
          "formazione → for-ma-TSIÔ-ne (-zione = 'TSIÔ-ne')",
          "digitalizzazione → di-gi-ta-liz-tsa-TSIÔ-ne (chuỗi rất dài; -gi- = 'ji')",
          "rischia → RÍS-kia (sch = 'sk')",
        ],
        pronunciation_focus_en: [
          "senza → 'SEN-tsah' (-nza = 'n-tsah')",
          "formazione → 'for-mah-TSYOH-neh' (-zione = 'TSYOH-neh')",
          "digitalizzazione → 'dee-jee-tah-leets-tsah-TSYOH-neh' (very long chain; -gi- = 'jee')",
          "rischia → 'REE-skyah' (sch = 'sk')",
        ],
      },
    ],
    cultural_notes_vi:
      "QUY TẮC VÀNG về thành ngữ ở C2: chỉ dùng một thành ngữ khi bạn CŨNG có thể nói cùng ý đó một cách trơn tru, rõ ràng. Thành ngữ không phải đồ trang trí — nó phải khớp với ngữ cảnh, giọng điệu, vùng miền và quan hệ. Một thành ngữ dùng sai chỗ tệ hơn là không dùng, vì nó để lộ rằng bạn học vẹt chứ không thật sự cảm được tiếng Ý.\n\nBA LOẠI cần phân biệt:\n\n(1) IDIOMI (thành ngữ cố định) — « fare il punto » (tổng kết), « andare al sodo » (đi vào trọng tâm), « tagliare corto » (nói gọn lại). Mỗi cái có một mức trang trọng riêng: « fare acqua da tutte le parti » (sai lủng củng nhiều chỗ) quá suồng sã cho một đơn khiếu nại trang trọng.\n\n(2) METAFORE (ẩn dụ ý niệm) — « un nodo da sciogliere » (nút thắt cần tháo, cho vấn đề chưa giải), « una zona grigia » (vùng xám, cho luật/đạo đức không rõ), « uno spartiacque » (bước ngoặt lịch sử/xã hội), « un campanello d'allarme » (tín hiệu cảnh báo rủi ro). Ẩn dụ có thể nghe sang trọng HOẶC giả tạo tùy mật độ — đừng dồn nhiều ẩn dụ vào một đoạn.\n\n(3) COLLOCAZIONI (kết hợp từ cố định) — « sollevare una questione », « nutrire dubbi », « prendere atto di », « venire meno a un obbligo ». Đây là phần ÍT rủi ro nhất và NÊN dùng nhiều ở C2; chúng làm câu nghe tự nhiên mà không 'cố tỏ ra hay'.\n\nBẪY ĐẶC THÙ NGƯỜI VIỆT: tiếng Việt rất giàu thành ngữ, và phản xạ tự nhiên là DỊCH THẲNG thành ngữ Việt sang Ý — điều này gần như luôn sai (« nước đến chân mới nhảy » không có bản Ý tương đương dịch từng chữ). Hãy học thành ngữ Ý như đơn vị riêng, gắn với mức trang trọng của nó, chứ đừng tìm 'bản dịch' của thành ngữ Việt.\n\nLƯU Ý CẢM XÚC: khi đang tức giận, TRÁNH thành ngữ — chúng dễ nghe thành mỉa mai (sarcastico) ngoài ý muốn.",
    cultural_notes_en:
      "The golden rule for C2 idioms: use one only when you can ALSO say the same idea plainly. An idiom is not decoration; it must fit context, tone, region, and relationship — a misplaced idiom is worse than none, because it reveals rote learning rather than feel. Distinguish three classes: IDIOMI (fixed idioms like 'fare il punto', each with its own formality — 'fare acqua da tutte le parti' is too casual for a formal complaint); METAFORE (conceptual metaphors like 'un nodo da sciogliere', 'una zona grigia', 'uno spartiacque', 'un campanello d'allarme' — elegant or artificial depending on density, so don't stack them); and COLLOCAZIONI (fixed collocations like 'sollevare una questione', 'nutrire dubbi', 'prendere atto di' — the lowest-risk, highest-value layer you should use freely). The key Vietnamese-speaker trap is translating Vietnamese idioms literally into Italian, which almost never works — learn Italian idioms as units tied to their register. When angry, avoid idioms: they easily land as unintended sarcasm.",
    tip_advice_vi:
      "LUYỆN 'PLAIN → C2' — học cặp đôi, luôn biết bản trơn trước:\n- « Abbiamo un problema. » → « C'è un nodo da sciogliere. »\n- « Dobbiamo riassumere. » → « Facciamo il punto. »\n- « Questa idea non funziona. » → « Questa ipotesi non sta in piedi. »\n- « Questo dato preoccupa. » → « Questo dato è un campanello d'allarme. »\n- « Non voglio parlare troppo intorno. » → « Non vorrei girare intorno al problema. »\n\nNĂM BƯỚC dùng thành ngữ an toàn:\n1. Chọn năm thành ngữ và viết bản trang trọng/trơn cho mỗi cái.\n2. Thay năm cụm cơ bản trong một câu trả lời họp bằng thành ngữ phù hợp.\n3. Đánh dấu thành ngữ nào KHÔNG an toàn trong email chính thức.\n4. Giải thích « zona grigia » bằng một ví dụ.\n5. Tự ghi âm dùng ba thành ngữ một cách tự nhiên.\n\nBẢN THAY THẾ TRANG TRỌNG (khi không chắc về văn phong, hãy hạ thành ngữ xuống bản chính xác):\n- « non sta in piedi » → « risulta poco sostenibile »\n- « fare il punto » → « riassumere la situazione »\n- « fare acqua da tutte le parti » → « presenta numerose criticità »\n\nMẪU C2 TỐT (một thành ngữ, ngữ cảnh rõ, văn phong đúng):\n« Direi che il vero nodo da sciogliere non è la tecnologia in sé, ma il modo in cui viene introdotta. » (Một ẩn dụ duy nhất, đặt đúng chỗ — đây là cách dùng C2 chuẩn.)\n\nSÁU LỖI của người Việt:\n1. Đừng dịch thành ngữ Việt từng chữ sang Ý.\n2. Học rõ mỗi thành ngữ là formale, informale, hay risky.\n3. Thành ngữ cần đúng dạng động từ và mạo từ.\n4. Đừng trộn quá nhiều ẩn dụ trong một đoạn.\n5. Khi tức giận, tránh thành ngữ — dễ thành mỉa mai.\n6. Luyện bản trơn trước, rồi mới nâng lên thành ngữ.",
    tip_advice_en:
      "Drill 'plain → C2' as pairs, always knowing the plain version first: 'Abbiamo un problema.' → 'C'è un nodo da sciogliere.'; 'Dobbiamo riassumere.' → 'Facciamo il punto.'; 'Questa idea non funziona.' → 'Questa ipotesi non sta in piedi.'; 'Questo dato preoccupa.' → 'Questo dato è un campanello d'allarme.' Keep formal fallbacks ready for when you're unsure of the register: 'non sta in piedi' → 'risulta poco sostenibile'; 'fare il punto' → 'riassumere la situazione'. A good C2 model uses ONE idiom with clear context and correct register: 'Direi che il vero nodo da sciogliere non è la tecnologia in sé, ma il modo in cui viene introdotta.' Six Vietnamese-speaker rules: don't translate Vietnamese idioms word-for-word; learn each idiom's register; get the verb form and article right; don't stack metaphors; avoid idioms when angry; master the plain version before the idiomatic one.",
    vocabulary: [
      {
        cell_id: "14395e9f-f21a-4225-afc8-de64d51c3d7f",
        word: "fare il punto",
        en: "to take stock / sum up the situation",
        vi: "tổng kết tình hình",
        pos: "loc. v.",
        pronunciation_vi: "FÀ-re il PÚN-to",
        pronunciation_en: "FAH-reh eel POON-to — professional register; common in meetings",
      },
      {
        cell_id: "9a1e44ac-0d01-4b3d-9cba-bf457208d62c",
        word: "andare al sodo",
        en: "to get to the point",
        vi: "đi vào trọng tâm",
        pos: "loc. v.",
        pronunciation_vi: "an-DÀ-re al SÒ-do",
        pronunciation_en: "ahn-DAH-reh ahl SOH-do — informal-neutral; cut the preamble",
      },
      {
        cell_id: "e51ed476-e054-4afb-9f21-bd090ff22d07",
        word: "non stare in piedi",
        en: "to not hold up / make no sense",
        vi: "không vững, không hợp lý",
        pos: "loc. v.",
        pronunciation_vi: "non sta-re in PIÈ-di",
        pronunciation_en: "non STAH-reh een PYEH-dee — soften upward; formal = 'risulta poco sostenibile'",
      },
      {
        cell_id: "758be70c-c7a6-40e9-b2e7-018a242bd086",
        word: "un nodo da sciogliere",
        en: "a knot to untie / an unresolved issue",
        vi: "nút thắt cần tháo",
        pos: "n.m.",
        pronunciation_vi: "un NÒ-do da SCIÓ-glie-re",
        pronunciation_en: "oon NOH-do dah SHOH-lyeh-reh — metaphor for an unresolved problem",
      },
      {
        cell_id: "bd84c350-90dd-48cb-8143-2fe4a12a0f90",
        word: "una zona grigia",
        en: "a grey area",
        vi: "vùng xám",
        pos: "n.f.",
        pronunciation_vi: "ÚN-a TSÒ-na GRÍ-gia",
        pronunciation_en: "OO-nah TSOH-nah GREE-jah — where rule or ethics are unclear",
      },
      {
        cell_id: "a447ed2d-6fcc-49fb-b30d-5a97790209fe",
        word: "un campanello d'allarme",
        en: "an alarm bell / warning sign",
        vi: "tín hiệu cảnh báo",
        pos: "n.m.",
        pronunciation_vi: "cam-pa-NÈL-lo dal-LÀR-me",
        pronunciation_en: "kam-pah-NEL-lo dahl-LAR-meh — metaphor for risk; double l twice",
      },
      {
        cell_id: "7a55f23b-2684-4f4f-a23b-2a2e833ad0e3",
        word: "uno spartiacque",
        en: "a watershed / turning point",
        vi: "bước ngoặt",
        pos: "n.m.",
        pronunciation_vi: "ú-no spar-TIÀK-kue",
        pronunciation_en: "oo-no spar-TYAHK-kweh — historical/social turning point; -cque = 'kkweh'",
      },
      {
        cell_id: "57055900-87f9-4ad4-a5ea-d09b8080d49d",
        word: "gettare luce su",
        en: "to shed light on",
        vi: "làm sáng tỏ",
        pos: "loc. v.",
        pronunciation_vi: "get-TÀ-re LÚ-ce su",
        pronunciation_en: "jet-TAH-reh LOO-cheh soo — formal; heavy in casual speech",
      },
      {
        cell_id: "add00f3c-5bd6-4b3a-9111-ac16f428102e",
        word: "sollevare una questione",
        en: "to raise an issue",
        vi: "nêu một vấn đề",
        pos: "loc. v.",
        pronunciation_vi: "sol-le-VÀ-re ÚN-a kue-STIÔ-ne",
        pronunciation_en: "sol-leh-VAH-reh oo-nah kweh-STYOH-neh — low-risk collocation, use freely",
      },
      {
        cell_id: "772681a0-877a-4f90-ad08-f5791e184b1a",
        word: "nutrire dubbi",
        en: "to harbour doubts",
        vi: "có nghi ngờ",
        pos: "loc. v.",
        pronunciation_vi: "nu-TRÍ-re DÚB-bi",
        pronunciation_en: "noo-TREE-reh DOOB-bee — formal collocation; double b held",
      },
    ],
    dialogue: [
      {
        cell_id: "99b3e597-ff89-4f4c-a255-c5eb50623022",
        speaker: "Direttore",
        text: "Prima di tutto, facciamo il punto. La proposta, così com'è, non sta in piedi.",
        vi: "Trước hết, hãy tổng kết tình hình. Đề xuất, như hiện tại, không vững.",
      },
      {
        cell_id: "8fddd8b2-c109-40c0-a884-09f9b26c4406",
        speaker: "Linh",
        text: "Concordo. Il vero nodo da sciogliere non è il budget, ma la formazione del personale.",
        vi: "Tôi đồng ý. Nút thắt thật sự không phải là ngân sách, mà là việc đào tạo nhân sự.",
      },
      {
        cell_id: "95b4564a-fed2-45e1-8562-a8aaa31413cf",
        speaker: "Direttore",
        text: "Su questo nutro qualche dubbio. Però è giusto sollevare la questione adesso.",
        vi: "Về điểm này tôi có chút nghi ngờ. Nhưng nêu vấn đề ngay bây giờ là đúng.",
      },
      {
        cell_id: "b7a325d1-dee0-44cf-933d-a13a6745dc9d",
        speaker: "Linh",
        text: "Senza formazione, l'intero progetto rischia di fare acqua da tutte le parti — ma questo, fra noi, non lo scriverei nel verbale.",
        vi: "Nếu không đào tạo, cả dự án có nguy cơ lủng củng nhiều chỗ — nhưng điều này, giữa chúng ta, tôi sẽ không ghi vào biên bản.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Consulente (riunione di bilancio)",
        text: "Allora, facciamo il punto sulla situazione prima di prendere qualsiasi decisione. I numeri dell'ultimo trimestre meritano attenzione.",
        vi: "Vậy, ta tổng kết tình hình trước khi đưa ra bất kỳ quyết định nào. Các con số quý vừa rồi đáng để chú ý.",
      },
      {
        speaker: "Linh",
        text: "Andiamo al sodo: il calo delle vendite online è un campanello d'allarme. Non lo drammatizzerei, ma nemmeno lo ridimensionerei.",
        vi: "Ta đi thẳng vào trọng tâm: doanh số bán online sụt giảm là một tín hiệu cảnh báo. Tôi sẽ không thổi phồng, nhưng cũng không xem nhẹ nó.",
      },
      {
        speaker: "Consulente",
        text: "Capisco, ma attenzione: lei sta entrando in una zona grigia. I dati di un solo trimestre non bastano a trarre conclusioni.",
        vi: "Tôi hiểu, nhưng cẩn thận: cô đang bước vào một vùng xám. Dữ liệu chỉ một quý thì không đủ để rút ra kết luận.",
      },
      {
        speaker: "Linh",
        text: "Esatto, e proprio per questo non vorrei girare intorno al problema con metafore. Dico in chiaro: il vero nodo da sciogliere è la nostra dipendenza da un unico canale di vendita.",
        vi: "Chính xác, và chính vì vậy tôi không muốn vòng vo quanh vấn đề bằng ẩn dụ. Tôi nói thẳng: nút thắt thật sự là sự phụ thuộc của chúng ta vào một kênh bán hàng duy nhất.",
      },
      {
        speaker: "Consulente",
        text: "Su questo concordo pienamente. È una formulazione che getta luce sul punto centrale, senza inutili giri di parole.",
        vi: "Về điểm này tôi hoàn toàn đồng ý. Đó là một cách diễn đạt làm sáng tỏ vấn đề cốt lõi, không vòng vo vô ích.",
      },
    ],
    roleplay_prompts: [
      "Trong một email chính thức gửi cơ quan, bạn cần nói 'kế hoạch này sai nhiều chỗ' mà KHÔNG dùng thành ngữ suồng sã « fare acqua da tutte le parti ». Hãy viết bản trang trọng.",
      "Chọn ba ẩn dụ (nodo da sciogliere, zona grigia, campanello d'allarme) và đặt mỗi cái vào một câu — nhưng chỉ một ẩn dụ cho mỗi câu, không dồn.",
      "Cho mỗi thành ngữ informal, hãy nói bản trơn (plain) tương đương, để chứng minh bạn hiểu chứ không học vẹt.",
    ],
    roleplay_prompts_en: [
      "In a formal email to an agency, you need to say 'this plan is flawed in many places' WITHOUT the casual idiom 'fare acqua da tutte le parti'. Write the formal version.",
      "Pick three metaphors (nodo da sciogliere, zona grigia, campanello d'allarme) and place each in its own sentence — only one metaphor per sentence, no stacking.",
      "For each informal idiom, give the plain equivalent, proving you understand it rather than parroting it.",
    ],
    register_notes:
      "Lớp an toàn nhất ở C2 là COLLOCAZIONI (sollevare una questione, nutrire dubbi, prendere atto di) — dùng thoải mái cả khi viết trang trọng. Lớp IDIOMI cần lọc theo văn phong: « andare al sodo », « tagliare corto » ổn trong họp nhưng quá đời thường cho văn bản pháp lý. « fare acqua da tutte le parti » chỉ dùng khi nói, giữa người ngang hàng; trong email chính thức hãy thay bằng « presenta numerose criticità ». ẩn dụ (METAFORE) đẹp khi thưa, giả tạo khi dày — một ẩn dụ mỗi đoạn là đủ.",
    register_notes_en:
      "The safest C2 layer is COLLOCATIONS (sollevare una questione, nutrire dubbi, prendere atto di) — use freely even in formal writing. IDIOMS must be filtered by register: 'andare al sodo', 'tagliare corto' work in meetings but are too colloquial for legal text; 'fare acqua da tutte le parti' is speech-only and peer-level — replace it with 'presenta numerose criticità' in formal email. Metaphors are elegant when sparse, artificial when dense — one per paragraph is enough.",
    exercises: [
      {
        type: "fill-blank",
        question: "Prima di decidere, ________ il punto sulla situazione.",
        answer: "facciamo",
        hint_vi: "Thành ngữ 'fare il punto' = tổng kết; chia ngôi 'noi'.",
        hint_en: "The idiom 'fare il punto' = to take stock; conjugate for 'noi'.",
      },
      {
        type: "matching",
        pairs: [
          ["un nodo da sciogliere", "nút thắt cần tháo (an unresolved issue)"],
          ["una zona grigia", "vùng xám (a grey area)"],
          ["un campanello d'allarme", "tín hiệu cảnh báo (a warning sign)"],
          ["non stare in piedi", "không vững (to not hold up)"],
        ],
        instruction: "Nối thành ngữ/ẩn dụ với nghĩa tiếng Việt",
        instruction_en: "Match the idiom/metaphor with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Nút thắt thật sự không phải là công nghệ tự thân, mà là cách nó được đưa vào.",
        italian: "Il vero nodo da sciogliere non è la tecnologia in sé, ma il modo in cui viene introdotta.",
        english: "The real knot to untie is not technology itself, but the way it's introduced.",
      },
    ],
    idiom_glosses: [
      {
        idiom: "fare il punto",
        literal: "làm cái điểm",
        literal_en: "to make the point (mark a position on a map)",
        meaning: "tổng kết tình hình trước khi quyết định",
        meaning_en: "to take stock / sum up the situation before deciding (nautical origin)",
        example: "Prima di proseguire, facciamo il punto su quanto è stato fatto.",
        example_en: "Before moving on, let's take stock of what has been done.",
      },
      {
        idiom: "girare intorno al problema",
        literal: "đi vòng quanh vấn đề",
        literal_en: "to turn around the problem",
        meaning: "vòng vo, né tránh nói thẳng vào vấn đề",
        meaning_en: "to beat around the bush, to avoid getting to the point",
        example: "Non vorrei girare intorno al problema: servono più risorse.",
        example_en: "I don't want to beat around the bush: we need more resources.",
      },
      {
        idiom: "fare acqua da tutte le parti",
        literal: "rỉ nước ở mọi phía",
        literal_en: "to take on water from all sides (a leaking boat)",
        meaning: "sai sót, lủng củng ở rất nhiều chỗ — suồng sã, tránh trong văn bản trang trọng",
        meaning_en: "to be full of holes / flawed everywhere — informal, risky in formal writing",
        example: "Senza una guida chiara, il progetto fa acqua da tutte le parti.",
        example_en: "Without clear leadership, the project is falling apart at the seams.",
      },
    ],
  },

  // ── 3. Argument and debate ────────────────────────────────────────────
  {
    id: "largomentazione_e_dibattito",
    level: "C2",
    category: "public_communication",
    title_vi: "Hệ thống lập luận và tranh luận C2: khung vấn đề, nhượng bộ, phản bác, tổng hợp",
    title_en: "C2 argument and debate system: framing, concession, rebuttal, synthesis",
    sentences: [
      {
        en: "The issue must be framed on two levels.",
        vi: "Vấn đề cần được đặt trên hai bình diện.",
        pronunciation_focus: [
          "questione → kue-STIÔ-ne (qu = 'kw')",
          "inquadrata → in-kua-DRÀ-ta (qu = 'kw'; chùm 'dr')",
          "piani → PIÀ-ni ('pia' liền một âm trượt)",
        ],
        pronunciation_focus_en: [
          "questione → 'kweh-STYOH-neh' (qu = 'kw')",
          "inquadrata → 'een-kwah-DRAH-tah' (qu = 'kw'; 'dr' cluster)",
          "piani → 'PYAH-nee' ('pia' as one gliding sound)",
        ],
      },
      {
        en: "While recognizing this limit, this does not however imply that the conclusion is invalid.",
        vi: "Dù thừa nhận giới hạn này, điều đó tuy nhiên không có nghĩa là kết luận không có giá trị.",
        pronunciation_focus: [
          "riconoscendo → ri-co-no-SCÈN-do (sc trước 'e' = 'sh')",
          "implica → im-PLÍ-ca (chùm 'pl'; nhấn âm giữa)",
          "conclusione → con-clu-ZIÔ-ne (-sione = 'ZIÔ-ne')",
        ],
        pronunciation_focus_en: [
          "riconoscendo → 'ree-ko-no-SHEN-do' (sc before 'e' = 'sh')",
          "implica → 'eem-PLEE-kah' ('pl' cluster; stress the middle)",
          "conclusione → 'kon-kloo-ZYOH-neh' (-sione = 'ZYOH-neh')",
        ],
      },
      {
        en: "In principle, digitalization is desirable: it cuts time, costs, and travel.",
        vi: "Về nguyên tắc, số hóa là điều đáng mong muốn: nó giảm thời gian, chi phí và di chuyển.",
        pronunciation_focus: [
          "in linea di principio → in LÍ-nea di prin-CÍ-pio (-ci- = 'chi')",
          "auspicabile → au-spi-CÀ-bi-le ('au' âm đôi; -ca- nhấn)",
          "riduce → ri-DÚ-ce (-ce = 'che')",
          "spostamenti → spo-sta-MÉN-ti (chùm 'sp' + 'st')",
        ],
        pronunciation_focus_en: [
          "in linea di principio → 'een LEE-neh-ah dee preen-CHEE-pyo' (-ci- = 'chee')",
          "auspicabile → 'ow-spee-KAH-bee-leh' ('au' diphthong; stress -KAH-)",
          "riduce → 'ree-DOO-cheh' (-ce = 'cheh')",
          "spostamenti → 'spo-stah-MEN-tee' ('sp' + 'st' clusters)",
        ],
      },
      {
        en: "However, confusing technical efficiency with real accessibility would be a mistake.",
        vi: "Tuy nhiên, nhầm hiệu quả kỹ thuật với khả năng tiếp cận thực tế sẽ là một sai lầm.",
        pronunciation_focus: [
          "tuttavia → tut-ta-VÍ-a (t đôi; nhấn -VÍ-)",
          "confondere → con-FÓN-de-re (nhấn âm giữa)",
          "accessibilità → ac-ces-si-bi-li-TÀ (c đôi; trọng âm cuối)",
          "errore → er-RÓ-re (r đôi)",
        ],
        pronunciation_focus_en: [
          "tuttavia → 'toot-tah-VEE-ah' (double t; stress -VEE-)",
          "confondere → 'kon-FON-deh-reh' (stress the middle)",
          "accessibilità → 'aht-ches-see-bee-lee-TAH' (double c; final stress)",
          "errore → 'er-ROH-reh' (double r)",
        ],
      },
      {
        en: "I understand the objection, but I don't find it decisive.",
        vi: "Tôi hiểu phản bác, nhưng tôi không thấy nó mang tính quyết định.",
        pronunciation_focus: [
          "capisco → ca-PÍS-co (sc trước 'o' = 'sk')",
          "obiezione → o-bie-TSIÔ-ne (-zione = 'TSIÔ-ne')",
          "dirimente → di-ri-MÈN-te (= mang tính quyết định)",
        ],
        pronunciation_focus_en: [
          "capisco → 'kah-PEES-ko' (sc before 'o' = 'sk')",
          "obiezione → 'o-byeh-TSYOH-neh' (-zione = 'TSYOH-neh')",
          "dirimente → 'dee-ree-MEN-teh' (= decisive, settling the matter)",
        ],
      },
      {
        en: "I do not deny the problem; I contest the proposed solution.",
        vi: "Tôi không phủ nhận vấn đề; tôi phản đối giải pháp được đề xuất.",
        pronunciation_focus: [
          "nego → NÈ-go (è mở; nhấn âm đầu)",
          "contesto → con-TÈS-to (s + t gọn)",
          "proposta → pro-PÓS-ta (chùm 'pr')",
        ],
        pronunciation_focus_en: [
          "nego → 'NEH-go' (open è; stress the first syllable)",
          "contesto → 'kon-TES-to' (here a verb: 'I contest'; crisp s + t)",
          "proposta → 'pro-POS-tah' ('pr' cluster)",
        ],
      },
    ],
    cultural_notes_vi:
      "Một lập luận C2 trong văn hóa Ý không phải là 'thắng' đối phương, mà là TỎ RA CÔNG BẰNG, CÓ CẤU TRÚC, CHÍNH XÁC, và KIỂM SOÁT XÃ HỘI ngay cả dưới áp lực. Người tranh luận giỏi nhất trong mắt người Ý là người thừa nhận phần đúng của đối phương rõ ràng nhất trước khi phản bác — nghịch lý là điều đó khiến phản bác MẠNH hơn, không yếu đi.\n\nKIẾN TRÚC LẬP LUẬN sáu tầng (thuộc lòng như một khung):\n1. FRAME (đóng khung): « La questione va inquadrata su due piani. »\n2. THESIS (luận điểm): « La mia tesi è che… »\n3. EVIDENCE (chứng cứ): « A sostegno di questa posizione… »\n4. CONCESSION (nhượng bộ): « Pur riconoscendo questo limite… »\n5. REBUTTAL (phản bác): « Questo però non implica che… »\n6. SYNTHESIS (tổng hợp): « La soluzione più ragionevole consiste nel… »\n\nSÁU NƯỚC ĐI tranh luận:\n- CHIARIRE (làm rõ giả định): « Prima chiarirei un presupposto. »\n- DISTINGUERE (phân biệt lý thuyết/thực hành): « Distinguerei tra principio e applicazione. »\n- CONTESTARE (thách thức chứng cứ phiến diện): « Questo argomento mi sembra parziale. »\n- CONCEDERE (nhượng bộ để công bằng): « Su questo punto concordo. »\n- LIMITARE (tránh tuyệt đối hóa): « Vale in alcuni casi, non in assoluto. »\n- RIORIENTARE (đặt lại trọng tâm): « Il nodo, però, è un altro. »\n\nBẪY ĐẶC THÙ NGƯỜI VIỆT:\n(1) Tính gián tiếp của tiếng Việt dễ giấu mất LUẬN ĐIỂM — ở C2 bạn phải nêu tesi rõ ràng, không úp mở.\n(2) Tránh « hai torto » (anh sai) — nghe thô; dùng « non mi convince del tutto » (chưa thuyết phục tôi hoàn toàn).\n(3) Đừng tranh luận chỉ bằng phủ định liên tiếp; phải đóng khung vấn đề TRƯỚC.\n(4) Đừng dùng quá nhiều danh từ trừu tượng mà thiếu ví dụ cụ thể.\n(5) Trong tranh luận công khai, GIỌNG ĐIỆU là một phần của lập luận — nóng nảy = mất điểm.",
    cultural_notes_en:
      "A C2 argument in Italian culture is not about 'beating' the opponent but about appearing FAIR, STRUCTURED, PRECISE, and SOCIALLY CONTROLLED even under pressure. The most admired debater is the one who acknowledges the opponent's valid point most clearly before rebutting — paradoxically, this makes the rebuttal stronger, not weaker. Memorize the six-layer architecture as a frame: frame the issue → state the thesis → give evidence → concede a limit → rebut → synthesize ('La questione va inquadrata…' / 'La mia tesi è che…' / 'A sostegno…' / 'Pur riconoscendo…' / 'Questo però non implica…' / 'La soluzione più ragionevole consiste nel…'). Six debate moves: clarify, distinguish, contest, concede, limit, redirect. Vietnamese-speaker traps: indirectness can hide the thesis — state it clearly; avoid 'hai torto' (you're wrong), use 'non mi convince del tutto'; don't debate by contradiction alone — frame first; don't pile up abstract nouns without examples; in public debate, tone is part of the argument — losing your temper loses points.",
    tip_advice_vi:
      "MẪU LẬP LUẬN C2 hoàn chỉnh (đề: 'Mọi dịch vụ công có nên số hóa hết không?'):\n« In linea di principio, la digitalizzazione è auspicabile: riduce tempi, costi e spostamenti. Tuttavia, confondere l'efficienza tecnica con l'accessibilità reale sarebbe un errore. Una piattaforma può funzionare perfettamente e, al tempo stesso, escludere chi non possiede competenze digitali. Per questo difenderei una transizione ibrida: digitale dove semplifica, assistita dove rischia di creare nuove barriere. »\n\nNĂM MẪU PHẢN BÁC (counterargument) — học thuộc lòng:\n1. « Capisco l'obiezione, ma non la trovo decisiva. »\n2. « Il dato è rilevante, ma va interpretato con cautela. »\n3. « Non nego il problema; contesto la soluzione proposta. »\n4. « La premessa è condivisibile, la conclusione meno. »\n5. « Il rischio esiste, ma può essere mitigato. »\n\nSÁU BÀI LUYỆN tranh luận:\n1. Bảo vệ một luận điểm trong 90 giây.\n2. Tự đưa ra phản bác mạnh nhất chống lại quan điểm CỦA CHÍNH MÌNH.\n3. Phản bác mà KHÔNG lặp lại đúng từ của đối phương.\n4. Tóm tắt cả hai phía một cách công bằng.\n5. Kết bằng một thỏa hiệp thực tế.\n6. Biến một phản ứng cảm xúc thành ngôn ngữ phân tích.\n\nMẪU PHẢN BÁC MỀM (khi cần giữ quan hệ):\n« L'obiezione è comprensibile: non tutti hanno accesso agli stessi strumenti. Tuttavia, proprio per questo non eliminerei il digitale; lo accompagnerei con sportelli, formazione e procedure più leggibili. »\n\nCHUẨN ĐIỂM 5/5: có đủ luận điểm, phân biệt, chứng cứ, nhượng bộ, phản bác, tổng hợp thực tế, và giọng điệu kiểm soát.\n\nKIỂM TRA CUỐI: ghi âm một câu trả lời, rồi tự hỏi — nhượng bộ của mình là THẬT hay chỉ TRANG TRÍ? Nhượng bộ giả (concessione decorativa) là dấu hiệu C1, không phải C2.",
    tip_advice_en:
      "A full C2 model answer (topic: 'Should all public services be digitized?'): 'In linea di principio, la digitalizzazione è auspicabile… Tuttavia, confondere l'efficienza tecnica con l'accessibilità reale sarebbe un errore… Per questo difenderei una transizione ibrida: digitale dove semplifica, assistita dove rischia di creare nuove barriere.' Memorize five rebuttal patterns: 'Capisco l'obiezione, ma non la trovo decisiva.'; 'Il dato è rilevante, ma va interpretato con cautela.'; 'Non nego il problema; contesto la soluzione proposta.'; 'La premessa è condivisibile, la conclusione meno.'; 'Il rischio esiste, ma può essere mitigato.' Six drills: defend a thesis in 90 seconds; give the strongest counterargument to YOUR OWN view; rebut without repeating the opponent's exact words; summarize both sides fairly; end with a practical compromise; turn an emotional reaction into analytic language. A 5/5 answer frames, argues, concedes, rebuts, and synthesizes with controlled tone. Final check: record an answer and ask whether your concession is REAL or merely DECORATIVE — a decorative concession is a C1 marker, not C2.",
    vocabulary: [
      {
        cell_id: "fb33a48f-a486-4a0a-a14e-ece1be197f62",
        word: "il presupposto",
        en: "the underlying assumption / premise",
        vi: "giả định nền",
        pos: "n.m.",
        pronunciation_vi: "pre-sup-PÓS-to",
        pronunciation_en: "preh-soop-POS-to — the hidden premise of an argument; double p held",
      },
      {
        cell_id: "d7b87d89-f2c4-4664-ad2d-246588469d52",
        word: "l'obiezione",
        en: "the objection",
        vi: "phản bác",
        pos: "n.f.",
        pronunciation_vi: "o-bie-TSIÔ-ne",
        pronunciation_en: "lo-byeh-TSYOH-neh — a counterpoint raised in debate",
      },
      {
        cell_id: "03e1135d-aa8d-4c5d-99f2-cc80e112b449",
        word: "confutare",
        en: "to refute",
        vi: "bác bỏ",
        pos: "v.",
        pronunciation_vi: "con-fu-TÀ-re",
        pronunciation_en: "kon-foo-TAH-reh — to demonstrate a claim is false",
      },
      {
        cell_id: "caa4fb52-893c-4254-a480-870997e89f25",
        word: "mitigare",
        en: "to mitigate",
        vi: "giảm nhẹ",
        pos: "v.",
        pronunciation_vi: "mi-ti-GÀ-re",
        pronunciation_en: "mee-tee-GAH-reh — to lessen a risk rather than deny it",
      },
      {
        cell_id: "27595da3-2ffa-484f-91d3-3b62f40617a4",
        word: "dirimente",
        en: "decisive / settling the matter",
        vi: "mang tính quyết định",
        pos: "adj.",
        pronunciation_vi: "di-ri-MÈN-te",
        pronunciation_en: "dee-ree-MEN-teh — an argument that decides the question",
      },
      {
        cell_id: "a9be212b-6a48-490f-abed-6da565fda46c",
        word: "parziale",
        en: "partial / one-sided",
        vi: "phiến diện, một phần",
        pos: "adj.",
        pronunciation_vi: "par-TSIÀ-le",
        pronunciation_en: "par-TSYAH-leh — based on partial evidence; -zia- = 'tsya'",
      },
      {
        cell_id: "2258fba9-c48e-4b4d-a908-f34c1271b23b",
        word: "auspicabile",
        en: "desirable / to be hoped for",
        vi: "đáng mong muốn",
        pos: "adj.",
        pronunciation_vi: "au-spi-CÀ-bi-le",
        pronunciation_en: "ow-spee-KAH-bee-leh — 'au' diphthong; stress -KAH-",
      },
      {
        cell_id: "8b7f2991-892c-4cf3-8ce7-4e7dda429b78",
        word: "la transizione ibrida",
        en: "the hybrid transition",
        vi: "chuyển đổi lai",
        pos: "n.f.",
        pronunciation_vi: "tran-si-TSIÔ-ne Í-bri-da",
        pronunciation_en: "tran-zee-TSYOH-neh EE-bree-dah — mixing digital and assisted approaches",
      },
      {
        cell_id: "34e97990-ffeb-4bdb-9f2c-0df277b98dee",
        word: "ridimensionare",
        en: "to scale down / put in proportion",
        vi: "đặt vấn đề đúng mức",
        pos: "v.",
        pronunciation_vi: "ri-di-men-sio-NÀ-re",
        pronunciation_en: "ree-dee-men-syo-NAH-reh — to right-size without ignoring",
      },
      {
        cell_id: "811576dc-b77a-4a9d-a33e-9a04ead787b7",
        word: "in linea di principio",
        en: "in principle",
        vi: "về nguyên tắc",
        pos: "loc. avv.",
        pronunciation_vi: "in LÍ-nea di prin-CÍ-pio",
        pronunciation_en: "een LEE-neh-ah dee preen-CHEE-pyo — opens a concession-friendly thesis",
      },
    ],
    dialogue: [
      {
        cell_id: "08b37dc4-a47d-46a1-8940-4490f37a7a13",
        speaker: "Moderatore",
        text: "I servizi pubblici dovrebbero diventare tutti digitali. Lei è d'accordo?",
        vi: "Mọi dịch vụ công nên trở thành kỹ thuật số hết. Cô có đồng ý không?",
      },
      {
        cell_id: "c7f5b63a-781f-4bd7-adb4-c35af3b3b7a3",
        speaker: "Linh",
        text: "In linea di principio, la digitalizzazione è auspicabile. Tuttavia, confondere l'efficienza con l'accessibilità sarebbe un errore.",
        vi: "Về nguyên tắc, số hóa là điều đáng mong muốn. Tuy nhiên, nhầm hiệu quả với khả năng tiếp cận sẽ là sai lầm.",
      },
      {
        cell_id: "9cf4b6f3-c020-43d4-8e33-a555df37b255",
        speaker: "Contraddittore",
        text: "Ma il digitale riduce i costi. Questo è dirimente.",
        vi: "Nhưng số hóa giảm chi phí. Đây là điều quyết định.",
      },
      {
        cell_id: "dea6f6c2-dde6-4c8e-be8c-ea90f7f8adfb",
        speaker: "Linh",
        text: "Capisco l'obiezione, ma non la trovo decisiva. Il risparmio è reale, però va interpretato con cautela: esclude chi non ha competenze digitali.",
        vi: "Tôi hiểu phản bác, nhưng không thấy nó quyết định. Khoản tiết kiệm là có thật, nhưng cần diễn giải thận trọng: nó loại trừ người không có kỹ năng số.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Moderatore (dibattito pubblico)",
        text: "Tema della serata: i test linguistici per la residenza. Sono uno strumento giusto o una barriera? Linh, a lei la parola.",
        vi: "Chủ đề tối nay: các bài kiểm tra ngôn ngữ để cấp thường trú. Đó là công cụ công bằng hay một rào cản? Linh, mời cô.",
      },
      {
        speaker: "Linh",
        text: "La questione va inquadrata su due piani: quello dell'integrazione e quello dei diritti. La mia tesi è che un test possa essere utile, ma solo a precise condizioni. A sostegno di questa posizione, ricordo che la lingua è effettivamente uno strumento di autonomia.",
        vi: "Vấn đề cần đặt trên hai bình diện: hội nhập và quyền lợi. Luận điểm của tôi là một bài kiểm tra có thể hữu ích, nhưng chỉ trong những điều kiện cụ thể. Để ủng hộ lập trường này, tôi nhắc rằng ngôn ngữ thật sự là một công cụ của sự tự chủ.",
      },
      {
        speaker: "Contraddittrice",
        text: "Mi permetta: se la lingua dà autonomia, allora un test severo è giustificato. Il suo argomento mi sembra contraddittorio.",
        vi: "Cho phép tôi: nếu ngôn ngữ mang lại sự tự chủ, thì một bài kiểm tra khắt khe là chính đáng. Lập luận của cô có vẻ mâu thuẫn.",
      },
      {
        speaker: "Linh",
        text: "Pur riconoscendo questo punto, distinguerei tra principio e applicazione. Un test che misura la lingua reale è una cosa; un test che misura la capacità di superare un esame formale è un'altra. Questo però non implica che io rifiuti ogni verifica: contesto soltanto i test fuorvianti.",
        vi: "Dù thừa nhận điểm này, tôi muốn phân biệt giữa nguyên tắc và áp dụng. Một bài kiểm tra đo ngôn ngữ thực tế là một chuyện; một bài kiểm tra đo khả năng vượt qua một kỳ thi hình thức lại là chuyện khác. Nhưng điều này không có nghĩa là tôi bác bỏ mọi sự kiểm tra: tôi chỉ phản đối những bài kiểm tra gây hiểu sai.",
      },
      {
        speaker: "Linh",
        text: "La soluzione più ragionevole consiste, a mio avviso, in una verifica orale e contestuale, accompagnata da formazione gratuita. Il rischio di esclusione esiste, ma può essere mitigato. È, mi pare, un punto di equilibrio difendibile.",
        vi: "Giải pháp hợp lý nhất, theo tôi, là một bài kiểm tra nói và gắn với ngữ cảnh, kèm theo đào tạo miễn phí. Nguy cơ loại trừ là có thật, nhưng có thể giảm nhẹ. Đó, tôi nghĩ, là một điểm cân bằng có thể bảo vệ được.",
      },
    ],
    roleplay_prompts: [
      "Chọn một đề (làm việc từ xa, AI trong giáo dục, giao thông công cộng vs xe riêng) và xây dựng câu trả lời sáu tầng: frame → thesis → evidence → concession → rebuttal → synthesis.",
      "Tự đưa ra phản bác MẠNH NHẤT chống lại chính quan điểm của bạn, rồi phản hồi nó mà không lặp lại đúng từ của 'đối phương'.",
      "Biến câu cảm xúc « Questo è assurdo! » thành ngôn ngữ phân tích kiểm soát ở mức C2.",
    ],
    roleplay_prompts_en: [
      "Pick a topic (remote work, AI in education, public transport vs cars) and build a six-layer answer: frame → thesis → evidence → concession → rebuttal → synthesis.",
      "Give the STRONGEST counterargument to your own view, then respond to it without repeating the 'opponent's' exact words.",
      "Turn the emotional 'Questo è assurdo!' into controlled, analytic C2 language.",
    ],
    register_notes:
      "Trong tranh luận công khai, tránh tuyệt đối « hai torto » (anh sai) — nghe thô và phản tác dụng. Bậc lịch sự tăng dần: « non mi convince del tutto » (mềm) < « non la trovo decisiva » (trung tính, có lý) < « questa argomentazione mi sembra parziale » (sắc, vẫn lịch sự). Mở bằng « Mi permetta » hoặc « Capisco l'obiezione, ma… » giữ giọng kiểm soát. Trong văn viết học thuật, ưu tiên « confutare », « dirimente », « presupposto »; trong nói, các cụm « il nodo, però, è un altro » nghe tự nhiên hơn.",
    register_notes_en:
      "In public debate, never use 'hai torto' (you're wrong) — it sounds crude and backfires. Politeness ladder: 'non mi convince del tutto' (soft) < 'non la trovo decisiva' (neutral, reasoned) < 'questa argomentazione mi sembra parziale' (sharp but still polite). Opening with 'Mi permetta' or 'Capisco l'obiezione, ma…' keeps tone controlled. In academic writing, prefer 'confutare', 'dirimente', 'presupposto'; in speech, phrases like 'il nodo, però, è un altro' sound more natural.",
    exercises: [
      {
        type: "fill-blank",
        question: "Capisco l'obiezione, ma non la trovo ________.",
        answer: "decisiva",
        hint_vi: "Tính từ = mang tính quyết định (giống 'dirimente').",
        hint_en: "Adjective = decisive (synonym of 'dirimente').",
      },
      {
        type: "matching",
        pairs: [
          ["il presupposto", "giả định nền (the premise)"],
          ["confutare", "bác bỏ (to refute)"],
          ["mitigare", "giảm nhẹ (to mitigate)"],
          ["parziale", "phiến diện (one-sided)"],
        ],
        instruction: "Nối từ vựng tranh luận với nghĩa tiếng Việt",
        instruction_en: "Match the debate vocabulary with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Tôi không phủ nhận vấn đề; tôi phản đối giải pháp được đề xuất.",
        italian: "Non nego il problema; contesto la soluzione proposta.",
        english: "I do not deny the problem; I contest the proposed solution.",
      },
    ],
  },

  // ── 4. Irony, understatement, and subtext ─────────────────────────────
  {
    id: "lironia_e_sottinteso",
    level: "C2",
    category: "society",
    title_vi: "Mỉa mai, nói giảm và hàm ý: đọc điều không được nói ra và đáp lại an toàn",
    title_en: "Irony, understatement, and subtext: reading the unsaid and responding safely",
    sentences: [
      {
        en: "The office website crashed again. — What a surprise.",
        vi: "Trang web của cơ quan lại sập rồi. — Thật bất ngờ. (mỉa mai)",
        pronunciation_focus: [
          "sito → SÍ-to (s đầu = 's'; t đơn)",
          "bloccato → bloc-CÀ-to (c đôi giữ dài)",
          "di nuovo → di NUÒ-vo ('nuo' âm trượt; ò mở)",
          "sorpresa → sor-PRÉ-za (chùm 'pr'; s giữa nguyên âm = 'z')",
        ],
        pronunciation_focus_en: [
          "sito → 'SEE-to' (initial s = 's'; single t)",
          "bloccato → 'blok-KAH-to' (hold the double c)",
          "di nuovo → 'dee NWOH-vo' ('nuo' glide; open ò)",
          "sorpresa → 'sor-PREH-zah' ('pr' cluster; s between vowels = 'z')",
        ],
      },
      {
        en: "Let's say it could have been done better.",
        vi: "Nói đúng hơn là có thể làm tốt hơn. (phê bình được làm mềm)",
        pronunciation_focus: [
          "diciamo → di-CIÀ-mo (-ci- = 'chi')",
          "poteva → po-TÉ-va (nhấn -TÉ-)",
          "meglio → MÉ-glio (-gli- = 'lyi')",
        ],
        pronunciation_focus_en: [
          "diciamo → 'dee-CHAH-mo' (-ci- = 'ch')",
          "poteva → 'po-TEH-vah' (stress -TEH-)",
          "meglio → 'MEH-lyo' (-gli- = 'ly')",
        ],
      },
      {
        en: "It's not exactly the best.",
        vi: "Cũng không hẳn là tốt nhất. (nói giảm tiêu cực nhẹ)",
        pronunciation_focus: [
          "non è proprio → non è PRÒ-prio (ò mở; -prio = 'pryo')",
          "il massimo → il MÀS-si-mo (s đôi; nhấn âm đầu)",
        ],
        pronunciation_focus_en: [
          "non è proprio → 'non eh PROH-pryo' (open ò; -prio = 'pryo')",
          "il massimo → 'eel MAHS-see-mo' (double s; stress the first syllable)",
        ],
      },
      {
        en: "The phrase 'let's say it could have been done better' softens a criticism.",
        vi: "Câu « có thể làm tốt hơn » làm mềm một lời phê bình.",
        pronunciation_focus: [
          "frase → FRÀ-ze (chùm 'fr'; s giữa nguyên âm = 'z')",
          "attenua → at-TÈ-nu-a (t đôi; nhấn -TÈ-)",
          "critica → CRÍ-ti-ca (chùm 'cr'; nhấn âm đầu)",
        ],
        pronunciation_focus_en: [
          "frase → 'FRAH-zeh' ('fr' cluster; s between vowels = 'z')",
          "attenua → 'aht-TEH-noo-ah' (double t; stress -TEH-)",
          "critica → 'KREE-tee-kah' ('cr' cluster; stress the first syllable)",
        ],
      },
      {
        en: "It doesn't simply mean a better option existed; it suggests the current result is unsatisfactory.",
        vi: "Nó không chỉ nói rằng có một lựa chọn tốt hơn; nó gợi ý rằng kết quả hiện tại chưa làm hài lòng.",
        pronunciation_focus: [
          "significa → si-GNÍ-fi-ca (-gn- = 'nh' mềm như 'nhi')",
          "alternativa → al-ter-na-TÍ-va (nhấn -TÍ-)",
          "insoddisfacente → in-sod-dis-fa-CÈN-te (chuỗi dài; d đôi; -cen- = 'chen')",
        ],
        pronunciation_focus_en: [
          "significa → 'see-NYEE-fee-kah' (-gn- = 'ny' as in canyon)",
          "alternativa → 'ahl-ter-nah-TEE-vah' (stress -TEE-)",
          "insoddisfacente → 'een-sod-dees-fah-CHEN-teh' (long chain; double d; -cen- = 'chen')",
        ],
      },
      {
        en: "I understand the frustration, but I'd rather stay on the practical point.",
        vi: "Tôi hiểu sự bực bội, nhưng tôi muốn giữ ở điểm thực tế hơn.",
        pronunciation_focus: [
          "capisco → ca-PÍS-co (sc trước 'o' = 'sk')",
          "frustrazione → fru-stra-TSIÔ-ne (chùm 'fr' + 'str')",
          "pratico → PRÀ-ti-co (chùm 'pr'; nhấn âm đầu)",
        ],
        pronunciation_focus_en: [
          "capisco → 'kah-PEES-ko' (sc before 'o' = 'sk')",
          "frustrazione → 'froo-strah-TSYOH-neh' ('fr' + 'str' clusters)",
          "pratico → 'PRAH-tee-ko' ('pr' cluster; stress the first syllable)",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở C2, hiểu NGHĨA ĐEN của câu là chưa đủ — bạn phải đọc được SOTTINTESO (hàm ý), tức điều người Ý nói mà không nói thẳng. Đây là một trong những rào cản lớn nhất với người Việt, vì hệ thống tín hiệu mỉa mai của tiếng Ý khác tiếng Việt và phụ thuộc rất nhiều vào ngữ cảnh chung.\n\nBẢN ĐỒ HÀM Ý (câu bề mặt → hàm ý thật):\n- « Interessante… » → thường là NGHI NGỜ, không phải hứng thú.\n- « Geniale, proprio. » → châm biếm (sarcastico), thực ra là chê.\n- « Non è proprio il massimo. » → tiêu cực nhẹ (= không tốt lắm).\n- « Diciamo che si poteva fare meglio. » → phê bình được làm mềm.\n- « Bella domanda. » → câu hỏi khó, không có câu trả lời dễ.\n- « Auguri. » → 'chúc may mắn', đôi khi là cảnh báo mỉa.\n\nCÁCH NHẬN DIỆN MỈA MAI (irony) — bốn tín hiệu:\n1. Từ ngữ tích cực NHƯNG ngữ cảnh tiêu cực (« Che sorpresa » sau khi điều đó xảy ra lần thứ mười).\n2. Câu trả lời quá NGẮN báo hiệu mỉa.\n3. Kiến thức chung được chia sẻ (cả hai đều biết trang web hay sập).\n4. Tín hiệu giọng: ngắt, nhấn, ngữ cảnh.\n\nPHÂN BIỆT IRONIA và SARCASMO: ironia tinh tế, thông minh, thường không nhắm vào người; sarcasmo sắc hơn, nhắm vào ai đó, và RỦI RO về mặt xã hội. Quy tắc an toàn: KHÔNG dùng sarcasmo với người trên trong thứ bậc.\n\nNÓI GIẢM (understatement) rất phổ biến ở Ý: « non male » (= khá tốt), « non proprio ideale » (= khá tệ). Người Việt dễ hiểu sai « non male » thành 'không tệ → tầm thường', trong khi thực ra nó thường là một lời khen.\n\nBẪY ĐẶC THÙ NGƯỜI VIỆT: phản xạ trả lời câu mỉa THEO NGHĨA ĐEN làm lộ rằng bạn 'không bắt được'. Nếu không chắc, hãy đáp TRUNG TÍNH (« Capisco la frustrazione ») thay vì cười theo hoặc trả lời thẳng.",
    cultural_notes_en:
      "At C2, grasping the literal meaning is not enough — you must read the SOTTINTESO (what Italians mean without saying it). This is one of the hardest barriers for Vietnamese speakers, because Italian irony cues differ from Vietnamese and rely heavily on shared context. A subtext map: 'Interessante…' often = doubt, not interest; 'Geniale, proprio.' = sarcastic criticism; 'Non è proprio il massimo.' = mild negative; 'Diciamo che si poteva fare meglio.' = softened criticism; 'Bella domanda.' = a hard question; 'Auguri.' = good luck, sometimes an ironic warning. Four irony cues: positive words but negative context; a very short reply; shared background knowledge; tonal signals (pause, stress). Distinguish IRONIA (subtle, clever, usually not aimed at a person) from SARCASMO (sharper, aimed at someone, socially risky) — never use sarcasm upward in a hierarchy. Understatement is common: 'non male' usually means 'quite good' (a compliment, not faint praise), 'non proprio ideale' means 'quite bad'. The Vietnamese-speaker trap is answering ironic phrases literally, which reveals you 'didn't catch it' — when unsure, respond neutrally ('Capisco la frustrazione') rather than laughing along or replying straight.",
    tip_advice_vi:
      "VIẾT LẠI mỉa mai thành phê bình trung tính (luyện để hiểu cơ chế):\n- « Geniale, proprio. » → « Questa scelta non mi sembra efficace. »\n- « Che sorpresa. » → « Purtroppo succede spesso. »\n- « Ottimo lavoro… » → « Ci sono alcuni aspetti da correggere. »\n- « Auguri. » → « Potrebbe essere complicato. »\n\nNGÂN HÀNG ĐÁP LẠI AN TOÀN (theo tình huống):\n- Không chắc có phải đùa không: « Non so se era una battuta, ma… »\n- Mỉa nhẹ, muốn hùa nhẹ: « Eh, in effetti… »\n- Bối cảnh công việc: « Capisco la frustrazione. »\n- Câu quá sắc, muốn kéo về thực tế: « Preferirei restare sul punto pratico. »\n- Tự mỉa: « Almeno ci provo. »\n- Không bắt được câu đùa: « Scusa, non l'ho colta subito. »\n\nSÁU LỖI của người Việt:\n1. Đừng chỉ trả lời câu mỉa theo nghĩa đen.\n2. Sarcasmo rủi ro về mặt xã hội; tránh dùng với người trên.\n3. « Che sorpresa » có thể mang nghĩa ngược.\n4. Nói giảm rất phổ biến: « non male », « non proprio ideale ».\n5. Nếu không chắc, đáp trung tính.\n6. Hài hước phụ thuộc nặng vào quan hệ và giọng điệu.\n\nBÀI LUYỆN:\n1. Xác định 10 câu là nghĩa đen hay mỉa mai.\n2. Viết lại sarcasmo thành phê bình trung tính.\n3. Đáp an toàn với một câu đùa bạn không hiểu.\n4. Giải thích một câu nói giảm tiếng Ý bằng tiếng Việt.\n5. Ghi âm hai phiên bản « Che sorpresa »: nghĩa đen và mỉa mai.\n6. Đánh dấu tín hiệu giọng: ngắt, nhấn, ngữ cảnh.\n\nQUAN TRỌNG: khi đang tức giận, TRÁNH mỉa mai — nó dễ leo thang xung đột và khó rút lại.",
    tip_advice_en:
      "Rewrite sarcasm as neutral criticism to learn the mechanism: 'Geniale, proprio.' → 'Questa scelta non mi sembra efficace.'; 'Che sorpresa.' → 'Purtroppo succede spesso.'; 'Ottimo lavoro…' → 'Ci sono alcuni aspetti da correggere.'; 'Auguri.' → 'Potrebbe essere complicato.' Keep a safe-response bank by situation: unsure if it was a joke ('Non so se era una battuta, ma…'); light irony ('Eh, in effetti…'); professional setting ('Capisco la frustrazione.'); too sharp ('Preferirei restare sul punto pratico.'); self-irony ('Almeno ci provo.'); missed the joke ('Scusa, non l'ho colta subito.'). Six rules: don't answer irony only literally; sarcasm is socially risky — avoid it upward; 'Che sorpresa' may mean the opposite; understatement is common ('non male', 'non proprio ideale'); when unsure, respond neutrally; humor depends heavily on relationship and tone. Crucially, when angry, AVOID irony — it escalates conflict and is hard to take back.",
    vocabulary: [
      {
        cell_id: "495ce764-b0aa-4363-bcc8-cc0b9920f209",
        word: "l'ironia",
        en: "irony (subtle, often not personal)",
        vi: "mỉa mai nhẹ, thông minh",
        pos: "n.f.",
        pronunciation_vi: "i-ro-NÌ-a",
        pronunciation_en: "lee-ro-NEE-ah — clever, subtle; final-stressed -NÌ-a",
      },
      {
        cell_id: "7c74a938-9e7a-48dd-9fd6-a5c32c4fb4d1",
        word: "il sarcasmo",
        en: "sarcasm (sharper, aimed at someone)",
        vi: "châm biếm sắc hơn",
        pos: "n.m.",
        pronunciation_vi: "sar-CÀS-mo",
        pronunciation_en: "sar-KAHS-mo — sharper and socially risky; stress -KAHS-",
      },
      {
        cell_id: "a77532eb-2f1b-497b-abcd-c7069903191c",
        word: "la battuta",
        en: "the joke / quip",
        vi: "câu đùa",
        pos: "n.f.",
        pronunciation_vi: "bat-TÚ-ta",
        pronunciation_en: "baht-TOO-tah — a quip; double t held",
      },
      {
        cell_id: "e4df68d2-9cd7-4e90-887e-5217298c9f2c",
        word: "il sottinteso",
        en: "the implication / unspoken meaning",
        vi: "hàm ý",
        pos: "n.m.",
        pronunciation_vi: "sot-tin-TÉ-zo",
        pronunciation_en: "sot-teen-TEH-zo — what is meant but not said; double t",
      },
      {
        cell_id: "fafbdeda-1f91-4c7a-976d-e52d77b77c83",
        word: "l'allusione",
        en: "the allusion",
        vi: "ám chỉ",
        pos: "n.f.",
        pronunciation_vi: "al-lu-ZIÔ-ne",
        pronunciation_en: "lahl-loo-ZYOH-neh — an indirect reference; double l; -sione = 'ZYOH-neh'",
      },
      {
        cell_id: "1b198069-f832-4c4c-9006-d1593493887c",
        word: "l'autoironia",
        en: "self-irony",
        vi: "tự mỉa",
        pos: "n.f.",
        pronunciation_vi: "au-to-i-ro-NÌ-a",
        pronunciation_en: "ow-to-ee-ro-NEE-ah — irony directed at oneself; socially safe",
      },
      {
        cell_id: "2f9c1974-81e6-4aae-9087-6f934aaccfe4",
        word: "la presa in giro",
        en: "the teasing / mockery",
        vi: "trêu, chọc",
        pos: "n.f.",
        pronunciation_vi: "PRÉ-za in GÍ-ro",
        pronunciation_en: "PREH-zah een JEE-ro — light teasing; -gi- = 'jee'",
      },
      {
        cell_id: "5b697154-69fc-4c2b-9899-f885488400d8",
        word: "il tono pungente",
        en: "the cutting / barbed tone",
        vi: "giọng sắc, châm chích",
        pos: "n.m.",
        pronunciation_vi: "TÒ-no pun-GÈN-te",
        pronunciation_en: "TOH-no poon-JEN-teh — a sharp tone; -gen- = 'jen'",
      },
      {
        cell_id: "98061340-384e-4203-8fb8-1b23e452ebef",
        word: "attenuare una critica",
        en: "to soften a criticism",
        vi: "làm mềm một lời phê bình",
        pos: "loc. v.",
        pronunciation_vi: "at-te-nu-À-re ÚN-a CRÍ-ti-ca",
        pronunciation_en: "aht-teh-noo-AH-reh oo-nah KREE-tee-kah — to cushion a critique",
      },
      {
        cell_id: "469406b4-5e02-480b-9e96-3458b6cfd7fa",
        word: "cogliere una battuta",
        en: "to catch / get a joke",
        vi: "bắt được câu đùa",
        pos: "loc. v.",
        pronunciation_vi: "CÓ-glie-re ÚN-a bat-TÚ-ta",
        pronunciation_en: "KOH-lyeh-reh oo-nah baht-TOO-tah — -gli- = 'ly'; to get the joke",
      },
    ],
    dialogue: [
      {
        cell_id: "d936e9f4-1882-495f-a101-c11f7b33a442",
        speaker: "Collega",
        text: "Il sito dell'ufficio si è bloccato di nuovo.",
        vi: "Trang web của cơ quan lại sập rồi.",
      },
      {
        cell_id: "b895508c-0732-46e5-b9bc-0f6773ab3d70",
        speaker: "Linh",
        text: "Che sorpresa.",
        vi: "Thật bất ngờ. (mỉa mai: chẳng bất ngờ chút nào)",
      },
      {
        cell_id: "e2ab4820-9f99-4f68-9071-5688f91e7ff5",
        speaker: "Collega",
        text: "Eh, in effetti succede ogni lunedì. Almeno noi ci proviamo a lavorare.",
        vi: "Ờ, thật ra thứ Hai nào cũng vậy. Ít nhất thì bọn mình cũng cố làm việc. (tự mỉa)",
      },
      {
        cell_id: "85f11b18-5c40-46c4-82f4-554741c45c43",
        speaker: "Linh",
        text: "Capisco la frustrazione. Però preferirei restare sul punto pratico: a chi scriviamo per segnalarlo?",
        vi: "Tôi hiểu sự bực bội. Nhưng tôi muốn giữ ở điểm thực tế hơn: ta viết cho ai để báo việc này?",
      },
    ],
    dialogue_long: [
      {
        speaker: "Capoufficio",
        text: "Allora, ha visto la nuova procedura digitale? Geniale, proprio.",
        vi: "Vậy, anh đã xem quy trình số mới chưa? Thiên tài thật đấy. (mỉa mai)",
      },
      {
        speaker: "Linh",
        text: "Diciamo che si poteva fare meglio. Non so se era una battuta, ma il modulo richiede tre firme per una stessa pagina.",
        vi: "Nói đúng hơn là có thể làm tốt hơn. Tôi không chắc đó có phải câu đùa không, nhưng cái biểu mẫu yêu cầu ba chữ ký cho cùng một trang.",
      },
      {
        speaker: "Capoufficio",
        text: "Interessante… Lei trova che il problema sia il modulo, e non l'utente?",
        vi: "Thú vị đấy… Anh thấy vấn đề nằm ở biểu mẫu, chứ không phải người dùng à? (hàm ý nghi ngờ)",
      },
      {
        speaker: "Linh",
        text: "Colgo l'allusione, e non la condivido. Non è una questione di chi sbaglia: la procedura non è proprio il massimo, e questo è un dato, non un'opinione. Ridimensionerei i toni e guarderei i numeri: il 40% degli utenti abbandona a metà.",
        vi: "Tôi bắt được hàm ý đó, và tôi không đồng tình. Đây không phải chuyện ai sai: quy trình không hẳn là tốt nhất, và đó là một dữ kiện, không phải ý kiến. Tôi sẽ hạ giọng xuống và nhìn vào con số: 40% người dùng bỏ giữa chừng.",
      },
      {
        speaker: "Capoufficio",
        text: "Touché. Allora, senza ironia: cosa proporrebbe?",
        vi: "Đúng là vậy. Thôi, không mỉa nữa: anh đề xuất gì?",
      },
      {
        speaker: "Linh",
        text: "Una sola firma digitale e un riepilogo finale. Semplice, verificabile, e — mi permetta l'autoironia — perfino comprensibile a me che odio i moduli.",
        vi: "Chỉ một chữ ký số và một bản tóm tắt cuối. Đơn giản, kiểm chứng được, và — cho phép tôi tự mỉa — dễ hiểu đến mức ngay cả tôi, người ghét biểu mẫu, cũng hiểu được.",
      },
    ],
    roleplay_prompts: [
      "Một đồng nghiệp nói « Ottimo lavoro… » với giọng kéo dài. Hãy quyết định: đó là khen thật hay mỉa? Liệt kê các tín hiệu, rồi đáp lại an toàn.",
      "Viết lại ba câu mỉa mai thành phê bình trung tính, giữ nguyên nội dung nhưng bỏ giọng châm chích.",
      "Bạn không bắt được một câu đùa của sếp. Hãy đáp lại lịch sự mà không giả vờ hiểu (« Scusa, non l'ho colta subito »).",
    ],
    roleplay_prompts_en: [
      "A colleague says 'Ottimo lavoro…' with a drawn-out tone. Decide: genuine praise or irony? List the cues, then respond safely.",
      "Rewrite three sarcastic lines as neutral criticism, keeping the content but removing the barb.",
      "You missed a joke from your boss. Respond politely without pretending to understand ('Scusa, non l'ho colta subito').",
    ],
    register_notes:
      "Ironia chấp nhận được giữa người ngang hàng và có thể tạo gắn kết; sarcasmo nhắm vào người trên trong thứ bậc là RỦI RO và nên tránh. Autoironia (tự mỉa) gần như luôn an toàn và thường làm dịu căng thẳng. Khi không chắc giọng điệu, hạ về trung tính: « Capisco la frustrazione » hoặc « Preferirei restare sul punto pratico ». Nói giảm như « non male »/« non è il massimo » thuộc văn phong thân mật-trung tính; trong văn bản trang trọng hãy nói thẳng và chính xác thay vì dựa vào nói giảm.",
    register_notes_en:
      "Irony is acceptable among peers and can build rapport; sarcasm aimed upward in a hierarchy is risky and best avoided. Self-irony (autoironia) is almost always safe and often defuses tension. When unsure of the tone, drop to neutral: 'Capisco la frustrazione' or 'Preferirei restare sul punto pratico.' Understatement like 'non male' / 'non è il massimo' belongs to the informal-neutral register; in formal writing, state things directly and precisely rather than relying on understatement.",
    exercises: [
      {
        type: "fill-blank",
        question: "Non so se era una ________, ma il modulo richiede tre firme.",
        answer: "battuta",
        hint_vi: "Danh từ = câu đùa; cách lịch sự để kiểm tra xem người kia đang mỉa hay nói thật.",
        hint_en: "Noun = joke; a polite way to check whether the other person is being ironic or literal.",
      },
      {
        type: "matching",
        pairs: [
          ["l'ironia", "mỉa mai nhẹ, thông minh (subtle irony)"],
          ["il sarcasmo", "châm biếm sắc hơn (sharper sarcasm)"],
          ["il sottinteso", "hàm ý (the implication)"],
          ["l'autoironia", "tự mỉa (self-irony)"],
        ],
        instruction: "Nối từ vựng về giọng điệu/hàm ý với nghĩa tiếng Việt",
        instruction_en: "Match the tone/subtext vocabulary with its Vietnamese meaning",
      },
      {
        type: "translation",
        vietnamese: "Tôi hiểu sự bực bội, nhưng tôi muốn giữ ở điểm thực tế hơn.",
        italian: "Capisco la frustrazione, ma preferirei restare sul punto pratico.",
        english: "I understand the frustration, but I'd rather stay on the practical point.",
      },
    ],
    idiom_glosses: [
      {
        idiom: "Che sorpresa.",
        literal: "Thật bất ngờ.",
        literal_en: "What a surprise.",
        meaning: "mỉa mai khi điều đó hoàn toàn không bất ngờ (vì xảy ra thường xuyên)",
        meaning_en: "ironic — used when something is entirely unsurprising because it happens all the time",
        example: "— Il treno è in ritardo. — Che sorpresa.",
        example_en: "— The train is late. — What a surprise. (i.e. as always)",
      },
      {
        idiom: "Diciamo che si poteva fare meglio.",
        literal: "Nói rằng đã có thể làm tốt hơn.",
        literal_en: "Let's say it could have been done better.",
        meaning: "phê bình được làm mềm: kết quả thực ra chưa đạt, nhưng tránh nói thẳng",
        meaning_en: "softened criticism: the result is actually unsatisfactory, but the speaker avoids saying so directly",
        example: "Il rapporto? Diciamo che si poteva fare meglio.",
        example_en: "The report? Let's say it could have been done better.",
      },
      {
        idiom: "Non è proprio il massimo.",
        literal: "Không hẳn là cái tối đa.",
        literal_en: "It's not exactly the maximum.",
        meaning: "nói giảm tiêu cực: thực ra là khá tệ, nhưng diễn đạt nhẹ đi",
        meaning_en: "negative understatement: it's actually quite bad, expressed mildly",
        example: "Come servizio, non è proprio il massimo.",
        example_en: "As a service, it's not exactly the best.",
      },
    ],
  },
];

export default lessons;
