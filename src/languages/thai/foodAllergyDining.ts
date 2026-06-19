// src/languages/thai/foodAllergyDining.ts
//
// Thai FOOD-ALLERGY / DINING-SAFETY language pack (Wave 6).
//
// PURE DATA. Language support ONLY — these items help a non-Thai-speaker
// state dietary needs and allergies clearly and be understood by waiters,
// cooks, and vendors. They are NOT medical advice (no treatment, no "safe
// to eat" judgements) and contain NO religious claims: the "no pork / no
// alcohol" items are framed strictly as a DIETARY PREFERENCE, never as a
// halal certification or religious assertion.
//
// Audience: Vietnamese-speaking learners first, English second. Every item
// carries Thai script + romanization + a Vietnamese meaning + an English
// meaning, with optional usage notes.
//
// In a real allergic emergency, route to professionals: 1669 (medical/
// ambulance), 191 (police), 1155 (tourist police, English-speaking).
//
// Items are assembled from compact tuples by the pure `build()` transform.
//
// Native review DEFERRED: romanization/tone marks are a readable
// approximation, not a linguist-verified transcription. Not native-reviewed.

// ── Types ────────────────────────────────────────────────────────────────

export type ThaiDiningTopic =
  | "allergy"
  | "vegetarian"
  | "halal_style"
  | "no_pork"
  | "no_seafood"
  | "spicy_level"
  | "ingredients"
  | "contamination_warning"
  | "emergency_phrase"
  | "restaurant_clarification";

export type ThaiDiningItem = {
  /** Stable unique id, e.g. "thai-dining-001". */
  id: string;
  topic: ThaiDiningTopic;
  /** Thai script — the line to say/show. */
  th: string;
  /** Romanization with light tone cues. */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** Optional Vietnamese usage note. */
  note_vi?: string;
  /** Optional English usage note. */
  note_en?: string;
};

// ── Source tuple + builder (pure data transform) ─────────────────────────

/** [th, rtgs, vi, en, note_vi?, note_en?] */
type Entry = readonly [
  th: string,
  rtgs: string,
  vi: string,
  en: string,
  note_vi?: string,
  note_en?: string,
];

let ITEM_SEQ = 0;

function build(topic: ThaiDiningTopic, entries: readonly Entry[]): ThaiDiningItem[] {
  return entries.map((e) => {
    const [th, rtgs, vi, en, note_vi, note_en] = e;
    ITEM_SEQ += 1;
    const item: ThaiDiningItem = {
      id: `thai-dining-${String(ITEM_SEQ).padStart(3, "0")}`,
      topic,
      th,
      rtgs,
      vi,
      en,
    };
    if (note_vi) item.note_vi = note_vi;
    if (note_en) item.note_en = note_en;
    return item;
  });
}

// ── Source data ──────────────────────────────────────────────────────────

const ALLERGY: Entry[] = [
  ["ผม/ฉันแพ้อาหาร", "phǒm/chǎn pháe aa-hǎan", "Tôi bị dị ứng thức ăn.", "I have a food allergy."],
  ["ผม/ฉันแพ้ถั่วลิสง", "phǒm/chǎn pháe thùa-lí-sǒng", "Tôi dị ứng đậu phộng.", "I'm allergic to peanuts."],
  ["ผม/ฉันแพ้นม", "phǒm/chǎn pháe nom", "Tôi dị ứng sữa.", "I'm allergic to dairy."],
  ["ผม/ฉันแพ้ไข่", "phǒm/chǎn pháe khài", "Tôi dị ứng trứng.", "I'm allergic to eggs."],
  ["ผม/ฉันแพ้แป้งสาลี", "phǒm/chǎn pháe pâeng sǎa-lii", "Tôi dị ứng lúa mì (gluten).", "I'm allergic to wheat/gluten."],
  [
    "ถ้าผม/ฉันกินเข้าไปจะแพ้รุนแรง",
    "thâa phǒm/chǎn gin khâo-pai jà pháe run-raeng",
    "Nếu ăn vào tôi sẽ dị ứng nặng.",
    "If I eat it I'll have a severe reaction.",
    "Câu nhấn mạnh mức độ nghiêm trọng.",
    "Stresses how serious the reaction is.",
  ],
  ["ผม/ฉันแพ้งา", "phǒm/chǎn pháe ngaa", "Tôi dị ứng mè (vừng).", "I'm allergic to sesame."],
];

