// src/languages/thai/grammarMiniBook.ts
//
// A compact Thai grammar mini-book for Vietnamese-speaking AND
// English-speaking learners. Built by the A3 agent (Wave 3).
//
// Each note is a self-contained card: a rule stated for both a Vietnamese
// (`explanation_vi`) and an English (`explanation_en`) reader, Thai-script
// examples with romanization and bilingual glosses, and the common mistake a
// VI/EN learner makes. The mini-book is grouped by topic (word order, no
// conjugation, tense/time markers, particles, classifiers, questions,
// negation, pronouns, politeness, comparison, aspect, sentence linking).
//
// This is self-contained: the Thai vertical has no shared grammar registry
// yet, so the types live here.
//
// This is a study aid distilled from standard reference grammar. It makes NO
// claim of native authority — tone marks and register are provisional and
// native review is deferred where relevant. Romanization is a learner aid
// (loosely RTGS with tone/length hints), not a transcription standard.

// ── Types ───────────────────────────────────────────────────────────────────

export type ThaiGrammarTopic =
  | "word_order"
  | "no_conjugation"
  | "tense_time_markers"
  | "particles"
  | "classifiers"
  | "questions"
  | "negation"
  | "pronouns"
  | "politeness"
  | "comparison"
  | "aspect"
  | "sentence_linking";

export type ThaiGrammarExample = {
  /** Example in Thai script. */
  th: string;
  /** Romanization (tone/length hints inline where helpful). */
  rtgs: string;
  vi: string;
  en: string;
};

/** The common mistake a VI/EN learner makes, plus the corrected form. */
export type ThaiGrammarMistake = {
  /** The wrong form learners tend to produce (Thai or a description). */
  wrong: string;
  /** The corrected form. */
  right: string;
  /** Why, for a Vietnamese reader. */
  why_vi: string;
  /** Why, for an English reader. */
  why_en: string;
};

export type ThaiGrammarNote = {
  id: string;
  topic: ThaiGrammarTopic;
  title_vi: string;
  title_en: string;
  /** The rule, stated for a Vietnamese reader. */
  explanation_vi: string;
  /** The rule, stated for an English reader. */
  explanation_en: string;
  examples: ThaiGrammarExample[];
  mistakes: ThaiGrammarMistake[];
};

// ── Notes ───────────────────────────────────────────────────────────────────

