// B7 — Immigration & Government Italian (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/B7-immigration-government.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts (and matches the sibling B6 / A4 extra files).
// When the Italian registry lands, swap the local types for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note + a
// correction drill); `pronunciation_focus_en` is the English-speaker companion,
// same order.

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
  /** Part of speech, e.g. "noun (m)", "noun (f)", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
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

// Loosely typed so per-type fields (translation, checklist, rubric) can vary.
export type ItalianExercise = Record<string, unknown>;

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
    id: "italian_immigration_government_b7",
    level: "B1",
    category: "life_admin",
    title_vi: "Tiếng Ý cho nhập cư và thủ tục hành chính",
    title_en: "Immigration and government Italian",
    sentences: [
      // ── Office basics ──────────────────────────────────────────────────
      {
        en: "Ho un appuntamento alle nove.",
        vi: "Tôi có lịch hẹn lúc 9 giờ.",
        pronunciation_focus: [
          "o un ap-poon-ta-MEN-to AL-le NO-ve — chú ý phụ âm đôi `pp` trong `appuntamento`.",
          "Lỗi người Việt: bỏ mạo từ `un`. Phải nói `ho UN appuntamento`.",
          "Drill: `Ho un appuntamento alle nove.`",
        ],
        pronunciation_focus_en: [
          "o un ap-poon-ta-MEN-to AL-le NO-ve — note the double `pp` in `appuntamento`.",
          "VN-speaker trap: dropping the article `un`. Say `ho UN appuntamento`.",
          "Drill: `Ho un appuntamento alle nove.`",
        ],
      },
      {
        en: "Devo fare il codice fiscale.",
        vi: "Tôi phải làm mã số thuế.",
        pronunciation_focus: [
          "DEH-vo FA-re il KO-dee-che fee-SKA-le — cụm cố định, dùng hằng ngày.",
          "Lỗi người Việt: nói `codice tassa` (dịch kiểu Anh). Đúng là `codice fiscale`.",
          "Drill: `Devo fare il codice fiscale.`",
        ],
        pronunciation_focus_en: [
          "DEH-vo FA-re il KO-dee-che fee-SKA-le — fixed phrase, everyday use.",
          "VN-speaker trap: saying `codice tassa` (English-style). It's `codice fiscale`.",
          "Drill: `Devo fare il codice fiscale.`",
        ],
      },
      {
        en: "Vorrei richiedere la residenza.",
        vi: "Tôi muốn xin đăng ký cư trú.",
        pronunciation_focus: [
          "vor-RAY ree-KYE-de-re la re-zee-DEN-tsa — `richiedere` là từ trang trọng.",
          "Lỗi người Việt: nói `fare residenza` trong văn cảnh trang trọng. Dùng `richiedere`.",
          "Drill: `Vorrei richiedere la residenza.`",
        ],
        pronunciation_focus_en: [
          "vor-RAY ree-KYE-de-re la re-zee-DEN-tsa — `richiedere` is the formal verb.",
          "VN-speaker trap: saying `fare residenza` in formal speech. Use `richiedere`.",
          "Drill: `Vorrei richiedere la residenza.`",
        ],
      },
      {
        en: "Devo rinnovare il permesso di soggiorno.",
        vi: "Tôi phải gia hạn giấy phép cư trú.",
        pronunciation_focus: [
          "DEH-vo reen-no-VA-re il per-MES-so dee sod-JOR-no — học nguyên cụm.",
          "Lỗi người Việt: bỏ `di soggiorno`. Phải nói đủ `permesso di soggiorno`.",
          "Drill: lặp lại nguyên câu ba lần.",
        ],
        pronunciation_focus_en: [
          "DEH-vo reen-no-VA-re il per-MES-so dee sod-JOR-no — learn it as one chunk.",
          "VN-speaker trap: dropping `di soggiorno`. Say the full `permesso di soggiorno`.",
          "Drill: repeat the whole phrase three times.",
        ],
      },
      {
        en: "Mi manca un documento.",
        vi: "Tôi thiếu một giấy tờ.",
        pronunciation_focus: [
          "mee MAN-ka un do-koo-MEN-to — `mi manca` = 'tôi thiếu' (động từ chia theo vật).",
          "Lỗi người Việt: nói `io manco documento`. Câu chuẩn là `mi manca un documento`.",
          "Drill: `Mi manca un documento.`",
        ],
        pronunciation_focus_en: [
          "mee MAN-ka un do-koo-MEN-to — `mi manca` = 'I am missing' (verb agrees with the thing).",
          "VN-speaker trap: saying `io manco documento`. The set phrase is `mi manca un documento`.",
          "Drill: `Mi manca un documento.`",
        ],
      },
      // ── Documents ──────────────────────────────────────────────────────
      {
        en: "Ecco il passaporto.",
        vi: "Đây là hộ chiếu.",
        pronunciation_focus: [
          "EK-ko il pas-sa-POR-to — phụ âm đôi `ss` trong `passaporto`.",
          "Lỗi người Việt: bỏ `o` cuối → `passaport`. Phải giữ nguyên âm cuối `passaporto`.",
          "Drill: `Ecco il passaporto.`",
        ],
        pronunciation_focus_en: [
          "EK-ko il pas-sa-POR-to — double `ss` in `passaporto`.",
          "VN-speaker trap: dropping the final `o` → `passaport`. Keep the final vowel.",
          "Drill: `Ecco il passaporto.`",
        ],
      },
      {
        en: "Ho la carta d'identità.",
        vi: "Tôi có thẻ căn cước.",
        pronunciation_focus: [
          "o la KAR-ta dee-den-tee-TA — trọng âm rơi vào âm cuối `-tà`.",
          "Lỗi người Việt: nói `carta identità` thiếu `d'`. Phải có `carta d'identità`.",
          "Drill: `Ho la carta d'identità.`",
        ],
        pronunciation_focus_en: [
          "o la KAR-ta dee-den-tee-TA — final stress on `-tà`.",
          "VN-speaker trap: saying `carta identità` without the `d'`. It's `carta d'identità`.",
          "Drill: `Ho la carta d'identità.`",
        ],
      },
      {
        en: "Porto il contratto di affitto.",
        vi: "Tôi mang theo hợp đồng thuê nhà.",
        pronunciation_focus: [
          "POR-to il kon-TRAT-to dee af-FEET-to — phụ âm đôi `tt` và `ff`.",
          "Lỗi người Việt: nói `contratto casa`. Cụm đúng là `contratto di affitto`.",
          "Drill: `Porto il contratto di affitto.`",
        ],
        pronunciation_focus_en: [
          "POR-to il kon-TRAT-to dee af-FEET-to — double `tt` and `ff`.",
          "VN-speaker trap: saying `contratto casa`. The phrase is `contratto di affitto`.",
          "Drill: `Porto il contratto di affitto.`",
        ],
      },
      {
        en: "Ho un contratto di lavoro.",
        vi: "Tôi có hợp đồng lao động.",
        pronunciation_focus: [
          "o un kon-TRAT-to dee la-VO-ro — cụm cố định.",
          "Lỗi người Việt: nói `contratto lavoro` thiếu `di`. Phải có `contratto di lavoro`.",
          "Drill: `Ho un contratto di lavoro.`",
        ],
        pronunciation_focus_en: [
          "o un kon-TRAT-to dee la-VO-ro — fixed phrase.",
          "VN-speaker trap: saying `contratto lavoro` without `di`. Say `contratto di lavoro`.",
          "Drill: `Ho un contratto di lavoro.`",
        ],
      },
      {
        en: "Serve una marca da bollo?",
        vi: "Có cần tem thuế không?",
        pronunciation_focus: [
          "SER-ve OO-na MAR-ka da BOL-lo — vật dụng đặc trưng ở cơ quan hành chính.",
          "Lỗi người Việt: không nhận ra cụm này. Học nguyên cụm `marca da bollo`.",
          "Drill: `Serve una marca da bollo?`",
        ],
        pronunciation_focus_en: [
          "SER-ve OO-na MAR-ka da BOL-lo — a government-office item (revenue stamp).",
          "VN-speaker trap: not recognising the phrase. Learn `marca da bollo` whole.",
          "Drill: `Serve una marca da bollo?`",
        ],
      },
      {
        en: "Devo compilare il modulo.",
        vi: "Tôi phải điền mẫu đơn.",
        pronunciation_focus: [
          "DEH-vo kom-pee-LA-re il MO-doo-lo — `modulo` = mẫu đơn/biểu mẫu.",
          "Lỗi người Việt: dùng từ Anh `form`. Tiếng Ý là `il modulo`.",
          "Drill: `Devo compilare il modulo.`",
        ],
        pronunciation_focus_en: [
          "DEH-vo kom-pee-LA-re il MO-doo-lo — `modulo` = a form.",
          "VN-speaker trap: using the English `form`. Italian is `il modulo`.",
          "Drill: `Devo compilare il modulo.`",
        ],
      },
      // ── Email and submission ───────────────────────────────────────────
      {
        en: "Posso mandarlo via email?",
        vi: "Tôi có thể gửi nó qua email không?",
        pronunciation_focus: [
          "POS-so man-DAR-lo VEE-a EE-mayl — `mandarlo` = `mandare` + `lo` ('gửi nó').",
          "Lỗi người Việt: nói `mandare lui`. Đại từ tân ngữ phải gắn liền: `mandarlo`.",
          "Drill: `Posso mandarlo via email?`",
        ],
        pronunciation_focus_en: [
          "POS-so man-DAR-lo VEE-a EE-mayl — `mandarlo` = `mandare` + `lo` ('send it').",
          "VN-speaker trap: saying `mandare lui`. The object pronoun attaches: `mandarlo`.",
          "Drill: `Posso mandarlo via email?`",
        ],
      },
      {
        en: "Ho allegato il file alla mail.",
        vi: "Tôi đã đính kèm tệp vào email.",
        pronunciation_focus: [
          "o al-le-GA-to il fa-eel AL-la mayl — cụm chuẩn khi viết email.",
          "Lỗi người Việt: nói `ho messo file`. Động từ đúng là `allegare` → `ho allegato`.",
          "Drill: `Ho allegato il file alla mail.`",
        ],
        pronunciation_focus_en: [
          "o al-le-GA-to il fa-eel AL-la mayl — standard email phrasing.",
          "VN-speaker trap: saying `ho messo file`. The verb is `allegare` → `ho allegato`.",
          "Drill: `Ho allegato il file alla mail.`",
        ],
      },
      {
        en: "Può controllare i dati?",
        vi: "Ông/bà kiểm tra thông tin được không?",
        pronunciation_focus: [
          "pwo kon-trol-LA-re ee DA-tee — `dati` là số nhiều ('các dữ liệu/thông tin').",
          "Lỗi người Việt: nói `controllare informazione` (số ít kiểu Anh). Dùng `i dati`.",
          "Drill: `Può controllare i dati?`",
        ],
        pronunciation_focus_en: [
          "pwo kon-trol-LA-re ee DA-tee — `dati` is plural ('the data/details').",
          "VN-speaker trap: saying `controllare informazione`. Use `i dati`.",
          "Drill: `Può controllare i dati?`",
        ],
      },
      {
        en: "C'è un errore nel documento.",
        vi: "Có lỗi trong giấy tờ.",
        pronunciation_focus: [
          "cheh un er-RO-re nel do-koo-MEN-to — `nel` = `in` + `il` ('trong').",
          "Lỗi người Việt: nói `errore documento` thiếu giới từ. Phải có `nel documento`.",
          "Drill: `C'è un errore nel documento.`",
        ],
        pronunciation_focus_en: [
          "cheh un er-RO-re nel do-koo-MEN-to — `nel` = `in` + `il` ('in the').",
          "VN-speaker trap: saying `errore documento` without the preposition. Say `nel documento`.",
          "Drill: `C'è un errore nel documento.`",
        ],
      },
      // ── Office phrases ─────────────────────────────────────────────────
      {
        en: "Sono qui per la pratica della residenza.",
        vi: "Tôi đến đây vì hồ sơ cư trú.",
        pronunciation_focus: [
          "SO-no kwee per la PRA-tee-ka del-la re-zee-DEN-tsa — `pratica` = hồ sơ/thủ tục.",
          "Lỗi người Việt: bỏ `la pratica`. Nói rõ lý do: `per la pratica della residenza`.",
          "Drill: `Sono qui per la pratica della residenza.`",
        ],
        pronunciation_focus_en: [
          "SO-no kwee per la PRA-tee-ka del-la re-zee-DEN-tsa — `pratica` = case/file/procedure.",
          "VN-speaker trap: dropping `la pratica`. State the reason: `per la pratica della residenza`.",
          "Drill: `Sono qui per la pratica della residenza.`",
        ],
      },
      {
        en: "Dove devo firmare?",
        vi: "Tôi phải ký ở đâu?",
        pronunciation_focus: [
          "DO-ve DEH-vo feer-MA-re — `firmare` = ký tên.",
          "Lỗi người Việt: nói `firma dove` (trật tự kiểu Việt). Đúng là `Dove devo firmare?`",
          "Drill: `Dove devo firmare?`",
        ],
        pronunciation_focus_en: [
          "DO-ve DEH-vo feer-MA-re — `firmare` = to sign.",
          "VN-speaker trap: saying `firma dove` (Vietnamese word order). It's `Dove devo firmare?`",
          "Drill: `Dove devo firmare?`",
        ],
      },
      {
        en: "Mi serve una copia della ricevuta.",
        vi: "Tôi cần một bản sao biên nhận.",
        pronunciation_focus: [
          "mee SER-ve OO-na KO-pya del-la ree-che-VOO-ta — `mi serve` = 'tôi cần'.",
          "Lỗi người Việt: nói `io bisogno copia`. Dùng `mi serve una copia`.",
          "Drill: `Mi serve una copia della ricevuta.`",
        ],
        pronunciation_focus_en: [
          "mee SER-ve OO-na KO-pya del-la ree-che-VOO-ta — `mi serve` = 'I need'.",
          "VN-speaker trap: saying `io bisogno copia`. Use `mi serve una copia`.",
          "Drill: `Mi serve una copia della ricevuta.`",
        ],
      },
      {
        en: "Può ripetere più lentamente?",
        vi: "Ông/bà có thể nhắc chậm hơn không?",
        pronunciation_focus: [
          "pwo ree-PE-te-re pyoo len-ta-MEN-te — câu cứu cánh khi không nghe kịp.",
          "Lỗi người Việt: im lặng khi không hiểu. Hãy chủ động xin nhắc lại ngay.",
          "Drill: `Può ripetere più lentamente?`",
        ],
        pronunciation_focus_en: [
          "pwo ree-PE-te-re pyoo len-ta-MEN-te — your lifeline when you can't keep up.",
          "VN-speaker trap: staying silent when lost. Ask for a repeat immediately.",
          "Drill: `Può ripetere più lentamente?`",
        ],
      },
      {
        en: "Ho portato l'originale e la copia.",
        vi: "Tôi đã mang bản gốc và bản sao.",
        pronunciation_focus: [
          "o por-TA-to lo-ree-jee-NA-le e la KO-pya — `l'originale` = bản gốc.",
          "Lỗi người Việt: chỉ mang bản sao. Cơ quan thường cần CẢ bản gốc và bản sao.",
          "Drill: `Ho portato l'originale e la copia.`",
        ],
        pronunciation_focus_en: [
          "o por-TA-to lo-ree-jee-NA-le e la KO-pya — `l'originale` = the original.",
          "VN-speaker trap: bringing only the copy. Offices usually need BOTH original and copy.",
          "Drill: `Ho portato l'originale e la copia.`",
        ],
      },
      // ── Polite tone and email closers ──────────────────────────────────
      {
        en: "Resto in attesa di una conferma.",
        vi: "Tôi chờ xác nhận.",
        pronunciation_focus: [
          "RES-to in at-TE-za dee OO-na kon-FER-ma — câu kết email trang trọng.",
          "Lỗi người Việt: kết email cộc lốc. Dùng câu lịch sự `Resto in attesa…`.",
          "Drill: `Resto in attesa di una conferma.`",
        ],
        pronunciation_focus_en: [
          "RES-to in at-TE-za dee OO-na kon-FER-ma — a formal email closing line.",
          "VN-speaker trap: ending an email too bluntly. Use the polite `Resto in attesa…`.",
          "Drill: `Resto in attesa di una conferma.`",
        ],
      },
      {
        en: "Grazie per la disponibilità.",
        vi: "Cảm ơn vì sự hỗ trợ.",
        pronunciation_focus: [
          "GRA-tsye per la dees-po-nee-bee-lee-TA — kết thư lịch sự, trọng âm cuối `-tà`.",
          "Lỗi người Việt: chỉ nói `grazie`. Trong văn phòng nên thêm `per la disponibilità`.",
          "Drill: `Grazie per la disponibilità.`",
        ],
        pronunciation_focus_en: [
          "GRA-tsye per la dees-po-nee-bee-lee-TA — a polite sign-off, final stress on `-tà`.",
          "VN-speaker trap: saying only `grazie`. In offices add `per la disponibilità`.",
          "Drill: `Grazie per la disponibilità.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi làm thủ tục ở Ý, bạn sẽ gặp bốn cơ quan chính: `il comune` (ủy ban/đô thị — đăng ký cư trú `residenza`, hộ tịch), `la questura` (sở cảnh sát — `permesso di soggiorno`/giấy phép cư trú), `l'Agenzia delle Entrate` (cơ quan thuế — cấp `codice fiscale`/mã số thuế), và `l'ufficio postale` (bưu điện — nơi nộp nhiều bộ hồ sơ permesso qua `kit giallo`). Hai giấy tờ phải LUÔN mang theo: `codice fiscale` và một giấy tùy thân (`carta d'identità` hoặc `passaporto`). Nhiều thủ tục cần `marca da bollo` (tem thuế, mua ở `tabaccheria`) và bản sao có khi cần công chứng. Hầu hết việc đều cần `appuntamento` đặt trước (online hoặc qua tổng đài) — đến không hẹn thường bị từ chối. Luôn xin và GIỮ `la ricevuta` (biên nhận) làm bằng chứng đã nộp. Lấy số ở `sportello` (quầy) và chờ gọi.",
    cultural_notes_en:
      "Italian admin runs through four main offices: `il comune` (town/city hall — `residenza` registration, civil records), `la questura` (police HQ — the `permesso di soggiorno`/residence permit), `l'Agenzia delle Entrate` (tax agency — issues the `codice fiscale`/tax code), and `l'ufficio postale` (post office — where many permit files are filed via the `kit giallo`/yellow kit). Two documents to ALWAYS carry: your `codice fiscale` and a photo ID (`carta d'identità` or `passaporto`). Many procedures need a `marca da bollo` (revenue stamp, bought at a `tabaccheria`) and copies, sometimes certified. Most steps require an `appuntamento` booked ahead (online or by phone) — walk-ins are usually turned away. Always ask for and KEEP `la ricevuta` (receipt) as proof of submission. Take a ticket at the `sportello` (counter/window) and wait to be called.",
    tip_advice_vi:
      "Giọng điệu là tất cả ở cơ quan hành chính Ý: dùng `vorrei` (tôi muốn) thay vì `voglio` (tôi muốn — nghe như ra lệnh), và xưng hô lịch sự `Lei` (ngôi thứ ba). Nói NGẮN, RÕ, đủ ý: lý do đến → giấy tờ mang theo → câu hỏi. Luôn gọi đủ tên giấy tờ (`permesso di soggiorno`, không gọi tắt `permesso`). Học chắc hai khung động từ: `mi manca + (cái gì)` để báo thiếu giấy tờ, và `mi serve + (cái gì)` để xin thứ cần. Nếu không hiểu, xin nhắc lại NGAY (`Può ripetere più lentamente?`) — đừng gật cho qua. Ghi lại ngày hẹn và món giấy tờ còn thiếu trước khi rời quầy.",
    tip_advice_en:
      "Tone is everything in Italian offices: use `vorrei` ('I would like') instead of `voglio` ('I want', which lands like an order), and the polite third-person `Lei`. Keep it SHORT, CLEAR, complete: reason for coming → documents you brought → your question. Always say the full document name (`permesso di soggiorno`, never the clipped `permesso`). Lock in two verb frames: `mi manca + (thing)` to report a missing document, and `mi serve + (thing)` to request what you need. If you don't understand, ask for a repeat IMMEDIATELY (`Può ripetere più lentamente?`) — don't just nod. Write down the appointment date and the missing item before you leave the counter.",
    vocabulary: [
      // Offices and places
      {
        word: "il comune",
        en: "town/city hall",
        vi: "ủy ban / đô thị",
        pos: "noun (m)",
        pronunciation_vi: "il ko-MOO-ne — nơi làm `residenza` và hộ tịch",
        pronunciation_en: "il ko-MOO-ne — where you do `residenza` and civil records",
      },
      {
        word: "la questura",
        en: "police headquarters (immigration office)",
        vi: "sở cảnh sát / phòng quản lý nhập cư",
        pos: "noun (f)",
        pronunciation_vi: "la kwes-TOO-ra — nơi làm `permesso di soggiorno`",
        pronunciation_en: "la kwes-TOO-ra — where you handle the `permesso di soggiorno`",
      },
      {
        word: "lo sportello",
        en: "counter / service window",
        vi: "quầy giao dịch",
        pos: "noun (m)",
        pronunciation_vi: "lo spor-TEL-lo — dùng `lo` trước `sp-`; lấy số rồi chờ gọi",
        pronunciation_en: "lo spor-TEL-lo — takes `lo` before `sp-`; grab a ticket and wait",
      },
      {
        word: "l'ufficio",
        en: "office (public office)",
        vi: "văn phòng",
        pos: "noun (m)",
        pronunciation_vi: "loof-FEE-cho — phụ âm đôi `ff`",
        pronunciation_en: "loof-FEE-cho — double `ff`",
      },
      {
        word: "il funzionario",
        en: "official / clerk handling paperwork",
        vi: "công chức",
        pos: "noun (m)",
        pronunciation_vi: "il foon-tsyo-NA-ryo — người xử lý hồ sơ",
        pronunciation_en: "il foon-tsyo-NA-ryo — the person handling your file",
      },
      // Documents and items
      {
        word: "il codice fiscale",
        en: "tax code (personal ID number)",
        vi: "mã số thuế",
        pos: "noun (m)",
        pronunciation_vi: "il KO-dee-che fee-SKA-le — đừng nói `codice tassa`",
        pronunciation_en: "il KO-dee-che fee-SKA-le — not `codice tassa`",
      },
      {
        word: "il permesso di soggiorno",
        en: "residence permit",
        vi: "giấy phép cư trú",
        pos: "noun (m)",
        pronunciation_vi: "il per-MES-so dee sod-JOR-no — không bao giờ gọi tắt `permesso`",
        pronunciation_en: "il per-MES-so dee sod-JOR-no — never clip it to `permesso`",
      },
      {
        word: "la residenza",
        en: "(registered) residence",
        vi: "đăng ký cư trú",
        pos: "noun (f)",
        pronunciation_vi: "la re-zee-DEN-tsa — văn cảnh trang trọng dùng `richiedere`",
        pronunciation_en: "la re-zee-DEN-tsa — formal context uses `richiedere`",
      },
      {
        word: "una marca da bollo",
        en: "revenue stamp",
        vi: "tem thuế",
        pos: "noun (f)",
        pronunciation_vi: "OO-na MAR-ka da BOL-lo — mua ở `tabaccheria`",
        pronunciation_en: "OO-na MAR-ka da BOL-lo — bought at a `tabaccheria`",
      },
      {
        word: "il modulo",
        en: "form",
        vi: "mẫu đơn",
        pos: "noun (m)",
        pronunciation_vi: "il MO-doo-lo — `compilare il modulo` = điền đơn",
        pronunciation_en: "il MO-doo-lo — `compilare il modulo` = fill in the form",
      },
      {
        word: "la pratica",
        en: "case / file / procedure",
        vi: "hồ sơ / thủ tục",
        pos: "noun (f)",
        pronunciation_vi: "la PRA-tee-ka — `Sono qui per la pratica della…`",
        pronunciation_en: "la PRA-tee-ka — `Sono qui per la pratica della…`",
      },
      {
        word: "la ricevuta",
        en: "receipt / proof of submission",
        vi: "biên nhận",
        pos: "noun (f)",
        pronunciation_vi: "la ree-che-VOO-ta — LUÔN xin và giữ lại",
        pronunciation_en: "la ree-che-VOO-ta — ALWAYS ask for it and keep it",
      },
      {
        word: "la firma",
        en: "signature",
        vi: "chữ ký",
        pos: "noun (f)",
        pronunciation_vi: "la FEER-ma — động từ là `firmare`",
        pronunciation_en: "la FEER-ma — the verb is `firmare`",
      },
      {
        word: "la copia",
        en: "copy",
        vi: "bản sao",
        pos: "noun (f)",
        pronunciation_vi: "la KO-pya — cũng có `la fotocopia` (bản photo)",
        pronunciation_en: "la KO-pya — also `la fotocopia` (a photocopy)",
      },
      {
        word: "l'originale",
        en: "original",
        vi: "bản gốc",
        pos: "noun (m)",
        pronunciation_vi: "lo-ree-jee-NA-le — thường phải mang KÈM bản sao",
        pronunciation_en: "lo-ree-jee-NA-le — usually brought WITH the copy",
      },
      {
        word: "l'autocertificazione",
        en: "self-declaration",
        vi: "giấy tự khai",
        pos: "noun (f)",
        pronunciation_vi: "lau-to-cher-tee-fee-ka-TSYO-ne — thuật ngữ hành chính thông dụng",
        pronunciation_en: "lau-to-cher-tee-fee-ka-TSYO-ne — a common administrative term",
      },
      // Action verbs
      {
        word: "compilare",
        en: "to fill in (a form)",
        vi: "điền đơn",
        pos: "verb",
        pronunciation_vi: "kom-pee-LA-re — `compilare il modulo`",
        pronunciation_en: "kom-pee-LA-re — `compilare il modulo`",
      },
      {
        word: "allegare",
        en: "to attach (a file)",
        vi: "đính kèm",
        pos: "verb",
        pronunciation_vi: "al-le-GA-re — quá khứ `ho allegato`",
        pronunciation_en: "al-le-GA-re — past `ho allegato`",
      },
      {
        word: "presentare",
        en: "to submit / present",
        vi: "nộp / trình",
        pos: "verb",
        pronunciation_vi: "pre-zen-TA-re — `presentare la pratica` = nộp hồ sơ",
        pronunciation_en: "pre-zen-TA-re — `presentare la pratica` = submit the file",
      },
      {
        word: "rinnovare",
        en: "to renew",
        vi: "gia hạn",
        pos: "verb",
        pronunciation_vi: "reen-no-VA-re — `rinnovare il permesso di soggiorno`",
        pronunciation_en: "reen-no-VA-re — `rinnovare il permesso di soggiorno`",
      },
      {
        word: "firmare",
        en: "to sign",
        vi: "ký tên",
        pos: "verb",
        pronunciation_vi: "feer-MA-re — `Dove devo firmare?`",
        pronunciation_en: "feer-MA-re — `Dove devo firmare?`",
      },
    ],
    dialogue: [
      // Dialogue: At the comune
      {
        speaker: "Cittadino",
        text: "Buongiorno, sono qui per la pratica della residenza.",
        vi: "Xin chào, tôi đến đây vì hồ sơ cư trú.",
        en: "Good morning, I'm here for the residence file.",
      },
      {
        speaker: "Funzionario",
        text: "Ha prenotato un appuntamento?",
        vi: "Anh/chị đã đặt lịch hẹn chưa?",
        en: "Did you book an appointment?",
      },
      {
        speaker: "Cittadino",
        text: "Sì, alle nove. Ho anche il codice fiscale.",
        vi: "Có, lúc chín giờ. Tôi cũng có mã số thuế.",
        en: "Yes, at nine. I also have my tax code.",
      },
      {
        speaker: "Funzionario",
        text: "Perfetto, mi dia la documentazione.",
        vi: "Tốt, hãy đưa tôi giấy tờ.",
        en: "Perfect, give me the documentation.",
      },
      // Dialogue: Missing document
      {
        speaker: "Cittadino",
        text: "Mi manca una copia del contratto di affitto.",
        vi: "Tôi thiếu một bản sao hợp đồng thuê nhà.",
        en: "I'm missing a copy of the rental contract.",
      },
      {
        speaker: "Funzionario",
        text: "Può inviarla via email oggi?",
        vi: "Anh/chị có thể gửi qua email hôm nay không?",
        en: "Can you send it by email today?",
      },
      {
        speaker: "Cittadino",
        text: "Sì, certo. Ho già allegato il file.",
        vi: "Vâng, chắc chắn. Tôi đã đính kèm tệp rồi.",
        en: "Yes, of course. I've already attached the file.",
      },
      {
        speaker: "Funzionario",
        text: "Bene, allora aspetti la conferma.",
        vi: "Tốt, vậy hãy chờ xác nhận.",
        en: "Good, then wait for the confirmation.",
      },
      // Dialogue: Renewing the permit
      {
        speaker: "Funzionario",
        text: "Buongiorno, mi dica.",
        vi: "Xin chào, anh/chị cần gì?",
        en: "Good morning, how can I help?",
      },
      {
        speaker: "Cittadino",
        text: "Devo rinnovare il permesso di soggiorno.",
        vi: "Tôi phải gia hạn giấy phép cư trú.",
        en: "I need to renew my residence permit.",
      },
      {
        speaker: "Funzionario",
        text: "Ha portato il passaporto e la fotocopia?",
        vi: "Anh/chị đã mang hộ chiếu và bản sao chưa?",
        en: "Did you bring your passport and the photocopy?",
      },
      {
        speaker: "Cittadino",
        text: "Sì, ma mi manca la ricevuta.",
        vi: "Có, nhưng tôi còn thiếu biên nhận.",
        en: "Yes, but I'm missing the receipt.",
      },
      {
        speaker: "Funzionario",
        text: "Può tornare con il documento mancante?",
        vi: "Anh/chị có thể quay lại với giấy tờ còn thiếu không?",
        en: "Can you come back with the missing document?",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi có lịch hẹn lúc 9 giờ.", answer: "Ho un appuntamento alle nove." },
          { prompt: "Tôi thiếu một giấy tờ.", answer: "Mi manca un documento." },
          { prompt: "Tôi phải điền mẫu đơn.", answer: "Devo compilare il modulo." },
          { prompt: "Tôi muốn xin đăng ký cư trú.", answer: "Vorrei richiedere la residenza." },
          { prompt: "Có lỗi trong giấy tờ.", answer: "C'è un errore nel documento." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Ý:",
        instruction_en: "Extra practice — translate into Italian:",
        items: [
          { prompt: "Tôi phải gia hạn giấy phép cư trú.", answer: "Devo rinnovare il permesso di soggiorno." },
          { prompt: "Tôi cần bản sao hộ chiếu.", answer: "Mi serve una fotocopia del passaporto." },
          { prompt: "Tôi còn thiếu biên nhận.", answer: "Mi manca la ricevuta." },
          { prompt: "Tôi muốn nộp hồ sơ hôm nay.", answer: "Vorrei presentare la pratica oggi." },
          { prompt: "Có lỗi trong mẫu đơn.", answer: "C'è un errore nel modulo." },
          { prompt: "Tôi có thể gửi qua email không?", answer: "Posso mandarlo via email?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Đối chiếu Anh → Ý (luyện phản xạ):",
        instruction_en: "English → Italian (reflex drill):",
        items: [
          { prompt: "I have an appointment at nine.", answer: "Ho un appuntamento alle nove." },
          { prompt: "I need a copy of the receipt.", answer: "Mi serve una copia della ricevuta." },
          { prompt: "Where do I sign?", answer: "Dove devo firmare?" },
          { prompt: "I am here for the residence application.", answer: "Sono qui per la pratica della residenza." },
          { prompt: "I have already attached the file.", answer: "Ho già allegato il file." },
        ],
      },
      {
        type: "model_email",
        instruction_vi:
          "Viết email 3 dòng: (1) nói bạn có lịch hẹn; (2) báo thiếu một giấy tờ; (3) hỏi có thể gửi qua email không.",
        instruction_en:
          "Write a 3-line email: (1) say you have an appointment; (2) report one missing document; (3) ask if you can send it by email.",
        example:
          "Buongiorno, ho un appuntamento per la pratica della residenza, ma mi manca una copia del contratto di affitto. Posso inviarla via email oggi? Grazie per la disponibilità.",
        example_vi:
          "Xin chào, tôi có lịch hẹn về hồ sơ cư trú, nhưng tôi thiếu một bản sao hợp đồng thuê nhà. Tôi có thể gửi qua email hôm nay không? Cảm ơn vì sự hỗ trợ.",
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi điện/đến quầy — điền chỗ trống theo đúng thứ tự: `Buongiorno, sono qui per ___. Ho ___. Mi manca ___. Posso ___?`",
        instruction_en:
          "Counter/phone frame — fill the blanks in order: `Buongiorno, sono qui per ___. Ho ___. Mi manca ___. Posso ___?`",
        example:
          "Buongiorno, sono qui per la pratica della residenza. Ho il codice fiscale e il passaporto. Mi manca la ricevuta. Posso inviarla via email?",
        example_vi:
          "Xin chào, tôi đến đây vì hồ sơ cư trú. Tôi có mã số thuế và hộ chiếu. Tôi còn thiếu biên nhận. Tôi có thể gửi qua email không?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Self-check — can you do each one?",
        items: [
          {
            vi: "Tôi có thể gọi tên các giấy tờ và quầy giao dịch thông dụng.",
            en: "I can name common documents and service counters.",
          },
          {
            vi: "Tôi có thể hỏi về việc ký tên và xin bản sao.",
            en: "I can ask about signing and request copies.",
          },
          {
            vi: "Tôi có thể nói đính kèm / gửi / chờ xác nhận bằng tiếng Ý.",
            en: "I can say attach / send / await confirmation in Italian.",
          },
          {
            vi: "Tôi có thể đóng vai một cuộc trao đổi ngắn ở cơ quan.",
            en: "I can roleplay a short office exchange.",
          },
          {
            vi: "Tôi có thể viết một email ngắn báo thiếu giấy tờ.",
            en: "I can write a short missing-document email.",
          },
          {
            vi: "Tôi giữ giọng điệu trang trọng, ngắn gọn (`vorrei`, `Lei`).",
            en: "I keep a polite, concise office tone (`vorrei`, `Lei`).",
          },
        ],
      },
      {
        type: "rubric",
        instruction_vi: "Thang tự đánh giá (1–5):",
        instruction_en: "Self-assessment scale (1–5):",
        items: [
          { score: 1, vi: "Chưa gọi đúng tên giấy tờ.", en: "Cannot name documents correctly." },
          {
            score: 2,
            vi: "Gọi được tên giấy tờ nhưng chưa nêu được lý do đến.",
            en: "Can name documents but not state the reason for coming.",
          },
          {
            score: 3,
            vi: "Có thể báo thiếu giấy tờ và xin thứ cần.",
            en: "Can report a missing document and request what's needed.",
          },
          {
            score: 4,
            vi: "Xử lý ngôn ngữ email/quầy chính xác, đúng giới từ và mạo từ.",
            en: "Can handle email/counter language accurately, with correct prepositions and articles.",
          },
          {
            score: 5,
            vi: "Xử lý cả cuộc làm việc ở cơ quan bình tĩnh, lịch sự và chính xác.",
            en: "Can manage a full office interaction calmly, politely, and precisely.",
          },
        ],
      },
    ],
  },
];

export default lessons;
