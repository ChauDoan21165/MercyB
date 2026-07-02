// src/languages/portuguese/lessons-c2.ts
//
// Brazilian Portuguese C2 lessons for Vietnamese learners.
// Native-mastery pack: literary close reading (análise literária), formal
// debate and argumentation, rhetoric/irony/subtext, idiomatic register
// switching, and academic/intellectual discourse.
//
// Shape mirrors the French pack (src/languages/french/lessons-c2.ts) and the
// sibling Portuguese files (lessons-a1 … lessons-b2) so the page UI stays
// consistent across language verticals. The type surface is declared inline
// here because the Portuguese pack does not yet ship a shared lessons.ts
// registry — this file is self-contained on purpose, structurally compatible
// with the others so a future registry can swap the inline types for
// `import type { PortugueseLesson } from "./lessons";`.
//
// Brazilian (não europeu) Portuguese throughout. C2 means native-level
// command: irony, subtext, erudite register, and the ability to dismantle an
// argument without raising your voice. Hand-crafted; no AI filler.
// Vietnamese L1 notes (cultural_notes_vi, tip_advice_vi, pronunciation_vi) +
// English companions (pronunciation_focus_en, *_en).

// ── Inline type surface (mirrors FrenchLesson / sibling PT files) ───────────

export type PortugueseLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type PortugueseVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type PortugueseDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields can vary. Known optional fields:
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, portuguese, english?, hint_vi?, hint_en?
export type PortugueseExercise = Record<string, unknown>;

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PortugueseLesson = {
  id: string;
  category: string;
  level: PortugueseCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: PortugueseLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: PortugueseVocabEntry[];
  dialogue?: PortugueseDialogueLine[];
  exercises?: PortugueseExercise[];
  content?: string;
  // Calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: PortugueseDialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  idiom_glosses?: {
    idiom: string;
    literal: string;
    literal_en?: string;
    meaning: string;
    meaning_en?: string;
    example: string;
    example_en?: string;
  }[];
};

// ── Lessons ─────────────────────────────────────────────────────────────────

