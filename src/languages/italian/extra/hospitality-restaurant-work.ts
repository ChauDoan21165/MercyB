// P3 — Hospitality & Restaurant Work Italian (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/P3-italian-hospitality-restaurant-work.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts (and matches the sibling B6 / B7 / A4 extra files).
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
    id: "italian_hospitality_restaurant_work_p3",
    level: "A2",
    category: "work_hospitality",
    title_vi: "Tiếng Ý cho công việc nhà hàng và khách sạn",
    title_en: "Hospitality and restaurant-work Italian",
    sentences: [
      // ── Greeting & seating guests ──────────────────────────────────────
      {
        en: "Buonasera, avete una prenotazione?",
        vi: "Chào buổi tối, quý khách có đặt chỗ không?",
        pronunciation_focus: [
          "bwo-na-SE-ra, a-VE-te OO-na pre-no-ta-TSYO-ne — `z` trong `prenotazione` đọc `ts`.",
          "Lỗi người Việt: dùng `tu` (avete → hai) với khách. Luôn dùng dạng số nhiều lịch sự `avete`.",
          "Drill: `Buonasera, avete una prenotazione?`",
        ],
        pronunciation_focus_en: [
          "bwo-na-SE-ra, a-VE-te OO-na pre-no-ta-TSYO-ne — the `z` in `prenotazione` is `ts`.",
          "VN-speaker trap: using the informal `hai` with guests. Use the polite plural `avete`.",
          "Drill: `Buonasera, avete una prenotazione?`",
        ],
      },
      {
        en: "Il tavolo è pronto. Prego, da questa parte.",
        vi: "Bàn đã sẵn sàng. Mời quý khách đi lối này.",
        pronunciation_focus: [
          "il TA-vo-lo È PRON-to — `prego` (`PRE-go`) là lời mời lịch sự, không phải `xin lỗi`.",
          "Lỗi người Việt: bỏ `è` (Bàn sẵn sàng → `Il tavolo pronto`). Phải có động từ `è`.",
          "Drill: `Il tavolo è pronto. Prego, da questa parte.`",
        ],
        pronunciation_focus_en: [
          "il TA-vo-lo È PRON-to — `prego` (`PRE-go`) here means a polite `this way, please`.",
          "VN-speaker trap: dropping `è` (`Il tavolo pronto`). The verb `è` is required.",
          "Drill: `Il tavolo è pronto. Prego, da questa parte.`",
        ],
      },
      // ── Taking an order ────────────────────────────────────────────────
      {
        en: "Siete pronti per ordinare?",
        vi: "Quý khách sẵn sàng gọi món chưa?",
        pronunciation_focus: [
          "SYE-te PRON-ti per or-di-NA-re — `pronti` đổi đuôi `-i` vì số nhiều.",
          "Lỗi người Việt: nói `pronto` (số ít) cho cả bàn. Số nhiều phải là `pronti`.",
          "Drill: `Siete pronti per ordinare?`",
        ],
        pronunciation_focus_en: [
          "SYE-te PRON-ti per or-di-NA-re — `pronti` takes the plural `-i` ending.",
          "VN-speaker trap: saying `pronto` (singular) for a table of guests. Plural is `pronti`.",
          "Drill: `Siete pronti per ordinare?`",
        ],
      },
      {
        en: "Vorrei il pollo, ma senza cipolla.",
        vi: "Tôi muốn món gà, nhưng không hành.",
        pronunciation_focus: [
          "vor-RAY il POL-lo, ma SEN-tsa chee-POL-la — `senza` = không / thiếu.",
          "Lỗi người Việt: nói `no cipolla` (kiểu Anh). Đúng là `senza cipolla`.",
          "Drill: `Vorrei il pollo, ma senza cipolla.`",
        ],
        pronunciation_focus_en: [
          "vor-RAY il POL-lo, ma SEN-tsa chee-POL-la — `senza` = without.",
          "VN-speaker trap: saying `no cipolla` (English-style). It's `senza cipolla`.",
          "Drill: `Vorrei il pollo, ma senza cipolla.`",
        ],
      },
      {
        en: "Avete allergie?",
        vi: "Quý khách có dị ứng không?",
        pronunciation_focus: [
          "a-VE-te al-ler-JEE-e — `gie` đọc `je`, `ll` là phụ âm đôi căng.",
          "Lỗi người Việt: bỏ qua câu này. Luôn HỎI dị ứng trước khi báo bếp — đây là an toàn, không phải lịch sự.",
          "Drill: `Avete allergie?`",
        ],
        pronunciation_focus_en: [
          "a-VE-te al-ler-JEE-e — `gie` is `je`, `ll` is a tense double consonant.",
          "VN-speaker trap: skipping this. Always ASK about allergies before telling the kitchen — it's safety, not just courtesy.",
          "Drill: `Avete allergie?`",
        ],
      },
      // ── Kitchen coordination ───────────────────────────────────────────
      {
        en: "Tavolo cinque: una pasta senza glutine e un pollo senza cipolla.",
        vi: "Bàn năm: một pasta không gluten và một gà không hành.",
        pronunciation_focus: [
          "TA-vo-lo CHEEN-kwe — `c` trước `i/e` đọc `ch`, nên `cinque` = `chin-kwe`.",
          "Lỗi người Việt: không nhắc lại số bàn cho bếp. Luôn mở đầu bằng `Tavolo + số`.",
          "Drill: `Tavolo cinque: una pasta senza glutine.`",
        ],
        pronunciation_focus_en: [
          "TA-vo-lo CHEEN-kwe — `c` before `i/e` is `ch`, so `cinque` = `chin-kwe`.",
          "VN-speaker trap: not repeating the table number to the kitchen. Always open with `Tavolo + number`.",
          "Drill: `Tavolo cinque: una pasta senza glutine.`",
        ],
      },
      {
        en: "Sì, il cliente ha allergia. Prepara separatamente.",
        vi: "Vâng, khách bị dị ứng. Chuẩn bị riêng nhé.",
        pronunciation_focus: [
          "SEE, il KLYEN-te a al-ler-JEE-a — `ha` (có) đọc câm `h`, chỉ phát `a`.",
          "Lỗi người Việt: đọc bật `h` trong `ha`. Tiếng Ý `h` luôn câm.",
          "Drill: `Il cliente ha allergia. Prepara separatamente.`",
        ],
        pronunciation_focus_en: [
          "SEE, il KLYEN-te a al-ler-JEE-a — `ha` (has) has a silent `h`, just `a`.",
          "VN-speaker trap: pronouncing the `h` in `ha`. Italian `h` is always silent.",
          "Drill: `Il cliente ha allergia. Prepara separatamente.`",
        ],
      },
      // ── Handling a complaint ───────────────────────────────────────────
      {
        en: "Mi dispiace. Lo faccio scaldare subito.",
        vi: "Tôi xin lỗi. Tôi cho hâm nóng lại ngay.",
        pronunciation_focus: [
          "mee dees-PYA-che. lo FAT-cho skal-DA-re SOO-bee-to — `cc` trong `faccio` đọc `t-ch`.",
          "Lỗi người Việt: dịch `xin lỗi` thành `scusa` khi khiếu nại. Dùng `Mi dispiace` cho sự cố.",
          "Drill: `Mi dispiace. Lo faccio scaldare subito.`",
        ],
        pronunciation_focus_en: [
          "mee dees-PYA-che. lo FAT-cho skal-DA-re SOO-bee-to — `cc` in `faccio` is `t-ch`.",
          "VN-speaker trap: using `scusa` for a complaint. Use `Mi dispiace` for something going wrong.",
          "Drill: `Mi dispiace. Lo faccio scaldare subito.`",
        ],
      },
      {
        en: "Preferisce rifarlo o riscaldarlo?",
        vi: "Quý khách muốn làm lại hay hâm nóng?",
        pronunciation_focus: [
          "pre-fe-REE-she ree-FAR-lo o ree-skal-DAR-lo — `sce` đọc `she`.",
          "Lỗi người Việt: dùng `tu` (preferisci) với khách. Dạng lịch sự là `preferisce` (Lei).",
          "Drill: `Preferisce rifarlo o riscaldarlo?`",
        ],
        pronunciation_focus_en: [
          "pre-fe-REE-she ree-FAR-lo o ree-skal-DAR-lo — `sce` is `she`.",
          "VN-speaker trap: using `preferisci` (informal) with a guest. The polite form is `preferisce` (Lei).",
          "Drill: `Preferisce rifarlo o riscaldarlo?`",
        ],
      },
      // ── Hotel check-in ─────────────────────────────────────────────────
      {
        en: "Benvenuti. Ha un documento, per favore?",
        vi: "Chào mừng. Quý khách có giấy tờ không ạ?",
        pronunciation_focus: [
          "ben-ve-NOO-tee. a oon do-koo-MEN-to — `documento` nhấn ở `MEN`.",
          "Lỗi người Việt: nói `papiri` hoặc `carta`. Giấy tờ tùy thân là `documento`.",
          "Drill: `Ha un documento, per favore?`",
        ],
        pronunciation_focus_en: [
          "ben-ve-NOO-tee. a oon do-koo-MEN-to — `documento` is stressed on `MEN`.",
          "VN-speaker trap: saying `papiri` or `carta`. An ID is a `documento`.",
          "Drill: `Ha un documento, per favore?`",
        ],
      },
      {
        en: "La camera è al secondo piano. La colazione è dalle 7 alle 10.",
        vi: "Phòng ở tầng hai. Bữa sáng từ 7 đến 10 giờ.",
        pronunciation_focus: [
          "la KA-me-ra È al se-KON-do PYA-no — `dalle ... alle` = từ ... đến (giờ).",
          "Lỗi người Việt: nói `da 7 a 10` không có mạo từ. Với giờ phải dùng `dalle 7 alle 10`.",
          "Drill: `La colazione è dalle 7 alle 10.`",
        ],
        pronunciation_focus_en: [
          "la KA-me-ra È al se-KON-do PYA-no — `dalle ... alle` = from ... to (times).",
          "VN-speaker trap: saying `da 7 a 10` without the article. With clock times use `dalle 7 alle 10`.",
          "Drill: `La colazione è dalle 7 alle 10.`",
        ],
      },
      {
        en: "Certo, abbiamo il deposito bagagli.",
        vi: "Vâng, chúng tôi có chỗ gửi hành lý.",
        pronunciation_focus: [
          "CHER-to, ab-BYA-mo il de-PO-zee-to ba-GA-lyee — `gli` đọc `lyi` mềm.",
          "Lỗi người Việt: đọc `bagagli` thành `ba-ga-gli` cứng. `gli` là âm `lyi` mềm.",
          "Drill: `Abbiamo il deposito bagagli.`",
        ],
        pronunciation_focus_en: [
          "CHER-to, ab-BYA-mo il de-PO-zee-to ba-GA-lyee — `gli` is a soft `lyi`.",
          "VN-speaker trap: reading `bagagli` with a hard `g-l`. `gli` is the soft `lyi` sound.",
          "Drill: `Abbiamo il deposito bagagli.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nghề dịch vụ ở Ý, dùng dạng lịch sự (`Lei`, `avete`, `vorrei`) ngay cả khi đang bận là điều bắt buộc, không phải lựa chọn. `Il conto` là hóa đơn ở nhà hàng; `la fattura` là hóa đơn thuế (khi khách cần xuất hóa đơn công ty). Tiền tip ở Ý không bắt buộc và thường nhỏ — đừng kỳ vọng tip kiểu Mỹ. Bữa ăn được coi là thời gian thư giãn, nên không mang `il conto` ra khi khách chưa yêu cầu.",
    cultural_notes_en:
      "In Italian service work, the polite register (`Lei`, `avete`, `vorrei`) is mandatory even when you're slammed — it is not optional. `Il conto` is the restaurant bill; `la fattura` is a tax invoice (for guests who need a company receipt). Tipping in Italy is not obligatory and is usually small — don't expect US-style tips. A meal is treated as relaxation time, so never bring `il conto` until the guest asks.",
    tip_advice_vi:
      "Luôn nhắc lại yêu cầu đặc biệt cho bếp bằng đúng từ khóa: `senza` (không), `con` (có), `a parte` (để riêng). Với khiếu nại: xin lỗi (`Mi dispiace`), đưa lựa chọn (`rifarlo o riscaldarlo`), rồi hành động nhanh. Câu `Per Lei?` (Còn quý khách?) là cách tự nhiên để hỏi người khách tiếp theo.",
    tip_advice_en:
      "Always repeat special requests to the kitchen with the exact keyword: `senza` (without), `con` (with), `a parte` (on the side). For complaints: apologize (`Mi dispiace`), offer options (`rifarlo o riscaldarlo`), then act fast. `Per Lei?` (And for you?) is the natural way to turn to the next guest.",
    vocabulary: [
      {
        word: "il tavolo",
        en: "table",
        vi: "bàn",
        pos: "noun (m)",
        pronunciation_vi: "il TA-vo-lo — nhấn âm đầu",
        pronunciation_en: "il TA-vo-lo — stress the first syllable",
      },
      {
        word: "la prenotazione",
        en: "reservation / booking",
        vi: "đặt chỗ",
        pos: "noun (f)",
        pronunciation_vi: "la pre-no-ta-TSYO-ne — `z` đọc `ts`",
        pronunciation_en: "la pre-no-ta-TSYO-ne — `z` is `ts`",
      },
      {
        word: "il menu",
        en: "menu",
        vi: "thực đơn",
        pos: "noun (m)",
        pronunciation_vi: "il me-NOO — nhấn cuối",
        pronunciation_en: "il me-NOO — stress the last syllable",
      },
      {
        word: "l'ordine",
        en: "order",
        vi: "đơn / món gọi",
        pos: "noun (m)",
        pronunciation_vi: "LOR-dee-ne — nhấn âm đầu",
        pronunciation_en: "LOR-dee-ne — stress the first syllable",
      },
      {
        word: "il conto",
        en: "the bill (restaurant)",
        vi: "hóa đơn",
        pos: "noun (m)",
        pronunciation_vi: "il KON-to — khác `fattura` (hóa đơn thuế)",
        pronunciation_en: "il KON-to — distinct from `fattura` (tax invoice)",
      },
      {
        word: "l'allergia",
        en: "allergy",
        vi: "dị ứng",
        pos: "noun (f)",
        pronunciation_vi: "lal-ler-JEE-a — `gia` đọc `ja`",
        pronunciation_en: "lal-ler-JEE-a — `gia` is `ja`",
      },
      {
        word: "senza glutine",
        en: "gluten-free",
        vi: "không gluten",
        pos: "phrase",
        pronunciation_vi: "SEN-tsa GLOO-tee-ne",
        pronunciation_en: "SEN-tsa GLOO-tee-ne",
      },
      {
        word: "al sangue",
        en: "rare (steak)",
        vi: "tái",
        pos: "phrase",
        pronunciation_vi: "al SAN-gwe — `gue` đọc `gwe`",
        pronunciation_en: "al SAN-gwe — `gue` is `gwe`",
      },
      {
        word: "la camera",
        en: "room (hotel)",
        vi: "phòng",
        pos: "noun (f)",
        pronunciation_vi: "la KA-me-ra — nhấn âm đầu",
        pronunciation_en: "la KA-me-ra — stress the first syllable",
      },
      {
        word: "il check-in",
        en: "check-in",
        vi: "nhận phòng",
        pos: "noun (m)",
        pronunciation_vi: "il chek-IN — mượn từ tiếng Anh",
        pronunciation_en: "il chek-IN — English loanword",
      },
      {
        word: "il documento",
        en: "document / ID",
        vi: "giấy tờ",
        pos: "noun (m)",
        pronunciation_vi: "il do-koo-MEN-to — nhấn `MEN`",
        pronunciation_en: "il do-koo-MEN-to — stress `MEN`",
      },
      {
        word: "la colazione",
        en: "breakfast",
        vi: "bữa sáng",
        pos: "noun (f)",
        pronunciation_vi: "la ko-la-TSYO-ne — `z` đọc `ts`",
        pronunciation_en: "la ko-la-TSYO-ne — `z` is `ts`",
      },
      {
        word: "la chiave",
        en: "key",
        vi: "chìa khóa",
        pos: "noun (f)",
        pronunciation_vi: "la KYA-ve — `chi` đọc `ky`",
        pronunciation_en: "la KYA-ve — `chi` is `ky`",
      },
      {
        word: "il deposito bagagli",
        en: "luggage storage",
        vi: "chỗ gửi hành lý",
        pos: "noun (m)",
        pronunciation_vi: "il de-PO-zee-to ba-GA-lyee — `gli` đọc `lyi`",
        pronunciation_en: "il de-PO-zee-to ba-GA-lyee — `gli` is `lyi`",
      },
    ],
    dialogue: [
      {
        speaker: "Cameriere",
        text: "Buonasera, avete una prenotazione?",
        vi: "Chào buổi tối, quý khách có đặt chỗ không?",
        en: "Good evening, do you have a reservation?",
      },
      {
        speaker: "Cliente",
        text: "Sì, a nome Rossi, per due persone.",
        vi: "Có, tên Rossi, hai người.",
        en: "Yes, under Rossi, for two.",
      },
      {
        speaker: "Cameriere",
        text: "Perfetto, il tavolo è pronto. Prego, da questa parte.",
        vi: "Tốt, bàn đã sẵn sàng. Mời quý khách đi lối này.",
        en: "Perfect, the table is ready. This way, please.",
      },
      {
        speaker: "Cameriere",
        text: "Siete pronti per ordinare? Avete allergie?",
        vi: "Quý khách sẵn sàng gọi món chưa? Có dị ứng không?",
        en: "Are you ready to order? Any allergies?",
      },
      {
        speaker: "Cliente",
        text: "Vorrei il pollo, ma senza cipolla.",
        vi: "Tôi muốn món gà, nhưng không hành.",
        en: "I'd like the chicken, but without onion.",
      },
      {
        speaker: "Cliente",
        text: "Mi scusi, il piatto è freddo.",
        vi: "Xin lỗi, món ăn bị nguội.",
        en: "Excuse me, the dish is cold.",
      },
      {
        speaker: "Cameriere",
        text: "Mi dispiace. Lo faccio scaldare subito oppure preferisce rifarlo?",
        vi: "Tôi xin lỗi. Tôi cho hâm nóng ngay hoặc quý khách muốn làm lại?",
        en: "I'm sorry. I'll have it heated right away, or would you prefer it remade?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng (senza / vorrei / avete / prego):",
        instruction_en: "Fill in the right word (senza / vorrei / avete / prego):",
        items: [
          {
            prompt: "___ il pollo, ma senza cipolla.",
            answer: "Vorrei",
          },
          {
            prompt: "Una pasta ___ glutine, per favore.",
            answer: "senza",
          },
          {
            prompt: "Buonasera, ___ una prenotazione?",
            answer: "avete",
          },
          {
            prompt: "Il tavolo è pronto. ___, da questa parte.",
            answer: "Prego",
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Ý với nghĩa tiếng Việt:",
        instruction_en: "Match each Italian word with its Vietnamese meaning:",
        items: [
          { prompt: "il conto", answer: "hóa đơn (the bill)" },
          { prompt: "la chiave", answer: "chìa khóa (key)" },
          { prompt: "la colazione", answer: "bữa sáng (breakfast)" },
          { prompt: "il deposito bagagli", answer: "chỗ gửi hành lý (luggage storage)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          {
            prompt: "Quý khách có đặt chỗ không?",
            answer: "Avete una prenotazione?",
          },
          {
            prompt: "Quý khách có dị ứng không?",
            answer: "Avete allergie?",
          },
          {
            prompt: "Tôi xin lỗi. Tôi cho hâm nóng hoặc làm lại?",
            answer: "Mi dispiace. Lo faccio scaldare o rifare?",
          },
          {
            prompt: "Bữa sáng từ 7 đến 10 giờ.",
            answer: "La colazione è dalle 7 alle 10.",
          },
        ],
      },
      {
        type: "roleplay",
        instruction_vi:
          "Đóng vai phục vụ — thực hiện đúng thứ tự quy trình: chào → xác nhận đặt chỗ → mời ngồi → hỏi dị ứng → nhắc lại yêu cầu đặc biệt → kiểm tra bàn → xử lý khiếu nại → cảm ơn.",
        instruction_en:
          "Roleplay the server — run the checklist in order: greet → confirm booking → seat the guest → ask about allergies → repeat special requests → check the table → handle a complaint → close with thanks.",
        example:
          "Buonasera, avete una prenotazione? ... Il tavolo è pronto, prego. ... Avete allergie? ... Tavolo cinque: una pasta senza glutine. ... Mi dispiace, lo faccio rifare subito. ... Grazie e buona serata!",
        example_vi:
          "Chào buổi tối, quý khách có đặt chỗ không? ... Bàn đã sẵn sàng, mời ngồi. ... Có dị ứng không? ... Bàn năm: một pasta không gluten. ... Tôi xin lỗi, tôi cho làm lại ngay. ... Cảm ơn và chúc buổi tối tốt lành!",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Self-check — can you do each one?",
        items: [
          {
            vi: "Tôi có thể chào và xác nhận đặt chỗ bằng dạng lịch sự.",
            en: "I can greet and confirm a booking in the polite register.",
          },
          {
            vi: "Tôi luôn hỏi dị ứng trước khi báo bếp.",
            en: "I always ask about allergies before telling the kitchen.",
          },
          {
            vi: "Tôi có thể nhắc lại yêu cầu đặc biệt bằng `senza` / `con` / `a parte`.",
            en: "I can repeat special requests with `senza` / `con` / `a parte`.",
          },
          {
            vi: "Tôi có thể xử lý khiếu nại: xin lỗi, đưa lựa chọn, hành động nhanh.",
            en: "I can handle a complaint: apologize, offer options, act fast.",
          },
          {
            vi: "Tôi có thể giải thích giờ ăn sáng và chỗ gửi hành lý ở khách sạn.",
            en: "I can explain breakfast hours and luggage storage at a hotel.",
          },
          {
            vi: "Tôi phân biệt được `il conto` (hóa đơn) và `la fattura` (hóa đơn thuế).",
            en: "I can tell `il conto` (bill) from `la fattura` (tax invoice).",
          },
        ],
      },
      {
        type: "rubric",
        instruction_vi: "Thang tự đánh giá (1–5):",
        instruction_en: "Self-assessment scale (1–5):",
        items: [
          {
            score: 1,
            vi: "Chưa chào hỏi và gọi tên món/giấy tờ đúng.",
            en: "Cannot greet or name dishes/documents correctly.",
          },
          {
            score: 2,
            vi: "Chào được nhưng quên hỏi dị ứng hoặc dùng sai dạng lịch sự.",
            en: "Can greet but forgets allergies or uses the wrong register.",
          },
          {
            score: 3,
            vi: "Nhận và nhắc lại được đơn hàng có một yêu cầu đặc biệt.",
            en: "Can take and repeat an order with one special request.",
          },
          {
            score: 4,
            vi: "Xử lý khiếu nại và check-in khách sạn chính xác, đúng mạo từ và giới từ.",
            en: "Can handle a complaint and hotel check-in accurately, with correct articles and prepositions.",
          },
          {
            score: 5,
            vi: "Điều phối cả ca làm nhà hàng/khách sạn bình tĩnh, lịch sự và chính xác.",
            en: "Can run a full restaurant/hotel shift calmly, politely, and precisely.",
          },
        ],
      },
    ],
  },
];

export default lessons;
