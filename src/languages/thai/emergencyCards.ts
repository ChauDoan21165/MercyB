// src/languages/thai/emergencyCards.ts
//
// Thai EMERGENCY CARDS — quick-use "show this phrase" data (Wave 3).
//
// PURE DATA. These are language-support cards a traveller/newcomer can
// open and SHOW to a Thai local in a crisis. Each card carries:
//   • th        — the Thai phrase (what you'd say)
//   • rtgs      — romanization with light tone cues
//   • vi / en   — Vietnamese + English meaning
//   • show_text — the big "show this to a local" Thai line for the screen
//
// SCOPE: language support ONLY. These cards do NOT give legal or medical
// advice — they help a non-Thai-speaker be understood and reach the right
// help (191 police, 1669 medical/ambulance, 199 fire, 1155 tourist police).
//
// Audience: Vietnamese-speaking learners first, English second.
//
// Native review DEFERRED: romanization/tone marks are a readable
// approximation, not a linguist-verified transcription. Do not advertise
// as native-reviewed.

// ── Types ────────────────────────────────────────────────────────────────

export type ThaiEmergencyTopic =
  | "medical_emergency"
  | "allergy"
  | "lost_passport"
  | "police_help"
  | "accident"
  | "lost_child"
  | "domestic_danger"
  | "cannot_speak_thai"
  | "need_interpreter"
  | "call_embassy"
  | "address_taxi"
  | "urgent_pharmacy";

export type ThaiEmergencyCard = {
  /** Stable unique id, e.g. "thai-emerg-001". */
  id: string;
  topic: ThaiEmergencyTopic;
  /** The Thai phrase (what you say). */
  th: string;
  /** Romanization with light tone cues. */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** Full Thai line to SHOW on-screen to a local in the moment. */
  show_text: string;
  /** Optional Vietnamese usage note. */
  note_vi?: string;
  /** Optional English usage note. */
  note_en?: string;
};

// ── Source tuple + builder (pure data transform) ─────────────────────────

/** [th, rtgs, vi, en, show_text, note_vi?, note_en?] */
type Entry = readonly [
  th: string,
  rtgs: string,
  vi: string,
  en: string,
  show_text: string,
  note_vi?: string,
  note_en?: string,
];

let CARD_SEQ = 0;

function build(topic: ThaiEmergencyTopic, entries: readonly Entry[]): ThaiEmergencyCard[] {
  return entries.map((e) => {
    const [th, rtgs, vi, en, show_text, note_vi, note_en] = e;
    CARD_SEQ += 1;
    const card: ThaiEmergencyCard = {
      id: `thai-emerg-${String(CARD_SEQ).padStart(3, "0")}`,
      topic,
      th,
      rtgs,
      vi,
      en,
      show_text,
    };
    if (note_vi) card.note_vi = note_vi;
    if (note_en) card.note_en = note_en;
    return card;
  });
}

// ── Source data ──────────────────────────────────────────────────────────

const MEDICAL: Entry[] = [
  [
    "ช่วยด้วย ผม/ฉันต้องการหมอด่วน",
    "chûay dûay, phǒm/chǎn tâwng-gaan mǎw dùan",
    "Cứu với, tôi cần bác sĩ gấp.",
    "Help, I need a doctor urgently.",
    "ช่วยด้วยครับ/ค่ะ ผม/ฉันต้องการหมอด่วน กรุณาโทร 1669 ให้ด้วย",
  ],
  [
    "มีคนหมดสติ ไม่หายใจ",
    "mii khon mòt sà-tì, mâi hǎai-jai",
    "Có người bất tỉnh, không thở.",
    "Someone is unconscious and not breathing.",
    "มีคนหมดสติและไม่หายใจ กรุณาโทรเรียกรถพยาบาล 1669 ด่วน",
  ],
  [
    "ผม/ฉันเจ็บหน้าอกมาก",
    "phǒm/chǎn jèp nâa-òk mâak",
    "Tôi đau ngực dữ dội.",
    "I have severe chest pain.",
    "ผม/ฉันเจ็บหน้าอกมากและหายใจลำบาก ช่วยพาไปโรงพยาบาลด่วน",
  ],
  [
    "ช่วยโทรเรียกรถพยาบาล 1669",
    "chûay toh rîak rót phá-yaa-baan nʉ̀ng-hòk-hòk-gâo",
    "Gọi xe cấp cứu 1669 giúp tôi.",
    "Please call an ambulance — 1669.",
    "กรุณาโทรเรียกรถพยาบาลที่เบอร์ 1669 ให้ด้วยครับ/ค่ะ",
    "1669 là số cấp cứu y tế toàn Thái Lan.",
    "1669 is Thailand's nationwide medical emergency line.",
  ],
];

