// src/languages/thai/medicalPharmacy.ts
//
// Thai MEDICAL / PHARMACY language pack (Wave 5).
//
// PURE DATA. Language support ONLY — these items help a non-Thai-speaker
// describe what's wrong and be understood at a clinic, hospital desk, or
// pharmacy. They are NOT medical advice: no diagnoses, no dosages to
// follow, no treatment recommendations. The dosage items are QUESTIONS to
// ASK a pharmacist/doctor, never instructions to act on.
//
// Audience: Vietnamese-speaking learners first, English second. Every item
// carries Thai script + romanization + a Vietnamese meaning + an English
// meaning, with optional usage notes.
//
// In a real emergency, route to professionals: 1669 (medical/ambulance),
// 191 (police), 1155 (tourist police, English-speaking).
//
// Items are assembled from compact tuples by the pure `build()` transform.
//
// Native review DEFERRED: romanization/tone marks are a readable
// approximation, not a linguist-verified transcription. Not native-reviewed.

// ── Types ────────────────────────────────────────────────────────────────

export type ThaiMedicalTopic =
  | "symptoms"
  | "pain"
  | "allergy"
  | "medicine"
  | "dosage"
  | "emergency"
  | "appointment"
  | "insurance"
  | "hospital_desk"
  | "pharmacy"
  | "cannot_understand"
  | "need_interpreter";

