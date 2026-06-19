// src/languages/thai/diagnosticPrompts.ts
//
// Thai diagnostic prompt bank. Each prompt is a short elicitation task that
// surfaces ONE likely weakness (particles, word order, classifiers, tone
// awareness, politeness, pronouns, time markers, negation, reading, writing,
// survival). Use the responses to decide what a learner should study next.
//
// Every prompt carries bilingual instructions (Vietnamese + English), an
// "expected answer shape" (what a correct response looks like), and a scoring
// hint (how to read the answer as a study signal). Lower-level stimuli include
// romanization.
//
// NOT A PLACEMENT TEST OR CERTIFICATION. These prompts are study-support
// diagnostics only — they assign no level and confer no qualification. NATIVE
// REVIEW DEFERRED — teaching draft, not vetted assessment.
//
// Romanization tone diacritics:
//   mid = plain (a) · low = à · falling = â · high = á · rising = ǎ
//   long vowels are doubled (aa).

export type ThaiDiagLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiDiagWeakness =
  | "particles"
  | "word-order"
  | "classifier"
  | "tone-awareness"
  | "politeness"
  | "pronouns"
  | "time-markers"
  | "negation"
  | "reading"
  | "writing"
  | "survival";

export interface ThaiDiagnosticPrompt {
  /** Stable kebab-case id, unique across the bank. */
  id: string;
  level: ThaiDiagLevel;
  /** The single weakness this prompt is designed to surface. */
  weakness: ThaiDiagWeakness;
  /** Vietnamese instruction shown to the learner. */
  instruction_vi: string;
  /** English instruction shown to the learner. */
  instruction_en: string;
  /** Thai-script stimulus (when the prompt presents one). */
  prompt_th?: string;
  /** Romanization of prompt_th (provided where useful, esp. lower levels). */
  prompt_roman?: string;
  /** English gloss of the stimulus. */
  prompt_en?: string;
  /** What a correct/expected answer looks like. */
  expectedShape: string;
  /** How to read the answer as a study signal (study support only). */
  scoringHint: string;
}

export const THAI_DIAG_LEVELS: readonly ThaiDiagLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const THAI_DIAG_WEAKNESSES: readonly ThaiDiagWeakness[] = [
  "particles",
  "word-order",
  "classifier",
  "tone-awareness",
  "politeness",
  "pronouns",
  "time-markers",
  "negation",
  "reading",
  "writing",
  "survival",
] as const;

