// src/languages/punjabi/practicalCheckpointSetA2.ts
//
// Punjabi A2 practical checkpoint set for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiPracticalCheckpointSetA2Scenario =
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "forms"
  | "short_messages"
  | "polite_problem_descriptions"
  | "interaction_repair"
  | "public_service_follow_up";

export type PunjabiPracticalCheckpointSetA2Style =
  | "final_stability"
  | "boundary"
  | "checklist"
  | "regression";

export type PunjabiPracticalCheckpointSetA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiPracticalCheckpointSetA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiPracticalCheckpointSetA2Item = {
  id: string;
  scenario: PunjabiPracticalCheckpointSetA2Scenario;
  style: PunjabiPracticalCheckpointSetA2Style;
  title_vi: string;
  title_en: string;
  checkpoint_goal_vi: string;
  checkpoint_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  checkpoint_lines: PunjabiPracticalCheckpointSetA2Line[];
  final_qa: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  explanation_vi: string;
  explanation_en: string;
  traps: PunjabiPracticalCheckpointSetA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  stability_check_vi: string;
  stability_check_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong practical checkpoint set; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this practical checkpoint set; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const practicalCheckpointSetA2: PunjabiPracticalCheckpointSetA2Item[] = [
  {
    id: "pa_a2_checkpoint_appointments",
    scenario: "appointments",
    style: "final_stability",
    title_vi: "Checkpoint: lịch hẹn",
    title_en: "Checkpoint: appointments",
    checkpoint_goal_vi: "Giữ được lịch cũ, lịch mới, và giấy tờ cần mang.",
    checkpoint_goal_en: "Retain the old time, the new time, and the document to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are practical Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I make it Friday at three? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Giấy tờ gì?", q_en: "Which document?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này kiểm tra trật tự appointment → reschedule → document.",
    explanation_en: "This checks the order appointment → reschedule → document.",
    traps: [{ trap_vi: "Đừng bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", better_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", better_romanization: "shukkarvaar tinn vaje" }],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ theo thứ tự rõ.",
    pass_signal_en: "Has the old time, new time, and document in a clear order.",
    stability_check_vi: "Đủ ổn để chuyển sang app prompt hoặc flash review.",
    stability_check_en: "Stable enough for an app prompt or flash review.",
  },
  {
    id: "pa_a2_checkpoint_transport",
    scenario: "transport",
    style: "checklist",
    title_vi: "Checklist: đi lại",
    title_en: "Checklist: transport",
    checkpoint_goal_vi: "Giữ được route, stop, và delay phrase.",
    checkpoint_goal_en: "Retain route, stop, and delay phrase.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, platform là bối cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are real Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Checklist ở đây là đi theo đúng ba bước: tuyến, trạm, trễ.",
    explanation_en: "The checklist here is to follow the three steps: route, stop, late notice.",
    traps: [{ trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có route, stop, và delay theo đúng trình tự.",
    pass_signal_en: "Has route, stop, and delay in the correct sequence.",
    stability_check_vi: "Đủ chắc để giữ mẫu ngay cả khi đổi route số.",
    stability_check_en: "Strong enough to hold the pattern even when the route number changes.",
  },
  {
    id: "pa_a2_checkpoint_housing",
    scenario: "housing",
    style: "boundary",
    title_vi: "Boundary: nhà ở",
    title_en: "Boundary: housing",
    checkpoint_goal_vi: "Giữ được opener lịch sự, vấn đề, thời điểm, và yêu cầu xem.",
    checkpoint_goal_en: "Retain a polite opener, the problem, timing, and request to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Nhắn landlord/building manager về heater, leak, hoặc laundry là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Messaging a landlord/building manager about a heater, leak, or laundry is very practical in Canada.",
    checkpoint_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Boundary ở đây là không nói quá dài nhưng vẫn đủ thông tin để landlord hiểu.",
    explanation_en: "The boundary here is not to be too long while still giving enough information for the landlord to understand.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà thiếu timing.", trap_en: "Do not say only 'problem' without timing.", better_pa: "ਸਵੇਰੇ ਤੋਂ", better_romanization: "savere ton" }],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    stability_check_vi: "Ổn khi rút gọn thành một tin nhắn ngắn.",
    stability_check_en: "Stable when compressed into a short message.",
  },
  {
    id: "pa_a2_checkpoint_school",
    scenario: "school",
    style: "final_stability",
    title_vi: "Final stability: trường học",
    title_en: "Final stability: school",
    checkpoint_goal_vi: "Giữ được câu vắng học, lý do sốt, và hỏi homework.",
    checkpoint_goal_en: "Retain absence sentence, fever reason, and homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office hoặc teacher messages là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School office or teacher messages are common Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Stability là giữ được absence + fever + homework ngay cả khi nhắn nhanh.",
    explanation_en: "Stability is keeping absence + fever + homework even in a rushed message.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ phải theo danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ must follow the noun.", better_pa: "ਮੇਰਾ ਬੱਚਾ", better_romanization: "mera bachcha" }],
    pass_signal_vi: "Có absence, reason, và homework.",
    pass_signal_en: "Has absence, reason, and homework.",
    stability_check_vi: "Đủ ổn để đưa thẳng vào school-office template.",
    stability_check_en: "Stable enough to place directly into a school-office template.",
  },
  {
    id: "pa_a2_checkpoint_childcare",
    scenario: "childcare",
    style: "checklist",
    title_vi: "Checklist: childcare",
    title_en: "Checklist: childcare",
    checkpoint_goal_vi: "Giữ được giờ đón, người đón thay, và pickup list.",
    checkpoint_goal_en: "Retain pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/after-school pickup list là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare/after-school pickup lists are very practical Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Có trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Checklist ở đây là giờ đón, người đón, và danh sách phải đi cùng nhau.",
    explanation_en: "The checklist here is that pickup time, alternate person, and list status must travel together.",
    traps: [{ trap_vi: "Đừng bỏ giờ đón trong childcare message.", trap_en: "Do not omit the pickup time in a childcare message.", better_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ", better_romanization: "panj vaje lain aavegi" }],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    stability_check_vi: "Ổn khi người dùng phải nhắn gấp trước giờ đón.",
    stability_check_en: "Stable when the user has to send a rushed message before pickup.",
  },
  {
    id: "pa_a2_checkpoint_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "boundary",
    title_vi: "Boundary: small talk nơi làm",
    title_en: "Boundary: workplace small talk",
    checkpoint_goal_vi: "Giữ được chào hỏi, small talk ngắn, rồi quay lại công việc.",
    checkpoint_goal_en: "Retain greeting, brief small talk, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    checkpoint_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Boundary là giữ cho small talk không kéo dài quá mức rồi vẫn quay lại work.",
    explanation_en: "The boundary is keeping small talk from running long and still returning to work.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    stability_check_vi: "Ổn cho môi trường làm việc mới hoặc ca đầu tiên.",
    stability_check_en: "Stable for a new workplace or first shift.",
  },
  {
    id: "pa_a2_checkpoint_forms",
    scenario: "forms",
    style: "final_stability",
    title_vi: "Final stability: mẫu đơn",
    title_en: "Final stability: forms",
    checkpoint_goal_vi: "Giữ được tên, địa chỉ, và cách nói thiếu giấy tờ.",
    checkpoint_goal_en: "Retain name, address, and the missing-document phrase.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, school office, library card, và Service Canada là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Clinic, school office, library card, and Service Canada are common Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
    ],
    final_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", answer_romanization: "mera naam aman hai.", answer_vi: "Tên tôi là Aman.", answer_en: "My name is Aman." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਇਹ ਦਸਤਾਵੇਜ਼", answer_romanization: "eh dastavez", answer_vi: "Giấy tờ này.", answer_en: "This document." },
    ],
    explanation_vi: "Final stability ở đây là form basics vẫn không rơi mất khi gặp áp lực.",
    explanation_en: "Final stability here means the form basics do not drop under pressure.",
    traps: [{ trap_vi: "ਪਤਾ trên form là địa chỉ, không phải 'biết'.", trap_en: "ਪਤਾ on a form means address, not 'know'.", better_pa: "ਮੇਰਾ ਪਤਾ", better_romanization: "mera pata" }],
    pass_signal_vi: "Có name, address, và missing document theo đúng thứ tự.",
    pass_signal_en: "Has name, address, and missing document in the right order.",
    stability_check_vi: "Ổn để đưa trực tiếp vào form-fill checkpoint.",
    stability_check_en: "Stable to place directly into a form-fill checkpoint.",
  },
  {
    id: "pa_a2_checkpoint_short_messages",
    scenario: "short_messages",
    style: "checklist",
    title_vi: "Checklist: tin nhắn ngắn",
    title_en: "Checklist: short messages",
    checkpoint_goal_vi: "Lấy được ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    checkpoint_goal_en: "Extract day, time, place, and item to bring from a short message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School notices, library classes, settlement classes, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School notices, library classes, settlement classes, and training notes are common Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Checklist ở đây là ngày, giờ, nơi, và item phải hiện ra cùng nhau.",
    explanation_en: "The checklist here is that day, time, place, and item must appear together.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", better_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", better_romanization: "kal tinn vaje" }],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    stability_check_vi: "Ổn cho luyện đọc thông báo ngắn.",
    stability_check_en: "Stable for practicing short notice reading.",
  },
  {
    id: "pa_a2_checkpoint_polite_problem_descriptions",
    scenario: "polite_problem_descriptions",
    style: "regression",
    title_vi: "Regression: mô tả vấn đề lịch sự",
    title_en: "Regression: polite problem descriptions",
    checkpoint_goal_vi: "Giữ được opener lịch sự, mô tả vấn đề, và yêu cầu rõ ràng.",
    checkpoint_goal_en: "Retain the polite opener, problem description, and a clear request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Landlord/building manager, clinic, library, và service counter là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Landlord/building manager, clinic, library, and service counter are common Canadian contexts.",
    checkpoint_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem." },
      { pa: "ਮੈਨੂੰ ਇਹ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "mainu eh sawaal samajh nahi aa riha.", vi: "Tôi không hiểu câu hỏi này.", en: "I do not understand this question." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề là gì?", q_en: "What is the problem?", answer_pa: "ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ", answer_romanization: "sawaal samajh nahi aa riha", answer_vi: "Không hiểu câu hỏi.", answer_en: "Does not understand the question." },
      { q_vi: "Yêu cầu gì?", q_en: "What is the request?", answer_pa: "ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", answer_romanization: "madad kar sakde ho?", answer_vi: "Bạn có thể giúp không?", answer_en: "Can you help?" },
    ],
    explanation_vi: "Regression vì learner dễ quên phần yêu cầu khi chỉ nói 'problem'.",
    explanation_en: "Regression because the learner can forget the request part when only saying 'problem'.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà không nói cần giúp gì.", trap_en: "Do not only say 'problem' without saying what help is needed.", better_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi madad kar sakde ho?" }],
    pass_signal_vi: "Có opener, vấn đề, và request.",
    pass_signal_en: "Has opener, problem, and request.",
    stability_check_vi: "Ổn nếu learner vẫn giữ lời xin lỗi và yêu cầu.",
    stability_check_en: "Stable if the learner still keeps the apology and request.",
  },
  {
    id: "pa_a2_checkpoint_interaction_repair",
    scenario: "interaction_repair",
    style: "boundary",
    title_vi: "Boundary: sửa tương tác",
    title_en: "Boundary: interaction repair",
    checkpoint_goal_vi: "Giữ được xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    checkpoint_goal_en: "Retain asking for repetition, asking for slower speech, and confirming understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    checkpoint_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Boundary ở đây là learner biết dừng lại và xin sửa thay vì đoán.",
    explanation_en: "The boundary here is that the learner knows to stop and repair instead of guessing.",
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", better_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    stability_check_vi: "Ổn nếu learner giữ được phép lịch sự khi chưa hiểu.",
    stability_check_en: "Stable if the learner keeps politeness while not understanding.",
  },
  {
    id: "pa_a2_checkpoint_public_service_follow_up",
    scenario: "public_service_follow_up",
    style: "final_stability",
    title_vi: "Final stability: theo dõi ở quầy dịch vụ",
    title_en: "Final stability: public-service follow-up",
    checkpoint_goal_vi: "Giữ được tên, thời gian xử lý, và bước tiếp theo.",
    checkpoint_goal_en: "Retain the name, processing time, and next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp service counter, front desk, library desk, và school office ở Canada.",
    canada_practical_en: "Fits service counter, front desk, library desk, and school office in Canada.",
    checkpoint_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Mẫu này giữ follow-up ở quầy dịch vụ rất gọn: kiểm tra tên → hỏi xong chưa → hỏi bước tiếp theo.",
    explanation_en: "This keeps service-counter follow-up compact: check the name → ask if it is ready → ask the next step.",
    traps: [{ trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.", trap_en: "Do not omit the name or next step when following up.", better_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", better_romanization: "agla kadam ki hai?" }],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    stability_check_vi: "Ổn để chuyển thành follow-up checklist.",
    stability_check_en: "Stable enough to convert into a follow-up checklist.",
  },
];
