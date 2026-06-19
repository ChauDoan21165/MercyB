// src/languages/thai/errorPatterns.ts
//
// Thai learner error patterns — a compact correction bank for the two L1
// audiences MercyBlade serves: Vietnamese speakers (`vi`) and English speakers
// (`en`). Some traps hit both groups (`both`).
//
// Each entry pairs a WRONG and a CORRECT Thai sentence (Thai script +
// romanization), an English gloss of the intended meaning, a Vietnamese
// explanation, an English explanation, and a short fix strategy. The data is
// authored to be rendered as a study/correction checklist; it is self-contained
// (no imports) so it can be consumed before the wider Thai lesson registry
// lands.
//
// Topics covered: particles, pronouns, word order, classifiers, tense/aspect
// particles, politeness level, question particles, negation, tone-awareness
// warnings, and over-literal translation.
//
// Romanization uses tone diacritics so tonal contrasts are visible:
//   mid = plain (a) · low = à · falling = â · high = á · rising = ǎ
// Vowel length is shown by doubling the vowel (aa = long).
//
// NATIVE REVIEW DEFERRED. This bank has NOT been checked by a native Thai
// speaker — treat the corrections as a teaching draft, not a final authority.

export type ThaiErrorAudience = "vi" | "en" | "both";

export type ThaiErrorCategory =
  | "particles"
  | "pronouns"
  | "word-order"
  | "classifiers"
  | "tense-aspect"
  | "politeness"
  | "question-particles"
  | "negation"
  | "tone-awareness"
  | "over-literal";

export interface ThaiErrorPattern {
  /** Stable kebab-case id, unique across the bank. */
  id: string;
  /** Which grammar/usage topic this trap belongs to. */
  category: ThaiErrorCategory;
  /** L1 group most at risk: Vietnamese, English, or both. */
  audience: ThaiErrorAudience;
  /** The mistake, in Thai script. */
  wrong: string;
  /** Romanization of the wrong form (tone-marked). */
  wrongRoman: string;
  /** The corrected form, in Thai script. */
  correct: string;
  /** Romanization of the correct form (tone-marked). */
  correctRoman: string;
  /** What the learner is trying to say, in English. */
  gloss_en: string;
  /** Vietnamese explanation of why the mistake happens / the rule. */
  explanation_vi: string;
  /** English explanation of why the mistake happens / the rule. */
  explanation_en: string;
  /** Short, actionable fix strategy (English). */
  fix: string;
}

/** All valid category tags (handy for UI filters and tests). */
export const THAI_ERROR_CATEGORIES: readonly ThaiErrorCategory[] = [
  "particles",
  "pronouns",
  "word-order",
  "classifiers",
  "tense-aspect",
  "politeness",
  "question-particles",
  "negation",
  "tone-awareness",
  "over-literal",
] as const;

/** All valid audience tags. */
export const THAI_ERROR_AUDIENCES: readonly ThaiErrorAudience[] = [
  "vi",
  "en",
  "both",
] as const;

