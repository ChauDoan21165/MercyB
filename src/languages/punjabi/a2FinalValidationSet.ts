// src/languages/punjabi/a2FinalValidationSet.ts
//
// Punjabi A2 final validation set for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2FinalValidationScenario =
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

export type PunjabiA2FinalValidationStyle = "final_validation" | "cross_check" | "pre_integration";

export type PunjabiA2FinalValidationLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2FinalValidationTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2FinalValidationItem = {
  id: string;
  scenario: PunjabiA2FinalValidationScenario;
  style: PunjabiA2FinalValidationStyle;
  title_vi: string;
  title_en: string;
  validation_goal_vi: string;
  validation_goal_en: string;
  coherence_check_vi: string;
  coherence_check_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  scenario_lines: PunjabiA2FinalValidationLine[];
  final_checks: {
    prompt_vi: string;
    prompt_en: string;
    expected_pa: string;
    expected_romanization: string;
    expected_vi: string;
    expected_en: string;
  }[];
  traps: PunjabiA2FinalValidationTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong final validation set này; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in this final validation set; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2FinalValidationSet: PunjabiA2FinalValidationItem[] = [
  {
    id: "pa_a2_final_validation_daily_routine",
    scenario: "daily_routine",
    style: "final_validation",
    title_vi: "Final validation: thói quen sáng nối với lịch hẹn",
    title_en: "Final validation: morning routine linked to an appointment",
    validation_goal_vi: "Xác nhận người học giữ được giờ, hoạt động sáng, và lý do phải đi đúng giờ.",
    validation_goal_en: "Confirm the learner keeps the time, morning action, and reason to leave on time.",
    coherence_check_vi: "Giờ thức dậy phải hỗ trợ giờ ra khỏi nhà, không mâu thuẫn với appointment.",
    coherence_check_en: "The wake-up time must support leaving home and not conflict with the appointment.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi đi clinic, lớp ESL, hoặc ca làm sáng bằng transit.",
    canada_practical_en: "Useful for reaching a clinic, ESL class, or morning shift by transit.",
    scenario_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere chhe vaje utthdi haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nữ)", en: "I wake up at six in the morning. (female speaker)" },
      { pa: "ਸੱਤ ਵਜੇ ਮੈਂ ਘਰ ਤੋਂ ਨਿਕਲਦੀ ਹਾਂ।", romanization: "satt vaje main ghar ton nikaldi haan.", vi: "Lúc bảy giờ tôi ra khỏi nhà. (nữ)", en: "At seven I leave home. (female speaker)" },
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਅੱਠ ਵਜੇ ਹੈ।", romanization: "meri appointment atth vaje hai.", vi: "Lịch hẹn của tôi lúc tám giờ.", en: "My appointment is at eight." },
    ],
    final_checks: [
      { prompt_vi: "Người nói thức dậy khi nào?", prompt_en: "When does the speaker wake up?", expected_pa: "ਛੇ ਵਜੇ", expected_romanization: "chhe vaje", expected_vi: "Sáu giờ.", expected_en: "Six o'clock." },
      { prompt_vi: "Appointment khi nào?", prompt_en: "When is the appointment?", expected_pa: "ਅੱਠ ਵਜੇ", expected_romanization: "atth vaje", expected_vi: "Tám giờ.", expected_en: "Eight o'clock." },
    ],
    traps: [
      { trap_vi: "Đừng đổi giờ ra khỏi nhà thành giờ appointment.", trap_en: "Do not turn the leaving-home time into the appointment time.", fix_pa: "ਸੱਤ ਵਜੇ ਨਿਕਲਦੀ ਹਾਂ, ਅੱਠ ਵਜੇ ਅਪਾਇੰਟਮੈਂਟ ਹੈ।", fix_romanization: "satt vaje nikaldi haan, atth vaje appointment hai." },
    ],
  },
  {
    id: "pa_a2_final_validation_appointments_forms",
    scenario: "appointments",
    style: "cross_check",
    title_vi: "Cross-check: appointment và giấy tờ",
    title_en: "Cross-check: appointment and documents",
    validation_goal_vi: "Xác nhận ngày giờ appointment, giấy tờ cần mang, và câu đổi lịch nếu cần.",
    validation_goal_en: "Confirm appointment date/time, document to bring, and a rescheduling sentence if needed.",
    coherence_check_vi: "Ngày giờ mới phải được nhắc cùng với health card hoặc form.",
    coherence_check_en: "The new date/time must be stated together with the health card or form.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với clinic, dentist, school office, và settlement appointment.",
    canada_practical_en: "Fits clinic, dentist, school office, and settlement appointments.",
    scenario_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਵੀਰਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment veervaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Năm lúc hai giờ.", en: "My appointment is Thursday at two." },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਅਤੇ ਫਾਰਮ ਨਾਲ ਲਿਆਵਾਂਗੀ।", romanization: "main health card ate form naal liaavangi.", vi: "Tôi sẽ mang thẻ y tế và mẫu đơn. (nữ)", en: "I will bring the health card and form. (female speaker)" },
      { pa: "ਜੇ ਲੋੜ ਹੋਵੇ, ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "je lor hove, ki main is nu shukkarvaar kar sakdi haan?", vi: "Nếu cần, tôi có thể đổi sang thứ Sáu không? (nữ)", en: "If needed, can I change it to Friday? (female speaker)" },
    ],
    final_checks: [
      { prompt_vi: "Lịch hẹn hiện tại khi nào?", prompt_en: "When is the current appointment?", expected_pa: "ਵੀਰਵਾਰ ਦੋ ਵਜੇ", expected_romanization: "veervaar do vaje", expected_vi: "Thứ Năm lúc hai giờ.", expected_en: "Thursday at two." },
      { prompt_vi: "Mang gì?", prompt_en: "What will be brought?", expected_pa: "ਹੈਲਥ ਕਾਰਡ ਅਤੇ ਫਾਰਮ", expected_romanization: "health card ate form", expected_vi: "Thẻ y tế và form.", expected_en: "Health card and form." },
    ],
    traps: [
      { trap_vi: "ਜੇ ਲੋੜ ਹੋਵੇ là điều kiện 'nếu cần'; đừng hiểu là lịch đã đổi rồi.", trap_en: "je lor hove is a condition, 'if needed'; do not read it as already rescheduled.", fix_pa: "ਜੇ ਲੋੜ ਹੋਵੇ", fix_romanization: "je lor hove" },
    ],
  },
  {
    id: "pa_a2_final_validation_transport_service",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: transport nối với quầy dịch vụ",
    title_en: "Pre-integration: transport linked to a service counter",
    validation_goal_vi: "Xác nhận tuyến xe, điểm xuống, và câu hỏi tại quầy đều hướng cùng một điểm đến.",
    validation_goal_en: "Confirm the bus route, stop, and counter question all point to the same destination.",
    coherence_check_vi: "Điểm đến phải nhất quán từ xe buýt đến quầy tiếp nhận.",
    coherence_check_en: "The destination must stay consistent from the bus to the reception counter.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho thư viện, community centre, clinic, hoặc Service Canada.",
    canada_practical_en: "Usable for libraries, community centres, clinics, or Service Canada.",
    scenario_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਮੇਨ ਸਟਰੀਟ ਤੇ ਉਤਰਨਾ ਹੈ।", romanization: "mainu Main Street te utarna hai.", vi: "Tôi phải xuống ở Main Street.", en: "I need to get off at Main Street." },
      { pa: "ਕੀ ਲਾਇਬ੍ਰੇਰੀ ਦਾ ਦਫ਼ਤਰ ਇੱਥੇ ਹੈ?", romanization: "ki library da daftar itthe hai?", vi: "Văn phòng thư viện có ở đây không?", en: "Is the library office here?" },
    ],
    final_checks: [
      { prompt_vi: "Điểm đến là gì?", prompt_en: "What is the destination?", expected_pa: "ਲਾਇਬ੍ਰੇਰੀ", expected_romanization: "library", expected_vi: "Thư viện.", expected_en: "The library." },
      { prompt_vi: "Người học xuống ở đâu?", prompt_en: "Where does the learner get off?", expected_pa: "ਮੇਨ ਸਟਰੀਟ", expected_romanization: "Main Street", expected_vi: "Main Street.", expected_en: "Main Street." },
    ],
    traps: [
      { trap_vi: "ਤੱਕ chỉ hướng tới điểm đến; te trong ਸਟਰੀਟ ਤੇ là 'ở/tại'.", trap_en: "takk points toward a destination; te in street te means 'at/on'.", fix_pa: "ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ, ਮੇਨ ਸਟਰੀਟ ਤੇ", fix_romanization: "library takk, Main Street te" },
    ],
  },
  {
    id: "pa_a2_final_validation_housing",
    scenario: "housing",
    style: "final_validation",
    title_vi: "Final validation: housing repair",
    title_en: "Final validation: housing repair",
    validation_goal_vi: "Xác nhận người học nêu sự cố, thời gian bắt đầu, và yêu cầu sửa lịch sự.",
    validation_goal_en: "Confirm the learner states the problem, start time, and polite repair request.",
    coherence_check_vi: "Câu mô tả phải giữ cùng một sự cố từ đầu đến cuối.",
    coherence_check_en: "The description must keep the same problem from start to finish.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp khi nhắn landlord, building manager, hoặc maintenance.",
    canada_practical_en: "Fits messaging a landlord, building manager, or maintenance.",
    scenario_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਅੱਜ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh ajj savere ton ho riha hai.", vi: "Việc này xảy ra từ sáng nay.", en: "This has been happening since this morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਕਿਸੇ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj kise nu bhej sakde ho?", vi: "Bạn có thể gửi ai đó đến hôm nay không?", en: "Can you send someone today?" },
    ],
    final_checks: [
      { prompt_vi: "Sự cố là gì?", prompt_en: "What is the problem?", expected_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", expected_romanization: "heater kamm nahi kar riha", expected_vi: "Máy sưởi không hoạt động.", expected_en: "The heater is not working." },
      { prompt_vi: "Bắt đầu khi nào?", prompt_en: "When did it start?", expected_pa: "ਅੱਜ ਸਵੇਰੇ ਤੋਂ", expected_romanization: "ajj savere ton", expected_vi: "Từ sáng nay.", expected_en: "Since this morning." },
    ],
    traps: [
      { trap_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ là lỗi thiết bị, không phải người không đi làm.", trap_en: "kamm nahi kar riha is a device problem here, not a person missing work.", fix_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", fix_romanization: "heater kamm nahi kar riha." },
    ],
  },
  {
    id: "pa_a2_final_validation_school",
    scenario: "school",
    style: "cross_check",
    title_vi: "Cross-check: school message",
    title_en: "Cross-check: school message",
    validation_goal_vi: "Xác nhận thông tin vắng học, lý do, và yêu cầu homework.",
    validation_goal_en: "Confirm absence information, reason, and homework request.",
    coherence_check_vi: "Lý do vắng học phải khớp với yêu cầu gửi homework.",
    coherence_check_en: "The absence reason must match the homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với teacher, school office, và parent portal message.",
    canada_practical_en: "Usable with a teacher, school office, and parent portal message.",
    scenario_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਖਾਂਸੀ ਹੈ।", romanization: "us nu khansi hai.", vi: "Em ấy bị ho.", en: "He or she has a cough." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi homework qua email không?", en: "Can you email the homework?" },
    ],
    final_checks: [
      { prompt_vi: "Vì sao trẻ vắng học?", prompt_en: "Why is the child absent?", expected_pa: "ਖਾਂਸੀ ਹੈ", expected_romanization: "khansi hai", expected_vi: "Bị ho.", expected_en: "Has a cough." },
      { prompt_vi: "Phụ huynh yêu cầu gì?", prompt_en: "What does the parent request?", expected_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", expected_romanization: "homework email", expected_vi: "Gửi homework qua email.", expected_en: "Email the homework." },
    ],
    traps: [
      { trap_vi: "ਉਸ ਨੂੰ có thể là 'em ấy'; đừng đổi thành 'tôi bị ho'.", trap_en: "us nu can mean 'the child has'; do not change it to 'I have a cough'.", fix_pa: "ਉਸ ਨੂੰ ਖਾਂਸੀ ਹੈ।", fix_romanization: "us nu khansi hai." },
    ],
  },
  {
    id: "pa_a2_final_validation_childcare",
    scenario: "childcare",
    style: "final_validation",
    title_vi: "Final validation: childcare pickup",
    title_en: "Final validation: childcare pickup",
    validation_goal_vi: "Xác nhận người đón, thời gian, và tên trên pickup list.",
    validation_goal_en: "Confirm pickup person, time, and name on the pickup list.",
    coherence_check_vi: "Người được nhắc trong câu phải khớp với danh sách đón.",
    coherence_check_en: "The person mentioned must match the pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với daycare, after-school program, và emergency contact update.",
    canada_practical_en: "Fits daycare, after-school programs, and emergency contact updates.",
    scenario_lines: [
      { pa: "ਅੱਜ ਮੈਂ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "ajj main panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਸਿਮਰਨ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain Simran bachche nu lain aavegi.", vi: "Chị/em gái tôi, Simran, sẽ đến đón trẻ.", en: "My sister, Simran, will come to pick up the child." },
      { pa: "ਉਸ ਦਾ ਨਾਮ ਲਿਸਟ ਵਿੱਚ ਹੈ।", romanization: "us da naam list vich hai.", vi: "Tên cô ấy có trong danh sách.", en: "Her name is on the list." },
    ],
    final_checks: [
      { prompt_vi: "Ai sẽ đón trẻ?", prompt_en: "Who will pick up the child?", expected_pa: "ਸਿਮਰਨ", expected_romanization: "Simran", expected_vi: "Simran.", expected_en: "Simran." },
      { prompt_vi: "Tên cô ấy ở đâu?", prompt_en: "Where is her name?", expected_pa: "ਲਿਸਟ ਵਿੱਚ", expected_romanization: "list vich", expected_vi: "Trong danh sách.", expected_en: "On the list." },
    ],
    traps: [
      { trap_vi: "ਆਵੇਗੀ là tương lai ngôi nữ; giữ nghĩa 'sẽ đến'.", trap_en: "aavegi is feminine future; keep the meaning 'will come'.", fix_pa: "ਆਵੇਗੀ", fix_romanization: "aavegi" },
    ],
  },
  {
    id: "pa_a2_final_validation_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "cross_check",
    title_vi: "Cross-check: small talk rồi vào việc",
    title_en: "Cross-check: small talk then work",
    validation_goal_vi: "Xác nhận lời chào, phản hồi ngắn, và chuyển sang nhiệm vụ.",
    validation_goal_en: "Confirm greeting, short response, and transition to a task.",
    coherence_check_vi: "Small talk phải ngắn và không làm mất câu hỏi công việc.",
    coherence_check_en: "Small talk must stay brief and not lose the work question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong break room, shift handoff, và câu nói với supervisor.",
    canada_practical_en: "Usable in a break room, shift handoff, and with a supervisor.",
    scenario_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "changa hai, dhanvaad.", vi: "Tốt, cảm ơn.", en: "Good, thank you." },
      { pa: "ਕੀ ਅਸੀਂ ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ ਕਰੀਏ?", romanization: "ki asin shift notes check kariye?", vi: "Chúng ta kiểm tra ghi chú ca làm nhé?", en: "Shall we check the shift notes?" },
    ],
    final_checks: [
      { prompt_vi: "Câu trả lời small talk là gì?", prompt_en: "What is the small-talk answer?", expected_pa: "ਚੰਗਾ ਹੈ", expected_romanization: "changa hai", expected_vi: "Tốt.", expected_en: "Good." },
      { prompt_vi: "Nhiệm vụ tiếp theo là gì?", prompt_en: "What is the next task?", expected_pa: "ਸ਼ਿਫਟ ਨੋਟਸ ਚੈੱਕ", expected_romanization: "shift notes check", expected_vi: "Kiểm tra ghi chú ca làm.", expected_en: "Check the shift notes." },
    ],
    traps: [
      { trap_vi: "ਕਰੀਏ là lời đề nghị 'chúng ta làm nhé', không phải mệnh lệnh mạnh.", trap_en: "kariye is a suggestion, 'shall we do', not a strong command.", fix_pa: "ਚੈੱਕ ਕਰੀਏ?", fix_romanization: "check kariye?" },
    ],
  },
  {
    id: "pa_a2_final_validation_forms",
    scenario: "forms",
    style: "final_validation",
    title_vi: "Final validation: forms",
    title_en: "Final validation: forms",
    validation_goal_vi: "Xác nhận tên, địa chỉ, và giấy tờ còn thiếu trên form.",
    validation_goal_en: "Confirm name, address, and missing document on a form.",
    coherence_check_vi: "Dữ liệu form phải rõ và không đổi giữa các câu.",
    coherence_check_en: "Form data must be clear and not change across lines.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho library card, clinic intake, school registration, và housing form.",
    canada_practical_en: "Usable for a library card, clinic intake, school registration, and housing form.",
    scenario_lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨਦੀਪ ਸਿੰਘ ਹੈ।", romanization: "mera naam Amandeep Singh hai.", vi: "Tên tôi là Amandeep Singh.", en: "My name is Amandeep Singh." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 Main Street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
    ],
    final_checks: [
      { prompt_vi: "Tên là gì?", prompt_en: "What is the name?", expected_pa: "ਅਮਨਦੀਪ ਸਿੰਘ", expected_romanization: "Amandeep Singh", expected_vi: "Amandeep Singh.", expected_en: "Amandeep Singh." },
      { prompt_vi: "Thiếu gì?", prompt_en: "What is missing?", expected_pa: "ਇਹ ਦਸਤਾਵੇਜ਼", expected_romanization: "eh dastavez", expected_vi: "Giấy tờ này.", expected_en: "This document." },
    ],
    traps: [
      { trap_vi: "ਮੇਰੇ ਕੋਲ ਨਹੀਂ ਹੈ nghĩa là 'tôi không có', không phải 'tôi không muốn'.", trap_en: "mere kol nahi hai means 'I do not have', not 'I do not want'.", fix_pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", fix_romanization: "mere kol eh dastavez nahi hai." },
    ],
  },
  {
    id: "pa_a2_final_validation_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: short message validation",
    title_en: "Pre-integration: short message validation",
    validation_goal_vi: "Xác nhận người học lấy đúng giờ, nơi, và vật cần mang từ tin nhắn.",
    validation_goal_en: "Confirm the learner extracts the correct time, place, and item from a message.",
    coherence_check_vi: "Câu trả lời phải giữ ba mảnh thông tin chính từ tin nhắn.",
    coherence_check_en: "The answer must keep the three key details from the message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp với library program, settlement class, và school notice.",
    canada_practical_en: "Fits a library program, settlement class, and school notice.",
    scenario_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ ਲਿਆਓ।", romanization: "kirpa karke notebook ate pen liaao.", vi: "Xin hãy mang vở và bút.", en: "Please bring a notebook and pen." },
    ],
    final_checks: [
      { prompt_vi: "Lớp học khi nào?", prompt_en: "When is the class?", expected_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", expected_romanization: "kal tinn vaje", expected_vi: "Ngày mai lúc ba giờ.", expected_en: "Tomorrow at three." },
      { prompt_vi: "Cần mang gì?", prompt_en: "What should be brought?", expected_pa: "ਨੋਟਬੁੱਕ ਅਤੇ ਪੈਨ", expected_romanization: "notebook ate pen", expected_vi: "Vở và bút.", expected_en: "Notebook and pen." },
    ],
    traps: [
      { trap_vi: "ਕੱਲ੍ਹ có thể là ngày mai trong ngữ cảnh này; giữ theo câu tiếng Anh/Vietnamese đi kèm.", trap_en: "kal means tomorrow in this context; keep it aligned with the English/Vietnamese support.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" },
    ],
  },
  {
    id: "pa_a2_final_validation_service_flow",
    scenario: "service_flow",
    style: "final_validation",
    title_vi: "Final validation: service flow",
    title_en: "Final validation: service flow",
    validation_goal_vi: "Xác nhận mở lời lịch sự, mô tả vấn đề, và hỏi bước tiếp theo.",
    validation_goal_en: "Confirm polite opening, problem description, and next-step question.",
    coherence_check_vi: "Vấn đề trong câu đầu phải là cùng vấn đề được yêu cầu kiểm tra.",
    coherence_check_en: "The problem in the first line must be the same one requested for checking.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở front desk, pharmacy, bank counter, hoặc community service desk.",
    canada_practical_en: "Usable at a front desk, pharmacy, bank counter, or community service desk.",
    scenario_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mera card kamm nahi kar riha.", vi: "Xin lỗi, thẻ của tôi không hoạt động.", en: "Sorry, my card is not working." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi is nu check kar sakde ho?", vi: "Bạn có thể kiểm tra việc này không?", en: "Can you check this?" },
      { pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", romanization: "mainu hun ki karna hai?", vi: "Bây giờ tôi cần làm gì?", en: "What do I need to do now?" },
    ],
    final_checks: [
      { prompt_vi: "Vấn đề là gì?", prompt_en: "What is the problem?", expected_pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", expected_romanization: "card kamm nahi kar riha", expected_vi: "Thẻ không hoạt động.", expected_en: "The card is not working." },
      { prompt_vi: "Câu hỏi bước tiếp theo là gì?", prompt_en: "What is the next-step question?", expected_pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ?", expected_romanization: "mainu hun ki karna hai?", expected_vi: "Bây giờ tôi cần làm gì?", expected_en: "What do I need to do now?" },
    ],
    traps: [
      { trap_vi: "ਇਸ ਨੂੰ trỏ về vấn đề vừa nêu; đừng đổi thành vấn đề khác.", trap_en: "is nu points back to the stated problem; do not switch to another issue.", fix_pa: "ਇਸ ਨੂੰ ਚੈੱਕ", fix_romanization: "is nu check" },
    ],
  },
  {
    id: "pa_a2_final_validation_interaction_repair",
    scenario: "interaction_repair",
    style: "cross_check",
    title_vi: "Cross-check: interaction repair",
    title_en: "Cross-check: interaction repair",
    validation_goal_vi: "Xác nhận người học xin nhắc lại, xin nói chậm, và xác nhận nghĩa.",
    validation_goal_en: "Confirm the learner asks for repetition, asks for slower speech, and confirms meaning.",
    coherence_check_vi: "Câu xác nhận nghĩa phải nối với thông tin vừa nghe, không chuyển chủ đề.",
    coherence_check_en: "The meaning-confirmation line must connect to what was heard and not change topic.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    scenario_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab hai ki mainu kal auna hai?", vi: "Có phải nghĩa là tôi cần đến ngày mai không?", en: "Does this mean I need to come tomorrow?" },
    ],
    final_checks: [
      { prompt_vi: "Câu xin nói chậm là gì?", prompt_en: "What is the request to speak slowly?", expected_pa: "ਹੌਲੀ ਬੋਲੋ", expected_romanization: "hauli bolo", expected_vi: "Nói chậm.", expected_en: "Speak slowly." },
      { prompt_vi: "Người học xác nhận điều gì?", prompt_en: "What does the learner confirm?", expected_pa: "ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ", expected_romanization: "kal auna hai", expected_vi: "Cần đến ngày mai.", expected_en: "Need to come tomorrow." },
    ],
    traps: [
      { trap_vi: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ là xin lặp lại lịch sự; không phải phàn nàn.", trap_en: "dubara kahi sakde ho is a polite repetition request, not a complaint.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" },
    ],
  },
];
