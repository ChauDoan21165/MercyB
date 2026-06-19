// src/languages/thai/examPractice.ts
//
// Thai exam-style practice bank for A1–C2 self-study. Each task mirrors a
// common assessment format (reading, grammar, vocabulary, writing prompt,
// speaking prompt, listening-script question) and carries bilingual
// instructions (Vietnamese + English), an answer key, rubric notes, and
// common-mistake notes so a learner can self-score.
//
// Lower-level stimuli (A1–B1) include romanization; higher levels (B2–C2)
// lean on Thai script as the learner is expected to read unaided.
//
// Listening and speaking tasks are TEXT-ONLY: the "listening" stimulus is a
// transcript the learner (or app TTS) reads aloud, and the "speaking" task is
// a prompt with a model response — no audio assets are bundled here.
//
// NOT AN OFFICIAL CERTIFICATION. These tasks are practice material only and
// confer no recognized qualification. NATIVE REVIEW DEFERRED — treat as a
// teaching draft, not a vetted exam.
//
// Romanization tone diacritics:
//   mid = plain (a) · low = à · falling = â · high = á · rising = ǎ
//   long vowels are doubled (aa).

export type ThaiExamLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiExamTaskType =
  | "reading"
  | "grammar"
  | "vocabulary"
  | "writing-prompt"
  | "speaking-prompt"
  | "listening-script";

export interface ThaiExamTask {
  /** Stable kebab-case id, unique across the bank. */
  id: string;
  level: ThaiExamLevel;
  type: ThaiExamTaskType;
  /** Vietnamese instruction for the learner. */
  instruction_vi: string;
  /** English instruction for the learner. */
  instruction_en: string;
  /** Thai-script stimulus / passage / transcript (when the task has one). */
  prompt_th?: string;
  /** Romanization of prompt_th (provided for lower levels). */
  prompt_roman?: string;
  /** English gloss of the stimulus (optional aid). */
  prompt_en?: string;
  /** The actual question or task statement. */
  question: string;
  /** Multiple-choice options, when applicable. */
  options?: string[];
  /** Answer key (correct option, or a model answer for open tasks). */
  answer: string;
  /** Rubric notes — how to score / what a strong answer shows. */
  rubric: string;
  /** Common mistakes learners make on this item. */
  commonMistakes: string;
}

export const THAI_EXAM_LEVELS: readonly ThaiExamLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const THAI_EXAM_TASK_TYPES: readonly ThaiExamTaskType[] = [
  "reading",
  "grammar",
  "vocabulary",
  "writing-prompt",
  "speaking-prompt",
  "listening-script",
] as const;

