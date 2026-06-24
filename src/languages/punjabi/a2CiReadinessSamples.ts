// src/languages/punjabi/a2CiReadinessSamples.ts
//
// Punjabi A2 CI-readiness samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2CiReadinessScenario =
  | "daily_routines"
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

export type PunjabiA2CiReadinessStyle =
  | "ci_readiness"
  | "mr_readiness"
  | "final_freeze"
  | "pre_integration";

export type PunjabiA2CiReadinessLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2CiReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2CiReadinessItem = {
  id: string;
  scenario: PunjabiA2CiReadinessScenario;
  style: PunjabiA2CiReadinessStyle;
  title_vi: string;
  title_en: string;
  ci_goal_vi: string;
  ci_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2CiReadinessLine[];
  checks: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  traps: PunjabiA2CiReadinessTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong CI-readiness samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these CI-readiness samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2CiReadinessSamples: PunjabiA2CiReadinessItem[] = [
  {
    id: "pa_a2_ci_daily_routines",
    scenario: "daily_routines",
    style: "ci_readiness",
    title_vi: "CI-readiness: thói quen hằng ngày",
    title_en: "CI-readiness: daily routines",
    ci_goal_vi: "Kiểm tra giờ, thói quen sáng, và một câu quá khứ ngắn vẫn ổn dưới test.",
    ci_goal_en: "Check that time, morning routine, and one short past sentence stay stable under tests.",
    stable_signal_vi: "Ổn nếu giờ thức dậy và giờ ra khỏi nhà không bị lẫn.",
    stable_signal_en: "Stable if wake-up and leaving-home times are not confused.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích cho lịch đi lớp ESL, ca làm sáng, và appointment sớm.",
    canada_practical_en: "Useful for ESL class schedules, morning shifts, and early appointments.",
    lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere chhe vaje utthdi haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nữ)", en: "I wake up at six in the morning. (female speaker)" },
      { pa: "ਸੱਤ ਵਜੇ ਮੈਂ ਘਰ ਤੋਂ ਨਿਕਲਦੀ ਹਾਂ।", romanization: "satt vaje main ghar ton nikaldi haan.", vi: "Lúc bảy giờ tôi ra khỏi nhà. (nữ)", en: "At seven I leave home. (female speaker)" },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਜਲਦੀ ਸੌਂ ਗਈ।", romanization: "kal main jaldi saun gayi.", vi: "Hôm qua tôi đi ngủ sớm.", en: "Yesterday I went to bed early." },
    ],
    checks: [
      { q_vi: "Thức dậy khi nào?", q_en: "When does the speaker wake up?", answer_pa: "ਛੇ ਵਜੇ", answer_romanization: "chhe vaje", answer_vi: "Sáu giờ.", answer_en: "Six o'clock." },
      { q_vi: "Hôm qua làm gì?", q_en: "What happened yesterday?", answer_pa: "ਜਲਦੀ ਸੌਂ ਗਈ", answer_romanization: "jaldi saun gayi", answer_vi: "Đi ngủ sớm.", answer_en: "Went to bed early." },
    ],
    traps: [
      { trap_vi: "Đừng đổi giờ thức dậy thành giờ ra khỏi nhà.", trap_en: "Do not change wake-up time into leaving-home time.", fix_pa: "ਛੇ ਵਜੇ ਉੱਠਦੀ ਹਾਂ", fix_romanization: "chhe vaje utthdi haan" },
    ],
  },
  {
    id: "pa_a2_ci_appointments",
    scenario: "appointments",
    style: "mr_readiness",
    title_vi: "MR-readiness: lịch hẹn",
    title_en: "MR-readiness: appointments",
    ci_goal_vi: "Giữ lịch, giấy tờ, và câu đổi lịch nếu cần trong một mẫu testable.",
    ci_goal_en: "Keep appointment, documents, and optional reschedule sentence in one testable sample.",
    stable_signal_vi: "Ổn nếu lịch hiện tại và đồ cần mang đều có.",
    stable_signal_en: "Stable if current appointment and items to bring are both present.",
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
    id: "pa_a2_ci_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: đi lại",
    title_en: "Pre-integration: transport",
    ci_goal_vi: "Giữ tuyến, điểm xuống, và báo trễ nhất quán.",
    ci_goal_en: "Keep route, stop, and delay notice consistent.",
    stable_signal_vi: "Ổn nếu điểm đến, điểm xuống, và thời lượng trễ đều rõ.",
    stable_signal_en: "Stable if destination, stop, and delay length are all clear.",
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
    id: "pa_a2_ci_housing",
    scenario: "housing",
    style: "ci_readiness",
    title_vi: "CI-readiness: nhà ở",
    title_en: "CI-readiness: housing",
    ci_goal_vi: "Giữ opener lịch sự, sự cố, thời điểm, và yêu cầu sửa.",
    ci_goal_en: "Keep polite opener, problem, timing, and repair request.",
    stable_signal_vi: "Ổn nếu sự cố giữ nguyên từ mô tả đến yêu cầu.",
    stable_signal_en: "Stable if the problem stays the same from description to request.",
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
    id: "pa_a2_ci_school",
    scenario: "school",
    style: "final_freeze",
    title_vi: "Final-freeze: trường học",
    title_en: "Final-freeze: school",
    ci_goal_vi: "Giữ vắng học, lý do, và yêu cầu homework rõ.",
    ci_goal_en: "Keep absence, reason, and homework request clear.",
    stable_signal_vi: "Ổn nếu người bị bệnh là trẻ và yêu cầu gửi bài rõ.",
    stable_signal_en: "Stable if the sick person is the child and the work request is clear.",
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
    id: "pa_a2_ci_childcare",
    scenario: "childcare",
    style: "mr_readiness",
    title_vi: "MR-readiness: childcare pickup",
    title_en: "MR-readiness: childcare pickup",
    ci_goal_vi: "Giữ người đón thay, thời gian, và pickup list rõ.",
    ci_goal_en: "Keep alternate pickup person, time, and pickup list clear.",
    stable_signal_vi: "Ổn nếu tên người đón và list khớp.",
    stable_signal_en: "Stable if pickup name and list match.",
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
    id: "pa_a2_ci_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "ci_readiness",
    title_vi: "CI-readiness: small talk nơi làm",
    title_en: "CI-readiness: workplace small talk",
    ci_goal_vi: "Giữ chào hỏi, trả lời ngắn, và chuyển sang nhiệm vụ rõ.",
    ci_goal_en: "Keep greeting, short reply, and task transition clear.",
    stable_signal_vi: "Ổn nếu small talk lịch sự và task rõ.",
    stable_signal_en: "Stable if small talk is polite and the task is clear.",
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
    id: "pa_a2_ci_forms",
    scenario: "forms",
    style: "final_freeze",
    title_vi: "Final-freeze: forms",
    title_en: "Final-freeze: forms",
    ci_goal_vi: "Giữ tên, địa chỉ, và giấy tờ thiếu ổn định.",
    ci_goal_en: "Keep name, address, and missing document stable.",
    stable_signal_vi: "Ổn nếu các field form không đổi giữa các câu.",
    stable_signal_en: "Stable if form fields stay consistent across lines.",
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
    id: "pa_a2_ci_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    ci_goal_vi: "Giữ giờ, nơi, và vật cần mang được tách đúng.",
    ci_goal_en: "Keep time, place, and item to bring extracted correctly.",
    stable_signal_vi: "Ổn nếu giữ đủ thời gian, địa điểm, và vật cần mang.",
    stable_signal_en: "Stable if time, place, and item to bring are all kept.",
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
    id: "pa_a2_ci_service_flow",
    scenario: "service_flow",
    style: "mr_readiness",
    title_vi: "MR-readiness: luồng dịch vụ",
    title_en: "MR-readiness: service flow",
    ci_goal_vi: "Giữ opener, nhu cầu, và câu hỏi giấy tờ đầy đủ.",
    ci_goal_en: "Keep opener, need, and document question complete.",
    stable_signal_vi: "Ổn nếu nhu cầu và câu hỏi giấy tờ nối nhau rõ.",
    stable_signal_en: "Stable if the need and document question clearly connect.",
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
      { q_vi: "Hỏi gì?", q_en: "What is asked?", answer_pa: "ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", answer_romanization: "kihrhe kaaghaz chahide han", answer_vi: "Cần giấy tờ nào?", answer_en: "Which documents are needed?" },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦੇ ਹਨ là 'cần', không phải 'thích'.", trap_en: "chahide han means needed, not liked.", fix_pa: "ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ", fix_romanization: "kaaghaz chahide han" },
    ],
  },
  {
    id: "pa_a2_ci_polite_problem",
    scenario: "polite_problem_descriptions",
    style: "ci_readiness",
    title_vi: "CI-readiness: mô tả vấn đề lịch sự",
    title_en: "CI-readiness: polite problem descriptions",
    ci_goal_vi: "Giữ opener lịch sự, vấn đề, và câu hỏi bước tiếp theo rõ.",
    ci_goal_en: "Keep polite opener, problem, and next-step question clear.",
    stable_signal_vi: "Ổn nếu vấn đề được nêu và được yêu cầu kiểm tra rõ.",
    stable_signal_en: "Stable if the problem is stated and clearly requested for checking.",
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
      { q_vi: "Câu hỏi bước tiếp theo là gì?", q_en: "What is the next-step question?", answer_pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", answer_romanization: "mainu hun ki karna hai", answer_vi: "Bây giờ tôi cần làm gì?", answer_en: "What do I need to do now?" },
    ],
    traps: [
      { trap_vi: "ਇਸ ਨੂੰ trỏ về vấn đề vừa nêu; đừng đổi chủ đề.", trap_en: "is nu points back to the stated problem; do not change topic.", fix_pa: "ਇਸ ਨੂੰ ਚੈੱਕ", fix_romanization: "is nu check" },
    ],
  },
  {
    id: "pa_a2_ci_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: sửa chữa tương tác",
    title_en: "Pre-integration: interaction repair",
    ci_goal_vi: "Giữ báo chưa hiểu, xin nhắc lại, và xác nhận nghĩa đầy đủ.",
    ci_goal_en: "Keep non-understanding signal, repetition request, and meaning confirmation complete.",
    stable_signal_vi: "Ổn nếu có đủ ba bước repair.",
    stable_signal_en: "Stable if all three repair steps are present.",
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