export const lessons: PortugueseLesson[] = [
  // ── 1. Literary close reading — análise literária ─────────────────────────
  {
    id: "portuguese_c2_analise_literaria",
    level: "C2",
    category: "literature",
    title_vi: "Phân tích văn học: đọc kỹ một trang văn (análise literária)",
    title_en: "Literary close reading: analyzing a literary passage",
    sentences: [
      {
        en: "Machado de Assis dispensa o adjetivo fácil e confia ao leitor a tarefa de completar o que a frase apenas sugere.",
        vi: "Machado de Assis loại bỏ tính từ dễ dãi và giao cho người đọc nhiệm vụ hoàn tất điều mà câu văn chỉ gợi ra.",
        pronunciation_focus: ["dispensa→djis-PÊN-sa", "adjetivo→a-dje-TJI-vu", "tarefa→ta-RÊ-fa", "sugere→su-JÉ-ri"],
        pronunciation_focus_en: [
          "dispensa→jees-PEN-sa — 'di' before 's' softens; nasal 'en'",
          "adjetivo→ah-jeh-CHEE-voo — 'dj/ti' palatalizes to 'jee/chee' in BR",
          "tarefa→ta-HEH-fa — initial 'r' kept here as tap; open 'é'",
          "sugere→soo-ZHEH-ree — 'g' before 'e' = 'zh'; final '-e' = 'ee'",
        ],
      },
      {
        en: "Note-se a ironia do narrador, que finge elogiar a personagem no exato instante em que a desmascara.",
        vi: "Hãy chú ý sự mỉa mai của người kể, kẻ giả vờ khen ngợi nhân vật ngay đúng khoảnh khắc lột mặt nạ cô ta.",
        pronunciation_focus: ["ironia→i-rô-NI-a", "narrador→na-ha-DOR", "elogiar→e-lô-ji-AR", "desmascara→djis-mas-CA-ra"],
        pronunciation_focus_en: [
          "ironia→ee-roh-NEE-a — stress on the 'NI'; four clear syllables",
          "narrador→nah-hah-DOR — double 'rr' = guttural 'h'; final stress",
          "elogiar→eh-loh-zhee-AR — 'gi' = 'zhee'; '-ar' carries the stress",
          "desmascara→jees-mas-KAH-ra — 'des' softens to 'jees'; = unmasks",
        ],
      },
      {
        en: "A construção em hipérbato — sujeito e verbo separados por uma longa intercalação — adia deliberadamente o sentido.",
        vi: "Cấu trúc đảo trang — chủ ngữ và động từ bị tách bởi một mệnh đề chen dài — cố ý trì hoãn ý nghĩa.",
        pronunciation_focus: ["construção→côns-tru-SÃU", "hipérbato→i-PÉR-ba-tu", "intercalação→in-ter-ca-la-SÃU", "deliberadamente→de-li-be-ra-da-MÊN-tji"],
        pronunciation_focus_en: [
          "construção→kons-troo-SOWNG — '-ção' = nasal 'sowng', heavy final stress",
          "hipérbato→ee-PEHR-ba-too — silent 'h'; stress on 'PER' (the antepenult)",
          "intercalação→in-ter-ka-la-SOWNG — long word, nasal start + nasal end",
          "deliberadamente→de-lee-be-ra-da-MEN-chee — adverb stress on '-MEN-'",
        ],
      },
      {
        en: "Longe de ser mero ornamento, a metáfora estrutura todo o parágrafo e antecipa o desfecho.",
        vi: "Khác xa chuyện chỉ là trang trí suông, phép ẩn dụ kiến tạo toàn bộ đoạn văn và báo trước kết cục.",
        pronunciation_focus: ["ornamento→or-na-MÊN-tu", "metáfora→me-TA-fo-ra", "estrutura→es-tru-TU-ra", "desfecho→djis-FÊ-xu"],
        pronunciation_focus_en: [
          "ornamento→or-na-MEN-too — nasal 'en'; final '-o' = 'oo'",
          "metáfora→me-TAH-fo-ra — proparoxytone: stress on 'TA', third-from-last",
          "estrutura→es-troo-TOO-ra — 'es' = 'es' (BR keeps it); stress 'TU'",
          "desfecho→jees-FAY-shoo — 'ch' = 'sh'; closed 'ê'; = outcome/denouement",
        ],
      },
      {
        en: "Caberia perguntar se o silêncio da personagem não diz, afinal, mais do que qualquer réplica.",
        vi: "Có lẽ nên hỏi liệu sự im lặng của nhân vật, rốt cuộc, có nói lên nhiều hơn bất kỳ lời đối đáp nào không.",
        pronunciation_focus: ["caberia→ca-be-RI-a", "silêncio→si-LÊN-siu", "afinal→a-fi-NAU", "réplica→HÉ-pli-ca"],
        pronunciation_focus_en: [
          "caberia→ka-be-REE-a — conditional of caber; 'caberia perguntar' = one might ask",
          "silêncio→see-LEN-syoo — nasal 'ê'; '-cio' = 'syoo'",
          "afinal→ah-fee-NOW — final '-al' = 'ow'; = after all / in the end",
          "réplica→HEH-plee-ka — initial 'r' = guttural 'h'; proparoxytone on 'RÉ'",
        ],
      },
    ],
    cultural_notes_vi:
      "ANÁLISE LITERÁRIA ở bậc đại học Brazil (na faculdade de Letras) gần với 'explication de texte' của Pháp nhưng linh hoạt hơn. Bạn được giao một đoạn (um excerto / um trecho) và phải bình giảng — KHÔNG tóm tắt cốt truyện (não resumir o enredo). Sa vào 'o autor quis dizer que…' (tác giả muốn nói rằng…) là lỗi kinh điển: phê bình Brazil gọi đó là 'falácia intencional' (ngụy biện về ý đồ). Ta phân tích VĂN BẢN, không phải tâm trí tác giả.\n\nTÁC GIẢ KINH ĐIỂN bạn nên biết tên: Machado de Assis (bậc thầy mỉa mai, narrador não confiável — người kể không đáng tin), Guimarães Rosa (sáng tạo ngôn ngữ, Grande Sertão: Veredas), Clarice Lispector (dòng ý thức, epifania), Carlos Drummond de Andrade và João Cabral de Melo Neto (thơ). Nhắc đúng tên trong một bài phân tích cho thấy sự thành thạo văn hóa.\n\nCẤU TRÚC bài phân tích (a estrutura da análise):\n(1) Contextualização — đặt đoạn vào tác phẩm và thời kỳ (Romantismo, Realismo, Modernismo de 1922…).\n(2) Análise formal — figuras de linguagem (metáfora, ironia, hipérbato, anáfora), nhịp điệu, giọng kể (foco narrativo: 1ª/3ª pessoa, narrador onisciente).\n(3) Interpretação — ý nghĩa nảy sinh TỪ hình thức, không tách rời.\n\nKHÁC BIỆT VỚI VIỆT NAM: giáo dục văn ở Việt thường tách 'nội dung' và 'nghệ thuật'. Truyền thống Brazil (kế thừa từ Pháp và phê bình mới) coi A FORMA É O CONTEÚDO — hình thức CHÍNH LÀ nội dung. Một phép ẩn dụ không 'minh họa' một ý; nó SẢN SINH ý nghĩa.",
    cultural_notes_en:
      "University-level análise literária in Brazil (in a Letras faculty) resembles the French 'explication de texte' but is looser. You're given an excerpt (um trecho) and must comment on it — NOT summarize the plot (não resumir o enredo). Falling into 'o autor quis dizer que…' (the author meant that…) is the classic error: Brazilian criticism calls it the 'falácia intencional' (intentional fallacy). You analyze the TEXT, not the author's mind.\n\nCanonical authors to name-drop accurately: Machado de Assis (master of irony, the unreliable narrator), Guimarães Rosa (linguistic invention, Grande Sertão: Veredas), Clarice Lispector (stream of consciousness, epiphany), and the poets Drummond and João Cabral. Structure: contextualize → formal analysis of figures and narrative voice → interpretation that arises FROM the form. Like the French, the tradition holds that A FORMA É O CONTEÚDO — form IS content.",
    tip_advice_vi:
      "CÔNG THỨC NHẬP ĐỀ (introdução): 'O trecho em análise, extraído de [tác phẩm] de [tác giả], situa-se em [bối cảnh].' Rồi nêu eixo (trục đọc): 'Pretendo demonstrar que…' (Tôi muốn chứng minh rằng…).\n\nĐỂ TRÍCH DẪN VÀ BÌNH (citar e comentar): luôn đặt trích dẫn trong dấu ngoặc kép và bình ngay: 'A expressão «[trích]» revela…' / 'Note-se o emprego de…' (Hãy chú ý cách dùng…) / 'O narrador recorre à ironia para…' (Người kể dùng mỉa mai để…).\n\nTÊN GỌI FIGURAS DE LINGUAGEM cần thuộc: a metáfora (ẩn dụ), a metonímia (hoán dụ), a ironia (mỉa mai), a anáfora (điệp đầu), o hipérbato (đảo trang), a antítese (đối lập), o eufemismo, a hipérbole.\n\nĐỂ KẾT LUẬN (concluir): 'Em suma, longe de ser [hiểu nông], o trecho [ý sâu hơn].' / 'A análise poderia estender-se a [đoạn/tác phẩm khác].'\n\nTRÁNH: 'É muito bonito' (Đẹp lắm) — phán xét cảm tính, không phân tích. 'O autor quis dizer' — falácia intencional. Tóm tắt cốt truyện thay vì bình giảng. Dán lý thuyết (Bourdieu, Foucault) lên văn bản từ ngoài — bắt đầu từ CHỨNG CỨ trong văn bản trước.",
    tip_advice_en:
      "Intro formula: 'O trecho em análise, extraído de [work] de [author], situa-se em [context].' then state your reading axis: 'Pretendo demonstrar que…' (I aim to show that…). To quote-and-comment, always quote then gloss: 'Note-se o emprego de…' (Note the use of…), 'O narrador recorre à ironia para…'. Memorize the figura names (metáfora, metonímia, ironia, anáfora, hipérbato, antítese). Conclude with 'Em suma, longe de ser [shallow], o trecho [deeper point].' Avoid 'É muito bonito' (sentimental, not analytical), 'O autor quis dizer' (intentional fallacy), plot summary, and bolting theory on from outside — start from textual evidence.",
    vocabulary: [
      { word: "a análise literária", en: "literary analysis", vi: "phân tích văn học", pos: "n.f.", pronunciation_vi: "a-NA-li-zi li-te-RA-ria", pronunciation_en: "a-NAH-lee-zee lee-te-RAH-rya — proparoxytone 'análise'" },
      { word: "o trecho", en: "the passage / excerpt", vi: "đoạn trích", pos: "n.m.", pronunciation_vi: "TRÊ-xu", pronunciation_en: "TRAY-shoo — 'ch' = 'sh'; the standard word for an excerpt" },
      { word: "o foco narrativo", en: "narrative point of view", vi: "tiêu điểm trần thuật", pos: "n.m.", pronunciation_vi: "FÔ-cu na-ha-TJI-vu", pronunciation_en: "FOH-koo na-ha-CHEE-voo — 1ª/3ª pessoa, narrator's stance" },
      { word: "o narrador onisciente", en: "the omniscient narrator", vi: "người kể toàn tri", pos: "n.m.", pronunciation_vi: "na-ha-DOR ô-ni-si-ÊN-tji", pronunciation_en: "na-ha-DOR oh-nee-syen-CHEE" },
      { word: "a ironia", en: "irony", vi: "sự mỉa mai", pos: "n.f.", pronunciation_vi: "i-rô-NI-a", pronunciation_en: "ee-roh-NEE-a — saying X to mean the opposite" },
      { word: "a metáfora", en: "metaphor", vi: "ẩn dụ", pos: "n.f.", pronunciation_vi: "me-TA-fo-ra", pronunciation_en: "me-TAH-fo-ra — proparoxytone" },
      { word: "o hipérbato", en: "hyperbaton (inverted word order)", vi: "phép đảo trang", pos: "n.m.", pronunciation_vi: "i-PÉR-ba-tu", pronunciation_en: "ee-PEHR-ba-too — silent 'h'" },
      { word: "a verossimilhança", en: "verisimilitude", vi: "tính chân thực (văn học)", pos: "n.f.", pronunciation_vi: "ve-rô-si-mi-LIÃN-sa", pronunciation_en: "ve-ro-see-mee-LYAHN-sa — 'lh' = 'ly'; nasal 'an'" },
      { word: "o desfecho", en: "the denouement / outcome", vi: "kết cục", pos: "n.m.", pronunciation_vi: "djis-FÊ-xu", pronunciation_en: "jees-FAY-shoo" },
      { word: "subentender", en: "to imply / leave implicit", vi: "ngụ ý, ám chỉ", pos: "v.", pronunciation_vi: "su-ben-ten-DER", pronunciation_en: "soo-ben-ten-DEHR — sub- + entender" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "O narrador recorre à ___ para fingir elogiar e, na verdade, criticar a personagem.",
        answer: "ironia",
        hint_vi: "figura de linguagem nói X nhưng ý là ngược lại",
        hint_en: "the figure of saying one thing to mean its opposite",
      },
      {
        type: "matching",
        pairs: [
          ["a metáfora", "ẩn dụ"],
          ["o hipérbato", "phép đảo trang"],
          ["o foco narrativo", "tiêu điểm trần thuật"],
          ["a verossimilhança", "tính chân thực"],
        ],
        instruction: "Nối thuật ngữ phân tích văn học với nghĩa tiếng Việt.",
        instruction_en: "Match each literary-analysis term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Khác xa chuyện chỉ là trang trí, phép ẩn dụ kiến tạo cả đoạn văn.",
        portuguese: "Longe de ser mero ornamento, a metáfora estrutura todo o parágrafo.",
        english: "Far from being mere ornament, the metaphor structures the whole paragraph.",
        hint_vi: "'longe de ser' = khác xa chuyện là; mở đầu mạnh cho một luận điểm",
        hint_en: "'longe de ser' = far from being; a strong way to open an analytic point",
      },
    ],
  },

  // ── 2. Formal debate and argumentation ────────────────────────────────────
  {
    id: "portuguese_c2_debate_formal",
    level: "C2",
    category: "debate",
    title_vi: "Tranh biện trang trọng: lập luận và phản bác ở trình độ bản ngữ",
    title_en: "Formal debate: native-level argument and rebuttal",
    sentences: [
      {
        en: "Concedo o ponto, mas isso em nada compromete a minha tese central.",
        vi: "Tôi nhượng bộ điểm đó, nhưng điều ấy chẳng hề làm tổn hại luận điểm trung tâm của tôi.",
        pronunciation_focus: ["concedo→côn-SÊ-du", "compromete→côm-prô-MÊ-tji", "tese→TÉ-zi", "central→sen-TRAU"],
        pronunciation_focus_en: [
          "concedo→kong-SAY-doo — closed 'ê'; 'I concede'",
          "compromete→kohm-pro-MEH-chee — '-te' palatalizes to 'chee'",
          "tese→TEH-zee — open 'é'; 's' between vowels = 'z'",
          "central→sen-TROW — final '-al' = 'ow'; stress on the end",
        ],
      },
      {
        en: "Permita-me discordar: a premissa de que parte o seu raciocínio é, ela própria, discutível.",
        vi: "Cho phép tôi bất đồng: chính tiền đề mà lập luận của ngài khởi đi từ đó, tự nó, đã đáng tranh cãi.",
        pronunciation_focus: ["permita→per-MI-ta", "premissa→pre-MI-sa", "raciocínio→ha-siô-SI-niu", "discutível→djis-cu-TJI-veu"],
        pronunciation_focus_en: [
          "permita→per-MEE-ta — 'permita-me' = allow me; polite imperative",
          "premissa→pre-MEE-sa — double 's' stays unvoiced; = premise",
          "raciocínio→ha-syoh-SEE-nyoo — initial 'r' = 'h'; = reasoning",
          "discutível→jees-koo-CHEE-vew — final '-vel' = 'vew'; = debatable",
        ],
      },
      {
        en: "Se levarmos o seu argumento às últimas consequências, chegaremos a um absurdo.",
        vi: "Nếu đẩy lập luận của ngài đến tận cùng hệ quả, ta sẽ đi đến một điều phi lý.",
        pronunciation_focus: ["levarmos→le-VAR-mus", "últimas→UU-tji-mas", "consequências→côn-se-KUÊN-sias", "absurdo→ab-SUR-du"],
        pronunciation_focus_en: [
          "levarmos→le-VAR-moos — future subjunctive 'se levarmos' = if we take",
          "últimas→OOL-chee-mas — proparoxytone; 'ti' = 'chee'",
          "consequências→kong-se-KWEN-syas — 'qu' = 'kw'; nasal 'en'",
          "absurdo→ab-SOOR-doo — reductio ad absurdum in one word",
        ],
      },
      {
        en: "Não confundamos correlação com causalidade; o fato de coincidirem não prova que uma gere a outra.",
        vi: "Đừng nhầm tương quan với nhân quả; việc chúng trùng nhau không chứng minh cái này sinh ra cái kia.",
        pronunciation_focus: ["confundamos→côn-fun-DA-mus", "correlação→cô-he-la-SÃU", "causalidade→cau-za-li-DA-dji", "coincidirem→cô-in-si-DJI-rein"],
        pronunciation_focus_en: [
          "confundamos→kong-foon-DA-moos — hortative subjunctive 'let us not confuse'",
          "correlação→ko-he-la-SOWNG — 'rr' = 'h'; '-ção' nasal end",
          "causalidade→kow-za-lee-DAH-jee — 'au' = 'ow'; = causality",
          "coincidirem→ko-in-see-JEE-reng — future subjunctive after 'fato de'",
        ],
      },
      {
        en: "Em última análise, a divergência não é factual, mas de valores — e essa distinção muda tudo.",
        vi: "Xét cho cùng, sự khác biệt không phải về dữ kiện, mà về giá trị — và sự phân biệt ấy thay đổi tất cả.",
        pronunciation_focus: ["última→UU-tji-ma", "divergência→di-ver-JÊN-sia", "factual→fak-tu-AU", "distinção→djis-tin-SÃU"],
        pronunciation_focus_en: [
          "última→OOL-chee-ma — 'em última análise' = in the final analysis",
          "divergência→dee-ver-ZHEN-sya — 'g' before 'e' = 'zh'; nasal 'en'",
          "factual→fak-too-OW — final '-al' = 'ow'; = factual",
          "distinção→jees-cheen-SOWNG — 'di' softens; nasal '-ção'",
        ],
      },
    ],
    cultural_notes_vi:
      "TRANH BIỆN TRANG TRỌNG ở Brazil (debate acadêmico, mesa-redonda, tribunal, política) giữ giọng lịch sự ngay cả khi đối kháng gay gắt. Công thức vàng: NHƯỢNG BỘ trước, PHẢN BÁC sau — 'Concedo que…, porém…' (Tôi nhượng bộ rằng…, song…). Điều này gọi là concessão (nhượng bộ tu từ) và khiến bạn nghe có lý hơn, không phòng thủ.\n\nXƯNG HÔ trong tranh biện trang trọng dùng 'o senhor / a senhora' hoặc gọi chức danh ('Permita-me discordar, professor'). 'Você' nghe quá suồng sã trong bối cảnh này. Brazil rất coi trọng a cordialidade (sự nhã nhặn) — tấn công cá nhân (ataque ad hominem) bị xem là thua về thực chất.\n\nTÊN GỌI NGỤY BIỆN (falácias) một người C2 nên dùng được: 'falácia do espantalho' (người rơm — bóp méo lập luận đối phương), 'ad hominem' (công kích cá nhân), 'falsa dicotomia' (lưỡng phân giả), 'apelo à autoridade' (viện dẫn thẩm quyền sai chỗ), 'declive escorregadio' (trượt dốc). Gọi đúng tên một ngụy biện giữa cuộc tranh luận là đòn rất mạnh: 'Isso é uma falsa dicotomia.'\n\nKHÁC BIỆT VỚI VIỆT NAM: tranh luận trang trọng phương Tây cho phép — và mong đợi — bạn phản bác trực diện ý kiến của người trên (giáo sư, sếp) MIỄN LÀ phản bác lập luận chứ không phải con người. Trong văn hóa Việt trọng tôn ti, điều này có thể thấy bất an, nhưng ở Brazil học thuật, im lặng nhượng bộ bị coi là thiếu lập trường.",
    cultural_notes_en:
      "Formal debate in Brazil (academic panels, courts, politics) stays courteous even when sharply opposed. The golden move: CONCEDE first, REBUT second — 'Concedo que…, porém…' (I grant that…, however…). This rhetorical concessão makes you sound reasonable, not defensive. Address opponents as 'o senhor / a senhora' or by title; 'você' is too casual here. Personal attacks (ad hominem) read as conceding the substance. Learn to name fallacies live — 'falácia do espantalho' (straw man), 'falsa dicotomia' (false dichotomy), 'apelo à autoridade', 'declive escorregadio' (slippery slope). Unlike hierarchy-conscious Vietnamese norms, Western formal debate expects you to rebut a superior's argument head-on — provided you attack the argument, not the person; silent deference reads as having no position.",
    tip_advice_vi:
      "BỘ KHUNG PHẢN BÁC (a estrutura da refutação) ở trình độ C2:\n(1) Nhượng bộ: 'Concedo que…' / 'Há que reconhecer que…' (Phải thừa nhận rằng…).\n(2) Bản lề: 'Porém' / 'Não obstante' / 'Dito isso' (Dù vậy).\n(3) Phản bác: 'a premissa não se sustenta' (tiền đề không đứng vững) / 'isso não decorre logicamente' (điều đó không suy ra một cách logic).\n(4) Hệ quả: 'Se levarmos isso às últimas consequências…' (Nếu đẩy đến tận cùng…).\n\nĐỘNG TỪ THỨC GIẢ ĐỊNH HÔ HÀO (subjuntivo hortativo) nghe rất trí thức: 'Não confundamos…' (Đừng nhầm…), 'Consideremos…' (Hãy xét…), 'Reconheçamos…' (Hãy thừa nhận…). Đây là 1ª pessoa plural subjuntivo — dấu hiệu register cao.\n\nCỤM CHUYỂN MẠCH SANG: 'Em última análise' (Xét cho cùng), 'Por outro lado' (Mặt khác), 'Nesse sentido' (Theo nghĩa đó), 'Cabe ressaltar que' (Đáng nhấn mạnh rằng).\n\nTRÁNH: 'Você está errado' (Bạn sai) — quá thẳng và suồng sã. 'Tipo assim' / 'né?' — khẩu ngữ, hạ register ngay. Cao giọng — ở Brazil ai cao giọng trước thường bị coi là đuối lý.",
    tip_advice_en:
      "C2 rebuttal frame: (1) concede — 'Concedo que…' / 'Há que reconhecer que…'; (2) pivot — 'Porém' / 'Não obstante' / 'Dito isso'; (3) rebut — 'a premissa não se sustenta', 'isso não decorre logicamente'; (4) push it — 'Se levarmos isso às últimas consequências…'. The hortative subjunctive sounds erudite: 'Não confundamos…', 'Consideremos…', 'Reconheçamos…'. Transition with 'Em última análise', 'Por outro lado', 'Cabe ressaltar que'. Avoid 'Você está errado' (too blunt/casual), filler like 'tipo assim' / 'né?' (drops the register), and raising your voice — in Brazil whoever raises it first looks like they've lost the point.",
    vocabulary: [
      { word: "a tese", en: "the thesis / central claim", vi: "luận điểm trung tâm", pos: "n.f.", pronunciation_vi: "TÉ-zi", pronunciation_en: "TEH-zee — open 'é'; the claim you defend" },
      { word: "a premissa", en: "the premise", vi: "tiền đề", pos: "n.f.", pronunciation_vi: "pre-MI-sa", pronunciation_en: "pre-MEE-sa" },
      { word: "a refutação", en: "the rebuttal", vi: "sự phản bác", pos: "n.f.", pronunciation_vi: "he-fu-ta-SÃU", pronunciation_en: "he-foo-ta-SOWNG — initial 'r' = 'h'" },
      { word: "conceder", en: "to concede (a point)", vi: "nhượng bộ một điểm", pos: "v.", pronunciation_vi: "côn-se-DER", pronunciation_en: "kong-se-DEHR" },
      { word: "a falácia", en: "the fallacy", vi: "ngụy biện", pos: "n.f.", pronunciation_vi: "fa-LA-sia", pronunciation_en: "fa-LAH-sya" },
      { word: "a falsa dicotomia", en: "the false dichotomy", vi: "lưỡng phân giả", pos: "n.f.", pronunciation_vi: "FAU-sa di-cô-tô-MI-a", pronunciation_en: "FOW-sa dee-ko-toh-MEE-a" },
      { word: "o raciocínio", en: "the reasoning", vi: "lập luận, suy luận", pos: "n.m.", pronunciation_vi: "ha-siô-SI-niu", pronunciation_en: "ha-syoh-SEE-nyoo" },
      { word: "não obstante", en: "nevertheless", vi: "tuy nhiên, dù vậy", pos: "conj.", pronunciation_vi: "NÃU obs-TÃN-tji", pronunciation_en: "NOWNG obs-TAHN-chee — formal pivot word" },
      { word: "decorrer (de)", en: "to follow / result (from)", vi: "suy ra từ, phát sinh từ", pos: "v.", pronunciation_vi: "de-cô-HER", pronunciation_en: "de-ko-HEHR — 'isso não decorre' = it doesn't follow" },
      { word: "em última análise", en: "in the final analysis", vi: "xét cho cùng", pos: "expr.", pronunciation_vi: "ein UU-tji-ma a-NA-li-zi", pronunciation_en: "eng OOL-chee-ma a-NAH-lee-zee" },
    ],
    dialogue: [
      { speaker: "Debatedor A", text: "Concedo que os dados são preocupantes, porém a sua interpretação parte de uma premissa frágil.", vi: "Tôi nhượng bộ rằng các số liệu đáng lo, song cách diễn giải của ngài khởi từ một tiền đề yếu.", en: "I grant the data is worrying, but your reading starts from a shaky premise." },
      { speaker: "Debatedor B", text: "Permita-me precisar: não afirmei causalidade, apenas correlação.", vi: "Cho phép tôi nói rõ: tôi không khẳng định nhân quả, chỉ là tương quan.", en: "Let me be precise: I claimed correlation, not causation." },
      { speaker: "Debatedor A", text: "Nesse caso, retiro a objeção — mas então a sua conclusão é bem mais modesta do que parecia.", vi: "Trong trường hợp đó, tôi rút lại phản đối — nhưng kết luận của ngài khi ấy khiêm tốn hơn nhiều so với vẻ ban đầu.", en: "Then I withdraw the objection — but your conclusion is far more modest than it seemed." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Não confundamos correlação com ___: coincidir não prova causar.",
        answer: "causalidade",
        hint_vi: "quan hệ nhân quả",
        hint_en: "the cause-and-effect relationship",
      },
      {
        type: "matching",
        pairs: [
          ["conceder", "nhượng bộ"],
          ["a refutação", "sự phản bác"],
          ["a falsa dicotomia", "lưỡng phân giả"],
          ["não obstante", "tuy nhiên"],
        ],
        instruction: "Nối thuật ngữ tranh biện với nghĩa tiếng Việt.",
        instruction_en: "Match each debate term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Nếu đẩy lập luận của ngài đến tận cùng, ta sẽ đi đến một điều phi lý.",
        portuguese: "Se levarmos o seu argumento às últimas consequências, chegaremos a um absurdo.",
        english: "If we take your argument to its ultimate consequences, we reach an absurdity.",
        hint_vi: "'se levarmos' = thức giả định tương lai; mở đầu cho reductio ad absurdum",
        hint_en: "'se levarmos' = future subjunctive; the opening of a reductio ad absurdum",
      },
    ],
  },

  // ── 3. Rhetoric, irony and subtext ────────────────────────────────────────
  {
    id: "portuguese_c2_ironia_subtexto",
    level: "C2",
    category: "rhetoric",
    title_vi: "Mỉa mai, hàm ý và ẩn ngôn: nói một đằng, ý một nẻo",
    title_en: "Irony, innuendo and subtext: saying one thing, meaning another",
    sentences: [
      {
        en: "Que ideia brilhante — pena que já tenha fracassado três vezes.",
        vi: "Một ý tưởng thật xuất chúng — tiếc là nó đã thất bại ba lần rồi.",
        pronunciation_focus: ["brilhante→bri-LIÃN-tji", "pena→PÊ-na", "fracassado→fra-ca-SA-du", "vezes→VÊ-zis"],
        pronunciation_focus_en: [
          "brilhante→bree-LYAHN-chee — 'lh' = 'ly'; said flat = sarcasm",
          "pena→PAY-na — 'que pena' = what a pity; ironic regret",
          "fracassado→fra-ka-SA-doo — double 's' unvoiced; = failed",
          "vezes→VAY-zees — 's' between vowels = 'z'; = times",
        ],
      },
      {
        en: "Não que eu queira me intrometer, mas talvez valesse a pena reconsiderar.",
        vi: "Không phải tôi muốn xen vào đâu, nhưng có lẽ cũng đáng để cân nhắc lại đấy.",
        pronunciation_focus: ["queira→KÊi-ra", "intrometer→in-trô-me-TER", "valesse→va-LÉ-si", "reconsiderar→he-côn-si-de-RAR"],
        pronunciation_focus_en: [
          "queira→KAY-ra — subjunctive of querer; softening 'não que eu queira'",
          "intrometer→in-tro-me-TEHR — = to butt in; the disclaimer that precedes butting in",
          "valesse→va-LEH-see — imperfect subjunctive; 'valesse a pena' = would be worth it",
          "reconsiderar→he-kong-see-de-RAR — initial 'r' = 'h'",
        ],
      },
      {
        en: "Ele é, digamos, econômico com a verdade.",
        vi: "Anh ta, nói thế nào nhỉ, hơi tiết kiệm sự thật.",
        pronunciation_focus: ["digamos→DJI-ga-mus", "econômico→e-cô-NÔ-mi-cu", "verdade→ver-DA-dji"],
        pronunciation_focus_en: [
          "digamos→JEE-ga-moos — 'digamos' = let's say; the hedge that flags euphemism",
          "econômico→eh-ko-NOH-mee-koo — proparoxytone; euphemism for 'he lies'",
          "verdade→ver-DAH-jee — '-de' = 'jee' in BR",
        ],
      },
      {
        en: "Subentende-se, nas entrelinhas, uma crítica que ninguém ousa formular abertamente.",
        vi: "Ngầm hiểu, ở giữa các dòng chữ, một lời phê phán mà không ai dám phát biểu công khai.",
        pronunciation_focus: ["subentende→su-ben-TÊN-dji", "entrelinhas→en-tre-LI-ñas", "ousa→Ô-za", "abertamente→a-ber-ta-MÊN-tji"],
        pronunciation_focus_en: [
          "subentende→soo-ben-TEN-jee — 'subentende-se' = it is implied",
          "entrelinhas→en-tre-LEE-nyas — 'nas entrelinhas' = between the lines",
          "ousa→OH-za — 's' = 'z'; = dares",
          "abertamente→a-ber-ta-MEN-chee — adverb; = openly",
        ],
      },
      {
        en: "Com a devida vênia, o nobre colega parece ter confundido firmeza com teimosia.",
        vi: "Với sự kính trọng đúng mực, vị đồng nghiệp đáng kính dường như đã nhầm sự kiên định với tính bướng bỉnh.",
        pronunciation_focus: ["devida→de-VI-da", "vênia→VÊ-nia", "firmeza→fir-MÊ-za", "teimosia→tei-mô-ZI-a"],
        pronunciation_focus_en: [
          "devida→de-VEE-da — 'com a devida vênia' = with all due respect (often ironic)",
          "vênia→VAY-nya — formal 'leave/permission'; nasal 'ê'",
          "firmeza→feer-MAY-za — 's' = 'z'; = firmness",
          "teimosia→tay-mo-ZEE-a — 'ei' = 'ay'; = stubbornness",
        ],
      },
    ],
    cultural_notes_vi:
      "MỈA MAI (a ironia) và HÀM Ý (o subtexto) là đỉnh cao của năng lực C2: hiểu được điều KHÔNG được nói ra. Brazil chuộng a indireta (lời nói gián tiếp) — phê phán bọc trong khen ngợi, từ chối bọc trong lịch sự.\n\nDẤU HIỆU BÁO MỈA MAI: thường là ngữ điệu phẳng + cụm cường điệu giả ('Que ideia brilhante!' nói đều đều = nó tệ). Trên văn bản, người Brazil hay viết 'rs' hoặc 'kkkk' (= haha) hoặc dùng dấu '…' để báo hàm ý. Cụm 'digamos' / 'por assim dizer' (nói thế nào nhỉ / có thể nói vậy) báo trước một uyển ngữ (eufemismo): 'econômico com a verdade' = nói dối.\n\nLITOTES (a litotes) — khẳng định bằng cách phủ định cái ngược lại — rất Brazil và rất lịch sự: 'Não é nada mau' (Không tệ chút nào = khá tốt), 'Não deixa de ser interessante' (Cũng không phải là không thú vị).\n\nUYỂN NGỮ MỈA MAI TRANG TRỌNG: 'Com a devida vênia' (Với sự kính trọng đúng mực) trong nghị trường/tòa án thường báo trước một đòn — giống 'with all due respect' tiếng Anh, người nghe biết đòn sắp tới.\n\nKHÁC BIỆT VỚI VIỆT NAM: cả hai văn hóa đều dùng nói gián tiếp để giữ thể diện, nên người Việt có lợi thế trực giác ở đây. Nhưng MỈA MAI Brazil thường VUI VẺ, tinh nghịch (debochado) hơn là cay nghiệt — đùa cợt nhiều hơn là sỉ vả. Hiểu sai sắc thái 'đùa' này dễ khiến ta tưởng bị xúc phạm trong khi họ chỉ đang trêu thân thiện.",
    cultural_notes_en:
      "Irony (a ironia) and subtext (o subtexto) are the summit of C2: grasping what is NOT said. Brazilians favor a indireta — criticism wrapped in praise, refusal wrapped in courtesy. Irony cues: flat intonation + fake hyperbole ('Que ideia brilhante!' said flat = it's bad). In writing, Brazilians signal it with 'rs'/'kkkk' (= haha) or trailing '…'. 'Digamos' / 'por assim dizer' flags a euphemism ahead ('econômico com a verdade' = he lies). Litotes is very Brazilian and polite: 'Não é nada mau' (not bad at all = pretty good). 'Com a devida vênia' in court/parliament telegraphs an incoming blow, like English 'with all due respect'. Both cultures use indirectness to save face — Vietnamese speakers have an intuitive edge — but Brazilian irony is usually playful (debochado) rather than cutting; misreading the teasing as an insult is the common trap.",
    tip_advice_vi:
      "ĐỂ HIỂU MỈA MAI, hỏi: lời này có hợp ngữ cảnh không? Nếu ai khen 'Que pontualidade!' (Thật đúng giờ!) khi bạn đến trễ 40 phút — đó là mỉa mai. Sự VÊNH giữa lời và thực tế chính là tín hiệu.\n\nĐỂ NÓI GIÁN TIẾP một cách lịch sự (litotes + hedge):\n- 'Não que eu queira me intrometer, mas…' (Không phải tôi muốn xen vào, nhưng…) — mở đầu một góp ý không mời.\n- 'Talvez valesse a pena reconsiderar.' (Có lẽ đáng cân nhắc lại.) — chê nhẹ bằng thức giả định.\n- 'Não deixa de ter os seus méritos.' (Cũng không phải không có điểm hay.) — khen dè dặt = chê khéo.\n\nCỤM BÁO UYỂN NGỮ: 'digamos' / 'por assim dizer' / 'para usar um eufemismo' (dùng một uyển ngữ).\n\nTHẬN TRỌNG VỀ REGISTER: mỉa mai trang trọng ('com a devida vênia') hợp nghị trường; mỉa mai đùa ('aham, sei…' = ừ, biết rồi…) hợp bạn bè. Đừng trộn nhầm: mỉa mai suồng sã trong họp trang trọng nghe xấc; mỉa mai trang trọng giữa bạn bè nghe kiểu cách.\n\nTRÁNH: dùng mỉa mai với người mới quen — dễ bị hiểu là thật và gây xúc phạm. Mỉa mai an toàn nhất khi cả hai bên đã thân.",
    tip_advice_en:
      "To detect irony, ask whether the words fit the situation: 'Que pontualidade!' (Such punctuality!) when you're 40 minutes late = sarcasm. The mismatch is the signal. To be indirect politely, combine litotes + a hedge: 'Não que eu queira me intrometer, mas…' (opening unsolicited advice), 'Talvez valesse a pena reconsiderar' (soft criticism via subjunctive), 'Não deixa de ter os seus méritos' (faint praise = veiled critique). Flag euphemism with 'digamos' / 'por assim dizer'. Watch register: 'com a devida vênia' is for parliament; 'aham, sei…' (yeah, sure…) is for friends — don't swap them. Avoid irony with new acquaintances; it's read literally and offends. It's safest once both sides are close.",
    vocabulary: [
      { word: "a ironia", en: "irony", vi: "sự mỉa mai", pos: "n.f.", pronunciation_vi: "i-rô-NI-a", pronunciation_en: "ee-roh-NEE-a" },
      { word: "o subtexto", en: "the subtext", vi: "ẩn ngôn, hàm ý", pos: "n.m.", pronunciation_vi: "sub-TÊS-tu", pronunciation_en: "soob-TES-too" },
      { word: "nas entrelinhas", en: "between the lines", vi: "giữa những dòng chữ", pos: "expr.", pronunciation_vi: "nas en-tre-LI-ñas", pronunciation_en: "nas en-tre-LEE-nyas — 'lh' = 'ny'" },
      { word: "o eufemismo", en: "the euphemism", vi: "uyển ngữ", pos: "n.m.", pronunciation_vi: "eu-fe-MIS-mu", pronunciation_en: "ew-fe-MEES-moo" },
      { word: "a litotes", en: "litotes (affirming by negating the opposite)", vi: "phép nói giảm (khẳng định qua phủ định)", pos: "n.f.", pronunciation_vi: "li-TÔ-tis", pronunciation_en: "lee-TOH-tees — e.g. 'não é nada mau'" },
      { word: "a indireta", en: "the hint / veiled remark", vi: "lời bóng gió", pos: "n.f.", pronunciation_vi: "in-di-RÉ-ta", pronunciation_en: "in-jee-REH-ta — 'mandar uma indireta' = to drop a hint" },
      { word: "debochado", en: "mocking / cheekily ironic", vi: "giễu cợt, đùa cợt", pos: "adj.", pronunciation_vi: "de-bô-XA-du", pronunciation_en: "de-bo-SHAH-doo — 'ch' = 'sh'; playful mockery" },
      { word: "subentender", en: "to imply", vi: "ngụ ý", pos: "v.", pronunciation_vi: "su-ben-ten-DER", pronunciation_en: "soo-ben-ten-DEHR" },
      { word: "com a devida vênia", en: "with all due respect (often ironic)", vi: "với sự kính trọng đúng mực", pos: "expr.", pronunciation_vi: "côm a de-VI-da VÊ-nia", pronunciation_en: "kohm a de-VEE-da VAY-nya" },
      { word: "econômico com a verdade", en: "economical with the truth (= lying)", vi: "tiết kiệm sự thật (= nói dối)", pos: "expr.", pronunciation_vi: "e-cô-NÔ-mi-cu côm a ver-DA-dji", pronunciation_en: "eh-ko-NOH-mee-koo kohm a ver-DAH-jee" },
    ],
    idiom_glosses: [
      {
        idiom: "economês / falar difícil",
        literal: "to speak hard",
        literal_en: "'speaking hard' — using needlessly complex language",
        meaning: "nói màu mè, dùng từ to để che ý rỗng",
        meaning_en: "to use inflated jargon to disguise an empty point",
        example: "Ele adora falar difícil para parecer mais inteligente do que é.",
        example_en: "He loves talking fancy to seem smarter than he is.",
      },
      {
        idiom: "jogar verde para colher maduro",
        literal: "to throw green to harvest ripe",
        literal_en: "'throw green to harvest ripe' — say something half-true to fish for the full truth",
        meaning: "tung tin nửa thật để dò phản ứng và moi sự thật",
        meaning_en: "to float a half-truth to bait someone into revealing the rest",
        example: "Ela jogou verde sobre a viagem só para ver se ele confessava.",
        example_en: "She floated a hint about the trip just to see if he'd confess.",
      },
      {
        idiom: "ler nas entrelinhas",
        literal: "to read between the lines",
        literal_en: "'read between the lines' — grasp the implied meaning",
        meaning: "hiểu hàm ý không nói ra",
        meaning_en: "to grasp the unstated implication",
        example: "Lendo nas entrelinhas, dá para perceber que a resposta é não.",
        example_en: "Reading between the lines, you can tell the answer is no.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Ele não mente exatamente; é apenas, ___, econômico com a verdade.",
        answer: "digamos",
        hint_vi: "cụm báo trước một uyển ngữ ('nói thế nào nhỉ')",
        hint_en: "the hedge that flags an incoming euphemism ('let's say')",
      },
      {
        type: "matching",
        pairs: [
          ["a litotes", "phép nói giảm"],
          ["nas entrelinhas", "giữa những dòng chữ"],
          ["debochado", "giễu cợt"],
          ["a indireta", "lời bóng gió"],
        ],
        instruction: "Nối thuật ngữ tu từ với nghĩa tiếng Việt.",
        instruction_en: "Match each rhetorical term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Đọc giữa những dòng chữ, có thể thấy câu trả lời là không.",
        portuguese: "Lendo nas entrelinhas, dá para perceber que a resposta é não.",
        english: "Reading between the lines, you can tell the answer is no.",
        hint_vi: "'dá para' = có thể (khẩu ngữ chuẩn); 'nas entrelinhas' = hàm ý",
        hint_en: "'dá para' = one can (idiomatic); 'nas entrelinhas' = the subtext",
      },
    ],
  },

  // ── 4. Idiomatic mastery and register switching ───────────────────────────
  {
    id: "portuguese_c2_registro_idiomatico",
    level: "C2",
    category: "register",
    title_vi: "Thành ngữ và chuyển đổi văn phong: từ vỉa hè đến nghị viện",
    title_en: "Idiomatic mastery and register switching: from the street to the senate",
    sentences: [
      {
        en: "Numa reunião, eu diria «precisamos otimizar os recursos»; com os amigos, «temos que dar um jeito na grana».",
        vi: "Trong một cuộc họp, tôi sẽ nói «cần tối ưu hóa nguồn lực»; với bạn bè, «phải xoay xở cái khoản tiền này».",
        pronunciation_focus: ["otimizar→ô-tji-mi-ZAR", "recursos→he-CUR-sus", "jeito→JÊi-tu", "grana→GRÃ-na"],
        pronunciation_focus_en: [
          "otimizar→oh-chee-mee-ZAR — 'ti' = 'chee'; formal 'to optimize'",
          "recursos→he-KOOR-soos — initial 'r' = 'h'; = resources",
          "jeito→ZHAY-too — 'dar um jeito' = to figure out / sort it out",
          "grana→GRAH-na — slang for money (= cash/dough)",
        ],
      },
      {
        en: "Ele mandou muito bem na entrevista, mas escorregou no português escrito.",
        vi: "Anh ấy làm cực tốt trong buổi phỏng vấn, nhưng lại trượt ở phần tiếng Bồ viết.",
        pronunciation_focus: ["mandou→man-DÔ", "entrevista→en-tre-VIS-ta", "escorregou→es-cô-he-GÔ", "escrito→es-CRI-tu"],
        pronunciation_focus_en: [
          "mandou→man-DOH — 'mandar bem' = to do great (slang); 'mandou muito bem'",
          "entrevista→en-tre-VEES-ta — = interview",
          "escorregou→es-ko-he-GOH — 'rr' = 'h'; 'escorregar' = to slip up",
          "escrito→es-KREE-too — = written; the formal-register pitfall",
        ],
      },
      {
        en: "Cabe-nos, enquanto cidadãos, exigir transparência dos poderes constituídos.",
        vi: "Phận sự của chúng ta, với tư cách công dân, là đòi hỏi sự minh bạch từ các quyền lực được thiết lập.",
        pronunciation_focus: ["cabe-nos→CA-bi-nus", "cidadãos→si-da-DÃUS", "exigir→e-zi-JIR", "constituídos→côns-ti-tu-I-dus"],
        pronunciation_focus_en: [
          "cabe-nos→KA-bee-noos — 'cabe-nos' = it falls to us (formal); enclitic pronoun",
          "cidadãos→see-da-DOWNS — '-ãos' = nasal 'owns'; = citizens",
          "exigir→eh-zee-ZHEER — 'x' = 'z'; 'gi' = 'zheer'; = to demand",
          "constituídos→kons-chee-too-EE-doos — 'os poderes constituídos' = the established powers",
        ],
      },
      {
        en: "Deixa de frescura e vai direto ao ponto — a gente não tem o dia todo.",
        vi: "Thôi đừng làm màu nữa, vào thẳng vấn đề đi — bọn mình đâu có cả ngày.",
        pronunciation_focus: ["frescura→fres-CU-ra", "direto→di-RÉ-tu", "ponto→PÔN-tu", "todo→TÔ-du"],
        pronunciation_focus_en: [
          "frescura→fres-KOO-ra — slang: 'deixa de frescura' = quit the fuss / drop the drama",
          "direto→jee-REH-too — 'ir direto ao ponto' = to get to the point",
          "ponto→PON-too — nasal 'on'; = point",
          "todo→TOH-doo — 'o dia todo' = the whole day",
        ],
      },
      {
        en: "Reitero, com a máxima deferência, que a proposta carece de fundamentação empírica.",
        vi: "Tôi xin nhắc lại, với sự kính cẩn tối đa, rằng đề xuất thiếu cơ sở thực nghiệm.",
        pronunciation_focus: ["reitero→hei-TÉ-ru", "deferência→de-fe-RÊN-sia", "carece→ca-RÉ-si", "empírica→en-PI-ri-ca"],
        pronunciation_focus_en: [
          "reitero→hay-TEH-roo — initial 'r' = 'h'; = I reiterate",
          "deferência→de-fe-REN-sya — nasal 'en'; = deference",
          "carece→ka-REH-see — 'carecer de' = to lack",
          "empírica→en-PEE-ree-ka — proparoxytone; = empirical",
        ],
      },
    ],
    cultural_notes_vi:
      "Năng lực C2 thực sự KHÔNG phải là luôn nói trang trọng — mà là CHUYỂN ĐỔI VĂN PHONG (mudar de registro) cho đúng tình huống. Người bản ngữ Brazil trượt mượt mà giữa ba tầng:\n\n(1) REGISTRO CULTO/FORMAL — họp, văn bản, nghị trường, học thuật. Dùng đại từ enclisis ('cabe-nos', 'reitero'), từ Latinh hóa ('otimizar', 'fundamentação', 'deferência'), câu phức. Xưng 'o senhor'.\n\n(2) REGISTRO COLOQUIAL/NEUTRO — đời thường, đồng nghiệp thân, mạng xã hội. 'A gente' thay 'nós', 'você', câu ngắn.\n\n(3) REGISTRO POPULAR/GÍRIA — bạn bè, vỉa hè. 'Grana' (tiền), 'mandar bem' (làm tốt), 'deixa de frescura' (thôi làm màu), 'dar um jeito' (xoay xở). Vùng miền khác nhau: 'mano' (SP), 'cara', 'véi'.\n\nDẤU HIỆU CỦA NGƯỜI THẬT SỰ THÀNH THẠO: biết KHI NÀO chuyển. Dùng gíria trong luận văn = ngây thơ. Dùng 'cabe-nos exigir' với bạn nhậu = kiểu cách lố. Pha trộn có chủ đích để gây cười hoặc nhấn mạnh thì lại là cao thủ ('vai direto ao ponto, por gentileza').\n\nKHÁC BIỆT VỚI VIỆT NAM: tiếng Việt báo register chủ yếu qua HỆ ĐẠI TỪ XƯNG HÔ (em/anh/chị/ông/bà/mày/tao) và tiểu từ cuối câu (ạ, nhé, đấy). Tiếng Bồ báo register qua TỪ VỰNG, CÚ PHÁP và VỊ TRÍ ĐẠI TỪ (proclisis/enclisis), không qua hệ xưng hô phong phú như vậy. Người Việt cần học 'nghe' tầng văn phong qua chính từ ngữ, không chờ một đại từ báo hiệu.",
    cultural_notes_en:
      "Real C2 isn't speaking formally all the time — it's SWITCHING REGISTER (mudar de registro) to fit the moment. Native Brazilians glide across three tiers: (1) culto/formal — meetings, documents, parliament, academia: enclitic pronouns ('cabe-nos', 'reitero'), Latinate words ('otimizar', 'deferência'), complex clauses, 'o senhor'. (2) coloquial/neutro — daily life, social media: 'a gente' for 'nós', short sentences. (3) popular/gíria — friends, the street: 'grana' (money), 'mandar bem' (to nail it), 'deixa de frescura', 'dar um jeito'. The mark of mastery is knowing WHEN to switch — slang in a thesis is naïve; 'cabe-nos exigir' at a bar is pompous; deliberate mixing for effect is expert. Unlike Vietnamese, which signals register mainly through its rich pronoun system and sentence-final particles, Portuguese signals it through vocabulary, syntax, and pronoun placement — so Vietnamese learners must learn to 'hear' the tier in the words themselves.",
    tip_advice_vi:
      "BÀI TẬP CHUYỂN VĂN PHONG: lấy một ý, nói ba cách.\n- Formal: 'Cabe-nos reconsiderar a estratégia.'\n- Neutro: 'A gente precisa repensar a estratégia.'\n- Popular: 'A gente tem que dar um jeito nesse plano.'\n\nTÍN HIỆU REGISTRO FORMAL (dùng khi viết/họp):\n- Enclisis/mesoclisis: 'cabe-nos', 'far-se-á', 'reitero-lhe'.\n- Liên từ trang trọng: 'outrossim' (hơn nữa), 'porquanto' (bởi vì), 'destarte' (do đó), 'não obstante'.\n- Động từ Latinh: 'reiterar', 'carecer de', 'otimizar', 'subscrever'.\n\nTÍN HIỆU REGISTRO POPULAR (chỉ dùng với bạn thân):\n- 'grana' (tiền), 'rolê' (đi chơi), 'mano/cara/véi' (ông, mày), 'top' / 'da hora' (đỉnh), 'pô' (cảm thán).\n- 'tipo', 'sei lá', 'né?', 'então' đệm câu.\n\nMẸO AN TOÀN cho người học: khi không chắc, chọn REGISTRO NEUTRO ('a gente', 'precisar', câu rõ ràng). Nó hiếm khi sai ở đâu. Chỉ dùng gíria khi bạn đã nghe người Brazil dùng nó với bạn TRƯỚC.\n\nTRÁNH: học gíria từ phim rồi dùng với cấp trên; trộn 'véi' vào email công việc; dùng 'outrossim' trong tin nhắn cho bạn (nghe như robot).",
    tip_advice_en:
      "Drill register-switching: say one idea three ways — formal 'Cabe-nos reconsiderar a estratégia', neutral 'A gente precisa repensar a estratégia', popular 'A gente tem que dar um jeito nesse plano'. Formal cues (writing/meetings): enclisis/mesoclisis ('cabe-nos', 'far-se-á'), formal connectives ('outrossim', 'porquanto', 'não obstante'), Latinate verbs ('reiterar', 'carecer de'). Popular cues (close friends only): 'grana', 'rolê', 'mano/cara', 'top/da hora', fillers 'tipo', 'sei lá', 'né?'. Safe default for learners: when unsure, pick the NEUTRAL tier ('a gente', clear sentences) — it's rarely wrong anywhere; only use slang after you've heard a Brazilian use it WITH you first. Avoid: slang from films aimed at a boss; 'véi' in a work email; 'outrossim' in a text to a friend (sounds robotic).",
    vocabulary: [
      { word: "o registro", en: "the register (level of formality)", vi: "văn phong, ngữ vực", pos: "n.m.", pronunciation_vi: "he-JIS-tru", pronunciation_en: "he-ZHEES-troo — 'mudar de registro' = to switch register" },
      { word: "culto / erudito", en: "highbrow / erudite (register)", vi: "(văn phong) bác học", pos: "adj.", pronunciation_vi: "CUU-tu / e-ru-DJI-tu", pronunciation_en: "KOOL-too / eh-roo-JEE-too" },
      { word: "coloquial", en: "colloquial", vi: "thông tục, đời thường", pos: "adj.", pronunciation_vi: "cô-lô-kui-AU", pronunciation_en: "ko-lo-kwee-OW — final '-al' = 'ow'" },
      { word: "a gíria", en: "slang", vi: "tiếng lóng", pos: "n.f.", pronunciation_vi: "JI-ria", pronunciation_en: "ZHEE-rya — the popular/street tier" },
      { word: "a grana", en: "money (slang)", vi: "tiền (lóng)", pos: "n.f.", pronunciation_vi: "GRÃ-na", pronunciation_en: "GRAH-na — cash/dough" },
      { word: "dar um jeito", en: "to find a way / sort it out", vi: "xoay xở, lo liệu", pos: "expr.", pronunciation_vi: "dar un JÊi-tu", pronunciation_en: "dar oon ZHAY-too — the quintessential Brazilian fix-it phrase" },
      { word: "mandar bem", en: "to do great / nail it (slang)", vi: "làm cực tốt", pos: "expr.", pronunciation_vi: "man-DAR bein", pronunciation_en: "man-DAR beng" },
      { word: "outrossim", en: "moreover / furthermore (formal)", vi: "hơn nữa (trang trọng)", pos: "adv.", pronunciation_vi: "ô-trô-SIN", pronunciation_en: "oh-tro-SEENG — very formal connective" },
      { word: "carecer de", en: "to lack (formal)", vi: "thiếu (trang trọng)", pos: "v.", pronunciation_vi: "ca-re-SER dji", pronunciation_en: "ka-re-SEHR jee" },
      { word: "deixa de frescura", en: "quit the fuss / drop the drama (slang)", vi: "thôi làm màu", pos: "expr.", pronunciation_vi: "DÊi-xa dji fres-CU-ra", pronunciation_en: "DAY-sha jee fres-KOO-ra" },
    ],
    dialogue: [
      { speaker: "Formal (na reunião)", text: "Cabe-nos otimizar os recursos disponíveis antes de solicitar verba adicional.", vi: "Phận sự của chúng ta là tối ưu nguồn lực hiện có trước khi xin thêm ngân sách.", en: "It falls to us to optimize available resources before requesting more budget." },
      { speaker: "Neutro (com colega)", text: "A gente precisa repensar como usar a grana antes de pedir mais.", vi: "Bọn mình cần nghĩ lại cách dùng tiền trước khi xin thêm.", en: "We need to rethink how we use the money before asking for more." },
      { speaker: "Popular (com amigo)", text: "Pô, deixa de frescura — a gente dá um jeito nessa grana, relaxa.", vi: "Trời, thôi làm màu đi — bọn mình xoay được khoản tiền đó mà, bình tĩnh.", en: "Come on, drop the drama — we'll sort the money out, chill." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Quando não tenho certeza do contexto, escolho o registro ___: nem formal demais, nem gíria.",
        answer: "neutro",
        hint_vi: "tầng văn phong an toàn ở giữa",
        hint_en: "the safe middle tier of formality",
      },
      {
        type: "matching",
        pairs: [
          ["a grana", "tiền (lóng)"],
          ["dar um jeito", "xoay xở"],
          ["outrossim", "hơn nữa (trang trọng)"],
          ["carecer de", "thiếu (trang trọng)"],
        ],
        instruction: "Nối từ/cụm với nghĩa tiếng Việt và để ý tầng văn phong.",
        instruction_en: "Match each word/phrase to its Vietnamese meaning, noting its register tier.",
      },
      {
        type: "translation",
        vietnamese: "Thôi làm màu đi, vào thẳng vấn đề — bọn mình đâu có cả ngày.",
        portuguese: "Deixa de frescura e vai direto ao ponto — a gente não tem o dia todo.",
        english: "Quit the fuss and get to the point — we don't have all day.",
        hint_vi: "register POPULAR; 'a gente' = chúng ta (thân mật)",
        hint_en: "POPULAR register; 'a gente' = we (informal, takes 3rd-person singular verb)",
      },
    ],
  },

  // ── 5. Academic and intellectual discourse ────────────────────────────────
  {
    id: "portuguese_c2_discurso_academico",
    level: "C2",
    category: "academic",
    title_vi: "Diễn ngôn học thuật: trình bày, phản biện và bảo vệ luận điểm",
    title_en: "Academic discourse: presenting, critiquing and defending an argument",
    sentences: [
      {
        en: "A hipótese que pretendo defender pressupõe que os dados disponíveis não sejam meramente anedóticos.",
        vi: "Giả thuyết tôi định bảo vệ giả định rằng dữ liệu hiện có không chỉ mang tính giai thoại.",
        pronunciation_focus: ["hipótese→i-PÓ-te-zi", "pressupõe→pre-su-PÕin", "anedóticos→a-ne-DÓ-tji-cus", "disponíveis→djis-pô-NI-veis"],
        pronunciation_focus_en: [
          "hipótese→ee-POH-te-zee — silent 'h'; proparoxytone on 'PÓ'",
          "pressupõe→pre-soo-POYNG — nasal diphthong '-õe'; = presupposes",
          "anedóticos→a-ne-DOH-chee-koos — proparoxytone; = anecdotal",
          "disponíveis→jees-po-NEE-vays — '-eis' = 'vays'; = available",
        ],
      },
      {
        en: "Os autores que se debruçaram sobre o tema chegaram, contudo, a conclusões divergentes.",
        vi: "Các tác giả đã nghiền ngẫm về chủ đề này, tuy vậy, lại đi đến những kết luận khác nhau.",
        pronunciation_focus: ["debruçaram→de-bru-SA-rãu", "contudo→côn-TU-du", "conclusões→côn-clu-ZÕins", "divergentes→di-ver-JÊN-tjis"],
        pronunciation_focus_en: [
          "debruçaram→de-broo-SA-rowng — 'debruçar-se sobre' = to delve into",
          "contudo→kong-TOO-doo — formal 'however'; nasal 'on'",
          "conclusões→kong-kloo-ZOYNS — '-ões' = nasal 'oyns'; = conclusions",
          "divergentes→dee-ver-ZHEN-chees — 'g' = 'zh'; = divergent",
        ],
      },
      {
        en: "Cumpre ressalvar que a amostra, por ser reduzida, limita o alcance das generalizações.",
        vi: "Cần lưu ý rằng mẫu, vì nhỏ, hạn chế phạm vi của các khái quát hóa.",
        pronunciation_focus: ["cumpre→CUM-pri", "ressalvar→he-sau-VAR", "amostra→a-MOS-tra", "generalizações→je-ne-ra-li-za-SÕins"],
        pronunciation_focus_en: [
          "cumpre→KOOM-pree — 'cumpre ressalvar que' = it must be noted that (formal)",
          "ressalvar→he-sow-VAR — 'rr' = 'h'; = to qualify/caveat",
          "amostra→a-MOS-tra — = the sample",
          "generalizações→zhe-ne-ra-lee-za-ZOYNS — long word; nasal '-ões' end",
        ],
      },
      {
        en: "Não pretendo esgotar o assunto, mas tão somente apontar uma lacuna na bibliografia existente.",
        vi: "Tôi không định bàn cạn vấn đề, mà chỉ cốt chỉ ra một lỗ hổng trong thư mục tham khảo hiện có.",
        pronunciation_focus: ["esgotar→es-gô-TAR", "tão somente→tãu sô-MÊN-tji", "lacuna→la-CU-na", "bibliografia→bi-bli-ô-gra-FI-a"],
        pronunciation_focus_en: [
          "esgotar→es-go-TAR — 'esgotar o assunto' = to exhaust the topic",
          "tão somente→towng so-MEN-chee — = solely / merely (formal)",
          "lacuna→la-KOO-na — = gap (in the literature)",
          "bibliografia→bee-blee-o-gra-FEE-a — = bibliography/literature",
        ],
      },
      {
        en: "Reservo-me o direito de reavaliar essa posição à luz de novas evidências.",
        vi: "Tôi giữ cho mình quyền đánh giá lại lập trường ấy dưới ánh sáng của những bằng chứng mới.",
        pronunciation_focus: ["reservo-me→he-ZER-vu-mi", "reavaliar→he-a-va-li-AR", "posição→pô-zi-SÃU", "evidências→e-vi-DÊN-sias"],
        pronunciation_focus_en: [
          "reservo-me→he-ZEHR-voo-mee — enclitic 'me'; 'reservar-se o direito' = to reserve the right",
          "reavaliar→he-a-va-lee-AR — 're-' + avaliar; = to reassess",
          "posição→po-zee-SOWNG — nasal '-ção'; = position/stance",
          "evidências→eh-vee-DEN-syas — 'à luz de novas evidências' = in light of new evidence",
        ],
      },
    ],
    cultural_notes_vi:
      "DIỄN NGÔN HỌC THUẬT Brazil (defesa de tese, banca, congresso, artigo) đòi hỏi giọng KHIÊM TỐN-MÀ-VỮNG: bạn khẳng định mạnh nhưng luôn cài hedges (ressalvas) để không bị bắt bẻ. Đây là nghịch lý của C2 học thuật: tự tin được thể hiện QUA sự thận trọng, không phải qua quả quyết tuyệt đối.\n\nCÔNG THỨC KHIÊM TỐN HỌC THUẬT (modéstia acadêmica):\n- 'Não pretendo esgotar o assunto, mas apenas…' (Tôi không định bàn cạn, mà chỉ…).\n- 'Cumpre ressalvar que…' (Cần lưu ý rằng…) — cài caveat trước khi ai khác cài.\n- 'Reservo-me o direito de reavaliar…' (Tôi giữ quyền đánh giá lại…) — thừa nhận tính tạm thời của tri thức.\n\nDEFESA DE TESE (bảo vệ luận văn): ở Brazil, banca (hội đồng) sẽ chất vấn gay gắt — đó là nghi thức, không phải thù địch. Cách đáp chuẩn: 'Agradeço a observação. De fato, …' (Cảm ơn nhận xét. Quả thực, …) — luôn cảm ơn TRƯỚC khi đáp, kể cả khi phản bác. Không bao giờ phòng thủ kiểu cãi cùn.\n\nDẪN NGUỒN: 'Segundo Fulano (2020)…' (Theo X…), 'Conforme aponta…' (Như X chỉ ra…), 'Em consonância com…' (Đồng nhịp với…), 'Em contraposição a…' (Trái với…).\n\nKHÁC BIỆT VỚI VIỆT NAM: học thuật Việt Nam đôi khi coi việc chất vấn người trên/hội đồng là bất kính. Trong banca Brazil, KHÔNG phản biện lại được coi là yếu — họ MUỐN bạn bảo vệ lập điểm. Nhưng phải bảo vệ bằng chứng cứ và sự nhã nhặn ('Agradeço, porém os dados sugerem…'), không bằng cảm xúc hay thẩm quyền.",
    cultural_notes_en:
      "Brazilian academic discourse (thesis defense, panel, conference, paper) demands a humble-yet-firm voice: you assert strongly but always hedge (ressalvas) so you can't be cornered. The paradox of academic C2 is that confidence shows THROUGH caution, not through absolute certainty. Modesty formulas: 'Não pretendo esgotar o assunto, mas apenas…', 'Cumpre ressalvar que…' (caveat yourself before anyone else does), 'Reservo-me o direito de reavaliar…' (acknowledge knowledge is provisional). In a defesa de tese the banca grills you hard — that's ritual, not hostility; always thank first, then answer ('Agradeço a observação. De fato…'), never get defensive. Cite with 'Segundo Fulano (2020)…', 'Conforme aponta…', 'Em contraposição a…'. Unlike some Vietnamese norms where challenging a panel feels disrespectful, NOT pushing back in a banca reads as weak — they WANT you to defend your point, but with evidence and courtesy, not emotion or authority.",
    tip_advice_vi:
      "BỘ KHUNG TRÌNH BÀY HỌC THUẬT (a estrutura da exposição):\n(1) Đặt vấn đề: 'O presente trabalho propõe-se a investigar…' (Công trình này nhằm khảo sát…).\n(2) Hipótese: 'Parte-se da hipótese de que…' (Xuất phát từ giả thuyết rằng…).\n(3) Phương pháp: 'Para tanto, recorreu-se a…' (Để làm vậy, đã dùng…).\n(4) Caveat: 'Cumpre ressalvar que…'.\n(5) Đóng góp: 'Pretende-se, assim, contribuir para…' (Qua đó nhằm góp phần vào…).\n\nĐỘNG TỪ VÔ NHÂN XƯNG (voz impessoal) là dấu hiệu cốt lõi của văn học thuật Bồ — dùng 'se' thay 'tôi': 'parte-se de…', 'recorreu-se a…', 'observa-se que…', 'conclui-se que…'. Nó làm câu khách quan hơn 'eu'.\n\nĐÁP CHẤT VẤN trong banca:\n- Đồng ý: 'Pertinente a observação. De fato, …'\n- Không đồng ý: 'Compreendo o ponto, contudo os dados sugerem o contrário.'\n- Chưa rõ: 'Trata-se de uma limitação que reconheço e pretendo abordar em trabalhos futuros.' (Đây là một hạn chế tôi thừa nhận và sẽ xử lý trong các công trình sau.)\n\nTRÁNH: khẳng định tuyệt đối ('isso prova definitivamente que…') — học thuật ưa 'os dados sugerem/indicam'. Phòng thủ cảm tính khi bị hỏi khó. Dùng 'eu acho' (tôi nghĩ) — quá yếu cho register này; dùng 'argumenta-se que' / 'sustenta-se que' (lập luận rằng).",
    tip_advice_en:
      "Academic presentation frame: (1) frame the problem 'O presente trabalho propõe-se a investigar…'; (2) hypothesis 'Parte-se da hipótese de que…'; (3) method 'Para tanto, recorreu-se a…'; (4) caveat 'Cumpre ressalvar que…'; (5) contribution 'Pretende-se contribuir para…'. The impersonal voice (voz impessoal) with 'se' is the core marker of academic Portuguese — 'parte-se de…', 'observa-se que…', 'conclui-se que…' — more objective than 'eu'. Fielding questions in a banca: agree 'Pertinente a observação. De fato…'; disagree 'Compreendo o ponto, contudo os dados sugerem o contrário'; concede 'Trata-se de uma limitação que reconheço e pretendo abordar em trabalhos futuros'. Avoid absolutes ('isso prova definitivamente') — prefer 'os dados sugerem/indicam'; avoid emotional defensiveness and weak 'eu acho' — use 'argumenta-se que' / 'sustenta-se que'.",
    vocabulary: [
      { word: "a hipótese", en: "the hypothesis", vi: "giả thuyết", pos: "n.f.", pronunciation_vi: "i-PÓ-te-zi", pronunciation_en: "ee-POH-te-zee — proparoxytone; silent 'h'" },
      { word: "a ressalva", en: "the caveat / qualification", vi: "lời lưu ý, dè dặt", pos: "n.f.", pronunciation_vi: "he-SAU-va", pronunciation_en: "he-SOW-va — 'fazer uma ressalva' = to add a caveat" },
      { word: "a amostra", en: "the sample (data)", vi: "mẫu (dữ liệu)", pos: "n.f.", pronunciation_vi: "a-MOS-tra", pronunciation_en: "a-MOS-tra" },
      { word: "a lacuna", en: "the gap (in the literature)", vi: "lỗ hổng (nghiên cứu)", pos: "n.f.", pronunciation_vi: "la-CU-na", pronunciation_en: "la-KOO-na — 'apontar uma lacuna' = to identify a gap" },
      { word: "debruçar-se (sobre)", en: "to delve into / study closely", vi: "nghiền ngẫm về", pos: "v.", pronunciation_vi: "de-bru-SAR-si", pronunciation_en: "de-broo-SAR-see — lit. 'to lean over'" },
      { word: "cumpre ressalvar que", en: "it must be noted that", vi: "cần lưu ý rằng", pos: "expr.", pronunciation_vi: "CUM-pri he-sau-VAR ki", pronunciation_en: "KOOM-pree he-sow-VAR kee" },
      { word: "contudo", en: "however / nevertheless", vi: "tuy vậy", pos: "conj.", pronunciation_vi: "côn-TU-du", pronunciation_en: "kong-TOO-doo — formal 'however'" },
      { word: "esgotar o assunto", en: "to exhaust the topic", vi: "bàn cạn vấn đề", pos: "expr.", pronunciation_vi: "es-gô-TAR u a-SUN-tu", pronunciation_en: "es-go-TAR oo a-SOON-too" },
      { word: "reservar-se o direito", en: "to reserve the right", vi: "giữ quyền", pos: "v.", pronunciation_vi: "he-zer-VAR-si u di-RÊi-tu", pronunciation_en: "he-zer-VAR-see oo jee-RAY-too" },
      { word: "sustentar (uma tese)", en: "to uphold / argue (a thesis)", vi: "bảo vệ, chống đỡ (luận điểm)", pos: "v.", pronunciation_vi: "sus-ten-TAR", pronunciation_en: "soos-ten-TAR — 'sustenta-se que' = it is argued that" },
    ],
    dialogue: [
      { speaker: "Membro da banca", text: "A sua amostra não seria pequena demais para sustentar uma generalização tão ampla?", vi: "Mẫu của bạn liệu có quá nhỏ để chống đỡ một khái quát rộng như vậy không?", en: "Isn't your sample too small to support such a broad generalization?" },
      { speaker: "Candidato(a)", text: "Pertinente a observação. De fato, cumpre ressalvar que a amostra limita o alcance — por isso falo em indícios, não em prova.", vi: "Nhận xét rất xác đáng. Quả thực, cần lưu ý mẫu hạn chế phạm vi — vì thế tôi nói là dấu hiệu, không phải bằng chứng.", en: "A fair point. Indeed, I must note the sample limits the scope — which is why I speak of indications, not proof." },
      { speaker: "Membro da banca", text: "Como o senhor pretende contornar essa limitação em pesquisas futuras?", vi: "Ngài định khắc phục hạn chế đó trong các nghiên cứu sau bằng cách nào?", en: "How do you intend to overcome that limitation in future research?" },
      { speaker: "Candidato(a)", text: "Reservo-me o direito de reavaliar a hipótese à luz de uma amostra ampliada e de novas evidências.", vi: "Tôi giữ quyền đánh giá lại giả thuyết dưới ánh sáng của một mẫu mở rộng và bằng chứng mới.", en: "I reserve the right to reassess the hypothesis in light of a larger sample and new evidence." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Cumpre ___ que a amostra, por ser reduzida, limita o alcance das conclusões.",
        answer: "ressalvar",
        hint_vi: "động từ nghĩa 'lưu ý/dè dặt', đi với 'cumpre … que'",
        hint_en: "the verb meaning 'to caveat/qualify', paired with 'cumpre … que'",
      },
      {
        type: "matching",
        pairs: [
          ["a hipótese", "giả thuyết"],
          ["a ressalva", "lời lưu ý"],
          ["a lacuna", "lỗ hổng nghiên cứu"],
          ["debruçar-se sobre", "nghiền ngẫm về"],
        ],
        instruction: "Nối thuật ngữ học thuật với nghĩa tiếng Việt.",
        instruction_en: "Match each academic term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Tôi không định bàn cạn vấn đề, mà chỉ cốt chỉ ra một lỗ hổng trong thư mục hiện có.",
        portuguese: "Não pretendo esgotar o assunto, mas tão somente apontar uma lacuna na bibliografia existente.",
        english: "I do not intend to exhaust the topic, but merely to point out a gap in the existing literature.",
        hint_vi: "công thức khiêm tốn học thuật; 'tão somente' = chỉ cốt (trang trọng)",
        hint_en: "academic-modesty formula; 'tão somente' = solely/merely (formal)",
      },
    ],
  },
];

export default lessons;
