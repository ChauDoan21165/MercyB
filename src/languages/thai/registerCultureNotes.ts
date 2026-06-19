// Thai register & culture notes — safe-communication guidance.
// Vietnamese-first (L1 = Vietnamese), English companion fields throughout.
//
// SCOPE / STATUS: Practical *study-support* notes to help learners avoid
// register/politeness mistakes. NOT native-certified authority; native review
// is DEFERRED. These are general communication patterns, not rules about any
// group of people — do not read them as stereotypes. Romanization is a reading
// aid, not an orthographic standard.
//
// Self-contained on purpose: the Thai folder ships no shared registry yet, so
// the types are declared inline.
//
// Topics: politeness particles, pronouns, status/age hierarchy, indirect
// refusal, softening, apologies, requests, taboo/risky phrasing,
// temple/royal/formal caution, customer service, workplace respect.
//
// Each note ships a concrete "safer phrase" example (Thai script + meaning).

export type ThaiCefrLevel = "A2" | "B1" | "B2" | "C1" | "C2";

export type RegisterTopic =
  | "politeness_particles"
  | "pronouns"
  | "status_age_hierarchy"
  | "indirect_refusal"
  | "softening"
  | "apologies"
  | "requests"
  | "taboo_risky"
  | "temple_royal_formal"
  | "customer_service"
  | "workplace_respect";

// A reusable phrase block. `thai` is authoritative; `rtgs` is a reading aid.
export type Phrase = {
  thai: string;
  rtgs?: string;
  vi: string; // Vietnamese meaning
  en: string; // English meaning
};

export type RegisterCultureNote = {
  id: string;
  level: ThaiCefrLevel;
  topic: RegisterTopic;
  title_vi: string;
  title_en: string;
  note_vi: string; // the explanation / why it matters (Vietnamese)
  note_en: string; // the explanation / why it matters (English)
  // Optional risky phrasing to steer AWAY from (no slurs, just register risk).
  avoid?: Phrase;
  // Required: a concrete safer alternative learners can copy.
  safer_phrase: Phrase;
  tip_vi?: string;
  tip_en?: string;
};

export const TOPIC_ORDER: RegisterTopic[] = [
  "politeness_particles",
  "pronouns",
  "status_age_hierarchy",
  "indirect_refusal",
  "softening",
  "apologies",
  "requests",
  "taboo_risky",
  "temple_royal_formal",
  "customer_service",
  "workplace_respect",
];

