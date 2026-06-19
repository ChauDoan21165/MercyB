// src/languages/italian/extra/audio-shadowing-30-day-bootcamp.ts
//
// Italian audio-shadowing 30-day bootcamp for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/H1-italian-audio-shadowing-30-day-bootcamp.md.
//
// Shadowing = listening and speaking almost simultaneously. This 30-day
// progression builds Italian rhythm, final vowels, stress, double consonants,
// and automatic chunks for daily life, work, offices, and exams. The 24 daily
// shadowing lines (the days that carry real Italian) become `sentences`; the
// six review / recording days are folded into `exercises` + `content`.
//
// Shape mirrors the French lessons-a1.ts pattern (LessonSentence / VocabEntry /
// Exercise) so the page UI stays consistent across verticals. Types are inlined
// because src/languages/italian/lessons.ts does not exist yet — keep this file
// self-contained until the Italian registry lands.
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-speaker (L1) note, `pronunciation_focus_en` the
// English-speaker companion.

export type LessonSentence = {
  en: string;
  vi: string;
  // L1 = Vietnamese-speaker pronunciation notes.
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

// Loosely typed so per-type fields (fill-blank, matching, drill) can vary.
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
  id: "italian_audio_shadowing_30_day_bootcamp",
  category: "pronunciation",
  level: "A2",
  title_vi: "Bootcamp shadowing tiếng Ý 30 ngày",
  title_en: "Italian audio shadowing 30-day bootcamp",

  sentences: [
    // ── Week 1: Survival Rhythm (Days 1–6) ──────────────────────────────
    {
      en: "Buongiorno, mi chiamo Linh e vengo dal Vietnam.",
      vi: "Xin chào, tôi tên Linh và đến từ Việt Nam.",
      pronunciation_focus: [
        "'chiamo' = 'KYA-mo': 'chi' đọc là 'k' + 'ya', KHÔNG đọc như 'chi' tiếng Anh",
        "'gio' trong 'Buongiorno' = 'jô' (g mềm)",
        "Giữ đủ nguyên âm cuối: Buongiorn-O, chiam-O, veng-O",
      ],
      pronunciation_focus_en: [
        "'chiamo' = 'KYA-mo': 'chi' is 'k' + 'ya', never the English 'ch'",
        "'gio' in 'Buongiorno' = 'jo' (soft g)",
        "Keep every final vowel sounding: Buongiorn-O, chiam-O, veng-O",
      ],
    },
    {
      en: "Vivo in Italia da sei mesi e studio italiano ogni giorno.",
      vi: "Tôi sống ở Ý sáu tháng và học tiếng Ý mỗi ngày.",
      pronunciation_focus: [
        "'gni' trong 'ogni' = 'nhi' (gn đọc như 'nh' tiếng Việt): O-nhi",
        "Nhấn đúng: i-TA-lia, stu-dio, i-ta-LIA-no",
        "Đừng đọc cụt 'mesi' thành 'mes' — giữ -i cuối",
      ],
      pronunciation_focus_en: [
        "'gni' in 'ogni' = 'ny' as in 'canyon': O-nyee",
        "Stress: i-TA-lia, STU-dio, i-ta-LIA-no",
        "Don't clip 'mesi' to 'mes' — keep the final -i",
      ],
    },
    {
      en: "Non ho capito bene. Può ripetere più lentamente?",
      vi: "Tôi chưa hiểu rõ. Ông/bà nhắc lại chậm hơn được không?",
      pronunciation_focus: [
        "'ho' = 'ô': h luôn câm trong tiếng Ý",
        "'Può' = 'pwò', 'più' = 'pyù' — lướt nhanh qua 'u'",
        "'lentamente' có chữ 't' đơn, đọc nhẹ; đừng kéo dài",
      ],
      pronunciation_focus_en: [
        "'ho' = 'oh': the 'h' is always silent in Italian",
        "'Può' = 'pwò', 'più' = 'pyù' — glide quickly over the 'u'",
        "'lentamente' has a single 't' — short, not doubled",
      ],
    },
    {
      en: "Ho un appuntamento alle nove e trenta.",
      vi: "Tôi có hẹn lúc chín giờ ba mươi.",
      pronunciation_focus: [
        "Phụ âm đôi phải kéo dài: appuntamento (pp), alle (ll)",
        "'pp' nghe như chặn hơi một nhịp rồi bật ra: ap-pun-ta-MEN-to",
        "'trenta' nhấn đầu: TREN-ta",
      ],
      pronunciation_focus_en: [
        "Hold the double consonants longer: appuntamento (pp), alle (ll)",
        "'pp' = a tiny held pause before release: ap-pun-ta-MEN-to",
        "'trenta' stresses the first syllable: TREN-ta",
      ],
    },
    {
      en: "Devo andare al lavoro, ma il treno è in ritardo.",
      vi: "Tôi phải đi làm, nhưng tàu bị trễ.",
      pronunciation_focus: [
        "'r' tiếng Ý là âm rung đầu lưỡi: lavoro, treno, ritardo",
        "Đừng đọc 'r' yếu kiểu tiếng Anh — phải nghe rõ rung",
        "Giữ nguyên âm cuối: andar-E, lavor-O, ritard-O",
      ],
      pronunciation_focus_en: [
        "Italian 'r' is a tapped/trilled tongue-tip 'r': lavoro, treno, ritardo",
        "Don't use the weak English 'r' — let it tap or roll",
        "Keep the final vowels: andar-E, lavor-O, ritard-O",
      ],
    },
    {
      en: "Vorrei un caffè e un bicchiere d'acqua, per favore.",
      vi: "Tôi muốn một cà phê và một ly nước.",
      pronunciation_focus: [
        "'Vorrei' có 'rr' rung mạnh hơn 'r' đơn; 'caffè' có 'ff' kéo dài",
        "'bicchiere' = 'bik-KYE-re' (cch = 'kk'); 'acqua' = 'AK-kwa'",
        "'caffè' có dấu — nhấn âm cuối: caf-FÈ",
      ],
      pronunciation_focus_en: [
        "'Vorrei' has a strong trilled 'rr'; 'caffè' has a long 'ff'",
        "'bicchiere' = 'bik-KYE-re' (cch = 'kk'); 'acqua' = 'AK-kwa'",
        "'caffè' carries an accent — stress the last syllable: caf-FÈ",
      ],
    },

    // ── Week 2: Work And Offices (Days 8–13) ────────────────────────────
    {
      en: "Posso chiederle una cosa sul turno di domani?",
      vi: "Tôi hỏi ông/bà một việc về ca ngày mai được không?",
      pronunciation_focus: [
        "'Posso' có 'ss' đôi — kéo dài; đừng đọc thành 'Poso'",
        "'chiederle' = 'kye-DER-le' (chi = 'kye')",
        "'cosa' có 's' giữa hai nguyên âm, đọc nhẹ như 'z': CÔ-za",
      ],
      pronunciation_focus_en: [
        "'Posso' has a long double 'ss' — don't reduce it to 'Poso'",
        "'chiederle' = 'kye-DER-le' (chi = 'kye')",
        "'cosa' has an intervocalic 's' softened toward 'z': CO-za",
      ],
    },
    {
      en: "Non sono sicuro di aver capito la procedura.",
      vi: "Tôi không chắc đã hiểu quy trình.",
      pronunciation_focus: [
        "'r' rung đầu lưỡi: sicuro, procedura, aver",
        "Nhấn đúng: si-CU-ro, pro-ce-DU-ra, ca-PI-to",
        "Giữ nguyên âm cuối -o, -a, đừng nuốt",
      ],
      pronunciation_focus_en: [
        "Tapped tongue-tip 'r': sicuro, procedura, aver",
        "Stress: si-CU-ro, pro-ce-DU-ra, ca-PI-to",
        "Keep the final -o / -a; don't swallow them",
      ],
    },
    {
      en: "Mi può mandare una conferma scritta?",
      vi: "Ông/bà gửi xác nhận bằng văn bản được không?",
      pronunciation_focus: [
        "'può' = 'pwò' (lướt qua 'u')",
        "'scritta' = 'SKRIT-ta': 'sc' trước phụ âm đọc 'sk', 'tt' kéo dài",
        "'mandare' nhấn giữa: man-DA-re",
      ],
      pronunciation_focus_en: [
        "'può' = 'pwò' (glide over the 'u')",
        "'scritta' = 'SKRIT-ta': 'sc' before a consonant is 'sk', and hold the 'tt'",
        "'mandare' stresses the middle: man-DA-re",
      ],
    },
    {
      en: "Devo consegnare questi documenti al Comune.",
      vi: "Tôi phải nộp các giấy tờ này ở Comune.",
      pronunciation_focus: [
        "'gn' trong 'consegnare' = 'nh': con-se-NHA-re",
        "'qu' trong 'questi' = 'kw': KWE-sti",
        "Nhấn đúng: do-cu-MEN-ti, co-MU-ne",
      ],
      pronunciation_focus_en: [
        "'gn' in 'consegnare' = 'ny': con-se-NYA-re",
        "'qu' in 'questi' = 'kw': KWE-stee",
        "Stress: do-cu-MEN-ti, co-MU-ne",
      ],
    },
    {
      en: "La mia pratica è ancora in lavorazione.",
      vi: "Hồ sơ của tôi vẫn đang xử lý.",
      pronunciation_focus: [
        "'zio' trong 'lavorazione' = 'tsyô': la-vo-ra-TSYÔ-ne",
        "'r' rung: pratica, ancora, lavorazione",
        "Nhấn đầu: PRA-ti-ca",
      ],
      pronunciation_focus_en: [
        "'zio' in 'lavorazione' = 'tsyo': la-vo-ra-TSYO-ne",
        "Tapped 'r': pratica, ancora, lavorazione",
        "First-syllable stress: PRA-ti-ca",
      ],
    },
    {
      en: "Vorrei sapere quali documenti sono necessari.",
      vi: "Tôi muốn biết cần giấy tờ nào.",
      pronunciation_focus: [
        "'Vorrei' (rr rung), 'necessari' (ss đôi kéo dài)",
        "'qu' trong 'quali' = 'kw': KWA-li",
        "Nhấn: sa-PE-re, ne-ces-SA-ri",
      ],
      pronunciation_focus_en: [
        "'Vorrei' (trilled rr), 'necessari' (long double ss)",
        "'qu' in 'quali' = 'kw': KWA-lee",
        "Stress: sa-PE-re, ne-ces-SA-ri",
      ],
    },

    // ── Week 3: Problems And Politeness (Days 15–20) ────────────────────
    {
      en: "C'è un problema con la consegna. Il pacco è danneggiato.",
      vi: "Có vấn đề với giao hàng. Kiện hàng bị hỏng.",
      pronunciation_focus: [
        "'gn' trong 'consegna' = 'nh': con-SE-nha",
        "'ggi' trong 'danneggiato' = 'jja' (g mềm, đôi): dan-neg-JA-to",
        "'cc' trong 'pacco' = 'kk' kéo dài: PAK-ko",
      ],
      pronunciation_focus_en: [
        "'gn' in 'consegna' = 'ny': con-SE-nya",
        "'ggi' in 'danneggiato' = doubled soft 'j': dan-neg-JA-to",
        "'cc' in 'pacco' = long 'kk': PAK-ko",
      ],
    },
    {
      en: "Da ieri sera non c'è acqua calda nell'appartamento.",
      vi: "Từ tối qua không có nước nóng trong căn hộ.",
      pronunciation_focus: [
        "'acqua' = 'AK-kwa' (cq = âm 'k' đôi)",
        "Phụ âm đôi: appartamento (pp), nell' (ll) — kéo dài",
        "'ieri' = 'YE-ri'; 'r' rung trong sera, ieri",
      ],
      pronunciation_focus_en: [
        "'acqua' = 'AK-kwa' (cq = a doubled 'k')",
        "Doubles: appartamento (pp), nell' (ll) — hold them",
        "'ieri' = 'YE-ree'; tapped 'r' in sera, ieri",
      ],
    },
    {
      en: "Penso che ci sia stato un malinteso sul turno.",
      vi: "Tôi nghĩ đã có hiểu lầm về ca làm.",
      pronunciation_focus: [
        "'che' = 'ke' (ch trước e/i đọc 'k'): KE",
        "'ci' = 'chi' mềm: chi-a",
        "Giữ nguyên âm cuối: PEN-so, ma-lin-TE-so",
      ],
      pronunciation_focus_en: [
        "'che' = 'ke' (ch before e/i is hard 'k')",
        "'ci' = soft 'chee'",
        "Keep the final vowels: PEN-so, ma-lin-TE-so",
      ],
    },
    {
      en: "Vorrei chiedere un rimborso o una sostituzione.",
      vi: "Tôi muốn yêu cầu hoàn tiền hoặc đổi hàng.",
      pronunciation_focus: [
        "'chi' trong 'chiedere' = 'kye': KYE-de-re",
        "'zio' trong 'sostituzione' = 'tsyô': so-sti-tu-TSYÔ-ne",
        "'Vorrei' rr rung; 'rimborso' r rung",
      ],
      pronunciation_focus_en: [
        "'chi' in 'chiedere' = 'kye': KYE-de-re",
        "'zio' in 'sostituzione' = 'tsyo': so-sti-tu-TSYO-ne",
        "'Vorrei' trilled rr; 'rimborso' tapped r",
      ],
    },
    {
      en: "Possiamo trovare una soluzione entro oggi?",
      vi: "Chúng ta có thể tìm giải pháp trong hôm nay không?",
      pronunciation_focus: [
        "'Possiamo' (ss đôi); 'oggi' = 'OD-ji' (gg mềm, đôi)",
        "'zio' trong 'soluzione' = 'tsyô': so-lu-TSYÔ-ne",
        "'r' rung trong trovare, entro",
      ],
      pronunciation_focus_en: [
        "'Possiamo' (double ss); 'oggi' = 'OD-jee' (doubled soft 'gg')",
        "'zio' in 'soluzione' = 'tsyo': so-lu-TSYO-ne",
        "Tapped 'r' in trovare, entro",
      ],
    },
    {
      en: "Mi dispiace per l'errore. La prossima volta chiederò conferma.",
      vi: "Tôi xin lỗi về lỗi. Lần sau tôi sẽ hỏi xác nhận.",
      pronunciation_focus: [
        "'dispiace' = 'di-SPYA-che' (ci = 'che' mềm)",
        "Phụ âm đôi: errore (rr), prossima (ss) — kéo dài",
        "'chiederò' có dấu, nhấn cuối: kye-de-RÒ",
      ],
      pronunciation_focus_en: [
        "'dispiace' = 'di-SPYA-che' (ci = soft 'che')",
        "Doubles: errore (rr), prossima (ss) — hold them",
        "'chiederò' is accented — stress the last syllable: kye-de-RÒ",
      ],
    },

    // ── Week 4: Exam And Fluency (Days 22–27) ───────────────────────────
    {
      en: "Secondo me, imparare l'italiano è fondamentale per vivere meglio.",
      vi: "Theo tôi, học tiếng Ý rất quan trọng để sống tốt hơn.",
      pronunciation_focus: [
        "'gli' trong 'meglio' = 'lyô' (gl + i = 'l' mềm): ME-lyô",
        "'r' rung: imparare, vivere, fondamentale",
        "Nhấn: im-pa-RA-re, fon-da-men-TA-le",
      ],
      pronunciation_focus_en: [
        "'gli' in 'meglio' = 'lyo' (palatal 'l'): ME-lyo",
        "Tapped 'r': imparare, vivere, fondamentale",
        "Stress: im-pa-RA-re, fon-da-men-TA-le",
      ],
    },
    {
      en: "Da un lato è difficile, dall'altro mi dà più opportunità.",
      vi: "Một mặt khó, mặt khác cho tôi nhiều cơ hội.",
      pronunciation_focus: [
        "Phụ âm đôi: difficile (ff), dall' (ll), opportunità (pp)",
        "'più' = 'pyù'; 'dà' và 'è' có dấu (nhấn rõ)",
        "'opportunità' nhấn âm cuối: op-por-tu-ni-TÀ",
      ],
      pronunciation_focus_en: [
        "Doubles: difficile (ff), dall' (ll), opportunità (pp)",
        "'più' = 'pyù'; 'dà' and 'è' carry accents (stress them)",
        "'opportunità' stresses the final syllable: op-por-tu-ni-TÀ",
      ],
    },
    {
      en: "Quando sono arrivato in Italia, capivo molto poco.",
      vi: "Khi mới đến Ý, tôi hiểu rất ít.",
      pronunciation_focus: [
        "'Quando' = 'KWAN-do' (qu = 'kw')",
        "'arrivato' có 'rr' rung mạnh: ar-ri-VA-to",
        "Giữ nguyên âm cuối: arrivat-O, capiv-O, poc-O",
      ],
      pronunciation_focus_en: [
        "'Quando' = 'KWAN-do' (qu = 'kw')",
        "'arrivato' has a strong trilled 'rr': ar-ri-VA-to",
        "Keep the final vowels: arrivat-O, capiv-O, poc-O",
      ],
    },
    {
      en: "Adesso riesco a parlare con i colleghi e con gli uffici.",
      vi: "Bây giờ tôi có thể nói với đồng nghiệp và cơ quan.",
      pronunciation_focus: [
        "'Adesso' (ss đôi); 'colleghi' = 'col-LE-ghi' (gh = 'g' cứng, ll đôi)",
        "'gli uffici': 'gli' = 'lyi'; 'ci' trong 'uffici' = 'chi' mềm (ff đôi)",
        "'r' rung: riesco, parlare",
      ],
      pronunciation_focus_en: [
        "'Adesso' (double ss); 'colleghi' = 'col-LE-ghi' (gh = hard 'g', long ll)",
        "'gli uffici': 'gli' = 'lyee'; 'ci' in 'uffici' = soft 'chee' (double ff)",
        "Tapped 'r': riesco, parlare",
      ],
    },
    {
      en: "Voglio migliorare soprattutto l'ascolto e la pronuncia.",
      vi: "Tôi muốn cải thiện nhất là nghe và phát âm.",
      pronunciation_focus: [
        "'gli' trong 'Voglio'/'migliorare' = 'lyô': VO-lyô, mi-lyô-RA-re",
        "'tt' trong 'soprattutto' kéo dài: so-prat-TUT-to",
        "'sc' trong 'ascolto' = 'sk': a-SKOL-to",
      ],
      pronunciation_focus_en: [
        "'gli' in 'Voglio'/'migliorare' = 'lyo': VO-lyo, mi-lyo-RA-re",
        "Long 'tt' in 'soprattutto': so-prat-TUT-to",
        "'sc' in 'ascolto' = 'sk': a-SKOL-to",
      ],
    },
    {
      en: "Per questo motivo ascolto e ripeto ogni giorno.",
      vi: "Vì lý do này tôi nghe và lặp lại mỗi ngày.",
      pronunciation_focus: [
        "'gni' trong 'ogni' = 'nhi': O-nhi",
        "'qu' trong 'questo' = 'kw': KWE-sto",
        "'r' rung: per, ripeto, giorno",
      ],
      pronunciation_focus_en: [
        "'gni' in 'ogni' = 'ny': O-nyee",
        "'qu' in 'questo' = 'kw': KWE-sto",
        "Tapped 'r': per, ripeto, giorno",
      ],
    },
  ],

  vocabulary: [
    {
      word: "Nguyên âm cuối (final vowels)",
      en: "final vowels: lavoro, casa, grazie",
      vi: "âm cuối -o / -a / -e",
      pos: "target sound",
      pronunciation_vi:
        "Luôn phát âm rõ âm cuối — lỗi phổ biến nhất của người Việt là đọc cụt: la-VO-ro (đừng đọc 'lavor')",
      pronunciation_en:
        "Always sound the final vowel — the #1 Vietnamese-speaker error is dropping it: la-VO-ro (not 'lavor')",
    },
    {
      word: "Phụ âm đôi (double consonants)",
      en: "double consonants: fatto, palla, sette",
      vi: "phụ âm đôi kéo dài",
      pos: "target sound",
      pronunciation_vi:
        "Kéo dài phụ âm đôi — fatto ≠ fato, palla ≠ pala. Chặn hơi một nhịp rồi bật ra",
      pronunciation_en:
        "Hold double consonants longer — fatto ≠ fato, palla ≠ pala. Tiny held pause before release",
    },
    {
      word: "Trọng âm (stress)",
      en: "stress: telefono, lavoro, documento",
      vi: "nhấn đúng âm tiết",
      pos: "target sound",
      pronunciation_vi:
        "Đừng đọc đều đều mọi âm tiết: te-LE-fo-no, la-VO-ro, do-cu-MEN-to",
      pronunciation_en:
        "Don't flatten every syllable: te-LE-fo-no, la-VO-ro, do-cu-MEN-to",
    },
    {
      word: "gli",
      en: "'gli': famiglia, foglio",
      vi: "cụm 'gli' = 'l' mềm ('ly')",
      pos: "target sound",
      pronunciation_vi:
        "'gli' KHÔNG đọc như 'li' tiếng Việt — đầu lưỡi chạm vòm miệng: fa-MI-lya, FO-lyô",
      pronunciation_en:
        "'gli' is NOT a Vietnamese 'li' — it's a palatal 'l' (like 'lli' in 'million'): fa-MEE-lya, FO-lyo",
    },
    {
      word: "r",
      en: "'r': Roma, lavoro, arrivare",
      vi: "âm 'r' rung đầu lưỡi",
      pos: "target sound",
      pronunciation_vi:
        "'r' phải rung đầu lưỡi, không yếu kiểu tiếng Anh; 'rr' rung mạnh hơn: Roma, ar-ri-VA-re",
      pronunciation_en:
        "'r' is a tapped/trilled tongue-tip 'r', not the weak English 'r'; 'rr' rolls harder: Roma, ar-ri-VA-re",
    },
  ],

  dialogue: [
    {
      speaker: "Bước 1",
      text: "Ascolta una volta senza parlare.",
      vi: "Nghe một lần không nói.",
      en: "Listen once without speaking.",
    },
    {
      speaker: "Bước 2",
      text: "Leggi il testo lentamente.",
      vi: "Đọc văn bản chậm.",
      en: "Read the text slowly.",
    },
    {
      speaker: "Bước 3",
      text: "Ripeti frase per frase.",
      vi: "Lặp lại từng câu.",
      en: "Repeat sentence by sentence.",
    },
    {
      speaker: "Bước 4",
      text: "Fai shadowing con l'audio.",
      vi: "Nói đuổi theo audio.",
      en: "Shadow along with the audio.",
    },
    {
      speaker: "Bước 5",
      text: "Registrati per un minuto.",
      vi: "Tự ghi âm một phút.",
      en: "Record yourself for one minute.",
    },
    {
      speaker: "Bước 6",
      text: "Correggi un solo errore.",
      vi: "Chỉ sửa một lỗi.",
      en: "Fix one single error.",
    },
  ],

  exercises: [
    {
      type: "checklist",
      instruction_vi:
        "Ngày ôn tập & ghi âm (Ngày 7, 14, 21, 28, 29, 30) — làm theo từng mốc:",
      instruction_en:
        "Review & recording days (Days 7, 14, 21, 28, 29, 30) — work through each milestone:",
      items: [
        {
          prompt: "Day 7 — Review all week 1 lines.",
          answer: "Ôn tất cả câu tuần 1.",
        },
        {
          prompt: "Day 14 — Review and record two minutes.",
          answer: "Ôn và ghi âm hai phút.",
        },
        {
          prompt: "Day 21 — Review and correct one pronunciation error.",
          answer: "Ôn và sửa một lỗi phát âm.",
        },
        {
          prompt: "Day 28 — Record a five-minute summary.",
          answer: "Ghi âm tóm tắt năm phút.",
        },
        {
          prompt: "Day 29 — Repeat the hardest ten lines.",
          answer: "Lặp lại mười câu khó nhất.",
        },
        {
          prompt:
            "Day 30 — Final recording: introduce yourself and explain your goal.",
          answer: "Ghi âm cuối: giới thiệu bản thân và mục tiêu.",
        },
      ],
    },
    {
      type: "self_check",
      instruction_vi:
        "Sau MỖI lần ghi âm, tự kiểm tra (Answer Key / Recording Checklist):",
      instruction_en:
        "After EVERY recording, check yourself (Answer Key / Recording Checklist):",
      items: [
        {
          prompt: "Did I keep final vowels?",
          answer: "Tôi có giữ nguyên âm cuối không?",
        },
        {
          prompt: "Did I pronounce double consonants longer?",
          answer: "Tôi có kéo dài phụ âm đôi không?",
        },
        {
          prompt: "Did I stress the right syllable?",
          answer: "Tôi có nhấn đúng âm tiết không?",
        },
        {
          prompt: "Did I speak in chunks, not word by word?",
          answer: "Tôi có nói theo cụm, không phải từng từ rời rạc không?",
        },
        {
          prompt: "Did I sound polite and clear?",
          answer: "Tôi nghe có lịch sự và rõ ràng không?",
        },
      ],
    },
  ],

  cultural_notes_vi:
    "Shadowing nghĩa là nghe và nói gần như cùng lúc. Kế hoạch 30 ngày này giúp người Việt xây nhịp điệu tiếng Ý, nguyên âm cuối, trọng âm, phụ âm đôi và các cụm từ tự động cho đời sống, công việc, cơ quan và kỳ thi. Lộ trình đi từ 'nhịp điệu sinh tồn' (tuần 1) → công việc & cơ quan (tuần 2) → vấn đề & lịch sự (tuần 3) → thi cử & lưu loát (tuần 4). 5 điểm yếu cố hữu của người Việt: nguyên âm cuối, phụ âm đôi, trọng âm, cụm 'gli', và âm 'r' rung.",
  cultural_notes_en:
    "Shadowing means listening and speaking almost at the same time. This 30-day plan builds Italian rhythm, final vowels, stress, double consonants, and automatic chunks for daily life, work, offices, and exams. The arc runs survival rhythm (week 1) → work & offices (week 2) → problems & politeness (week 3) → exam & fluency (week 4). The five recurring Vietnamese-speaker weak spots: final vowels, double consonants, stress, the 'gli' cluster, and the tapped/trilled 'r'.",

  tip_advice_vi:
    "Làm đúng quy trình 6 bước mỗi ngày: (1) nghe một lần không nói, (2) đọc chậm, (3) lặp từng câu, (4) shadowing theo audio, (5) tự ghi âm một phút, (6) chỉ sửa MỘT lỗi. Đừng cố sửa hết mọi lỗi cùng lúc — mỗi ngày một lỗi là đủ. Ưu tiên giữ nguyên âm cuối và kéo dài phụ âm đôi trước, vì đó là hai lỗi làm người Việt nghe 'cụt' nhất.",
  tip_advice_en:
    "Run the same 6-step loop every day: (1) listen once without speaking, (2) read slowly, (3) repeat sentence by sentence, (4) shadow the audio, (5) record yourself for one minute, (6) fix ONE error only. Don't try to fix everything at once — one error a day is enough. Prioritise keeping final vowels and lengthening double consonants first; those two are what make Vietnamese speakers sound 'clipped'.",
};

export default lesson;