export type ThaiMedicalItem = {
  /** Stable unique id, e.g. "thai-med-001". */
  id: string;
  topic: ThaiMedicalTopic;
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

function build(topic: ThaiMedicalTopic, entries: readonly Entry[]): ThaiMedicalItem[] {
  return entries.map((e) => {
    const [th, rtgs, vi, en, note_vi, note_en] = e;
    ITEM_SEQ += 1;
    const item: ThaiMedicalItem = {
      id: `thai-med-${String(ITEM_SEQ).padStart(3, "0")}`,
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

const SYMPTOMS: Entry[] = [
  ["ผม/ฉันมีไข้", "phǒm/chǎn mii khâi", "Tôi bị sốt.", "I have a fever."],
  ["ผม/ฉันไอ", "phǒm/chǎn ai", "Tôi bị ho.", "I have a cough."],
  ["ผม/ฉันเป็นหวัด", "phǒm/chǎn pen wàt", "Tôi bị cảm.", "I have a cold."],
  ["ผม/ฉันคลื่นไส้", "phǒm/chǎn khlʉ̂ʉn-sâi", "Tôi buồn nôn.", "I feel nauseous."],
  ["ผม/ฉันท้องเสีย", "phǒm/chǎn tháwng-sǐa", "Tôi bị tiêu chảy.", "I have diarrhea."],
  [
    "ผม/ฉันเวียนหัว",
    "phǒm/chǎn wian hǔa",
    "Tôi chóng mặt.",
    "I feel dizzy.",
    "Thêm 'มาตั้งแต่...' để nói bị từ khi nào.",
    "Add 'since ...' to say when it started.",
  ],
];

const PAIN: Entry[] = [
  ["ผม/ฉันปวดหัว", "phǒm/chǎn pùat hǔa", "Tôi đau đầu.", "I have a headache."],
  ["ผม/ฉันปวดท้อง", "phǒm/chǎn pùat tháwng", "Tôi đau bụng.", "I have a stomachache."],
  ["ผม/ฉันปวดหลัง", "phǒm/chǎn pùat lǎng", "Tôi đau lưng.", "I have back pain."],
  ["ผม/ฉันเจ็บคอ", "phǒm/chǎn jèp khaw", "Tôi đau họng.", "I have a sore throat."],
  ["ผม/ฉันปวดฟัน", "phǒm/chǎn pùat fan", "Tôi đau răng.", "I have a toothache."],
  [
    "ปวดตรงนี้",
    "pùat trong-níi",
    "Đau chỗ này.",
    "It hurts here.",
    "Vừa nói vừa chỉ tay vào chỗ đau — rõ nhất.",
    "Say it while pointing to the spot — clearest.",
  ],
];

const ALLERGY: Entry[] = [
  ["ผม/ฉันแพ้ยา", "phǒm/chǎn pháe yaa", "Tôi dị ứng thuốc.", "I'm allergic to medicine."],
  [
    "ผม/ฉันแพ้ยาเพนิซิลลิน",
    "phǒm/chǎn pháe yaa phen-ní-sin-lin",
    "Tôi dị ứng penicillin.",
    "I'm allergic to penicillin.",
    "Nói trước khi được kê/tiêm bất kỳ thuốc nào.",
    "Say this before any medicine is prescribed or injected.",
  ],
  ["ผม/ฉันแพ้อาหารทะเล", "phǒm/chǎn pháe aa-hǎan thá-lee", "Tôi dị ứng hải sản.", "I'm allergic to seafood."],
  ["ผม/ฉันแพ้ถั่ว", "phǒm/chǎn pháe thùa", "Tôi dị ứng đậu phộng.", "I'm allergic to peanuts."],
  ["ผม/ฉันมีผื่นคัน", "phǒm/chǎn mii phʉ̀ʉn khan", "Tôi bị nổi mẩn ngứa.", "I have an itchy rash."],
  [
    "ผม/ฉันแพ้แล้วหายใจลำบาก",
    "phǒm/chǎn pháe láeo hǎai-jai lam-bàak",
    "Tôi bị dị ứng và khó thở.",
    "I'm having an allergic reaction and trouble breathing.",
    "Đây là dấu hiệu khẩn — gọi 1669 ngay.",
    "This signals an emergency — call 1669 immediately.",
  ],
];

const MEDICINE: Entry[] = [
  ["ผม/ฉันต้องการยาแก้ปวด", "phǒm/chǎn tâwng-gaan yaa gâe pùat", "Tôi cần thuốc giảm đau.", "I need painkillers."],
  ["มียาแก้ไข้ไหมครับ/คะ", "mii yaa gâe khâi mǎi khráp/khá", "Có thuốc hạ sốt không?", "Do you have fever medicine?"],
  [
    "ผม/ฉันกินยาประจำตัว",
    "phǒm/chǎn gin yaa prà-jam-tua",
    "Tôi uống thuốc thường xuyên.",
    "I take regular medication.",
    "Mang theo danh sách thuốc đang dùng.",
    "Carry a list of your regular medications.",
  ],
  ["นี่คือใบสั่งยาของผม/ฉัน", "nîi khʉʉ bai sàng yaa khǎwng phǒm/chǎn", "Đây là toa thuốc của tôi.", "Here is my prescription."],
  ["ยานี้ชื่ออะไรครับ/คะ", "yaa níi chʉ̂ʉ à-rai khráp/khá", "Thuốc này tên gì?", "What is this medicine called?"],
  ["มียาตัวนี้ไหมครับ/คะ", "mii yaa tua níi mǎi khráp/khá", "Có loại thuốc này không?", "Do you have this medicine?"],
];

const DOSAGE: Entry[] = [
  [
    "กินยังไงครับ/คะ",
    "gin yang-ngai khráp/khá",
    "Uống như thế nào?",
    "How do I take it?",
    "Đây là câu HỎI dược sĩ, không phải hướng dẫn dùng.",
    "This is a QUESTION to ask the pharmacist, not a dosing instruction.",
  ],
  ["วันละกี่ครั้งครับ/คะ", "wan lá gìi khráng khráp/khá", "Một ngày mấy lần?", "How many times a day?"],
  ["กินก่อนหรือหลังอาหารครับ/คะ", "gin gàwn rʉ̌ʉ lǎng aa-hǎan khráp/khá", "Uống trước hay sau khi ăn?", "Before or after meals?"],
  ["ครั้งละกี่เม็ดครับ/คะ", "khráng lá gìi mét khráp/khá", "Mỗi lần mấy viên?", "How many tablets each time?"],
  ["กินกี่วันครับ/คะ", "gin gìi wan khráp/khá", "Uống trong mấy ngày?", "For how many days?"],
  ["มีผลข้างเคียงไหมครับ/คะ", "mii phǒn khâang-khiang mǎi khráp/khá", "Có tác dụng phụ không?", "Are there any side effects?"],
];

const EMERGENCY: Entry[] = [
  [
    "ช่วยด้วย ผม/ฉันต้องการหมอด่วน",
    "chûay dûay, phǒm/chǎn tâwng-gaan mǎw dùan",
    "Cứu với, tôi cần bác sĩ gấp.",
    "Help, I need a doctor urgently.",
    "1669 là số cấp cứu y tế toàn quốc.",
    "1669 is the nationwide medical emergency line.",
  ],
  ["ช่วยโทรเรียกรถพยาบาล 1669", "chûay toh rîak rót phá-yaa-baan nʉ̀ng-hòk-hòk-gâo", "Gọi xe cấp cứu 1669 giúp.", "Please call an ambulance — 1669."],
  ["มีคนหมดสติ", "mii khon mòt sà-tì", "Có người bất tỉnh.", "Someone is unconscious."],
  ["ผม/ฉันหายใจไม่ออก", "phǒm/chǎn hǎai-jai mâi òk", "Tôi khó thở.", "I can't breathe."],
  ["ผม/ฉันเจ็บหน้าอกมาก", "phǒm/chǎn jèp nâa-òk mâak", "Tôi đau ngực dữ dội.", "I have severe chest pain."],
  ["เลือดออกไม่หยุด", "lʉ̂at àwk mâi yùt", "Chảy máu không ngừng.", "The bleeding won't stop."],
];

const APPOINTMENT: Entry[] = [
  ["ผม/ฉันขอนัดพบหมอ", "phǒm/chǎn khǎw nát phóp mǎw", "Tôi muốn đặt lịch khám bác sĩ.", "I'd like to make an appointment with a doctor."],
  ["มีคิวว่างไหมครับ/คะ", "mii khiu wâang mǎi khráp/khá", "Có lịch trống không?", "Are there any open slots?"],
  ["ผม/ฉันมีนัดกับหมอ ...", "phǒm/chǎn mii nát gàp mǎw ...", "Tôi có hẹn với bác sĩ ...", "I have an appointment with Dr ..."],
  ["ขอเลื่อนนัดได้ไหมครับ/คะ", "khǎw lʉ̂an nát dâi mǎi khráp/khá", "Tôi đổi lịch hẹn được không?", "Can I reschedule my appointment?"],
  ["หมอว่างกี่โมงครับ/คะ", "mǎw wâang gìi moong khráp/khá", "Bác sĩ rảnh lúc mấy giờ?", "What time is the doctor available?"],
  ["ต้องรอนานไหมครับ/คะ", "tâwng raw naan mǎi khráp/khá", "Phải đợi lâu không?", "Is the wait long?"],
];

const INSURANCE: Entry[] = [
  ["ผม/ฉันมีประกันการเดินทาง", "phǒm/chǎn mii prà-gan gaan-dəən-thaang", "Tôi có bảo hiểm du lịch.", "I have travel insurance."],
  ["นี่คือบัตรประกันของผม/ฉัน", "nîi khʉʉ bàt prà-gan khǎwng phǒm/chǎn", "Đây là thẻ bảo hiểm của tôi.", "Here is my insurance card."],
  ["ประกันครอบคลุมค่ารักษาไหมครับ/คะ", "prà-gan khrâwp-khlum khâa rák-sǎa mǎi khráp/khá", "Bảo hiểm có chi trả viện phí không?", "Does my insurance cover the treatment?"],
  [
    "ขอใบเสร็จและใบรับรองแพทย์",
    "khǎw bai-sèt láe bai ráp-rawng phâet",
    "Cho xin hóa đơn và giấy chứng nhận y tế.",
    "I need a receipt and a medical certificate.",
    "Giữ chứng từ để claim bảo hiểm sau.",
    "Keep all paperwork for your insurance claim.",
  ],
  ["ผม/ฉันจะเคลมประกัน", "phǒm/chǎn jà khleem prà-gan", "Tôi sẽ yêu cầu bồi thường bảo hiểm.", "I'll claim on my insurance."],
  ["ค่ารักษาเท่าไหร่ครับ/คะ", "khâa rák-sǎa thâo-rài khráp/khá", "Chi phí điều trị bao nhiêu?", "How much is the treatment?"],
];

const HOSPITAL_DESK: Entry[] = [
  ["แผนกฉุกเฉินอยู่ที่ไหนครับ/คะ", "phà-nàek chùk-chěrn yùu thîi-nǎi khráp/khá", "Khoa cấp cứu ở đâu?", "Where is the emergency department?"],
  ["ผม/ฉันต้องลงทะเบียนที่ไหนครับ/คะ", "phǒm/chǎn tâwng long-thá-bian thîi-nǎi khráp/khá", "Tôi đăng ký ở đâu?", "Where do I register?"],
  ["ผม/ฉันมาหาหมอ", "phǒm/chǎn maa hǎa mǎw", "Tôi đến khám bác sĩ.", "I'm here to see a doctor."],
  ["ห้องตรวจอยู่ชั้นไหนครับ/คะ", "hâwng trùat yùu chán nǎi khráp/khá", "Phòng khám ở tầng nào?", "Which floor is the exam room on?"],
  ["ขอพบแพทย์ที่พูดอังกฤษได้ครับ/ค่ะ", "khǎw phóp phâet thîi phûut ang-grìt dâi khráp/khâ", "Cho gặp bác sĩ nói được tiếng Anh.", "May I see a doctor who speaks English?"],
  ["ที่นี่รับบัตรประกันไหมครับ/คะ", "thîi-nîi ráp bàt prà-gan mǎi khráp/khá", "Ở đây có nhận thẻ bảo hiểm không?", "Do you accept insurance cards here?"],
];

const PHARMACY: Entry[] = [
  ["ร้านขายยาที่ใกล้ที่สุดอยู่ที่ไหนครับ/คะ", "ráan khǎai yaa thîi glâi thîi-sùt yùu thîi-nǎi khráp/khá", "Hiệu thuốc gần nhất ở đâu?", "Where is the nearest pharmacy?"],
  ["ขอยาแก้ท้องเสีย", "khǎw yaa gâe tháwng-sǐa", "Cho thuốc tiêu chảy.", "Diarrhea medicine, please."],
  [
    "ขอเกลือแร่",
    "khǎw gluua-rae",
    "Cho gói bù điện giải (ORS).",
    "Oral rehydration salts, please.",
    "Quan trọng khi tiêu chảy/mất nước.",
    "Important for diarrhea / dehydration.",
  ],
  ["ขอยาแก้แพ้", "khǎw yaa gâe pháe", "Cho thuốc chống dị ứng.", "Allergy medicine, please."],
  ["ขอพลาสเตอร์กับยาฆ่าเชื้อ", "khǎw phláat-sà-tə̂ə gàp yaa khâa chʉ́a", "Cho băng cá nhân và thuốc sát trùng.", "Plasters and antiseptic, please."],
  ["มียาที่ไม่ต้องใช้ใบสั่งไหมครับ/คะ", "mii yaa thîi mâi tâwng chái bai-sàng mǎi khráp/khá", "Có thuốc không cần toa không?", "Is there an over-the-counter option?"],
];

const CANNOT_UNDERSTAND: Entry[] = [
  ["ผม/ฉันพูดไทยไม่ได้", "phǒm/chǎn phûut thai mâi dâi", "Tôi không nói được tiếng Thái.", "I can't speak Thai."],
  ["ผม/ฉันไม่เข้าใจ", "phǒm/chǎn mâi khâo-jai", "Tôi không hiểu.", "I don't understand."],
  ["พูดช้าๆ ได้ไหมครับ/คะ", "phûut cháa-cháa dâi mǎi khráp/khá", "Nói chậm lại được không?", "Can you speak slowly?"],
  ["ช่วยเขียนให้หน่อยได้ไหมครับ/คะ", "chûay khǐan hâi nòi dâi mǎi khráp/khá", "Viết ra giúp được không?", "Can you write it down?"],
  ["ใช้แอปแปลภาษาได้ไหมครับ/คะ", "chái áep plae phaa-sǎa dâi mǎi khráp/khá", "Dùng app dịch được không?", "Can we use a translation app?"],
  ["ช่วยพูดอังกฤษได้ไหมครับ/คะ", "chûay phûut ang-grìt dâi mǎi khráp/khá", "Nói tiếng Anh giúp được không?", "Could you speak English, please?"],
];

const NEED_INTERPRETER: Entry[] = [
  ["ผม/ฉันต้องการล่าม", "phǒm/chǎn tâwng-gaan lâam", "Tôi cần người phiên dịch.", "I need an interpreter."],
  ["มีล่ามภาษาเวียดนามไหมครับ/คะ", "mii lâam phaa-sǎa wîat-naam mǎi khráp/khá", "Có phiên dịch tiếng Việt không?", "Is there a Vietnamese interpreter?"],
  ["ช่วยโทรหาล่ามให้หน่อย", "chûay toh hǎa lâam hâi nòi", "Gọi phiên dịch giúp tôi.", "Please call an interpreter."],
  ["มีใครพูดเวียดนามหรืออังกฤษไหมครับ/คะ", "mii khrai phûut wîat-naam rʉ̌ʉ ang-grìt mǎi khráp/khá", "Có ai nói tiếng Việt hoặc tiếng Anh không?", "Does anyone speak Vietnamese or English?"],
  ["ผม/ฉันต้องการคนช่วยแปลตอนคุยกับหมอ", "phǒm/chǎn tâwng-gaan khon chûay plae tawn khui gàp mǎw", "Tôi cần người dịch khi nói chuyện với bác sĩ.", "I need someone to translate when I talk to the doctor."],
  [
    "กรุณาติดต่อสถานทูตเพื่อหาล่าม",
    "gà-rú-naa tìt-tàw sà-thǎan-thûut phʉ̂a hǎa lâam",
    "Vui lòng liên hệ đại sứ quán để tìm phiên dịch.",
    "Please contact the embassy to arrange an interpreter.",
    "ĐSQ Việt Nam có thể hỗ trợ tìm người dịch.",
    "The Vietnamese embassy can help arrange an interpreter.",
  ],
];

// ── Assembled pack ───────────────────────────────────────────────────────

export const thaiMedicalPharmacy: ThaiMedicalItem[] = [
  ...build("symptoms", SYMPTOMS),
  ...build("pain", PAIN),
  ...build("allergy", ALLERGY),
  ...build("medicine", MEDICINE),
  ...build("dosage", DOSAGE),
  ...build("emergency", EMERGENCY),
  ...build("appointment", APPOINTMENT),
  ...build("insurance", INSURANCE),
  ...build("hospital_desk", HOSPITAL_DESK),
  ...build("pharmacy", PHARMACY),
  ...build("cannot_understand", CANNOT_UNDERSTAND),
  ...build("need_interpreter", NEED_INTERPRETER),
];

/** Topics covered by the pack (for filtered clinic/pharmacy screens). */
export const THAI_MEDICAL_TOPICS: ThaiMedicalTopic[] = [
  "symptoms",
  "pain",
  "allergy",
  "medicine",
  "dosage",
  "emergency",
  "appointment",
  "insurance",
  "hospital_desk",
  "pharmacy",
  "cannot_understand",
  "need_interpreter",
];

export default thaiMedicalPharmacy;
