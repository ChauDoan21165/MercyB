// src/languages/punjabi/a2GoNoGoSamples.ts
//
// Punjabi A2 go/no-go samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2GoNoGoScenario =
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "forms"
  | "short_messages"
  | "service_flow"
  | "polite_problem_descriptions"
  | "interaction_repair";

export type PunjabiA2GoNoGoStyle =
  | "go_no_go"
  | "release_candidate"
  | "closure_validation"
  | "pre_integration";

export type PunjabiA2GoNoGoLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2GoNoGoTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2GoNoGoItem = {
  id: string;
  scenario: PunjabiA2GoNoGoScenario;
  style: PunjabiA2GoNoGoStyle;
  title_vi: string;
  title_en: string;
  decision_goal_vi: string;
  decision_goal_en: string;
  go_signal_vi: string;
  go_signal_en: string;
  no_go_signal_vi: string;
  no_go_signal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2GoNoGoLine[];
  checks: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  traps: PunjabiA2GoNoGoTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong go/no-go samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these go/no-go samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2GoNoGoSamples: PunjabiA2GoNoGoItem[] = [
  {
    id: "pa_a2_gng_appointments",
    scenario: "appointments",
    style: "go_no_go",
    title_vi: "Go/no-go: lịch hẹn",
    title_en: "Go/no-go: appointments",
    decision_goal_vi: "Quyết định xem mẫu appointment đã giữ ngày, giờ, và giấy tờ chưa.",
    decision_goal_en: "Decide whether the appointment sample keeps date, time, and document.",
    go_signal_vi: "Go nếu có lịch hiện tại, vật cần mang, và câu đổi lịch rõ.",
    go_signal_en: "Go if it has the current appointment, item to bring, and clear reschedule sentence.",
    no_go_signal_vi: "No-go nếu câu đổi lịch làm mất lịch hiện tại.",
    no_go_signal_en: "No-go if the reschedule sentence erases the current appointment.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với clinic, dentist, settlement office, và school office ở Canada.",
    canada_practical_en: "Fits Canadian clinics, dentists, settlement offices, and school offices.",
    lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਵੀਰਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment veervaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Năm lúc hai giờ.", en: "My appointment is Thursday at two." },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਅਤੇ ਫਾਰਮ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card ate form naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế và form. (nam)", en: "I will bring the health card and form. (male speaker)" },
      { pa: "ਜੇ ਲੋੜ ਹੋਵੇ, ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "je lor hove, ki main is nu shukkarvaar kar sakda haan?", vi: "Nếu cần, tôi có thể đổi sang thứ Sáu không? (nam)", en: "If needed, can I move it to Friday? (male speaker)" },
    ],
    checks: [
      { q_vi: "Lịch hiện tại khi nào?", q_en: "When is the current appointment?", answer_pa: "ਵੀਰਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "veervaar do vaje", answer_vi: "Thứ Năm lúc hai giờ.", answer_en: "Thursday at two." },
      { q_vi: "Mang gì?", q_en: "What will be brought?", answer_pa: "ਹੈਲਥ ਕਾਰਡ ਅਤੇ ਫਾਰਮ", answer_romanization: "health card ate form", answer_vi: "Thẻ y tế và form.", answer_en: "Health card and form." },
    ],
    traps: [
      { trap_vi: "ਜੇ ਲੋੜ ਹੋਵੇ là điều kiện, không phải lịch đã đổi.", trap_en: "je lor hove is a condition, not a completed reschedule.", fix_pa: "ਜੇ ਲੋੜ ਹੋਵੇ", fix_romanization: "je lor hove" },
    ],
  },
  {
    id: "pa_a2_gng_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: đi lại",
    title_en: "Pre-integration: transport",
    decision_goal_vi: "Quyết định xem câu hỏi tuyến, điểm xuống, và báo trễ đã nhất quán chưa.",
    decision_goal_en: "Decide whether route question, stop, and delay notice are consistent.",
    go_signal_vi: "Go nếu điểm đến, điểm xuống, và thời lượng trễ đều rõ.",
    go_signal_en: "Go if destination, stop, and delay length are all clear.",
    no_go_signal_vi: "No-go nếu điểm đến hoặc thời lượng trễ bị bỏ mất.",
    no_go_signal_en: "No-go if destination or delay length is missing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, và community shuttle.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, and community shuttles.",
    lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass community centre takk jandi hai?", vi: "Xe buýt này có đi tới trung tâm cộng đồng không?", en: "Does this bus go to the community centre?" },
      { pa: "ਮੈਨੂੰ ਅਗਲੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ।", romanization: "mainu agle stop te utarna hai.", vi: "Tôi phải xuống ở trạm kế tiếp.", en: "I need to get off at the next stop." },
      { pa: "ਮੈਂ ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਾਂਗਾ।", romanization: "main panj mint der naal pahunchanga.", vi: "Tôi sẽ tới muộn năm phút. (nam)", en: "I will arrive five minutes late. (male speaker)" },
    ],
    checks: [
      { q_vi: "Điểm đến là gì?", q_en: "What is the destination?", answer_pa: "ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ", answer_romanization: "community centre", answer_vi: "Trung tâm cộng đồng.", answer_en: "The community centre." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਪੰਜ ਮਿੰਟ", answer_romanization: "panj mint", answer_vi: "Năm phút.", answer_en: "Five minutes." },
    ],
    traps: [
      { trap_vi: "ਦੇਰ ਨਾਲ là 'muộn', không phải yêu cầu nói chậm.", trap_en: "der naal means late, not a request to speak slowly.", fix_pa: "ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ", fix_romanization: "panj mint der naal" },
    ],
  },
  {
    id: "pa_a2_gng_housing",
    scenario: "housing",
    style: "release_candidate",
    title_vi: "Release candidate: nhà ở",
    title_en: "Release candidate: housing",
    decision_goal_vi: "Quyết định xem mẫu nhà ở đủ lịch sự và đủ dữ kiện để dùng chưa.",
    decision_goal_en: "Decide whether the housing sample is polite and complete enough to use.",
    go_signal_vi: "Go nếu có opener, sự cố, thời điểm, và yêu cầu sửa.",
    go_signal_en: "Go if it has opener, problem, timing, and repair request.",
    no_go_signal_vi: "No-go nếu thiếu thời điểm hoặc đổi sự cố giữa câu.",
    no_go_signal_en: "No-go if timing is missing or the problem changes between lines.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp khi nhắn landlord, building manager, hoặc maintenance.",
    canada_practical_en: "Fits messaging a landlord, building manager, or maintenance.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ।", romanization: "maaf karna, sink leak kar riha hai.", vi: "Xin lỗi, bồn rửa đang bị rò rỉ.", en: "Sorry, the sink is leaking." },
      { pa: "ਇਹ ਅੱਜ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh ajj savere ton ho riha hai.", vi: "Việc này xảy ra từ sáng nay.", en: "This has been happening since this morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਕਿਸੇ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj kise nu bhej sakde ho?", vi: "Bạn có thể gửi ai đó đến hôm nay không?", en: "Can you send someone today?" },
    ],
    checks: [
      { q_vi: "Sự cố là gì?", q_en: "What is the problem?", answer_pa: "ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", answer_romanization: "sink leak kar riha hai", answer_vi: "Bồn rửa bị rò.", answer_en: "The sink is leaking." },
      { q_vi: "Bắt đầu khi nào?", q_en: "When did it start?", answer_pa: "ਅੱਜ ਸਵੇਰੇ ਤੋਂ", answer_romanization: "ajj savere ton", answer_vi: "Từ sáng nay.", answer_en: "Since this morning." },
    ],
    traps: [
      { trap_vi: "ਕਰ ਰਿਹਾ ਹੈ giữ nghĩa đang xảy ra; đừng đổi sang quá khứ hoàn tất.", trap_en: "kar riha hai keeps an ongoing meaning; do not turn it into completed past.", fix_pa: "ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", fix_romanization: "leak kar riha hai" },
    ],
  },
  {
    id: "pa_a2_gng_school",
    scenario: "school",
    style: "closure_validation",
    title_vi: "Closure validation: trường học",
    title_en: "Closure validation: school",
    decision_goal_vi: "Quyết định xem câu vắng học, lý do, và yêu cầu homework đã đủ chưa.",
    decision_goal_en: "Decide whether absence, reason, and homework request are complete.",
    go_signal_vi: "Go nếu người bị bệnh là trẻ và yêu cầu gửi bài rõ.",
    go_signal_en: "Go if the sick person is the child and the work request is clear.",
    no_go_signal_vi: "No-go nếu lẫn người bệnh hoặc thiếu yêu cầu bài.",
    no_go_signal_en: "No-go if the sick person is confused or the work request is missing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với teacher email, school office, và parent portal.",
    canada_practical_en: "Usable with teacher email, school office, and parent portals.",
    lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He or she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi homework qua email không?", en: "Can you email the homework?" },
    ],
    checks: [
      { q_vi: "Vì sao trẻ vắng học?", q_en: "Why is the child absent?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu là gì?", q_en: "What is the request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi homework qua email.", answer_en: "Email homework." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਨੂੰ chỉ trẻ trong ngữ cảnh này, không phải phụ huynh.", trap_en: "us nu points to the child here, not the parent.", fix_pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ", fix_romanization: "us nu bukhar hai" },
    ],
  },
  {
    id: "pa_a2_gng_childcare",
    scenario: "childcare",
    style: "go_no_go",
    title_vi: "Go/no-go: childcare pickup",
    title_en: "Go/no-go: childcare pickup",
    decision_goal_vi: "Quyết định xem người đón thay và pickup list đã rõ chưa.",
    decision_goal_en: "Decide whether alternate pickup person and pickup list are clear.",
    go_signal_vi: "Go nếu tên người đón và danh sách khớp.",
    go_signal_en: "Go if pickup name and list match.",
    no_go_signal_vi: "No-go nếu người đón không rõ hoặc không có trong list.",
    no_go_signal_en: "No-go if the pickup person is unclear or not on the list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup lists là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are practical Canadian contexts.",
    lines: [
      { pa: "ਅੱਜ ਮੈਂ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "ajj main panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਸਿਮਰਨ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain Simran bachche nu lain aavegi.", vi: "Chị/em gái tôi, Simran, sẽ đến đón trẻ.", en: "My sister, Simran, will pick up the child." },
      { pa: "ਉਸ ਦਾ ਨਾਮ ਲਿਸਟ ਵਿੱਚ ਹੈ।", romanization: "us da naam list vich hai.", vi: "Tên cô ấy có trong danh sách.", en: "Her name is on the list." },
    ],
    checks: [
      { q_vi: "Ai sẽ đón trẻ?", q_en: "Who will pick up the child?", answer_pa: "ਸਿਮਰਨ", answer_romanization: "Simran", answer_vi: "Simran.", answer_en: "Simran." },
      { q_vi: "Tên ở đâu?", q_en: "Where is her name?", answer_pa: "ਲਿਸਟ ਵਿੱਚ", answer_romanization: "list vich", answer_vi: "Trong danh sách.", answer_en: "On the list." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਦਾ ਨਾਮ là tên của cô ấy/người đó, không phải tên của tôi.", trap_en: "us da naam means her or that person's name, not my name.", fix_pa: "ਉਸ ਦਾ ਨਾਮ", fix_romanization: "us da naam" },
    ],
  },
  {
    id: "pa_a2_gng_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "release_candidate",
    title_vi: "Release candidate: small talk nơi làm",
    title_en: "Release candidate: workplace small talk",
    decision_goal_vi: "Quyết định xem small talk ngắn và chuyển sang nhiệm vụ đã ổn chưa.",
    decision_goal_en: "Decide whether brief small talk and task transition are ready.",
    go_signal_vi: "Go nếu chào hỏi lịch sự, trả lời ngắn, và có task rõ.",
    go_signal_en: "Go if polite greeting, short reply, and clear task are present.",
    no_go_signal_vi: "No-go nếu small talk quá dài hoặc thiếu câu việc.",
    no_go_signal_en: "No-go if small talk is too long or the work sentence is missing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong break room, shift handoff, và với supervisor.",
    canada_practical_en: "Usable in a break room, shift handoff, and with a supervisor.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "changa hai, dhanvaad.", vi: "Tốt, cảm ơn.", en: "Good, thank you." },
      { pa: "ਕੀ ਅਸੀਂ ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ ਕਰੀਏ?", romanization: "ki asin shift notes check kariye?", vi: "Chúng ta kiểm tra ghi chú ca làm nhé?", en: "Shall we check the shift notes?" },
    ],
    checks: [
      { q_vi: "Câu trả lời là gì?", q_en: "What is the reply?", answer_pa: "ਚੰਗਾ ਹੈ", answer_romanization: "changa hai", answer_vi: "Tốt.", answer_en: "Good." },
      { q_vi: "Nhiệm vụ là gì?", q_en: "What is the task?", answer_pa: "ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ", answer_romanization: "shift notes check", answer_vi: "Kiểm tra ghi chú ca làm.", answer_en: "Check shift notes." },
    ],
    traps: [
      { trap_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ trong workplace thông thường.", trap_en: "tuhada is more polite than tera in a typical workplace.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ", fix_romanization: "tuhada din" },
    ],
  },
  {
    id: "pa_a2_gng_forms",
    scenario: "forms",
    style: "closure_validation",
    title_vi: "Closure validation: forms",
    title_en: "Closure validation: forms",
    decision_goal_vi: "Quyết định xem tên, địa chỉ, và giấy tờ thiếu đã rõ chưa.",
    decision_goal_en: "Decide whether name, address, and missing document are clear.",
    go_signal_vi: "Go nếu các field form không đổi giữa các câu.",
    go_signal_en: "Go if form fields stay consistent across lines.",
    no_go_signal_vi: "No-go nếu lẫn tên với địa chỉ hoặc thiếu giấy tờ.",
    no_go_signal_en: "No-go if name/address are confused or the document is missing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho library card, clinic intake, school registration, và housing form.",
    canada_practical_en: "Usable for a library card, clinic intake, school registration, and housing form.",
    lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਹਰਪ੍ਰੀਤ ਕੌਰ ਹੈ।", romanization: "mera naam Harpreet Kaur hai.", vi: "Tên tôi là Harpreet Kaur.", en: "My name is Harpreet Kaur." },
      { pa: "ਮੇਰਾ ਪਤਾ 45 ਕਿੰਗ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 45 King Street hai.", vi: "Địa chỉ của tôi là 45 King Street.", en: "My address is 45 King Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਪਤੇ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।", romanization: "mere kol pate da saboot nahi hai.", vi: "Tôi không có giấy chứng minh địa chỉ.", en: "I do not have proof of address." },
    ],
    checks: [
      { q_vi: "Tên là gì?", q_en: "What is the name?", answer_pa: "ਹਰਪ੍ਰੀਤ ਕੌਰ", answer_romanization: "Harpreet Kaur", answer_vi: "Harpreet Kaur.", answer_en: "Harpreet Kaur." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਪਤੇ ਦਾ ਸਬੂਤ", answer_romanization: "pate da saboot", answer_vi: "Giấy chứng minh địa chỉ.", answer_en: "Proof of address." },
    ],
    traps: [
      { trap_vi: "ਪਤਾ trong form là địa chỉ, không phải động từ 'biết'.", trap_en: "pata on a form means address, not know.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" },
    ],
  },
  {
    id: "pa_a2_gng_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    decision_goal_vi: "Quyết định xem giờ, nơi, và vật cần mang đã được tách đúng chưa.",
    decision_goal_en: "Decide whether time, place, and item to bring are extracted correctly.",
    go_signal_vi: "Go nếu giữ đủ thời gian, địa điểm, và vật cần mang.",
    go_signal_en: "Go if time, place, and item to bring are all kept.",
    no_go_signal_vi: "No-go nếu chỉ giữ địa điểm hoặc chỉ giữ vật cần mang.",
    no_go_signal_en: "No-go if only the place or only the item is kept.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với school notice, work note, library program, và settlement class.",
    canada_practical_en: "Fits school notices, work notes, library programs, and settlement classes.",
    lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ ਲਿਆਓ।", romanization: "kirpa karke notebook ate pen liaao.", vi: "Xin hãy mang vở và bút.", en: "Please bring a notebook and pen." },
    ],
    checks: [
      { q_vi: "Lớp học khi nào?", q_en: "When is the class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ", answer_romanization: "notebook ate pen", answer_vi: "Vở và bút.", answer_en: "Notebook and pen." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ giữ nơi mà bỏ giờ và đồ cần mang.", trap_en: "Do not keep only the place and omit the time and items.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" },
    ],
  },
  {
    id: "pa_a2_gng_service_flow",
    scenario: "service_flow",
    style: "go_no_go",
    title_vi: "Go/no-go: luồng dịch vụ",
    title_en: "Go/no-go: service flow",
    decision_goal_vi: "Quyết định xem opener, nhu cầu, và câu hỏi giấy tờ đã đủ chưa.",
    decision_goal_en: "Decide whether opener, need, and document question are complete.",
    go_signal_vi: "Go nếu nhu cầu và câu hỏi giấy tờ nối nhau rõ.",
    go_signal_en: "Go if the need and document question clearly connect.",
    no_go_signal_vi: "No-go nếu nêu nhu cầu nhưng không hỏi bước tiếp theo.",
    no_go_signal_en: "No-go if the need is stated but no next-step question is asked.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Service Canada, ServiceOntario, bank, và library desk là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Service Canada, ServiceOntario, banks, and library desks are practical Canadian contexts.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "sat sri akal, mainu madad chahidi hai.", vi: "Xin chào, tôi cần giúp đỡ.", en: "Hello, I need help." },
      { pa: "ਮੈਂ ਆਪਣਾ ਪਤਾ ਬਦਲਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main aapna pata badalna chahunda haan.", vi: "Tôi muốn đổi địa chỉ. (nam)", en: "I want to change my address. (male speaker)" },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "mainu kihrhe kaaghaz chahide han?", vi: "Tôi cần giấy tờ nào?", en: "Which documents do I need?" },
    ],
    checks: [
      { q_vi: "Nhu cầu là gì?", q_en: "What is the need?", answer_pa: "ਪਤਾ ਬਦਲਣਾ", answer_romanization: "pata badalna", answer_vi: "Đổi địa chỉ.", answer_en: "Change address." },
      { q_vi: "Hỏi gì?", q_en: "What is asked?", answer_pa: "ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", answer_romanization: "kihrhe kaaghaz chahide han?", answer_vi: "Cần giấy tờ nào?", answer_en: "Which documents are needed?" },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦੇ ਹਨ là 'cần', không phải 'thích'.", trap_en: "chahide han means needed, not liked.", fix_pa: "ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ", fix_romanization: "kaaghaz chahide han" },
    ],
  },
  {
    id: "pa_a2_gng_polite_problem",
    scenario: "polite_problem_descriptions",
    style: "release_candidate",
    title_vi: "Release candidate: mô tả vấn đề lịch sự",
    title_en: "Release candidate: polite problem descriptions",
    decision_goal_vi: "Quyết định xem opener lịch sự, vấn đề, và câu hỏi bước tiếp theo đã đủ chưa.",
    decision_goal_en: "Decide whether polite opener, problem, and next-step question are complete.",
    go_signal_vi: "Go nếu vấn đề được nêu và được yêu cầu kiểm tra rõ.",
    go_signal_en: "Go if the problem is stated and clearly requested for checking.",
    no_go_signal_vi: "No-go nếu ਇਸ ਨੂੰ không còn trỏ về vấn đề đã nêu.",
    no_go_signal_en: "No-go if is nu no longer points back to the stated problem.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở front desk, pharmacy, bank counter, hoặc community service desk.",
    canada_practical_en: "Usable at a front desk, pharmacy, bank counter, or community service desk.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mera card kamm nahi kar riha.", vi: "Xin lỗi, thẻ của tôi không hoạt động.", en: "Sorry, my card is not working." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi is nu check kar sakde ho?", vi: "Bạn có thể kiểm tra việc này không?", en: "Can you check this?" },
      { pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", romanization: "mainu hun ki karna hai?", vi: "Bây giờ tôi cần làm gì?", en: "What do I need to do now?" },
    ],
    checks: [
      { q_vi: "Vấn đề là gì?", q_en: "What is the problem?", answer_pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "card kamm nahi kar riha", answer_vi: "Thẻ không hoạt động.", answer_en: "The card is not working." },
      { q_vi: "Câu hỏi bước tiếp theo là gì?", q_en: "What is the next-step question?", answer_pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", answer_romanization: "mainu hun ki karna hai?", answer_vi: "Bây giờ tôi cần làm gì?", answer_en: "What do I need to do now?" },
    ],
    traps: [
      { trap_vi: "ਇਸ ਨੂੰ trỏ về vấn đề vừa nêu; đừng đổi chủ đề.", trap_en: "is nu points back to the stated problem; do not change topic.", fix_pa: "ਇਸ ਨੂੰ ਚੈੱਕ", fix_romanization: "is nu check" },
    ],
  },
  {
    id: "pa_a2_gng_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: sửa chữa tương tác",
    title_en: "Pre-integration: interaction repair",
    decision_goal_vi: "Quyết định xem báo chưa hiểu, xin nhắc lại, và xác nhận nghĩa đã đủ chưa.",
    decision_goal_en: "Decide whether non-understanding, repetition request, and confirmation are complete.",
    go_signal_vi: "Go nếu có đủ ba bước repair.",
    go_signal_en: "Go if all three repair steps are present.",
    no_go_signal_vi: "No-go nếu chỉ nói 'what?' hoặc không xác nhận lại.",
    no_go_signal_en: "No-go if it only says 'what?' or does not confirm back.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ।", romanization: "maaf karna, main samjhia nahi.", vi: "Xin lỗi, tôi chưa hiểu.", en: "Sorry, I did not understand." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi hauli ate dubara kahi sakde ho?", vi: "Bạn có thể nói chậm và nhắc lại không?", en: "Can you say it slowly and again?" },
      { pa: "ਤਾਂ ਮੈਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਆਉਣਾ ਹੈ, ਠੀਕ ਹੈ?", romanization: "taan mainu shukkarvaar auna hai, theek hai?", vi: "Vậy tôi phải đến thứ Sáu, đúng không?", en: "So I need to come on Friday, right?" },
    ],
    checks: [
      { q_vi: "Câu báo chưa hiểu là gì?", q_en: "What is the non-understanding signal?", answer_pa: "ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ", answer_romanization: "main samjhia nahi", answer_vi: "Tôi chưa hiểu.", answer_en: "I did not understand." },
      { q_vi: "Người học xác nhận ngày nào?", q_en: "Which day does the learner confirm?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ", answer_romanization: "shukkarvaar", answer_vi: "Thứ Sáu.", answer_en: "Friday." },
    ],
    traps: [
      { trap_vi: "ਹੌਲੀ ở đây là chậm, không nhất thiết là nhỏ tiếng.", trap_en: "hauli here means slowly, not necessarily quietly.", fix_pa: "ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ", fix_romanization: "hauli ate dubara" },
    ],
  },
];
