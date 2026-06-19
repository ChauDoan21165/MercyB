// src/languages/italian/lessons-a2.ts
//
// Italian A2 lessons for Vietnamese learners.
//
// Shape mirrors the A1 pack (src/languages/italian/lessons-a1.ts) so the
// shared lesson page UI stays consistent across the Italian vertical — the
// types are declared INLINE here because the Italian vertical does not yet
// ship a `./lessons` registry file. This module is intentionally
// self-contained: it exports its own types plus the A2 data array. When a
// shared `./lessons` is added, swap these to a type-only import.
//
// Source content: hand-derived from the local Vietnamese→Italian study track
// (.local/vietnamese-italian-study/ — S2 A2 course map, T3 A2 lessons 001-050,
// A2 pronunciation lab, A3 grammar traps). Vietnamese-first: every lesson
// carries L1 notes — the specific mistakes a Vietnamese speaker makes — under
// `l1_notes_vi`. Hand-crafted; no AI-generated filler.
//
// A2 target (per the course map): make/change appointments, describe routines,
// tell simple past with `passato prossimo`, ask for help in shops, offices,
// transport, housing and health, write short practical messages.
//
// Pronunciation conventions for Vietnamese readers:
//   - c/g before e,i → "ch"/"gi"; before a,o,u → "k"/"g"
//   - gli → soft "li" (≈ ly);  gn → "nh";  z → "ts"/"dz";  r → tapped/trilled
//   - double consonants (ll, tt, nn, ss…) are HELD longer — load-bearing
//   - every final vowel is pronounced; never clip endings the Vietnamese way

// ── Types (inline — Italian vertical has no shared ./lessons yet) ────────

export type ItalianCategoryId =
  | "daily_routine"
  | "shopping"
  | "transport"
  | "appointments"
  | "health"
  | "housing"
  | "work"
  | "past_tense";

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLessonSentence = {
  /** The Italian target sentence (this is the line the learner speaks). */
  it: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Literal English gloss, for the secondary EN audience. */
  en?: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  /** Italian word, with article where gender matters (e.g. "la ricevuta"). */
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Pronunciation respelled for a Vietnamese reader; stressed syllable CAPS. */
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type ItalianL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
};

// Loosely typed so per-type exercise fields can vary (fill_blank / matching /
// translation), matching the A1 pack's Exercise contract.
export type ItalianExercise = Record<string, unknown>;

export type ItalianLesson = {
  id: string;
  category: ItalianCategoryId;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: ItalianL1Note[];
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
};

// ── A2 lessons ───────────────────────────────────────────────────────────

