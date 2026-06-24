// src/languages/punjabi/a2ClosureValidationSamples.ts
//
// Punjabi A2 closure-validation samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred. This
// is not A11 integration.

export type PunjabiA2ClosureValidationScenario =
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "forms"
  | "short_messages"
  | "workplace_small_talk"
  | "polite_problem_descriptions"
  | "interaction_repair";

export type PunjabiA2ClosureValidationStyle =
  | "closure_validation"
  | "final_cross_check"
  | "pre_integration";

export type PunjabiA2ClosureValidationLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2ClosureValidationTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2ClosureValidationItem = {
  id: string;
  scenario: PunjabiA2ClosureValidationScenario;
  style: PunjabiA2ClosureValidationStyle;
  title_vi: string;
  title_en: string;
  closure_goal_vi: string;
  closure_goal_en: string;
  flow_check_vi: string;
  flow_check_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2ClosureValidationLine[];
  validation_checks: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  traps: PunjabiA2ClosureValidationTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong closure-validation samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these closure-validation samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2ClosureValidationSamples: PunjabiA2ClosureValidationItem[] = [
  {
    id: "pa_a2_closure_appointments",
    scenario: "appointments",
    style: "closure_validation",
    title_vi: "Closure validation: lịch hẹn",
    title_en: "Closure validation: appointments",
    closure_goal_vi: "Xác nhận người học giữ ngày, giờ, và giấy tờ cần mang.",
    closure_goal_en: "Confirm the learner keeps the date, time, and document to bring.",
    flow_check_vi: "Câu đổi lịch phải không làm mất lịch hiện tại.",
    flow_check_en: "The reschedule sentence must not erase the current appointment.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với clinic, dentist, school office, và settlement appointment.",
    canada_practical_en: "Fits clinic, dentist, school office, and settlement appointments.",
    lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਦਸ ਵਜੇ ਹੈ।", romanization: "meri appointment somvaar das vaje hai.", vi: "Lịch hẹn của tôi là thứ Hai lúc mười giờ.", en: "My appointment is Monday at ten." },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
      { pa: "ਜੇ ਲੋੜ ਹੋਵੇ, ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਮੰਗਲਵਾਰ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "je lor hove, ki main is nu mangalvaar kar sakda haan?", vi: "Nếu cần, tôi có thể đổi sang thứ Ba không? (nam)", en: "If needed, can I move it to Tuesday? (male speaker)" },
    ],
    validation_checks: [
      { q_vi: "Lịch hiện tại khi nào?", q_en: "When is the current appointment?", answer_pa: "ਸੋਮਵਾਰ ਦਸ ਵਜੇ", answer_romanization: "somvaar das vaje", answer_vi: "Thứ Hai lúc mười giờ.", answer_en: "Monday at ten." },
      { q_vi: "Mang gì?", q_en: "What should be brought?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    traps: [
      { trap_vi: "ਜੇ ਲੋੜ ਹੋਵੇ là 'nếu cần', không phải lịch đã được đổi.", trap_en: "je lor hove means if needed, not that the appointment has already changed.", fix_pa: "ਜੇ ਲੋੜ ਹੋਵੇ", fix_romanization: "je lor hove" },
    ],
  },
  {
    id: "pa_a2_closure_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: transit",
    title_en: "Pre-integration: transit",
    closure_goal_vi: "Xác nhận hướng đi, điểm xuống, và câu báo trễ.",
    closure_goal_en: "Confirm direction, stop, and delay sentence.",
    flow_check_vi: "Điểm đến và điểm xuống phải cùng một chuyến đi.",
    flow_check_en: "The destination and stop must belong to the same trip.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, và community shuttle.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, and community shuttles.",
    lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਮੇਨ ਸਟਰੀਟ ਤੇ ਉਤਰਨਾ ਹੈ।", romanization: "mainu Main Street te utarna hai.", vi: "Tôi phải xuống ở Main Street.", en: "I need to get off at Main Street." },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", romanization: "main das mint der naal aavangi.", vi: "Tôi sẽ đến muộn mười phút. (nữ)", en: "I will arrive ten minutes late. (female speaker)" },
    ],
    validation_checks: [
      { q_vi: "Điểm đến là gì?", q_en: "What is the destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "The library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    traps: [
      { trap_vi: "ਦੇਰ ਨਾਲ là 'muộn', không phải yêu cầu nói chậm.", trap_en: "der naal means late, not a request to speak slowly.", fix_pa: "ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ", fix_romanization: "das mint der naal" },
    ],
  },
  {
    id: "pa_a2_closure_housing",
    scenario: "housing",
    style: "closure_validation",
    title_vi: "Closure validation: nhà ở",
    title_en: "Closure validation: housing",
    closure_goal_vi: "Xác nhận opener lịch sự, sự cố, thời điểm bắt đầu, và yêu cầu sửa.",
    closure_goal_en: "Confirm polite opener, problem, start time, and repair request.",
    flow_check_vi: "Sự cố phải giữ nguyên từ mô tả đến yêu cầu.",
    flow_check_en: "The problem must stay the same from description to request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp khi nhắn landlord, building manager, hoặc maintenance.",
    canada_practical_en: "Fits messaging a landlord, building manager, or maintenance.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ।", romanization: "maaf karna, sink leak kar riha hai.", vi: "Xin lỗi, bồn rửa đang bị rò rỉ.", en: "Sorry, the sink is leaking." },
      { pa: "ਇਹ ਅੱਜ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh ajj savere ton ho riha hai.", vi: "Việc này xảy ra từ sáng nay.", en: "This has been happening since this morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਕਿਸੇ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj kise nu bhej sakde ho?", vi: "Bạn có thể gửi ai đó đến hôm nay không?", en: "Can you send someone today?" },
    ],
    validation_checks: [
      { q_vi: "Sự cố là gì?", q_en: "What is the problem?", answer_pa: "ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", answer_romanization: "sink leak kar riha hai", answer_vi: "Bồn rửa bị rò.", answer_en: "The sink is leaking." },
      { q_vi: "Bắt đầu khi nào?", q_en: "When did it start?", answer_pa: "ਅੱਜ ਸਵੇਰੇ ਤੋਂ", answer_romanization: "ajj savere ton", answer_vi: "Từ sáng nay.", answer_en: "Since this morning." },
    ],
    traps: [
      { trap_vi: "ਕਰ ਰਿਹਾ ਹੈ giữ nghĩa đang xảy ra; đừng đổi sang quá khứ hoàn tất.", trap_en: "kar riha hai keeps an ongoing meaning; do not turn it into completed past.", fix_pa: "ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", fix_romanization: "leak kar riha hai" },
    ],
  },
  {
    id: "pa_a2_closure_school",
    scenario: "school",
    style: "final_cross_check",
    title_vi: "Final cross-check: trường học",
    title_en: "Final cross-check: school",
    closure_goal_vi: "Xác nhận câu vắng học, lý do, và yêu cầu homework.",
    closure_goal_en: "Confirm absence sentence, reason, and homework request.",
    flow_check_vi: "Người bị bệnh phải là trẻ, không phải phụ huynh.",
    flow_check_en: "The sick person must be the child, not the parent.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với teacher email, school office, và parent portal.",
    canada_practical_en: "Usable with teacher email, school office, and parent portals.",
    lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਖਾਂਸੀ ਹੈ।", romanization: "us nu khansi hai.", vi: "Em ấy bị ho.", en: "He or she has a cough." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi homework qua email không?", en: "Can you email the homework?" },
    ],
    validation_checks: [
      { q_vi: "Vì sao trẻ vắng học?", q_en: "Why is the child absent?", answer_pa: "ਖਾਂਸੀ ਹੈ", answer_romanization: "khansi hai", answer_vi: "Bị ho.", answer_en: "Has a cough." },
      { q_vi: "Yêu cầu là gì?", q_en: "What is the request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi homework qua email.", answer_en: "Email the homework." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਨੂੰ trong ngữ cảnh này là trẻ bị ho, không phải 'tôi bị ho'.", trap_en: "us nu means the child has a cough here, not I have a cough.", fix_pa: "ਉਸ ਨੂੰ ਖਾਂਸੀ ਹੈ", fix_romanization: "us nu khansi hai" },
    ],
  },
  {
    id: "pa_a2_closure_childcare",
    scenario: "childcare",
    style: "closure_validation",
    title_vi: "Closure validation: childcare pickup",
    title_en: "Closure validation: childcare pickup",
    closure_goal_vi: "Xác nhận giờ đón, người đón thay, và pickup list.",
    closure_goal_en: "Confirm pickup time, alternate pickup person, and pickup list.",
    flow_check_vi: "Người được phép đón phải khớp với danh sách.",
    flow_check_en: "The authorized pickup person must match the list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup lists là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are practical Canadian contexts.",
    lines: [
      { pa: "ਅੱਜ ਮੈਂ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "ajj main panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਸਿਮਰਨ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain Simran bachche nu lain aavegi.", vi: "Chị/em gái tôi, Simran, sẽ đến đón trẻ.", en: "My sister, Simran, will come to pick up the child." },
      { pa: "ਉਸ ਦਾ ਨਾਮ ਲਿਸਟ ਵਿੱਚ ਹੈ।", romanization: "us da naam list vich hai.", vi: "Tên cô ấy có trong danh sách.", en: "Her name is on the list." },
    ],
    validation_checks: [
      { q_vi: "Ai sẽ đón trẻ?", q_en: "Who will pick up the child?", answer_pa: "ਸਿਮਰਨ", answer_romanization: "Simran", answer_vi: "Simran.", answer_en: "Simran." },
      { q_vi: "Tên ở đâu?", q_en: "Where is the name?", answer_pa: "ਲਿਸਟ ਵਿੱਚ", answer_romanization: "list vich", answer_vi: "Trong danh sách.", answer_en: "On the list." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਦਾ ਨਾਮ là tên của cô ấy/người đó, không phải tên của tôi.", trap_en: "us da naam means her or that person's name, not my name.", fix_pa: "ਉਸ ਦਾ ਨਾਮ", fix_romanization: "us da naam" },
    ],
  },
  {
    id: "pa_a2_closure_forms",
    scenario: "forms",
    style: "final_cross_check",
    title_vi: "Final cross-check: forms",
    title_en: "Final cross-check: forms",
    closure_goal_vi: "Xác nhận tên, địa chỉ, và giấy tờ còn thiếu.",
    closure_goal_en: "Confirm name, address, and missing document.",
    flow_check_vi: "Field form phải giữ nguyên giữa câu nói và câu kiểm tra.",
    flow_check_en: "Form fields must stay consistent between lines and checks.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho library card, clinic intake, school registration, và housing form.",
    canada_practical_en: "Usable for a library card, clinic intake, school registration, and housing form.",
    lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨਦੀਪ ਸਿੰਘ ਹੈ।", romanization: "mera naam Amandeep Singh hai.", vi: "Tên tôi là Amandeep Singh.", en: "My name is Amandeep Singh." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 Main Street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਪਤੇ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।", romanization: "mere kol pate da saboot nahi hai.", vi: "Tôi không có giấy chứng minh địa chỉ.", en: "I do not have proof of address." },
    ],
    validation_checks: [
      { q_vi: "Tên là gì?", q_en: "What is the name?", answer_pa: "ਅਮਨਦੀਪ ਸਿੰਘ", answer_romanization: "Amandeep Singh", answer_vi: "Amandeep Singh.", answer_en: "Amandeep Singh." },
      { q_vi: "Thiếu gì?", q_en: "What is missing?", answer_pa: "ਪਤੇ ਦਾ ਸਬੂਤ", answer_romanization: "pate da saboot", answer_vi: "Giấy chứng minh địa chỉ.", answer_en: "Proof of address." },
    ],
    traps: [
      { trap_vi: "ਪਤਾ trong form là địa chỉ; đừng hiểu là 'biết'.", trap_en: "pata on a form means address; do not read it as know.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" },
    ],
  },
  {
    id: "pa_a2_closure_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    closure_goal_vi: "Xác nhận giờ, nơi, và vật cần mang từ tin nhắn.",
    closure_goal_en: "Confirm time, place, and item to bring from a message.",
    flow_check_vi: "Thông tin rút ra phải đủ ba mảnh chính.",
    flow_check_en: "The extracted information must include all three key details.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với school notice, work note, library program, và settlement class.",
    canada_practical_en: "Fits school notices, work notes, library programs, and settlement classes.",
    lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ ਲਿਆਓ।", romanization: "kirpa karke notebook ate pen liaao.", vi: "Xin hãy mang vở và bút.", en: "Please bring a notebook and pen." },
    ],
    validation_checks: [
      { q_vi: "Lớp học khi nào?", q_en: "When is the class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ", answer_romanization: "notebook ate pen", answer_vi: "Vở và bút.", answer_en: "Notebook and pen." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ lấy địa điểm mà bỏ giờ và đồ cần mang.", trap_en: "Do not extract only the place and omit the time and items.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ", fix_romanization: "kal tinn vaje library vich" },
    ],
  },
  {
    id: "pa_a2_closure_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "closure_validation",
    title_vi: "Closure validation: workplace small talk",
    title_en: "Closure validation: workplace small talk",
    closure_goal_vi: "Xác nhận chào hỏi, trả lời ngắn, và chuyển sang nhiệm vụ.",
    closure_goal_en: "Confirm greeting, short answer, and move to a task.",
    flow_check_vi: "Small talk phải ngắn và không làm mất câu việc.",
    flow_check_en: "Small talk must stay brief and not lose the work sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong break room, shift handoff, và với supervisor.",
    canada_practical_en: "Usable in a break room, shift handoff, and with a supervisor.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "changa hai, dhanvaad.", vi: "Tốt, cảm ơn.", en: "Good, thank you." },
      { pa: "ਕੀ ਅਸੀਂ ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ ਕਰੀਏ?", romanization: "ki asin shift notes check kariye?", vi: "Chúng ta kiểm tra ghi chú ca làm nhé?", en: "Shall we check the shift notes?" },
    ],
    validation_checks: [
      { q_vi: "Câu trả lời là gì?", q_en: "What is the reply?", answer_pa: "ਚੰਗਾ ਹੈ", answer_romanization: "changa hai", answer_vi: "Tốt.", answer_en: "Good." },
      { q_vi: "Nhiệm vụ là gì?", q_en: "What is the task?", answer_pa: "ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ", answer_romanization: "shift notes check", answer_vi: "Kiểm tra ghi chú ca làm.", answer_en: "Check shift notes." },
    ],
    traps: [
      { trap_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ trong workplace thông thường.", trap_en: "tuhada is more polite than tera in a typical workplace.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ", fix_romanization: "tuhada din" },
    ],
  },
  {
    id: "pa_a2_closure_polite_problem",
    scenario: "polite_problem_descriptions",
    style: "final_cross_check",
    title_vi: "Final cross-check: mô tả vấn đề lịch sự",
    title_en: "Final cross-check: polite problem descriptions",
    closure_goal_vi: "Xác nhận opener lịch sự, vấn đề, và câu nhờ kiểm tra.",
    closure_goal_en: "Confirm polite opener, problem, and check request.",
    flow_check_vi: "Vấn đề được nhắc trong câu đầu phải là cùng vấn đề được yêu cầu kiểm tra.",
    flow_check_en: "The problem stated first must be the same problem requested for checking.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở front desk, pharmacy, bank counter, hoặc community service desk.",
    canada_practical_en: "Usable at a front desk, pharmacy, bank counter, or community service desk.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mera card kamm nahi kar riha.", vi: "Xin lỗi, thẻ của tôi không hoạt động.", en: "Sorry, my card is not working." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi is nu check kar sakde ho?", vi: "Bạn có thể kiểm tra việc này không?", en: "Can you check this?" },
      { pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", romanization: "mainu hun ki karna hai?", vi: "Bây giờ tôi cần làm gì?", en: "What do I need to do now?" },
    ],
    validation_checks: [
      { q_vi: "Vấn đề là gì?", q_en: "What is the problem?", answer_pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "card kamm nahi kar riha", answer_vi: "Thẻ không hoạt động.", answer_en: "The card is not working." },
      { q_vi: "Câu hỏi bước tiếp theo là gì?", q_en: "What is the next-step question?", answer_pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", answer_romanization: "mainu hun ki karna hai?", answer_vi: "Bây giờ tôi cần làm gì?", answer_en: "What do I need to do now?" },
    ],
    traps: [
      { trap_vi: "ਇਸ ਨੂੰ trỏ về vấn đề vừa nêu; đừng đổi sang việc khác.", trap_en: "is nu points back to the stated problem; do not switch to another issue.", fix_pa: "ਇਸ ਨੂੰ ਚੈੱਕ", fix_romanization: "is nu check" },
    ],
  },
  {
    id: "pa_a2_closure_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: sửa chữa tương tác",
    title_en: "Pre-integration: interaction repair",
    closure_goal_vi: "Xác nhận xin nhắc lại, xin nói chậm, và xác nhận nghĩa.",
    closure_goal_en: "Confirm repetition request, slower speech request, and meaning confirmation.",
    flow_check_vi: "Câu xác nhận phải nối với thông tin vừa nghe.",
    flow_check_en: "The confirmation must connect to the information just heard.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ।", romanization: "maaf karna, main samjhia nahi.", vi: "Xin lỗi, tôi chưa hiểu.", en: "Sorry, I did not understand." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi hauli ate dubara kahi sakde ho?", vi: "Bạn có thể nói chậm và nhắc lại không?", en: "Can you say it slowly and again?" },
      { pa: "ਤਾਂ ਮੈਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਆਉਣਾ ਹੈ, ਠੀਕ ਹੈ?", romanization: "taan mainu shukkarvaar auna hai, theek hai?", vi: "Vậy tôi phải đến thứ Sáu, đúng không?", en: "So I need to come on Friday, right?" },
    ],
    validation_checks: [
      { q_vi: "Câu báo chưa hiểu là gì?", q_en: "What is the non-understanding signal?", answer_pa: "ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ", answer_romanization: "main samjhia nahi", answer_vi: "Tôi chưa hiểu.", answer_en: "I did not understand." },
      { q_vi: "Người học xác nhận ngày nào?", q_en: "Which day does the learner confirm?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ", answer_romanization: "shukkarvaar", answer_vi: "Thứ Sáu.", answer_en: "Friday." },
    ],
    traps: [
      { trap_vi: "ਹੌਲੀ ਬੋਲੋ là nói chậm, không nhất thiết là nói nhỏ.", trap_en: "hauli bolo means speak slowly, not necessarily more quietly.", fix_pa: "ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ", fix_romanization: "hauli ate dubara" },
    ],
  },
];
