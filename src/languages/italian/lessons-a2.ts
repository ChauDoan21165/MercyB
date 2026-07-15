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
  cell_id?: string;
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
  cell_id?: string;
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
      { cell_id: "d2ae4331-fba7-4943-b1b1-3c8b2c92d7f5", word: "di solito", en: "usually", vi: "thường thì", pos: "adverb phrase", pronunciation_vi: "đi XÔ-li-tô", pronunciation_en: "dee SOH-lee-toh" },
      { cell_id: "34931a0d-5457-402f-9437-df7449020a4e", word: "alzarsi", en: "to get up", vi: "thức dậy", pos: "reflexive verb", pronunciation_vi: "al-TSAR-xi", pronunciation_en: "ahl-TSAR-see" },
      { cell_id: "1fa405df-9593-42a3-add0-10d1e4048220", word: "svegliarsi", en: "to wake up", vi: "tỉnh giấc", pos: "reflexive verb", pronunciation_vi: "xvê-LIAR-xi, gli = 'li'", pronunciation_en: "sveh-LYAR-see — 'gli' is a soft 'ly'" },
      { cell_id: "78af194b-2371-4acf-968d-28dccbe3de8c", word: "la mattina", en: "the morning", vi: "buổi sáng", pos: "n.f.", pronunciation_vi: "la mat-TI-na", pronunciation_en: "lah mat-TEE-nah" },
      { cell_id: "28d95fef-ba99-489f-8d8f-683006e0b199", word: "la sera", en: "the evening", vi: "buổi tối", pos: "n.f.", pronunciation_vi: "la XÊ-ra", pronunciation_en: "lah SEH-rah" },
      { cell_id: "523b0d92-936a-4b8f-b51c-cffa98debce0", word: "l'orario", en: "schedule / timetable", vi: "giờ giấc, lịch", pos: "n.m.", pronunciation_vi: "lô-RA-ri-ô", pronunciation_en: "loh-RAH-ree-oh" },
      { cell_id: "9996f073-c52b-4573-8a88-c3317ff4fcb3", word: "la settimana", en: "the week", vi: "tuần", pos: "n.f.", pronunciation_vi: "la xêt-ti-MA-na", pronunciation_en: "lah set-tee-MAH-nah" },
      { cell_id: "9ecc4492-664f-4a02-9c62-4f26463a5a73", word: "finire", en: "to finish", vi: "kết thúc, xong", pos: "verb", pronunciation_vi: "fi-NI-rê", pronunciation_en: "fee-NEE-reh" },
    ],
    dialogue: [
      { cell_id: "2d1832c6-a6ac-4e91-9624-58a0ca682eb0", speaker: "A", text: "A che ora ti alzi la mattina?", vi: "Buổi sáng bạn dậy lúc mấy giờ?", en: "What time do you get up in the morning?" },
      { cell_id: "f92bea2b-9e53-4fe9-bdad-593b571dbb12", speaker: "B", text: "Di solito alle sei e mezza. E tu?", vi: "Thường lúc sáu giờ rưỡi. Còn bạn?", en: "Usually at half past six. And you?" },
      { cell_id: "2d446a50-d6cd-46d7-8335-96cde2a62f11", speaker: "A", text: "Più tardi, alle sette. Lavoro dalle nove.", vi: "Muộn hơn, lúc bảy giờ. Tôi làm từ chín giờ.", en: "Later, at seven. I work from nine." },
      { cell_id: "354f67e4-4263-4cf7-a6b1-9cfdc9906fdd", speaker: "B", text: "Io finisco alle sedici e poi torno a casa.", vi: "Tôi xong lúc bốn giờ chiều rồi về nhà.", en: "I finish at 16:00 and then go home." },
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
      { cell_id: "4a355c00-c33b-4f8c-840c-45af027c3b52", word: "vorrei", en: "I'd like (polite)", vi: "tôi muốn (lịch sự)", pos: "verb (conditional)", pronunciation_vi: "vôr-RÊI", pronunciation_en: "vor-RAY" },
      { cell_id: "01fc9e2d-bac8-43a0-a4ac-142e13b24ea2", word: "il chilo", en: "kilo", vi: "ký, kg", pos: "n.m.", pronunciation_vi: "il KI-lô", pronunciation_en: "eel KEE-loh" },
      { cell_id: "d29fc322-6da1-45b4-a85d-4dc8a3a717ab", word: "un etto", en: "100 grams", vi: "một lạng (100g)", pos: "n.m.", pronunciation_vi: "un ÊT-tô", pronunciation_en: "oon ET-toh" },
      { cell_id: "e4e596a4-3b77-457a-8c38-b3624bcf3162", word: "lo scontrino", en: "receipt", vi: "hoá đơn (cửa hàng)", pos: "n.m.", pronunciation_vi: "lô xcôn-TRI-nô", pronunciation_en: "loh skon-TREE-noh" },
      { cell_id: "27d153b2-9420-417d-8e19-d780c7c711db", word: "la carta", en: "card", vi: "thẻ", pos: "n.f.", pronunciation_vi: "la CAR-ta", pronunciation_en: "lah KAR-tah" },
      { cell_id: "62bffd06-9318-4c00-a8d5-daab9570afb4", word: "i contanti", en: "cash", vi: "tiền mặt", pos: "n.m.pl.", pronunciation_vi: "i côn-TAN-ti", pronunciation_en: "ee kohn-TAHN-tee" },
      { cell_id: "2267e4a6-5fa2-4b78-9d8c-9782606e4222", word: "costare", en: "to cost", vi: "có giá", pos: "verb", pronunciation_vi: "côx-TA-rê", pronunciation_en: "koh-STAH-reh" },
      { cell_id: "30e94b2d-c72c-443d-87ee-5bf719a37804", word: "il resto", en: "the change (money)", vi: "tiền thối lại", pos: "n.m.", pronunciation_vi: "il RÊX-tô", pronunciation_en: "eel REH-stoh" },
    ],
    dialogue: [
      { cell_id: "fa203be6-cf70-4601-a692-4f7462bc2209", speaker: "Cliente", text: "Buongiorno, vorrei mezzo chilo di mele.", vi: "Chào, tôi muốn nửa ký táo.", en: "Hello, I'd like half a kilo of apples." },
      { cell_id: "10accf87-a9bf-4a07-93fe-e9359b84f2e8", speaker: "Venditore", text: "Certo. Altro?", vi: "Được. Còn gì nữa không?", en: "Sure. Anything else?" },
      { cell_id: "2d692fd6-7122-4acf-9b81-e540701c88bb", speaker: "Cliente", text: "Sì, un etto di prosciutto. Quanto costa in tutto?", vi: "Vâng, một lạng thịt nguội. Tổng cộng bao nhiêu?", en: "Yes, 100 g of ham. How much in total?" },
      { cell_id: "6e575fe8-a3e2-4190-ac81-10aeb9728c06", speaker: "Venditore", text: "Sei euro. Ecco lo scontrino.", vi: "Sáu euro. Đây hoá đơn.", en: "Six euros. Here's the receipt." },
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
      { cell_id: "823fda7e-bbe7-40bb-87a9-2ada248deee7", word: "il biglietto", en: "ticket", vi: "vé", pos: "n.m.", pronunciation_vi: "il bi-LIÊT-tô", pronunciation_en: "eel bee-LYET-toh" },
      { cell_id: "94a1d402-1608-4247-be14-998be1621a1f", word: "il binario", en: "platform / track", vi: "ray, sân ga", pos: "n.m.", pronunciation_vi: "il bi-NA-ri-ô", pronunciation_en: "eel bee-NAH-ryoh" },
      { cell_id: "2a9821a3-9552-4c26-b24c-7dc64b714611", word: "la fermata", en: "stop (bus/tram)", vi: "trạm", pos: "n.f.", pronunciation_vi: "la fêr-MA-ta", pronunciation_en: "lah fer-MAH-tah" },
      { cell_id: "dc400c60-10a9-47bb-b7c2-1d7971d4845d", word: "il ritardo", en: "delay", vi: "sự trễ", pos: "n.m.", pronunciation_vi: "il ri-TAR-đô", pronunciation_en: "eel ree-TAR-doh" },
      { cell_id: "ca8baad8-0db5-4f3c-90e8-04ad936c790f", word: "scendere", en: "to get off", vi: "xuống xe", pos: "verb", pronunciation_vi: "XÊN-đê-rê", pronunciation_en: "SHEN-deh-reh" },
      { cell_id: "87dcd733-a6d0-4465-8e8d-b5e476298952", word: "salire", en: "to get on", vi: "lên xe", pos: "verb", pronunciation_vi: "xa-LI-rê", pronunciation_en: "sah-LEE-reh" },
      { cell_id: "df82d0c3-53ee-4e96-9d45-b95564214b1f", word: "convalidare", en: "to validate (a ticket)", vi: "đóng dấu vé", pos: "verb", pronunciation_vi: "côn-va-li-ĐA-rê", pronunciation_en: "kohn-vah-lee-DAH-reh" },
      { cell_id: "93ecec83-6d4e-4392-a23f-50d3398e2b3b", word: "andata e ritorno", en: "return / round trip", vi: "khứ hồi", pos: "phrase", pronunciation_vi: "an-ĐA-ta ê ri-TÔR-nô", pronunciation_en: "ahn-DAH-tah eh ree-TOR-noh" },
    ],
    dialogue: [
      { cell_id: "e1319753-5bba-4e01-bc1e-3019f48f81c1", speaker: "Viaggiatore", text: "Scusi, a che ora parte il treno per Roma?", vi: "Xin lỗi, tàu đi Roma khởi hành lúc mấy giờ?", en: "Excuse me, what time does the train to Rome leave?" },
      { cell_id: "7c17c1b9-d259-4f30-8162-b33b8a080756", speaker: "Addetto", text: "Alle dieci e venti, dal binario tre.", vi: "Lúc mười giờ hai mươi, ở ray số ba.", en: "At 10:20, from platform three." },
      { cell_id: "b42e3455-87fb-42f7-895a-a438c6801622", speaker: "Viaggiatore", text: "È in orario?", vi: "Tàu có đúng giờ không?", en: "Is it on time?" },
      { cell_id: "0625c8a3-f7ec-48b5-926e-32e2b7f7cbc3", speaker: "Addetto", text: "No, è in ritardo di un quarto d'ora.", vi: "Không, trễ mười lăm phút.", en: "No, it's a quarter of an hour late." },
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
      { cell_id: "ba4c57a1-f163-4438-8d11-dbf927eed976", word: "l'appuntamento", en: "appointment", vi: "lịch hẹn", pos: "n.m.", pronunciation_vi: "lap-pun-ta-MÊN-tô", pronunciation_en: "lap-poon-tah-MEN-toh" },
      { cell_id: "5f83e367-5c00-40b5-8bee-43fb92837a99", word: "prendere", en: "to take / make (appt.)", vi: "đặt (lịch)", pos: "verb", pronunciation_vi: "PRÊN-đê-rê", pronunciation_en: "PREN-deh-reh" },
      { cell_id: "5c61eb44-f4db-4f13-880e-b95160dff20c", word: "spostare", en: "to move / reschedule", vi: "dời, đổi", pos: "verb", pronunciation_vi: "xpôx-TA-rê", pronunciation_en: "spoh-STAH-reh" },
      { cell_id: "986ed243-3017-4469-b085-75c6a26f7f45", word: "confermare", en: "to confirm", vi: "xác nhận", pos: "verb", pronunciation_vi: "côn-fêr-MA-rê", pronunciation_en: "kohn-fer-MAH-reh" },
      { cell_id: "de6811ce-bb4e-46a1-a77e-66f768f9fa9a", word: "disdire", en: "to cancel", vi: "huỷ", pos: "verb", pronunciation_vi: "đix-ĐI-rê", pronunciation_en: "dees-DEE-reh" },
      { cell_id: "15cb3527-eec9-4987-bd0e-19e3fe85d5f6", word: "purtroppo", en: "unfortunately", vi: "tiếc là", pos: "adverb", pronunciation_vi: "pur-TRÔP-pô", pronunciation_en: "poor-TROHP-poh" },
      { cell_id: "c59e408b-b3a9-43ff-8a7b-6c44eb6fac16", word: "giovedì", en: "Thursday", vi: "thứ Năm", pos: "n.m.", pronunciation_vi: "giô-vê-ĐI", pronunciation_en: "joh-veh-DEE" },
      { cell_id: "7810d1d3-8d78-4158-b61c-ed485254676d", word: "va bene", en: "OK / it works", vi: "được, ổn", pos: "phrase", pronunciation_vi: "va BÊ-nê", pronunciation_en: "vah BEH-neh" },
    ],
    dialogue: [
      { cell_id: "b5cf842c-f94b-499f-936c-a1f4df6358b5", speaker: "Cliente", text: "Buongiorno, vorrei prendere un appuntamento.", vi: "Chào, tôi muốn đặt lịch hẹn.", en: "Hello, I'd like to make an appointment." },
      { cell_id: "cb2162fb-3228-4193-9f42-40bc5676de7d", speaker: "Segretaria", text: "Certo. Le va bene giovedì alle quindici?", vi: "Được. Thứ Năm lúc ba giờ chiều có tiện không ạ?", en: "Sure. Does Thursday at 15:00 work for you?" },
      { cell_id: "26d1584b-023d-4bd4-bd7e-7ba167973f73", speaker: "Cliente", text: "Purtroppo giovedì lavoro. È possibile venerdì?", vi: "Tiếc là thứ Năm tôi làm việc. Thứ Sáu được không?", en: "Unfortunately I work Thursday. Is Friday possible?" },
      { cell_id: "278539fe-0a6e-4daa-b27b-e60e6f12e0e4", speaker: "Segretaria", text: "Sì. Le confermo venerdì alle quindici e trenta.", vi: "Vâng. Tôi xác nhận thứ Sáu lúc ba giờ rưỡi.", en: "Yes. I confirm Friday at 15:30." },
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
      { cell_id: "1cfdff5a-1a2e-4b2f-980d-ef29d93e7a46", word: "la farmacia", en: "pharmacy", vi: "hiệu thuốc", pos: "n.f.", pronunciation_vi: "la far-ma-CHI-a", pronunciation_en: "lah far-mah-CHEE-ah" },
      { cell_id: "6a157a5c-65b9-4338-8658-82fdeaa09304", word: "la febbre", en: "fever", vi: "sốt", pos: "n.f.", pronunciation_vi: "la FÊB-brê", pronunciation_en: "lah FEB-breh" },
      { cell_id: "aa7c4892-c56c-4918-9238-9d9931564bf9", word: "la tosse", en: "cough", vi: "ho", pos: "n.f.", pronunciation_vi: "la TÔX-xê", pronunciation_en: "lah TOHS-seh" },
      { cell_id: "64aaffbd-1737-4155-ab6d-fd6ec80c2428", word: "il mal di gola", en: "sore throat", vi: "đau họng", pos: "n.m.", pronunciation_vi: "il mal đi GÔ-la", pronunciation_en: "eel mahl dee GOH-lah" },
      { cell_id: "6155b9d1-f06c-44da-94b6-757a06b27585", word: "il dolore", en: "pain", vi: "cơn đau", pos: "n.m.", pronunciation_vi: "il đô-LÔ-rê", pronunciation_en: "eel doh-LOH-reh" },
      { cell_id: "a6e41e47-c153-41be-a72d-0abcecd4bdb7", word: "la ricetta", en: "prescription", vi: "đơn thuốc", pos: "n.f.", pronunciation_vi: "la ri-CHÊT-ta", pronunciation_en: "lah ree-CHET-tah" },
      { cell_id: "89677d1a-3b17-4984-9dc6-f076dc99b5d4", word: "il medico", en: "doctor", vi: "bác sĩ", pos: "n.m.", pronunciation_vi: "il MÊ-đi-cô", pronunciation_en: "eel MEH-dee-koh" },
      { cell_id: "0ef4474a-3b8a-42da-9574-10805c5d4f8c", word: "la medicina", en: "medicine", vi: "thuốc", pos: "n.f.", pronunciation_vi: "la mê-đi-CHI-na", pronunciation_en: "lah meh-dee-CHEE-nah" },
    ],
    dialogue: [
      { cell_id: "e5c29b3f-5ed8-4864-b185-109f50e44b89", speaker: "Cliente", text: "Buonasera, ho mal di gola e un po' di tosse.", vi: "Chào buổi tối, tôi đau họng và hơi ho.", en: "Good evening, I have a sore throat and a bit of a cough." },
      { cell_id: "9ec6283f-401b-4895-95ab-a0226b3ad049", speaker: "Farmacista", text: "Da quando?", vi: "Từ khi nào ạ?", en: "Since when?" },
      { cell_id: "c1f11c01-c2c4-49aa-9124-d6b182e0787e", speaker: "Cliente", text: "Da ieri. Mi serve qualcosa.", vi: "Từ hôm qua. Tôi cần thứ gì đó.", en: "Since yesterday. I need something." },
      { cell_id: "37b2deee-2f4d-4884-95a3-a7bfb25601f5", speaker: "Farmacista", text: "Prenda queste pastiglie, due volte al giorno.", vi: "Anh/chị dùng viên ngậm này, ngày hai lần.", en: "Take these lozenges, twice a day." },
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
      { cell_id: "fac1a75e-284b-45ac-8141-87e7bcc4f84e", word: "l'affitto", en: "rent", vi: "tiền thuê", pos: "n.m.", pronunciation_vi: "laf-FIT-tô", pronunciation_en: "lahf-FEET-toh" },
      { cell_id: "a5e445d9-15fd-4a5d-a9ce-9fe7af277253", word: "il contratto", en: "contract", vi: "hợp đồng", pos: "n.m.", pronunciation_vi: "il côn-TRAT-tô", pronunciation_en: "eel kohn-TRAHT-toh" },
      { cell_id: "6e0cbc7f-7a27-48dc-807e-d9a7d3525771", word: "il riscaldamento", en: "heating", vi: "hệ thống sưởi", pos: "n.m.", pronunciation_vi: "il rix-cal-đa-MÊN-tô", pronunciation_en: "eel rees-kahl-dah-MEN-toh" },
      { cell_id: "ef8a2680-113e-4e03-86b8-7b1c4957b4eb", word: "la perdita", en: "leak", vi: "chỗ rò", pos: "n.f.", pronunciation_vi: "la PÊR-đi-ta", pronunciation_en: "lah PER-dee-tah" },
      { cell_id: "223b159b-3cb5-477b-9714-bf2974b34413", word: "il problema", en: "problem (masc.)", vi: "vấn đề", pos: "n.m.", pronunciation_vi: "il prô-BLÊ-ma", pronunciation_en: "eel proh-BLEH-mah" },
      { cell_id: "7f5ae359-7c1d-43d8-8f8a-ef3f9e1fe26f", word: "riparare", en: "to repair", vi: "sửa", pos: "verb", pronunciation_vi: "ri-pa-RA-rê", pronunciation_en: "ree-pah-RAH-reh" },
      { cell_id: "68a3e3b4-0512-4550-8078-717ddac8fee7", word: "funzionare", en: "to work / function", vi: "hoạt động", pos: "verb", pronunciation_vi: "fun-tsi-ô-NA-rê", pronunciation_en: "foon-tsyoh-NAH-reh" },
      { cell_id: "9b0d7361-c324-45f2-87ed-106e36cb0d3d", word: "il padrone di casa", en: "landlord", vi: "chủ nhà", pos: "n.m.", pronunciation_vi: "il pa-ĐRÔ-nê đi CA-za", pronunciation_en: "eel pah-DROH-neh dee KAH-zah" },
    ],
    dialogue: [
      { cell_id: "825adb59-9cf6-40c8-9ec6-ba0ab9748534", speaker: "Inquilino", text: "Buongiorno, il riscaldamento non funziona da ieri.", vi: "Chào, hệ thống sưởi không hoạt động từ hôm qua.", en: "Hello, the heating hasn't worked since yesterday." },
      { cell_id: "6181f6ba-dc24-4d06-ab8d-0f384188ed7b", speaker: "Padrone", text: "Mi dispiace. C'è anche altro?", vi: "Tôi xin lỗi. Còn vấn đề gì khác không?", en: "I'm sorry. Anything else?" },
      { cell_id: "750f269f-0e79-4085-bf40-b95bb1249f9d", speaker: "Inquilino", text: "Sì, c'è una perdita d'acqua in cucina. Le mando una foto.", vi: "Có, có rò nước trong bếp. Tôi gửi ảnh cho ông.", en: "Yes, a water leak in the kitchen. I'll send you a photo." },
      { cell_id: "c7ab0530-d7f8-4041-a540-8c14bb246105", speaker: "Padrone", text: "Va bene. Mando un tecnico domani mattina.", vi: "Được. Mai sáng tôi cho thợ tới.", en: "OK. I'll send a technician tomorrow morning." },
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
      { cell_id: "62a41e6a-782f-4a61-af1f-08b29d5f2ffd", word: "il turno", en: "shift", vi: "ca làm", pos: "n.m.", pronunciation_vi: "il TUR-nô", pronunciation_en: "eel TOOR-noh" },
      { cell_id: "461249ee-cf53-43f6-aeb2-6fb1407d8bea", word: "il collega / la collega", en: "colleague (m/f)", vi: "đồng nghiệp", pos: "n.m./n.f.", pronunciation_vi: "il/la côl-LÊ-ga", pronunciation_en: "eel/lah kohl-LEH-gah" },
      { cell_id: "9e72a934-49a7-49fa-adbe-5f885591191b", word: "il capo", en: "boss", vi: "sếp", pos: "n.m.", pronunciation_vi: "il CA-pô", pronunciation_en: "eel KAH-poh" },
      { cell_id: "0ce8d31b-6e44-4a72-925d-af71ac05a744", word: "il responsabile", en: "supervisor", vi: "người phụ trách", pos: "n.m.", pronunciation_vi: "il rêx-pôn-XA-bi-lê", pronunciation_en: "eel res-pohn-SAH-bee-leh" },
      { cell_id: "355943b9-76b7-4cb5-829e-93348f011702", word: "la procedura", en: "procedure", vi: "quy trình", pos: "n.f.", pronunciation_vi: "la prô-chê-ĐU-ra", pronunciation_en: "lah proh-cheh-DOO-rah" },
      { cell_id: "d2ef25f8-5df8-4e8a-b875-1da9aea8e424", word: "cambiare", en: "to change / swap", vi: "đổi", pos: "verb", pronunciation_vi: "cam-BIA-rê", pronunciation_en: "kahm-BYAH-reh" },
      { cell_id: "67e2866a-41d8-4124-986e-e9c933fe00d4", word: "spiegare", en: "to explain", vi: "giải thích", pos: "verb", pronunciation_vi: "xpiê-GA-rê", pronunciation_en: "spyeh-GAH-reh" },
      { cell_id: "efc130ec-c7e1-4cef-ad51-b5d4b5c18dd0", word: "entro", en: "by / within (time)", vi: "trước, trong vòng", pos: "preposition", pronunciation_vi: "ÊN-trô", pronunciation_en: "EN-troh" },
    ],
    dialogue: [
      { cell_id: "04b6a5ac-4b7a-4f68-bb40-563ef564e039", speaker: "Operaio", text: "Scusi, posso cambiare turno con un collega venerdì?", vi: "Xin lỗi, thứ Sáu tôi đổi ca với đồng nghiệp được không?", en: "Excuse me, can I swap shifts with a colleague on Friday?" },
      { cell_id: "7c09f4e2-c419-4807-bfcc-1f2585843b60", speaker: "Responsabile", text: "Perché?", vi: "Vì sao?", en: "Why?" },
      { cell_id: "e447ee72-8f82-43d7-8b7c-6818539bd44c", speaker: "Operaio", text: "Devo andare dal medico. Mi dispiace per il problema.", vi: "Tôi phải đi khám bác sĩ. Xin lỗi vì phiền.", en: "I have to go to the doctor. Sorry for the trouble." },
      { cell_id: "b3b94c86-189d-4933-a462-a0a1b0b732ea", speaker: "Responsabile", text: "Va bene, ma me lo scriva in un messaggio.", vi: "Được, nhưng hãy nhắn tin cho tôi.", en: "OK, but put it to me in a message." },
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
      { cell_id: "8d99b614-be4f-4a2a-a83a-c346de6ec1b7", word: "ieri", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "I-ê-ri", pronunciation_en: "ee-EH-ree" },
      { cell_id: "41892352-d5d5-431d-86aa-af747e571d26", word: "stamattina", en: "this morning", vi: "sáng nay", pos: "adverb", pronunciation_vi: "xta-mat-TI-na", pronunciation_en: "stah-mat-TEE-nah" },
      { cell_id: "b1cddc17-552f-4896-9635-8891b019e7f7", word: "avere", en: "to have (auxiliary)", vi: "có (trợ động từ)", pos: "verb", pronunciation_vi: "a-VÊ-rê", pronunciation_en: "ah-VEH-reh" },
      { cell_id: "96dbaae1-eab2-42cf-bb1e-ea957e056249", word: "essere", en: "to be (auxiliary)", vi: "là/thì (trợ động từ)", pos: "verb", pronunciation_vi: "ÊX-xê-rê", pronunciation_en: "ES-seh-reh" },
      { cell_id: "65f7231a-2e63-4fa5-88a3-5f95688625e5", word: "andare", en: "to go (uses essere)", vi: "đi (dùng essere)", pos: "verb", pronunciation_vi: "an-ĐA-rê", pronunciation_en: "ahn-DAH-reh" },
      { cell_id: "8d3ae879-689f-4a31-8c19-2894bfb0a67a", word: "arrivare", en: "to arrive (uses essere)", vi: "đến (dùng essere)", pos: "verb", pronunciation_vi: "ar-ri-VA-rê", pronunciation_en: "ar-ree-VAH-reh" },
      { cell_id: "ada1d7ff-cf83-4f75-9e15-bcb58070ae21", word: "comprare", en: "to buy (uses avere)", vi: "mua (dùng avere)", pos: "verb", pronunciation_vi: "côm-PRA-rê", pronunciation_en: "kohm-PRAH-reh" },
      { cell_id: "f8e1416b-e79f-4a14-b94a-69c599249935", word: "capire", en: "to understand", vi: "hiểu", pos: "verb", pronunciation_vi: "ca-PI-rê", pronunciation_en: "kah-PEE-reh" },
    ],
    dialogue: [
      { cell_id: "6f91ce6c-dba5-491d-985d-9494d0b71b3e", speaker: "A", text: "Che cosa hai fatto ieri?", vi: "Hôm qua bạn đã làm gì?", en: "What did you do yesterday?" },
      { cell_id: "62c722e9-2b75-4c23-af17-b3344ae818f0", speaker: "B", text: "Ho lavorato la mattina e sono andato in banca.", vi: "Tôi làm buổi sáng rồi đi ngân hàng.", en: "I worked in the morning and went to the bank." },
      { cell_id: "b6e0b80d-0ec6-434a-9a87-da9d2c2900e8", speaker: "A", text: "E la sera?", vi: "Còn buổi tối?", en: "And in the evening?" },
      { cell_id: "db0e677c-2dd7-4d1b-ace0-b4b2db84379e", speaker: "B", text: "Sono tornato a casa tardi e ho cucinato.", vi: "Tôi về nhà muộn rồi nấu ăn.", en: "I got home late and cooked." },
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