export const thaiExamTasks: ThaiExamTask[] = [
  // ═══════════════════════════════ A1 ═══════════════════════════════
  {
    id: "a1-reading-sign-restroom",
    level: "A1",
    type: "reading",
    instruction_vi: "Đọc biển báo và chọn nghĩa đúng.",
    instruction_en: "Read the sign and choose the correct meaning.",
    prompt_th: "ห้องน้ำ",
    prompt_roman: "hɔ̂ng-náam",
    prompt_en: "restroom",
    question: "Biển này chỉ chỗ nào? / What does this sign indicate?",
    options: ["ทางออก (exit)", "ห้องน้ำ (restroom)", "ร้านอาหาร (restaurant)"],
    answer: "ห้องน้ำ (restroom)",
    rubric: "1 point for the correct option. No partial credit.",
    commonMistakes:
      "Confusing ห้องน้ำ (restroom) with ห้องนอน (bedroom) — both start with ห้อง ('room').",
  },
  {
    id: "a1-grammar-classifier-book",
    level: "A1",
    type: "grammar",
    instruction_vi: "Chọn lượng từ đúng để điền vào chỗ trống.",
    instruction_en: "Choose the correct classifier for the blank.",
    prompt_th: "หนังสือสาม___",
    prompt_roman: "nǎng-sʉ̌ʉ sǎam ___",
    prompt_en: "three books",
    question: "Điền lượng từ cho 'sách'. / Fill in the classifier for 'book'.",
    options: ["คน", "ตัว", "เล่ม"],
    answer: "เล่ม (lêm)",
    rubric: "1 point for เล่ม. Wrong classifier = 0.",
    commonMistakes:
      "Using คน (for people) or ตัว (for animals) instead of เล่ม (for books/flat bound items).",
  },
  {
    id: "a1-vocab-colors",
    level: "A1",
    type: "vocabulary",
    instruction_vi: "Chọn từ tiếng Thái nghĩa là 'màu đỏ'.",
    instruction_en: "Choose the Thai word meaning 'red'.",
    prompt_th: "สีแดง / สีเขียว / สีฟ้า",
    prompt_roman: "sǐi dɛɛng / sǐi khǐaw / sǐi fáa",
    prompt_en: "red / green / blue",
    question: "Từ nào là 'màu đỏ'? / Which word is 'red'?",
    options: ["สีแดง", "สีเขียว", "สีฟ้า"],
    answer: "สีแดง (sǐi dɛɛng)",
    rubric: "1 point for สีแดง.",
    commonMistakes:
      "Mixing สีแดง (red) with สีส้ม (orange); forgetting the prefix สี ('color').",
  },
  {
    id: "a1-writing-self-intro",
    level: "A1",
    type: "writing-prompt",
    instruction_vi: "Viết 2 câu giới thiệu bản thân (tên và quốc tịch) bằng tiếng Thái.",
    instruction_en: "Write 2 sentences introducing yourself (name and nationality) in Thai.",
    question: "Giới thiệu tên và quốc tịch của bạn. / Introduce your name and nationality.",
    answer:
      "Model: สวัสดีค่ะ ฉันชื่อ … (sà-wàt-dii khâ, chǎn chʉ̂ʉ …) / ฉันเป็นคนเวียดนาม (chǎn pen khon wîat-naam).",
    rubric:
      "2 points: 1 for a correct name sentence (ชื่อ + name), 1 for nationality (เป็นคน + country). Polite particle ครับ/ค่ะ = bonus.",
    commonMistakes:
      "Omitting ชื่อ before the name; saying เป็นเวียดนาม instead of เป็นคนเวียดนาม ('a Vietnamese person').",
  },
  {
    id: "a1-speaking-greeting",
    level: "A1",
    type: "speaking-prompt",
    instruction_vi: "Nói lời chào và hỏi thăm sức khỏe một người.",
    instruction_en: "Greet someone and ask how they are.",
    question: "Chào và hỏi 'bạn khỏe không?'. / Say hello and ask 'how are you?'.",
    answer: "Model: สวัสดีครับ สบายดีไหมครับ (sà-wàt-dii khráp, sà-baai dii mǎi khráp).",
    rubric:
      "2 points: 1 for สวัสดี + polite particle, 1 for the set question สบายดีไหม. Pronunciation is not scored here.",
    commonMistakes:
      "Translating 'how are you' literally; dropping the polite particle ครับ/ค่ะ.",
  },
  {
    id: "a1-listening-name",
    level: "A1",
    type: "listening-script",
    instruction_vi: "Đọc lời thoại rồi trả lời câu hỏi.",
    instruction_en: "Read the transcript, then answer the question.",
    prompt_th: "สวัสดีครับ ผมชื่อสมชาย ผมเป็นคนไทย",
    prompt_roman: "sà-wàt-dii khráp, phǒm chʉ̂ʉ sǒm-chaai, phǒm pen khon thai",
    prompt_en: "Hello, my name is Somchai. I am Thai.",
    question: "Người nói tên gì? / What is the speaker's name?",
    options: ["สมหญิง", "สมชาย", "สมศักดิ์"],
    answer: "สมชาย (Somchai)",
    rubric: "1 point for Somchai.",
    commonMistakes:
      "Mishearing/misreading similar sǒm- names; reporting nationality instead of name.",
  },

  // ═══════════════════════════════ A2 ═══════════════════════════════
  {
    id: "a2-reading-meeting-time",
    level: "A2",
    type: "reading",
    instruction_vi: "Đọc tin nhắn và trả lời.",
    instruction_en: "Read the message and answer.",
    prompt_th: "พรุ่งนี้เราเจอกันตอนบ่ายสองโมงที่ร้านกาแฟ",
    prompt_roman: "phrûng-níi rao jəə kan tɔɔn bàai sɔ̌ɔng moong thîi ráan kaa-fɛɛ",
    prompt_en: "Tomorrow we meet at 2 p.m. at the coffee shop.",
    question: "Mấy giờ gặp nhau? / What time is the meeting?",
    options: ["บ่ายสองโมง (2 p.m.)", "สองทุ่ม (8 p.m.)", "เที่ยง (noon)"],
    answer: "บ่ายสองโมง (2 p.m.)",
    rubric: "1 point for 2 p.m.",
    commonMistakes:
      "Confusing the Thai hour system: บ่ายสองโมง (2 p.m.) vs สองทุ่ม (8 p.m.).",
  },
  {
    id: "a2-grammar-laew-past",
    level: "A2",
    type: "grammar",
    instruction_vi: "Chọn cách diễn đạt 'đã ăn rồi' đúng.",
    instruction_en: "Choose the correct way to say 'already ate'.",
    prompt_th: "ฉัน___ข้าว___",
    prompt_roman: "chǎn ___ khâaw ___",
    prompt_en: "I already ate.",
    question: "Hoàn thành câu với 'gin' và 'láew'. / Complete with กิน and แล้ว.",
    options: ["แล้วกินข้าว", "กินข้าวแล้ว", "กินแล้วข้าว"],
    answer: "กินข้าวแล้ว (kin khâaw láew)",
    rubric: "1 point for placing แล้ว at the end of the verb phrase.",
    commonMistakes:
      "Putting แล้ว first (= 'and then') or between verb and object.",
  },
  {
    id: "a2-vocab-food",
    level: "A2",
    type: "vocabulary",
    instruction_vi: "Chọn từ nghĩa là 'cơm/gạo'.",
    instruction_en: "Choose the word meaning 'rice'.",
    prompt_th: "ข้าว / ขาว / ข่าว",
    prompt_roman: "khâaw / khǎaw / khàaw",
    prompt_en: "rice / white / news",
    question: "Từ nào là 'cơm'? / Which one is 'rice'?",
    options: ["ข้าว (falling)", "ขาว (rising)", "ข่าว (low)"],
    answer: "ข้าว (khâaw, falling tone)",
    rubric: "1 point for the falling-tone ข้าว.",
    commonMistakes:
      "Tone error: ordering ขาว ('white') or ข่าว ('news') by accident.",
  },
  {
    id: "a2-writing-daily-routine",
    level: "A2",
    type: "writing-prompt",
    instruction_vi: "Viết 3 câu về thói quen hằng ngày của bạn.",
    instruction_en: "Write 3 sentences about your daily routine.",
    question: "Mô tả buổi sáng của bạn. / Describe your morning.",
    answer:
      "Model: ทุกเช้าฉันตื่นนอนหกโมง (thúk cháo chǎn tʉ̀ʉn-nɔɔn hòk moong) / ฉันกินข้าวเช้าแล้วไปทำงาน / ตอนเย็นฉันกลับบ้าน.",
    rubric:
      "3 points: 1 per clear sentence using a time word + verb. Reward connectors (แล้ว, แล้วก็).",
    commonMistakes:
      "Trying to conjugate verbs for tense; omitting time words that carry the routine sense.",
  },
  {
    id: "a2-speaking-order-food",
    level: "A2",
    type: "speaking-prompt",
    instruction_vi: "Gọi món tại quán: gọi một đĩa cơm gà và một nước.",
    instruction_en: "Order at a restaurant: ask for one chicken rice and one drink.",
    question: "Gọi món lịch sự. / Place a polite order.",
    answer:
      "Model: ขอข้าวมันไก่หนึ่งจานกับน้ำเปล่าหนึ่งแก้วครับ (khɔ̌ɔ khâaw-man-kài nʉ̀ng jaan kàp náam-plàao nʉ̀ng kɛ̂ɛw khráp).",
    rubric:
      "2 points: 1 for the request frame ขอ … + classifier, 1 for politeness + correct classifiers (จาน plate, แก้ว glass).",
    commonMistakes:
      "Forgetting ขอ ('may I have'); wrong/absent classifiers; dropping ครับ/ค่ะ.",
  },
  {
    id: "a2-listening-directions",
    level: "A2",
    type: "listening-script",
    instruction_vi: "Đọc lời chỉ đường rồi trả lời.",
    instruction_en: "Read the directions, then answer.",
    prompt_th: "เลี้ยวซ้ายที่ไฟแดง แล้วตรงไป ร้านอยู่ทางขวา",
    prompt_roman: "líaw sáai thîi fai-dɛɛng, láew trong pai, ráan yùu thaang khwǎa",
    prompt_en: "Turn left at the red light, then go straight; the shop is on the right.",
    question: "Cửa hàng nằm phía nào? / Which side is the shop on?",
    options: ["ทางซ้าย (left)", "ทางขวา (right)", "ตรงไป (straight)"],
    answer: "ทางขวา (right)",
    rubric: "1 point for 'right'.",
    commonMistakes:
      "Swapping ซ้าย (left) and ขวา (right); answering with the turn direction instead of the final side.",
  },

  // ═══════════════════════════════ B1 ═══════════════════════════════
  {
    id: "b1-reading-weekend-plan",
    level: "B1",
    type: "reading",
    instruction_vi: "Đọc đoạn văn và chọn ý chính.",
    instruction_en: "Read the paragraph and choose the main idea.",
    prompt_th:
      "สุดสัปดาห์นี้ฝนตกทั้งวัน ฉันเลยไม่ได้ไปเที่ยว อยู่บ้านดูหนังและทำอาหารแทน",
    prompt_roman:
      "sùt-sàp-daa níi fǒn tòk tháng wan, chǎn ləəi mâi dâi pai thîaw, yùu bâan duu nǎng láe tham aa-hǎan thɛɛn",
    prompt_en:
      "It rained all weekend, so I didn't go out; I stayed home watching movies and cooking instead.",
    question: "Vì sao người viết ở nhà? / Why did the writer stay home?",
    options: ["เพราะป่วย (sick)", "เพราะฝนตก (it rained)", "เพราะไม่มีเงิน (no money)"],
    answer: "เพราะฝนตก (because it rained)",
    rubric: "1 point for identifying rain as the cause (signaled by เลย = 'so').",
    commonMistakes:
      "Missing the cause-result marker เลย; inventing a reason not in the text.",
  },
  {
    id: "b1-grammar-connectors",
    level: "B1",
    type: "grammar",
    instruction_vi: "Chọn liên từ đúng: 'Tôi muốn đi ___ trời mưa.'",
    instruction_en: "Choose the right connector: 'I want to go ___ it's raining.'",
    prompt_th: "ฉันอยากไป ___ ฝนตก",
    prompt_roman: "chǎn yàak pai ___ fǒn tòk",
    prompt_en: "I want to go ___ it's raining.",
    question: "Điền liên từ tương phản. / Fill the contrast connector.",
    options: ["เพราะ (because)", "แต่ (but)", "เลย (so)"],
    answer: "แต่ (tɛ̀ɛ — but)",
    rubric: "1 point for แต่; the sentence needs a contrast, not a cause.",
    commonMistakes:
      "Choosing เพราะ ('because') or เลย ('so'), which give the wrong logical relation.",
  },
  {
    id: "b1-vocab-collocation-make-decision",
    level: "B1",
    type: "vocabulary",
    instruction_vi: "Chọn động từ đi với 'การตัดสินใจ' (quyết định).",
    instruction_en: "Choose the verb that collocates with 'decision'.",
    prompt_th: "___ การตัดสินใจ",
    prompt_roman: "___ kaan-tàt-sǐn-jai",
    prompt_en: "___ a decision",
    question: "Động từ nào đúng? / Which verb fits?",
    options: ["ทำ (do)", "ตัดสินใจ (decide)", "เล่น (play)"],
    answer: "ตัดสินใจ (tàt-sǐn-jai) — or simply ตัดสินใจ as the verb itself",
    rubric:
      "1 point for recognizing ตัดสินใจ functions as the verb 'to decide'; English 'make a decision' is not a word-for-word calque.",
    commonMistakes:
      "Calquing English 'make' as ทำ; treating ตัดสินใจ only as a noun.",
  },
  {
    id: "b1-writing-past-trip",
    level: "B1",
    type: "writing-prompt",
    instruction_vi: "Viết 5 câu kể về một chuyến đi gần đây (nơi đến, hoạt động, cảm nhận).",
    instruction_en: "Write 5 sentences about a recent trip (where, activities, feelings).",
    question: "Kể về chuyến đi của bạn. / Describe your trip.",
    answer:
      "Model opener: เดือนที่แล้วฉันไปเชียงใหม่ (dʉan thîi-láew chǎn pai chiang-mài) … ฉันเคยอยากไปนานแล้ว … สนุกมาก.",
    rubric:
      "5 points: cohesion (connectors), past time markers (เมื่อ…, เคย, แล้ว), variety of verbs, an opinion clause, comprehensibility. Deduct for tense over-marking.",
    commonMistakes:
      "Adding redundant past markers to every verb; flat list with no connectors; missing an evaluative sentence.",
  },
  {
    id: "b1-speaking-opinion",
    level: "B1",
    type: "speaking-prompt",
    instruction_vi: "Nêu ý kiến (1 phút): Bạn thích sống ở thành phố hay nông thôn? Vì sao?",
    instruction_en: "Give a 1-minute opinion: Do you prefer city or countryside life? Why?",
    question: "Trình bày quan điểm và một lý do. / State a view and one reason.",
    answer:
      "Model frame: ฉันคิดว่า … ดีกว่า เพราะ … (chǎn khít wâa … dii kwàa, phrɔ́... ) e.g. ฉันชอบเมืองมากกว่าเพราะมีงานเยอะ.",
    rubric:
      "Score 0–3: clear position (1), supporting reason with เพราะ (1), comparative ...กว่า used correctly (1).",
    commonMistakes:
      "Stating a preference without a reason; misusing the comparative มากกว่า/ดีกว่า word order.",
  },
  {
    id: "b1-listening-phone-message",
    level: "B1",
    type: "listening-script",
    instruction_vi: "Đọc lời nhắn thoại rồi trả lời.",
    instruction_en: "Read the voicemail transcript, then answer.",
    prompt_th:
      "สวัสดีครับ ผมโทรมาเลื่อนนัด ขอเปลี่ยนจากวันจันทร์เป็นวันพุธนะครับ",
    prompt_roman:
      "sà-wàt-dii khráp, phǒm thoo maa lʉ̂an nát, khɔ̌ɔ plìan jàak wan-jan pen wan-phút ná khráp",
    prompt_en:
      "Hello, I'm calling to reschedule — please change from Monday to Wednesday.",
    question: "Cuộc hẹn dời sang thứ mấy? / The appointment moves to which day?",
    options: ["วันจันทร์ (Monday)", "วันพุธ (Wednesday)", "วันศุกร์ (Friday)"],
    answer: "วันพุธ (Wednesday)",
    rubric: "1 point for Wednesday (the new day, not the original).",
    commonMistakes:
      "Reporting the original day (Monday); missing เลื่อน/เปลี่ยน ('reschedule/change').",
  },

  // ═══════════════════════════════ B2 ═══════════════════════════════
  {
    id: "b2-reading-opinion-main-idea",
    level: "B2",
    type: "reading",
    instruction_vi: "Đọc đoạn và suy ra thái độ của người viết.",
    instruction_en: "Read the passage and infer the writer's attitude.",
    prompt_th:
      "แม้เทคโนโลยีจะช่วยให้ชีวิตสะดวกขึ้น แต่หลายคนกลับรู้สึกว่ามีเวลาให้ครอบครัวน้อยลง",
    prompt_en:
      "Although technology makes life more convenient, many people feel they have less time for family.",
    question: "Thái độ của người viết về công nghệ là gì? / What is the writer's stance?",
    options: [
      "ชื่นชมเต็มที่ (wholly positive)",
      "มองทั้งข้อดีและข้อเสีย (balanced/critical)",
      "ปฏิเสธโดยสิ้นเชิง (wholly negative)",
    ],
    answer: "มองทั้งข้อดีและข้อเสีย (balanced — sees pros and cons)",
    rubric:
      "1 point for 'balanced', justified by the concessive แม้…แต่ ('although…but') structure.",
    commonMistakes:
      "Reading the concessive as purely positive or purely negative; ignoring แม้…แต่.",
  },
  {
    id: "b2-grammar-passive-thuuk",
    level: "B2",
    type: "grammar",
    instruction_vi: "Chọn cách diễn đạt bị động đúng: 'Anh ấy bị mắng.'",
    instruction_en: "Choose the correct passive: 'He got scolded.'",
    prompt_th: "เขา ___ ดุ",
    prompt_roman: "khǎo ___ dù",
    prompt_en: "He got scolded.",
    question: "Điền dấu hiệu bị động (nghĩa tiêu cực). / Fill the passive marker (adversative).",
    options: ["ถูก (thùuk)", "ได้ (dâi)", "กำลัง (kam-lang)"],
    answer: "ถูก (thùuk)",
    rubric:
      "1 point for ถูก, the adversative passive used for unpleasant events (being scolded).",
    commonMistakes:
      "Using ได้รับ (neutral/positive passive) for a negative event; omitting the passive marker entirely.",
  },
  {
    id: "b2-vocab-register-formal",
    level: "B2",
    type: "vocabulary",
    instruction_vi: "Chọn từ trang trọng cho 'ăn' khi nói về nhà sư/hoàng gia bối cảnh lịch sự.",
    instruction_en: "Choose the elevated/polite word for 'to eat' in a formal context.",
    prompt_th: "กิน / ทาน / รับประทาน",
    prompt_roman: "kin / thaan / ráp-prà-thaan",
    prompt_en: "eat (casual / polite / formal)",
    question: "Từ nào trang trọng nhất? / Which is the most formal?",
    options: ["กิน (casual)", "ทาน (polite)", "รับประทาน (formal)"],
    answer: "รับประทาน (ráp-prà-thaan)",
    rubric:
      "1 point for รับประทาน; recognition that Thai has a register ladder for everyday verbs.",
    commonMistakes:
      "Treating กิน/ทาน/รับประทาน as interchangeable; using กิน in formal writing.",
  },
  {
    id: "b2-writing-argument-paragraph",
    level: "B2",
    type: "writing-prompt",
    instruction_vi: "Viết một đoạn (~80 từ) lập luận: Có nên cấm điện thoại trong lớp học?",
    instruction_en: "Write a ~80-word paragraph arguing: Should phones be banned in classrooms?",
    question: "Nêu lập trường + 2 lý do + kết luận. / State a position + 2 reasons + conclusion.",
    answer:
      "Model thesis: ฉันเห็นด้วยว่าควรห้ามใช้โทรศัพท์ในห้องเรียน เพราะ … นอกจากนี้ … ดังนั้น …",
    rubric:
      "0–5: thesis clarity (1), two distinct reasons (2), discourse markers นอกจากนี้/ดังนั้น (1), accuracy & register (1).",
    commonMistakes:
      "One reason repeated twice; no concluding marker; informal particles in formal writing.",
  },
  {
    id: "b2-speaking-compare-options",
    level: "B2",
    type: "speaking-prompt",
    instruction_vi: "So sánh (2 phút): học trực tuyến và học trên lớp — ưu/nhược điểm.",
    instruction_en: "Compare (2 min): online vs in-person learning — pros and cons.",
    question: "So sánh và đưa ra lựa chọn. / Compare and make a recommendation.",
    answer:
      "Model frame: เมื่อเทียบกันแล้ว การเรียนออนไลน์สะดวกกว่า แต่การเรียนในห้องมีปฏิสัมพันธ์มากกว่า … สรุปแล้ว ฉันคิดว่า …",
    rubric:
      "0–4: two compared dimensions (2), comparative grammar (…กว่า) (1), a justified recommendation (1).",
    commonMistakes:
      "Listing features without comparing; no final recommendation; flat intonation/monotone delivery.",
  },
  {
    id: "b2-listening-news-summary",
    level: "B2",
    type: "listening-script",
    instruction_vi: "Đọc bản tin ngắn rồi tóm tắt thông tin chính.",
    instruction_en: "Read the short news transcript, then identify the key fact.",
    prompt_th:
      "กรมอุตุฯ เตือนว่าสัปดาห์นี้จะมีฝนตกหนักทางภาคใต้ ขอให้ประชาชนระวังน้ำท่วมฉับพลัน",
    prompt_en:
      "The Meteorological Department warns of heavy rain in the South this week; residents should beware of flash floods.",
    question: "Cảnh báo chính là gì? / What is the main warning?",
    options: [
      "ภัยแล้งภาคเหนือ (drought in the North)",
      "ฝนหนักและน้ำท่วมภาคใต้ (heavy rain & floods in the South)",
      "อากาศหนาวภาคอีสาน (cold in the Northeast)",
    ],
    answer: "ฝนหนักและน้ำท่วมภาคใต้ (heavy rain and floods in the South)",
    rubric: "1 point for both region (South) and hazard (rain/floods).",
    commonMistakes:
      "Naming the wrong region; reporting rain but missing the flood warning.",
  },

  // ═══════════════════════════════ C1 ═══════════════════════════════
  {
    id: "c1-reading-authors-stance",
    level: "C1",
    type: "reading",
    instruction_vi: "Đọc đoạn học thuật và xác định lập trường ngầm của tác giả.",
    instruction_en: "Read the academic excerpt and identify the author's implicit stance.",
    prompt_th:
      "ผู้กำหนดนโยบายมักอ้างตัวเลขการเติบโตทางเศรษฐกิจ ทว่าตัวเลขเหล่านั้นแทบไม่สะท้อนความเหลื่อมล้ำที่ขยายตัว",
    prompt_en:
      "Policymakers often cite economic growth figures, yet those figures barely reflect the widening inequality.",
    question:
      "Tác giả ngụ ý gì về các con số tăng trưởng? / What does the author imply about growth figures?",
    options: [
      "เป็นตัวชี้วัดที่ครบถ้วน (a complete measure)",
      "ปกปิดปัญหาความเหลื่อมล้ำ (mask the inequality problem)",
      "ไม่เกี่ยวกับนโยบาย (irrelevant to policy)",
    ],
    answer: "ปกปิดปัญหาความเหลื่อมล้ำ (they mask the inequality problem)",
    rubric:
      "1 point for the critical reading, anchored by the contrastive ทว่า ('yet') and แทบไม่ ('barely').",
    commonMistakes:
      "Taking the figures at face value; missing the formal contrast marker ทว่า.",
  },
  {
    id: "c1-grammar-register-particle",
    level: "C1",
    type: "grammar",
    instruction_vi: "Chọn cách nối câu trang trọng phù hợp văn viết học thuật.",
    instruction_en: "Choose the formal connector appropriate for academic writing.",
    prompt_th: "เศรษฐกิจชะลอตัว ___ รัฐบาลจึงออกมาตรการกระตุ้น",
    prompt_en: "The economy slowed, ___ the government issued stimulus measures.",
    question: "Điền liên từ trang trọng (vì vậy). / Fill the formal 'therefore'.",
    options: ["เพราะฉะนั้น/ดังนั้น (therefore, formal)", "ก็เลย (so, casual)", "แถม (plus, casual)"],
    answer: "เพราะฉะนั้น / ดังนั้น (dang-nán)",
    rubric:
      "1 point for the formal causal connector; register match with academic prose.",
    commonMistakes:
      "Using spoken ก็เลย/แถม in formal text; pairing จึง redundantly with another causal marker.",
  },
  {
    id: "c1-vocab-idiom",
    level: "C1",
    type: "vocabulary",
    instruction_vi: "Chọn nghĩa của thành ngữ 'น้ำขึ้นให้รีบตัก'.",
    instruction_en: "Choose the meaning of the idiom 'น้ำขึ้นให้รีบตัก'.",
    prompt_th: "น้ำขึ้นให้รีบตัก",
    prompt_roman: "náam khʉ̂n hâi rîip tàk",
    prompt_en: "lit. 'when the tide rises, hurry to scoop'",
    question: "Thành ngữ này nghĩa là gì? / What does the idiom mean?",
    options: [
      "อย่ารีบร้อน (don't rush)",
      "ฉวยโอกาสเมื่อมีโอกาส (seize the opportunity while it lasts)",
      "ประหยัดน้ำ (save water)",
    ],
    answer: "ฉวยโอกาสเมื่อมีโอกาส (make hay while the sun shines)",
    rubric:
      "1 point for the figurative meaning, not the literal water reading.",
    commonMistakes:
      "Interpreting idioms literally; confusing with unrelated water proverbs.",
  },
  {
    id: "c1-writing-essay-outline",
    level: "C1",
    type: "writing-prompt",
    instruction_vi: "Lập dàn ý bài luận (luận điểm + 3 ý chính) cho đề: Tác động của du lịch lên văn hóa địa phương.",
    instruction_en: "Outline an essay (thesis + 3 main points): the impact of tourism on local culture.",
    question: "Viết dàn ý có luận điểm và 3 ý. / Provide a thesis and 3 supporting points.",
    answer:
      "Model thesis: การท่องเที่ยวส่งผลทั้งด้านบวกและด้านลบต่อวัฒนธรรมท้องถิ่น — points: เศรษฐกิจชุมชน / การกลายเป็นสินค้า (commodification) / การอนุรักษ์.",
    rubric:
      "0–4: arguable thesis (1), three non-overlapping points (2), logical ordering / signposting (1).",
    commonMistakes:
      "Thesis that merely restates the topic; overlapping points; listing without hierarchy.",
  },
  {
    id: "c1-speaking-structured-argument",
    level: "C1",
    type: "speaking-prompt",
    instruction_vi: "Tranh luận (3 phút): Chính phủ nên trợ giá giao thông công cộng. Đưa lập luận + phản biện.",
    instruction_en: "Argue (3 min): the government should subsidize public transport. Include a counter-argument.",
    question: "Trình bày lập luận, thừa nhận phản biện, rồi bác bỏ. / Argue, concede, then rebut.",
    answer:
      "Model frame: ฉันสนับสนุน … ด้วยเหตุผลว่า … แม้บางคนจะแย้งว่า … แต่ในความเป็นจริง …",
    rubric:
      "0–5: position (1), two reasons (2), genuine concession แม้…แต่ (1), rebuttal coherence + formal register (1).",
    commonMistakes:
      "Straw-man concession; collapsing into casual register; no rebuttal after conceding.",
  },
  {
    id: "c1-listening-lecture-implication",
    level: "C1",
    type: "listening-script",
    instruction_vi: "Đọc đoạn bài giảng rồi suy ra hàm ý.",
    instruction_en: "Read the lecture excerpt, then infer the implication.",
    prompt_th:
      "งานวิจัยชิ้นนี้ใช้กลุ่มตัวอย่างเพียงสามสิบคน ผลที่ได้จึงควรตีความด้วยความระมัดระวัง",
    prompt_en:
      "This study used a sample of only thirty people, so the results should be interpreted with caution.",
    question: "Người giảng ngụ ý gì? / What does the lecturer imply?",
    options: [
      "ผลสรุปได้แน่นอน (results are conclusive)",
      "ผลอาจไม่เป็นตัวแทน (results may not generalize)",
      "กลุ่มตัวอย่างใหญ่พอ (sample is large enough)",
    ],
    answer: "ผลอาจไม่เป็นตัวแทน (results may not generalize — small sample)",
    rubric:
      "1 point for the inference about generalizability, signaled by เพียง ('only') + ระมัดระวัง ('caution').",
    commonMistakes:
      "Taking 'caution' as a formality; missing the hedge เพียง that flags the small sample.",
  },

  // ═══════════════════════════════ C2 ═══════════════════════════════
  {
    id: "c2-reading-tone-irony",
    level: "C2",
    type: "reading",
    instruction_vi: "Đọc đoạn và xác định giọng điệu (sắc thái mỉa mai).",
    instruction_en: "Read the passage and identify its tone (note any irony).",
    prompt_th:
      "ช่างเป็นแผนที่ยอดเยี่ยมเสียจริง ที่แก้ปัญหารถติดด้วยการสร้างถนนให้รถมาติดเพิ่มอีกสาย",
    prompt_en:
      "What a brilliant plan indeed — solving traffic jams by building yet another road for cars to jam up.",
    question: "Giọng điệu của đoạn là gì? / What is the tone of the passage?",
    options: [
      "ชื่นชมจริงใจ (sincere praise)",
      "ประชดประชัน (sarcastic/ironic)",
      "เป็นกลาง (neutral)",
    ],
    answer: "ประชดประชัน (sarcasm/irony)",
    rubric:
      "1 point for detecting irony — surface praise (ยอดเยี่ยมเสียจริง) contradicted by the absurd result.",
    commonMistakes:
      "Reading ยอดเยี่ยม ('excellent') literally; missing the sarcastic intensifier …เสียจริง.",
  },
  {
    id: "c2-grammar-register-shift",
    level: "C2",
    type: "grammar",
    instruction_vi: "Chọn câu giữ đúng văn phong trang trọng (không lẫn khẩu ngữ).",
    instruction_en: "Choose the sentence that maintains a consistent formal register.",
    prompt_th: "บริบท: รายงานทางการ / Context: an official report",
    prompt_en: "Pick the version with no register clash.",
    question: "Câu nào nhất quán văn phong trang trọng? / Which keeps formal register?",
    options: [
      "ผลการศึกษาชี้ว่ามาตรการนี้ได้ผลดี",
      "ผลการศึกษาชี้ว่ามาตรการนี้เวิร์กสุดๆ",
      "ผลการศึกษาบอกว่ามาตรการนี้โอเคเลย",
    ],
    answer: "ผลการศึกษาชี้ว่ามาตรการนี้ได้ผลดี",
    rubric:
      "1 point for the version free of loanword slang (เวิร์ก) and casual particles (โอเค…เลย).",
    commonMistakes:
      "Letting English loan slang or spoken particles leak into formal Thai prose.",
  },
  {
    id: "c2-vocab-near-synonyms",
    level: "C2",
    type: "vocabulary",
    instruction_vi: "Phân biệt sắc thái: từ nào hàm ý 'cố chấp, ngoan cố' (tiêu cực)?",
    instruction_en: "Discriminate nuance: which word implies negative 'stubborn/obstinate'?",
    prompt_th: "มุ่งมั่น / ดื้อรั้น / แน่วแน่",
    prompt_roman: "mûng-mân / dʉ̂ʉ-rán / nɛ̂ɛw-nɛɛ",
    prompt_en: "determined / stubborn / resolute",
    question: "Từ nào mang nghĩa tiêu cực? / Which carries the negative connotation?",
    options: ["มุ่งมั่น (determined)", "ดื้อรั้น (stubborn)", "แน่วแน่ (resolute)"],
    answer: "ดื้อรั้น (dʉ̂ʉ-rán)",
    rubric:
      "1 point for selecting the pejorative near-synonym while recognizing the other two are positive.",
    commonMistakes:
      "Treating the three as interchangeable; choosing a positive term for a negative slot.",
  },
  {
    id: "c2-writing-nuanced-commentary",
    level: "C2",
    type: "writing-prompt",
    instruction_vi: "Viết bình luận sắc sảo (~120 từ) phản biện một quan điểm phổ biến, dùng giọng điệu tinh tế.",
    instruction_en: "Write a ~120-word nuanced commentary challenging a common view, with controlled tone.",
    question: "Phản biện một định kiến, giữ giọng điệu cân nhắc. / Rebut a cliché with measured tone.",
    answer:
      "Model opener: เป็นที่เชื่อกันโดยทั่วไปว่า … ทว่าหากพิจารณาให้ถี่ถ้วน จะพบว่า … (concede partial truth, then complicate it).",
    rubric:
      "0–6: precise thesis (1), acknowledgment of the opposing view (1), at least two layers of reasoning (2), idiomatic & cohesive Thai (1), controlled tone without slang (1).",
    commonMistakes:
      "Overstating the rebuttal; tonal slips into sarcasm; calqued English connectors.",
  },
  {
    id: "c2-speaking-spontaneous-debate",
    level: "C2",
    type: "speaking-prompt",
    instruction_vi: "Phản hồi tức thời (không chuẩn bị): 'AI sẽ thay thế giáo viên.' Phản biện trong 2 phút.",
    instruction_en: "Respond spontaneously (no prep): 'AI will replace teachers.' Rebut in 2 minutes.",
    question: "Phản biện có sắc thái, dùng ví dụ. / Give a nuanced rebuttal with an example.",
    answer:
      "Model frame: ข้อโต้แย้งนี้มีส่วนถูก แต่มองข้ามบทบาทด้านความสัมพันธ์ของครู เช่น …",
    rubric:
      "0–5: immediate coherent stance (1), nuance/concession (1), concrete example (1), idiomatic fluency (1), register control under time pressure (1).",
    commonMistakes:
      "Freezing without a frame; binary all-or-nothing claim; losing register when improvising.",
  },
  {
    id: "c2-listening-colloquial-idiom",
    level: "C2",
    type: "listening-script",
    instruction_vi: "Đọc đoạn hội thoại khẩu ngữ nhanh rồi suy ra hàm ý.",
    instruction_en: "Read the fast colloquial dialogue, then infer the intended meaning.",
    prompt_th:
      "— เป็นไงบ้างงานใหม่ — ก็งั้นๆ แหละ เงินดีแต่เจ้านายกินแรงน่าดู",
    prompt_en:
      "— How's the new job? — Eh, so-so. Pay's good but the boss really works you to the bone.",
    question:
      "Người nói cảm thấy thế nào về công việc? / How does the speaker feel about the job?",
    options: [
      "พอใจเต็มที่ (fully satisfied)",
      "รู้สึกก้ำกึ่ง: เงินดีแต่เหนื่อย (mixed: good pay but exhausting)",
      "เกลียดงานนี้ (hates it)",
    ],
    answer: "รู้สึกก้ำกึ่ง: เงินดีแต่งานหนัก (mixed feelings — good pay, exploitative boss)",
    rubric:
      "1 point for the mixed reading; understanding the colloquial งั้นๆ ('meh') and the idiom กินแรง ('exploit one's labor').",
    commonMistakes:
      "Reading เงินดี ('good pay') as overall positive; not knowing the slang งั้นๆ / กินแรง.",
  },
];

export default thaiExamTasks;
