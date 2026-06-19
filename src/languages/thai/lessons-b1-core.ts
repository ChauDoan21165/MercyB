// src/languages/thai/lessons-b1-core.ts
//
// Thai CEFR B1 "core" lesson batch for Vietnamese learners (with English
// support). Self-contained: types are defined inline so this file does not
// depend on a shared thai/lessons.ts (the thai/ package has none yet). When a
// shared module is added, swap these to type-only imports.
//
// Scope (per A4 task brief): connected speech, because/so, if/when,
// comparisons, giving reasons, workplace & service situations, telling
// stories, polite disagreement, problem solving.
//
// Conventions
//   - Thai script is always primary; `rtgs` is a light Royal-Thai-style
//     romanization for readers, with tone hints in `pron` where useful.
//   - Tone marks in `pron`:  ̄ mid · ˋ low · ˆ falling · ́ high · ̌ rising
//     (Thai has 5 tones; getting them wrong changes meaning — flagged inline).
//   - vi = Vietnamese explanation, en = English explanation. Both required.
//   - Native review is DEFERRED — this batch is not natively reviewed.
//
// NOTE: not natively reviewed yet (review deferred per task brief).

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiB1Focus =
  | "connected_speech"
  | "because_so"
  | "if_when"
  | "comparisons"
  | "giving_reasons"
  | "workplace_service"
  | "telling_stories"
  | "polite_disagreement"
  | "problem_solving";

/** A single example line: Thai script + romanization + both explanations. */
export type ThaiExample = {
  /** Thai script (primary). */
  th: string;
  /** Royal-Thai-style romanization. */
  rtgs: string;
  /** Tone / connected-speech hint (optional but encouraged). */
  pron?: string;
  /** English meaning / explanation. */
  en: string;
  /** Vietnamese meaning / explanation. */
  vi: string;
};

/** A practice prompt always ships with at least one worked answer example. */
export type ThaiPractice = {
  /** What the learner is asked to do (English). */
  prompt_en: string;
  /** What the learner is asked to do (Vietnamese). */
  prompt_vi: string;
  /** One or more model answers so the learner can self-check. */
  answers: ThaiExample[];
};

export type ThaiB1Lesson = {
  id: string;
  level: "B1";
  focus: ThaiB1Focus;
  title_en: string;
  title_vi: string;
  /** Grammar / usage note, English. */
  note_en: string;
  /** Grammar / usage note, Vietnamese. */
  note_vi: string;
  /** Teaching examples. */
  examples: ThaiExample[];
  /** Practice prompts, each with answer examples. */
  practice: ThaiPractice[];
};

