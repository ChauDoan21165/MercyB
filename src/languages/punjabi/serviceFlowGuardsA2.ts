// src/languages/punjabi/serviceFlowGuardsA2.ts
//
// Punjabi A2 service-flow guards for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiServiceFlowGuardsA2Scenario =
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "forms"
  | "short_messages"
  | "polite_repair_phrases"
  | "service_counter_follow_up"
  | "workplace_small_talk"
  | "daily_routine";

export type PunjabiServiceFlowGuardsA2Style =
  | "final_safety"
  | "quality"
  | "export_readiness"
  | "regression";

export type PunjabiServiceFlowGuardsA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiServiceFlowGuardsA2Trap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiServiceFlowGuardsA2Item = {
  id: string;
  scenario: PunjabiServiceFlowGuardsA2Scenario;
  style: PunjabiServiceFlowGuardsA2Style;
  title_vi: string;
  title_en: string;
  flow_goal_vi: string;
  flow_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  guard_lines: PunjabiServiceFlowGuardsA2Line[];
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
  traps: PunjabiServiceFlowGuardsA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  export_readiness_vi: string;
  export_readiness_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong service-flow guards; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these service-flow guards; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const serviceFlowGuardsA2: PunjabiServiceFlowGuardsA2Item[] = [
  {
    id: "pa_a2_flow_appointments",
    scenario: "appointments",
    style: "final_safety",
    title_vi: "An toàn quy trình: lịch hẹn",
    title_en: "Flow safety: appointments",
    flow_goal_vi: "Giữ thứ tự: xác nhận lịch, hỏi đổi giờ, rồi xác nhận giấy tờ.",
    flow_goal_en: "Keep the order: confirm the appointment, ask to change time, then confirm the document.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are very practical Canadian contexts.",
    guard_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I make it Friday at three? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Giấy tờ gì?", q_en: "Which document?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này buộc learner đi theo đúng trật tự service-flow: lịch → đổi giờ → giấy tờ.",
    explanation_en: "This forces the learner to follow the service-flow order: appointment → reschedule → document.",
    traps: [{ trap_vi: "Đừng bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", fix_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", fix_romanization: "shukkarvaar tinn vaje" }],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ theo thứ tự rõ.",
    pass_signal_en: "Has the old time, new time, and document in a clear order.",
    export_readiness_vi: "Đủ sạch để xuất sang flow card hoặc app script.",
    export_readiness_en: "Clean enough to export into a flow card or app script.",
  },
  {
    id: "pa_a2_flow_transport",
    scenario: "transport",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất: đi lại",
    title_en: "Export ready: transport",
    flow_goal_vi: "Giữ thứ tự: hỏi tuyến, hỏi điểm xuống, báo trễ.",
    flow_goal_en: "Keep the order: ask route, ask stop, report delay.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, platform đều là ngữ cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are all real Canadian contexts.",
    guard_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Mẫu này giữ luồng nói an toàn để learner không bị lạc giữa route, stop, và delay.",
    explanation_en: "This keeps the speaking flow safe so the learner does not get lost between route, stop, and delay.",
    traps: [{ trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có route, stop, và delay theo đúng trình tự.",
    pass_signal_en: "Has route, stop, and delay in the correct sequence.",
    export_readiness_vi: "Có thể xuất sang route-card hoặc reminder flow.",
    export_readiness_en: "Can be exported into a route card or reminder flow.",
  },
  {
    id: "pa_a2_flow_housing",
    scenario: "housing",
    style: "quality",
    title_vi: "Chất lượng: nhà ở",
    title_en: "Quality: housing",
    flow_goal_vi: "Giữ thứ tự: mở lịch sự, nêu vấn đề, nêu thời điểm, hỏi xem.",
    flow_goal_en: "Keep the order: polite opener, problem, timing, ask to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Rất thực tế khi nhắn landlord/building manager ở Canada.",
    canada_practical_en: "Very practical when messaging a landlord/building manager in Canada.",
    guard_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Phần chất lượng ở đây là giữ trật tự thông tin khi báo lỗi nhà ở.",
    explanation_en: "The quality dimension here is preserving the information order when reporting a housing issue.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà thiếu timing.", trap_en: "Do not say only 'problem' without timing.", fix_pa: "ਸਵੇਰੇ ਤੋਂ", fix_romanization: "savere ton" }],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    export_readiness_vi: "Dễ đẩy sang template landlord message.",
    export_readiness_en: "Easy to push into a landlord message template.",
  },
  {
    id: "pa_a2_flow_school",
    scenario: "school",
    style: "regression",
    title_vi: "Regression: trường học",
    title_en: "Regression: school",
    flow_goal_vi: "Giữ thứ tự: báo vắng học, nêu lý do, xin homework.",
    flow_goal_en: "Keep the order: report absence, give reason, ask for homework.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office và teacher messages là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School office and teacher messages are common Canadian contexts.",
    guard_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Regression vì learner dễ mất lý do hoặc request khi nói nhanh.",
    explanation_en: "Regression because the learner can easily lose the reason or request when speaking quickly.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ phải theo danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ must follow the noun.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" }],
    pass_signal_vi: "Có absence, reason, và homework.",
    pass_signal_en: "Has absence, reason, and homework.",
    export_readiness_vi: "Có thể xuất sang school-office form immediately.",
    export_readiness_en: "Can be exported into a school-office form immediately.",
  },
  {
    id: "pa_a2_flow_childcare",
    scenario: "childcare",
    style: "final_safety",
    title_vi: "An toàn quy trình: childcare",
    title_en: "Flow safety: childcare",
    flow_goal_vi: "Giữ thứ tự: báo không đến đúng giờ, nêu người đón thay, nói về pickup list.",
    flow_goal_en: "Keep the order: say you cannot come on time, name the alternate pickup person, mention the pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/after-school pickup list là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare/after-school pickup lists are very practical Canadian contexts.",
    guard_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Có trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Phần an toàn ở đây là phải giữ rõ người đón và danh sách, không được mơ hồ.",
    explanation_en: "The safety part here is keeping the alternate person and list status explicit, with no ambiguity.",
    traps: [{ trap_vi: "Đừng bỏ giờ đón trong childcare message.", trap_en: "Do not omit the pickup time in a childcare message.", fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ", fix_romanization: "panj vaje lain aavegi" }],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    export_readiness_vi: "Sẵn sàng để chuyển thành pickup-list note.",
    export_readiness_en: "Ready to convert into a pickup-list note.",
  },
  {
    id: "pa_a2_flow_forms",
    scenario: "forms",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất: mẫu đơn",
    title_en: "Export ready: forms",
    flow_goal_vi: "Giữ thứ tự: tên, địa chỉ, giấy tờ thiếu, và hỏi lại nếu cần.",
    flow_goal_en: "Keep the order: name, address, missing document, and ask again if needed.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, school office, library card, và Service Canada đều có bối cảnh này.",
    canada_practical_en: "Clinic, school office, library card, and Service Canada all use this context.",
    guard_lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
    ],
    final_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", answer_romanization: "mera naam aman hai.", answer_vi: "Tên tôi là Aman.", answer_en: "My name is Aman." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਇਹ ਦਸਤਾਵੇਜ਼", answer_romanization: "eh dastavez", answer_vi: "Giấy tờ này.", answer_en: "This document." },
    ],
    explanation_vi: "Mẫu này kiểm tra xem learner có giữ đúng chuỗi form cơ bản hay không.",
    explanation_en: "This checks whether the learner retains the basic form sequence correctly.",
    traps: [{ trap_vi: "ਪਤਾ trong form là địa chỉ, không phải 'biết'.", trap_en: "ਪਤਾ on a form means address, not 'know'.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" }],
    pass_signal_vi: "Có name, address, và missing document theo đúng trật tự.",
    pass_signal_en: "Has name, address, and missing document in the right order.",
    export_readiness_vi: "Có thể xuất thẳng sang form-filling script.",
    export_readiness_en: "Can be exported straight into a form-filling script.",
  },
  {
    id: "pa_a2_flow_short_messages",
    scenario: "short_messages",
    style: "quality",
    title_vi: "Chất lượng: tin nhắn ngắn",
    title_en: "Quality: short messages",
    flow_goal_vi: "Giữ thứ tự: ngày, giờ, nơi, và đồ cần mang trong một tin nhắn.",
    flow_goal_en: "Keep the order: day, time, place, and item to bring in one message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School notices, library classes, settlement classes, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School notices, library classes, settlement classes, and training notes are common Canadian contexts.",
    guard_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Chất lượng ở đây là không làm rơi ngày/giờ hoặc đồ cần mang khi tóm tắt.",
    explanation_en: "Quality here is not dropping the day/time or the item to bring when summarizing.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" }],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    export_readiness_vi: "Dễ xuất thành comprehension card.",
    export_readiness_en: "Easy to export as a comprehension card.",
  },
  {
    id: "pa_a2_flow_repair",
    scenario: "polite_repair_phrases",
    style: "regression",
    title_vi: "Regression: sửa tương tác",
    title_en: "Regression: interaction repair",
    flow_goal_vi: "Giữ thứ tự: xin nhắc lại, xin nói chậm, xác nhận ý hiểu.",
    flow_goal_en: "Keep the order: ask for repetition, ask for slower speech, confirm understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    guard_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Regression ở đây là liệu learner có còn biết tự sửa khi chưa nghe rõ hay không.",
    explanation_en: "The regression concern here is whether the learner still knows how to repair when they did not hear clearly.",
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    export_readiness_vi: "Có thể xuất sang regression-test card ngay.",
    export_readiness_en: "Can be exported into a regression-test card immediately.",
  },
  {
    id: "pa_a2_flow_service_counter_follow_up",
    scenario: "service_counter_follow_up",
    style: "final_safety",
    title_vi: "An toàn quy trình: theo dõi ở quầy dịch vụ",
    title_en: "Flow safety: service-counter follow-up",
    flow_goal_vi: "Giữ thứ tự: kiểm tra tên, hỏi xong chưa, hỏi bước tiếp theo.",
    flow_goal_en: "Keep the order: check the name, ask if it is ready, ask the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp service counter, front desk, library desk, và school office ở Canada.",
    canada_practical_en: "Fits service counter, front desk, library desk, and school office in Canada.",
    guard_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Mẫu này giữ thứ tự follow-up ở quầy dịch vụ để learner không quên tên hoặc bước tiếp theo.",
    explanation_en: "This keeps the follow-up order at the counter so the learner does not forget the name or next step.",
    traps: [{ trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.", trap_en: "Do not omit the name or next step when following up.", fix_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", fix_romanization: "agla kadam ki hai?" }],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    export_readiness_vi: "Có thể xuất sang follow-up script ngay.",
    export_readiness_en: "Can be exported into a follow-up script immediately.",
  },
  {
    id: "pa_a2_flow_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "quality",
    title_vi: "Chất lượng: small talk nơi làm",
    title_en: "Quality: workplace small talk",
    flow_goal_vi: "Giữ thứ tự: chào, small talk ngắn, rồi quay lại công việc.",
    flow_goal_en: "Keep the order: greet, brief small talk, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    guard_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Mẫu này nhấn vào chất lượng luồng nói: chào rồi chuyển đúng lúc về work.",
    explanation_en: "This emphasizes flow quality: greet first and then pivot back to work at the right moment.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    export_readiness_vi: "Dễ xuất thành workplace prompt.",
    export_readiness_en: "Easy to export as a workplace prompt.",
  },
  {
    id: "pa_a2_flow_daily_routine",
    scenario: "daily_routine",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất: sinh hoạt hằng ngày",
    title_en: "Export ready: daily routine",
    flow_goal_vi: "Giữ thứ tự: giờ, thói quen sáng, và một việc hôm qua.",
    flow_goal_en: "Keep the order: time, morning routine, and one thing done yesterday.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    guard_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main kamm te jandi haan.", vi: "Rồi tôi đi làm.", en: "Then I go to work." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Mẫu này giúp learner xuất được một mini-flow kể chuyện gọn nhưng không lệch trật tự.",
    explanation_en: "This helps the learner export a compact mini-flow without losing the sequence.",
    traps: [{ trap_vi: "Người nói nữ không dùng ਜਾਂਦਾ/ਉੱਠਦਾ.", trap_en: "A female speaker does not use ਜਾਂਦਾ/ਉੱਠਦਾ.", fix_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", fix_romanization: "main jandi haan." }],
    pass_signal_vi: "Có giờ, habitual, và một quá khứ rõ ràng.",
    pass_signal_en: "Has time, habitual, and one clear past sentence.",
    export_readiness_vi: "Đủ sạch để xuất sang review card.",
    export_readiness_en: "Clean enough to export into a review card.",
  },
];