const ALLERGY: Entry[] = [
  [
    "ผม/ฉันแพ้อาหารทะเลรุนแรง",
    "phǒm/chǎn pháe aa-hǎan thá-lee run-raeng",
    "Tôi dị ứng hải sản nặng.",
    "I have a severe seafood allergy.",
    "ผม/ฉันแพ้อาหารทะเลรุนแรง ห้ามใส่กุ้ง ปู ปลาหมึก หรือน้ำปลาในอาหารของผม/ฉัน",
  ],
  [
    "ผม/ฉันแพ้ถั่ว อาจช็อกได้",
    "phǒm/chǎn pháe thùa, àat chók dâai",
    "Tôi dị ứng đậu phộng, có thể bị sốc.",
    "I'm allergic to peanuts — it can cause shock.",
    "ผม/ฉันแพ้ถั่วอย่างรุนแรง ถ้ากินเข้าไปอาจช็อกและเป็นอันตรายถึงชีวิต",
  ],
  [
    "ผม/ฉันแพ้ยาเพนิซิลลิน",
    "phǒm/chǎn pháe yaa phen-ní-sin-lin",
    "Tôi dị ứng thuốc penicillin.",
    "I'm allergic to penicillin.",
    "ผม/ฉันแพ้ยาเพนิซิลลิน กรุณาแจ้งหมอและพยาบาลก่อนให้ยา",
    "Báo trước khi được tiêm/uống bất kỳ thuốc nào.",
    "Say this before being given any medication.",
  ],
  [
    "ผม/ฉันมียาฉีดแก้แพ้ในกระเป๋า",
    "phǒm/chǎn mii yaa chìit gâe-pháe nai grà-pǎo",
    "Tôi có bút tiêm chống dị ứng trong túi.",
    "I have an epinephrine auto-injector in my bag.",
    "ผม/ฉันมียาฉีดอะดรีนาลีน (EpiPen) อยู่ในกระเป๋า ถ้าผม/ฉันหมดสติ กรุณาใช้และโทร 1669",
  ],
];

const LOST_PASSPORT: Entry[] = [
  [
    "หนังสือเดินทางของผม/ฉันหาย",
    "nǎng-sʉ̌ʉ dəən-thaang khǎwng phǒm/chǎn hǎai",
    "Hộ chiếu của tôi bị mất.",
    "My passport is lost.",
    "หนังสือเดินทางของผม/ฉันหาย ผม/ฉันต้องไปแจ้งความที่สถานีตำรวจ ช่วยบอกทางหน่อย",
  ],
  [
    "ผม/ฉันต้องติดต่อสถานทูต",
    "phǒm/chǎn tâwng tìt-tàw sà-thǎan-thûut",
    "Tôi cần liên hệ đại sứ quán.",
    "I need to contact my embassy.",
    "ผม/ฉันทำหนังสือเดินทางหาย และต้องติดต่อสถานทูตเวียดนาม ช่วยด้วยครับ/ค่ะ",
  ],
  [
    "นี่คือสำเนาหนังสือเดินทางของผม/ฉัน",
    "nîi khʉʉ sǎm-nao nǎng-sʉ̌ʉ dəən-thaang khǎwng phǒm/chǎn",
    "Đây là bản sao hộ chiếu của tôi.",
    "This is a copy of my passport.",
    "นี่คือสำเนาหนังสือเดินทางของผม/ฉัน ใช้ยืนยันตัวตนได้",
    "Luôn lưu sẵn ảnh hộ chiếu trên điện thoại và email.",
    "Keep a passport photo saved on your phone and email.",
  ],
  [
    "ผม/ฉันมีใบแจ้งความแล้ว",
    "phǒm/chǎn mii bai jâeng khwaam láeo",
    "Tôi đã có giấy biên bản rồi.",
    "I already have the police report.",
    "ผม/ฉันแจ้งความเรื่องหนังสือเดินทางหายแล้ว นี่คือใบแจ้งความสำหรับติดต่อสถานทูต",
  ],
];

