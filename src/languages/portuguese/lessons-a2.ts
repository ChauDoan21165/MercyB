// src/languages/portuguese/lessons-a2.ts
//
// Brazilian Portuguese (português brasileiro) A2 lessons for Vietnamese learners.
//
// Shape mirrors the Italian A2 pack (src/languages/italian/lessons-a2.ts) so the
// shared lesson page UI stays consistent across language verticals — the types
// are declared INLINE here because the Portuguese vertical does not yet ship a
// `./lessons` registry file. This module is intentionally self-contained: it
// exports its own types plus the A2 data array. When a shared `./lessons` is
// added, swap these to a type-only import.
//
// Variety: BRAZILIAN Portuguese throughout (você, not tu; R$/reais; ônibus,
// metrô, trem, celular, geladeira, banheiro, aluguel, café da manhã). European
// forms (telemóvel, pequeno-almoço, comboio, renda, autocarro) are intentionally
// NOT used.
//
// Vietnamese-first: every lesson carries L1 notes — the specific mistakes a
// Vietnamese speaker makes — under `l1_notes_vi`. Hand-crafted; no AI filler.
//
// A2 target: describe daily routines, shop for groceries and clothes, use public
// transport, make and change appointments, and look for / rent housing — plus
// the short practical exchanges each of those needs.
//
// Pronunciation conventions for Vietnamese readers (Brazilian variety):
//   - final unstressed -o → "u";  final unstressed -e → "i"
//   - -te / -de before an "i"-sound → "tchi" / "dji" (palatalization, very BR)
//   - initial r- and rr → guttural "h" (≈ tiếng Anh 'h'), NOT a Vietnamese 'r'
//   - s between vowels → "z";  ç / final s → "s"
//   - ch and x → "s" (sh / "s" như 'sh');  lh → "li/ly";  nh → "nh"
//   - ão → "ãung" (nasal);  ã / -am / -em endings are nasal — never clip them
//   - stressed syllable is written in CAPS in the respellings below

// ── Types (inline — Portuguese vertical has no shared ./lessons yet) ─────────

