// src/languages/punjabi/readingBridgeA2.ts
//
// Punjabi A2 reading bridge for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiReadingBridgeA2Type =
  | "notice"
  | "appointment_reminder"
  | "school_note"
  | "workplace_message"
  | "housing_repair_message"
  | "transport_sign"
  | "service_sign";

export type PunjabiReadingBridgeA2Question = {
  q_vi: string;
  q_en: string;
  answer_vi: string;
  answer_en: string;
};

export type PunjabiReadingBridgeA2Vocab = {
  word: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiReadingBridgeA2Item = {
  id: string;
  type: PunjabiReadingBridgeA2Type;
  title_vi: string;
  title_en: string;
  text_pa: string;
  romanization: string;
  translation_vi: string;
  translation_en: string;
  reading_tip_vi: string;
  reading_tip_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  questions: PunjabiReadingBridgeA2Question[];
  vocab: PunjabiReadingBridgeA2Vocab[];
  learner_trap_vi: string;
  learner_trap_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong mục đọc này; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this reading item; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const readingBridgeA2: PunjabiReadingBridgeA2Item[] = [
  {
    id: "pa_a2_bridge_laundry_notice",
    type: "notice",
    title_vi: "Thông báo giặt đồ",
    title_en: "Laundry notice",
    text_pa: "ਸੂਚਨਾ: ਲਾਂਡਰੀ ਕਮਰਾ ਅੱਜ ਸ਼ਾਮ ਛੇ ਵਜੇ ਤੋਂ ਅੱਠ ਵਜੇ ਤੱਕ ਬੰਦ ਰਹੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਮਾਨ ਪਹਿਲਾਂ ਲੈ ਜਾਓ।",
    romanization: "soochna: laundry kamra ajj shaam chhe vaje ton atth vaje takk band rahega. kirpa karke apna samaan pehlan lai jao.",
    translation_vi: "Thông báo: Phòng giặt hôm nay sẽ đóng từ sáu giờ đến tám giờ tối. Vui lòng lấy đồ của bạn trước.",
    translation_en: "Notice: The laundry room will be closed today from six to eight in the evening. Please take your things beforehand.",
    reading_tip_vi: "Tìm cụm thời gian từ...đến: ਤੋਂ ... ਤੱਕ.",
    reading_tip_en: "Look for the from...to time frame: ਤੋਂ ... ਤੱਕ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Thông báo laundry room rất thường gặp trong apartment ở Canada.",
    canada_practical_en: "Laundry-room notices are common in Canadian apartment buildings.",
    questions: [
      { q_vi: "Phòng nào đóng?", q_en: "Which room is closed?", answer_vi: "Phòng giặt.", answer_en: "The laundry room." },
      { q_vi: "Đóng đến mấy giờ?", q_en: "Closed until what time?", answer_vi: "Đến tám giờ.", answer_en: "Until eight." },
    ],
    vocab: [
      { word: "ਸੂਚਨਾ", romanization: "soochna", vi: "thông báo", en: "notice" },
      { word: "ਬੰਦ", romanization: "band", vi: "đóng", en: "closed" },
      { word: "ਸਮਾਨ", romanization: "samaan", vi: "đồ đạc", en: "things/belongings" },
    ],
    learner_trap_vi: "ਤੱਕ = đến/tới hạn; đừng bỏ qua vì nó thay đổi thời gian kết thúc.",
    learner_trap_en: "ਤੱਕ = until/by; do not skip it because it marks the end time.",
  },
  {
    id: "pa_a2_bridge_clinic_reminder",
    type: "appointment_reminder",
    title_vi: "Nhắc lịch phòng khám",
    title_en: "Clinic reminder",
    text_pa: "ਯਾਦ ਦਿਹਾਨੀ: ਤੁਹਾਡੀ ਡਾਕਟਰ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਸਵੇਰੇ ਦਸ ਵਜੇ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਓ।",
    romanization: "yaad dihani: tuhadi daktar appointment somvaar savere das vaje hai. kirpa karke health card naal liaao.",
    translation_vi: "Nhắc nhở: Lịch hẹn bác sĩ của bạn là thứ Hai lúc mười giờ sáng. Vui lòng mang theo thẻ y tế.",
    translation_en: "Reminder: Your doctor appointment is Monday at ten in the morning. Please bring your health card.",
    reading_tip_vi: "Xác định ngày + giờ trước, rồi đọc yêu cầu cần mang gì.",
    reading_tip_en: "Identify day + time first, then read what you need to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਹੈਲਥ ਕਾਰਡ là từ mượn rất thực tế ở Canada.",
    canada_practical_en: "ਹੈਲਥ ਕਾਰਡ is a practical loanword in Canada.",
    questions: [
      { q_vi: "Lịch hẹn vào ngày nào?", q_en: "What day is the appointment?", answer_vi: "Thứ Hai.", answer_en: "Monday." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_vi: "Thẻ y tế.", answer_en: "A health card." },
    ],
    vocab: [
      { word: "ਯਾਦ ਦਿਹਾਨੀ", romanization: "yaad dihani", vi: "nhắc nhở", en: "reminder" },
      { word: "ਅਪਾਇੰਟਮੈਂਟ", romanization: "appointment", vi: "lịch hẹn", en: "appointment" },
      { word: "ਨਾਲ", romanization: "naal", vi: "cùng/với", en: "with" },
    ],
    learner_trap_vi: "ਤੁਹਾਡੀ agrees với ਅਪਾਇੰਟਮੈਂਟ; đừng đổi theo giới của người nhận.",
    learner_trap_en: "ਤੁਹਾਡੀ agrees with ਅਪਾਇੰਟਮੈਂਟ; do not change it by the recipient's gender.",
  },
  {
    id: "pa_a2_bridge_school_trip_note",
    type: "school_note",
    title_vi: "Ghi chú chuyến đi của trường",
    title_en: "School trip note",
    text_pa: "ਸਕੂਲ ਨੋਟ: ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਕਲਾਸ ਪਾਰਕ ਜਾਵੇਗੀ। ਬੱਚੇ ਪਾਣੀ ਦੀ ਬੋਤਲ ਅਤੇ ਲੰਚ ਨਾਲ ਲਿਆਉਣ।",
    romanization: "school note: shukkarvaar nu class park jaavegi. bachche paani di botal ate lunch naal liaun.",
    translation_vi: "Ghi chú của trường: Thứ Sáu lớp sẽ đi công viên. Trẻ em hãy mang chai nước và bữa trưa.",
    translation_en: "School note: On Friday the class will go to the park. Children should bring a water bottle and lunch.",
    reading_tip_vi: "Trong ghi chú trường học, tìm ngày, địa điểm, và đồ cần mang.",
    reading_tip_en: "In school notes, look for the day, place, and items to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਲੰਚ và ਬੋਤਲ là các từ rất thường gặp trong thông báo trường/daycare.",
    canada_practical_en: "ਲੰਚ and ਬੋਤਲ are common in school/daycare notes.",
    questions: [
      { q_vi: "Lớp đi đâu?", q_en: "Where is the class going?", answer_vi: "Công viên.", answer_en: "The park." },
      { q_vi: "Trẻ cần mang gì?", q_en: "What should children bring?", answer_vi: "Chai nước và bữa trưa.", answer_en: "A water bottle and lunch." },
    ],
    vocab: [
      { word: "ਕਲਾਸ", romanization: "class", vi: "lớp", en: "class" },
      { word: "ਬੋਤਲ", romanization: "botal", vi: "chai", en: "bottle" },
      { word: "ਲਿਆਉਣ", romanization: "liaun", vi: "mang đến", en: "bring" },
    ],
    learner_trap_vi: "ਜਾਵੇਗੀ agrees với ਕਲਾਸ giống cái trong mẫu này.",
    learner_trap_en: "ਜਾਵੇਗੀ agrees with feminine ਕਲਾਸ in this pattern.",
  },
  {
    id: "pa_a2_bridge_work_shift_message",
    type: "workplace_message",
    title_vi: "Tin nhắn đổi ca",
    title_en: "Shift-change message",
    text_pa: "ਹੈਲੋ ਟੀਮ, ਅੱਜ ਮੇਰਾ ਸ਼ਿਫ਼ਟ ਦੋ ਵਜੇ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ ਸ਼ੁਰੂ ਹੋਵੇਗਾ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ, ਮੈਨੂੰ ਮੈਸੇਜ ਕਰੋ।",
    romanization: "hello team, ajj mera shift do vaje di thaan tinn vaje shuru hovega. je koi sawaal hove, mainu message karo.",
    translation_vi: "Chào nhóm, hôm nay ca của tôi sẽ bắt đầu lúc ba giờ thay vì hai giờ. Nếu có câu hỏi, hãy nhắn cho tôi.",
    translation_en: "Hello team, today my shift will start at three instead of two. If there is any question, message me.",
    reading_tip_vi: "ਦੀ ਥਾਂ báo thông tin bị thay thế: không phải hai giờ, mà ba giờ.",
    reading_tip_en: "ਦੀ ਥਾਂ marks replacement: not two, but three.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਸ਼ਿਫ਼ਟ và ਮੈਸੇਜ rất thường gặp trong workplace Punjabi ở Canada.",
    canada_practical_en: "ਸ਼ਿਫ਼ਟ and ਮੈਸੇਜ are common in Canadian workplace Punjabi.",
    questions: [
      { q_vi: "Ca bắt đầu lúc mấy giờ?", q_en: "What time does the shift start?", answer_vi: "Ba giờ.", answer_en: "At three." },
      { q_vi: "Nếu có câu hỏi thì làm gì?", q_en: "What should you do if there is a question?", answer_vi: "Nhắn tin.", answer_en: "Send a message." },
    ],
    vocab: [
      { word: "ਸ਼ਿਫ਼ਟ", romanization: "shift", vi: "ca làm", en: "shift" },
      { word: "ਦੀ ਥਾਂ", romanization: "di thaan", vi: "thay vì", en: "instead of" },
      { word: "ਸਵਾਲ", romanization: "sawaal", vi: "câu hỏi", en: "question" },
    ],
    learner_trap_vi: "ਦੀ ਥਾਂ không chỉ là 'chỗ của'; trong tin nhắn này là 'thay vì'.",
    learner_trap_en: "ਦੀ ਥਾਂ is not only 'place of'; in this message it means 'instead of'.",
  },
  {
    id: "pa_a2_bridge_housing_repair_text",
    type: "housing_repair_message",
    title_vi: "Tin nhắn sửa nhà",
    title_en: "Housing repair text",
    text_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। ਕੀ ਤੁਸੀਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?",
    romanization: "sat sri akal, rasoi vich paani leak ho riha hai. ki tusi kal savere aa ke dekh sakde ho?",
    translation_vi: "Xin chào, nước đang rò trong bếp. Bạn có thể đến xem vào sáng mai không?",
    translation_en: "Hello, water is leaking in the kitchen. Can you come and look tomorrow morning?",
    reading_tip_vi: "Đọc vị trí trước: ਰਸੋਈ ਵਿੱਚ. Sau đó đọc vấn đề: ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ.",
    reading_tip_en: "Read the location first: ਰਸੋਈ ਵਿੱਚ. Then read the problem: ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Tin nhắn landlord/building manager thường dùng loanword ਲੀਕ.",
    canada_practical_en: "Landlord/building-manager texts often use the loanword ਲੀਕ.",
    questions: [
      { q_vi: "Vấn đề ở đâu?", q_en: "Where is the problem?", answer_vi: "Trong bếp.", answer_en: "In the kitchen." },
      { q_vi: "Người viết muốn người kia đến khi nào?", q_en: "When does the writer want the person to come?", answer_vi: "Sáng mai.", answer_en: "Tomorrow morning." },
    ],
    vocab: [
      { word: "ਰਸੋਈ", romanization: "rasoi", vi: "bếp", en: "kitchen" },
      { word: "ਲੀਕ", romanization: "leak", vi: "rò rỉ", en: "leak" },
      { word: "ਦੇਖ ਸਕਦੇ ਹੋ", romanization: "dekh sakde ho", vi: "có thể xem", en: "can look/check" },
    ],
    learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; ở đây đi với request tương lai nên là ngày mai.",
    learner_trap_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow; here the future request makes it tomorrow.",
  },
  {
    id: "pa_a2_bridge_bus_stop_sign",
    type: "transport_sign",
    title_vi: "Biển báo trạm xe buýt",
    title_en: "Bus stop sign",
    text_pa: "ਬੱਸ ਸਟਾਪ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਰੂਟ 12 ਲਈ ਨਵਾਂ ਸਟਾਪ ਮੇਨ ਸਟਰੀਟ ਤੇ ਹੈ।",
    romanization: "bass stop badlia gia hai. route 12 lai nava stop main street te hai.",
    translation_vi: "Trạm xe buýt đã được đổi. Với tuyến 12, trạm mới ở Main Street.",
    translation_en: "The bus stop has been changed. For Route 12, the new stop is on Main Street.",
    reading_tip_vi: "ਲਈ cho biết thông tin áp dụng cho tuyến nào.",
    reading_tip_en: "ਲਈ tells you which route the information applies to.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Tên route và street thường giữ dạng tiếng Anh trong Punjabi Canada.",
    canada_practical_en: "Route and street names often remain in English in Canadian Punjabi.",
    questions: [
      { q_vi: "Tuyến nào bị ảnh hưởng?", q_en: "Which route is affected?", answer_vi: "Tuyến 12.", answer_en: "Route 12." },
      { q_vi: "Trạm mới ở đâu?", q_en: "Where is the new stop?", answer_vi: "Main Street.", answer_en: "Main Street." },
    ],
    vocab: [
      { word: "ਬਦਲਿਆ ਗਿਆ", romanization: "badlia gia", vi: "đã được đổi", en: "was changed" },
      { word: "ਰੂਟ", romanization: "route", vi: "tuyến", en: "route" },
      { word: "ਨਵਾਂ", romanization: "nava", vi: "mới", en: "new" },
    ],
    learner_trap_vi: "ਬਦਲਿਆ ਗਿਆ là dạng bị động/kết quả; không cần biết ai đổi trạm.",
    learner_trap_en: "ਬਦਲਿਆ ਗਿਆ is passive/result-like; you do not need to know who changed the stop.",
  },
  {
    id: "pa_a2_bridge_library_service_sign",
    type: "service_sign",
    title_vi: "Biển dịch vụ thư viện",
    title_en: "Library service sign",
    text_pa: "ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣ ਲਈ ਆਈਡੀ ਅਤੇ ਪਤੇ ਦਾ ਸਬੂਤ ਲਿਆਓ। ਸੇਵਾ ਡੈਸਕ ਸਵੇਰੇ ਨੌਂ ਵਜੇ ਖੁੱਲਦਾ ਹੈ।",
    romanization: "library card banvaun lai ID ate pate da saboot liaao. seva desk savere naun vaje khulda hai.",
    translation_vi: "Để làm thẻ thư viện, hãy mang ID và bằng chứng địa chỉ. Quầy dịch vụ mở lúc chín giờ sáng.",
    translation_en: "To get a library card made, bring ID and proof of address. The service desk opens at nine in the morning.",
    reading_tip_vi: "ਲਈ ở đây nghĩa là 'để'. Tìm danh sách giấy tờ sau đó.",
    reading_tip_en: "ਲਈ here means 'in order to'. Then find the document list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Proof of address là yêu cầu phổ biến ở thư viện/dịch vụ Canada.",
    canada_practical_en: "Proof of address is common at Canadian libraries/services.",
    questions: [
      { q_vi: "Cần mang giấy tờ gì?", q_en: "What documents should be brought?", answer_vi: "ID và bằng chứng địa chỉ.", answer_en: "ID and proof of address." },
      { q_vi: "Quầy mở lúc mấy giờ?", q_en: "What time does the desk open?", answer_vi: "Chín giờ sáng.", answer_en: "Nine in the morning." },
    ],
    vocab: [
      { word: "ਬਣਵਾਉਣ ਲਈ", romanization: "banvaun lai", vi: "để làm/được cấp", en: "to get made" },
      { word: "ਸਬੂਤ", romanization: "saboot", vi: "bằng chứng", en: "proof" },
      { word: "ਖੁੱਲਦਾ", romanization: "khulda", vi: "mở", en: "opens" },
    ],
    learner_trap_vi: "ਬਣਾਉਣਾ = tự làm; ਬਣਵਾਉਣਾ = làm/được cấp qua người/dịch vụ khác.",
    learner_trap_en: "ਬਣਾਉਣਾ = make yourself; ਬਣਵਾਉਣਾ = get made through someone/a service.",
  },
  {
    id: "pa_a2_bridge_daycare_pickup_note",
    type: "school_note",
    title_vi: "Ghi chú đón trẻ",
    title_en: "Daycare pickup note",
    text_pa: "ਪਿਕਅੱਪ ਨੋਟ: ਅੱਜ ਬੱਚਿਆਂ ਨੂੰ ਚਾਰ ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਲੈ ਜਾਓ। ਸਟਾਫ਼ ਮੀਟਿੰਗ ਚਾਰ ਵਜੇ ਸ਼ੁਰੂ ਹੋਵੇਗੀ।",
    romanization: "pickup note: ajj bachchian nu chaar vaje ton pehlan lai jao. staff meeting chaar vaje shuru hovegi.",
    translation_vi: "Ghi chú đón trẻ: Hôm nay hãy đón trẻ trước bốn giờ. Cuộc họp nhân viên sẽ bắt đầu lúc bốn giờ.",
    translation_en: "Pickup note: Today pick up the children before four. The staff meeting will start at four.",
    reading_tip_vi: "ਤੋਂ ਪਹਿਲਾਂ = trước. Đây là cụm quan trọng nhất trong ghi chú.",
    reading_tip_en: "ਤੋਂ ਪਹਿਲਾਂ = before. This is the key phrase in the note.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਪਿਕਅੱਪ và ਸਟਾਫ਼ ਮੀਟਿੰਗ là loanwords thường gặp ở daycare Canada.",
    canada_practical_en: "ਪਿਕਅੱਪ and ਸਟਾਫ਼ ਮੀਟਿੰਗ are common loanwords in Canadian daycare contexts.",
    questions: [
      { q_vi: "Cần đón trẻ trước mấy giờ?", q_en: "Before what time should children be picked up?", answer_vi: "Trước bốn giờ.", answer_en: "Before four." },
      { q_vi: "Vì sao?", q_en: "Why?", answer_vi: "Vì họp nhân viên bắt đầu lúc bốn giờ.", answer_en: "Because the staff meeting starts at four." },
    ],
    vocab: [
      { word: "ਪਿਕਅੱਪ", romanization: "pickup", vi: "đón", en: "pickup" },
      { word: "ਤੋਂ ਪਹਿਲਾਂ", romanization: "ton pehlan", vi: "trước", en: "before" },
      { word: "ਸ਼ੁਰੂ", romanization: "shuru", vi: "bắt đầu", en: "start" },
    ],
    learner_trap_vi: "ਪਹਿਲਾਂ không phải 'đầu tiên' trong mọi ngữ cảnh; sau ਤੋਂ nó là 'trước'.",
    learner_trap_en: "ਪਹਿਲਾਂ is not always 'first'; after ਤੋਂ it means 'before'.",
  },
  {
    id: "pa_a2_bridge_counter_hours_notice",
    type: "service_sign",
    title_vi: "Giờ mở quầy",
    title_en: "Counter hours notice",
    text_pa: "ਸੇਵਾ ਕਾਊਂਟਰ ਦੁਪਹਿਰ ਇੱਕ ਵਜੇ ਤੋਂ ਦੋ ਵਜੇ ਤੱਕ ਬੰਦ ਰਹੇਗਾ। ਨੰਬਰ ਲੈ ਕੇ ਉਡੀਕ ਕਰੋ।",
    romanization: "seva counter dupahar ikk vaje ton do vaje takk band rahega. number lai ke udeek karo.",
    translation_vi: "Quầy dịch vụ sẽ đóng từ một giờ đến hai giờ trưa. Lấy số và chờ.",
    translation_en: "The service counter will be closed from one to two in the afternoon. Take a number and wait.",
    reading_tip_vi: "Đọc thời gian đóng trước, rồi đọc hành động cần làm: lấy số và chờ.",
    reading_tip_en: "Read the closed time first, then the required action: take a number and wait.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Queue number systems phổ biến ở public-service counters.",
    canada_practical_en: "Queue-number systems are common at public-service counters.",
    questions: [
      { q_vi: "Quầy đóng trong khoảng nào?", q_en: "When is the counter closed?", answer_vi: "Từ một đến hai giờ.", answer_en: "From one to two." },
      { q_vi: "Bạn phải làm gì?", q_en: "What should you do?", answer_vi: "Lấy số và chờ.", answer_en: "Take a number and wait." },
    ],
    vocab: [
      { word: "ਕਾਊਂਟਰ", romanization: "counter", vi: "quầy", en: "counter" },
      { word: "ਉਡੀਕ ਕਰੋ", romanization: "udeek karo", vi: "hãy chờ", en: "wait" },
      { word: "ਨੰਬਰ", romanization: "number", vi: "số thứ tự", en: "number" },
    ],
    learner_trap_vi: "ਲੈ ਕੇ nối hai hành động: lấy số rồi chờ.",
    learner_trap_en: "ਲੈ ਕੇ links two actions: take a number and then wait.",
  },
  {
    id: "pa_a2_bridge_apartment_fire_notice",
    type: "notice",
    title_vi: "Thông báo kiểm tra báo cháy",
    title_en: "Fire alarm test notice",
    text_pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਸ ਵਜੇ ਫਾਇਰ ਅਲਾਰਮ ਦੀ ਜਾਂਚ ਹੋਵੇਗੀ। ਆਵਾਜ਼ ਉੱਚੀ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਮਾਰਤ ਖਾਲੀ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ।",
    romanization: "kal savere das vaje fire alarm di jaanch hovegi. aawaz uchchi ho sakdi hai, par imarat khali karan di lor nahi.",
    translation_vi: "Sáng mai lúc mười giờ sẽ có kiểm tra chuông báo cháy. Âm thanh có thể lớn, nhưng không cần sơ tán tòa nhà.",
    translation_en: "Tomorrow morning at ten there will be a fire alarm test. The sound may be loud, but there is no need to empty/evacuate the building.",
    reading_tip_vi: "ਪਰ báo tương phản: có tiếng lớn, nhưng không cần rời tòa nhà.",
    reading_tip_en: "ਪਰ marks contrast: loud sound, but no need to leave the building.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Fire alarm tests rất thường gặp trong apartment/condo Canada.",
    canada_practical_en: "Fire alarm tests are common in Canadian apartments/condos.",
    questions: [
      { q_vi: "Kiểm tra lúc mấy giờ?", q_en: "What time is the test?", answer_vi: "Mười giờ sáng.", answer_en: "Ten in the morning." },
      { q_vi: "Có cần rời tòa nhà không?", q_en: "Is there a need to leave the building?", answer_vi: "Không.", answer_en: "No." },
    ],
    vocab: [
      { word: "ਜਾਂਚ", romanization: "jaanch", vi: "kiểm tra", en: "test/check" },
      { word: "ਆਵਾਜ਼", romanization: "aawaz", vi: "âm thanh", en: "sound/voice" },
      { word: "ਲੋੜ", romanization: "lor", vi: "nhu cầu/cần thiết", en: "need" },
    ],
    learner_trap_vi: "ਖਾਲੀ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ nghĩa là không cần rời/sơ tán, không phải 'tòa nhà không trống'.",
    learner_trap_en: "ਖਾਲੀ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ means no need to evacuate/empty, not 'the building is not empty'.",
  },
];