const POLICE_HELP: Entry[] = [
  [
    "ช่วยเรียกตำรวจ โทร 191",
    "chûay rîak tam-rùat, toh nʉ̀ng-gâo-èt",
    "Gọi cảnh sát giúp — số 191.",
    "Please call the police — 191.",
    "กรุณาโทรเรียกตำรวจที่เบอร์ 191 ให้ด้วยครับ/ค่ะ",
    "191 là số cảnh sát; 1155 là cảnh sát du lịch (nói tiếng Anh).",
    "191 is police; 1155 is the English-speaking tourist police.",
  ],
  [
    "ผม/ฉันโดนปล้น",
    "phǒm/chǎn dohn plôn",
    "Tôi bị cướp.",
    "I've been robbed.",
    "ผม/ฉันเพิ่งโดนปล้น ช่วยเรียกตำรวจและช่วยผม/ฉันด้วย",
  ],
  [
    "มีคนทำร้ายผม/ฉัน",
    "mii khon tham-ráai phǒm/chǎn",
    "Có người hành hung tôi.",
    "Someone is attacking me.",
    "มีคนทำร้ายผม/ฉัน กรุณาโทรเรียกตำรวจ 191 ด่วน",
  ],
  [
    "ผม/ฉันขอแจ้งความ",
    "phǒm/chǎn khǎw jâeng khwaam",
    "Tôi muốn trình báo.",
    "I want to file a police report.",
    "ผม/ฉันขอแจ้งความและขอใบแจ้งความเพื่อใช้กับประกันและสถานทูต",
  ],
];

const ACCIDENT: Entry[] = [
  [
    "เกิดอุบัติเหตุ มีคนเจ็บ",
    "gèrt ù-bàt-tì-hèet, mii khon jèp",
    "Có tai nạn, có người bị thương.",
    "There's been an accident, someone is hurt.",
    "เกิดอุบัติเหตุและมีคนบาดเจ็บ กรุณาโทร 1669 เรียกรถพยาบาลด่วน",
  ],
  [
    "มีคนถูกรถชน",
    "mii khon thùuk rót chon",
    "Có người bị xe tông.",
    "Someone has been hit by a car.",
    "มีคนถูกรถชนและบาดเจ็บ ช่วยโทรเรียกรถพยาบาลและตำรวจด้วย",
  ],
  [
    "มีคนเลือดออกมาก",
    "mii khon lʉ̂at àwk mâak",
    "Có người chảy nhiều máu.",
    "Someone is bleeding heavily.",
    "มีคนบาดเจ็บและเลือดออกมาก ต้องการรถพยาบาลด่วนที่สุด",
  ],
  [
    "อย่าขยับผู้บาดเจ็บ รอรถพยาบาล",
    "yàa khà-yàp phûu bàat-jèp, raw rót phá-yaa-baan",
    "Đừng di chuyển người bị thương, chờ xe cấp cứu.",
    "Don't move the injured person, wait for the ambulance.",
    "กรุณาอย่าขยับผู้บาดเจ็บ รอรถพยาบาลมาก่อน",
  ],
];

