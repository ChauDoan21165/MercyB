// src/languages/thai/toneDrills.ts
//
// Non-audio Thai tone-awareness drills (A9, Wave 2) for Vietnamese- and
// English-speaking learners.
//
// These are WRITTEN, multiple-choice / true-false awareness exercises that
// build recognition of tone marks, meaning-by-tone, and Thai↔Vietnamese
// tone differences. They explicitly do NOT:
//   • play, record, synthesize, or score any audio (no mic, no TTS, no Azure);
//   • claim to evaluate a learner's pronunciation.
//
// Tone is auditory; these drills only train the *written/recognition* side.
// Romanization is a plain reading aid and does not encode tone. Native
// review of the linguistic content is DEFERRED.
//
// Companion data: ./vocabulary.ts and ./toneBasics.ts.

import type { ThaiToneId } from "./toneBasics";

export type ThaiToneDrillType =
  | "identify-tone-mark"   // which tone mark is on this word?
  | "choose-meaning"       // pick the correct gloss
  | "match-romanization"   // pick the correct reading aid for the Thai word
  | "tone-warning"         // true/false awareness of a tone pitfall
  | "written-contrast";    // minimal pair: which spelling means X?

export type ThaiToneDrill = {
  id: string;
  type: ThaiToneDrillType;
  /** Bilingual instruction shown to the learner */
  prompt_vi: string;
  prompt_en: string;
  /** Thai script the drill is about (when the drill shows a word) */
  th?: string;
  /** Plain romanization reading aid (no tone encoded) */
  rom?: string;
  /** Tone of `th`, when relevant to the explanation */
  toneLabel?: ThaiToneId;
  /** Tone mark symbol present on `th`, when relevant */
  toneMark?: string;
  /** Answer choices (label text shown to the learner) */
  options?: ReadonlyArray<string>;
  /** Index into `options` of the correct choice */
  answerIndex?: number;
  /** Bilingual rationale, including the no-audio caveat where useful */
  explanation_vi: string;
  explanation_en: string;
};

// Shared option set for "which tone mark?" drills.
const MARK_OPTIONS = [
  "ไม้เอก ่ (mai ek)",
  "ไม้โท ้ (mai tho)",
  "ไม้ตรี ๊ (mai tri)",
  "ไม้จัตวา ๋ (mai chattawa)",
  "ไม่มีรูปวรรณยุกต์ (no tone mark)",
] as const;

const TF_OPTIONS = ["จริง (True)", "ไม่จริง (False)"] as const;

