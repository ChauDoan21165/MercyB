// src/languages/thai/dialogues.ts
//
// Compact Thai dialogues / roleplays for Vietnamese- and English-speaking
// learners. Each entry is short and app-ready: a few lines, a roleplay prompt
// in both VI and EN, and one example of an expected learner response.
//
// Every line carries Thai script + a readable romanization (tone diacritics:
// à low, á high, â falling, ǎ rising, a mid). Romanization is a learning aid,
// not an authoritative/native-reviewed transcription — native review is
// deferred. There are NO CJK / Hangul / kana / Cyrillic assumptions here; Thai
// has its own script (U+0E00–U+0E7F).

import type { ThaiCefrLevel, ThaiDialogueLine } from "./lessons";

export type ThaiDialogueTopic =
  | "greetings"
  | "food"
  | "taxi"
  | "hotel"
  | "pharmacy"
  | "police_lost_item"
  | "work_first_day"
  | "shopping"
  | "immigration"
  | "phone_call"
  | "workplace_disagreement"
  | "formal_meeting";

/** One example learner response to the roleplay prompt. */
export type ThaiExpectedResponse = {
  thai: string;
  romanization: string;
  en: string;
  vi: string;
};

export type ThaiDialogue = {
  cell_id?: string;
  id: number;
  level: ThaiCefrLevel;
  topic: ThaiDialogueTopic;
  title_vi: string;
  title_en: string;
  lines: ThaiDialogueLine[];
  /** Roleplay prompt for Vietnamese-speaker learners. */
  roleplay_prompt_vi: string;
  /** Roleplay prompt for English-speaker learners.
   *  Independent sibling — NOT a translation of roleplay_prompt_vi. */
  roleplay_prompt_en: string;
  /** One model answer the learner could give. */
  expected_response: ThaiExpectedResponse;
};