export const notes: RegisterCultureNote[] = [
  // ───────────────── politeness_particles ─────────────────
  {
    id: "thr_pp_01",
    level: "A2",
    topic: "politeness_particles",
    title_vi: "ครับ / ค่ะ — trợ từ lịch sự theo giới tính người nói",
    title_en: "ครับ / ค่ะ — polite particles by speaker's gender",
    note_vi:
      "Người nói NAM kết câu bằng ครับ; người nói NỮ dùng ค่ะ (câu trần) và คะ (câu hỏi). Bỏ trợ từ này khiến câu nghe cộc lốc.",
    note_en:
      "MALE speakers end with ครับ; FEMALE speakers use ค่ะ (statements) and คะ (questions). Dropping it can sound curt.",
    safer_phrase: {
      thai: "ขอบคุณครับ / ขอบคุณค่ะ",
      rtgs: "khop-khun khrap / khop-khun kha",
      vi: "Cảm ơn ạ (nam / nữ).",
      en: "Thank you (male / female).",
    },
    tip_vi: "Khi chưa quen ai, luôn thêm ครับ/ค่ะ — thừa lịch sự an toàn hơn thiếu.",
    tip_en: "With people you don't know, always add ครับ/ค่ะ — over-polite beats under-polite.",
  },
  {
    id: "thr_pp_02",
    level: "A2",
    topic: "politeness_particles",
    title_vi: "นะ làm mềm lời nói",
    title_en: "นะ softens what you say",
    note_vi:
      "« นะ » ở cuối câu làm lời nói dịu, thân thiện hơn, giảm cảm giác ra lệnh. Hợp khi nhắc nhở hay rủ rê.",
    note_en:
      "« นะ » at the end softens a sentence and reduces any commanding tone. Good for reminders or gentle suggestions.",
    avoid: {
      thai: "รอตรงนี้",
      rtgs: "ror trong-nii",
      vi: "Đợi ở đây. (cụt, như ra lệnh)",
      en: "Wait here. (blunt, command-like)",
    },
    safer_phrase: {
      thai: "รอตรงนี้นะคะ",
      rtgs: "ror trong-nii na kha",
      vi: "Đợi ở đây nhé.",
      en: "Wait here, okay?",
    },
  },
  {
    id: "thr_pp_03",
    level: "B1",
    topic: "politeness_particles",
    title_vi: "ครับผม / ค่ะ nhấn mạnh sự tôn trọng",
    title_en: "ครับผม / emphatic ค่ะ for extra respect",
    note_vi:
      "Nam có thể nói « ครับผม » để tỏ kính trọng/đồng thuận nhiệt tình với người trên. Dùng đúng lúc nghe rất lễ phép.",
    note_en:
      "Men can say « ครับผม » to show heightened respect/eager agreement to a senior. Used aptly it sounds very courteous.",
    safer_phrase: {
      thai: "ได้เลยครับผม",
      rtgs: "dai loei khrap-phom",
      vi: "Vâng được ạ (rất lễ phép).",
      en: "Certainly, sir (very respectful).",
    },
  },
  {
    id: "thr_pp_04",
    level: "B2",
    topic: "politeness_particles",
    title_vi: "Tránh trợ từ thô: วะ, โว้ย",
    title_en: "Avoid crude particles: วะ, โว้ย",
    note_vi:
      "« วะ » và « โว้ย » chỉ dùng giữa bạn rất thân hoặc khi đùa. Với người lạ/cấp trên, chúng nghe thô tục và gây mất lòng.",
    note_en:
      "« วะ » and « โว้ย » belong among very close friends or joking. With strangers/superiors they sound vulgar and offend.",
    avoid: {
      thai: "ไปไหนวะ",
      rtgs: "pai nai wa",
      vi: "Đi đâu thế? (thô, suồng sã)",
      en: "Where you going? (crude, overly familiar)",
    },
    safer_phrase: {
      thai: "ไปไหนครับ / ไปไหนคะ",
      rtgs: "pai nai khrap / pai nai kha",
      vi: "Anh/chị đi đâu vậy ạ?",
      en: "Where are you going? (polite)",
    },
  },
  {
    id: "thr_pp_05",
    level: "C1",
    topic: "politeness_particles",
    title_vi: "Chồng trợ từ: นะครับ / นะคะ",
    title_en: "Stacking particles: นะครับ / นะคะ",
    note_vi:
      "Ghép « นะ » + « ครับ/ค่ะ » vừa làm mềm vừa giữ lịch sự — rất hữu ích khi từ chối, nhắc nhở, hoặc đưa tin không vui.",
    note_en:
      "Combining « นะ » + « ครับ/ค่ะ » softens AND stays polite — handy for refusals, reminders, or delivering bad news.",
    safer_phrase: {
      thai: "ขอโทษ วันนี้ไม่สะดวกจริง ๆ นะครับ",
      rtgs: "khaw-thot, wan-nii mai sa-duak jing-jing na khrap",
      vi: "Xin lỗi, hôm nay thật sự không tiện ạ.",
      en: "Sorry, today really isn't convenient.",
    },
  },

  // ───────────────── pronouns ─────────────────
  {
    id: "thr_pr_01",
    level: "A2",
    topic: "pronouns",
    title_vi: "ผม / ดิฉัน — 'tôi' lịch sự",
    title_en: "ผม / ดิฉัน — polite 'I'",
    note_vi:
      "Nam tự xưng « ผม »; nữ dùng « ดิฉัน » (trang trọng) hoặc « ฉัน » (thân hơn). Đây là lựa chọn an toàn trong hầu hết tình huống.",
    note_en:
      "Men use « ผม »; women use « ดิฉัน » (formal) or « ฉัน » (more casual). A safe default in most settings.",
    safer_phrase: {
      thai: "ผมชื่อ... / ดิฉันชื่อ...",
      rtgs: "phom chue... / di-chan chue...",
      vi: "Tôi tên là... (nam / nữ).",
      en: "My name is... (male / female).",
    },
  },
  {
    id: "thr_pr_02",
    level: "A2",
    topic: "pronouns",
    title_vi: "พี่ / น้อง — xưng hô theo tuổi",
    title_en: "พี่ / น้อง — address by relative age",
    note_vi:
      "Gọi người lớn tuổi hơn một chút là « พี่ », nhỏ hơn là « น้อง », kể cả với người lạ. Đây là cách tạo thiện cảm rất phổ biến.",
    note_en:
      "Call someone slightly older « พี่ » and someone younger « น้อง », even strangers. A very common, warm way to address people.",
    safer_phrase: {
      thai: "พี่ครับ ขอถามหน่อย",
      rtgs: "phii khrap, khaw thaam noi",
      vi: "Anh/chị ơi, cho em hỏi chút.",
      en: "Excuse me (older one), may I ask something?",
    },
  },
  {
    id: "thr_pr_03",
    level: "B1",
    topic: "pronouns",
    title_vi: "Dùng tên thay đại từ cho lịch sự",
    title_en: "Use names instead of pronouns for politeness",
    note_vi:
      "Người Thái thường gọi nhau bằng tên/biệt danh + ไม่ dùng 'bạn/tôi'. Điều này nghe gần gũi và tránh chọn sai đại từ.",
    note_en:
      "Thais often use names/nicknames instead of 'you/I'. It sounds friendly and avoids picking the wrong pronoun.",
    safer_phrase: {
      thai: "คุณสมชายสะดวกไหมครับ",
      rtgs: "khun som-chai sa-duak mai khrap",
      vi: "Anh Somchai có tiện không ạ? (dùng tên thay 'bạn')",
      en: "Is it convenient for you, Khun Somchai? (name instead of 'you')",
    },
  },
  {
    id: "thr_pr_04",
    level: "B2",
    topic: "pronouns",
    title_vi: "กู / มึง — chỉ dùng với bạn rất thân",
    title_en: "กู / มึง — only with very close friends",
    note_vi:
      "« กู/มึง » (tao/mày) rất thân mật; dùng sai ngữ cảnh là cực kỳ thô lỗ. Đừng dùng ở nơi làm việc hay với người mới quen.",
    note_en:
      "« กู/มึง » (I/you, intimate) is very close; out of context it's extremely rude. Never use it at work or with new acquaintances.",
    avoid: {
      thai: "มึงไปก่อนเลย",
      rtgs: "mueng pai kawn loei",
      vi: "Mày đi trước đi. (chỉ hợp bạn thân)",
      en: "You go ahead. (only among close friends)",
    },
    safer_phrase: {
      thai: "คุณไปก่อนเลยครับ",
      rtgs: "khun pai kawn loei khrap",
      vi: "Anh/bạn đi trước đi ạ.",
      en: "Please go ahead.",
    },
  },
  {
    id: "thr_pr_05",
    level: "C1",
    topic: "pronouns",
    title_vi: "ท่าน — đại từ tôn kính",
    title_en: "ท่าน — the honorific pronoun",
    note_vi:
      "Dùng « ท่าน » cho người địa vị cao (quan chức, nhà sư, bậc đáng kính). Với bạn bè/trẻ em nghe lố và xa cách.",
    note_en:
      "Use « ท่าน » for high-status people (officials, monks, dignitaries). With friends/children it sounds absurd and cold.",
    safer_phrase: {
      thai: "เรียนเชิญท่านประธานครับ",
      rtgs: "rian-choen thaan pra-thaan khrap",
      vi: "Kính mời ngài chủ tịch ạ.",
      en: "We respectfully invite you, Mr. Chairman.",
    },
  },

  // ───────────────── status_age_hierarchy ─────────────────
  {
    id: "thr_sa_01",
    level: "A2",
    topic: "status_age_hierarchy",
    title_vi: "Dùng chức danh: อาจารย์, หมอ, คุณหมอ",
    title_en: "Use titles: อาจารย์, หมอ, คุณหมอ",
    note_vi:
      "Gọi giáo viên là « อาจารย์ », bác sĩ là « คุณหมอ » thay vì 'bạn'. Dùng chức danh là cách thể hiện tôn trọng địa vị.",
    note_en:
      "Address a teacher as « อาจารย์ », a doctor as « คุณหมอ » rather than 'you'. Titles show respect for status.",
    safer_phrase: {
      thai: "ขอบคุณคุณหมอครับ",
      rtgs: "khop-khun khun-maw khrap",
      vi: "Cảm ơn bác sĩ ạ.",
      en: "Thank you, doctor.",
    },
  },
  {
    id: "thr_sa_02",
    level: "B1",
    topic: "status_age_hierarchy",
    title_vi: "Nhường lời và để người trên quyết định",
    title_en: "Defer and let the senior decide",
    note_vi:
      "Trong nhóm, để người lớn tuổi/cấp cao hơn phát biểu hoặc quyết trước là phép lịch sự. Tránh ngắt lời hay vượt mặt.",
    note_en:
      "In a group, letting the elder/senior speak or decide first is courteous. Avoid interrupting or overriding them.",
    safer_phrase: {
      thai: "แล้วแต่พี่เลยครับ",
      rtgs: "laeo-tae phii loei khrap",
      vi: "Tùy anh/chị quyết ạ.",
      en: "It's up to you (senior).",
    },
  },
  {
    id: "thr_sa_03",
    level: "B2",
    topic: "status_age_hierarchy",
    title_vi: "Khoảng cách quyền lực trong cách hỏi",
    title_en: "Power distance shapes how you ask",
    note_vi:
      "Với cấp trên, hãy hỏi gián tiếp và mở đường lui. Câu trực diện có thể bị xem là gây áp lực hoặc thiếu tôn trọng.",
    note_en:
      "With a superior, ask indirectly and leave an exit. A direct demand can feel pressuring or disrespectful.",
    avoid: {
      thai: "ตอบผมภายในวันนี้",
      rtgs: "tawp phom phai-nai wan-nii",
      vi: "Trả lời tôi trong hôm nay. (ép buộc)",
      en: "Answer me by today. (pressuring)",
    },
    safer_phrase: {
      thai: "ไม่ทราบว่าพอจะตอบกลับภายในวันนี้ได้ไหมครับ",
      rtgs: "mai saap waa phaw ja tawp-klap phai-nai wan-nii dai mai khrap",
      vi: "Không biết anh/chị có thể phản hồi trong hôm nay được không ạ?",
      en: "Might it be possible to reply by today, if I may ask?",
    },
  },
  {
    id: "thr_sa_04",
    level: "B2",
    topic: "status_age_hierarchy",
    title_vi: "Cúi đầu nhẹ kèm 'ไหว้' khi chào người trên",
    title_en: "A slight bow with the 'ไหว้' when greeting seniors",
    note_vi:
      "Chào người trên thường đi kèm động tác « ไหว้ » (chắp tay). Lời nói nên đi cùng thái độ khiêm nhường tương ứng.",
    note_en:
      "Greeting a senior often pairs with the « ไหว้ » (palms together). Your words should match that humble manner.",
    safer_phrase: {
      thai: "สวัสดีครับ ยินดีที่ได้รู้จักครับ",
      rtgs: "sa-wat-dii khrap, yin-dii thii dai ruu-jak khrap",
      vi: "Xin chào ạ, rất hân hạnh được biết anh/chị.",
      en: "Hello, pleased to meet you.",
    },
  },
  {
    id: "thr_sa_05",
    level: "C1",
    topic: "status_age_hierarchy",
    title_vi: "Khiêm nhường khi nói về thành tích của mình",
    title_en: "Downplay your own achievements",
    note_vi:
      "Tự hạ thấp nhẹ (« ยังต้องเรียนรู้อีกมาก ») được đánh giá cao hơn khoe khoang. Khiêm tốn củng cố quan hệ trong hệ thứ bậc.",
    note_en:
      "Mild self-deprecation (« I still have much to learn ») is valued over boasting. Humility strengthens standing in a hierarchy.",
    safer_phrase: {
      thai: "ผมยังต้องเรียนรู้อีกมากครับ",
      rtgs: "phom yang tong rian-ruu iik maak khrap",
      vi: "Tôi vẫn còn phải học hỏi nhiều ạ.",
      en: "I still have a lot to learn.",
    },
  },

  // ───────────────── indirect_refusal ─────────────────
  {
    id: "thr_ir_01",
    level: "B1",
    topic: "indirect_refusal",
    title_vi: "Từ chối bằng cách hoãn 'dịp sau'",
    title_en: "Refuse by deferring to 'next time'",
    note_vi:
      "Thay vì « ไม่ » thẳng, người Thái thường hoãn sang « ไว้โอกาสหน้า » (để dịp sau). Đây là cách từ chối giữ thể diện cả hai.",
    note_en:
      "Instead of a flat « no », Thais often defer with « ไว้โอกาสหน้า » (next time). It refuses while saving face for both.",
    avoid: {
      thai: "ไม่ไป",
      rtgs: "mai pai",
      vi: "Không đi. (cụt lủn)",
      en: "Not going. (blunt)",
    },
    safer_phrase: {
      thai: "ขอบคุณนะครับ ไว้โอกาสหน้าแล้วกันนะครับ",
      rtgs: "khop-khun na khrap, wai oo-kaat naa laeo-kan na khrap",
      vi: "Cảm ơn nhé, để dịp sau vậy ạ.",
      en: "Thanks — let's make it next time.",
    },
  },
  {
    id: "thr_ir_02",
    level: "B2",
    topic: "indirect_refusal",
    title_vi: "« ไม่สะดวก » thay cho 'không'",
    title_en: "« ไม่สะดวก » instead of 'no'",
    note_vi:
      "« ไม่สะดวก » (không tiện) là cách từ chối mềm, không nêu lý do cụ thể, tránh làm người mời mất mặt.",
    note_en:
      "« ไม่สะดวก » (not convenient) softly declines without a specific reason, sparing the inviter's face.",
    avoid: {
      thai: "ไม่อยากไป",
      rtgs: "mai yaak pai",
      vi: "Không muốn đi. (thẳng, dễ mất lòng)",
      en: "I don't want to go. (blunt, face-threatening)",
    },
    safer_phrase: {
      thai: "ช่วงนี้ไม่ค่อยสะดวกเท่าไรครับ",
      rtgs: "chuang-nii mai-khoi sa-duak thao-rai khrap",
      vi: "Dạo này tôi không tiện lắm ạ.",
      en: "I'm not really available these days.",
    },
  },
  {
    id: "thr_ir_03",
    level: "B2",
    topic: "indirect_refusal",
    title_vi: "Đọc tín hiệu im lặng / lảng tránh = 'không'",
    title_en: "Read silence/evasion as a 'no'",
    note_vi:
      "Khi người Thái ngập ngừng, đổi chủ đề hoặc cười trừ, đó thường là lời từ chối ngầm. Đừng ép họ nói 'không' thẳng.",
    note_en:
      "When a Thai speaker hesitates, changes topic, or gives an awkward smile, it's often an implied refusal. Don't force a blunt 'no'.",
    safer_phrase: {
      thai: "ไม่เป็นไรครับ ไม่ต้องเกรงใจนะครับ",
      rtgs: "mai pen-rai khrap, mai tong kreng-jai na khrap",
      vi: "Không sao đâu ạ, anh/chị đừng ngại.",
      en: "It's fine — please don't feel obliged.",
    },
  },
  {
    id: "thr_ir_04",
    level: "C1",
    topic: "indirect_refusal",
    title_vi: "Từ chối lời nhờ trong công việc",
    title_en: "Declining a work request",
    note_vi:
      "Nêu một trở ngại khách quan rồi đề xuất hướng khác sẽ nhẹ hơn là từ chối thẳng. Giữ giọng hợp tác.",
    note_en:
      "Citing an objective constraint then offering an alternative lands softer than a flat refusal. Keep a cooperative tone.",
    safer_phrase: {
      thai: "ช่วงนี้งานค่อนข้างแน่น เดี๋ยวขอดูตารางแล้วแจ้งกลับนะครับ",
      rtgs: "chuang-nii ngaan khon-khaang naen, diao khaw duu taa-raang laeo jaeng-klap na khrap",
      vi: "Dạo này việc khá kín, để tôi xem lịch rồi báo lại nhé ạ.",
      en: "Things are quite full now — let me check my schedule and get back to you.",
    },
  },
  {
    id: "thr_ir_05",
    level: "C2",
    topic: "indirect_refusal",
    title_vi: "« น่าสนใจ แต่... » trong họp = từ chối mềm",
    title_en: "« interesting, but... » in meetings = soft no",
    note_vi:
      "Câu « น่าสนใจ แต่คงต้องพิจารณาอีกที » thường là lời từ chối/hoãn lịch sự, không phải đồng ý. Đừng hiểu theo nghĩa đen.",
    note_en:
      "« Interesting, but we'd have to reconsider » is usually a polite deferral/refusal, not agreement. Don't take it literally.",
    safer_phrase: {
      thai: "เป็นข้อเสนอที่น่าสนใจครับ ขอนำกลับไปพิจารณาก่อนนะครับ",
      rtgs: "pen khaw-sa-noe thii naa-son-jai khrap, khaw nam klap pai phi-jaa-ra-naa kawn na khrap",
      vi: "Đây là đề xuất thú vị ạ, cho tôi mang về cân nhắc thêm nhé.",
      en: "It's an interesting proposal — let me take it back to consider.",
    },
  },

  // ───────────────── softening ─────────────────
  {
    id: "thr_so_01",
    level: "A2",
    topic: "softening",
    title_vi: "หน่อย làm dịu yêu cầu",
    title_en: "หน่อย softens a request",
    note_vi:
      "Thêm « หน่อย » (một chút) biến mệnh lệnh thành lời nhờ nhẹ nhàng. Rất cần khi sai bảo hay xin việc gì.",
    note_en:
      "Adding « หน่อย » (a little) turns a command into a gentle request. Essential when asking for anything.",
    avoid: {
      thai: "ส่งเกลือ",
      rtgs: "song kluea",
      vi: "Đưa muối. (cộc)",
      en: "Pass the salt. (curt)",
    },
    safer_phrase: {
      thai: "ขอเกลือหน่อยได้ไหมคะ",
      rtgs: "khaw kluea noi dai mai kha",
      vi: "Cho xin chút muối được không ạ?",
      en: "Could I have some salt, please?",
    },
  },
  {
    id: "thr_so_02",
    level: "B1",
    topic: "softening",
    title_vi: "« พอดี » để bào chữa nhẹ nhàng",
    title_en: "« พอดี » to excuse gently",
    note_vi:
      "« พอดี » (vừa hay/tình cờ) làm dịu một lời từ chối hay giải thích, khiến nó nghe như hoàn cảnh, không phải ý muốn.",
    note_en:
      "« พอดี » (as it happens) softens a refusal or excuse, framing it as circumstance rather than will.",
    safer_phrase: {
      thai: "พอดีติดธุระนิดหน่อยครับ",
      rtgs: "phaw-dii tit thu-ra nit-noi khrap",
      vi: "Tình cờ tôi có chút việc bận ạ.",
      en: "As it happens, I have a small errand.",
    },
  },
  {
    id: "thr_so_03",
    level: "B2",
    topic: "softening",
    title_vi: "« อาจจะ » giảm độ chắc chắn của lời chê",
    title_en: "« อาจจะ » dilutes criticism",
    note_vi:
      "Gắn « อาจจะ » (có thể) trước nhận xét tiêu cực làm nó bớt gay gắt và để chừa khả năng mình sai.",
    note_en:
      "Prefacing a negative remark with « อาจจะ » (perhaps) takes the edge off and leaves room that you're wrong.",
    avoid: {
      thai: "ตรงนี้ผิด",
      rtgs: "trong-nii phit",
      vi: "Chỗ này sai. (thẳng thừng)",
      en: "This part is wrong. (blunt)",
    },
    safer_phrase: {
      thai: "ตรงนี้อาจจะต้องดูอีกทีนะครับ",
      rtgs: "trong-nii aat-ja tong duu iik-thii na khrap",
      vi: "Chỗ này có lẽ nên xem lại một chút ạ.",
      en: "This part might need another look.",
    },
  },
  {
    id: "thr_so_04",
    level: "C1",
    topic: "softening",
    title_vi: "Công nhận trước, góp ý sau",
    title_en: "Acknowledge first, then suggest",
    note_vi:
      "Mở đầu bằng một lời công nhận (« ก็ดีนะครับ ») rồi mới đề xuất thay đổi giúp người nghe dễ tiếp nhận.",
    note_en:
      "Opening with acknowledgement (« that's good ») before suggesting a change makes feedback easier to accept.",
    safer_phrase: {
      thai: "โดยรวมดีครับ แต่ถ้าปรับตรงนี้นิดนึงน่าจะดีขึ้นนะครับ",
      rtgs: "doi-ruam dii khrap, tae thaa prap trong-nii nit-nueng naa-ja dii khuen na khrap",
      vi: "Tổng thể tốt ạ, nhưng chỉnh chỗ này một chút chắc sẽ tốt hơn.",
      en: "Overall it's good; tweaking this bit a little would likely improve it.",
    },
  },
  {
    id: "thr_so_05",
    level: "C2",
    topic: "softening",
    title_vi: "Phủ định kép để khen/chê tinh tế",
    title_en: "Double negatives for subtle judgement",
    note_vi:
      "« ไม่ใช่ว่าไม่ดี » (không phải là không tốt) là cách khẳng định dè dặt, thường ngụ ý 'tạm ổn nhưng còn dở dang'.",
    note_en:
      "« It's not that it's bad » is a hedged affirmation, often implying 'okay but incomplete'.",
    safer_phrase: {
      thai: "ก็ไม่ใช่ว่าไม่ดีนะครับ เพียงแต่ยังปรับได้อีก",
      rtgs: "kaw mai chai waa mai dii na khrap, phiang-tae yang prap dai iik",
      vi: "Cũng không phải là không tốt ạ, chỉ là vẫn còn chỉnh được thêm.",
      en: "It's not that it's bad — only that it can still be refined.",
    },
  },

  // ───────────────── apologies ─────────────────
  {
    id: "thr_ap_01",
    level: "A2",
    topic: "apologies",
    title_vi: "ขอโทษ — xin lỗi cơ bản",
    title_en: "ขอโทษ — the basic apology",
    note_vi:
      "« ขอโทษ » dùng cả để xin lỗi và để xin phép/đi qua. Thêm ครับ/ค่ะ cho lịch sự.",
    note_en:
      "« ขอโทษ » works for both 'sorry' and 'excuse me'. Add ครับ/ค่ะ for politeness.",
    safer_phrase: {
      thai: "ขอโทษครับ ขอทางหน่อยครับ",
      rtgs: "khaw-thot khrap, khaw thaang noi khrap",
      vi: "Xin lỗi ạ, cho tôi qua một chút.",
      en: "Excuse me, may I get through?",
    },
  },
  {
    id: "thr_ap_02",
    level: "B1",
    topic: "apologies",
    title_vi: "Xin lỗi trang trọng: ขออภัย",
    title_en: "Formal apology: ขออภัย",
    note_vi:
      "« ขออภัย » trang trọng hơn « ขอโทษ », hợp văn bản, thông báo, hay tình huống nghiêm túc.",
    note_en:
      "« ขออภัย » is more formal than « ขอโทษ », fitting notices, announcements, or serious situations.",
    safer_phrase: {
      thai: "ขออภัยในความไม่สะดวกครับ",
      rtgs: "khaw a-phai nai khwaam mai sa-duak khrap",
      vi: "Thành thật xin lỗi vì sự bất tiện ạ.",
      en: "We apologise for the inconvenience.",
    },
  },
  {
    id: "thr_ap_03",
    level: "B2",
    topic: "apologies",
    title_vi: "Nhận lỗi nhẹ để giữ hòa khí",
    title_en: "Accept a little fault to keep harmony",
    note_vi:
      "Nhận một phần trách nhiệm (« เป็นความผิดของผมเองครับ ») thường làm dịu căng thẳng nhanh hơn là tranh đúng-sai.",
    note_en:
      "Taking partial responsibility (« it was my fault ») often defuses tension faster than arguing right and wrong.",
    safer_phrase: {
      thai: "ต้องขอโทษด้วยครับ เป็นความเข้าใจผิดของผมเอง",
      rtgs: "tong khaw-thot duai khrap, pen khwaam khao-jai-phit khong phom eng",
      vi: "Tôi phải xin lỗi ạ, là do tôi hiểu nhầm.",
      en: "I must apologise — it was my own misunderstanding.",
    },
  },
  {
    id: "thr_ap_04",
    level: "C1",
    topic: "apologies",
    title_vi: "Xin lỗi kèm hướng khắc phục",
    title_en: "Apologise with a remedy",
    note_vi:
      "Một lời xin lỗi mạnh đi cùng giải pháp cụ thể. Chỉ nói 'xin lỗi' suông đôi khi nghe thiếu chân thành.",
    note_en:
      "A strong apology pairs with a concrete fix. A bare 'sorry' can sound hollow.",
    safer_phrase: {
      thai: "ขออภัยที่ล่าช้าครับ เดี๋ยวผมรีบดำเนินการให้ทันทีครับ",
      rtgs: "khaw a-phai thii laa-chaa khrap, diao phom rip dam-noen-kaan hai than-thii khrap",
      vi: "Xin lỗi vì sự chậm trễ ạ, tôi sẽ xử lý ngay lập tức.",
      en: "Apologies for the delay — I'll handle it right away.",
    },
  },

  // ───────────────── requests ─────────────────
  {
    id: "thr_rq_01",
    level: "A2",
    topic: "requests",
    title_vi: "Khung ช่วย...หน่อย để nhờ vả",
    title_en: "The ช่วย...หน่อย request frame",
    note_vi:
      "« ช่วย » (giúp) + động từ + « หน่อย » là khung nhờ vả chuẩn, lịch sự và dễ chấp nhận.",
    note_en:
      "« ช่วย » (help) + verb + « หน่อย » is the standard, polite, easy-to-accept request frame.",
    avoid: {
      thai: "ถ่ายรูปให้",
      rtgs: "thaai-ruup hai",
      vi: "Chụp ảnh đi. (như ra lệnh)",
      en: "Take a photo. (command-like)",
    },
    safer_phrase: {
      thai: "ช่วยถ่ายรูปให้หน่อยได้ไหมครับ",
      rtgs: "chuai thaai-ruup hai noi dai mai khrap",
      vi: "Giúp chụp ảnh giúp tôi một chút được không ạ?",
      en: "Could you help take a photo for me, please?",
    },
  },
  {
    id: "thr_rq_02",
    level: "B1",
    topic: "requests",
    title_vi: "Đuôi hỏi ...ได้ไหม chừa quyền từ chối",
    title_en: "The ...ได้ไหม tag leaves room to decline",
    note_vi:
      "Kết yêu cầu bằng « ...ได้ไหม » (được không) biến lệnh thành lời mời, cho người nghe quyền nói không.",
    note_en:
      "Ending a request with « ...ได้ไหม » (is that okay?) turns a command into an invitation, granting the right to refuse.",
    safer_phrase: {
      thai: "รบกวนช่วยส่งเอกสารให้หน่อยได้ไหมครับ",
      rtgs: "rop-kuan chuai song ek-ka-saan hai noi dai mai khrap",
      vi: "Phiền giúp gửi tài liệu giúp tôi một chút được không ạ?",
      en: "May I trouble you to send the document, please?",
    },
  },
  {
    id: "thr_rq_03",
    level: "B2",
    topic: "requests",
    title_vi: "« รบกวน » thừa nhận mình đang làm phiền",
    title_en: "« รบกวน » acknowledges the imposition",
    note_vi:
      "Mở yêu cầu bằng « รบกวน » (làm phiền) cho thấy bạn ý thức gánh nặng mình tạo ra — rất được coi trọng.",
    note_en:
      "Opening with « รบกวน » (to trouble) shows you recognise the burden you're placing — much appreciated.",
    safer_phrase: {
      thai: "รบกวนสอบถามนิดนึงนะครับ",
      rtgs: "rop-kuan sawp-thaam nit-nueng na khrap",
      vi: "Phiền cho tôi hỏi một chút ạ.",
      en: "May I trouble you with a small question?",
    },
  },
  {
    id: "thr_rq_04",
    level: "C1",
    topic: "requests",
    title_vi: "Gắn điều kiện « ถ้าสะดวก » để giảm áp lực",
    title_en: "Add « ถ้าสะดวก » to ease pressure",
    note_vi:
      "Thêm « ถ้าสะดวก » (nếu tiện) cho người nghe lối thoát thoải mái, đặc biệt khi nhờ việc lớn.",
    note_en:
      "Adding « ถ้าสะดวก » (if convenient) gives the listener a graceful out, especially for bigger asks.",
    safer_phrase: {
      thai: "ถ้าสะดวก รบกวนช่วยรีวิวให้หน่อยนะครับ",
      rtgs: "thaa sa-duak, rop-kuan chuai rii-wiu hai noi na khrap",
      vi: "Nếu tiện, phiền anh/chị xem giúp một chút nhé ạ.",
      en: "If convenient, may I ask you to review it, please?",
    },
  },
  {
    id: "thr_rq_05",
    level: "C2",
    topic: "requests",
    title_vi: "Yêu cầu gián tiếp tối đa cho việc tế nhị",
    title_en: "Maximally indirect requests for delicate asks",
    note_vi:
      "Với việc nhạy cảm (mượn tiền, xin nghỉ), dùng câu hỏi gián tiếp + nhiều lớp dịu để người nghe dễ từ chối mà không ngại.",
    note_en:
      "For sensitive asks (borrowing money, time off), use indirect questions with multiple softeners so refusal stays easy.",
    safer_phrase: {
      thai: "ไม่ทราบว่าพอจะเป็นไปได้ไหมครับ ถ้าไม่สะดวกก็ไม่เป็นไรเลยนะครับ",
      rtgs: "mai saap waa phaw ja pen-pai-dai mai khrap, thaa mai sa-duak kaw mai pen-rai loei na khrap",
      vi: "Không biết có khả thi không ạ; nếu không tiện thì hoàn toàn không sao đâu ạ.",
      en: "I wonder if it might be possible — and if not convenient, it's completely fine.",
    },
  },

  // ───────────────── taboo_risky ─────────────────
  {
    id: "thr_tb_01",
    level: "B1",
    topic: "taboo_risky",
    title_vi: "Tránh chạm vào đầu người khác — và lời nói kèm theo",
    title_en: "Don't touch others' heads — and mind the wording",
    note_vi:
      "Đầu được xem là phần cao quý nhất; chân thấp nhất. Tránh nói/đùa về việc chạm đầu hay chỉ chân vào người/đồ thiêng.",
    note_en:
      "The head is considered the highest part, the feet the lowest. Avoid joking about touching heads or pointing feet at people/sacred objects.",
    safer_phrase: {
      thai: "ขอโทษนะครับ เผลอไปโดนหัว",
      rtgs: "khaw-thot na khrap, phloe pai don hua",
      vi: "Xin lỗi nhé, tôi lỡ chạm vào đầu.",
      en: "Sorry, I accidentally touched your head.",
    },
    tip_vi: "Nếu lỡ chạm đầu ai, một lời « ขอโทษ » ngay lập tức là phù hợp.",
    tip_en: "If you accidentally touch someone's head, an immediate « ขอโทษ » is appropriate.",
  },
  {
    id: "thr_tb_02",
    level: "B2",
    topic: "taboo_risky",
    title_vi: "Giữ bình tĩnh — tránh lớn tiếng nơi công cộng",
    title_en: "Stay calm — avoid raising your voice in public",
    note_vi:
      "Mất bình tĩnh, quát tháo nơi công cộng làm cả hai mất mặt và hiếm khi đạt kết quả. Hạ giọng và giữ nụ cười giúp giải quyết tốt hơn.",
    note_en:
      "Losing your temper or shouting in public causes mutual loss of face and rarely works. Lowering your voice and keeping a smile resolves more.",
    safer_phrase: {
      thai: "ใจเย็น ๆ นะครับ ค่อย ๆ คุยกัน",
      rtgs: "jai-yen-yen na khrap, khoi-khoi khui kan",
      vi: "Bình tĩnh nào ạ, mình từ từ nói chuyện.",
      en: "Let's stay calm and talk it through slowly.",
    },
  },
  {
    id: "thr_tb_03",
    level: "C1",
    topic: "taboo_risky",
    title_vi: "Thận trọng với chủ đề tôn giáo và chính trị",
    title_en: "Tread carefully with religion and politics",
    note_vi:
      "Tránh bình phẩm hay đùa cợt về tôn giáo, nghi lễ, hoặc các chủ đề chính trị nhạy cảm với người mới quen. Đặt câu hỏi tôn trọng thay vì đưa ý kiến.",
    note_en:
      "Avoid commenting on or joking about religion, rituals, or sensitive political topics with new acquaintances. Ask respectful questions rather than offering opinions.",
    safer_phrase: {
      thai: "ขออนุญาตถามเพื่อความเข้าใจนะครับ",
      rtgs: "khaw a-nu-yaat thaam phuea khwaam khao-jai na khrap",
      vi: "Cho phép tôi hỏi để hiểu thêm ạ.",
      en: "May I ask, just to understand better?",
    },
  },
  {
    id: "thr_tb_04",
    level: "C2",
    topic: "taboo_risky",
    title_vi: "Mỉa mai dễ hiểu lầm — dùng dè dặt",
    title_en: "Sarcasm misreads easily — use it sparingly",
    note_vi:
      "« ประชด » (nói mỉa) dựa nhiều vào ngữ điệu; với người chưa thân hoặc qua tin nhắn, nó dễ bị hiểu là xúc phạm. Khi nghi ngờ, nói thẳng và lịch sự.",
    note_en:
      "« ประชด » (sarcasm) leans on tone; with people you're not close to, or over text, it reads as insult. When in doubt, be plain and polite.",
    safer_phrase: {
      thai: "ผมขอพูดตรง ๆ อย่างสุภาพนะครับ",
      rtgs: "phom khaw phuut trong-trong yaang su-phaap na khrap",
      vi: "Cho tôi nói thẳng một cách lịch sự nhé ạ.",
      en: "Let me say this plainly but politely.",
    },
  },

  // ───────────────── temple_royal_formal ─────────────────
  {
    id: "thr_tr_01",
    level: "B1",
    topic: "temple_royal_formal",
    title_vi: "Ăn mặc và lời nói kín đáo khi vào chùa",
    title_en: "Dress and speak modestly at temples",
    note_vi:
      "Trong chùa (วัด), che vai và đầu gối, hạ giọng, và tránh đùa cợt. Lời nói nên nhẹ nhàng, tôn kính.",
    note_en:
      "At a temple (วัด), cover shoulders and knees, lower your voice, and avoid joking. Keep speech gentle and reverent.",
    safer_phrase: {
      thai: "ขอโทษครับ ถ่ายรูปตรงนี้ได้ไหมครับ",
      rtgs: "khaw-thot khrap, thaai-ruup trong-nii dai mai khrap",
      vi: "Xin lỗi ạ, chụp ảnh ở đây có được không ạ?",
      en: "Excuse me, is it okay to take photos here?",
    },
    tip_vi: "Luôn hỏi trước khi chụp ảnh tượng Phật hay nhà sư.",
    tip_en: "Always ask before photographing Buddha images or monks.",
  },
  {
    id: "thr_tr_02",
    level: "B2",
    topic: "temple_royal_formal",
    title_vi: "Giao tiếp với nhà sư — từ vựng riêng",
    title_en: "Speaking with monks — special vocabulary",
    note_vi:
      "Có hệ từ vựng riêng khi nói với/về nhà sư (ví dụ « ฉัน » nghĩa 'thọ trai' chứ không phải 'ăn'). Phụ nữ tránh chạm vào nhà sư; trao đồ phải qua trung gian.",
    note_en:
      "There's a special vocabulary set for monks (e.g. « ฉัน » means a monk's 'taking a meal', not ordinary 'eat'). Women avoid touching monks; pass items via an intermediary.",
    safer_phrase: {
      thai: "นมัสการครับ / กราบนมัสการเจ้าค่ะ",
      rtgs: "na-mat-sa-kaan khrap / kraap na-mat-sa-kaan jao-kha",
      vi: "Con kính chào sư ạ (nam / nữ).",
      en: "Respectful greeting to a monk (male / female speaker).",
    },
  },
  {
    id: "thr_tr_03",
    level: "B2",
    topic: "temple_royal_formal",
    title_vi: "Thận trọng tối đa khi nói về hoàng gia",
    title_en: "Utmost caution about the monarchy",
    note_vi:
      "Thái Lan có luật bảo vệ hoàng gia rất nghiêm. Tránh mọi bình luận đùa cợt hay tiêu cực về nhà vua/hoàng gia ở nơi công cộng hay trên mạng. Khi cần đề cập, dùng ngôn từ trang trọng, tôn kính.",
    note_en:
      "Thailand has strict laws protecting the monarchy. Avoid any joking or negative comment about the King/royal family in public or online. When you must refer to them, use formal, respectful language.",
    safer_phrase: {
      thai: "ขอใช้ถ้อยคำที่สุภาพและเหมาะสมนะครับ",
      rtgs: "khaw chai thoi-kham thii su-phaap lae mo-som na khrap",
      vi: "Xin dùng từ ngữ lịch sự và phù hợp ạ.",
      en: "Let me use respectful and appropriate wording.",
    },
    tip_vi: "Đây là lưu ý pháp lý/an toàn thực tế cho người học và du khách, không phải bình luận chính trị.",
    tip_en: "This is a practical legal/safety note for learners and travellers, not a political comment.",
  },
  {
    id: "thr_tr_04",
    level: "C1",
    topic: "temple_royal_formal",
    title_vi: "Ngôn ngữ nghi lễ trong sự kiện trang trọng",
    title_en: "Ceremonial language at formal events",
    note_vi:
      "Sự kiện trang trọng dùng nhiều từ Hán-Khmer hóa và công thức cố định. Khi không chắc, nghe và lặp lại theo công thức chuẩn thay vì tự ứng biến.",
    note_en:
      "Formal ceremonies use Sanskrit/Khmer-derived vocabulary and fixed formulas. When unsure, follow and echo the standard formula rather than improvising.",
    safer_phrase: {
      thai: "เรียนเชิญทุกท่านด้วยความเคารพครับ",
      rtgs: "rian-choen thuk thaan duai khwaam khao-rop khrap",
      vi: "Trân trọng kính mời quý vị ạ.",
      en: "We respectfully invite everyone.",
    },
  },
  {
    id: "thr_tr_05",
    level: "C2",
    topic: "temple_royal_formal",
    title_vi: "Chuyển sang văn phong viết trang trọng",
    title_en: "Shifting to formal written register",
    note_vi:
      "Trong văn bản chính thức, thay đại từ đời thường bằng dạng trang trọng và dùng từ nối học thuật. Tránh trợ từ cuối câu khẩu ngữ như นะ, สิ.",
    note_en:
      "In official documents, replace casual pronouns with formal forms and use academic connectives. Avoid colloquial final particles like นะ, สิ.",
    safer_phrase: {
      thai: "จึงเรียนมาเพื่อโปรดพิจารณา",
      rtgs: "jueng rian maa phuea proot phi-jaa-ra-naa",
      vi: "Kính trình để quý vị xem xét. (kết thư trang trọng)",
      en: "Submitted herewith for your kind consideration. (formal letter closing)",
    },
  },

  // ───────────────── customer_service ─────────────────
  {
    id: "thr_cs_01",
    level: "A2",
    topic: "customer_service",
    title_vi: "Gọi nhân viên lịch sự nơi quán ăn",
    title_en: "Politely calling staff at a restaurant",
    note_vi:
      "Gọi nhân viên bằng « น้อง » hoặc « พี่ » + « ครับ/ค่ะ » thay vì vẫy tay cộc lốc. Một nụ cười đi kèm giúp nhiều.",
    note_en:
      "Call staff with « น้อง » or « พี่ » + « ครับ/ค่ะ » rather than a curt wave. A smile goes a long way.",
    avoid: {
      thai: "เอาเมนู",
      rtgs: "ao mee-nuu",
      vi: "Lấy thực đơn. (cộc lốc)",
      en: "Get the menu. (curt)",
    },
    safer_phrase: {
      thai: "น้องครับ ขอเมนูหน่อยครับ",
      rtgs: "nong khrap, khaw mee-nuu noi khrap",
      vi: "Em ơi, cho anh xin thực đơn nhé.",
      en: "Excuse me, may I have the menu?",
    },
  },
  {
    id: "thr_cs_02",
    level: "B1",
    topic: "customer_service",
    title_vi: "Phàn nàn nhẹ nhàng, không gây mất mặt",
    title_en: "Complaining gently, without causing loss of face",
    note_vi:
      "Nêu vấn đề kèm « ขอโทษนะครับ » và giọng nhẹ. Cách tiếp cận giữ thể diện thường được giúp đỡ nhiệt tình hơn là phàn nàn gay gắt.",
    note_en:
      "Raise the issue with « ขอโทษนะครับ » and a soft tone. A face-saving approach gets warmer help than a harsh complaint.",
    avoid: {
      thai: "อันนี้ผิด ทำใหม่",
      rtgs: "an-nii phit, tham mai",
      vi: "Cái này sai, làm lại. (gắt)",
      en: "This is wrong, redo it. (harsh)",
    },
    safer_phrase: {
      thai: "ขอโทษนะครับ ตรงนี้อาจจะมีปัญหานิดนึง รบกวนช่วยดูให้หน่อยได้ไหมครับ",
      rtgs: "khaw-thot na khrap, trong-nii aat-ja mii pan-haa nit-nueng, rop-kuan chuai duu hai noi dai mai khrap",
      vi: "Xin lỗi ạ, chỗ này có lẽ có chút vấn đề, phiền xem giúp được không ạ?",
      en: "Sorry, there may be a small issue here — could you take a look, please?",
    },
  },
  {
    id: "thr_cs_03",
    level: "B2",
    topic: "customer_service",
    title_vi: "Mặc cả lịch sự ở chợ",
    title_en: "Polite bargaining at markets",
    note_vi:
      "Mặc cả là bình thường ở chợ nhưng nên giữ giọng vui vẻ, không ép. Một câu hỏi nhẹ nhàng dễ được giảm giá hơn là gây áp lực.",
    note_en:
      "Bargaining is normal at markets, but keep it cheerful, not pushy. A gentle ask earns a discount better than pressure.",
    safer_phrase: {
      thai: "ลดหน่อยได้ไหมครับ",
      rtgs: "lot noi dai mai khrap",
      vi: "Bớt chút được không ạ?",
      en: "Could you lower it a little?",
    },
  },
  {
    id: "thr_cs_04",
    level: "C1",
    topic: "customer_service",
    title_vi: "Yêu cầu hoàn/đổi mà vẫn giữ thiện chí",
    title_en: "Asking for a refund/exchange while staying cordial",
    note_vi:
      "Trình bày vấn đề một cách khách quan, đề nghị giải pháp, và cảm ơn trước. Giữ quan hệ tốt thường mở ra linh hoạt hơn.",
    note_en:
      "State the issue objectively, propose a solution, and thank them in advance. Preserving goodwill usually unlocks more flexibility.",
    safer_phrase: {
      thai: "ไม่ทราบว่าพอจะเปลี่ยนชิ้นใหม่ให้ได้ไหมครับ ขอบคุณล่วงหน้าครับ",
      rtgs: "mai saap waa phaw ja plian chin mai hai dai mai khrap, khop-khun luang-naa khrap",
      vi: "Không biết có thể đổi cái mới giúp tôi được không ạ? Cảm ơn trước ạ.",
      en: "I wonder if you could exchange it for a new one — thank you in advance.",
    },
  },

  // ───────────────── workplace_respect ─────────────────
  {
    id: "thr_wr_01",
    level: "B1",
    topic: "workplace_respect",
    title_vi: "Chào cấp trên đúng mực mỗi sáng",
    title_en: "Greet seniors properly each morning",
    note_vi:
      "Một lời chào lễ phép với sếp/đồng nghiệp lớn tuổi mỗi ngày củng cố quan hệ. Kèm chức danh nếu có.",
    note_en:
      "A respectful daily greeting to bosses/senior colleagues builds rapport. Add a title where relevant.",
    avoid: {
      thai: "หวัดดี",
      rtgs: "wat-dii",
      vi: "Chào. (rút gọn suồng sã, không hợp với sếp)",
      en: "Hi. (clipped/casual, not for a boss)",
    },
    safer_phrase: {
      thai: "สวัสดีตอนเช้าครับ พี่",
      rtgs: "sa-wat-dii tawn-chao khrap, phii",
      vi: "Chào buổi sáng anh/chị ạ.",
      en: "Good morning (senior).",
    },
  },
  {
    id: "thr_wr_02",
    level: "B2",
    topic: "workplace_respect",
    title_vi: "Báo cáo tiến độ chủ động, lịch sự",
    title_en: "Report progress proactively and politely",
    note_vi:
      "Chủ động cập nhật với cấp trên bằng giọng khiêm tốn được đánh giá cao. Tránh chỉ báo khi đã trễ.",
    note_en:
      "Proactively updating a superior in a humble tone is valued. Don't only report once it's already late.",
    safer_phrase: {
      thai: "ขออัปเดตความคืบหน้านิดนึงนะครับ",
      rtgs: "khaw ap-det khwaam khuep-naa nit-nueng na khrap",
      vi: "Cho tôi cập nhật tiến độ một chút ạ.",
      en: "Let me give a quick progress update.",
    },
  },
  {
    id: "thr_wr_03",
    level: "B2",
    topic: "workplace_respect",
    title_vi: "Bất đồng với đồng nghiệp mà không đối đầu",
    title_en: "Disagree with a colleague without confrontation",
    note_vi:
      "Công nhận ý kiến của họ trước, rồi đề xuất góc nhìn khác. Tránh phủ định thẳng giữa nhóm.",
    note_en:
      "Acknowledge their point first, then offer another angle. Avoid flat contradiction in front of the group.",
    avoid: {
      thai: "ไม่ใช่ ผิดแล้ว",
      rtgs: "mai chai, phit laeo",
      vi: "Không phải, sai rồi. (đối đầu)",
      en: "No, that's wrong. (confrontational)",
    },
    safer_phrase: {
      thai: "เข้าใจที่พี่พูดนะครับ แต่อีกมุมหนึ่งอาจจะลองแบบนี้ดูได้ไหมครับ",
      rtgs: "khao-jai thii phii phuut na khrap, tae iik mum nueng aat-ja long baep-nii duu dai mai khrap",
      vi: "Em hiểu ý anh/chị ạ, nhưng ở một góc khác mình thử cách này được không ạ?",
      en: "I see your point — but from another angle, could we try it this way?",
    },
  },
  {
    id: "thr_wr_04",
    level: "C1",
    topic: "workplace_respect",
    title_vi: "Xin nghỉ phép một cách nể nang",
    title_en: "Requesting leave considerately",
    note_vi:
      "Xin phép sớm, thể hiện sự « เกรงใจ », và đề xuất phương án bù việc. Cách này giữ quan hệ và dễ được duyệt.",
    note_en:
      "Ask early, show « เกรงใจ », and propose how the work will be covered. This preserves rapport and eases approval.",
    safer_phrase: {
      thai: "รบกวนขอลาวันศุกร์นะครับ งานที่ค้างผมจัดการให้เรียบร้อยก่อนครับ",
      rtgs: "rop-kuan khaw laa wan suk na khrap, ngaan thii khaang phom jat-kaan hai riap-roi kawn khrap",
      vi: "Phiền cho tôi xin nghỉ thứ Sáu ạ; việc còn dang dở tôi sẽ lo xong trước.",
      en: "May I take Friday off? I'll wrap up any pending work beforehand.",
    },
  },
  {
    id: "thr_wr_05",
    level: "C2",
    topic: "workplace_respect",
    title_vi: "Phản hồi cấp dưới: giữ thể diện nơi đông người",
    title_en: "Giving feedback to juniors: protect face in public",
    note_vi:
      "Khen công khai, góp ý riêng. Phê bình cấp dưới trước mặt người khác làm họ mất mặt và hại tinh thần đội.",
    note_en:
      "Praise in public, correct in private. Criticising a junior in front of others causes loss of face and hurts team morale.",
    safer_phrase: {
      thai: "เดี๋ยวขอคุยด้วยส่วนตัวสักครู่นะครับ",
      rtgs: "diao khaw khui duai suan-tua sak-khruu na khrap",
      vi: "Lát nữa cho tôi trao đổi riêng một chút nhé ạ.",
      en: "Let me have a brief word with you in private.",
    },
  },
];

// ── Quick lookup by topic ───────────────────────────────────────────────────
export function notesByTopic(topic: RegisterTopic): RegisterCultureNote[] {
  return notes.filter((n) => n.topic === topic);
}

// Banner the UI should render alongside these notes. Kept as data so the
// "general patterns, not native-certified" caveat travels with the content.
export const REGISTER_CULTURE_DISCLAIMER = {
  vi: "Ghi chú hỗ trợ học tập về văn phong và văn hóa — mô tả các khuôn mẫu giao tiếp chung, KHÔNG phải định kiến về con người. Chưa được người bản xứ thẩm định; phần thẩm định bản xứ được hoãn lại.",
  en: "Study-support register & culture notes — describing general communication patterns, NOT stereotypes about people. Not native-certified; native review is deferred.",
} as const;

export default notes;
