// src/languages/thai/lessons-survival.ts
//
// Thai SURVIVAL lessons for Vietnamese travelers / newcomers (and the
// secondary English audience).
//
// Goal: the smallest set of phrases that gets a person through a real
// emergency or first-week-abroad situation in Thailand — emergencies,
// hospital/pharmacy, police & lost documents, taxis/transport, hotels,
// food allergies, money/bank, SIM/phone, immigration, and the first day
// at a new job.
//
// This module is intentionally SELF-CONTAINED: it declares its own types
// and exports its own data array. It is NOT wired into a Thai barrel /
// normalizer (the Thai vertical ships no `index.ts` / `normalize.ts`
// yet). Keep it standalone so it can be authored and tested in isolation.
//
// Vietnamese-first: every lesson carries Vietnamese explanations
// (`scenario_vi`, `vi`, `note_vi`, practice prompts) plus an English
// companion for the EN audience.
//
// Native review DEFERRED — romanization and tone hints are a readable
// approximation (loosely Royal-Thai-General-System with tone cues), not a
// linguist-verified transcription. Do not advertise as native-reviewed.
//
// ── Thai politeness particles (read this once) ───────────────────────────
// Thai sentences are softened with a final particle that depends on the
// SPEAKER's gender:
//   • male speaker  → ครับ (khráp)
//   • female speaker → ค่ะ (khâ)  /  คะ (khá) in questions
// Phrases below show ครับ/ค่ะ where a particle is natural. Swap the one
// that matches you. Dropping it is understood but sounds blunt.

// ── Types (inline — Thai vertical has no shared registry yet) ────────────

export type ThaiSurvivalCategory =
  | "emergency"
  | "hospital_pharmacy"
  | "police_documents"
  | "taxi_transport"
  | "hotel"
  | "food_allergy"
  | "money_bank"
  | "sim_phone"
  | "immigration"
  | "work_first_day"
  | "getting_around";

/** A ready-to-speak survival phrase. */
export type ThaiSurvivalPhrase = {
  /** Thai script — the line the learner actually says/shows. */
  th: string;
  /** Romanization with light tone cues, for a Vietnamese/English reader. */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** Optional usage / pronunciation note for a Vietnamese ear. */
  note_vi?: string;
  /** Optional usage / pronunciation note for the English audience. */
  note_en?: string;
};

/** A single survival vocabulary item. */
export type ThaiSurvivalVocab = {
  th: string;
  rtgs: string;
  vi: string;
  en: string;
};

export type ThaiSurvivalLesson = {
  /** Stable id, e.g. "th-surv-01". */
  id: string;
  category: ThaiSurvivalCategory;
  /** Title in Thai script. */
  title_th: string;
  /** Title in Vietnamese. */
  title_vi: string;
  /** Title in English. */
  title_en: string;
  /** When/why to use this lesson — Vietnamese. */
  scenario_vi: string;
  /** When/why to use this lesson — English. */
  scenario_en: string;
  /** Core copy-paste-able phrases for the situation. */
  phrases: ThaiSurvivalPhrase[];
  /** Supporting vocabulary. */
  vocab: ThaiSurvivalVocab[];
  /**
   * Show-the-screen lines: full Thai sentences a non-speaker can point at
   * to be understood immediately (taxi driver, pharmacist, hotel desk).
   */
  copy_paste: string[];
  /** Practice prompts — Vietnamese. */
  practice_prompts_vi: string[];
  /** Practice prompts — English (same intent, same order). */
  practice_prompts_en: string[];
};

// ── Data ─────────────────────────────────────────────────────────────────