const LOST_CHILD: Entry[] = [
  [
    "ลูกของผม/ฉันหาย ช่วยด้วย",
    "lûuk khǎwng phǒm/chǎn hǎai, chûay dûay",
    "Con tôi bị lạc, cứu với.",
    "My child is lost, please help.",
    "ลูกของผม/ฉันหาย ช่วยตามหาและแจ้งเจ้าหน้าที่ด้วยด่วน",
  ],
  [
    "เด็กคนนี้หลงทาง",
    "dèk khon níi lǒng thaang",
    "Đứa trẻ này bị lạc.",
    "This child is lost.",
    "เด็กคนนี้หลงทาง ช่วยตามหาพ่อแม่หรือแจ้งเจ้าหน้าที่ด้วย",
  ],
  [
    "ลูกผม/ฉันชื่อ ... อายุ ... ขวบ",
    "lûuk phǒm/chǎn chʉ̂ʉ ... aa-yú ... khùap",
    "Con tôi tên là ..., ... tuổi.",
    "My child's name is ..., age ... .",
    "ลูกผม/ฉันชื่อ ... อายุ ... ขวบ ใส่เสื้อสี ... กรุณาช่วยตามหา",
    "Điền tên, tuổi, màu áo của bé.",
    "Fill in the child's name, age, and shirt colour.",
  ],
  [
    "ช่วยประกาศตามหาเด็กหน่อย",
    "chûay prà-gàat taam-hǎa dèk nòi",
    "Làm ơn phát loa tìm trẻ giúp.",
    "Please make an announcement to find the child.",
    "กรุณาประกาศตามหาเด็กผ่านเครื่องเสียงของที่นี่ด้วยครับ/ค่ะ",
  ],
];

const DOMESTIC_DANGER: Entry[] = [
  [
    "ผม/ฉันไม่ปลอดภัย ช่วยด้วย",
    "phǒm/chǎn mâi plàwt-phai, chûay dûay",
    "Tôi không an toàn, cứu với.",
    "I am not safe, please help.",
    "ผม/ฉันไม่ปลอดภัยและต้องการความช่วยเหลือ กรุณาโทรหาตำรวจ 191",
  ],
  [
    "มีคนทำร้ายผม/ฉันที่บ้าน",
    "mii khon tham-ráai phǒm/chǎn thîi bâan",
    "Có người hành hung tôi ở nhà.",
    "Someone is hurting me at home.",
    "มีคนทำร้ายผม/ฉันที่บ้าน ผม/ฉันตกอยู่ในอันตราย กรุณาโทรเรียกตำรวจด่วน",
  ],
  [
    "ช่วยพาผม/ฉันไปที่ปลอดภัย",
    "chûay phaa phǒm/chǎn pai thîi plàwt-phai",
    "Đưa tôi tới nơi an toàn giúp.",
    "Please take me somewhere safe.",
    "กรุณาช่วยพาผม/ฉันไปที่ปลอดภัยและอยู่กับผม/ฉันจนกว่าตำรวจจะมา",
  ],
  [
    "ผม/ฉันตกอยู่ในอันตราย",
    "phǒm/chǎn tòk yùu nai an-ta-raai",
    "Tôi đang gặp nguy hiểm.",
    "I am in danger.",
    "ผม/ฉันตกอยู่ในอันตราย กรุณาโทรหาตำรวจ 191 ทันที",
    "Số đường dây nóng chống bạo lực gia đình: 1300.",
    "Thailand's social-help / domestic-violence hotline is 1300.",
  ],
];

const CANNOT_SPEAK_THAI: Entry[] = [
  [
    "ผม/ฉันพูดไทยไม่ได้",
    "phǒm/chǎn phûut thai mâi dâai",
    "Tôi không nói được tiếng Thái.",
    "I can't speak Thai.",
    "ผม/ฉันพูดไทยไม่ได้ พูดได้แค่ภาษาเวียดนามและอังกฤษ",
  ],
  [
    "กรุณาเขียนหรือใช้แอปแปลภาษา",
    "gà-rú-naa khǐan rʉ̌ʉ chái áep plae phaa-sǎa",
    "Vui lòng viết ra hoặc dùng app dịch.",
    "Please write it down or use a translation app.",
    "กรุณาเขียนลงกระดาษ หรือใช้แอปแปลภาษาเพื่อคุยกับผม/ฉัน",
  ],
  [
    "ผม/ฉันไม่เข้าใจ ช่วยพูดช้าๆ",
    "phǒm/chǎn mâi khâo-jai, chûay phûut cháa-cháa",
    "Tôi không hiểu, nói chậm lại giúp.",
    "I don't understand, please speak slowly.",
    "ผม/ฉันไม่เข้าใจภาษาไทย กรุณาพูดช้าๆ หรือหาคนที่พูดอังกฤษได้",
  ],
];

