// L2 — Advanced Workplace Dialogues Italian (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/L2-italian-workplace-dialogues-advanced.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts (and matches the sibling A4 / B6 / B7 extra
// files). When the Italian registry lands, swap the local types for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same order.
//
// Accents restored: the source .md was ASCII-degraded (e.g. "e meglio", "c'e",
// "gia", "Si"). This file uses correct Italian orthography (è, c'è, già, sì).

export type ItalianLessonSentence = {
  /** Target-language (Italian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  /** Italian word/phrase (with article where it teaches gender). */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun (m)", "noun (f)", "verb". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
  /** Example sentence in Italian. */
  example?: string;
};

export type ItalianDialogueLine = {
  speaker: string;
  /** Italian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, dialogue, roleplay) can vary.
export type ItalianExercise = Record<string, any>;

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLesson = {
  id: string;
  category: string;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
  content?: string;
};

export const lessons: ItalianLesson[] = [
  {
    id: "italian_workplace_dialogues_advanced_l2",
    level: "B2",
    category: "work",
    title_vi: "Hội thoại nơi làm việc nâng cao",
    title_en: "Advanced workplace dialogues",
    // ── Workplace tone map — the six core functional anchors ───────────────
    sentences: [
      {
        en: "Potrebbe darmi una mano?",
        vi: "Ông/bà có thể giúp tôi một tay không?",
        pronunciation_focus: [
          "po-TREB-be DAR-mi U-na MA-no — `potrebbe` (dạng lịch sự `Lei`) = 'ông/bà có thể'.",
          "Lỗi người Việt: dùng `puoi` (thân mật) với cấp trên. Với sếp/HR luôn dùng `potrebbe`.",
          "Drill: `Potrebbe darmi una mano?`",
        ],
        pronunciation_focus_en: [
          "po-TREB-be DAR-mi U-na MA-no — `potrebbe` is the polite `Lei` form of 'could you'.",
          "VN-speaker trap: using the casual `puoi` with a superior. With a boss/HR always use `potrebbe`.",
          "Drill: `Potrebbe darmi una mano?`",
        ],
      },
      {
        en: "Vorrei essere sicuro di aver capito.",
        vi: "Tôi muốn chắc là mình đã hiểu.",
        pronunciation_focus: [
          "vor-REI ES-se-re si-KU-ro — câu xác nhận bình tĩnh, được đánh giá cao ở nơi làm việc Ý.",
          "Lỗi người Việt: chỉ nói `Non capisco` rồi im. Thay vào đó hãy nói bạn cần xác nhận điều gì.",
          "Drill: `Vorrei essere sicuro di aver capito.`",
        ],
        pronunciation_focus_en: [
          "vor-REI ES-se-re si-KU-ro — the calm confirmation line; highly valued in Italian workplaces.",
          "VN-speaker trap: only saying `Non capisco` and going silent. Instead, state what you need confirmed.",
          "Drill: `Vorrei essere sicuro di aver capito.`",
        ],
      },
      {
        en: "Le segnalo un problema.",
        vi: "Tôi báo với anh/chị một vấn đề.",
        pronunciation_focus: [
          "le se-NYA-lo un pro-BLE-ma — `gn` đọc như 'nh' trong 'nhà'; `Le` (viết hoa) = 'với ông/bà'.",
          "Lỗi người Việt: vòng vo hoặc xin lỗi quá nhiều trước khi báo. Vào thẳng: nêu vật → vấn đề → rủi ro.",
          "Drill: `Le segnalo un problema.`",
        ],
        pronunciation_focus_en: [
          "le se-NYA-lo un pro-BLE-ma — `gn` is the 'ny' of 'canyon'; capital `Le` is the polite 'to you'.",
          "VN-speaker trap: over-apologising before reporting. Go straight in: object → problem → risk.",
          "Drill: `Le segnalo un problema.`",
        ],
      },
      {
        en: "Capisco, però secondo me...",
        vi: "Tôi hiểu, nhưng theo tôi...",
        pronunciation_focus: [
          "ka-PI-sko, pe-RÒ se-KON-do me — bất đồng nhẹ nhàng: công nhận trước, rồi mới nêu ý mình.",
          "Lỗi người Việt: phản đối thẳng `No, è sbagliato`. Trong xung đột, nêu sự thật trước cảm xúc.",
          "Drill: `Capisco, però secondo me...`",
        ],
        pronunciation_focus_en: [
          "ka-PI-sko, pe-RÒ se-KON-do me — soft disagreement: acknowledge first, then give your view.",
          "VN-speaker trap: blunt `No, è sbagliato`. In conflict, state facts before emotion.",
          "Drill: `Capisco, però secondo me...`",
        ],
      },
      {
        en: "Forse è meglio parlarne con il responsabile.",
        vi: "Có lẽ nên nói chuyện này với người phụ trách.",
        pronunciation_focus: [
          "FOR-se è ME-lyo par-LAR-ne — `gli` trong `meglio` đọc gần như 'li' mềm (lưỡi sát vòm).",
          "Lỗi người Việt: leo thang gay gắt. `Forse è meglio...` giúp chuyển lên cấp trên một cách ôn hòa.",
          "Drill: `Forse è meglio parlarne con il responsabile.`",
        ],
        pronunciation_focus_en: [
          "FOR-se è ME-lyo par-LAR-ne — `gli` in `meglio` is the palatal soft-'lli' (tongue against the palate).",
          "VN-speaker trap: escalating harshly. `Forse è meglio...` raises it to a superior calmly.",
          "Drill: `Forse è meglio parlarne con il responsabile.`",
        ],
      },
      {
        en: "Cosa posso migliorare?",
        vi: "Tôi có thể cải thiện điều gì?",
        pronunciation_focus: [
          "KO-za POS-so mi-lyo-RA-re — câu xin góp ý chủ động, thể hiện tinh thần học hỏi.",
          "Lỗi người Việt: đợi bị nhận xét rồi mới im lặng tiếp thu. Chủ động hỏi để được hướng dẫn cụ thể.",
          "Drill: `Cosa posso migliorare?`",
        ],
        pronunciation_focus_en: [
          "KO-za POS-so mi-lyo-RA-re — the proactive 'what can I improve?' that signals a learning attitude.",
          "VN-speaker trap: waiting passively for feedback. Asking first earns concrete guidance.",
          "Drill: `Cosa posso migliorare?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nơi làm việc Ý, sự xác nhận bình tĩnh được coi trọng: `Vorrei essere sicuro...` cho thấy bạn cẩn thận chứ không phải kém cỏi. Với cấp trên và HR luôn dùng dạng lịch sự `Lei` (`Potrebbe`, `Le segnalo`, `La ringrazio`), không dùng `tu`. Trong các tình huống an toàn, hãy nói trực tiếp nhưng chính xác: nêu rõ vật, vấn đề và rủi ro. `Mi dispiace` có thể làm dịu một hiểu lầm mà không có nghĩa là bạn nhận hết lỗi.",
    cultural_notes_en:
      "In Italian workplaces, calm clarification is valued: `Vorrei essere sicuro...` reads as careful, not weak. With supervisors and HR always use the polite `Lei` form (`Potrebbe`, `Le segnalo`, `La ringrazio`), never `tu`. In safety situations be direct but precise — name the object, the problem, and the risk. `Mi dispiace` can soften a misunderstanding without you admitting full blame.",
    tip_advice_vi:
      "Đừng chỉ nói `Non capisco` rồi dừng lại — hãy nói bạn cần được nhắc lại hay xác nhận điều gì. Khi có bất đồng, công nhận ý người kia trước (`Capisco, però...`) rồi mới nêu sự thật. Khi cần chuyển lên trên, dùng `Forse è meglio parlarne con il responsabile` thay vì leo thang gay gắt.",
    tip_advice_en:
      "Don't just say `Non capisco` and stop — say exactly what you need repeated or confirmed. When you disagree, acknowledge first (`Capisco, però...`), then state the facts. To escalate, use `Forse è meglio parlarne con il responsabile` rather than escalating harshly.",
    vocabulary: [
      {
        word: "il turno",
        en: "shift",
        vi: "ca làm",
        pos: "noun (m)",
        pronunciation_vi: "il TUR-no — 'r' rung nhẹ",
        pronunciation_en: "il TUR-no — lightly tapped 'r'",
        example: "Vorrei cambiare turno.",
      },
      {
        word: "il responsabile",
        en: "the person in charge, manager",
        vi: "người phụ trách",
        pos: "noun (m)",
        pronunciation_vi: "il res-pon-SA-bi-le — nhấn 'SA'",
        pronunciation_en: "il res-pon-SA-bi-le — stress 'SA'",
        example: "Parlo con il responsabile.",
      },
      {
        word: "la procedura",
        en: "procedure",
        vi: "quy trình",
        pos: "noun (f)",
        pronunciation_vi: "la pro-chê-DU-ra — 'ce' đọc 'chê'",
        pronunciation_en: "la pro-che-DU-ra — 'ce' is 'cheh'",
        example: "Sto imparando la procedura.",
      },
      {
        word: "la spedizione",
        en: "shipment, dispatch",
        vi: "việc gửi hàng",
        pos: "noun (f)",
        pronunciation_vi: "la spe-di-TSYO-ne — 'zi' đọc 'tsyo'",
        pronunciation_en: "la spe-di-TSYO-ne — 'zi' is 'tsyo'",
        example: "Prima della spedizione.",
      },
      {
        word: "il registro",
        en: "logbook, register",
        vi: "sổ ghi chép",
        pos: "noun (m)",
        pronunciation_vi: "il re-DJI-stro — 'gi' đọc 'gi' mềm",
        pronunciation_en: "il re-JEE-stro — soft 'g' (as in 'gem')",
        example: "Scrivo sul registro.",
      },
      {
        word: "il malinteso",
        en: "misunderstanding",
        vi: "sự hiểu lầm",
        pos: "noun (m)",
        pronunciation_vi: "il ma-lin-TE-zo — 's' giữa đọc 'z'",
        pronunciation_en: "il ma-lin-TE-zo — intervocalic 's' is voiced 'z'",
        example: "C'è stato un malinteso.",
      },
      {
        word: "la trattenuta",
        en: "deduction (from pay)",
        vi: "khoản khấu trừ",
        pos: "noun (f)",
        pronunciation_vi: "la trat-te-NU-ta — 'tt' kép, ngắt rõ",
        pronunciation_en: "la trat-te-NU-ta — long double 'tt'",
        example: "Vorrei capire questa trattenuta.",
      },
      {
        word: "il netto",
        en: "net (take-home pay)",
        vi: "lương thực nhận",
        pos: "noun (m)",
        pronunciation_vi: "il NET-to — 'tt' kép",
        pronunciation_en: "il NET-to — long double 'tt'",
        example: "Qual è il totale netto?",
      },
    ],
    // Dialogue 1 — Clarifying a task (featured).
    dialogue: [
      {
        speaker: "Capo",
        text: "Oggi devi controllare i documenti prima della spedizione.",
        vi: "Hôm nay bạn phải kiểm tra giấy tờ trước khi gửi hàng.",
        en: "Today you need to check the documents before the shipment.",
      },
      {
        speaker: "Lavoratore",
        text: "Va bene. Vorrei essere sicuro di aver capito: controllo nome, indirizzo e codice, giusto?",
        vi: "Được. Tôi muốn chắc là đã hiểu: kiểm tra tên, địa chỉ và mã, đúng không?",
        en: "Alright. I'd like to be sure I understood: I check name, address and code, right?",
      },
      {
        speaker: "Capo",
        text: "Esatto, e poi li metti nella cartella rossa.",
        vi: "Đúng, rồi cho vào bìa màu đỏ.",
        en: "Exactly, and then you put them in the red folder.",
      },
      {
        speaker: "Lavoratore",
        text: "Perfetto. Se trovo un errore, a chi lo segnalo?",
        vi: "Rõ rồi. Nếu tôi thấy lỗi, tôi báo cho ai?",
        en: "Perfect. If I find an error, who do I report it to?",
      },
      {
        speaker: "Capo",
        text: "Lo segnali a me subito.",
        vi: "Báo cho tôi ngay.",
        en: "Report it to me immediately.",
      },
    ],
    exercises: [
      // Dialogue 2 — Asking for help without sounding weak.
      {
        type: "dialogue",
        title_vi: "Hội thoại 2 — Xin giúp đỡ mà không tỏ ra yếu kém",
        title_en: "Dialogue 2 — Asking for help without sounding weak",
        lines: [
          {
            speaker: "Lavoratore",
            text: "Marco, hai un minuto?",
            vi: "Marco, anh có một phút không?",
            en: "Marco, do you have a minute?",
          },
          {
            speaker: "Collega",
            text: "Sì, dimmi.",
            vi: "Có, nói đi.",
            en: "Yes, tell me.",
          },
          {
            speaker: "Lavoratore",
            text: "Sto imparando questa procedura. Potresti controllare se la sto facendo correttamente?",
            vi: "Tôi đang học quy trình này. Anh kiểm tra giúp xem tôi làm đúng không?",
            en: "I'm learning this procedure. Could you check whether I'm doing it correctly?",
          },
          {
            speaker: "Collega",
            text: "Certo, fammi vedere.",
            vi: "Được, cho tôi xem.",
            en: "Sure, show me.",
          },
          {
            speaker: "Lavoratore",
            text: "Grazie. La prossima volta provo da solo.",
            vi: "Cảm ơn. Lần sau tôi sẽ thử tự làm.",
            en: "Thanks. Next time I'll try on my own.",
          },
        ],
      },
      // Dialogue 3 — Schedule problem.
      {
        type: "dialogue",
        title_vi: "Hội thoại 3 — Vấn đề về lịch làm việc",
        title_en: "Dialogue 3 — Schedule problem",
        lines: [
          {
            speaker: "Lavoratore",
            text: "Buongiorno, posso parlarle del turno di venerdì?",
            vi: "Chào, tôi nói chuyện với anh/chị về ca thứ Sáu được không?",
            en: "Good morning, may I speak with you about Friday's shift?",
          },
          {
            speaker: "Responsabile",
            text: "Certo, che problema c'è?",
            vi: "Được, có vấn đề gì?",
            en: "Of course, what's the problem?",
          },
          {
            speaker: "Lavoratore",
            text: "Ho un appuntamento medico già fissato. Posso cambiare turno con sabato?",
            vi: "Tôi có lịch khám đã đặt rồi. Tôi đổi ca sang thứ Bảy được không?",
            en: "I already have a medical appointment booked. Can I swap my shift to Saturday?",
          },
          {
            speaker: "Responsabile",
            text: "Devo controllare il calendario.",
            vi: "Tôi cần kiểm tra lịch.",
            en: "I have to check the calendar.",
          },
          {
            speaker: "Lavoratore",
            text: "La ringrazio. Posso recuperare le ore se necessario.",
            vi: "Cảm ơn anh/chị. Tôi có thể bù giờ nếu cần.",
            en: "Thank you. I can make up the hours if needed.",
          },
        ],
      },
      // Dialogue 4 — Safety concern.
      {
        type: "dialogue",
        title_vi: "Hội thoại 4 — Lo ngại về an toàn",
        title_en: "Dialogue 4 — Safety concern",
        lines: [
          {
            speaker: "Lavoratore",
            text: "Le segnalo un problema di sicurezza.",
            vi: "Tôi báo một vấn đề an toàn.",
            en: "I'm reporting a safety problem to you.",
          },
          {
            speaker: "Capo",
            text: "Che cosa succede?",
            vi: "Chuyện gì xảy ra?",
            en: "What's happening?",
          },
          {
            speaker: "Lavoratore",
            text: "La macchina fa un rumore strano e il pulsante di emergenza non risponde subito.",
            vi: "Máy phát tiếng lạ và nút khẩn cấp không phản hồi ngay.",
            en: "The machine is making a strange noise and the emergency button doesn't respond immediately.",
          },
          {
            speaker: "Capo",
            text: "Fermala e chiama il tecnico.",
            vi: "Dừng máy và gọi kỹ thuật viên.",
            en: "Stop it and call the technician.",
          },
          {
            speaker: "Lavoratore",
            text: "Va bene. Scrivo anche una nota sul registro?",
            vi: "Được. Tôi cũng ghi chú vào sổ chứ?",
            en: "Alright. Should I also write a note in the logbook?",
          },
        ],
      },
      // Dialogue 5 — Workplace misunderstanding.
      {
        type: "dialogue",
        title_vi: "Hội thoại 5 — Hiểu lầm nơi làm việc",
        title_en: "Dialogue 5 — Workplace misunderstanding",
        lines: [
          {
            speaker: "Collega",
            text: "Pensavo che tu dovessi chiudere il magazzino ieri.",
            vi: "Tôi tưởng hôm qua bạn phải khóa kho.",
            en: "I thought you were supposed to close the warehouse yesterday.",
          },
          {
            speaker: "Lavoratore",
            text: "Mi dispiace, forse c'è stato un malinteso. Io avevo capito che lo faceva Luca.",
            vi: "Tôi xin lỗi, có lẽ có hiểu lầm. Tôi hiểu là Luca làm việc đó.",
            en: "I'm sorry, maybe there was a misunderstanding. I understood Luca was doing it.",
          },
          {
            speaker: "Collega",
            text: "Il capo ha detto una cosa diversa.",
            vi: "Sếp nói khác.",
            en: "The boss said something different.",
          },
          {
            speaker: "Lavoratore",
            text: "Capisco. Possiamo controllare il messaggio e chiarire per la prossima volta?",
            vi: "Tôi hiểu. Chúng ta kiểm tra tin nhắn và làm rõ cho lần sau được không?",
            en: "I understand. Can we check the message and clear it up for next time?",
          },
        ],
      },
      // Dialogue 6 — HR conversation.
      {
        type: "dialogue",
        title_vi: "Hội thoại 6 — Trao đổi với phòng nhân sự (HR)",
        title_en: "Dialogue 6 — HR conversation",
        lines: [
          {
            speaker: "Dipendente",
            text: "Vorrei parlare del mio contratto e delle ore lavorate.",
            vi: "Tôi muốn nói về hợp đồng và số giờ đã làm.",
            en: "I'd like to talk about my contract and the hours worked.",
          },
          {
            speaker: "HR",
            text: "Certo. Ha portato le buste paga?",
            vi: "Vâng. Anh/chị có mang bảng lương không?",
            en: "Of course. Did you bring your payslips?",
          },
          {
            speaker: "Dipendente",
            text: "Sì, eccole. Vorrei capire questa trattenuta.",
            vi: "Có, đây. Tôi muốn hiểu khoản khấu trừ này.",
            en: "Yes, here they are. I'd like to understand this deduction.",
          },
          {
            speaker: "HR",
            text: "Questa voce riguarda i contributi.",
            vi: "Mục này liên quan đến khoản đóng góp (bảo hiểm).",
            en: "This item relates to social-security contributions.",
          },
          {
            speaker: "Dipendente",
            text: "Grazie, potrebbe spiegarmi anche il totale netto?",
            vi: "Cảm ơn, anh/chị giải thích cả tổng thực nhận giúp tôi được không?",
            en: "Thank you, could you also explain the net total to me?",
          },
        ],
      },
      // Roleplay drills.
      {
        type: "roleplay",
        instruction_vi: "Đóng vai — luyện từng tình huống bằng tiếng Ý:",
        instruction_en: "Roleplay — practise each situation in Italian:",
        items: [
          {
            vi: "Nhờ đồng nghiệp kiểm tra quy trình của bạn.",
            en: "Ask a colleague to check your procedure.",
          },
          {
            vi: "Đề nghị cấp trên đổi ca làm.",
            en: "Ask a supervisor to change a shift.",
          },
          {
            vi: "Báo cáo một sự cố an toàn của máy móc.",
            en: "Report a machine safety problem.",
          },
          {
            vi: "Làm rõ một nhiệm vụ với ba chi tiết cụ thể.",
            en: "Clarify a task with three details.",
          },
          {
            vi: "Giải thích một hiểu lầm và đề nghị kiểm tra lại tin nhắn.",
            en: "Explain a misunderstanding and propose checking the messages.",
          },
          {
            vi: "Hỏi HR về một khoản khấu trừ trên bảng lương.",
            en: "Ask HR about a payslip deduction.",
          },
        ],
      },
      // Practice + answer key (Vietnamese → Italian).
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          {
            prompt: "Tôi muốn chắc là mình đã hiểu.",
            prompt_en: "I want to be sure I understood.",
            answer: "Vorrei essere sicuro di aver capito.",
          },
          {
            prompt: "Có lẽ đã có một hiểu lầm.",
            prompt_en: "There may have been a misunderstanding.",
            answer: "Forse c'è stato un malinteso.",
          },
          {
            prompt: "Hãy nói một câu lịch sự để báo cáo một vấn đề an toàn.",
            prompt_en: "Make one polite sentence to report a safety problem.",
            answer: "Le segnalo un problema di sicurezza.",
          },
          {
            prompt: "Hỏi xem bạn nên báo lỗi cho ai.",
            prompt_en: "Ask who you should report an error to.",
            answer: "Se trovo un errore, a chi lo segnalo?",
          },
        ],
      },
    ],
  },
];

export default lessons;