export const thaiB1CoreLessons: ThaiB1Lesson[] = [
  // 1 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-01-connected-speech",
    level: "B1",
    focus: "connected_speech",
    title_en: "Connected speech: linking and dropped vowels",
    title_vi: "Nói nối: nối âm và lược nguyên âm",
    note_en:
      "In fast Thai, short function words lose their full vowel and lean on the next word. ไม่เป็นไร is said almost as 'mâi-pen-rai' run together; ก็ (gɔ̂) often shrinks to a quick 'gɔ' before verbs. Don't pronounce every syllable with equal weight — stress the content word, glide over particles.",
    note_vi:
      "Khi nói nhanh, các hư từ ngắn bị rút gọn và dính vào từ sau. ไม่เป็นไร gần như đọc liền 'mâi-pen-rai'; ก็ (gɔ̂) thường rút thành 'gɔ' nhanh trước động từ. Đừng nhấn đều mọi âm tiết — nhấn từ nội dung, lướt qua tiểu từ.",
    examples: [
      {
        th: "ไม่เป็นไรครับ เดี๋ยวผมทำเอง",
        rtgs: "mai pen rai khrap, diao phom tham eng",
        pron: "mâi-pen-rai run together; 'diao' (เดี๋ยว) said quick, like 'diǎo'",
        en: "No problem, I'll do it myself in a moment.",
        vi: "Không sao đâu, lát nữa tôi tự làm.",
      },
      {
        th: "เขาก็ไม่รู้เหมือนกัน",
        rtgs: "khao gɔ mai ru muean gan",
        pron: "ก็ glides to 'gɔ'; เหมือนกัน ≈ 'muean-gan' linked",
        en: "He doesn't know either.",
        vi: "Anh ấy cũng không biết.",
      },
      {
        th: "อันนี้เท่าไหร่",
        rtgs: "an ni thao rai",
        pron: "spoken fast as 'an-ní-thâo-rài', not four separate beats",
        en: "How much is this?",
        vi: "Cái này bao nhiêu?",
      },
    ],
    practice: [
      {
        prompt_en:
          "Say 'It's okay, I'll wait' naturally, linking ไม่เป็นไร.",
        prompt_vi:
          "Nói 'Không sao, tôi sẽ đợi' tự nhiên, nối ไม่เป็นไร.",
        answers: [
          {
            th: "ไม่เป็นไร เดี๋ยวผมรอ",
            rtgs: "mai pen rai, diao phom ro",
            pron: "mâi-pen-rai linked; 'ro' rising-ish, relaxed",
            en: "It's okay, I'll wait.",
            vi: "Không sao, tôi sẽ đợi.",
          },
        ],
      },
    ],
  },

  // 2 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-02-because-so",
    level: "B1",
    focus: "because_so",
    title_en: "Because / so: เพราะ and เลย / ก็เลย",
    title_vi: "Bởi vì / cho nên: เพราะ và เลย / ก็เลย",
    note_en:
      "เพราะ (phrɔ́) / เพราะว่า = 'because'; it introduces the reason. The result clause often takes ก็เลย (gɔ̂ ləəi) or just เลย = 'so / therefore'. Pattern: [reason] เพราะ … , (so) ก็เลย [result]. You can also lead with the result: [result] เพราะ [reason].",
    note_vi:
      "เพราะ (phrɔ́) / เพราะว่า = 'bởi vì', nêu lý do. Mệnh đề kết quả thường dùng ก็เลย (gɔ̂ ləəi) hoặc เลย = 'cho nên'. Mẫu: [lý do] เพราะ…, ก็เลย [kết quả]. Cũng có thể nêu kết quả trước: [kết quả] เพราะ [lý do].",
    examples: [
      {
        th: "รถติดมาก ผมก็เลยมาสาย",
        rtgs: "rot tit mak, phom gɔ loei ma sai",
        pron: "ก็เลย ≈ 'gɔ-ləəi'",
        en: "Traffic was bad, so I came late.",
        vi: "Kẹt xe nặng, cho nên tôi đến muộn.",
      },
      {
        th: "ผมมาสายเพราะรถติด",
        rtgs: "phom ma sai phrɔ rot tit",
        pron: "เพราะ falling-then-high 'phrɔ́'",
        en: "I came late because of the traffic.",
        vi: "Tôi đến muộn vì kẹt xe.",
      },
      {
        th: "ร้านปิดแล้ว เราเลยไปกินที่อื่น",
        rtgs: "ran pit laeo, rao loei pai kin thi uen",
        pron: "เลย here = 'so then'",
        en: "The shop was closed, so we went to eat elsewhere.",
        vi: "Quán đóng cửa rồi, nên bọn tôi đi ăn chỗ khác.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Give a reason then a result using เพราะ … ก็เลย … (e.g. it rained, so I stayed home).",
        prompt_vi:
          "Nêu lý do rồi kết quả dùng เพราะ … ก็เลย … (vd: trời mưa nên tôi ở nhà).",
        answers: [
          {
            th: "ฝนตก ผมก็เลยอยู่บ้าน",
            rtgs: "fon tok, phom gɔ loei yu ban",
            pron: "ฝนตก 'fǒn-tòk'",
            en: "It rained, so I stayed home.",
            vi: "Trời mưa nên tôi ở nhà.",
          },
          {
            th: "ผมอยู่บ้านเพราะฝนตก",
            rtgs: "phom yu ban phrɔ fon tok",
            en: "I stayed home because it rained.",
            vi: "Tôi ở nhà vì trời mưa.",
          },
        ],
      },
    ],
  },

  // 3 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-03-if-conditionals",
    level: "B1",
    focus: "if_when",
    title_en: "If: ถ้า … (ก็) … conditionals",
    title_vi: "Nếu: câu điều kiện ถ้า … (ก็) …",
    note_en:
      "ถ้า (thâa) = 'if'. Result clause usually takes ก็ (gɔ̂) before the verb. Pattern: ถ้า [condition] , (subject) ก็ [result]. Thai has no verb tense change; time is from context or words like พรุ่งนี้ (tomorrow), แล้ว (already).",
    note_vi:
      "ถ้า (thâa) = 'nếu'. Mệnh đề kết quả thường có ก็ (gɔ̂) trước động từ. Mẫu: ถ้า [điều kiện], (chủ ngữ) ก็ [kết quả]. Tiếng Thái không chia thì; thời gian dựa vào ngữ cảnh hoặc từ như พรุ่งนี้ (ngày mai), แล้ว (rồi).",
    examples: [
      {
        th: "ถ้าฝนตก เราก็ไม่ไป",
        rtgs: "thaa fon tok, rao gɔ mai pai",
        pron: "ถ้า falling 'thâa'; ก็ 'gɔ̂'",
        en: "If it rains, we won't go.",
        vi: "Nếu trời mưa thì bọn tôi không đi.",
      },
      {
        th: "ถ้าคุณว่าง โทรหาผมนะ",
        rtgs: "thaa khun wang, tho ha phom na",
        pron: "นะ softening particle",
        en: "If you're free, give me a call.",
        vi: "Nếu rảnh thì gọi cho tôi nhé.",
      },
      {
        th: "ถ้าไม่เข้าใจ ถามได้เลย",
        rtgs: "thaa mai khao chai, tham dai loei",
        en: "If you don't understand, feel free to ask.",
        vi: "Nếu không hiểu thì cứ hỏi.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Make an 'if … then …' sentence about tomorrow's plan using ถ้า … ก็ ….",
        prompt_vi:
          "Đặt câu 'nếu … thì …' về kế hoạch ngày mai dùng ถ้า … ก็ ….",
        answers: [
          {
            th: "ถ้าพรุ่งนี้ว่าง ผมก็จะไปหาคุณ",
            rtgs: "thaa phrung ni wang, phom gɔ ja pai ha khun",
            pron: "จะ 'jà' = future marker",
            en: "If I'm free tomorrow, I'll come see you.",
            vi: "Nếu mai rảnh thì tôi sẽ đến gặp bạn.",
          },
        ],
      },
    ],
  },

  // 4 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-04-when-time",
    level: "B1",
    focus: "if_when",
    title_en: "When / while: เมื่อ, ตอน, เวลา, พอ",
    title_vi: "Khi / lúc: เมื่อ, ตอน, เวลา, พอ",
    note_en:
      "Several words mean 'when'. ตอน (tɔɔn) = 'at the time of' (most common in speech). เวลา (welaa) = 'whenever / when'. เมื่อ (mʉ̂a) = 'when' (slightly formal / past). พอ (phɔɔ) = 'as soon as / once'. Order: [when-clause] , [main clause].",
    note_vi:
      "Nhiều từ nghĩa 'khi'. ตอน (tɔɔn) = 'vào lúc' (thông dụng khi nói). เวลา (welaa) = 'mỗi khi / khi'. เมื่อ (mʉ̂a) = 'khi' (hơi trang trọng / quá khứ). พอ (phɔɔ) = 'ngay khi / vừa…thì'. Trật tự: [mệnh đề khi], [mệnh đề chính].",
    examples: [
      {
        th: "ตอนเด็ก ผมอยู่ต่างจังหวัด",
        rtgs: "tɔn dek, phom yu tang changwat",
        pron: "ตอนเด็ก = 'when (I was) a child'",
        en: "When I was a child, I lived in the provinces.",
        vi: "Hồi nhỏ tôi sống ở tỉnh.",
      },
      {
        th: "เวลาเหนื่อย ผมชอบฟังเพลง",
        rtgs: "welaa nuai, phom chɔp fang phleng",
        en: "When(ever) I'm tired, I like to listen to music.",
        vi: "Mỗi khi mệt tôi thích nghe nhạc.",
      },
      {
        th: "พอถึงบ้าน ผมก็โทรหาคุณ",
        rtgs: "phɔ thueng ban, phom gɔ tho ha khun",
        pron: "พอ … ก็ = 'as soon as … then'",
        en: "As soon as I get home, I'll call you.",
        vi: "Vừa về tới nhà là tôi gọi cho bạn ngay.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Describe a habit using เวลา … (whenever X, I do Y).",
        prompt_vi:
          "Mô tả một thói quen dùng เวลา … (mỗi khi X, tôi làm Y).",
        answers: [
          {
            th: "เวลาว่าง ผมชอบอ่านหนังสือ",
            rtgs: "welaa wang, phom chɔp an nangsue",
            en: "When I'm free, I like to read.",
            vi: "Mỗi khi rảnh tôi thích đọc sách.",
          },
        ],
      },
    ],
  },

  // 5 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-05-comparisons",
    level: "B1",
    focus: "comparisons",
    title_en: "Comparisons: กว่า, ที่สุด, เท่ากัน, เหมือนกัน",
    title_vi: "So sánh: กว่า, ที่สุด, เท่ากัน, เหมือนกัน",
    note_en:
      "Comparative: [adj] กว่า (gwàa) = 'more … than'. Superlative: [adj] ที่สุด (thîi sùt) = 'the most …'. Equal: เท่ากัน (thâo gan) = 'the same amount / equal'; เหมือนกัน (mʉ̌an gan) = 'the same / alike'. No 'is' verb is needed before adjectives.",
    note_vi:
      "So sánh hơn: [tính từ] กว่า (gwàa) = 'hơn'. So sánh nhất: [tính từ] ที่สุด (thîi sùt) = 'nhất'. Bằng nhau: เท่ากัน (thâo gan) = 'bằng nhau'; เหมือนกัน (mʉ̌an gan) = 'giống nhau'. Không cần động từ 'là' trước tính từ.",
    examples: [
      {
        th: "รถไฟเร็วกว่ารถเมล์",
        rtgs: "rotfai reo gwa rotme",
        pron: "กว่า falling 'gwàa'",
        en: "The train is faster than the bus.",
        vi: "Tàu hỏa nhanh hơn xe buýt.",
      },
      {
        th: "ร้านนี้อร่อยที่สุดในย่านนี้",
        rtgs: "ran ni arɔi thi sut nai yan ni",
        pron: "ที่สุด 'thîi-sùt'",
        en: "This shop is the most delicious in this area.",
        vi: "Quán này ngon nhất khu này.",
      },
      {
        th: "ราคาสองร้านนี้เท่ากัน",
        rtgs: "rakha sɔng ran ni thao gan",
        en: "The prices of these two shops are the same.",
        vi: "Giá của hai quán này bằng nhau.",
      },
      {
        th: "เสื้อตัวนี้เหมือนกับของผมเลย",
        rtgs: "suea tua ni muean gap khɔng phom loei",
        en: "This shirt is just like mine.",
        vi: "Cái áo này giống hệt của tôi.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Compare two cities you know with กว่า, then name one as ที่สุด.",
        prompt_vi:
          "So sánh hai thành phố bạn biết bằng กว่า, rồi nêu một cái là ที่สุด.",
        answers: [
          {
            th: "กรุงเทพใหญ่กว่าเชียงใหม่ แต่เชียงใหม่เงียบที่สุด",
            rtgs: "krungthep yai gwa chiangmai, tae chiangmai ngiap thi sut",
            pron: "แต่ 'tɛ̀ɛ' = but",
            en: "Bangkok is bigger than Chiang Mai, but Chiang Mai is the quietest.",
            vi: "Bangkok lớn hơn Chiang Mai, nhưng Chiang Mai yên tĩnh nhất.",
          },
        ],
      },
    ],
  },

  // 6 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-06-giving-reasons",
    level: "B1",
    focus: "giving_reasons",
    title_en: "Giving reasons: เนื่องจาก, เพราะว่า, เพื่อ",
    title_vi: "Đưa ra lý do: เนื่องจาก, เพราะว่า, เพื่อ",
    note_en:
      "For explaining decisions: เพราะว่า (phrɔ́ wâa) = 'because' (neutral/spoken); เนื่องจาก (nʉ̂ang jàak) = 'due to / owing to' (more formal, good for work). For purpose use เพื่อ (phʉ̂a) = 'in order to / for'. Don't confuse reason (เพราะ) with purpose (เพื่อ).",
    note_vi:
      "Để giải thích quyết định: เพราะว่า (phrɔ́ wâa) = 'bởi vì' (trung tính/khẩu ngữ); เนื่องจาก (nʉ̂ang jàak) = 'do / vì' (trang trọng hơn, hợp công sở). Mục đích dùng เพื่อ (phʉ̂a) = 'để / nhằm'. Đừng nhầm lý do (เพราะ) với mục đích (เพื่อ).",
    examples: [
      {
        th: "เนื่องจากระบบมีปัญหา เราจึงต้องเลื่อนประชุม",
        rtgs: "nueang jak rabop mi panha, rao jueng tɔng luean prachum",
        pron: "จึง 'jʉng' = 'therefore' (formal result word)",
        en: "Due to a system problem, we must postpone the meeting.",
        vi: "Do hệ thống có vấn đề, chúng tôi phải dời cuộc họp.",
      },
      {
        th: "ผมเรียนภาษาไทยเพื่อทำงานที่กรุงเทพ",
        rtgs: "phom rian phasa thai phuea tham ngan thi krungthep",
        pron: "เพื่อ falling 'phʉ̂a' = purpose",
        en: "I study Thai in order to work in Bangkok.",
        vi: "Tôi học tiếng Thái để làm việc ở Bangkok.",
      },
      {
        th: "ผมเลือกที่นี่เพราะว่าใกล้บ้าน",
        rtgs: "phom lueak thi ni phrɔ wa klai ban",
        en: "I chose this place because it's close to home.",
        vi: "Tôi chọn chỗ này vì gần nhà.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Explain a work decision with เนื่องจาก … จึง …, then state a purpose with เพื่อ.",
        prompt_vi:
          "Giải thích một quyết định công việc bằng เนื่องจาก … จึง …, rồi nêu mục đích bằng เพื่อ.",
        answers: [
          {
            th: "เนื่องจากงบจำกัด เราจึงลดจำนวนพนักงาน เพื่อประหยัดค่าใช้จ่าย",
            rtgs: "nueang jak ngop jamkat, rao jueng lot jamnuan phanak ngan phuea prayat kha chai jai",
            en: "Due to a limited budget, we reduced staff in order to save costs.",
            vi: "Do ngân sách hạn chế, chúng tôi giảm nhân sự để tiết kiệm chi phí.",
          },
        ],
      },
    ],
  },

  // 7 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-07-workplace",
    level: "B1",
    focus: "workplace_service",
    title_en: "At work: requests, updates, deadlines",
    title_vi: "Tại nơi làm việc: yêu cầu, cập nhật, hạn chót",
    note_en:
      "Polite work Thai leans on ช่วย (chûai) = 'please help / could you', ได้ไหม (dâi mái) = 'is it possible?', and the polite particle ครับ/ค่ะ. รบกวน (rópguan) = 'sorry to trouble you' softens requests. Use เสร็จ (sèt) = 'finished' for status.",
    note_vi:
      "Tiếng Thái công sở lịch sự dùng ช่วย (chûai) = 'làm ơn / giúp', ได้ไหม (dâi mái) = 'được không?', và tiểu từ lịch sự ครับ/ค่ะ. รบกวน (rópguan) = 'làm phiền' để giảm nhẹ yêu cầu. Dùng เสร็จ (sèt) = 'xong' cho trạng thái.",
    examples: [
      {
        th: "รบกวนช่วยส่งไฟล์ให้ผมหน่อยได้ไหมครับ",
        rtgs: "ropguan chuai song fai hai phom nɔi dai mai khrap",
        pron: "หน่อย 'nɔ̀i' softens; ได้ไหม 'dâi-mái'",
        en: "Sorry to trouble you — could you send me the file, please?",
        vi: "Làm phiền bạn gửi giúp tôi cái file được không ạ?",
      },
      {
        th: "งานเสร็จแล้วครับ ผมส่งให้ทางอีเมล",
        rtgs: "ngan set laeo khrap, phom song hai thang email",
        en: "The work is done; I've sent it by email.",
        vi: "Công việc xong rồi ạ, tôi đã gửi qua email.",
      },
      {
        th: "ขอเวลาเพิ่มอีกหนึ่งวันได้ไหมครับ",
        rtgs: "khɔ welaa phoem ik nueng wan dai mai khrap",
        pron: "ขอ rising 'khɔ̌ɔ' = 'may I ask for'",
        en: "May I have one more day, please?",
        vi: "Cho tôi xin thêm một ngày được không ạ?",
      },
    ],
    practice: [
      {
        prompt_en:
          "Politely ask a colleague to check a document by tomorrow.",
        prompt_vi:
          "Lịch sự nhờ đồng nghiệp kiểm tra một tài liệu trước ngày mai.",
        answers: [
          {
            th: "รบกวนช่วยตรวจเอกสารให้หน่อยภายในพรุ่งนี้ได้ไหมครับ",
            rtgs: "ropguan chuai truat ekkasan hai nɔi phai nai phrung ni dai mai khrap",
            pron: "ภายใน 'phai-nai' = within",
            en: "Sorry to bother you — could you check the document by tomorrow?",
            vi: "Làm phiền bạn kiểm tra giúp tài liệu trước ngày mai được không ạ?",
          },
        ],
      },
    ],
  },

  // 8 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-08-service",
    level: "B1",
    focus: "workplace_service",
    title_en: "Service situations: ordering, returns, complaints",
    title_vi: "Tình huống dịch vụ: gọi món, đổi trả, phàn nàn",
    note_en:
      "As a customer: ขอ (khɔ̌ɔ) = 'I'd like / may I have'; เปลี่ยน (plìan) = 'change/exchange'; คืน (khʉʉn) = 'return'. To complain politely, state the problem softly with พอดี (phɔɔ dii) = 'as it happens' and end with the particle. Avoid blunt blame.",
    note_vi:
      "Khi là khách: ขอ (khɔ̌ɔ) = 'cho tôi / tôi muốn'; เปลี่ยน (plìan) = 'đổi'; คืน (khʉʉn) = 'trả lại'. Phàn nàn lịch sự: nêu vấn đề nhẹ nhàng với พอดี (phɔɔ dii) = 'là vì', kết câu bằng tiểu từ. Tránh đổ lỗi thẳng.",
    examples: [
      {
        th: "ขอเมนูหน่อยครับ",
        rtgs: "khɔ menu nɔi khrap",
        en: "May I have a menu, please?",
        vi: "Cho tôi xin cái menu ạ.",
      },
      {
        th: "ขอเปลี่ยนเป็นไซส์ใหญ่กว่านี้ได้ไหมคะ",
        rtgs: "khɔ plian pen size yai gwa ni dai mai kha",
        pron: "ค่ะ/คะ = female polite particle",
        en: "Could I change this to a bigger size, please?",
        vi: "Cho tôi đổi sang cỡ lớn hơn được không ạ?",
      },
      {
        th: "อาหารมาช้าไปหน่อย พอดีผมรีบครับ",
        rtgs: "ahan ma cha pai nɔi, phɔdi phom rip khrap",
        pron: "ช้าไปหน่อย = 'a bit too slow' (soft complaint)",
        en: "The food is coming a bit slowly — it's just that I'm in a hurry.",
        vi: "Đồ ăn hơi chậm, là vì tôi đang vội ạ.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Politely tell a shop the item is broken and ask for an exchange.",
        prompt_vi:
          "Lịch sự báo cửa hàng món đồ bị hỏng và xin đổi.",
        answers: [
          {
            th: "ของชิ้นนี้เสียพอดี ขอเปลี่ยนชิ้นใหม่ได้ไหมครับ",
            rtgs: "khɔng chin ni sia phɔdi, khɔ plian chin mai dai mai khrap",
            pron: "เสีย 'sǐa' = broken/spoiled",
            en: "This item happens to be broken — could I exchange it for a new one?",
            vi: "Món này bị hỏng rồi, cho tôi đổi cái mới được không ạ?",
          },
        ],
      },
    ],
  },

  // 9 ───────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-09-telling-stories",
    level: "B1",
    focus: "telling_stories",
    title_en: "Telling a story: sequencing a past event",
    title_vi: "Kể chuyện: sắp xếp một sự việc đã qua",
    note_en:
      "Thai marks sequence with words, not tense. แล้วก็ (láeo gɔ̂) = 'and then'; หลังจากนั้น (lǎng jàak nán) = 'after that'; สุดท้าย (sùt tháai) = 'finally'. Past is shown by time words or แล้ว (already). Keep clauses short and chain them.",
    note_vi:
      "Tiếng Thái đánh dấu trình tự bằng từ, không bằng thì. แล้วก็ (láeo gɔ̂) = 'rồi thì'; หลังจากนั้น (lǎng jàak nán) = 'sau đó'; สุดท้าย (sùt tháai) = 'cuối cùng'. Quá khứ thể hiện qua từ chỉ thời gian hoặc แล้ว (rồi). Câu ngắn, nối chuỗi.",
    examples: [
      {
        th: "เมื่อวานผมตื่นสาย แล้วก็รีบไปทำงาน",
        rtgs: "muea wan phom tuen sai, laeo gɔ rip pai tham ngan",
        pron: "เมื่อวาน 'mʉ̂a-waan' = yesterday",
        en: "Yesterday I woke up late and then rushed to work.",
        vi: "Hôm qua tôi dậy muộn rồi vội đi làm.",
      },
      {
        th: "หลังจากนั้นรถก็เสียกลางทาง",
        rtgs: "lang jak nan, rot gɔ sia klang thang",
        en: "After that, the car broke down on the way.",
        vi: "Sau đó xe bị hỏng giữa đường.",
      },
      {
        th: "สุดท้ายผมก็ไปถึงที่ทำงานตอนบ่าย",
        rtgs: "sut thai phom gɔ pai thueng thi tham ngan tɔn bai",
        en: "Finally I reached work in the afternoon.",
        vi: "Cuối cùng tôi tới chỗ làm vào buổi chiều.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Tell a 3-step story about your weekend using แล้วก็ / หลังจากนั้น / สุดท้าย.",
        prompt_vi:
          "Kể một câu chuyện 3 bước về cuối tuần của bạn dùng แล้วก็ / หลังจากนั้น / สุดท้าย.",
        answers: [
          {
            th: "เสาร์ที่แล้วผมไปตลาด แล้วก็ทำกับข้าว หลังจากนั้นก็ดูหนัง สุดท้ายนอนเร็ว",
            rtgs: "sao thi laeo phom pai talat, laeo gɔ tham kap khao, lang jak nan gɔ du nang, sut thai nɔn reo",
            en: "Last Saturday I went to the market, then cooked, after that watched a movie, and finally slept early.",
            vi: "Thứ Bảy tuần trước tôi đi chợ, rồi nấu ăn, sau đó xem phim, cuối cùng ngủ sớm.",
          },
        ],
      },
    ],
  },

  // 10 ──────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-10-polite-disagreement",
    level: "B1",
    focus: "polite_disagreement",
    title_en: "Polite disagreement: softening 'I don't think so'",
    title_vi: "Bất đồng lịch sự: làm nhẹ 'tôi không nghĩ vậy'",
    note_en:
      "Direct 'no' can feel harsh. Soften with ผมว่า… (phǒm wâa) = 'I think…', ไม่แน่ใจว่า… (mâi nɛ̂ɛ jai) = 'I'm not sure that…', and ไม่เห็นด้วย (mâi hěn dûai) = 'I disagree' (use gently). Add นะ / ครับ / ค่ะ to keep it warm. Often agree first, then add a 'but': เห็นด้วยส่วนหนึ่ง แต่… .",
    note_vi:
      "Nói 'không' thẳng dễ gắt. Làm nhẹ bằng ผมว่า… (phǒm wâa) = 'tôi nghĩ…', ไม่แน่ใจว่า… (mâi nɛ̂ɛ jai) = 'tôi không chắc rằng…', và ไม่เห็นด้วย (mâi hěn dûai) = 'tôi không đồng ý' (dùng nhẹ nhàng). Thêm นะ / ครับ / ค่ะ cho mềm. Thường đồng ý trước rồi thêm 'nhưng': เห็นด้วยส่วนหนึ่ง แต่… .",
    examples: [
      {
        th: "ผมว่าอาจจะไม่ใช่แบบนั้นนะครับ",
        rtgs: "phom wa at ja mai chai baep nan na khrap",
        pron: "อาจจะ 'àat-jà' = maybe (hedges)",
        en: "I think it might not be like that.",
        vi: "Tôi nghĩ có lẽ không phải như vậy đâu ạ.",
      },
      {
        th: "เห็นด้วยส่วนหนึ่ง แต่ผมมองต่างนิดหน่อย",
        rtgs: "hen duai suan nueng, tae phom mɔng tang nit nɔi",
        en: "I partly agree, but I see it a little differently.",
        vi: "Tôi đồng ý một phần, nhưng tôi nhìn hơi khác.",
      },
      {
        th: "ขอโทษนะครับ ผมไม่ค่อยเห็นด้วยเท่าไหร่",
        rtgs: "khɔthot na khrap, phom mai khɔi hen duai thao rai",
        pron: "ไม่ค่อย…เท่าไหร่ = 'not really very'",
        en: "Sorry, but I don't really agree.",
        vi: "Xin lỗi nhé, tôi không hẳn đồng ý lắm.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Disagree politely with a plan by agreeing partly first, then adding แต่.",
        prompt_vi:
          "Bất đồng lịch sự với một kế hoạch: đồng ý một phần trước, rồi thêm แต่.",
        answers: [
          {
            th: "ผมว่าไอเดียดีนะ แต่ผมไม่แน่ใจว่าจะทันเวลา",
            rtgs: "phom wa idia di na, tae phom mai nae jai wa ja than welaa",
            pron: "ทันเวลา 'than-welaa' = in time",
            en: "I think the idea is good, but I'm not sure we'll make it in time.",
            vi: "Tôi thấy ý tưởng hay đấy, nhưng tôi không chắc kịp giờ.",
          },
        ],
      },
    ],
  },

  // 11 ──────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-11-problem-solving",
    level: "B1",
    focus: "problem_solving",
    title_en: "Problem solving: naming a problem and proposing a fix",
    title_vi: "Giải quyết vấn đề: nêu vấn đề và đề xuất cách xử lý",
    note_en:
      "ปัญหา (panhǎa) = 'problem'; แก้ปัญหา (gɛ̂ɛ panhǎa) = 'solve a problem'. Propose with น่าจะ (nâa jà) = 'should/probably', ลอง…ดู (lɔɔng … duu) = 'try …ing', ทางออก (thaang ɔ̀ɔk) = 'a way out / solution'. Frame as suggestion, not order.",
    note_vi:
      "ปัญหา (panhǎa) = 'vấn đề'; แก้ปัญหา (gɛ̂ɛ panhǎa) = 'giải quyết vấn đề'. Đề xuất bằng น่าจะ (nâa jà) = 'nên/chắc là', ลอง…ดู (lɔɔng … duu) = 'thử …', ทางออก (thaang ɔ̀ɔk) = 'lối ra / giải pháp'. Diễn đạt như gợi ý, không phải ra lệnh.",
    examples: [
      {
        th: "ปัญหาคือเน็ตช้ามาก",
        rtgs: "panha khue net cha mak",
        pron: "คือ 'khʉʉ' = 'is / namely'",
        en: "The problem is the internet is very slow.",
        vi: "Vấn đề là mạng rất chậm.",
      },
      {
        th: "เราน่าจะลองรีสตาร์ทเราเตอร์ดู",
        rtgs: "rao na ja lɔng restart router du",
        en: "We should probably try restarting the router.",
        vi: "Chắc bọn mình nên thử khởi động lại router xem.",
      },
      {
        th: "ถ้ายังไม่ได้ ก็ค่อยโทรหาช่าง",
        rtgs: "thaa yang mai dai, gɔ khɔi tho ha chang",
        pron: "ค่อย 'khɔ̂i' = 'then (gradually)'",
        en: "If that still doesn't work, then we'll call a technician.",
        vi: "Nếu vẫn không được thì hẵng gọi thợ.",
      },
    ],
    practice: [
      {
        prompt_en:
          "State a problem with คือ, then propose two options with น่าจะ … and ถ้า … ก็ ….",
        prompt_vi:
          "Nêu một vấn đề bằng คือ, rồi đề xuất hai lựa chọn bằng น่าจะ … và ถ้า … ก็ ….",
        answers: [
          {
            th: "ปัญหาคือคนไม่พอ เราน่าจะจ้างเพิ่ม ถ้าไม่ได้ ก็แบ่งงานกันใหม่",
            rtgs: "panha khue khon mai phɔ, rao na ja jang phoem, thaa mai dai, gɔ baeng ngan gan mai",
            en: "The problem is we're short-staffed; we should hire more, and if not, we'll redistribute the work.",
            vi: "Vấn đề là thiếu người; mình nên thuê thêm, nếu không được thì chia lại công việc.",
          },
        ],
      },
    ],
  },

  // 12 ──────────────────────────────────────────────────────────────────────
  {
    id: "th-b1-core-12-review-mixed",
    level: "B1",
    focus: "giving_reasons",
    title_en: "Review: combining reason, condition and comparison",
    title_vi: "Ôn tập: kết hợp lý do, điều kiện và so sánh",
    note_en:
      "B1 fluency is about joining clauses smoothly. This lesson chains the batch's connectors: เพราะ (reason) + ถ้า…ก็ (condition) + กว่า (comparison) + แต่ (contrast). Aim for two-clause sentences spoken with linked rhythm (Lesson 1).",
    note_vi:
      "Sự trôi chảy ở B1 là nối các mệnh đề mượt mà. Bài này kết hợp các từ nối của cả loạt: เพราะ (lý do) + ถ้า…ก็ (điều kiện) + กว่า (so sánh) + แต่ (đối lập). Hãy nói câu hai mệnh đề với nhịp nối (Bài 1).",
    examples: [
      {
        th: "ผมเลือกที่นี่เพราะถูกกว่า แต่บริการช้าหน่อย",
        rtgs: "phom lueak thi ni phrɔ thuk gwa, tae bɔrikan cha nɔi",
        pron: "ถูกกว่า 'thùuk-gwàa' = cheaper",
        en: "I chose this place because it's cheaper, but the service is a bit slow.",
        vi: "Tôi chọn chỗ này vì rẻ hơn, nhưng dịch vụ hơi chậm.",
      },
      {
        th: "ถ้าราคาเท่ากัน ผมก็จะเลือกร้านที่ใกล้กว่า",
        rtgs: "thaa rakha thao gan, phom gɔ ja lueak ran thi klai gwa",
        en: "If the prices are the same, I'll choose the closer shop.",
        vi: "Nếu giá bằng nhau thì tôi sẽ chọn quán gần hơn.",
      },
    ],
    practice: [
      {
        prompt_en:
          "In 2–3 linked clauses, explain a choice using because + a comparison + a contrast.",
        prompt_vi:
          "Trong 2–3 mệnh đề nối nhau, giải thích một lựa chọn dùng bởi vì + so sánh + đối lập.",
        answers: [
          {
            th: "ผมไปทำงานด้วยรถไฟฟ้าเพราะเร็วกว่ารถยนต์ แต่แพงกว่านิดหน่อย",
            rtgs: "phom pai tham ngan duai rotfaifa phrɔ reo gwa rotyon, tae phaeng gwa nit nɔi",
            pron: "รถไฟฟ้า 'rót-fai-fáa' = skytrain",
            en: "I go to work by skytrain because it's faster than a car, but it's a little more expensive.",
            vi: "Tôi đi làm bằng tàu điện vì nhanh hơn ô tô, nhưng đắt hơn một chút.",
          },
        ],
      },
    ],
  },
];

export default thaiB1CoreLessons;
