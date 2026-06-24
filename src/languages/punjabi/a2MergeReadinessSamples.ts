// src/languages/punjabi/a2MergeReadinessSamples.ts
//
// Punjabi A2 merge-readiness samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not a
// phonetic standard. Shahmukhi is mentioned only for awareness; this is not a
// Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2MergeReadinessScenario =
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

export type PunjabiA2MergeReadinessStyle =
  | "merge_readiness"
  | "final_regression"
  | "pre_integration";

export type PunjabiA2MergeReadinessLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2MergeReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2MergeReadinessItem = {
  id: string;
  scenario: PunjabiA2MergeReadinessScenario;
  style: PunjabiA2MergeReadinessStyle;
  title_vi: string;
  title_en: string;
  sample_goal_vi: string;
  sample_goal_en: string;
  review_goal_vi: string;
  review_goal_en: string;
  merge_goal_vi: string;
  merge_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  sample_lines: PunjabiA2MergeReadinessLine[];
  evidence_lines: PunjabiA2MergeReadinessLine[];
  merge_qa: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  explanation_vi: string;
  explanation_en: string;
  traps: PunjabiA2MergeReadinessTrap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  merge_check_vi: string;
  merge_check_en: string;
  readiness_check_vi: string;
  readiness_check_en: string;
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong merge-readiness samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these merge-readiness samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const dailyRoutineLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।", romanization: "main savere chhe vaje utthda haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nam)", en: "I wake up at six in the morning. (male speaker)" },
  { pa: "ਫਿਰ ਮੈਂ ਚਾਹ ਪੀਂਦਾ ਹਾਂ ਤੇ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।", romanization: "phir main chah peenda haan te kamm te jaanda haan.", vi: "Rồi tôi uống trà và đi làm. (nam)", en: "Then I drink tea and go to work. (male speaker)" },
  { pa: "ਕੱਲ੍ਹ ਮੈਂ ਜਲਦੀ ਸੌਂ ਗਿਆ।", romanization: "kal main jaldi saun gaya.", vi: "Hôm qua tôi đi ngủ sớm.", en: "Yesterday I went to bed early." },
];

const appointmentsLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਦਸ ਵਜੇ ਹੈ।", romanization: "meri appointment somvaar das vaje hai.", vi: "Lịch hẹn của tôi là thứ Hai lúc mười giờ.", en: "My appointment is Monday at ten." },
  { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਮੰਗਲਵਾਰ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu mangalvaar kar sakda haan?", vi: "Tôi có thể đổi sang thứ Ba không? (nam)", en: "Can I move it to Tuesday? (male speaker)" },
  { pa: "ਮੈਂ ਆਪਣਾ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main aapna health card naal liaavanga.", vi: "Tôi sẽ mang theo thẻ y tế. (nam)", en: "I will bring my health card. (male speaker)" },
];

const transportLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass downtown jandi hai?", vi: "Xe buýt này có đi tới trung tâm không?", en: "Does this bus go downtown?" },
  { pa: "ਮੈਨੂੰ ਅਗਲੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ।", romanization: "mainu agle stop te utarna hai.", vi: "Tôi phải xuống ở trạm kế tiếp.", en: "I need to get off at the next stop." },
  { pa: "ਮੈਂ ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਾਂਗਾ।", romanization: "main panj mint der naal pahunchanga.", vi: "Tôi sẽ tới muộn năm phút. (nam)", en: "I will arrive five minutes late. (male speaker)" },
];

const housingLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮਾਫ਼ ਕਰਨਾ, ਰਸੋਈ ਦੀ ਨਲ਼ ਚੋ ਰਹੀ ਹੈ।", romanization: "maaf karna, rasoi di nal cho rahi hai.", vi: "Xin lỗi, vòi bếp đang bị rò nước.", en: "Sorry, the kitchen tap is leaking." },
  { pa: "ਇਹ ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh kal raat ton ho riha hai.", vi: "Việc này xảy ra từ tối qua.", en: "This has been happening since last night." },
  { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਠੀਕ ਕਰਵਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj theek karva sakde ho?", vi: "Bạn có thể cho sửa hôm nay không?", en: "Can you get it fixed today?" },
];

const schoolLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੇਰੀ ਧੀ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "meri dhee ajj school nahi aa sakdi.", vi: "Con gái tôi hôm nay không thể đến trường.", en: "My daughter cannot come to school today." },
  { pa: "ਉਸ ਨੂੰ ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ ਹੈ।", romanization: "us nu khangh ate zukaam hai.", vi: "Bé bị ho và cảm.", en: "She has a cough and a cold." },
  { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦਾ ਕੰਮ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj da kamm bhej sakde ho?", vi: "Bạn có thể gửi bài hôm nay không?", en: "Can you send today's work?" },
];

const childcareLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੈਂ ਅੱਜ ਸਾਢੇ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "main ajj saadhe panj vaje nahi aa sakda.", vi: "Hôm nay tôi không thể đến lúc năm giờ rưỡi. (nam)", en: "I cannot come at five-thirty today. (male speaker)" },
  { pa: "ਮੇਰਾ ਭਰਾ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗਾ।", romanization: "mera bhra bachche nu lain aavega.", vi: "Anh/em trai tôi sẽ đến đón trẻ.", en: "My brother will come to pick up the child." },
  { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Anh ấy có trong danh sách đón.", en: "He is on the pickup list." },
];

const workplaceLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਵੀਕੈਂਡ ਕਿਵੇਂ ਰਿਹਾ?", romanization: "sat sri akal, weekend kiven riha?", vi: "Xin chào, cuối tuần thế nào?", en: "Hello, how was your weekend?" },
  { pa: "ਚੰਗਾ ਰਿਹਾ, ਧੰਨਵਾਦ। ਤੁਹਾਡਾ?", romanization: "changa riha, dhanvaad. tuhada?", vi: "Tốt, cảm ơn. Còn bạn?", en: "It was good, thank you. And yours?" },
  { pa: "ਚਲੋ, ਹੁਣ ਆਪਾਂ ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਕਰੀਏ।", romanization: "chalo, hun aapan meeting shuru kariye.", vi: "Nào, giờ chúng ta bắt đầu họp thôi.", en: "Alright, let's start the meeting now." },
];

const formsLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੇਰਾ ਨਾਮ ਸਿਮਰਨ ਹੈ।", romanization: "mera naam simran hai.", vi: "Tên tôi là Simran.", en: "My name is Simran." },
  { pa: "ਮੇਰਾ ਜਨਮ ਦਿਨ ਜੂਨ ਦੀ ਦਸ ਤਾਰੀਖ਼ ਹੈ।", romanization: "mera janam din june di das tareekh hai.", vi: "Sinh nhật của tôi là ngày mười tháng Sáu.", en: "My birthday is June tenth." },
  { pa: "ਮੇਰੇ ਕੋਲ ਪਤੇ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।", romanization: "mere kol pate da saboot nahi hai.", vi: "Tôi không có giấy chứng minh địa chỉ.", en: "I do not have proof of address." },
];

const shortMessagesLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ ਦਫ਼ਤਰ ਵਿੱਚ ਹੈ।", romanization: "meeting kal chaar vaje daftar vich hai.", vi: "Cuộc họp ngày mai lúc bốn giờ ở văn phòng.", en: "The meeting is tomorrow at four in the office." },
  { pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ID ਲਿਆਓ।", romanization: "kirpa karke aapna ID liaao.", vi: "Xin hãy mang theo ID.", en: "Please bring your ID." },
  { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ ਦਫ਼ਤਰ ਜਾਣਾ ਹੈ।", romanization: "mainu kal chaar vaje daftar jaana hai.", vi: "Tôi cần đến văn phòng ngày mai lúc bốn giờ.", en: "I need to go to the office tomorrow at four." },
];

const serviceFlowLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਇੱਕ ਕੰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "sat sri akal, mainu ikk kamm vich madad chahidi hai.", vi: "Xin chào, tôi cần giúp một việc.", en: "Hello, I need help with one thing." },
  { pa: "ਮੈਂ ਆਪਣਾ ਪਤਾ ਬਦਲਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main aapna pata badalna chahunda haan.", vi: "Tôi muốn đổi địa chỉ. (nam)", en: "I want to change my address. (male speaker)" },
  { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "mainu kihrhe kaaghaz chahide han?", vi: "Tôi cần những giấy tờ nào?", en: "Which documents do I need?" },
];