export const thaiDiagnosticPrompts: ThaiDiagnosticPrompt[] = [
  // ───────────────────────── particles ─────────────────────────
  {
    id: "diag-particles-a1-yesno",
    level: "A1",
    weakness: "particles",
    instruction_vi: "Biến câu này thành câu hỏi Có/Không.",
    instruction_en: "Turn this sentence into a yes/no question.",
    prompt_th: "คุณหิว",
    prompt_roman: "khun hǐw",
    prompt_en: "You are hungry.",
    expectedShape: "คุณหิวไหม (khun hǐw mǎi) — verb + ไหม at the end.",
    scoringHint:
      "Missing ไหม or adding rising intonation only ⇒ study yes/no question particles.",
  },
  {
    id: "diag-particles-a2-softener",
    level: "A2",
    weakness: "particles",
    instruction_vi: "Làm cho câu mệnh lệnh 'รอที่นี่' (đợi ở đây) nghe nhẹ nhàng hơn.",
    instruction_en: "Soften the command 'wait here' so it sounds gentle.",
    prompt_th: "รอที่นี่",
    prompt_roman: "rɔɔ thîi-nîi",
    prompt_en: "Wait here.",
    expectedShape: "รอที่นี่นะ / รอที่นี่นะคะ — add นะ (+ politeness particle).",
    scoringHint: "No softener ⇒ practice นะ and request-softening particles.",
  },
  {
    id: "diag-particles-b1-followup",
    level: "B1",
    weakness: "particles",
    instruction_vi: "Hỏi vặn lại 'còn bạn thì sao?' sau khi đã trả lời.",
    instruction_en: "Bounce the question back: 'and you?'",
    prompt_th: "ฉันสบายดี แล้ว___",
    prompt_roman: "chǎn sà-baai dii, láew ___",
    prompt_en: "I'm fine, and ___?",
    expectedShape: "แล้วคุณล่ะ (láew khun lâ) — uses ...ล่ะ.",
    scoringHint: "Bare 'คุณ?' ⇒ study the follow-up particle ล่ะ.",
  },
  {
    id: "diag-particles-b2-si-encourage",
    level: "B2",
    weakness: "particles",
    instruction_vi: "Khuyến khích bạn 'cứ ăn đi' bằng một tiểu từ phù hợp.",
    instruction_en: "Encourage a friend to 'go ahead and eat' with the right particle.",
    prompt_th: "กิน___",
    prompt_roman: "kin ___",
    prompt_en: "eat (encouraging)",
    expectedShape: "กินสิ (kin sì) — encouragement particle สิ.",
    scoringHint: "Bare กิน sounds curt ⇒ review encouraging particles (สิ).",
  },
  {
    id: "diag-particles-c1-rok-correct",
    level: "C1",
    weakness: "particles",
    instruction_vi: "Đính chính nhẹ một hiểu lầm: 'không phải vậy đâu'.",
    instruction_en: "Gently correct a wrong assumption: 'no, that's not it'.",
    prompt_th: "ไม่ใช่___",
    prompt_roman: "mâi châi ___",
    prompt_en: "no, it's not (softening a correction)",
    expectedShape: "ไม่ใช่หรอก (mâi châi rɔ̀ɔk) — softener หรอก.",
    scoringHint: "Flat ไม่ใช่ ⇒ practice หรอก for face-saving corrections.",
  },

  // ───────────────────────── word-order ─────────────────────────
  {
    id: "diag-wordorder-a1-adj",
    level: "A1",
    weakness: "word-order",
    instruction_vi: "Nói 'nhà to' bằng tiếng Thái.",
    instruction_en: "Say 'a big house' in Thai.",
    prompt_th: "บ้าน + ใหญ่ = ?",
    prompt_roman: "bâan + yài",
    prompt_en: "house + big",
    expectedShape: "บ้านใหญ่ (bâan yài) — noun then adjective.",
    scoringHint: "Adjective placed first (ใหญ่บ้าน) ⇒ drill noun-before-adjective order.",
  },
  {
    id: "diag-wordorder-a2-possessive",
    level: "A2",
    weakness: "word-order",
    instruction_vi: "Nói 'sách của tôi'.",
    instruction_en: "Say 'my book'.",
    prompt_th: "หนังสือ / ของ / ฉัน",
    prompt_roman: "nǎng-sʉ̌ʉ / khɔ̌ɔng / chǎn",
    prompt_en: "book / of / me",
    expectedShape: "หนังสือของฉัน — thing + ของ + owner.",
    scoringHint: "Owner fronted (ฉันหนังสือ) ⇒ study the ของ possessive frame.",
  },
  {
    id: "diag-wordorder-b1-intensifier",
    level: "B1",
    weakness: "word-order",
    instruction_vi: "Nói 'ngon lắm'.",
    instruction_en: "Say 'very delicious'.",
    prompt_th: "อร่อย / มาก",
    prompt_roman: "à-ròi / mâak",
    prompt_en: "delicious / very",
    expectedShape: "อร่อยมาก — adjective then intensifier มาก.",
    scoringHint: "มากอร่อย ⇒ review intensifier-after-adjective order.",
  },
  {
    id: "diag-wordorder-b2-time-front",
    level: "B2",
    weakness: "word-order",
    instruction_vi: "Sắp xếp: 'hôm qua tôi đi làm'.",
    instruction_en: "Order the sentence: 'yesterday I went to work'.",
    prompt_th: "ไปทำงาน / ผม / เมื่อวาน",
    prompt_en: "go-to-work / I / yesterday",
    expectedShape: "เมื่อวานผมไปทำงาน — time word leads (or right after subject).",
    scoringHint: "Time word stranded at end ⇒ study time-expression placement.",
  },
  {
    id: "diag-wordorder-c2-complex-clause",
    level: "C2",
    weakness: "word-order",
    instruction_vi: "Viết lại cho tự nhiên: nhấn mạnh mệnh đề điều kiện ở đầu câu.",
    instruction_en: "Rewrite naturally, fronting the conditional clause.",
    prompt_th: "รัฐบาลจะแก้ปัญหาได้ถ้ามีงบประมาณพอ",
    prompt_en: "The government can solve it if the budget is enough.",
    expectedShape: "ถ้ามีงบประมาณพอ รัฐบาลจึงจะแก้ปัญหาได้ — fronted ถ้า-clause + จึง.",
    scoringHint: "Cannot reorder for emphasis/cohesion ⇒ work on clause fronting & จึง.",
  },

  // ───────────────────────── classifier ─────────────────────────
  {
    id: "diag-classifier-a1-two-books",
    level: "A1",
    weakness: "classifier",
    instruction_vi: "Nói 'hai quyển sách'.",
    instruction_en: "Say 'two books'.",
    prompt_th: "หนังสือ / สอง / ___",
    prompt_roman: "nǎng-sʉ̌ʉ / sɔ̌ɔng / ___",
    prompt_en: "book / two / (classifier)",
    expectedShape: "หนังสือสองเล่ม — noun + number + เล่ม.",
    scoringHint: "Number before noun or no classifier ⇒ drill noun-number-classifier.",
  },
  {
    id: "diag-classifier-a2-people",
    level: "A2",
    weakness: "classifier",
    instruction_vi: "Nói 'ba học sinh'.",
    instruction_en: "Say 'three students'.",
    prompt_th: "นักเรียน / สาม / ___",
    prompt_roman: "nák-rian / sǎam / ___",
    prompt_en: "student / three / (classifier)",
    expectedShape: "นักเรียนสามคน — people take คน.",
    scoringHint: "ตัว used for people ⇒ teach human classifier คน vs animal ตัว.",
  },
  {
    id: "diag-classifier-b1-this-car",
    level: "B1",
    weakness: "classifier",
    instruction_vi: "Nói 'chiếc xe này'.",
    instruction_en: "Say 'this car'.",
    prompt_th: "รถ / ___ / นี้",
    prompt_roman: "rót / ___ / níi",
    prompt_en: "car / (classifier) / this",
    expectedShape: "รถคันนี้ — noun + classifier คัน + นี้.",
    scoringHint: "รถนี้ (no classifier) ⇒ study classifier in demonstrative frame.",
  },
  {
    id: "diag-classifier-b2-which",
    level: "B2",
    weakness: "classifier",
    instruction_vi: "Hỏi 'cái áo nào?'",
    instruction_en: "Ask 'which shirt?'",
    prompt_th: "เสื้อ / ___ / ไหน",
    prompt_en: "shirt / (classifier) / which",
    expectedShape: "เสื้อตัวไหน — noun + classifier ตัว + ไหน.",
    scoringHint: "ไหนเสื้อ / no classifier ⇒ review classifier in question frame.",
  },
  {
    id: "diag-classifier-c1-abstract",
    level: "C1",
    weakness: "classifier",
    instruction_vi: "Nói 'hai vấn đề' với lượng từ phù hợp.",
    instruction_en: "Say 'two issues' with the right classifier.",
    prompt_th: "ปัญหา / สอง / ___",
    prompt_en: "issue / two / (classifier)",
    expectedShape: "ปัญหาสองเรื่อง / สองข้อ — abstract items take เรื่อง or ข้อ.",
    scoringHint: "Defaulting to อัน/ชิ้น for abstractions ⇒ study abstract-noun classifiers.",
  },

  // ───────────────────────── tone-awareness ─────────────────────────
  {
    id: "diag-tone-a1-near-far",
    level: "A1",
    weakness: "tone-awareness",
    instruction_vi: "Phân biệt 'gần' và 'xa' theo thanh điệu.",
    instruction_en: "Distinguish 'near' vs 'far' by tone.",
    prompt_th: "ใกล้ / ไกล",
    prompt_roman: "klâi (falling) / klai (mid)",
    prompt_en: "near / far",
    expectedShape: "ใกล้ = near (falling); ไกล = far (mid).",
    scoringHint: "Pair confused ⇒ this minimal pair flips meaning — drill tones.",
  },
  {
    id: "diag-tone-a2-maa-set",
    level: "A2",
    weakness: "tone-awareness",
    instruction_vi: "Đọc và phân biệt: 'đến / chó / ngựa'.",
    instruction_en: "Read and distinguish: 'come / dog / horse'.",
    prompt_th: "มา / หมา / ม้า",
    prompt_roman: "maa (mid) / mǎa (rising) / máa (high)",
    prompt_en: "come / dog / horse",
    expectedShape: "Correctly map each tone to come/dog/horse.",
    scoringHint: "Same 'maa' merged ⇒ tonal hearing needs work.",
  },
  {
    id: "diag-tone-b1-rice-white",
    level: "B1",
    weakness: "tone-awareness",
    instruction_vi: "Gọi món 'cơm' đúng thanh, đừng thành 'màu trắng'.",
    instruction_en: "Order 'rice' with the right tone, not 'white'.",
    prompt_th: "ข้าว / ขาว / ข่าว",
    prompt_roman: "khâaw (falling) / khǎaw (rising) / khàaw (low)",
    prompt_en: "rice / white / news",
    expectedShape: "ข้าว (falling) for rice.",
    scoringHint: "Wrong tone for rice ⇒ targeted tone drill on food vocab.",
  },
  {
    id: "diag-tone-c1-vowel-length",
    level: "C1",
    weakness: "tone-awareness",
    instruction_vi: "Phân biệt độ dài nguyên âm: 'anh ấy' và 'màu trắng'.",
    instruction_en: "Distinguish vowel length: 'he/they' vs 'white'.",
    prompt_th: "เขา / ขาว",
    prompt_roman: "khǎo (short) / khǎaw (long)",
    prompt_en: "he/they / white",
    expectedShape: "เขา short vowel; ขาว long vowel.",
    scoringHint: "Length collapsed ⇒ practice short vs long vowel contrasts.",
  },
  {
    id: "diag-tone-c2-mai-homophones",
    level: "C2",
    weakness: "tone-awareness",
    instruction_vi: "Phân biệt bộ 'gỗ / mới / cháy / lụa' chỉ bằng thanh.",
    instruction_en: "Distinguish 'wood / new / burn / silk' by tone alone.",
    prompt_th: "ไม้ / ใหม่ / ไหม้ / ไหม",
    prompt_roman: "máai / mài / mâi / mǎi",
    prompt_en: "wood / new / burn / silk",
    expectedShape: "Map all four tones to wood/new/burn/silk.",
    scoringHint: "Benchmark set — if all four are clear, tonal ear is strong.",
  },

  // ───────────────────────── politeness ─────────────────────────
  {
    id: "diag-politeness-a1-particle",
    level: "A1",
    weakness: "politeness",
    instruction_vi: "Thêm tiểu từ lịch sự đúng giới vào 'ขอบคุณ' (cảm ơn).",
    instruction_en: "Add the gender-correct polite particle to 'thank you'.",
    prompt_th: "ขอบคุณ___",
    prompt_roman: "khɔ̀ɔp-khun ___",
    prompt_en: "thank you",
    expectedShape: "ขอบคุณครับ (m) / ขอบคุณค่ะ (f).",
    scoringHint: "Wrong-gender or missing particle ⇒ teach ครับ/ค่ะ by speaker gender.",
  },
  {
    id: "diag-politeness-a2-kha-question",
    level: "A2",
    weakness: "politeness",
    instruction_vi: "Nữ giới: thêm tiểu từ cho CÂU HỎI 'ไปไหน' (đi đâu).",
    instruction_en: "Female speaker: add the particle for the QUESTION 'where to?'",
    prompt_th: "ไปไหน___",
    prompt_roman: "pai nǎi ___",
    prompt_en: "where are you going?",
    expectedShape: "ไปไหนคะ — question คะ (high), not statement ค่ะ.",
    scoringHint: "Using ค่ะ for a question ⇒ teach คะ/ค่ะ tone-function split.",
  },
  {
    id: "diag-politeness-b1-register-eat",
    level: "B1",
    weakness: "politeness",
    instruction_vi: "Chọn từ 'ăn' lịch sự để mời khách.",
    instruction_en: "Choose a polite word for 'eat' to invite a guest.",
    prompt_th: "กิน / ทาน / รับประทาน",
    prompt_roman: "kin / thaan / ráp-prà-thaan",
    prompt_en: "eat (casual/polite/formal)",
    expectedShape: "ทาน (polite) or รับประทาน (formal), not casual กิน.",
    scoringHint: "Always กิน ⇒ introduce the politeness/register ladder.",
  },
  {
    id: "diag-politeness-b2-request-frame",
    level: "B2",
    weakness: "politeness",
    instruction_vi: "Nhờ lịch sự: 'làm ơn giúp tôi'.",
    instruction_en: "Make a polite request: 'please help me'.",
    prompt_th: "___ ช่วยผมหน่อย___",
    prompt_roman: "___ chûai phǒm nɔ̀i ___",
    prompt_en: "please help me a little",
    expectedShape: "ช่วยผมหน่อยได้ไหมครับ — softeners หน่อย + ได้ไหม + particle.",
    scoringHint: "Bare imperative ⇒ build the polite-request frame (หน่อย/ได้ไหม).",
  },
  {
    id: "diag-politeness-c2-formal-decline",
    level: "C2",
    weakness: "politeness",
    instruction_vi: "Từ chối trang trọng một lời mời trong email công việc.",
    instruction_en: "Decline an invitation formally in a work email.",
    prompt_th: "บริบท: อีเมลทางการ",
    prompt_en: "Context: formal email",
    expectedShape:
      "ต้องขออภัยที่ไม่สามารถเข้าร่วมได้ … (formal apology + reason + goodwill), no spoken particles.",
    scoringHint: "Casual particles/slang in formal decline ⇒ work on written register.",
  },

  // ───────────────────────── pronouns ─────────────────────────
  {
    id: "diag-pronouns-a1-gender-i",
    level: "A1",
    weakness: "pronouns",
    instruction_vi: "Chọn đại từ 'tôi' đúng giới của bạn rồi nói 'tôi đói'.",
    instruction_en: "Pick the gender-correct 'I' and say 'I'm hungry'.",
    prompt_th: "___ หิว",
    prompt_roman: "___ hǐw",
    prompt_en: "I'm hungry",
    expectedShape: "ผมหิว (m) / ฉันหิว (f).",
    scoringHint: "Wrong-gender 'I' ⇒ teach gendered ผม vs ฉัน.",
  },
  {
    id: "diag-pronouns-a2-kin-address",
    level: "A2",
    weakness: "pronouns",
    instruction_vi: "Gọi người lớn tuổi hơn và hỏi tuổi.",
    instruction_en: "Address someone older and ask their age.",
    prompt_th: "___ อายุเท่าไหร่",
    prompt_roman: "___ aa-yú thâo-rài",
    prompt_en: "how old are you?",
    expectedShape: "พี่อายุเท่าไหร่ — kin term พี่ for an older person.",
    scoringHint: "Defaulting to คุณ for everyone ⇒ teach พี่/น้อง by relative age.",
  },
  {
    id: "diag-pronouns-b1-drop-subject",
    level: "B1",
    weakness: "pronouns",
    instruction_vi: "Rút gọn câu lặp chủ ngữ: 'Tôi thích cà phê. Tôi uống mỗi ngày.'",
    instruction_en: "Trim the repeated subject: 'I like coffee. I drink it daily.'",
    prompt_th: "ผมชอบกาแฟ ผมดื่มทุกวัน",
    prompt_roman: "phǒm chɔ̂ɔp kaa-fɛɛ, phǒm dʉ̀ʉm thúk wan",
    prompt_en: "I like coffee; I drink it every day.",
    expectedShape: "ผมชอบกาแฟ ดื่มทุกวัน — drop the second ผม.",
    scoringHint: "Subject repeated each clause ⇒ teach Thai pro-drop.",
  },
  {
    id: "diag-pronouns-b2-young-female-nuu",
    level: "B2",
    weakness: "pronouns",
    instruction_vi: "Một cô gái trẻ nói với người lớn tuổi: tự xưng khiêm tốn.",
    instruction_en: "A young woman speaking to elders: choose the humble self-term.",
    prompt_th: "___ ไม่เข้าใจค่ะ",
    prompt_roman: "___ mâi khâo-jai khâ",
    prompt_en: "I don't understand.",
    expectedShape: "หนูไม่เข้าใจค่ะ — humble หนู with elders.",
    scoringHint: "Using ผม (wrong gender) or stiff ดิฉัน with family ⇒ teach หนู.",
  },
  {
    id: "diag-pronouns-c1-register-shift",
    level: "C1",
    weakness: "pronouns",
    instruction_vi: "Chọn đại từ phù hợp trong phát biểu trang trọng trước công chúng.",
    instruction_en: "Choose the right pronoun for a formal public speech.",
    prompt_th: "บริบท: กล่าวสุนทรพจน์",
    prompt_en: "Context: a formal speech",
    expectedShape: "กระผม (m, formal) / ดิฉัน (f, formal) for the audience.",
    scoringHint: "Casual ผม/ฉัน in formal oratory ⇒ teach elevated self-pronouns.",
  },

  // ───────────────────────── time-markers ─────────────────────────
  {
    id: "diag-time-a1-past-word",
    level: "A1",
    weakness: "time-markers",
    instruction_vi: "Nói 'hôm qua tôi đi' (không chia động từ).",
    instruction_en: "Say 'yesterday I went' (no verb conjugation).",
    prompt_th: "___ ผมไป",
    prompt_roman: "___ phǒm pai",
    prompt_en: "yesterday I went",
    expectedShape: "เมื่อวานผมไป — time word เมื่อวาน, bare verb.",
    scoringHint: "Trying to inflect the verb ⇒ teach time words carry tense.",
  },
  {
    id: "diag-time-a2-laew-done",
    level: "A2",
    weakness: "time-markers",
    instruction_vi: "Nói 'ăn cơm rồi'.",
    instruction_en: "Say '(I) already ate'.",
    prompt_th: "กินข้าว___",
    prompt_roman: "kin khâaw ___",
    prompt_en: "already ate",
    expectedShape: "กินข้าวแล้ว — completion แล้ว at the end.",
    scoringHint: "แล้ว misplaced ⇒ teach completion marker position.",
  },
  {
    id: "diag-time-b1-progressive",
    level: "B1",
    weakness: "time-markers",
    instruction_vi: "Nói 'tôi đang ăn'.",
    instruction_en: "Say 'I am eating (now)'.",
    prompt_th: "ผม___กิน___",
    prompt_roman: "phǒm ___ kin ___",
    prompt_en: "I am eating",
    expectedShape: "ผมกำลังกินอยู่ — กำลัง … อยู่ frame.",
    scoringHint: "Inserting เป็น ('be') ⇒ teach กำลัง…อยู่ progressive.",
  },
  {
    id: "diag-time-b2-future-vs-done",
    level: "B2",
    weakness: "time-markers",
    instruction_vi: "Nói 'ngày mai tôi sẽ đi' (đừng nhầm với 'đã ... rồi').",
    instruction_en: "Say 'tomorrow I will go' (don't confuse with 'already').",
    prompt_th: "พรุ่งนี้ผม___ไป",
    prompt_roman: "phrûng-níi phǒm ___ pai",
    prompt_en: "tomorrow I will go",
    expectedShape: "พรุ่งนี้ผมจะไป — future จะ before the verb.",
    scoringHint: "Using แล้ว for future ⇒ contrast จะ (future) vs แล้ว (done).",
  },
  {
    id: "diag-time-c2-aspect-nuance",
    level: "C2",
    weakness: "time-markers",
    instruction_vi: "Diễn đạt 'vừa mới làm xong thì...' với sắc thái thời gian tinh tế.",
    instruction_en: "Express 'had just finished when…' with precise aspect.",
    prompt_th: "บริบท: เล่าเหตุการณ์ต่อเนื่อง",
    prompt_en: "Context: narrating sequenced events",
    expectedShape: "เพิ่งจะ…เสร็จ ก็…พอดี — เพิ่ง (just) + ก็…พอดี for immediacy.",
    scoringHint: "Only แล้ว available ⇒ expand aspect range (เพิ่ง, พอดี, ก็).",
  },

  // ───────────────────────── negation ─────────────────────────
  {
    id: "diag-neg-a1-verb",
    level: "A1",
    weakness: "negation",
    instruction_vi: "Nói 'tôi không đi'.",
    instruction_en: "Say 'I'm not going'.",
    prompt_th: "ผม___ไป",
    prompt_roman: "phǒm ___ pai",
    prompt_en: "I'm not going",
    expectedShape: "ผมไม่ไป — ไม่ before the verb.",
    scoringHint: "ไม่ at the end ⇒ teach pre-verbal ไม่.",
  },
  {
    id: "diag-neg-a2-noun",
    level: "A2",
    weakness: "negation",
    instruction_vi: "Nói 'tôi không phải học sinh'.",
    instruction_en: "Say 'I'm not a student'.",
    prompt_th: "ผม___นักเรียน",
    prompt_roman: "phǒm ___ nák-rian",
    prompt_en: "I'm not a student",
    expectedShape: "ผมไม่ใช่นักเรียน — ไม่ใช่ negates a noun.",
    scoringHint: "Bare ไม่ before a noun ⇒ teach ไม่ใช่ for identity.",
  },
  {
    id: "diag-neg-b1-not-yet",
    level: "B1",
    weakness: "negation",
    instruction_vi: "Nói 'tôi chưa ăn'.",
    instruction_en: "Say 'I haven't eaten yet'.",
    prompt_th: "ผม___กิน",
    prompt_roman: "phǒm ___ kin",
    prompt_en: "I haven't eaten yet",
    expectedShape: "ผมยังไม่กิน — ยังไม่ before the verb.",
    scoringHint: "ยัง stranded or omitted ⇒ teach ยังไม่ ('not yet').",
  },
  {
    id: "diag-neg-b2-skill-vs-circumstance",
    level: "B2",
    weakness: "negation",
    instruction_vi: "Nói 'tôi không biết bơi' (thiếu kỹ năng).",
    instruction_en: "Say 'I can't swim' (lack the skill).",
    prompt_th: "ผมว่ายน้ำ___",
    prompt_roman: "phǒm wâai-náam ___",
    prompt_en: "I can't swim (don't know how)",
    expectedShape: "ผมว่ายน้ำไม่เป็น — ไม่เป็น for missing skill.",
    scoringHint: "Using ไม่ได้ for a skill ⇒ contrast ไม่เป็น vs ไม่ได้.",
  },
  {
    id: "diag-neg-c1-past-didnt",
    level: "C1",
    weakness: "negation",
    instruction_vi: "Nói 'hôm qua tôi đã không đi'.",
    instruction_en: "Say 'yesterday I didn't go'.",
    prompt_th: "เมื่อวานผม___ไป",
    prompt_roman: "mʉ̂a-waan phǒm ___ pai",
    prompt_en: "yesterday I didn't go",
    expectedShape: "เมื่อวานผมไม่ได้ไป — ไม่ได้ + verb for past 'didn't'.",
    scoringHint: "Bare ไม่ไป (= refuse/won't) ⇒ teach ไม่ได้ for past negation.",
  },

  // ───────────────────────── reading ─────────────────────────
  {
    id: "diag-reading-a2-sign",
    level: "A2",
    weakness: "reading",
    instruction_vi: "Đọc biển và cho biết ý nghĩa.",
    instruction_en: "Read the sign and state its meaning.",
    prompt_th: "ห้ามสูบบุหรี่",
    prompt_roman: "hâam sùup bù-rìi",
    prompt_en: "No smoking",
    expectedShape: "'No smoking' / cấm hút thuốc — recognizes ห้าม ('prohibited').",
    scoringHint: "Misreads ห้าม ⇒ build a sight-word set of common public signs.",
  },
  {
    id: "diag-reading-b1-short-note",
    level: "B1",
    weakness: "reading",
    instruction_vi: "Đọc tin nhắn và trả lời: gặp nhau ở đâu?",
    instruction_en: "Read the message and answer: where do they meet?",
    prompt_th: "เจอกันหน้าร้านสะดวกซื้อนะ",
    prompt_roman: "jəə kan nâa ráan sà-dùak-sʉ́ʉ ná",
    prompt_en: "Let's meet in front of the convenience store.",
    expectedShape: "In front of the convenience store (หน้าร้านสะดวกซื้อ).",
    scoringHint: "Misses หน้า ('in front of') ⇒ practice location prepositions in text.",
  },
  {
    id: "diag-reading-b2-main-idea",
    level: "B2",
    weakness: "reading",
    instruction_vi: "Đọc đoạn và nêu ý chính.",
    instruction_en: "Read the paragraph and give the main idea.",
    prompt_th:
      "แม้ราคาจะสูงขึ้น แต่ผู้คนก็ยังซื้อสินค้านี้เพราะเชื่อมั่นในคุณภาพ",
    prompt_en:
      "Although prices rose, people still buy this product because they trust its quality.",
    expectedShape:
      "Main idea: quality trust outweighs the price rise (reads แม้…แต่ concession).",
    scoringHint: "Misses the concessive แม้…แต่ ⇒ teach contrast-marker comprehension.",
  },
  {
    id: "diag-reading-c1-inference",
    level: "C1",
    weakness: "reading",
    instruction_vi: "Suy luận thái độ của tác giả từ đoạn văn.",
    instruction_en: "Infer the author's attitude from the passage.",
    prompt_th:
      "ตัวเลขดูสวยหรู ทว่าเบื้องหลังกลับซ่อนปัญหาที่ไม่มีใครพูดถึง",
    prompt_en:
      "The figures look glossy, yet behind them hide problems no one mentions.",
    expectedShape: "Attitude: skeptical/critical (anchored by ทว่า + ซ่อนปัญหา).",
    scoringHint: "Takes figures at face value ⇒ work on tone/inference with ทว่า.",
  },
  {
    id: "diag-reading-c2-irony",
    level: "C2",
    weakness: "reading",
    instruction_vi: "Xác định giọng điệu (có mỉa mai không?).",
    instruction_en: "Identify the tone (is it ironic?).",
    prompt_th: "ดีจริงนะ ทำงานหนักทั้งปีเพื่อจะได้โบนัสพอซื้อกาแฟแก้วเดียว",
    prompt_en:
      "Great indeed — work hard all year for a bonus that buys a single coffee.",
    expectedShape: "Tone: sarcastic/ironic (surface praise ดีจริง undercut by the absurd payoff).",
    scoringHint: "Reads ดีจริง literally ⇒ practice detecting irony cues.",
  },

  // ───────────────────────── writing ─────────────────────────
  {
    id: "diag-writing-a1-self-intro",
    level: "A1",
    weakness: "writing",
    instruction_vi: "Viết 2 câu: tên và quốc tịch.",
    instruction_en: "Write 2 sentences: name and nationality.",
    prompt_th: "(เขียนแนะนำตัว)",
    prompt_roman: "(self-introduction)",
    prompt_en: "Introduce yourself.",
    expectedShape: "ฉันชื่อ… / ฉันเป็นคน… — two well-formed sentences.",
    scoringHint: "Missing ชื่อ or เป็นคน ⇒ drill the basic introduction frame.",
  },
  {
    id: "diag-writing-a2-routine",
    level: "A2",
    weakness: "writing",
    instruction_vi: "Viết 3 câu về thói quen buổi sáng.",
    instruction_en: "Write 3 sentences about your morning routine.",
    prompt_th: "(กิจวัตรตอนเช้า)",
    prompt_roman: "(morning routine)",
    prompt_en: "Your morning routine.",
    expectedShape: "Three sentences with time words + bare verbs, linked by แล้ว/แล้วก็.",
    scoringHint: "No connectors or over-tensed verbs ⇒ teach sequencing connectors.",
  },
  {
    id: "diag-writing-b1-past-event",
    level: "B1",
    weakness: "writing",
    instruction_vi: "Viết 4-5 câu kể về một ngày cuối tuần.",
    instruction_en: "Write 4–5 sentences narrating a weekend.",
    prompt_th: "(เล่าเรื่องสุดสัปดาห์)",
    prompt_en: "Narrate a weekend.",
    expectedShape: "Cohesive narrative with past time markers and one evaluative clause.",
    scoringHint: "Flat list, no opinion ⇒ work on cohesion + evaluation.",
  },
  {
    id: "diag-writing-b2-opinion-para",
    level: "B2",
    weakness: "writing",
    instruction_vi: "Viết một đoạn nêu quan điểm + 2 lý do.",
    instruction_en: "Write a paragraph stating an opinion + 2 reasons.",
    prompt_th: "(ย่อหน้าแสดงความคิดเห็น)",
    prompt_en: "An opinion paragraph.",
    expectedShape:
      "Thesis + two reasons + discourse markers (นอกจากนี้/ดังนั้น).",
    scoringHint: "One reason or no markers ⇒ teach paragraph structure & connectors.",
  },
  {
    id: "diag-writing-c2-nuanced",
    level: "C2",
    weakness: "writing",
    instruction_vi: "Viết bình luận phản biện một định kiến, giọng điệu cân nhắc.",
    instruction_en: "Write a commentary rebutting a cliché, with measured tone.",
    prompt_th: "(บทวิจารณ์เชิงโต้แย้ง)",
    prompt_en: "An argumentative commentary.",
    expectedShape:
      "Concession + layered rebuttal, idiomatic & cohesive, no slang/register slips.",
    scoringHint: "Register slips or calqued connectors ⇒ refine formal written voice.",
  },

  // ───────────────────────── survival ─────────────────────────
  {
    id: "diag-survival-a1-greeting",
    level: "A1",
    weakness: "survival",
    instruction_vi: "Chào hỏi cơ bản khi gặp người mới.",
    instruction_en: "Give a basic greeting when meeting someone.",
    prompt_th: "(ทักทาย)",
    prompt_roman: "(greeting)",
    prompt_en: "Greet someone.",
    expectedShape: "สวัสดีครับ/ค่ะ — greeting + polite particle.",
    scoringHint: "No particle / wrong word ⇒ lock in the core greeting.",
  },
  {
    id: "diag-survival-a2-price",
    level: "A2",
    weakness: "survival",
    instruction_vi: "Hỏi giá một món đồ ở chợ.",
    instruction_en: "Ask the price of an item at a market.",
    prompt_th: "อันนี้___",
    prompt_roman: "an-níi ___",
    prompt_en: "How much is this?",
    expectedShape: "อันนี้เท่าไหร่ (an-níi thâo-rài) — 'how much?'",
    scoringHint: "Cannot ask price ⇒ teach เท่าไหร่ and shopping basics.",
  },
  {
    id: "diag-survival-b1-directions",
    level: "B1",
    weakness: "survival",
    instruction_vi: "Hỏi đường đến nhà ga.",
    instruction_en: "Ask for directions to the train station.",
    prompt_th: "___ สถานีรถไฟ___",
    prompt_roman: "___ sà-thǎa-nii rót-fai ___",
    prompt_en: "How do I get to the train station?",
    expectedShape: "ไปสถานีรถไฟยังไง / ...อยู่ที่ไหน — uses ยังไง or ที่ไหน.",
    scoringHint: "Cannot form a 'how/where' question ⇒ teach direction-asking frames.",
  },
  {
    id: "diag-survival-b2-pharmacy",
    level: "B2",
    weakness: "survival",
    instruction_vi: "Ở hiệu thuốc, mô tả triệu chứng 'đau đầu' và xin thuốc.",
    instruction_en: "At a pharmacy, describe 'a headache' and ask for medicine.",
    prompt_th: "(ที่ร้านขายยา)",
    prompt_en: "At the pharmacy.",
    expectedShape: "ปวดหัว … มียาไหม / ขอยาแก้ปวด — symptom + request.",
    scoringHint: "Cannot state a symptom + request ⇒ build health survival language.",
  },
  {
    id: "diag-survival-c1-complaint",
    level: "C1",
    weakness: "survival",
    instruction_vi: "Khiếu nại lịch sự về dịch vụ kém ở khách sạn.",
    instruction_en: "Politely complain about poor hotel service.",
    prompt_th: "(ร้องเรียนอย่างสุภาพ)",
    prompt_en: "A polite complaint.",
    expectedShape:
      "Soften + state issue + request fix: ขอโทษนะคะ มีปัญหาเรื่อง… ช่วย…ได้ไหม.",
    scoringHint: "Blunt or over-aggressive ⇒ teach polite-complaint scaffolding.",
  },
];

export default thaiDiagnosticPrompts;