export type PortugueseCategoryId =
  | "daily_routine"
  | "shopping"
  | "transport"
  | "appointments"
  | "housing";

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PortugueseLessonSentence = {
  /** The Portuguese target sentence (the line the learner speaks). */
  pt: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Literal English gloss, for the secondary EN audience. */
  en?: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type PortugueseVocabEntry = {
  /** Portuguese word, with article where gender matters (e.g. "a conta"). */
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Pronunciation respelled for a Vietnamese reader; stressed syllable CAPS. */
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type PortugueseDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type PortugueseL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
};

// Loosely typed so per-type exercise fields can vary (fill_blank / matching /
// translation), matching the Italian pack's Exercise contract.
export type PortugueseExercise = Record<string, unknown>;

export type PortugueseLesson = {
  id: string;
  category: PortugueseCategoryId;
  level: PortugueseCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: PortugueseLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: PortugueseL1Note[];
  vocabulary?: PortugueseVocabEntry[];
  dialogue?: PortugueseDialogueLine[];
  exercises?: PortugueseExercise[];
};

// ── A2 lessons ───────────────────────────────────────────────────────────────

export const lessons: PortugueseLesson[] = [
  // ── 1. Daily routine & schedule ────────────────────────────────────────────
  {
    id: "portuguese_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Rotina hằng ngày",
    title_en: "Daily routine and schedule",
    sentences: [
      {
        pt: "Eu acordo às seis e meia da manhã.",
        vi: "Tôi thức dậy lúc sáu giờ rưỡi sáng.",
        en: "I wake up at half past six in the morning.",
        pronunciation_focus: [
          "acordo → 'a-CÔR-đu', -o cuối = 'u'",
          "seis → 'XÊIS'",
          "manhã → 'man-NHÃ', đuôi mũi, có 'nh'",
        ],
        pronunciation_focus_en: [
          "acordo → 'ah-KOR-doo' — final unstressed -o sounds like 'oo'",
          "seis → 'saysh' — the final s is a soft 'sh' in Rio-style BR",
          "manhã → 'mun-NYAH' — nasal ending, 'nh' = 'ny' in 'canyon'",
        ],
      },
      {
        pt: "Tomo café da manhã antes de sair.",
        vi: "Tôi ăn sáng trước khi ra ngoài.",
        en: "I have breakfast before leaving.",
        pronunciation_focus: [
          "café → 'ca-FÉ', nhấn cuối",
          "antes → 'ÃN-tchis', te = 'tchi'",
          "sair → 'sa-IR', hai âm rõ",
        ],
        pronunciation_focus_en: [
          "café da manhã = breakfast (NOT 'pequeno-almoço', that's Portugal)",
          "antes → 'AHN-tchees' — the 'te' palatalizes to 'tchi'",
          "sair → 'sah-EER' — two clear syllables, stress the second",
        ],
      },
      {
        pt: "Vou para o trabalho de ônibus.",
        vi: "Tôi đi làm bằng xe buýt.",
        en: "I go to work by bus.",
        pronunciation_focus: [
          "trabalho → 'tra-BA-liu', lh = 'li'",
          "de ônibus → 'đji Ô-ni-bus'",
          "'de' + phương tiện = bằng (xe gì)",
        ],
        pronunciation_focus_en: [
          "trabalho → 'trah-BAH-lyoo' — 'lh' is 'ly' as in 'million'",
          "ônibus → 'OH-nee-boos' (BR), stress the first syllable",
          "'de ônibus / de carro / de trem' = by bus / car / train",
        ],
      },
      {
        pt: "Almoço ao meio-dia no restaurante.",
        vi: "Tôi ăn trưa lúc 12 giờ ở nhà hàng.",
        en: "I have lunch at noon at the restaurant.",
        pronunciation_focus: [
          "almoço → 'au-MÔ-su', ç = 's'",
          "meio-dia → 'MÊI-u-DJI-a', di = 'dji'",
          "restaurante → 'hes-tau-RÃN-tchi', r đầu = 'h'",
        ],
        pronunciation_focus_en: [
          "almoço → 'ow-MOH-soo' — 'ç' is a plain 's'",
          "meio-dia → 'MAY-oo-JEE-ah' — 'di' palatalizes to 'jee'",
          "restaurante → 'hes-tow-RAHN-tchee' — initial r is a throaty 'h'",
        ],
      },
      {
        pt: "À noite, eu assisto televisão e durmo cedo.",
        vi: "Buổi tối, tôi xem ti vi rồi đi ngủ sớm.",
        en: "At night I watch TV and sleep early.",
        pronunciation_focus: [
          "noite → 'NÔI-tchi', te = 'tchi'",
          "televisão → 'tê-lê-vi-ZÃUNG', đuôi mũi",
          "cedo → 'XÊ-đu'",
        ],
        pronunciation_focus_en: [
          "noite → 'NOY-tchee' — final 'te' → 'tchee'",
          "televisão → 'teh-leh-vee-ZOWNG' — 'ão' is a nasal 'owng'",
          "cedo → 'SEH-doo' = early; 'durmo' = I sleep (irregular dormir)",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Brazil chào nhau theo buổi: 'Bom dia' (sáng), 'Boa tarde' (chiều), 'Boa noite' (tối). Bữa sáng gọi là 'café da manhã' (nghĩa đen: cà phê buổi sáng) và thường nhẹ. Bữa trưa 'almoço' là bữa chính trong ngày. Giờ giấc ở Brazil khá linh hoạt — hẹn xã giao trễ 10-15 phút là bình thường, nhưng đi làm và lịch hẹn chính thức thì đúng giờ.",
    cultural_notes_en:
      "Brazilians greet by time of day: 'Bom dia' (morning), 'Boa tarde' (afternoon), 'Boa noite' (evening/night). Breakfast — 'café da manhã' (literally 'morning coffee') — is light; lunch ('almoço') is the main meal. Social time is flexible (10-15 min late is normal), but work and formal appointments expect punctuality.",
    tip_advice_vi:
      "Trong tiếng Bồ, động từ ngôi 'eu' (tôi) thường kết thúc bằng '-o': acordo, tomo, almoço. Đừng thêm đại từ thừa — 'acordo' đã có nghĩa 'tôi thức dậy', nhưng giữ 'eu' lúc mới học thì vẫn đúng. Luyện đuôi '-te/-de' thành 'tchi/dji' (noite → NÔI-tchi) — đây là đặc trưng giọng Brazil.",
    tip_advice_en:
      "The 'eu' (I) form of regular verbs ends in '-o': acordo, tomo, almoço. The pronoun 'eu' is optional because the ending already shows the person, but keeping it is fine while you learn. Drill the BR palatalization: '-te/-de' before an 'i'-sound becomes 'tchi/dji' (noite → 'NOY-tchee').",
    l1_notes_vi: [
      {
        mistake: "Đọc đuôi '-o' rõ thành 'ô' (acordo → 'a-cor-Ô').",
        fix_vi: "Đuôi '-o' không nhấn đọc thành 'u': 'a-CÔR-du'. Tiếng Việt phát âm đủ nguyên âm nên dễ đọc quá rõ.",
      },
      {
        mistake: "Bỏ tính chất mũi của 'manhã', 'televisão' (đọc thành 'manha', 'televisao').",
        fix_vi: "Các đuôi 'ã / ão' phải mũi (giống vần 'oang' trong tiếng Việt nhưng không đóng miệng). Đây là âm quan trọng, sai sẽ thành từ khác.",
      },
      {
        mistake: "Đọc 'r' đầu từ 'restaurante' như 'r' tiếng Việt.",
        fix_vi: "Ở Brazil, 'r' đầu từ và 'rr' đọc như 'h' tiếng Anh (hơi từ cổ họng): 'hes-tau-RÃN-tchi'.",
      },
    ],
    vocabulary: [
      { word: "acordar", en: "to wake up", vi: "thức dậy", pos: "verb", pronunciation_vi: "a-côr-ĐAR", pronunciation_en: "ah-kor-DAR" },
      { word: "o café da manhã", en: "breakfast", vi: "bữa sáng", pos: "n.m.", pronunciation_vi: "u ca-FÉ đa man-NHÃ", pronunciation_en: "oo kah-FEH dah mun-NYAH" },
      { word: "o trabalho", en: "work / job", vi: "công việc", pos: "n.m.", pronunciation_vi: "u tra-BA-liu", pronunciation_en: "oo trah-BAH-lyoo" },
      { word: "o almoço", en: "lunch", vi: "bữa trưa", pos: "n.m.", pronunciation_vi: "u au-MÔ-su", pronunciation_en: "oo ow-MOH-soo" },
      { word: "à noite", en: "at night / in the evening", vi: "buổi tối", pos: "adv. phrase", pronunciation_vi: "a NÔI-tchi", pronunciation_en: "ah NOY-tchee" },
      { word: "cedo", en: "early", vi: "sớm", pos: "adv.", pronunciation_vi: "XÊ-đu", pronunciation_en: "SEH-doo" },
      { word: "tarde", en: "late / afternoon", vi: "muộn / buổi chiều", pos: "adv. / n.f.", pronunciation_vi: "TAR-đji", pronunciation_en: "TAR-jee" },
      { word: "todos os dias", en: "every day", vi: "mỗi ngày", pos: "phrase", pronunciation_vi: "TÔ-đus us ĐJI-as", pronunciation_en: "TOH-doos oos JEE-ahs" },
    ],
    dialogue: [
      { speaker: "A", text: "A que horas você acorda?", vi: "Bạn thức dậy lúc mấy giờ?", en: "What time do you wake up?" },
      { speaker: "B", text: "Acordo às seis e meia. E você?", vi: "Tôi dậy lúc sáu giờ rưỡi. Còn bạn?", en: "I wake up at half past six. And you?" },
      { speaker: "A", text: "Mais tarde, às sete. Vou para o trabalho de metrô.", vi: "Muộn hơn, lúc bảy giờ. Tôi đi làm bằng tàu điện ngầm.", en: "Later, at seven. I take the metro to work." },
      { speaker: "B", text: "Eu vou de ônibus. À noite, durmo cedo.", vi: "Tôi đi xe buýt. Buổi tối tôi ngủ sớm.", en: "I go by bus. At night I sleep early." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng động từ ngôi 'eu' hoặc giới từ đúng:",
        instruction_en: "Fill in the 'eu' verb form or the right preposition:",
        items: [
          { prompt: "Eu ___ às seis e meia. (acordar)", answer: "acordo", options: ["acordo", "acorda", "acordar"] },
          { prompt: "Vou para o trabalho ___ ônibus.", answer: "de", options: ["de", "em", "por"] },
          { prompt: "Almoço ___ meio-dia.", answer: "ao", options: ["ao", "na", "de"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Bồ Đào Nha (Brazil):",
        instruction_en: "Translate into Brazilian Portuguese:",
        items: [
          { prompt: "Tôi thức dậy lúc sáu giờ rưỡi.", answer: "Eu acordo às seis e meia." },
          { prompt: "Tôi ăn sáng trước khi ra ngoài.", answer: "Tomo café da manhã antes de sair." },
          { prompt: "Buổi tối tôi đi ngủ sớm.", answer: "À noite eu durmo cedo." },
        ],
      },
    ],
  },

  // ── 2. Shopping at the market (groceries & quantities) ──────────────────────
  {
    id: "portuguese_shopping_market",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm ở chợ / siêu thị",
    title_en: "Shopping at the market",
    sentences: [
      {
        pt: "Quanto custa um quilo de tomate?",
        vi: "Một ký cà chua bao nhiêu tiền?",
        en: "How much is a kilo of tomatoes?",
        pronunciation_focus: [
          "quanto → 'CUÃN-tu', qu = 'cu'",
          "custa → 'CUS-ta'",
          "quilo → 'KI-lu', qui = 'ki'",
        ],
        pronunciation_focus_en: [
          "quanto → 'KWAHN-too' — 'qu' before a/o is 'kw'",
          "'quanto custa?' = the all-purpose 'how much is it?'",
          "quilo → 'KEE-loo' — 'qui/que' is a hard 'k'",
        ],
      },
      {
        pt: "Eu queria meio quilo de maçã, por favor.",
        vi: "Tôi muốn nửa ký táo, làm ơn.",
        en: "I'd like half a kilo of apples, please.",
        pronunciation_focus: [
          "queria → 'kê-RI-a', lịch sự = 'tôi muốn'",
          "maçã → 'ma-XÃ', ç = 's', đuôi mũi",
          "por favor → 'puh fa-VÔR'",
        ],
        pronunciation_focus_en: [
          "queria → 'keh-REE-ah' — the polite 'I'd like' (softer than 'quero')",
          "maçã → 'mah-SAH' — 'ç' = 's', and the 'ã' is nasal",
          "por favor → 'poor fah-VOR' = please",
        ],
      },
      {
        pt: "Onde fica o caixa para pagar?",
        vi: "Quầy thu ngân ở đâu để trả tiền?",
        en: "Where is the checkout to pay?",
        pronunciation_focus: [
          "onde → 'ÔN-đji', de = 'dji'",
          "fica → 'FI-ca', 'ficar' = nằm ở (vị trí)",
          "caixa → 'CAI-sa', x = 's'",
        ],
        pronunciation_focus_en: [
          "onde → 'OWN-jee' — 'de' palatalizes to 'jee'",
          "'onde fica…?' = 'where is…?' (for fixed locations)",
          "caixa → 'KIGH-shah' — 'x' here is 'sh'; means checkout/cashier",
        ],
      },
      {
        pt: "Posso pagar com cartão ou só dinheiro?",
        vi: "Tôi trả thẻ được không hay chỉ tiền mặt?",
        en: "Can I pay by card or only cash?",
        pronunciation_focus: [
          "posso → 'PÔ-su', ss = 's'",
          "cartão → 'car-TÃUNG', đuôi mũi",
          "dinheiro → 'đji-NHÊI-ru', nh = 'nh'",
        ],
        pronunciation_focus_en: [
          "posso → 'POH-soo' — 'ss' is a plain 's'; 'posso?' = 'may I?'",
          "cartão → 'kar-TOWNG' — 'ão' is nasal 'owng'",
          "dinheiro → 'jee-NYAY-roo' — 'nh' = 'ny'; means cash/money",
        ],
      },
      {
        pt: "Está muito caro. Tem mais barato?",
        vi: "Đắt quá. Có loại rẻ hơn không?",
        en: "It's too expensive. Is there a cheaper one?",
        pronunciation_focus: [
          "está → 'es-TÁ', thường nói gọn 'tá'",
          "caro → 'CA-ru'",
          "barato → 'ba-RA-tu'",
        ],
        pronunciation_focus_en: [
          "está → 'es-TAH' — Brazilians often shorten it to 'tá'",
          "caro → 'KAH-roo' = expensive; barato → 'bah-RAH-too' = cheap",
          "'tem mais barato?' = 'is there a cheaper one?'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Brazil người ta mua rau quả ở 'feira' (chợ phiên ngoài trời, thường họp một buổi/tuần theo khu phố) hoặc 'supermercado'. Giá ở chợ phiên thường tính theo quilo (ký). Tiền tệ là real (số nhiều: reais), ký hiệu R$. Thẻ rất phổ biến, kể cả chợ nhỏ, nhưng quán nhỏ và xe đẩy có thể chỉ nhận tiền mặt hoặc Pix (chuyển khoản tức thì rất phổ biến).",
    cultural_notes_en:
      "Brazilians buy produce at a 'feira' (a weekly open-air street market, by neighborhood) or a 'supermercado'. Feira prices are usually per quilo (kilo). The currency is the real (plural: reais), written R$. Cards are widely accepted, but tiny stalls may take only cash or Pix (Brazil's hugely popular instant bank transfer).",
    tip_advice_vi:
      "Dùng 'eu queria' (tôi muốn — thì điều kiện) thay vì 'eu quero' (tôi muốn — thẳng) để nghe lịch sự hơn khi mua hàng. Học hai mẫu câu vàng: 'Quanto custa…?' (giá bao nhiêu) và 'Tem…?' (có … không). Nhớ ç đọc là 's', không phải 'k'.",
    tip_advice_en:
      "Use 'eu queria' (conditional 'I'd like') instead of the blunt 'eu quero' ('I want') when shopping — it sounds politer. Master two golden frames: 'Quanto custa…?' (how much is…?) and 'Tem…?' (do you have…?). Remember 'ç' is always 's', never 'k'.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'eu quero' với giọng cộc lốc khi mua hàng.",
        fix_vi: "'Quero' không sai về ngữ pháp nhưng nghe hơi thẳng. 'Eu queria…' lịch sự hơn, giống 'cho tôi xin…' trong tiếng Việt.",
      },
      {
        mistake: "Quên mạo từ: nói 'Onde fica caixa?' thay vì 'Onde fica O caixa?'.",
        fix_vi: "Danh từ tiếng Bồ gần như luôn cần mạo từ (o/a). Tiếng Việt không có mạo từ nên rất dễ bỏ sót.",
      },
      {
        mistake: "Đọc 'ç' trong 'maçã', 'almoço' thành âm 'k'.",
        fix_vi: "Chữ 'ç' (c có móc) luôn đọc là 's': 'ma-XÃ', 'au-MÔ-su'. Không bao giờ đọc 'k'.",
      },
    ],
    vocabulary: [
      { word: "o quilo", en: "kilo", vi: "ký, kg", pos: "n.m.", pronunciation_vi: "u KI-lu", pronunciation_en: "oo KEE-loo" },
      { word: "caro", en: "expensive", vi: "đắt", pos: "adj.", pronunciation_vi: "CA-ru", pronunciation_en: "KAH-roo" },
      { word: "barato", en: "cheap", vi: "rẻ", pos: "adj.", pronunciation_vi: "ba-RA-tu", pronunciation_en: "bah-RAH-too" },
      { word: "o caixa", en: "checkout / cashier", vi: "quầy thu ngân", pos: "n.m.", pronunciation_vi: "u CAI-sa", pronunciation_en: "oo KIGH-shah" },
      { word: "o cartão", en: "card (payment)", vi: "thẻ", pos: "n.m.", pronunciation_vi: "u car-TÃUNG", pronunciation_en: "oo kar-TOWNG" },
      { word: "o dinheiro", en: "cash / money", vi: "tiền mặt", pos: "n.m.", pronunciation_vi: "u đji-NHÊI-ru", pronunciation_en: "oo jee-NYAY-roo" },
      { word: "a feira", en: "street market", vi: "chợ phiên", pos: "n.f.", pronunciation_vi: "a FÊI-ra", pronunciation_en: "ah FAY-rah" },
      { word: "o troco", en: "change (money back)", vi: "tiền thối", pos: "n.m.", pronunciation_vi: "u TRÔ-cu", pronunciation_en: "oo TROH-koo" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Bom dia! Quanto custa o quilo de banana?", vi: "Chào buổi sáng! Một ký chuối bao nhiêu?", en: "Good morning! How much is a kilo of bananas?" },
      { speaker: "Vendedor", text: "Cinco reais o quilo. Quanto a senhora quer?", vi: "Năm real một ký. Chị muốn mua bao nhiêu?", en: "Five reais a kilo. How much would you like?" },
      { speaker: "Cliente", text: "Meio quilo, por favor. Posso pagar no cartão?", vi: "Nửa ký, làm ơn. Tôi trả thẻ được không?", en: "Half a kilo, please. Can I pay by card?" },
      { speaker: "Vendedor", text: "Pode sim, ou no Pix. São dois e cinquenta.", vi: "Được ạ, hoặc Pix. Hết hai real rưỡi.", en: "Yes, or by Pix. That's two-fifty." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền mạo từ hoặc từ vựng đúng:",
        instruction_en: "Fill in the right article or word:",
        items: [
          { prompt: "Quanto custa ___ quilo de maçã?", answer: "o", options: ["o", "a", "um"] },
          { prompt: "Eu ___ meio quilo de tomate. (lịch sự)", answer: "queria", options: ["queria", "quero", "querer"] },
          { prompt: "Está muito caro. Tem mais ___?", answer: "barato", options: ["barato", "caro", "grande"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Bồ với nghĩa:",
        instruction_en: "Match the Portuguese word with its meaning:",
        pairs: [
          ["o caixa", "quầy thu ngân (checkout)"],
          ["o dinheiro", "tiền mặt (cash)"],
          ["barato", "rẻ (cheap)"],
          ["o troco", "tiền thối (change)"],
        ],
      },
    ],
  },

  // ── 3. Public transport ─────────────────────────────────────────────────────
  {
    id: "portuguese_transport_public",
    level: "A2",
    category: "transport",
    title_vi: "Phương tiện công cộng",
    title_en: "Public transport",
    sentences: [
      {
        pt: "Onde fica o ponto de ônibus mais perto?",
        vi: "Trạm xe buýt gần nhất ở đâu?",
        en: "Where is the nearest bus stop?",
        pronunciation_focus: [
          "ponto → 'PÔN-tu', đuôi mũi nhẹ",
          "ônibus → 'Ô-ni-bus'",
          "perto → 'PER-tu'",
        ],
        pronunciation_focus_en: [
          "ponto → 'POWN-too' — light nasal 'on'",
          "'ponto de ônibus' = bus stop",
          "perto → 'PEHR-too' = near; 'mais perto' = nearest",
        ],
      },
      {
        pt: "Este ônibus vai para o centro?",
        vi: "Xe buýt này có đi trung tâm không?",
        en: "Does this bus go to the centre?",
        pronunciation_focus: [
          "este → 'ÉS-tchi', te = 'tchi'",
          "vai → 'VAI'",
          "centro → 'XÊN-tru', c trước e = 's'",
        ],
        pronunciation_focus_en: [
          "este → 'ESH-tchee' — 'te' → 'tchee'; means 'this'",
          "vai → 'vye' (rhymes with 'eye') = goes",
          "centro → 'SEN-troo' — 'c' before e/i is 's'",
        ],
      },
      {
        pt: "Quanto custa a passagem de metrô?",
        vi: "Vé tàu điện ngầm bao nhiêu tiền?",
        en: "How much is a metro ticket?",
        pronunciation_focus: [
          "passagem → 'pa-SA-giêng', g trước e = 'gi'",
          "de metrô → 'đji mê-TRÔ', nhấn cuối",
          "'passagem' = vé (xe/tàu)",
        ],
        pronunciation_focus_en: [
          "passagem → 'pah-SAH-zheng' — 'g' before e/i is 'zh' (measure)",
          "metrô → 'meh-TROH' — stress the final 'ô' (BR)",
          "passagem = a transport ticket/fare",
        ],
      },
      {
        pt: "Preciso descer na próxima parada.",
        vi: "Tôi cần xuống ở trạm tiếp theo.",
        en: "I need to get off at the next stop.",
        pronunciation_focus: [
          "preciso → 'pre-XI-zu', s giữa = 'z'",
          "descer → 'đes-SER'",
          "próxima → 'PRÓ-si-ma', x = 's'",
        ],
        pronunciation_focus_en: [
          "preciso → 'preh-SEE-zoo' — 's' between vowels is 'z'",
          "descer → 'deh-SEHR' = to get off / go down",
          "próxima → 'PROH-see-mah' = next; 'parada' = stop",
        ],
      },
      {
        pt: "Por favor, o senhor pode me avisar?",
        vi: "Làm ơn, ông có thể báo cho tôi được không?",
        en: "Please, could you let me know (when)?",
        pronunciation_focus: [
          "o senhor → 'u sê-NHÔR', nh = 'nh'",
          "pode → 'PÔ-đji', de = 'dji'",
          "avisar → 'a-vi-ZAR', s giữa = 'z'",
        ],
        pronunciation_focus_en: [
          "o senhor → 'oo seh-NYOR' — polite 'you' (sir); 'a senhora' for a woman",
          "pode → 'POH-jee' — 'de' → 'jee'; 'pode…?' = 'can/could you…?'",
          "avisar → 'ah-vee-ZAR' = to warn/let know; 's' is 'z' here",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở các thành phố lớn (São Paulo, Rio) có metrô (tàu điện ngầm) và rất nhiều ônibus. Người ta dùng thẻ trả trước (ở SP gọi là 'Bilhete Único') quẹt khi lên xe. Trên xe buýt thường có người soát vé ('cobrador') ngồi gần cửa giữa. 'Trem' (tàu) chạy tuyến ngoại ô. Để gọi 'bạn' lịch sự với người lạ hoặc lớn tuổi, dùng 'o senhor / a senhora' thay cho 'você'.",
    cultural_notes_en:
      "Big cities (São Paulo, Rio) have a metrô plus heavy bus networks. Riders use a prepaid card (in SP, the 'Bilhete Único') tapped on boarding. City buses often have a fare collector ('cobrador') near the middle door. 'Trem' (train) runs suburban lines. To be polite with strangers or elders, use 'o senhor / a senhora' instead of 'você'.",
    tip_advice_vi:
      "Hai câu cứu cánh: 'Este ônibus vai para…?' (xe này có đi … không) và 'Preciso descer em…' (tôi cần xuống ở …). Phân biệt 'parar' (dừng lại) với 'parada' (trạm dừng). Nhớ 'descer' = xuống xe, 'subir' = lên xe.",
    tip_advice_en:
      "Two lifesaver lines: 'Este ônibus vai para…?' (does this bus go to…?) and 'Preciso descer em…' (I need to get off at…). Don't confuse 'parar' (to stop) with 'parada' (a stop). 'descer' = get off, 'subir' = get on/up.",
    l1_notes_vi: [
      {
        mistake: "Đọc 'g' trong 'passagem' thành 'g' cứng (ga).",
        fix_vi: "'g' trước e/i đọc như 'gi' (âm 'zh' trong measure): 'pa-SA-giêng'. Trước a/o/u mới đọc cứng.",
      },
      {
        mistake: "Đọc 's' giữa hai nguyên âm thành 's' (preciso → 'pre-XI-su').",
        fix_vi: "'s' giữa hai nguyên âm đọc là 'z': 'pre-XI-zu', 'a-vi-ZAR'. Quy tắc rất hệ thống, học một lần dùng mãi.",
      },
      {
        mistake: "Dùng 'você' với tài xế lớn tuổi hoặc người lạ trang trọng.",
        fix_vi: "Với người lạ lớn tuổi nên dùng 'o senhor / a senhora' cho lịch sự — giống 'ông/bà' trong tiếng Việt.",
      },
    ],
    vocabulary: [
      { word: "o ônibus", en: "bus", vi: "xe buýt", pos: "n.m.", pronunciation_vi: "u Ô-ni-bus", pronunciation_en: "oo OH-nee-boos" },
      { word: "o metrô", en: "metro / subway", vi: "tàu điện ngầm", pos: "n.m.", pronunciation_vi: "u mê-TRÔ", pronunciation_en: "oo meh-TROH" },
      { word: "o ponto de ônibus", en: "bus stop", vi: "trạm xe buýt", pos: "n.m.", pronunciation_vi: "u PÔN-tu đji Ô-ni-bus", pronunciation_en: "oo POWN-too jee OH-nee-boos" },
      { word: "a passagem", en: "ticket / fare", vi: "vé", pos: "n.f.", pronunciation_vi: "a pa-SA-giêng", pronunciation_en: "ah pah-SAH-zheng" },
      { word: "a parada", en: "stop", vi: "trạm dừng", pos: "n.f.", pronunciation_vi: "a pa-RA-đa", pronunciation_en: "ah pah-RAH-dah" },
      { word: "descer", en: "to get off / go down", vi: "xuống xe", pos: "verb", pronunciation_vi: "đes-SER", pronunciation_en: "deh-SEHR" },
      { word: "subir", en: "to get on / go up", vi: "lên xe", pos: "verb", pronunciation_vi: "su-BIR", pronunciation_en: "soo-BEER" },
      { word: "o centro", en: "downtown / centre", vi: "trung tâm", pos: "n.m.", pronunciation_vi: "u XÊN-tru", pronunciation_en: "oo SEN-troo" },
    ],
    dialogue: [
      { speaker: "Turista", text: "Com licença, este ônibus vai para o centro?", vi: "Xin lỗi, xe buýt này có đi trung tâm không?", en: "Excuse me, does this bus go downtown?" },
      { speaker: "Cobrador", text: "Vai sim. São quatro reais e cinquenta.", vi: "Có đi ạ. Bốn real năm mươi.", en: "Yes it does. That's four-fifty." },
      { speaker: "Turista", text: "Obrigado. Pode me avisar na praça da Sé?", vi: "Cảm ơn. Tới quảng trường Sé báo giúp tôi nhé?", en: "Thanks. Can you let me know at Praça da Sé?" },
      { speaker: "Cobrador", text: "Pode deixar. Você desce na próxima parada.", vi: "Cứ yên tâm. Bạn xuống ở trạm tiếp theo.", en: "Sure thing. You get off at the next stop." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        instruction_en: "Fill in the right word:",
        items: [
          { prompt: "Este ônibus ___ para o centro? (đi)", answer: "vai", options: ["vai", "vou", "vamos"] },
          { prompt: "Preciso ___ na próxima parada. (xuống)", answer: "descer", options: ["descer", "subir", "parar"] },
          { prompt: "Quanto custa a ___ de metrô?", answer: "passagem", options: ["passagem", "parada", "ponto"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Bồ Đào Nha (Brazil):",
        instruction_en: "Translate into Brazilian Portuguese:",
        items: [
          { prompt: "Trạm xe buýt gần nhất ở đâu?", answer: "Onde fica o ponto de ônibus mais perto?" },
          { prompt: "Tôi cần xuống ở trạm tiếp theo.", answer: "Preciso descer na próxima parada." },
          { prompt: "Làm ơn báo cho tôi nhé?", answer: "Por favor, pode me avisar?" },
        ],
      },
    ],
  },

  // ── 4. Appointments (booking & changing) ────────────────────────────────────
  {
    id: "portuguese_appointments",
    level: "A2",
    category: "appointments",
    title_vi: "Đặt và đổi lịch hẹn",
    title_en: "Making and changing appointments",
    sentences: [
      {
        pt: "Eu gostaria de marcar uma consulta.",
        vi: "Tôi muốn đặt một lịch khám.",
        en: "I'd like to make an appointment.",
        pronunciation_focus: [
          "gostaria → 'gos-ta-RI-a', lịch sự cao",
          "marcar → 'mar-CAR'",
          "consulta → 'côn-SUL-ta'",
        ],
        pronunciation_focus_en: [
          "gostaria → 'gohs-tah-REE-ah' — very polite 'I would like'",
          "marcar → 'mar-KAR' = to schedule/book; 'marcar uma consulta'",
          "consulta → 'kohn-SOOL-tah' = a (medical) appointment",
        ],
      },
      {
        pt: "Tem horário disponível na sexta-feira?",
        vi: "Thứ Sáu có giờ trống không?",
        en: "Is there a slot available on Friday?",
        pronunciation_focus: [
          "horário → 'o-RA-ri-u', h câm",
          "disponível → 'đjis-pô-NI-vel'",
          "sexta → 'SÉS-ta', x = 's'",
        ],
        pronunciation_focus_en: [
          "horário → 'oh-RAH-ree-oo' — silent 'h'; means time-slot/schedule",
          "disponível → 'jees-poh-NEE-vehw' = available",
          "sexta-feira → 'SESS-tah FAY-rah' = Friday ('x' here is 's')",
        ],
      },
      {
        pt: "Pode ser de manhã ou só à tarde?",
        vi: "Buổi sáng được không hay chỉ buổi chiều?",
        en: "Can it be in the morning, or only in the afternoon?",
        pronunciation_focus: [
          "pode ser → 'PÔ-đji SER'",
          "de manhã → 'đji man-NHÃ'",
          "à tarde → 'a TAR-đji'",
        ],
        pronunciation_focus_en: [
          "'pode ser?' = 'can it be / would that work?'",
          "de manhã → 'jee mun-NYAH' = in the morning",
          "à tarde → 'ah TAR-jee' = in the afternoon",
        ],
      },
      {
        pt: "Preciso desmarcar e remarcar para outro dia.",
        vi: "Tôi cần hủy và đặt lại sang ngày khác.",
        en: "I need to cancel and reschedule for another day.",
        pronunciation_focus: [
          "desmarcar → 'đjis-mar-CAR' = hủy",
          "remarcar → 'he-mar-CAR', r đầu = 'h'",
          "outro → 'ÔU-tru'",
        ],
        pronunciation_focus_en: [
          "desmarcar → 'jees-mar-KAR' = to cancel (un-book)",
          "remarcar → 'heh-mar-KAR' — initial r is 'h'; = to reschedule",
          "outro dia → 'OH-troo JEE-ah' = another day",
        ],
      },
      {
        pt: "Confirmo o horário das três da tarde.",
        vi: "Tôi xác nhận giờ hẹn ba giờ chiều.",
        en: "I confirm the three o'clock appointment.",
        pronunciation_focus: [
          "confirmo → 'côn-FIR-mu'",
          "das três → 'đas TRÊS'",
          "tarde → 'TAR-đji'",
        ],
        pronunciation_focus_en: [
          "confirmo → 'kohn-FEER-moo' = I confirm",
          "às três (da tarde) → 'ahss TRESH' = at three (p.m.)",
          "tarde → 'TAR-jee' = afternoon",
        ],
      },
    ],
    cultural_notes_vi:
      "Đặt lịch ở phòng khám, ngân hàng hay cắt tóc ở Brazil thường dùng động từ 'marcar' (đặt) và 'consulta' (buổi khám/gặp). Người Brazil rất hay dùng thì điều kiện 'eu gostaria' khi yêu cầu lịch sự. Các thứ trong tuần dùng 'feira': segunda-feira (thứ Hai) … sexta-feira (thứ Sáu); chỉ sábado và domingo không có 'feira'. Khi hẹn chính thức (bác sĩ, công sở) nên đúng giờ.",
    cultural_notes_en:
      "Booking at a clinic, bank, or salon uses the verb 'marcar' (to schedule) and 'consulta' (appointment/session). Brazilians lean on the conditional 'eu gostaria' for polite requests. Weekdays use 'feira': segunda-feira (Monday) … sexta-feira (Friday); only sábado (Sat) and domingo (Sun) drop 'feira'. For formal appointments (doctor, office), be on time.",
    tip_advice_vi:
      "Học bộ ba 'marcar / desmarcar / remarcar' (đặt / hủy / đặt lại) — chỉ thêm tiền tố. 'Eu gostaria de + động từ nguyên thể' là khuôn lịch sự vạn năng: 'gostaria de marcar', 'gostaria de mudar'. Đừng quên 'de' sau 'gostaria'.",
    tip_advice_en:
      "Learn the trio 'marcar / desmarcar / remarcar' (book / cancel / rebook) — just prefixes on one verb. 'Eu gostaria de + infinitive' is the all-purpose polite frame: 'gostaria de marcar', 'gostaria de mudar'. Never drop the 'de' after 'gostaria'.",
    l1_notes_vi: [
      {
        mistake: "Bỏ 'de' sau 'gostaria': nói 'gostaria marcar'.",
        fix_vi: "Phải có 'de' + động từ nguyên thể: 'gostaria DE marcar'. Tiếng Việt không có giới từ nối này nên dễ bỏ.",
      },
      {
        mistake: "Dùng 'feira' cho cuối tuần: 'sábado-feira'.",
        fix_vi: "Chỉ thứ Hai đến thứ Sáu mới có 'feira'. Cuối tuần là 'sábado' và 'domingo', không thêm 'feira'.",
      },
      {
        mistake: "Đọc 'h' đầu 'horário' thành âm 'h'.",
        fix_vi: "'h' đầu từ trong tiếng Bồ luôn câm: 'o-RA-ri-u'. (Nhưng 'r' đầu từ lại đọc thành 'h' — ngược với trực giác.)",
      },
    ],
    vocabulary: [
      { word: "marcar", en: "to book / schedule", vi: "đặt lịch", pos: "verb", pronunciation_vi: "mar-CAR", pronunciation_en: "mar-KAR" },
      { word: "desmarcar", en: "to cancel", vi: "hủy lịch", pos: "verb", pronunciation_vi: "đjis-mar-CAR", pronunciation_en: "jees-mar-KAR" },
      { word: "remarcar", en: "to reschedule", vi: "đặt lại", pos: "verb", pronunciation_vi: "he-mar-CAR", pronunciation_en: "heh-mar-KAR" },
      { word: "a consulta", en: "appointment (medical)", vi: "buổi khám", pos: "n.f.", pronunciation_vi: "a côn-SUL-ta", pronunciation_en: "ah kohn-SOOL-tah" },
      { word: "o horário", en: "time-slot / schedule", vi: "giờ hẹn, lịch", pos: "n.m.", pronunciation_vi: "u o-RA-ri-u", pronunciation_en: "oo oh-RAH-ree-oo" },
      { word: "disponível", en: "available", vi: "còn trống", pos: "adj.", pronunciation_vi: "đjis-pô-NI-vel", pronunciation_en: "jees-poh-NEE-vehw" },
      { word: "sexta-feira", en: "Friday", vi: "thứ Sáu", pos: "n.f.", pronunciation_vi: "SÉS-ta FÊI-ra", pronunciation_en: "SESS-tah FAY-rah" },
      { word: "confirmar", en: "to confirm", vi: "xác nhận", pos: "verb", pronunciation_vi: "côn-fir-MAR", pronunciation_en: "kohn-feer-MAR" },
    ],
    dialogue: [
      { speaker: "Paciente", text: "Boa tarde, gostaria de marcar uma consulta.", vi: "Chào buổi chiều, tôi muốn đặt lịch khám.", en: "Good afternoon, I'd like to make an appointment." },
      { speaker: "Recepção", text: "Claro. Tem horário na sexta-feira de manhã.", vi: "Vâng. Thứ Sáu buổi sáng còn giờ.", en: "Of course. There's a slot Friday morning." },
      { speaker: "Paciente", text: "Sexta de manhã não posso. Pode ser à tarde?", vi: "Sáng thứ Sáu tôi bận. Buổi chiều được không?", en: "I can't on Friday morning. Could it be the afternoon?" },
      { speaker: "Recepção", text: "Pode. Às três da tarde. Confirmo então?", vi: "Được. Ba giờ chiều. Tôi xác nhận nhé?", en: "Sure. At three. Shall I confirm then?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền giới từ hoặc động từ đúng:",
        instruction_en: "Fill in the right preposition or verb:",
        items: [
          { prompt: "Eu gostaria ___ marcar uma consulta.", answer: "de", options: ["de", "a", "para"] },
          { prompt: "Preciso ___ a consulta para outro dia. (đặt lại)", answer: "remarcar", options: ["remarcar", "marcar", "confirmar"] },
          { prompt: "Tem horário na ___? (thứ Sáu)", answer: "sexta-feira", options: ["sexta-feira", "sábado", "domingo"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Bồ Đào Nha (Brazil):",
        instruction_en: "Translate into Brazilian Portuguese:",
        items: [
          { prompt: "Tôi muốn đặt một lịch khám.", answer: "Eu gostaria de marcar uma consulta." },
          { prompt: "Tôi cần hủy và đặt lại sang ngày khác.", answer: "Preciso desmarcar e remarcar para outro dia." },
          { prompt: "Tôi xác nhận giờ hẹn ba giờ chiều.", answer: "Confirmo o horário das três da tarde." },
        ],
      },
    ],
  },

  // ── 5. Housing (looking for / renting) ──────────────────────────────────────
  {
    id: "portuguese_housing_renting",
    level: "A2",
    category: "housing",
    title_vi: "Tìm và thuê nhà",
    title_en: "Looking for and renting housing",
    sentences: [
      {
        pt: "Estou procurando um apartamento para alugar.",
        vi: "Tôi đang tìm một căn hộ để thuê.",
        en: "I'm looking for an apartment to rent.",
        pronunciation_focus: [
          "estou → 'es-TÔU', thường nói 'tô'",
          "procurando → 'pro-cu-RÃN-du'",
          "apartamento → 'a-par-ta-MÊN-tu'",
        ],
        pronunciation_focus_en: [
          "estou → 'es-TOH' — Brazilians shorten it to 'tô'",
          "procurando → 'proh-koo-RAHN-doo' — '-ndo' = the '-ing' continuous",
          "apartamento → 'ah-par-tah-MEN-too' = apartment",
        ],
      },
      {
        pt: "Quanto é o aluguel por mês?",
        vi: "Tiền thuê mỗi tháng bao nhiêu?",
        en: "How much is the rent per month?",
        pronunciation_focus: [
          "aluguel → 'a-lu-GUEL', gu = 'g' cứng",
          "por mês → 'pur MÊS', đuôi mũi nhẹ",
          "'aluguel' = tiền thuê (Brazil)",
        ],
        pronunciation_focus_en: [
          "aluguel → 'ah-loo-GEHW' — 'gu' is a hard 'g'; BR word for rent (PT uses 'renda')",
          "por mês → 'poor MESH' = per month (slight nasal on 'ês')",
          "the rent itself = 'o aluguel'; to rent = 'alugar'",
        ],
      },
      {
        pt: "O apartamento tem dois quartos e uma cozinha.",
        vi: "Căn hộ có hai phòng ngủ và một bếp.",
        en: "The apartment has two bedrooms and a kitchen.",
        pronunciation_focus: [
          "dois → 'ĐÔIS'",
          "quartos → 'CUAR-tus', qu = 'cu'",
          "cozinha → 'cô-ZI-nha', nh = 'nh'",
        ],
        pronunciation_focus_en: [
          "dois → 'doysh' = two (masculine)",
          "quartos → 'KWAR-toos' — 'qu' is 'kw'; 'quarto' = bedroom",
          "cozinha → 'koh-ZEE-nyah' — 'z' sound, 'nh' = 'ny'; = kitchen",
        ],
      },
      {
        pt: "O condomínio está incluído no aluguel?",
        vi: "Phí chung cư đã tính trong tiền thuê chưa?",
        en: "Is the building fee included in the rent?",
        pronunciation_focus: [
          "condomínio → 'côn-đô-MI-ni-u'",
          "incluído → 'in-clu-Í-đu'",
          "no aluguel → 'nu a-lu-GUEL'",
        ],
        pronunciation_focus_en: [
          "condomínio → 'kohn-doh-MEE-nee-oo' = the monthly building/HOA fee",
          "incluído → 'een-kloo-EE-doo' = included (note the stressed 'í')",
          "in BR rentals, 'condomínio' is a big separate charge — always ask",
        ],
      },
      {
        pt: "Posso visitar o imóvel amanhã?",
        vi: "Mai tôi xem nhà được không?",
        en: "Can I visit the property tomorrow?",
        pronunciation_focus: [
          "visitar → 'vi-zi-TAR', s = 'z'",
          "imóvel → 'i-MÓ-vel'",
          "amanhã → 'a-man-NHÃ', đuôi mũi",
        ],
        pronunciation_focus_en: [
          "visitar → 'vee-zee-TAR' — 's' between vowels is 'z'",
          "imóvel → 'ee-MOH-vehw' = property/real estate",
          "amanhã → 'ah-mun-NYAH' — nasal ending; = tomorrow",
        ],
      },
    ],
    cultural_notes_vi:
      "Thuê nhà ở Brazil thường qua 'imobiliária' (công ty môi giới). Hợp đồng hay yêu cầu người bảo lãnh ('fiador') hoặc đặt cọc. Ngoài 'aluguel' (tiền thuê) còn có 'condomínio' (phí chung cư: bảo vệ, dọn dẹp, hồ bơi) và 'IPTU' (thuế nhà đất) — luôn hỏi rõ tổng cộng. 'Apartamento' rất phổ biến ở thành phố; 'casa' là nhà riêng. Phòng ngủ là 'quarto', phòng khách là 'sala'.",
    cultural_notes_en:
      "Renting in Brazil usually goes through an 'imobiliária' (agency). Leases often need a guarantor ('fiador') or a deposit. Beyond 'aluguel' (rent) there's 'condomínio' (building fee: security, cleaning, pool) and 'IPTU' (property tax) — always ask for the total. 'Apartamento' is common in cities; 'casa' is a house. Bedroom = 'quarto', living room = 'sala'.",
    tip_advice_vi:
      "Phân biệt 'alugar' (động từ: thuê/cho thuê) với 'o aluguel' (danh từ: tiền thuê). Câu vàng để hỏi tổng chi phí: 'O condomínio está incluído?'. Dùng thì tiếp diễn 'estou + động từ-ndo' (estou procurando = tôi đang tìm) — rất hay gặp trong giao tiếp Brazil.",
    tip_advice_en:
      "Separate 'alugar' (verb: to rent) from 'o aluguel' (noun: the rent). Golden question for total cost: 'O condomínio está incluído?'. Use the continuous 'estou + verb-ndo' (estou procurando = I'm looking) — extremely common in spoken BR.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'alugar' khi muốn nói số tiền thuê.",
        fix_vi: "'Alugar' là động từ (thuê). Số tiền là danh từ 'o aluguel'. Hỏi giá: 'Quanto é o aluguel?' chứ không phải 'Quanto é o alugar?'.",
      },
      {
        mistake: "Chỉ hỏi 'aluguel' mà quên 'condomínio' và 'IPTU'.",
        fix_vi: "Ở Brazil chi phí thật = aluguel + condomínio + IPTU. Hỏi 'Está tudo incluído?' để biết tổng, tránh sốc hóa đơn.",
      },
      {
        mistake: "Đọc 'gu' trong 'aluguel' thành 'gu' mềm (giu).",
        fix_vi: "'gu' trước e/i đọc là 'g' cứng (u câm): 'a-lu-GUEL'. Chữ 'u' chỉ để giữ âm 'g' cứng, không phát âm.",
      },
    ],
    vocabulary: [
      { word: "o apartamento", en: "apartment", vi: "căn hộ", pos: "n.m.", pronunciation_vi: "u a-par-ta-MÊN-tu", pronunciation_en: "oo ah-par-tah-MEN-too" },
      { word: "alugar", en: "to rent", vi: "thuê / cho thuê", pos: "verb", pronunciation_vi: "a-lu-GAR", pronunciation_en: "ah-loo-GAR" },
      { word: "o aluguel", en: "rent (the amount)", vi: "tiền thuê", pos: "n.m.", pronunciation_vi: "u a-lu-GUEL", pronunciation_en: "oo ah-loo-GEHW" },
      { word: "o quarto", en: "bedroom", vi: "phòng ngủ", pos: "n.m.", pronunciation_vi: "u CUAR-tu", pronunciation_en: "oo KWAR-too" },
      { word: "a cozinha", en: "kitchen", vi: "bếp", pos: "n.f.", pronunciation_vi: "a cô-ZI-nha", pronunciation_en: "ah koh-ZEE-nyah" },
      { word: "o banheiro", en: "bathroom", vi: "nhà vệ sinh", pos: "n.m.", pronunciation_vi: "u ba-NHÊI-ru", pronunciation_en: "oo bah-NYAY-roo" },
      { word: "o condomínio", en: "building fee / condo", vi: "phí chung cư", pos: "n.m.", pronunciation_vi: "u côn-đô-MI-ni-u", pronunciation_en: "oo kohn-doh-MEE-nee-oo" },
      { word: "o imóvel", en: "property", vi: "bất động sản, nhà", pos: "n.m.", pronunciation_vi: "u i-MÓ-vel", pronunciation_en: "oo ee-MOH-vehw" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Oi, estou procurando um apartamento para alugar.", vi: "Chào, tôi đang tìm căn hộ để thuê.", en: "Hi, I'm looking for an apartment to rent." },
      { speaker: "Corretor", text: "Temos um de dois quartos no centro. Quanto pode pagar?", vi: "Có một căn hai phòng ở trung tâm. Bạn trả được bao nhiêu?", en: "We have a two-bedroom downtown. What's your budget?" },
      { speaker: "Cliente", text: "Até dois mil. O condomínio está incluído?", vi: "Tối đa hai nghìn. Phí chung cư đã tính chưa?", en: "Up to two thousand. Is the building fee included?" },
      { speaker: "Corretor", text: "O condomínio é à parte. Quer visitar amanhã?", vi: "Phí chung cư tính riêng. Mai bạn muốn xem nhà không?", en: "The fee is separate. Want to visit tomorrow?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng (động từ hay danh từ):",
        instruction_en: "Fill in the right word (verb or noun):",
        items: [
          { prompt: "Estou procurando um apartamento para ___. (thuê – động từ)", answer: "alugar", options: ["alugar", "aluguel", "alugado"] },
          { prompt: "Quanto é o ___ por mês? (tiền thuê)", answer: "aluguel", options: ["aluguel", "alugar", "condomínio"] },
          { prompt: "O ___ está incluído no aluguel? (phí chung cư)", answer: "condomínio", options: ["condomínio", "quarto", "banheiro"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối phòng/khái niệm với nghĩa:",
        instruction_en: "Match the room/term with its meaning:",
        pairs: [
          ["o quarto", "phòng ngủ (bedroom)"],
          ["a cozinha", "bếp (kitchen)"],
          ["o banheiro", "nhà vệ sinh (bathroom)"],
          ["o imóvel", "bất động sản (property)"],
        ],
      },
    ],
  },

  // ── 6. Shopping for clothes (sizes & trying on) ─────────────────────────────
  {
    id: "portuguese_shopping_clothes",
    level: "A2",
    category: "shopping",
    title_vi: "Mua quần áo",
    title_en: "Shopping for clothes",
    sentences: [
      {
        pt: "Estou procurando uma camisa azul.",
        vi: "Tôi đang tìm một cái áo sơ mi màu xanh.",
        en: "I'm looking for a blue shirt.",
        pronunciation_focus: [
          "procurando → 'pro-cu-RÃN-du'",
          "camisa → 'ca-MI-za', s = 'z'",
          "azul → 'a-ZUL', z = 'z'",
        ],
        pronunciation_focus_en: [
          "procurando → 'proh-koo-RAHN-doo' = looking for ('-ing')",
          "camisa → 'kah-MEE-zah' — 's' between vowels → 'z'",
          "azul → 'ah-ZOOL' = blue",
        ],
      },
      {
        pt: "Qual é o seu tamanho?",
        vi: "Bạn mặc cỡ nào?",
        en: "What's your size?",
        pronunciation_focus: [
          "qual → 'CUAU'",
          "seu → 'XÊU'",
          "tamanho → 'ta-MA-nhu', nh = 'nh'",
        ],
        pronunciation_focus_en: [
          "qual → 'kwow' = which/what",
          "seu → 'say-oo' = your (masc.)",
          "tamanho → 'tah-MAH-nyoo' — 'nh' = 'ny'; = size",
        ],
      },
      {
        pt: "Posso experimentar este aqui?",
        vi: "Tôi thử cái này được không?",
        en: "Can I try this one on?",
        pronunciation_focus: [
          "posso → 'PÔ-su'",
          "experimentar → 'es-pe-ri-men-TAR'",
          "este aqui → 'ÉS-tchi a-KI'",
        ],
        pronunciation_focus_en: [
          "posso → 'POH-soo' = may I",
          "experimentar → 'es-peh-ree-men-TAR' = to try on",
          "este aqui → 'ESH-tchee ah-KEE' = this one here",
        ],
      },
      {
        pt: "Ficou um pouco apertado. Tem maior?",
        vi: "Hơi chật. Có cỡ to hơn không?",
        en: "It's a bit tight. Do you have a bigger one?",
        pronunciation_focus: [
          "ficou → 'fi-CÔU'",
          "apertado → 'a-per-TA-đu'",
          "maior → 'ma-IÔR'",
        ],
        pronunciation_focus_en: [
          "ficou → 'fee-KOH' — 'ficou apertado' = it turned out tight (it fits tight)",
          "apertado → 'ah-pehr-TAH-doo' = tight; 'largo' = loose",
          "maior → 'mah-YOR' = bigger; 'menor' = smaller",
        ],
      },
      {
        pt: "Vou levar este. Onde eu pago?",
        vi: "Tôi lấy cái này. Tôi trả tiền ở đâu?",
        en: "I'll take this one. Where do I pay?",
        pronunciation_focus: [
          "vou levar → 'vôu lê-VAR'",
          "este → 'ÉS-tchi'",
          "pago → 'PA-gu'",
        ],
        pronunciation_focus_en: [
          "'vou levar' = 'I'll take it' (lit. 'I'm going to carry')",
          "este → 'ESH-tchee' = this one",
          "pago → 'PAH-goo' = I pay; 'onde eu pago?' = where do I pay?",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong cửa hàng quần áo Brazil, nhân viên hay hỏi 'Posso ajudar?' (giúp gì được không) hoặc 'Está procurando alguma coisa?'. Cỡ quần áo dùng P/M/G/GG (Pequeno/Médio/Grande/Extra grande) thay cho S/M/L. Phòng thử đồ là 'provador'. Trả giá không phổ biến ở cửa hàng/trung tâm thương mại, nhưng ở chợ phiên hoặc cửa hàng nhỏ thì có thể hỏi 'Tem desconto?' (có giảm giá không).",
    cultural_notes_en:
      "In a Brazilian clothes shop, staff often ask 'Posso ajudar?' (can I help?) or 'Está procurando alguma coisa?'. Sizes use P/M/G/GG (Pequeno/Médio/Grande/Extra grande) instead of S/M/L. The fitting room is the 'provador'. Haggling is uncommon in malls/stores, but at a feira or small shop you can ask 'Tem desconto?' (any discount?).",
    tip_advice_vi:
      "Học cặp 'maior / menor' (to hơn / nhỏ hơn) và 'apertado / largo' (chật / rộng) để mô tả vừa vặn. 'Vou levar' = 'tôi lấy/mua cái này' — câu chốt đơn quen thuộc. Nhớ cỡ Brazil là P/M/G/GG, đừng dùng S/M/L.",
    tip_advice_en:
      "Learn 'maior / menor' (bigger/smaller) and 'apertado / largo' (tight/loose) to describe fit. 'Vou levar' = 'I'll take this' — the natural closing line. Remember sizes are P/M/G/GG, not S/M/L.",
    l1_notes_vi: [
      {
        mistake: "Đọc 's' trong 'camisa', 'azul' thành 's' cứng.",
        fix_vi: "'s' giữa hai nguyên âm và 'z' đều đọc là 'z': 'ca-MI-za', 'a-ZUL'. Tiếng Việt không phân biệt nên dễ đọc thành 's'.",
      },
      {
        mistake: "Hỏi cỡ kiểu 'Que size?' hoặc dùng S/M/L.",
        fix_vi: "Nói 'Qual é o seu tamanho?' và dùng cỡ P/M/G/GG của Brazil, không phải S/M/L.",
      },
      {
        mistake: "Dùng 'este/esta' sai giống với danh từ.",
        fix_vi: "'este' đi với danh từ giống đực (este sapato), 'esta' với giống cái (esta camisa). Tiếng Việt không chia giống nên phải nhớ giống của từng từ.",
      },
    ],
    vocabulary: [
      { word: "a camisa", en: "shirt", vi: "áo sơ mi", pos: "n.f.", pronunciation_vi: "a ca-MI-za", pronunciation_en: "ah kah-MEE-zah" },
      { word: "o tamanho", en: "size", vi: "cỡ, kích thước", pos: "n.m.", pronunciation_vi: "u ta-MA-nhu", pronunciation_en: "oo tah-MAH-nyoo" },
      { word: "experimentar", en: "to try on", vi: "thử (đồ)", pos: "verb", pronunciation_vi: "es-pe-ri-men-TAR", pronunciation_en: "es-peh-ree-men-TAR" },
      { word: "o provador", en: "fitting room", vi: "phòng thử đồ", pos: "n.m.", pronunciation_vi: "u pro-va-ĐÔR", pronunciation_en: "oo proh-vah-DOR" },
      { word: "apertado", en: "tight", vi: "chật", pos: "adj.", pronunciation_vi: "a-per-TA-đu", pronunciation_en: "ah-pehr-TAH-doo" },
      { word: "maior", en: "bigger", vi: "to hơn", pos: "adj.", pronunciation_vi: "ma-IÔR", pronunciation_en: "mah-YOR" },
      { word: "menor", en: "smaller", vi: "nhỏ hơn", pos: "adj.", pronunciation_vi: "mê-NÔR", pronunciation_en: "meh-NOR" },
      { word: "o desconto", en: "discount", vi: "giảm giá", pos: "n.m.", pronunciation_vi: "u đjis-CÔN-tu", pronunciation_en: "oo jees-KOWN-too" },
    ],
    dialogue: [
      { speaker: "Vendedora", text: "Posso ajudar? Está procurando alguma coisa?", vi: "Tôi giúp gì được không? Bạn đang tìm gì ạ?", en: "Can I help? Are you looking for something?" },
      { speaker: "Cliente", text: "Estou procurando uma camisa azul, tamanho M.", vi: "Tôi đang tìm áo sơ mi xanh, cỡ M.", en: "I'm looking for a blue shirt, size M." },
      { speaker: "Vendedora", text: "Aqui está. O provador é ali. Pode experimentar.", vi: "Đây ạ. Phòng thử ở kia. Bạn cứ thử.", en: "Here it is. The fitting room's over there. You can try it on." },
      { speaker: "Cliente", text: "Ficou apertado. Tem maior? Aí eu levo.", vi: "Hơi chật. Có cỡ to hơn không? Vậy tôi lấy.", en: "It's tight. Have a bigger one? Then I'll take it." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        instruction_en: "Fill in the right word:",
        items: [
          { prompt: "Qual é o seu ___? (cỡ)", answer: "tamanho", options: ["tamanho", "preço", "provador"] },
          { prompt: "Posso ___ este aqui? (thử đồ)", answer: "experimentar", options: ["experimentar", "levar", "pagar"] },
          { prompt: "Ficou apertado. Tem ___? (to hơn)", answer: "maior", options: ["maior", "menor", "barato"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Bồ Đào Nha (Brazil):",
        instruction_en: "Translate into Brazilian Portuguese:",
        items: [
          { prompt: "Tôi đang tìm một cái áo sơ mi màu xanh.", answer: "Estou procurando uma camisa azul." },
          { prompt: "Tôi thử cái này được không?", answer: "Posso experimentar este aqui?" },
          { prompt: "Tôi lấy cái này. Tôi trả tiền ở đâu?", answer: "Vou levar este. Onde eu pago?" },
        ],
      },
    ],
  },
];

export default lessons;