const repairLines: PunjabiA2MergeReadinessLine[] = [
  { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ।", romanization: "maaf karna, main samjhia nahi.", vi: "Xin lỗi, tôi chưa hiểu.", en: "Sorry, I did not understand." },
  { pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi hauli ate dubara kahi sakde ho?", vi: "Bạn có thể nói chậm và nhắc lại không?", en: "Can you say it slowly and again?" },
  { pa: "ਤਾਂ ਮੈਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਆਉਣਾ ਹੈ, ਠੀਕ ਹੈ?", romanization: "taan mainu shukkarvaar auna hai, theek hai?", vi: "Vậy là tôi phải đến thứ Sáu, đúng không?", en: "So I need to come on Friday, right?" },
];

export const a2MergeReadinessSamples: PunjabiA2MergeReadinessItem[] = [
  {
    id: "pa_a2_merge_daily_routine",
    scenario: "daily_routine",
    style: "merge_readiness",
    title_vi: "Merge-readiness: thói quen hằng ngày",
    title_en: "Merge-readiness: daily routine",
    sample_goal_vi: "Giữ giờ, thói quen sáng, và một câu quá khứ ngắn.",
    sample_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    review_goal_vi: "Giữ giờ, thói quen sáng, và một câu quá khứ ngắn.",
    review_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    merge_goal_vi: "Đảm bảo mục thói quen đủ sạch để gộp vào bộ A2 chung.",
    merge_goal_en: "Ensure the routine item is clean enough to merge into the shared A2 set.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample_lines: dailyRoutineLines,
    evidence_lines: dailyRoutineLines,
    merge_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਛੇ ਵਜੇ", answer_romanization: "chhe vaje", answer_vi: "Sáu giờ.", answer_en: "At six." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਜਲਦੀ ਸੌਂ ਗਿਆ", answer_romanization: "jaldi saun gaya", answer_vi: "Đi ngủ sớm.", answer_en: "Went to bed early." },
    ],
    explanation_vi: "Mục này kiểm tra xem người học còn giữ được mốc giờ, thói quen, và một câu quá khứ ngắn trước khi merge.",
    explanation_en: "This item checks whether the learner still keeps the time, routine, and one short past sentence before merging.",
    traps: [
      {
        trap_vi: "Đừng đổi giờ sang câu chung chung như 'buổi sáng'.",
        trap_en: "Do not replace the time with a vague phrase like 'in the morning'.",
        fix_pa: "ਛੇ ਵਜੇ",
        fix_romanization: "chhe vaje",
      },
    ],
    pass_signal_vi: "Có giờ, thói quen, và một câu quá khứ rõ.",
    pass_signal_en: "Has time, routine, and one clear past sentence.",
    merge_check_vi: "Đủ sạch để gộp vào A2 routine bundle.",
    merge_check_en: "Clean enough to merge into the A2 routine bundle.",
    readiness_check_vi: "Ổn để chuyển sang bước merge tiếp theo.",
    readiness_check_en: "Stable enough for the next merge step.",
  },
  {
    id: "pa_a2_merge_appointments",
    scenario: "appointments",
    style: "final_regression",
    title_vi: "Final regression: lịch hẹn",
    title_en: "Final regression: appointments",
    sample_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    sample_goal_en: "Retain the old time, the new time, and the item to bring.",
    review_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    review_goal_en: "Retain the old time, the new time, and the item to bring.",
    merge_goal_vi: "Xác nhận luồng đổi lịch ổn định trước khi merge.",
    merge_goal_en: "Confirm the reschedule flow is stable before merging.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada rất thật.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are very real Canadian contexts.",
    sample_lines: appointmentsLines,
    evidence_lines: appointmentsLines,
    merge_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਸੋਮਵਾਰ ਦਸ ਵਜੇ", answer_romanization: "somvaar das vaje", answer_vi: "Thứ Hai lúc mười giờ.", answer_en: "Monday at ten." },
      { q_vi: "Mang gì?", q_en: "What to bring?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này giúp người học giữ được ngày giờ và giấy tờ khi đổi lịch, sẵn sàng để merge.",
    explanation_en: "This sample helps the learner keep the date/time and document when rescheduling, ready to merge.",
    traps: [
      {
        trap_vi: "Đừng quên giờ mới khi xin đổi lịch.",
        trap_en: "Do not forget the new time when rescheduling.",
        fix_pa: "ਮੰਗਲਵਾਰ",
        fix_romanization: "mangalvaar",
      },
    ],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ cần mang.",
    pass_signal_en: "Has the old time, new time, and document to bring.",
    merge_check_vi: "Đủ sạch để gộp vào appointment flow.",
    merge_check_en: "Clean enough to merge into the appointment flow.",
    readiness_check_vi: "Có thể đưa vào appointment flow ngay.",
    readiness_check_en: "Can be placed into the appointment flow immediately.",
  },
  {
    id: "pa_a2_merge_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: đi lại",
    title_en: "Pre-integration: transport",
    sample_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    sample_goal_en: "Keep the route question, stop question, and delay sentence.",
    review_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    review_goal_en: "Keep the route question, stop question, and delay sentence.",
    merge_goal_vi: "Bảo đảm cụm đi lại không xung đột khi merge với các module khác.",
    merge_goal_en: "Ensure the transport cluster does not conflict when merged with other modules.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, và platform là bối cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are real Canadian contexts.",
    sample_lines: transportLines,
    evidence_lines: transportLines,
    merge_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਡਾਊਨਟਾਊਨ", answer_romanization: "downtown", answer_vi: "Trung tâm.", answer_en: "Downtown." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਪੰਜ ਮਿੰਟ", answer_romanization: "panj mint", answer_vi: "Năm phút.", answer_en: "Five minutes." },
    ],
    explanation_vi: "Bộ này kiểm tra việc giữ đúng tuyến, điểm xuống, và báo trễ trước khi tích hợp.",
    explanation_en: "This set checks keeping the route, the stop, and the delay together before integration.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói điểm đến mà thiếu thời lượng trễ.",
        trap_en: "Do not name only the destination and omit the delay.",
        fix_pa: "ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ",
        fix_romanization: "panj mint der naal",
      },
    ],
    pass_signal_vi: "Có route, stop, và delay theo đúng trình tự.",
    pass_signal_en: "Has route, stop, and delay in the right sequence.",
    merge_check_vi: "Thông tin vẫn đủ cho một merge pass.",
    merge_check_en: "Information remains sufficient for a merge pass.",
    readiness_check_vi: "Ổn để chuyển sang transport flow tiếp theo.",
    readiness_check_en: "Stable enough for the next transport flow.",
  },
  {
    id: "pa_a2_merge_housing",
    scenario: "housing",
    style: "merge_readiness",
    title_vi: "Merge-readiness: nhà ở",
    title_en: "Merge-readiness: housing",
    sample_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu sửa.",
    sample_goal_en: "Keep the polite opener, the problem, timing, and request to fix.",
    review_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu sửa.",
    review_goal_en: "Keep the polite opener, the problem, timing, and request to fix.",
    merge_goal_vi: "Bảo đảm tin nhắn landlord đủ lịch sự và đủ dữ kiện để merge.",
    merge_goal_en: "Ensure the landlord message stays polite and complete enough to merge.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Nhắn landlord hoặc building manager về leak, heater, hay laundry là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Messaging a landlord or building manager about a leak, heater, or laundry is practical in Canada.",
    sample_lines: housingLines,
    evidence_lines: housingLines,
    merge_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਨਲ਼ ਚੋ ਰਹੀ ਹੈ", answer_romanization: "nal cho rahi hai", answer_vi: "Vòi đang rò nước.", answer_en: "The tap is leaking." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ", answer_romanization: "kal raat ton", answer_vi: "Từ tối qua.", answer_en: "Since last night." },
    ],
    explanation_vi: "Mục này kiểm tra việc giữ đủ lịch sự và đủ dữ kiện khi rút gọn để merge.",
    explanation_en: "This item checks whether the learner still keeps enough politeness and data when compacting for merge.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói 'problem' mà thiếu thời điểm.",
        trap_en: "Do not say only 'problem' without timing.",
        fix_pa: "ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ",
        fix_romanization: "kal raat ton",
      },
    ],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và yêu cầu.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    merge_check_vi: "Đủ dữ liệu để merge vào landlord template.",
    merge_check_en: "Enough data to merge into the landlord template.",
    readiness_check_vi: "Có thể chuyển sang landlord template ngay.",
    readiness_check_en: "Can move directly into a landlord-message template.",
  },
  {
    id: "pa_a2_merge_school",
    scenario: "school",
    style: "final_regression",
    title_vi: "Final regression: trường học",
    title_en: "Final regression: school",
    sample_goal_vi: "Giữ câu vắng học, lý do, và yêu cầu bài.",
    sample_goal_en: "Keep the absence sentence, the reason, and the work request.",
    review_goal_vi: "Giữ câu vắng học, lý do, và yêu cầu bài.",
    review_goal_en: "Keep the absence sentence, the reason, and the work request.",
    merge_goal_vi: "Xác nhận trục absence + reason + work ổn định để merge.",
    merge_goal_en: "Confirm the absence + reason + work axis is stable to merge.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office và teacher messages là ngữ cảnh Canada rất thường gặp.",
    canada_practical_en: "School office and teacher messages are common Canadian contexts.",
    sample_lines: schoolLines,
    evidence_lines: schoolLines,
    merge_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ", answer_romanization: "khangh ate zukaam", answer_vi: "Ho và cảm.", answer_en: "Cough and cold." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਅੱਜ ਦਾ ਕੰਮ ਭੇਜੋ", answer_romanization: "ajj da kamm bhejo", answer_vi: "Gửi bài hôm nay.", answer_en: "Send today's work." },
    ],
    explanation_vi: "Mẫu này giữ trục absence + reason + work đúng cách trước khi merge.",
    explanation_en: "This sample keeps the absence + reason + work axis intact before merging.",
    traps: [
      {
        trap_vi: "Đừng bỏ lý do khi báo nghỉ học.",
        trap_en: "Do not omit the reason when reporting an absence.",
        fix_pa: "ਉਸ ਨੂੰ ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ ਹੈ",
        fix_romanization: "us nu khangh ate zukaam hai",
      },
    ],
    pass_signal_vi: "Có absence, reason, và work request.",
    pass_signal_en: "Has absence, reason, and work request.",
    merge_check_vi: "Đủ sạch để merge vào school flow.",
    merge_check_en: "Clean enough to merge into the school flow.",
    readiness_check_vi: "Đủ ổn để đi vào school flow.",
    readiness_check_en: "Stable enough for the school flow.",
  },
  {
    id: "pa_a2_merge_childcare",
    scenario: "childcare",
    style: "pre_integration",
    title_vi: "Pre-integration: childcare",
    title_en: "Pre-integration: childcare",
    sample_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    sample_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    review_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    review_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    merge_goal_vi: "Bảo đảm thông tin an toàn đón trẻ không bị mất khi merge.",
    merge_goal_en: "Ensure the child-safety pickup details are not lost when merged.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup lists là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are very practical Canadian contexts.",
    sample_lines: childcareLines,
    evidence_lines: childcareLines,
    merge_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰਾ ਭਰਾ", answer_romanization: "mera bhra", answer_vi: "Anh/em trai tôi.", answer_en: "My brother." },
      { q_vi: "Trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Pre-integration vì nó ghép giờ đón, người đón, và danh sách an toàn trước khi merge.",
    explanation_en: "This is pre-integration because it combines pickup time, alternate person, and a safety list before merging.",
    traps: [
      {
        trap_vi: "Đừng bỏ giờ đón trong tin nhắn childcare.",
        trap_en: "Do not omit the pickup time in a childcare message.",
        fix_pa: "ਸਾਢੇ ਪੰਜ ਵਜੇ",
        fix_romanization: "saadhe panj vaje",
      },
    ],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    merge_check_vi: "Câu rất an toàn để merge vào childcare flow.",
    merge_check_en: "Very safe wording to merge into the childcare flow.",
    readiness_check_vi: "Sẵn sàng cho childcare flow.",
    readiness_check_en: "Ready for the childcare flow.",
  },
  {
    id: "pa_a2_merge_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "merge_readiness",
    title_vi: "Merge-readiness: small talk nơi làm",
    title_en: "Merge-readiness: workplace small talk",
    sample_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    sample_goal_en: "Keep the greeting, brief small talk, then return to work.",
    review_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    review_goal_en: "Keep the greeting, brief small talk, then return to work.",
    merge_goal_vi: "Đảm bảo độ lịch sự nhất quán để merge với module workplace.",
    merge_goal_en: "Ensure consistent politeness to merge with the workplace module.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend và weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend and weather small talk is often safe in many Canadian workplaces.",
    sample_lines: workplaceLines,
    evidence_lines: workplaceLines,
    merge_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਕਰੀਏ", answer_romanization: "meeting shuru kariye", answer_vi: "Bắt đầu họp nhé?", answer_en: "Shall we start the meeting?" },
    ],
    explanation_vi: "Merge-readiness này giữ small talk ngắn rồi chuyển lại công việc với độ lịch sự ổn định.",
    explanation_en: "This merge-readiness item keeps small talk brief and then returns to work with stable politeness.",
    traps: [
      {
        trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.",
        trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar in the workplace.",
        fix_pa: "ਤੁਹਾਡਾ ਵੀਕੈਂਡ ਕਿਵੇਂ ਰਿਹਾ?",
        fix_romanization: "tuhada weekend kiven riha?",
      },
    ],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    merge_check_vi: "Small talk đủ lịch sự để merge.",
    merge_check_en: "Small talk is polite enough to merge.",
    readiness_check_vi: "Ổn cho workplace flow.",
    readiness_check_en: "Stable for the workplace flow.",
  },
  {
    id: "pa_a2_merge_forms",
    scenario: "forms",
    style: "final_regression",
    title_vi: "Final regression: mẫu đơn",
    title_en: "Final regression: forms",
    sample_goal_vi: "Giữ tên, ngày sinh, và câu thiếu giấy tờ.",
    sample_goal_en: "Keep the name, date of birth, and missing-document sentence.",
    review_goal_vi: "Giữ tên, ngày sinh, và câu thiếu giấy tờ.",
    review_goal_en: "Keep the name, date of birth, and missing-document sentence.",
    merge_goal_vi: "Xác nhận core form fields không rớt khi merge.",
    merge_goal_en: "Confirm the core form fields do not drop when merged.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, school office, library card, và Service Canada là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Clinic, school office, library card, and Service Canada are common Canadian contexts.",
    sample_lines: formsLines,
    evidence_lines: formsLines,
    merge_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਸਿਮਰਨ ਹੈ।", answer_romanization: "mera naam simran hai.", answer_vi: "Tên tôi là Simran.", answer_en: "My name is Simran." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਪਤੇ ਦਾ ਸਬੂਤ", answer_romanization: "pate da saboot", answer_vi: "Giấy chứng minh địa chỉ.", answer_en: "Proof of address." },
    ],
    explanation_vi: "Mẫu này giữ core form fields mà người học hay bỏ mất, sẵn sàng để merge.",
    explanation_en: "This sample keeps the core form fields learners often drop, ready to merge.",
    traps: [
      {
        trap_vi: "ਪਤਾ trên form nghĩa là địa chỉ, không phải 'biết'.",
        trap_en: "ਪਤਾ on a form means address, not 'know'.",
        fix_pa: "ਪਤੇ ਦਾ ਸਬੂਤ",
        fix_romanization: "pate da saboot",
      },
    ],
    pass_signal_vi: "Có name, ngày sinh, và missing document theo đúng thứ tự.",
    pass_signal_en: "Has name, date of birth, and missing document in the right order.",
    merge_check_vi: "Đủ sạch để merge vào form-fill flow.",
    merge_check_en: "Clean enough to merge into the form-fill flow.",
    readiness_check_vi: "Ổn cho form-fill flow.",
    readiness_check_en: "Stable for the form-fill flow.",
  },
  {
    id: "pa_a2_merge_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    sample_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    sample_goal_en: "Extract day, time, place, and item to bring from a short message.",
    review_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    review_goal_en: "Extract day, time, place, and item to bring from a short message.",
    merge_goal_vi: "Bảo đảm việc tách thông tin ổn định để merge.",
    merge_goal_en: "Ensure the information extraction is stable to merge.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Work notices, school notices, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Work notices, school notices, and training notes are common Canadian contexts.",
    sample_lines: shortMessagesLines,
    evidence_lines: shortMessagesLines,
    merge_qa: [
      { q_vi: "Khi nào có họp?", q_en: "When is the meeting?", answer_pa: "ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ", answer_romanization: "kal chaar vaje", answer_vi: "Ngày mai lúc bốn giờ.", answer_en: "Tomorrow at four." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਆਈਡੀ", answer_romanization: "ID", answer_vi: "Giấy tờ tùy thân.", answer_en: "ID." },
    ],
    explanation_vi: "Mẫu này nhấn vào việc tách đúng ngày, giờ, nơi, và vật cần mang trước khi merge.",
    explanation_en: "This sample emphasizes extracting the right day, time, place, and item before merging.",
    traps: [
      {
        trap_vi: "Đừng trả lời chỉ 'office' mà thiếu ngày/giờ.",
        trap_en: "Do not answer only 'office' without day/time.",
        fix_pa: "ਕੱਲ੍ਹ ਚਾਰ ਵਜੇ",
        fix_romanization: "kal chaar vaje",
      },
    ],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    merge_check_vi: "Tin nhắn vẫn đủ rõ để merge vào message-comprehension flow.",
    merge_check_en: "The message remains clear enough to merge into the message-comprehension flow.",
    readiness_check_vi: "Có thể đưa vào message-comprehension flow.",
    readiness_check_en: "Can be placed into the message-comprehension flow.",
  },
  {
    id: "pa_a2_merge_service_flow",
    scenario: "service_flow",
    style: "merge_readiness",
    title_vi: "Merge-readiness: luồng dịch vụ",
    title_en: "Merge-readiness: service flow",
    sample_goal_vi: "Giữ câu mở, nêu nhu cầu, và hỏi giấy tờ cần thiết.",
    sample_goal_en: "Keep the opener, state the need, and ask for required documents.",
    review_goal_vi: "Giữ câu mở, nêu nhu cầu, và hỏi giấy tờ cần thiết.",
    review_goal_en: "Keep the opener, state the need, and ask for required documents.",
    merge_goal_vi: "Bảo đảm luồng quầy dịch vụ đủ trọn vẹn để merge.",
    merge_goal_en: "Ensure the service-counter flow is complete enough to merge.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Service Canada, ServiceOntario, bank, và library desk là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Service Canada, ServiceOntario, a bank, and a library desk are practical Canadian contexts.",
    sample_lines: serviceFlowLines,
    evidence_lines: serviceFlowLines,
    merge_qa: [
      { q_vi: "Nhu cầu?", q_en: "The need?", answer_pa: "ਪਤਾ ਬਦਲਣਾ", answer_romanization: "pata badalna", answer_vi: "Đổi địa chỉ.", answer_en: "Change address." },
      { q_vi: "Hỏi gì?", q_en: "What to ask?", answer_pa: "ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?", answer_romanization: "kihrhe kaaghaz chahide han?", answer_vi: "Cần giấy tờ nào?", answer_en: "Which documents are needed?" },
    ],
    explanation_vi: "Mục này giữ trục mở đầu + nhu cầu + hỏi giấy tờ ở một quầy dịch vụ trước khi merge.",
    explanation_en: "This item keeps the opener + need + document question at a service counter before merging.",
    traps: [
      {
        trap_vi: "Đừng nêu nhu cầu mà quên hỏi giấy tờ cần thiết.",
        trap_en: "Do not state the need but forget to ask which documents are required.",
        fix_pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗ਼ਜ਼ ਚਾਹੀਦੇ ਹਨ?",
        fix_romanization: "mainu kihrhe kaaghaz chahide han?",
      },
    ],
    pass_signal_vi: "Có opener, nhu cầu, và câu hỏi giấy tờ.",
    pass_signal_en: "Has opener, need, and document question.",
    merge_check_vi: "Đủ trọn vẹn để merge vào service flow.",
    merge_check_en: "Complete enough to merge into the service flow.",
    readiness_check_vi: "Có thể chuyển sang service-counter template ngay.",
    readiness_check_en: "Can move directly into a service-counter template.",
  },
  {
    id: "pa_a2_merge_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: sửa tương tác",
    title_en: "Pre-integration: interaction repair",
    sample_goal_vi: "Giữ báo chưa hiểu, xin nói chậm và nhắc lại, và xác nhận ý hiểu.",
    sample_goal_en: "Keep signalling non-understanding, asking for slower repetition, and confirming meaning.",
    review_goal_vi: "Giữ báo chưa hiểu, xin nói chậm và nhắc lại, và xác nhận ý hiểu.",
    review_goal_en: "Keep signalling non-understanding, asking for slower repetition, and confirming meaning.",
    merge_goal_vi: "Bảo đảm repair phrases ổn định để merge với mọi luồng.",
    merge_goal_en: "Ensure repair phrases are stable to merge with every flow.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample_lines: repairLines,
    evidence_lines: repairLines,
    merge_qa: [
      { q_vi: "Báo chưa hiểu?", q_en: "Signal non-understanding?", answer_pa: "ਮੈਂ ਸਮਝਿਆ ਨਹੀਂ", answer_romanization: "main samjhia nahi", answer_vi: "Tôi chưa hiểu.", answer_en: "I did not understand." },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਤਾਂ ਮੈਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਆਉਣਾ ਹੈ, ਠੀਕ ਹੈ?", answer_romanization: "taan mainu shukkarvaar auna hai, theek hai?", answer_vi: "Vậy tôi phải đến thứ Sáu, đúng không?", answer_en: "So I need to come on Friday, right?" },
    ],
    explanation_vi: "Pre-integration này giữ repair phrases để người học không bị kẹt khi không nghe rõ.",
    explanation_en: "This pre-integration sample keeps repair phrases so the learner does not get stuck when they cannot hear clearly.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.",
        trap_en: "Do not just say 'what?' in a polite setting.",
        fix_pa: "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਅਤੇ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?",
        fix_romanization: "ki tusi hauli ate dubara kahi sakde ho?",
      },
    ],
    pass_signal_vi: "Có báo chưa hiểu, xin nhắc lại, và câu xác nhận.",
    pass_signal_en: "Has a non-understanding signal, a repetition request, and a confirmation.",
    merge_check_vi: "Đủ rõ để merge vào interaction-repair flow.",
    merge_check_en: "Clear enough to merge into the interaction-repair flow.",
    readiness_check_vi: "Ổn để đưa vào interaction-repair flow.",
    readiness_check_en: "Stable enough for the interaction-repair flow.",
  },
];