const NEED_INTERPRETER: Entry[] = [
  [
    "ผม/ฉันต้องการล่าม",
    "phǒm/chǎn tâwng-gaan lâam",
    "Tôi cần người phiên dịch.",
    "I need an interpreter.",
    "ผม/ฉันต้องการล่ามภาษาเวียดนามหรืออังกฤษ กรุณาช่วยติดต่อให้ด้วย",
  ],
  [
    "มีใครพูดภาษาเวียดนามหรืออังกฤษไหม",
    "mii khrai phûut phaa-sǎa wîat-naam rʉ̌ʉ ang-grìt mǎi",
    "Có ai nói tiếng Việt hoặc tiếng Anh không?",
    "Does anyone speak Vietnamese or English?",
    "มีใครที่นี่พูดภาษาเวียดนามหรือภาษาอังกฤษได้บ้างไหมครับ/คะ",
  ],
  [
    "กรุณาโทรหาล่ามภาษาเวียดนาม",
    "gà-rú-naa toh hǎa lâam phaa-sǎa wîat-naam",
    "Vui lòng gọi phiên dịch tiếng Việt.",
    "Please call a Vietnamese interpreter.",
    "กรุณาโทรหาล่ามภาษาเวียดนาม หรือติดต่อสถานทูตเวียดนามเพื่อช่วยแปล",
  ],
];

const CALL_EMBASSY: Entry[] = [
  [
    "กรุณาโทรหาสถานทูตเวียดนาม",
    "gà-rú-naa toh hǎa sà-thǎan-thûut wîat-naam",
    "Vui lòng gọi đại sứ quán Việt Nam.",
    "Please call the Vietnamese embassy.",
    "ผม/ฉันเป็นคนเวียดนาม กรุณาช่วยโทรหาสถานทูตเวียดนามในกรุงเทพฯ ให้ด้วย",
  ],
  [
    "ผม/ฉันเป็นคนเวียดนาม ต้องติดต่อสถานทูต",
    "phǒm/chǎn pen khon wîat-naam, tâwng tìt-tàw sà-thǎan-thûut",
    "Tôi là người Việt Nam, cần liên hệ đại sứ quán.",
    "I'm Vietnamese and need to contact my embassy.",
    "ผม/ฉันเป็นพลเมืองเวียดนามและต้องการความช่วยเหลือจากสถานทูตเวียดนาม",
  ],
  [
    "ผม/ฉันต้องการความช่วยเหลือจากสถานทูต",
    "phǒm/chǎn tâwng-gaan khwaam chûay-lʉ̌a jàak sà-thǎan-thûut",
    "Tôi cần sự trợ giúp từ đại sứ quán.",
    "I need consular assistance from my embassy.",
    "ผม/ฉันต้องการความช่วยเหลือด้านกงสุลจากสถานทูตเวียดนามอย่างเร่งด่วน",
    "Lưu sẵn số đại sứ quán VN tại Bangkok trong điện thoại.",
    "Save the Vietnamese Embassy (Bangkok) number in your phone in advance.",
  ],
];

const ADDRESS_TAXI: Entry[] = [
  [
    "กรุณาพาผม/ฉันไปที่อยู่นี้",
    "gà-rú-naa phaa phǒm/chǎn pai thîi-yùu níi",
    "Vui lòng đưa tôi tới địa chỉ này.",
    "Please take me to this address.",
    "กรุณาพาผม/ฉันไปที่อยู่นี้ (แสดงที่อยู่บนหน้าจอ) เปิดมิเตอร์ด้วยครับ/ค่ะ",
    "Hiện địa chỉ tiếng Thái từ Google Maps cho tài xế xem.",
    "Show the Thai address from Google Maps to the driver.",
  ],
  [
    "พาผม/ฉันไปโรงพยาบาลที่ใกล้ที่สุด",
    "phaa phǒm/chǎn pai rohng-phá-yaa-baan thîi glâi thîi-sùt",
    "Đưa tôi tới bệnh viện gần nhất.",
    "Take me to the nearest hospital.",
    "ฉุกเฉิน! กรุณาพาผม/ฉันไปโรงพยาบาลที่ใกล้ที่สุดเดี๋ยวนี้",
  ],
  [
    "พาผม/ฉันไปสถานีตำรวจ",
    "phaa phǒm/chǎn pai sà-thǎa-nii tam-rùat",
    "Đưa tôi tới đồn cảnh sát.",
    "Take me to the police station.",
    "กรุณาพาผม/ฉันไปสถานีตำรวจที่ใกล้ที่สุดด้วยครับ/ค่ะ",
  ],
  [
    "นี่คือที่อยู่โรงแรมของผม/ฉัน",
    "nîi khʉʉ thîi-yùu rohng-raem khǎwng phǒm/chǎn",
    "Đây là địa chỉ khách sạn của tôi.",
    "This is my hotel address.",
    "นี่คือที่อยู่โรงแรมของผม/ฉัน กรุณาพาไปส่งที่นี่",
  ],
];