export const notes: ThaiGrammarNote[] = [
  // ── word_order ─────────────────────────────────────────────────────────────
  {
    id: "thai_gram_svo",
    topic: "word_order",
    title_vi: "Trật tự cơ bản: Chủ – Động – Tân (SVO)",
    title_en: "Basic order: Subject–Verb–Object (SVO)",
    explanation_vi:
      "Tiếng Thái theo trật tự Chủ ngữ + Động từ + Tân ngữ, giống tiếng Việt và tiếng Anh. Đây là khung xương của hầu hết câu.",
    explanation_en:
      "Thai is Subject + Verb + Object, the same as Vietnamese and English. This is the backbone of most sentences.",
    examples: [
      { th: "ฉันกินข้าว", rtgs: "chǎn gin khâao", vi: "Tôi ăn cơm.", en: "I eat rice." },
      { th: "เขาอ่านหนังสือ", rtgs: "kháo àan nǎng-sǔe", vi: "Anh ấy đọc sách.", en: "He reads a book." },
    ],
    mistakes: [
      {
        wrong: "ข้าวกินฉัน",
        right: "ฉันกินข้าว",
        why_vi: "Đảo lộn tân ngữ và chủ ngữ làm sai nghĩa. Giữ Chủ–Động–Tân.",
        why_en: "Swapping object and subject reverses the meaning. Keep Subject–Verb–Object.",
      },
    ],
  },
  {
    id: "thai_gram_adj_after_noun",
    topic: "word_order",
    title_vi: "Tính từ đứng sau danh từ",
    title_en: "Adjectives follow the noun",
    explanation_vi:
      "Tính từ luôn đứng SAU danh từ: danh từ + tính từ. Giống tiếng Việt ('nhà to'), ngược tiếng Anh ('big house').",
    explanation_en:
      "Adjectives always follow the noun: noun + adjective. Like Vietnamese ('nhà to'); English speakers must flip from 'big house'.",
    examples: [
      { th: "บ้านใหญ่", rtgs: "bâan yài", vi: "nhà to", en: "a big house (lit. house big)" },
      { th: "รถสีแดง", rtgs: "rót sǐi daaeng", vi: "xe màu đỏ", en: "a red car (lit. car colour-red)" },
    ],
    mistakes: [
      {
        wrong: "ใหญ่บ้าน",
        right: "บ้านใหญ่",
        why_vi: "Người nói tiếng Anh hay đặt tính từ trước. Tiếng Thái: danh từ trước, tính từ sau.",
        why_en: "English speakers front the adjective. In Thai the noun comes first, then the adjective.",
      },
    ],
  },
  {
    id: "thai_gram_possessive_order",
    topic: "word_order",
    title_vi: "Sở hữu đứng sau: danh từ + (ของ) + người sở hữu",
    title_en: "Possession follows: noun + (ของ) + owner",
    explanation_vi:
      "Người/vật sở hữu đứng SAU danh từ, có thể thêm 'ของ (khǎawng)' = 'của'. 'บ้านของฉัน' hoặc gọn 'บ้านฉัน' = nhà tôi.",
    explanation_en:
      "The owner comes AFTER the noun, optionally with 'ของ (khǎawng)' = 'of'. 'บ้านของฉัน' or the short 'บ้านฉัน' = my house.",
    examples: [
      { th: "หนังสือของฉัน", rtgs: "nǎng-sǔe khǎawng chǎn", vi: "sách của tôi", en: "my book" },
      { th: "แม่เขา", rtgs: "mâae kháo", vi: "mẹ anh ấy", en: "his mother" },
    ],
    mistakes: [
      {
        wrong: "ฉันบ้าน / ของฉันบ้าน",
        right: "บ้านฉัน / บ้านของฉัน",
        why_vi: "Đừng đặt người sở hữu trước. Trật tự là danh từ + (ของ) + người sở hữu.",
        why_en: "Don't front the owner. The order is noun + (ของ) + owner.",
      },
    ],
  },
  {
    id: "thai_gram_time_position",
    topic: "word_order",
    title_vi: "Vị trí cụm thời gian: đầu hoặc cuối câu",
    title_en: "Time phrases: front or end of the clause",
    explanation_vi:
      "Cụm thời gian (เมื่อวาน, พรุ่งนี้, ตอนเช้า) thường đứng ĐẦU hoặc CUỐI câu, không chen vào giữa chủ ngữ và động từ.",
    explanation_en:
      "Time phrases (เมื่อวาน, พรุ่งนี้, ตอนเช้า) usually sit at the FRONT or END, not between subject and verb.",
    examples: [
      { th: "พรุ่งนี้ฉันไปทำงาน", rtgs: "phrûng-níi chǎn bpai tham-ngaan", vi: "Ngày mai tôi đi làm.", en: "Tomorrow I go to work." },
      { th: "ฉันไปทำงานตอนเช้า", rtgs: "chǎn bpai tham-ngaan dtaawn-cháo", vi: "Tôi đi làm vào buổi sáng.", en: "I go to work in the morning." },
    ],
    mistakes: [
      {
        wrong: "ฉันพรุ่งนี้ไปทำงาน (kém tự nhiên)",
        right: "พรุ่งนี้ฉันไปทำงาน",
        why_vi: "Chen thời gian giữa chủ ngữ và động từ nghe không tự nhiên; đưa ra đầu hoặc cuối.",
        why_en: "Wedging the time word between subject and verb sounds off; move it to the front or end.",
      },
    ],
  },

  // ── no_conjugation ─────────────────────────────────────────────────────────
  {
    id: "thai_gram_no_conjugation",
    topic: "no_conjugation",
    title_vi: "Động từ không chia (ngôi, số, thì)",
    title_en: "Verbs never conjugate (person, number, tense)",
    explanation_vi:
      "Động từ tiếng Thái có MỘT dạng duy nhất. Không đổi theo ngôi, số nhiều, hay thì. Ngữ cảnh và các từ phụ gánh ý nghĩa.",
    explanation_en:
      "Thai verbs have ONE form. They never change for person, number, or tense. Context and helper words carry the meaning.",
    examples: [
      { th: "ฉันไป / เขาไป / เราไป", rtgs: "chǎn bpai / kháo bpai / rao bpai", vi: "tôi đi / anh ấy đi / chúng tôi đi", en: "I go / he goes / we go (same 'ไป')" },
      { th: "เมื่อวานฉันไป", rtgs: "mûea-waan chǎn bpai", vi: "Hôm qua tôi đi.", en: "Yesterday I went ('ไป' unchanged)." },
    ],
    mistakes: [
      {
        wrong: "Cố thêm đuôi quá khứ vào động từ",
        right: "Giữ nguyên động từ + dùng từ thời gian / แล้ว / จะ",
        why_vi: "Không có dạng quá khứ của động từ. Dùng từ thời gian hoặc dấu hiệu thì.",
        why_en: "There is no past form of the verb. Use time words or tense markers instead.",
      },
    ],
  },
  {
    id: "thai_gram_no_copula_adj",
    topic: "no_conjugation",
    title_vi: "Không dùng 'là' trước tính từ",
    title_en: "No 'to be' before adjectives",
    explanation_vi:
      "Tính từ tự làm vị ngữ — KHÔNG cần động từ 'เป็น/là' trước nó. 'อาหารเผ็ด' = đồ ăn (thì) cay. 'เป็น' chỉ dùng với danh từ/vai trò.",
    explanation_en:
      "Adjectives are their own predicate — NO copula before them. 'อาหารเผ็ด' = the food is spicy. Use 'เป็น' only with nouns/roles.",
    examples: [
      { th: "เขาสวย", rtgs: "kháo sǔay", vi: "Cô ấy đẹp.", en: "She is pretty." },
      { th: "เขาเป็นครู", rtgs: "kháo bpen khruu", vi: "Cô ấy là giáo viên.", en: "She is a teacher (noun → 'เป็น')." },
    ],
    mistakes: [
      {
        wrong: "เขาเป็นสวย",
        right: "เขาสวย",
        why_vi: "Tính từ không cần 'เป็น'. Chỉ danh từ/nghề mới dùng 'เป็น'.",
        why_en: "Adjectives take no 'เป็น'. Only nouns/roles use 'เป็น'.",
      },
    ],
  },

  // ── tense_time_markers ─────────────────────────────────────────────────────
  {
    id: "thai_gram_future_ja",
    topic: "tense_time_markers",
    title_vi: "จะ (jà) — dấu hiệu tương lai, đứng trước động từ",
    title_en: "จะ (jà) — future marker, before the verb",
    explanation_vi:
      "'จะ' đứng NGAY TRƯỚC động từ để chỉ tương lai/ý định: 'sẽ'. Giống tiếng Việt đặt 'sẽ' trước động từ.",
    explanation_en:
      "'จะ' goes DIRECTLY BEFORE the verb to mark future/intention: 'will'. Like Vietnamese 'sẽ' before the verb.",
    examples: [
      { th: "ฉันจะไป", rtgs: "chǎn jà bpai", vi: "Tôi sẽ đi.", en: "I will go." },
      { th: "พรุ่งนี้เขาจะมา", rtgs: "phrûng-níi kháo jà maa", vi: "Mai anh ấy sẽ đến.", en: "Tomorrow he will come." },
    ],
    mistakes: [
      {
        wrong: "ฉันไปจะ",
        right: "ฉันจะไป",
        why_vi: "'จะ' luôn đứng trước động từ, không bao giờ sau.",
        why_en: "'จะ' always precedes the verb, never follows it.",
      },
    ],
  },
  {
    id: "thai_gram_completed_laeo",
    topic: "tense_time_markers",
    title_vi: "แล้ว (láeo) — đã hoàn thành, đứng sau động từ",
    title_en: "แล้ว (láeo) — completed, after the verb",
    explanation_vi:
      "'แล้ว' đứng SAU động từ (hoặc cuối câu) chỉ hành động đã xong: 'rồi/đã'. Giống 'rồi' tiếng Việt.",
    explanation_en:
      "'แล้ว' goes AFTER the verb (or sentence-final) to mark a completed action: 'already'. Like Vietnamese 'rồi'.",
    examples: [
      { th: "ฉันกินแล้ว", rtgs: "chǎn gin láeo", vi: "Tôi ăn rồi.", en: "I have eaten." },
      { th: "เขาไปแล้ว", rtgs: "kháo bpai láeo", vi: "Anh ấy đi rồi.", en: "He has gone." },
    ],
    mistakes: [
      {
        wrong: "ฉันแล้วกิน",
        right: "ฉันกินแล้ว",
        why_vi: "'แล้ว' chỉ thì đứng sau động từ. ('แล้ว' đầu câu nghĩa 'rồi thì…', khác.)",
        why_en: "Tense 'แล้ว' follows the verb. (Initial 'แล้ว' means 'and then…', a different use.)",
      },
    ],
  },
  {
    id: "thai_gram_time_words",
    topic: "tense_time_markers",
    title_vi: "Từ thời gian một mình đã đủ chỉ thì",
    title_en: "Time words alone can carry the tense",
    explanation_vi:
      "Khi đã có từ thời gian (เมื่อวาน, พรุ่งนี้, เมื่อกี้), thường KHÔNG cần thêm 'จะ/แล้ว'. Bối cảnh là thì.",
    explanation_en:
      "With a time word present (เมื่อวาน, พรุ่งนี้, เมื่อกี้), you usually DON'T need 'จะ/แล้ว' too. Context is the tense.",
    examples: [
      { th: "เมื่อวานฉันไปตลาด", rtgs: "mûea-waan chǎn bpai dtà-làat", vi: "Hôm qua tôi đi chợ.", en: "Yesterday I went to the market." },
      { th: "เมื่อกี้เขาโทรมา", rtgs: "mûea-gîi kháo thoo maa", vi: "Vừa nãy anh ấy gọi đến.", en: "He called just now." },
    ],
    mistakes: [
      {
        wrong: "เมื่อวานฉันจะไป (mâu thuẫn)",
        right: "เมื่อวานฉันไป",
        why_vi: "'เมื่อวาน' (quá khứ) đi với 'จะ' (tương lai) là mâu thuẫn. Bỏ 'จะ'.",
        why_en: "'เมื่อวาน' (past) clashes with 'จะ' (future). Drop the 'จะ'.",
      },
    ],
  },
  {
    id: "thai_gram_yang_mai",
    topic: "tense_time_markers",
    title_vi: "ยังไม่ (yang mâi) — vẫn chưa",
    title_en: "ยังไม่ (yang mâi) — not yet",
    explanation_vi:
      "'ยังไม่ + động từ' = 'vẫn chưa làm'. Thường thêm 'ได้': 'ยังไม่ได้กิน' = chưa ăn. Đối lập với 'แล้ว'.",
    explanation_en:
      "'ยังไม่ + verb' = 'haven't … yet'. Often with 'ได้': 'ยังไม่ได้กิน' = haven't eaten. The opposite of 'แล้ว'.",
    examples: [
      { th: "ฉันยังไม่ได้กิน", rtgs: "chǎn yang mâi dâai gin", vi: "Tôi vẫn chưa ăn.", en: "I haven't eaten yet." },
      { th: "เขายังไม่มา", rtgs: "kháo yang mâi maa", vi: "Anh ấy vẫn chưa đến.", en: "He hasn't come yet." },
    ],
    mistakes: [
      {
        wrong: "ฉันไม่กินแล้ว (để nói 'chưa ăn')",
        right: "ฉันยังไม่ได้กิน",
        why_vi: "'ไม่...แล้ว' nghĩa 'không... nữa', khác 'chưa'. Dùng 'ยังไม่ได้' cho 'chưa'.",
        why_en: "'ไม่…แล้ว' means 'not … anymore', not 'not yet'. Use 'ยังไม่ได้' for 'not yet'.",
      },
    ],
  },
  {
    id: "thai_gram_kamlang",
    topic: "tense_time_markers",
    title_vi: "กำลัง (gam-lang) — đang (diễn tiến)",
    title_en: "กำลัง (gam-lang) — ongoing 'be …ing'",
    explanation_vi:
      "'กำลัง + động từ (+ อยู่)' = 'đang làm'. 'กำลังกินอยู่' = đang ăn. Chỉ hành động đang diễn ra.",
    explanation_en:
      "'กำลัง + verb (+ อยู่)' = 'be …ing'. 'กำลังกินอยู่' = is eating. Marks an action in progress.",
    examples: [
      { th: "ฉันกำลังทำงาน", rtgs: "chǎn gam-lang tham-ngaan", vi: "Tôi đang làm việc.", en: "I am working." },
      { th: "ฝนกำลังตกอยู่", rtgs: "fǒn gam-lang dtòk yùu", vi: "Trời đang mưa.", en: "It is raining." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'กำลัง' cho thói quen lặp lại",
        right: "Bỏ 'กำลัง' khi nói thói quen: 'ฉันทำงานทุกวัน'",
        why_vi: "'กำลัง' chỉ việc đang xảy ra lúc này, không dùng cho thói quen.",
        why_en: "'กำลัง' is for right-now action, not for habits.",
      },
    ],
  },

  // ── particles ──────────────────────────────────────────────────────────────
  {
    id: "thai_gram_polite_particles",
    topic: "particles",
    title_vi: "ครับ / ค่ะ — tiểu từ lịch sự cuối câu",
    title_en: "ครับ / ค่ะ — sentence-final politeness particles",
    explanation_vi:
      "Nam dùng 'ครับ (khráp)', nữ dùng 'ค่ะ (khâ)' ở cuối câu để lịch sự. Nữ hỏi dùng 'คะ (khá)' (thanh cao).",
    explanation_en:
      "Men end with 'ครับ (khráp)', women with 'ค่ะ (khâ)' to be polite. Women's questions use 'คะ (khá)' (high tone).",
    examples: [
      { th: "ขอบคุณครับ", rtgs: "khàawp-khun khráp", vi: "Cảm ơn (nam nói).", en: "Thank you (male speaker)." },
      { th: "ไม่เป็นไรค่ะ", rtgs: "mâi bpen rai khâ", vi: "Không sao đâu (nữ nói).", en: "It's no problem (female speaker)." },
    ],
    mistakes: [
      {
        wrong: "Nam nói 'ค่ะ' / nữ nói 'ครับ'",
        right: "Nam: ครับ · Nữ: ค่ะ/คะ",
        why_vi: "Tiểu từ lịch sự theo giới tính NGƯỜI NÓI, không theo người nghe.",
        why_en: "The politeness particle matches the SPEAKER's gender, not the listener's.",
      },
    ],
  },
  {
    id: "thai_gram_question_mai",
    topic: "particles",
    title_vi: "ไหม (mái) — tiểu từ tạo câu hỏi Có/Không",
    title_en: "ไหม (mái) — yes/no question particle",
    explanation_vi:
      "Thêm 'ไหม' cuối câu khẳng định để biến thành câu hỏi Có/Không. 'อร่อยไหม' = ngon không?",
    explanation_en:
      "Add 'ไหม' to the end of a statement to make a yes/no question. 'อร่อยไหม' = is it tasty?",
    examples: [
      { th: "คุณหิวไหม", rtgs: "khun hǐu mái", vi: "Bạn đói không?", en: "Are you hungry?" },
      { th: "ไปด้วยกันไหม", rtgs: "bpai dûay-gan mái", vi: "Đi cùng không?", en: "Shall we go together?" },
    ],
    mistakes: [
      {
        wrong: "Đặt từ hỏi ở đầu như tiếng Anh",
        right: "Câu khẳng định + ไหม ở cuối",
        why_vi: "Tiếng Thái không đảo trật tự để hỏi; chỉ thêm 'ไหม' cuối câu.",
        why_en: "Thai doesn't invert word order for questions; just add 'ไหม' at the end.",
      },
    ],
  },
  {
    id: "thai_gram_na_particle",
    topic: "particles",
    title_vi: "นะ (ná) — làm câu mềm, thân thiện",
    title_en: "นะ (ná) — softening / friendly particle",
    explanation_vi:
      "'นะ' cuối câu làm lời nói dịu đi, gợi sự đồng tình hoặc nhắc nhẹ. 'ไปนะ' = đi nhé.",
    explanation_en:
      "Final 'นะ' softens a statement, inviting agreement or gently reminding. 'ไปนะ' = I'm off, ok?",
    examples: [
      { th: "ระวังนะ", rtgs: "rá-wang ná", vi: "Cẩn thận nhé.", en: "Be careful, ok?" },
      { th: "อร่อยนะ", rtgs: "à-ràauy ná", vi: "Ngon đấy nhỉ.", en: "It's tasty, isn't it." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'นะ' trong văn bản trang trọng",
        right: "Bỏ 'นะ' khi viết trang trọng",
        why_vi: "'นะ' là khẩu ngữ thân mật, không hợp văn viết trang trọng.",
        why_en: "'นะ' is casual/spoken; avoid it in formal writing.",
      },
    ],
  },
  {
    id: "thai_gram_la_question",
    topic: "particles",
    title_vi: "ล่ะ (lâ) — 'còn... thì sao?'",
    title_en: "ล่ะ (lâ) — 'and what about…?'",
    explanation_vi:
      "'ล่ะ' hỏi lại đối phương hoặc nối tiếp chủ đề: 'แล้วคุณล่ะ' = còn bạn thì sao?",
    explanation_en:
      "'ล่ะ' bounces a question back or continues a topic: 'แล้วคุณล่ะ' = and you?",
    examples: [
      { th: "แล้วคุณล่ะ", rtgs: "láeo khun lâ", vi: "Còn bạn thì sao?", en: "And how about you?" },
      { th: "ทำไมล่ะ", rtgs: "tham-mai lâ", vi: "Tại sao thế?", en: "Why is that?" },
    ],
    mistakes: [
      {
        wrong: "Lẫn 'ล่ะ' với 'แล้ว'",
        right: "'ล่ะ' = hỏi lại; 'แล้ว' = rồi/đã xong",
        why_vi: "Hai từ phát âm gần nhau nhưng chức năng khác hẳn.",
        why_en: "They sound similar but do completely different jobs.",
      },
    ],
  },

  // ── classifiers ────────────────────────────────────────────────────────────
  {
    id: "thai_gram_classifier_counting",
    topic: "classifiers",
    title_vi: "Đếm: Danh từ + Số + Loại từ",
    title_en: "Counting: Noun + Number + Classifier",
    explanation_vi:
      "Khi đếm, dùng mẫu Danh từ + Số + Loại từ: 'รถสองคัน' (xe hai chiếc). Loại từ đứng CUỐI.",
    explanation_en:
      "To count, use Noun + Number + Classifier: 'รถสองคัน' (car two CL). The classifier comes LAST.",
    examples: [
      { th: "หนังสือสามเล่ม", rtgs: "nǎng-sǔe sǎam lêm", vi: "ba quyển sách", en: "three books" },
      { th: "คนห้าคน", rtgs: "khon hâa khon", vi: "năm người", en: "five people" },
    ],
    mistakes: [
      {
        wrong: "รถสอง (thiếu loại từ)",
        right: "รถสองคัน",
        why_vi: "Đếm phải có loại từ. Không bỏ.",
        why_en: "Counting requires the classifier. Don't omit it.",
      },
    ],
  },
  {
    id: "thai_gram_classifier_demonstrative",
    topic: "classifiers",
    title_vi: "Chỉ trỏ: Danh từ + Loại từ + นี้/นั้น",
    title_en: "Demonstratives: Noun + Classifier + นี้/นั้น",
    explanation_vi:
      "'Cái này/kia' dùng mẫu Danh từ + Loại từ + นี้ (này)/นั้น (kia): 'รถคันนี้' = chiếc xe này.",
    explanation_en:
      "'This/that one' uses Noun + Classifier + นี้ (this)/นั้น (that): 'รถคันนี้' = this car.",
    examples: [
      { th: "เสื้อตัวนี้", rtgs: "sûea dtua níi", vi: "cái áo này", en: "this shirt" },
      { th: "บ้านหลังนั้น", rtgs: "bâan lǎng nán", vi: "ngôi nhà kia", en: "that house" },
    ],
    mistakes: [
      {
        wrong: "นี้รถ / รถนี้ (bỏ loại từ)",
        right: "รถคันนี้",
        why_vi: "Cần loại từ giữa danh từ và 'นี้/นั้น'.",
        why_en: "You need the classifier between the noun and 'นี้/นั้น'.",
      },
    ],
  },
  {
    id: "thai_gram_classifier_common",
    topic: "classifiers",
    title_vi: "Loại từ thường gặp",
    title_en: "Common classifiers",
    explanation_vi:
      "Học loại từ KÈM danh từ: คน (người), ตัว (động vật/áo quần), คัน (xe), เล่ม (sách), ใบ (giấy/đồ chứa), อัน (vật nhỏ chung).",
    explanation_en:
      "Learn the classifier WITH the noun: คน (people), ตัว (animals/clothes), คัน (vehicles), เล่ม (books), ใบ (paper/containers), อัน (general small objects).",
    examples: [
      { th: "แมวสองตัว", rtgs: "maaeo sǎawng dtua", vi: "hai con mèo", en: "two cats" },
      { th: "ตั๋วสามใบ", rtgs: "dtǔa sǎam bai", vi: "ba cái vé", en: "three tickets" },
    ],
    mistakes: [
      {
        wrong: "Dùng 'อัน' cho mọi thứ",
        right: "Dùng loại từ riêng khi biết (คน/ตัว/คัน…)",
        why_vi: "'อัน' chỉ là phương án chữa cháy cho vật nhỏ; loại từ đúng nghe tự nhiên hơn.",
        why_en: "'อัน' is only a fallback for small objects; the right classifier sounds far more natural.",
      },
    ],
  },

  // ── questions ──────────────────────────────────────────────────────────────
  {
    id: "thai_gram_wh_in_situ",
    topic: "questions",
    title_vi: "Từ hỏi đứng tại chỗ (không đảo lên đầu)",
    title_en: "Question words stay in place (no fronting)",
    explanation_vi:
      "Từ hỏi (อะไร gì, ที่ไหน ở đâu, ใคร ai, เมื่อไหร่ khi nào) đứng đúng vị trí thông tin cần hỏi, KHÔNG đảo lên đầu như tiếng Anh.",
    explanation_en:
      "Question words (อะไร what, ที่ไหน where, ใคร who, เมื่อไหร่ when) stay in the slot of the missing info — they are NOT fronted like English.",
    examples: [
      { th: "คุณกินอะไร", rtgs: "khun gin à-rai", vi: "Bạn ăn gì?", en: "What do you eat? (lit. you eat what)" },
      { th: "เขาอยู่ที่ไหน", rtgs: "kháo yùu thîi-nǎi", vi: "Anh ấy ở đâu?", en: "Where is he? (lit. he is where)" },
    ],
    mistakes: [
      {
        wrong: "อะไรคุณกิน",
        right: "คุณกินอะไร",
        why_vi: "Đừng đưa 'อะไร' lên đầu. Để nó ở vị trí tân ngữ.",
        why_en: "Don't move 'อะไร' to the front. Leave it in the object slot.",
      },
    ],
  },
  {
    id: "thai_gram_question_chai_mai",
    topic: "questions",
    title_vi: "ใช่ไหม (châi mái) — câu hỏi xác nhận 'phải không?'",
    title_en: "ใช่ไหม (châi mái) — tag question 'right?'",
    explanation_vi:
      "Thêm 'ใช่ไหม' cuối câu để xác nhận điều mình đoán: 'คุณเป็นคนไทยใช่ไหม' = bạn là người Thái phải không?",
    explanation_en:
      "Add 'ใช่ไหม' to confirm an assumption: 'คุณเป็นคนไทยใช่ไหม' = you're Thai, right?",
    examples: [
      { th: "อันนี้ของคุณใช่ไหม", rtgs: "an níi khǎawng khun châi mái", vi: "Cái này của bạn phải không?", en: "This is yours, right?" },
      { th: "เขามาแล้วใช่ไหม", rtgs: "kháo maa láeo châi mái", vi: "Anh ấy đến rồi phải không?", en: "He's here already, right?" },
    ],
    mistakes: [
      {
        wrong: "Lẫn 'ใช่ไหม' (xác nhận) với 'ไหม' (hỏi mới)",
        right: "'ไหม' hỏi mới; 'ใช่ไหม' xác nhận điều đã đoán",
        why_vi: "'ไหม' hỏi trung lập; 'ใช่ไหม' giả định câu trả lời là 'có'.",
        why_en: "'ไหม' is a neutral question; 'ใช่ไหม' assumes the answer is 'yes'.",
      },
    ],
  },
  {
    id: "thai_gram_answer_verb",
    topic: "questions",
    title_vi: "Trả lời Có/Không bằng cách lặp động từ",
    title_en: "Answer yes/no by echoing the verb",
    explanation_vi:
      "Không có 'yes/no' chung. Trả lời bằng cách lặp lại động từ (có) hoặc 'ไม่ + động từ' (không). 'ไป' / 'ไม่ไป'.",
    explanation_en:
      "There's no all-purpose yes/no. Answer by echoing the verb (yes) or 'ไม่ + verb' (no). 'ไป' / 'ไม่ไป'.",
    examples: [
      { th: "— หิวไหม — หิว", rtgs: "— hǐu mái — hǐu", vi: "— Đói không? — Đói.", en: "— Hungry? — Yes (hungry)." },
      { th: "— ไปไหม — ไม่ไป", rtgs: "— bpai mái — mâi bpai", vi: "— Đi không? — Không đi.", en: "— Going? — No (not going)." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'ใช่' cho mọi câu trả lời 'có'",
        right: "Lặp động từ: hỏi 'หิวไหม' → đáp 'หิว'",
        why_vi: "'ใช่' chỉ hợp khi câu hỏi dùng 'ใช่ไหม'. Câu hỏi 'ไหม' thường lặp động từ.",
        why_en: "'ใช่' fits only 'ใช่ไหม' questions. For 'ไหม' questions, echo the verb.",
      },
    ],
  },

  // ── negation ───────────────────────────────────────────────────────────────
  {
    id: "thai_gram_negation_mai",
    topic: "negation",
    title_vi: "ไม่ (mâi) — phủ định, đứng trước động từ/tính từ",
    title_en: "ไม่ (mâi) — negation, before verb/adjective",
    explanation_vi:
      "'ไม่' đứng NGAY TRƯỚC động từ hoặc tính từ: 'ไม่ไป' (không đi), 'ไม่อร่อย' (không ngon).",
    explanation_en:
      "'ไม่' goes DIRECTLY BEFORE a verb or adjective: 'ไม่ไป' (not go), 'ไม่อร่อย' (not tasty).",
    examples: [
      { th: "ฉันไม่เข้าใจ", rtgs: "chǎn mâi khâo-jai", vi: "Tôi không hiểu.", en: "I don't understand." },
      { th: "วันนี้ไม่ร้อน", rtgs: "wan-níi mâi ráawn", vi: "Hôm nay không nóng.", en: "Today is not hot." },
    ],
    mistakes: [
      {
        wrong: "เข้าใจไม่",
        right: "ไม่เข้าใจ",
        why_vi: "'ไม่' luôn đứng trước từ bị phủ định, không bao giờ sau.",
        why_en: "'ไม่' always precedes what it negates, never follows.",
      },
    ],
  },
  {
    id: "thai_gram_negation_mai_chai",
    topic: "negation",
    title_vi: "ไม่ใช่ (mâi châi) — phủ định danh từ ('không phải')",
    title_en: "ไม่ใช่ (mâi châi) — negating a noun ('is not')",
    explanation_vi:
      "Để phủ định DANH TỪ/danh tính, dùng 'ไม่ใช่' chứ không phải 'ไม่': 'ไม่ใช่ครู' = không phải giáo viên.",
    explanation_en:
      "To negate a NOUN/identity, use 'ไม่ใช่', not plain 'ไม่': 'ไม่ใช่ครู' = is not a teacher.",
    examples: [
      { th: "นี่ไม่ใช่ของฉัน", rtgs: "nîi mâi châi khǎawng chǎn", vi: "Cái này không phải của tôi.", en: "This is not mine." },
      { th: "เขาไม่ใช่คนไทย", rtgs: "kháo mâi châi khon thai", vi: "Anh ấy không phải người Thái.", en: "He is not Thai." },
    ],
    mistakes: [
      {
        wrong: "เขาไม่ครู",
        right: "เขาไม่ใช่ครู",
        why_vi: "Phủ định danh từ cần 'ไม่ใช่', không dùng 'ไม่' trơn.",
        why_en: "Negating a noun needs 'ไม่ใช่', not bare 'ไม่'.",
      },
    ],
  },
  {
    id: "thai_gram_negation_haam",
    topic: "negation",
    title_vi: "ห้าม (hâam) — cấm; อย่า (yàa) — đừng",
    title_en: "ห้าม (hâam) — forbidden; อย่า (yàa) — don't",
    explanation_vi:
      "Cấm/khuyên đừng: 'ห้าม + động từ' = cấm; 'อย่า + động từ' = đừng. 'ห้ามจอด' = cấm đỗ, 'อย่าไป' = đừng đi.",
    explanation_en:
      "Prohibition/advice: 'ห้าม + verb' = forbidden to; 'อย่า + verb' = don't. 'ห้ามจอด' = no parking, 'อย่าไป' = don't go.",
    examples: [
      { th: "ห้ามสูบบุหรี่", rtgs: "hâam sùup bù-rìi", vi: "Cấm hút thuốc.", en: "No smoking." },
      { th: "อย่าลืมนะ", rtgs: "yàa luem ná", vi: "Đừng quên nhé.", en: "Don't forget, ok?" },
    ],
    mistakes: [
      {
        wrong: "ไม่ไป (để ra lệnh 'đừng đi')",
        right: "อย่าไป",
        why_vi: "'ไม่ไป' = 'không đi' (mô tả). Mệnh lệnh 'đừng' dùng 'อย่า'.",
        why_en: "'ไม่ไป' = 'not going' (describing). For the command 'don't', use 'อย่า'.",
      },
    ],
  },

  // ── pronouns ───────────────────────────────────────────────────────────────
  {
    id: "thai_gram_pronouns_basic",
    topic: "pronouns",
    title_vi: "Đại từ cơ bản và sắc thái",
    title_en: "Basic pronouns and their nuance",
    explanation_vi:
      "'ผม' (tôi – nam), 'ฉัน/ดิฉัน' (tôi – nữ), 'คุณ' (bạn – lịch sự), 'เขา' (anh/cô ấy). Đại từ chọn theo giới tính và mức trang trọng.",
    explanation_en:
      "'ผม' (I – male), 'ฉัน/ดิฉัน' (I – female), 'คุณ' (you – polite), 'เขา' (he/she). Pronoun choice depends on gender and formality.",
    examples: [
      { th: "ผมชื่อสมชาย", rtgs: "phǒm chûe sǒm-chaai", vi: "Tôi tên Somchai. (nam)", en: "My name is Somchai. (male)" },
      { th: "คุณสบายดีไหม", rtgs: "khun sà-baai dii mái", vi: "Bạn khỏe không?", en: "How are you?" },
    ],
    mistakes: [
      {
        wrong: "Nam tự xưng 'ฉัน' trong ngữ cảnh trang trọng",
        right: "Nam dùng 'ผม' (trang trọng)",
        why_vi: "'ฉัน' nam dùng nghe suồng sã/nữ tính ở ngữ cảnh trang trọng; nên dùng 'ผม'.",
        why_en: "A man using 'ฉัน' sounds casual/feminine in formal contexts; use 'ผม'.",
      },
    ],
  },
  {
    id: "thai_gram_pronoun_drop",
    topic: "pronouns",
    title_vi: "Lược bỏ đại từ khi đã rõ ngữ cảnh",
    title_en: "Pronoun-dropping when context is clear",
    explanation_vi:
      "Tiếng Thái thường BỎ chủ ngữ/đại từ nếu ngữ cảnh đã rõ. 'ไปไหน' (đi đâu?) không cần 'คุณ'.",
    explanation_en:
      "Thai freely DROPS the subject/pronoun when context is clear. 'ไปไหน' (where to?) needs no 'คุณ'.",
    examples: [
      { th: "ไปไหนมา", rtgs: "bpai nǎi maa", vi: "(Bạn) vừa đi đâu về?", en: "Where have (you) been?" },
      { th: "กินข้าวหรือยัง", rtgs: "gin khâao rǔe yang", vi: "(Bạn) ăn cơm chưa?", en: "Have (you) eaten yet?" },
    ],
    mistakes: [
      {
        wrong: "Lặp 'คุณ/ฉัน' ở mọi câu",
        right: "Bỏ đại từ khi ngữ cảnh đã rõ",
        why_vi: "Lặp đại từ liên tục nghe cứng nhắc, không tự nhiên.",
        why_en: "Repeating pronouns every clause sounds stiff and unnatural.",
      },
    ],
  },
  {
    id: "thai_gram_kin_terms",
    topic: "pronouns",
    title_vi: "Dùng từ thân tộc thay đại từ (พี่/น้อง)",
    title_en: "Kinship terms used as pronouns (พี่/น้อง)",
    explanation_vi:
      "Người Thái hay dùng 'พี่' (anh/chị – lớn tuổi hơn), 'น้อง' (em) thay cho 'bạn/tôi', cả với người ngoài gia đình, để thân thiện và tôn trọng tuổi tác.",
    explanation_en:
      "Thais often use 'พี่' (older sibling) and 'น้อง' (younger) instead of 'you/I', even with non-family, to be friendly and respect age.",
    examples: [
      { th: "พี่ไปไหนคะ", rtgs: "phîi bpai nǎi khá", vi: "Anh/chị đi đâu đấy?", en: "Where are you going? (to someone older)" },
      { th: "น้องชื่ออะไร", rtgs: "náawng chûe à-rai", vi: "Em tên gì?", en: "What's your name? (to someone younger)" },
    ],
    mistakes: [
      {
        wrong: "Luôn dùng 'คุณ' với người thân quen lớn tuổi",
        right: "Dùng 'พี่' với người lớn tuổi để thân thiện",
        why_vi: "'คุณ' đúng nhưng xa cách; 'พี่' ấm áp và tôn trọng hơn trong giao tiếp đời thường.",
        why_en: "'คุณ' is correct but distant; 'พี่' is warmer and respectful in everyday talk.",
      },
    ],
  },

  // ── politeness ─────────────────────────────────────────────────────────────
  {
    id: "thai_gram_polite_khaaw",
    topic: "politeness",
    title_vi: "ขอ (khǎaw) — xin/cho, mở đầu yêu cầu lịch sự",
    title_en: "ขอ (khǎaw) — polite request opener 'may I have'",
    explanation_vi:
      "'ขอ + [thứ cần]' = xin/cho tôi... Thêm 'หน่อย' hoặc 'ได้ไหม' để mềm hơn. 'ขอน้ำหน่อย' = cho xin nước.",
    explanation_en:
      "'ขอ + [thing]' = may I have… Add 'หน่อย' or 'ได้ไหม' to soften. 'ขอน้ำหน่อย' = some water, please.",
    examples: [
      { th: "ขอเมนูหน่อยครับ", rtgs: "khǎaw mee-nuu nàauy khráp", vi: "Cho xin thực đơn ạ.", en: "May I have the menu?" },
      { th: "ขอโทษครับ", rtgs: "khǎaw-thôot khráp", vi: "Xin lỗi ạ.", en: "Excuse me / sorry." },
    ],
    mistakes: [
      {
        wrong: "Ra lệnh trực tiếp: 'เอาน้ำ'",
        right: "ขอน้ำหน่อย (lịch sự)",
        why_vi: "'เอา' nghe như ra lệnh; 'ขอ...หน่อย' lịch sự hơn nhiều.",
        why_en: "'เอา' sounds like an order; 'ขอ…หน่อย' is much more polite.",
      },
    ],
  },
  {
    id: "thai_gram_polite_daai_mai",
    topic: "politeness",
    title_vi: "...ได้ไหม (dâai mái) — '... được không?'",
    title_en: "…ได้ไหม (dâai mái) — '…may I / could you?'",
    explanation_vi:
      "Khung lịch sự vạn năng: '[động từ] + ได้ไหม' = '... được không?'. 'ช่วยได้ไหม' = giúp được không?",
    explanation_en:
      "All-purpose polite frame: '[verb] + ได้ไหม' = '…is that OK / could you?'. 'ช่วยได้ไหม' = could you help?",
    examples: [
      { th: "ถ่ายรูปได้ไหม", rtgs: "thàai rûup dâai mái", vi: "Chụp ảnh được không?", en: "May I take a photo?" },
      { th: "พูดช้าๆได้ไหม", rtgs: "phûut cháa-cháa dâai mái", vi: "Nói chậm được không?", en: "Could you speak slowly?" },
    ],
    mistakes: [
      {
        wrong: "Bỏ '...ไหม' khiến câu thành ra lệnh",
        right: "Thêm 'ได้ไหม' để thành câu hỏi lịch sự",
        why_vi: "Không có 'ไหม', câu nghe như mệnh lệnh.",
        why_en: "Without 'ไหม', it reads as a command.",
      },
    ],
  },
  {
    id: "thai_gram_krap_ka_register",
    topic: "politeness",
    title_vi: "Thêm ครับ/ค่ะ để nâng mức lịch sự",
    title_en: "Add ครับ/ค่ะ to raise the register",
    explanation_vi:
      "Trong giao tiếp với người lạ, người trên, hay nơi công cộng, kết câu bằng 'ครับ/ค่ะ' là chuẩn mực tối thiểu của sự lịch sự.",
    explanation_en:
      "With strangers, superiors, or in public, ending with 'ครับ/ค่ะ' is the minimum baseline of politeness.",
    examples: [
      { th: "ไม่เป็นไรครับ", rtgs: "mâi bpen rai khráp", vi: "Không sao ạ. (nam)", en: "It's fine. (male)" },
      { th: "เชิญค่ะ", rtgs: "chern khâ", vi: "Mời ạ. (nữ)", en: "Please, go ahead. (female)" },
    ],
    mistakes: [
      {
        wrong: "Bỏ tiểu từ lịch sự với người lạ/người trên",
        right: "Luôn thêm 'ครับ/ค่ะ' trong ngữ cảnh trang trọng",
        why_vi: "Thiếu tiểu từ lịch sự dễ bị xem là cộc lốc, bất lịch sự.",
        why_en: "Omitting it can come across as blunt or rude.",
      },
    ],
  },

  // ── comparison ─────────────────────────────────────────────────────────────
  {
    id: "thai_gram_comparative",
    topic: "comparison",
    title_vi: "So sánh hơn: tính từ + กว่า (gwàa)",
    title_en: "Comparative: adjective + กว่า (gwàa)",
    explanation_vi:
      "So sánh hơn = 'tính từ + กว่า + đối tượng'. 'ใหญ่กว่า' = to hơn. KHÔNG có từ 'more' riêng như tiếng Anh.",
    explanation_en:
      "Comparative = 'adjective + กว่า + reference'. 'ใหญ่กว่า' = bigger. There is NO separate 'more'.",
    examples: [
      { th: "อันนี้ถูกกว่า", rtgs: "an níi thùuk gwàa", vi: "Cái này rẻ hơn.", en: "This one is cheaper." },
      { th: "เขาสูงกว่าฉัน", rtgs: "kháo sǔung gwàa chǎn", vi: "Anh ấy cao hơn tôi.", en: "He is taller than me." },
    ],
    mistakes: [
      {
        wrong: "มากกว่าใหญ่ / ใหญ่มากกว่า",
        right: "ใหญ่กว่า",
        why_vi: "Chỉ cần 'tính từ + กว่า'. Đừng thêm 'มาก'.",
        why_en: "Just 'adjective + กว่า'. Don't add 'มาก'.",
      },
    ],
  },
  {
    id: "thai_gram_superlative",
    topic: "comparison",
    title_vi: "So sánh nhất: tính từ + ที่สุด (thîi-sùt)",
    title_en: "Superlative: adjective + ที่สุด (thîi-sùt)",
    explanation_vi:
      "So sánh nhất = 'tính từ + ที่สุด'. 'ดีที่สุด' = tốt nhất, 'แพงที่สุด' = đắt nhất.",
    explanation_en:
      "Superlative = 'adjective + ที่สุด'. 'ดีที่สุด' = best, 'แพงที่สุด' = most expensive.",
    examples: [
      { th: "ร้านนี้อร่อยที่สุด", rtgs: "ráan níi à-ràauy thîi-sùt", vi: "Quán này ngon nhất.", en: "This shop is the tastiest." },
      { th: "วันนี้ร้อนที่สุด", rtgs: "wan-níi ráawn thîi-sùt", vi: "Hôm nay nóng nhất.", en: "Today is the hottest." },
    ],
    mistakes: [
      {
        wrong: "ที่สุดดี",
        right: "ดีที่สุด",
        why_vi: "'ที่สุด' đứng SAU tính từ, không đứng trước.",
        why_en: "'ที่สุด' follows the adjective, it does not precede it.",
      },
    ],
  },
  {
    id: "thai_gram_equal_comparison",
    topic: "comparison",
    title_vi: "So sánh bằng: เท่ากับ / เหมือนกัน",
    title_en: "Equality: เท่ากับ / เหมือนกัน",
    explanation_vi:
      "Bằng nhau: 'A เท่ากับ B' (bằng) hoặc 'A กับ B เหมือนกัน' (giống nhau). 'สูงเท่ากัน' = cao bằng nhau.",
    explanation_en:
      "Equality: 'A เท่ากับ B' (equal to) or 'A กับ B เหมือนกัน' (the same). 'สูงเท่ากัน' = equally tall.",
    examples: [
      { th: "ราคาเท่ากัน", rtgs: "raa-khaa thâo-gan", vi: "Giá bằng nhau.", en: "The prices are the same." },
      { th: "เขาสองคนสูงเท่ากัน", rtgs: "kháo sǎawng khon sǔung thâo-gan", vi: "Hai người cao bằng nhau.", en: "The two are equally tall." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'กว่า' để nói bằng nhau",
        right: "Dùng 'เท่ากัน/เท่ากับ' cho ý bằng nhau",
        why_vi: "'กว่า' là hơn-kém; bằng nhau phải dùng 'เท่ากัน'.",
        why_en: "'กว่า' is for more/less; equality needs 'เท่ากัน'.",
      },
    ],
  },

  // ── aspect ─────────────────────────────────────────────────────────────────
  {
    id: "thai_gram_yuu_continuous",
    topic: "aspect",
    title_vi: "อยู่ (yùu) cuối câu — trạng thái đang tiếp diễn",
    title_en: "Sentence-final อยู่ (yùu) — ongoing state",
    explanation_vi:
      "'อยู่' cuối câu nhấn rằng hành động/trạng thái đang tiếp diễn: 'รออยู่' = đang đợi. Hay đi cùng 'กำลัง'.",
    explanation_en:
      "Final 'อยู่' stresses an ongoing action/state: 'รออยู่' = is waiting. Often pairs with 'กำลัง'.",
    examples: [
      { th: "เขานอนอยู่", rtgs: "kháo naawn yùu", vi: "Anh ấy đang ngủ.", en: "He is sleeping." },
      { th: "ฉันกำลังคิดอยู่", rtgs: "chǎn gam-lang khít yùu", vi: "Tôi đang suy nghĩ.", en: "I am thinking." },
    ],
    mistakes: [
      {
        wrong: "Hiểu 'อยู่' chỉ là 'ở/sống'",
        right: "'อยู่' còn là dấu hiệu trạng thái tiếp diễn cuối câu",
        why_vi: "'อยู่' có hai vai trò: động từ 'ở' và dấu khía cạnh tiếp diễn.",
        why_en: "'อยู่' has two roles: the verb 'to be located' and a continuous-aspect marker.",
      },
    ],
  },
  {
    id: "thai_gram_experiential_koei",
    topic: "aspect",
    title_vi: "เคย (khoei) — đã từng (kinh nghiệm)",
    title_en: "เคย (khoei) — 'have ever / used to'",
    explanation_vi:
      "'เคย + động từ' = đã từng làm (kinh nghiệm trong đời). 'เคยไปญี่ปุ่น' = đã từng đi Nhật. Phủ định: 'ไม่เคย' = chưa từng.",
    explanation_en:
      "'เคย + verb' = have ever done / used to (life experience). 'เคยไปญี่ปุ่น' = have been to Japan. Negative 'ไม่เคย' = never.",
    examples: [
      { th: "ฉันเคยกินทุเรียน", rtgs: "chǎn khoei gin thú-rian", vi: "Tôi đã từng ăn sầu riêng.", en: "I have eaten durian before." },
      { th: "เขาไม่เคยมาที่นี่", rtgs: "kháo mâi khoei maa thîi-nîi", vi: "Anh ấy chưa từng đến đây.", en: "He has never been here." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'แล้ว' để nói 'đã từng'",
        right: "Dùng 'เคย' cho kinh nghiệm; 'แล้ว' chỉ 'đã xong'",
        why_vi: "'แล้ว' = hoàn thành một việc cụ thể; 'เคย' = từng có kinh nghiệm.",
        why_en: "'แล้ว' = a specific completed action; 'เคย' = past experience ('ever').",
      },
    ],
  },
  {
    id: "thai_gram_resultative_daai",
    topic: "aspect",
    title_vi: "ได้ (dâai) — khả năng / hoàn thành được",
    title_en: "ได้ (dâai) — ability / managed to",
    explanation_vi:
      "'động từ + ได้' = làm được/có thể: 'พูดได้' = nói được. 'ได้ + động từ' (trước) = đã có dịp làm. Vị trí của 'ได้' đổi nghĩa.",
    explanation_en:
      "'verb + ได้' = can/able to: 'พูดได้' = can speak. 'ได้ + verb' (before) = got to do. The position of 'ได้' shifts the meaning.",
    examples: [
      { th: "ฉันว่ายน้ำได้", rtgs: "chǎn wâai-náam dâai", vi: "Tôi biết bơi.", en: "I can swim." },
      { th: "เมื่อวานได้เจอเขา", rtgs: "mûea-waan dâai jeu kháo", vi: "Hôm qua (đã) gặp được anh ấy.", en: "Yesterday I got to meet him." },
    ],
    mistakes: [
      {
        wrong: "Coi 'ได้' luôn là dấu quá khứ",
        right: "'động từ + ได้' = khả năng; vị trí quyết định nghĩa",
        why_vi: "'ได้' không phải dấu quá khứ chung; nghĩa phụ thuộc vị trí.",
        why_en: "'ได้' is not a general past marker; meaning depends on position.",
      },
    ],
  },

  // ── sentence_linking ───────────────────────────────────────────────────────
  {
    id: "thai_gram_link_laeo_lae",
    topic: "sentence_linking",
    title_vi: "Nối ý: และ (và), แล้ว (rồi), กับ (với)",
    title_en: "Linking: และ (and), แล้ว (then), กับ (with)",
    explanation_vi:
      "'และ (láe)' nối danh từ/ý ngang hàng (văn viết); 'แล้ว (láeo)' nối hành động theo trình tự (rồi); 'กับ (gàp)' nối hai danh từ (với/cùng).",
    explanation_en:
      "'และ (láe)' joins equal nouns/ideas (more written); 'แล้ว (láeo)' chains actions in sequence (then); 'กับ (gàp)' joins two nouns (with).",
    examples: [
      { th: "ฉันกินข้าวแล้วไปทำงาน", rtgs: "chǎn gin khâao láeo bpai tham-ngaan", vi: "Tôi ăn cơm rồi đi làm.", en: "I eat, then go to work." },
      { th: "ฉันกับเพื่อน", rtgs: "chǎn gàp phûean", vi: "Tôi với bạn.", en: "Me and my friend." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'และ' để nối hai hành động liên tiếp",
        right: "Dùng 'แล้ว' cho trình tự hành động",
        why_vi: "'และ' nối danh từ/ý; chuỗi hành động 'làm A rồi B' dùng 'แล้ว'.",
        why_en: "'และ' links nouns/ideas; for 'do A then B' use 'แล้ว'.",
      },
    ],
  },
  {
    id: "thai_gram_link_contrast",
    topic: "sentence_linking",
    title_vi: "Tương phản & nguyên nhân: แต่, เพราะ, ดังนั้น",
    title_en: "Contrast & cause: แต่, เพราะ, ดังนั้น",
    explanation_vi:
      "'แต่ (dtàae)' = nhưng; 'เพราะ (phráw)' = vì; 'ดังนั้น (dang-nán)' = vì vậy (kết luận). Đặt đầu mệnh đề liên quan.",
    explanation_en:
      "'แต่ (dtàae)' = but; 'เพราะ (phráw)' = because; 'ดังนั้น (dang-nán)' = therefore. Place at the start of the relevant clause.",
    examples: [
      { th: "อร่อยแต่แพง", rtgs: "à-ràauy dtàae phaaeng", vi: "Ngon nhưng đắt.", en: "Tasty but expensive." },
      { th: "ฝนตกดังนั้นฉันอยู่บ้าน", rtgs: "fǒn dtòk dang-nán chǎn yùu bâan", vi: "Trời mưa nên tôi ở nhà.", en: "It rained, so I stayed home." },
    ],
    mistakes: [
      {
        wrong: "Lẫn 'เพราะ' (vì) với 'ดังนั้น' (vì vậy)",
        right: "'เพราะ' nêu nguyên nhân; 'ดังนั้น' nêu kết quả",
        why_vi: "'เพราะ + nguyên nhân'; 'ดังนั้น + kết quả'. Đảo ngược là sai logic.",
        why_en: "'เพราะ + cause'; 'ดังนั้น + result'. Swapping them breaks the logic.",
      },
    ],
  },
  {
    id: "thai_gram_link_conditional",
    topic: "sentence_linking",
    title_vi: "Câu điều kiện: ถ้า... (ก็)จะ...",
    title_en: "Conditionals: ถ้า… (ก็)จะ…",
    explanation_vi:
      "'ถ้า (thâa) + điều kiện, (ก็)จะ + kết quả' = nếu... thì sẽ. 'ก็ (gâaw)' nối nhẹ trước mệnh đề kết quả.",
    explanation_en:
      "'ถ้า (thâa) + condition, (ก็)จะ + result' = if … then will. 'ก็ (gâaw)' softly links into the result clause.",
    examples: [
      { th: "ถ้าฝนตกฉันจะไม่ไป", rtgs: "thâa fǒn dtòk chǎn jà mâi bpai", vi: "Nếu trời mưa tôi sẽ không đi.", en: "If it rains I won't go." },
      { th: "ถ้าว่างก็โทรมานะ", rtgs: "thâa wâang gâaw thoo maa ná", vi: "Nếu rảnh thì gọi nhé.", en: "If you're free, call me, ok?" },
    ],
    mistakes: [
      {
        wrong: "Bỏ 'จะ' ở mệnh đề kết quả tương lai",
        right: "Giữ 'จะ' cho kết quả mang tính tương lai",
        why_vi: "Kết quả chưa xảy ra thường cần 'จะ' để rõ tính tương lai.",
        why_en: "A future result usually needs 'จะ' to mark it as future.",
      },
    ],
  },
  {
    id: "thai_gram_link_relative_thii",
    topic: "sentence_linking",
    title_vi: "Mệnh đề quan hệ với ที่ (thîi)",
    title_en: "Relative clauses with ที่ (thîi)",
    explanation_vi:
      "'ที่' nối mệnh đề bổ nghĩa cho danh từ, như 'mà/người mà/cái mà': 'คนที่พูดภาษาไทย' = người (mà) nói tiếng Thái.",
    explanation_en:
      "'ที่' introduces a clause modifying a noun, like 'who/that/which': 'คนที่พูดภาษาไทย' = the person who speaks Thai.",
    examples: [
      { th: "หนังสือที่ฉันซื้อ", rtgs: "nǎng-sǔe thîi chǎn súe", vi: "quyển sách (mà) tôi mua", en: "the book that I bought" },
      { th: "ร้านที่อยู่ใกล้บ้าน", rtgs: "ráan thîi yùu glâi bâan", vi: "cửa hàng ở gần nhà", en: "the shop that is near the house" },
    ],
    mistakes: [
      {
        wrong: "Bỏ 'ที่' khi nối mệnh đề bổ nghĩa",
        right: "Dùng 'ที่' nối danh từ với mệnh đề mô tả",
        why_vi: "Không có 'ที่', hai mệnh đề dính nhau khó hiểu.",
        why_en: "Without 'ที่', the two clauses run together unclearly.",
      },
    ],
  },
  {
    id: "thai_gram_link_phuea",
    topic: "sentence_linking",
    title_vi: "Mục đích với เพื่อ (phûea) — 'để'",
    title_en: "Purpose with เพื่อ (phûea) — 'in order to'",
    explanation_vi:
      "'เพื่อ + động từ/mục đích' = 'để'. 'ฉันออมเงินเพื่อซื้อบ้าน' = tôi để dành tiền để mua nhà.",
    explanation_en:
      "'เพื่อ + verb/goal' = 'in order to / for'. 'ฉันออมเงินเพื่อซื้อบ้าน' = I save money to buy a house.",
    examples: [
      { th: "เรียนหนักเพื่ออนาคต", rtgs: "rian nàk phûea à-naa-khót", vi: "Học chăm để có tương lai.", en: "Study hard for the future." },
      { th: "มาเร็วเพื่อจองที่", rtgs: "maa reo phûea jaawng thîi", vi: "Đến sớm để giữ chỗ.", en: "Come early to reserve a seat." },
    ],
    mistakes: [
      {
        wrong: "Dùng 'สำหรับ' (cho) thay 'เพื่อ' (để) trước động từ",
        right: "'เพื่อ + động từ' chỉ mục đích; 'สำหรับ + danh từ'",
        why_vi: "'สำหรับ' đi với danh từ; mục đích hành động dùng 'เพื่อ'.",
        why_en: "'สำหรับ' takes a noun; for a purpose-verb use 'เพื่อ'.",
      },
    ],
  },
];

export default notes;
