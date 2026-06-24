// src/languages/punjabi/retentionReviewA2.ts
//
// Punjabi A2 retention review for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiRetentionReviewA2Scenario =
  | "daily_routine"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "short_messages"
  | "forms"
  | "polite_repair_phrases"
  | "service_counter_follow_up";

export type PunjabiRetentionReviewA2Style =
  | "final_hardening"
  | "export_readiness"
  | "review"
  | "regression";

export type PunjabiRetentionReviewA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiRetentionReviewA2Trap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiRetentionReviewA2Item = {
  id: string;
  scenario: PunjabiRetentionReviewA2Scenario;
  style: PunjabiRetentionReviewA2Style;
  title_vi: string;
  title_en: string;
  review_goal_vi: string;
  review_goal_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  evidence_lines: PunjabiRetentionReviewA2Line[];
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
  traps: PunjabiRetentionReviewA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  export_check_vi: string;
  export_check_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong retention review; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this retention review; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const retentionReviewA2: PunjabiRetentionReviewA2Item[] = [
  {
    id: "pa_a2_review_daily_routine",
    scenario: "daily_routine",
    style: "review",
    title_vi: "Review: thói quen hằng ngày",
    title_en: "Review: daily routine",
    review_goal_vi: "Giữ được giờ, thói quen sáng, và một câu quá khứ ngắn.",
    review_goal_en: "Retain clock time, a morning routine, and one short past sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    evidence_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main kamm te jandi haan.", vi: "Rồi tôi đi làm.", en: "Then I go to work." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Mẫu này harden nhịp habitual + past để người học không bị trượt sang tiếng Anh/Việt khi kể lại.",
    explanation_en: "This hardens the habitual + past rhythm so the learner does not slide into English/Vietnamese structure when recounting.",
    traps: [{ trap_vi: "Người nói nữ không dùng ਜਾਂਦਾ/ਉੱਠਦਾ.", trap_en: "A female speaker does not use ਜਾਂਦਾ/ਉੱਠਦਾ.", fix_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", fix_romanization: "main jandi haan." }],
    pass_signal_vi: "Có giờ, habitual, và một quá khứ rõ ràng.",
    pass_signal_en: "Has time, habitual, and one clear past sentence.",
    export_check_vi: "Đủ sạch để xuất sang thẻ ôn tập hoặc prompt cho app.",
    export_check_en: "Clean enough to export into review cards or app prompts.",
  },
  {
    id: "pa_a2_review_appointments",
    scenario: "appointments",
    style: "export_readiness",
    title_vi: "Export readiness: lịch hẹn",
    title_en: "Export readiness: appointments",
    review_goal_vi: "Giữ được lịch cũ, lịch mới, và giấy tờ cần mang.",
    review_goal_en: "Retain the old time, the new time, and the document to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Thực tế cho clinic, dentist, school office, hoặc settlement office ở Canada.",
    canada_practical_en: "Practical for clinics, dentists, school offices, or settlement offices in Canada.",
    evidence_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakdi haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nữ)", en: "Can I make it Friday at three? (female speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗੀ।", romanization: "main health card naal liaavangi.", vi: "Tôi sẽ mang thẻ y tế. (nữ)", en: "I will bring the health card. (female speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Lịch mới khi nào?", q_en: "New appointment time?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", answer_romanization: "shukkarvaar tinn vaje", answer_vi: "Thứ Sáu lúc ba giờ.", answer_en: "Friday at three." },
    ],
    explanation_vi: "Mẫu này sẵn sàng để xuất sang app vì giữ được time, day, modal, và document.",
    explanation_en: "This is ready to export because it retains time, day, modal, and document information.",
    traps: [{ trap_vi: "Đừng bỏ marker giờ ਵਜੇ.", trap_en: "Do not drop the clock marker ਵਜੇ.", fix_pa: "ਤਿੰਨ ਵਜੇ", fix_romanization: "tinn vaje" }],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ.",
    pass_signal_en: "Includes old time, new time, and the document.",
    export_check_vi: "Có thể dùng ngay cho reschedule prompt hoặc card review.",
    export_check_en: "Can be used immediately for a reschedule prompt or review card.",
  },
  {
    id: "pa_a2_review_transport",
    scenario: "transport",
    style: "final_hardening",
    title_vi: "Final hardening: đi lại",
    title_en: "Final hardening: transport",
    review_goal_vi: "Giữ được route question, stop question, và delay phrase.",
    review_goal_en: "Retain the route question, stop question, and delay phrase.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, stop, và platform.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, stops, and platforms.",
    evidence_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Đây là bước hardening vì learner phải giữ được question pattern và delay phrase khi nói nhanh.",
    explanation_en: "This is hardening because the learner must keep the question pattern and delay phrase under speed pressure.",
    traps: [{ trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có route, stop, và delay.",
    pass_signal_en: "Has route, stop, and delay.",
    export_check_vi: "Đủ rõ để xuất sang đợt review tiếp theo.",
    export_check_en: "Clear enough to export into the next review cycle.",
  },
  {
    id: "pa_a2_review_housing",
    scenario: "housing",
    style: "review",
    title_vi: "Review: nhà ở",
    title_en: "Review: housing",
    review_goal_vi: "Giữ được opener lịch sự, vấn đề, thời điểm, và yêu cầu xem.",
    review_goal_en: "Retain the polite opener, problem, timing, and request for a check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nhắn landlord/building manager về heater, leak, hoặc laundry.",
    canada_practical_en: "Useful when messaging a landlord/building manager about a heater, leak, or laundry.",
    evidence_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Mẫu giữ được thời gian và yêu cầu, tránh rơi mất thông tin khi nhắn gấp.",
    explanation_en: "The sample keeps timing and request information intact, avoiding data loss in a rushed message.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà thiếu timing.", trap_en: "Do not say only 'problem' without timing.", fix_pa: "ਸਵੇਰੇ ਤੋਂ", fix_romanization: "savere ton" }],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    export_check_vi: "Có thể chuyển thành template nhắn landlord rất nhanh.",
    export_check_en: "Can be turned into a landlord message template quickly.",
  },
  {
    id: "pa_a2_review_school",
    scenario: "school",
    style: "export_readiness",
    title_vi: "Export readiness: trường học",
    title_en: "Export readiness: school",
    review_goal_vi: "Giữ được absence sentence, fever reason, và homework request.",
    review_goal_en: "Retain the absence sentence, fever reason, and homework request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi gọi school office hoặc nhắn giáo viên tại Canada.",
    canada_practical_en: "Usable when calling a Canadian school office or messaging a teacher.",
    evidence_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Mẫu này chuẩn bị để xuất sang app hoặc gửi cho teacher mà không phải sửa thêm nhiều.",
    explanation_en: "This is prepared for app export or sending to a teacher with minimal editing.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ theo danh từ sau, không theo phụ huynh.", trap_en: "ਮੇਰਾ/ਮੇਰੀ follows the noun, not the parent.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" }],
    pass_signal_vi: "Câu có absence, fever, và homework.",
    pass_signal_en: "Has absence, fever, and homework.",
    export_check_vi: "Có thể chuyển trực tiếp thành school-office script.",
    export_check_en: "Can be converted directly into a school-office script.",
  },
  {
    id: "pa_a2_review_childcare",
    scenario: "childcare",
    style: "final_hardening",
    title_vi: "Final hardening: childcare",
    title_en: "Final hardening: childcare",
    review_goal_vi: "Giữ được giờ đón, người đón thay, và pickup list.",
    review_goal_en: "Retain pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp daycare/after-school care khi có pickup list.",
    canada_practical_en: "Fits daycare/after-school care when there is a pickup list.",
    evidence_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Có trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Đây là hardening vì thông tin đón trẻ phải rõ và an toàn.",
    explanation_en: "This is hardening because pickup information must be clear and safe.",
    traps: [{ trap_vi: "Không bỏ giờ đón trong tin nhắn childcare.", trap_en: "Do not omit the pickup time in a childcare message.", fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ", fix_romanization: "panj vaje lain aavegi" }],
    pass_signal_vi: "Có thời gian, người đón, và list.",
    pass_signal_en: "Has time, picker, and list.",
    export_check_vi: "Đủ sẵn cho pickup-list style note.",
    export_check_en: "Ready for a pickup-list style note.",
  },
  {
    id: "pa_a2_review_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "review",
    title_vi: "Review: small talk nơi làm",
    title_en: "Review: workplace small talk",
    review_goal_vi: "Giữ được greeting, polite possessive, và chuyển lại công việc.",
    review_goal_en: "Retain greeting, polite possessive, and transition back to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    evidence_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Câu quay lại công việc?", q_en: "Return-to-work line?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Mẫu này giúp learner không bị mắc kẹt ở small talk và vẫn quay về công việc được.",
    explanation_en: "This helps the learner avoid getting stuck in small talk and return to work.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có greeting, polite possessive, và transition.",
    pass_signal_en: "Has greeting, polite possessive, and transition.",
    export_check_vi: "Có thể dùng ngay trong workplace review flow.",
    export_check_en: "Can be used immediately in a workplace review flow.",
  },
  {
    id: "pa_a2_review_short_messages",
    scenario: "short_messages",
    style: "export_readiness",
    title_vi: "Export readiness: tin nhắn ngắn",
    title_en: "Export readiness: short messages",
    review_goal_vi: "Lấy được giờ, nơi, và đồ cần mang từ một tin nhắn ngắn.",
    review_goal_en: "Extract time, place, and item to bring from a short message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school notice, library class, settlement class, hoặc training note.",
    canada_practical_en: "Usable with school notices, library classes, settlement classes, or training notes.",
    evidence_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Mẫu này nhấn vào export-ready parsing của một thông báo ngắn.",
    explanation_en: "This emphasizes export-ready parsing of a short notice.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" }],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    export_check_vi: "Có thể chuyển sang card về comprehension ngay.",
    export_check_en: "Can be converted into a comprehension card immediately.",
  },
  {
    id: "pa_a2_review_forms",
    scenario: "forms",
    style: "final_hardening",
    title_vi: "Final hardening: forms",
    title_en: "Final hardening: forms",
    review_goal_vi: "Giữ được tên, địa chỉ, ngày giờ, và cách hỏi lại khi thiếu giấy tờ.",
    review_goal_en: "Retain name, address, date/time, and how to ask again when a document is missing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for clinic, school office, library card, and Service Canada style counters.",
    canada_practical_en: "Useful for clinic, school office, library card, and Service Canada style counters.",
    evidence_lines: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman." },
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document." },
    ],
    final_qa: [
      { q_vi: "Tên?", q_en: "Name?", answer_pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", answer_romanization: "mera naam aman hai.", answer_vi: "Tên tôi là Aman.", answer_en: "My name is Aman." },
      { q_vi: "Tài liệu thiếu?", q_en: "Missing document?", answer_pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", answer_romanization: "mere kol eh dastavez nahi hai.", answer_vi: "Tôi không có giấy tờ này.", answer_en: "I do not have this document." },
    ],
    explanation_vi: "Mẫu này harden các mảnh form nền tảng để người học không rơi mất khi điền giấy tờ thật.",
    explanation_en: "This hardens the core form pieces so the learner does not lose them in a real form-filling task.",
    traps: [{ trap_vi: "ਪਤਾ trong form là địa chỉ, không phải 'biết'.", trap_en: "ਪਤਾ on a form means address, not 'know'.", fix_pa: "ਮੇਰਾ ਪਤਾ", fix_romanization: "mera pata" }],
    pass_signal_vi: "Có name, address, và missing document.",
    pass_signal_en: "Has name, address, and missing document.",
    export_check_vi: "Dễ xuất sang form-fill readiness deck.",
    export_check_en: "Easy to export into a form-fill readiness deck.",
  },
  {
    id: "pa_a2_review_polite_repair_phrases",
    scenario: "polite_repair_phrases",
    style: "regression",
    title_vi: "Regression: repair phrases lịch sự",
    title_en: "Regression: polite repair phrases",
    review_goal_vi: "Giữ được xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    review_goal_en: "Retain asking for repetition, slower speech, and understanding confirmation.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    evidence_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Đây là regression vì nếu learner mất repair phrases thì toàn bộ giao tiếp A2 dễ gãy.",
    explanation_en: "This is a regression point because if the learner loses repair phrases, the whole A2 interaction can break down.",
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    export_check_vi: "Có thể đẩy thẳng vào regression test card.",
    export_check_en: "Can be pushed directly into a regression test card.",
  },
  {
    id: "pa_a2_review_service_counter_follow_up",
    scenario: "service_counter_follow_up",
    style: "export_readiness",
    title_vi: "Export readiness: follow-up quầy dịch vụ",
    title_en: "Export readiness: service-counter follow-up",
    review_goal_vi: "Giữ được tên, thời gian xử lý, và bước tiếp theo khi hỏi lại ở quầy.",
    review_goal_en: "Retain name, processing time, and next step when following up at a counter.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở service counter, front desk, library desk, hoặc school office.",
    canada_practical_en: "Usable at a service counter, front desk, library desk, or school office.",
    evidence_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Mẫu này chuẩn bị learner cho follow-up thật ở quầy dịch vụ, nơi thông tin hay bị nói rất nhanh.",
    explanation_en: "This prepares the learner for real counter follow-up, where information is often spoken quickly.",
    traps: [{ trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.", trap_en: "Do not omit the name or next step when following up.", fix_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", fix_romanization: "agla kadam ki hai?" }],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    export_check_vi: "Có thể xuất thành follow-up card ngay.",
    export_check_en: "Can be exported as a follow-up card immediately.",
  },
];
