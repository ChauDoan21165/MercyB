// Brazilian Portuguese C1 lessons — Vietnamese-first (L1 = Vietnamese),
// English companion fields.
//
// Variety: Brazilian Portuguese (português brasileiro). Orthography follows the
// post-2009 Acordo Ortográfico (e.g. "ideia", "voo", no trema). Pronunciation
// hints describe the prestige São Paulo / Rio educated-speaker register, which
// is what a Vietnamese learner will hear in academic videos and conferences.
//
// Self-contained on purpose: unlike the French track, the Portuguese language
// folder does not yet ship a sibling `./lessons.ts` registry with a shared
// `PortugueseLesson` type, so the structural types are declared inline here.
// They mirror the French `FrenchLesson` shape (src/languages/french/lessons.ts)
// and the Italian inline types field for field, so a future `lessons.ts` can
// lift these definitions out unchanged.
//
// Scope (C1): academic register, professional presentations, critical analysis,
// and nuanced opinion. Every lesson assumes the learner can already hold a B2
// conversation and now needs the rhetorical machinery — hedging, concession,
// nominalization, register control — that distinguishes a fluent speaker from
// an advanced one.

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PortugueseCategoryId =
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

export type Exercise = Record<string, any>;

export type IdiomGloss = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type PortugueseLesson = {
  id: string;
  category: PortugueseCategoryId;
  level: PortugueseCefrLevel;
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

export const lessons: PortugueseLesson[] = [
  // ── 1. Academic presentation / thesis defense ─────────────────────────
  {
    id: "lapresentacao_academica",
    level: "C1",
    category: "fluency",
    title_vi: "Trình bày luận đề và giả thuyết nghiên cứu (học thuật)",
    title_en: "Presenting a thesis and research hypothesis (academic)",
    sentences: [
      {
        en: "The central hypothesis underlying this work posits that the independent variable exerts a significant influence on the observed phenomenon.",
        vi: "Giả thuyết trung tâm làm nền cho công trình này đặt giả định rằng biến độc lập có tác động đáng kể đến hiện tượng được quan sát.",
        pronunciation_focus: [
          "hipótese → i-PÓ-te-zi (h câm; -se cuối đọc 'zi', mở miệng ở PÓ)",
          "subjacente → su-bja-SEN-tchi (-te cuối thành 'tchi' kiểu Brazil)",
          "variável → va-ri-Á-vew (-l cuối thành 'w'; nhấn Á)",
          "fenômeno → fe-NÔ-me-nu (ô đóng; o cuối thành 'u')",
        ],
        pronunciation_focus_en: [
          "hipótese → 'ee-PO-teh-zee' (silent h; final -se = 'zee', open stressed 'PO')",
          "subjacente → 'soob-zhah-SEN-chee' (final -te palatalizes to 'chee' in Brazil)",
          "variável → 'vah-ree-AH-vew' (final -l becomes a 'w' glide; stress AH)",
          "fenômeno → 'feh-NOH-meh-noo' (closed ô; unstressed final o = 'oo')",
        ],
      },
      {
        en: "Our approach follows on from earlier studies while departing from them on one essential methodological point.",
        vi: "Cách tiếp cận của chúng tôi nối tiếp các nghiên cứu trước đó, đồng thời tách khỏi chúng ở một điểm phương pháp luận cốt yếu.",
        pronunciation_focus: [
          "abordagem → a-bor-DA-jẽ (-gem cuối mũi, đọc 'jẽ' khép môi nhẹ)",
          "anteriores → an-te-ri-Ô-ris (mở rộng; -es cuối thành 'is')",
          "afastando → a-fas-TÃN-du (s trước 't' giữ rõ; -ando mũi)",
          "metodológico → me-to-do-LÓ-ji-ku (nhấn LÓ; -co cuối 'ku')",
        ],
        pronunciation_focus_en: [
          "abordagem → 'ah-bor-DAH-zhang' (nasal final -gem, soft 'zh' + nasalized vowel)",
          "anteriores → 'an-teh-ree-OH-rees' (final -es = 'ees')",
          "afastando → 'ah-fas-TAHN-doo' (keep the s before t; nasal -ando)",
          "metodológico → 'meh-toh-doh-LO-zhee-koo' (stress LO; final -co = 'koo')",
        ],
      },
      {
        en: "It must be acknowledged that, to our knowledge, no prior study has jointly addressed these two dimensions.",
        vi: "Phải thừa nhận rằng, theo hiểu biết của chúng tôi, chưa có nghiên cứu nào trước đây xử lý đồng thời cả hai chiều kích này.",
        pronunciation_focus: [
          "reconhecer → re-co-nhe-SÊR (nh = 'nh' như tiếng Việt; nhấn cuối)",
          "conhecimento → co-nhe-si-MEN-tu (nh đầu giữa; -to cuối 'tu')",
          "conjuntamente → con-jun-ta-MEN-tchi (-te cuối 'tchi')",
          "dimensões → di-men-SÕIS (-ões mũi đôi, rất Brazil)",
        ],
        pronunciation_focus_en: [
          "reconhecer → 'heh-koh-nyeh-SEH' (initial r = English 'h'; nh = 'ny' as in canyon)",
          "conhecimento → 'koh-nyeh-see-MEN-too' (nh = 'ny'; final -to = 'too')",
          "conjuntamente → 'kon-zhoon-tah-MEN-chee' (final -te = 'chee')",
          "dimensões → 'dee-men-SOYNGSH' (nasal diphthong -ões, very Brazilian)",
        ],
      },
      {
        en: "Subject to more thorough empirical validation, it would seem that the observed correlation is not a matter of mere chance.",
        vi: "Với điều kiện được kiểm chứng thực nghiệm sâu hơn, có vẻ như tương quan quan sát được không thuộc về sự ngẫu nhiên đơn thuần.",
        pronunciation_focus: [
          "ressalva → he-SÁW-va (rr = 'h' mạnh; -al thành 'aw')",
          "validação → va-li-da-SÃW (-ção cuối = 'sãw' mũi, dấu hiệu C1)",
          "empírica → em-PÍ-ri-ka (em đầu mũi; nhấn PÍ)",
          "acaso → a-KA-zu (s giữa nguyên âm = 'z')",
        ],
        pronunciation_focus_en: [
          "ressalva → 'heh-SAHW-vah' (rr = strong 'h'; -al = 'aw' glide)",
          "validação → 'vah-lee-dah-SOWNG' (the -ção ending = nasal 'sowng', a C1 hallmark)",
          "empírica → 'em-PEE-ree-kah' (nasal 'em' onset; stress PEE)",
          "acaso → 'ah-KAH-zoo' (s between vowels = 'z')",
        ],
      },
      {
        en: "That said, I want to qualify my conclusions by recalling the limits inherent in our sample.",
        vi: "Dù vậy, tôi muốn làm rõ sắc thái cho các kết luận bằng cách nhắc đến những giới hạn vốn có của mẫu nghiên cứu.",
        pronunciation_focus: [
          "ressalvar → he-saw-VÁR (lặp âm 'h' đầu; nhấn cuối)",
          "conclusões → con-clu-ZÕIS (-ões mũi; s thành 'z' giữa nguyên âm)",
          "inerentes → i-ne-REN-tchis (-tes cuối 'tchis')",
          "amostra → a-MÓS-tra (mở MÓ; cụm 'str' giữ rõ)",
        ],
        pronunciation_focus_en: [
          "ressalvar → 'heh-saw-VAH' (initial 'h' sound; final-syllable stress)",
          "conclusões → 'kon-kloo-ZOYNGSH' (nasal -ões; s = 'z' between vowels)",
          "inerentes → 'ee-neh-REN-cheesh' (final -tes = 'cheesh')",
          "amostra → 'ah-MOS-trah' (open MO; keep the 'str' cluster crisp)",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong giới đại học Brazil, việc trình bày luận đề (« tese ») hoặc giả thuyết nghiên cứu (« hipótese de pesquisa ») trong một « banca » (hội đồng), một « defesa » (buổi bảo vệ), hay một « seminário » đi theo một kịch bản tu từ chặt chẽ — khác với cách thuyết trình kết quả ở Việt Nam vốn thường thiên về liệt kê thành tựu. Hội đồng Brazil KỲ VỌNG nghiên cứu sinh:\n\n(1) BẮT ĐẦU BẰNG « REVISÃO DA LITERATURA » (tổng quan tài liệu) — nêu rõ ai đã làm gì, kết luận ra sao, lỗ hổng còn lại. Thiếu phần này, hội đồng đọc bạn là chưa làm bài đọc.\n\n(2) ĐỊNH VỊ MÌNH bằng « este trabalho se insere em… » (công trình này nằm trong dòng…) và « afasta-se de… » (tách khỏi…). Nói « eu estudo X » mà không định vị bị xem là sinh viên cử nhân, không phải mestrando/doutorando.\n\n(3) PHÁT BIỂU GIẢ THUYẾT bằng « postula-se que », « parte-se da hipótese de que », « argumenta-se que » — KHÔNG « eu acho que », « na minha opinião ». Học thuật Brazil thường dùng thể bị động vô nhân xưng (« postula-se », « observa-se ») để xóa cái « eu » cảm tính.\n\n(4) HEDGE (rào đón) ngay từ đầu: « tudo indica que », « ao que parece », « sob reserva de ». Một giả thuyết KHÔNG hedge ở C1 nghe như giáo điều và bị hội đồng tấn công ngay câu hỏi đầu.\n\nNgười Việt mới vào đại học Brazil dễ rơi vào hai bẫy: (a) quá tự tin — phát biểu kết luận chắc nịch như chứng minh toán, làm hội đồng cảnh giác; (b) quá khiêm tốn — « ainda sou iniciante, meus resultados podem estar errados » — đẩy hội đồng vào vai trò trấn an, lãng phí thời gian. Khoảng giữa là giọng « afirmação ponderada » (khẳng định có chừng mực): nói thẳng giả thuyết, gắn với điều kiện kiểm chứng, sẵn sàng từ bỏ nếu dữ liệu phản bác.",
    cultural_notes_en:
      "In Brazilian academia, presenting a thesis ('tese') or research hypothesis ('hipótese de pesquisa') before a 'banca' (committee), at a 'defesa' (defense), or in a 'seminário' follows a tight rhetorical script. The committee expects you to: (1) open with a 'revisão da literatura' — who did what, what they concluded, what gap remains. Skip it and you read as underprepared. (2) Position yourself with 'este trabalho se insere em…' (this work sits within…) and 'afasta-se de…' (departs from…). Saying 'eu estudo X' without that positioning marks you as an undergraduate, not a master's/doctoral candidate. (3) State hypotheses with the impersonal passive — 'postula-se que', 'parte-se da hipótese de que', 'argumenta-se que' — NOT 'eu acho que' or 'na minha opinião'. Brazilian academic prose leans heavily on the impersonal 'se' construction ('observa-se', 'verifica-se') to erase the emotional first person. (4) Hedge from the first sentence: 'tudo indica que', 'ao que parece', 'sob reserva de'. An unhedged C1 hypothesis sounds dogmatic and invites immediate attack at Q&A.\n\nTwo traps: (a) over-confidence — stating conclusions like a proof, which makes the banca distrust you; (b) over-modesty — 'I'm still a beginner, I might be wrong' — forcing the committee into reassurance mode. The middle voice, 'afirmação ponderada', means stating the hypothesis cleanly, tying it to falsifiable conditions, and signaling you'd abandon it if the data refutes it. Note: Brazilian defenses are more conversational and warmer than French ones — the banca will often address you by first name and smile — but the rhetorical rigor underneath is identical. Warmth is not informality.",
    tip_advice_vi:
      "Cấu trúc chuẩn để trình bày một « hipótese de pesquisa » trong 3-5 phút (seminário, defesa):\n\n(1) FRASE DE ABERTURA: « Este trabalho se insere no campo de X e tem como objeto, mais precisamente, Y. » — định danh lĩnh vực + đối tượng cụ thể, một câu.\n\n(2) REVISÃO CONDENSADA: « A literatura anterior — sobretudo os trabalhos de A (ano), B (ano) e C (ano) — estabeleceu que… No entanto, um ponto permanece pouco explorado: Z. » — nêu 3 tên (không hơn cho oral), kết luận chung, lỗ hổng cụ thể.\n\n(3) FORMULAÇÃO DA HIPÓTESE: « É precisamente essa lacuna que pretendo abordar. Minha hipótese de trabalho é a seguinte: [phát biểu]. »\n\n(4) METODOLOGIA EM UMA FRASE: « Para testá-la, constituí um corpus de N [đơn vị] que analisei sob a ótica de [framework]. »\n\n(5) ANTECIPAÇÃO DA OBJEÇÃO: « Poder-se-ia objetar que [phản biện dễ đoán]. A isso eu responderia que [câu trả lời mầm]. » — câu này sang ngay số học thuật C1; thiếu nó = bị hỏi sát ván câu đầu.\n\nTRÁNH:\n- « Vou falar sobre… » → quá thân mật; dùng « Este trabalho trata de… »\n- « É muito interessante porque… » → trống rỗng; nêu lý do cụ thể\n- « Como disse Foucault… » → trích một tên không ngữ cảnh; nêu công trình + năm + ý cụ thể\n- Đọc slide từng chữ → KHÔNG; slide là điểm tựa, lời nói là sản phẩm\n- Vượt thời gian → mất điểm ngay\n\nLuyện ở nhà: viết 5 câu trên (abertura / revisão / hipótese / metodologia / objeção) và đọc to đến khi nói được trong 3 phút không nhìn giấy.",
    tip_advice_en:
      "Standard structure for presenting a research hypothesis in 3–5 minutes (seminar or defense):\n\n(1) OPENING SENTENCE: 'Este trabalho se insere no campo de X e tem como objeto, mais precisamente, Y.' — name the field + the specific object in one sentence. The reflexive 'se insere' is far more academic than 'é sobre'.\n\n(2) CONDENSED REVIEW: name THREE authors max (more clutters oral delivery), state the consensus, then the precise gap: 'A literatura anterior — sobretudo os trabalhos de A (ano), B (ano) e C (ano) — estabeleceu que… No entanto, um ponto permanece pouco explorado: Z.'\n\n(3) HYPOTHESIS FORMULATION: 'É precisamente essa lacuna que pretendo abordar. Minha hipótese de trabalho é a seguinte: [statement].' The 'lacuna' (gap/blind spot) framing is C1-register gold.\n\n(4) METHODOLOGY IN ONE SENTENCE: 'Para testá-la, constituí um corpus de N [units] que analisei sob a ótica de [framework].'\n\n(5) ANTICIPATING THE OBJECTION: 'Poder-se-ia objetar que [predictable critique]. A isso eu responderia que [seed of an answer].' This single sentence lifts you to C1-academic register; skip it and the first question will be brutal. (Note: 'poder-se-ia' is mesoclisis — pronoun inside the verb — and is itself a marker of formal written register; in speech you may prefer 'alguém poderia objetar que'.)\n\nAVOID:\n- 'Vou falar sobre…' — too casual; use 'Este trabalho trata de…'\n- 'É muito interessante porque…' — empty filler; give the concrete reason\n- 'Como disse Foucault…' — name-dropping without context; give work + year + specific idea\n- Reading slides verbatim — slides are scaffolding, your voice is the product\n- Going over time — penalized immediately\n\nPractice at home: write all five sentences (abertura / revisão / hipótese / metodologia / objeção) and read them aloud until you can deliver them in three minutes without notes.",
    vocabulary: [
      {
        word: "a hipótese de pesquisa",
        en: "the research hypothesis",
        vi: "giả thuyết nghiên cứu",
        pos: "n.f.",
        pronunciation_vi: "i-PÓ-te-zi dji pes-KI-za",
        pronunciation_en: "ee-PO-teh-zee jee pes-KEE-zah — silent h; 'de' palatalizes to 'jee'; pesquisa s = 'z' between vowels",
      },
      {
        word: "postular que",
        en: "to posit that",
        vi: "đặt giả định rằng",
        pos: "v.",
        pronunciation_vi: "pos-tu-LÁR ki",
        pronunciation_en: "pos-too-LAH kee — final -r softens/drops; 'que' = 'kee'",
      },
      {
        word: "a variável independente",
        en: "the independent variable",
        vi: "biến độc lập",
        pos: "n.f.",
        pronunciation_vi: "va-ri-Á-vew in-de-pen-DEN-tchi",
        pronunciation_en: "vah-ree-AH-vew een-deh-pen-DEN-chee — final -l = 'w' glide; final -te = 'chee'",
      },
      {
        word: "inserir-se no campo de",
        en: "to sit within the field of",
        vi: "nằm trong lĩnh vực của",
        pos: "v.",
        pronunciation_vi: "in-se-RÍR-si nu KÃM-pu dji",
        pronunciation_en: "een-seh-HEER-see noo KAHM-poo jee — reflexive 'se'; campo is nasalized 'KAHM'",
      },
      {
        word: "afastar-se de",
        en: "to distinguish oneself from / depart from",
        vi: "tách khỏi / khác biệt với",
        pos: "v.",
        pronunciation_vi: "a-fas-TÁR-si dji",
        pronunciation_en: "ah-fas-TAH-see jee — keep the s before t; final -r soft",
      },
      {
        word: "no caso em questão",
        en: "in the case at hand",
        vi: "trong trường hợp cụ thể này",
        pos: "loc.",
        pronunciation_vi: "nu KA-zu ẽ kes-TÃW",
        pronunciation_en: "noo KAH-zoo eng kes-TOWNG — formal connector; -ão = nasal 'owng'",
      },
      {
        word: "cumpre reconhecer que",
        en: "one cannot but acknowledge that",
        vi: "phải thừa nhận rằng",
        pos: "loc.",
        pronunciation_vi: "KUM-pri he-co-nhe-SÊR ki",
        pronunciation_en: "KOOM-pree heh-koh-nyeh-SEH kee — academic opener; nh = 'ny'; initial r = 'h'",
      },
      {
        word: "sob reserva de",
        en: "subject to / pending",
        vi: "với điều kiện",
        pos: "prep.",
        pronunciation_vi: "sób he-ZÉR-va dji",
        pronunciation_en: "sob heh-ZEH-vah jee — 're' of reserva = 'heh'; s = 'z' between vowels",
      },
      {
        word: "ressalvar uma conclusão",
        en: "to qualify a conclusion",
        vi: "làm rõ sắc thái cho kết luận",
        pos: "v.",
        pronunciation_vi: "he-saw-VÁR u-ma con-clu-ZÃW",
        pronunciation_en: "heh-saw-VAH oo-mah kon-kloo-ZOWNG — rr = strong 'h'; -ão = 'owng'",
      },
      {
        word: "a amostra",
        en: "the sample",
        vi: "mẫu nghiên cứu",
        pos: "n.f.",
        pronunciation_vi: "a a-MÓS-tra",
        pronunciation_en: "ah ah-MOS-trah — open stressed 'MO'; crisp 'str' cluster",
      },
    ],
    dialogue: [
      {
        speaker: "Profa. Ribeiro (orientadora)",
        text: "Linh, você poderia nos expor em alguns minutos a hipótese central do seu trabalho?",
        vi: "Linh, em có thể trình bày trong vài phút giả thuyết trung tâm của công trình không?",
        en: "Linh, could you set out the central hypothesis of your work for us in a few minutes?",
      },
      {
        speaker: "Linh",
        text: "Com prazer. Minha hipótese postula que existe um vínculo causal entre a exposição precoce a uma L2 e a flexibilidade metalinguística observada na vida adulta.",
        vi: "Rất sẵn lòng. Giả thuyết của em đặt giả định có một mối liên hệ nhân quả giữa việc tiếp xúc sớm với ngôn ngữ thứ hai và sự linh hoạt siêu ngôn ngữ quan sát được ở tuổi trưởng thành.",
        en: "Gladly. My hypothesis posits a causal link between early exposure to an L2 and the metalinguistic flexibility observed in adulthood.",
      },
      {
        speaker: "Profa. Ribeiro",
        text: "Em que corpus você se apoia para sustentar essa intuição?",
        vi: "Em dựa trên ngữ liệu nào để củng cố trực giác này?",
        en: "What corpus are you drawing on to back up this intuition?",
      },
      {
        speaker: "Linh",
        text: "Em um corpus de oitenta entrevistas semiestruturadas, complementado por uma bateria de testes cognitivos.",
        vi: "Trên một ngữ liệu gồm tám mươi cuộc phỏng vấn bán cấu trúc, bổ sung bằng một loạt bài kiểm tra nhận thức.",
        en: "A corpus of eighty semi-structured interviews, supplemented by a battery of cognitive tests.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Profa. Ribeiro (banca de mestrado)",
        text: "Linh, a banca a ouve. Você tem quinze minutos — exposição e, em seguida, perguntas.",
        vi: "Linh, hội đồng đang nghe em. Em có 15 phút — trình bày rồi hỏi đáp.",
        en: "Linh, the committee is listening. You have fifteen minutes — presentation, then questions.",
      },
      {
        speaker: "Linh",
        text: "Obrigada. Meu trabalho se insere no campo da sociolinguística do bilinguismo e tem como objeto, mais precisamente, o efeito da idade de aquisição de uma L2 sobre as capacidades metalinguísticas adultas.",
        vi: "Cảm ơn cô. Công trình của em nằm trong lĩnh vực ngôn ngữ học xã hội về song ngữ, và cụ thể nhắm tới ảnh hưởng của tuổi tiếp thu ngôn ngữ thứ hai lên năng lực siêu ngôn ngữ ở tuổi trưởng thành.",
        en: "Thank you. My work sits within the sociolinguistics of bilingualism, and focuses specifically on the effect of age of L2 acquisition on adult metalinguistic abilities.",
      },
      {
        speaker: "Linh",
        text: "A literatura anterior — sobretudo os trabalhos de Bialystok (2001), Cummins (1979) e, mais recentemente, Costa e Sebastián-Gallés (2014) — estabeleceu de forma sólida uma vantagem cognitiva nos bilíngues precoces. No entanto, um ponto permanece relativamente pouco explorado: a medida em que essa vantagem subsiste quando a L2 é adquirida fora de um contexto escolar.",
        vi: "Tài liệu trước đó — đặc biệt các công trình của Bialystok (2001), Cummins (1979) và gần đây hơn của Costa và Sebastián-Gallés (2014) — đã xác lập vững chắc một lợi thế nhận thức ở người song ngữ sớm. Tuy vậy, có một điểm còn ít được khai thác: mức độ lợi thế đó còn duy trì khi ngôn ngữ thứ hai được tiếp thu ngoài môi trường học đường.",
        en: "Prior literature — notably the work of Bialystok (2001), Cummins (1979), and more recently Costa and Sebastián-Gallés (2014) — has firmly established a cognitive advantage in early bilinguals. That said, one point remains relatively underexplored: the extent to which this advantage holds when the L2 is acquired outside a formal school context.",
      },
      {
        speaker: "Linh",
        text: "É precisamente essa lacuna que pretendo abordar. Minha hipótese de trabalho é a seguinte: a vantagem metalinguística observada nos bilíngues precoces seria, ao menos em parte, independente do enquadramento formal de aquisição.",
        vi: "Chính tại lỗ hổng này em muốn đặt câu hỏi. Giả thuyết làm việc của em là: lợi thế siêu ngôn ngữ quan sát được ở người song ngữ sớm có lẽ, ít nhất một phần, độc lập với bối cảnh tiếp thu chính quy.",
        en: "It is precisely this gap that I intend to address. My working hypothesis is as follows: the metalinguistic advantage observed in early bilinguals would be, at least in part, independent of the formal framework of acquisition.",
      },
      {
        speaker: "Prof. Almeida (banca)",
        text: "Permita-me uma objeção: como você controla a variável socioeconômica, que poderia confundir o efeito que atribui à idade de aquisição?",
        vi: "Cho phép tôi nêu một phản biện: em kiểm soát biến kinh tế-xã hội thế nào, vì nó có thể gây nhiễu cho hiệu ứng mà em quy cho tuổi tiếp thu?",
        en: "Allow me an objection: how do you control for the socioeconomic variable, which could confound the effect you attribute to age of acquisition?",
      },
      {
        speaker: "Linh",
        text: "Pergunta pertinente, professor. Antecipei essa objeção: pareei os grupos por renda familiar e escolaridade dos pais, de modo que a variável socioeconômica permanece, em princípio, constante entre as condições. Reconheço, no entanto, que se trata de um controle estatístico, e não experimental — uma limitação que assumo explicitamente no capítulo metodológico.",
        vi: "Câu hỏi rất xác đáng, thưa thầy. Em đã lường trước phản biện này: em ghép cặp các nhóm theo thu nhập hộ gia đình và trình độ học vấn của cha mẹ, để biến kinh tế-xã hội về nguyên tắc giữ nguyên giữa các điều kiện. Tuy nhiên em thừa nhận đây là kiểm soát thống kê, không phải thực nghiệm — một giới hạn em nêu rõ trong chương phương pháp.",
        en: "A pertinent question, professor. I anticipated this objection: I matched the groups by household income and parental education, so that the socioeconomic variable remains, in principle, constant across conditions. I acknowledge, however, that this is a statistical control, not an experimental one — a limitation I state explicitly in the methodology chapter.",
      },
    ],
    register_notes:
      "Học thuật Brazil dùng nhiều thể « se » vô nhân xưng (postula-se, observa-se) để xóa cái « eu » cảm tính; giữ giọng ấm nhưng không buông lỏng độ chặt chẽ.",
    register_notes_en:
      "Brazilian academic register relies heavily on the impersonal-passive 'se' (postula-se, observa-se, verifica-se) to depersonalize claims. Use full sentences and connectors (no entanto, por conseguinte, ao passo que). The defense is warmer and more first-name-friendly than its French or German counterpart, but the rhetorical rigor is identical — warmth is not informality. Mesoclisis (poder-se-ia, dar-se-ia) is a marker of high written formality; in speech, paraphrase it. Address committee members as 'professor / professora' + surname; 'o senhor / a senhora' for the most formal tier.",
    roleplay_prompts: [
      "Trình bày giả thuyết nghiên cứu của bạn trong 3 phút, theo cấu trúc 5 câu (abertura / revisão / hipótese / metodologia / objeção).",
      "Một thành viên hội đồng nêu phản biện về cỡ mẫu nhỏ; trả lời theo công thức « antecipei essa objeção… reconheço, no entanto, que… ».",
    ],
    roleplay_prompts_en: [
      "Present your research hypothesis in 3 minutes following the five-sentence structure (abertura / revisão / hipótese / metodologia / objeção).",
      "A committee member objects that your sample is too small; respond using 'antecipei essa objeção… reconheço, no entanto, que…'.",
    ],
  },

  // ── 2. Critical analysis ──────────────────────────────────────────────
  {
    id: "lanalise_critica",
    level: "C1",
    category: "fluency",
    title_vi: "Phân tích phản biện: đánh giá luận điểm, phát hiện ngụy biện",
    title_en: "Critical analysis: evaluating arguments, spotting fallacies",
    sentences: [
      {
        en: "The author's argument rests on a premise that is never made explicit and that, on closer inspection, proves debatable.",
        vi: "Lập luận của tác giả dựa trên một tiền đề chưa bao giờ được nêu rõ và khi xem xét kỹ thì lại đáng tranh cãi.",
        pronunciation_focus: [
          "argumento → ar-gu-MEN-tu (g cứng; -to cuối 'tu')",
          "premissa → pre-MÍS-sa (s đôi giữ dài)",
          "explícita → es-PLÍ-si-ta (x = 's' ở đây; nhấn PLÍ)",
          "discutível → dis-cu-TÍ-vew (-vel thành 'vew')",
        ],
        pronunciation_focus_en: [
          "argumento → 'ar-goo-MEN-too' (hard g; final -to = 'too')",
          "premissa → 'preh-MEES-sah' (hold the double s)",
          "explícita → 'es-PLEE-see-tah' (x here = 's'; stress PLEE)",
          "discutível → 'dees-koo-TEE-vew' (final -vel = 'vew')",
        ],
      },
      {
        en: "While the data are convincing, the causal interpretation drawn from them strikes me as hasty.",
        vi: "Tuy dữ liệu có sức thuyết phục, cách diễn giải nhân quả rút ra từ đó với tôi có vẻ vội vàng.",
        pronunciation_focus: [
          "convincentes → con-vin-SEN-tchis (-tes cuối 'tchis')",
          "interpretação → in-ter-pre-ta-SÃW (-ção mũi cuối)",
          "causal → caw-ZÁW (au thành 'aw'; s = 'z'; -al thành 'aw')",
          "apressada → a-pre-SÁ-da (ss giữ; mở SÁ)",
        ],
        pronunciation_focus_en: [
          "convincentes → 'kon-veen-SEN-cheesh' (final -tes = 'cheesh')",
          "interpretação → 'een-ter-preh-tah-SOWNG' (nasal -ção)",
          "causal → 'kaw-ZAHW' ('au' = 'aw'; s = 'z'; -al = 'aw')",
          "apressada → 'ah-preh-SAH-dah' (kept double s; open SAH)",
        ],
      },
      {
        en: "It is worth distinguishing what the study actually demonstrates from what its author would like it to suggest.",
        vi: "Đáng để phân biệt điều mà nghiên cứu thực sự chứng minh với điều mà tác giả của nó muốn nó gợi ý.",
        pronunciation_focus: [
          "convém → con-VẼ̃Y (-vém mũi, kết môi nhẹ)",
          "distinguir → dis-tin-GÍR (gu = 'g' cứng trước i; nhấn cuối)",
          "demonstra → de-MÓNS-tra (cụm 'nstr'; mở MÓ)",
          "sugerir → su-je-RÍR (g trước e = 'j'/'zh')",
        ],
        pronunciation_focus_en: [
          "convém → 'kon-VENG' (nasal -ém, light lip close)",
          "distinguir → 'dees-teen-GEER' (gu = hard g before i; final stress)",
          "demonstra → 'deh-MONS-trah' ('nstr' cluster; open MO)",
          "sugerir → 'soo-zheh-HEER' (g before e = 'zh'; r = 'h' onset of last syllable… actually final -r soft)",
        ],
      },
      {
        en: "This reasoning seems to me to commit a hasty generalization: a single case does not warrant a universal conclusion.",
        vi: "Cách lập luận này với tôi có vẻ phạm lỗi khái quát hóa vội: một trường hợp đơn lẻ không cho phép một kết luận phổ quát.",
        pronunciation_focus: [
          "raciocínio → ha-si-o-SÍ-ni-u (rr đầu = 'h'; nhiều âm tiết)",
          "generalização → je-ne-ra-li-za-SÃW (g đầu = 'j'; -ção cuối)",
          "isolado → i-zo-LA-du (s = 'z' giữa nguyên âm)",
          "universal → u-ni-ver-SÁW (-al thành 'aw')",
        ],
        pronunciation_focus_en: [
          "raciocínio → 'hah-see-oh-SEE-nee-oo' (initial r = 'h'; many syllables)",
          "generalização → 'zheh-neh-rah-lee-zah-SOWNG' (initial g = 'zh'; nasal -ção)",
          "isolado → 'ee-zoh-LAH-doo' (s = 'z' between vowels)",
          "universal → 'oo-nee-ver-SAHW' (-al = 'aw')",
        ],
      },
      {
        en: "To be fair to the author, this objection in no way invalidates the overall thrust of the work.",
        vi: "Để công bằng với tác giả, phản biện này hoàn toàn không phủ định mạch chính của công trình.",
        pronunciation_focus: [
          "justiça → jus-TÍ-sa (j đầu = 'zh'; ç = 's')",
          "objeção → ob-je-SÃW (j = 'zh'; -ção mũi)",
          "invalida → in-va-LI-da (in đầu mũi)",
          "conjunto → con-JUN-tu (j = 'zh'; -to 'tu')",
        ],
        pronunciation_focus_en: [
          "justiça → 'zhoos-TEE-sah' (j = 'zh'; ç = 's')",
          "objeção → 'ob-zheh-SOWNG' (j = 'zh'; nasal -ção)",
          "invalida → 'een-vah-LEE-dah' (nasal 'in' onset)",
          "conjunto → 'kon-ZHOON-too' (j = 'zh'; final -to = 'too')",
        ],
      },
    ],
    cultural_notes_vi:
      "« Análise crítica » trong ngữ cảnh học thuật và chuyên môn Brazil KHÔNG có nghĩa là « chê bai ». Động từ « criticar » trong tiếng Việt và tiếng Anh thông dụng nghiêng về tiêu cực, nhưng « análise crítica » học thuật là một thao tác cân bằng: nêu cái đúng TRƯỚC, rồi mới đến giới hạn, và luôn tách « điều văn bản nói » khỏi « điều tôi suy diễn ».\n\nBa trụ cột của một phân tích phản biện chuẩn C1:\n\n(1) RECONSTRUÇÃO TRUNG THỰC: trước khi phản biện, tóm tắt luận điểm đối phương đủ công bằng để chính họ gật đầu (« nguyên tắc thiện chí » / princípio de caridade). Người Việt hay nhảy thẳng vào bác bỏ — ở Brazil điều đó bị đọc là chưa hiểu bài.\n\n(2) PHÂN BIỆT PREMISSA / CONCLUSÃO: chỉ ra giả thuyết ngầm (« o argumento repousa sobre uma premissa implícita »), rồi mới hỏi giả thuyết đó có vững không.\n\n(3) PHẢN BIỆN CÓ NHƯỢNG BỘ: « Embora os dados sejam convincentes, a interpretação me parece apressada. » — cấu trúc « embora… , … » (mặc dù) là xương sống của giọng phản biện chừng mực.\n\nLỗi người Việt hay mắc: dùng « está errado » (sai rồi) hoặc « não concordo » trống không. Ở C1, thay bằng « parece-me discutível », « caberia matizar », « a inferência me parece frágil ». Phản biện gay gắt mà không nhượng bộ nghe như công kích cá nhân, và trong văn hóa Brazil — vốn coi trọng « cordialidade » — điều đó phản tác dụng nặng nề.",
    cultural_notes_en:
      "'Análise crítica' in Brazilian academic and professional contexts does NOT mean 'criticism' in the fault-finding sense. Academic critical analysis is a balanced operation: state what's right FIRST, then the limits, and always separate 'what the text says' from 'what I infer'.\n\nThree pillars of a C1-level critical analysis:\n\n(1) FAITHFUL RECONSTRUCTION: before objecting, summarize the opposing argument fairly enough that its author would nod (the 'principle of charity' / princípio de caridade). Jumping straight to refutation reads as not having understood the material.\n\n(2) PREMISE / CONCLUSION DISTINCTION: surface the unstated assumption ('o argumento repousa sobre uma premissa implícita'), then question whether it holds.\n\n(3) OBJECTION WITH CONCESSION: 'Embora os dados sejam convincentes, a interpretação me parece apressada.' The 'embora… , …' (although) structure — note it takes the subjunctive — is the backbone of measured critical voice.\n\nA common L1-transfer error is the bare 'está errado' (it's wrong) or 'não concordo' (I disagree). At C1, replace these with 'parece-me discutível', 'caberia matizar', 'a inferência me parece frágil'. Brazilian culture prizes 'cordialidade' (interpersonal warmth); a sharp, concession-free objection reads as a personal attack and backfires badly. The goal is to be intellectually firm and interpersonally gracious at the same time — a combination Brazilians do extremely well and expect from you.",
    tip_advice_vi:
      "Khuôn 4 bước cho một đoạn phân tích phản biện (oral hoặc viết):\n\n(1) RECONSTRUIR: « Se bem entendo, o autor sustenta que… » (Nếu tôi hiểu đúng, tác giả khẳng định rằng…) — tóm tắt thiện chí.\n\n(2) RECONHECER O MÉRITO: « É inegável o mérito de… » / « O ponto forte da análise reside em… » — nêu điểm mạnh thật, không xã giao rỗng.\n\n(3) FORMULAR A OBJEÇÃO COM CONCESSÃO: « Dito isso, parece-me que a argumentação peca por… » / « Embora X, convém notar que Y. » — dùng subjuntivo sau « embora ».\n\n(4) MATIZAR: « Isso não invalida o conjunto da obra, mas convida a relativizar suas conclusões. » — đóng bằng sắc thái, không bằng phá hủy.\n\nNGỤY BIỆN thường gặp, gọi tên bằng tiếng Bồ:\n- « generalização apressada » (khái quát vội)\n- « falso dilema » (lưỡng nan giả: chỉ A hoặc B)\n- « ad hominem » (công kích người, không công kích lập luận)\n- « petição de princípio » (vòng vo: dùng kết luận làm tiền đề)\n- « espantalho » (người rơm: bóp méo luận điểm đối phương rồi đánh)\n\nMẪU CÂU AN TOÀN:\n- « A inferência me parece frágil porque… »\n- « Caberia perguntar se… »\n- « Esse argumento pressupõe que…, o que não é evidente. »\n\nTRÁNH: « está errado », « isso não faz sentido », « qualquer um sabe que… » — tất cả đều hạ C1 xuống B1 ngay.",
    tip_advice_en:
      "A four-step frame for a critical-analysis paragraph (spoken or written):\n\n(1) RECONSTRUCT: 'Se bem entendo, o autor sustenta que…' (If I understand correctly, the author holds that…) — a charitable summary.\n\n(2) ACKNOWLEDGE THE MERIT: 'É inegável o mérito de…' / 'O ponto forte da análise reside em…' — name a genuine strength, not empty politeness.\n\n(3) FORMULATE THE OBJECTION WITH CONCESSION: 'Dito isso, parece-me que a argumentação peca por…' / 'Embora X, convém notar que Y.' — note 'embora' triggers the subjunctive (Embora seja…, not Embora é…).\n\n(4) QUALIFY: 'Isso não invalida o conjunto da obra, mas convida a relativizar suas conclusões.' — close with nuance, not demolition.\n\nCommon FALLACIES, named in Portuguese:\n- 'generalização apressada' (hasty generalization)\n- 'falso dilema' (false dilemma: only A or B)\n- 'ad hominem' (attacking the person, not the argument)\n- 'petição de princípio' (begging the question / circular)\n- 'espantalho' (straw man: distort the opponent's claim, then attack it)\n\nSAFE TEMPLATES:\n- 'A inferência me parece frágil porque…'\n- 'Caberia perguntar se…'\n- 'Esse argumento pressupõe que…, o que não é evidente.'\n\nAVOID: 'está errado', 'isso não faz sentido', 'qualquer um sabe que…' — each instantly drops you from C1 to B1.",
    vocabulary: [
      {
        word: "a premissa implícita",
        en: "the implicit premise",
        vi: "tiền đề ngầm",
        pos: "n.f.",
        pronunciation_vi: "a pre-MÍS-sa im-PLÍ-si-ta",
        pronunciation_en: "ah preh-MEES-sah eem-PLEE-see-tah — double s held; x of -plíci- = 's'",
      },
      {
        word: "a inferência",
        en: "the inference",
        vi: "suy luận / suy diễn",
        pos: "n.f.",
        pronunciation_vi: "a in-fe-RÊN-si-a",
        pronunciation_en: "ah een-feh-REN-see-ah — nasal 'in' onset; closed ê",
      },
      {
        word: "discutível",
        en: "debatable / open to question",
        vi: "đáng tranh cãi",
        pos: "adj.",
        pronunciation_vi: "dis-cu-TÍ-vew",
        pronunciation_en: "dees-koo-TEE-vew — final -vel = 'vew' glide",
      },
      {
        word: "a generalização apressada",
        en: "the hasty generalization",
        vi: "khái quát hóa vội",
        pos: "n.f.",
        pronunciation_vi: "a je-ne-ra-li-za-SÃW a-pre-SÁ-da",
        pronunciation_en: "ah zheh-neh-rah-lee-zah-SOWNG ah-preh-SAH-dah — g = 'zh'; nasal -ção",
      },
      {
        word: "o espantalho (falácia)",
        en: "the straw man (fallacy)",
        vi: "ngụy biện người rơm",
        pos: "n.m.",
        pronunciation_vi: "u es-pan-TA-lhu",
        pronunciation_en: "oo es-pan-TAH-lyoo — lh = 'ly' as in million; final -o = 'oo'",
      },
      {
        word: "matizar",
        en: "to nuance / to qualify",
        vi: "làm rõ sắc thái",
        pos: "v.",
        pronunciation_vi: "ma-ti-ZÁR",
        pronunciation_en: "mah-tee-ZAH — z = 'z'; final -r soft",
      },
      {
        word: "peca por (de pecar)",
        en: "falls short on / errs by",
        vi: "mắc lỗi ở / thiếu sót ở",
        pos: "v.",
        pronunciation_vi: "PÉ-ka pur",
        pronunciation_en: "PEH-kah poor — open è in pecar; 'por' = 'poor'",
      },
      {
        word: "convém distinguir",
        en: "it is worth distinguishing",
        vi: "đáng để phân biệt",
        pos: "loc.",
        pronunciation_vi: "con-VẼ̃Y dis-tin-GÍR",
        pronunciation_en: "kon-VENG dees-teen-GEER — nasal -ém; gu = hard g before i",
      },
      {
        word: "o princípio de caridade",
        en: "the principle of charity",
        vi: "nguyên tắc thiện chí",
        pos: "n.m.",
        pronunciation_vi: "u prin-SÍ-pi-u dji ca-ri-DA-dji",
        pronunciation_en: "oo preen-SEE-pee-oo jee kah-ree-DAH-jee — final -de = 'jee'",
      },
      {
        word: "relativizar",
        en: "to put into perspective / relativize",
        vi: "đặt lại trong tương quan",
        pos: "v.",
        pronunciation_vi: "he-la-ti-vi-ZÁR",
        pronunciation_en: "heh-lah-tee-vee-ZAH — initial r = 'h'; final -r soft",
      },
    ],
    dialogue: [
      {
        speaker: "Mediador (mesa-redonda)",
        text: "Você leu o artigo de Mendes sobre meritocracia. Qual é a sua avaliação crítica?",
        vi: "Bạn đã đọc bài của Mendes về chủ nghĩa nhân tài. Đánh giá phản biện của bạn ra sao?",
        en: "You've read Mendes's article on meritocracy. What's your critical assessment?",
      },
      {
        speaker: "Linh",
        text: "Se bem entendo, Mendes sustenta que o sucesso reflete sobretudo o esforço individual. É inegável o rigor com que ele organiza os dados. Dito isso, o argumento me parece repousar sobre uma premissa implícita: a de que todos partem das mesmas condições.",
        vi: "Nếu tôi hiểu đúng, Mendes khẳng định rằng thành công phản ánh chủ yếu nỗ lực cá nhân. Không thể phủ nhận sự chặt chẽ trong cách ông tổ chức dữ liệu. Dù vậy, lập luận với tôi có vẻ dựa trên một tiền đề ngầm: rằng mọi người xuất phát từ cùng điều kiện.",
        en: "If I understand correctly, Mendes holds that success mainly reflects individual effort. The rigor with which he organizes the data is undeniable. That said, the argument seems to me to rest on an implicit premise: that everyone starts from the same conditions.",
      },
      {
        speaker: "Mediador",
        text: "E essa premissa, no seu entender, se sustenta?",
        vi: "Và tiền đề đó, theo bạn, có đứng vững không?",
        en: "And that premise, in your view, holds up?",
      },
      {
        speaker: "Linh",
        text: "Parece-me frágil. Ela ignora as desigualdades de partida, o que aproxima o raciocínio de uma generalização apressada. Isso não invalida o conjunto do artigo, mas convida a relativizar sua conclusão.",
        vi: "Với tôi nó mong manh. Nó bỏ qua bất bình đẳng xuất phát, khiến lập luận gần với một khái quát hóa vội. Điều đó không phủ định toàn bộ bài viết, nhưng mời ta đặt lại kết luận trong tương quan.",
        en: "It seems fragile to me. It ignores starting inequalities, which brings the reasoning close to a hasty generalization. This doesn't invalidate the article as a whole, but it invites us to put its conclusion into perspective.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Prof. Souza (seminário de leitura)",
        text: "Vamos discutir o capítulo. Linh, abra o fogo: o argumento de Han sobre a 'sociedade do cansaço' convence você?",
        vi: "Ta cùng bàn về chương này. Linh, mở màn đi: lập luận của Han về 'xã hội kiệt sức' có thuyết phục em không?",
        en: "Let's discuss the chapter. Linh, open the discussion: does Han's argument on the 'burnout society' convince you?",
      },
      {
        speaker: "Linh",
        text: "Em parte. Reconstruindo o argumento: Han sustenta que passamos de uma sociedade disciplinar para uma sociedade do desempenho, na qual o sujeito se explora a si mesmo. O ponto forte da análise reside na elegância do diagnóstico — ele nomeia algo que muitos sentem sem saber nomear.",
        vi: "Một phần thôi ạ. Tái dựng lập luận: Han khẳng định ta đã chuyển từ một xã hội kỷ luật sang một xã hội thành tích, nơi chủ thể tự bóc lột chính mình. Điểm mạnh của phân tích nằm ở sự sắc gọn của chẩn đoán — ông gọi tên được điều nhiều người cảm thấy mà không biết gọi tên.",
        en: "Partly. Reconstructing the argument: Han holds that we have moved from a disciplinary society to a performance society, in which the subject exploits itself. The strength of the analysis lies in the elegance of the diagnosis — he names something many people feel without being able to name.",
      },
      {
        speaker: "Linh",
        text: "Dito isso, a argumentação peca, a meu ver, por um excesso de generalização. Han fala de 'o sujeito contemporâneo' como se fosse uma categoria homogênea, quando as condições de trabalho variam enormemente entre classes, países e gerações.",
        vi: "Dù vậy, lập luận theo tôi mắc lỗi khái quát quá đà. Han nói về 'chủ thể đương đại' như thể đó là một phạm trù đồng nhất, trong khi điều kiện làm việc khác nhau rất lớn giữa các giai cấp, quốc gia và thế hệ.",
        en: "That said, the argument errs, in my view, through excessive generalization. Han speaks of 'the contemporary subject' as if it were a homogeneous category, when working conditions vary enormously across classes, countries, and generations.",
      },
      {
        speaker: "Prof. Souza",
        text: "Cuidado, porém: não estaria você atribuindo a Han uma pretensão de universalidade que talvez ele não tenha? Isso não seria um espantalho?",
        vi: "Nhưng cẩn thận: chẳng phải em đang gán cho Han một tham vọng phổ quát mà có lẽ ông không có sao? Như thế chẳng phải là ngụy biện người rơm?",
        en: "Careful, though: aren't you attributing to Han a claim to universality he may not make? Wouldn't that be a straw man?",
      },
      {
        speaker: "Linh",
        text: "Crítica justa, professor. De fato, eu deveria distinguir o que Han demonstra do que eu o leio sugerindo. Reformulando, então: minha objeção não é que ele afirme uma universalidade, mas que o texto não delimita seu alcance — e essa indeterminação abre margem para uma leitura excessivamente abrangente.",
        vi: "Phê bình xác đáng ạ. Đúng là tôi nên phân biệt điều Han chứng minh với điều tôi đọc thấy ông gợi ý. Vậy diễn đạt lại: phản biện của tôi không phải là ông khẳng định tính phổ quát, mà là văn bản không giới hạn phạm vi — và sự thiếu xác định đó mở đường cho một cách đọc quá rộng.",
        en: "A fair critique, professor. Indeed, I should distinguish what Han demonstrates from what I read him as suggesting. Reformulating, then: my objection is not that he asserts universality, but that the text does not delimit its scope — and that indeterminacy leaves room for an overly sweeping reading.",
      },
      {
        speaker: "Prof. Souza",
        text: "Agora sim: você reconstruiu, concedeu o mérito, localizou a fragilidade e ainda revisou a própria objeção sob pressão. É exatamente esse o exercício.",
        vi: "Giờ thì đúng rồi: em đã tái dựng, công nhận giá trị, định vị điểm yếu và còn chỉnh lại chính phản biện của mình dưới áp lực. Đó chính là bài tập cần làm.",
        en: "Now you've got it: you reconstructed, conceded the merit, located the weakness, and even revised your own objection under pressure. That is exactly the exercise.",
      },
    ],
    register_notes:
      "Phản biện = tái dựng thiện chí + công nhận điểm mạnh + nhượng bộ + sắc thái; không bao giờ « está errado » trống không.",
    register_notes_en:
      "Critical register = charitable reconstruction + acknowledged merit + concession + nuance. The 'embora / ainda que' concessive clause governs the subjunctive (embora seja, ainda que tenha). Name fallacies in Portuguese rather than describing them loosely. Stay interpersonally warm ('cordialidade') even while being intellectually firm; in Brazil a concession-free rebuttal reads as aggression. When corrected mid-argument, the high-register move is to revise visibly ('reformulando, então…') rather than to defend — this signals intellectual security, not weakness.",
    roleplay_prompts: [
      "Chọn một bài báo quan điểm; phân tích theo 4 bước (reconstruir / mérito / objeção com concessão / matizar) trong 2 phút.",
      "Người đối thoại buộc tội bạn dựng « espantalho »; phản hồi bằng cách phân biệt « o que o autor demonstra » khỏi « o que eu o leio sugerindo ».",
    ],
    roleplay_prompts_en: [
      "Pick an op-ed; analyze it in the four steps (reconstruct / merit / objection-with-concession / qualify) in 2 minutes.",
      "Your interlocutor accuses you of a straw man; respond by distinguishing 'what the author demonstrates' from 'what I read him as suggesting'.",
    ],
  },

  // ── 3. Professional presentation ──────────────────────────────────────
  {
    id: "lapresentacao_profissional",
    level: "C1",
    category: "workplace",
    title_vi: "Thuyết trình chuyên nghiệp: trình bày kết quả, thuyết phục hội đồng",
    title_en: "Professional presentation: presenting results, persuading a board",
    sentences: [
      {
        en: "Before going into the figures, allow me to recall the three objectives we set ourselves at the start of the quarter.",
        vi: "Trước khi đi vào con số, cho phép tôi nhắc lại ba mục tiêu chúng ta đã đặt ra đầu quý.",
        pronunciation_focus: [
          "permitam → per-MI-tãw (-am cuối = 'ãw' mũi, ngôi 'vocês')",
          "objetivos → ob-je-TI-vus (j = 'zh'; -os cuối 'us')",
          "trimestre → tri-MÉS-tri (cụm 'str'; -tre cuối 'tri')",
          "início → i-NÍ-si-u (nhấn NÍ; -o cuối 'u')",
        ],
        pronunciation_focus_en: [
          "permitam → 'per-MEE-towng' (-am ending = nasal 'owng', 'vocês' form)",
          "objetivos → 'ob-zheh-TEE-voos' (j = 'zh'; final -os = 'oos')",
          "trimestre → 'tree-MES-tree' ('str' cluster; final -tre = 'tree')",
          "início → 'ee-NEE-see-oo' (stress NEE; final -o = 'oo')",
        ],
      },
      {
        en: "The figures speak for themselves: we exceeded the target by twelve percent, despite a noticeably tighter market.",
        vi: "Con số tự nói lên điều đó: chúng ta vượt chỉ tiêu mười hai phần trăm, dù thị trường thắt chặt rõ rệt.",
        pronunciation_focus: [
          "números → NÚ-me-rus (nhấn đầu; -os cuối 'us')",
          "superamos → su-pe-RA-mus (nhấn RA; -mos cuối 'mus')",
          "meta → MÉ-ta (mở è; t đơn gọn)",
          "apertado → a-per-TA-du (-do cuối 'du')",
        ],
        pronunciation_focus_en: [
          "números → 'NOO-meh-roos' (initial stress; final -os = 'oos')",
          "superamos → 'soo-peh-RAH-moos' (stress RAH; final -mos = 'moos')",
          "meta → 'MEH-tah' (open è; clean single t)",
          "apertado → 'ah-per-TAH-doo' (final -do = 'doo')",
        ],
      },
      {
        en: "I would like to draw your attention to one figure in particular, which I find especially telling.",
        vi: "Tôi muốn lưu ý quý vị một con số cụ thể, mà tôi thấy đặc biệt có ý nghĩa.",
        pronunciation_focus: [
          "gostaria → gos-ta-RI-a (g cứng; nhấn RI)",
          "atenção → a-ten-SÃW (-ção mũi cuối)",
          "específico → es-pe-SÍ-fi-ku (nhấn SÍ; -co 'ku')",
          "revelador → he-ve-la-DÔR (r đầu = 'h'; nhấn cuối)",
        ],
        pronunciation_focus_en: [
          "gostaria → 'gos-tah-REE-ah' (hard g; stress REE)",
          "atenção → 'ah-ten-SOWNG' (nasal -ção)",
          "específico → 'es-peh-SEE-fee-koo' (stress SEE; final -co = 'koo')",
          "revelador → 'heh-veh-lah-DOH' (initial r = 'h'; final-syllable stress, soft -r)",
        ],
      },
      {
        en: "I won't hide the fact that we also encountered difficulties, which I'll address head-on in a moment.",
        vi: "Tôi không giấu rằng chúng ta cũng gặp khó khăn, mà tôi sẽ nói thẳng vào ngay sau đây.",
        pronunciation_focus: [
          "esconder → es-con-DÊR (-der cuối nhấn, ê đóng)",
          "dificuldades → di-fi-cuw-DA-djis (-l thành 'w'; -des cuối 'djis')",
          "encararei → en-ca-ra-RÊY (tương lai ngôi 'eu'; -rei mũi nhẹ)",
          "diretamente → di-re-ta-MEN-tchi (-te cuối 'tchi')",
        ],
        pronunciation_focus_en: [
          "esconder → 'es-kon-DEH' (final stressed -der, closed ê)",
          "dificuldades → 'jee-fee-kool-DAH-jeesh' (the -l → 'w'; final -des = 'jeesh')",
          "encararei → 'en-kah-rah-HEY' (future 'eu' form; light nasal -ei)",
          "diretamente → 'jee-reh-tah-MEN-chee' (final -te = 'chee')",
        ],
      },
      {
        en: "In short, I am asking the board to approve the additional budget, in light of the return demonstrated here.",
        vi: "Tóm lại, tôi đề nghị hội đồng phê duyệt khoản ngân sách bổ sung, trước hiệu quả đã được chứng minh ở đây.",
        pronunciation_focus: [
          "resumindo → he-zu-MIN-du (r đầu = 'h'; s = 'z')",
          "conselho → con-SE-lhu (lh = 'ly'; -o cuối 'u')",
          "orçamento → or-sa-MEN-tu (ç = 's'; -to cuối 'tu')",
          "retorno → he-TÔR-nu (r đầu = 'h'; ô đóng)",
        ],
        pronunciation_focus_en: [
          "resumindo → 'heh-zoo-MEEN-doo' (initial r = 'h'; s = 'z')",
          "conselho → 'kon-SEH-lyoo' (lh = 'ly'; final -o = 'oo')",
          "orçamento → 'or-sah-MEN-too' (ç = 's'; final -to = 'too')",
          "retorno → 'heh-TOR-noo' (initial r = 'h'; closed ô)",
        ],
      },
    ],
    cultural_notes_vi:
      "Thuyết trình chuyên nghiệp ở Brazil cân bằng hai lực mà người Việt thường nghiêng hẳn về một phía: SỰ ẤM ÁP QUAN HỆ (calor humano) và SỰ CHẶT CHẼ DỮ LIỆU. Một buổi « apresentação para a diretoria » (trình bày trước ban giám đốc) ở Brazil:\n\n(1) MỞ ĐẦU CÓ KẾT NỐI CON NGƯỜI: chào tên, một câu thân thiện, rồi mới vào việc. Vào thẳng số liệu không lời mở (kiểu Đức/Việt-công sở) bị đọc là lạnh lùng. Nhưng đừng nhầm: ấm áp ≠ dài dòng.\n\n(2) CẤU TRÚC RÕ RÀNG, BÁO TRƯỚC: « Vou estruturar em três pontos: resultados, dificuldades, e o pedido. » Người Brazil đánh giá cao roteiro (lộ trình) báo trước — nó cho thấy bạn tôn trọng thời gian của họ.\n\n(3) TRUNG THỰC VỀ KHÓ KHĂN: « Não vou esconder que… » (Tôi không giấu rằng…) — nêu khó khăn TRƯỚC khi bị hỏi là dấu hiệu lãnh đạo trưởng thành. Giấu vấn đề rồi bị lộ ở Q&A là tự sát.\n\n(4) KẾT BẰNG LỜI ĐỀ NGHỊ RÕ: « O que peço ao conselho é… » Đừng kết thúc bằng « obrigado » lửng lơ — phải có một « pedido » (đề nghị) cụ thể, hành động được.\n\nLỗi người Việt: (a) quá khiêm tốn — « desculpem, talvez não esteja claro » lặp đi lặp lại, làm mất uy tín; (b) đọc slide. Ở Brazil slide là nền, người nói là chính. Giọng chuẩn là « confiança cordial »: tự tin, ấm, nhưng nắm chắc con số.",
    cultural_notes_en:
      "A professional presentation in Brazil balances two forces that learners often lean too far one way on: RELATIONAL WARMTH (calor humano) and DATA RIGOR. A typical 'apresentação para a diretoria' (presentation to the board):\n\n(1) OPENS WITH A HUMAN CONNECTION: greet by name, one friendly line, then get to work. Diving straight into figures with no warm-up (a more German or Vietnamese-corporate habit) reads as cold. But warmth ≠ rambling.\n\n(2) ANNOUNCES A CLEAR STRUCTURE: 'Vou estruturar em três pontos: resultados, dificuldades, e o pedido.' Brazilians value a signposted 'roteiro' (roadmap) — it shows you respect their time.\n\n(3) IS HONEST ABOUT DIFFICULTIES: 'Não vou esconder que…' (I won't hide that…) — raising problems BEFORE being asked signals mature leadership. Hiding an issue and getting caught in Q&A is fatal.\n\n(4) CLOSES WITH A CLEAR ASK: 'O que peço ao conselho é…' Don't end on a vague 'obrigado' — there must be a concrete, actionable 'pedido' (request).\n\nLearner traps: (a) over-modesty — repeated 'desculpem, talvez não esteja claro', which erodes credibility; (b) reading slides. In Brazil slides are the backdrop; the speaker is the main event. The target voice is 'confiança cordial': confident, warm, but in firm command of the numbers. Address the board formally with 'o senhor / a senhora' or by title; use 'vocês' for a familiar team and 'os senhores / as senhoras' for the most formal boardroom.",
    tip_advice_vi:
      "Bộ khung 5 phần cho một bài thuyết trình kết quả 5-7 phút:\n\n(1) ABERTURA (15 giây): chào + một câu kết nối + báo cấu trúc. « Bom dia a todos. Obrigada pelo tempo. Vou estruturar em três pontos: resultados, desafios e o pedido. »\n\n(2) RESULTADOS: dẫn bằng con số mạnh nhất TRƯỚC. « Os números falam por si: superamos a meta em 12%. » Mỗi slide một ý — đừng nhồi.\n\n(3) UM NÚMERO EM DESTAQUE: chọn MỘT con số kể chuyện. « Gostaria de chamar a atenção para um dado em especial… » Khán giả nhớ một con số, không nhớ mười.\n\n(4) DIFICULDADES (nhượng bộ chủ động): « Não vou esconder que enfrentamos X. Nossa resposta foi Y. » Vấn đề + giải pháp đi cặp.\n\n(5) PEDIDO (đề nghị rõ ràng): « Em resumo, peço ao conselho a aprovação de Z, à luz do retorno demonstrado. »\n\nCÔNG CỤ NGÔN NGỮ:\n- Báo chuyển: « Passo agora ao segundo ponto. »\n- Nhấn mạnh: « O ponto crucial é o seguinte: … »\n- Mời hỏi: « Fico à disposição para perguntas. »\n\nTRÁNH:\n- « Acho que talvez… » (giảm uy tín) → « Os dados mostram que… »\n- Đọc slide từng chữ → nhìn người, slide là nền\n- Kết bằng « é isso » / « obrigado » lửng → luôn có pedido\n- Vượt giờ → tập đến khi vừa khít",
    tip_advice_en:
      "A five-part frame for a 5–7 minute results presentation:\n\n(1) OPENING (15 sec): greeting + one connecting line + announce the structure. 'Bom dia a todos. Obrigada pelo tempo. Vou estruturar em três pontos: resultados, desafios e o pedido.'\n\n(2) RESULTS: lead with your strongest number FIRST. 'Os números falam por si: superamos a meta em 12%.' One idea per slide — don't cram.\n\n(3) ONE HEADLINE NUMBER: pick ONE figure that tells a story. 'Gostaria de chamar a atenção para um dado em especial…' The audience remembers one number, not ten.\n\n(4) DIFFICULTIES (proactive concession): 'Não vou esconder que enfrentamos X. Nossa resposta foi Y.' Always pair problem + response.\n\n(5) THE ASK (clear request): 'Em resumo, peço ao conselho a aprovação de Z, à luz do retorno demonstrado.'\n\nLANGUAGE TOOLS:\n- Transition: 'Passo agora ao segundo ponto.'\n- Emphasis: 'O ponto crucial é o seguinte: …'\n- Invite questions: 'Fico à disposição para perguntas.'\n\nAVOID:\n- 'Acho que talvez…' (undercuts credibility) → 'Os dados mostram que…'\n- Reading slides verbatim → look at people; slides are backdrop\n- Closing on a vague 'é isso' / 'obrigado' → always end on a 'pedido'\n- Going over time → rehearse until it fits",
    vocabulary: [
      {
        word: "a apresentação para a diretoria",
        en: "the presentation to the board",
        vi: "buổi trình bày trước ban giám đốc",
        pos: "n.f.",
        pronunciation_vi: "a a-pre-zen-ta-SÃW pa-ra a di-re-to-RI-a",
        pronunciation_en: "ah ah-preh-zen-tah-SOWNG pah-rah ah jee-reh-toh-REE-ah — s = 'z' in apresentação; nasal -ção",
      },
      {
        word: "superar a meta",
        en: "to exceed the target",
        vi: "vượt chỉ tiêu",
        pos: "v.",
        pronunciation_vi: "su-pe-RÁR a MÉ-ta",
        pronunciation_en: "soo-peh-RAH ah MEH-tah — open è in meta; final -r soft",
      },
      {
        word: "chamar a atenção para",
        en: "to draw attention to",
        vi: "lưu ý đến / hướng sự chú ý vào",
        pos: "v.",
        pronunciation_vi: "sha-MÁR a a-ten-SÃW pa-ra",
        pronunciation_en: "shah-MAH ah ah-ten-SOWNG pah-rah — ch = 'sh'; nasal -ção",
      },
      {
        word: "um dado revelador",
        en: "a telling figure / data point",
        vi: "một con số có ý nghĩa",
        pos: "n.m.",
        pronunciation_vi: "ũ DA-du he-ve-la-DÔR",
        pronunciation_en: "oong DAH-doo heh-veh-lah-DOH — initial r = 'h'; closed ô at end",
      },
      {
        word: "não vou esconder que",
        en: "I won't hide that",
        vi: "tôi không giấu rằng",
        pos: "loc.",
        pronunciation_vi: "nãw vô es-con-DÊR ki",
        pronunciation_en: "nowng voh es-kon-DEH kee — não = 'nowng'; 'que' = 'kee'",
      },
      {
        word: "encarar de frente",
        en: "to address head-on",
        vi: "đối diện thẳng",
        pos: "v.",
        pronunciation_vi: "en-ca-RÁR dji FREN-tchi",
        pronunciation_en: "en-kah-HAH jee FREN-chee — final -te = 'chee'; 'de' = 'jee'",
      },
      {
        word: "o retorno (sobre o investimento)",
        en: "the return (on investment)",
        vi: "hiệu quả / lợi tức (trên vốn đầu tư)",
        pos: "n.m.",
        pronunciation_vi: "u he-TÔR-nu",
        pronunciation_en: "oo heh-TOR-noo — initial r = 'h'; closed ô",
      },
      {
        word: "à luz de",
        en: "in light of",
        vi: "trước / dưới ánh sáng của",
        pos: "prep.",
        pronunciation_vi: "a LUS dji",
        pronunciation_en: "ah LOOS jee — crasis à = 'ah'; 'de' = 'jee'",
      },
      {
        word: "fico à disposição",
        en: "I remain at your disposal",
        vi: "tôi sẵn sàng (trả lời/hỗ trợ)",
        pos: "loc.",
        pronunciation_vi: "FI-ku a dis-po-zi-SÃW",
        pronunciation_en: "FEE-koo ah dees-poh-zee-SOWNG — s = 'z' in disposição; nasal -ção",
      },
      {
        word: "o pedido",
        en: "the request / the ask",
        vi: "lời đề nghị / yêu cầu",
        pos: "n.m.",
        pronunciation_vi: "u pe-DI-du",
        pronunciation_en: "oo peh-JEE-doo — 'di' palatalizes to 'jee'; final -o = 'doo'",
      },
    ],
    dialogue: [
      {
        speaker: "Diretora financeira",
        text: "Linh, o conselho tem vinte minutos. Pode começar quando quiser.",
        vi: "Linh, hội đồng có 20 phút. Em có thể bắt đầu khi nào sẵn sàng.",
        en: "Linh, the board has twenty minutes. You can begin whenever you're ready.",
      },
      {
        speaker: "Linh",
        text: "Obrigada pelo tempo. Vou estruturar em três pontos: os resultados do trimestre, os desafios que enfrentamos e o pedido que trago ao conselho.",
        vi: "Cảm ơn quý vị đã dành thời gian. Tôi sẽ chia làm ba phần: kết quả của quý, những thách thức chúng tôi gặp, và lời đề nghị tôi mang đến hội đồng.",
        en: "Thank you for your time. I'll structure this in three points: the quarter's results, the challenges we faced, and the request I bring to the board.",
      },
      {
        speaker: "Linh",
        text: "Começo pelos números, que falam por si: superamos a meta em 12%, apesar de um mercado visivelmente mais apertado.",
        vi: "Tôi bắt đầu bằng con số, vốn tự nói lên điều đó: chúng tôi vượt chỉ tiêu 12%, dù thị trường thắt chặt rõ rệt.",
        en: "I'll start with the figures, which speak for themselves: we exceeded the target by 12%, despite a noticeably tighter market.",
      },
      {
        speaker: "Diretora financeira",
        text: "Excelente. E os desafios que mencionou?",
        vi: "Tuyệt vời. Còn những thách thức em vừa nhắc?",
        en: "Excellent. And the challenges you mentioned?",
      },
      {
        speaker: "Linh",
        text: "Não vou esconder que a rotatividade da equipe nos custou caro. Encaramos isso de frente com um novo plano de retenção, cujos primeiros efeitos já aparecem nos dados de maio.",
        vi: "Tôi không giấu rằng tỉ lệ nghỉ việc của đội đã khiến chúng tôi tốn kém. Chúng tôi đã đối diện thẳng bằng một kế hoạch giữ chân mới, mà tác động đầu tiên đã xuất hiện trong dữ liệu tháng Năm.",
        en: "I won't hide that team turnover cost us dearly. We addressed it head-on with a new retention plan, whose first effects already show in the May data.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Presidente do conselho",
        text: "Linh, antes de pedirmos orçamento adicional, o conselho precisa entender por que o resultado deste trimestre justificaria mais investimento. A palavra é sua.",
        vi: "Linh, trước khi xin ngân sách bổ sung, hội đồng cần hiểu vì sao kết quả quý này lại biện minh cho việc đầu tư thêm. Mời em.",
        en: "Linh, before we discuss additional budget, the board needs to understand why this quarter's result would justify more investment. The floor is yours.",
      },
      {
        speaker: "Linh",
        text: "Compreendo perfeitamente a pergunta, e é a ela que pretendo responder. Resumo a lógica em uma frase: cada real investido em retenção devolveu três em produtividade — e é esse retorno que fundamenta o meu pedido.",
        vi: "Tôi hiểu rõ câu hỏi, và đó chính là điều tôi muốn trả lời. Tôi tóm logic trong một câu: mỗi đồng đầu tư vào giữ chân nhân sự trả lại ba đồng năng suất — và chính hiệu quả đó làm nền cho đề nghị của tôi.",
        en: "I understand the question perfectly, and it's exactly what I intend to answer. I'll sum up the logic in one sentence: every real invested in retention returned three in productivity — and it's that return that grounds my request.",
      },
      {
        speaker: "Conselheiro (cético)",
        text: "Três por um parece otimista. Como a senhora chegou a esse número, e o que aconteceria se ele estivesse superestimado?",
        vi: "Ba đổi một nghe có vẻ lạc quan. Cô tính ra con số đó thế nào, và sẽ ra sao nếu nó bị thổi phồng?",
        en: "Three to one sounds optimistic. How did you arrive at that figure, and what would happen if it were overestimated?",
      },
      {
        speaker: "Linh",
        text: "Pergunta legítima. O número vem da comparação entre o custo de substituição de um funcionário e o ganho de produtividade medido nas equipes estáveis. Para não inflar o argumento, usei a estimativa mais conservadora da literatura de RH. Mesmo que o retorno real fosse a metade — um para 1,5 —, o investimento ainda se pagaria em menos de um ano.",
        vi: "Câu hỏi chính đáng. Con số đến từ so sánh giữa chi phí thay thế một nhân viên và mức tăng năng suất đo được ở các đội ổn định. Để không thổi phồng lập luận, tôi dùng ước lượng dè dặt nhất trong tài liệu nhân sự. Ngay cả khi hiệu quả thực chỉ bằng một nửa — một đổi 1,5 — khoản đầu tư vẫn hoàn vốn trong chưa đầy một năm.",
        en: "A legitimate question. The figure comes from comparing the cost of replacing an employee with the productivity gain measured in stable teams. To avoid inflating the argument, I used the most conservative estimate in the HR literature. Even if the real return were half — one to 1.5 — the investment would still pay for itself in under a year.",
      },
      {
        speaker: "Presidente do conselho",
        text: "Gosto de quem já traz o cenário pessimista calculado. Qual é, então, o pedido concreto?",
        vi: "Tôi thích người đã tính sẵn kịch bản bi quan. Vậy đề nghị cụ thể là gì?",
        en: "I like someone who comes with the pessimistic scenario already calculated. So what, exactly, is the request?",
      },
      {
        speaker: "Linh",
        text: "Em resumo: peço a aprovação de um orçamento adicional de 400 mil reais para estender o plano de retenção a toda a operação, à luz do retorno aqui demonstrado. Fico à disposição para detalhar qualquer ponto.",
        vi: "Tóm lại: tôi đề nghị phê duyệt ngân sách bổ sung 400 nghìn real để mở rộng kế hoạch giữ chân ra toàn bộ hoạt động, trước hiệu quả đã chứng minh ở đây. Tôi sẵn sàng làm rõ bất kỳ điểm nào.",
        en: "In short: I request approval of an additional budget of 400,000 reais to extend the retention plan across the entire operation, in light of the return demonstrated here. I remain at your disposal to detail any point.",
      },
    ],
    register_notes:
      "Giọng chuẩn = « confiança cordial »: ấm khi mở, chặt khi vào số, kết bằng pedido rõ ràng; tránh « acho que talvez ».",
    register_notes_en:
      "Target voice = 'confiança cordial': warm at the open, firm on the numbers, closing on a clear 'pedido'. Replace hedges like 'acho que talvez' with assertive 'os dados mostram que' when you actually have the data — hedging is for genuine uncertainty, not for politeness. Note that bringing the pessimistic/conservative scenario already calculated ('mesmo que o retorno fosse a metade…') is a strong credibility move with a skeptical board. Address the board with 'o senhor / a senhora / os senhores'; switch to 'você(s)' only with a familiar team. Currency: 'real' (sing.) / 'reais' (pl.), symbol R$.",
    roleplay_prompts: [
      "Trình bày kết quả quý trong 4 phút theo khung 5 phần (abertura / resultados / dado em destaque / dificuldades / pedido).",
      "Một thành viên hội đồng hoài nghi con số ROI của bạn; trả lời bằng kịch bản bảo thủ « mesmo que o retorno fosse a metade… ».",
    ],
    roleplay_prompts_en: [
      "Present quarterly results in 4 minutes using the five-part frame (opening / results / headline figure / difficulties / the ask).",
      "A skeptical board member doubts your ROI number; respond with the conservative scenario 'mesmo que o retorno fosse a metade…'.",
    ],
  },

  // ── 4. Nuanced opinion / argumentation ────────────────────────────────
  {
    id: "lopiniao_com_nuances",
    level: "C1",
    category: "fluency",
    title_vi: "Bày tỏ quan điểm có sắc thái: nhượng bộ, dè dặt, bất đồng lịch sự",
    title_en: "Expressing nuanced opinion: concession, hedging, polite disagreement",
    sentences: [
      {
        en: "I tend to share that view, with one important reservation that I'll explain.",
        vi: "Tôi nghiêng về việc đồng tình với quan điểm đó, với một điều dè dặt quan trọng tôi sẽ giải thích.",
        pronunciation_focus: [
          "tendo a → TEN-du a (-do cuối 'du'; nối liền với 'a')",
          "compartilhar → com-par-ti-LHÁR (lh = 'ly'; nhấn cuối)",
          "ressalva → he-SÁW-va (rr = 'h'; -al thành 'aw')",
          "explicarei → es-pli-ca-RÊY (tương lai 'eu'; -rei mũi nhẹ)",
        ],
        pronunciation_focus_en: [
          "tendo a → 'TEN-doo ah' (final -do = 'doo'; links to 'a')",
          "compartilhar → 'kom-par-tee-LYAH' (lh = 'ly'; final stress)",
          "ressalva → 'heh-SAHW-vah' (rr = 'h'; -al = 'aw')",
          "explicarei → 'es-plee-kah-HEY' (future 'eu'; light nasal -ei)",
        ],
      },
      {
        en: "It's not that I disagree outright; rather, I would put it somewhat differently.",
        vi: "Không phải tôi phản đối hoàn toàn; đúng hơn là tôi sẽ diễn đạt theo cách hơi khác.",
        pronunciation_focus: [
          "discordo → dis-CÓR-du (mở CÓ; -do cuối 'du')",
          "inteiramente → in-tei-ra-MEN-tchi (-te cuối 'tchi')",
          "antes → ÃN-tchis (mũi; -tes cuối 'tchis')",
          "colocaria → co-lo-ca-RI-a (nhấn RI)",
        ],
        pronunciation_focus_en: [
          "discordo → 'dees-KOR-doo' (open KO; final -do = 'doo')",
          "inteiramente → 'een-tay-rah-MEN-chee' (final -te = 'chee')",
          "antes → 'AHN-cheesh' (nasal; final -tes = 'cheesh')",
          "colocaria → 'koh-loh-kah-REE-ah' (stress REE)",
        ],
      },
      {
        en: "There is some truth in that, but the matter strikes me as more complex than it first appears.",
        vi: "Có phần đúng trong điều đó, nhưng vấn đề với tôi có vẻ phức tạp hơn so với vẻ ngoài ban đầu.",
        pronunciation_focus: [
          "verdade → ver-DA-dji (-de cuối 'dji')",
          "questão → kes-TÃW (-ão mũi cuối)",
          "complexa → com-PLÉK-sa (x = 'ks'; mở PLÉ)",
          "parece → pa-RÉ-si (mở è; -ce cuối 'si')",
        ],
        pronunciation_focus_en: [
          "verdade → 'ver-DAH-jee' (final -de = 'jee')",
          "questão → 'kes-TOWNG' (nasal -ão)",
          "complexa → 'kom-PLEK-sah' (x = 'ks'; open PLE)",
          "parece → 'pah-REH-see' (open è; final -ce = 'see')",
        ],
      },
      {
        en: "With all due respect, I'm not sure the comparison entirely holds.",
        vi: "Với tất cả sự tôn trọng, tôi không chắc phép so sánh hoàn toàn đứng vững.",
        pronunciation_focus: [
          "respeito → hes-PEI-tu (r đầu = 'h'; -to cuối 'tu')",
          "certeza → ser-TÊ-za (c = 's'; s = 'z'; ê đóng)",
          "comparação → com-pa-ra-SÃW (-ção mũi)",
          "procede → pro-SÉ-dji (mở SÉ; -de cuối 'dji')",
        ],
        pronunciation_focus_en: [
          "respeito → 'hes-PAY-too' (initial r = 'h'; final -to = 'too')",
          "certeza → 'ser-TEH-zah' (c = 's'; s = 'z'; closed ê)",
          "comparação → 'kom-pah-rah-SOWNG' (nasal -ção)",
          "procede → 'proh-SEH-jee' (open SE; final -de = 'jee')",
        ],
      },
      {
        en: "Ultimately, perhaps we are less far apart than this exchange might suggest.",
        vi: "Suy cho cùng, có lẽ chúng ta không xa nhau đến mức cuộc trao đổi này gợi ra.",
        pronunciation_focus: [
          "afinal → a-fi-NÁW (-al thành 'aw')",
          "talvez → taw-VÊS (-al thành 'aw'; -ez cuối 'ês')",
          "distantes → dis-TÃN-tchis (-tes cuối 'tchis')",
          "sugere → su-JÉ-ri (g = 'zh'; mở JÉ)",
        ],
        pronunciation_focus_en: [
          "afinal → 'ah-fee-NAHW' (-al = 'aw')",
          "talvez → 'taw-VEHS' (-al = 'aw'; final -ez = 'ehs')",
          "distantes → 'dees-TAHN-cheesh' (final -tes = 'cheesh')",
          "sugere → 'soo-ZHEH-ree' (g = 'zh'; open JE)",
        ],
      },
    ],
    cultural_notes_vi:
      "Bất đồng ở Brazil được điều phối bởi « cordialidade » — văn hóa coi sự hòa hợp quan hệ là một giá trị thật, không phải xã giao. Điều này KHÔNG có nghĩa là người Brazil tránh tranh luận (họ tranh luận sôi nổi về bóng đá, chính trị, mọi thứ), mà là họ bọc bất đồng trong các lớp đệm ngôn ngữ để giữ quan hệ nguyên vẹn.\n\nKhác biệt then chốt với người Việt: tiếng Việt thường bày tỏ bất đồng bằng im lặng hoặc câu mơ hồ (« để em suy nghĩ thêm »), khiến người Brazil bối rối vì họ không đọc được lập trường thật. Ở C1, kỹ năng là bất đồng RÕ về nội dung nhưng MỀM về quan hệ — chứ không phải né bất đồng.\n\nBốn lớp đệm chuẩn:\n\n(1) ĐỒNG TÌNH MỘT PHẦN TRƯỚC: « Há algo de verdade nisso… » (Có phần đúng trong đó…) trước khi rẽ sang « mas ».\n\n(2) HẠ NHIỆT BẰNG « não que…, mas… »: « Não que eu discorde, mas colocaria de outra forma. » — phủ nhận đối đầu trực diện.\n\n(3) DÈ DẶT BẰNG THỂ ĐIỀU KIỆN: « eu diria que », « talvez fosse o caso de », « não tenho certeza de que ». Thể điều kiện (diria, seria, colocaria) là vũ khí lịch sự số một.\n\n(4) MỞ ĐƯỜNG RÚT CHO ĐỐI PHƯƠNG: « Afinal, talvez não estejamos tão distantes. » — kết bằng hội tụ, không bằng thắng-thua.\n\nLỗi cần tránh: « não, você está errado » (đối đầu trực diện — rất thô ở Brazil); « tanto faz » / « como quiser » (rút lui giả — bị đọc là giận dỗi hoặc thờ ơ).",
    cultural_notes_en:
      "Disagreement in Brazil is governed by 'cordialidade' — a culture that treats relational harmony as a genuine value, not mere politeness. This does NOT mean Brazilians avoid debate (they argue passionately about football, politics, everything); it means they wrap disagreement in linguistic cushioning to keep the relationship intact.\n\nKey contrast with Vietnamese: Vietnamese often signals disagreement through silence or vague phrasing ('let me think about it more'), which confuses Brazilians because they can't read your real position. The C1 skill is to disagree CLEARLY on substance while staying SOFT on the relationship — not to avoid disagreement.\n\nFour standard cushioning layers:\n\n(1) PARTIAL AGREEMENT FIRST: 'Há algo de verdade nisso…' (There's some truth in that…) before pivoting on 'mas'.\n\n(2) DEFUSE WITH 'não que…, mas…': 'Não que eu discorde, mas colocaria de outra forma.' — denies head-on confrontation.\n\n(3) HEDGE WITH THE CONDITIONAL: 'eu diria que', 'talvez fosse o caso de', 'não tenho certeza de que'. The conditional (diria, seria, colocaria) is the number-one politeness device.\n\n(4) OFFER YOUR INTERLOCUTOR AN EXIT: 'Afinal, talvez não estejamos tão distantes.' — close on convergence, not on win/lose.\n\nErrors to avoid: 'não, você está errado' (head-on confrontation — very blunt in Brazil); 'tanto faz' / 'como quiser' (false withdrawal — read as sulking or indifference). Note: warmth in Brazilian disagreement is real, not a mask; the goal is to win the point while leaving the other person's dignity fully intact.",
    tip_advice_vi:
      "Thang đo cường độ bất đồng — chọn nấc phù hợp ngữ cảnh:\n\nĐỒNG TÌNH CÓ DÈ DẶT:\n- « Concordo em grande parte, com uma ressalva. » (Đồng tình phần lớn, với một điều dè dặt.)\n- « Tendo a concordar, embora… » (Tôi nghiêng về đồng tình, dù…)\n\nBẤT ĐỒNG NHẸ (mặc định lịch sự):\n- « Há algo de verdade nisso, mas… »\n- « Vejo de outra forma. » (Tôi nhìn theo cách khác.)\n- « Eu colocaria a questão de modo diferente. »\n\nBẤT ĐỒNG VỪA:\n- « Não tenho tanta certeza. A comparação me parece frágil. »\n- « Com todo o respeito, não sei se isso procede. »\n\nBẤT ĐỒNG MẠNH (vẫn lịch sự):\n- « Aí eu já discordo. » (Đến đây thì tôi không đồng ý.) — đánh dấu ranh giới rõ.\n- « Permita-me discordar firmemente, e explico por quê. »\n\nCÔNG CỤ HỘI TỤ (đóng đẹp):\n- « No fundo, talvez não estejamos tão distantes. »\n- « Acho que concordamos no essencial e divergimos no detalhe. »\n\nMẸO PHÁT ÂM CHO NGƯỜI VIỆT: thể điều kiện (-ria) là chìa khóa lịch sự. « diria » (di-RI-a), « seria » (se-RI-a), « colocaria » (co-lo-ca-RI-a) — nhấn vào -RI-. Dùng nó thay cho thì hiện tại làm câu mềm ngay.\n\nTRÁNH: « não » trống không mở đầu câu; « você está errado »; im lặng hoặc « để tôi nghĩ thêm » khi thực ra đã có lập trường — người Brazil cần đọc được bạn nghĩ gì.",
    tip_advice_en:
      "A disagreement-intensity ladder — pick the rung that fits the context:\n\nAGREEMENT WITH A RESERVATION:\n- 'Concordo em grande parte, com uma ressalva.' (I largely agree, with one reservation.)\n- 'Tendo a concordar, embora…' (I tend to agree, although…)\n\nMILD DISAGREEMENT (the polite default):\n- 'Há algo de verdade nisso, mas…'\n- 'Vejo de outra forma.' (I see it differently.)\n- 'Eu colocaria a questão de modo diferente.'\n\nMODERATE DISAGREEMENT:\n- 'Não tenho tanta certeza. A comparação me parece frágil.'\n- 'Com todo o respeito, não sei se isso procede.'\n\nSTRONG DISAGREEMENT (still polite):\n- 'Aí eu já discordo.' (There I do disagree.) — marks a clear boundary.\n- 'Permita-me discordar firmemente, e explico por quê.'\n\nCONVERGENCE TOOLS (graceful close):\n- 'No fundo, talvez não estejamos tão distantes.'\n- 'Acho que concordamos no essencial e divergimos no detalhe.'\n\nPRONUNCIATION TIP: the conditional (-ria) is the politeness key. 'diria' (jee-REE-ah), 'seria' (seh-REE-ah), 'colocaria' (koh-loh-kah-REE-ah) — stress the -REE-. Using it instead of the present tense instantly softens a sentence.\n\nAVOID: a bare 'não' to open a reply; 'você está errado'; silence or 'let me think about it' when you actually do have a position — Brazilians need to be able to read what you think.",
    vocabulary: [
      {
        word: "com uma ressalva",
        en: "with one reservation",
        vi: "với một điều dè dặt",
        pos: "loc.",
        pronunciation_vi: "cõ u-ma he-SÁW-va",
        pronunciation_en: "kong oo-mah heh-SAHW-vah — rr = 'h'; -al = 'aw' glide",
      },
      {
        word: "tender a concordar",
        en: "to tend to agree",
        vi: "nghiêng về đồng tình",
        pos: "v.",
        pronunciation_vi: "ten-DÊR a con-cor-DÁR",
        pronunciation_en: "ten-DEH ah kon-kor-DAH — closed ê; final -r soft",
      },
      {
        word: "há algo de verdade nisso",
        en: "there's some truth in that",
        vi: "có phần đúng trong đó",
        pos: "loc.",
        pronunciation_vi: "á AW-gu dji ver-DA-dji NI-su",
        pronunciation_en: "ah AHW-goo jee ver-DAH-jee NEE-soo — algo -l = 'w'; final -de = 'jee'",
      },
      {
        word: "ver de outra forma",
        en: "to see it differently",
        vi: "nhìn theo cách khác",
        pos: "v.",
        pronunciation_vi: "ver dji Ô-tra FÓR-ma",
        pronunciation_en: "ver jee OH-trah FOR-mah — 'de' = 'jee'; outra has closed ô",
      },
      {
        word: "colocar a questão de outro modo",
        en: "to put the matter differently",
        vi: "đặt vấn đề theo cách khác",
        pos: "v.",
        pronunciation_vi: "co-lo-CÁR a kes-TÃW dji Ô-tru MÓ-du",
        pronunciation_en: "koh-loh-KAH ah kes-TOWNG jee OH-troo MO-doo — nasal -ão; open MO in modo",
      },
      {
        word: "com todo o respeito",
        en: "with all due respect",
        vi: "với tất cả sự tôn trọng",
        pos: "loc.",
        pronunciation_vi: "cõ TÔ-du u hes-PEI-tu",
        pronunciation_en: "kong TOH-doo oo hes-PAY-too — respeito r = 'h'; final -to = 'too'",
      },
      {
        word: "não sei se isso procede",
        en: "I'm not sure that holds",
        vi: "tôi không chắc điều đó đứng vững",
        pos: "loc.",
        pronunciation_vi: "nãw sei si I-su pro-SÉ-dji",
        pronunciation_en: "nowng say see EE-soo proh-SEH-jee — não = 'nowng'; final -de = 'jee'",
      },
      {
        word: "aí eu já discordo",
        en: "there I do disagree",
        vi: "đến đây thì tôi không đồng ý",
        pos: "loc.",
        pronunciation_vi: "a-Í eu ja dis-CÓR-du",
        pronunciation_en: "ah-EE eh-oo zhah dees-KOR-doo — já = 'zhah'; open KO",
      },
      {
        word: "no fundo",
        en: "at bottom / when it comes down to it",
        vi: "suy cho cùng",
        pos: "loc.",
        pronunciation_vi: "nu FUN-du",
        pronunciation_en: "noo FOON-doo — nasal 'un'; final -o = 'doo'",
      },
      {
        word: "divergir no detalhe",
        en: "to differ on the detail",
        vi: "khác nhau ở chi tiết",
        pos: "v.",
        pronunciation_vi: "di-ver-JÍR nu de-TA-lhi",
        pronunciation_en: "jee-ver-ZHEER noo deh-TAH-lyee — g = 'zh'; lh = 'ly'; final -lhe = 'lyee'",
      },
    ],
    dialogue: [
      {
        speaker: "Colega (Rafael)",
        text: "Para mim, trabalho remoto é sempre mais produtivo. Ponto final.",
        vi: "Với mình, làm việc từ xa luôn năng suất hơn. Chấm hết.",
        en: "For me, remote work is always more productive. Full stop.",
      },
      {
        speaker: "Linh",
        text: "Há algo de verdade nisso — para tarefas que exigem concentração, concordo plenamente. Dito isso, eu colocaria a questão de modo um pouco diferente: a produtividade depende menos do local e mais do tipo de tarefa.",
        vi: "Có phần đúng trong đó — với các việc cần tập trung, mình hoàn toàn đồng ý. Dù vậy, mình sẽ đặt vấn đề hơi khác: năng suất phụ thuộc vào loại công việc nhiều hơn là nơi làm.",
        en: "There's some truth in that — for tasks requiring concentration, I fully agree. That said, I'd put it a bit differently: productivity depends less on location and more on the type of task.",
      },
      {
        speaker: "Rafael",
        text: "Mas reuniões por vídeo funcionam tão bem quanto presenciais, não acha?",
        vi: "Nhưng họp qua video cũng hiệu quả như họp trực tiếp mà, bạn không thấy vậy à?",
        en: "But video meetings work just as well as in-person ones, don't you think?",
      },
      {
        speaker: "Linh",
        text: "Aí eu já teria minhas dúvidas, com todo o respeito. Para alinhamento rápido, sim; para resolver um conflito delicado, não tenho tanta certeza. No fundo, talvez não estejamos tão distantes: concordamos que o remoto ajuda, divergimos só sobre os limites.",
        vi: "Đến đây thì mình có chút nghi ngờ, với tất cả sự tôn trọng. Để căn chỉnh nhanh thì được; để giải quyết một xung đột tế nhị thì mình không chắc lắm. Suy cho cùng, có lẽ ta không xa nhau lắm: ta đồng ý làm từ xa có ích, chỉ khác nhau về giới hạn.",
        en: "There I'd have my doubts, with all due respect. For quick alignment, yes; for resolving a delicate conflict, I'm not so sure. At bottom, maybe we're not so far apart: we agree remote helps, we only differ on the limits.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Moderadora (debate)",
        text: "Tema de hoje: cotas raciais nas universidades. Linh, você foi apresentada a um argumento contrário às cotas. Qual a sua posição — e por quê?",
        vi: "Chủ đề hôm nay: hạn ngạch chủng tộc ở đại học. Linh, bạn vừa nghe một lập luận phản đối hạn ngạch. Lập trường của bạn — và vì sao?",
        en: "Today's topic: racial quotas in universities. Linh, you've just heard an argument against quotas. What's your position — and why?",
      },
      {
        speaker: "Linh",
        text: "Antes de responder, deixe-me reconhecer o que há de legítimo no argumento contrário: a preocupação com o mérito individual é genuína, e seria desonesto tratá-la como mero preconceito. Há algo de verdade aí.",
        vi: "Trước khi trả lời, cho phép tôi công nhận điều chính đáng trong lập luận phản đối: mối lo về năng lực cá nhân là thật, và sẽ thiếu trung thực nếu coi nó chỉ là định kiến. Có phần đúng ở đó.",
        en: "Before answering, let me acknowledge what's legitimate in the opposing argument: the concern for individual merit is genuine, and it would be dishonest to treat it as mere prejudice. There's some truth there.",
      },
      {
        speaker: "Linh",
        text: "Dito isso, é justamente aqui que eu colocaria a questão de outro modo. O argumento do mérito pressupõe um ponto de partida igual para todos — e é essa premissa que os dados não sustentam. Não que o mérito não importe; é que ele não opera no vácuo.",
        vi: "Dù vậy, chính ở đây tôi sẽ đặt vấn đề theo cách khác. Lập luận về năng lực giả định một điểm xuất phát ngang nhau cho mọi người — và chính tiền đề đó dữ liệu không ủng hộ. Không phải năng lực không quan trọng; mà là nó không vận hành trong chân không.",
        en: "That said, this is exactly where I'd frame it differently. The merit argument presupposes an equal starting point for everyone — and that's the premise the data don't support. It's not that merit doesn't matter; it's that it doesn't operate in a vacuum.",
      },
      {
        speaker: "Debatedor (contra)",
        text: "Com todo o respeito, isso soa como justificar tratar pessoas de forma desigual. Onde fica o princípio de igualdade?",
        vi: "Với tất cả sự tôn trọng, điều đó nghe như biện minh cho việc đối xử bất bình đẳng với con người. Vậy nguyên tắc bình đẳng nằm ở đâu?",
        en: "With all due respect, that sounds like justifying treating people unequally. Where does the principle of equality stand?",
      },
      {
        speaker: "Linh",
        text: "Pergunta crucial, e respeito a força dela. Eu responderia distinguindo dois sentidos de igualdade: igualdade de tratamento e igualdade de oportunidade. Tratar de forma idêntica quem parte de pontos desiguais pode, paradoxalmente, perpetuar a desigualdade. Posso estar enganada, mas é essa distinção que sustenta a minha posição.",
        vi: "Câu hỏi cốt yếu, và tôi tôn trọng sức nặng của nó. Tôi sẽ trả lời bằng cách phân biệt hai nghĩa của bình đẳng: bình đẳng về đối xử và bình đẳng về cơ hội. Đối xử y hệt với những người xuất phát từ điểm không ngang nhau có thể, một cách nghịch lý, duy trì bất bình đẳng. Tôi có thể sai, nhưng chính sự phân biệt đó làm nền cho lập trường của tôi.",
        en: "A crucial question, and I respect its force. I'd answer by distinguishing two senses of equality: equality of treatment and equality of opportunity. Treating identically those who start from unequal points can, paradoxically, perpetuate inequality. I may be wrong, but it's that distinction that grounds my position.",
      },
      {
        speaker: "Moderadora",
        text: "Reconheceu o mérito do outro lado, marcou a discordância com clareza e ainda admitiu falibilidade. É assim que se discorda sem brigar. Encerramos por aqui.",
        vi: "Bạn đã công nhận giá trị của phía kia, đánh dấu bất đồng rõ ràng và còn thừa nhận khả năng sai. Đó là cách bất đồng mà không gây gổ. Ta dừng ở đây.",
        en: "You acknowledged the other side's merit, marked the disagreement clearly, and even admitted fallibility. That's how to disagree without quarreling. Let's wrap up here.",
      },
    ],
    register_notes:
      "Bất đồng chuẩn Brazil = đồng tình một phần + thể điều kiện (-ria) + « não que…, mas… » + hội tụ ở cuối; tránh « não » trống và im lặng giả.",
    register_notes_en:
      "Standard Brazilian disagreement = partial agreement + conditional mood (-ria) + 'não que…, mas…' + convergence at the close. The conditional ('eu diria', 'eu colocaria', 'eu teria dúvidas') is the master politeness device — it frames your view as one possible reading rather than a verdict. Admitting fallibility ('posso estar enganada, mas…') strengthens rather than weakens a C1 position. Avoid a bare opening 'não', 'você está errado', and the false-withdrawal silence that Vietnamese politeness might default to — Brazilians read an unspoken position as evasive, not deferential. Warmth and firmness coexist; that combination is the register's signature.",
    roleplay_prompts: [
      "Người đối thoại nêu một quan điểm tuyệt đối (« sempre », « nunca »); phản hồi qua 4 lớp đệm (đồng tình một phần → não que… mas → điều kiện → hội tụ).",
      "Trong một debate, công nhận điểm mạnh của phía đối lập trước khi đánh dấu bất đồng bằng « dito isso, eu colocaria de outro modo ».",
    ],
    roleplay_prompts_en: [
      "Your interlocutor states an absolute view ('always', 'never'); respond through the four cushions (partial agreement → não que… mas → conditional → convergence).",
      "In a debate, acknowledge the opposing side's strength before marking disagreement with 'dito isso, eu colocaria de outro modo'.",
    ],
  },
];

export default lessons;
