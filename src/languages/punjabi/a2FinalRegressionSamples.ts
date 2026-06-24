// src/languages/punjabi/a2FinalRegressionSamples.ts
//
// Punjabi A2 final regression samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2FinalRegressionScenario =
  | "daily_routine"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "forms"
  | "short_messages"
  | "polite_problem_description"
  | "interaction_repair";

export type PunjabiA2FinalRegressionStyle =
  | "final_regression"
  | "sanity"
  | "pre_integration";

export type PunjabiA2FinalRegressionLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2FinalRegressionTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2FinalRegressionItem = {
  id: string;
  scenario: PunjabiA2FinalRegressionScenario;
  style: PunjabiA2FinalRegressionStyle;
  title_vi: string;
  title_en: string;
  sample_goal_vi: string;
  sample_goal_en: string;
  review_goal_vi: string;
  review_goal_en: string;
  regression_goal_vi: string;
  regression_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  sample_lines: PunjabiA2FinalRegressionLine[];
  evidence_lines: PunjabiA2FinalRegressionLine[];
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
  traps: PunjabiA2FinalRegressionTrap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  sanity_check_vi: string;
  sanity_check_en: string;
  readiness_check_vi: string;
  readiness_check_en: string;
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong final regression samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these final regression samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const dailyRoutineLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
  { pa: "ਫਿਰ ਮੈਂ ਨਾਸਤਾ ਕਰਦੀ ਹਾਂ।", romanization: "phir main nashta kardi haan.", vi: "Rồi tôi ăn sáng. (nữ)", en: "Then I have breakfast. (female speaker)" },
  { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked at home." },
];

const appointmentsLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
  { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakdi haan?", vi: "Tôi có thể đổi sang thứ Sáu lúc ba giờ không? (nữ)", en: "Can I change it to Friday at three? (female speaker)" },
  { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗੀ।", romanization: "main health card naal liaavangi.", vi: "Tôi sẽ mang thẻ y tế. (nữ)", en: "I will bring the health card. (female speaker)" },
];

const transportLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
  { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
  { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", romanization: "main das mint der naal aavangi.", vi: "Tôi sẽ đến muộn mười phút. (nữ)", en: "I will be ten minutes late. (female speaker)" },
];

const housingLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
  { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
  { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
];

const schoolLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
  { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He or she has a fever." },
  { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
];

const childcareLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
  { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
  { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
];

const workplaceLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
  { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
  { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
];

const formsLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman." },
  { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
  { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
];

const shortMessagesLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
  { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
  { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
];

const politeProblemLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mera card kamm nahi kar riha.", vi: "Xin lỗi, thẻ của tôi không hoạt động.", en: "Sorry, my card is not working." },
  { pa: "ਇਹ ਅੱਜ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh ajj savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng nay.", en: "This has been happening since this morning." },
  { pa: "ਕੀ ਤੁਸੀਂ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi is nu check kar sakde ho?", vi: "Bạn có thể kiểm tra việc này không?", en: "Can you check this?" },
];

const repairLines: PunjabiA2FinalRegressionLine[] = [
  { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
  { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
  { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
];

export const a2FinalRegressionSamples: PunjabiA2FinalRegressionItem[] = [
  {
    id: "pa_a2_final_reg_daily_routine",
    scenario: "daily_routine",
    style: "final_regression",
    title_vi: "Final regression: thói quen hằng ngày",
    title_en: "Final regression: daily routine",
    sample_goal_vi: "Giữ giờ, thói quen sáng, và một câu quá khứ ngắn.",
    sample_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    review_goal_vi: "Giữ giờ, thói quen sáng, và một câu quá khứ ngắn.",
    review_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    regression_goal_vi: "Giữ giờ, thói quen sáng, và một câu quá khứ ngắn.",
    regression_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample_lines: dailyRoutineLines,
    evidence_lines: dailyRoutineLines,
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Đã nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Regression này kiểm tra xem người học còn giữ được mốc giờ, thói quen, và một câu quá khứ ngắn không.",
    explanation_en: "This regression checks whether the learner still keeps the time, routine, and one short past sentence.",
    traps: [
      {
        trap_vi: "Đừng đổi giờ sang câu chung chung như 'buổi sáng'.",
        trap_en: "Do not replace the time with a vague phrase like 'in the morning'.",
        fix_pa: "ਸੱਤ ਵਜੇ",
        fix_romanization: "satt vaje",
      },
    ],
    pass_signal_vi: "Có giờ, thói quen, và một câu quá khứ rõ.",
    pass_signal_en: "Has time, routine, and one clear past sentence.",
    sanity_check_vi: "Đầu ra đủ sạch để dùng trong sanity pass.",
    sanity_check_en: "Output is clean enough for a sanity pass.",
    readiness_check_vi: "Ổn để chuyển sang A2 regression bundle tiếp theo.",
    readiness_check_en: "Stable enough for the next A2 regression bundle.",
  },
  {
    id: "pa_a2_final_reg_appointments",
    scenario: "appointments",
    style: "sanity",
    title_vi: "Sanity: lịch hẹn",
    title_en: "Sanity: appointments",
    sample_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    sample_goal_en: "Retain the old time, the new time, and the item to bring.",
    review_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    review_goal_en: "Retain the old time, the new time, and the item to bring.",
    regression_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    regression_goal_en: "Retain the old time, the new time, and the item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada rất thật.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are very real Canadian contexts.",
    sample_lines: appointmentsLines,
    evidence_lines: appointmentsLines,
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Mang gì?", q_en: "What to bring?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này giúp người học giữ được ngày giờ và giấy tờ khi đổi lịch.",
    explanation_en: "This sample helps the learner keep the date/time and document when rescheduling.",
    traps: [
      {
        trap_vi: "Đừng quên giờ mới khi xin đổi lịch.",
        trap_en: "Do not forget the new time when rescheduling.",
        fix_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ",
        fix_romanization: "shukkarvaar tinn vaje",
      },
    ],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ cần mang.",
    pass_signal_en: "Has the old time, new time, and document to bring.",
    sanity_check_vi: "Đủ sạch để đi qua sanity layer.",
    sanity_check_en: "Clean enough to pass the sanity layer.",
    readiness_check_vi: "Có thể đưa vào appointment flow ngay.",
    readiness_check_en: "Can be placed into the appointment flow immediately.",
  },
  {
    id: "pa_a2_final_reg_transport",
    scenario: "transport",
    style: "pre_integration",
    title_vi: "Pre-integration: đi lại",
    title_en: "Pre-integration: transport",
    sample_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    sample_goal_en: "Keep the route question, stop question, and delay sentence.",
    review_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    review_goal_en: "Keep the route question, stop question, and delay sentence.",
    regression_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    regression_goal_en: "Keep the route question, stop question, and delay sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, và platform là bối cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are real Canadian contexts.",
    sample_lines: transportLines,
    evidence_lines: transportLines,
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Bộ này kiểm tra việc giữ đúng tuyến, điểm xuống, và báo trễ.",
    explanation_en: "This set checks keeping the route, the stop, and the delay together.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói điểm đến mà thiếu thời lượng trễ.",
        trap_en: "Do not name only the destination and omit the delay.",
        fix_pa: "ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ",
        fix_romanization: "das mint der naal",
      },
    ],
    pass_signal_vi: "Có route, stop, và delay theo đúng trình tự.",
    pass_signal_en: "Has route, stop, and delay in the right sequence.",
    sanity_check_vi: "Thông tin vẫn đủ cho một sanity pass.",
    sanity_check_en: "Information remains sufficient for a sanity pass.",
    readiness_check_vi: "Ổn để chuyển sang transport flow tiếp theo.",
    readiness_check_en: "Stable enough for the next transport flow.",
  },
  {
    id: "pa_a2_final_reg_housing",
    scenario: "housing",
    style: "final_regression",
    title_vi: "Final regression: nhà ở",
    title_en: "Final regression: housing",
    sample_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu xem.",
    sample_goal_en: "Keep the polite opener, the problem, timing, and request to check.",
    review_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu xem.",
    review_goal_en: "Keep the polite opener, the problem, timing, and request to check.",
    regression_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu xem.",
    regression_goal_en: "Keep the polite opener, the problem, timing, and request to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Nhắn landlord hoặc building manager về heater, leak, hay laundry là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Messaging a landlord or building manager about a heater, leak, or laundry is practical in Canada.",
    sample_lines: housingLines,
    evidence_lines: housingLines,
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Regression này kiểm tra việc giữ đủ lịch sự và đủ dữ kiện khi rút gọn.",
    explanation_en: "This regression checks whether the learner still keeps enough politeness and data when compacting.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói 'problem' mà thiếu thời điểm.",
        trap_en: "Do not say only 'problem' without timing.",
        fix_pa: "ਸਵੇਰੇ ਤੋਂ",
        fix_romanization: "savere ton",
      },
    ],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và yêu cầu.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    sanity_check_vi: "Đủ dữ liệu cho sanity review.",
    sanity_check_en: "Enough data for sanity review.",
    readiness_check_vi: "Có thể chuyển sang landlord template ngay.",
    readiness_check_en: "Can move directly into a landlord-message template.",
  },
  {
    id: "pa_a2_final_reg_school",
    scenario: "school",
    style: "sanity",
    title_vi: "Sanity: trường học",
    title_en: "Sanity: school",
    sample_goal_vi: "Giữ câu vắng học, lý do sốt, và yêu cầu homework.",
    sample_goal_en: "Keep the absence sentence, fever reason, and homework request.",
    review_goal_vi: "Giữ câu vắng học, lý do sốt, và yêu cầu homework.",
    review_goal_en: "Keep the absence sentence, fever reason, and homework request.",
    regression_goal_vi: "Giữ câu vắng học, lý do sốt, và yêu cầu homework.",
    regression_goal_en: "Keep the absence sentence, fever reason, and homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office và teacher messages là ngữ cảnh Canada rất thường gặp.",
    canada_practical_en: "School office and teacher messages are common Canadian contexts.",
    sample_lines: schoolLines,
    evidence_lines: schoolLines,
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Sanity pass này giúp giữ trục absence + fever + homework đúng cách.",
    explanation_en: "This sanity pass helps keep the absence + fever + homework axis intact.",
    traps: [
      {
        trap_vi: "Đừng bỏ lý do khi báo nghỉ học.",
        trap_en: "Do not omit the reason when reporting an absence.",
        fix_pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ",
        fix_romanization: "us nu bukhar hai",
      },
    ],
    pass_signal_vi: "Có absence, reason, và homework.",
    pass_signal_en: "Has absence, reason, and homework.",
    sanity_check_vi: "Đây là một sanity sample sạch.",
    sanity_check_en: "This is a clean sanity sample.",
    readiness_check_vi: "Đủ ổn để đi vào school flow.",
    readiness_check_en: "Stable enough for the school flow.",
  },
  {
    id: "pa_a2_final_reg_childcare",
    scenario: "childcare",
    style: "pre_integration",
    title_vi: "Pre-integration: childcare",
    title_en: "Pre-integration: childcare",
    sample_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    sample_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    review_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    review_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    regression_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    regression_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup lists là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are very practical Canadian contexts.",
    sample_lines: childcareLines,
    evidence_lines: childcareLines,
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Pre-integration vì nó ghép giờ đón, người đón, và danh sách an toàn.",
    explanation_en: "This is pre-integration because it combines pickup time, alternate person, and a safety list.",
    traps: [
      {
        trap_vi: "Đừng bỏ giờ đón trong tin nhắn childcare.",
        trap_en: "Do not omit the pickup time in a childcare message.",
        fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ",
        fix_romanization: "panj vaje lain aavegi",
      },
    ],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    sanity_check_vi: "Câu rất an toàn cho sanity review.",
    sanity_check_en: "Very safe wording for sanity review.",
    readiness_check_vi: "Sẵn sàng cho childcare flow.",
    readiness_check_en: "Ready for the childcare flow.",
  },
  {
    id: "pa_a2_final_reg_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "final_regression",
    title_vi: "Final regression: small talk nơi làm",
    title_en: "Final regression: workplace small talk",
    sample_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    sample_goal_en: "Keep the greeting, brief small talk, then return to work.",
    review_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    review_goal_en: "Keep the greeting, brief small talk, then return to work.",
    regression_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    regression_goal_en: "Keep the greeting, brief small talk, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend và weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend and weather small talk is often safe in many Canadian workplaces.",
    sample_lines: workplaceLines,
    evidence_lines: workplaceLines,
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Final regression này giữ small talk ngắn rồi chuyển lại công việc.",
    explanation_en: "This final regression keeps small talk brief and then returns to work.",
    traps: [
      {
        trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.",
        trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar in the workplace.",
        fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?",
        fix_romanization: "tuhada din kiven hai?",
      },
    ],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    sanity_check_vi: "Small talk đủ lịch sự cho sanity review.",
    sanity_check_en: "Small talk is polite enough for sanity review.",
    readiness_check_vi: "Ổn cho workplace flow.",
    readiness_check_en: "Stable for the workplace flow.",
  },
  {
    id: "pa_a2_final_reg_forms",
    scenario: "forms",
    style: "sanity",
    title_vi: "Sanity: mẫu đơn",
    title_en: "Sanity: forms",
    sample_goal_vi: "Giữ tên, địa chỉ, và câu thiếu giấy tờ.",
    sample_goal_en: "Keep the name, address, and missing-document sentence.",
    review_goal_vi: "Giữ tên, địa chỉ, và câu thiếu giấy tờ.",
    review_goal_en: "Keep the name, address, and missing-document sentence.",
    regression_goal_vi: "Giữ tên, địa chỉ, và câu thiếu giấy tờ.",
    regression_goal_en: "Keep the name, address, and missing-document sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, school office, library card, và Service Canada là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Clinic, school office, library card, and Service Canada are common Canadian contexts.",
    sample_lines: formsLines,
    evidence_lines: formsLines,
    final_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", answer_romanization: "mera naam aman hai.", answer_vi: "Tên tôi là Aman.", answer_en: "My name is Aman." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਇਹ ਦਸਤਾਵੇਜ਼", answer_romanization: "eh dastavez", answer_vi: "Giấy tờ này.", answer_en: "This document." },
    ],
    explanation_vi: "Sanity pass này giữ core form fields mà người học hay bỏ mất.",
    explanation_en: "This sanity pass keeps the core form fields learners often drop.",
    traps: [
      {
        trap_vi: "ਪਤਾ trên form nghĩa là địa chỉ, không phải 'biết'.",
        trap_en: "ਪਤਾ on a form means address, not 'know'.",
        fix_pa: "ਮੇਰਾ ਪਤਾ",
        fix_romanization: "mera pata",
      },
    ],
    pass_signal_vi: "Có name, address, và missing document theo đúng thứ tự.",
    pass_signal_en: "Has name, address, and missing document in the right order.",
    sanity_check_vi: "Đủ sạch cho sanity review.",
    sanity_check_en: "Clean enough for sanity review.",
    readiness_check_vi: "Ổn cho form-fill flow.",
    readiness_check_en: "Stable for the form-fill flow.",
  },
  {
    id: "pa_a2_final_reg_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    sample_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    sample_goal_en: "Extract day, time, place, and item to bring from a short message.",
    review_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    review_goal_en: "Extract day, time, place, and item to bring from a short message.",
    regression_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    regression_goal_en: "Extract day, time, place, and item to bring from a short message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School notices, library classes, settlement classes, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School notices, library classes, settlement classes, and training notes are common Canadian contexts.",
    sample_lines: shortMessagesLines,
    evidence_lines: shortMessagesLines,
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Mẫu này nhấn vào việc tách đúng ngày, giờ, nơi, và vật cần mang.",
    explanation_en: "This sample emphasizes extracting the right day, time, place, and item to bring.",
    traps: [
      {
        trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.",
        trap_en: "Do not answer only 'library' without day/time.",
        fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ",
        fix_romanization: "kal tinn vaje",
      },
    ],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    sanity_check_vi: "Tin nhắn vẫn đủ rõ cho sanity review.",
    sanity_check_en: "The message remains clear enough for sanity review.",
    readiness_check_vi: "Có thể đưa vào message-comprehension flow.",
    readiness_check_en: "Can be placed into the message-comprehension flow.",
  },
  {
    id: "pa_a2_final_reg_polite_problem_description",
    scenario: "polite_problem_description",
    style: "final_regression",
    title_vi: "Final regression: mô tả vấn đề lịch sự",
    title_en: "Final regression: polite problem description",
    sample_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu kiểm tra.",
    sample_goal_en: "Keep the polite opener, problem, timing, and request to check.",
    review_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu kiểm tra.",
    review_goal_en: "Keep the polite opener, problem, timing, and request to check.",
    regression_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu kiểm tra.",
    regression_goal_en: "Keep the polite opener, problem, timing, and request to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp service counter, bank, hoặc repair desk ở Canada.",
    canada_practical_en: "Useful at a service counter, bank, or repair desk in Canada.",
    sample_lines: politeProblemLines,
    evidence_lines: politeProblemLines,
    final_qa: [
      { q_vi: "Vấn đề gì?", q_en: "What is the problem?", answer_pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "mera card kamm nahi kar riha", answer_vi: "Thẻ của tôi không hoạt động.", answer_en: "My card is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng nay.", answer_en: "Since this morning." },
    ],
    explanation_vi: "Đây là phần regression cho cách mô tả vấn đề lịch sự mà vẫn có timing.",
    explanation_en: "This is the regression portion for describing a problem politely while still including timing.",
    traps: [
      {
        trap_vi: "Không chỉ nói 'problem' mà thiếu thời điểm.",
        trap_en: "Do not say only 'problem' without timing.",
        fix_pa: "ਸਵੇਰੇ ਤੋਂ",
        fix_romanization: "savere ton",
      },
    ],
    pass_signal_vi: "Có opener, problem, timing, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    sanity_check_vi: "Ngữ liệu đủ an toàn cho sanity review.",
    sanity_check_en: "The wording is safe enough for sanity review.",
    readiness_check_vi: "Có thể chuyển sang service-style template ngay.",
    readiness_check_en: "Can move directly into a service-style template.",
  },
  {
    id: "pa_a2_final_reg_interaction_repair",
    scenario: "interaction_repair",
    style: "pre_integration",
    title_vi: "Pre-integration: sửa tương tác",
    title_en: "Pre-integration: interaction repair",
    sample_goal_vi: "Giữ xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    sample_goal_en: "Keep asking for repetition, asking for slower speech, and confirming understanding.",
    review_goal_vi: "Giữ xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    review_goal_en: "Keep asking for repetition, asking for slower speech, and confirming understanding.",
    regression_goal_vi: "Giữ xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    regression_goal_en: "Keep asking for repetition, asking for slower speech, and confirming understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample_lines: repairLines,
    evidence_lines: repairLines,
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Pre-integration này giữ được repair phrases để người học không bị kẹt khi không nghe rõ.",
    explanation_en: "This pre-integration sample keeps repair phrases so the learner does not get stuck when they cannot hear clearly.",
    traps: [
      {
        trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.",
        trap_en: "Do not just say 'what?' in a polite setting.",
        fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?",
        fix_romanization: "ki tusi dubara kahi sakde ho?",
      },
    ],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    sanity_check_vi: "Đủ rõ cho sanity review.",
    sanity_check_en: "Clear enough for sanity review.",
    readiness_check_vi: "Ổn để đưa vào interaction-repair flow.",
    readiness_check_en: "Stable enough for the interaction-repair flow.",
  },
];