export const THAI_TONE_DRILLS: ReadonlyArray<ThaiToneDrill> = [
  // ── identify-tone-mark (which written mark sits on the word?) ─────────
  {
    id: "mark-pa-ek",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ป่า", rom: "pa", toneLabel: "low", toneMark: "่",
    options: MARK_OPTIONS, answerIndex: 0,
    explanation_vi: "ป่า mang dấu ไม้เอก (่). Với phụ âm trung như ป, mai ek cho thanh THẤP. Nghĩa: 'rừng'.",
    explanation_en: "ป่า carries ไม้เอก (่). On a mid-class consonant like ป, mai ek gives the LOW tone. Meaning: 'forest'.",
  },
  {
    id: "mark-pa-tho",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ป้า", rom: "pa", toneLabel: "falling", toneMark: "้",
    options: MARK_OPTIONS, answerIndex: 1,
    explanation_vi: "ป้า mang dấu ไม้โท (้) → thanh XUỐNG (falling). Nghĩa: 'bác / dì'.",
    explanation_en: "ป้า carries ไม้โท (้) → FALLING tone. Meaning: 'aunt'.",
  },
  {
    id: "mark-pa-tri",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ป๊า", rom: "pa", toneLabel: "high", toneMark: "๊",
    options: MARK_OPTIONS, answerIndex: 2,
    explanation_vi: "ป๊า mang dấu ไม้ตรี (๊) → thanh CAO. (Cách gọi 'ba' thân mật.)",
    explanation_en: "ป๊า carries ไม้ตรี (๊) → HIGH tone. (A colloquial word for 'dad'.)",
  },
  {
    id: "mark-pa-chattawa",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ป๋า", rom: "pa", toneLabel: "rising", toneMark: "๋",
    options: MARK_OPTIONS, answerIndex: 3,
    explanation_vi: "ป๋า mang dấu ไม้จัตวา (๋) → thanh LÊN (rising). Dấu này ít gặp.",
    explanation_en: "ป๋า carries ไม้จัตวา (๋) → RISING tone. This mark is relatively rare.",
  },
  {
    id: "mark-pa-none",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ปา", rom: "pa", toneLabel: "mid",
    options: MARK_OPTIONS, answerIndex: 4,
    explanation_vi: "ปา KHÔNG có dấu thanh nhưng vẫn mang thanh — ở đây là thanh TRUNG. Không có dấu ≠ không có thanh.",
    explanation_en: "ปา has NO tone mark yet still carries a tone — here the MID tone. No mark ≠ no tone.",
  },
  {
    id: "mark-pho-ek",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "พ่อ", rom: "pho", toneMark: "่",
    options: MARK_OPTIONS, answerIndex: 0,
    explanation_vi: "พ่อ ('bố') mang dấu ไม้เอก (่). Lưu ý พ thuộc phụ âm THẤP, nên mai ek ở đây cho thanh khác với ป่า — dấu giống nhau, thanh khác nhau.",
    explanation_en: "พ่อ ('father') carries ไม้เอก (่). Note พ is a LOW-class consonant, so mai ek here yields a different tone than in ป่า — same mark, different tone.",
  },
  {
    id: "mark-mae-ek",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "แม่", rom: "mae", toneMark: "่",
    options: MARK_OPTIONS, answerIndex: 0,
    explanation_vi: "แม่ ('mẹ') mang dấu ไม้เอก (่).",
    explanation_en: "แม่ ('mother') carries ไม้เอก (่).",
  },
  {
    id: "mark-nam-tho",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "น้ำ", rom: "nam", toneMark: "้",
    options: MARK_OPTIONS, answerIndex: 1,
    explanation_vi: "น้ำ ('nước') mang dấu ไม้โท (้).",
    explanation_en: "น้ำ ('water') carries ไม้โท (้).",
  },
  {
    id: "mark-dai-tho",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ได้", rom: "dai", toneMark: "้",
    options: MARK_OPTIONS, answerIndex: 1,
    explanation_vi: "ได้ ('được') mang dấu ไม้โท (้).",
    explanation_en: "ได้ ('can / to get') carries ไม้โท (้).",
  },
  {
    id: "mark-ha-tho",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ห้า", rom: "ha", toneMark: "้",
    options: MARK_OPTIONS, answerIndex: 1,
    explanation_vi: "ห้า ('năm', số 5) mang dấu ไม้โท (้).",
    explanation_en: "ห้า ('five') carries ไม้โท (้).",
  },
  {
    id: "mark-kha-ek",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ค่ะ", rom: "kha", toneMark: "่",
    options: MARK_OPTIONS, answerIndex: 0,
    explanation_vi: "ค่ะ (tiểu từ lịch sự nữ) mang dấu ไม้เอก (่).",
    explanation_en: "ค่ะ (female polite particle) carries ไม้เอก (่).",
  },
  {
    id: "mark-mai-no-tone-particle",
    type: "identify-tone-mark",
    prompt_vi: "Dấu thanh nào nằm trên từ này?",
    prompt_en: "Which tone mark is on this word?",
    th: "ไม่", rom: "mai", toneMark: "่",
    options: MARK_OPTIONS, answerIndex: 0,
    explanation_vi: "ไม่ ('không') mang dấu ไม้เอก (่). Đừng nhầm với ไม้ ('gỗ') hay ไหม (tiểu từ hỏi) — khác thanh, khác nghĩa.",
    explanation_en: "ไม่ ('no / not') carries ไม้เอก (่). Don't confuse it with ไม้ ('wood') or ไหม (question particle) — different tones, different meanings.",
  },

  // ── choose-meaning (pick the correct gloss) ──────────────────────────
  {
    id: "mean-sawatdi",
    type: "choose-meaning",
    prompt_vi: "สวัสดี nghĩa là gì?",
    prompt_en: "What does สวัสดี mean?",
    th: "สวัสดี", rom: "sawatdi",
    options: ["xin chào / hello", "tạm biệt / goodbye", "cảm ơn / thank you"], answerIndex: 0,
    explanation_vi: "สวัสดี = 'xin chào'. Dùng cho cả chào và tạm biệt thân thiện, nhưng nghĩa gốc là lời chào.",
    explanation_en: "สวัสดี = 'hello'. It can also serve as a friendly farewell, but its core sense is a greeting.",
  },
  {
    id: "mean-khopkhun",
    type: "choose-meaning",
    prompt_vi: "ขอบคุณ nghĩa là gì?",
    prompt_en: "What does ขอบคุณ mean?",
    th: "ขอบคุณ", rom: "khopkhun",
    options: ["xin lỗi / sorry", "cảm ơn / thank you", "làm ơn / please"], answerIndex: 1,
    explanation_vi: "ขอบคุณ = 'cảm ơn'. Thêm ครับ/ค่ะ để lịch sự hơn.",
    explanation_en: "ขอบคุณ = 'thank you'. Add ครับ/ค่ะ to make it more polite.",
  },
  {
    id: "mean-nam",
    type: "choose-meaning",
    prompt_vi: "น้ำ nghĩa là gì?",
    prompt_en: "What does น้ำ mean?",
    th: "น้ำ", rom: "nam", toneLabel: "high",
    options: ["cơm / rice", "nước / water", "trà / tea"], answerIndex: 1,
    explanation_vi: "น้ำ = 'nước'. Mang dấu ไม้โท. Đây là từ rất hay gặp khi ghép: น้ำเงิน (xanh dương), น้ำแข็ง (đá).",
    explanation_en: "น้ำ = 'water'. It takes ไม้โท and appears in many compounds: น้ำเงิน (blue), น้ำแข็ง (ice).",
  },
  {
    id: "mean-khao-rice",
    type: "choose-meaning",
    prompt_vi: "ข้าว nghĩa là gì?",
    prompt_en: "What does ข้าว mean?",
    th: "ข้าว", rom: "khao",
    options: ["cơm / gạo / rice", "tin tức / news", "trắng / white"], answerIndex: 0,
    explanation_vi: "ข้าว = 'cơm/gạo'. Cẩn thận: ขาว ('trắng') và ข่าว ('tin tức') đọc gần giống nhưng khác thanh và nghĩa.",
    explanation_en: "ข้าว = 'rice'. Beware: ขาว ('white') and ข่าว ('news') read similarly but differ in tone and meaning.",
  },
  {
    id: "mean-pai",
    type: "choose-meaning",
    prompt_vi: "ไป nghĩa là gì?",
    prompt_en: "What does ไป mean?",
    th: "ไป", rom: "pai",
    options: ["đến / to come", "đi / to go", "ở lại / to stay"], answerIndex: 1,
    explanation_vi: "ไป = 'đi'. Cặp đôi với มา ('đến').",
    explanation_en: "ไป = 'to go'. Pairs with มา ('to come').",
  },
  {
    id: "mean-aroi",
    type: "choose-meaning",
    prompt_vi: "อร่อย nghĩa là gì?",
    prompt_en: "What does อร่อย mean?",
    th: "อร่อย", rom: "aroi",
    options: ["cay / spicy", "ngon / delicious", "đói / hungry"], answerIndex: 1,
    explanation_vi: "อร่อย = 'ngon'. Một trong những từ hữu ích nhất khi đi ăn ở Thái Lan.",
    explanation_en: "อร่อย = 'delicious'. One of the most useful words when eating out in Thailand.",
  },
  {
    id: "mean-phaeng",
    type: "choose-meaning",
    prompt_vi: "แพง nghĩa là gì?",
    prompt_en: "What does แพง mean?",
    th: "แพง", rom: "phaeng",
    options: ["rẻ / cheap", "đắt / expensive", "đẹp / beautiful"], answerIndex: 1,
    explanation_vi: "แพง = 'đắt'. Trái nghĩa với ถูก ('rẻ', cũng nghĩa 'đúng').",
    explanation_en: "แพง = 'expensive'. Opposite of ถูก ('cheap', which also means 'correct').",
  },
  {
    id: "mean-rongraem",
    type: "choose-meaning",
    prompt_vi: "โรงแรม nghĩa là gì?",
    prompt_en: "What does โรงแรม mean?",
    th: "โรงแรม", rom: "rongraem",
    options: ["bệnh viện / hospital", "trường học / school", "khách sạn / hotel"], answerIndex: 2,
    explanation_vi: "โรงแรม = 'khách sạn'. Tiền tố โรง- xuất hiện trong nhiều nơi chốn: โรงเรียน (trường), โรงพยาบาล (bệnh viện).",
    explanation_en: "โรงแรม = 'hotel'. The prefix โรง- appears in many places: โรงเรียน (school), โรงพยาบาล (hospital).",
  },
  {
    id: "mean-hongnam",
    type: "choose-meaning",
    prompt_vi: "ห้องน้ำ nghĩa là gì?",
    prompt_en: "What does ห้องน้ำ mean?",
    th: "ห้องน้ำ", rom: "hong nam",
    options: ["nhà bếp / kitchen", "nhà vệ sinh / toilet", "phòng ngủ / bedroom"], answerIndex: 1,
    explanation_vi: "ห้องน้ำ = 'nhà vệ sinh' (nghĩa đen: 'phòng nước'). Câu cứu cánh: ห้องน้ำอยู่ที่ไหน (nhà vệ sinh ở đâu?).",
    explanation_en: "ห้องน้ำ = 'toilet' (literally 'water room'). Lifesaver phrase: ห้องน้ำอยู่ที่ไหน (where is the toilet?).",
  },
  {
    id: "mean-thaorai",
    type: "choose-meaning",
    prompt_vi: "เท่าไหร่ nghĩa là gì?",
    prompt_en: "What does เท่าไหร่ mean?",
    th: "เท่าไหร่", rom: "thaorai",
    options: ["ở đâu / where", "bao nhiêu / how much", "khi nào / when"], answerIndex: 1,
    explanation_vi: "เท่าไหร่ = 'bao nhiêu (tiền)'. Hỏi giá: ราคาเท่าไหร่ / อันนี้เท่าไหร่.",
    explanation_en: "เท่าไหร่ = 'how much'. Asking a price: ราคาเท่าไหร่ / อันนี้เท่าไหร่.",
  },
  {
    id: "mean-mai-no",
    type: "choose-meaning",
    prompt_vi: "ไม่ nghĩa là gì?",
    prompt_en: "What does ไม่ mean?",
    th: "ไม่", rom: "mai", toneLabel: "falling",
    options: ["có / yes", "không (phủ định) / no, not", "gỗ / wood"], answerIndex: 1,
    explanation_vi: "ไม่ = 'không' (phủ định). Đây chỉ là MỘT trong nhiều âm 'mai': ไม้ (gỗ), ไหม (tiểu từ hỏi), ใหม่ (mới) — mỗi từ khác thanh, khác nghĩa.",
    explanation_en: "ไม่ = 'no / not' (negation). This is only ONE of several 'mai' words: ไม้ (wood), ไหม (question particle), ใหม่ (new) — each a different tone and meaning.",
  },
  {
    id: "mean-rongrian",
    type: "choose-meaning",
    prompt_vi: "โรงเรียน nghĩa là gì?",
    prompt_en: "What does โรงเรียน mean?",
    th: "โรงเรียน", rom: "rongrian",
    options: ["trường học / school", "chợ / market", "ngân hàng / bank"], answerIndex: 0,
    explanation_vi: "โรงเรียน = 'trường học'. Động từ liên quan: เรียน ('học').",
    explanation_en: "โรงเรียน = 'school'. Related verb: เรียน ('to study').",
  },

  // ── match-romanization (pick the correct reading aid) ────────────────
  {
    id: "rom-khorkhun",
    type: "match-romanization",
    prompt_vi: "Cách đọc (romanization) nào khớp với ขอบคุณ?",
    prompt_en: "Which romanization matches ขอบคุณ?",
    th: "ขอบคุณ",
    options: ["khopkhun", "khothot", "khrap"], answerIndex: 0,
    explanation_vi: "ขอบคุณ ≈ 'khopkhun'. Romanization chỉ giúp đọc gần đúng; KHÔNG ghi thanh điệu.",
    explanation_en: "ขอบคุณ ≈ 'khopkhun'. Romanization is only an approximate reading aid; it does NOT encode tone.",
  },
  {
    id: "rom-sanambin",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với สนามบิน?",
    prompt_en: "Which romanization matches สนามบิน?",
    th: "สนามบิน",
    options: ["sathani", "sanambin", "sapda"], answerIndex: 1,
    explanation_vi: "สนามบิน ≈ 'sanambin' ('sân bay'). สนาม = sân/bãi, บิน = bay.",
    explanation_en: "สนามบิน ≈ 'sanambin' ('airport'). สนาม = field, บิน = to fly.",
  },
  {
    id: "rom-khrueangbin",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với เครื่องบิน?",
    prompt_en: "Which romanization matches เครื่องบิน?",
    th: "เครื่องบิน",
    options: ["khrueang bin", "rot fai", "thaeksi"], answerIndex: 0,
    explanation_vi: "เครื่องบิน ≈ 'khrueang bin' ('máy bay').",
    explanation_en: "เครื่องบิน ≈ 'khrueang bin' ('airplane').",
  },
  {
    id: "rom-phonlamai",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với ผลไม้?",
    prompt_en: "Which romanization matches ผลไม้?",
    th: "ผลไม้",
    options: ["phonlamai", "phak", "ahan"], answerIndex: 0,
    explanation_vi: "ผลไม้ ≈ 'phonlamai' ('trái cây'). Lưu ý ไม้ ở cuối ('gỗ/cây') khác với ไม่ ('không').",
    explanation_en: "ผลไม้ ≈ 'phonlamai' ('fruit'). Note the final ไม้ ('wood') differs from ไม่ ('not').",
  },
  {
    id: "rom-thanakhan",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với ธนาคาร?",
    prompt_en: "Which romanization matches ธนาคาร?",
    th: "ธนาคาร",
    options: ["talat", "thanakhan", "thanon"], answerIndex: 1,
    explanation_vi: "ธนาคาร ≈ 'thanakhan' ('ngân hàng'). Đừng nhầm với ถนน ('thanon', đường).",
    explanation_en: "ธนาคาร ≈ 'thanakhan' ('bank'). Don't confuse with ถนน ('thanon', road).",
  },
  {
    id: "rom-pharuehat",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với วันพฤหัสบดี?",
    prompt_en: "Which romanization matches วันพฤหัสบดี?",
    th: "วันพฤหัสบดี",
    options: ["wan suk", "wan phut", "wan pharuehat"], answerIndex: 2,
    explanation_vi: "วันพฤหัสบดี ≈ 'wan pharuehat' ('thứ Năm'). Tên các ngày bắt đầu bằng วัน ('ngày').",
    explanation_en: "วันพฤหัสบดี ≈ 'wan pharuehat' ('Thursday'). Day names start with วัน ('day').",
  },
  {
    id: "rom-kuaitiao",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với ก๋วยเตี๋ยว?",
    prompt_en: "Which romanization matches ก๋วยเตี๋ยว?",
    th: "ก๋วยเตี๋ยว",
    options: ["kuaitiao", "tom yam", "kafae"], answerIndex: 0,
    explanation_vi: "ก๋วยเตี๋ยว ≈ 'kuaitiao' ('phở / mì nước'). Chú ý cả hai âm tiết đều mang dấu ไม้จัตวา (๋).",
    explanation_en: "ก๋วยเตี๋ยว ≈ 'kuaitiao' ('noodle soup'). Note both syllables carry ไม้จัตวา (๋).",
  },
  {
    id: "rom-phuean",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với เพื่อน?",
    prompt_en: "Which romanization matches เพื่อน?",
    th: "เพื่อน",
    options: ["phuean", "phom", "phi"], answerIndex: 0,
    explanation_vi: "เพื่อน ≈ 'phuean' ('bạn'). Nguyên âm เ–ือ đọc như 'ưa'.",
    explanation_en: "เพื่อน ≈ 'phuean' ('friend'). The vowel เ–ือ reads like 'uea'.",
  },
  {
    id: "rom-rongphayaban",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với โรงพยาบาล?",
    prompt_en: "Which romanization matches โรงพยาบาล?",
    th: "โรงพยาบาล",
    options: ["rongraem", "rongphayaban", "rongrian"], answerIndex: 1,
    explanation_vi: "โรงพยาบาล ≈ 'rongphayaban' ('bệnh viện'). Cả ba lựa chọn đều bắt đầu bằng โรง-.",
    explanation_en: "โรงพยาบาล ≈ 'rongphayaban' ('hospital'). All three options start with โรง-.",
  },
  {
    id: "rom-khaochai",
    type: "match-romanization",
    prompt_vi: "Cách đọc nào khớp với เข้าใจ?",
    prompt_en: "Which romanization matches เข้าใจ?",
    th: "เข้าใจ",
    options: ["khao chai", "khit", "khian"], answerIndex: 0,
    explanation_vi: "เข้าใจ ≈ 'khao chai' ('hiểu'). Câu phủ định: ไม่เข้าใจ ('không hiểu').",
    explanation_en: "เข้าใจ ≈ 'khao chai' ('to understand'). Negative: ไม่เข้าใจ ('don't understand').",
  },

  // ── tone-warning (true/false awareness of a tone pitfall) ────────────
  {
    id: "warn-mark-one-tone",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Mỗi dấu thanh Thái luôn tương ứng với đúng MỘT thanh điệu.",
    prompt_en: "True or false: Each Thai tone mark always maps to exactly ONE tone.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Thanh phụ thuộc cả vào NHÓM phụ âm đầu (cao/trung/thấp). Ví dụ mai ek trên ป (trung) và trên พ (thấp) cho thanh khác nhau.",
    explanation_en: "FALSE. The tone also depends on the initial consonant CLASS (high/mid/low). E.g. mai ek on ป (mid) vs พ (low) yields different tones.",
  },
  {
    id: "warn-no-mark-no-tone",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Nếu một từ Thái không có dấu thanh thì nó không có thanh điệu.",
    prompt_en: "True or false: If a Thai word has no tone mark, it has no tone.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Từ không dấu vẫn mang thanh — suy ra từ nhóm phụ âm, âm tiết sống/chết và độ dài nguyên âm. Ví dụ ปา là thanh trung.",
    explanation_en: "FALSE. An unmarked word still has a tone — derived from consonant class, live/dead syllable, and vowel length. E.g. ปา is mid tone.",
  },
  {
    id: "warn-rom-encodes-tone",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Romanization trong app này cho biết thanh điệu của từ.",
    prompt_en: "True or false: The romanization in this app tells you the word's tone.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Romanization ở đây chỉ là gợi ý đọc thô, KHÔNG ghi thanh. Hãy đọc chữ Thái và bối cảnh để biết thanh.",
    explanation_en: "FALSE. The romanization here is a rough reading aid only and does NOT encode tone. Read the Thai script and context for tone.",
  },
  {
    id: "warn-thai-equals-viet",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Có thể bê nguyên 6 thanh tiếng Việt sang dùng cho tiếng Thái.",
    prompt_en: "True or false: You can copy Vietnamese's 6 tones directly onto Thai.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Thái có 5 thanh, hình dáng cao độ và điểm bắt đầu khác. So sánh chỉ là điểm tựa ban đầu, không phải ánh xạ 1-1.",
    explanation_en: "FALSE. Thai has 5 tones with different contour shapes and starting pitches. Comparisons are only starting anchors, not a 1-to-1 map.",
  },
  {
    id: "warn-app-scores-tone",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Các bài tập này chấm điểm cách bạn PHÁT ÂM thanh điệu.",
    prompt_en: "True or false: These drills score how you PRONOUNCE tones.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Đây hoàn toàn là bài tập NHẬN BIẾT bằng chữ viết — không micro, không âm thanh, không chấm phát âm. Muốn luyện âm, hãy nghe người bản xứ.",
    explanation_en: "FALSE. These are purely WRITTEN recognition drills — no mic, no audio, no pronunciation scoring. To train sound, listen to native speakers.",
  },
  {
    id: "warn-falling-equals-huyen",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Thanh 'xuống' (falling) của Thái giống y hệt thanh 'huyền' của tiếng Việt.",
    prompt_en: "True or false: Thai's falling tone is identical to Vietnamese huyền.",
    options: TF_OPTIONS, answerIndex: 1,
    explanation_vi: "SAI. Thanh xuống của Thái bắt đầu CAO rồi rơi; thanh huyền bắt đầu thấp, đi xuống nhẹ. Gần giống nhưng không bằng.",
    explanation_en: "FALSE. Thai falling starts HIGH then drops; huyền starts low and trails down gently. Similar but not equal.",
  },
  {
    id: "warn-tone-changes-meaning",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Đổi thanh của một âm tiết Thái có thể đổi hoàn toàn nghĩa của nó.",
    prompt_en: "True or false: Changing the tone of a Thai syllable can completely change its meaning.",
    options: TF_OPTIONS, answerIndex: 0,
    explanation_vi: "ĐÚNG. Ví dụ เสือ ('hổ') và เสื้อ ('áo') chỉ khác thanh. Đây là lý do thanh điệu rất quan trọng.",
    explanation_en: "TRUE. E.g. เสือ ('tiger') vs เสื้อ ('shirt') differ only by tone. This is why tone matters so much.",
  },
  {
    id: "warn-viet-advantage",
    type: "tone-warning",
    prompt_vi: "Đúng hay sai: Người nói tiếng Việt thường dễ chấp nhận ý tưởng 'thanh điệu đổi nghĩa' hơn người nói tiếng Anh.",
    prompt_en: "True or false: Vietnamese speakers usually accept 'tone changes meaning' more readily than English speakers.",
    options: TF_OPTIONS, answerIndex: 0,
    explanation_vi: "ĐÚNG (nói chung). Tiếng Việt cũng có thanh điệu nên khái niệm này quen thuộc — nhưng vẫn phải học LẠI hình dáng từng thanh Thái.",
    explanation_en: "TRUE (generally). Vietnamese is also tonal, so the concept is familiar — but each Thai tone's shape must still be re-learned.",
  },

  // ── written-contrast (minimal pair: which spelling means X?) ─────────
  {
    id: "contrast-near",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'gần'?",
    prompt_en: "Which word means 'near'?",
    options: ["ไกล (klai)", "ใกล้ (klai)"], answerIndex: 1,
    explanation_vi: "ใกล้ = 'gần' (thanh xuống); ไกล = 'xa' (thanh trung). Cặp nổi tiếng đọc gần giống nhau, chỉ khác thanh. (Chữ viết để phân biệt nghĩa, không dạy âm.)",
    explanation_en: "ใกล้ = 'near' (falling); ไกล = 'far' (mid). A famous near-homophone pair differing by tone. (Written contrast for meaning; not teaching the sound.)",
  },
  {
    id: "contrast-far",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'xa'?",
    prompt_en: "Which word means 'far'?",
    options: ["ไกล (klai)", "ใกล้ (klai)"], answerIndex: 0,
    explanation_vi: "ไกล = 'xa' (thanh trung, không dấu). So với ใกล้ = 'gần' (thanh xuống, mai tho).",
    explanation_en: "ไกล = 'far' (mid, unmarked). Compare ใกล้ = 'near' (falling, mai tho).",
  },
  {
    id: "contrast-tiger",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'con hổ'?",
    prompt_en: "Which word means 'tiger'?",
    options: ["เสือ (suea)", "เสื้อ (suea)"], answerIndex: 0,
    explanation_vi: "เสือ = 'hổ' (thanh lên / rising); เสื้อ = 'áo' (thanh xuống / falling, mai tho). Chỉ khác dấu thanh.",
    explanation_en: "เสือ = 'tiger' (rising); เสื้อ = 'shirt' (falling, mai tho). They differ only by the tone mark.",
  },
  {
    id: "contrast-shirt",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'áo'?",
    prompt_en: "Which word means 'shirt'?",
    options: ["เสือ (suea)", "เสื้อ (suea)"], answerIndex: 1,
    explanation_vi: "เสื้อ = 'áo' (mang ไม้โท). So với เสือ = 'hổ' (không dấu, thanh lên).",
    explanation_en: "เสื้อ = 'shirt' (with ไม้โท). Compare เสือ = 'tiger' (unmarked, rising).",
  },
  {
    id: "contrast-white",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'trắng'?",
    prompt_en: "Which word means 'white'?",
    options: ["ขาว (khao)", "ข่าว (khao)"], answerIndex: 0,
    explanation_vi: "ขาว = 'trắng' (thanh lên, không dấu); ข่าว = 'tin tức' (mang mai ek). Đọc 'khao' giống nhau, khác thanh.",
    explanation_en: "ขาว = 'white' (rising, unmarked); ข่าว = 'news' (with mai ek). Both read 'khao', different tone.",
  },
  {
    id: "contrast-news",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'tin tức'?",
    prompt_en: "Which word means 'news'?",
    options: ["ขาว (khao)", "ข่าว (khao)"], answerIndex: 1,
    explanation_vi: "ข่าว = 'tin tức' (mai ek). So với ขาว = 'trắng' (không dấu).",
    explanation_en: "ข่าว = 'news' (mai ek). Compare ขาว = 'white' (unmarked).",
  },
  {
    id: "contrast-forest",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'rừng'?",
    prompt_en: "Which word means 'forest'?",
    options: ["ป่า (pa)", "ป้า (pa)"], answerIndex: 0,
    explanation_vi: "ป่า = 'rừng' (mai ek, thanh thấp); ป้า = 'bác/dì' (mai tho, thanh xuống). Cùng âm 'pa', khác dấu thanh.",
    explanation_en: "ป่า = 'forest' (mai ek, low); ป้า = 'aunt' (mai tho, falling). Same 'pa' sound, different tone mark.",
  },
  {
    id: "contrast-aunt",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'bác / dì'?",
    prompt_en: "Which word means 'aunt'?",
    options: ["ป่า (pa)", "ป้า (pa)"], answerIndex: 1,
    explanation_vi: "ป้า = 'bác/dì' (mai tho). So với ป่า = 'rừng' (mai ek).",
    explanation_en: "ป้า = 'aunt' (mai tho). Compare ป่า = 'forest' (mai ek).",
  },
  {
    id: "contrast-not",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'không' (phủ định)?",
    prompt_en: "Which word means 'no / not' (negation)?",
    options: ["ไม่ (mai)", "ไม้ (mai)"], answerIndex: 0,
    explanation_vi: "ไม่ = 'không' (mai ek, thanh xuống); ไม้ = 'gỗ/cây' (mai tho, thanh cao). Khác thanh, khác nghĩa hoàn toàn.",
    explanation_en: "ไม่ = 'no / not' (mai ek, falling); ไม้ = 'wood' (mai tho, high). Different tone, completely different meaning.",
  },
  {
    id: "contrast-wood",
    type: "written-contrast",
    prompt_vi: "Từ nào nghĩa là 'gỗ / cây'?",
    prompt_en: "Which word means 'wood'?",
    options: ["ไม่ (mai)", "ไม้ (mai)"], answerIndex: 1,
    explanation_vi: "ไม้ = 'gỗ/cây' (mai tho). So với ไม่ = 'không' (mai ek). Đây là một trong nhóm 'mai' dễ lẫn.",
    explanation_en: "ไม้ = 'wood' (mai tho). Compare ไม่ = 'no/not' (mai ek). Part of the easily-confused 'mai' group.",
  },
];

export default THAI_TONE_DRILLS;