const VEGETARIAN: Entry[] = [
  ["ผม/ฉันกินมังสวิรัติ", "phǒm/chǎn gin mang-sà-wí-rát", "Tôi ăn chay.", "I'm vegetarian."],
  [
    "ผม/ฉันกินเจ",
    "phǒm/chǎn gin jay",
    "Tôi ăn chay trường (không trứng/hành/tỏi).",
    "I eat 'jay' (stricter vegan, no egg/onion/garlic).",
    "Tìm biển 'เจ' màu vàng-đỏ để chắc chắn.",
    "Look for the yellow-red 'เจ' sign for strict vegan.",
  ],
  ["ไม่ใส่เนื้อสัตว์", "mâi sài nʉ́a-sàt", "Không cho thịt.", "No meat, please."],
  ["ไม่ใส่ไข่", "mâi sài khài", "Không cho trứng.", "No egg, please."],
  [
    "ไม่ใส่น้ำปลา",
    "mâi sài náam-plaa",
    "Không cho nước mắm.",
    "No fish sauce, please.",
    "Nước mắm ẩn trong rất nhiều món Thái.",
    "Fish sauce is hidden in many Thai dishes.",
  ],
  ["มีเมนูมังสวิรัติไหมครับ/คะ", "mii mee-nuu mang-sà-wí-rát mǎi khráp/khá", "Có món chay không?", "Do you have vegetarian dishes?"],
  ["ใช้น้ำมันพืชนะครับ/คะ", "chái náam-man phʉ̂ʉt ná khráp/khá", "Dùng dầu thực vật nhé.", "Use vegetable oil, please."],
];

const HALAL_STYLE: Entry[] = [
  [
    "ไม่ใส่หมูและไม่ใส่เหล้า",
    "mâi sài mǔu láe mâi sài lâo",
    "Không thịt heo và không rượu.",
    "No pork and no alcohol.",
    "Đây là yêu cầu khẩu vị cá nhân, không phải tuyên bố tôn giáo.",
    "This is a personal dietary preference, not a religious claim.",
  ],
  ["ขออาหารที่ไม่มีหมูเลย", "khǎw aa-hǎan thîi mâi mii mǔu ləəi", "Cho món hoàn toàn không có heo.", "A dish with no pork at all, please."],
  ["ใช้เนื้อไก่หรือเนื้อวัวแทนได้ไหมครับ/คะ", "chái nʉ́a gài rʉ̌ʉ nʉ́a wua thaen dâi mǎi khráp/khá", "Dùng thịt gà hoặc bò thay được không?", "Can you use chicken or beef instead?"],
  ["ไม่ใส่น้ำมันหมู", "mâi sài náam-man mǔu", "Không dùng mỡ heo.", "No lard, please."],
  ["ปรุงด้วยภาชนะที่ไม่ปนหมูได้ไหมครับ/คะ", "prung dûay phaa-chá-ná thîi mâi pon mǔu dâi mǎi khráp/khá", "Nấu bằng dụng cụ không lẫn heo được không?", "Can you cook with utensils not mixed with pork?"],
  [
    "ผม/ฉันไม่กินหมูและไม่ดื่มแอลกอฮอล์",
    "phǒm/chǎn mâi gin mǔu láe mâi dʉ̀ʉm aen-gaw-haw",
    "Tôi không ăn thịt heo và không uống cồn.",
    "I don't eat pork or drink alcohol.",
    "Giữ trung lập — nói về chế độ ăn, không nói lý do tôn giáo.",
    "Keep it neutral — state the diet, not a religious reason.",
  ],
];

