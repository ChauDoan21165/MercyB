// src/languages/punjabi/a2CrossCheckSamples.ts
//
// Punjabi A2 cross-check samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2CrossCheckScenario =
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

export type PunjabiA2CrossCheckStyle = "cross_check" | "verification" | "pre_integration";

export type PunjabiA2CrossCheckLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2CrossCheckTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2CrossCheckItem = {
  id: string;
  scenario: PunjabiA2CrossCheckScenario;
  style: PunjabiA2CrossCheckStyle;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  cross_check_vi: string;
  cross_check_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2CrossCheckLine[];
  verify: {
    prompt_vi: string;
    prompt_en: string;
    expected_pa: string;
    expected_romanization: string;
    expected_vi: string;
    expected_en: string;
  }[];
  traps: PunjabiA2CrossCheckTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong các mẫu cross-check này; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these cross-check samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2CrossCheckSamples: PunjabiA2CrossCheckItem[] = [
  {
    id: "pa_a2_cross_daily_routine_to_transport",
    scenario: "daily_routine",
    style: "cross_check",
    title_vi: "Cross-check: thói quen sáng và đi xe buýt",
    title_en: "Cross-check: morning routine and bus travel",
    learner_goal_vi: "Nói giờ thức dậy, việc làm buổi sáng, và nối sang kế hoạch đi lại.",
    learner_goal_en: "Say the wake-up time, morning action, and connect it to a travel plan.",
    cross_check_vi: "Kiểm tra xem giờ trong thói quen có khớp với giờ ra trạm xe buýt không.",
    cross_check_en: "Check whether the routine time matches the time to leave for the bus stop.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi đi lớp ESL, đi làm ca sáng, hoặc đến appointment bằng transit.",
    canada_practical_en: "Useful for ESL class, a morning shift, or reaching an appointment by transit.",
    lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।", romanization: "main savere chhe vaje utthda haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nam)", en: "I wake up at six in the morning. (male speaker)" },
      { pa: "ਸੱਤ ਵਜੇ ਮੈਂ ਬੱਸ ਸਟਾਪ ਤੇ ਜਾਂਦਾ ਹਾਂ।", romanization: "satt vaje main bass stop te janda haan.", vi: "Lúc bảy giờ tôi đi đến trạm xe buýt. (nam)", en: "At seven I go to the bus stop. (male speaker)" },
    ],
    verify: [
      { prompt_vi: "Người nói thức dậy lúc mấy giờ?", prompt_en: "What time does the speaker wake up?", expected_pa: "ਛੇ ਵਜੇ", expected_romanization: "chhe vaje", expected_vi: "Sáu giờ.", expected_en: "Six o'clock." },
      { prompt_vi: "Người nói đi đâu lúc bảy giờ?", prompt_en: "Where does the speaker go at seven?", expected_pa: "ਬੱਸ ਸਟਾਪ", expected_romanization: "bass stop", expected_vi: "Trạm xe buýt.", expected_en: "The bus stop." },
    ],
    traps: [
      { trap_vi: "Đừng lẫn ਛੇ vaje với ਸੱਤ vaje khi trả lời.", trap_en: "Do not mix up chhe vaje and satt vaje in the answer.", fix_pa: "ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ, ਸੱਤ ਵਜੇ ਜਾਂਦਾ ਹਾਂ।", fix_romanization: "chhe vaje utthda haan, satt vaje janda haan." },
    ],
  },
  {
    id: "pa_a2_cross_appointments_forms",
    scenario: "appointments",
    style: "verification",
    title_vi: "Verification: lịch hẹn và mẫu đơn",
    title_en: "Verification: appointment and form",
    learner_goal_vi: "Giữ ngày giờ appointment và giấy tờ cần điền.",
    learner_goal_en: "Keep the appointment date/time and the document to complete.",
    cross_check_vi: "Thông tin giờ hẹn phải khớp với câu nhắc mang form.",
    cross_check_en: "The appointment time must match the reminder to bring the form.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với clinic, dentist, settlement office, và school office ở Canada.",
    canada_practical_en: "Fits Canadian clinics, dentists, settlement offices, and school offices.",
    lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ ਹੈ।", romanization: "meri appointment mangalvaar das vaje hai.", vi: "Lịch hẹn của tôi là thứ Ba lúc mười giờ.", en: "My appointment is Tuesday at ten." },
      { pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਘਰ ਤੋਂ ਭਰ ਕੇ ਲਿਆਉਣਾ ਹੈ।", romanization: "mainu eh form ghar ton bhar ke liauna hai.", vi: "Tôi cần điền mẫu này ở nhà rồi mang theo.", en: "I need to fill this form at home and bring it." },
    ],
    verify: [
      { prompt_vi: "Appointment khi nào?", prompt_en: "When is the appointment?", expected_pa: "ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ", expected_romanization: "mangalvaar das vaje", expected_vi: "Thứ Ba lúc mười giờ.", expected_en: "Tuesday at ten." },
      { prompt_vi: "Cần làm gì với form?", prompt_en: "What should be done with the form?", expected_pa: "ਭਰ ਕੇ ਲਿਆਉਣਾ ਹੈ", expected_romanization: "bhar ke liauna hai", expected_vi: "Điền rồi mang theo.", expected_en: "Fill it and bring it." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói 'có appointment' mà bỏ ngày giờ.", trap_en: "Do not only say there is an appointment and omit the date/time.", fix_pa: "ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ", fix_romanization: "mangalvaar das vaje" },
    ],
  },
  {
    id: "pa_a2_cross_transport_service_flow",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: transit và hỏi quầy dịch vụ",
    title_en: "Pre-integration: transit and service desk question",
    learner_goal_vi: "Hỏi tuyến xe, điểm xuống, rồi xác nhận ở quầy dịch vụ.",
    learner_goal_en: "Ask the route, stop, and then confirm at a service desk.",
    cross_check_vi: "Điểm đến trong câu hỏi xe buýt phải khớp với câu xác nhận ở quầy.",
    cross_check_en: "The destination in the bus question must match the service-desk confirmation.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho thư viện, clinic, community centre, hoặc Service Canada.",
    canada_practical_en: "Usable for libraries, clinics, community centres, or Service Canada.",
    lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass community centre takk jandi hai?", vi: "Xe buýt này có đi tới trung tâm cộng đồng không?", en: "Does this bus go to the community centre?" },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kihre stop te utarna hai?", vi: "Tôi phải xuống ở trạm nào?", en: "Which stop should I get off at?" },
      { pa: "ਕੀ ਇਹ ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ ਦਾ ਦਫ਼ਤਰ ਹੈ?", romanization: "ki eh community centre da daftar hai?", vi: "Đây có phải văn phòng của trung tâm cộng đồng không?", en: "Is this the community centre office?" },
    ],
    verify: [
      { prompt_vi: "Điểm đến là gì?", prompt_en: "What is the destination?", expected_pa: "ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ", expected_romanization: "community centre", expected_vi: "Trung tâm cộng đồng.", expected_en: "The community centre." },
      { prompt_vi: "Người học cần biết điều gì trên xe buýt?", prompt_en: "What does the learner need to know on the bus?", expected_pa: "ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ", expected_romanization: "kihre stop te utarna hai", expected_vi: "Xuống ở trạm nào.", expected_en: "Which stop to get off at." },
    ],
    traps: [
      { trap_vi: "ਤੱਕ là 'tới/đến', không phải 'ở trong'.", trap_en: "takk means 'up to/to', not 'inside'.", fix_pa: "ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ ਤੱਕ", fix_romanization: "community centre takk" },
    ],
  },
  {
    id: "pa_a2_cross_housing_repair",
    scenario: "housing",
    style: "verification",
    title_vi: "Verification: nhà ở và mô tả sự cố",
    title_en: "Verification: housing and problem description",
    learner_goal_vi: "Mô tả lỗi trong nhà, thời điểm bắt đầu, và yêu cầu kiểm tra lịch sự.",
    learner_goal_en: "Describe a home problem, when it started, and make a polite check request.",
    cross_check_vi: "Sự cố, thời gian, và yêu cầu sửa phải không mâu thuẫn.",
    cross_check_en: "The problem, time, and repair request must not conflict.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nhắn landlord, building manager, hoặc maintenance desk.",
    canada_practical_en: "Useful when messaging a landlord, building manager, or maintenance desk.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ।", romanization: "maaf karna, sink leak kar riha hai.", vi: "Xin lỗi, bồn rửa đang bị rò rỉ.", en: "Sorry, the sink is leaking." },
      { pa: "ਇਹ ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh kal raat ton ho riha hai.", vi: "Việc này xảy ra từ tối qua.", en: "This has been happening since last night." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਕਿਸੇ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj kise nu bhej sakde ho?", vi: "Bạn có thể gửi ai đó đến hôm nay không?", en: "Can you send someone today?" },
    ],
    verify: [
      { prompt_vi: "Sự cố là gì?", prompt_en: "What is the problem?", expected_pa: "ਸਿੰਕ ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", expected_romanization: "sink leak kar riha hai", expected_vi: "Bồn rửa bị rò.", expected_en: "The sink is leaking." },
      { prompt_vi: "Bắt đầu khi nào?", prompt_en: "When did it start?", expected_pa: "ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ", expected_romanization: "kal raat ton", expected_vi: "Từ tối qua.", expected_en: "Since last night." },
    ],
    traps: [
      { trap_vi: "ਕਰ ਰਿਹਾ ਹੈ dùng cho tình trạng đang xảy ra; đừng đổi sang quá khứ hoàn tất.", trap_en: "kar riha hai marks an ongoing state; do not switch to a completed past.", fix_pa: "ਲੀਕ ਕਰ ਰਿਹਾ ਹੈ", fix_romanization: "leak kar riha hai" },
    ],
  },
  {
    id: "pa_a2_cross_school_childcare",
    scenario: "school",
    style: "cross_check",
    title_vi: "Cross-check: trường học và đón trẻ",
    title_en: "Cross-check: school and childcare pickup",
    learner_goal_vi: "Báo trẻ vắng học hoặc được người khác đón, kèm lý do ngắn.",
    learner_goal_en: "Report absence or alternate pickup with a short reason.",
    cross_check_vi: "Tên người đón và lý do phải rõ để tránh nhầm ở school/childcare.",
    cross_check_en: "The pickup person and reason must be clear to avoid school/childcare confusion.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với school office, daycare, và after-school program.",
    canada_practical_en: "Fits a school office, daycare, and after-school program.",
    lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He or she has a fever." },
      { pa: "ਕੱਲ੍ਹ ਮੇਰਾ ਭਰਾ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗਾ।", romanization: "kal mera bhra bachche nu lain aavega.", vi: "Ngày mai anh/em trai tôi sẽ đến đón trẻ.", en: "Tomorrow my brother will come to pick up the child." },
    ],
    verify: [
      { prompt_vi: "Vì sao trẻ không đi học?", prompt_en: "Why is the child not going to school?", expected_pa: "ਬੁਖਾਰ ਹੈ", expected_romanization: "bukhar hai", expected_vi: "Bị sốt.", expected_en: "Has a fever." },
      { prompt_vi: "Ai sẽ đón trẻ ngày mai?", prompt_en: "Who will pick up the child tomorrow?", expected_pa: "ਮੇਰਾ ਭਰਾ", expected_romanization: "mera bhra", expected_vi: "Anh/em trai của tôi.", expected_en: "My brother." },
    ],
    traps: [
      { trap_vi: "Đừng bỏ ਕੱਲ੍ਹ nếu pickup là ngày mai, không phải hôm nay.", trap_en: "Do not omit kal if pickup is tomorrow, not today.", fix_pa: "ਕੱਲ੍ਹ ਮੇਰਾ ਭਰਾ ਆਵੇਗਾ।", fix_romanization: "kal mera bhra aavega." },
    ],
  },
  {
    id: "pa_a2_cross_childcare_forms",
    scenario: "childcare",
    style: "verification",
    title_vi: "Verification: childcare và form người đón",
    title_en: "Verification: childcare and pickup form",
    learner_goal_vi: "Nói người được phép đón và xác nhận tên trên form.",
    learner_goal_en: "Name the authorized pickup person and confirm the name on the form.",
    cross_check_vi: "Tên trong lời nói phải khớp với tên trên danh sách đón.",
    cross_check_en: "The spoken name must match the pickup-list name.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng trong daycare khi cập nhật emergency contact hoặc pickup list.",
    canada_practical_en: "Used in daycare when updating an emergency contact or pickup list.",
    lines: [
      { pa: "ਮੇਰੀ ਭੈਣ ਸਿਮਰਨ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain Simran bachche nu lain aavegi.", vi: "Chị/em gái tôi, Simran, sẽ đến đón trẻ.", en: "My sister, Simran, will come to pick up the child." },
      { pa: "ਕੀ ਉਸ ਦਾ ਨਾਮ ਲਿਸਟ ਵਿੱਚ ਹੈ?", romanization: "ki us da naam list vich hai?", vi: "Tên cô ấy có trong danh sách không?", en: "Is her name on the list?" },
    ],
    verify: [
      { prompt_vi: "Ai sẽ đón trẻ?", prompt_en: "Who will pick up the child?", expected_pa: "ਸਿਮਰਨ", expected_romanization: "Simran", expected_vi: "Simran.", expected_en: "Simran." },
      { prompt_vi: "Cần kiểm tra gì?", prompt_en: "What needs to be checked?", expected_pa: "ਲਿਸਟ ਵਿੱਚ", expected_romanization: "list vich", expected_vi: "Có trong danh sách.", expected_en: "On the list." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਦਾ ਨਾਮ là 'tên của cô ấy/người đó'; đừng dịch thành 'tên của tôi'.", trap_en: "us da naam means 'her/that person's name'; do not translate it as 'my name'.", fix_pa: "ਉਸ ਦਾ ਨਾਮ", fix_romanization: "us da naam" },
    ],
  },
  {
    id: "pa_a2_cross_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "cross_check",
    title_vi: "Cross-check: small talk nơi làm việc",
    title_en: "Cross-check: workplace small talk",
    learner_goal_vi: "Chào hỏi ngắn, trả lời lịch sự, rồi chuyển sang công việc.",
    learner_goal_en: "Greet briefly, answer politely, then move to work.",
    cross_check_vi: "Câu small talk không nên biến thành thông tin quá riêng tư hoặc quá dài.",
    cross_check_en: "Small talk should not become too private or too long.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với shift handoff, break room, và câu mở đầu với supervisor.",
    canada_practical_en: "Fits shift handoff, a break room, and a quick opener with a supervisor.",
    lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "sat sri akal, ajj kamm kiven chall riha hai?", vi: "Xin chào, hôm nay công việc thế nào?", en: "Hello, how is work going today?" },
      { pa: "ਠੀਕ ਚੱਲ ਰਿਹਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "theek chall riha hai, dhanvaad.", vi: "Ổn, cảm ơn.", en: "It is going fine, thank you." },
      { pa: "ਕੀ ਅਸੀਂ ਆਰਡਰ ਚੈੱਕ ਕਰੀਏ?", romanization: "ki asin order check kariye?", vi: "Chúng ta kiểm tra đơn hàng nhé?", en: "Shall we check the order?" },
    ],
    verify: [
      { prompt_vi: "Câu trả lời small talk là gì?", prompt_en: "What is the small-talk answer?", expected_pa: "ਠੀਕ ਚੱਲ ਰਿਹਾ ਹੈ", expected_romanization: "theek chall riha hai", expected_vi: "Đang ổn.", expected_en: "It is going fine." },
      { prompt_vi: "Sau đó họ làm gì?", prompt_en: "What do they do next?", expected_pa: "ਆਰਡਰ ਚੈੱਕ", expected_romanization: "order check", expected_vi: "Kiểm tra đơn hàng.", expected_en: "Check the order." },
    ],
    traps: [
      { trap_vi: "ਚੱਲ ਰਿਹਾ ਹੈ ở đây là 'đang diễn ra', không phải chỉ 'đang đi bộ'.", trap_en: "chall riha hai here means 'is going/progressing', not only 'is walking'.", fix_pa: "ਕੰਮ ਠੀਕ ਚੱਲ ਰਿਹਾ ਹੈ।", fix_romanization: "kamm theek chall riha hai." },
    ],
  },
  {
    id: "pa_a2_cross_forms_address",
    scenario: "forms",
    style: "verification",
    title_vi: "Verification: form và địa chỉ",
    title_en: "Verification: form and address",
    learner_goal_vi: "Đọc hoặc nói tên, số điện thoại, và địa chỉ ngắn.",
    learner_goal_en: "Read or say a name, phone number, and short address.",
    cross_check_vi: "Tên và địa chỉ phải được giữ nguyên giữa câu nói và form.",
    cross_check_en: "The name and address must stay consistent between speech and the form.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích cho library card, clinic intake, và school registration.",
    canada_practical_en: "Useful for a library card, clinic intake, and school registration.",
    lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਹਰਪ੍ਰੀਤ ਕੌਰ ਹੈ।", romanization: "mera naam Harpreet Kaur hai.", vi: "Tên tôi là Harpreet Kaur.", en: "My name is Harpreet Kaur." },
      { pa: "ਮੇਰਾ ਪਤਾ 45 ਕਿੰਗ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 45 King Street hai.", vi: "Địa chỉ của tôi là 45 King Street.", en: "My address is 45 King Street." },
      { pa: "ਮੇਰਾ ਫ਼ੋਨ ਨੰਬਰ ਇਸ ਫਾਰਮ ਤੇ ਹੈ।", romanization: "mera phone number is form te hai.", vi: "Số điện thoại của tôi ở trên mẫu này.", en: "My phone number is on this form." },
    ],
    verify: [
      { prompt_vi: "Tên trên form là gì?", prompt_en: "What is the name on the form?", expected_pa: "ਹਰਪ੍ਰੀਤ ਕੌਰ", expected_romanization: "Harpreet Kaur", expected_vi: "Harpreet Kaur.", expected_en: "Harpreet Kaur." },
      { prompt_vi: "Địa chỉ là gì?", prompt_en: "What is the address?", expected_pa: "45 ਕਿੰਗ ਸਟਰੀਟ", expected_romanization: "45 King Street", expected_vi: "45 King Street.", expected_en: "45 King Street." },
    ],
    traps: [
      { trap_vi: "ਮੇਰਾ ਪਤਾ là 'địa chỉ của tôi'; đừng nhầm với 'tên của tôi'.", trap_en: "mera pata means 'my address'; do not confuse it with 'my name'.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" },
    ],
  },
  {
    id: "pa_a2_cross_short_messages_schedule",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn và lịch",
    title_en: "Pre-integration: short message and schedule",
    learner_goal_vi: "Hiểu tin nhắn về giờ, nơi, và vật cần mang.",
    learner_goal_en: "Understand a message about time, place, and what to bring.",
    cross_check_vi: "Giờ, địa điểm, và vật cần mang phải được nhắc lại đúng.",
    cross_check_en: "The time, place, and item to bring must be repeated correctly.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với lớp settlement, library program, và parent-teacher meeting.",
    canada_practical_en: "Fits a settlement class, library program, and parent-teacher meeting.",
    lines: [
      { pa: "ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "meeting kal chaar vaje library vich hai.", vi: "Cuộc họp ngày mai lúc bốn giờ ở thư viện.", en: "The meeting is tomorrow at four in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਡ ਲਿਆਓ।", romanization: "kirpa karke apna card liaao.", vi: "Xin hãy mang thẻ của bạn.", en: "Please bring your card." },
    ],
    verify: [
      { prompt_vi: "Meeting khi nào?", prompt_en: "When is the meeting?", expected_pa: "ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ", expected_romanization: "kal chaar vaje", expected_vi: "Ngày mai lúc bốn giờ.", expected_en: "Tomorrow at four." },
      { prompt_vi: "Cần mang gì?", prompt_en: "What should be brought?", expected_pa: "ਆਪਣਾ ਕਾਰਡ", expected_romanization: "apna card", expected_vi: "Thẻ của mình.", expected_en: "Your own card." },
    ],
    traps: [
      { trap_vi: "ਆਪਣਾ chỉ vật của chính người nghe/người nói trong ngữ cảnh; giữ nghĩa 'của mình'.", trap_en: "apna marks one's own item in context; keep the 'own' meaning.", fix_pa: "ਆਪਣਾ ਕਾਰਡ", fix_romanization: "apna card" },
    ],
  },
  {
    id: "pa_a2_cross_service_flow_problem",
    scenario: "service_flow",
    style: "cross_check",
    title_vi: "Cross-check: luồng dịch vụ và mô tả vấn đề",
    title_en: "Cross-check: service flow and problem description",
    learner_goal_vi: "Mở lời lịch sự, nêu vấn đề, và hỏi bước tiếp theo.",
    learner_goal_en: "Open politely, state the problem, and ask for the next step.",
    cross_check_vi: "Người học phải giữ đúng vấn đề trước khi hỏi bước tiếp theo.",
    cross_check_en: "The learner must keep the problem accurate before asking the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở front desk, pharmacy, community centre, hoặc service counter.",
    canada_practical_en: "Usable at a front desk, pharmacy, community centre, or service counter.",
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mera card kamm nahi kar riha.", vi: "Xin lỗi, thẻ của tôi không hoạt động.", en: "Sorry, my card is not working." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi is nu check kar sakde ho?", vi: "Bạn có thể kiểm tra việc này không?", en: "Can you check this?" },
      { pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", romanization: "mainu hun ki karna hai?", vi: "Bây giờ tôi cần làm gì?", en: "What do I need to do now?" },
    ],
    verify: [
      { prompt_vi: "Vấn đề là gì?", prompt_en: "What is the problem?", expected_pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", expected_romanization: "card kamm nahi kar riha", expected_vi: "Thẻ không hoạt động.", expected_en: "The card is not working." },
      { prompt_vi: "Câu hỏi bước tiếp theo là gì?", prompt_en: "What is the next-step question?", expected_pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", expected_romanization: "mainu hun ki karna hai?", expected_vi: "Bây giờ tôi cần làm gì?", expected_en: "What do I need to do now?" },
    ],
    traps: [
      { trap_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ là 'không hoạt động'; không phải 'không đi làm'.", trap_en: "kamm nahi kar riha means 'is not working/functioning'; not 'is not going to work'.", fix_pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", fix_romanization: "card kamm nahi kar riha" },
    ],
  },
  {
    id: "pa_a2_cross_interaction_repair",
    scenario: "interaction_repair",
    style: "verification",
    title_vi: "Verification: sửa chữa tương tác",
    title_en: "Verification: interaction repair",
    learner_goal_vi: "Xin nhắc lại, xin nói chậm, và xác nhận nghĩa.",
    learner_goal_en: "Ask for repetition, ask for slower speech, and confirm meaning.",
    cross_check_vi: "Câu xác nhận phải nối với thông tin vừa nghe, không đổi chủ đề.",
    cross_check_en: "The confirmation must connect to the information just heard, not change topic.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab hai ki mainu kal auna hai?", vi: "Có phải nghĩa là tôi cần đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    verify: [
      { prompt_vi: "Câu xin nhắc lại là gì?", prompt_en: "What is the repetition request?", expected_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ", expected_romanization: "dubara kahi sakde ho", expected_vi: "Có thể nói lại không.", expected_en: "Can say it again." },
      { prompt_vi: "Người học xác nhận điều gì?", prompt_en: "What does the learner confirm?", expected_pa: "ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ", expected_romanization: "kal auna hai", expected_vi: "Cần đến ngày mai.", expected_en: "Need to come tomorrow." },
    ],
    traps: [
      { trap_vi: "ਹੌਲੀ ਬੋਲੋ là yêu cầu nói chậm, không phải nói nhỏ hơn.", trap_en: "hauli bolo asks someone to speak slowly, not necessarily more quietly.", fix_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", fix_romanization: "kirpa karke hauli bolo." },
    ],
  },
];
