// src/languages/punjabi/messageComprehensionA2.ts
//
// Punjabi A2 short-message comprehension for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.

export type PunjabiMessageComprehensionA2Type =
  | "appointment_reminder"
  | "transport_notice"
  | "school_note"
  | "housing_repair_message"
  | "workplace_schedule_note"
  | "service_counter_instruction"
  | "polite_follow_up_response";

export type PunjabiMessageComprehensionA2Mode =
  | "navigation"
  | "review"
  | "remediation"
  | "readiness";

export type PunjabiMessageComprehensionA2Question = {
  q_vi: string;
  q_en: string;
  answer_vi: string;
  answer_en: string;
};

export type PunjabiMessageComprehensionA2Response = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiMessageComprehensionA2Trap = {
  trap_vi: string;
  trap_en: string;
  focus_pa: string;
  focus_romanization: string;
};

export type PunjabiMessageComprehensionA2Item = {
  id: string;
  type: PunjabiMessageComprehensionA2Type;
  mode: PunjabiMessageComprehensionA2Mode;
  title_vi: string;
  title_en: string;
  message_pa: string;
  romanization: string;
  translation_vi: string;
  translation_en: string;
  comprehension_goal_vi: string;
  comprehension_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  questions: PunjabiMessageComprehensionA2Question[];
  suggested_reply: PunjabiMessageComprehensionA2Response;
  traps: PunjabiMessageComprehensionA2Trap[];
  navigation_hint_vi: string;
  navigation_hint_en: string;
  remediation_vi: string;
  remediation_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong pack đọc tin nhắn; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this message pack; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const messageComprehensionA2: PunjabiMessageComprehensionA2Item[] = [
  {
    id: "pa_a2_msg_clinic_reminder",
    type: "appointment_reminder",
    mode: "navigation",
    title_vi: "Nhắc lịch phòng khám",
    title_en: "Clinic appointment reminder",
    message_pa: "ਯਾਦ ਦਿਹਾਨੀ: ਤੁਹਾਡੀ ਡਾਕਟਰ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਸਵੇਰੇ ਦਸ ਵਜੇ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਓ।",
    romanization: "yaad dihani: tuhadi daktar appointment somvaar savere das vaje hai. kirpa karke health card naal liaao.",
    translation_vi: "Nhắc nhở: Lịch hẹn bác sĩ của bạn là thứ Hai lúc mười giờ sáng. Vui lòng mang theo thẻ y tế.",
    translation_en: "Reminder: Your doctor appointment is Monday at ten in the morning. Please bring your health card.",
    comprehension_goal_vi: "Tìm ngày, giờ, và thứ cần mang.",
    comprehension_goal_en: "Find the day, time, and item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਹੈਲਥ ਕਾਰਡ là từ mượn thực tế trong bối cảnh Canada.",
    canada_practical_en: "ਹੈਲਥ ਕਾਰਡ is a practical loanword in Canadian contexts.",
    questions: [
      { q_vi: "Lịch hẹn vào ngày nào?", q_en: "What day is the appointment?", answer_vi: "Thứ Hai.", answer_en: "Monday." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    suggested_reply: { pa: "ਧੰਨਵਾਦ, ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਲਿਆਵਾਂਗਾ।", romanization: "dhannvaad, main health card liaavanga.", vi: "Cảm ơn, tôi sẽ mang thẻ y tế. (nam)", en: "Thank you, I will bring the health card. (male speaker)" },
    traps: [
      { trap_vi: "ਤੁਹਾਡੀ agrees với ਅਪਾਇੰਟਮੈਂਟ, không đổi theo giới người nhận.", trap_en: "ਤੁਹਾਡੀ agrees with ਅਪਾਇੰਟਮੈਂਟ, not the recipient's gender.", focus_pa: "ਤੁਹਾਡੀ ਅਪਾਇੰਟਮੈਂਟ", focus_romanization: "tuhadi appointment" },
    ],
    navigation_hint_vi: "Đọc theo thứ tự: reminder type → day/time → action required.",
    navigation_hint_en: "Read in order: reminder type → day/time → required action.",
    remediation_vi: "Nếu nhầm giờ, ôn cụm số + ਵਜੇ.",
    remediation_en: "If time is missed, review number + ਵਜੇ.",
  },
  {
    id: "pa_a2_msg_dentist_change",
    type: "appointment_reminder",
    mode: "review",
    title_vi: "Đổi giờ nha sĩ",
    title_en: "Dentist time change",
    message_pa: "ਤੁਹਾਡੀ ਡੈਂਟਿਸਟ ਅਪਾਇੰਟਮੈਂਟ ਹੁਣ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਜਵਾਬ ਦਿਓ।",
    romanization: "tuhadi dentist appointment hun budhvaar do vaje di thaan tinn vaje hai. kirpa karke jawab dio.",
    translation_vi: "Lịch hẹn nha sĩ của bạn bây giờ là thứ Tư lúc ba giờ thay vì hai giờ. Vui lòng trả lời.",
    translation_en: "Your dentist appointment is now Wednesday at three instead of two. Please reply.",
    comprehension_goal_vi: "Nhận ra thông tin cũ bị thay bằng thông tin mới.",
    comprehension_goal_en: "Recognize the old detail replaced by the new one.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਡੈਂਟਿਸਟ và ਅਪਾਇੰਟਮੈਂਟ thường dùng như loanwords.",
    canada_practical_en: "ਡੈਂਟਿਸਟ and ਅਪਾਇੰਟਮੈਂਟ are often used as loanwords.",
    questions: [
      { q_vi: "Giờ mới là mấy giờ?", q_en: "What is the new time?", answer_vi: "Ba giờ.", answer_en: "Three." },
      { q_vi: "Giờ cũ là mấy giờ?", q_en: "What was the old time?", answer_vi: "Hai giờ.", answer_en: "Two." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਤਿੰਨ ਵਜੇ ਆਵਾਂਗੀ।", romanization: "theek hai, main tinn vaje aavangi.", vi: "Được, tôi sẽ đến lúc ba giờ. (nữ)", en: "Okay, I will come at three. (female speaker)" },
    traps: [
      { trap_vi: "ਦੀ ਥਾਂ nghĩa là 'thay vì', không chỉ 'chỗ của'.", trap_en: "ਦੀ ਥਾਂ means 'instead of', not only 'place of'.", focus_pa: "ਦੋ ਵਜੇ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ", focus_romanization: "do vaje di thaan tinn vaje" },
    ],
    navigation_hint_vi: "Tìm ਹੁਣ để biết thông tin mới.",
    navigation_hint_en: "Look for ਹੁਣ to identify the new information.",
    remediation_vi: "Nếu nhầm cũ/mới, ôn ਦੀ ਥਾਂ.",
    remediation_en: "If old/new details are confused, review ਦੀ ਥਾਂ.",
  },
  {
    id: "pa_a2_msg_bus_stop_change",
    type: "transport_notice",
    mode: "navigation",
    title_vi: "Thông báo đổi trạm xe buýt",
    title_en: "Bus stop change notice",
    message_pa: "ਬੱਸ ਸਟਾਪ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਰੂਟ 12 ਲਈ ਨਵਾਂ ਸਟਾਪ ਮੇਨ ਸਟਰੀਟ ਤੇ ਹੈ।",
    romanization: "bass stop badlia gia hai. route 12 lai nava stop main street te hai.",
    translation_vi: "Trạm xe buýt đã được đổi. Với tuyến 12, trạm mới ở Main Street.",
    translation_en: "The bus stop has been changed. For Route 12, the new stop is on Main Street.",
    comprehension_goal_vi: "Xác định tuyến bị ảnh hưởng và trạm mới.",
    comprehension_goal_en: "Identify the affected route and the new stop.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Route/street names thường giữ dạng tiếng Anh trong Punjabi Canada.",
    canada_practical_en: "Route/street names often remain in English in Canadian Punjabi.",
    questions: [
      { q_vi: "Tuyến nào bị ảnh hưởng?", q_en: "Which route is affected?", answer_vi: "Tuyến 12.", answer_en: "Route 12." },
      { q_vi: "Trạm mới ở đâu?", q_en: "Where is the new stop?", answer_vi: "Main Street.", answer_en: "Main Street." },
    ],
    suggested_reply: { pa: "ਧੰਨਵਾਦ, ਮੈਂ ਨਵੇਂ ਸਟਾਪ ਤੇ ਜਾਵਾਂਗਾ।", romanization: "dhannvaad, main nave stop te javanga.", vi: "Cảm ơn, tôi sẽ đi đến trạm mới. (nam)", en: "Thanks, I will go to the new stop. (male speaker)" },
    traps: [
      { trap_vi: "ਲਈ cho biết thông tin áp dụng cho tuyến nào.", trap_en: "ਲਈ tells which route the information applies to.", focus_pa: "ਰੂਟ 12 ਲਈ", focus_romanization: "route 12 lai" },
    ],
    navigation_hint_vi: "Tìm route number trước, rồi tìm ਨਵਾਂ ਸਟਾਪ.",
    navigation_hint_en: "Find the route number first, then ਨਵਾਂ ਸਟਾਪ.",
    remediation_vi: "Nếu bỏ sót route, ôn ਲਈ.",
    remediation_en: "If the route is missed, review ਲਈ.",
  },
  {
    id: "pa_a2_msg_train_delay",
    type: "transport_notice",
    mode: "readiness",
    title_vi: "Thông báo tàu trễ",
    title_en: "Train delay notice",
    message_pa: "ਟ੍ਰੇਨ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵੇਗੀ। ਅਗਲਾ ਅਪਡੇਟ ਦਸ ਮਿੰਟ ਵਿੱਚ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
    romanization: "train pandran mint der naal aavegi. agla update das mint vich ditta jaavega.",
    translation_vi: "Tàu sẽ đến muộn mười lăm phút. Cập nhật tiếp theo sẽ được đưa ra trong mười phút.",
    translation_en: "The train will arrive fifteen minutes late. The next update will be given in ten minutes.",
    comprehension_goal_vi: "Tìm độ trễ và thời điểm cập nhật tiếp theo.",
    comprehension_goal_en: "Find the delay length and next update timing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Train/update là loanwords thực tế trong thông báo transit.",
    canada_practical_en: "Train/update are practical loanwords in transit notices.",
    questions: [
      { q_vi: "Tàu trễ bao lâu?", q_en: "How late is the train?", answer_vi: "Mười lăm phút.", answer_en: "Fifteen minutes." },
      { q_vi: "Khi nào có cập nhật tiếp theo?", q_en: "When is the next update?", answer_vi: "Trong mười phút.", answer_en: "In ten minutes." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਉਡੀਕ ਕਰਾਂਗਾ।", romanization: "theek hai, main udeek karanga.", vi: "Được, tôi sẽ chờ. (nam)", en: "Okay, I will wait. (male speaker)" },
    traps: [
      { trap_vi: "ਦੇਰ ਨਾਲ = muộn; ਵਿੱਚ trong câu sau nghĩa là 'trong vòng/sau'.", trap_en: "ਦੇਰ ਨਾਲ = late; ਵਿੱਚ in the next sentence means in/within.", focus_pa: "ਦਸ ਮਿੰਟ ਵਿੱਚ", focus_romanization: "das mint vich" },
    ],
    navigation_hint_vi: "Tách hai số: độ trễ và thời gian update.",
    navigation_hint_en: "Separate the two numbers: delay length and update time.",
    remediation_vi: "Nếu nhầm hai số, gạch chân ਮਿੰਟ đầu và ਮਿੰਟ sau.",
    remediation_en: "If the numbers are confused, underline the first ਮਿੰਟ and the later ਮਿੰਟ.",
  },
  {
    id: "pa_a2_msg_school_trip",
    type: "school_note",
    mode: "review",
    title_vi: "Ghi chú chuyến đi trường",
    title_en: "School trip note",
    message_pa: "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਕਲਾਸ ਪਾਰਕ ਜਾਵੇਗੀ। ਬੱਚੇ ਪਾਣੀ ਦੀ ਬੋਤਲ ਅਤੇ ਲੰਚ ਨਾਲ ਲਿਆਉਣ।",
    romanization: "shukkarvaar nu class park jaavegi. bachche paani di botal ate lunch naal liaun.",
    translation_vi: "Thứ Sáu lớp sẽ đi công viên. Trẻ em hãy mang chai nước và bữa trưa.",
    translation_en: "On Friday the class will go to the park. Children should bring a water bottle and lunch.",
    comprehension_goal_vi: "Tìm ngày, nơi đi, và đồ cần mang.",
    comprehension_goal_en: "Find the day, destination, and items to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Lunch/water bottle là thông tin rất hay gặp trong school/daycare notes.",
    canada_practical_en: "Lunch/water bottle information is common in school/daycare notes.",
    questions: [
      { q_vi: "Lớp đi đâu?", q_en: "Where is the class going?", answer_vi: "Công viên.", answer_en: "The park." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_vi: "Chai nước và bữa trưa.", answer_en: "A water bottle and lunch." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਬੱਚਾ ਪਾਣੀ ਅਤੇ ਲੰਚ ਲਿਆਵੇਗਾ।", romanization: "theek hai, bachcha paani ate lunch liaavega.", vi: "Được, trẻ sẽ mang nước và bữa trưa.", en: "Okay, the child will bring water and lunch." },
    traps: [
      { trap_vi: "ਨਾਲ ở đây nghĩa là mang theo/cùng với.", trap_en: "ਨਾਲ here means along/with, as in bring along.", focus_pa: "ਲੰਚ ਨਾਲ ਲਿਆਉਣ", focus_romanization: "lunch naal liaun" },
    ],
    navigation_hint_vi: "School note thường có: day → place → items.",
    navigation_hint_en: "School notes often have: day → place → items.",
    remediation_vi: "Nếu bỏ sót đồ cần mang, ôn ਨਾਲ ਲਿਆਉਣ.",
    remediation_en: "If the required items are missed, review ਨਾਲ ਲਿਆਉਣ.",
  },
  {
    id: "pa_a2_msg_daycare_pickup",
    type: "school_note",
    mode: "navigation",
    title_vi: "Ghi chú đón trẻ",
    title_en: "Daycare pickup note",
    message_pa: "ਅੱਜ ਬੱਚਿਆਂ ਨੂੰ ਚਾਰ ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਲੈ ਜਾਓ। ਸਟਾਫ਼ ਮੀਟਿੰਗ ਚਾਰ ਵਜੇ ਸ਼ੁਰੂ ਹੋਵੇਗੀ।",
    romanization: "ajj bachchian nu chaar vaje ton pehlan lai jao. staff meeting chaar vaje shuru hovegi.",
    translation_vi: "Hôm nay hãy đón trẻ trước bốn giờ. Cuộc họp nhân viên sẽ bắt đầu lúc bốn giờ.",
    translation_en: "Today pick up the children before four. The staff meeting will start at four.",
    comprehension_goal_vi: "Tìm deadline đón trẻ và lý do.",
    comprehension_goal_en: "Find the pickup deadline and the reason.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Pickup/daycare/staff meeting là bối cảnh rất thực tế ở Canada.",
    canada_practical_en: "Pickup/daycare/staff meeting is a practical Canadian context.",
    questions: [
      { q_vi: "Cần đón trẻ trước mấy giờ?", q_en: "Before what time should children be picked up?", answer_vi: "Trước bốn giờ.", answer_en: "Before four." },
      { q_vi: "Vì sao?", q_en: "Why?", answer_vi: "Vì họp nhân viên bắt đầu lúc bốn giờ.", answer_en: "Because a staff meeting starts at four." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਚਾਰ ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਆਵਾਂਗੀ।", romanization: "theek hai, main chaar vaje ton pehlan aavangi.", vi: "Được, tôi sẽ đến trước bốn giờ. (nữ)", en: "Okay, I will come before four. (female speaker)" },
    traps: [
      { trap_vi: "ਤੋਂ ਪਹਿਲਾਂ = trước, không chỉ 'trước tiên'.", trap_en: "ਤੋਂ ਪਹਿਲਾਂ = before, not only 'first'.", focus_pa: "ਚਾਰ ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ", focus_romanization: "chaar vaje ton pehlan" },
    ],
    navigation_hint_vi: "Từ khóa quan trọng là ਤੋਂ ਪਹਿਲਾਂ.",
    navigation_hint_en: "The key phrase is ਤੋਂ ਪਹਿਲਾਂ.",
    remediation_vi: "Nếu nhầm giờ, ôn ਤੋਂ ਪਹਿਲਾਂ vs ਤੱਕ.",
    remediation_en: "If timing is confused, review ਤੋਂ ਪਹਿਲਾਂ vs ਤੱਕ.",
  },
  {
    id: "pa_a2_msg_housing_repair",
    type: "housing_repair_message",
    mode: "remediation",
    title_vi: "Tin nhắn sửa nhà",
    title_en: "Housing repair message",
    message_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। ਕੀ ਤੁਸੀਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?",
    romanization: "sat sri akal, rasoi vich paani leak ho riha hai. ki tusi kal savere aa ke dekh sakde ho?",
    translation_vi: "Xin chào, nước đang rò trong bếp. Bạn có thể đến xem vào sáng mai không?",
    translation_en: "Hello, water is leaking in the kitchen. Can you come and look tomorrow morning?",
    comprehension_goal_vi: "Tìm vị trí vấn đề, vấn đề, và request.",
    comprehension_goal_en: "Find the problem location, the issue, and the request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Landlord/building manager messages often mix loanwords like ਲੀਕ.",
    canada_practical_en: "Landlord/building-manager messages often mix loanwords like ਲੀਕ.",
    questions: [
      { q_vi: "Vấn đề ở đâu?", q_en: "Where is the problem?", answer_vi: "Trong bếp.", answer_en: "In the kitchen." },
      { q_vi: "Người viết muốn gì?", q_en: "What does the writer want?", answer_vi: "Muốn người kia đến xem sáng mai.", answer_en: "They want the person to come and look tomorrow morning." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਆਵਾਂਗਾ।", romanization: "theek hai, main kal savere aavanga.", vi: "Được, tôi sẽ đến sáng mai. (nam)", en: "Okay, I will come tomorrow morning. (male speaker)" },
    traps: [
      { trap_vi: "ਕੱਲ੍ਹ cần ngữ cảnh; với request tương lai là ngày mai.", trap_en: "ਕੱਲ੍ਹ needs context; with a future request it means tomorrow.", focus_pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ", focus_romanization: "kal savere" },
    ],
    navigation_hint_vi: "Đọc theo khung: greeting → issue → request.",
    navigation_hint_en: "Read by frame: greeting → issue → request.",
    remediation_vi: "Nếu không thấy request, tìm ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
    remediation_en: "If the request is missed, look for ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
  },
  {
    id: "pa_a2_msg_heater_followup",
    type: "housing_repair_message",
    mode: "readiness",
    title_vi: "Follow-up sửa heater",
    title_en: "Heater repair follow-up",
    message_pa: "ਹੀਟਰ ਅਜੇ ਵੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਫਿਰ ਦੇਖ ਲਓ।",
    romanization: "heater aje vi kamm nahi kar riha. kirpa karke ajj phir dekh lao.",
    translation_vi: "Máy sưởi vẫn chưa hoạt động. Vui lòng hôm nay xem lại giúp.",
    translation_en: "The heater still is not working. Please look at it again today.",
    comprehension_goal_vi: "Nhận ra đây là follow-up: vấn đề vẫn còn.",
    comprehension_goal_en: "Recognize this as a follow-up: the problem remains.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater follow-up messages are practical in winter housing contexts.",
    canada_practical_en: "Heater follow-up messages are practical in winter housing contexts.",
    questions: [
      { q_vi: "Vấn đề đã được giải quyết chưa?", q_en: "Has the problem been fixed?", answer_vi: "Chưa.", answer_en: "No." },
      { q_vi: "Người viết muốn khi nào xem lại?", q_en: "When does the writer want it checked again?", answer_vi: "Hôm nay.", answer_en: "Today." },
    ],
    suggested_reply: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਅੱਜ ਫਿਰ ਦੇਖਾਂਗਾ।", romanization: "maaf karna, main ajj phir dekhanga.", vi: "Xin lỗi, hôm nay tôi sẽ xem lại. (nam)", en: "Sorry, I will check again today. (male speaker)" },
    traps: [
      { trap_vi: "ਅਜੇ ਵੀ = vẫn còn; đừng đọc như vấn đề mới hoàn toàn.", trap_en: "ਅਜੇ ਵੀ = still; do not read it as a completely new problem.", focus_pa: "ਅਜੇ ਵੀ", focus_romanization: "aje vi" },
    ],
    navigation_hint_vi: "Tìm ਅਜੇ ਵੀ để nhận biết follow-up.",
    navigation_hint_en: "Look for ਅਜੇ ਵੀ to identify a follow-up.",
    remediation_vi: "Nếu bỏ sót ý 'vẫn', ôn ਅਜੇ ਵੀ.",
    remediation_en: "If 'still' is missed, review ਅਜੇ ਵੀ.",
  },
  {
    id: "pa_a2_msg_work_shift_change",
    type: "workplace_schedule_note",
    mode: "review",
    title_vi: "Đổi giờ ca làm",
    title_en: "Shift time change",
    message_pa: "ਅੱਜ ਮੇਰਾ ਸ਼ਿਫ਼ਟ ਦੋ ਵਜੇ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ ਸ਼ੁਰੂ ਹੋਵੇਗਾ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ, ਮੈਨੂੰ ਮੈਸੇਜ ਕਰੋ।",
    romanization: "ajj mera shift do vaje di thaan tinn vaje shuru hovega. je koi sawaal hove, mainu message karo.",
    translation_vi: "Hôm nay ca của tôi sẽ bắt đầu lúc ba giờ thay vì hai giờ. Nếu có câu hỏi, hãy nhắn cho tôi.",
    translation_en: "Today my shift will start at three instead of two. If there is any question, message me.",
    comprehension_goal_vi: "Tìm giờ mới và hành động nếu có câu hỏi.",
    comprehension_goal_en: "Find the new time and what to do if there is a question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਸ਼ਿਫ਼ਟ and ਮੈਸੇਜ are common in Canadian workplace Punjabi.",
    canada_practical_en: "ਸ਼ਿਫ਼ਟ and ਮੈਸੇਜ are common in Canadian workplace Punjabi.",
    questions: [
      { q_vi: "Ca bắt đầu lúc mấy giờ?", q_en: "What time does the shift start?", answer_vi: "Ba giờ.", answer_en: "Three." },
      { q_vi: "Nếu có câu hỏi thì làm gì?", q_en: "What should someone do if there is a question?", answer_vi: "Nhắn tin.", answer_en: "Send a message." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਨੂੰ ਸਮਝ ਆ ਗਈ।", romanization: "theek hai, mainu samajh aa gai.", vi: "Được, tôi hiểu rồi.", en: "Okay, I understand." },
    traps: [
      { trap_vi: "ਦੀ ਥਾਂ đánh dấu giờ cũ bị thay.", trap_en: "ਦੀ ਥਾਂ marks the old time being replaced.", focus_pa: "ਦੋ ਵਜੇ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ", focus_romanization: "do vaje di thaan tinn vaje" },
    ],
    navigation_hint_vi: "Tìm ਸ਼ੁਰੂ ਹੋਵੇਗਾ để xác định giờ bắt đầu.",
    navigation_hint_en: "Find ਸ਼ੁਰੂ ਹੋਵੇਗਾ to identify the start time.",
    remediation_vi: "Nếu nhầm giờ cũ/mới, ôn ਦੀ ਥਾਂ.",
    remediation_en: "If old/new time is confused, review ਦੀ ਥਾਂ.",
  },
  {
    id: "pa_a2_msg_work_instruction",
    type: "workplace_schedule_note",
    mode: "remediation",
    title_vi: "Hướng dẫn nơi làm việc",
    title_en: "Workplace instruction",
    message_pa: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰੋ, ਫਿਰ ਮੈਨੇਜਰ ਨੂੰ ਭੇਜੋ।",
    romanization: "kirpa karke pehlan report poori karo, phir manager nu bhejo.",
    translation_vi: "Vui lòng hoàn thành báo cáo trước, rồi gửi cho quản lý.",
    translation_en: "Please finish the report first, then send it to the manager.",
    comprehension_goal_vi: "Nhận ra thứ tự hành động: trước... rồi...",
    comprehension_goal_en: "Recognize action order: first... then...",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Report/manager are common workplace loanwords.",
    canada_practical_en: "Report/manager are common workplace loanwords.",
    questions: [
      { q_vi: "Làm gì trước?", q_en: "What should be done first?", answer_vi: "Hoàn thành báo cáo.", answer_en: "Finish the report." },
      { q_vi: "Sau đó gửi cho ai?", q_en: "Then send it to whom?", answer_vi: "Quản lý.", answer_en: "The manager." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਪਹਿਲਾਂ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰਾਂਗਾ।", romanization: "theek hai, pehlan report poori karanga.", vi: "Được, trước tiên tôi sẽ hoàn thành báo cáo. (nam)", en: "Okay, I will finish the report first. (male speaker)" },
    traps: [
      { trap_vi: "ਪਹਿਲਾਂ... ਫਿਰ... giữ thứ tự hành động.", trap_en: "ਪਹਿਲਾਂ... ਫਿਰ... preserves action order.", focus_pa: "ਪਹਿਲਾਂ ... ਫਿਰ", focus_romanization: "pehlan ... phir" },
    ],
    navigation_hint_vi: "Gạch chân ਪਹਿਲਾਂ và ਫਿਰ.",
    navigation_hint_en: "Underline ਪਹਿਲਾਂ and ਫਿਰ.",
    remediation_vi: "Nếu đảo thứ tự, ôn connectors sequence.",
    remediation_en: "If order is reversed, review sequence connectors.",
  },
  {
    id: "pa_a2_msg_service_counter_documents",
    type: "service_counter_instruction",
    mode: "navigation",
    title_vi: "Giấy tờ ở quầy dịch vụ",
    title_en: "Documents at a service counter",
    message_pa: "ਫਾਰਮ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਆਈਡੀ ਅਤੇ ਪਤੇ ਦਾ ਸਬੂਤ ਲਿਆਓ। ਨੰਬਰ ਲੈ ਕੇ ਉਡੀਕ ਕਰੋ।",
    romanization: "form jamma karan lai ID ate pate da saboot liaao. number lai ke udeek karo.",
    translation_vi: "Để nộp mẫu, hãy mang ID và bằng chứng địa chỉ. Lấy số và chờ.",
    translation_en: "To submit the form, bring ID and proof of address. Take a number and wait.",
    comprehension_goal_vi: "Tìm giấy tờ cần mang và hành động tại quầy.",
    comprehension_goal_en: "Find documents to bring and the counter action.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Proof of address là yêu cầu phổ biến ở Canada.",
    canada_practical_en: "Proof of address is a common requirement in Canada.",
    questions: [
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_vi: "ID và bằng chứng địa chỉ.", answer_en: "ID and proof of address." },
      { q_vi: "Sau khi đến quầy cần làm gì?", q_en: "What should be done at the counter?", answer_vi: "Lấy số và chờ.", answer_en: "Take a number and wait." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਆਈਡੀ ਅਤੇ ਸਬੂਤ ਲਿਆਵਾਂਗਾ।", romanization: "theek hai, main ID ate saboot liaavanga.", vi: "Được, tôi sẽ mang ID và bằng chứng. (nam)", en: "Okay, I will bring ID and proof. (male speaker)" },
    traps: [
      { trap_vi: "ਲਈ ở đây nghĩa là 'để', không phải người nhận.", trap_en: "ਲਈ here means 'in order to', not a recipient.", focus_pa: "ਫਾਰਮ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ", focus_romanization: "form jamma karan lai" },
    ],
    navigation_hint_vi: "Sau ਲਈ thường là mục đích; sau đó tìm danh sách giấy tờ.",
    navigation_hint_en: "After ਲਈ is often the purpose; then find the document list.",
    remediation_vi: "Nếu nhầm ਲਈ, ôn purpose phrases.",
    remediation_en: "If ਲਈ is confused, review purpose phrases.",
  },
  {
    id: "pa_a2_msg_counter_closed",
    type: "service_counter_instruction",
    mode: "readiness",
    title_vi: "Quầy đóng tạm thời",
    title_en: "Counter temporarily closed",
    message_pa: "ਸੇਵਾ ਕਾਊਂਟਰ ਦੁਪਹਿਰ ਇੱਕ ਵਜੇ ਤੋਂ ਦੋ ਵਜੇ ਤੱਕ ਬੰਦ ਰਹੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਆਓ।",
    romanization: "seva counter dupahar ikk vaje ton do vaje takk band rahega. kirpa karke baad vich aao.",
    translation_vi: "Quầy dịch vụ sẽ đóng từ một giờ đến hai giờ trưa. Vui lòng quay lại sau.",
    translation_en: "The service counter will be closed from one to two in the afternoon. Please come later.",
    comprehension_goal_vi: "Tìm khoảng thời gian đóng và hành động cần làm.",
    comprehension_goal_en: "Find the closed time range and required action.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Service-counter hours signs are common in public offices.",
    canada_practical_en: "Service-counter hours signs are common in public offices.",
    questions: [
      { q_vi: "Quầy đóng từ mấy giờ đến mấy giờ?", q_en: "From what time to what time is the counter closed?", answer_vi: "Từ một đến hai giờ.", answer_en: "From one to two." },
      { q_vi: "Người đọc nên làm gì?", q_en: "What should the reader do?", answer_vi: "Quay lại sau.", answer_en: "Come later." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਮੈਂ ਬਾਅਦ ਵਿੱਚ ਆਵਾਂਗਾ।", romanization: "theek hai, main baad vich aavanga.", vi: "Được, tôi sẽ quay lại sau. (nam)", en: "Okay, I will come later. (male speaker)" },
    traps: [
      { trap_vi: "ਤੋਂ... ਤੱਕ = từ... đến; cần đọc cả hai mốc.", trap_en: "ਤੋਂ... ਤੱਕ = from... to/until; read both endpoints.", focus_pa: "ਇੱਕ ਵਜੇ ਤੋਂ ਦੋ ਵਜੇ ਤੱਕ", focus_romanization: "ikk vaje ton do vaje takk" },
    ],
    navigation_hint_vi: "Tìm ਤੋਂ và ਤੱਕ để lấy khoảng thời gian.",
    navigation_hint_en: "Find ਤੋਂ and ਤੱਕ to get the time range.",
    remediation_vi: "Nếu chỉ lấy một giờ, ôn from-to phrases.",
    remediation_en: "If only one time is captured, review from-to phrases.",
  },
  {
    id: "pa_a2_msg_polite_followup_repeat",
    type: "polite_follow_up_response",
    mode: "remediation",
    title_vi: "Phản hồi khi chưa hiểu",
    title_en: "Follow-up when you did not understand",
    message_pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝ ਨਹੀਂ ਆਈ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?",
    romanization: "maaf karna, mainu poori gall samajh nahi aai. ki tusi dubara keh sakde ho?",
    translation_vi: "Xin lỗi, tôi chưa hiểu toàn bộ. Bạn có thể nói lại không?",
    translation_en: "Sorry, I did not understand the whole thing. Can you say it again?",
    comprehension_goal_vi: "Nhận ra đây là repair/follow-up lịch sự.",
    comprehension_goal_en: "Recognize this as a polite repair/follow-up.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    questions: [
      { q_vi: "Người nói có hiểu hết không?", q_en: "Did the speaker understand everything?", answer_vi: "Không.", answer_en: "No." },
      { q_vi: "Người nói yêu cầu gì?", q_en: "What does the speaker request?", answer_vi: "Nói lại.", answer_en: "Repeat it." },
    ],
    suggested_reply: { pa: "ਹਾਂ ਜੀ, ਮੈਂ ਦੁਬਾਰਾ ਕਹਿੰਦਾ ਹਾਂ।", romanization: "haan ji, main dubara kehnda haan.", vi: "Vâng, tôi sẽ nói lại. (nam)", en: "Yes, I will say it again. (male speaker)" },
    traps: [
      { trap_vi: "ਸਮਝ ਨਹੀਂ ਆਈ là 'không hiểu', không phải 'không đến'.", trap_en: "ਸਮਝ ਨਹੀਂ ਆਈ means 'did not understand', not 'did not come'.", focus_pa: "ਸਮਝ ਨਹੀਂ ਆਈ", focus_romanization: "samajh nahi aai" },
    ],
    navigation_hint_vi: "Repair messages thường có ਮਾਫ਼ ਕਰਨਾ + problem + request.",
    navigation_hint_en: "Repair messages often have ਮਾਫ਼ ਕਰਨਾ + problem + request.",
    remediation_vi: "Nếu ngại hỏi lại, ôn repair phrases.",
    remediation_en: "If hesitant to ask again, review repair phrases.",
  },
  {
    id: "pa_a2_msg_polite_followup_thanks",
    type: "polite_follow_up_response",
    mode: "review",
    title_vi: "Phản hồi xác nhận",
    title_en: "Confirmation follow-up",
    message_pa: "ਧੰਨਵਾਦ, ਮੈਨੂੰ ਸਮਝ ਆ ਗਈ। ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਸ ਵਜੇ ਆਵਾਂਗੀ।",
    romanization: "dhannvaad, mainu samajh aa gai. main kal savere das vaje aavangi.",
    translation_vi: "Cảm ơn, tôi hiểu rồi. Tôi sẽ đến sáng mai lúc mười giờ. (nữ)",
    translation_en: "Thank you, I understand now. I will come tomorrow morning at ten. (female speaker)",
    comprehension_goal_vi: "Nhận ra xác nhận hiểu + xác nhận lịch.",
    comprehension_goal_en: "Recognize understanding confirmation + schedule confirmation.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    questions: [
      { q_vi: "Người nói đã hiểu chưa?", q_en: "Does the speaker understand now?", answer_vi: "Rồi.", answer_en: "Yes." },
      { q_vi: "Người nói sẽ đến khi nào?", q_en: "When will the speaker come?", answer_vi: "Sáng mai lúc mười giờ.", answer_en: "Tomorrow morning at ten." },
    ],
    suggested_reply: { pa: "ਠੀਕ ਹੈ, ਧੰਨਵਾਦ।", romanization: "theek hai, dhannvaad.", vi: "Được, cảm ơn.", en: "Okay, thank you." },
    traps: [
      { trap_vi: "ਆਵਾਂਗੀ cho người nói nữ; nam dùng ਆਵਾਂਗਾ.", trap_en: "ਆਵਾਂਗੀ is for a female speaker; male speaker uses ਆਵਾਂਗਾ.", focus_pa: "ਮੈਂ ... ਆਵਾਂਗੀ", focus_romanization: "main ... aavangi" },
    ],
    navigation_hint_vi: "Tìm ਧੰਨਵਾਦ và ਸਮਝ ਆ ਗਈ để nhận diện confirmation.",
    navigation_hint_en: "Find ਧੰਨਵਾਦ and ਸਮਝ ਆ ਗਈ to identify confirmation.",
    remediation_vi: "Nếu nhầm ngày, đọc ਕੱਲ੍ਹ + future verb together.",
    remediation_en: "If the day is confused, read ਕੱਲ੍ਹ + future verb together.",
  },
];
