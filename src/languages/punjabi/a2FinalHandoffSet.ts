// src/languages/punjabi/a2FinalHandoffSet.ts
//
// Punjabi A2 final handoff set for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

export type PunjabiA2FinalHandoffScenario =
  | "daily_life"
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

export type PunjabiA2FinalHandoffStyle =
  | "final_handoff"
  | "pre_integration"
  | "final_readiness"
  | "regression";

export type PunjabiA2FinalHandoffLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2FinalHandoffTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2FinalHandoffItem = {
  id: string;
  scenario: PunjabiA2FinalHandoffScenario;
  style: PunjabiA2FinalHandoffStyle;
  title_vi: string;
  title_en: string;
  handoff_goal_vi: string;
  handoff_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  selector_lines: PunjabiA2FinalHandoffLine[];
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
  traps: PunjabiA2FinalHandoffTrap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  readiness_check_vi: string;
  readiness_check_en: string;
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong final handoff set; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in this final handoff set; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2FinalHandoffSet: PunjabiA2FinalHandoffItem[] = [
  {
    id: "pa_a2_final_daily_life",
    scenario: "daily_life",
    style: "final_handoff",
    title_vi: "Final handoff: đời sống hằng ngày",
    title_en: "Final handoff: daily life",
    handoff_goal_vi: "Giữ giờ, thói quen sáng, và một việc đã hoàn tất.",
    handoff_goal_en: "Keep the time, morning routine, and one completed action.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    selector_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਨਾਸਤਾ ਕਰਦੀ ਹਾਂ।", romanization: "phir main nashta kardi haan.", vi: "Rồi tôi ăn sáng. (nữ)", en: "Then I have breakfast. (female speaker)" },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked at home." },
    ],
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Đã nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Final handoff này cho thấy người học giữ được mốc giờ, thói quen, và một câu quá khứ ngắn.",
    explanation_en: "This final handoff shows the learner can keep the time, routine, and one short past sentence.",
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
    readiness_check_vi: "Ổn để chuyển sang giao tiếp A2 tiếp theo.",
    readiness_check_en: "Stable enough to move into the next A2 interaction layer.",
  },
  {
    id: "pa_a2_final_appointments",
    scenario: "appointments",
    style: "pre_integration",
    title_vi: "Pre-integration: lịch hẹn",
    title_en: "Pre-integration: appointments",
    handoff_goal_vi: "Giữ lịch cũ, lịch mới, và vật cần mang.",
    handoff_goal_en: "Keep the old time, the new time, and the item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada rất thật.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are very real Canadian contexts.",
    selector_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I change it to Friday at three? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Mang gì?", q_en: "What to bring?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này giữ đúng ba mảnh: lịch cũ, lịch mới, và giấy tờ.",
    explanation_en: "This pattern keeps the three pieces: old time, new time, and document.",
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
    readiness_check_vi: "Có thể đưa vào appointment flow ngay.",
    readiness_check_en: "Can be placed into the appointment flow immediately.",
  },
  {
    id: "pa_a2_final_transport",
    scenario: "transport",
    style: "final_readiness",
    title_vi: "Final readiness: đi lại",
    title_en: "Final readiness: transport",
    handoff_goal_vi: "Giữ route question, stop question, và câu báo trễ.",
    handoff_goal_en: "Keep the route question, stop question, and delay sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Bus, SkyTrain, TTC, GO Train, stop, và platform là bối cảnh Canada thật.",
    canada_practical_en: "Bus, SkyTrain, TTC, GO Train, stop, and platform are real Canadian contexts.",
    selector_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Bộ này giữ ba bước: hỏi tuyến, hỏi điểm xuống, báo trễ.",
    explanation_en: "This set keeps three steps: ask route, ask stop, report delay.",
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
    readiness_check_vi: "Ổn để chuyển sang transport flow tiếp theo.",
    readiness_check_en: "Stable enough for the next transport flow.",
  },
  {
    id: "pa_a2_final_housing",
    scenario: "housing",
    style: "regression",
    title_vi: "Regression: nhà ở",
    title_en: "Regression: housing",
    handoff_goal_vi: "Giữ câu mở lịch sự, nêu vấn đề, thời điểm, và yêu cầu xem.",
    handoff_goal_en: "Keep the polite opener, the problem, timing, and request to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Nhắn landlord hoặc building manager về heater, leak, hay laundry là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Messaging a landlord or building manager about a heater, leak, or laundry is practical in Canada.",
    selector_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Regression này kiểm tra xem người học còn giữ đủ lịch sự và đủ dữ kiện khi rút gọn không.",
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
    readiness_check_vi: "Có thể chuyển sang landlord message template ngay.",
    readiness_check_en: "Can move directly into a landlord-message template.",
  },
  {
    id: "pa_a2_final_school",
    scenario: "school",
    style: "final_readiness",
    title_vi: "Final readiness: trường học",
    title_en: "Final readiness: school",
    handoff_goal_vi: "Giữ câu vắng học, lý do sốt, và yêu cầu homework.",
    handoff_goal_en: "Keep the absence sentence, fever reason, and homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office và teacher messages là ngữ cảnh Canada rất thường gặp.",
    canada_practical_en: "School office and teacher messages are common Canadian contexts.",
    selector_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He or she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Final handoff này giữ absence + fever + homework theo đúng thứ tự nhà trường cần.",
    explanation_en: "This final handoff keeps absence + fever + homework in the order a school needs.",
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
    readiness_check_vi: "Đủ ổn để đi vào school flow.",
    readiness_check_en: "Stable enough for the school flow.",
  },
  {
    id: "pa_a2_final_childcare",
    scenario: "childcare",
    style: "pre_integration",
    title_vi: "Pre-integration: childcare",
    title_en: "Pre-integration: childcare",
    handoff_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    handoff_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare và after-school pickup list là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare and after-school pickup lists are very practical Canadian contexts.",
    selector_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Đây là pre-integration vì nó ghép giờ đón, người đón, và danh sách an toàn.",
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
    readiness_check_vi: "Sẵn sàng cho childcare flow.",
    readiness_check_en: "Ready for the childcare flow.",
  },
  {
    id: "pa_a2_final_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "final_handoff",
    title_vi: "Final handoff: small talk nơi làm",
    title_en: "Final handoff: workplace small talk",
    handoff_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    handoff_goal_en: "Keep the greeting, brief small talk, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend và weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend and weather small talk is often safe in many Canadian workplaces.",
    selector_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Final handoff này giữ small talk trong biên độ ngắn rồi quay về work.",
    explanation_en: "This final handoff keeps small talk short and returns to work.",
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
    readiness_check_vi: "Ổn cho workplace flow.",
    readiness_check_en: "Stable for the workplace flow.",
  },
  {
    id: "pa_a2_final_forms",
    scenario: "forms",
    style: "regression",
    title_vi: "Regression: mẫu đơn",
    title_en: "Regression: forms",
    handoff_goal_vi: "Giữ tên, địa chỉ, và câu thiếu giấy tờ.",
    handoff_goal_en: "Keep the name, address, and missing-document sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, school office, library card, và Service Canada là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "Clinic, school office, library card, and Service Canada are common Canadian contexts.",
    selector_lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
    ],
    final_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", answer_romanization: "mera naam aman hai.", answer_vi: "Tên tôi là Aman.", answer_en: "My name is Aman." },
      { q_vi: "Thiếu giấy tờ gì?", q_en: "Which document is missing?", answer_pa: "ਇਹ ਦਸਤਾਵੇਜ਼", answer_romanization: "eh dastavez", answer_vi: "Giấy tờ này.", answer_en: "This document." },
    ],
    explanation_vi: "Regression này nhắc lại core form fields mà người học hay bỏ mất.",
    explanation_en: "This regression repeats the core form fields learners often drop.",
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
    readiness_check_vi: "Ổn cho form-fill flow.",
    readiness_check_en: "Stable for the form-fill flow.",
  },
  {
    id: "pa_a2_final_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    handoff_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    handoff_goal_en: "Extract day, time, place, and item to bring from a short message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School notices, library classes, settlement classes, và training notes là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School notices, library classes, settlement classes, and training notes are common Canadian contexts.",
    selector_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Mẫu này nhấn vào việc tách đúng mảnh thông tin trong tin nhắn.",
    explanation_en: "This pattern emphasizes extracting the right bits of information from a message.",
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
    readiness_check_vi: "Có thể đưa vào message-comprehension flow.",
    readiness_check_en: "Can be placed into the message-comprehension flow.",
  },
  {
    id: "pa_a2_final_service_flow",
    scenario: "service_flow",
    style: "final_readiness",
    title_vi: "Final readiness: service flow",
    title_en: "Final readiness: service flow",
    handoff_goal_vi: "Giữ kiểm tra tên, hỏi xong chưa, và hỏi bước tiếp theo.",
    handoff_goal_en: "Keep checking the name, asking if it is ready, and asking the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Service counter, front desk, library desk, và school office là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Service counter, front desk, library desk, and school office are very practical Canadian contexts.",
    selector_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Bộ này giữ chuỗi service flow: kiểm tra tên → hỏi xong chưa → hỏi bước tiếp theo.",
    explanation_en: "This set preserves the service flow chain: check the name → ask if it is ready → ask the next step.",
    traps: [
      {
        trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.",
        trap_en: "Do not omit the name or next step when following up.",
        fix_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        fix_romanization: "agla kadam ki hai?",
      },
    ],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    readiness_check_vi: "Có thể chuyển vào service flow pipeline.",
    readiness_check_en: "Can move into the service flow pipeline.",
  },
  {
    id: "pa_a2_final_interaction_repair",
    scenario: "interaction_repair",
    style: "regression",
    title_vi: "Regression: sửa tương tác",
    title_en: "Regression: interaction repair",
    handoff_goal_vi: "Giữ xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    handoff_goal_en: "Keep asking for repetition, asking for slower speech, and confirming understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    selector_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Regression này kiểm tra khả năng giữ repair phrases khi không nghe rõ.",
    explanation_en: "This regression checks the ability to keep repair phrases when the learner did not hear clearly.",
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
    readiness_check_vi: "Ổn để đưa vào interaction-repair flow.",
    readiness_check_en: "Stable enough for the interaction-repair flow.",
  },
];