export const thaiDialogues: ThaiDialogue[] = [
  // ── Greetings (A1–A2) ─────────────────────────────────────────────────
  {
    id: 1,
    level: "A1",
    topic: "greetings",
    title_vi: "Làm quen lần đầu",
    title_en: "Meeting for the first time",
    lines: [
      {
        speaker: "Somchai",
        thai: "สวัสดีครับ ผมชื่อสมชายครับ",
        romanization: "sàwàtdii khráp, phǒm chʉ̂ʉ sǒmchaai khráp",
        en: "Hello, my name is Somchai.",
        vi: "Xin chào, tôi tên Somchai.",
      },
      {
        speaker: "Mai",
        thai: "สวัสดีค่ะ ยินดีที่ได้รู้จักค่ะ",
        romanization: "sàwàtdii khâ, yindii thîi dâai rúujàk khâ",
        en: "Hello, nice to meet you.",
        vi: "Xin chào, rất vui được gặp bạn.",
      },
    ],
    roleplay_prompt_vi: "Chào lại và giới thiệu tên của bạn.",
    roleplay_prompt_en: "Greet back and introduce your own name.",
    expected_response: {
      thai: "สวัสดีครับ ผมชื่อนัทครับ ยินดีที่ได้รู้จัก",
      romanization: "sàwàtdii khráp, phǒm chʉ̂ʉ nát khráp, yindii thîi dâai rúujàk",
      en: "Hello, my name is Nat, nice to meet you.",
      vi: "Xin chào, tôi tên Nat, rất vui được gặp.",
    },
  },
  {
    id: 2,
    level: "A1",
    topic: "greetings",
    title_vi: "Hỏi thăm sức khỏe",
    title_en: "Asking how someone is",
    lines: [
      {
        speaker: "Mai",
        thai: "สบายดีไหมคะ",
        romanization: "sàbaai dii mǎi khá",
        en: "How are you?",
        vi: "Bạn khỏe không?",
      },
      {
        speaker: "Nat",
        thai: "สบายดีครับ แล้วคุณล่ะครับ",
        romanization: "sàbaai dii khráp, lɛ́ɛw khun lâ khráp",
        en: "I'm fine, and you?",
        vi: "Tôi khỏe, còn bạn thì sao?",
      },
    ],
    roleplay_prompt_vi: "Trả lời rằng bạn khỏe và hỏi lại đối phương.",
    roleplay_prompt_en: "Say you are fine and ask the question back.",
    expected_response: {
      thai: "สบายดีค่ะ ขอบคุณค่ะ",
      romanization: "sàbaai dii khâ, khɔ̀ɔp khun khâ",
      en: "I'm fine, thank you.",
      vi: "Tôi khỏe, cảm ơn.",
    },
  },
  {
    id: 3,
    level: "A2",
    topic: "greetings",
    title_vi: "Chào tạm biệt",
    title_en: "Saying goodbye",
    lines: [
      {
        speaker: "Nat",
        thai: "ผมต้องไปแล้วครับ แล้วเจอกันใหม่นะครับ",
        romanization: "phǒm tɔ̂ng pai lɛ́ɛw khráp, lɛ́ɛw jəə kan mài ná khráp",
        en: "I have to go now. See you again.",
        vi: "Tôi phải đi rồi. Hẹn gặp lại nhé.",
      },
      {
        speaker: "Mai",
        thai: "ได้ค่ะ เดินทางปลอดภัยนะคะ",
        romanization: "dâai khâ, dəən thaang plɔ̀ɔt phai ná khá",
        en: "Sure. Travel safely.",
        vi: "Được. Đi đường bình an nhé.",
      },
    ],
    roleplay_prompt_vi: "Tạm biệt một người bạn và hẹn gặp lại tuần sau.",
    roleplay_prompt_en: "Say goodbye to a friend and arrange to meet next week.",
    expected_response: {
      thai: "แล้วเจอกันสัปดาห์หน้านะครับ",
      romanization: "lɛ́ɛw jəə kan sàpdaa nâa ná khráp",
      en: "See you next week.",
      vi: "Hẹn gặp lại tuần sau nhé.",
    },
  },
  {
    id: 4,
    level: "A2",
    topic: "greetings",
    title_vi: "Hỏi tên và quốc tịch",
    title_en: "Asking name and nationality",
    lines: [
      {
        speaker: "Somchai",
        thai: "คุณมาจากไหนครับ",
        romanization: "khun maa jàak nǎi khráp",
        en: "Where are you from?",
        vi: "Bạn đến từ đâu?",
      },
      {
        speaker: "Mai",
        thai: "ฉันมาจากเวียดนามค่ะ",
        romanization: "chǎn maa jàak wîatnaam khâ",
        en: "I'm from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
      },
    ],
    roleplay_prompt_vi: "Nói bạn đến từ Việt Nam và hỏi lại quốc tịch của họ.",
    roleplay_prompt_en: "Say you are from Vietnam and ask their nationality back.",
    expected_response: {
      thai: "ผมมาจากเวียดนามครับ แล้วคุณมาจากไหนครับ",
      romanization: "phǒm maa jàak wîatnaam khráp, lɛ́ɛw khun maa jàak nǎi khráp",
      en: "I'm from Vietnam. And where are you from?",
      vi: "Tôi đến từ Việt Nam. Còn bạn đến từ đâu?",
    },
  },

  // ── Food (A1–A2) ──────────────────────────────────────────────────────
  {
    id: 5,
    level: "A1",
    topic: "food",
    title_vi: "Gọi món ở quán",
    title_en: "Ordering at a shop",
    lines: [
      {
        speaker: "Server",
        thai: "รับอะไรดีคะ",
        romanization: "ráp àrai dii khá",
        en: "What would you like?",
        vi: "Bạn dùng gì ạ?",
      },
      {
        speaker: "Customer",
        thai: "ขอผัดไทยหนึ่งจานครับ",
        romanization: "khɔ̌ɔ phàt thai nʉ̀ng jaan khráp",
        en: "One pad thai, please.",
        vi: "Cho tôi một đĩa pad thai.",
      },
    ],
    roleplay_prompt_vi: "Gọi một đĩa cơm chiên và một chai nước.",
    roleplay_prompt_en: "Order one fried rice and a bottle of water.",
    expected_response: {
      thai: "ขอข้าวผัดหนึ่งจานกับน้ำหนึ่งขวดครับ",
      romanization: "khɔ̌ɔ khâao phàt nʉ̀ng jaan kàp náam nʉ̀ng khùat khráp",
      en: "One fried rice and one bottle of water, please.",
      vi: "Cho tôi một đĩa cơm chiên và một chai nước.",
    },
  },
  {
    id: 6,
    level: "A1",
    topic: "food",
    title_vi: "Không cay",
    title_en: "Not spicy",
    lines: [
      {
        speaker: "Customer",
        thai: "ขอไม่เผ็ดนะครับ",
        romanization: "khɔ̌ɔ mâi phèt ná khráp",
        en: "Not spicy, please.",
        vi: "Cho tôi không cay nhé.",
      },
      {
        speaker: "Server",
        thai: "ได้ค่ะ ไม่เผ็ดนะคะ",
        romanization: "dâai khâ, mâi phèt ná khá",
        en: "Sure, not spicy.",
        vi: "Được, không cay nhé.",
      },
    ],
    roleplay_prompt_vi: "Yêu cầu món ăn ít cay và không bỏ đường.",
    roleplay_prompt_en: "Ask for the dish a little spicy and with no sugar.",
    expected_response: {
      thai: "ขอเผ็ดน้อยกับไม่ใส่น้ำตาลครับ",
      romanization: "khɔ̌ɔ phèt nɔ́ɔi kàp mâi sài náamtaan khráp",
      en: "A little spicy and no sugar, please.",
      vi: "Cho tôi cay ít và không bỏ đường.",
    },
  },
  {
    id: 7,
    level: "A2",
    topic: "food",
    title_vi: "Tính tiền",
    title_en: "Asking for the bill",
    lines: [
      {
        speaker: "Customer",
        thai: "เก็บเงินด้วยครับ",
        romanization: "kèp ngən dûai khráp",
        en: "Check, please.",
        vi: "Tính tiền giúp tôi.",
      },
      {
        speaker: "Server",
        thai: "ทั้งหมดสองร้อยบาทค่ะ",
        romanization: "tháng mòt sɔ̌ɔng rɔ́ɔi bàat khâ",
        en: "That's two hundred baht in total.",
        vi: "Tổng cộng hai trăm baht.",
      },
    ],
    roleplay_prompt_vi: "Xin tính tiền và hỏi có nhận thẻ không.",
    roleplay_prompt_en: "Ask for the bill and whether they take card.",
    expected_response: {
      thai: "เก็บเงินด้วยครับ รับบัตรไหมครับ",
      romanization: "kèp ngən dûai khráp, ráp bàt mǎi khráp",
      en: "Check please. Do you take card?",
      vi: "Tính tiền giúp tôi. Có nhận thẻ không?",
    },
  },
  {
    id: 8,
    level: "A2",
    topic: "food",
    title_vi: "Hỏi món chay",
    title_en: "Asking for vegetarian food",
    lines: [
      {
        speaker: "Customer",
        thai: "มีอาหารเจไหมครับ",
        romanization: "mii aahǎan jee mǎi khráp",
        en: "Do you have vegetarian food?",
        vi: "Ở đây có đồ chay không?",
      },
      {
        speaker: "Server",
        thai: "มีค่ะ มีผัดผักกับเต้าหู้ค่ะ",
        romanization: "mii khâ, mii phàt phàk kàp tâohûu khâ",
        en: "Yes, we have stir-fried vegetables and tofu.",
        vi: "Có ạ, có rau xào và đậu hũ.",
      },
    ],
    roleplay_prompt_vi: "Hỏi có món chay không và gọi một món rau xào.",
    roleplay_prompt_en: "Ask if there is vegetarian food and order a vegetable dish.",
    expected_response: {
      thai: "ขอผัดผักหนึ่งจาน ไม่ใส่เนื้อนะครับ",
      romanization: "khɔ̌ɔ phàt phàk nʉ̀ng jaan, mâi sài nʉ́a ná khráp",
      en: "One stir-fried vegetables, no meat, please.",
      vi: "Cho tôi một đĩa rau xào, không bỏ thịt nhé.",
    },
  },

  // ── Taxi (A2) ─────────────────────────────────────────────────────────
  {
    id: 9,
    level: "A2",
    topic: "taxi",
    title_vi: "Đi taxi đến khách sạn",
    title_en: "Taking a taxi to a hotel",
    lines: [
      {
        speaker: "Passenger",
        thai: "ไปโรงแรมนี้ครับ ใช้มิเตอร์นะครับ",
        romanization: "pai roong rɛɛm níi khráp, chái mítəə ná khráp",
        en: "To this hotel, please. Use the meter.",
        vi: "Đến khách sạn này. Dùng đồng hồ nhé.",
      },
      {
        speaker: "Driver",
        thai: "ได้ครับ คาดเข็มขัดด้วยนะครับ",
        romanization: "dâai khráp, khâat khěm khàt dûai ná khráp",
        en: "Sure. Please fasten your seatbelt.",
        vi: "Được. Thắt dây an toàn nhé.",
      },
    ],
    roleplay_prompt_vi: "Bảo tài xế đi đến sân bay và yêu cầu bật đồng hồ.",
    roleplay_prompt_en: "Tell the driver to go to the airport and ask for the meter.",
    expected_response: {
      thai: "ไปสนามบินครับ ใช้มิเตอร์นะครับ",
      romanization: "pai sanǎam bin khráp, chái mítəə ná khráp",
      en: "To the airport, please. Use the meter.",
      vi: "Đến sân bay. Dùng đồng hồ nhé.",
    },
  },
  {
    id: 10,
    level: "A2",
    topic: "taxi",
    title_vi: "Yêu cầu dừng xe",
    title_en: "Asking to stop",
    lines: [
      {
        speaker: "Passenger",
        thai: "จอดตรงนี้ได้ไหมครับ",
        romanization: "jɔ̀ɔt trong níi dâai mǎi khráp",
        en: "Can you stop here?",
        vi: "Dừng ở đây được không?",
      },
      {
        speaker: "Driver",
        thai: "ได้ครับ ทั้งหมดเก้าสิบบาทครับ",
        romanization: "dâai khráp, tháng mòt kâao sìp bàat khráp",
        en: "Sure. That's ninety baht.",
        vi: "Được. Tổng cộng chín mươi baht.",
      },
    ],
    roleplay_prompt_vi: "Nhờ tài xế dừng trước cửa hàng tiện lợi và hỏi giá.",
    roleplay_prompt_en: "Ask the driver to stop in front of the convenience store and ask the price.",
    expected_response: {
      thai: "จอดหน้าร้านสะดวกซื้อได้ไหมครับ เท่าไหร่ครับ",
      romanization: "jɔ̀ɔt nâa ráan sàdùak sʉ́ʉ dâai mǎi khráp, thâorài khráp",
      en: "Can you stop in front of the convenience store? How much?",
      vi: "Dừng trước cửa hàng tiện lợi được không? Bao nhiêu tiền?",
    },
  },
  {
    id: 11,
    level: "B1",
    topic: "taxi",
    title_vi: "Kẹt xe và đổi đường",
    title_en: "Traffic and changing route",
    lines: [
      {
        speaker: "Driver",
        thai: "ข้างหน้ารถติดมากครับ ขอเลี้ยวทางอื่นนะครับ",
        romanization: "khâang nâa rót tìt mâak khráp, khɔ̌ɔ líaw thaang ʉ̀ʉn ná khráp",
        en: "There's heavy traffic ahead. I'll take another route.",
        vi: "Phía trước kẹt xe lắm. Tôi xin đi đường khác nhé.",
      },
      {
        speaker: "Passenger",
        thai: "ได้ครับ แต่ขอเร็วหน่อยนะครับ ผมรีบ",
        romanization: "dâai khráp, tɛ̀ɛ khɔ̌ɔ rew nɔ̀i ná khráp, phǒm rîip",
        en: "Okay, but please hurry a bit, I'm in a rush.",
        vi: "Được, nhưng đi nhanh chút nhé, tôi đang vội.",
      },
    ],
    roleplay_prompt_vi: "Đồng ý đổi đường nhưng nói bạn cần đến trước 9 giờ.",
    roleplay_prompt_en: "Agree to change route but say you must arrive before 9.",
    expected_response: {
      thai: "ได้ครับ แต่ผมต้องถึงก่อนเก้าโมงนะครับ",
      romanization: "dâai khráp, tɛ̀ɛ phǒm tɔ̂ng thʉ̌ng kɔ̀ɔn kâao moong ná khráp",
      en: "Okay, but I must arrive before nine.",
      vi: "Được, nhưng tôi phải đến trước 9 giờ nhé.",
    },
  },

  // ── Hotel (A2–B1) ─────────────────────────────────────────────────────
  {
    id: 12,
    level: "A2",
    topic: "hotel",
    title_vi: "Nhận phòng",
    title_en: "Checking in",
    lines: [
      {
        speaker: "Guest",
        thai: "ผมจองห้องไว้ชื่อนัทครับ",
        romanization: "phǒm jɔɔng hɔ̂ng wái chʉ̂ʉ nát khráp",
        en: "I have a reservation under the name Nat.",
        vi: "Tôi đã đặt phòng tên Nat.",
      },
      {
        speaker: "Receptionist",
        thai: "ได้ค่ะ ขอหนังสือเดินทางด้วยค่ะ",
        romanization: "dâai khâ, khɔ̌ɔ nǎngsʉ̌ʉ dəən thaang dûai khâ",
        en: "Sure, may I have your passport?",
        vi: "Vâng, cho tôi xem hộ chiếu ạ.",
      },
    ],
    roleplay_prompt_vi: "Nói bạn đã đặt phòng hai đêm và hỏi giờ ăn sáng.",
    roleplay_prompt_en: "Say you booked two nights and ask the breakfast time.",
    expected_response: {
      thai: "ผมจองไว้สองคืนครับ อาหารเช้ากี่โมงครับ",
      romanization: "phǒm jɔɔng wái sɔ̌ɔng khʉʉn khráp, aahǎan cháao kìi moong khráp",
      en: "I booked two nights. What time is breakfast?",
      vi: "Tôi đặt hai đêm. Mấy giờ ăn sáng?",
    },
  },
  {
    id: 13,
    level: "B1",
    topic: "hotel",
    title_vi: "Báo hỏng máy lạnh",
    title_en: "Reporting a broken air-con",
    lines: [
      {
        speaker: "Guest",
        thai: "แอร์ในห้องเสียครับ ช่วยส่งช่างมาดูหน่อยได้ไหมครับ",
        romanization: "ɛɛ nai hɔ̂ng sǐa khráp, chûai sòng châang maa duu nɔ̀i dâai mǎi khráp",
        en: "The air-con in my room is broken. Could you send a technician?",
        vi: "Máy lạnh trong phòng bị hỏng. Có thể cho thợ lên xem giúp không?",
      },
      {
        speaker: "Receptionist",
        thai: "ขอโทษด้วยค่ะ เดี๋ยวส่งช่างขึ้นไปเลยค่ะ",
        romanization: "khɔ̌ɔ thôot dûai khâ, dǐaw sòng châang khʉ̂n pai ləəi khâ",
        en: "I'm sorry. I'll send a technician up right away.",
        vi: "Xin lỗi ạ. Tôi sẽ cho thợ lên ngay.",
      },
    ],
    roleplay_prompt_vi: "Báo rằng Wi-Fi không vào được và xin đổi phòng.",
    roleplay_prompt_en: "Report that the Wi-Fi doesn't work and ask to change rooms.",
    expected_response: {
      thai: "ไวไฟใช้ไม่ได้ครับ ขอเปลี่ยนห้องได้ไหมครับ",
      romanization: "waifai chái mâi dâai khráp, khɔ̌ɔ plìan hɔ̂ng dâai mǎi khráp",
      en: "The Wi-Fi doesn't work. May I change rooms?",
      vi: "Wi-Fi không dùng được. Tôi đổi phòng được không?",
    },
  },
  {
    id: 14,
    level: "B1",
    topic: "hotel",
    title_vi: "Trả phòng trễ",
    title_en: "Late check-out",
    lines: [
      {
        speaker: "Guest",
        thai: "ขอเช็คเอาท์สายได้ไหมครับ สักบ่ายสองโมง",
        romanization: "khɔ̌ɔ chék áo sǎai dâai mǎi khráp, sàk bàai sɔ̌ɔng moong",
        en: "Can I check out late, around 2 p.m.?",
        vi: "Tôi trả phòng trễ được không, khoảng 2 giờ chiều?",
      },
      {
        speaker: "Receptionist",
        thai: "ได้ค่ะ แต่มีค่าบริการเพิ่มเล็กน้อยค่ะ",
        romanization: "dâai khâ, tɛ̀ɛ mii khâa bɔɔrikaan phə̂əm lék nɔ́ɔi khâ",
        en: "Yes, but there's a small extra charge.",
        vi: "Được ạ, nhưng có phụ phí nhỏ.",
      },
    ],
    roleplay_prompt_vi: "Hỏi trả phòng trễ và hỏi phụ phí bao nhiêu.",
    roleplay_prompt_en: "Ask for a late check-out and how much the extra fee is.",
    expected_response: {
      thai: "ขอเช็คเอาท์บ่ายสองครับ ค่าบริการเท่าไหร่ครับ",
      romanization: "khɔ̌ɔ chék áo bàai sɔ̌ɔng khráp, khâa bɔɔrikaan thâorài khráp",
      en: "Late check-out at 2 p.m., please. How much is the fee?",
      vi: "Cho tôi trả phòng lúc 2 giờ chiều. Phụ phí bao nhiêu?",
    },
  },

  // ── Pharmacy (B1) ─────────────────────────────────────────────────────
  {
    id: 15,
    level: "B1",
    topic: "pharmacy",
    title_vi: "Mua thuốc cảm",
    title_en: "Buying cold medicine",
    lines: [
      {
        speaker: "Customer",
        thai: "ผมเป็นหวัด มีไข้นิดหน่อย มียาอะไรแนะนำไหมครับ",
        romanization: "phǒm pen wàt, mii khâi nít nɔ̀i, mii yaa àrai nɛ́nam mǎi khráp",
        en: "I have a cold and a slight fever. Can you recommend any medicine?",
        vi: "Tôi bị cảm, hơi sốt. Có thuốc nào nên dùng không?",
      },
      {
        speaker: "Pharmacist",
        thai: "ทานยานี้หลังอาหารวันละสามครั้งค่ะ",
        romanization: "thaan yaa níi lǎng aahǎan wan lá sǎam khráng khâ",
        en: "Take this medicine after meals, three times a day.",
        vi: "Uống thuốc này sau khi ăn, ngày ba lần.",
      },
    ],
    roleplay_prompt_vi: "Nói bạn bị đau đầu và hỏi thuốc uống mấy lần một ngày.",
    roleplay_prompt_en: "Say you have a headache and ask how many times a day to take it.",
    expected_response: {
      thai: "ผมปวดหัวครับ ต้องทานวันละกี่ครั้งครับ",
      romanization: "phǒm pùat hǔa khráp, tɔ̂ng thaan wan lá kìi khráng khráp",
      en: "I have a headache. How many times a day should I take it?",
      vi: "Tôi đau đầu. Phải uống ngày mấy lần?",
    },
  },
  {
    id: 16,
    level: "B1",
    topic: "pharmacy",
    title_vi: "Dị ứng thuốc",
    title_en: "Medicine allergy",
    lines: [
      {
        speaker: "Customer",
        thai: "ผมแพ้ยาเพนิซิลลินครับ มียาอื่นไหมครับ",
        romanization: "phǒm phɛ́ɛ yaa phenísinlin khráp, mii yaa ʉ̀ʉn mǎi khráp",
        en: "I'm allergic to penicillin. Is there another medicine?",
        vi: "Tôi dị ứng penicillin. Có thuốc khác không?",
      },
      {
        speaker: "Pharmacist",
        thai: "มีค่ะ ตัวนี้ปลอดภัยสำหรับคุณค่ะ",
        romanization: "mii khâ, tua níi plɔ̀ɔt phai sǎmràp khun khâ",
        en: "Yes, this one is safe for you.",
        vi: "Có ạ, loại này an toàn cho bạn.",
      },
    ],
    roleplay_prompt_vi: "Nói bạn dị ứng aspirin và hỏi có loại thay thế không.",
    roleplay_prompt_en: "Say you are allergic to aspirin and ask for an alternative.",
    expected_response: {
      thai: "ผมแพ้แอสไพรินครับ มีตัวอื่นแทนได้ไหมครับ",
      romanization: "phǒm phɛ́ɛ ɛ̀ɛtphairin khráp, mii tua ʉ̀ʉn thɛɛn dâai mǎi khráp",
      en: "I'm allergic to aspirin. Is there a substitute?",
      vi: "Tôi dị ứng aspirin. Có loại nào thay được không?",
    },
  },

  // ── Police / lost item (B2) ───────────────────────────────────────────
  {
    id: 17,
    level: "B2",
    topic: "police_lost_item",
    title_vi: "Báo mất ví",
    title_en: "Reporting a lost wallet",
    lines: [
      {
        speaker: "Tourist",
        thai: "ผมทำกระเป๋าสตางค์หายครับ ข้างในมีบัตรกับเงินสด",
        romanization: "phǒm tham krapǎo sàtaang hǎai khráp, khâang nai mii bàt kàp ngən sòt",
        en: "I lost my wallet. It had cards and cash inside.",
        vi: "Tôi làm mất ví. Bên trong có thẻ và tiền mặt.",
      },
      {
        speaker: "Officer",
        thai: "หายที่ไหนเมื่อไหร่ครับ ผมจะลงบันทึกประจำวันให้",
        romanization: "hǎai thîi nǎi mʉ̂arài khráp, phǒm jà long banthʉ́k prajam wan hâi",
        en: "Where and when did you lose it? I'll file a report.",
        vi: "Mất ở đâu, khi nào? Tôi sẽ lập biên bản cho bạn.",
      },
    ],
    roleplay_prompt_vi: "Báo bạn mất hộ chiếu ở chợ đêm chiều nay và xin biên bản.",
    roleplay_prompt_en: "Report your passport lost at the night market this afternoon and ask for a report.",
    expected_response: {
      thai: "ผมทำหนังสือเดินทางหายที่ตลาดกลางคืนเมื่อบ่ายนี้ ขอใบบันทึกด้วยครับ",
      romanization: "phǒm tham nǎngsʉ̌ʉ dəən thaang hǎai thîi talàat klaang khʉʉn mʉ̂a bàai níi, khɔ̌ɔ bai banthʉ́k dûai khráp",
      en: "I lost my passport at the night market this afternoon. I'd like a report, please.",
      vi: "Tôi mất hộ chiếu ở chợ đêm chiều nay. Cho tôi xin biên bản.",
    },
  },
  {
    id: 18,
    level: "B2",
    topic: "police_lost_item",
    title_vi: "Quên đồ trên taxi",
    title_en: "Leaving something in a taxi",
    lines: [
      {
        speaker: "Tourist",
        thai: "ผมลืมกระเป๋าไว้บนแท็กซี่ครับ จำทะเบียนไม่ได้",
        romanization: "phǒm lʉʉm krapǎo wái bon thɛ́ksîi khráp, jam thábian mâi dâai",
        en: "I left my bag in a taxi. I can't remember the plate number.",
        vi: "Tôi để quên túi trên taxi. Không nhớ biển số.",
      },
      {
        speaker: "Officer",
        thai: "ในกระเป๋ามีอะไรบ้างครับ ช่วยอธิบายลักษณะหน่อย",
        romanization: "nai krapǎo mii àrai bâang khráp, chûai àthíbaai láksànà nɔ̀i",
        en: "What's in the bag? Please describe it.",
        vi: "Trong túi có gì? Mô tả giúp tôi đặc điểm.",
      },
    ],
    roleplay_prompt_vi: "Mô tả chiếc túi màu đen có laptop và sạc bên trong.",
    roleplay_prompt_en: "Describe a black bag with a laptop and charger inside.",
    expected_response: {
      thai: "เป็นกระเป๋าสีดำ ข้างในมีโน้ตบุ๊กกับที่ชาร์จครับ",
      romanization: "pen krapǎo sǐi dam, khâang nai mii nóotbúk kàp thîi cháat khráp",
      en: "It's a black bag with a laptop and a charger inside.",
      vi: "Đó là túi màu đen, bên trong có laptop và sạc.",
    },
  },

  // ── Work first day (B2) ───────────────────────────────────────────────
  {
    id: 19,
    level: "B2",
    topic: "work_first_day",
    title_vi: "Tự giới thiệu ngày đầu",
    title_en: "Introducing yourself on day one",
    lines: [
      {
        speaker: "New hire",
        thai: "สวัสดีครับ ผมเป็นพนักงานใหม่ เริ่มงานวันนี้ครับ",
        romanization: "sàwàtdii khráp, phǒm pen phanákngaan mài, rə̂əm ngaan wan níi khráp",
        en: "Hello, I'm a new employee. I start today.",
        vi: "Xin chào, tôi là nhân viên mới, hôm nay bắt đầu làm việc.",
      },
      {
        speaker: "Colleague",
        thai: "ยินดีต้อนรับค่ะ เดี๋ยวพาไปแนะนำทีมนะคะ",
        romanization: "yindii tɔ̂ɔnráp khâ, dǐaw phaa pai nɛ́nam thiim ná khá",
        en: "Welcome! I'll take you to meet the team.",
        vi: "Chào mừng! Tôi sẽ dẫn bạn đi gặp nhóm.",
      },
    ],
    roleplay_prompt_vi: "Giới thiệu bạn làm ở bộ phận marketing và cảm ơn đồng nghiệp.",
    roleplay_prompt_en: "Say you work in marketing and thank your colleague.",
    expected_response: {
      thai: "ผมอยู่แผนกการตลาดครับ ขอบคุณที่ช่วยดูแลนะครับ",
      romanization: "phǒm yùu phanɛ̀ɛk kaantàlàat khráp, khɔ̀ɔp khun thîi chûai duulɛɛ ná khráp",
      en: "I'm in the marketing department. Thank you for helping me settle in.",
      vi: "Tôi ở bộ phận marketing. Cảm ơn đã giúp đỡ tôi.",
    },
  },
  {
    id: 20,
    level: "B2",
    topic: "work_first_day",
    title_vi: "Hỏi về quy trình làm việc",
    title_en: "Asking about work procedures",
    lines: [
      {
        speaker: "New hire",
        thai: "ขอโทษนะครับ ผมต้องลงเวลาเข้างานยังไงครับ",
        romanization: "khɔ̌ɔ thôot ná khráp, phǒm tɔ̂ng long weelaa khâo ngaan yang ngai khráp",
        en: "Excuse me, how do I clock in for work?",
        vi: "Xin lỗi, tôi chấm công vào làm thế nào?",
      },
      {
        speaker: "Colleague",
        thai: "ใช้บัตรพนักงานแตะที่เครื่องตรงประตูค่ะ",
        romanization: "chái bàt phanákngaan tɛ̀ thîi khrʉ̂ang trong pratuu khâ",
        en: "Tap your employee card on the machine by the door.",
        vi: "Quẹt thẻ nhân viên vào máy ở cửa.",
      },
    ],
    roleplay_prompt_vi: "Hỏi giờ nghỉ trưa và mật khẩu Wi-Fi văn phòng.",
    roleplay_prompt_en: "Ask about the lunch break time and the office Wi-Fi password.",
    expected_response: {
      thai: "พักเที่ยงกี่โมงครับ แล้วรหัสไวไฟอะไรครับ",
      romanization: "phák thîang kìi moong khráp, lɛ́ɛw rahàt waifai àrai khráp",
      en: "What time is the lunch break, and what's the Wi-Fi password?",
      vi: "Mấy giờ nghỉ trưa, và mật khẩu Wi-Fi là gì?",
    },
  },

  // ── Shopping (A2–B1) ──────────────────────────────────────────────────
  {
    id: 21,
    level: "A2",
    topic: "shopping",
    title_vi: "Hỏi giá",
    title_en: "Asking the price",
    lines: [
      {
        speaker: "Customer",
        thai: "อันนี้เท่าไหร่ครับ",
        romanization: "an níi thâorài khráp",
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền?",
      },
      {
        speaker: "Vendor",
        thai: "ร้อยห้าสิบบาทค่ะ",
        romanization: "rɔ́ɔi hâa sìp bàat khâ",
        en: "One hundred fifty baht.",
        vi: "Một trăm năm mươi baht.",
      },
    ],
    roleplay_prompt_vi: "Hỏi giá chiếc áo và xin xem màu khác.",
    roleplay_prompt_en: "Ask the price of the shirt and ask to see another color.",
    expected_response: {
      thai: "เสื้อตัวนี้เท่าไหร่ครับ มีสีอื่นไหมครับ",
      romanization: "sʉ̂a tua níi thâorài khráp, mii sǐi ʉ̀ʉn mǎi khráp",
      en: "How much is this shirt? Do you have other colors?",
      vi: "Áo này bao nhiêu? Có màu khác không?",
    },
  },
  {
    id: 22,
    level: "B1",
    topic: "shopping",
    title_vi: "Trả giá",
    title_en: "Bargaining",
    lines: [
      {
        speaker: "Customer",
        thai: "ลดหน่อยได้ไหมครับ แพงไปนิดนึง",
        romanization: "lót nɔ̀i dâai mǎi khráp, phɛɛng pai nít nʉng",
        en: "Can you lower it a bit? It's a little expensive.",
        vi: "Bớt chút được không? Hơi mắc.",
      },
      {
        speaker: "Vendor",
        thai: "ลดให้สิบบาทแล้วกันค่ะ",
        romanization: "lót hâi sìp bàat lɛ́ɛw kan khâ",
        en: "I'll take ten baht off, then.",
        vi: "Vậy bớt cho mười baht nhé.",
      },
    ],
    roleplay_prompt_vi: "Đề nghị mua hai cái và xin giảm thêm.",
    roleplay_prompt_en: "Offer to buy two and ask for a further discount.",
    expected_response: {
      thai: "ถ้าซื้อสองอัน ลดอีกหน่อยได้ไหมครับ",
      romanization: "thâa sʉ́ʉ sɔ̌ɔng an, lót ìik nɔ̀i dâai mǎi khráp",
      en: "If I buy two, can you lower it a bit more?",
      vi: "Nếu mua hai cái, bớt thêm chút được không?",
    },
  },
  {
    id: 23,
    level: "B1",
    topic: "shopping",
    title_vi: "Đổi hàng",
    title_en: "Exchanging an item",
    lines: [
      {
        speaker: "Customer",
        thai: "ขอเปลี่ยนไซส์ได้ไหมครับ ตัวนี้เล็กไป",
        romanization: "khɔ̌ɔ plìan sái dâai mǎi khráp, tua níi lék pai",
        en: "Can I change the size? This one is too small.",
        vi: "Đổi size được không? Cái này nhỏ quá.",
      },
      {
        speaker: "Staff",
        thai: "ได้ค่ะ มีใบเสร็จไหมคะ",
        romanization: "dâai khâ, mii bai sèt mǎi khá",
        en: "Sure. Do you have the receipt?",
        vi: "Được ạ. Bạn có hóa đơn không?",
      },
    ],
    roleplay_prompt_vi: "Nói bạn muốn đổi sang size L và đưa hóa đơn.",
    roleplay_prompt_en: "Say you want to change to size L and that you have the receipt.",
    expected_response: {
      thai: "ขอเปลี่ยนเป็นไซส์แอลครับ ผมมีใบเสร็จครับ",
      romanization: "khɔ̌ɔ plìan pen sái ɛɛn khráp, phǒm mii bai sèt khráp",
      en: "I'd like to change to size L. I have the receipt.",
      vi: "Cho tôi đổi sang size L. Tôi có hóa đơn.",
    },
  },

  // ── Immigration (B1) ──────────────────────────────────────────────────
  {
    id: 24,
    level: "B1",
    topic: "immigration",
    title_vi: "Nhập cảnh sân bay",
    title_en: "Airport immigration",
    lines: [
      {
        speaker: "Officer",
        thai: "มาประเทศไทยทำอะไรครับ",
        romanization: "maa pràthêet thai tham àrai khráp",
        en: "What's the purpose of your visit to Thailand?",
        vi: "Bạn đến Thái Lan để làm gì?",
      },
      {
        speaker: "Traveler",
        thai: "มาท่องเที่ยวค่ะ อยู่เจ็ดวันค่ะ",
        romanization: "maa thɔ̂ng thîaw khâ, yùu jèt wan khâ",
        en: "For tourism. I'll stay seven days.",
        vi: "Đi du lịch. Tôi ở bảy ngày.",
      },
    ],
    roleplay_prompt_vi: "Nói bạn đến công tác và ở mười ngày tại Bangkok.",
    roleplay_prompt_en: "Say you're here for business and staying ten days in Bangkok.",
    expected_response: {
      thai: "มาทำงานครับ อยู่สิบวันที่กรุงเทพครับ",
      romanization: "maa tham ngaan khráp, yùu sìp wan thîi krungthêep khráp",
      en: "I'm here for work, staying ten days in Bangkok.",
      vi: "Tôi đến làm việc, ở mười ngày tại Bangkok.",
    },
  },
  {
    id: 25,
    level: "B2",
    topic: "immigration",
    title_vi: "Gia hạn visa",
    title_en: "Extending a visa",
    lines: [
      {
        speaker: "Traveler",
        thai: "ผมอยากขอต่อวีซ่าอีกสามสิบวันครับ",
        romanization: "phǒm yàak khɔ̌ɔ tɔ̀ɔ wiisâa ìik sǎam sìp wan khráp",
        en: "I'd like to extend my visa for another thirty days.",
        vi: "Tôi muốn gia hạn visa thêm ba mươi ngày.",
      },
      {
        speaker: "Officer",
        thai: "กรอกแบบฟอร์มนี้แล้วแนบสำเนาหนังสือเดินทางด้วยครับ",
        romanization: "krɔ̀ɔk bɛ̀ɛp fɔɔm níi lɛ́ɛw nɛ́ɛp sǎmnao nǎngsʉ̌ʉ dəən thaang dûai khráp",
        en: "Fill in this form and attach a copy of your passport.",
        vi: "Điền mẫu này và đính kèm bản sao hộ chiếu.",
      },
    ],
    roleplay_prompt_vi: "Hỏi lệ phí gia hạn và mất bao lâu để xong.",
    roleplay_prompt_en: "Ask the extension fee and how long it takes.",
    expected_response: {
      thai: "ค่าธรรมเนียมเท่าไหร่ครับ แล้วใช้เวลานานไหมครับ",
      romanization: "khâa thamniam thâorài khráp, lɛ́ɛw chái weelaa naan mǎi khráp",
      en: "How much is the fee, and does it take long?",
      vi: "Lệ phí bao nhiêu, và mất bao lâu?",
    },
  },

  // ── Phone call (B1) ───────────────────────────────────────────────────
  {
    id: 26,
    level: "B1",
    topic: "phone_call",
    title_vi: "Gọi đặt bàn",
    title_en: "Calling to book a table",
    lines: [
      {
        speaker: "Caller",
        thai: "สวัสดีครับ ผมขอจองโต๊ะสำหรับสี่คนคืนนี้ครับ",
        romanization: "sàwàtdii khráp, phǒm khɔ̌ɔ jɔɔng tó sǎmràp sìi khon khʉʉn níi khráp",
        en: "Hello, I'd like to book a table for four tonight.",
        vi: "Xin chào, tôi muốn đặt bàn cho bốn người tối nay.",
      },
      {
        speaker: "Restaurant",
        thai: "ได้ค่ะ กี่โมงดีคะ",
        romanization: "dâai khâ, kìi moong dii khá",
        en: "Sure, what time?",
        vi: "Được ạ, mấy giờ ạ?",
      },
    ],
    roleplay_prompt_vi: "Đặt bàn cho hai người lúc 7 giờ tối và cho tên của bạn.",
    roleplay_prompt_en: "Book a table for two at 7 p.m. and give your name.",
    expected_response: {
      thai: "สองคนตอนหนึ่งทุ่มครับ จองชื่อนัทครับ",
      romanization: "sɔ̌ɔng khon tɔɔn nʉ̀ng thûm khráp, jɔɔng chʉ̂ʉ nát khráp",
      en: "Two people at 7 p.m., under the name Nat.",
      vi: "Hai người lúc 7 giờ tối, đặt tên Nat.",
    },
  },
  {
    id: 27,
    level: "B1",
    topic: "phone_call",
    title_vi: "Người cần gặp không có ở đó",
    title_en: "The person is not available",
    lines: [
      {
        speaker: "Caller",
        thai: "ขอสายคุณสมชายหน่อยครับ",
        romanization: "khɔ̌ɔ sǎai khun sǒmchaai nɔ̀i khráp",
        en: "May I speak to Mr. Somchai?",
        vi: "Cho tôi gặp anh Somchai.",
      },
      {
        speaker: "Operator",
        thai: "ตอนนี้เขาไม่อยู่ค่ะ ฝากข้อความไว้ไหมคะ",
        romanization: "tɔɔn níi khǎo mâi yùu khâ, fàak khɔ̂ɔ khwaam wái mǎi khá",
        en: "He's not here right now. Would you like to leave a message?",
        vi: "Hiện anh ấy không có ở đây. Bạn để lại lời nhắn không?",
      },
    ],
    roleplay_prompt_vi: "Nhờ nhắn lại rằng bạn sẽ gọi lại lúc 3 giờ chiều.",
    roleplay_prompt_en: "Leave a message that you'll call back at 3 p.m.",
    expected_response: {
      thai: "ฝากบอกว่าผมจะโทรกลับตอนบ่ายสามครับ",
      romanization: "fàak bɔ̀ɔk wâa phǒm jà thoo klàp tɔɔn bàai sǎam khráp",
      en: "Please tell him I'll call back at 3 p.m.",
      vi: "Nhắn giúp là tôi sẽ gọi lại lúc 3 giờ chiều.",
    },
  },

  // ── Workplace disagreement (C1) ───────────────────────────────────────
  {
    id: 28,
    level: "C1",
    topic: "workplace_disagreement",
    title_vi: "Không đồng ý lịch trình",
    title_en: "Disagreeing with a timeline",
    lines: [
      {
        speaker: "Colleague A",
        thai: "ผมเข้าใจที่คุณเสนอนะครับ แต่ผมว่ากำหนดส่งงานนี้เร็วเกินไป",
        romanization: "phǒm khâo jai thîi khun sànə̌ə ná khráp, tɛ̀ɛ phǒm wâa kamnòt sòng ngaan níi rew kəən pai",
        en: "I understand your proposal, but I think this deadline is too tight.",
        vi: "Tôi hiểu đề xuất của bạn, nhưng tôi thấy hạn này quá gấp.",
      },
      {
        speaker: "Colleague B",
        thai: "งั้นคุณคิดว่าควรเลื่อนไปกี่วันดีครับ",
        romanization: "ngán khun khít wâa khuan lʉ̂an pai kìi wan dii khráp",
        en: "So how many days do you think we should push it back?",
        vi: "Vậy bạn nghĩ nên dời lại mấy ngày?",
      },
    ],
    roleplay_prompt_vi: "Lịch sự đề nghị dời hạn thêm một tuần và nêu lý do chất lượng.",
    roleplay_prompt_en: "Politely propose a one-week extension and cite quality as the reason.",
    expected_response: {
      thai: "ผมเสนอให้เลื่อนอีกหนึ่งสัปดาห์ครับ เพื่อให้งานมีคุณภาพมากขึ้น",
      romanization: "phǒm sànə̌ə hâi lʉ̂an ìik nʉ̀ng sàpdaa khráp, phʉ̂a hâi ngaan mii khunnaphâap mâak khʉ̂n",
      en: "I propose pushing it back one more week so the work is higher quality.",
      vi: "Tôi đề nghị dời thêm một tuần để chất lượng tốt hơn.",
    },
  },
  {
    id: 29,
    level: "C1",
    topic: "workplace_disagreement",
    title_vi: "Phản hồi ý kiến khác",
    title_en: "Responding to a differing opinion",
    lines: [
      {
        speaker: "Manager",
        thai: "ผมอยากใช้แผนเดิม เพราะลูกค้าคุ้นเคยอยู่แล้วครับ",
        romanization: "phǒm yàak chái phɛ̌ɛn dəəm, phrɔ́ lûukkháa khún khəəi yùu lɛ́ɛw khráp",
        en: "I'd like to keep the old plan since clients are already familiar with it.",
        vi: "Tôi muốn giữ kế hoạch cũ vì khách hàng đã quen.",
      },
      {
        speaker: "Staff",
        thai: "ผมเห็นด้วยบางส่วนครับ แต่ขอเสนอปรับเล็กน้อยได้ไหมครับ",
        romanization: "phǒm hěn dûai baang sùan khráp, tɛ̀ɛ khɔ̌ɔ sànə̌ə pràp lék nɔ́ɔi dâai mǎi khráp",
        en: "I partly agree, but may I propose a small adjustment?",
        vi: "Tôi đồng ý một phần, nhưng tôi đề xuất điều chỉnh nhỏ được không?",
      },
    ],
    roleplay_prompt_vi: "Thừa nhận điểm đúng của sếp rồi đề xuất thử nghiệm phương án mới với nhóm nhỏ.",
    roleplay_prompt_en: "Acknowledge the manager's point, then propose piloting the new plan with a small group.",
    expected_response: {
      thai: "ผมเห็นด้วยครับ แต่ขอลองแผนใหม่กับกลุ่มเล็กก่อนได้ไหมครับ",
      romanization: "phǒm hěn dûai khráp, tɛ̀ɛ khɔ̌ɔ lɔɔng phɛ̌ɛn mài kàp klùm lék kɔ̀ɔn dâai mǎi khráp",
      en: "I agree, but may we try the new plan with a small group first?",
      vi: "Tôi đồng ý, nhưng xin thử kế hoạch mới với nhóm nhỏ trước được không?",
    },
  },

  // ── Formal meeting (C1–C2) ────────────────────────────────────────────
  {
    id: 30,
    level: "C1",
    topic: "formal_meeting",
    title_vi: "Mở đầu cuộc họp",
    title_en: "Opening a meeting",
    lines: [
      {
        speaker: "Chair",
        thai: "ขอบคุณทุกท่านที่มาประชุมในวันนี้ครับ เรามาเริ่มกันเลยนะครับ",
        romanization: "khɔ̀ɔp khun thúk thâan thîi maa prachum nai wan níi khráp, rao maa rə̂əm kan ləəi ná khráp",
        en: "Thank you all for attending today. Let's get started.",
        vi: "Cảm ơn quý vị đã đến họp hôm nay. Chúng ta bắt đầu nhé.",
      },
      {
        speaker: "Member",
        thai: "ขอทราบวาระการประชุมก่อนได้ไหมครับ",
        romanization: "khɔ̌ɔ sâap waará kaan prachum kɔ̀ɔn dâai mǎi khráp",
        en: "May we go over the agenda first?",
        vi: "Cho tôi biết chương trình họp trước được không?",
      },
    ],
    roleplay_prompt_vi: "Là người chủ trì, giới thiệu hai mục chính của cuộc họp.",
    roleplay_prompt_en: "As the chair, introduce the two main agenda items.",
    expected_response: {
      thai: "วันนี้เรามีสองวาระหลักครับ เรื่องงบประมาณและแผนการตลาด",
      romanization: "wan níi rao mii sɔ̌ɔng waará làk khráp, rʉ̂ang ngóp pràmaan lɛ́ kaan tàlàat",
      en: "Today we have two main items: the budget and the marketing plan.",
      vi: "Hôm nay có hai mục chính: ngân sách và kế hoạch marketing.",
    },
  },
  {
    id: 31,
    level: "C2",
    topic: "formal_meeting",
    title_vi: "Tóm tắt và chốt quyết định",
    title_en: "Summarizing and concluding",
    lines: [
      {
        speaker: "Chair",
        thai: "สรุปแล้ว เราเห็นพ้องกันว่าจะเลื่อนการเปิดตัวออกไปหนึ่งเดือนนะครับ",
        romanization: "sàrùp lɛ́ɛw, rao hěn phɔ́ɔng kan wâa jà lʉ̂an kaan pə̀ət tua ɔ̀ɔk pai nʉ̀ng dʉan ná khráp",
        en: "In summary, we agree to postpone the launch by one month.",
        vi: "Tóm lại, chúng ta nhất trí dời ra mắt thêm một tháng.",
      },
      {
        speaker: "Member",
        thai: "เห็นด้วยครับ ผมจะรับผิดชอบติดตามความคืบหน้าให้",
        romanization: "hěn dûai khráp, phǒm jà ráp phìt chɔ̂ɔp tìt taam khwaam khʉ̂ʉp nâa hâi",
        en: "Agreed. I'll take responsibility for tracking the progress.",
        vi: "Tôi đồng ý. Tôi sẽ chịu trách nhiệm theo dõi tiến độ.",
      },
    ],
    roleplay_prompt_vi: "Chốt lại rằng nhóm sẽ họp lại sau hai tuần và cảm ơn mọi người.",
    roleplay_prompt_en: "Conclude that the team will reconvene in two weeks and thank everyone.",
    expected_response: {
      thai: "เราจะประชุมอีกครั้งในอีกสองสัปดาห์ครับ ขอบคุณทุกท่านมากครับ",
      romanization: "rao jà prachum ìik khráng nai ìik sɔ̌ɔng sàpdaa khráp, khɔ̀ɔp khun thúk thâan mâak khráp",
      en: "We'll meet again in two weeks. Thank you all very much.",
      vi: "Chúng ta sẽ họp lại sau hai tuần. Cảm ơn quý vị rất nhiều.",
    },
  },

  // ── Extra coverage round (mixed levels) ───────────────────────────────
  {
    id: 32,
    level: "A1",
    topic: "food",
    title_vi: "Hỏi nhà vệ sinh",
    title_en: "Asking for the toilet",
    lines: [
      {
        speaker: "Customer",
        thai: "ห้องน้ำอยู่ที่ไหนครับ",
        romanization: "hɔ̂ng náam yùu thîi nǎi khráp",
        en: "Where is the toilet?",
        vi: "Nhà vệ sinh ở đâu?",
      },
      {
        speaker: "Staff",
        thai: "อยู่ด้านหลังค่ะ ตรงไปเลยค่ะ",
        romanization: "yùu dâan lǎng khâ, trong pai ləəi khâ",
        en: "It's at the back, straight ahead.",
        vi: "Ở phía sau, đi thẳng là tới.",
      },
    ],
    roleplay_prompt_vi: "Hỏi nhà vệ sinh ở tầng nào.",
    roleplay_prompt_en: "Ask which floor the toilet is on.",
    expected_response: {
      thai: "ห้องน้ำอยู่ชั้นไหนครับ",
      romanization: "hɔ̂ng náam yùu chán nǎi khráp",
      en: "Which floor is the toilet on?",
      vi: "Nhà vệ sinh ở tầng nào?",
    },
  },
  {
    id: 33,
    level: "A2",
    topic: "taxi",
    title_vi: "Hỏi giá trước khi đi",
    title_en: "Asking the fare beforehand",
    lines: [
      {
        speaker: "Passenger",
        thai: "ไปสถานีรถไฟประมาณเท่าไหร่ครับ",
        romanization: "pai sàthǎanii rótfai pràmaan thâorài khráp",
        en: "About how much to the train station?",
        vi: "Đến ga tàu khoảng bao nhiêu?",
      },
      {
        speaker: "Driver",
        thai: "ประมาณแปดสิบบาทครับ",
        romanization: "pràmaan pɛ̀ɛt sìp bàat khráp",
        en: "About eighty baht.",
        vi: "Khoảng tám mươi baht.",
      },
    ],
    roleplay_prompt_vi: "Hỏi đến trung tâm thương mại mất bao lâu.",
    roleplay_prompt_en: "Ask how long it takes to the shopping mall.",
    expected_response: {
      thai: "ไปห้างใช้เวลานานไหมครับ",
      romanization: "pai hâang chái weelaa naan mǎi khráp",
      en: "Does it take long to the mall?",
      vi: "Đến trung tâm thương mại có lâu không?",
    },
  },
  {
    id: 34,
    level: "B1",
    topic: "hotel",
    title_vi: "Gửi hành lý",
    title_en: "Storing luggage",
    lines: [
      {
        speaker: "Guest",
        thai: "ผมเช็คเอาท์แล้ว ขอฝากกระเป๋าถึงบ่ายได้ไหมครับ",
        romanization: "phǒm chék áo lɛ́ɛw, khɔ̌ɔ fàak krapǎo thʉ̌ng bàai dâai mǎi khráp",
        en: "I've checked out. Can I leave my luggage until the afternoon?",
        vi: "Tôi trả phòng rồi. Gửi hành lý đến chiều được không?",
      },
      {
        speaker: "Receptionist",
        thai: "ได้ค่ะ เก็บไว้ที่ห้องเก็บของให้นะคะ",
        romanization: "dâai khâ, kèp wái thîi hɔ̂ng kèp khɔ̌ɔng hâi ná khá",
        en: "Yes, we'll keep it in the storage room for you.",
        vi: "Được ạ, sẽ giữ ở phòng để đồ giúp bạn.",
      },
    ],
    roleplay_prompt_vi: "Hỏi gửi hai vali đến 6 giờ tối được không.",
    roleplay_prompt_en: "Ask if you can store two suitcases until 6 p.m.",
    expected_response: {
      thai: "ฝากกระเป๋าสองใบถึงหกโมงเย็นได้ไหมครับ",
      romanization: "fàak krapǎo sɔ̌ɔng bai thʉ̌ng hòk moong yen dâai mǎi khráp",
      en: "Can I store two suitcases until 6 p.m.?",
      vi: "Gửi hai vali đến 6 giờ tối được không?",
    },
  },
  {
    id: 35,
    level: "B1",
    topic: "pharmacy",
    title_vi: "Mua thuốc đau bụng",
    title_en: "Buying stomach medicine",
    lines: [
      {
        speaker: "Customer",
        thai: "ผมปวดท้องกับท้องเสียครับ มียาไหมครับ",
        romanization: "phǒm pùat thɔ́ɔng kàp thɔ́ɔng sǐa khráp, mii yaa mǎi khráp",
        en: "I have a stomachache and diarrhea. Do you have medicine?",
        vi: "Tôi đau bụng và tiêu chảy. Có thuốc không?",
      },
      {
        speaker: "Pharmacist",
        thai: "มีค่ะ ดื่มน้ำเยอะ ๆ ด้วยนะคะ",
        romanization: "mii khâ, dʉ̀ʉm náam yə́ yə́ dûai ná khá",
        en: "Yes. Also drink plenty of water.",
        vi: "Có ạ. Nhớ uống nhiều nước nữa nhé.",
      },
    ],
    roleplay_prompt_vi: "Hỏi thuốc này uống trước hay sau khi ăn.",
    roleplay_prompt_en: "Ask whether to take this before or after meals.",
    expected_response: {
      thai: "ยานี้ทานก่อนหรือหลังอาหารครับ",
      romanization: "yaa níi thaan kɔ̀ɔn rʉ̌ʉ lǎng aahǎan khráp",
      en: "Do I take this before or after meals?",
      vi: "Thuốc này uống trước hay sau khi ăn?",
    },
  },
  {
    id: 36,
    level: "B2",
    topic: "police_lost_item",
    title_vi: "Hỏi đường đến đồn cảnh sát",
    title_en: "Asking the way to the police station",
    lines: [
      {
        speaker: "Tourist",
        thai: "สถานีตำรวจที่ใกล้ที่สุดอยู่ที่ไหนครับ",
        romanization: "sàthǎanii tamrùat thîi klâi thîi sùt yùu thîi nǎi khráp",
        en: "Where is the nearest police station?",
        vi: "Đồn cảnh sát gần nhất ở đâu?",
      },
      {
        speaker: "Local",
        thai: "เดินตรงไปแล้วเลี้ยวขวา อยู่ตรงหัวมุมค่ะ",
        romanization: "dəən trong pai lɛ́ɛw líaw khwǎa, yùu trong hǔa mum khâ",
        en: "Walk straight, then turn right; it's on the corner.",
        vi: "Đi thẳng rồi rẽ phải, ở ngay góc đường.",
      },
    ],
    roleplay_prompt_vi: "Hỏi đi bộ đến đó mất bao lâu.",
    roleplay_prompt_en: "Ask how long it takes to walk there.",
    expected_response: {
      thai: "เดินไปใช้เวลากี่นาทีครับ",
      romanization: "dəən pai chái weelaa kìi naathii khráp",
      en: "How many minutes does it take to walk there?",
      vi: "Đi bộ đến đó mất mấy phút?",
    },
  },
  {
    id: 37,
    level: "B2",
    topic: "work_first_day",
    title_vi: "Xin nghỉ phép",
    title_en: "Requesting leave",
    lines: [
      {
        speaker: "Employee",
        thai: "ผมขอลาหยุดวันศุกร์หน้าได้ไหมครับ",
        romanization: "phǒm khɔ̌ɔ laa yùt wan sùk nâa dâai mǎi khráp",
        en: "May I take leave next Friday?",
        vi: "Tôi xin nghỉ thứ Sáu tuần sau được không?",
      },
      {
        speaker: "Manager",
        thai: "ได้ครับ ฝากเขียนใบลาส่งฝ่ายบุคคลด้วยนะครับ",
        romanization: "dâai khráp, fàak khǐan bai laa sòng fàai bùkkhon dûai ná khráp",
        en: "Sure. Please submit a leave form to HR.",
        vi: "Được. Nhớ viết đơn nghỉ gửi phòng nhân sự nhé.",
      },
    ],
    roleplay_prompt_vi: "Nói lý do nghỉ là việc gia đình và sẽ bàn giao công việc trước.",
    roleplay_prompt_en: "Say the reason is family matters and that you'll hand over your work first.",
    expected_response: {
      thai: "มีธุระครอบครัวครับ ผมจะส่งงานต่อให้เรียบร้อยก่อนครับ",
      romanization: "mii thúrá khrɔ̂ɔp khrua khráp, phǒm jà sòng ngaan tɔ̀ɔ hâi rîap rɔ́ɔi kɔ̀ɔn khráp",
      en: "It's a family matter. I'll hand over my work properly first.",
      vi: "Vì việc gia đình. Tôi sẽ bàn giao công việc gọn gàng trước.",
    },
  },
  {
    id: 38,
    level: "A2",
    topic: "shopping",
    title_vi: "Thanh toán",
    title_en: "Paying",
    lines: [
      {
        speaker: "Customer",
        thai: "จ่ายด้วยบัตรได้ไหมครับ",
        romanization: "jàai dûai bàt dâai mǎi khráp",
        en: "Can I pay by card?",
        vi: "Trả bằng thẻ được không?",
      },
      {
        speaker: "Cashier",
        thai: "ได้ค่ะ หรือสแกนคิวอาร์โค้ดก็ได้ค่ะ",
        romanization: "dâai khâ, rʉ̌ʉ sàkɛɛn khiu aa khôot kɔ̂ɔ dâai khâ",
        en: "Yes, or you can scan the QR code.",
        vi: "Được ạ, hoặc quét mã QR cũng được.",
      },
    ],
    roleplay_prompt_vi: "Hỏi trả bằng tiền mặt và xin hóa đơn.",
    roleplay_prompt_en: "Say you'll pay cash and ask for a receipt.",
    expected_response: {
      thai: "จ่ายเงินสดครับ ขอใบเสร็จด้วยครับ",
      romanization: "jàai ngən sòt khráp, khɔ̌ɔ bai sèt dûai khráp",
      en: "I'll pay cash. Receipt, please.",
      vi: "Tôi trả tiền mặt. Cho xin hóa đơn.",
    },
  },
  {
    id: 39,
    level: "B1",
    topic: "phone_call",
    title_vi: "Gọi báo đến trễ",
    title_en: "Calling to say you'll be late",
    lines: [
      {
        speaker: "Caller",
        thai: "ขอโทษครับ ผมรถติด จะไปสายประมาณยี่สิบนาทีครับ",
        romanization: "khɔ̌ɔ thôot khráp, phǒm rót tìt, jà pai sǎai pràmaan yîi sìp naathii khráp",
        en: "Sorry, I'm stuck in traffic. I'll be about twenty minutes late.",
        vi: "Xin lỗi, tôi bị kẹt xe. Tôi sẽ đến trễ khoảng hai mươi phút.",
      },
      {
        speaker: "Colleague",
        thai: "ไม่เป็นไรครับ เดี๋ยวเริ่มประชุมรอคุณนะครับ",
        romanization: "mâi pen rai khráp, dǐaw rə̂əm prachum rɔɔ khun ná khráp",
        en: "No problem, we'll wait for you to start the meeting.",
        vi: "Không sao, chúng tôi sẽ đợi bạn để bắt đầu họp.",
      },
    ],
    roleplay_prompt_vi: "Báo bạn đến trễ 10 phút và xin họ bắt đầu trước.",
    roleplay_prompt_en: "Say you'll be 10 minutes late and ask them to start without you.",
    expected_response: {
      thai: "ผมจะสายสิบนาทีครับ เริ่มก่อนได้เลยครับ",
      romanization: "phǒm jà sǎai sìp naathii khráp, rə̂əm kɔ̀ɔn dâai ləəi khráp",
      en: "I'll be ten minutes late. Please start without me.",
      vi: "Tôi sẽ trễ mười phút. Cứ bắt đầu trước nhé.",
    },
  },
  {
    id: 40,
    level: "C1",
    topic: "formal_meeting",
    title_vi: "Xin phát biểu ý kiến",
    title_en: "Asking to add a point",
    lines: [
      {
        speaker: "Member",
        thai: "ขออนุญาตเสริมประเด็นหนึ่งนะครับ",
        romanization: "khɔ̌ɔ ànúyâat sə̌əm pràden nʉ̀ng ná khráp",
        en: "May I add one point?",
        vi: "Cho phép tôi bổ sung một ý.",
      },
      {
        speaker: "Chair",
        thai: "เชิญครับ ว่ามาได้เลยครับ",
        romanization: "chəən khráp, wâa maa dâai ləəi khráp",
        en: "Please go ahead.",
        vi: "Mời bạn, cứ nói.",
      },
    ],
    roleplay_prompt_vi: "Xin bổ sung rằng nên hỏi ý kiến khách hàng trước khi quyết định.",
    roleplay_prompt_en: "Add that we should consult clients before deciding.",
    expected_response: {
      thai: "ผมคิดว่าเราควรถามความเห็นลูกค้าก่อนตัดสินใจครับ",
      romanization: "phǒm khít wâa rao khuan thǎam khwaam hěn lûukkháa kɔ̀ɔn tàtsǐn jai khráp",
      en: "I think we should ask for clients' opinions before deciding.",
      vi: "Tôi nghĩ nên hỏi ý kiến khách hàng trước khi quyết định.",
    },
  },
  {
    id: 41,
    level: "A1",
    topic: "greetings",
    title_vi: "Xin lỗi và cảm ơn",
    title_en: "Sorry and thank you",
    lines: [
      {
        speaker: "A",
        thai: "ขอโทษครับ",
        romanization: "khɔ̌ɔ thôot khráp",
        en: "Sorry / Excuse me.",
        vi: "Xin lỗi.",
      },
      {
        speaker: "B",
        thai: "ไม่เป็นไรค่ะ",
        romanization: "mâi pen rai khâ",
        en: "It's okay.",
        vi: "Không sao.",
      },
    ],
    roleplay_prompt_vi: "Xin lỗi vì đến trễ và cảm ơn vì đã chờ.",
    roleplay_prompt_en: "Apologize for being late and thank them for waiting.",
    expected_response: {
      thai: "ขอโทษที่มาสายครับ ขอบคุณที่รอนะครับ",
      romanization: "khɔ̌ɔ thôot thîi maa sǎai khráp, khɔ̀ɔp khun thîi rɔɔ ná khráp",
      en: "Sorry for being late, thank you for waiting.",
      vi: "Xin lỗi vì đến trễ, cảm ơn đã chờ.",
    },
  },
  {
    id: 42,
    level: "A2",
    topic: "immigration",
    title_vi: "Khai phiếu nhập cảnh",
    title_en: "Arrival card",
    lines: [
      {
        speaker: "Traveler",
        thai: "ผมต้องกรอกบัตรขาเข้าไหมครับ",
        romanization: "phǒm tɔ̂ng krɔ̀ɔk bàt khǎa khâo mǎi khráp",
        en: "Do I need to fill in an arrival card?",
        vi: "Tôi có cần điền phiếu nhập cảnh không?",
      },
      {
        speaker: "Officer",
        thai: "ต้องกรอกครับ ใช้ปากกาสีดำนะครับ",
        romanization: "tɔ̂ng krɔ̀ɔk khráp, chái pàakkaa sǐi dam ná khráp",
        en: "Yes, you do. Use a black pen.",
        vi: "Có, cần điền. Dùng bút màu đen nhé.",
      },
    ],
    roleplay_prompt_vi: "Hỏi mượn bút và hỏi ghi địa chỉ khách sạn ở đâu.",
    roleplay_prompt_en: "Ask to borrow a pen and where to write the hotel address.",
    expected_response: {
      thai: "ขอยืมปากกาหน่อยครับ ที่อยู่โรงแรมเขียนตรงไหนครับ",
      romanization: "khɔ̌ɔ yʉʉm pàakkaa nɔ̀i khráp, thîi yùu roong rɛɛm khǐan trong nǎi khráp",
      en: "May I borrow a pen? Where do I write the hotel address?",
      vi: "Cho mượn bút. Địa chỉ khách sạn ghi ở đâu?",
    },
  },
  {
    id: 43,
    level: "C2",
    topic: "workplace_disagreement",
    title_vi: "Bất đồng về ngân sách",
    title_en: "Disagreeing over budget",
    lines: [
      {
        speaker: "Finance",
        thai: "งบที่ขอมาเกินกรอบที่เราตั้งไว้พอสมควรครับ",
        romanization: "ngóp thîi khɔ̌ɔ maa kəən krɔ̀ɔp thîi rao tâng wái phɔɔ sǒmkhuan khráp",
        en: "The requested budget exceeds our set limit by quite a lot.",
        vi: "Ngân sách đề nghị vượt khá nhiều so với hạn mức đã đặt.",
      },
      {
        speaker: "Project lead",
        thai: "ผมเข้าใจข้อจำกัดครับ แต่ถ้าตัดงบส่วนนี้ คุณภาพอาจได้รับผลกระทบ",
        romanization: "phǒm khâo jai khɔ̂ɔ jamkàt khráp, tɛ̀ɛ thâa tàt ngóp sùan níi, khunnaphâap àat dâi ráp phǒn kràthóp",
        en: "I understand the constraints, but cutting this part may affect quality.",
        vi: "Tôi hiểu các giới hạn, nhưng cắt phần này có thể ảnh hưởng chất lượng.",
      },
    ],
    roleplay_prompt_vi: "Đề xuất một phương án dung hòa: giảm 10% ngân sách và dời một hạng mục sang quý sau.",
    roleplay_prompt_en: "Propose a compromise: cut 10% and move one item to next quarter.",
    expected_response: {
      thai: "ผมขอเสนอลดงบลงสิบเปอร์เซ็นต์ และเลื่อนหนึ่งรายการไปไตรมาสหน้าครับ",
      romanization: "phǒm khɔ̌ɔ sànə̌ə lót ngóp long sìp pəəsen, lɛ́ lʉ̂an nʉ̀ng raaikaan pai traimâat nâa khráp",
      en: "I propose cutting the budget by 10% and moving one item to next quarter.",
      vi: "Tôi đề nghị giảm ngân sách 10% và dời một hạng mục sang quý sau.",
    },
  },
  {
    id: 44,
    level: "B1",
    topic: "food",
    title_vi: "Hỏi món đặc trưng",
    title_en: "Asking for a signature dish",
    lines: [
      {
        speaker: "Customer",
        thai: "ร้านนี้มีเมนูแนะนำอะไรบ้างครับ",
        romanization: "ráan níi mii meenuu nɛ́nam àrai bâang khráp",
        en: "What dishes does this place recommend?",
        vi: "Quán này có món gì nên thử?",
      },
      {
        speaker: "Server",
        thai: "ต้มยำกุ้งกับแกงเขียวหวานขายดีค่ะ",
        romanization: "tômyam kûng kàp kɛɛng khǐaw wǎan khǎai dii khâ",
        en: "Tom yum goong and green curry are bestsellers.",
        vi: "Tôm yum và cà ri xanh bán chạy lắm.",
      },
    ],
    roleplay_prompt_vi: "Hỏi món nào ít cay nhất và gọi món đó.",
    roleplay_prompt_en: "Ask which dish is the least spicy and order it.",
    expected_response: {
      thai: "เมนูไหนเผ็ดน้อยที่สุดครับ ขออันนั้นครับ",
      romanization: "meenuu nǎi phèt nɔ́ɔi thîi sùt khráp, khɔ̌ɔ an nán khráp",
      en: "Which dish is the least spicy? I'll have that one.",
      vi: "Món nào ít cay nhất? Cho tôi món đó.",
    },
  },
  {
    id: 45,
    level: "B2",
    topic: "phone_call",
    title_vi: "Khiếu nại dịch vụ qua điện thoại",
    title_en: "Complaining about service by phone",
    lines: [
      {
        speaker: "Customer",
        thai: "ผมสั่งของไปสามวันแล้วแต่ยังไม่ได้รับเลยครับ",
        romanization: "phǒm sàng khɔ̌ɔng pai sǎam wan lɛ́ɛw tɛ̀ɛ yang mâi dâai ráp ləəi khráp",
        en: "I ordered three days ago but still haven't received it.",
        vi: "Tôi đặt hàng ba ngày rồi mà vẫn chưa nhận được.",
      },
      {
        speaker: "Support",
        thai: "ต้องขออภัยด้วยค่ะ ขอเลขที่คำสั่งซื้อหน่อยได้ไหมคะ",
        romanization: "tɔ̂ng khɔ̌ɔ àphai dûai khâ, khɔ̌ɔ lêek thîi kham sàng sʉ́ʉ nɔ̀i dâai mǎi khá",
        en: "I'm very sorry. Could I have your order number?",
        vi: "Thành thật xin lỗi. Cho tôi xin mã đơn hàng được không?",
      },
    ],
    roleplay_prompt_vi: "Đọc mã đơn và yêu cầu giao lại hoặc hoàn tiền.",
    roleplay_prompt_en: "Give the order number and ask for redelivery or a refund.",
    expected_response: {
      thai: "เลขที่คำสั่งซื้อคือเอหนึ่งสองสามครับ ขอให้ส่งใหม่หรือคืนเงินครับ",
      romanization: "lêek thîi kham sàng sʉ́ʉ khʉʉ ee nʉ̀ng sɔ̌ɔng sǎam khráp, khɔ̌ɔ hâi sòng mài rʉ̌ʉ khʉʉn ngən khráp",
      en: "My order number is A123. Please redeliver or refund.",
      vi: "Mã đơn của tôi là A123. Cho giao lại hoặc hoàn tiền.",
    },
  },
  {
    id: 46,
    level: "A2",
    topic: "work_first_day",
    title_vi: "Hỏi chỗ ngồi",
    title_en: "Asking about your desk",
    lines: [
      {
        speaker: "New hire",
        thai: "โต๊ะทำงานของผมอยู่ตรงไหนครับ",
        romanization: "tó tham ngaan khɔ̌ɔng phǒm yùu trong nǎi khráp",
        en: "Where is my desk?",
        vi: "Bàn làm việc của tôi ở đâu?",
      },
      {
        speaker: "Colleague",
        thai: "อยู่ข้างหน้าต่างตรงนั้นค่ะ",
        romanization: "yùu khâang nâatàang trong nán khâ",
        en: "It's over there by the window.",
        vi: "Ở đằng kia cạnh cửa sổ.",
      },
    ],
    roleplay_prompt_vi: "Cảm ơn và hỏi máy tính đã sẵn sàng chưa.",
    roleplay_prompt_en: "Say thanks and ask whether the computer is ready.",
    expected_response: {
      thai: "ขอบคุณครับ คอมพิวเตอร์พร้อมใช้แล้วหรือยังครับ",
      romanization: "khɔ̀ɔp khun khráp, khɔɔmphíutəə phrɔ́ɔm chái lɛ́ɛw rʉ̌ʉ yang khráp",
      en: "Thank you. Is the computer ready to use yet?",
      vi: "Cảm ơn. Máy tính đã dùng được chưa?",
    },
  },
  {
    id: 47,
    level: "B2",
    topic: "immigration",
    title_vi: "Bị hỏi thêm tại cửa khẩu",
    title_en: "Secondary questioning at the border",
    lines: [
      {
        speaker: "Officer",
        thai: "คุณพักที่ไหน แล้วมีตั๋วขากลับไหมครับ",
        romanization: "khun phák thîi nǎi, lɛ́ɛw mii tǔa khǎa klàp mǎi khráp",
        en: "Where are you staying, and do you have a return ticket?",
        vi: "Bạn ở đâu, và có vé khứ hồi không?",
      },
      {
        speaker: "Traveler",
        thai: "พักที่โรงแรมในเมืองค่ะ มีตั๋วขากลับด้วยค่ะ",
        romanization: "phák thîi roong rɛɛm nai mʉang khâ, mii tǔa khǎa klàp dûai khâ",
        en: "I'm staying at a hotel downtown, and I have a return ticket.",
        vi: "Tôi ở khách sạn trong thành phố, và có vé khứ hồi.",
      },
    ],
    roleplay_prompt_vi: "Trả lời bạn ở mười ngày và cho xem đặt phòng khách sạn.",
    roleplay_prompt_en: "Answer that you'll stay ten days and can show the hotel booking.",
    expected_response: {
      thai: "ผมอยู่สิบวันครับ มีใบจองโรงแรมให้ดูด้วยครับ",
      romanization: "phǒm yùu sìp wan khráp, mii bai jɔɔng roong rɛɛm hâi duu dûai khráp",
      en: "I'm staying ten days. I have the hotel booking to show.",
      vi: "Tôi ở mười ngày. Tôi có phiếu đặt phòng để cho xem.",
    },
  },
  {
    id: 48,
    level: "C1",
    topic: "formal_meeting",
    title_vi: "Lịch sự bất đồng trong họp",
    title_en: "Politely disagreeing in a meeting",
    lines: [
      {
        speaker: "Member A",
        thai: "ผมเข้าใจมุมมองของคุณนะครับ แต่ขอเห็นต่างในบางประเด็น",
        romanization: "phǒm khâo jai mum mɔɔng khɔ̌ɔng khun ná khráp, tɛ̀ɛ khɔ̌ɔ hěn tàang nai baang pràden",
        en: "I understand your view, but I differ on some points.",
        vi: "Tôi hiểu quan điểm của bạn, nhưng tôi khác ý ở vài điểm.",
      },
      {
        speaker: "Member B",
        thai: "ได้ครับ เชิญอธิบายเหตุผลได้เลยครับ",
        romanization: "dâai khráp, chəən àthíbaai hèet phǒn dâai ləəi khráp",
        en: "Sure, please explain your reasoning.",
        vi: "Được, mời bạn giải thích lý do.",
      },
    ],
    roleplay_prompt_vi: "Nêu một lý do dữ liệu cho thấy nên chọn phương án khác.",
    roleplay_prompt_en: "Give one data-based reason for choosing a different option.",
    expected_response: {
      thai: "จากข้อมูลยอดขาย ผมคิดว่าแผนที่สองน่าจะเหมาะกว่าครับ",
      romanization: "jàak khɔ̂ɔ muun yɔ̂ɔt khǎai, phǒm khít wâa phɛ̌ɛn thîi sɔ̌ɔng nâa jà mɔ̀ kwàa khráp",
      en: "Based on the sales data, I think the second plan is more suitable.",
      vi: "Dựa trên dữ liệu doanh số, tôi nghĩ phương án hai phù hợp hơn.",
    },
  },
];

export default thaiDialogues;

// Distinct topics covered, for callers that want to render topic filters.
export const THAI_DIALOGUE_TOPICS: ThaiDialogueTopic[] = [
  "greetings",
  "food",
  "taxi",
  "hotel",
  "pharmacy",
  "police_lost_item",
  "work_first_day",
  "shopping",
  "immigration",
  "phone_call",
  "workplace_disagreement",
  "formal_meeting",
];