const NO_PORK: Entry[] = [
  ["ไม่ใส่หมู", "mâi sài mǔu", "Không cho thịt heo.", "No pork, please."],
  ["อันนี้มีหมูไหมครับ/คะ", "an-níi mii mǔu mǎi khráp/khá", "Món này có thịt heo không?", "Does this have pork?"],
  ["ผม/ฉันไม่กินหมู", "phǒm/chǎn mâi gin mǔu", "Tôi không ăn thịt heo.", "I don't eat pork."],
  [
    "มีน้ำซุปที่ไม่ใช้กระดูกหมูไหมครับ/คะ",
    "mii náam-súp thîi mâi chái grà-dùuk mǔu mǎi khráp/khá",
    "Có nước dùng không hầm xương heo không?",
    "Is there a broth not made with pork bones?",
    "Nhiều nước dùng (ก๋วยเตี๋ยว) hầm xương heo.",
    "Many noodle broths are simmered with pork bones.",
  ],
  ["ไส้กรอกนี้เป็นหมูหรือไก่ครับ/คะ", "sâi-gràwk níi pen mǔu rʉ̌ʉ gài khráp/khá", "Xúc xích này là heo hay gà?", "Is this sausage pork or chicken?"],
  ["เปลี่ยนเป็นเนื้อไก่ได้ไหมครับ/คะ", "plìan pen nʉ́a gài dâi mǎi khráp/khá", "Đổi sang thịt gà được không?", "Can you switch it to chicken?"],
];

const NO_SEAFOOD: Entry[] = [
  ["ไม่ใส่อาหารทะเล", "mâi sài aa-hǎan thá-lee", "Không cho hải sản.", "No seafood, please."],
  ["ผม/ฉันแพ้กุ้ง", "phǒm/chǎn pháe gûng", "Tôi dị ứng tôm.", "I'm allergic to shrimp."],
  ["ไม่ใส่กุ้ง ปู ปลาหมึก", "mâi sài gûng puu plaa-mʉ̀k", "Không tôm, cua, mực.", "No shrimp, crab, or squid."],
  [
    "มีกะปิหรือน้ำปลาในนี้ไหมครับ/คะ",
    "mii gà-pì rʉ̌ʉ náam-plaa nai níi mǎi khráp/khá",
    "Có mắm tôm hay nước mắm trong này không?",
    "Is there shrimp paste or fish sauce in this?",
    "Gะปิ (mắm tôm) rất phổ biến trong sốt và cà ri Thái.",
    "Shrimp paste (กะปิ) is common in Thai sauces and curries.",
  ],
  ["ซอสนี้มีหอยไหมครับ/คะ", "sáwt níi mii hǎwi mǎi khráp/khá", "Nước sốt này có sò/hàu không?", "Does this sauce contain oyster/shellfish?"],
  ["ขออาหารที่ไม่มีอาหารทะเลเลย", "khǎw aa-hǎan thîi mâi mii aa-hǎan thá-lee ləəi", "Cho món hoàn toàn không có hải sản.", "A dish completely free of seafood, please."],
];

const SPICY_LEVEL: Entry[] = [
  ["ไม่เผ็ด", "mâi phèt", "Không cay.", "Not spicy."],
  ["เผ็ดน้อย", "phèt nói", "Cay ít.", "Mild / a little spicy."],
  ["เผ็ดปานกลาง", "phèt paan-glaang", "Cay vừa.", "Medium spicy."],
  ["เผ็ดมาก", "phèt mâak", "Cay nhiều.", "Very spicy."],
  ["ไม่ใส่พริก", "mâi sài phrík", "Không cho ớt.", "No chili, please."],
  ["เด็กกินได้ไหมครับ/คะ", "dèk gin dâi mǎi khráp/khá", "Trẻ em ăn được không (có cay không)?", "Is it okay for children (is it spicy)?"],
  [
    "ขอพริกแยกต่างหาก",
    "khǎw phrík yâek tàang-hàak",
    "Cho ớt để riêng.",
    "Chili on the side, please.",
    "Cách an toàn: tự thêm cay theo ý.",
    "Safest option — add your own spice to taste.",
  ],
];

