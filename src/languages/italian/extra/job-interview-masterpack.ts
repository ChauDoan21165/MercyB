// E1 — Italian Job Interview Masterpack (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/E1-italian-job-interview-masterpack.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts. When the Italian registry lands, swap the
// local types for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same order.

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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "italian_job_interview_masterpack_e1",
    level: "A2",
    category: "work",
    title_vi: "Phỏng vấn xin việc tiếng Ý",
    title_en: "Italian job interview masterpack",
    sentences: [
      // ── Core interview phrases ──────────────────────────────────────────
      {
        en: "Buongiorno, mi chiamo ___.",
        vi: "Xin chào, tôi tên là ___.",
        pronunciation_focus: [
          "bwon-JOR-no, mee KYA-mo — lời chào trang trọng, an toàn cho phỏng vấn.",
          "Lỗi người Việt: mở đầu bằng `ciao` trong bối cảnh trang trọng — quá thân mật.",
          "Drill: nói cả câu kèm tên của bạn: `Buongiorno, mi chiamo Minh.`",
        ],
        pronunciation_focus_en: [
          "bwon-JOR-no, mee KYA-mo — formal greeting; safe for interviews.",
          "VN-speaker trap: starting with `ciao` in a formal context — too casual.",
          "Drill: say the full phrase with your name: `Buongiorno, mi chiamo Minh.`",
        ],
      },
      {
        en: "Grazie per l'opportunità.",
        vi: "Cảm ơn vì cơ hội này.",
        pronunciation_focus: [
          "GRA-tsee-e per lop-por-too-nee-TÀ — `opportunità` nhấn vần cuối (có dấu à).",
          "Lỗi người Việt: chỉ nói `grazie` rồi dừng — nghe cụt.",
          "Drill: thêm một câu sau lời cảm ơn: `Grazie per l'opportunità. Sono contento di essere qui.`",
        ],
        pronunciation_focus_en: [
          "GRA-tsee-e per lop-por-too-nee-TAH — `opportunità` carries final-syllable stress (the à accent).",
          "VN-speaker trap: saying only `grazie` and stopping — sounds abrupt.",
          "Drill: add one sentence after the thanks: `Grazie per l'opportunità. Sono contento di essere qui.`",
        ],
      },
      {
        en: "Ho esperienza in ___.",
        vi: "Tôi có kinh nghiệm trong ___.",
        pronunciation_focus: [
          "o es-pe-ree-EN-tsa een — dùng `esperienza in` + lĩnh vực.",
          "Lỗi người Việt: dùng `esperienza di` cho mọi trường hợp — sai giới từ.",
          "Drill: `Ho esperienza in magazzino / edilizia / vendita.`",
        ],
        pronunciation_focus_en: [
          "o es-pe-ree-EN-tsa een — use `esperienza in` + the sector.",
          "VN-speaker trap: using `esperienza di` for every case — wrong preposition.",
          "Drill: `Ho esperienza in magazzino / edilizia / vendita.`",
        ],
      },
      {
        en: "Ho lavorato come ___.",
        vi: "Tôi đã làm việc với vai trò ___.",
        pronunciation_focus: [
          "o la-vo-RA-to KO-me — `come` = với vai trò / như là.",
          "Lỗi người Việt: dịch chữ `như` quá sát ở chỗ khác — chỉ cần `come` ở đây.",
          "Drill: `Ho lavorato come operaio.`",
        ],
        pronunciation_focus_en: [
          "o la-vo-RA-to KO-me — `come` = 'as' (in the role of).",
          "VN-speaker trap: translating 'như' too literally elsewhere — here just use `come`.",
          "Drill: `Ho lavorato come operaio.`",
        ],
      },
      {
        en: "Sono una persona puntuale.",
        vi: "Tôi là người đúng giờ.",
        pronunciation_focus: [
          "SO-no OO-na per-SO-na poon-too-A-le — `persona` giống cái, tính từ hợp với `persona`.",
          "Lỗi người Việt: nói `sono puntuale persona` — sai trật tự từ.",
          "Drill: học cả cụm: `Sono una persona puntuale.`",
        ],
        pronunciation_focus_en: [
          "SO-no OO-na per-SO-na poon-too-A-le — `persona` is feminine; the adjective agrees with `persona`.",
          "VN-speaker trap: saying `sono puntuale persona` — wrong word order.",
          "Drill: learn it as one chunk: `Sono una persona puntuale.`",
        ],
      },
      {
        en: "Imparo velocemente.",
        vi: "Tôi học nhanh.",
        pronunciation_focus: [
          "eem-PA-ro ve-lo-tche-MEN-te — câu nói điểm mạnh rất hữu ích.",
          "Lỗi người Việt: nói `studio veloce` — sai cả động từ lẫn trạng từ.",
          "Drill: `Imparo velocemente e ascolto le istruzioni.`",
        ],
        pronunciation_focus_en: [
          "eem-PA-ro ve-lo-tche-MEN-te — a useful strength phrase.",
          "VN-speaker trap: saying `studio veloce` — wrong verb and wrong adverb.",
          "Drill: `Imparo velocemente e ascolto le istruzioni.`",
        ],
      },
      {
        en: "Posso lavorare su turni.",
        vi: "Tôi có thể làm theo ca.",
        pronunciation_focus: [
          "POS-so la-vo-RA-re soo TOOR-nee — `su turni` = làm việc theo ca.",
          "Lỗi người Việt: nói `in turni` — sai giới từ.",
          "Drill: `Posso lavorare su turni.`",
        ],
        pronunciation_focus_en: [
          "POS-so la-vo-RA-re soo TOOR-nee — `su turni` = shift work.",
          "VN-speaker trap: saying `in turni` — wrong preposition.",
          "Drill: `Posso lavorare su turni.`",
        ],
      },
      {
        en: "Sono disponibile da subito.",
        vi: "Tôi có thể bắt đầu ngay.",
        pronunciation_focus: [
          "SO-no dis-po-NEE-bee-le da SOO-bee-to — cụm cố định trong phỏng vấn.",
          "Lỗi người Việt: chỉ nói `sono libero subito` — `disponibile` mới đúng ngữ cảnh việc làm.",
          "Drill: `Sono disponibile da subito.`",
        ],
        pronunciation_focus_en: [
          "SO-no dis-po-NEE-bee-le da SOO-bee-to — a fixed interview phrase.",
          "VN-speaker trap: saying just `sono libero subito` — `disponibile` is the work-context word.",
          "Drill: `Sono disponibile da subito.`",
        ],
      },
      {
        en: "Vorrei sapere l'orario di lavoro.",
        vi: "Tôi muốn biết giờ làm.",
        pronunciation_focus: [
          "vor-RAY sa-PE-re lo-RA-ree-o dee la-VO-ro — `vorrei sapere` lịch sự (thể điều kiện).",
          "Lỗi người Việt: hỏi quá trực tiếp `qual è l'orario?` — nghe hơi gắt.",
          "Drill: nói lại với giọng bình tĩnh: `Vorrei sapere l'orario di lavoro.`",
        ],
        pronunciation_focus_en: [
          "vor-RAY sa-PE-re lo-RA-ree-o dee la-VO-ro — `vorrei sapere` is polite (conditional mood).",
          "VN-speaker trap: asking too directly `qual è l'orario?` — sounds blunt.",
          "Drill: repeat with a calm tone: `Vorrei sapere l'orario di lavoro.`",
        ],
      },
      {
        en: "Quale tipo di contratto offrite?",
        vi: "Anh/chị cung cấp loại hợp đồng nào?",
        pronunciation_focus: [
          "KWA-le TEE-po dee kon-TRAT-to of-FREE-te — câu hỏi trang trọng dành cho nhà tuyển dụng.",
          "Lỗi người Việt: dùng thể thân mật `dai contratto?` — phỏng vấn cần thể `voi`.",
          "Drill: học thuộc cả câu: `Quale tipo di contratto offrite?`",
        ],
        pronunciation_focus_en: [
          "KWA-le TEE-po dee kon-TRAT-to of-FREE-te — a formal question for the employer.",
          "VN-speaker trap: using the informal `dai contratto?` — interviews need the `voi` form.",
          "Drill: memorize the full question: `Quale tipo di contratto offrite?`",
        ],
      },

      // ── Experience bank ─────────────────────────────────────────────────
      {
        en: "Ho lavorato in un magazzino.",
        vi: "Tôi đã làm trong kho.",
        pronunciation_focus: [
          "o la-vo-RA-to een oon ma-gad-DZEE-no — `in un magazzino` = trong một cái kho.",
          "Lỗi người Việt: chêm tiếng Anh `warehouse` — hãy dùng `magazzino`.",
          "Drill: đổi nơi làm: ufficio (văn phòng), ristorante (nhà hàng), fabbrica (nhà máy).",
        ],
        pronunciation_focus_en: [
          "o la-vo-RA-to een oon ma-gad-DZEE-no — `in un magazzino` = in a warehouse.",
          "VN-speaker trap: dropping in the English 'warehouse' — use `magazzino`.",
          "Drill: change the place: ufficio (office), ristorante (restaurant), fabbrica (factory).",
        ],
      },
      {
        en: "Mi occupavo di preparare gli ordini.",
        vi: "Tôi phụ trách chuẩn bị đơn hàng.",
        pronunciation_focus: [
          "mee ok-koo-PA-vo dee pre-pa-RA-re lyee OR-dee-nee — `mi occupavo di` + động từ nguyên thể.",
          "Lỗi người Việt: nói `io responsabile preparare` — thiếu động từ chia.",
          "Drill: tập cụm `mi occupavo di...` rồi gắn việc của bạn.",
        ],
        pronunciation_focus_en: [
          "mee ok-koo-PA-vo dee pre-pa-RA-re lyee OR-dee-nee — `mi occupavo di` + infinitive.",
          "VN-speaker trap: saying `io responsabile preparare` — no conjugated verb.",
          "Drill: drill the frame `mi occupavo di...` then attach your task.",
        ],
      },
      {
        en: "Usavo il muletto con autorizzazione.",
        vi: "Tôi dùng xe nâng khi được phép.",
        pronunciation_focus: [
          "oo-ZA-vo eel moo-LET-to kon ow-to-reed-dza-TSYO-ne — câu về an toàn / pháp lý.",
          "Lỗi người Việt: nói `uso muletto` thiếu mạo từ `il`.",
          "Drill: luôn thêm `con autorizzazione` (khi được phép).",
        ],
        pronunciation_focus_en: [
          "oo-ZA-vo eel moo-LET-to kon ow-to-reed-dza-TSYO-ne — a safety/legal phrase.",
          "VN-speaker trap: saying `uso muletto` without the article `il`.",
          "Drill: always add `con autorizzazione` (with authorization).",
        ],
      },
      {
        en: "Parlavo con i clienti ogni giorno.",
        vi: "Tôi nói chuyện với khách hàng mỗi ngày.",
        pronunciation_focus: [
          "par-LA-vo kon ee klee-EN-tee O-nyee JOR-no — thì imperfetto cho việc lặp lại trong quá khứ.",
          "Lỗi người Việt: dùng thì hiện tại để kể kinh nghiệm cũ.",
          "Drill: dùng `parlavo`, không chỉ `parlo`.",
        ],
        pronunciation_focus_en: [
          "par-LA-vo kon ee klee-EN-tee O-nyee JOR-no — imperfect tense for a repeated past action.",
          "VN-speaker trap: using the present tense to describe past experience.",
          "Drill: use `parlavo`, not only `parlo`.",
        ],
      },
      {
        en: "Ho gestito pagamenti e ricevute.",
        vi: "Tôi đã xử lý thanh toán và biên lai.",
        pronunciation_focus: [
          "o jes-TEE-to pa-ga-MEN-tee e ree-tche-VOO-te — `gestire` là động từ hữu ích cho văn phòng/bán lẻ.",
          "Lỗi người Việt: né dùng quá khứ phân từ (participio).",
          "Drill: lặp lại `ho gestito`.",
        ],
        pronunciation_focus_en: [
          "o jes-TEE-to pa-ga-MEN-tee e ree-tche-VOO-te — `gestire` is a useful office/retail verb.",
          "VN-speaker trap: avoiding the past participle.",
          "Drill: repeat `ho gestito`.",
        ],
      },
      {
        en: "Ho seguito le norme di sicurezza.",
        vi: "Tôi đã tuân thủ quy định an toàn.",
        pronunciation_focus: [
          "o se-GWEE-to le NOR-me dee see-koo-RET-tsa — `seguire le norme` = tuân theo quy định.",
          "Lỗi người Việt: dịch thành `fare regole` — sai động từ.",
          "Drill: học thuộc cả cụm `ho seguito le norme di sicurezza`.",
        ],
        pronunciation_focus_en: [
          "o se-GWEE-to le NOR-me dee see-koo-RET-tsa — `seguire le norme` = to follow the rules.",
          "VN-speaker trap: translating it as `fare regole` — wrong verb.",
          "Drill: memorize the whole chunk `ho seguito le norme di sicurezza`.",
        ],
      },
      {
        en: "Ho imparato a lavorare in squadra.",
        vi: "Tôi đã học cách làm việc nhóm.",
        pronunciation_focus: [
          "o eem-pa-RA-to a la-vo-RA-re een SKWA-dra — `imparare a` + động từ nguyên thể.",
          "Lỗi người Việt: bỏ quên giới từ `a`.",
          "Drill: `Ho imparato a...` rồi gắn kỹ năng.",
        ],
        pronunciation_focus_en: [
          "o eem-pa-RA-to a la-vo-RA-re een SKWA-dra — `imparare a` + infinitive.",
          "VN-speaker trap: dropping the preposition `a`.",
          "Drill: `Ho imparato a...` then attach the skill.",
        ],
      },
      {
        en: "So usare il computer.",
        vi: "Tôi biết dùng máy tính.",
        pronunciation_focus: [
          "so oo-ZA-re eel kom-POO-ter — `sapere` + nguyên thể diễn đạt khả năng.",
          "Lỗi người Việt: nói `conosco usare` — `conoscere` không dùng kiểu này.",
          "Drill: `So usare...` rồi gắn công cụ.",
        ],
        pronunciation_focus_en: [
          "so oo-ZA-re eel kom-POO-ter — `sapere` + infinitive expresses ability.",
          "VN-speaker trap: saying `conosco usare` — `conoscere` doesn't work this way.",
          "Drill: `So usare...` then attach the tool.",
        ],
      },
      {
        en: "Sto migliorando il mio italiano.",
        vi: "Tôi đang cải thiện tiếng Ý.",
        pronunciation_focus: [
          "sto mee-lyo-RAN-do eel MEE-o ee-ta-LYA-no — câu thành thật về trình độ ngôn ngữ.",
          "Lỗi người Việt: nói quá về độ thành thạo.",
          "Drill: thêm trình độ một cách thành thật (livello A2, B1...).",
        ],
        pronunciation_focus_en: [
          "sto mee-lyo-RAN-do eel MEE-o ee-ta-LYA-no — an honest phrase about your language level.",
          "VN-speaker trap: overclaiming fluency.",
          "Drill: add your level honestly (livello A2, B1...).",
        ],
      },
      {
        en: "Posso portare referenze.",
        vi: "Tôi có thể cung cấp người tham khảo.",
        pronunciation_focus: [
          "POS-so por-TA-re re-fe-REN-tse — câu dùng trong phỏng vấn / hồ sơ.",
          "Lỗi người Việt: không biết từ `referenze` (người tham khảo).",
          "Drill: hỏi lại: `Servono referenze?` (Có cần người tham khảo không?)",
        ],
        pronunciation_focus_en: [
          "POS-so por-TA-re re-fe-REN-tse — an interview/application phrase.",
          "VN-speaker trap: not knowing the word `referenze` (references).",
          "Drill: ask back: `Servono referenze?` (Are references needed?)",
        ],
      },

      // ── Strengths and weaknesses ────────────────────────────────────────
      {
        en: "Sono affidabile.",
        vi: "Tôi đáng tin cậy.",
        pronunciation_focus: [
          "SO-no af-fee-DA-bee-le — tính từ giá trị cao trong phỏng vấn.",
          "Lỗi người Việt: chỉ nói `sono buono` — quá chung chung.",
          "Drill: dùng `affidabile`.",
        ],
        pronunciation_focus_en: [
          "SO-no af-fee-DA-bee-le — a high-value interview adjective.",
          "VN-speaker trap: saying only `sono buono` — too generic.",
          "Drill: use `affidabile`.",
        ],
      },
      {
        en: "Sono preciso/a.",
        vi: "Tôi cẩn thận/chính xác.",
        pronunciation_focus: [
          "SO-no pre-TCHEE-zo (nam) / pre-TCHEE-za (nữ) — tính từ hợp giống với người nói.",
          "Lỗi người Việt: quên đổi `precisa` khi người nói là nữ.",
          "Drill: chọn đúng dạng giống của bạn.",
        ],
        pronunciation_focus_en: [
          "SO-no pre-TCHEE-zo (male) / pre-TCHEE-za (female) — the adjective agrees with the speaker.",
          "VN-speaker trap: forgetting `precisa` for a female speaker.",
          "Drill: choose your gender form.",
        ],
      },
      {
        en: "Lavoro bene sotto pressione.",
        vi: "Tôi làm tốt dưới áp lực.",
        pronunciation_focus: [
          "la-VO-ro BE-ne SOT-to pres-SYO-ne — cụm cố định.",
          "Lỗi người Việt: dịch `áp lực` quá sát theo nghĩa đen.",
          "Drill: lặp lại như một cụm cố định.",
        ],
        pronunciation_focus_en: [
          "la-VO-ro BE-ne SOT-to pres-SYO-ne — a fixed phrase.",
          "VN-speaker trap: translating 'pressure' too literally.",
          "Drill: repeat it as a chunk.",
        ],
      },
      {
        en: "Mi piace imparare cose nuove.",
        vi: "Tôi thích học điều mới.",
        pronunciation_focus: [
          "mee PYA-tche eem-pa-RA-re KO-ze NWO-ve — điểm mạnh tự nhiên.",
          "Lỗi người Việt: nói `mi piace studio` — sau `mi piace` cần động từ nguyên thể.",
          "Drill: `mi piace` + nguyên thể.",
        ],
        pronunciation_focus_en: [
          "mee PYA-tche eem-pa-RA-re KO-ze NWO-ve — a natural strength.",
          "VN-speaker trap: saying `mi piace studio` — `mi piace` takes an infinitive.",
          "Drill: `mi piace` + infinitive.",
        ],
      },
      {
        en: "A volte ho bisogno di più tempo per parlare italiano.",
        vi: "Đôi khi tôi cần thêm thời gian để nói tiếng Ý.",
        pronunciation_focus: [
          "a VOL-te o bee-ZO-nyo dee pyoo TEM-po per par-LA-re ee-ta-LYA-no — điểm yếu được nói khéo, có kiểm soát.",
          "Lỗi người Việt: nói `il mio italiano è male` — nghe tiêu cực và sai ngữ pháp.",
          "Drill: dùng bản tích cực ở trên.",
        ],
        pronunciation_focus_en: [
          "a VOL-te o bee-ZO-nyo dee pyoo TEM-po per par-LA-re ee-ta-LYA-no — an honest, controlled weakness.",
          "VN-speaker trap: saying `il mio italiano è male` — negative and ungrammatical.",
          "Drill: use the constructive version above.",
        ],
      },
      {
        en: "Quando non capisco, chiedo conferma.",
        vi: "Khi không hiểu, tôi hỏi xác nhận.",
        pronunciation_focus: [
          "KWAN-do non ka-PEES-ko, KYE-do kon-FER-ma — biến điểm yếu thành hành vi an toàn.",
          "Lỗi người Việt: im lặng khi không hiểu.",
          "Drill: học thuộc cả câu.",
        ],
        pronunciation_focus_en: [
          "KWAN-do non ka-PEES-ko, KYE-do kon-FER-ma — turns a weakness into a safety behavior.",
          "VN-speaker trap: staying silent when you don't understand.",
          "Drill: memorize the full sentence.",
        ],
      },
    ],
    cultural_notes_vi:
      "Phỏng vấn ở Ý thường theo trình tự: (1) chào hỏi và giới thiệu bản thân, (2) kinh nghiệm làm việc, (3) kỹ năng và điểm mạnh, (4) thời gian rảnh và loại hợp đồng, (5) lương và lịch làm, (6) câu hỏi cho nhà tuyển dụng, (7) kết thúc và liên hệ lại. Người Ý đánh giá cao thái độ trang trọng ở lần gặp đầu: dùng thể `Lei`/`voi`, không dùng `tu`. Đúng giờ (`puntuale`) và tính đáng tin cậy (`affidabile`) là hai phẩm chất được nhắc nhiều nhất. Với công việc tay nghề (kho, xây dựng, bán lẻ), nhà tuyển dụng thường hỏi về giấy phép (vd. lái xe nâng) và người tham khảo (`referenze`).",
    cultural_notes_en:
      "Italian interviews usually follow a sequence: (1) greeting and self-introduction, (2) work experience, (3) skills and strengths, (4) availability and contract type, (5) salary and schedule, (6) questions for the employer, (7) closing and follow-up. Italians value a formal register in a first meeting: use the `Lei`/`voi` forms, not `tu`. Punctuality (`puntuale`) and reliability (`affidabile`) are the two most-cited qualities. For practical jobs (warehouse, construction, retail), employers often ask about certifications (e.g. a forklift license) and references (`referenze`).",
    tip_advice_vi:
      "Chuẩn bị sẵn một bài giới thiệu 5 câu và học thuộc như một khối: tên → kinh nghiệm → một điểm mạnh → thời gian bắt đầu → một câu hỏi cho nhà tuyển dụng. Đừng cố nói trôi chảy giả tạo; câu `Sto migliorando il mio italiano` (Tôi đang cải thiện tiếng Ý) thành thật và được đánh giá tốt hơn là khoe quá mức. Khi không hiểu, đừng im lặng — nói `Non ho capito, può ripetere?` ngay. Luôn dùng `vorrei` (tôi muốn) thay vì `voglio` (tôi muốn — nghe như ra lệnh) khi đặt câu hỏi.",
    tip_advice_en:
      "Prepare a 5-sentence introduction and drill it as one block: name → experience → one strength → availability → one question for the employer. Don't fake fluency; the honest line `Sto migliorando il mio italiano` ('I'm improving my Italian') lands better than overclaiming. When you don't understand, don't go silent — say `Non ho capito, può ripetere?` straight away. Always use `vorrei` ('I'd like') rather than `voglio` ('I want', which sounds like an order) when asking questions.",
    vocabulary: [
      {
        word: "l'esperienza",
        en: "experience",
        vi: "kinh nghiệm",
        pos: "noun (f)",
        pronunciation_vi: "le-spe-RYEN-tsa — `z` đọc như `ts`",
        pronunciation_en: "le-spe-RYEN-tsa — `z` is a 'ts' sound",
      },
      {
        word: "il contratto",
        en: "contract",
        vi: "hợp đồng",
        pos: "noun (m)",
        pronunciation_vi: "eel kon-TRAT-to — `tt` đọc gấp đôi, dừng nhẹ",
        pronunciation_en: "eel kon-TRAT-to — double `tt`, hold the stop",
      },
      {
        word: "il turno",
        en: "shift",
        vi: "ca làm",
        pos: "noun (m)",
        pronunciation_vi: "eel TOOR-no",
        pronunciation_en: "eel TOOR-no",
      },
      {
        word: "lo stipendio",
        en: "salary",
        vi: "lương",
        pos: "noun (m)",
        pronunciation_vi: "lo stee-PEN-dyo",
        pronunciation_en: "lo stee-PEN-dyo",
      },
      {
        word: "le referenze",
        en: "references",
        vi: "người/thư tham khảo",
        pos: "noun (f pl)",
        pronunciation_vi: "le re-fe-REN-tse",
        pronunciation_en: "le re-fe-REN-tse",
      },
      {
        word: "affidabile",
        en: "reliable",
        vi: "đáng tin cậy",
        pos: "adjective",
        pronunciation_vi: "af-fee-DA-bee-le",
        pronunciation_en: "af-fee-DA-bee-le",
      },
      {
        word: "puntuale",
        en: "punctual",
        vi: "đúng giờ",
        pos: "adjective",
        pronunciation_vi: "poon-too-A-le",
        pronunciation_en: "poon-too-A-le",
      },
      {
        word: "disponibile",
        en: "available",
        vi: "sẵn sàng / rảnh",
        pos: "adjective",
        pronunciation_vi: "dis-po-NEE-bee-le",
        pronunciation_en: "dis-po-NEE-bee-le",
      },
      {
        word: "l'orario di lavoro",
        en: "working hours",
        vi: "giờ làm việc",
        pos: "noun (m)",
        pronunciation_vi: "lo-RA-ree-o dee la-VO-ro",
        pronunciation_en: "lo-RA-ree-o dee la-VO-ro",
      },
      {
        word: "il magazzino",
        en: "warehouse",
        vi: "kho hàng",
        pos: "noun (m)",
        pronunciation_vi: "eel ma-gad-DZEE-no — `zz` đọc như `dz` mạnh",
        pronunciation_en: "eel ma-gad-DZEE-no — `zz` is a strong 'dz'",
      },
    ],
    dialogue: [
      // Dialogue 1 — Warehouse interview
      {
        speaker: "Intervistatore",
        text: "Buongiorno, mi parli un po' di lei.",
        vi: "Xin chào, anh giới thiệu một chút về bản thân nhé.",
        en: "Good morning, tell me a bit about yourself.",
      },
      {
        speaker: "Candidato",
        text: "Buongiorno, mi chiamo Minh. Ho esperienza in magazzino e ho lavorato nella preparazione degli ordini. Sono puntuale e seguo sempre le istruzioni di sicurezza.",
        vi: "Xin chào, tôi tên Minh. Tôi có kinh nghiệm trong kho và đã làm việc ở khâu chuẩn bị đơn hàng. Tôi đúng giờ và luôn tuân thủ hướng dẫn an toàn.",
        en: "Good morning, my name is Minh. I have warehouse experience and I worked in order preparation. I'm punctual and I always follow safety instructions.",
      },
      {
        speaker: "Intervistatore",
        text: "Sa usare il muletto?",
        vi: "Anh biết dùng xe nâng không?",
        en: "Can you use a forklift?",
      },
      {
        speaker: "Candidato",
        text: "Sì, ma solo con autorizzazione. Se serve, posso portare il certificato.",
        vi: "Có, nhưng chỉ khi được phép. Nếu cần, tôi có thể mang chứng chỉ.",
        en: "Yes, but only with authorization. If needed, I can bring the certificate.",
      },
      {
        speaker: "Intervistatore",
        text: "Quando può iniziare?",
        vi: "Khi nào anh có thể bắt đầu?",
        en: "When can you start?",
      },
      {
        speaker: "Candidato",
        text: "Sono disponibile da subito e posso lavorare su turni.",
        vi: "Tôi có thể bắt đầu ngay và có thể làm theo ca.",
        en: "I'm available right away and I can work shifts.",
      },
      // Dialogue 2 — Retail interview
      {
        speaker: "Intervistatore",
        text: "Ha esperienza con i clienti?",
        vi: "Chị có kinh nghiệm với khách hàng không?",
        en: "Do you have experience with customers?",
      },
      {
        speaker: "Candidata",
        text: "Sì, ho lavorato in un negozio. Parlavo con i clienti, controllavo i prodotti e gestivo piccoli pagamenti.",
        vi: "Có, tôi đã làm trong một cửa hàng. Tôi nói chuyện với khách, kiểm tra hàng hóa và xử lý các khoản thanh toán nhỏ.",
        en: "Yes, I worked in a shop. I talked with customers, checked the products, and handled small payments.",
      },
      {
        speaker: "Intervistatore",
        text: "Come gestisce una situazione difficile?",
        vi: "Chị xử lý một tình huống khó khăn thế nào?",
        en: "How do you handle a difficult situation?",
      },
      {
        speaker: "Candidata",
        text: "Resto calma, ascolto il cliente e chiedo aiuto al responsabile se necessario.",
        vi: "Tôi giữ bình tĩnh, lắng nghe khách hàng và nhờ quản lý giúp nếu cần.",
        en: "I stay calm, listen to the customer, and ask the manager for help if necessary.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Bài tập 1 — Dịch sang tiếng Ý:",
        instruction_en: "Exercise 1 — Translate into Italian:",
        items: [
          { prompt: "Tôi có kinh nghiệm trong kho.", answer: "Ho esperienza in magazzino." },
          {
            prompt: "Tôi là người đúng giờ và đáng tin cậy.",
            answer: "Sono una persona puntuale e affidabile.",
          },
          { prompt: "Tôi có thể bắt đầu ngay.", answer: "Sono disponibile da subito." },
          { prompt: "Tôi muốn biết giờ làm.", answer: "Vorrei sapere l'orario di lavoro." },
          {
            prompt: "Khi không hiểu, tôi hỏi xác nhận.",
            answer: "Quando non capisco, chiedo conferma.",
          },
        ],
      },
      {
        type: "build_answer",
        instruction_vi:
          "Bài tập 2 — Tự dựng câu trả lời: Viết bài giới thiệu phỏng vấn 5 câu, dùng đủ: tên / kinh nghiệm / một điểm mạnh / thời gian bắt đầu / một câu hỏi cho nhà tuyển dụng.",
        instruction_en:
          "Exercise 2 — Build your answer: Write a 5-sentence interview introduction using: name / experience / one strength / availability / one question for the employer.",
        frame: [
          "name",
          "experience",
          "one strength",
          "availability",
          "one question for the employer",
        ],
        example:
          "Buongiorno, mi chiamo ___. Ho esperienza in ___. Sono una persona puntuale e affidabile. Sono disponibile da subito. Vorrei sapere quale tipo di contratto offrite.",
        example_vi:
          "Xin chào, tôi tên là ___. Tôi có kinh nghiệm trong ___. Tôi là người đúng giờ và đáng tin cậy. Tôi có thể bắt đầu ngay. Tôi muốn biết anh/chị cung cấp loại hợp đồng nào.",
      },
    ],
  },
];

export default lessons;