export const lessons: ItalianLesson[] = [
  // ── 1. Daily routine & schedule ──────────────────────────────────────────
  {
    id: "italian_daily_routine_schedule",
    level: "A2",
    category: "daily_routine",
    title_vi: "Thói quen và giờ giấc",
    title_en: "Daily routine and schedule",
    sentences: [
      {
        it: "Di solito mi alzo alle sei e mezza.",
        vi: "Thường tôi dậy lúc sáu giờ rưỡi.",
        en: "I usually get up at half past six.",
        pronunciation_focus: [
          "solito → 'XÔ-li-tô' (nhấn âm đầu)",
          "mi alzo → 'mi AL-tsô', z = 'ts'",
          "mezza → 'MÊT-tsa', giữ 'zz' dài",
        ],
        pronunciation_focus_en: [
          "solito → 'SOH-lee-toh' — stress the first syllable",
          "alzo → 'AHL-tsoh' — the 'z' is a 'ts' sound",
          "mezza → 'MEHT-tsah' — hold the double 'zz' longer",
        ],
      },
      {
        it: "Lavoro dalle otto alle sedici.",
        vi: "Tôi làm từ tám giờ đến bốn giờ chiều.",
        en: "I work from eight to four (16:00).",
        pronunciation_focus: [
          "dalle → 'ĐAL-lê', giữ 'll' dài",
          "alle → 'AL-lê'",
          "sedici → 'XÊ-đi-chi' (nhấn đầu)",
        ],
        pronunciation_focus_en: [
          "dalle → 'DAHL-leh' — hold the double 'll'",
          "'dalle… alle…' = 'from… to…' for times",
          "sedici → 'SEH-dee-chee' — Italy uses the 24-hour clock",
        ],
      },
      {
        it: "Finisco di lavorare alle cinque.",
        vi: "Tôi làm xong lúc năm giờ.",
        en: "I finish work at five.",
        pronunciation_focus: [
          "finisco → 'fi-NI-xcô', sc = 'xc' cứng",
          "lavorare → 'la-vô-RA-rê'",
          "cinque → 'CHIN-cuê', ci = 'chi'",
        ],
        pronunciation_focus_en: [
          "finisco → 'fee-NEES-koh' — 'sc' before 'o' is a hard 'sk'",
          "lavorare → 'lah-voh-RAH-reh' — stress the third syllable",
          "cinque → 'CHEEN-kweh' — 'ci' is 'ch', 'qu' is 'kw'",
        ],
      },
      {
        it: "Studio italiano tre volte alla settimana.",
        vi: "Tôi học tiếng Ý ba lần một tuần.",
        en: "I study Italian three times a week.",
        pronunciation_focus: [
          "studio → 'XTU-đi-ô'",
          "volte → 'VÔL-tê'",
          "settimana → 'xêt-ti-MA-na', giữ 'tt'",
        ],
        pronunciation_focus_en: [
          "studio → 'STOO-dyoh'",
          "'tre volte alla settimana' = 'three times a week'",
          "settimana → 'set-tee-MAH-nah' — hold the 'tt'; stress 'MA'",
        ],
      },
      {
        it: "La sera torno a casa e cucino.",
        vi: "Buổi tối tôi về nhà và nấu ăn.",
        en: "In the evening I go home and cook.",
        pronunciation_focus: [
          "sera → 'XÊ-ra'",
          "torno → 'TÔR-nô'",
          "cucino → 'cu-CHI-nô', ci = 'chi'",
        ],
        pronunciation_focus_en: [
          "sera → 'SEH-rah'",
          "torno → 'TOR-noh' — 'tornare a casa' = 'to come home'",
          "cucino → 'koo-CHEE-noh' — 'ci' is 'ch'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Ý dùng đồng hồ 24 giờ trong công việc và lịch hẹn: 'alle sedici' (16h) chứ không nói '4 giờ chiều'. Bữa trưa thường 13h-14h và nhiều cửa hàng nhỏ đóng cửa nghỉ trưa (pausa pranzo). Bữa tối ăn muộn, thường sau 20h. Khi nói thói quen, người Ý hay mở đầu bằng 'di solito' (thường thì) hoặc 'normalmente'.",
    cultural_notes_en:
      "Italians use the 24-hour clock for work and appointments: 'alle sedici' (16:00), not 'four in the afternoon'. Lunch is usually 13:00-14:00 and many small shops close for a 'pausa pranzo'. Dinner is late, often after 20:00. To describe a routine, Italians open with 'di solito' (usually) or 'normalmente'.",
    tip_advice_vi:
      "Học chùm giờ 'dalle… alle…' (từ… đến…) như một khối cố định. Động từ phản thân 'mi alzo / mi sveglio' luôn cần 'mi' — đừng bỏ. Phát âm đủ phụ âm đôi: 'settimana' giữ 'tt', nếu không người nghe hiểu nhầm.",
    tip_advice_en:
      "Learn the time frame 'dalle… alle…' (from… to…) as one fixed chunk. Reflexive verbs 'mi alzo / mi sveglio' always need 'mi' — never drop it. Hold double consonants: 'settimana' keeps the 'tt' long, or it sounds like a different word.",
    l1_notes_vi: [
      {
        mistake: "Nói 'alzo alle sei' (bỏ 'mi').",
        fix_vi: "Động từ phản thân cần đại từ: 'MI alzo alle sei'. Tiếng Việt không có dạng này nên dễ quên.",
      },
      {
        mistake: "Dịch '4 giờ chiều' thành 'quattro del pomeriggio' trong lịch hẹn công việc.",
        fix_vi: "Bối cảnh công việc dùng 24 giờ: 'alle sedici'. Gọn và rõ hơn.",
      },
      {
        mistake: "Nói 'tre volte a settimana' (thiếu mạo từ).",
        fix_vi: "Đúng là 'tre volte ALLA settimana' — 'alla' = a + la, có mạo từ.",
      },
    ],
    vocabulary: [
      { word: "di solito", en: "usually", vi: "thường thì", pos: "adverb phrase", pronunciation_vi: "đi XÔ-li-tô", pronunciation_en: "dee SOH-lee-toh" },
      { word: "alzarsi", en: "to get up", vi: "thức dậy", pos: "reflexive verb", pronunciation_vi: "al-TSAR-xi", pronunciation_en: "ahl-TSAR-see" },
      { word: "svegliarsi", en: "to wake up", vi: "tỉnh giấc", pos: "reflexive verb", pronunciation_vi: "xvê-LIAR-xi, gli = 'li'", pronunciation_en: "sveh-LYAR-see — 'gli' is a soft 'ly'" },
      { word: "la mattina", en: "the morning", vi: "buổi sáng", pos: "n.f.", pronunciation_vi: "la mat-TI-na", pronunciation_en: "lah mat-TEE-nah" },
      { word: "la sera", en: "the evening", vi: "buổi tối", pos: "n.f.", pronunciation_vi: "la XÊ-ra", pronunciation_en: "lah SEH-rah" },
      { word: "l'orario", en: "schedule / timetable", vi: "giờ giấc, lịch", pos: "n.m.", pronunciation_vi: "lô-RA-ri-ô", pronunciation_en: "loh-RAH-ree-oh" },
      { word: "la settimana", en: "the week", vi: "tuần", pos: "n.f.", pronunciation_vi: "la xêt-ti-MA-na", pronunciation_en: "lah set-tee-MAH-nah" },
      { word: "finire", en: "to finish", vi: "kết thúc, xong", pos: "verb", pronunciation_vi: "fi-NI-rê", pronunciation_en: "fee-NEE-reh" },
    ],
    dialogue: [
      { speaker: "A", text: "A che ora ti alzi la mattina?", vi: "Buổi sáng bạn dậy lúc mấy giờ?", en: "What time do you get up in the morning?" },
      { speaker: "B", text: "Di solito alle sei e mezza. E tu?", vi: "Thường lúc sáu giờ rưỡi. Còn bạn?", en: "Usually at half past six. And you?" },
      { speaker: "A", text: "Più tardi, alle sette. Lavoro dalle nove.", vi: "Muộn hơn, lúc bảy giờ. Tôi làm từ chín giờ.", en: "Later, at seven. I work from nine." },
      { speaker: "B", text: "Io finisco alle sedici e poi torno a casa.", vi: "Tôi xong lúc bốn giờ chiều rồi về nhà.", en: "I finish at 16:00 and then go home." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ phản thân hoặc mạo từ đúng:",
        instruction_en: "Fill in the right reflexive pronoun or article:",
        items: [
          { prompt: "Di solito ___ alzo alle sei.", answer: "mi", options: ["mi", "ti", "si"] },
          { prompt: "Studio tre volte ___ settimana.", answer: "alla", options: ["a", "alla", "la"] },
          { prompt: "Lavoro ___ otto ___ sedici.", answer: "dalle … alle", options: ["dalle … alle", "da … a", "di … a"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Thường tôi dậy lúc sáu giờ.", answer: "Di solito mi alzo alle sei." },
          { prompt: "Tôi làm từ tám giờ đến bốn giờ chiều.", answer: "Lavoro dalle otto alle sedici." },
          { prompt: "Buổi tối tôi về nhà và nấu ăn.", answer: "La sera torno a casa e cucino." },
        ],
      },
    ],
  },

  // ── 2. Shopping & quantities ──────────────────────────────────────────────
  {
    id: "italian_shopping_quantities",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm và số lượng",
    title_en: "Shopping and quantities",
    sentences: [
      {
        it: "Vorrei mezzo chilo di pomodori.",
        vi: "Tôi muốn nửa ký cà chua.",
        en: "I'd like half a kilo of tomatoes.",
        pronunciation_focus: [
          "vorrei → 'vôr-RÊI', giữ 'rr' rung",
          "mezzo → 'MÊT-tsô'",
          "chilo → 'KI-lô', chi = 'ki' cứng",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — trill the double 'rr'; the polite 'I'd like'",
          "mezzo → 'MET-tsoh' — 'zz' is a long 'ts'",
          "chilo → 'KEE-loh' — 'chi' is a hard 'k', not 'ch'",
        ],
      },
      {
        it: "Quanto costa questo al chilo?",
        vi: "Cái này bao nhiêu một ký?",
        en: "How much is this per kilo?",
        pronunciation_focus: [
          "quanto → 'CUAN-tô', qu = 'cu'",
          "costa → 'CÔX-ta'",
          "questo → 'CUÊX-tô'",
        ],
        pronunciation_focus_en: [
          "quanto → 'KWAHN-toh' — 'qu' is 'kw'",
          "'quanto costa?' = the all-purpose 'how much is it?'",
          "'al chilo' = 'per kilo'",
        ],
      },
      {
        it: "Ne prendo due, grazie.",
        vi: "Tôi lấy hai cái, cảm ơn.",
        en: "I'll take two of them, thanks.",
        pronunciation_focus: [
          "ne → 'nê' (đại từ 'của cái đó')",
          "prendo → 'PRÊN-đô'",
          "due → 'ĐU-ê', đọc đủ 'e'",
        ],
        pronunciation_focus_en: [
          "'ne' replaces 'of them' — 'ne prendo due' = 'I take two of them'",
          "prendo → 'PREN-doh'",
          "due → 'DOO-eh' — both vowels sound",
        ],
      },
      {
        it: "Posso pagare con la carta?",
        vi: "Tôi trả bằng thẻ được không?",
        en: "Can I pay by card?",
        pronunciation_focus: [
          "posso → 'PÔX-xô', giữ 'ss'",
          "pagare → 'pa-GA-rê', ga = 'ga' cứng",
          "carta → 'CAR-ta'",
        ],
        pronunciation_focus_en: [
          "posso → 'POHS-soh' — hold the double 'ss'",
          "pagare → 'pah-GAH-reh' — hard 'g'",
          "'con la carta' = 'by card'; cash is 'in contanti'",
        ],
      },
      {
        it: "Mi può fare lo scontrino, per favore?",
        vi: "Cho tôi xin hoá đơn được không ạ?",
        en: "Can you give me the receipt, please?",
        pronunciation_focus: [
          "può → 'puô' (một âm)",
          "scontrino → 'xcôn-TRI-nô'",
          "favore → 'fa-VÔ-rê'",
        ],
        pronunciation_focus_en: [
          "può → 'pwoh' — one gliding syllable",
          "scontrino → 'skon-TREE-noh' — the till receipt from a shop",
          "favore → 'fah-VOH-reh'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở chợ và cửa hàng thực phẩm, người Ý mua theo cân: 'un chilo' (1 ký), 'mezzo chilo' (nửa ký), 'un etto' (100g — rất hay dùng cho thịt nguội, phô mai). Ở nhiều cửa hàng nhỏ KHÔNG tự cầm trái cây — hãy để người bán lấy cho. 'Scontrino' (hoá đơn) quan trọng: luật Ý yêu cầu giữ hoá đơn, có thể bị kiểm tra ngay ngoài cửa.",
    cultural_notes_en:
      "At markets and food shops Italians buy by weight: 'un chilo' (1 kg), 'mezzo chilo' (half a kilo), 'un etto' (100 g — very common for cold cuts and cheese). In many small shops do NOT touch the fruit yourself — let the seller pick it. The 'scontrino' (receipt) matters: Italian law expects you to keep it, and you can be checked just outside the door.",
    tip_advice_vi:
      "Hai câu sống còn: 'Quanto costa?' (bao nhiêu tiền) và 'Vorrei…' (tôi muốn — lịch sự). Dùng 'un etto' khi mua thịt nguội/phô mai. Đại từ 'ne' thay cho 'của cái đó' giúp câu gọn: 'Ne prendo due.'",
    tip_advice_en:
      "Two survival lines: 'Quanto costa?' (how much) and 'Vorrei…' (I'd like — polite). Use 'un etto' for deli items. The pronoun 'ne' stands in for 'of them' and keeps it short: 'Ne prendo due.'",
    l1_notes_vi: [
      {
        mistake: "Nói 'voglio mezzo chilo' với người bán.",
        fix_vi: "'Voglio' (tôi muốn) nghe cộc. Dùng 'Vorrei' lịch sự hơn khi mua hàng, hỏi việc.",
      },
      {
        mistake: "Bỏ mạo từ: 'pago con carta'.",
        fix_vi: "Tiếng Ý cần mạo từ: 'pago con LA carta'. Người Việt hay quên vì tiếng Việt không có mạo từ.",
      },
      {
        mistake: "Lặp lại danh từ: 'prendo due pomodori' khi vừa nói về cà chua.",
        fix_vi: "Dùng 'ne': 'Ne prendo due' = lấy hai cái (của thứ đó). Tự nhiên hơn nhiều.",
      },
    ],
    vocabulary: [
      { word: "vorrei", en: "I'd like (polite)", vi: "tôi muốn (lịch sự)", pos: "verb (conditional)", pronunciation_vi: "vôr-RÊI", pronunciation_en: "vor-RAY" },
      { word: "il chilo", en: "kilo", vi: "ký, kg", pos: "n.m.", pronunciation_vi: "il KI-lô", pronunciation_en: "eel KEE-loh" },
      { word: "un etto", en: "100 grams", vi: "một lạng (100g)", pos: "n.m.", pronunciation_vi: "un ÊT-tô", pronunciation_en: "oon ET-toh" },
      { word: "lo scontrino", en: "receipt", vi: "hoá đơn (cửa hàng)", pos: "n.m.", pronunciation_vi: "lô xcôn-TRI-nô", pronunciation_en: "loh skon-TREE-noh" },
      { word: "la carta", en: "card", vi: "thẻ", pos: "n.f.", pronunciation_vi: "la CAR-ta", pronunciation_en: "lah KAR-tah" },
      { word: "i contanti", en: "cash", vi: "tiền mặt", pos: "n.m.pl.", pronunciation_vi: "i côn-TAN-ti", pronunciation_en: "ee kohn-TAHN-tee" },
      { word: "costare", en: "to cost", vi: "có giá", pos: "verb", pronunciation_vi: "côx-TA-rê", pronunciation_en: "koh-STAH-reh" },
      { word: "il resto", en: "the change (money)", vi: "tiền thối lại", pos: "n.m.", pronunciation_vi: "il RÊX-tô", pronunciation_en: "eel REH-stoh" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Buongiorno, vorrei mezzo chilo di mele.", vi: "Chào, tôi muốn nửa ký táo.", en: "Hello, I'd like half a kilo of apples." },
      { speaker: "Venditore", text: "Certo. Altro?", vi: "Được. Còn gì nữa không?", en: "Sure. Anything else?" },
      { speaker: "Cliente", text: "Sì, un etto di prosciutto. Quanto costa in tutto?", vi: "Vâng, một lạng thịt nguội. Tổng cộng bao nhiêu?", en: "Yes, 100 g of ham. How much in total?" },
      { speaker: "Venditore", text: "Sei euro. Ecco lo scontrino.", vi: "Sáu euro. Đây hoá đơn.", en: "Six euros. Here's the receipt." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word with its meaning:",
        items: [
          { prompt: "lo scontrino", answer: "hoá đơn (receipt)" },
          { prompt: "i contanti", answer: "tiền mặt (cash)" },
          { prompt: "un etto", answer: "100 gram (100 g)" },
          { prompt: "il resto", answer: "tiền thối lại (change)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý (nhớ dùng 'vorrei' và mạo từ):",
        instruction_en: "Translate into Italian (use 'vorrei' and the article):",
        items: [
          { prompt: "Tôi muốn nửa ký cà chua.", answer: "Vorrei mezzo chilo di pomodori." },
          { prompt: "Tôi trả bằng thẻ được không?", answer: "Posso pagare con la carta?" },
          { prompt: "Tôi lấy hai cái, cảm ơn.", answer: "Ne prendo due, grazie." },
        ],
      },
    ],
  },

  // ── 3. Transport ─────────────────────────────────────────────────────────
  {
    id: "italian_transport_getting_around",
    level: "A2",
    category: "transport",
    title_vi: "Đi lại bằng phương tiện công cộng",
    title_en: "Getting around by public transport",
    sentences: [
      {
        it: "A che ora parte il prossimo treno per Milano?",
        vi: "Chuyến tàu tiếp theo đi Milano khởi hành lúc mấy giờ?",
        en: "What time does the next train to Milan leave?",
        pronunciation_focus: [
          "parte → 'PAR-tê'",
          "prossimo → 'PRÔX-xi-mô', giữ 'ss'",
          "treno → 'TRÊ-nô'",
        ],
        pronunciation_focus_en: [
          "parte → 'PAR-teh' — 'partire' = 'to depart'",
          "prossimo → 'PROHS-see-moh' — hold 'ss'; means 'next'",
          "'il treno per Milano' = 'the train to/for Milan'",
        ],
      },
      {
        it: "Da quale binario parte?",
        vi: "Tàu khởi hành ở ray số mấy?",
        en: "Which platform does it leave from?",
        pronunciation_focus: [
          "quale → 'CUA-lê', qu = 'cu'",
          "binario → 'bi-NA-ri-ô'",
          "parte → 'PAR-tê'",
        ],
        pronunciation_focus_en: [
          "quale → 'KWAH-leh' — 'qu' is 'kw'",
          "binario → 'bee-NAH-ryoh' — the track/platform number",
          "'da quale binario?' = 'from which platform?'",
        ],
      },
      {
        it: "Devo scendere alla prossima fermata?",
        vi: "Tôi có phải xuống ở trạm tiếp theo không?",
        en: "Do I have to get off at the next stop?",
        pronunciation_focus: [
          "devo → 'ĐÊ-vô'",
          "scendere → 'XÊN-đê-rê', sc + e = 'x'",
          "fermata → 'fêr-MA-ta'",
        ],
        pronunciation_focus_en: [
          "devo → 'DEH-voh' — 'dovere' = 'to have to'",
          "scendere → 'SHEN-deh-reh' — 'sc' before 'e' is 'sh'; 'to get off'",
          "fermata → 'fer-MAH-tah' — the bus/tram stop",
        ],
      },
      {
        it: "Il treno è in ritardo di dieci minuti.",
        vi: "Tàu trễ mười phút.",
        en: "The train is ten minutes late.",
        pronunciation_focus: [
          "è → 'e' mở, không phải 'ê'",
          "ritardo → 'ri-TAR-đô'",
          "minuti → 'mi-NU-ti'",
        ],
        pronunciation_focus_en: [
          "è (with accent) → open 'eh', the verb 'is'",
          "ritardo → 'ree-TAR-doh' — 'in ritardo' = 'late/delayed'",
          "minuti → 'mee-NOO-tee'",
        ],
      },
      {
        it: "Un biglietto di andata e ritorno, per favore.",
        vi: "Một vé khứ hồi, làm ơn.",
        en: "A return ticket, please.",
        pronunciation_focus: [
          "biglietto → 'bi-LIÊT-tô', gli = 'li', giữ 'tt'",
          "andata → 'an-ĐA-ta'",
          "ritorno → 'ri-TÔR-nô'",
        ],
        pronunciation_focus_en: [
          "biglietto → 'bee-LYET-toh' — 'gli' is 'ly', hold the 'tt'",
          "'andata e ritorno' = 'round trip'; one-way is 'solo andata'",
          "ritorno → 'ree-TOR-noh'",
        ],
      },
    ],
    cultural_notes_vi:
      "Vé tàu/xe buýt ở Ý phải 'convalidare' (đóng dấu) trước khi lên: máy màu vàng ở sân ga hoặc trên xe. Không đóng dấu = bị phạt như đi lậu vé, dù đã mua vé. Tàu thường trễ — 'in ritardo' là từ bạn sẽ nghe rất nhiều. Bảng giờ ghi 'binario' (ray) có thể đổi phút chót, hãy nghe loa thông báo.",
    cultural_notes_en:
      "In Italy you must 'convalidare' (validate/stamp) your bus or train ticket before travelling: yellow machines on the platform or onboard. No stamp = fined as a fare-dodger even with a valid ticket. Trains are often 'in ritardo' (late) — a word you'll hear constantly. The 'binario' (platform) on the board can change at the last minute, so listen to the announcements.",
    tip_advice_vi:
      "Nhớ 'andata e ritorno' (khứ hồi) và 'solo andata' (một chiều) như hai khối. Động từ 'scendere' (xuống xe) khác 'salire' (lên xe) — học cặp này. Luôn 'convalidare' vé ngay khi lên.",
    tip_advice_en:
      "Memorize 'andata e ritorno' (return) and 'solo andata' (one-way) as fixed chunks. 'Scendere' (get off) pairs with 'salire' (get on) — learn them together. Always 'convalidare' the moment you board.",
    l1_notes_vi: [
      {
        mistake: "Nói 'treno a Milano' để chỉ 'tàu đi Milano'.",
        fix_vi: "Đúng là 'treno PER Milano' — 'per' chỉ đích đến. 'A Milano' nghĩa là 'ở Milano'.",
      },
      {
        mistake: "Dùng 'scendere' và 'salire' lẫn lộn.",
        fix_vi: "'Scendere' = xuống (sc+e đọc 'sh'), 'salire' = lên. Học thành cặp đối nghĩa.",
      },
      {
        mistake: "Quên đóng dấu vé vì 'đã mua rồi'.",
        fix_vi: "Mua vé chưa đủ — phải 'convalidare'. Không dấu = bị phạt. Đây là cú sốc quen thuộc với người mới sang.",
      },
    ],
    vocabulary: [
      { word: "il biglietto", en: "ticket", vi: "vé", pos: "n.m.", pronunciation_vi: "il bi-LIÊT-tô", pronunciation_en: "eel bee-LYET-toh" },
      { word: "il binario", en: "platform / track", vi: "ray, sân ga", pos: "n.m.", pronunciation_vi: "il bi-NA-ri-ô", pronunciation_en: "eel bee-NAH-ryoh" },
      { word: "la fermata", en: "stop (bus/tram)", vi: "trạm", pos: "n.f.", pronunciation_vi: "la fêr-MA-ta", pronunciation_en: "lah fer-MAH-tah" },
      { word: "il ritardo", en: "delay", vi: "sự trễ", pos: "n.m.", pronunciation_vi: "il ri-TAR-đô", pronunciation_en: "eel ree-TAR-doh" },
      { word: "scendere", en: "to get off", vi: "xuống xe", pos: "verb", pronunciation_vi: "XÊN-đê-rê", pronunciation_en: "SHEN-deh-reh" },
      { word: "salire", en: "to get on", vi: "lên xe", pos: "verb", pronunciation_vi: "xa-LI-rê", pronunciation_en: "sah-LEE-reh" },
      { word: "convalidare", en: "to validate (a ticket)", vi: "đóng dấu vé", pos: "verb", pronunciation_vi: "côn-va-li-ĐA-rê", pronunciation_en: "kohn-vah-lee-DAH-reh" },
      { word: "andata e ritorno", en: "return / round trip", vi: "khứ hồi", pos: "phrase", pronunciation_vi: "an-ĐA-ta ê ri-TÔR-nô", pronunciation_en: "ahn-DAH-tah eh ree-TOR-noh" },
    ],
    dialogue: [
      { speaker: "Viaggiatore", text: "Scusi, a che ora parte il treno per Roma?", vi: "Xin lỗi, tàu đi Roma khởi hành lúc mấy giờ?", en: "Excuse me, what time does the train to Rome leave?" },
      { speaker: "Addetto", text: "Alle dieci e venti, dal binario tre.", vi: "Lúc mười giờ hai mươi, ở ray số ba.", en: "At 10:20, from platform three." },
      { speaker: "Viaggiatore", text: "È in orario?", vi: "Tàu có đúng giờ không?", en: "Is it on time?" },
      { speaker: "Addetto", text: "No, è in ritardo di un quarto d'ora.", vi: "Không, trễ mười lăm phút.", en: "No, it's a quarter of an hour late." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn giới từ hoặc động từ đúng:",
        instruction_en: "Choose the right preposition or verb:",
        items: [
          { prompt: "Il treno ___ Milano parte alle nove.", answer: "per", options: ["a", "per", "in"] },
          { prompt: "Devo ___ alla prossima fermata.", answer: "scendere", options: ["scendere", "salire", "partire"] },
          { prompt: "Il treno è ___ ritardo.", answer: "in", options: ["in", "a", "di"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tàu khởi hành ở ray số mấy?", answer: "Da quale binario parte?" },
          { prompt: "Một vé khứ hồi, làm ơn.", answer: "Un biglietto di andata e ritorno, per favore." },
          { prompt: "Tàu trễ mười phút.", answer: "Il treno è in ritardo di dieci minuti." },
        ],
      },
    ],
  },

  // ── 4. Appointments ──────────────────────────────────────────────────────
  {
    id: "italian_appointments_booking",
    level: "A2",
    category: "appointments",
    title_vi: "Đặt và đổi lịch hẹn",
    title_en: "Making and changing appointments",
    sentences: [
      {
        it: "Vorrei prendere un appuntamento per giovedì.",
        vi: "Tôi muốn đặt lịch hẹn cho thứ Năm.",
        en: "I'd like to make an appointment for Thursday.",
        pronunciation_focus: [
          "vorrei → 'vôr-RÊI'",
          "appuntamento → 'ap-pun-ta-MÊN-tô', giữ 'pp'",
          "giovedì → 'giô-vê-ĐI', nhấn cuối",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — the polite opener for any request",
          "appuntamento → 'ap-poon-tah-MEN-toh' — hold the 'pp'",
          "giovedì → 'joh-veh-DEE' — final stress (accented ì)",
        ],
      },
      {
        it: "Vorrei spostare l'appuntamento a venerdì.",
        vi: "Tôi muốn đổi lịch hẹn sang thứ Sáu.",
        en: "I'd like to move the appointment to Friday.",
        pronunciation_focus: [
          "spostare → 'xpôx-TA-rê'",
          "venerdì → 'vê-nêr-ĐI', nhấn cuối",
          "l'appuntamento → nối 'l' + 'appuntamento'",
        ],
        pronunciation_focus_en: [
          "spostare → 'spoh-STAH-reh' — 'to move/reschedule'",
          "venerdì → 'veh-ner-DEE' — final stress",
          "'a venerdì' = 'to Friday'",
        ],
      },
      {
        it: "Purtroppo quel giorno lavoro.",
        vi: "Tiếc là ngày đó tôi phải làm việc.",
        en: "Unfortunately I work that day.",
        pronunciation_focus: [
          "purtroppo → 'pur-TRÔP-pô', giữ 'pp'",
          "quel → 'cuêl'",
          "lavoro → 'la-VÔ-rô'",
        ],
        pronunciation_focus_en: [
          "purtroppo → 'poor-TROHP-poh' — 'unfortunately'; hold the 'pp'",
          "quel → 'kwel' — 'quel giorno' = 'that day'",
          "lavoro → 'lah-VOH-roh'",
        ],
      },
      {
        it: "A che ora va bene per Lei?",
        vi: "Mấy giờ thì tiện cho ông/bà?",
        en: "What time works for you (formal)?",
        pronunciation_focus: [
          "va bene → 'va BÊ-nê'",
          "per Lei → 'pêr lêi', Lei trang trọng",
          "ora → 'Ô-ra'",
        ],
        pronunciation_focus_en: [
          "'va bene' = 'is fine / works'",
          "'Lei' (capital) is the formal 'you'",
          "'va bene per Lei?' = 'does it work for you?'",
        ],
      },
      {
        it: "Le confermo per le quindici e trenta.",
        vi: "Tôi xác nhận với ông/bà lúc ba giờ rưỡi chiều.",
        en: "I confirm it for 15:30 for you (formal).",
        pronunciation_focus: [
          "le → 'lê' (cho ông/bà, trang trọng)",
          "confermo → 'côn-FÊR-mô'",
          "quindici → 'CUIN-đi-chi'",
        ],
        pronunciation_focus_en: [
          "'Le' = 'to you' (formal indirect pronoun)",
          "confermo → 'kohn-FER-moh'",
          "quindici e trenta → '15:30' on the 24-hour clock",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở văn phòng, phòng khám, ngân hàng Ý gần như mọi việc cần 'appuntamento' (lịch hẹn) đặt trước — đến trực tiếp thường bị từ chối. Dùng cách nói trang trọng 'Lei' và động từ điều kiện lịch sự 'vorrei', 'potrebbe'. Xác nhận lại ngày, giờ, địa chỉ thật rõ ràng — đừng dựa vào ngữ cảnh. Thứ trong tuần viết thường: lunedì, martedì, mercoledì, giovedì, venerdì.",
    cultural_notes_en:
      "At Italian offices, clinics and banks almost everything needs an 'appuntamento' booked ahead — walking in is often turned away. Use the formal 'Lei' and polite conditional verbs 'vorrei', 'potrebbe'. Confirm the date, time and address explicitly — don't rely on context. Weekdays are lowercase: lunedì, martedì, mercoledì, giovedì, venerdì.",
    tip_advice_vi:
      "Ba từ chìa khoá: 'prendere un appuntamento' (đặt lịch), 'spostare' (đổi), 'confermare' (xác nhận). Mở đầu bằng 'Vorrei…' và dùng 'Lei' với người lạ. Luôn nói số giờ và thứ chính xác.",
    tip_advice_en:
      "Three key words: 'prendere un appuntamento' (book), 'spostare' (reschedule), 'confermare' (confirm). Open with 'Vorrei…' and use 'Lei' with strangers. Always state the exact time and day.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'tu' (thân mật) với nhân viên văn phòng.",
        fix_vi: "Với người lạ trong văn phòng dùng 'Lei' trang trọng: 'va bene per Lei?', không phải 'per te?'.",
      },
      {
        mistake: "Nói 'voglio cambiare l'appuntamento' nghe cộc.",
        fix_vi: "Lịch sự hơn: 'Vorrei spostare l'appuntamento'. 'Spostare' tự nhiên hơn 'cambiare' khi đổi giờ hẹn.",
      },
      {
        mistake: "Viết 'Giovedì' hoặc 'Venerdì' hoa giữa câu như tiếng Anh.",
        fix_vi: "Thứ trong tuần tiếng Ý viết thường: 'giovedì', 'venerdì' — trừ khi đứng đầu câu.",
      },
    ],
    vocabulary: [
      { word: "l'appuntamento", en: "appointment", vi: "lịch hẹn", pos: "n.m.", pronunciation_vi: "lap-pun-ta-MÊN-tô", pronunciation_en: "lap-poon-tah-MEN-toh" },
      { word: "prendere", en: "to take / make (appt.)", vi: "đặt (lịch)", pos: "verb", pronunciation_vi: "PRÊN-đê-rê", pronunciation_en: "PREN-deh-reh" },
      { word: "spostare", en: "to move / reschedule", vi: "dời, đổi", pos: "verb", pronunciation_vi: "xpôx-TA-rê", pronunciation_en: "spoh-STAH-reh" },
      { word: "confermare", en: "to confirm", vi: "xác nhận", pos: "verb", pronunciation_vi: "côn-fêr-MA-rê", pronunciation_en: "kohn-fer-MAH-reh" },
      { word: "disdire", en: "to cancel", vi: "huỷ", pos: "verb", pronunciation_vi: "đix-ĐI-rê", pronunciation_en: "dees-DEE-reh" },
      { word: "purtroppo", en: "unfortunately", vi: "tiếc là", pos: "adverb", pronunciation_vi: "pur-TRÔP-pô", pronunciation_en: "poor-TROHP-poh" },
      { word: "giovedì", en: "Thursday", vi: "thứ Năm", pos: "n.m.", pronunciation_vi: "giô-vê-ĐI", pronunciation_en: "joh-veh-DEE" },
      { word: "va bene", en: "OK / it works", vi: "được, ổn", pos: "phrase", pronunciation_vi: "va BÊ-nê", pronunciation_en: "vah BEH-neh" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Buongiorno, vorrei prendere un appuntamento.", vi: "Chào, tôi muốn đặt lịch hẹn.", en: "Hello, I'd like to make an appointment." },
      { speaker: "Segretaria", text: "Certo. Le va bene giovedì alle quindici?", vi: "Được. Thứ Năm lúc ba giờ chiều có tiện không ạ?", en: "Sure. Does Thursday at 15:00 work for you?" },
      { speaker: "Cliente", text: "Purtroppo giovedì lavoro. È possibile venerdì?", vi: "Tiếc là thứ Năm tôi làm việc. Thứ Sáu được không?", en: "Unfortunately I work Thursday. Is Friday possible?" },
      { speaker: "Segretaria", text: "Sì. Le confermo venerdì alle quindici e trenta.", vi: "Vâng. Tôi xác nhận thứ Sáu lúc ba giờ rưỡi.", en: "Yes. I confirm Friday at 15:30." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lịch sự / trang trọng đúng:",
        instruction_en: "Fill in the polite / formal word:",
        items: [
          { prompt: "___ prendere un appuntamento.", answer: "Vorrei", options: ["Voglio", "Vorrei", "Ho"] },
          { prompt: "A che ora va bene per ___?", answer: "Lei", options: ["te", "Lei", "tu"] },
          { prompt: "Vorrei ___ l'appuntamento a venerdì.", answer: "spostare", options: ["spostare", "andare", "prendere"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi muốn đổi lịch hẹn sang thứ Sáu.", answer: "Vorrei spostare l'appuntamento a venerdì." },
          { prompt: "Tiếc là ngày đó tôi phải làm việc.", answer: "Purtroppo quel giorno lavoro." },
          { prompt: "Mấy giờ thì tiện cho ông/bà?", answer: "A che ora va bene per Lei?" },
        ],
      },
    ],
  },

  // ── 5. Health & pharmacy ─────────────────────────────────────────────────
  {
    id: "italian_health_pharmacy",
    level: "A2",
    category: "health",
    title_vi: "Sức khỏe và hiệu thuốc",
    title_en: "Health and the pharmacy",
    sentences: [
      {
        it: "Ho mal di gola da ieri.",
        vi: "Tôi đau họng từ hôm qua.",
        en: "I've had a sore throat since yesterday.",
        pronunciation_focus: [
          "ho → 'ô' (h câm)",
          "gola → 'GÔ-la', ga/go = 'g' cứng",
          "ieri → 'I-ê-ri'",
        ],
        pronunciation_focus_en: [
          "ho → 'oh' — the 'h' is always silent",
          "'mal di gola' = 'sore throat' (lit. 'pain of throat')",
          "'da ieri' = 'since yesterday' — 'da' + time = 'since'",
        ],
      },
      {
        it: "Mi serve qualcosa per la tosse.",
        vi: "Tôi cần thứ gì đó cho cơn ho.",
        en: "I need something for a cough.",
        pronunciation_focus: [
          "serve → 'XÊR-vê'",
          "qualcosa → 'cual-CÔ-za'",
          "tosse → 'TÔX-xê', giữ 'ss'",
        ],
        pronunciation_focus_en: [
          "'mi serve' = 'I need' (lit. 'to me serves')",
          "qualcosa → 'kwahl-KOH-zah'",
          "tosse → 'TOHS-seh' — hold the 'ss'; final 'e' sounds",
        ],
      },
      {
        it: "Ho la febbre e mi fa male la testa.",
        vi: "Tôi bị sốt và đau đầu.",
        en: "I have a fever and my head hurts.",
        pronunciation_focus: [
          "febbre → 'FÊB-brê', giữ 'bb'",
          "mi fa male → 'mi fa MA-lê'",
          "testa → 'TÊX-ta'",
        ],
        pronunciation_focus_en: [
          "febbre → 'FEB-breh' — hold 'bb'; 'ho la febbre' = 'I have a fever'",
          "'mi fa male…' = '… hurts me' (X makes pain to me)",
          "testa → 'TEH-stah'",
        ],
      },
      {
        it: "Quante volte al giorno devo prenderlo?",
        vi: "Mỗi ngày tôi uống mấy lần?",
        en: "How many times a day should I take it?",
        pronunciation_focus: [
          "quante → 'CUAN-tê'",
          "al giorno → 'al GIÔR-nô'",
          "prenderlo → 'PRÊN-đêr-lô' (prendere + lo)",
        ],
        pronunciation_focus_en: [
          "quante → 'KWAHN-teh'",
          "'al giorno' = 'per day'",
          "prenderlo → 'PREN-der-loh' — 'prendere' + 'lo' (it)",
        ],
      },
      {
        it: "Devo andare dal medico domani.",
        vi: "Mai tôi phải đi khám bác sĩ.",
        en: "I have to go to the doctor tomorrow.",
        pronunciation_focus: [
          "devo → 'ĐÊ-vô'",
          "dal medico → 'đal MÊ-đi-cô'",
          "domani → 'đô-MA-ni'",
        ],
        pronunciation_focus_en: [
          "devo → 'DEH-voh' — 'I have to'",
          "'dal medico' = 'to the doctor's' — 'da' + person = 'at/to X's place'",
          "domani → 'doh-MAH-nee'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Ý 'la farmacia' (hiệu thuốc, đèn chữ thập xanh) là nơi đầu tiên cho bệnh nhẹ — dược sĩ tư vấn được nhiều thứ không cần đơn. Bệnh nặng hơn cần 'il medico di base' (bác sĩ gia đình) đã đăng ký. Cấp cứu gọi 112. Nhiều thuốc cần 'la ricetta' (đơn thuốc). Diễn đạt bệnh dùng hai khuôn: 'ho mal di…' (đau…) và 'mi fa male…' (… đau).",
    cultural_notes_en:
      "In Italy 'la farmacia' (pharmacy, green cross) is the first stop for minor illness — pharmacists advise on a lot without a prescription. Anything more needs your registered 'medico di base' (GP). Emergencies: dial 112. Many medicines need 'la ricetta' (prescription). Describe symptoms with two frames: 'ho mal di…' (I have ache of…) and 'mi fa male…' (… hurts me).",
    tip_advice_vi:
      "Học khuôn 'da + thời gian' để nói 'từ khi nào': 'da ieri', 'da due giorni' — rất quan trọng khi tả triệu chứng. Phân biệt 'ho mal di gola' (cấu trúc cố định) và 'mi fa male la testa' (bộ phận làm chủ ngữ).",
    tip_advice_en:
      "Learn 'da + time' to say 'since/for': 'da ieri', 'da due giorni' — vital for symptoms. Distinguish 'ho mal di gola' (fixed frame) from 'mi fa male la testa' (the body part is the subject).",
    l1_notes_vi: [
      {
        mistake: "Nói 'sono febbre' / 'sono malato il mal di gola'.",
        fix_vi: "Tiếng Ý dùng 'avere' cho triệu chứng: 'HO la febbre', 'HO mal di gola'. Không dùng 'essere'.",
      },
      {
        mistake: "Dịch 'từ hôm qua' thành 'di ieri' hoặc 'da ieri' sai chỗ.",
        fix_vi: "'Da ieri' = từ hôm qua (vẫn đang tiếp diễn). 'Da' chỉ điểm bắt đầu kéo dài tới hiện tại.",
      },
      {
        mistake: "Nói 'mi fa male la mia testa'.",
        fix_vi: "Với bộ phận cơ thể, tiếng Ý dùng mạo từ chứ không dùng sở hữu: 'mi fa male LA testa', không phải 'la MIA testa'.",
      },
    ],
    vocabulary: [
      { word: "la farmacia", en: "pharmacy", vi: "hiệu thuốc", pos: "n.f.", pronunciation_vi: "la far-ma-CHI-a", pronunciation_en: "lah far-mah-CHEE-ah" },
      { word: "la febbre", en: "fever", vi: "sốt", pos: "n.f.", pronunciation_vi: "la FÊB-brê", pronunciation_en: "lah FEB-breh" },
      { word: "la tosse", en: "cough", vi: "ho", pos: "n.f.", pronunciation_vi: "la TÔX-xê", pronunciation_en: "lah TOHS-seh" },
      { word: "il mal di gola", en: "sore throat", vi: "đau họng", pos: "n.m.", pronunciation_vi: "il mal đi GÔ-la", pronunciation_en: "eel mahl dee GOH-lah" },
      { word: "il dolore", en: "pain", vi: "cơn đau", pos: "n.m.", pronunciation_vi: "il đô-LÔ-rê", pronunciation_en: "eel doh-LOH-reh" },
      { word: "la ricetta", en: "prescription", vi: "đơn thuốc", pos: "n.f.", pronunciation_vi: "la ri-CHÊT-ta", pronunciation_en: "lah ree-CHET-tah" },
      { word: "il medico", en: "doctor", vi: "bác sĩ", pos: "n.m.", pronunciation_vi: "il MÊ-đi-cô", pronunciation_en: "eel MEH-dee-koh" },
      { word: "la medicina", en: "medicine", vi: "thuốc", pos: "n.f.", pronunciation_vi: "la mê-đi-CHI-na", pronunciation_en: "lah meh-dee-CHEE-nah" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Buonasera, ho mal di gola e un po' di tosse.", vi: "Chào buổi tối, tôi đau họng và hơi ho.", en: "Good evening, I have a sore throat and a bit of a cough." },
      { speaker: "Farmacista", text: "Da quando?", vi: "Từ khi nào ạ?", en: "Since when?" },
      { speaker: "Cliente", text: "Da ieri. Mi serve qualcosa.", vi: "Từ hôm qua. Tôi cần thứ gì đó.", en: "Since yesterday. I need something." },
      { speaker: "Farmacista", text: "Prenda queste pastiglie, due volte al giorno.", vi: "Anh/chị dùng viên ngậm này, ngày hai lần.", en: "Take these lozenges, twice a day." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn động từ / giới từ đúng:",
        instruction_en: "Choose the right verb / preposition:",
        items: [
          { prompt: "___ la febbre da ieri.", answer: "Ho", options: ["Sono", "Ho", "Mi"] },
          { prompt: "Ho mal di gola ___ ieri.", answer: "da", options: ["di", "da", "in"] },
          { prompt: "Mi fa male ___ testa.", answer: "la", options: ["la", "la mia", "mia"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi đau họng từ hôm qua.", answer: "Ho mal di gola da ieri." },
          { prompt: "Tôi cần thứ gì đó cho cơn ho.", answer: "Mi serve qualcosa per la tosse." },
          { prompt: "Mai tôi phải đi khám bác sĩ.", answer: "Devo andare dal medico domani." },
        ],
      },
    ],
  },

  // ── 6. Housing & repairs ─────────────────────────────────────────────────
  {
    id: "italian_housing_repairs",
    level: "A2",
    category: "housing",
    title_vi: "Nhà thuê và sửa chữa",
    title_en: "Renting and reporting repairs",
    sentences: [
      {
        it: "Il riscaldamento non funziona da ieri.",
        vi: "Hệ thống sưởi không hoạt động từ hôm qua.",
        en: "The heating hasn't worked since yesterday.",
        pronunciation_focus: [
          "riscaldamento → 'rix-cal-đa-MÊN-tô'",
          "funziona → 'fun-TSI-ô-na', z = 'ts'",
          "da ieri → 'đa I-ê-ri'",
        ],
        pronunciation_focus_en: [
          "riscaldamento → 'rees-kahl-dah-MEN-toh' — 'the heating'",
          "funziona → 'foon-TSYOH-nah' — 'z' is 'ts'",
          "'non funziona da ieri' = 'hasn't worked since yesterday'",
        ],
      },
      {
        it: "C'è una perdita d'acqua in cucina.",
        vi: "Có rò nước trong bếp.",
        en: "There's a water leak in the kitchen.",
        pronunciation_focus: [
          "c'è → 'chê' (có)",
          "perdita → 'PÊR-đi-ta' (nhấn đầu)",
          "acqua → 'AC-cua', giữ 'cq'",
        ],
        pronunciation_focus_en: [
          "c'è → 'cheh' — 'there is'",
          "perdita → 'PER-dee-tah' — stress the first syllable; 'a leak'",
          "acqua → 'AHK-kwah' — 'cq' is a long 'k' + 'kw'",
        ],
      },
      {
        it: "Le mando una foto del problema.",
        vi: "Tôi gửi ông/bà một tấm ảnh về vấn đề.",
        en: "I'll send you a photo of the problem.",
        pronunciation_focus: [
          "le → 'lê' (cho ông/bà)",
          "mando → 'MAN-đô'",
          "problema → 'prô-BLÊ-ma' (giống đực!)",
        ],
        pronunciation_focus_en: [
          "'Le mando' = 'I send you' (formal indirect 'Le')",
          "mando → 'MAHN-doh'",
          "problema → 'proh-BLEH-mah' — masculine despite ending in -a: 'il problema'",
        ],
      },
      {
        it: "Quando può venire a ripararlo?",
        vi: "Khi nào ông/bà có thể đến sửa?",
        en: "When can you come to fix it?",
        pronunciation_focus: [
          "può → 'puô'",
          "venire → 'vê-NI-rê'",
          "ripararlo → 'ri-pa-RAR-lô' (riparare + lo)",
        ],
        pronunciation_focus_en: [
          "può → 'pwoh' — 'can' (formal)",
          "venire → 'veh-NEE-reh' — 'to come'",
          "ripararlo → 'ree-pah-RAR-loh' — 'riparare' (fix) + 'lo' (it)",
        ],
      },
      {
        it: "Pago l'affitto all'inizio del mese.",
        vi: "Tôi trả tiền thuê vào đầu tháng.",
        en: "I pay the rent at the start of the month.",
        pronunciation_focus: [
          "affitto → 'af-FIT-tô', giữ 'ff' và 'tt'",
          "inizio → 'i-NI-tsi-ô'",
          "mese → 'MÊ-zê'",
        ],
        pronunciation_focus_en: [
          "affitto → 'af-FEET-toh' — hold 'ff' and 'tt'; 'the rent'",
          "inizio → 'ee-NEE-tsyoh' — 'the start'",
          "mese → 'MEH-zeh' — 'the month'",
        ],
      },
    ],
    cultural_notes_vi:
      "Hợp đồng thuê nhà ('il contratto d'affitto') ở Ý thường có 'spese condominiali' (phí chung cư) tính riêng ngoài tiền thuê. Báo hỏng hóc bằng tin nhắn (WhatsApp) cho 'il padrone di casa' (chủ nhà) là bình thường — kèm ảnh. Dùng 'non funziona' (không hoạt động) cho thiết bị, 'c'è una perdita' (có rò) cho nước. Lưu ý: 'problema' tuy kết thúc bằng -a nhưng là giống đực: 'il problema', 'un problema serio'.",
    cultural_notes_en:
      "An Italian rental contract ('il contratto d'affitto') usually has 'spese condominiali' (building fees) on top of rent. Reporting faults by WhatsApp to 'il padrone di casa' (landlord), with a photo, is normal. Use 'non funziona' (doesn't work) for appliances, 'c'è una perdita' (there's a leak) for water. Note: 'problema' ends in -a but is masculine: 'il problema', 'un problema serio'.",
    tip_advice_vi:
      "Hai khuôn báo hỏng: 'X non funziona' (X hỏng) và 'c'è una perdita di…' (có rò…). Thêm 'da ieri / da due giorni' để nói đã bao lâu. Viết tin nhắn lịch sự cho chủ nhà, dùng 'Le' và kèm ảnh.",
    tip_advice_en:
      "Two fault frames: 'X non funziona' (X is broken) and 'c'è una perdita di…' (there's a leak of…). Add 'da ieri / da due giorni' to say how long. Message the landlord politely with 'Le' and attach a photo.",
    l1_notes_vi: [
      {
        mistake: "Nói 'il problema è serio' nhưng dùng 'la problema'.",
        fix_vi: "'Problema' là giống ĐỰC dù kết thúc -a: 'IL problema', 'un problema'. Cùng nhóm: il tema, il sistema.",
      },
      {
        mistake: "Dịch 'có rò nước' thành 'ha una perdita'.",
        fix_vi: "Dùng 'c'è' cho 'có/tồn tại': 'C'è una perdita d'acqua'. 'Ha' là 'sở hữu', không hợp ở đây.",
      },
      {
        mistake: "Bỏ giới từ: 'pago affitto inizio mese'.",
        fix_vi: "Cần mạo từ và giới từ: 'pago L'affitto ALL'inizio DEL mese'. Tiếng Việt lược, tiếng Ý không.",
      },
    ],
    vocabulary: [
      { word: "l'affitto", en: "rent", vi: "tiền thuê", pos: "n.m.", pronunciation_vi: "laf-FIT-tô", pronunciation_en: "lahf-FEET-toh" },
      { word: "il contratto", en: "contract", vi: "hợp đồng", pos: "n.m.", pronunciation_vi: "il côn-TRAT-tô", pronunciation_en: "eel kohn-TRAHT-toh" },
      { word: "il riscaldamento", en: "heating", vi: "hệ thống sưởi", pos: "n.m.", pronunciation_vi: "il rix-cal-đa-MÊN-tô", pronunciation_en: "eel rees-kahl-dah-MEN-toh" },
      { word: "la perdita", en: "leak", vi: "chỗ rò", pos: "n.f.", pronunciation_vi: "la PÊR-đi-ta", pronunciation_en: "lah PER-dee-tah" },
      { word: "il problema", en: "problem (masc.)", vi: "vấn đề", pos: "n.m.", pronunciation_vi: "il prô-BLÊ-ma", pronunciation_en: "eel proh-BLEH-mah" },
      { word: "riparare", en: "to repair", vi: "sửa", pos: "verb", pronunciation_vi: "ri-pa-RA-rê", pronunciation_en: "ree-pah-RAH-reh" },
      { word: "funzionare", en: "to work / function", vi: "hoạt động", pos: "verb", pronunciation_vi: "fun-tsi-ô-NA-rê", pronunciation_en: "foon-tsyoh-NAH-reh" },
      { word: "il padrone di casa", en: "landlord", vi: "chủ nhà", pos: "n.m.", pronunciation_vi: "il pa-ĐRÔ-nê đi CA-za", pronunciation_en: "eel pah-DROH-neh dee KAH-zah" },
    ],
    dialogue: [
      { speaker: "Inquilino", text: "Buongiorno, il riscaldamento non funziona da ieri.", vi: "Chào, hệ thống sưởi không hoạt động từ hôm qua.", en: "Hello, the heating hasn't worked since yesterday." },
      { speaker: "Padrone", text: "Mi dispiace. C'è anche altro?", vi: "Tôi xin lỗi. Còn vấn đề gì khác không?", en: "I'm sorry. Anything else?" },
      { speaker: "Inquilino", text: "Sì, c'è una perdita d'acqua in cucina. Le mando una foto.", vi: "Có, có rò nước trong bếp. Tôi gửi ảnh cho ông.", en: "Yes, a water leak in the kitchen. I'll send you a photo." },
      { speaker: "Padrone", text: "Va bene. Mando un tecnico domani mattina.", vi: "Được. Mai sáng tôi cho thợ tới.", en: "OK. I'll send a technician tomorrow morning." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word with its meaning:",
        items: [
          { prompt: "l'affitto", answer: "tiền thuê (rent)" },
          { prompt: "la perdita", answer: "chỗ rò (leak)" },
          { prompt: "il padrone di casa", answer: "chủ nhà (landlord)" },
          { prompt: "riparare", answer: "sửa (to repair)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý (chú ý mạo từ và 'c'è'):",
        instruction_en: "Translate into Italian (mind the article and 'c'è'):",
        items: [
          { prompt: "Hệ thống sưởi không hoạt động từ hôm qua.", answer: "Il riscaldamento non funziona da ieri." },
          { prompt: "Có rò nước trong bếp.", answer: "C'è una perdita d'acqua in cucina." },
          { prompt: "Khi nào ông/bà có thể đến sửa?", answer: "Quando può venire a ripararlo?" },
        ],
      },
    ],
  },

  // ── 7. Work basics ───────────────────────────────────────────────────────
  {
    id: "italian_work_shifts_tasks",
    level: "A2",
    category: "work",
    title_vi: "Công việc: ca và nhiệm vụ",
    title_en: "Work basics: shifts and tasks",
    sentences: [
      {
        it: "Questa settimana ho il turno di mattina.",
        vi: "Tuần này tôi có ca sáng.",
        en: "This week I'm on the morning shift.",
        pronunciation_focus: [
          "questa → 'CUÊX-ta'",
          "turno → 'TUR-nô'",
          "mattina → 'mat-TI-na', giữ 'tt'",
        ],
        pronunciation_focus_en: [
          "questa → 'KWEH-stah'",
          "'il turno di mattina' = 'the morning shift'",
          "mattina → 'mat-TEE-nah' — hold the 'tt'",
        ],
      },
      {
        it: "Posso cambiare turno con un collega?",
        vi: "Tôi đổi ca với đồng nghiệp được không?",
        en: "Can I swap shifts with a colleague?",
        pronunciation_focus: [
          "posso → 'PÔX-xô', giữ 'ss'",
          "cambiare → 'cam-BIA-rê'",
          "collega → 'côl-LÊ-ga', giữ 'll'",
        ],
        pronunciation_focus_en: [
          "posso → 'POHS-soh' — 'can I'",
          "cambiare → 'kahm-BYAH-reh' — 'to change/swap'",
          "collega → 'kohl-LEH-gah' — hold 'll'; 'a colleague'",
        ],
      },
      {
        it: "Mi può spiegare questa procedura?",
        vi: "Anh/chị giải thích quy trình này được không?",
        en: "Can you explain this procedure to me?",
        pronunciation_focus: [
          "spiegare → 'xpiê-GA-rê'",
          "procedura → 'prô-chê-ĐU-ra', ce = 'chê'",
          "questa → 'CUÊX-ta'",
        ],
        pronunciation_focus_en: [
          "spiegare → 'spyeh-GAH-reh' — 'to explain'",
          "procedura → 'proh-cheh-DOO-rah' — 'ce' is 'cheh'",
          "'mi può spiegare?' = polite 'can you explain to me?'",
        ],
      },
      {
        it: "Devo finire questo lavoro entro le cinque.",
        vi: "Tôi phải xong việc này trước năm giờ.",
        en: "I have to finish this job by five.",
        pronunciation_focus: [
          "devo → 'ĐÊ-vô'",
          "finire → 'fi-NI-rê'",
          "entro → 'ÊN-trô' (trước, trong vòng)",
        ],
        pronunciation_focus_en: [
          "devo → 'DEH-voh' — 'I have to'",
          "finire → 'fee-NEE-reh'",
          "'entro le cinque' = 'by five o'clock' (deadline)",
        ],
      },
      {
        it: "Scusi, posso uscire un po' prima oggi?",
        vi: "Xin lỗi, hôm nay tôi ra sớm một chút được không?",
        en: "Excuse me, can I leave a bit earlier today?",
        pronunciation_focus: [
          "scusi → 'XCU-ji'",
          "uscire → 'u-XI-rê', sc + i = 'x'",
          "prima → 'PRI-ma'",
        ],
        pronunciation_focus_en: [
          "scusi → 'SKOO-zee' — formal 'excuse me'",
          "uscire → 'oo-SHEE-reh' — 'sc' before 'i' is 'sh'; 'to leave/go out'",
          "'un po' prima' = 'a little earlier'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nơi làm việc Ý, với cấp trên ('il capo', 'il responsabile') dùng 'Lei' trang trọng và 'Scusi…', 'Posso…?', 'Potrebbe…?'. Xin nghỉ/đổi ca nên hỏi sớm và rõ lý do. 'Collega' (đồng nghiệp) đổi theo giống: 'un collega' (nam), 'una collega' (nữ). Đừng im lặng khi không hiểu — hỏi 'Mi può spiegare?' được coi là chuyên nghiệp, không phải kém cỏi.",
    cultural_notes_en:
      "At an Italian workplace, address a superior ('il capo', 'il responsabile') with the formal 'Lei' and 'Scusi…', 'Posso…?', 'Potrebbe…?'. Ask for leave or a shift swap early and with a clear reason. 'Collega' shifts by gender: 'un collega' (m), 'una collega' (f). Don't stay silent when lost — asking 'Mi può spiegare?' reads as professional, not weak.",
    tip_advice_vi:
      "Ba câu quyền lực nơi làm việc: 'Posso…?' (xin phép), 'Mi può spiegare…?' (nhờ giải thích), 'Devo finire… entro…' (deadline). Với sếp luôn 'Lei' + 'Scusi'. Nói rõ giờ và việc cụ thể.",
    tip_advice_en:
      "Three power lines at work: 'Posso…?' (may I), 'Mi può spiegare…?' (can you explain), 'Devo finire… entro…' (deadline). With the boss, always 'Lei' + 'Scusi'. State the exact time and task.",
    l1_notes_vi: [
      {
        mistake: "Nói 'posso cambio turno' (chia sai động từ sau 'posso').",
        fix_vi: "Sau động từ khuyết thiếu ('posso', 'devo', 'voglio') dùng NGUYÊN MẪU: 'posso cambiARE turno'.",
      },
      {
        mistake: "Dùng 'un collega' cho đồng nghiệp nữ.",
        fix_vi: "'Collega' đổi mạo từ theo giống: 'una collega' (nữ), 'un collega' (nam). Từ giữ nguyên, mạo từ đổi.",
      },
      {
        mistake: "Im lặng vì sợ hỏi lại sếp.",
        fix_vi: "Hỏi 'Mi può spiegare la procedura?' là bình thường và chuyên nghiệp. Đừng đoán mò rồi làm sai.",
      },
    ],
    vocabulary: [
      { word: "il turno", en: "shift", vi: "ca làm", pos: "n.m.", pronunciation_vi: "il TUR-nô", pronunciation_en: "eel TOOR-noh" },
      { word: "il collega / la collega", en: "colleague (m/f)", vi: "đồng nghiệp", pos: "n.m./n.f.", pronunciation_vi: "il/la côl-LÊ-ga", pronunciation_en: "eel/lah kohl-LEH-gah" },
      { word: "il capo", en: "boss", vi: "sếp", pos: "n.m.", pronunciation_vi: "il CA-pô", pronunciation_en: "eel KAH-poh" },
      { word: "il responsabile", en: "supervisor", vi: "người phụ trách", pos: "n.m.", pronunciation_vi: "il rêx-pôn-XA-bi-lê", pronunciation_en: "eel res-pohn-SAH-bee-leh" },
      { word: "la procedura", en: "procedure", vi: "quy trình", pos: "n.f.", pronunciation_vi: "la prô-chê-ĐU-ra", pronunciation_en: "lah proh-cheh-DOO-rah" },
      { word: "cambiare", en: "to change / swap", vi: "đổi", pos: "verb", pronunciation_vi: "cam-BIA-rê", pronunciation_en: "kahm-BYAH-reh" },
      { word: "spiegare", en: "to explain", vi: "giải thích", pos: "verb", pronunciation_vi: "xpiê-GA-rê", pronunciation_en: "spyeh-GAH-reh" },
      { word: "entro", en: "by / within (time)", vi: "trước, trong vòng", pos: "preposition", pronunciation_vi: "ÊN-trô", pronunciation_en: "EN-troh" },
    ],
    dialogue: [
      { speaker: "Operaio", text: "Scusi, posso cambiare turno con un collega venerdì?", vi: "Xin lỗi, thứ Sáu tôi đổi ca với đồng nghiệp được không?", en: "Excuse me, can I swap shifts with a colleague on Friday?" },
      { speaker: "Responsabile", text: "Perché?", vi: "Vì sao?", en: "Why?" },
      { speaker: "Operaio", text: "Devo andare dal medico. Mi dispiace per il problema.", vi: "Tôi phải đi khám bác sĩ. Xin lỗi vì phiền.", en: "I have to go to the doctor. Sorry for the trouble." },
      { speaker: "Responsabile", text: "Va bene, ma me lo scriva in un messaggio.", vi: "Được, nhưng hãy nhắn tin cho tôi.", en: "OK, but put it to me in a message." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng động từ đúng sau 'posso/devo':",
        instruction_en: "Choose the right verb form after 'posso/devo':",
        items: [
          { prompt: "Posso ___ turno con un collega?", answer: "cambiare", options: ["cambio", "cambiare", "cambiato"] },
          { prompt: "Devo ___ questo lavoro entro le cinque.", answer: "finire", options: ["finisco", "finire", "finito"] },
          { prompt: "Mi può ___ la procedura?", answer: "spiegare", options: ["spiega", "spiegare", "spiego"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tuần này tôi có ca sáng.", answer: "Questa settimana ho il turno di mattina." },
          { prompt: "Anh/chị giải thích quy trình này được không?", answer: "Mi può spiegare questa procedura?" },
          { prompt: "Xin lỗi, hôm nay tôi ra sớm một chút được không?", answer: "Scusi, posso uscire un po' prima oggi?" },
        ],
      },
    ],
  },

  // ── 8. Passato prossimo (simple past) ────────────────────────────────────
  {
    id: "italian_past_tense_passato_prossimo",
    level: "A2",
    category: "past_tense",
    title_vi: "Thì quá khứ: passato prossimo",
    title_en: "The past tense: passato prossimo",
    sentences: [
      {
        it: "Ieri ho lavorato fino a tardi.",
        vi: "Hôm qua tôi đã làm việc đến muộn.",
        en: "Yesterday I worked until late.",
        pronunciation_focus: [
          "ho → 'ô' (h câm)",
          "lavorato → 'la-vô-RA-tô'",
          "tardi → 'TAR-đi'",
        ],
        pronunciation_focus_en: [
          "ho → 'oh' — auxiliary 'avere', silent 'h'",
          "lavorato → 'lah-voh-RAH-toh' — past participle of 'lavorare'",
          "'ho lavorato' = 'I worked / have worked'",
        ],
      },
      {
        it: "Sono andato dal medico stamattina.",
        vi: "Sáng nay tôi đã đi khám bác sĩ.",
        en: "I went to the doctor this morning.",
        pronunciation_focus: [
          "sono → 'XÔ-nô'",
          "andato → 'an-ĐA-tô' (đực) / andata (cái)",
          "stamattina → 'xta-mat-TI-na'",
        ],
        pronunciation_focus_en: [
          "sono → 'SOH-noh' — auxiliary 'essere' for movement",
          "andato (m) / andata (f) — the participle agrees with the speaker's gender",
          "'sono andato/a' = 'I went'",
        ],
      },
      {
        it: "Ho comprato il pane e ho pagato con la carta.",
        vi: "Tôi đã mua bánh mì và trả bằng thẻ.",
        en: "I bought bread and paid by card.",
        pronunciation_focus: [
          "comprato → 'côm-PRA-tô'",
          "pagato → 'pa-GA-tô', ga = 'g' cứng",
          "carta → 'CAR-ta'",
        ],
        pronunciation_focus_en: [
          "comprato → 'kohm-PRAH-toh' — both take 'avere' (ho)",
          "pagato → 'pah-GAH-toh' — hard 'g'",
          "with 'avere', the participle does NOT change for the speaker",
        ],
      },
      {
        it: "Maria è arrivata tardi alla riunione.",
        vi: "Maria đã đến muộn buổi họp.",
        en: "Maria arrived late to the meeting.",
        pronunciation_focus: [
          "è → 'e' mở (động từ 'là/thì')",
          "arrivata → 'ar-ri-VA-ta', giữ 'rr', đuôi -a (nữ)",
          "riunione → 'ri-u-NIÔ-nê'",
        ],
        pronunciation_focus_en: [
          "è → 'eh' — auxiliary 'essere'",
          "arrivata → 'ar-ree-VAH-tah' — '-a' because Maria is female",
          "with 'essere', the participle agrees: arrivato/arrivata/arrivati/arrivate",
        ],
      },
      {
        it: "Non ho capito la domanda, scusi.",
        vi: "Tôi không hiểu câu hỏi, xin lỗi.",
        en: "I didn't understand the question, sorry.",
        pronunciation_focus: [
          "non → 'nôn' (trước trợ động từ)",
          "ho capito → 'ô ca-PI-tô'",
          "domanda → 'đô-MAN-đa'",
        ],
        pronunciation_focus_en: [
          "'non' goes before the whole verb: 'non ho capito'",
          "ho capito → 'oh kah-PEE-toh' — 'I understood / I didn't'",
          "domanda → 'doh-MAHN-dah' — 'the question'",
        ],
      },
    ],
    cultural_notes_vi:
      "'Passato prossimo' là thì quá khứ chính người Ý dùng hằng ngày để kể chuyện đã xong. Công thức: trợ động từ ('avere' HOẶC 'essere' ở hiện tại) + quá khứ phân từ. Đa số động từ dùng 'avere'. Nhóm chỉ chuyển động/trạng thái (andare, venire, arrivare, partire, essere, nascere, restare…) dùng 'essere' — và khi đó phân từ phải hợp giống và số với chủ ngữ.",
    cultural_notes_en:
      "'Passato prossimo' is the everyday past tense Italians use to tell what happened. Formula: auxiliary ('avere' OR 'essere' in the present) + past participle. Most verbs take 'avere'. A set of motion/state verbs (andare, venire, arrivare, partire, essere, nascere, restare…) take 'essere' — and then the participle must agree in gender and number with the subject.",
    tip_advice_vi:
      "Quy tắc vàng người Việt phải khắc: 'sono andato/a', KHÔNG BAO GIỜ 'ho andato'. Học danh sách động từ dùng 'essere' (đa số là chuyển động). Với 'essere' nhớ đổi đuôi: nam -o, nữ -a, số nhiều -i/-e. Phủ định 'non' đứng trước trợ động từ: 'non ho capito'.",
    tip_advice_en:
      "Golden rule for Vietnamese speakers: 'sono andato/a', NEVER 'ho andato'. Memorize the 'essere' verb list (mostly motion). With 'essere' change the ending: m -o, f -a, plural -i/-e. Negation 'non' goes before the auxiliary: 'non ho capito'.",
    l1_notes_vi: [
      {
        mistake: "Nói 'ho andato', 'ho arrivato'.",
        fix_vi: "Động từ chuyển động dùng 'essere': 'SONO andato/a', 'SONO arrivato/a'. Đây là lỗi A2 phổ biến nhất.",
      },
      {
        mistake: "Bỏ trợ động từ: 'Io lavorato ieri.'",
        fix_vi: "Quá khứ Ý cần TRỢ ĐỘNG TỪ + phân từ: 'HO lavorato ieri'. Tiếng Việt chỉ thêm 'đã' nên dễ quên.",
      },
      {
        mistake: "Nữ nói 'sono andato' (không đổi đuôi).",
        fix_vi: "Với 'essere', phân từ hợp giống: nữ nói 'sono andatA', số nhiều 'siamo andatI/andatE'.",
      },
      {
        mistake: "Đặt 'non' sai chỗ: 'ho non capito'.",
        fix_vi: "'Non' đứng trước cả cụm động từ: 'NON ho capito'.",
      },
    ],
    vocabulary: [
      { word: "ieri", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "I-ê-ri", pronunciation_en: "ee-EH-ree" },
      { word: "stamattina", en: "this morning", vi: "sáng nay", pos: "adverb", pronunciation_vi: "xta-mat-TI-na", pronunciation_en: "stah-mat-TEE-nah" },
      { word: "avere", en: "to have (auxiliary)", vi: "có (trợ động từ)", pos: "verb", pronunciation_vi: "a-VÊ-rê", pronunciation_en: "ah-VEH-reh" },
      { word: "essere", en: "to be (auxiliary)", vi: "là/thì (trợ động từ)", pos: "verb", pronunciation_vi: "ÊX-xê-rê", pronunciation_en: "ES-seh-reh" },
      { word: "andare", en: "to go (uses essere)", vi: "đi (dùng essere)", pos: "verb", pronunciation_vi: "an-ĐA-rê", pronunciation_en: "ahn-DAH-reh" },
      { word: "arrivare", en: "to arrive (uses essere)", vi: "đến (dùng essere)", pos: "verb", pronunciation_vi: "ar-ri-VA-rê", pronunciation_en: "ar-ree-VAH-reh" },
      { word: "comprare", en: "to buy (uses avere)", vi: "mua (dùng avere)", pos: "verb", pronunciation_vi: "côm-PRA-rê", pronunciation_en: "kohm-PRAH-reh" },
      { word: "capire", en: "to understand", vi: "hiểu", pos: "verb", pronunciation_vi: "ca-PI-rê", pronunciation_en: "kah-PEE-reh" },
    ],
    dialogue: [
      { speaker: "A", text: "Che cosa hai fatto ieri?", vi: "Hôm qua bạn đã làm gì?", en: "What did you do yesterday?" },
      { speaker: "B", text: "Ho lavorato la mattina e sono andato in banca.", vi: "Tôi làm buổi sáng rồi đi ngân hàng.", en: "I worked in the morning and went to the bank." },
      { speaker: "A", text: "E la sera?", vi: "Còn buổi tối?", en: "And in the evening?" },
      { speaker: "B", text: "Sono tornato a casa tardi e ho cucinato.", vi: "Tôi về nhà muộn rồi nấu ăn.", en: "I got home late and cooked." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn trợ động từ đúng ('ho' hay 'sono') và đuôi phân từ:",
        instruction_en: "Choose the right auxiliary ('ho' or 'sono') and participle ending:",
        items: [
          { prompt: "Ieri ___ lavorato fino a tardi.", answer: "ho", options: ["ho", "sono", "è"] },
          { prompt: "Stamattina ___ andato dal medico.", answer: "sono", options: ["ho", "sono", "ha"] },
          { prompt: "Maria è arriv___ tardi.", answer: "ata", options: ["ato", "ata", "are"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ với trợ động từ đúng:",
        instruction_en: "Match each verb with its correct auxiliary:",
        items: [
          { prompt: "comprare (mua)", answer: "avere → ho comprato" },
          { prompt: "andare (đi)", answer: "essere → sono andato/a" },
          { prompt: "pagare (trả tiền)", answer: "avere → ho pagato" },
          { prompt: "arrivare (đến)", answer: "essere → sono arrivato/a" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý (nhớ chọn 'avere'/'essere'):",
        instruction_en: "Translate into Italian (pick 'avere'/'essere'):",
        items: [
          { prompt: "Hôm qua tôi đã đi ngân hàng.", answer: "Ieri sono andato/a in banca." },
          { prompt: "Tôi đã mua bánh mì và trả bằng thẻ.", answer: "Ho comprato il pane e ho pagato con la carta." },
          { prompt: "Tôi không hiểu câu hỏi, xin lỗi.", answer: "Non ho capito la domanda, scusi." },
        ],
      },
    ],
  },
];

export default lessons;