export const thaiSurvivalLessons: ThaiSurvivalLesson[] = [
  // 01 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-01",
    category: "emergency",
    title_th: "ฉุกเฉิน — ขอความช่วยเหลือ",
    title_vi: "Khẩn cấp — kêu cứu",
    title_en: "Emergency — calling for help",
    scenario_vi:
      "Khi có tai nạn, cháy, hoặc bạn cần người khác gọi cấp cứu giúp. Số khẩn cấp ở Thái Lan: 191 (cảnh sát), 1669 (cấp cứu y tế), 199 (cứu hỏa), 1155 (cảnh sát du lịch, nói được tiếng Anh).",
    scenario_en:
      "Accidents, fire, or when you need a bystander to call for help. Thai emergency numbers: 191 (police), 1669 (medical/ambulance), 199 (fire), 1155 (tourist police, English-speaking).",
    phrases: [
      {
        th: "ช่วยด้วย!",
        rtgs: "chûay dûay!",
        vi: "Cứu với!",
        en: "Help!",
        note_vi: "Câu kêu cứu mạnh nhất, hét to được. 'chûay' = giúp.",
      },
      {
        th: "ช่วยโทรเรียกตำรวจหน่อยครับ/ค่ะ",
        rtgs: "chûay toh rîak tam-rùat nòi khráp/khâ",
        vi: "Làm ơn gọi cảnh sát giúp tôi.",
        en: "Please call the police.",
      },
      {
        th: "ช่วยโทรเรียกรถพยาบาลหน่อยครับ/ค่ะ",
        rtgs: "chûay toh rîak rót phá-yaa-baan nòi khráp/khâ",
        vi: "Làm ơn gọi xe cấp cứu giúp tôi.",
        en: "Please call an ambulance.",
      },
      {
        th: "เกิดอุบัติเหตุ",
        rtgs: "gèrt ù-bàt-tì-hèet",
        vi: "Có tai nạn.",
        en: "There's been an accident.",
      },
      {
        th: "ไฟไหม้!",
        rtgs: "fai mâi!",
        vi: "Cháy!",
        en: "Fire!",
      },
      {
        th: "ผม/ฉันพูดไทยไม่ได้",
        rtgs: "phǒm/chǎn phûut thai mâi dâi",
        vi: "Tôi không nói được tiếng Thái.",
        en: "I can't speak Thai.",
        note_vi: "Nam dùng 'phǒm', nữ dùng 'chǎn' cho 'tôi'.",
      },
    ],
    vocab: [
      { th: "ฉุกเฉิน", rtgs: "chùk-chěrn", vi: "khẩn cấp", en: "emergency" },
      { th: "ตำรวจ", rtgs: "tam-rùat", vi: "cảnh sát", en: "police" },
      { th: "รถพยาบาล", rtgs: "rót phá-yaa-baan", vi: "xe cấp cứu", en: "ambulance" },
      { th: "อันตราย", rtgs: "an-ta-raai", vi: "nguy hiểm", en: "dangerous" },
      { th: "เร็วๆ", rtgs: "reo-reo", vi: "nhanh lên", en: "quickly / hurry" },
    ],
    copy_paste: [
      "ช่วยด้วย! เกิดอุบัติเหตุ ช่วยโทรเรียกรถพยาบาลหน่อยครับ/ค่ะ",
      "นี่เป็นเหตุฉุกเฉิน กรุณาโทร 1669 ให้หน่อยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn thấy một người ngã xe máy. Hãy nói câu nhờ người đi đường gọi cấp cứu.",
      "Tập hét 'Cứu với!' và 'Cháy!' bằng tiếng Thái cho rõ và to.",
    ],
    practice_prompts_en: [
      "You see someone fall off a motorbike. Say the line asking a passerby to call an ambulance.",
      "Practice shouting 'Help!' and 'Fire!' in Thai, loud and clear.",
    ],
  },

  // 02 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-02",
    category: "hospital_pharmacy",
    title_th: "โรงพยาบาล — บอกอาการ",
    title_vi: "Bệnh viện — mô tả triệu chứng",
    title_en: "Hospital — describing symptoms",
    scenario_vi:
      "Tại phòng khám hoặc cấp cứu, cần nói chỗ đau và triệu chứng. Mẫu chung: 'ผม/ฉัน + [triệu chứng]'.",
    scenario_en:
      "At a clinic or ER, telling staff where it hurts and what's wrong. Pattern: 'I + [symptom]'.",
    phrases: [
      {
        th: "ผม/ฉันไม่สบาย",
        rtgs: "phǒm/chǎn mâi sà-baai",
        vi: "Tôi bị mệt / không khỏe.",
        en: "I feel unwell.",
      },
      {
        th: "ผม/ฉันปวดตรงนี้",
        rtgs: "phǒm/chǎn pùat trong níi",
        vi: "Tôi đau chỗ này.",
        en: "It hurts here.",
        note_vi: "Vừa nói vừa chỉ tay vào chỗ đau — đơn giản và hiệu quả nhất.",
      },
      {
        th: "ผม/ฉันมีไข้",
        rtgs: "phǒm/chǎn mii khâi",
        vi: "Tôi bị sốt.",
        en: "I have a fever.",
      },
      {
        th: "ผม/ฉันหายใจไม่ออก",
        rtgs: "phǒm/chǎn hǎai-jai mâi òk",
        vi: "Tôi khó thở.",
        en: "I can't breathe.",
        note_en: "Use this immediately at triage — it signals an emergency.",
      },
      {
        th: "ผม/ฉันแพ้ยา",
        rtgs: "phǒm/chǎn pháe yaa",
        vi: "Tôi bị dị ứng thuốc.",
        en: "I'm allergic to medicine.",
      },
      {
        th: "เลือดกรุ๊ปของผม/ฉันคือ ...",
        rtgs: "lʉ̂at grúp khǎwng phǒm/chǎn khʉʉ ...",
        vi: "Nhóm máu của tôi là ...",
        en: "My blood type is ...",
      },
    ],
    vocab: [
      { th: "โรงพยาบาล", rtgs: "rohng phá-yaa-baan", vi: "bệnh viện", en: "hospital" },
      { th: "หมอ", rtgs: "mǎw", vi: "bác sĩ", en: "doctor" },
      { th: "ปวดหัว", rtgs: "pùat hǔa", vi: "đau đầu", en: "headache" },
      { th: "ปวดท้อง", rtgs: "pùat tháwng", vi: "đau bụng", en: "stomachache" },
      { th: "อาเจียน", rtgs: "aa-jian", vi: "nôn / ói", en: "to vomit" },
    ],
    copy_paste: [
      "ผม/ฉันไม่สบาย มีไข้ และปวดท้องมาก ช่วยพาไปหาหมอหน่อยครับ/ค่ะ",
      "ผม/ฉันแพ้ยาเพนิซิลลิน กรุณาบอกหมอด้วยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn bị sốt và đau bụng từ tối qua. Hãy mô tả cho y tá bằng 2 câu.",
      "Tập nói câu 'Tôi bị dị ứng thuốc' và thêm tên loại thuốc bạn dị ứng.",
    ],
    practice_prompts_en: [
      "You've had a fever and stomachache since last night. Describe it to the nurse in two sentences.",
      "Practice 'I'm allergic to medicine' and add the name of a drug you react to.",
    ],
  },

  // 03 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-03",
    category: "hospital_pharmacy",
    title_th: "ร้านขายยา — ซื้อยา",
    title_vi: "Hiệu thuốc — mua thuốc",
    title_en: "Pharmacy — buying medicine",
    scenario_vi:
      "Hiệu thuốc Thái (ร้านขายยา) rất nhiều và bán nhiều thuốc không cần toa. Đây là cách hỏi mua đúng thuốc.",
    scenario_en:
      "Thai pharmacies are everywhere and sell many meds over the counter. How to ask for the right one.",
    phrases: [
      {
        th: "มียาแก้ปวดไหมครับ/คะ",
        rtgs: "mii yaa gâe pùat mǎi khráp/khá",
        vi: "Có thuốc giảm đau không?",
        en: "Do you have painkillers?",
      },
      {
        th: "มียาแก้ท้องเสียไหมครับ/คะ",
        rtgs: "mii yaa gâe tháwng-sǐa mǎi khráp/khá",
        vi: "Có thuốc tiêu chảy không?",
        en: "Do you have diarrhea medicine?",
      },
      {
        th: "มียาแก้แพ้ไหมครับ/คะ",
        rtgs: "mii yaa gâe pháe mǎi khráp/khá",
        vi: "Có thuốc chống dị ứng không?",
        en: "Do you have allergy medicine?",
      },
      {
        th: "กินยังไงครับ/คะ",
        rtgs: "gin yang-ngai khráp/khá",
        vi: "Uống như thế nào?",
        en: "How do I take it?",
        note_vi: "'gin' = ăn/uống. Người bán sẽ chỉ liều dùng.",
      },
      {
        th: "วันละกี่ครั้งครับ/คะ",
        rtgs: "wan lá gìi khráng khráp/khá",
        vi: "Một ngày mấy lần?",
        en: "How many times a day?",
      },
    ],
    vocab: [
      { th: "ร้านขายยา", rtgs: "ráan khǎai yaa", vi: "hiệu thuốc", en: "pharmacy" },
      { th: "ยา", rtgs: "yaa", vi: "thuốc", en: "medicine" },
      { th: "ยาแก้ไข้", rtgs: "yaa gâe khâi", vi: "thuốc hạ sốt", en: "fever medicine" },
      { th: "พลาสเตอร์", rtgs: "phláat-sà-tə̂ə", vi: "băng cá nhân", en: "bandage / plaster" },
      { th: "หลังอาหาร", rtgs: "lǎng aa-hǎan", vi: "sau khi ăn", en: "after meals" },
    ],
    copy_paste: [
      "ผม/ฉันท้องเสีย มียาแก้ท้องเสียกับเกลือแร่ไหมครับ/คะ",
      "ขอยาแก้ปวดหัว แล้วช่วยบอกวิธีกินด้วยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn bị đau đầu và muốn mua thuốc. Hãy hỏi mua và hỏi cách uống.",
      "Tập hỏi 'Một ngày mấy lần?' và 'Uống trước hay sau khi ăn?'.",
    ],
    practice_prompts_en: [
      "You have a headache and want medicine. Ask for it and ask how to take it.",
      "Practice 'How many times a day?' and 'Before or after meals?'.",
    ],
  },

  // 04 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-04",
    category: "police_documents",
    title_th: "ตำรวจ — แจ้งความ",
    title_vi: "Cảnh sát — trình báo",
    title_en: "Police — filing a report",
    scenario_vi:
      "Khi bị móc túi, trộm cắp, hoặc cần biên bản (báo cáo) cho bảo hiểm. Đến đồn cảnh sát (สถานีตำรวจ) hoặc gọi 1155 (cảnh sát du lịch).",
    scenario_en:
      "Pickpocketing, theft, or needing a written report for insurance. Go to a police station (สถานีตำรวจ) or call 1155 (tourist police).",
    phrases: [
      {
        th: "ผม/ฉันโดนขโมย",
        rtgs: "phǒm/chǎn dohn khà-mooi",
        vi: "Tôi bị trộm.",
        en: "I've been robbed / something was stolen.",
      },
      {
        th: "กระเป๋าเงินของผม/ฉันหาย",
        rtgs: "grà-pǎo ngən khǎwng phǒm/chǎn hǎai",
        vi: "Ví của tôi bị mất.",
        en: "My wallet is gone.",
      },
      {
        th: "ผม/ฉันอยากแจ้งความ",
        rtgs: "phǒm/chǎn yàak jâeng khwaam",
        vi: "Tôi muốn trình báo (lập biên bản).",
        en: "I want to file a police report.",
      },
      {
        th: "ขอใบแจ้งความด้วยครับ/ค่ะ",
        rtgs: "khǎw bai jâeng khwaam dûay khráp/khâ",
        vi: "Cho tôi xin giấy biên bản.",
        en: "I need a copy of the report.",
        note_vi: "Giấy này cần cho bảo hiểm và để làm lại giấy tờ.",
      },
      {
        th: "มีใครพูดอังกฤษได้ไหมครับ/คะ",
        rtgs: "mii khrai phûut ang-grìt dâi mǎi khráp/khá",
        vi: "Có ai nói được tiếng Anh không?",
        en: "Does anyone speak English?",
      },
    ],
    vocab: [
      { th: "สถานีตำรวจ", rtgs: "sà-thǎa-nii tam-rùat", vi: "đồn cảnh sát", en: "police station" },
      { th: "ขโมย", rtgs: "khà-mooi", vi: "trộm / ăn cắp", en: "to steal / thief" },
      { th: "หาย", rtgs: "hǎai", vi: "mất / biến mất", en: "lost / missing" },
      { th: "แจ้งความ", rtgs: "jâeng khwaam", vi: "trình báo", en: "to file a report" },
      { th: "พยาน", rtgs: "phá-yaan", vi: "nhân chứng", en: "witness" },
    ],
    copy_paste: [
      "ผม/ฉันโดนขโมยกระเป๋าเงินและโทรศัพท์ อยากแจ้งความและขอใบแจ้งความครับ/ค่ะ",
      "เหตุเกิดที่ ... เวลาประมาณ ... ช่วยลงบันทึกให้ด้วยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Điện thoại của bạn bị móc túi trên BTS. Hãy trình báo và xin giấy biên bản.",
      "Tập nói địa điểm và thời gian xảy ra vụ việc (dùng mẫu 'เหตุเกิดที่ ... เวลา ...').",
    ],
    practice_prompts_en: [
      "Your phone was pickpocketed on the BTS. File a report and ask for the paperwork.",
      "Practice stating where and when it happened ('it happened at ... around ...').",
    ],
  },

  // 05 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-05",
    category: "police_documents",
    title_th: "หนังสือเดินทางหาย — สถานทูต",
    title_vi: "Mất hộ chiếu — đại sứ quán",
    title_en: "Lost passport — embassy",
    scenario_vi:
      "Mất hoặc bị trộm hộ chiếu. Trình tự: (1) báo cảnh sát lấy biên bản → (2) liên hệ đại sứ quán Việt Nam → (3) xin giấy thông hành tạm.",
    scenario_en:
      "Lost or stolen passport. Order: (1) police report → (2) contact your embassy → (3) get an emergency travel document.",
    phrases: [
      {
        th: "หนังสือเดินทางของผม/ฉันหาย",
        rtgs: "nǎng-sʉ̌ʉ dəən-thaang khǎwng phǒm/chǎn hǎai",
        vi: "Hộ chiếu của tôi bị mất.",
        en: "My passport is lost.",
      },
      {
        th: "ผม/ฉันต้องติดต่อสถานทูต",
        rtgs: "phǒm/chǎn tâwng tìt-tàw sà-thǎan-thûut",
        vi: "Tôi cần liên hệ đại sứ quán.",
        en: "I need to contact my embassy.",
      },
      {
        th: "สถานทูตเวียดนามอยู่ที่ไหนครับ/คะ",
        rtgs: "sà-thǎan-thûut wîat-naam yùu thîi-nǎi khráp/khá",
        vi: "Đại sứ quán Việt Nam ở đâu?",
        en: "Where is the Vietnamese embassy?",
      },
      {
        th: "ผม/ฉันมีใบแจ้งความแล้ว",
        rtgs: "phǒm/chǎn mii bai jâeng khwaam láeo",
        vi: "Tôi đã có giấy biên bản rồi.",
        en: "I already have the police report.",
      },
      {
        th: "นี่คือสำเนาหนังสือเดินทาง",
        rtgs: "nîi khʉʉ sǎm-nao nǎng-sʉ̌ʉ dəən-thaang",
        vi: "Đây là bản sao hộ chiếu.",
        en: "This is a copy of my passport.",
        note_vi: "Luôn chụp/lưu sẵn ảnh hộ chiếu trên điện thoại và email.",
      },
    ],
    vocab: [
      { th: "หนังสือเดินทาง", rtgs: "nǎng-sʉ̌ʉ dəən-thaang", vi: "hộ chiếu", en: "passport" },
      { th: "สถานทูต", rtgs: "sà-thǎan-thûut", vi: "đại sứ quán", en: "embassy" },
      { th: "วีซ่า", rtgs: "wii-sâa", vi: "thị thực / visa", en: "visa" },
      { th: "สำเนา", rtgs: "sǎm-nao", vi: "bản sao", en: "copy" },
      { th: "เอกสาร", rtgs: "èek-gà-sǎan", vi: "giấy tờ", en: "document" },
    ],
    copy_paste: [
      "หนังสือเดินทางของผม/ฉันหาย ผม/ฉันมีใบแจ้งความแล้ว และต้องติดต่อสถานทูตเวียดนามครับ/ค่ะ",
      "ช่วยบอกทางไปสถานทูตเวียดนาม หรือเบอร์โทรให้หน่อยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn mất hộ chiếu sau khi đã báo cảnh sát. Hãy giải thích tình huống cho lễ tân khách sạn và nhờ chỉ đường tới đại sứ quán.",
      "Tập nói 'Tôi đã có biên bản rồi' và 'Đây là bản sao hộ chiếu'.",
    ],
    practice_prompts_en: [
      "You lost your passport after filing a police report. Explain to the hotel desk and ask for directions to the embassy.",
      "Practice 'I already have the police report' and 'This is a copy of my passport'.",
    ],
  },

  // 06 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-06",
    category: "taxi_transport",
    title_th: "แท็กซี่ / มอเตอร์ไซค์ / Grab",
    title_vi: "Taxi / xe ôm / Grab",
    title_en: "Taxi / motorbike / Grab",
    scenario_vi:
      "Bắt taxi hoặc xe ôm. Luôn yêu cầu chạy theo đồng hồ ('มิเตอร์'). Grab/Bolt thì giá hiện sẵn, an toàn cho người mới.",
    scenario_en:
      "Taking a taxi or motorbike. Always ask for the meter ('มิเตอร์'). Grab/Bolt show a fixed price — safest for newcomers.",
    phrases: [
      {
        th: "ไป ... ครับ/ค่ะ",
        rtgs: "pai ... khráp/khâ",
        vi: "Đi tới ... .",
        en: "To ... , please.",
        note_vi: "Điền tên địa điểm vào chỗ '...'. Đưa địa chỉ tiếng Thái cho chắc.",
      },
      {
        th: "เปิดมิเตอร์ด้วยครับ/ค่ะ",
        rtgs: "pə̀ət mí-tə̂ə dûay khráp/khâ",
        vi: "Bật đồng hồ giúp tôi.",
        en: "Use the meter, please.",
        note_vi: "Quan trọng nhất — tránh bị hét giá khoán.",
      },
      {
        th: "ไปทางไหนครับ/คะ — ไปตามทางหลักนะครับ/คะ",
        rtgs: "pai thaang nǎi khráp/khá — pai taam thaang làk ná khráp/khá",
        vi: "Đi đường nào? — Đi đường chính nhé.",
        en: "Which way? — Take the main road, please.",
      },
      {
        th: "จอดตรงนี้ครับ/ค่ะ",
        rtgs: "jàwt trong níi khráp/khâ",
        vi: "Dừng ở đây.",
        en: "Stop here, please.",
      },
      {
        th: "เท่าไหร่ครับ/คะ",
        rtgs: "thâo-rài khráp/khá",
        vi: "Bao nhiêu tiền?",
        en: "How much?",
      },
    ],
    vocab: [
      { th: "แท็กซี่", rtgs: "tháek-sîi", vi: "taxi", en: "taxi" },
      { th: "มอเตอร์ไซค์", rtgs: "maw-təə-sai", vi: "xe ôm", en: "motorbike taxi" },
      { th: "มิเตอร์", rtgs: "mí-tə̂ə", vi: "đồng hồ tính tiền", en: "meter" },
      { th: "สนามบิน", rtgs: "sà-nǎam-bin", vi: "sân bay", en: "airport" },
      { th: "ตรงไป", rtgs: "trong pai", vi: "đi thẳng", en: "go straight" },
    ],
    copy_paste: [
      "ไปโรงพยาบาล ... เปิดมิเตอร์ด้วยครับ/ค่ะ ไปตามทางหลักนะครับ/คะ",
      "จอดตรงนี้ครับ/ค่ะ เท่าไหร่ครับ/คะ",
    ],
    practice_prompts_vi: [
      "Bạn lên taxi đi sân bay. Hãy nói điểm đến và yêu cầu bật đồng hồ.",
      "Tập nói 'Dừng ở đây' và 'Bao nhiêu tiền?'.",
    ],
    practice_prompts_en: [
      "You get in a taxi to the airport. State your destination and ask for the meter.",
      "Practice 'Stop here' and 'How much?'.",
    ],
  },

  // 07 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-07",
    category: "getting_around",
    title_th: "รถไฟฟ้า / รถเมล์ — ถามทาง",
    title_vi: "Tàu điện / xe buýt — hỏi đường",
    title_en: "Train / bus — asking directions",
    scenario_vi:
      "Đi BTS/MRT và xe buýt, hỏi đường khi lạc. BTS (trên cao) và MRT (ngầm) là cách nhanh, rẻ, dễ nhất ở Bangkok.",
    scenario_en:
      "Using the BTS/MRT and buses, and asking directions when lost. The BTS (skytrain) and MRT (subway) are the fastest, cheapest way around Bangkok.",
    phrases: [
      {
        th: "สถานี ... ไปทางไหนครับ/คะ",
        rtgs: "sà-thǎa-nii ... pai thaang nǎi khráp/khá",
        vi: "Ga ... đi hướng nào?",
        en: "Which way to ... station?",
      },
      {
        th: "ขอตั๋วไป ... หนึ่งใบครับ/ค่ะ",
        rtgs: "khǎw tǔa pai ... nʉ̀ng bai khráp/khâ",
        vi: "Cho tôi một vé đi ... .",
        en: "One ticket to ... , please.",
      },
      {
        th: "รถเมล์สายไหนไป ... ครับ/คะ",
        rtgs: "rót-mee sǎai nǎi pai ... khráp/khá",
        vi: "Xe buýt tuyến nào đi ... ?",
        en: "Which bus goes to ... ?",
      },
      {
        th: "ลงที่ไหนครับ/คะ",
        rtgs: "long thîi-nǎi khráp/khá",
        vi: "Xuống ở đâu (trạm nào)?",
        en: "Where do I get off?",
      },
      {
        th: "หลงทางครับ/ค่ะ ช่วยหน่อยได้ไหมครับ/คะ",
        rtgs: "lǒng thaang khráp/khâ, chûay nòi dâi mǎi khráp/khá",
        vi: "Tôi bị lạc đường, giúp tôi được không?",
        en: "I'm lost — can you help me?",
      },
    ],
    vocab: [
      { th: "รถไฟฟ้า", rtgs: "rót fai fáa", vi: "tàu điện (BTS)", en: "skytrain / electric train" },
      { th: "รถไฟใต้ดิน", rtgs: "rót fai tâi din", vi: "tàu điện ngầm (MRT)", en: "subway" },
      { th: "สถานี", rtgs: "sà-thǎa-nii", vi: "nhà ga / trạm", en: "station" },
      { th: "ตั๋ว", rtgs: "tǔa", vi: "vé", en: "ticket" },
      { th: "ทางออก", rtgs: "thaang àwk", vi: "lối ra", en: "exit" },
    ],
    copy_paste: [
      "ขอตั๋วไปสถานีอโศกหนึ่งใบครับ/ค่ะ ขึ้นรถไฟฟ้าทางไหนครับ/คะ",
      "หลงทางครับ/ค่ะ จะไป ... ต้องนั่งรถเมล์สายไหน และลงที่ไหนครับ/คะ",
    ],
    practice_prompts_vi: [
      "Bạn cần đi tới ga Asok bằng BTS. Hãy mua vé và hỏi đi hướng nào.",
      "Bạn bị lạc. Hãy nói bạn bị lạc và hỏi tuyến xe buýt nào đi tới điểm đến.",
    ],
    practice_prompts_en: [
      "You need to reach Asok station by BTS. Buy a ticket and ask which way to go.",
      "You're lost. Say so and ask which bus goes to your destination.",
    ],
  },

  // 08 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-08",
    category: "hotel",
    title_th: "โรงแรม — เช็คอินและปัญหา",
    title_vi: "Khách sạn — nhận phòng và sự cố",
    title_en: "Hotel — check-in and problems",
    scenario_vi:
      "Nhận phòng, hỏi giờ trả phòng, và báo sự cố (điều hòa, wifi, nước nóng).",
    scenario_en:
      "Checking in, asking about checkout, and reporting problems (A/C, wifi, hot water).",
    phrases: [
      {
        th: "ผม/ฉันจองห้องไว้ในชื่อ ...",
        rtgs: "phǒm/chǎn jawng hâwng wái nai chʉ̂ʉ ...",
        vi: "Tôi đã đặt phòng dưới tên ... .",
        en: "I have a booking under the name ... .",
      },
      {
        th: "เช็คเอาท์กี่โมงครับ/คะ",
        rtgs: "chék-áo gìi moong khráp/khá",
        vi: "Mấy giờ trả phòng?",
        en: "What time is checkout?",
      },
      {
        th: "ขอวายฟายรหัสอะไรครับ/คะ",
        rtgs: "khǎw wai-faai rá-hàt à-rai khráp/khá",
        vi: "Mật khẩu wifi là gì?",
        en: "What's the wifi password?",
      },
      {
        th: "แอร์เสียครับ/ค่ะ",
        rtgs: "ae sǐa khráp/khâ",
        vi: "Điều hòa bị hỏng.",
        en: "The air-con is broken.",
        note_vi: "'เสีย' (sǐa) = hỏng. Dùng cho mọi thiết bị: ทีวีเสีย, น้ำอุ่นเสีย...",
      },
      {
        th: "ขอเปลี่ยนห้องได้ไหมครับ/คะ",
        rtgs: "khǎw plìan hâwng dâi mǎi khráp/khá",
        vi: "Tôi đổi phòng được không?",
        en: "Can I change rooms?",
      },
    ],
    vocab: [
      { th: "โรงแรม", rtgs: "rohng-raem", vi: "khách sạn", en: "hotel" },
      { th: "ห้องพัก", rtgs: "hâwng phák", vi: "phòng", en: "room" },
      { th: "จอง", rtgs: "jawng", vi: "đặt (phòng)", en: "to book / reserve" },
      { th: "กุญแจ", rtgs: "gun-jae", vi: "chìa khóa", en: "key" },
      { th: "น้ำอุ่น", rtgs: "náam ùn", vi: "nước nóng", en: "hot water" },
    ],
    copy_paste: [
      "ผม/ฉันจองห้องไว้ในชื่อ ... ขอเช็คอินครับ/ค่ะ เช็คเอาท์กี่โมงครับ/คะ",
      "แอร์ในห้องเสียและน้ำอุ่นไม่ไหล ขอเปลี่ยนห้องได้ไหมครับ/คะ",
    ],
    practice_prompts_vi: [
      "Bạn tới khách sạn lúc tối. Hãy nhận phòng theo tên đặt và hỏi mật khẩu wifi.",
      "Điều hòa và nước nóng trong phòng đều hỏng. Hãy báo và xin đổi phòng.",
    ],
    practice_prompts_en: [
      "You arrive at the hotel at night. Check in under your booking name and ask for the wifi password.",
      "The A/C and hot water are both broken. Report it and ask to change rooms.",
    ],
  },

  // 09 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-09",
    category: "food_allergy",
    title_th: "แพ้อาหาร — สั่งอาหารปลอดภัย",
    title_vi: "Dị ứng thức ăn — gọi món an toàn",
    title_en: "Food allergy — ordering safely",
    scenario_vi:
      "Báo dị ứng để tránh nguy hiểm. Mẫu chính: 'ผม/ฉันแพ้ ...' (Tôi dị ứng ...). Đồ Thái hay có đậu phộng, tôm/hải sản và nước mắm.",
    scenario_en:
      "Flagging allergies to stay safe. Core pattern: 'I'm allergic to ...'. Thai food often hides peanuts, shrimp/seafood, and fish sauce.",
    phrases: [
      {
        th: "ผม/ฉันแพ้ถั่ว",
        rtgs: "phǒm/chǎn pháe thùa",
        vi: "Tôi dị ứng đậu phộng / các loại đậu.",
        en: "I'm allergic to peanuts/nuts.",
      },
      {
        th: "ผม/ฉันแพ้อาหารทะเล",
        rtgs: "phǒm/chǎn pháe aa-hǎan thá-lee",
        vi: "Tôi dị ứng hải sản.",
        en: "I'm allergic to seafood.",
      },
      {
        th: "ห้ามใส่ถั่ว / ห้ามใส่กุ้ง",
        rtgs: "hâam sài thùa / hâam sài gûng",
        vi: "Đừng cho đậu phộng / đừng cho tôm.",
        en: "No peanuts / no shrimp.",
        note_vi: "'ห้ามใส่' (hâam sài) = cấm bỏ vào — câu mạnh, rõ ràng nhất.",
      },
      {
        th: "ผม/ฉันกินมังสวิรัติ",
        rtgs: "phǒm/chǎn gin mang-sà-wí-rát",
        vi: "Tôi ăn chay.",
        en: "I'm vegetarian.",
        note_en: "For strict vegan/no-egg, add 'เจ' (jay) — stricter than vegetarian.",
      },
      {
        th: "อันนี้มีถั่วไหมครับ/คะ",
        rtgs: "an níi mii thùa mǎi khráp/khá",
        vi: "Món này có đậu phộng không?",
        en: "Does this have peanuts?",
      },
    ],
    vocab: [
      { th: "แพ้", rtgs: "pháe", vi: "dị ứng", en: "allergic" },
      { th: "ถั่ว", rtgs: "thùa", vi: "đậu / đậu phộng", en: "peanut / nuts / beans" },
      { th: "กุ้ง", rtgs: "gûng", vi: "tôm", en: "shrimp" },
      { th: "น้ำปลา", rtgs: "náam plaa", vi: "nước mắm", en: "fish sauce" },
      { th: "ไข่", rtgs: "khài", vi: "trứng", en: "egg" },
    ],
    copy_paste: [
      "ผม/ฉันแพ้อาหารทะเลและถั่ว ห้ามใส่กุ้งและถั่วนะครับ/คะ ถ้าใส่ผม/ฉันอาจแพ้รุนแรง",
      "อันนี้มีถั่วหรือกุ้งไหมครับ/คะ ถ้ามีขอเปลี่ยนเมนูครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn dị ứng hải sản nặng. Hãy báo người phục vụ và yêu cầu không cho tôm.",
      "Tập hỏi 'Món này có đậu phộng không?' rồi đổi sang câu hỏi về trứng và nước mắm.",
    ],
    practice_prompts_en: [
      "You have a severe seafood allergy. Tell the waiter and ask for no shrimp.",
      "Practice 'Does this have peanuts?' then swap in egg and fish sauce.",
    ],
  },

  // 10 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-10",
    category: "food_allergy",
    title_th: "สั่งอาหาร — ความเผ็ดและการจ่ายเงิน",
    title_vi: "Gọi món — độ cay và thanh toán",
    title_en: "Ordering food — spice level and paying",
    scenario_vi:
      "Gọi món hằng ngày, chỉnh độ cay, và tính tiền. Đồ Thái rất cay — luôn nói rõ mức cay.",
    scenario_en:
      "Everyday ordering, adjusting spice, and paying. Thai food is very spicy — always state your level.",
    phrases: [
      {
        th: "ขอเมนูหน่อยครับ/ค่ะ",
        rtgs: "khǎw mee-nuu nòi khráp/khâ",
        vi: "Cho tôi xem thực đơn.",
        en: "Can I see the menu?",
      },
      {
        th: "ไม่เผ็ดนะครับ/คะ",
        rtgs: "mâi phèt ná khráp/khá",
        vi: "Không cay nhé.",
        en: "Not spicy, please.",
        note_vi: "Cay vừa = 'เผ็ดน้อย' (phèt nói); cay nhiều = 'เผ็ดมาก' (phèt mâak).",
      },
      {
        th: "ขอน้ำเปล่าหนึ่งแก้วครับ/ค่ะ",
        rtgs: "khǎw náam plào nʉ̀ng gâeo khráp/khâ",
        vi: "Cho tôi một ly nước lọc.",
        en: "A glass of water, please.",
      },
      {
        th: "อร่อยมากครับ/ค่ะ",
        rtgs: "à-ròi mâak khráp/khâ",
        vi: "Rất ngon.",
        en: "Very delicious.",
      },
      {
        th: "เก็บเงินด้วยครับ/ค่ะ",
        rtgs: "gèp ngən dûay khráp/khâ",
        vi: "Tính tiền.",
        en: "The bill, please.",
      },
    ],
    vocab: [
      { th: "อาหาร", rtgs: "aa-hǎan", vi: "thức ăn", en: "food" },
      { th: "ข้าว", rtgs: "khâao", vi: "cơm", en: "rice" },
      { th: "เผ็ด", rtgs: "phèt", vi: "cay", en: "spicy" },
      { th: "อร่อย", rtgs: "à-ròi", vi: "ngon", en: "delicious" },
      { th: "น้ำเปล่า", rtgs: "náam plào", vi: "nước lọc", en: "plain water" },
    ],
    copy_paste: [
      "ขอผัดไทยไม่เผ็ด กับน้ำเปล่าหนึ่งแก้วครับ/ค่ะ",
      "อร่อยมากครับ/ค่ะ เก็บเงินด้วยครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Gọi một món Thái nhưng yêu cầu không cay và thêm một ly nước lọc.",
      "Tập nói 'Rất ngon' rồi gọi tính tiền.",
    ],
    practice_prompts_en: [
      "Order a Thai dish but ask for it not spicy, plus a glass of water.",
      "Practice 'Very delicious' then ask for the bill.",
    ],
  },

  // 11 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-11",
    category: "money_bank",
    title_th: "เงิน / ATM / ธนาคาร",
    title_vi: "Tiền / ATM / ngân hàng",
    title_en: "Money / ATM / bank",
    scenario_vi:
      "Rút tiền, đổi tiền, hỏi giá. Tiền Thái là บาท (baht). ATM Thái thường thu phí ~220 baht cho thẻ nước ngoài.",
    scenario_en:
      "Withdrawing, exchanging, asking prices. The Thai currency is the baht (บาท). Thai ATMs usually charge ~220 baht for foreign cards.",
    phrases: [
      {
        th: "ตู้เอทีเอ็มอยู่ที่ไหนครับ/คะ",
        rtgs: "tûu ee-thii-em yùu thîi-nǎi khráp/khá",
        vi: "Máy ATM ở đâu?",
        en: "Where is an ATM?",
      },
      {
        th: "ขอแลกเงินครับ/ค่ะ",
        rtgs: "khǎw lâek ngən khráp/khâ",
        vi: "Tôi muốn đổi tiền.",
        en: "I'd like to exchange money.",
      },
      {
        th: "อันนี้เท่าไหร่ครับ/คะ",
        rtgs: "an níi thâo-rài khráp/khá",
        vi: "Cái này bao nhiêu tiền?",
        en: "How much is this?",
      },
      {
        th: "แพงไปครับ/ค่ะ ลดได้ไหมครับ/คะ",
        rtgs: "phaeng pai khráp/khâ, lót dâi mǎi khráp/khá",
        vi: "Đắt quá, giảm được không?",
        en: "Too expensive — can you lower it?",
        note_vi: "Trả giá ở chợ là bình thường; siêu thị/cửa hàng thì không.",
      },
      {
        th: "รับบัตรไหมครับ/คะ",
        rtgs: "ráp bàt mǎi khráp/khá",
        vi: "Có nhận thẻ không?",
        en: "Do you take cards?",
      },
    ],
    vocab: [
      { th: "เงิน", rtgs: "ngən", vi: "tiền", en: "money" },
      { th: "บาท", rtgs: "bàat", vi: "baht (tiền Thái)", en: "baht" },
      { th: "ธนาคาร", rtgs: "thá-naa-khaan", vi: "ngân hàng", en: "bank" },
      { th: "แลกเงิน", rtgs: "lâek ngən", vi: "đổi tiền", en: "exchange money" },
      { th: "เงินสด", rtgs: "ngən sòt", vi: "tiền mặt", en: "cash" },
    ],
    copy_paste: [
      "ขอแลกเงินจากดงเวียดนามเป็นเงินบาทครับ/ค่ะ เรทเท่าไหร่ครับ/คะ",
      "อันนี้เท่าไหร่ครับ/คะ แพงไปครับ/ค่ะ ลดได้ไหมครับ/คะ",
    ],
    practice_prompts_vi: [
      "Bạn cần rút tiền và đổi tiền. Hãy hỏi ATM ở đâu rồi hỏi đổi tiền sang baht.",
      "Ở chợ, hãy hỏi giá một món đồ rồi trả giá.",
    ],
    practice_prompts_en: [
      "You need cash and to exchange money. Ask where an ATM is, then ask to change money into baht.",
      "At a market, ask the price of an item, then bargain.",
    ],
  },

  // 12 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-12",
    category: "sim_phone",
    title_th: "ซิม / อินเทอร์เน็ต",
    title_vi: "SIM / Internet",
    title_en: "SIM card / internet",
    scenario_vi:
      "Mua SIM du lịch để có data và gọi. Nhà mạng chính: AIS, TrueMove, dtac. Cần hộ chiếu để đăng ký.",
    scenario_en:
      "Getting a tourist SIM for data and calls. Main carriers: AIS, TrueMove, dtac. You'll need your passport to register.",
    phrases: [
      {
        th: "ขอซื้อซิมการ์ดครับ/ค่ะ",
        rtgs: "khǎw sʉ́ʉ sim-gáat khráp/khâ",
        vi: "Tôi muốn mua SIM.",
        en: "I'd like to buy a SIM card.",
      },
      {
        th: "มีแพ็กเกจอินเทอร์เน็ตไหมครับ/คะ",
        rtgs: "mii pháek-kèet in-thəə-nét mǎi khráp/khá",
        vi: "Có gói data không?",
        en: "Do you have a data package?",
      },
      {
        th: "ใช้ได้กี่วันครับ/คะ",
        rtgs: "chái dâi gìi wan khráp/khá",
        vi: "Dùng được mấy ngày?",
        en: "How many days does it last?",
      },
      {
        th: "ช่วยใส่ซิมให้หน่อยได้ไหมครับ/คะ",
        rtgs: "chûay sài sim hâi nòi dâi mǎi khráp/khá",
        vi: "Lắp SIM giúp tôi được không?",
        en: "Can you install the SIM for me?",
      },
      {
        th: "เน็ตใช้ไม่ได้ครับ/ค่ะ",
        rtgs: "nét chái mâi dâi khráp/khâ",
        vi: "Mạng không vào được.",
        en: "The internet isn't working.",
      },
    ],
    vocab: [
      { th: "ซิมการ์ด", rtgs: "sim-gáat", vi: "thẻ SIM", en: "SIM card" },
      { th: "อินเทอร์เน็ต", rtgs: "in-thəə-nét", vi: "internet", en: "internet" },
      { th: "เบอร์โทร", rtgs: "bəə thoh", vi: "số điện thoại", en: "phone number" },
      { th: "เติมเงิน", rtgs: "təəm ngən", vi: "nạp tiền", en: "top up" },
      { th: "วัน", rtgs: "wan", vi: "ngày", en: "day" },
    ],
    copy_paste: [
      "ขอซื้อซิมการ์ดแบบมีอินเทอร์เน็ต ใช้ได้ 15 วันครับ/ค่ะ นี่หนังสือเดินทางของผม/ฉัน",
      "ช่วยใส่ซิมและเปิดเน็ตให้หน่อยได้ไหมครับ/คะ เน็ตยังใช้ไม่ได้ครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Bạn cần SIM có data 15 ngày. Hãy hỏi mua, hỏi dùng được mấy ngày, và đưa hộ chiếu.",
      "Mạng không vào được. Hãy báo và nhờ lắp/kích hoạt giúp.",
    ],
    practice_prompts_en: [
      "You need a SIM with 15 days of data. Ask to buy one, ask how long it lasts, and hand over your passport.",
      "Your internet isn't working. Report it and ask them to install/activate it.",
    ],
  },

  // 13 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-13",
    category: "immigration",
    title_th: "ตรวจคนเข้าเมือง — สนามบิน",
    title_vi: "Xuất nhập cảnh — sân bay",
    title_en: "Immigration — airport",
    scenario_vi:
      "Qua cửa nhập cảnh (ตม.). Phần lớn nhân viên dùng tiếng Anh, nhưng vài câu tiếng Thái giúp suôn sẻ. Giữ vé bay khứ hồi và địa chỉ khách sạn.",
    scenario_en:
      "Going through immigration. Officers mostly use English, but a few Thai lines help. Keep your return ticket and hotel address handy.",
    phrases: [
      {
        th: "ผม/ฉันมาเที่ยวครับ/ค่ะ",
        rtgs: "phǒm/chǎn maa thîao khráp/khâ",
        vi: "Tôi đến du lịch.",
        en: "I'm here as a tourist.",
        note_vi: "Đi làm thì nói 'มาทำงาน' (maa tham-ngaan).",
      },
      {
        th: "ผม/ฉันจะอยู่ ... วัน",
        rtgs: "phǒm/chǎn jà yùu ... wan",
        vi: "Tôi sẽ ở ... ngày.",
        en: "I'll stay ... days.",
      },
      {
        th: "ผม/ฉันพักที่โรงแรม ...",
        rtgs: "phǒm/chǎn phák thîi rohng-raem ...",
        vi: "Tôi ở khách sạn ... .",
        en: "I'm staying at ... hotel.",
      },
      {
        th: "นี่ตั๋วเครื่องบินขากลับครับ/ค่ะ",
        rtgs: "nîi tǔa khrʉ̂ang-bin khǎa glàp khráp/khâ",
        vi: "Đây là vé máy bay khứ hồi.",
        en: "Here's my return ticket.",
      },
      {
        th: "วีซ่าของผม/ฉันอยู่ที่นี่ครับ/ค่ะ",
        rtgs: "wii-sâa khǎwng phǒm/chǎn yùu thîi-nîi khráp/khâ",
        vi: "Visa của tôi ở đây.",
        en: "My visa is right here.",
      },
    ],
    vocab: [
      { th: "ตรวจคนเข้าเมือง", rtgs: "trùat khon khâo mʉang", vi: "xuất nhập cảnh", en: "immigration" },
      { th: "ด่านตรวจ", rtgs: "dàan trùat", vi: "cửa kiểm tra", en: "checkpoint" },
      { th: "เที่ยวบิน", rtgs: "thîao bin", vi: "chuyến bay", en: "flight" },
      { th: "กระเป๋าเดินทาง", rtgs: "grà-pǎo dəən-thaang", vi: "vali / hành lý", en: "luggage" },
      { th: "ศุลกากร", rtgs: "sǔn-lá-gaa-gawn", vi: "hải quan", en: "customs" },
    ],
    copy_paste: [
      "ผม/ฉันมาเที่ยวครับ/ค่ะ จะอยู่ 10 วัน พักที่โรงแรม ... นี่ตั๋วขากลับครับ/ค่ะ",
      "วีซ่าและหนังสือเดินทางอยู่ที่นี่ครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Tại cửa nhập cảnh, hãy nói bạn đi du lịch, ở 10 ngày, ở khách sạn nào.",
      "Tập đưa vé khứ hồi và visa kèm câu nói tương ứng.",
    ],
    practice_prompts_en: [
      "At immigration, say you're a tourist, staying 10 days, and which hotel.",
      "Practice handing over your return ticket and visa with the matching lines.",
    ],
  },

  // 14 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-14",
    category: "work_first_day",
    title_th: "วันแรกที่ทำงาน — แนะนำตัว",
    title_vi: "Ngày đầu đi làm — giới thiệu bản thân",
    title_en: "First day at work — introducing yourself",
    scenario_vi:
      "Chào hỏi và giới thiệu với đồng nghiệp. Ở Thái, lịch sự và khiêm tốn rất được coi trọng. Chào bằng 'ไหว้' (wâi — chắp tay) khi gặp người lớn tuổi/cấp trên.",
    scenario_en:
      "Greeting and introducing yourself to colleagues. Politeness and humility matter a lot in Thailand. Greet elders/seniors with a 'wâi' (palms together).",
    phrases: [
      {
        th: "สวัสดีครับ/ค่ะ ผม/ฉันชื่อ ...",
        rtgs: "sà-wàt-dii khráp/khâ, phǒm/chǎn chʉ̂ʉ ...",
        vi: "Xin chào, tôi tên là ... .",
        en: "Hello, my name is ... .",
      },
      {
        th: "ยินดีที่ได้รู้จักครับ/ค่ะ",
        rtgs: "yin-dii thîi dâai rúu-jàk khráp/khâ",
        vi: "Rất vui được làm quen.",
        en: "Nice to meet you.",
      },
      {
        th: "วันนี้เป็นวันแรกของผม/ฉันครับ/ค่ะ",
        rtgs: "wan-níi pen wan râek khǎwng phǒm/chǎn khráp/khâ",
        vi: "Hôm nay là ngày đầu của tôi.",
        en: "Today is my first day.",
      },
      {
        th: "ฝากตัวด้วยนะครับ/คะ",
        rtgs: "fàak tua dûay ná khráp/khá",
        vi: "Mong mọi người giúp đỡ.",
        en: "Please look after me / I look forward to working with you.",
        note_vi: "Câu xã giao chuẩn của người mới — thể hiện sự khiêm tốn.",
      },
      {
        th: "ขอโทษครับ/ค่ะ ผม/ฉันยังไม่เข้าใจ ช่วยอธิบายอีกครั้งได้ไหมครับ/คะ",
        rtgs: "khǎw-thôot khráp/khâ, phǒm/chǎn yang mâi khâo-jai, chûay à-thí-baai ìik khráng dâi mǎi khráp/khá",
        vi: "Xin lỗi, tôi chưa hiểu, giải thích lại giúp được không?",
        en: "Sorry, I don't understand yet — could you explain again?",
      },
    ],
    vocab: [
      { th: "ทำงาน", rtgs: "tham-ngaan", vi: "làm việc", en: "to work" },
      { th: "เพื่อนร่วมงาน", rtgs: "phʉ̂an rûam ngaan", vi: "đồng nghiệp", en: "colleague" },
      { th: "หัวหน้า", rtgs: "hǔa-nâa", vi: "sếp / người quản lý", en: "boss / manager" },
      { th: "ออฟฟิศ", rtgs: "áwf-fít", vi: "văn phòng", en: "office" },
      { th: "ประชุม", rtgs: "prà-chum", vi: "họp", en: "meeting" },
    ],
    copy_paste: [
      "สวัสดีครับ/ค่ะ ผม/ฉันชื่อ ... วันนี้เป็นวันแรกของผม/ฉัน ยินดีที่ได้รู้จัก ฝากตัวด้วยนะครับ/คะ",
      "ขอโทษครับ/ค่ะ ผม/ฉันยังไม่เข้าใจ ช่วยอธิบายอีกครั้งได้ไหมครับ/คะ",
    ],
    practice_prompts_vi: [
      "Ngày đầu ở công ty mới. Hãy chào, giới thiệu tên, nói đây là ngày đầu và mong được giúp đỡ.",
      "Sếp giải thích nhiệm vụ nhưng bạn chưa hiểu. Hãy lịch sự nhờ giải thích lại.",
    ],
    practice_prompts_en: [
      "First day at a new company. Greet, give your name, say it's your first day, and ask them to look after you.",
      "Your boss explains a task but you didn't follow. Politely ask them to explain again.",
    ],
  },

  // 15 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-15",
    category: "getting_around",
    title_th: "พื้นฐาน — สุภาพและขอความช่วยเหลือ",
    title_vi: "Cơ bản — lịch sự và nhờ giúp đỡ",
    title_en: "Basics — politeness and asking for help",
    scenario_vi:
      "Bộ câu sống còn dùng mọi lúc: chào, cảm ơn, xin lỗi, nhờ giúp. Học thuộc lesson này trước tất cả các bài khác.",
    scenario_en:
      "The core set you use everywhere: greet, thank, apologize, ask for help. Learn this lesson before all the others.",
    phrases: [
      {
        th: "สวัสดีครับ/ค่ะ",
        rtgs: "sà-wàt-dii khráp/khâ",
        vi: "Xin chào.",
        en: "Hello.",
      },
      {
        th: "ขอบคุณครับ/ค่ะ",
        rtgs: "khàwp-khun khráp/khâ",
        vi: "Cảm ơn.",
        en: "Thank you.",
      },
      {
        th: "ขอโทษครับ/ค่ะ",
        rtgs: "khǎw-thôot khráp/khâ",
        vi: "Xin lỗi.",
        en: "Sorry / excuse me.",
      },
      {
        th: "ช่วยหน่อยได้ไหมครับ/คะ",
        rtgs: "chûay nòi dâi mǎi khráp/khá",
        vi: "Giúp tôi một chút được không?",
        en: "Can you help me?",
      },
      {
        th: "พูดช้าๆ ได้ไหมครับ/คะ",
        rtgs: "phûut cháa-cháa dâi mǎi khráp/khá",
        vi: "Nói chậm lại được không?",
        en: "Can you speak slowly?",
        note_vi: "Câu cứu cánh khi không nghe kịp tiếng Thái.",
      },
      {
        th: "ห้องน้ำอยู่ที่ไหนครับ/คะ",
        rtgs: "hâwng-náam yùu thîi-nǎi khráp/khá",
        vi: "Nhà vệ sinh ở đâu?",
        en: "Where is the toilet?",
      },
    ],
    vocab: [
      { th: "ใช่", rtgs: "châi", vi: "đúng / vâng", en: "yes / correct" },
      { th: "ไม่", rtgs: "mâi", vi: "không", en: "no / not" },
      { th: "ได้", rtgs: "dâi", vi: "được", en: "can / okay" },
      { th: "ไม่เป็นไร", rtgs: "mâi pen rai", vi: "không sao đâu", en: "no problem / never mind" },
      { th: "ห้องน้ำ", rtgs: "hâwng-náam", vi: "nhà vệ sinh", en: "toilet" },
    ],
    copy_paste: [
      "ขอโทษครับ/ค่ะ พูดช้าๆ ได้ไหมครับ/คะ ผม/ฉันพูดไทยไม่เก่ง",
      "ขอบคุณครับ/ค่ะ ช่วยหน่อยได้ไหมครับ/คะ ห้องน้ำอยู่ที่ไหนครับ/คะ",
    ],
    practice_prompts_vi: [
      "Tập một chuỗi lịch sự: chào → nhờ giúp → cảm ơn.",
      "Bạn không nghe kịp người Thái nói. Hãy nhờ họ nói chậm lại và hỏi nhà vệ sinh ở đâu.",
    ],
    practice_prompts_en: [
      "Practice a politeness chain: greet → ask for help → thank.",
      "You can't keep up with a Thai speaker. Ask them to slow down and ask where the toilet is.",
    ],
  },

  // 16 ──────────────────────────────────────────────────────────────────
  {
    id: "th-surv-16",
    category: "emergency",
    title_th: "เหตุฉุกเฉินทางการแพทย์ — โทร 1669",
    title_vi: "Cấp cứu y tế — gọi 1669",
    title_en: "Medical emergency — calling 1669",
    scenario_vi:
      "Khi gọi tổng đài cấp cứu 1669, cần nói rõ chuyện gì, ở đâu, và tình trạng người bệnh. Nói chậm, rõ địa điểm.",
    scenario_en:
      "When calling 1669, state clearly what happened, where you are, and the patient's condition. Speak slowly and give the location.",
    phrases: [
      {
        th: "มีคนหมดสติ",
        rtgs: "mii khon mòt sà-tì",
        vi: "Có người bất tỉnh.",
        en: "Someone is unconscious.",
      },
      {
        th: "มีคนบาดเจ็บหนัก",
        rtgs: "mii khon bàat-jèp nàk",
        vi: "Có người bị thương nặng.",
        en: "Someone is badly injured.",
      },
      {
        th: "เราอยู่ที่ ...",
        rtgs: "rao yùu thîi ...",
        vi: "Chúng tôi đang ở ... .",
        en: "We are at ... .",
        note_vi: "Điền địa chỉ/điểm mốc gần nhất. Có thể đọc địa chỉ tiếng Thái từ Google Maps.",
      },
      {
        th: "ส่งรถพยาบาลมาด่วนครับ/ค่ะ",
        rtgs: "sòng rót phá-yaa-baan maa dùan khráp/khâ",
        vi: "Cho xe cấp cứu tới gấp.",
        en: "Send an ambulance urgently.",
      },
      {
        th: "เขาหายใจไม่ออก / เขาเลือดออกเยอะ",
        rtgs: "kháo hǎai-jai mâi òk / kháo lʉ̂at àwk yə́",
        vi: "Người đó khó thở / chảy nhiều máu.",
        en: "They can't breathe / they're bleeding a lot.",
      },
    ],
    vocab: [
      { th: "หมดสติ", rtgs: "mòt sà-tì", vi: "bất tỉnh", en: "unconscious" },
      { th: "บาดเจ็บ", rtgs: "bàat-jèp", vi: "bị thương", en: "injured" },
      { th: "เลือดออก", rtgs: "lʉ̂at àwk", vi: "chảy máu", en: "bleeding" },
      { th: "ด่วน", rtgs: "dùan", vi: "gấp / khẩn", en: "urgent" },
      { th: "ที่อยู่", rtgs: "thîi yùu", vi: "địa chỉ", en: "address" },
    ],
    copy_paste: [
      "มีคนหมดสติและหายใจไม่ออก เราอยู่ที่ ... ส่งรถพยาบาลมาด่วนครับ/ค่ะ",
      "มีอุบัติเหตุ มีคนบาดเจ็บหนักและเลือดออกเยอะ ที่อยู่คือ ... โทร 1669 แล้วครับ/ค่ะ",
    ],
    practice_prompts_vi: [
      "Một người ngã bất tỉnh trước mặt bạn. Hãy gọi 1669 và nói tình trạng, địa điểm.",
      "Tập đọc to địa chỉ chỗ bạn đang đứng (lấy từ Google Maps) bằng mẫu 'เราอยู่ที่ ...'.",
    ],
    practice_prompts_en: [
      "Someone collapses unconscious in front of you. Call 1669 and state the condition and location.",
      "Practice reading aloud your current address (from Google Maps) with 'We are at ...'.",
    ],
  },
];

export default thaiSurvivalLessons;