const INGREDIENTS: Entry[] = [
  ["อันนี้มีส่วนผสมอะไรบ้างครับ/คะ", "an-níi mii sùan-phà-sǒm à-rai bâang khráp/khá", "Món này có thành phần gì?", "What's in this dish?"],
  ["ใส่ถั่วไหมครับ/คะ", "sài thùa mǎi khráp/khá", "Có cho đậu phộng không?", "Does it contain peanuts?"],
  ["มีนมหรือเนยไหมครับ/คะ", "mii nom rʉ̌ʉ nəəi mǎi khráp/khá", "Có sữa hoặc bơ không?", "Is there milk or butter?"],
  ["ใช้ผงชูรสไหมครับ/คะ", "chái phǒng-chuu-rót mǎi khráp/khá", "Có dùng bột ngọt (MSG) không?", "Does it use MSG?"],
  ["มีกลูเตนไหมครับ/คะ", "mii gluu-ten mǎi khráp/khá", "Có gluten không?", "Does it contain gluten?"],
  ["ทำจากอะไรครับ/คะ", "tham jàak à-rai khráp/khá", "Làm từ gì?", "What is it made from?"],
  ["เผ็ดด้วยพริกหรือพริกไทยครับ/คะ", "phèt dûay phrík rʉ̌ʉ phrík-thai khráp/khá", "Cay bằng ớt hay tiêu?", "Is the heat from chili or pepper?"],
];

const CONTAMINATION_WARNING: Entry[] = [
  ["กรุณาใช้เขียงและมีดที่สะอาด", "gà-rú-naa chái khǐang láe mîit thîi sà-àat", "Vui lòng dùng thớt và dao sạch.", "Please use a clean cutting board and knife."],
  ["อย่าให้ปนกับถั่ว", "yàa hâi pon gàp thùa", "Đừng để lẫn với đậu phộng.", "Don't let it mix with peanuts."],
  [
    "ผม/ฉันแพ้แม้แต่นิดเดียว",
    "phǒm/chǎn pháe máe-tâe nít diao",
    "Tôi dị ứng dù chỉ một chút.",
    "I react even to a tiny amount.",
    "Nói rõ để bếp tránh nhiễm chéo.",
    "Say this so the kitchen avoids cross-contamination.",
  ],
  ["ทอดในน้ำมันที่ไม่ทอดอาหารทะเลได้ไหมครับ/คะ", "thâwt nai náam-man thîi mâi thâwt aa-hǎan thá-lee dâi mǎi khráp/khá", "Chiên bằng dầu không chiên hải sản được không?", "Can you fry it in oil not used for seafood?"],
  ["ใช้กระทะแยกได้ไหมครับ/คะ", "chái grà-thá yâek dâi mǎi khráp/khá", "Dùng chảo riêng được không?", "Can you use a separate pan?"],
  ["ถ้าไม่แน่ใจ ขอไม่ใส่", "thâa mâi nâe-jai khǎw mâi sài", "Nếu không chắc thì xin đừng cho.", "If you're not sure, please leave it out."],
];