export const thaiErrorPatterns: ThaiErrorPattern[] = [
  // ───────────────────────── classifiers (ลักษณนาม) ─────────────────────────
  {
    id: "clf-number-order",
    category: "classifiers",
    audience: "both",
    wrong: "สองหนังสือ",
    wrongRoman: "sɔ̌ɔng nǎng-sʉ̌ʉ",
    correct: "หนังสือสองเล่ม",
    correctRoman: "nǎng-sʉ̌ʉ sɔ̌ɔng lêm",
    gloss_en: "two books",
    explanation_vi:
      "Thứ tự tiếng Thái là DANH TỪ + SỐ + LƯỢNG TỪ (หนังสือ + สอง + เล่ม). Tiếng Việt nói 'hai quyển sách' (số + lượng từ + danh từ) nên người Việt hay đảo sai; tiếng Anh thì thường quên hẳn lượng từ.",
    explanation_en:
      "Thai counts as NOUN + NUMBER + CLASSIFIER (หนังสือ + สอง + เล่ม). You cannot say the number directly before the noun the way English does ('two books').",
    fix: "Memorize the frame noun → number → classifier; never put the number first.",
  },
  {
    id: "clf-wrong-classifier-people",
    category: "classifiers",
    audience: "both",
    wrong: "นักเรียนสามตัว",
    wrongRoman: "nák-rian sǎam tua",
    correct: "นักเรียนสามคน",
    correctRoman: "nák-rian sǎam khon",
    gloss_en: "three students",
    explanation_vi:
      "Mỗi loại danh từ có lượng từ riêng. Người dùng คน, động vật dùng ตัว. Dùng ตัว cho người là lỗi nặng (nghe như coi người là con vật).",
    explanation_en:
      "Each noun class takes its own classifier. People take คน (khon); animals/objects take ตัว (tua). Using ตัว for people is offensive — it sounds like counting animals.",
    fix: "Learn the classifier together with each noun, like a noun's gender.",
  },
  {
    id: "clf-this-that-needs-classifier",
    category: "classifiers",
    audience: "en",
    wrong: "รถนี้",
    wrongRoman: "rót níi",
    correct: "รถคันนี้",
    correctRoman: "rót khan níi",
    gloss_en: "this car",
    explanation_vi:
      "'Cái này / chiếc này' trong tiếng Thái chuẩn là DANH TỪ + LƯỢNG TỪ + นี้/นั้น (รถ + คัน + นี้). Bỏ lượng từ คัน nghe cụt và không tự nhiên.",
    explanation_en:
      "'This/that X' is standardly NOUN + CLASSIFIER + นี้/นั้น (รถ + คัน + นี้). Dropping the classifier before นี้/นั้น sounds clipped and non-standard.",
    fix: "Slot the classifier between the noun and นี้ (this) / นั้น (that).",
  },
  {
    id: "clf-one-cup-order",
    category: "classifiers",
    audience: "vi",
    wrong: "หนึ่งแก้วกาแฟ",
    wrongRoman: "nʉ̀ng kɛ̂ɛw kaa-fɛɛ",
    correct: "กาแฟแก้วหนึ่ง",
    correctRoman: "kaa-fɛɛ kɛ̂ɛw nʉ̀ng",
    gloss_en: "one cup of coffee / a coffee",
    explanation_vi:
      "Tiếng Việt: 'một ly cà phê' (số + lượng từ + danh từ). Tiếng Thái đảo lại: กาแฟ (cà phê) + แก้ว (ly) + หนึ่ง (một). Với 'một', đặt หนึ่ง ở CUỐI nghe tự nhiên hơn.",
    explanation_en:
      "Thai puts the noun first: กาแฟ (coffee) + แก้ว (cup/glass) + หนึ่ง (one). For 'a/one', trailing หนึ่ง after the classifier is the natural order.",
    fix: "Say the thing, then its measure, then the number.",
  },
  {
    id: "clf-which-one",
    category: "classifiers",
    audience: "both",
    wrong: "ไหนรถ",
    wrongRoman: "nǎi rót",
    correct: "รถคันไหน",
    correctRoman: "rót khan nǎi",
    gloss_en: "which car?",
    explanation_vi:
      "'Cái nào' cũng theo khung DANH TỪ + LƯỢNG TỪ + ไหน (รถ + คัน + ไหน). Đừng đặt ไหน lên trước danh từ.",
    explanation_en:
      "'Which X?' follows the same frame: NOUN + CLASSIFIER + ไหน (รถ + คัน + ไหน). ไหน goes last, not before the noun.",
    fix: "Reuse the demonstrative frame and replace นี้/นั้น with ไหน.",
  },

  // ───────────────────────── pronouns (สรรพนาม) ─────────────────────────
  {
    id: "pron-female-uses-phom",
    category: "pronouns",
    audience: "both",
    wrong: "ผมหิว",
    wrongRoman: "phǒm hǐw",
    correct: "ฉันหิว",
    correctRoman: "chǎn hǐw",
    gloss_en: "I'm hungry (female speaker)",
    explanation_vi:
      "Đại từ 'tôi' trong tiếng Thái phân theo giới: nam dùng ผม (phǒm), nữ dùng ฉัน/ดิฉัน (chǎn/dì-chǎn). Nữ nói ผม là sai.",
    explanation_en:
      "The word for 'I' is gendered: men say ผม (phǒm), women say ฉัน/ดิฉัน (chǎn/dì-chǎn). A woman using ผม is incorrect.",
    fix: "Pick your 'I' by your own gender and keep it consistent.",
  },
  {
    id: "pron-overuse-subject",
    category: "pronouns",
    audience: "en",
    wrong: "ผมชอบกาแฟ ผมดื่มทุกวัน",
    wrongRoman: "phǒm chɔ̂ɔp kaa-fɛɛ, phǒm dʉ̀ʉm thúk wan",
    correct: "ผมชอบกาแฟ ดื่มทุกวัน",
    correctRoman: "phǒm chɔ̂ɔp kaa-fɛɛ, dʉ̀ʉm thúk wan",
    gloss_en: "I like coffee; I drink it every day.",
    explanation_vi:
      "Tiếng Thái là ngôn ngữ lược chủ ngữ (pro-drop). Khi đã rõ ai, bỏ đại từ ở câu sau. Người nói tiếng Anh hay lặp 'I/he/she' nghe thừa.",
    explanation_en:
      "Thai is pro-drop: once the subject is clear, drop it. Repeating ผม/เขา in every clause the way English repeats 'I/he' sounds redundant.",
    fix: "State the subject once, then omit it while it stays the same.",
  },
  {
    id: "pron-khun-overuse",
    category: "pronouns",
    audience: "en",
    wrong: "คุณกินข้าวหรือยังคุณ",
    wrongRoman: "khun kin khâaw rʉ̌ʉ yang khun",
    correct: "พี่กินข้าวหรือยัง",
    correctRoman: "phîi kin khâaw rʉ̌ʉ yang",
    gloss_en: "Have you eaten yet?",
    explanation_vi:
      "Tiếng Thái ít dùng คุณ ('bạn') liên tục như 'you' tiếng Anh. Người Thái hay gọi bằng tên, chức danh, hoặc đại từ thân tộc như พี่ (anh/chị) / น้อง (em).",
    explanation_en:
      "Thai avoids hammering คุณ ('you') the way English repeats 'you'. Speakers use names, titles, or kin terms like พี่ (older) / น้อง (younger) instead.",
    fix: "Address people by name or kin term; reserve คุน for polite distance.",
  },
  {
    id: "pron-kin-term-address",
    category: "pronouns",
    audience: "both",
    wrong: "คุณอายุเท่าไหร่",
    wrongRoman: "khun aa-yú thâo-rài",
    correct: "พี่อายุเท่าไหร่",
    correctRoman: "phîi aa-yú thâo-rài",
    gloss_en: "How old are you? (to someone older)",
    explanation_vi:
      "Như tiếng Việt, tiếng Thái chọn đại từ theo tuổi/quan hệ: พี่ cho người lớn hơn, น้อง cho người nhỏ hơn. Người Việt thấy quen, người Anh thường bỏ qua sắc thái này.",
    explanation_en:
      "Like Vietnamese, Thai chooses pronouns by relative age/relationship: พี่ for someone older, น้อง for younger. English speakers tend to flatten this into 'you'.",
    fix: "Gauge relative age first, then choose พี่ / น้อง accordingly.",
  },
  {
    id: "pron-nuu-young-female",
    category: "pronouns",
    audience: "en",
    wrong: "ผมไม่เข้าใจค่ะ",
    wrongRoman: "phǒm mâi khâo-jai khâ",
    correct: "หนูไม่เข้าใจค่ะ",
    correctRoman: "nǔu mâi khâo-jai khâ",
    gloss_en: "I don't understand. (young female to an elder)",
    explanation_vi:
      "Cô gái trẻ nói chuyện với người lớn tuổi thường tự xưng หนู (nǔu, nghĩa đen 'chuột') để tỏ sự lễ phép, thay vì ฉัน. Dùng ผม là sai giới.",
    explanation_en:
      "A young female speaking to elders often calls herself หนู (nǔu, lit. 'mouse') to sound respectful, not ฉัน — and certainly not the male ผม.",
    fix: "As a young woman with elders, use หนู for a humble, polite 'I'.",
  },

  // ───────────────────────── word order ─────────────────────────
  {
    id: "wo-adjective-after-noun",
    category: "word-order",
    audience: "en",
    wrong: "ใหญ่บ้าน",
    wrongRoman: "yài bâan",
    correct: "บ้านใหญ่",
    correctRoman: "bâan yài",
    gloss_en: "a big house",
    explanation_vi:
      "Tính từ đứng SAU danh từ trong tiếng Thái (บ้าน + ใหญ่), giống tiếng Việt 'nhà to'. Người Anh hay đặt tính từ trước như 'big house' → sai.",
    explanation_en:
      "Adjectives follow the noun in Thai (บ้าน + ใหญ่), like Vietnamese 'nhà to'. The English 'big house' order is reversed and wrong.",
    fix: "Say the noun first, then describe it.",
  },
  {
    id: "wo-possessive-khong",
    category: "word-order",
    audience: "both",
    wrong: "ฉันหนังสือ",
    wrongRoman: "chǎn nǎng-sʉ̌ʉ",
    correct: "หนังสือของฉัน",
    correctRoman: "nǎng-sʉ̌ʉ khɔ̌ɔng chǎn",
    gloss_en: "my book",
    explanation_vi:
      "Sở hữu dùng khung VẬT + ของ + NGƯỜI (หนังสือ + ของ + ฉัน) = 'sách của tôi'. Không đặt người sở hữu trước như tiếng Anh 'my book'.",
    explanation_en:
      "Possession is THING + ของ + OWNER (หนังสือ + ของ + ฉัน) = 'book of me'. Don't front the owner like English 'my book'.",
    fix: "Use ของ ('of') and keep the possessed thing first.",
  },
  {
    id: "wo-maak-after-adjective",
    category: "word-order",
    audience: "both",
    wrong: "มากอร่อย",
    wrongRoman: "mâak à-ròi",
    correct: "อร่อยมาก",
    correctRoman: "à-ròi mâak",
    gloss_en: "very delicious",
    explanation_vi:
      "'Rất/lắm' = มาก đứng SAU tính từ (อร่อย + มาก), giống 'ngon lắm' tiếng Việt. Đặt มาก trước là sai.",
    explanation_en:
      "The intensifier มาก ('very/a lot') goes AFTER the adjective (อร่อย + มาก). Putting it first, like English 'very tasty', is wrong.",
    fix: "Describe first, intensify after: adjective + มาก.",
  },
  {
    id: "wo-time-word-placement",
    category: "word-order",
    audience: "en",
    wrong: "ผมกินข้าวเมื่อวานเช้า",
    wrongRoman: "phǒm kin khâaw mʉ̂a-waan cháo",
    correct: "เมื่อวานเช้าผมกินข้าว",
    correctRoman: "mʉ̂a-waan cháo phǒm kin khâaw",
    gloss_en: "Yesterday morning I ate.",
    explanation_vi:
      "Trạng từ thời gian thường đứng đầu câu (hoặc ngay sau chủ ngữ), không nhét lộn xộn ở cuối. 'Hôm qua sáng' → đặt trước.",
    explanation_en:
      "Time expressions usually open the sentence (or sit right after the subject), not dangle at the end. Front 'yesterday morning'.",
    fix: "Lead with the time word, then say who-does-what.",
  },
  {
    id: "wo-adverb-degree-naa",
    category: "word-order",
    audience: "vi",
    wrong: "เกินไปแพง",
    wrongRoman: "kəən-pai phɛɛng",
    correct: "แพงเกินไป",
    correctRoman: "phɛɛng kəən-pai",
    gloss_en: "too expensive",
    explanation_vi:
      "'Quá/quá mức' = เกินไป đứng SAU tính từ (แพง + เกินไป) = 'đắt quá'. Người Việt đôi khi bê thẳng 'quá đắt' lên trước → sai trật tự.",
    explanation_en:
      "'Too ...' = เกินไป follows the adjective (แพง + เกินไป). Don't front it the way Vietnamese 'quá đắt' might tempt you to.",
    fix: "adjective + เกินไป for 'too ___'.",
  },

  // ───────────────────────── tense / aspect particles ─────────────────────────
  {
    id: "ta-no-conjugation",
    category: "tense-aspect",
    audience: "en",
    wrong: "เมื่อวานผมไปแล้วเดิน",
    wrongRoman: "mʉ̂a-waan phǒm pai-láew dəən",
    correct: "เมื่อวานผมเดิน",
    correctRoman: "mʉ̂a-waan phǒm dəən",
    gloss_en: "Yesterday I walked.",
    explanation_vi:
      "Động từ tiếng Thái KHÔNG chia thì. Quá khứ thể hiện bằng từ chỉ thời gian (เมื่อวาน = hôm qua). Đừng cố thêm đuôi quá khứ vào động từ.",
    explanation_en:
      "Thai verbs never conjugate for tense. Past time comes from a time word (เมื่อวาน = yesterday); don't try to bolt a past ending onto the verb.",
    fix: "Keep the verb bare and let a time word carry the tense.",
  },
  {
    id: "ta-laew-position",
    category: "tense-aspect",
    audience: "both",
    wrong: "แล้วกินข้าว",
    wrongRoman: "láew kin khâaw",
    correct: "กินข้าวแล้ว",
    correctRoman: "kin khâaw láew",
    gloss_en: "(I) already ate.",
    explanation_vi:
      "แล้ว ('rồi', hoàn thành) đứng CUỐI câu/cụm động từ: กินข้าว + แล้ว = 'ăn cơm rồi'. Đặt แล้ว ở đầu nghĩa khác ('rồi thì...').",
    explanation_en:
      "แล้ว ('already/done') goes at the END of the verb phrase: กินข้าว + แล้ว. At the front it means 'and then...', not 'already'.",
    fix: "Tag แล้ว onto the end to mark completion.",
  },
  {
    id: "ta-progressive-kamlang-yuu",
    category: "tense-aspect",
    audience: "both",
    wrong: "ผมเป็นกิน",
    wrongRoman: "phǒm pen kin",
    correct: "ผมกำลังกินอยู่",
    correctRoman: "phǒm kam-lang kin yùu",
    gloss_en: "I am eating (right now).",
    explanation_vi:
      "Thì tiếp diễn = กำลัง + động từ + อยู่ (กำลังกินอยู่ = 'đang ăn'). Không dùng 'to be' (เป็น) như tiếng Anh 'am eating'.",
    explanation_en:
      "The progressive is กำลัง + verb + อยู่ (กำลังกินอยู่). There is no 'be + -ing'; never insert เป็น ('to be') for 'am eating'.",
    fix: "Wrap the verb: กำลัง … อยู่ for 'in the middle of doing'.",
  },
  {
    id: "ta-future-ja",
    category: "tense-aspect",
    audience: "both",
    wrong: "พรุ่งนี้ผมไปแล้ว",
    wrongRoman: "phrûng-níi phǒm pai-láew",
    correct: "พรุ่งนี้ผมจะไป",
    correctRoman: "phrûng-níi phǒm jà pai",
    gloss_en: "Tomorrow I will go.",
    explanation_vi:
      "Tương lai = จะ đứng TRƯỚC động từ (จะไป = 'sẽ đi'). Đừng nhầm với แล้ว (đã/rồi) — đó là quá khứ/hoàn thành.",
    explanation_en:
      "Future is จะ before the verb (จะไป = 'will go'). Don't confuse it with แล้ว, which marks completion (already done).",
    fix: "Put จะ in front of the verb for future intent.",
  },
  {
    id: "ta-experiential-khoei",
    category: "tense-aspect",
    audience: "vi",
    wrong: "ผมไปญี่ปุ่นแล้วครั้งหนึ่ง",
    wrongRoman: "phǒm pai yîi-pùn láew khráng nʉ̀ng",
    correct: "ผมเคยไปญี่ปุ่น",
    correctRoman: "phǒm khəəi pai yîi-pùn",
    gloss_en: "I have been to Japan (before).",
    explanation_vi:
      "'Từng/đã từng' = เคย đứng trước động từ (เคยไป). Diễn tả kinh nghiệm đã có, khác với 'đã ... rồi' (แล้ว) chỉ sự hoàn thành một lần cụ thể.",
    explanation_en:
      "'Have ever / used to' = เคย before the verb (เคยไป), marking past experience — different from แล้ว, which marks a specific completed action.",
    fix: "Use เคย + verb for life-experience 'have done before'.",
  },
  {
    id: "ta-still-yang-yuu",
    category: "tense-aspect",
    audience: "both",
    wrong: "ผมกำลังเรียนยัง",
    wrongRoman: "phǒm kam-lang rian yang",
    correct: "ผมยังเรียนอยู่",
    correctRoman: "phǒm yang rian yùu",
    gloss_en: "I am still studying.",
    explanation_vi:
      "'Vẫn còn' = ยัง + động từ + อยู่ (ยังเรียนอยู่ = 'vẫn đang học'). ยัง đứng TRƯỚC động từ, không đứng cuối.",
    explanation_en:
      "'Still' = ยัง + verb + อยู่ (ยังเรียนอยู่). ยัง goes before the verb, not tacked on at the end.",
    fix: "Frame ongoing-still state as ยัง … อยู่.",
  },

  // ───────────────────────── politeness level ─────────────────────────
  {
    id: "pol-female-ka",
    category: "politeness",
    audience: "both",
    wrong: "ขอบคุณครับ",
    wrongRoman: "khɔ̀ɔp-khun khráp",
    correct: "ขอบคุณค่ะ",
    correctRoman: "khɔ̀ɔp-khun khâ",
    gloss_en: "Thank you. (female speaker)",
    explanation_vi:
      "Tiểu từ lịch sự theo giới: nam dùng ครับ (khráp), nữ dùng ค่ะ (khâ). Nữ nói ครับ là sai giới.",
    explanation_en:
      "The polite particle is gendered: men end with ครับ (khráp), women with ค่ะ (khâ). A woman saying ครับ is wrong.",
    fix: "End polite sentences with ครับ (m) or ค่ะ (f) — match your gender.",
  },
  {
    id: "pol-kha-question-vs-statement",
    category: "politeness",
    audience: "both",
    wrong: "ไปไหนค่ะ",
    wrongRoman: "pai nǎi khâ",
    correct: "ไปไหนคะ",
    correctRoman: "pai nǎi khá",
    gloss_en: "Where are you going? (female speaker)",
    explanation_vi:
      "Nữ giới: câu HỎI dùng คะ (thanh cao, khá), câu KỂ dùng ค่ะ (thanh huyền, khâ). Cùng chữ nhưng khác thanh và khác chức năng — dễ viết/đọc sai.",
    explanation_en:
      "For women, QUESTIONS take คะ (high tone, khá) while STATEMENTS take ค่ะ (falling tone, khâ). Same syllable, different tone and function.",
    fix: "Asking? Use คะ (rising/high). Telling? Use ค่ะ (falling).",
  },
  {
    id: "pol-dropping-particle-blunt",
    category: "politeness",
    audience: "en",
    wrong: "ไม่เอา",
    wrongRoman: "mâi ao",
    correct: "ไม่เอาครับ",
    correctRoman: "mâi ao khráp",
    gloss_en: "No, thank you / I don't want it.",
    explanation_vi:
      "Bỏ ครับ/ค่ะ với người lạ hoặc nơi trang trọng nghe cộc lốc, thiếu lịch sự. Thêm tiểu từ lịch sự để giảm sự gắt.",
    explanation_en:
      "Dropping ครับ/ค่ะ with strangers or in formal settings sounds blunt or rude. The particle is what softens the utterance.",
    fix: "When in doubt, add ครับ/ค่ะ — politeness is the default in Thai.",
  },
  {
    id: "pol-na-softener",
    category: "politeness",
    audience: "both",
    wrong: "รอตรงนี้",
    wrongRoman: "rɔɔ trong-níi",
    correct: "รอตรงนี้นะคะ",
    correctRoman: "rɔɔ trong-níi ná khá",
    gloss_en: "Please wait here.",
    explanation_vi:
      "นะ làm câu mềm hơn, bớt ra lệnh — gần như 'nhé/nha' tiếng Việt. Mệnh lệnh trần trụi nghe ra lệnh; thêm นะ để nhẹ nhàng.",
    explanation_en:
      "นะ softens a sentence and removes the command tone — like English 'okay?' or Vietnamese 'nhé'. A bare imperative sounds bossy.",
    fix: "Soften requests with นะ (often นะคะ / นะครับ).",
  },

  // ───────────────────────── question particles ─────────────────────────
  {
    id: "q-yesno-mai",
    category: "question-particles",
    audience: "en",
    wrong: "คุณหิว?",
    wrongRoman: "khun hǐw?",
    correct: "คุณหิวไหม",
    correctRoman: "khun hǐw mǎi",
    gloss_en: "Are you hungry?",
    explanation_vi:
      "Câu hỏi Có/Không thêm ไหม ở cuối (หิว + ไหม). Tiếng Thái không hỏi bằng ngữ điệu lên giọng như tiếng Anh — phải có tiểu từ hỏi.",
    explanation_en:
      "Yes/no questions add ไหม at the end (หิว + ไหม). Thai does not signal a question with rising intonation alone — it needs the particle.",
    fix: "Turn a statement into a yes/no question by adding ไหม.",
  },
  {
    id: "q-no-do-support",
    category: "question-particles",
    audience: "en",
    wrong: "คุณทำชอบกาแฟไหม",
    wrongRoman: "khun tham chɔ̂ɔp kaa-fɛɛ mǎi",
    correct: "คุณชอบกาแฟไหม",
    correctRoman: "khun chɔ̂ɔp kaa-fɛɛ mǎi",
    gloss_en: "Do you like coffee?",
    explanation_vi:
      "Tiếng Thái KHÔNG có trợ động từ 'do/does'. Đừng dịch 'do' thành ทำ (ทำ = 'làm'). Chỉ cần động từ + ไหม.",
    explanation_en:
      "Thai has no 'do/does' auxiliary. Don't translate question 'do' as ทำ (ทำ means 'to do/make' the action). Just use verb + ไหม.",
    fix: "Drop English 'do/does' entirely; the question particle does that job.",
  },
  {
    id: "q-tag-chai-mai",
    category: "question-particles",
    audience: "both",
    wrong: "คุณเป็นครูไหม",
    wrongRoman: "khun pen khruu mǎi",
    correct: "คุณเป็นครูใช่ไหม",
    correctRoman: "khun pen khruu châi mǎi",
    gloss_en: "You're a teacher, right?",
    explanation_vi:
      "Câu hỏi xác nhận ('...đúng không?') dùng ใช่ไหม, không dùng ไหม đơn. ...ไหม là hỏi mới hoàn toàn; ...ใช่ไหม là hỏi để xác nhận điều đã đoán.",
    explanation_en:
      "Confirmation tags ('…right?') use ใช่ไหม, not plain ไหม. Plain ไหม asks a fresh yes/no; ใช่ไหม checks an assumption you already hold.",
    fix: "Use ใช่ไหม for 'isn't it / right?', plain ไหม for a neutral question.",
  },
  {
    id: "q-answer-repeat-verb",
    category: "question-particles",
    audience: "both",
    wrong: "ใช่ (ตอบคำถาม 'ไปไหม')",
    wrongRoman: "châi (answering 'pai mǎi')",
    correct: "ไป / ไม่ไป",
    correctRoman: "pai / mâi pai",
    gloss_en: "Yes / No (in answer to 'Are you going?')",
    explanation_vi:
      "Tiếng Thái không có một từ 'yes' vạn năng. Trả lời câu hỏi ...ไหม bằng cách LẶP LẠI động từ: ไปไหม → ไป (có) / ไม่ไป (không). ใช่ chỉ dùng để xác nhận 'đúng vậy'.",
    explanation_en:
      "There is no all-purpose 'yes' in Thai. Answer a ...ไหม question by repeating the verb: ไปไหม → ไป (yes) / ไม่ไป (no). ใช่ only confirms 'that's right'.",
    fix: "To say yes, echo the verb; to say no, put ไม่ before it.",
  },
  {
    id: "q-already-yet-rue-yang",
    category: "question-particles",
    audience: "vi",
    wrong: "คุณกินข้าวไหม (ถามว่ากินหรือยัง)",
    wrongRoman: "khun kin khâaw mǎi (meaning 'yet?')",
    correct: "คุณกินข้าวหรือยัง",
    correctRoman: "khun kin khâaw rʉ̌ʉ yang",
    gloss_en: "Have you eaten yet?",
    explanation_vi:
      "'...chưa?' (đã làm chưa) dùng หรือยัง, không dùng ไหม. ...ไหม chỉ hỏi muốn/có hay không; หรือยัง hỏi sự việc đã xảy ra hay chưa.",
    explanation_en:
      "'...yet?' uses หรือยัง, not ไหม. ไหม asks willingness/whether; หรือยัง asks whether something has happened already.",
    fix: "For 'have you …yet?', end with หรือยัง.",
  },

  // ───────────────────────── negation ─────────────────────────
  {
    id: "neg-mai-before-verb",
    category: "negation",
    audience: "both",
    wrong: "ผมไปไม่",
    wrongRoman: "phǒm pai mâi",
    correct: "ผมไม่ไป",
    correctRoman: "phǒm mâi pai",
    gloss_en: "I'm not going.",
    explanation_vi:
      "Phủ định ไม่ đứng TRƯỚC động từ (ไม่ + ไป = 'không đi'), giống tiếng Việt 'không đi'. Đặt ไม่ ở cuối là sai.",
    explanation_en:
      "Negation ไม่ goes BEFORE the verb (ไม่ + ไป). It never trails at the end like English 'not' can in some constructions.",
    fix: "Put ไม่ directly in front of the verb.",
  },
  {
    id: "neg-mai-chai-for-nouns",
    category: "negation",
    audience: "both",
    wrong: "ผมไม่นักเรียน",
    wrongRoman: "phǒm mâi nák-rian",
    correct: "ผมไม่ใช่นักเรียน",
    correctRoman: "phǒm mâi châi nák-rian",
    gloss_en: "I'm not a student.",
    explanation_vi:
      "Phủ định DANH TỪ dùng ไม่ใช่ ('không phải'), không dùng ไม่ trơ. ไม่ chỉ phủ định động từ/tính từ; ไม่ใช่ phủ định 'là cái gì'.",
    explanation_en:
      "To negate a NOUN ('not a ___'), use ไม่ใช่, not bare ไม่. ไม่ negates verbs/adjectives; ไม่ใช่ negates identity ('is not a').",
    fix: "Negating 'be a noun'? Use ไม่ใช่, not ไม่.",
  },
  {
    id: "neg-not-yet-yang-mai",
    category: "negation",
    audience: "vi",
    wrong: "ผมไม่กินยัง",
    wrongRoman: "phǒm mâi kin yang",
    correct: "ผมยังไม่กิน",
    correctRoman: "phǒm yang mâi kin",
    gloss_en: "I haven't eaten yet.",
    explanation_vi:
      "'Chưa' = ยังไม่ (ยัง + ไม่ + động từ). Thứ tự là ยังไม่ + động từ, không tách ยัง ra cuối câu. 'Vẫn chưa ăn' = ยังไม่กิน.",
    explanation_en:
      "'Not yet' = ยังไม่ (ยัง + ไม่ + verb). Keep ยังไม่ together before the verb; don't strand ยัง at the end.",
    fix: "Stack ยังไม่ before the verb for 'not yet'.",
  },
  {
    id: "neg-cant-skill-pen",
    category: "negation",
    audience: "both",
    wrong: "ผมว่ายน้ำไม่ได้ (หมายถึงทำไม่เป็น)",
    wrongRoman: "phǒm wâai-náam mâi dâi (meaning 'don't know how')",
    correct: "ผมว่ายน้ำไม่เป็น",
    correctRoman: "phǒm wâai-náam mâi pen",
    gloss_en: "I can't swim (don't know how).",
    explanation_vi:
      "Phân biệt: ไม่เป็น = 'không biết làm' (thiếu kỹ năng); ไม่ได้ = 'không thể làm được' (do hoàn cảnh, bị cấm). 'Không biết bơi' phải dùng ไม่เป็น.",
    explanation_en:
      "Distinguish ไม่เป็น ('lack the skill / don't know how') from ไม่ได้ ('unable due to circumstance/permission'). 'Can't swim' = lacks skill → ไม่เป็น.",
    fix: "Skill you never learned → ไม่เป็น; blocked-this-time → ไม่ได้.",
  },
  {
    id: "neg-past-mai-dai",
    category: "negation",
    audience: "en",
    wrong: "เมื่อวานผมไม่ไป",
    wrongRoman: "mʉ̂a-waan phǒm mâi pai",
    correct: "เมื่อวานผมไม่ได้ไป",
    correctRoman: "mʉ̂a-waan phǒm mâi dâi pai",
    gloss_en: "Yesterday I didn't go.",
    explanation_vi:
      "Phủ định hành động đã KHÔNG xảy ra trong quá khứ dùng ไม่ได้ + động từ (ไม่ได้ไป = 'đã không đi'). ไม่ไป nghiêng về 'không (chịu) đi / sẽ không đi'.",
    explanation_en:
      "To say an action did NOT happen in the past, use ไม่ได้ + verb (ไม่ได้ไป). Bare ไม่ไป leans toward 'won't go / refuse to go'.",
    fix: "Past-tense 'didn't' → ไม่ได้ + verb.",
  },

  // ───────────────────────── tone-awareness warnings ─────────────────────────
  {
    id: "tone-klai-near-far",
    category: "tone-awareness",
    audience: "both",
    wrong: "ไกล",
    wrongRoman: "klai (mid) = far",
    correct: "ใกล้",
    correctRoman: "klâi (falling) = near",
    gloss_en: "near vs. far — opposite meanings by tone",
    explanation_vi:
      "ไกล (klai, thanh ngang) = 'xa'; ใกล้ (klâi, thanh huyền/xuống) = 'gần'. Chỉ khác THANH nhưng nghĩa NGƯỢC nhau. Sai thanh là nói ngược ý.",
    explanation_en:
      "ไกล (klai, mid tone) = 'far'; ใกล้ (klâi, falling tone) = 'near'. Same consonants, opposite meanings selected purely by tone.",
    fix: "Drill this pair as a unit; never trust the romanized spelling without the tone.",
  },
  {
    id: "tone-maa-set",
    category: "tone-awareness",
    audience: "both",
    wrong: "หมา",
    wrongRoman: "mǎa (rising) = dog",
    correct: "ม้า",
    correctRoman: "máa (high) = horse",
    gloss_en: "come / dog / horse — one syllable, three tones",
    explanation_vi:
      "มา (maa, ngang) = 'đến'; หมา (mǎa, thanh hỏi/lên) = 'con chó'; ม้า (máa, thanh cao) = 'con ngựa'. Cùng âm 'maa', khác thanh khác nghĩa hoàn toàn.",
    explanation_en:
      "มา (maa, mid) = 'come'; หมา (mǎa, rising) = 'dog'; ม้า (máa, high) = 'horse'. Identical romanization 'maa', three meanings via tone.",
    fix: "Learn each tone-word as a distinct vocabulary item, not spelling variants.",
  },
  {
    id: "tone-khaaw-rice-white-news",
    category: "tone-awareness",
    audience: "both",
    wrong: "ขาว",
    wrongRoman: "khǎaw (rising) = white",
    correct: "ข้าว",
    correctRoman: "khâaw (falling) = rice",
    gloss_en: "rice / white / news distinguished by tone",
    explanation_vi:
      "ข้าว (khâaw, huyền) = 'cơm/gạo'; ขาว (khǎaw, lên) = 'màu trắng'; ข่าว (khàaw, thấp) = 'tin tức'. Gọi món mà sai thanh có thể thành 'màu trắng'.",
    explanation_en:
      "ข้าว (khâaw, falling) = 'rice'; ขาว (khǎaw, rising) = 'white'; ข่าว (khàaw, low) = 'news'. Order food with the wrong tone and you might say 'white'.",
    fix: "Anchor the falling tone for 'rice' (khâaw) before ordering food.",
  },
  {
    id: "tone-suea-tiger-shirt-mat",
    category: "tone-awareness",
    audience: "both",
    wrong: "เสือ",
    wrongRoman: "sʉ̌a (rising) = tiger",
    correct: "เสื้อ",
    correctRoman: "sʉ̂a (falling) = shirt",
    gloss_en: "tiger / shirt / mat by tone",
    explanation_vi:
      "เสือ (sʉ̌a, lên) = 'con hổ'; เสื้อ (sʉ̂a, huyền) = 'áo'; เสื่อ (sʉ̀a, thấp) = 'chiếu'. Muốn nói 'cái áo' mà sai thanh có thể thành 'con hổ'.",
    explanation_en:
      "เสือ (sʉ̌a, rising) = 'tiger'; เสื้อ (sʉ̂a, falling) = 'shirt'; เสื่อ (sʉ̀a, low) = 'mat'. Aim for 'shirt' and a slipped tone gives you 'tiger'.",
    fix: "Pair the everyday word (shirt) with its tone and rehearse aloud.",
  },
  {
    id: "tone-mai-homophones",
    category: "tone-awareness",
    audience: "both",
    wrong: "ไม้ ใหม่ ไหม้ ไหม",
    wrongRoman: "máai / mài / mâi / mǎi",
    correct: "ไม้ ใหม่ ไหม้ ไหม",
    correctRoman: "máai (wood) / mài (new) / mâi (burn) / mǎi (silk·question)",
    gloss_en: "wood / new / burn / silk — same 'mai', four tones",
    explanation_vi:
      "Bộ kinh điển: ไม้ (máai, cao) = 'gỗ'; ใหม่ (mài, thấp) = 'mới'; ไหม้ (mâi, huyền) = 'cháy'; ไหม (mǎi, lên) = 'lụa' hoặc tiểu từ hỏi. Thanh điệu quyết định nghĩa.",
    explanation_en:
      "The classic set: ไม้ (máai, high) 'wood'; ใหม่ (mài, low) 'new'; ไหม้ (mâi, falling) 'burn'; ไหม (mǎi, rising) 'silk'/question particle. Tone is the only differentiator.",
    fix: "Use this set as your tone-practice benchmark; if you can hear all four, your ear is ready.",
  },
  {
    id: "tone-romanization-trap",
    category: "tone-awareness",
    audience: "both",
    wrong: "mai mai mai (ตัวสะกดโรมันไม่มีวรรณยุกต์)",
    wrongRoman: "mai mai mai (no tones marked)",
    correct: "ไหม ใหม่ ไม้",
    correctRoman: "mǎi · mài · máai (tones marked)",
    gloss_en: "Don't trust toneless romanization.",
    explanation_vi:
      "Chữ La-tinh không ghi thanh thường gây hiểu nhầm hàng loạt. Đừng học từ vựng chỉ qua phiên âm 'mai/mai' — luôn học kèm thanh (hoặc học chữ Thái).",
    explanation_en:
      "Toneless romanization collapses distinct words into one spelling. Never memorize vocabulary from bare 'mai/mai' — always include the tone (or learn Thai script).",
    fix: "Record tone marks with every new word, or learn the script directly.",
  },
  {
    id: "tone-vowel-length-khao",
    category: "tone-awareness",
    audience: "both",
    wrong: "เขา",
    wrongRoman: "khǎo (short) = he/she/they",
    correct: "ขาว",
    correctRoman: "khǎaw (long) = white",
    gloss_en: "Vowel length changes the word too.",
    explanation_vi:
      "Không chỉ thanh — ĐỘ DÀI nguyên âm cũng đổi nghĩa. เขา (khǎo, ngắn) = 'anh ấy/họ'; ขาว (khǎaw, dài) = 'trắng'. Phải kéo dài nguyên âm cho đúng.",
    explanation_en:
      "Beyond tone, VOWEL LENGTH is contrastive. เขา (khǎo, short) = 'he/she/they'; ขาว (khǎaw, long) = 'white'. Hold long vowels long.",
    fix: "Treat vowel length as a real distinction, like tone — practice short vs. long pairs.",
  },

  // ───────────────────────── over-literal translation ─────────────────────────
  {
    id: "lit-adjectives-are-verbs",
    category: "over-literal",
    audience: "both",
    wrong: "เธอเป็นสวย",
    wrongRoman: "thəə pen sǔai",
    correct: "เธอสวย",
    correctRoman: "thəə sǔai",
    gloss_en: "She is beautiful.",
    explanation_vi:
      "Tính từ tiếng Thái đã mang nghĩa 'thì/là' (สวย = 'đẹp / thì đẹp'). KHÔNG thêm 'to be' (เป็น). 'Cô ấy đẹp' = เธอสวย, không phải เธอเป็นสวย.",
    explanation_en:
      "Thai adjectives are stative verbs ('to be ___' is built in). Don't add เป็น ('to be') before an adjective. 'She is beautiful' = เธอสวย.",
    fix: "Drop 'is/are/am' before adjectives — the adjective already carries it.",
  },
  {
    id: "lit-am-hungry-no-be",
    category: "over-literal",
    audience: "en",
    wrong: "ผมเป็นหิว",
    wrongRoman: "phǒm pen hǐw",
    correct: "ผมหิว",
    correctRoman: "phǒm hǐw",
    gloss_en: "I am hungry.",
    explanation_vi:
      "หิว ('đói') là động từ trạng thái, tự thân nghĩa 'thì đói'. 'I am hungry' KHÔNG dịch chữ 'am' (เป็น). Chỉ cần ผมหิว.",
    explanation_en:
      "หิว ('hungry') is itself a stative verb. Don't translate the 'am' of 'I am hungry' as เป็น. Just say ผมหิว.",
    fix: "For feelings/states (hungry, tired, hot), use the bare word — no 'to be'.",
  },
  {
    id: "lit-pen-vs-khue",
    category: "over-literal",
    audience: "both",
    wrong: "นี่เป็นหนังสือของผม",
    wrongRoman: "nîi pen nǎng-sʉ̌ʉ khɔ̌ɔng phǒm",
    correct: "นี่คือหนังสือของผม",
    correctRoman: "nîi khʉʉ nǎng-sʉ̌ʉ khɔ̌ɔng phǒm",
    gloss_en: "This is my book.",
    explanation_vi:
      "Hai từ 'là': เป็น dùng cho thân phận/nghề (ผมเป็นครู = 'tôi là giáo viên'); คือ dùng để định nghĩa/đồng nhất ('A chính là B'). 'Đây là sách của tôi' → คือ.",
    explanation_en:
      "Two words for 'to be': เป็น for roles/identity (ผมเป็นครู = 'I am a teacher'); คือ for definitions/equation ('A is B'). 'This is my book' → คือ.",
    fix: "Role/profession → เป็น; identifying/defining a thing → คือ.",
  },
  {
    id: "lit-have-there-is-mii",
    category: "over-literal",
    audience: "en",
    wrong: "มันเป็นร้านอาหารใกล้นี่",
    wrongRoman: "man pen ráan-aa-hǎan klâi nîi",
    correct: "ใกล้นี่มีร้านอาหาร",
    correctRoman: "klâi nîi mii ráan-aa-hǎan",
    gloss_en: "There is a restaurant near here.",
    explanation_vi:
      "'There is/are' = มี ('có'), không dịch máy thành 'it is' (มันเป็น). 'Gần đây có nhà hàng' = ...มีร้านอาหาร.",
    explanation_en:
      "'There is/are' = มี ('to have/exist'), not a literal 'it is' (มันเป็น). 'There's a restaurant nearby' = …มีร้านอาหาร.",
    fix: "Use มี for existence ('there is'); don't reach for 'it/be'.",
  },
  {
    id: "lit-vi-co-khong",
    category: "over-literal",
    audience: "vi",
    wrong: "คุณมีหิวไหม",
    wrongRoman: "khun mii hǐw mǎi",
    correct: "คุณหิวไหม",
    correctRoman: "khun hǐw mǎi",
    gloss_en: "Are you hungry?",
    explanation_vi:
      "Người Việt hay bê khung 'CÓ ... KHÔNG' và dịch 'có' = มี. Nhưng มี nghĩa là 'sở hữu/tồn tại', không phải trợ từ hỏi. 'Bạn có đói không?' chỉ là động từ + ไหม → คุณหิวไหม.",
    explanation_en:
      "Vietnamese maps its 'có … không?' frame onto มี, but มี means 'to have/exist', not a question helper. Just use verb + ไหม → คุณหิวไหม.",
    fix: "Don't translate the 'có' of a Vietnamese yes/no frame as มี; rely on ไหม.",
  },
  {
    id: "lit-go-no-preposition",
    category: "over-literal",
    audience: "en",
    wrong: "ผมไปที่ที่โรงเรียน",
    wrongRoman: "phǒm pai thîi thîi rooŋ-rian",
    correct: "ผมไปโรงเรียน",
    correctRoman: "phǒm pai rooŋ-rian",
    gloss_en: "I go to school.",
    explanation_vi:
      "ไป ('đi') thường đi thẳng với địa điểm, KHÔNG cần 'to' (ที่). 'Tôi đi học/đi trường' = ไปโรงเรียน, không thêm ที่ thừa.",
    explanation_en:
      "ไป ('go') usually takes a destination directly — no 'to' (ที่) needed. 'I go to school' = ไปโรงเรียน; an extra ที่ is redundant.",
    fix: "After ไป, name the place directly; skip the English 'to'.",
  },
  {
    id: "lit-how-are-you",
    category: "over-literal",
    audience: "both",
    wrong: "คุณเป็นอย่างไรอยู่",
    wrongRoman: "khun pen yàang-rai yùu",
    correct: "สบายดีไหม",
    correctRoman: "sà-baai dii mǎi",
    gloss_en: "How are you?",
    explanation_vi:
      "'How are you' KHÔNG dịch từng chữ. Câu hỏi thăm chuẩn là สบายดีไหม ('khỏe không?'). Dịch máy 'how' = อย่างไร nghe rất kỳ.",
    explanation_en:
      "'How are you?' is not translated word-for-word. The set greeting is สบายดีไหม ('are you well?'). A literal 'how' (อย่างไร) sounds bizarre.",
    fix: "Learn greetings as fixed chunks, not word-by-word translations.",
  },
  {
    id: "lit-very-much-thank",
    category: "over-literal",
    audience: "both",
    wrong: "ขอบคุณมากมาก",
    wrongRoman: "khɔ̀ɔp-khun mâak mâak",
    correct: "ขอบคุณมากๆ",
    correctRoman: "khɔ̀ɔp-khun mâak-mâak",
    gloss_en: "Thank you very much.",
    explanation_vi:
      "Lặp từ để nhấn mạnh thì viết bằng ký hiệu ซ้ำ ๆ (ไม้ยมก 'ๆ'), không viết hai lần rời. มากๆ = 'rất nhiều'. Đây là quy ước viết của tiếng Thái.",
    explanation_en:
      "Reduplication for emphasis is written with the repetition mark ๆ (mái-yá-mók), not by writing the word twice. มากๆ = 'very much'.",
    fix: "Use the ๆ mark to double a word for emphasis instead of retyping it.",
  },

  // ───────────────────────── discourse particles ─────────────────────────
  {
    id: "part-si-suggestion",
    category: "particles",
    audience: "both",
    wrong: "กิน",
    wrongRoman: "kin",
    correct: "กินสิ",
    correctRoman: "kin sì",
    gloss_en: "Go ahead and eat! / Eat, then!",
    explanation_vi:
      "สิ thêm sắc thái khuyến khích/giục nhẹ ('cứ ... đi'). Mệnh lệnh trần กิน nghe cộc; กินสิ nghe mời mọc, thân thiện hơn.",
    explanation_en:
      "สิ adds gentle urging/encouragement ('go on, …'). Bare กิน sounds curt; กินสิ sounds inviting and friendly.",
    fix: "Add สิ to nudge or encourage someone warmly.",
  },
  {
    id: "part-la-follow-up",
    category: "particles",
    audience: "both",
    wrong: "คุณ?",
    wrongRoman: "khun?",
    correct: "แล้วคุณล่ะ",
    correctRoman: "láew khun lâ",
    gloss_en: "And you? / What about you?",
    explanation_vi:
      "Hỏi vặn lại ('còn bạn thì sao?') dùng ...ล่ะ ở cuối (แล้วคุณล่ะ). Chỉ nói 'คุณ?' nghe trống và không tự nhiên.",
    explanation_en:
      "To toss a question back ('and you?'), end with ...ล่ะ (แล้วคุณล่ะ). A bare 'khun?' sounds empty and unnatural.",
    fix: "Bounce a question back with ...ล่ะ.",
  },
  {
    id: "part-loei-emphasis",
    category: "particles",
    audience: "both",
    wrong: "อร่อยมาก",
    wrongRoman: "à-ròi mâak",
    correct: "อร่อยเลย",
    correctRoman: "à-ròi ləəi",
    gloss_en: "(Wow,) so delicious!",
    explanation_vi:
      "เลย thêm sắc thái 'thật đấy / luôn' đầy cảm thán, tự nhiên trong khẩu ngữ. Không sai khi dùng มาก, nhưng เลย nghe sống động, bản xứ hơn trong nhiều ngữ cảnh.",
    explanation_en:
      "เลย adds an exclamatory 'totally/really' flavor that sounds natural in speech. มาก isn't wrong, but เลย often sounds livelier and more native.",
    fix: "Use เลย for spontaneous emphasis/reaction in casual speech.",
  },
  {
    id: "part-rok-correction",
    category: "particles",
    audience: "both",
    wrong: "ไม่ใช่",
    wrongRoman: "mâi châi",
    correct: "ไม่ใช่หรอก",
    correctRoman: "mâi châi rɔ̀ɔk",
    gloss_en: "No, that's not it (correcting a wrong assumption).",
    explanation_vi:
      "หรอก dùng khi đính chính một giả định sai của người nghe, làm câu phủ định bớt gắt ('không phải đâu'). Thiếu หรอก, lời cải chính nghe khô và có thể hơi gắt.",
    explanation_en:
      "หรอก softens a denial that corrects the listener's wrong assumption ('no, it's not like that'). Without it, the correction can sound flat or curt.",
    fix: "Add หรอก when gently correcting someone's mistaken belief.",
  },
];

export default thaiErrorPatterns;
