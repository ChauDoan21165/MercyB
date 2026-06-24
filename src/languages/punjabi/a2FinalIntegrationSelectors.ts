// src/languages/punjabi/a2FinalIntegrationSelectors.ts
//
// Punjabi A2 final integration selectors for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiA2FinalIntegrationSelectorScenario =
  | "daily_life"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "forms"
  | "short_messages"
  | "interaction_repair"
  | "service_flow_guards";

export type PunjabiA2FinalIntegrationSelectorStyle =
  | "selector"
  | "pre_integration"
  | "final_readiness"
  | "regression";

export type PunjabiA2FinalIntegrationSelectorLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiA2FinalIntegrationSelectorTrap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiA2FinalIntegrationSelectorItem = {
  id: string;
  scenario: PunjabiA2FinalIntegrationSelectorScenario;
  style: PunjabiA2FinalIntegrationSelectorStyle;
  title_vi: string;
  title_en: string;
  selector_goal_vi: string;
  selector_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  selector_lines: PunjabiA2FinalIntegrationSelectorLine[];
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
  traps: PunjabiA2FinalIntegrationSelectorTrap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  integration_note_vi: string;
  integration_note_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong final integration selectors; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these final integration selectors; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const a2FinalIntegrationSelectors: PunjabiA2FinalIntegrationSelectorItem[] = [
  {
    id: "pa_a2_selector_daily_life",
    scenario: "daily_life",
    style: "selector",
    title_vi: "Selector: đời sống hằng ngày",
    title_en: "Selector: daily life",
    selector_goal_vi: "Giữ câu cơ bản về giờ, thói quen, và một việc đã làm.",
    selector_goal_en: "Keep basic sentences for time, routine, and one completed action.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    selector_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main kamm te jandi haan.", vi: "Rồi tôi đi làm.", en: "Then I go to work." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Selector này làm điểm neo đầu tiên cho toàn bộ A2: giờ, habitual, và past.",
    explanation_en: "This selector acts as the first anchor for all of A2: time, habitual, and past.",
    traps: [{ trap_vi: "Người nói nữ không dùng ਜਾਂਦਾ/ਉੱਠਦਾ.", trap_en: "A female speaker does not use ਜਾਂਦਾ/ਉੱਠਦਾ.", fix_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", fix_romanization: "main jandi haan." }],
    pass_signal_vi: "Có giờ, habitual, và một quá khứ rõ ràng.",
    pass_signal_en: "Has time, habitual, and one clear past sentence.",
    integration_note_vi: "Đủ sạch để đi vào integration layer như một selector mẫu.",
    integration_note_en: "Clean enough to enter the integration layer as a selector sample.",
  },
  {
    id: "pa_a2_selector_appointments",
    scenario: "appointments",
    style: "pre_integration",
    title_vi: "Pre-integration: lịch hẹn",
    title_en: "Pre-integration: appointments",
    selector_goal_vi: "Giữ đúng lịch cũ, lịch mới, và giấy tờ cần mang.",
    selector_goal_en: "Keep the old time, the new time, and the document to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, school office, và settlement office là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Clinic, dentist, school office, and settlement office are practical Canadian contexts.",
    selector_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I make it Friday at three? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Giấy tờ gì?", q_en: "Which document?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu này làm pre-integration vì nó ghép lịch, đổi lịch, và giấy tờ trong một flow gọn.",
    explanation_en: "This is pre-integration because it combines the appointment, reschedule, and document in one compact flow.",
    traps: [{ trap_vi: "Đừng bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", fix_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", fix_romanization: "shukkarvaar tinn vaje" }],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ theo thứ tự rõ.",
    pass_signal_en: "Has the old time, new time, and document in a clear order.",
    integration_note_vi: "Sẵn sàng đưa vào appointment integration path.",
    integration_note_en: "Ready for the appointment integration path.",
  },
  {
    id: "pa_a2_selector_transport",
    scenario: "transport",
    style: "final_readiness",
    title_vi: "Final readiness: đi lại",
    title_en: "Final readiness: transport",
    selector_goal_vi: "Giữ route question, stop question, và delay phrase.",
    selector_goal_en: "Keep the route question, stop question, and delay phrase.",
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
    explanation_vi: "Selector này là điểm cuối cho transport vì nó giữ được hỏi đường và báo trễ.",
    explanation_en: "This selector is the endpoint for transport because it retains route asking and delay reporting.",
    traps: [{ trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có route, stop, và delay theo đúng trình tự.",
    pass_signal_en: "Has route, stop, and delay in the correct sequence.",
    integration_note_vi: "Có thể đi thẳng vào transit selector layer.",
    integration_note_en: "Can go straight into the transit selector layer.",
  },
  {
    id: "pa_a2_selector_housing",
    scenario: "housing",
    style: "regression",
    title_vi: "Regression: nhà ở",
    title_en: "Regression: housing",
    selector_goal_vi: "Giữ opener lịch sự, nêu vấn đề, thời điểm, và yêu cầu xem.",
    selector_goal_en: "Keep the polite opener, problem, timing, and request to check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Nhắn landlord/building manager về heater, leak, hoặc laundry là ngữ cảnh Canada thực tế.",
    canada_practical_en: "Messaging a landlord/building manager about a heater, leak, or laundry is a practical Canadian context.",
    selector_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Regression ở đây là đảm bảo người học không bỏ timing và request khi rút gọn.",
    explanation_en: "The regression point here is ensuring the learner does not drop timing and request when compacting.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà thiếu timing.", trap_en: "Do not say only 'problem' without timing.", fix_pa: "ਸਵੇਰੇ ਤੋਂ", fix_romanization: "savere ton" }],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    integration_note_vi: "Sẵn sàng cho landlord message integration.",
    integration_note_en: "Ready for landlord message integration.",
  },
  {
    id: "pa_a2_selector_school",
    scenario: "school",
    style: "final_readiness",
    title_vi: "Final readiness: trường học",
    title_en: "Final readiness: school",
    selector_goal_vi: "Giữ câu vắng học, lý do sốt, và hỏi homework.",
    selector_goal_en: "Keep the absence sentence, fever reason, and homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School office hoặc teacher messages là ngữ cảnh Canada thường gặp.",
    canada_practical_en: "School office or teacher messages are common Canadian contexts.",
    selector_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Selector này là điểm cuối cho school absence vì nó giữ đúng absence + fever + homework.",
    explanation_en: "This selector is the endpoint for school absence because it retains absence + fever + homework.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ phải theo danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ must follow the noun.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" }],
    pass_signal_vi: "Có absence, reason, và homework.",
    pass_signal_en: "Has absence, reason, and homework.",
    integration_note_vi: "Có thể dùng thẳng trong school office path.",
    integration_note_en: "Can be used directly in the school office path.",
  },
  {
    id: "pa_a2_selector_childcare",
    scenario: "childcare",
    style: "pre_integration",
    title_vi: "Pre-integration: childcare",
    title_en: "Pre-integration: childcare",
    selector_goal_vi: "Giữ giờ đón, người đón thay, và pickup list.",
    selector_goal_en: "Keep pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/after-school pickup list là ngữ cảnh Canada rất thực tế.",
    canada_practical_en: "Daycare/after-school pickup lists are very practical Canadian contexts.",
    selector_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Có trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Mẫu này pre-integration vì nó ghép giờ đón, người đón, và danh sách an toàn.",
    explanation_en: "This is pre-integration because it combines pickup time, alternate person, and safety list.",
    traps: [{ trap_vi: "Đừng bỏ giờ đón trong childcare message.", trap_en: "Do not omit the pickup time in a childcare message.", fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ", fix_romanization: "panj vaje lain aavegi" }],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    integration_note_vi: "Sẵn sàng cho childcare integration flow.",
    integration_note_en: "Ready for the childcare integration flow.",
  },
  {
    id: "pa_a2_selector_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "final_readiness",
    title_vi: "Integration readiness: small talk nơi làm",
    title_en: "Integration readiness: workplace small talk",
    selector_goal_vi: "Giữ chào hỏi, small talk ngắn, rồi quay lại công việc.",
    selector_goal_en: "Keep greeting, brief small talk, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    selector_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Quay lại công việc?", q_en: "Return to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Selector này giữ cho small talk có điểm dừng và quay về work đúng lúc.",
    explanation_en: "This selector keeps small talk bounded and returns to work at the right time.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    integration_note_vi: "Dễ đi vào workplace selector stream.",
    integration_note_en: "Easy to enter the workplace selector stream.",
  },
  {
    id: "pa_a2_selector_forms",
    scenario: "forms",
    style: "final_readiness",
    title_vi: "Final readiness: mẫu đơn",
    title_en: "Final readiness: forms",
    selector_goal_vi: "Giữ tên, địa chỉ, và cách nói thiếu giấy tờ.",
    selector_goal_en: "Keep the name, address, and missing-document phrase.",
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
    explanation_vi: "Selector này giữ form core trong dạng xuất cuối cùng.",
    explanation_en: "This selector keeps the form core in its final exportable form.",
    traps: [{ trap_vi: "ਪਤਾ trên form là địa chỉ, không phải 'biết'.", trap_en: "ਪਤਾ on a form means address, not 'know'.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" }],
    pass_signal_vi: "Có name, address, và missing document theo đúng thứ tự.",
    pass_signal_en: "Has name, address, and missing document in the right order.",
    integration_note_vi: "Sẵn sàng cho form-fill integration path.",
    integration_note_en: "Ready for the form-fill integration path.",
  },
  {
    id: "pa_a2_selector_short_messages",
    scenario: "short_messages",
    style: "pre_integration",
    title_vi: "Pre-integration: tin nhắn ngắn",
    title_en: "Pre-integration: short messages",
    selector_goal_vi: "Lấy ngày, giờ, nơi, và đồ cần mang từ tin nhắn ngắn.",
    selector_goal_en: "Extract day, time, place, and item to bring from a short message.",
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
    explanation_vi: "Pre-integration vì tin nhắn chỉ cần tóm đúng các mảnh chính.",
    explanation_en: "Pre-integration because the message only needs its key pieces to be extracted.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" }],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    integration_note_vi: "Có thể đi thẳng vào message-comprehension integration.",
    integration_note_en: "Can go straight into message-comprehension integration.",
  },
  {
    id: "pa_a2_selector_interaction_repair",
    scenario: "interaction_repair",
    style: "final_readiness",
    title_vi: "Final readiness: sửa tương tác",
    title_en: "Final readiness: interaction repair",
    selector_goal_vi: "Giữ được xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    selector_goal_en: "Keep asking for repetition, asking for slower speech, and confirming understanding.",
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
    explanation_vi: "Selector này là mảnh cuối cho repair: hỏi lại, nói chậm, xác nhận.",
    explanation_en: "This selector is the final piece for repair: ask again, slow down, confirm.",
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    integration_note_vi: "Sẵn sàng cho interaction-repair integration path.",
    integration_note_en: "Ready for the interaction-repair integration path.",
  },
  {
    id: "pa_a2_selector_service_flow_guards",
    scenario: "service_flow_guards",
    style: "final_readiness",
    title_vi: "Integration readiness: service flow guards",
    title_en: "Integration readiness: service flow guards",
    selector_goal_vi: "Giữ thứ tự: kiểm tra tên, hỏi xong chưa, hỏi bước tiếp theo.",
    selector_goal_en: "Keep the order: check the name, ask if it is ready, ask the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp service counter, front desk, library desk, và school office ở Canada.",
    canada_practical_en: "Fits service counter, front desk, library desk, and school office in Canada.",
    selector_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Selector này là lớp cuối cho service flow guards, giữ follow-up cực ngắn và rõ.",
    explanation_en: "This selector is the final layer for service flow guards, keeping the follow-up very short and clear.",
    traps: [{ trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.", trap_en: "Do not omit the name or next step when following up.", fix_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", fix_romanization: "agla kadam ki hai?" }],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    integration_note_vi: "Có thể đi vào service-flow integration pipeline ngay.",
    integration_note_en: "Can enter the service-flow integration pipeline immediately.",
  },
];