const EMERGENCY_PHRASE: Entry[] = [
  [
    "ผม/ฉันแพ้อาหาร ช่วยด้วย",
    "phǒm/chǎn pháe aa-hǎan, chûay dûay",
    "Tôi bị dị ứng thức ăn, cứu với!",
    "I'm having a food allergic reaction — help!",
    "Gọi 1669 nếu triệu chứng nặng.",
    "Call 1669 if symptoms are severe.",
  ],
  ["ช่วยโทรเรียกรถพยาบาล 1669", "chûay toh rîak rót phá-yaa-baan nʉ̀ng-hòk-hòk-gâo", "Gọi xe cấp cứu 1669 giúp.", "Please call an ambulance — 1669."],
  ["ผม/ฉันหายใจลำบาก", "phǒm/chǎn hǎai-jai lam-bàak", "Tôi khó thở.", "I'm having trouble breathing."],
  [
    "ผม/ฉันมียาฉีดแก้แพ้ในกระเป๋า",
    "phǒm/chǎn mii yaa chìit gâe-pháe nai grà-pǎo",
    "Tôi có bút tiêm chống dị ứng trong túi.",
    "I have an epinephrine injector in my bag.",
    "Chỉ rõ vị trí để người khác lấy giúp khi cần.",
    "Point to where it is so someone can grab it if needed.",
  ],
  ["ผม/ฉันรู้สึกจะเป็นลม", "phǒm/chǎn rúu-sʉ̀k jà pen lom", "Tôi thấy sắp ngất.", "I feel faint."],
  ["ผม/ฉันกินของที่แพ้เข้าไป", "phǒm/chǎn gin khǎwng thîi pháe khâo-pai", "Tôi đã ăn nhầm thứ bị dị ứng.", "I ate something I'm allergic to."],
];

const RESTAURANT_CLARIFICATION: Entry[] = [
  ["ช่วยอ่านส่วนผสมให้หน่อยครับ/ค่ะ", "chûay àan sùan-phà-sǒm hâi nòi khráp/khâ", "Đọc thành phần giúp tôi.", "Please read me the ingredients."],
  ["เมนูไหนไม่มีถั่วบ้างครับ/คะ", "mee-nuu nǎi mâi mii thùa bâang khráp/khá", "Món nào không có đậu phộng?", "Which dishes have no peanuts?"],
  ["ช่วยถามพ่อครัวให้หน่อยครับ/ค่ะ", "chûay thǎam phâw-khrua hâi nòi khráp/khâ", "Hỏi đầu bếp giúp tôi.", "Could you ask the chef, please?"],
  [
    "ผม/ฉันแพ้จริงๆ ไม่ใช่แค่ไม่ชอบ",
    "phǒm/chǎn pháe jing-jing, mâi châi khâe mâi châwp",
    "Tôi dị ứng thật, không phải chỉ không thích.",
    "It's a real allergy, not just a dislike.",
    "Quan trọng — để bếp xử lý nghiêm túc.",
    "Important — so the kitchen takes it seriously.",
  ],
  ["ขอดูฉลากได้ไหมครับ/คะ", "khǎw duu chà-làak dâi mǎi khráp/khá", "Cho xem nhãn được không?", "Can I see the label?"],
  ["ถ้ามีส่วนผสมนี้ ผม/ฉันขอเปลี่ยนเมนู", "thâa mii sùan-phà-sǒm níi, phǒm/chǎn khǎw plìan mee-nuu", "Nếu có thành phần này, tôi xin đổi món.", "If it contains this, I'll change my order."],
];

// ── Assembled pack ───────────────────────────────────────────────────────

export const thaiFoodAllergyDining: ThaiDiningItem[] = [
  ...build("allergy", ALLERGY),
  ...build("vegetarian", VEGETARIAN),
  ...build("halal_style", HALAL_STYLE),
  ...build("no_pork", NO_PORK),
  ...build("no_seafood", NO_SEAFOOD),
  ...build("spicy_level", SPICY_LEVEL),
  ...build("ingredients", INGREDIENTS),
  ...build("contamination_warning", CONTAMINATION_WARNING),
  ...build("emergency_phrase", EMERGENCY_PHRASE),
  ...build("restaurant_clarification", RESTAURANT_CLARIFICATION),
];

/** Topics covered by the pack (for filtered dining-safety screens). */
export const THAI_DINING_TOPICS: ThaiDiningTopic[] = [
  "allergy",
  "vegetarian",
  "halal_style",
  "no_pork",
  "no_seafood",
  "spicy_level",
  "ingredients",
  "contamination_warning",
  "emergency_phrase",
  "restaurant_clarification",
];

export default thaiFoodAllergyDining;
