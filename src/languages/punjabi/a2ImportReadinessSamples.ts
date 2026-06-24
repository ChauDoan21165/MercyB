// src/languages/punjabi/a2ImportReadinessSamples.ts
//
// Punjabi A2 import-readiness samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred. This
// is not A11 integration.

export type PunjabiA2ImportReadinessScenario =
  | "daily_routine"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "forms"
  | "short_messages"
  | "service_flow"
  | "interaction_repair";

export type PunjabiA2ImportReadinessStyle =
  | "import_readiness"
  | "final_regression"
  | "pre_integration";

export type PunjabiA2ImportReadinessLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2ImportReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2ImportReadinessItem = {
  id: string;
  scenario: PunjabiA2ImportReadinessScenario;
  style: PunjabiA2ImportReadinessStyle;
  title_vi: string;
  title_en: string;
  import_goal_vi: string;
  import_goal_en: string;
  coherence_check_vi: string;
  coherence_check_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2ImportReadinessLine[];
  import_checks: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  traps: PunjabiA2ImportReadinessTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong import-readiness samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these import-readiness samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2ImportReadinessSamples: PunjabiA2ImportReadinessItem[] = [
  {
    id: "pa_a2_import_daily_routine",
    scenario: "daily_routine",
    style: "import_readiness",
    title_vi: "Import-readiness: thói quen hằng ngày",
    title_en: "Import-readiness: daily routine",
    import_goal_vi: "Giữ giờ, chuỗi hành động sáng, và một câu quá khứ ngắn trước khi import.",
    import_goal_en: "Keep the time, morning action sequence, and one short past sentence before import.",
    coherence_check_vi: "Giờ thức dậy và việc đi làm phải nối hợp lý.",
    coherence_check_en: "The wake-up time and going to work must connect logically.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích cho lịch đi lớp ESL, ca làm sáng, và hẹn ở clinic.",
    canada_practical_en: "Useful for ESL class, morning shifts, and clinic appointments.",
    lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।", romanization: "main savere chhe vaje utthda haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nam)", en: "I wake up at six in the morning. (male speaker)" },
      { pa: "ਸੱਤ ਵਜੇ ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।", romanization: "satt vaje main kamm te jaanda haan.", vi: "Lúc bảy giờ tôi đi làm. (nam)", en: "At seven I go to work. (male speaker)" },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਜਲਦੀ ਸੌਂ ਗਿਆ।", romanization: "kal main jaldi saun gaya.", vi: "Hôm qua tôi đi ngủ sớm.", en: "Yesterday I went to bed early." },
    ],
    import_checks: [
      { q_vi: "Người nói thức dậy lúc mấy giờ?", q_en: "What time does the speaker wake up?", answer_pa: "ਛੇ ਵਜੇ", answer_romanization: "chhe vaje", answer_vi: "Sáu giờ.", answer_en: "Six o'clock." },
      { q_vi: "Việc hôm qua là gì?", q_en: "What was yesterday's action?", answer_pa: "ਜਲਦੀ ਸੌਂ ਗਿਆ", answer_romanization: "jaldi saun gaya", answer_vi: "Đi ngủ sớm.", answer_en: "Went to bed early." },
    ],
    traps: [
      { trap_vi: "Đừng đổi ਛੇ ਵਜੇ thành ਸੱਤ ਵਜੇ khi trả lời giờ thức dậy.", trap_en: "Do not change chhe vaje to satt vaje when answering the wake-up time.", fix_pa: "ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ", fix_romanization: "chhe vaje utthda haan" },
    ],
  },
  {
    id: "pa_a2_import_appointments",
    scenario: "appointments",
    style: "final_regression",
    title_vi: "Final regression: appointment trước import",
    title_en: "Final regression: appointment before import",
    import_goal_vi: "Giữ ngày giờ, yêu cầu đổi lịch, và giấy tờ cần mang.",
    import_goal_en: "Keep the date/time, reschedule request, and document to bring.",
    coherence_check_vi: "Lịch cũ và câu đổi lịch phải không mâu thuẫn.",
    coherence_check_en: "The old appointment and reschedule request must not conflict.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với clinic, dentist, settlement office, và school office ở Canada.",
    canada_practical_en: "Fits Canadian clinics, dentists, settlement offices, and school offices.",
    lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "ki main is nu shukkarvaar kar sakdi haan?", vi: "Tôi có thể đổi sang thứ Sáu không? (nữ)", en: "Can I move it to Friday? (female speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗੀ।", romanization: "main health card naal liaavangi.", vi: "Tôi sẽ mang thẻ y tế. (nữ)", en: "I will bring the health card. (female speaker)" },
    ],
    import_checks: [
      { q_vi: "Lịch cũ khi nào?", q_en: "When is the old appointment?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Mang gì?", q_en: "What should be brought?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    traps: [
      { trap_vi: "Đừng hiểu câu hỏi đổi lịch là lịch đã được xác nhận.", trap_en: "Do not read the reschedule question as already confirmed.", fix_pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਕਰ ਸਕਦੀ ਹਾਂ?", fix_romanization: "ki main is nu shukkarvaar kar sakdi haan?" },
    ],
  },
  {
    id: "pa_a2_import_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: transport",
    title_en: "Pre-integration: transport",
    import_goal_vi: "Giữ câu hỏi tuyến, điểm xuống, và câu báo trễ.",
    import_goal_en: "Keep the route question, stop, and delay sentence.",
    coherence_check_vi: "Điểm đến và điểm xuống phải cùng một hành trình.",
    coherence_check_en: "The destination and stop must belong to the same trip.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, và platform là bối cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are real Canadian contexts.",
    lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass downtown jandi hai?", vi: "Xe buýt này có đi tới trung tâm không?", en: "Does this bus go downtown?" },
      { pa: "ਮੈਨੂੰ ਅਗਲੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ।", romanization: "mainu agle stop te utarna hai.", vi: "Tôi phải xuống ở trạm kế tiếp.", en: "I need to get off at the next stop." },
      { pa: "ਮੈਂ ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਾਂਗਾ।", romanization: "main panj mint der naal pahunchanga.", vi: "Tôi sẽ tới muộn năm phút. (nam)", en: "I will arrive five minutes late. (male speaker)" },
    ],
    import_checks: [
      { q_vi: "Đích đến là gì?", q_en: "What is the destination?", answer_pa: "ਡਾਊਨਟਾਊਨ", answer_romanization: "downtown", answer_vi: "Trung tâm.", answer_en: "Downtown." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਪੰਜ ਮਿੰਟ", answer_romanization: "panj mint", answer_vi: "Năm phút.", answer_en: "Five minutes." },
    ],
    traps: [
      { trap_vi: "ਦੇਰ ਨਾਲ là 'muộn', không phải 'chậm' trong tốc độ nói.", trap_en: "der naal means late, not slow speech.", fix_pa: "ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ", fix_romanization: "panj mint der naal" },
    ],
  },
  {
    id: "pa_a2_import_housing",
    scenario: "housing",
    style: "import_readiness",
    title_vi: "Import-readiness: housing repair",
    title_en: "Import-readiness: housing repair",
    import_goal_vi: "Giữ opener lịch sự, sự cố, thời điểm bắt đầu, và yêu cầu sửa.",
    import_goal_en: "Keep the polite opener, problem, start time, and repair request.",
    coherence_check_vi: "Sự cố phải giữ nguyên từ câu mô tả đến yêu cầu sửa.",
    coherence_check_en: "The problem must stay the same from description to repair request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi nhắn landlord, building manager, hoặc maintenance desk.",
    canada_practical_en: "Useful when messaging a landlord, building manager, or maintenance desk.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh kal raat ton ho riha hai.", vi: "Việc này xảy ra từ tối qua.", en: "This has been happening since last night." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਕਿਸੇ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj kise nu bhej sakde ho?", vi: "Bạn có thể gửi ai đó đến hôm nay không?", en: "Can you send someone today?" },
    ],
    import_checks: [
      { q_vi: "Sự cố là gì?", q_en: "What is the problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Bắt đầu khi nào?", q_en: "When did it start?", answer_pa: "ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ", answer_romanization: "kal raat ton", answer_vi: "Từ tối qua.", answer_en: "Since last night." },
    ],
    traps: [
      { trap_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ ở đây là thiết bị không hoạt động, không phải người không đi làm.", trap_en: "kamm nahi kar riha means a device is not working here, not a person missing work.", fix_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", fix_romanization: "heater kamm nahi kar riha" },
    ],
  },
  {
    id: "pa_a2_import_school",
    scenario: "school",
    style: "final_regression",
    title_vi: "Final regression: school message",
    title_en: "Final regression: school message",
    import_goal_vi: "Giữ câu vắng học, lý do, và yêu cầu bài.",
    import_goal_en: "Keep the absence sentence, reason, and work request.",
    coherence_check_vi: "Lý do vắng học phải khớp với yêu cầu gửi bài.",
    coherence_check_en: "The absence reason must fit the request to send work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office, teacher email, và parent portal là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School office, teacher email, and parent portals are common Canadian contexts.",
    lines: [
      { pa: "ਮੇਰੀ ਧੀ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "meri dhee ajj school nahi aa sakdi.", vi: "Con gái tôi hôm nay không thể đến trường.", en: "My daughter cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Bé bị sốt.", en: "She has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦਾ ਕੰਮ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj da kamm bhej sakde ho?", vi: "Bạn có thể gửi bài hôm nay không?", en: "Can you send today's work?" },
    ],
    import_checks: [
      { q_vi: "Vì sao trẻ vắng học?", q_en: "Why is the child absent?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Phụ huynh yêu cầu gì?", q_en: "What does the parent request?", answer_pa: "ਅੱਜ ਦਾ ਕੰਮ ਭੇਜੋ", answer_romanization: "ajj da kamm bhejo", answer_vi: "Gửi bài hôm nay.", answer_en: "Send today's work." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਨੂੰ là 'em ấy bị/có', không phải 'tôi bị'.", trap_en: "us nu means the child has/feels it, not I have it.", fix_pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ", fix_romanization: "us nu bukhar hai" },
    ],
  },
  {
    id: "pa_a2_import_childcare",
    scenario: "childcare",
    style: "pre_integration",
    title_vi: "Pre-integration: childcare pickup",
    title_en: "Pre-integration: childcare pickup",
    import_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    import_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    coherence_check_vi: "Người đón trong câu phải khớp với danh sách.",
    coherence_check_en: "The pickup person in the sentence must match the list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup lists là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are practical Canadian contexts.",
    lines: [
      { pa: "ਮੈਂ ਅੱਜ ਸਾਢੇ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj saadhe panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ rưỡi. (nữ)", en: "I cannot come at five-thirty today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    import_checks: [
      { q_vi: "Ai đón trẻ?", q_en: "Who picks up the child?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Trong danh sách không?", q_en: "Is she on the list?", answer_pa: "ਲਿਸਟ ਵਿੱਚ ਹੈ", answer_romanization: "list vich hai", answer_vi: "Có trong danh sách.", answer_en: "On the list." },
    ],
    traps: [
      { trap_vi: "ਆਵੇਗੀ là 'sẽ đến' với chủ thể nữ; đừng đổi thành hiện tại.", trap_en: "aavegi means will come with a feminine subject; do not turn it into present tense.", fix_pa: "ਆਵੇਗੀ", fix_romanization: "aavegi" },
    ],
  },
  {
    id: "pa_a2_import_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "import_readiness",
    title_vi: "Import-readiness: workplace small talk",
    title_en: "Import-readiness: workplace small talk",
    import_goal_vi: "Giữ chào hỏi, small talk ngắn, và chuyển lại công việc.",
    import_goal_en: "Keep greeting, brief small talk, and transition back to work.",
    coherence_check_vi: "Small talk không được làm mất câu chuyển sang nhiệm vụ.",
    coherence_check_en: "Small talk must not lose the transition to the task.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend và weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend and weather small talk are often safe in many Canadian workplaces.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਵੀਕੈਂਡ ਕਿਵੇਂ ਰਿਹਾ?", romanization: "sat sri akal, weekend kiven riha?", vi: "Xin chào, cuối tuần thế nào?", en: "Hello, how was your weekend?" },
      { pa: "ਚੰਗਾ ਰਿਹਾ, ਧੰਨਵਾਦ।", romanization: "changa riha, dhanvaad.", vi: "Tốt, cảm ơn.", en: "It was good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin meeting shuru kariye?", vi: "Bây giờ chúng ta bắt đầu họp nhé?", en: "Shall we start the meeting now?" },
    ],
    import_checks: [
      { q_vi: "Câu trả lời small talk là gì?", q_en: "What is the small-talk reply?", answer_pa: "ਚੰਗਾ ਰਿਹਾ", answer_romanization: "changa riha", answer_vi: "Tốt.", answer_en: "It was good." },
      { q_vi: "Sau đó làm gì?", q_en: "What happens next?", answer_pa: "ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਕਰੀਏ", answer_romanization: "meeting shuru kariye", answer_vi: "Bắt đầu họp nhé.", answer_en: "Start the meeting." },
    ],
    traps: [
      { trap_vi: "ਕਰੀਏ là lời đề nghị 'chúng ta làm nhé', không phải mệnh lệnh mạnh.", trap_en: "kariye is a suggestion, not a strong command.", fix_pa: "ਸ਼ੁਰੂ ਕਰੀਏ?", fix_romanization: "shuru kariye?" },
    ],
  },
  {
    id: "pa_a2_import_forms",
    scenario: "forms",
    style: "final_regression",
    title_vi: "Final regression: forms",
    title_en: "Final regression: forms",
    import_goal_vi: "Giữ tên, ngày sinh, địa chỉ, và giấy tờ còn thiếu.",
    import_goal_en: "Keep name, date of birth, address, and missing document.",
    coherence_check_vi: "Các field form phải giữ nguyên giữa câu nói và kiểm tra.",
    coherence_check_en: "Form fields must stay consistent between the line and check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic intake, library card, school registration, và housing forms là bối cảnh Canada thật.",
    canada_practical_en: "Clinic intake, library cards, school registration, and housing forms are real Canadian contexts.",
    lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਸਿਮਰਨ ਕੌਰ ਹੈ।", romanization: "mera naam Simran Kaur hai.", vi: "Tên tôi là Simran Kaur.", en: "My name is Simran Kaur." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 Main Street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਪਤੇ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।", romanization: "mere kol pate da saboot nahi hai.", vi: "Tôi không có giấy chứng minh địa chỉ.", en: "I do not have proof of address." },
    ],
    import_checks: [
      { q_vi: "Tên là gì?", q_en: "What is the name?", answer_pa: "ਸਿਮਰਨ ਕੌਰ", answer_romanization: "Simran Kaur", answer_vi: "Simran Kaur.", answer_en: "Simran Kaur." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਪਤੇ ਦਾ ਸਬੂਤ", answer_romanization: "pate da saboot", answer_vi: "Giấy chứng minh địa chỉ.", answer_en: "Proof of address." },
    ],
    traps: [
      { trap_vi: "ਪਤਾ trong form là địa chỉ; đừng hiểu là động từ 'biết'.", trap_en: "pata on a form means address; do not read it as the verb know.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" },
    ],
  },
  {
    id: "pa_a2_import_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: short messages",
    title_en: "Pre-integration: short messages",
    import_goal_vi: "Tách đúng ngày, giờ, nơi, và vật cần mang từ tin nhắn ngắn.",
    import_goal_en: "Extract the correct day, time, place, and item from a short message.",
    coherence_check_vi: "Câu trả lời phải giữ đủ thông tin chính trước khi import.",
    coherence_check_en: "The answer must keep the key details before import.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Work notices, school notices, library programs, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Work notices, school notices, library programs, and training notes are common Canadian contexts.",
    lines: [
      { pa: "ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ ਦਫ਼ਤਰ ਵਿੱਚ ਹੈ।", romanization: "meeting kal chaar vaje daftar vich hai.", vi: "Cuộc họp ngày mai lúc bốn giờ ở văn phòng.", en: "The meeting is tomorrow at four in the office." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਆਈਡੀ ਲਿਆਓ।", romanization: "kirpa karke aapna ID liaao.", vi: "Xin hãy mang ID của bạn.", en: "Please bring your ID." },
    ],
    import_checks: [
      { q_vi: "Meeting khi nào?", q_en: "When is the meeting?", answer_pa: "ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ", answer_romanization: "kal chaar vaje", answer_vi: "Ngày mai lúc bốn giờ.", answer_en: "Tomorrow at four." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਆਈਡੀ", answer_romanization: "ID", answer_vi: "ID.", answer_en: "ID." },
    ],
    traps: [
      { trap_vi: "ਆਪਣਾ giữ nghĩa 'của mình/của bạn' trong câu yêu cầu.", trap_en: "aapna keeps the meaning one's own/your own in the request.", fix_pa: "ਆਪਣਾ ਆਈਡੀ", fix_romanization: "aapna ID" },
    ],
  },
  {
    id: "pa_a2_import_service_flow",
    scenario: "service_flow",
    style: "import_readiness",
    title_vi: "Import-readiness: service flow",
    title_en: "Import-readiness: service flow",
    import_goal_vi: "Giữ câu mở, nhu cầu, và câu hỏi giấy tờ.",
    import_goal_en: "Keep the opener, need, and document question.",
    coherence_check_vi: "Nhu cầu đổi địa chỉ phải nối với câu hỏi giấy tờ.",
    coherence_check_en: "The change-address need must connect to the document question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Service Canada, ServiceOntario, bank, và library desk là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Service Canada, ServiceOntario, banks, and library desks are practical Canadian contexts.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "sat sri akal, mainu madad chahidi hai.", vi: "Xin chào, tôi cần giúp đỡ.", en: "Hello, I need help." },
      { pa: "ਮੈਂ ਆਪਣਾ ਪਤਾ ਬਦਲਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main aapna pata badalna chahunda haan.", vi: "Tôi muốn đổi địa chỉ. (nam)", en: "I want to change my address. (male speaker)" },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "mainu kihrhe kaaghaz chahide han?", vi: "Tôi cần giấy tờ nào?", en: "Which documents do I need?" },
    ],
    import_checks: [
      { q_vi: "Nhu cầu là gì?", q_en: "What is the need?", answer_pa: "ਪਤਾ ਬਦਲਣਾ", answer_romanization: "pata badalna", answer_vi: "Đổi địa chỉ.", answer_en: "Change address." },
      { q_vi: "Hỏi gì?", q_en: "What is asked?", answer_pa: "ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", answer_romanization: "kihrhe kaaghaz chahide han?", answer_vi: "Cần giấy tờ nào?", answer_en: "Which documents are needed?" },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦੇ ਹਨ là 'cần', không phải 'thích'.", trap_en: "chahide han means needed, not liked.", fix_pa: "ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ", fix_romanization: "kaaghaz chahide han" },
    ],
  },
  {
    id: "pa_a2_import_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: interaction repair",
    title_en: "Pre-integration: interaction repair",
    import_goal_vi: "Giữ báo chưa hiểu, xin nhắc lại chậm, và xác nhận ý hiểu.",
    import_goal_en: "Keep signalling non-understanding, asking for slower repetition, and confirming meaning.",
    coherence_check_vi: "Câu xác nhận phải nối với thông tin vừa nghe.",
    coherence_check_en: "The confirmation must connect to the information just heard.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ।", romanization: "maaf karna, main samjhia nahi.", vi: "Xin lỗi, tôi chưa hiểu.", en: "Sorry, I did not understand." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi hauli ate dubara kahi sakde ho?", vi: "Bạn có thể nói chậm và nhắc lại không?", en: "Can you say it slowly and again?" },
      { pa: "ਤਾਂ ਮੈਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਆਉਣਾ ਹੈ, ਠੀਕ ਹੈ?", romanization: "taan mainu shukkarvaar auna hai, theek hai?", vi: "Vậy tôi phải đến thứ Sáu, đúng không?", en: "So I need to come on Friday, right?" },
    ],
    import_checks: [
      { q_vi: "Câu báo chưa hiểu là gì?", q_en: "What is the non-understanding signal?", answer_pa: "ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ", answer_romanization: "main samjhia nahi", answer_vi: "Tôi chưa hiểu.", answer_en: "I did not understand." },
      { q_vi: "Người học xác nhận ngày nào?", q_en: "Which day does the learner confirm?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ", answer_romanization: "shukkarvaar", answer_vi: "Thứ Sáu.", answer_en: "Friday." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói 'what?' trong bối cảnh lịch sự.", trap_en: "Do not only say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi hauli ate dubara kahi sakde ho?" },
    ],
  },
];