const URGENT_PHARMACY: Entry[] = [
  [
    "ผม/ฉันต้องการยาด่วน",
    "phǒm/chǎn tâwng-gaan yaa dùan",
    "Tôi cần thuốc gấp.",
    "I need medicine urgently.",
    "ผม/ฉันต้องการยาด่วน ร้านขายยาที่ใกล้ที่สุดอยู่ที่ไหนครับ/คะ",
  ],
  [
    "ร้านขายยาที่ใกล้ที่สุดอยู่ที่ไหน",
    "ráan khǎai yaa thîi glâi thîi-sùt yùu thîi-nǎi",
    "Hiệu thuốc gần nhất ở đâu?",
    "Where is the nearest pharmacy?",
    "ร้านขายยาที่เปิดอยู่ตอนนี้ ใกล้ที่สุดอยู่ที่ไหนครับ/คะ",
  ],
  [
    "ผม/ฉันต้องการยาประจำตัว นี่คือใบสั่งยา",
    "phǒm/chǎn tâwng-gaan yaa prà-jam-tua, nîi khʉʉ bai sàng yaa",
    "Tôi cần thuốc thường dùng, đây là toa thuốc.",
    "I need my regular medication — here is my prescription.",
    "ผม/ฉันต้องการยาประจำตัวตามใบสั่งยานี้ ช่วยจัดให้ด้วยครับ/ค่ะ",
  ],
  [
    "ผม/ฉันเป็นเบาหวาน ต้องการอินซูลิน",
    "phǒm/chǎn pen bao-wǎan, tâwng-gaan in-suu-lin",
    "Tôi bị tiểu đường, cần insulin.",
    "I'm diabetic and need insulin.",
    "ผม/ฉันเป็นเบาหวานและต้องการอินซูลินด่วน นี่คือชนิดที่ผม/ฉันใช้",
  ],
];

// ── Assembled deck ───────────────────────────────────────────────────────

export const thaiEmergencyCards: ThaiEmergencyCard[] = [
  ...build("medical_emergency", MEDICAL),
  ...build("allergy", ALLERGY),
  ...build("lost_passport", LOST_PASSPORT),
  ...build("police_help", POLICE_HELP),
  ...build("accident", ACCIDENT),
  ...build("lost_child", LOST_CHILD),
  ...build("domestic_danger", DOMESTIC_DANGER),
  ...build("cannot_speak_thai", CANNOT_SPEAK_THAI),
  ...build("need_interpreter", NEED_INTERPRETER),
  ...build("call_embassy", CALL_EMBASSY),
  ...build("address_taxi", ADDRESS_TAXI),
  ...build("urgent_pharmacy", URGENT_PHARMACY),
];

/** Topics covered by the deck (for filtered crisis screens). */
export const THAI_EMERGENCY_TOPICS: ThaiEmergencyTopic[] = [
  "medical_emergency",
  "allergy",
  "lost_passport",
  "police_help",
  "accident",
  "lost_child",
  "domestic_danger",
  "cannot_speak_thai",
  "need_interpreter",
  "call_embassy",
  "address_taxi",
  "urgent_pharmacy",
];

export default thaiEmergencyCards;
